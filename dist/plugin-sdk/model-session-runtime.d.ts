import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { T as InternalSessionEntry, k as SessionEntry } from "../reply-payload-DazZPys5.js";
import { v as PluginMetadataSnapshot } from "../io-CwO8iq4h.js";
import "../types-C-BtfS0H.js";
import { _ as ModelCatalogEntry, c as ModelVisibilityPolicy } from "../defaults-D0SAbcb2.js";
import { bs as resolveSessionModelRef, od as StickyModelSelectionDispatchOutcome } from "../agent-harness-runtime-DZjstJNb.js";
import "../types-BooLarQr.js";
import { n as ThinkLevel } from "../thinking.shared-BC6c30Ed.js";
import { t as AgentModelPrimaryWriteTarget } from "../agent-scope-CQBriA71.js";
import "../model-visibility-policy-DQTUSh5_.js";
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
//#endregion
//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
//#endregion
//#region src/channels/model-overrides.d.ts
/** Resolved model override for a channel conversation plus the config key that matched. */
type ChannelModelOverride = {
  channel: string;
  model: string;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};
type ChannelModelOverrideParams = {
  cfg: OpenClawConfig;
  channel?: string | null;
  groupId?: string | null;
  groupChatType?: string | null;
  groupChannel?: string | null;
  groupSubject?: string | null;
  parentSessionKey?: string | null;
  directUserIds?: (string | null | undefined)[];
};
/** Resolves a channel-scoped model override from direct, parent, and wildcard config entries. */
export declare function resolveChannelModelOverride(params: ChannelModelOverrideParams): ChannelModelOverride | null;
//#endregion
//#region src/config/agent-limits.d.ts
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
export declare function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number;
//#endregion
//#region src/agents/session-runtime-compat.d.ts
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride" | "modelSelectionLocked" | "pluginOwnerId">;
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
export declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
//#endregion
//#region src/sessions/model-overrides.d.ts
/** User or automatic model/provider override selection for a session entry. */
type ModelOverrideSelection = {
  provider: string;
  model: string;
  isDefault?: boolean;
};
export declare const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
/** Raised when a caller attempts to mutate a locked session model selection. */
export declare class ModelSelectionLockedError extends Error {
  constructor(message?: string);
}
export declare function isModelSelectionLocked(entry: SessionEntry | undefined): boolean;
/** Applies a model/auth-profile override to a session entry and clears stale runtime fields. */
export declare function applyModelOverrideToSessionEntry(params: {
  entry: SessionEntry;
  selection: ModelOverrideSelection;
  profileOverride?: string;
  profileOverrideSource?: "auto" | "user";
  preserveAuthProfileOverride?: boolean;
  selectionSource?: "auto" | "user";
  explicitDefaultSelection?: boolean;
  markLiveSwitchPending?: boolean;
}): {
  updated: boolean;
};
//#endregion
//#region src/sessions/auth-profile-preservation.d.ts
type SessionAuthProfilePreservationParams = {
  cfg: OpenClawConfig;
  agentDir: string;
  entry: SessionEntry;
  currentProvider: string;
  provider: string;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
/** Applies a user model selection without dropping a compatible pinned auth profile. */
export declare function applyModelOverrideWithAuthProfileCompatibility(params: Omit<SessionAuthProfilePreservationParams, "provider"> & Omit<Parameters<typeof applyModelOverrideToSessionEntry>[0], "preserveAuthProfileOverride">): {
  updated: boolean;
};
//#endregion
//#region src/plugin-sdk/model-session-runtime.d.ts
export declare const applySessionModelSelection: (params: ApplySessionModelSelectionParams) => Promise<ApplySessionModelSelectionResult>;
//#endregion
export { type ApplySessionModelSelectionParams, type ApplySessionModelSelectionResult, type SessionModelSelectionRequest, resolveSessionModelRef };