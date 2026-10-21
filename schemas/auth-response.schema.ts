import { z } from "zod";

const addressSchema = z.object({
  id: z.string(),
  formattedAddress: z.string(),
});

const businessSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  addresses: z.array(addressSchema),
});

export const authResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["male", "female", "other"]),
  role: z.string(),
  image: z.string().optional(),
  sellerEnabled: z.boolean(),
  businesses: z.array(businessSchema),
  latestSelectedAddress: addressSchema.nullable().optional(),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});
