import { n as description, t as configSchema } from "./.setup/openclaw.plugin-CbQGYxPU.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { getPreparedPluginSecretInput } from "openclaw/plugin-sdk/secret-input-runtime";
// extensions/subq/index.ts
const loadRuntime = createLazyRuntimeModule(() => import("./.setup/runtime-BhBHJ8aP.mjs"));
const credential = () => getPreparedPluginSecretInput("subq", "apiKey").value;
var subq_default = definePluginEntry({
	id: "subq",
	name: "SubQ",
	description,
	configSchema: { jsonSchema: configSchema },
	register(api) {
		api.registerDecisionProvider({
			id: "subq",
			contractVersion: 1,
			isReady: () => Boolean(credential()),
			async evaluate(batch, context) {
				context.signal.throwIfAborted();
				const { evaluate } = await loadRuntime();
				context.signal.throwIfAborted();
				const apiKey = credential();
				if (!apiKey) return {
					status: "unavailable",
					reason: "credentials-unavailable"
				};
				return evaluate(batch, context, apiKey);
			}
		});
	}
});
export { subq_default as default };
