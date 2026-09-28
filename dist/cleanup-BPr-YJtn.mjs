import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { i as readRegularFileSync } from "./regular-file-D4i0kJHS.mjs";
import { n as readFileWindowFullySync } from "./file-read-Csm265gq.mjs";
import { s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { a as resolveTrajectoryFilePath, o as resolveTrajectoryPointerFilePath, s as safeTrajectorySessionFileName, t as TRAJECTORY_POINTER_FILE_MAX_BYTES } from "./paths-DV-XPqk-.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/trajectory/cleanup.ts
function isPathWithinDir(parentDir, filePath) {
	const resolvedParent = resolveRealpathOrAbsolute(parentDir);
	const resolvedFile = resolveRealpathOrAbsolute(filePath);
	return resolvedFile !== resolvedParent && isPathInside(resolvedParent, resolvedFile);
}
function isRegularNonSymlinkFile(filePath) {
	try {
		const lst = fs.lstatSync(filePath);
		if (!lst.isFile() || lst.isSymbolicLink()) return false;
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function readTrajectoryPointerFile(pointerPath, sessionId) {
	try {
		const { buffer } = readRegularFileSync({
			filePath: pointerPath,
			maxBytes: TRAJECTORY_POINTER_FILE_MAX_BYTES
		});
		const parsed = JSON.parse(buffer.toString("utf8"));
		if (!isRecord(parsed)) return null;
		if (parsed.traceSchema !== "openclaw-trajectory-pointer" || parsed.schemaVersion !== 1 || parsed.sessionId !== sessionId || typeof parsed.runtimeFile !== "string" || !parsed.runtimeFile.trim()) return null;
		return { runtimeFile: path.resolve(parsed.runtimeFile) };
	} catch {
		return null;
	}
}
function readFirstNonEmptyLine(filePath) {
	let fd = null;
	try {
		fd = fs.openSync(filePath, "r");
		const buffer = Buffer.alloc(65536);
		const bytesRead = readFileWindowFullySync(fd, buffer, 0);
		if (bytesRead <= 0) return null;
		for (const line of buffer.subarray(0, bytesRead).toString("utf8").split(/\r?\n/u)) {
			const trimmed = line.trim();
			if (trimmed) return trimmed;
		}
		return null;
	} catch {
		return null;
	} finally {
		if (fd !== null) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function runtimeFileStartsWithSessionEvent(filePath, sessionId) {
	if (!isRegularNonSymlinkFile(filePath)) return false;
	const firstLine = readFirstNonEmptyLine(filePath);
	if (!firstLine) return false;
	try {
		const parsed = JSON.parse(firstLine);
		return isRecord(parsed) && parsed.traceSchema === "openclaw-trajectory" && parsed.schemaVersion === 1 && parsed.source === "runtime" && parsed.sessionId === sessionId;
	} catch {
		return false;
	}
}
async function removeRegularFile(filePath, kind) {
	if (!isRegularNonSymlinkFile(filePath)) return null;
	await fs.promises.rm(filePath, { force: true });
	return {
		kind,
		path: path.resolve(filePath)
	};
}
function resolveRemovedSessionFile(params) {
	try {
		return resolveSessionFilePathCore(params.sessionId, params.sessionFile ? { sessionFile: params.sessionFile } : void 0, { sessionsDir: path.dirname(params.storePath) });
	} catch {
		return null;
	}
}
function mayRemoveRuntimeTarget(params) {
	const resolved = resolveRealpathOrAbsolute(params.filePath);
	const withinStoreDir = isPathWithinDir(params.storeDir, resolved);
	if (resolveRealpathOrAbsolute(params.defaultRuntimePath) === resolved) return !params.restrictToStoreDir || withinStoreDir;
	if (params.restrictToStoreDir && withinStoreDir) return true;
	const expectedName = `${safeTrajectorySessionFileName(params.sessionId)}.jsonl`;
	if (path.basename(resolved) !== expectedName) return false;
	return runtimeFileStartsWithSessionEvent(resolved, params.sessionId);
}
async function removeSessionTrajectoryArtifacts(params) {
	const sessionFile = resolveRemovedSessionFile(params);
	if (!sessionFile) return [];
	const storeDir = path.dirname(path.resolve(params.storePath));
	const restrictToStoreDir = params.restrictToStoreDir === true;
	const removed = [];
	const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
	if (sqliteMarker && (sqliteMarker.sessionId !== params.sessionId || path.resolve(sqliteMarker.storePath) !== path.resolve(params.storePath))) return [];
	const pointerPath = sqliteMarker ? void 0 : resolveTrajectoryPointerFilePath(sessionFile);
	const pointer = pointerPath ? readTrajectoryPointerFile(pointerPath, params.sessionId) : null;
	const defaultRuntimePath = resolveTrajectoryFilePath({
		env: {},
		sessionFile,
		sessionId: params.sessionId
	});
	const runtimeCandidates = /* @__PURE__ */ new Set([defaultRuntimePath]);
	if (pointer?.runtimeFile) runtimeCandidates.add(pointer.runtimeFile);
	for (const runtimePath of runtimeCandidates) {
		if (!mayRemoveRuntimeTarget({
			defaultRuntimePath,
			filePath: runtimePath,
			sessionId: params.sessionId,
			storeDir,
			restrictToStoreDir
		})) continue;
		const deleted = await removeRegularFile(runtimePath, "runtime");
		if (deleted) removed.push(deleted);
	}
	if (pointerPath && (!restrictToStoreDir || isPathWithinDir(storeDir, pointerPath))) {
		const deletedPointer = await removeRegularFile(pointerPath, "pointer");
		if (deletedPointer) removed.push(deletedPointer);
	}
	return removed;
}
async function removeRemovedSessionTrajectoryArtifacts(params) {
	const removed = [];
	for (const [sessionId, sessionFile] of params.removedSessionFiles) {
		if (params.referencedSessionIds.has(sessionId)) continue;
		removed.push(...await removeSessionTrajectoryArtifacts({
			sessionId,
			sessionFile,
			storePath: params.storePath,
			restrictToStoreDir: params.restrictToStoreDir
		}));
	}
	return removed;
}
//#endregion
export { removeRemovedSessionTrajectoryArtifacts, removeSessionTrajectoryArtifacts };
