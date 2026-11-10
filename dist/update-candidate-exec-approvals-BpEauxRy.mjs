import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { c as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-CikBNdPu.mjs";
import { t as ignoreMissingUpdateCandidateFile } from "./update-candidate-files-BfBN3EpP.mjs";
import { n as MAX_LEGACY_EXEC_APPROVALS_BYTES, r as detectLegacyExecApprovals, t as DOCTOR_CLAIM_SUFFIX } from "./state-migrations.exec-approvals-_9P0tTvf.mjs";
import fs from "node:fs/promises";
import path from "node:path";
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
				if (!await fs.lstat(source).then(() => true, (error) => ignoreMissingUpdateCandidateFile(error) ?? false)) continue;
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
