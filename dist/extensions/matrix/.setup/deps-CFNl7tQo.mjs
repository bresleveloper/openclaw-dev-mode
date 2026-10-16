import { createRequire } from "node:module";
import path from "node:path";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
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
		case "darwin": return process.arch === "arm64" ? "matrix-sdk-crypto.darwin-arm64.node" : process.arch === "x64" ? "matrix-sdk-crypto.darwin-x64.node" : null;
		case "linux":
			if (process.arch === "x64") return isMuslRuntime() ? "matrix-sdk-crypto.linux-x64-musl.node" : "matrix-sdk-crypto.linux-x64-gnu.node";
			if (process.arch === "arm64" && !isMuslRuntime()) return "matrix-sdk-crypto.linux-arm64-gnu.node";
			if (process.arch === "arm") return "matrix-sdk-crypto.linux-arm-gnueabihf.node";
			if (process.arch === "s390x") return "matrix-sdk-crypto.linux-s390x-gnu.node";
			return null;
		case "win32": return process.arch === "x64" ? "matrix-sdk-crypto.win32-x64-msvc.node" : process.arch === "ia32" ? "matrix-sdk-crypto.win32-ia32-msvc.node" : process.arch === "arm64" ? "matrix-sdk-crypto.win32-arm64-msvc.node" : null;
		default: return null;
	}
}
function resolveMatrixCryptoNativeBindingPath(resolveFn) {
	const filename = resolveMatrixCryptoNativeBindingFilename();
	if (!filename) return null;
	try {
		return path.join(path.dirname(resolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js")), filename);
	} catch {
		return null;
	}
}
function removeIncompleteMatrixCryptoNativeBinding(params) {
	const bindingPath = params.bindingPath;
	if (!bindingPath) return;
	try {
		const stat = fs.statSync(bindingPath);
		if (!stat.isFile() || stat.size >= MIN_MATRIX_CRYPTO_NATIVE_BINDING_BYTES) return;
		fs.unlinkSync(bindingPath);
		params.log?.(`matrix: removed incomplete native crypto runtime (${stat.size} bytes); it will be downloaded again`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
async function ensureMatrixCryptoRuntime(params = {}) {
	const usesDefaultRuntime = !params.requireFn && !params.resolveFn;
	if (usesDefaultRuntime && defaultMatrixCryptoRuntimeEnsurePromise) {
		await defaultMatrixCryptoRuntimeEnsurePromise;
		return;
	}
	const ensurePromise = ensureMatrixCryptoRuntimeOnce(params);
	if (!usesDefaultRuntime) {
		await ensurePromise;
		return;
	}
	defaultMatrixCryptoRuntimeEnsurePromise = ensurePromise.catch((error) => {
		defaultMatrixCryptoRuntimeEnsurePromise = null;
		throw error;
	});
	await defaultMatrixCryptoRuntimeEnsurePromise;
}
async function ensureMatrixCryptoRuntimeOnce(params) {
	const resolveFn = params.resolveFn ?? defaultResolveFn;
	const nativeBindingPath = resolveMatrixCryptoNativeBindingPath(resolveFn);
	removeIncompleteMatrixCryptoNativeBinding({
		bindingPath: nativeBindingPath,
		log: params.log
	});
	const requireFn = params.requireFn ?? defaultRequireFn;
	try {
		requireFn("@matrix-org/matrix-sdk-crypto-nodejs");
		return;
	} catch (err) {
		if (!isMissingMatrixCryptoRuntimeError(err)) throw err;
	}
	const scriptPath = resolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js");
	params.log?.("matrix: bootstrapping native crypto runtime");
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
	removeIncompleteMatrixCryptoNativeBinding({
		bindingPath: nativeBindingPath,
		log: params.log
	});
	if (failure !== void 0) throw new Error(failure || "Matrix crypto runtime bootstrap failed.");
	requireFn("@matrix-org/matrix-sdk-crypto-nodejs");
}
async function ensureMatrixSdkInstalled(params) {
	const missing = resolveMissingMatrixPackages(params?.resolveFn);
	if (missing.length === 0) return;
	throw new Error(`Matrix plugin dependencies are missing: ${missing.join(", ")}. Repair this plugin with \`openclaw plugins update matrix\` or run \`openclaw doctor --fix\`.`);
}
//#endregion
export { ensureMatrixSdkInstalled as n, isMatrixSdkAvailable as r, ensureMatrixCryptoRuntime as t };
