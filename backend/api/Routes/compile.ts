import { Router, Request, Response } from "express";
import axios from "axios";

const compileRouter = Router();

compileRouter.post("/", async (req: Request, res: Response) => {
  const apiKey = process.env.PISTON_API_KEY;

  try {
    const response = await axios.post(
      "https://api.onlinecompiler.io/api/v2/piston/execute",
      req.body,
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Compilation service error" };
    res.status(status).json(data);
  }
});

export default compileRouter;
