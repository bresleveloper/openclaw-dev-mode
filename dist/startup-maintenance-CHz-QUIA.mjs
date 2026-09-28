import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { t as OpenClawDatabaseSchemaPreflightError } from "./openclaw-database-preflight.messages-BNmPUYWC.mjs";
//#region src/cli/gateway-cli/startup-maintenance.ts
const gatewayLog = createSubsystemLogger("gateway");
function resolveGatewayStartupMaintenanceReason(error) {
	return findStartupMaintenanceRequiredError(error)?.reason;
}
async function handleGatewayStartupMaintenance(error) {
	const maintenance = findStartupMaintenanceRequiredError(error);
	if (!maintenance) return false;
	const reason = maintenance.reason;
	let refusal = maintenance;
	if (maintenance.kind === "newer-schema" && !(maintenance instanceof OpenClawDatabaseSchemaPreflightError)) try {
		const { preflightOpenClawDatabaseSchemas } = await import("./openclaw-database-preflight-DwZaE6VW.mjs");
		const schemas = await preflightOpenClawDatabaseSchemas({ env: process.env });
		if (schemas.incompatible.length > 0) refusal = new OpenClawDatabaseSchemaPreflightError(schemas.incompatible);
	} catch {}
	const stop = `Stop the service with ${formatCliCommand("openclaw gateway stop")} (or its service owner), then`;
	const guidance = reason === "a newer OpenClaw build" ? `${stop} restore your pre-update backup created with ${formatCliCommand("openclaw backup create")}, then start it again with ${formatCliCommand("openclaw gateway start")}. See https://docs.openclaw.ai/install/updating#rollback.` : `${stop} run ${formatCliCommand("openclaw doctor --fix")}, then start it again with ${formatCliCommand("openclaw gateway start")}.`;
	let parked = false;
	try {
		const { parkCurrentLaunchAgentForMaintenance } = await import("./launchd-x-pE8CxJ.mjs");
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
export { resolveGatewayStartupMaintenanceReason as n, handleGatewayStartupMaintenance as t };
