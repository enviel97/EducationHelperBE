import { Express as NExpress } from "express";
import { createServer } from "http";
import express from "./src/root/express";
import Mongoose from "./src/root/mongose";
import "./src/route";

const config = (): Promise<NExpress> => {
  const moongose = new Mongoose();
  return new Promise((resolve, reject) => {
    try {
      moongose.config();
      const app = express.config();
      resolve(app);
    } catch (error: any) {
      reject(error);
    }
  });
};

const run = async () => {
  const app = await config();
  createServer(app).listen(process.env.PORT || 3000, () => {
    console.log(`Local host: http://localhost:${process.env.PORT || 3000}`);
  });
};

run().catch((err) => console.log(`[Server connect error]:\n ${err}`));
