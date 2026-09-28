import path from "node:path";
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
function formatCwdRelativePathOrAbsolute(targetPath, samePathFallback) {
	const cwd = tryProcessCwd();
	return cwd ? path.relative(cwd, targetPath) || samePathFallback : targetPath;
}
//#endregion
export { tryProcessCwd as n, formatCwdRelativePathOrAbsolute as t };
