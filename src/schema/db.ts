import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
})

const contentSchema = new Schema(({
    type: { type: String, enum: ["image", "video", "article", "audio"], required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, refs: 'tags' }],
    userId: { type: mongoose.Schema.Types.ObjectId, refs: 'user', required: true }
}))

const tagsSchema = new Schema({
    title: { type: String, required: true, unique: true }
})

const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
})

const user = mongoose.model("user", userSchema);
const content = mongoose.model("content", contentSchema);
const tags = mongoose.model("tags", tagsSchema);
const link = mongoose.model("link", linkSchema);

export { user, content, tags, link };
