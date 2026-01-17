import trimesh
import numpy as np
from shapely.geometry import Polygon

# =============================
# Configuration (like slicer settings)
# =============================

class CrochetSettings:
    def __init__(self):
        self.layer_height = 2.0  # mm per round
        self.stitch_width = 3.0  # mm per stitch
        self.magic_ring_stitches = 6  # starting stitches
        

# =============================
# Mesh utilities
# =============================

def load_mesh(path: str) -> trimesh.Trimesh:
    """Load mesh and keep original dimensions in mm"""
    mesh = trimesh.load(path)

    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError("Invalid mesh file")

    if not mesh.is_watertight:
        raise ValueError("Mesh must be watertight")

    return mesh


# =============================
# Slicing
# =============================

def slice_mesh(mesh, z, tol=1e-6):
    """Slice mesh at height z (in mm)"""
    section = mesh.section(
        plane_origin=[0, 0, z],
        plane_normal=[0, 0, 1]
    )

    if section is None:
        return []

    path2d, _ = section.to_planar()

    contours = []

    for entity in path2d.entities:
        coords = path2d.vertices[entity.points]

        if len(coords) >= 3:
            poly = Polygon(coords)
            if poly.area > tol:
                contours.append(poly)

    return contours


def generate_slices(mesh, settings: CrochetSettings):
    """Generate slices based on layer height"""
    z_min, z_max = mesh.bounds[:, 2]
    z_levels = np.arange(z_min, z_max, settings.layer_height)

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
    """Track contours through layers to identify separate parts"""
    parts = []
    next_id = 0

    for i, sl in enumerate(slices):
        contours = sl["contours"]
        if not contours:
            continue

        sigs = [contour_signature(c) for c in contours]

        # Sort by area (largest first)
        order = sorted(range(len(sigs)), key=lambda i: sigs[i]["area"], reverse=True)

        for idx in order:
            sig = sigs[idx]
            assigned = False

            for part in parts:
                last = part["history"][-1]
                dist = np.linalg.norm(sig["centroid"] - last["centroid"])

                # Same part if centroids are close
                if dist < 10.0:  # 10mm threshold
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
    """Identify main body and appendages"""
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
# Stitch calculation
# =============================

def perimeter_to_stitches(perimeter_mm, stitch_width):
    """Calculate stitches needed for a given perimeter, rounded to multiple of 6"""
    stitches = round(perimeter_mm / stitch_width)
    stitches = max(6, stitches)  # Minimum 6 stitches
    
    # Round to nearest multiple of 6 for symmetry
    stitches = round(stitches / 6) * 6
    
    return max(6, stitches)  # Ensure at least 6


def generate_stitch_pattern(part, settings: CrochetSettings):
    """Generate stitch counts for each round"""
    rounds = []
    for h in part["history"]:
        stitches = perimeter_to_stitches(h["perimeter"], settings.stitch_width)
        rounds.append(stitches)
    return rounds


def add_magic_ring_start(rounds, settings: CrochetSettings):
    """Force start with magic ring"""
    if not rounds:
        return [settings.magic_ring_stitches]
    
    # Start with magic ring
    result = [settings.magic_ring_stitches]
    
    # Just add the calculated rounds - they're already symmetric
    result.extend(rounds)
    return result


def add_closing_rounds(rounds, settings: CrochetSettings):
    """Force end with decreases to 6 stitches"""
    result = list(rounds)
    
    # Just let it end at 6 - the rounds are already calculated
    # Only add final round if needed
    if result[-1] != 6:
        result.append(6)
    
    return result


# =============================
# Pattern generation
# =============================

def generate_compact_notation(rounds):
    """Generate compact crochet notation"""
    instructions = []
    
    for i in range(len(rounds)):
        current = rounds[i]
        
        if i == 0:
            instructions.append("ring")
            continue
        
        prev = rounds[i-1]
        
        if current == prev:
            # No change - skip or could add if needed for clarity
            continue
        elif current > prev:
            # Increases
            inc_count = current - prev
            
            if inc_count == prev:
                # Double: 2 sc in each stitch
                instructions.append(f"sc{prev}inc")
            else:
                # Pattern of increases
                # Calculate spacing between increases
                spacing = prev // inc_count
                remainder = prev % inc_count
                
                if spacing == 0:
                    # More increases than original stitches
                    instructions.append(f"sc{prev}inc (add {inc_count - prev} more)")
                elif remainder == 0 and spacing > 0:
                    # Even distribution
                    pattern_sc = spacing - 1
                    if pattern_sc == 0:
                        instructions.append(f"sc{inc_count}inc")
                    else:
                        instructions.append(f"{inc_count}*[{pattern_sc}sc,sc2inc]")
                else:
                    # Uneven - build complex pattern
                    parts = []
                    sc_before = 0
                    remaining_sc = prev
                    remaining_inc = inc_count
                    
                    for _ in range(inc_count):
                        sc_in_section = remaining_sc // remaining_inc
                        if sc_in_section > 0:
                            parts.append(f"{sc_in_section}sc")
                        parts.append("sc2inc")
                        remaining_sc -= sc_in_section
                        remaining_inc -= 1
                    
                    instructions.append(",".join(parts))
        else:
            # Decreases
            dec_count = prev - current
            
            if dec_count == current:
                # Halve: sc2tog all around
                instructions.append(f"sc{current}tog")
            else:
                # Pattern of decreases
                spacing = current // dec_count
                remainder = current % dec_count
                
                if spacing == 0:
                    instructions.append(f"sc{dec_count}tog")
                elif remainder == 0 and spacing > 0:
                    # Even distribution
                    pattern_sc = spacing - 1
                    if pattern_sc == 0:
                        instructions.append(f"sc{dec_count}tog")
                    else:
                        instructions.append(f"{dec_count}*[{pattern_sc}sc,sc2tog]")
                else:
                    # Uneven - build pattern
                    parts = []
                    remaining_sc = current
                    remaining_dec = dec_count
                    
                    for _ in range(dec_count):
                        sc_in_section = remaining_sc // remaining_dec
                        if sc_in_section > 0:
                            parts.append(f"{sc_in_section}sc")
                        parts.append("sc2tog")
                        remaining_sc -= sc_in_section
                        remaining_dec -= 1
                    
                    instructions.append(",".join(parts))
    
    return instructions


# =============================
# Output
# =============================

def print_pattern(body, appendages, settings: CrochetSettings):
    """Print complete crochet pattern"""
    print("\n" + "="*50)
    print("CROCHET PATTERN")
    print("="*50)
    print(f"\nSettings:")
    print(f"  Layer height: {settings.layer_height} mm")
    print(f"  Stitch width: {settings.stitch_width} mm")
    print(f"  Magic ring: {settings.magic_ring_stitches} sc")
    
    print("\n" + "="*50)
    print("MAIN BODY")
    print("="*50)
    
    rounds = generate_stitch_pattern(body, settings)
    rounds = add_magic_ring_start(rounds, settings)
    rounds = add_closing_rounds(rounds, settings)
    
    instructions = generate_compact_notation(rounds)
    for inst in instructions:
        print(inst)
    
    if appendages:
        print("\n" + "="*50)
        print("APPENDAGES")
        print("="*50)
        
        for p in appendages:
            print(f"\n--- Part {p['id']} (attach at round {p['history'][0]['slice'] + 2}) ---")
            
            rounds = generate_stitch_pattern(p, settings)
            rounds = add_magic_ring_start(rounds, settings)
            rounds = add_closing_rounds(rounds, settings)
            
            instructions = generate_compact_notation(rounds)
            for inst in instructions:
                print(inst)


# =============================
# Main
# =============================

if __name__ == "__main__":
    # Configuration
    settings = CrochetSettings()
    settings.layer_height = 2.0  # mm between rounds
    settings.stitch_width = 3.0  # mm per stitch
    settings.magic_ring_stitches = 6
    
    # CHANGE THIS to your STL/OBJ file
    MESH_PATH = "sphere.stl"

    # Generate pattern
    mesh = load_mesh(MESH_PATH)
    slices = generate_slices(mesh, settings)
    parts = detect_parts(slices)
    body, appendages = classify_parts(parts)
    
    # Print pattern
    print_pattern(body, appendages, settings)
