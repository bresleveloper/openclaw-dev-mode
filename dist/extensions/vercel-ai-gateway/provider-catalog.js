import { VERCEL_AI_GATEWAY_BASE_URL, VERCEL_AI_GATEWAY_PROVIDER_ID, discoverVercelAiGatewayModels, getStaticVercelAiGatewayModelCatalog, resolveVercelAiGatewayDynamicModel } from "./models.js";
import { resolveVercelAiGatewayThinkingProfile } from "./thinking.js";
//#region extensions/vercel-ai-gateway/provider-catalog.ts
const VERCEL_AI_GATEWAY_IMAGE_MODEL_IDS = /* @__PURE__ */ new Set([
	"openai/gpt-5.5",
	"openai/gpt-5.5-pro",
	"openai/gpt-5.4",
	"openai/gpt-5.4-pro",
	"openai/gpt-5.4-mini",
	"openai/gpt-5.4-nano",
	"openai/gpt-5.3-codex",
	"openai/gpt-5.3-codex-spark",
	"openai/gpt-5.2",
	"openai/gpt-5.2-codex",
	"openai/gpt-5.1-codex"
]);
function resolveVercelAiGatewayModel(modelId) {
	const model = resolveVercelAiGatewayDynamicModel(modelId);
	const input = model.input.includes("image") ? ["text", "image"] : VERCEL_AI_GATEWAY_IMAGE_MODEL_IDS.has(modelId) || /^anthropic\/claude-(?:opus|sonnet|haiku)-/.test(modelId) ? ["text", "image"] : ["text"];
	return {
		...model,
		reasoning: model.reasoning || Boolean(resolveVercelAiGatewayThinkingProfile(modelId)),
		input,
		api: "anthropic-messages",
		provider: VERCEL_AI_GATEWAY_PROVIDER_ID,
		baseUrl: VERCEL_AI_GATEWAY_BASE_URL
	};
}
function buildStaticVercelAiGatewayProvider() {
	return {
		baseUrl: VERCEL_AI_GATEWAY_BASE_URL,
		api: "anthropic-messages",
		models: getStaticVercelAiGatewayModelCatalog()
	};
}
async function buildVercelAiGatewayProvider(options = {}) {
	return {
		baseUrl: VERCEL_AI_GATEWAY_BASE_URL,
		api: "anthropic-messages",
		models: await discoverVercelAiGatewayModels(options)
	};
}
//#endregion
export { buildStaticVercelAiGatewayProvider, buildVercelAiGatewayProvider, resolveVercelAiGatewayModel };
