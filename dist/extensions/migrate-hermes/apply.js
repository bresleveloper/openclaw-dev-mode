import { t as openNodeSqliteDatabase } from "../../node-sqlite-XIcwmOrl.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-DR7bHNl9.mjs";
import "../../sqlite-runtime-Ch9K5Xik.mjs";
import { n as withTempWorkspace } from "../../fs-safe-compat-Cbx7s6au.mjs";
import "../../temp-path-C5ZA6ftW.mjs";
import { i as applyMigrationManualItem, l as markMigrationItemConflict, r as applyMigrationConfigPatchItem, u as markMigrationItemError, y as summarizeMigrationItems } from "../../migration-BeM6IrM8.mjs";
import { a as resolvePlannedMigrationTargets, i as copyMigrationFileItem, o as withCachedMigrationConfigRuntime, r as copyMemoryMigrationFileItem, s as writeMigrationReport, t as archiveMigrationItem } from "../../migration-runtime-BOM5W2_O.mjs";
import { t as appendItem } from "../../helpers-B2SzrrLy.mjs";
import { c as HERMES_REASON_MODEL_PROVIDER_CONFLICT, f as findHermesModelProviderDependency, p as readHermesModelDetails } from "../../items-Ow1uFW0E.mjs";
import { t as applyAuthItem } from "../../auth-BipNh_8-.mjs";
import { t as applyModelItem } from "../../model-B-1-eaxp.mjs";
import { t as applySecretItem } from "../../secrets-DhvozIaq.mjs";
import { t as buildHermesPlan } from "../../plan-CDAnzMfh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-hermes/apply.ts
const HERMES_SQLITE_SNAPSHOT_PREFIX = "openclaw-migrate-hermes-sqlite-";
function isHermesMemoryOnlyCopyItem(item) {
	return item.kind === "memory" && item.action === "copy" && item.details?.sourceType === "hermes-memory" && item.details?.collectionId === "hermes";
}
function assertConsistentMemoryPlan(plan) {
	const hasMemoryOnlyCopy = plan.items.some(isHermesMemoryOnlyCopyItem);
	const hasMemoryAppend = plan.items.some((item) => item.kind === "memory" && item.action === "append");
	if (hasMemoryOnlyCopy && hasMemoryAppend) throw new Error("Hermes migration plan mixes memory-only copy and append items");
}
async function archiveHermesItem(item, reportDir) {
	if (!item.source || path.extname(item.source) !== ".db") return await archiveMigrationItem(item, reportDir);
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
			prefix: HERMES_SQLITE_SNAPSHOT_PREFIX
		}, async ({ dir: tempDir }) => {
			const snapshotPath = path.join(tempDir, path.basename(sourcePath));
			const source = openNodeSqliteDatabase(sourcePath, { readOnly: true });
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
		let recoveryArchive;
		try {
			recoveryArchive = await withTempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: HERMES_SQLITE_SNAPSHOT_PREFIX
			}, async ({ dir: tempDir }) => {
				const recoveryDir = path.join(tempDir, `${path.basename(sourcePath)}-recovery`);
				await fs.mkdir(recoveryDir, { recursive: true });
				for (const candidate of [
					sourcePath,
					`${sourcePath}-wal`,
					`${sourcePath}-shm`
				]) {
					if (!(await fs.lstat(candidate).catch(() => void 0))?.isFile()) continue;
					try {
						await fs.copyFile(candidate, path.join(recoveryDir, path.basename(candidate)));
					} catch (copyError) {
						const copyCode = copyError.code;
						if (candidate !== sourcePath && copyCode === "ENOENT") continue;
						throw copyError;
					}
				}
				return await archiveMigrationItem({
					...item,
					source: recoveryDir
				}, reportDir);
			});
		} catch (recoveryError) {
			const recoveryReason = recoveryError instanceof Error ? recoveryError.message : String(recoveryError);
			return markMigrationItemError(item, `SQLite snapshot failed: ${snapshotReason}; recovery archive failed: ${recoveryReason}`);
		}
		if (recoveryArchive.status === "migrated") return markMigrationItemError({
			...recoveryArchive,
			source: sourcePath
		}, `SQLite snapshot failed; database recovery files preserved for manual review: ${snapshotReason}`);
		return markMigrationItemError({
			...recoveryArchive,
			source: sourcePath
		}, `SQLite snapshot failed: ${snapshotReason}; recovery archive failed: ${recoveryArchive.reason ?? recoveryArchive.status}`);
	}
}
async function applyHermesPlan(params) {
	const plan = params.plan ?? await buildHermesPlan(params.ctx);
	assertConsistentMemoryPlan(plan);
	const reportDir = params.ctx.reportDir ?? path.join(params.ctx.stateDir, "migration", "hermes");
	const targets = resolvePlannedMigrationTargets(params.ctx);
	const appliedByItem = /* @__PURE__ */ new Map();
	const runtime = withCachedMigrationConfigRuntime(params.ctx.runtime ?? params.runtime, params.ctx.config);
	const applyCtx = {
		...params.ctx,
		runtime
	};
	const executionItems = [...plan.items.filter((item) => item.id.startsWith("config:model-provider:")), ...plan.items.filter((item) => !item.id.startsWith("config:model-provider:"))];
	for (const item of executionItems) {
		if (item.status !== "planned") {
			appliedByItem.set(item, item);
			continue;
		}
		let appliedItem;
		if (item.id === "config:default-model") {
			const model = readHermesModelDetails(item)?.model;
			const dependency = model ? findHermesModelProviderDependency(plan.items, model) : void 0;
			const dependencyResult = dependency ? appliedByItem.get(dependency) : void 0;
			if (dependencyResult && dependencyResult.status !== "migrated") appliedItem = dependencyResult.status === "conflict" ? markMigrationItemConflict(item, HERMES_REASON_MODEL_PROVIDER_CONFLICT) : markMigrationItemError(item, `model provider config failed: ${dependencyResult.reason ?? dependencyResult.status}`);
			else appliedItem = await applyModelItem(applyCtx, item);
		} else if (item.kind === "config") appliedItem = await applyMigrationConfigPatchItem(applyCtx, item);
		else if (item.kind === "manual") appliedItem = applyMigrationManualItem(item);
		else if (item.action === "archive") appliedItem = await archiveHermesItem(item, reportDir);
		else if (item.kind === "auth") appliedItem = await applyAuthItem(applyCtx, item, targets);
		else if (item.kind === "secret") appliedItem = await applySecretItem(applyCtx, item, targets);
		else if (isHermesMemoryOnlyCopyItem(item)) appliedItem = await copyMemoryMigrationFileItem(item, reportDir, {
			workspaceDir: targets.workspaceDir,
			overwrite: params.ctx.overwrite
		});
		else if (item.action === "append") appliedItem = await appendItem(item);
		else appliedItem = await copyMigrationFileItem(item, reportDir, { overwrite: params.ctx.overwrite });
		appliedByItem.set(item, appliedItem);
	}
	const items = plan.items.map((item) => appliedByItem.get(item) ?? item);
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
export { applyHermesPlan };
