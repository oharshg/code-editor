import express, { Request, Response } from "express"
import { sign, Secret } from "jsonwebtoken";
const userRouter = express.Router();
import User from "../Database/index"
import dotenv from 'dotenv';
import authMiddleware from "../Middlewares";
import bcrypt from "bcryptjs";
dotenv.config();

const Secret = process.env.JWT_SECRET;

// @ts-ignore
userRouter.post("/signup", async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })

        const token = sign(user.id, Secret as Secret);

        return res.status(201).json({
            message: 'Created',
            token: token
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

// @ts-ignore
userRouter.post("/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne(
            { email: email }
        );

        if (!user) {
            return res.status(404).json({
                message: 'Not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const token = sign(user?.id, Secret as Secret);

        return res.status(200).json({
            message: 'OK',
            token: token
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
});

userRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
    res.status(200).json({
        message: 'OK'
    });
})


export default userRouter;