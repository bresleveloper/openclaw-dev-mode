import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { a as resolveRequiredOsHomeDir } from "./home-dir-BKwhAL2c.mjs";
import "./errors-DnjwnOju.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { s as markSqliteInspectionOperation } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { a as registerSnapshotTempDirectory, c as removeTempDirectoryAsync, d as SQLITE_SNAPSHOT_PREFIX, f as acquireSqliteSnapshotToken, i as registerAsyncSnapshotTempDirectory, p as isSqliteSnapshotStagingName, s as removeTempDirectory, t as SqliteSnapshotCleanupError, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/infra/windows-private-directory.ts
const require = createRequire(import.meta.url);
let creators;
function loadPrivatePathCreators() {
	const koffi = require("koffi");
	const kernel32 = koffi.load("kernel32.dll");
	const advapi32 = koffi.load("advapi32.dll");
	const attributes = koffi.struct({
		length: "uint32_t",
		descriptor: "void *",
		inheritHandle: "int32_t"
	});
	const getLastError = kernel32.func("uint32_t __stdcall GetLastError()");
	const getCurrentProcess = kernel32.func("void * __stdcall GetCurrentProcess()");
	const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
	const localFree = kernel32.func("void * __stdcall LocalFree(void *memory)");
	const openToken = advapi32.func("int32_t __stdcall OpenProcessToken(void *process, uint32_t access, _Out_ void **token)");
	const getTokenInformation = advapi32.func("int32_t __stdcall GetTokenInformation(void *token, int32_t informationClass, _Out_ void *information, uint32_t length, _Out_ uint32_t *required)");
	const convertSid = advapi32.func("int32_t __stdcall ConvertSidToStringSidW(void *sid, _Out_ void **text)");
	const convertDescriptor = advapi32.func("int32_t __stdcall ConvertStringSecurityDescriptorToSecurityDescriptorW(str16 text, uint32_t revision, _Out_ void **descriptor, void *size)");
	const createDirectory = kernel32.func("__stdcall", "CreateDirectoryW", "int32_t", ["str16", koffi.pointer(attributes)]);
	const createFile = kernel32.func("__stdcall", "CreateFileW", "void *", [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(attributes),
		"uint32_t",
		"uint32_t",
		"void *"
	]);
	const failure = (operation) => {
		const errorCode = getLastError();
		return Object.assign(/* @__PURE__ */ new Error(`${operation} failed (Win32 error ${errorCode})`), {
			code: errorCode === 80 || errorCode === 183 ? "EEXIST" : "EIO",
			errno: errorCode
		});
	};
	const withPrivateAttributes = (inherit, operation) => {
		const token = [null];
		const sidText = [null];
		const descriptor = [null];
		if (!openToken(getCurrentProcess(), 8, token)) throw failure("OpenProcessToken");
		try {
			const required = [0];
			getTokenInformation(token[0], 1, null, 0, required);
			if (getLastError() !== 122 || required[0] === 0) throw failure("GetTokenInformation(size)");
			const user = Buffer.alloc(required[0]);
			if (!getTokenInformation(token[0], 1, user, user.length, required)) throw failure("GetTokenInformation");
			if (!convertSid(koffi.decode(user, "void *"), sidText)) throw failure("ConvertSidToStringSidW");
			const sid = koffi.decode(sidText[0], "char16_t", -1);
			const flags = inherit ? "OICI" : "";
			const sddl = `O:${sid}D:P(A;${flags};FA;;;${sid})(A;${flags};FA;;;SY)(A;${flags};FA;;;BA)`;
			if (!convertDescriptor(sddl, 1, descriptor, null)) throw failure("ConvertStringSecurityDescriptorToSecurityDescriptorW");
			return operation({
				length: koffi.sizeof(attributes),
				descriptor: descriptor[0],
				inheritHandle: 0
			});
		} finally {
			if (descriptor[0] !== null) localFree(descriptor[0]);
			if (sidText[0] !== null) localFree(sidText[0]);
			closeHandle(token[0]);
		}
	};
	return {
		directory: (directoryPath) => withPrivateAttributes(true, (security) => {
			if (!createDirectory(path.toNamespacedPath(path.resolve(directoryPath)), security)) throw failure(`CreateDirectoryW(${directoryPath})`);
		}),
		file: (filePath) => withPrivateAttributes(false, (security) => {
			const resolved = path.toNamespacedPath(path.resolve(filePath));
			const handle = createFile(resolved, 3221225472, 3, security, 1, 128, null);
			if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
			try {
				return fs.openSync(resolved, fs.constants.O_RDWR | (fs.constants.O_NOFOLLOW ?? 0));
			} finally {
				closeHandle(handle);
			}
		})
	};
}
function createPrivateWindowsDirectory(directoryPath) {
	creators ??= loadPrivatePathCreators();
	creators.directory(directoryPath);
}
function createPrivateWindowsFile(filePath) {
	creators ??= loadPrivatePathCreators();
	return creators.file(filePath);
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
const SQLITE_DIRECTORY_MODE = 448;
async function createPrivateSqliteDirectory(directoryPath) {
	if (process.platform !== "win32") {
		await fs$1.mkdir(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
		return;
	}
	createPrivateWindowsDirectory(directoryPath);
}
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
async function createPrivateSqliteTempDirectory(rootPath, prefix) {
	if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	await createPrivateSqliteDirectory(directoryPath);
	return directoryPath;
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") return fs.mkdtempSync(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
const pendingReclamations = /* @__PURE__ */ new Map();
function stagingParent(root) {
	const parent = path.basename(root) === "openclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
function warn(message, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ errorCode: extractErrorCode(error) }, message);
	} catch {}
}
/** A private reader protects its bytes independently of the staging child. */
function acquireSqliteSnapshotReadToken(directory) {
	return acquireSqliteSnapshotToken(directory, "read");
}
function reclaimAbandonedSqliteSnapshotsAsync(root = resolvePrivateSqliteSnapshotStagingRoot()) {
	if (stagingParent(root) || pendingReclamations.has(root)) return pendingReclamations.get(root)?.done ?? Promise.resolve();
	const controller = new AbortController();
	const pass = {
		controller,
		done: (async () => {
			try {
				const { runSqliteReadOnlyWorker } = await import("./sqlite-readonly-worker-C5WaWbM2.mjs");
				if (!controller.signal.aborted) for (const message of await runSqliteReadOnlyWorker(root, {
					mode: "reclaim",
					signal: controller.signal
				})) warn(message);
			} catch (error) {
				warn("SQLite snapshot reclamation worker failed; continuing without cache cleanup.", error);
			} finally {
				pendingReclamations.delete(root);
			}
		})()
	};
	pendingReclamations.set(root, pass);
	return pass.done;
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false) {
	markSqliteInspectionOperation(cause, "snapshot");
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		if (allocation || ["ENOSPC", "EDQUOT"].includes(code ?? "") || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			const message = `${cause instanceof Error ? cause.message : String(cause)}${typeof errcode === "number" ? ` (SQLite errcode=${errcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}: free disk space/quota or set XDG_CACHE_HOME to a writable filesystem`;
			return new Error(message, { cause });
		}
		error = error.cause;
	}
	return cause;
}
async function createSqliteSnapshotStagingDirectory(stagingRoot = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	try {
		return await allocateSqliteSnapshotStagingDirectory(stagingRoot, allowLegacyWorker, signal, asynchronousCleanup);
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) throw error;
		signal?.throwIfAborted();
		throw sqliteSnapshotStagingError(stagingRoot, error, true);
	}
}
async function allocateSqliteSnapshotStagingDirectory(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) {
		const controller = new AbortController();
		return retainSnapshotWork((async () => {
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./sqlite-snapshot-staging-owner-DL5DXfA6.mjs");
			signal?.throwIfAborted();
			controller.signal.throwIfAborted();
			const owned = await allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal ? AbortSignal.any([signal, controller.signal]) : controller.signal);
			registerAsyncSnapshotTempDirectory(owned.directory, owned.retire);
			if (signal?.aborted || controller.signal.aborted) {
				if (!await removeTempDirectoryAsync(owned.directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${owned.directory}`);
				signal?.throwIfAborted();
				controller.signal.throwIfAborted();
			}
			return owned.directory;
		})(), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot allocation stopped")));
	}
	return createSqliteSnapshotStagingDirectorySync(root, allowLegacyWorker);
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const parentDirectory = stagingParent(root);
	const parent = parentDirectory ? acquireSqliteSnapshotToken(parentDirectory, "read") : void 0;
	let directory;
	try {
		directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	} finally {
		parent?.();
	}
}
//#endregion
export { reclaimAbandonedSqliteSnapshotsAsync as a, createPrivateSqliteTempDirectory as c, createPrivateWindowsFile as d, createSqliteSnapshotStagingTokenSync as i, createPrivateSqliteTempDirectorySync as l, createSqliteSnapshotStagingDirectory as n, sqliteSnapshotStagingError as o, createSqliteSnapshotStagingDirectorySync as r, createPrivateSqliteDirectory as s, acquireSqliteSnapshotReadToken as t, resolvePrivateSqliteSnapshotStagingRoot as u };
