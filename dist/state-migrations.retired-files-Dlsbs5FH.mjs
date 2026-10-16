import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import fs from "node:fs";
//#region src/infra/state-migrations.retired-files.ts
var RetiredStateFormatError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "RetiredStateFormatError";
	}
};
function createRetiredStateInspectionError(filePath, cause) {
	return new RetiredStateFormatError(`Cannot inspect potentially retired state at ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}. The files were left unchanged. Correct the source path or restore access, then retry the upgrade.`, { cause });
}
function assertNoRetiredStateFiles(label, paths) {
	const existing = paths.filter((filePath) => {
		try {
			fs.lstatSync(filePath);
			return true;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return false;
			throw createRetiredStateInspectionError(filePath, error);
		}
	});
	if (existing.length === 0) return;
	throw new RetiredStateFormatError(`${label}: retired files whose last writer predates July 1, 2026: ${existing.join(", ")}. The files were left unchanged. Upgrade through OpenClaw 2026.9.7, run "${formatCliCommand("openclaw doctor --fix")}" on the original host, then retry this upgrade.`);
}
//#endregion
export { assertNoRetiredStateFiles as n, createRetiredStateInspectionError as r, RetiredStateFormatError as t };
