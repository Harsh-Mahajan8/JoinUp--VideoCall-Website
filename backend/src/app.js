require('dotenv').config();

import express from "express";
import { createServer } from "node:http";
import { status } from "http-status";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/SocketManager.js";

import userRoutes from "./routes/users.routes.js";
const port = 3000;
const app = express();

//ws config
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.set('port', process.env.port || 3000);
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/user", userRoutes);

const start = async () => {
  const connectionDB = await mongoose.connect(process.env.MONGO_URL);
  console.log(`Mongo is connection with host: ${connectionDB.connection.host}`)
  server.listen(port, () => {
    console.log("Server is working on port", port);
  });
}
await start();


