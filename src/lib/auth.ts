import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "./env";
import { HttpError } from "./errors";

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

/**
 * Se FIREBASE_PROJECT_ID estiver definido, exige um Firebase ID token válido.
 * Sem isso, qualquer pessoa que descubra o URL da API recebe embed URLs assinados.
 */
export async function authorize(req: Request): Promise<void> {
  const projectId = env.firebaseProjectId;
  if (!projectId) return;

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Token em falta");

  try {
    await jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
  } catch (e: any) {
  console.error("jwtVerify falhou:", e?.code, e?.claim, e?.message);
  throw new HttpError(401, "Token inválido");
}
}
