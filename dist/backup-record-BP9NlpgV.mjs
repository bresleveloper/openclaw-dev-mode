import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { o as recordBackupOutcomeBestEffort } from "./backup-shared-DwQAqPTD.mjs";
//#region src/commands/backup-record.ts
/** Host-owned jobs can contribute outcomes without changing their execution owner. */
async function backupRecordCommand(runtime, opts) {
	if (opts.status !== "ok" && opts.status !== "failed") throw new Error("--status must be ok or failed.");
	const target = opts.target?.trim();
	if (!target) throw new Error("Missing required --target label.");
	const bytes = opts.bytes === void 0 ? void 0 : parseStrictNonNegativeInteger(opts.bytes);
	if (bytes === void 0 && opts.bytes !== void 0) throw new Error("--bytes must be a nonnegative integer.");
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
	else runtime.log(`External backup: ${sanitizeTerminalText(target)} (${opts.status})`);
}
//#endregion
export { backupRecordCommand };
