import express, {Request, Response} from "express"
import userRouter from "./Routes/user";
import cors from "cors";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from CompileX");
});
app.use("/api/v1/user", userRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
