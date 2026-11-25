import { n as MediaFact } from "./media-facts-CgEpeeNR.js";
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
export { HistoryMediaEntry as n, HistoryEntry as t };