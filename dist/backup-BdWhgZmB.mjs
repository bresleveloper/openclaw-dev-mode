import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-C2y9H7om.mjs";
import { o as recordBackupOutcomeBestEffort } from "./backup-shared-B6KMCCJW.mjs";
import { t as createBackupArchive } from "./backup-create-Dmzh_Ksr.mjs";
import { i as resolveBackupNamespace } from "./backup-retention-D0JLSuDB.mjs";
//#region src/commands/backup-summary.ts
function formatBackupCreateSummary(result) {
	const lines = [`Backup archive: ${result.archivePath}`];
	lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
	for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
	if (result.skipped.length > 0) {
		lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
		for (const entry of result.skipped) {
			const coverage = entry.reason === "covered" && entry.coveredBy ? ` by ${entry.coveredBy}` : "";
			lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason}${coverage})`);
		}
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
const loadBackupVerifyRuntime = createLazyPromise(() => import("./backup-verify-DTbbf5qi.mjs"));
const loadBackupRemoteRuntime = createLazyPromise(() => import("./backup-remote-Co4mdpVc.mjs"));
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
async function backupCreateCommand(runtime, opts = {}) {
	if (opts.to === void 0 && [
		opts.namespace,
		opts.claimNamespace,
		opts.keepDaily,
		opts.keepWeekly,
		opts.keepMonthly
	].some((value) => value !== void 0)) throw new Error("--namespace, --claim-namespace, and retention flags require --to <location>.");
	let archivePath = opts.output ?? (opts.to === void 0 ? process.cwd() : `storage://${opts.to}`);
	const releaseCustody = opts.dryRun ? void 0 : beginLifecycleWriteCustody("backup");
	let failure;
	let namespace = opts.namespace;
	try {
		if (opts.to !== void 0) namespace = resolveBackupNamespace(opts.namespace);
		const result = await withCommandProcessScope(async () => {
			const options = {
				...opts,
				log: opts.log ?? (opts.json ? void 0 : (message) => runtime.log(message))
			};
			if (opts.to !== void 0) {
				const { createOffsiteBackupArchive } = await loadBackupRemoteRuntime();
				return await createOffsiteBackupArchive({
					...options,
					to: opts.to,
					namespace
				});
			}
			return await createBackupArchive(options);
		});
		archivePath = result.archivePath;
		if (opts.verify && !opts.dryRun && !result.verified) {
			const { verifyBackupArchive } = await loadBackupVerifyRuntime();
			await verifyBackupArchive(result.archivePath);
			result.verified = true;
		}
		if (!opts.dryRun) await recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "ok",
			...opts.to !== void 0 ? {
				target: opts.to,
				namespace,
				location: result.location,
				retention: result.retention,
				bytes: result.location?.plaintextBytes
			} : {}
		});
		if (opts.json) writeRuntimeJson(runtime, result);
		else {
			runtime.log(formatBackupCreateSummary(result).join("\n"));
			if (result.location) runtime.log(`Uploaded to ${result.location.name}/backups/${result.location.namespace}/${result.location.key} (${result.location.storedBytes} stored bytes).${result.localArchiveRetained ? " Local archive retained." : ""}`);
			if (result.retention) runtime.log(`Retention: ${result.retention.kept} kept, ${result.retention.deleted} deleted.`);
		}
		return result;
	} catch (error) {
		failure = error;
		if (!opts.dryRun) await recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "failed",
			error: formatErrorMessage(error),
			...opts.to !== void 0 ? {
				target: opts.to,
				namespace
			} : {}
		});
		throw error;
	} finally {
		releaseCustody?.(failure);
	}
}
//#endregion
export { backupCreateCommand as t };
