import { l as normalizeOptionalString } from "./string-coerce-DJnd-JG-.js";
import { $c as SpeechProviderResolveConfigContext, Gc as SpeechListVoicesRequest, Hc as normalizeTtsAutoMode, Jc as SpeechProviderConfiguredContext, Kc as SpeechModelOverridePolicy, Qc as SpeechProviderPreparedSynthesis, Uc as SpeechDirectiveTokenParseContext, Vc as TTS_AUTO_MODES, Wc as SpeechDirectiveTokenParseResult, Xc as SpeechProviderOverrides, Zc as SpeechProviderPrepareSynthesisContext, al as SpeechSynthesisTarget, cl as TtsDirectiveOverrides, el as SpeechProviderResolveTalkConfigContext, il as SpeechSynthesisStreamResult, ll as TtsDirectiveParseResult, nl as SpeechSynthesisRequest, ol as SpeechTelephonySynthesisRequest, qc as SpeechProviderConfig, qn as SpeechProviderPlugin, rl as SpeechSynthesisStreamRequest, sl as SpeechVoiceOption, tl as SpeechProviderResolveTalkOverridesContext } from "./types-CXLy55Xw.js";
import { t as asBoolean } from "./boolean-CThIQsGO.js";
import { o as asFiniteNumber } from "./number-coercion-Ds_8dOjj.js";
import { a as createProviderHttpError, c as formatProviderErrorPayload, h as truncateErrorDetail, l as formatProviderHttpErrorMessage, m as readResponseTextLimited, o as extractProviderErrorDetail, r as assertOkOrThrowProviderError, s as extractProviderRequestId, t as asObject } from "./provider-http-errors-pGBIyBFy.js";
import { a as normalizeSpeechProviderId, c as normalizeLanguageCode, d as scheduleCleanup, i as listSpeechProviders, l as normalizeSeed, n as getSpeechProvider, o as parseTtsDirectives, s as normalizeApplyTextNormalization, t as canonicalizeSpeechProviderId, u as requireInRange } from "./provider-registry-CPumdCoe.js";

//#region src/tts/openai-compatible-speech-provider.d.ts
type OpenAiCompatibleSpeechProviderBaseConfig = {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  voice: string;
  speed?: number;
  responseFormat?: string;
};
/** Normalized config shape for OpenAI-compatible speech HTTP providers. */
type OpenAiCompatibleSpeechProviderConfig<ExtraConfig extends Record<string, unknown> = Record<string, never>> = OpenAiCompatibleSpeechProviderBaseConfig & ExtraConfig;
/** Base URL normalization policy for providers that share OpenAI-style endpoints. */
type OpenAiCompatibleSpeechProviderBaseUrlPolicy = {
  kind: "trim-trailing-slash";
} | {
  kind: "canonical";
  aliases?: readonly string[];
  allowCustom?: boolean;
};
/** Extra config field to forward into the JSON body under an optional request key. */
type OpenAiCompatibleSpeechProviderExtraJsonBodyField<ExtraConfig extends Record<string, unknown>> = {
  configKey: Extract<keyof ExtraConfig, string>;
  requestKey?: string;
};
/** Factory options for a speech provider backed by /audio/speech-compatible HTTP APIs. */
type OpenAiCompatibleSpeechProviderOptions<ExtraConfig extends Record<string, unknown> = Record<string, never>> = {
  id: string;
  label: string;
  autoSelectOrder: number;
  models: readonly string[];
  voices: readonly string[];
  defaultModel: string;
  defaultVoice: string;
  defaultBaseUrl: string;
  envKey: string;
  responseFormats: readonly string[];
  defaultResponseFormat: string;
  voiceCompatibleResponseFormats: readonly string[];
  baseUrlPolicy?: OpenAiCompatibleSpeechProviderBaseUrlPolicy;
  normalizeModel?: (value: string | undefined, fallback: string) => string;
  configKey?: string;
  extraHeaders?: Record<string, string>;
  readExtraConfig?: (raw: Record<string, unknown> | undefined) => ExtraConfig;
  extraJsonBodyFields?: readonly OpenAiCompatibleSpeechProviderExtraJsonBodyField<ExtraConfig>[];
  apiErrorLabel?: string;
  missingApiKeyError?: string;
};
/** Build a complete SpeechProviderPlugin for OpenAI-compatible speech endpoints. */
declare function createOpenAiCompatibleSpeechProvider<ExtraConfig extends Record<string, unknown> = Record<string, never>>(options: OpenAiCompatibleSpeechProviderOptions<ExtraConfig>): SpeechProviderPlugin;
//#endregion
export { type OpenAiCompatibleSpeechProviderBaseUrlPolicy, type OpenAiCompatibleSpeechProviderConfig, type OpenAiCompatibleSpeechProviderExtraJsonBodyField, type OpenAiCompatibleSpeechProviderOptions, type SpeechDirectiveTokenParseContext, type SpeechDirectiveTokenParseResult, type SpeechListVoicesRequest, type SpeechModelOverridePolicy, type SpeechProviderConfig, type SpeechProviderConfiguredContext, type SpeechProviderOverrides, type SpeechProviderPlugin, type SpeechProviderPrepareSynthesisContext, type SpeechProviderPreparedSynthesis, type SpeechProviderResolveConfigContext, type SpeechProviderResolveTalkConfigContext, type SpeechProviderResolveTalkOverridesContext, type SpeechSynthesisRequest, type SpeechSynthesisStreamRequest, type SpeechSynthesisStreamResult, type SpeechSynthesisTarget, type SpeechTelephonySynthesisRequest, type SpeechVoiceOption, TTS_AUTO_MODES, type TtsDirectiveOverrides, type TtsDirectiveParseResult, asBoolean, asFiniteNumber, asObject, assertOkOrThrowProviderError, canonicalizeSpeechProviderId, createOpenAiCompatibleSpeechProvider, createProviderHttpError, extractProviderErrorDetail, extractProviderRequestId, formatProviderErrorPayload, formatProviderHttpErrorMessage, getSpeechProvider, listSpeechProviders, normalizeApplyTextNormalization, normalizeLanguageCode, normalizeSeed, normalizeSpeechProviderId, normalizeTtsAutoMode, parseTtsDirectives, readResponseTextLimited, requireInRange, scheduleCleanup, normalizeOptionalString as trimToUndefined, truncateErrorDetail };