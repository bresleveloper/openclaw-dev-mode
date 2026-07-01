import type { AgentCompactionMode } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ContextEngineInfo } from "../context-engine/types.js";
export declare const DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
type AgentSettingsManagerLike = {
    getCompactionReserveTokens: () => number;
    getCompactionKeepRecentTokens: () => number;
    applyOverrides: (overrides: {
        compaction: {
            reserveTokens?: number;
            keepRecentTokens?: number;
        };
    }) => void;
    setCompactionEnabled?: (enabled: boolean) => void;
};
/** Applies configured compaction reserve/keep-recent settings to an agent settings manager. */
export declare function applyAgentCompactionSettingsFromConfig(params: {
    settingsManager: AgentSettingsManagerLike;
    cfg?: OpenClawConfig;
    /** When known, the resolved context window budget for the current model. */
    contextTokenBudget?: number;
}): {
    didOverride: boolean;
    compaction: {
        reserveTokens: number;
        keepRecentTokens: number;
    };
};
/** Resolve the compaction mode after provider-backed safeguard promotion. */
export declare function resolveEffectiveCompactionMode(cfg?: OpenClawConfig): AgentCompactionMode;
/**
 * Detect providers whose shared model runtime `isContextOverflow` Case 2 (silent overflow)
 * fires on a successful turn and triggers OpenClaw runtime's `_runAutoCompaction` from
 * inside `Session.prompt()`, collapsing `agent.state.messages` before the
 * provider call (openclaw#75799).
 *
 * True on any of: `zai-native` endpoint class, normalized provider id `zai`,
 * a `z-ai/` / `openrouter/z-ai/` model-id namespace prefix, or a bare `glm-`
 * model id (no namespace prefix) — the latter covers in-house gateways that
 * expose Zhipu's GLM family directly without a `z-ai/` qualifier. Intentionally
 * narrow: namespaced GLM ids that route through other providers (e.g.
 * `ollama/glm-*`, `opencode-go/glm-*`) are NOT included because their hosts
 * have their own overflow accounting and may not exhibit the z.ai silent-
 * overflow shape. Other providers documented as silently truncating are not
 * added without a reproducible repro.
 */
export declare function isSilentOverflowProneModel(model: {
    provider?: string | null;
    modelId?: string | null;
    baseUrl?: string | null;
}): boolean;
/**
 * Apply the auto-compaction guard. Callers that reload a `DefaultResourceLoader`
 * MUST call this AGAIN after each `reload()` — `settingsManager.reload()`
 * rehydrates `compaction.enabled` from disk and silently restores OpenClaw runtime's
 * default-on behavior, undoing the guard. Mirrors the existing
 * `applyAgentCompactionSettingsFromConfig` re-call pattern at the same sites.
 */
export declare function applyAgentAutoCompactionGuard(params: {
    settingsManager: AgentSettingsManagerLike;
    contextEngineInfo?: ContextEngineInfo;
    compactionMode?: AgentCompactionMode;
    silentOverflowProneProvider?: boolean;
}): {
    supported: boolean;
    disabled: boolean;
};
export {};
