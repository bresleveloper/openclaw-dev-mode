import type { OpenClawConfig } from "../config/types.js";
import { type InputFileLimits } from "../media/input-files.js";
/** Resolved inbound file limits plus whether the operator pinned an explicit MIME allowlist. */
export type FileExtractionLimits = InputFileLimits & {
    allowedMimesConfigured: boolean;
};
/** Builds inbound attachment extraction limits, sized to the agent's media/PDF config. */
export declare function resolveFileExtractionLimits(cfg: OpenClawConfig): FileExtractionLimits;
