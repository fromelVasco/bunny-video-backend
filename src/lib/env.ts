function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente em falta: ${name}`);
  return value;
}

// Getters: só são lidos quando o pedido chega (não rebenta no build).
export const env = {
  get libraryId() { return required("BUNNY_LIBRARY_ID"); },
  get apiKey() { return required("BUNNY_API_KEY"); },
  get embedTokenKey() { return required("BUNNY_EMBED_TOKEN_KEY"); },
  get cdnHostname() { return process.env.BUNNY_CDN_HOSTNAME || null; },
  get tokenTtlSeconds() { return Number(process.env.EMBED_TOKEN_TTL_SECONDS) || 14400; },
  get allowedOrigins() {
    return (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
  get firebaseProjectId() { return process.env.FIREBASE_PROJECT_ID || null; },
};
