/**
 * Resolves fast-mode state from agent config and runtime defaults.
 */
import type { FastMode } from "@openclaw/normalization-core/string-coerce";
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type FastModeSource } from "../shared/fast-mode.js";
export { DEFAULT_FAST_MODE_AUTO_ON_SECONDS, formatFastModeAutoLabel, formatFastModeAutoProgressText, formatFastModeCommandOptions, formatFastModeCurrentStatus, formatFastModeSourceSuffix, formatFastModeStatusValue, formatFastModeValue, normalizeFastModeAutoOnSeconds, normalizeFastModeSource, resolveFastModeForElapsed, resolveFastModeModelAutoOnSeconds, } from "../shared/fast-mode.js";
export type { FastMode } from "@openclaw/normalization-core/string-coerce";
export type { FastModeAutoProgressState } from "../shared/fast-mode.js";
type FastModeState = {
    mode: FastMode;
    enabled: boolean;
    source: FastModeSource;
    fastAutoOnSeconds: number;
};
/** Resolve the effective fast-mode setting and its source. */
export declare function resolveFastModeState(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    model: string;
    agentId?: string;
    sessionEntry?: Pick<SessionEntry, "fastMode"> | undefined;
}): FastModeState;
