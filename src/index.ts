import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import productRoutes from "./routes/productRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Routes
app.get("/", (_req, res) => {
  res.send("Mustache API is running!")
})

app.use("/api/products", productRoutes)

// MongoDB Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
  })
