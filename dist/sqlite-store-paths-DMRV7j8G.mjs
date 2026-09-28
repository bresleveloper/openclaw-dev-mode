import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region extensions/workboard/src/sqlite-store-paths.ts
const WORKBOARD_DB_RELATIVE_PATH = [
	"plugins",
	"workboard",
	"workboard.sqlite"
];
function resolveWorkboardSqlitePath(env = process.env) {
	return path.join(resolveStateDir(env), ...WORKBOARD_DB_RELATIVE_PATH);
}
function resolveWorkboardSqliteWorkerModuleUrl(runtimeSource) {
	if (!runtimeSource) throw new Error("Workboard requires runtime entrypoint metadata");
	return new URL(`./src/sqlite-store.worker${path.extname(runtimeSource)}`, pathToFileURL(runtimeSource));
}
//#endregion
export { resolveWorkboardSqliteWorkerModuleUrl as n, resolveWorkboardSqlitePath as t };
