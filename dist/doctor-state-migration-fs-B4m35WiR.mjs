import fs from "node:fs/promises";
import path from "node:path";
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
* doctor changes/warnings lists. An optional archive directory confines all collision
* suffixes to a declared migration backup resource, refusing symbolic-link sources
* rather than changing their relative target. Never throws: a failed archive leaves
* the source in place so a later doctor run can retry without losing migrated data.
*/
async function archiveLegacyStateSource(params) {
	const archiveBase = params.archiveDirectory ? path.join(params.archiveDirectory, path.basename(params.filePath)) : params.filePath;
	let archivedPath = `${archiveBase}.migrated`;
	try {
		if (params.archiveDirectory) {
			if ((await fs.lstat(params.filePath)).isSymbolicLink()) throw new Error("Cannot move a symbolic-link legacy source into an archive directory");
			await fs.mkdir(params.archiveDirectory, { recursive: true });
		}
		if (await legacyStateFileExists(archivedPath)) {
			const [sourceBytes, archiveBytes] = await Promise.all([fs.readFile(params.filePath), fs.readFile(archivedPath)]);
			if (sourceBytes.equals(archiveBytes)) {
				await fs.rm(params.filePath, { force: true });
				params.changes.push(`Removed already-archived ${params.label} legacy source ${params.filePath}`);
				return;
			}
			for (let index = 2;; index++) {
				archivedPath = `${archiveBase}.migrated.${index}`;
				if (!await legacyStateFileExists(archivedPath)) break;
			}
		}
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived ${params.label} legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} legacy source: ${String(err)}`);
	}
}
//#endregion
export { legacyStateFileExists as n, archiveLegacyStateSource as t };
