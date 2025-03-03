import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: "cliente" | "trabajador" | "admin";
}

const UserSchema = new Schema<IUser>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["cliente", "trabajador", "admin"], default: "cliente" }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
