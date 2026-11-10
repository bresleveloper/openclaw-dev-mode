import { Ct as inspectFileIdentitySync, F as assertDirectoryIdentitySync, O as isNativeStatIdentity, W as inspectDirectoryIdentitySync, Y as errorCauseOptions, d as resolveReadOpenFlags, dt as realpathSync$1, ft as assertWindowsHelperAllowed, ht as getNativeFallbackDiagnostic, j as formatErrorDetail, jt as sameFileIdentityForCleanup, k as statIdentityFromNative, kt as identityFromReceipt, mt as getNativeBinding, vt as getFsSafeNativeConfig, yt as getNativeModeSetting } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, d as assertNoWindowsPathAlias, g as resolvePathPreservingWindowsRoot, m as pathForWindowsFilesystem, t as assertNoNulPathInput } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { U as assertExclusiveCreateLeaf, z as assertSynchronousCallbackResult } from "./openclaw-state-read-sidecar-lock-registration-C-Pbqw8O.mjs";
import { I as registerTempPathForExit, y as checkedMutationDirectory } from "./openclaw-state-read-file-lock-sync-root-MLFwCZr0.mjs";
import fs, { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify, types } from "node:util";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import { execFile, spawn, spawnSync } from "node:child_process";
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
const isUint8Array = types.isUint8Array;
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
function dataProperty(value, name) {
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
		if (!isUint8Array(value)) return "";
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
	const killed = dataProperty(error, "killed");
	const code = dataProperty(error, "code");
	const signal = dataProperty(error, "signal");
	const stderr = dataProperty(error, "stderr");
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
function unavailable() {
	throw new FsSafeError("helper-unavailable", "private Windows creation requires an up-to-date native helper");
}
function assertPrivateFileCreationAvailable() {
	const native = getNativeBinding();
	if (process.platform !== "win32" || getFsSafeNativeConfig().mode !== "require") return;
	if (typeof native?.createPrivateDirectoryWithParentIdentity !== "function" || typeof native.inspectWindowsDirectory !== "function" || typeof native.protectPrivateWindowsFile !== "function" || typeof native.verifyPrivateWindowsFile !== "function") unavailable();
}
function commandFallback(capability) {
	if (getFsSafeNativeConfig().mode === "require") unavailable();
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
export { creationAdmissionFromParent as C, NativePolicyDirectoryMismatch as D, nodeDirectorySearchOnlyFlags as E, nativePolicyDirectoryObserver as O, assertPrivateFileCreationAvailable as S, resolveCreationPermissions as T, createFileHandle as _, describePolicyStagedDirectory as a, assertPrivateCreationFile as b, openStagedDirectory as c, copyRetainedDirectoryReceipt as d, createDirectoryReceiptSync as f, createDirectoryWithAdmission as g, createDirectorySync as h, describeNativeStagedDirectory as i, refreshPolicyStagedDirectoryObservation as l, ownDirectoryReceipt as m, assertPolicyStagedDirectoryCurrent as n, describeStagedDirectory as o, directoryReceiptAuthority as p, assertStagedDirectoryCurrent as r, exactIdentityMatches as s, assertNativeStagedDirectoryCurrent as t, assertDirectoryReceiptCurrentSync as u, isHardlinkFallbackError as v, hasPreservedCreationArtifacts as w, assertPrivateDirectory as x, assertDarwinCreationAcl as y };
