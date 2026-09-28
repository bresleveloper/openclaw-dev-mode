import { n as pluginSecretRefSetup } from "./secret-ref-runtime-B0T63SP-.mjs";
import path from "node:path";
//#region extensions/onepassword/onepassword-op-path.js
function errorCode(error) {
	return error && typeof error === "object" && "code" in error ? error.code : void 0;
}
const resolveTrustedExecutablePath = pluginSecretRefSetup.resolveTrustedExecutablePath;
async function resolveTrustedOnePasswordCli(options = {}) {
	const configuredPath = options.configuredPath?.trim();
	if (configuredPath && !path.isAbsolute(configuredPath)) throw new Error(`1Password CLI path must be absolute: ${configuredPath}`);
	const executable = process.platform === "win32" ? "op.exe" : "op";
	const candidates = configuredPath ? [configuredPath] : (options.pathEnv ?? process.env.PATH ?? "").split(path.delimiter).filter(Boolean).map((directory) => path.resolve(directory, executable));
	let unsafeError;
	for (const candidate of candidates) try {
		return await resolveTrustedExecutablePath(candidate);
	} catch (error) {
		if (errorCode(error) === "ENOENT" || errorCode(error) === "ENOTDIR") continue;
		unsafeError = new Error(`Refusing unsafe 1Password CLI path "${candidate}": ${error instanceof Error ? error.message : String(error)}`, { cause: error });
		if (configuredPath) throw unsafeError;
	}
	if (unsafeError) throw unsafeError;
}
//#endregion
export { resolveTrustedOnePasswordCli as t };
