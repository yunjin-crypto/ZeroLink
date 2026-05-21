import { z } from "zod";

/**
 * 注册参数校验
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少3位")
    .max(20, "用户名最多20位"),

  email: z
    .string()
    .email("邮箱格式错误"),

  password: z
    .string()
    .min(6, "密码至少6位")
    .max(32, "密码最多32位"),
});

/**
 * 登录参数校验
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("邮箱格式错误"),

  password: z
    .string()
    .min(6, "密码至少6位"),
});