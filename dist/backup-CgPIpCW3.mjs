import { C as validateBackupStatusParams, S as validateBackupRecordOutcomeParams } from "./src-pLJQA6J5.mjs";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BrXk-dcA.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import { i as recordBackupRunOutcome, o as summarizeBackupTargets, r as readBackupRuns } from "./backup-run-records-BzdFV-zG.mjs";
import { n as listStorageLocations } from "./locations-Bgppb48Q.mjs";
import { i as summarizeBackupSchedules } from "./backup-command-BBAVTlY5.mjs";
//#region src/gateway/server-methods/backup.ts
const backupHandlers = {
	"backup.recordOutcome": defineValidatedGatewayMethod("backup.recordOutcome", validateBackupRecordOutcomeParams, async (opts) => {
		let assertCurrent;
		try {
			assertCurrent = captureLocalStateMutationGuard(opts.params.expectedOwnerId, opts);
		} catch (error) {
			opts.respond(false, void 0, localStateOwnerChangedError(error));
			return;
		}
		await respondUnavailableOnThrow(opts.respond, async () => {
			await recordBackupRunOutcome(opts.params.outcome, {
				assertCurrent,
				signal: opts.signal
			});
			opts.respond(true, { recorded: true }, void 0);
		});
	}),
	"backup.status": defineValidatedGatewayMethod("backup.status", validateBackupStatusParams, async ({ context, respond }) => {
		const [runs, jobs] = await Promise.all([readBackupRuns(process.env), context.cron.list({ includeDisabled: true })]);
		respond(true, {
			targets: summarizeBackupTargets(runs),
			schedules: summarizeBackupSchedules(jobs),
			locations: listStorageLocations(context.getRuntimeConfig(), getLoadedRuntimePluginRegistry() ?? void 0)
		}, void 0);
	})
};
//#endregion
export { backupHandlers };
