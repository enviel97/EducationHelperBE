import { sign, verify as nVerify, decode as nDecode } from "jsonwebtoken";
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
    const data = nDecode(`${token}`);
    return (data as any)["data"];
  } catch (error: any) {
    throw error;
  }
};

const verify = (token: string) => {
  try {
    const verify = nVerify(`${token}`, private_key);
    return verify;
  } catch (error: any) {
    throw error;
  }
};

export const Token = {
  create: encode,
  decode,
  verify,
};
