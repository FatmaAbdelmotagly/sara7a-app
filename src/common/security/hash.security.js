import bcrypt from "bcrypt";
import { SALT } from "../../config.js";

export const hash = async (plantext, salt_round = SALT, minor = "b") => {
  const saltSegniture = await bcrypt.genSalt(salt_round, minor);
  const cipherText = await bcrypt.hash(plantext, saltSegniture);
  return cipherText;
};

export const compare = async (FE_password, cipherText) => {
  const match = await bcrypt.compare(FE_password, cipherText);
  return match;
};
