import asyncHandler from "../utils/asyncHandler.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import { uploadFiletoCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateRefreshAccessToken = (username, email, password) => {
  const accessTokenExpiry =
    Math.floor(Date.now() / 1000) +
    process.env.ACCESS_TOkEN_EXPIRY_DATE * 60 * 60;
  const refreshTokenExpiry =
    Math.floor(Date.now() / 1000) +
    process.env.REFRESH_TOKEN_EXPIRY_DATE * 60 * 60;
  const accessToken = jwt.sign(
    {
      username,
      email,
      password,
    },
    process.env.ACCESS_TOkEN_SECRET,
    {
      expiresIn: accessTokenExpiry,
    }
  );

  const refreshToken = jwt.sign(
    {
      email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: refreshTokenExpiry,
    }
  );
  return { accessToken, refreshToken, accessTokenExpiry };
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

    if ([username, email, password].some((val) => val?.trim() === "")) {
      return res
        .status(400)
        .json({ status: "false", message: "Username or email undefined" });
    }

    const client = await connectDB();
    if (!client) {
      res
        .status(500)
        .json({ status: false, messgae: "Issue in connecting to database" });
    }
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

    const query = `INSERT INTO users (username, email, password, image)
      VALUES
      ($1,$2,$3,$4) RETURNING username,email,image;`;

    const registerUser = await client.query(query, [
      username,
      email,
      hashedPassword,
      avatar.url,
    ]);

    return res
      .status(200)
      .json({ status: true, message: registerUser.rows[0] });
  } catch (error) {
    console.log(error?.message);
    client.release();
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // To-do Login user
  // take email and password
  // check if both are not null
  // check if password matches the hashedPassword
  //
  try {
    const client = await connectDB();
    if (!client) {
      res
        .status(500)
        .json({ status: false, messgae: "Issue in connecting to database" });
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ status: false, message: "Email or password undefined" });
    }

    // Check is password matches the hasedPassword
    const query = `SELECT username,email,password from users where email='${email}'`;

    const result = await client.query(query);

    if (result.rows.length === 0) {
      res.status(404).json({ status: false, message: "user not found" });
    }

    const rows = result.rows?.[0];

    // userexist the match the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, rows.password);

    if (!isPasswordCorrect) {
      res.status(403).status({ status: false, message: "Password Incorrect" });
    }
    const { accessToken, refreshToken, accessTokenExpiry } =
      generateRefreshAccessToken(rows.username, rows.email, password);

    const updateQuery = `Update users set accessToken='${accessToken}',refreshToken='${refreshToken}' where email='${email}' RETURNING username,email,accessToken `;
    const updateResult = await client.query(updateQuery);

    if (updateResult.rows.length === 0) {
      res.status(500).json({ status: false, message: "Internal server Error" });
    }

    const options = {
      // domain: "http://locahost:5173",
      httpOnly: false,
      secure: true,
      sameSite: "None",
      // path: "http://localhost:5173/",
      expires: new Date(accessTokenExpiry * 1000),
    };
    return res.status(200).cookie("accessToken", accessToken, options).json({
      status: true,
      message: "user logged in successfully",
      data: updateResult.rows,
    });
  } catch (error) {
    console.log(error);
    client.release();
  }
});

const getDetails = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: req.user });
});
export { registerUser, loginUser, getDetails };

// rows: [
//   {
//     username: 'harsh',
//     email: 'harsh@gmail.com',
//     password: '$2b$10$6QxKF/QmfZB6xu/i7OxrCeyxwcdLKdTCyuW6rdAzat.D6ygR.6f7O'
//   }
// ],
