import { n as getSealedRuntimeSecureTempRoot } from "./sealed-runtime-registry-DDnWdfsn.mjs";
//#region src/infra/tmp-openclaw-dir.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	const injected = getSealedRuntimeSecureTempRoot();
	if (injected) {
		resolveSecureTempRootRuntime = injected;
		return injected;
	}
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	if (typeof process.getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = process.getBuiltinModule("module").createRequire(import.meta.url)("@openclaw/fs-safe/secure-temp-root").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredOpenClawTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: options.preferredDir ?? "/tmp/openclaw",
		fallbackPrefix: "openclaw",
		warningPrefix: "[openclaw]",
		unsafeFallbackLabel: "OpenClaw temp dir",
		skipPreferredOnWindows: true
	});
}
//#endregion
export { resolvePreferredOpenClawTmpDir as n, DEFAULT_POSIX_TMP_ROOT as t };
