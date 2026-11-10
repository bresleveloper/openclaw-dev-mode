import { i as routeLogsToStderr } from "../console-CML7QnOp.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import { o as inspectOpenClawStateOwnershipInProcess } from "../openclaw-state-ownership-SRnMuR_a.mjs";
//#region src/state/openclaw-state-ownership.worker.ts
function inspect(databasePath) {
	try {
		if (!databasePath) throw new Error("Shared-state ownership worker requires a database path");
		const ownership = inspectOpenClawStateOwnershipInProcess(databasePath);
		return {
			ok: true,
			ownershipJson: JSON.stringify(ownership)
		};
	} catch (error) {
		const workerError = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
		if (!workerError) throw error;
		return {
			ok: false,
			workerError
		};
	}
}
routeLogsToStderr();
process.stdout.write(JSON.stringify(inspect(process.argv[2])));
//#endregion
export {};
