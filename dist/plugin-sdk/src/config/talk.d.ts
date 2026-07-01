import type { ResolvedTalkConfig, TalkConfig, TalkConfigResponse } from "./types.gateway.js";
import type { OpenClawConfig } from "./types.openclaw.js";
/**
 * Normalize persisted Talk config into the canonical provider/providers shape.
 * Legacy flat provider fields are ignored here so core config stays provider-agnostic.
 */
export declare function normalizeTalkSection(value: TalkConfig | undefined): TalkConfig | undefined;
/** Return a config copy with `talk` normalized when a valid Talk section is present. */
export declare function normalizeTalkConfig(config: OpenClawConfig): OpenClawConfig;
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
export declare function resolveActiveTalkProviderConfig(talk: TalkConfig | undefined): ResolvedTalkConfig | undefined;
/**
 * Build the gateway `talk.config` payload from persisted config.
 * The response includes canonical provider data plus the resolved provider when selection is unambiguous.
 */
export declare function buildTalkConfigResponse(value: unknown): TalkConfigResponse | undefined;
