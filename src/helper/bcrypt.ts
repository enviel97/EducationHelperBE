import { compare, hash } from "bcryptjs";
const SALT_ROUNDS: number = 10;

function encode(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}
function verify(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export const Bcrypt = {
  hash: encode,
  compare: verify,
}