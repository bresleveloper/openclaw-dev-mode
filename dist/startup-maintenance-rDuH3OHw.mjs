import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { s as isInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { l as isTailscaleRouteOwnershipConflictError } from "./tailscale-DIe8yR1S.mjs";
import { n as isGatewayEffectiveConfigConflictError } from "./server-runtime-config-DMkOSMz0.mjs";
import { t as OpenClawDatabaseSchemaPreflightError } from "./openclaw-database-preflight.messages-CM7IJdZy.mjs";
import { t as isStartupConfigRefusal } from "./doctor-startup-migration-refusal-DM4p-KXA.mjs";
//#region src/cli/gateway-cli/startup-maintenance.ts
const gatewayLog = createSubsystemLogger("gateway");
function resolveGatewayStartupFailureExitCode(err) {
	return isInvalidConfigError(err) || isTailscaleRouteOwnershipConflictError(err) || isGatewayEffectiveConfigConflictError(err) || isStartupConfigRefusal(err) ? 78 : 1;
}
function resolveGatewayStartupMaintenanceReason(error) {
	return findStartupMaintenanceRequiredError(error)?.reason;
}
async function handleGatewayStartupMaintenance(error) {
	const maintenance = findStartupMaintenanceRequiredError(error);
	if (!maintenance) return false;
	const reason = maintenance.reason;
	let refusal = maintenance;
	if (maintenance.kind === "newer-schema" && !(maintenance instanceof OpenClawDatabaseSchemaPreflightError)) try {
		const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-D3lTU13W.mjs");
		const schemas = await preflightOpenClawDatabaseSchemas({ env: process.env });
		if (schemas.incompatible.length > 0) refusal = new OpenClawDatabaseSchemaPreflightError(schemas.incompatible);
	} catch {}
	const stop = `Stop the service with ${formatCliCommand("openclaw gateway stop")} (or its service owner), then`;
	const guidance = reason === "a newer OpenClaw build" ? `${stop} restore your pre-update backup created with ${formatCliCommand("openclaw backup create")}, then start it again with ${formatCliCommand("openclaw gateway start")}. See https://docs.openclaw.ai/install/updating#rollback.` : `${stop} run ${formatCliCommand("openclaw doctor --fix")}, then start it again with ${formatCliCommand("openclaw gateway start")}.`;
	let parked = false;
	try {
		const { parkCurrentLaunchAgentForMaintenance } = await import("./launchd-C5AbKx3e.mjs");
		parked = await parkCurrentLaunchAgentForMaintenance();
	} catch (parkError) {
		gatewayLog.error(`failed to park the managed LaunchAgent: ${formatErrorMessage(parkError)}`);
	}
	if (refusal instanceof OpenClawDatabaseSchemaPreflightError) {
		gatewayLog.error(`${formatErrorMessage(refusal)}${parked ? " Parked the managed LaunchAgent." : ""}`);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(refusal)}`);
	} else {
		gatewayLog.error(`gateway requires ${reason}${parked ? "; parked the managed LaunchAgent" : ""}. ${guidance}`);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(error)}. ${guidance}`);
	}
	defaultRuntime.exit(78);
	return true;
}
//#endregion
export { resolveGatewayStartupFailureExitCode as n, resolveGatewayStartupMaintenanceReason as r, handleGatewayStartupMaintenance as t };
