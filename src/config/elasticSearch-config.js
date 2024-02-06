import { Client, HttpConnection } from "@elastic/elasticsearch";
import fs from "fs";

export default async function configureElasticSearch() {
  const client = await new Client({
    node: "https://localhost:9200",
    auth: {
      username: "elastic",
      password: "0MK64fntZwyD9tJhgUdO",
    },
    log: "trace",
    tls: {
      ca: fs.readFileSync("./public/http_ca.crt"),
      rejectUnauthorized: false,
    },
  });
  return client;
}
