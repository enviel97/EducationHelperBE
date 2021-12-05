import { connection_string } from "../helper/dotenv";
import { Mongoose as NMongoose, ConnectOptions } from "mongoose";

const connectionString: string = connection_string;
const client = new NMongoose({ debug: true });

const config = async (): Promise<void> => {
  if (!connectionString) {
    console.log(`[MongooseDB]: auth DB_URI must be defined`);
    return;
  }

  client.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  const conn = client.connection;

  conn.on("error", (error) => {
    console.log(`[MongooseDB]: Error\n${error}`);
  });

  conn.on("connected", () => {
    console.log(`[MongooseDB]: Connected database`);
  });
};

const mongoose = {
  client,
  config: () => {
    delete (mongoose as any)["config"];
    config();
  },
};

export default mongoose;
