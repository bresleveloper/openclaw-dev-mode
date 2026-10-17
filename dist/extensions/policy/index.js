import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as POLICY_CLI_DESCRIPTOR } from "../../cli-output-mode-BBFJN3Xe.mjs";
import { t as registerPolicyDoctorChecks } from "../../register-BhZrwZd3.mjs";
//#region extensions/policy/index.ts
var policy_default = definePluginEntry({
	id: "policy",
	name: "Policy",
	description: "Adds policy-backed doctor checks for workspace conformance.",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerPolicyCli } = await import("../../cli-DHFvXD8Z.mjs");
			registerPolicyCli(program);
		}, { descriptors: [POLICY_CLI_DESCRIPTOR] });
		registerPolicyDoctorChecks();
	}
});
//#endregion
export { policy_default as default };
