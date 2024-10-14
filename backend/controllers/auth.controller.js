import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error:"Invalid Email Format"})
        }
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({error:"Username is arleady taken "})
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({error:"Email is arleady taken "})
        } 
        if (password.length < 6) {
            return res.status(400).json({ error: "Password Must Be at least 6 characters long" })
        }
        //hash pasword
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt) 
        const newUser = new User({
            fullName ,
            username,
            email,
            password:hashPassword

        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImage,
                coverImg:newUser.coverImage
            })
        } else {
            
            res.status(400).json({error:"Invalid user Data"})
        }


    } catch (error) {
        console.log("Error in auth controler",error.message)
        res.status(500).json({error:"Internal server Error"})
    }
}
export const login= async (req, res) => {
    res.json({
        data:"You hit the signup endpoint.",
    })
}
export const logout= async (req, res) => {
    res.json({
        data:"You hit the signup endpoint.",
    })
}