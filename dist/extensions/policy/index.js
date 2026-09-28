import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as POLICY_CLI_DESCRIPTOR } from "../../cli-output-mode-B_1LewQH.mjs";
import { t as registerPolicyDoctorChecks } from "../../register-FSUcxqCZ.mjs";
//#region extensions/policy/index.ts
var policy_default = definePluginEntry({
	id: "policy",
	name: "Policy",
	description: "Adds policy-backed doctor checks for workspace conformance.",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerPolicyCli } = await import("../../cli-DHL6nz59.mjs");
			registerPolicyCli(program);
		}, { descriptors: [POLICY_CLI_DESCRIPTOR] });
		registerPolicyDoctorChecks();
	}
});
//#endregion
export { policy_default as default };
