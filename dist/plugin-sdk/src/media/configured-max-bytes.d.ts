import { type MediaKind } from "@openclaw/media-core/constants";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves the global generated-media byte cap from the user-facing MB config value. */
export declare function resolveConfiguredMediaMaxBytes(cfg?: OpenClawConfig): number | undefined;
/** Returns the configured media cap, falling back to the media-core per-kind default. */
export declare function resolveGeneratedMediaMaxBytes(cfg: OpenClawConfig | undefined, kind: MediaKind): number;
/** Reads channel/account media caps from raw channel config without requiring typed account schemas. */
export declare function resolveChannelAccountMediaMaxMb(params: {
    cfg: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): number | undefined;
