import type { OpenClawConfig } from "../../../config/types.js";
/** Normalize legacy Talk provider/realtime fields into current talk.providers and talk.realtime. */
export declare function normalizeLegacyTalkConfig(cfg: OpenClawConfig, changes: string[]): OpenClawConfig;
