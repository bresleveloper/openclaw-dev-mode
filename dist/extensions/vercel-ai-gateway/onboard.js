import { createAliasOnlyPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/vercel-ai-gateway/onboard.ts
const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF = "vercel-ai-gateway/anthropic/claude-opus-4.6";
const vercelAiGatewayPresetAppliers = createAliasOnlyPresetAppliers({
	modelRef: VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF,
	alias: "Vercel AI Gateway"
});
function applyVercelAiGatewayConfig(cfg) {
	return vercelAiGatewayPresetAppliers.applyConfig(cfg);
}
//#endregion
export { VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF, applyVercelAiGatewayConfig };
