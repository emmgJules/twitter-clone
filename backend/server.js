import express from "express"
import authRoutes from "./routes/auth.routes.js"
import dotenv from "dotenv"
import connectMongoDB from "./db/connectMongoDB.js"
import { protectedRoute } from "./middleware/protectRoute.js"
import cookieParser from "cookie-parser"
const app = express()


dotenv.config()

const PORT=process.env.PORT || '8000'
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true})) // to parse form data
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
    connectMongoDB()
})  