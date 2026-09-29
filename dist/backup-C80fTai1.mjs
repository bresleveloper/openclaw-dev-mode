import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-Y0-8ADx0.mjs";
import { o as recordBackupOutcomeBestEffort } from "./backup-shared-CDd4btcJ.mjs";
import { t as createBackupArchive } from "./backup-create-BUzx0hR3.mjs";
//#region src/commands/backup-summary.ts
function formatBackupCreateSummary(result) {
	const lines = [`Backup archive: ${result.archivePath}`];
	lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
	for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
	if (result.skipped.length > 0) {
		lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
		for (const entry of result.skipped) if (entry.reason === "covered" && entry.coveredBy) lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason} by ${entry.coveredBy})`);
		else lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason})`);
	}
	for (const link of result.externalSymbolicLinks ?? []) lines.push(`External link preserved (target not copied through link): ${JSON.stringify(link.entryPath)} -> ${JSON.stringify(link.linkpath)}`);
	if (result.dryRun) lines.push("Dry run only; archive was not written.");
	else {
		lines.push(`Created ${result.archivePath}`);
		if (result.skippedVolatileCount > 0) lines.push(`Skipped ${result.skippedVolatileCount} volatile file${result.skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, managed runtime paths, sockets, pid/tmp).`);
		if (result.verified) lines.push("Archive verification: passed");
	}
	lines.push(...result.warnings ?? []);
	return lines;
}
//#endregion
//#region src/commands/backup.ts
const backupVerifyRuntimeLoader = createLazyImportLoader(() => import("./backup-verify-CqXEJ6-b.mjs"));
function loadBackupVerifyRuntime() {
	return backupVerifyRuntimeLoader.load();
}
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
async function backupCreateCommand(runtime, opts = {}) {
	let archivePath = opts.output ?? process.cwd();
	const releaseCustody = opts.dryRun ? void 0 : beginLifecycleWriteCustody("backup");
	let failure;
	try {
		const result = await withCommandProcessScope(() => createBackupArchive({
			...opts,
			log: opts.log ?? (opts.json ? void 0 : (message) => runtime.log(message))
		}));
		archivePath = result.archivePath;
		if (opts.verify && !opts.dryRun) {
			const { backupVerifyCommand } = await loadBackupVerifyRuntime();
			await backupVerifyCommand({
				...runtime,
				log: () => {}
			}, {
				archive: result.archivePath,
				json: false
			});
			result.verified = true;
		}
		if (!opts.dryRun) await recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "ok"
		});
		if (opts.json) writeRuntimeJson(runtime, result);
		else runtime.log(formatBackupCreateSummary(result).join("\n"));
		return result;
	} catch (error) {
		failure = error;
		if (!opts.dryRun) await recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	} finally {
		releaseCustody?.(failure);
	}
}
//#endregion
export { backupCreateCommand as t };
