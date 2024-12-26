import mongoose, { Schema, Document, Model } from "mongoose";

mongoose.connect('mongodb+srv://rawalaman0505:Bs7p88vwiN2Abu2M@clusterx.c517j.mongodb.net/');

interface User extends Document {
    firstName: string
    lastName: string;
    email: string;
    age: number;
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String
    },
    lastName:{
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

const User: Model<User> = mongoose.model<User>("User", UserSchema);

// module.exports = {
//     User
// }

export default User