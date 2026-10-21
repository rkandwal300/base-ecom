export const API = {
  SIGN_UP: "/api/auth/signup",
  LOGIN: "/api/auth/login",
} as const;

export const BACKEND_API = {
  SIGN_UP: "/auth/signup",
  LOGIN: "/auth/login",
} as const;

export const API_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;
