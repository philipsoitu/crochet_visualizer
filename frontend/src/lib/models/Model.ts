import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const FileSchema = new Schema(
  {
    filename: String,
    contentType: String,
    fileId: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { _id: false }
);

const ModelSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    modelName: {
      type: String,
      required: true
    },

    layerHeight: {
      type: Number,
      required: true
    },

    stitchWidth: {
      type: Number,
      required: true
    },

    magicRingStitches: {
      type: Number,
      required: true
    },

    output: {
      type: [String],
      required: true
    },

    stl: FileSchema,
    audio: FileSchema
  },
  {
    timestamps: true,
    collection: "models" // 👈 explicitly name collection
  }
);

export const Model =
  models.Model || model("Model", ModelSchema);
