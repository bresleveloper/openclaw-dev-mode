import { Mt as sha256Hex, dt as realpathSync$1, jt as sameFileIdentityForCleanup, mt as getNativeBinding, r as readFileHandleBounded, wt as fileObservation, xt as captureNativeFdClose } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, d as assertNoWindowsPathAlias, u as anchorWindowsDriveRelativePath } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { A as sidecarRetainedCreate, C as sidecarLockSnapshotStillPresent, F as sleep, L as recursiveMkdirPath, M as createSuppressedError, P as hasErrorCode, S as sidecarLockSnapshotMatches, T as tryAcquireSidecarReclaimGuard, U as assertExclusiveCreateLeaf, _ as relativeSidecarLockPath, a as sidecarLockRetryDelay, b as removeStaleSidecarLockIfAllowed, c as validateSidecarLockCompromiseCheckIntervalMs, d as validateSidecarLockTimeoutMs, j as openSidecarRoot, l as validateSidecarLockRetryOptions, m as readSidecarLockRawSnapshot, n as defaultSidecarLockShouldReclaim, o as sidecarLockStale, p as parseSidecarLockSnapshot, r as isTransientLockFileDenial, s as sidecarLockTimeout, t as ensureSidecarLockCleanupRegistered, u as validateSidecarLockStaleMs, v as removeSidecarLockIfUnchanged, w as sidecarReclaimGuardExists, x as serializeSidecarLockPayload } from "./openclaw-state-read-sidecar-lock-registration-C-Pbqw8O.mjs";
import { n as canonicalPathFromExistingAncestor } from "./openclaw-state-read-absolute-path-CL3P5BzZ.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-operations.js
function nativeOpenFlags(flags) {
	return flags | (fs.constants.O_CLOEXEC ?? 0) | (typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0);
}
function removeNativeCreatedFileIfStillPinned(params) {
	if (!params.created) return;
	try {
		const parentPathStat = fs.lstatSync(params.parentPath, { bigint: true });
		const parentFdStat = fs.fstatSync(params.parentFd, { bigint: true });
		const targetPath = path.join(params.parentPath, params.basename);
		const target = fs.lstatSync(targetPath, { bigint: true });
		if (!parentPathStat.isSymbolicLink() && parentPathStat.isDirectory() && sameFileIdentityForCleanup(parentPathStat, parentFdStat) && !target.isSymbolicLink() && target.isFile() && sameFileIdentityForCleanup(target, params.created)) fs.rmSync(targetPath);
	} catch {}
}
async function createNativeExclusiveFile(targetPath, mode) {
	const binding = getNativeBinding("openBeneath");
	if (!binding) return;
	const closeFd = captureNativeFdClose(binding);
	const parentPath = path.dirname(targetPath);
	const basename = path.basename(targetPath);
	const parentFd = fs.openSync(parentPath, fs.constants.O_RDONLY | (typeof fs.constants.O_DIRECTORY === "number" ? fs.constants.O_DIRECTORY : 0));
	let fd;
	let created;
	try {
		let opened;
		try {
			opened = binding.openBeneath(parentFd, basename, nativeOpenFlags(fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL));
		} catch (error) {
			const openError = error;
			if (process.platform === "win32" && openError.code === "EPERM") openError.path = targetPath;
			throw error;
		}
		fd = opened.fd;
		fs.fchmodSync(fd, mode);
		created = fs.fstatSync(fd, { bigint: true });
		const ownedFd = fd;
		let open = true;
		return {
			fd: ownedFd,
			async close() {
				if (open) {
					open = false;
					closeFd(ownedFd);
				}
			},
			async writeFile(data, encoding) {
				const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, encoding ?? "utf8");
				let offset = 0;
				while (offset < buffer.byteLength) {
					const written = fs.writeSync(ownedFd, buffer, offset, buffer.byteLength - offset);
					if (written <= 0) throw Object.assign(/* @__PURE__ */ new Error("native file write made no progress"), { code: "EIO" });
					offset += written;
				}
			}
		};
	} catch (error) {
		if (fd !== void 0) {
			try {
				closeFd(fd);
			} catch {}
			removeNativeCreatedFileIfStillPinned({
				parentPath,
				parentFd,
				basename,
				created
			});
		}
		throw error;
	} finally {
		try {
			fs.closeSync(parentFd);
		} catch {}
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-admission-parser.js
function runSidecarAdmissionBoundary(admission, assertCurrent, callback) {
	assertCurrent();
	try {
		return admission.run(callback);
	} finally {
		assertCurrent();
	}
}
async function awaitSidecarAdmissionBoundary(admission, assertCurrent, callback) {
	assertCurrent();
	try {
		return await admission.run(async () => {
			const boxed = Object.create(null);
			Object.defineProperty(boxed, "value", {
				value: void 0,
				enumerable: true,
				writable: true
			});
			boxed.value = await callback();
			return boxed;
		});
	} finally {
		assertCurrent();
	}
}
function observeSidecarLockParser(state, admission, accessor, assertCurrent) {
	assertCurrent();
	if (state.observed) return;
	try {
		state.parser = admission.run(accessor);
	} finally {
		assertCurrent();
	}
	state.observed = true;
}
function scopedSidecarLockParser(state, admission, assertCurrent) {
	const parser = state.parser;
	return parser && ((raw) => admission.run(() => {
		assertCurrent();
		try {
			return Reflect.apply(parser, void 0, [raw]);
		} finally {
			assertCurrent();
		}
	}));
}
/** Cleanup may outlive its reservation; never invoke user code after authority is lost. */
function conditionalSidecarLockParser(state, admission, isCurrent) {
	const parser = state.parser;
	return parser && ((raw) => {
		if (!isCurrent()) return void 0;
		return admission.run(() => {
			if (!isCurrent()) return void 0;
			let parsed;
			try {
				parsed = Reflect.apply(parser, void 0, [raw]);
			} catch (error) {
				if (!isCurrent()) return void 0;
				throw error;
			}
			return isCurrent() ? parsed : void 0;
		});
	});
}
function parseSidecarLockSnapshotUnderAdmission(raw, state, admission, assertCurrent) {
	return parseSidecarLockSnapshot(raw, scopedSidecarLockParser(state, admission, assertCurrent));
}
/** Emulate the historical EEXIST read/parser boundary without opening another sidecar. */
async function observeHeldSidecarParser(params) {
	const holderChanged = {};
	const assertCurrentHolder = () => {
		params.assertToken();
		if (params.currentHeld() !== params.held || params.held.releasePromise) throw holderChanged;
	};
	let transientDenial = false;
	let raw;
	try {
		raw = await params.admission.run(async () => await readSidecarLockRawSnapshot(params.lockPath, {
			lockRoot: params.lockRoot,
			rejectNonFile: true,
			discardObservation: "changed",
			onOpenFailure: (error) => {
				transientDenial = params.isTransientDenial(error);
			}
		}));
	} catch (error) {
		return {
			kind: "read-error",
			error,
			transientDenial
		};
	}
	params.assertToken();
	if (params.currentHeld() !== params.held || params.held.releasePromise) return { kind: "holder-changed" };
	try {
		observeSidecarLockParser(params.parserState, params.admission, params.parserAccessor, assertCurrentHolder);
		parseSidecarLockSnapshotUnderAdmission(raw, params.parserState, params.admission, assertCurrentHolder);
		assertCurrentHolder();
	} catch (error) {
		if (error === holderChanged) return { kind: "holder-changed" };
		throw error;
	}
	return { kind: "observed" };
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-stale-admission.js
/** Handle one historical EEXIST attempt while its canonical admission is held. */
async function handleStaleSidecarAdmission(params) {
	const { admission, lockPath, normalizedTargetPath, options } = params;
	const holderChanged = {};
	const assertUnheld = () => {
		params.assertToken();
		if (params.currentHeld()) throw holderChanged;
	};
	const retryHolderChange = async (error) => {
		if (error !== holderChanged) return false;
		await params.waitForRetry();
		return true;
	};
	const retryChangedBoundary = async () => {
		try {
			assertUnheld();
			return false;
		} catch (error) {
			if (await retryHolderChange(error)) return true;
			throw error;
		}
	};
	let rawSnapshot;
	let lockFileOpenDenied = false;
	try {
		rawSnapshot = await admission.run(async () => await readSidecarLockRawSnapshot(lockPath, {
			lockRoot: params.lockRoot,
			rejectNonFile: true,
			discardObservation: "changed",
			onOpenFailure: (error) => {
				lockFileOpenDenied = isTransientLockFileDenial(error, lockPath);
			}
		}));
	} catch (error) {
		if (await retryChangedBoundary()) return;
		if (!lockFileOpenDenied || !params.withinDenialBudget()) throw error;
		await params.retryOrRethrowDenial(error);
		return;
	}
	params.assertToken();
	if (params.currentHeld()) {
		await params.waitForRetry();
		return;
	}
	let snapshot;
	try {
		observeSidecarLockParser(params.parserState, admission, () => options.parsePayload, assertUnheld);
		snapshot = parseSidecarLockSnapshotUnderAdmission(rawSnapshot, params.parserState, admission, assertUnheld);
		assertUnheld();
	} catch (error) {
		if (await retryHolderChange(error)) return;
		if (await retryChangedBoundary()) return;
		throw error;
	}
	if (!snapshot) {
		await params.waitForRetry();
		return;
	}
	const staleOptions = params.staleOptionsState;
	try {
		if (!staleOptions.shouldReclaimObserved) {
			assertUnheld();
			staleOptions.shouldReclaim = admission.run(() => options.shouldReclaim);
			staleOptions.shouldReclaimObserved = true;
			assertUnheld();
		}
		if (!staleOptions.shouldRemoveObserved) {
			assertUnheld();
			staleOptions.shouldRemove = admission.run(() => options.shouldRemoveStaleLock);
			staleOptions.shouldRemoveObserved = true;
			assertUnheld();
		}
		if (!staleOptions.staleRecoveryObserved) {
			assertUnheld();
			staleOptions.staleRecovery = admission.run(() => options.staleRecovery);
			staleOptions.staleRecoveryObserved = true;
			assertUnheld();
		}
	} catch (error) {
		if (await retryHolderChange(error)) return;
		if (await retryChangedBoundary()) return;
		throw error;
	}
	const shouldReclaim = staleOptions.shouldReclaim ?? defaultSidecarLockShouldReclaim;
	let reclaim;
	try {
		reclaim = await admission.run(async () => {
			assertUnheld();
			try {
				return await Reflect.apply(shouldReclaim, void 0, [{
					lockPath,
					normalizedTargetPath,
					payload: snapshot.payload ?? null,
					staleMs: params.staleMs,
					nowMs: Date.now(),
					heldByThisProcess: false
				}]);
			} finally {
				assertUnheld();
			}
		});
		assertUnheld();
	} catch (error) {
		if (await retryHolderChange(error)) return;
		if (await retryChangedBoundary()) return;
		throw error;
	}
	if (!reclaim) {
		await params.waitForRetry();
		return;
	}
	let stillPresent;
	try {
		stillPresent = await sidecarLockSnapshotStillPresent(lockPath, snapshot, {
			lockRoot: params.lockRoot,
			parsePayload: scopedSidecarLockParser(params.parserState, admission, assertUnheld)
		});
		assertUnheld();
	} catch (error) {
		if (await retryHolderChange(error)) return;
		if (await retryChangedBoundary()) return;
		throw error;
	}
	if (!stillPresent) {
		await params.waitForRetry();
		return;
	}
	if ((staleOptions.staleRecovery ?? "fail-closed") === "remove-if-unchanged") {
		const acquiredGuard = await admission.run(() => tryAcquireSidecarReclaimGuard(params.reclaimGuards, params.reclaimGuardPath, params.lockRoot));
		if (acquiredGuard) params.setReclaimGuard(acquiredGuard);
		params.assertToken();
		if (params.currentHeld()) {
			if (acquiredGuard) await params.releaseReclaimGuard();
			await params.waitForRetry();
			return;
		}
		if (!acquiredGuard) {
			await params.waitForRetry();
			return;
		}
		const shouldRemove = staleOptions.shouldRemove;
		const assertRemovalAuthorized = assertUnheld;
		const guardedShouldRemove = shouldRemove && function(staleSnapshot) {
			return admission.run(async () => {
				assertRemovalAuthorized();
				try {
					return await Reflect.apply(shouldRemove, this, [staleSnapshot]);
				} finally {
					assertRemovalAuthorized();
				}
			});
		};
		let removal;
		try {
			removal = await removeStaleSidecarLockIfAllowed({
				lockPath,
				normalizedTargetPath,
				snapshot,
				assertGuardHeld: acquiredGuard.assertHeld && (() => admission.run(async () => {
					assertUnheld();
					await acquiredGuard.assertHeld();
					assertUnheld();
				})),
				shouldRemoveStaleLock: guardedShouldRemove,
				lockRoot: params.lockRoot,
				parsePayload: scopedSidecarLockParser(params.parserState, admission, assertRemovalAuthorized),
				assertAuthorized: assertRemovalAuthorized
			});
		} catch (error) {
			if (error !== holderChanged) {
				try {
					assertRemovalAuthorized();
				} catch (boundaryError) {
					if (boundaryError !== holderChanged) throw boundaryError;
				}
				if (!params.currentHeld()) throw error;
			}
			await params.releaseReclaimGuard();
			await params.waitForRetry();
			return;
		}
		params.assertToken();
		if (params.currentHeld()) {
			await params.releaseReclaimGuard();
			await params.waitForRetry();
			return;
		}
		if (removal === "removed") return;
		if (removal === "changed") {
			await params.waitForRetry();
			return;
		}
		await params.releaseReclaimGuard();
	}
	throw sidecarLockStale(lockPath, normalizedTargetPath);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-admission-context.js
const EMPTY_ANCESTRY = Object.freeze([]);
const GLOBAL_CONTEXT_KEY = Symbol.for("fsSafe.sidecarLockAdmissionAsyncContext");
function admissionContext() {
	const shared = globalThis;
	return shared[GLOBAL_CONTEXT_KEY] ??= new AsyncLocalStorage();
}
/** Capture active ancestry now; later lifecycle changes cannot reclassify this call. */
function captureSidecarAdmissionAncestry() {
	const current = admissionContext().getStore();
	if (!current) return EMPTY_ANCESTRY;
	const active = current.ancestry.filter((entry) => entry.active);
	if (current.active) active.push(current);
	return active.length === 0 ? EMPTY_ANCESTRY : active;
}
function ancestryHasSidecarAdmission(ancestry, admissions, normalizedTargetPath) {
	return ancestry.some((entry) => entry.admissions === admissions && entry.normalizedTargetPath === normalizedTargetPath);
}
function createSidecarAdmissionScope(ancestry, admissions, normalizedTargetPath, token) {
	return {
		active: false,
		admissions,
		ancestry,
		normalizedTargetPath,
		started: false,
		token
	};
}
function activateSidecarAdmissionScope(scope) {
	if (scope.started) throw new Error("sidecar admission scope cannot be reactivated");
	scope.started = true;
	scope.active = true;
}
function deactivateSidecarAdmissionScope(scope) {
	if (scope) scope.active = false;
}
function runInSidecarAdmissionScope(scope, callback) {
	return scope?.active ? admissionContext().run(scope, callback) : callback();
}
function createSidecarAdmissionController(ancestry, admissions, normalizedTargetPath) {
	let scope;
	const hasToken = () => scope !== void 0 && admissions.get(normalizedTargetPath) === scope.token;
	return {
		get owns() {
			return scope !== void 0;
		},
		hasToken,
		release() {
			deactivateSidecarAdmissionScope(scope);
			if (hasToken()) admissions.delete(normalizedTargetPath);
			scope = void 0;
		},
		reserve() {
			const token = {};
			scope = createSidecarAdmissionScope(ancestry, admissions, normalizedTargetPath, token);
			admissions.set(normalizedTargetPath, token);
			activateSidecarAdmissionScope(scope);
		},
		run(callback) {
			return runInSidecarAdmissionScope(scope, callback);
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-target.js
function isCwdIndependentAbsolutePath(filePath) {
	if (!path.isAbsolute(filePath)) return false;
	return process.platform !== "win32" || path.parse(filePath).root.length > 1;
}
async function resolveSidecarTargetPath(resolved, lockRoot) {
	assertNoWindowsPathAlias(resolved);
	const dir = path.dirname(resolved);
	if (lockRoot) {
		await lockRoot.resolve(".");
		const parent = await canonicalPathFromExistingAncestor(dir);
		await lockRoot.resolve(".");
		assertNoWindowsPathAlias(parent);
		const normalized = path.join(parent, path.basename(resolved));
		assertNoWindowsPathAlias(normalized);
		return normalized;
	}
	let parentExists = false;
	try {
		parentExists = fs.statSync(dir).isDirectory();
	} catch {}
	if (!parentExists) await fs$1.mkdir(recursiveMkdirPath(dir), { recursive: true });
	let parent;
	try {
		parent = realpathSync$1.native(dir);
	} catch {
		return resolved;
	}
	assertNoWindowsPathAlias(parent);
	const normalized = path.join(parent, path.basename(resolved));
	assertNoWindowsPathAlias(normalized);
	return normalized;
}
async function resolveSidecarLockPaths(targetPath, explicitLockPath, lockRoot) {
	const anchoredTargetPath = anchorWindowsDriveRelativePath(targetPath);
	assertNoWindowsPathAlias(anchoredTargetPath);
	const resolvedTargetPath = path.resolve(anchoredTargetPath);
	let resolvedLockPath;
	if (explicitLockPath !== void 0) {
		const anchoredLockPath = anchorWindowsDriveRelativePath(explicitLockPath);
		assertNoWindowsPathAlias(anchoredLockPath);
		resolvedLockPath = isCwdIndependentAbsolutePath(explicitLockPath) ? explicitLockPath : path.resolve(anchoredLockPath);
	}
	const normalizedTargetPath = await resolveSidecarTargetPath(resolvedTargetPath, lockRoot);
	const lockPath = resolvedLockPath ?? `${normalizedTargetPath}.lock`;
	assertNoWindowsPathAlias(lockPath);
	return {
		lockPath,
		normalizedTargetPath
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-retained.js
function mismatch(check) {
	return new FsSafeError("path-mismatch", `created sidecar lock ${check} changed; replacement preserved`);
}
function assertOwnerRecord(fd, expected) {
	if (fs.fstatSync(fd, { bigint: true }).size !== BigInt(expected.length)) throw mismatch("owner record");
	const bytes = Buffer.alloc(expected.length);
	let offset = 0;
	while (offset < bytes.length) {
		const read = fs.readSync(fd, bytes, offset, bytes.length - offset, offset);
		if (read === 0) throw mismatch("owner record");
		offset += read;
	}
	if (!bytes.equals(expected)) throw mismatch("owner record");
}
/** Borrowed creation authority: never reopens a path or closes the writer's fds. */
function cleanupCreatedSidecar(lockPath, raw, fd, parent, identity) {
	const name = path.basename(lockPath);
	const windows = process.platform === "win32";
	try {
		if (windows) {
			if (!parent.binding.rootRemovalStat || !parent.binding.rootRemovalUnlink) throw new FsSafeError("helper-unavailable", "creator cleanup is unavailable");
			const entry = parent.binding.rootRemovalStat(parent.fd, name);
			if (entry.directory || entry.symlink || !sameFileIdentityForCleanup(identity, entry)) throw mismatch("identity");
		} else if (!parent.binding.stagedFileMatches || !parent.binding.removeStagedFile) throw new FsSafeError("helper-unavailable", "creator cleanup is unavailable");
		else if (!parent.binding.stagedFileMatches(parent.fd, name, fd)) throw mismatch("identity");
	} catch (error) {
		if (hasErrorCode(error, "ENOENT")) return;
		throw error;
	}
	const stat = fs.fstatSync(fd, { bigint: true });
	if (!stat.isFile() || stat.nlink !== 1n || !sameFileIdentityForCleanup(identity, stat)) throw mismatch("identity");
	assertOwnerRecord(fd, Buffer.from(raw));
	if (windows) try {
		parent.binding.rootRemovalUnlink(parent.fd, name, identity.dev, identity.ino, false);
	} catch (error) {
		if (!hasErrorCode(error, "ENOENT")) throw error;
	}
	else if (parent.binding.removeStagedFile(parent.fd, name, fd) === "preserved") throw mismatch("identity");
}
/** Called only by the exclusive creator while its verified descriptor is alive. */
function retainCreatedSidecar(lockPath, raw, createdFd, guard, nativeParent) {
	const binding = nativeParent?.binding;
	if (!binding) return void 0;
	const created = fs.fstatSync(createdFd, { bigint: true });
	if (!created.isFile() || created.nlink !== 1n) throw mismatch("identity");
	const identity = Object.freeze({
		dev: created.dev,
		ino: created.ino
	});
	const name = path.basename(lockPath);
	if (process.platform === "win32") {
		if (!binding.retainWindowsSidecar) return void 0;
		const native = binding.retainWindowsSidecar(nativeParent.fd, guard.realPath, name, BigInt(guard.stat.dev), BigInt(guard.stat.ino), created.dev, created.ino, BigInt(Buffer.byteLength(raw)), sha256Hex(raw), 1048576);
		const admitted = native.admission;
		if (admitted.status === "unsupported" && admitted.resources === "closed") return void 0;
		if (admitted.status !== "retained") throw new FsSafeError("helper-failed", "could not retain created sidecar lock", { details: { result: admitted } });
		return {
			identity,
			settle(remove, reportMismatch = true) {
				const result = native.settle(remove);
				if (result.status === "preserved-mismatch") {
					if (reportMismatch || result.resources !== "closed") throw mismatch(result.errors.some((error) => /digest|size changed/u.test(error.message)) ? "owner record" : "identity");
					return;
				}
				if (result.errors.length || result.resources !== "closed" || remove && result.disposition !== "accepted" && result.namespace !== "absent") throw new FsSafeError("helper-failed", "retained sidecar lock settlement failed", { details: { result } });
			}
		};
	}
	if (!binding.openBeneath || !binding.stagedFileMatches || !binding.removeStagedFile) return void 0;
	const closeFile = captureNativeFdClose(binding);
	const parentFd = binding.openBeneath(nativeParent.fd, "", nativeOpenFlags(fs.constants.O_RDONLY | fs.constants.O_DIRECTORY)).fd;
	let fd;
	try {
		const parentStat = fs.fstatSync(parentFd, { bigint: true });
		if (!parentStat.isDirectory() || !sameFileIdentityForCleanup(guard.stat, parentStat)) throw mismatch("identity");
		fd = binding.openBeneath(parentFd, name, nativeOpenFlags(fs.constants.O_RDONLY | fs.constants.O_NONBLOCK)).fd;
		const ownedFd = fd;
		const assertIdentity = () => {
			try {
				if (!binding.stagedFileMatches(parentFd, name, ownedFd)) throw mismatch("identity");
			} catch (error) {
				if (hasErrorCode(error, "ENOENT")) return false;
				throw error;
			}
			const current = fs.fstatSync(ownedFd, { bigint: true });
			if (!current.isFile() || current.nlink !== 1n || !sameFileIdentityForCleanup(created, current)) throw mismatch("identity");
			return true;
		};
		const expected = Buffer.from(raw);
		const assertOwner = () => assertOwnerRecord(ownedFd, expected);
		if (!assertIdentity()) throw mismatch("identity");
		assertOwner();
		let settled = false;
		return {
			identity,
			settle(remove, reportMismatch = true) {
				if (settled) return;
				settled = true;
				const errors = [];
				try {
					if (remove && assertIdentity()) {
						assertOwner();
						if (assertIdentity() && binding.removeStagedFile(parentFd, name, ownedFd) === "preserved") throw mismatch("identity");
					}
				} catch (error) {
					if (reportMismatch || !(error instanceof FsSafeError && error.code === "path-mismatch")) errors.push(error);
				}
				try {
					closeFile(ownedFd);
				} catch (error) {
					errors.push(error);
				}
				try {
					closeFile(parentFd);
				} catch (error) {
					errors.push(error);
				}
				if (errors.length === 1) throw errors[0];
				if (errors.length) throw new AggregateError(errors, "sidecar lock cleanup and close failed");
			}
		};
	} catch (error) {
		const errors = [error];
		try {
			if (fd !== void 0) closeFile(fd);
		} catch (closeError) {
			errors.push(closeError);
		}
		try {
			closeFile(parentFd);
		} catch (closeError) {
			errors.push(closeError);
		}
		if (errors.length > 1) throw new AggregateError(errors, "sidecar retention and close failed");
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-handle.js
function stopSidecarLockMonitoring(held) {
	const timer = held.compromiseTimer;
	held.compromiseTimer = void 0;
	if (timer) clearInterval(timer);
}
function createSidecarLockHandle(params) {
	let released = false;
	let releasePromise;
	let releaseStarted = false;
	const release = async () => {
		if (released) return;
		if (!releasePromise) {
			const retry = releaseStarted;
			releaseStarted = true;
			releasePromise = (async () => {
				await params.release({ retry });
				released = true;
			})();
		}
		try {
			await releasePromise;
		} finally {
			releasePromise = void 0;
		}
	};
	return {
		lockPath: params.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		verifyStillHeld: params.verifyStillHeld,
		release,
		[Symbol.asyncDispose]: release
	};
}
function createHeldSidecarLockHandle(params) {
	return createSidecarLockHandle({
		lockPath: params.held.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		verifyStillHeld: async () => await sidecarLockSnapshotStillPresent(params.held.lockPath, params.held.snapshot, {
			lockRoot: params.held.lockRoot,
			parsePayload: params.held.parsePayload
		}),
		release: (options) => params.release(options)
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock-acquire.js
async function acquireSidecarLock(options, context) {
	const admissionAncestry = captureSidecarAdmissionAncestry();
	const retainOnExit = options.retainOnExit;
	context.assertRetainOnExitSupported(retainOnExit);
	const retry = options.retry ?? {};
	const timeoutMs = options.timeoutMs;
	const staleMs = options.staleMs;
	const compromiseCheckIntervalMs = options.compromiseCheckIntervalMs;
	validateSidecarLockRetryOptions(retry);
	validateSidecarLockTimeoutMs(timeoutMs);
	validateSidecarLockStaleMs(staleMs);
	validateSidecarLockCompromiseCheckIntervalMs(compromiseCheckIntervalMs);
	const targetPath = options.targetPath;
	const explicitLockPath = options.lockPath;
	const lockRoot = options.lockRoot;
	const requestedReentrantOwner = options.reentrantOwner;
	const { lockPath, normalizedTargetPath } = await resolveSidecarLockPaths(targetPath, explicitLockPath, lockRoot);
	const activeDescendant = ancestryHasSidecarAdmission(admissionAncestry, context.admissions, normalizedTargetPath);
	const isReentrant = (candidate) => !!candidate && requestedReentrantOwner !== void 0 && candidate.reentrantOwner !== void 0 && requestedReentrantOwner === candidate.reentrantOwner;
	const reuseHeldLock = (candidate) => {
		const lifecycle = context.ensureExitCleanupRegistered();
		context.assertRetainOnExitSupported(retainOnExit);
		if (context.held.get(normalizedTargetPath) !== candidate || candidate.releasePromise) return void 0;
		candidate.refCount = (candidate.refCount ?? 1) + 1;
		if (retainOnExit === true) candidate.retainOnExit = true;
		const returnedHandle = context.handleForHeldLock(normalizedTargetPath, candidate);
		context.armExitCleanup(lifecycle);
		return returnedHandle;
	};
	let held = context.held.get(normalizedTargetPath);
	if (isReentrant(held)) {
		if (held.releasePromise) {
			if (activeDescendant) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
			await held.releasePromise.catch(() => void 0);
			held = context.held.get(normalizedTargetPath);
		}
		if (isReentrant(held)) {
			const reused = reuseHeldLock(held);
			if (reused) return reused;
		}
	}
	if (activeDescendant) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
	const admission = createSidecarAdmissionController(admissionAncestry, context.admissions, normalizedTargetPath);
	const startedAt = performance.now();
	const reclaimGuardPath = `${lockPath}.reclaim`;
	let reclaimGuard;
	const releaseReclaimGuard = async () => {
		if (!reclaimGuard) return;
		await admission.run(() => reclaimGuard.release());
		reclaimGuard = void 0;
	};
	let attempt = 0;
	let transientDenials = 0;
	let payloadCallback;
	let metadata = void 0;
	let metadataObserved = false;
	let onCompromised = void 0;
	let onCompromisedObserved = false;
	const staleOptionsState = {};
	const withinDenialBudget = () => ++transientDenials <= 8;
	const waitForRetry = async () => {
		admission.release();
		const delay = sidecarLockRetryDelay(retry, timeoutMs === Number.POSITIVE_INFINITY ? void 0 : timeoutMs, performance.now() - startedAt, attempt);
		if (delay === void 0) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
		attempt += 1;
		await sleep(delay);
	};
	const retryOrRethrowDenial = async (denial) => {
		try {
			await waitForRetry();
		} catch (waitError) {
			if (waitError?.code === "file_lock_timeout") throw denial;
			throw waitError;
		}
	};
	const assertAdmissionToken = () => {
		if (!admission.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
	};
	try {
		while (true) {
			if (!admission.owns) {
				held = context.held.get(normalizedTargetPath);
				if (isReentrant(held)) {
					if (held.releasePromise) {
						await held.releasePromise.catch(() => void 0);
						held = context.held.get(normalizedTargetPath);
					}
					if (isReentrant(held)) {
						const reused = reuseHeldLock(held);
						if (reused) return reused;
						continue;
					}
				}
				if (context.admissions.has(normalizedTargetPath)) {
					await waitForRetry();
					continue;
				}
				admission.reserve();
			}
			const attemptHeld = context.held.get(normalizedTargetPath);
			const holderWasReplaced = () => {
				const current = context.held.get(normalizedTargetPath);
				return current !== void 0 && current !== attemptHeld;
			};
			const lifecycle = admission.run(() => context.ensureExitCleanupRegistered());
			assertAdmissionToken();
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			admission.run(() => context.assertRetainOnExitSupported(retainOnExit));
			assertAdmissionToken();
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			if (reclaimGuard?.assertHeld) await admission.run(() => reclaimGuard.assertHeld());
			const reclaimGuardExists = !reclaimGuard && await (lockRoot ? admission.run(() => sidecarReclaimGuardExists(reclaimGuardPath, lockRoot)) : sidecarReclaimGuardExists(reclaimGuardPath));
			assertAdmissionToken();
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			if (reclaimGuardExists) {
				await waitForRetry();
				continue;
			}
			let handle = null;
			let retainedSidecar;
			let createdSnapshot = null, createdHeld;
			let admissionConflict = false;
			let exclusiveCreateConflict = false;
			let lockFileCreateDenied = false;
			const parserState = { observed: false };
			if (!payloadCallback) payloadCallback = runSidecarAdmissionBoundary(admission, assertAdmissionToken, () => options.payload);
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			const { value: payload } = await awaitSidecarAdmissionBoundary(admission, assertAdmissionToken, () => Reflect.apply(payloadCallback, options, []));
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			const { raw, ownershipToken } = runSidecarAdmissionBoundary(admission, assertAdmissionToken, () => serializeSidecarLockPayload(payload));
			if (holderWasReplaced()) {
				await waitForRetry();
				continue;
			}
			held = context.held.get(normalizedTargetPath);
			if (held?.releasePromise) {
				await held.releasePromise.catch(() => void 0);
				assertAdmissionToken();
				held = context.held.get(normalizedTargetPath);
			}
			if (held?.lockPath === lockPath) {
				const observedHeld = held;
				const observation = await observeHeldSidecarParser({
					admission,
					assertToken: assertAdmissionToken,
					currentHeld: () => context.held.get(normalizedTargetPath),
					held: observedHeld,
					lockPath,
					lockRoot,
					parserState,
					parserAccessor: () => options.parsePayload,
					isTransientDenial: (error) => isTransientLockFileDenial(error, lockPath)
				});
				assertAdmissionToken();
				held = context.held.get(normalizedTargetPath);
				if (held !== observedHeld || observedHeld.releasePromise) {
					await waitForRetry();
					continue;
				}
				if (observation.kind === "read-error") {
					if (!observation.transientDenial || !withinDenialBudget()) throw observation.error;
					await retryOrRethrowDenial(observation.error);
					continue;
				}
			}
			if (held) {
				await waitForRetry();
				continue;
			}
			if (!metadataObserved) {
				metadata = runSidecarAdmissionBoundary(admission, assertAdmissionToken, () => options.metadata);
				metadataObserved = true;
				if (context.held.has(normalizedTargetPath)) {
					await waitForRetry();
					continue;
				}
			}
			if (!onCompromisedObserved) {
				onCompromised = runSidecarAdmissionBoundary(admission, assertAdmissionToken, () => options.onCompromised);
				onCompromisedObserved = true;
				if (context.held.has(normalizedTargetPath)) {
					await waitForRetry();
					continue;
				}
			}
			assertAdmissionToken();
			if (context.held.has(normalizedTargetPath)) {
				await waitForRetry();
				continue;
			}
			try {
				if (lockRoot) {
					const relativeLockPath = relativeSidecarLockPath(lockRoot, lockPath);
					const observation = fileObservation();
					try {
						await observation.run(() => lockRoot.create(relativeLockPath, raw, {
							mkdir: true,
							mode: 384,
							...sidecarRetainedCreate({
								retain(fd, parent, nativeParent) {
									retainedSidecar = retainCreatedSidecar(lockPath, raw, fd, parent, nativeParent);
								},
								cleanup(fd, parent, identity) {
									cleanupCreatedSidecar(lockPath, raw, fd, parent, identity);
								}
							})
						}));
					} catch (error) {
						lockFileCreateDenied = observation.has(error, `exclusive-create:${lockPath}`) && isTransientLockFileDenial(error, lockPath);
						if (error instanceof FsSafeError && error.code === "already-exists") {
							exclusiveCreateConflict = true;
							throw Object.assign(/* @__PURE__ */ new Error("sidecar lock exists"), { code: "EEXIST" });
						}
						throw error;
					}
					createdSnapshot = {
						raw,
						payload,
						ownershipToken
					};
					const opened = await openSidecarRoot(lockRoot, relativeLockPath, "unlinked");
					if (!opened) {
						retainedSidecar?.settle(true, false);
						await waitForRetry();
						continue;
					}
					try {
						if (!(await readFileHandleBounded(opened.handle, Buffer.byteLength(raw))).equals(Buffer.from(raw))) throw new FsSafeError("path-mismatch", "created sidecar lock changed before admission");
					} catch (error) {
						await opened.handle.close().catch(() => void 0);
						throw error;
					}
					handle = opened.handle;
				} else {
					const failedOpen = (createError) => {
						lockFileCreateDenied = isTransientLockFileDenial(createError, lockPath);
						exclusiveCreateConflict = createError.code === "EEXIST";
						throw createError;
					};
					handle = await createNativeExclusiveFile(lockPath, 384).catch(failedOpen) ?? null;
					if (!handle) {
						try {
							assertExclusiveCreateLeaf(lockPath);
						} catch (error) {
							exclusiveCreateConflict = error.code === "EEXIST";
							throw error;
						}
						handle = await fs$1.open(lockPath, "wx", 384).catch(failedOpen);
					}
					await handle.writeFile(raw, "utf8");
				}
				const snapshot = {
					raw,
					payload,
					stat: fs.fstatSync(handle.fd, { bigint: true }),
					ownershipToken
				};
				createdSnapshot = snapshot;
				if (retainedSidecar && !sameFileIdentityForCleanup(retainedSidecar.identity, snapshot.stat)) throw new FsSafeError("path-mismatch", "created sidecar lock identity changed before admission");
				if (snapshot.stat.nlink === 0n) {
					retainedSidecar?.settle(true, false);
					await handle.close();
					handle = null;
					await waitForRetry();
					continue;
				}
				observeSidecarLockParser(parserState, admission, () => options.parsePayload, assertAdmissionToken);
				if (context.held.has(normalizedTargetPath)) {
					admissionConflict = true;
					throw Object.assign(/* @__PURE__ */ new Error("sidecar lock admission changed"), { code: "EEXIST" });
				}
				if (retainedSidecar && process.platform === "win32") await handle.close();
				createdHeld = {
					refCount: 1,
					reentrantOwner: requestedReentrantOwner,
					handle,
					retainedSidecar,
					lockPath,
					snapshot,
					acquiredAt: Date.now(),
					metadata: metadata ?? {},
					lockRoot,
					retainOnExit,
					parsePayload: parserState.parser
				};
				const candidateHeld = createdHeld;
				if (reclaimGuard) await releaseReclaimGuard();
				const returnedHandle = admission.run(() => context.handleForHeldLock(normalizedTargetPath, candidateHeld));
				if (onCompromised && compromiseCheckIntervalMs !== void 0 && compromiseCheckIntervalMs > 0) {
					const compromisedCallback = onCompromised;
					let compromiseCheckInFlight = false;
					candidateHeld.compromiseTimer = admission.run(() => setInterval(() => {
						if (compromiseCheckInFlight) return;
						compromiseCheckInFlight = true;
						returnedHandle.verifyStillHeld().catch(() => false).then((stillHeld) => {
							if (!stillHeld && candidateHeld.compromiseTimer) {
								stopSidecarLockMonitoring(candidateHeld);
								Reflect.apply(compromisedCallback, options, [{
									lockPath,
									normalizedTargetPath
								}]);
							}
						}).finally(() => {
							compromiseCheckInFlight = false;
						});
					}, compromiseCheckIntervalMs));
					admission.run(() => candidateHeld.compromiseTimer?.unref());
				}
				if (!admission.hasToken() || context.held.has(normalizedTargetPath)) {
					admissionConflict = true;
					throw Object.assign(/* @__PURE__ */ new Error("sidecar lock admission changed"), { code: "EEXIST" });
				}
				context.held.set(normalizedTargetPath, candidateHeld);
				admission.release();
				context.armExitCleanup(lifecycle);
				return returnedHandle;
			} catch (err) {
				try {
					if (createdHeld) stopSidecarLockMonitoring(createdHeld);
					let failedSnapshot = createdSnapshot;
					if (handle) {
						failedSnapshot ??= { payload: null };
						try {
							failedSnapshot.stat = fs.fstatSync(handle.fd, { bigint: true });
						} catch {}
						const current = context.held.get(normalizedTargetPath);
						if (createdHeld && current === createdHeld) context.held.delete(normalizedTargetPath);
						await handle.close().catch(() => void 0);
					}
					if (retainedSidecar) retainedSidecar.settle(true, false);
					else if (failedSnapshot) await removeSidecarLockIfUnchanged(lockPath, failedSnapshot, {
						lockRoot,
						parsePayload: conditionalSidecarLockParser(parserState, admission, () => admission.hasToken() && !context.held.has(normalizedTargetPath))
					});
				} catch (cleanupError) {
					throw createSuppressedError(cleanupError, err, "file lock acquisition and cleanup both failed");
				}
				if (admissionConflict) {
					await waitForRetry();
					continue;
				}
				if (lockFileCreateDenied) {
					assertAdmissionToken();
					if (context.held.has(normalizedTargetPath)) {
						await waitForRetry();
						continue;
					}
					if (withinDenialBudget()) {
						await retryOrRethrowDenial(err);
						continue;
					}
					throw err;
				}
				if (!exclusiveCreateConflict) throw err;
				assertAdmissionToken();
				if (context.held.has(normalizedTargetPath)) {
					await waitForRetry();
					continue;
				}
				if (reclaimGuard) {
					await releaseReclaimGuard();
					await waitForRetry();
					continue;
				}
				await handleStaleSidecarAdmission({
					admission,
					assertToken: assertAdmissionToken,
					currentHeld: () => context.held.get(normalizedTargetPath),
					lockPath,
					lockRoot,
					normalizedTargetPath,
					options,
					parserState,
					reclaimGuardPath,
					reclaimGuards: context.reclaimGuards,
					setReclaimGuard: (guard) => {
						reclaimGuard = guard;
					},
					releaseReclaimGuard,
					staleOptionsState,
					staleMs,
					withinDenialBudget,
					retryOrRethrowDenial,
					waitForRetry
				});
				continue;
			}
		}
	} finally {
		if (reclaimGuard) await releaseReclaimGuard().catch(() => void 0);
		admission.release();
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/sidecar-lock.js
const GLOBAL_STATE_KEY = Symbol.for("fsSafe.sidecarLockManagers");
const GLOBAL_CLEANUP_KEY = Symbol.for("fsSafe.sidecarLockCleanupRegistered");
const GLOBAL_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.sidecarLockCleanupHandler");
const GLOBAL_CLEANUP_REGISTRATION_KEY = Symbol.for("fsSafe.sidecarLockCleanupRegistration");
const GLOBAL_BEFORE_EXIT_KEY = Symbol.for("fsSafe.sidecarLockBeforeExitCleanup");
const GLOBAL_BEFORE_EXIT_HANDLER_KEY = Symbol.for("fsSafe.sidecarLockBeforeExitCleanupHandler");
const GLOBAL_BEFORE_EXIT_REGISTRATION_KEY = Symbol.for("fsSafe.sidecarLockBeforeExitCleanupRegistration");
const GLOBAL_RETAIN_AWARE_KEY = Symbol.for("fsSafe.sidecarLockRetainAwareCleanup");
function getGlobalManagers() {
	const globalWithState = globalThis;
	if (!globalWithState[GLOBAL_STATE_KEY]) globalWithState[GLOBAL_STATE_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[GLOBAL_STATE_KEY];
}
function resolveManagerState(key) {
	const managers = getGlobalManagers();
	let state = managers.get(key);
	if (!state) {
		state = {
			cleanupRegistered: false,
			held: /* @__PURE__ */ new Map(),
			admissions: /* @__PURE__ */ new Map(),
			reclaimCleanupRegistered: false,
			reclaimGuards: /* @__PURE__ */ new Set()
		};
		managers.set(key, state);
	} else {
		state.admissions ??= /* @__PURE__ */ new Map();
		state.reclaimCleanupRegistered ??= false;
		state.reclaimGuards ??= /* @__PURE__ */ new Set();
	}
	return state;
}
function snapshotMatchesSync(lockPath, observed) {
	let fd;
	try {
		const beforeStat = fs.lstatSync(lockPath, { bigint: true });
		if (!beforeStat.isFile()) return false;
		const openFlags = fs.constants.O_RDONLY | (process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0) | (typeof fs.constants.O_NONBLOCK === "number" ? fs.constants.O_NONBLOCK : 0);
		fd = fs.openSync(lockPath, openFlags);
		const openedStat = fs.fstatSync(fd, { bigint: true });
		if (!openedStat.isFile() || !sameFileIdentityForCleanup(openedStat, openedStat)) return false;
		if (observed.raw !== void 0 && openedStat.size !== BigInt(Buffer.byteLength(observed.raw))) return false;
		const raw = fs.readFileSync(fd, "utf8");
		const afterStat = fs.lstatSync(lockPath, { bigint: true });
		if (!afterStat.isFile() || !sameFileIdentityForCleanup(beforeStat, afterStat)) return false;
		return sidecarLockSnapshotMatches({
			raw,
			payload: null,
			stat: afterStat
		}, observed);
	} catch {
		return false;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function releaseAllReclaimGuardsSync(state) {
	for (const reclaimGuardPath of state.reclaimGuards ?? []) try {
		fs.rmdirSync(reclaimGuardPath);
		state.reclaimGuards.delete(reclaimGuardPath);
	} catch {}
}
function releaseAllLocksSync(state, options) {
	for (const [normalizedTargetPath, held] of state.held) {
		stopSidecarLockMonitoring(held);
		held.handle.close().catch(() => void 0);
		try {
			const retained = options?.preserveRetained === true && held.retainOnExit;
			if (held.retainedSidecar) held.retainedSidecar.settle(!retained);
			else if (!retained && !held.lockRoot && snapshotMatchesSync(held.lockPath, held.snapshot)) fs.rmSync(held.lockPath, { force: true });
		} catch {}
		state.held.delete(normalizedTargetPath);
	}
	state.admissions?.clear();
	releaseAllReclaimGuardsSync(state);
}
function ensureGlobalExitCleanupRegistered() {
	const cleanup = () => {
		for (const state of getGlobalManagers().values()) releaseAllLocksSync(state, { preserveRetained: true });
	};
	ensureSidecarLockCleanupRegistered({
		event: "exit",
		registered: GLOBAL_CLEANUP_KEY,
		registering: GLOBAL_CLEANUP_REGISTRATION_KEY,
		handler: GLOBAL_CLEANUP_HANDLER_KEY,
		retainAware: GLOBAL_RETAIN_AWARE_KEY,
		reentryError: () => new FsSafeError("helper-unavailable", "sidecar lock exit cleanup registration is already in progress")
	}, cleanup, true);
}
/** True when a retain-unaware package copy registered the process-exit handlers first. */
function exitCleanupCannotRetain() {
	const globalWithCleanup = globalThis;
	return globalWithCleanup[GLOBAL_CLEANUP_KEY] === true && globalWithCleanup[GLOBAL_RETAIN_AWARE_KEY] !== true;
}
function ensureGlobalBeforeExitCleanupRegistered() {
	const lifecycle = { armed: false };
	const cleanup = () => {
		if (!lifecycle.armed) return;
		lifecycle.armed = false;
		for (const state of getGlobalManagers().values()) for (const [normalizedTargetPath, held] of Array.from(state.held.entries())) if (held.lockRoot && !held.retainOnExit) releaseHeldLock(state, normalizedTargetPath, held, { force: true }).catch(() => void 0);
	};
	return ensureSidecarLockCleanupRegistered({
		event: "beforeExit",
		registered: GLOBAL_BEFORE_EXIT_KEY,
		registering: GLOBAL_BEFORE_EXIT_REGISTRATION_KEY,
		handler: GLOBAL_BEFORE_EXIT_HANDLER_KEY,
		reentryError: () => new FsSafeError("helper-unavailable", "sidecar lock before-exit cleanup registration is already in progress")
	}, cleanup, lifecycle);
}
async function releaseHeldLock(state, normalizedTargetPath, held, options = {}) {
	if (state.held.get(normalizedTargetPath) !== held) return false;
	if (held.releasePromise) {
		await held.releasePromise;
		return true;
	}
	held.refCount ??= 1;
	if (options.force) held.refCount = 0;
	else if (!options.retry && held.refCount > 0) held.refCount -= 1;
	if (held.refCount > 0) return false;
	held.releasePromise = (async () => {
		await held.handle.close().catch(() => void 0);
		if (held.retainedSidecar) {
			try {
				held.retainedSidecar.settle(true);
			} finally {
				if (state.held.get(normalizedTargetPath) === held) state.held.delete(normalizedTargetPath);
				stopSidecarLockMonitoring(held);
			}
			return;
		}
		await removeSidecarLockIfUnchanged(held.lockPath, held.snapshot, {
			lockRoot: held.lockRoot,
			parsePayload: held.parsePayload
		});
		if (state.held.get(normalizedTargetPath) === held) state.held.delete(normalizedTargetPath);
		stopSidecarLockMonitoring(held);
	})();
	try {
		await held.releasePromise;
		return true;
	} finally {
		held.releasePromise = void 0;
	}
}
function handleForHeldLock(state, normalizedTargetPath, held) {
	return createHeldSidecarLockHandle({
		normalizedTargetPath,
		held,
		release: async (options) => await releaseHeldLock(state, normalizedTargetPath, held, { retry: options?.retry })
	});
}
function createSidecarLockManager(key) {
	const state = resolveManagerState(key);
	function ensureExitCleanupRegistered() {
		ensureGlobalExitCleanupRegistered();
		const lifecycle = ensureGlobalBeforeExitCleanupRegistered();
		state.cleanupRegistered = true;
		state.reclaimCleanupRegistered = true;
		return lifecycle;
	}
	function armExitCleanup(lifecycle) {
		lifecycle.armed = true;
	}
	function assertRetainOnExitSupported(retainOnExit) {
		if (retainOnExit !== true || !exitCleanupCannotRetain()) return;
		throw new FsSafeError("helper-unavailable", "retainOnExit requires this process's exit handlers to be retain-aware; an older package copy registered them first");
	}
	async function acquire(options) {
		return await acquireSidecarLock(options, {
			held: state.held,
			admissions: state.admissions,
			reclaimGuards: state.reclaimGuards,
			ensureExitCleanupRegistered,
			armExitCleanup,
			assertRetainOnExitSupported,
			handleForHeldLock: (normalizedTargetPath, held) => handleForHeldLock(state, normalizedTargetPath, held)
		});
	}
	async function withLock(options, fn) {
		const lock = await acquire(options);
		let result;
		try {
			result = await fn();
		} catch (bodyError) {
			try {
				await lock.release();
			} catch (releaseError) {
				throw createSuppressedError(releaseError, bodyError, "file lock callback and release both failed");
			}
			throw bodyError;
		}
		await lock.release();
		return result;
	}
	async function drain() {
		for (const [normalizedTargetPath, held] of Array.from(state.held.entries())) await releaseHeldLock(state, normalizedTargetPath, held, { force: true }).catch(() => void 0);
	}
	function reset() {
		releaseAllLocksSync(state);
	}
	function heldEntries() {
		return Array.from(state.held.entries()).map(([normalizedTargetPath, held]) => ({
			normalizedTargetPath,
			lockPath: held.lockPath,
			acquiredAt: held.acquiredAt,
			metadata: held.metadata,
			forceRelease: () => releaseHeldLock(state, normalizedTargetPath, held, { force: true })
		}));
	}
	return {
		acquire,
		withLock,
		drain,
		reset,
		heldEntries
	};
}
async function withSidecarLock(targetPath, options, fn) {
	const manager = createSidecarLockManager(options.managerKey ?? `fs-safe.sidecar-lock:${targetPath}`);
	const { managerKey: _managerKey, ...acquireOptions } = options;
	return await manager.withLock({
		...acquireOptions,
		targetPath
	}, fn);
}
//#endregion
export { removeNativeCreatedFileIfStillPinned as i, withSidecarLock as n, nativeOpenFlags as r, createSidecarLockManager as t };
