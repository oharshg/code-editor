import  { JwtPayload, verify, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
dotenv.config();

const Secret = process.env.JWT_SECRET;

declare module "express-serve-static-core" {
    interface Request {
        userID: string;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // get authorization header
        const authHeader = req.headers.authorization;

        // check header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // @ts-ignore
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // get token out of header
        const token = authHeader?.split(' ')[1];

        // check token
        if (!token) {
            // @ts-ignore
            return res.status(401).json({
                message: "Token is missing",
            });
        }

        // decode token
        const decoded = verify(token as string, Secret as Secret) as JwtPayload;

        // save userID in request
        req.userID = decoded.userID;

        // got to next function
        next();
    } catch (err) {
        console.log(err);
        // @ts-ignore
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
}

export default authMiddleware;