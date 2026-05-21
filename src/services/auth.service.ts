import { prisma } from "@/lib/prisma";

import {
  comparePassword,
  hashPassword,
} from "@/lib/bcrypt";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt";

import { createSession } from "./session.service";

import { LoginBody, RegisterBody } from "@/types/auth";

/**
 * 用户注册
 */
export async function register(
  body: RegisterBody
) {
  const { username, email, password } = body;

  // 检查邮箱是否存在
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("邮箱已存在");
  }

  // 检查用户名是否存在
  const existingUsername =
    await prisma.user.findUnique({
      where: {
        username,
      },
    });

  if (existingUsername) {
    throw new Error("用户名已存在");
  }

  // 密码加密
  const passwordHash = await hashPassword(password);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

/**
 * 用户登录
 */
export async function login(
  body: LoginBody,
  meta?: {
    ipAddress?: string;
    userAgent?: string;
  }
) {
  const { email, password } = body;

  // 查询用户
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("用户不存在");
  }

  // 校验密码
  const isPasswordValid =
    await comparePassword(
      password,
      user.passwordHash
    );

  if (!isPasswordValid) {
    throw new Error("密码错误");
  }

  /**
   * 临时设备
   *
   * 第一模块先自动创建默认设备
   *
   * 后续 Device 模块会替换这里
   */
  let device = await prisma.device.findFirst({
    where: {
      userId: user.id,
      deviceName: "Default Device",
    },
  });

  if (!device) {
    device = await prisma.device.create({
      data: {
        userId: user.id,
        deviceName: "Default Device",
        deviceKey: crypto.randomUUID(),
        status: "online",
      },
    });
  }

  // Access Token
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  // Refresh Token
  const refreshToken = signRefreshToken({
    userId: user.id,
    role: user.role,
  });

  // Session持久化
  await createSession({
    userId: user.id,
    deviceId: device.id,
    refreshToken,
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
    expiresAt: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ),
  });

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * 刷新 Token
 */
export async function refreshToken(
  refreshToken: string
) {
  let payload: any;

  try {
    payload =
      verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Refresh Token 无效");
  }

  // 查询 Session
  const session =
    await prisma.session.findFirst({
      where: {
        refreshToken,
      },
    });

  if (!session) {
    throw new Error("Session 不存在");
  }

  // 查询用户
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    throw new Error("用户不存在");
  }

  // 生成新 Access Token
  const newAccessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken: newAccessToken,
  };
}

/**
 * 登出
 */
export async function logout(
  refreshToken: string
) {
  await prisma.session.deleteMany({
    where: {
      refreshToken,
    },
  });

  return true;
}