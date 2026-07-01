import type { ReplyPayload } from "../types.js";
/** Returns true when text promises a reminder/follow-up without the guard note. */
export declare function hasUnbackedReminderCommitment(text: string): boolean;
/**
 * Returns true when the cron store has at least one enabled job that shares the
 * current session key. Used to suppress the "no reminder scheduled" guard note
 * when an existing cron (created in a prior turn) already covers the commitment.
 */
export declare function hasSessionRelatedCronJobs(params: {
    cronStorePath?: string;
    sessionKey?: string;
}): Promise<boolean>;
/** Appends the unscheduled-reminder note to the first payload that needs it. */
export declare function appendUnscheduledReminderNote(payloads: ReplyPayload[]): ReplyPayload[];
