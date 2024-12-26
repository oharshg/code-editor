import express, {Request, Response} from "express"
const userRouter = express.Router();
import User from "../Database/index"

userRouter.post("/signup", async (req: Request, res: Response)=>{
    const { firstName, lastName, email, password } = req.body;
    try{
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })

        res.status(200).json({
            message: 'Created'
        })
    }catch(err){
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})


export default userRouter;