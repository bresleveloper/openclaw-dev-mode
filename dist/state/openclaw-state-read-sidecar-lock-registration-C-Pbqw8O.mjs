import { At as sameFileIdentity, Dt as normalizeMaxBytes, N as assertAsyncDirectoryGuard, U as inspectDirectoryIdentity, d as resolveReadOpenFlags, jt as sameFileIdentityForCleanup, n as readFileDescriptorBoundedSync, p as resolveRootPath, r as readFileHandleBounded, wt as fileObservation, y as absolutePathWithRawSegments } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, i as isNotFoundPathError, n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { i as getFsSafeTestHooks } from "./openclaw-state-read-write-open-flags-DTntuLtd.mjs";
import fs from "node:fs";
import path from "node:path";
import { types } from "node:util";
import { randomBytes } from "node:crypto";
import { platform } from "node:os";
import fs$1 from "node:fs/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/exclusive-create.js
function assertExclusiveCreateStat(pathname, stat) {
	if (stat.isSymbolicLink()) throw Object.assign(/* @__PURE__ */ new Error("exclusive creation target already exists"), {
		code: "EEXIST",
		syscall: "open",
		path: pathname
	});
}
function assertExclusiveCreateLeaf(pathname) {
	if (process.platform !== "win32") return;
	try {
		assertExclusiveCreateStat(pathname, fs.lstatSync(pathname));
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/mutation-authority.js
var MutationAuthorityError = class extends FsSafeError {
	rejection;
	constructor(rejection) {
		super("denied-path", "mutation authority rejected the operation", { cause: rejection });
		this.rejection = rejection;
	}
};
function isMutationAuthorityError(error) {
	try {
		return error instanceof MutationAuthorityError;
	} catch {
		return false;
	}
}
function assertSynchronousCallbackResult(returned, name) {
	if (returned !== null && (typeof returned === "object" || typeof returned === "function") && typeof returned.then === "function") {
		Promise.resolve(returned).catch(() => void 0);
		throw new TypeError(`${name} must be synchronous`);
	}
	if (types.isGeneratorObject(returned)) throw new TypeError(`${name} must be synchronous`);
}
function composeMutationAssertions(defaultAssertion, callAssertion) {
	if (!defaultAssertion && !callAssertion) return void 0;
	return () => {
		try {
			assertSynchronousCallbackResult(defaultAssertion?.(), "assertBeforeMutation");
			assertSynchronousCallbackResult(callAssertion?.(), "assertBeforeMutation");
		} catch (error) {
			throw new MutationAuthorityError(error);
		}
	};
}
function rethrowMutationAuthorityError(error) {
	if (isMutationAuthorityError(error)) throw error.rejection;
	throw error;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/recursive-mkdir-path.js
const needsAbsolutePath = Boolean(process.versions.bun) && platform() === "win32";
/** Bun's Windows recursive mkdir cannot inspect existing relative dot components. */
function recursiveMkdirPath(directory) {
	return needsAbsolutePath ? absolutePathWithRawSegments(directory) : directory;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/timing.js
const MAX_TIMER_DELAY_MS$1 = 2 ** 31 - 1;
function scheduleTimeout(callback, ms) {
	let timer;
	if (Number.isFinite(ms) && ms > MAX_TIMER_DELAY_MS$1) {
		const startedAt = performance.now();
		const tick = () => {
			const remaining = ms - (performance.now() - startedAt);
			if (remaining <= 0) callback();
			else timer = setTimeout(tick, Math.min(remaining, MAX_TIMER_DELAY_MS$1));
		};
		timer = setTimeout(tick, MAX_TIMER_DELAY_MS$1);
	} else timer = setTimeout(callback, ms);
	return () => clearTimeout(timer);
}
function sleep(ms) {
	return new Promise((resolve) => {
		scheduleTimeout(resolve, ms);
	});
}
function sleepSync(ms) {
	if (ms <= 0) return;
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-cleanup.js
function readErrorCode(error) {
	if ((typeof error !== "object" || error === null) && typeof error !== "function") return;
	try {
		return Reflect.get(error, "code");
	} catch {
		return;
	}
}
function hasErrorCode(error, expected) {
	return readErrorCode(error) === expected;
}
async function removeOwnedPath(params) {
	if (!params.identity) return "preserved";
	try {
		const current = fs.lstatSync(params.pathname, { bigint: true });
		if (current.isSymbolicLink() || !current.isFile() || current.nlink !== 1n || !sameFileIdentityForCleanup(current, params.identity)) return "preserved";
		await fs$1.unlink(params.pathname);
		return "removed";
	} catch (error) {
		if (hasErrorCode(error, "ENOENT")) return "name-absent";
		throw error;
	}
}
async function cleanupPinnedFilePath(params) {
	if (!params.identity) return "preserved";
	try {
		const guard = params.parentGuard;
		if ([guard.stat.dev, guard.stat.ino].some((value) => typeof value === "number" && !Number.isSafeInteger(value))) return "preserved";
		await assertAsyncDirectoryGuard(guard);
		const parent = fs.lstatSync(guard.dir, { bigint: true });
		if (parent.isSymbolicLink() || !parent.isDirectory() || !sameFileIdentityForCleanup(parent, guard.stat)) return "preserved";
		const opened = fs.fstatSync(params.handle.fd, { bigint: true });
		if (!opened.isFile() || opened.nlink !== 1n || !sameFileIdentityForCleanup(opened, params.identity)) return "preserved";
	} catch (error) {
		if (params.throwOnCleanupError && !(error instanceof FsSafeError && error.category === "policy") && !hasErrorCode(error, "ENOENT") && !hasErrorCode(error, "ENOTDIR") && !hasErrorCode(error, "ELOOP")) throw error;
		return "preserved";
	}
	try {
		return await removeOwnedPath({
			pathname: params.pathname,
			identity: params.identity
		});
	} catch (error) {
		if (params.throwOnCleanupError) throw error;
		return "preserved";
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/suppressed-error.js
function createSuppressedError(error, suppressed, message) {
	const constructor = globalThis.SuppressedError;
	if (constructor) return new constructor(error, suppressed, message);
	const combined = new Error(message, { cause: error instanceof Error ? error : void 0 });
	combined.name = "SuppressedError";
	Object.defineProperties(combined, {
		error: {
			configurable: true,
			value: error
		},
		suppressed: {
			configurable: true,
			value: suppressed
		}
	});
	return combined;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-root.js
async function openSidecarRoot(lockRoot, relative, discardObservation, onOpenFailure) {
	const resolved = await lockRoot.resolve(relative);
	const canonicalPath = async () => (await resolveRootPath({
		absolutePath: resolved,
		rootPath: lockRoot.rootReal,
		rootCanonicalPath: lockRoot.rootReal,
		boundaryLabel: "sidecar lock root"
	})).canonicalPath;
	const expectedRealPath = await canonicalPath();
	if (expectedRealPath === lockRoot.rootReal) throw new FsSafeError("not-file", "sidecar lock is a directory");
	const parents = [];
	let completeParents = true;
	if (discardObservation) for (let dir = path.dirname(expectedRealPath);; dir = path.dirname(dir)) {
		try {
			parents.push({
				dir,
				stat: await inspectDirectoryIdentity(dir)
			});
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			completeParents = false;
		}
		if (dir === lockRoot.rootReal) break;
	}
	const observation = fileObservation();
	try {
		const opened = await observation.run(() => lockRoot.open(relative));
		if (opened.realPath !== expectedRealPath) {
			await opened.handle.close().catch(() => void 0);
			throw new FsSafeError("path-mismatch", "sidecar lock path changed during open");
		}
		return opened;
	} catch (error) {
		const openFailed = observation.has(error, `open:${resolved}`);
		if (openFailed) onOpenFailure?.(error);
		const missing = openFailed && error instanceof FsSafeError && error.code === "not-found";
		if (missing && !discardObservation) return null;
		const discardable = observation.has(error, `unlinked:${resolved}`) || discardObservation === "changed" && observation.has(error, `changed:${resolved}`);
		if (!discardObservation || !missing && (!completeParents || !discardable)) throw error;
		try {
			const probe = fileObservation();
			try {
				const current = await probe.run(() => lockRoot.stat(relative));
				if (!current.isFile || current.isSymbolicLink || current.nlink !== 1) throw error;
			} catch (probeError) {
				if (!(probeError instanceof FsSafeError && probeError.code === "not-found") && !probe.has(probeError, `stat-leaf-missing:${expectedRealPath}`) && !probe.has(probeError, `stat-leaf-changed:${expectedRealPath}`)) throw probeError;
			}
			for (const { dir, stat } of parents) await inspectDirectoryIdentity(dir, stat);
			await lockRoot.resolve(relative);
			if (await canonicalPath() === expectedRealPath) return null;
		} catch {}
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-create-input.js
const exclusiveSidecarCreate = Symbol("exclusiveSidecarCreate");
const sidecarExclusiveCreate = Object.freeze({ [exclusiveSidecarCreate]: true });
const retainSidecarCreated = Symbol("retainSidecarCreated");
function sidecarRetainedCreate(retain) {
	return {
		...sidecarExclusiveCreate,
		[retainSidecarCreated]: retain
	};
}
var CreateInputError = class extends FsSafeError {
	rejection;
	constructor(rejection) {
		super("helper-failed", "create input failed", { cause: rejection });
		this.rejection = rejection;
	}
};
function rethrowCreateInputError(error) {
	if (error instanceof CreateInputError) throw error.rejection;
	throw error;
}
function createInputOptions(data, options, defaultMaxBytes) {
	if (typeof data === "string" || Buffer.isBuffer(data)) return options;
	const { signal } = options;
	signal?.throwIfAborted();
	if (options.encoding !== void 0 || options.renameIdentity !== void 0) throw new TypeError("streamed create does not accept encoding or renameIdentity");
	const maxBytes = normalizeMaxBytes(options.maxBytes, { defaultValue: defaultMaxBytes });
	const { assertBeforeMutation } = options;
	return {
		...options,
		maxBytes,
		signal,
		assertBeforeMutation: () => {
			signal?.throwIfAborted();
			return assertBeforeMutation == null ? void 0 : Reflect.apply(assertBeforeMutation, options, []);
		}
	};
}
function rootWriteInput(params) {
	if (params.atomic !== void 0 && typeof params.atomic !== "boolean") throw new TypeError("atomic must be a boolean");
	const data = params.data;
	if (typeof data === "string" || Buffer.isBuffer(data)) return {
		kind: "buffer",
		data,
		encoding: params.encoding,
		stageBeforePublish: params[exclusiveSidecarCreate] ? false : params.atomic === true ? true : void 0
	};
	return {
		kind: "stream",
		stageBeforePublish: true,
		stream: (async function* () {
			let iterator;
			let completed = false;
			try {
				params.signal?.throwIfAborted();
				iterator = data[Symbol.asyncIterator]();
				while (true) {
					if (params.signal?.aborted) throw new MutationAuthorityError(params.signal.reason);
					const next = await iterator.next();
					completed = next.done === true;
					if (params.signal?.aborted) throw new MutationAuthorityError(params.signal.reason);
					if (completed) return;
					const chunk = next.value;
					if (!(chunk instanceof Uint8Array)) throw new TypeError("streamed create chunks must be Uint8Array values");
					yield chunk;
				}
			} catch (error) {
				if (error instanceof MutationAuthorityError) throw error;
				throw new CreateInputError(error);
			} finally {
				if (iterator && !completed) try {
					await iterator.return?.();
				} catch (error) {
					throw new CreateInputError(error);
				}
			}
		})()
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-reclaim.js
const MAX_LOCK_PAYLOAD_BYTES = 1048576;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_BYTES = 16;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_BITS = 128;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX = "	".repeat(8);
const SIDECAR_LOCK_OWNERSHIP_TOKEN_PATTERN = new RegExp(`\\n(${SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX}[ \\t]{${SIDECAR_LOCK_OWNERSHIP_TOKEN_BITS}})\\n$`);
function parseSidecarLockSnapshot(snapshot, parser) {
	return snapshot && {
		...snapshot,
		payload: parseSidecarLockPayload(snapshot.raw, parser)
	};
}
function createSidecarLockOwnershipToken() {
	let token = SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX;
	for (const byte of randomBytes(SIDECAR_LOCK_OWNERSHIP_TOKEN_BYTES)) for (let bit = 7; bit >= 0; bit -= 1) token += byte & 1 << bit ? "	" : " ";
	return token;
}
function readSidecarLockOwnershipToken(raw) {
	return SIDECAR_LOCK_OWNERSHIP_TOKEN_PATTERN.exec(raw)?.[1];
}
function serializeSidecarLockPayload(payload) {
	const ownershipToken = createSidecarLockOwnershipToken();
	const raw = `${JSON.stringify(payload, null, 2)}\n${ownershipToken}\n`;
	const bytes = Buffer.byteLength(raw, "utf8");
	if (bytes > MAX_LOCK_PAYLOAD_BYTES) throw new FsSafeError("too-large", `sidecar lock payload exceeds limit of ${MAX_LOCK_PAYLOAD_BYTES} bytes (got ${bytes})`);
	return {
		raw,
		ownershipToken
	};
}
function relativeSidecarLockPath(lockRoot, lockPath) {
	const resolved = path.resolve(lockPath);
	const lexicalRelative = path.relative(lockRoot.rootDir, resolved);
	const relative = lexicalRelative !== ".." && !lexicalRelative.startsWith(`..${path.sep}`) && !path.isAbsolute(lexicalRelative) ? lexicalRelative : path.relative(lockRoot.rootReal, resolved);
	if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new FsSafeError("outside-workspace", "sidecar lock path is outside lockRoot");
	return relative.split(path.sep).join(path.posix.sep);
}
function parseSidecarLockPayload(raw, parser) {
	if (parser) return parser(raw);
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
async function readSidecarLockComparisonSnapshot(lockPath, options) {
	const snapshot = await readSidecarLockRawSnapshot(lockPath, options);
	const parsePayload = options?.parsePayload;
	return parsePayload ? parseSidecarLockSnapshot(snapshot, parsePayload) : snapshot;
}
async function readSidecarLockRawSnapshot(lockPath, options = {}) {
	let handle;
	try {
		if (options.lockRoot) {
			const lockRoot = options.lockRoot;
			const opened = await openSidecarRoot(lockRoot, relativeSidecarLockPath(lockRoot, lockPath), options.discardObservation, options.onOpenFailure);
			if (!opened) return null;
			try {
				return {
					raw: (await readFileHandleBounded(opened.handle, MAX_LOCK_PAYLOAD_BYTES)).toString("utf8"),
					stat: fs.fstatSync(opened.handle.fd, { bigint: true })
				};
			} finally {
				await opened.handle.close().catch(() => void 0);
			}
		}
		const before = lstatSidecarLockSync(lockPath);
		if (!before) return null;
		if (!before.isFile() || before.isSymbolicLink()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		await getFsSafeTestHooks()?.beforeSidecarLockSnapshotOpen?.(lockPath);
		const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		try {
			handle = await fs$1.open(lockPath, fs.constants.O_RDONLY | noFollow | (typeof fs.constants.O_NONBLOCK === "number" ? fs.constants.O_NONBLOCK : 0));
		} catch (error) {
			if (error.code === "ENOENT") return null;
			if (options.rejectNonFile && error.code === "ELOOP") throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`, { cause: error });
			options.onOpenFailure?.(error);
			throw error;
		}
		const opened = fs.fstatSync(handle.fd, { bigint: true });
		if (!opened.isFile()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		if (!options.allowDescriptorIdentityDrift && !sameFileIdentity(before, opened)) return null;
		const raw = (await readFileHandleBounded(handle, MAX_LOCK_PAYLOAD_BYTES)).toString("utf8");
		const after = lstatSidecarLockSync(lockPath);
		if (!after || !after.isFile() || !sameFileIdentity(before, after)) return null;
		return {
			raw,
			stat: after
		};
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
function lstatSidecarLockSync(lockPath) {
	try {
		return fs.lstatSync(lockPath, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
function readSidecarLockSnapshotSync(lockPath, parsePayload, options = {}) {
	return parseSidecarLockSnapshot(readSidecarLockRawSnapshotSync(lockPath, options), parsePayload);
}
function readSidecarLockRawSnapshotSync(lockPath, options = {}) {
	let fd;
	try {
		const before = lstatSidecarLockSync(lockPath);
		if (!before) return null;
		if (!before.isFile() || before.isSymbolicLink()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		try {
			fd = fs.openSync(lockPath, resolveReadOpenFlags());
		} catch (error) {
			if (error.code === "ENOENT") return null;
			options.onOpenFailure?.(error);
			throw error;
		}
		const opened = fs.fstatSync(fd, { bigint: true });
		if (!opened.isFile()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		const raw = readFileDescriptorBoundedSync(fd, MAX_LOCK_PAYLOAD_BYTES).toString("utf8");
		const after = lstatSidecarLockSync(lockPath);
		if (!after || !sameFileIdentity(before, opened) || !sameFileIdentity(opened, after)) return null;
		return {
			raw,
			stat: after
		};
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
function removeSidecarLockIfUnchangedSync(lockPath, observed, assertAuthorized) {
	assertAuthorized?.();
	const current = readSidecarLockRawSnapshotSync(lockPath);
	assertAuthorized?.();
	if (!current || !sidecarLockSnapshotMatches(current, observed)) return false;
	assertAuthorized?.();
	fs.rmSync(lockPath);
	return true;
}
function sidecarLockSnapshotMatches(current, observed) {
	if (observed.ownershipToken !== void 0) return current.stat?.isFile() === true && current.raw !== void 0 && current.raw === observed.raw && readSidecarLockOwnershipToken(current.raw) === observed.ownershipToken;
	if (observed.stat && current.stat && !sameFileIdentityForCleanup(observed.stat, current.stat)) return false;
	if (observed.raw !== void 0) return current.raw === observed.raw;
	return observed.stat !== void 0 && current.stat !== void 0;
}
async function removeSidecarLockIfUnchanged(lockPath, observed, options = {}) {
	const current = await readSidecarLockComparisonSnapshot(lockPath, {
		...options,
		allowDescriptorIdentityDrift: observed?.ownershipToken !== void 0
	});
	if (!current || !observed || !sidecarLockSnapshotMatches(current, observed)) return false;
	if (options.lockRoot) await options.lockRoot.remove(relativeSidecarLockPath(options.lockRoot, lockPath));
	else await fs$1.rm(lockPath, { force: true });
	return true;
}
async function sidecarLockSnapshotStillPresent(lockPath, observed, options = {}) {
	const current = await readSidecarLockComparisonSnapshot(lockPath, {
		...options,
		allowDescriptorIdentityDrift: observed?.ownershipToken !== void 0
	});
	return !!current && !!observed && sidecarLockSnapshotMatches(current, observed);
}
async function sidecarReclaimGuardExists(pathname, lockRoot) {
	try {
		if (lockRoot) await lockRoot.stat(relativeSidecarLockPath(lockRoot, pathname));
		else if (fs.lstatSync(pathname, { throwIfNoEntry: false }) === void 0) return false;
		return true;
	} catch (error) {
		const code = error?.code;
		if (code === "ENOENT" || lockRoot && code === "not-found") return false;
		throw error;
	}
}
async function tryAcquireSidecarReclaimGuard(reclaimGuards, pathname, lockRoot) {
	if (lockRoot) {
		const relative = relativeSidecarLockPath(lockRoot, pathname);
		const payload = {
			pid: process.pid,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const snapshot = {
			...serializeSidecarLockPayload(payload),
			payload
		};
		try {
			await lockRoot.create(relative, snapshot.raw, {
				...sidecarExclusiveCreate,
				mkdir: false,
				mode: 384,
				durable: false
			});
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "already-exists") return;
			if (error instanceof FsSafeError && error.code === "not-file") {
				await sidecarReclaimGuardExists(pathname, lockRoot);
				return;
			}
			throw error;
		}
		let released = false;
		const changed = () => new FsSafeError("path-mismatch", "sidecar reclaim guard ownership changed");
		return {
			async assertHeld() {
				if (released || !await sidecarLockSnapshotStillPresent(pathname, snapshot, { lockRoot })) throw changed();
			},
			async release() {
				if (released) return;
				if (!await removeSidecarLockIfUnchanged(pathname, snapshot, { lockRoot })) throw changed();
				released = true;
			}
		};
	}
	try {
		await fs$1.mkdir(pathname);
	} catch (error) {
		if (error?.code === "EEXIST") return;
		throw error;
	}
	reclaimGuards.add(pathname);
	let released = false;
	return { async release() {
		if (released) return;
		await fs$1.rmdir(pathname);
		reclaimGuards.delete(pathname);
		released = true;
	} };
}
async function removeStaleSidecarLockIfAllowed(params) {
	if (!params.shouldRemoveStaleLock || params.snapshot.raw === void 0) return "not-approved";
	const ioOptions = {
		lockRoot: params.lockRoot,
		parsePayload: params.parsePayload
	};
	params.assertAuthorized?.();
	const presentBeforeApproval = await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot, ioOptions);
	params.assertAuthorized?.();
	if (!presentBeforeApproval) return "changed";
	if (!await params.shouldRemoveStaleLock({
		lockPath: params.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		raw: params.snapshot.raw,
		payload: params.snapshot.payload
	})) return "not-approved";
	params.assertAuthorized?.();
	const presentBeforeRemoval = await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot, ioOptions);
	params.assertAuthorized?.();
	if (!presentBeforeRemoval) return "changed";
	if (params.assertGuardHeld) await params.assertGuardHeld();
	params.assertAuthorized?.();
	if (params.lockRoot) {
		await params.lockRoot.remove(relativeSidecarLockPath(params.lockRoot, params.lockPath), { assertBeforeMutation: params.assertAuthorized });
		return "removed";
	}
	try {
		await fs$1.rm(params.lockPath);
		return "removed";
	} catch (err) {
		if (err.code === "ENOENT") return "changed";
		throw err;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-policy.js
const MAX_TIMER_DELAY_MS = 2 ** 31 - 1;
function assertFiniteNonNegative(value, label) {
	if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} must be a finite non-negative number`);
}
function validateSidecarLockRetryOptions(retry) {
	if (retry.retries !== void 0 && (!Number.isSafeInteger(retry.retries) || retry.retries < 0)) throw new RangeError("lock retry.retries must be a non-negative safe integer");
	if (retry.factor !== void 0) assertFiniteNonNegative(retry.factor, "lock retry.factor");
	if (retry.minTimeout !== void 0) assertFiniteNonNegative(retry.minTimeout, "lock retry.minTimeout");
	if (retry.maxTimeout !== void 0) assertFiniteNonNegative(retry.maxTimeout, "lock retry.maxTimeout");
	if (retry.minTimeout !== void 0 && retry.maxTimeout !== void 0 && retry.minTimeout > retry.maxTimeout) throw new RangeError("lock retry.minTimeout must not exceed retry.maxTimeout");
}
function validateSidecarLockTimeoutMs(timeoutMs) {
	if (timeoutMs === void 0 || timeoutMs === Number.POSITIVE_INFINITY) return;
	assertFiniteNonNegative(timeoutMs, "lock timeoutMs");
}
function validateSidecarLockStaleMs(staleMs) {
	if (staleMs === void 0 || staleMs === Number.POSITIVE_INFINITY) return;
	assertFiniteNonNegative(staleMs, "lock staleMs");
}
function validateSidecarLockCompromiseCheckIntervalMs(intervalMs) {
	if (intervalMs === void 0 || intervalMs === 0) return;
	if (!Number.isFinite(intervalMs) || intervalMs < 1 || intervalMs > MAX_TIMER_DELAY_MS) throw new RangeError(`lock compromiseCheckIntervalMs must be 0 or a finite number between 1 and ${MAX_TIMER_DELAY_MS}`);
}
function computeSidecarLockDelayMs(retry, attempt) {
	validateSidecarLockRetryOptions(retry);
	const minTimeout = retry.minTimeout ?? 50;
	const maxTimeout = retry.maxTimeout ?? 1e3;
	const factor = retry.factor ?? 1;
	const scaled = minTimeout === 0 ? 0 : minTimeout * factor ** attempt;
	const base = Math.min(maxTimeout, Math.max(minTimeout, scaled));
	const jitter = retry.randomize ? 1 + Math.random() : 1;
	return Math.min(maxTimeout, Math.round(base * jitter));
}
function sidecarLockTimeout(lockPath, normalizedTargetPath) {
	return Object.assign(/* @__PURE__ */ new Error(`file lock timeout for ${normalizedTargetPath}`), {
		code: "file_lock_timeout",
		lockPath,
		normalizedTargetPath
	});
}
function sidecarLockStale(lockPath, normalizedTargetPath) {
	return Object.assign(/* @__PURE__ */ new Error(`file lock stale for ${normalizedTargetPath}`), {
		code: "file_lock_stale",
		lockPath,
		normalizedTargetPath
	});
}
/** Undefined means the deadline or retry count is exhausted. */
function sidecarLockRetryDelay(retry, timeoutMs, elapsed, attempt) {
	if (timeoutMs !== void 0 && elapsed >= timeoutMs || retry.retries !== void 0 && attempt >= retry.retries) return void 0;
	const remaining = timeoutMs === void 0 || timeoutMs === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, timeoutMs - elapsed);
	return Math.min(computeSidecarLockDelayMs(retry, attempt), remaining);
}
function isTransientLockFileDenial(error, lockPath) {
	const denial = error;
	return process.platform === "win32" && denial?.code === "EPERM" && denial.path === lockPath;
}
function sidecarLockPayloadCreatedAtMs(payload) {
	const createdAt = payload && typeof payload === "object" && "createdAt" in payload && typeof payload.createdAt === "string" ? payload.createdAt : "";
	const createdAtMs = Date.parse(createdAt);
	return Number.isFinite(createdAtMs) ? createdAtMs : null;
}
async function defaultSidecarLockShouldReclaim(params) {
	const createdAtMs = sidecarLockPayloadCreatedAtMs(params.payload);
	if (createdAtMs !== null) return params.nowMs - createdAtMs > params.staleMs;
	try {
		return params.nowMs - fs.statSync(params.lockPath).mtimeMs > params.staleMs;
	} catch {
		return true;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-registration.js
/** Preserve the legacy, first-registration-wins protocol across package copies. */
function ensureSidecarLockCleanupRegistered(keys, cleanup, marker) {
	const state = globalThis;
	if (state[keys.registered]) return state[keys.registered];
	if (state[keys.registering]) throw keys.reentryError();
	const registration = {};
	const commit = () => {
		state[keys.handler] = cleanup;
		if (keys.retainAware) state[keys.retainAware] = true;
		state[keys.registered] = marker;
	};
	state[keys.registering] = registration;
	try {
		process.on(keys.event, cleanup);
		commit();
		return marker;
	} catch (error) {
		if (process.listeners(keys.event).includes(cleanup)) try {
			process.off(keys.event, cleanup);
		} catch {}
		if (process.listeners(keys.event).includes(cleanup)) commit();
		else {
			if (state[keys.handler] === cleanup) delete state[keys.handler];
			if (marker !== true && state[keys.registered] === marker) delete state[keys.registered];
		}
		throw error;
	} finally {
		if (state[keys.registering] === registration) delete state[keys.registering];
	}
}
//#endregion
export { sidecarRetainedCreate as A, composeMutationAssertions as B, sidecarLockSnapshotStillPresent as C, retainSidecarCreated as D, createInputOptions as E, sleep as F, rethrowMutationAuthorityError as H, sleepSync as I, recursiveMkdirPath as L, createSuppressedError as M, cleanupPinnedFilePath as N, rethrowCreateInputError as O, hasErrorCode as P, MutationAuthorityError as R, sidecarLockSnapshotMatches as S, tryAcquireSidecarReclaimGuard as T, assertExclusiveCreateLeaf as U, isMutationAuthorityError as V, assertExclusiveCreateStat as W, relativeSidecarLockPath as _, sidecarLockRetryDelay as a, removeStaleSidecarLockIfAllowed as b, validateSidecarLockCompromiseCheckIntervalMs as c, validateSidecarLockTimeoutMs as d, parseSidecarLockPayload as f, readSidecarLockSnapshotSync as g, readSidecarLockRawSnapshotSync as h, sidecarLockPayloadCreatedAtMs as i, openSidecarRoot as j, rootWriteInput as k, validateSidecarLockRetryOptions as l, readSidecarLockRawSnapshot as m, defaultSidecarLockShouldReclaim as n, sidecarLockStale as o, parseSidecarLockSnapshot as p, isTransientLockFileDenial as r, sidecarLockTimeout as s, ensureSidecarLockCleanupRegistered as t, validateSidecarLockStaleMs as u, removeSidecarLockIfUnchanged as v, sidecarReclaimGuardExists as w, serializeSidecarLockPayload as x, removeSidecarLockIfUnchangedSync as y, assertSynchronousCallbackResult as z };
