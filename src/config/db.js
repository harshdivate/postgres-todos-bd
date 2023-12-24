import pkg from "pg";

async function connectDB() {
  try {
    const pool = new pkg.Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    const client = await pool.connect();
    return client;
  } catch (err) {
    console.log("Error In Connecting DB", err);
  }
}

export default connectDB;

// username,
// fullName,
// email,
// password,
// image,
// accessToken,
// refreshToken

// CREATE TABLE user(
// 	ID SERIAL PRIMARY KEY,
// 	username VARCHAR(20) UNIQUE NOT NULL,
// 	email VARCHAR(30) UNIQUE NOT NULL,
// 	password VARCHAR(60) NOT NULL,
// 	image VARCHAR(255) NOT NULL,
// 	accessToken TEXT,
// 	refreshToken TEXT,
// );
