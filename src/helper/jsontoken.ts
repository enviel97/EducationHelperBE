import { sign, verify } from "jsonwebtoken";
import { private_key } from "./dotenv";

export function encode(data: string): string | object {
  const token = sign({ data }, private_key, {
    issuer: "com.auth",
    expiresIn: "1h",
    algorithm: "HS256",
  });
  return token;
}

function decode(token: string): string | object {
  const decode = verify(`${token}`, private_key);
  return decode;
}

export const Token = {
  create: encode,
  verify: decode,
};
