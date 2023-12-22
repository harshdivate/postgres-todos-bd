import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();

console.log(process.env.PORT);

app.listen(process.env.PORT || 4500, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
