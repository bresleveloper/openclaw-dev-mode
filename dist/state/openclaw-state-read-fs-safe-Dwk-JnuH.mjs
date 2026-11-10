import { $ as normalizePinnedPathError, At as sameFileIdentity, B as createAsyncDirectoryGuard, C as admitPathInsideRoot, Ct as inspectFileIdentitySync, D as isNativeDirectoryObservationGuard, Dt as normalizeMaxBytes, E as inspectNativeDirectoryObservation, Et as recordFileObservationFailure, F as assertDirectoryIdentitySync, H as extendDirectoryObservationGuard, I as assertDirectoryObservationGuardSync, J as directoryComponentNotDirectoryError, K as assertStatObservationSync, L as assertDirectoryObservationSync, M as shortPath, Mt as sha256Hex, N as assertAsyncDirectoryGuard, Ot as hasSafeFileIdentity, P as assertDirectoryGuard, Q as isAlreadyExistsError, R as assertSyncDirectoryGuard, St as inspectFileIdentity, T as getNativeDirectoryObservationBackend, Tt as isFileObservationFailure, U as inspectDirectoryIdentity, V as createNearestExistingDirectoryGuard, W as inspectDirectoryIdentitySync, X as fileNotFoundError, Y as errorCauseOptions, Z as hardlinkedPathNotAllowedError, _ as resolveRootPathWithObservation, _t as selectNativeBinding, a as assertFinalSymlinkRejected, bt as isFsSafeNativeRequired, c as exactFileIdentity, ct as assertNoUnsafeDeviceReadPath, d as resolveReadOpenFlags, dt as realpathSync$1, et as normalizePinnedWriteError, f as ROOT_PATH_ALIAS_POLICIES, gt as requireNativeBinding, h as resolveRootPathSync, i as readFileHandleBoundedWithSize, it as rootPathChangedError, jt as sameFileIdentityForCleanup, k as statIdentityFromNative, l as numberStatScalar, m as resolveRootPathForRemoval, mt as getNativeBinding, nt as normalizeRemovePathError, o as mutationSymlinkResolution, ot as isSafePathSegment, p as resolveRootPath, pt as assertNativeCapabilities, q as inspectStatObservationSync, r as readFileHandleBounded, rt as outsideWorkspaceError, s as readSymlinkResolution, st as WINDOWS_RESERVED_DEVICE_NAMES, tt as normalizeRemoveGuardError, u as numberStats, v as RootPathObservationError, vt as getFsSafeNativeConfig, w as sameNormalizedPathSpelling, wt as fileObservation, x as resolvePathViaExistingAncestor, xt as captureNativeFdClose, z as captureDirectoryGuard } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { a as isPathInside, b as FsSafeError, d as assertNoWindowsPathAlias, g as resolvePathPreservingWindowsRoot, i as isNotFoundPathError, m as pathForWindowsFilesystem, n as hasNodeErrorCode, o as isPathRelativeEscape, s as isSymlinkOpenError, t as assertNoNulPathInput } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { B as composeMutationAssertions, D as retainSidecarCreated, E as createInputOptions, H as rethrowMutationAuthorityError, M as createSuppressedError, N as cleanupPinnedFilePath, O as rethrowCreateInputError, P as hasErrorCode, R as MutationAuthorityError, U as assertExclusiveCreateLeaf, V as isMutationAuthorityError, k as rootWriteInput, z as assertSynchronousCallbackResult } from "./openclaw-state-read-sidecar-lock-registration-C-Pbqw8O.mjs";
import { C as creationAdmissionFromParent, D as NativePolicyDirectoryMismatch, E as nodeDirectorySearchOnlyFlags, O as nativePolicyDirectoryObserver, S as assertPrivateFileCreationAvailable, T as resolveCreationPermissions, _ as createFileHandle, a as describePolicyStagedDirectory, b as assertPrivateCreationFile, g as createDirectoryWithAdmission, i as describeNativeStagedDirectory, l as refreshPolicyStagedDirectoryObservation, n as assertPolicyStagedDirectoryCurrent, o as describeStagedDirectory, r as assertStagedDirectoryCurrent, s as exactIdentityMatches, t as assertNativeStagedDirectoryCurrent, v as isHardlinkFallbackError, w as hasPreservedCreationArtifacts, x as assertPrivateDirectory, y as assertDarwinCreationAcl } from "./openclaw-state-read-staged-directory-DUrSLJJt.mjs";
import { A as createRootObservationGuard, C as mutationObservationsCurrent, D as assertRootIdentityCurrentSync, E as assertRootIdentityCurrent, F as rootRelativeReadPath, I as registerTempPathForExit, M as expandRelativePathWithHome, N as resolvePathInRoot, O as assertValidRootDestinationPath, P as resolveRootContext, S as mutationObservationUsesDirectory, T as observeMutationPath, _ as withAsyncDirectoryGuards, b as missingMutationSegments, c as registerFileLockSyncRootAdapter, d as sameAbsolutePath, f as assertMutationNotDenied, g as removePathIfIdentityUnchanged, j as ensureTrailingSep, k as assertValidRootRelativePath, l as createPathSegmentRoute, m as createMutationDenyMatcher, p as mergeDenyMutationPolicies, u as joinPathSegmentRoute, v as advanceMutationObservation, w as nextMissingMutationPath, x as mutationObservationCurrent, y as checkedMutationDirectory } from "./openclaw-state-read-file-lock-sync-root-MLFwCZr0.mjs";
import { t as assertAbsolutePathInput } from "./openclaw-state-read-absolute-path-CL3P5BzZ.mjs";
import { t as syncDirectoryBestEffort } from "./openclaw-state-read-directory-durability-DR8KRku8.mjs";
import { i as getFsSafeTestHooks, r as resolveNonblockingWriteFlag, t as isNonRegularWriteOpenError } from "./openclaw-state-read-write-open-flags-DTntuLtd.mjs";
import { i as removeNativeCreatedFileIfStillPinned, n as withSidecarLock, r as nativeOpenFlags } from "./openclaw-state-read-sidecar-lock-Clsgj0Iv.mjs";
import fs, { constants, readSync } from "node:fs";
import path from "node:path";
import { types } from "node:util";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import { isUtf8 } from "node:buffer";
import { scheduler, setImmediate } from "node:timers/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-policy.js
function resolveCopyCloneMode(mode, defaultMode) {
	const policy = mode === void 0 ? defaultMode : mode;
	if (policy !== "auto" && policy !== "always" && policy !== "never") throw new FsSafeError("invalid-path", "copy clone policy must be auto, always, or never");
	return policy;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/byte-view.js
const ByteView = Uint8Array;
const typedArray = Object.getPrototypeOf(ByteView.prototype);
const viewLength = Object.getOwnPropertyDescriptor(typedArray, "byteLength").get;
const viewOffset = Object.getOwnPropertyDescriptor(typedArray, "byteOffset").get;
const viewBuffer = Object.getOwnPropertyDescriptor(typedArray, "buffer").get;
/** Snapshot intrinsic view bounds without copying the borrowed payload. */
function snapshotByteView(bytes) {
	const length = Reflect.apply(viewLength, bytes, []);
	if (length === 0) return new ByteView(0);
	return new ByteView(Reflect.apply(viewBuffer, bytes, []), Reflect.apply(viewOffset, bytes, []), length);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/write-file-handle.js
const WRITE_CHUNK_BYTES = 524288;
async function writeAllToFile(target, data, options = {}) {
	const buffer = typeof data === "string" ? Buffer.from(data, options.encoding ?? "utf8") : data;
	let offset = 0;
	while (offset < buffer.byteLength) {
		const length = Math.min(WRITE_CHUNK_BYTES, buffer.byteLength - offset);
		const position = options.position === void 0 ? null : options.position + offset;
		options.assertBeforeMutation?.();
		const written = typeof target === "number" && options.synchronous ? fs.writeSync(target, buffer, offset, length, position) : typeof target === "number" ? await new Promise((resolve, reject) => {
			fs.write(target, buffer, offset, length, position, (error, bytesWritten) => {
				if (error) reject(error);
				else resolve(bytesWritten);
			});
		}) : (await target.write(buffer, offset, length, position)).bytesWritten;
		if (written <= 0) throw new FsSafeError("helper-failed", "file write made no progress");
		offset += written;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-handle-transfer.js
const NO_CALLBACK_ARGUMENTS = Object.freeze([]);
function createTransferBuffer(sizeHint, limit) {
	return Buffer.allocUnsafe(Math.min(524288, Math.max(65536, sizeHint), limit + 1));
}
function transferFileHandle(source, target, options) {
	try {
		const maxBytes = options.maxBytes;
		const sizeHint = options.sizeHint;
		const targetPosition = options.targetPosition;
		const signal = options.signal;
		const onChunk = options.onChunk;
		const assertBeforeMutation = options.assertBeforeMutation;
		return transferFileHandleCore(source, target, sizeHint, maxBytes, targetPosition, signal, onChunk, signal === void 0 && assertBeforeMutation === void 0 ? void 0 : () => {
			signal?.throwIfAborted();
			if (assertBeforeMutation) Reflect.apply(assertBeforeMutation, options, NO_CALLBACK_ARGUMENTS);
		}, options);
	} catch (error) {
		return Promise.reject(error);
	}
}
async function transferFileHandleCore(source, target, sizeHint, maxBytes, targetPosition, signal, onChunk, beforeWrite, callbackThis) {
	const limit = maxBytes ?? Infinity;
	const buffer = createTransferBuffer(sizeHint, limit);
	let position = 0;
	while (true) {
		signal?.throwIfAborted();
		const { bytesRead } = await source.read(buffer, 0, Math.min(buffer.length, limit - position + 1), position);
		signal?.throwIfAborted();
		if (bytesRead > limit - position) throw new FsSafeError("too-large", `file exceeds limit of ${limit} bytes`);
		if (bytesRead === 0) return position;
		const chunk = buffer.subarray(0, bytesRead);
		if (onChunk) {
			const returned = Function.prototype.call.call(onChunk, callbackThis, chunk);
			assertSynchronousCallbackResult(returned, "onChunk");
		}
		await writeAllToFile(target, chunk, {
			position: targetPosition === void 0 ? void 0 : targetPosition + position,
			assertBeforeMutation: beforeWrite
		});
		position += bytesRead;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/opened-file-failure.js
function recordFileOpenFailure(error, filePath) {
	recordFileObservationFailure(error, `open:${filePath}`);
	throw error;
}
function recordExclusiveCreateFailure(error, filePath) {
	recordFileObservationFailure(error, `exclusive-create:${filePath}`);
	throw error;
}
function openedPathResolutionError(error = new FsSafeError("path-mismatch", "unable to resolve opened file path")) {
	recordFileObservationFailure(error, "resolution");
	return error;
}
async function recordPreOpenFileChange(error, handle, filePath, before, opened) {
	if (!isFileObservationFailure(error, "identity") || !before?.isFile() || !opened?.isFile() || ![0n, 1n].includes(before.nlink) || ![0n, 1n].includes(opened.nlink)) return;
	try {
		await inspectFileIdentity(async () => before);
		const current = await inspectFileIdentity(() => fs.fstatSync(handle.fd, { bigint: true }), opened);
		if (current.isFile() && [0n, 1n].includes(current.nlink) && (before.dev !== current.dev || before.ino !== current.ino)) recordFileObservationFailure(error, `changed:${filePath}`);
	} catch {}
}
async function recordOpenedFileFailure(error, handle, filePath, identity) {
	if (!isFileObservationFailure(error, "resolution") && !isFileObservationFailure(error, "identity") || !identity.isFile() || identity.nlink > 1n) return;
	try {
		const current = await inspectFileIdentity(() => fs.fstatSync(handle.fd, { bigint: true }), identity);
		if (current.isFile() && current.nlink === 0n) recordFileObservationFailure(error, `unlinked:${filePath}`);
	} catch {}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-read-admission.js
function resolveFinalOpenedRealPath(filePath) {
	try {
		return realpathSync$1.native(filePath);
	} catch (error) {
		if (process.platform === "win32" && error instanceof Error && ["EPERM", "EBADF"].includes(error.code ?? "")) throw openedPathResolutionError(error);
		throw error;
	}
}
function inspectOpenedPathIdentitySync(filePath, symlinks) {
	const stat = symlinks === "follow-within-root" ? fs.statSync(filePath, { bigint: true }) : fs.lstatSync(filePath, { bigint: true });
	if (stat.isSymbolicLink() && symlinks !== "follow-within-root") throw new FsSafeError("symlink", "symlink not allowed");
	return stat;
}
async function admitRootReadHandle(params) {
	try {
		if (params.hardlinks !== "allow" && params.opened.stat.nlink > 1) throw hardlinkedPathNotAllowedError();
		if (params.beforeFinalFence) await params.beforeFinalFence(params.filePath, params.opened.handle);
		try {
			assertRootIdentityCurrentSync(params.root);
			let realPath;
			try {
				const current = inspectFileIdentitySync(() => inspectOpenedPathIdentitySync(params.filePath, params.symlinks), params.identity);
				if (params.hardlinks !== "allow" && current.nlink > 1n) throw hardlinkedPathNotAllowedError();
				const canonicalPath = resolveFinalOpenedRealPath(params.filePath);
				assertNoWindowsPathAlias(canonicalPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
				const admittedRealPath = admitPathInsideRoot({
					rootPath: params.root.rootReal,
					candidatePath: canonicalPath,
					rootIdentity: params.root.rootIdentity
				});
				if (!admittedRealPath) throw openedPathResolutionError(outsideWorkspaceError());
				const canonical = inspectFileIdentitySync(() => inspectOpenedPathIdentitySync(canonicalPath, void 0), params.identity);
				if (params.hardlinks !== "allow" && canonical.nlink > 1n) throw hardlinkedPathNotAllowedError();
				realPath = admittedRealPath.path;
			} catch (error) {
				throw isNotFoundPathError(error) ? openedPathResolutionError(fileNotFoundError()) : error;
			}
			params.afterPathIdentityCheck?.(params.filePath, params.opened.handle);
			assertRootIdentityCurrentSync(params.root);
			return {
				...params.opened,
				realPath
			};
		} catch (error) {
			if (params.identity.nlink <= 1n) await recordOpenedFileFailure(error, params.opened.handle, params.filePath, params.identity);
			throw error;
		}
	} catch (error) {
		await params.opened.handle.close().catch(() => {});
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-sync.js
async function syncFileBestEffort(handle) {
	try {
		await handle.sync();
	} catch (error) {
		if (error?.code !== "EPERM") throw error;
	}
}
function syncFileBestEffortSync(fd, fsModule = fs) {
	try {
		fsModule.fsyncSync(fd);
	} catch (error) {
		if (error?.code !== "EPERM") throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-file-input.js
function resolveFileCopyCloneMode(mode) {
	const clone = resolveCopyCloneMode(mode, "never");
	if (clone === "always" && !getNativeBinding()?.copyFileExclusive) throw new FsSafeError("helper-unavailable", "native file cloning is unavailable");
	return clone;
}
function assertCopySourceCurrent(source, identity) {
	inspectFileIdentitySync(() => fs.fstatSync(source.handle.fd, { bigint: true }), identity);
	inspectFileIdentitySync(() => {
		const current = fs.lstatSync(source.realPath, { bigint: true });
		if (current.isSymbolicLink() || !current.isFile()) throw new FsSafeError("path-mismatch", "copy source path changed");
		return current;
	}, identity);
}
async function writeCopyFileToFd(fd, input, maxBytes, assertBeforeMutation) {
	await transferFileHandle(input.handle, fd, {
		maxBytes,
		sizeHint: input.size,
		signal: input.signal,
		assertBeforeMutation
	});
}
async function createNativeCopyFile(native, input, parentFd, basename, maxBytes) {
	input.signal?.throwIfAborted();
	const copier = selectNativeBinding(native, "copyFileExclusive");
	if (!copier) {
		if (input.clone === "always") throw new FsSafeError("helper-unavailable", "native file cloning is unavailable");
		return;
	}
	captureNativeFdClose(native);
	const nativeSignal = input.signal ? AbortSignal.any([input.signal]) : void 0;
	try {
		return await copier.copyFileExclusive(input.handle.fd, parentFd, basename, input.clone, maxBytes !== void 0 && Number.isFinite(maxBytes) ? maxBytes : void 0, nativeSignal);
	} catch (error) {
		const code = error?.code;
		if (code === "Cancelled" || code === "ABORT_ERR") input.signal?.throwIfAborted();
		if (code === "too-large") throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes`, { cause: error });
		if (code === "ENOTSUP" && input.clone !== "always") return void 0;
		if (code === "ENOTSUP") throw new FsSafeError("unsupported-platform", "native file cloning is unsupported", { cause: error });
		throw new FsSafeError("helper-failed", "native file copy failed", { cause: error });
	} finally {
		if (nativeSignal) nativeSignal.onabort = null;
	}
}
function assertNativeCopyCompleted(input, copied) {
	if (copied?.errorCode) {
		if (copied.errorCode === "Cancelled" || copied.errorCode === "ABORT_ERR") input.signal?.throwIfAborted();
		const unsupported = [
			"ENOTSUP",
			"EOPNOTSUPP",
			"ENOSYS",
			"EXDEV",
			"EINVAL"
		].includes(copied.errorCode);
		throw new FsSafeError(copied.errorCode === "too-large" ? "too-large" : unsupported ? "unsupported-platform" : "helper-failed", copied.errorMessage ?? "native file copy failed", { cause: Object.assign(new Error(copied.errorMessage ?? "native file copy failed"), { code: copied.errorCode }) });
	}
	input.signal?.throwIfAborted();
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-write-input.js
/** Replay a consumed stream from an owned, readable stage descriptor. */
function replayPinnedInput(fd, input) {
	if (input.kind !== "stream") return input;
	return {
		kind: "stream",
		stageBeforePublish: true,
		stream: (async function* () {
			let position = 0;
			const buffer = Buffer.alloc(65536);
			for (;;) {
				const bytes = readSync(fd, buffer, 0, buffer.length, position);
				if (!bytes) return;
				position += bytes;
				yield buffer.subarray(0, bytes);
			}
		})()
	};
}
const isUint8Array = types.isUint8Array;
const SMALL_BUFFER_BYTES = 65536;
function streamChunkBytes(chunk) {
	if (Buffer.isBuffer(chunk)) return chunk;
	if (!isUint8Array(chunk)) return Buffer.from(chunk);
	return snapshotByteView(chunk);
}
async function writePinnedInput(target, input, maxBytes, assertBeforeMutation) {
	if (input.kind === "link") throw new FsSafeError("helper-failed", "link copying requires the link publication path");
	if (input.kind === "file") {
		await writeCopyFileToFd(typeof target === "number" ? target : target.fd, input, maxBytes, assertBeforeMutation);
		return;
	}
	if (typeof target === "number" && input.kind === "buffer" && input.stageBeforePublish !== false && !assertBeforeMutation) {
		const data = typeof input.data === "string" ? Buffer.from(input.data, input.encoding ?? "utf8") : input.data;
		if (data.byteLength <= SMALL_BUFFER_BYTES) {
			if (maxBytes !== void 0 && data.byteLength > maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${data.byteLength})`);
			return writeAllToFile(target, data, { synchronous: true });
		}
	}
	let bytes = 0;
	const write = async (data) => {
		bytes += data.byteLength;
		if (maxBytes !== void 0 && bytes > maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${bytes})`);
		await writeAllToFile(target, data, { assertBeforeMutation });
	};
	if (input.kind === "buffer") await write(typeof input.data === "string" ? Buffer.from(input.data, input.encoding ?? "utf8") : input.data);
	else for await (const chunk of input.stream) await write(streamChunkBytes(chunk));
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-staged-file-metadata.js
/** Exact nonprivate stage facts from one fresh named/retained observation. */
function nativeStagedFileMode(binding, parentFd, name, fd, expectedMode) {
	if (typeof binding.stagedFileMetadata !== "function") return void 0;
	const stat = binding.stagedFileMetadata(parentFd, name, fd);
	if (!stat || typeof stat.mode !== "bigint" || stat.mode < 0n || stat.mode > 4294967295n || typeof stat.nlink !== "bigint" || stat.nlink !== 1n || (stat.mode & 61440n) !== 32768n) throw new FsSafeError("path-mismatch", "staged entry no longer names the exclusive created file");
	const mode = Number(stat.mode & 4095n);
	if (expectedMode !== void 0 && mode !== expectedMode) throw new FsSafeError("insecure-permissions", "filesystem did not enforce the staged file mode");
	return mode;
}
const unsupported = /* @__PURE__ */ new WeakMap();
const capabilityErrors = /* @__PURE__ */ new WeakMap();
const MAX_DEVICES = 128;
function unavailable$3(operation, detail, cause) {
	const error = new FsSafeError("helper-unavailable", `native no-replace ${operation} is unsupported on this filesystem (${detail})`, {
		cause,
		details: { capability: "rename-noreplace" }
	});
	capabilityErrors.set(error, detail);
	return error;
}
function noReplaceUnavailable(error, operation, syscallOnly = false) {
	try {
		const code = error?.code;
		if (code !== "FS_SAFE_INTERNAL_RENAME_NOREPLACE_UNSUPPORTED" && !(syscallOnly && [
			"EINVAL",
			"ENOSYS",
			"ENOTSUP",
			"EOPNOTSUPP"
		].includes(code ?? ""))) return;
		const capability = process.platform === "darwin" ? "renameatx_np RENAME_EXCL" : process.platform === "win32" ? "native no-replace rename" : "renameat2 RENAME_NOREPLACE";
		return unavailable$3(operation, code === "FS_SAFE_INTERNAL_RENAME_NOREPLACE_UNSUPPORTED" ? error.message : `${capability}: ${code}`, error);
	} catch {
		return;
	}
}
function rememberNoReplaceUnavailable(binding, parentFd, error) {
	const detail = capabilityErrors.get(error);
	if (!detail) return;
	const device = fs.fstatSync(parentFd, { bigint: true }).dev;
	let devices = unsupported.get(binding);
	if (!devices) unsupported.set(binding, devices = /* @__PURE__ */ new Map());
	if (!devices.has(device) && devices.size >= MAX_DEVICES) devices.delete(devices.keys().next().value);
	devices.set(device, detail);
}
function cachedNoReplaceUnavailable(binding, parentFd, operation = "publication") {
	if (!unsupported.has(binding)) return;
	return cachedNoReplaceDevice(binding, fs.fstatSync(parentFd, { bigint: true }).dev, operation);
}
function cachedNoReplaceDevice(binding, device, operation) {
	const devices = unsupported.get(binding);
	if (!devices) return;
	const detail = devices.get(device);
	return detail ? unavailable$3(operation, detail) : void 0;
}
function classifyNativeRenameFailure(error) {
	try {
		const code = error?.code;
		if (code === "FS_SAFE_INTERNAL_RENAME_SOURCE_IDENTITY_MISMATCH" || code === "FS_SAFE_INTERNAL_RENAME_NOREPLACE_UNSUPPORTED") return "uncommitted";
	} catch {}
	return "indeterminate";
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/staged-file-settlement.js
function createStagedFileReceipt(directory, temporaryBasename, stat) {
	return Object.freeze({
		directory,
		temporaryBasename,
		identity: Object.freeze({
			dev: stat.dev,
			ino: stat.ino,
			mode: Number(stat.mode & 4095n),
			nlink: stat.nlink,
			size: stat.size,
			uid: Number(stat.uid),
			gid: Number(stat.gid),
			mtimeNs: stat.mtimeNs,
			ctimeNs: stat.ctimeNs
		})
	});
}
function stagedFailure(kind, error, details) {
	error = noReplaceUnavailable(error, `${kind} publication`) ?? error;
	let code = "helper-failed";
	try {
		code = error instanceof FsSafeError ? error.code : error?.code === "EEXIST" ? "already-exists" : "helper-failed";
	} catch {}
	return new FsSafeError(code, code === "helper-unavailable" && error instanceof FsSafeError ? error.message : `staged ${kind} ${details.phase} failed`, {
		cause: error,
		details
	});
}
/** Finish owned cleanup and every close before surfacing publication evidence. */
async function settleStagedFile(params) {
	const errors = params.failure ? [params.failure.error] : [];
	let status;
	try {
		status = await params.cleanup();
	} catch (error) {
		status = "failed";
		errors.push(error);
	}
	let resources = "closed";
	for (const close of params.close) try {
		await close();
	} catch (error) {
		resources = "close-failed";
		errors.push(error);
	}
	if (!(status === "failed" || status === "preserved" || resources === "close-failed") && (!params.failure || params.publication.status === "not-published")) return;
	const error = errors.length > 1 ? new AggregateError(errors, "staged operation and settlement failed") : errors.length === 1 ? errors[0] : new FsSafeError("not-removable", "staged cleanup preserved an unverified entry");
	const cleanup = Object.freeze({
		temporaryBasename: params.temporaryBasename,
		publication: params.publication,
		status,
		resources
	});
	throw stagedFailure("file", error, {
		phase: params.failure ? params.phase : "cleanup",
		publication: params.publication,
		cleanup
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-metadata.js
function timestampSeconds(nanoseconds) {
	return String(Number(nanoseconds / 1000000000n) + Number(nanoseconds % 1000000000n) / 1e9);
}
function captureCopyMetadata(fd, stat) {
	let restoreNative;
	const native = getNativeBinding();
	if (process.platform === "win32") {
		if (native?.readCopyMetadata && native.restoreCopyMetadata) {
			const snapshot = native.readCopyMetadata(fd);
			const restore = native.restoreCopyMetadata.bind(native);
			restoreNative = (target) => restore(target, snapshot);
		} else if (isFsSafeNativeRequired()) throw new FsSafeError("helper-unavailable", "native Windows copy metadata preservation is unavailable");
	} else if (native?.restoreCopyFileTimes) {
		const restore = native.restoreCopyFileTimes.bind(native);
		const { atimeNs, mtimeNs } = stat;
		restoreNative = (target) => restore(target, atimeNs, mtimeNs);
	} else if (isFsSafeNativeRequired()) throw new FsSafeError("helper-unavailable", "native copy timestamp preservation is unavailable");
	return Object.freeze({
		atimeNs: stat.atimeNs,
		mtimeNs: stat.mtimeNs,
		restoreNative
	});
}
function restoreCopyMetadata(fd, metadata) {
	if (!metadata) return;
	if (metadata.restoreNative) metadata.restoreNative(fd);
	else fs.futimesSync(fd, timestampSeconds(metadata.atimeNs), timestampSeconds(metadata.mtimeNs));
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-staged-file.js
var __addDisposableResource$5 = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources$5 = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function assertNativeStaging(binding) {
	if ([
		binding.closeOwnedFd,
		binding.createStagedFile,
		binding.stagedFileMatches,
		binding.removeStagedFile,
		binding.renameReplace,
		binding.renameNoReplace
	].some((fn) => typeof fn !== "function")) throw new FsSafeError("helper-unavailable", "native retained-directory staging is unavailable");
}
function assertBasename(name, portable) {
	if (!name || name === "." || name === ".." || name.includes("/") || name.includes("\0") || portable && /[\\:\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(name)) throw new FsSafeError("invalid-path", "publication requires one direct-child basename");
}
const NOT_PUBLISHED = Object.freeze({ status: "not-published" });
var NativeStagedFile = class NativeStagedFile {
	#owner;
	#closeFd;
	#assertBeforeMutation;
	#private;
	#verifyMode;
	#state = {
		status: "open",
		publication: NOT_PUBLISHED
	};
	#receipt;
	#rejectFinalSymlink = false;
	#unsupportedNoReplace;
	#fallbackCleanup;
	#fallbackCleanupError;
	constructor(owner) {
		const name = owner.name ?? `.fs-safe-${randomUUID()}.tmp`;
		assertBasename(name, owner.portableNames !== false);
		this.#closeFd = captureNativeFdClose(owner.binding);
		this.#owner = {
			...owner,
			name
		};
		this.#assertBeforeMutation = owner.assertBeforeMutation;
		this.#private = owner.permissionPolicy === "private-creation";
		this.#verifyMode = owner.permissionPolicy !== void 0;
	}
	static async create(owner, input, maxBytes) {
		let staged;
		try {
			staged = new NativeStagedFile(owner);
		} catch (error) {
			try {
				owner.closeParentFd(owner.parentFd);
			} catch (closeError) {
				throw new AggregateError([error, closeError], "staged owner construction and close failed");
			}
			throw error;
		}
		await staged.#prepare(input, maxBytes);
		return staged;
	}
	static async write(binding, parentFd, closeParentFd, directory, params, parentGuard, fallback) {
		const env_1 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			const exclusive = params.overwrite === false && params.input.kind === "buffer" && params.input.stageBeforePublish === false;
			const staged = __addDisposableResource$5(env_1, await NativeStagedFile.create({
				binding,
				parentFd,
				closeParentFd,
				directory,
				mode: params.mode,
				sync: params.sync,
				portableNames: false,
				assertBeforeMutation: params.assertBeforeMutation,
				name: exclusive ? params.basename : void 0,
				strictFileSync: params.strictFileSync,
				permissionPolicy: params.private ? "private-creation" : params.verifyPosixMode === true ? "mode-only" : void 0
			}, params.input, params.maxBytes), true);
			staged.#rejectFinalSymlink = params.rejectFinalSymlink === true;
			if (params.input.kind === "file") await params.input.verifySource();
			if (exclusive) {
				staged.#assertCurrent();
				params.assertBeforeMutation?.();
				if (staged.#verifyMode) staged.#assertCurrent();
			}
			let published;
			try {
				published = exclusive ? staged.#completePublication(params.basename, false, params.onPublished) : await staged.publish(params.basename, { overwrite: params.overwrite !== false }, params.onPublished);
			} catch (error) {
				if (!staged.#unsupportedNoReplace || isFsSafeNativeRequired() || params.input.kind === "file" && params.input.clone === "always") throw error;
				staged.#fallbackCleanup = "failed";
				let removed;
				try {
					removed = binding.removeStagedFile(parentFd, staged.#owner.name, staged.#file());
					staged.#fallbackCleanup = removed;
				} catch (cleanupError) {
					staged.#fallbackCleanupError = { error: cleanupError };
					throw error;
				}
				if (removed !== "removed" && removed !== "name-absent") throw error;
				rememberNoReplaceUnavailable(binding, parentFd, staged.#unsupportedNoReplace);
				return await fallback(replayPinnedInput(staged.#file(), params.input));
			}
			const identity = published.staged.identity;
			try {
				if (exclusive) await params.verifyPublished?.(staged.#file(), identity, parentGuard, {
					fd: parentFd,
					binding
				});
				else await params.verifyPublished?.(staged.#file(), identity, parentGuard);
			} catch (error) {
				if (params.overwrite === false && params.input.kind !== "file" && params.input.stageBeforePublish === true) throw stagedFailure("file", error, {
					phase: "publish",
					publication: published
				});
				throw error;
			}
			return {
				dev: identity.dev,
				ino: identity.ino
			};
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			const result_1 = __disposeResources$5(env_1);
			if (result_1) await result_1;
		}
	}
	get receipt() {
		if (!this.#receipt) throw new FsSafeError("helper-failed", "staged file preparation is incomplete");
		return this.#receipt;
	}
	#open() {
		if (this.#state.status !== "open") throw new FsSafeError("helper-failed", "staged file is closed");
		return this.#state;
	}
	#file() {
		const state = this.#open();
		if (state.fileFd === void 0) throw new FsSafeError("helper-failed", "staged file has not been created");
		return state.fileFd;
	}
	#assertNamed(name, expectedMode) {
		const fd = this.#file();
		const mode = !this.#private ? nativeStagedFileMode(this.#owner.binding, this.#owner.parentFd, name, fd, this.#verifyMode ? expectedMode : void 0) : void 0;
		if (mode !== void 0) return mode;
		const stat = this.#owner.binding.stagedFileMatches(this.#owner.parentFd, name, fd) ? fs.fstatSync(fd, { bigint: true }) : void 0;
		if (!stat || stat.nlink !== 1n) throw new FsSafeError("path-mismatch", "staged entry no longer names the exclusive created file");
		this.#assertPermissions(fd, stat, expectedMode);
		return Number(stat.mode & 4095n);
	}
	#assertCurrent() {
		if (this.#open().publication.status !== "not-published") throw new FsSafeError("helper-failed", "staged file publication has already been attempted");
		this.#assertDirectory();
		this.#assertNamed(this.#owner.name, 384);
	}
	#assertDirectory() {
		assertNativeStagedDirectoryCurrent(this.#owner.binding, this.#owner.parentFd, this.#owner.directory);
	}
	#assertPermissions(fd, stat, expectedMode) {
		if (this.#private) assertPrivateCreationFile(stat, fd);
		if (this.#verifyMode && Number(stat.mode & 4095n) !== expectedMode) throw new FsSafeError("insecure-permissions", "filesystem did not enforce the staged file mode");
	}
	#assertStagePermissions(fd) {
		this.#assertPermissions(fd, fs.fstatSync(fd, { bigint: true }), 384);
	}
	async #prepare(input, maxBytes) {
		try {
			const mode = this.#owner.mode;
			if (!Number.isInteger(mode) || mode < 0 || mode > 4095) throw new FsSafeError("invalid-path", "invalid staged file mode");
			const fileSignal = input.kind === "file" && this.#verifyMode ? input.signal : void 0;
			if (input.kind === "file" && this.#verifyMode) {
				fileSignal?.throwIfAborted();
				if (input.clone === "always") throw new FsSafeError("helper-unavailable", "required cloning cannot verify staged permissions before copying");
			}
			this.#assertDirectory();
			const state = this.#open();
			if (this.#private) assertDarwinCreationAcl(this.#owner.parentFd, "file");
			this.#assertBeforeMutation?.();
			if (this.#private) assertDarwinCreationAcl(this.#owner.parentFd, "file");
			const copied = input.kind === "file" && !this.#verifyMode ? await createNativeCopyFile(this.#owner.binding, input, this.#owner.parentFd, this.#owner.name, maxBytes) : void 0;
			state.fileFd = copied?.fd;
			if (state.fileFd === void 0) {
				this.#assertBeforeMutation?.();
				if (this.#private) assertDarwinCreationAcl(this.#owner.parentFd, "file");
				state.fileFd = this.#owner.binding.createStagedFile(this.#owner.parentFd, this.#owner.name);
			}
			const fd = state.fileFd;
			if (input.kind === "file") assertNativeCopyCompleted(input, copied);
			const assertBeforeChmod = this.#assertBeforeMutation;
			const beforeChmodResult = assertBeforeChmod?.();
			if (this.#private) {
				assertSynchronousCallbackResult(beforeChmodResult, "assertBeforeMutation");
				assertPrivateCreationFile(fs.fstatSync(fd, { bigint: true }), fd);
			}
			fs.fchmodSync(fd, 384);
			if (this.#verifyMode) this.#assertStagePermissions(fd);
			const assertBeforeMutation = this.#verifyMode ? () => {
				assertSynchronousCallbackResult(this.#assertBeforeMutation?.(), "assertBeforeMutation");
				fileSignal?.throwIfAborted();
				this.#assertStagePermissions(fd);
			} : this.#assertBeforeMutation;
			if (!copied) await writePinnedInput(fd, input, maxBytes, assertBeforeMutation);
			if (input.kind === "file") restoreCopyMetadata(fd, input.metadata);
			if (this.#verifyMode) this.#assertStagePermissions(fd);
			if (this.#owner.sync !== false) {
				if (this.#owner.strictFileSync) fs.fsyncSync(fd);
				else syncFileBestEffortSync(fd);
			}
			const stat = fs.fstatSync(fd, { bigint: true });
			this.#receipt = createStagedFileReceipt(this.#owner.directory, this.#owner.name, stat);
			this.#assertCurrent();
		} catch (error) {
			const { receipt: cleanup, error: cleanupError } = this.#finalize();
			if (cleanupError) throw stagedFailure("file", new AggregateError([error, cleanupError], "preparation and cleanup failed"), {
				phase: "prepare",
				publication: cleanup.publication,
				cleanup
			});
			if (cleanup.status === "preserved") throw stagedFailure("file", error, {
				phase: "prepare",
				publication: cleanup.publication,
				cleanup
			});
			throw error;
		}
	}
	async assertCurrent() {
		this.#assertCurrent();
	}
	async publish(basename, options, onPublished) {
		const overwrite = options?.overwrite;
		try {
			const state = this.#open();
			assertBasename(basename, this.#owner.portableNames !== false);
			if (basename === this.#owner.name || typeof overwrite !== "boolean") throw new FsSafeError("invalid-path", "publication needs a distinct basename and explicit overwrite policy");
			this.#assertCurrent();
			assertFinalSymlinkRejected(path.join(this.#owner.directory.realPath, basename), this.#rejectFinalSymlink);
			this.#assertBeforeMutation?.();
			if (this.#assertBeforeMutation) {
				this.#assertCurrent();
				assertFinalSymlinkRejected(path.join(this.#owner.directory.realPath, basename), this.#rejectFinalSymlink);
			}
			try {
				if (overwrite) this.#owner.binding.renameReplace(this.#owner.parentFd, this.#owner.name, this.#owner.parentFd, basename);
				else this.#owner.binding.renameNoReplace(this.#owner.parentFd, this.#owner.name, this.#owner.parentFd, basename);
			} catch (error) {
				state.publication = Object.freeze({
					status: "indeterminate",
					basename,
					overwrite
				});
				const unavailable = !overwrite ? noReplaceUnavailable(error, "publication", true) : void 0;
				if (unavailable && this.#state === state && state.status === "open") {
					state.publication = NOT_PUBLISHED;
					this.#unsupportedNoReplace = unavailable;
					throw unavailable;
				}
				if (classifyNativeRenameFailure(error) === "uncommitted") state.publication = NOT_PUBLISHED;
				throw error;
			}
			return this.#completePublication(basename, overwrite, onPublished);
		} catch (error) {
			if (isMutationAuthorityError(error)) throw error;
			throw stagedFailure("file", error, {
				phase: "publish",
				publication: this.#state.status === "closed" ? this.#state.receipt.publication : this.#state.publication
			});
		}
	}
	#completePublication(basename, overwrite, onPublished) {
		const receipt = Object.freeze({
			status: "published",
			staged: this.receipt,
			basename,
			overwrite
		});
		this.#open().publication = receipt;
		onPublished?.(receipt.staged.identity);
		const stagedMode = this.#assertNamed(basename, 384);
		this.#assertDirectory();
		const fd = this.#file();
		if (this.#owner.mode !== 384 || stagedMode !== 384) fs.fchmodSync(fd, this.#owner.mode);
		if (this.#owner.sync !== false && ((this.#owner.mode & 384) !== 384 || (stagedMode & ~this.#owner.mode) !== 0)) {
			if (this.#owner.strictFileSync) fs.fsyncSync(fd);
			else syncFileBestEffortSync(fd);
		}
		if (this.#owner.sync !== false) syncFileBestEffortSync(this.#owner.parentFd);
		this.#assertNamed(basename, this.#owner.mode);
		this.#assertDirectory();
		return receipt;
	}
	#finalize() {
		if (this.#state.status === "closed") return this.#state;
		const state = this.#open();
		state.status = "closing";
		let outcome = "not-needed";
		const errors = [];
		if (state.publication.status === "indeterminate") outcome = "preserved";
		else if (this.#fallbackCleanup) {
			outcome = this.#fallbackCleanup;
			if (this.#fallbackCleanupError) errors.push(this.#fallbackCleanupError.error);
		} else if (state.publication.status === "not-published" && state.fileFd !== void 0) try {
			outcome = this.#owner.binding.removeStagedFile(this.#owner.parentFd, this.#owner.name, state.fileFd);
		} catch (error) {
			outcome = "failed";
			errors.push(error);
		}
		let resources = "closed";
		for (const [fd, closeFd] of [[state.fileFd, this.#closeFd], [this.#owner.parentFd, this.#owner.closeParentFd]]) {
			if (fd === void 0) continue;
			try {
				closeFd(fd);
			} catch (error) {
				resources = "close-failed";
				errors.push(error);
			}
		}
		const receipt = Object.freeze({
			temporaryBasename: this.#owner.name,
			publication: state.publication,
			status: outcome,
			resources
		});
		const error = errors.length ? stagedFailure("file", errors.length === 1 ? errors[0] : new AggregateError(errors, "staged cleanup failed"), {
			phase: "cleanup",
			publication: state.publication,
			cleanup: receipt
		}) : void 0;
		this.#state = {
			status: "closed",
			receipt,
			error
		};
		return this.#state;
	}
	async cleanup() {
		const closed = this.#finalize();
		if (closed.error) throw closed.error;
		return closed.receipt;
	}
	async [Symbol.asyncDispose]() {
		const cleanup = await this.cleanup();
		if (cleanup.status === "preserved") throw new FsSafeError("not-removable", "staged cleanup preserved an unverified entry", { details: {
			phase: "cleanup",
			publication: cleanup.publication,
			cleanup
		} });
	}
};
NativeStagedFile.create;
const writeNativeStage = NativeStagedFile.write;
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-handle-context.js
const contexts = /* @__PURE__ */ new WeakMap();
/** Internal registration; never reconstruct authority from public pathname fields. */
function registerRootHandleContext(handle, context) {
	contexts.set(handle, context);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-link.js
/** Shared by tree byte copying and per-file copying; never resolves the target. */
async function readCopyLinkTarget(source) {
	return await fs$1.readlink(source, { encoding: "buffer" });
}
function assertCopyLinkAvailable() {
	const native = getNativeBinding();
	if (process.platform === "darwin" && !native?.createCopySymlink) throw new FsSafeError("helper-unavailable", "exclusive macOS link copying requires the native helper; link(2) follows its source");
	if (process.platform === "win32" && (!native?.copyLinkExclusive || !native.publishCopyLink || !native.removeCopyLink)) throw new FsSafeError("helper-unavailable", "copying Windows links without following them requires the native helper");
	if (native && process.platform !== "win32" && !native.createCopySymlink) throw new FsSafeError("helper-unavailable", "native link copying is unavailable");
}
async function admitCopyLink(sourcePath, preserveMetadata, signal) {
	const parent = await createAsyncDirectoryGuard(path.dirname(sourcePath), { bigint: true });
	sourcePath = path.join(parent.realPath, path.basename(sourcePath));
	const identity = fs.lstatSync(sourcePath, { bigint: true });
	if (!identity.isSymbolicLink()) return void 0;
	const target = process.platform === "win32" ? void 0 : await readCopyLinkTarget(sourcePath);
	const verifySource = async () => {
		signal?.throwIfAborted();
		await assertAsyncDirectoryGuard(parent);
		const current = inspectFileIdentitySync(() => fs.lstatSync(sourcePath, { bigint: true }), identity);
		if (!current.isSymbolicLink() || current.mtimeNs !== identity.mtimeNs || current.ctimeNs !== identity.ctimeNs) throw new FsSafeError("path-mismatch", "copy source link changed");
	};
	await verifySource();
	return {
		kind: "link",
		stageBeforePublish: true,
		sourcePath,
		identity,
		target,
		preserveMetadata,
		signal,
		verifySource
	};
}
/** The caller has admitted the destination parent under Root's mutation policy. */
async function copyLinkAtParent(params, input, parent, native) {
	const temporaryName = `.fs-safe-${randomUUID()}.tmp`;
	const temporaryPath = path.join(parent.realPath, temporaryName);
	const destination = path.join(parent.realPath, params.basename);
	let identity;
	let sourceParent;
	let failure;
	const assertStage = () => {
		assertSyncDirectoryGuard(parent);
		const stat = inspectFileIdentitySync(() => fs.lstatSync(temporaryPath, { bigint: true }), identity);
		if (!stat.isSymbolicLink() || stat.nlink !== 1n) throw new FsSafeError("path-mismatch", "copy link stage changed");
	};
	try {
		await input.verifySource();
		await assertAsyncDirectoryGuard(parent);
		if (process.platform === "win32") {
			if (!native?.binding.copyLinkExclusive) throw new FsSafeError("helper-unavailable", "native Windows link copying is unavailable");
			const sourceGuard = await createAsyncDirectoryGuard(path.dirname(input.sourcePath), { bigint: true });
			sourceParent = await fs$1.open(sourceGuard.realPath, fs.constants.O_RDONLY);
			inspectFileIdentitySync(() => fs.fstatSync(sourceParent.fd, { bigint: true }), sourceGuard.stat);
			await input.verifySource();
			params.assertBeforeMutation?.();
			assertSyncDirectoryGuard(parent);
			identity = native.binding.copyLinkExclusive(sourceParent.fd, path.basename(input.sourcePath), native.fd, temporaryName, input.identity.dev, input.identity.ino, input.preserveMetadata, params.mode);
		} else {
			if (native && !native.binding.createCopySymlink) throw new FsSafeError("helper-unavailable", "native link copying is unavailable");
			params.assertBeforeMutation?.();
			assertSyncDirectoryGuard(parent);
			if (native?.binding.createCopySymlink) {
				const created = native.binding.createCopySymlink(native.fd, temporaryName, input.target, params.mode, input.preserveMetadata ? input.identity.atimeNs : void 0, input.preserveMetadata ? input.identity.mtimeNs : void 0);
				identity = {
					dev: statIdentityFromNative(created.dev),
					ino: statIdentityFromNative(created.ino)
				};
				if (created.errorCode) throw Object.assign(new Error(created.errorMessage), { code: created.errorCode });
			} else {
				fs.symlinkSync(input.target, temporaryPath);
				identity = fs.lstatSync(temporaryPath, { bigint: true });
			}
			if (!native && input.preserveMetadata) {
				assertStage();
				fs.lutimesSync(temporaryPath, timestampSeconds(input.identity.atimeNs), timestampSeconds(input.identity.mtimeNs));
			}
		}
		assertStage();
		await input.verifySource();
		params.assertBeforeMutation?.();
		input.signal?.throwIfAborted();
		assertStage();
		if (process.platform === "win32") native.binding.publishCopyLink(native.fd, temporaryName, params.basename, identity.dev, identity.ino);
		else if (native) {
			const renameNoReplace = native.binding.renameNoReplace;
			if (!renameNoReplace) throw new FsSafeError("helper-unavailable", "native link publication is unavailable");
			try {
				renameNoReplace(native.fd, temporaryName, native.fd, params.basename);
			} catch (error) {
				if (!noReplaceUnavailable(error, "link copy publication", true) || isFsSafeNativeRequired() || process.platform !== "linux") throw error;
				assertStage();
				fs.linkSync(temporaryPath, destination);
			}
		} else fs.linkSync(temporaryPath, destination);
		params.onPublished?.(identity);
		assertSyncDirectoryGuard(parent);
		if (!inspectFileIdentitySync(() => fs.lstatSync(destination, { bigint: true }), identity).isSymbolicLink()) throw new FsSafeError("path-mismatch", "published copy link changed");
		if (params.sync !== false) await syncDirectoryBestEffort(parent.realPath);
		await input.verifySource();
		return identity;
	} catch (error) {
		failure = { error };
		throw error;
	} finally {
		let cleanupFailure;
		try {
			if (identity) {
				assertSyncDirectoryGuard(parent);
				const remaining = fs.lstatSync(temporaryPath, {
					bigint: true,
					throwIfNoEntry: false
				});
				if (remaining) {
					inspectFileIdentitySync(() => remaining, identity);
					if (!remaining.isSymbolicLink()) throw new FsSafeError("path-mismatch", "copy link cleanup identity changed");
					if (process.platform === "win32") native.binding.removeCopyLink(native.fd, temporaryName, identity.dev, identity.ino);
					else fs.unlinkSync(temporaryPath);
				}
			}
		} catch (error) {
			cleanupFailure = { error };
		}
		try {
			await sourceParent?.close();
		} catch (error) {
			cleanupFailure = { error: cleanupFailure ? createSuppressedError(error, cleanupFailure.error, "copy link cleanup and close failed") : error };
		}
		if (cleanupFailure) throw failure ? createSuppressedError(cleanupFailure.error, failure.error, "copy link operation and cleanup failed") : cleanupFailure.error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/write-queue.js
const writeQueues = /* @__PURE__ */ new Map();
async function serializePathWrite(key, run) {
	const task = (writeQueues.get(key) ?? Promise.resolve()).then(() => run());
	const done = task.then(() => void 0, () => void 0);
	writeQueues.set(key, done);
	try {
		return await task;
	} finally {
		if (writeQueues.get(key) === done) writeQueues.delete(key);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-parent-admission.js
function sameNativeIdentity(left, right) {
	return hasSafeFileIdentity(left) && hasSafeFileIdentity(right) && BigInt(left.dev) === BigInt(right.dev) && BigInt(left.ino) === BigInt(right.ino);
}
function unavailable$2(message) {
	return new FsSafeError("helper-unavailable", message);
}
function assertParentAdmissionAvailable(binding) {
	if (typeof binding.openBeneath !== "function") throw unavailable$2("native parent directory admission is unavailable");
	captureNativeFdClose(binding);
	assertNativeCapabilities(binding, "openBeneath");
}
/** Short native mutations need a retained descriptor, not a Node FileHandle. */
function openExactNativeRootSync(binding, params) {
	assertParentAdmissionAvailable(binding);
	assertNoWindowsPathAlias(params.rootPath, "filesystem", "native root uses a Windows filesystem namespace alias");
	const flags = (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0);
	const fd = fs.openSync(pathForWindowsFilesystem(params.rootPath), flags);
	let held = true;
	const close = () => {
		if (!held) return;
		held = false;
		fs.closeSync(fd);
	};
	try {
		const stat = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), params.rootIdentity);
		if (!stat.isDirectory()) throw new FsSafeError("path-mismatch", "native root is not a directory");
		return {
			fd,
			stat,
			close,
			[Symbol.dispose]: close
		};
	} catch (error) {
		try {
			close();
		} catch (closeError) {
			throw createSuppressedError(closeError, error, "native root admission and close failed");
		}
		throw error;
	}
}
function openExactNativeRootAdmissionSync(binding, params) {
	return {
		directoryFlags: (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0),
		exactRoot: true,
		reportCloseErrors: params.reportCloseErrors,
		operation: params.operation,
		root: openExactNativeRootSync(binding, params),
		rootPath: params.rootPath
	};
}
function borrowNativeRootParent(admission) {
	const guard = {
		dir: admission.rootPath,
		realPath: admission.rootPath,
		stat: admission.root.stat
	};
	assertSyncDirectoryGuard(guard);
	return {
		fd: admission.root.fd,
		guard,
		close() {}
	};
}
async function openNativeRootAdmission(binding, params) {
	assertParentAdmissionAvailable(binding);
	const directoryFlags = (params.searchOnly ? nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY : fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0);
	assertNoWindowsPathAlias(params.rootPath, "filesystem", "native root uses a Windows filesystem namespace alias");
	let fd = fs.openSync(pathForWindowsFilesystem(params.rootPath), directoryFlags);
	const close = async () => {
		if (fd < 0) return;
		const owned = fd;
		fd = -1;
		fs.closeSync(owned);
	};
	const root = {
		get fd() {
			return fd;
		},
		close,
		[Symbol.asyncDispose]: close
	};
	try {
		const exactRoot = typeof params.rootIdentity?.dev === "bigint" && typeof params.rootIdentity.ino === "bigint";
		let rootMatches;
		if (exactRoot) {
			inspectFileIdentitySync(() => fs.fstatSync(root.fd, { bigint: true }), params.rootIdentity);
			rootMatches = true;
		} else if (process.platform === "win32") {
			const identity = fs.fstatSync(root.fd, { bigint: true });
			rootMatches = !params.rootIdentity || sameNativeIdentity(params.rootIdentity, identity);
		} else {
			const identity = fs.fstatSync(root.fd, { bigint: true });
			rootMatches = !params.rootIdentity || exactIdentityMatches(params.rootIdentity, identity);
		}
		if (!rootMatches) throw new FsSafeError("path-mismatch", `root path changed during ${params.operation ?? "native admission"}`);
		return {
			directoryFlags,
			exactRoot,
			reportCloseErrors: params.reportCloseErrors,
			operation: params.operation ?? "native admission",
			root,
			rootPath: params.rootPath
		};
	} catch (error) {
		try {
			await root.close();
		} catch (closeError) {
			if (process.platform !== "win32" || params.reportCloseErrors) throw createSuppressedError(closeError, error, "native root admission and close failed");
		}
		throw error;
	}
}
async function openNativeParentAdmission(binding, rootAdmission, relativeParentPath, observation) {
	assertParentAdmissionAvailable(binding);
	const closeFd = captureNativeFdClose(binding);
	const directoryFlags = rootAdmission.directoryFlags ?? fs.constants.O_RDONLY | (fs.constants.O_DIRECTORY ?? 0);
	assertNoWindowsPathAlias(relativeParentPath, "relative", "native parent uses a Windows filesystem namespace alias");
	const opened = binding.openBeneath(rootAdmission.root.fd, relativeParentPath, directoryFlags);
	if (!opened || !Number.isInteger(opened.fd) || opened.fd < 0) throw unavailable$2("native parent directory admission did not provide a descriptor");
	const parentFd = opened.fd;
	try {
		const parentInput = relativeParentPath ? path.join(rootAdmission.rootPath, ...relativeParentPath.split("/")) : rootAdmission.rootPath;
		if ((observation === "native-directory" || observation === "native-publication") && process.platform === "win32" && rootAdmission.exactRoot && typeof binding.observeDirectory === "function") {
			const stat = inspectFileIdentitySync(() => fs.fstatSync(parentFd, { bigint: true }));
			let observed;
			try {
				observed = inspectNativeDirectoryObservation(binding, parentInput, stat);
			} catch (error) {
				if (error?.code !== "OBSERVATION_UNAVAILABLE") throw error;
			}
			if (observed) {
				assertNoWindowsPathAlias(observed.realPath, "filesystem", "native parent uses a Windows filesystem namespace alias");
				inspectDirectoryIdentitySync(observed.realPath, stat, stat);
				return {
					fd: parentFd,
					close: () => closeFd(parentFd),
					guard: {
						dir: observed.realPath,
						realPath: observed.realPath,
						stat
					}
				};
			}
		}
		const parentPath = realpathSync$1.native(pathForWindowsFilesystem(parentInput));
		assertNoWindowsPathAlias(parentPath, "filesystem", "native parent uses a Windows filesystem namespace alias");
		if (observation === "native-publication" && process.platform !== "win32" && rootAdmission.exactRoot) {
			const captured = describeNativeStagedDirectory(binding, parentFd, parentPath);
			return {
				fd: parentFd,
				close: () => closeFd(parentFd),
				guard: {
					dir: parentPath,
					realPath: parentPath,
					stat: captured.stat
				},
				stagedDirectory: captured.directory
			};
		}
		if (observation === "native-directory" && process.platform !== "win32" && rootAdmission.exactRoot) {
			const captured = describePolicyStagedDirectory(parentFd, parentPath, binding);
			captured.disposeObservation?.();
			return {
				fd: parentFd,
				close: () => closeFd(parentFd),
				guard: {
					dir: parentPath,
					realPath: parentPath,
					stat: captured.stat
				},
				stagedDirectory: captured.directory
			};
		}
		const stagedDirectory = process.platform === "win32" ? void 0 : describeStagedDirectory(parentFd, parentPath);
		const parentPathStat = rootAdmission.exactRoot ? await inspectDirectoryIdentity(parentPath, inspectFileIdentitySync(() => fs.fstatSync(parentFd, { bigint: true }))) : fs.lstatSync(pathForWindowsFilesystem(parentPath), { bigint: true });
		if (process.platform === "win32" && !rootAdmission.exactRoot) {
			const parentIdentity = fs.fstatSync(parentFd, { bigint: true });
			if (parentPathStat.isSymbolicLink() || !sameNativeIdentity(parentPathStat, parentIdentity)) throw new FsSafeError("path-mismatch", `${rootAdmission.operation} parent changed during resolution`);
		} else if (process.platform !== "win32" && (parentPathStat.isSymbolicLink() || !exactIdentityMatches(parentPathStat, stagedDirectory.identity))) throw new FsSafeError("path-mismatch", `${rootAdmission.operation} parent changed during resolution`);
		return {
			fd: parentFd,
			close: () => closeFd(parentFd),
			guard: {
				dir: parentPath,
				realPath: parentPath,
				stat: parentPathStat
			},
			stagedDirectory
		};
	} catch (error) {
		try {
			closeFd(parentFd);
		} catch (closeError) {
			if (process.platform !== "win32" || rootAdmission.reportCloseErrors) throw createSuppressedError(closeError, error, "native parent admission and close failed");
		}
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-policy-parent-windows.js
function assertWindowsPolicyParentCurrent(parent) {
	inspectFileIdentitySync(() => fs.fstatSync(parent.fd, { bigint: true }), parent.guard.stat);
	assertDirectoryIdentitySync(parent.guard.dir, {
		dev: parent.guard.stat.dev,
		ino: parent.guard.stat.ino,
		realPath: parent.guard.realPath
	});
}
function closeWindowsPolicyParentAfterFailure(closeFd, fd, failure, report = false) {
	try {
		closeFd(fd);
	} catch (error) {
		if (report) throw failure ? createSuppressedError(error, failure.error, "native parent admission and close failed") : error;
	}
}
function windowsParentObservation(binding, fd, guard) {
	return checkedMutationDirectory(guard.dir, guard.realPath, guard.stat, typeof binding.observeDirectory === "function" ? () => {
		const stat = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), guard.stat);
		let observed;
		try {
			observed = inspectNativeDirectoryObservation(binding, guard.dir, stat);
		} catch (error) {
			if (error?.code === "OBSERVATION_UNAVAILABLE") return void 0;
			throw error;
		}
		return {
			canonicalPath: observed.realPath,
			identity: {
				dev: stat.dev,
				ino: stat.ino,
				mode: stat.mode,
				nlink: stat.nlink
			}
		};
	} : void 0);
}
async function openWindowsPolicyParent(binding, params, rootAdmission, fd, parentPath, relativePath) {
	try {
		const admitted = await openNativeParentAdmission(binding, {
			...rootAdmission,
			root: { fd },
			rootPath: parentPath,
			exactRoot: true
		}, relativePath, "native-directory");
		const guard = {
			...admitted.guard,
			stat: admitted.guard.stat
		};
		return {
			fd: admitted.fd,
			guard,
			observation: windowsParentObservation(binding, admitted.fd, guard)
		};
	} catch (error) {
		if (!isSymlinkOpenError(error)) throw error;
		throw new FsSafeError(params.mutationAdmission.rejectParentSymlinks ? "symlink" : "path-mismatch", "native write parent changed during policy admission", { cause: error instanceof Error ? error : void 0 });
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-lock-binding.js
const lockObservations = /* @__PURE__ */ new WeakMap();
function canReuseParentWithMutationAssertion(assertion, rootPath, targetPath) {
	if (assertion === void 0) return true;
	const binding = lockObservations.get(assertion);
	return binding?.rootPath === rootPath && binding.targetPath === targetPath;
}
function unsupportedSpelling() {
	return new FsSafeError("path-alias", "Windows compatibility writes require lower-case ASCII destination components");
}
function effectiveDestination(rootPath, targetPath, rootIdentity) {
	let effective;
	let missingHint;
	try {
		effective = realpathSync$1.native(targetPath);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		let cursor = targetPath;
		const missing = [];
		for (;;) try {
			fs.lstatSync(cursor);
			break;
		} catch (error) {
			if (!isNotFoundPathError(error) || cursor === rootPath) throw error;
			const parent = path.dirname(cursor);
			if (parent === cursor) throw error;
			missing.unshift(path.basename(cursor));
			cursor = parent;
		}
		const canonicalParent = realpathSync$1.native(cursor);
		effective = path.join(canonicalParent, ...missing);
		if (missing.length > 1 && path.resolve(canonicalParent) === canonicalParent && missing.every((component) => /^[a-z0-9._-]+$/.test(component) && component !== "." && component !== ".." && !component.endsWith("."))) missingHint = Object.freeze({
			parentPath: canonicalParent,
			parts: Object.freeze(missing),
			nextIndex: 0
		});
	}
	const admitted = admitPathInsideRoot({
		rootPath,
		candidatePath: effective,
		rootIdentity
	});
	if (!admitted) throw unsupportedSpelling();
	const relative = admitted.relativePath;
	if (!relative || !relative.split(path.sep).every((component) => /^[a-z0-9._-]+$/.test(component) && !component.endsWith("."))) throw unsupportedSpelling();
	return {
		path: admitted.path,
		missing: admitted.admission === "exact" && admitted.path === effective ? missingHint : void 0
	};
}
function observeMissingDestination(hint) {
	if (hint.parts.length - hint.nextIndex < 2) return void 0;
	try {
		let parentPath = hint.parentPath;
		let parent = inspectDirectoryIdentitySync(parentPath);
		for (let nextIndex = hint.nextIndex; nextIndex < hint.parts.length; nextIndex++) {
			const childPath = path.join(parentPath, hint.parts[nextIndex]);
			let child;
			try {
				child = fs.lstatSync(childPath, { bigint: true });
			} catch (error) {
				if (!hasNodeErrorCode(error, "ENOENT")) return void 0;
				if (realpathSync$1.native(parentPath) !== parentPath) return void 0;
				inspectDirectoryIdentitySync(parentPath, parent);
				try {
					fs.lstatSync(childPath);
				} catch (error) {
					if (!hasNodeErrorCode(error, "ENOENT")) return void 0;
					if (realpathSync$1.native(parentPath) !== parentPath) return void 0;
					return Object.freeze({
						parentPath,
						parts: hint.parts,
						nextIndex
					});
				}
				return;
			}
			if (nextIndex === hint.parts.length - 1) return void 0;
			parent = inspectDirectoryIdentitySync(childPath, void 0, child);
			parentPath = childPath;
		}
	} catch {}
}
function assertRootFallbackWritePath(expected, actual) {
	if (expected !== void 0 && actual !== expected) throw new FsSafeError("path-mismatch", "compatibility write destination changed after lock selection");
}
function createRootWriteLockBinding(params) {
	const { rootPath } = params;
	const rootIdentity = params.rootIdentity && Object.freeze({
		dev: params.rootIdentity.dev,
		ino: params.rootIdentity.ino
	});
	const selected = effectiveDestination(rootPath, params.targetPath, rootIdentity);
	const targetPath = selected.path;
	let missingHint = selected.missing;
	const relativePath = path.relative(rootPath, targetPath);
	let active = true;
	const assertCurrent = () => {
		if (!active) throw new FsSafeError("path-mismatch", "compatibility lock observation expired");
		const observed = missingHint && observeMissingDestination(missingHint);
		if (observed) {
			missingHint = observed;
			return;
		}
		missingHint = void 0;
		const current = effectiveDestination(rootPath, targetPath, rootIdentity);
		assertRootFallbackWritePath(targetPath, current.path);
		missingHint = current.missing;
	};
	lockObservations.set(assertCurrent, Object.freeze({
		rootPath,
		targetPath
	}));
	return Object.freeze({
		targetPath,
		relativePath,
		relativeLockPath: relativePath.split(path.sep).join("/"),
		assertCurrent,
		dispose() {
			active = false;
			missingHint = void 0;
			lockObservations.delete(assertCurrent);
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-policy-parent.js
var __addDisposableResource$4 = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources$4 = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function mkdirPosixPolicyChild(binding, parentFd, basename) {
	if (!basename || basename === "." || basename === ".." || basename.includes("/") || basename.includes("\0") || process.platform === "win32" && basename.includes("\\")) throw new FsSafeError("invalid-path", "native parent creation requires one direct-child basename");
	const mkdirChild = binding.mkdirChildBeneath;
	if (typeof mkdirChild === "function") {
		const created = mkdirChild.call(binding, parentFd, basename, 511);
		if (typeof created === "boolean") return created;
	}
	assertNativeCapabilities(binding, "mkdirBeneath");
	binding.mkdirBeneath(parentFd, basename, 511);
	return false;
}
function normalizePosixParentOpenError(error, params) {
	if (!isSymlinkOpenError(error)) return error;
	return params.mutationAdmission?.rejectParentSymlinks ? new FsSafeError("symlink", "symlink path component not allowed", errorCauseOptions(error)) : new FsSafeError("path-mismatch", "native write parent changed during policy admission", errorCauseOptions(error));
}
async function describePosixParent(fd, pathname) {
	const parentPath = realpathSync$1.native(pathname);
	const stagedDirectory = describeStagedDirectory(fd, parentPath);
	const stat = await inspectDirectoryIdentity(parentPath, stagedDirectory.identity);
	return {
		fd,
		guard: {
			dir: parentPath,
			realPath: parentPath,
			stat
		},
		stagedDirectory,
		observation: checkedMutationDirectory(parentPath, stagedDirectory.realPath, stat)
	};
}
function tryDescribePolicyPosixParent(binding, fd, pathname) {
	try {
		const policyDirectory = describePolicyStagedDirectory(fd, pathname, binding);
		return {
			fd,
			guard: {
				dir: policyDirectory.directory.realPath,
				realPath: policyDirectory.directory.realPath,
				stat: policyDirectory.stat
			},
			stagedDirectory: policyDirectory.directory,
			observation: policyDirectory.observation,
			policyDirectory
		};
	} catch (error) {
		if (!(error instanceof FsSafeError) || error instanceof NativePolicyDirectoryMismatch || error.code !== "path-mismatch" && error.code !== "not-file") throw error;
		return;
	}
}
async function capturePolicyAwareNativeParent(binding, params, rootAdmission, windows, directoryFlags, fuseChildCreation = false) {
	const env_1 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		assertNativeCapabilities(binding, "openBeneath");
		const rootFd = rootAdmission.root.fd;
		const closeFd = captureNativeFdClose(binding);
		const observationDisposers = windows ? void 0 : /* @__PURE__ */ new Map();
		const disposeObservation = (fd) => {
			const dispose = observationDisposers?.get(fd);
			observationDisposers?.delete(fd);
			dispose?.();
		};
		__addDisposableResource$4(env_1, { [Symbol.dispose]() {
			for (const dispose of observationDisposers?.values() ?? []) dispose();
		} }, false);
		const capturePolicyParent = (fd, pathname) => {
			const captured = tryDescribePolicyPosixParent(binding, fd, pathname);
			const dispose = captured?.policyDirectory?.disposeObservation;
			if (dispose) observationDisposers.set(fd, dispose);
			return captured;
		};
		const assertCurrent = (parent) => windows ? assertWindowsPolicyParentCurrent(parent) : parent.policyDirectory ? assertPolicyStagedDirectoryCurrent(parent.policyDirectory) : assertStagedDirectoryCurrent(parent.stagedDirectory);
		const closeAfterFailure = (fd, failure) => {
			disposeObservation(fd);
			if (windows) closeWindowsPolicyParentAfterFailure(closeFd, fd, failure, rootAdmission.reportCloseErrors);
			else closeFd(fd);
		};
		let session;
		async function authorize(request) {
			const frozen = Object.freeze(request);
			return await (session ? session.authorize(frozen) : windows ? params.mutationAdmission.authorize(frozen) : params.mutationAdmission?.authorize(frozen));
		}
		let segments = windows ? void 0 : params.relativeParentPath.split("/").filter(Boolean);
		let route = segments && createPathSegmentRoute(segments);
		let initialTarget = route && joinPathSegmentRoute(params.rootPath, route, 0, params.basename);
		const parentSpelling = segments?.length ? path.join(params.rootPath, ...segments) : params.rootPath;
		let retainedTargetPath = windows ? void 0 : params.mutationAdmission?.beginParentWalk?.();
		if (retainedTargetPath && !sameAbsolutePath(retainedTargetPath, initialTarget)) retainedTargetPath = void 0;
		let complete;
		let completeFd;
		try {
			if (windows) {
				complete = await openWindowsPolicyParent(binding, params, rootAdmission, rootFd, params.rootPath, params.relativeParentPath);
				completeFd = complete.fd;
			} else completeFd = binding.openBeneath(rootFd, params.relativeParentPath, directoryFlags).fd;
		} catch (error) {
			if (error?.code !== "ENOENT" || !params.mkdir) {
				if (windows) throw error;
				await authorize({
					targetPath: initialTarget,
					mutationPath: initialTarget,
					phase: "parent"
				});
				throw normalizePosixParentOpenError(error, params);
			}
		}
		if (completeFd !== void 0) try {
			complete ??= retainedTargetPath ? capturePolicyParent(completeFd, parentSpelling) : void 0;
			if (!complete) {
				retainedTargetPath = void 0;
				complete = await describePosixParent(completeFd, parentSpelling);
			}
			const targetPath = path.join(complete.guard.realPath, params.basename);
			await authorize({
				targetPath,
				mutationPath: targetPath,
				phase: "parent"
			});
			assertCurrent(complete);
			return complete;
		} catch (error) {
			closeAfterFailure(completeFd, { error });
			throw error;
		}
		segments ??= params.relativeParentPath.split("/").filter(Boolean);
		route ??= createPathSegmentRoute(segments);
		let current;
		if (windows) {
			const rootStat = inspectDirectoryIdentitySync(params.rootPath, inspectFileIdentitySync(() => fs.fstatSync(rootFd, { bigint: true })));
			const guard = {
				dir: params.rootPath,
				realPath: params.rootPath,
				stat: rootStat
			};
			current = {
				fd: rootFd,
				guard,
				observation: windowsParentObservation(binding, rootFd, guard)
			};
		} else {
			const captured = retainedTargetPath ? capturePolicyParent(rootFd, params.rootPath) : void 0;
			if (!captured) retainedTargetPath = void 0;
			current = captured ?? await describePosixParent(rootFd, params.rootPath);
		}
		let ownedFd;
		let currentPath = params.rootPath;
		let failure;
		initialTarget ??= joinPathSegmentRoute(params.rootPath, route, 0, params.basename);
		if (windows && canReuseParentWithMutationAssertion(params.assertBeforeMutation, params.rootPath, initialTarget)) {
			session = params.mutationAdmission?.beginNativeParentWalk?.() ?? params.mutationAdmission?.beginSharedParentWalk?.();
			if (session && session.retainedTargetPath !== initialTarget) {
				session.dispose();
				session = void 0;
			}
		}
		const secureDirectoryFlags = directoryFlags | (fs.constants.O_NOFOLLOW ?? 0);
		try {
			if (!windows) {
				const targetPath = retainedTargetPath ?? initialTarget;
				await authorize({
					targetPath,
					mutationPath: targetPath,
					phase: "parent"
				});
				assertCurrent(current);
			}
			for (let index = 0; index < segments.length; index += 1) {
				const segment = segments[index];
				let childPath = windows ? void 0 : path.join(currentPath, segment);
				let child;
				let childFd;
				let createdByMkdir = false;
				let createReceipt;
				try {
					if (windows) {
						child = await openWindowsPolicyParent(binding, params, rootAdmission, current.fd, currentPath, segment);
						childFd = child.fd;
					} else childFd = binding.openBeneath(current.fd, segment, secureDirectoryFlags).fd;
				} catch (error) {
					if (!(windows ? error?.code === "ENOENT" : isNotFoundPathError(error))) throw windows ? error : normalizePosixParentOpenError(error, params);
					const targetPath = (windows ? session?.retainedTargetPath : retainedTargetPath) ?? joinPathSegmentRoute(currentPath, route, index, params.basename);
					childPath ??= path.join(currentPath, segment);
					const request = Object.freeze({
						targetPath,
						mutationPath: childPath,
						phase: "parent-create"
					});
					createReceipt = windows ? session?.tryAuthorizeAtParent(request, current.observation) : params.mutationAdmission?.tryAuthorizeAtParent?.(request, current.observation);
					if (!createReceipt) {
						createReceipt = await authorize(windows ? { ...request } : request);
						assertCurrent(current);
					}
					if (windows) {
						if (params.assertBeforeMutation) {
							params.assertBeforeMutation();
							assertCurrent(current);
						}
					} else {
						params.assertBeforeMutation?.();
						assertCurrent(current);
					}
					if (windows) {
						const mkdirChild = binding.mkdirChildBeneath;
						if (typeof mkdirChild !== "function") throw new FsSafeError("helper-unavailable", "native direct-child parent creation is unavailable");
						createdByMkdir = mkdirChild.call(binding, current.fd, segment, 511) === true;
						child = await openWindowsPolicyParent(binding, params, rootAdmission, current.fd, currentPath, segment);
						childFd = child.fd;
					} else if (fuseChildCreation && binding.mkdirOpenChildBeneath) try {
						const child = binding.mkdirOpenChildBeneath(current.fd, segment, 511, secureDirectoryFlags);
						childFd = child.fd;
						createdByMkdir = child.created;
					} catch (error) {
						throw normalizePosixParentOpenError(error, params);
					}
					else {
						createdByMkdir = mkdirPosixPolicyChild(binding, current.fd, segment);
						try {
							childFd = binding.openBeneath(current.fd, segment, secureDirectoryFlags).fd;
						} catch (error) {
							throw normalizePosixParentOpenError(error, params);
						}
					}
				}
				try {
					if (!child) {
						child = retainedTargetPath ? capturePolicyParent(childFd, childPath) : void 0;
						if (!child) {
							retainedTargetPath = void 0;
							child = await describePosixParent(childFd, childPath);
						}
						if (!sameAbsolutePath(child.guard.realPath, childPath)) retainedTargetPath = void 0;
					}
					const windowsTarget = windows ? joinPathSegmentRoute(child.guard.realPath, route, index + 1, params.basename) : void 0;
					if (session && windowsTarget !== session.retainedTargetPath) {
						session.dispose();
						session = void 0;
					}
					let childAuthorization;
					if (createdByMkdir && createReceipt && (windows ? session : params.mutationAdmission?.advanceCreatedDirectory)) {
						let evidence;
						try {
							const parent = windows ? windowsParentObservation(binding, current.fd, {
								...current.guard,
								stat: inspectFileIdentitySync(() => fs.fstatSync(current.fd, { bigint: true }), current.guard.stat)
							}) : current.policyDirectory ? refreshPolicyStagedDirectoryObservation(current.policyDirectory) : checkedMutationDirectory(currentPath, current.stagedDirectory.realPath, assertStagedDirectoryCurrent(current.stagedDirectory));
							evidence = Object.freeze({
								admission: createReceipt,
								parent,
								child: child.observation
							});
						} catch {}
						if (evidence) childAuthorization = windows ? session.advanceCreatedDirectory(evidence) : params.mutationAdmission.advanceCreatedDirectory(evidence);
					}
					const targetPath = windowsTarget ?? retainedTargetPath ?? joinPathSegmentRoute(child.guard.realPath, route, index + 1, params.basename);
					if (!windows || !childAuthorization) {
						const request = {
							targetPath,
							mutationPath: targetPath,
							phase: "parent"
						};
						if (!windows) {
							Object.freeze(request);
							if (createdByMkdir) childAuthorization ??= params.mutationAdmission?.tryAuthorizeAtParent?.(request, child.observation);
						}
						if (!childAuthorization) {
							await authorize(request);
							assertCurrent(child);
						}
					}
				} catch (error) {
					closeAfterFailure(childFd, { error });
					throw error;
				}
				const previousFd = ownedFd;
				disposeObservation(current.fd);
				current = child;
				ownedFd = child.fd;
				currentPath = child.guard.realPath;
				if (previousFd !== void 0) closeFd(previousFd);
			}
			if (ownedFd === void 0) throw new FsSafeError("path-mismatch", "native write parent admission did not complete");
			ownedFd = void 0;
			return current;
		} catch (error) {
			failure = { error };
			throw error;
		} finally {
			session?.dispose();
			if (ownedFd !== void 0) closeAfterFailure(ownedFd, failure);
		}
	} catch (e_1) {
		env_1.error = e_1;
		env_1.hasError = true;
	} finally {
		__disposeResources$4(env_1);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-mutation-shared-route.js
function windowsReservedDeviceSegment(segment) {
	const extension = segment.indexOf(".");
	const stem = segment.slice(0, extension < 0 ? segment.length : extension).toUpperCase();
	return WINDOWS_RESERVED_DEVICE_NAMES.has(stem);
}
function ordinaryWindowsSegments(relativePath) {
	if (relativePath === "" || relativePath.includes("/") || relativePath.includes("\0")) return false;
	return relativePath.split("\\").every((segment) => isSafePathSegment(segment, { allowDotPrefix: true }) && !segment.endsWith(".") && !segment.endsWith(" ") && !windowsReservedDeviceSegment(segment));
}
function ordinaryPosixSegments(relativePath) {
	return relativePath !== "" && !relativePath.includes("\\") && relativePath.split("/").every((segment) => isSafePathSegment(segment, { allowDotPrefix: true }));
}
function exactNonzeroRootIdentity(identity) {
	return typeof identity?.dev === "bigint" && typeof identity.ino === "bigint" && identity.dev !== 0n && identity.ino !== 0n ? Object.freeze({
		dev: identity.dev,
		ino: identity.ino
	}) : void 0;
}
function ordinarySharedAbsoluteInsideRoot(rootReal, candidatePath, rootIdentity) {
	if (!path.isAbsolute(candidatePath) || candidatePath.includes("\0") || path.resolve(candidatePath) !== candidatePath || (process.platform === "win32" ? candidatePath.startsWith("\\\\") || candidatePath.includes("/") : candidatePath.includes("\\"))) return false;
	const admitted = admitPathInsideRoot({
		rootPath: rootReal,
		candidatePath,
		rootIdentity
	});
	return admitted?.admission === "exact" && admitted.path === candidatePath && (admitted.relativePath === "" || (process.platform === "win32" ? ordinaryWindowsSegments(admitted.relativePath) : ordinaryPosixSegments(admitted.relativePath)));
}
function simpleSharedRoute(params) {
	if (process.versions.bun || params.policy.mutationSymlinks !== "reject" || !params.originalPath || params.originalPath.startsWith("~") || path.isAbsolute(params.originalPath) || !(process.platform === "win32" ? ordinaryWindowsSegments(params.originalPath) && !params.rootReal.startsWith("\\\\") && !params.rootReal.includes("/") : ordinaryPosixSegments(params.originalPath) && !params.rootReal.includes("\\")) || path.resolve(params.rootReal) !== params.rootReal) return void 0;
	const rootIdentity = exactNonzeroRootIdentity(params.rootIdentity);
	if (!rootIdentity) return void 0;
	const route = path.resolve(params.rootReal, params.originalPath);
	if (route !== params.selectedTarget || !ordinarySharedAbsoluteInsideRoot(params.rootReal, route, rootIdentity)) return void 0;
	if ([...params.policy.denyMutations?.paths ?? [], ...params.policy.denyMutations?.prefixes ?? []].some((entry) => entry !== path.resolve(entry) || !ordinarySharedAbsoluteInsideRoot(params.rootReal, entry, rootIdentity))) return void 0;
	return {
		route,
		rootIdentity
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-mutation-admission.js
function snapshotPinnedMutationPolicy(denyMutations, mutationSymlinks) {
	if (denyMutations === void 0 && mutationSymlinks === void 0) return void 0;
	const denySnapshot = denyMutations === void 0 ? void 0 : Object.freeze({
		paths: denyMutations.paths === void 0 ? void 0 : Object.freeze([...denyMutations.paths]),
		prefixes: denyMutations.prefixes === void 0 ? void 0 : Object.freeze([...denyMutations.prefixes])
	});
	return Object.freeze({
		denyMutations: denySnapshot,
		mutationSymlinks
	});
}
async function canonicalMutationEntryPath(targetPath) {
	const canonicalParent = await resolvePathViaExistingAncestor(path.dirname(targetPath));
	return path.join(canonicalParent, path.basename(targetPath));
}
function simplePinnedRoute(rootReal, originalPath) {
	if (!originalPath || process.platform === "win32" || process.versions.bun || originalPath.startsWith("~") || originalPath.includes("\\") || originalPath.includes("\0")) return void 0;
	if (originalPath.split("/").some((segment, index) => segment === "." || segment === ".." || segment === "" && index !== 0)) return void 0;
	const target = path.resolve(rootReal, originalPath);
	return isPathInside(rootReal, target) && target !== rootReal ? target : void 0;
}
function nonzeroObservationIdentity(observation) {
	return observation.entry.dev !== 0n && observation.entry.ino !== 0n && observation.identity.dev !== 0n && observation.identity.ino !== 0n;
}
function captureEpoch(rootReal, target, policy, session) {
	const observations = /* @__PURE__ */ new Map();
	const observe = (pathname) => {
		if (!observations.has(pathname)) {
			const observation = observeMutationPath(pathname);
			if (!observation) throw new Error("incomplete mutation observation");
			observations.set(pathname, observation);
		}
		return observations.get(pathname);
	};
	try {
		const root = observe(rootReal);
		const route = observe(target);
		if (root.canonicalPath !== rootReal || route.canonicalPath !== target || route.ancestor !== route.canonicalAncestor || route.entry.dev !== route.identity.dev || route.entry.ino !== route.identity.ino) return void 0;
		const comparables = (entries) => Object.freeze((entries ?? []).map((entry) => {
			if (!entry || !path.isAbsolute(entry) || entry.includes("\0")) throw new Error("invalid policy observation");
			const resolved = path.resolve(entry);
			if (session.kind === "shared" && (!session.rootIdentity || entry !== resolved || !ordinarySharedAbsoluteInsideRoot(rootReal, resolved, session.rootIdentity))) throw new Error("ineligible shared policy observation");
			const observation = observe(resolved);
			if (session.kind === "shared" && (observation.canonicalPath !== resolved || observation.ancestor !== observation.canonicalAncestor || !nonzeroObservationIdentity(observation))) throw new Error("incomplete shared policy observation");
			return Object.freeze([resolved, observation.canonicalPath]);
		}));
		const paths = comparables(policy.denyMutations?.paths);
		const prefixes = comparables(policy.denyMutations?.prefixes);
		if (session.kind === "shared" && (!session.rootIdentity || root.entry.dev !== session.rootIdentity.dev || root.entry.ino !== session.rootIdentity.ino || root.identity.dev !== session.rootIdentity.dev || root.identity.ino !== session.rootIdentity.ino || !nonzeroObservationIdentity(root) || !nonzeroObservationIdentity(route))) return void 0;
		return Object.freeze({
			mode: getFsSafeNativeConfig().mode,
			target: route,
			paths,
			prefixes,
			observations: Object.freeze([...observations.values()]),
			session
		});
	} catch {
		return;
	}
}
function epochCurrent(epoch, directories) {
	return !process.versions.bun && epoch.mode === epoch.session.nativeMode && getFsSafeNativeConfig().mode === epoch.mode && (directories ? mutationObservationsCurrent(epoch.observations, directories) : epoch.observations.every(mutationObservationCurrent)) && getFsSafeNativeConfig().mode === epoch.mode;
}
function assertCachedNotDenied(target, epoch) {
	const matches = createMutationDenyMatcher();
	if (epoch.paths.some((paths) => paths.some((denied) => matches(target, denied, false))) || epoch.prefixes.some((paths) => paths.some((denied) => matches(target, denied, true)))) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
}
function reusableRequest(request, epoch) {
	return request.targetPath === epoch.target.path && (request.phase === "parent" && request.mutationPath === request.targetPath || request.phase === "parent-create" && missingMutationSegments(epoch.target) > 1 && request.mutationPath === nextMissingMutationPath(epoch.target));
}
function reusableSharedCreateRequest(request, epoch) {
	return request.phase === "parent-create" && request.targetPath === epoch.target.path && request.mutationPath === nextMissingMutationPath(epoch.target);
}
function reusableSharedRequest(request, epoch) {
	return request.phase === "parent" ? request.targetPath === epoch.target.path && request.mutationPath === request.targetPath : reusableSharedCreateRequest(request, epoch);
}
function nonzeroDirectoryObservation(observation) {
	return observation.identity.dev !== 0n && observation.identity.ino !== 0n;
}
function advanceAuthorizedDirectory(admittedEpoch, admitted, receipt) {
	if (!admittedEpoch || !admitted || receipt.admission !== admitted || admitted.epoch !== admittedEpoch || admitted.session !== admittedEpoch.session || admitted.childPath !== receipt.child.path || admittedEpoch.session.kind === "shared" && (!nonzeroDirectoryObservation(receipt.parent) || !nonzeroDirectoryObservation(receipt.child))) return void 0;
	const observations = admittedEpoch.observations.map((observation) => advanceMutationObservation(observation, receipt.parent, receipt.child));
	if (observations.some((observation) => !observation)) return void 0;
	const complete = observations;
	const target = complete.find((observation) => observation.path === admittedEpoch.target.path);
	if (!target || target.missingOffset !== admittedEpoch.target.missingOffset + 1) return void 0;
	const next = Object.freeze({
		...admittedEpoch,
		target,
		observations: Object.freeze(complete)
	});
	if (!mutationObservationUsesDirectory(target, receipt.child) || !epochCurrent(next, [receipt.parent, receipt.child])) return void 0;
	assertCachedNotDenied(target.path, next);
	assertCachedNotDenied(receipt.child.path, next);
	return next;
}
async function preparePinnedWriteMutationAdmission(params) {
	if (!params.policy) return { relativeParentPath: params.defaultRelativeParentPath };
	const policy = params.policy;
	const route = simplePinnedRoute(params.rootReal, params.originalPath);
	const sharedRoute = simpleSharedRoute({
		rootReal: params.rootReal,
		rootIdentity: params.rootIdentity,
		originalPath: params.originalPath,
		selectedTarget: params.resolvedTargetPath,
		policy
	});
	const nativeRoute = sharedRoute ?? (process.platform === "win32" && params.originalPath?.includes("/") ? simpleSharedRoute({
		rootReal: params.rootReal,
		rootIdentity: params.rootIdentity,
		originalPath: params.originalPath.replaceAll("/", "\\"),
		selectedTarget: params.resolvedTargetPath,
		policy
	}) : void 0);
	let pinnedSession;
	let epoch;
	let pending;
	const observedCanonicalParent = await resolvePathViaExistingAncestor(path.dirname(params.resolvedTargetPath));
	const admittedCanonicalParent = admitPathInsideRoot({
		rootPath: params.rootReal,
		candidatePath: observedCanonicalParent,
		rootIdentity: params.rootIdentity
	});
	if (!admittedCanonicalParent) throw outsideWorkspaceError();
	const relativeCanonicalParent = admittedCanonicalParent.relativePath;
	const authorizeFully = async (request) => {
		const current = await params.resolveCurrent();
		await assertMutationNotDenied(request.targetPath, policy.denyMutations);
		if (!sameAbsolutePath(request.targetPath, request.mutationPath)) await assertMutationNotDenied(request.mutationPath, policy.denyMutations);
		const [currentTarget, admittedTarget] = await Promise.all([canonicalMutationEntryPath(current.resolved), canonicalMutationEntryPath(request.targetPath)]);
		if (!sameAbsolutePath(currentTarget, admittedTarget)) throw new FsSafeError("path-mismatch", "write target changed during mutation policy admission");
		return current;
	};
	const createSharedParentWalk = (admittedRoute) => {
		const session = Object.freeze({
			kind: "shared",
			route: admittedRoute.route,
			selectedTarget: params.resolvedTargetPath,
			nativeMode: getFsSafeNativeConfig().mode,
			rootIdentity: admittedRoute.rootIdentity,
			authorizationToken: Object.freeze({})
		});
		let disposed = false;
		let disabled = false;
		let sharedEpoch;
		let sharedPending;
		const disable = () => {
			disabled = true;
			sharedEpoch = void 0;
			sharedPending = void 0;
		};
		return Object.freeze({
			retainedTargetPath: session.route,
			tryAuthorizeAtParent(request, parent) {
				if (disposed || disabled) return void 0;
				if (!sharedEpoch && !sharedPending) return void 0;
				if (sharedPending) {
					disable();
					return;
				}
				const reusable = sharedEpoch;
				if (!reusable || reusable.session !== session || !reusableSharedCreateRequest(request, reusable) || !mutationObservationUsesDirectory(reusable.target, parent) || !nonzeroDirectoryObservation(parent) || !epochCurrent(reusable, [parent])) {
					disable();
					return;
				}
				assertCachedNotDenied(request.targetPath, reusable);
				assertCachedNotDenied(request.mutationPath, reusable);
				sharedPending = Object.freeze({
					epoch: reusable,
					childPath: request.mutationPath,
					session
				});
				return sharedPending;
			},
			async authorize(request) {
				if (sharedPending) disable();
				const reusable = sharedEpoch;
				if (!disposed && !disabled && reusable?.session === session && reusableSharedRequest(request, reusable) && epochCurrent(reusable)) {
					assertCachedNotDenied(request.targetPath, reusable);
					assertCachedNotDenied(request.mutationPath, reusable);
					return;
				}
				if (reusable) disable();
				const captureRequested = !disposed && !disabled && request.targetPath === session.route;
				const candidate = captureRequested ? captureEpoch(params.rootReal, session.route, policy, session) : void 0;
				if (captureRequested && (!candidate || !reusableSharedRequest(request, candidate))) disable();
				const current = await authorizeFully(request);
				if (disposed || disabled || !candidate) {
					sharedEpoch = void 0;
					return;
				}
				if (current.resolved !== session.route || current.resolved !== session.selectedTarget || !epochCurrent(candidate)) {
					disable();
					return;
				}
				sharedEpoch = candidate;
				if (request.phase === "parent") return void 0;
				sharedPending = Object.freeze({
					epoch: candidate,
					childPath: request.mutationPath,
					session
				});
				return sharedPending;
			},
			advanceCreatedDirectory(receipt) {
				const admitted = sharedPending;
				const admittedEpoch = sharedEpoch;
				sharedPending = void 0;
				sharedEpoch = void 0;
				if (disposed || disabled || admittedEpoch?.session !== session) {
					disable();
					return;
				}
				const next = advanceAuthorizedDirectory(admittedEpoch, admitted, receipt);
				if (!next) {
					disable();
					return;
				}
				sharedEpoch = next;
				return session.authorizationToken;
			},
			dispose() {
				disposed = true;
				disable();
			}
		});
	};
	const mutationAdmission = Object.freeze({
		rejectParentSymlinks: policy.mutationSymlinks === "reject",
		beginParentWalk: route ? () => {
			pinnedSession = Object.freeze({
				kind: "pinned",
				route,
				selectedTarget: params.resolvedTargetPath,
				nativeMode: getFsSafeNativeConfig().mode,
				authorizationToken: Object.freeze({})
			});
			epoch = void 0;
			pending = void 0;
			return route;
		} : void 0,
		beginSharedParentWalk: sharedRoute ? () => createSharedParentWalk(sharedRoute) : void 0,
		beginNativeParentWalk: nativeRoute ? () => createSharedParentWalk(nativeRoute) : void 0,
		tryAuthorizeAtParent(request, parent) {
			pending = void 0;
			const reusable = epoch;
			if (!reusable || reusable.session !== pinnedSession || !reusableRequest(request, reusable) || !mutationObservationUsesDirectory(reusable.target, parent) || !epochCurrent(reusable, [parent])) {
				epoch = void 0;
				return;
			}
			assertCachedNotDenied(request.targetPath, reusable);
			assertCachedNotDenied(request.mutationPath, reusable);
			if (request.phase === "parent-create") {
				pending = Object.freeze({
					epoch: reusable,
					childPath: request.mutationPath,
					session: reusable.session
				});
				return pending;
			}
			return reusable.session.authorizationToken;
		},
		async authorize(request) {
			pending = void 0;
			if (epoch && epoch.session === pinnedSession && reusableRequest(request, epoch) && epochCurrent(epoch)) {
				assertCachedNotDenied(request.targetPath, epoch);
				assertCachedNotDenied(request.mutationPath, epoch);
				if (request.phase === "parent-create") {
					pending = Object.freeze({
						epoch,
						childPath: request.mutationPath,
						session: epoch.session
					});
					return pending;
				}
				return;
			}
			epoch = void 0;
			const session = pinnedSession;
			const candidate = session && route === request.targetPath ? captureEpoch(params.rootReal, route, policy, session) : void 0;
			const current = await authorizeFully(request);
			if (candidate && candidate.session === pinnedSession && current.resolved === route && epochCurrent(candidate)) {
				epoch = candidate;
				if (request.phase === "parent-create" && reusableRequest(request, candidate)) {
					pending = Object.freeze({
						epoch: candidate,
						childPath: request.mutationPath,
						session: candidate.session
					});
					return pending;
				}
			}
		},
		advanceCreatedDirectory: route ? (receipt) => {
			const admitted = pending;
			pending = void 0;
			const admittedEpoch = epoch;
			epoch = void 0;
			const next = advanceAuthorizedDirectory(admittedEpoch, admitted, receipt);
			if (!next) return void 0;
			epoch = next;
			return next.session.authorizationToken;
		} : void 0
	});
	return {
		relativeParentPath: relativeCanonicalParent ? relativeCanonicalParent.split(path.sep).join(path.posix.sep) : "",
		mutationAdmission
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-native-creation-path.js
function existingCreationParent(params) {
	if (params.private || params.policy || params.assertBeforeMutation !== void 0 || getFsSafeTestHooks()?.beforeRootFallbackMutation || !params.originalPath || params.directory !== path.dirname(params.target)) return void 0;
	const segments = params.originalPath.split(path.sep === "\\" ? /[\\/]/ : "/");
	if (segments.some((segment) => !isSafePathSegment(segment, { allowDotPrefix: true }) || segment.endsWith(".")) || path.join(params.root.rootReal, ...segments) !== params.target) return void 0;
	let rootStat;
	assertRootIdentityCurrentSync(params.root, (stat) => {
		rootStat = stat;
	});
	try {
		const identity = inspectDirectoryIdentitySync(params.directory, void 0, params.directory === params.root.rootReal ? rootStat : void 0);
		if (realpathSync$1.native(pathForWindowsFilesystem(params.directory)) !== params.directory) return void 0;
		return {
			path: params.directory,
			identity,
			relative: path.relative(params.root.rootReal, params.directory).split(path.sep).join("/"),
			flags: (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0) | (fs.constants.O_NOFOLLOW ?? 0)
		};
	} catch {
		return;
	}
}
function probeNativeCreationPath(root, relativePath) {
	if (typeof relativePath !== "string") return void 0;
	const segments = relativePath.split(path.sep === "\\" ? /[\\/]/ : "/");
	if (segments.some((segment) => !isSafePathSegment(segment, { allowDotPrefix: true }) || segment.endsWith("."))) return void 0;
	const target = path.join(root.rootReal, ...segments);
	assertRootIdentityCurrentSync(root);
	try {
		if (fs.lstatSync(pathForWindowsFilesystem(target), { throwIfNoEntry: false })) return void 0;
	} catch {
		return;
	}
	const parent = existingCreationParent({
		root,
		target,
		directory: path.dirname(target),
		mkdir: true,
		originalPath: relativePath,
		resolveCurrent: async () => target
	});
	if (!parent) return void 0;
	return {
		rootReal: root.rootReal,
		rootWithSep: root.rootWithSep,
		resolved: target,
		parent
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-create-native.js
var __addDisposableResource$3 = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources$3 = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function rootWriteQueueKey(root, relativePath) {
	return `${root.rootReal}\0${relativePath}`;
}
function buildAtomicWriteTempPath(targetPath) {
	return path.join(path.dirname(targetPath), `.fs-safe-${randomUUID()}.tmp`);
}
const nativeCreateCollisions = /* @__PURE__ */ new WeakSet();
function isNativeCreateCollision(error) {
	return typeof error === "object" && error !== null && nativeCreateCollisions.has(error);
}
function unavailable$1() {
	throw new FsSafeError("helper-unavailable", "native confined creation is unavailable");
}
async function withNativeDirectory(params, operation, discard) {
	const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
	if (!binding?.openBeneath || !binding.mkdirChildBeneath || params.private && process.platform === "win32") return unavailable$1();
	const existing = params.selectedParent ?? existingCreationParent(params);
	if (existing) {
		let pending;
		try {
			const env_1 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const rootOwner = __addDisposableResource$3(env_1, openExactNativeRootSync(binding, {
					rootPath: params.root.rootReal,
					rootIdentity: params.root.rootIdentity
				}), false);
				const close = captureNativeFdClose(binding);
				const borrowed = existing.path === params.root.rootReal;
				const fd = borrowed ? rootOwner.fd : binding.openBeneath(rootOwner.fd, existing.relative, existing.flags).fd;
				__addDisposableResource$3(env_1, { [Symbol.dispose]() {
					if (!borrowed) close(fd);
				} }, false);
				inspectFileIdentitySync(() => borrowed ? rootOwner.stat : fs.fstatSync(fd, { bigint: true }), existing.identity);
				verifyMkdirDirectory(binding, fd, existing.path);
				const guard = {
					dir: existing.path,
					realPath: existing.path,
					stat: existing.identity
				};
				const assertCurrent = () => {
					let currentRoot;
					assertRootIdentityCurrentSync(params.root, (stat) => {
						currentRoot = stat;
					});
					if (borrowed) {
						inspectDirectoryIdentitySync(existing.path, existing.identity, currentRoot);
						if (realpathSync$1.native(pathForWindowsFilesystem(existing.path)) !== existing.path) throw new FsSafeError("path-mismatch", "directory changed during operation");
					} else assertSyncDirectoryGuard(guard);
				};
				pending = { value: await operation(binding, fd, assertCurrent) };
				return pending.value;
			} catch (e_1) {
				env_1.error = e_1;
				env_1.hasError = true;
			} finally {
				__disposeResources$3(env_1);
			}
		} catch (error) {
			if (pending && discard) try {
				await discard(pending.value);
			} catch (cleanupError) {
				throw createSuppressedError(cleanupError, error, "creation handoff and cleanup failed");
			}
			throw error;
		}
	}
	const directoryTarget = params.directory === params.target;
	const canonicalTarget = async (target) => directoryTarget ? await resolvePathViaExistingAncestor(target) : path.join(await resolvePathViaExistingAncestor(path.dirname(target)), path.basename(target));
	const resolveCurrent = params.resolveCurrent;
	params = {
		...params,
		directory: await resolvePathViaExistingAncestor(params.directory),
		target: await canonicalTarget(params.target),
		resolveCurrent: async () => await canonicalTarget(await resolveCurrent())
	};
	if (!isPathInside(params.root.rootReal, params.directory)) throw new FsSafeError("outside-workspace", "creation parent is outside root");
	const close = captureNativeFdClose(binding);
	let pending;
	try {
		const env_2 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			const admitted = await openNativeRootAdmission(binding, {
				rootPath: params.root.rootReal,
				rootIdentity: params.root.rootIdentity,
				operation: "create",
				reportCloseErrors: true,
				searchOnly: true
			});
			const rootOwner = __addDisposableResource$3(env_2, admitted.root, true);
			const descriptors = [];
			__addDisposableResource$3(env_2, { [Symbol.dispose]() {
				const errors = [];
				for (const fd of descriptors.reverse()) try {
					close(fd);
				} catch (error) {
					errors.push(error);
				}
				if (errors.length) throw new AggregateError(errors, "creation directory close failed");
			} }, false);
			const guards = [];
			function assertCurrent() {
				assertRootIdentityCurrentSync(params.root);
				for (const guard of guards) assertSyncDirectoryGuard(guard);
			}
			async function authorize(mutation) {
				if (path.relative(params.target, await params.resolveCurrent()) !== "") throw new FsSafeError("path-mismatch", "creation route changed during admission");
				await assertMutationNotDenied(params.target, params.policy?.denyMutations);
				await assertMutationNotDenied(mutation, params.policy?.denyMutations);
				assertCurrent();
			}
			let current = rootOwner.fd;
			let currentPath = params.root.rootReal;
			const flags = (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0) | (fs.constants.O_NOFOLLOW ?? 0);
			if (!params.private && !(directoryTarget && params.directory === params.root.rootReal)) {
				if (!admitPathInsideRoot({
					rootPath: params.root.rootReal,
					candidatePath: params.target,
					rootIdentity: params.root.rootIdentity
				})) throw new FsSafeError("outside-workspace", "creation target is outside root");
				const relativeParentPath = path.relative(params.root.rootReal, params.directory).split(path.sep).join("/");
				const prepared = await preparePinnedWriteMutationAdmission({
					rootReal: params.root.rootReal,
					rootIdentity: params.root.rootIdentity,
					resolvedTargetPath: params.target,
					defaultRelativeParentPath: relativeParentPath,
					originalPath: params.originalPath,
					policy: params.policy ?? {},
					resolveCurrent: async () => ({ resolved: await params.resolveCurrent() })
				});
				const parent = await capturePolicyAwareNativeParent(binding, {
					rootPath: params.root.rootReal,
					rootIdentity: params.root.rootIdentity,
					relativeParentPath,
					basename: directoryTarget ? "" : path.basename(params.target),
					mkdir: params.mkdir,
					mode: 384,
					input: {
						kind: "buffer",
						data: ""
					},
					mutationAdmission: prepared.mutationAdmission,
					assertBeforeMutation: params.assertBeforeMutation
				}, admitted, process.platform === "win32", flags, true);
				descriptors.push(parent.fd);
				guards.push(parent.guard);
				assertCurrent();
				pending = { value: await operation(binding, parent.fd, assertCurrent) };
				return pending.value;
			}
			for (const segment of path.relative(currentPath, params.directory).split(path.sep).filter(Boolean)) {
				const childPath = path.join(currentPath, segment);
				let child;
				let created = false;
				try {
					child = binding.openBeneath(current, segment, flags).fd;
				} catch (error) {
					if (!params.mkdir || !isNotFoundPathError(error)) throw error;
					await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", childPath);
					await authorize(childPath);
					if (params.private) assertDarwinCreationAcl(current, "directory");
					params.assertBeforeMutation?.();
					assertCurrent();
					if (binding.mkdirOpenChildBeneath) {
						const opened = binding.mkdirOpenChildBeneath(current, segment, params.private ? 448 : 511, flags);
						created = opened.created;
						child = opened.fd;
					} else {
						created = binding.mkdirChildBeneath(current, segment, params.private ? 448 : 511);
						child = binding.openBeneath(current, segment, flags).fd;
					}
				}
				descriptors.push(child);
				const stat = inspectFileIdentitySync(() => fs.fstatSync(child, { bigint: true }));
				if (!stat.isDirectory()) throw new FsSafeError("not-file", "creation parent is not a directory");
				guards.push({
					dir: childPath,
					realPath: childPath,
					stat
				});
				assertCurrent();
				if (created && params.private) await assertPrivateDirectory(childPath);
				current = child;
				currentPath = childPath;
			}
			await authorize(params.target);
			if (params.private) {
				await assertPrivateDirectory(currentPath);
				assertCurrent();
			}
			pending = { value: await operation(binding, current, assertCurrent) };
			return pending.value;
		} catch (e_2) {
			env_2.error = e_2;
			env_2.hasError = true;
		} finally {
			const result_1 = __disposeResources$3(env_2);
			if (result_1) await result_1;
		}
	} catch (error) {
		if (pending && discard) try {
			await discard(pending.value);
		} catch (cleanupError) {
			throw createSuppressedError(cleanupError, error, "creation handoff and cleanup failed");
		}
		throw error;
	}
}
/** Admit only an ordinary direct child; aliases keep the full resolver. */
function tryMkdirNativeDirectChild(root, relativePath) {
	if (!isSafePathSegment(relativePath, { allowDotPrefix: true }) || relativePath.endsWith(".") || getFsSafeTestHooks()?.beforeRootFallbackMutation) return false;
	assertRootIdentityCurrentSync(root);
	const target = path.join(root.rootReal, relativePath);
	try {
		const entry = fs.lstatSync(pathForWindowsFilesystem(target), { throwIfNoEntry: false });
		if (entry && (!entry.isDirectory() || realpathSync$1.native(pathForWindowsFilesystem(target)) !== target)) return false;
	} catch {
		return false;
	}
	try {
		mkdirNativeRootChild({
			root,
			target
		});
		return true;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOTDIR")) throw directoryComponentNotDirectoryError(error);
		throw error;
	}
}
async function tryMkdirRootNative(params) {
	if (params.private && process.platform === "win32") return false;
	try {
		if (!params.private && !params.policy && !params.assertBeforeMutation && !getFsSafeTestHooks()?.beforeRootFallbackMutation && params.originalPath === path.basename(params.target) && path.dirname(params.target) === params.root.rootReal && params.directory === params.target) {
			mkdirNativeRootChild(params);
			return true;
		}
		return await withNativeDirectory(params, async (_binding, _fd, assertCurrent) => {
			assertCurrent();
			return true;
		});
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOTDIR")) throw directoryComponentNotDirectoryError(error);
		throw error;
	}
}
function verifyMkdirDirectory(binding, fd, pathname) {
	const observe = nativePolicyDirectoryObserver(binding, fd, pathname);
	try {
		if (observe?.()) return;
	} finally {
		observe?.dispose();
	}
	describePolicyStagedDirectory(fd, pathname);
}
function ensureNativeRootCurrent(root) {
	assertRootIdentityCurrentSync(root);
	const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
	if (!binding?.openBeneath || !binding.mkdirChildBeneath) return unavailable$1();
	if (binding.verifyRootDirectory) {
		const closeNative = captureNativeFdClose(binding);
		const failure = binding.verifyRootDirectory(root.rootReal, root.rootIdentity.dev, root.rootIdentity.ino);
		if (failure === null) return;
		if (failure?.fallbackFd !== void 0 && failure.fallbackFd !== null) {
			const env_3 = {
				stack: [],
				error: void 0,
				hasError: false
			};
			try {
				const fd = failure.fallbackFd;
				if (!Number.isInteger(fd) || fd < 0) throw new FsSafeError("helper-failed", "invalid root fallback descriptor");
				__addDisposableResource$3(env_3, { [Symbol.dispose]() {
					closeNative(fd);
				} }, false);
				if (failure.errorCode || failure.closeErrorCode) throw new FsSafeError("helper-failed", "invalid root verification result");
				ensureNativeRootCurrentLegacy(root, binding);
				return;
			} catch (e_3) {
				env_3.error = e_3;
				env_3.hasError = true;
			} finally {
				__disposeResources$3(env_3);
			}
		}
		const error = failure?.errorCode ? rootVerificationError(failure.errorCode, failure.errorMessage, failure.errorErrno) : void 0;
		const closeError = failure?.closeErrorCode ? Object.assign(new Error(failure.closeErrorMessage), {
			code: failure.closeErrorCode,
			...typeof failure.closeErrorErrno === "number" ? { errno: failure.closeErrorErrno } : {}
		}) : void 0;
		if (error && closeError) throw createSuppressedError(closeError, error, "root verification and close failed");
		if (error || closeError) throw error ?? closeError;
		throw new FsSafeError("helper-failed", "invalid root verification result");
	}
	ensureNativeRootCurrentLegacy(root, binding);
}
function rootVerificationError(code, message, errno) {
	const error = Object.assign(new Error(message), {
		code,
		...typeof errno === "number" ? { errno } : {}
	});
	return code === "path-mismatch" || code === "OBSERVATION_REDIRECTED" ? new FsSafeError("path-mismatch", "root identity changed during verification", { cause: error }) : error;
}
function ensureNativeRootCurrentLegacy(root, binding) {
	const env_4 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		verifyMkdirDirectory(binding, __addDisposableResource$3(env_4, openExactNativeRootSync(binding, {
			rootPath: root.rootReal,
			rootIdentity: root.rootIdentity
		}), false).fd, root.rootReal);
		assertRootIdentityCurrentSync(root);
	} catch (e_4) {
		env_4.error = e_4;
		env_4.hasError = true;
	} finally {
		__disposeResources$3(env_4);
	}
}
function mkdirNativeRootChild(params) {
	const env_5 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
		if (!binding?.openBeneath || !binding.mkdirChildBeneath) return unavailable$1();
		const rootOwner = __addDisposableResource$3(env_5, openExactNativeRootSync(binding, {
			rootPath: params.root.rootReal,
			rootIdentity: params.root.rootIdentity
		}), false);
		verifyMkdirDirectory(binding, rootOwner.fd, params.root.rootReal);
		const flags = (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0) | (fs.constants.O_NOFOLLOW ?? 0);
		const name = path.basename(params.target);
		const child = binding.mkdirOpenChildBeneath ? binding.mkdirOpenChildBeneath(rootOwner.fd, name, 511, flags).fd : (binding.mkdirChildBeneath(rootOwner.fd, name, 511), binding.openBeneath(rootOwner.fd, name, flags).fd);
		const close = captureNativeFdClose(binding);
		__addDisposableResource$3(env_5, { [Symbol.dispose]() {
			close(child);
		} }, false);
		assertRootIdentityCurrentSync(params.root);
		verifyMkdirDirectory(binding, child, params.target);
		verifyMkdirDirectory(binding, rootOwner.fd, params.root.rootReal);
	} catch (e_5) {
		env_5.error = e_5;
		env_5.hasError = true;
	} finally {
		__disposeResources$3(env_5);
	}
}
async function tryOpenCreateRootNative(params) {
	const binding = getNativeBinding("openBeneath", "mkdirChildBeneath", "removeStagedFile", "openCreateBeneath");
	if (!binding?.removeStagedFile || !binding.openCreateBeneath) return unavailable$1();
	const access = params.existingFlags & fs.constants.O_RDWR ? 384 : 128;
	if (typeof params.mode !== "number") throw Object.assign(/* @__PURE__ */ new TypeError("mode must be a number"), { code: "ERR_INVALID_ARG_TYPE" });
	if (!Number.isInteger(params.mode) || params.mode < 0 || params.mode > 4294967295) throw Object.assign(/* @__PURE__ */ new RangeError("mode must be an unsigned 32-bit integer"), { code: "ERR_OUT_OF_RANGE" });
	const creationMode = () => {
		const mask = process.umask();
		const desired = params.mode & 4095 & ~mask;
		return (desired & access) === access ? desired : void 0;
	};
	if (creationMode() === void 0) return unavailable$1();
	return await withNativeDirectory(params, async (binding, parent, assertCurrent) => {
		const env_6 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			params.assertBeforeMutation?.();
			assertCurrent();
			if (creationMode() === void 0) throw new FsSafeError("helper-unavailable", "native creation cannot preserve the requested permissions during handoff");
			const close = captureNativeFdClose(binding);
			let fd;
			try {
				fd = binding.openCreateBeneath(parent, path.basename(params.target), params.flags, params.mode & 4095);
			} catch (error) {
				if (hasNodeErrorCode(error, "EEXIST") && typeof error === "object" && error !== null) nativeCreateCollisions.add(error);
				throw error;
			}
			let rawOpen = true;
			const closeRaw = () => {
				if (rawOpen) {
					rawOpen = false;
					close(fd);
				}
			};
			__addDisposableResource$3(env_6, { [Symbol.dispose]: closeRaw }, false);
			try {
				const identity = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }));
				if (!identity.isFile() || identity.nlink !== 1n) throw new FsSafeError("path-mismatch", "created file changed");
				if (process.platform !== "win32" && (Number(identity.mode) & access) !== access) throw new FsSafeError("helper-unavailable", "created permissions do not permit a FileHandle handoff");
				assertCurrent();
				const handle = await fs$1.open(params.target, params.existingFlags);
				let validatedHandle = false;
				try {
					inspectFileIdentitySync(() => fs.fstatSync(handle.fd, { bigint: true }), identity);
					validatedHandle = true;
					assertCurrent();
					closeRaw();
					const retainedParent = binding.openBeneath(parent, "", (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0)).fd;
					let held = true;
					return {
						handle,
						async cleanupCreated() {
							if (!held) return;
							inspectFileIdentitySync(() => fs.fstatSync(handle.fd, { bigint: true }), identity);
							binding.removeStagedFile(retainedParent, path.basename(params.target), handle.fd);
						},
						releaseCreationParent() {
							if (!held) return;
							held = false;
							close(retainedParent);
						}
					};
				} catch (error) {
					if (!rawOpen && validatedHandle) try {
						binding.removeStagedFile(parent, path.basename(params.target), handle.fd);
					} catch {}
					await handle.close();
					throw error;
				}
			} catch (error) {
				if (rawOpen) try {
					binding.removeStagedFile(parent, path.basename(params.target), fd);
				} catch {}
				throw error;
			}
		} catch (e_6) {
			env_6.error = e_6;
			env_6.hasError = true;
		} finally {
			__disposeResources$3(env_6);
		}
	}, async (created) => {
		const env_7 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			__addDisposableResource$3(env_7, created.handle, true);
			__addDisposableResource$3(env_7, { [Symbol.dispose]: created.releaseCreationParent }, false);
			await created.cleanupCreated();
		} catch (e_7) {
			env_7.error = e_7;
			env_7.hasError = true;
		} finally {
			const result_2 = __disposeResources$3(env_7);
			if (result_2) await result_2;
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-policy.js
const PATH_ALIAS_POLICIES = ROOT_PATH_ALIAS_POLICIES;
async function assertNoPathAliasEscape(params) {
	const resolved = await resolveRootPath({
		absolutePath: params.absolutePath,
		rootPath: params.rootPath,
		boundaryLabel: params.boundaryLabel,
		policy: params.policy
	});
	if (params.policy?.allowFinalSymlinkForUnlink === true && resolved.kind === "symlink") return;
	await assertNoHardlinkedFinalPath({
		filePath: resolved.canonicalPath,
		root: resolved.rootPath,
		boundaryLabel: params.boundaryLabel,
		allowFinalHardlinkForUnlink: params.policy?.allowFinalHardlinkForUnlink
	});
}
async function assertNoHardlinkedFinalPath(params) {
	if (params.allowFinalHardlinkForUnlink) return;
	const filePath = params.filePath;
	const root = params.root;
	const boundaryLabel = params.boundaryLabel;
	assertNoWindowsPathAlias(filePath);
	let stat;
	try {
		stat = fs.statSync(filePath);
	} catch (err) {
		if (isNotFoundPathError(err)) return;
		throw err;
	}
	if (!stat.isFile()) return;
	if (stat.nlink > 1) throw new Error(`Hardlinked path is not allowed under ${boundaryLabel} (${shortPath(root)}): ${shortPath(filePath)}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-mode.js
async function inheritWriteTargetMode(params) {
	try {
		const admittedTarget = admitPathInsideRoot({
			rootPath: params.rootWithSep,
			candidatePath: params.targetPath,
			rootIdentity: params.rootIdentity
		});
		if (!admittedTarget) throw outsideWorkspaceError();
		const targetPath = admittedTarget.path;
		const existing = await inspectFileIdentity(() => fs.lstatSync(targetPath, { bigint: true }));
		if (existing.isSymbolicLink()) throw new FsSafeError("path-alias", "path alias escape blocked");
		if (!existing.isFile()) throw new FsSafeError("not-file", "not a file");
		if (existing.nlink > 1n) throw hardlinkedPathNotAllowedError();
		const handle = await fs$1.open(targetPath, resolveReadOpenFlags());
		try {
			await inspectFileIdentity(() => fs.fstatSync(handle.fd, { bigint: true }), existing);
		} finally {
			await handle.close().catch(() => void 0);
		}
		try {
			const observedRealPath = realpathSync$1.native(targetPath);
			const admittedRealPath = admitPathInsideRoot({
				rootPath: params.rootWithSep,
				candidatePath: observedRealPath,
				rootIdentity: params.rootIdentity
			});
			if (!admittedRealPath) throw outsideWorkspaceError();
			const realPath = admittedRealPath.path;
			await inspectFileIdentity(async () => {
				const current = fs.statSync(realPath, { bigint: true });
				if (!current.isFile()) throw new FsSafeError("not-file", "not a file");
				if (current.nlink > 1n) throw hardlinkedPathNotAllowedError();
				return current;
			}, existing);
		} catch (error) {
			if (isNotFoundPathError(error)) throw new FsSafeError("path-mismatch", "write target changed during mode inheritance", { cause: error });
			throw error;
		}
		return params.requestedMode ?? Number(existing.mode & 511n);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		return params.requestedMode ?? 384;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/guarded-mkdir.js
function sameDirectoryFacts(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.nlink === right.nlink;
}
function isDirectoryCollision(error) {
	return hasNodeErrorCode(error, "EEXIST") || error instanceof FsSafeError && error.code === "already-exists";
}
function inspectGuardCurrent(parent) {
	const stat = inspectDirectoryIdentitySync(parent.dir, parent.stat);
	if (realpathSync$1.native(parent.dir) !== parent.realPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
	return stat;
}
function observedGuard(parent) {
	return checkedMutationDirectory(parent.dir, parent.realPath, parent.stat);
}
function createdDirectoryEvidence(admission, parent, childPath) {
	try {
		const parentAfter = inspectGuardCurrent(parent);
		const childBefore = inspectDirectoryIdentitySync(childPath);
		const realPath = realpathSync$1.native(childPath);
		if (realPath !== childPath) return void 0;
		const childAfter = inspectDirectoryIdentitySync(childPath, childBefore);
		if (!sameDirectoryFacts(childBefore, childAfter)) return void 0;
		const child = checkedMutationDirectory(childPath, realPath, childAfter);
		const receipt = Object.freeze({
			admission,
			parent: checkedMutationDirectory(parent.dir, parent.realPath, parentAfter),
			child
		});
		return Object.freeze({
			receipt,
			guard: Object.freeze({
				dir: childPath,
				realPath,
				stat: childAfter
			})
		});
	} catch {
		return;
	}
}
function captureExactDirectoryGuard(dir) {
	return captureDirectoryGuard(dir, "native", { bigint: true });
}
function suppliedExactRootIdentity(identity) {
	return typeof identity?.dev === "bigint" && typeof identity.ino === "bigint" ? {
		dev: identity.dev,
		ino: identity.ino
	} : void 0;
}
function assertGuardMatchesRootIdentity(guard, expected) {
	if (guard.stat.dev !== expected.dev || guard.stat.ino !== expected.ino) throw rootPathChangedError();
}
function isPromiseLike(value) {
	return typeof value?.then === "function";
}
function realpathOrThrowNotFile(target) {
	try {
		const canonical = realpathSync$1.native(pathForWindowsFilesystem(target));
		assertNoWindowsPathAlias(canonical, "filesystem", "canonical directory uses a Windows filesystem namespace alias");
		return resolvePathPreservingWindowsRoot(canonical);
	} catch (error) {
		if (isNotFoundPathError(error)) throw directoryComponentNotDirectoryError(error instanceof Error ? error : void 0);
		throw error;
	}
}
/**
* Guard each component from rootReal to targetPath; optionally create missing ones.
* Returns the resolved path: use it, rather than the lexical input, for later guards.
*/
async function mkdirPathComponentsWithGuards(params) {
	const rawRootReal = params.rootReal;
	assertNoWindowsPathAlias(rawRootReal, "filesystem", "root directory uses a Windows filesystem namespace alias");
	const rawTargetPath = params.targetPath;
	assertNoWindowsPathAlias(rawTargetPath, "filesystem", "target directory uses a Windows filesystem namespace alias");
	const root = resolvePathPreservingWindowsRoot(rawRootReal);
	const target = resolvePathPreservingWindowsRoot(rawTargetPath);
	const suppliedIdentity = suppliedExactRootIdentity(params.rootIdentity);
	const configuredRootGuard = captureExactDirectoryGuard(root);
	const checkedRootIdentity = suppliedIdentity ?? {
		dev: configuredRootGuard.stat.dev,
		ino: configuredRootGuard.stat.ino
	};
	assertGuardMatchesRootIdentity(configuredRootGuard, checkedRootIdentity);
	assertNoWindowsPathAlias(configuredRootGuard.realPath);
	const rootCanonical = resolvePathPreservingWindowsRoot(configuredRootGuard.realPath);
	const rootGuard = rootCanonical === root ? configuredRootGuard : captureExactDirectoryGuard(rootCanonical);
	assertGuardMatchesRootIdentity(rootGuard, checkedRootIdentity);
	const admissionParams = {
		candidatePath: target,
		rootIdentity: checkedRootIdentity
	};
	const admittedTarget = admitPathInsideRoot({
		rootPath: root,
		...admissionParams
	}) ?? (rootCanonical === root ? void 0 : admitPathInsideRoot({
		rootPath: rootCanonical,
		...admissionParams
	}));
	if (!admittedTarget || isPathRelativeEscape(admittedTarget.relativePath)) throw new FsSafeError("outside-workspace", "directory is outside workspace root");
	let current = rootCanonical;
	let currentGuard = rootGuard;
	const parts = admittedTarget.relativePath.split(path.sep).filter(Boolean);
	let partRoute;
	let retainedTargetPath = params.retainedTargetPath && sameAbsolutePath(path.dirname(params.retainedTargetPath), target) ? params.retainedTargetPath : void 0;
	let retainedParentPath = retainedTargetPath ? path.dirname(retainedTargetPath) : void 0;
	for (let index = 0; index < parts.length; index += 1) {
		const part = parts[index];
		const next = path.join(current, part);
		const parentGuard = currentGuard;
		assertNoWindowsPathAlias(parentGuard.realPath, "filesystem", "canonical parent directory uses a Windows filesystem namespace alias");
		let created = false;
		let createReceipt;
		if (!params.revalidateParentAfterBeforeComponent) assertDirectoryGuard(parentGuard, "native");
		if (params.beforeComponent) await params.beforeComponent(next);
		if (params.revalidateParentAfterBeforeComponent) assertDirectoryGuard(parentGuard, "native");
		let shouldCreate = true;
		if (params.beforeCreateComponent) {
			let missing = false;
			try {
				fs.lstatSync(next);
			} catch (error) {
				if (!isNotFoundPathError(error)) throw error;
				missing = true;
			}
			shouldCreate = missing;
			if (missing) {
				let prospectiveParent = retainedParentPath;
				if (!prospectiveParent) {
					partRoute ??= createPathSegmentRoute(parts);
					prospectiveParent = joinPathSegmentRoute(next, partRoute, index + 1);
				}
				const authorization = params.beforeCreateComponent(next, prospectiveParent, retainedTargetPath, observedGuard(parentGuard));
				if (isPromiseLike(authorization)) {
					createReceipt = await authorization;
					assertDirectoryGuard(parentGuard, "native");
				} else {
					createReceipt = authorization;
					if (!params.synchronousAuthorizationIncludesFence) inspectGuardCurrent(parentGuard);
				}
			}
		}
		if (shouldCreate && params.createMissing !== false) {
			params.assertBeforeMutation?.();
			inspectGuardCurrent(parentGuard);
			try {
				if (params.private) await createDirectoryWithAdmission(next, {
					private: true,
					mode: params.mode,
					assertBeforeMutation: params.assertBeforeMutation
				}, { expectedParentIdentity: {
					dev: parentGuard.stat.dev,
					ino: parentGuard.stat.ino,
					realPath: parentGuard.realPath
				} });
				else if (params.synchronousMkdir) fs.mkdirSync(next, { mode: params.mode });
				else await fs$1.mkdir(next, { mode: params.mode });
				created = true;
			} catch (error) {
				if (!isDirectoryCollision(error)) throw error;
			}
		}
		let createdAuthorization;
		let createdEvidence;
		if (created && createReceipt && params.afterCreateComponent) {
			createdEvidence = createdDirectoryEvidence(createReceipt, parentGuard, next);
			if (createdEvidence) createdAuthorization = params.afterCreateComponent(createdEvidence.receipt);
		}
		if (params.beforeUseComponent && !createdAuthorization) {
			let prospectiveParent = retainedParentPath;
			if (!prospectiveParent) {
				partRoute ??= createPathSegmentRoute(parts);
				prospectiveParent = joinPathSegmentRoute(next, partRoute, index + 1);
			}
			await params.beforeUseComponent(next, prospectiveParent, retainedTargetPath);
			assertDirectoryGuard(parentGuard, "native");
		}
		const stat = createdAuthorization ? void 0 : fs.lstatSync(next);
		if (stat && (params.rejectSymlinks && stat.isSymbolicLink() || !stat.isSymbolicLink() && !stat.isDirectory())) throw directoryComponentNotDirectoryError();
		const nextReal = createdAuthorization && createdEvidence ? createdEvidence.receipt.child.canonicalPath : realpathOrThrowNotFile(next);
		const admittedNextReal = admitPathInsideRoot({
			rootPath: rootCanonical,
			candidatePath: nextReal,
			rootIdentity: checkedRootIdentity
		});
		if (!admittedNextReal) throw new FsSafeError("outside-workspace", "directory escaped workspace root");
		const admittedNextPath = admittedNextReal.path;
		if (stat?.isSymbolicLink()) {
			if (!fs.statSync(admittedNextPath).isDirectory()) throw directoryComponentNotDirectoryError();
			currentGuard = captureExactDirectoryGuard(admittedNextPath);
			assertNoWindowsPathAlias(currentGuard.realPath, "filesystem", "canonical directory uses a Windows filesystem namespace alias");
			assertDirectoryGuard(parentGuard, "native");
			retainedTargetPath = void 0;
			retainedParentPath = void 0;
			current = admittedNextPath;
			continue;
		}
		if (createdAuthorization && createdEvidence) currentGuard = createdEvidence.guard;
		else currentGuard = captureExactDirectoryGuard(admittedNextPath);
		assertNoWindowsPathAlias(currentGuard.realPath, "filesystem", "canonical directory uses a Windows filesystem namespace alias");
		if (!createdAuthorization || !createdEvidence) assertDirectoryGuard(parentGuard, "native");
		current = admittedNextPath;
	}
	return current;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-directory-creation.js
function mutationWalkOptions(mutationAdmission, operationTarget, assertBeforeMutation, rootPath, targetPath) {
	const session = canReuseParentWithMutationAssertion(assertBeforeMutation, rootPath, targetPath) ? mutationAdmission.beginSharedParentWalk?.() : void 0;
	return {
		dispose: () => session?.dispose(),
		options: {
			rejectSymlinks: mutationAdmission.rejectParentSymlinks,
			revalidateParentAfterBeforeComponent: true,
			retainedTargetPath: session?.retainedTargetPath,
			synchronousAuthorizationIncludesFence: session !== void 0,
			afterCreateComponent: session?.advanceCreatedDirectory,
			beforeCreateComponent: (componentPath, prospectiveDirectory, retainedTargetPath, parent) => {
				const targetPath = retainedTargetPath ?? operationTarget(prospectiveDirectory);
				const request = Object.freeze({
					targetPath,
					mutationPath: componentPath,
					phase: "parent-create"
				});
				return session?.tryAuthorizeAtParent(request, parent) ?? session?.authorize(request) ?? mutationAdmission.authorize(request);
			},
			beforeUseComponent: async (_componentPath, prospectiveDirectory, retainedTargetPath) => {
				const targetPath = retainedTargetPath ?? operationTarget(prospectiveDirectory);
				const request = Object.freeze({
					targetPath,
					mutationPath: targetPath,
					phase: "parent"
				});
				await (session?.authorize(request) ?? mutationAdmission.authorize(request));
			}
		}
	};
}
/**
* Complete the common Root.mkdir case with one exact existing parent. This is
* optional evidence: every uncertain probe returns to the ordered root walk.
*/
async function tryMkdirAtExactParent(root, targetPath, mutationAdmission) {
	if (getFsSafeTestHooks()?.beforeRootFallbackMutation) return false;
	if (typeof root.rootIdentity.dev !== "bigint" || typeof root.rootIdentity.ino !== "bigint" || root.rootIdentity.dev === 0n || root.rootIdentity.ino === 0n) return false;
	const rootIdentity = Object.freeze({
		dev: root.rootIdentity.dev,
		ino: root.rootIdentity.ino
	});
	const session = mutationAdmission.beginSharedParentWalk?.();
	if (!session) return false;
	try {
		if (path.resolve(session.retainedTargetPath) !== path.resolve(targetPath)) return false;
		const parentPath = path.dirname(targetPath);
		let parentGuard;
		try {
			parentGuard = await createAsyncDirectoryGuard(parentPath, { bigint: true });
		} catch {
			return false;
		}
		try {
			fs.lstatSync(targetPath, { bigint: true });
			return false;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) return false;
		}
		const admittedParent = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: parentPath,
			rootIdentity
		});
		if (admittedParent?.admission !== "exact" || admittedParent.path !== parentPath || parentGuard.realPath !== parentPath) return false;
		await session.authorize(Object.freeze({
			targetPath,
			mutationPath: targetPath,
			phase: "parent"
		}));
		await assertAsyncDirectoryGuard(parentGuard);
		try {
			fs.lstatSync(targetPath, { bigint: true });
			return false;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) return false;
		}
		assertSyncDirectoryGuard(parentGuard);
		const createAdmission = session.tryAuthorizeAtParent(Object.freeze({
			targetPath,
			mutationPath: targetPath,
			phase: "parent-create"
		}), checkedMutationDirectory(parentPath, parentGuard.realPath, parentGuard.stat));
		if (!createAdmission) return false;
		try {
			await fs$1.mkdir(targetPath);
		} catch (error) {
			if (hasNodeErrorCode(error, "EEXIST")) return false;
			throw error;
		}
		const observeCreated = async () => {
			const childGuard = await createAsyncDirectoryGuard(targetPath, { bigint: true });
			const parentAfter = inspectDirectoryIdentitySync(parentPath, parentGuard.stat);
			assertDirectoryIdentitySync(root.rootReal, rootIdentity);
			const admittedChild = admitPathInsideRoot({
				rootPath: root.rootReal,
				candidatePath: childGuard.realPath,
				rootIdentity
			});
			if (childGuard.realPath !== targetPath || childGuard.dir !== targetPath || admittedChild?.admission !== "exact" || admittedChild.path !== targetPath) throw new FsSafeError("path-mismatch", "created directory changed during operation");
			return {
				childGuard,
				parentAfter
			};
		};
		try {
			const created = await observeCreated();
			if (session.advanceCreatedDirectory(Object.freeze({
				admission: createAdmission,
				parent: checkedMutationDirectory(parentPath, parentGuard.realPath, created.parentAfter),
				child: checkedMutationDirectory(targetPath, created.childGuard.realPath, created.childGuard.stat)
			}))) return true;
		} catch {}
		await session.authorize(Object.freeze({
			targetPath,
			mutationPath: targetPath,
			phase: "parent"
		}));
		await assertAsyncDirectoryGuard(parentGuard);
		assertDirectoryIdentitySync(root.rootReal, rootIdentity);
		assertFinalSymlinkRejected(targetPath, true);
		const refreshed = await observeCreated();
		await assertAsyncDirectoryGuard(parentGuard);
		await assertAsyncDirectoryGuard(refreshed.childGuard);
		assertDirectoryIdentitySync(root.rootReal, rootIdentity);
		return true;
	} finally {
		session.dispose();
	}
}
async function prepareRootWriteTarget(root, targetPath, assertBeforeMutation, mutationAdmission, privateMode = false) {
	const basename = path.basename(targetPath);
	const baseParams = {
		rootReal: root.rootReal,
		rootIdentity: root.rootIdentity,
		targetPath: path.dirname(targetPath),
		assertBeforeMutation,
		private: privateMode,
		mode: privateMode ? 448 : void 0
	};
	const mutationWalk = mutationAdmission ? mutationWalkOptions(mutationAdmission, (prospectiveParent) => path.join(prospectiveParent, basename), assertBeforeMutation, root.rootReal, targetPath) : void 0;
	let parentPath;
	try {
		parentPath = await mkdirPathComponentsWithGuards(mutationWalk ? {
			...baseParams,
			...mutationWalk.options
		} : baseParams);
	} finally {
		mutationWalk?.dispose();
	}
	return path.join(parentPath, basename);
}
async function mkdirPathFallback(root, resolved, assertBeforeMutation, rejectSymlinks = false, mutationAdmission, privateMode = false) {
	const baseParams = {
		rootReal: resolved.rootReal,
		targetPath: resolved.resolved,
		assertBeforeMutation,
		rootIdentity: root.rootIdentity,
		synchronousMkdir: !privateMode && !mutationAdmission && !assertBeforeMutation && !getFsSafeTestHooks()?.beforeRootFallbackMutation,
		rejectSymlinks,
		private: privateMode,
		mode: privateMode ? 448 : void 0,
		beforeComponent: getFsSafeTestHooks()?.beforeRootFallbackMutation ? (componentPath) => getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", componentPath) : void 0
	};
	const mutationWalk = mutationAdmission ? mutationWalkOptions(mutationAdmission, (prospectiveDirectory) => prospectiveDirectory, assertBeforeMutation, root.rootReal, resolved.resolved) : void 0;
	try {
		const directory = await mkdirPathComponentsWithGuards(mutationWalk ? {
			...baseParams,
			...mutationWalk.options,
			rejectSymlinks: rejectSymlinks || mutationAdmission.rejectParentSymlinks
		} : baseParams);
		if (privateMode) {
			const guard = await createAsyncDirectoryGuard(directory, { bigint: true });
			await assertPrivateDirectory(directory);
			await assertAsyncDirectoryGuard(guard);
			await assertRootIdentityCurrent(root);
		}
	} finally {
		mutationWalk?.dispose();
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-complete-parent.js
function writeSelectionChanged(cause) {
	return new FsSafeError("path-mismatch", "write target changed during operation", errorCauseOptions(cause));
}
function ordinarySharedWriteRoute(root, relativePath, operationTargetPath) {
	if (process.versions.bun || relativePath === "" || relativePath.startsWith("~") || relativePath.includes("\0") || path.isAbsolute(relativePath)) return false;
	if (process.platform === "win32") {
		if (!ordinaryWindowsSegments(relativePath)) return false;
	} else if (relativePath.includes("\\") || relativePath.split("/").some((segment) => segment === "" || segment === "." || segment === "..")) return false;
	const routed = path.resolve(root.rootReal, relativePath);
	const admitted = admitPathInsideRoot({
		rootPath: root.rootReal,
		candidatePath: routed,
		rootIdentity: root.rootIdentity
	});
	return admitted?.admission === "exact" && sameNormalizedPathSpelling(admitted.path, routed) && sameNormalizedPathSpelling(routed, operationTargetPath);
}
function deoptPreparationFailure(error) {
	if (error instanceof FsSafeError && error.code === "path-mismatch") throw error;
}
function capturePreparedTargetObservation(targetPath) {
	let stat;
	try {
		stat = inspectFileIdentitySync(() => fs.lstatSync(targetPath, { bigint: true }));
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return Object.freeze({ exists: false });
		return deoptPreparationFailure(error);
	}
	if (stat.isSymbolicLink()) return void 0;
	let realPath;
	try {
		realPath = realpathSync$1.native(targetPath);
	} catch (error) {
		return deoptPreparationFailure(error);
	}
	if (!sameNormalizedPathSpelling(realPath, targetPath)) return void 0;
	return Object.freeze({
		exists: true,
		stat
	});
}
function samePreparedTargetFacts(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.nlink === right.nlink;
}
function assertPreparedTargetCurrent(prepared) {
	if (!prepared.target.exists) {
		try {
			fs.lstatSync(prepared.selectedTargetPath, { bigint: true });
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw writeSelectionChanged(error);
		}
		throw writeSelectionChanged();
	}
	try {
		const current = inspectFileIdentitySync(() => fs.lstatSync(prepared.selectedTargetPath, { bigint: true }), prepared.target.stat);
		if (current.isSymbolicLink() || !samePreparedTargetFacts(prepared.target.stat, current)) throw writeSelectionChanged();
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw error;
		throw writeSelectionChanged(error);
	}
}
function assertPreparedRootWriteParentCurrent(prepared, verifyTarget = false) {
	try {
		if (getFsSafeNativeConfig().mode !== prepared.nativeMode) throw writeSelectionChanged();
		if (!sameNormalizedPathSpelling(prepared.parentGuard.dir, prepared.rootPath)) assertDirectoryIdentitySync(prepared.rootPath, prepared.rootIdentity);
		else if (prepared.parentGuard.stat.dev !== prepared.rootIdentity.dev || prepared.parentGuard.stat.ino !== prepared.rootIdentity.ino) throw writeSelectionChanged();
		const parent = inspectDirectoryIdentitySync(prepared.parentGuard.dir, prepared.parentGuard.stat);
		if (parent.mode !== prepared.parentGuard.stat.mode || parent.nlink !== prepared.parentGuard.stat.nlink || !sameNormalizedPathSpelling(realpathSync$1.native(prepared.parentGuard.dir), prepared.parentGuard.realPath)) throw writeSelectionChanged();
		if (verifyTarget) assertPreparedTargetCurrent(prepared);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw error;
		throw writeSelectionChanged(error);
	}
}
async function prepareCompleteRootWriteParent(root, guarded, relativePath) {
	if (!guarded.mutationAdmission || !guarded.selectedTargetAdmission || typeof root.rootIdentity.dev !== "bigint" || typeof root.rootIdentity.ino !== "bigint" || !ordinarySharedWriteRoute(root, relativePath, guarded.targetPath) || !sameNormalizedPathSpelling(guarded.resolvedPath.resolved, guarded.targetPath)) return void 0;
	const parentPath = path.dirname(guarded.targetPath);
	const admittedParent = admitPathInsideRoot({
		rootPath: root.rootReal,
		candidatePath: parentPath,
		rootIdentity: root.rootIdentity
	});
	if (admittedParent?.admission !== "exact" || !sameNormalizedPathSpelling(admittedParent.path, parentPath)) return void 0;
	let parentGuard;
	try {
		parentGuard = await createAsyncDirectoryGuard(parentPath, { bigint: true });
	} catch (error) {
		return deoptPreparationFailure(error);
	}
	if (!sameNormalizedPathSpelling(parentGuard.dir, parentPath) || !sameNormalizedPathSpelling(parentGuard.realPath, parentPath)) return void 0;
	const target = capturePreparedTargetObservation(guarded.targetPath);
	if (!target) return void 0;
	return Object.freeze({
		operationTargetPath: guarded.targetPath,
		selectedTargetPath: guarded.targetPath,
		parentGuard,
		rootPath: root.rootReal,
		rootIdentity: Object.freeze({
			dev: root.rootIdentity.dev,
			ino: root.rootIdentity.ino
		}),
		nativeMode: getFsSafeNativeConfig().mode,
		target
	});
}
async function prepareSharedRootWriteTarget(root, params) {
	const { guardedTarget } = params;
	const resolvedPath = guardedTarget.resolvedPath.resolved;
	const mutationAdmission = guardedTarget.mutationAdmission;
	const beforeParentAdmission = mutationAdmission ? getFsSafeTestHooks()?.beforePinnedWriteParentAdmission : void 0;
	if (mutationAdmission) await beforeParentAdmission?.(resolvedPath);
	const preparedParent = params.mkdir !== false && canReuseParentWithMutationAssertion(params.assertBeforeMutation, root.rootReal, guardedTarget.targetPath) && beforeParentAdmission === void 0 ? await prepareCompleteRootWriteParent(root, guardedTarget, params.relativePath) : void 0;
	return {
		targetPath: params.mkdir === false ? guardedTarget.targetPath : preparedParent?.selectedTargetPath ?? await prepareRootWriteTarget(root, resolvedPath, params.assertBeforeMutation, mutationAdmission),
		mutationAdmission,
		preparedParent
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-admission.js
function createRootWriteSelectionForFd(selection, fd) {
	const stat = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }));
	return Object.freeze({
		...selection,
		identity: Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		})
	});
}
function inspectRegularSelectionPath(pathname, expected, follow) {
	let observed;
	try {
		observed = inspectFileIdentitySync(() => follow ? fs.statSync(pathname, { bigint: true }) : fs.lstatSync(pathname, { bigint: true }), expected);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw error;
		throw writeSelectionChanged(error);
	}
	if (!follow && observed.isSymbolicLink() || !observed.isFile()) throw writeSelectionChanged();
	if (observed.nlink > 1n) throw hardlinkedPathNotAllowedError();
	return observed;
}
function inspectSelectionBindingSync(root, selection, fd) {
	inspectRegularSelectionPath(selection.selectedPath, selection.identity, false);
	if (!sameNormalizedPathSpelling(selection.operationTargetPath, selection.selectedPath)) {
		let operationRealPath;
		try {
			operationRealPath = realpathSync$1.native(selection.operationTargetPath);
		} catch (error) {
			throw writeSelectionChanged(error);
		}
		const admitted = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: operationRealPath,
			rootIdentity: root.rootIdentity
		});
		if (!admitted) throw outsideWorkspaceError();
		inspectRegularSelectionPath(admitted.path, selection.identity, true);
	}
	if (fd !== void 0) try {
		inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), selection.identity);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw error;
		throw writeSelectionChanged(error);
	}
}
function assertRootWritePathSelectionSync(root, selection) {
	if (!sameNormalizedPathSpelling(selection.operationTargetPath, selection.selectedPath)) {
		let operationRealPath;
		try {
			operationRealPath = realpathSync$1.native(selection.operationTargetPath);
		} catch (error) {
			throw writeSelectionChanged(error);
		}
		const admitted = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: operationRealPath,
			rootIdentity: root.rootIdentity
		});
		if (!admitted) throw outsideWorkspaceError();
		const selected = inspectRegularSelectionPath(selection.selectedPath, void 0, false);
		inspectRegularSelectionPath(admitted.path, selected, true);
	}
	assertSyncDirectoryGuard(selection.parentGuard);
}
function assertRootWriteSelectionSync(root, selection, fd) {
	inspectSelectionBindingSync(root, selection, fd);
	assertSyncDirectoryGuard(selection.parentGuard);
}
async function authorizeRootWritePathSelection(selection, afterAwait) {
	const selectedAdmissionPending = !sameNormalizedPathSpelling(selection.operationTargetPath, selection.selectedPath);
	await selection.mutationAdmission.authorize(Object.freeze({
		targetPath: selection.operationTargetPath,
		mutationPath: selection.operationTargetPath,
		phase: "parent"
	}));
	afterAwait?.(selectedAdmissionPending);
	if (selectedAdmissionPending) {
		await selection.selectedTargetAdmission.authorize(selection.selectedPath);
		afterAwait?.(false);
	}
}
async function prepareRootWritePathSelection(params) {
	const { preparedParent, ...selectionParams } = params;
	if (preparedParent && (!sameNormalizedPathSpelling(preparedParent.operationTargetPath, params.operationTargetPath) || !sameNormalizedPathSpelling(preparedParent.parentGuard.dir, path.dirname(params.operationTargetPath)))) throw writeSelectionChanged();
	const selection = Object.freeze({
		...selectionParams,
		parentGuard: preparedParent?.parentGuard ?? await createAsyncDirectoryGuard(path.dirname(params.selectedPath), { bigint: true })
	});
	await authorizeRootWritePathSelection(selection, preparedParent ? (selectedAdmissionPending) => assertPreparedRootWriteParentCurrent(preparedParent, !selectedAdmissionPending) : void 0);
	if (preparedParent) {
		if (!sameNormalizedPathSpelling(preparedParent.selectedTargetPath, params.selectedPath)) throw writeSelectionChanged();
	} else await assertAsyncDirectoryGuard(selection.parentGuard);
	return selection;
}
async function prepareGuardedRootWritePathSelection(guarded, selectedPath, operationTargetPath = selectedPath, preparedParent) {
	if (!guarded?.mutationAdmission) return void 0;
	if (!guarded.selectedTargetAdmission) throw writeSelectionChanged();
	return await prepareRootWritePathSelection({
		mutationAdmission: guarded.mutationAdmission,
		selectedTargetAdmission: guarded.selectedTargetAdmission,
		operationTargetPath,
		selectedPath,
		preparedParent
	});
}
async function refreshRootWritePathSelection(selection) {
	await authorizeRootWritePathSelection(selection);
	await assertAsyncDirectoryGuard(selection.parentGuard);
}
/**
* Re-authorize a retained shared-JavaScript destination without recapturing
* either its pathname binding or its exact parent fence.
*/
async function refreshRootWriteSelection(root, selection, fd) {
	await authorizeRootWritePathSelection(selection);
	inspectSelectionBindingSync(root, selection, fd);
	await assertAsyncDirectoryGuard(selection.parentGuard);
}
async function refreshRetainedRootWriteAdmission(root, selection, fd) {
	await getFsSafeTestHooks()?.beforePinnedWriteParentAdmission?.(selection.operationTargetPath);
	await refreshRootWriteSelection(root, selection, fd);
}
async function resolveGuardedWritePathInRoot(root, params) {
	const resolvedPath = await resolvePathInRoot(root, params.relativePath, {
		aliasErrorCode: "path-alias",
		rejectAmbiguousParents: true,
		allowFinalSymlink: params.allowFinalSymlink,
		...mutationSymlinkResolution(params.mutationSymlinks)
	});
	await assertMutationNotDenied(resolvedPath.resolved, params.denyMutations, params.protectDeniedAncestors ? { protectAncestors: true } : void 0);
	if (await (params.shouldAssertNoPathAlias?.(resolvedPath) ?? true)) try {
		await assertNoPathAliasEscape({
			absolutePath: resolvedPath.resolved,
			rootPath: resolvedPath.rootReal,
			boundaryLabel: "root"
		});
	} catch (error) {
		throw new FsSafeError("path-alias", "path alias escape blocked", errorCauseOptions(error));
	}
	return resolvedPath;
}
async function resolveGuardedWriteTargetInRoot(root, params) {
	const policy = params.denyMutations === void 0 && params.mutationSymlinks === void 0 ? void 0 : snapshotPinnedMutationPolicy(params.denyMutations, params.mutationSymlinks);
	const resolveCurrent = async () => await resolveGuardedWritePathInRoot(root, {
		...params,
		denyMutations: policy?.denyMutations,
		mutationSymlinks: policy?.mutationSymlinks
	});
	const resolvedPath = await resolveCurrent();
	if (!policy) return {
		resolvedPath,
		targetPath: resolvedPath.resolved
	};
	const relativeParent = path.relative(resolvedPath.rootReal, path.dirname(resolvedPath.resolved));
	const prepared = await preparePinnedWriteMutationAdmission({
		rootReal: resolvedPath.rootReal,
		rootIdentity: root.rootIdentity,
		resolvedTargetPath: resolvedPath.resolved,
		originalPath: params.relativePath,
		defaultRelativeParentPath: relativeParent ? relativeParent.split(path.sep).join(path.posix.sep) : "",
		policy,
		resolveCurrent
	});
	const selectedTargetAdmission = Object.freeze({ async authorize(selectedTargetPath) {
		const admitted = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: selectedTargetPath,
			rootIdentity: root.rootIdentity
		});
		if (!admitted) throw outsideWorkspaceError();
		await resolveGuardedWritePathInRoot(root, {
			relativePath: admitted.relativePath,
			denyMutations: policy.denyMutations,
			mutationSymlinks: policy.mutationSymlinks
		});
	} });
	return {
		resolvedPath,
		targetPath: path.join(resolvedPath.rootReal, ...prepared.relativeParentPath.split("/").filter(Boolean), path.basename(resolvedPath.resolved)),
		mutationAdmission: prepared.mutationAdmission,
		selectedTargetAdmission
	};
}
async function resolvePinnedWriteTargetInRoot(root, relativePath, requestedMode, denyMutations, overwrite = true, mutationSymlinks) {
	const policy = denyMutations === void 0 && mutationSymlinks === void 0 ? void 0 : snapshotPinnedMutationPolicy(denyMutations, mutationSymlinks);
	const resolveCurrent = policy ? async () => await resolveGuardedWritePathInRoot(root, {
		relativePath,
		denyMutations: policy.denyMutations,
		mutationSymlinks: policy.mutationSymlinks
	}) : void 0;
	const { rootReal, rootWithSep, resolved } = resolveCurrent ? await resolveCurrent() : await resolveGuardedWritePathInRoot(root, { relativePath });
	const relativeResolved = path.relative(rootReal, resolved);
	if (path.isAbsolute(relativeResolved)) throw outsideWorkspaceError();
	const relativePosix = relativeResolved ? relativeResolved.split(path.sep).join(path.posix.sep) : "";
	const basename = path.posix.basename(relativePosix);
	if (!basename || basename === "." || basename === "/") throw new FsSafeError("invalid-path", "invalid target path");
	if (!overwrite) try {
		const existing = fs.statSync(resolved, { throwIfNoEntry: false });
		if (existing) {
			if (!existing.isFile() && !existing.isDirectory()) throw new FsSafeError("not-file", "not a file");
			if (existing.isFile() && existing.nlink > 1) throw hardlinkedPathNotAllowedError();
			throw new FsSafeError("already-exists", "file already exists");
		}
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
	}
	const mode = overwrite ? await inheritWriteTargetMode({
		targetPath: resolved,
		rootWithSep,
		rootIdentity: root.rootIdentity,
		requestedMode
	}) : requestedMode ?? 384;
	let relativeParentPath = path.posix.dirname(relativePosix) === "." ? "" : path.posix.dirname(relativePosix);
	let mutationAdmission;
	if (policy) ({relativeParentPath, mutationAdmission} = await preparePinnedWriteMutationAdmission({
		rootReal,
		rootIdentity: root.rootIdentity,
		resolvedTargetPath: resolved,
		originalPath: relativePath,
		defaultRelativeParentPath: relativeParentPath,
		policy,
		resolveCurrent
	}));
	return {
		rootReal,
		targetPath: resolved,
		relativeParentPath,
		basename,
		mode,
		mutationAdmission
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-publication.js
function createCopyPublicationObserver(path, notify) {
	let rejected;
	return {
		onPublished(identity) {
			const receipt = Object.freeze({
				path,
				dev: identity.dev,
				ino: identity.ino
			});
			try {
				assertSynchronousCallbackResult(notify?.(receipt), "onDestinationPublished");
			} catch (error) {
				rejected = { error };
				throw error;
			}
		},
		rethrowObserverFailure(error) {
			if (rejected && (error === rejected.error || error instanceof FsSafeError && error.cause === rejected.error && error.details?.phase === "publish")) throw rejected.error;
		}
	};
}
const onCopyPublication = Symbol("onCopyPublication");
const onCopySourceAdmission = Symbol("onCopySourceAdmission");
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-pinned-write-windows.js
function closeWriteFd(closeFd, fd) {
	if (fd === void 0) return;
	try {
		closeFd(fd);
	} catch (error) {
		return { error };
	}
}
function readParentIdentity(parentFd, guard) {
	const stat = inspectFileIdentitySync(() => fs.fstatSync(parentFd, { bigint: true }));
	if (!stat.isDirectory() || !exactIdentityMatches(guard.stat, stat)) throw new FsSafeError("path-mismatch", "native write parent identity changed");
	return stat;
}
function assertNamedParentCurrent(binding, guard, identity) {
	if (typeof binding.observeDirectory === "function") try {
		if (inspectNativeDirectoryObservation(binding, guard.dir, identity).realPath !== guard.realPath) throw new FsSafeError("path-mismatch", "native write parent pathname changed");
		return;
	} catch (error) {
		if (error?.code !== "OBSERVATION_UNAVAILABLE") throw error;
	}
	assertSyncDirectoryGuard({
		...guard,
		stat: identity
	});
}
async function runPinnedWriteWindows(binding, params, root, parentFd, parentGuard) {
	assertNativeCapabilities(binding, "openBeneath", "renameNoReplace", "renameReplace", "fstatIdentity");
	const closeFd = captureNativeFdClose(binding);
	const parentPath = parentGuard.realPath;
	let tempFd;
	let privateHandle;
	let targetFd;
	let publicationProbeFd;
	let tempIdentity;
	let tempName = "";
	let renamed = false;
	let completed = false;
	const completeCreate = params.overwrite === false && params.input.kind !== "file" && params.input.stageBeforePublish === true;
	let receipt;
	let publication = Object.freeze({ status: "not-published" });
	let phase = "prepare";
	let failure;
	const closeTemp = async () => {
		const handle = privateHandle;
		const fd = tempFd;
		privateHandle = void 0;
		tempFd = void 0;
		if (handle) await handle.close();
		else if (fd !== void 0) closeFd(fd);
	};
	try {
		tempName = `.fs-safe-${randomUUID()}.tmp`;
		params.assertBeforeMutation?.();
		const copied = params.input.kind === "file" && !params.private ? await createNativeCopyFile(binding, params.input, parentFd, tempName, params.maxBytes) : void 0;
		if (params.private) {
			const parentIdentity = fs.fstatSync(parentFd, { bigint: true });
			privateHandle = await createFileHandle(path.join(parentPath, tempName), {
				private: true,
				mode: 384,
				assertBeforeMutation: params.assertBeforeMutation
			}, { expectedParentIdentity: {
				dev: parentIdentity.dev,
				ino: parentIdentity.ino,
				realPath: parentPath
			} });
			tempFd = privateHandle.fd;
		} else if (copied) tempFd = copied.fd;
		else tempFd = binding.openBeneath(parentFd, tempName, nativeOpenFlags(fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL)).fd;
		const verificationIdentity = inspectFileIdentitySync(() => fs.fstatSync(tempFd, { bigint: true }));
		tempIdentity = verificationIdentity;
		if (params.input.kind === "file") assertNativeCopyCompleted(params.input, copied);
		if ((verificationIdentity.mode & 128n) === 0n) fs.fchmodSync(tempFd, 384);
		if (!copied) await writePinnedInput(tempFd, params.input, params.maxBytes, params.assertBeforeMutation);
		if (params.input.kind === "file") restoreCopyMetadata(tempFd, params.input.metadata);
		if (params.sync !== false) {
			if (params.strictFileSync) fs.fsyncSync(tempFd);
			else syncFileBestEffortSync(tempFd);
		}
		if (params.input.kind === "file") await params.input.verifySource();
		if (completeCreate) {
			const parentIdentity = readParentIdentity(parentFd, parentGuard);
			receipt = createStagedFileReceipt(Object.freeze({
				path: parentGuard.dir,
				realPath: parentGuard.realPath,
				identity: Object.freeze({
					dev: parentIdentity.dev,
					ino: parentIdentity.ino
				})
			}), tempName, fs.fstatSync(tempFd, { bigint: true }));
		}
		phase = "publish";
		assertFinalSymlinkRejected(path.join(parentPath, params.basename), params.rejectFinalSymlink);
		params.assertBeforeMutation?.();
		if (params.assertBeforeMutation) {
			assertNamedParentCurrent(binding, parentGuard, readParentIdentity(parentFd, parentGuard));
			publicationProbeFd = binding.openBeneath(parentFd, tempName, nativeOpenFlags(fs.constants.O_RDONLY)).fd;
			const named = inspectFileIdentitySync(() => fs.fstatSync(publicationProbeFd, { bigint: true }), verificationIdentity);
			const retained = inspectFileIdentitySync(() => fs.fstatSync(tempFd, { bigint: true }), verificationIdentity);
			if (!named.isFile() || !retained.isFile() || named.nlink !== 1n || retained.nlink !== 1n) throw new FsSafeError("path-mismatch", "native write stage changed before publication");
			assertFinalSymlinkRejected(path.join(parentPath, params.basename), params.rejectFinalSymlink);
		}
		if (params.input.kind === "file") params.input.signal?.throwIfAborted();
		try {
			if (params.overwrite === false) binding.renameNoReplace(parentFd, tempName, parentFd, params.basename);
			else binding.renameReplace(parentFd, tempName, parentFd, params.basename);
		} catch (error) {
			if (completeCreate && classifyNativeRenameFailure(error) === "indeterminate") publication = Object.freeze({
				status: "indeterminate",
				basename: params.basename,
				overwrite: false
			});
			throw error;
		}
		renamed = true;
		if (receipt) publication = Object.freeze({
			status: "published",
			staged: receipt,
			basename: params.basename,
			overwrite: false
		});
		params.onPublished?.(verificationIdentity);
		const metadataOnly = params.overwrite === false && params.input.kind === "buffer" && params.input.stageBeforePublish !== false && !params.private && !params.assertBeforeMutation && binding.openPublicationMetadata;
		targetFd = metadataOnly ? metadataOnly(parentFd, params.basename) : binding.openBeneath(parentFd, params.basename, nativeOpenFlags(fs.constants.O_RDONLY)).fd;
		const targetStat = inspectFileIdentitySync(() => fs.fstatSync(targetFd, { bigint: true }), verificationIdentity);
		if (!targetStat.isFile()) throw new FsSafeError("path-mismatch", "native write target changed after rename");
		const modeChange = (targetStat.mode & 128n) !== BigInt(params.mode & 128);
		try {
			if (modeChange) fs.fchmodSync(targetFd, params.mode);
			if (params.sync !== false) {
				if (params.strictFileSync) fs.fsyncSync(tempFd);
				else syncFileBestEffortSync(tempFd);
			}
		} catch (error) {
			if (!completeCreate) {
				closeWriteFd(closeFd, targetFd);
				targetFd = void 0;
			}
			if (params.input.kind !== "file" && !params.input.stageBeforePublish) removeNativeCreatedFileIfStillPinned({
				parentPath,
				parentFd,
				basename: params.basename,
				created: tempIdentity
			});
			throw error;
		}
		if (params.sync !== false) syncFileBestEffortSync(parentFd);
		if (params.overwrite === false && params.input.kind === "buffer" && params.input.stageBeforePublish === false) await params.verifyPublished?.(targetFd, verificationIdentity, parentGuard, {
			fd: parentFd,
			binding
		});
		else await params.verifyPublished?.(targetFd, verificationIdentity, parentGuard);
		completed = true;
		return {
			dev: targetStat.dev,
			ino: targetStat.ino
		};
	} catch (error) {
		failure = { error };
		throw error;
	} finally {
		const preservedPreparation = params.private && tempFd === void 0 && hasPreservedCreationArtifacts(failure?.error);
		if (completeCreate || preservedPreparation) await settleStagedFile({
			temporaryBasename: tempName,
			publication,
			phase,
			failure,
			cleanup: async () => {
				if (preservedPreparation) return "preserved";
				if (publication.status === "indeterminate") return "preserved";
				if (renamed || tempFd === void 0) return "not-needed";
				return await cleanupPinnedFilePath({
					pathname: path.join(parentPath, tempName),
					handle: { fd: tempFd },
					identity: tempIdentity,
					parentGuard,
					throwOnCleanupError: true
				});
			},
			close: [
				() => {
					if (targetFd !== void 0) closeFd(targetFd);
				},
				() => {
					if (publicationProbeFd !== void 0) closeFd(publicationProbeFd);
				},
				closeTemp,
				() => closeFd(parentFd),
				() => root.close()
			]
		});
		else {
			const targetCloseFailure = closeWriteFd(closeFd, targetFd);
			const probeCloseFailure = closeWriteFd(closeFd, publicationProbeFd);
			let tempCloseFailure;
			try {
				await closeTemp();
			} catch (error) {
				tempCloseFailure = { error };
			}
			if (!renamed) removeNativeCreatedFileIfStillPinned({
				parentPath,
				parentFd,
				basename: tempName,
				created: tempIdentity
			});
			const parentCloseFailure = closeWriteFd(closeFd, parentFd);
			await root.close().catch(() => void 0);
			const closeFailure = targetCloseFailure ?? probeCloseFailure ?? tempCloseFailure ?? parentCloseFailure;
			if (completed && closeFailure) throw closeFailure.error;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-pinned-write.js
var __addDisposableResource$2 = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources$2 = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
const writeCapabilities = [
	"openBeneath",
	"mkdirBeneath",
	"renameNoReplace",
	"renameReplace"
];
const posixWriteCapabilities = [
	...writeCapabilities,
	"createStagedFile",
	"stagedFileMatches",
	"removeStagedFile"
];
function pinnedWriteCapabilities(params) {
	const windows = process.platform === "win32";
	const capabilities = windows ? [...writeCapabilities, "fstatIdentity"] : posixWriteCapabilities;
	return params.input.kind === "file" && !params.private && (windows || !params.verifyPosixMode) ? [...capabilities, "copyFileExclusive"] : capabilities;
}
function getPinnedWriteNativeBinding(params) {
	return getNativeBinding(...pinnedWriteCapabilities(params));
}
async function runPinnedWriteNative(binding, params, fallback) {
	const env_1 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		assertNativeCapabilities(binding, ...pinnedWriteCapabilities(params));
		const closeFd = captureNativeFdClose(binding);
		const windows = process.platform === "win32";
		if (!windows) assertNativeStaging(binding);
		const directoryFlags = fs.constants.O_RDONLY | (fs.constants.O_DIRECTORY ?? 0);
		const completeCreate = params.overwrite === false && params.input.kind !== "file" && params.input.stageBeforePublish === true;
		const rootAdmission = await openNativeRootAdmission(binding, {
			rootPath: params.rootPath,
			rootIdentity: params.rootIdentity,
			operation: "native write",
			reportCloseErrors: completeCreate
		});
		const root = rootAdmission.root;
		__addDisposableResource$2(env_1, windows ? void 0 : root, true);
		let parentFd;
		let windowsOwnsDirectories = false;
		let admissionFailure;
		__addDisposableResource$2(env_1, { [Symbol.dispose]() {
			if (!windows && parentFd !== void 0) closeFd(parentFd);
		} }, false);
		try {
			let parentPath;
			let directory;
			let parentPathStat;
			if (params.mutationAdmission) {
				const admitted = await capturePolicyAwareNativeParent(binding, params, rootAdmission, windows, directoryFlags);
				parentFd = admitted.fd;
				parentPath = admitted.guard.realPath;
				directory = admitted.stagedDirectory;
				parentPathStat = admitted.guard.stat;
			} else {
				if (params.mkdir) {
					params.assertBeforeMutation?.();
					binding.mkdirBeneath(root.fd, params.relativeParentPath, 511);
				}
				const admitted = await openNativeParentAdmission(binding, rootAdmission, params.relativeParentPath, "native-publication");
				parentFd = admitted.fd;
				parentPath = admitted.guard.realPath;
				directory = admitted.stagedDirectory;
				parentPathStat = admitted.guard.stat;
			}
			const verificationGuard = {
				dir: parentPath,
				realPath: parentPath,
				stat: parentPathStat
			};
			if (params.input.kind === "link") return await copyLinkAtParent(params, params.input, verificationGuard, {
				binding,
				fd: parentFd
			});
			if (params.overwrite === false) try {
				if (fs.lstatSync(path.join(parentPath, params.basename), { throwIfNoEntry: false })) throw Object.assign(/* @__PURE__ */ new Error("destination already exists"), { code: "EEXIST" });
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
			}
			if (windows) {
				windowsOwnsDirectories = true;
				return await runPinnedWriteWindows(binding, params, root, parentFd, verificationGuard);
			}
			if (params.overwrite === false && !(params.input.kind === "buffer" && params.input.stageBeforePublish === false)) {
				const unavailable = cachedNoReplaceUnavailable(binding, parentFd);
				if (unavailable) {
					if (isFsSafeNativeRequired() || params.input.kind === "file" && params.input.clone === "always") throw unavailable;
					return await fallback(params.input);
				}
			}
			const ownedParent = parentFd;
			parentFd = void 0;
			return await writeNativeStage(binding, ownedParent, closeFd, directory, params, verificationGuard, fallback);
		} catch (error) {
			admissionFailure = { error };
			throw error;
		} finally {
			if (windows && !windowsOwnsDirectories) {
				const closeErrors = [];
				if (parentFd !== void 0) try {
					closeFd(parentFd);
				} catch (error) {
					closeErrors.push(error);
				}
				try {
					await root.close();
				} catch (error) {
					closeErrors.push(error);
				}
				if (completeCreate && closeErrors.length > 0) throw new AggregateError([...admissionFailure ? [admissionFailure.error] : [], ...closeErrors], "native create admission and close failed");
			}
		}
	} catch (e_1) {
		env_1.error = e_1;
		env_1.hasError = true;
	} finally {
		const result_1 = __disposeResources$2(env_1);
		if (result_1) await result_1;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-operation.js
function validatePinnedRelativePath(relativePath) {
	if (typeof relativePath !== "string") return;
	if (relativePath.length === 0 || relativePath === ".") return;
	if (relativePath.includes("\0")) throw new FsSafeError("invalid-path", "relative path contains a NUL byte");
	if (relativePath.startsWith("/") || relativePath === ".." || relativePath.startsWith("../") || relativePath.startsWith("..\\")) throw new FsSafeError("invalid-path", "relative path must not escape root");
	for (const segment of relativePath.split(process.platform === "win32" ? /[\\/]/ : "/")) if (segment === "..") throw new FsSafeError("invalid-path", "relative path must not contain '..'");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-write-mode.js
function assertPinnedWriteMode(fd, mode, privateCreation = false) {
	if (process.platform === "win32") return;
	const stat = fs.fstatSync(fd, { bigint: true });
	if (privateCreation) assertPrivateCreationFile(stat, fd);
	if (Number(stat.mode & 4095n) !== mode) throw new FsSafeError("insecure-permissions", "filesystem did not enforce the requested file mode");
}
async function preparePinnedWriteMode(handle, createdMode, assertBeforeMutation, privateCreation = false) {
	if (process.platform === "win32") return assertBeforeMutation;
	assertSynchronousCallbackResult(assertBeforeMutation?.(), "assertBeforeMutation");
	if (createdMode !== 384) {
		if (privateCreation) assertPrivateCreationFile(fs.fstatSync(handle.fd, { bigint: true }), handle.fd);
		await handle.chmod(384);
	}
	return pinnedWriteModeAssertion(handle.fd, 384, assertBeforeMutation, privateCreation);
}
function pinnedWriteModeAssertion(fd, mode, assertBeforeMutation, privateCreation = false) {
	return () => {
		assertSynchronousCallbackResult(assertBeforeMutation?.(), "assertBeforeMutation");
		assertPinnedWriteMode(fd, mode, privateCreation);
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/publish-copy-stage.js
function publishCopyStage(params) {
	const { identity, temporaryPath, targetPath } = params;
	const assertCurrent = () => {
		assertSyncDirectoryGuard(params.parentGuard);
		const staged = fs.lstatSync(temporaryPath, { bigint: true });
		const opened = fs.fstatSync(params.fd, { bigint: true });
		if (!staged.isFile() || staged.isSymbolicLink() || staged.nlink !== 1n || !sameFileIdentityForCleanup(staged, identity) || !sameFileIdentityForCleanup(opened, identity)) throw new FsSafeError("path-mismatch", "exclusive copy stage changed before publication");
	};
	assertCurrent();
	params.assertBeforeMutation?.();
	if (params.assertBeforeMutation) assertCurrent();
	if (fs.lstatSync(targetPath, { throwIfNoEntry: false })) throw new FsSafeError("already-exists", "destination already exists");
	params.onPublicationAttempt?.();
	let renamed = false;
	try {
		fs.linkSync(temporaryPath, targetPath);
	} catch (error) {
		if (!isHardlinkFallbackError(error)) throw error;
		publishThroughPlaceholder(params, assertCurrent);
		renamed = true;
	}
	let observerRejected = false;
	let observerError;
	try {
		params.onPublished?.(identity);
	} catch (error) {
		observerRejected = true;
		observerError = error;
	}
	try {
		if (renamed) {
			assertSyncDirectoryGuard(params.parentGuard);
			if (fs.lstatSync(temporaryPath, { throwIfNoEntry: false })) throw new FsSafeError("path-mismatch", "renamed copy stage still exists");
			const target = fs.lstatSync(targetPath, { bigint: true });
			if (!target.isFile() || target.isSymbolicLink() || target.nlink !== 1n || !sameFileIdentityForCleanup(target, identity)) throw new FsSafeError("path-mismatch", "renamed copy target changed after publication");
		} else {
			const parent = fs.lstatSync(path.dirname(temporaryPath), { bigint: true });
			const current = fs.lstatSync(temporaryPath, { bigint: true });
			if (parent.isSymbolicLink() || !parent.isDirectory() || !sameFileIdentityForCleanup(parent, params.parentGuard.stat) || current.isSymbolicLink() || !current.isFile() || !sameFileIdentityForCleanup(current, identity)) throw new FsSafeError("path-mismatch", "published copy temporary name changed before cleanup");
			fs.unlinkSync(temporaryPath);
		}
	} catch (error) {
		throw new FsSafeError("helper-failed", "published copy temporary cleanup failed", {
			cause: observerRejected ? new AggregateError([observerError, error], "observer and cleanup failed") : error,
			details: {
				publication: "published",
				path: targetPath,
				dev: identity.dev,
				ino: identity.ino,
				cleanup: "failed"
			}
		});
	}
	if (observerRejected) throw observerError;
}
function isEmptyPlaceholder(current, identity) {
	return current.isFile() && !current.isSymbolicLink() && current.nlink === 1n && current.size === 0n && sameFileIdentityForCleanup(current, identity);
}
function publishThroughPlaceholder(params, assertCurrent) {
	const { targetPath, temporaryPath } = params;
	assertCurrent();
	let fd;
	try {
		assertExclusiveCreateLeaf(targetPath);
		fd = fs.openSync(targetPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (fs.constants.O_NOFOLLOW ?? 0), 384);
	} catch (error) {
		if (hasErrorCode(error, "EEXIST")) throw new FsSafeError("already-exists", "destination already exists", { cause: error });
		throw error;
	}
	let placeholder;
	try {
		try {
			placeholder = fs.fstatSync(fd, { bigint: true });
		} finally {
			fs.closeSync(fd);
		}
		assertCurrent();
		const current = fs.lstatSync(targetPath, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!current || !isEmptyPlaceholder(current, placeholder)) throw new FsSafeError("path-mismatch", "exclusive copy placeholder changed before publication");
		fs.renameSync(temporaryPath, targetPath);
	} catch (error) {
		try {
			assertSyncDirectoryGuard(params.parentGuard);
			const current = fs.lstatSync(targetPath, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (current) {
				if (!placeholder) throw new FsSafeError("path-mismatch", "copy placeholder identity unavailable for cleanup");
				if (isEmptyPlaceholder(current, placeholder)) fs.unlinkSync(targetPath);
			}
		} catch (cleanupError) {
			throw new FsSafeError("helper-failed", "unpublished copy placeholder cleanup failed", {
				cause: new AggregateError([error, cleanupError], "publication and cleanup failed"),
				details: {
					publication: "not-published",
					path: targetPath,
					cleanup: "failed",
					...placeholder ? {
						dev: placeholder.dev,
						ino: placeholder.ino
					} : {}
				}
			});
		}
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-write-staged.js
async function runPinnedStagedWrite(params, parentPath, parentGuard) {
	const verifyPosixMode = process.platform !== "win32" && (params.verifyPosixMode === true || params.private === true);
	const targetPath = path.join(parentPath, params.basename);
	const tempPath = path.join(parentPath, `.fs-safe-${randomUUID()}.tmp`);
	const tempFlags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0);
	let handle;
	let tempIdentity;
	let readHandle;
	let renamed = false;
	const completeCreate = params.overwrite === false && params.input.kind !== "file" && params.input.stageBeforePublish === true;
	let receipt;
	let publication = Object.freeze({ status: "not-published" });
	let phase = "prepare";
	let failure;
	try {
		params.assertBeforeMutation?.();
		assertExclusiveCreateLeaf(tempPath);
		handle = params.private ? await createFileHandle(tempPath, {
			private: true,
			mode: 384,
			assertBeforeMutation: params.assertBeforeMutation
		}, creationAdmissionFromParent(parentGuard)) : await fs$1.open(tempPath, tempFlags, verifyPosixMode ? 384 : params.mode);
		let verificationIdentity = fs.fstatSync(handle.fd, { bigint: true });
		tempIdentity = verificationIdentity;
		let assertBeforeMutation = params.assertBeforeMutation;
		const assertBeforeWrite = verifyPosixMode ? await preparePinnedWriteMode(handle, Number(tempIdentity.mode & 4095n), assertBeforeMutation, params.private) : assertBeforeMutation;
		if (verifyPosixMode) assertPinnedWriteMode(handle.fd, 384, params.private);
		await writePinnedInput(handle, params.input, params.maxBytes, assertBeforeWrite);
		if (verifyPosixMode) assertPinnedWriteMode(handle.fd, 384, params.private);
		const tempStat = fs.fstatSync(handle.fd, { bigint: true });
		const tempPathStat = fs.lstatSync(tempPath, { bigint: true });
		if (tempPathStat.isSymbolicLink() || !sameFileIdentity(tempPathStat, tempStat)) throw new FsSafeError("path-mismatch", "fallback temp path changed during write");
		const expectedTempStat = tempStat;
		fs.fchmodSync(handle.fd, params.mode);
		if (params.input.kind === "file") restoreCopyMetadata(handle.fd, params.input.metadata);
		if (verifyPosixMode) {
			assertPinnedWriteMode(handle.fd, params.mode, params.private);
			assertBeforeMutation = pinnedWriteModeAssertion(handle.fd, params.mode, params.assertBeforeMutation, params.private);
		}
		if (params.sync !== false) {
			if (params.strictFileSync) await handle.sync();
			else await syncFileBestEffort(handle);
		}
		if (params.input.kind === "file") await params.input.verifySource();
		if (completeCreate) receipt = createStagedFileReceipt(Object.freeze({
			path: parentGuard.dir,
			realPath: parentGuard.realPath,
			identity: Object.freeze({
				dev: parentGuard.stat.dev,
				ino: parentGuard.stat.ino
			})
		}), path.basename(tempPath), fs.fstatSync(handle.fd, { bigint: true }));
		let verifiedIdentity = expectedTempStat;
		phase = "publish";
		await withAsyncDirectoryGuards([parentGuard], async () => {
			assertFinalSymlinkRejected(targetPath, params.rejectFinalSymlink);
			if (params.overwrite === false) publishCopyStage({
				temporaryPath: tempPath,
				targetPath,
				fd: handle.fd,
				identity: tempIdentity,
				parentGuard,
				assertBeforeMutation,
				onPublicationAttempt: () => {
					if (receipt) publication = Object.freeze({
						status: "indeterminate",
						basename: params.basename,
						overwrite: false
					});
				},
				onPublished: (identity) => {
					renamed = true;
					if (receipt) publication = Object.freeze({
						status: "published",
						staged: receipt,
						basename: params.basename,
						overwrite: false
					});
					params.onPublished?.(identity);
				}
			});
			else {
				assertBeforeMutation?.();
				await fs$1.rename(tempPath, targetPath);
				renamed = true;
				params.onPublished?.(verificationIdentity);
			}
			await getFsSafeTestHooks()?.afterPinnedWriteFallbackRename?.(targetPath);
			if (params.sync !== false) await syncDirectoryBestEffort(parentPath);
			const targetStat = fs.lstatSync(targetPath, { bigint: true });
			if (targetStat.isSymbolicLink()) throw new FsSafeError("path-mismatch", "fallback target changed during write");
			if (!sameFileIdentity(targetStat, expectedTempStat)) {
				if (params.onRenameIdentityMismatch !== "verify-content") throw new FsSafeError("path-mismatch", "fallback target changed during write");
				if (params.input.kind !== "buffer") throw new FsSafeError("path-mismatch", "fallback target changed during write");
				const expectedHash = sha256Hex(params.input.data, params.input.encoding);
				readHandle = await fs$1.open(targetPath, resolveReadOpenFlags());
				const readHandleStat = fs.fstatSync(readHandle.fd, { bigint: true });
				if (sha256Hex(await readFileHandleBounded(readHandle, Infinity)) !== expectedHash) throw new FsSafeError("path-mismatch", "fallback target changed during write");
				verificationIdentity = readHandleStat;
				verifiedIdentity = readHandleStat;
			}
		});
		await params.verifyPublished?.((readHandle ?? handle).fd, verificationIdentity, parentGuard);
		if (verifyPosixMode) assertPinnedWriteMode((readHandle ?? handle).fd, params.mode, params.private);
		return {
			dev: verifiedIdentity.dev,
			ino: verifiedIdentity.ino
		};
	} catch (error) {
		failure = { error };
		throw error;
	} finally {
		const preservedPreparation = params.private && !handle && hasPreservedCreationArtifacts(failure?.error);
		if (completeCreate || preservedPreparation) await settleStagedFile({
			temporaryBasename: path.basename(tempPath),
			publication,
			phase,
			failure,
			cleanup: async () => {
				if (preservedPreparation) return "preserved";
				if (publication.status === "indeterminate") return "preserved";
				if (renamed) return failure?.error instanceof FsSafeError && failure.error.details?.cleanup === "failed" ? "failed" : "not-needed";
				return handle ? await cleanupPinnedFilePath({
					pathname: tempPath,
					handle,
					identity: tempIdentity,
					parentGuard,
					throwOnCleanupError: true
				}) : "not-needed";
			},
			close: [async () => {
				await readHandle?.close();
			}, async () => {
				await handle?.close();
			}]
		});
		else try {
			if (!renamed && handle) await cleanupPinnedFilePath({
				pathname: tempPath,
				handle,
				identity: tempIdentity,
				parentGuard
			});
		} finally {
			await readHandle?.close().catch(() => void 0);
			await handle?.close().catch(() => void 0);
		}
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-write.js
function assertSafeBasename(basename) {
	if (!basename || basename === "." || basename === ".." || basename.includes("/") || process.platform === "win32" && basename.includes("\\") || basename.includes("\0")) throw new FsSafeError("invalid-path", "invalid target path");
}
function fastParentGuardDeopt(error) {
	return error instanceof FsSafeError && (error.code === "path-mismatch" || error.code === "not-file");
}
const PINNED_WRITE_SNAPSHOT_KEYS = [
	"rootPath",
	"relativeParentPath",
	"basename",
	"maxBytes",
	"rootIdentity"
];
const RENAME_POLICY_SNAPSHOT_KEYS = ["targetPath", "renameIdentity"];
function copyOwnEnumerableExcept(source, excluded) {
	const owned = {};
	for (const key of Reflect.ownKeys(source)) {
		if (excluded.includes(key)) continue;
		if (!Object.getOwnPropertyDescriptor(source, key)?.enumerable) continue;
		Object.defineProperty(owned, key, {
			value: Reflect.get(source, key),
			enumerable: true,
			writable: true,
			configurable: true
		});
	}
	return owned;
}
async function runPinnedWriteHelper(params) {
	const { rootPath, relativeParentPath, basename, maxBytes, rootIdentity } = params;
	const normalizedParams = {
		...copyOwnEnumerableExcept(params, PINNED_WRITE_SNAPSHOT_KEYS),
		rootPath,
		relativeParentPath,
		basename,
		maxBytes: normalizeMaxBytes(maxBytes),
		rootIdentity
	};
	assertSafeBasename(normalizedParams.basename);
	validatePinnedRelativePath(normalizedParams.relativeParentPath);
	assertNoWindowsPathAlias(normalizedParams.rootPath, "filesystem", "pinned write root uses a Windows filesystem namespace alias");
	assertNoWindowsPathAlias(normalizedParams.relativeParentPath, "relative", "pinned write parent uses a Windows filesystem namespace alias");
	assertNoWindowsPathAlias(normalizedParams.basename, "relative", "pinned write basename uses a Windows filesystem namespace alias");
	if (rootIdentity !== void 0) normalizedParams.rootIdentity = {
		dev: rootIdentity.dev,
		ino: rootIdentity.ino
	};
	if (normalizedParams.mutationAdmission) {
		const targetPath = path.join(normalizedParams.rootPath, ...normalizedParams.relativeParentPath.split("/").filter(Boolean), normalizedParams.basename);
		await getFsSafeTestHooks()?.beforePinnedWriteParentAdmission?.(targetPath);
	}
	if (normalizedParams.onRenameIdentityMismatch === "verify-content") return await runPinnedWriteFallback(normalizedParams);
	const native = getPinnedWriteNativeBinding(normalizedParams);
	if (native) return await runPinnedWriteNative(native, normalizedParams, (input) => runPinnedWriteFallback({
		...normalizedParams,
		input
	}));
	return await runPinnedWriteFallback(normalizedParams);
}
async function runPinnedWriteWithRenamePolicy(params) {
	const { targetPath, renameIdentity } = params;
	const writeParams = copyOwnEnumerableExcept(params, RENAME_POLICY_SNAPSHOT_KEYS);
	if (renameIdentity !== "verify-content-with-lock") return await runPinnedWriteHelper(writeParams);
	const relativeTargetPath = writeParams.relativeParentPath ? `${writeParams.relativeParentPath}/${writeParams.basename}` : writeParams.basename;
	return await withPinnedWriteRenameIdentityLock({
		rootPath: writeParams.rootPath,
		targetPath,
		relativeTargetPath
	}, async () => await runPinnedWriteHelper({
		...writeParams,
		onRenameIdentityMismatch: "verify-content"
	}));
}
async function withPinnedWriteRenameIdentityLock(params, run) {
	const lockPath = path.join(params.rootPath, `.fs-safe-write-${sha256Hex(params.relativeTargetPath)}.lock`);
	return await withSidecarLock(params.rootPath, {
		managerKey: `fs-safe.write:${params.targetPath}`,
		lockPath,
		staleMs: 3e4,
		timeoutMs: 5e3,
		payload: () => ({
			pid: process.pid,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}),
		retry: {
			retries: 5,
			minTimeout: 100,
			maxTimeout: 2e3,
			factor: 2
		}
	}, run);
}
async function runPinnedWriteFallback(params) {
	const verifyPosixMode = process.platform !== "win32" && (params.verifyPosixMode === true || params.private === true);
	const exactRoot = typeof params.rootIdentity?.dev === "bigint" && typeof params.rootIdentity.ino === "bigint" ? {
		dev: params.rootIdentity.dev,
		ino: params.rootIdentity.ino
	} : void 0;
	const mutationAdmission = params.mutationAdmission;
	if (exactRoot) await inspectDirectoryIdentity(params.rootPath, exactRoot);
	let parentPath = params.relativeParentPath ? path.join(params.rootPath, ...params.relativeParentPath.split("/")) : params.rootPath;
	let parentGuard;
	let parentAdmitted = false;
	const initialTargetPath = path.join(parentPath, params.basename);
	const retainedTargetPath = mutationAdmission?.beginParentWalk?.();
	const ordinaryRetainedTarget = retainedTargetPath !== void 0 && path.relative(path.resolve(retainedTargetPath), path.resolve(initialTargetPath)) === "";
	let fastGuardClassifierFailure;
	if (ordinaryRetainedTarget) {
		try {
			parentGuard = await createAsyncDirectoryGuard(parentPath, { bigint: true });
		} catch (error) {
			if (error?.code !== "ENOENT") {
				if (!fastParentGuardDeopt(error)) throw error;
				fastGuardClassifierFailure = error;
			}
		}
		if (parentGuard) {
			await mutationAdmission.authorize(Object.freeze({
				targetPath: initialTargetPath,
				mutationPath: initialTargetPath,
				phase: "parent"
			}));
			await assertAsyncDirectoryGuard(parentGuard);
			parentAdmitted = true;
		}
	}
	if (fastGuardClassifierFailure) await mutationAdmission.authorize(Object.freeze({
		targetPath: initialTargetPath,
		mutationPath: initialTargetPath,
		phase: "parent"
	}));
	if (!parentGuard) {
		const mkdirParams = {
			rootReal: params.rootPath,
			targetPath: parentPath,
			rootIdentity: params.rootIdentity,
			createMissing: params.mkdir,
			assertBeforeMutation: params.assertBeforeMutation,
			beforeComponent: async (componentPath) => {
				if (params.mkdir) await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", componentPath);
			}
		};
		parentPath = await mkdirPathComponentsWithGuards(mutationAdmission ? {
			...mkdirParams,
			rejectSymlinks: mutationAdmission.rejectParentSymlinks,
			revalidateParentAfterBeforeComponent: true,
			synchronousAuthorizationIncludesFence: true,
			retainedTargetPath,
			afterCreateComponent: mutationAdmission.advanceCreatedDirectory,
			beforeCreateComponent: (componentPath, prospectiveParentPath, retainedTarget, parent) => {
				if (fastGuardClassifierFailure) throw fastGuardClassifierFailure;
				const request = Object.freeze({
					targetPath: retainedTarget ?? path.join(prospectiveParentPath, params.basename),
					mutationPath: componentPath,
					phase: "parent-create"
				});
				return mutationAdmission.tryAuthorizeAtParent?.(request, parent) ?? mutationAdmission.authorize(request);
			},
			beforeUseComponent: async (_componentPath, prospectiveParentPath, retainedTarget) => {
				const targetPath = retainedTarget ?? path.join(prospectiveParentPath, params.basename);
				await mutationAdmission.authorize(Object.freeze({
					targetPath,
					mutationPath: targetPath,
					phase: "parent"
				}));
			}
		} : mkdirParams);
	}
	parentGuard ??= await createAsyncDirectoryGuard(parentPath, { bigint: true });
	const targetPath = path.join(parentPath, params.basename);
	if (mutationAdmission && !parentAdmitted) {
		await mutationAdmission.authorize(Object.freeze({
			targetPath,
			mutationPath: targetPath,
			phase: "parent"
		}));
		await assertAsyncDirectoryGuard(parentGuard);
	}
	if (params.input.kind === "link") return await copyLinkAtParent(params, params.input, parentGuard);
	if (params.overwrite === false && params.input.kind !== "file" && !params.input.stageBeforePublish) {
		const assertBeforeMutation = () => {
			assertFinalSymlinkRejected(targetPath, params.rejectFinalSymlink);
			params.assertBeforeMutation?.();
		};
		const handle = await withAsyncDirectoryGuards([parentGuard], async () => {
			assertBeforeMutation();
			if (params.private) return await createFileHandle(targetPath, {
				private: true,
				mode: 384,
				assertBeforeMutation
			}, creationAdmissionFromParent(parentGuard));
			assertExclusiveCreateLeaf(targetPath);
			return await fs$1.open(targetPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL, verifyPosixMode ? 384 : params.mode);
		}, { onPostGuardFailure: async (openedHandle) => {
			await openedHandle.close().catch(() => void 0);
		} });
		let created = true;
		let completed = false;
		let createdIdentity;
		try {
			const verificationIdentity = fs.fstatSync(handle.fd, { bigint: true });
			createdIdentity = verificationIdentity;
			const assertBeforeWrite = verifyPosixMode ? await preparePinnedWriteMode(handle, Number(createdIdentity.mode & 4095n), assertBeforeMutation, params.private) : assertBeforeMutation;
			if (verifyPosixMode) assertPinnedWriteMode(handle.fd, 384, params.private);
			await writePinnedInput(handle, params.input, params.maxBytes, assertBeforeWrite);
			if (verifyPosixMode) assertPinnedWriteMode(handle.fd, 384, params.private);
			fs.fchmodSync(handle.fd, params.mode);
			if (verifyPosixMode) assertPinnedWriteMode(handle.fd, params.mode, params.private);
			if (params.sync !== false) {
				if (params.strictFileSync) await handle.sync();
				else await syncFileBestEffort(handle);
			}
			const stat = fs.fstatSync(handle.fd, { bigint: true });
			if (params.sync !== false) await syncDirectoryBestEffort(parentPath);
			created = false;
			await params.verifyPublished?.(handle.fd, verificationIdentity, parentGuard);
			if (verifyPosixMode) assertPinnedWriteMode(handle.fd, params.mode, params.private);
			completed = true;
			return {
				dev: stat.dev,
				ino: stat.ino
			};
		} finally {
			try {
				if (created) await cleanupPinnedFilePath({
					pathname: targetPath,
					handle,
					identity: createdIdentity,
					parentGuard
				});
			} finally {
				if (completed) await handle.close();
				else await handle.close().catch(() => void 0);
			}
		}
	}
	return await runPinnedStagedWrite(params, parentPath, parentGuard);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-copy.js
async function copyFileInRoot(root, params, openVerifiedLocalFile) {
	params.signal?.throwIfAborted();
	resolveCopyCloneMode(params.clone, "never");
	if (params.sourceSymlinks !== void 0 && params.sourceSymlinks !== "reject" && params.sourceSymlinks !== "copy-link") throw new FsSafeError("invalid-path", "sourceSymlinks must be reject or copy-link");
	if (params.sourceSymlinks === "copy-link") {
		if (typeof params.source !== "string") throw new FsSafeError("invalid-path", "sourceSymlinks: copy-link requires an absolute-path string source; open/stat capabilities cannot observe links without following them");
		const link = await admitCopyLink(assertAbsolutePathInput(params.source), params.preserveMetadata === true, params.signal).catch((error) => {
			throw normalizePinnedWriteError(error);
		});
		if (link) {
			if (params.overwrite === true) throw new FsSafeError("invalid-path", "copy-link cannot overwrite an existing destination; omit overwrite or use false");
			assertCopyLinkAvailable();
			const mode = params.mode ?? (params.preserveSourceMode ? Number(link.identity.mode & 4095n) : void 0);
			await copyInputInRoot(root, {
				...params,
				overwrite: false
			}, link, mode);
			return;
		}
	}
	const clone = resolveFileCopyCloneMode(params.clone);
	let source;
	let sourceIdentity;
	if (typeof params.source === "string") {
		assertNoNulPathInput(params.source, "source path contains a NUL byte");
		assertNoWindowsPathAlias(params.source, "filesystem", "source path uses a Windows filesystem namespace alias");
		({opened: source, identity: sourceIdentity} = await openVerifiedLocalFile(params.source, { hardlinks: params.sourceHardlinks }));
	} else {
		source = await params.source.root.open(params.source.relativePath, params.sourceHardlinks === void 0 ? void 0 : { hardlinks: params.sourceHardlinks });
		try {
			sourceIdentity = inspectFileIdentitySync(() => fs.fstatSync(source.handle.fd, { bigint: true }));
		} catch (error) {
			await source.handle.close().catch(() => void 0);
			throw error;
		}
	}
	try {
		if (params.maxBytes !== void 0 && source.stat.size > params.maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${source.stat.size})`);
		let metadata;
		try {
			metadata = params.preserveMetadata ? captureCopyMetadata(source.handle.fd, sourceIdentity) : void 0;
		} catch (error) {
			throw normalizePinnedWriteError(error);
		}
		const sourceAdmission = params.admitSource?.(sourceIdentity, source.realPath);
		const verifySource = async () => {
			params.signal?.throwIfAborted();
			try {
				sourceAdmission?.verify();
			} catch (error) {
				throw new MutationAuthorityError(error);
			}
			if (typeof params.source !== "string") await params.source.root.stat(".");
			assertCopySourceCurrent(source, sourceIdentity);
		};
		const mode = sourceAdmission?.mode ?? params.mode ?? (params.preserveSourceMode ? Number(sourceIdentity.mode & 4095n) : void 0);
		await copyInputInRoot(root, params, {
			kind: "file",
			handle: source.handle,
			size: source.stat.size,
			clone,
			signal: params.signal,
			metadata,
			verifySource
		}, mode, () => assertCopySourceCurrent(source, sourceIdentity));
	} finally {
		await source.handle.close().catch(() => {});
	}
}
async function copyInputInRoot(root, params, input, mode, verifyAdmission = input.verifySource) {
	if (mode !== void 0 && (!Number.isInteger(mode) || mode < 0 || mode > 4095)) throw new FsSafeError("invalid-path", "invalid copy mode");
	await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
		const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, mode, params.denyMutations, params.overwrite !== false, params.mutationSymlinks);
		await serializePathWrite(pinned.targetPath, async () => {
			await verifyAdmission();
			const observer = createCopyPublicationObserver(pinned.targetPath, params.onDestinationPublished);
			try {
				await runPinnedWriteHelper({
					rootPath: pinned.rootReal,
					relativeParentPath: pinned.relativeParentPath,
					basename: pinned.basename,
					mkdir: params.mkdir !== false,
					mode: pinned.mode,
					overwrite: params.overwrite !== false,
					rejectFinalSymlink: params.mutationSymlinks !== void 0,
					maxBytes: params.maxBytes,
					sync: params.durable !== false,
					assertBeforeMutation: params.signal || params.assertBeforeMutation ? () => {
						if (params.signal?.aborted) throw new MutationAuthorityError(params.signal.reason);
						params.assertBeforeMutation?.();
					} : void 0,
					verifyPublished: params.verifyPublished,
					onPublished: observer.onPublished,
					input,
					rootIdentity: root.rootIdentity,
					mutationAdmission: pinned.mutationAdmission
				});
			} catch (error) {
				observer.rethrowObserverFailure(error);
				if (params.signal?.aborted && error === params.signal.reason) throw error;
				if (isAlreadyExistsError(error)) throw new FsSafeError("already-exists", "copy destination already exists", { cause: error });
				throw normalizePinnedWriteError(error);
			}
			await input.verifySource();
		});
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/local-file-descriptor.js
const OPEN_READ_FLAGS = resolveReadOpenFlags();
const OPEN_READ_FOLLOW_FLAGS = resolveReadOpenFlags({ followSymlinks: true });
async function openLocalFileDescriptor(filePath, options) {
	assertNoUnsafeDeviceReadPath(filePath);
	const fsSafeTestHooks = getFsSafeTestHooks();
	let preOpenStat;
	let observedBeforeOpen = false;
	try {
		preOpenStat = inspectFileIdentitySync(() => {
			const stat = fs.lstatSync(filePath, { bigint: true });
			observedBeforeOpen = true;
			if (stat.isSymbolicLink() && options?.symlinks !== "follow-within-root") throw new FsSafeError("symlink", "symlink not allowed");
			if (!stat.isFile() && !stat.isSymbolicLink()) throw new FsSafeError("not-file", "not a file");
			return stat;
		});
	} catch (err) {
		if (err instanceof FsSafeError || observedBeforeOpen) throw err;
	}
	if (preOpenStat && fsSafeTestHooks?.afterPreOpenLstat) await fsSafeTestHooks.afterPreOpenLstat(filePath);
	const openFlags = (options?.symlinks === "follow-within-root" ? OPEN_READ_FOLLOW_FLAGS : OPEN_READ_FLAGS) | (options?.readWrite ? fs.constants.O_RDWR : 0);
	if (fsSafeTestHooks?.beforeOpen) await fsSafeTestHooks.beforeOpen(filePath, openFlags);
	let handle;
	try {
		handle = await fs$1.open(filePath, openFlags).catch((error) => recordFileOpenFailure(isNotFoundPathError(error) ? fileNotFoundError() : error, filePath));
	} catch (err) {
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file");
		throw err;
	}
	try {
		if (fsSafeTestHooks?.afterOpen) await fsSafeTestHooks.afterOpen(filePath, handle);
		let openedIdentity;
		let identity;
		try {
			identity = inspectFileIdentitySync(() => {
				openedIdentity = fs.fstatSync(handle.fd, { bigint: true });
				if (!openedIdentity.isFile()) throw new FsSafeError("not-file", "not a file");
				return openedIdentity;
			}, preOpenStat && !preOpenStat.isSymbolicLink() ? preOpenStat : void 0);
		} catch (error) {
			if (openedIdentity && [0n, 1n].includes(openedIdentity.nlink)) await recordPreOpenFileChange(error, handle, filePath, preOpenStat, openedIdentity);
			throw error;
		}
		if (!identity.isFile()) throw new FsSafeError("not-file", "not a file");
		const stat = numberStats(identity);
		if (options?.hardlinks === "reject" && stat.nlink > 1) throw hardlinkedPathNotAllowedError();
		return {
			handle,
			stat,
			identity,
			preOpenStat
		};
	} catch (err) {
		await handle.close().catch(() => {});
		throw err;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/opened-realpath.js
async function resolveOpenedFileRealPathForHandle(handle, ioPath) {
	const fd = handle.fd;
	const identity = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }));
	const resolved = await resolveOpenedFileRealPathForFd(fd, identity, ioPath);
	let first = resolved.stat;
	inspectFileIdentitySync(() => {
		const current = first ?? fs.statSync(resolved.realPath, { bigint: true });
		first = void 0;
		return current;
	}, identity);
	return resolved.realPath;
}
async function resolveOpenedFileRealPathForFd(fd, handleStat, ioPath) {
	const statOptions = typeof handleStat.dev === "bigint" || typeof handleStat.ino === "bigint" ? { bigint: true } : void 0;
	const fdCandidates = process.platform === "linux" ? [`/proc/self/fd/${fd}`, `/dev/fd/${fd}`] : [];
	for (const fdPath of fdCandidates) try {
		const fdLink = fdPath.startsWith("/proc/") ? fs.readlinkSync(fdPath) : void 0;
		const fdRealPath = fdLink !== void 0 && !fdLink.endsWith(" (deleted)") ? fdLink : realpathSync$1.native(fdPath);
		if (!path.isAbsolute(fdRealPath)) continue;
		const fdRealStat = statOptions ? fs.statSync(fdRealPath, statOptions) : fs.statSync(fdRealPath);
		if (sameFileIdentity(handleStat, fdRealStat)) return {
			realPath: fdRealPath,
			stat: fdRealStat
		};
	} catch {}
	try {
		const ioRealPath = realpathSync$1.native(ioPath);
		const ioRealStat = statOptions ? fs.statSync(ioRealPath, statOptions) : fs.statSync(ioRealPath);
		if (sameFileIdentity(handleStat, ioRealStat)) return {
			realPath: ioRealPath,
			stat: ioRealStat
		};
	} catch (err) {
		if (!isNotFoundPathError(err)) {
			if (process.platform === "win32" && err instanceof Error && ["EPERM", "EBADF"].includes(err.code ?? "")) throw openedPathResolutionError(err);
			throw err;
		}
	}
	const parentResolved = await resolveOpenedFileRealPathFromParent(handleStat, ioPath, statOptions);
	if (parentResolved) return parentResolved;
	throw openedPathResolutionError();
}
async function resolveOpenedFileRealPathFromParent(handleStat, ioPath, statOptions) {
	let parentReal;
	try {
		parentReal = realpathSync$1.native(path.dirname(ioPath));
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	let entries;
	try {
		entries = await fs$1.readdir(parentReal);
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	for (const entry of entries.toSorted()) {
		const candidatePath = path.join(parentReal, entry);
		try {
			const candidateStat = statOptions ? fs.lstatSync(candidatePath, statOptions) : fs.lstatSync(candidatePath);
			if (candidateStat.isFile() && sameFileIdentity(handleStat, candidateStat)) {
				const realPath = realpathSync$1.native(candidatePath);
				const stat = statOptions ? fs.statSync(realPath, statOptions) : fs.statSync(realPath);
				if (sameFileIdentity(handleStat, stat)) return {
					realPath,
					stat
				};
			}
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
	}
	return null;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/read-opened-file.js
async function readOpenedFileSafely(params) {
	const maxBytes = normalizeMaxBytes(params.maxBytes);
	if (maxBytes !== void 0 && params.opened.stat.size > maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got ${params.opened.stat.size})`);
	return {
		buffer: await readFileHandleBoundedWithSize(params.opened.handle, maxBytes ?? Infinity, params.opened.stat.size),
		containment: params.opened.containment,
		realPath: params.opened.realPath,
		stat: params.opened.stat,
		exactIdentity: params.opened.exactIdentity
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-mkdir-native.js
var __addDisposableResource$1 = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources$1 = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function tryMkdirNativeParents(root, relativePath) {
	try {
		return mkdirOrdinaryNativeParents(root, relativePath);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOTDIR")) throw directoryComponentNotDirectoryError(error);
		throw error;
	}
}
function mkdirOrdinaryNativeParents(root, relativePath) {
	if (getFsSafeTestHooks()?.beforeRootFallbackMutation) return false;
	const segments = relativePath.split(path.sep === "\\" ? /[\\/]/ : "/");
	if (segments.length < 2 || segments.some((segment) => !isSafePathSegment(segment, { allowDotPrefix: true }) || segment.endsWith("."))) return false;
	let rootStat;
	assertRootIdentityCurrentSync(root, (stat) => {
		rootStat = stat;
	});
	const target = path.join(root.rootReal, ...segments);
	const parentPath = path.dirname(target);
	try {
		const child = fs.lstatSync(pathForWindowsFilesystem(target), { throwIfNoEntry: false });
		if (child && (!child.isDirectory() || realpathSync$1.native(pathForWindowsFilesystem(target)) !== target)) return false;
	} catch {
		return false;
	}
	let parentIdentity;
	try {
		parentIdentity = inspectDirectoryIdentitySync(parentPath);
	} catch (error) {
		return hasNodeErrorCode(error, "ENOENT") ? mkdirMissingParents(root, segments, rootStat) : false;
	}
	try {
		if (realpathSync$1.native(pathForWindowsFilesystem(parentPath)) !== parentPath) return false;
	} catch {
		return false;
	}
	return mkdirExistingParent(root, segments, parentIdentity);
}
/** Ordinary missing suffixes need no policy callbacks or repeated path resolution. */
function mkdirMissingParents(root, segments, rootStat) {
	const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
	if (!binding?.openBeneath || !binding.mkdirOpenChildBeneath) return false;
	let parentDepth = segments.length - 2;
	let parentPath;
	let parentIdentity;
	for (;;) {
		parentPath = path.join(root.rootReal, ...segments.slice(0, parentDepth));
		try {
			parentIdentity = inspectDirectoryIdentitySync(parentPath, void 0, parentDepth === 0 ? rootStat : void 0);
			if (realpathSync$1.native(pathForWindowsFilesystem(parentPath)) !== parentPath) return false;
			break;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT") || parentDepth === 0) return false;
			parentDepth--;
		}
	}
	try {
		const env_1 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			const rootOwner = __addDisposableResource$1(env_1, openExactNativeRootSync(binding, {
				rootPath: root.rootReal,
				rootIdentity: root.rootIdentity
			}), false);
			const close = captureNativeFdClose(binding);
			const directories = [];
			__addDisposableResource$1(env_1, { [Symbol.dispose]() {
				const errors = [];
				for (const directory of directories.toReversed()) try {
					close(directory.fd);
				} catch (error) {
					errors.push(error);
				}
				if (errors.length) throw new AggregateError(errors, "mkdir directory close failed");
			} }, false);
			const flags = (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0) | (fs.constants.O_NOFOLLOW ?? 0);
			let current = rootOwner.fd;
			if (parentDepth > 0) {
				current = binding.openBeneath(rootOwner.fd, segments.slice(0, parentDepth).join("/"), flags).fd;
				directories.push({
					fd: current,
					pathname: parentPath
				});
				inspectFileIdentitySync(() => fs.fstatSync(current, { bigint: true }), parentIdentity);
			}
			const assertCurrent = () => {
				assertRootIdentityCurrentSync(root);
				for (const directory of directories) verifyMkdirDirectory(binding, directory.fd, directory.pathname);
				verifyMkdirDirectory(binding, rootOwner.fd, root.rootReal);
			};
			assertCurrent();
			for (const segment of segments.slice(parentDepth)) {
				const child = binding.mkdirOpenChildBeneath(current, segment, 511, flags);
				parentPath = path.join(parentPath, segment);
				directories.push({
					fd: child.fd,
					pathname: parentPath
				});
				assertCurrent();
				current = child.fd;
			}
			return true;
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			__disposeResources$1(env_1);
		}
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOTDIR")) throw directoryComponentNotDirectoryError(error);
		throw error;
	}
}
function mkdirExistingParent(root, segments, parentIdentity) {
	const env_2 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		const target = path.join(root.rootReal, ...segments);
		const parentPath = path.dirname(target);
		const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
		if (!binding?.openBeneath || !binding.mkdirChildBeneath) throw new FsSafeError("helper-unavailable", "native confined creation is unavailable");
		const rootOwner = __addDisposableResource$1(env_2, openExactNativeRootSync(binding, {
			rootPath: root.rootReal,
			rootIdentity: root.rootIdentity
		}), false);
		verifyMkdirDirectory(binding, rootOwner.fd, root.rootReal);
		const flags = (nodeDirectorySearchOnlyFlags()?.flags ?? fs.constants.O_RDONLY) | (fs.constants.O_DIRECTORY ?? 0) | (fs.constants.O_NOFOLLOW ?? 0);
		const close = captureNativeFdClose(binding);
		const parent = binding.openBeneath(rootOwner.fd, segments.slice(0, -1).join("/"), flags).fd;
		__addDisposableResource$1(env_2, { [Symbol.dispose]() {
			close(parent);
		} }, false);
		inspectFileIdentitySync(() => fs.fstatSync(parent, { bigint: true }), parentIdentity);
		verifyMkdirDirectory(binding, parent, parentPath);
		assertRootIdentityCurrentSync(root);
		const name = segments.at(-1);
		const child = binding.mkdirOpenChildBeneath ? binding.mkdirOpenChildBeneath(parent, name, 511, flags).fd : (binding.mkdirChildBeneath(parent, name, 511), binding.openBeneath(parent, name, flags).fd);
		__addDisposableResource$1(env_2, { [Symbol.dispose]() {
			close(child);
		} }, false);
		assertRootIdentityCurrentSync(root);
		verifyMkdirDirectory(binding, child, target);
		inspectDirectoryIdentitySync(parentPath, parentIdentity);
		verifyMkdirDirectory(binding, parent, parentPath);
		verifyMkdirDirectory(binding, rootOwner.fd, root.rootReal);
		return true;
	} catch (e_2) {
		env_2.error = e_2;
		env_2.hasError = true;
	} finally {
		__disposeResources$1(env_2);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-remove-receipt.js
var RemovalPathReceipts = class {
	rootStat;
	directories;
	observeRoot = (stat) => {
		this.rootStat = stat;
	};
	observeDirectory(dir, stat) {
		const directories = this.directories ??= /* @__PURE__ */ new Map();
		if (!directories.has(dir)) directories.set(dir, {
			path: dir,
			stat
		});
	}
	complete(rootReal, targetPath) {
		const parentPath = path.dirname(targetPath);
		if (!this.rootStat || !isPathInside(rootReal, parentPath)) return void 0;
		const directories = [];
		let current = parentPath;
		while (current !== rootReal) {
			const directory = this.directories?.get(current);
			if (!directory) return void 0;
			directories.push(directory);
			const parent = path.dirname(current);
			if (parent === current) return void 0;
			current = parent;
		}
		directories.reverse();
		return {
			rootStat: this.rootStat,
			parent: directories.at(-1),
			directories
		};
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-directory-list.js
const METADATA_BATCH_SIZE = 32;
function directoryEntryName(bytes) {
	if (!isUtf8(bytes)) throw new FsSafeError("invalid-path", "directory entry name is not valid UTF-8");
	return bytes.toString("utf8");
}
async function readDirectoryNames(directory) {
	const names = await fs$1.readdir(directory);
	if (names.some((name) => name.includes("�"))) return (await fs$1.readdir(directory, { encoding: "buffer" })).map(directoryEntryName);
	return names;
}
async function readDirectoryEntryName(handle, synchronous = false) {
	const entry = synchronous ? handle.readSync() : await handle.read();
	return entry === null ? void 0 : directoryEntryName(Buffer.isBuffer(entry) ? entry : entry.name);
}
function openDirectoryNames(directory) {
	return fs$1.opendir(directory, {
		bufferSize: 1,
		encoding: "buffer"
	});
}
function pathStatFromStats(stat, name) {
	const mtimeMs = typeof stat.mtimeMs === "bigint" ? "mtimeNs" in stat && typeof stat.mtimeNs === "bigint" ? Number(stat.mtimeNs) / 1e6 : stat.mtime.getTime() : stat.mtimeMs;
	const exactIdentity = exactFileIdentity(stat);
	const dev = numberStatScalar(stat.dev), gid = numberStatScalar(stat.gid), ino = numberStatScalar(stat.ino);
	const isDirectory = stat.isDirectory(), isFile = stat.isFile(), isSymbolicLink = stat.isSymbolicLink();
	const mode = numberStatScalar(stat.mode), nlink = numberStatScalar(stat.nlink), size = numberStatScalar(stat.size), uid = numberStatScalar(stat.uid);
	return Object.defineProperty(name === void 0 ? {
		dev,
		gid,
		ino,
		isDirectory,
		isFile,
		isSymbolicLink,
		mode,
		mtimeMs,
		nlink,
		size,
		uid
	} : {
		name,
		dev,
		gid,
		ino,
		isDirectory,
		isFile,
		isSymbolicLink,
		mode,
		mtimeMs,
		nlink,
		size,
		uid
	}, "exactIdentity", { value: exactIdentity });
}
async function createRootDirectoryObservationGuard(root, directory) {
	const guard = await createAsyncDirectoryGuard(directory, { bigint: true });
	const admittedRealPath = admitPathInsideRoot({
		rootPath: root.rootReal,
		candidatePath: guard.realPath,
		rootIdentity: root.rootIdentity
	});
	if (!admittedRealPath) throw new FsSafeError("outside-workspace", "directory is outside workspace root");
	guard.dir = admittedRealPath.path;
	guard.realPath = admittedRealPath.path;
	return guard;
}
function directoryChangedError(error) {
	if (error instanceof FsSafeError && error.code === "path-mismatch") return error;
	return new FsSafeError("path-mismatch", "directory changed during operation", errorCauseOptions(error));
}
async function assertRootDirectoryObservationGuard(root, guard) {
	if (isNativeDirectoryObservationGuard(guard)) throw new FsSafeError("path-mismatch", "native directory observation cannot be revalidated");
	const identity = "identity" in guard ? guard.identity : guard.stat;
	if (guard.dir === root.rootReal && identity.dev === root.rootIdentity.dev && identity.ino === root.rootIdentity.ino) {
		try {
			if ("identity" in guard) assertDirectoryObservationGuardSync(guard);
			else await assertAsyncDirectoryGuard(guard);
		} catch (error) {
			throw rootPathChangedError(error instanceof Error ? error : void 0);
		}
		return;
	}
	if ("identity" in guard && typeof root.rootIdentity.dev === "bigint" && typeof root.rootIdentity.ino === "bigint") try {
		assertDirectoryObservationSync(root.rootReal, root.rootIdentity);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
	else await assertRootIdentityCurrent(root);
	try {
		if ("identity" in guard) assertDirectoryObservationGuardSync(guard);
		else await assertAsyncDirectoryGuard(guard);
	} catch (error) {
		throw directoryChangedError(error);
	}
}
function assertReceiptDirectoryGuardSync(root, guard, backend) {
	if (backend) {
		const observed = inspectNativeDirectoryObservation(backend, guard.dir, guard.identity);
		const admitted = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: observed.realPath,
			rootIdentity: root.rootIdentity
		});
		if (!admitted || admitted.path !== guard.realPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
		return;
	}
	if (isNativeDirectoryObservationGuard(guard)) throw new FsSafeError("path-mismatch", "native directory observation cannot be revalidated");
	assertDirectoryObservationGuardSync(guard);
}
/**
* Close an operation-local traversal receipt with fresh exact observations.
* Descendant canonical paths are admitted while the receipt is created. The
* final directory check repeats canonical admission; the Root-only case does
* both its identity and canonical check here.
*/
function assertRootPathObservationReceiptCurrent(root, receipt, finalTarget) {
	const { rootGuard, directoryGuard } = receipt;
	if (rootGuard.dir !== root.rootReal || rootGuard.realPath !== root.rootReal || rootGuard.identity.dev !== root.rootIdentity.dev || rootGuard.identity.ino !== root.rootIdentity.ino) throw rootPathChangedError();
	if (rootGuard.dir === directoryGuard.dir && rootGuard.realPath === directoryGuard.realPath && rootGuard.identity.dev === directoryGuard.identity.dev && rootGuard.identity.ino === directoryGuard.identity.ino) {
		try {
			if (receipt.kind === "stat" && receipt.target === rootGuard && finalTarget && !receipt.directoryObserver) {
				if (finalTarget.isSymbolicLink() || !finalTarget.isDirectory() || realpathSync$1.native(rootGuard.dir) !== rootGuard.realPath) throw new FsSafeError("path-mismatch", "root path changed during operation");
			} else assertReceiptDirectoryGuardSync(root, directoryGuard, receipt.directoryObserver);
		} catch (error) {
			throw rootPathChangedError(error instanceof Error ? error : void 0);
		}
		return;
	}
	try {
		assertDirectoryObservationSync(rootGuard.dir, rootGuard.identity);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
	try {
		assertReceiptDirectoryGuardSync(root, directoryGuard, receipt.directoryObserver);
	} catch (error) {
		throw directoryChangedError(error);
	}
}
function normalizeDirectoryError(error) {
	if (isNotFoundPathError(error)) return new FsSafeError("not-found", "directory not found", errorCauseOptions(error));
	return error;
}
async function listDirectoryPath(root, directory, withFileTypes, receipt) {
	let guard;
	if (receipt) guard = directoryGuardFromReceipt(directory, receipt);
	else try {
		guard = await createRootDirectoryObservationGuard(root, directory);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "not-file") throw new FsSafeError("not-found", "directory not found", { cause: error });
		throw normalizeDirectoryError(error);
	}
	return await listGuardedDirectoryPath(root, guard, withFileTypes, receipt);
}
function directoryGuardFromReceipt(directory, receipt) {
	if (receipt.kind !== "directory" || receipt.targetPath !== directory || receipt.directoryGuard.dir !== directory || receipt.target !== receipt.directoryGuard || !isNativeDirectoryObservationGuard(receipt.directoryGuard) && !receipt.directoryGuard.stat.isDirectory()) throw new FsSafeError("path-mismatch", "directory observation receipt does not match target");
	return receipt.directoryGuard;
}
async function listGuardedDirectoryPath(root, guard, withFileTypes, receipt) {
	let entries;
	try {
		const beforeObservation = getFsSafeTestHooks()?.beforeRootListObservation;
		if (beforeObservation) await beforeObservation(guard.realPath, withFileTypes);
		const names = (await readDirectoryNames(guard.realPath)).sort();
		if (withFileTypes) {
			const prefix = guard.realPath.endsWith(path.sep) ? guard.realPath : `${guard.realPath}${path.sep}`;
			entries = names.map((name) => pathStatFromStats(fs.lstatSync(`${prefix}${name}`, { bigint: true }), name));
		} else entries = names;
	} catch (error) {
		if (receipt) assertRootPathObservationReceiptCurrent(root, receipt);
		else await assertRootDirectoryObservationGuard(root, guard);
		throw normalizeDirectoryError(error);
	}
	if (receipt) assertRootPathObservationReceiptCurrent(root, receipt);
	else await assertRootDirectoryObservationGuard(root, guard);
	return entries;
}
async function openRootDirectoryListing(root, directory, options, receipt) {
	if (options.exactIdentity && options.order !== "filesystem") throw new TypeError("exact entry identities require filesystem order");
	let guard;
	if (receipt) guard = directoryGuardFromReceipt(directory, receipt);
	else {
		const admitted = await createRootDirectoryObservationGuard(root, directory).catch((error) => {
			throw normalizeDirectoryError(error);
		});
		guard = extendDirectoryObservationGuard({
			stat: admitted.stat,
			identity: {
				dev: admitted.stat.dev,
				ino: admitted.stat.ino
			}
		}, admitted.dir, admitted.realPath);
	}
	const assertCurrent = async () => {
		options.signal?.throwIfAborted();
		if (receipt) assertRootPathObservationReceiptCurrent(root, receipt);
		else await assertRootDirectoryObservationGuard(root, guard);
		options.signal?.throwIfAborted();
	};
	const paths = {
		directory: guard.realPath,
		names: /* @__PURE__ */ new Map()
	};
	const previousPaths = options.previousPaths?.directory === guard.realPath ? options.previousPaths.names : void 0;
	let handle;
	let names;
	let snapshot;
	let index = 0, preparedIndex = 0;
	let prepared = [];
	const synchronousNames = options.exactIdentity && !process.versions.bun && !process.versions.deno;
	let pendingFailure;
	let pendingLimit;
	let preparedBatch = false;
	const close = async () => {
		const owned = handle;
		handle = void 0;
		try {
			await owned?.close();
		} catch (error) {
			options.onCleanupFailure?.(error);
			throw error;
		}
	};
	try {
		await assertCurrent();
		if (options.order === "filesystem") handle = await openDirectoryNames(guard.realPath);
		else if (options.snapshot) snapshot = await listGuardedDirectoryPath(root, guard, true, receipt);
		else if (options.maxNames !== void 0) {
			names = [];
			handle = await openDirectoryNames(guard.realPath);
			while (true) {
				await assertCurrent();
				const name = await readDirectoryEntryName(handle);
				await assertCurrent();
				if (name === void 0) break;
				if (names.length >= options.maxNames) throw new FsSafeError("too-large", "directory entry budget exceeded");
				names.push(name);
			}
			await close();
		} else names = (await fs$1.readdir(guard.realPath, { encoding: "buffer" })).map(directoryEntryName);
		await assertCurrent();
		names?.sort();
	} catch (error) {
		const operationError = normalizeDirectoryError(error);
		try {
			await close();
		} catch (closeError) {
			throw createSuppressedError(closeError, operationError, "directory setup and close both failed");
		}
		throw operationError;
	}
	const prepareBatch = async (sortedNames) => {
		let name = sortedNames[index++];
		if (name === void 0) {
			await assertCurrent();
			return;
		}
		if (!options.admitEntry()) {
			pendingLimit = name;
			return;
		}
		if (preparedBatch) await setImmediate();
		await assertCurrent();
		preparedBatch = true;
		prepared = [];
		preparedIndex = 0;
		while (true) {
			try {
				const entry = pathStatFromStats(fs.lstatSync(path.join(guard.realPath, name), { bigint: true }), name);
				prepared.push(entry);
				if (entry.isDirectory || entry.isSymbolicLink || prepared.length >= (options.metadataBatchSize ?? METADATA_BATCH_SIZE)) break;
			} catch (error) {
				pendingFailure = { error: normalizeDirectoryError(error) };
				break;
			}
			name = sortedNames[index++];
			if (name === void 0) break;
			if (!options.admitEntry()) {
				pendingLimit = name;
				break;
			}
		}
		try {
			await assertCurrent();
		} catch (error) {
			if (pendingFailure) throw createSuppressedError(error, pendingFailure.error, "directory observation and identity checks both failed");
			throw error;
		}
	};
	const nextSnapshot = snapshot ? () => {
		try {
			options.signal?.throwIfAborted();
			const entry = snapshot[index++];
			if (!entry) return;
			return options.admitEntry() ? {
				kind: "entry",
				entry
			} : {
				kind: "limit",
				name: entry.name
			};
		} catch (error) {
			throw normalizeDirectoryError(error);
		}
	} : void 0;
	return {
		paths,
		assertCurrent,
		nextSnapshot,
		async next() {
			try {
				if (nextSnapshot) return nextSnapshot();
				options.signal?.throwIfAborted();
				if (names) {
					if (preparedIndex >= prepared.length && !pendingFailure && pendingLimit === void 0) await prepareBatch(names);
					const entry = prepared[preparedIndex++];
					if (entry) return {
						kind: "entry",
						entry
					};
					if (pendingFailure) throw pendingFailure.error;
					if (pendingLimit !== void 0) return {
						kind: "limit",
						name: pendingLimit
					};
					return;
				}
				for (;;) {
					if (synchronousNames && index++ % METADATA_BATCH_SIZE === 31) await setImmediate();
					await assertCurrent();
					const name = await readDirectoryEntryName(handle, synchronousNames);
					await assertCurrent();
					if (name === void 0) return;
					if (!options.admitEntry()) return {
						kind: "limit",
						name
					};
					const pathname = previousPaths?.get(name) ?? path.join(guard.realPath, name);
					if (options.exactIdentity) paths.names.set(name, pathname);
					let observed;
					try {
						observed = options.exactIdentity ? inspectStatObservationSync((bigint) => bigint ? fs.lstatSync(pathname, { bigint: true }) : fs.lstatSync(pathname)) : { stat: fs.lstatSync(pathname, { bigint: true }) };
					} catch (error) {
						await assertCurrent();
						if (options.skipVanished && isNotFoundPathError(error)) continue;
						throw error;
					}
					await assertCurrent();
					return {
						kind: "entry",
						entry: pathStatFromStats(observed.stat, name),
						identity: observed.identity
					};
				}
			} catch (error) {
				throw normalizeDirectoryError(error);
			}
		},
		[Symbol.asyncDispose]: close
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-path-stat.js
function singleLinkFileIdentity(stat) {
	if (!stat?.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 && stat.nlink !== 1n) return;
	const exact = (value) => typeof value === "bigint" ? value : Number.isSafeInteger(value) ? BigInt(value) : void 0;
	const dev = exact(stat.dev), ino = exact(stat.ino);
	if (dev === void 0 || ino === void 0 || dev < 0n || ino < 0n || process.platform === "win32" && (dev === 0n || ino === 0n)) return;
	return {
		dev,
		ino
	};
}
async function captureChangedObservedFile(error, pathname, before, observed, assertParents, proof) {
	try {
		const previous = singleLinkFileIdentity(before), current = singleLinkFileIdentity(observed);
		if (!previous || !current || previous.dev === current.dev && previous.ino === current.ino) return;
		await assertParents();
		proof.failure = {
			error,
			kind: `stat-leaf-changed:${pathname}`
		};
	} catch {}
}
async function missingObservedFileError(cause, pathname, before, assertParents, proof) {
	const failure = new FsSafeError("path-mismatch", "file changed during operation", errorCauseOptions(cause));
	if (hasNodeErrorCode(cause, "ENOENT") && before?.isFile() && !before.isSymbolicLink() && (before.nlink === 1 || before.nlink === 1n)) try {
		await assertParents();
		proof.failure = {
			error: failure,
			kind: `stat-leaf-missing:${pathname}`
		};
	} catch {}
	return failure;
}
async function statResolvedPathInRoot(root, resolvedPath, receipt) {
	const proof = {};
	try {
		return await fileObservation().run(async () => {
			let admittedTarget = false;
			try {
				let parentGuard;
				let expected;
				if (receipt) {
					if (receipt.kind !== "stat" || receipt.targetPath !== resolvedPath) throw new FsSafeError("path-mismatch", "file observation receipt does not match target");
				} else {
					const guardPath = resolvedPath === root.rootReal ? root.rootReal : path.dirname(resolvedPath);
					parentGuard = guardPath === root.rootReal && root.rootGuard ? root.rootGuard : await createRootDirectoryObservationGuard(root, guardPath);
					try {
						const beforeInitialObservation = getFsSafeTestHooks()?.beforeRootStatInitialObservation;
						if (beforeInitialObservation) await beforeInitialObservation(resolvedPath);
						expected = inspectFileIdentitySync(() => fs.lstatSync(resolvedPath, { bigint: true }));
						if (expected.isSymbolicLink()) throw new FsSafeError("path-mismatch", "file changed during operation");
					} catch (error) {
						await assertRootDirectoryObservationGuard(root, parentGuard);
						throw error;
					}
				}
				admittedTarget = true;
				const beforeObservation = getFsSafeTestHooks()?.beforeRootStatObservation;
				if (beforeObservation) await beforeObservation(resolvedPath);
				let observed;
				let sample, samples = 0;
				const comparison = fileObservation();
				const inspect = (bigint = true) => {
					sample = bigint ? fs.lstatSync(resolvedPath, { bigint: true }) : fs.lstatSync(resolvedPath);
					samples += 1;
					return sample;
				};
				try {
					observed = comparison.run(() => receipt ? assertStatObservationSync(inspect, receipt.target.identity) : inspectFileIdentitySync(inspect, expected));
				} catch (error) {
					if (isNotFoundPathError(error)) throw await missingObservedFileError(error, resolvedPath, receipt ? "stat" in receipt.target ? receipt.target.stat : void 0 : expected, () => receipt ? assertRootPathObservationReceiptCurrent(root, receipt) : assertRootDirectoryObservationGuard(root, parentGuard), proof);
					if (comparison.has(error, "identity")) await captureChangedObservedFile(error, resolvedPath, receipt ? "stat" in receipt.target ? receipt.target.stat : void 0 : expected, samples === 1 ? sample : void 0, () => receipt ? assertRootPathObservationReceiptCurrent(root, receipt) : assertRootDirectoryObservationGuard(root, parentGuard), proof);
					throw error;
				}
				if (observed.isSymbolicLink()) throw new FsSafeError("path-mismatch", "file changed during operation");
				if (receipt) assertRootPathObservationReceiptCurrent(root, receipt, observed);
				else await assertRootDirectoryObservationGuard(root, parentGuard);
				return pathStatFromStats(observed);
			} catch (error) {
				if (!admittedTarget && isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
				throw error;
			}
		});
	} catch (error) {
		const failure = proof.failure;
		if (failure && failure.error === error) recordFileObservationFailure(error, failure.kind);
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-entries.js
async function* entriesInRoot(root, relativePath, options) {
	const maxEntries = options.maxEntries;
	if (maxEntries !== void 0 && (!Number.isSafeInteger(maxEntries) || maxEntries < 0)) throw new RangeError("maxEntries must be a non-negative safe integer");
	if (options.order !== void 0 && options.order !== "filesystem" && options.order !== "sorted") throw new TypeError(`invalid root entries order: ${String(options.order)}`);
	options.signal?.throwIfAborted();
	validatePinnedRelativePath(relativePath);
	const resolved = await resolvePathInRoot(root, relativePath, {
		...readSymlinkResolution(options.symlinks),
		resolveCanonical: true
	});
	options.signal?.throwIfAborted();
	let examined = 0;
	const listing = await openRootDirectoryListing(root, resolved.resolved, {
		order: options.order ?? "filesystem",
		signal: options.signal,
		snapshot: false,
		maxNames: maxEntries,
		metadataBatchSize: 1,
		admitEntry: () => maxEntries === void 0 || examined++ < maxEntries
	});
	let failed = false;
	let operationError;
	try {
		while (true) {
			const next = await listing.next();
			options.signal?.throwIfAborted();
			if (next === void 0) return;
			if (next.kind === "limit") throw new FsSafeError("too-large", "directory entry budget exceeded");
			yield next.entry;
		}
	} catch (error) {
		failed = true;
		operationError = error;
		throw error;
	} finally {
		try {
			await listing[Symbol.asyncDispose]();
		} catch (closeError) {
			if (failed) throw createSuppressedError(closeError, operationError, "directory iteration and close both failed");
			throw closeError;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/json-stringify.js
function stringifyJsonDocument(value, replacer, space) {
	const text = JSON.stringify(value, replacer, space);
	if (typeof text !== "string") throw new TypeError("value is not representable as a JSON document");
	return text;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-walk.js
function filterEntry(options, entry) {
	if (entry.kind === "symlink") return options.symlinkPolicy === "include" ? options.entryFilter?.(entry) ?? "include" : "skip";
	return options.entryFilter?.(entry) ?? "include";
}
function validateBudget(name, value) {
	if (value === void 0) return Number.POSITIVE_INFINITY;
	if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative safe integer`);
	return value;
}
function entryKind(entry) {
	if (entry.isSymbolicLink) return "symlink";
	if (entry.isDirectory) return "directory";
	if (entry.isFile) return "file";
	return "other";
}
function limitEntry(relativePath) {
	return {
		relativePath,
		kind: "truncated",
		size: 0
	};
}
function walkRoot(root, relativePath, options) {
	let maxDepth;
	let maxEntries;
	const visitedDirectories = /* @__PURE__ */ new Set();
	let examined = 0;
	let truncated = false;
	const admitEntry = () => {
		if (examined >= maxEntries) return false;
		examined += 1;
		return true;
	};
	const onLimit = (atPath) => {
		if ((options.limitBehavior ?? "truncate") === "throw") throw new FsSafeError("too-large", `root walk budget exceeded at ${atPath || "."}`);
		truncated = true;
		return limitEntry(atPath);
	};
	const onDirectoryError = (directory, error) => {
		if (options.signal?.aborted || (options.onDirectoryError ?? "throw") === "throw") throw error;
		return {
			relativePath: directory,
			kind: "directory-error",
			size: 0,
			error
		};
	};
	async function* visit(directory, depth, admittedChildPath) {
		if (depth === 0) {
			if (![
				"skip",
				"follow-within-root",
				"include"
			].includes(options.symlinkPolicy)) throw new TypeError(`invalid root walk symlink policy: ${String(options.symlinkPolicy)}`);
			if (options.order !== void 0 && !["sorted", "filesystem"].includes(options.order)) throw new TypeError(`invalid root walk order: ${String(options.order)}`);
			if (options.limitBehavior !== void 0 && !["truncate", "throw"].includes(options.limitBehavior)) throw new TypeError(`invalid root walk limit behavior: ${String(options.limitBehavior)}`);
			if (options.onDirectoryError !== void 0 && !["throw", "skip-and-report"].includes(options.onDirectoryError)) throw new TypeError(`invalid root walk directory error behavior: ${String(options.onDirectoryError)}`);
			maxDepth = validateBudget("maxDepth", options.maxDepth);
			maxEntries = validateBudget("maxEntries", options.maxEntries);
		}
		options.signal?.throwIfAborted();
		let listing;
		let canonicalDirectory;
		try {
			const expandedDirectory = depth === 0 ? await expandRelativePathWithHome(directory) : directory;
			const noFollowChildSymlinks = depth > 0 && options.symlinkPolicy !== "follow-within-root";
			const includeChild = depth > 0 && options.symlinkPolicy === "include";
			const resolution = {
				absolutePath: admittedChildPath ?? path.resolve(root.rootReal, expandedDirectory),
				rootPath: root.rootReal,
				rootCanonicalPath: root.rootReal,
				boundaryLabel: "root walk",
				policy: noFollowChildSymlinks ? ROOT_PATH_ALIAS_POLICIES.unlinkTarget : void 0
			};
			let receipt;
			let resolvedDirectory;
			if (includeChild) {
				const rootGuard = await root.observeRoot();
				const observed = await resolveRootPathWithObservation({
					...resolution,
					rootIdentity: rootGuard.identity
				}, {
					kind: "directory",
					rootGuard
				});
				resolvedDirectory = observed.resolved;
				receipt = observed.receipt;
			} else resolvedDirectory = await resolveRootPath(resolution);
			if (noFollowChildSymlinks && resolvedDirectory.kind === "symlink") {
				if (options.symlinkPolicy === "skip") return;
				throw new FsSafeError("path-mismatch", `root walk directory became a symlink: ${directory}`);
			}
			if (!resolvedDirectory.exists || resolvedDirectory.kind !== "directory") throw new FsSafeError("not-file", `root walk path is not a directory: ${directory || "."}`);
			if (includeChild && (!receipt || receipt.directoryGuard.realPath !== resolvedDirectory.canonicalPath)) throw new FsSafeError("path-mismatch", "root walk directory observation was not retained");
			canonicalDirectory = resolvedDirectory.canonicalPath;
			if (visitedDirectories.has(resolvedDirectory.canonicalPath)) return;
			visitedDirectories.add(resolvedDirectory.canonicalPath);
			options.signal?.throwIfAborted();
			const listingDirectory = path.relative(root.rootReal, resolvedDirectory.canonicalPath).split(path.sep).join(path.posix.sep);
			if (depth === 0 && expandedDirectory !== directory) directory = listingDirectory;
			listing = await root.list(`./${listingDirectory}`, {
				order: options.order ?? "sorted",
				signal: options.signal,
				snapshot: maxEntries === Number.POSITIVE_INFINITY,
				admitEntry
			}, receipt);
		} catch (error) {
			yield onDirectoryError(directory, error instanceof RootPathObservationError ? error.error : error);
			return;
		}
		let failed = false;
		let operationError;
		try {
			const relativeDirectory = path.posix.normalize(directory.split(path.sep).join(path.posix.sep));
			const childPrefix = relativeDirectory === "." || relativeDirectory === "./" ? "" : relativeDirectory.endsWith("/") ? relativeDirectory : `${relativeDirectory}/`;
			while (true) {
				let next;
				try {
					next = listing.nextSnapshot ? listing.nextSnapshot() : await listing.next();
					options.signal?.throwIfAborted();
				} catch (error) {
					yield onDirectoryError(directory, error);
					return;
				}
				if (next === void 0) return;
				const name = next.kind === "entry" ? next.entry.name : next.name;
				const child = childPrefix + name;
				if (next.kind === "limit") {
					yield onLimit(child);
					return;
				}
				const entry = next.entry;
				let kind = entryKind(entry);
				let size = entry.size;
				if (kind === "symlink" && options.symlinkPolicy === "skip") continue;
				if (kind === "symlink" && options.symlinkPolicy === "follow-within-root") {
					const resolved = await resolveRootPath({
						absolutePath: path.resolve(root.rootReal, child),
						rootPath: root.rootReal,
						rootCanonicalPath: root.rootReal,
						boundaryLabel: "root walk"
					});
					if (!resolved.exists) continue;
					const target = await root.stat(`./${path.relative(root.rootReal, resolved.canonicalPath)}`);
					kind = target.isDirectory ? "directory" : target.isFile ? "file" : "other";
					size = target.size;
				}
				const walkEntry = {
					relativePath: child,
					kind,
					size
				};
				let filterResult = filterEntry(options, walkEntry);
				if (typeof filterResult !== "string") {
					filterResult = await filterResult ?? "include";
					options.signal?.throwIfAborted();
					try {
						await listing.assertCurrent();
					} catch (error) {
						yield onDirectoryError(directory, error);
						return;
					}
				}
				options.signal?.throwIfAborted();
				if (![
					"include",
					"skip",
					"skip-subtree"
				].includes(filterResult)) throw new TypeError(`invalid root walk entryFilter result: ${String(filterResult)}`);
				if (filterResult === "include") yield walkEntry;
				if (kind !== "directory") continue;
				if (filterResult === "skip-subtree") continue;
				if (depth >= maxDepth) {
					yield onLimit(child);
					return;
				}
				yield* visit(child, depth + 1, options.symlinkPolicy === "include" ? path.join(canonicalDirectory, name) : void 0);
				if (truncated) return;
			}
		} catch (error) {
			failed = true;
			operationError = error;
			throw error;
		} finally {
			try {
				await listing[Symbol.asyncDispose]();
			} catch (closeError) {
				if (failed) throw createSuppressedError(closeError, operationError, "directory walk and close both failed");
				throw closeError;
			}
		}
	}
	return visit(relativePath, 0);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-remove-identity.js
const MAX_SAFE_DIRECTORY_IDENTITY = BigInt(Number.MAX_SAFE_INTEGER);
function identityMismatch(cause) {
	return new FsSafeError("path-mismatch", "removal ancestor identity changed or could not be verified", errorCauseOptions(cause));
}
function safeIdentityNumber(value) {
	if (value < 0n || value > MAX_SAFE_DIRECTORY_IDENTITY) return void 0;
	return Number(value);
}
function createRemovalDirectoryAssertion(path, identity, realPath, platform = process.platform) {
	const dev = safeIdentityNumber(identity.dev);
	const ino = safeIdentityNumber(identity.ino);
	const numeric = dev !== void 0 && ino !== void 0 && (platform !== "win32" || dev !== 0 && ino !== 0);
	return Object.freeze({
		path,
		dev: identity.dev,
		ino: identity.ino,
		numericDev: numeric ? dev : void 0,
		numericIno: numeric ? ino : void 0,
		platform,
		realPath
	});
}
function assertDirectoryType(stat) {
	if (typeof stat?.isDirectory !== "function" || typeof stat.isSymbolicLink !== "function") throw identityMismatch();
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
}
function assertExactObservation(stat, expected, platform) {
	assertDirectoryType(stat);
	if (typeof stat.dev !== "bigint" || typeof stat.ino !== "bigint") throw identityMismatch();
	if (platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw identityMismatch();
	if (stat.dev !== expected.dev || stat.ino !== expected.ino) throw identityMismatch();
}
function assertNumericObservation(assertion) {
	const stat = fs.lstatSync(assertion.path);
	assertDirectoryType(stat);
	if (!Number.isSafeInteger(stat.dev) || stat.dev < 0 || !Number.isSafeInteger(stat.ino) || stat.ino < 0) throw identityMismatch();
	let unknown = false;
	const observedDev = stat.dev;
	const expectedDev = assertion.numericDev;
	if (assertion.platform === "win32" && observedDev === 0) unknown = true;
	else if (observedDev !== expectedDev) throw identityMismatch();
	const observedIno = stat.ino;
	const expectedIno = assertion.numericIno;
	if (assertion.platform === "win32" && observedIno === 0) unknown = true;
	else if (observedIno !== expectedIno) throw identityMismatch();
	if (unknown) assertExactObservation(fs.lstatSync(assertion.path, { bigint: true }), assertion, assertion.platform);
}
function assertRemovalDirectoryCurrent(assertion) {
	if (assertion.numericDev !== void 0 && assertion.numericIno !== void 0) assertNumericObservation(assertion);
	else inspectDirectoryIdentitySync(assertion.path, assertion, void 0, assertion.platform);
	if (assertion.realPath !== void 0 && realpathSync$1.native(assertion.path) !== assertion.realPath) throw identityMismatch();
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-remove.js
const DEFAULT_MAX_ENTRIES = 1e5;
const DEFAULT_MAX_DEPTH = 64;
const nonrecursiveRemovalKind = Symbol("nonrecursive removal kind");
function validateRemoveOptions(options) {
	if (options.order !== void 0 && options.order !== "filesystem" && options.order !== "sorted") throw new TypeError("remove order must be filesystem or sorted");
	for (const key of ["maxEntries", "maxDepth"]) {
		const value = options[key];
		if (value !== void 0 && value !== Number.POSITIVE_INFINITY && (!Number.isSafeInteger(value) || value < 0)) throw new RangeError(`${key} must be a non-negative safe integer`);
	}
	if (!options.recursive && (options.maxEntries !== void 0 || options.maxDepth !== void 0)) throw new TypeError("remove budgets require recursive: true");
	if (!options.recursive && options.order !== void 0) throw new TypeError("remove order requires recursive: true");
}
function assertNotAborted(signal) {
	try {
		signal?.throwIfAborted();
	} catch (error) {
		throw new MutationAuthorityError(error);
	}
}
function removalAncestorChanged(error) {
	return new FsSafeError("path-mismatch", "removal ancestor changed during operation", errorCauseOptions(error));
}
function sameCanonicalDirectory(left, right) {
	return left === right || isPathInside(left, right) && isPathInside(right, left);
}
function assertExactRemovalReceiptPrefixCurrent(rootGuard, intermediates) {
	try {
		assertSyncDirectoryGuard(rootGuard);
		for (const receipt of intermediates) inspectDirectoryIdentitySync(receipt.path, receipt);
	} catch (error) {
		throw removalAncestorChanged(error);
	}
}
async function assertMissingRemovalPrefixCurrent(rootGuard, intermediates) {
	if (intermediates.length === 0) {
		assertExactRemovalReceiptPrefixCurrent(rootGuard, intermediates);
		return;
	}
	const deepest = intermediates[intermediates.length - 1];
	assertExactRemovalReceiptPrefixCurrent(rootGuard, intermediates.slice(0, -1));
	let deepestGuard;
	try {
		deepestGuard = await createAsyncDirectoryGuard(deepest.path, { bigint: true });
	} catch (error) {
		throw removalAncestorChanged(error);
	}
	if (!sameFileIdentityForCleanup(deepestGuard.stat, deepest) || !sameCanonicalDirectory(deepestGuard.realPath, deepest.path)) throw removalAncestorChanged();
}
async function captureNonrecursiveRemovalAdmission(root, targetPath, options, receipts) {
	const parentPath = path.dirname(targetPath);
	if (!isPathInside(root.rootReal, parentPath)) throw new FsSafeError("path-mismatch", "removal parent is outside the retained root");
	const retained = receipts?.complete(root.rootReal, targetPath);
	let rootGuard;
	try {
		rootGuard = retained && parentPath !== root.rootReal ? {
			dir: root.rootReal,
			realPath: root.rootReal,
			stat: retained.rootStat
		} : await createAsyncDirectoryGuard(root.rootReal, {
			bigint: true,
			initial: retained?.rootStat
		});
	} catch (error) {
		if (options.force && isNotFoundPathError(error)) await assertRootIdentityCurrent(root);
		throw normalizeRemoveGuardError(error);
	}
	if (!sameFileIdentityForCleanup(rootGuard.stat, root.rootIdentity)) throw rootPathChangedError();
	if (parentPath === root.rootReal) {
		const rootAssertion = createRemovalDirectoryAssertion(rootGuard.dir, rootGuard.stat, rootGuard.realPath);
		return Object.freeze({
			parentIdentity: rootAssertion,
			assertAfterMutation() {
				assertRemovalDirectoryCurrent(rootAssertion);
			},
			assertCurrent() {
				try {
					assertRemovalDirectoryCurrent(rootAssertion);
				} catch (error) {
					throw removalAncestorChanged(error);
				}
			}
		});
	}
	const intermediates = [];
	const retainedDirectories = retained?.directories;
	const freshSegments = retainedDirectories ? void 0 : path.relative(root.rootReal, parentPath).split(path.sep).filter(Boolean).slice(0, -1);
	const intermediateCount = retainedDirectories ? Math.max(0, retainedDirectories.length - 1) : freshSegments.length;
	let freshAncestor = root.rootReal;
	for (let index = 0; index < intermediateCount; index += 1) {
		const retainedDirectory = retainedDirectories?.[index];
		const ancestor = retainedDirectory?.path ?? (freshAncestor = path.join(freshAncestor, freshSegments[index]));
		try {
			const stat = inspectDirectoryIdentitySync(ancestor, void 0, retainedDirectory?.stat);
			intermediates.push(createRemovalDirectoryAssertion(ancestor, stat));
		} catch (error) {
			if (isNotFoundPathError(error)) {
				await assertMissingRemovalPrefixCurrent(rootGuard, intermediates);
				assertNotAborted(options.signal);
				if (options.force) return void 0;
			}
			throw normalizeRemoveGuardError(error);
		}
	}
	let parentGuard;
	try {
		parentGuard = await createAsyncDirectoryGuard(retained?.parent?.path ?? parentPath, {
			bigint: true,
			initial: retained?.parent?.stat
		});
	} catch (error) {
		if (isNotFoundPathError(error)) {
			await assertMissingRemovalPrefixCurrent(rootGuard, intermediates);
			assertNotAborted(options.signal);
			if (options.force) return void 0;
		}
		throw normalizeRemoveGuardError(error);
	}
	if (!sameCanonicalDirectory(parentGuard.realPath, parentPath)) throw removalAncestorChanged();
	const canonicalParentCoversRoot = retained !== void 0 && parentGuard.realPath === parentPath;
	if (retained && !canonicalParentCoversRoot) try {
		rootGuard = await createAsyncDirectoryGuard(root.rootReal, {
			bigint: true,
			initial: retained.rootStat
		});
	} catch (error) {
		if (options.force && isNotFoundPathError(error)) await assertRootIdentityCurrent(root);
		throw normalizeRemoveGuardError(error);
	}
	const rootAssertion = createRemovalDirectoryAssertion(rootGuard.dir, rootGuard.stat, canonicalParentCoversRoot ? void 0 : rootGuard.realPath);
	const parentAssertion = createRemovalDirectoryAssertion(parentGuard.dir, parentGuard.stat, parentGuard.realPath);
	const assertPrefixCurrent = () => {
		try {
			assertRemovalDirectoryCurrent(rootAssertion);
			for (const assertion of intermediates) assertRemovalDirectoryCurrent(assertion);
		} catch (error) {
			throw removalAncestorChanged(error);
		}
	};
	return Object.freeze({
		parentIdentity: parentAssertion,
		assertAfterMutation() {
			assertPrefixCurrent();
			assertRemovalDirectoryCurrent(parentAssertion);
		},
		assertCurrent() {
			assertPrefixCurrent();
			try {
				assertRemovalDirectoryCurrent(parentAssertion);
			} catch (error) {
				throw removalAncestorChanged(error);
			}
		}
	});
}
async function removeOne(root, targetPath, options, receipts) {
	const admission = await captureNonrecursiveRemovalAdmission(root, targetPath, options, receipts);
	if (!admission) return;
	try {
		await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("remove", targetPath);
		admission.assertCurrent();
	} catch (error) {
		throw normalizeRemoveGuardError(error);
	}
	try {
		const identity = options.assertBeforeMutation ? inspectFileIdentitySync(() => fs.lstatSync(targetPath, { bigint: true })) : void 0;
		const isDirectory = (identity ?? fs.lstatSync(targetPath)).isDirectory();
		if (!isDirectory && options[nonrecursiveRemovalKind] === "directory") throw new FsSafeError("path-mismatch", "store entry is no longer a directory");
		assertFinalSymlinkRejected(targetPath, options.mutationSymlinks !== void 0);
		assertNotAborted(options.signal);
		options.assertBeforeMutation?.();
		if (identity) {
			assertNotAborted(options.signal);
			admission.assertCurrent();
			inspectFileIdentitySync(() => fs.lstatSync(targetPath, { bigint: true }), identity);
			assertFinalSymlinkRejected(targetPath, options.mutationSymlinks !== void 0);
		}
		await (isDirectory ? fs$1.rmdir(targetPath) : fs$1.unlink(targetPath));
	} catch (error) {
		if (!(options.force && isNotFoundPathError(error))) throw normalizeRemovePathError(error);
	}
	try {
		admission.assertAfterMutation();
	} catch (error) {
		throw normalizeRemoveGuardError(error);
	}
	assertNotAborted(options.signal);
}
async function removePathInRootFallback(root, targetPath, options, receipts) {
	assertNotAborted(options.signal);
	if (!options.recursive) {
		await removeOne(root, targetPath, options, receipts);
		return;
	}
	const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
	const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
	const details = (target, phase) => ({
		operation: "remove",
		phase,
		relativePath: path.relative(targetPath, target)
	});
	let examined = 0;
	const rootGuard = await createAsyncDirectoryGuard(root.rootReal, { bigint: true });
	if (!sameFileIdentityForCleanup(rootGuard.stat, root.rootIdentity)) throw rootPathChangedError();
	const guards = [createRemovalDirectoryAssertion(rootGuard.dir, rootGuard.stat, rootGuard.realPath)];
	let ancestor = root.rootReal;
	const parentRelative = path.relative(root.rootReal, path.dirname(targetPath));
	for (const segment of parentRelative.split(path.sep).filter(Boolean)) {
		ancestor = path.join(ancestor, segment);
		let guard;
		try {
			guard = await createAsyncDirectoryGuard(ancestor, { bigint: true });
		} catch (error) {
			if (isNotFoundPathError(error)) {
				assertCurrent();
				assertNotAborted(options.signal);
				if (options.force) return;
			}
			throw normalizeRemoveGuardError(error);
		}
		if (!isPathInside(guard.realPath, ancestor) || !isPathInside(ancestor, guard.realPath)) throw new FsSafeError("path-mismatch", "removal ancestor changed during operation");
		guards.push(createRemovalDirectoryAssertion(guard.dir, guard.stat, guard.realPath));
	}
	function assertCurrent() {
		for (const guard of guards) try {
			assertRemovalDirectoryCurrent(guard);
		} catch (error) {
			throw new FsSafeError("path-mismatch", "removal ancestor changed during operation", { cause: error });
		}
	}
	const inspect = (target, expected) => {
		assertCurrent();
		try {
			return inspectFileIdentitySync(() => fs.lstatSync(target, { bigint: true }), expected);
		} catch (error) {
			if (options.force && isNotFoundPathError(error)) return;
			throw normalizeRemovePathError(error, details(target, expected ? "remove" : "inspect"));
		}
	};
	async function visit(target, depth, entryCounted = false) {
		assertNotAborted(options.signal);
		if (!entryCounted && examined >= maxEntries || depth > maxDepth) throw new FsSafeError("too-large", "recursive removal budget exceeded", { details: details(target, "inspect") });
		if (!entryCounted) examined += 1;
		await assertMutationNotDenied(target, options.denyMutations, { protectAncestors: true });
		assertNotAborted(options.signal);
		const initial = inspect(target);
		if (!initial) return;
		assertFinalSymlinkRejected(target, options.mutationSymlinks !== void 0, details(target, "inspect"));
		if (initial.isDirectory()) {
			let directoryGuard;
			try {
				directoryGuard = await createAsyncDirectoryGuard(target, { bigint: true });
			} catch (error) {
				assertCurrent();
				assertNotAborted(options.signal);
				if (options.force && isNotFoundPathError(error)) return;
				throw normalizeRemovePathError(error, details(target, "inspect"));
			}
			if (!isPathInside(directoryGuard.realPath, target) || !isPathInside(target, directoryGuard.realPath) || !sameFileIdentityForCleanup(directoryGuard.stat, initial)) throw new FsSafeError("path-mismatch", "removal directory changed during operation");
			guards.push(createRemovalDirectoryAssertion(directoryGuard.dir, directoryGuard.stat, directoryGuard.realPath));
			try {
				assertCurrent();
				assertNotAborted(options.signal);
				const handle = await fs$1.opendir(target, { bufferSize: 1 }).catch((error) => {
					if (options.force && isNotFoundPathError(error)) {
						assertNotAborted(options.signal);
						return;
					}
					throw normalizeRemovePathError(error, details(target, "enumerate"));
				});
				if (handle) {
					let failed = false;
					let operationError;
					try {
						let names = options.order === "sorted" ? [] : void 0;
						if (names && maxEntries === Infinity) {
							assertCurrent();
							assertNotAborted(options.signal);
							const snapshot = await fs$1.readdir(target).catch((error) => {
								if (options.force && isNotFoundPathError(error)) return void 0;
								throw normalizeRemovePathError(error, details(target, "enumerate"));
							});
							assertNotAborted(options.signal);
							if (snapshot) {
								assertCurrent();
								names = snapshot;
								examined += names.length;
							}
						} else while (true) {
							assertCurrent();
							assertNotAborted(options.signal);
							const entry = await handle.read().catch((error) => {
								if (options.force && isNotFoundPathError(error)) return void 0;
								throw normalizeRemovePathError(error, details(target, "enumerate"));
							});
							if (entry === void 0) {
								assertNotAborted(options.signal);
								if (names) names.length = 0;
								break;
							}
							assertCurrent();
							assertNotAborted(options.signal);
							if (!entry) break;
							if (names) {
								if (examined >= maxEntries) throw new FsSafeError("too-large", "recursive removal budget exceeded", { details: details(path.join(target, entry.name), "enumerate") });
								examined += 1;
								names.push(entry.name);
							} else await visit(path.join(target, entry.name), depth + 1);
						}
						if (names) for (const name of names.sort()) await visit(path.join(target, name), depth + 1, true);
					} catch (error) {
						failed = true;
						operationError = error instanceof MutationAuthorityError ? error.rejection : error;
						throw error;
					} finally {
						try {
							await handle.close();
						} catch (error) {
							const closeError = normalizeRemovePathError(error, details(target, "enumerate"));
							if (failed) throw createSuppressedError(closeError, operationError, "recursive removal and close both failed");
							throw closeError;
						}
					}
				}
			} finally {
				guards.pop();
			}
		}
		await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("remove", target);
		await assertMutationNotDenied(target, options.denyMutations, { protectAncestors: true });
		assertNotAborted(options.signal);
		if (!inspect(target, initial)) return;
		assertFinalSymlinkRejected(target, options.mutationSymlinks !== void 0, details(target, "remove"));
		assertNotAborted(options.signal);
		options.assertBeforeMutation?.();
		if (options.assertBeforeMutation) {
			assertNotAborted(options.signal);
			if (!inspect(target, initial)) return;
			assertFinalSymlinkRejected(target, options.mutationSymlinks !== void 0, details(target, "remove"));
		}
		try {
			await (initial.isDirectory() ? fs$1.rmdir(target) : fs$1.unlink(target));
		} catch (error) {
			if (!(options.force && isNotFoundPathError(error))) throw normalizeRemovePathError(error, details(target, "remove"));
		}
		assertCurrent();
		assertNotAborted(options.signal);
	}
	await assertRootIdentityCurrent(root);
	await visit(targetPath, 0);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-remove-native.js
function unavailable() {
	throw new FsSafeError("helper-unavailable", "native confined removal is unavailable on this platform");
}
function normalize(error, details) {
	if (error instanceof FsSafeError || error instanceof MutationAuthorityError || error instanceof Error && error.name === "SuppressedError") return error;
	const code = error?.code;
	if (code === "path-mismatch") return new FsSafeError("path-mismatch", "removal identity changed", {
		cause: error,
		details
	});
	if ([
		"ENOTSUP",
		"ENOSYS",
		"EOPNOTSUPP"
	].includes(code ?? "")) return new FsSafeError("helper-unavailable", "native confined removal is unavailable", {
		cause: error,
		details
	});
	return normalizeRemovePathError(error, details);
}
async function removeNativeLeaf(binding, parent, target, options, boundary, rootGuardCurrent) {
	const assertNotAborted = () => {
		try {
			options.signal?.throwIfAborted();
		} catch (error) {
			throw new MutationAuthorityError(error);
		}
	};
	assertNotAborted();
	const before = getFsSafeTestHooks()?.beforeRootFallbackMutation;
	if (before) try {
		await before("remove", target);
	} catch (error) {
		throw normalizeRemoveGuardError(error);
	}
	if (options.denyMutations) await assertMutationNotDenied(target, options.denyMutations, { protectAncestors: true });
	const name = path.basename(target);
	const observe = (expected) => {
		assertNotAborted();
		if (!rootGuardCurrent) boundary.assertCurrent();
		rootGuardCurrent = false;
		try {
			const entry = binding.rootRemovalStat(parent.fd, name);
			if (expected && (entry.dev !== expected.dev || entry.ino !== expected.ino || entry.directory !== expected.directory)) throw new FsSafeError("path-mismatch", "removal entry changed");
			if (entry.symlink && options.mutationSymlinks !== void 0) throw new FsSafeError("symlink", "symlink not allowed", { details: {
				operation: "remove",
				phase: expected ? "remove" : "inspect",
				relativePath: ""
			} });
			return entry;
		} catch (error) {
			if (options.force && isNotFoundPathError(error)) return void 0;
			throw normalize(error, {
				operation: "remove",
				phase: expected ? "remove" : "inspect",
				relativePath: ""
			});
		}
	};
	const entry = observe();
	if (!entry) return;
	if (!entry.directory && options[nonrecursiveRemovalKind] === "directory") throw new FsSafeError("path-mismatch", "store entry is no longer a directory");
	if (options.assertBeforeMutation) {
		options.assertBeforeMutation();
		if (!observe(entry)) return;
	}
	try {
		binding.rootRemovalUnlink(parent.fd, name, entry.dev, entry.ino, entry.directory);
	} catch (error) {
		if (!(options.force && isNotFoundPathError(error))) throw normalize(error, {
			operation: "remove",
			phase: "remove",
			relativePath: ""
		});
	}
	boundary.assertAfterMutation();
	assertNotAborted();
}
async function removePathInRootNative(root, target, options, receipts) {
	const binding = getNativeBinding("openBeneath", "rootRemovalStat", "rootRemovalUnlink");
	if (!binding?.rootRemovalStat || !binding.rootRemovalUnlink) unavailable();
	const inspect = binding.rootRemovalStat.bind(binding);
	const unlink = binding.rootRemovalUnlink.bind(binding);
	const openDirectory = binding.openRootRemovalDirectory?.bind(binding);
	const boundary = await captureNonrecursiveRemovalAdmission(root, target, options, receipts);
	if (!boundary) return;
	if (options.recursive && options.maxEntries === 0) {
		options.signal?.throwIfAborted();
		boundary.assertCurrent();
		throw new FsSafeError("too-large", "recursive removal budget exceeded", { details: {
			operation: "remove",
			phase: "inspect",
			relativePath: ""
		} });
	}
	let rootAdmission;
	try {
		rootAdmission = openExactNativeRootAdmissionSync(binding, {
			rootPath: root.rootReal,
			rootIdentity: root.rootIdentity,
			operation: "remove",
			reportCloseErrors: true
		});
	} catch (error) {
		throw normalizeRemoveGuardError(error);
	}
	let parent;
	let initialEntry;
	let initialDirectory;
	let initialDirectoryAttempted = false;
	let operationError;
	let failed = false;
	try {
		const parentPath = path.dirname(target);
		if (!isPathInside(root.rootReal, parentPath)) throw new FsSafeError("outside-workspace", "removal parent is outside root");
		try {
			parent = parentPath === root.rootReal ? borrowNativeRootParent(rootAdmission) : await openNativeParentAdmission(binding, rootAdmission, path.relative(root.rootReal, parentPath).split(path.sep).join("/"), "native-directory");
		} catch (error) {
			assertRootIdentityCurrentSync(root);
			boundary.assertCurrent();
			if (!(options.force && isNotFoundPathError(error))) throw error;
		}
		if (parent) {
			if (parent.guard.stat.dev !== boundary.parentIdentity.dev || parent.guard.stat.ino !== boundary.parentIdentity.ino) throw new FsSafeError("path-mismatch", "removal parent identity changed");
			if (options.recursive) {
				boundary.assertCurrent();
				try {
					initialEntry = inspect(parent.fd, path.basename(target));
				} catch (error) {
					boundary.assertCurrent();
					if (!(options.force && isNotFoundPathError(error))) throw error;
				}
				if (initialEntry?.directory) {
					if (!openDirectory) unavailable();
					initialDirectoryAttempted = true;
					try {
						initialDirectory = openDirectory(parent.fd, path.basename(target), initialEntry.dev, initialEntry.ino);
					} catch (error) {
						boundary.assertCurrent();
						const code = error?.code;
						if ([
							"ENOTSUP",
							"ENOSYS",
							"EOPNOTSUPP"
						].includes(code ?? "")) unavailable();
						else if (!(options.force && isNotFoundPathError(error))) throw normalize(error, {
							operation: "remove",
							phase: "enumerate",
							relativePath: ""
						});
					}
				}
			}
			if (!options.recursive) await removeNativeLeaf(binding, parent, target, options, boundary, parentPath === root.rootReal && !options.signal && !options.denyMutations && !options.assertBeforeMutation && !getFsSafeTestHooks()?.beforeRootFallbackMutation);
			else if (initialEntry) await removeEntries(parent);
		}
	} catch (error) {
		failed = true;
		operationError = error instanceof MutationAuthorityError ? error : normalize(error);
	}
	const closeErrors = [];
	try {
		initialDirectory?.close();
	} catch (error) {
		closeErrors.push(error);
	}
	try {
		parent?.close();
	} catch (error) {
		closeErrors.push(error);
	}
	try {
		await rootAdmission.root.close();
	} catch (error) {
		closeErrors.push(error);
	}
	if (closeErrors.length) {
		const error = closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "removal descriptors could not close");
		if (failed) throw createSuppressedError(error, operationError instanceof MutationAuthorityError ? operationError.rejection : operationError, "removal and descriptor close failed");
		throw error;
	}
	if (failed) throw operationError;
	async function removeEntries(admitted) {
		const guards = [];
		const maxEntries = options.maxEntries ?? 1e5;
		const maxDepth = options.maxDepth ?? 64;
		let examined = 0;
		const details = (entryPath, phase) => ({
			operation: "remove",
			relativePath: path.relative(target, entryPath),
			phase
		});
		async function beforeMutation(entryPath) {
			try {
				await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("remove", entryPath);
			} catch (error) {
				throw normalizeRemoveGuardError(error);
			}
		}
		function assertNotAborted() {
			try {
				options.signal?.throwIfAborted();
			} catch (error) {
				throw new MutationAuthorityError(error);
			}
		}
		function assertTraversalCurrent() {
			for (const guard of guards) try {
				assertRemovalDirectoryCurrent(guard);
			} catch (cause) {
				throw new FsSafeError("path-mismatch", "removal ancestor changed", { cause });
			}
		}
		function assertCurrent() {
			assertNotAborted();
			boundary.assertCurrent();
			assertTraversalCurrent();
		}
		function observe(fd, name, entryPath, expected) {
			assertCurrent();
			try {
				const entry = inspect(fd, name);
				if (expected && (entry.dev !== expected.dev || entry.ino !== expected.ino || entry.directory !== expected.directory)) throw new FsSafeError("path-mismatch", "removal entry changed");
				if (entry.symlink && options.mutationSymlinks !== void 0) throw new FsSafeError("symlink", "symlink not allowed", { details: details(entryPath, expected ? "remove" : "inspect") });
				return entry;
			} catch (error) {
				if (options.force && isNotFoundPathError(error)) return void 0;
				throw normalize(error, details(entryPath, expected ? "remove" : "inspect"));
			}
		}
		async function visit(fd, name, entryPath, depth, counted = false) {
			assertNotAborted();
			if (options.recursive && (!counted && examined >= maxEntries || depth > maxDepth)) throw new FsSafeError("too-large", "recursive removal budget exceeded", { details: details(entryPath, "inspect") });
			if (!counted) examined++;
			await assertMutationNotDenied(entryPath, options.denyMutations, { protectAncestors: true });
			const initial = observe(fd, name, entryPath, depth === 0 ? initialEntry : void 0);
			if (!initial) return;
			if (!initial.directory && options[nonrecursiveRemovalKind] === "directory") throw new FsSafeError("path-mismatch", "store entry is no longer a directory");
			if (initial.directory && options.recursive) {
				let directory;
				try {
					if (depth === 0 && initialDirectoryAttempted) {
						directory = initialDirectory;
						initialDirectory = void 0;
					} else directory = openDirectory(fd, name, initial.dev, initial.ino);
				} catch (error) {
					assertCurrent();
					if (!(options.force && isNotFoundPathError(error))) throw normalize(error, details(entryPath, "enumerate"));
					if (!observe(fd, name, entryPath, initial)) return;
				}
				if (directory) {
					let failure;
					try {
						const stat = fs.fstatSync(directory.fd, { bigint: true });
						const read = () => {
							try {
								return directory.read();
							} catch (error) {
								throw normalize(error, details(entryPath, "enumerate"));
							}
						};
						guards.push(createRemovalDirectoryAssertion(entryPath, stat, entryPath));
						try {
							assertCurrent();
							if (options.order === "sorted") {
								const names = [];
								for (let child = read(); child !== null; child = read()) {
									await scheduler.yield();
									assertCurrent();
									if (examined >= maxEntries) throw new FsSafeError("too-large", "recursive removal budget exceeded", { details: details(path.join(entryPath, child), "enumerate") });
									examined++;
									names.push(child);
								}
								for (const child of names.sort()) await visit(directory.fd, child, path.join(entryPath, child), depth + 1, true);
							} else for (let child = read(); child !== null; child = read()) {
								await scheduler.yield();
								await visit(directory.fd, child, path.join(entryPath, child), depth + 1);
							}
						} finally {
							guards.pop();
						}
					} catch (error) {
						failure = { error: error instanceof MutationAuthorityError ? error.rejection : error };
						throw error;
					} finally {
						try {
							directory.close();
						} catch (error) {
							const closeError = normalize(error, details(entryPath, "enumerate"));
							if (failure) throw createSuppressedError(closeError, failure.error, "removal and directory close failed");
							throw closeError;
						}
					}
				}
			}
			if (options.recursive) {
				await beforeMutation(entryPath);
				await assertMutationNotDenied(entryPath, options.denyMutations, { protectAncestors: true });
				if (!observe(fd, name, entryPath, initial)) return;
			}
			if (options.assertBeforeMutation) {
				options.assertBeforeMutation();
				if (!observe(fd, name, entryPath, initial)) return;
			}
			try {
				unlink(fd, name, initial.dev, initial.ino, initial.directory);
			} catch (error) {
				if (!(options.force && isNotFoundPathError(error))) throw normalize(error, details(entryPath, "remove"));
			}
			boundary.assertCurrent();
			assertTraversalCurrent();
			assertNotAborted();
		}
		await visit(admitted.fd, path.basename(target), target, 0);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-verification.js
async function verifyRootWritePublication(params) {
	try {
		await params.verify();
		params.retention?.retain(params.fd, params.parentGuard, params.nativeParent);
	} catch (error) {
		if (params.retention && params.nativeParent) try {
			params.retention.cleanup(params.fd, params.nativeParent, params.expectedIdentity);
		} catch (cleanupError) {
			throw createSuppressedError(cleanupError, error, "sidecar retention and creator cleanup both failed");
		}
		throw error;
	}
}
async function verifyAtomicWriteResult(params) {
	let needsPathOpen = false;
	const assertFile = (stat) => {
		if (stat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
		if (!stat.isFile()) throw new FsSafeError("not-file", "not a file");
		if (!sameFileIdentity(stat, params.expectedIdentity)) throw new FsSafeError("path-mismatch", "path changed during write");
		if (stat.nlink > 1) throw hardlinkedPathNotAllowedError();
	};
	const assertPath = (stat) => {
		assertFile(stat);
		needsPathOpen ||= process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n);
	};
	const assertDescriptor = (fd = params.fd) => {
		const stat = fs.fstatSync(fd, { bigint: true });
		if (params.expectedIdentity.dev !== stat.dev || params.expectedIdentity.ino !== stat.ino) throw new FsSafeError("path-mismatch", "descriptor changed during write");
		assertFile(stat);
		if (process.platform !== "win32" && params.expectedMode !== void 0) {
			const actualMode = Number(stat.mode & 4095n);
			if (actualMode !== params.expectedMode) throw new Error(`Private secret file ${params.targetPath} has insecure permissions ${actualMode.toString(8)}.`);
		}
		return stat;
	};
	try {
		let opened;
		try {
			while (true) {
				const fd = opened?.fd ?? params.fd;
				const stat = assertDescriptor(fd);
				assertPath(fs.lstatSync(params.targetPath, { bigint: true }));
				const { realPath, stat: resolvedStat } = await resolveOpenedFileRealPathForFd(fd, stat, params.targetPath);
				assertPath(resolvedStat);
				if (!admitPathInsideRoot({
					rootPath: params.root.rootReal,
					candidatePath: realPath,
					rootIdentity: params.root.rootIdentity
				})) throw outsideWorkspaceError();
				await assertAsyncDirectoryGuard(params.parentGuard);
				await assertRootIdentityCurrent(params.root);
				assertPath(fs.lstatSync(params.targetPath, { bigint: true }));
				assertDescriptor(fd);
				if (opened || !needsPathOpen) break;
				assertNoUnsafeDeviceReadPath(params.targetPath);
				opened = await fs$1.open(params.targetPath, resolveReadOpenFlags()).catch((error) => {
					if (isSymlinkOpenError(error)) throw new FsSafeError("symlink", "symlink open blocked", { cause: error });
					if (hasNodeErrorCode(error, "EISDIR")) throw new FsSafeError("not-file", "not a file");
					throw error;
				});
			}
		} finally {
			if (opened) await opened.close().catch(() => void 0);
		}
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError();
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-publication.js
async function finishRootFallbackWrite(params) {
	let handle = params.handle;
	let identity = params.identity;
	let accepted;
	const compatibility = params.options.renameIdentity === "verify-content-with-lock";
	const verify = async () => {
		try {
			await verifyAtomicWriteResult({
				root: params.root,
				targetPath: params.targetPath,
				fd: handle.fd,
				expectedIdentity: identity,
				parentGuard: params.parentGuard
			});
		} catch (error) {
			params.onVerificationFailure(error);
			throw error;
		}
	};
	try {
		if (compatibility) {
			const current = fs.lstatSync(params.targetPath, { bigint: true });
			if (current.isSymbolicLink() || !current.isFile()) throw new FsSafeError("path-mismatch", "fallback target changed during write");
			if (process.platform === "win32" && (current.dev === 0n || current.ino === 0n)) await verify();
			else if (!sameFileIdentityForCleanup(current, identity)) {
				const opened = await params.openForCompatibility();
				accepted = handle = opened.opened.handle;
				identity = opened.identity;
				await verify();
				const data = params.options.data;
				const expectedBytes = typeof data === "string" ? Buffer.byteLength(data, params.options.encoding ?? "utf8") : data.byteLength;
				const content = await readFileHandleBounded(handle, expectedBytes).catch((error) => {
					if (error instanceof FsSafeError && error.code === "too-large") throw new FsSafeError("path-mismatch", "fallback target changed during write", { cause: error });
					throw error;
				});
				if (sha256Hex(content) !== sha256Hex(data, params.options.encoding)) throw new FsSafeError("path-mismatch", "fallback target changed during write");
				await verify();
			}
		}
		try {
			if (process.platform !== "win32" || (fs.fstatSync(handle.fd).mode & 128) !== (params.mode & 128)) fs.fchmodSync(handle.fd, params.mode);
		} catch (error) {
			await cleanupPinnedFilePath({
				pathname: params.targetPath,
				handle,
				identity,
				parentGuard: params.parentGuard
			});
			throw error;
		}
		if (params.options.durable !== false) await handle.sync();
		await verify();
		if (params.options.durable !== false) {
			await syncDirectoryBestEffort(path.dirname(params.targetPath));
			if (compatibility) await verify();
		}
	} finally {
		await accepted?.close().catch(() => void 0);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-write-compatibility.js
async function withRootFallbackCompatibilityLock(params, run) {
	const binding = createRootWriteLockBinding(params);
	const callerAssertion = params.assertBeforeMutation;
	const assertBeforeMutation = callerAssertion === void 0 ? binding.assertCurrent : () => {
		callerAssertion.call(params);
		binding.assertCurrent();
	};
	try {
		return await serializePathWrite(binding.targetPath, async () => await withPinnedWriteRenameIdentityLock({
			rootPath: params.rootPath,
			targetPath: binding.targetPath,
			relativeTargetPath: binding.relativeLockPath
		}, async () => await run({
			targetPath: binding.targetPath,
			relativePath: binding.relativePath,
			assertBeforeMutation
		})));
	} finally {
		binding.dispose();
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-move-fallback.js
function fallbackError(error, operation) {
	const code = error?.code;
	const message = error instanceof Error ? error.message : "native no-replace move fallback failed";
	if (code === "EEXIST") return new FsSafeError("already-exists", "no-replace fallback destination exists", { cause: error });
	if (code === "FS_SAFE_INTERNAL_MOVE_LINK_UNSUPPORTED") return new FsSafeError("helper-unavailable", message, {
		cause: error,
		details: {
			capability: "rename-noreplace",
			fallback: "link-unlink",
			fallbackCapability: "linkat"
		}
	});
	const sourceRemoval = (/* @__PURE__ */ new Map([
		["FS_SAFE_INTERNAL_MOVE_LINK_CHANGED", "not-attempted"],
		["FS_SAFE_INTERNAL_MOVE_SOURCE_LINKED", "still-linked"],
		["FS_SAFE_INTERNAL_MOVE_UNLINK_UNVERIFIED", "unverified"],
		["FS_SAFE_INTERNAL_MOVE_PUBLISHED", "removed"]
	])).get(code ?? "");
	if (sourceRemoval) return new FsSafeError(code === "FS_SAFE_INTERNAL_MOVE_LINK_CHANGED" ? "path-mismatch" : "helper-failed", message, {
		cause: error,
		details: {
			operation,
			fallback: "link-unlink",
			publication: "published",
			sourceRemoval
		}
	});
	return error;
}
function nativeMoveNoReplace(binding, paths, expected, allowFallback, operation = "move") {
	assertNativeCapabilities(binding, "renameNoReplace");
	const [sourceFd, source, targetFd, target] = paths;
	let unavailable = cachedNoReplaceUnavailable(binding, sourceFd, operation);
	if (!unavailable) try {
		binding.renameNoReplace(...paths);
		return;
	} catch (error) {
		unavailable = noReplaceUnavailable(error, operation, true);
		if (!unavailable) throw error;
		if (sourceFd === targetFd && source !== target) rememberNoReplaceUnavailable(binding, sourceFd, unavailable);
	}
	if (!allowFallback || process.platform !== "linux" || !binding.moveNoReplaceFallback || !expected) throw unavailable;
	try {
		binding.moveNoReplaceFallback(...paths, expected.dev, expected.ino);
		return expected.isFile() ? "link-unlink" : void 0;
	} catch (error) {
		throw fallbackError(error, operation);
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-move-noreplace.js
function nativeParentRelativePath(rootReal, parentPath) {
	const relative = path.relative(rootReal, parentPath);
	if (relative === "" || relative === ".") return "";
	if (relative.split(path.sep)[0] === ".." || path.isAbsolute(relative)) throw outsideWorkspaceError();
	return relative.split(path.sep).join(path.posix.sep);
}
function admitMovePath(root, parent, basename) {
	const admitted = admitPathInsideRoot({
		rootPath: root.rootReal,
		candidatePath: path.join(parent.guard.realPath, basename),
		rootIdentity: root.rootIdentity
	});
	if (!admitted) throw outsideWorkspaceError();
	return admitted.path;
}
function nativePrimitiveUnavailable(error) {
	const code = error?.code;
	return code === "ENOSYS" || code === "ENOTSUP" || code === "EOPNOTSUPP";
}
function normalizeMoveError(error) {
	if (error instanceof FsSafeError) return error;
	const code = error?.code;
	if (code === "path-mismatch" || code === "hardlink") return new FsSafeError(code, "native move source changed", errorCauseOptions(error));
	if (code === "ELOOP") return new FsSafeError("symlink", "native move source is a symlink", errorCauseOptions(error));
	if (isNotFoundPathError(error)) return fileNotFoundError(error instanceof Error ? error : void 0);
	if (nativePrimitiveUnavailable(error)) return new FsSafeError("helper-unavailable", "native move is unavailable", errorCauseOptions(error));
	return error;
}
function admitMoveSourceStat(stat) {
	if (stat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
	if (stat.isFile() && stat.nlink > 1) throw hardlinkedPathNotAllowedError();
	return stat;
}
async function movePathNative(root, params, paths, overwrite = false) {
	if (!overwrite) try {
		fs.lstatSync(paths.targetPath);
		throw new FsSafeError("already-exists", "destination exists");
	} catch (error) {
		if (error instanceof FsSafeError) throw error;
		if (!isNotFoundPathError(error)) throw error;
	}
	const binding = requireNativeBinding("openBeneath", overwrite ? "renameReplaceWithIdentity" : "renameNoReplace");
	if (typeof (overwrite ? binding.renameReplaceWithIdentity : binding.renameNoReplace) !== "function") throw new FsSafeError("helper-unavailable", "native move is unavailable");
	const rootAdmission = openExactNativeRootAdmissionSync(binding, {
		rootPath: root.rootReal,
		rootIdentity: root.rootIdentity,
		operation: "native move"
	});
	let sourceParent;
	let targetParent;
	let failed = false;
	let operationError;
	try {
		const sourceParentRelativePath = nativeParentRelativePath(root.rootReal, paths.sourceParentPath);
		sourceParent = sourceParentRelativePath === "" ? borrowNativeRootParent(rootAdmission) : await openNativeParentAdmission(binding, rootAdmission, sourceParentRelativePath, "native-directory");
		const targetParentRelativePath = nativeParentRelativePath(root.rootReal, paths.targetParentPath);
		targetParent = targetParentRelativePath === sourceParentRelativePath ? sourceParent : targetParentRelativePath === "" ? borrowNativeRootParent(rootAdmission) : await openNativeParentAdmission(binding, rootAdmission, targetParentRelativePath, "native-directory");
		const parentAdmissions = targetParent === sourceParent ? [sourceParent] : [sourceParent, targetParent];
		const beforeMutation = getFsSafeTestHooks()?.beforeRootFallbackMutation;
		if (beforeMutation) await beforeMutation("move", paths.targetPath);
		const admittedSourcePath = admitMovePath(root, sourceParent, path.basename(paths.sourcePath));
		const admittedTargetPath = admitMovePath(root, targetParent, path.basename(paths.targetPath));
		if (params.denyMutations) {
			await assertMutationNotDenied(admittedSourcePath, params.denyMutations, { protectAncestors: true });
			await assertMutationNotDenied(admittedTargetPath, params.denyMutations, { protectAncestors: true });
		}
		const rootParent = sourceParentRelativePath === "" ? sourceParent : targetParentRelativePath === "" ? targetParent : void 0;
		if (rootParent) {
			if (!(sourceParent === targetParent && sourceParentRelativePath === "" && !beforeMutation && params.denyMutations === void 0 && params.assertBeforeMutation === void 0)) try {
				assertSyncDirectoryGuard(rootParent.guard);
			} catch (error) {
				throw rootPathChangedError(error instanceof Error ? error : void 0);
			}
		} else assertRootIdentityCurrentSync(root);
		for (const admission of parentAdmissions) if (admission !== rootParent) assertSyncDirectoryGuard(admission.guard);
		const sourceStat = overwrite || params.assertBeforeMutation || process.platform === "linux" && !params.requireNative ? inspectFileIdentitySync(() => admitMoveSourceStat(fs.lstatSync(admittedSourcePath, { bigint: true })), paths.expectedSourceIdentity) : void 0;
		if (!sourceStat) admitMoveSourceStat(fs.lstatSync(admittedSourcePath));
		assertFinalSymlinkRejected(admittedTargetPath, params.mutationSymlinks !== void 0);
		params.assertBeforeMutation?.();
		if (params.assertBeforeMutation || params.mutationSymlinks === "reject") {
			assertRootIdentityCurrentSync(root);
			if (params.mutationSymlinks === "reject") for (const absolutePath of [paths.sourcePath, paths.targetPath]) resolveRootPathSync({
				absolutePath,
				rootPath: root.rootReal,
				rootCanonicalPath: root.rootReal,
				rootIdentity: root.rootIdentity,
				boundaryLabel: "root",
				rejectSymlinks: true,
				rejectFinalSymlink: true
			});
			for (const admission of parentAdmissions) assertSyncDirectoryGuard(admission.guard);
		}
		if (overwrite && params.assertBeforeMutation) for (const [original, selected, expected, policy] of [[
			paths.sourceOriginalPath,
			admittedSourcePath,
			paths.sourceCanonicalPath,
			PATH_ALIAS_POLICIES.strict
		], [
			paths.targetOriginalPath,
			admittedTargetPath,
			paths.targetCanonicalPath,
			PATH_ALIAS_POLICIES.unlinkTarget
		]]) {
			if (original === void 0 || expected === void 0) continue;
			for (const absolutePath of /* @__PURE__ */ new Set([path.isAbsolute(original) ? original : `${root.rootWithSep}${original}`, selected])) if (resolveRootPathSync({
				absolutePath,
				rootPath: root.rootReal,
				rootCanonicalPath: root.rootReal,
				rootIdentity: root.rootIdentity,
				boundaryLabel: "root",
				policy,
				...mutationSymlinkResolution(params.mutationSymlinks)
			}).canonicalPath !== expected) throw new FsSafeError("path-mismatch", "move route changed during authorization");
		}
		if (sourceStat !== void 0) inspectFileIdentitySync(() => admitMoveSourceStat(fs.lstatSync(admittedSourcePath, { bigint: true })), sourceStat);
		try {
			assertFinalSymlinkRejected(admittedTargetPath, params.mutationSymlinks !== void 0);
			if (overwrite) binding.renameReplaceWithIdentity(sourceParent.fd, path.basename(paths.sourcePath), targetParent.fd, path.basename(paths.targetPath), sourceStat.dev, sourceStat.ino);
			else nativeMoveNoReplace(binding, [
				sourceParent.fd,
				path.basename(paths.sourcePath),
				targetParent.fd,
				path.basename(paths.targetPath)
			], sourceStat, !params.requireNative);
		} catch (error) {
			if (isAlreadyExistsError(error) || !overwrite && error?.code === "ENOTEMPTY") throw new FsSafeError("already-exists", "destination exists", errorCauseOptions(error));
			throw normalizeMoveError(error);
		}
		try {
			for (const admission of parentAdmissions) assertDirectoryGuard(admission.guard, "native");
			if (overwrite) inspectFileIdentitySync(() => fs.lstatSync(admittedTargetPath, { bigint: true }), sourceStat);
		} catch (error) {
			throw normalizePinnedPathError(error);
		}
	} catch (error) {
		failed = true;
		operationError = normalizeMoveError(error);
	}
	const closeErrors = [];
	const closedFds = /* @__PURE__ */ new Set();
	for (const admission of [targetParent, sourceParent]) {
		if (!admission || closedFds.has(admission.fd)) continue;
		closedFds.add(admission.fd);
		try {
			admission.close();
		} catch (error) {
			closeErrors.push(error);
		}
	}
	try {
		rootAdmission.root.close();
	} catch (error) {
		closeErrors.push(error);
	}
	if (closeErrors.length > 0) {
		const closeError = closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "native move descriptor closes failed");
		if (failed) throw createSuppressedError(closeError, operationError, "native move and descriptor close failed");
		throw closeError;
	}
	if (failed) throw operationError;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-observed-path.js
async function resolvePinnedObservedPathInRoot(root, relativePath, kind) {
	const rootGuard = await createRootObservationGuard(root);
	const directoryObserver = getNativeDirectoryObservationBackend(getFsSafeTestHooks() === void 0);
	const rootReal = root.rootReal;
	let observed;
	try {
		const expandedPath = await expandRelativePathWithHome(relativePath);
		const observationPath = process.platform === "win32" ? expandedPath.replaceAll("/", path.sep) : expandedPath;
		observed = await resolveRootPathWithObservation({
			absolutePath: path.isAbsolute(observationPath) ? observationPath : observationPath === "" ? rootReal : `${ensureTrailingSep(rootReal)}${observationPath}`,
			rootPath: rootReal,
			rootCanonicalPath: rootReal,
			rootIdentity: root.rootIdentity,
			boundaryLabel: "root",
			policy: PATH_ALIAS_POLICIES.strict
		}, {
			kind,
			rootGuard,
			directoryObserver
		});
	} catch (error) {
		if (error instanceof RootPathObservationError) {
			if (error.parentReceipt) {
				assertRootPathObservationReceiptCurrent(root, error.parentReceipt);
				if (error.traversalFailure && !isNotFoundPathError(error.error)) {
					if (error.error instanceof FsSafeError && error.error.code === "symlink") throw error.error;
					throw new FsSafeError("path-alias", "path alias escape blocked", { cause: error.error });
				}
			}
			if (isNotFoundPathError(error.error)) {
				if (kind === "stat") throw fileNotFoundError(error.error instanceof Error ? error.error : void 0);
				throw new FsSafeError("not-found", "directory not found", errorCauseOptions(error.error));
			}
			throw error.error;
		}
		if (error instanceof FsSafeError && error.code === "symlink") throw error;
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: error });
	}
	const resolved = observed.resolved;
	if (observed.receipt) return {
		resolved: resolved.canonicalPath,
		receipt: observed.receipt
	};
	const relativeResolved = path.relative(resolved.rootCanonicalPath, resolved.canonicalPath);
	if (relativeResolved === "" || relativeResolved === ".") return { resolved: resolved.canonicalPath };
	if (relativeResolved.split(path.sep)[0] === ".." || path.isAbsolute(relativeResolved)) throw outsideWorkspaceError();
	const admittedCanonicalPath = admitPathInsideRoot({
		rootPath: resolved.rootCanonicalPath,
		candidatePath: resolved.canonicalPath,
		rootIdentity: root.rootIdentity
	});
	if (!admittedCanonicalPath) throw outsideWorkspaceError();
	return { resolved: admittedCanonicalPath.path };
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-options.js
const DEFAULT_ROOT_MAX_BYTES = 16777216;
function readDefaults(defaults) {
	return {
		hardlinks: defaults.hardlinks,
		maxBytes: normalizeMaxBytes(defaults.maxBytes, { defaultValue: DEFAULT_ROOT_MAX_BYTES }),
		symlinks: defaults.symlinks
	};
}
function mergeReadOptions(defaults, options) {
	const merged = readDefaults(defaults);
	if (options.hardlinks !== void 0) merged.hardlinks = options.hardlinks;
	merged.maxBytes = normalizeMaxBytes(options.maxBytes, { defaultValue: merged.maxBytes });
	if (options.symlinks !== void 0) merged.symlinks = options.symlinks;
	return merged;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-impl.js
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function logWarn(message) {
	if (process.env.FS_SAFE_DEBUG_WARNINGS === "1") console.warn(message);
}
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in constants;
const OPEN_WRITE_EXISTING_FLAGS = constants.O_WRONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0) | resolveNonblockingWriteFlag();
const OPEN_WRITE_CREATE_FLAGS = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_EXISTING_FLAGS = constants.O_RDWR | constants.O_APPEND | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0) | resolveNonblockingWriteFlag();
const OPEN_APPEND_CREATE_FLAGS = constants.O_RDWR | constants.O_APPEND | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
function openResult(params) {
	return {
		handle: params.handle,
		containment: "best-effort",
		realPath: params.realPath,
		stat: params.stat,
		exactIdentity: params.exactIdentity,
		[Symbol.asyncDispose]: () => params.handle.close().catch(() => void 0)
	};
}
async function openVerifiedLocalFile(filePath, options) {
	const fsSafeTestHooks = getFsSafeTestHooks();
	const { handle, stat, identity, preOpenStat } = await openLocalFileDescriptor(filePath, options);
	try {
		const inspectPathIdentity = async (inspect) => {
			try {
				return inspectFileIdentitySync(inspect, identity);
			} catch (error) {
				const failure = isNotFoundPathError(error) ? openedPathResolutionError(fileNotFoundError()) : error;
				if (stat.nlink <= 1 && (!preOpenStat || preOpenStat.nlink <= 1n)) await recordOpenedFileFailure(failure, handle, filePath, identity);
				throw failure;
			}
		};
		await inspectPathIdentity(() => inspectOpenedPathIdentitySync(filePath, options?.symlinks));
		if (fsSafeTestHooks?.afterOpenedPathIdentityCheck) await fsSafeTestHooks.afterOpenedPathIdentityCheck(filePath, handle);
		const resolved = await resolveOpenedFileRealPathForFd(handle.fd, identity, filePath).catch(async (error) => {
			if (stat.nlink <= 1 && (!preOpenStat || preOpenStat.nlink <= 1n)) await recordOpenedFileFailure(error, handle, filePath, identity);
			throw error;
		});
		const { realPath } = resolved;
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
		let resolvedStat = resolved.stat;
		await inspectPathIdentity(() => {
			const realStat = resolvedStat ?? fs.statSync(realPath, { bigint: true });
			resolvedStat = void 0;
			if (options?.hardlinks === "reject" && realStat.nlink > 1n) throw hardlinkedPathNotAllowedError();
			return realStat;
		});
		return {
			opened: openResult({
				handle,
				realPath,
				stat,
				exactIdentity: exactFileIdentity(identity)
			}),
			identity
		};
	} catch (err) {
		await handle.close().catch(() => {});
		throw err;
	}
}
var RootHandle = class {
	context;
	rootDir;
	rootReal;
	rootWithSep;
	defaults;
	constructor(context, defaults = {}) {
		this.context = context;
		this.rootDir = context.rootDir;
		this.rootReal = context.rootReal;
		this.rootWithSep = context.rootWithSep;
		this.defaults = defaults;
		registerFileLockSyncRootAdapter(this, context, defaults);
		registerRootHandleContext(this, context);
	}
	mutationOptions(options) {
		return {
			...options,
			assertBeforeMutation: composeMutationAssertions(this.defaults.assertBeforeMutation, options.assertBeforeMutation),
			mutationSymlinks: options.mutationSymlinks ?? this.defaults.mutationSymlinks,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		};
	}
	async resolve(relativePath) {
		assertValidRootDestinationPath(relativePath);
		return (await resolvePathInRoot(this.context, relativePath, {
			allowFinalSymlink: true,
			resolveCanonical: true
		})).resolved;
	}
	async open(relativePath, options = {}) {
		return await openFileInRoot(this.context, {
			...readDefaults(this.defaults),
			...options,
			relativePath
		});
	}
	async read(relativePath, options = {}) {
		return await readFileInRoot(this.context, {
			relativePath,
			...mergeReadOptions(this.defaults, options)
		});
	}
	async readBytes(relativePath, options = {}) {
		return (await this.read(relativePath, options)).buffer;
	}
	async readText(relativePath, options = {}) {
		const { encoding = "utf8", ...readOptions } = options;
		return (await this.read(relativePath, readOptions)).buffer.toString(encoding);
	}
	async readJson(relativePath, options = {}) {
		return JSON.parse(await this.readText(relativePath, options));
	}
	async readAbsolute(filePath, options = {}) {
		const context = this.context;
		const readOptions = mergeReadOptions(this.defaults, options);
		return await readFileInRoot(context, {
			relativePath: rootRelativeReadPath(context, filePath),
			...readOptions
		});
	}
	reader(options = {}) {
		return async (filePath) => {
			return (await this.readAbsolute(filePath, options)).buffer;
		};
	}
	async openWritable(relativePath, options = {}) {
		assertValidRootDestinationPath(relativePath);
		const writeMode = options.writeMode ?? "replace";
		return (await openWritableFileInRoot(this.context, {
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options),
			relativePath,
			expectedWritePath: void 0,
			append: writeMode === "append",
			truncateExisting: writeMode === "replace"
		}).catch(rethrowMutationAuthorityError)).opened;
	}
	async append(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await appendFileInRoot(this.context, {
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options),
			relativePath,
			data,
			durable: options.durable ?? this.defaults.durable ?? true
		}).catch(rethrowMutationAuthorityError);
	}
	async remove(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		validateRemoveOptions(options);
		options.signal?.throwIfAborted();
		await removePathInRoot(this.context, {
			...this.mutationOptions(options),
			relativePath
		}).catch(rethrowMutationAuthorityError);
	}
	async mkdir(relativePath, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await mkdirPathInRoot(this.context, {
			...this.mutationOptions(options),
			relativePath,
			allowRoot: false
		}).catch(rethrowMutationAuthorityError);
	}
	async ensureRoot(options = {}) {
		await mkdirPathInRoot(this.context, {
			...this.mutationOptions(options),
			relativePath: "",
			allowRoot: true
		}).catch(rethrowMutationAuthorityError);
	}
	async write(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await writeFileInRoot(this.context, {
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			renameIdentity: this.defaults.renameIdentity,
			...this.mutationOptions(options),
			atomic: void 0,
			private: void 0,
			strictFileSync: void 0,
			relativePath,
			data,
			durable: options.durable ?? this.defaults.durable ?? true
		}).catch(rethrowMutationAuthorityError);
	}
	async create(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		const durable = options.durable ?? this.defaults.durable ?? true;
		await writeFileInRoot(this.context, {
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(createInputOptions(data, options, this.defaults.maxBytes)),
			relativePath,
			data,
			durable: durable !== false,
			strictFileSync: durable === "file",
			overwrite: false
		}).catch(rethrowMutationAuthorityError).catch(rethrowCreateInputError);
	}
	async writeJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.write(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async createJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.create(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async copyIn(relativePath, source, options = {}) {
		options.signal?.throwIfAborted();
		assertValidRootDestinationPath(relativePath);
		const { maxBytes, ...copyOptions } = this.mutationOptions(options);
		const copySource = typeof source === "string" ? source : {
			root: source.root,
			relativePath: source.relativePath
		};
		await copyFileInRoot(this.context, {
			maxBytes: normalizeMaxBytes(maxBytes, { defaultValue: this.defaults.maxBytes }),
			mkdir: this.defaults.mkdir,
			...copyOptions,
			source: copySource,
			relativePath,
			mode: options.mode ?? this.defaults.mode,
			durable: options.durable ?? this.defaults.durable ?? true,
			verifyPublished: options[onCopyPublication],
			admitSource: options[onCopySourceAdmission]
		}, openVerifiedLocalFile).catch(rethrowMutationAuthorityError);
	}
	async exists(relativePath) {
		try {
			await this.stat(relativePath);
			return true;
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "not-found") return false;
			throw err;
		}
	}
	async stat(relativePath) {
		assertValidRootRelativePath(relativePath);
		validatePinnedRelativePath(relativePath);
		return await statPathFallback(this.context, relativePath);
	}
	async list(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		validatePinnedRelativePath(relativePath);
		return await listPathFallback(this.context, relativePath, options.withFileTypes === true);
	}
	async move(fromRelative, toRelative, options = {}) {
		assertValidRootRelativePath(fromRelative);
		assertValidRootDestinationPath(toRelative);
		validatePinnedRelativePath(fromRelative);
		validatePinnedRelativePath(toRelative);
		const mutationOptions = this.mutationOptions(options);
		const { assertBeforeMutation } = mutationOptions;
		const { denyMutations, mutationSymlinks } = snapshotPinnedMutationPolicy(mutationOptions.denyMutations, mutationOptions.mutationSymlinks) ?? {};
		const overwrite = options.overwrite ?? false;
		const requireNative = isFsSafeNativeRequired();
		for (const relativePath of [fromRelative, toRelative]) {
			const { resolved } = await resolvePathInRoot(this.context, relativePath, {
				aliasErrorCode: "path-alias",
				allowFinalSymlink: true
			});
			await assertMutationNotDenied(resolved, denyMutations, { protectAncestors: true });
		}
		await movePathFallback(this.context, {
			requireNative,
			fromRelative,
			denyMutations,
			assertBeforeMutation,
			mutationSymlinks,
			overwrite,
			toRelative
		}).catch(rethrowMutationAuthorityError);
	}
	entries(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		return entriesInRoot(this.context, relativePath, {
			...options,
			symlinks: options.symlinks ?? this.defaults.symlinks
		});
	}
	walk(relativePath, options) {
		assertValidRootRelativePath(relativePath);
		return walkRoot({
			rootReal: this.context.rootReal,
			observeRoot: () => createRootObservationGuard(this.context),
			stat: (relative) => this.stat(relative),
			list: async (relative, listingOptions, receipt) => {
				validatePinnedRelativePath(relative);
				if (receipt) return await openRootDirectoryListing(this.context, receipt.targetPath, listingOptions, receipt);
				const resolved = await resolvePinnedPathInRoot(this.context, {
					relativePath: relative,
					allowRoot: true
				});
				return await openRootDirectoryListing(this.context, resolved.resolved, listingOptions);
			}
		}, relativePath, options);
	}
};
async function root$1(rootDir, defaults = {}) {
	normalizeMaxBytes(defaults.maxBytes);
	return new RootHandle(await resolveRootContext(rootDir), defaults);
}
async function openFileInRoot(root, params) {
	const { resolved } = await resolvePathInRoot(root, params.relativePath, {
		allowFinalSymlink: true,
		rejectUnsafeDeviceReads: true,
		...readSymlinkResolution(params.symlinks),
		resolveCanonical: true
	});
	const fsSafeTestHooks = getFsSafeTestHooks();
	if (fsSafeTestHooks?.afterRootReadPathResolution) await fsSafeTestHooks.afterRootReadPathResolution(resolved);
	const { handle, stat, identity } = await openLocalFileDescriptor(resolved, { symlinks: params.symlinks });
	return openResult(await admitRootReadHandle({
		root,
		filePath: resolved,
		opened: {
			handle,
			stat,
			exactIdentity: exactFileIdentity(identity)
		},
		identity,
		hardlinks: params.hardlinks,
		symlinks: params.symlinks,
		beforeFinalFence: fsSafeTestHooks?.beforeRootReadFinalFence,
		afterPathIdentityCheck: fsSafeTestHooks?.afterRootReadFinalPathIdentityCheck
	}));
}
async function readFileInRoot(root, params) {
	const opened = await openFileInRoot(root, params);
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
function emitWriteBoundaryWarning(reason) {
	logWarn(`security: fs-safe write boundary warning (${reason})`);
}
async function openWritableFileInRoot(root, params, options) {
	const requireNative = isFsSafeNativeRequired();
	const policy = requireNative ? snapshotPinnedMutationPolicy(params.denyMutations, params.mutationSymlinks) : void 0;
	if (policy) params = {
		...params,
		...policy
	};
	const guardedTarget = params.denyMutations === void 0 && params.mutationSymlinks === void 0 ? void 0 : await resolveGuardedWriteTargetInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations,
		mutationSymlinks: params.mutationSymlinks
	});
	const creationProbe = requireNative && !guardedTarget && params.assertBeforeMutation === void 0 && options?.createIfMissing !== false ? probeNativeCreationPath(root, params.relativePath) : void 0;
	const { resolved } = creationProbe ?? guardedTarget?.resolvedPath ?? await resolveGuardedWritePathInRoot(root, { relativePath: params.relativePath });
	const resolveCurrent = async () => (await resolveGuardedWritePathInRoot(root, {
		relativePath: params.relativePath,
		...policy
	})).resolved;
	const nativeCreatesParents = requireNative && params.mkdir !== false;
	if (nativeCreatesParents) {
		if (!getNativeBinding("openBeneath", "mkdirChildBeneath", "closeOwnedFd")) throw new FsSafeError("helper-unavailable", "native confined creation is unavailable");
		if (guardedTarget) await tryMkdirRootNative({
			originalPath: params.relativePath,
			root,
			directory: path.dirname(resolved),
			target: resolved,
			mkdir: true,
			policy,
			resolveCurrent,
			assertBeforeMutation: params.assertBeforeMutation
		});
	}
	const prepared = !nativeCreatesParents && guardedTarget ? await prepareSharedRootWriteTarget(root, {
		relativePath: params.relativePath,
		guardedTarget,
		mkdir: params.mkdir,
		assertBeforeMutation: params.assertBeforeMutation
	}) : void 0;
	const preparedParent = prepared?.preparedParent;
	let ioPath = nativeCreatesParents ? resolved : prepared?.targetPath ?? (params.mkdir === false ? resolved : await prepareRootWriteTarget(root, resolved, params.assertBeforeMutation));
	const operationTargetPath = ioPath;
	let observedMissing = Boolean(creationProbe);
	if (!creationProbe) try {
		assertFinalSymlinkRejected(ioPath, params.mutationSymlinks !== void 0);
		const resolvedRealPath = params.mutationSymlinks === void 0 ? realpathSync$1.native(ioPath) : ioPath;
		const admittedRealPath = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: resolvedRealPath,
			rootIdentity: root.rootIdentity
		});
		if (!admittedRealPath) throw outsideWorkspaceError();
		ioPath = admittedRealPath.path;
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (!isNotFoundPathError(err)) throw err;
		observedMissing = true;
	}
	assertRootFallbackWritePath(params.expectedWritePath, ioPath);
	const mode = params.mode ?? 384;
	let handle;
	let createdForWrite = false;
	let cleanupCreated;
	let releaseCreationParent;
	let writePathSelection = void 0;
	const existingFlags = params.append ? OPEN_APPEND_EXISTING_FLAGS : OPEN_WRITE_EXISTING_FLAGS;
	const createFlags = params.append ? OPEN_APPEND_CREATE_FLAGS : OPEN_WRITE_CREATE_FLAGS;
	try {
		writePathSelection = guardedTarget ? await prepareGuardedRootWritePathSelection(guardedTarget, ioPath, operationTargetPath, preparedParent) : void 0;
		const createNative = () => tryOpenCreateRootNative({
			originalPath: params.relativePath,
			root,
			directory: path.dirname(ioPath),
			target: ioPath,
			mkdir: params.mkdir !== false,
			policy,
			selectedParent: creationProbe?.parent,
			resolveCurrent,
			assertBeforeMutation: params.assertBeforeMutation !== void 0 || writePathSelection !== void 0 ? () => {
				params.assertBeforeMutation?.();
				if (writePathSelection) assertRootWritePathSelectionSync(root, writePathSelection);
			} : void 0,
			flags: createFlags,
			existingFlags,
			mode
		});
		let precreated;
		if (requireNative && observedMissing && !guardedTarget && params.assertBeforeMutation === void 0 && options?.createIfMissing !== false) try {
			precreated = await createNative();
		} catch (error) {
			if (!hasNodeErrorCode(error, "EEXIST") || !isNativeCreateCollision(error)) throw error;
		}
		if (precreated) {
			handle = precreated.handle;
			cleanupCreated = precreated.cleanupCreated;
			releaseCreationParent = precreated.releaseCreationParent;
			createdForWrite = true;
		} else try {
			if (writePathSelection) assertRootWritePathSelectionSync(root, writePathSelection);
			handle = await fs$1.open(ioPath, existingFlags, mode);
		} catch (err) {
			if (await isNonRegularWriteOpenError(err, ioPath, existingFlags)) throw new FsSafeError("not-file", "path is not a regular file under root");
			if (!isNotFoundPathError(err)) throw err;
			if (options?.createIfMissing === false) {
				if (nativeCreatesParents && !guardedTarget) await tryMkdirRootNative({
					originalPath: params.relativePath,
					root,
					directory: path.dirname(ioPath),
					target: ioPath,
					mkdir: true,
					policy,
					resolveCurrent,
					assertBeforeMutation: params.assertBeforeMutation
				});
				const parentGuard = writePathSelection?.parentGuard ?? await createAsyncDirectoryGuard(path.dirname(ioPath), { bigint: true });
				assertRootIdentityCurrentSync(root);
				if (!admitPathInsideRoot({
					rootPath: root.rootReal,
					candidatePath: parentGuard.realPath,
					rootIdentity: root.rootIdentity
				})) throw outsideWorkspaceError();
				assertSyncDirectoryGuard(parentGuard);
				return {
					missing: true,
					targetPath: ioPath,
					parentGuard,
					writeSelection: writePathSelection
				};
			}
			if (writePathSelection) await refreshRootWritePathSelection(writePathSelection);
			const nativeCreated = requireNative ? await createNative() : void 0;
			if (nativeCreated) handle = nativeCreated.handle;
			else {
				params.assertBeforeMutation?.();
				if (writePathSelection) assertRootWritePathSelectionSync(root, writePathSelection);
				if (!SUPPORTS_NOFOLLOW) assertFinalSymlinkRejected(ioPath, true);
				handle = await fs$1.open(ioPath, createFlags, mode);
			}
			cleanupCreated = nativeCreated?.cleanupCreated;
			releaseCreationParent = nativeCreated?.releaseCreationParent;
			createdForWrite = true;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw fileNotFoundError();
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file", { cause: err });
		throw err;
	}
	let realPathForCleanup = null;
	let createdIdentity = null;
	try {
		const identity = inspectFileIdentitySync(() => {
			const observed = fs.fstatSync(handle.fd, { bigint: true });
			if (!observed.isFile()) throw new FsSafeError("not-file", "path is not a regular file under root");
			if (observed.nlink > 1n) throw hardlinkedPathNotAllowedError();
			return observed;
		});
		const stat = numberStats(identity);
		if (createdForWrite) createdIdentity = identity;
		let observedIoPath = false;
		try {
			inspectFileIdentitySync(() => {
				const lstat = fs.lstatSync(ioPath, { bigint: true });
				observedIoPath = true;
				if (lstat.isSymbolicLink() || !lstat.isFile()) throw new FsSafeError(lstat.isSymbolicLink() ? "symlink" : "not-file", "path is not a regular file under root");
				if (lstat.nlink > 1n) throw hardlinkedPathNotAllowedError();
				return lstat;
			}, identity);
		} catch (err) {
			if (isNotFoundPathError(err) && !observedIoPath) {} else if (err instanceof FsSafeError && err.code === "path-mismatch") throw new FsSafeError("path-mismatch", "path changed during write", { cause: err });
			else throw err;
		}
		let realPath = (await resolveOpenedFileRealPathForFd(handle.fd, identity, ioPath)).realPath;
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
		try {
			inspectFileIdentitySync(() => {
				const realStat = fs.statSync(realPath, { bigint: true });
				if (!realStat.isFile()) throw new FsSafeError("not-file", "path is not a regular file under root");
				if (realStat.nlink > 1n) throw hardlinkedPathNotAllowedError();
				return realStat;
			}, identity);
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "path-mismatch") throw new FsSafeError("path-mismatch", "path mismatch", { cause: err });
			throw err;
		}
		const admittedRealPath = admitPathInsideRoot({
			rootPath: root.rootReal,
			candidatePath: realPath,
			rootIdentity: root.rootIdentity
		});
		if (!admittedRealPath) throw outsideWorkspaceError();
		realPath = admittedRealPath.path;
		realPathForCleanup = realPath;
		assertRootFallbackWritePath(params.expectedWritePath, realPath);
		const writeSelection = writePathSelection ? createRootWriteSelectionForFd(writePathSelection, handle.fd) : void 0;
		if (params.append !== true && params.truncateExisting !== false && !createdForWrite) {
			if (writeSelection) await refreshRetainedRootWriteAdmission(root, writeSelection, handle.fd);
			assertFinalSymlinkRejected(ioPath, params.mutationSymlinks !== void 0);
			params.assertBeforeMutation?.();
			if (writeSelection) assertRootWriteSelectionSync(root, writeSelection, handle.fd);
			await handle.truncate(0);
		}
		if (writeSelection) {
			await refreshRetainedRootWriteAdmission(root, writeSelection, handle.fd);
			assertRootWriteSelectionSync(root, writeSelection, handle.fd);
		}
		const result = {
			handle,
			containment: "best-effort",
			createdForWrite,
			realPath,
			stat,
			exactIdentity: exactFileIdentity(identity),
			[Symbol.asyncDispose]: () => handle.close().catch(() => void 0)
		};
		if (!params.keepCreationParent) releaseCreationParent?.();
		return {
			opened: result,
			identity,
			writeSelection,
			cleanupCreated,
			releaseCreationParent
		};
	} catch (err) {
		const cleanupCreatedPath = createdForWrite && err instanceof FsSafeError;
		const cleanupPath = realPathForCleanup ?? ioPath;
		if (cleanupCreatedPath && cleanupCreated) await cleanupCreated().catch(() => {});
		try {
			releaseCreationParent?.();
		} catch {}
		await handle.close().catch(() => {});
		if (cleanupCreatedPath && createdIdentity && !cleanupCreated) await removePathIfIdentityUnchanged(cleanupPath, createdIdentity).catch(() => {});
		throw err;
	}
}
async function appendFileInRoot(root, params) {
	const env_1 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		const { opened: target, identity, cleanupCreated, releaseCreationParent } = await openWritableFileInRoot(root, {
			relativePath: params.relativePath,
			mkdir: params.mkdir,
			mode: params.mode,
			denyMutations: params.denyMutations,
			assertBeforeMutation: params.assertBeforeMutation,
			mutationSymlinks: params.mutationSymlinks,
			truncateExisting: false,
			append: true,
			keepCreationParent: true
		});
		__addDisposableResource(env_1, { [Symbol.dispose]() {
			releaseCreationParent?.();
		} }, false);
		let dispatched = false;
		__addDisposableResource(env_1, { async [Symbol.asyncDispose]() {
			if (!dispatched && target.createdForWrite && !cleanupCreated) await removePathIfIdentityUnchanged(target.realPath, identity);
		} }, true);
		__addDisposableResource(env_1, target.handle, true);
		__addDisposableResource(env_1, { async [Symbol.asyncDispose]() {
			if (!dispatched && target.createdForWrite) await cleanupCreated?.();
		} }, true);
		try {
			let prefix = "";
			if (params.prependNewlineIfNeeded === true && !target.createdForWrite && target.stat.size > 0 && params.data.length > 0 && (typeof params.data === "string" && !params.data.startsWith("\n") || Buffer.isBuffer(params.data) && params.data[0] !== 10)) {
				const newline = Buffer.from("\n", typeof params.data === "string" ? params.encoding : "utf8");
				const tail = Buffer.alloc(newline.length);
				const { bytesRead } = await target.handle.read(tail, 0, tail.length, Math.max(0, target.stat.size - tail.length));
				if (bytesRead > 0 && (bytesRead !== newline.length || !tail.equals(newline))) prefix = "\n";
			}
			const payload = typeof params.data === "string" ? `${prefix}${params.data}` : prefix.length > 0 ? Buffer.concat([Buffer.from(prefix, "utf8"), params.data]) : params.data;
			await writeAllToFile(target.handle, payload, {
				encoding: params.encoding,
				assertBeforeMutation: () => {
					assertFinalSymlinkRejected(target.realPath, params.mutationSymlinks !== void 0);
					params.assertBeforeMutation?.();
					dispatched = true;
				}
			});
			dispatched = true;
			if (params.durable !== false) await target.handle.sync();
			if (params.durable !== false && target.createdForWrite) await syncDirectoryBestEffort(path.dirname(target.realPath));
		} catch (error) {
			rethrowMutationAuthorityError(error);
		}
	} catch (e_1) {
		env_1.error = e_1;
		env_1.hasError = true;
	} finally {
		const result_1 = __disposeResources(env_1);
		if (result_1) await result_1;
	}
}
async function removePathInRoot(root, params) {
	validatePinnedRelativePath(params.relativePath);
	const requireNative = isFsSafeNativeRequired();
	if (requireNative) params = {
		...params,
		...snapshotPinnedMutationPolicy(params.denyMutations, params.mutationSymlinks)
	};
	const removalReceipts = params.recursive ? void 0 : new RemovalPathReceipts();
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations,
		mutationSymlinks: params.mutationSymlinks,
		remove: true,
		removalReceipts
	});
	try {
		if (requireNative) await removePathInRootNative(root, resolved.resolved, params, removalReceipts);
		else await removePathInRootFallback(root, resolved.resolved, params, removalReceipts);
	} catch (error) {
		if (params.recursive) throw error;
		throw normalizePinnedPathError(error);
	}
}
async function mkdirPathInRoot(root, params) {
	const requireNative = isFsSafeNativeRequired();
	const privateMode = resolveCreationPermissions(params, true).private;
	validatePinnedRelativePath(params.relativePath);
	const policy = params.denyMutations === void 0 && params.mutationSymlinks === void 0 ? void 0 : snapshotPinnedMutationPolicy(params.denyMutations, params.mutationSymlinks);
	if (requireNative && !privateMode && !policy && !params.assertBeforeMutation) {
		if (params.allowRoot && params.relativePath === "") {
			ensureNativeRootCurrent(root);
			return;
		}
		if (tryMkdirNativeDirectChild(root, params.relativePath)) return;
		if (tryMkdirNativeParents(root, params.relativePath)) return;
	}
	const resolution = {
		relativePath: params.relativePath,
		allowRoot: params.allowRoot,
		...policy
	};
	const resolveCurrent = policy ? async () => await resolvePinnedPathInRoot(root, resolution) : void 0;
	const resolved = await resolvePinnedPathInRoot(root, resolution);
	if (requireNative && await tryMkdirRootNative({
		originalPath: params.relativePath,
		root,
		directory: resolved.resolved,
		target: resolved.resolved,
		mkdir: true,
		private: privateMode,
		policy,
		resolveCurrent: async () => (await resolvePinnedPathInRoot(root, resolution)).resolved,
		assertBeforeMutation: params.assertBeforeMutation
	})) return;
	const prepared = policy && resolved.relativePosix !== "" ? await preparePinnedWriteMutationAdmission({
		rootReal: resolved.rootReal,
		rootIdentity: root.rootIdentity,
		resolvedTargetPath: resolved.resolved,
		originalPath: params.relativePath,
		defaultRelativeParentPath: path.posix.dirname(resolved.relativePosix) === "." ? "" : path.posix.dirname(resolved.relativePosix),
		policy,
		resolveCurrent
	}) : void 0;
	if (prepared?.mutationAdmission) await getFsSafeTestHooks()?.beforePinnedWriteParentAdmission?.(resolved.resolved);
	try {
		if (!privateMode && prepared?.mutationAdmission && params.assertBeforeMutation === void 0 && await tryMkdirAtExactParent(root, resolved.resolved, prepared.mutationAdmission)) return;
		await mkdirPathFallback(root, resolved, params.assertBeforeMutation, policy?.mutationSymlinks !== void 0, prepared?.mutationAdmission, privateMode);
	} catch (error) {
		throw normalizePinnedPathError(error);
	}
}
async function writeFileInRoot(root, params) {
	if (params.private !== void 0) {
		const permissions = resolveCreationPermissions(params, false);
		params = {
			...params,
			private: permissions.private,
			mode: permissions.mode
		};
	}
	const input = rootWriteInput(params);
	await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
		if (!params.private && input.kind === "buffer" && !input.stageBeforePublish && process.platform === "win32" && (params.renameIdentity === "verify-content-with-lock" || !getPinnedWriteNativeBinding({ input }))) {
			await writeFileFallback(root, {
				...params,
				data: input.data
			});
			return;
		}
		const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, params.mode, params.denyMutations, params.overwrite, params.mutationSymlinks);
		await serializePathWrite(pinned.targetPath, async () => {
			await commitPinnedWriteInRoot(root, pinned, params, input);
		});
	});
}
async function commitPinnedWriteInRoot(root, pinned, params, input) {
	let verifyingPublication = false;
	try {
		if (params.private) assertPrivateFileCreationAvailable();
		if (params.private && params.mkdir !== false) {
			if (await prepareRootWriteTarget(root, pinned.targetPath, params.assertBeforeMutation, pinned.mutationAdmission, true) !== pinned.targetPath) throw new FsSafeError("path-mismatch", "private creation parent changed during admission");
		}
		await runPinnedWriteWithRenamePolicy({
			rootPath: pinned.rootReal,
			relativeParentPath: pinned.relativeParentPath,
			basename: pinned.basename,
			targetPath: pinned.targetPath,
			renameIdentity: params.renameIdentity,
			mkdir: !params.private && params.mkdir !== false,
			private: params.private,
			mode: params.mode ?? pinned.mode,
			sync: params.durable !== false,
			strictFileSync: params.strictFileSync,
			overwrite: params.overwrite,
			rejectFinalSymlink: params.mutationSymlinks !== void 0,
			input,
			maxBytes: input.kind === "buffer" ? void 0 : params.maxBytes,
			rootIdentity: root.rootIdentity,
			mutationAdmission: pinned.mutationAdmission,
			assertBeforeMutation: params.assertBeforeMutation,
			verifyPublished: async (fd, expectedIdentity, parentGuard, nativeParent) => {
				verifyingPublication = true;
				try {
					await verifyRootWritePublication({
						fd,
						expectedIdentity,
						parentGuard,
						nativeParent,
						retention: params[retainSidecarCreated],
						verify: () => verifyAtomicWriteResult({
							root,
							targetPath: pinned.targetPath,
							fd,
							expectedIdentity,
							parentGuard
						})
					});
				} catch (error) {
					emitWriteBoundaryWarning(`post-write verification failed: ${String(error)}`);
					throw error;
				}
			}
		});
	} catch (error) {
		if (verifyingPublication) throw error;
		const errorCode = error?.code;
		if (errorCode === "file_lock_stale" || errorCode === "file_lock_timeout") throw error;
		if (params.overwrite === false && isAlreadyExistsError(error)) throw new FsSafeError("already-exists", "file already exists", errorCauseOptions(error));
		throw normalizePinnedWriteError(error);
	}
}
async function resolvePinnedPathInRoot(root, params) {
	const resolved = await resolvePinnedRootPathInRoot(root, {
		relativePath: params.relativePath,
		policy: params.remove ? PATH_ALIAS_POLICIES.unlinkTarget : PATH_ALIAS_POLICIES.strict,
		mutationSymlinks: params.mutationSymlinks,
		removalReceipts: params.removalReceipts
	});
	const relativeResolved = path.relative(resolved.rootReal, resolved.canonicalPath);
	if ((relativeResolved === "" || relativeResolved === ".") && params.allowRoot === true) {
		await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations);
		return {
			rootReal: resolved.rootReal,
			resolved: resolved.canonicalPath,
			relativePosix: ""
		};
	}
	const firstSegment = relativeResolved.split(path.sep)[0];
	if (relativeResolved === "" || relativeResolved === "." || firstSegment === ".." || path.isAbsolute(relativeResolved)) throw outsideWorkspaceError();
	const relativePosix = relativeResolved.split(path.sep).join(path.posix.sep);
	const admittedCanonicalPath = admitPathInsideRoot({
		rootPath: resolved.rootReal,
		candidatePath: resolved.canonicalPath,
		rootIdentity: root.rootIdentity
	});
	if (!admittedCanonicalPath) throw outsideWorkspaceError();
	resolved.canonicalPath = admittedCanonicalPath.path;
	await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations, { protectAncestors: params.remove === true });
	return {
		rootReal: resolved.rootReal,
		resolved: resolved.canonicalPath,
		relativePosix
	};
}
async function resolvePinnedRootPathInRoot(root, params) {
	await assertRootIdentityCurrent(root, params.removalReceipts?.observeRoot);
	const rootReal = root.rootReal;
	let resolved;
	try {
		const expandedPath = await expandRelativePathWithHome(params.relativePath);
		const resolution = {
			absolutePath: path.isAbsolute(expandedPath) ? expandedPath : `${ensureTrailingSep(rootReal)}${expandedPath}`,
			rootPath: rootReal,
			rootCanonicalPath: rootReal,
			rootIdentity: root.rootIdentity,
			boundaryLabel: "root",
			policy: params.policy,
			...mutationSymlinkResolution(params.mutationSymlinks)
		};
		resolved = await (params.removalReceipts ? resolveRootPathForRemoval(resolution, params.removalReceipts) : resolveRootPath(resolution));
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "symlink") throw err;
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	return {
		rootReal: resolved.rootCanonicalPath,
		canonicalPath: resolved.canonicalPath
	};
}
async function statPathFallback(root, relativePath) {
	const resolved = getFsSafeTestHooks()?.beforeRootStatInitialObservation ? await resolvePinnedPathInRoot(root, {
		relativePath,
		allowRoot: true
	}) : await resolvePinnedObservedPathInRoot(root, relativePath, "stat");
	return await statResolvedPathInRoot(root, resolved.resolved, resolved.receipt);
}
async function listPathFallback(root, relativePath, withFileTypes) {
	const resolved = await resolvePinnedObservedPathInRoot(root, relativePath, "directory");
	return await listDirectoryPath(root, resolved.resolved, withFileTypes, resolved.receipt);
}
async function movePathFallback(root, params) {
	const originalRoutes = params.overwrite && params.assertBeforeMutation ? await Promise.all([params.fromRelative, params.toRelative].map(expandRelativePathWithHome)) : void 0;
	const source = await resolvePathInRoot(root, params.fromRelative, {
		aliasErrorCode: "path-alias",
		allowFinalSymlink: true,
		...mutationSymlinkResolution(params.mutationSymlinks)
	});
	await assertMutationNotDenied(source.resolved, params.denyMutations, { protectAncestors: true });
	const pinnedSource = await resolvePinnedRootPathInRoot(root, {
		relativePath: params.fromRelative,
		policy: PATH_ALIAS_POLICIES.strict,
		mutationSymlinks: params.mutationSymlinks
	});
	let pinnedTarget;
	const target = await resolveGuardedWritePathInRoot(root, {
		relativePath: params.toRelative,
		denyMutations: params.denyMutations,
		mutationSymlinks: params.mutationSymlinks,
		allowFinalSymlink: true,
		protectDeniedAncestors: true,
		shouldAssertNoPathAlias: async (resolvedTarget) => {
			pinnedTarget = await resolvePinnedRootPathInRoot(root, {
				relativePath: params.toRelative,
				policy: PATH_ALIAS_POLICIES.unlinkTarget
			});
			if (!params.overwrite) return true;
			let targetStat;
			try {
				targetStat = fs.lstatSync(resolvedTarget.resolved);
			} catch {}
			return !(process.platform !== "win32" && params.overwrite && targetStat?.isSymbolicLink() === true);
		}
	});
	let sourceIdentity;
	try {
		if (params.overwrite && params.assertBeforeMutation) sourceIdentity = inspectFileIdentitySync(() => admitMoveSourceStat(fs.lstatSync(source.resolved, { bigint: true })));
		else admitMoveSourceStat(fs.lstatSync(source.resolved));
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
		throw error;
	}
	if (!pinnedTarget) throw new FsSafeError("path-mismatch", "destination admission was not completed");
	const nativeReplace = params.overwrite && params.requireNative ? getNativeBinding()?.renameReplaceWithIdentity : void 0;
	if (params.overwrite && !nativeReplace && params.requireNative) throw new FsSafeError("helper-unavailable", "native overwrite move is unavailable");
	if (!params.overwrite || nativeReplace) {
		await movePathNative(root, params, {
			sourcePath: source.resolved,
			sourceParentPath: path.dirname(pinnedSource.canonicalPath),
			targetPath: target.resolved,
			targetParentPath: path.dirname(pinnedTarget.canonicalPath),
			sourceOriginalPath: originalRoutes?.[0],
			targetOriginalPath: originalRoutes?.[1],
			sourceCanonicalPath: pinnedSource.canonicalPath,
			targetCanonicalPath: pinnedTarget.canonicalPath,
			expectedSourceIdentity: sourceIdentity
		}, params.overwrite);
		return;
	}
	const guardOptions = { bigint: sourceIdentity !== void 0 };
	const sourceParentGuard = await createAsyncDirectoryGuard(path.dirname(source.resolved), guardOptions);
	const targetParentGuard = path.dirname(target.resolved) === sourceParentGuard.dir ? sourceParentGuard : await createNearestExistingDirectoryGuard(target.rootReal, path.dirname(target.resolved), guardOptions);
	const beforeMutation = getFsSafeTestHooks()?.beforeRootFallbackMutation;
	if (beforeMutation) await beforeMutation("move", target.resolved);
	await assertAsyncDirectoryGuard(sourceParentGuard);
	if (targetParentGuard !== sourceParentGuard) await assertAsyncDirectoryGuard(targetParentGuard);
	try {
		assertFinalSymlinkRejected(source.resolved, params.mutationSymlinks !== void 0);
		assertFinalSymlinkRejected(target.resolved, params.mutationSymlinks !== void 0);
		params.assertBeforeMutation?.();
		if (sourceIdentity) {
			assertRootIdentityCurrentSync(root);
			assertSyncDirectoryGuard(sourceParentGuard);
			if (targetParentGuard !== sourceParentGuard) assertSyncDirectoryGuard(targetParentGuard);
			for (const [route, selected, expected, policy] of [[
				originalRoutes[0],
				source.resolved,
				pinnedSource.canonicalPath,
				PATH_ALIAS_POLICIES.strict
			], [
				originalRoutes[1],
				target.resolved,
				pinnedTarget.canonicalPath,
				PATH_ALIAS_POLICIES.unlinkTarget
			]]) for (const absolutePath of /* @__PURE__ */ new Set([path.isAbsolute(route) ? route : `${root.rootWithSep}${route}`, selected])) try {
				if (resolveRootPathSync({
					absolutePath,
					rootPath: root.rootReal,
					rootCanonicalPath: root.rootReal,
					rootIdentity: root.rootIdentity,
					boundaryLabel: "root",
					policy,
					...mutationSymlinkResolution(params.mutationSymlinks)
				}).canonicalPath !== expected) throw new FsSafeError("path-mismatch", "move route changed during authorization");
			} catch (error) {
				throw normalizePinnedPathError(error);
			}
			inspectFileIdentitySync(() => admitMoveSourceStat(fs.lstatSync(source.resolved, { bigint: true })), sourceIdentity);
		}
		await fs$1.rename(source.resolved, target.resolved);
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
		if (hasNodeErrorCode(error, "EEXIST")) throw new FsSafeError("already-exists", "destination exists", errorCauseOptions(error));
		throw error;
	}
	try {
		await assertAsyncDirectoryGuard(sourceParentGuard);
		if (targetParentGuard !== sourceParentGuard) await assertAsyncDirectoryGuard(targetParentGuard);
	} catch (error) {
		throw normalizePinnedPathError(error);
	}
}
async function writeFileFallback(root, params) {
	if (params.renameIdentity !== "verify-content-with-lock") return await writeFileFallbackUnlocked(root, params);
	const policy = snapshotPinnedMutationPolicy(params.denyMutations, params.mutationSymlinks);
	if (policy) params = {
		...params,
		...policy
	};
	const { rootReal, resolved } = await resolveGuardedWritePathInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations,
		mutationSymlinks: params.mutationSymlinks
	});
	await withRootFallbackCompatibilityLock({
		rootPath: rootReal,
		rootIdentity: root.rootIdentity,
		targetPath: resolved,
		assertBeforeMutation: params.assertBeforeMutation
	}, async ({ targetPath, ...binding }) => await writeFileFallbackUnlocked(root, {
		...params,
		...binding
	}, targetPath));
}
async function writeFileFallbackUnlocked(root, params, expectedWritePath) {
	if (params.overwrite === false) {
		await writeMissingFileFallback(root, params, expectedWritePath);
		return;
	}
	const admissionParams = {
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		denyMutations: params.denyMutations,
		assertBeforeMutation: params.assertBeforeMutation,
		mutationSymlinks: params.mutationSymlinks,
		truncateExisting: false,
		expectedWritePath
	};
	const admission = await openWritableFileInRoot(root, admissionParams, { createIfMissing: false });
	const existing = "missing" in admission ? void 0 : admission;
	const target = existing?.opened;
	const retainedSelection = existing?.writeSelection;
	const missingSelection = "missing" in admission ? admission.writeSelection : void 0;
	const policyEnabled = params.denyMutations !== void 0 || params.mutationSymlinks !== void 0;
	const destinationPath = "missing" in admission ? admission.targetPath : retainedSelection?.selectedPath ?? admission.opened.realPath;
	let mode = params.mode ?? (target ? target.stat.mode & 511 : void 0);
	if (policyEnabled && !retainedSelection && !missingSelection) {
		await target?.handle.close().catch(() => void 0);
		throw new FsSafeError("path-mismatch", "write admission state was not retained");
	}
	const destinationGuard = "missing" in admission ? admission.parentGuard : retainedSelection?.parentGuard ?? await createAsyncDirectoryGuard(path.dirname(destinationPath), { bigint: true }).catch(async (error) => {
		await target?.handle.close().catch(() => void 0);
		throw error;
	});
	let tempPath = null;
	let unregisterTempPath = null;
	let writtenHandle;
	let writtenIdentity;
	let lateTargetHandle;
	try {
		tempPath = buildAtomicWriteTempPath(destinationPath);
		if (retainedSelection) await refreshRetainedRootWriteAdmission(root, retainedSelection, target?.handle.fd);
		else if (missingSelection) await refreshRootWritePathSelection(missingSelection);
		params.assertBeforeMutation?.();
		if (retainedSelection) assertRootWriteSelectionSync(root, retainedSelection, target?.handle.fd);
		else if (missingSelection) assertRootWritePathSelectionSync(root, missingSelection);
		assertRootIdentityCurrentSync(root);
		assertSyncDirectoryGuard(destinationGuard);
		assertExclusiveCreateLeaf(tempPath);
		writtenHandle = await fs$1.open(tempPath, OPEN_WRITE_CREATE_FLAGS, 384);
		writtenIdentity = fs.fstatSync(writtenHandle.fd, { bigint: true });
		mode ??= Number(writtenIdentity.mode & 511n);
		unregisterTempPath = registerTempPathForExit(tempPath, {
			identity: writtenIdentity,
			singleLinkFile: true
		});
		await writeAllToFile(writtenHandle, params.data, {
			encoding: params.encoding,
			assertBeforeMutation: params.assertBeforeMutation
		});
		if (params.durable !== false) await writtenHandle.sync();
		const commitTempPath = tempPath;
		const commitHandle = writtenHandle;
		const commitIdentity = writtenIdentity;
		await withAsyncDirectoryGuards([destinationGuard], async () => {
			await verifyAtomicWriteResult({
				root,
				targetPath: commitTempPath,
				fd: commitHandle.fd,
				expectedIdentity: commitIdentity,
				parentGuard: destinationGuard
			});
			assertRootIdentityCurrentSync(root);
			assertSyncDirectoryGuard(destinationGuard);
			let publicationIdentity = inspectFallbackReplacementDestination(destinationPath);
			if (publicationIdentity && (!existing || !sameFileIdentity(publicationIdentity, existing.identity))) {
				const admitted = await openWritableFileInRoot(root, {
					...admissionParams,
					mkdir: false,
					expectedWritePath: destinationPath
				}, { createIfMissing: false });
				lateTargetHandle = "missing" in admitted ? void 0 : admitted.opened.handle;
				publicationIdentity = "missing" in admitted ? void 0 : admitted.identity;
				await lateTargetHandle?.close();
			}
			await target?.handle.close();
			if (retainedSelection) await refreshRetainedRootWriteAdmission(root, retainedSelection);
			else if (missingSelection) await refreshRootWritePathSelection(missingSelection);
			assertFinalSymlinkRejected(destinationPath, params.mutationSymlinks !== void 0);
			params.assertBeforeMutation?.();
			if (retainedSelection) assertRootWriteSelectionSync(root, retainedSelection);
			else if (missingSelection) assertRootWritePathSelectionSync(root, missingSelection);
			assertRootIdentityCurrentSync(root);
			assertSyncDirectoryGuard(destinationGuard);
			const current = inspectFallbackReplacementDestination(destinationPath);
			if (publicationIdentity ? !current || !sameFileIdentity(current, publicationIdentity) : current) throw new FsSafeError("path-mismatch", "write destination changed before publication");
			await fs$1.rename(commitTempPath, destinationPath);
			tempPath = null;
		});
		unregisterTempPath();
		unregisterTempPath = null;
		await finishRootFallbackWrite({
			root,
			targetPath: destinationPath,
			handle: writtenHandle,
			identity: writtenIdentity,
			parentGuard: destinationGuard,
			mode,
			options: params,
			openForCompatibility: () => openVerifiedLocalFile(destinationPath, {
				hardlinks: "reject",
				readWrite: true
			}),
			onVerificationFailure: (err) => emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`)
		});
	} finally {
		await target?.handle.close().catch(() => void 0);
		await lateTargetHandle?.close().catch(() => void 0);
		if (tempPath && writtenHandle) await cleanupPinnedFilePath({
			pathname: tempPath,
			handle: writtenHandle,
			identity: writtenIdentity,
			parentGuard: destinationGuard
		});
		await writtenHandle?.close().catch(() => void 0);
		unregisterTempPath?.();
	}
}
function inspectFallbackReplacementDestination(targetPath) {
	let current;
	try {
		current = inspectFileIdentitySync(() => fs.lstatSync(targetPath, { bigint: true }));
	} catch (error) {
		if (isNotFoundPathError(error)) return;
		throw error;
	}
	if (current.isSymbolicLink() || !current.isFile()) throw new FsSafeError("path-mismatch", "write destination changed before publication");
	if (current.nlink > 1n) throw hardlinkedPathNotAllowedError();
	return current;
}
async function writeMissingFileFallback(root, params, expectedWritePath) {
	const guardedTarget = params.denyMutations === void 0 && params.mutationSymlinks === void 0 ? void 0 : await resolveGuardedWriteTargetInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations,
		mutationSymlinks: params.mutationSymlinks
	});
	const { resolved } = guardedTarget?.resolvedPath ?? await resolveGuardedWritePathInRoot(root, { relativePath: params.relativePath });
	const prepared = guardedTarget ? await prepareSharedRootWriteTarget(root, {
		relativePath: params.relativePath,
		guardedTarget,
		mkdir: params.mkdir,
		assertBeforeMutation: params.assertBeforeMutation
	}) : void 0;
	const mutationAdmission = prepared?.mutationAdmission;
	const preparedParent = prepared?.preparedParent;
	const targetPath = prepared?.targetPath ?? (params.mkdir === false ? resolved : await prepareRootWriteTarget(root, resolved, params.assertBeforeMutation));
	assertRootFallbackWritePath(expectedWritePath, targetPath);
	const parentGuard = (guardedTarget ? await prepareGuardedRootWritePathSelection(guardedTarget, targetPath, targetPath, preparedParent) : void 0)?.parentGuard ?? await createAsyncDirectoryGuard(path.dirname(targetPath), { bigint: true });
	let created = false;
	let completed = false;
	let createdIdentity;
	let writtenHandle;
	let verifyingPublication = false;
	try {
		const { handle, writtenStat } = await withAsyncDirectoryGuards([parentGuard], async () => {
			assertFinalSymlinkRejected(targetPath, params.mutationSymlinks !== void 0);
			params.assertBeforeMutation?.();
			if (mutationAdmission) assertSyncDirectoryGuard(parentGuard);
			assertExclusiveCreateLeaf(targetPath);
			const handle = await fs$1.open(targetPath, OPEN_WRITE_CREATE_FLAGS, params.mode ?? 384).catch((error) => recordExclusiveCreateFailure(error, targetPath));
			writtenHandle = handle;
			created = true;
			const writtenStat = fs.fstatSync(handle.fd, { bigint: true });
			createdIdentity = writtenStat;
			await writeAllToFile(handle, params.data, {
				encoding: params.encoding,
				assertBeforeMutation: () => {
					assertFinalSymlinkRejected(targetPath, params.mutationSymlinks !== void 0);
					params.assertBeforeMutation?.();
					if (mutationAdmission) assertSyncDirectoryGuard(parentGuard);
				}
			});
			if (params.durable !== false) await handle.sync();
			return {
				handle,
				writtenStat
			};
		}, { onPostGuardFailure: () => {
			created = false;
		} });
		writtenHandle = handle;
		created = false;
		verifyingPublication = true;
		await verifyAtomicWriteResult({
			root,
			targetPath,
			expectedIdentity: writtenStat,
			fd: handle.fd,
			parentGuard
		});
		if (params.durable !== false) await syncDirectoryBestEffort(path.dirname(targetPath));
		completed = true;
	} catch (err) {
		if (verifyingPublication) throw err;
		if (hasNodeErrorCode(err, "EEXIST")) throw new FsSafeError("already-exists", "file already exists", errorCauseOptions(err));
		throw err;
	} finally {
		if (created && writtenHandle) await cleanupPinnedFilePath({
			pathname: targetPath,
			handle: writtenHandle,
			identity: createdIdentity,
			parentGuard
		});
		if (completed) await writtenHandle?.close();
		else await writtenHandle?.close().catch(() => void 0);
	}
}
//#endregion
//#region src/infra/fs-safe.ts
async function root(rootDir, defaults) {
	return await root$1(rootDir, defaults);
}
//#endregion
export { resolveOpenedFileRealPathForHandle as n, root as t };
