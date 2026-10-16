import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { o as inspectOpenClawStateOwnershipInProcess } from "../openclaw-state-ownership-BDcUGGMF.mjs";
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
process.stdout.write(JSON.stringify(inspect(process.argv[2])));
//#endregion
export {};
