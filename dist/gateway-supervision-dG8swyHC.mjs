import { u as resolveGatewayNativeServiceIdentityConflict } from "./constants-CJCmIHb-.mjs";
import { S as resolveNativeServiceProfileConflict, o as isDefaultInstallIdentity } from "./paths-DehQwyE0.mjs";
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
const EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON = "external-supervisor-update-required";
const NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON = "service management skipped: non-default state dir or config path";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
function formatExternalSupervisorActionRequired(action) {
	return [`OpenClaw gateway lifecycle is managed by an external supervisor (${GATEWAY_SUPERVISOR_MODE_ENV}=external).`, `Use that supervisor to ${action}.`].join(" ");
}
function formatExternalSupervisorUpdateRequired() {
	return [`OpenClaw self-update is disabled while gateway lifecycle is managed by an external supervisor (${GATEWAY_SUPERVISOR_MODE_ENV}=external).`, "Use the external supervisor's update workflow so it can stop the gateway, update and finalize the runtime, then restart it safely."].join(" ");
}
function assertGatewayServiceMutationAllowed(action, env = process.env) {
	if (isGatewayExternallySupervised(env)) throw new Error(formatExternalSupervisorActionRequired(action));
	const conflictingProfile = resolveNativeServiceProfileConflict(env);
	if (conflictingProfile) {
		if (conflictingProfile !== conflictingProfile.toLowerCase()) {
			const platformName = process.platform === "win32" ? "Windows" : "macOS";
			throw new Error(`service management skipped: ${platformName} profile "${conflictingProfile}" is not lowercase-safe for case-insensitive state and native-service paths. Use a lowercase profile name to ${action}, or keep this profile runtime-only without a native service.`);
		}
		throw new Error(`service management skipped: macOS profile "${conflictingProfile}" conflicts with a reserved LaunchAgent identity. Choose a different profile name to ${action}.`);
	}
	const serviceIdentityConflict = resolveGatewayNativeServiceIdentityConflict(env);
	if (serviceIdentityConflict) {
		const platformName = process.platform === "darwin" ? "macOS" : process.platform === "win32" ? "Windows" : "Linux";
		throw new Error(`service management skipped: named profiles cannot override ${serviceIdentityConflict.envKey} for ${platformName} service management. Unset ${serviceIdentityConflict.envKey} so OpenClaw derives the native service identity from OPENCLAW_PROFILE to ${action}, or keep this profile runtime-only without a native service.`);
	}
	if (!isDefaultInstallIdentity(env)) throw new Error(`${NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON}. Rerun with HOME set to the OS account home, without OPENCLAW_HOME, and with OPENCLAW_STATE_DIR and OPENCLAW_CONFIG_PATH either unset or pointing at the canonical paths for that account home and profile to ${action}.`);
}
function resolveGatewayServiceMutationError(action, env = process.env) {
	try {
		assertGatewayServiceMutationAllowed(action, env);
		return null;
	} catch (error) {
		return error instanceof Error ? error : new Error(String(error));
	}
}
//#endregion
export { formatExternalSupervisorUpdateRequired as a, formatExternalSupervisorActionRequired as i, NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON as n, isGatewayExternallySupervised as o, assertGatewayServiceMutationAllowed as r, resolveGatewayServiceMutationError as s, EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON as t };
