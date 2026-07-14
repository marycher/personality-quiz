import crypto from "crypto";

export function createAdminToken(): string {
  const timestamp = Date.now().toString();
  const secret = process.env.ADMIN_PASSWORD || "admin123";
  const hash = crypto.createHash("sha256").update(timestamp + secret).digest("hex");
  return `${timestamp}:${hash}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const [timestamp, hash] = token.split(":");
    const secret = process.env.ADMIN_PASSWORD || "admin123";
    const expectedHash = crypto.createHash("sha256").update(timestamp + secret).digest("hex");
    return hash === expectedHash;
  } catch {
    return false;
  }
}
