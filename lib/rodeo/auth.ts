// Family-password gate for the Rodeo Road Log.
//
// One shared password (RODEO_PASSWORD) unlocks the app for the whole family.
// On success we set an httpOnly cookie holding a hash of the password, so the
// raw password is never stored in the browser. Every Server Action re-checks
// this before touching data.

import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE_NAME = "rodeo_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

function expectedToken(): string | null {
  const pw = process.env.RODEO_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`rodeo:${pw}`).digest("hex");
}

/** True when a password is configured at all. */
export function isPasswordConfigured(): boolean {
  return !!process.env.RODEO_PASSWORD;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Check the submitted password and, if correct, set the session cookie. */
export async function signIn(password: string): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const token = createHash("sha256").update(`rodeo:${password}`).digest("hex");
  if (!safeEqual(token, expected)) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Is the current request authenticated? */
export async function isAuthed(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return safeEqual(token, expected);
}

/** Throw if not authenticated — call at the top of every mutating action. */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("Unauthorized");
  }
}
