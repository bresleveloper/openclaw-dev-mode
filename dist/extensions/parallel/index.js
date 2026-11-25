import { n as createParallelWebSearchProvider, t as createParallelFreeWebSearchProvider } from "./.setup/parallel-free-web-search-provider-DoGZWApA.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/parallel/src/decision-provider.ts
const loadRuntime = createLazyRuntimeModule(() => import("./.setup/decision-provider.runtime-2QPWIK1O.mjs"));
function buildParallelDecisionProvider() {
	return {
		id: "parallel",
		contractVersion: 2,
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			const { evaluateParallelDecision } = await loadRuntime();
			context.signal.throwIfAborted();
			return evaluateParallelDecision(batch, context);
		}
	};
}
// extensions/parallel/index.ts
var parallel_default = definePluginEntry({
	id: "parallel",
	name: "Parallel Plugin",
	description: "Bundled Parallel web search and Decisions plugin",
	register(api) {
		api.registerProvider({
			id: "parallel",
			label: "Parallel",
			docsPath: "/tools/parallel-search#decisions",
			envVars: ["PARALLEL_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: "parallel",
				methodId: "api-key",
				label: "Parallel API key",
				optionKey: "parallelApiKey",
				flagName: "--parallel-api-key",
				envVar: "PARALLEL_API_KEY",
				promptMessage: "Enter Parallel API key"
			})]
		});
		api.registerDecisionProvider(buildParallelDecisionProvider());
		api.registerWebSearchProvider(createParallelFreeWebSearchProvider());
		api.registerWebSearchProvider(createParallelWebSearchProvider());
	}
});
export { parallel_default as default };
