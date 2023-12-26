import asyncHandler from "../utils/asyncHandler.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import { uploadFiletoCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateRefreshAccessToken = (username, email, password) => {
  const accessToken = jwt.sign(
    {
      username,
      email,
      password,
    },
    process.env.ACCESS_TOkEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOkEN_EXPIRY_DATE,
    }
  );

  const refreshToken = jwt.sign(
    {
      email,
    },
    process.env.ACCESS_TOkEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOkEN_EXPIRY_DATE,
    }
  );
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // To-do register user
  // get details from user
  // check wheather they are not empty
  // check is user already exist
  // hash the password  & generate refresh and accessToken
  // save it into database
  // send response

  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    if ([username, email, password].some((val) => val?.trim() === "")) {
      return res
        .status(400)
        .json({ status: "false", message: "Username or email undefined" });
    }

    const client = await connectDB();
    const userExist = await client.query(
      `select * from users where email='${email}' or username='${username}'`
    );

    if (userExist.rows.length > 0) {
      return res
        .status(409)
        .json({ status: "false", message: "user alreay exist" });
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
      return res
        .status(400)
        .json({ status: false, message: "Avatar file required" });
    }

    const avatar = await uploadFiletoCloudinary(avatarLocalPath);
    if (!avatar) {
      return res
        .status(400)
        .json({ status: false, message: "Avatar file required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Generate refreshToken and AccessToken
    const { accessToken, refreshToken } = generateRefreshAccessToken(
      username,
      email,
      password
    );
    const query = `INSERT INTO users (username, email, password, image, accessToken, refreshToken)
      VALUES
      ($1,$2,$3,$4,$5,$6) RETURNING username,email,image,accessToken,refreshToken;`;

    const registerUser = await client.query(query, [
      username,
      email,
      hashedPassword,
      avatar.url,
      accessToken,
      refreshToken,
    ]);

    return res
      .status(200)
      .json({ status: true, message: registerUser.rows[0] });
  } catch (error) {
    console.log(error?.message);
    // client.release();
  }
});

export { registerUser };
