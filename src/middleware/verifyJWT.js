import jwt from "jsonwebtoken";
import { connectDB } from "../config/db.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "token not present in cookies" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOkEN_SECRET);
    if (Date.now() > decodedToken.exp * 1000) {
      console.log("Token expired");
      return res
        .status(401)
        .json({ success: false, message: "token expired " });
    } else {
      const email = decodedToken.email;
      const client = await connectDB();
      const queryy = `Select * from users where email='${email}'`;
      const result = await client.query(queryy);
      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ status: false, message: "user not found" });
      }
      // now the use exists
      req.user = result.rows[0];
    }
    next();

    // if token exist the check wheather it is expired or not
    // if token is expired then send 401 to frontend and in frontend ask the user to re-login
    // if not expired then compare with the secret from our db
  } catch (error) {
    console.log(error);
  }
};
function convertTimestampToNormalTime(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedTime;
}
