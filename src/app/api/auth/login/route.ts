import { NextRequest } from "next/server";

import { login } from "@/services/auth.service";

import { loginSchema } from "@/validators/auth.validator";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/constants/auth";

import {
  errorResponse,
  successResponse,
} from "@/utils/response";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    // 参数校验
    const validatedData =
      loginSchema.parse(body);

    // 登录
    const result = await login(
      validatedData,
      {
        ipAddress:
          req.headers.get(
            "x-forwarded-for"
          ) || "",

        userAgent:
          req.headers.get(
            "user-agent"
          ) || "",
      }
    );

    // 返回响应
    const response = successResponse(
      result.user,
      "登录成功"
    );

    // 设置 Access Token
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: result.accessToken,
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
    });

    // 设置 Refresh Token
    response.cookies.set({
      name: REFRESH_TOKEN_COOKIE_NAME,
      value: result.refreshToken,
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return errorResponse(
      error.message || "登录失败",
      400
    );
  }
}