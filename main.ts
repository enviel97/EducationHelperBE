import { Express as NExpress } from "express";
import { createServer } from "http";
import express from "./src/config/express";
import firebase from "./src/config/firebase";
import mongoose from "./src/config/mongose";
import redis from "./src/config/redis";
import "./src/route";

const config = (): Promise<NExpress> =>
  new Promise(async (resolve, reject) => {
    try {
      await mongoose.config();
      await firebase.config();
      await redis.config();

      const app = express.config();
      resolve(app);
    } catch (error: any) {
      reject(error);
    }
  });

const run = async () => {
  const app = await config();
  const PORT = process.env.PORT || 3000;
  createServer(app).listen(PORT, () => {
    console.log(`Local host: http://localhost:${PORT}`);
  });
};

run().catch((err) => console.log(`[Server connect error]:\n ${err}`));
