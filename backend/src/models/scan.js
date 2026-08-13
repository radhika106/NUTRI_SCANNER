import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    imageName: {
      type: String,
      required: true,
    },

    imagePath: {
      type: String,
      required: true,
    },

    imageType: {
      type: String,
      required: true,
    },

    imageSize: {
      type: Number,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    ingredients: {
      type: [String],
      default: [],
    },

    nutrition: {
      type: Object,
      default: {},
    },

    healthScore: {
      type: Number,
      default: null,
    },

    aiExplanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
