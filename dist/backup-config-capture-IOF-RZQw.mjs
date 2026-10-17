import { u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { o as hashConfigIncludeRaw } from "./includes-BkzfmxST.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as containsConfigIncludeDirective } from "./io.read-helpers-Bvdjf9tk.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/backup-config-capture.ts
var BackupConfigCaptureError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "BackupConfigCaptureError";
	}
};
function captureError(sourcePath, detail, cause) {
	return new BackupConfigCaptureError(`Cannot capture required config file ${sourcePath}: ${detail}. Fix the include graph or stop concurrent edits, then retry backup.`, { cause });
}
async function resolveBackupConfigCapture({ snapshot, writeOptions }, options = {}) {
	if ((containsConfigIncludeDirective(snapshot.parsed) || Boolean(snapshot.includedPaths?.length)) && snapshot.includeProvenance === void 0 || snapshot.exists && snapshot.raw === null) throw captureError(snapshot.path, "include graph could not be resolved");
	const hashes = writeOptions.includeFileHashesForWrite ?? {};
	const targets = writeOptions.includeFileTargetsForWrite ?? {};
	const files = new Map(snapshot.exists ? [[snapshot.path, hashConfigIncludeRaw(snapshot.raw)], ...Object.entries(hashes)] : []);
	const capture = [];
	let assertRootAlias;
	const canonicalConfigDir = files.size ? await fs.realpath(path.dirname(snapshot.path)).catch((error) => {
		throw captureError(snapshot.path, "config directory became unavailable", error);
	}) : path.dirname(snapshot.path);
	for (const [sourcePath, hash] of files) try {
		const canonicalPath = await fs.realpath(sourcePath);
		const linkStat = await fs.lstat(sourcePath);
		const rootAlias = sourcePath === snapshot.path && linkStat.isSymbolicLink();
		const includeAliasesAllowed = sourcePath !== snapshot.path && options.allowIncludeAliases === true;
		const stat = rootAlias || includeAliasesAllowed ? await fs.stat(sourcePath) : linkStat;
		if (rootAlias) assertRootAlias = async () => {
			const current = await fs.lstat(sourcePath);
			if (current.dev !== linkStat.dev || current.ino !== linkStat.ino || current.ctimeMs !== linkStat.ctimeMs || await fs.realpath(sourcePath) !== canonicalPath) throw captureError(sourcePath, "config alias changed during capture");
		};
		const projectedPath = path.resolve(canonicalConfigDir, path.relative(path.dirname(snapshot.path), sourcePath));
		if (!stat.isFile() || !rootAlias && !includeAliasesAllowed && canonicalPath !== sourcePath && canonicalPath !== projectedPath) throw captureError(sourcePath, "include alias cannot be represented in this archive");
		if (sourcePath !== snapshot.path && targets[sourcePath] !== canonicalPath) throw captureError(sourcePath, "include target changed or is unavailable");
		capture.push({
			sourcePath: rootAlias ? canonicalPath : sourcePath,
			canonicalPath,
			hash,
			dev: stat.dev,
			ino: stat.ino
		});
	} catch (error) {
		throw captureError(sourcePath, "file identity could not be pinned", error);
	}
	for (const includePath of snapshot.includedPaths ?? []) if (!capture.some((file) => file.sourcePath === includePath || file.canonicalPath === includePath)) throw captureError(includePath, "include inventory is incomplete");
	return {
		files: capture,
		assertRootAlias,
		revalidate: async () => {
			await assertRootAlias?.();
			const current = await withOpenClawStateDatabaseReadSnapshot(() => createConfigIO({
				configPath: snapshot.path,
				env: options.env,
				pluginValidation: options.pluginValidation,
				observe: false
			}).readConfigFileSnapshotForWrite(), { env: options.env });
			if (current.snapshot.exists !== snapshot.exists || current.snapshot.raw !== snapshot.raw || current.snapshot.valid !== snapshot.valid || !isDeepStrictEqual(current.snapshot.sourceConfig, snapshot.sourceConfig) || !isDeepStrictEqual(current.snapshot.includedPaths, snapshot.includedPaths) || !isDeepStrictEqual(current.snapshot.includeProvenance, snapshot.includeProvenance) || !isDeepStrictEqual(current.writeOptions.includeFileHashesForWrite ?? {}, hashes) || !isDeepStrictEqual(current.writeOptions.includeFileTargetsForWrite ?? {}, targets)) throw captureError(snapshot.path, "include graph changed during capture");
		}
	};
}
async function readBackupConfigCaptureFile(file) {
	try {
		if (await fs.realpath(file.sourcePath) !== file.canonicalPath) throw new Error("file identity changed");
		const opened = await openLocalFileSafely({ filePath: file.canonicalPath });
		const { handle, stat } = opened;
		try {
			if (stat.dev !== file.dev || stat.ino !== file.ino || opened.realPath !== file.canonicalPath) throw new Error("file identity changed");
			const bytes = await handle.readFile();
			const raw = bytes.toString("utf8");
			if (!bytes.equals(Buffer.from(raw)) || hashConfigIncludeRaw(raw) !== file.hash) throw new Error("file contents changed");
			const current = await fs.lstat(file.canonicalPath);
			if (!current.isFile() || current.dev !== file.dev || current.ino !== file.ino || await fs.realpath(file.sourcePath) !== file.canonicalPath) throw new Error("file identity changed during read");
			return bytes;
		} finally {
			await handle.close();
		}
	} catch (error) {
		throw captureError(file.sourcePath, "source changed or became unreadable", error);
	}
}
async function stageBackupConfigCapture(capture, tempDir) {
	const remaps = /* @__PURE__ */ new Map();
	for (const [index, file] of (capture?.files ?? []).entries()) {
		const bytes = await readBackupConfigCaptureFile(file);
		const stagedPath = path.join(tempDir, `config-${index}`);
		await fs.writeFile(stagedPath, bytes, {
			flag: "wx",
			mode: 384
		});
		remaps.set(stagedPath, file.canonicalPath);
	}
	await capture?.revalidate();
	for (const file of capture?.files ?? []) await readBackupConfigCaptureFile(file);
	return remaps;
}
//#endregion
export { stageBackupConfigCapture as i, readBackupConfigCaptureFile as n, resolveBackupConfigCapture as r, BackupConfigCaptureError as t };
