import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.MONGO_URI;

mongoose.connect(URL as string);

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password as string, 8);
  }
  next();
});

const User: Model<User> = mongoose.model<User>("User", UserSchema);

export default User;
