import express, { Request, Response } from "express";
const postRouter = express.Router();
import { Post } from "../Database/index";
import authMiddleware from "../Middlewares";

// @ts-ignore
postRouter.get("/posts/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json({
      message: "Fetched",
      post: post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// @ts-ignore
postRouter.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({
      message: "Fetched",
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// @ts-ignore
postRouter.post("/post", authMiddleware, async (req: Request, res: Response) => {
  const { title, language, code } = req.body;
  try {
    const post = await Post.create({
      title: title,
      language: language,
      code: code,
      author: req.name,
    });
    return res.status(201).json({
      message: "Created",
      post: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default postRouter;
