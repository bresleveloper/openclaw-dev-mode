import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
//#region src/infra/update-candidate-files.ts
function ignoreMissingUpdateCandidateFile(error) {
	if (hasNodeErrorCode(error, "ENOENT")) return;
	throw error;
}
//#endregion
export { ignoreMissingUpdateCandidateFile as t };
