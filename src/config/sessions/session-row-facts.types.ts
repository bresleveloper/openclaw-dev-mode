import type { SessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-read.js";
import type { SessionEntrySummary } from "./session-accessor.types.js";

/** Exact database facts shared by durable row readers and projection consumers. */
export type SessionRowDatabaseFacts = SessionEntrySummary & {
  hasBoard: boolean;
  activitySummaryWatermark?: SessionTranscriptWatermark;
};
