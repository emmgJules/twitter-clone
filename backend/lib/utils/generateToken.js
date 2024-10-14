import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // Prevents XSS attacks
        sameSite: "strict", // Helps mitigate CSRF attacks
        secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    });
};
