import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.MONGO_URI;

if (URL) {
  const connectToDatabase = async () => {
    try {
      await mongoose.connect(URL as string);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err);
    }
  };

  connectToDatabase();
} else {
  console.error("MONGO_URI is not defined in the environment variables.");
}
interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface Post extends Document {
  description: string;
  language: string;
  code: string;
  authorID: string;
  shared: boolean;
  comments: Array<string>;
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
    unique: true,
  },
  password: {
    type: String,
  },
});

// Schema for the Post model, representing a code snippet shared by a user
const PostSchema: Schema = new Schema({
  title: {
    type: String,
  },
  language: {
    type: String,
  },
  code: {
    type: String,
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User model
    description: {
      type: String,
      required: true,
    },
  },
  shared: {
    type: Boolean,
    default: false,
  },
  comments:{
    type: Array<String>,
  }
});

// Pre-save hook to hash the user's password before saving it to the database
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password as string, 8);
  }
  next();
});

const User: Model<User> = mongoose.model<User>("User", UserSchema);
const Post: Model<Post> = mongoose.model<Post>("Post", PostSchema);


export { User, Post };
