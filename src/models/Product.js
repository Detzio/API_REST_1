const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire."],
      min: [0, "Le prix doit être positif ou nul."],
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire."],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Product", productSchema);
