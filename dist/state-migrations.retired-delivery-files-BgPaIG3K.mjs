import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as resolveLegacyMigrationSourcePath } from "./state-migrations.source-path-Dt78NFQz.mjs";
import { r as createRetiredStateInspectionError } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.retired-delivery-files.ts
function listRetiredDeliveryQueueFiles(stateDir) {
	return ["delivery-queue", "session-delivery-queue"].flatMap((name) => [path.join(stateDir, name), path.join(stateDir, name, "failed")].flatMap((directory) => {
		let entries;
		try {
			entries = fs.readdirSync(directory, { withFileTypes: true });
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) try {
				fs.lstatSync(directory);
			} catch (inspectionError) {
				if (hasErrnoCode(inspectionError, "ENOENT")) return [];
				throw createRetiredStateInspectionError(directory, inspectionError);
			}
			throw createRetiredStateInspectionError(directory, error);
		}
		return entries.filter((entry) => {
			const source = resolveLegacyMigrationSourcePath(entry.name);
			return !entry.isDirectory() && (source.endsWith(".json") || source.endsWith(".delivered"));
		}).map((entry) => path.join(directory, entry.name));
	}));
}
//#endregion
export { listRetiredDeliveryQueueFiles as t };
