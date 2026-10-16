import { n as compareSemverStrings } from "./update-check-eI0vGW6V.mjs";
//#region src/infra/update-runner-doctor.ts
const EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION = "2026.4.25-beta.1";
function resolveUpdateDoctorExecutionPolicy(params) {
	if (params.allowGatewayServiceRepair) return { fix: true };
	const support = compareSemverStrings(params.targetVersion, EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION);
	if (support !== null && support >= 0) return {
		fix: true,
		serviceRepairPolicy: "external"
	};
	return { fix: false };
}
function buildUpdateDoctorEnv(params) {
	return {
		OPENCLAW_UPDATE_IN_PROGRESS: "1",
		...params.deferConfiguredPluginInstallRepair ? { OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR: "1" } : {},
		OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE: "1",
		OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART: "1",
		OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR: params.allowGatewayServiceRepair ? "1" : "0",
		OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION: params.allowGatewayActivation ? "1" : "0",
		OPENCLAW_SERVICE_REPAIR_POLICY: params.serviceRepairPolicy,
		...params.compatibilityHostVersion ? { OPENCLAW_COMPATIBILITY_HOST_VERSION: params.compatibilityHostVersion } : {}
	};
}
//#endregion
export { resolveUpdateDoctorExecutionPolicy as n, buildUpdateDoctorEnv as t };
