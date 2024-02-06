import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getTodoById } from "../controllers/todo.controller.js";

const router = Router();

// router.route("/todos/:id").get(verifyJWT, getTodoById);

//testing purpose removed verifyJWT
router.route("/todos/:id").get(getTodoById);

export { router };
