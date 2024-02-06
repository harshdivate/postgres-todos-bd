import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    // origin: process.env.CORS_ORIGIN,
    // credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes import
import { router as userRouter } from "./routes/user.routes.js";
import { router as todoRouter } from "./routes/todos.routes.js";

//routes declartion
app.use("/api/v1/users", userRouter);
app.use("/api/v1/todo", todoRouter);

export { app };
