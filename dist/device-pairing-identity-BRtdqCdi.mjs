import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { A as readSqliteDatabaseWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { o as ensureDevicePairSetupBootstrapSchema, s as ensureDevicePairSetupCompletionSchema, y as ensureWorkerEnvironmentNodeEnrollmentSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { r as invalidateDevicePairingNodeSnapshot } from "./device-pairing-publication-Bz9OLkoc.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-CLsH-il7.mjs";
import { v as resolvePairingSetupAccess } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import { t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-D5YAzjaz.mjs";
import { n as MAX_NODE_BOOTSTRAP_TIMEOUT_MS } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { r as isNodeHostStats } from "./node-host-stats-CwN89e53.mjs";
import { i as pruneExpiredPending } from "./pairing-files-CyVHwaMk.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/device-bootstrap.worker-types.ts
const DEVICE_BOOTSTRAP_TOKEN_TTL_MS = 6e5;
function resolveDeviceBootstrapTokenExpiresAtMs(record) {
	const ttlMs = record.setupId && record.profile?.purpose === "cloud-worker" ? MAX_NODE_BOOTSTRAP_TIMEOUT_MS : DEVICE_BOOTSTRAP_TOKEN_TTL_MS;
	return record.issuedAtMs + ttlMs;
}
//#endregion
//#region src/infra/device-pairing-mutation.worker.ts
const admission = new AsyncLocalStorage();
/** Recheck live host custody while the authoritative SQLite rows remain locked. */
function requestDevicePairingMutationAdmission(facts) {
	const requests = admission.getStore();
	if (!requests) throw new Error("Pairing mutation requires its worker transaction");
	const captured = structuredClone(facts);
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: [captured]
	});
	requests.push(captured);
}
function withDevicePairingMutationAdmission(operate) {
	return admission.run([], () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: []
		});
		const result = operate();
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: admission.getStore()
		});
		return result;
	});
}
//#endregion
//#region src/infra/device-pairing-cloud-worker.ts
function hasCloudWorkerSetupDeviceBinding(params) {
	const kysely = getNodeSqliteKysely(params.db);
	return executeSqliteQueryTakeFirstSync(params.db, kysely.selectFrom("worker_environments").select("node_device_id").where("node_setup_id", "=", params.setupId))?.node_device_id === params.deviceId;
}
/** Bind one environment-owned setup completion inside the pairing transaction. */
function bindCloudWorkerSetupCompletion(params) {
	ensureWorkerEnvironmentNodeEnrollmentSchema(params.db);
	const kysely = getNodeSqliteKysely(params.db);
	const environment = executeSqliteQueryTakeFirstSync(params.db, kysely.selectFrom("worker_environments").select([
		"environment_id",
		"state",
		"destroy_requested_at_ms",
		"node_device_id",
		"provision_operation_id",
		"owner_epoch",
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
	if (isFirstProvisioningDevice) requestDevicePairingMutationAdmission({
		kind: "bootstrap.cloudWorkerSetup",
		environmentId: environment.environment_id,
		setupId: params.completion.setupId,
		credentialDigest: params.credentialDigest,
		provisionOperationId: environment.provision_operation_id,
		ownerEpoch: environment.owner_epoch
	});
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
//#region src/infra/device-pairing-row-mapping.ts
const APPROVAL_KINDS = new Set(Object.keys({
	owner: true,
	silent: true,
	"trusted-cidr": true,
	"trusted-proxy": true,
	"remote-ingress": true,
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
function fromSetupCompletionRow(row) {
	return {
		setupId: row.setup_id,
		deviceId: row.device_id,
		...optional("deviceName", row.device_name),
		access: fromSetupCompletionAccessColumn(row.access),
		completedAtMs: row.completed_at_ms,
		deliveryState: fromSetupCompletionDeliveryStateColumn(row.delivery_state),
		retainUntilMs: row.retain_until_ms
	};
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
//#endregion
//#region src/infra/device-pairing-store-cache.ts
const cache = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingStoreCache"), () => ({ value: void 0 }));
function invalidateDevicePairingStoreCache(database) {
	if (cache.value?.connection === database.db && cache.value.path === database.path) cache.value = void 0;
}
/** Borrowed worker facts; projections must not mutate this revision's cached rows. */
function readCachedDevicePairingStoreSnapshot(db, path, read, deviceId) {
	if (db.isTransaction) return read();
	const writeRevision = readSqliteDatabaseWriteRevision(db);
	const cached = cache.value;
	if (writeRevision !== void 0 && cached?.connection === db && cached.path === path && cached.writeRevision === writeRevision && (cached.deviceId === void 0 || cached.deviceId === deviceId)) return cached;
	const snapshot = deviceId === void 0 ? runSqliteDeferredTransactionSync(db, read, { operationLabel: "devicePairing.snapshot" }) : read();
	if (writeRevision !== void 0) cache.value = {
		connection: db,
		path,
		...snapshot,
		writeRevision,
		deviceId
	};
	return snapshot;
}
//#endregion
//#region src/infra/push-apns-store-transaction.ts
/** Advances a registration/tombstone version without reusing an observed owner version. */
function nextApnsRegistrationVersion(nodeId, previousVersions, nowMs = Date.now()) {
	let latest = -1;
	for (const version of previousVersions) {
		if (!Number.isSafeInteger(version) || version < 0) throw new Error(`invalid APNs registration version for node ${nodeId}`);
		latest = Math.max(latest, version);
	}
	if (latest === Number.MAX_SAFE_INTEGER) throw new Error(`APNs registration version exhausted for node ${nodeId}`);
	return Math.max(nowMs, latest + 1);
}
/** Read both owner versions from the caller's transaction before advancing either one. */
function readApnsRegistrationVersions(db, nodeId) {
	const stateDb = getNodeSqliteKysely(db);
	const currentRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").select("updated_at_ms").where("node_id", "=", nodeId));
	const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("deleted_at_ms").where("node_id", "=", nodeId));
	return {
		currentExists: currentRow !== void 0,
		previousVersions: [currentRow?.updated_at_ms, tombstone?.deleted_at_ms].filter((version) => version !== void 0)
	};
}
/** Tombstones and deletes one APNs owner inside the caller's shared-state transaction. */
function clearApnsRegistrationFromDatabase(db, nodeId, nowMs = Date.now()) {
	const normalizedNodeId = nodeId.trim();
	if (!normalizedNodeId) return false;
	const stateDb = getNodeSqliteKysely(db);
	const { currentExists, previousVersions } = readApnsRegistrationVersions(db, normalizedNodeId);
	const deletedAtMs = nextApnsRegistrationVersion(normalizedNodeId, previousVersions, nowMs);
	executeSqliteQuerySync(db, stateDb.insertInto("apns_registration_tombstones").values({
		node_id: normalizedNodeId,
		deleted_at_ms: deletedAtMs
	}).onConflict((conflict) => conflict.column("node_id").doUpdateSet({ deleted_at_ms: deletedAtMs })));
	executeSqliteQuerySync(db, stateDb.deleteFrom("apns_registrations").where("node_id", "=", normalizedNodeId));
	return currentExists;
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
function withDevicePairingStoreDatabase(database, operate, paired, revision) {
	return boundDatabase.run({
		database,
		paired,
		revision
	}, operate);
}
function transactionPairedRecords(db) {
	const bound = boundDatabase.getStore();
	return bound?.database.db === db ? bound.paired : void 0;
}
/** Route an explicit pairing base dir (tests, alternate state roots) to that dir's DB. */
function resolveDevicePairingStateDbOptions(baseDir) {
	const database = boundDatabase.getStore()?.database;
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
		if (result.pairedChanged) {
			const revision = bumpDevicePairingStoreRevision(transactionDatabase.db);
			const bound = boundDatabase.getStore();
			if (bound?.database.db === transactionDatabase.db && bound.revision) bound.revision.value = revision;
		}
		if (result.mutated) stageSqliteTransactionState(transactionDatabase.db, {
			stage: () => void 0,
			rollback: () => void 0,
			commit: () => {
				invalidateDevicePairingStoreCache(transactionDatabase);
				invalidateDevicePairingNodeSnapshot(transactionDatabase.path);
			}
		});
		return result.value;
	}, {
		...databaseOptions,
		database
	});
}
function readDevicePairingStoreStateFromDatabase(db) {
	return {
		pendingById: readDevicePairingPendingRecordsFromDatabase(db),
		pairedByDeviceId: readPairedDevicePairingRecordsFromDatabase(db)
	};
}
function readDevicePairingPendingRecordsFromDatabase(db) {
	const kysely = getNodeSqliteKysely(db);
	const pendingById = {};
	for (const row of executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_pending").selectAll()).rows) pendingById[row.request_id] = fromPendingRow(row);
	return pendingById;
}
const DEVICE_PAIRING_REVISION_KEY = "devicePairing.revision";
function devicePairingRevisionQuery(db) {
	return getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", DEVICE_PAIRING_REVISION_KEY);
}
/** The pairing owner advances this row atomically with its paired-device writes. */
function bumpDevicePairingStoreRevision(db) {
	const kysely = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, kysely.insertInto("config_machine_state").values({
		state_key: DEVICE_PAIRING_REVISION_KEY,
		value_json: "1",
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet((eb) => ({
		value_json: eb.cast(eb(eb.cast("config_machine_state.value_json", "bigint"), "+", eb.lit(1)), "text"),
		updated_at_ms: eb.ref("excluded.updated_at_ms")
	}))).returning("value_json")).rows[0].value_json;
}
/** One statement keeps the selected rows and their revision in the same snapshot. */
function readPairedDevicePairingSnapshotFromDatabase(db, deviceId) {
	const kysely = getNodeSqliteKysely(db);
	const revision = kysely.selectNoFrom((eb) => eb.fn.coalesce(devicePairingRevisionQuery(db), eb.val("0")).as("pairing_revision")).as("revision");
	const query = kysely.selectFrom(revision).leftJoin("device_pairing_paired as paired", (join) => deviceId === void 0 ? join.onTrue() : join.on("paired.device_id", "=", deviceId)).selectAll("paired").select("revision.pairing_revision");
	const rows = executeSqliteQuerySync(db, query).rows;
	const paired = rows.filter((row) => row.device_id !== null);
	return {
		pairedByDeviceId: Object.fromEntries(paired.map((row) => [row.device_id, fromPairedRow(row)])),
		revision: rows[0].pairing_revision
	};
}
function readDevicePairingStoreSnapshotFromDatabase(db, deviceId) {
	const { pairedByDeviceId, revision } = readPairedDevicePairingSnapshotFromDatabase(db, deviceId);
	return {
		state: {
			pairedByDeviceId,
			pendingById: deviceId === void 0 ? readDevicePairingPendingRecordsFromDatabase(db) : {}
		},
		revision
	};
}
function readPairedDevicePairingRecordsFromDatabase(db) {
	const paired = transactionPairedRecords(db);
	if (paired) return structuredClone(paired);
	const kysely = getNodeSqliteKysely(db);
	return Object.fromEntries(executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_paired").selectAll()).rows.map((row) => [row.device_id, fromPairedRow(row)]));
}
function loadDevicePairingStoreState(baseDir) {
	const database = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	return structuredClone(database.db.isTransaction ? readDevicePairingStoreStateFromDatabase(database.db) : readCachedDevicePairingStoreSnapshot(database.db, database.path, () => readDevicePairingStoreSnapshotFromDatabase(database.db)).state);
}
/** Load one paired-device row from an existing shared-state transaction. */
function loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId) {
	const normalizedDeviceId = deviceId.trim();
	if (!normalizedDeviceId) return null;
	const paired = transactionPairedRecords(db);
	if (paired) return Object.hasOwn(paired, normalizedDeviceId) ? structuredClone(paired[normalizedDeviceId]) : null;
	const kysely = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pairing_paired").selectAll().where("device_id", "=", normalizedDeviceId));
	return row ? fromPairedRow(row) : null;
}
/** Read and patch one device under the worker's transaction and commit admission. */
function updatePairedDeviceInTransaction(deviceId, update) {
	return runDevicePairingStoreMutation(void 0, ({ db }) => {
		const normalizedDeviceId = deviceId.trim();
		const device = loadPairedDevicePairingStoreRecordFromDatabase(db, normalizedDeviceId);
		const stored = device ? toPairedRow(device) : void 0;
		const result = update(device);
		const patch = result.patch;
		if (!patch || Object.keys(patch).length === 0) return {
			mutated: false,
			value: result.value
		};
		if (!device) throw new Error("cannot update a missing paired device");
		const kysely = getNodeSqliteKysely(db);
		const columns = {
			..."displayName" in patch ? { display_name: patch.displayName ?? null } : {},
			..."operatorLabel" in patch ? { operator_label: patch.operatorLabel ?? null } : {},
			..."platform" in patch ? { platform: patch.platform ?? null } : {},
			..."clientId" in patch ? { client_id: patch.clientId ?? null } : {},
			..."clientMode" in patch ? { client_mode: patch.clientMode ?? null } : {},
			..."remoteIp" in patch ? { remote_ip: patch.remoteIp ?? null } : {},
			..."lastSeenAtMs" in patch ? { last_seen_at_ms: patch.lastSeenAtMs ?? null } : {},
			..."lastSeenReason" in patch ? { last_seen_reason: patch.lastSeenReason ?? null } : {},
			..."tokens" in patch ? { tokens_json: toJsonColumn(patch.tokens) } : {},
			..."nodeSurface" in patch ? { node_surface_json: toJsonColumn(patch.nodeSurface) } : {}
		};
		executeSqliteQuerySync(db, kysely.updateTable("device_pairing_paired").set(columns).where("device_id", "=", normalizedDeviceId));
		const paired = transactionPairedRecords(db);
		if (paired && stored) paired[normalizedDeviceId] = fromPairedRow({
			...stored,
			...columns
		});
		return {
			mutated: true,
			pairedChanged: true,
			value: result.value
		};
	});
}
/** Replace the pending and/or paired table contents with the given snapshot. */
function persistDevicePairingStoreState(state, baseDir, target, options) {
	runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const pairedRows = target !== "pending" ? Object.values(state.pairedByDeviceId).map(toPairedRow) : void 0;
		if (target !== "paired") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_pending"));
			const rows = Object.values(state.pendingById).map(toPendingRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_pending").values(rows));
		}
		if (pairedRows) {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_paired"));
			if (pairedRows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_paired").values(pairedRows));
		}
		for (const nodeId of new Set(options?.clearApnsNodeIds ?? [])) clearApnsRegistrationFromDatabase(db, nodeId);
		if (options?.retiredNodeToken) clearDeviceAuthTokenFromDatabase(db, {
			...options.retiredNodeToken,
			role: "node"
		});
		const paired = transactionPairedRecords(db);
		if (paired && pairedRows) {
			for (const deviceId of Object.keys(paired)) delete paired[deviceId];
			for (const row of pairedRows) Object.defineProperty(paired, row.device_id, {
				value: fromPairedRow(row),
				configurable: true,
				enumerable: true,
				writable: true
			});
		}
		return {
			mutated: true,
			pairedChanged: target !== "pending",
			value: void 0
		};
	});
}
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
		const tokenRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_bootstrap_tokens").selectAll().where("token_key", "=", token));
		if (!tokenRow || tokenRow.token !== token || tokenRow.device_id?.trim() !== deviceId) return null;
		const record = fromBootstrapRow(tokenRow);
		if (params.nowMs > resolveDeviceBootstrapTokenExpiresAtMs(record)) return null;
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
				completion,
				credentialDigest: sha256Base64Url(tokenRow.token)
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
	}, resolveDevicePairingStateDbOptions());
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
		return fromSetupCompletionRow(row);
	}, resolveDevicePairingStateDbOptions());
}
/** The host retains this deadline until a shared-state writer receipt changes. */
function readDevicePairSetupCompletionExpiryInDatabase(db) {
	if (!tableExists(db, "device_pair_setup_completions")) return;
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_pair_setup_completions").select("retain_until_ms").orderBy("retain_until_ms", "asc").limit(1))?.retain_until_ms;
}
/** The maintenance command owns the write transaction and its live admission. */
function pruneExpiredDevicePairSetupCompletionsInDatabase(db, nowMs) {
	if (!tableExists(db, "device_pair_setup_completions")) return 0;
	const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("device_pair_setup_completions").where("retain_until_ms", "<=", nowMs));
	return Number(result.numAffectedRows ?? 0);
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
		return row ? fromSetupCompletionRow(row) : null;
	}, {
		...databaseOptions,
		database
	});
}
//#endregion
//#region src/infra/device-pairing-state.kernel.ts
const DEVICE_PAIRING_PENDING_TTL_MS = 3e5;
/** Read authoritative rows inside the worker transaction or an admitted migration. */
function loadDevicePairingStateForMutation(nowMs, baseDir) {
	const state = loadDevicePairingStoreState(baseDir);
	pruneExpiredPending(state.pendingById, nowMs, DEVICE_PAIRING_PENDING_TTL_MS);
	return state;
}
function resolvePairingRequestExpiry(timestampMs) {
	return timestampMs + DEVICE_PAIRING_PENDING_TTL_MS;
}
function normalizeDevicePairingRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
/** Merge pairing roles while preserving first-seen order. */
function mergeDevicePairingRoles(...items) {
	const roles = [...new Set(items.flatMap(normalizeUniqueSingleOrTrimmedStringList))];
	return roles.length > 0 ? roles : void 0;
}
/** Merge pairing scopes while preserving first-seen order and explicit emptiness. */
function mergeDevicePairingScopes(...items) {
	const lists = items.filter((item) => Array.isArray(item));
	return lists.length > 0 ? [...new Set(lists.flatMap(normalizeUniqueSingleOrTrimmedStringList))] : void 0;
}
/** Preserve only approval scopes owned by one pairing role. */
function preserveDeviceRoleScopes(role, scopes) {
	return normalizeUniqueSingleOrTrimmedStringList(scopes).filter((scope) => role === "operator" ? scope.startsWith("operator.") : !scope.startsWith("operator."));
}
function sameDevicePairingStringSet(left, right) {
	if (left.length !== right.length) return false;
	const rightSet = new Set(right);
	return left.every((value) => rightSet.has(value));
}
function resolveRequestedDeviceRoles(input) {
	return mergeDevicePairingRoles(input.roles, input.role) ?? [];
}
//#endregion
//#region src/infra/device-pairing-identity.ts
/** Use the same persisted approval ceiling for token verification and retained authority. */
function resolveApprovedDeviceScopeBaseline(device) {
	const baseline = device.approvedScopes ?? device.scopes;
	return Array.isArray(baseline) ? normalizeDeviceAuthScopes(baseline) : null;
}
/** Pin the credential actually accepted or issued, never a successor found on a later read. */
function resolveAuthenticatedDeviceTokenIdentity(device, authenticated) {
	if (!device || device.publicKey !== authenticated.publicKey || device.tokens?.[authenticated.role]?.token !== authenticated.token) return null;
	const identity = resolvePairedDeviceTokenIdentity(device, authenticated.role);
	return identity && isPairedDeviceTokenIdentityCurrent(device, authenticated.role, identity, authenticated.scopes) ? Object.freeze(identity) : null;
}
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
/** Resolve one exact active role-token generation without exposing its credential. */
function resolvePairedDeviceTokenIdentity(device, role) {
	const normalizedRole = normalizeDevicePairingRole(role);
	if (!device || !normalizedRole || !hasEffectivePairedDeviceRole(device, normalizedRole)) return null;
	const token = device.tokens?.[normalizedRole];
	if (!token || token.role !== normalizedRole || token.revokedAtMs) return null;
	const key = sha256Hex([
		device.publicKey,
		device.createdAtMs,
		token.token,
		token.createdAtMs,
		token.rotatedAtMs ?? "",
		token.revokedAtMs ?? ""
	].join("\0"));
	return {
		deviceId: device.deviceId,
		key
	};
}
/** Re-admission retains the original token generation and current approved scope ceiling. */
function isPairedDeviceTokenIdentityCurrent(device, role, identity, scopes) {
	const normalizedRole = normalizeDevicePairingRole(role);
	const token = normalizedRole ? device?.tokens?.[normalizedRole] : void 0;
	const current = resolvePairedDeviceTokenIdentity(device, role);
	if (!device || !normalizedRole || !token || !current || current.deviceId !== identity.deviceId || current.key !== identity.key) return false;
	const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
	return approvedScopes !== null && roleScopesAllow({
		role: normalizedRole,
		requestedScopes: token.scopes,
		allowedScopes: approvedScopes
	}) && roleScopesAllow({
		role: normalizedRole,
		requestedScopes: scopes,
		allowedScopes: token.scopes
	});
}
/** Resolve the durable node-owned identity used to admit asynchronous work. */
function resolveNodePairingGeneration(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node") || !device.nodeSurface) return null;
	const nodeToken = device.tokens?.node;
	const nodeSurface = device.nodeSurface;
	const key = sha256Hex([
		device.publicKey,
		device.createdAtMs,
		nodeToken?.token ?? "",
		nodeToken?.revokedAtMs ?? "",
		nodeSurface.createdAtMs,
		nodeSurface.approvedAtMs
	].join("\0"));
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
	const identity = resolvePairedDeviceTokenIdentity(device, "node");
	if (!identity) return null;
	return {
		identity: {
			nodeId: identity.deviceId,
			key: identity.key
		},
		generation: resolveNodePairingGeneration(device)
	};
}
//#endregion
export { withDevicePairingStoreDatabase as A, persistDeviceBootstrapTokenRecords as C, readDevicePairingStoreStateFromDatabase as D, readDevicePairSetupCompletionExpiryInDatabase as E, requestDevicePairingMutationAdmission as F, withDevicePairingMutationAdmission as I, DEVICE_BOOTSTRAP_TOKEN_TTL_MS as L, nextApnsRegistrationVersion as M, readApnsRegistrationVersions as N, readPairedDevicePairingSnapshotFromDatabase as O, hasCloudWorkerSetupDeviceBinding as P, resolveDeviceBootstrapTokenExpiresAtMs as R, loadPairedDevicePairingStoreRecordFromDatabase as S, pruneExpiredDevicePairSetupCompletionsInDatabase as T, sameDevicePairingStringSet as _, listEffectivePairedDeviceRoles as a, loadDeviceBootstrapTokenRecords as b, resolveNodePairingGeneration as c, mergeDevicePairingRoles as d, mergeDevicePairingScopes as f, resolveRequestedDeviceRoles as g, resolvePairingRequestExpiry as h, listApprovedPairedDeviceRoles as i, clearApnsRegistrationFromDatabase as j, updatePairedDeviceInTransaction as k, resolveNodePairingState as l, preserveDeviceRoleScopes as m, hasEffectivePairedDeviceRole as n, resolveApprovedDeviceScopeBaseline as o, normalizeDevicePairingRole as p, isPairedDeviceTokenIdentityCurrent as r, resolveAuthenticatedDeviceTokenIdentity as s, clearNodePairingGenerationState as t, loadDevicePairingStateForMutation as u, confirmDevicePairSetupCompletionDeliveryInTransaction as v, persistDevicePairingStoreState as w, loadDevicePairSetupCompletionRecord as x, consumeDeviceBootstrapTokenWithSetupCompletionInTransaction as y };
