import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
  const { models, user } = await parent(); // <-- reuse layout data

  const model = models.find((m) => m._id === params.id);

  if (!model) throw error(404, 'Project not found');

  // optional safety check (should already be filtered in layout)
  if (model.userId !== user.sub) throw error(403, 'Not allowed');

  return { model };
}
