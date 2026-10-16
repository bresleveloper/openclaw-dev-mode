import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as createRetiredStateInspectionError } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/state-migrations.retired-cron-files.ts
async function listRetiredCronStateFiles(storePath) {
	const resolved = path.resolve(storePath);
	const paths = [resolved, resolved.endsWith(".json") ? resolved.replace(/\.json$/, "-state.json") : `${resolved}-state.json`];
	const runsDir = path.join(path.dirname(resolved), "runs");
	try {
		const entry = (await fs.readdir(runsDir)).find((name) => name.endsWith(".jsonl"));
		if (entry) paths.push(path.join(runsDir, entry));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) try {
			await fs.lstat(runsDir);
		} catch (inspectionError) {
			if (hasErrnoCode(inspectionError, "ENOENT")) return paths;
			throw createRetiredStateInspectionError(runsDir, inspectionError);
		}
		throw createRetiredStateInspectionError(runsDir, error);
	}
	return paths;
}
//#endregion
export { listRetiredCronStateFiles as t };
