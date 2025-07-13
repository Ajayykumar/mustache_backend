import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    details: { type: String }, // ✅ new
    brand: { type: String },    // ✅ new
    size: { type: String },     // ✅ new (S,L,XL etc.)
    price: { type: Number, required: true },
    image: { type: String }, // will store filename
    category: { type: String },
    stock: { type: Number, default: 0 },
    shopkeeperId:{type: Number}
  },
  { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

export default Product
