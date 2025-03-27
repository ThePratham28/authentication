import { Schema, model } from "mongoose";
import validator from "validator";
import { hash, verify } from "argon2";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email :  {
        type: String,
        required: true,
        unique: true,
        validate : {
            validator: validator.isEmail,
            message: "Email is invalid"
        }
    },
    password: {
        type: String,
        required: true,
    }
});


export const User = model("User", userSchema);

