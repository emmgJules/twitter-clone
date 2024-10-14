export const signup= async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error:"Invalid Email Format"})
        }

    } catch (error) {
        
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