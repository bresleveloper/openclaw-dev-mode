import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as POLICY_CLI_DESCRIPTOR } from "../../cli-output-mode-B_1LewQH.mjs";
//#region extensions/policy/cli-metadata.ts
var cli_metadata_default = definePluginEntry({
	id: "policy",
	name: "Policy",
	description: "Policy CLI metadata",
	register(api) {
		api.registerCli(() => {}, { descriptors: [POLICY_CLI_DESCRIPTOR] });
	}
});
//#endregion
export { cli_metadata_default as default };
