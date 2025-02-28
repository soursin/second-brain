import express, { Request, Response } from "express"
import { content } from "../schema/db";
import { userMiddleware } from "../middleware/userMiddleware";
import z from "zod";

export const userContent = express.Router();

userContent.get("/", userMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    try {
        const findContent = await content.find({
            userId : userId
        }).populate("userId","username")

        res.status(200).json({
            contents: findContent
        })
    } catch (e) {
        res.status(500).json({
            msg: "Server Side Issued"
        })
    }
})

userContent.post("/", userMiddleware, async (req: Request, res: Response) => {

    const inputSchema = z.object({
        type: z.string(),
        link: z.string(),
        title: z.string().optional(),
        tags: z.array(z.string()).optional()
    })

    const checkSchema = inputSchema.safeParse(req.body);

    if (!checkSchema.success) {
        res.status(403).json({
            msg: checkSchema.error
        })
        return;
    }

    try {
        //@ts-ignore
        const userId = req.userId;
        console.log(userId);
        const fillContent = await content.create({
            type: req.body.type,
            link: req.body.link,
            title: req.body.title,
            tags: req.body.tags,
            userId : userId
        })
        res.status(201).json({
            msg: "Successfully Added Content"
        })


    } catch (e) {
        res.status(500).json({
            msg: `Server Side Error ${e}`
        })
    }

})

userContent.delete("/:contentId", userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.params.contentId

    try{
        const findContent = await content.findOne({
            _id : contentId
        })

        if(!findContent){
            res.status(404).json({
                msg : "Cannot address the content"
            })
            return ;
        }

        const deleteContent = await content.deleteOne({
            _id : contentId
        })

        res.status(200).json({
            msg : "Deleted the content"
        })

    }catch(e){
        res.status(500).json({
            msg : "Server side error"
        })
    }
})
