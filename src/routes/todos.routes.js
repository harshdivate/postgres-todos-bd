import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  getTodoWithId,
  insertTodo,
  deleteTodo,
  updateTodoStatus,
} from "../controllers/todo.controller.js";

const router = Router();

// router.route("/todos/:id").get(verifyJWT, getTodoById);
// router.route("todo/inserTodo").post(verifyJWT, insertTodo);

//testing purpose removed verifyJWT
// router.route("/todos/:id").get(getTodoById);
router.route("/inserttodo").post(insertTodo);
router.route("/gettodosWithId").get(getTodoWithId);
router.route("/deleteTodo").post(deleteTodo);
router.route("/updateStatusOfTodo").post(updateTodoStatus);

export { router };
