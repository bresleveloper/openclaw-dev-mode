import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as readLegacyMigrationReceipt, s as resolveLegacyMigrationSourceKey } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { l as WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND, u as WORKSPACE_LEGACY_STATE_MIGRATION_KIND } from "./workspace-state-store-DTZ2RTNw.mjs";
import { o as WORKSPACE_DOCTOR_CLAIM_SUFFIX } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash } from "node:crypto";
import { root } from "@openclaw/fs-safe";
//#region src/infra/state-migrations.workspace-setup-receipts.ts
function createWorkspaceSetupFingerprint(setup) {
	return createHash("sha256").update(JSON.stringify({
		kind: "setup",
		workspacePath: setup.workspace_path,
		version: 1,
		bootstrapSeededAt: setup.bootstrap_seeded_at,
		setupCompletedAt: setup.setup_completed_at
	})).digest("hex");
}
function resolveWorkspaceMigrationSourceKey(source) {
	return resolveLegacyMigrationSourceKey(`workspace-${source.kind}`, source.sourcePath, source.workspaceKey);
}
function readReceipt(source, env) {
	const receipt = readLegacyMigrationReceipt(resolveWorkspaceMigrationSourceKey(source), env);
	const archivePath = receipt ? safeParseJsonRecord(receipt.reportJson)?.archivePath : void 0;
	return receipt ? {
		sourceKey: receipt.sourceKey,
		sha256: receipt.sourceSha256,
		removedSource: receipt.removedSource,
		...typeof archivePath === "string" ? { archivePath } : {}
	} : null;
}
function receiptMoveFailure(sourcePath, reason) {
	return /* @__PURE__ */ new Error(`Cannot move workspace migration history at ${sourcePath}: ${reason}. Preserve the workspace and database, finish or repair the pending migration with openclaw doctor --fix, then retry the workspace move.`);
}
function moveWorkspacePath(value, storedIdentity, currentDirectoryPath) {
	const sourceParts = path.resolve(value).split(path.sep);
	const relative = path.relative(storedIdentity.workspacePath, path.resolve(value).normalize("NFC"));
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return value;
	const depth = relative.split(path.sep).filter(Boolean).length;
	return path.join(currentDirectoryPath, ...sourceParts.slice(sourceParts.length - depth));
}
function readWorkspaceMoveReceipts(database, storedIdentity, currentIdentity) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("migration_sources").selectAll().where("migration_kind", "in", [WORKSPACE_LEGACY_STATE_MIGRATION_KIND, WORKSPACE_CONTENT_RELOCATION_MIGRATION_KIND]).orderBy("source_key", "asc")).rows.filter((row) => {
		const report = safeParseJsonRecord(row.report_json);
		const associated = [storedIdentity, currentIdentity].some((identity) => row.migration_kind === "legacy-workspace-setup-files" ? ["setup", "attestation"].some((kind) => row.source_key === resolveLegacyMigrationSourceKey(`workspace-${kind}`, row.source_path, identity.workspaceKey)) : row.source_path === identity.workspacePath);
		if (associated && !report) throw receiptMoveFailure(row.source_path, "the migration report is unreadable");
		return associated || report?.workspaceKey === storedIdentity.workspaceKey || report?.workspaceKey === currentIdentity.workspaceKey;
	});
}
function assertReceiptMoveDestinations(database, plan) {
	const destinationKeys = /* @__PURE__ */ new Set();
	for (const replacement of plan.replacements) {
		const existing = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("migration_sources").select("source_key").where("source_key", "=", replacement.source_key));
		if (destinationKeys.has(replacement.source_key) || existing && existing.source_key !== replacement.originalKey) throw receiptMoveFailure(replacement.source_path, "the destination already has a receipt");
		destinationKeys.add(replacement.source_key);
	}
}
async function verifyCarriedReceiptFile(workspacePath, filePath, sha256) {
	try {
		const file = await (await root(workspacePath, {
			hardlinks: "reject",
			symlinks: "reject",
			maxBytes: 65536
		})).read(path.relative(workspacePath, filePath));
		if (createHash("sha256").update(file.buffer).digest("hex") !== sha256) throw new Error("the carried file differs from its migration receipt");
	} catch (error) {
		throw receiptMoveFailure(filePath, formatErrorMessage(error));
	}
}
/** Prepare filesystem evidence before the move owner's synchronous write transaction. */
async function prepareWorkspaceMigrationReceiptMove(params) {
	const { database, storedIdentity, currentIdentity, storedSetup, currentDirectoryPath } = params;
	const receipts = readWorkspaceMoveReceipts(database, storedIdentity, currentIdentity);
	const plan = {
		storedIdentity,
		currentIdentity,
		receipts,
		replacements: []
	};
	const oldFingerprint = storedSetup?.version === 1 ? createWorkspaceSetupFingerprint(storedSetup) : void 0;
	for (const receipt of receipts) {
		const report = safeParseJsonRecord(receipt.report_json);
		if (report.workspaceKey !== storedIdentity.workspaceKey) throw receiptMoveFailure(receipt.source_path, report.workspaceKey === currentIdentity.workspaceKey ? "the destination already owns migration history" : "the migration report has unsupported workspace ownership");
		if (!path.isAbsolute(receipt.source_path)) throw receiptMoveFailure(receipt.source_path, "the migration source path is invalid");
		const sourcePath = moveWorkspacePath(receipt.source_path, storedIdentity, currentDirectoryPath);
		const movedReport = {
			...report,
			workspaceKey: currentIdentity.workspaceKey
		};
		let sourceKey;
		if (receipt.migration_kind === "workspace-content-relocation") {
			if (receipt.status !== "completed" && receipt.status !== "superseded") throw receiptMoveFailure(receipt.source_path, "a skill-workshop relocation is still pending");
			sourceKey = resolveLegacyMigrationSourceKey(receipt.migration_kind, sourcePath);
			if (receipt.source_key !== resolveLegacyMigrationSourceKey(receipt.migration_kind, receipt.source_path)) throw receiptMoveFailure(receipt.source_path, "the relocation receipt key is invalid");
		} else {
			if (report.sourceKind !== "setup" && report.sourceKind !== "attestation" || typeof report.canonicalFingerprint !== "string" || typeof report.authoritative !== "boolean" || receipt.status !== "completed") throw receiptMoveFailure(receipt.source_path, "the workspace receipt format is unsupported");
			if (receipt.source_key !== resolveLegacyMigrationSourceKey(`workspace-${report.sourceKind}`, receipt.source_path, storedIdentity.workspaceKey)) throw receiptMoveFailure(receipt.source_path, "the workspace receipt key is invalid");
			if (sourcePath === receipt.source_path && (receipt.removed_source !== 1 || pathMayExistSync(sourcePath) || pathMayExistSync(`${sourcePath}.doctor-importing`))) throw receiptMoveFailure(receipt.source_path, "an external legacy source has not finished cleanup");
			if (sourcePath !== receipt.source_path && receipt.removed_source !== 1) {
				const claimPath = `${sourcePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`;
				const sourceExists = pathMayExistSync(sourcePath);
				const claimExists = pathMayExistSync(claimPath);
				if (sourceExists && claimExists) throw receiptMoveFailure(sourcePath, "both the carried source and its interrupted claim exist");
				if (sourceExists || claimExists) await verifyCarriedReceiptFile(currentDirectoryPath, sourceExists ? sourcePath : claimPath, receipt.source_sha256);
			}
			if (storedSetup && report.sourceKind === "setup" && oldFingerprint === report.canonicalFingerprint) movedReport.canonicalFingerprint = createWorkspaceSetupFingerprint({
				...storedSetup,
				workspace_path: currentIdentity.workspacePath
			});
			if (report.archivePath !== void 0) {
				if (typeof report.archivePath !== "string" || !path.isAbsolute(report.archivePath)) throw receiptMoveFailure(receipt.source_path, "the setup backup path is invalid");
				const archivePath = moveWorkspacePath(report.archivePath, storedIdentity, currentDirectoryPath);
				if (archivePath !== report.archivePath && receipt.removed_source !== 1) await verifyCarriedReceiptFile(currentDirectoryPath, archivePath, receipt.source_sha256);
				movedReport.archivePath = archivePath;
			}
			sourceKey = resolveLegacyMigrationSourceKey(`workspace-${report.sourceKind}`, sourcePath, currentIdentity.workspaceKey);
		}
		plan.replacements.push({
			originalKey: receipt.source_key,
			source_key: sourceKey,
			source_path: sourcePath,
			report_json: JSON.stringify(movedReport)
		});
	}
	assertReceiptMoveDestinations(database, plan);
	return plan;
}
/** Apply with the setup/alias move; preserve run history and every source-cleanup flag. */
function applyWorkspaceMigrationReceiptMove(database, plan) {
	const current = readWorkspaceMoveReceipts(database, plan.storedIdentity, plan.currentIdentity);
	if (!isDeepStrictEqual(current, plan.receipts)) throw receiptMoveFailure(plan.storedIdentity.workspacePath, "migration history changed during the move");
	assertReceiptMoveDestinations(database, plan);
	const kysely = getNodeSqliteKysely(database);
	for (const { originalKey, ...replacement } of plan.replacements) executeSqliteQuerySync(database, kysely.updateTable("migration_sources").set(replacement).where("source_key", "=", originalKey));
}
//#endregion
export { resolveWorkspaceMigrationSourceKey as a, readReceipt as i, createWorkspaceSetupFingerprint as n, prepareWorkspaceMigrationReceiptMove as r, applyWorkspaceMigrationReceiptMove as t };
