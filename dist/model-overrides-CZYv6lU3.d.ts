import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { o as SessionEntry } from "./types-DP8esrTo.js";
import { n as ChannelMatchSource } from "./channel-config-BBLiKj96.js";

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
declare function resolveChannelModelOverride(params: ChannelModelOverrideParams): ChannelModelOverride | null;
//#endregion
//#region src/config/agent-limits.d.ts
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
declare function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number;
//#endregion
//#region src/sessions/model-overrides.d.ts
/** User or automatic model/provider override selection for a session entry. */
type ModelOverrideSelection = {
  provider: string;
  model: string;
  isDefault?: boolean;
};
/** Applies a model/auth-profile override to a session entry and clears stale runtime fields. */
declare function applyModelOverrideToSessionEntry(params: {
  entry: SessionEntry;
  selection: ModelOverrideSelection;
  profileOverride?: string;
  profileOverrideSource?: "auto" | "user";
  preserveAuthProfileOverride?: boolean;
  selectionSource?: "auto" | "user";
  markLiveSwitchPending?: boolean;
}): {
  updated: boolean;
};
//#endregion
export { resolveAgentMaxConcurrent as n, resolveChannelModelOverride as r, applyModelOverrideToSessionEntry as t };