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

    try {
      // Update settings in database
      const updatedModel = await Model.findByIdAndUpdate(
        params.id,
        {
          modelName: modelName.trim(),
          layerHeight,
          stitchWidth,
          magicRingStitches
        },
        { new: true }
      );

      // If there's an STL file, try to regenerate the pattern
      let patternOutput = updatedModel.output || [];
      
      if (model.stl && model.stl.fileId) {
        try {
          // Note: This would require retrieving the file from GridFS and calling the backend API
          // For now, we'll just save the settings
          // Pattern regeneration would require the file to be re-uploaded or accessible
          console.log('STL file exists, but pattern regeneration requires file access');
        } catch (patternError) {
          console.error('Error generating pattern:', patternError);
          // Continue with saving settings even if pattern generation fails
        }
      }

      return {
        success: true,
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
};
