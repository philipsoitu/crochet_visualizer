import { error, fail, redirect } from '@sveltejs/kit';
import { connectDB } from '../../../db';
import { Model } from '$lib/models/Model';

export async function load({ params, parent }) {
  const { models, user } = await parent(); // <-- reuse layout data

  const model = models.find((m) => m._id === params.id);

  if (!model) throw error(404, 'Project not found');

  // optional safety check (should already be filtered in layout)
  if (model.userId !== user.sub) throw error(403, 'Not allowed');

  return { model };
}

export const actions = {
  generate: async ({ request, params, locals }) => {
    if (!locals.user) throw redirect(302, '/auth/login');

    await connectDB();
    const userId = locals.user.sub;

    // Load the model directly from database
    const model = await Model.findById(params.id).lean();

    if (!model) throw error(404, 'Project not found');
    if (model.userId !== userId) throw error(403, 'Not allowed');

    const formData = await request.formData();
    const modelName = formData.get('modelName')?.toString();
    const layerHeight = parseFloat(formData.get('layerHeight')?.toString() || '2.0');
    const stitchWidth = parseFloat(formData.get('stitchWidth')?.toString() || '3.0');
    const magicRingStitches = parseInt(formData.get('magicRingStitches')?.toString() || '6');
    const modelFile = formData.get('modelFile') as File | null;

    // Validation
    if (!modelName || modelName.trim() === '') {
      return fail(400, {
        error: 'Project name is required',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }

    if (isNaN(layerHeight) || layerHeight <= 0) {
      return fail(400, {
        error: 'Layer height must be a positive number',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }

    if (isNaN(stitchWidth) || stitchWidth <= 0) {
      return fail(400, {
        error: 'Stitch width must be a positive number',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }

    if (isNaN(magicRingStitches) || magicRingStitches < 1) {
      return fail(400, {
        error: 'Magic ring stitches must be at least 1',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }

    // Check if we have a file to generate pattern from
    if (!modelFile || modelFile.size === 0) {
      // No file uploaded, just update settings
      try {
        await Model.findByIdAndUpdate(
          params.id,
          {
            modelName: modelName.trim(),
            layerHeight,
            stitchWidth,
            magicRingStitches
          },
          { new: true }
        );

        return {
          success: true,
          message: 'Settings updated successfully. Upload a 3D model file to generate pattern.',
          modelName,
          layerHeight,
          stitchWidth,
          magicRingStitches
        };
      } catch (error: any) {
        console.error('Error updating project:', error);
        return fail(500, {
          error: error?.message || 'Failed to update project. Please try again.',
          modelName,
          layerHeight,
          stitchWidth,
          magicRingStitches
        });
      }
    }

    // Validate file type
    const fileName = modelFile.name.toLowerCase();
    if (!fileName.endsWith('.stl') && !fileName.endsWith('.obj')) {
      return fail(400, {
        error: 'File must be .stl or .obj format',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }

    try {
      // Prepare form data for FastAPI backend
      const backendFormData = new FormData();
      backendFormData.append('file', modelFile);
      backendFormData.append('layer_height', layerHeight.toString());
      backendFormData.append('stitch_width', stitchWidth.toString());
      backendFormData.append('magic_ring_stitches', magicRingStitches.toString());

      // Call FastAPI backend to generate pattern
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/generate-pattern`, {
        method: 'POST',
        body: backendFormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to generate pattern' }));
        throw new Error(errorData.detail || `Backend error: ${response.statusText}`);
      }

      const patternResult = await response.json();
      
      // Extract pattern array from response
      // The backend returns { pattern: [...], settings: {...}, appendages: [...] }
      const patternOutput = patternResult.pattern || [];

      // Save file to MongoDB GridFS (if GridFS is set up)
      // For now, we'll store file metadata
      // TODO: Implement GridFS file storage if needed
      const mongoose = await import('mongoose');
      const GridFSBucket = mongoose.default.mongo.GridFSBucket;
      
      let fileId = model.stl?.fileId;
      
      // If GridFS is available, save the file
      try {
        const db = mongoose.default.connection.db;
        if (db) {
          const bucket = new GridFSBucket(db, { bucketName: 'files' });
          const uploadStream = bucket.openUploadStream(modelFile.name);
          
          const fileBuffer = Buffer.from(await modelFile.arrayBuffer());
          uploadStream.end(fileBuffer);
          
          await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
          });
          
          fileId = uploadStream.id;
        }
      } catch (gridfsError) {
        console.warn('GridFS not available or error saving file:', gridfsError);
        // Continue without file storage - fileId will remain unchanged
      }

      // Update model with new settings, pattern output, and file info
      const updateData: any = {
        modelName: modelName.trim(),
        layerHeight,
        stitchWidth,
        magicRingStitches,
        output: patternOutput
      };

      // Update STL file info if we have a new file
      if (fileId) {
        updateData.stl = {
          filename: modelFile.name,
          contentType: modelFile.type || 'application/octet-stream',
          fileId: fileId
        };
      }

      await Model.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true }
      );

      return {
        success: true,
        message: 'Pattern generated and saved successfully!',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      };
    } catch (error: any) {
      console.error('Error generating pattern:', error);

      return fail(500, {
        error: error?.message || 'Failed to generate pattern. Please try again.',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }
  }
};
