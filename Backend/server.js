import dotenv from "dotenv"
dotenv.config();
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import captainRouter from "./routes/captain.route.js";


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/user", userRouter);
app.use("/api/captain", captainRouter);

app.listen(process.env.PORT, ()=> {
    console.log(`Server is listening on port ${process.env.PORT}`);
})

connectDB();

app.get("/", (req,res)=> {
    res.send("Hello World");
});