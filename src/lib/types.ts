// ---- Resposta crua do Bunny (só os campos que usamos) ----
export interface BunnyChapter { title: string; start: number; end: number }

export interface BunnyVideo {
  guid: string;
  title: string;
  dateUploaded: string;
  length: number; // segundos
  status: number; // 3 = transcoding (já reproduz), 4 = finished
  width: number;
  height: number;
  availableResolutions: string | null; // "240p,360p,720p"
  collectionId: string | null;
  thumbnailFileName: string | null;
  chapters?: BunnyChapter[];
}

export interface BunnyList<T> {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  items: T[];
}

export interface BunnyCollection {
  guid: string;
  name: string;
  videoCount: number;
}

// ---- O que o teu app Kobweb recebe (contrato estável) ----
export interface VideoSummaryDto {
  id: string;
  title: string;
  lengthSeconds: number;
  thumbnailUrl: string | null;
  collectionId: string | null;
  dateUploaded: string;
  playable: boolean;
  resolutions: string[];
}

export interface VideoDetailDto extends VideoSummaryDto {
  width: number;
  height: number;
  chapters: BunnyChapter[];
  playback: { embedUrl: string; expiresAt: number };
}

export interface VideoPageDto {
  totalItems: number;
  page: number;
  perPage: number;
  items: VideoSummaryDto[];
}

export interface CollectionDto {
  id: string;
  name: string;
  videoCount: number;
}
