import { cookies } from "next/headers";

import { refreshToken } from "@/services/auth.service";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
} from "@/constants/auth";

import {
  successResponse,
  errorResponse,
} from "@/utils/response";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshTokenCookie =
      cookieStore.get(
        REFRESH_TOKEN_COOKIE_NAME
      )?.value;

    if (!refreshTokenCookie) {
      return errorResponse(
        "Refresh Token 缺失",
        401
      );
    }

    const result = await refreshToken(
      refreshTokenCookie
    );

    const response = successResponse(
      null,
      "刷新成功"
    );

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

    return response;
  } catch (error: any) {
    return errorResponse(
      error.message || "刷新失败",
      401
    );
  }
}