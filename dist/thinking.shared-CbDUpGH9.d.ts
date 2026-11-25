import { yt as ModelCatalogContextWindowOption } from "./types.openclaw-D8uW-XQA.js";
import { w as ThinkingLevelMap } from "./types-B1zI2CfC.js";
/** Canonical thinking level values accepted by chat commands and session state. */
declare const ALL_THINKING_LEVELS: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "adaptive", "max", "ultra"];
type ThinkLevel = (typeof ALL_THINKING_LEVELS)[number];
type VerboseLevel = "off" | "on" | "full";
type TraceLevel = "off" | "on" | "raw";
type ElevatedLevel = "off" | "on" | "ask" | "full";
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
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextWindowSource?: "synthetic";
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
    defaultThinkingLevel?: string;
    thinkingLevels?: readonly string[];
    adaptiveThinking?: boolean;
    thinkingRequired?: boolean;
    thinkingLevelLabels?: Record<string, string>;
  } | null;
};
export { TraceLevel as a, ThinkingCatalogEntry as i, ReasoningLevel as n, VerboseLevel as o, ThinkLevel as r, ElevatedLevel as t };