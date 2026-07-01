/**
 * Reads configured embedded-run model fallback availability.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/**
 * Resolves whether this embedded run has any model fallback path available.
 * Per-run overrides are authoritative so compaction/replay callers can force
 * either a fallback lane or a no-fallback lane independent of agent defaults.
 */
export declare function hasEmbeddedRunConfiguredModelFallbacks(params: {
    cfg: OpenClawConfig | undefined;
    agentId?: string | null;
    sessionKey?: string | null;
    modelFallbacksOverride?: string[];
}): boolean;
