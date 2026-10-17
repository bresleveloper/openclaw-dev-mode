import { n as buildPluginConfigSchema } from "../../config-schema-BBtylDlH.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { n as agentsApiConfigSchema } from "../../config-C0jAkmTa.mjs";
import { t as createAgentsApiHarness } from "../../agentsapi-harness-DMK2L3eQ.mjs";
//#region extensions/agentsapi/index.ts
var agentsapi_default = definePluginEntry({
	id: "agentsapi",
	name: "OpenAI Agents API",
	description: "OpenAI Agents API harness with hosted or self-hosted sessions.",
	configSchema: buildPluginConfigSchema(agentsApiConfigSchema),
	reload: { noopPrefixes: ["plugins.entries.agentsapi.config.plugins"] },
	register(api) {
		api.registerAgentHarness(createAgentsApiHarness(api.runtime));
	}
});
//#endregion
export { agentsapi_default as default };
