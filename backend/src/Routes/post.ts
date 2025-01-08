import express, { Request, Response } from "express"
const postRouter = express.Router();
import {Post} from "../Database/index"
import authMiddleware from "../Middlewares";

// @ts-ignore
postRouter.get("/posts", authMiddleware, async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({ shared: true });
        return res.status(200).json({
            message: 'Fetched',
            posts: posts
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
});

// @ts-ignore
postRouter.post("/post", authMiddleware, async (req: Request, res: Response) => {
    const { title, language, code, description, comments } = req.body;
    try {
        const post = await Post.create({
            title: title,
            language: language,
            code: code,
            description: description,
            comments: comments,
            authorID: req.userID,
        });
        return res.status(201).json({
            message: 'Created',
            post: post
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

export default postRouter;