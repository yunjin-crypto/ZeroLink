import { NextRequest } from "next/server";

import { register } from "@/services/auth.service";

import { registerSchema } from "@/validators/auth.validator";

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
      registerSchema.parse(body);

    // 注册
    const user = await register(
      validatedData
    );

    return successResponse(
      user,
      "注册成功",
      201
    );
  } catch (error: any) {
    return errorResponse(
      error.message || "注册失败",
      400
    );
  }
}