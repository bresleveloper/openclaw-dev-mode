/**
 * Auth profile display labels.
 * Combines profile ids with configured human metadata for CLI/status output.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "./types.js";
/** Builds the human-readable profile label used in status and auth listings. */
export declare function resolveAuthProfileDisplayLabel(params: {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    profileId: string;
}): string;
