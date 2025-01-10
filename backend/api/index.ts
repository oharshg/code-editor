import express, { Request, Response } from "express";
import userRouter from "./Routes/user";
import postRouter from "./Routes/post";
import commentRouter from "./Routes/comment";
import dotenv from "dotenv";
import { VercelRequest, VercelResponse } from "@vercel/node";

const cors = require("cors");

type CorsOptions = {
  origin: string;
  methods: string;
};

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions: CorsOptions = {
  origin: "https://oharshg.github.io",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from CompileX");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as any, res as any);
}
