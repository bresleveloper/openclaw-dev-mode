import { createRequire } from "node:module";
import path from "node:path";
import { createHash } from "node:crypto";
import fs, { closeSync, openSync, readSync, readdirSync } from "node:fs";
import os, { platform } from "node:os";
import { getSystemErrorName } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { URL as URL$1, fileURLToPath } from "node:url";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-identity.js
/** Only the explicit companion is unambiguous; nested source/target receipts are not inferred. */
function identityFromReceipt(value) {
	if ("exactIdentity" in value) {
		const exact = value.exactIdentity;
		const dev = exact?.dev, ino = exact?.ino;
		return typeof dev === "bigint" && typeof ino === "bigint" ? {
			dev,
			ino
		} : {
			dev: NaN,
			ino: NaN
		};
	}
	return value;
}
function hasSafeFileIdentity(identity) {
	return isExactStatValue(identity.dev) && isExactStatValue(identity.ino);
}
function isExactStatValue(value) {
	return typeof value === "bigint" || Number.isSafeInteger(value);
}
function isZero(value) {
	return value === 0 || value === 0n;
}
function sameStatValue(left, right) {
	return typeof left === typeof right ? left === right : BigInt(left) === BigInt(right);
}
function isStatValueProvablyDifferent(left, right, platform) {
	if (sameStatValue(left, right)) return false;
	return platform !== "win32" || !isZero(left) && !isZero(right);
}
function sha256Hex(data, encoding) {
	const buffer = typeof data === "string" ? Buffer.from(data, encoding ?? "utf8") : data;
	return createHash("sha256").update(buffer).digest("hex");
}
function sameFileIdentity(left, right, platform = process.platform) {
	left = identityFromReceipt(left);
	right = identityFromReceipt(right);
	const leftDev = left.dev;
	const leftIno = left.ino;
	const rightDev = right.dev;
	const rightIno = right.ino;
	return isExactStatValue(leftDev) && isExactStatValue(leftIno) && isExactStatValue(rightDev) && isExactStatValue(rightIno) && !isStatValueProvablyDifferent(leftDev, rightDev, platform) && !isStatValueProvablyDifferent(leftIno, rightIno, platform);
}
function sameCleanupStatValue(left, right) {
	if (!isExactStatValue(left) || !isExactStatValue(right)) return false;
	return sameStatValue(left, right);
}
function sameFileIdentityForCleanup(left, right, platform = process.platform) {
	if (platform !== "win32") return sameCleanupStatValue(left.dev, right.dev) && sameCleanupStatValue(left.ino, right.ino);
	const leftDev = left.dev;
	if (isZero(leftDev)) return false;
	const leftIno = left.ino;
	if (isZero(leftIno)) return false;
	const rightDev = right.dev;
	if (isZero(rightDev)) return false;
	const rightIno = right.ino;
	if (isZero(rightIno)) return false;
	return sameCleanupStatValue(leftDev, rightDev) && sameCleanupStatValue(leftIno, rightIno);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = /* @__PURE__ */ new Set([
	"helper-failed",
	"helper-unavailable",
	"not-empty",
	"not-found",
	"not-removable",
	"permission-unverified",
	"read-failed",
	"timeout",
	"unsupported-platform"
]);
function categorizeFsSafeError(code) {
	return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
	code;
	category;
	details;
	constructor(code, message, options = {}) {
		super(message, options);
		this.name = "FsSafeError";
		this.code = code;
		this.category = categorizeFsSafeError(code);
		this.details = options.details;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-observation.js
const active = new AsyncLocalStorage();
function recordFileObservationFailure(error, kind) {
	const failures = active.getStore();
	if (!failures) return;
	let kinds = failures.get(error);
	if (!kinds) failures.set(error, kinds = /* @__PURE__ */ new Set());
	kinds.add(kind);
}
function isFileObservationFailure(error, kind) {
	return active.getStore()?.get(error)?.has(kind) === true;
}
function fileObservation() {
	const failures = /* @__PURE__ */ new Map();
	return {
		run(operation) {
			return active.run(failures, operation);
		},
		has(error, kind) {
			return failures.get(error)?.has(kind) === true;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/strict-file-identity.js
function fileIdentityMismatchError() {
	const error = new FsSafeError("path-mismatch", "file identity changed or could not be verified");
	recordFileObservationFailure(error, "identity");
	return error;
}
function identityCheck(expected, platform) {
	const known = {};
	const check = (stat) => {
		let complete = true;
		for (const field of ["dev", "ino"]) {
			const value = stat[field];
			if (typeof value !== "bigint") throw fileIdentityMismatchError();
			if (platform === "win32" && value === 0n) complete = false;
			else {
				if (known[field] !== void 0 && known[field] !== value) throw fileIdentityMismatchError();
				known[field] = value;
			}
		}
		return complete;
	};
	if (expected && !check(expected)) throw fileIdentityMismatchError();
	return check;
}
async function inspectFileIdentity(inspect, expected, platform = process.platform) {
	const check = identityCheck(expected, platform);
	for (let attempt = 0; attempt < 2; attempt++) {
		const stat = await inspect();
		if (check(stat)) return stat;
	}
	throw fileIdentityMismatchError();
}
function inspectFileIdentitySync(inspect, expected, platform = process.platform, mismatch = fileIdentityMismatchError) {
	let knownDev;
	let knownIno;
	if (expected) {
		knownDev = expected.dev;
		if (typeof knownDev !== "bigint") throw mismatch();
		knownIno = expected.ino;
		if (typeof knownIno !== "bigint") throw mismatch();
		if (platform === "win32" && (knownDev === 0n || knownIno === 0n)) throw mismatch();
	}
	for (let attempt = 0; attempt < 2; attempt++) {
		const stat = inspect();
		let complete = true;
		const dev = stat.dev;
		if (typeof dev !== "bigint") throw mismatch();
		if (platform === "win32" && dev === 0n) complete = false;
		else {
			if (knownDev !== void 0 && knownDev !== dev) throw mismatch();
			knownDev = dev;
		}
		const ino = stat.ino;
		if (typeof ino !== "bigint") throw mismatch();
		if (platform === "win32" && ino === 0n) complete = false;
		else {
			if (knownIno !== void 0 && knownIno !== ino) throw mismatch();
			knownIno = ino;
		}
		if (complete) return stat;
	}
	throw mismatch();
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-binding.js
function captureNativeFdClose(binding) {
	if (typeof binding.closeOwnedFd !== "function") throw new FsSafeError("helper-unavailable", "native descriptor ownership is unavailable");
	return binding.closeOwnedFd.bind(binding);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-config.js
let overrideConfig = {};
function parseMode(value) {
	if (!value) return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "0" || normalized === "false" || normalized === "off" || normalized === "never") return "off";
	if (normalized === "1" || normalized === "true" || normalized === "on" || normalized === "auto") return "auto";
	if (normalized === "required" || normalized === "require") return "require";
}
function getFsSafeNativeConfig() {
	return { mode: overrideConfig.mode ?? parseMode(process.env.FS_SAFE_NATIVE_MODE) ?? parseMode(process.env.OPENCLAW_FS_SAFE_NATIVE_MODE) ?? "auto" };
}
/** Internal provenance; keep the public configuration shape unchanged. */
function getNativeModeSetting() {
	if (overrideConfig.mode !== void 0) return {
		mode: overrideConfig.mode,
		source: "programmatic configuration"
	};
	for (const source of ["FS_SAFE_NATIVE_MODE", "OPENCLAW_FS_SAFE_NATIVE_MODE"]) {
		const mode = parseMode(process.env[source]);
		if (mode !== void 0) return {
			mode,
			source
		};
	}
	return {
		mode: "auto",
		source: "default"
	};
}
function isFsSafeNativeRequired() {
	return (overrideConfig.mode ?? parseMode(process.env.FS_SAFE_NATIVE_MODE) ?? parseMode(process.env.OPENCLAW_FS_SAFE_NATIVE_MODE) ?? "auto") === "require";
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native.js
const require = createRequire(new URL("dist/native.js", import.meta.resolve("@openclaw/fs-safe/package.json")).href);
const runNativeInitialization = AsyncLocalStorage.snapshot();
let binding;
let loadError;
let attempted = false;
let loadBinding = loadBundledBinding;
let resolvePackage = (name) => require.resolve(name);
let loadOutcome = { reason: "not-probed" };
let selectedTarget;
let targetDescription;
function loadFailure(error, packageName) {
	try {
		return classifyLoadFailure(error, packageName);
	} catch {
		return {
			reason: "load-failed",
			code: "UNKNOWN"
		};
	}
}
function classifyLoadFailure(error, packageName) {
	const code = typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
	if (code === "MODULE_NOT_FOUND" && error instanceof Error && error.message.split("\n", 1)[0] === `Cannot find module '${packageName}'`) try {
		resolvePackage(packageName);
	} catch (resolutionError) {
		if (resolutionError instanceof Error && "code" in resolutionError && resolutionError.code === "MODULE_NOT_FOUND" && resolutionError.message.split("\n", 1)[0] === `Cannot find module '${packageName}'`) return { reason: "package-missing" };
	}
	return {
		reason: "load-failed",
		code: typeof code === "string" && [
			"ERR_DLOPEN_FAILED",
			"MODULE_NOT_FOUND",
			"ERR_MODULE_NOT_FOUND",
			"ERR_PACKAGE_PATH_NOT_EXPORTED",
			"ERR_INVALID_PACKAGE_CONFIG",
			"EACCES",
			"EPERM",
			"ENOENT"
		].includes(code) ? code : "UNKNOWN"
	};
}
/** Internal view of the cached load; never attempts to load an addon. */
function getNativeFallbackDiagnostic(...capabilities) {
	const setting = getNativeModeSetting();
	const target = targetDescription === void 0 ? bundledTarget() : selectedTarget;
	const packageName = target === void 0 ? void 0 : nativePackageForTarget(target);
	const manifest = require("@openclaw/fs-safe/package.json");
	const expected = {
		target: targetDescription,
		packageName,
		packageVersion: packageName === void 0 ? void 0 : manifest.optionalDependencies[packageName]
	};
	if (setting.mode === "off") return {
		...expected,
		reason: "disabled",
		source: setting.source
	};
	const loaded = binding;
	if (loaded) {
		const missing = capabilities.filter((name) => typeof loaded[name] !== "function");
		if (missing.length) return {
			...expected,
			reason: "capability-missing",
			capabilities: missing
		};
	}
	return {
		...expected,
		...loadOutcome
	};
}
function isMuslFilename(file) {
	return file.includes("libc.musl-") || file.includes("ld-musl-");
}
function isMuslFromReport() {
	try {
		if (!process.report || typeof process.report.getReport !== "function") return void 0;
		const report = process.report.getReport();
		if (report.header?.glibcVersionRuntime) return false;
		if (report.sharedObjects?.some(isMuslFilename)) return true;
	} catch {}
}
function isMuslFromFilesystem() {
	for (const directory of ["/lib", "/usr/lib"]) try {
		if (readdirSync(directory).some(isMuslFilename)) return true;
	} catch {}
}
function readUInt(buffer, offset, bytes, littleEndian) {
	if (offset < 0 || offset + bytes > buffer.length) return void 0;
	if (bytes === 2) return littleEndian ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
	if (bytes === 4) return littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
	const value = littleEndian ? buffer.readBigUInt64LE(offset) : buffer.readBigUInt64BE(offset);
	return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : void 0;
}
function isMuslFromElfInterpreter() {
	let fd;
	try {
		fd = openSync(process.execPath, "r");
		const header = Buffer.alloc(64);
		if (readSync(fd, header, 0, header.length, 0) < 52) return void 0;
		if (!header.subarray(0, 4).equals(Buffer.from([
			127,
			69,
			76,
			70
		]))) return void 0;
		const elfClass = header[4];
		const dataEncoding = header[5];
		if (elfClass !== 1 && elfClass !== 2 || dataEncoding !== 1 && dataEncoding !== 2) return;
		const littleEndian = dataEncoding === 1;
		const is64Bit = elfClass === 2;
		const tableOffset = readUInt(header, is64Bit ? 32 : 28, is64Bit ? 8 : 4, littleEndian);
		const entrySize = readUInt(header, is64Bit ? 54 : 42, 2, littleEndian);
		const entryCount = readUInt(header, is64Bit ? 56 : 44, 2, littleEndian);
		if (tableOffset === void 0 || entrySize === void 0 || entryCount === void 0 || entrySize < (is64Bit ? 56 : 32) || entryCount > 1024) return;
		const programHeader = Buffer.alloc(entrySize);
		for (let index = 0; index < entryCount; index += 1) {
			const offset = tableOffset + index * entrySize;
			if (readSync(fd, programHeader, 0, entrySize, offset) !== entrySize) return void 0;
			if (readUInt(programHeader, 0, 4, littleEndian) !== 3) continue;
			const interpreterOffset = readUInt(programHeader, is64Bit ? 8 : 4, is64Bit ? 8 : 4, littleEndian);
			const interpreterSize = readUInt(programHeader, is64Bit ? 32 : 16, is64Bit ? 8 : 4, littleEndian);
			if (interpreterOffset === void 0 || interpreterSize === void 0 || interpreterSize < 1 || interpreterSize > 4096) return;
			const interpreter = Buffer.alloc(interpreterSize);
			if (readSync(fd, interpreter, 0, interpreterSize, interpreterOffset) !== interpreterSize) return;
			return isMuslFilename(interpreter.toString("utf8"));
		}
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			closeSync(fd);
		} catch {}
	}
}
function isMusl() {
	if (process.platform !== "linux") return false;
	for (const detector of [
		isMuslFromReport,
		isMuslFromElfInterpreter,
		isMuslFromFilesystem
	]) {
		const result = detector();
		if (result !== void 0) return result;
	}
	return false;
}
function targetFor(platform, arch, musl) {
	if (platform === "win32" && (arch === "x64" || arch === "arm64")) return `win32-${arch}-msvc`;
	if (platform === "darwin" && arch === "x64") return "darwin-x64";
	if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
	if (platform === "freebsd" && (arch === "x64" || arch === "arm64")) return `freebsd-${arch}`;
	if (platform === "linux" && (arch === "x64" || arch === "arm64")) return `linux-${arch}-${musl ? "musl" : "gnu"}`;
}
function bundledTarget() {
	const musl = isMusl();
	selectedTarget = targetFor(process.platform, process.arch, musl);
	targetDescription = selectedTarget ?? `${process.platform}-${process.arch}${process.platform === "linux" ? `-${musl ? "musl" : "gnu"}` : ""}`;
	return selectedTarget;
}
function nativePackageForTarget(target) {
	return `@openclaw/fs-safe-${target}`;
}
function loadBundledBinding() {
	const target = bundledTarget();
	if (!target) {
		loadOutcome = { reason: "unsupported-target" };
		throw new Error(`Unsupported OS or architecture: ${process.platform}-${process.arch}`);
	}
	const loaded = runNativeInitialization(() => require(nativePackageForTarget(target)));
	if (typeof loaded.closeOwnedFd !== "function") loadOutcome = {
		reason: "capability-missing",
		capabilities: ["closeOwnedFd"]
	};
	captureNativeFdClose(loaded);
	return loaded;
}
function selectNativeBinding(native, ...capabilities) {
	if (!native) return void 0;
	const missing = capabilities.filter((name) => typeof native[name] !== "function");
	if (missing.length === 0) return native;
	if (getFsSafeNativeConfig().mode === "require") throw new FsSafeError("helper-unavailable", `native fs-safe capabilities unavailable: ${missing.join(", ")}`);
}
function assertNativeCapabilities(native, ...capabilities) {
	const missing = capabilities.filter((name) => typeof native[name] !== "function");
	if (missing.length) throw new FsSafeError("helper-unavailable", `native fs-safe capabilities unavailable: ${missing.join(", ")}`);
}
function getNativeBinding(...capabilities) {
	const { mode } = getFsSafeNativeConfig();
	if (mode === "off") return void 0;
	if (!attempted) {
		attempted = true;
		try {
			const loaded = loadBinding();
			if (typeof loaded.closeOwnedFd !== "function") loadOutcome = {
				reason: "capability-missing",
				capabilities: ["closeOwnedFd"]
			};
			captureNativeFdClose(loaded);
			binding = loaded;
			loadOutcome = { reason: "loaded" };
		} catch (error) {
			loadError = error;
			if (loadOutcome.reason === "not-probed") {
				selectedTarget ??= bundledTarget();
				loadOutcome = loadFailure(error, nativePackageForTarget(selectedTarget ?? `${process.platform}-${process.arch}`));
			}
		}
	}
	if (binding) return selectNativeBinding(binding, ...capabilities);
	if (mode === "require") throw new FsSafeError("helper-unavailable", "native fs-safe helper is unavailable", { cause: loadError });
}
function requireNativeBinding(...capabilities) {
	const native = getNativeBinding(...capabilities);
	if (!native) throw new FsSafeError("helper-unavailable", "native fs-safe helper is unavailable", { cause: loadError });
	return native;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-appcontainer.js
/** The native owner caches immutable primary-token membership across Workers. */
function isWindowsAppContainer(binding) {
	if (!binding.isWindowsAppContainer) return void 0;
	try {
		const membership = binding.isWindowsAppContainer();
		if (typeof membership !== "boolean") throw new Error("Invalid AppContainer membership");
		return membership;
	} catch (cause) {
		throw new FsSafeError("permission-unverified", "Windows process token membership could not be verified", { cause });
	}
}
function assertWindowsHelperAllowed() {
	if (process.platform !== "win32") return;
	const binding = getNativeBinding();
	if (binding && isWindowsAppContainer(binding)) throw new FsSafeError("helper-unavailable", "External Windows security helpers are unavailable inside an AppContainer");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/realpath.js
const runtimePlatform = process.versions.bun ? platform() : void 0;
const bunPosix = runtimePlatform === "darwin" || runtimePlatform === "linux" ? runtimePlatform : void 0;
function resolve(input, native) {
	if (native && process.platform === "win32") try {
		return fs.realpathSync.native(input);
	} catch (error) {
		if (error.code !== "EPERM" || error.syscall !== "realpath") throw error;
		let binding;
		try {
			binding = getNativeBinding();
		} catch {
			binding = void 0;
		}
		if (!binding || !isWindowsAppContainer(binding)) throw error;
		if (!binding?.resolveWindowsCanonicalPath) throw new FsSafeError("helper-unavailable", "Windows canonicalization after a denied DOS-name query requires the native binding", { cause: error });
		let resolved;
		try {
			resolved = binding.resolveWindowsCanonicalPath(input);
		} catch (cause) {
			throw new FsSafeError("path-mismatch", "Windows canonical path cannot be verified safely", { cause });
		}
		if (resolved === null) throw error;
		return resolved;
	}
	if (bunPosix) {
		if (input.includes("\0")) throw Object.assign(/* @__PURE__ */ new TypeError("realpath input must not contain null bytes"), { code: "ERR_INVALID_ARG_VALUE" });
		const binding = getNativeBinding();
		if (binding?.canonicalizePath) {
			const result = binding.canonicalizePath(input, !native);
			if (result.path !== void 0) return result.path;
			const errno = -result.errno;
			const code = getSystemErrorName(errno);
			throw Object.assign(/* @__PURE__ */ new Error(`${code}: realpath '${input}'`), {
				code,
				errno,
				syscall: "realpath",
				path: input
			});
		}
		if (getFsSafeNativeConfig().mode === "require") throw new FsSafeError("helper-unavailable", "native fs-safe canonicalization is unavailable");
	}
	return native ? fs.realpathSync.native(input) : fs.realpathSync(input);
}
const realpathSync$1 = Object.assign((input) => resolve(input, false), { native: (input) => resolve(input, true) });
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/string-coerce.js
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-path-syntax.js
function isWindowsSeparator(value, offset) {
	const code = value.charCodeAt(offset);
	return code === 47 || code === 92;
}
function hasWindowsDrivePrefix(value, offset = 0) {
	const letter = value.charCodeAt(offset) | 32;
	return letter >= 97 && letter <= 122 && value.charCodeAt(offset + 1) === 58;
}
/** Classify a raw prefix without normalizing any path components. */
function windowsNamespaceMarker(value) {
	const marker = value[2];
	return (marker === "." || marker === "?") && isWindowsSeparator(value, 0) && isWindowsSeparator(value, 1) && isWindowsSeparator(value, 3) ? marker : void 0;
}
function rootedWindowsDriveColonIndex(value) {
	const colon = hasWindowsDrivePrefix(value) ? 1 : windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4) ? 5 : -1;
	return colon >= 0 && isWindowsSeparator(value, colon + 1) ? colon : -1;
}
function asciiLowercase(value) {
	return value.replace(/[A-Z]/g, (letter) => String.fromCharCode(letter.charCodeAt(0) + 32));
}
/**
* True when dot-like components climb above the start of `segments`. Win32
* trims trailing dots and spaces, so any all-dot or all-space component other
* than `.` is counted as a parent step.
*/
function windowsSegmentsClimbAbove(segments) {
	let depth = 0;
	for (const segment of segments) {
		if (segment === "" || segment === ".") continue;
		depth += /^[. ]+$/.test(segment) ? -1 : 1;
		if (depth < 0) return true;
	}
	return false;
}
/**
* Comparable share or device root of a path spelled with two leading
* separators, excluding namespaced drive roots such as `\\?\C:\`.
* Returns undefined for drive, rooted, and relative spellings, and null when
* the spelling alone cannot establish which share or device it reaches.
*/
function windowsShareOrDeviceRoot(value) {
	if (!isWindowsSeparator(value, 0) || !isWindowsSeparator(value, 1)) return void 0;
	const spelled = value.replaceAll("/", "\\");
	if (windowsNamespaceMarker(spelled) === void 0) return asciiLowercase(path.win32.parse(spelled).root.replace(/\\+$/, ""));
	const segments = spelled.slice(4).split("\\");
	const head = asciiLowercase(segments[0] ?? "");
	const authority = head === "unc" ? segments.slice(0, 3) : segments.slice(0, 1);
	if (head === "globalroot" || head === "global" || authority.length < (head === "unc" ? 3 : 1) || authority.some((segment) => segment === "" || /[. ]$/.test(segment)) || windowsSegmentsClimbAbove(segments.slice(authority.length))) return null;
	if (rootedWindowsDriveColonIndex(value) === 5) return void 0;
	return asciiLowercase(head === "unc" ? `\\\\${authority[1]}\\${authority[2]}` : `${spelled.slice(0, 4)}${authority[0]}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-path-alias.js
function isExactlyUnderWindowsPath(trusted, value) {
	const root = trusted.replaceAll("/", "\\").replace(/(?<=.)\\+$/, "");
	const candidate = value.replaceAll("/", "\\");
	if (candidate !== root && !candidate.startsWith(root.endsWith("\\") ? root : `${root}\\`)) return false;
	return !windowsSegmentsClimbAbove(candidate.slice(root.length).split("\\"));
}
/**
* True when a Windows path could reach a UNC share or device namespace that
* none of the trusted boundary paths live on: its share or device differs from
* theirs or cannot be identified from its spelling, and it is not spelled
* exactly under one of them. Reject such input before any filesystem call:
* even lstat on `\\host\share\x` makes Windows contact host.
*/
function isForeignWindowsShareOrDevicePath(value, trustedPaths, platform = process.platform) {
	if (platform !== "win32") return false;
	const key = windowsShareOrDeviceRoot(value);
	if (key === void 0) return false;
	return !trustedPaths.some((trusted) => trusted !== void 0 && (key !== null && windowsShareOrDeviceRoot(trusted) === key || isExactlyUnderWindowsPath(trusted, value)));
}
function isBareWindowsNamespaceDrive(value) {
	return value.length === 6 && windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4);
}
/**
* Capture an ordinary Windows drive-relative path without normalizing its raw
* suffix. This is only for public APIs whose existing contract accepts such
* paths; callers must still run namespace-alias admission on the result.
*/
function anchorWindowsDriveRelativePath(value) {
	if (process.platform !== "win32" || path.isAbsolute(value)) return value;
	if (!hasWindowsDrivePrefix(value)) return value;
	const drive = value.slice(0, 2);
	return `${path.resolve(drive)}${path.sep}${value.slice(2)}`;
}
/**
* Resolve a path without letting Node erase the separator from an exact
* extended-length drive root such as `\\?\C:\`. Bare `\\?\C:` input remains
* unchanged so the surrounding alias admission rejects it.
*/
function resolvePathPreservingWindowsRoot(value) {
	if (value.length === 7 && process.platform === "win32" && rootedWindowsDriveColonIndex(value) === 5) return value.includes("/") ? value.replaceAll("/", "\\") : value;
	return repairResolvedWindowsRoot(value, path.resolve(value));
}
/**
* Preserve a namespaced drive root after a caller has already resolved the
* input. This lets admission fast paths keep exactly one live path.resolve
* call while retaining the same root-repair behavior as the general helper.
*/
function repairResolvedWindowsRoot(value, resolved) {
	if (resolved.length === 6 && process.platform === "win32" && isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved}\\`;
	return resolved;
}
/**
* Resolve path segments against a base while preserving a namespaced drive
* root when Node normalizes a legitimate rooted input back to that root.
* Raw bare namespace drives stay bare so admission checks still reject them.
*/
function resolvePathFromBasePreservingWindowsRoot(base, ...segments) {
	const resolved = path.resolve(base, ...segments);
	if (resolved.length !== 6 || process.platform !== "win32" || !isBareWindowsNamespaceDrive(resolved)) return resolved;
	if (hasWindowsPathAlias(base, "filesystem") || segments.some((segment) => hasWindowsPathAlias(segment, "filesystem"))) return resolved;
	return `${resolved}\\`;
}
/**
* Adapt an admitted namespaced drive root for Node's Windows filesystem layer.
* Node removes the root separator from these paths during filesystem dispatch,
* so use the equivalent ordinary drive root for the operation. This is not an
* admission check: callers must validate attacker-controlled input first.
*/
function pathForWindowsFilesystem(value) {
	if (process.platform !== "win32" || rootedWindowsDriveColonIndex(value) !== 5) return value;
	if (value.length === 7) return `${value[4]}:\\`;
	const resolved = path.resolve(value);
	if (isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved[4]}:\\`;
	return value;
}
/** Returns true when a Windows pathname can address an alternate filesystem namespace. */
function hasWindowsPathAlias(value, kind, platform = process.platform) {
	if (platform !== "win32") return false;
	const firstColon = value.indexOf(":");
	if (firstColon === -1) return false;
	if (kind === "relative") return true;
	return firstColon !== rootedWindowsDriveColonIndex(value) || value.indexOf(":", firstColon + 1) !== -1;
}
function assertNoWindowsPathAliasForPlatform(value, kind, message, platform) {
	if (hasWindowsPathAlias(value, kind, platform)) throw new FsSafeError("invalid-path", message, { details: { reason: "windows-path-alias" } });
}
function assertNoWindowsPathAlias(value, kind = "filesystem", message = "path uses a Windows filesystem namespace alias", platform = process.platform) {
	assertNoWindowsPathAliasForPlatform(value, kind, message, platform);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/local-file-access.js
const ENCODED_FILE_URL_SEPARATOR_RE = /%(?:2f|5c)/i;
const FILE_URL_PREFIX_RE = /^file:\/\//i;
function isFileUrl(input) {
	return FILE_URL_PREFIX_RE.test(input);
}
function hasEncodedFileUrlSeparator(pathname) {
	return ENCODED_FILE_URL_SEPARATOR_RE.test(pathname);
}
function isWindowsNetworkPath(filePath, platform = process.platform) {
	if (platform !== "win32") return false;
	return isWindowsSeparator(filePath, 0) && isWindowsSeparator(filePath, 1) && !(windowsNamespaceMarker(filePath) === "?" && rootedWindowsDriveColonIndex(filePath) === 5);
}
function safeFileURLToPath(fileUrl, platform = process.platform) {
	let parsed;
	try {
		parsed = new URL$1(fileUrl);
	} catch {
		throw new Error(`Invalid file:// URL: ${fileUrl}`);
	}
	if (parsed.protocol !== "file:") throw new Error(`Invalid file:// URL: ${fileUrl}`);
	const normalizedHost = normalizeLowercaseStringOrEmpty(parsed.hostname);
	if (!(normalizedHost === "" || normalizedHost === "localhost")) throw new Error(`file:// URLs with remote hosts are not allowed: ${fileUrl}`);
	if (hasEncodedFileUrlSeparator(parsed.pathname)) throw new Error(`file:// URLs cannot encode path separators: ${fileUrl}`);
	const filePath = fileURLToPath(parsed, { windows: platform === "win32" });
	if (hasWindowsPathAlias(filePath, "filesystem", platform)) throw new Error(`Local file URL cannot use Windows filesystem namespace aliases: ${filePath}`);
	if (isWindowsNetworkPath(filePath, platform)) throw new Error(`Local file URL cannot use Windows network paths: ${filePath}`);
	return filePath;
}
function trySafeFileURLToPath(fileUrl, platform = process.platform) {
	try {
		return safeFileURLToPath(fileUrl, platform);
	} catch {
		return;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/device-path.js
const POSIX_BLOCKED_DEVICE_PATHS = /* @__PURE__ */ new Set([
	"/dev/zero",
	"/dev/random",
	"/dev/urandom",
	"/dev/full",
	"/dev/stdin",
	"/dev/stdout",
	"/dev/stderr",
	"/dev/tty",
	"/dev/console"
]);
const WINDOWS_RESERVED_DEVICE_NAMES = /* @__PURE__ */ new Set([
	"CON",
	"PRN",
	"AUX",
	"NUL",
	"CLOCK$",
	"CONIN$",
	"CONOUT$",
	"COM1",
	"COM2",
	"COM3",
	"COM4",
	"COM5",
	"COM6",
	"COM7",
	"COM8",
	"COM9",
	"COM¹",
	"COM²",
	"COM³",
	"LPT1",
	"LPT2",
	"LPT3",
	"LPT4",
	"LPT5",
	"LPT6",
	"LPT7",
	"LPT8",
	"LPT9",
	"LPT¹",
	"LPT²",
	"LPT³"
]);
const WINDOWS_SEPARATOR_CHAR_CODE = 92;
const WINDOWS_IGNORED_SPACE_CHAR_CODE = 32;
const WINDOWS_IGNORED_DOT_CHAR_CODE = 46;
function trimTrailingWindowsSeparators(value) {
	let end = value.length;
	while (end > 0 && value.charCodeAt(end - 1) === WINDOWS_SEPARATOR_CHAR_CODE) end -= 1;
	return end === value.length ? value : value.slice(0, end);
}
function trimTrailingWindowsIgnoredChars(value) {
	let end = value.length;
	while (end > 0) {
		const charCode = value.charCodeAt(end - 1);
		if (charCode !== WINDOWS_IGNORED_SPACE_CHAR_CODE && charCode !== WINDOWS_IGNORED_DOT_CHAR_CODE) break;
		end -= 1;
	}
	return end === value.length ? value : value.slice(0, end);
}
function candidateReadPaths(filePath, platform) {
	if (!isFileUrl(filePath)) return [filePath];
	const parsed = trySafeFileURLToPath(filePath, platform);
	return parsed === void 0 ? [filePath] : [filePath, parsed];
}
function normalizePosixPath(filePath, cwd) {
	if (path.posix.isAbsolute(filePath)) return path.posix.normalize(filePath);
	const base = cwd && path.posix.isAbsolute(cwd) ? cwd : process.cwd();
	return path.posix.resolve(base, filePath);
}
function matchPosixDeviceReadPath(filePath, cwd) {
	const normalized = normalizePosixPath(filePath, cwd);
	if (POSIX_BLOCKED_DEVICE_PATHS.has(normalized)) return {
		path: normalized,
		reason: "posix-device"
	};
	if (normalized === "/dev/fd" || normalized.startsWith("/dev/fd/")) return {
		path: normalized,
		reason: "posix-fd"
	};
	if (/^\/proc\/(?:self|thread-self|\d+)\/fd(?:\/|$)/.test(normalized)) return {
		path: normalized,
		reason: "posix-fd"
	};
}
function normalizeWindowsDeviceBaseName(filePath) {
	const normalized = trimTrailingWindowsSeparators(filePath.replace(/\//g, "\\"));
	const start = normalized.lastIndexOf("\\") + 1;
	const stream = normalized.indexOf(":", start);
	const extension = normalized.indexOf(".", start);
	const end = Math.min(stream < 0 ? normalized.length : stream, extension < 0 ? normalized.length : extension);
	return trimTrailingWindowsIgnoredChars(normalized.slice(start, end)).toUpperCase();
}
function isWindowsReservedDeviceName(name) {
	return name.length > 0 && WINDOWS_RESERVED_DEVICE_NAMES.has(normalizeWindowsDeviceBaseName(name));
}
function matchWindowsDeviceReadPath(filePath) {
	const normalized = filePath.replace(/\//g, "\\");
	if (/^\\\\\.\\/.test(normalized) || /^\\\\\?\\GLOBALROOT\\Device\\/i.test(normalized)) return {
		path: normalized,
		reason: "windows-device"
	};
	const baseName = normalizeWindowsDeviceBaseName(filePath);
	if (WINDOWS_RESERVED_DEVICE_NAMES.has(baseName)) return {
		path: normalized,
		reason: "windows-device"
	};
}
function matchUnsafeDeviceReadPath(filePath, options = {}) {
	const platform = options.platform ?? process.platform;
	for (const candidate of candidateReadPaths(filePath, platform)) {
		const match = platform === "win32" ? matchWindowsDeviceReadPath(candidate) : matchPosixDeviceReadPath(candidate, options.cwd);
		if (match) return match;
	}
}
function isUnsafeDeviceReadPath(filePath, options) {
	return matchUnsafeDeviceReadPath(filePath, options) !== void 0;
}
function assertNoUnsafeDeviceReadPath(filePath, options) {
	if (matchUnsafeDeviceReadPath(filePath, options)) throw new FsSafeError("device-path", `file reads from unsafe device paths are not allowed: ${filePath}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/safe-path-segment.js
const SAFE_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/;
const SAFE_DOT_PREFIX_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9._-]+$/;
const DRIVE_RELATIVE_PREFIX = /^[A-Za-z]:(?![\\/])/;
const DRIVE_RELATIVE_SEGMENT = /(?:^|\/)[A-Za-z]:(?!\\)/;
function isDriveRelativePath(value) {
	return DRIVE_RELATIVE_PREFIX.test(value);
}
function assertNoDriveRelativePathSegments(value, label) {
	if (DRIVE_RELATIVE_SEGMENT.test(value)) throw new FsSafeError("invalid-path", `${label} must not contain a drive letter`);
	return value;
}
function isSafePathSegment(segment, options = {}) {
	return segment !== "" && segment !== "." && segment !== ".." && !segment.includes("/") && !segment.includes("\\") && !segment.includes("\0") && !isWindowsReservedDeviceName(segment) && (options.allowDotPrefix === true || !segment.startsWith(".")) && (options.allowDotPrefix === true ? SAFE_DOT_PREFIX_PATH_SEGMENT_PATTERN.test(segment) : SAFE_PATH_SEGMENT_PATTERN.test(segment));
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path.js
const NOT_FOUND_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
const SYMLINK_OPEN_CODES = /* @__PURE__ */ new Set([
	"ELOOP",
	"EINVAL",
	"ENOTSUP"
]);
const POSIX_SEPARATOR_CHAR_CODE = 47;
function normalizeWindowsPathForComparison(input) {
	let normalized = path.win32.normalize(input);
	if (normalized.startsWith("\\\\?\\")) {
		normalized = normalized.slice(4);
		if (normalized.toUpperCase().startsWith("UNC\\")) normalized = `\\\\${normalized.slice(4)}`;
	}
	return normalized.replaceAll("/", "\\").toLowerCase();
}
function resolveWindowsPathForComparison(input) {
	const resolved = path.win32.resolve(input);
	return resolved[1] === ":" && path.win32.isAbsolute(resolved) ? resolved.toLowerCase() : normalizeWindowsPathForComparison(resolved.length === 6 ? resolvePathPreservingWindowsRoot(input) : resolved);
}
function isNodeError(value) {
	return Boolean(value && typeof value === "object" && "code" in value);
}
function hasNodeErrorCode(value, code) {
	return isNodeError(value) && value.code === code;
}
function assertNoNulPathInput(filePath, message = "path contains a NUL byte") {
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", message);
}
function isNotFoundPathError(value) {
	return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}
function isSymlinkOpenError(value) {
	return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}
function isPathInside(root, target) {
	if (process.platform === "win32") {
		if (isForeignWindowsShareOrDevicePath(target, [root])) return false;
		const rootForCompare = resolveWindowsPathForComparison(root);
		const targetForCompare = resolveWindowsPathForComparison(target);
		if (rootForCompare[1] === ":" && path.win32.isAbsolute(rootForCompare) && !targetForCompare.includes(":", 2) && (targetForCompare === rootForCompare || targetForCompare.startsWith(rootForCompare) && (rootForCompare.endsWith("\\") || targetForCompare[rootForCompare.length] === "\\"))) return true;
		const relative = path.win32.relative(rootForCompare, targetForCompare);
		const firstSegment = relative.split(path.win32.sep)[0];
		return relative === "" || firstSegment !== ".." && !path.win32.isAbsolute(relative);
	}
	if (root.length > 0 && root.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && target.length >= root.length && target.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && !target.includes("/..") && (target === root || target.startsWith(root) && (root.charCodeAt(root.length - 1) === POSIX_SEPARATOR_CHAR_CODE || target.charCodeAt(root.length) === POSIX_SEPARATOR_CHAR_CODE))) return true;
	const resolvedRoot = path.resolve(root);
	const resolvedTarget = path.resolve(target);
	const relative = path.relative(resolvedRoot, resolvedTarget);
	const firstSegment = relative.split(path.posix.sep)[0];
	return relative === "" || firstSegment !== ".." && !path.isAbsolute(relative);
}
function isPathRelativeEscape(relativePath) {
	if (path.isAbsolute(relativePath)) return true;
	let depth = 0;
	const segments = relativePath.split(process.platform === "win32" ? /[/\\]/ : /\//);
	for (const segment of segments) if (segment === "..") {
		if (depth === 0) return true;
		depth -= 1;
	} else if (segment !== "" && segment !== ".") depth += 1;
	return false;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-errors.js
const REMOVE_NOT_EMPTY_CODES = /* @__PURE__ */ new Set(["ENOTEMPTY", "EEXIST"]);
const PINNED_WRITE_ERRNO_MESSAGES = /* @__PURE__ */ new Map([
	["EACCES", "permission denied"],
	["EPERM", "permission denied"],
	["EROFS", "read-only filesystem"],
	["ENOSPC", "no space left on device"]
]);
function fileNotFoundError(cause, details) {
	return cause === void 0 ? new FsSafeError("not-found", "file not found", { details }) : new FsSafeError("not-found", "file not found", {
		cause,
		details
	});
}
function outsideWorkspaceError() {
	return new FsSafeError("outside-workspace", "file is outside workspace root");
}
function rootPathChangedError(cause) {
	return new FsSafeError("path-mismatch", "root path changed during operation", { cause });
}
function directoryComponentNotDirectoryError(cause) {
	return cause === void 0 ? new FsSafeError("not-file", "directory component must be a directory") : new FsSafeError("not-file", "directory component must be a directory", { cause });
}
function hardlinkedPathNotAllowedError() {
	return new FsSafeError("hardlink", "hardlinked path not allowed");
}
function isAlreadyExistsError(error) {
	return hasNodeErrorCode(error, "EEXIST") || /File exists|EEXIST/i.test(String(error));
}
function resourceExhaustion(error) {
	const pending = [error];
	let details;
	let code;
	const seen = /* @__PURE__ */ new Set();
	while (pending.length) {
		const current = pending.pop();
		if (!(current instanceof Error) || seen.has(current)) continue;
		seen.add(current);
		if (current instanceof FsSafeError && current.code !== "helper-failed" && current.code !== "not-removable") return;
		const diagnostic = current;
		if (current instanceof FsSafeError && (!details || current.details?.cleanup)) details = current.details ?? details;
		if (diagnostic.code === "EMFILE" || diagnostic.code === "ENFILE") {
			if (!code || code === "ENOSPC") code = diagnostic.code;
		} else if (diagnostic.code === "ENOSPC") code ??= diagnostic.code;
		if (diagnostic.name === "SuppressedError") pending.push(diagnostic.suppressed, diagnostic.error);
		if (current instanceof AggregateError) pending.push(...current.errors);
		pending.push(current.cause);
	}
	if (!code) return;
	if (code === "ENOSPC" && error instanceof FsSafeError) return;
	const cleanup = details?.cleanup;
	const publication = details?.publication;
	const preserved = cleanup?.status === "preserved" && publication?.status === "indeterminate";
	const message = code === "ENOSPC" ? PINNED_WRITE_ERRNO_MESSAGES.get(code) : "filesystem write failed: too many open files";
	return new FsSafeError(code === "ENOSPC" ? "invalid-path" : "helper-failed", `${message} (${code})${preserved ? "; publication outcome is indeterminate; staged file preserved" : ""}`, {
		cause: error,
		details
	});
}
function normalizePinnedWriteError(error) {
	const exhausted = resourceExhaustion(error);
	if (exhausted) return exhausted;
	let primary = error;
	const seen = /* @__PURE__ */ new Set();
	try {
		while (primary instanceof Error && primary.name === "SuppressedError" && !seen.has(primary)) {
			seen.add(primary);
			primary = primary.suppressed;
		}
		if (primary !== error && primary instanceof FsSafeError && primary.details?.phase === "publish") return new FsSafeError(primary.code, primary.message, {
			cause: error,
			details: primary.details
		});
	} catch {}
	if (error instanceof FsSafeError) return error;
	if (isNotFoundPathError(error)) return fileNotFoundError(error instanceof Error ? error : void 0);
	const code = isNodeError(error) && typeof error.code === "string" && /^E[A-Z0-9_]+$/.test(error.code) ? error.code : void 0;
	return new FsSafeError("invalid-path", code ? `${PINNED_WRITE_ERRNO_MESSAGES.get(code) ?? "filesystem write failed"} (${code})` : "path is not a regular file under root", errorCauseOptions(error));
}
function normalizePinnedPathError(error, details) {
	if (error instanceof FsSafeError) return error;
	return new FsSafeError("path-alias", "path is not under root", {
		cause: error instanceof Error ? error : void 0,
		details
	});
}
function normalizeRemoveGuardError(error, details) {
	if (error instanceof FsSafeError) return error;
	if (isNotFoundPathError(error)) return fileNotFoundError(error instanceof Error ? error : void 0, details);
	return normalizePinnedPathError(error, details);
}
function normalizeRemovePathError(error, details) {
	if (error instanceof FsSafeError) return error;
	if (!isNodeError(error) || typeof error.code !== "string") return normalizePinnedPathError(error, details);
	const cause = error instanceof Error ? error : void 0;
	if (isNotFoundPathError(error)) return fileNotFoundError(cause, details);
	if (REMOVE_NOT_EMPTY_CODES.has(error.code)) return new FsSafeError("not-empty", "directory is not empty", {
		cause,
		details
	});
	return new FsSafeError("not-removable", "path could not be removed", {
		cause,
		details
	});
}
/** Existing boundaries retain only Error instances as their cause. */
function errorCauseOptions(error) {
	return { cause: error instanceof Error ? error : void 0 };
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-entry-path.js
/** Strip only trailing separators: lstat must inspect the entry, not follow a leaf link. */
function directoryEntryPath(dir, platform = process.platform) {
	const windows = platform === "win32";
	if (typeof dir === "string") {
		const last = dir[dir.length - 1];
		if (last !== "/" && (!windows || last !== "\\")) return dir;
	}
	let rootLength = (windows ? path.win32 : path.posix).parse(dir).root.length;
	if (windows && /^[\\/]{2}[?.][\\/]UNC[\\/]/i.test(dir)) {
		const uncRoot = path.win32.parse(`\\\\${dir.slice(8)}`).root;
		if (uncRoot.length > 1) rootLength = Math.max(rootLength, uncRoot.length + 6);
	}
	let end = dir.length;
	while (end > rootLength && (dir[end - 1] === "/" || windows && dir[end - 1] === "\\")) end--;
	return end === rootLength || end === dir.length ? dir : dir.slice(0, end);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/stat-observation.js
function safeNumber(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function safeExpected(identity) {
	return typeof identity.dev === "bigint" && typeof identity.ino === "bigint" && identity.dev >= 0n && identity.ino >= 0n && identity.dev <= 9007199254740991n && identity.ino <= 9007199254740991n;
}
function observeStatSync(inspect, expected, initial, platform = process.platform, captureIdentity) {
	if (platform === "win32" || !initial && expected && !safeExpected(expected)) {
		const stat = inspectFileIdentitySync(() => {
			const current = initial;
			initial = void 0;
			return current ?? inspect(true);
		}, expected, platform);
		return captureIdentity ? {
			stat,
			identity: expected ?? {
				dev: stat.dev,
				ino: stat.ino
			}
		} : stat;
	}
	const stat = initial ?? inspect(false);
	const { dev: rawDev, ino: rawIno } = stat;
	const numericDev = safeNumber(rawDev);
	const numericIno = safeNumber(rawIno);
	const dev = numericDev ? BigInt(rawDev) : typeof rawDev === "bigint" ? rawDev : void 0;
	const ino = numericIno ? BigInt(rawIno) : typeof rawIno === "bigint" ? rawIno : void 0;
	if (expected && (dev !== void 0 && dev !== expected.dev || ino !== void 0 && ino !== expected.ino)) throw fileIdentityMismatchError();
	if (numericDev && numericIno) return captureIdentity ? {
		stat,
		identity: expected ?? {
			dev,
			ino
		}
	} : stat;
	const exact = inspectFileIdentitySync(() => {
		const current = inspect(true);
		if (dev !== void 0 && current.dev !== dev || ino !== void 0 && current.ino !== ino) throw fileIdentityMismatchError();
		return current;
	}, expected, platform);
	return captureIdentity ? {
		stat: exact,
		identity: expected ?? {
			dev: exact.dev,
			ino: exact.ino
		}
	} : exact;
}
/** Operation-local metadata plus exact identity; never use projected PathStat IDs. */
function inspectStatObservationSync(inspect, expected, initial, platform = process.platform) {
	return observeStatSync(inspect, expected, initial, platform, true);
}
/** Revalidate an exact identity without allocating a receipt that the caller will discard. */
function assertStatObservationSync(inspect, expected, initial, platform = process.platform) {
	return observeStatSync(inspect, expected, initial, platform, false);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/directory-guard.js
const exactGuardIdentities = /* @__PURE__ */ new WeakMap();
function assertDirectoryIdentitySync(observedPath, expected) {
	const operationPath = directoryOperationPath(observedPath);
	const expectedDev = expected.dev;
	const expectedIno = expected.ino;
	const expectedRealPath = expected.realPath;
	if (expectedRealPath !== void 0) assertNoWindowsPathAlias(expectedRealPath, "filesystem");
	inspectDirectoryIdentityAtPathSync(operationPath, {
		dev: expectedDev,
		ino: expectedIno
	});
	if (expectedRealPath === void 0) return;
	const realPath = realpathSync$1.native(operationPath);
	assertNoWindowsPathAlias(realPath, "filesystem");
	if (realPath !== expectedRealPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
}
async function createAsyncDirectoryGuard(dir, options) {
	return captureDirectoryGuard(dir, "native", options);
}
function captureDirectoryGuard(dir, mode, options) {
	const operationPath = directoryOperationPath(dir);
	const stat = options?.bigint ? inspectDirectoryIdentityAtPathSync(operationPath, void 0, options.initial) : fs.lstatSync(operationPath);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	let exactIdentity;
	if (!hasSafeFileIdentity(stat)) {
		const exact = fs.lstatSync(operationPath, { bigint: true });
		if (exact.isSymbolicLink() || !exact.isDirectory()) throw directoryComponentNotDirectoryError();
		exactIdentity = {
			dev: exact.dev,
			ino: exact.ino
		};
	}
	const realPath = mode === "native" ? realpathSync$1.native(operationPath) : realpathSync$1(operationPath);
	assertNoWindowsPathAlias(realPath, "filesystem");
	const guard = {
		dir,
		realPath,
		stat
	};
	if (exactIdentity) exactGuardIdentities.set(guard, exactIdentity);
	return guard;
}
async function assertAsyncDirectoryGuard(guard) {
	assertDirectoryGuard(guard, "native");
}
function assertSyncDirectoryGuard(guard) {
	assertDirectoryGuard(guard, "normalized");
}
function assertDirectoryGuard(guard, mode) {
	const dir = guard.dir;
	const operationPath = directoryOperationPath(dir);
	const expectedRealPath = guard.realPath;
	assertNoWindowsPathAlias(expectedRealPath, "filesystem");
	const expectedStat = guard.stat;
	const suppliedIdentity = {
		dev: expectedStat.dev,
		ino: expectedStat.ino
	};
	const retainedIdentity = exactGuardIdentities.get(guard);
	const expectedIdentity = retainedIdentity ?? suppliedIdentity;
	const stat = typeof expectedIdentity.dev === "bigint" && typeof expectedIdentity.ino === "bigint" ? retainedIdentity ? fs.lstatSync(operationPath, { bigint: true }) : inspectDirectoryIdentityAtPathSync(operationPath, {
		dev: expectedIdentity.dev,
		ino: expectedIdentity.ino
	}) : fs.lstatSync(operationPath);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	if (mode === "native" && !sameFileIdentity(stat, expectedIdentity)) throw new FsSafeError("path-mismatch", "directory changed during operation");
	const realPath = mode === "native" || typeof suppliedIdentity.ino === "bigint" ? realpathSync$1.native(operationPath) : realpathSync$1(operationPath);
	assertNoWindowsPathAlias(realPath, "filesystem");
	if (mode === "normalized" && !sameFileIdentity(stat, expectedIdentity) || realPath !== expectedRealPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
}
async function createNearestExistingDirectoryGuard(rootReal, targetPath, options = { bigint: false }) {
	assertNoWindowsPathAlias(rootReal, "filesystem");
	assertNoWindowsPathAlias(targetPath, "filesystem");
	let current = resolvePathPreservingWindowsRoot(targetPath);
	const root = resolvePathPreservingWindowsRoot(rootReal);
	while (current !== root) try {
		return captureDirectoryGuard(current, "native", options);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		current = path.dirname(current);
	}
	return captureDirectoryGuard(root, "native", options);
}
async function inspectDirectoryIdentity(dir, expected) {
	return inspectDirectoryIdentitySync(dir, expected);
}
function directoryOperationPath(dir) {
	assertNoWindowsPathAlias(dir, "filesystem");
	return pathForWindowsFilesystem(directoryEntryPath(dir));
}
function inspectDirectoryIdentitySync(dir, expected, initial, platform = process.platform) {
	return inspectDirectoryIdentityAtPathSync(directoryOperationPath(dir), expected === void 0 ? void 0 : {
		dev: expected.dev,
		ino: expected.ino
	}, initial, platform);
}
function inspectDirectoryIdentityAtPathSync(operationPath, expected, initial, platform = process.platform) {
	return inspectFileIdentitySync(() => {
		const stat = initial ?? fs.lstatSync(operationPath, { bigint: true });
		initial = void 0;
		if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		return stat;
	}, expected, platform);
}
function extendDirectoryObservationGuard(observation, dir, realPath) {
	const guard = observation;
	guard.dir = dir;
	guard.realPath = realPath;
	return guard;
}
function inspectDirectoryObservationSync(dir, expected) {
	const entryPath = directoryOperationPath(dir);
	return inspectStatObservationSync((bigint) => {
		const stat = bigint ? fs.lstatSync(entryPath, { bigint: true }) : fs.lstatSync(entryPath);
		if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		return stat;
	}, expected);
}
function assertDirectoryObservationSync(dir, expected) {
	const entryPath = directoryOperationPath(dir);
	return assertStatObservationSync((bigint) => {
		const stat = bigint ? fs.lstatSync(entryPath, { bigint: true }) : fs.lstatSync(entryPath);
		if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		return stat;
	}, expected);
}
function assertDirectoryObservationGuardSync(guard) {
	const dir = guard.dir;
	const expectedRealPath = guard.realPath;
	assertNoWindowsPathAlias(expectedRealPath, "filesystem");
	assertDirectoryObservationSync(dir, guard.identity);
	const realPath = realpathSync$1.native(directoryOperationPath(dir));
	assertNoWindowsPathAlias(realPath, "filesystem");
	if (realPath !== expectedRealPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/error-detail.js
const UNSAFE_ERROR_DETAIL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/gu;
function formatErrorDetail(value) {
	return value.replace(UNSAFE_ERROR_DETAIL_CHARACTERS, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function shortPath(value) {
	const home = os.homedir();
	const prefix = home.endsWith(path.sep) ? home : `${home}${path.sep}`;
	return formatErrorDetail(value === home ? "~" : value.startsWith(prefix) ? `~${path.sep}${value.slice(prefix.length)}` : value);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-path-errors.js
const rootPathEscapeErrors = /* @__PURE__ */ new WeakSet();
function rootPathEscapeError(message) {
	const error = new Error(message);
	rootPathEscapeErrors.add(error);
	return error;
}
function isRootPathEscapeError(error) {
	return error instanceof Error && rootPathEscapeErrors.has(error);
}
function sanitizeRootPathError(error) {
	if (error instanceof Error) error.message = formatErrorDetail(error.message);
	return error;
}
function pathEscapeError(params) {
	return rootPathEscapeError(`Path escapes ${params.boundaryLabel} (${shortPath(params.rootPath)}): ${shortPath(params.absolutePath)}`);
}
function symlinkEscapeError(params) {
	return rootPathEscapeError(`Symlink escapes ${params.boundaryLabel} (${shortPath(params.rootCanonicalPath)}): ${shortPath(params.symlinkPath)}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-stat-identity.js
/** Native stat identities are unsigned; Node BigIntStats preserves them as signed bits. */
function statIdentityFromNative(value) {
	return value <= 9223372036854775807n || process.versions.bun ? value : BigInt.asIntN(64, value);
}
function isNativeStatIdentity(value) {
	return typeof value === "bigint" && value >= 0n && value <= 18446744073709551615n;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/native-directory-observation.js
function getNativeDirectoryObservationBackend(enabled = true) {
	if (!enabled) return void 0;
	const binding = getNativeBinding("observeDirectory");
	return binding && typeof binding.observeDirectory === "function" ? binding : void 0;
}
function validateNativeDirectoryObservation(observation) {
	if (!observation || !isNativeStatIdentity(observation.dev) || !isNativeStatIdentity(observation.ino) || typeof observation.realPath !== "string" || observation.realPath.includes("\0") || !path.isAbsolute(observation.realPath) && !path.win32.isAbsolute(observation.realPath)) throw new FsSafeError("path-mismatch", "native directory observation is invalid");
	const dev = statIdentityFromNative(observation.dev), ino = statIdentityFromNative(observation.ino);
	return dev === observation.dev && ino === observation.ino ? observation : {
		...observation,
		dev,
		ino
	};
}
/** Exact identity, type, and canonical path captured from one retained handle. */
function inspectNativeDirectoryObservation(backend, pathname, expected, platform = process.platform) {
	return inspectFileIdentitySync(() => validateNativeDirectoryObservation(backend.observeDirectory(pathname)), expected, platform);
}
function extendNativeDirectoryObservationGuard(observation, dir) {
	const guard = observation;
	guard.dir = dir;
	guard.identity = guard;
	guard.nativeDirectoryObservation = true;
	return guard;
}
function isNativeDirectoryObservationGuard(guard) {
	return typeof guard === "object" && guard !== null && guard.nativeDirectoryObservation === true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-boundary.js
function sameNormalizedPathSpelling(left, right) {
	return path.resolve(left) === path.resolve(right);
}
function windowsComparisonSpelling(original) {
	if (/^\\\\\?\\UNC\\/i.test(original)) return `\\\\${original.slice(8)}`;
	if (original.startsWith("\\\\?\\")) return original.slice(4);
	return original;
}
function trimWindowsTrailingSeparators(value) {
	const rootLength = path.win32.parse(value).root.length;
	let end = value.length;
	while (end > rootLength && value[end - 1] === "\\") end -= 1;
	return value.slice(0, end);
}
function trimWindowsLeadingSeparators(value) {
	let start = 0;
	while (value[start] === "\\") start += 1;
	return value.slice(start);
}
function exactWindowsRootPrefix(rootPath, candidatePath) {
	const root = trimWindowsTrailingSeparators(rootPath.replaceAll("/", "\\"));
	const candidate = candidatePath.replaceAll("/", "\\");
	let relativePath;
	if (candidate === root) relativePath = "";
	else {
		const rootWithSep = root.endsWith("\\") ? root : `${root}\\`;
		if (!candidate.startsWith(rootWithSep)) return void 0;
		relativePath = trimWindowsLeadingSeparators(candidate.slice(rootWithSep.length));
	}
	return {
		admission: "exact",
		candidateRootPath: root,
		path: relativePath === "" ? root : `${root}${root.endsWith("\\") ? "" : "\\"}${relativePath}`,
		relativePath
	};
}
function windowsRootPrefix(rootPath, candidatePath) {
	const exact = exactWindowsRootPrefix(rootPath, candidatePath);
	if (exact) return exact;
	const trusted = path.win32.normalize(rootPath.replaceAll("/", "\\"));
	const trustedComparison = windowsComparisonSpelling(trusted);
	const supplied = candidatePath.replaceAll("/", "\\");
	const candidate = windowsComparisonSpelling(supplied);
	const root = trimWindowsTrailingSeparators(trusted);
	const rootComparison = trimWindowsTrailingSeparators(trustedComparison);
	if (!path.win32.isAbsolute(supplied)) return void 0;
	let relativePath;
	let candidateRootPath;
	let admission;
	if (candidate === rootComparison) {
		relativePath = "";
		candidateRootPath = supplied;
		admission = "exact";
	} else if (candidate.toLowerCase() === rootComparison.toLowerCase()) {
		relativePath = "";
		candidateRootPath = supplied;
		admission = "identity";
	} else {
		const rootWithSep = rootComparison.endsWith("\\") ? rootComparison : `${rootComparison}\\`;
		const candidatePrefix = candidate.slice(0, rootWithSep.length);
		if (candidatePrefix === rootWithSep) admission = "exact";
		else if (candidatePrefix.toLowerCase() === rootWithSep.toLowerCase()) admission = "identity";
		else return;
		relativePath = trimWindowsLeadingSeparators(candidate.slice(rootWithSep.length));
		candidateRootPath = supplied.slice(0, rootComparison.length + (supplied.length - candidate.length));
	}
	const rebasedPath = relativePath === "" ? root : `${root}${root.endsWith("\\") ? "" : "\\"}${relativePath}`;
	return {
		candidateRootPath,
		path: rebasedPath,
		relativePath,
		admission
	};
}
function exactRootIdentity(rootPath, expected) {
	if (typeof expected?.dev === "bigint" && typeof expected.ino === "bigint") return {
		dev: expected.dev,
		ino: expected.ino
	};
	const observed = inspectDirectoryIdentitySync(rootPath);
	return {
		dev: observed.dev,
		ino: observed.ino
	};
}
/**
* Admit a path at a trusted directory boundary.
*
* On Windows, an exact structural prefix is allocation-only and performs no
* filesystem observation. A match which depends on case folding is accepted
* only when the candidate prefix names the exact trusted root object. Accepted
* paths are always returned under the trusted root spelling.
*/
function admitPathInsideRoot(params) {
	if (process.platform !== "win32" || path.sep === "/" && params.rootPath.startsWith("/") && params.rootPath[1] !== "/" && params.rootPath[1] !== "\\") {
		if (params.rootPath.startsWith("/") && params.candidatePath.startsWith("/") && !params.candidatePath.includes("/..") && (params.candidatePath === params.rootPath || params.candidatePath.startsWith(params.rootPath) && (params.rootPath.endsWith("/") || params.candidatePath[params.rootPath.length] === "/"))) {
			const relativeStart = params.rootPath.endsWith("/") ? params.rootPath.length : params.rootPath.length + 1;
			return {
				admission: "exact",
				path: params.candidatePath,
				relativePath: params.candidatePath === params.rootPath ? "" : params.candidatePath.slice(relativeStart)
			};
		}
		const root = path.resolve(params.rootPath);
		const candidate = path.resolve(params.candidatePath);
		const relativePath = path.relative(root, candidate);
		if (isPathRelativeEscape(relativePath)) return void 0;
		return {
			path: candidate,
			relativePath: relativePath === "." ? "" : relativePath,
			admission: "exact"
		};
	}
	const match = windowsRootPrefix(params.rootPath, params.candidatePath);
	if (!match) return void 0;
	const admitted = () => ({
		admission: match.admission,
		path: match.path,
		relativePath: match.relativePath
	});
	if (match.admission === "exact") return admitted();
	const cached = params.identityCache?.get(match.candidateRootPath);
	if (cached !== void 0) return cached ? admitted() : void 0;
	try {
		const expected = exactRootIdentity(params.rootPath, params.rootIdentity);
		const candidateRootPath = params.resolveCandidateRoot ? realpathSync$1.native(match.candidateRootPath) : match.candidateRootPath;
		if (params.inspectCandidateRoot) params.inspectCandidateRoot(candidateRootPath, expected);
		else inspectDirectoryIdentitySync(candidateRootPath, expected);
		params.identityCache?.set(match.candidateRootPath, true);
		return admitted();
	} catch {
		params.identityCache?.set(match.candidateRootPath, false);
		return;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-path-existing.js
function absolutePathWithRawSegments(candidate) {
	if (path.sep !== "\\") {
		if (path.isAbsolute(candidate)) return candidate;
		const base = process.cwd();
		return `${base}${base.endsWith(path.sep) ? "" : path.sep}${candidate}`;
	}
	const raw = path.sep === "\\" ? candidate.replaceAll("/", "\\") : candidate;
	const absolute = path.isAbsolute(raw);
	if (absolute && raw[0] !== "\\") return raw;
	const drive = path.parse(raw).root;
	if (absolute && drive !== "\\") return raw;
	const base = drive ? path.resolve(drive) : process.cwd();
	return `${base}${base.endsWith(path.sep) ? "" : path.sep}${raw.slice(drive.length)}`;
}
function rawPathRelativeToCanonicalRoot(candidate, rootCanonicalPath, options = {}) {
	assertNoWindowsPathAlias(candidate);
	assertNoWindowsPathAlias(rootCanonicalPath);
	const absolute = absolutePathWithRawSegments(candidate);
	const raw = process.platform === "win32" ? absolute.replaceAll("/", path.sep) : absolute;
	if (isForeignWindowsShareOrDevicePath(raw, [rootCanonicalPath])) return void 0;
	const filesystemRoot = path.parse(raw).root;
	const segments = raw.slice(filesystemRoot.length).split(path.sep);
	const finalComponentIndex = segments.findLastIndex((segment) => segment !== "" && segment !== ".");
	let prefix = filesystemRoot;
	let traversedSymlink = false;
	const identityCache = process.platform === "win32" ? /* @__PURE__ */ new Map() : void 0;
	for (let index = 0; index < segments.length; index += 1) {
		prefix += `${prefix.endsWith(path.sep) ? "" : path.sep}${segments[index]}`;
		let canonical;
		let isSymlink = false;
		try {
			const operationPath = pathForWindowsFilesystem(prefix);
			const stat = fs.lstatSync(operationPath);
			isSymlink = stat.isSymbolicLink();
			if (isSymlink && options.rejectFinalSymlink && index === finalComponentIndex) throw new FsSafeError("symlink", "final symlink not allowed");
			if (!isSymlink && !stat.isDirectory() && index < segments.length - 1) return void 0;
			traversedSymlink ||= isSymlink;
			canonical = realpathSync$1.native(operationPath);
			assertNoWindowsPathAlias(canonical);
			if (isSymlink && index < segments.length - 1 && !fs.statSync(pathForWindowsFilesystem(canonical)).isDirectory()) return void 0;
			if (isSymlink && !isPathInside(rootCanonicalPath, canonical) && !isPathInside(canonical, rootCanonicalPath)) throw new FsSafeError("outside-workspace", `symlink prefix resolves outside the root ancestry: ${formatErrorDetail(candidate)}`);
		} catch (error) {
			if (error instanceof FsSafeError) throw error;
			if (isSymlink) return void 0;
			continue;
		}
		const admitted = admitPathInsideRoot({
			rootPath: rootCanonicalPath,
			candidatePath: canonical,
			rootIdentity: options.rootIdentity,
			identityCache
		});
		if (!admitted) continue;
		if (options.rejectSymlinks && traversedSymlink) throw new FsSafeError("symlink", "symlink path component not allowed");
		return [admitted.relativePath, ...segments.slice(index + 1)].filter(Boolean).join(path.sep);
	}
}
function pathExists(targetPath) {
	try {
		return fs.lstatSync(pathForWindowsFilesystem(targetPath), { throwIfNoEntry: false }) !== void 0;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	}
}
async function resolvePathViaExistingAncestor(targetPath) {
	return resolveExistingAncestor(targetPath, "native");
}
function pathExistsSync(targetPath) {
	return fs.existsSync(pathForWindowsFilesystem(targetPath));
}
function resolvePathViaExistingAncestorSync(targetPath) {
	return resolveExistingAncestor(targetPath, "ordinary");
}
function resolveExistingAncestor(targetPath, mode) {
	const exists = mode === "native" ? pathExists : pathExistsSync;
	const canonicalize = mode === "native" ? realpathSync$1.native : realpathSync$1;
	assertNoWindowsPathAlias(targetPath);
	const normalized = resolvePathPreservingWindowsRoot(targetPath);
	assertNoWindowsPathAlias(normalized);
	let cursor = normalized;
	const filesystemRoot = path.parse(normalized).root;
	while (cursor !== filesystemRoot && !exists(cursor)) cursor = path.dirname(cursor);
	if (!exists(cursor)) return normalized;
	let rawResolvedAncestor;
	try {
		rawResolvedAncestor = canonicalize(pathForWindowsFilesystem(cursor));
	} catch {
		return normalized;
	}
	assertNoWindowsPathAlias(rawResolvedAncestor);
	const resolvedAncestor = resolvePathPreservingWindowsRoot(rawResolvedAncestor);
	assertNoWindowsPathAlias(resolvedAncestor);
	const resolved = cursor === normalized ? resolvedAncestor : path.resolve(resolvedAncestor, `.${path.sep}${normalized.slice(cursor.length)}`);
	assertNoWindowsPathAlias(resolved);
	return resolved;
}
function resolveSymlinkHopPath(symlinkPath, mode, rejectUnresolved) {
	try {
		const rawRealPath = (mode === "native" ? realpathSync$1.native : realpathSync$1)(symlinkPath);
		assertNoWindowsPathAlias(rawRealPath, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		const realPath = resolvePathPreservingWindowsRoot(rawRealPath);
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		return realPath;
	} catch (error) {
		if (isSymlinkOpenError(error) || rejectUnresolved && isNotFoundPathError(error)) throw new FsSafeError("symlink", "symlink path could not be resolved", errorCauseOptions(error));
		if (!isNotFoundPathError(error)) throw error;
		const linkTarget = fs.readlinkSync(symlinkPath);
		assertNoWindowsPathAlias(linkTarget, "filesystem", "symlink target uses a Windows filesystem namespace alias");
		const resolved = resolveExistingAncestor(resolvePathFromBasePreservingWindowsRoot(resolvePathPreservingWindowsRoot(path.dirname(symlinkPath)), linkTarget), mode);
		assertNoWindowsPathAlias(resolved, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		return resolved;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-path-observation.js
var RootPathObservationError = class extends Error {
	error;
	parentReceipt;
	traversalFailure;
	constructor(error, parentReceipt, traversalFailure = false) {
		super("root path observation failed", { cause: error });
		this.error = error;
		this.parentReceipt = parentReceipt;
		this.traversalFailure = traversalFailure;
		this.name = "RootPathObservationError";
	}
};
function straightTraversalPath(value) {
	if (value.length === 0) return false;
	const windows = process.platform === "win32";
	let segmentStart = 0;
	for (let index = 0; index <= value.length; index += 1) {
		if (!(index === value.length || value[index] === "/" || windows && value[index] === "\\")) continue;
		const segmentLength = index - segmentStart;
		if (segmentLength === 0 || segmentLength === 1 && value.charCodeAt(segmentStart) === 46 || segmentLength === 2 && value.charCodeAt(segmentStart) === 46 && value.charCodeAt(segmentStart + 1) === 46) return false;
		segmentStart = index + 1;
	}
	return true;
}
function createRootPathTraversalObservation(context, request) {
	const { state } = context;
	const rootTraversal = state.finalComponentIndex < 0 && (state.relativePath === "" || state.relativePath === ".");
	if (!request || !context.observationEligible || request.rootGuard.dir !== context.rootCanonicalPath || request.rootGuard.realPath !== context.rootCanonicalPath || context.rootPath !== context.rootCanonicalPath || !rootTraversal && !straightTraversalPath(state.relativePath) || !rootTraversal && state.finalComponentIndex !== state.segments.length - 1) return void 0;
	if (state.finalComponentIndex >= 0) {
		const directoryIndex = request.kind === "stat" ? state.finalComponentIndex - 1 : state.finalComponentIndex;
		return {
			enabled: true,
			request,
			targetIndex: state.finalComponentIndex,
			directoryIndex,
			directoryGuard: directoryIndex < 0 ? request.rootGuard : void 0,
			directoryObserver: directoryIndex < 0 ? void 0 : request.directoryObserver
		};
	}
	if (!rootTraversal) return void 0;
	let directoryGuard = request.rootGuard;
	let directoryObserver = request.kind === "stat" ? void 0 : request.directoryObserver;
	if (request.kind === "directory") {
		if (directoryObserver) try {
			const observed = inspectNativeDirectoryObservation(directoryObserver, request.rootGuard.dir, request.rootGuard.identity);
			const admitted = admitPathInsideRoot({
				rootPath: context.rootCanonicalPath,
				candidatePath: observed.realPath,
				rootIdentity: context.resolveParams.rootIdentity
			});
			if (!admitted || admitted.relativePath !== "") throw new FsSafeError("path-mismatch", "root path changed during operation");
			observed.realPath = admitted.path;
			directoryGuard = extendNativeDirectoryObservationGuard(observed, request.rootGuard.dir);
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "path-mismatch") throw new RootPathObservationError(error);
			directoryObserver = void 0;
		}
		if (!directoryObserver) try {
			const admitted = admitPathInsideRoot({
				rootPath: context.rootCanonicalPath,
				candidatePath: realpathSync$1.native(request.rootGuard.dir),
				rootIdentity: context.resolveParams.rootIdentity
			});
			if (!admitted || admitted.relativePath !== "") throw new FsSafeError("path-mismatch", "root path changed during operation");
		} catch (error) {
			throw new RootPathObservationError(error);
		}
	}
	return {
		enabled: true,
		request,
		targetIndex: -1,
		directoryIndex: -1,
		directoryGuard,
		directoryObserver,
		targetPath: context.rootCanonicalPath,
		target: directoryGuard
	};
}
function inspectRootPathTraversalEntry(pathname, directorySlot, observation) {
	if (directorySlot && observation.directoryObserver) try {
		return extendNativeDirectoryObservationGuard(inspectNativeDirectoryObservation(observation.directoryObserver, pathname), pathname);
	} catch {
		observation.directoryObserver = void 0;
	}
	const first = process.platform === "win32" ? fs.lstatSync(pathname, { bigint: true }) : fs.lstatSync(pathname);
	if (first.isSymbolicLink() || directorySlot && !first.isDirectory()) return { stat: first };
	try {
		return inspectStatObservationSync((bigint) => bigint ? fs.lstatSync(pathname, { bigint: true }) : fs.lstatSync(pathname), void 0, first);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw new RootPathObservationError(error);
		throw error;
	}
}
function captureRootPathObservedDirectory(observation, observed, publicPath, canonicalPath, rootCanonicalPath, rootIdentity) {
	if (!isNativeDirectoryObservationGuard(observed) && !observed.stat.isDirectory()) return false;
	let realPath;
	try {
		realPath = isNativeDirectoryObservationGuard(observed) ? observed.realPath : realpathSync$1.native(canonicalPath);
	} catch (error) {
		throw new RootPathObservationError(error);
	}
	const admitted = admitPathInsideRoot({
		rootPath: rootCanonicalPath,
		candidatePath: realPath,
		rootIdentity
	});
	if (!admitted) throw new RootPathObservationError(new FsSafeError("outside-workspace", "directory is outside workspace root"));
	if (isNativeDirectoryObservationGuard(observed)) {
		observed.dir = publicPath;
		observed.realPath = admitted.path;
		observation.directoryGuard = observed;
	} else observation.directoryGuard = extendDirectoryObservationGuard(observed, publicPath, admitted.path);
	return true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-path.js
const ROOT_PATH_ALIAS_POLICIES = {
	strict: Object.freeze({
		allowFinalSymlinkForUnlink: false,
		allowFinalHardlinkForUnlink: false
	}),
	unlinkTarget: Object.freeze({
		allowFinalSymlinkForUnlink: true,
		allowFinalHardlinkForUnlink: true
	})
};
async function resolveRootPath(params) {
	return resolveRootPathInternal(params);
}
async function resolveRootPathWithObservation(params, request) {
	const observation = { request };
	const resolved = resolveRootPathInternal(params, { observation });
	return observation.receipt ? {
		resolved,
		receipt: observation.receipt
	} : { resolved };
}
async function resolveRootPathForRemoval(params, receipts) {
	return resolveRootPathInternal(params, { removalReceipts: receipts });
}
function resolveRootPathSync(params) {
	return resolveRootPathInternal(params, { mode: "ordinary" });
}
function resolveRootPathSyncWithCanonicalRootObservation(params, observeRoot) {
	return resolveRootPathInternal(params, {
		mode: "ordinary",
		observeRoot
	});
}
function resolveRootPathInternal(params, options = {}) {
	try {
		return traverseRootPath(params, options);
	} catch (error) {
		throw sanitizeRootPathError(error);
	}
}
function prepareRootTraversal(params, rootPath, rootCanonicalPath, absolutePath, rawAbsolutePath) {
	let raw = rawAbsolutePath;
	let trustedAbsolutePath = false;
	if (isForeignWindowsShareOrDevicePath(raw, [rootPath, rootCanonicalPath])) throw pathEscapeError({
		rootPath,
		absolutePath: raw,
		boundaryLabel: params.boundaryLabel
	});
	const direct = admitRawPathInsideRoot(rootPath, raw, params.rootIdentity);
	if (direct) {
		raw = direct.path;
		trustedAbsolutePath = direct.admission === "identity";
	} else {
		const canonical = admitRawPathInsideRoot(rootCanonicalPath, raw, params.rootIdentity);
		const relative = canonical?.relativePath ?? rawPathRelativeToCanonicalRoot(raw, rootCanonicalPath, params);
		if (relative === void 0) throw pathEscapeError({
			rootPath,
			absolutePath: raw,
			boundaryLabel: params.boundaryLabel
		});
		trustedAbsolutePath = canonical?.admission === "identity";
		raw = relative === "" ? rootPath : `${rootPath}${path.sep}${relative}`;
	}
	return {
		params,
		rawAbsolutePath: raw,
		rootPath,
		rootCanonicalPath,
		absolutePath: trustedAbsolutePath ? resolvePathPreservingWindowsRoot(raw) : absolutePath,
		observationEligible: raw === rawAbsolutePath && !trustedAbsolutePath
	};
}
function captureValidRootPathInputs(params) {
	const rootPath = params.rootPath;
	assertNoNulPathInput(rootPath, "root path contains a NUL byte");
	const absolutePath = params.absolutePath;
	assertNoNulPathInput(absolutePath, "absolute path contains a NUL byte");
	assertNoWindowsPathAlias(rootPath, "filesystem", "root path uses a Windows filesystem namespace alias");
	assertNoWindowsPathAlias(absolutePath, "filesystem", "absolute path uses a Windows filesystem namespace alias");
	assertNoEmbeddedDriveRelativeSegment(rootPath, "root path");
	assertNoEmbeddedDriveRelativeSegment(absolutePath, "absolute path");
	const rootCanonicalPath = params.rootCanonicalPath;
	if (rootCanonicalPath !== void 0) {
		assertNoNulPathInput(rootCanonicalPath, "canonical root path contains a NUL byte");
		assertNoWindowsPathAlias(rootCanonicalPath, "filesystem", "canonical root path uses a Windows filesystem namespace alias");
		assertNoEmbeddedDriveRelativeSegment(rootCanonicalPath, "canonical root path");
	}
	const policy = params.policy;
	const rootIdentity = params.rootIdentity;
	return {
		rootPath,
		absolutePath,
		rootCanonicalPath,
		rootIdentity: rootIdentity == null ? void 0 : {
			dev: rootIdentity.dev,
			ino: rootIdentity.ino
		},
		boundaryLabel: params.boundaryLabel,
		policy: policy == null ? void 0 : { allowFinalSymlinkForUnlink: policy.allowFinalSymlinkForUnlink },
		rejectSymlinks: params.rejectSymlinks,
		rejectFinalSymlink: params.rejectFinalSymlink,
		rejectUnresolvedSymlinks: params.rejectUnresolvedSymlinks
	};
}
function assertNoEmbeddedDriveRelativeSegment(filePath, label) {
	if (process.platform !== "win32") return;
	const root = path.parse(filePath).root;
	assertNoDriveRelativePathSegments(filePath.slice(root.length).replaceAll("\\", "/"), label);
}
function createLexicalTraversalContext(params) {
	const relative = admitRawPathInsideRoot(params.rootPath, params.rawAbsolutePath, params.params.rootIdentity)?.relativePath;
	if (relative === void 0) throw new Error("Path traversal must begin at the root");
	const segments = splitTraversalSegments(relative);
	return {
		state: {
			segments,
			relativePath: relative,
			reuseLexicalCanonical: false,
			finalComponentIndex: segments.findLastIndex((segment) => segment !== "."),
			allowFinalSymlink: params.params.policy?.allowFinalSymlinkForUnlink === true,
			canonicalCursor: params.rootCanonicalPath,
			lexicalCursor: params.rootPath,
			preserveFinalSymlink: false,
			missingDepth: 0
		},
		resolveParams: params.params,
		rootPath: params.rootPath,
		rootCanonicalPath: params.rootCanonicalPath,
		absolutePath: params.absolutePath,
		observationEligible: params.observationEligible
	};
}
function createLexicalTraversalObservation(context, request) {
	const observation = createRootPathTraversalObservation(context, request);
	if (observation && observation.targetIndex >= 0) context.state.reuseLexicalCanonical = true;
	return observation;
}
function splitTraversalSegments(value) {
	const segments = value.split(process.platform === "win32" ? /[\\/]+/ : /\/+/).filter(Boolean);
	if (value.endsWith("/") || process.platform === "win32" && value.endsWith("\\")) segments.push(".");
	return segments;
}
function admitRawPathInsideRoot(rootPath, candidatePath, rootIdentity) {
	if (!path.isAbsolute(candidatePath)) return;
	const root = rootPath;
	const candidate = process.platform === "win32" ? candidatePath.replaceAll("/", path.sep) : candidatePath;
	if (process.platform === "win32") return admitPathInsideRoot({
		rootPath: root,
		candidatePath: candidate,
		rootIdentity
	});
	if (candidate === root) return {
		admission: "exact",
		path: candidate,
		relativePath: ""
	};
	const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
	return candidate.slice(0, rootWithSep.length) === rootWithSep ? {
		admission: "exact",
		path: candidate,
		relativePath: candidate.slice(rootWithSep.length)
	} : void 0;
}
function assertLexicalCursorInsideBoundary(context, candidatePath) {
	return assertInsideBoundary({
		boundaryLabel: context.resolveParams.boundaryLabel,
		rootCanonicalPath: context.rootCanonicalPath,
		rootIdentity: context.resolveParams.rootIdentity,
		candidatePath,
		absolutePath: context.absolutePath
	});
}
function advanceCanonicalCursorForSegment(context, segment) {
	const candidatePath = context.state.reuseLexicalCanonical ? context.state.lexicalCursor : resolvePathFromBasePreservingWindowsRoot(context.state.canonicalCursor, segment);
	context.state.canonicalCursor = assertLexicalCursorInsideBoundary(context, candidatePath);
}
function disableLexicalTraversalObservation(context, observation) {
	observation.enabled = false;
	context.state.reuseLexicalCanonical = false;
}
function finalizeLexicalResolution(context, kind) {
	context.state.canonicalCursor = assertLexicalCursorInsideBoundary(context, context.state.canonicalCursor);
	return {
		absolutePath: context.absolutePath,
		canonicalPath: context.state.canonicalCursor,
		rootPath: context.rootPath,
		rootCanonicalPath: context.rootCanonicalPath,
		relativePath: relativeInsideRoot(context.rootCanonicalPath, context.state.canonicalCursor),
		exists: kind !== "missing",
		kind
	};
}
function applyResolvedSymlinkHop(context, linkCanonical) {
	let admitted;
	try {
		admitted = assertLexicalCursorInsideBoundary(context, linkCanonical);
	} catch {
		throw symlinkEscapeError({
			boundaryLabel: context.resolveParams.boundaryLabel,
			rootCanonicalPath: context.rootCanonicalPath,
			symlinkPath: context.state.lexicalCursor
		});
	}
	context.state.canonicalCursor = admitted;
	context.state.lexicalCursor = admitted;
}
function applyParentTraversalStep(context) {
	context.state.lexicalCursor = resolvePathFromBasePreservingWindowsRoot(context.state.lexicalCursor, "..");
	advanceCanonicalCursorForSegment(context, "..");
	if (context.state.missingDepth > 0) context.state.missingDepth -= 1;
}
function assertDirectoryBeforeMoreSegments(stat, pathname, isLast) {
	if (!isLast && !stat.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error(`Path component is not a directory: ${pathname}`), { code: "ENOTDIR" });
}
function assertResolvedLinkDirectory(pathname, isLast) {
	if (isLast) return;
	assertDirectoryBeforeMoreSegments(fs.statSync(pathForWindowsFilesystem(pathname)), pathname, isLast);
}
function traverseRootPath(params, { mode = "native", observation: observationOutput, observeRoot, removalReceipts }) {
	const input = captureValidRootPathInputs(params);
	const rawAbsolutePath = absolutePathWithRawSegments(input.absolutePath);
	const rootPath = resolvePathPreservingWindowsRoot(input.rootPath);
	const absolutePath = resolvePathPreservingWindowsRoot(rawAbsolutePath);
	const rootCanonicalPath = input.rootCanonicalPath ? resolvePathPreservingWindowsRoot(input.rootCanonicalPath) : resolveExistingAncestor(rootPath, mode);
	assertNoWindowsPathAlias(rootPath);
	assertNoWindowsPathAlias(absolutePath);
	assertNoWindowsPathAlias(rootCanonicalPath);
	observeRoot?.(rootCanonicalPath);
	const context = createLexicalTraversalContext(prepareRootTraversal(input, rootPath, rootCanonicalPath, absolutePath, rawAbsolutePath));
	const { state } = context;
	const observation = createLexicalTraversalObservation(context, observationOutput?.request);
	for (let idx = 0; idx < state.segments.length; idx += 1) {
		const segment = state.segments[idx] ?? "";
		const isLast = idx === state.segments.length - 1;
		if (segment === ".") continue;
		if (segment === "..") {
			applyParentTraversalStep(context);
			continue;
		}
		state.lexicalCursor = path.join(state.lexicalCursor, segment);
		if (state.missingDepth > 0) {
			advanceCanonicalCursorForSegment(context, segment);
			state.missingDepth += 1;
			continue;
		}
		let stat;
		let observed;
		try {
			if (removalReceipts && !isLast) {
				const directoryStat = fs.lstatSync(pathForWindowsFilesystem(state.lexicalCursor), { bigint: true });
				if (directoryStat.isDirectory() && !directoryStat.isSymbolicLink()) removalReceipts.observeDirectory(state.lexicalCursor, directoryStat);
				stat = directoryStat;
			} else {
				const directorySlot = observation?.enabled === true && idx === observation.directoryIndex;
				const targetSlot = observation?.enabled === true && idx === observation.targetIndex;
				if (directorySlot || targetSlot) observed = inspectRootPathTraversalEntry(state.lexicalCursor, directorySlot, observation);
				stat = isNativeDirectoryObservationGuard(observed) ? void 0 : observed?.stat ?? fs.lstatSync(state.lexicalCursor);
			}
		} catch (error) {
			if (observation?.enabled && observation.request.kind === "stat" && idx === observation.targetIndex && observation.directoryGuard) {
				const parentReceipt = {
					kind: "stat-parent",
					rootGuard: observation.request.rootGuard,
					directoryGuard: observation.directoryGuard,
					directoryObserver: observation.directoryObserver,
					targetPath: state.lexicalCursor
				};
				throw new RootPathObservationError(error instanceof RootPathObservationError ? error.error : sanitizeRootPathError(error), parentReceipt, !(error instanceof RootPathObservationError));
			}
			if (!isNotFoundPathError(error)) throw error;
			advanceCanonicalCursorForSegment(context, segment);
			state.missingDepth = 1;
			continue;
		}
		if (isNativeDirectoryObservationGuard(observed)) {
			advanceCanonicalCursorForSegment(context, segment);
			captureRootPathObservedDirectory(observation, observed, state.lexicalCursor, state.canonicalCursor, context.rootCanonicalPath, context.resolveParams.rootIdentity);
			if (idx === observation.targetIndex) {
				observation.targetPath = state.canonicalCursor;
				observation.target = observed;
			}
			continue;
		}
		if (!stat) throw new Error("directory observation did not return metadata");
		const isSymbolicLink = stat.isSymbolicLink();
		if (!isSymbolicLink) assertDirectoryBeforeMoreSegments(stat, state.lexicalCursor, isLast);
		if (isSymbolicLink && (context.resolveParams.rejectFinalSymlink === true && idx === state.finalComponentIndex || context.resolveParams.rejectSymlinks === true && isLast)) throw new FsSafeError("symlink", "symlink path component not allowed");
		const preserveFinalSymlink = isSymbolicLink && state.allowFinalSymlink && isLast;
		if (!isSymbolicLink || preserveFinalSymlink) {
			state.preserveFinalSymlink = preserveFinalSymlink;
			advanceCanonicalCursorForSegment(context, segment);
			if (observation?.enabled && isSymbolicLink) disableLexicalTraversalObservation(context, observation);
			if (observation?.enabled && idx === observation.directoryIndex) {
				if (!(observed?.identity && captureRootPathObservedDirectory(observation, observed, state.canonicalCursor, state.canonicalCursor, context.rootCanonicalPath, context.resolveParams.rootIdentity))) disableLexicalTraversalObservation(context, observation);
			}
			if (observation?.enabled && idx === observation.targetIndex) {
				observation.targetPath = state.canonicalCursor;
				observation.target = observed?.identity ? observed : void 0;
			}
			if (state.preserveFinalSymlink) break;
			continue;
		}
		if (observation?.enabled) disableLexicalTraversalObservation(context, observation);
		const linkCanonical = resolveSymlinkHopPath(state.lexicalCursor, mode, context.resolveParams.rejectUnresolvedSymlinks);
		applyResolvedSymlinkHop(context, linkCanonical);
		if (context.resolveParams.rejectSymlinks === true) throw new FsSafeError("symlink", "symlink path component not allowed");
		assertResolvedLinkDirectory(linkCanonical, isLast);
	}
	const completeObservation = observation?.enabled === true && observation.directoryGuard !== void 0 && observation.targetPath === state.canonicalCursor && observation.target !== void 0;
	const kind = completeObservation ? isNativeDirectoryObservationGuard(observation.target) ? "directory" : toResolvedKind(observation.target.stat) : getPathKindSync(state.canonicalCursor, state.preserveFinalSymlink);
	if (completeObservation && observationOutput) observationOutput.receipt = {
		kind: observation.request.kind,
		rootGuard: observation.request.rootGuard,
		directoryGuard: observation.directoryGuard,
		directoryObserver: observation.directoryObserver,
		targetPath: observation.targetPath,
		target: observation.target
	};
	return finalizeLexicalResolution(context, kind);
}
function getPathKindSync(absolutePath, preserveFinalSymlink) {
	try {
		const operationPath = pathForWindowsFilesystem(absolutePath);
		return toResolvedKind(preserveFinalSymlink ? fs.lstatSync(operationPath) : fs.statSync(operationPath));
	} catch (error) {
		if (isNotFoundPathError(error)) return "missing";
		throw error;
	}
}
function toResolvedKind(stat) {
	if (stat.isFile()) return "file";
	if (stat.isDirectory()) return "directory";
	if (stat.isSymbolicLink()) return "symlink";
	return "other";
}
function relativeInsideRoot(rootPath, targetPath) {
	const relative = path.relative(resolvePathPreservingWindowsRoot(rootPath), resolvePathPreservingWindowsRoot(targetPath));
	if (!relative || relative === ".") return "";
	if (isPathRelativeEscape(relative)) return "";
	return relative;
}
function assertInsideBoundary(params) {
	const admitted = admitPathInsideRoot({
		rootPath: params.rootCanonicalPath,
		candidatePath: params.candidatePath,
		rootIdentity: params.rootIdentity
	});
	if (admitted) return admitted.path;
	throw new Error(`Path resolves outside ${params.boundaryLabel} (${shortPath(params.rootCanonicalPath)}): ${shortPath(params.absolutePath)}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/read-open-flags.js
function resolveReadOpenFlags(options) {
	const constants = options?.constants ?? fs.constants;
	const noFollow = process.platform !== "win32" && options?.followSymlinks !== true && typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
	const nonBlocking = process.platform !== "win32" && typeof constants.O_NONBLOCK === "number" ? constants.O_NONBLOCK : 0;
	return constants.O_RDONLY | noFollow | nonBlocking;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/exact-identity.js
/** Copy scalars from one observation; never try to recover rounded identity bits. */
function exactFileIdentity(stat) {
	const { dev, ino } = stat;
	if (typeof dev !== "bigint" && !Number.isSafeInteger(dev) || typeof ino !== "bigint" && !Number.isSafeInteger(ino)) throw new FsSafeError("path-mismatch", "file identity is not exact");
	return Object.freeze({
		dev: BigInt(dev),
		ino: BigInt(ino)
	});
}
/** Node stores unsigned libuv fields in a signed BigInt64Array. */
function numberStatScalar(value) {
	return typeof value === "bigint" ? Number(BigInt.asUintN(64, value)) : Number(value);
}
/** Legacy metadata view of the very same bigint observation. */
function numberStats(stat) {
	const result = Object.create(fs.Stats.prototype);
	for (const field of [
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
	]) result[field] = numberStatScalar(stat[field]);
	for (const field of [
		"atime",
		"mtime",
		"ctime",
		"birthtime"
	]) {
		const ns = stat[`${field}Ns`];
		const remainder = (ns % 1000000000n + 1000000000n) % 1000000000n;
		result[`${field}Ms`] = Number((ns - remainder) / 1000000000n) * 1e3 + Number(remainder) / 1e6;
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-symlink-policy.js
function readSymlinkResolution(symlinks) {
	return {
		rejectSymlinks: symlinks !== "follow-within-root" && symlinks !== "follow-parents-within-root",
		rejectFinalSymlink: symlinks === "follow-parents-within-root"
	};
}
function mutationSymlinkResolution(symlinks) {
	if (symlinks !== void 0 && symlinks !== "reject" && symlinks !== "follow-parents-within-root") throw new RangeError("mutationSymlinks must be reject or follow-parents-within-root");
	return {
		rejectSymlinks: symlinks === "reject",
		rejectFinalSymlink: symlinks !== void 0,
		resolveCanonical: symlinks !== void 0
	};
}
function assertFinalSymlinkRejected(targetPath, reject, details) {
	if (!reject) return;
	try {
		if (fs.lstatSync(targetPath).isSymbolicLink()) throw new FsSafeError("symlink", "final symlink not allowed", { details });
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-open.js
function isExpectedPathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function openPinnedFileSync(params) {
	const filePath = params.filePath;
	const resolvedPath = params.resolvedPath;
	const ioFs = params.ioFs ?? fs;
	const allowedType = params.allowedType ?? "file";
	const rejectPathSymlink = params.rejectPathSymlink === true;
	const statPolicy = {
		rejectHardlinks: params.rejectHardlinks,
		rejectLeafSymlinks: params.rejectLeafSymlinks,
		maxBytes: params.maxBytes
	};
	const openReadFlags = resolveReadOpenFlags({ constants: ioFs.constants });
	let fd = params.admittedFd ?? null;
	try {
		assertNoWindowsPathAlias(filePath, "filesystem", "file path uses a Windows filesystem namespace alias");
		if (resolvedPath !== void 0) assertNoWindowsPathAlias(resolvedPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(filePath)) return {
			ok: false,
			reason: "validation"
		};
		if (rejectPathSymlink) {
			if (ioFs.lstatSync(filePath).isSymbolicLink()) return {
				ok: false,
				reason: "validation"
			};
		}
		const realPath = resolvedPath ?? (ioFs === fs ? realpathSync$1(filePath) : ioFs.realpathSync(filePath));
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(realPath)) return {
			ok: false,
			reason: "validation"
		};
		const preOpenStat = inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		});
		fd ??= ioFs.openSync(realPath, openReadFlags);
		const identity = inspectFileIdentitySync(() => {
			const stat = ioFs.fstatSync(fd, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, preOpenStat);
		inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, identity);
		const admittedPath = params.finalAdmission?.({
			path: realPath,
			descriptorIdentity: identity
		}) ?? realPath;
		const openedStat = numberStats(identity);
		const opened = {
			ok: true,
			path: admittedPath,
			fd,
			stat: openedStat,
			identity
		};
		fd = null;
		return opened;
	} catch (error) {
		if (error instanceof FsSafeError) return {
			ok: false,
			reason: "validation",
			error
		};
		if (isExpectedPathError(error)) return {
			ok: false,
			reason: "path",
			error
		};
		return {
			ok: false,
			reason: "io",
			error
		};
	} finally {
		if (fd !== null) try {
			ioFs.closeSync(fd);
		} catch {}
	}
}
function assertAllowedStat(stat, allowedType, params) {
	if (stat.isSymbolicLink() && params.rejectLeafSymlinks) throw new FsSafeError("symlink", "symlink not allowed");
	if (stat.isSymbolicLink() || !(allowedType === "directory" ? stat.isDirectory() : stat.isFile())) throw new FsSafeError("not-file", "path does not have the required file type");
	if (params.rejectHardlinks && stat.isFile() && stat.nlink > 1n) throw new FsSafeError("hardlink", "path must not be hardlinked");
	if (params.maxBytes !== void 0 && stat.isFile() && stat.size > params.maxBytes) throw new FsSafeError("too-large", "file exceeds byte limit");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-file-final-admission.js
function rootIdentityMismatch(cause) {
	return new FsSafeError("path-mismatch", "canonical root directory identity changed or could not be verified", cause === void 0 ? {} : { cause });
}
function inspectCanonicalRoot(ioFs, rootPath, expected) {
	try {
		assertNoWindowsPathAlias(rootPath);
		const operationPath = ioFs === fs ? pathForWindowsFilesystem(rootPath) : rootPath;
		return inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(operationPath, { bigint: true });
			if (!stat.isDirectory() || stat.isSymbolicLink()) throw rootIdentityMismatch();
			return stat;
		}, expected);
	} catch (error) {
		if (expected && isExpectedPathError(error)) throw rootIdentityMismatch(error);
		throw error;
	}
}
function observeCanonicalRoot(ioFs, rootPath) {
	try {
		const stat = inspectCanonicalRoot(ioFs, rootPath);
		const identity = Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		});
		let observedPath = rootPath;
		if (process.platform === "win32" && ioFs === fs) {
			observedPath = realpathSync$1.native(pathForWindowsFilesystem(rootPath));
			if (observedPath !== rootPath) inspectCanonicalRoot(ioFs, observedPath, identity);
		}
		return {
			ok: true,
			path: observedPath,
			identity
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
function resolveConsumedPath(ioFs, filePath) {
	return ioFs === fs ? realpathSync$1.native(filePath) : ioFs.realpathSync(filePath);
}
function createRootFileFinalAdmission(ioFs, root, boundaryLabel, rejectHardlinks = true) {
	const inspectRoot = (candidateRootPath, expected) => {
		inspectCanonicalRoot(ioFs, candidateRootPath, expected);
	};
	return ({ path: consumedPath, descriptorIdentity }) => {
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		const canonicalPath = resolveConsumedPath(ioFs, consumedPath);
		assertNoWindowsPathAlias(canonicalPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
		const admitted = admitPathInsideRoot({
			rootPath: root.path,
			candidatePath: canonicalPath,
			rootIdentity: root.identity,
			inspectCandidateRoot: inspectRoot
		});
		if (!admitted) throw new FsSafeError("outside-workspace", `resolved path escapes ${boundaryLabel}`);
		try {
			const current = inspectFileIdentitySync(() => ioFs.lstatSync(admitted.path, { bigint: true }), descriptorIdentity);
			if (rejectHardlinks && current.isFile() && current.nlink > 1n) throw hardlinkedPathNotAllowedError();
		} catch (error) {
			if (isExpectedPathError(error)) throw new FsSafeError("path-mismatch", "canonical file identity changed or could not be verified", { cause: error });
			throw error;
		}
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		return admitted.path;
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-file.js
function canUseRootFileOpen(ioFs) {
	return typeof ioFs.openSync === "function" && typeof ioFs.closeSync === "function" && typeof ioFs.fstatSync === "function" && typeof ioFs.lstatSync === "function" && typeof ioFs.realpathSync === "function" && typeof ioFs.readFileSync === "function" && typeof ioFs.constants === "object" && ioFs.constants !== null;
}
function absoluteRootFilePath(filePath) {
	if (path.isAbsolute(filePath)) return filePath;
	const drive = path.parse(filePath).root;
	return `${drive ? path.resolve(drive) : process.cwd()}${path.sep}${filePath.slice(drive.length)}`;
}
function openRootFileSync(params) {
	const ioFs = params.ioFs ?? fs;
	const rawAbsolutePath = params.absolutePath;
	let resolved;
	try {
		const absolutePath = absoluteRootFilePath(rawAbsolutePath);
		assertNoWindowsPathAlias(absolutePath);
		const rootPath = params.rootPath;
		const rootRealPath = params.rootRealPath;
		const boundaryLabel = params.boundaryLabel;
		let rootObservation;
		resolved = mapResolvedRootPath(absolutePath, boundaryLabel, resolveRootPathSyncWithCanonicalRootObservation({
			absolutePath,
			rootPath,
			rootCanonicalPath: rootRealPath,
			boundaryLabel,
			...readSymlinkResolution(params.symlinks ?? (params.rejectSymlinks === false ? "follow-within-root" : "reject")),
			skipLexicalRootCheck: params.skipLexicalRootCheck
		}, (rootCanonicalPath) => {
			rootObservation = observeCanonicalRoot(ioFs, rootCanonicalPath);
		}), rootObservation);
	} catch (error) {
		resolved = toBoundaryValidationError(error);
	}
	return finalizeRootFileOpen({
		resolved,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs
	});
}
function finalizeRootFileOpen(params) {
	if ("ok" in params.resolved) return params.resolved;
	const resolved = params.resolved;
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const opened = openPinnedFileSync({
		filePath: resolved.absolutePath,
		resolvedPath: resolved.resolvedPath,
		rejectHardlinks,
		maxBytes: params.maxBytes,
		allowedType: params.allowedType,
		ioFs: params.ioFs,
		admittedFd: params.admittedFd,
		rejectLeafSymlinks: params.rejectLeafSymlinks,
		finalAdmission: createRootFileFinalAdmission(params.ioFs, resolved.rootObservation, resolved.boundaryLabel, rejectHardlinks)
	});
	if (!opened.ok) return opened;
	return {
		ok: true,
		path: opened.path,
		fd: opened.fd,
		stat: opened.stat,
		exactIdentity: exactFileIdentity(opened.identity),
		rootRealPath: resolved.rootRealPath
	};
}
function toBoundaryValidationError(error) {
	return {
		ok: false,
		reason: "validation",
		error
	};
}
function mapResolvedRootPath(absolutePath, boundaryLabel, resolved, rootObservation) {
	if (!rootObservation) return toBoundaryValidationError(new FsSafeError("path-mismatch", "canonical root identity was not observed"));
	if (!rootObservation.ok) return toRootObservationError(rootObservation.error);
	return {
		absolutePath,
		resolvedPath: resolved.canonicalPath,
		rootRealPath: rootObservation.path,
		boundaryLabel,
		rootObservation
	};
}
function toRootObservationError(error) {
	if (error instanceof FsSafeError) return toBoundaryValidationError(error);
	if (isExpectedPathError(error)) return {
		ok: false,
		reason: "path",
		error
	};
	return {
		ok: false,
		reason: "io",
		error
	};
}
//#endregion
//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function racePromiseWithAbortSignal(operation, signal, createError = (abortedSignal) => createAbortError("Operation aborted", { cause: abortedSignal.reason })) {
	const run = () => {
		try {
			return typeof operation === "function" ? operation() : operation;
		} catch (error) {
			return Promise.reject(error);
		}
	};
	if (!signal) return run();
	const abortError = () => createError(signal);
	if (signal.aborted) {
		const aborted = Promise.reject(abortError());
		return typeof operation === "function" ? aborted : Promise.race([aborted, operation]);
	}
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
	});
	return Promise.race([run(), aborted]).finally(() => {
		signal.removeEventListener("abort", onAbort);
	});
}
/** Bounds observation without cancelling work; a factory starts only after the timer is armed. */
async function raceWithTimeout(operation, timeoutMs, onTimeout, options = {}) {
	let timer;
	let onAbort;
	try {
		const deadline = new Promise((resolve, reject) => {
			const settle = (result) => {
				try {
					resolve(result());
				} catch (error) {
					reject(error);
				}
			};
			timer = setTimeout(() => settle(onTimeout), timeoutMs);
			if (options.ref === false) timer.unref?.();
			const signal = options.signal;
			if (signal) {
				onAbort = () => settle(() => {
					if (options.onAbort) return options.onAbort(signal);
					throw createAbortError("Operation aborted", { cause: signal.reason });
				});
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		let source;
		try {
			source = typeof operation === "function" ? operation() : operation;
		} catch (error) {
			deadline.catch(() => {});
			throw error;
		}
		return await Promise.race([source, deadline]);
	} finally {
		clearTimeout(timer);
		if (onAbort) options.signal?.removeEventListener("abort", onAbort);
	}
}
function resolveSleepDelayMs(ms) {
	return Number.isFinite(ms) && ms > 0 ? Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS) : 0;
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
	const delayMs = resolveSleepDelayMs(ms);
	if (delayMs === 0) return;
	await new Promise((resolve, reject) => {
		const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
		const timer = setTimeout(() => {
			cleanup();
			resolve();
		}, delayMs);
		const onAbort = () => {
			clearTimeout(timer);
			cleanup();
			reject(createAbortError("aborted", { cause: abortSignal?.reason ?? /* @__PURE__ */ new Error("aborted") }));
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		if (options.ref === false) timer.unref?.();
	});
}
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
const defaultSleep = async (ms) => {
	let remainingMs = ms;
	do {
		const delayMs = Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		remainingMs -= delayMs;
	} while (remainingMs > 0);
};
function clampNumber(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(Math.max(value, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(clampNumber(value, fallback)));
}
function resolveRetryDelayMs(value) {
	return Math.min(Math.max(Math.round(value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : fallback;
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))),
		jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
	};
}
function applyJitter(delayMs, jitter, mode, random) {
	if (jitter === "full") {
		if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (.5 + random() * .5)));
		return Math.max(0, Math.ceil(delayMs * (1 + random())));
	}
	if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
	const fraction = random();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createRetryRunner(runtime = {}) {
	const runtimeSleep = runtime.sleep ?? defaultSleep;
	const runtimeRandom = runtime.random ?? Math.random;
	const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
	return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
		const attemptErrors = [];
		const numeric = typeof attemptsOrOptions === "number";
		const options = typeof attemptsOrOptions === "number" ? { attempts: attemptsOrOptions } : attemptsOrOptions;
		const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
		const maxAttempts = resolved.attempts;
		const minDelayMs = resolved.minDelayMs;
		const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
		const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0)));
		const random = options.random ?? runtimeRandom;
		const sleep = options.sleep ?? runtimeSleep;
		const shouldRetry = options.shouldRetry ?? (() => true);
		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
			return await fn();
		} catch (err) {
			attemptErrors.push(err);
			if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
			if (numeric) {
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** (attempt - 1)));
				continue;
			}
			const context = {
				attempt,
				maxAttempts,
				err,
				label: options.label
			};
			const retryAfterMs = options.retryAfterMs?.(err);
			const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
			const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
			const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
			const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
			const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
			let delay = Math.min(baseDelay, delayCap);
			const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
			const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
			delay = applyJitter(delay, resolved.jitter, wantsPositiveDraw ? "positive" : "symmetric", random);
			delay = Math.min(Math.max(delay, minDelayMs), delayCap);
			await options.onRetry?.({
				...context,
				delayMs: delay
			});
			if (delay > 0) await sleep(delay);
		}
		throw createFailure(attemptErrors);
	};
}
createRetryRunner();
//#endregion
//#region src/infra/runtime-process-manifest.ts
function createRuntimeProcessEntrypoints(currentModuleUrl) {
	function runtimeProcessEntrypoint(modulePath) {
		return {
			currentModuleUrl,
			sourceWorkerName: modulePath.startsWith("infra/") ? modulePath.slice(6) : `../${modulePath}`,
			distWorkerPath: `${modulePath}.js`
		};
	}
	return {
		sqliteHeaderProbe: runtimeProcessEntrypoint("infra/sqlite-header-probe.worker"),
		postgresBridge: runtimeProcessEntrypoint("infra/postgres-sync/bridge.worker"),
		secretEgressProxy: runtimeProcessEntrypoint("secrets/egress-proxy/proxy.worker"),
		codeModeNode: runtimeProcessEntrypoint("agents/code-mode-node.worker"),
		cronReadOnly: runtimeProcessEntrypoint("cron/store/read-only.worker"),
		stateRead: runtimeProcessEntrypoint("state/openclaw-state-read.worker"),
		workerNativeLifecycle: runtimeProcessEntrypoint("infra/worker-native-lifecycle.worker"),
		spawnBroker: runtimeProcessEntrypoint("process/spawn-broker/worker"),
		cronStreamMatcher: runtimeProcessEntrypoint("gateway/cron-stream-matcher.worker"),
		controlUiFile: runtimeProcessEntrypoint("gateway/control-ui-file.worker"),
		publicSessionCard: runtimeProcessEntrypoint("gateway/control-ui-public-session-card.worker"),
		nodeBootstrapArtifact: runtimeProcessEntrypoint("gateway/worker-environments/node-bootstrap-artifact.worker"),
		nativeHookRelayClient: runtimeProcessEntrypoint("agents/harness/native-hook-relay-client.worker"),
		computerHost: runtimeProcessEntrypoint("gateway/desktop/computer.worker"),
		imageProcessor: runtimeProcessEntrypoint("media/image-processor.worker"),
		fileToolPlanning: runtimeProcessEntrypoint("agents/sessions/tools/file-tool-planning.worker"),
		fileToolRead: runtimeProcessEntrypoint("agents/sessions/tools/read-file.worker"),
		attachmentProcessor: runtimeProcessEntrypoint("media/attachment-processor.worker"),
		gitOperations: runtimeProcessEntrypoint("infra/git-operation.worker"),
		gitPackCleanup: runtimeProcessEntrypoint("agents/worktrees/git-pack-cleanup.worker"),
		fsSafeCopy: runtimeProcessEntrypoint("infra/fs-safe-copy.worker"),
		sharedStateStore: runtimeProcessEntrypoint("state/openclaw-state.worker"),
		authProfileInlineUsage: runtimeProcessEntrypoint("agents/auth-profiles/inline-usage.worker"),
		pluginModelCatalogCredentials: runtimeProcessEntrypoint("agents/plugin-model-catalog.worker"),
		agentDatabaseExecution: runtimeProcessEntrypoint("state/openclaw-agent-execution.worker"),
		workspaceMemory: runtimeProcessEntrypoint("worker/memory-worker-entry"),
		localAgentAvatar: runtimeProcessEntrypoint("agents/identity-avatar-file.worker"),
		identityFile: runtimeProcessEntrypoint("agents/identity-file.worker"),
		workspaceSkills: runtimeProcessEntrypoint("worker/skills-worker-entry"),
		skillsDiscovery: runtimeProcessEntrypoint("skills/runtime/discovery.worker"),
		boardStore: runtimeProcessEntrypoint("boards/sqlite-board-store.worker"),
		progressCardStore: runtimeProcessEntrypoint("session-cards/progress-card-store.worker"),
		sessionSharingStore: runtimeProcessEntrypoint("config/sessions/session-sharing-store.worker"),
		sessionForkDomain: runtimeProcessEntrypoint("config/sessions/session-fork-domain.worker"),
		sessionGoalOperations: runtimeProcessEntrypoint("config/sessions/goals-operations.worker"),
		sessionLifecyclePlanningDomain: runtimeProcessEntrypoint("config/sessions/session-lifecycle-projection.worker"),
		sessionMessageRewriteDomain: runtimeProcessEntrypoint("config/sessions/session-message-rewrite.worker"),
		sessionDiskBudget: runtimeProcessEntrypoint("config/sessions/disk-budget.worker"),
		heartbeatOutcomeStore: runtimeProcessEntrypoint("infra/heartbeat-outcome-store.worker"),
		acpParentStreamStore: runtimeProcessEntrypoint("agents/subagents/spawn/acp-parent-stream-store.worker"),
		messageToolRunOutcomeStore: runtimeProcessEntrypoint("infra/message-tool-run-outcome-store.worker"),
		contextEngineTurnOutbox: runtimeProcessEntrypoint("agents/harness/context-engine-turn-outbox.worker"),
		sqliteStore: runtimeProcessEntrypoint("infra/sqlite-store.worker"),
		sqliteWriterAdmission: runtimeProcessEntrypoint("infra/sqlite-writer-admission.worker"),
		agentSchemaInspection: runtimeProcessEntrypoint("state/openclaw-agent-schema-inspection.worker"),
		stateMigrationSnapshot: runtimeProcessEntrypoint("infra/state-migrations.snapshot.worker"),
		githubExec: runtimeProcessEntrypoint("agents/github-exec-launcher"),
		sqliteReadOnly: runtimeProcessEntrypoint("infra/sqlite-readonly-location.worker"),
		sqliteSnapshotStaging: runtimeProcessEntrypoint("infra/sqlite-snapshot-staging.worker"),
		sqliteReadOnlyNativeResource: runtimeProcessEntrypoint("infra/sqlite-readonly-native-resource"),
		sqliteSourceRevision: runtimeProcessEntrypoint("infra/sqlite-source-revision.worker"),
		sqliteIntegrity: runtimeProcessEntrypoint("infra/sqlite-integrity.worker"),
		sqliteCloseProbe: runtimeProcessEntrypoint("infra/bun-sqlite-close-probe.worker"),
		preparedModelCatalog: runtimeProcessEntrypoint("agents/prepared-model-catalog.worker"),
		providerPromptState: runtimeProcessEntrypoint("agents/embedded-agent-runner/provider-prompt-state.worker"),
		updateRepair: runtimeProcessEntrypoint("infra/update-repair.worker"),
		immutableBuild: runtimeProcessEntrypoint("infra/update-immutable-build.worker"),
		updateMigratedFinalize: runtimeProcessEntrypoint("infra/update-migrated-finalize.worker"),
		updateCandidateState: runtimeProcessEntrypoint("infra/update-candidate-state.worker"),
		doctorLint: runtimeProcessEntrypoint("commands/doctor-lint.worker"),
		doctor: runtimeProcessEntrypoint("commands/doctor.worker"),
		databaseVerify: runtimeProcessEntrypoint("state/openclaw-database-verify.worker"),
		stateOwnership: runtimeProcessEntrypoint("state/openclaw-state-ownership.worker"),
		stateLeaseHeartbeat: runtimeProcessEntrypoint("state/openclaw-state-lease-heartbeat.worker"),
		gatewayStateOwnerHeartbeat: runtimeProcessEntrypoint("infra/gateway-state-owner-heartbeat.worker"),
		sessionTranscriptArchive: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-archive.worker"),
		sessionTranscript: runtimeProcessEntrypoint("config/sessions/session-transcript.worker"),
		workerTranscriptCommit: runtimeProcessEntrypoint("gateway/worker-environments/transcript-commit.worker"),
		sessionManagerMetadata: runtimeProcessEntrypoint("agents/sessions/session-manager-metadata.worker"),
		sessionTranscriptProjectionPublication: runtimeProcessEntrypoint("config/sessions/session-transcript-projection-publication.worker"),
		sessionTranscriptReports: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-transcript-reports.worker"),
		sessionTranscriptReconcile: runtimeProcessEntrypoint("config/sessions/session-transcript-reconcile.worker"),
		tailscaleRouteOwner: runtimeProcessEntrypoint("infra/tailscale-route-owner.worker"),
		serviceChildRelay: runtimeProcessEntrypoint("process/supervisor/service-child-relay"),
		terminalPty: runtimeProcessEntrypoint("process/terminal-pty-worker"),
		serviceChildGroupAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-group-anchor"),
		serviceChildWindowsJobAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-windows-job-anchor"),
		bunSqliteLibrary: runtimeProcessEntrypoint("infra/bun-sqlite-library")
	};
}
//#endregion
export { fileNotFoundError as $, isNativeDirectoryObservationGuard as A, requireNativeBinding as At, assertDirectoryObservationSync as B, recordFileObservationFailure as Bt, resolveExistingAncestor as C, resolvePathFromBasePreservingWindowsRoot as Ct, sameNormalizedPathSpelling as D, assertNativeCapabilities as Dt, admitPathInsideRoot as E, assertWindowsHelperAllowed as Et, shortPath as F, captureNativeFdClose as Ft, extendDirectoryObservationGuard as G, sameFileIdentityForCleanup as Gt, captureDirectoryGuard as H, hasSafeFileIdentity as Ht, assertAsyncDirectoryGuard as I, inspectFileIdentity as It, inspectDirectoryObservationSync as J, inspectDirectoryIdentity as K, sha256Hex as Kt, assertDirectoryGuard as L, inspectFileIdentitySync as Lt, statIdentityFromNative as M, getFsSafeNativeConfig as Mt, isRootPathEscapeError as N, getNativeModeSetting as Nt, getNativeDirectoryObservationBackend as O, getNativeBinding as Ot, formatErrorDetail as P, isFsSafeNativeRequired as Pt, errorCauseOptions as Q, assertDirectoryIdentitySync as R, fileObservation as Rt, absolutePathWithRawSegments as S, pathForWindowsFilesystem as St, resolvePathViaExistingAncestorSync as T, realpathSync$1 as Tt, createAsyncDirectoryGuard as U, identityFromReceipt as Ut, assertSyncDirectoryGuard as V, FsSafeError as Vt, createNearestExistingDirectoryGuard as W, sameFileIdentity as Wt, inspectStatObservationSync as X, assertStatObservationSync as Y, directoryComponentNotDirectoryError as Z, resolveRootPath as _, WINDOWS_RESERVED_DEVICE_NAMES as _t, sleepWithAbort as a, normalizeRemovePathError as at, resolveRootPathWithObservation as b, anchorWindowsDriveRelativePath as bt, openRootFileSync as c, assertNoNulPathInput as ct, readSymlinkResolution as d, isPathInside as dt, hardlinkedPathNotAllowedError as et, exactFileIdentity as f, isPathRelativeEscape as ft, ROOT_PATH_ALIAS_POLICIES as g, isSafePathSegment as gt, resolveReadOpenFlags as h, isDriveRelativePath as ht, raceWithTimeout as i, normalizeRemoveGuardError as it, isNativeStatIdentity as j, selectNativeBinding as jt, inspectNativeDirectoryObservation as k, getNativeFallbackDiagnostic as kt, assertFinalSymlinkRejected as l, hasNodeErrorCode as lt, numberStats as m, normalizeWindowsPathForComparison as mt, createRetryRunner as n, normalizePinnedPathError as nt, toRetryError as o, outsideWorkspaceError as ot, numberStatScalar as p, isSymlinkOpenError as pt, inspectDirectoryIdentitySync as q, racePromiseWithAbortSignal as r, normalizePinnedWriteError as rt, canUseRootFileOpen as s, rootPathChangedError as st, createRuntimeProcessEntrypoints as t, isAlreadyExistsError as tt, mutationSymlinkResolution as u, isNotFoundPathError as ut, resolveRootPathForRemoval as v, assertNoUnsafeDeviceReadPath as vt, resolvePathViaExistingAncestor as w, resolvePathPreservingWindowsRoot as wt, RootPathObservationError as x, assertNoWindowsPathAlias as xt, resolveRootPathSync as y, isWindowsReservedDeviceName as yt, assertDirectoryObservationGuardSync as z, isFileObservationFailure as zt };
