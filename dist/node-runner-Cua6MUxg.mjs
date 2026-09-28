import path from "node:path";
//#region src/cli/update-cli/node-runner.ts
function resolveNodeRunner() {
	const base = path.basename(process.execPath).trim().toLowerCase();
	return base === "node" || base === "node.exe" ? process.execPath : "node";
}
//#endregion
export { resolveNodeRunner as t };
