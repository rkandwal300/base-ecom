export type AuthAddress = {
  id: string;
  formattedAddress: string;
};

export type AuthBusiness = {
  id: string;
  businessName: string;
  addresses: AuthAddress[];
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  role: string;
  image?: string;
  sellerEnabled: boolean;
  businesses: AuthBusiness[];
  latestSelectedAddress: AuthAddress | null;
};

export type AuthResponse = AuthUser & {
  accessToken: string;
  refreshToken: string;
};
