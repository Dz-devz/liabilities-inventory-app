import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  }
);

let store: Record<string, unknown> = {};

// Session manager using Hono's cookie utilities
export const sessionManager = (c: Context): SessionManager => ({
  // Get a session item (from cookies)
  async getSessionItem(key: string) {
    return getCookie(c, key); // Returns the value of the cookie
  },

  // Set a session item (in cookies)
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true, // Makes the cookie inaccessible via JavaScript
      secure: true, // Ensures cookies are sent over HTTPS
      sameSite: "Lax", // Restricts cross-site sending of cookies
      maxAge: 60 * 60 * 24 * 7, // Set session/cookies expire to 7days
    } as const;

    // If the value is not a string, convert it to JSON
    const cookieValue =
      typeof value === "string" ? value : JSON.stringify(value);

    // Set the cookie
    setCookie(c, key, cookieValue, cookieOptions);
  },

  // Remove a session item (delete cookie)
  async removeSessionItem(key: string) {
    deleteCookie(c, key); // Removes the cookie with the given key
  },

  // Destroy the entire session (remove multiple cookies)
  async destroySession() {
    const sessionKeys = ["id_token", "access_token", "user", "refresh_token"];

    // Loop through each session key and delete the associated cookie
    sessionKeys.forEach((key) => deleteCookie(c, key));
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getProfile = createMiddleware<Env>(async (c, next) => {
  try {
    const seshManager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(seshManager);
    if (!isAuthenticated) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = await kindeClient.getUserProfile(seshManager);
    c.set("user", user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: "Unauthorized" }, 401);
  }
});
