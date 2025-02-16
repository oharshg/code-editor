import express, { Request, Response } from "express"
const userRouter = express.Router();
import {User} from "../Database/index"
import authMiddleware from "../Middlewares";

import { sign, Secret } from "jsonwebtoken";
import dotenv from 'dotenv';
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
        console.log(user.id);
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
        userID: req.userID,
        message: 'OK'
    });
})

// @ts-ignore
userRouter.get("/:id",authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: 'Not found'
            });
        }
        return res.status(200).json({
            message: 'OK',
            user: user
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

export default userRouter;