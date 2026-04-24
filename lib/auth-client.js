import { createAuthClient } from "better-auth/react";

const authBaseURL =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL;

const authClientConfig = authBaseURL
  ? { baseURL: authBaseURL }
  : {};

export const { signIn, signUp, useSession, signOut } =
  createAuthClient(authClientConfig);
