import express from "express"
import multer from "multer"
import path from "path"
import Product from "../models/Product"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/")
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

// POST /api/products
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      price,
      stock,
      category,
      description,
      brand,
      size,
      details,
      shopkeeperId
    } = req.body

    const image = req.file?.filename || ""

    const newProduct = new Product({
      title,
      price,
      stock,
      category,
      description,
      brand,
      size,
      details,
      shopkeeperId,
      image
    })

    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("❌ Product creation failed:", error)
    res.status(500).json({ message: "Product creation failed" })
  }
})

// GET /api/products - Get all products
router.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error("❌ Failed to fetch products:", error)
    res.status(500).json({ message: "Failed to fetch products" })
  }
})


export default router
  