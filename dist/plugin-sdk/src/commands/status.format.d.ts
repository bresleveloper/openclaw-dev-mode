import { formatTokenCount } from "../utils/token-format.js";
import type { SessionStatus } from "./status.types.js";
export { shortenText } from "./text-format.js";
export declare const formatKTokens: typeof formatTokenCount;
/** Formats a duration or returns `unknown` for missing/non-finite values. */
export declare const formatDuration: (ms: number | null | undefined) => string;
/** Formats session token usage and prompt-cache hit rate for the sessions table. */
export declare const formatTokensCompact: (sess: Pick<SessionStatus, "inputTokens" | "totalTokens" | "contextTokens" | "percentUsed" | "cacheRead" | "cacheWrite">) => string;
/** Formats prompt-cache details for verbose sessions table output. */
export declare const formatPromptCacheCompact: (sess: Pick<SessionStatus, "inputTokens" | "totalTokens" | "cacheRead" | "cacheWrite">) => string;
/** Formats daemon runtime status plus launchd/systemd details into one compact string. */
export declare const formatDaemonRuntimeShort: (runtime?: {
    status?: string;
    pid?: number;
    state?: string;
    systemd?: {
        killMode?: string;
        tasksCurrent?: number;
        memoryCurrent?: number;
    };
    detail?: string;
    missingUnit?: boolean;
}) => string | null;
