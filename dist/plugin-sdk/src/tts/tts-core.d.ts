import { requireApiKey } from "../agents/model-auth.js";
import { prepareSimpleCompletionModel } from "../agents/simple-completion-runtime.js";
import type { OpenClawConfig } from "../config/types.js";
import { completeSimple } from "../llm/stream.js";
import type { ResolvedTtsConfig } from "./tts-types.js";
export { normalizeApplyTextNormalization, normalizeLanguageCode, normalizeSeed, requireInRange, scheduleCleanup, } from "./tts-provider-helpers.js";
type SummarizeTextDeps = {
    completeSimple: typeof completeSimple;
    prepareSimpleCompletionModel: typeof prepareSimpleCompletionModel;
    requireApiKey: typeof requireApiKey;
};
type SummarizeResult = {
    summary: string;
    latencyMs: number;
    inputLength: number;
    outputLength: number;
};
/** Summarize long text before synthesis using the configured summary model. */
export declare function summarizeText(params: {
    text: string;
    targetLength: number;
    cfg: OpenClawConfig;
    config: ResolvedTtsConfig;
    timeoutMs: number;
}, deps?: SummarizeTextDeps): Promise<SummarizeResult>;
