import { di as ResolveMarkdownTableModeParams } from "./agent-harness-runtime-wMciqZ6Z.js";
import { L as ResolvedTalkConfig, R as TalkConfig, r as OpenClawConfig } from "./types.openclaw-Ccmw-oTa.js";
import { S as MarkdownTableMode, f as ContextVisibilityMode } from "./types.base-CA0_JvyZ.js";
import "./types.secrets-BR-Cncxg.js";
import "./templating-0ElMwhje.js";
import "./io-BuIvr25R.js";
import "./types-BaRTNmIt.js";
import "./config-Dt1SOlIN.js";
import "./agent-scope-BV0uIQk3.js";
import "./group-policy-3v_gkaet.js";
import "./plugin-config-runtime-DVyKSjzi.js";
import "./shared-FtkO8EP2.js";
import "./model-overrides-Cx3jfZIT.js";
import "./context-visibility-CNXHuDNv.js";
import "./runtime-group-policy-8hMlgo_G.js";
import "./commands-B1SXrQBi.js";
import "./resolve-configured-secret-input-string-CUBVEmh9.js";
//#region src/config/context-visibility.d.ts
type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      /**
       * Global default supplemental context visibility for channels without a local override.
       */
      contextVisibility?: ContextVisibilityMode;
    };
  };
};
/** Reads the global channel default supplemental context visibility mode. */
declare function resolveDefaultContextVisibility(cfg: ContextVisibilityDefaultsConfig): ContextVisibilityMode | undefined;
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
declare function resolveChannelContextVisibilityMode(params: {
  /** Full OpenClaw config containing channel defaults and per-channel overrides. */
  cfg: OpenClawConfig;
  /** Channel id whose visibility policy is being resolved. */
  channel: string;
  /** Optional channel account id used for account-specific overrides. */
  accountId?: string | null;
  /** Runtime adapter override that takes precedence over config-backed policy. */
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode;
//#endregion
//#region src/config/markdown-tables.d.ts
declare function resolveMarkdownTableMode(params: ResolveMarkdownTableModeParams): MarkdownTableMode;
//#endregion
//#region src/config/talk.d.ts
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
declare function resolveActiveTalkProviderConfig(talk: TalkConfig | undefined): ResolvedTalkConfig | undefined;
//#endregion
//#region src/config/dangerous-name-matching.d.ts
type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};
type DangerousNameMatchingResolverInput = {
  providerConfig?: DangerousNameMatchingConfig | null | undefined;
  accountConfig?: DangerousNameMatchingConfig | null | undefined;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
declare function resolveDangerousNameMatchingEnabled(input: DangerousNameMatchingResolverInput): boolean;
//#endregion
export { resolveChannelContextVisibilityMode as a, resolveMarkdownTableMode as i, resolveDangerousNameMatchingEnabled as n, resolveDefaultContextVisibility as o, resolveActiveTalkProviderConfig as r, isDangerousNameMatchingEnabled as t };