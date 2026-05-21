import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * 密码加密
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 密码校验
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}