import express, { Request, Response } from "express"
const commentRouter = express.Router();
import { Comment, Post } from "../Database/index"
import authMiddleware from "../Middlewares";

// @ts-ignore
commentRouter.get("/comments/:postId", authMiddleware, async (req: Request, res: Response) => {
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
        const { content } = req.body;
        const comment = await Comment.create({
            content: content,
            authorId: req.userID,
            postId: postId
        });

        const post = await Post.findById(postId);
        if (post) {
            post.comments.push(comment.id);
            await post.save();
        } else {
            return res.status(404).json({ message: "Post not found" });
        }

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