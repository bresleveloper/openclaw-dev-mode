import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { r as UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV } from "./update-phase-DiVB4MDN.mjs";
//#region src/commands/doctor-service-repair-policy.ts
/** Doctor policy for native gateway service ownership and repair. */
const GATEWAY_SERVICE_MANAGER_TIMEOUT_MS = 5e3;
const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";
const EXTERNAL_SERVICE_REPAIR_NOTE = "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";
function assertDoctorServiceSelection(env, serviceEnv) {
	const selection = (candidate) => {
		const stateDir = resolveStateDir(candidate);
		return [stateDir, resolveConfigPath(candidate, stateDir)].map((value) => resolvePathViaExistingAncestorSync(value));
	};
	const before = selection(env);
	if (selection(serviceEnv).some((value, index) => value !== before[index])) throw new Error("Doctor and the managed Gateway select different config or state directories. Run doctor with the Gateway's installation and profile; the service was left unchanged.");
}
/** Missing activation policy belongs to legacy parents, not an explicit denial. */
function resolveUpdateParentGatewayActivation(env) {
	const policy = env[UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV];
	return policy === void 0 ? void 0 : isTruthyEnvValue(policy);
}
async function shouldManageGatewayService(env = process.env) {
	if (isGatewayExternallySupervised(env) || env.KUBERNETES_SERVICE_HOST?.trim() && env.KUBERNETES_SERVICE_PORT?.trim()) return false;
	if (!isContainerEnvironment()) return true;
	if (process.platform !== "linux") return false;
	try {
		const { findInstalledSystemdGatewayScope } = await import("./systemd-Dwmu25L4.mjs");
		if ((await findInstalledSystemdGatewayScope(env))?.scope !== "user") return false;
		const { resolveGatewayService } = await import("./service-HM6p7sfm.mjs");
		await resolveGatewayService().isLoaded({
			env,
			timeoutMs: GATEWAY_SERVICE_MANAGER_TIMEOUT_MS
		});
		return true;
	} catch {
		return false;
	}
}
/** The existing updater marker selects internal deferral, not external supervision. */
function resolveServiceRepairPolicy(env = process.env) {
	if (env["OPENCLAW_SERVICE_REPAIR_POLICY"]?.trim().toLowerCase() === "external") return "external";
	return isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"]) ? "update" : "auto";
}
/** Returns true when Doctor service mutations must defer to an external supervisor. */
function isServiceRepairExternallyManaged(policy = resolveServiceRepairPolicy()) {
	return policy === "external" || isGatewayExternallySupervised();
}
/** Maintenance inspection remains separate from publishing or activating a service. */
function isServiceRepairDeferred(policy = resolveServiceRepairPolicy()) {
	return policy === "update" || isServiceRepairExternallyManaged(policy);
}
function formatServiceRepairDeferredNote(policy = resolveServiceRepairPolicy()) {
	return policy === "update" ? "Gateway service repair deferred to update finalization; Doctor left its definition and activation unchanged." : EXTERNAL_SERVICE_REPAIR_NOTE;
}
/** Confirms a service repair only when Doctor owns publication and activation. */
async function confirmDoctorServiceRepair(prompter, params, policy = resolveServiceRepairPolicy()) {
	return !isServiceRepairDeferred(policy) && await prompter.confirmRuntimeRepair(params);
}
//#endregion
export { isServiceRepairDeferred as a, resolveUpdateParentGatewayActivation as c, formatServiceRepairDeferredNote as i, shouldManageGatewayService as l, assertDoctorServiceSelection as n, isServiceRepairExternallyManaged as o, confirmDoctorServiceRepair as r, resolveServiceRepairPolicy as s, SERVICE_REPAIR_POLICY_ENV as t };
