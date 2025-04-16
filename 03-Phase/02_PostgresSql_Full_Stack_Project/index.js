import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/auth.route";


dotenv.config();
const app = express()
const port = process.env.PORT || 4000;
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "tested route"
    })
})

app.use('/api/v1/users', userRouter)

app.listen(port, () => {
    console.log(`Backend listing on port ${port}`);
    
})
