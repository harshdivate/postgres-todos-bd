import asyncHandler from "../utils/asyncHandler.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
  // To-do register user
  // get details from user
  // check wheather they are not empty
  // check is user already exist
  // hash the password  & generate refresh and accessToken
  // save it into database
  // send response

  try {
    console.log(req.body);
    return res.status(200).json({});
    // const { username, email, password, image } = req.body;
    // console.log(req.body);
    // if ([username, email, password, image].some((val) => val?.trim() === "")) {
    //   return res
    //     .status(400)
    //     .json({ status: "false", message: "Username or email undefined" });
    // }
    // const client = await connectDB();
    // const userExist = await client.query(
    //   `select * from users where email='${email}' or username='${username}'`
    // );
    // if (userExist.rows.length > 0) {
    //   return res
    //     .status(409)
    //     .json({ status: "false", message: "user alreay exist" });
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    // const query = `INSERT INTO user (username, email, password, image, accessToken, refreshToken)
    //   VALUES
    //   (${username}, ${email}, ${hashedPassword}, ${image},'123','13');`;
    // const registerUser = await client.query(query);
    // console.log(registerUser);
    // return res
    //   .status(200)
    //   .json({ status: true, message: registerUser.rows[0] });
  } catch (error) {
    console.log(error?.message);
    // client.release();
  }
});

export { registerUser };
