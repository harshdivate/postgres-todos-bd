import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config();

(async () => {
  try {
    const client = await connectDB();
    if (client) {
      console.log("Connect to DB");
      app.listen(process.env.PORT || 4500, (req, res) => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    }
  } catch (err) {
    console.log(err);
    client.release();
  }
})();
