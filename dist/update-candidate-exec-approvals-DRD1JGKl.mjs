import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { l as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as MAX_LEGACY_EXEC_APPROVALS_BYTES, r as detectLegacyExecApprovals, t as DOCTOR_CLAIM_SUFFIX } from "./state-migrations.exec-approvals--uvmmqhs.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { root } from "@openclaw/fs-safe";
//#region src/infra/update-candidate-exec-approvals.ts
/** Project retired policy inputs and their receipt authority into the private rehearsal copy. */
function createUpdateCandidateExecApprovalsProjection(sourceRoot, targetPath) {
	const { sourcePath: legacySourcePath } = detectLegacyExecApprovals({ stateDir: sourceRoot });
	return {
		rebaseReceipt(db) {
			if (!tableExists(db, "migration_sources")) return;
			const queries = getNodeSqliteKysely(db);
			executeSqliteQuerySync(db, queries.updateTable("migration_sources").set({
				source_key: resolveLegacyMigrationSourceKey("exec-approvals-json", targetPath(legacySourcePath)),
				source_path: targetPath(legacySourcePath)
			}).where("source_key", "=", resolveLegacyMigrationSourceKey("exec-approvals-json", legacySourcePath)).where("migration_kind", "=", "legacy-exec-approvals-json"));
		},
		async copySources() {
			for (const source of [legacySourcePath, `${legacySourcePath}${DOCTOR_CLAIM_SUFFIX}`]) {
				if (!await fs.lstat(source).then(() => true, (error) => {
					if (hasNodeErrorCode(error, "ENOENT")) return false;
					throw error;
				})) continue;
				const opened = await (await root(sourceRoot)).read(path.relative(sourceRoot, source), {
					hardlinks: "reject",
					symlinks: "reject",
					maxBytes: MAX_LEGACY_EXEC_APPROVALS_BYTES
				});
				const target = targetPath(source);
				await fs.mkdir(path.dirname(target), {
					recursive: true,
					mode: 448
				});
				await fs.writeFile(target, opened.buffer, {
					mode: 384,
					flag: "wx"
				});
			}
		}
	};
}
//#endregion
export { createUpdateCandidateExecApprovalsProjection };
