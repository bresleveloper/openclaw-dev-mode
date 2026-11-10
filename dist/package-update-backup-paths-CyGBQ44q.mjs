//#region src/infra/package-update-backup-paths.ts
function isLegacyPackageBackupName(name) {
	return /^\.openclaw[.-]package-backup-\d+-\d+$/u.test(name);
}
function isPackageUpdateRecoveryArtifactName(name) {
	return /^\.openclaw[.-]package-(?:backup-|activation-)/u.test(name);
}
//#endregion
export { isPackageUpdateRecoveryArtifactName as n, isLegacyPackageBackupName as t };
