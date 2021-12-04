import User from "../../../models/user.model";
import { Response, Request } from "express";
import { encode } from "../../../helper/jsontoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, password } = req.body;

  const hashPassword = encode(password);
  const user = new User({ name, email, phoneNumber, password: hashPassword });
  console.log(hashPassword);
};
