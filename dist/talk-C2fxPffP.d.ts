import { dt as TalkConfig, ut as ResolvedTalkConfig } from "./types.openclaw-DlpCUWMr.js";

//#region src/config/talk.d.ts
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
declare function resolveActiveTalkProviderConfig(talk: TalkConfig | undefined): ResolvedTalkConfig | undefined;
//#endregion
export { resolveActiveTalkProviderConfig as t };