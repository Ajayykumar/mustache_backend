import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["client", "shopkeeper"], required: true },
  shopName: String,
  ownerName: String,
  city: String,
  district: String,
  otp: String,
  otpExpiresAt: Date,
})

const User = mongoose.model("User", userSchema)
export default User
