import { cookies } from "next/headers";
import { connection } from "next/server";
import crypto from "node:crypto";

const COOKIE_NAME = "laporku_admin_session";

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET harus diisi minimal 16 karakter di environment.",
    );
  }
  return secret;
}

function signPayload(payloadB64: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");
}

export function createSessionToken(maxAgeSeconds = 60 * 60 * 24): string {
  const secret = getSessionSecret();
  const payload = {
    role: "admin",
    exp: Date.now() + maxAgeSeconds * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = signPayload(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return false;

  try {
    const secret = getSessionSecret();
    const expectedSig = signPayload(payloadB64, secret);
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as {
      role?: string;
      exp?: number;
    };
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
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
