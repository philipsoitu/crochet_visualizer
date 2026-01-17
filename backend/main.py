import trimesh
import numpy as np
from shapely.geometry import Polygon

# =============================
# Mesh utilities
# =============================

def load_and_normalize_mesh(path: str) -> trimesh.Trimesh:
    mesh = trimesh.load(path)

    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError("Invalid mesh file")

    if not mesh.is_watertight:
        raise ValueError("Mesh must be watertight")

    # Center mesh
    mesh.apply_translation(-mesh.centroid)

    # Normalize height to 1.0
    z_min, z_max = mesh.bounds[:, 2]
    height = z_max - z_min
    mesh.apply_scale(1.0 / height)

    return mesh


# =============================
# Slicing
# =============================

def slice_mesh(mesh, z, tol=1e-6):
    section = mesh.section(
        plane_origin=[0, 0, z],
        plane_normal=[0, 0, 1]
    )

    if section is None:
        return []

    path2d, _ = section.to_planar()

    contours = []

    for entity in path2d.entities:
        # entity.points are indices into path2d.vertices
        coords = path2d.vertices[entity.points]

        if len(coords) >= 3:
            poly = Polygon(coords)
            if poly.area > tol:
                contours.append(poly)

    return contours

def generate_slices(mesh, layer_height=0.02):
    z_min, z_max = mesh.bounds[:, 2]
    z_levels = np.arange(z_min, z_max, layer_height)

    slices = []
    for z in z_levels:
        contours = slice_mesh(mesh, z)
        slices.append({
            "z": float(z),
            "contours": contours
        })

    return slices


# =============================
# Part detection
# =============================

def contour_signature(poly: Polygon):
    return {
        "area": poly.area,
        "perimeter": poly.length,
        "centroid": np.array(poly.centroid.coords[0])
    }


def detect_parts(slices):
    parts = []
    next_id = 0

    for i, sl in enumerate(slices):
        contours = sl["contours"]
        if not contours:
            continue

        sigs = [contour_signature(c) for c in contours]

        # Sort contours by area (largest first)
        order = sorted(range(len(sigs)), key=lambda i: sigs[i]["area"], reverse=True)

        for idx in order:
            sig = sigs[idx]
            assigned = False

            for part in parts:
                last = part["history"][-1]
                dist = np.linalg.norm(sig["centroid"] - last["centroid"])

                # Heuristic: same part if centroids are close
                if dist < 0.1:
                    part["history"].append({
                        **sig,
                        "slice": i
                    })
                    assigned = True
                    break

            if not assigned:
                parts.append({
                    "id": next_id,
                    "history": [{
                        **sig,
                        "slice": i
                    }]
                })
                next_id += 1

    return parts


def classify_parts(parts):
    avg_areas = [
        np.mean([h["area"] for h in p["history"]])
        for p in parts
    ]

    body_idx = int(np.argmax(avg_areas))

    body = parts[body_idx]
    appendages = [
        p for i, p in enumerate(parts)
        if i != body_idx
    ]

    return body, appendages


# =============================
# Stitch logic
# =============================

def contour_to_stitches(perimeter, stitch_width=0.05):
    return max(3, round(perimeter / stitch_width))


def generate_stitch_rounds(part):
    rounds = []
    for h in part["history"]:
        stitches = contour_to_stitches(h["perimeter"])
        rounds.append(stitches)
    return rounds


# =============================
# Pretty printing
# =============================

def print_pattern(body, appendages):
    print("\n=== BODY ===")
    for i, stitches in enumerate(generate_stitch_rounds(body), start=1):
        print(f"Round {i}: {stitches} stitches")

    if appendages:
        print("\n=== APPENDAGES ===")
        for p in appendages:
            print(f"\nPart {p['id']} (attach at round {p['history'][0]['slice']}):")
            for i, stitches in enumerate(generate_stitch_rounds(p), start=1):
                print(f"  Round {i}: {stitches} stitches")


# =============================
# Main
# =============================

if __name__ == "__main__":
    # CHANGE THIS to your STL / OBJ file
    MESH_PATH = "sphere.stl"

    mesh = load_and_normalize_mesh(MESH_PATH)
    slices = generate_slices(mesh)
    parts = detect_parts(slices)

    body, appendages = classify_parts(parts)

    print_pattern(body, appendages)
