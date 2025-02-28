import express, { Request, Response } from "express";
import { userRoutes } from "./routes/user";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { userContent } from "./routes/content";
import { brainRouter } from "./routes/brain";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/content/", userContent);
app.use("/api/v1/brain", brainRouter);


app.listen(process.env.PORT, async () => {
    await mongoose.connect(process.env.MONGOOSE_URL as string);
    console.log(`Connected the database ${process.env.PORT}`);
})



