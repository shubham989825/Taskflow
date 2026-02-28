import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: String;
    description: String;
    status: "todo" | "in-progress" | "done";
    board: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    dueDate?: Date;

}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
    },
    board: {
        type: mongoose.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    dueDate: {
        type: Date,
    },
}, {
    timestamps: true
});

export default mongoose.model<ITask>("Task", taskSchema);