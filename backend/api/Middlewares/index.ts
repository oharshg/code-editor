import { JwtPayload, verify, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { User } from "../Database";
dotenv.config();

const Secret = process.env.JWT_SECRET;

declare module "express-serve-static-core" {
  interface Request {
    userID: string;
    name: string;
  }
}

const findName = async (id: string) => {
  try {
    const user = await User.findOne({ _id: id });
    return `${user?.firstName} ${user?.lastName}` || user?.firstName;
  } catch (err) {
    console.log(err);
  }
};

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // get authorization header
    const authHeader = req.headers.authorization;

    // check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // @ts-ignore
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // get token out of header
    const token = authHeader?.split(" ")[1];

    // check token
    if (!token) {
      // @ts-ignore
      return res.status(401).json({
        message: "Token is missing",
      });
    }

    // decode token
    const decoded = verify(token, Secret as Secret) as string;

    // save userID in request
    req.userID = decoded;

    // save name in request
    req.name = (await findName(decoded)) || "Unknown";

    // got to next function
    next();
  } catch (err) {
    console.log(err);
    // @ts-ignore
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;
