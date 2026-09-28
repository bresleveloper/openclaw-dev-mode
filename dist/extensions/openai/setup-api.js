import { t as createOpenAIProvider } from "./.setup/provider-contract-api-BTdyb23m.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/openai/setup-api.ts
async function runOpenAIProviderAuthMethod(methodId, ctx) {
	const { buildOpenAIProvider } = await import("./.setup/openai-provider-BG-q98qt.mjs");
	const method = buildOpenAIProvider().auth.find((entry) => entry.id === methodId);
	if (!method) return { profiles: [] };
	return method.run(ctx);
}
function buildOpenAISetupProvider() {
	const provider = createOpenAIProvider();
	for (const method of provider.auth) method.run = async (ctx) => runOpenAIProviderAuthMethod(method.id, ctx);
	return provider;
}
var setup_api_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Setup",
	description: "Lightweight OpenAI setup hooks",
	register(api) {
		api.registerProvider(buildOpenAISetupProvider());
	}
});
//#endregion
export { buildOpenAISetupProvider, setup_api_default as default };
