import crypto from "crypto";
import { ApiKeyRepository } from "../repositories/apiKey.repository";

export class AuthService {
  static async authenticateApiKey(authHeader: string | null) {
    if (!authHeader) return null;

    const rawKey = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!rawKey) return null;

    const keyRecord = await ApiKeyRepository.findActiveByHashOrRaw(rawKey);
    if (!keyRecord) return null;

    await ApiKeyRepository.touchLastUsed(keyRecord.id);
    return keyRecord.user;
  }

  static async generateApiKey(userId: string, name: string = "Default Key") {
    const rawKey = "devtime_" + crypto.randomBytes(24).toString("hex");
    const keyHash = ApiKeyRepository.hashKey(rawKey);

    const record = await ApiKeyRepository.create(userId, name, keyHash, rawKey);
    return {
      id: record.id,
      name: record.name,
      rawKey,
    };
  }

  static async deleteApiKey(keyId: string, userId: string) {
    return ApiKeyRepository.delete(keyId, userId);
  }

  static async revokeApiKey(keyId: string, userId: string) {
    return ApiKeyRepository.revoke(keyId, userId);
  }

  static async listUserKeys(userId: string) {
    return ApiKeyRepository.listByUser(userId);
  }
}
