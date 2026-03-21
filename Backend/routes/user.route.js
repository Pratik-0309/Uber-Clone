import express from "express";
import { registerUser,loginUser, refreshAccessToken } from "../controllers/user.controller.js";
import { body } from "express-validator";

const userRouter = express.Router()

userRouter.post("/register", [
    body('email').isEmail().withMessage("Invalid Email"),
    body('fullName.firstName').isLength({ min:3 }).withMessage(
        'First name must be at least 3 character long'
    ),
    body('fullName.lastName').isLength({ min:3 }).withMessage(
        'Last name must be at least 3 character long'
    ),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 character long'),
], registerUser);


userRouter.post("/login",[
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 character long'),
],loginUser)


export default userRouter;