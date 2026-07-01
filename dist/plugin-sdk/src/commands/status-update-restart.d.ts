import type { RestartSentinelPayload } from "../infra/restart-sentinel.js";
type Formatter = (value: string) => string;
/** Returns the one-line update restart status value, or null when no update sentinel applies. */
export declare function formatUpdateRestartStatusValue(payload: RestartSentinelPayload | null | undefined, opts?: {
    ok?: Formatter;
    warn?: Formatter;
    muted?: Formatter;
    nowMs?: number;
    formatTimeAgo?: (ageMs: number) => string;
}): string | null;
/** Returns follow-up action lines for update restart failures or pending handoffs. */
export declare function formatUpdateRestartActionLines(payload: RestartSentinelPayload | null | undefined): string[];
export {};
