import { S as validateBackupStatusParams } from "./src-l2dWvEsN.mjs";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-DTyEuOsJ.mjs";
import { o as summarizeBackupTargets, r as readBackupRuns } from "./backup-run-records-BXl2ZzeJ.mjs";
import { n as listStorageLocations } from "./locations-DP6s8i9T.mjs";
import { i as summarizeBackupSchedules } from "./backup-command-DM-EcqY5.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/backup.ts
const backupHandlers = { "backup.status": defineValidatedGatewayMethod("backup.status", validateBackupStatusParams, async ({ context, respond }) => {
	const [runs, jobs] = await Promise.all([readBackupRuns(process.env), context.cron.list({ includeDisabled: true })]);
	respond(true, {
		targets: summarizeBackupTargets(runs),
		schedules: summarizeBackupSchedules(jobs),
		locations: listStorageLocations(context.getRuntimeConfig(), getLoadedRuntimePluginRegistry() ?? void 0)
	}, void 0);
}) };
//#endregion
export { backupHandlers };
