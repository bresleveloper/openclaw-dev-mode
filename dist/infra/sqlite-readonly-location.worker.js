import { A as normalizeWindowsPathPreservingCase, B as getFsSafeTestHooks, L as resolveIdentityPathViaExistingAncestorSync, N as resolveRequiredOsHomeDir, R as isNonRegularWriteOpenError, W as sliceUtf16Safe, _ as resolveGatewayLockDirForCanonicalStateDir, _t as normalizeNullableString, et as coerceErrorMessage, g as resolveGatewayLockDir, i as resolvePreferredOpenClawTmpDir, lt as registerSignalExitFinalizer, n as routeLogsToStderr, pt as resolveGlobalSingleton, q as MAX_TIMER_TIMEOUT_MS, r as getChildLogger, rt as extractErrorCode, s as normalizeDiagnosticWorkerScript, t as createSubsystemLogger, wt as isRecord$1, y as resolveStateDir, z as resolveNonblockingWriteFlag } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { $ as fileNotFoundError, A as isNativeDirectoryObservationGuard, At as requireNativeBinding, B as assertDirectoryObservationSync, Bt as recordFileObservationFailure, C as resolveExistingAncestor, Ct as resolvePathFromBasePreservingWindowsRoot, D as sameNormalizedPathSpelling, Dt as assertNativeCapabilities, E as admitPathInsideRoot, Et as assertWindowsHelperAllowed, F as shortPath, Ft as captureNativeFdClose, G as extendDirectoryObservationGuard, Gt as sameFileIdentityForCleanup, H as captureDirectoryGuard, Ht as hasSafeFileIdentity, I as assertAsyncDirectoryGuard, It as inspectFileIdentity, J as inspectDirectoryObservationSync, K as inspectDirectoryIdentity, Kt as sha256Hex$1, L as assertDirectoryGuard, Lt as inspectFileIdentitySync, M as statIdentityFromNative, Mt as getFsSafeNativeConfig, N as isRootPathEscapeError, Nt as getNativeModeSetting, O as getNativeDirectoryObservationBackend, Ot as getNativeBinding, P as formatErrorDetail, Pt as isFsSafeNativeRequired, Q as errorCauseOptions, R as assertDirectoryIdentitySync, Rt as fileObservation, S as absolutePathWithRawSegments, St as pathForWindowsFilesystem, Tt as realpathSync$1, U as createAsyncDirectoryGuard, Ut as identityFromReceipt, V as assertSyncDirectoryGuard, Vt as FsSafeError, W as createNearestExistingDirectoryGuard, Wt as sameFileIdentity, X as inspectStatObservationSync, Y as assertStatObservationSync, Z as directoryComponentNotDirectoryError, _ as resolveRootPath, _t as WINDOWS_RESERVED_DEVICE_NAMES, at as normalizeRemovePathError, b as resolveRootPathWithObservation, bt as anchorWindowsDriveRelativePath, c as openRootFileSync, ct as assertNoNulPathInput, d as readSymlinkResolution, dt as isPathInside, et as hardlinkedPathNotAllowedError, f as exactFileIdentity$1, ft as isPathRelativeEscape, g as ROOT_PATH_ALIAS_POLICIES, gt as isSafePathSegment, h as resolveReadOpenFlags, ht as isDriveRelativePath, it as normalizeRemoveGuardError, j as isNativeStatIdentity, jt as selectNativeBinding, k as inspectNativeDirectoryObservation, kt as getNativeFallbackDiagnostic, l as assertFinalSymlinkRejected, lt as hasNodeErrorCode, m as numberStats, mt as normalizeWindowsPathForComparison, nt as normalizePinnedPathError, ot as outsideWorkspaceError, p as numberStatScalar, pt as isSymlinkOpenError, q as inspectDirectoryIdentitySync, rt as normalizePinnedWriteError, st as rootPathChangedError, tt as isAlreadyExistsError, u as mutationSymlinkResolution, ut as isNotFoundPathError, v as resolveRootPathForRemoval, vt as assertNoUnsafeDeviceReadPath, w as resolvePathViaExistingAncestor, wt as resolvePathPreservingWindowsRoot, x as RootPathObservationError, xt as assertNoWindowsPathAlias, y as resolveRootPathSync, z as assertDirectoryObservationGuardSync, zt as isFileObservationFailure } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { a as normalizeMaxBytes, i as readFileHandleBoundedWithSize, n as readFileDescriptorBoundedSync, r as readFileHandleBounded, t as readBoundedSync } from "./sqlite-readonly-bounded-read-BfWjRyKI.mjs";
import { An as readFileWindowFullySync, At as prepareSqliteTransactionCommit, Bt as AsyncWorkScope, Ct as retireSqliteDatabaseAdmissionForPath, D as getNodeSqliteKysely, Dn as runWithSqliteCleanup, E as executeSqliteQueryTakeFirstSync, En as createSqliteLifecycleAggregateError, F as readSqliteReaderDiagnosticsForPath, Ht as createDeferredCore, I as sqliteReaderDatabasePathKey, L as sql, Lt as VERSION, N as captureSqliteReaderOwner, On as throwSqliteLifecycleErrors, Ot as discardSqliteTransactionState, P as currentSqliteOperationTiming, Pt as withSqlitePostCommitPublications, Q as executeWithCachedStatement, Rt as resolveRuntimeServiceCommit, S as runSqliteReadOperationSync, U as getSqliteRuntimeCapabilities, Ut as runInDetachedAsyncContext, Vt as runOutsideAsyncWorkScope, Wt as materializeErrorStack, Y as clearNodeSqliteKyselyCacheForDatabase, Zt as parseSqliteTableDefinition, _ as getAdmittedSqliteSchemaFacts, a as shouldReportSqliteLockFailure, at as getOrLoadSqliteDatabaseAdmissionForPath, bn as isPostgresSqlConnection, c as requireNodeSqlite, cn as assertDatabaseFileIdentity, d as resolveSqliteFilesystemPath, dn as inspectDatabasePathIdentitySync, fn as normalizeDatabasePath, ft as onSqliteDatabaseWriteSettled, gn as readDatabasePathIdentitySync, ht as publishSqliteDatabaseAdmission, i as setSqliteBusyTimeout, in as readSqlToken, kn as isPromiseLike$1, l as resolveExistingSqliteFileUri, ln as assertExistingDatabaseIdentity, n as readSqliteBusyTimeout, ot as getSqliteDatabaseAdmission, pn as readDatabaseFileIdentity, q as schemaAdmission, r as runWithSqliteBusyTimeout, s as openNodeSqliteDatabase, st as getSqliteDatabaseAdmissionIdentityForPath, t as normalizeSqliteNonNegativeInteger, un as findChangedDatabasePaths, vn as assertPostgresTransactionUsable, yt as readSqliteDatabaseWriteRevision, zt as resolveOpenClawPackageRootSync } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { a as runtimeProcessEntrypoints, t as isBunRuntime } from "./sqlite-readonly-runtime-binary-aVOs5Y3K.mjs";
import { A as withSqliteInspectionOperation, C as isSqliteLockError, D as sqliteErrorCode, O as sqliteExtendedResultCode, T as markSqliteInspectionOperation, b as formatSqliteErrorCodeSuffix, d as number, f as object, g as union, h as string, i as array, j as withSqliteNativeOpen, k as sqlitePrimaryResultCode, l as literal, m as strictObject, n as _enum, s as discriminatedUnion, x as formatSqliteReadOnlyInspectionFailure } from "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { t as formatErrorMessage } from "./sqlite-readonly-errors-CyzrIIqN.mjs";
import * as module from "node:module";
import { createRequire } from "node:module";
import path, { basename } from "node:path";
import { scheduler, setImmediate as setImmediate$1 } from "node:timers/promises";
import { deserialize, serialize, setFlagsFromString } from "node:v8";
import { createHash, hash, randomBytes, randomUUID } from "node:crypto";
import fs, { chmodSync, constants, readSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import fs$1 from "node:fs/promises";
import os, { platform } from "node:os";
import { MessageChannel, MessagePort, Worker, isMainThread, threadId, workerData } from "node:worker_threads";
import { isDeepStrictEqual, promisify, toUSVString, types } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";
import childProcess, { execFile, spawn, spawnSync } from "node:child_process";
import { isUtf8 } from "node:buffer";
import { performance as performance$1 } from "node:perf_hooks";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { readProcessIdentity } from "@openclaw/proc-safe/identity";
//#region node-compile-cache.mjs
if (isMainThread && process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED === "gateway") {
	delete process.env.NODE_DISABLE_COMPILE_CACHE;
	delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED;
}
const MAX_BYTES = 536870912;
const MAX_AGE_MS = 6048e5;
const MAINTENANCE_INTERVAL_MS = 36e5;
const BUILD_MARKER_RE = /^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/;
const sanitize = (value) => {
	const segment = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return segment && segment !== "." && segment !== ".." ? segment : "unknown";
};
function scheduleOpenClawCompileCacheFlush() {
	if (!module.getCompileCacheDir?.()) return;
	const owner = globalThis[Symbol.for("openclaw.nodeCompileCacheBase")] ??= {};
	if (owner.flush) return;
	owner.flush = setImmediate(() => {
		owner.flush = void 0;
		try {
			module.flushCompileCache();
		} catch {}
	});
	owner.flush.unref();
}
function resolveSafeNodeCompileCacheDirectory(directory) {
	if (process.platform === "win32" && path.resolve(directory).length > 200) {
		process.stderr.write("[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.\n");
		return;
	}
	return directory;
}
async function maintain(directory) {
	const root = path.dirname(path.dirname(directory));
	const version = path.basename(path.dirname(directory));
	if (path.basename(root) !== "openclaw" || sanitize(version) !== version || !BUILD_MARKER_RE.test(path.basename(directory))) return;
	const now = Date.now();
	const previous = await fs$1.lstat(root).catch(() => void 0);
	for (const target of [
		root,
		path.dirname(directory),
		directory
	]) {
		const stat = target === root ? previous : await fs$1.lstat(target).catch(() => void 0);
		if (stat && !stat.isDirectory()) return;
	}
	await fs$1.mkdir(directory, { recursive: true });
	if (previous && now - previous.mtimeMs < MAINTENANCE_INTERVAL_MS) return;
	await fs$1.utimes(root, new Date(now), new Date(now));
	const files = [];
	let bytes = 0;
	async function visit(dir) {
		for (const entry of await fs$1.readdir(dir, { withFileTypes: true })) {
			const file = path.join(dir, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isFile()) {
				const stat = await fs$1.lstat(file);
				bytes += stat.size;
				files.push({
					file,
					size: stat.size,
					mtimeMs: stat.mtimeMs
				});
			}
		}
	}
	await visit(root);
	files.sort((left, right) => left.mtimeMs - right.mtimeMs);
	for (const file of files) if (bytes > MAX_BYTES || now - file.mtimeMs > MAX_AGE_MS) {
		await fs$1.unlink(file.file);
		bytes -= file.size;
	}
}
if (!isMainThread && typeof workerData?.openclawCompileCacheDirectory === "string") maintain(workerData.openclawCompileCacheDirectory).catch(() => {});
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy-policy.js
function resolveCopyCloneMode(mode, defaultMode) {
	const policy = mode === void 0 ? defaultMode : mode;
	if (policy !== "auto" && policy !== "always" && policy !== "never") throw new FsSafeError("invalid-path", "copy clone policy must be auto, always, or never");
	return policy;
}
//#endregion
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-policy-directory-observation.js
var NativePolicyDirectoryMismatch = class extends FsSafeError {
	constructor(cause) {
		super("path-mismatch", "staging directory pathname changed", { cause });
	}
};
/** Fresh name/metadata/canonical facts from a caller-owned POSIX descriptor. */
function nativePolicyDirectoryObserver(binding, fd, pathname) {
	if (!binding || process.platform === "win32" || process.versions.bun) return void 0;
	const observe = binding.observeDirectoryFd;
	if (typeof observe !== "function") return void 0;
	const mode = getFsSafeNativeConfig().mode;
	let disposed = false;
	const inspect = () => {
		if (disposed) throw new NativePolicyDirectoryMismatch();
		if (getFsSafeNativeConfig().mode !== mode) return void 0;
		let observed;
		try {
			observed = observe.call(binding, fd, pathname);
		} catch (error) {
			if (error?.code === "OBSERVATION_UNAVAILABLE") return void 0;
			if (error?.code === "OBSERVATION_REDIRECTED") throw new FsSafeError("path-mismatch", "staging directory pathname redirected");
			if (error?.code === "path-mismatch") throw new NativePolicyDirectoryMismatch(error instanceof Error ? error : void 0);
			throw error;
		}
		if (getFsSafeNativeConfig().mode !== mode) return void 0;
		if (!observed || !isNativeStatIdentity(observed.dev) || !isNativeStatIdentity(observed.ino) || typeof observed.mode !== "bigint" || observed.mode < 0n || observed.mode > 4294967295n || typeof observed.nlink !== "bigint" || observed.nlink < 0n || observed.nlink > 18446744073709551615n || typeof observed.realPath !== "string" || observed.realPath.includes("\0") || !path.isAbsolute(observed.realPath)) return void 0;
		if ((observed.mode & 61440n) !== 16384n || observed.nlink === 0n || observed.realPath !== pathname) throw new NativePolicyDirectoryMismatch();
		return Object.freeze({
			canonicalPath: observed.realPath,
			identity: Object.freeze({
				dev: statIdentityFromNative(observed.dev),
				ino: statIdentityFromNative(observed.ino),
				mode: observed.mode,
				nlink: observed.nlink
			})
		});
	};
	return Object.assign(inspect, { dispose() {
		disposed = true;
	} });
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-mode-node.js
/** Darwin descriptor inspection avoids requesting directory-content reads. */
function nodeDarwinDirectoryMetadataFlags() {
	if (process.platform !== "darwin" || process.arch !== "x64" && process.arch !== "arm64") throw new FsSafeError("helper-unavailable", "Darwin directory metadata descriptors are unavailable");
	return 32768 | constants.O_DIRECTORY | constants.O_NOFOLLOW | constants.O_NONBLOCK;
}
function nodeDirectorySearchOnlyFlags() {
	if (process.arch !== "x64" && process.arch !== "arm64") return void 0;
	if (process.platform === "darwin") return {
		flags: 1073741824,
		proc: false
	};
	if (process.platform === "linux") return {
		flags: 2097152,
		proc: true
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-guidance.js
/** Shared, path-free next steps for status reports and fallback warnings. */
function nativeGuidance(reason, modeSource) {
	switch (reason) {
		case "disabled": return `If native loading is intended, ${modeSource === "programmatic configuration" ? "call configureFsSafeNative({ mode: \"auto\" }) or configureFsSafeNative({ mode: \"require\" })" : `set ${modeSource}=auto or ${modeSource}=require`}; keep intentional off settings.`;
		case "unsupported-target": return "Portable mode is expected on this target.";
		case "package-missing": return "Reinstall with optional dependencies included: npm --include=optional, or pnpm without --no-optional / optional=false. Check the lockfile and registry mirror.";
		case "load-failed": return "Check Node architecture, Linux libc compatibility, package dependencies, and OS code-integrity policy. Reinstalling identical bytes may not help.";
		case "capability-missing": return "Use matching fs-safe and platform-package versions; some targets intentionally provide only a subset of capabilities.";
		default: return;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-fallback-warning.js
const warnedFeatures = /* @__PURE__ */ new Set();
function fallbackReason(capabilities) {
	const diagnostic = getNativeFallbackDiagnostic(...capabilities);
	const expected = diagnostic.packageName === void 0 ? `No native package is published for ${diagnostic.target}.` : `Expected ${diagnostic.packageName}@${diagnostic.packageVersion}.`;
	const guidance = nativeGuidance(diagnostic.reason, getNativeModeSetting().source);
	switch (diagnostic.reason) {
		case "disabled": return `native support is disabled by ${diagnostic.source} (disabled). ${expected} ${guidance}`;
		case "unsupported-target": return `the target ${diagnostic.target} is unsupported (unsupported-target). ${expected} ${guidance}`;
		case "package-missing": return `the selected native package could not be resolved (package-missing). ${expected} ${guidance}`;
		case "load-failed": return `the native package could not be loaded (load-failed: ${diagnostic.code}). ${expected} ${guidance}`;
		case "capability-missing": return `the native package lacks requested functions (capability-missing: ${diagnostic.capabilities.join(", ")}). ${expected} ${guidance}`;
		default: return `the requested native operation is unavailable (${diagnostic.reason}). ${expected}`;
	}
}
/** Warn once per capability, without including caller paths or native error text. */
function warnNativeFallback(feature, limitation, ...capabilities) {
	if (warnedFeatures.has(feature)) return;
	warnedFeatures.add(feature);
	process.emitWarning(`${feature} is using its portable fallback because ${fallbackReason(capabilities)} ${limitation}`, {
		code: "FS_SAFE_NATIVE_FALLBACK",
		type: "FsSafeWarning"
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-security-helper.js
function windowsSecurityHelperPath() {
	return fileURLToPath(new URL("./windows-security-helper.exe", new URL("dist/windows-security-helper.js", import.meta.resolve("@openclaw/fs-safe/package.json")).href));
}
function explainWindowsSecurityHelperFailure(error) {
	error.message += "; Windows security helper could not complete; rebuild with pnpm build:windows-helper or reinstall @openclaw/fs-safe";
}
promisify(execFile);
const DEFAULT_PERMISSION_EXEC_TIMEOUT_MS = 3e4;
function formatPermissionErrorDetail(value) {
	const formatted = formatErrorDetail(value.slice(0, 401));
	return formatted.length > 400 ? `${formatted.slice(0, 399)}…` : formatted;
}
const MAX_CAUGHT_FAILURE_PROTOTYPES = 4;
const isUint8Array$1 = types.isUint8Array;
const Uint8ArrayIntrinsic = Uint8Array;
const typedArrayPrototype = Object.getPrototypeOf(Uint8ArrayIntrinsic.prototype);
const typedArrayBufferGetter = Object.getOwnPropertyDescriptor(typedArrayPrototype, "buffer").get;
const typedArrayByteOffsetGetter = Object.getOwnPropertyDescriptor(typedArrayPrototype, "byteOffset").get;
const typedArrayByteLengthGetter = Object.getOwnPropertyDescriptor(typedArrayPrototype, "byteLength").get;
const typedArraySet = Object.getOwnPropertyDescriptor(typedArrayPrototype, "set").value;
const textDecoderDecode = TextDecoder.prototype.decode;
const stderrDecoder = new TextDecoder("utf-8", {
	fatal: false,
	ignoreBOM: true
});
const MAX_STDERR_BYTES = 1600;
function isInspectableCaughtObject(value) {
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return false;
	try {
		return !types.isProxy(value);
	} catch {
		return false;
	}
}
function dataProperty$1(value, name) {
	let current = value;
	for (let depth = 0; current !== null && depth < MAX_CAUGHT_FAILURE_PROTOTYPES; depth += 1) {
		if (!isInspectableCaughtObject(current)) return void 0;
		let descriptor;
		try {
			descriptor = Object.getOwnPropertyDescriptor(current, name);
		} catch {
			return;
		}
		if (descriptor) return Object.hasOwn(descriptor, "value") ? descriptor : void 0;
		try {
			current = Object.getPrototypeOf(current);
		} catch {
			return;
		}
	}
}
function formatBoundedCaughtDetail(value, alreadyTruncated = false) {
	const inputWasTruncated = alreadyTruncated || value.length > 400;
	const formatted = formatPermissionErrorDetail(value.slice(0, 400));
	if (!inputWasTruncated || formatted.endsWith("…")) return formatted;
	return `${formatted.slice(0, 399)}…`;
}
function safeStderr(value) {
	if (typeof value === "string") return formatBoundedCaughtDetail(value);
	try {
		if (!isUint8Array$1(value)) return "";
		const backing = Reflect.apply(typedArrayBufferGetter, value, []);
		const byteOffset = Reflect.apply(typedArrayByteOffsetGetter, value, []);
		const byteLength = Reflect.apply(typedArrayByteLengthGetter, value, []);
		const copiedByteLength = byteLength < MAX_STDERR_BYTES ? byteLength : MAX_STDERR_BYTES;
		const source = new Uint8ArrayIntrinsic(backing, byteOffset, copiedByteLength);
		const copy = new Uint8ArrayIntrinsic(copiedByteLength);
		Reflect.apply(typedArraySet, copy, [source, 0]);
		return formatBoundedCaughtDetail(Reflect.apply(textDecoderDecode, stderrDecoder, [copy]), byteLength > copiedByteLength);
	} catch {
		return "";
	}
}
function commandFailureFields(error) {
	const killed = dataProperty$1(error, "killed");
	const code = dataProperty$1(error, "code");
	const signal = dataProperty$1(error, "signal");
	const stderr = dataProperty$1(error, "stderr");
	return {
		found: !!(killed || code || signal || stderr),
		timedOut: killed?.value === true && signal?.value === "SIGKILL",
		exitCode: typeof code?.value === "number" ? code.value : null,
		signal: typeof signal?.value === "string" ? signal.value : null,
		stderr: stderr ? safeStderr(stderr.value) : ""
	};
}
var PermissionCommandError = class extends Error {
	command;
	durationMs;
	timedOut;
	exitCode;
	signal;
	stderr;
	constructor(command, durationMs, cause, timeoutMs = DEFAULT_PERMISSION_EXEC_TIMEOUT_MS) {
		const fields = commandFailureFields(cause);
		super(fields.timedOut ? `Windows permission inspection timed out after ${timeoutMs}ms` : `Windows permission command ${formatPermissionErrorDetail(path.win32.basename(command))} failed (exit code ${fields.exitCode}, signal ${formatPermissionErrorDetail(fields.signal ?? "none")})`, { cause });
		this.name = "PermissionCommandError";
		this.command = command;
		this.durationMs = Math.round(durationMs);
		this.timedOut = fields.timedOut;
		this.exitCode = fields.exitCode;
		this.signal = fields.signal;
		this.stderr = fields.stderr;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-security-facts.js
function unverified(message, cause) {
	throw new FsSafeError("permission-unverified", message, cause === void 0 ? {} : { cause });
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-security-command.js
const MAX_OUTPUT_BYTES = 1048576;
const TERMINATION_GRACE_MS = 1e3;
const FULL_IDENTITY = /^[0-9a-f]{16}:[0-9a-f]{32}$/;
function isFullIdentity(identity) {
	return typeof identity === "string" && identity.length === 49 && FULL_IDENTITY.test(identity);
}
function assertIdentity(identity) {
	if (!isFullIdentity(identity)) throw new TypeError("Windows security operation requires a complete file identity");
}
function command(operation, params) {
	const targetPath = params.targetPath ?? "";
	if (targetPath.includes("\0")) throw Object.assign(/* @__PURE__ */ new Error("Windows path contains a NUL byte"), { code: "EINVAL" });
	if (params.fd !== void 0 || operation === "descriptor" || operation === "protect-file" || operation === "verify-file") {
		if (typeof params.fd !== "number" || !Number.isInteger(params.fd) || params.fd < 0 || params.fd > 2147483647) unverified("Windows security inspection requires a valid descriptor");
	}
	if (params.expectedParentIdentity !== void 0) assertIdentity(params.expectedParentIdentity);
	if (params.expectedFileIdentity !== void 0) assertIdentity(params.expectedFileIdentity);
	if (params.expectedLinks !== void 0 && (!Number.isInteger(params.expectedLinks) || params.expectedLinks < 1 || params.expectedLinks > 4294967295)) throw new TypeError("Windows security operation requires a positive uint32 link count");
	return {
		file: windowsSecurityHelperPath(),
		args: [operation],
		env: {
			...process.env,
			FS_SAFE_WINDOWS_SECURITY_PATH: targetPath,
			FS_SAFE_WINDOWS_SECURITY_REQUIRE_PRIVATE: params.requirePrivate ? "1" : "0",
			FS_SAFE_WINDOWS_SECURITY_PARENT_IDENTITY: params.expectedParentIdentity ?? "",
			FS_SAFE_WINDOWS_SECURITY_FILE_IDENTITY: params.expectedFileIdentity ?? "",
			FS_SAFE_WINDOWS_SECURITY_EXPECTED_LINKS: String(params.expectedLinks ?? 1)
		}
	};
}
function record(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function parseReply(stdout, operation) {
	try {
		return parseReplyValue(stdout, operation);
	} catch (error) {
		if (operation === "create" && error instanceof Error && error.code !== "EEXIST") Object.assign(error, { creationOutcome: "unconfirmed" });
		throw error;
	}
}
function parseReplyValue(stdout, operation) {
	let response;
	try {
		response = JSON.parse(stdout.trim());
	} catch (cause) {
		unverified("Windows security command returned invalid data", cause);
	}
	if (!record(response) || typeof response.ok !== "boolean") unverified("Windows security command returned an incomplete response");
	if (!response.ok) {
		if (operation === "paths" && (response.code === "helper-unavailable" || response.code === "too-large") && typeof response.message === "string") throw new FsSafeError(response.code, response.message);
		const codes = /* @__PURE__ */ new Set([
			"EACCES",
			"EPERM",
			"EEXIST",
			"ENOENT",
			"ENOTSUP",
			"EIO",
			"EBADF",
			"ELOOP",
			"ENOTDIR",
			"EINVAL",
			"ENOSPC",
			"EBUSY"
		]);
		if (typeof response.code !== "string" || !codes.has(response.code) || typeof response.message !== "string") unverified("Windows security command returned an invalid failure");
		if (response.errno !== void 0 && (typeof response.errno !== "number" || !Number.isInteger(response.errno) || response.errno < 0 || response.errno > 4294967295)) unverified("Windows security command returned an invalid native error number");
		const failure = Object.assign(new Error(response.message), { code: response.code });
		if (response.errno !== void 0) Object.defineProperty(failure, "errno", {
			value: response.errno,
			enumerable: true,
			configurable: true,
			writable: true
		});
		throw failure;
	}
	if (operation === "create" && (!record(response.result) || response.result.created !== true || !isFullIdentity(response.result.identity))) unverified("Windows security command did not verify private-directory creation");
	return response.result;
}
function explainHelperFailure(error, file) {
	if (file.endsWith("windows-security-helper.exe")) explainWindowsSecurityHelperFailure(error);
}
function executeSync(operation, params) {
	assertWindowsHelperAllowed();
	const { file, args, env } = command(operation, params);
	const startedAt = performance.now();
	const result = spawnSync(file, args, {
		encoding: "utf8",
		windowsHide: true,
		env,
		stdio: [
			params.fd ?? "ignore",
			"pipe",
			"pipe"
		],
		timeout: DEFAULT_PERMISSION_EXEC_TIMEOUT_MS,
		killSignal: "SIGKILL",
		maxBuffer: MAX_OUTPUT_BYTES
	});
	if (result.error || result.status !== 0) {
		const error = new PermissionCommandError(file, performance.now() - startedAt, {
			cause: result.error,
			code: result.status,
			signal: result.error?.code === "ETIMEDOUT" ? "SIGKILL" : result.signal,
			stderr: result.stderr,
			killed: result.error?.code === "ETIMEDOUT",
			...operation === "create" ? { creationOutcome: "unconfirmed" } : {}
		});
		explainHelperFailure(error, file);
		if (operation === "create") Object.assign(error, { creationOutcome: "unconfirmed" });
		throw error;
	}
	return parseReply(result.stdout, operation);
}
var WindowsSecurityCommandError = class extends PermissionCommandError {
	timedOut;
	creationOutcome;
	processExitConfirmed;
	constructor(file, durationMs, receipt, timedOut, timeoutMs = DEFAULT_PERMISSION_EXEC_TIMEOUT_MS) {
		super(file, durationMs, receipt, timeoutMs);
		this.timedOut = timedOut;
		if (!timedOut) explainHelperFailure(this, file);
		this.creationOutcome = receipt.creationOutcome;
		this.processExitConfirmed = receipt.processExitConfirmed;
		if (timedOut) this.message = `Windows permission inspection timed out after ${timeoutMs}ms`;
		if (!receipt.processExitConfirmed) this.message += "; process exit was not confirmed";
		else if (!receipt.outputClosed) this.message += "; command output did not close";
		if (receipt.creationOutcome) this.message += "; private-directory creation outcome is unconfirmed";
	}
};
/** Cleanup must preserve stages still reachable by an unsettled command. */
function hasUnsettledWindowsSecurityCommand(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (let inspected = 0; pending.length && inspected < 32; inspected++) {
		const current = pending.pop();
		if (current === null || typeof current !== "object" || seen.has(current)) continue;
		seen.add(current);
		try {
			if (current instanceof WindowsSecurityCommandError && !current.processExitConfirmed) return true;
			const cause = Object.getOwnPropertyDescriptor(current, "cause");
			if (cause && "value" in cause) pending.push(cause.value);
			if (current instanceof AggregateError) {
				const errors = Object.getOwnPropertyDescriptor(current, "errors");
				if (errors && "value" in errors && Array.isArray(errors.value)) pending.push(...errors.value.slice(0, 32));
			}
		} catch {
			return true;
		}
	}
	return pending.length > 0;
}
function ignoreLateError() {}
async function execute(operation, params, request) {
	assertWindowsHelperAllowed();
	const { file, args, env, input, timeoutMs = DEFAULT_PERMISSION_EXEC_TIMEOUT_MS, maxOutputBytes = MAX_OUTPUT_BYTES } = request ?? command(operation, params);
	const startedAt = performance.now();
	return await new Promise((resolve, reject) => {
		const child = spawn(file, args, {
			windowsHide: true,
			env,
			stdio: [
				input === void 0 ? params.fd ?? "ignore" : "pipe",
				"pipe",
				"pipe"
			]
		});
		const output = [];
		const errors = [];
		let bytes = 0;
		let failure;
		let failed = false;
		let timedOut = false;
		let stopping = false;
		let settled = false;
		let processExitConfirmed = false;
		let exitCode = null;
		let exitSignal = null;
		let terminationSignalSent;
		let terminationError;
		let grace;
		let missingPipes;
		const deadlineError = () => /* @__PURE__ */ new Error("Windows security command exceeded its inspection deadline");
		const timeout = setTimeout(() => {
			timedOut = true;
			fail(deadlineError());
		}, timeoutMs);
		const finish = (outputClosed) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			clearTimeout(grace);
			clearImmediate(missingPipes);
			child.removeListener("exit", onExit);
			child.removeListener("close", onClose);
			child.removeListener("error", onChildError);
			child.on("error", ignoreLateError);
			const cleanupErrors = [];
			if (input !== void 0 && child.stdin) {
				child.stdin.removeListener("error", fail);
				child.stdin.on("error", ignoreLateError);
				if (!outputClosed) try {
					child.stdin.destroy();
				} catch (error) {
					cleanupErrors.push(error);
				}
			}
			for (const [stream, collect] of [[child.stdout, collectOutput], [child.stderr, collectErrors]]) {
				if (!stream) continue;
				stream.removeListener("data", collect);
				stream.removeListener("error", fail);
				stream.on("error", ignoreLateError);
				if (!outputClosed) try {
					stream.destroy();
				} catch (error) {
					cleanupErrors.push(error);
				}
			}
			if (!outputClosed && !processExitConfirmed) try {
				child.unref();
			} catch (error) {
				cleanupErrors.push(error);
			}
			if (failed || exitCode !== 0 || !outputClosed) reject(new WindowsSecurityCommandError(file, performance.now() - startedAt, {
				cause: failure,
				pid: child.pid ?? null,
				code: exitCode,
				signal: exitSignal,
				stderr: Buffer.concat(errors),
				processExitConfirmed,
				outputClosed,
				terminationSignalSent,
				terminationError,
				cleanupErrors,
				...operation === "create" ? { creationOutcome: "unconfirmed" } : {}
			}, timedOut, timeoutMs));
			else try {
				resolve(parseReply(Buffer.concat(output).toString("utf8"), operation));
			} catch (error) {
				reject(error);
			}
			output.length = 0;
			errors.length = 0;
		};
		const fail = (error) => {
			if (settled) return;
			if (!failed) {
				failed = true;
				failure = error;
			}
			if (stopping) return;
			stopping = true;
			clearTimeout(timeout);
			grace = setTimeout(() => finish(false), TERMINATION_GRACE_MS);
			if (!processExitConfirmed) try {
				terminationSignalSent = child.kill("SIGKILL");
			} catch (error) {
				terminationError ??= error;
			}
		};
		const collect = (chunks) => (chunk) => {
			if (failed || settled) return;
			bytes += chunk.length;
			if (bytes <= maxOutputBytes) chunks.push(chunk);
			else fail(/* @__PURE__ */ new Error("Windows security command exceeded its output budget"));
		};
		const collectOutput = collect(output);
		const collectErrors = collect(errors);
		const onChildError = (error) => {
			if (settled) return;
			if (stopping) terminationError ??= error;
			else fail(error);
		};
		const onExit = (code, signal) => {
			processExitConfirmed = true;
			exitCode = code;
			exitSignal = signal;
		};
		const onClose = (code, signal) => {
			onExit(code, signal);
			if (!failed && performance.now() - startedAt >= timeoutMs) {
				timedOut = true;
				failed = true;
				failure = deadlineError();
			}
			finish(true);
		};
		child.on("error", onChildError);
		child.once("exit", onExit);
		child.once("close", onClose);
		child.stdout?.on("error", fail);
		child.stderr?.on("error", fail);
		child.stdout?.on("data", collectOutput);
		child.stderr?.on("data", collectErrors);
		if (!child.stdout || !child.stderr || input !== void 0 && !child.stdin) missingPipes = setImmediate(() => {
			if (!failed && !settled) fail(/* @__PURE__ */ new Error("Windows security command output pipes are unavailable"));
		});
		if (input !== void 0 && child.stdin) {
			child.stdin.on("error", fail);
			try {
				child.stdin.end(input, "utf8");
			} catch (error) {
				fail(error);
			}
		}
	});
}
async function createPrivateWindowsDirectoryCommand(targetPath, expectedParentIdentity) {
	return fullIdentityReceipt(await execute("create", {
		targetPath,
		expectedParentIdentity
	}));
}
function createPrivateWindowsDirectoryCommandSync(targetPath, expectedParentIdentity) {
	return fullIdentityReceipt(executeSync("create", {
		targetPath,
		expectedParentIdentity
	}));
}
function fullIdentityReceipt(response, expected) {
	if (!record(response) || !isFullIdentity(response.identity)) unverified("Windows security command returned an incomplete file identity");
	if (expected !== void 0 && response.identity !== expected) throw new FsSafeError("path-mismatch", "Windows security command observed a different file");
	return { identity: response.identity };
}
function inspectWindowsDirectoryCommandSync(targetPath, requirePrivate) {
	return fullIdentityReceipt(executeSync("directory", {
		targetPath,
		requirePrivate
	}));
}
async function inspectWindowsDirectoryCommand(targetPath, requirePrivate) {
	return fullIdentityReceipt(await execute("directory", {
		targetPath,
		requirePrivate
	}));
}
async function protectPrivateWindowsFileCommand(fd, targetPath, expectedParentIdentity) {
	assertIdentity(expectedParentIdentity);
	return fullIdentityReceipt(await execute("protect-file", {
		fd,
		targetPath,
		expectedParentIdentity
	}));
}
async function verifyPrivateWindowsFileCommand(fd, targetPath, expectedFileIdentity, expectedParentIdentity, expectedLinks = 1) {
	assertIdentity(expectedFileIdentity);
	assertIdentity(expectedParentIdentity);
	fullIdentityReceipt(await execute("verify-file", {
		fd,
		targetPath,
		expectedFileIdentity,
		expectedParentIdentity,
		expectedLinks
	}), expectedFileIdentity);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/creation-boundary.js
function resolveCreationPermissions(options, directory) {
	const privatePath = options.private;
	const mode = options.mode;
	if (privatePath !== void 0 && typeof privatePath !== "boolean") throw new TypeError("private must be a boolean");
	if (mode !== void 0 && (!Number.isInteger(mode) || mode < 0 || mode > 4095)) throw new RangeError("mode must contain only permission bits");
	if (privatePath && mode !== void 0 && (mode & 3647) !== 0) throw new FsSafeError("insecure-permissions", "private creation requires owner-only permission bits");
	if (privatePath) assertDarwinPrivateCreationAvailable();
	if (privatePath && directory) assertDarwinPrivateDirectoryMode(mode ?? 448);
	return {
		private: privatePath === true,
		mode: mode ?? (privatePath ? directory ? 448 : 384 : void 0)
	};
}
function assertPrivatePosixDirectory(stat) {
	if (typeof process.getuid !== "function" || stat.uid !== BigInt(process.getuid())) throw new FsSafeError("not-owned", "private directory must belong to the current user");
	if ((stat.mode & 3647n) !== 0n) throw new FsSafeError("insecure-permissions", "existing directory is not private");
}
function unavailable$5() {
	throw new FsSafeError("helper-unavailable", "private Windows creation requires an up-to-date native helper");
}
function assertPrivateFileCreationAvailable() {
	const native = getNativeBinding();
	if (process.platform !== "win32" || getFsSafeNativeConfig().mode !== "require") return;
	if (typeof native?.createPrivateDirectoryWithParentIdentity !== "function" || typeof native.inspectWindowsDirectory !== "function" || typeof native.protectPrivateWindowsFile !== "function" || typeof native.verifyPrivateWindowsFile !== "function") unavailable$5();
}
function commandFallback(capability) {
	if (getFsSafeNativeConfig().mode === "require") unavailable$5();
	warnNativeFallback("windows-private-creation", "Private Windows creation launches the packaged .NET helper for each check or creation.", capability);
}
function creationOperation(name) {
	const native = getNativeBinding();
	const operation = native?.[name];
	if (typeof operation === "function") return operation.bind(native);
	commandFallback(name);
}
/** Full Windows identity, with security validation when requested; no repairs. */
function inspectCreationDirectorySync(targetPath, privatePath) {
	assertNoWindowsPathAlias(targetPath, "filesystem");
	const inspect = creationOperation("inspectWindowsDirectory");
	return (inspect ? inspect(targetPath, privatePath) : inspectWindowsDirectoryCommandSync(targetPath, privatePath)).identity;
}
async function inspectCreationDirectory(targetPath, privatePath) {
	assertNoWindowsPathAlias(targetPath, "filesystem");
	const inspect = creationOperation("inspectWindowsDirectory");
	return (inspect ? inspect(targetPath, privatePath) : await inspectWindowsDirectoryCommand(targetPath, privatePath)).identity;
}
function assertPrivateDirectorySync(targetPath) {
	const stat = inspectDirectoryIdentitySync(targetPath);
	if (process.platform === "win32") inspectCreationDirectorySync(targetPath, true);
	else {
		assertPrivatePosixDirectory(stat);
		assertDarwinCreationDirectoryAcl(targetPath, stat);
	}
	inspectDirectoryIdentitySync(targetPath, stat);
}
async function assertPrivateDirectory(targetPath) {
	const stat = inspectDirectoryIdentitySync(targetPath);
	if (process.platform === "win32") await inspectCreationDirectory(targetPath, true);
	else {
		assertPrivatePosixDirectory(stat);
		assertDarwinCreationDirectoryAcl(targetPath, stat);
	}
	inspectDirectoryIdentitySync(targetPath, stat);
}
async function protectCreatedFile(fd, targetPath, parentIdentity) {
	const protect = creationOperation("protectPrivateWindowsFile");
	return (protect ? protect(fd, targetPath, parentIdentity) : await protectPrivateWindowsFileCommand(fd, targetPath, parentIdentity)).identity;
}
async function verifyCreatedFile(fd, targetPath, identity, parentIdentity, links = 1) {
	const verify = creationOperation("verifyPrivateWindowsFile");
	if (verify) verify(fd, targetPath, identity, parentIdentity, links);
	else await verifyPrivateWindowsFileCommand(fd, targetPath, identity, parentIdentity, links);
}
function inspector() {
	const native = getNativeBinding();
	if (typeof native?.inspectDarwinAcl !== "function") throw new FsSafeError("helper-unavailable", "private Darwin creation requires native descriptor ACL inspection");
	return native.inspectDarwinAcl.bind(native);
}
function assertDarwinPrivateCreationAvailable() {
	if (process.platform === "darwin") inspector();
}
function assertDarwinPrivateDirectoryMode(mode) {
	if (process.platform === "darwin" && (mode & ~process.umask() & 320) === 0) throw new FsSafeError("helper-unavailable", "private Darwin directory ACL inspection requires owner read or search permission");
}
function assertDarwinCreationAcl(fd, inheritanceTarget) {
	if (process.platform !== "darwin") return;
	const state = inspector()(fd, inheritanceTarget)?.state;
	if (state === "present") throw new FsSafeError("insecure-permissions", inheritanceTarget ? "private creation parent has inheritable Darwin ACL entries" : "private creation object has Darwin ACL entries");
	if (state !== "absent" && state !== "empty") throw new FsSafeError("helper-unavailable", "native Darwin ACL inspection returned incomplete facts");
}
function assertDarwinCreationDirectoryAcl(pathname, expected, inheritanceTarget) {
	if (process.platform !== "darwin") return;
	assertDarwinPrivateCreationAvailable();
	let fd;
	try {
		fd = fs.openSync(pathname, nodeDarwinDirectoryMetadataFlags());
	} catch (error) {
		if (error.code !== "EACCES") throw error;
		const search = nodeDirectorySearchOnlyFlags();
		if (!search) throw error;
		try {
			fd = fs.openSync(pathname, search.flags | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		} catch (cause) {
			if (cause.code !== "EACCES") throw cause;
			throw new FsSafeError("helper-unavailable", "private Darwin directory ACL inspection requires owner read or search permission", { cause });
		}
	}
	try {
		if (!inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), expected).isDirectory()) throw new FsSafeError("path-mismatch", "ACL target is not the admitted directory");
		assertDarwinCreationAcl(fd, inheritanceTarget);
		inspectDirectoryIdentitySync(pathname, expected);
	} finally {
		fs.closeSync(fd);
	}
}
function assertCreationFile(fd, pathname, expected) {
	const opened = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), expected);
	const named = inspectFileIdentitySync(() => fs.lstatSync(pathname, { bigint: true }), opened);
	if (!opened.isFile() || !named.isFile() || named.isSymbolicLink() || opened.nlink !== 1n || named.nlink !== 1n) throw new FsSafeError("path-mismatch", "created file is not the expected single-linked regular file");
	return opened;
}
function assertPrivateCreationFile(stat, fd) {
	if (process.platform === "win32") return;
	if (typeof process.getuid !== "function" || stat.uid !== BigInt(process.getuid())) throw new FsSafeError("not-owned", "created private file must belong to the current user");
	if ((stat.mode & 3647n) !== 0n) throw new FsSafeError("insecure-permissions", "created private file is not owner-only");
	assertDarwinCreationAcl(fd);
}
function assertRecordedFile(current, identity) {
	if (!current.isFile() || current.isSymbolicLink() || !sameFileIdentityForCleanup(current, identity)) throw new FsSafeError("path-mismatch", "created file cleanup preserved a replacement");
}
async function removeRecordedCreationFile(pathname, identity, assertParent) {
	assertParent();
	let current;
	try {
		current = await fs$1.lstat(pathname, { bigint: true });
	} catch (error) {
		if (error?.code === "ENOENT") return;
		throw error;
	}
	assertParent();
	assertRecordedFile(current, identity);
	assertRecordedFile(fs.lstatSync(pathname, { bigint: true }), identity);
	await fs$1.unlink(pathname);
}
function creationPublicationAfterFailure(error, recorded) {
	if (error instanceof FsSafeError) {
		const publication = error.details?.publication;
		if (publication && typeof publication === "object" && "status" in publication && publication.status === "indeterminate") return "indeterminate";
	}
	return recorded;
}
function hasPreservedCreationArtifacts(error) {
	if (!(error instanceof FsSafeError)) return false;
	if (error.details?.cleanup === "preserved" || error.details?.cleanup === "failed") return true;
	const publication = error.details?.publication;
	return publication !== null && typeof publication === "object" && "status" in publication && (publication.status === "published" || publication.status === "indeterminate");
}
function rethrowPrivateStageCreationFailure(error, path, stageDirectory) {
	if (error instanceof FsSafeError && error.code === "already-exists") throw new FsSafeError("helper-failed", "private file staging path already exists", {
		cause: error,
		details: {
			publication: { status: "not-published" },
			path,
			stageDirectory
		}
	});
	const publication = error instanceof FsSafeError ? error.details?.publication : void 0;
	const created = error instanceof FsSafeError && error.details?.path === stageDirectory && publication !== null && typeof publication === "object" && "status" in publication && publication.status === "published";
	let unconfirmed = hasUnsettledWindowsSecurityCommand(error);
	if (error !== null && (typeof error === "object" || typeof error === "function")) try {
		const outcome = Object.getOwnPropertyDescriptor(error, "creationOutcome");
		unconfirmed ||= Boolean(outcome && "value" in outcome && outcome.value === "unconfirmed");
	} catch {
		unconfirmed = true;
	}
	if (created || unconfirmed) throw privateFileSettlementFailure({
		primary: error,
		cleanup: [],
		publication: "not-published",
		path,
		stageDirectory,
		preserved: true
	});
	throw error;
}
function privateFileSettlementFailure(params) {
	return new FsSafeError("helper-failed", "file creation or staging settlement failed", {
		cause: params.cleanup.length ? new AggregateError([params.primary, ...params.cleanup], "file creation and cleanup failed") : params.primary,
		details: {
			publication: { status: params.publication },
			path: params.path,
			stageDirectory: params.stageDirectory,
			cleanup: params.preserved || params.publication === "indeterminate" ? "preserved" : params.cleanup.length ? "failed" : "removed"
		}
	});
}
function assertBeforeCreation(selected, permissions, assertion, kind) {
	if (permissions.private) assertDarwinCreationDirectoryAcl(selected.parent.dir, selected.parent.stat, kind);
	assertSynchronousCallbackResult(assertion?.(), "assertBeforeMutation");
	if (assertion !== void 0 || permissions.private) selected.assertParent();
	if (permissions.private && kind === "directory") assertDarwinPrivateDirectoryMode(permissions.mode);
	if (permissions.private) assertDarwinCreationDirectoryAcl(selected.parent.dir, selected.parent.stat, kind);
}
function creationAdmissionFromParent(parent) {
	const { dev, ino } = parent.stat;
	if (typeof dev !== "bigint" || typeof ino !== "bigint") throw new FsSafeError("path-mismatch", "private creation requires an exact parent identity");
	const identity = inspectDirectoryIdentitySync(parent.dir, {
		dev,
		ino
	});
	return { expectedParentIdentity: {
		dev: identity.dev,
		ino: identity.ino,
		realPath: parent.realPath
	} };
}
function prepareCreationPath(input, expectedParent) {
	expectedParent = expectedParent && {
		dev: expectedParent.dev,
		ino: expectedParent.ino,
		realPath: expectedParent.realPath
	};
	assertNoNulPathInput(input);
	assertNoWindowsPathAlias(input, "filesystem");
	if (process.platform === "win32" && input.replaceAll("/", "\\").split("\\").some((component) => component.endsWith(".") || component.endsWith(" "))) throw new FsSafeError("invalid-path", "creation path contains an ambiguous Windows component");
	const target = resolvePathPreservingWindowsRoot(input);
	const directory = path.dirname(target);
	if (target === directory || input.length === 0) throw new FsSafeError("invalid-path", "creation requires a child name");
	if (expectedParent) assertDirectoryIdentitySync(directory, expectedParent);
	const stat = inspectDirectoryIdentitySync(directory);
	const realPath = realpathSync$1.native(directory);
	const parent = {
		dir: directory,
		realPath,
		stat
	};
	const assertParent = () => {
		assertDirectoryIdentitySync(directory, {
			dev: stat.dev,
			ino: stat.ino,
			realPath
		});
		if (expectedParent) assertDirectoryIdentitySync(directory, expectedParent);
	};
	assertParent();
	return {
		target,
		parent,
		assertParent
	};
}
function creationCollision(error) {
	if (error?.code === "EEXIST") return new FsSafeError("already-exists", "creation target already exists", { cause: error });
	return error;
}
async function removeCreationDirectoryAsync(directory, identity, assertParent) {
	assertParent();
	try {
		assertDirectoryIdentitySync(directory, identity);
		await fs$1.rmdir(directory);
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/hardlink-fallback.js
const HARDLINK_FALLBACK_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"EPERM",
	"EXDEV",
	"ENOTSUP",
	"EOPNOTSUPP",
	"ENOSYS"
]);
function isHardlinkFallbackError(error) {
	return HARDLINK_FALLBACK_CODES.has(error?.code ?? "");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/temp-cleanup.js
const tempCleanupEntries = /* @__PURE__ */ new Map();
let cleanupRegistered = false;
function pathStillMatchesReceipt(entry) {
	if (!entry.identity) return false;
	try {
		const current = fs.lstatSync(entry.path, { bigint: true });
		return (!entry.singleLinkFile || current.isFile() && current.nlink === 1n) && sameFileIdentityForCleanup(current, entry.identity);
	} catch {
		return false;
	}
}
function removeRegisteredPathSync(entry) {
	if (entry.singleLinkFile) fs.unlinkSync(entry.path);
	else fs.rmSync(entry.path, {
		force: true,
		recursive: entry.recursive
	});
}
function cleanupEntrySync(entry) {
	if (entry.cleanupSync) entry.cleanupSync();
	else if (pathStillMatchesReceipt(entry)) removeRegisteredPathSync(entry);
}
function cleanupRegisteredTempPathsSync() {
	for (const entry of tempCleanupEntries.values()) try {
		cleanupEntrySync(entry);
	} catch {}
	tempCleanupEntries.clear();
}
function registerTempPathForExit(tempPath, options) {
	if (!cleanupRegistered) {
		cleanupRegistered = true;
		process.once("exit", cleanupRegisteredTempPathsSync);
	}
	const entry = {
		path: tempPath,
		recursive: options?.recursive === true,
		identity: options?.identity,
		singleLinkFile: options?.singleLinkFile,
		cleanupSync: options?.cleanupSync
	};
	tempCleanupEntries.set(tempPath, entry);
	const unregister = (() => {
		if (tempCleanupEntries.get(tempPath) === entry) tempCleanupEntries.delete(tempPath);
	});
	unregister.setIdentity = (identity) => {
		entry.identity = identity;
	};
	return unregister;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/private-producer-handoff.js
function pathMismatch(message) {
	return new FsSafeError("path-mismatch", message);
}
function assertInitialSource(stat) {
	if (stat.isSymbolicLink()) throw new FsSafeError("path-alias", "isolated producer output must not be a symlink");
	if (!stat.isFile()) throw new FsSafeError("not-file", "isolated producer output must be a regular file");
	if (stat.nlink !== 1n) throw new FsSafeError("hardlink", "isolated producer output must have exactly one link");
}
function inspectLinkedFile(inspect, expected, links, label) {
	return inspectFileIdentitySync(() => {
		const stat = inspect();
		if (stat.isSymbolicLink() || !stat.isFile() || stat.nlink !== links) throw pathMismatch(`${label} changed during isolated producer handoff`);
		return stat;
	}, expected);
}
function assertParents(params) {
	params.assertTargetParent();
	params.assertSourceParent();
}
function normalizeLinkError(error) {
	if (error?.code === "EEXIST") return new FsSafeError("already-exists", "isolated producer sibling already exists", errorCauseOptions(error));
	if (isHardlinkFallbackError(error)) return new FsSafeError("helper-unavailable", "atomic isolated producer handoff is unavailable", errorCauseOptions(error));
	return error;
}
function removeSiblingIfOwned(params) {
	if (!params.state.siblingOwned) return;
	params.assertTargetParent();
	let current;
	try {
		current = fs.lstatSync(params.targetPath, { bigint: true });
	} catch (error) {
		if (error?.code === "ENOENT") {
			params.state.siblingOwned = false;
			return;
		}
		throw error;
	}
	if (current.isSymbolicLink() || !current.isFile() || current.nlink !== 1n && current.nlink !== 2n || !sameFileIdentityForCleanup(current, params.identity)) throw pathMismatch("isolated producer sibling changed before cleanup");
	fs.unlinkSync(params.targetPath);
	params.state.siblingOwned = false;
	params.assertTargetParent();
}
function combinedFailure(primary, settlement) {
	if (settlement.length === 0) return primary;
	return new AggregateError([primary, ...settlement], "isolated producer handoff and settlement failed");
}
function hasCode(error, codes) {
	return !(error instanceof FsSafeError) && codes.includes(error?.code ?? "");
}
async function throwAfterClosing(primary, handles) {
	const settlement = [];
	const closed = /* @__PURE__ */ new Set();
	for (const handle of handles) {
		if (!handle || closed.has(handle)) continue;
		closed.add(handle);
		try {
			await handle.close();
		} catch (error) {
			settlement.push(error);
		}
	}
	throw combinedFailure(primary, settlement);
}
function inspectSourceDescriptor(handle, identity, links = 1n) {
	return inspectLinkedFile(() => fs.fstatSync(handle.fd, { bigint: true }), identity, links, "isolated producer descriptor");
}
function historicalOpenFlags(readWrite) {
	return (readWrite ? fs.constants.O_RDWR : fs.constants.O_RDONLY) | resolveReadOpenFlags();
}
async function openHistoricalSource(sourcePath, identity, readWrite, links) {
	let handle;
	try {
		handle = await fs$1.open(sourcePath, historicalOpenFlags(readWrite));
		inspectSourceDescriptor(handle, identity, links);
		return handle;
	} catch (error) {
		if (handle) return await throwAfterClosing(error, [handle]);
		throw error;
	}
}
async function openProducerSource(params, identity, links = 1n) {
	if (process.platform !== "win32") return await openHistoricalSource(params.sourcePath, identity, params.readWrite, links);
	let provisional;
	try {
		provisional = await fs$1.open(params.sourcePath, fs.constants.O_WRONLY);
	} catch (error) {
		if (!hasCode(error, [
			"EACCES",
			"EPERM",
			"EBUSY"
		])) throw error;
		return await openHistoricalSource(params.sourcePath, identity, params.readWrite, links);
	}
	try {
		inspectSourceDescriptor(provisional, identity, links);
		return provisional;
	} catch (error) {
		if (!hasCode(error, ["EACCES", "EPERM"])) return await throwAfterClosing(error, [provisional]);
	}
	let fallback;
	try {
		fallback = await fs$1.open(params.sourcePath, historicalOpenFlags(params.readWrite));
		inspectSourceDescriptor(fallback, identity, links);
		inspectLinkedFile(() => fs.lstatSync(params.sourcePath, { bigint: true }), identity, links, "isolated producer path");
		assertParents(params);
	} catch (error) {
		return await throwAfterClosing(error, [fallback, provisional]);
	}
	try {
		await provisional.close();
	} catch (error) {
		return await throwAfterClosing(error, [fallback]);
	}
	return fallback;
}
var FileHandoff = class {
	paths;
	identity;
	createdLabels;
	siblingOwned = false;
	publication = "not-published";
	cleanup = "preserved";
	closeFailed = false;
	constructor(paths, identity, createdLabels = false) {
		this.paths = paths;
		this.identity = identity;
		this.createdLabels = createdLabels;
	}
	inspect(owner, links) {
		assertParents(this.paths);
		const opened = inspectLinkedFile(() => fs.fstatSync(owner.fd, { bigint: true }), this.identity, links, this.createdLabels ? "created file descriptor" : "isolated producer descriptor");
		if (this.cleanup !== "removed") inspectLinkedFile(() => fs.lstatSync(this.paths.sourcePath, { bigint: true }), this.identity, links, this.createdLabels ? "created file stage" : "isolated producer path");
		return {
			opened,
			named: this.publication === "published" ? inspectLinkedFile(() => fs.lstatSync(this.paths.targetPath, { bigint: true }), this.identity, links, this.createdLabels ? "created file destination" : "isolated producer sibling") : void 0
		};
	}
	publish() {
		this.publication = "indeterminate";
		try {
			fs.linkSync(this.paths.sourcePath, this.paths.targetPath);
		} catch (error) {
			const normalized = normalizeLinkError(error);
			if (normalized instanceof FsSafeError && (normalized.code === "already-exists" || normalized.code === "helper-unavailable")) this.publication = "not-published";
			throw normalized;
		}
		this.publication = "published";
	}
	retireSource() {
		this.cleanup = "failed";
		fs.unlinkSync(this.paths.sourcePath);
		this.cleanup = "removed";
	}
	failure(failures, aggregateMessage) {
		const primary = failures[0];
		return new FsSafeError(this.closeFailed || failures.length > 1 ? "helper-failed" : primary instanceof FsSafeError ? primary.code : "helper-failed", "created file publication failed", {
			cause: failures.length === 1 ? primary : new AggregateError(failures, aggregateMessage),
			details: {
				publication: { status: this.publication },
				cleanup: this.cleanup,
				resources: this.closeFailed ? "close-failed" : "closed",
				path: this.paths.targetPath,
				dev: this.identity.dev,
				ino: this.identity.ino
			}
		});
	}
};
async function handoffFile(params) {
	const created = "source" in params ? params : void 0;
	const identity = created?.identity ?? inspectFileIdentitySync(() => {
		assertParents(params);
		const stat = fs.lstatSync(params.sourcePath, { bigint: true });
		assertInitialSource(stat);
		return stat;
	});
	let handle = created?.source;
	const owners = new Set(handle ? [handle] : []);
	const failures = [];
	let unregister;
	const state = new FileHandoff(params, identity);
	async function close(owned) {
		if (created) owners.delete(owned);
		try {
			await owned.close();
			owners.delete(owned);
		} catch (error) {
			state.closeFailed = true;
			throw error;
		}
	}
	try {
		assertInitialSource(identity);
		if (!handle) {
			handle = await openProducerSource({
				...params,
				readWrite: "readWrite" in params && params.readWrite
			}, identity);
			owners.add(handle);
		}
		state.inspect(handle, 1n);
		if (created?.verifyDescriptor) await created.verifyDescriptor(handle.fd, params.sourcePath, 1);
		if (!created) unregister = registerTempPathForExit(params.targetPath, { cleanupSync: () => removeSiblingIfOwned({
			assertTargetParent: params.assertTargetParent,
			identity,
			state,
			targetPath: params.targetPath
		}) });
		assertSynchronousCallbackResult(created?.assertBeforeMutation?.(), "assertBeforeMutation");
		state.inspect(handle, 1n);
		state.publish();
		state.siblingOwned = !created;
		try {
			assertSynchronousCallbackResult(created?.onPublished?.(), "onPublished");
		} catch (error) {
			failures.push(error);
		}
		state.inspect(handle, 2n);
		if (process.platform === "win32") {
			const sibling = created ? await fs$1.open(params.targetPath, historicalOpenFlags(true)) : await openProducerSource({
				...params,
				sourcePath: params.targetPath,
				readWrite: "readWrite" in params && params.readWrite
			}, identity, 2n);
			owners.add(sibling);
			state.inspect(sibling, 2n);
			if (created?.verifyDescriptor) await created.verifyDescriptor(sibling.fd, params.targetPath, 2);
			state.inspect(sibling, 2n);
			inspectSourceDescriptor(handle, identity, 2n);
			await close(handle);
			handle = sibling;
			state.inspect(handle, 2n);
		}
		if (created?.verifyDescriptor) await created.verifyDescriptor(handle.fd, process.platform === "win32" ? params.targetPath : params.sourcePath, 2);
		assertSynchronousCallbackResult(created?.assertBeforeMutation?.(), "assertBeforeMutation");
		state.inspect(handle, 2n);
		state.retireSource();
		if (created?.verifyDescriptor) await created.verifyDescriptor(handle.fd, params.targetPath, 1);
		const { opened, named } = state.inspect(handle, 1n);
		const originalMode = identity.mode & 511n;
		if (!created && process.platform === "win32" && (originalMode & 128n) === 0n && ((opened.mode & 511n) !== originalMode || (named.mode & 511n) !== originalMode)) {
			assertParents(params);
			fs.fchmodSync(handle.fd, Number(originalMode));
			const restored = state.inspect(handle, 1n);
			if ((restored.opened.mode & 511n) !== originalMode || (restored.named.mode & 511n) !== originalMode) throw pathMismatch("isolated producer read-only mode could not be restored");
		}
		if (!created) {
			const registered = unregister;
			const release = (() => {
				state.siblingOwned = false;
				registered();
			});
			release.setIdentity = registered.setIdentity;
			return {
				handle,
				identity,
				unregister: release
			};
		}
	} catch (error) {
		failures.push(error);
	}
	if (failures.length === 0) return handle;
	if (unregister) try {
		removeSiblingIfOwned({
			assertTargetParent: params.assertTargetParent,
			identity,
			state,
			targetPath: params.targetPath
		});
		unregister();
	} catch (error) {
		failures.push(error);
	}
	for (const owned of [...owners].reverse()) try {
		await close(owned);
	} catch (error) {
		failures.push(error);
	}
	if (!created) throw combinedFailure(failures[0], failures.slice(1));
	throw state.failure(failures, "isolated producer handoff and settlement failed");
}
function handoffCreatedFile(params) {
	return handoffFile(params);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/create.js
/** Internal async writer; Windows preparation uses the nonblocking stage owner. */
async function createFileHandle(targetPath, options = {}, admission = {}) {
	const permissions = resolveCreationPermissions(options, false);
	const assertion = options.assertBeforeMutation;
	if (process.platform !== "win32" || !permissions.private) {
		const selected = prepareCreationPath(targetPath, admission.expectedParentIdentity);
		assertBeforeCreation(selected, permissions, assertion, "file");
		try {
			assertExclusiveCreateLeaf(selected.target);
		} catch (error) {
			throw creationCollision(error);
		}
		const handle = await fs$1.open(selected.target, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | resolveReadOpenFlags(), permissions.mode ?? 438).catch((error) => {
			throw creationCollision(error);
		});
		try {
			const identity = assertCreationFile(handle.fd, selected.target);
			selected.assertParent();
			if (permissions.private) assertPrivateCreationFile(identity, handle.fd);
			return handle;
		} catch (primary) {
			let failure = primary;
			try {
				await handle.close();
			} catch (closeError) {
				failure = new AggregateError([primary, closeError], "created file admission and close failed");
			}
			throw new FsSafeError("helper-failed", "created file handle admission failed", {
				cause: failure,
				details: {
					publication: { status: "published" },
					path: selected.target,
					cleanup: "preserved"
				}
			});
		}
	}
	assertPrivateFileCreationAvailable();
	return await createPrivateWindowsFileHandle(prepareCreationPath(targetPath, admission.expectedParentIdentity), {
		mode: permissions.mode,
		assertBeforeMutation: assertion
	});
}
function directoryAdoptionFailure(error, target, windowsIdentity) {
	return new FsSafeError("helper-failed", "created directory admission failed", {
		cause: error,
		details: {
			publication: { status: "published" },
			path: target,
			cleanup: "preserved",
			...windowsIdentity === void 0 ? {} : { windowsIdentity }
		}
	});
}
function privateDirectoryBackend() {
	const binding = getNativeBinding();
	if (typeof binding?.createPrivateDirectoryWithParentIdentity === "function") return binding.createPrivateDirectoryWithParentIdentity.bind(binding);
	if (getFsSafeNativeConfig().mode === "require") throw new FsSafeError("helper-unavailable", "private directory creation requires an up-to-date native parent identity capability");
	warnNativeFallback("windows-private-directory", "Private Windows directory creation launches the packaged .NET helper for each check or creation.", "createPrivateDirectoryWithParentIdentity");
}
async function createDirectoryWithAdmission(targetPath, options = {}, admission = {}) {
	await createDirectoryWithReceipt(targetPath, options, admission);
}
async function createDirectoryWithReceipt(targetPath, options = {}, admission = {}) {
	const permissions = resolveCreationPermissions(options, true);
	const assertion = options.assertBeforeMutation;
	const selected = prepareCreationPath(targetPath, admission.expectedParentIdentity);
	const backend = permissions.private && process.platform === "win32" ? privateDirectoryBackend() : void 0;
	const parentIdentity = permissions.private && process.platform === "win32" ? await inspectCreationDirectory(selected.parent.dir, false) : void 0;
	assertBeforeCreation(selected, permissions, assertion, "directory");
	let created = false;
	let windowsIdentity;
	try {
		if (parentIdentity !== void 0) {
			const receipt = backend ? backend(selected.target, parentIdentity) : await createPrivateWindowsDirectoryCommand(selected.target, parentIdentity);
			created = true;
			windowsIdentity = receipt.identity;
			if (await inspectCreationDirectory(selected.target, true) !== receipt.identity) throw new FsSafeError("path-mismatch", "created private directory changed before adoption");
		} else {
			await fs$1.mkdir(selected.target, { mode: permissions.mode });
			created = true;
			if (permissions.private) await assertPrivateDirectory(selected.target);
		}
		selected.assertParent();
		return {
			stat: inspectDirectoryIdentitySync(selected.target),
			windowsIdentity
		};
	} catch (error) {
		if (created) throw directoryAdoptionFailure(error, selected.target, windowsIdentity);
		throw creationCollision(error);
	}
}
function createDirectorySync(targetPath, options = {}) {
	createDirectoryWithReceiptSync(targetPath, options, {});
}
function createDirectoryWithReceiptSync(targetPath, options = {}, admission = {}) {
	const permissions = resolveCreationPermissions(options, true);
	const assertion = options.assertBeforeMutation;
	const selected = prepareCreationPath(targetPath, admission.expectedParentIdentity);
	const backend = permissions.private && process.platform === "win32" ? privateDirectoryBackend() : void 0;
	const parentIdentity = permissions.private && process.platform === "win32" ? inspectCreationDirectorySync(selected.parent.dir, false) : void 0;
	assertBeforeCreation(selected, permissions, assertion, "directory");
	let created = false;
	let windowsIdentity;
	try {
		if (parentIdentity !== void 0) {
			const receipt = backend ? backend(selected.target, parentIdentity) : createPrivateWindowsDirectoryCommandSync(selected.target, parentIdentity);
			created = true;
			windowsIdentity = receipt.identity;
			if (inspectCreationDirectorySync(selected.target, true) !== receipt.identity) throw new FsSafeError("path-mismatch", "created private directory changed before adoption");
		} else {
			fs.mkdirSync(selected.target, { mode: permissions.mode });
			created = true;
			if (permissions.private) assertPrivateDirectorySync(selected.target);
		}
		selected.assertParent();
		return {
			stat: inspectDirectoryIdentitySync(selected.target),
			windowsIdentity
		};
	} catch (error) {
		if (created) throw directoryAdoptionFailure(error, selected.target, windowsIdentity);
		throw creationCollision(error);
	}
}
async function createPrivateWindowsFileHandle(selected, options) {
	const assertion = options.assertBeforeMutation;
	const existing = await fs$1.lstat(selected.target).catch((error) => {
		if (error.code !== "ENOENT") throw error;
	});
	selected.assertParent();
	if (existing) throw new FsSafeError("already-exists", "creation target already exists");
	const parentIdentity = await inspectCreationDirectory(selected.parent.dir, false);
	selected.assertParent();
	const stageDirectory = path.join(selected.parent.dir, `.fs-safe-create-${randomUUID()}`);
	let stage;
	try {
		stage = await createDirectoryWithReceipt(stageDirectory, {
			private: true,
			assertBeforeMutation: assertion
		}, { expectedParentIdentity: selected.parent.stat });
	} catch (error) {
		rethrowPrivateStageCreationFailure(error, selected.target, stageDirectory);
	}
	const stageIdentity = stage.windowsIdentity;
	const stagePath = path.join(stageDirectory, "file");
	const assertStage = () => {
		selected.assertParent();
		assertDirectoryIdentitySync(stageDirectory, stage.stat);
	};
	let file;
	let identity;
	let publication = "not-published";
	try {
		if (await inspectCreationDirectory(stageDirectory, true) !== stageIdentity) throw new FsSafeError("path-mismatch", "private staging directory changed before file creation");
		assertSynchronousCallbackResult(assertion?.(), "assertBeforeMutation");
		assertStage();
		assertExclusiveCreateLeaf(stagePath);
		file = await fs$1.open(stagePath, fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | resolveReadOpenFlags(), 384);
		assertStage();
		identity = assertCreationFile(file.fd, stagePath);
		assertSynchronousCallbackResult(assertion?.(), "assertBeforeMutation");
		assertStage();
		assertCreationFile(file.fd, stagePath, identity);
		const windowsIdentity = await protectCreatedFile(file.fd, stagePath, stageIdentity);
		assertStage();
		assertCreationFile(file.fd, stagePath, identity);
		const source = file;
		file = void 0;
		file = await handoffCreatedFile({
			source,
			sourcePath: stagePath,
			targetPath: selected.target,
			identity,
			assertSourceParent: assertStage,
			assertTargetParent: selected.assertParent,
			assertBeforeMutation: assertion,
			verifyDescriptor: (fd, pathname, links) => verifyCreatedFile(fd, pathname, windowsIdentity, pathname === stagePath ? stageIdentity : parentIdentity, links),
			onPublished: () => {
				publication = "published";
			}
		});
		assertSynchronousCallbackResult(assertion?.(), "assertBeforeMutation");
		selected.assertParent();
		assertCreationFile(file.fd, selected.target, identity);
		await verifyCreatedFile(file.fd, selected.target, windowsIdentity, parentIdentity);
		selected.assertParent();
		assertCreationFile(file.fd, selected.target, identity);
		await file.chmod(options.mode);
		await verifyCreatedFile(file.fd, selected.target, windowsIdentity, parentIdentity);
		selected.assertParent();
		assertCreationFile(file.fd, selected.target, identity);
		await removeCreationDirectoryAsync(stageDirectory, stage.stat, selected.assertParent);
		selected.assertParent();
		assertCreationFile(file.fd, selected.target, identity);
		return file;
	} catch (primary) {
		publication = creationPublicationAfterFailure(primary, publication);
		const preserved = publication === "indeterminate" || hasUnsettledWindowsSecurityCommand(primary);
		const cleanup = [];
		if (file) {
			const owned = file;
			file = void 0;
			try {
				await owned.close();
			} catch (error) {
				cleanup.push(error);
			}
		}
		if (!preserved) {
			if (identity) try {
				await removeRecordedCreationFile(stagePath, identity, assertStage);
			} catch (error) {
				cleanup.push(error);
			}
			try {
				await removeCreationDirectoryAsync(stageDirectory, stage.stat, selected.assertParent);
			} catch (error) {
				cleanup.push(error);
			}
		}
		if (publication === "not-published" && cleanup.length === 0 && !preserved) throw creationCollision(primary);
		throw privateFileSettlementFailure({
			primary,
			cleanup,
			publication,
			path: selected.target,
			stageDirectory,
			preserved
		});
	}
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
/** Copies caller-owned regular-file descriptors without moving either cursor. */
function copyFileDescriptorSync(sourceFd, targetFd, options = {}) {
	const signal = options.signal;
	signal?.throwIfAborted();
	const maxBytes = normalizeMaxBytes(options.maxBytes);
	const onChunk = options.onChunk;
	const assertBeforeMutation = options.assertBeforeMutation;
	const sourceStat = inspectFileIdentitySync(() => {
		signal?.throwIfAborted();
		return fs.fstatSync(sourceFd, { bigint: true });
	});
	if (!sourceStat.isFile()) throw new FsSafeError("not-file", "copy source descriptor must be a regular file");
	if (maxBytes !== void 0 && Number.isFinite(maxBytes) && sourceStat.size > BigInt(maxBytes)) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes`);
	const targetStat = inspectFileIdentitySync(() => {
		signal?.throwIfAborted();
		return fs.fstatSync(targetFd, { bigint: true });
	});
	if (!targetStat.isFile()) throw new FsSafeError("not-file", "copy target descriptor must be a regular file");
	if (sourceStat.dev === targetStat.dev && sourceStat.ino === targetStat.ino) throw new FsSafeError("path-alias", "copy source and target descriptors refer to the same file");
	const limit = maxBytes ?? Infinity;
	const buffer = createTransferBuffer(Number(sourceStat.size), limit);
	let position = 0;
	while (true) {
		signal?.throwIfAborted();
		const bytesRead = fs.readSync(sourceFd, buffer, 0, Math.min(buffer.length, limit - position + 1), position);
		if (bytesRead > limit - position) throw new FsSafeError("too-large", `file exceeds limit of ${limit} bytes`);
		if (bytesRead === 0) return position;
		const chunk = buffer.subarray(0, bytesRead);
		assertSynchronousCallbackResult(onChunk?.(chunk), "onChunk");
		let offset = 0;
		while (offset < bytesRead) {
			signal?.throwIfAborted();
			assertSynchronousCallbackResult(assertBeforeMutation?.(), "assertBeforeMutation");
			signal?.throwIfAborted();
			const written = fs.writeSync(targetFd, chunk, offset, bytesRead - offset, position + offset);
			if (written <= 0) throw new FsSafeError("helper-failed", "file write made no progress");
			offset += written;
		}
		position += bytesRead;
	}
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
		if (onChunk) assertSynchronousCallbackResult(Function.prototype.call.call(onChunk, callbackThis, chunk), "onChunk");
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-context.js
const ensureTrailingSep = (value) => value.endsWith(path.sep) ? value : value + path.sep;
function assertValidRootRelativePath(relativePath) {
	assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
	assertNoWindowsPathAlias(relativePath, "filesystem", "relative path uses a Windows filesystem namespace alias");
}
function assertValidRootDestinationPath(relativePath) {
	assertValidRootRelativePath(relativePath);
	if (isDriveRelativePath(relativePath)) throw new FsSafeError("invalid-path", "relative path must not start with a drive letter");
}
let cachedHomePath;
const POSIX_PARENT_COMPONENT = /(?:^|\/)\.\.(?:\/|$)/;
const WINDOWS_PARENT_COMPONENT = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
async function expandRelativePathWithHome(relativePath) {
	const homeOnly = relativePath === "~";
	const homePrefix = relativePath.startsWith("~/") || path.sep === "\\" && relativePath.startsWith("~\\");
	if (!homeOnly && !homePrefix) {
		assertNoWindowsPathAlias(relativePath, "filesystem", "relative path uses a Windows filesystem namespace alias");
		return relativePath;
	}
	const rawHome = process.env.HOME || process.env.USERPROFILE || os.homedir();
	assertNoWindowsPathAlias(rawHome, "filesystem", "home path uses a Windows filesystem namespace alias");
	if (cachedHomePath?.raw !== rawHome) {
		let realHome = rawHome;
		try {
			realHome = realpathSync$1.native(pathForWindowsFilesystem(rawHome));
		} catch {}
		cachedHomePath = {
			raw: rawHome,
			real: realHome
		};
	}
	if (homeOnly) {
		assertNoWindowsPathAlias(cachedHomePath.real, "filesystem", "home path uses a Windows filesystem namespace alias");
		return cachedHomePath.real;
	}
	const expanded = `${ensureTrailingSep(cachedHomePath.real)}${relativePath.slice(2)}`;
	assertNoWindowsPathAlias(expanded, "filesystem", "expanded path uses a Windows filesystem namespace alias");
	return expanded;
}
async function resolveRootContext(rootDir) {
	assertNoNulPathInput(rootDir, "root dir contains a NUL byte");
	assertNoWindowsPathAlias(rootDir, "filesystem", "root dir uses a Windows filesystem namespace alias");
	const lexicalRoot = resolvePathPreservingWindowsRoot(rootDir);
	assertNoWindowsPathAlias(lexicalRoot, "filesystem", "root dir uses a Windows filesystem namespace alias");
	let rootReal;
	let rootStat;
	let rootIdentity;
	try {
		rootReal = realpathSync$1.native(pathForWindowsFilesystem(rootDir));
		assertNoWindowsPathAlias(rootReal, "filesystem", "canonical root path uses a Windows filesystem namespace alias");
		rootStat = await inspectFileIdentity(() => {
			const stat = fs.statSync(rootReal, { bigint: true });
			if (!stat.isDirectory()) throw new FsSafeError("invalid-path", "root dir is not a directory");
			return stat;
		});
		rootIdentity = {
			dev: rootStat.dev,
			ino: rootStat.ino
		};
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "root dir not found");
		throw err;
	}
	return {
		rootDir: lexicalRoot,
		rootGuard: {
			dir: rootReal,
			realPath: rootReal,
			stat: rootStat
		},
		rootIdentity,
		rootReal,
		rootWithSep: ensureTrailingSep(rootReal)
	};
}
function rootRelativeReadPath(root, filePath) {
	if (!path.isAbsolute(filePath)) return filePath;
	const raw = process.platform === "win32" ? filePath.replaceAll("/", path.sep) : filePath;
	const bases = root.rootDir === root.rootReal ? [root.rootReal] : [root.rootDir, root.rootReal];
	for (const base of bases) {
		if (process.platform === "win32") {
			const admitted = admitPathInsideRoot({
				rootPath: base,
				candidatePath: raw,
				rootIdentity: root.rootIdentity,
				resolveCandidateRoot: base === root.rootDir && root.rootDir !== root.rootReal
			});
			if (admitted) return `.${path.sep}${admitted.relativePath}`;
			continue;
		}
		const prefix = ensureTrailingSep(base);
		if (raw.startsWith(prefix)) {
			let start = prefix.length;
			while (raw[start] === path.sep) start += 1;
			return `.${path.sep}${raw.slice(start)}`;
		}
	}
	return raw;
}
function assertRootIdentityCurrentSync(root, observe) {
	try {
		const stat = inspectDirectoryIdentitySync(root.rootReal, {
			dev: root.rootIdentity.dev,
			ino: root.rootIdentity.ino
		});
		observe?.(stat);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
}
async function assertRootIdentityCurrent(root, observe) {
	assertRootIdentityCurrentSync(root, observe);
}
/**
* Observe the current Root with an exact, operation-local receipt.
*
* This is deliberately separate from {@link assertRootIdentityCurrent}: callers
* must not retain the returned guard beyond the operation that requested it.
*/
async function createRootObservationGuard(root) {
	const rootIdentity = root.rootIdentity;
	if (typeof rootIdentity?.dev !== "bigint" || typeof rootIdentity.ino !== "bigint") throw rootPathChangedError();
	try {
		const observed = await inspectDirectoryObservationSync(root.rootReal, rootIdentity);
		return extendDirectoryObservationGuard(observed, root.rootReal, root.rootReal);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
}
async function resolvePathInRoot(root, relativePath, options) {
	assertValidRootRelativePath(relativePath);
	await assertRootIdentityCurrent(root);
	const expanded = await expandRelativePathWithHome(relativePath);
	assertNoWindowsPathAlias(expanded, "filesystem", "expanded path uses a Windows filesystem namespace alias");
	let resolved = resolvePathFromBasePreservingWindowsRoot(root.rootWithSep, expanded);
	assertNoWindowsPathAlias(resolved, "filesystem", "resolved path uses a Windows filesystem namespace alias");
	if (!options?.resolveCanonical && !isPathInside(root.rootWithSep, resolved)) throw outsideWorkspaceError();
	if (options?.rejectUnsafeDeviceReads === true) assertNoUnsafeDeviceReadPath(resolved);
	const rawAbsolutePath = path.isAbsolute(expanded) ? expanded : `${root.rootWithSep}${expanded}`;
	assertNoWindowsPathAlias(rawAbsolutePath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
	try {
		const resolution = {
			absolutePath: rawAbsolutePath,
			rootPath: root.rootReal,
			rootCanonicalPath: root.rootReal,
			rootIdentity: root.rootIdentity,
			boundaryLabel: "root",
			policy: options?.allowFinalSymlink ? ROOT_PATH_ALIAS_POLICIES.unlinkTarget : void 0,
			rejectSymlinks: options?.rejectSymlinks,
			rejectFinalSymlink: options?.rejectFinalSymlink
		};
		const checked = await resolveRootPath(resolution);
		const parentComponent = process.platform === "win32" ? WINDOWS_PARENT_COMPONENT : POSIX_PARENT_COMPONENT;
		if (options?.rejectAmbiguousParents && parentComponent.test(expanded) && path.relative(checked.canonicalPath, resolved) !== "") {
			const normalized = await resolveRootPath({
				...resolution,
				absolutePath: resolved
			});
			if (path.relative(checked.canonicalPath, normalized.canonicalPath) !== "") throw new FsSafeError("path-alias", "parent traversal resolves differently through a symlink");
		}
		if (options?.resolveCanonical) resolved = checked.canonicalPath;
		else {
			const admitted = admitPathInsideRoot({
				rootPath: root.rootReal,
				candidatePath: checked.absolutePath,
				rootIdentity: root.rootIdentity
			});
			if (!admitted) throw outsideWorkspaceError();
			resolved = admitted.path;
		}
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") throw error;
		if (hasNodeErrorCode(error, "ENAMETOOLONG")) throw new FsSafeError("invalid-path", "relative path is too long", errorCauseOptions(error));
		const code = options?.aliasErrorCode ?? "outside-workspace";
		throw new FsSafeError(code, code === "path-alias" ? "path alias escape blocked" : "file is outside workspace root", errorCauseOptions(error));
	}
	return {
		rootReal: root.rootReal,
		rootWithSep: root.rootWithSep,
		resolved
	};
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-receipt.js
const numericFields = [
	"dev",
	"mode",
	"nlink",
	"uid",
	"gid",
	"rdev",
	"blksize",
	"ino",
	"size",
	"blocks"
];
const timeFields = [
	"atime",
	"mtime",
	"ctime",
	"birthtime"
];
const authorities = /* @__PURE__ */ new WeakMap();
const identities = /* @__PURE__ */ new WeakMap();
function directoryReceiptIdentity(input) {
	if (!input) throw new FsSafeError("path-mismatch", "directory receipt identity is missing");
	const identity = identityFromReceipt(input);
	const known = identities.get(identity);
	const dev = identity.dev;
	const ino = identity.ino;
	if (known) {
		const matches = (value, expected) => typeof value === "bigint" ? value === expected : value === Number(expected);
		if (!matches(dev, known.identity.dev) || !matches(ino, known.identity.ino)) throw new FsSafeError("path-mismatch", "directory receipt identity changed");
		return known.identity;
	}
	const exact = (value) => {
		if (typeof value !== "bigint" && !Number.isSafeInteger(value) || process.platform === "win32" && (value === 0 || value === 0n)) throw new FsSafeError("path-mismatch", "directory receipt identity could not be verified");
		return BigInt(value);
	};
	return Object.freeze({
		dev: exact(dev),
		ino: exact(ino)
	});
}
function snapshotDirectoryReceipt(receipt) {
	const pathname = receipt?.path;
	const realPath = receipt?.realPath;
	const stat = receipt?.identity;
	if (typeof pathname !== "string" || typeof realPath !== "string" || stat == null) throw new FsSafeError("path-mismatch", "directory receipt is incomplete");
	assertNoWindowsPathAlias(pathname, "filesystem");
	assertNoWindowsPathAlias(realPath, "filesystem");
	const identity = directoryReceiptIdentity(receipt.exactIdentity ?? stat);
	const known = authorities.get(receipt);
	const matches = (value, expected) => typeof value === "bigint" ? value === expected : value === Number(expected);
	if (known && (!matches(stat.dev, known.identity.dev) || !matches(stat.ino, known.identity.ino) || pathname !== known.path || realPath !== known.realPath || identity.dev !== known.identity.dev || identity.ino !== known.identity.ino)) throw new FsSafeError("path-mismatch", "directory receipt changed before admission");
	const metadata = known?.metadata ?? identities.get(stat)?.metadata ?? snapshotDirectoryMetadata(stat, identity);
	return Object.freeze({
		path: pathname,
		realPath,
		identity,
		metadata
	});
}
function snapshotDirectoryMetadata(stat, identity) {
	const metadata = {};
	for (const field of numericFields) metadata[field] = Number(field === "dev" || field === "ino" ? identity[field] : stat[field]);
	for (const field of timeFields) if ("atimeNs" in stat) {
		const nanoseconds = stat[`${field}Ns`];
		const remainder = (nanoseconds % 1000000000n + 1000000000n) % 1000000000n;
		metadata[`${field}Ms`] = Number((nanoseconds - remainder) / 1000000000n) * 1e3 + Number(remainder) / 1e6;
	} else metadata[`${field}Ms`] = stat[`${field}Ms`];
	return Object.freeze(metadata);
}
function directoryReceiptAuthority(receipt) {
	return authorities.get(receipt) ?? snapshotDirectoryReceipt(receipt);
}
function ownDirectoryReceipt(receipt) {
	return receiptFromAuthority(snapshotDirectoryReceipt(receipt));
}
function copyRetainedDirectoryReceipt(receipt) {
	return receiptFromAuthority(directoryReceiptAuthority(receipt));
}
function receiptFromAuthority(authority) {
	const receipt = {
		exactIdentity: authority.identity,
		path: authority.path,
		realPath: authority.realPath,
		identity: Object.assign(Object.create(fs.Stats.prototype), authority.metadata)
	};
	authorities.set(receipt, authority);
	identities.set(receipt.identity, authority);
	return receipt;
}
function createDirectoryReceiptFromIdentity(pathname, realPath, exactStat) {
	const identity = Object.freeze({
		dev: exactStat.dev,
		ino: exactStat.ino
	});
	return receiptFromAuthority(Object.freeze({
		path: pathname,
		realPath,
		identity,
		metadata: snapshotDirectoryMetadata(exactStat, identity)
	}));
}
function createDirectoryReceiptSync(directoryPath, label, canonicalize = realpathSync$1) {
	assertNoWindowsPathAlias(directoryPath, "filesystem", `${label} path uses a Windows filesystem namespace alias`);
	const pathname = resolvePathPreservingWindowsRoot(directoryPath);
	assertNoWindowsPathAlias(pathname, "filesystem", `${label} path uses a Windows filesystem namespace alias`);
	const exact = inspectDirectoryIdentitySync(pathname);
	const realPath = canonicalize(pathForWindowsFilesystem(pathname));
	assertNoWindowsPathAlias(realPath, "filesystem", `${label} real path uses a Windows filesystem namespace alias`);
	return createDirectoryReceiptFromIdentity(pathname, realPath, exact);
}
function assertDirectoryReceiptCurrentSync(receipt, label, canonicalize = realpathSync$1) {
	const authority = directoryReceiptAuthority(receipt);
	assertNoWindowsPathAlias(authority.path, "filesystem", `${label} path uses a Windows filesystem namespace alias`);
	assertNoWindowsPathAlias(authority.realPath, "filesystem", `${label} real path uses a Windows filesystem namespace alias`);
	inspectDirectoryIdentitySync(authority.path, authority.identity);
	const realPath = canonicalize(pathForWindowsFilesystem(authority.path));
	assertNoWindowsPathAlias(realPath, "filesystem", `${label} real path uses a Windows filesystem namespace alias`);
	if (realPath !== authority.realPath) throw new FsSafeError("path-mismatch", `${label} changed during durable directory operation: ${authority.path}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-mutation-observation.js
const checkedDirectoryObservation = Symbol("checked mutation directory observation");
const directoryObservers = /* @__PURE__ */ new WeakMap();
function identity$1(stat) {
	return Object.freeze({
		dev: stat.dev,
		ino: stat.ino,
		mode: stat.mode,
		nlink: stat.nlink
	});
}
function sameIdentity(left, right, directory = false) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && (directory || left.nlink === right.nlink);
}
function directoryMode(mode) {
	return (mode & 61440n) === 16384n;
}
function absent(pathname) {
	try {
		return fs.lstatSync(pathname, { throwIfNoEntry: false }) === void 0;
	} catch (error) {
		return isNotFoundPathError(error) && error.code === "ENOENT";
	}
}
function missingMutationSegments(observation) {
	return observation.missingSegments.length - observation.missingOffset;
}
function nextMissingMutationPath(observation) {
	const segment = observation.missingSegments[observation.missingOffset];
	return segment === void 0 ? void 0 : path.join(observation.ancestor, segment);
}
function checkedMutationDirectory(pathname, canonicalPath, stat, observeCurrent) {
	if (!directoryMode(stat.mode)) throw new TypeError("mutation directory evidence must describe a real directory");
	const observation = Object.freeze({
		path: pathname,
		canonicalPath,
		identity: identity$1(stat),
		[checkedDirectoryObservation]: true
	});
	if (observeCurrent) directoryObservers.set(observation, observeCurrent);
	return observation;
}
function checkedDirectory(observation) {
	return observation[checkedDirectoryObservation] === true && path.isAbsolute(observation.path) && path.isAbsolute(observation.canonicalPath) && directoryMode(observation.identity.mode);
}
function mutationObservationUsesDirectory(observation, directory) {
	return checkedDirectory(directory) && observation.ancestor === directory.path && observation.canonicalAncestor === directory.canonicalPath && sameIdentity(observation.entry, directory.identity) && sameIdentity(observation.identity, directory.identity);
}
function observeMutationPath(pathname) {
	try {
		let ancestor = pathname;
		const reversedMissing = [];
		while (absent(ancestor)) {
			const parent = path.dirname(ancestor);
			if (parent === ancestor) return void 0;
			reversedMissing.push(path.basename(ancestor));
			ancestor = parent;
		}
		reversedMissing.reverse();
		const missingSegments = Object.freeze(reversedMissing);
		const entry = inspectFileIdentitySync(() => fs.lstatSync(ancestor, { bigint: true }));
		const canonicalAncestor = realpathSync$1.native(ancestor);
		const stat = canonicalAncestor === ancestor ? entry : inspectFileIdentitySync(() => fs.lstatSync(canonicalAncestor, { bigint: true }));
		if (stat.isSymbolicLink() || missingSegments.length > 0 && !stat.isDirectory()) return void 0;
		const observation = Object.freeze({
			path: pathname,
			ancestor,
			canonicalAncestor,
			canonicalPath: path.join(canonicalAncestor, ...missingSegments),
			entry: identity$1(entry),
			identity: identity$1(stat),
			missingSegments,
			missingOffset: 0
		});
		return mutationObservationCurrent(observation) ? observation : void 0;
	} catch {
		return;
	}
}
function mutationObservationCurrent(observation) {
	try {
		const entry = inspectFileIdentitySync(() => fs.lstatSync(observation.ancestor, { bigint: true }));
		if (!sameIdentity(observation.entry, entry, entry.isDirectory()) || realpathSync$1.native(observation.ancestor) !== observation.canonicalAncestor) return false;
		const stat = observation.canonicalAncestor === observation.ancestor ? entry : inspectFileIdentitySync(() => fs.lstatSync(observation.canonicalAncestor, { bigint: true }));
		return sameIdentity(observation.identity, stat, stat.isDirectory()) && (missingMutationSegments(observation) === 0 || stat.isDirectory() && absent(nextMissingMutationPath(observation)));
	} catch {
		return false;
	}
}
function mutationObservationsCurrent(observations, directories) {
	const groups = /* @__PURE__ */ new Map();
	const groupFor = (pathname) => {
		let group = groups.get(pathname);
		if (!group) {
			group = {
				observations: [],
				directories: []
			};
			groups.set(pathname, group);
		}
		return group;
	};
	try {
		for (const observation of observations) if (observation.ancestor !== observation.canonicalAncestor) {
			if (!mutationObservationCurrent(observation)) return false;
		} else groupFor(observation.ancestor).observations.push(observation);
		for (const directory of directories) {
			if (!checkedDirectory(directory)) return false;
			groupFor(directory.path).directories.push(directory);
		}
		const current = (pathname, group) => {
			const missing = new Set(group.observations.flatMap((observation) => {
				const next = nextMissingMutationPath(observation);
				return next === void 0 ? [] : [next];
			}));
			if (group.directories.length && ![...missing].every(absent)) return false;
			const observed = group.directories.length ? directoryObservers.get(group.directories[0])?.() : void 0;
			const stat = observed?.identity ?? inspectFileIdentitySync(() => fs.lstatSync(pathname, { bigint: true }));
			const canonical = observed?.canonicalPath ?? realpathSync$1.native(pathname);
			const isDirectory = directoryMode(stat.mode);
			if (!group.observations.every((observation) => canonical === observation.canonicalAncestor && sameIdentity(observation.entry, stat, isDirectory) && sameIdentity(observation.identity, stat, isDirectory) && (missingMutationSegments(observation) === 0 || isDirectory))) return false;
			if (!group.directories.every((directory) => isDirectory && sameIdentity(directory.identity, stat) && canonical === directory.canonicalPath)) return false;
			return group.directories.length > 0 || [...missing].every(absent);
		};
		for (const [pathname, group] of groups) if (!group.directories.length && !current(pathname, group)) return false;
		const checked = /* @__PURE__ */ new Set();
		for (const directory of directories) {
			if (checked.has(directory.path)) continue;
			if (!current(directory.path, groups.get(directory.path))) return false;
			checked.add(directory.path);
		}
		return true;
	} catch {
		return false;
	}
}
function advanceMutationObservation(observation, parent, child) {
	const nextMissingPath = nextMissingMutationPath(observation);
	if (nextMissingPath === void 0 || nextMissingPath !== child.path) return observation;
	if (!checkedDirectory(parent) || !checkedDirectory(child) || observation.ancestor !== parent.path || observation.canonicalAncestor !== parent.canonicalPath || !sameIdentity(observation.entry, parent.identity, true) || !sameIdentity(observation.identity, parent.identity, true) || parent.path !== parent.canonicalPath || child.path !== child.canonicalPath || path.dirname(child.path) !== parent.path) return void 0;
	return Object.freeze({
		...observation,
		ancestor: child.path,
		canonicalAncestor: child.canonicalPath,
		entry: child.identity,
		identity: child.identity,
		missingOffset: observation.missingOffset + 1
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/staged-directory.js
function exactIdentityMatches(expected, actual) {
	return ["dev", "ino"].every((key) => {
		const value = expected[key];
		return (typeof value === "bigint" || Number.isSafeInteger(value)) && BigInt(value) === actual[key];
	});
}
function describeStagedDirectory(fd, pathname) {
	const identity = fs.fstatSync(fd, { bigint: true });
	if (!identity.isDirectory()) throw new FsSafeError("not-file", "staging parent must be a directory");
	const receipt = Object.freeze({
		path: resolvePathPreservingWindowsRoot(pathname),
		realPath: realpathSync$1(pathname),
		identity: Object.freeze({
			dev: identity.dev,
			ino: identity.ino
		})
	});
	assertStagedDirectoryCurrent(receipt);
	return receipt;
}
function assertStagedDirectoryCurrent(receipt) {
	const current = fs.lstatSync(receipt.path, { bigint: true });
	if (!current.isDirectory() || !exactIdentityMatches(receipt.identity, current) || realpathSync$1(receipt.path) !== receipt.realPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
	return current;
}
function assertNativeStagedDirectoryCurrent(binding, fd, directory) {
	if (typeof binding.stagedDirectoryMatches === "function" && directory.path === directory.realPath) try {
		if (!binding.stagedDirectoryMatches(fd, directory.path, directory.identity.dev, directory.identity.ino)) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
		return;
	} catch (error) {
		if (error?.code !== "OBSERVATION_UNAVAILABLE") throw error;
	}
	assertStagedDirectoryCurrent(directory);
}
/** Ordinary publication fences identity, while sibling entries may change. */
function describeNativeStagedDirectory(binding, fd, canonicalPath) {
	const stat = fs.fstatSync(fd, { bigint: true });
	if (!stat.isDirectory()) throw new FsSafeError("not-file", "staging parent must be a directory");
	const pathname = resolvePathPreservingWindowsRoot(canonicalPath);
	const directory = Object.freeze({
		path: pathname,
		realPath: pathname,
		identity: Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		})
	});
	assertNativeStagedDirectoryCurrent(binding, fd, directory);
	return {
		directory,
		stat
	};
}
function sameDirectoryMetadata(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.nlink === right.nlink;
}
function describePolicyStagedDirectory(fd, pathname, binding) {
	const resolved = path.resolve(pathname);
	const descriptor = fs.fstatSync(fd, { bigint: true });
	if (!descriptor.isDirectory()) throw new FsSafeError("not-file", "staging parent must be a directory");
	const observeCurrent = nativePolicyDirectoryObserver(binding, fd, resolved);
	const observed = observeCurrent?.();
	if (observed) {
		if (!sameDirectoryMetadata(descriptor, observed.identity)) throw new NativePolicyDirectoryMismatch();
		const directory = Object.freeze({
			path: resolved,
			realPath: observed.canonicalPath,
			identity: Object.freeze({
				dev: descriptor.dev,
				ino: descriptor.ino
			})
		});
		return Object.freeze({
			directory,
			observation: checkedMutationDirectory(resolved, observed.canonicalPath, observed.identity, observeCurrent),
			stat: descriptor,
			observeCurrent,
			disposeObservation: observeCurrent.dispose
		});
	}
	const before = inspectDirectoryIdentitySync(resolved);
	const canonicalPath = path.resolve(realpathSync$1.native(resolved));
	const after = inspectDirectoryIdentitySync(resolved, descriptor);
	if (canonicalPath !== resolved || !sameDirectoryMetadata(descriptor, before) || !sameDirectoryMetadata(descriptor, after) || path.resolve(realpathSync$1.native(resolved)) !== canonicalPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
	const directory = Object.freeze({
		path: resolved,
		realPath: canonicalPath,
		identity: Object.freeze({
			dev: descriptor.dev,
			ino: descriptor.ino
		})
	});
	return Object.freeze({
		directory,
		observation: checkedMutationDirectory(resolved, canonicalPath, after),
		stat: after
	});
}
function assertPolicyStagedDirectoryCurrent(captured) {
	const observed = captured.observeCurrent?.();
	if (observed) {
		if (!sameDirectoryMetadata(captured.stat, observed.identity) || observed.canonicalPath !== captured.directory.realPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
		return captured.stat;
	}
	const current = inspectDirectoryIdentitySync(captured.directory.path, captured.directory.identity);
	if (!sameDirectoryMetadata(captured.stat, current) || path.resolve(realpathSync$1.native(captured.directory.path)) !== captured.directory.realPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
	return current;
}
function refreshPolicyStagedDirectoryObservation(captured) {
	const observed = captured.observeCurrent?.();
	if (observed) {
		if (!exactIdentityMatches(captured.directory.identity, observed.identity) || observed.canonicalPath !== captured.directory.realPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
		return checkedMutationDirectory(captured.directory.path, observed.canonicalPath, observed.identity, captured.observeCurrent);
	}
	const current = inspectDirectoryIdentitySync(captured.directory.path, captured.directory.identity);
	const canonicalPath = path.resolve(realpathSync$1.native(captured.directory.path));
	if (canonicalPath !== captured.directory.realPath) throw new FsSafeError("path-mismatch", "staging directory pathname changed");
	return checkedMutationDirectory(captured.directory.path, canonicalPath, current);
}
function openStagedDirectory(directory) {
	const expected = typeof directory === "string" ? void 0 : directoryReceiptAuthority(ownDirectoryReceipt(directory));
	const pathname = resolvePathPreservingWindowsRoot(typeof directory === "string" ? directory : expected.path);
	const before = fs.lstatSync(pathname, { bigint: true });
	if (!before.isDirectory()) throw new FsSafeError("not-file", "staging parent must be a real directory");
	if (expected && (!exactIdentityMatches(expected.identity, before) || realpathSync$1(pathname) !== expected.realPath)) throw new FsSafeError("path-mismatch", "stale staging directory receipt");
	const fd = fs.openSync(pathname, fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
	try {
		const receipt = describeStagedDirectory(fd, pathname);
		if (!exactIdentityMatches(before, receipt.identity)) throw new FsSafeError("path-mismatch", "staging directory changed while opening");
		return {
			fd,
			receipt
		};
	} catch (error) {
		try {
			fs.closeSync(fd);
		} catch (closeError) {
			throw new AggregateError([error, closeError], "staging directory admission and close failed");
		}
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-contents.js
/** Compares borrowed regular files from offset zero without moving or closing either descriptor. */
function sameFileContentsSync(leftFd, rightFd, options = {}) {
	const maxBytes = normalizeMaxBytes(options.maxBytes) ?? Infinity;
	const limit = Math.min(maxBytes, Number.MAX_SAFE_INTEGER);
	const tooLarge = () => new FsSafeError("too-large", `file comparison exceeds ${limit} bytes`);
	for (const fd of [leftFd, rightFd]) {
		const stat = fs.fstatSync(fd, { bigint: true });
		if (!stat.isFile()) throw new FsSafeError("not-file", "file comparison requires regular-file descriptors");
		if (stat.size > BigInt(limit)) throw tooLarge();
	}
	const left = Buffer.allocUnsafe(Math.min(1048576, Math.max(1, limit)));
	const right = Buffer.allocUnsafe(left.length);
	let position = 0;
	while (true) {
		const length = Math.min(left.length, limit - position);
		if (length === 0) {
			const leftExtra = fs.readSync(leftFd, left, 0, 1, position);
			const rightExtra = fs.readSync(rightFd, right, 0, 1, position);
			if (leftExtra !== 0 || rightExtra !== 0) throw tooLarge();
			return true;
		}
		const leftRead = readFileWindowFullySync(leftFd, left.subarray(0, length), position);
		const rightRead = readFileWindowFullySync(rightFd, right.subarray(0, length), position);
		if (leftRead !== rightRead || !left.subarray(0, leftRead).equals(right.subarray(0, rightRead))) return false;
		if (leftRead < length) return true;
		position += leftRead;
	}
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/atomic-io.js
function* wait(value) {
	return yield value;
}
function runSync(procedure) {
	let step = procedure.next();
	while (!step.done) step = procedure.next(step.value);
	return step.value;
}
function inspectAtomicIdentity(io, read, expected, synchronous = false, admit) {
	if (io.asynchronous && !synchronous) return inspectFileIdentity(admit ? async () => {
		const stat = await read();
		admit(stat);
		return stat;
	} : read, expected);
	return inspectFileIdentitySync(admit ? () => {
		const stat = read();
		admit(stat);
		return stat;
	} : read, expected);
}
/** One adapter per operation; each admitted descriptor receives one AtomicFile. */
var AtomicIo = class AtomicIo {
	asyncFs;
	syncFs;
	fchmodSync;
	asynchronous;
	constructor(asyncFs, syncFs, fchmodSync) {
		this.asyncFs = asyncFs;
		this.syncFs = syncFs;
		this.fchmodSync = fchmodSync;
		this.asynchronous = asyncFs !== void 0;
	}
	static async(fsModule) {
		return new AtomicIo(fsModule, void 0);
	}
	static sync(fsModule, fchmodSync) {
		return new AtomicIo(void 0, fsModule, fchmodSync);
	}
	wrap(resource) {
		return new AtomicFile(this, resource);
	}
	*open(pathname, flags, mode) {
		const withMode = arguments.length > 2;
		const exclusive = fs.constants.O_CREAT | fs.constants.O_EXCL;
		if (process.platform === "win32" && (typeof flags === "string" ? flags.includes("x") : (flags & exclusive) === exclusive)) try {
			assertExclusiveCreateStat(pathname, yield* this.lstat(pathname));
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		}
		const resource = this.asyncFs ? yield* wait(withMode ? this.asyncFs.open(pathname, flags, mode) : this.asyncFs.open(pathname, flags)) : withMode ? this.syncFs.openSync(pathname, flags, mode) : this.syncFs.openSync(pathname, flags);
		return this.wrap(resource);
	}
	*lstat(pathname) {
		if (!this.asyncFs) return this.syncFs.lstatSync(pathname);
		if (this.asyncFs === fs$1) return fs.lstatSync(pathname);
		return yield* wait(this.asyncFs.lstat(pathname));
	}
	lstatExact(pathname, synchronousBuiltin = true) {
		if (!this.asyncFs) return this.syncFs.lstatSync(pathname, { bigint: true });
		if (synchronousBuiltin && this.asyncFs === fs$1) return fs.lstatSync(pathname, { bigint: true });
		return this.asyncFs.lstat(pathname, { bigint: true });
	}
	*mkdir(directory, mode) {
		if (this.asyncFs) {
			const pathname = this.asyncFs === fs$1 ? recursiveMkdirPath(directory) : directory;
			yield* wait(this.asyncFs.mkdir(pathname, {
				recursive: true,
				mode
			}));
		} else {
			const pathname = this.syncFs === fs ? recursiveMkdirPath(directory) : directory;
			this.syncFs.mkdirSync(pathname, {
				recursive: true,
				mode
			});
		}
	}
	*rename(source, destination) {
		if (this.asyncFs) yield* wait(this.asyncFs.rename(source, destination));
		else this.syncFs.renameSync(source, destination);
	}
	*remove(pathname) {
		if (this.asyncFs) yield* wait(this.asyncFs.rm(pathname, { force: true }));
		else this.syncFs.rmSync(pathname, { force: true });
	}
	*unlink(pathname) {
		if (this.asyncFs) yield* wait(this.asyncFs.unlink(pathname));
		else this.syncFs.unlinkSync(pathname);
	}
	*delay(milliseconds) {
		if (this.asynchronous) yield* wait(sleep(milliseconds));
		else sleepSync(milliseconds);
	}
};
var AtomicFile = class {
	io;
	resource;
	constructor(io, resource) {
		this.io = io;
		this.resource = resource;
	}
	get fd() {
		return typeof this.resource === "number" ? this.resource : this.resource.fd;
	}
	*stat() {
		if (typeof this.resource === "number") return this.io.syncFs.fstatSync(this.resource);
		if (this.io.asyncFs === fs$1) return fs.fstatSync(this.resource.fd);
		return yield* wait(this.resource.stat());
	}
	statExact() {
		if (typeof this.resource === "number") return this.io.syncFs.fstatSync(this.resource, { bigint: true });
		if (this.io.asyncFs === fs$1) return fs.fstatSync(this.resource.fd, { bigint: true });
		return this.resource.stat({ bigint: true });
	}
	close() {
		if (typeof this.resource === "number") this.io.syncFs.closeSync(this.resource);
		else return this.resource.close();
	}
	*sync() {
		if (typeof this.resource === "number") this.io.syncFs.fsyncSync(this.resource);
		else yield* wait(this.resource.sync());
	}
	*syncBestEffort() {
		try {
			yield* this.sync();
		} catch (error) {
			if (error?.code !== "EPERM") throw error;
		}
	}
	chmod(mode) {
		if (typeof this.resource === "number") {
			const chmod = this.io.fchmodSync;
			chmod?.(this.resource, mode);
		} else return this.resource.chmod(mode);
	}
	writeFile(data, throughModule = false) {
		if (typeof this.resource === "number") this.io.syncFs.writeFileSync(this.resource, data);
		else if (throughModule) return this.io.asyncFs.writeFile(this.resource, data);
		else return this.resource.writeFile(data);
	}
	*readFile(sizeHint) {
		if (typeof this.resource !== "number") return yield* wait(readFileHandleBounded(this.resource, Infinity));
		if (sizeHint === void 0) return this.io.syncFs.readFileSync(this.resource);
		const fd = this.resource;
		let position = 0;
		return readBoundedSync(Infinity, (buffer, length) => {
			const bytesRead = this.io.syncFs.readSync(fd, buffer, 0, length, position);
			position += bytesRead;
			return bytesRead;
		}, { initialSize: Number.isSafeInteger(sizeHint) && sizeHint >= 0 ? sizeHint : void 0 });
	}
	read(buffer, offset, length, position) {
		if (typeof this.resource === "number") return this.io.syncFs.readSync(this.resource, buffer, offset, length, position);
		return this.resource.read(buffer, offset, length, position);
	}
	write(buffer, offset, length, position) {
		if (typeof this.resource === "number") {
			const written = this.io.syncFs.writeSync(this.resource, buffer, offset, length, position);
			if (written === 0) throw new Error("Copy fallback write made no progress");
			return written;
		}
		return this.resource.write(buffer, offset, length, position);
	}
	*truncate(length) {
		if (typeof this.resource === "number") this.io.syncFs.ftruncateSync(this.resource, length);
		else yield* wait(this.resource.truncate(length));
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/replace-file-descriptor.js
function* writeTempFile(io, params) {
	params.mutation?.assert();
	const file = yield* io.open(params.tempPath, "wx", params.mode);
	try {
		const openedInspection = inspectAtomicIdentity(io, () => file.statExact());
		const identity = io.asynchronous ? yield openedInspection : openedInspection;
		params.onIdentity?.(identity);
		params.mutation?.assert();
		const writing = file.writeFile(params.content, true);
		if (io.asynchronous) yield writing;
		if ((io.asyncFs === fs$1 || process.platform === "win32" && io.syncFs === fs) && !params.sync) {
			const current = inspectAtomicIdentity(io, () => file.statExact(), identity, true);
			const modeMask = process.platform === "win32" ? 128 : 4095;
			if (Number(current.mode & BigInt(modeMask)) === (params.mode & modeMask)) return {
				file,
				identity
			};
		}
		const chmod = file.chmod(params.mode);
		if (io.asynchronous) yield chmod;
		if (params.sync) yield* file.syncBestEffort();
		const currentInspection = inspectAtomicIdentity(io, () => file.statExact(), identity);
		if (io.asynchronous) yield currentInspection;
		return {
			file,
			identity
		};
	} catch (error) {
		try {
			const closing = file.close();
			if (io.asynchronous) yield closing;
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Atomic temp write and close failed");
		}
		throw error;
	}
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/guarded-mutation.js
async function withAsyncDirectoryGuards(guards, mutate, options = {}) {
	for (const guard of guards) assertDirectoryGuard(guard, "native");
	const result = await mutate();
	if (options.verifyAfter !== false) try {
		for (const guard of guards) assertDirectoryGuard(guard, "native");
	} catch (error) {
		if (options.onPostGuardFailure) try {
			await options.onPostGuardFailure(result, error);
		} catch {}
		throw error;
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/replace-file-temp-owner.js
const PUBLISHED_READ_FLAGS = resolveReadOpenFlags();
function describeFailure(error) {
	try {
		return String(error);
	} catch {
		return "<unprintable failure>";
	}
}
function isErrorValue(error) {
	try {
		return error instanceof Error;
	} catch {
		return false;
	}
}
async function removePathIfIdentityUnchanged(targetPath, identity) {
	await withAsyncDirectoryGuards([await createAsyncDirectoryGuard(path.dirname(targetPath), { bigint: true })], async () => {
		const current = fs.lstatSync(targetPath, { bigint: true });
		if (current.isSymbolicLink() || !current.isFile() || !sameFileIdentityForCleanup(current, identity)) return;
		await fs$1.unlink(targetPath);
	});
}
function assertOwnedFile(stat, pathname, pathnameEntry) {
	if (stat.isSymbolicLink()) throw new FsSafeError("symlink", `Atomic replace owned file became a symlink: ${pathname}`);
	if (!stat.isFile()) throw new FsSafeError("not-file", `Atomic replace owned file must remain regular: ${pathname}`);
	if (stat.nlink > 1n || pathnameEntry && stat.nlink !== 1n) throw new FsSafeError("hardlink", `Atomic replace owned file must retain one link: ${pathname}`);
}
function missingOwnedFile(pathname, cause) {
	return new FsSafeError("path-mismatch", `Atomic replace owned file disappeared: ${pathname}`, { cause });
}
function cleanupFailure(originalFailure, cleanupError) {
	if (originalFailure) return new Error(`Atomic file replace failed (${describeFailure(originalFailure.error)}); cleanup also failed (${describeFailure(cleanupError)})`, { cause: originalFailure.error });
	return isErrorValue(cleanupError) ? cleanupError : new Error(describeFailure(cleanupError));
}
function closeFailure(closeError, params, cleanupFailure) {
	return { error: cleanupFailure ? new AggregateError([cleanupFailure.error, closeError], "Atomic temp cleanup and close failed") : params.originalFailure ? new AggregateError([params.originalFailure.error, closeError], "Atomic file replace and close failed") : closeError };
}
var AtomicTempOwner = class {
	pathname;
	io;
	resource;
	recordedIdentity;
	exists = false;
	unregister;
	constructor(pathname, io) {
		this.pathname = pathname;
		this.io = io;
		this.unregister = registerTempPathForExit(pathname, { singleLinkFile: true });
	}
	start() {
		this.exists = true;
	}
	onIdentity = (identity) => {
		this.recordedIdentity = identity;
		this.unregister.setIdentity(identity);
	};
	get identity() {
		if (!this.recordedIdentity) throw new Error("Atomic temp owner has no identity");
		return this.recordedIdentity;
	}
	markRenamed() {
		this.exists = false;
		this.unregister();
	}
	takeResource() {
		const resource = this.resource;
		this.resource = void 0;
		return resource;
	}
	adopt(temp) {
		this.resource = temp.file;
		this.onIdentity(temp.identity);
	}
	inspectOwned(read, pathname, pathnameEntry, expected) {
		return inspectAtomicIdentity(this.io, read, expected, false, (stat) => assertOwnedFile(stat, pathname, pathnameEntry));
	}
	*assertCurrent(pathname = this.pathname) {
		const openedInspection = this.inspectOwned(() => this.resource.statExact(), pathname, false, this.identity);
		const opened = this.io.asynchronous ? yield openedInspection : openedInspection;
		try {
			const currentInspection = this.inspectOwned(() => this.io.lstatExact(pathname), pathname, true, opened);
			if (this.io.asynchronous) yield currentInspection;
		} catch (error) {
			if (hasErrorCode(error, "ENOENT")) throw missingOwnedFile(pathname, error);
			throw error;
		}
	}
	*assertPublished(pathname, expectedHash, onVerified) {
		let identityCurrent = false;
		try {
			yield* this.assertCurrent(pathname);
			identityCurrent = true;
		} catch (error) {
			if (!(error instanceof FsSafeError) || !hasErrorCode(error, "path-mismatch") || !expectedHash) throw error;
		}
		if (identityCurrent) {
			onVerified?.(this.identity);
			return;
		}
		let published;
		try {
			try {
				published = yield* this.io.open(pathname, PUBLISHED_READ_FLAGS);
			} catch (error) {
				if (hasErrorCode(error, "ELOOP")) throw new FsSafeError("symlink", `Atomic replace published file became a symlink: ${pathname}`, { cause: error });
				throw error;
			}
			const openedInspection = this.inspectOwned(() => published.statExact(), pathname, false);
			const identity = this.io.asynchronous ? yield openedInspection : openedInspection;
			const currentInspection = this.inspectOwned(() => this.io.lstatExact(pathname), pathname, true, identity);
			if (this.io.asynchronous) yield currentInspection;
			if (sha256Hex$1(yield* published.readFile()) !== expectedHash) throw new FsSafeError("path-mismatch", `Atomic replace published content changed: ${pathname}`);
			onVerified?.(identity);
			const previous = this.takeResource();
			const closing = previous?.close();
			if (previous && this.io.asynchronous) yield closing;
			this.resource = published;
			this.recordedIdentity = identity;
			published = void 0;
		} finally {
			try {
				const closing = published?.close();
				if (published && this.io.asynchronous) yield closing;
			} catch {}
		}
	}
	*cleanupOwnedPath(params) {
		const identity = this.recordedIdentity;
		if (!identity) return true;
		try {
			const observation = this.io.lstatExact(this.pathname);
			const current = this.io.asyncFs && this.io.asyncFs !== fs$1 ? yield* wait(observation) : observation;
			if (!current.isSymbolicLink() && current.isFile() && current.nlink === 1n && sameFileIdentityForCleanup(current, identity)) yield* this.io.unlink(this.pathname);
			return true;
		} catch (cleanupError) {
			if (hasErrorCode(cleanupError, "ENOENT")) return true;
			if (params.throwOnCleanupError) throw cleanupFailure(params.originalFailure, cleanupError);
			return false;
		}
	}
	*finish(params) {
		let deferredFailure;
		let cleanupComplete = !this.exists;
		if (this.exists) try {
			cleanupComplete = yield* this.cleanupOwnedPath(params);
		} catch (error) {
			deferredFailure = { error };
		}
		if (cleanupComplete) this.unregister();
		const file = this.takeResource();
		try {
			const closing = file?.close();
			if (file && this.io.asynchronous) yield closing;
		} catch (closeError) {
			deferredFailure = closeFailure(closeError, params, deferredFailure);
		}
		if (deferredFailure) throw deferredFailure.error;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-case.js
function swapAsciiCase(value) {
	return value.replace(/[A-Za-z]/g, (character) => {
		const lower = character.toLowerCase();
		return character === lower ? character.toUpperCase() : lower;
	});
}
function probeEntry(directory, name, names) {
	const alternate = swapAsciiCase(name);
	if (alternate === name) return void 0;
	const bothListed = names.has(name) && names.has(alternate);
	const originalPath = path.join(directory, name);
	let original;
	let observed;
	try {
		original = inspectFileIdentitySync(() => fs.lstatSync(originalPath, { bigint: true }));
		try {
			const other = inspectFileIdentitySync(() => fs.lstatSync(path.join(directory, alternate), { bigint: true }));
			const sameIdentity = sameFileIdentityForCleanup(original, other);
			if (sameIdentity || bothListed) {
				const currentNames = new Set(fs.readdirSync(directory));
				const bothCurrent = currentNames.has(name) && currentNames.has(alternate);
				if (bothListed && !bothCurrent) return void 0;
				observed = sameIdentity && !bothCurrent;
			} else observed = false;
		} catch (error) {
			if (bothListed || !isNotFoundPathError(error)) return void 0;
			observed = false;
		}
	} catch {
		return;
	}
	inspectFileIdentitySync(() => fs.lstatSync(originalPath, { bigint: true }), original);
	return observed;
}
function probeTemporaryEntry(directory) {
	const name = `.fs-safe-case-probe-${randomUUID()}`;
	const io = AtomicIo.sync(fs);
	const owner = new AtomicTempOwner(path.join(directory, name), io);
	try {
		owner.start();
		owner.adopt(runSync(writeTempFile(io, {
			tempPath: owner.pathname,
			content: "",
			mode: 384,
			sync: false,
			onIdentity: owner.onIdentity
		})));
		runSync(owner.assertCurrent());
		const observed = probeEntry(directory, name, new Set(fs.readdirSync(directory)));
		runSync(owner.assertCurrent());
		return observed;
	} finally {
		runSync(owner.finish({ throwOnCleanupError: true }));
	}
}
function probeDirectory(directory, allowTemporaryProbe, preferredName) {
	const canonical = realpathSync$1.native(directory);
	const identity = inspectDirectoryIdentitySync(canonical);
	const names = new Set(fs.readdirSync(canonical));
	let observed = preferredName === void 0 ? void 0 : probeEntry(canonical, preferredName, names);
	for (const name of names) {
		if (observed !== void 0) break;
		observed = probeEntry(canonical, name, names);
	}
	if (observed === void 0 && allowTemporaryProbe) observed = probeTemporaryEntry(canonical);
	assertDirectoryIdentitySync(canonical, identity);
	return realpathSync$1.native(directory) === canonical ? observed : void 0;
}
/** Observe local ASCII case behavior; unknown observations never imply an operating-system default. */
function probePathCaseInsensitiveSync(targetPath, options = {}) {
	const resolved = path.resolve(targetPath);
	const allowTemporaryProbe = options.allowTemporaryProbe !== false;
	let targetExists = true;
	try {
		fs.lstatSync(resolved);
	} catch (error) {
		if (!isNotFoundPathError(error)) return void 0;
		targetExists = false;
	}
	if (targetExists) try {
		return probeDirectory(path.dirname(resolved), allowTemporaryProbe, path.basename(resolved));
	} catch {
		return;
	}
	let directory = path.dirname(resolved);
	for (;;) {
		let exists = false;
		try {
			exists = fs.statSync(directory).isDirectory();
		} catch {}
		if (exists) try {
			return probeDirectory(directory, allowTemporaryProbe);
		} catch {
			return;
		}
		const parent = path.dirname(directory);
		if (parent === directory) return void 0;
		directory = parent;
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
function unavailable$4(operation, detail, cause) {
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
		return unavailable$4(operation, code === "FS_SAFE_INTERNAL_RENAME_NOREPLACE_UNSUPPORTED" ? error.message : `${capability}: ${code}`, error);
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
	return detail ? unavailable$4(operation, detail) : void 0;
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/absolute-path.js
function assertAbsolutePathInput(filePath) {
	if (!filePath) throw new FsSafeError("invalid-path", "path is required");
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", "path must not contain NUL bytes");
	assertNoWindowsPathAlias(filePath);
	if (!path.isAbsolute(filePath)) throw new FsSafeError("invalid-path", "path must be absolute");
	const normalized = path.normalize(filePath);
	assertNoWindowsPathAlias(normalized);
	return normalized;
}
async function findExistingAncestor(filePath) {
	assertNoWindowsPathAlias(filePath);
	let current = resolvePathPreservingWindowsRoot(filePath);
	assertNoWindowsPathAlias(current);
	while (true) {
		try {
			fs.lstatSync(pathForWindowsFilesystem(current));
			return current;
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
async function canonicalPathFromExistingAncestor(filePath) {
	assertNoWindowsPathAlias(filePath);
	const ancestor = await findExistingAncestor(filePath);
	if (!ancestor) {
		const resolved = resolvePathPreservingWindowsRoot(filePath);
		assertNoWindowsPathAlias(resolved);
		return resolved;
	}
	let canonicalAncestor = ancestor;
	let resolvedAncestor;
	try {
		resolvedAncestor = realpathSync$1.native(pathForWindowsFilesystem(ancestor));
	} catch {}
	if (resolvedAncestor !== void 0) {
		assertNoWindowsPathAlias(resolvedAncestor);
		canonicalAncestor = resolvedAncestor;
	}
	const relative = path.relative(ancestor, filePath);
	const canonicalPath = relative ? path.join(canonicalAncestor, relative) : canonicalAncestor;
	assertNoWindowsPathAlias(canonicalPath);
	return canonicalPath;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-handle-context.js
const contexts = /* @__PURE__ */ new WeakMap();
/** Internal registration; never reconstruct authority from public pathname fields. */
function registerRootHandleContext(handle, context) {
	contexts.set(handle, context);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-durability.js
function directoryOpenFlags() {
	if (process.platform === "win32") return "r";
	return fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;
}
function isWindowsDirectorySyncUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EACCES" || code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP" || code === "EPERM";
}
function isWindowsDirectoryOpenUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP";
}
function unsupportedOutcome(error) {
	const code = error.code;
	return code ? {
		status: "unsupported",
		code
	} : { status: "unsupported" };
}
async function createDirectoryReceipt(directoryPath, label) {
	return createDirectoryReceiptSync(directoryPath, label, realpathSync$1.native);
}
async function assertDirectoryReceiptCurrent(receipt, label) {
	assertDirectoryReceiptCurrentSync(receipt, label, realpathSync$1.native);
}
function assertOpenDirectoryIdentity(descriptor, receipt, label) {
	inspectFileIdentitySync(() => {
		const opened = fs.fstatSync(descriptor, { bigint: true });
		if (!opened.isDirectory()) throw new FsSafeError("not-file", `${label} must be a real directory: ${receipt.path}`);
		return opened;
	}, directoryReceiptAuthority(receipt).identity);
}
async function assertOpenDirectoryCurrent(handle, receipt, label) {
	assertOpenDirectoryIdentity(handle.fd, receipt, label);
	await assertDirectoryReceiptCurrent(receipt, label);
}
var PinnedDirectoryImpl = class {
	receipt;
	#authority;
	#handle;
	#label;
	#closed = false;
	constructor(handle, receipt, label) {
		this.#handle = handle;
		this.#authority = receipt;
		this.receipt = copyRetainedDirectoryReceipt(receipt);
		this.#label = label;
	}
	async assertCurrent() {
		if (this.#closed) throw new FsSafeError("helper-failed", `${this.#label} pin is already closed`);
		await assertOpenDirectoryCurrent(this.#handle, this.#authority, this.#label);
	}
	async sync() {
		await this.assertCurrent();
		try {
			await this.#handle.sync();
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			await this.assertCurrent();
			return unsupportedOutcome(error);
		}
		await this.assertCurrent();
		return { status: "synced" };
	}
	async close() {
		if (this.#closed) return;
		this.#closed = true;
		await this.#handle.close();
	}
};
async function pinDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : ownDirectoryReceipt(directory);
	await assertDirectoryReceiptCurrent(receipt, label);
	const handle = await fs$1.open(pathForWindowsFilesystem(receipt.path), directoryOpenFlags());
	try {
		await assertOpenDirectoryCurrent(handle, receipt, label);
		return new PinnedDirectoryImpl(handle, receipt, label);
	} catch (error) {
		await handle.close().catch(() => void 0);
		throw error;
	}
}
async function syncDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : ownDirectoryReceipt(directory);
	let pinned;
	try {
		pinned = await pinDirectory(receipt, { label });
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		await assertDirectoryReceiptCurrent(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		return await pinned.sync();
	} finally {
		await pinned.close();
	}
}
function syncDirectorySync(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? createDirectoryReceiptSync(directory, label) : ownDirectoryReceipt(directory);
	assertDirectoryReceiptCurrentSync(receipt, label);
	let descriptor;
	try {
		descriptor = fs.openSync(pathForWindowsFilesystem(receipt.path), directoryOpenFlags());
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		assertDirectoryReceiptCurrentSync(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		assertOpenDirectoryIdentity(descriptor, receipt, label);
		assertDirectoryReceiptCurrentSync(receipt, label);
		try {
			fs.fsyncSync(descriptor);
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			assertDirectoryReceiptCurrentSync(receipt, label);
			return unsupportedOutcome(error);
		}
		assertDirectoryReceiptCurrentSync(receipt, label);
		return { status: "synced" };
	} finally {
		fs.closeSync(descriptor);
	}
}
async function syncDirectoryBestEffort(directoryPath) {
	await syncDirectory(directoryPath).catch(() => void 0);
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/deny-mutation-match.js
function foldedName(name) {
	return name.normalize("NFD").replace(/[^\u0131]+/gu, (part) => part.toLowerCase().toUpperCase().toLowerCase()).normalize("NFC");
}
function asciiCasePair(left, right) {
	return /^[\x00-\x7f]*$/.test(left) && /^[\x00-\x7f]*$/.test(right) && left.toLowerCase() === right.toLowerCase();
}
/** Cache observations only within one synchronous policy check, never across mutations or callbacks. */
function createMutationDenyMatcher() {
	const observations = /* @__PURE__ */ new Map();
	const caseObservations = /* @__PURE__ */ new Map();
	const observe = (pathname) => {
		if (!observations.has(pathname)) observations.set(pathname, observeMutationPath(pathname));
		return observations.get(pathname);
	};
	const prospectiveInside = (parent, child) => {
		const root = path.parse(parent).root;
		if (root !== path.parse(child).root) return false;
		const left = parent.slice(root.length).split(path.sep);
		const right = child.slice(root.length).split(path.sep).slice(0, left.length);
		if (left.length !== right.length || !left.every((name, i) => foldedName(name) === foldedName(right[i]))) return false;
		if (left.every((name, i) => name === right[i])) return false;
		const alignedChild = path.join(root, ...right);
		const a = observe(parent);
		const b = observe(alignedChild);
		if (!a || !b) return true;
		if (a.canonicalAncestor !== b.canonicalAncestor || a.missingSegments.length === 0 || a.missingSegments.length !== b.missingSegments.length) return false;
		const missingLeft = a.missingSegments;
		const missingRight = b.missingSegments;
		if (!missingLeft.every((name, i) => foldedName(name) === foldedName(missingRight[i]))) return false;
		const difference = missingLeft.findIndex((name, i) => name !== missingRight[i]);
		if (difference === -1) return true;
		if (difference === 0 && asciiCasePair(missingLeft[0], missingRight[0])) {
			if (!caseObservations.has(a.canonicalAncestor)) caseObservations.set(a.canonicalAncestor, probePathCaseInsensitiveSync(path.join(a.canonicalAncestor, missingLeft[0]), { allowTemporaryProbe: false }));
			if (caseObservations.get(a.canonicalAncestor) === false) return false;
		}
		return true;
	};
	return (target, denied, prefix, protectAncestors = false) => {
		if (isPathInside(denied, target) && (prefix || isPathInside(target, denied)) || protectAncestors && isPathInside(target, denied)) return true;
		return (prefix || target.split(path.sep).length === denied.split(path.sep).length) && prospectiveInside(denied, target) || protectAncestors && prospectiveInside(target, denied);
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/deny-mutations.js
function resolveMutationComparablePaths(rawPath) {
	assertNoNulPathInput(rawPath, "path contains a NUL byte");
	assertNoWindowsPathAlias(rawPath, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const resolved = resolvePathPreservingWindowsRoot(rawPath);
	assertNoWindowsPathAlias(resolved, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const canonical = resolveExistingAncestor(resolved, "native");
	assertNoWindowsPathAlias(canonical, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	return /* @__PURE__ */ new Set([resolved, canonical]);
}
function strictMutationComparablePaths(pathname) {
	const resolved = resolvePathPreservingWindowsRoot(pathname);
	assertNoWindowsPathAlias(resolved, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	let cursor = resolved;
	const filesystemRoot = path.parse(resolved).root;
	while (cursor !== filesystemRoot) try {
		fs.lstatSync(pathForWindowsFilesystem(cursor));
		break;
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		cursor = path.dirname(cursor);
	}
	const canonicalAncestor = realpathSync$1.native(pathForWindowsFilesystem(cursor));
	assertNoWindowsPathAlias(canonicalAncestor, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const canonical = cursor === resolved ? canonicalAncestor : path.resolve(canonicalAncestor, `.${path.sep}${resolved.slice(cursor.length)}`);
	assertNoWindowsPathAlias(canonical, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	return path.relative(path.resolve(resolved), path.resolve(canonical)) === "" ? [resolved] : [resolved, canonical];
}
function policyPathEntries(entries, strict) {
	const paths = [];
	for (const entry of entries ?? []) {
		if (strict && (!entry || !path.isAbsolute(entry))) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty absolute paths");
		if (entry.length === 0) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty");
		assertNoNulPathInput(entry, "deny mutation path contains a NUL byte");
		assertNoWindowsPathAlias(entry, "filesystem", "deny mutation path uses a Windows filesystem namespace alias");
		if (!strict && !path.isAbsolute(entry)) throw new FsSafeError("invalid-path", "deny mutation paths must be absolute");
		paths.push(strict ? resolvePathPreservingWindowsRoot(entry) : entry);
	}
	return paths;
}
function assertMutationNotDenied(filePath, policy, options = {}, mode = "root") {
	if (!policy?.paths?.length && !policy?.prefixes?.length) return;
	const strict = mode === "sync-root-lock";
	const comparablePaths = strict ? strictMutationComparablePaths : resolveMutationComparablePaths;
	const targets = comparablePaths(filePath);
	const matches = createMutationDenyMatcher();
	for (const kind of ["paths", "prefixes"]) for (const entry of policyPathEntries(policy[kind], strict)) {
		const deniedPaths = comparablePaths(entry);
		for (const target of targets) for (const denied of deniedPaths) if (matches(target, denied, kind === "prefixes", options.protectAncestors)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
}
function mergeDenyMutationPolicies(defaultPolicy, callPolicy) {
	if (!defaultPolicy) return callPolicy;
	if (!callPolicy) return defaultPolicy;
	return {
		paths: [...defaultPolicy.paths ?? [], ...callPolicy.paths ?? []],
		prefixes: [...defaultPolicy.prefixes ?? [], ...callPolicy.prefixes ?? []]
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-parent-admission.js
function sameNativeIdentity(left, right) {
	return hasSafeFileIdentity(left) && hasSafeFileIdentity(right) && BigInt(left.dev) === BigInt(right.dev) && BigInt(left.ino) === BigInt(right.ino);
}
function unavailable$3(message) {
	return new FsSafeError("helper-unavailable", message);
}
function assertParentAdmissionAvailable(binding) {
	if (typeof binding.openBeneath !== "function") throw unavailable$3("native parent directory admission is unavailable");
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
	if (!opened || !Number.isInteger(opened.fd) || opened.fd < 0) throw unavailable$3("native parent directory admission did not provide a descriptor");
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-segment-route.js
function sameAbsolutePath(left, right) {
	return path.relative(path.resolve(left), path.resolve(right)) === "";
}
function createPathSegmentRoute(segments) {
	const offsets = new Array(segments.length + 1);
	let cursor = 0;
	for (let index = 0; index < segments.length; index += 1) {
		offsets[index] = cursor;
		cursor += segments[index].length;
		if (index + 1 < segments.length) cursor += path.sep.length;
	}
	offsets[segments.length] = cursor;
	return Object.freeze({
		joined: segments.join(path.sep),
		offsets: Object.freeze(offsets)
	});
}
function joinPathSegmentRoute(base, route, offset, tail) {
	const start = route.offsets[offset];
	if (start === void 0) throw new RangeError("path segment offset is outside the route");
	const suffix = route.joined.slice(start);
	if (suffix) return tail === void 0 ? path.join(base, suffix) : path.join(base, suffix, tail);
	return tail === void 0 ? base : path.join(base, tail);
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
function unavailable$2() {
	throw new FsSafeError("helper-unavailable", "native confined creation is unavailable");
}
async function withNativeDirectory(params, operation, discard) {
	const binding = getNativeBinding("openBeneath", "mkdirChildBeneath");
	if (!binding?.openBeneath || !binding.mkdirChildBeneath || params.private && process.platform === "win32") return unavailable$2();
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
	if (!binding?.openBeneath || !binding.mkdirChildBeneath) return unavailable$2();
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
		if (!binding?.openBeneath || !binding.mkdirChildBeneath) return unavailable$2();
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
	if (!binding?.removeStagedFile || !binding.openCreateBeneath) return unavailable$2();
	const access = params.existingFlags & fs.constants.O_RDWR ? 384 : 128;
	if (typeof params.mode !== "number") throw Object.assign(/* @__PURE__ */ new TypeError("mode must be a number"), { code: "ERR_INVALID_ARG_TYPE" });
	if (!Number.isInteger(params.mode) || params.mode < 0 || params.mode > 4294967295) throw Object.assign(/* @__PURE__ */ new RangeError("mode must be an unsigned 32-bit integer"), { code: "ERR_OUT_OF_RANGE" });
	const creationMode = () => {
		const mask = process.umask();
		const desired = params.mode & 4095 & ~mask;
		return (desired & access) === access ? desired : void 0;
	};
	if (creationMode() === void 0) return unavailable$2();
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
		const native = binding.retainWindowsSidecar(nativeParent.fd, guard.realPath, name, BigInt(guard.stat.dev), BigInt(guard.stat.ino), created.dev, created.ino, BigInt(Buffer.byteLength(raw)), sha256Hex$1(raw), 1048576);
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
				const expectedHash = sha256Hex$1(params.input.data, params.input.encoding);
				readHandle = await fs$1.open(targetPath, resolveReadOpenFlags());
				const readHandleStat = fs.fstatSync(readHandle.fd, { bigint: true });
				if (sha256Hex$1(await readFileHandleBounded(readHandle, Infinity)) !== expectedHash) throw new FsSafeError("path-mismatch", "fallback target changed during write");
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
	const lockPath = path.join(params.rootPath, `.fs-safe-write-${sha256Hex$1(params.relativeTargetPath)}.lock`);
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
	const exactIdentity = exactFileIdentity$1(stat);
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
		if (preparedBatch) await setImmediate$1();
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
					if (synchronousNames && index++ % METADATA_BATCH_SIZE === 31) await setImmediate$1();
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
function unavailable$1() {
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
	if (!binding?.rootRemovalStat || !binding.rootRemovalUnlink) unavailable$1();
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
					if (!openDirectory) unavailable$1();
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
						].includes(code ?? "")) unavailable$1();
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
				if (sha256Hex$1(content) !== sha256Hex$1(data, params.options.encoding)) throw new FsSafeError("path-mismatch", "fallback target changed during write");
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root.js
const retainedRootContexts = /* @__PURE__ */ new WeakMap();
const retainedRootDefaults = /* @__PURE__ */ new WeakMap();
/** @internal Registers only instances constructed by RootHandle itself. */
function registerFileLockSyncRootAdapter(handle, context, defaults) {
	const identity = context.rootIdentity;
	if (typeof identity.dev !== "bigint" || typeof identity.ino !== "bigint") return;
	retainedRootContexts.set(handle, context);
	retainedRootDefaults.set(handle, defaults);
}
function snapshotPolicy(policy) {
	if (policy === void 0) return void 0;
	const paths = policy.paths;
	const prefixes = policy.prefixes;
	return Object.freeze({
		paths: paths === void 0 ? void 0 : Object.freeze([...paths]),
		prefixes: prefixes === void 0 ? void 0 : Object.freeze([...prefixes])
	});
}
function captureFileLockSyncRootAuthority(lockRoot) {
	const adapter = lockRoot;
	const retainedContext = retainedRootContexts.get(adapter);
	const retainedDefaults = retainedRootDefaults.get(adapter);
	if (!retainedContext || !retainedDefaults) throw new FsSafeError("helper-unavailable", "synchronous Root-backed file locks require a genuine fs-safe Root handle");
	const identity = retainedContext.rootIdentity;
	if (typeof identity.dev !== "bigint" || typeof identity.ino !== "bigint") throw new FsSafeError("helper-unavailable", "synchronous Root identity is unavailable");
	const context = Object.freeze({
		rootDir: retainedContext.rootDir,
		rootGuard: retainedContext.rootGuard,
		rootIdentity: Object.freeze({
			dev: identity.dev,
			ino: identity.ino
		}),
		rootReal: retainedContext.rootReal,
		rootWithSep: retainedContext.rootWithSep
	});
	const defaults = retainedDefaults;
	const assertBeforeMutation = defaults.assertBeforeMutation;
	const denyMutations = snapshotPolicy(defaults.denyMutations);
	const hardlinks = defaults.hardlinks;
	const mutationSymlinks = defaults.mutationSymlinks;
	const symlinks = defaults.symlinks;
	assertRootIdentityCurrentSync(context);
	const mutation = mutationSymlinkResolution(mutationSymlinks);
	const mutationPolicy = Object.freeze({
		rejectSymlinks: mutation.rejectSymlinks,
		rejectFinalSymlink: mutation.rejectFinalSymlink,
		rejectUnresolvedSymlinks: true
	});
	const readPolicy = Object.freeze({
		...readSymlinkResolution(symlinks),
		rejectUnresolvedSymlinks: true
	});
	return Object.freeze({
		adapter,
		context,
		assertBeforeMutation,
		denyMutations,
		hardlinks,
		mutationPolicy,
		readPolicy,
		policiesMatch: mutationPolicy.rejectSymlinks === readPolicy.rejectSymlinks && mutationPolicy.rejectFinalSymlink === readPolicy.rejectFinalSymlink
	});
}
function invokeFileLockSyncRootMutationAuthority(authority) {
	const assertion = authority.assertBeforeMutation;
	if (!assertion) return false;
	assertSynchronousCallbackResult(assertion(), "assertBeforeMutation");
	return true;
}
function absoluteRootPath(authority, relativePath) {
	const segments = relativePath.split(path.posix.sep);
	const absolute = path.join(authority.context.rootReal, ...segments);
	assertNoWindowsPathAlias(absolute, "filesystem", "sidecar lock path uses a Windows filesystem namespace alias");
	return absolute;
}
function assertFileLockSyncRootMutationAllowed(pathname, policy, protectAncestors = false) {
	assertMutationNotDenied(pathname, policy, { protectAncestors }, "sync-root-lock");
}
function resolveAdmittedPath(authority, absolutePath, policy, rootPath) {
	const context = authority.context;
	let resolved;
	try {
		resolved = resolveRootPathSync({
			absolutePath,
			rootPath,
			rootCanonicalPath: context.rootReal,
			rootIdentity: context.rootIdentity,
			boundaryLabel: "sidecar lock root",
			...policy
		});
	} catch (error) {
		if (isRootPathEscapeError(error)) throw new FsSafeError("outside-workspace", "sidecar lock path is outside lockRoot", { cause: error });
		throw error;
	}
	const admitted = admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: resolved.canonicalPath,
		rootIdentity: context.rootIdentity
	});
	if (!admitted || admitted.relativePath === "" || sameAbsolutePath(admitted.path, context.rootReal)) throw outsideWorkspaceError();
	return {
		path: admitted.path,
		relativePath: admitted.relativePath.split(path.sep).join(path.posix.sep)
	};
}
function resolveBothPolicies(authority, absolutePath, rootPath) {
	const { mutationPolicy, readPolicy, policiesMatch } = authority;
	const mutation = resolveAdmittedPath(authority, absolutePath, mutationPolicy, rootPath);
	const readable = policiesMatch ? mutation : resolveAdmittedPath(authority, absolutePath, readPolicy, rootPath);
	if (!sameAbsolutePath(mutation.path, readable.path)) throw new FsSafeError("path-mismatch", "sidecar read and mutation paths resolve differently");
	assertFileLockSyncRootMutationAllowed(mutation.path, authority.denyMutations);
	return mutation;
}
function admitRequestedRootPrefix(authority, requestedPath) {
	const context = authority.context;
	const identityCache = process.platform === "win32" ? /* @__PURE__ */ new Map() : void 0;
	const original = admitPathInsideRoot({
		rootPath: context.rootDir,
		candidatePath: requestedPath,
		rootIdentity: context.rootIdentity,
		resolveCandidateRoot: context.rootDir !== context.rootReal,
		identityCache
	});
	if (original && original.relativePath !== "") return {
		path: original.path,
		rootPath: context.rootDir
	};
	const canonical = context.rootDir === context.rootReal ? void 0 : admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: requestedPath,
		rootIdentity: context.rootIdentity,
		identityCache
	});
	if (!canonical || canonical.relativePath === "") throw outsideWorkspaceError();
	return {
		path: canonical.path,
		rootPath: context.rootReal
	};
}
function admitFileLockSyncRootPath(authority, requestedPath) {
	assertNoNulPathInput(requestedPath, "sidecar lock path contains a NUL byte");
	const resolved = resolvePathPreservingWindowsRoot(requestedPath);
	assertNoWindowsPathAlias(resolved, "filesystem", "sidecar lock path uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	const prefixed = admitRequestedRootPrefix(authority, resolved);
	const selected = resolveBothPolicies(authority, prefixed.path, prefixed.rootPath);
	assertRootIdentityCurrentSync(authority.context);
	const admitted = Object.freeze({
		authority,
		path: selected.path,
		relativePath: selected.relativePath
	});
	assertMissingParentMutationsAllowed(admitted);
	return admitted;
}
function assertFileLockSyncRootResolvedPathCurrent(pathAuthority) {
	if (!sameAbsolutePath(resolveBothPolicies(pathAuthority.authority, absoluteRootPath(pathAuthority.authority, pathAuthority.relativePath), pathAuthority.authority.context.rootReal).path, pathAuthority.path)) throw new FsSafeError("path-mismatch", "sidecar lock path changed during operation");
}
function assertMissingParentMutationsAllowed(pathAuthority) {
	const authority = pathAuthority.authority;
	const context = authority.context;
	const relativeParent = path.posix.dirname(pathAuthority.relativePath);
	const relative = relativeParent === "." ? "" : relativeParent;
	let current = context.rootReal;
	let missing = false;
	for (const segment of relative.split(path.posix.sep).filter(Boolean)) {
		current = path.join(current, segment);
		if (!missing) try {
			const stat = fs.lstatSync(pathForWindowsFilesystem(current), { bigint: true });
			if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			missing = true;
		}
		if (missing) assertFileLockSyncRootMutationAllowed(current, authority.denyMutations);
	}
}
function assertFileLockSyncRootPathsCurrent(paths) {
	const authority = paths[0]?.authority;
	for (const pathAuthority of paths) if (authority && pathAuthority.authority !== authority) throw new FsSafeError("path-mismatch", "sidecar paths use different Root authority");
	if (authority && invokeFileLockSyncRootMutationAuthority(authority)) {
		assertRootIdentityCurrentSync(authority.context);
		for (const pathAuthority of paths) {
			assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertMissingParentMutationsAllowed(pathAuthority);
		}
		assertRootIdentityCurrentSync(authority.context);
	}
}
function resolveTargetPathViaExistingAncestorSync(targetPath) {
	const normalized = resolvePathPreservingWindowsRoot(targetPath);
	const canonicalize = process.platform === "win32" ? realpathSync$1.native : realpathSync$1;
	let cursor = normalized;
	let canonicalAncestor;
	while (true) {
		try {
			fs.lstatSync(pathForWindowsFilesystem(cursor));
			try {
				canonicalAncestor = canonicalize(pathForWindowsFilesystem(cursor));
				break;
			} catch (error) {
				if (!isNotFoundPathError(error)) throw error;
			}
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) {
			canonicalAncestor = canonicalize(pathForWindowsFilesystem(cursor));
			break;
		}
		cursor = parent;
	}
	assertNoWindowsPathAlias(canonicalAncestor, "filesystem", "file-lock target ancestor uses a Windows filesystem namespace alias");
	return resolvePathPreservingWindowsRoot(cursor === normalized ? canonicalAncestor : path.resolve(canonicalAncestor, `.${path.sep}${normalized.slice(cursor.length)}`));
}
function normalizeFileLockSyncTargetWithRoot(authority, resolvedTargetPath) {
	assertNoNulPathInput(resolvedTargetPath, "file-lock target contains a NUL byte");
	assertNoWindowsPathAlias(resolvedTargetPath, "filesystem", "file-lock target uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	const normalized = process.platform === "win32" ? resolveTargetPathViaExistingAncestorSync(resolvedTargetPath) : path.join(resolveTargetPathViaExistingAncestorSync(path.dirname(resolvedTargetPath)), path.basename(resolvedTargetPath));
	assertNoWindowsPathAlias(normalized, "filesystem", "file-lock target uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	return normalized;
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
				exactIdentity: exactFileIdentity$1(identity)
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
			exactIdentity: exactFileIdentity$1(identity)
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
			exactIdentity: exactFileIdentity$1(identity),
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
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/lock-config.js
let lockConfig = { staleRecovery: "fail-closed" };
function getFsSafeLockConfig() {
	return {
		...lockConfig,
		retry: lockConfig.retry ? { ...lockConfig.retry } : void 0
	};
}
//#endregion
//#region src/state/artifact-preserving-state-reads.ts
const artifactPreservingReads = resolveGlobalSingleton(Symbol.for("openclaw.artifactPreservingStateReads"), () => new AsyncLocalStorage());
function withArtifactPreservingStateReads(operation, options = {}) {
	if (isArtifactPreservingStateRead("agent")) return operation();
	const scope = {
		agentDatabases: options.agentDatabases === true,
		readers: /* @__PURE__ */ new Set(),
		privateRoots: /* @__PURE__ */ new Set()
	};
	const finish = (value, errors = []) => {
		for (const close of scope.readers) try {
			close();
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Artifact-preserving inspection and cleanup failed.");
		return value;
	};
	let result;
	try {
		result = artifactPreservingReads.run(scope, operation);
	} catch (error) {
		return finish(void 0, [error]);
	}
	return isPromiseLike$1(result) ? Promise.resolve(result).then(finish, (error) => finish(void 0, [error])) : finish(result);
}
function isArtifactPreservingStateRead(kind = "shared", pathname) {
	const scope = artifactPreservingReads.getStore();
	return Boolean(scope && (kind === "shared" || scope.agentDatabases) && (!pathname || ![...scope.privateRoots].some((root) => isPathInside(root, pathname))));
}
//#endregion
//#region src/infra/json-field-transfer.ts
const JSON_FIELD_TRANSFER_BYTES = 65536;
const STRING_CHARS = 8192;
function* jsonFieldBatches(value) {
	let batch = [];
	let bytes = 16;
	for (const field of fields(value)) {
		const size = serialize(field).byteLength + 16;
		if (bytes + size > 65536) {
			yield batch;
			batch = [];
			bytes = 16;
		}
		batch.push(field);
		bytes += size;
	}
	if (batch.length) yield batch;
}
function* textFields(kind, value) {
	yield {
		kind,
		value: value.slice(0, STRING_CHARS)
	};
	for (let offset = STRING_CHARS; offset < value.length; offset += STRING_CHARS) yield {
		kind,
		value: value.slice(offset, offset + STRING_CHARS),
		append: true
	};
}
function* fields(value) {
	if (value === void 0) return;
	if (typeof value === "string") yield* textFields("value", value);
	else if (value === null || typeof value === "boolean" || typeof value === "number") yield {
		kind: "value",
		value: typeof value === "number" && !Number.isFinite(value) ? null : value
	};
	else if (typeof value === "object") {
		yield { kind: Array.isArray(value) ? "array" : "object" };
		for (const [key, child] of Object.entries(value)) if (child !== void 0) {
			yield* textFields("key", key);
			yield* fields(child);
		}
		yield { kind: "end" };
	} else throw new TypeError(`JSON document contains non-JSON value: ${typeof value}`);
}
function isJsonTransferField(field) {
	if (!isRecord$1(field)) return false;
	if (field.kind === "object" || field.kind === "array" || field.kind === "end") return true;
	return (field.kind === "key" || field.kind === "value") && (field.append === void 0 || field.append === true && typeof field.value === "string") && (typeof field.value === "string" || field.kind === "value" && (field.value === null || typeof field.value === "boolean" || typeof field.value === "number"));
}
function createJsonFieldReceiver() {
	let root;
	let hasRoot = false;
	const stack = [];
	let pending;
	const write = (value) => {
		const parent = stack.at(-1);
		if (parent) {
			if (parent.key === void 0) throw new Error("JSON field has no property key");
			Object.defineProperty(parent.container, parent.key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
			parent.key = void 0;
		} else {
			if (hasRoot) throw new Error("JSON transfer has more than one root");
			root = value;
			hasRoot = true;
		}
	};
	const flush = () => {
		if (!pending) return;
		const value = pending.chunks.join("");
		if (pending.kind === "key") {
			const parent = stack.at(-1);
			if (!parent || parent.key !== void 0) throw new Error("JSON property key has no value or container");
			parent.key = value;
		} else write(value);
		pending = void 0;
	};
	return {
		accept(field) {
			if (!isJsonTransferField(field)) throw new Error("Invalid JSON transfer field");
			if (field.kind === "key" || field.kind === "value") {
				if (field.append) {
					if (!pending || pending.kind !== field.kind || typeof field.value !== "string") throw new Error("Invalid JSON string continuation");
					pending.chunks.push(field.value);
					return;
				}
				flush();
				if (typeof field.value === "string") pending = {
					kind: field.kind,
					chunks: [field.value]
				};
				else write(field.value);
			} else {
				flush();
				if (field.kind === "end") {
					const parent = stack.pop();
					if (!parent || parent.key !== void 0) throw new Error("JSON container ended with an incomplete field");
				} else {
					const container = field.kind === "array" ? [] : {};
					write(container);
					stack.push({ container });
				}
			}
		},
		finish() {
			flush();
			if (stack.length) throw new Error("JSON transfer ended with an incomplete container");
			return root;
		}
	};
}
//#endregion
//#region src/infra/private-directory-creation.ts
const refusedCreations = /* @__PURE__ */ new WeakSet();
/** Record a completed native refusal without replacing its semantic code, diagnostics, or identity. */
function markPrivateDirectoryCreationRefused(error) {
	if (error !== null && typeof error === "object") refusedCreations.add(error);
	return error;
}
function isPrivateDirectoryCreationRefused(error) {
	return error !== null && typeof error === "object" && refusedCreations.has(error);
}
//#endregion
//#region src/infra/sqlite-readonly-auth-schema.ts
/** Project live owner facts; never retain a closed database's schema in the child. */
function captureSqliteAuthSchema(pathname, expectedIdentity) {
	if (getSqliteDatabaseAdmissionIdentityForPath(pathname)?.key !== expectedIdentity) return;
	const schema = getOrLoadSqliteDatabaseAdmissionForPath(pathname, schemaAdmission, () => void 0);
	if (!schema) return;
	const kind = (name) => schema.tables.has(name) ? "table" : schema.views.has(name) || schema.indexes.has(name) || schema.triggers.has(name) ? "other" : "missing";
	return {
		userVersion: schema.userVersion,
		store: kind("auth_profile_store"),
		state: kind("auth_profile_state")
	};
}
function readSqliteAuthSchema(value) {
	if (value === void 0) return;
	const isKind = (kind) => kind === "table" || kind === "other" || kind === "missing";
	if (!isRecord$1(value) || typeof value.userVersion !== "number" || !Number.isSafeInteger(value.userVersion) || value.userVersion < 0 || !isKind(value.store) || !isKind(value.state)) throw new Error("Invalid auth profile schema projection");
	return {
		userVersion: value.userVersion,
		store: value.store,
		state: value.state
	};
}
//#endregion
//#region src/infra/sqlite-worker-transfer.ts
const SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
/** One owned result cursor; callers supply records and any associated cleanup. */
function createSqliteWorkerTransferOwner() {
	let nextId = 0;
	let current;
	const cleanup = (transfer) => {
		const errors = [];
		for (const [completed, close] of [["iteratorClosed", () => transfer.iterator.return?.()], ["cleaned", () => transfer.cleanup?.()]]) if (!transfer[completed]) try {
			close();
			transfer[completed] = true;
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "SQLite read transfer cleanup failed");
	};
	const cancel = () => {
		if (current) {
			cleanup(current);
			current = void 0;
		}
	};
	const requireTransfer = (id) => {
		if (!current || current.id !== id) throw new Error("SQLite read transfer is no longer active");
		return current;
	};
	return {
		start(iterator, options) {
			if (current) throw new Error("The preceding SQLite read transfer was not released");
			current = {
				id: ++nextId,
				iterator,
				cleanup: options.cleanup,
				iteratorClosed: false,
				cleaned: false,
				counts: new Map(options.kinds.map((kind) => [kind, 0])),
				sequence: 0,
				finished: false
			};
			return {
				id: current.id,
				kinds: [...current.counts.keys()]
			};
		},
		next(id) {
			const transfer = requireTransfer(id);
			if (transfer.finished) throw new Error("SQLite read transfer has already reached its end");
			if (transfer.record && transfer.record.offset === transfer.record.bytes.byteLength) transfer.record = void 0;
			if (!transfer.record) {
				const next = transfer.iterator.next();
				if (next.done) {
					cleanup(transfer);
					transfer.finished = true;
					return {
						id,
						sequence: transfer.sequence++,
						done: true,
						counts: [...transfer.counts]
					};
				}
				const { kind } = next.value;
				const count = transfer.counts.get(kind);
				if (count === void 0) throw new Error("SQLite read transfer returned an unexpected record kind");
				transfer.record = {
					kind,
					bytes: "serialized" in next.value ? next.value.serialized : serialize(next.value.value),
					offset: 0
				};
				transfer.counts.set(kind, count + 1);
			}
			const record = transfer.record;
			const offset = record.offset;
			const end = Math.min(record.bytes.byteLength, offset + SQLITE_WORKER_TRANSFER_FRAME_BYTES);
			record.offset = end;
			return {
				id,
				sequence: transfer.sequence++,
				done: false,
				kind: record.kind,
				recordBytes: record.bytes.byteLength,
				offset,
				recordDone: end === record.bytes.byteLength,
				bytes: new Uint8Array(record.bytes.subarray(offset, end))
			};
		},
		end(id) {
			if (!requireTransfer(id).finished) throw new Error("SQLite read transfer ended before its complete result");
			cancel();
		},
		cancel,
		close: cancel
	};
}
/** Reassembles one transfer; its caller owns transport completion and cancellation. */
function createSqliteWorkerTransferReceiver(handle, consume) {
	const counts = new Map(handle.kinds.map((kind) => [kind, 0]));
	let sequence = 0;
	let finished = false;
	let record;
	return { accept(frame) {
		try {
			if (finished || frame.id !== handle.id || frame.sequence !== sequence++) throw new Error("SQLite read transfer frame is out of order");
			if (frame.done) {
				if (record || frame.counts.length !== counts.size || frame.counts.some(([kind, count]) => counts.get(kind) !== count) || new Set(frame.counts.map(([kind]) => kind)).size !== counts.size) throw new Error("SQLite read transfer ended with an incomplete result");
				finished = true;
				return frame.counts;
			}
			const count = counts.get(frame.kind);
			if (count === void 0 || !Number.isSafeInteger(frame.recordBytes) || frame.recordBytes < 1 || !Number.isSafeInteger(frame.offset) || frame.offset < 0 || frame.bytes.byteLength < 1 || frame.bytes.byteLength > 8388608) throw new Error("SQLite read transfer returned an invalid frame");
			if (!record) {
				if (frame.offset !== 0) throw new Error("SQLite read transfer omitted the start of a record");
				record = {
					kind: frame.kind,
					bytes: new Uint8Array(frame.recordBytes),
					offset: 0
				};
			}
			const end = frame.offset + frame.bytes.byteLength;
			if (record.kind !== frame.kind || record.bytes.byteLength !== frame.recordBytes || record.offset !== frame.offset || end > frame.recordBytes || frame.recordDone !== (end === frame.recordBytes)) throw new Error("SQLite read transfer returned a discontinuous record");
			record.bytes.set(frame.bytes, frame.offset);
			record.offset = end;
			if (frame.recordDone) {
				const value = deserialize(record.bytes);
				const kind = record.kind;
				record = void 0;
				consume({
					kind,
					value
				});
				counts.set(kind, count + 1);
			}
			return;
		} catch (error) {
			record = void 0;
			finished = true;
			throw error;
		}
	} };
}
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
/** JSON IPC carries only one bounded byte frame; aggregate records retain the transfer contract. */
function encodeSqliteAuthTransferFrame(frame) {
	return frame.done ? frame : {
		...frame,
		bytes: Buffer.from(frame.bytes.buffer, frame.bytes.byteOffset, frame.bytes.byteLength).toString("base64")
	};
}
function decodeFrame(value, label) {
	if (!isRecord$1(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence)) throw new Error(`Invalid ${label} transfer frame`);
	const { id, sequence } = value;
	if (value.done === true && Array.isArray(value.counts)) {
		const counts = [];
		for (const entry of value.counts) {
			if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "number" || !Number.isSafeInteger(entry[1]) || entry[1] < 0) throw new Error(`Invalid ${label} transfer counts`);
			counts.push([entry[0], entry[1]]);
		}
		return {
			id,
			sequence,
			done: true,
			counts
		};
	}
	if (value.done !== false || typeof value.kind !== "string" || typeof value.recordBytes !== "number" || typeof value.offset !== "number" || typeof value.recordDone !== "boolean" || typeof value.bytes !== "string" || value.bytes.length > 4 * Math.ceil(8388608 / 3)) throw new Error(`Invalid ${label} transfer bytes`);
	const bytes = Buffer.from(value.bytes, "base64");
	if (bytes.toString("base64") !== value.bytes) throw new Error(`Invalid ${label} transfer encoding`);
	return {
		id,
		sequence,
		done: false,
		kind: value.kind,
		recordBytes: value.recordBytes,
		offset: value.offset,
		recordDone: value.recordDone,
		bytes
	};
}
function createSqliteReadOnlyTransferReceiver(options) {
	let receiver;
	let transferId;
	let ending = false;
	let completed = false;
	return { accept(value) {
		if (!isRecord$1(value) || completed) throw new Error(`Invalid ${options.label} transfer response`);
		if (value.type === "start" && !receiver) {
			const handle = value.handle;
			if (!isRecord$1(handle) || typeof handle.id !== "number" || !Number.isSafeInteger(handle.id) || handle.id < 1 || !Array.isArray(handle.kinds) || handle.kinds.length !== options.kinds.length || handle.kinds.some((kind, index) => kind !== options.kinds[index])) throw new Error(`Invalid ${options.label} transfer handle`);
			transferId = handle.id;
			receiver = createSqliteWorkerTransferReceiver({
				id: transferId,
				kinds: options.kinds
			}, ({ kind, value: record }) => options.acceptRecord(kind, record));
			return { request: {
				type: "next",
				transferId
			} };
		}
		if (!receiver || transferId === void 0) throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer has not started`);
		if (value.type === "frame" && !ending) {
			const frame = decodeFrame(value.frame, options.label);
			if (!frame.done && options.maxRecordBytes && frame.recordBytes > options.maxRecordBytes) throw new Error(`${options.label} transfer record exceeds its bound`);
			const counts = receiver.accept(frame);
			if (counts) {
				if (counts.length !== options.kinds.length || counts.some(([, count]) => count < 1)) throw new Error(`Incomplete ${options.label} transfer result`);
				ending = true;
			}
			return { request: {
				type: ending ? "end" : "next",
				transferId
			} };
		}
		if (value.type === "complete" && ending) {
			completed = true;
			return { value: options.readResult() };
		}
		throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer response is out of order`);
	} };
}
function createSqliteAuthTransferReceiver() {
	const receiver = createJsonFieldReceiver();
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["fields"],
		label: "auth profile",
		maxRecordBytes: JSON_FIELD_TRANSFER_BYTES,
		acceptRecord(_kind, batch) {
			if (!Array.isArray(batch)) throw new Error("Invalid auth profile field batch");
			for (const field of batch) receiver.accept(field);
		},
		readResult() {
			const rows = receiver.finish();
			if (!isRecord$1(rows) || !("store" in rows) || !("state" in rows) || typeof rows.cacheable !== "boolean") throw new Error("Invalid auth profile transfer rows");
			return {
				store: rows.store,
				state: rows.state,
				cacheable: rows.cacheable
			};
		}
	});
}
function createSqliteOperationTransferReceiver(operation) {
	let result;
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["result"],
		label: "SQLite operation",
		acceptRecord(_kind, record) {
			if (result || !isRecord$1(record) || record.operation !== operation || !("value" in record)) throw new Error("SQLite read-only worker returned a different or duplicate operation");
			result = {
				operation,
				value: record.value
			};
		},
		readResult() {
			if (!result) throw new Error("SQLite read-only worker returned no operation");
			return result;
		}
	});
}
//#endregion
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
function driveRetainedOperation(source, advance, onError) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			advance(completion, serviceInContext);
		} catch (error) {
			try {
				completion.reject(onError ? onError(error) : error);
			} catch (combined) {
				completion.reject(combined);
			}
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	return driveRetainedOperation(source, (completion) => {
		source.service();
		const outcome = source.read();
		if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!child) {
			source.service();
			const outcome = source.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "rejected") throw outcome.error;
			child = next(outcome.value);
			child.result.then(service, service);
		}
		child.service();
		const outcome = child.read();
		if (outcome.status === "fulfilled") completion.resolve(outcome.value);
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Join the owner's real cleanup; that owner chooses how simultaneous failures combine. */
function finallyRetainedOperation(source, cleanup, combineErrors = (_source, cleanupError) => cleanupError) {
	let original;
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!original) {
			try {
				source.service();
				const outcome = source.read();
				if (outcome.status === "pending") return;
				original = outcome;
			} catch (error) {
				original = {
					status: "rejected",
					error
				};
			}
			child = cleanup(original);
			child.result.then(service, service);
		}
		if (!child) return;
		child.service();
		const outcome = child.read();
		if (outcome.status === "pending") return;
		if (outcome.status === "rejected") throw outcome.error;
		if (original.status === "rejected") completion.reject(original.error);
		else completion.resolve(original.value);
	}, (error) => original?.status === "rejected" ? combineErrors(original.error, error) : error);
}
//#endregion
//#region src/infra/sqlite-staging-token.ts
const SQLITE_STAGING_TOKEN_FILES = [
	"owner.sqlite",
	"owner.sqlite-journal",
	"owner.sqlite-wal",
	"owner.sqlite-shm"
];
var SqliteStagingRetiredError = class extends Error {
	constructor() {
		super("SQLite snapshot parent retired; aborting snapshot allocation");
	}
};
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fs.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fs.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	if (mode === "create" && !existing) fs.writeFileSync(location, "", {
		flag: "wx",
		mode: 420
	});
	const tokenExists = existing !== void 0 || mode === "create";
	const existingIdentity = tokenExists ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(tokenExists ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino) throw new Error("SQLite staging ownership changed before retirement");
		const currentToken = readIdentity(location, "file");
		if (tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord$1(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
		if (retiring) retireSqliteDatabaseAdmissionForPath(location);
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord$1(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
function releaseTokens(tokens) {
	const failures = [];
	for (const token of tokens) try {
		token();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(tokens.filter((token) => token !== options.token));
	if (!fs.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true) {
		const stat = fs.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) tokens.push(current === directory && options.token ? options.token.beginRetirement() : acquireSqliteSnapshotToken(current, "reclaim"));
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fs.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const child = inspect(location, cutoff, childLayout, lock);
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
/**
* Runtimes without qualified native close (stock Bun, every Windows Bun) can
* keep a private snapshot open after logical close. Call only after the read
* succeeded: EBUSY then leaves the directory registered for later cleanup.
*/
function deferSqliteSnapshotCleanupAfterRead(error, cleanupRoot) {
	if (getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources || !(error instanceof SqliteSnapshotCleanupError) || !hasNodeErrorCode(error.cause, "EBUSY")) return false;
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: cleanupRoot,
			errorCode: "EBUSY"
		}, "SQLite snapshot cleanup deferred until native SQLite resources are released.");
	} catch {}
	return true;
}
/** A failed result does not discharge the original request's native cleanup custody. */
function settleSqliteSnapshotRequest(request) {
	return request.result.catch(async (error) => {
		try {
			await request.startClose().result;
		} catch (cleanupError) {
			if (cleanupError === error) throw error;
			const combined = createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and cleanup failed", error);
			throw error instanceof SqliteSnapshotCleanupError ? new SqliteSnapshotCleanupError(error.message, { cause: combined }) : combined;
		}
		throw error;
	});
}
const cleanupState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotCleanup"), () => ({
	directories: /* @__PURE__ */ new Map(),
	activeWork: /* @__PURE__ */ new Map(),
	exitHandlerInstalled: false,
	pendingSignalCleanup: void 0,
	signalCleanup: cleanupSnapshotOperations
}));
const snapshotDirectories = cleanupState.directories;
const activeSnapshotWork = cleanupState.activeWork;
function snapshotDirectory(directory) {
	let owner = snapshotDirectories.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		snapshotDirectories.set(directory, owner);
	}
	return owner;
}
function completeSnapshotDirectoryRemoval(directory) {
	snapshotDirectories.delete(directory);
	return true;
}
function cleanupSnapshotOperations() {
	cleanupState.pendingSignalCleanup ??= (async () => {
		const directories = snapshotDirectories.entries();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const [directory] = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		cleanupState.pendingSignalCleanup = void 0;
	});
	return cleanupState.pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSnapshotCleanup();
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	registerSnapshotCleanup();
}
function registerSnapshotCleanup() {
	if (!cleanupState.exitHandlerInstalled) {
		cleanupState.exitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of snapshotDirectories.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupState.signalCleanup);
}
/** This owner joins token retirement and directory removal in its worker. */
function registerRetainedSnapshotTempDirectory(directory, release) {
	snapshotDirectory(directory).releaseRetained = release;
	registerSnapshotCleanup();
}
/** Rejection is not retirement: only the reader's successful close releases custody. */
function retainSnapshotTempDirectory(directory) {
	registerSnapshotTempDirectory(directory);
	const owner = snapshotDirectory(directory);
	if (owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot retirement has started");
	const reader = Symbol("sqlite.snapshot.reader");
	owner.readers.add(reader);
	return () => owner.readers.delete(reader);
}
/** A successful child hands its files to the caller's enclosing staging owner. */
function releaseSnapshotTempDirectory(directory) {
	const owner = snapshotDirectories.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	owner?.release?.(false);
	snapshotDirectories.delete(directory);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory, owner) {
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fs.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) {
		retireSqliteDatabaseAdmissionForPath(file);
		fs.rmSync(file, tempDirectoryRemovalOptions);
	}
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	try {
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fs.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	if (owner?.releaseRetained) {
		const removed = await startRemoveTempDirectory(tempDir, onFailure, owner).result;
		if (removed) snapshotDirectories.delete(tempDir);
		return removed;
	}
	try {
		assertSnapshotReadersRetired(owner);
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			for (const file of retirement?.payload ?? []) {
				retireSqliteDatabaseAdmissionForPath(file);
				await retainSnapshotWork(fs.promises.rm(file, tempDirectoryRemovalOptions));
			}
			if (retirement) {
				retirement.retire();
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			await retainSnapshotWork(fs.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function startRemoveTempDirectory(directory, onFailure, owner = snapshotDirectories.get(directory)) {
	if (owner?.retiringRetained) return owner.retiringRetained;
	let release;
	const retained = createRetainedOperation(() => {
		if (!release || retained.operation.read().status !== "pending") return;
		release.service();
		const outcome = release.read();
		if (outcome.status === "pending") return;
		if (owner) owner.retiringRetained = void 0;
		if (outcome.status === "rejected") {
			onFailure?.(outcome.error);
			retained.resolve(false);
		} else retained.resolve(completeSnapshotDirectoryRemoval(directory));
	});
	try {
		sealRetainedSnapshotTempDirectory(directory);
		if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
		owner.retiringRetained = retained.operation;
		release = owner.releaseRetained();
		release.result.then(() => retained.operation.service(), () => retained.operation.service());
		retained.operation.service();
	} catch (error) {
		if (owner) owner.retiringRetained = void 0;
		onFailure?.(error);
		retained.resolve(false);
	}
	return retained.operation;
}
/** A surviving native owner may retire bytes only after their original host readers leave. */
function sealRetainedSnapshotTempDirectory(directory, options) {
	const owner = snapshotDirectories.get(directory);
	if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
	if (options?.requireRequested && !owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot is still owned; cleanup has not been requested");
	assertSnapshotReadersRetired(owner);
	owner.retirementStarted = true;
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let retainedCleanup;
	let reported = false;
	let cleanupFailure;
	const reportFailure = (error) => {
		cleanupFailure = error;
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) {
			active = false;
			snapshotDirectories.delete(tempDir);
		} else if (requireCleanup) throw new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`, { cause: cleanupFailure });
		return removed;
	};
	const startCleanup = () => {
		if (retainedCleanup?.read().status === "pending") return retainedCleanup;
		if (!active) {
			const retained = createRetainedOperation(() => {});
			retained.resolve(complete(true));
			return retainedCleanup = retained.operation;
		}
		return retainedCleanup = mapRetainedOperation(startRemoveTempDirectory(tempDir, reportFailure), complete);
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending || retainedCleanup?.read().status === "pending") return requireCleanup ? complete(false) : false;
			if (!active) return complete(true);
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (snapshotDirectories.get(tempDir)?.releaseRetained || retainedCleanup) return startCleanup().result;
			if (pending) return pending;
			if (!active) return Promise.resolve(complete(true));
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		},
		startCleanup
	};
}
//#endregion
//#region src/infra/sqlite-backup.ts
async function backupNodeSqliteDatabase(source, targetPath, onProgress) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		const totalPages = await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath), { progress: onProgress });
		onProgress?.({
			totalPages,
			remainingPages: 0
		});
		return totalPages;
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/infra/fs-safe.ts
async function root(rootDir, defaults) {
	return await root$1(rootDir, defaults);
}
//#endregion
//#region src/infra/sqlite-file-copy.ts
/** Copy a physical SQLite file, not a coherent family. Its caller owns coherence and byte checks. */
async function copySqliteFile(sourcePath, targetPath, expectedIdentity, beforeByteCopy) {
	const sourceRoot = await root(path.dirname(sourcePath));
	const targetRoot = await root(path.dirname(targetPath));
	let published;
	const copy = (clone) => targetRoot.copyIn(path.basename(targetPath), {
		relativePath: path.basename(sourcePath),
		root: {
			stat: (relativePath) => sourceRoot.stat(relativePath),
			open: async (relativePath, options) => {
				const opened = await sourceRoot.open(relativePath, options);
				try {
					if (!sameFileIdentity(expectedIdentity, await opened.handle.stat({ bigint: true }))) throw new Error(`SQLite copy source changed: ${sourcePath}`);
					return opened;
				} catch (error) {
					await opened.handle.close();
					throw error;
				}
			}
		}
	}, {
		clone,
		...beforeByteCopy ? { maxBytes: Number(expectedIdentity.size) } : {},
		sourceHardlinks: "allow",
		overwrite: false,
		mode: 384,
		durable: true,
		onDestinationPublished: (receipt) => {
			published = receipt;
		}
	});
	if (beforeByteCopy) try {
		await copy("always");
	} catch (error) {
		if (published || !(error instanceof FsSafeError) || !(error.code === "unsupported-platform" || error.code === "helper-unavailable" && error.message === "native file cloning is unavailable")) throw error;
		await beforeByteCopy(Number(expectedIdentity.size));
		await copy("never");
	}
	else await copy("auto");
	if (!published) throw new Error(`SQLite copy was not published: ${targetPath}`);
	return published;
}
//#endregion
//#region src/infra/windows-private-directory.ts
function createPrivateWindowsDirectory(directoryPath) {
	let attempted = false;
	try {
		createDirectorySync(path.resolve(directoryPath), {
			private: true,
			assertBeforeMutation() {
				attempted = true;
			}
		});
	} catch (error) {
		if (!attempted || error instanceof FsSafeError && error.code === "already-exists") throw markPrivateDirectoryCreationRefused(error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const updateTmp = env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? env.TMPDIR?.trim() : void 0;
	if (updateTmp && path.isAbsolute(updateTmp)) return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(updateTmp, "openclaw"),
		tmpdir: () => updateTmp
	});
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") try {
		return fs.mkdtempSync(path.join(rootPath, prefix));
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
function assertEngineStoreExecutionAllowed() {
	if (threadId === 0 && true) throw new Error("PostgreSQL connections must run in a worker; only synchronous admission and migrations may run on the main thread");
}
//#endregion
//#region src/infra/database-engine/postgres-catalog.ts
function canonical(value) {
	return JSON.stringify(value, (_key, item) => item !== null && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).toSorted(([a], [b]) => a.localeCompare(b, "en"))) : item);
}
function assertPostgresCatalog(actual, expected) {
	if (!isDeepStrictEqual(actual.map(canonical).toSorted(), expected.map(canonical).toSorted())) throw new Error("PostgreSQL catalog differs from its generated contract; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
}
function readPostgresCatalog(value) {
	if (!Array.isArray(value) || !value.every((item) => item !== null && typeof item === "object" && typeof item.table === "string" && typeof item.kind === "string" && "value" in item)) throw new Error("PostgreSQL did not return catalog facts");
	return value;
}
/** One statement gives every catalog fact the same PostgreSQL MVCC snapshot. */
function postgresCatalogQuery(namespace, includeDefinitions = false) {
	const literal = `'${namespace.replaceAll("'", "''")}'`;
	const columns = (relation, keys) => `(SELECT jsonb_agg(a.attname ORDER BY k.ordinality) FROM unnest(${keys}) WITH ORDINALITY k(num, ordinality) JOIN pg_catalog.pg_attribute a ON a.attrelid = ${relation} AND a.attnum = k.num)`;
	const action = (field) => `CASE ${field} WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END`;
	return `WITH relations AS (
    SELECT c.oid, c.relname FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = ${literal} AND c.relkind IN ('r', 'p')
  ), facts AS (
    SELECT r.relname AS "table", 'table' AS kind, 'null'::jsonb AS value FROM relations r
    UNION ALL SELECT r.relname, 'column', jsonb_build_object(
      'name', a.attname, 'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
      'nullable', NOT a.attnotnull, 'identity', a.attidentity = 'd', 'position', a.attnum,
      'default', regexp_replace(pg_catalog.pg_get_expr(d.adbin, d.adrelid), '::(text|bigint|double precision)$', ''))
      FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum WHERE a.attnum > 0 AND NOT a.attisdropped
    UNION ALL SELECT r.relname, CASE c.contype WHEN 'p' THEN 'primaryKey' ELSE 'unique' END,
      ${columns("r.oid", "c.conkey")} FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid WHERE c.contype IN ('p', 'u')
    UNION ALL SELECT r.relname, 'foreignKey', jsonb_build_object(
      'columns', ${columns("r.oid", "c.conkey")}, 'target', target.relname,
      'targetColumns', ${columns("c.confrelid", "c.confkey")},
      'onUpdate', ${action("c.confupdtype")}, 'onDelete', ${action("c.confdeltype")},
      'deferrable', c.condeferrable, 'deferred', c.condeferred)
      FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
      JOIN pg_catalog.pg_class target ON target.oid = c.confrelid WHERE c.contype = 'f'
    UNION ALL SELECT r.relname, 'indexes', to_jsonb((SELECT count(*) FROM pg_catalog.pg_index i WHERE i.indrelid = r.oid)) FROM relations r
    UNION ALL SELECT r.relname, 'checks', to_jsonb((SELECT count(*) FROM pg_catalog.pg_constraint c WHERE c.conrelid = r.oid AND c.contype = 'c')) FROM relations r
    ${includeDefinitions ? `UNION ALL SELECT r.relname, 'constraintDefinition', jsonb_build_object('name', c.conname, 'definition', pg_catalog.pg_get_constraintdef(c.oid)) FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
    UNION ALL SELECT r.relname, 'indexDefinition', jsonb_build_object('name', c.relname, 'definition', pg_catalog.pg_get_indexdef(i.indexrelid), 'valid', i.indisvalid) FROM relations r JOIN pg_catalog.pg_index i ON i.indrelid = r.oid JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid
    UNION ALL SELECT r.relname, 'columnDefinition', jsonb_build_object('name', a.attname, 'default', pg_catalog.pg_get_expr(d.adbin, d.adrelid), 'generated', a.attgenerated, 'identity', a.attidentity, 'collation', a.attcollation::regcollation::text) FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum WHERE a.attnum > 0 AND NOT a.attisdropped
    UNION ALL SELECT r.relname, 'triggerDefinition', jsonb_build_object('name', t.tgname, 'definition', pg_catalog.pg_get_triggerdef(t.oid), 'enabled', t.tgenabled, 'function', pg_catalog.pg_get_functiondef(t.tgfoid)) FROM relations r JOIN pg_catalog.pg_trigger t ON t.tgrelid = r.oid WHERE NOT t.tgisinternal
    UNION ALL SELECT c.relname, 'viewDefinition', to_jsonb(pg_catalog.pg_get_viewdef(c.oid)) FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = ${literal} AND c.relkind IN ('v', 'm')` : ""}
  ) SELECT coalesce(jsonb_agg(facts), '[]'::jsonb) AS catalog FROM facts`;
}
//#endregion
//#region src/infra/database-engine/postgres-schema.ts
const postgresSchemaMetadataSql = `CREATE TABLE openclaw_schema_meta (
  store TEXT PRIMARY KEY, version BIGINT NOT NULL, store_id TEXT NOT NULL,
  fingerprint TEXT, ddl_hash TEXT, server_major BIGINT)`;
const recovery$1 = "Use a compatible OpenClaw binary or restore the matching PostgreSQL schema and anchor; do not edit schema metadata.";
const quote = (name) => `"${name.replaceAll("\"", "\"\"")}"`;
const hash$1 = (text) => createHash("sha256").update(text).digest("hex");
const capabilities = /* @__PURE__ */ new WeakMap();
function admitPostgresCapabilities(db) {
	const retained = capabilities.get(db);
	if (retained) return retained;
	const row = db.prepare("SELECT current_setting('server_version_num')::int AS version, current_setting('server_encoding') AS server_encoding, current_setting('client_encoding') AS client_encoding").get();
	if (!row || typeof row.version !== "number" || row.version < 16e4 || row.server_encoding !== "UTF8" || row.client_encoding !== "UTF8") throw new Error("PostgreSQL requires version 16 or newer and UTF8 server/client encoding; upgrade the server or port to a UTF8 database and set client_encoding=UTF8.");
	const facts = {
		serverMajor: Math.floor(row.version / 1e4),
		serverEncoding: "UTF8",
		clientEncoding: "UTF8"
	};
	capabilities.set(db, facts);
	return facts;
}
function readPostgresSchema(db, namespace, store) {
	const row = db.query(`WITH captured AS (${postgresCatalogQuery(namespace, true)})
    SELECT catalog::text, to_jsonb(meta)::text AS metadata FROM captured
    CROSS JOIN ${quote(namespace)}.openclaw_schema_meta meta WHERE meta.store = ?`, [store]).rows[0];
	if (!row || typeof row.catalog !== "string" || typeof row.metadata !== "string") throw new Error(`Missing PostgreSQL catalog or metadata. ${recovery$1}`);
	const metadata = JSON.parse(row.metadata);
	return {
		catalog: readPostgresCatalog(JSON.parse(row.catalog)),
		metadata
	};
}
function postgresSchemaFingerprint(catalog, scratch) {
	const text = catalog.filter((fact) => fact.table !== "openclaw_schema_meta").map((fact) => JSON.stringify(fact)).toSorted().join("\n");
	return hash$1(scratch ? text.replaceAll(scratch.from, scratch.to) : text);
}
function postgresSchemaSql(schema, catalog) {
	const tables = new Set(catalog?.filter((fact) => fact.kind === "table").map((fact) => fact.table));
	const active = schema.postgresFragments?.filter((fragment) => catalog ? fragment.tables.some((table) => tables.has(table)) : fragment.activation === "version-additive") ?? [];
	const ordered = /* @__PURE__ */ new Map();
	const add = (fragment) => {
		if (ordered.has(fragment.id)) return;
		for (const id of fragment.dependencies) {
			const dependency = schema.postgresFragments?.find((item) => item.id === id);
			if (!dependency) throw new Error(`Missing PostgreSQL fragment dependency ${id}`);
			add(dependency);
		}
		ordered.set(fragment.id, fragment.sql);
	};
	active.forEach(add);
	return [schema.postgres ?? "", ...ordered.values()].join("\n");
}
function recordPostgresSchema(db, namespace, schema, snapshot) {
	if (!db.isTransaction) throw new Error("PostgreSQL schema publication requires the owner's writer transaction");
	const captured = snapshot ?? readPostgresSchema(db, namespace, schema.id);
	db.prepare("UPDATE openclaw_schema_meta SET fingerprint = ?, ddl_hash = ?, server_major = ? WHERE store = ?").run(postgresSchemaFingerprint(captured.catalog), hash$1(postgresSchemaSql(schema, captured.catalog)), admitPostgresCapabilities(db).serverMajor, schema.id);
}
/** Rare upgrade/unsealed-pilot path: PostgreSQL deparses both sides on this server. */
function verifyPostgresSchema(db, namespace, schema, snapshot) {
	const fingerprint = postgresSchemaFingerprint(snapshot.catalog);
	const ddl = postgresSchemaSql(schema, snapshot.catalog);
	const { metadata } = snapshot;
	const major = admitPostgresCapabilities(db).serverMajor;
	if (metadata.server_major === major && metadata.fingerprint && metadata.fingerprint !== fingerprint) throw new Error(`PostgreSQL schema drift detected. ${recovery$1}`);
	if (metadata.ddl_hash && metadata.ddl_hash !== hash$1(ddl)) throw new Error(`PostgreSQL generated DDL hash mismatch. ${recovery$1}`);
	if (metadata.server_major === major && metadata.fingerprint && metadata.ddl_hash) return;
	verifyAndRecordPostgresSchema(db, namespace, schema, snapshot);
}
/** Migrations and major upgrades validate the destination before publishing its seal. */
function verifyAndRecordPostgresSchema(db, namespace, schema, snapshot = readPostgresSchema(db, namespace, schema.id)) {
	const fingerprint = postgresSchemaFingerprint(snapshot.catalog);
	const ddl = postgresSchemaSql(schema, snapshot.catalog);
	const scratch = `openclaw_check_${randomUUID().replaceAll("-", "")}`;
	db.runTransaction(() => {
		db.exec(`CREATE SCHEMA ${quote(scratch)}`);
		try {
			db.exec(`SET LOCAL search_path TO ${quote(scratch)}`);
			db.exec(ddl);
			const row = db.query(`SELECT catalog::text FROM (${postgresCatalogQuery(scratch, true)}) captured`).rows[0];
			if (postgresSchemaFingerprint(readPostgresCatalog(JSON.parse(String(row?.catalog))), {
				from: scratch,
				to: namespace
			}) !== fingerprint) throw new Error(`PostgreSQL schema drift detected against generated DDL. ${recovery$1}`);
		} finally {
			db.exec(`SET LOCAL search_path TO ${quote(namespace)}`);
			db.exec(`DROP SCHEMA ${quote(scratch)} CASCADE`);
		}
		if (!snapshot.metadata.ddl_hash) db.exec("ALTER TABLE openclaw_schema_meta ADD COLUMN IF NOT EXISTS fingerprint TEXT, ADD COLUMN IF NOT EXISTS ddl_hash TEXT, ADD COLUMN IF NOT EXISTS server_major BIGINT");
		recordPostgresSchema(db, namespace, schema, snapshot);
	});
}
//#endregion
//#region src/infra/database-engine/physical-facts.ts
const recovery = "Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.";
const admissionKey = {
	name: "database.engine.schema",
	schemaDependent: true,
	read(value) {
		if (value && typeof value === "object" && "engine" in value && value.engine === "postgres" && "admissionId" in value && typeof value.admissionId === "string" && "store" in value && typeof value.store === "string" && "namespace" in value && typeof value.namespace === "string" && "storeId" in value && typeof value.storeId === "string" && "version" in value && typeof value.version === "number" && "capabilities" in value && value.capabilities !== null && typeof value.capabilities === "object" && "serverMajor" in value.capabilities && typeof value.capabilities.serverMajor === "number" && value.capabilities.serverMajor >= 16 && "serverEncoding" in value.capabilities && value.capabilities.serverEncoding === "UTF8" && "clientEncoding" in value.capabilities && value.capabilities.clientEncoding === "UTF8" && "catalog" in value) return {
			engine: "postgres",
			admissionId: value.admissionId,
			store: value.store,
			namespace: value.namespace,
			storeId: value.storeId,
			version: value.version,
			capabilities: {
				serverMajor: value.capabilities.serverMajor,
				serverEncoding: "UTF8",
				clientEncoding: "UTF8"
			},
			catalog: readPostgresCatalog(value.catalog)
		};
	}
};
function getPostgresPhysicalFacts(db) {
	return getSqliteDatabaseAdmission(db, admissionKey);
}
/** The anchor carries PG admission facts without treating its native catalog as application data. */
function admitPostgresPhysicalFacts(params) {
	const retained = getPostgresPhysicalFacts(params.db);
	if (retained) {
		if (retained.store !== params.store || retained.namespace !== params.namespace || retained.storeId !== params.storeId || retained.version !== params.version) throw new Error(`PostgreSQL admission identity or version mismatch. ${recovery}`);
		return retained;
	}
	assertEngineStoreExecutionAllowed();
	const capabilities = admitPostgresCapabilities(params.db);
	let snapshot;
	try {
		snapshot = readPostgresSchema(params.db, params.namespace, params.store);
	} catch (error) {
		throw new Error(`Cannot read PostgreSQL catalog or metadata. ${recovery}`, { cause: error });
	}
	const { metadata: row, catalog } = snapshot;
	if (row.version !== params.version || row.store_id !== params.storeId) throw new Error(`PostgreSQL metadata identity or version mismatch. ${recovery}`);
	if (params.schema) {
		if (params.recordSchema) recordPostgresSchema(params.db, params.namespace, params.schema, snapshot);
		else verifyPostgresSchema(params.db, params.namespace, params.schema, snapshot);
	}
	if (params.expected) assertPostgresCatalog(catalog.filter((fact) => !fact.kind.endsWith("Definition") && fact.table !== "openclaw_schema_meta"), params.expected);
	const facts = {
		engine: "postgres",
		admissionId: randomUUID(),
		store: params.store,
		namespace: params.namespace,
		storeId: row.store_id,
		version: row.version,
		capabilities,
		catalog
	};
	publishSqliteDatabaseAdmission(params.db, admissionKey, facts);
	return facts;
}
function requireNativeDatabaseFile(engine, operation) {
	if (engine === "postgres") throw new Error(`PostgreSQL cannot use SQLite ${operation}; stop the Gateway and back up/restore the PostgreSQL schema with its matching anchor (P3-6 export support pending).`);
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
/** A completed inspection proved schema drift; native read failures retain their own type. */
var SqliteSchemaMismatchError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SqliteSchemaMismatchError";
	}
};
const ISSUE_DESCRIPTIONS = {
	"missing-table": "missing table",
	"missing-column": "column definitions differ for",
	"unexpected-column": "column definitions differ for",
	"column-definition-drift": "column definitions differ for",
	"table-constraint-drift": "table constraints differ for",
	"table-definition-drift": "table definition differs for",
	"missing-or-drifted-index": "missing or drifted index",
	"unexpected-unique-index": "unexpected unique index",
	"missing-or-drifted-trigger": "missing or drifted trigger",
	"unexpected-trigger": "unexpected trigger",
	"virtual-table-definition-drift": "virtual table definition differs for",
	"table-options-drift": "table options differ for"
};
function isColumnIssue(code) {
	return code === "column-definition-drift" || code === "missing-column" || code === "unexpected-column";
}
function defaultIssueMessage(code, objectName) {
	if (!Object.hasOwn(ISSUE_DESCRIPTIONS, code)) throw new Error("Unsupported SQLite schema issue code", { cause: code });
	const target = isColumnIssue(code) ? objectName.split(".", 1)[0] : objectName;
	return `${ISSUE_DESCRIPTIONS[code]} ${target}`;
}
function createSqliteSchemaIssue(code, objectName, message) {
	return {
		code,
		objectName,
		message: message ?? defaultIssueMessage(code, objectName)
	};
}
function legacySqliteSchemaIssueMessages(issues) {
	const columnIssueTables = new Set(issues.filter((issue) => isColumnIssue(issue.code)).map((issue) => issue.objectName.split(".", 1)[0]));
	return [...new Set(issues.filter((issue) => issue.code !== "table-constraint-drift" || !columnIssueTables.has(issue.objectName)).map((issue) => issue.message))];
}
function throwSqliteSchemaMismatches(databaseLabel, mismatches) {
	const shown = mismatches.slice(0, 8);
	if (mismatches.length > shown.length) shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
	throw new SqliteSchemaMismatchError(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}; run openclaw doctor --fix to repair it.`);
}
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
const tableColumns = /* @__PURE__ */ new WeakMap();
function tableHasColumn(db, tableName, columnName) {
	return readTableColumns(db, tableName).has(columnName);
}
function readTableColumns(db, tableName) {
	if (isPostgresSqlConnection(db)) return new Set(getPostgresPhysicalFacts(db)?.catalog.flatMap((fact) => fact.table === tableName && fact.kind === "column" && fact.value && typeof fact.value === "object" && "name" in fact.value && typeof fact.value.name === "string" ? [fact.value.name] : []) ?? []);
	const schema = getAdmittedSqliteSchemaFacts(db);
	const sql = schema?.tableSql.get(tableName);
	if (schema && !sql && ![...schema.tables, ...schema.views].some((name) => name.toLowerCase() === tableName.toLowerCase())) return /* @__PURE__ */ new Set();
	if (schema && sql && /^CREATE TABLE\b/iu.test(sql) && !/\bAS\b/iu.test(sql)) {
		let tables = tableColumns.get(schema);
		const retained = tables?.get(tableName);
		if (retained) return retained;
		const definition = parseSqliteTableDefinition(sql, tableName);
		if ([...definition.columns.values()].every((column) => /^[a-z_][a-z0-9_]*$/u.test(readSqlToken(column, 0)?.raw ?? ""))) {
			const columns = new Set(definition.columns.keys());
			if (!tables) {
				tables = /* @__PURE__ */ new Map();
				tableColumns.set(schema, tables);
			}
			tables.set(tableName, columns);
			return columns;
		}
	}
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
/** Inspect only failed queries; native unavailability must not become a schema refusal. */
function classifySqliteTableReadError(db, tableName, columnNames, error) {
	if (isPostgresSqlConnection(db)) return error;
	if (sqlitePrimaryResultCode(error) !== 1) return error;
	try {
		const existing = readTableColumns(db, tableName);
		if (existing.size > 0 && columnNames.some((column) => !existing.has(column))) return new SqliteSchemaMismatchError(`SQLite table ${tableName} is missing required columns; run openclaw doctor --fix to repair it.`, { cause: error });
	} catch {}
	return error;
}
function tablePrimaryKeyColumns(db, tableName) {
	if (isPostgresSqlConnection(db)) {
		const value = getPostgresPhysicalFacts(db)?.catalog.find((fact) => fact.table === tableName && fact.kind === "primaryKey")?.value;
		return Array.isArray(value) ? value.filter((column) => typeof column === "string") : [];
	}
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	if (isPostgresSqlConnection(db)) return getPostgresPhysicalFacts(db)?.catalog.some((fact) => fact.table === tableName && fact.kind === "table") ?? false;
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has(tableName);
	return executeWithCachedStatement(db, "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName))?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
//#endregion
//#region src/state/openclaw-agent-db-metadata.ts
const agentSchemaMetadataKey = {
	name: "agent.schema-metadata",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("agentId" in value) || value.agentId !== null && typeof value.agentId !== "string" || !("role" in value) || value.role !== null && typeof value.role !== "string" || !("schemaVersion" in value) || value.schemaVersion !== null && typeof value.schemaVersion !== "number") return;
		return {
			agentId: value.agentId,
			role: value.role,
			schemaVersion: value.schemaVersion
		};
	}
};
function schemaMetadataKey(admissionId) {
	return {
		name: `agent.schema-metadata:${admissionId}`,
		read: agentSchemaMetadataKey.read
	};
}
/** The metadata writer publishes its committed format facts without a readback. */
function publishAgentSchemaMetadata(db, metadata) {
	publishSqliteDatabaseAdmission(db, agentSchemaMetadataKey, metadata);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), metadata);
}
function readExistingAgentSchemaMeta(db, options) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	const historical = !options?.includeAppVersion && schema && getSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId));
	if (historical) return historical;
	const admitted = !options?.includeAppVersion && (!schema || getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) ? getSqliteDatabaseAdmission(db, agentSchemaMetadataKey) : void 0;
	if (admitted) {
		if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), admitted);
		return admitted;
	}
	if (!tableExists(db, "schema_meta")) return null;
	let row;
	try {
		row = db.prepare(options?.includeAppVersion ? "SELECT role, schema_version, agent_id, app_version FROM schema_meta WHERE meta_key = 'primary'" : "SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	} catch (error) {
		throw classifySqliteTableReadError(db, "schema_meta", [
			"meta_key",
			"role",
			"schema_version",
			"agent_id"
		], error);
	}
	if (!row) return null;
	const metadata = {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
	if (schema && getAdmittedSqliteSchemaFacts(db) === schema && getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) publishAgentSchemaMetadata(db, metadata);
	return options?.includeAppVersion ? {
		...metadata,
		appVersion: typeof row.app_version === "string" ? row.app_version : null
	} : metadata;
}
//#endregion
//#region src/state/openclaw-state-db-contract.ts
const DOCTOR_OWNED_STATE_TABLES = ["agent_deletion_journal"];
const FIRST_USE_STATE_TABLES = [
	"user_profile_identities",
	"user_background_images",
	"local_workspace_projections",
	"update_runs",
	"session_repository_workspaces",
	"github_repository_publication_requests",
	"github_publication_session_lifecycles",
	"skill_library_entries",
	"skill_library_revisions",
	"skill_library_events",
	"skill_library_uploads",
	"github_personal_publication_requests",
	"cron_job_runtime_authorities",
	"cron_run_trigger_state_retirements",
	"execution_identity_contexts",
	"mcp_oauth_pending_authorizations",
	"node_worker_launch_containers",
	"node_worker_launch_boots",
	"node_worker_launch_cleanup",
	"node_worker_launch_process_scopes",
	"node_worker_launches",
	"node_worker_prepared_workspaces",
	"node_worker_turns",
	"operator_approval_execution_identities",
	"operator_approval_standing_grants",
	"operator_approval_standing_grant_generations",
	"web_push_approval_deliveries",
	"execution_decision_facts",
	"execution_owner_lifecycle_bindings",
	"outbound_message_execution_bindings",
	"outbound_message_progress"
];
const FIRST_USE_STATE_INDEXES = [
	"idx_user_profile_identities_profile_id",
	"idx_user_profile_identities_authorization",
	"idx_update_runs_created",
	"idx_update_runs_active",
	"idx_github_repository_publication_shared_request",
	"idx_github_repository_publication_personal_request",
	"idx_github_personal_publication_owner_session",
	"idx_github_personal_publication_pending",
	"idx_node_worker_launches_terminal_completed",
	"idx_node_worker_turns_terminal_completed",
	"idx_node_worker_turns_active_owner",
	"idx_operator_approval_standing_grants_binding",
	"idx_web_push_approval_deliveries_subscription",
	"execution_identity_contexts_run_created_idx",
	"execution_decision_facts_cursor_id_idx",
	"execution_decision_facts_context_occurred_idx",
	"execution_decision_facts_run_occurred_idx",
	"outbound_message_execution_bindings_execution_event_idx",
	"outbound_message_progress_occurred_idx",
	"outbound_message_progress_run_occurred_idx"
];
const LAZY_ADDITIVE_STATE_TABLES = [
	...FIRST_USE_STATE_TABLES,
	"agent_provenance",
	"cron_run_receipts",
	"config_revision_keys",
	"secret_store_entries",
	"projects",
	"worktree_templates",
	"user_preferences",
	"device_pair_setup_completions",
	"github_publication_requests",
	"device_pairing_join_codes",
	"skill_workshop_changes",
	"worker_environment_ssh_fallback_ports",
	"worker_session_placement_moves"
];
const LAZY_ADDITIVE_STATE_INDEXES = [
	...FIRST_USE_STATE_INDEXES,
	"cron_run_receipts_cursor_id_idx",
	"idx_cron_run_receipts_active_job",
	"idx_cron_run_receipts_job_history",
	"idx_github_publication_requests_pending",
	"secret_store_entries_live_idx",
	"skill_workshop_changes_cursor_id_idx",
	"idx_skill_workshop_changes_agent_time"
];
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
/** User-facing guide for schema refusals; lives here so error sites avoid import cycles. */
const OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
//#endregion
//#region src/infra/sqlite-transaction.ts
const DEFAULT_SLOW_BUSY_WAIT_MS = 1e3;
const DEFAULT_SLOW_TRANSACTION_HOLD_MS = 1e3;
const abortedTransactionSymbol = Symbol.for("openclaw.sqliteAbortedTransaction");
function assertTransactionUsable(db) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		return;
	}
	const aborted = db[abortedTransactionSymbol];
	if (aborted) throw aborted.error;
}
const transactionLog = createSubsystemLogger("sqlite/transaction");
const writeAdmissionServices = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
const writeAdmissionLocations = /* @__PURE__ */ new WeakMap();
function writeAdmissionLocation(database) {
	const cached = writeAdmissionLocations.get(database);
	if (cached !== void 0) return cached;
	const location = database.location();
	const canonical = location === null ? null : normalizeDatabasePath(location);
	writeAdmissionLocations.set(database, canonical);
	return canonical;
}
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeDatabasePath))].map((location) => {
		const services = writeAdmissionServices.get(location) ?? /* @__PURE__ */ new Set();
		const retained = () => service();
		services.add(retained);
		writeAdmissionServices.set(location, services);
		return {
			location,
			services,
			retained
		};
	});
	return () => {
		for (const { location, services, retained } of registrations) {
			services.delete(retained);
			if (services.size === 0 && writeAdmissionServices.get(location) === services) writeAdmissionServices.delete(location);
		}
	};
}
function execNativeBegin(db, diagnostics) {
	const startedAt = Date.now();
	diagnostics.nativeAttempts += 1;
	try {
		db.exec("BEGIN IMMEDIATE");
	} finally {
		diagnostics.nativeMs += Date.now() - startedAt;
	}
}
function beginImmediateTransaction(db, diagnostics) {
	const location = writeAdmissionServices.size > 0 ? writeAdmissionLocation(db) : null;
	const services = location === null ? void 0 : writeAdmissionServices.get(location);
	if (!services) {
		execNativeBegin(db, diagnostics);
		return;
	}
	const deadline = performance.now() + readSqliteBusyTimeout(db);
	while (true) try {
		runWithSqliteBusyTimeout(db, Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))), () => execNativeBegin(db, diagnostics));
		return;
	} catch (error) {
		if (!isSqliteLockError(error) || performance.now() >= deadline) throw error;
		for (const service of services) {
			const startedAt = Date.now();
			diagnostics.serviceCalls += 1;
			try {
				service();
			} finally {
				diagnostics.serviceMs += Date.now() - startedAt;
			}
		}
		if (performance.now() >= deadline) throw error;
	}
}
function assertSyncTransactionResult(value) {
	if (isPromiseLike$1(value)) throw new Error("SQLite write transactions must be synchronous; Promise returns are not supported.");
}
function slowBusyWaitThresholdMs(options) {
	if (options?.busyTimeoutMs === void 0 || options.busyTimeoutMs <= 0) return DEFAULT_SLOW_BUSY_WAIT_MS;
	return Math.min(DEFAULT_SLOW_BUSY_WAIT_MS, options.busyTimeoutMs);
}
function transactionDiagnosticLabels(db, options) {
	let database = options?.databaseLabel;
	if (!database) try {
		database = db ? db.location() ?? ":memory:" : "unavailable";
	} catch {
		database = "unavailable";
	}
	return {
		database,
		operation: options?.operationLabel || captureSqliteReaderOwner()?.operation || "unlabeled",
		...options?.diagnosticContext ? { context: { ...options.diagnosticContext } } : {}
	};
}
function logSlowTransactionHold(params) {
	if (params.elapsedMs < (params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS)) return;
	(params.options?.logger ?? transactionLog).warn("slow SQLite transaction hold", {
		async: false,
		callbackKind: "application-transaction",
		...transactionDiagnosticLabels(params.db, params.options),
		elapsedMs: params.elapsedMs,
		phases: {
			prepareMs: params.prepareMs,
			beginMs: params.beginMs,
			sqlMs: Math.max(0, params.elapsedMs - params.hostAdmissionWaitMs - params.databaseAdmissionWaitMs - params.commitMs),
			hostAdmissionWaitMs: params.hostAdmissionWaitMs,
			databaseAdmissionWaitMs: params.databaseAdmissionWaitMs,
			commitMs: params.commitMs
		},
		isMainThread,
		mode: params.mode,
		pid: process.pid,
		threadId,
		thresholdMs: params.options?.slowTransactionHoldMs ?? DEFAULT_SLOW_TRANSACTION_HOLD_MS
	});
}
function logTransactionStep(params, failure) {
	try {
		if (!failure && params.elapsedMs < slowBusyWaitThresholdMs(params.options)) return;
		const sqliteErrcode = failure ? sqliteExtendedResultCode(failure.error) : void 0;
		const sqlitePrimaryCode = failure ? sqlitePrimaryResultCode(failure.error) : void 0;
		(params.options?.logger ?? transactionLog).warn(failure ? "SQLite transaction lock wait failed" : "slow SQLite transaction step", {
			async: false,
			...params.options?.busyTimeoutMs !== void 0 ? { busyTimeoutMs: params.options.busyTimeoutMs } : {},
			...transactionDiagnosticLabels(params.db, params.options),
			...failure ? { code: sqliteErrorCode(failure.error) } : {},
			elapsedMs: params.elapsedMs,
			...failure ? { failureKind: "lock-contention" } : {},
			isMainThread,
			pid: process.pid,
			...sqliteErrcode !== void 0 ? { sqliteErrcode } : {},
			...sqlitePrimaryCode !== void 0 ? { sqlitePrimaryCode } : {},
			step: params.step,
			threadId,
			...params.beginAdmission ? { beginAdmission: { ...params.beginAdmission } } : {}
		});
	} catch {}
}
function execTimedTransactionStep(params) {
	const startedAt = Date.now();
	const beginAdmission = params.sql === "BEGIN IMMEDIATE" ? {
		nativeAttempts: 0,
		nativeMs: 0,
		serviceCalls: 0,
		serviceMs: 0
	} : void 0;
	try {
		if (beginAdmission) beginImmediateTransaction(params.db, beginAdmission);
		else params.db.exec(params.sql);
		const elapsedMs = Date.now() - startedAt;
		logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		});
		return elapsedMs;
	} catch (error) {
		const elapsedMs = Date.now() - startedAt;
		if (isSqliteLockError(error) && shouldReportSqliteLockFailure(params.db) && !(params.step === "begin" && params.options?.beginLockFailureReporting === "suppress")) logTransactionStep({
			beginAdmission,
			db: params.db,
			elapsedMs,
			options: params.options,
			step: params.step
		}, { error });
		throw error;
	}
}
function discardUnsafeConnection(db, error) {
	const aborted = { error };
	db[abortedTransactionSymbol] ??= aborted;
	try {
		discardSqliteTransactionState(db, error);
	} catch (rollbackError) {
		if (db[abortedTransactionSymbol] === aborted) aborted.error = rollbackError;
		throw rollbackError;
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		try {
			db.close();
		} catch {}
	}
}
function abortImmediateTransaction(db, error, commitStarted) {
	if (db[abortedTransactionSymbol]) return;
	if (!commitStarted && db.isOpen && !db.isTransaction) {
		discardSqliteTransactionState(db, error, "rolled-back");
		return;
	}
	try {
		db.exec("ROLLBACK");
	} catch {
		discardUnsafeConnection(db, error);
	}
}
function runSqliteTransactionSync(db, operation, mode, options) {
	if (db.isTransaction) {
		db.exec("SAVEPOINT openclaw_tx_nested");
		try {
			const result = runSqliteReadOperationSync(db, operation);
			assertSyncTransactionResult(result);
			assertTransactionUsable(db);
			db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			return result;
		} catch (error) {
			const failure = db[abortedTransactionSymbol];
			if (failure) throw failure.error;
			try {
				db.exec("ROLLBACK TO SAVEPOINT openclaw_tx_nested");
				db.exec("RELEASE SAVEPOINT openclaw_tx_nested");
			} catch {
				discardUnsafeConnection(db, error);
			}
			throw error;
		}
	}
	const timing = currentSqliteOperationTiming();
	const prepareMs = timing ? Date.now() - timing.preparedAtMs : void 0;
	const beginMs = execTimedTransactionStep({
		db,
		options,
		sql: mode === "immediate" ? "BEGIN IMMEDIATE" : "BEGIN",
		step: "begin"
	});
	if (timing) timing.transactions.count += 1;
	return settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options);
}
function settleSqliteTransactionSync(db, operation, mode, beginMs, prepareMs, options, reservedSourceFence = false) {
	const timing = currentSqliteOperationTiming();
	const transactionStartedAt = Date.now();
	const admissionWaitBefore = timing?.hostAdmissionWaitMs ?? 0;
	const databaseAdmissionWaitBefore = timing?.databaseAdmissionWaitMs ?? 0;
	let commitMs = 0;
	const commit = () => {
		const startedAt = Date.now();
		const databaseAdmissionWaitBeforeCommit = timing?.databaseAdmissionWaitMs ?? 0;
		try {
			prepareSqliteTransactionCommit(db);
			execTimedTransactionStep({
				db,
				options,
				sql: "COMMIT",
				step: "commit"
			});
		} finally {
			commitMs += Date.now() - startedAt - ((timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBeforeCommit);
		}
	};
	let commitStarted = false;
	try {
		const result = reservedSourceFence ? operation() : runSqliteReadOperationSync(db, operation);
		assertSyncTransactionResult(result);
		assertTransactionUsable(db);
		commitStarted = true;
		if (options?.withCommit) assertSyncTransactionResult(options.withCommit(commit));
		else commit();
		return result;
	} catch (error) {
		abortImmediateTransaction(db, error, commitStarted);
		assertTransactionUsable(db);
		throw error;
	} finally {
		try {
			logSlowTransactionHold({
				db,
				elapsedMs: Date.now() - transactionStartedAt,
				mode,
				options,
				prepareMs,
				beginMs,
				hostAdmissionWaitMs: (timing?.hostAdmissionWaitMs ?? 0) - admissionWaitBefore,
				databaseAdmissionWaitMs: (timing?.databaseAdmissionWaitMs ?? 0) - databaseAdmissionWaitBefore,
				commitMs
			});
		} catch {} finally {
			if (timing) timing.preparedAtMs = Date.now();
		}
	}
}
/** Run synchronous reads against one deferred SQLite snapshot. */
function runSqliteDeferredTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "deferred", options));
}
/** Read-only composition reuses the caller's snapshot and rollback owner. */
function runSqliteReadSnapshotSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) {
		assertPostgresTransactionUsable(db);
		if (db.isTransaction) {
			const result = operation();
			assertSyncTransactionResult(result);
			assertPostgresTransactionUsable(db);
			return result;
		}
		return db.runTransaction(operation, options, true);
	}
	assertTransactionUsable(db);
	if (!db.isTransaction) return runSqliteDeferredTransactionSync(db, operation, options);
	const result = runSqliteReadOperationSync(db, operation);
	assertSyncTransactionResult(result);
	assertTransactionUsable(db);
	return result;
}
function runSqliteImmediateTransactionSync(db, operation, options) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(operation, options);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => runSqliteTransactionSync(db, operation, "immediate", options));
}
function runSqliteSingleStatementSync(db, statement) {
	if (isPostgresSqlConnection(db)) return db.runTransaction(statement);
	assertTransactionUsable(db);
	return withSqlitePostCommitPublications(db, () => {
		if (db.isTransaction) return runSqliteTransactionSync(db, statement, "immediate");
		const result = runSqliteReadOperationSync(db, statement);
		assertSyncTransactionResult(result);
		return result;
	});
}
//#endregion
//#region src/infra/startup-maintenance-required.ts
const GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON = "gateway.maintenance_required";
const maintenanceReasons = {
	"state-migrations": "state migration",
	"newer-schema": "a newer OpenClaw build",
	"agent-media": "offline media migration",
	"audit-events-v2": "state database schema migration",
	"legacy-workshop-review-index": "state database schema migration",
	"legacy-cron-run-logs": "cron run history migration",
	"legacy-workspace": "workspace setup state migration",
	"legacy-session-store": "session store migration"
};
var StartupMaintenanceRequiredError = class extends Error {
	constructor(kind, message, options) {
		super(message, options);
		this.kind = kind;
		this.code = GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON;
		this.name = "StartupMaintenanceRequiredError";
	}
	get reason() {
		return maintenanceReasons[this.kind];
	}
};
//#endregion
//#region src/infra/sqlite-user-version.ts
const SQLITE_SCHEMA_VERSION_ERROR_NAME = "SqliteSchemaVersionError";
var SqliteSchemaVersionError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("newer-schema", message);
		this.name = SQLITE_SCHEMA_VERSION_ERROR_NAME;
	}
};
function isSqliteSchemaVersionError(error) {
	return error instanceof SqliteSchemaVersionError || error instanceof Error && error.name === SQLITE_SCHEMA_VERSION_ERROR_NAME;
}
function readSqliteUserVersion(db) {
	const row = executeWithCachedStatement(db, "PRAGMA user_version", [], (statement) => statement.get());
	return Number(row?.user_version ?? 0);
}
/**
* Name the refusing build from immutable loaded metadata, plus its install root.
* The path remains actionable when multiple installs share a version or build.
*/
function describeRunningOpenClawBuild() {
	const commit = resolveRuntimeServiceCommit();
	const root = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const identity = commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`;
	return root ? `${identity} installed at ${root}` : identity;
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
	return new SqliteSchemaVersionError(`This OpenClaw build cannot open your existing data.
${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this build supports ${supportedVersion}.\nRefused by ${describeRunningOpenClawBuild()}.\nUse a build that supports schema ${schemaVersion} or newer with this state directory. To use an older build, restore your pre-update backup created with openclaw backup create.\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
}
//#endregion
//#region src/infra/main-thread-stall.ts
const taskState = resolveGlobalSingleton(Symbol.for("openclaw.mainThreadTask"), () => ({}));
function runWithMainThreadTask(name, run) {
	const observer = taskState.observer;
	if (!observer) return run();
	const exit = observer.enter(name);
	try {
		return run();
	} finally {
		exit();
	}
}
//#endregion
//#region src/infra/gateway-scheduler.ts
const log$3 = createSubsystemLogger("gateway/scheduler");
const hostClock = {
	now: () => Date.now(),
	monotonicNow: () => performance.now(),
	arm: (run, delayMs) => {
		const timer = setTimeout(() => {
			runWithMainThreadTask("scheduler:wake", () => {
				run();
			});
		}, delayMs);
		timer.unref();
		return () => clearTimeout(timer);
	}
};
/** Next maintenance slot on one clock after a run, skipping missed slots without replay. */
function nextMaintenanceSlot(slotMs, clockMs, everyMs) {
	if (slotMs - clockMs > everyMs / 2) return slotMs;
	return slotMs + (Math.floor(Math.max(0, clockMs - slotMs) / everyMs) + 1) * everyMs;
}
/** Owns Gateway wakeups; stores and execution owners retain their deadlines and authority. */
var GatewayScheduler = class {
	constructor(options = {}) {
		this.jobs = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Set();
		this.dispatching = false;
		this.timerGeneration = 0;
		this.controller = new AbortController();
		this.clock = options.clock ?? hostClock;
	}
	get signal() {
		return this.controller.signal;
	}
	now() {
		return this.clock.now();
	}
	get nextWakeAtMs() {
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		let next = null;
		for (const job of this.jobs.values()) {
			if (job.running) continue;
			const atMs = nowMs + this.remaining(job, nowMs, elapsedMs);
			next = next === null ? atMs : Math.min(next, atMs);
		}
		return next;
	}
	/** Closes one owner's timers without retiring siblings or losing in-flight joins. */
	scope() {
		const controller = new AbortController();
		const owner = {
			signal: AbortSignal.any([this.signal, controller.signal]),
			jobs: /* @__PURE__ */ new Set()
		};
		const beginClose = () => {
			controller.abort();
			materializeErrorStack(controller.signal.reason);
			materializeErrorStack(owner.signal.reason);
			for (const job of owner.jobs) this.cancel(job);
		};
		const close = () => {
			beginClose();
			const running = [...owner.jobs].flatMap((job) => job.running ?? []);
			return running.length > 0 ? Promise.all(running).then(() => void 0) : void 0;
		};
		return {
			signal: owner.signal,
			now: () => this.now(),
			schedule: (params) => this.scheduleOwned(params, owner),
			beginClose,
			close,
			stop: async () => {
				await close();
			}
		};
	}
	schedule(params) {
		return this.scheduleOwned(params);
	}
	scheduleOwned(params, owner) {
		const relative = "delayMs" in params;
		const nowMs = this.now();
		const requestedAtMs = relative ? nowMs + params.delayMs : params.atMs;
		const atMs = params.phase === "maintenance" ? Math.max(nowMs, Math.floor(requestedAtMs / 1e4) * 1e4) : requestedAtMs;
		if (!Number.isFinite(atMs) || params.everyMs !== void 0 && (!Number.isFinite(params.everyMs) || params.everyMs <= 0)) throw new Error(`Invalid Gateway schedule: ${params.id}`);
		const cancelled = this.signal.aborted || owner?.signal.aborted === true;
		const previous = cancelled ? void 0 : this.jobs.get(params.id);
		const job = {
			id: params.id,
			diagnosticName: `scheduler:${params.id.startsWith("maintenance:") ? params.id.split(":").slice(0, 3).join(":") : params.id.split(/[:/]/u, 1)[0]}`,
			run: params.run,
			everyMs: params.everyMs,
			phase: params.phase,
			atMs,
			elapsedAtMs: relative || params.everyMs !== void 0 ? this.clock.monotonicNow() + Math.max(0, atMs - nowMs) : void 0,
			context: runOutsideAsyncWorkScope(() => AsyncLocalStorage.snapshot()),
			cancelled,
			owner
		};
		if (params.mode === "earliest" && previous && !previous.running) {
			job.atMs = Math.min(job.atMs, previous.atMs);
			if (previous.elapsedAtMs !== void 0) job.elapsedAtMs = job.elapsedAtMs === void 0 ? previous.elapsedAtMs : Math.min(job.elapsedAtMs, previous.elapsedAtMs);
		}
		const cancel = () => this.cancel(job);
		if (!cancelled) {
			owner?.jobs.add(job);
			this.jobs.set(job.id, job);
			if (previous) this.cancel(previous);
			this.arm();
		}
		return {
			get atMs() {
				return job.atMs;
			},
			cancel,
			stop: async () => {
				cancel();
				await job.running;
			}
		};
	}
	cancel(job) {
		job.cancelled = true;
		if (!job.running) job.owner?.jobs.delete(job);
		if (this.jobs.get(job.id) === job) {
			this.jobs.delete(job.id);
			this.arm();
		}
	}
	beginClose() {
		this.controller.abort();
		materializeErrorStack(this.controller.signal.reason);
		this.timerGeneration += 1;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		for (const job of this.jobs.values()) this.cancel(job);
		this.jobs.clear();
	}
	async stop() {
		this.beginClose();
		await Promise.all(this.pending);
	}
	remaining(job, nowMs, elapsedMs) {
		const wallDelay = job.atMs - nowMs;
		return job.elapsedAtMs === void 0 ? wallDelay : Math.min(wallDelay, job.elapsedAtMs - elapsedMs);
	}
	arm() {
		if (this.signal.aborted || this.dispatching) return;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		const generation = ++this.timerGeneration;
		const next = this.nextWakeAtMs;
		if (next !== null) {
			const nowMs = this.now();
			const delayMs = Math.min(2147483647, Math.max(0, Math.ceil(next - nowMs)));
			this.cancelTimer = runInDetachedAsyncContext(() => this.clock.arm(() => generation === this.timerGeneration ? this.wake(nowMs + delayMs) : void 0, delayMs));
		}
	}
	wake(expectedAtMs) {
		this.cancelTimer = void 0;
		if (this.signal.aborted) return;
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		const due = [...this.jobs.values()].filter((job) => !job.running && this.remaining(job, nowMs, elapsedMs) <= 0).toSorted((a, b) => this.remaining(a, nowMs, elapsedMs) - this.remaining(b, nowMs, elapsedMs));
		let started;
		if (nowMs - expectedAtMs > 6e4) log$3.debug(`late wake by ${nowMs - expectedAtMs}ms; coalescing ${due.length} due jobs`);
		this.dispatching = true;
		try {
			for (const job of due) {
				if (this.signal.aborted || job.cancelled || job.owner?.signal.aborted || this.jobs.get(job.id) !== job) continue;
				if (job.everyMs === void 0) this.jobs.delete(job.id);
				const running = this.run(job);
				if (running) (started ??= []).push(running);
			}
		} finally {
			this.dispatching = false;
			this.arm();
		}
		return started ? Promise.all(started).then(() => void 0) : void 0;
	}
	run(job) {
		log$3[job.everyMs === void 0 ? "debug" : "trace"](`running ${job.id}`);
		const done = createDeferredCore();
		const work = new AsyncWorkScope();
		job.running = done.promise;
		this.pending.add(done.promise);
		const finish = () => {
			job.running = void 0;
			this.pending.delete(done.promise);
			if (job.everyMs !== void 0 && !job.cancelled && !this.signal.aborted) {
				if (job.phase === "maintenance") {
					const alignmentMs = job.atMs - Math.floor(job.atMs / 1e4) * 1e4;
					job.atMs -= alignmentMs;
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs -= alignmentMs;
					job.atMs = nextMaintenanceSlot(job.atMs, this.now(), job.everyMs);
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs = nextMaintenanceSlot(job.elapsedAtMs, this.clock.monotonicNow(), job.everyMs);
				} else {
					job.atMs = this.now() + job.everyMs;
					job.elapsedAtMs = this.clock.monotonicNow() + job.everyMs;
				}
			} else job.owner?.jobs.delete(job);
			done.resolve();
			this.arm();
		};
		let result = void 0;
		try {
			result = job.context(() => runWithMainThreadTask(job.diagnosticName, () => work.run(job.run)));
		} catch (error) {
			log$3.error(`${job.id} failed: ${String(error)}`);
		}
		if (!result && !work.hasPendingWork) {
			finish();
			return;
		}
		Promise.resolve(result).catch((error) => log$3.error(`${job.id} failed: ${String(error)}`)).then(() => AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain())).finally(finish);
		return done.promise;
	}
};
//#endregion
//#region src/infra/sqlite-number.ts
const MAX_SAFE_INTEGER_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
function readFiniteSqliteNumber(value) {
	const number = typeof value === "bigint" ? Number(value) : value;
	return typeof number === "number" && Number.isFinite(number) ? number : void 0;
}
function coerceRequiredSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
/** Converts a SQLite number or safely representable bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
	if (typeof value === "bigint") {
		if (value > MAX_SAFE_INTEGER_BIGINT || value < -MAX_SAFE_INTEGER_BIGINT) return;
		return Number(value);
	}
	return typeof value === "number" ? value : void 0;
}
//#endregion
//#region src/infra/sqlite-wal-checkpoint.ts
const checkpointListeners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
/** A relayed worker result adds host observations without claiming visibility into other threads. */
function observeSqliteWalCheckpointHealth(databasePath, health) {
	const { activeReaders: previousReaders, readerDiagnostics: previousDiagnostics, ...observation } = health;
	if (health.state === "complete") return observation;
	const { activeReaders, ...local } = readSqliteReaderDiagnosticsForPath(databasePath);
	return {
		...observation,
		activeReaders: [...(previousReaders ?? []).filter((reader) => reader.threadId !== local.threadId), ...activeReaders].toSorted((left, right) => right.ageMs - left.ageMs).slice(0, 8),
		readerDiagnostics: [...(previousDiagnostics ?? []).filter((diagnostic) => diagnostic.threadId !== local.threadId), local].slice(-8)
	};
}
function notifyCheckpoint(databasePath, snapshot) {
	for (const listener of checkpointListeners) try {
		listener({
			databasePath: sqliteReaderDatabasePathKey(databasePath),
			health: structuredClone(snapshot.health),
			observedAtNs: snapshot.observedAtNs,
			lastCompletedAtNs: snapshot.lastCompletedAtNs
		});
	} catch {}
}
/** Worker result transport relays the recorded fact and returns its enriched diagnostic snapshot. */
function publishSqliteWalCheckpointObservation(databasePath, snapshot) {
	const observed = {
		health: observeSqliteWalCheckpointHealth(databasePath, snapshot.health),
		observedAtNs: snapshot.observedAtNs,
		lastCompletedAtNs: snapshot.lastCompletedAtNs
	};
	notifyCheckpoint(databasePath, observed);
	return observed;
}
function sqliteFileBytes(pathname) {
	try {
		return fs.statSync(pathname).size;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function readCheckpointResult(row) {
	const [busy, logFrames, checkpointedFrames] = Object.values(row ?? {}).map((value) => normalizeSqliteNumber(typeof value === "number" || typeof value === "bigint" ? value : null));
	if (busy === void 0 || logFrames === void 0 || checkpointedFrames === void 0) throw new Error("SQLite returned an invalid WAL checkpoint result");
	return {
		busy,
		logFrames,
		checkpointedFrames
	};
}
function checkpoint(database, mode) {
	return database.prepare(`PRAGMA wal_checkpoint(${mode});`).get();
}
/** Offline maintenance must stop before compaction or recovery if truncation remains busy. */
var SqliteWalCheckpointBusyError = class extends Error {};
function truncateSqliteWal(database, sqlitePath) {
	const row = checkpoint(database, "TRUNCATE");
	const busy = readFiniteSqliteNumber(row?.busy ?? (row ? Object.values(row)[0] : void 0));
	if (busy === void 0) throw new Error(`SQLite checkpoint returned an invalid result for ${sqlitePath}.`);
	if (busy !== 0) throw new SqliteWalCheckpointBusyError(`SQLite checkpoint remained busy for ${sqlitePath}. Stop OpenClaw and retry.`);
}
/** The maintenance lifecycle owns this checkpoint result and its last observation. */
function createSqliteWalCheckpoint(database, options, journalSizeLimitBytes) {
	let snapshot;
	const checkpointObservation = () => ({
		state: "error",
		observedAtMs: Date.now(),
		walBytes: null,
		databaseBytes: null,
		logFrames: null,
		checkpointedFrames: null,
		lastCompletedAtMs: snapshot?.health.lastCompletedAtMs ?? null,
		consecutiveBlocked: 0,
		warning: true
	});
	const recordCheckpointError = (error, observation = checkpointObservation()) => {
		const failed = {
			...observation,
			observedAtMs: Date.now(),
			state: "error",
			consecutiveBlocked: 0,
			warning: true,
			error: formatErrorMessage(error)
		};
		snapshot = {
			observedAtNs: process.hrtime.bigint(),
			lastCompletedAtNs: snapshot?.lastCompletedAtNs,
			health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, failed) : failed
		};
		if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		options.onCheckpointError?.(error);
	};
	const recordCheckpoint = (mode, row, quiet) => {
		const observedAtNs = process.hrtime.bigint();
		const observation = checkpointObservation();
		let busy;
		let sizeError;
		try {
			const { busy: busyResult, logFrames, checkpointedFrames } = readCheckpointResult(row);
			busy = busyResult !== 0;
			observation.logFrames = logFrames;
			observation.checkpointedFrames = checkpointedFrames;
			observation.state = busy || checkpointedFrames < logFrames ? "blocked" : "complete";
			if (observation.state === "complete") observation.lastCompletedAtMs = observation.observedAtMs;
			else observation.consecutiveBlocked = (snapshot?.health.consecutiveBlocked ?? 0) + 1;
			if (options.databasePath) try {
				observation.databaseBytes = sqliteFileBytes(options.databasePath);
				observation.walBytes = sqliteFileBytes(`${options.databasePath}-wal`);
			} catch (error) {
				sizeError = error;
				observation.error = formatErrorMessage(error);
			}
			observation.warning = observation.state === "blocked" && (observation.consecutiveBlocked >= 2 || observation.walBytes !== null && observation.databaseBytes !== null && observation.walBytes > Math.max(2 * observation.databaseBytes, journalSizeLimitBytes));
			snapshot = {
				observedAtNs,
				lastCompletedAtNs: observation.state === "complete" ? observedAtNs : snapshot?.lastCompletedAtNs,
				health: options.databasePath ? observeSqliteWalCheckpointHealth(options.databasePath, observation) : observation
			};
			if (options.databasePath) notifyCheckpoint(options.databasePath, snapshot);
		} catch (error) {
			recordCheckpointError(error, observation);
			return false;
		}
		if (observation.error !== void 0) options.onCheckpointError?.(sizeError);
		if ((busy || observation.warning) && !quiet) {
			const label = options.databaseLabel ?? "sqlite database";
			options.onCheckpointError?.(/* @__PURE__ */ new Error(`${label} WAL checkpoint ${mode} ${busy ? "remained busy" : "blocked by a reader"}`));
		}
		return observation.state === "complete";
	};
	return {
		adopt(received) {
			if (snapshot && snapshot.observedAtNs >= received.observedAtNs && (snapshot.lastCompletedAtNs ?? 0n) >= (received.lastCompletedAtNs ?? 0n)) return;
			const completed = (snapshot?.lastCompletedAtNs ?? 0n) > (received.lastCompletedAtNs ?? 0n) ? snapshot : received;
			if (!snapshot || received.observedAtNs > snapshot.observedAtNs) snapshot = structuredClone(received);
			snapshot.lastCompletedAtNs = completed?.lastCompletedAtNs;
			snapshot.health.lastCompletedAtMs = completed?.health.lastCompletedAtMs ?? null;
			if (options.databasePath) {
				snapshot.health = observeSqliteWalCheckpointHealth(options.databasePath, snapshot.health);
				notifyCheckpoint(options.databasePath, snapshot);
			}
		},
		checkpoint(mode, checkpointOptions = {}) {
			try {
				return recordCheckpoint(mode, checkpoint(database, mode), checkpointOptions.quiet === true);
			} catch (error) {
				recordCheckpointError(error);
				return false;
			}
		},
		recordError: recordCheckpointError,
		inspectIdle() {
			const { busy, logFrames, checkpointedFrames } = readCheckpointResult(checkpoint(database, "PASSIVE"));
			return busy === 0 && logFrames >= 0 && checkpointedFrames >= 0 && checkpointedFrames <= logFrames;
		},
		get health() {
			return snapshot ? structuredClone(snapshot.health) : void 0;
		},
		get snapshot() {
			return snapshot ? structuredClone(snapshot) : void 0;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/copy.js
function firstFailure(current, value) {
	return current ?? { value };
}
function closeDescriptor(fd, failure) {
	try {
		fs.closeSync(fd);
		return failure;
	} catch (error) {
		return firstFailure(failure, error);
	}
}
/** Inspect an existing real directory without creating probe files. */
function probeTreeClone(parentPath) {
	const native = getNativeBinding("probeTreeClone");
	if (!native) return void 0;
	const parent = openStagedDirectory(assertAbsolutePathInput(parentPath));
	let backend;
	let failure;
	try {
		backend = native.probeTreeClone(parent.fd) ?? void 0;
	} catch (error) {
		failure = firstFailure(failure, error);
	}
	failure = closeDescriptor(parent.fd, failure);
	if (failure) throw failure.value;
	return backend;
}
//#endregion
//#region packages/normalization-core/src/mountinfo-path.ts
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
//#endregion
//#region src/infra/sqlite-wal-filesystem.ts
const ROLLBACK_FILESYSTEM_MAGIC = /* @__PURE__ */ new Set([
	26985,
	20859,
	4283649346,
	4266872130,
	16914839
]);
const LINUX_BTRFS_SUPER_MAGIC = 2435016766;
const PROC_MOUNTINFO_PATH = "/proc/self/mountinfo";
const MOUNT_COMMAND_TIMEOUT_MS = 1e3;
const NETWORK_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"cifs",
	"smbfs",
	"smb2",
	"smb3"
]);
const CROSS_VM_FILESYSTEM_TYPES = /* @__PURE__ */ new Set([
	"virtiofs",
	"fuse.virtiofs",
	"9p",
	"9p2000.l"
]);
const log$2 = createSubsystemLogger("infra/sqlite-wal");
let warnedNoCow = false;
function findExistingVolumePaths(targetPath) {
	let current = path.resolve(targetPath);
	while (true) {
		let stats;
		try {
			stats = fs.statSync(current);
		} catch {
			const parent = path.dirname(current);
			if (parent === current) return null;
			current = parent;
			continue;
		}
		const existingPath = fs.realpathSync(current);
		return {
			canonicalPath: stats.isDirectory() ? existingPath : path.dirname(existingPath),
			originalPath: stats.isDirectory() ? current : path.dirname(current)
		};
	}
}
function parseProcMountInfoEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const separator = line.indexOf(" - ");
		if (separator === -1) continue;
		const fields = line.slice(0, separator).split(" ");
		const suffixFields = line.slice(separator + 3).split(" ");
		const mountPoint = fields[4];
		const fsType = suffixFields[0];
		if (mountPoint && fsType) entries.push({
			mountPoint: decodeMountInfoPath(mountPoint),
			fsType,
			...suffixFields[1] ? { source: decodeMountInfoPath(suffixFields[1]) } : {}
		});
	}
	return entries;
}
function parseMountCommandEntries(contents) {
	const entries = [];
	for (const line of contents.split("\n")) {
		const match = /^(.+) on (.+) type ([^,\s)]+) \(/.exec(line) ?? /^(.+) on (.+) \(([^,\s)]+)/.exec(line);
		if (match) {
			const [, source, mountPoint, fsType] = match;
			if (source && mountPoint && fsType) entries.push({
				source,
				mountPoint,
				fsType
			});
		}
	}
	return entries;
}
function readMountEntries() {
	try {
		return {
			ok: true,
			value: parseProcMountInfoEntries(fs.readFileSync(PROC_MOUNTINFO_PATH, "utf8"))
		};
	} catch {}
	try {
		return {
			ok: true,
			value: parseMountCommandEntries(String(process.getBuiltinModule("node:child_process").execFileSync("mount", [], {
				killSignal: "SIGKILL",
				timeout: MOUNT_COMMAND_TIMEOUT_MS
			})))
		};
	} catch (error) {
		return hasNodeErrorCode(error, "ETIMEDOUT") ? {
			ok: false,
			error: "timeout"
		} : {
			ok: true,
			value: []
		};
	}
}
function isPathWithinMount(targetPath, mountPoint) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedMountPoint = path.resolve(mountPoint);
	return resolvedTarget === resolvedMountPoint || resolvedMountPoint === path.parse(resolvedMountPoint).root || resolvedTarget.startsWith(`${resolvedMountPoint}${path.sep}`);
}
function isSshfsMountSource(source) {
	if (!source) return false;
	const normalized = source.toLowerCase();
	return normalized === "sshfs" || normalized.startsWith("sshfs#") || normalized.startsWith("sshfs@") || /^(?:[^/\s:]+@)?[^/\s:]+:.*/u.test(source);
}
function resolveMountTypeJournalPolicy(entry) {
	const normalized = entry.fsType.toLowerCase();
	if (normalized.startsWith("nfs") || NETWORK_FILESYSTEM_TYPES.has(normalized) || CROSS_VM_FILESYSTEM_TYPES.has(normalized) || normalized.startsWith("9p")) return "rollback";
	if (normalized === "fuse.sshfs") return "unsupported";
	if ((normalized === "macfuse" || normalized === "osxfuse") && isSshfsMountSource(entry.source)) return "unsupported";
	return "wal";
}
function findMountEntry(targetPath, mountEntries) {
	return mountEntries.filter((entry) => isPathWithinMount(targetPath, entry.mountPoint)).toSorted((a, b) => b.mountPoint.length - a.mountPoint.length)[0];
}
function resolveMountEntryJournalPolicy(targetPath, mountEntries) {
	const mountEntry = findMountEntry(targetPath, mountEntries);
	return mountEntry ? resolveMountTypeJournalPolicy(mountEntry) : "wal";
}
/** Classify the physical store location, including a not-yet-created database. */
function isSqlitePathOnBtrfs(targetPath) {
	if (process.platform !== "linux") return false;
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return false;
	try {
		return fs.statfsSync(checkedPaths.canonicalPath).type === LINUX_BTRFS_SUPER_MAGIC;
	} catch {
		const mounts = readMountEntries();
		return mounts.ok && findMountEntry(checkedPaths.canonicalPath, mounts.value)?.fsType.toLowerCase() === "btrfs";
	}
}
/** Doctor requires failure to abort publication; never apply attributes to data files. */
function setSqliteDirectoryNoCow(directory) {
	if (!fs.statSync(directory).isDirectory()) throw new Error(`SQLite NOCOW target is not a directory: ${directory}`);
	const result = process.getBuiltinModule("node:child_process").spawnSync("chattr", ["+C", directory], {
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: MOUNT_COMMAND_TIMEOUT_MS,
		maxBuffer: 4096
	});
	if (result.error || result.status !== 0) throw result.error ?? /* @__PURE__ */ new Error(`chattr +C failed: ${result.stderr.trim() || result.signal || result.status}`);
}
/** Called after directory permissions are established, before SQLite creates any files. */
function prepareSqliteDatabaseDirectory(databasePath) {
	if (process.platform !== "linux" || fs.existsSync(databasePath)) return;
	try {
		if (isSqlitePathOnBtrfs(databasePath)) setSqliteDirectoryNoCow(path.dirname(databasePath));
	} catch (error) {
		if (!warnedNoCow) {
			warnedNoCow = true;
			log$2.warn("Could not enable SQLite directory NOCOW; continuing with filesystem defaults", {
				databasePath,
				error: error instanceof Error ? error.message : String(error)
			});
		}
	}
}
function combineMountEntryJournalPolicies(targetPaths) {
	const mountResult = readMountEntries();
	if (!mountResult.ok) {
		const [originalPath, canonicalPath] = targetPaths;
		if (process.platform === "darwin" && originalPath === canonicalPath) try {
			if (probeTreeClone(canonicalPath) === "apfs") return "wal";
		} catch {}
		return "rollback";
	}
	const policies = new Set(targetPaths.map((targetPath) => resolveMountEntryJournalPolicy(targetPath, mountResult.value)));
	if (policies.has("unsupported")) return "unsupported";
	return policies.has("rollback") ? "rollback" : "wal";
}
function isWindowsUncPath(targetPath) {
	return /^\\\\\?\\UNC\\[^\\]+\\[^\\]+/i.test(targetPath) || /^\\\\(?![?.]\\)[^\\]+\\[^\\]+/.test(targetPath);
}
function isWindowsDrivePath(targetPath) {
	return /^[A-Za-z]:[\\/]/.test(targetPath) || /^\\\\\?\\[A-Za-z]:[\\/]/i.test(targetPath);
}
function resolvePathJournalPolicy(targetPath) {
	if (process.platform === "win32") {
		const normalizedTargetPath = path.win32.normalize(targetPath);
		if (isWindowsUncPath(normalizedTargetPath)) return "rollback";
		if (isWindowsDrivePath(normalizedTargetPath)) try {
			return isWindowsUncPath(path.win32.normalize(fs.realpathSync.native(targetPath))) ? "rollback" : "wal";
		} catch {
			return "rollback";
		}
	}
	const checkedPaths = findExistingVolumePaths(targetPath);
	if (!checkedPaths) return "wal";
	const mountLookupPaths = [checkedPaths.originalPath, checkedPaths.canonicalPath];
	if (typeof fs.statfsSync !== "function") return combineMountEntryJournalPolicies(mountLookupPaths);
	try {
		if (ROLLBACK_FILESYSTEM_MAGIC.has(fs.statfsSync(checkedPaths.canonicalPath).type)) return "rollback";
	} catch {}
	return combineMountEntryJournalPolicies(mountLookupPaths);
}
//#endregion
//#region src/infra/sqlite-wal-reclamation.ts
const VACUUM_UNIT_TARGET_MS = 25;
const vacuumPageBudgets = /* @__PURE__ */ new WeakMap();
function createSqliteWalReclamationResult() {
	return {
		checkpointCompleted: false,
		freePagesBefore: null,
		remainingFreePages: null,
		checkpointCalls: 0,
		checkpointIncomplete: 0,
		checkpointMs: 0,
		checkpointMaxMs: 0,
		queryMs: 0,
		vacuumMs: 0,
		vacuumPasses: 0,
		vacuumPagesRequested: 0
	};
}
/** Physical page accounting for both reclamation and its read-only eligibility probe. */
function readSqliteFreePageCount(database, diagnostics) {
	const startedAt = diagnostics ? performance$1.now() : 0;
	try {
		return Number(database.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
	} finally {
		if (diagnostics) diagnostics.queryMs += performance$1.now() - startedAt;
	}
}
/** One online unit never waits for readers or adds vacuum frames behind a blocked checkpoint. */
function reclaimSqliteWalFreePages(database, runCheckpoint, options) {
	const result = createSqliteWalReclamationResult();
	const checkpoint = () => {
		options.beforeMutation?.();
		const startedAt = performance$1.now();
		try {
			const mode = options.checkpointMode ?? "TRUNCATE";
			let completed = runCheckpoint(mode);
			result.checkpointCalls++;
			if (!completed && mode === "TRUNCATE") {
				options.beforeMutation?.();
				completed = runCheckpoint("PASSIVE");
				result.checkpointCalls++;
			}
			result.checkpointCompleted = completed;
			result.checkpointIncomplete += Number(!completed);
			return completed;
		} finally {
			const elapsed = performance$1.now() - startedAt;
			result.checkpointMs += elapsed;
			result.checkpointMaxMs = Math.max(result.checkpointMaxMs, elapsed);
		}
	};
	if (options.maxPages === 0 && options.checkpointMode === "PASSIVE") {
		checkpoint();
		return result;
	}
	return runWithSqliteBusyTimeout(database, 0, () => {
		if (!checkpoint() || options.maxPages === 0) return result;
		const before = readSqliteFreePageCount(database, result);
		result.freePagesBefore = before;
		result.remainingFreePages = before;
		if (!Number.isSafeInteger(before) || before <= 0) return result;
		const pages = Math.min(vacuumPageBudgets.get(database) ?? 8, before, options.maxPages ?? 512);
		if (!Number.isSafeInteger(pages) || pages <= 0) throw new Error("SQLite page reclamation requires a positive integer page limit");
		const startedAt = performance$1.now();
		let entered = false;
		let completed = false;
		try {
			runSqliteImmediateTransactionSync(database, () => {
				entered = true;
				options.beforeMutation?.();
				result.vacuumPasses++;
				result.vacuumPagesRequested += pages;
				database.exec(`PRAGMA incremental_vacuum(${pages});`);
				options.onCommit?.();
			}, {
				busyTimeoutMs: 0,
				operationLabel: "incremental-vacuum"
			});
			completed = true;
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			return result;
		} finally {
			const elapsedMs = performance$1.now() - startedAt;
			result.vacuumMs += elapsedMs;
			if (completed) vacuumPageBudgets.set(database, Math.max(1, Math.min(512, pages * 2, Math.floor(pages * VACUUM_UNIT_TARGET_MS / Math.max(elapsedMs, .001)))));
		}
		options.afterCommit?.();
		if (checkpoint()) result.remainingFreePages = readSqliteFreePageCount(database, result);
		return result;
	});
}
//#endregion
//#region src/infra/sqlite-wal-split-brain.ts
const PROC_SELF_FD_PATH = "/proc/self/fd";
const SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE = "SQLite WAL sidecar identity mismatch; terminating without SQLite cleanup";
function readUnlessMissing(read, allowClosedDescriptor = false) {
	try {
		return read();
	} catch (error) {
		if (allowClosedDescriptor && hasNodeErrorCode(error, "EBADF") || hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
}
function isSqliteWalSidecarSplitBrain(descriptor, target) {
	return descriptor.nlink === 0n || !target || descriptor.dev !== target.dev || descriptor.ino !== target.ino;
}
function detectSqliteWalSplitBrain(databasePath) {
	const descriptors = readUnlessMissing(() => fs.readdirSync(PROC_SELF_FD_PATH));
	const sidecarPaths = [`${databasePath}-wal`, `${databasePath}-shm`];
	for (const descriptorName of descriptors ?? []) {
		const descriptorPath = path.join(PROC_SELF_FD_PATH, descriptorName);
		const linkedPath = readUnlessMissing(() => fs.readlinkSync(descriptorPath));
		if (linkedPath === void 0) continue;
		const sidecarPath = sidecarPaths.find((candidate) => linkedPath === candidate || linkedPath === `${candidate} (deleted)`);
		if (!sidecarPath) continue;
		const descriptor = readUnlessMissing(() => fs.fstatSync(Number(descriptorName), { bigint: true }), true);
		if (descriptor === void 0 || readUnlessMissing(() => fs.readlinkSync(descriptorPath)) !== linkedPath) continue;
		const target = readUnlessMissing(() => fs.statSync(sidecarPath, { bigint: true }));
		if (!isSqliteWalSidecarSplitBrain(descriptor, target)) continue;
		return {
			event: "sqlite_wal_sidecar_identity_mismatch",
			databasePath,
			descriptorDevice: descriptor.dev.toString(),
			descriptorInode: descriptor.ino.toString(),
			sidecarPath,
			...target ? {
				targetDevice: target.dev.toString(),
				targetInode: target.ino.toString()
			} : {}
		};
	}
}
function terminateForSqliteWalSplitBrain(splitBrain, databaseLabel) {
	try {
		fs.writeSync(2, `${JSON.stringify({
			level: "fatal",
			subsystem: "infra/sqlite-wal",
			message: SQLITE_WAL_SPLIT_BRAIN_FATAL_MESSAGE,
			...splitBrain,
			databaseLabel,
			pid: process.pid
		})}\n`);
	} catch {}
	try {
		process.kill(process.pid, "SIGKILL");
	} finally {
		process.abort();
	}
}
//#endregion
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
/** A worker-maintained writer never checkpoints inline; its maintenance owner ticks instead. */
function registerSqliteWalWorkerMaintenance(database, execute, cancel) {
	database.exec("PRAGMA wal_autocheckpoint = 0;");
	const stopCheckpointTick = admissions.get(database)?.stopCheckpointTick;
	admissions.set(database, {
		execute,
		cancel
	});
	stopCheckpointTick?.();
}
function isSqliteWalWorkerMaintained(database) {
	return admissions.get(database)?.execute !== void 0;
}
function cancelSqliteWalWriteAdmission(database) {
	return admissions.get(database)?.cancel?.();
}
function createSqliteWalMaintenanceScheduler(database, operation, prepare, observe, onError, pageBudget, stopCheckpointTick) {
	const existingAdmission = admissions.get(database);
	admissions.set(database, {
		...existingAdmission,
		stopCheckpointTick
	});
	let pending;
	return () => {
		if (!pending) {
			const run = async () => {
				let remaining = pageBudget();
				let continuation = false;
				while (true) {
					const request = prepare(remaining);
					if (!request || remaining === 0 && admissions.get(database)?.execute) return;
					request.continuation = continuation;
					let result;
					const admitted = () => {
						if (prepare(remaining)) result = operation(request);
					};
					const admission = admissions.get(database);
					if (admission?.execute) {
						result = await admission.execute(request);
						if (!prepare(remaining)) return;
						if (result?.checkpoint) observe(result.checkpoint);
					} else if (admission?.admit) await admission.admit(admitted);
					else admitted();
					const reclaimed = result?.reclaimedPages ?? 0;
					remaining -= reclaimed;
					if (reclaimed <= 0 || remaining <= 0) return;
					continuation = true;
					await setImmediate$1();
				}
			};
			pending = run().catch((error) => {
				if (prepare(0)) onError(error);
			}).finally(() => {
				pending = void 0;
			});
		}
		return pending;
	};
}
/** Retained Workers drain timer work only while their parent grants write admission. */
function registerDeferredSqliteWalWriteAdmission(database) {
	const existing = admissions.get(database)?.flush;
	if (existing) return existing;
	let pending;
	const flush = (assertCurrent) => {
		const current = pending;
		pending = void 0;
		if (current) try {
			assertCurrent();
			current.operation();
			current.resolve();
		} catch (error) {
			current.reject(error);
		}
		if (database.isOpen && database.isTransaction) assertTransactionUsable(database);
	};
	admissions.set(database, {
		stopCheckpointTick: admissions.get(database)?.stopCheckpointTick,
		admit: (operation) => new Promise((resolve, reject) => {
			pending = {
				operation,
				resolve,
				reject
			};
		}),
		flush,
		cancel: () => {
			pending?.resolve();
			pending = void 0;
		}
	});
	return flush;
}
//#endregion
//#region src/infra/sqlite-wal.ts
const DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES = 16384;
const DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS = 1e4;
const DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS = 18e5;
const DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES = 67108864;
const JOURNAL_MODE_RETRY_INTERVAL_MS = 10;
const JOURNAL_MODE_RETRY_SLEEP = new Int32Array(new SharedArrayBuffer(4));
const log$1 = createSubsystemLogger("infra/sqlite-wal");
const maintenanceScheduler = new GatewayScheduler();
let nextMaintenanceId = 0;
const completedCheckpointKey = {
	name: "sqlite-wal-completed-write-revision",
	read: (value) => value instanceof SharedArrayBuffer && value.byteLength === Int32Array.BYTES_PER_ELEMENT ? value : void 0
};
function sharedCompletedCheckpoint(db, writeRevision) {
	let shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	if (!shared) {
		shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
		Atomics.store(new Int32Array(shared), 0, writeRevision - 1 | 0);
		publishSqliteDatabaseAdmission(db, completedCheckpointKey, shared);
		shared = getSqliteDatabaseAdmission(db, completedCheckpointKey);
	}
	return shared ? new Int32Array(shared) : void 0;
}
function enableIncrementalAutoVacuumForFreshDatabase(db) {
	if (db.prepare("PRAGMA page_count").get()?.page_count === 0) db.exec("PRAGMA auto_vacuum = INCREMENTAL;");
}
/**
* Configure lock retry before inspecting or mutating a fresh database header.
* Concurrent first opens can otherwise fail before schema transactions begin.
*/
function configureSqlitePreSchemaPragmas(db, options = {}) {
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	enableIncrementalAutoVacuumForFreshDatabase(db);
}
function readJournalModeResult(row) {
	if (!row || typeof row !== "object") return null;
	const record = row;
	const value = record.journal_mode ?? Object.values(record)[0];
	return typeof value === "string" ? value.toLowerCase() : null;
}
function hasInMemoryMainDatabase(db) {
	return db.prepare("PRAGMA database_list;").all().find((row) => row.name === "main")?.file === "";
}
function requireRollbackJournalMode(db, options) {
	const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = DELETE;").get());
	if (journalMode !== "delete") {
		const label = options.databaseLabel ?? "sqlite database";
		const location = options.databasePath ? ` at ${options.databasePath}` : "";
		throw new Error(`${label}${location} is on a network-backed volume but SQLite kept journal_mode=${journalMode ?? "unknown"}; refusing to continue with WAL on network storage.`);
	}
}
function enableWalJournalMode(db, retryTimeoutMs, options) {
	const deadline = performance$1.now() + retryTimeoutMs;
	let restoreBusyTimeout = false;
	try {
		while (true) try {
			const journalMode = readJournalModeResult(db.prepare("PRAGMA journal_mode = WAL;").get());
			if (journalMode === "wal") return true;
			if (journalMode === "memory" && hasInMemoryMainDatabase(db)) return false;
			const label = options.databaseLabel ?? "sqlite database";
			const location = options.databasePath ? ` at ${options.databasePath}` : "";
			throw new Error(`${label}${location} could not enable WAL; SQLite kept journal_mode=${journalMode ?? "unknown"}.`);
		} catch (error) {
			const remainingMs = Math.max(0, deadline - performance$1.now());
			if (!isSqliteLockError(error) || remainingMs <= 0) throw error;
			if (!restoreBusyTimeout) {
				setSqliteBusyTimeout(db, 0);
				restoreBusyTimeout = true;
			}
			Atomics.wait(JOURNAL_MODE_RETRY_SLEEP, 0, 0, Math.min(JOURNAL_MODE_RETRY_INTERVAL_MS, remainingMs));
		}
	} finally {
		if (restoreBusyTimeout) setSqliteBusyTimeout(db, retryTimeoutMs);
	}
}
function enableMacosCheckpointFullfsync(db) {
	if (process.platform !== "darwin") return;
	try {
		db.exec("PRAGMA checkpoint_fullfsync = 1;");
	} catch {}
}
function refuseUnsupportedFilesystem(options) {
	const label = options.databaseLabel ?? "sqlite database";
	const location = options.databasePath ? ` at ${options.databasePath}` : "";
	throw new Error(`${label}${location} is on SSHFS, which cannot safely coordinate SQLite writes across mounts; refusing to open the database.`);
}
/** Configure safe journaling pragmas and return a handle for checkpoint/close maintenance. */
function configureSqliteWalMaintenance(db, options = {}) {
	const busyTimeoutMs = options.busyTimeoutMs ?? 0;
	if (options.busyTimeoutMs !== void 0) setSqliteBusyTimeout(db, options.busyTimeoutMs);
	const autoCheckpointPages = normalizeSqliteNonNegativeInteger(options.autoCheckpointPages ?? DEFAULT_SQLITE_WAL_AUTOCHECKPOINT_PAGES, "autoCheckpointPages");
	const checkpointIntervalMs = normalizeSqliteNonNegativeInteger(options.checkpointIntervalMs ?? DEFAULT_SQLITE_WAL_CHECKPOINT_INTERVAL_MS, "checkpointIntervalMs");
	const timerIntervalMs = Math.min(checkpointIntervalMs, MAX_TIMER_TIMEOUT_MS);
	const checkpointTickMs = checkpointIntervalMs > DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS ? DEFAULT_SQLITE_WAL_CHECKPOINT_TICK_MS : 0;
	const checkpointMode = options.checkpointMode ?? "TRUNCATE";
	const periodicCheckpointMode = options.checkpointMode ?? "PASSIVE";
	const journalPolicy = options.databasePath ? resolvePathJournalPolicy(options.databasePath) : "wal";
	if (journalPolicy === "unsupported") refuseUnsupportedFilesystem(options);
	if (journalPolicy === "rollback") requireRollbackJournalMode(db, options);
	if (journalPolicy === "rollback" || !enableWalJournalMode(db, busyTimeoutMs, options)) return {
		checkpoint: () => true,
		reclaimFreePages: (reclaimOptions = {}) => reclaimSqliteWalFreePages(db, () => true, reclaimOptions),
		stop: async () => {},
		close: () => true
	};
	enableMacosCheckpointFullfsync(db);
	db.exec(`PRAGMA wal_autocheckpoint = ${isSqliteWalWorkerMaintained(db) ? 0 : autoCheckpointPages};`);
	db.exec(`PRAGMA journal_size_limit = ${DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES};`);
	const tripwireDatabasePath = process.platform === "linux" && options.databasePath && fs.existsSync(options.databasePath) ? fs.realpathSync.native(options.databasePath) : void 0;
	let invalidated = false;
	let splitBrainDetectionEnabled = Boolean(tripwireDatabasePath);
	const checkpointOwner = createSqliteWalCheckpoint(db, options, DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES);
	const runCheckpoint = checkpointOwner.checkpoint;
	const runMaintenance = (operation) => {
		if (invalidated) return false;
		try {
			return options.runMaintenance ? options.runMaintenance(operation) : operation();
		} catch (error) {
			checkpointOwner.recordError(error);
			return false;
		}
	};
	const checkpoint = () => runMaintenance(() => runCheckpoint(checkpointMode));
	const reclaimFreePages = (reclaimOptions = {}) => {
		let result;
		let failure;
		runMaintenance(() => {
			try {
				result = reclaimSqliteWalFreePages(db, runCheckpoint, reclaimOptions);
				return result.checkpointCompleted;
			} catch (error) {
				failure = { error };
				throw error;
			}
		});
		if (failure) throw failure.error;
		if (!result) throw new Error("SQLite page reclamation owner is unavailable");
		return {
			...result,
			checkpoint: checkpointOwner.snapshot
		};
	};
	const scope = maintenanceScheduler.scope();
	const maintenanceId = `sqlite-wal:${++nextMaintenanceId}`;
	let nextPageBudget = 0;
	let completedTickRevision;
	const maintainPeriodic = (request, admit, maintain) => {
		if (invalidated) return { reclaimedPages: 0 };
		if (request.checkpoint) checkpointOwner.adopt(request.checkpoint);
		let reclaimedPages = 0;
		const quiet = request.maxPages === 0;
		const checkpointOnly = quiet && request.checkpointMode === "PASSIVE";
		const writeRevision = checkpointOnly ? readSqliteDatabaseWriteRevision(db) : void 0;
		const sharedCompletion = writeRevision === void 0 ? void 0 : sharedCompletedCheckpoint(db, writeRevision);
		const completedBySibling = sharedCompletion !== void 0 && Atomics.load(sharedCompletion, 0) === writeRevision;
		if (writeRevision !== void 0 && (completedBySibling || writeRevision === completedTickRevision && checkpointOwner.health?.state === "complete")) return {
			reclaimedPages: 0,
			checkpoint: checkpointOwner.health?.state === "complete" ? checkpointOwner.snapshot : void 0
		};
		const runTickCheckpoint = (mode) => checkpointOwner.checkpoint(mode, { quiet });
		completedTickRevision = runMaintenance(() => {
			let checkpointed;
			if (checkpointOnly) {
				admit?.("transaction");
				checkpointed = runTickCheckpoint("PASSIVE");
			} else {
				const reclaimed = reclaimSqliteWalFreePages(db, runTickCheckpoint, {
					checkpointMode: request.checkpointMode,
					maxPages: request.maxPages,
					beforeMutation: () => admit?.("transaction"),
					onCommit: () => admit?.("commit")
				});
				checkpointed = reclaimed.checkpointCompleted;
				if (checkpointed && reclaimed.freePagesBefore !== null && reclaimed.remainingFreePages !== null) reclaimedPages = Math.min(reclaimed.vacuumPagesRequested, reclaimed.freePagesBefore - reclaimed.remainingFreePages);
			}
			if (checkpointed && request.checkpointMode === "PASSIVE" && (checkpointOwner.health?.walBytes ?? 0) > DEFAULT_SQLITE_WAL_JOURNAL_SIZE_LIMIT_BYTES) {
				admit?.("transaction");
				runWithSqliteBusyTimeout(db, 0, () => runTickCheckpoint("TRUNCATE"));
			}
			if (checkpointed && request.maxPages > 0 && !request.continuation) try {
				maintain?.();
			} catch (error) {
				if (!isSqliteLockError(error)) throw error;
			}
			return checkpointed;
		}) && checkpointOwner.health?.state === "complete" ? writeRevision : void 0;
		if (sharedCompletion && completedTickRevision !== void 0) Atomics.store(sharedCompletion, 0, completedTickRevision);
		return {
			reclaimedPages,
			checkpoint: checkpointOwner.snapshot
		};
	};
	let stopCheckpointTick;
	const maintain = createSqliteWalMaintenanceScheduler(db, maintainPeriodic, (maxPages) => timerIntervalMs > 0 && !scope.signal.aborted && !invalidated && !options.isScheduledMaintenanceSuspended?.() ? {
		maxPages,
		checkpointMode: periodicCheckpointMode,
		checkpoint: checkpointOwner.snapshot
	} : void 0, checkpointOwner.adopt, (error) => checkpointOwner.recordError(error), () => {
		const budget = nextPageBudget;
		nextPageBudget = 0;
		return budget;
	}, () => stopCheckpointTick?.());
	const schedule = (phase, intervalMs, run) => runInDetachedAsyncContext(() => scope.schedule({
		id: `${maintenanceId}:${phase}`,
		delayMs: intervalMs,
		everyMs: intervalMs,
		run
	}));
	if (timerIntervalMs > 0) schedule("periodic", timerIntervalMs, () => {
		if (tripwireDatabasePath && splitBrainDetectionEnabled) {
			let splitBrain;
			try {
				splitBrain = detectSqliteWalSplitBrain(tripwireDatabasePath);
			} catch (error) {
				splitBrainDetectionEnabled = false;
				log$1.warn("SQLite WAL split-brain detection disabled", {
					databaseLabel: options.databaseLabel,
					databasePath: tripwireDatabasePath,
					error: error instanceof Error ? error.message : String(error)
				});
			}
			if (splitBrain) {
				invalidated = true;
				scope.beginClose();
				terminateForSqliteWalSplitBrain(splitBrain, options.databaseLabel);
			}
		}
		nextPageBudget = 512;
		return maintain();
	});
	if (checkpointTickMs > 0 && !isSqliteWalWorkerMaintained(db)) {
		let stopped = false;
		let tick;
		const cancelTick = () => {
			tick?.cancel();
			tick = void 0;
		};
		const armTick = () => {
			if (!stopped && !tick && !scope.signal.aborted && !invalidated) tick = runInDetachedAsyncContext(() => scope.schedule({
				id: `${maintenanceId}:tick`,
				delayMs: checkpointTickMs,
				run: runTick
			}));
		};
		const runTick = async () => {
			tick = void 0;
			await maintain();
			if (stopped) return;
			const revision = readSqliteDatabaseWriteRevision(db);
			const completed = revision === void 0 ? void 0 : sharedCompletedCheckpoint(db, revision);
			if (completed && Atomics.load(completed, 0) === revision) cancelTick();
			else armTick();
		};
		const unregisterWrites = periodicCheckpointMode === "PASSIVE" ? onSqliteDatabaseWriteSettled(db, armTick) : void 0;
		if (unregisterWrites) {
			stopCheckpointTick = () => {
				stopped = true;
				unregisterWrites();
				cancelTick();
			};
			armTick();
		} else stopCheckpointTick = schedule("tick", checkpointTickMs, maintain).cancel;
	}
	const beginClose = () => {
		stopCheckpointTick?.();
		runInDetachedAsyncContext(() => scope.beginClose());
		return cancelSqliteWalWriteAdmission(db);
	};
	return {
		get health() {
			return checkpointOwner.health;
		},
		checkpoint,
		maintainPeriodic,
		reclaimFreePages,
		inspectIdle: () => runMaintenance(checkpointOwner.inspectIdle) ? "healthy" : "retire",
		stop: async () => {
			try {
				await beginClose();
			} finally {
				await runInDetachedAsyncContext(() => scope.stop());
			}
		},
		close: (closeOptions) => {
			beginClose();
			if (invalidated || isSqliteWalWorkerMaintained(db)) return false;
			return runMaintenance(() => runCheckpoint(closeOptions?.checkpointMode ?? checkpointMode));
		}
	};
}
let lastSqliteExitGroup;
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
/** Configure per-connection SQLite pragmas in the safe lock-retry/WAL order. */
function configureSqliteConnectionPragmas(db, options = {}) {
	const { foreignKeys, synchronous, ...walOptions } = options;
	const maintenance = configureSqliteWalMaintenance(db, walOptions);
	try {
		if (synchronous) db.exec(`PRAGMA synchronous = ${synchronous};`);
		if (foreignKeys) db.exec("PRAGMA foreign_keys = ON;");
		return maintenance;
	} catch (error) {
		try {
			maintenance.close();
		} catch (closeError) {
			throw createSqliteLifecycleAggregateError([error, closeError], "SQLite connection pragma configuration and WAL maintenance cleanup both failed.", error);
		}
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-schema-header.ts
function readSqliteWriterAppVersion(database) {
	try {
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select("app_version").where("meta_key", "=", "primary").limit(1));
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function sqliteSnapshotSourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function emitSqliteSnapshotTelemetry(fields, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
			...fields,
			errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
		}, "SQLite snapshot operation completed.");
	} catch {}
}
function waitForSnapshotRetrySync(attempt) {
	if (attempt + 1 >= 10) return;
	const delayMs = Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
function createSnapshotAttemptReporter(pathname) {
	const started = performance.now();
	return (operation, outcome, prepared, error) => {
		try {
			emitSqliteSnapshotTelemetry({
				attempt: 1,
				copiedBytes: prepared ? fs.statSync(prepared.location).size : 0,
				durationMs: Math.max(0, performance.now() - started),
				operation,
				outcome,
				sourceMainBytes: sqliteSnapshotSourceFileSize(pathname),
				sourceWalBytes: sqliteSnapshotSourceFileSize(`${pathname}-wal`),
				owner: "path-reader"
			}, error);
		} catch {}
	};
}
//#endregion
//#region src/infra/disk-space.ts
function finiteNonNegativeNumber(value) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}
function findExistingDiskSpacePath(targetPath) {
	let current = path.resolve(targetPath);
	while (true) try {
		return fs.statSync(current).isDirectory() ? current : path.dirname(current);
	} catch {
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
/** Reads available bytes for the volume containing a target path when statfs is available. */
function tryReadDiskSpace(targetPath) {
	if (typeof fs.statfsSync !== "function") return null;
	const checkedPath = findExistingDiskSpacePath(targetPath);
	if (!checkedPath) return null;
	try {
		const stats = fs.statfsSync(checkedPath);
		const blockSize = finiteNonNegativeNumber(stats.bsize);
		const availableBlocks = finiteNonNegativeNumber(stats.bavail);
		if (blockSize === null || availableBlocks === null) return null;
		const totalBlocks = finiteNonNegativeNumber(stats.blocks);
		return {
			targetPath,
			checkedPath,
			availableBytes: blockSize * availableBlocks,
			totalBytes: totalBlocks === null ? null : blockSize * totalBlocks
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
const currentAgeMs = 9e5;
const reclamationByteBudget = 536870912;
function sqliteSnapshotStagingParent(root) {
	const parent = path.basename(root) === "openclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
function warnSqliteSnapshotReclamation(message, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ errorCode: extractErrorCode(error) }, message);
	} catch {}
}
/** A private reader protects its bytes independently of the staging child. */
function acquireSqliteSnapshotReadToken(directory) {
	return acquireSqliteSnapshotToken(directory, "read");
}
/** Reconcile only after the token process closed; active readers still fence reclamation. */
function reconcileSqliteSnapshotRetirement(directory) {
	if (!fs.lstatSync(directory, { throwIfNoEntry: false })) return;
	const retirement = beginSqliteSnapshotRetirement(directory, { cutoff: Number.POSITIVE_INFINITY });
	try {
		retireSqliteSnapshotPayload(retirement);
	} finally {
		retirement.release();
	}
}
function* reclaimAbandonedSqliteSnapshots(root, report = warnSqliteSnapshotReclamation) {
	if (sqliteSnapshotStagingParent(root)) return;
	try {
		let admittedBytes = 0;
		for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
			if (admittedBytes >= reclamationByteBudget) {
				report("Stopped SQLite snapshot reclamation: byte budget exhausted for this pass.");
				break;
			}
			const legacy = SQLITE_SNAPSHOT_LEGACY_MARKER.test(entry.name);
			if (!entry.isDirectory() || !isSqliteSnapshotStagingName(entry.name)) continue;
			const directory = path.join(root, entry.name);
			let retirement;
			try {
				retirement = beginSqliteSnapshotRetirement(directory, { cutoff: Date.now() - (legacy ? SQLITE_SNAPSHOT_LEGACY_AGE_MS : currentAgeMs) });
				const { bytes } = retirement;
				if (admittedBytes > 0 && bytes > reclamationByteBudget - admittedBytes) throw new Error("Snapshot reclamation byte budget exhausted for this pass");
				admittedBytes += bytes;
				retireSqliteSnapshotPayload(retirement);
				const claimed = path.join(root, `${legacy ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX}${randomUUID()}`);
				fs.renameSync(directory, claimed);
				if (!removeTempDirectory(claimed)) throw new Error("Snapshot removal failed; check private cache permissions");
				report(`Reclaimed ${bytes} bytes of interrupted SQLite snapshot data.`);
			} catch (error) {
				report(`Skipped SQLite snapshot reclamation: ${formatErrorMessage(error)}`, error);
			} finally {
				try {
					retirement?.release();
				} catch (error) {
					report("SQLite snapshot token close failed; retaining native cleanup custody.", error);
				}
			}
			yield;
		}
	} catch (error) {
		report("SQLite snapshot reclamation failed; check private cache permissions.", error);
	}
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false, sourcePath) {
	markSqliteInspectionOperation(cause, "snapshot");
	let destination = allocation;
	let capacity = false;
	let sqliteErrcode;
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		capacity ||= ["ENOSPC", "EDQUOT"].includes(code ?? "") || errcode === 13;
		if (capacity || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			destination = true;
			if (typeof errcode === "number") sqliteErrcode = errcode;
		}
		error = error.cause;
	}
	if (!destination) return cause;
	const guidance = capacity ? "free disk space/quota" : "check filesystem health and write permissions";
	let capacityDetail = "";
	if (capacity && sourcePath) try {
		const estimatedBytes = sqliteSnapshotSourceFileSize(sourcePath) + sqliteSnapshotSourceFileSize(`${sourcePath}-wal`) + sqliteSnapshotSourceFileSize(`${sourcePath}-journal`);
		const availableBytes = tryReadDiskSpace(tempDir)?.availableBytes;
		const liveWal = fs.existsSync(`${sourcePath}-wal`) && fs.existsSync(`${sourcePath}-shm`);
		capacityDetail = `; estimated ${estimatedBytes} bytes needed; ${availableBytes === void 0 ? "available bytes unknown" : `${availableBytes} bytes available`}; source ${liveWal ? "has live WAL sidecars" : "has no live WAL sidecars"}`;
	} catch {}
	const selector = process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "TMPDIR" : "XDG_CACHE_HOME";
	const message = `${cause instanceof Error ? cause.message : String(cause)}${sqliteErrcode !== void 0 ? ` (SQLite errcode=${sqliteErrcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}${capacityDetail}: ${guidance} or set ${selector} to a writable filesystem`;
	const error = new Error(message, { cause });
	return isPrivateDirectoryCreationRefused(cause) ? markPrivateDirectoryCreationRefused(error) : error;
}
async function createSqliteSnapshotStagingDirectory(stagingRoot = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	try {
		return await allocateSqliteSnapshotStagingDirectory(stagingRoot, allowLegacyWorker, signal, asynchronousCleanup);
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) throw error;
		signal?.throwIfAborted();
		markSqliteInspectionOperation(error, "snapshot");
		throw error;
	}
}
async function allocateSqliteSnapshotStagingDirectory(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) {
		const controller = new AbortController();
		return retainSnapshotWork((async () => {
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await import("./sqlite-readonly-sqlite-snapshot-staging-allocation-BytVSWMR.mjs");
			signal?.throwIfAborted();
			controller.signal.throwIfAborted();
			const owned = await allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal ? AbortSignal.any([signal, controller.signal]) : controller.signal);
			registerSnapshotTempDirectory(owned.directory);
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
	let directory;
	try {
		try {
			directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		} catch (error) {
			throw sqliteSnapshotStagingError(root, error, true);
		}
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	}
}
function readUint32(buffer, offset, byteOrder) {
	return byteOrder === "LE" ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
/** Frames chain their checksum from the previous frame (or the WAL header). */
function sqliteWalChecksum(buffer, byteOrder, seed = [0, 0]) {
	let [first, second] = seed;
	for (let offset = 0; offset < buffer.length; offset += 8) {
		first = first + readUint32(buffer, offset, byteOrder) + second >>> 0;
		second = second + readUint32(buffer, offset + 4, byteOrder) + first >>> 0;
	}
	return [first, second];
}
//#endregion
//#region src/infra/sqlite-snapshot-wal-prefix.ts
const WAL_HEADER_BYTES = 32;
const WAL_FRAME_HEADER_BYTES = 24;
const COPY_BUFFER_BYTES = 1048576;
function readWalGeneration(descriptor) {
	const header = Buffer.alloc(WAL_HEADER_BYTES);
	if (readFileWindowFullySync(descriptor, header, 0) !== header.length) return;
	const magic = header.readUInt32BE(0);
	if (magic !== 931071618 && magic !== 931071619) return;
	const byteOrder = magic === 931071618 ? "LE" : "BE";
	const pageSize = header.readUInt32BE(8);
	const [first, second] = sqliteWalChecksum(header.subarray(0, 24), byteOrder);
	if (pageSize < 512 || pageSize > 65536 || (pageSize & pageSize - 1) !== 0 || header.readUInt32BE(24) !== first || header.readUInt32BE(28) !== second) return;
	return {
		header,
		byteOrder,
		frameBytes: WAL_FRAME_HEADER_BYTES + pageSize
	};
}
/**
* Copy the frames SQLite recovery would accept, up to the last commit frame
* within the file length observed at capture. A restarted WAL rewrites frames
* from offset 0 over a stale tail, so bytes past the last valid commit are
* neither part of this generation's committed state nor stable under writers.
*/
function copyCommittedWalFrames(source, target, generation, walBytes) {
	const { header, byteOrder, frameBytes } = generation;
	if (readWalGeneration(source)?.header.equals(header) !== true) return false;
	const salt = header.subarray(16, 24);
	let checksum = [header.readUInt32BE(24), header.readUInt32BE(28)];
	writeFully(target, header, 0);
	let committedEnd = WAL_HEADER_BYTES;
	const framesPerWindow = Math.max(1, Math.floor(COPY_BUFFER_BYTES / frameBytes));
	const buffer = Buffer.allocUnsafe(framesPerWindow * frameBytes);
	for (let position = WAL_HEADER_BYTES; position < walBytes;) {
		const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
		const bytesRead = readFileWindowFullySync(source, window, position);
		let validBytes = 0;
		let complete = true;
		for (let offset = 0; offset + frameBytes <= bytesRead; offset += frameBytes) {
			const frame = window.subarray(offset, offset + frameBytes);
			if (frame.readUInt32BE(0) === 0 || !frame.subarray(8, 16).equals(salt)) {
				complete = false;
				break;
			}
			const next = sqliteWalChecksum(frame.subarray(WAL_FRAME_HEADER_BYTES), byteOrder, sqliteWalChecksum(frame.subarray(0, 8), byteOrder, checksum));
			if (frame.readUInt32BE(16) !== next[0] || frame.readUInt32BE(20) !== next[1]) {
				complete = false;
				break;
			}
			checksum = next;
			validBytes = offset + frameBytes;
			if (frame.readUInt32BE(4) !== 0) committedEnd = position + validBytes;
		}
		if (validBytes > 0) writeFully(target, window.subarray(0, validBytes), position);
		if (!complete || validBytes < window.length) break;
		position += validBytes;
	}
	fs.ftruncateSync(target, committedEnd);
	fs.fsyncSync(target);
	return committedEnd;
}
function writeFully(target, bytes, position) {
	for (let offset = 0; offset < bytes.length;) {
		const written = fs.writeSync(target, bytes, offset, bytes.length - offset, position + offset);
		if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
		offset += written;
	}
}
function matchesCapturedWalPrefix(source, destination, bytes) {
	const copy = fs.openSync(destination, "r");
	try {
		const stat = fs.fstatSync(copy);
		if (!stat.isFile() || stat.size !== bytes) return false;
		const sourceBuffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, bytes));
		const copyBuffer = Buffer.allocUnsafe(sourceBuffer.length);
		for (let position = 0; position < bytes; position += sourceBuffer.length) {
			const length = Math.min(sourceBuffer.length, bytes - position);
			const sourceWindow = sourceBuffer.subarray(0, length);
			const copyWindow = copyBuffer.subarray(0, length);
			if (readFileWindowFullySync(source, sourceWindow, position) !== length || readFileWindowFullySync(copy, copyWindow, position) !== length || !sourceWindow.equals(copyWindow)) return false;
		}
		return true;
	} finally {
		fs.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function prepareSqliteWalPrefixCopy(source, destination, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	return () => {
		const walBytes = fs.fstatSync(source).size;
		if (!Number.isSafeInteger(walBytes) || walBytes < WAL_HEADER_BYTES) return false;
		const target = fs.openSync(destination, "wx", 384);
		let committedBytes;
		try {
			committedBytes = copyCommittedWalFrames(source, target, generation, walBytes);
		} finally {
			fs.closeSync(target);
		}
		return committedBytes !== false && verifyMainCopy() && matchesCapturedWalPrefix(source, destination, committedBytes) && readWalGeneration(source)?.header.equals(generation.header) === true;
	};
}
//#endregion
//#region src/infra/process-env.ts
/** Read one environment value using the same Windows key precedence as child_process. */
function resolveEnvironmentValue(env, name, platform = process.platform) {
	if (!env) return;
	if (platform !== "win32") return env[name] ?? (name === "PATH" ? env.Path : void 0);
	const normalizedName = name.toUpperCase();
	const key = Object.keys(env).toSorted().find((candidate) => candidate.toUpperCase() === normalizedName);
	return key === void 0 ? void 0 : env[key];
}
/** Merge child environments while preserving Node's platform-specific key semantics. */
function mergeProcessEnv(sources, platform = process.platform) {
	const merged = Object.create(null);
	const mergedKeys = /* @__PURE__ */ new Map();
	for (const source of sources) {
		if (!source) continue;
		const keys = Object.keys(source);
		const sourceKeys = /* @__PURE__ */ new Set();
		for (const key of platform === "win32" ? keys.toSorted() : keys) {
			const normalizedKey = platform === "win32" ? key.toUpperCase() : void 0;
			if (normalizedKey !== void 0) {
				if (sourceKeys.has(normalizedKey)) continue;
				sourceKeys.add(normalizedKey);
				const previousKey = mergedKeys.get(normalizedKey);
				if (previousKey !== void 0) delete merged[previousKey];
				mergedKeys.delete(normalizedKey);
			}
			const value = source[key];
			if (value === void 0) delete merged[key];
			else {
				merged[key] = value;
				if (normalizedKey !== void 0 && Object.hasOwn(merged, key)) mergedKeys.set(normalizedKey, key);
			}
		}
	}
	return merged;
}
const DIAGNOSTIC_PROCESS_ENV_KEYS = /* @__PURE__ */ new Set([
	"PATH",
	"Path",
	"HOME",
	"USER",
	"LOGNAME",
	"TMPDIR",
	"TMP",
	"TEMP",
	"LANG",
	"LANGUAGE",
	"TZ",
	"LC_ALL",
	"LC_COLLATE",
	"LC_CTYPE",
	"LC_MESSAGES",
	"LC_MONETARY",
	"LC_NUMERIC",
	"LC_TIME",
	"LC_ADDRESS",
	"LC_IDENTIFICATION",
	"LC_MEASUREMENT",
	"LC_NAME",
	"LC_PAPER",
	"LC_TELEPHONE",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT",
	"SYSTEMDRIVE",
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"USERNAME",
	"USERDOMAIN",
	"APPDATA",
	"LOCALAPPDATA",
	"PROGRAMDATA",
	"ALLUSERSPROFILE",
	"PROGRAMFILES",
	"PROGRAMFILES(X86)",
	"PROGRAMW6432",
	"COMMONPROGRAMFILES",
	"COMMONPROGRAMFILES(X86)",
	"COMMONPROGRAMW6432",
	"PSMODULEANALYSISCACHEPATH"
]);
/** Project only native port/process diagnostic context; never mutate the parent environment. */
function resolveDiagnosticProcessEnv(env = process.env, platform = process.platform) {
	return Object.fromEntries(Object.entries(mergeProcessEnv([env], platform)).filter(([key]) => DIAGNOSTIC_PROCESS_ENV_KEYS.has(platform === "win32" ? key.toUpperCase() : key)));
}
//#endregion
//#region src/infra/windows-process-start.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_PROCESS_START_TIMEOUT_MS = 1e4;
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
function readNativeProcessStartTime(pid) {
	if (process.platform !== "win32" || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity && !identity.exited ? Math.floor(identity.startTimeMicros / 1e3) : null;
	} catch {
		return;
	}
}
function windowsSystemRoot(env) {
	const configured = resolveEnvironmentValue(env, "SystemRoot", "win32") ?? resolveEnvironmentValue(env, "WINDIR", "win32");
	if (!configured) return DEFAULT_WINDOWS_SYSTEM_ROOT;
	const normalized = path.win32.normalize(configured);
	return /^[A-Za-z]:\\/.test(normalized) && !normalized.startsWith("\\\\") ? normalized : DEFAULT_WINDOWS_SYSTEM_ROOT;
}
function windowsPowerShellPath(env) {
	return path.win32.join(windowsSystemRoot(env), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
}
function windowsWmicPath(env) {
	return path.win32.join(windowsSystemRoot(env), "System32", "wbem", "wmic.exe");
}
function decodeWindowsProcessOutput(output) {
	if (!Buffer.isBuffer(output)) return output;
	return output.length >= 2 && output[0] === 255 && output[1] === 254 ? output.toString("utf16le") : output.toString("utf8");
}
function parseWindowsProcessStartTime(raw) {
	const lines = decodeWindowsProcessOutput(raw).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
	const value = lines.find((line) => line.toLowerCase().startsWith("creationdate="))?.slice(13).trim() ?? lines.find((line) => line.toLowerCase() !== "creationdate") ?? "";
	const parsedIso = Date.parse(value);
	if (Number.isFinite(parsedIso)) return parsedIso;
	const dmtf = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.(\d{6})([+-])(\d{3})$/);
	if (!dmtf) return null;
	const [, year, month, day, hour, minute, second, microseconds, offsetSign, offset] = dmtf;
	return Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Math.floor(Number(microseconds) / 1e3)) - Number(offset) * 6e4 * (offsetSign === "+" ? 1 : -1);
}
/** Read a stable Windows process creation time for lock-owner identity checks. */
function readWindowsProcessStartTimeSync(pid, timeoutMs = DEFAULT_PROCESS_START_TIMEOUT_MS, env = process.env) {
	if (!Number.isInteger(pid) || pid <= 0 || pid > 4294967295) return null;
	const deadline = Date.now() + timeoutMs;
	const nativeStartTime = readNativeProcessStartTime(pid);
	if (nativeStartTime !== void 0) return nativeStartTime;
	const powershellBudgetMs = deadline - Date.now();
	if (powershellBudgetMs <= 0) return null;
	const powershell = spawnSync(windowsPowerShellPath(env), [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		`$process = [System.Diagnostics.Process]::GetProcessById(${pid}); try { [Console]::Out.Write($process.StartTime.ToUniversalTime().ToString("o")) } finally { $process.Dispose() }`
	], {
		encoding: "utf8",
		env: resolveDiagnosticProcessEnv(env, "win32"),
		timeout: Math.min(powershellBudgetMs, DEFAULT_TIMEOUT_MS),
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const startTime = parseWindowsProcessStartTime(powershell.stdout);
		if (startTime !== null) return startTime;
	}
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) return null;
	const wmic = spawnSync(windowsWmicPath(env), [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CreationDate",
		"/value"
	], {
		env: resolveDiagnosticProcessEnv(env, "win32"),
		timeout: remainingMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	return !wmic.error && wmic.status === 0 ? parseWindowsProcessStartTime(wmic.stdout) : null;
}
//#endregion
//#region src/shared/freebsd-process-identity-native.ts
let identity;
/** Normal installations use the dependency's public loader. */
function loadFreeBsdProcessIdentityNative() {
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("FreeBSD process identity is unavailable in this sealed runtime");
	if (!identity) identity = createRequire(import.meta.url)("@openclaw/proc-safe/identity");
	return identity;
}
//#endregion
//#region src/shared/freebsd-process-identity.ts
/** Read the kernel's monotonic process start time in microseconds. */
function readFreeBsdProcessStartTime(pid) {
	if (process.platform !== "freebsd" || !Number.isInteger(pid) || pid <= 0 || pid > 2147483647) return null;
	try {
		return loadFreeBsdProcessIdentityNative().readProcessIdentity(pid)?.startTimeSinceBootMicros ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/shared/pid-alive.ts
const PROCESS_START_TIMEOUT_MS = 1e3;
function readDarwinNativeIdentity(pid) {
	if (process.platform !== "darwin" || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity && !identity.exited ? {
			startedAt: Math.floor(identity.startTimeMicros / 1e6),
			startTimeMicros: identity.startTimeMicros
		} : null;
	} catch {
		return;
	}
}
/** Unknown observations never prove death; Linux keeps its thread-aware procfs policy. */
function readNativeLiveness(pid) {
	if (![
		"darwin",
		"win32",
		"freebsd"
	].includes(process.platform) || typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity !== null && !identity.exited;
	} catch (error) {
		if (error instanceof ProcSafeError && (error.code === "helper-unavailable" || error.code === "unsupported-platform")) return;
		return true;
	}
}
let selfStartTime = null;
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Reject recycled worker TIDs and terminal leaders without live sibling threads.
* Missing or reaped procfs snapshots require a fresh existence probe.
*/
function isExitedLinuxProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fs.readFileSync(`/proc/${pid}/status`, "utf8");
		const state = status.match(/^State:\s+(\S)/m)?.[1];
		const threads = status.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];
		if (threads !== "0") {
			const tgid = status.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];
			return tgid !== void 0 && Number(tgid) !== pid || (state === "Z" || state === "X") && threads === "1";
		}
	} catch {}
	try {
		process.kill(pid, 0);
	} catch (error) {
		return error.code === "ESRCH";
	}
	return false;
}
/** Returns true only when a positive PID exists and is not a known terminal task. */
function isPidAlive(pid) {
	if (!isValidPid(pid)) return false;
	try {
		process.kill(pid, 0);
	} catch (error) {
		const code = error.code;
		if (code !== "EPERM") return code === "ESRCH" ? readNativeLiveness(pid) ?? false : false;
	}
	return readNativeLiveness(pid) ?? !isExitedLinuxProcess(pid);
}
/** Returns true only when the PID is invalid, missing, or a known terminal task. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (error) {
		if (error.code !== "ESRCH") return false;
		const native = readNativeLiveness(pid);
		return native === void 0 ? process.platform !== "freebsd" : !native;
	}
	const native = readNativeLiveness(pid);
	return native === void 0 ? isExitedLinuxProcess(pid) : !native;
}
function getDarwinProcessStartTime(pid, env, timeoutMs) {
	const started = performance.now();
	const native = readDarwinNativeIdentity(pid);
	if (native !== void 0) return native?.startedAt ?? null;
	const remainingMs = timeoutMs === void 0 ? PROCESS_START_TIMEOUT_MS : Math.ceil(timeoutMs - (performance.now() - started));
	if (remainingMs <= 0) return null;
	try {
		const startedAt = childProcess.execFileSync("/bin/ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...resolveDiagnosticProcessEnv(env),
				LC_ALL: "C",
				TZ: "UTC"
			},
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: remainingMs,
			killSignal: "SIGKILL"
		}).trim();
		const startedAtMs = Date.parse(`${startedAt} UTC`);
		return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
	} catch {
		return null;
	}
}
/** Read the Linux procfs start identity used by Linux-owned runtime state. */
function getProcessStartTime(pid) {
	if (!isValidPid(pid) || process.platform !== "linux") return null;
	try {
		const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEndIndex = stat.lastIndexOf(")");
		if (commEndIndex < 0) return null;
		const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
		const starttime = Number(fields[19]);
		return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
	} catch {
		return null;
	}
}
/** Custody recovery needs native birth precision rather than the shipped lease timestamp format. */
function getProcessInstanceStartTime(pid) {
	if (!isValidPid(pid)) return null;
	if (process.platform === "linux") {
		const startedAt = getProcessStartTime(pid);
		return Number.isSafeInteger(startedAt) ? startedAt : null;
	}
	const native = readDarwinNativeIdentity(pid);
	if (!native) return null;
	const startedAt = native.startTimeMicros;
	return Number.isSafeInteger(startedAt) ? startedAt : null;
}
/** Read a cross-platform process identity for filesystem lock ownership. */
function getFileLockProcessStartTime(pid, env = process.env, timeoutMs) {
	if (!isValidPid(pid)) return null;
	const isSelf = pid === process.pid;
	if (isSelf && selfStartTime !== null) return selfStartTime;
	const startTime = process.platform === "darwin" ? getDarwinProcessStartTime(pid, env, timeoutMs) : process.platform === "win32" ? readWindowsProcessStartTimeSync(pid, timeoutMs, env) : process.platform === "freebsd" ? readFreeBsdProcessStartTime(pid) : getProcessStartTime(pid);
	if (isSelf && startTime !== null) selfStartTime = startTime;
	return startTime;
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
function resolveDatabasePath(options = {}) {
	return options.path === void 0 ? resolveOpenClawStateSqlitePath(options.env ?? process.env) : normalizeDatabasePath(path.resolve(options.path));
}
function existingPathOrUndefined(pathname) {
	try {
		statSync(pathname);
		return pathname;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.dirname(resolveOpenClawStateSqlitePath(env));
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return normalizeDatabasePath(path.join(resolveStateDir(env), "state", "openclaw.sqlite"));
}
/** Resolve the state owner directory for a canonical or explicit shared database path. */
function resolveOpenClawStateDirForDatabasePath(databasePath) {
	const databaseDir = path.dirname(path.resolve(databasePath));
	return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
}
/** Resolve the integrity/quarantine store that survives loss of the primary state database. */
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
/** Resolve the durable registry form for one agent database path. */
function resolveOpenClawAgentDatabaseStoredPath(registryDatabasePath, agentDatabasePath) {
	const windows = process.platform === "win32";
	const rawStateDir = resolveOpenClawStateDirForDatabasePath(registryDatabasePath);
	let stateDir = windows ? normalizeWindowsPathPreservingCase(rawStateDir) : rawStateDir;
	const absolutePath = windows && path.isAbsolute(agentDatabasePath) ? agentDatabasePath : path.resolve(agentDatabasePath);
	const comparisonPath = windows ? normalizeWindowsPathPreservingCase(absolutePath) : absolutePath;
	if (!path.isAbsolute(stateDir) || !path.isAbsolute(comparisonPath)) return absolutePath;
	let relativePath = path.relative(stateDir, comparisonPath);
	const useCanonicalRoot = relativePath.startsWith("..") || path.isAbsolute(relativePath) || windows && !isPathInside(rawStateDir, absolutePath);
	if (useCanonicalRoot) {
		const canonicalRoot = resolveIdentityPathViaExistingAncestorSync(stateDir);
		if (windows && !isPathInside(canonicalRoot, absolutePath)) return absolutePath;
		stateDir = windows ? normalizeWindowsPathPreservingCase(canonicalRoot) : canonicalRoot;
		if (!path.isAbsolute(stateDir)) return absolutePath;
		relativePath = path.relative(stateDir, comparisonPath);
	}
	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return absolutePath;
	if (useCanonicalRoot && !windows) return relativePath;
	const rawPrefix = [stateDir, path.toNamespacedPath(stateDir)].map((root) => `${root}${root.endsWith(path.sep) ? "" : path.sep}`).find((prefix) => agentDatabasePath.startsWith(prefix));
	return path.isAbsolute(agentDatabasePath) && rawPrefix !== void 0 ? agentDatabasePath.slice(rawPrefix.length) : relativePath;
}
/** Resolve one stored agent database registry path for runtime consumers. */
function resolveOpenClawRegisteredAgentDatabasePath(registryDatabasePath, storedPath) {
	return path.isAbsolute(storedPath) ? storedPath : `${resolveOpenClawStateDirForDatabasePath(registryDatabasePath)}${path.sep}${storedPath}`;
}
function describeAgentPathMigration(summary) {
	const { relativized, reanchored, deleted } = summary;
	if (relativized === 0 && reanchored.length === 0 && deleted.length === 0) return [];
	const decisions = reanchored.length + deleted.length;
	const counts = [
		`${relativized} relativized`,
		reanchored.length > 0 && `${reanchored.length} re-anchored`,
		deleted.length > 0 && `${deleted.length} removed`
	].filter(Boolean);
	return [
		`Migrated agent database registry paths to state-relative storage${decisions > 0 ? ` (${counts.join(", ")})` : ""}`,
		...reanchored.map((registeredPath) => `Re-anchored agent database registry path ${registeredPath} to the current state directory`),
		...deleted.map((registeredPath) => `Removed duplicate agent database registry path ${registeredPath}`)
	];
}
function warnAgentPathMigration(log, summary, databasePath) {
	if (summary.reanchored.length === 0 && summary.deleted.length === 0) return;
	log.warn("agent database registry rows re-anchored or removed during v9 migration", {
		reanchored: summary.reanchored,
		deleted: summary.deleted,
		path: databasePath
	});
}
//#endregion
//#region src/state/openclaw-state-maintenance-context.ts
const liveAuthorityReads = resolveGlobalSingleton(Symbol.for("openclaw.maintenanceLiveAuthorityReads"), () => /* @__PURE__ */ new WeakMap());
function allowsMaintenanceLiveAuthorityReads(scope, pathname) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (liveAuthorityReads.get(current)?.has(canonicalPath)) return true;
	return false;
}
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Background work retains command custody without borrowing its native execution path. */
function isOpenClawDatabaseMaintenanceWorkerAccess() {
	return maintenanceResources.current.getStore()?.workerAccess === true;
}
/** Delayed work acquires its own resources instead of inheriting the completed scope. */
function runOutsideOpenClawDatabaseMaintenanceScope(operation) {
	return maintenanceResources.current.exit(operation);
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
function getOpenClawDatabaseMaintenanceResourceScope(resource) {
	return maintenanceResources.claims.get(resource)?.scope;
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.scope.assertAdmission();
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
function isStateDatabaseReadAdmissionInvalidatedError(error) {
	return extractErrorCode(error) === STATE_DATABASE_READ_ADMISSION_INVALIDATED;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const recordsByPath = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const proofFor = () => {
		const proof = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		new BigInt64Array(proof)[0] = -1n;
		return proof;
	};
	const generationFor = (identity) => {
		const revision = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		return { integrity: {
			identity,
			lifetime: {
				revision: new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT),
				epoch: 0n
			},
			revision,
			epoch: 0n,
			proof: proofFor()
		} };
	};
	const publishCreatedIdentity = (record, identity) => {
		Atomics.add(new BigInt64Array(record.generation.integrity.revision), 0, 1n);
		Atomics.add(new BigInt64Array(record.generation.integrity.lifetime.revision), 0, 1n);
		records.delete(record.identity.key);
		record.identity = identity;
		record.generation.integrity.identity = identity;
		records.set(identity.key, record);
	};
	const known = (pathname) => recordsByPath.get(pathname) ?? recordsByPath.get(resolveDatabasePath({ path: pathname }));
	const bindPath = (record, pathname) => {
		record.paths.add(pathname);
		if (!recordsByPath.has(pathname)) recordsByPath.set(pathname, record);
	};
	const overlaps = (left, right) => {
		if (left.identity.key === right.identity.key) return true;
		for (const pathname of left.paths) if (right.paths.has(pathname)) return true;
		return false;
	};
	const isSealed = (record) => {
		if (seals.size === 0) return false;
		for (const held of seals) if (held.record === void 0 || overlaps(held.record, record)) return true;
		return false;
	};
	const hasCloseCustody = (record) => isSealed(record) || attempts.has(record);
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || hasCloseCustody(record)) return record;
		for (const pathname of findChangedDatabasePaths(record.paths, identity)) {
			record.admissions.delete(pathname);
			record.paths.delete(pathname);
			if (recordsByPath.get(pathname) === record) recordsByPath.delete(pathname);
		}
		if (record.paths.size > 0) {
			if (!record.paths.has(record.identity.canonicalPath)) {
				record.identity = identity;
				record.generation.integrity.identity = identity;
			}
			return record;
		}
		invalidate(record);
		forget(record);
	};
	const resolve = (resolvedPath, preparedIdentity) => {
		const cached = recordsByPath.get(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) publishCreatedIdentity(record, identity);
		}
		if (!record) {
			record = {
				coordinationKey: identity.key,
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: generationFor(identity),
				admissions: /* @__PURE__ */ new Map()
			};
			records.set(identity.key, record);
		}
		bindPath(record, resolvedPath);
		bindPath(record, identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const cached = recordsByPath.get(resolvedPath);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(resolvedPath);
		return identity ? resolve(resolvedPath, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) {
			Atomics.store(new BigInt64Array(current.generation.integrity.revision), 0, -1n);
			Atomics.store(new BigInt64Array(current.generation.integrity.lifetime.revision), 0, -1n);
			current.generation = generationFor(current.identity);
			current.admissions.clear();
		}
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const release = (attempt) => {
		if (attempt.seal) {
			seals.delete(attempt.seal);
			attempt.seal = void 0;
		}
	};
	const forget = (record) => {
		if (!hasCloseCustody(record) && records.get(record.identity.key) === record) {
			records.delete(record.identity.key);
			for (const pathname of record.paths) if (recordsByPath.get(pathname) === record) {
				recordsByPath.delete(pathname);
				for (const replacement of records.values()) if (replacement.paths.has(pathname)) {
					recordsByPath.set(pathname, replacement);
					break;
				}
			}
		}
	};
	const captureRecord = (record, databasePath) => {
		const previous = record.admissions.get(databasePath);
		if (previous) return previous;
		const generation = record.generation;
		const admission = Object.freeze({
			databasePath,
			coordinationKey: record.coordinationKey,
			get identity() {
				return record.identity;
			},
			captureIntegrity() {
				admission.assertCurrent();
				const current = generation.integrity;
				const epoch = Atomics.load(new BigInt64Array(current.revision), 0);
				const lifetimeEpoch = Atomics.load(new BigInt64Array(current.lifetime.revision), 0);
				if (epoch !== current.epoch || lifetimeEpoch !== current.lifetime.epoch) generation.integrity = {
					...current,
					identity: record.identity,
					lifetime: {
						revision: current.lifetime.revision,
						epoch: lifetimeEpoch
					},
					epoch,
					proof: proofFor()
				};
				return generation.integrity;
			},
			assertCurrent() {
				assertOpen(record);
				if (records.get(record.identity.key) !== record || record.generation !== generation || record.admissions.get(databasePath) !== admission) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
			}
		});
		record.admissions.set(databasePath, admission);
		return admission;
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		integrity(pathname) {
			const record = resolveForNative(pathname);
			return record && !isSealed(record) ? captureRecord(record, resolveDatabasePath({ path: pathname })).captureIntegrity?.() : void 0;
		},
		publish(pathname) {
			const resolvedPath = resolveDatabasePath({ path: pathname });
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = recordsByPath.get(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					publishCreatedIdentity(previous, identity);
					record = previous;
				} else {
					const failed = attempts.get(previous);
					if (failed) {
						failed.superseded = true;
						failed.seal ??= seal(previous);
					} else invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			bindPath(record, resolvedPath);
			bindPath(record, identity.canonicalPath);
			return {
				identity,
				admission: captureRecord(record, resolvedPath)
			};
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const cached = recordsByPath.get(pathname);
			const retained = cached?.admissions.get(pathname);
			if (cached && retained && cached.identity.key.startsWith("file:")) {
				retained.assertCurrent();
				return retained;
			}
			const databasePath = resolveDatabasePath({ path: pathname });
			const record = resolve(databasePath);
			assertOpen(record);
			return captureRecord(record, databasePath);
		},
		holdExclusion(pathname) {
			const record = resolve(resolveDatabasePath({ path: pathname }));
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = { retained: /* @__PURE__ */ new Set() };
				attempts.set(record, attempt);
			}
			attempt.seal ??= seal(record);
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				if (errors.length && !current.superseded) release(current);
				throwSqliteLifecycleErrors(errors, "OpenClaw state resource drainage failed");
				const retired = await retireNative(record?.identity);
				attempts.delete(record);
				release(current);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						release(entry);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-options.js
function captureRootSyncAcquireOptions(options) {
	const lockPath = options.lockPath;
	const staleMsInput = options.staleMs;
	const timeoutMsInput = options.timeoutMs;
	const retryInput = options.retry;
	const staleRecoveryInput = options.staleRecovery;
	const reentrantOwner = options.reentrantOwner;
	const payload = options.payload;
	const shouldReclaim = options.shouldReclaim;
	const shouldRemoveStaleLock = options.shouldRemoveStaleLock;
	const parsePayload = options.parsePayload;
	const onCompromised = options.onCompromised;
	const compromiseCheckIntervalMs = options.compromiseCheckIntervalMs;
	const retrySnapshot = retryInput === void 0 ? void 0 : Object.freeze({
		retries: retryInput.retries,
		factor: retryInput.factor,
		minTimeout: retryInput.minTimeout,
		maxTimeout: retryInput.maxTimeout,
		randomize: retryInput.randomize
	});
	const defaults = getFsSafeLockConfig();
	const defaultRetry = defaults.retry;
	const retry = retrySnapshot ?? Object.freeze({
		retries: defaultRetry?.retries,
		factor: defaultRetry?.factor,
		minTimeout: defaultRetry?.minTimeout,
		maxTimeout: defaultRetry?.maxTimeout,
		randomize: defaultRetry?.randomize
	});
	const timeoutMs = timeoutMsInput ?? defaults.timeoutMs;
	const staleMs = staleMsInput ?? defaults.staleMs ?? 3e4;
	const staleRecovery = staleRecoveryInput ?? defaults.staleRecovery;
	validateSidecarLockRetryOptions(retry);
	validateSidecarLockTimeoutMs(timeoutMs);
	validateSidecarLockStaleMs(staleMs);
	validateSidecarLockCompromiseCheckIntervalMs(compromiseCheckIntervalMs);
	return Object.freeze({
		compromiseCheckIntervalMs,
		lockPath,
		onCompromised,
		optionsReceiver: options,
		parsePayload,
		payload,
		reentrantOwner,
		retry,
		shouldReclaim,
		shouldRemoveStaleLock,
		staleMs,
		staleRecovery,
		timeoutMs
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-admission.js
const SYNC_HELD_LOCKS_KEY = Symbol.for("fsSafe.syncSidecarLocks");
const SYNC_ADMISSIONS_KEY = Symbol.for("fsSafe.syncSidecarLockAdmissions");
const SYNC_CLEANUP_REGISTERED_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupRegistered");
const SYNC_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupHandler");
const SYNC_CLEANUP_REGISTRATION_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupRegistration");
const ROOT_SYNC_HELD_LOCKS_KEY$1 = Symbol.for("fsSafe.syncRootSidecarLocks.v1");
function foreignSyncHeldLock(route, target) {
	return globalThis[route === "raw" ? ROOT_SYNC_HELD_LOCKS_KEY$1 : SYNC_HELD_LOCKS_KEY]?.get(target);
}
function getSyncHeldLocks() {
	const globalWithState = globalThis;
	if (!globalWithState[SYNC_HELD_LOCKS_KEY]) globalWithState[SYNC_HELD_LOCKS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[SYNC_HELD_LOCKS_KEY];
}
function getSyncLockAdmissions() {
	const globalWithState = globalThis;
	if (!globalWithState[SYNC_ADMISSIONS_KEY]) globalWithState[SYNC_ADMISSIONS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[SYNC_ADMISSIONS_KEY];
}
function defaultSyncShouldReclaim(snapshot, staleMs, nowMs) {
	const createdAtMs = sidecarLockPayloadCreatedAtMs(snapshot.payload);
	if (createdAtMs !== null) return nowMs - createdAtMs > staleMs;
	if (!snapshot.stat) return true;
	return nowMs - ("mtimeNs" in snapshot.stat ? Number(snapshot.stat.mtimeNs) / 1e6 : snapshot.stat.mtimeMs) > staleMs;
}
function syncReclaimGuardExists(reclaimGuardPath) {
	try {
		return fs.lstatSync(reclaimGuardPath, { throwIfNoEntry: false }) !== void 0;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function ensureSyncLockExitCleanupRegistered(cleanup, lockPath, normalizedTargetPath) {
	ensureSidecarLockCleanupRegistered({
		event: "exit",
		registered: SYNC_CLEANUP_REGISTERED_KEY,
		registering: SYNC_CLEANUP_REGISTRATION_KEY,
		handler: SYNC_CLEANUP_HANDLER_KEY,
		reentryError: () => sidecarLockTimeout(lockPath, normalizedTargetPath)
	}, cleanup, true);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-acquisition.js
/** Owns local arbitration and retry state, independently of filesystem authority. */
var SyncLockAcquisition = class {
	lockPath;
	normalizedTargetPath;
	retry;
	timeoutMs;
	#admissions = getSyncLockAdmissions();
	#token = {};
	#owns = false;
	#startedAt = performance.now();
	#attempt = 0;
	#transientDenials = 0;
	constructor(lockPath, normalizedTargetPath, retry, timeoutMs) {
		this.lockPath = lockPath;
		this.normalizedTargetPath = normalizedTargetPath;
		this.retry = retry;
		this.timeoutMs = timeoutMs;
	}
	get owns() {
		return this.#owns;
	}
	hasToken() {
		return this.#admissions.get(this.normalizedTargetPath) === this.#token;
	}
	assert() {
		if (!this.hasToken()) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
	}
	reserve() {
		if (this.#owns) return;
		if (this.#admissions.has(this.normalizedTargetPath)) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
		this.#admissions.set(this.normalizedTargetPath, this.#token);
		this.#owns = true;
	}
	release() {
		if (this.#owns && this.hasToken()) this.#admissions.delete(this.normalizedTargetPath);
		this.#owns = false;
	}
	run(callback) {
		this.assert();
		try {
			return callback();
		} finally {
			this.assert();
		}
	}
	waitForRetry() {
		this.release();
		const delay = sidecarLockRetryDelay(this.retry, this.timeoutMs, performance.now() - this.#startedAt, this.#attempt);
		if (delay === void 0) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
		sleepSync(delay);
		this.#attempt += 1;
	}
	retryDenial(error) {
		if (!isTransientLockFileDenial(error, this.lockPath) || ++this.#transientDenials > 8) return false;
		try {
			this.waitForRetry();
		} catch (waitError) {
			if (waitError?.code === "file_lock_timeout") throw error;
			throw waitError;
		}
		return true;
	}
	monitor(held, handle, callback, interval, receiver, recordTimer) {
		if (!callback || (interval ?? 0) <= 0) return;
		const { lockPath, normalizedTargetPath } = this;
		const timer = setInterval(() => {
			let stillHeld;
			try {
				stillHeld = handle.verifyStillHeld();
			} catch {
				stillHeld = false;
			}
			if (!stillHeld && held.timer) {
				clearInterval(held.timer);
				held.timer = void 0;
				Reflect.apply(callback, receiver, [{
					lockPath,
					normalizedTargetPath
				}]);
			}
		}, interval);
		recordTimer?.(timer);
		held.timer = timer;
		timer.unref();
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-io.js
const MAX_SIDECAR_LOCK_PAYLOAD_BYTES = 1048576;
function observeDirectory(pathname, initial) {
	const stat = inspectDirectoryIdentitySync(pathname, void 0, initial);
	const realPath = realpathSync$1.native(pathForWindowsFilesystem(pathname));
	assertNoWindowsPathAlias(realPath, "filesystem", "sidecar lock parent uses a Windows filesystem namespace alias");
	if (!sameAbsolutePath(realPath, pathname)) throw new FsSafeError("path-mismatch", "sidecar lock parent changed during operation");
	return Object.freeze({
		identity: Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		}),
		path: pathname,
		realPath
	});
}
function assertDirectoryCurrent(receipt, initial) {
	inspectDirectoryIdentitySync(receipt.path, receipt.identity, initial);
	const currentReal = realpathSync$1.native(pathForWindowsFilesystem(receipt.path));
	assertNoWindowsPathAlias(currentReal, "filesystem", "sidecar lock parent uses a Windows filesystem namespace alias");
	if (currentReal !== receipt.realPath) throw new FsSafeError("path-mismatch", "sidecar lock parent changed during operation");
}
function assertRetainedParentCurrent(pathAuthority, parent) {
	const context = pathAuthority.authority.context;
	const sharedIdentity = parent.path === context.rootReal && parent.identity.dev === context.rootIdentity.dev && parent.identity.ino === context.rootIdentity.ino;
	let rootStat;
	assertRootIdentityCurrentSync(context, sharedIdentity ? (stat) => {
		rootStat = stat;
	} : void 0);
	assertDirectoryCurrent(parent, rootStat);
	assertRootIdentityCurrentSync(context);
}
function exactFileIdentity(stat) {
	return Object.freeze({
		dev: stat.dev,
		ino: stat.ino
	});
}
function assertRegularFile(stat, hardlinks) {
	if (stat.isSymbolicLink() || !stat.isFile()) throw new FsSafeError("not-file", "sidecar lock is not a regular file");
	if (hardlinks !== "allow" && stat.nlink > 1n) throw hardlinkedPathNotAllowedError();
}
function sameExactIdentity(left, right) {
	return left.dev === right.dev && left.ino === right.ino;
}
function assertFreshPathCurrent(pathAuthority) {
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
}
function missingAfterCurrentRead(pathAuthority, expectedReceipt) {
	if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, expectedReceipt.parent);
	else assertFreshPathCurrent(pathAuthority);
	return null;
}
function readFileLockSyncRootSnapshot(pathAuthority, options = {}) {
	const expectedReceipt = options.expectedReceipt;
	if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, expectedReceipt.parent);
	else assertFreshPathCurrent(pathAuthority);
	let before;
	try {
		before = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), expectedReceipt?.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || expectedReceipt && error instanceof FsSafeError && error.code === "path-mismatch") return missingAfterCurrentRead(pathAuthority, expectedReceipt);
		throw error;
	}
	assertRegularFile(before, pathAuthority.authority.hardlinks);
	const parent = expectedReceipt?.parent ?? observeDirectory(path.dirname(pathAuthority.path));
	let fd;
	let operationError;
	let operationFailed = false;
	try {
		try {
			fd = fs.openSync(pathForWindowsFilesystem(pathAuthority.path), resolveReadOpenFlags());
		} catch (error) {
			if (isNotFoundPathError(error)) return missingAfterCurrentRead(pathAuthority, expectedReceipt);
			options.onOpenFailure?.(error);
			throw error;
		}
		let opened;
		try {
			opened = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), exactFileIdentity(before));
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "path-mismatch") {
				if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
				else {
					assertDirectoryCurrent(parent);
					assertFreshPathCurrent(pathAuthority);
				}
				return null;
			}
			throw error;
		}
		assertRegularFile(opened, pathAuthority.authority.hardlinks);
		const raw = readFileDescriptorBoundedSync(fd, MAX_SIDECAR_LOCK_PAYLOAD_BYTES).toString("utf8");
		let after;
		try {
			after = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), exactFileIdentity(opened));
		} catch (error) {
			if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") {
				if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
				else {
					assertDirectoryCurrent(parent);
					assertFreshPathCurrent(pathAuthority);
				}
				return null;
			}
			throw error;
		}
		assertRegularFile(after, pathAuthority.authority.hardlinks);
		const stat = fs.fstatSync(fd, { bigint: true });
		if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
		else {
			assertDirectoryCurrent(parent);
			assertFreshPathCurrent(pathAuthority);
		}
		const snapshot = {
			raw,
			payload: null,
			stat
		};
		return Object.freeze({
			receipt: Object.freeze({
				identity: exactFileIdentity(opened),
				parent
			}),
			snapshot
		});
	} catch (error) {
		operationFailed = true;
		operationError = error;
		throw error;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch (closeError) {
			if (operationFailed) throw createSuppressedError(closeError, operationError, "sidecar snapshot admission and descriptor close both failed");
			throw closeError;
		}
	}
}
function fileLockSyncRootSnapshotStillCurrent(pathAuthority, observed) {
	const current = readFileLockSyncRootSnapshot(pathAuthority, { expectedReceipt: observed.receipt });
	return !!current && sameExactIdentity(current.receipt.identity, observed.receipt.identity) && sidecarLockSnapshotMatches(current.snapshot, observed.snapshot);
}
function fileReceiptCurrentAfterParentCheck(pathAuthority, receipt) {
	let current;
	try {
		current = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), receipt.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") return false;
		throw error;
	}
	assertRegularFile(current, pathAuthority.authority.hardlinks);
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
function fileLockSyncRootReceiptStillCurrent(pathAuthority, receipt) {
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return fileReceiptCurrentAfterParentCheck(pathAuthority, receipt);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-mutation.js
function ensureParent(pathAuthority) {
	const authority = pathAuthority.authority;
	const context = authority.context;
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	const targetParent = path.dirname(pathAuthority.path);
	const admitted = admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: targetParent,
		rootIdentity: context.rootIdentity
	});
	if (!admitted) throw outsideWorkspaceError();
	const relative = admitted.relativePath;
	let current = context.rootReal;
	let currentReceipt = observeDirectory(current);
	for (const segment of relative.split(path.sep).filter(Boolean)) {
		const next = path.join(current, segment);
		assertRootIdentityCurrentSync(context);
		assertDirectoryCurrent(currentReceipt);
		let missing = false;
		let existing;
		try {
			existing = fs.lstatSync(pathForWindowsFilesystem(next), { bigint: true });
			if (existing.isSymbolicLink() || !existing.isDirectory()) throw directoryComponentNotDirectoryError();
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			missing = true;
		}
		if (missing) {
			assertFileLockSyncRootMutationAllowed(next, authority.denyMutations);
			const mutationAuthorityInvoked = invokeFileLockSyncRootMutationAuthority(authority);
			if (mutationAuthorityInvoked) assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertDirectoryCurrent(currentReceipt);
			assertRootIdentityCurrentSync(context);
			if (mutationAuthorityInvoked) assertFileLockSyncRootMutationAllowed(next, authority.denyMutations);
			try {
				fs.mkdirSync(pathForWindowsFilesystem(next));
			} catch (error) {
				if (error.code !== "EEXIST") throw error;
			}
		}
		const nextReceipt = observeDirectory(next, existing);
		assertDirectoryCurrent(currentReceipt);
		current = nextReceipt.realPath;
		currentReceipt = nextReceipt;
	}
	assertRootIdentityCurrentSync(context);
	assertDirectoryCurrent(currentReceipt);
	return currentReceipt;
}
function createFileLockSyncRootFile(pathAuthority, options) {
	const parent = ensureParent(pathAuthority);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority)) {
		assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, parent);
	}
	const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
	let fd;
	let receipt;
	try {
		options.assertBeforeOpen();
		try {
			assertExclusiveCreateLeaf(pathForWindowsFilesystem(pathAuthority.path));
		} catch (error) {
			if (error.code === "EEXIST") options.onOpenFailure(error);
			throw error;
		}
		try {
			fd = fs.openSync(pathForWindowsFilesystem(pathAuthority.path), fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 384);
		} catch (error) {
			options.onOpenFailure(error);
			throw error;
		}
		const opened = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }));
		assertRegularFile(opened, pathAuthority.authority.hardlinks);
		receipt = Object.freeze({
			identity: exactFileIdentity(opened),
			parent
		});
		if (!fileReceiptCurrentAfterParentCheck(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before admission");
		return {
			fd,
			receipt
		};
	} catch (error) {
		if (fd === void 0) throw error;
		const failedFd = fd;
		fd = void 0;
		try {
			fs.closeSync(failedFd);
			if (receipt && !removeFileLockSyncRootFile(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before cleanup");
		} catch (cleanupError) {
			throw createSuppressedError(error, cleanupError, "file lock create admission and cleanup both failed");
		}
		throw error;
	}
}
function refreshFileLockSyncRootFileReceipt(pathAuthority, receipt) {
	if (!fileReceiptCurrentAfterParentCheck(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before admission");
	return receipt;
}
function removeFileLockSyncRootFile(pathAuthority, receipt, expected, assertBeforeRemove) {
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations);
	const matches = () => {
		if (!expected) return fileLockSyncRootReceiptStillCurrent(pathAuthority, receipt);
		const current = readFileLockSyncRootSnapshot(pathAuthority, { expectedReceipt: receipt });
		return !!current && sameExactIdentity(current.receipt.identity, receipt.identity) && sidecarLockSnapshotMatches(current.snapshot, expected);
	};
	if (!matches()) return false;
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority) && !matches()) return false;
	if (assertBeforeRemove?.() === false) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations);
	fs.unlinkSync(pathForWindowsFilesystem(pathAuthority.path));
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	let successorStat;
	try {
		successorStat = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }));
	} catch (error) {
		if (isNotFoundPathError(error)) return true;
		throw error;
	}
	assertRegularFile(successorStat, pathAuthority.authority.hardlinks);
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	if (!sameExactIdentity(exactFileIdentity(successorStat), receipt.identity)) return true;
	if (expected) {
		const successor = readFileLockSyncRootSnapshot(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, receipt.parent);
		if (successor) {
			if (!sameExactIdentity(successor.receipt.identity, receipt.identity) || !sidecarLockSnapshotMatches(successor.snapshot, expected)) return true;
		} else {
			let current;
			try {
				current = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }));
			} catch (error) {
				if (isNotFoundPathError(error)) {
					assertRetainedParentCurrent(pathAuthority, receipt.parent);
					return true;
				}
				throw error;
			}
			assertRegularFile(current, pathAuthority.authority.hardlinks);
			assertRetainedParentCurrent(pathAuthority, receipt.parent);
			if (!sameExactIdentity(exactFileIdentity(current), receipt.identity)) return true;
		}
	}
	throw new FsSafeError("path-mismatch", "sidecar lock was replaced during removal");
}
function fileLockSyncRootGuardExists(pathAuthority) {
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
	let stat;
	try {
		stat = fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true });
	} catch (error) {
		if (isNotFoundPathError(error)) {
			assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertRootIdentityCurrentSync(pathAuthority.authority.context);
			return false;
		}
		throw error;
	}
	if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw directoryComponentNotDirectoryError();
	if (stat.isFile()) assertRegularFile(stat, pathAuthority.authority.hardlinks);
	const parent = observeDirectory(path.dirname(pathAuthority.path));
	if (stat.isFile()) assertRegularFile(inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), exactFileIdentity(stat)), pathAuthority.authority.hardlinks);
	else inspectDirectoryIdentitySync(pathAuthority.path, exactFileIdentity(stat));
	assertDirectoryCurrent(parent);
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
	return true;
}
function createFileLockSyncRootDirectory(pathAuthority) {
	const parent = ensureParent(pathAuthority);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority)) {
		assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, parent);
	}
	try {
		fs.mkdirSync(pathForWindowsFilesystem(pathAuthority.path));
	} catch (error) {
		if (error.code === "EEXIST") return null;
		throw error;
	}
	const stat = inspectDirectoryIdentitySync(pathAuthority.path);
	const receipt = Object.freeze({
		identity: exactFileIdentity(stat),
		parent
	});
	assertRetainedParentCurrent(pathAuthority, parent);
	inspectDirectoryIdentitySync(pathAuthority.path, receipt.identity);
	return receipt;
}
function removeFileLockSyncRootDirectory(pathAuthority, receipt) {
	if (!fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt)) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations, true);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority) && !fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt)) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations, true);
	fs.rmdirSync(pathForWindowsFilesystem(pathAuthority.path));
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
function fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt) {
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	try {
		inspectDirectoryIdentitySync(pathAuthority.path, receipt.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") return false;
		throw error;
	}
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-registration.js
const ROOT_SYNC_CLEANUP_REGISTERING_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistering.v1");
const ROOT_SYNC_CLEANUP_REGISTERED_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistered.v1");
const ROOT_SYNC_CLEANUP_FAILED_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistrationFailed.v1");
const ROOT_SYNC_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupHandler.v1");
function unavailable(message) {
	return new FsSafeError("helper-unavailable", message);
}
function exactListenerCount(listener) {
	return process.listeners("exit").filter((candidate) => candidate === listener).length;
}
function ensureFileLockSyncRootExitCleanupRegistered(cleanupHandler) {
	const state = globalThis;
	if (state[ROOT_SYNC_CLEANUP_REGISTERED_KEY]) {
		if (typeof state[ROOT_SYNC_CLEANUP_HANDLER_KEY] === "function") return;
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
		throw unavailable("Root sidecar exit cleanup registration state is inconsistent");
	}
	if (state[ROOT_SYNC_CLEANUP_FAILED_KEY]) throw unavailable("Root sidecar exit cleanup registration previously failed");
	if (state[ROOT_SYNC_CLEANUP_REGISTERING_KEY]) throw unavailable("Root sidecar exit cleanup registration is already in progress");
	if (state[ROOT_SYNC_CLEANUP_HANDLER_KEY] !== void 0) {
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
		throw unavailable("Root sidecar exit cleanup handler exists without registration");
	}
	state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = true;
	let baselineCount;
	let registrationAttempted = false;
	let registrationStateAmbiguous = false;
	try {
		baselineCount = exactListenerCount(cleanupHandler);
		if (baselineCount !== 0) {
			registrationStateAmbiguous = true;
			throw unavailable("Root sidecar exit cleanup listener exists without registration");
		}
		registrationAttempted = true;
		process.on("exit", cleanupHandler);
		if (exactListenerCount(cleanupHandler) !== baselineCount + 1) throw unavailable("Root sidecar exit cleanup listener was not registered exactly once");
		state[ROOT_SYNC_CLEANUP_HANDLER_KEY] = cleanupHandler;
		state[ROOT_SYNC_CLEANUP_REGISTERED_KEY] = true;
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = false;
		state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = false;
	} catch (registrationError) {
		let rollbackFailed = false;
		let rollbackError;
		if (registrationAttempted && baselineCount !== void 0) try {
			let currentCount = exactListenerCount(cleanupHandler);
			while (currentCount > baselineCount) {
				process.removeListener("exit", cleanupHandler);
				const nextCount = exactListenerCount(cleanupHandler);
				if (nextCount >= currentCount) throw unavailable("Root sidecar exit cleanup listener rollback made no progress");
				currentCount = nextCount;
			}
			if (currentCount !== baselineCount) throw unavailable("Root sidecar exit cleanup listener rollback was ambiguous");
		} catch (error) {
			rollbackFailed = true;
			rollbackError = error;
		}
		state[ROOT_SYNC_CLEANUP_HANDLER_KEY] = void 0;
		state[ROOT_SYNC_CLEANUP_REGISTERED_KEY] = false;
		state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = false;
		if (registrationStateAmbiguous) {
			state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
			throw registrationError;
		}
		if (rollbackFailed) {
			state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
			throw createSuppressedError(registrationError, rollbackError, "Root sidecar exit cleanup registration and rollback both failed");
		}
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = false;
		throw registrationError;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-held.js
const ROOT_SYNC_HELD_LOCKS_KEY = Symbol.for("fsSafe.syncRootSidecarLocks.v1");
const ROOT_SYNC_CLEANUP_ACTIVE_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupActive.v1");
const MAX_CONTINUITY_CLEANUP_ATTEMPTS = 2;
const rootSyncHandleDispositions = /* @__PURE__ */ new WeakMap();
function readRootSyncHeldReleaseState(held) {
	return held.releaseState;
}
function readRootSidecarSnapshotSync(rootPath, parsePayload, onOpenFailure, expectedReceipt) {
	const rawSnapshot = readFileLockSyncRootSnapshot(rootPath, {
		expectedReceipt,
		onOpenFailure
	});
	if (!rawSnapshot) return null;
	let parsedPayload;
	try {
		parsedPayload = parseSidecarLockPayload(rawSnapshot.snapshot.raw, parsePayload);
	} catch (parseError) {
		if (parsePayload) try {
			if (!fileLockSyncRootSnapshotStillCurrent(rootPath, rawSnapshot)) throw new FsSafeError("path-mismatch", "sidecar changed during payload parsing");
		} catch (admissionError) {
			throw createSuppressedError(parseError, admissionError, "sidecar parser and post-callback admission both failed");
		}
		throw parseError;
	}
	if (parsePayload && !fileLockSyncRootSnapshotStillCurrent(rootPath, rawSnapshot)) return null;
	return {
		receipt: rawSnapshot.receipt,
		snapshot: {
			...rawSnapshot.snapshot,
			payload: parsedPayload
		}
	};
}
function getRootSyncHeldLocks() {
	const globalWithState = globalThis;
	if (!globalWithState[ROOT_SYNC_HELD_LOCKS_KEY]) globalWithState[ROOT_SYNC_HELD_LOCKS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[ROOT_SYNC_HELD_LOCKS_KEY];
}
function reactivateExactHeldLock(heldLocks, held, restoreConsumedReference) {
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return false;
	if (restoreConsumedReference) held.refCount += 1;
	held.releaseState = "active";
	held.revision += 1;
	return true;
}
function finishDeferredExitReleases(held) {
	const deferred = held.deferredExitReleases;
	if (!deferred) return;
	for (const disposition of deferred) disposition.released = true;
	deferred.clear();
	held.deferredExitReleases = void 0;
}
function restoreDeferredExitReleases(held) {
	const deferred = held.deferredExitReleases;
	if (!deferred) return 0;
	const restored = deferred.size;
	deferred.clear();
	held.deferredExitReleases = void 0;
	return restored;
}
function restoreExactHeldLockAfterExitCleanup(heldLocks, held) {
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return;
	held.refCount += restoreDeferredExitReleases(held);
	if (held.refCount <= 0) {
		held.releaseState = "released";
		held.revision += 1;
		heldLocks.delete(held.normalizedTargetPath);
		return;
	}
	held.releaseState = "active";
	held.revision += 1;
}
function releaseAllRootSyncHeldLocks() {
	const globalWithCleanup = globalThis;
	if (globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY]) return;
	globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY] = true;
	try {
		const heldLocks = globalThis[ROOT_SYNC_HELD_LOCKS_KEY];
		if (!heldLocks) return;
		getSyncLockAdmissions().clear();
		for (const [normalizedTargetPath, held] of heldLocks) {
			if (heldLocks.get(normalizedTargetPath) !== held || held.releaseState !== "active") continue;
			held.releaseState = "exit-cleaning";
			held.revision += 1;
			let cleanupRevision = held.revision;
			const timer = held.timer;
			const fd = held.fd;
			held.timer = void 0;
			held.fd = void 0;
			if (timer) clearInterval(timer);
			try {
				if (fd !== void 0) fs.closeSync(fd);
			} catch {}
			const entryIsContinuous = () => heldLocks.get(normalizedTargetPath) === held && held.releaseState === "exit-cleaning" && held.revision === cleanupRevision;
			const beginFreshCleanupAttempt = () => {
				held.releaseState = "exit-cleaning";
				held.revision += 1;
				cleanupRevision = held.revision;
			};
			if (!entryIsContinuous()) {
				if (heldLocks.get(normalizedTargetPath) === held && readRootSyncHeldReleaseState(held) !== "released" && held.refCount === 0) beginFreshCleanupAttempt();
				else {
					restoreExactHeldLockAfterExitCleanup(heldLocks, held);
					continue;
				}
			}
			let cleaned = false;
			for (let cleanupAttempt = 0; cleanupAttempt < MAX_CONTINUITY_CLEANUP_ATTEMPTS; cleanupAttempt += 1) {
				let continuityInterrupted = false;
				let removalFailed = false;
				let removed = false;
				try {
					removed = removeFileLockSyncRootFile(held.rootPath, held.rootReceipt, held.snapshot, () => {
						const current = entryIsContinuous();
						if (!current) continuityInterrupted = true;
						return current;
					});
				} catch {
					removalFailed = true;
				}
				if (!removalFailed && removed && !continuityInterrupted && entryIsContinuous()) {
					cleaned = true;
					break;
				}
				const continuousEntry = entryIsContinuous();
				if (heldLocks.get(normalizedTargetPath) === held && readRootSyncHeldReleaseState(held) !== "released" && (continuityInterrupted || !continuousEntry) && held.refCount === 0 && cleanupAttempt + 1 < MAX_CONTINUITY_CLEANUP_ATTEMPTS) {
					beginFreshCleanupAttempt();
					continue;
				}
				if (continuousEntry && held.refCount > 0) {
					cleaned = true;
					break;
				}
				restoreExactHeldLockAfterExitCleanup(heldLocks, held);
				break;
			}
			if (!cleaned) continue;
			finishDeferredExitReleases(held);
			held.releaseState = "released";
			held.revision += 1;
			if (heldLocks.get(normalizedTargetPath) === held) heldLocks.delete(normalizedTargetPath);
		}
	} finally {
		globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY] = false;
	}
}
function ensureRootSyncExitCleanupRegistered() {
	ensureFileLockSyncRootExitCleanupRegistered(releaseAllRootSyncHeldLocks);
}
function verifyRootSyncHeldLock(held) {
	const rootPath = held.rootPath;
	const parsePayload = held.parsePayload;
	const rootReceipt = held.rootReceipt;
	const current = parsePayload ? readRootSidecarSnapshotSync(rootPath, parsePayload, void 0, rootReceipt) : readFileLockSyncRootSnapshot(rootPath, { expectedReceipt: rootReceipt });
	if (!current) return false;
	return current.receipt.identity.dev === held.rootReceipt.identity.dev && current.receipt.identity.ino === held.rootReceipt.identity.ino && sidecarLockSnapshotMatches(current.snapshot, held.snapshot);
}
function releaseRootSyncHeldLock(held, disposition) {
	const heldLocks = getRootSyncHeldLocks();
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return true;
	if (held.releaseState !== "active") {
		if (held.deferredExitReleases?.has(disposition)) return false;
		if (held.refCount <= 0) return false;
		if (!fileLockSyncRootReceiptStillCurrent(held.rootPath, held.rootReceipt)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before release");
		held.refCount -= 1;
		held.revision += 1;
		if (held.releaseState !== "exit-cleaning" || held.refCount > 0) return true;
		(held.deferredExitReleases ??= /* @__PURE__ */ new Set()).add(disposition);
		return false;
	}
	if (held.refCount > 1) {
		if (!fileLockSyncRootReceiptStillCurrent(held.rootPath, held.rootReceipt)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before release");
		held.refCount -= 1;
		held.revision += 1;
		return true;
	}
	if (held.refCount !== 1) return false;
	held.refCount = 0;
	held.releaseState = "releasing";
	held.revision += 1;
	let releaseRevision = held.revision;
	const entryIsContinuous = () => heldLocks.get(held.normalizedTargetPath) === held && held.releaseState === "releasing" && held.revision === releaseRevision && held.refCount === 0;
	const beginFreshReleaseAttempt = () => {
		held.releaseState = "releasing";
		held.revision += 1;
		releaseRevision = held.revision;
	};
	const fd = held.fd;
	held.fd = void 0;
	try {
		if (fd !== void 0) fs.closeSync(fd);
	} catch (error) {
		reactivateExactHeldLock(heldLocks, held, true);
		throw error;
	}
	if (!entryIsContinuous()) {
		if (heldLocks.get(held.normalizedTargetPath) !== held || readRootSyncHeldReleaseState(held) === "released") return true;
		if (held.refCount > 0) {
			reactivateExactHeldLock(heldLocks, held, false);
			return true;
		}
		beginFreshReleaseAttempt();
	}
	for (let releaseAttempt = 0; releaseAttempt < MAX_CONTINUITY_CLEANUP_ATTEMPTS; releaseAttempt += 1) {
		let continuityInterrupted = false;
		let removed;
		try {
			removed = removeFileLockSyncRootFile(held.rootPath, held.rootReceipt, held.snapshot, () => {
				const current = entryIsContinuous();
				if (!current) continuityInterrupted = true;
				return current;
			});
		} catch (error) {
			reactivateExactHeldLock(heldLocks, held, true);
			throw error;
		}
		if (!continuityInterrupted && entryIsContinuous()) {
			if (!removed) {
				reactivateExactHeldLock(heldLocks, held, true);
				throw new FsSafeError("path-mismatch", "owned sidecar lock changed before release");
			}
			const timer = held.timer;
			held.timer = void 0;
			held.releaseState = "released";
			held.revision += 1;
			if (heldLocks.get(held.normalizedTargetPath) === held) heldLocks.delete(held.normalizedTargetPath);
			if (timer) clearInterval(timer);
			return true;
		}
		if (heldLocks.get(held.normalizedTargetPath) !== held || readRootSyncHeldReleaseState(held) === "released") return true;
		if (held.refCount > 0) {
			reactivateExactHeldLock(heldLocks, held, false);
			return true;
		}
		if (held.refCount === 0 && releaseAttempt + 1 < MAX_CONTINUITY_CLEANUP_ATTEMPTS) {
			beginFreshReleaseAttempt();
			continue;
		}
		reactivateExactHeldLock(heldLocks, held, true);
		throw new FsSafeError("path-mismatch", "held sidecar release continuity changed repeatedly");
	}
	throw new FsSafeError("path-mismatch", "held sidecar release could not complete");
}
function createRootSyncHeldLockHandle(held) {
	const disposition = {
		held,
		released: false
	};
	let releaseInProgress = false;
	const release = () => {
		if (disposition.released || releaseInProgress) return;
		releaseInProgress = true;
		try {
			if (releaseRootSyncHeldLock(held, disposition)) disposition.released = true;
		} finally {
			releaseInProgress = false;
		}
	};
	const handle = {
		lockPath: held.lockPath,
		normalizedTargetPath: held.normalizedTargetPath,
		verifyStillHeld: () => verifyRootSyncHeldLock(held),
		release,
		[Symbol.dispose]: release
	};
	rootSyncHandleDispositions.set(handle, disposition);
	return handle;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-acquire.js
var FileLockSyncRootArbitrationCollision = class extends FsSafeError {
	constructor() {
		super("path-mismatch", "file lock arbitration changed during local creation");
	}
};
function cleanupCreatedRootSyncLock(lockRootPath, fd, receipt, timer) {
	let timerCleanupFailed = false;
	let timerCleanupError;
	try {
		if (timer) clearInterval(timer);
	} catch (error) {
		timerCleanupFailed = true;
		timerCleanupError = error;
	}
	try {
		fs.closeSync(fd);
		if (!removeFileLockSyncRootFile(lockRootPath, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before cleanup");
	} catch (fileCleanupError) {
		if (timerCleanupFailed) throw createSuppressedError(timerCleanupError, fileCleanupError, "unpublished lock timer and file cleanup both failed");
		throw fileCleanupError;
	}
	if (timerCleanupFailed) throw timerCleanupError;
}
function acquireFileLockSyncWithRoot(targetPath, inputOptions, lockRoot) {
	const authority = captureFileLockSyncRootAuthority(lockRoot);
	const options = captureRootSyncAcquireOptions(inputOptions);
	ensureRootSyncExitCleanupRegistered();
	assertNoWindowsPathAlias(targetPath);
	if (options.lockPath !== void 0) assertNoWindowsPathAlias(options.lockPath);
	const normalizedTargetPath = normalizeFileLockSyncTargetWithRoot(authority, path.resolve(targetPath));
	const lockRootPath = admitFileLockSyncRootPath(authority, path.resolve(options.lockPath ?? `${normalizedTargetPath}.lock`));
	const reclaimRootPath = admitFileLockSyncRootPath(authority, `${lockRootPath.path}.reclaim`);
	const guardedPaths = Object.freeze([lockRootPath, reclaimRootPath]);
	const lockPath = lockRootPath.path;
	const heldLocks = getRootSyncHeldLocks();
	const currentTargetHolder = () => heldLocks.get(normalizedTargetPath) ?? foreignSyncHeldLock("root", normalizedTargetPath);
	const tryReuseCurrentHeld = () => {
		const held = heldLocks.get(normalizedTargetPath);
		if (!(held && !foreignSyncHeldLock("root", normalizedTargetPath) && options.reentrantOwner !== void 0 && held.reentrantOwner !== void 0 && options.reentrantOwner === held.reentrantOwner && authority.adapter === held.rootAuthority.adapter && lockRootPath.relativePath === held.rootPath.relativePath && path.relative(lockRootPath.path, held.rootPath.path) === "" && held.releaseState !== "released")) return void 0;
		if (!verifyRootSyncHeldLock(held)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before reentrant reuse");
		if (heldLocks.get(normalizedTargetPath) !== held || held.releaseState === "released" || foreignSyncHeldLock("root", normalizedTargetPath)) throw new FsSafeError("path-mismatch", "held sidecar lock changed during reentrant reuse");
		held.refCount += 1;
		held.revision += 1;
		return createRootSyncHeldLockHandle(held);
	};
	if (heldLocks.has(normalizedTargetPath) && !foreignSyncHeldLock("root", normalizedTargetPath)) {
		assertFileLockSyncRootPathsCurrent(guardedPaths);
		const initiallyReusable = tryReuseCurrentHeld();
		if (initiallyReusable) return initiallyReusable;
	}
	const acquisition = new SyncLockAcquisition(lockPath, normalizedTargetPath, options.retry, options.timeoutMs);
	let ownedReclaimGuard;
	let reclaimCleanupAttempted = false;
	const reuseCurrentHeld = () => ownedReclaimGuard ? void 0 : tryReuseCurrentHeld();
	const releaseReclaimGuard = () => {
		const receipt = ownedReclaimGuard;
		if (!receipt) return;
		reclaimCleanupAttempted = true;
		if (!removeFileLockSyncRootDirectory(reclaimRootPath, receipt)) throw new FsSafeError("path-mismatch", "owned sidecar reclaim guard changed before release");
		ownedReclaimGuard = void 0;
		reclaimCleanupAttempted = false;
	};
	const assertOwnedReclaimGuardCurrent = () => {
		const receipt = ownedReclaimGuard;
		if (!receipt || !fileLockSyncRootDirectoryReceiptStillCurrent(reclaimRootPath, receipt)) throw new FsSafeError("path-mismatch", "owned sidecar reclaim guard changed during acquisition");
	};
	try {
		while (true) {
			acquisition.reserve();
			acquisition.assert();
			assertFileLockSyncRootPathsCurrent(guardedPaths);
			acquisition.assert();
			if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
			if (!ownedReclaimGuard && fileLockSyncRootGuardExists(reclaimRootPath)) {
				acquisition.waitForRetry();
				continue;
			}
			if (currentTargetHolder() !== void 0) {
				const reused = reuseCurrentHeld();
				if (reused) return reused;
			}
			const payload = Reflect.apply(options.payload, options.optionsReceiver, []);
			acquisition.assert();
			const { raw, ownershipToken } = serializeSidecarLockPayload(payload);
			acquisition.assert();
			if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
			if (currentTargetHolder() !== void 0) {
				const reused = reuseCurrentHeld();
				if (reused) return reused;
				acquisition.waitForRetry();
				continue;
			}
			let fd;
			let rootReceipt;
			let unpublishedTimer;
			let lockFileCreateOpenFailure;
			try {
				const created = createFileLockSyncRootFile(lockRootPath, {
					assertBeforeOpen: () => {
						acquisition.assert();
						if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
						if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
					},
					onOpenFailure: (error) => {
						lockFileCreateOpenFailure = { error };
					}
				});
				fd = created.fd;
				rootReceipt = created.receipt;
				fs.writeFileSync(fd, raw, "utf8");
				fs.fsyncSync(fd);
				const snapshot = {
					raw,
					payload,
					ownershipToken
				};
				if (ownedReclaimGuard) releaseReclaimGuard();
				rootReceipt = refreshFileLockSyncRootFileReceipt(lockRootPath, rootReceipt);
				const createdHeld = {
					fd,
					lockPath,
					normalizedTargetPath,
					parsePayload: options.parsePayload,
					refCount: 1,
					reentrantOwner: options.reentrantOwner,
					releaseState: "active",
					revision: 0,
					rootAuthority: authority,
					rootPath: lockRootPath,
					rootReceipt,
					snapshot
				};
				const returnedHandle = createRootSyncHeldLockHandle(createdHeld);
				acquisition.monitor(createdHeld, returnedHandle, options.onCompromised, options.compromiseCheckIntervalMs, options.optionsReceiver, (timer) => {
					unpublishedTimer = timer;
				});
				if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
				acquisition.assert();
				heldLocks.set(normalizedTargetPath, createdHeld);
				fd = void 0;
				unpublishedTimer = void 0;
				return returnedHandle;
			} catch (error) {
				if (fd !== void 0 && rootReceipt) {
					const cleanupFd = fd;
					const cleanupReceipt = rootReceipt;
					const cleanupTimer = unpublishedTimer;
					fd = void 0;
					rootReceipt = void 0;
					unpublishedTimer = void 0;
					try {
						cleanupCreatedRootSyncLock(lockRootPath, cleanupFd, cleanupReceipt, cleanupTimer);
					} catch (cleanupError) {
						throw createSuppressedError(error, cleanupError, "file lock acquisition and Root cleanup both failed");
					}
				}
				if (error instanceof FileLockSyncRootArbitrationCollision) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				const fromLockFileOpen = lockFileCreateOpenFailure !== void 0 && lockFileCreateOpenFailure.error === error;
				if (fromLockFileOpen && acquisition.retryDenial(error)) continue;
				if (!fromLockFileOpen || error.code !== "EEXIST") throw error;
				if (ownedReclaimGuard) {
					releaseReclaimGuard();
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				if (currentTargetHolder() !== void 0) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				let lockFileOpenDenied = false;
				let current;
				try {
					current = readRootSidecarSnapshotSync(lockRootPath, options.parsePayload, (openError) => {
						lockFileOpenDenied = isTransientLockFileDenial(openError, lockPath);
					});
				} catch (readError) {
					if (lockFileOpenDenied && acquisition.retryDenial(readError)) continue;
					throw readError;
				}
				if (currentTargetHolder() !== void 0) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				acquisition.assert();
				if (!current) {
					acquisition.waitForRetry();
					continue;
				}
				const snapshot = current.snapshot;
				const nowMs = Date.now();
				let reclaim;
				if (options.shouldReclaim) {
					reclaim = Reflect.apply(options.shouldReclaim, options.optionsReceiver, [{
						lockPath,
						normalizedTargetPath,
						payload: snapshot.payload,
						staleMs: options.staleMs,
						nowMs,
						heldByThisProcess: false
					}]);
					assertSynchronousCallbackResult(reclaim, "shouldReclaim");
					acquisition.assert();
					if (!fileLockSyncRootSnapshotStillCurrent(lockRootPath, current)) throw new FsSafeError("path-mismatch", "sidecar changed during reclaim policy callback");
				} else reclaim = defaultSyncShouldReclaim(snapshot, options.staleMs, nowMs);
				if (reclaim) {
					if (options.staleRecovery === "remove-if-unchanged" && snapshot.raw !== void 0 && options.shouldRemoveStaleLock) {
						const guard = createFileLockSyncRootDirectory(reclaimRootPath);
						if (!guard) {
							acquisition.waitForRetry();
							continue;
						}
						ownedReclaimGuard = guard;
						reclaimCleanupAttempted = false;
						const approved = Reflect.apply(options.shouldRemoveStaleLock, options.optionsReceiver, [{
							lockPath,
							normalizedTargetPath,
							raw: snapshot.raw,
							payload: snapshot.payload
						}]);
						assertSynchronousCallbackResult(approved, "shouldRemoveStaleLock");
						acquisition.assert();
						assertOwnedReclaimGuardCurrent();
						if (approved) {
							if (!removeFileLockSyncRootFile(lockRootPath, current.receipt, snapshot, () => {
								acquisition.assert();
								assertOwnedReclaimGuardCurrent();
								if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
							})) throw new FsSafeError("path-mismatch", "stale sidecar changed before removal");
							continue;
						}
						if (!fileLockSyncRootSnapshotStillCurrent(lockRootPath, current)) throw new FsSafeError("path-mismatch", "sidecar changed during stale-removal policy callback");
						releaseReclaimGuard();
					}
					throw sidecarLockStale(lockPath, normalizedTargetPath);
				}
				acquisition.waitForRetry();
			}
		}
	} catch (error) {
		if (ownedReclaimGuard && !reclaimCleanupAttempted) try {
			releaseReclaimGuard();
		} catch (cleanupError) {
			throw createSuppressedError(error, cleanupError, "file lock acquisition and reclaim cleanup both failed");
		}
		throw error;
	} finally {
		acquisition.release();
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-stale-admission.js
/** Handle one exclusive-create conflict without surrendering canonical admission. */
function handleSyncStaleAdmission(acquisition, params) {
	const holderChanged = {};
	const assertUnheld = () => {
		acquisition.assert();
		if (params.currentHeld()) throw holderChanged;
	};
	const retryHolderChange = (error) => {
		if (error !== holderChanged) return false;
		acquisition.waitForRetry();
		return true;
	};
	let rawSnapshot;
	let lockFileOpenDenied = false;
	try {
		rawSnapshot = readSidecarLockRawSnapshotSync(acquisition.lockPath, {
			rejectNonFile: true,
			onOpenFailure: () => {
				lockFileOpenDenied = true;
				assertUnheld();
			}
		});
		assertUnheld();
	} catch (error) {
		if (retryHolderChange(error)) return;
		try {
			assertUnheld();
		} catch (boundaryError) {
			if (retryHolderChange(boundaryError)) return;
			throw boundaryError;
		}
		if (lockFileOpenDenied && acquisition.retryDenial(error)) return;
		throw error;
	}
	const stale = params.staleOptions;
	try {
		if (!stale.shouldReclaimObserved) {
			assertUnheld();
			stale.shouldReclaim = params.options.shouldReclaim;
			stale.shouldReclaimObserved = true;
			assertUnheld();
		}
		if (!stale.shouldRemoveObserved) {
			assertUnheld();
			stale.shouldRemove = params.options.shouldRemoveStaleLock;
			stale.shouldRemoveObserved = true;
			assertUnheld();
		}
	} catch (error) {
		if (retryHolderChange(error)) return;
		try {
			assertUnheld();
		} catch (boundaryError) {
			if (retryHolderChange(boundaryError)) return;
			throw boundaryError;
		}
		throw error;
	}
	const guardedParser = params.parsePayload && ((raw) => {
		assertUnheld();
		try {
			return Reflect.apply(params.parsePayload, void 0, [raw]);
		} finally {
			assertUnheld();
		}
	});
	let snapshot;
	try {
		snapshot = parseSidecarLockSnapshot(rawSnapshot, guardedParser);
		assertUnheld();
	} catch (error) {
		if (retryHolderChange(error)) return;
		throw error;
	}
	if (!snapshot) {
		acquisition.waitForRetry();
		return;
	}
	const nowMs = Date.now();
	let reclaim;
	try {
		assertUnheld();
		try {
			reclaim = stale.shouldReclaim ? Reflect.apply(stale.shouldReclaim, params.options, [{
				lockPath: acquisition.lockPath,
				normalizedTargetPath: acquisition.normalizedTargetPath,
				payload: snapshot.payload,
				staleMs: params.staleMs,
				nowMs,
				heldByThisProcess: false
			}]) : defaultSyncShouldReclaim(snapshot, params.staleMs, nowMs);
			assertSynchronousCallbackResult(reclaim, "shouldReclaim");
		} finally {
			assertUnheld();
		}
	} catch (error) {
		if (retryHolderChange(error)) return;
		throw error;
	}
	if (!reclaim) {
		acquisition.waitForRetry();
		return;
	}
	if (params.staleRecovery === "remove-if-unchanged" && snapshot.raw !== void 0 && stale.shouldRemove !== void 0) {
		let approved;
		try {
			assertUnheld();
			try {
				approved = Reflect.apply(stale.shouldRemove, params.options, [{
					lockPath: acquisition.lockPath,
					normalizedTargetPath: acquisition.normalizedTargetPath,
					raw: snapshot.raw,
					payload: snapshot.payload
				}]);
				assertSynchronousCallbackResult(approved, "shouldRemoveStaleLock");
			} finally {
				assertUnheld();
			}
		} catch (error) {
			if (retryHolderChange(error)) return;
			throw error;
		}
		if (!approved) throw sidecarLockStale(acquisition.lockPath, acquisition.normalizedTargetPath);
		try {
			fs.mkdirSync(params.reclaimGuardPath);
		} catch (error) {
			try {
				assertUnheld();
			} catch (boundaryError) {
				if (retryHolderChange(boundaryError)) return;
				throw boundaryError;
			}
			if (error.code === "EEXIST") {
				acquisition.waitForRetry();
				return;
			}
			throw error;
		}
		let holderInterrupted = false;
		try {
			assertUnheld();
			if (removeSidecarLockIfUnchangedSync(acquisition.lockPath, snapshot, assertUnheld)) return;
		} catch (error) {
			if (error === holderChanged) holderInterrupted = true;
			else throw error;
		} finally {
			try {
				fs.rmdirSync(params.reclaimGuardPath);
			} catch {}
		}
		if (holderInterrupted) {
			acquisition.waitForRetry();
			return;
		}
	}
	throw sidecarLockStale(acquisition.lockPath, acquisition.normalizedTargetPath);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync.js
function releaseAllSyncHeldLocks() {
	const heldLocks = getSyncHeldLocks();
	for (const [normalizedTargetPath, held] of heldLocks) {
		if (held.timer) {
			clearInterval(held.timer);
			held.timer = void 0;
		}
		try {
			if (held.fd !== void 0) fs.closeSync(held.fd);
		} catch {}
		try {
			removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
		} catch {}
		heldLocks.delete(normalizedTargetPath);
	}
	getSyncLockAdmissions().clear();
}
function verifySyncHeldLock(held) {
	const lockPath = held.lockPath;
	const parsePayload = held.parsePayload;
	const current = parsePayload ? readSidecarLockSnapshotSync(lockPath, parsePayload) : readSidecarLockRawSnapshotSync(lockPath);
	return !!current && sidecarLockSnapshotMatches(current, held.snapshot);
}
function releaseSyncHeldLock(held) {
	const heldLocks = getSyncHeldLocks();
	if (heldLocks.get(held.normalizedTargetPath) !== held) return false;
	if (held.refCount > 1) {
		held.refCount -= 1;
		return false;
	}
	if (held.timer) {
		clearInterval(held.timer);
		held.timer = void 0;
	}
	if (held.fd !== void 0) {
		const fd = held.fd;
		held.fd = void 0;
		fs.closeSync(fd);
	}
	removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
	heldLocks.delete(held.normalizedTargetPath);
	return true;
}
function createSyncHeldLockHandle(held) {
	let released = false;
	const release = () => {
		if (released) return;
		releaseSyncHeldLock(held);
		released = true;
	};
	return {
		lockPath: held.lockPath,
		normalizedTargetPath: held.normalizedTargetPath,
		verifyStillHeld: () => verifySyncHeldLock(held),
		release,
		[Symbol.dispose]: release
	};
}
function canonicalLockParentSync(parent) {
	return process.platform === "win32" ? realpathSync$1.native(parent) : realpathSync$1(parent);
}
function normalizeTargetPath(targetPath) {
	const resolved = path.resolve(targetPath);
	assertNoWindowsPathAlias(resolved);
	const directory = path.dirname(resolved);
	let parentExists = false;
	try {
		parentExists = fs.statSync(directory).isDirectory();
	} catch {}
	if (!parentExists) fs.mkdirSync(recursiveMkdirPath(directory), { recursive: true });
	let parent;
	try {
		parent = canonicalLockParentSync(path.dirname(resolved));
	} catch {
		return resolved;
	}
	assertNoWindowsPathAlias(parent);
	const normalized = path.join(parent, path.basename(resolved));
	assertNoWindowsPathAlias(normalized);
	return normalized;
}
function acquireFileLockSync(targetPath, options) {
	const lockRoot = options.lockRoot;
	if (lockRoot) return acquireFileLockSyncWithRoot(targetPath, options, lockRoot);
	const defaults = getFsSafeLockConfig();
	const retry = options.retry ?? defaults.retry ?? {};
	const timeoutMs = options.timeoutMs ?? defaults.timeoutMs;
	validateSidecarLockRetryOptions(retry);
	validateSidecarLockTimeoutMs(timeoutMs);
	const staleMs = options.staleMs ?? defaults.staleMs ?? 3e4;
	validateSidecarLockStaleMs(staleMs);
	const compromiseCheckIntervalMs = options.compromiseCheckIntervalMs;
	validateSidecarLockCompromiseCheckIntervalMs(compromiseCheckIntervalMs);
	const explicitLockPath = options.lockPath;
	assertNoWindowsPathAlias(targetPath);
	if (explicitLockPath !== void 0) assertNoWindowsPathAlias(explicitLockPath);
	const normalizedTargetPath = normalizeTargetPath(targetPath);
	const lockPath = path.resolve(explicitLockPath ?? `${normalizedTargetPath}.lock`);
	assertNoWindowsPathAlias(lockPath);
	const requestedReentrantOwner = options.reentrantOwner;
	const heldLocks = getSyncHeldLocks();
	const currentTargetHolder = () => heldLocks.get(normalizedTargetPath) ?? foreignSyncHeldLock("raw", normalizedTargetPath);
	const initiallyHeld = heldLocks.get(normalizedTargetPath);
	if (initiallyHeld && !foreignSyncHeldLock("raw", normalizedTargetPath) && requestedReentrantOwner !== void 0 && initiallyHeld.reentrantOwner !== void 0 && requestedReentrantOwner === initiallyHeld.reentrantOwner) {
		initiallyHeld.refCount += 1;
		return createSyncHeldLockHandle(initiallyHeld);
	}
	const acquisition = new SyncLockAcquisition(lockPath, normalizedTargetPath, retry, timeoutMs);
	let payloadCallback;
	let onCompromised = void 0;
	let onCompromisedObserved = false;
	let parsePayload = void 0;
	let parsePayloadObserved = false;
	let staleRecovery = void 0;
	let staleRecoveryObserved = false;
	const staleOptions = {};
	const reclaimGuardPath = `${lockPath}.reclaim`;
	try {
		while (true) {
			if (!acquisition.owns) {
				const held = heldLocks.get(normalizedTargetPath);
				if (held && !foreignSyncHeldLock("raw", normalizedTargetPath) && requestedReentrantOwner !== void 0 && held.reentrantOwner !== void 0 && requestedReentrantOwner === held.reentrantOwner) {
					held.refCount += 1;
					return createSyncHeldLockHandle(held);
				}
				acquisition.reserve();
			}
			const attemptHeld = currentTargetHolder();
			const holderWasReplaced = () => {
				const current = currentTargetHolder();
				return current !== void 0 && current !== attemptHeld;
			};
			if (!staleRecoveryObserved) {
				staleRecovery = acquisition.run(() => options.staleRecovery ?? defaults.staleRecovery);
				staleRecoveryObserved = true;
				if (holderWasReplaced()) {
					acquisition.waitForRetry();
					continue;
				}
			}
			const reclaimGuardExists = syncReclaimGuardExists(reclaimGuardPath);
			if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			if (reclaimGuardExists) {
				acquisition.waitForRetry();
				continue;
			}
			let fd;
			let createdHeld;
			let createdSnapshot;
			if (!payloadCallback) payloadCallback = acquisition.run(() => options.payload);
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			const payload = acquisition.run(() => Reflect.apply(payloadCallback, options, []));
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			const { raw, ownershipToken } = acquisition.run(() => serializeSidecarLockPayload(payload));
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			if (currentTargetHolder() !== void 0) {
				acquisition.waitForRetry();
				continue;
			}
			if (!onCompromisedObserved) {
				onCompromised = acquisition.run(() => options.onCompromised);
				onCompromisedObserved = true;
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
			}
			if (!parsePayloadObserved) {
				parsePayload = acquisition.run(() => options.parsePayload);
				parsePayloadObserved = true;
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
			}
			let lockFileCreateDenied = false;
			let exclusiveCreateConflict = false;
			try {
				const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
				try {
					assertExclusiveCreateLeaf(lockPath);
				} catch (error) {
					exclusiveCreateConflict = error.code === "EEXIST";
					throw error;
				}
				try {
					fd = fs.openSync(lockPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 384);
				} catch (error) {
					lockFileCreateDenied = isTransientLockFileDenial(error, lockPath);
					exclusiveCreateConflict = error.code === "EEXIST";
					throw error;
				}
				fs.writeFileSync(fd, raw, "utf8");
				fs.fsyncSync(fd);
				createdSnapshot = {
					raw,
					payload,
					stat: fs.fstatSync(fd, { bigint: true }),
					ownershipToken
				};
				createdHeld = {
					fd,
					lockPath,
					normalizedTargetPath,
					parsePayload,
					refCount: 1,
					reentrantOwner: requestedReentrantOwner,
					snapshot: createdSnapshot
				};
				const candidateHeld = createdHeld;
				ensureSyncLockExitCleanupRegistered(releaseAllSyncHeldLocks, lockPath, normalizedTargetPath);
				if (!acquisition.hasToken() || currentTargetHolder() !== void 0) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				const returnedHandle = createSyncHeldLockHandle(candidateHeld);
				acquisition.monitor(candidateHeld, returnedHandle, onCompromised, compromiseCheckIntervalMs, options);
				if (!acquisition.hasToken() || currentTargetHolder() !== void 0) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				heldLocks.set(normalizedTargetPath, candidateHeld);
				acquisition.release();
				fd = void 0;
				return returnedHandle;
			} catch (error) {
				if (createdHeld?.timer) {
					clearInterval(createdHeld.timer);
					createdHeld.timer = void 0;
				}
				if (createdHeld && heldLocks.get(normalizedTargetPath) === createdHeld) heldLocks.delete(normalizedTargetPath);
				if (fd !== void 0) {
					const failed = createdSnapshot ?? { payload: null };
					if (!failed.stat) try {
						failed.stat = fs.fstatSync(fd, { bigint: true });
					} catch {}
					const failedFd = fd;
					fd = void 0;
					if (createdHeld) createdHeld.fd = void 0;
					try {
						fs.closeSync(failedFd);
						if (failed.stat) removeSidecarLockIfUnchangedSync(lockPath, failed);
					} catch (cleanupError) {
						throw createSuppressedError(error, cleanupError, "file lock acquisition and cleanup both failed");
					}
				}
				if (lockFileCreateDenied) {
					if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
					if (currentTargetHolder() !== void 0) {
						acquisition.waitForRetry();
						continue;
					}
					if (acquisition.retryDenial(error)) continue;
					throw error;
				}
				if (!exclusiveCreateConflict) throw error;
				if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
				handleSyncStaleAdmission(acquisition, {
					currentHeld: currentTargetHolder,
					options,
					parsePayload,
					reclaimGuardPath,
					staleMs,
					staleOptions,
					staleRecovery
				});
				continue;
			}
		}
	} finally {
		acquisition.release();
	}
}
//#endregion
//#region src/utils/zod-parse.ts
/**
* Null-returning Zod parse helpers for plugin and runtime boundaries.
*
* Callers use these where invalid external payloads should be ignored or
* recovered from without constructing and catching validation errors.
*/
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
function safeParseWithSchema(schema, value) {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
function safeParseJsonWithSchema(schema, raw) {
	try {
		return safeParseWithSchema(schema, JSON.parse(raw));
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/update-managed-service-handoff-schema.ts
const text = string().min(1).max(4096);
const nativeProcessIdentityShape = {
	pid: number().int().positive(),
	startIdentity: text.max(128)
};
const processIdentitySchema = strictObject({
	...nativeProcessIdentityShape,
	startIdentitySource: literal("argv-sha256").nullable().optional()
}).refine(({ startIdentity, startIdentitySource }) => startIdentitySource === "argv-sha256" ? /^win32-argv-sha256:[a-f0-9]{64}$/.test(startIdentity) : !startIdentity.startsWith("win32-argv-sha256:"));
const managedHandoffBootSchema = union([
	strictObject({
		platform: _enum(["linux", "darwin"]),
		identity: string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
	}),
	strictObject({
		platform: literal("win32"),
		identity: string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)
	}),
	strictObject({
		platform: literal("freebsd"),
		identity: string().regex(/^[a-f0-9]{32}$/)
	})
]);
const nativeLifetimeSchema = strictObject({
	kind: literal("native"),
	unit: text,
	scope: text,
	placement: discriminatedUnion("kind", [strictObject({ kind: literal("pending") }), strictObject({
		kind: literal("attached"),
		invocation: string().regex(/^[a-f0-9]{32}$/i)
	})])
});
const cancellationProtocol = literal("original-cancellation-v1");
const updateAction = strictObject({
	kind: literal("update"),
	mutationProtocol: cancellationProtocol
}).extend({
	mutationProtocol: cancellationProtocol.optional(),
	custody: _enum(["reserved", "bound"]).optional()
});
const actionSchema = discriminatedUnion("kind", [updateAction, strictObject({
	kind: literal("triage"),
	phase: _enum([
		"reserved",
		"running",
		"closing",
		"closed",
		"uncertain"
	]),
	lifetime: discriminatedUnion("kind", [strictObject({
		kind: literal("foreground"),
		boot: managedHandoffBootSchema
	}), nativeLifetimeSchema])
}).refine((action) => action.phase !== "running" || action.lifetime.kind !== "native" || action.lifetime.placement.kind === "attached")]);
const sourcePath = text.refine(path.isAbsolute, "Native source path must be absolute");
const digest = string().regex(/^[a-f0-9]{64}$/);
const nativeBorrowerSourceSchema = strictObject({
	runId: text,
	transactionId: text,
	claimId: text,
	revision: number().int().nonnegative(),
	recordSha256: digest,
	serviceKey: sourcePath,
	configPaths: array(sourcePath).min(1).max(512),
	lifetimeId: text
});
const nativeBorrowerSchema = strictObject({
	id: string().uuid(),
	phase: _enum(["reserved", "admitted"]),
	source: nativeBorrowerSourceSchema
});
const commonPayload = {
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: actionSchema
};
const originalUpdateSchema = strictObject({
	version: literal(2),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction
});
const originalGenerationSchema = strictObject({
	key: text,
	owner: text,
	payload: string().min(1),
	updatedAt: number().int().nonnegative()
});
const cancellingPayloadSchema = strictObject({
	version: literal(4),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction,
	cancellation: originalGenerationSchema
}).refine((value) => {
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.cancellation.payload);
	return original !== null && JSON.stringify(original.helper) === JSON.stringify(value.helper) && JSON.stringify(original.executor) === JSON.stringify(value.executor) && JSON.stringify(original.action) === JSON.stringify(value.action) && (JSON.stringify(value.helper) === JSON.stringify(value.executor) || original.action.mutationProtocol === "original-cancellation-v1");
});
const currentPayloadSchema = strictObject({
	version: literal(2),
	...commonPayload,
	mutationOriginal: originalGenerationSchema.optional()
}).refine((value) => {
	if (!value.mutationOriginal) return true;
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.mutationOriginal.payload);
	return original !== null && !value.mutationOriginal.key.includes("/.openclaw-update-child-") && original.action.mutationProtocol === "original-cancellation-v1";
});
discriminatedUnion("version", [
	cancellingPayloadSchema,
	currentPayloadSchema,
	strictObject({
		version: literal(3),
		...commonPayload,
		action: strictObject({ kind: literal("update") }),
		nativeBorrower: nativeBorrowerSchema
	})
]);
strictObject({
	version: literal(1),
	...nativeProcessIdentityShape
});
//#endregion
//#region src/infra/update-managed-service-handoff-boot.ts
/** Bind the lease environment without caching boot identity or selecting an OS early. */
function createManagedHandoffBootIdentityReader(serviceManagerEnv) {
	return function bootIdentity() {
		let value;
		if (process.platform === "linux") value = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
		else if ([
			"freebsd",
			"darwin",
			"win32"
		].includes(process.platform)) {
			const freebsd = process.platform === "freebsd";
			const windows = process.platform === "win32";
			const result = spawnSync(windows ? "powershell.exe" : freebsd ? "/sbin/sysctl" : "/usr/sbin/sysctl", windows ? [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime.ToUniversalTime().ToString('o')"
			] : freebsd ? ["-b", "kern.boot_id"] : ["-n", "kern.bootsessionuuid"], {
				env: serviceManagerEnv,
				...freebsd ? { maxBuffer: 16 } : {
					encoding: "utf8",
					windowsHide: true
				},
				timeout: windows ? 5e3 : 1e3,
				killSignal: "SIGKILL",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0) value = freebsd ? Buffer.isBuffer(result.stdout) && result.stdout.length === 16 ? result.stdout.toString("hex") : void 0 : result.stdout.toString().trim();
		}
		const boot = {
			platform: process.platform,
			identity: process.platform === "win32" ? value : value?.toLowerCase()
		};
		const parsed = managedHandoffBootSchema.safeParse(boot);
		if (!parsed.success) throw new Error("OS boot identity unavailable; run openclaw triage manually");
		return parsed.data;
	};
}
//#endregion
//#region src/infra/gateway-lock-payload.ts
const GATEWAY_OWNER_HEARTBEAT_MS = 15e3;
const GATEWAY_OWNER_HEARTBEAT_STALE_MS = 9e4;
const [uuidBoot, windowsBoot, freebsdBoot] = managedHandoffBootSchema.options;
const host = string().min(1);
const GatewayProcessNamespaceSchema = discriminatedUnion("platform", [
	uuidBoot.extend({
		host,
		platform: literal("linux"),
		pidNsInode: string().min(1)
	}),
	uuidBoot.extend({
		host,
		platform: literal("darwin")
	}),
	windowsBoot.extend({ host }),
	freebsdBoot.extend({ host })
]);
let processNamespace;
/** Cache OS subprocess failures too; only Linux's cheap /proc probes remain retryable. */
function readGatewayLockProcessNamespace() {
	if (processNamespace?.platform === process.platform && (processNamespace.value !== null || process.platform !== "linux")) return processNamespace.value;
	try {
		const boot = createManagedHandoffBootIdentityReader(process.env)();
		const value = GatewayProcessNamespaceSchema.parse({
			host: os.hostname(),
			...boot,
			...boot.platform === "linux" ? { pidNsInode: fs.statSync("/proc/self/ns/pid", { bigint: true }).ino.toString() } : {}
		});
		processNamespace = {
			platform: value.platform,
			value
		};
		return value;
	} catch {
		processNamespace = {
			platform: process.platform,
			value: null
		};
		return null;
	}
}
/** Diagnostic facts never grant ownership; callers still classify the recorded holder. */
function describeGatewayLockHolder(holder, lockPath, localState) {
	const namespace = GatewayProcessNamespaceSchema.safeParse(holder.processNamespace).data;
	let heartbeatAt = holder.heartbeatAt;
	if (lockPath) try {
		heartbeatAt = fs.statSync(lockPath).mtimeMs;
	} catch {}
	const ageMs = heartbeatAt === void 0 ? void 0 : Date.now() - heartbeatAt;
	const location = `${namespace?.host ?? holder.host ?? "unknown host"}${namespace?.platform === "linux" ? `/pid-ns ${namespace.pidNsInode}` : ""}`;
	const action = localState === "live" ? `The holder ${holder.pid} is alive on this host, stop it first` : localState === "unknown" ? "Stop the holder before retrying" : `wait ${Math.max(1, Math.floor((GATEWAY_OWNER_HEARTBEAT_STALE_MS - (ageMs ?? 0)) / 1e3) + 1)} s and retry`;
	return `holder ${holder.pid ?? "unknown"} at ${location}, last renewed ${ageMs === void 0 ? "at an unknown time" : `${Math.max(0, Math.floor(ageMs / 1e3))} s ago`}. ${action}.`;
}
var GatewayLockNamespaceError = class extends Error {
	constructor(holder, lockPath) {
		super(`cannot verify Gateway ownership from this process (different PID namespace); the owner heartbeat is fresh — run this command inside the Gateway container or with a shared PID namespace. If the previous Gateway stopped, wait up to 90 seconds after its last heartbeat. ${describeGatewayLockHolder(holder, lockPath)}`);
		this.name = "GatewayLockNamespaceError";
	}
};
/** Qualify PID evidence before any local process probe or same-PID authority shortcut. */
function classifyGatewayLockProcessNamespace(value, lockPath) {
	return classifyGatewayOwnerProcessNamespace(value, { readHeartbeatAt: () => lockPath ? fs.statSync(lockPath).mtimeMs : void 0 });
}
/** File locks and SQLite leases share one boot/namespace and heartbeat policy. */
function classifyGatewayOwnerProcessNamespace(value, options = {}) {
	const owner = GatewayProcessNamespaceSchema.safeParse(value).data;
	const ownerHost = owner?.host ?? options.ownerHost;
	const foreignHost = ownerHost !== void 0 && ownerHost !== os.hostname();
	if (!foreignHost && process.platform === "win32" && owner?.platform === "win32") return "same";
	if (value === void 0 && !foreignHost) return "same";
	const current = readGatewayLockProcessNamespace();
	if (owner && current) {
		if (owner.platform === current.platform && owner.host === current.host && owner.identity !== current.identity) return "dead";
		if (owner.platform === current.platform && owner.identity === current.identity && (owner.platform !== "linux" || current.platform === "linux" && owner.pidNsInode === current.pidNsInode)) return "same";
	} else if (process.platform !== "linux" && !foreignHost) return "same";
	try {
		const heartbeatAt = options.readHeartbeatAt?.();
		return heartbeatAt !== void 0 && Date.now() - heartbeatAt > 9e4 ? "dead" : "unknown";
	} catch {
		return "unknown";
	}
}
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
	/** A cold opener may wait for this transient owner, never enter while it is held. */
	stateOwnerKind: literal("schema").optional(),
	/** Present when Gateway cron writes use the dynamic-default ownership projection. */
	cronOwnerProjection: literal("dynamic-default-v1").optional(),
	createdAt: string(),
	startupPhase: literal("starting").optional(),
	configPath: string(),
	port: number().int().min(1).max(65535).optional(),
	role: _enum([
		"gateway",
		"agent-embedded",
		"skill-workshop-apply",
		"sqlite-maintenance"
	]).optional(),
	stateDir: string().optional(),
	startTime: number().optional(),
	processNamespace: GatewayProcessNamespaceSchema.nullable().optional()
});
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
}
//#endregion
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code !== "EROFS" && code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || code === "EPERM" && filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/gateway-state-owner-directory.ts
function ensureOwnerDirectory(directory, created) {
	const firstCreated = fs.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	if (firstCreated && created) {
		const boundary = path.toNamespacedPath(firstCreated);
		const directories = [];
		for (let current = directory;;) {
			const { dev, ino } = fs.lstatSync(current, { bigint: true });
			directories.push({
				path: current,
				dev,
				ino
			});
			if (path.toNamespacedPath(current) === boundary) break;
			const parent = path.dirname(current);
			if (parent === current) throw new Error("Created state ownership directory is outside its expected ancestry");
			current = parent;
		}
		for (const entry of directories) {
			const previous = created.findIndex((candidate) => candidate.path === entry.path);
			if (previous < 0) created.push(entry);
			else created[previous] = entry;
		}
	}
	const observed = fs.lstatSync(directory);
	const uid = process.getuid?.();
	if (!observed.isDirectory() || uid !== void 0 && observed.uid !== uid) throw new Error("State ownership directory must be a user-owned real directory");
	if (process.platform !== "win32" && (observed.mode & 4095) !== 448) {
		applyPrivateModeSync(directory, 448);
		if ((fs.lstatSync(directory).mode & 63) !== 0) throw new Error("State ownership directory permissions are not private");
	}
}
function removeCreatedProjectionDirectories(directories) {
	let directory = directories[0];
	while (directory) {
		try {
			const observed = fs.lstatSync(directory.path, { bigint: true });
			if (observed.isDirectory() && observed.dev === directory.dev && observed.ino === directory.ino) fs.rmdirSync(directory.path);
		} catch (error) {
			const code = extractErrorCode(error);
			if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
		}
		directories.shift();
		directory = directories[0];
	}
}
/** In-process identity is independent of the on-disk lock spelling used by older versions. */
function resolveStateOwnerIdentity(databasePath) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(databasePath);
	return {
		canonicalPath,
		ownerPath: resolveCanonicalStateOwnerPath(canonicalPath),
		key: process.platform === "win32" ? normalizeWindowsPathForComparison(canonicalPath) : canonicalPath
	};
}
function resolveCanonicalStateOwnerPath(canonical) {
	const uid = process.getuid?.();
	const directory = process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks", uid === void 0 ? "openclaw-state-owners" : `openclaw-state-owners-${uid}`) : resolveGatewayLockDirForCanonicalStateDir(resolveOpenClawStateDirForDatabasePath(canonical));
	return path.join(resolveIdentityPathViaExistingAncestorSync(directory), `state.${sha256HexPrefixCore(canonical, 16)}.lock`);
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.runtime.ts
/** Verify the held inode and exact acquisition bytes before touching it. */
function renewGatewayStateOwnerLock(fd, lockPath, raw, stamp) {
	const held = fs.fstatSync(fd, { bigint: true });
	const current = fs.statSync(lockPath, { bigint: true });
	const bytes = Buffer.alloc(Buffer.byteLength(raw) + 1);
	const length = fs.readSync(fd, bytes, 0, bytes.length, 0);
	if (held.nlink === 0n || held.dev !== current.dev || held.ino !== current.ino || bytes.subarray(0, length).toString("utf8") !== raw) return false;
	fs.futimesSync(fd, stamp, stamp);
	return true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/json.js
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveInvalidMessage(invalidMessage, relativePath) {
	if (typeof invalidMessage === "function") return invalidMessage(relativePath);
	return invalidMessage ?? `${relativePath} has an unexpected shape`;
}
function readRootStructuredFileSyncInternal(options, parser) {
	let absolutePath;
	let relativePath;
	let rootDir;
	let rootRealPath;
	try {
		rootDir = options.rootDir;
		relativePath = options.relativePath;
		rootRealPath = options.rootRealPath;
		assertNoWindowsPathAlias(rootDir);
		assertNoWindowsPathAlias(relativePath, "relative");
		if (rootRealPath !== void 0) assertNoWindowsPathAlias(rootRealPath);
		absolutePath = path.resolve(rootDir, relativePath);
		assertNoWindowsPathAlias(absolutePath);
	} catch (error) {
		return {
			ok: false,
			reason: "open",
			failure: {
				ok: false,
				reason: "validation",
				error
			}
		};
	}
	const boundaryLabel = options.boundaryLabel;
	const rejectHardlinks = options.rejectHardlinks;
	const maxBytes = options.maxBytes;
	const opened = openRootFileSync({
		absolutePath,
		rootPath: rootDir,
		rootRealPath,
		boundaryLabel,
		rejectHardlinks,
		maxBytes,
		allowedType: "file"
	});
	if (!opened.ok) return {
		ok: false,
		reason: "open",
		failure: opened
	};
	try {
		const raw = maxBytes === void 0 ? fs.readFileSync(opened.fd, "utf8") : readFileDescriptorBoundedSync(opened.fd, maxBytes).toString("utf8");
		const parse = parser.parse;
		const parsed = Reflect.apply(parse, parser, [raw]);
		const validate = parser.validate;
		if (validate && !Reflect.apply(validate, parser, [parsed])) return {
			ok: false,
			reason: "invalid",
			error: resolveInvalidMessage(parser.invalidMessage, relativePath)
		};
		return {
			ok: true,
			value: parsed,
			stat: opened.stat,
			path: opened.path,
			rootRealPath: opened.rootRealPath
		};
	} catch (error) {
		return {
			ok: false,
			reason: "parse",
			error: `failed to parse ${relativePath}: ${String(error)}`
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
function readRootJsonObjectSync(options) {
	return readRootStructuredFileSyncInternal(options, {
		parse: (raw) => JSON.parse(raw),
		validate: isRecord,
		invalidMessage: (relativePath) => `${relativePath} must contain a JSON object`
	});
}
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function isBunTargetRuntime(execPath) {
	return execPath === process.execPath ? Boolean(process.versions.bun) : isBunRuntime(execPath);
}
/** Disable implicit package installation in OpenClaw-owned Bun processes. */
function resolveRuntimeArgs(execPath = process.execPath) {
	return isBunTargetRuntime(execPath) ? ["--no-install"] : [];
}
/** Whether a source TypeScript module needs Node's tsx loader; Bun runs TypeScript natively. */
function runtimeNeedsTypeScriptLoader(modulePath, execPath = process.execPath) {
	return /\.[cm]?ts$/.test(modulePath) && !isBunTargetRuntime(execPath);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return runtimeNeedsTypeScriptLoader(entry, execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [...resolveRuntimeArgs(execPath), entry];
}
/** Select the source Worker preload without feeding Node's TypeScript loader to Bun. */
function resolveRuntimeWorkerThreadExecArgv(url, execPath = process.execPath) {
	return url.protocol === "file:" && runtimeNeedsTypeScriptLoader(fileURLToPath(url), execPath) ? ["--import", import.meta.resolve("tsx/esm")] : [];
}
//#endregion
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
//#endregion
//#region worker-heap-flag.mjs
const startupFlags = `${process.execArgv.join(" ")} ${process.env.NODE_OPTIONS ?? ""}`;
const heapFlag = /--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u;
const immutableFlags = /--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u;
if (isMainThread && !process.versions.bun && heapFlag.test(startupFlags)) {
	if (immutableFlags.test(startupFlags)) process.emitWarning("V8 startup flags prevent enforcing per-worker heap limits.");
	else setFlagsFromString("--max-old-space-size=0 --max-heap-size=0");
}
//#endregion
//#region src/infra/worker-message-metrics.ts
const counters = resolveGlobalSingleton(Symbol.for("openclaw.workerMessageMetrics"), () => /* @__PURE__ */ new Map());
/** The main endpoint counts each crossing once, using byte lengths already known by its owner. */
function recordWorkerMessage(kind, direction, payloadBytes) {
	if (!isMainThread) return;
	let directions = counters.get(kind);
	if (!directions) {
		directions = {};
		counters.set(kind, directions);
	}
	const counter = directions[direction] ??= {
		kind,
		direction,
		messages: 0,
		payloadBytes: 0,
		unmeasuredMessages: 0
	};
	counter.messages++;
	if (payloadBytes === void 0) counter.unmeasuredMessages++;
	else counter.payloadBytes += payloadBytes;
}
function messageData(message) {
	return isRecord$1(message) && !types.isProxy(message) ? message : void 0;
}
function dataProperty(message, key) {
	return Object.getOwnPropertyDescriptor(message, key)?.value;
}
function messageBody(message) {
	const data = messageData(message);
	const type = data && dataProperty(data, "type");
	return data && (type === "post" || type === "message") ? dataProperty(data, "value") : message;
}
/** Known payload bytes only: no serialization, graph traversal, or envelope estimate. */
function workerMessagePayloadBytes(message) {
	if (!isMainThread) return;
	const body = messageBody(message);
	const data = messageData(body);
	const payload = data && (Object.getOwnPropertyDescriptor(data, "value") ?? Object.getOwnPropertyDescriptor(data, "input"));
	if (payload && !("value" in payload)) return;
	const value = payload ? payload.value : body;
	if (types.isProxy(value)) return;
	if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
		const preparation = data && dataProperty(data, "type") === "open" ? dataProperty(data, "preparation") : void 0;
		return value.byteLength + (ArrayBuffer.isView(preparation) ? preparation.byteLength : 0);
	}
	if (typeof value === "string") return value.length * 2;
	if (value === null || value === void 0) return 0;
}
function messageKind(message, fallback) {
	const body = messageData(messageBody(message));
	if (!body) return fallback;
	switch (dataProperty(body, "status")) {
		case "ok":
		case "failed": return "task_reply";
		case "request": return "task_request";
		case "notification": return "task_notification";
		case "consumed": return "task_consumed";
		case "memory": return "memory";
		case "ready": return "lifecycle";
	}
	if (typeof dataProperty(body, "taskId") === "number") return "task_input";
	if (typeof dataProperty(body, "actor") === "number") return "sqlite_request";
	if (typeof dataProperty(body, "id") === "number" && typeof dataProperty(body, "ok") === "boolean") return "sqlite_reply";
	if (typeof dataProperty(body, "operationId") === "number") switch (dataProperty(body, "type")) {
		case "prepare":
		case "reclaim":
		case "canonical-validation": return "sqlite_request";
		case "reclaimed":
		case "refused":
		case "checkpoint": return "sqlite_reply";
		case "admission":
		case "admission-request":
		case "admission-release": return "admission";
		case "commit-request": return "authority";
	}
	switch (dataProperty(body, "type")) {
		case "resource-owner":
		case "resource-message":
		case "resource-closed": return "resource";
		case "cpu":
		case "heap": return "memory";
		case "create":
		case "created":
		case "stop":
		case "stopped":
		case "close":
		case "closed":
		case "release":
		case "ref":
		case "execution-exit":
		case "error":
		case "messageerror":
		case "create-error":
		case "stop-error":
		case "request-error": return "lifecycle";
	}
	return dataProperty(body, "closeResource") === true ? "resource" : fallback;
}
/** Observe each native boundary once; null preserves a prepared unknown byte count. */
function observeWorkerMessage(message, direction, fallbackKind = "other", payloadBytes) {
	if (isMainThread) recordWorkerMessage(messageKind(message, fallbackKind), direction, payloadBytes === void 0 ? workerMessagePayloadBytes(message) : payloadBytes ?? void 0);
}
//#endregion
//#region src/infra/worker-cpu.ts
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?[jt]s$/u, ".js");
	return normalizeDiagnosticWorkerScript(name);
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		gcObserver: void 0,
		revision: 0,
		nextPoolId: 0,
		poolIds: /* @__PURE__ */ new WeakMap(),
		workers: /* @__PURE__ */ new Map(),
		lifecycle: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = runWithMainThreadTask(`worker:${workerScriptName(args[0], args[1]?.eval)}`, () => new Worker(...args));
	trackNativeWorkerForCpu(worker, args[0], args[1]?.eval);
	trackedWorkers.workers.get(worker).internalMessages = true;
	return worker;
}
/** Register a physical child only after its native lifetime owner confirms construction. */
function trackNativeWorkerForCpu(worker, filename, evalSource = false) {
	trackWorker(worker);
	const source = trackedWorkers.workers.get(worker);
	source.script = workerScriptName(filename, evalSource);
	if (source.script === "code-mode-node.worker.js" && source.workerSlot === void 0) {
		const occupied = new Set([...trackedWorkers.workers.values()].map((entry) => entry.workerSlot));
		for (let slot = 1; slot <= 64; slot++) if (!occupied.has(slot)) {
			source.workerSlot = slot;
			break;
		}
	}
	source.lifecycleMessages = source.script === "openclaw-state-lease-heartbeat.worker.js" || source.script === "gateway-state-owner-heartbeat.worker.js";
}
/** Pool identity follows its live Workers without retaining the pool itself. */
function attributeWorkerToPool(worker, pool) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	let poolId = trackedWorkers.poolIds.get(pool);
	if (poolId === void 0) {
		poolId = ++trackedWorkers.nextPoolId;
		trackedWorkers.poolIds.set(pool, poolId);
	}
	source.poolId = poolId;
}
function forgetWorker(worker) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	const counts = countWorkerStart(source);
	const reason = source.retirementReason ?? "exit";
	counts.retired.set(reason, (counts.retired.get(reason) ?? 0) + 1);
	source.memoryPort?.close();
	trackedWorkers.workers.delete(worker);
	trackedWorkers.revision++;
}
function countWorkerStart(source) {
	let counts = trackedWorkers.lifecycle.get(source.script);
	if (!counts) {
		counts = {
			started: 0,
			retired: /* @__PURE__ */ new Map()
		};
		trackedWorkers.lifecycle.set(source.script, counts);
	}
	if (!source.started) {
		source.started = true;
		counts.started++;
	}
	return counts;
}
/** Record the owner's reason now; only confirmed native exit increments retirement. */
function markWorkerRetirement(worker, reason) {
	const source = trackedWorkers.workers.get(worker);
	if (source) source.retirementReason ??= reason;
}
function canObserveWorkerMessages(worker) {
	if (!Object.isExtensible(worker)) return false;
	for (const method of ["postMessage", "emit"]) {
		let owner = worker;
		while (owner) {
			const descriptor = Object.getOwnPropertyDescriptor(owner, method);
			if (descriptor) {
				if (!descriptor.writable || typeof descriptor.value !== "function") return false;
				break;
			}
			owner = Reflect.getPrototypeOf(owner);
		}
		if (!owner) return false;
	}
	return true;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	if (isMainThread && worker instanceof Worker) recordWorkerMessage("lifecycle", "to_worker");
	if (isMainThread && worker instanceof Worker && canObserveWorkerMessages(worker)) {
		const nativePrototype = Object.getPrototypeOf(worker) === Worker.prototype;
		const postMessage = !nativePrototype || Object.hasOwn(worker, "postMessage") ? worker.postMessage : void 0;
		worker.postMessage = function(value, transferList) {
			const bytes = source.internalMessages ? workerMessagePayloadBytes(value) : void 0;
			(postMessage ?? Worker.prototype.postMessage).call(this, value, transferList);
			if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "to_worker", bytes);
			else if (source.internalMessages) observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
			else recordWorkerMessage("other", "to_worker");
		};
		const emit = !nativePrototype || Object.hasOwn(worker, "emit") ? worker.emit : void 0;
		worker.emit = function(event, ...args) {
			if (event === "message") {
				if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "from_worker", workerMessagePayloadBytes(args[0]));
				else if (source.internalMessages) observeWorkerMessage(args[0], "from_worker");
				else recordWorkerMessage("other", "from_worker");
			}
			return (emit ?? Worker.prototype.emit).call(this, event, ...args);
		};
	}
	let pending = false;
	const source = {
		script: "other",
		async cpuUsage() {
			if (pending) return;
			pending = true;
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			} finally {
				pending = false;
			}
		}
	};
	trackedWorkers.workers.set(worker, source);
	queueMicrotask(() => countWorkerStart(source));
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
/** The existing registry owns this channel until native exit, never the submitting task. */
function receiveWorkerMemoryPort(worker, message) {
	if (!isRecord$1(message) || message.status !== "memory" || !(message.port instanceof MessagePort)) return false;
	const port = message.port;
	const source = trackedWorkers.workers.get(worker);
	if (!source || source.memoryPort || worker.threadId === -1) {
		port.close();
		return true;
	}
	source.memoryPort = port;
	source.memoryPending = true;
	const close = () => {
		source.memoryPort = void 0;
		source.memoryPending = false;
		source.memoryUnavailable = true;
		port.close();
	};
	port.on("message", (record) => {
		recordWorkerMessage("memory", "from_worker", ("heapUsed" in record ? 32 + (record.heapSizeLimitBytes === void 0 ? 0 : 8) : 0) + (record.gc?.length ?? 0) * 8);
		if (record.gc) trackedWorkers.gcObserver?.(record.gc, source.script, source.workerSlot);
		if (!("heapUsed" in record)) return;
		delete record.gc;
		source.heap = {
			value: record,
			sampledAt: performance.now()
		};
		source.memoryPending = false;
		source.memoryUnavailable = false;
	});
	port.once("close", close);
	port.once("messageerror", close);
	port.unref();
	if (trackedWorkers.gcObserver) {
		port.postMessage({ gc: true });
		recordWorkerMessage("memory", "to_worker", 1);
	}
	return true;
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.ts
const now = Date.now.bind(Date);
/** Process and schema owners share one renewal worker and one failure deadline. */
function startGatewayStateOwnerHeartbeat(heldLocks, onLost) {
	const locks = {};
	for (const lock of heldLocks) {
		locks[lock.lockPath] = fs.readFileSync(lock.lockPath, "utf8");
		if (!lock.verifyStillHeld()) throw new Error("OpenClaw state ownership is no longer current");
	}
	const rootPath = Object.keys(locks)[0];
	if (!rootPath) throw new Error("Gateway state ownership requires a held lock");
	const rootIdentity = fs.statSync(rootPath, { bigint: true });
	const { moduleUrl: url, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("gatewayStateOwnerHeartbeat"));
	return runInDetachedAsyncContext(() => {
		const lastBeat = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
		Atomics.store(lastBeat, 0, BigInt(now()));
		const { port1, port2 } = new MessageChannel();
		const worker = createCpuTrackedWorker(url, {
			workerData: {
				clock: "epoch",
				locks,
				intervalMs: GATEWAY_OWNER_HEARTBEAT_MS,
				failureMs: 6e4,
				lastBeat: lastBeat.buffer,
				events: port2
			},
			transferList: [port2],
			execArgv: resolveRuntimeWorkerThreadExecArgv(url)
		});
		worker.unref();
		port1.on("message", () => recordWorkerMessage("lifecycle", "from_worker"));
		port1.unref();
		worker.on("error", (err) => onLost(/* @__PURE__ */ new Error(`${coerceErrorMessage(err)}; restart Gateway.`)));
		const inspect = () => {
			const renewedAt = Atomics.load(lastBeat, 0);
			const age = now() - Number(renewedAt);
			const remaining = age < 0 ? 0 : 6e4 - age;
			if (remaining <= 0) try {
				const renewalStartedAt = now();
				const stamp = new Date(renewalStartedAt);
				for (const lock of heldLocks) {
					if (!lock.verifyStillHeld()) {
						if (lock.lockPath !== rootPath) continue;
						throw new Error("owner lock was removed or replaced");
					}
					const fd = fs.openSync(lock.lockPath, "r+");
					try {
						const held = fs.fstatSync(fd, { bigint: true });
						if (lock.lockPath === rootPath && (held.dev !== rootIdentity.dev || held.ino !== rootIdentity.ino)) throw new Error("owner lock was removed or replaced");
						const raw = fs.readFileSync(fd, "utf8");
						if (!lock.verifyStillHeld() || !renewGatewayStateOwnerLock(fd, lock.lockPath, raw, stamp)) throw new Error("owner lock was removed or replaced");
					} finally {
						fs.closeSync(fd);
					}
				}
				Atomics.store(lastBeat, 0, BigInt(renewalStartedAt));
				return 6e4;
			} catch (error) {
				onLost(/* @__PURE__ */ new Error(`Gateway state ownership is no longer current at ${rootPath}: ${coerceErrorMessage(error)}; restart the Gateway.`));
			}
			return remaining;
		};
		let timer;
		const watch = () => {
			const remaining = inspect();
			if (remaining > 0) {
				timer = setTimeout(watch, remaining);
				timer.unref();
			}
		};
		watch();
		let termination;
		const stop = () => {
			if (termination) return;
			clearTimeout(timer);
			port1.close();
			worker.postMessage("stop", []);
			termination ??= worker.terminate();
		};
		runtimeGeneration?.retain(worker, async () => async () => {
			stop();
			await termination;
		});
		return {
			worker,
			paths: new Set(Object.keys(locks)),
			inspect,
			stop
		};
	});
}
//#endregion
//#region src/infra/stale-lock-file.ts
function readLockFileOwnerPayload(payload) {
	if (!payload) return null;
	return {
		pid: typeof payload.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : void 0,
		createdAt: typeof payload.createdAt === "string" ? payload.createdAt : void 0,
		starttime: typeof payload.starttime === "number" && Number.isInteger(payload.starttime) && payload.starttime >= 0 ? payload.starttime : void 0
	};
}
/** Capture only the bounded facts used by this exact stale decision. Never
* resample the owner after failure or copy arbitrary sidecar payload fields. */
function inspectStaleLockOwner(params) {
	const payload = readLockFileOwnerPayload(params.payload);
	if (!payload?.pid) return null;
	const observedStarttime = payload.starttime === void 0 ? null : (params.getProcessStartTime ?? getFileLockProcessStartTime)(payload.pid);
	const identity = {
		pid: payload.pid,
		recordedStarttime: payload.starttime ?? null,
		observedStarttime
	};
	const normalizedStored = process.platform === "darwin" && payload.starttime !== void 0 && payload.starttime > 1e10 ? Math.floor(payload.starttime / 1e6) : payload.starttime;
	if (observedStarttime !== null && observedStarttime !== normalizedStored) return {
		reason: "owner-starttime-changed",
		...identity
	};
	return (params.isPidDefinitelyDead ?? isPidDefinitelyDead)(payload.pid) ? {
		reason: "owner-process-exited",
		...identity
	} : null;
}
function isLockOwnerDefinitelyStale(params) {
	return inspectStaleLockOwner(params) !== null;
}
//#endregion
//#region src/infra/gateway-state-owner-record.ts
/** Admission and reclamation use the same namespace-qualified PID evidence. */
function isGatewayStateOwnerDefinitelyStale(value, lockPath) {
	const payload = isRecord$1(value) ? value : null;
	const namespace = classifyGatewayLockProcessNamespace(payload?.processNamespace, lockPath);
	if (namespace === "unknown") throw new GatewayLockNamespaceError(payload ?? {}, lockPath);
	return namespace === "dead" || isLockOwnerDefinitelyStale({ payload: payload ? {
		pid: payload.pid,
		starttime: payload.startTime
	} : null });
}
var StateDatabaseAccessError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "StateDatabaseAccessError";
	}
};
const GatewayStateOwnerContentionError = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwnerContentionError"), () => class StateOwnerContentionError extends Error {
	constructor(databasePath, cause, holderDetail, holder) {
		super(`OpenClaw state database is busy at ${databasePath}. ${holderDetail ? `${holderDetail} ` : ""}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`);
		this.databasePath = databasePath;
		this.cause = cause;
		this.holderDetail = holderDetail;
		this.holder = holder;
		this.name = "GatewayStateOwnerContentionError";
	}
});
/** A local holder exists, but the caller has no live lexical maintenance authority. */
const StateDatabaseMaintenanceScopeError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseMaintenanceScopeError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath) {
		super(`Internal state ownership error at ${databasePath}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`);
		this.databasePath = databasePath;
		this.name = "StateDatabaseMaintenanceScopeError";
	}
});
const StateDatabaseAdmissionPendingError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseAdmissionPendingError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** A live foreign process holds offline-maintenance custody of this database. */
const StateDatabaseOfflineMaintenanceError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseOfflineMaintenanceError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** Persisted ownership can identify a holder but cannot lend this process maintenance authority. */
function assertPersistedStateDatabaseAccessAllowed(params) {
	const { databasePath, ownerPath, assertMaintenance } = params;
	const unavailable = `OpenClaw state ownership at ${databasePath} could not be verified from ${ownerPath}; restart the Gateway.`;
	let raw;
	try {
		raw = fs.readFileSync(ownerPath, "utf8");
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		throw new StateDatabaseAccessError(unavailable, { cause: error });
	}
	const owner = parseGatewayLockPayload(raw);
	if (!owner) throw new StateDatabaseAdmissionPendingError(databasePath, unavailable);
	if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0) throw new StateDatabaseAccessError(unavailable);
	if (isGatewayStateOwnerDefinitelyStale(owner, ownerPath)) return;
	if (owner.pid === process.pid && !isMainThread) return;
	if (!isPidAlive(owner.pid)) throw new StateDatabaseAccessError(unavailable);
	const role = owner.role ?? "gateway";
	if (role === "gateway" || role === "agent-embedded") return;
	if (owner.pid === process.pid) {
		assertMaintenance();
		return;
	}
	const maintenancePending = `OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes. For update progress, run \`openclaw update status --json\`.`;
	if (owner.stateOwnerKind === "schema" && owner.role === "sqlite-maintenance") throw new StateDatabaseAdmissionPendingError(databasePath, maintenancePending);
	throw new StateDatabaseOfflineMaintenanceError(databasePath, maintenancePending);
}
function defaultPayload(databasePath) {
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	const startTime = getFileLockProcessStartTime(process.pid);
	return {
		pid: process.pid,
		ownerId: randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir,
		configPath: path.join(stateDir, "openclaw.json"),
		role: "sqlite-maintenance",
		processNamespace: readGatewayLockProcessNamespace(),
		...startTime === null ? {} : { startTime }
	};
}
//#endregion
//#region src/infra/gateway-state-owner.ts
function hasPhysicalOwnership(owner) {
	try {
		return verifyOwnerLock(owner, owner.locks.values().next().value);
	} catch (error) {
		if (owner.lost.signal.aborted) return false;
		throw error;
	}
}
function verifyOwnerLock(owner, lock) {
	owner.lost.signal.throwIfAborted();
	owner.heartbeat?.inspect();
	owner.lost.signal.throwIfAborted();
	if (!lock) return false;
	if (!lock.verifyStillHeld()) {
		loseOwner(owner, /* @__PURE__ */ new Error(`${lock.lockPath}: no longer current; lock removed/replaced; restart the Gateway.`));
		return false;
	}
	const projection = owner.getProjection?.();
	if (projection && owner.heartbeat && !owner.heartbeat.paths.has(projection.lockPath)) {
		const raw = fs.readFileSync(projection.lockPath, "utf8");
		if (!projection.verifyStillHeld()) return false;
		owner.heartbeat.worker.postMessage([projection.lockPath, raw], []);
		owner.heartbeat.paths.add(projection.lockPath);
	}
	return true;
}
const log = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log.error(error.message);
	owner.lost.abort(error);
}
const readOwnerPaths = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateReadOwnerPaths"), () => /* @__PURE__ */ new Map());
const owners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwners"), () => /* @__PURE__ */ new Map());
const schemaOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaOwners"), () => new AsyncLocalStorage());
/** The synchronous lexical owner is live authority, not the existence of its sidecar. */
function getStateDatabaseSchemaLease(databasePath) {
	const entry = schemaOwners.getStore()?.get(resolveStateOwnerIdentity(databasePath).key);
	if (entry && !entry.active) throw new Error("State schema maintenance scope is no longer current");
	entry?.lease.assertCurrent();
	return entry?.lease;
}
/** Retry cold admission only; the same budget covers opening and its first unentered write. */
function withStateDatabaseColdAdmission(params, open) {
	const budget = normalizeSqliteNonNegativeInteger(params.busyTimeoutMs, "busyTimeoutMs");
	const deadline = performance.now() + budget;
	const canonical = resolveIdentityPathViaExistingAncestorSync(params.databasePath);
	const remainingBusyTimeoutMs = () => Math.max(0, Math.ceil(deadline - performance.now()));
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	for (;;) try {
		assertStateDatabaseAccessAllowed(params.databasePath);
		return open(remainingBusyTimeoutMs);
	} catch (error) {
		if (!(error instanceof StateDatabaseAdmissionPendingError) || resolveIdentityPathViaExistingAncestorSync(error.databasePath) !== canonical || params.canRetry?.() === false) throw error;
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw error;
		Atomics.wait(waiting, 0, 0, Math.min(10, remaining));
	}
}
function acquireOwnerFile(databasePath, pathname, payload, busyTimeoutMs = 0, createdDirectories) {
	const deadline = performance.now() + busyTimeoutMs;
	ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
	const observed = { holder: null };
	const parsePayload = (raw) => {
		if (raw !== observed.raw) {
			observed.holder = parseGatewayLockPayload(raw);
			observed.raw = raw;
		}
		return observed.holder;
	};
	const stale = ({ payload: value }) => isGatewayStateOwnerDefinitelyStale(value, pathname);
	if (busyTimeoutMs > 0) try {
		const previous = parsePayload(fs.readFileSync(pathname, "utf8"));
		if (previous && !stale({ payload: previous }) && (previous.pid === process.pid || (previous.role ?? "gateway") === "gateway" && isPidAlive(previous.pid))) throw new GatewayStateOwnerContentionError(databasePath);
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	for (let retriedMissingParent = false;;) try {
		return acquireFileLockSync(pathname, {
			lockPath: pathname,
			retry: busyTimeoutMs > 0 ? {
				factor: 1.25,
				minTimeout: 10,
				maxTimeout: 25,
				randomize: false
			} : { retries: 0 },
			timeoutMs: Math.max(0, Math.ceil(deadline - performance.now())),
			staleMs: Infinity,
			staleRecovery: "remove-if-unchanged",
			reentrantOwner: payload.ownerId,
			payload: () => payload,
			parsePayload,
			shouldReclaim: stale,
			shouldRemoveStaleLock: stale
		});
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" && !retriedMissingParent) {
			retriedMissingParent = true;
			ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
			continue;
		}
		if (code === "file_lock_timeout" || code === "file_lock_stale") {
			const { holder } = observed;
			const holderDetail = describeGatewayLockHolder(holder ?? {}, pathname, holder && isPidAlive(holder.pid) ? "live" : "unknown");
			throw new GatewayStateOwnerContentionError(databasePath, error, holderDetail);
		}
		throw error;
	}
}
function leaseForFile(pathname, lock, owner, projection) {
	let released = false;
	const holdsPhysicalLease = () => verifyOwnerLock(owner, lock) && (!projection || projection.verifyStillHeld());
	const lease = {
		path: pathname,
		assertCurrent() {
			if (released || !holdsPhysicalLease()) throw new Error("OpenClaw state ownership is no longer current");
		},
		assertDatabaseAccess(databasePath) {
			if (released || owners.get(owner.key) !== owner || resolveStateOwnerIdentity(databasePath).key !== owner.key || !holdsPhysicalLease()) throw new Error("OpenClaw state maintenance does not own this database");
		},
		run(operation) {
			lease.assertCurrent();
			readOwnerPaths.clear();
			const inherited = new Map(schemaOwners.getStore());
			const entry = {
				lease,
				active: true
			};
			inherited.set(owner.key, entry);
			try {
				return schemaOwners.run(inherited, operation);
			} finally {
				entry.active = false;
				readOwnerPaths.clear();
			}
		},
		release() {
			readOwnerPaths.clear();
			if (!released) {
				projection?.release();
				lock.release();
				released = true;
				owner.locks.delete(lock);
				if (projection) owner.locks.delete(projection);
				if (owner.locks.size === 0 && owners.get(owner.key) === owner) {
					owner.heartbeat?.stop();
					owner.accepting = false;
					owners.delete(owner.key);
				}
			}
			if (owner.locks.size === 0) removeCreatedProjectionDirectories(owner.projectionDirectories);
		}
	};
	return lease;
}
/** Accepted schema work retains the sidecar even when its process owner stops lending. */
function acquireStateDatabaseSchemaLease(databasePath, options = {}) {
	readOwnerPaths.clear();
	const identity = resolveStateOwnerIdentity(databasePath);
	let owner = owners.get(identity.key);
	const pathname = owner?.path ?? identity.ownerPath;
	if (owner && (!owner.accepting || !hasPhysicalOwnership(owner))) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	if (owner) assertStateDatabaseAccessAllowed(databasePath);
	const payload = owner?.payload ?? {
		...defaultPayload(databasePath),
		stateOwnerKind: "schema"
	};
	let lock;
	const projectionDirectories = [];
	try {
		lock = acquireOwnerFile(databasePath, pathname, payload, owner ? 0 : options.busyTimeoutMs ?? 5e3, projectionDirectories);
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) try {
			assertStateDatabaseAccessAllowed(databasePath);
		} catch (currentOwnerError) {
			if (currentOwnerError instanceof StateDatabaseAdmissionPendingError) throw currentOwnerError;
		}
		throw error;
	}
	const projectionPath = owner?.projectionPath ?? path.join(resolveGatewayLockDir(resolveOpenClawStateDirForDatabasePath(resolveIdentityPathViaExistingAncestorSync(databasePath))), "gateway.state.lock");
	let projection;
	try {
		projection = owner?.getProjection?.()?.retain() ?? acquireOwnerFile(databasePath, projectionPath, {
			...payload,
			role: payload.role === "gateway" ? "gateway" : "agent-embedded"
		}, 0, projectionDirectories);
	} catch (error) {
		return runWithSqliteCleanup({ release() {
			lock.release();
			removeCreatedProjectionDirectories(projectionDirectories);
		} }, "state schema projection admission", () => {
			throw error;
		});
	}
	if (owner) {
		owner.locks.add(lock);
		owner.locks.add(projection);
		owner.projectionDirectories.push(...projectionDirectories);
	} else {
		owner = {
			key: identity.key,
			path: pathname,
			kind: "schema",
			payload,
			projectionPath,
			locks: /* @__PURE__ */ new Set([lock, projection]),
			projectionDirectories,
			lost: new AbortController(),
			accepting: true
		};
		owners.set(owner.key, owner);
	}
	const lease = leaseForFile(pathname, lock, owner, projection);
	try {
		const heartbeat = owner.heartbeat ??= startGatewayStateOwnerHeartbeat(owner.locks, (error) => loseOwner(owner, error));
		const raw = fs.readFileSync(projection.lockPath, "utf8");
		lease.assertCurrent();
		heartbeat.worker.postMessage([projection.lockPath, raw], []);
		heartbeat.paths.add(projection.lockPath);
		return lease;
	} catch (error) {
		return runWithSqliteCleanup(lease, "state schema ownership verification", () => {
			throw error;
		});
	}
}
/** Reads within an admission reuse process custody; the next admission verifies the lock. */
function assertStateDatabaseReadAllowed(databasePath, captured) {
	assertStateDatabaseReadAtOwnerPath(databasePath, captured);
}
function assertStateDatabaseReadAtOwnerPath(databasePath, captured, prepared) {
	if (owners.size === 0) {
		assertStateDatabaseAccessAtOwnerPath(databasePath, prepared ?? resolveStateOwnerIdentity(databasePath), captured);
		return;
	}
	const key = path.resolve(databasePath);
	if (readOwnerPaths.get(key)?.accepting) return;
	readOwnerPaths.delete(key);
	const identity = prepared ?? resolveStateOwnerIdentity(databasePath);
	const owner = owners.get(identity.key);
	const role = owner?.payload.role ?? "gateway";
	if (!owner || owner.kind !== "process" || !owner.accepting || role !== "gateway" && role !== "agent-embedded") {
		assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured);
		return;
	}
	if (!hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) {
		owner.lost.signal.throwIfAborted();
		throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
	}
	readOwnerPaths.set(key, owner);
}
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
function assertStateDatabaseAccessAllowed(databasePath, captured) {
	assertStateDatabaseAccessAtOwnerPath(databasePath, resolveStateOwnerIdentity(databasePath), captured);
}
/** Retained handles keep their admitted paths; reopening captures a fresh identity. */
function captureStateDatabaseAccess(databasePath) {
	const identity = resolveStateOwnerIdentity(databasePath);
	const { canonicalPath } = identity;
	return {
		canonicalPath,
		assertAccessAllowed(captured) {
			assertStateDatabaseAccessAtOwnerPath(canonicalPath, identity, captured);
		},
		assertReadAllowed(captured) {
			assertStateDatabaseReadAtOwnerPath(canonicalPath, captured, identity);
		}
	};
}
function assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured) {
	const assertMaintenance = () => {
		const schemaLease = captured ? captured.schemaLease : getStateDatabaseSchemaLease(databasePath);
		if (schemaLease) {
			schemaLease.assertDatabaseAccess(databasePath);
			return;
		}
		const scope = captured ? captured.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new StateDatabaseMaintenanceScopeError(databasePath);
		scope.assertDatabaseAccess(databasePath);
	};
	const local = owners.get(identity.key);
	if (local) {
		if (!hasPhysicalOwnership(local)) {
			local.lost.signal.throwIfAborted();
			throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
		}
		const role = local.payload.role ?? "gateway";
		if (!local.accepting || role !== "gateway" && role !== "agent-embedded") assertMaintenance();
		return;
	}
	assertPersistedStateDatabaseAccessAllowed({
		databasePath,
		ownerPath: identity.ownerPath,
		assertMaintenance
	});
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
const SQLITE_HEADER_BYTES = 20;
const SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS = 3e4;
const SQLITE_READONLY_RESULT_CODE = 8;
const SQLITE_RESULT_CODE_MASK = 255;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function openPinnedFile(pathname, expectedSourceIdentity) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		if (expectedSourceIdentity) assertDatabaseFileIdentity(identity, expectedSourceIdentity);
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname, expectedSourceIdentity) {
	const source = openPinnedFile(pathname, expectedSourceIdentity);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copySourceFile(sourcePath, targetPath, expectedSourceIdentity) {
	const source = openPinnedFile(sourcePath, expectedSourceIdentity);
	try {
		const target = fs.openSync(targetPath, "wx", 384);
		try {
			copyFileDescriptorSync(source.descriptor, target);
			fs.fsyncSync(target);
			assertPinnedIdentityUnchanged(source);
		} finally {
			fs.closeSync(target);
		}
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath, expectedSourceIdentity) {
	const source = openPinnedFile(sourcePath, expectedSourceIdentity);
	try {
		const copy = fs.openSync(copyPath, "r");
		try {
			if (!fs.fstatSync(copy).isFile()) return false;
			const equal = sameFileContentsSync(source.descriptor, copy);
			assertPinnedIdentityUnchanged(source);
			return equal;
		} finally {
			fs.closeSync(copy);
		}
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertExpectedSidecars(pathname, expected) {
	const current = readSourceSidecars(pathname);
	if (current.journal !== expected.journal || current.wal !== expected.wal) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function isSqliteReadOnlyError(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		const details = current;
		if (typeof details.errcode === "number" && (details.errcode & SQLITE_RESULT_CODE_MASK) === SQLITE_READONLY_RESULT_CODE) return true;
		current = details.cause;
	}
	return false;
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs.openSync(journalPath, "r");
	try {
		const size = fs.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs.closeSync(descriptor);
	}
}
function syncPrivateSnapshot(snapshotPath) {
	const descriptor = fs.openSync(snapshotPath, "r+");
	try {
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
function recoverPrivateJournalCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs.rmSync(`${snapshotPath}-journal`, { force: true });
	syncPrivateSnapshot(snapshotPath);
}
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs.existsSync(staged)) fs.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function* createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot(), expectedSourceIdentity) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname, expectedSourceIdentity) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copyPrefix = prepareSqliteWalPrefixCopy(wal.descriptor, `${snapshotPath}-wal`, () => sourceMatchesCopy(pathname, snapshotPath, expectedSourceIdentity));
				if (copyPrefix) yield {
					sourcePath: pathname,
					targetPath: snapshotPath,
					expectedSourceIdentity
				};
				const copied = copyPrefix?.();
				assertPinnedIdentityUnchanged(wal);
				if (copied === false) throw new SqliteSourceChangedError(`SQLite WAL generation changed while copying: ${pathname}`);
				copiedWalPrefix = copied === true;
			} finally {
				fs.closeSync(wal.descriptor);
			}
		}
		const sidecarSuffixes = [...sidecars.journal ? ["-journal"] : [], ...sidecars.wal ? ["-wal"] : []];
		if (copiedWalPrefix) assertExpectedSidecars(pathname, sidecars);
		else if (sidecarSuffixes.length > 0) {
			for (const suffix of sidecarSuffixes) yield {
				sourcePath: `${pathname}${suffix}`,
				targetPath: `${snapshotPath}${suffix}`
			};
			yield {
				sourcePath: pathname,
				targetPath: snapshotPath,
				expectedSourceIdentity
			};
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			yield {
				sourcePath: pathname,
				targetPath: firstPath,
				expectedSourceIdentity
			};
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath, expectedSourceIdentity);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			fs.rmSync(snapshotPath, { force: true });
			fs.renameSync(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname, expectedSourceIdentity) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		const stagingError = tempDir ? sqliteSnapshotStagingError(tempDir, error, false, pathname) : error;
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw stagingError;
	}
}
function copyPreparedLocationSync(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			const { sourcePath, targetPath, expectedSourceIdentity } = step.value;
			copySourceFile(sourcePath, targetPath, expectedSourceIdentity);
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
async function copyPreparedLocation(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			const { sourcePath, targetPath, expectedSourceIdentity } = step.value;
			const source = openPinnedFile(sourcePath, expectedSourceIdentity);
			try {
				await copySqliteFile(sourcePath, targetPath, source.identity);
			} finally {
				try {
					assertPinnedIdentityUnchanged(source);
				} finally {
					fs.closeSync(source.descriptor);
				}
			}
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
function preparationCleanupError(errors, operation) {
	return createSqliteLifecycleAggregateError(errors, `${operation} and cleanup failed: ${coerceErrorMessage(errors[0])}`, errors[0]);
}
async function createStableReadOnlyCopy(pathname, journalMode, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	try {
		return await copyPreparedLocation(createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir));
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(tempDir, (cleanupError) => errors.push(cleanupError))) throw preparationCleanupError(errors, "SQLite snapshot preparation");
		throw error;
	}
}
/** Native reads may create WAL-index files; callers need an isolated child or a private source. */
async function createOnlineReadOnlyBackup(pathname, stagingRoot, signal, onProgress) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	const snapshotPath = path.join(tempDir, "database.sqlite.partial");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = withSqliteInspectionOperation("source", () => openNodeSqliteDatabase(pathname, { readOnly: true }));
		try {
			source.exec(`PRAGMA busy_timeout = ${SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF; BEGIN;`);
			source.prepare("PRAGMA schema_version;").get();
			await retainSnapshotWork(backupNodeSqliteDatabase(source, snapshotPath, onProgress));
			source.exec("ROLLBACK;");
		} finally {
			if (source.isOpen) source.close();
		}
		const snapshot = openNodeSqliteDatabase(snapshotPath);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		syncPrivateSnapshot(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		const stagingError = sqliteSnapshotStagingError(tempDir, error, false, pathname);
		const errors = [stagingError];
		if (!await removeTempDirectoryAsync(tempDir, (cleanupError) => errors.push(cleanupError))) throw preparationCleanupError(errors, "SQLite online backup");
		throw stagingError;
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
* In-process reads require drained source handles or a separate child: source
* close() must not release another live SQLite owner's POSIX locks.
*/
async function prepareReadOnlySourceInProcess(pathname, stagingRoot, signal, onProgress) {
	signal?.throwIfAborted();
	const canonicalPath = fs.realpathSync.native(pathname);
	const report = createSnapshotAttemptReporter(canonicalPath);
	for (let attempt = 0;; attempt += 1) {
		signal?.throwIfAborted();
		let operation = "online-backup";
		try {
			const journalMode = readSourceJournalMode(canonicalPath);
			const sidecars = readSourceSidecars(canonicalPath);
			let prepared;
			if (journalMode === "empty" || journalMode === "wal" && (!sidecars.wal || !sidecars.shm)) {
				operation = "raw-copy";
				prepared = await createStableReadOnlyCopy(canonicalPath, journalMode, stagingRoot, signal);
			} else try {
				prepared = await createOnlineReadOnlyBackup(canonicalPath, stagingRoot, signal, onProgress);
			} catch (error) {
				signal?.throwIfAborted();
				if (error instanceof AggregateError || !isSqliteReadOnlyError(error) || readSourceJournalMode(canonicalPath) !== "rollback" || !readSourceSidecars(canonicalPath).journal) throw error;
				operation = "raw-copy";
				prepared = await createStableReadOnlyCopy(canonicalPath, "rollback", stagingRoot, signal);
			}
			report(operation, "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError) || attempt + 1 >= 10) {
				report(operation, "error", void 0, error);
				throw error;
			}
		}
	}
}
function* prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return yield* createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath, expectedSourceIdentity), void 0, stagingRoot, expectedSourceIdentity);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot, expectedSourceIdentity) {
	return copyPreparedLocationSync(prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity));
}
/** Artifact-preserving acquisition with native CoW where supported, in the isolated child. */
function prepareSqliteReadOnlyCopyInProcess(pathname, stagingRoot, expectedSourceIdentity) {
	return copyPreparedLocation(prepareArtifactPreservingCopy(pathname, stagingRoot, expectedSourceIdentity));
}
function prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot, signal, onProgress) {
	signal?.throwIfAborted();
	return prepareReadOnlySourceInProcess(pathname, stagingRoot, signal, onProgress);
}
async function prepareSqliteReadOnlyLocationFromOwnedDatabase(database, assertCurrent, signal, cleanupMode) {
	const assertReady = () => {
		signal?.throwIfAborted();
		assertCurrent();
		if (!database.isOpen || database.isTransaction) throw new Error("SQLite inspection requires an open owner outside a transaction");
	};
	assertReady();
	const directory = await createSqliteSnapshotStagingDirectory(void 0, false, signal, cleanupMode === "async");
	try {
		assertReady();
		await retainSnapshotWork(backupNodeSqliteDatabase(database, path.join(directory, "database.sqlite.partial")));
		signal?.throwIfAborted();
		assertCurrent();
		return publishPreparedCopy(directory);
	} catch (error) {
		const errors = [error];
		if (!await removeTempDirectoryAsync(directory, (cleanupError) => errors.push(cleanupError)) && cleanupMode === "async") throw preparationCleanupError(errors, "Owned SQLite snapshot preparation");
		throw error;
	}
}
//#endregion
//#region src/shared/lazy-promise.ts
/**
* Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
*
* Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
*/
function createLazyPromiseLoader(load, options = {}) {
	let promise;
	const createPromise = () => {
		const loaded = Promise.resolve().then(load);
		if (options.cacheRejections !== true) loaded.catch(() => {
			if (promise === loaded) promise = void 0;
		});
		return loaded;
	};
	return {
		load() {
			promise ??= createPromise();
			return promise;
		},
		peek() {
			return promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
//#endregion
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
	const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
	return Object.assign(loader.load, {
		peek: loader.peek,
		clear: loader.clear
	});
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
	return createLazyRuntimeSurface(importer, (module) => module);
}
//#endregion
//#region src/state/worker-operation-registry.ts
function createWorkerOperationRegistry(loaders) {
	const domains = new Map(Object.entries(loaders).map(([name, load]) => [name, { load: createLazyRuntimeModule(load) }]));
	const domainFor = (type) => typeof type === "string" ? domains.get(type) ?? domains.get(type.slice(0, type.indexOf("."))) : void 0;
	const handlerFor = (type) => {
		const handlers = domainFor(type)?.handlers;
		return handlers && Object.hasOwn(handlers, type) ? handlers[String(type)] : void 0;
	};
	return {
		prepare(type) {
			const domain = domainFor(type);
			if (domain && !domain.handlers) return domain.load().then((handlers) => {
				domain.handlers = handlers;
			});
		},
		has(command) {
			return handlerFor(command.type) !== void 0;
		},
		execute(command, context) {
			const handler = handlerFor(command.type);
			if (!handler) throw new Error(`Worker operation is not prepared: ${String(command.type)}`);
			return handler(command.input, context);
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-operation-registry.ts
const sqliteReadOnlyOperations = createWorkerOperationRegistry({
	agentRetirement: () => import("./sqlite-readonly-agent-delete-session-store-safety.kernel-D_rnr4oI.mjs").then((module) => module.agentDeletionSessionStoreAbsentReadOperations),
	pageCache: () => import("./sqlite-readonly-sqlite-page-cache.worker-C3ZGFYZp.mjs").then((module) => module.pageCacheReadOperations),
	pluginCatalog: () => import("./sqlite-readonly-plugin-model-catalog.kernel-8cPp2a-r.mjs").then((module) => module.pluginModelCatalogReadOperations),
	immutableInstall: () => import("./sqlite-readonly-package-update-activation-immutable-B1qwTv2G.mjs").then((module) => module.immutableInstallReadOperations),
	stateSnapshot: () => import("./sqlite-readonly-openclaw-state-read-snapshot-CbleWL8O.mjs").then((module) => module.stateSnapshotReadOperations)
});
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
const SQLITE_INSPECTION_CONTENTION_PREFIX = "Retryable SQLite inspection contention: ";
const SQLITE_SNAPSHOT_ALLOCATION_REFUSED_PREFIX = "SQLite snapshot directory creation refused: ";
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	const args = [options.mode, path.resolve(pathname)];
	const stagingRoot = options.stagingRoot && path.resolve(options.stagingRoot);
	const expected = options.mode === "auth-profile-rows" || options.mode === "operation" ? void 0 : options.expectedSourceIdentity;
	if (expected !== void 0) {
		if (options.mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		args.push(stagingRoot ?? "", JSON.stringify(readDatabaseFileIdentity(expected)));
	} else if (stagingRoot) args.push(stagingRoot);
	return args;
}
const SQLITE_READONLY_STDERR_TAIL_CHARS = 4e3;
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "contentVersion" in value && typeof value.contentVersion === "string" && /^(?:[a-f0-9]{64})?$/.test(value.contentVersion) || value.ok === true && "generation" in value && typeof value.generation === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr, options) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`, options);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	if (params.kind === "launch-failed") throw params.error;
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr, { cause: params.cause });
		throw error;
	}
	if (params.status !== 0 || params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const message = !result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? `exited with code ${params.status}`;
		const allocationRefused = params.failure === void 0 && !result.ok && (mode === "staging-create" || mode === "staging-create-legacy") && message.startsWith("SQLite snapshot directory creation refused: ");
		const error = createSqliteReadOnlyWorkerError(allocationRefused ? message.slice(44) : message, params.stderr, { cause: params.cause });
		if (contention) {
			const failure = new SqliteReadOnlyInspectionContentionError(error.message);
			throw allocationRefused ? markPrivateDirectoryCreationRefused(failure) : failure;
		}
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "content-version" && "contentVersion" in result) return result.contentVersion;
	if ((mode === "file-generation" || mode === "update-generation") && "generation" in result) return result.generation;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-location.worker.ts
const stagingTokens = /* @__PURE__ */ new Map();
async function inspect(args) {
	const mode = args[0];
	const pathname = args[1];
	const stagingRoot = args[2] || void 0;
	if (mode !== "sync" && mode !== "async" && mode !== "consolidated" && mode !== "reclaim" && mode !== "update-generation" && !isSqliteSnapshotStagingMode(mode) || !pathname) return {
		ok: false,
		message: "SQLite read-only worker requires a mode and a database path"
	};
	try {
		if (args.length > 4 || args[3] !== void 0 && mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		if (mode === "update-generation") {
			const { readUpdateDatabaseGenerationObservation } = await import("./sqlite-readonly-update-database-generations-C8YsAgmF.mjs");
			return {
				ok: true,
				generation: JSON.stringify(readUpdateDatabaseGenerationObservation(pathname))
			};
		}
		const expectedSourceIdentity = args[3] === void 0 ? void 0 : readDatabaseFileIdentity(JSON.parse(args[3]));
		if (mode === "staging-reconcile") {
			reconcileSqliteSnapshotRetirement(pathname);
			return {
				ok: true,
				location: pathname
			};
		}
		if (mode === "staging-create" || mode === "staging-create-legacy") {
			const owned = createSqliteSnapshotStagingTokenSync(pathname, mode === "staging-create-legacy");
			stagingTokens.set(owned.directory, owned.release);
			return {
				ok: true,
				location: owned.directory
			};
		}
		if (mode === "staging-retire") {
			const token = stagingTokens.get(pathname);
			if (!token) throw new Error("SQLite snapshot token is not owned by this worker");
			const retirement = beginSqliteSnapshotRetirement(pathname, { token });
			try {
				retireSqliteSnapshotPayload(retirement);
				stagingTokens.delete(pathname);
			} finally {
				retirement.release();
			}
			return {
				ok: true,
				location: pathname
			};
		}
		if (mode === "reclaim") {
			const warnings = [];
			const directories = reclaimAbandonedSqliteSnapshots(pathname, (message, error) => {
				warnings.push(`${message}${formatSqliteErrorCodeSuffix(error)}`);
			});
			let stopped = false;
			const stop = () => {
				stopped = true;
			};
			process.stdin.once("end", stop);
			process.stdin.once("error", stop);
			process.stdin.resume();
			try {
				while (true) {
					await setImmediate$1();
					if (stopped) {
						warnings.push("Stopped SQLite snapshot reclamation at a directory boundary.");
						break;
					}
					if (directories.next().done) break;
				}
			} finally {
				directories.return(void 0);
				process.stdin.off("end", stop);
				process.stdin.off("error", stop);
				process.stdin.destroy();
			}
			return {
				ok: true,
				warnings
			};
		}
		let prepared;
		if (mode === "consolidated") {
			if (!stagingRoot || path.dirname(path.resolve(pathname)) !== path.resolve(stagingRoot)) throw new Error("SQLite consolidation requires its caller-owned private snapshot directory");
			prepared = await createOnlineReadOnlyBackup(pathname, stagingRoot);
		} else prepared = mode === "sync" ? await prepareSqliteReadOnlyCopyInProcess(pathname, stagingRoot, expectedSourceIdentity) : await prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot);
		releaseSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		return {
			ok: true,
			location: prepared.location
		};
	} catch (error) {
		const contention = error instanceof SqliteSourceChangedError || isSqliteLockError(error);
		const allocationRefused = (mode === "staging-create" || mode === "staging-create-legacy") && isPrivateDirectoryCreationRefused(error);
		return {
			ok: false,
			message: `${(contention ? SQLITE_INSPECTION_CONTENTION_PREFIX : "") + (allocationRefused ? SQLITE_SNAPSHOT_ALLOCATION_REFUSED_PREFIX : "")}${formatSqliteReadOnlyInspectionFailure(error)}`
		};
	}
}
function runSession() {
	let busy = false;
	let closeRequested = false;
	let stopping = false;
	let finalExitCode = 0;
	let retiring = false;
	let activeWork = Promise.resolve();
	const transfers = createSqliteWorkerTransferOwner();
	let activeTransfer;
	const stop = (failed = false) => {
		if (failed) finalExitCode = 1;
		if (stopping) return;
		stopping = true;
		activeWork.finally(() => {
			const cleanup = [() => transfers.close(), ...stagingTokens.values()];
			for (const close of cleanup) try {
				close();
			} catch (error) {
				finalExitCode = 1;
				process.stderr.write(`SQLite read-only worker cleanup failed: ${formatSqliteReadOnlyInspectionFailure(error)}\n`);
			}
			stagingTokens.clear();
			activeTransfer = void 0;
			process.stdin.destroy();
			if (process.connected) process.disconnect?.();
			process.exitCode = finalExitCode;
		});
	};
	const send = (id, result, failed = false, onSent) => {
		if (stopping) return;
		if (!process.connected || !process.send) {
			stop(true);
			return;
		}
		retiring ||= failed;
		try {
			process.send({
				id,
				result
			}, (error) => {
				if (error || failed) {
					stop(true);
					return;
				}
				onSent?.();
				if (closeRequested && !busy) stop();
			});
		} catch {
			stop(true);
		}
	};
	const fail = (id, error) => {
		send(id, {
			ok: false,
			message: formatSqliteReadOnlyInspectionFailure(error)
		}, true);
	};
	process.once("disconnect", () => stop(busy));
	process.on("message", (message) => {
		if (stopping || retiring) return;
		if (message === "close") {
			if (busy) closeRequested = true;
			else stop();
			return;
		}
		if (isRecord$1(message) && activeTransfer && message.id === activeTransfer.requestId && isRecord$1(message.transfer)) {
			const { requestId, transferId, label } = activeTransfer;
			try {
				if (message.transfer.transferId !== transferId) throw new Error(`${label} transfer identity changed`);
				if (message.transfer.type === "next") send(requestId, {
					type: "frame",
					frame: encodeSqliteAuthTransferFrame(transfers.next(transferId))
				});
				else if (message.transfer.type === "end") {
					transfers.end(transferId);
					activeTransfer = void 0;
					busy = false;
					send(requestId, { type: "complete" });
				} else throw new Error(`Invalid ${label.toLowerCase()} transfer command`);
			} catch (error) {
				fail(requestId, error);
			}
			return;
		}
		if (!busy && isRecord$1(message) && typeof message.id === "number" && Number.isSafeInteger(message.id) && Array.isArray(message.args) && message.args.length === 2 && (message.args[0] === "auth-profile-rows" || message.args[0] === "operation") && typeof message.args[1] === "string") {
			const id = message.id;
			const pathname = message.args[1];
			const operation = message.args[0] === "operation";
			const read = operation ? message.operation : message.auth;
			busy = true;
			const execute = async () => {
				if (!isRecord$1(read) || typeof read.expectedIdentity !== "string" || !read.expectedIdentity.startsWith("file:")) throw new Error(operation ? "SQLite read requires captured physical ownership" : "Auth profile read requires captured physical ownership");
				const { expectedIdentity } = read;
				if (operation) {
					if (typeof read.command !== "string") throw new Error("Invalid SQLite read-only operation encoding");
					const command = deserialize(Buffer.from(read.command, "base64"));
					if (!isRecord$1(command) || typeof command.type !== "string" || !("input" in command)) throw new Error("Invalid SQLite read-only operation");
					const request = {
						type: command.type,
						input: command.input
					};
					await sqliteReadOnlyOperations.prepare(request.type);
					if (stopping) return;
					if (!sqliteReadOnlyOperations.has(request)) throw new Error(`Unknown SQLite read-only operation: ${request.type}`);
					assertExistingDatabaseIdentity(pathname, expectedIdentity);
					const value = await sqliteReadOnlyOperations.execute(request, {
						path: pathname,
						env: process.env
					});
					assertExistingDatabaseIdentity(pathname, expectedIdentity);
					const handle = transfers.start([{
						kind: "result",
						value: {
							operation: request.type,
							value
						}
					}].values(), { kinds: ["result"] });
					activeTransfer = {
						requestId: id,
						transferId: handle.id,
						label: "SQLite operation"
					};
					send(id, {
						type: "start",
						handle
					});
					return;
				}
				const { readAuthProfileRowsReadOnly } = await import("./sqlite-readonly-sqlite-json-Bgjwgtsi.mjs");
				if (stopping) return;
				assertExistingDatabaseIdentity(pathname, expectedIdentity);
				const rows = readAuthProfileRowsReadOnly(pathname, readSqliteAuthSchema(read.schema), expectedIdentity, read.retainReader === true);
				if (read.artifactPreserving === true) rows.cacheable = false;
				assertExistingDatabaseIdentity(pathname, expectedIdentity);
				function* rowFields() {
					for (const batch of jsonFieldBatches(rows)) yield {
						kind: "fields",
						value: batch
					};
				}
				const handle = transfers.start(rowFields(), { kinds: ["fields"] });
				activeTransfer = {
					requestId: id,
					transferId: handle.id,
					label: "Auth profile"
				};
				send(id, {
					type: "start",
					handle
				});
			};
			activeWork = (isRecord$1(read) && read.artifactPreserving === true ? withArtifactPreservingStateReads(execute, { agentDatabases: true }) : execute()).catch((error) => fail(id, error)).finally(scheduleOpenClawCompileCacheFlush);
			return;
		}
		if (busy || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || typeof message.id !== "number" || !Number.isSafeInteger(message.id) || !("args" in message) || !Array.isArray(message.args) || message.args[0] !== "sync" && !isSqliteSnapshotStagingMode(message.args[0]) || !message.args.every((arg) => typeof arg === "string")) {
			stop(true);
			return;
		}
		busy = true;
		const id = message.id;
		const staging = isSqliteSnapshotStagingMode(message.args[0]);
		activeWork = inspect(message.args).then((inspected) => {
			const result = Buffer.byteLength(JSON.stringify(inspected)) > 1048576 ? {
				ok: false,
				message: "exceeded its output buffer"
			} : inspected;
			send(id, result, !result.ok && !staging, () => {
				busy = false;
			});
		}).catch((error) => fail(id, error)).finally(scheduleOpenClawCompileCacheFlush);
	});
}
if (process.argv[2] === "--openclaw-sqlite-readonly-child") {
	routeLogsToStderr();
	if (process.argv[3] === "session" && process.send) runSession();
	else inspect(process.argv.slice(3)).then((result) => {
		if (!result.ok) process.exitCode = 1;
		process.stdout.write(JSON.stringify(result));
	});
}
//#endregion
export { resolveOpenClawStateSqliteDir as $, tableHasColumn as $t, resolveRuntimeProcessEntrypointUrl as A, finallyRetainedOperation as An, isSqliteSchemaVersionError as At, allowsMaintenanceLiveAuthorityReads as B, withArtifactPreservingStateReads as Bn, FIRST_USE_STATE_INDEXES as Bt, markWorkerRetirement as C, removeTempDirectoryAsync as Cn, truncateSqliteWal as Ct, recordWorkerMessage as D, settleSqliteSnapshotRequest as Dn, SqliteSchemaVersionError as Dt, observeWorkerMessage as E, sealRetainedSnapshotTempDirectory as En, runWithMainThreadTask as Et, applyPrivateModeSync as F, createSqliteWorkerTransferOwner as Fn, runSqliteDeferredTransactionSync as Ft, observeOpenClawDatabaseMaintenanceResource as G, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as Gt, getOpenClawDatabaseMaintenanceScope as H, resolveSafeNodeCompileCacheDirectory as Hn, LAZY_ADDITIVE_STATE_INDEXES as Ht, sha256Hex as I, createSqliteWorkerTransferReceiver as In, runSqliteImmediateTransactionSync as It, existingPathOrUndefined as J, readExistingAgentSchemaMeta as Jt, runOutsideOpenClawDatabaseMaintenanceScope as K, agentSchemaMetadataKey as Kt, StateDatabaseReadAdmissionInvalidatedError as L, captureSqliteAuthSchema as Ln, runSqliteReadSnapshotSync as Lt, resolveRuntimeWorkerThreadExecArgv as M, mapRetainedOperation as Mn, StartupMaintenanceRequiredError as Mt, resolveRuntimeWorkerUrl as N, createSqliteAuthTransferReceiver as Nn, assertTransactionUsable as Nt, workerMessagePayloadBytes as O, startRemoveTempDirectory as On, createNewerSqliteSchemaVersionError as Ot, runtimeNeedsTypeScriptLoader as P, createSqliteOperationTransferReceiver as Pn, retainSqliteWriteAdmissionService as Pt, resolveOpenClawStateDirForDatabasePath as Q, tableExists as Qt, createOpenClawStateDatabaseAsyncLifecycle as R, artifactPreservingReads as Rn, runSqliteSingleStatementSync as Rt, createCpuTrackedWorker as S, removeTempDirectory as Sn, publishSqliteWalCheckpointObservation as St, trackNativeWorkerForCpu as T, retainSnapshotWork as Tn, normalizeSqliteNumber as Tt, isOpenClawDatabaseMaintenanceResourceOwned as U, LAZY_ADDITIVE_STATE_TABLES as Ut, getOpenClawDatabaseMaintenanceResourceScope as V, syncDirectorySync as Vn, FIRST_USE_STATE_TABLES as Vt, isOpenClawDatabaseMaintenanceWorkerAccess as W, OPENCLAW_DATABASE_SCHEMA_DOCS_URL as Wt, resolveOpenClawAgentDatabaseStoredPath as X, ensureColumn as Xt, resolveDatabasePath as Y, classifySqliteTableReadError as Yt, resolveOpenClawRegisteredAgentDatabasePath as Z, readTableColumns as Zt, withStateDatabaseColdAdmission as _, resolvePrivateSqliteSnapshotStagingRoot as _n, isSqliteWalWorkerMaintained as _t, isSqliteSnapshotStagingMode as a, admitPostgresPhysicalFacts as an, isPidDefinitelyDead as at, StateDatabaseOfflineMaintenanceError as b, deferSqliteSnapshotCleanupAfterRead as bn, createSqliteWalReclamationResult as bt, createLazyRuntimeModule as c, admitPostgresCapabilities as cn, acquireSqliteSnapshotReadToken as ct, prepareSqliteReadOnlyLocationSyncInProcess as d, readPostgresSchema as dn, emitSqliteSnapshotTelemetry as dt, tablePrimaryKeyColumns as en, resolveOpenClawStateSqlitePath as et, acquireStateDatabaseSchemaLease as f, verifyAndRecordPostgresSchema as fn, sqliteSnapshotSourceFileSize as ft, getStateDatabaseSchemaLease as g, createPrivateSqliteTempDirectorySync as gn, registerSqliteCacheExitClose as gt, captureStateDatabaseAccess as h, assertEngineStoreExecutionAllowed as hn, configureSqlitePreSchemaPragmas as ht, isSqliteReadOnlyWorkerResult as i, throwSqliteSchemaMismatches as in, getProcessInstanceStartTime as it, resolveRuntimeWorkerArgv as j, flatMapRetainedOperation as jn, readSqliteUserVersion as jt, captureRuntimeWorkerSource as k, createRetainedOperation as kn, describeRunningOpenClawBuild as kt, prepareSqliteReadOnlyCopyInProcess as l, postgresSchemaMetadataSql as ln, createSqliteSnapshotStagingDirectory as lt, assertStateDatabaseReadAllowed as m, assertPostgresCatalog as mn, configureSqliteConnectionPragmas as mt, SQLITE_READONLY_WORKER_MAX_BUFFER as n, createSqliteSchemaIssue as nn, warnAgentPathMigration as nt, readSqliteReadOnlyWorkerValue as o, getPostgresPhysicalFacts as on, mergeProcessEnv as ot, assertStateDatabaseAccessAllowed as p, verifyPostgresSchema as pn, readSqliteWriterAppVersion as pt, describeAgentPathMigration as q, publishAgentSchemaMetadata as qt, createSqliteReadOnlyWorkerError as r, legacySqliteSchemaIssueMessages as rn, getFileLockProcessStartTime as rt, sqliteReadOnlyWorkerRequestArgs as s, requireNativeDatabaseFile as sn, resolveDiagnosticProcessEnv as st, SQLITE_READONLY_STDERR_TAIL_CHARS as t, SqliteSchemaMismatchError as tn, resolveQuarantineStorePath as tt, prepareSqliteReadOnlyLocationFromOwnedDatabase as u, postgresSchemaSql as un, createSqliteSnapshotStagingDirectorySync as ut, GatewayStateOwnerContentionError as v, SqliteSnapshotCleanupError as vn, registerDeferredSqliteWalWriteAdmission as vt, receiveWorkerMemoryPort as w, retainSnapshotTempDirectory as wn, coerceRequiredSqliteNumber as wt, attributeWorkerToPool as x, registerRetainedSnapshotTempDirectory as xn, prepareSqliteDatabaseDirectory as xt, StateDatabaseAdmissionPendingError as y, adoptPreparedLocation as yn, registerSqliteWalWorkerMaintenance as yt, isStateDatabaseReadAdmissionInvalidatedError as z, isArtifactPreservingStateRead as zn, DOCTOR_OWNED_STATE_TABLES as zt };
