//#region extensions/openai/base-url.d.ts
declare const OPENAI_CODEX_RESPONSES_BASE_URL = "https://chatgpt.com/backend-api/codex";
declare const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
declare function resolveOpenAIDefaultBaseUrl(env?: Record<string, string | undefined>): string;
declare function isOpenAIApiBaseUrl(baseUrl?: string): boolean;
declare function isOpenAICodexBaseUrl(baseUrl?: string): boolean;
declare function canonicalizeCodexResponsesBaseUrl(baseUrl?: string): string | undefined;
//#endregion
export { OPENAI_API_BASE_URL, OPENAI_CODEX_RESPONSES_BASE_URL, canonicalizeCodexResponsesBaseUrl, isOpenAIApiBaseUrl, isOpenAICodexBaseUrl, resolveOpenAIDefaultBaseUrl };