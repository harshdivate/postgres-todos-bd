import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  getDetails,
  loginUser,
  registerUser,
} from "../controllers/user.controllers.js";

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
router.route("/details").post(verifyJWT, getDetails);

export { router };
