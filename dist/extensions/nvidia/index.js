import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CKUq_-Jy.mjs";
import { i as openclaw_plugin_default, n as buildLiveNvidiaProvider, r as buildNvidiaProvider } from "../../provider-catalog-B7mqhmIp.mjs";
import { r as applyNvidiaConnectionConfig, t as NVIDIA_DEFAULT_MODEL_REF } from "../../onboard-DbTk5eEA.mjs";
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
			buildStaticProvider: buildNvidiaProvider
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
