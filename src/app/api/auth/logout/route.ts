import { cookies } from "next/headers";

import { logout } from "@/services/auth.service";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/constants/auth";

import {
  errorResponse,
  successResponse,
} from "@/utils/response";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken =
      cookieStore.get(
        REFRESH_TOKEN_COOKIE_NAME
      )?.value;

    if (refreshToken) {
      await logout(refreshToken);
    }

    const response = successResponse(
      null,
      "退出登录成功"
    );

    // 清除 Cookie
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: "",
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set({
      name: REFRESH_TOKEN_COOKIE_NAME,
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error: any) {
    return errorResponse(
      error.message || "退出失败",
      500
    );
  }
}