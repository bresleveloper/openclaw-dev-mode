import { i as classifyOpenAIBaseUrl } from "./base-url-BUR_8zW8.mjs";
import "./token-sharing-CmBELw8t.mjs";
//#region extensions/openai/model-auth-policy.ts
/** Credential storage mode and the endpoint it authorizes are independent. */
function resolveModelAuthPolicy(ctx) {
	if (ctx.provider.trim().toLowerCase() !== "openai") return;
	const api = ctx.api?.trim().toLowerCase();
	if (ctx.mode === "oauth" && ctx.authFlow === "chatgpt-identity") return {
		authRequirement: null,
		compatible: false,
		incompatibilityReason: "requires token-sharing consent. Sign in again and enable sharing, or explicitly choose another inference credential"
	};
	if (ctx.mode === "oauth" && ctx.authFlow === "chatgpt-token-sharing") {
		if (ctx.capability) return {
			authRequirement: "api-key",
			compatible: false,
			incompatibilityReason: "does not support this operation with Sign in with ChatGPT. Configure a credential that supports it"
		};
		return {
			authRequirement: "api-key",
			compatible: (!api || api === "openai-responses") && (!ctx.baseUrl || ctx.baseUrl.replace(/\/$/, "") === "https://api.openai.com/v1"),
			incompatibilityReason: "requires the public OpenAI Responses endpoint for ChatGPT token sharing"
		};
	}
	const subscription = ctx.mode === "oauth" || ctx.mode === "token";
	const apiKey = ctx.mode === "api-key" || ctx.mode === "api_key";
	const codex = api === "openai-chatgpt-responses";
	const requiresApiKey = ctx.capability === "embedding" && ctx.mode !== "oauth" && classifyOpenAIBaseUrl(ctx.baseUrl) !== "custom";
	return {
		authRequirement: subscription ? "subscription" : apiKey || ctx.mode === "aws-sdk" ? "api-key" : null,
		compatible: (!requiresApiKey || apiKey) && (api === void 0 || (codex ? subscription : apiKey)),
		incompatibilityReason: codex && !requiresApiKey ? "requires a ChatGPT subscription (OAuth or token) profile" : "requires an OpenAI API key profile"
	};
}
//#endregion
export { resolveModelAuthPolicy as t };
