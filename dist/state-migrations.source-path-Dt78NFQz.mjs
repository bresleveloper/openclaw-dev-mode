//#region src/infra/state-migrations.source-path.ts
/** Imports and receipts keep the original name across an interrupted cleanup claim. */
function resolveLegacyMigrationSourcePath(filePath) {
	return filePath.replace(/\.doctor-importing(?:-\d+-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})?$/, "");
}
//#endregion
export { resolveLegacyMigrationSourcePath as t };
