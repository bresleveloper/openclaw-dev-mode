import { Gd as StickyModelSelectionDispatchOutcome, od as resolveSessionModelRef } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { H as InternalSessionEntry, K as SessionEntry } from "../templating-OpWn1DzT.js";
import { b as PluginMetadataSnapshot } from "../io-VMpaZk90.js";
import "../types-Bl4TRRJl.js";
import { n as ThinkLevel } from "../thinking.shared-B8iFVM3s.js";
import { h as ModelCatalogEntry, o as ModelVisibilityPolicy } from "../model-selection-BjQV-P1s.js";
import { t as AgentModelPrimaryWriteTarget } from "../agent-scope-D4U2tjwQ.js";
import { a as resolveAgentMaxConcurrent, i as isModelSelectionLocked, n as ModelSelectionLockedError, o as resolveChannelModelOverride, r as applyModelOverrideToSessionEntry, t as MODEL_SELECTION_LOCKED_MESSAGE } from "../model-overrides-Bzi8Yz4b.js";
//#region src/agents/session-runtime-compat.d.ts
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked" | "pluginOwnerId">;
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
export declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
//#endregion
//#region src/model-picker/apply-session-model-selection.d.ts
type SessionModelSelectionRequest = {
  provider: string;
  model: string;
  isDefault: boolean;
  resetToDefault?: true;
  alias?: string;
  profileOverride?: string;
  runtime: {
    kind: "unchanged";
  } | {
    kind: "clear";
  } | {
    kind: "set";
    runtime: string;
  };
};
type ApplySessionModelSelectionParams = {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  storePath?: string;
  sessionEntry: InternalSessionEntry;
  sessionStore: Record<string, InternalSessionEntry>;
  allowCreate?: boolean;
  defaultProvider: string;
  defaultModel: string;
  currentProvider: string;
  currentModel: string;
  modelPolicy?: Omit<ModelVisibilityPolicy, "catalog">;
  modelCatalog: readonly ModelCatalogEntry[];
  thinkingCatalog?: readonly ModelCatalogEntry[];
  canPersistStickyModelSelection?: boolean;
  stickyModelSelectionTarget?: AgentModelPrimaryWriteTarget;
  validateAuthProfileSelection?: () => string | undefined;
  request: SessionModelSelectionRequest;
  /** Raw directive text used only by the existing session patch hook. */
  patchModel?: string;
  markLiveSwitchPending: true;
};
type ApplySessionModelSelectionResult = {
  status: "applied";
  provider: string;
  model: string;
  effectiveModelRef: string;
  agentRuntime: string;
  changed: boolean;
  contextTokens: number;
  configuredDefaultUpdate?: StickyModelSelectionDispatchOutcome;
  runtimeChange?: {
    kind: "clear";
  } | {
    kind: "set";
    runtime: string;
  };
  thinkingRemap?: {
    from: ThinkLevel;
    to: ThinkLevel;
    provider: string;
    model: string;
  };
} | {
  status: "rejected";
  reason: "locked" | "not-allowed" | "invalid-runtime" | "unknown-provider";
  message: string;
} | {
  status: "conflict";
  message: string;
};
/** Applies one validated picker selection to the authoritative live session. */
export declare function applySessionModelSelection(params: ApplySessionModelSelectionParams): Promise<ApplySessionModelSelectionResult>;
//#endregion
//#region src/sessions/auth-profile-preservation.d.ts
type ModelOverrideSelection = {
  provider: string;
  model: string;
  isDefault?: boolean;
};
/** Applies a user model selection without dropping a compatible pinned auth profile. */
export declare function applyModelOverrideWithAuthProfileCompatibility(params: {
  cfg: OpenClawConfig;
  agentDir: string;
  entry: SessionEntry;
  currentProvider: string;
  selection: ModelOverrideSelection;
  profileOverride?: string;
  profileOverrideSource?: "auto" | "user";
  selectionSource?: "auto" | "user";
  explicitDefaultSelection?: boolean;
  markLiveSwitchPending?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
}): {
  updated: boolean;
};
//#endregion
export { type ApplySessionModelSelectionParams, type ApplySessionModelSelectionResult, MODEL_SELECTION_LOCKED_MESSAGE, ModelSelectionLockedError, type SessionModelSelectionRequest, applyModelOverrideToSessionEntry, isModelSelectionLocked, resolveAgentMaxConcurrent, resolveChannelModelOverride, resolveSessionModelRef };