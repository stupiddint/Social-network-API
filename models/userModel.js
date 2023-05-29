import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique username"],
        unique: [true, "Username Exist"],
    },
    email: {
        type: String,
        required: [true, "Please provide unique email"],
        unique: [true, "account already exist"],
        match: [
            /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
            "please enter a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String }

})

export default mongoose.model.users || mongoose.model("User", UserSchema);