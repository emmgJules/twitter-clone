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
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Compare provided password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If password is incorrect, send an error response
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate token and set cookie if the password is correct
        generateTokenAndSetCookie(user._id, res);

        // Send user details in response
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImage,
            coverImg: user.coverImage
        });
    } catch (error) {
        // Catch and log any errors
        console.log("Error in auth controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout= async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({message:'Logged Out succesfully'})
    } catch (error) {
        console.log("Error in logout controller ",error.message)
    }
}

export const getMe = async (req, res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)

    } catch (error ) {
        console.log("Error in getMe controller ", error.message)
        res.status(500).json({error:"Internal server error"})
        
    }
}