import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as readSqliteDataVersion } from "./node-sqlite-BO6jRFcG.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as tableHasColumn, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { O as ensureWorkerEnvironmentNodeEnrollmentSchema, c as runOpenClawStateWriteTransaction, g as ensureDevicePairSetupCompletionSchema, h as ensureDevicePairSetupBootstrapSchema, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-CYN-08F6.mjs";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-C9ABaq_h.mjs";
import { v as resolvePairingSetupAccess } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { r as isNodeHostStats } from "./node-host-stats-CxZOAai3.mjs";
import { t as clearApnsRegistrationFromDatabase } from "./push-apns-store-transaction--RBZ168D.mjs";
import { r as pruneExpiredPending } from "./pairing-files-BJQEMPCI.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
//#region src/infra/device-pairing-cloud-worker.ts
/** Bind one environment-owned setup completion inside the pairing transaction. */
function bindCloudWorkerSetupCompletion(params) {
	ensureWorkerEnvironmentNodeEnrollmentSchema(params.db);
	const kysely = getNodeSqliteKysely(params.db);
	const environment = executeSqliteQueryTakeFirstSync(params.db, kysely.selectFrom("worker_environments").select([
		"environment_id",
		"state",
		"destroy_requested_at_ms",
		"node_device_id",
		"updated_at_ms"
	]).where("node_setup_id", "=", params.completion.setupId));
	if (!environment) throw new Error("Cloud worker setup completion has no owning environment");
	const isFirstProvisioningDevice = environment.state === "provisioning" && environment.node_device_id === null;
	const isSameLiveDevice = environment.node_device_id === params.completion.deviceId && [
		"provisioning",
		"bootstrapping",
		"ready",
		"idle",
		"attached"
	].includes(environment.state);
	if (environment.destroy_requested_at_ms !== null || !isFirstProvisioningDevice && !isSameLiveDevice) throw new Error("Cloud worker setup completion owner is no longer pending");
	executeSqliteQuerySync(params.db, kysely.updateTable("worker_environments").set({
		node_device_id: params.completion.deviceId,
		updated_at_ms: Math.max(environment.updated_at_ms, params.completion.completedAtMs)
	}).where("environment_id", "=", environment.environment_id));
	return {
		environmentId: environment.environment_id,
		nodeDeviceId: params.completion.deviceId,
		updatedAtMs: Math.max(environment.updated_at_ms, params.completion.completedAtMs)
	};
}
//#endregion
//#region src/infra/device-pairing-store-cache.ts
const cache = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingStoreCache"), () => ({ value: void 0 }));
function invalidateDevicePairingStoreCache(database) {
	if (cache.value?.connection === database.db && cache.value.path === database.path) cache.value = void 0;
}
/** A content revision is comparable across reader and writer connections. */
function resolveDevicePairingStoreRevision(paired) {
	return createHash("sha256").update(JSON.stringify(Object.values(paired).toSorted((a, b) => a.deviceId < b.deviceId ? -1 : a.deviceId > b.deviceId ? 1 : 0))).digest("hex");
}
/** Borrowed worker facts; projections must not mutate this revision's cached rows. */
function readCachedDevicePairingStoreSnapshot(db, path, read) {
	if (db.isTransaction) {
		const state = read();
		return {
			state,
			revision: resolveDevicePairingStoreRevision(state.pairedByDeviceId)
		};
	}
	const dataVersion = readSqliteDataVersion(db);
	const cached = cache.value;
	if (cached?.connection === db && cached.path === path && cached.dataVersion === dataVersion) return cached;
	const state = runSqliteDeferredTransactionSync(db, read);
	const revision = resolveDevicePairingStoreRevision(state.pairedByDeviceId);
	cache.value = {
		connection: db,
		path,
		state,
		dataVersion,
		revision
	};
	return cache.value;
}
//#endregion
//#region src/infra/device-pairing-store.ts
const DEVICE_BOOTSTRAP_TOKEN_COLUMNS_WITHOUT_SETUP = [
	"device_id",
	"issued_at_ms",
	"last_used_at_ms",
	"pending_profile_json",
	"profile_json",
	"public_key",
	"redeemed_profile_json",
	"token",
	"token_key",
	"ts"
];
const boundDatabase = new AsyncLocalStorage();
/** Keep nested domain kernels on the broker's admitted physical connection. */
function withDevicePairingStoreDatabase(database, operate) {
	return boundDatabase.run(database, operate);
}
/** Route an explicit pairing base dir (tests, alternate state roots) to that dir's DB. */
function resolveDevicePairingStateDbOptions(baseDir) {
	const database = boundDatabase.getStore();
	if (database) return {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	};
	return baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {};
}
function runDevicePairingStoreMutation(baseDir, mutate) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	return runOpenClawStateWriteTransaction((transactionDatabase) => {
		const result = mutate(transactionDatabase);
		if (result.mutated) stageSqliteTransactionState(transactionDatabase.db, {
			stage: () => void 0,
			rollback: () => void 0,
			commit: () => invalidateDevicePairingStoreCache(transactionDatabase)
		});
		return result.value;
	}, {
		...databaseOptions,
		database
	});
}
const APPROVAL_KINDS = new Set(Object.keys({
	owner: true,
	silent: true,
	"trusted-cidr": true,
	"trusted-proxy": true,
	"ssh-verified": true,
	bootstrap: true
}));
function toJsonColumn(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function fromJsonColumn(value) {
	return value === null ? void 0 : JSON.parse(value);
}
function toBooleanColumn(value) {
	return value === void 0 ? null : value ? 1 : 0;
}
function optional(key, value) {
	return value === null ? {} : { [key]: value };
}
function toPendingRow(record) {
	return {
		request_id: record.requestId,
		device_id: record.deviceId,
		public_key: record.publicKey,
		display_name: record.displayName ?? null,
		platform: record.platform ?? null,
		device_family: record.deviceFamily ?? null,
		client_id: record.clientId ?? null,
		client_mode: record.clientMode ?? null,
		browser_origin: record.browserOrigin ?? null,
		role: record.role ?? null,
		roles_json: toJsonColumn(record.roles),
		scopes_json: toJsonColumn(record.scopes),
		remote_ip: record.remoteIp ?? null,
		silent: toBooleanColumn(record.silent),
		is_repair: toBooleanColumn(record.isRepair),
		ts: record.ts,
		refreshed_at_ms: record.refreshedAtMs ?? null
	};
}
function fromPendingRow(row) {
	return {
		requestId: row.request_id,
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("silent", row.silent === null ? null : row.silent !== 0),
		...optional("isRepair", row.is_repair === null ? null : row.is_repair !== 0),
		ts: row.ts,
		...optional("refreshedAtMs", row.refreshed_at_ms)
	};
}
function toPairedRow(device) {
	return {
		device_id: device.deviceId,
		public_key: device.publicKey,
		display_name: device.displayName ?? null,
		operator_label: device.operatorLabel ?? null,
		platform: device.platform ?? null,
		device_family: device.deviceFamily ?? null,
		client_id: device.clientId ?? null,
		client_mode: device.clientMode ?? null,
		browser_origin: device.browserOrigin ?? null,
		role: device.role ?? null,
		roles_json: toJsonColumn(device.roles),
		scopes_json: toJsonColumn(device.scopes),
		approved_scopes_json: toJsonColumn(device.approvedScopes),
		remote_ip: device.remoteIp ?? null,
		tokens_json: toJsonColumn(device.tokens),
		approved_via: device.approvedVia ?? null,
		node_surface_json: toJsonColumn(device.nodeSurface),
		pending_node_surface_json: toJsonColumn(device.pendingNodeSurface),
		created_at_ms: device.createdAtMs,
		approved_at_ms: device.approvedAtMs,
		last_seen_at_ms: device.lastSeenAtMs ?? null,
		last_seen_reason: device.lastSeenReason ?? null
	};
}
function fromApprovedViaColumn(value) {
	return value !== null && APPROVAL_KINDS.has(value) ? value : null;
}
const PAIRING_SETUP_ACCESS_VALUES = new Set(Object.keys({
	full: true,
	limited: true,
	node: true
}));
function fromSetupCompletionAccessColumn(value) {
	return PAIRING_SETUP_ACCESS_VALUES.has(value) ? value : "limited";
}
function fromSetupCompletionDeliveryStateColumn(value) {
	return value === "confirmed" ? "confirmed" : "uncertain";
}
function fromPairedRow(row) {
	const nodeSurface = fromJsonColumn(row.node_surface_json);
	if (nodeSurface?.lastHostStats !== void 0 && !isNodeHostStats(nodeSurface.lastHostStats)) delete nodeSurface.lastHostStats;
	return {
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("operatorLabel", row.operator_label),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("approvedScopes", fromJsonColumn(row.approved_scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("tokens", fromJsonColumn(row.tokens_json) ?? null),
		...optional("approvedVia", fromApprovedViaColumn(row.approved_via)),
		...optional("nodeSurface", nodeSurface ?? null),
		...optional("pendingNodeSurface", fromJsonColumn(row.pending_node_surface_json) ?? null),
		createdAtMs: row.created_at_ms,
		approvedAtMs: row.approved_at_ms,
		...optional("lastSeenAtMs", row.last_seen_at_ms),
		...optional("lastSeenReason", row.last_seen_reason)
	};
}
function toBootstrapRow(tokenKey, record) {
	return {
		token_key: tokenKey,
		token: record.token,
		setup_id: record.setupId ?? null,
		ts: record.ts,
		device_id: record.deviceId ?? null,
		public_key: record.publicKey ?? null,
		profile_json: toJsonColumn(record.profile),
		redeemed_profile_json: toJsonColumn(record.redeemedProfile),
		pending_profile_json: toJsonColumn(record.pendingProfile),
		issued_at_ms: record.issuedAtMs,
		last_used_at_ms: record.lastUsedAtMs ?? null
	};
}
function fromBootstrapRow(row) {
	return {
		token: row.token,
		...optional("setupId", row.setup_id),
		ts: row.ts,
		...optional("deviceId", row.device_id),
		...optional("publicKey", row.public_key),
		...optional("profile", fromJsonColumn(row.profile_json) ?? null),
		...optional("redeemedProfile", fromJsonColumn(row.redeemed_profile_json) ?? null),
		...optional("pendingProfile", fromJsonColumn(row.pending_profile_json) ?? null),
		issuedAtMs: row.issued_at_ms,
		...optional("lastUsedAtMs", row.last_used_at_ms)
	};
}
function readDevicePairingStoreStateFromDatabase(db) {
	const kysely = getNodeSqliteKysely(db);
	const pendingById = {};
	for (const row of executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_pending").selectAll()).rows) pendingById[row.request_id] = fromPendingRow(row);
	return {
		pendingById,
		pairedByDeviceId: Object.fromEntries(executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_paired").selectAll()).rows.map((row) => [row.device_id, fromPairedRow(row)]))
	};
}
/** Load the full pending + paired device snapshot from the shared state DB. */
function loadDevicePairingStoreState(baseDir) {
	const database = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	return structuredClone(readCachedDevicePairingStoreSnapshot(database.db, database.path, () => readDevicePairingStoreStateFromDatabase(database.db)).state);
}
/** Load one paired-device row from an existing shared-state transaction. */
function loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId) {
	const normalizedDeviceId = deviceId.trim();
	if (!normalizedDeviceId) return null;
	const kysely = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pairing_paired").selectAll().where("device_id", "=", normalizedDeviceId));
	return row ? fromPairedRow(row) : null;
}
/** Read, validate, and update one paired node surface in a single cross-process transaction. */
function updatePairedDeviceNodeSurfaceInTransaction(deviceId, baseDir, update) {
	return runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const normalizedDeviceId = deviceId.trim();
		const device = normalizedDeviceId ? loadPairedDevicePairingStoreRecordFromDatabase(db, normalizedDeviceId) : null;
		const result = update(device);
		if (!result.persist) return {
			mutated: false,
			value: result.value
		};
		if (!device) throw new Error("cannot update a missing paired-device node surface");
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("device_pairing_paired").set({ node_surface_json: toJsonColumn(result.nodeSurface) }).where("device_id", "=", normalizedDeviceId));
		return {
			mutated: true,
			value: result.value
		};
	});
}
/** Read, validate, and update one paired-device presence row in one transaction. */
function updatePairedDevicePresenceInTransaction(deviceId, baseDir, update) {
	return runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const normalizedDeviceId = deviceId.trim();
		const device = normalizedDeviceId ? loadPairedDevicePairingStoreRecordFromDatabase(db, normalizedDeviceId) : null;
		const result = update(device);
		if (!result.persist) return {
			mutated: false,
			value: result.value
		};
		if (!device) throw new Error("cannot update presence for a missing paired device");
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("device_pairing_paired").set({
			last_seen_at_ms: result.lastSeenAtMs,
			last_seen_reason: result.lastSeenReason
		}).where("device_id", "=", normalizedDeviceId));
		return {
			mutated: true,
			value: result.value
		};
	});
}
/** Replace the pending and/or paired table contents with the given snapshot. */
function persistDevicePairingStoreState(state, baseDir, target, options) {
	runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		if (target !== "paired") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_pending"));
			const rows = Object.values(state.pendingById).map(toPendingRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_pending").values(rows));
		}
		if (target !== "pending") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_paired"));
			const rows = Object.values(state.pairedByDeviceId).map(toPairedRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_paired").values(rows));
		}
		for (const nodeId of new Set(options?.clearApnsNodeIds ?? [])) clearApnsRegistrationFromDatabase(db, nodeId);
		if (options?.retiredNodeToken) clearDeviceAuthTokenFromDatabase(db, {
			...options.retiredNodeToken,
			role: "node"
		});
		return {
			mutated: true,
			value: void 0
		};
	});
}
/** Load all bootstrap token records keyed by token key. */
function loadDeviceBootstrapTokenRecords(baseDir) {
	const { db } = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	return readDeviceBootstrapTokenRecordsFromDatabase(db);
}
function readDeviceBootstrapTokenRecordsFromDatabase(db) {
	const kysely = getNodeSqliteKysely(db);
	const state = {};
	const rows = tableHasColumn(db, "device_bootstrap_tokens", "setup_id") ? executeSqliteQuerySync(db, kysely.selectFrom("device_bootstrap_tokens").selectAll()).rows : executeSqliteQuerySync(db, kysely.selectFrom("device_bootstrap_tokens").select(DEVICE_BOOTSTRAP_TOKEN_COLUMNS_WITHOUT_SETUP)).rows.map((row) => Object.assign(row, { setup_id: null }));
	for (const row of rows) state[row.token_key] = fromBootstrapRow(row);
	return state;
}
/** Replace the bootstrap token table contents with the given snapshot. */
function persistDeviceBootstrapTokenRecords(state, baseDir) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const rows = Object.entries(state).map(([tokenKey, record]) => toBootstrapRow(tokenKey, record));
		if (rows.some((row) => row.setup_id !== null)) ensureDevicePairSetupBootstrapSchema(db);
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_bootstrap_tokens"));
		if (rows.length > 0) {
			if (tableHasColumn(db, "device_bootstrap_tokens", "setup_id")) executeSqliteQuerySync(db, kysely.insertInto("device_bootstrap_tokens").values(rows));
			else {
				const rowsWithoutSetup = rows.map(({ setup_id: _setupId, ...row }) => row);
				executeSqliteQuerySync(db, kysely.insertInto("device_bootstrap_tokens").values(rowsWithoutSetup));
			}
		}
	}, resolveDevicePairingStateDbOptions(baseDir));
}
/** Consume one bound bootstrap credential and record its setup outcome atomically. */
function consumeDeviceBootstrapTokenWithSetupCompletionInTransaction(params) {
	const token = params.token.trim();
	const deviceId = params.deviceId.trim();
	if (!token || !deviceId) return null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureDevicePairSetupBootstrapSchema(db);
		ensureDevicePairSetupCompletionSchema(db);
		const kysely = getNodeSqliteKysely(db);
		const tokenRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_bootstrap_tokens").selectAll().where("token_key", "=", token).where("issued_at_ms", ">=", params.oldestValidIssuedAtMs));
		if (!tokenRow || tokenRow.token !== token || tokenRow.device_id?.trim() !== deviceId) return null;
		const record = fromBootstrapRow(tokenRow);
		const paired = record.setupId || params.pairedDeviceMatches ? loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId) : null;
		if (params.pairedDeviceMatches && !params.pairedDeviceMatches(paired, record)) return null;
		const deviceName = paired?.operatorLabel ?? paired?.displayName;
		const completion = record.setupId ? {
			setupId: record.setupId,
			deviceId,
			...deviceName ? { deviceName } : {},
			access: resolvePairingSetupAccess(record.profile),
			completedAtMs: params.completedAtMs,
			deliveryState: "uncertain",
			retainUntilMs: params.retainUntilMs
		} : void 0;
		if (!completion || record.profile?.purpose !== "cloud-worker") executeSqliteQuerySync(db, kysely.deleteFrom("device_bootstrap_tokens").where("token_key", "=", tokenRow.token_key));
		if (completion) {
			if (record.profile?.purpose === "cloud-worker") params.recordWorkerEnvironment(bindCloudWorkerSetupCompletion({
				db,
				completion
			}));
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pair_setup_completions").where((eb) => eb.or([eb("retain_until_ms", "<=", params.retentionNowMs), eb("setup_id", "=", completion.setupId)])));
			executeSqliteQuerySync(db, kysely.insertInto("device_pair_setup_completions").values({
				setup_id: completion.setupId,
				device_id: completion.deviceId,
				device_name: completion.deviceName ?? null,
				access: completion.access,
				completed_at_ms: completion.completedAtMs,
				delivery_state: completion.deliveryState,
				retain_until_ms: completion.retainUntilMs
			}));
		}
		return {
			record,
			...completion ? { completion } : {}
		};
	}, resolveDevicePairingStateDbOptions(params.baseDir));
}
/** Mark one consumed setup handoff as delivered without reviving an expired or replaced row. */
function confirmDevicePairSetupCompletionDeliveryInTransaction(params) {
	const setupId = params.setupId.trim();
	const deviceId = params.deviceId.trim();
	if (!setupId || !deviceId) return null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureDevicePairSetupCompletionSchema(db);
		const kysely = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, kysely.updateTable("device_pair_setup_completions").set({ delivery_state: "confirmed" }).where("setup_id", "=", setupId).where("device_id", "=", deviceId).where("retain_until_ms", ">", params.nowMs).returningAll());
		if (!row) return null;
		executeSqliteQuerySync(db, kysely.deleteFrom("device_bootstrap_tokens").where("setup_id", "=", setupId).where("device_id", "=", deviceId));
		return {
			setupId: row.setup_id,
			deviceId: row.device_id,
			...optional("deviceName", row.device_name),
			access: fromSetupCompletionAccessColumn(row.access),
			completedAtMs: row.completed_at_ms,
			deliveryState: fromSetupCompletionDeliveryStateColumn(row.delivery_state),
			retainUntilMs: row.retain_until_ms
		};
	}, resolveDevicePairingStateDbOptions(params.baseDir));
}
/** Prune retained setup outcomes when the Gateway maintenance owner ticks. */
function pruneExpiredDevicePairSetupCompletionRecords(nowMs, baseDir) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "device_pair_setup_completions")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const result = executeSqliteQuerySync(db, kysely.deleteFrom("device_pair_setup_completions").where("retain_until_ms", "<=", nowMs));
		return Number(result.numAffectedRows ?? 0);
	}, {
		...databaseOptions,
		database
	});
}
/** Prune elapsed setup completions, then read one live record. */
function loadDevicePairSetupCompletionRecord(setupId, nowMs, baseDir) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	ensureDevicePairSetupCompletionSchema(database.db);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_pair_setup_completions").where("retain_until_ms", "<=", nowMs));
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pair_setup_completions").selectAll().where("setup_id", "=", setupId));
		return row ? {
			setupId: row.setup_id,
			deviceId: row.device_id,
			...optional("deviceName", row.device_name),
			access: fromSetupCompletionAccessColumn(row.access),
			completedAtMs: row.completed_at_ms,
			deliveryState: fromSetupCompletionDeliveryStateColumn(row.delivery_state),
			retainUntilMs: row.retain_until_ms
		} : null;
	}, {
		...databaseOptions,
		database
	});
}
//#endregion
//#region src/infra/device-pairing-state.kernel.ts
const DEVICE_PAIRING_PENDING_TTL_MS = 3e5;
function pruneExpiredDevicePairingRequests(state, nowMs) {
	pruneExpiredPending(state.pendingById, nowMs, DEVICE_PAIRING_PENDING_TTL_MS);
}
/** Read authoritative rows inside the worker transaction or an admitted migration. */
function loadDevicePairingStateForMutation(nowMs, baseDir) {
	const state = loadDevicePairingStoreState(baseDir);
	pruneExpiredDevicePairingRequests(state, nowMs);
	return state;
}
/** Resolve the expiry timestamp for one pending device-pairing request. */
function resolvePairingRequestExpiry(timestampMs) {
	return timestampMs + DEVICE_PAIRING_PENDING_TTL_MS;
}
/** Normalize a device id at pairing state boundaries. */
function normalizeDevicePairingId(deviceId) {
	return deviceId.trim();
}
/** Normalize one requested or approved pairing role. */
function normalizeDevicePairingRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
/** Merge pairing roles while preserving first-seen order. */
function mergeDevicePairingRoles(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	if (roles.size === 0) return;
	return [...roles];
}
/** Merge pairing scopes while preserving first-seen order and explicit emptiness. */
function mergeDevicePairingScopes(...items) {
	const scopes = /* @__PURE__ */ new Set();
	let sawExplicitScopeList = false;
	for (const item of items) {
		if (!Array.isArray(item)) continue;
		sawExplicitScopeList = true;
		for (const scope of normalizeUniqueSingleOrTrimmedStringList(item)) scopes.add(scope);
	}
	if (scopes.size === 0) return sawExplicitScopeList ? [] : void 0;
	return [...scopes];
}
/** Preserve only approval scopes owned by one pairing role. */
function preserveDeviceRoleScopes(role, scopes) {
	return normalizeUniqueSingleOrTrimmedStringList(scopes).filter((scope) => role === "operator" ? scope.startsWith("operator.") : !scope.startsWith("operator."));
}
/** Compare pairing role or scope lists as unordered sets. */
function sameDevicePairingStringSet(left, right) {
	if (left.length !== right.length) return false;
	const rightSet = new Set(right);
	for (const value of left) if (!rightSet.has(value)) return false;
	return true;
}
/** Resolve the normalized role set requested by a pairing record. */
function resolveRequestedDeviceRoles(input) {
	return mergeDevicePairingRoles(input.roles, input.role) ?? [];
}
/** Clone a paired device's role-token map before mutation. */
function cloneDevicePairingTokens(device) {
	return device.tokens ? { ...device.tokens } : {};
}
/** Refresh one compatible pending request or replace a superseded request set atomically. */
function reconcilePendingPairingRequests(params) {
	if (params.existing.length === 1 && params.canRefreshSingle(expectDefined(params.existing[0], "existing entry at 0"), params.incoming)) {
		const refreshed = params.refreshSingle(expectDefined(params.existing[0], "existing entry at 0"), params.incoming);
		params.pendingById[refreshed.requestId] = refreshed;
		params.persist();
		return {
			status: "pending",
			request: refreshed,
			created: false
		};
	}
	for (const existing of params.existing) delete params.pendingById[existing.requestId];
	const request = params.buildReplacement({
		existing: params.existing,
		incoming: params.incoming
	});
	params.pendingById[request.requestId] = request;
	params.persist();
	return {
		status: "pending",
		request,
		created: true
	};
}
//#endregion
//#region src/infra/device-pairing-identity.ts
function listActiveTokenRoles(tokens) {
	if (!tokens) return;
	return mergeDevicePairingRoles(Object.values(tokens).filter((entry) => !entry.revokedAtMs).map((entry) => entry.role));
}
/** List the durable roles an owner approved for a paired device record. */
function listApprovedPairedDeviceRoles(device) {
	return mergeDevicePairingRoles(device.roles, device.role) ?? [];
}
/** List active-token roles, bounded by the durable approved pairing roles. */
function listEffectivePairedDeviceRoles(device) {
	const activeTokenRoles = listActiveTokenRoles(device.tokens);
	if (activeTokenRoles && activeTokenRoles.length > 0) {
		const approvedRoles = new Set(listApprovedPairedDeviceRoles(device));
		return activeTokenRoles.filter((role) => approvedRoles.has(role));
	}
	return [];
}
/** Return whether a paired device currently has an active token for one role. */
function hasEffectivePairedDeviceRole(device, role) {
	const normalized = normalizeDevicePairingRole(role);
	if (!normalized) return false;
	return listEffectivePairedDeviceRoles(device).includes(normalized);
}
/** Resolve the authenticated node pairing independently of surface approval. */
function resolveNodePairingIdentity(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node")) return null;
	const nodeToken = device.tokens?.node;
	if (!nodeToken) return null;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken.token,
		nodeToken.createdAtMs,
		nodeToken.rotatedAtMs ?? "",
		nodeToken.revokedAtMs ?? ""
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Resolve the durable node-owned identity used to admit asynchronous work. */
function resolveNodePairingGeneration(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node") || !device.nodeSurface) return null;
	const nodeToken = device.tokens?.node;
	const nodeSurface = device.nodeSurface;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken?.token ?? "",
		nodeToken?.revokedAtMs ?? "",
		nodeSurface.createdAtMs,
		nodeSurface.approvedAtMs
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Clear node runtime facts when their owning pairing generation changes. */
function clearNodePairingGenerationState(device, previousGeneration) {
	const nextGeneration = resolveNodePairingGeneration(device);
	if (previousGeneration?.key === nextGeneration?.key || !device.nodeSurface) return;
	delete device.nodeSurface.bins;
	delete device.nodeSurface.sessionHost;
}
/** Resolve connection identity and optional approved surface generation from one row. */
function resolveNodePairingState(device) {
	const identity = resolveNodePairingIdentity(device);
	if (!identity) return null;
	return {
		identity,
		generation: resolveNodePairingGeneration(device)
	};
}
//#endregion
export { resolveDevicePairingStoreRevision as A, persistDeviceBootstrapTokenRecords as C, updatePairedDeviceNodeSurfaceInTransaction as D, readDevicePairingStoreStateFromDatabase as E, updatePairedDevicePresenceInTransaction as O, loadPairedDevicePairingStoreRecordFromDatabase as S, pruneExpiredDevicePairSetupCompletionRecords as T, sameDevicePairingStringSet as _, resolveNodePairingGeneration as a, loadDeviceBootstrapTokenRecords as b, loadDevicePairingStateForMutation as c, normalizeDevicePairingId as d, normalizeDevicePairingRole as f, resolveRequestedDeviceRoles as g, resolvePairingRequestExpiry as h, listEffectivePairedDeviceRoles as i, withDevicePairingStoreDatabase as k, mergeDevicePairingRoles as l, reconcilePendingPairingRequests as m, hasEffectivePairedDeviceRole as n, resolveNodePairingState as o, preserveDeviceRoleScopes as p, listApprovedPairedDeviceRoles as r, cloneDevicePairingTokens as s, clearNodePairingGenerationState as t, mergeDevicePairingScopes as u, confirmDevicePairSetupCompletionDeliveryInTransaction as v, persistDevicePairingStoreState as w, loadDevicePairSetupCompletionRecord as x, consumeDeviceBootstrapTokenWithSetupCompletionInTransaction as y };
