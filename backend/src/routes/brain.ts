import express , {Request, Response} from "express"
import {z} from "zod"
import { userMiddleware } from "../middleware/userMiddleware";
import { content, link, user } from "../schema/db";
export const brainRouter = express.Router();

brainRouter.post("/" , userMiddleware , async (req : Request , res : Response) =>{
    const inputSchema = z.object({
        share : z.boolean()
    }) 

    const checkSchema = inputSchema.safeParse(req.body);
    if(!checkSchema.success){
        res.status(411).json({
            msg : "Input Invalid"
        })
        return ;
    }

    try{
        //@ts-ignore
        const userId = req.userId

        const uniqueCode = (num : number) => {
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
            let shortCode : string = "";
            for (let i : number = 0; i < num; i+=1) {
                shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        
            return shortCode
        }

        if(req.body.share){
            //@ts-ignore
            const userId = req.userId
            const existLink = await link.findOne({
                userId : userId
            })
            if(existLink){
                res.status(200).json({
                    link : existLink.hash
                })
                return ;
            }
            let code = uniqueCode(10);
            const shareLink = await link.create({
                userId : userId,
                hash : code
            })
            res.status(201).json({
                link : code                
            })
        }else{
            const deleteLink = await link.deleteMany({
                userId : userId
            })

            res.status(200).json({
                msg : "Deleted"
            })
        }
    }catch(e){
        res.status(500).json({
            msg : `Server Error ${e}`
        })
    }
})

brainRouter.get("/:shareLink" ,async (req : Request , res : Response) =>{
    const shareLink = req.params.shareLink
    try{
        const findLink = await link.findOne({
            hash : shareLink
        })

        if(!findLink){
            res.status(411).json({
                msg : "Share Link might be disabled"
            })
            return ;
        }

        const contents = await content.find({
            userId : findLink.userId
        })

        const users = await user.findOne({
            _id : findLink.userId
        })

        if(!users){
            res.status(403).json({
                msg :"Might User not found"
            })
            return ;
        }
        
        res.status(200).json({
            username : users.username,
            content : contents
        })
    }catch(e){
        res.status(500).json({
            msg : `Server Error ${e}`
        })
    }

})