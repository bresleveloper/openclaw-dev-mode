import { createRequire } from "node:module";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import path from "node:path";
import fs from "node:fs";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/matrix/src/matrix/deps.ts
const REQUIRED_MATRIX_PACKAGES = [
	"matrix-js-sdk",
	"@matrix-org/matrix-sdk-crypto-nodejs",
	"@matrix-org/matrix-sdk-crypto-wasm"
];
const MIN_MATRIX_CRYPTO_NATIVE_BINDING_BYTES = 1e6;
const MATRIX_COMMAND_OUTPUT_TAIL_BYTES = 65536;
function resolveMissingMatrixPackages(resolveFn) {
	const resolve = resolveFn ?? defaultResolveFn;
	return REQUIRED_MATRIX_PACKAGES.filter((pkg) => {
		try {
			resolve(pkg);
			return false;
		} catch {
			return true;
		}
	});
}
function isMatrixSdkAvailable() {
	return resolveMissingMatrixPackages().length === 0;
}
let defaultMatrixCryptoRuntimeEnsurePromise = null;
const defaultRequireFn = createRequire(import.meta.url);
const defaultResolveFn = defaultRequireFn.resolve;
function isMissingMatrixCryptoRuntimeError(error) {
	const message = formatErrorMessage(error);
	return message.includes("@matrix-org/matrix-sdk-crypto-nodejs-") || message.includes("matrix-sdk-crypto-nodejs") || message.includes("download-lib.js");
}
function isMuslRuntime() {
	try {
		return !(process.report?.getReport?.())?.header?.glibcVersionRuntime;
	} catch {
		return true;
	}
}
function resolveMatrixCryptoNativeBindingFilename() {
	switch (process.platform) {
		case "darwin": return ["arm64", "x64"].includes(process.arch) ? `matrix-sdk-crypto.darwin-${process.arch}.node` : null;
		case "linux":
			if (process.arch === "x64") return `matrix-sdk-crypto.linux-x64-${isMuslRuntime() ? "musl" : "gnu"}.node`;
			if (process.arch === "arm64" && !isMuslRuntime()) return "matrix-sdk-crypto.linux-arm64-gnu.node";
			if (process.arch === "arm") return "matrix-sdk-crypto.linux-arm-gnueabihf.node";
			if (process.arch === "s390x") return "matrix-sdk-crypto.linux-s390x-gnu.node";
			return null;
		case "win32": return [
			"x64",
			"ia32",
			"arm64"
		].includes(process.arch) ? `matrix-sdk-crypto.win32-${process.arch}-msvc.node` : null;
		default: return null;
	}
}
function resolveMatrixCryptoNativeBindingPath() {
	const filename = resolveMatrixCryptoNativeBindingFilename();
	if (!filename) return null;
	try {
		return path.join(path.dirname(defaultResolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js")), filename);
	} catch {
		return null;
	}
}
function removeIncompleteMatrixCryptoNativeBinding(bindingPath) {
	if (!bindingPath) return;
	try {
		const stat = fs.statSync(bindingPath);
		if (!stat.isFile() || stat.size >= MIN_MATRIX_CRYPTO_NATIVE_BINDING_BYTES) return;
		fs.unlinkSync(bindingPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
async function ensureMatrixCryptoRuntime() {
	defaultMatrixCryptoRuntimeEnsurePromise ??= ensureMatrixCryptoRuntimeOnce().catch((error) => {
		defaultMatrixCryptoRuntimeEnsurePromise = null;
		throw error;
	});
	await defaultMatrixCryptoRuntimeEnsurePromise;
}
async function ensureMatrixCryptoRuntimeOnce() {
	const nativeBindingPath = resolveMatrixCryptoNativeBindingPath();
	removeIncompleteMatrixCryptoNativeBinding(nativeBindingPath);
	try {
		defaultRequireFn("@matrix-org/matrix-sdk-crypto-nodejs");
		return;
	} catch (err) {
		if (!isMissingMatrixCryptoRuntimeError(err)) throw err;
	}
	const scriptPath = defaultResolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js");
	let failure;
	try {
		const result = await runCommandWithTimeout([process.execPath, scriptPath], {
			cwd: path.dirname(scriptPath),
			env: { COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
			killProcessTree: true,
			maxOutputBytes: MATRIX_COMMAND_OUTPUT_TAIL_BYTES,
			outputCapture: "tail",
			timeoutMs: 3e5
		});
		const timedOut = result.termination === "timeout";
		if (timedOut || (result.code ?? 1) !== 0) failure = (result.stderr || (timedOut ? "command timed out after 300000ms" : "")).trim() || result.stdout.trim();
	} catch (error) {
		failure = (error instanceof Error ? error.message : String(error)).trim();
	}
	removeIncompleteMatrixCryptoNativeBinding(nativeBindingPath);
	if (failure !== void 0) throw new Error(failure || "Matrix crypto runtime bootstrap failed.");
	defaultRequireFn("@matrix-org/matrix-sdk-crypto-nodejs");
}
async function ensureMatrixSdkInstalled(params) {
	const missing = resolveMissingMatrixPackages(params?.resolveFn);
	if (missing.length === 0) return;
	throw new Error(`Matrix plugin dependencies are missing: ${missing.join(", ")}. Repair this plugin with \`openclaw plugins update matrix\` or run \`openclaw doctor --fix\`.`);
}
//#endregion
export { ensureMatrixSdkInstalled as n, isMatrixSdkAvailable as r, ensureMatrixCryptoRuntime as t };
