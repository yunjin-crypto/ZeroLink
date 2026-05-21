import { getCurrentUser } from "@/lib/auth";

import {
  errorResponse,
  successResponse,
} from "@/utils/response";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse(
        "未登录",
        401
      );
    }

    return successResponse(user);
  } catch {
    return errorResponse(
      "获取用户失败",
      500
    );
  }
}