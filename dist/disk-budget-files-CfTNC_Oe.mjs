import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { i as isMigrationArchiveArtifactName } from "./artifacts-C9weQ_MG.mjs";
import { o as resolveSessionArtifactDirectory } from "./paths-CcMbq5NY.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as listDurableSqliteTargetPathsForSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/disk-budget-files.ts
const SESSIONS_DIR_STAT_CONCURRENCY = 8;
async function readSessionsDirFiles(sessionsDir) {
	const tasks = (await fs.promises.readdir(sessionsDir, { withFileTypes: true }).catch(() => [])).filter((dirent) => dirent.isFile() && !isMigrationArchiveArtifactName(dirent.name)).map((dirent) => async () => {
		const filePath = path.join(sessionsDir, dirent.name);
		const stat = await fs.promises.stat(filePath).catch(() => null);
		if (!stat?.isFile()) return null;
		return {
			path: filePath,
			canonicalPath: resolveRealpathOrAbsolute(filePath),
			name: dirent.name,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	});
	const { results } = await runTasksWithConcurrency({
		tasks,
		limit: SESSIONS_DIR_STAT_CONCURRENCY
	});
	return results.filter((file) => Boolean(file));
}
async function readSqliteDatabaseFiles(databasePaths) {
	const files = [];
	for (const databasePath of databasePaths) for (const filePath of [databasePath, `${databasePath}-wal`]) {
		const stat = await fs.promises.stat(filePath).catch(() => null);
		if (!stat?.isFile()) continue;
		files.push({
			path: filePath,
			canonicalPath: resolveRealpathOrAbsolute(filePath),
			name: path.basename(filePath),
			size: stat.size,
			mtimeMs: stat.mtimeMs
		});
	}
	return files;
}
/** Measures current physical session artifacts plus the agent SQLite main file and WAL. */
async function readSessionPhysicalDiskUsage(storePath) {
	const sessionsDir = resolveSessionArtifactDirectory(storePath);
	const sessionsDirFiles = await readSessionsDirFiles(sessionsDir);
	const coldArchiveFiles = await readSessionsDirFiles(path.join(sessionsDir, "cold"));
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const databasePaths = listDurableSqliteTargetPathsForSessionStorePath(storePath);
	const databaseFiles = await readSqliteDatabaseFiles(databasePaths);
	const databaseSharedMemoryPaths = new Set(databasePaths.map((databasePath) => resolveRealpathOrAbsolute(`${databasePath}-shm`)));
	const databaseMainPaths = new Set(databaseFiles.filter((file) => !file.path.endsWith("-wal")).map((file) => file.canonicalPath));
	const databaseWalPaths = new Set(databaseFiles.filter((file) => file.path.endsWith("-wal")).map((file) => file.canonicalPath));
	const uniqueFiles = /* @__PURE__ */ new Map();
	for (const file of [
		...sessionsDirFiles,
		...coldArchiveFiles,
		...promptBlobFiles,
		...databaseFiles
	]) if (!databaseSharedMemoryPaths.has(file.canonicalPath)) uniqueFiles.set(file.canonicalPath, file);
	const databaseMainBytes = [...databaseMainPaths].reduce((sum, databasePath) => sum + (uniqueFiles.get(databasePath)?.size ?? 0), 0);
	const databaseWalBytes = [...databaseWalPaths].reduce((sum, databasePath) => sum + (uniqueFiles.get(databasePath)?.size ?? 0), 0);
	const totalBytes = [...uniqueFiles.values()].reduce((sum, file) => sum + file.size, 0);
	return {
		databaseMainBytes,
		databaseWalBytes,
		sessionFilesBytes: totalBytes - databaseMainBytes - databaseWalBytes,
		totalBytes
	};
}
async function readSessionPromptBlobFiles(sessionsDir) {
	const root = path.join(sessionsDir, "skills-prompts", "sha256");
	const prefixEntries = await fs.promises.readdir(root, { withFileTypes: true }).catch(() => []);
	const files = [];
	for (const prefixEntry of prefixEntries) {
		if (!prefixEntry.isDirectory() || !/^[a-f0-9]{2}$/u.test(prefixEntry.name)) continue;
		const prefixDir = path.join(root, prefixEntry.name);
		const blobEntries = await fs.promises.readdir(prefixDir, { withFileTypes: true }).catch(() => []);
		for (const blobEntry of blobEntries) {
			if (!blobEntry.isFile() || !/^[a-f0-9]{64}\.txt$/u.test(blobEntry.name) && !isSessionPromptBlobTempArtifactName(blobEntry.name)) continue;
			const filePath = path.join(prefixDir, blobEntry.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) continue;
			files.push({
				path: filePath,
				canonicalPath: resolveRealpathOrAbsolute(filePath),
				name: blobEntry.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			});
		}
	}
	return files;
}
function isSessionPromptBlobTempArtifactName(name) {
	return /^[a-f0-9]{64}\.txt\.(?:\d+\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(name);
}
//#endregion
export { readSessionsDirFiles as i, readSessionPhysicalDiskUsage as n, readSessionPromptBlobFiles as r, isSessionPromptBlobTempArtifactName as t };
