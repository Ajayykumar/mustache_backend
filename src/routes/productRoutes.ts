import express from "express"
import multer from "multer"
import path from "path"
import Product from "../models/Product"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/")
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
      id,
      title,
      price,
      stock,
      category,
      description,
      brand,
      size,
      details
    } = req.body

    const image = req.file?.filename || ""

    const newProduct = new Product({
      _id: id,
      title,
      price,
      stock,
      category,
      description,
      brand,
      size,
      details,
      image
    })

    const saved = await newProduct.save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("❌ Product creation failed:", error)
    res.status(500).json({ message: "Product creation failed" })
  }
})

export default router
  