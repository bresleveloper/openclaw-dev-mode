import { i as sha256FileSync } from "./crypto-digest-y6oZN-_F.mjs";
import fs from "node:fs";
//#region src/infra/state-migrations.storage.ts
function archiveLegacyImportSource(params) {
	try {
		fs.chmodSync(params.sourcePath, 384);
	} catch (err) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
		return;
	}
	try {
		let sourceSha256;
		for (let index = 1;; index++) {
			const targetPath = index === 1 ? `${params.sourcePath}.migrated` : `${params.sourcePath}.migrated.${index}`;
			if (!fs.existsSync(targetPath)) {
				fs.renameSync(params.sourcePath, targetPath);
				try {
					fs.chmodSync(targetPath, 384);
				} catch (err) {
					params.warnings.push(`Failed securing archived ${params.label} legacy source: ${String(err)}`);
				}
				params.changes.push(`Archived ${params.label} legacy source → ${targetPath}`);
				return;
			}
			if (params.deduplicate === false) continue;
			sourceSha256 ??= sha256FileSync(params.sourcePath);
			if (sourceSha256 === sha256FileSync(targetPath)) {
				fs.rmSync(params.sourcePath, { force: true });
				params.changes.push(`Removed already-archived ${params.label} legacy source ${params.sourcePath}`);
				return;
			}
		}
	} catch (err) {
		params.warnings.push(`Failed archiving ${params.label} legacy source ${params.sourcePath}: ${String(err)}`);
	}
}
//#endregion
export { archiveLegacyImportSource as t };
