import { CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF, buildCloudflareAiGatewayModelDefinition, resolveCloudflareAiGatewayBaseUrl } from "./models.js";
import { applyAgentDefaultModelPrimary, applyProviderConfigWithDefaultModel, applyProviderConnectionConfig } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/cloudflare-ai-gateway/onboard.ts
/**
* Config patch helpers used by Cloudflare AI Gateway interactive and
* non-interactive onboarding flows.
*/
/**
* Builds the minimal config patch for provider setup and default model aliasing.
*/
function buildCloudflareAiGatewayConfigPatch(params) {
	return {
		models: { providers: { "cloudflare-ai-gateway": {
			baseUrl: resolveCloudflareAiGatewayBaseUrl(params),
			api: "anthropic-messages",
			models: [buildCloudflareAiGatewayModelDefinition()]
		} } },
		agents: { defaults: { models: { [CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF]: { alias: "Cloudflare AI Gateway" } } } }
	};
}
/**
* Applies provider model config while preserving existing agent model aliases.
*/
function applyCloudflareAiGatewayProviderConfig(cfg, params) {
	const models = { ...cfg.agents?.defaults?.models };
	models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF] = {
		...models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF],
		alias: models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF]?.alias ?? "Cloudflare AI Gateway"
	};
	const existingProvider = cfg.models?.providers?.["cloudflare-ai-gateway"];
	const baseUrl = params?.accountId && params?.gatewayId ? resolveCloudflareAiGatewayBaseUrl({
		accountId: params.accountId,
		gatewayId: params.gatewayId
	}) : typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl : void 0;
	if (!baseUrl) return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models
			}
		}
	};
	return applyProviderConfigWithDefaultModel(cfg, {
		agentModels: models,
		providerId: "cloudflare-ai-gateway",
		api: "anthropic-messages",
		baseUrl,
		defaultModel: buildCloudflareAiGatewayModelDefinition()
	});
}
/**
* Applies Cloudflare AI Gateway config and makes its default model primary.
*/
function applyCloudflareAiGatewayConfig(cfg, params) {
	return applyAgentDefaultModelPrimary(applyCloudflareAiGatewayProviderConfig(cfg, params), CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF);
}
/** Registered setup keeps authored rows and seeds the default only in replace mode. */
function applyCloudflareAiGatewayProviderConnectionConfig(cfg, params) {
	return applyProviderConnectionConfig(cfg, {
		providerId: "cloudflare-ai-gateway",
		api: "anthropic-messages",
		baseUrl: resolveCloudflareAiGatewayBaseUrl(params),
		catalogModels: () => [buildCloudflareAiGatewayModelDefinition()],
		aliases: [{
			modelRef: CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF,
			alias: "Cloudflare AI Gateway"
		}]
	});
}
function applyCloudflareAiGatewayConnectionConfig(cfg, params) {
	return applyAgentDefaultModelPrimary(applyCloudflareAiGatewayProviderConnectionConfig(cfg, params), CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF);
}
//#endregion
export { applyCloudflareAiGatewayConfig, applyCloudflareAiGatewayConnectionConfig, applyCloudflareAiGatewayProviderConfig, applyCloudflareAiGatewayProviderConnectionConfig, buildCloudflareAiGatewayConfigPatch };
