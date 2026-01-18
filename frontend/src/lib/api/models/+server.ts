import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/db";
import { Model } from "$lib/models/Model";
import mongoose from "mongoose";

export async function POST({ request }) {
  await connectDB();

  const body = await request.json();

  const model = await Model.create({
    userId: new mongoose.Types.ObjectId(body.userId),
    modelName: body.modelName,
    layerHeight: body.layerHeight,
    stitchWidth: body.stitchWidth,
    magicRingStitches: body.magicRingStitches,
    output: body.output,
    stl: body.stl,
    audio: body.audio
  });

  return json(
    {
      ...model.toObject(),
      _id: model._id.toString()
    },
    { status: 201 }
  );
}
