export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

function getResponseErrorMessage(payload: unknown, status: number) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

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

  return `Request failed with status ${status}.`;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(path, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        "Unable to reach the server. Check your connection and try again.",
      );
    }

    throw error;
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        `Request failed with status ${response.status}.`,
        response.status,
      );
    }

    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      getResponseErrorMessage(payload, response.status),
      response.status,
    );
  }

  return payload as T;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
