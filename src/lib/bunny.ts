import { env } from "./env";
import { HttpError } from "./errors";
import type { BunnyCollection, BunnyList, BunnyVideo } from "./types";

const BASE_URL = "https://video.bunnycdn.com";

// Só existe GET aqui: é isto que garante o "read only".
async function bunnyGet<T>(
  path: string,
  query: Record<string, string | number | undefined> = {},
  revalidateSeconds = 60,
): Promise<T> {
  const url = new URL(`${BASE_URL}/library/${env.libraryId}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { AccessKey: env.apiKey, accept: "application/json" },
    next: { revalidate: revalidateSeconds },
  });

  if (res.status === 404) throw new HttpError(404, "Não encontrado");
  if (!res.ok) throw new HttpError(502, `Erro no Bunny (${res.status})`);
  return (await res.json()) as T;
}

export function listVideos(opts: {
  page: number;
  perPage: number;
  search?: string;
  collection?: string;
}) {
  return bunnyGet<BunnyList<BunnyVideo>>("/videos", {
    page: opts.page,
    itemsPerPage: opts.perPage,
    search: opts.search,
    collection: opts.collection,
    orderBy: "date",
  });
}

export function getVideo(id: string) {
  return bunnyGet<BunnyVideo>(`/videos/${id}`);
}

export function listCollections() {
  return bunnyGet<BunnyList<BunnyCollection>>("/collections", {
    page: 1,
    itemsPerPage: 100,
    orderBy: "date",
  });
}
