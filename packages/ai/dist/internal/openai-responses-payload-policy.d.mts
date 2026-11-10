import { d as readOpenAIResponsesCompactionWindow, t as OPENAI_RESPONSES_APIS, u as OpenAIResponsesCompactionOutput } from "../openai-responses-contracts-B1nkeLL6.mjs";
import { a as resolveOpenAIResponsesPayloadPolicy, o as resolveOpenAIResponsesRequestContextTokens, r as normalizeOpenAIServiceTier, s as resolveOpenAIResponsesServerCompactionPlan, t as OpenAIServiceTier } from "../openai-responses-payload-policy-BzM52TTH.mjs";
//#region packages/ai/src/transports/openai-responses-endpoint.d.ts
export declare function supportsNativeOpenAIResponsesEndpoint(params: {
  provider: string;
  api: string;
  baseUrl?: string;
}): boolean;
//#endregion
export { OPENAI_RESPONSES_APIS, type OpenAIResponsesCompactionOutput, type OpenAIServiceTier, normalizeOpenAIServiceTier, readOpenAIResponsesCompactionWindow, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesRequestContextTokens, resolveOpenAIResponsesServerCompactionPlan };