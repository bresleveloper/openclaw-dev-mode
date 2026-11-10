import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveEnvironmentValue } from "./process-env-BNjOnVtu.mjs";
import { a as resolveExecutableFromPathEnv, n as isExecutableFile } from "./executable-path-hXcbMo0b.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-2Pps-JeG.mjs";
import path from "node:path";
//#region src/infra/detect-binary.ts
/** Return true when a safe executable name/path can be found on this host. */
async function detectBinary(name) {
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
