import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address.").max(254),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(72, "Password must be no more than 72 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Include an uppercase letter, a lowercase letter, and a number.",
    ),
});

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be no more than 30 characters.")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Use only letters, numbers, periods, underscores, and hyphens.",
    ),
  email: z
    .string()
    .email("Enter a valid email address.")
    .max(254, "Email must be no more than 254 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be no more than 72 characters."),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(80, "First name must be no more than 80 characters."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(80, "Last name must be no more than 80 characters."),
  gender: z.enum(["male", "female", "other"], {
    error: "Choose a gender.",
  }),
  image: z
    .string()
    .max(2048, "Image URL must be no more than 2048 characters.")
    .optional(),
});



export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type AuthMode = "login" | "signup";
