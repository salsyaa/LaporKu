import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "laporku_admin_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET belum diatur atau terlalu pendek.");
  }
  return secret;
}

function signValue(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + 1000 * 60 * 60 * 12 }),
  ).toString("base64url");
  const sig = signValue(payload, getSessionSecret());
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, sig] = parts;
  const expectedSig = signValue(payload, getSessionSecret());

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    return (
      parsed.role === "admin" &&
      typeof parsed.exp === "number" &&
      parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
