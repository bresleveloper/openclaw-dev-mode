import { _ as normalizeUniqueTrimmedStringList, p as normalizeTrimmedStringList, v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
//#region src/infra/exec-safe-bin-config.ts
function normalizeConfiguredSafeBins(entries) {
	return sortUniqueStrings(normalizeTrimmedStringList(entries).map((entry) => entry.toLowerCase()));
}
function normalizeConfiguredTrustedSafeBinDirs(entries) {
	return normalizeUniqueTrimmedStringList(entries);
}
//#endregion
export { normalizeConfiguredTrustedSafeBinDirs as n, normalizeConfiguredSafeBins as t };
