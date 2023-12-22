import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  user: "database-user",
  max: 20,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
});

const client = pool.connect();

module.exports = { client };

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
