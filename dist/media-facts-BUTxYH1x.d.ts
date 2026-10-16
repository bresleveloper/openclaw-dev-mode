import { r as MediaKind } from "./constants-BCpSHoXd.js";
//#region src/media/media-facts.d.ts
/** One ordered runtime attachment; array position is its alignment identity. */
type MediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaKind;
  fileName?: string;
  /** Composer attachment provenance for display; never part of model input. */
  origin?: "paste" | "file";
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string;
  /** Internal proof that this exact fact was covered by a legacy staged projection. */
  staged?: boolean;
  hydrationSuppressed?: boolean;
};
type MediaFactInput = { [Key in keyof MediaFact]?: MediaFact[Key] | null; };
declare const LEGACY_MEDIA_CONTEXT_KEYS: readonly ["MediaPath", "MediaPaths", "MediaUrl", "MediaUrls", "MediaType", "MediaTypes", "MediaDir", "MediaTranscribedIndexes", "MediaStaged", "MediaWorkspaceDir"];
type LegacyMediaContextKey = (typeof LEGACY_MEDIA_CONTEXT_KEYS)[number];
type MediaFactLegacyProjection = {
  /** @deprecated Use `media[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Use `media.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
};
//#endregion
export { MediaFactLegacyProjection as i, MediaFact as n, MediaFactInput as r, LegacyMediaContextKey as t };