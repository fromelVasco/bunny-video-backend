import { getVideo } from "@/lib/bunny";
import { toDetail } from "@/lib/mappers";
import { assertGuid } from "@/lib/params";
import { preflight, route } from "@/lib/http";
import type { VideoDetailDto } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export const OPTIONS = preflight;

// GET /api/videos/<guid>  -> detalhes + embed URL assinado (token novo a cada pedido)
export const GET = route<Ctx>(async (_req, { params }): Promise<VideoDetailDto> => {
  const { id } = await params;
  return toDetail(await getVideo(assertGuid(id)));
});
