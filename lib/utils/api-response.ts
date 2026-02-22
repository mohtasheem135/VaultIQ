import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/app.types";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { data, error: null },
    { status }
  );
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { data: null, error: message },
    { status }
  );
}
