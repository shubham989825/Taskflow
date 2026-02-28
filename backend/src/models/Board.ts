import mongoose, {Schema, Document} from 'mongoose';

export interface IBoard extends Document {
    name: String;
    description?: String;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },],
}, {
    timestamps: true}
);

export default mongoose.model<IBoard>("Board", boardSchema);