import { sign, verify } from "jsonwebtoken";
import { private_key } from "./dotenv";

const encode = (data: string): string | object => {
  const token = sign({ data }, private_key, {
    issuer: "com.auth",
    expiresIn: "365d",
    algorithm: "HS256",
  });
  return token;
};

const decode = (token: string): string | object => {
  try {
    const decode = verify(`${token}`, private_key);
    return decode;
  } catch (error: any) {
    throw error;
  }
};

const refresh = (token: string) => {};

export const Token = {
  create: encode,
  verify: decode,
};
