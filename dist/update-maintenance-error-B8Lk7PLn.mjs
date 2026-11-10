import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
//#region src/cli/update-cli/update-maintenance-error.ts
function updateMaintenanceError(error) {
	const message = `Stop the Gateway first (${formatCliCommand("openclaw gateway stop")}), then retry.`;
	return error instanceof GatewayStateOwnerContentionError || error instanceof DoctorSqliteMaintenanceLockUnavailableError ? new Error(message, { cause: error }) : error;
}
//#endregion
export { updateMaintenanceError as t };
