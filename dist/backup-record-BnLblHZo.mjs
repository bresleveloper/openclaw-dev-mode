import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { o as recordBackupOutcomeBestEffort } from "./backup-shared-B7EKbg00.mjs";
//#region src/commands/backup-record.ts
/** Host-owned jobs can contribute outcomes without changing their execution owner. */
async function backupRecordCommand(runtime, opts) {
	if (opts.status !== "ok" && opts.status !== "failed") throw new Error("--status must be ok or failed.");
	const target = opts.target?.trim();
	if (!target) throw new Error("Missing required --target label.");
	const bytes = opts.bytes === void 0 ? void 0 : Number(opts.bytes);
	if (bytes !== void 0 && (!Number.isSafeInteger(bytes) || bytes < 0 || String(opts.bytes).trim() === "")) throw new Error("--bytes must be a nonnegative integer.");
	const outcome = {
		kind: "external",
		archivePath: target,
		target,
		status: opts.status,
		...bytes !== void 0 ? { bytes } : {},
		...opts.error ? { error: opts.error } : {}
	};
	await recordBackupOutcomeBestEffort(runtime, outcome);
	if (opts.json) writeRuntimeJson(runtime, outcome);
	else runtime.log(`External backup: ${target} (${opts.status})`);
}
//#endregion
export { backupRecordCommand };
