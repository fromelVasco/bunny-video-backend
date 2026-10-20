import { listCollections } from "@/lib/bunny";
import { toCollection } from "@/lib/mappers";
import { preflight, route } from "@/lib/http";
import type { CollectionDto } from "@/lib/types";

export const OPTIONS = preflight;

// GET /api/collections -> útil para organizar cursos/módulos
export const GET = route(async (): Promise<CollectionDto[]> => {
  const result = await listCollections();
  return result.items.map(toCollection);
});
