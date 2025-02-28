import express, { Request, Response } from "express"
import z from "zod"
import bcrypt from "bcrypt"
import { user } from "../schema/db"
import * as dotenv from "dotenv"
import jwt, { Secret } from "jsonwebtoken"
export const userRoutes = express.Router();

dotenv.config()


const userSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20)
})

userRoutes.post("/register", async (req: Request, res: Response) => {

    const checkSchema = userSchema.safeParse(req.body);
    if (!checkSchema.success) {
        res.status(411).json({
            data: {
                msg: checkSchema.error
            }
        })
        return;
    }
    try {
        const response = await user.findOne({
            username: req.body.username
        })

        if (response) {
            res.status(403).json({
                data: {
                    msg: "Already a user"
                }
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const createUser = await user.create({
            username: req.body.username,
            password: hashedPassword
        })

        res.status(200).json({
            data: {
                msg: "Successfully Registered!!!!"
            }
        })
    } catch (e) {
        res.status(500).json({
            data: {
                msg: `Server Error ${e}`
            }
        })
    }

})

userRoutes.post("/login", async (req: Request, res: Response) => {
    const checkSchema = userSchema.safeParse(req.body);
    if (!checkSchema.success) {
        res.status(411).json({
            data: {
                msg: checkSchema.error
            }
        })
        return;
    }
    try {
        const response = await user.findOne({
            username: req.body.username,
        })

        if (!response) {
            res.status(404).json({
                data: {
                    msg: "User not found"
                }
            })
            return;
        }
        const hashedPassword = await bcrypt.compare(req.body.password, response.password);
        if (hashedPassword) {
            const token = jwt.sign({
                userId: response._id.toString()
            }, process.env.JWT_SECRET as Secret, { expiresIn: "1h" })
            res.status(200).json({
                data: {
                    token: token
                }
            })
        } else {
            res.status(403).json({
                data: {
                    msg: "Wrong Username or Password"
                }
            })
        }
    } catch (e) {
        res.status(500).json({
            data: {
                msg: `Server Error ${e}`
            }
        })
    }
})

