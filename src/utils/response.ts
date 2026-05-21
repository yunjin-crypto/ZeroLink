import { NextResponse } from "next/server";

/**
 * 成功响应
 */
export function successResponse(
  data: unknown,
  message = "success",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * 失败响应
 */
export function errorResponse(
  message = "error",
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}