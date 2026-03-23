import express from "express"
import { body } from "express-validator";
import {captainRegister} from "../controllers/captain.controller.js"

const captainRouter = express.Router();

captainRouter.post("/register",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min: 3}).withMessage('first name must be at least 3 character long'),
    body('fullName.lastName').isLength({ min:3 }).withMessage('Last name must be at least 3 character long'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 character long'),
    body('vehicle.color').isLength({min: 3}).withMessage('vehicle color must be atleast 3 character long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('vehicle Number must be atleast 3 character long'),
    body('vehicle.capacity').isLength({min: 1}).withMessage('vehicle capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid Vehicle type')
],captainRegister)

export default captainRouter;