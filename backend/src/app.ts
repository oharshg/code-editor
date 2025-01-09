import express, { Request, Response } from "express";
import userRouter from "./Routes/user";
import postRouter from "./Routes/post";
import commentRouter from "./Routes/comment";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from CompileX");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
