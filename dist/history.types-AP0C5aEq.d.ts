import { n as MediaFact } from "./media-facts-DFJC5G1o.js";
//#region src/auto-reply/reply/history.types.d.ts
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
//#endregion
export { HistoryMediaEntry as n, HistoryEntry as t };