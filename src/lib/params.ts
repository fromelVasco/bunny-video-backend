import { HttpError } from "./errors";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertGuid(value: string, label = "id"): string {
  if (!GUID.test(value)) throw new HttpError(400, `${label} inválido`);
  return value;
}

export function clampInt(raw: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
