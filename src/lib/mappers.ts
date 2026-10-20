import { env } from "./env";
import { signEmbedUrl } from "./embed-token";
import type {
  BunnyCollection,
  BunnyVideo,
  CollectionDto,
  VideoDetailDto,
  VideoSummaryDto,
} from "./types";

export function toSummary(v: BunnyVideo): VideoSummaryDto {
  const cdn = env.cdnHostname;
  return {
    id: v.guid,
    title: v.title,
    lengthSeconds: v.length,
    thumbnailUrl: cdn && v.thumbnailFileName ? `https://${cdn}/${v.guid}/${v.thumbnailFileName}` : null,
    collectionId: v.collectionId || null,
    dateUploaded: v.dateUploaded,
    playable: v.status === 3 || v.status === 4,
    resolutions: v.availableResolutions ? v.availableResolutions.split(",") : [],
  };
}

export function toDetail(v: BunnyVideo): VideoDetailDto {
  // Token vale pelo menos a duração do vídeo + 10 min de folga
  const ttl = Math.max(env.tokenTtlSeconds, Math.ceil(v.length) + 600);
  const { embedUrl, expiresAt } = signEmbedUrl(v.guid, ttl);

  return {
    ...toSummary(v),
    width: v.width,
    height: v.height,
    chapters: v.chapters ?? [],
    playback: { embedUrl, expiresAt },
  };
}

export function toCollection(c: BunnyCollection): CollectionDto {
  return { id: c.guid, name: c.name, videoCount: c.videoCount };
}
