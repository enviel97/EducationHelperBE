import { compare, hash } from "bcryptjs";
const SALT_ROUNDS: number = 10;

const encode = (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS);
};
const verify = (password: string, hash: string): Promise<boolean> => {
  return compare(password, hash);
};

export default {
  hash: encode,
  compare: verify,
};
