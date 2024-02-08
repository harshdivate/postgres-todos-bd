import { Client, HttpConnection } from "@elastic/elasticsearch";
import fs from "fs";

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
