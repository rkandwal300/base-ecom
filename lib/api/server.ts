import "server-only";

import { cookies } from "next/headers";

import { AUTH_COOKIES } from "@/lib/api/cookies";

import { getBackendUrl } from "./backend-url";
import { ApiError } from "./client";

type BackendRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function authenticatedApiRequest<T>(
  backendPath: string,
  options: BackendRequestOptions = {},
): Promise<T> {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    throw new ApiError("The backend URL is not configured on the server.");
  }

  const accessToken = (await cookies()).get(AUTH_COOKIES.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    throw new ApiError("You must be signed in to perform this request.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${backendUrl}${backendPath}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError("Unable to reach the backend service.");
    }

    throw error;
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      response.ok
        ? "The backend returned an invalid response."
        : `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    if (payload && typeof payload === "object" && "message" in payload) {
      const backendMessage = payload.message;

      if (typeof backendMessage === "string" && backendMessage.trim()) {
        message = backendMessage;
      } else if (
        Array.isArray(backendMessage) &&
        backendMessage.every((item) => typeof item === "string")
      ) {
        message = backendMessage.join(" ");
      }
    }

    throw new ApiError(message, response.status);
  }

  return payload as T;
}
