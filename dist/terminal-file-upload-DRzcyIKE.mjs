import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { r as createFileLockManager } from "./file-lock-manager-xRAOv56w.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-DDEYOm3C.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { a as terminalUploadDecodedSize, i as isCanonicalTerminalUploadBase64, n as MAX_TERMINAL_UPLOAD_BYTES, t as MAX_TERMINAL_UPLOAD_BASE64_LENGTH } from "./terminal-constants-ChTTPdyr.mjs";
import { t as BoundedSerialQueue } from "./bounded-serial-queue-3JaVUeMO.mjs";
import path from "node:path";
import { lstat, lutimes, mkdir, mkdtemp, opendir, realpath, rm, rmdir, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
//#region src/infra/terminal-file-upload.ts
const TERMINAL_UPLOAD_PREFIX = "openclaw-terminal-upload-";
const TERMINAL_UPLOAD_CLEANUP_RETRY_MS = 36e5;
const MAX_RETAINED_BYTES = 268435456;
const MAX_RETAINED_DIRECTORIES = 64;
const MAX_STAGED_NAME_BYTES = 180;
const PORTABLE_NAME_FORBIDDEN = new RegExp(String.raw`[\u0000-\u001f\u007f<>:"/\\|?*%!]`, "g");
const WINDOWS_RESERVED_NAME = /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu;
const uploadLocks = createFileLockManager("openclaw.terminal-upload");
const pendingUploadLockReleases = /* @__PURE__ */ new Map();
const uploadQueue = new BoundedSerialQueue({
	maxPendingCount: MAX_RETAINED_DIRECTORIES,
	maxPendingWeight: Math.ceil(MAX_RETAINED_BYTES / 3) * 4
});
const cleanupRoots = /* @__PURE__ */ new Map();
const cleanupRecoveries = /* @__PURE__ */ new Map();
/** Windows temp variables can point at a shared directory; inherit the user's profile ACL instead. */
function resolveTerminalUploadRoot(options) {
	return (options?.platform ?? process.platform) === "win32" ? path.join(options?.homeDir ?? homedir(), ".openclaw", "tmp") : options?.tempDir ?? tmpdir();
}
function truncateUtf8(value, maxBytes) {
	let result = "";
	let bytes = 0;
	for (const character of value) {
		const nextBytes = Buffer.byteLength(character, "utf8");
		if (bytes + nextBytes > maxBytes) break;
		result += character;
		bytes += nextBytes;
	}
	return result;
}
function sanitizeTerminalUploadName(name) {
	const cleaned = path.posix.basename(name.replaceAll("\\", "/")).replace(PORTABLE_NAME_FORBIDDEN, "_").trim().replace(/[. ]+$/u, "");
	const portable = WINDOWS_RESERVED_NAME.test(cleaned) ? `_${cleaned}` : cleaned;
	const truncated = truncateUtf8(portable && portable !== "." && portable !== ".." ? portable : "upload", MAX_STAGED_NAME_BYTES).replace(/[. ]+$/u, "");
	return (WINDOWS_RESERVED_NAME.test(truncated) ? `_${truncated}` : truncated) || "upload";
}
function validateTerminalUpload(contentBase64) {
	if (contentBase64.length > MAX_TERMINAL_UPLOAD_BASE64_LENGTH || terminalUploadDecodedSize(contentBase64) > 16777216) throw new Error(`terminal upload exceeds ${MAX_TERMINAL_UPLOAD_BYTES} bytes`);
	if (!isCanonicalTerminalUploadBase64(contentBase64)) throw new Error("invalid terminal upload encoding");
	return terminalUploadDecodedSize(contentBase64);
}
function stagingLimitError() {
	return /* @__PURE__ */ new Error("terminal upload staging limit reached (256 MiB or 64 files). Move or remove staged files, then retry, or wait for the 24-hour cleanup.");
}
function cleanupState(root, retentionMs) {
	let state = cleanupRoots.get(root);
	if (!state) {
		state = {
			retentionMs: retentionMs ?? 864e5,
			deadlines: /* @__PURE__ */ new Map()
		};
		cleanupRoots.set(root, state);
	} else if (retentionMs !== void 0) state.retentionMs = retentionMs;
	return state;
}
function scheduleCleanup(root, state, at) {
	if (state.timer && state.nextAt !== void 0 && state.nextAt <= at) return;
	if (state.timer) clearTimeout(state.timer);
	state.nextAt = at;
	state.timer = setTimeout(() => {
		state.timer = void 0;
		state.nextAt = void 0;
		ensureTerminalUploadCleanup({
			tempRoot: root,
			retentionMs: state.retentionMs
		});
	}, Math.max(0, at - Date.now()));
	state.timer.unref?.();
}
async function withUploadLock(root, run) {
	const uid = typeof process.getuid === "function" ? process.getuid() : "user";
	const privateRoot = resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(root, `.openclaw-terminal-staging-${uid}`),
		tmpdir: () => root
	});
	const lockDirectory = path.join(privateRoot, "terminal-upload-lock");
	await mkdir(lockDirectory, {
		recursive: true,
		mode: 448
	});
	await pendingUploadLockReleases.get(root)?.();
	const staleOwner = ({ payload }) => isLockOwnerDefinitelyStale({ payload: asNullableRecord(payload) });
	const lock = await uploadLocks.acquire(path.join(lockDirectory, "admission"), {
		retry: {
			retries: 40,
			factor: 1.2,
			minTimeout: 10,
			maxTimeout: 100
		},
		staleRecovery: "remove-if-unchanged",
		payload: () => ({
			pid: process.pid,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			starttime: getFileLockProcessStartTime(process.pid)
		}),
		shouldReclaim: staleOwner,
		shouldRemoveStaleLock: staleOwner
	}).catch((error) => {
		if (hasErrnoCode(error, "file_lock_timeout") || hasErrnoCode(error, "file_lock_stale")) {
			const relativeLockDirectory = path.relative(root, lockDirectory);
			const recoveryLocation = process.platform === "win32" ? `${path.join(".openclaw", "tmp", relativeLockDirectory)} under the home directory of the account running this terminal's Gateway or node host` : `${relativeLockDirectory} under the system temporary directory used by this terminal's Gateway or node-host process`;
			throw new Error(`terminal upload staging is busy; retry after other uploads finish. If it stays blocked after a crash, locate ${recoveryLocation}. Stop all Gateway and node-host processes using that staging root, remove only this lock directory, then restart them.`, { cause: error });
		}
		throw error;
	});
	try {
		return await run(async () => {
			if (!await lock.verifyStillHeld()) throw new Error("terminal upload staging ownership changed; retry the upload");
		});
	} finally {
		const release = async () => {
			await lock.release();
			if (pendingUploadLockReleases.get(root) === release) pendingUploadLockReleases.delete(root);
		};
		pendingUploadLockReleases.set(root, release);
		await release();
	}
}
async function removeTerminalUploadDirectory(directory) {
	try {
		await rm(directory, {
			recursive: true,
			force: true
		});
		return true;
	} catch (error) {
		logWarn(`terminal-upload: cleanup failed; retrying: ${String(error)}`);
		return false;
	}
}
async function readUploadBytes(directory, remaining) {
	let bytes = 0;
	let empty = true;
	const entries = await opendir(directory);
	for await (const entry of entries) {
		empty = false;
		if (!entry.isFile() && !entry.isDirectory()) continue;
		const child = path.join(directory, entry.name);
		let stats;
		try {
			stats = await lstat(child);
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) continue;
			throw error;
		}
		if (stats.isFile()) bytes += stats.size;
		else if (stats.isDirectory()) bytes += (await readUploadBytes(child, remaining - bytes)).bytes;
		if (bytes > remaining) break;
	}
	return {
		bytes,
		empty
	};
}
/** Disk is authoritative across processes, restarts, and files moved by an operator. */
async function scanUploads(root, state, assertHeld, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	const unseen = new Set(state.deadlines.keys());
	let bytes = 0;
	let directories = 0;
	let nextAt = Infinity;
	try {
		const entries = await opendir(root);
		for await (const entry of entries) {
			if (!entry.isDirectory() || !entry.name.startsWith(TERMINAL_UPLOAD_PREFIX)) continue;
			const directory = path.join(root, entry.name);
			let stats;
			try {
				stats = await lstat(directory, { bigint: true });
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) continue;
				throw error;
			}
			if (!stats.isDirectory() || typeof process.getuid === "function" && stats.uid !== BigInt(process.getuid())) continue;
			unseen.delete(directory);
			let deadline = state.deadlines.get(directory);
			if (!deadline || deadline.dev !== stats.dev || deadline.ino !== stats.ino) {
				const mtimeMs = Number(stats.mtimeNs / 1000000n) + Number(stats.mtimeNs % 1000000n) / 1e6;
				if (mtimeMs > nowMs) {
					await assertHeld();
					await lutimes(directory, stats.atime, new Date(nowMs));
				}
				deadline = {
					dev: stats.dev,
					ino: stats.ino,
					expiresAt: Math.min(mtimeMs, nowMs) + state.retentionMs
				};
				state.deadlines.set(directory, deadline);
			}
			const { expiresAt } = deadline;
			if (expiresAt <= nowMs) {
				await assertHeld();
				if (await removeTerminalUploadDirectory(directory)) {
					state.deadlines.delete(directory);
					continue;
				}
			}
			if (options.incomingBytes !== void 0) {
				if (bytes + options.incomingBytes <= MAX_RETAINED_BYTES) {
					const usage = await readUploadBytes(directory, MAX_RETAINED_BYTES - options.incomingBytes - bytes);
					if (usage.empty) {
						await assertHeld();
						try {
							await rmdir(directory);
							state.deadlines.delete(directory);
							continue;
						} catch (error) {
							if (hasErrnoCode(error, "ENOENT")) {
								state.deadlines.delete(directory);
								continue;
							}
							throw error;
						}
					}
					bytes += usage.bytes;
				}
				directories += 1;
			}
			nextAt = Math.min(nextAt, expiresAt <= nowMs ? nowMs + TERMINAL_UPLOAD_CLEANUP_RETRY_MS : expiresAt);
		}
		for (const directory of unseen) state.deadlines.delete(directory);
	} catch (error) {
		nextAt = Math.min(nextAt, Date.now() + TERMINAL_UPLOAD_CLEANUP_RETRY_MS);
		throw error;
	} finally {
		if (Number.isFinite(nextAt)) scheduleCleanup(root, state, nextAt);
		else {
			if (state.timer) clearTimeout(state.timer);
			state.timer = void 0;
			state.nextAt = void 0;
			cleanupRoots.delete(root);
		}
	}
	return {
		bytes,
		directories
	};
}
async function runTerminalUploadCleanupRecovery(options) {
	const requestedRoot = options?.tempRoot ?? resolveTerminalUploadRoot();
	let root = path.resolve(requestedRoot);
	try {
		root = await realpath(root);
		await withUploadLock(root, async (assertHeld) => {
			await scanUploads(root, cleanupState(root, options?.retentionMs), assertHeld, options);
		});
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		logWarn(`terminal-upload: recovery failed; retrying: ${String(error)}`);
		scheduleCleanup(root, cleanupState(root, options?.retentionMs), Date.now() + TERMINAL_UPLOAD_CLEANUP_RETRY_MS);
	}
}
/** Recovers existing uploads with a streaming scan and one cleanup timer per root. */
function ensureTerminalUploadCleanup(options) {
	const root = path.resolve(options?.tempRoot ?? resolveTerminalUploadRoot());
	const existing = cleanupRecoveries.get(root);
	if (existing) return existing;
	const recovery = runTerminalUploadCleanupRecovery(options).finally(() => {
		cleanupRecoveries.delete(root);
	});
	cleanupRecoveries.set(root, recovery);
	return recovery;
}
/** Stages one browser-selected file in a private, expiring temporary directory. */
async function stageTerminalUpload(file, options) {
	const { name, contentBase64 } = file;
	const size = validateTerminalUpload(contentBase64);
	const admitted = uploadQueue.enqueue(async () => {
		const tempRoot = options?.tempRoot ?? resolveTerminalUploadRoot(options);
		if ((options?.platform ?? process.platform) === "win32" && !options?.tempRoot) await mkdir(tempRoot, {
			recursive: true,
			mode: 448
		});
		const root = await realpath(tempRoot);
		return await withUploadLock(root, async (assertHeld) => {
			const state = cleanupState(root);
			const retained = await scanUploads(root, state, assertHeld, { incomingBytes: size });
			if (retained.directories >= MAX_RETAINED_DIRECTORIES || retained.bytes + size > MAX_RETAINED_BYTES) throw stagingLimitError();
			await assertHeld();
			const directory = await mkdtemp(path.join(root, TERMINAL_UPLOAD_PREFIX));
			const targetPath = path.join(directory, sanitizeTerminalUploadName(name));
			let identity;
			try {
				const { dev, ino } = await lstat(directory, { bigint: true });
				identity = {
					dev,
					ino
				};
				await assertHeld();
				await writeFile(targetPath, Buffer.from(contentBase64, "base64"), {
					flag: "wx",
					mode: 384
				});
				const expiresAt = Date.now() + (options?.cleanupAfterMs ?? 864e5);
				state.deadlines.set(directory, {
					...identity,
					expiresAt
				});
				cleanupRoots.set(root, state);
				scheduleCleanup(root, state, expiresAt);
				return {
					path: targetPath,
					size
				};
			} catch (error) {
				if (!await removeTerminalUploadDirectory(directory)) {
					const retryAt = Date.now() + TERMINAL_UPLOAD_CLEANUP_RETRY_MS;
					if (identity) state.deadlines.set(directory, {
						...identity,
						expiresAt: retryAt
					});
					cleanupRoots.set(root, state);
					scheduleCleanup(root, state, retryAt);
				}
				throw error;
			}
		});
	}, {
		weight: contentBase64.length,
		sealOnOverflow: false
	});
	if (!admitted.accepted) throw new Error("terminal upload staging is busy; retry after current uploads finish");
	return await admitted.completion;
}
//#endregion
export { stageTerminalUpload as n, ensureTerminalUploadCleanup as t };
