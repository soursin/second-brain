import express, { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import * as dotenv from "dotenv"

dotenv.config()

interface CustomReq extends Request {
    userId: String
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"];
    let jwtToken = null;
    if (bearerToken?.startsWith("Bearer")) {
        jwtToken = bearerToken.split(" ")[1];
    } else {
        res.status(403).json({
            msg: "Wrong Headers"
        })
        return;
    }

    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET as Secret)
    if (decode) {
        //@ts-ignore
        req.userId = decode.userId;
        next()
    } else {
        res.status(403).json({
            msg: "Invalid Request !!!"
        })
        return;
    }

}