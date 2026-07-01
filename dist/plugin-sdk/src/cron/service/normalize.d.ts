/** Name, agent id, and payload text normalization helpers for cron service ops. */
import { normalizeOptionalAgentId } from "../../routing/session-key.js";
import type { CronPayload } from "../types.js";
/** Normalizes a required cron job name and throws the public validation error when absent. */
export declare function normalizeRequiredName(raw: unknown): string;
/** Normalizes optional cron agent ids through the canonical session-key agent id rules. */
export { normalizeOptionalAgentId };
/** Infers a compact cron job name from payload text first, then schedule shape. */
export declare function inferCronJobName(job: {
    schedule?: {
        kind?: unknown;
        everyMs?: unknown;
        expr?: unknown;
    };
    payload?: {
        kind?: unknown;
        text?: unknown;
        message?: unknown;
        argv?: unknown;
    };
}): string;
/** Extracts the executable text from cron payload variants for main-session queueing. */
export declare function normalizePayloadToSystemText(payload: CronPayload): string;
