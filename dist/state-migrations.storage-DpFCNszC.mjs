import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-C_0BsNDD.mjs";
import { at as projectDeliveryQueueTerminalEntry, ct as deliveryQueueMetadata, rt as inferDeliveryQueueFailureRetention } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import "./installed-plugin-index-D0kh4WcK.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { c as createPluginInstallRecordMap, f as parsePluginInstallRecordMap, l as getPluginInstallRecordMapEntry, m as setPluginInstallRecordMapEntry, p as serializePluginInstallRecordMap, s as copyPluginInstallRecordMap } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { t as parseInstalledPluginIndex } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { A as repairLegacyTaskIdentifiers, c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as recordLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { c as readLegacyMigrationSourceSnapshotSync, n as assertLegacyMigrationSourceUnchanged } from "./state-migrations.source-snapshot-Bzxgpz55.mjs";
import { r as migrationFileExists } from "./state-migrations.fs-BCymriz5.mjs";
import { a as listLegacyDeliveryQueueFiles, i as listLegacyDeliveryQueueDeliveredMarkers, o as resolveLegacyDeliveryQueuePath, t as LEGACY_DELIVERY_QUEUE_DIRS } from "./delivery-queue-legacy-files-DNIBi5Wk.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/infra/state-migrations.task-sidecar-rows.ts
function normalizeLegacySqliteInteger(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
function listSqliteColumns(db, table) {
	const rows = db.prepare(`PRAGMA table_info(${table})`).all();
	return new Set(rows.flatMap((row) => row.name ? [row.name] : []));
}
function pickLegacyColumn(columns, name, fallbackSql = "NULL") {
	return columns.has(name) ? name : `${fallbackSql} AS ${name}`;
}
function legacyBindValue(value) {
	if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "bigint" || value instanceof Uint8Array) return value ?? null;
	return JSON.stringify(value);
}
function legacyStringValue(value) {
	return typeof value === "string" ? value : "";
}
function normalizeLegacyTaskRow(row) {
	const runtime = legacyStringValue(row.runtime);
	const sourceId = typeof row.source_id === "string" ? row.source_id : "";
	const taskId = legacyStringValue(row.task_id);
	const ownerRaw = typeof row.owner_key === "string" ? row.owner_key.trim() : "";
	const requesterRaw = typeof row.requester_session_key === "string" ? row.requester_session_key.trim() : "";
	const ownerKey = ownerRaw || requesterRaw || `system:${runtime}:${sourceId || taskId}`;
	const scopeKind = (typeof row.scope_kind === "string" ? row.scope_kind : "") === "system" || ownerKey.startsWith("system:") ? "system" : "session";
	const childSessionKey = typeof row.child_session_key === "string" ? row.child_session_key.trim() : "";
	const persistedAgentId = typeof row.agent_id === "string" ? row.agent_id.trim() : "";
	const isSpawnRuntime = runtime === "subagent" || runtime === "acp";
	const childAgentId = isSpawnRuntime ? parseAgentSessionKey(childSessionKey)?.agentId : void 0;
	const requesterAgentId = (typeof row.requester_agent_id === "string" ? row.requester_agent_id.trim() : "") || (isSpawnRuntime ? parseAgentSessionKey(ownerKey)?.agentId ?? parseAgentSessionKey(requesterRaw)?.agentId ?? (childAgentId && persistedAgentId !== childAgentId ? persistedAgentId : "") : "");
	const executorAgentId = requesterAgentId ? childAgentId || persistedAgentId : persistedAgentId;
	const deliveryStatus = row.delivery_status === "not-requested" ? "not_applicable" : row.delivery_status;
	return {
		task_id: taskId,
		runtime,
		task_kind: legacyBindValue(row.task_kind),
		source_id: legacyBindValue(row.source_id),
		requester_session_key: scopeKind === "system" ? "" : requesterRaw || ownerKey,
		owner_key: ownerKey,
		scope_kind: scopeKind,
		child_session_key: childSessionKey || null,
		parent_flow_id: legacyBindValue(row.parent_flow_id),
		parent_task_id: legacyBindValue(row.parent_task_id),
		agent_id: executorAgentId || null,
		requester_agent_id: requesterAgentId || null,
		run_id: legacyBindValue(row.run_id),
		label: legacyBindValue(row.label),
		task: legacyBindValue(row.task ?? ""),
		status: legacyBindValue(row.status ?? ""),
		delivery_status: legacyBindValue(deliveryStatus ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
		started_at: normalizeLegacySqliteInteger(row.started_at),
		ended_at: normalizeLegacySqliteInteger(row.ended_at),
		last_event_at: normalizeLegacySqliteInteger(row.last_event_at),
		cleanup_after: normalizeLegacySqliteInteger(row.cleanup_after),
		error: legacyBindValue(row.error),
		progress_summary: legacyBindValue(row.progress_summary),
		terminal_summary: legacyBindValue(row.terminal_summary),
		terminal_outcome: legacyBindValue(row.terminal_outcome),
		detail_json: legacyBindValue(row.detail_json)
	};
}
function readLegacyTaskRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "task_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"task_id",
			"runtime",
			pickLegacyColumn(columns, "task_kind"),
			pickLegacyColumn(columns, "source_id"),
			pickLegacyColumn(columns, "requester_session_key"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "scope_kind"),
			pickLegacyColumn(columns, "child_session_key"),
			pickLegacyColumn(columns, "parent_flow_id"),
			pickLegacyColumn(columns, "parent_task_id"),
			pickLegacyColumn(columns, "agent_id"),
			pickLegacyColumn(columns, "requester_agent_id"),
			pickLegacyColumn(columns, "run_id"),
			pickLegacyColumn(columns, "label"),
			"task",
			"status",
			"delivery_status",
			"notify_policy",
			"created_at",
			pickLegacyColumn(columns, "started_at"),
			pickLegacyColumn(columns, "ended_at"),
			pickLegacyColumn(columns, "last_event_at"),
			pickLegacyColumn(columns, "cleanup_after"),
			pickLegacyColumn(columns, "error"),
			pickLegacyColumn(columns, "progress_summary"),
			pickLegacyColumn(columns, "terminal_summary"),
			pickLegacyColumn(columns, "terminal_outcome"),
			pickLegacyColumn(columns, "detail_json")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM task_runs ORDER BY created_at ASC, task_id ASC`).all().map((row) => normalizeLegacyTaskRow(row));
	} finally {
		db.close();
	}
}
function readLegacyTaskDeliveryRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		if (listSqliteColumns(db, "task_delivery_state").size === 0) return [];
		return db.prepare(`SELECT task_id, requester_origin_json, last_notified_event_at FROM task_delivery_state ORDER BY task_id ASC`).all();
	} finally {
		db.close();
	}
}
function insertTaskRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_runs (
        task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
        child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
        label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
        last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
        detail_json
      ) VALUES (
        @task_id, @runtime, @task_kind, @source_id, @requester_session_key, @owner_key,
        @scope_kind, @child_session_key, @parent_flow_id, @parent_task_id, @agent_id,
        @requester_agent_id, @run_id, @label, @task, @status, @delivery_status, @notify_policy,
        @created_at, @started_at, @ended_at, @last_event_at, @cleanup_after, @error,
        @progress_summary, @terminal_summary, @terminal_outcome, @detail_json
      )
    `).run(row);
}
function insertTaskDeliveryRowSql(db, row) {
	db.prepare(`
      INSERT INTO task_delivery_state (
        task_id, requester_origin_json, last_notified_event_at
      ) VALUES (
        @task_id, @requester_origin_json, @last_notified_event_at
      )
    `).run(row);
}
function normalizeLegacyFlowRow(row) {
	const syncMode = row.sync_mode === "task_mirrored" || row.shape === "single_task" ? "task_mirrored" : "managed";
	const ownerKey = typeof row.owner_key === "string" && row.owner_key.trim() ? row.owner_key.trim() : typeof row.owner_session_key === "string" ? row.owner_session_key.trim() : "";
	const controllerId = syncMode === "managed" ? typeof row.controller_id === "string" && row.controller_id.trim() ? row.controller_id.trim() : "core/legacy-restored" : null;
	return {
		flow_id: legacyBindValue(row.flow_id ?? ""),
		shape: legacyBindValue(row.shape),
		sync_mode: syncMode,
		owner_key: ownerKey,
		requester_origin_json: legacyBindValue(row.requester_origin_json),
		controller_id: controllerId,
		revision: normalizeLegacySqliteInteger(row.revision ?? null) ?? 0,
		status: legacyBindValue(row.status ?? ""),
		notify_policy: legacyBindValue(row.notify_policy ?? ""),
		goal: legacyBindValue(row.goal ?? ""),
		current_step: legacyBindValue(row.current_step),
		blocked_task_id: legacyBindValue(row.blocked_task_id),
		blocked_summary: legacyBindValue(row.blocked_summary),
		state_json: legacyBindValue(row.state_json),
		wait_json: legacyBindValue(row.wait_json),
		cancel_requested_at: normalizeLegacySqliteInteger(row.cancel_requested_at ?? null),
		created_at: normalizeLegacySqliteInteger(row.created_at ?? null) ?? 0,
		updated_at: normalizeLegacySqliteInteger(row.updated_at ?? null) ?? 0,
		ended_at: normalizeLegacySqliteInteger(row.ended_at ?? null)
	};
}
function readLegacyFlowRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		const columns = listSqliteColumns(db, "flow_runs");
		if (columns.size === 0) return [];
		const selectColumns = [
			"flow_id",
			pickLegacyColumn(columns, "shape"),
			pickLegacyColumn(columns, "sync_mode"),
			pickLegacyColumn(columns, "owner_key"),
			pickLegacyColumn(columns, "owner_session_key"),
			pickLegacyColumn(columns, "requester_origin_json"),
			pickLegacyColumn(columns, "controller_id"),
			pickLegacyColumn(columns, "revision", "0"),
			"status",
			"notify_policy",
			"goal",
			pickLegacyColumn(columns, "current_step"),
			pickLegacyColumn(columns, "blocked_task_id"),
			pickLegacyColumn(columns, "blocked_summary"),
			pickLegacyColumn(columns, "state_json"),
			pickLegacyColumn(columns, "wait_json"),
			pickLegacyColumn(columns, "cancel_requested_at"),
			"created_at",
			"updated_at",
			pickLegacyColumn(columns, "ended_at")
		];
		return db.prepare(`SELECT ${selectColumns.join(", ")} FROM flow_runs ORDER BY created_at ASC, flow_id ASC`).all().map(normalizeLegacyFlowRow);
	} finally {
		db.close();
	}
}
function insertFlowRunRowSql(db, row) {
	db.prepare(`
      INSERT INTO flow_runs (
        flow_id, shape, sync_mode, owner_key, requester_origin_json, controller_id, revision,
        status, notify_policy, goal, current_step, blocked_task_id, blocked_summary, state_json,
        wait_json, cancel_requested_at, created_at, updated_at, ended_at
      ) VALUES (
        @flow_id, @shape, @sync_mode, @owner_key, @requester_origin_json, @controller_id,
        @revision, @status, @notify_policy, @goal, @current_step, @blocked_task_id,
        @blocked_summary, @state_json, @wait_json, @cancel_requested_at, @created_at,
        @updated_at, @ended_at
      )
    `).run(row);
}
//#endregion
//#region src/infra/state-migrations.storage.ts
const PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
const TASK_STATE_SQLITE_SIDECAR_SUFFIXES = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES;
const LEGACY_DELIVERY_QUEUE_MAX_AGE_MS = 2592e5;
var LegacyTaskStateSidecarConflictError = class extends Error {
	constructor(conflictedKeys) {
		super("legacy task-state sidecar conflicts with shared state");
		this.conflictedKeys = conflictedKeys;
	}
};
function resolveLegacyPluginStateSidecarPath(stateDir) {
	return path.join(stateDir, "plugin-state", "state.sqlite");
}
function resolveLegacyTaskRunsSidecarPath(stateDir) {
	return path.join(stateDir, "tasks", "runs.sqlite");
}
function resolveLegacyFlowRunsSidecarPath(stateDir) {
	return path.join(stateDir, "flows", "registry.sqlite");
}
function readLegacyPluginStateSidecarRows(sourcePath) {
	const db = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		return db.prepare(`
          SELECT plugin_id, namespace, entry_key, value_json, created_at, expires_at
          FROM plugin_state_entries
          ORDER BY plugin_id ASC, namespace ASC, entry_key ASC
        `).all();
	} finally {
		db.close();
	}
}
function legacyPluginStateRowsMatch(existing, legacy) {
	return existing.value_json === legacy.value_json && normalizeLegacySqliteInteger(existing.created_at) === normalizeLegacySqliteInteger(legacy.created_at) && normalizeLegacySqliteInteger(existing.expires_at) === normalizeLegacySqliteInteger(legacy.expires_at);
}
function isLegacyPluginStateRowExpired(row, now) {
	const expiresAt = normalizeLegacySqliteInteger(row.expires_at);
	return expiresAt !== null && expiresAt <= now;
}
function hasPendingSqliteSidecarArchive(sourcePath, suffixes) {
	return !migrationFileExists(sourcePath) && migrationFileExists(`${sourcePath}.migrated`) && suffixes.some((suffix) => suffix !== "" && migrationFileExists(`${sourcePath}${suffix}`));
}
function hashLegacyArchiveSource(sourcePath) {
	const fd = fs.openSync(sourcePath, "r");
	try {
		return hashFileDescriptorSync(fd).sha256;
	} finally {
		fs.closeSync(fd);
	}
}
function archiveLegacyFileSource(params) {
	try {
		let sourceSha256;
		for (let index = 1;; index++) {
			const targetPath = index === 1 ? `${params.sourcePath}.migrated` : `${params.sourcePath}.migrated.${index}`;
			if (!fs.existsSync(targetPath)) {
				fs.renameSync(params.sourcePath, targetPath);
				return {
					sourcePath: params.sourcePath,
					targetPath,
					action: "archived"
				};
			}
			sourceSha256 ??= hashLegacyArchiveSource(params.sourcePath);
			if (sourceSha256 === hashLegacyArchiveSource(targetPath)) {
				fs.rmSync(params.sourcePath, { force: true });
				return {
					sourcePath: params.sourcePath,
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
function recordArchiveCollisionResolutions(changes, label, resolutions) {
	for (const resolution of resolutions) changes.push(resolution.action === "removed" ? `Removed already-archived ${label} legacy source ${resolution.sourcePath}` : `Archived ${label} legacy source → ${resolution.targetPath}`);
}
function archiveLegacySqliteSidecar(params) {
	const existingSources = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(migrationFileExists);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const resolution = archiveLegacyFileSource({
			sourcePath,
			label: `${params.label} sidecar`,
			warnings: params.warnings
		});
		if (!resolution) return;
		resolutions.push(resolution);
	}
	if (resolutions.every((resolution) => resolution.action === "archived" && resolution.targetPath === `${resolution.sourcePath}.migrated`)) params.changes.push(`Archived ${params.label} sidecar legacy source → ${params.sourcePath}.migrated`);
	else recordArchiveCollisionResolutions(params.changes, `${params.label} sidecar`, resolutions);
}
function archiveLegacyPluginStateSidecar(params) {
	archiveLegacySqliteSidecar({
		...params,
		label: "plugin-state"
	});
}
function readLegacyInstalledPluginIndex(sourcePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
		const current = parseInstalledPluginIndex(parsed);
		if (current) return current;
		const topLevelInstallRecords = readLegacyTopLevelInstallRecords(parsed);
		const installRecords = topLevelInstallRecords === void 0 ? readLegacyEmbeddedInstallRecords(parsed) : topLevelInstallRecords;
		if (!installRecords) return null;
		return parseInstalledPluginIndex({
			version: 1,
			hostContractVersion: "legacy",
			compatRegistryVersion: "legacy",
			migrationVersion: 1,
			policyHash: "legacy",
			generatedAtMs: 0,
			installRecords,
			plugins: [],
			diagnostics: []
		});
	} catch {
		return null;
	}
}
function readLegacyTopLevelInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const legacy = parsed;
	const key = Object.hasOwn(legacy, "installRecords") ? "installRecords" : Object.hasOwn(legacy, "records") ? "records" : void 0;
	return key ? parsePluginInstallRecordMap(legacy[key]) : void 0;
}
function readLegacyEmbeddedInstallRecords(parsed) {
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const plugins = parsed.plugins;
	if (!Array.isArray(plugins)) return null;
	const records = createPluginInstallRecordMap();
	let found = false;
	for (const plugin of plugins) {
		if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) return null;
		if (!Object.hasOwn(plugin, "installRecord")) continue;
		const pluginId = plugin.pluginId;
		const installRecord = plugin.installRecord;
		if (typeof pluginId !== "string" || !pluginId.trim()) return null;
		setPluginInstallRecordMapEntry(records, pluginId, installRecord);
		found = true;
	}
	return found ? parsePluginInstallRecordMap(records) : null;
}
function legacyInstalledPluginIndexMatches(current, legacy) {
	return serializePluginInstallRecordMap(current.installRecords) === serializePluginInstallRecordMap(legacy.installRecords) && JSON.stringify(current.plugins) === JSON.stringify(legacy.plugins) && JSON.stringify(current.diagnostics) === JSON.stringify(legacy.diagnostics);
}
function readInstallRecordField(record, key) {
	return record[key];
}
function readInstallRecordStringField(record, key) {
	const value = readInstallRecordField(record, key);
	return typeof value === "string" ? value : void 0;
}
function legacyInstallRecordHasCurrentResolvedIdentity(params) {
	const { currentRecord, legacyRecord } = params;
	const currentResolvedSpec = readInstallRecordStringField(currentRecord, "resolvedSpec");
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	if (legacySpec) return currentResolvedSpec === legacySpec;
	const legacyResolvedSpec = readInstallRecordStringField(legacyRecord, "resolvedSpec");
	return Boolean(legacyResolvedSpec && currentResolvedSpec === legacyResolvedSpec);
}
function readAuthoritativeCurrentNpmIdentity(record) {
	const resolvedName = readInstallRecordStringField(record, "resolvedName");
	const resolvedVersion = readInstallRecordStringField(record, "resolvedVersion");
	if (resolvedName && resolvedVersion) return {
		name: resolvedName,
		version: resolvedVersion
	};
	const resolvedSpec = readInstallRecordStringField(record, "resolvedSpec");
	const parsed = resolvedSpec ? parseRegistryNpmSpec(resolvedSpec) : null;
	if (parsed?.selectorKind === "exact-version" && parsed.selector) return {
		name: parsed.name,
		version: parsed.selector
	};
	return null;
}
function legacyNpmInstallRecordSupersededByCurrent(params) {
	const { currentRecord, legacyRecord } = params;
	if (currentRecord.source !== "npm" || legacyRecord.source !== "npm") return false;
	const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
	const legacyParsedSpec = legacySpec ? parseRegistryNpmSpec(legacySpec) : null;
	if (legacyParsedSpec?.selectorKind !== "exact-version") return false;
	const currentIdentity = readAuthoritativeCurrentNpmIdentity(currentRecord);
	return Boolean(currentIdentity && legacyParsedSpec.selector && currentIdentity.name === legacyParsedSpec.name && currentIdentity.version === legacyParsedSpec.selector);
}
function legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord) {
	if (currentRecord.source !== legacyRecord.source) return false;
	if (legacyNpmInstallRecordSupersededByCurrent({
		currentRecord,
		legacyRecord
	})) return true;
	for (const key of Object.keys(legacyRecord).toSorted()) {
		const currentValue = readInstallRecordField(currentRecord, key);
		if (currentValue === readInstallRecordField(legacyRecord, key)) continue;
		if (key === "spec" && legacyInstallRecordHasCurrentResolvedIdentity({
			currentRecord,
			legacyRecord
		})) continue;
		if ((key === "resolvedAt" || key === "installedAt") && typeof currentValue === "string") continue;
		return false;
	}
	return true;
}
function mergeLegacyInstalledPluginIndexRecords(current, legacy) {
	const installRecords = copyPluginInstallRecordMap(current.installRecords);
	const conflicts = [];
	let addedCount = 0;
	for (const [pluginId, legacyRecord] of Object.entries(legacy.installRecords)) {
		const currentRecord = getPluginInstallRecordMapEntry(installRecords, pluginId);
		if (!currentRecord) {
			setPluginInstallRecordMapEntry(installRecords, pluginId, legacyRecord);
			addedCount += 1;
			continue;
		}
		if (!legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord)) conflicts.push(pluginId);
	}
	return {
		merged: {
			...current,
			installRecords
		},
		addedCount,
		conflicts
	};
}
function archiveLegacyInstalledPluginIndex(params) {
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: "plugin install index",
		warnings: params.warnings
	});
	if (!resolution) return;
	params.changes.push(resolution.action === "removed" ? `Removed already-archived plugin install index legacy source ${params.sourcePath}` : `Archived plugin install index legacy source → ${resolution.targetPath}`);
}
function hardenLegacyImportSource(params) {
	try {
		fs.chmodSync(params.sourcePath, 384);
		return true;
	} catch (err) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
		return false;
	}
}
function archiveLegacyImportSource(params) {
	if (!hardenLegacyImportSource(params)) return null;
	const resolution = archiveLegacyFileSource({
		sourcePath: params.sourcePath,
		label: `${params.label} legacy source`,
		warnings: params.warnings
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
function legacyKeyValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return `${value}`;
	return "";
}
function legacyRowsMatch(existing, incoming, columns) {
	return columns.every((column) => normalizeLegacySqliteInteger(existing[column]) === normalizeLegacySqliteInteger(incoming[column]));
}
async function migrateLegacyTaskRunsSidecar(params) {
	const sourcePath = resolveLegacyTaskRunsSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacySqliteSidecar({
			sourcePath,
			label: "task registry",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let taskRows;
	let deliveryRows;
	try {
		taskRows = readLegacyTaskRows(sourcePath);
		deliveryRows = readLegacyTaskDeliveryRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let importedTasks = 0;
		let importedDeliveryStates = 0;
		let skippedOrphanDeliveryStates = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const taskColumns = [
				"runtime",
				"task_kind",
				"source_id",
				"requester_session_key",
				"owner_key",
				"scope_kind",
				"child_session_key",
				"parent_flow_id",
				"parent_task_id",
				"agent_id",
				"requester_agent_id",
				"run_id",
				"label",
				"task",
				"status",
				"delivery_status",
				"notify_policy",
				"created_at",
				"started_at",
				"ended_at",
				"last_event_at",
				"cleanup_after",
				"error",
				"progress_summary",
				"terminal_summary",
				"terminal_outcome",
				"detail_json"
			];
			for (const row of taskRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "task migration row key"));
				const existing = db.prepare(`SELECT ${taskColumns.join(", ")} FROM task_runs WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch({
						...existing,
						run_id: normalizeOptionalString(existing.run_id) ?? null
					}, {
						...row,
						run_id: normalizeOptionalString(row.run_id) ?? null
					}, taskColumns)) conflicts.push(taskId);
					continue;
				}
				insertTaskRunRowSql(db, row);
				importedTasks++;
			}
			const deliveryColumns = ["requester_origin_json", "last_notified_event_at"];
			for (const row of deliveryRows) {
				const taskId = legacyKeyValue(expectDefined(row.task_id, "delivery migration row key"));
				const existing = db.prepare(`SELECT requester_origin_json, last_notified_event_at FROM task_delivery_state WHERE task_id = ?`).get(taskId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, deliveryColumns)) conflicts.push(`${taskId}/delivery`);
					continue;
				}
				if (!db.prepare("SELECT 1 FROM task_runs WHERE task_id = ?").get(taskId)) {
					skippedOrphanDeliveryStates++;
					continue;
				}
				insertTaskDeliveryRowSql(db, row);
				importedDeliveryStates++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
			repairLegacyTaskIdentifiers(db);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (importedTasks > 0) changes.push(`Migrated ${importedTasks} task registry sidecar ${importedTasks === 1 ? "row" : "rows"} → shared SQLite state`);
		if (importedDeliveryStates > 0) changes.push(`Migrated ${importedDeliveryStates} task delivery sidecar ${importedDeliveryStates === 1 ? "row" : "rows"} → shared SQLite state`);
		if (skippedOrphanDeliveryStates > 0) warnings.push(`Skipped ${skippedOrphanDeliveryStates} orphan task delivery sidecar ${skippedOrphanDeliveryStates === 1 ? "row" : "rows"} with no task run`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task registry sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task registry sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacySqliteSidecar({
		sourcePath,
		label: "task registry",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyFlowRunsSidecar(params) {
	const sourcePath = resolveLegacyFlowRunsSidecarPath(params.stateDir);
	if (!migrationFileExists(sourcePath)) {
		const changes = [];
		const warnings = [];
		if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES)) archiveLegacySqliteSidecar({
			sourcePath,
			label: "task flow",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	const changes = [];
	const warnings = [];
	let rows;
	try {
		rows = readLegacyFlowRows(sourcePath);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	try {
		const conflicts = [];
		let imported = 0;
		runOpenClawStateWriteTransaction(({ db }) => {
			const columns = [
				"shape",
				"sync_mode",
				"owner_key",
				"requester_origin_json",
				"controller_id",
				"revision",
				"status",
				"notify_policy",
				"goal",
				"current_step",
				"blocked_task_id",
				"blocked_summary",
				"state_json",
				"wait_json",
				"cancel_requested_at",
				"created_at",
				"updated_at",
				"ended_at"
			];
			for (const row of rows) {
				const flowId = legacyKeyValue(expectDefined(row.flow_id, "flow migration row key"));
				const existing = db.prepare(`SELECT ${columns.join(", ")} FROM flow_runs WHERE flow_id = ?`).get(flowId);
				if (existing) {
					if (!legacyRowsMatch(existing, row, columns)) conflicts.push(flowId);
					continue;
				}
				insertFlowRunRowSql(db, row);
				imported++;
			}
			if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		if (imported > 0) changes.push(`Migrated ${imported} task flow sidecar ${imported === 1 ? "row" : "rows"} → shared SQLite state`);
	} catch (err) {
		if (err instanceof LegacyTaskStateSidecarConflictError) return {
			changes,
			warnings: [`Left task flow sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`]
		};
		return {
			changes,
			warnings: [`Failed migrating task flow sidecar ${sourcePath}: ${String(err)}`]
		};
	}
	archiveLegacySqliteSidecar({
		sourcePath,
		label: "task flow",
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
async function migrateLegacyTaskStateSidecars(params) {
	const taskRuns = await migrateLegacyTaskRunsSidecar(params);
	const flowRuns = await migrateLegacyFlowRunsSidecar(params);
	return {
		changes: [...taskRuns.changes, ...flowRuns.changes],
		warnings: [...taskRuns.warnings, ...flowRuns.warnings]
	};
}
function buildLegacyDeliveryQueueRow(params) {
	const originalEnqueuedAt = asSafeIntegerInRange(params.entry.enqueuedAt, { min: 0 }) ?? params.now;
	const retryCount = asSafeIntegerInRange(params.entry.retryCount, { min: 0 }) ?? 0;
	const lastAttemptAt = asSafeIntegerInRange(params.entry.lastAttemptAt, { min: 0 });
	const platformSendStartedAt = asSafeIntegerInRange(params.entry.platformSendStartedAt, { min: 0 });
	const failed = params.status === "failed";
	const retention = failed ? inferDeliveryQueueFailureRetention(params.entry, params.id, params.queueName) : void 0;
	if (failed && !retention) return null;
	const failedAt = failed ? asSafeIntegerInRange(params.entry.failedAt, { min: 0 }) ?? lastAttemptAt ?? originalEnqueuedAt : null;
	const enqueuedAt = failedAt ?? originalEnqueuedAt;
	const meta = failed ? void 0 : deliveryQueueMetadata(params.queueName, params.entry);
	const retainedEntry = {
		...params.entry,
		id: params.id,
		enqueuedAt,
		retryCount
	};
	if (lastAttemptAt === void 0) delete retainedEntry.lastAttemptAt;
	else retainedEntry.lastAttemptAt = lastAttemptAt;
	if (platformSendStartedAt === void 0) delete retainedEntry.platformSendStartedAt;
	else retainedEntry.platformSendStartedAt = platformSendStartedAt;
	const failedEntry = failed ? projectDeliveryQueueTerminalEntry({
		id: params.id,
		retryCount
	}, enqueuedAt, "failed", retention) : void 0;
	return {
		queue_name: params.queueName,
		id: params.id,
		status: params.status,
		entry_kind: meta?.entryKind ?? null,
		session_key: meta?.sessionKey ?? null,
		channel: meta?.channel ?? null,
		target: meta?.target ?? null,
		account_id: meta?.accountId ?? null,
		retry_count: retryCount,
		last_attempt_at: !failed ? lastAttemptAt ?? null : null,
		last_error: !failed && typeof params.entry.lastError === "string" ? params.entry.lastError : null,
		recovery_state: failed ? failedEntry?.recoveryState ?? null : typeof params.entry.recoveryState === "string" ? params.entry.recoveryState : null,
		platform_send_started_at: !failed ? platformSendStartedAt ?? null : null,
		entry_json: JSON.stringify(failedEntry ?? retainedEntry),
		enqueued_at: enqueuedAt,
		updated_at: params.now,
		failed_at: failedAt
	};
}
function legacyDeliveryQueueRowsMatch(existing, incoming) {
	return [
		"status",
		"entry_kind",
		"session_key",
		"channel",
		"target",
		"account_id",
		"retry_count",
		"last_attempt_at",
		"last_error",
		"recovery_state",
		"platform_send_started_at",
		"entry_json",
		"enqueued_at",
		"failed_at"
	].every((column) => {
		const left = existing[column];
		const right = incoming[column];
		if (typeof left === "bigint" || typeof right === "bigint") return normalizeLegacySqliteInteger(left) === normalizeLegacySqliteInteger(right);
		return left === right;
	});
}
/** Never recursively remove a queue directory containing retained archives or unknown files. */
function removeEmptyLegacyDeliveryQueueDirs(queueDir) {
	for (const dir of [path.join(queueDir, "failed"), queueDir]) try {
		fs.rmdirSync(dir);
	} catch (error) {
		if (![
			"ENOENT",
			"ENOTEMPTY",
			"EEXIST"
		].includes(error.code ?? "")) throw error;
	}
}
async function migrateLegacyDeliveryQueues(params) {
	const changes = [];
	const warnings = [];
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const now = Date.now();
	let refused = false;
	for (const queue of LEGACY_DELIVERY_QUEUE_DIRS) {
		const queueDir = resolveLegacyDeliveryQueuePath(params.stateDir, queue.dirName);
		const files = listLegacyDeliveryQueueFiles(queueDir);
		const markerPaths = listLegacyDeliveryQueueDeliveredMarkers(queueDir);
		if (files.length === 0 && markerPaths.length === 0) continue;
		const imports = [];
		const sourceIds = /* @__PURE__ */ new Map();
		const unresolvedPendingIds = /* @__PURE__ */ new Set();
		const conflicts = [];
		let imported = 0;
		const deliveredNames = new Set(markerPaths.map((file) => path.basename(file, ".delivered")));
		const deliveredIds = new Set(deliveredNames);
		const markerIds = new Map([...deliveredNames].map((name) => [name, /* @__PURE__ */ new Set([name])]));
		for (const file of [...files, ...markerPaths.map((sourcePath) => ({
			sourcePath,
			status: "delivered"
		}))]) try {
			const snapshot = readLegacyMigrationSourceSnapshotSync({
				sourcePath: file.sourcePath,
				label: queue.label
			});
			let reason;
			let mediaPaths = [];
			let row = null;
			if (file.status === "delivered") {
				reason = "delivered";
				try {
					const id = asNullableRecord(JSON.parse(snapshot.raw))?.id;
					if (typeof id === "string" && id) {
						deliveredIds.add(id);
						markerIds.get(path.basename(file.sourcePath, ".delivered"))?.add(id);
					}
				} catch {}
			} else {
				const parsed = JSON.parse(snapshot.raw);
				if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("expected a queue entry object");
				const entry = parsed;
				const id = typeof entry.id === "string" ? entry.id : path.basename(file.sourcePath, ".json");
				if (!id) throw new Error("missing queue entry id");
				const enqueuedAt = asSafeIntegerInRange(entry.enqueuedAt, { min: 0 });
				if (file.status === "pending") {
					sourceIds.set(file.sourcePath, id);
					if (deliveredNames.has(path.basename(file.sourcePath, ".json")) || deliveredNames.has(id)) reason = "delivered";
					else if (enqueuedAt === void 0 || enqueuedAt > now) reason = "unverified enqueue time";
					else if (now - enqueuedAt >= LEGACY_DELIVERY_QUEUE_MAX_AGE_MS) reason = "at least 72 hours old";
				}
				if (reason && reason !== "delivered" || file.status === "failed") mediaPaths = (await import("./state-migrations.delivery-queue-media-YnK7fXOY.mjs")).resolveLegacyDeliveryQueueMediaPaths(entry, params.stateDir);
				if (!reason) row = buildLegacyDeliveryQueueRow({
					queueName: queue.queueName,
					id,
					status: file.status,
					entry,
					now
				});
			}
			imports.push({
				snapshot,
				sourceKey: resolveLegacyMigrationSourceKey("delivery-queue", file.sourcePath, snapshot.sha256),
				row,
				reason,
				mediaPaths
			});
		} catch (error) {
			if (file.status === "pending") unresolvedPendingIds.add(sourceIds.get(file.sourcePath));
			refused = true;
			warnings.push(`Left malformed ${queue.label} source ${file.sourcePath} in place: ${String(error)}`);
		}
		for (const [sourcePath, id] of sourceIds) if (deliveredNames.has(path.basename(sourcePath, ".json"))) {
			deliveredIds.add(id);
			markerIds.get(path.basename(sourcePath, ".json"))?.add(id);
		}
		for (const item of imports) {
			const id = sourceIds.get(item.snapshot.sourcePath);
			if (id !== void 0 && deliveredIds.has(id)) {
				item.row = null;
				item.reason = "delivered";
				item.mediaPaths = [];
			}
		}
		const committed = [];
		try {
			runOpenClawStateWriteTransaction(({ db }) => {
				const insert = db.prepare(`INSERT INTO delivery_queue_entries (queue_name, id, status, entry_kind, session_key, channel, target, account_id, retry_count, last_attempt_at, last_error, recovery_state, platform_send_started_at, entry_json, enqueued_at, updated_at, failed_at) VALUES (@queue_name, @id, @status, @entry_kind, @session_key, @channel, @target, @account_id, @retry_count, @last_attempt_at, @last_error, @recovery_state, @platform_send_started_at, @entry_json, @enqueued_at, @updated_at, @failed_at)`);
				for (const item of imports) {
					const { snapshot, sourceKey, row } = item;
					assertLegacyMigrationSourceUnchanged({
						sourcePath: snapshot.sourcePath,
						snapshot,
						label: queue.label
					});
					const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
					if (receipt) {
						const report = asNullableRecord(JSON.parse(receipt.reportJson));
						const reason = report?.reason;
						const mediaPaths = report?.mediaPaths;
						if (typeof reason !== "string" || !Array.isArray(mediaPaths) || !mediaPaths.every((value) => typeof value === "string")) throw new Error("Legacy delivery import receipt has no verified disposition");
						committed.push({
							...item,
							reason: reason === "imported" ? void 0 : reason,
							mediaPaths,
							mediaBackups: report?.mediaBackups
						});
						continue;
					}
					if (row) {
						const existing = db.prepare("SELECT * FROM delivery_queue_entries WHERE queue_name = ? AND id = ?").get(queue.queueName, row.id);
						if (existing && !legacyDeliveryQueueRowsMatch(existing, row)) {
							conflicts.push(row.id);
							continue;
						}
						if (!existing) {
							insert.run(row);
							imported++;
						}
					}
					recordLegacyMigrationReceipt(db, {
						sourceKey,
						migrationKind: "delivery-queues",
						sourcePath: snapshot.sourcePath,
						targetTable: "delivery_queue_entries",
						sourceSha256: snapshot.sha256,
						sourceSizeBytes: snapshot.size,
						sourceRecordCount: 1,
						runId: randomUUID(),
						now,
						reportJson: JSON.stringify({
							queueName: queue.queueName,
							reason: item.reason ?? "imported",
							mediaPaths: item.mediaPaths,
							mediaPreserved: item.mediaPaths.length === 0
						})
					});
					committed.push(item);
				}
			}, { env });
		} catch (error) {
			refused = true;
			warnings.push(`Failed migrating ${queue.label} ${queueDir}: ${String(error)}`);
			continue;
		}
		if (imported > 0) changes.push(`Migrated ${imported} ${queue.label} ${imported === 1 ? "entry" : "entries"} → shared SQLite state`);
		if (conflicts.length > 0) {
			refused = true;
			warnings.push(`Left ${queue.label} in place because ${conflicts.length} ${conflicts.length === 1 ? "entry" : "entries"} already existed in shared state: ${conflicts[0]}`);
		}
		for (const { snapshot, sourceKey, reason, mediaPaths, mediaBackups } of committed) {
			const ids = markerIds.get(path.basename(snapshot.sourcePath, ".delivered"));
			if (reason === "delivered" && [...unresolvedPendingIds].some((id) => id === void 0 || id === sourceIds.get(snapshot.sourcePath) || ids?.has(id))) continue;
			if (snapshot.sourcePath.endsWith(".delivered") && ids && files.some((file) => file.status === "pending" && (ids.has(path.basename(file.sourcePath, ".json")) || ids.has(sourceIds.get(file.sourcePath) ?? "")) && migrationFileExists(file.sourcePath))) continue;
			const recordMediaPreservation = (preserved, copies) => {
				runOpenClawStateWriteTransaction(({ db }) => {
					db.prepare("UPDATE migration_sources SET report_json = ?, removed_source = 0 WHERE source_key = ?").run(JSON.stringify({
						queueName: queue.queueName,
						reason: reason ?? "imported",
						mediaPaths,
						mediaPreserved: preserved,
						mediaBackups: copies
					}), sourceKey);
				}, { env });
			};
			try {
				assertLegacyMigrationSourceUnchanged({
					sourcePath: snapshot.sourcePath,
					snapshot,
					label: queue.label
				});
				if (mediaPaths.length > 0) recordMediaPreservation(false, mediaBackups);
				const mediaArchive = mediaPaths.length > 0 ? await (await import("./state-migrations.delivery-queue-media-YnK7fXOY.mjs")).preserveLegacyDeliveryQueueMedia({
					mediaPaths,
					previousBackups: mediaBackups,
					sourcePath: snapshot.sourcePath,
					stateDir: params.stateDir
				}) : void 0;
				if (mediaArchive) recordMediaPreservation(true, mediaArchive.copies);
				assertLegacyMigrationSourceUnchanged({
					sourcePath: snapshot.sourcePath,
					snapshot,
					label: queue.label
				});
				const archive = archiveLegacyImportSource({
					sourcePath: snapshot.sourcePath,
					label: queue.label,
					changes,
					warnings
				});
				if (archive) markLegacyMigrationSourceRemoved(sourceKey, env);
				if (reason && reason !== "delivered") warnings.push(`Did not replay ${queue.label} source ${snapshot.sourcePath}: ${reason}. Original content is retained at ${archive?.targetPath ?? snapshot.sourcePath}${mediaArchive ? `; queue-owned media copies: ${mediaArchive.directory}` : ""}; review it before explicitly sending a new message. Do not restore it to the queue.`);
			} catch (error) {
				warnings.push(`Retained ${queue.label} source or archive ${snapshot.sourcePath}; run openclaw doctor --fix to retry cleanup: ${String(error)}`);
			}
		}
		try {
			removeEmptyLegacyDeliveryQueueDirs(queueDir);
		} catch (error) {
			warnings.push(`Failed cleaning empty ${queue.label} directory ${queueDir}: ${String(error)}`);
		}
	}
	return {
		changes,
		warnings,
		...!refused && warnings.length > 0 ? { warningDisposition: "recoverable" } : {}
	};
}
//#endregion
export { resolveLegacyTaskRunsSidecarPath as _, archiveLegacyPluginStateSidecar as a, legacyInstalledPluginIndexMatches as c, migrateLegacyDeliveryQueues as d, migrateLegacyTaskStateSidecars as f, resolveLegacyPluginStateSidecarPath as g, resolveLegacyFlowRunsSidecarPath as h, archiveLegacyInstalledPluginIndex as i, legacyPluginStateRowsMatch as l, readLegacyPluginStateSidecarRows as m, TASK_STATE_SQLITE_SIDECAR_SUFFIXES as n, hasPendingSqliteSidecarArchive as o, readLegacyInstalledPluginIndex as p, archiveLegacyImportSource as r, isLegacyPluginStateRowExpired as s, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES as t, mergeLegacyInstalledPluginIndexRecords as u, normalizeLegacySqliteInteger as v };
