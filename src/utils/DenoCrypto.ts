import { encodeBase64Url, encodeHex } from "jsr:@std/encoding";
import { crypto, DigestAlgorithm } from "jsr:@std/crypto/crypto";

export class CryptoUtils {
  private static async getHash(
    str: string,
    algorithm: DigestAlgorithm,
    format: "hex" | "base64" = "hex"
  ) {
    const stringData = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest(algorithm, stringData);
    const hashArray = new Uint8Array(hash);
    return format === "hex" ? encodeHex(hashArray) : encodeBase64Url(hashArray);
  }

  static sha256(str: string, format: "hex" | "base64" = "hex") {
    return this.getHash(str, "SHA-256", format);
  }

  static uuid() {
    return crypto.randomUUID();
  }
}
