import mongoose, { mongo } from "mongoose";

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        minLength: [4, 'Username is must be above 4'],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password is must be above 6'],
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const authModel = mongoose.model('Authentication', AuthSchema)

export { authModel }