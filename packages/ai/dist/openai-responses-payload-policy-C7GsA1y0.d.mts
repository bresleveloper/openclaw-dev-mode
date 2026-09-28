//#region packages/ai/src/transports/openai-responses-payload-policy.d.ts
type OpenAIResponsesPayloadModel = {
  api?: unknown;
  baseUrl?: unknown;
  id?: unknown;
  provider?: unknown;
  contextTokens?: unknown;
  contextWindow?: unknown;
  compat?: unknown;
};
type OpenAIResponsesPayloadPolicyOptions = {
  extraParams?: Record<string, unknown>;
  storeMode?: "provider-policy" | "transport-default" | "disable" | "preserve";
  enablePromptCacheStripping?: boolean;
  enableServerCompaction?: boolean;
};
type OpenAIResponsesPayloadPolicy = {
  allowsServiceTier: boolean;
  compactThreshold: number | undefined;
  defaultManagedReasoningEffort: "none" | undefined;
  explicitContinuationOptIn: boolean;
  explicitStore: boolean | undefined;
  shouldStripDisabledReasoningPayload: boolean;
  shouldStripInputStatus: boolean;
  shouldStripPromptCache: boolean;
  shouldStripStore: boolean;
  useServerCompaction: boolean;
  usesInstructionsField: boolean;
};
/** Resolve the server-compaction gate and effective threshold for a Responses route. */
declare function resolveOpenAIResponsesServerCompactionPlan(model: OpenAIResponsesPayloadModel, extraParams?: Record<string, unknown>): {
  enabled: boolean;
  threshold: number | undefined;
};
/** Resolve the Responses compact-endpoint gate for one route and compaction purpose. */
declare function resolveOpenAIResponsesCompactEndpointPlan(model: OpenAIResponsesPayloadModel, extraParams?: Record<string, unknown>, purpose?: "manual" | "budget"): {
  enabled: boolean;
};
/** Resolve payload mutation policy for one OpenAI Responses-style model endpoint. */
declare function resolveOpenAIResponsesPayloadPolicy(model: OpenAIResponsesPayloadModel, options?: OpenAIResponsesPayloadPolicyOptions): OpenAIResponsesPayloadPolicy;
/** Mutate a Responses request payload according to the resolved endpoint policy. */
declare function applyOpenAIResponsesPayloadPolicy(payloadObj: Record<string, unknown>, policy: OpenAIResponsesPayloadPolicy): void;
//#endregion
export { resolveOpenAIResponsesServerCompactionPlan as i, resolveOpenAIResponsesCompactEndpointPlan as n, resolveOpenAIResponsesPayloadPolicy as r, applyOpenAIResponsesPayloadPolicy as t };