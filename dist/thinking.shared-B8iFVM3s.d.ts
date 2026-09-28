import { w as ThinkingLevelMap } from "./types.openclaw-LzSbb55e.js";
//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
declare const ALL_THINKING_LEVELS: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "adaptive", "max", "ultra"];
type ThinkLevel = (typeof ALL_THINKING_LEVELS)[number];
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Prepared model catalog fields reused while choosing and dispatching a queued runtime. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  nativeRuntime?: string;
  api?: string;
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  thinkingLevelMap?: ThinkingLevelMap;
  input?: readonly ("text" | "image" | "audio" | "video" | "document")[];
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportsReasoningEffort?: boolean;
    supportedReasoningEfforts?: readonly string[] | null;
    reasoningEffortMap?: Record<string, string>;
  } | null;
};
//#endregion
export { VerboseLevel as i, ThinkLevel as n, ThinkingCatalogEntry as r, ReasoningLevel as t };