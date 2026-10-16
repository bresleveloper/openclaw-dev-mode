import { i as sha256FileSync } from "./crypto-digest-y6oZN-_F.mjs";
import fs from "node:fs";
//#region src/infra/state-migrations.storage.ts
function archiveLegacyFileSource(params) {
	try {
		let sourceSha256;
		for (let index = 1;; index++) {
			const targetPath = index === 1 ? `${params.sourcePath}.migrated` : `${params.sourcePath}.migrated.${index}`;
			if (!fs.existsSync(targetPath)) {
				fs.renameSync(params.sourcePath, targetPath);
				return {
					targetPath,
					action: "archived"
				};
			}
			if (params.deduplicate === false) continue;
			sourceSha256 ??= sha256FileSync(params.sourcePath);
			if (sourceSha256 === sha256FileSync(targetPath)) {
				fs.rmSync(params.sourcePath, { force: true });
				return {
					targetPath,
					action: "removed"
				};
			}
		}
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} ${params.sourcePath}: ${String(err)}`);
		return null;
	}
}
function archiveLegacyImportSource(params) {
	try {
		fs.chmodSync(params.sourcePath, 384);
	} catch (err) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
		return null;
	}
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: `${params.label} legacy source`,
		warnings: params.warnings,
		deduplicate: params.deduplicate
	});
	if (!resolution) return null;
	if (resolution.action === "archived") try {
		fs.chmodSync(resolution.targetPath, 384);
	} catch (err) {
		params.warnings.push(`Failed securing archived ${params.label} legacy source: ${String(err)}`);
	}
	params.changes.push(resolution.action === "removed" ? `Removed already-archived ${params.label} legacy source ${params.sourcePath}` : `Archived ${params.label} legacy source → ${resolution.targetPath}`);
	return resolution;
}
//#endregion
export { archiveLegacyImportSource as t };
