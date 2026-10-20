import { listVideos } from "@/lib/bunny";
import { toSummary } from "@/lib/mappers";
import { assertGuid, clampInt } from "@/lib/params";
import { preflight, route } from "@/lib/http";
import type { VideoPageDto } from "@/lib/types";

export const OPTIONS = preflight;

// GET /api/videos?page=1&perPage=24&search=kotlin&collection=<guid>
export const GET = route(async (req): Promise<VideoPageDto> => {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");

  const result = await listVideos({
    page: clampInt(searchParams.get("page"), 1, 1, 10_000),
    perPage: clampInt(searchParams.get("perPage"), 24, 1, 100),
    search: searchParams.get("search") ?? undefined,
    collection: collection ? assertGuid(collection, "collection") : undefined,
  });

  return {
    totalItems: result.totalItems,
    page: result.currentPage,
    perPage: result.itemsPerPage,
    items: result.items.map(toSummary),
  };
});
