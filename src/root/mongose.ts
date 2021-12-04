import { connection_string } from "../helper/dotenv";
import { Mongoose as NMongoose, ConnectOptions } from "mongoose";

class Mongoose {
  private connectionString: string = connection_string;
  private client: NMongoose;
  constructor() {
    this.client = new NMongoose({ debug: true });
  }

  public async config(): Promise<void> {
    this.client.connect(this.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    this.client.connection.on("error", (error) => {
      console.log(`[MongooseDB]: Error\n${error}`);
    });

    this.client.connection.on("connected", (connected) => {
      console.log(`[MongooseDB]: Connected database`);
    });
  }
}

export default Mongoose;
