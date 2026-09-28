import { i as openclaw_plugin_default } from "./.setup/provider-catalog-BO8z61BO.mjs";
import { QIANFAN_DEFAULT_MODEL_REF, applyQianfanConfig } from "./onboard.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
var qianfan_default = defineSingleProviderPluginEntry({
	id: "qianfan",
	name: "Qianfan Provider",
	description: "Bundled Qianfan provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Qianfan",
		docsPath: "/providers/qianfan",
		manifestAuth: {
			defaultModel: QIANFAN_DEFAULT_MODEL_REF,
			applyConfig: applyQianfanConfig
		},
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		}
	}
});
//#endregion
export { qianfan_default as default };
