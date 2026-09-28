import fs from "node:fs/promises";
//#region src/plugins/doctor-state-migration-fs.ts
/** True when the legacy-state path exists and is a regular file. */
async function legacyStateFileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
/**
* Renames a migrated legacy source to `<path>.migrated`, recording the outcome in the
* doctor changes/warnings lists. Never throws: a failed archive leaves the source in
* place so a later doctor run can retry without losing migrated data.
*/
async function archiveLegacyStateSource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	try {
		if (await legacyStateFileExists(archivedPath)) {
			const [sourceBytes, archiveBytes] = await Promise.all([fs.readFile(params.filePath), fs.readFile(archivedPath)]);
			if (sourceBytes.equals(archiveBytes)) {
				await fs.rm(params.filePath, { force: true });
				params.changes.push(`Removed already-archived ${params.label} legacy source ${params.filePath}`);
				return;
			}
			const nextArchivePath = await firstFreeArchivePath(params.filePath);
			await fs.rename(params.filePath, nextArchivePath);
			params.changes.push(`Archived ${params.label} legacy source -> ${nextArchivePath}`);
			return;
		}
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived ${params.label} legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} legacy source: ${String(err)}`);
	}
}
async function firstFreeArchivePath(sourcePath) {
	for (let index = 2;; index++) {
		const candidate = `${sourcePath}.migrated.${index}`;
		if (!await legacyStateFileExists(candidate)) return candidate;
	}
}
//#endregion
export { legacyStateFileExists as n, archiveLegacyStateSource as t };
