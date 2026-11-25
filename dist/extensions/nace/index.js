import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
// extensions/nace/index.ts
const loadRuntime = createLazyRuntimeModule(() => import("./decision-provider.runtime.js"));
var nace_default = definePluginEntry({
	id: "nace",
	name: "Nace Decision Provider",
	description: "Native typed decisions through Nace's Decisions API.",
	register(api) {
		api.registerProvider({
			id: "nace",
			label: "Nace",
			docsPath: "/providers/nace",
			envVars: ["NACE_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "nace",
				methodId: "api-key",
				label: "Nace API key",
				optionKey: "naceApiKey",
				flagName: "--nace-api-key",
				envVar: "NACE_API_KEY",
				promptMessage: "Enter your Nace API key"
			})]
		});
		api.registerDecisionProvider({
			id: "nace",
			contractVersion: 2,
			async evaluate(batch, context) {
				context.signal.throwIfAborted();
				const { evaluateNaceDecision } = await loadRuntime();
				context.signal.throwIfAborted();
				return evaluateNaceDecision(batch, context);
			}
		});
	}
});
export { nace_default as default };
