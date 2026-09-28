import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as isPathWithin } from "./cleanup-utils-MkYk5me2.mjs";
import { a as resolveStartupConfigSnapshot } from "./automatic-startup-config-repair-BYJPaT3C.mjs";
import { a as canonicalizePathForContainment, c as resolveBackupAgentRoots, t as BACKUP_MAX_DECOMPRESSION_RATIO, u as resolveRequiredBackupPath } from "./backup-shared-DvtzILJd.mjs";
import { n as prepareBackupArchive } from "./backup-verify-CsHrnSi0.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import * as tar from "tar";
//#region src/commands/backup-restore.ts
const BACKUP_RESTORE_WARNINGS = [
	"Restoring an archive is time travel: every restored state surface rolls back to the archive timestamp.",
	"Messaging-channel credentials with ratchet state, especially WhatsApp, may desynchronize after rollback and require relinking.",
	"Approvals and delivery/dedupe state also roll back; review pending approvals before resuming the Gateway.",
	"Plugin node_modules are not archived; after activation, run `openclaw plugins update <id>` or reinstall with `openclaw plugins install <spec> --force`.",
	"Generated plugin-skills links are not archived; after activation, run `openclaw skills list` or start an agent session to rebuild them."
];
async function assertTargetOutsideLiveState(targetPath) {
	const [canonicalTarget, canonicalStateDir] = await Promise.all([canonicalizePathForContainment(targetPath), canonicalizePathForContainment(resolveStateDir())]);
	if (isPathWithin(canonicalTarget, canonicalStateDir)) throw new Error(`Backup restore target must be outside the live OpenClaw state directory: ${targetPath}`);
	const configSnapshot = await readConfigFileSnapshot({ observe: false });
	const discoverySnapshot = resolveStartupConfigSnapshot(configSnapshot);
	if (!discoverySnapshot) return;
	const agentRoots = await resolveBackupAgentRoots(discoverySnapshot.config);
	for (const { sourcePath } of agentRoots) if (isPathWithin(canonicalTarget, sourcePath)) throw new Error(`Backup restore target must be outside the live OpenClaw agent directory: ${targetPath}`);
}
async function prepareRestoreTarget(targetPath) {
	try {
		if (!(await fs.lstat(targetPath)).isDirectory()) throw new Error(`Backup restore target must be a directory: ${targetPath}`);
		if ((await fs.readdir(targetPath)).length > 0) throw new Error(`Backup restore target directory must be empty: ${targetPath}`);
		return { created: false };
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	await fs.mkdir(targetPath, {
		recursive: true,
		mode: 448
	});
	return { created: true };
}
async function cleanupFailedRestore(targetPath, created) {
	if (created) {
		await fs.rm(targetPath, {
			recursive: true,
			force: true
		});
		return;
	}
	for (const entry of await fs.readdir(targetPath)) await fs.rm(path.join(targetPath, entry), {
		recursive: true,
		force: true
	});
}
async function extractBackupArchive(archivePath, targetPath, hardlinkTargets, symbolicLinkPaths) {
	let extractionError;
	await tar.x({
		file: archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		cwd: targetPath,
		strict: false,
		preserveOwner: false,
		filter: (entryPath) => !symbolicLinkPaths.has(entryPath),
		onReadEntry: (entry) => {
			const target = hardlinkTargets.get(entry.path);
			if (target !== void 0) entry.linkpath = target;
		},
		onwarn: (code, message, data) => {
			extractionError ??= data instanceof Error ? data : Object.assign(/* @__PURE__ */ new Error(`${code}: ${message}`), data);
		}
	});
	if (extractionError) throw extractionError;
}
function formatRestoreResult(result) {
	return [
		`Backup archive restored to staging: ${shortenHomePath(result.targetPath)}`,
		`Verified archive: ${shortenHomePath(result.archivePath)}`,
		`Archive root: ${result.archiveRoot}`,
		`Archive entries restored: ${result.entryCount}`,
		"",
		"Rollback warnings:",
		...result.warnings.map((warning) => `- ${warning}`),
		"",
		"Activation is explicit: stop the Gateway, move the restored asset tree into place or point OPENCLAW_STATE_DIR at the restored state asset, then run `openclaw doctor`."
	].join("\n");
}
/** Verify first, then extract a whole backup archive into a fresh staging directory. */
async function backupRestoreCommand(runtime, options) {
	const targetPath = resolveRequiredBackupPath(options.target, "--target");
	await assertTargetOutsideLiveState(targetPath);
	const { result: verified, hardlinkTargets, symbolicLinks } = await prepareBackupArchive(options.archive);
	const target = await prepareRestoreTarget(targetPath);
	try {
		await extractBackupArchive(verified.archivePath, targetPath, hardlinkTargets, new Set(symbolicLinks.map(({ entryPath }) => entryPath)));
		for (const { entryPath } of symbolicLinks) await fs.mkdir(path.dirname(path.join(targetPath, entryPath)), { recursive: true });
		for (const { entryPath, linkpath } of symbolicLinks) await fs.symlink(linkpath, path.join(targetPath, entryPath));
	} catch (extractionError) {
		try {
			await cleanupFailedRestore(targetPath, target.created);
		} catch (cleanupError) {
			throw new AggregateError([extractionError, cleanupError], `Backup restore failed and the incomplete target could not be cleaned: ${targetPath}. Cleanup error: ${formatErrorMessage(cleanupError)}`, { cause: extractionError });
		}
		throw new Error(`Backup restore failed; the incomplete target was cleaned: ${targetPath}`, { cause: extractionError });
	}
	const result = {
		...verified,
		targetPath,
		warnings: [...BACKUP_RESTORE_WARNINGS, ...(verified.externalSymbolicLinks ?? []).map(({ entryPath, linkpath }) => `External link restored (target not copied through link): ${JSON.stringify(entryPath)} -> ${JSON.stringify(linkpath)}`)]
	};
	if (options.json) writeRuntimeJson(runtime, result);
	else runtime.log(formatRestoreResult(result));
	return result;
}
//#endregion
export { backupRestoreCommand };
