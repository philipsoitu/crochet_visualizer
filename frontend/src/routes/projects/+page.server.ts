import { redirect } from '@sveltejs/kit';
import { connectDB } from '../../db';
import { Model } from '$lib/models/Model';
import mongoose from 'mongoose';

export async function load({ locals }) {
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  await connectDB();

  const userId = locals.user.sub;

 const models = await Model.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    user: locals.user,
    models: models.map((m) => ({
      ...m,
      _id: m._id.toString(),
      stl: m.stl
        ? {
            ...m.stl,
            fileId: m.stl.fileId?.toString()
          }
        : null,
      audio: m.audio
        ? {
            ...m.audio,
            fileId: m.audio.fileId?.toString()
          }
        : null
    }))
  };
}
