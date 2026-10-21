import { handleAuthRequest } from "@/lib/api/auth-handler";
import { BACKEND_API } from "@/lib/api/routes";
import { signupSchema } from "@/schemas/auth.schema";

export function POST(request: Request) {
  return handleAuthRequest(request, BACKEND_API.SIGN_UP, signupSchema);
}
