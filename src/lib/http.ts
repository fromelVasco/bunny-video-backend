import { NextResponse } from "next/server";
import { authorize } from "./auth";
import { env } from "./env";
import { HttpError } from "./errors";

function corsHeaders(req: Request): Headers {
  const headers = new Headers({ Vary: "Origin" });
  const origin = req.headers.get("origin");
  if (origin && env.allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

/** Resposta ao preflight CORS (o browser envia OPTIONS antes do GET com Authorization). */
export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

/** Envolve um handler: autentica, devolve JSON com CORS e trata erros. */
export function route<C = unknown>(handler: (req: Request, ctx: C) => Promise<unknown>) {
  return async (req: Request, ctx: C): Promise<Response> => {
    try {
      await authorize(req);
      const data = await handler(req, ctx);
      return NextResponse.json(data, { headers: corsHeaders(req) });
    } catch (err) {
      const known = err instanceof HttpError;
      if (!known) console.error(err);
      return NextResponse.json(
        { error: known ? err.message : "Erro interno" },
        { status: known ? err.status : 500, headers: corsHeaders(req) },
      );
    }
  };
}
