import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/is-main.ts
function normalizePathCandidate(candidate, cwd) {
	if (!candidate) return;
	const resolved = path.resolve(cwd, candidate);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		return resolved;
	}
}
/** Detects whether a module is executing as the process entrypoint, including wrapper launches. */
function isMainModule({ currentFile, argv = process.argv, env = process.env, cwd, wrapperEntryPairs = [] }) {
	const resolvedCwd = cwd ?? tryProcessCwd() ?? path.dirname(currentFile);
	const normalizedCurrent = normalizePathCandidate(currentFile, resolvedCwd);
	const normalizedArgv1 = normalizePathCandidate(argv[1], resolvedCwd);
	if (normalizedCurrent && normalizedArgv1 && normalizedCurrent === normalizedArgv1) return true;
	const normalizedPmExecPath = normalizePathCandidate(env.pm_exec_path, resolvedCwd);
	if (normalizedCurrent && normalizedPmExecPath && normalizedCurrent === normalizedPmExecPath) return true;
	if (normalizedCurrent && normalizedArgv1 && wrapperEntryPairs.length > 0) {
		const currentBase = path.basename(normalizedCurrent);
		const argvBase = path.basename(normalizedArgv1);
		return wrapperEntryPairs.some(({ wrapperBasename, entryBasename }) => currentBase === entryBasename && argvBase === wrapperBasename);
	}
	return false;
}
//#endregion
export { isMainModule as t };
