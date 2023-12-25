import dotenv from "dotenv";

import { app } from "./app.js";

dotenv.config();

(async () => {
  try {
    app.listen(process.env.PORT || 4500, (req, res) => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
