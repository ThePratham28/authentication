import { Router } from "express";
import { User } from "../models/user.model.js";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service.js";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return res.json({ message: "User already exists" });
        }

        const hashPasswd = await hash(password);

        const newUser = new User({ username, email, password: hashPasswd });
        await newUser.save();
        return res
            .status(201)
            .json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "username and password are required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await verify(user.password, password);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // req.session.userId = user._id;

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        // req.session.destroy((err) => {
        //     if (err) {
        //         return res.status(500).json({ message: "Logout failed" });
        //     }
        // });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed",
            error: error.message,
        });
    }
});

authRouter.post("/forgotpassword", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });

        const resetLink = `${process.env.CLIENT_URL}/api/user/resetpassword?token=${token}`;

        await sendEmail(email, resetLink);

        return res.status(200).json({ message: "Password reset link sent" });
    } catch (error) {
        res.status(500).json({
            message: "Password reset failed",
            error: error.message,
        });
    }
});

authRouter.post("/resetpassword", async (req, res) => {
    try {
        const { password } = req.body;
        const token = req.query.token;

        if (!token || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const hashPasswd = await hash(password);
        user.password = hashPasswd;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({
            message: "Password reset failed",
            error: error.message,
        });
    }
});

export default authRouter;
