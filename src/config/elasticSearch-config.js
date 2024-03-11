import { Client, HttpConnection } from "@elastic/elasticsearch";
import fs from "fs";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default async function configureElasticSearch() {
  try {
    const client = await new Client({
      node: "https://localhost:9200", // make env variable
      auth: {
        username: "elastic", // env
        password: "0MK64fntZwyD9tJhgUdO", // env
      },
      log: "trace",
      tls: {
        ca: fs.readFileSync("./public/http_ca.crt"),
        rejectUnauthorized: false,
      },
    });
    if (client) {
      return client;
    }
  } catch (error) {
    console.log("Error in connecting db" + error);
  }
}

export async function createConnection() {
  try {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const database = process.env.DB_DATABASE;
    const password = process.env.DB_PASSWORD;
    const port = process.env.DB_PORT;
    const connection = new Sequelize(database, user, password, {
      host: host,
      dialect: "postgres",
    });
    connection.authenticate().then();

    return connection;
  } catch (error) {
    console.log("Error in Connecting Sequilze" + error);
  }
}
