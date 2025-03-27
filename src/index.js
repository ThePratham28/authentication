import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/user.router.js";
import {connectDB} from "./config/db.config.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.get("/", (req, res) => {
    res.send("Backend for User Authentication and Session Management");
});

app.use("/api/user", authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
