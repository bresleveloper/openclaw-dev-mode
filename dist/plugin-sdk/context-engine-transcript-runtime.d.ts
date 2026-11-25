import { Dw as SessionTranscriptVisibleMessageDeltaResult, Ew as SessionTranscriptVisibleMessageDeltaParams, Ow as readSessionTranscriptReplayGroups, Tw as SessionTranscriptReplayGroupsParams, XT as SessionTranscriptReplayGroup, kw as readSessionTranscriptVisibleMessageDelta, ww as SessionTranscriptMessageEntry } from "../config-contracts-hzlacViZ.js";
/**
 * Thrown when a transcript read crosses the current-turn admission fence, such as a
 * stored cursor that already passed the admitted user message during bootstrap or assembly.
 */
export declare class SessionTranscriptReadFenceError extends Error {
  constructor(message: string);
}
export { type SessionTranscriptMessageEntry, type SessionTranscriptReplayGroup, type SessionTranscriptReplayGroupsParams, type SessionTranscriptVisibleMessageDeltaParams, type SessionTranscriptVisibleMessageDeltaResult, readSessionTranscriptReplayGroups, readSessionTranscriptVisibleMessageDelta };