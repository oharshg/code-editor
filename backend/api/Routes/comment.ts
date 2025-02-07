import express, { Request, Response } from "express"
const commentRouter = express.Router();
import { Comment } from "../Database/index"
import authMiddleware from "../Middlewares";

// @ts-ignore
commentRouter.get("/comments/:postId", async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ postId: postId });

        return res.status(200).json({
            message: 'Fetched',
            comments: comments
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
});

// @ts-ignore
commentRouter.post("/:postId", authMiddleware, async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const userId = req.userID;
        const { content } = req.body;
        const comment = await Comment.create({
            content: content,
            authorId: userId,
            author: req.name,
            postId: postId,
        });

        return res.status(201).json({
            message: 'Created',
            comment: comment
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
});

export default commentRouter;