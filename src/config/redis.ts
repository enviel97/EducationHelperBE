import redis, { RedisClient } from "redis";
import { redisConfig } from "../helper/dotenv";

let client: RedisClient;
const config = async () => {
  const { port, host, password } = redisConfig;
  client = redis.createClient(port, host, { host, port, auth_pass: password });
  client.on("connect", () => {
    console.log("[Redis]: Connected redis client");
  });

  client.on("disconnect", () => {
    console.log("[Redis]: Disconnected redis client");
  });
};

const write = async (userId: string, token: string) => {
  if (!client) {
    Promise.reject("Redis client is empty");
    return false;
  }
  const result = client.set(userId, token, (error) => {
    if (!!error) {
      console.log(`[Redis write error]:\n${error}`);
      return;
    }
    console.log(`[Redis write result]: success`);
  });

  return result;
};

const read = async (userId: string) => {
  if (!client) {
    Promise.reject("Redis client is empty");
    return null;
  }
  return new Promise<string | null>((resolve, reject) => {
    client.get(userId, (error, value) => {
      if (!!error) {
        console.log(`[Redis read error]:\n${error}`);
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
};

const RRedis = {
  write,
  read,
  config: () => {
    delete (RRedis as any)["config"];
    return config();
  },
};
export default RRedis;
