import { a as isOpenAIApiBaseUrl } from "./base-url-CsNC9nJ8.mjs";
//#region extensions/openai/native-web-search-policy.ts
/** Shared by catalog selection and payload construction before any provider request. */
function resolveNativeWebSearch(ctx) {
	const provider = ctx.config?.tools?.web?.search?.provider?.trim().toLowerCase();
	return ctx.config?.tools?.web?.search?.enabled !== false && (!provider || provider === "auto" || provider === "openai") && ctx.api === "openai-responses" && ctx.provider.trim().toLowerCase() === "openai" && (!ctx.baseUrl || isOpenAIApiBaseUrl(ctx.baseUrl));
}
//#endregion
export { resolveNativeWebSearch as t };
