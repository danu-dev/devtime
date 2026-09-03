import crypto from "crypto";
import { prisma } from "./db";

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function verifyApiKey(key: string) {
  if (!key.startsWith("devtime_")) return null;
  const hash = hashApiKey(key);
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
    include: { user: true },
  });
  if (!apiKey || apiKey.revokedAt) return null;
  
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });
  
  return apiKey.user;
}
