import User from "../models/user.model.js";
import jwt from "jsonwebtoken"; // Import jwt (lowercase)

export const protectedRoute = async (req, res, next) => {
    try {
        // Access the token from cookies (plural)
        const token = req.cookies.jwt; 

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        // Find the user by decoded userId from the token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        // Attach user information to the request
        req.user = user;
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.log("Error in protectedRoute middleware: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
