import { NextResponse } from "next/server";
import type { z } from "zod";

import { authResponseSchema } from "@/schemas/auth-response.schema";
import type { AuthUser } from "@/types/auth";

import { getBackendUrl } from "./backend-url";
import { AUTH_COOKIES, authCookieOptions } from "./cookies";

function getErrorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const { message } = payload;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (
      Array.isArray(message) &&
      message.every((item) => typeof item === "string")
    ) {
      return message.join(" ");
    }
  }

  return `Authentication failed with status ${status}.`;
}

export async function handleAuthRequest(
  request: Request,
  backendPath: string,
  schema: z.ZodType,
) {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    return NextResponse.json(
      { message: "The backend URL is not configured on the server." },
      { status: 500 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsedRequest = schema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json(
      { message: parsedRequest.error.issues.map((issue) => issue.message) },
      { status: 400 },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${backendUrl}${backendPath}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedRequest.data),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { message: "Unable to reach the authentication service." },
        { status: 502 },
      );
    }

    throw error;
  }

  let payload: unknown;

  try {
    payload = await backendResponse.json();
  } catch {
    return NextResponse.json(
      { message: "The authentication service returned invalid JSON." },
      { status: 502 },
    );
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: getErrorMessage(payload, backendResponse.status) },
      { status: backendResponse.status },
    );
  }

  const authResponse = authResponseSchema.safeParse(payload);

  if (!authResponse.success) {
    return NextResponse.json(
      { message: "The authentication service returned an invalid response." },
      { status: 502 },
    );
  }

  const {
    accessToken,
    refreshToken,
    latestSelectedAddress,
    ...profile
  } = authResponse.data;
  const user: AuthUser = {
    ...profile,
    latestSelectedAddress: latestSelectedAddress ?? null,
  };
  const response = NextResponse.json(user);

  response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, accessToken, authCookieOptions);
  response.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, authCookieOptions);

  return response;
}
