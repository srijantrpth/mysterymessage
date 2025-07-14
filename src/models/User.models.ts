import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCodeExpiry: Date;
  verifyCode: string;
  isAcceptingMessage: boolean;
  messages: Message[];
  isVerified: boolean;
}
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required! "],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required! "],
    trim: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid Email Address"],
  },
  password: {
    type: String,
    required: [true, "Password is required! "],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required! "],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is Required! "],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;