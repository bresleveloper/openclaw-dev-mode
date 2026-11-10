import { n as buildPluginConfigSchema } from "../../config-schema-dqR2I9Q2.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { n as agentsApiConfigSchema } from "../../config-gtw8-BMW.mjs";
import { t as createAgentsApiHarness } from "../../agentsapi-harness-BT7Qq8oB.mjs";
//#region extensions/agentsapi/index.ts
var agentsapi_default = definePluginEntry({
	id: "agentsapi",
	name: "OpenAI Agents API",
	description: "OpenAI Agents API harness with hosted or self-hosted sessions.",
	configSchema: buildPluginConfigSchema(agentsApiConfigSchema),
	reload: { noopPrefixes: ["plugins.entries.agentsapi.config.plugins"] },
	register(api) {
		const config = agentsApiConfigSchema.parse(api.pluginConfig ?? {});
		api.registerAgentHarness({
			...createAgentsApiHarness(api.runtime),
			...config.environment === "openai_hosted" ? { workspaceEnvironment: {
				kind: "provider-hosted",
				label: "OpenAI (Agents API)"
			} } : {}
		});
	}
});
//#endregion
export { agentsapi_default as default };
