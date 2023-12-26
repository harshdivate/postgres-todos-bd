import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { registerUser } from "../controllers/user.controllers.js";

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

export { router };
