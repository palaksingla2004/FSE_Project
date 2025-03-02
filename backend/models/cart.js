// const mongoose = require("mongoose")

// const cartSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//     items: [{
//       productId: { type: String, required: true },
//       size: { type: String, required: true },
//       quantity: { type: Number, required: true },
//     }],
//   },
// );

// module.exports = mongoose.model("Cart", cartSchema);
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

cartSchema.index({ username: 1 });

module.exports = mongoose.model("Cart", cartSchema);
