import type { ModelCatalogEntry } from "../../agents/model-catalog.js";
import type { SessionEntry } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ThinkLevel } from "./directives.js";
export { resolveModelDirectiveSelection, type ModelDirectiveSelection, } from "./model-selection-directive.js";
type ModelCatalog = ModelCatalogEntry[];
type ModelSelectionState = {
    provider: string;
    model: string;
    allowedModelKeys: Set<string>;
    allowedModelCatalog: ModelCatalog;
    resetModelOverride: boolean;
    resetModelOverrideRef?: string;
    resetModelOverrideReason?: "disallowed" | "stale";
    resolveThinkingCatalog: () => Promise<ModelCatalog | undefined>;
    resolveDefaultThinkingLevel: () => Promise<ThinkLevel>;
    /** Default reasoning level from model capability: "on" if model has reasoning, else "off". */
    resolveDefaultReasoningLevel: () => Promise<"on" | "off">;
    needsModelCatalog: boolean;
    modelContextWindow?: number;
    modelContextTokens?: number;
};
/** Creates minimal model-selection state for fast test mode. */
export declare function createFastTestModelSelectionState(params: {
    agentCfg: NonNullable<NonNullable<OpenClawConfig["agents"]>["defaults"]> | undefined;
    provider: string;
    model: string;
}): ModelSelectionState;
/** Resolves provider/model, allowlist, catalog, and thinking defaults for a reply run. */
export declare function createModelSelectionState(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    agentCfg: NonNullable<NonNullable<OpenClawConfig["agents"]>["defaults"]> | undefined;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    parentSessionKey?: string;
    storePath?: string;
    defaultProvider: string;
    defaultModel: string;
    primaryProvider?: string;
    primaryModel?: string;
    provider: string;
    model: string;
    hasModelDirective: boolean;
    hasOneTurnModelOverride?: boolean;
    skipStoredModelOverride?: boolean;
    /** True when heartbeat.model was explicitly resolved for this run.
     *  In that case, skip session-stored overrides so the heartbeat selection wins. */
    hasResolvedHeartbeatModelOverride?: boolean;
    isHeartbeat?: boolean;
}): Promise<ModelSelectionState>;
/** Resolves the context window token count for the selected provider/model. */
export declare function resolveContextTokens(params: {
    cfg: OpenClawConfig;
    agentCfg: NonNullable<NonNullable<OpenClawConfig["agents"]>["defaults"]> | undefined;
    provider: string;
    model: string;
    modelContextWindow?: number;
    modelContextTokens?: number;
}): number;
