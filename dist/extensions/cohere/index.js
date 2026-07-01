import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cfv9JQTs.js";
import { n as COHERE_DEFAULT_MODEL_REF, r as applyCohereConfig } from "../../onboard-CPCIGxo3.js";
import { t as buildCohereProvider } from "../../provider-catalog-V0-Bm_LP.js";
import { t as createCohereCompletionsWrapper } from "../../stream-CVKpXocE.js";
//#region extensions/cohere/index.ts
var cohere_default = defineSingleProviderPluginEntry({
	id: "cohere",
	name: "Cohere Provider",
	description: "Cohere provider plugin",
	provider: {
		label: "Cohere",
		docsPath: "/providers/cohere",
		auth: [{
			methodId: "api-key",
			label: "Cohere API key",
			hint: "OpenAI-compatible inference",
			optionKey: "cohereApiKey",
			flagName: "--cohere-api-key",
			envVar: "COHERE_API_KEY",
			promptMessage: "Enter Cohere API key",
			defaultModel: COHERE_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyCohereConfig(cfg),
			wizard: {
				groupLabel: "Cohere",
				groupHint: "OpenAI-compatible inference"
			}
		}],
		catalog: {
			buildProvider: buildCohereProvider,
			buildStaticProvider: buildCohereProvider
		},
		wrapStreamFn: (ctx) => createCohereCompletionsWrapper(ctx.streamFn),
		wrapSimpleCompletionStreamFn: (ctx) => createCohereCompletionsWrapper(ctx.streamFn)
	}
});
//#endregion
export { cohere_default as default };
