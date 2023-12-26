import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

export { router };
