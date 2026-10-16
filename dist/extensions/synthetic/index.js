import { SYNTHETIC_DEFAULT_MODEL_REF } from "./models.js";
import { applySyntheticConnectionConfig } from "./onboard.js";
import { SYNTHETIC_MODEL_DISCOVERY, buildSyntheticProvider } from "./provider-catalog.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
var synthetic_default = defineSingleProviderPluginEntry({
	id: "synthetic",
	name: "Synthetic Provider",
	description: "Synthetic provider plugin",
	manifest: {
		id: "synthetic",
		categories: ["models"],
		activation: { "onStartup": false },
		enabledByDefault: true,
		providers: ["synthetic"],
		modelCatalog: { "discovery": { "synthetic": "refreshable" } },
		setup: { "providers": [{
			"id": "synthetic",
			"envVars": ["SYNTHETIC_API_KEY"]
		}] },
		providerAuthChoices: [{
			"provider": "synthetic",
			"method": "api-key",
			"choiceId": "synthetic-api-key",
			"appGuidedSecret": true,
			"choiceLabel": "Synthetic API key",
			"groupId": "synthetic",
			"groupLabel": "Synthetic",
			"groupHint": "Anthropic-compatible (multi-model)",
			"optionKey": "syntheticApiKey",
			"cliFlag": "--synthetic-api-key",
			"cliOption": "--synthetic-api-key <key>",
			"cliDescription": "Synthetic API key"
		}],
		configSchema: {
			"type": "object",
			"additionalProperties": false,
			"properties": {}
		}
	},
	provider: {
		label: "Synthetic",
		docsPath: "/providers/synthetic",
		manifestAuth: {
			defaultModel: SYNTHETIC_DEFAULT_MODEL_REF,
			applyConfig: applySyntheticConnectionConfig
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: buildSyntheticProvider,
			buildStaticProvider: buildSyntheticProvider,
			allowExplicitBaseUrl: true,
			liveModelDiscovery: SYNTHETIC_MODEL_DISCOVERY
		}
	}
});
//#endregion
export { synthetic_default as default };
