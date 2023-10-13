import { config } from "dotenv";
import { connectedDB } from "./config/db.js";
import { server } from "./app.js";
import { initializeWebSocket } from "./hub/websocket.js";

config();
connectedDB();

const port = process.env.PORT ?? 8000;
server.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  initializeWebSocket();
});
