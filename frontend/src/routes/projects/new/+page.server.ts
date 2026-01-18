import { redirect, fail } from '@sveltejs/kit';
import { connectDB } from '../../../db';
import { Model } from '$lib/models/Model';

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/auth/login');
  return {};
}

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/auth/login');
    }

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
      await connectDB();
      const userId = locals.user.sub;

      // Create new model with default placeholder in output array
      // MongoDB validation may require at least one element in the array
      const savedModel = await Model.create({
        userId,
        modelName: modelName.trim(),
        layerHeight,
        stitchWidth,
        magicRingStitches,
        output: ['Pattern will be generated here'] // Start with placeholder
      });

      // Redirect to the new project's detail page
      throw redirect(303, `/projects/${savedModel._id.toString()}`);
    } catch (error: any) {
      // Check if it's a redirect (SvelteKit redirects have a status property between 300-399)
      if (error?.status >= 300 && error?.status < 400) {
        // Re-throw redirects so they work properly
        throw error;
      }

      console.error('Error creating project:', error);

      // Log detailed validation error if available
      if (error?.errInfo?.details) {
        console.error('Validation details:', JSON.stringify(error.errInfo.details, null, 2));
      }
      if (error?.code === 121) {
        console.error('MongoDB validation error:', error.errmsg);
      }

      return fail(500, {
        error: error?.errmsg || error?.message || 'Failed to create project. Please try again.',
        modelName,
        layerHeight,
        stitchWidth,
        magicRingStitches
      });
    }
  }
};

