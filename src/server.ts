import { app } from "./app";
import { env } from "./env";

const port = env.PORT || 3000;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

app
  .listen({ host: host, port: port })
  .then(() => console.log("Server is Running"));
