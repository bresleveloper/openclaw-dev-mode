import { t as defineSingleProviderPluginEntry } from "../../provider-entry-D3wDLM3X.mjs";
import { a as openclaw_plugin_default, i as buildSelectableNvidiaProvider, n as buildLiveNvidiaProvider } from "../../provider-catalog-DT10bdkH.mjs";
import { r as applyNvidiaConnectionConfig, t as NVIDIA_DEFAULT_MODEL_REF } from "../../onboard-DcqlBov-.mjs";
var nvidia_default = defineSingleProviderPluginEntry({
	id: "nvidia",
	name: "NVIDIA Provider",
	description: "Bundled NVIDIA provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "NVIDIA",
		docsPath: "/providers/nvidia",
		preserveLiteralProviderPrefix: true,
		manifestAuth: {
			defaultModel: NVIDIA_DEFAULT_MODEL_REF,
			applyConfig: applyNvidiaConnectionConfig
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: buildLiveNvidiaProvider,
			buildStaticProvider: buildSelectableNvidiaProvider
		},
		wizard: {
			setup: {
				choiceId: "nvidia-api-key",
				choiceLabel: "NVIDIA API key",
				groupId: "nvidia",
				groupLabel: "NVIDIA",
				groupHint: "Direct API key",
				methodId: "api-key",
				modelSelection: {
					promptWhenAuthChoiceProvided: true,
					allowKeepCurrent: false
				}
			},
			modelPicker: {
				label: "NVIDIA (custom)",
				hint: "Use NVIDIA-hosted open models",
				methodId: "api-key"
			}
		}
	}
});
//#endregion
export { nvidia_default as default };
