import { Request, Response } from "express"
import User from "../models/User"
import jwt from "jsonwebtoken"

// Generate a 6-digit OTP
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// @desc    Send OTP to phone
export const sendOTP = async (req: Request, res: Response) => {
    const { phone, role, shopName, ownerName, city, district } = req.body

    const otp = generateOTP()
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000) // expires in 5 mins

    try {
        let user = await User.findOne({ phone })

        if (!user) {
            user = new User({
                phone,
                role,
                shopName,
                ownerName,
                city,
                district,
                otp,
                otpExpiresAt,
            })
        } else {
            user.otp = otp
            user.otpExpiresAt = otpExpiresAt
        }

        await user.save()

        // Simulate sending OTP (you can integrate Twilio later)
        console.log(`📲 OTP for ${phone}: ${otp}`)

        res.status(200).json({ message: "OTP sent successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error })
    }
}

// @desc    Verify OTP and log in
export const verifyOTP = async (req: Request, res: Response) => {
    const { phone, otp } = req.body

    try {
        const user = await User.findOne({ phone })

        if (
            !user ||
            user.otp !== otp ||
            !user.otpExpiresAt || // ✅ Type-safe check
            new Date() > new Date(user.otpExpiresAt)
        ) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        // Clear OTP
        user.otp = ""
        user.otpExpiresAt = undefined
        await user.save()

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )

        res.status(200).json({ message: "Login successful", token, user })
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error })
    }
}
