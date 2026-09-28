import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.mjs";
import { a as resolveExecutableFromPathEnv, n as isExecutableFile } from "./executable-path-BMRdcL7i.mjs";
import path from "node:path";
//#region src/infra/detect-binary.ts
/** Return true when a safe executable name/path can be found on this host. */
async function detectBinary(name) {
	if (!name?.trim()) return false;
	if (!isSafeExecutableValue(name)) return false;
	const resolved = name.startsWith("~") ? resolveUserPath(name) : name;
	if (path.isAbsolute(resolved) || resolved.startsWith(".") || resolved.includes("/") || resolved.includes("\\")) return isExecutableFile(resolved);
	try {
		const cwd = process.cwd();
		const pathEnv = resolveEnvironmentValue(process.env, "PATH") ?? "";
		const searchPath = process.platform === "win32" ? `${cwd};${pathEnv}` : pathEnv;
		const extension = process.platform === "win32" ? path.extname(name) : "";
		const lookupEnv = extension ? { PATHEXT: extension } : process.env;
		return Boolean(resolveExecutableFromPathEnv(name, searchPath, lookupEnv, {
			cwd,
			useCache: false
		}));
	} catch {
		return false;
	}
}
//#endregion
export { detectBinary as t };
