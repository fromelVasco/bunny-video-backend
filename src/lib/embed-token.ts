import { createHash } from "node:crypto";
import { env } from "./env";

/**
 * Embed view token authentication do Bunny Stream:
 *   token = SHA256_HEX( chaveSecreta + videoId + expires )
 *   url   = https://iframe.mediadelivery.net/embed/{library}/{video}?token=...&expires=...
 */
export function signEmbedUrl(videoId: string, ttlSeconds: number) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const token = createHash("sha256")
    .update(env.embedTokenKey + videoId + expires)
    .digest("hex");

  const url = new URL(`https://iframe.mediadelivery.net/embed/${env.libraryId}/${videoId}`);
  url.searchParams.set("token", token);
  url.searchParams.set("expires", String(expires));

  return { embedUrl: url.toString(), expiresAt: expires };
}
