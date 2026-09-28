import { di as ResolveMarkdownTableModeParams } from "./agent-harness-runtime-CWL0fcg5.js";
import { L as ResolvedTalkConfig, R as TalkConfig, r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { S as MarkdownTableMode, f as ContextVisibilityMode } from "./types.base-CA0_JvyZ.js";
import "./types.secrets-BR-Cncxg.js";
import "./templating-OpWn1DzT.js";
import "./io-VMpaZk90.js";
import "./types-BnfxNjkF.js";
import "./config-CTir7RIz.js";
import "./agent-scope-D4U2tjwQ.js";
import "./group-policy-97-PrELL.js";
import "./plugin-config-runtime-DuRG7cDS.js";
import "./shared-B4Gq6l9B.js";
import "./model-overrides-Bzi8Yz4b.js";
import "./context-visibility-CNXHuDNv.js";
import "./runtime-group-policy-8hMlgo_G.js";
import "./commands-BaU6RL1u.js";
import "./resolve-configured-secret-input-string-DjIp2-SP.js";
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