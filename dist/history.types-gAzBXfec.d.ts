import { n as MediaFact } from "./media-facts-BUTxYH1x.js";
//#region src/auto-reply/reply/history.types.d.ts
/** Normalized history message used when building reply context. */
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
/** Media metadata attached to a normalized history message. */
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
//#endregion
export { HistoryMediaEntry as n, HistoryEntry as t };