import type { LoginFormValues, SignupFormValues } from "@/schemas/auth.schema";
import type { AuthUser } from "@/types/auth";

import { apiRequest } from "./client";
import { API, API_METHOD } from "./routes";

export function signUp(values: SignupFormValues) {
  const payload = {
    ...values,
    image: values.image || undefined,
  };

  return apiRequest<AuthUser>(API.SIGN_UP, {
    method: API_METHOD.POST,
    body: JSON.stringify(payload),
  });
}

export function logIn(values: LoginFormValues) {
  return apiRequest<AuthUser>(API.LOGIN, {
    method: API_METHOD.POST,
    body: JSON.stringify(values),
  });
}
