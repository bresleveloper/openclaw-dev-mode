import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { r as withTempWorkspace } from "./private-temp-workspace-MCwLg_M9.js";
import "./temp-path-BbDdjtr4.js";
import { d as markMigrationItemSkipped, u as markMigrationItemError, v as summarizeMigrationItems } from "./migration-CRXv-K-p.js";
import { i as writeMigrationReport, n as copyMigrationFileItem, r as withCachedMigrationConfigRuntime, t as archiveMigrationItem } from "./migration-runtime-MU8xUQdp.js";
import { t as appendItem } from "./helpers-DiJSI3o5.js";
import { t as applyAuthItem } from "./auth-DhBGzAyl.js";
import { n as applyManualItem, t as applyConfigItem } from "./config-BSgeI2zL2.js";
import { t as applyModelItem } from "./model-9U5YoQxR.js";
import { t as applySecretItem } from "./secrets-TGy-vuDb.js";
import { t as resolveTargets } from "./targets-DFYK4anf.js";
import { t as buildHermesPlan } from "./plan-BTaERXyb.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-hermes/apply.ts
const HERMES_REASON_BLOCKED_BY_APPLY_CONFLICT = "blocked by earlier apply conflict";
const HERMES_STATE_DB_ARCHIVE_ITEM_ID = "archive:state.db";
const HERMES_STATE_DB_SNAPSHOT_PREFIX = "openclaw-migrate-hermes-state-";
async function archiveHermesItem(item, reportDir) {
	if (item.id !== HERMES_STATE_DB_ARCHIVE_ITEM_ID || !item.source) return await archiveMigrationItem(item, reportDir);
	const sourcePath = item.source;
	let sourceStat;
	try {
		sourceStat = await fs.lstat(sourcePath);
	} catch {
		return await archiveMigrationItem(item, reportDir);
	}
	if (!sourceStat.isFile()) return await archiveMigrationItem(item, reportDir);
	try {
		return await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: HERMES_STATE_DB_SNAPSHOT_PREFIX
		}, async ({ dir: tempDir }) => {
			const snapshotPath = path.join(tempDir, "state.db");
			const { DatabaseSync } = await import("node:sqlite");
			const source = new DatabaseSync(sourcePath, { readOnly: true });
			try {
				source.exec("PRAGMA busy_timeout = 30000;");
				source.prepare("VACUUM INTO ?").run(snapshotPath);
			} finally {
				source.close();
			}
			await fs.chmod(snapshotPath, 384);
			return {
				...await archiveMigrationItem({
					...item,
					source: snapshotPath
				}, reportDir),
				source: sourcePath
			};
		});
	} catch (err) {
		const snapshotReason = err instanceof Error ? err.message : String(err);
		const rawArchive = await archiveMigrationItem(item, reportDir);
		if (rawArchive.status === "migrated") return markMigrationItemError(rawArchive, `SQLite snapshot failed; raw state.db preserved for manual review: ${snapshotReason}`);
		return markMigrationItemError(rawArchive, `SQLite snapshot failed: ${snapshotReason}; raw archive failed: ${rawArchive.reason ?? rawArchive.status}`);
	}
}
async function applyHermesPlan(params) {
	const plan = params.plan ?? await buildHermesPlan(params.ctx);
	const reportDir = params.ctx.reportDir ?? path.join(params.ctx.stateDir, "migration", "hermes");
	const targets = resolveTargets(params.ctx);
	const items = [];
	const runtime = withCachedMigrationConfigRuntime(params.ctx.runtime ?? params.runtime, params.ctx.config);
	const applyCtx = {
		...params.ctx,
		runtime
	};
	let blockedByApplyConflict = false;
	for (const item of plan.items) {
		if (item.status !== "planned") {
			items.push(item);
			continue;
		}
		if (blockedByApplyConflict) {
			items.push(markMigrationItemSkipped(item, HERMES_REASON_BLOCKED_BY_APPLY_CONFLICT));
			continue;
		}
		let appliedItem;
		if (item.id === "config:default-model") appliedItem = await applyModelItem(applyCtx, item);
		else if (item.kind === "config") appliedItem = await applyConfigItem(applyCtx, item);
		else if (item.kind === "manual") appliedItem = applyManualItem(item);
		else if (item.action === "archive") appliedItem = await archiveHermesItem(item, reportDir);
		else if (item.kind === "auth") appliedItem = await applyAuthItem(applyCtx, item, targets);
		else if (item.kind === "secret") appliedItem = await applySecretItem(applyCtx, item, targets);
		else if (item.action === "append") appliedItem = await appendItem(item);
		else appliedItem = await copyMigrationFileItem(item, reportDir, { overwrite: params.ctx.overwrite });
		items.push(appliedItem);
		if (item.kind === "config" && (appliedItem.status === "conflict" || appliedItem.status === "error")) blockedByApplyConflict = true;
	}
	const result = {
		...plan,
		items,
		summary: summarizeMigrationItems(items),
		backupPath: params.ctx.backupPath,
		reportDir
	};
	await writeMigrationReport(result, { title: "Hermes Migration Report" });
	return result;
}
//#endregion
export { applyHermesPlan as t };
