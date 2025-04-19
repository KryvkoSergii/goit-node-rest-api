import bcrypt from "bcryptjs";

async function getHashedPassword(plainPassword) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  return await bcrypt.hash(plainPassword, salt);
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export const passwordService = { getHashedPassword, comparePassword };
