import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as normalizeCredentialHash, i as normalizeBootstrapReceipt, l as normalizeWorkerSshEndpoint, n as assertShape, p as parseWorkerEnvironmentState, r as normalizeAttachedSessionIds } from "./store-validation-BhdOaJpU.mjs";
import { o as readWorkerEnvironmentPreparation } from "./prepared-environment-store-CJjZID0w.mjs";
import { t as normalizeWorkerDesktopEndpoint } from "./desktop-endpoint-DLa3iAO9.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/session-attachment-store.ts
const query = (db) => getNodeSqliteKysely(db);
const WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS worker_environment_session_attachments (
  session_id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  environment_id TEXT NOT NULL UNIQUE,
  generation INTEGER NOT NULL CHECK (generation >= 1),
  created_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  closed_at_ms INTEGER,
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS worker_environment_session_attachments_session_key
ON worker_environment_session_attachments(agent_id, session_key);
`;
function fromRow(row) {
	return {
		sessionId: row.session_id,
		sessionKey: row.session_key,
		agentId: row.agent_id,
		...row.session_lifecycle_revision ? { sessionLifecycleRevision: row.session_lifecycle_revision } : {},
		environmentId: row.environment_id,
		generation: row.generation,
		createdAtMs: row.created_at_ms,
		lastUsedAtMs: row.last_used_at_ms,
		closedAtMs: row.closed_at_ms
	};
}
function get(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_environment_session_attachments").selectAll().where("session_id", "=", sessionId));
	return row ? fromRow(row) : void 0;
}
function readWorkerEnvironmentSessionAttachments(db, ids) {
	if (ids?.length === 0) return [];
	const rows = query(db).selectFrom("worker_environment_session_attachments").selectAll();
	return executeSqliteQuerySync(db, ids ? rows.where("environment_id", "in", ids) : rows).rows.map(fromRow);
}
function hasWorkerEnvironmentSessionAttachment(db, environmentId) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_environment_session_attachments").select("session_id").where("environment_id", "=", environmentId)));
}
function createWorkerEnvironmentSessionAttachmentStore(options) {
	const { db, now } = options;
	const assertIdentity = (record, expected) => {
		if (record.sessionId !== expected.sessionId || record.sessionKey !== expected.sessionKey || record.agentId !== expected.agentId) throw new Error("Conversation environment identity changed");
	};
	return {
		getSessionAttachmentRecord: (sessionId) => get(db, sessionId),
		createSessionAttachmentIntent(input) {
			const previous = get(db, input.sessionId);
			if (previous) {
				assertIdentity(previous, input);
				const environment = options.getEnvironment(db, previous.environmentId);
				if (environment && !["destroyed", "failed"].includes(environment.state)) throw new Error("Conversation already owns a worker environment; stop it before replacing it");
				if (previous.environmentId === input.environmentId) throw new Error("This environment request was already stopped; use a new idempotency key");
			}
			const environment = options.createIntent(db, input);
			if (environment.state !== "requested") throw new Error("Environment request already belongs to an earlier allocation");
			const at = now();
			const values = {
				environment_id: input.environmentId,
				generation: (previous?.generation ?? 0) + 1,
				session_lifecycle_revision: input.sessionLifecycleRevision ?? null,
				created_at_ms: at,
				last_used_at_ms: at,
				closed_at_ms: null
			};
			executeSqliteQuerySync(db, query(db).insertInto("worker_environment_session_attachments").values({
				session_id: input.sessionId,
				session_key: input.sessionKey,
				agent_id: input.agentId,
				...values
			}).onConflict((oc) => oc.column("session_id").doUpdateSet(values)));
			return {
				attachment: get(db, input.sessionId),
				environment
			};
		},
		closeSessionAttachment(sessionId) {
			const current = get(db, sessionId);
			if (!current || current.closedAtMs !== null) return current;
			executeSqliteQuerySync(db, query(db).updateTable("worker_environment_session_attachments").set({ closed_at_ms: now() }).where("session_id", "=", sessionId));
			return get(db, sessionId);
		},
		cancelSessionAttachmentReservation(record) {
			const current = get(db, record.sessionId);
			const environment = options.getEnvironment(db, record.environmentId);
			if (!current || current.environmentId !== record.environmentId || current.generation !== record.generation || !environment || environment.state !== "requested" || environment.leaseId !== null) throw new Error("Conversation environment reservation changed before cancellation");
			const at = now();
			executeSqliteQuerySync(db, query(db).updateTable("worker_environment_session_attachments").set({ closed_at_ms: current.closedAtMs ?? at }).where("session_id", "=", current.sessionId));
			executeSqliteQuerySync(db, query(db).updateTable("worker_environments").set({
				destroy_requested_at_ms: environment.destroyRequestedAtMs ?? at,
				teardown_terminal_state: "destroyed",
				updated_at_ms: at
			}).where("environment_id", "=", environment.environmentId).where("state", "=", "requested"));
		},
		touchSessionAttachment(record) {
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_environment_session_attachments").set({ last_used_at_ms: now() }).where("session_id", "=", record.sessionId).where("environment_id", "=", record.environmentId).where("generation", "=", record.generation).where("closed_at_ms", "is", null)).numAffectedRows !== 1n) throw new Error("Conversation environment attachment is no longer current");
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/terminal-environment-retention.ts
function normalizeLimit(value) {
	if (!Number.isSafeInteger(value) || value < 1 || value > 1e3) throw new Error("Worker environment prune limit must be between 1 and 1000");
	return value;
}
function pruneObservedTerminalWorkerEnvironments(params) {
	if (params.observed.length === 0) return 0;
	normalizeLimit(params.observed.length);
	return params.write((db) => {
		const currentQuery = getNodeSqliteKysely(db);
		let deleted = 0;
		for (const observed of params.observed) {
			const current = executeSqliteQueryTakeFirstSync(db, currentQuery.selectFrom("worker_environments").selectAll().where("environment_id", "=", observed.environment_id).where((eb) => eb.not(eb.exists(eb.selectFrom("worker_session_placements").select("session_id").whereRef("environment_id", "=", "worker_environments.environment_id")))));
			if (current && isDeepStrictEqual({ ...current }, { ...observed })) {
				const result = executeSqliteQuerySync(db, currentQuery.deleteFrom("worker_environments").where("environment_id", "=", observed.environment_id));
				deleted += Number(result.numAffectedRows ?? 0n);
			}
		}
		return deleted;
	});
}
//#endregion
//#region src/gateway/worker-environments/store-row-codec.ts
function teardownTerminalStateFrom(value) {
	if (value === null || value === "destroyed" || value === "failed") return value;
	throw new Error("Worker environment teardown terminal state is invalid");
}
function endpointFrom(row, fallbackPorts) {
	const { ssh_host: host, ssh_port: port, ssh_user: user, ssh_host_key: hostKey, ssh_key_ref_json: encoded } = row;
	if (host === null || port === null || user === null || hostKey === null || encoded === null) return null;
	return normalizeWorkerSshEndpoint({
		host,
		port,
		...fallbackPorts.length > 0 ? { fallbackPorts } : {},
		user,
		hostKey,
		keyRef: JSON.parse(encoded)
	});
}
function bootstrapReceiptFrom(row) {
	const { bootstrap_bundle_hash: bundleHash, bootstrap_openclaw_version: openclawVersion, bootstrap_protocol_features_json: encodedFeatures, bootstrap_install_kind: installKind } = row;
	if (bundleHash === null && openclawVersion === null && encodedFeatures === null) return null;
	if (bundleHash === null || openclawVersion === null || encodedFeatures === null) throw new Error("Worker environment bootstrap receipt is incomplete");
	return normalizeBootstrapReceipt({
		bundleHash,
		openclawVersion,
		protocolFeatures: JSON.parse(encodedFeatures),
		...installKind === null ? {} : { installKind }
	});
}
function decodeWorkerEnvironmentRow(row, fallbackPorts) {
	const record = {
		environmentId: row.environment_id,
		providerId: row.provider_id,
		profileId: row.profile_id,
		profileSnapshot: JSON.parse(row.profile_snapshot_json),
		preparation: readWorkerEnvironmentPreparation(row),
		provisionOperationId: row.provision_operation_id,
		nodeSetupId: row.node_setup_id,
		nodeDeviceId: row.node_device_id,
		sharedHost: row.shared_host === null ? null : row.shared_host === 1,
		leaseId: row.lease_id,
		sshEndpoint: endpointFrom(row, fallbackPorts),
		desktop: row.desktop_json === null ? null : normalizeWorkerDesktopEndpoint(JSON.parse(row.desktop_json)),
		bootstrapReceipt: bootstrapReceiptFrom(row),
		ownerEpoch: row.owner_epoch,
		teardownTerminalState: teardownTerminalStateFrom(row.teardown_terminal_state),
		state: parseWorkerEnvironmentState(row.state),
		attachedSessionIds: normalizeAttachedSessionIds(JSON.parse(row.attached_session_ids_json)),
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms,
		stateChangedAtMs: row.state_changed_at_ms,
		lastActivatedAtMs: row.last_activated_at_ms,
		idleSinceAtMs: row.idle_since_at_ms,
		destroyRequestedAtMs: row.destroy_requested_at_ms,
		lastError: row.last_error
	};
	assertShape(record.state, record.leaseId, record.nodeDeviceId, record.sshEndpoint, record.desktop, record.bootstrapReceipt, record.attachedSessionIds);
	return record;
}
function credentialFromRow(row) {
	return {
		environmentId: row.environment_id,
		credentialHash: normalizeCredentialHash(row.credential_hash),
		bundleHash: row.bundle_hash,
		sessionId: row.session_id,
		rpcSetVersion: row.rpc_set_version,
		ownerEpoch: row.owner_epoch,
		expiresAtMs: row.expires_at_ms,
		deliveredAtMs: row.delivered_at_ms
	};
}
function json(value) {
	const encoded = JSON.stringify(value);
	if (encoded === void 0) throw new Error("Worker environment value must be JSON serializable");
	return encoded;
}
const queryWorkerEnvironmentStore = (db) => getNodeSqliteKysely(db);
function environmentRows(db) {
	return queryWorkerEnvironmentStore(db).selectFrom("worker_environments").selectAll("worker_environments").select((eb) => eb.selectFrom("worker_environment_ssh_fallback_ports").select(({ fn }) => fn.agg("json_group_array", ["port"]).orderBy("position").as("ports")).whereRef("worker_environment_ssh_fallback_ports.environment_id", "=", "worker_environments.environment_id").$asScalar().as("ssh_fallback_ports_json"));
}
function recordsFromRows(rows) {
	return rows.map((row) => decodeWorkerEnvironmentRow(row, JSON.parse(row.ssh_fallback_ports_json)));
}
function findWorkerEnvironment(db, environmentId) {
	const rows = executeSqliteQuerySync(db, environmentRows(db).where("worker_environments.environment_id", "=", environmentId)).rows;
	return recordsFromRows(rows)[0];
}
function findCredential(db, environmentId) {
	const row = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_environment_credentials").selectAll().where("environment_id", "=", environmentId));
	return row ? credentialFromRow(row) : void 0;
}
function getRequiredWorkerEnvironment(db, environmentId) {
	const record = findWorkerEnvironment(db, environmentId);
	if (!record) throw new Error(`Unknown worker environment: ${environmentId}`);
	return record;
}
function listRows(db) {
	const rows = executeSqliteQuerySync(db, environmentRows(db).orderBy("worker_environments.created_at_ms").orderBy("worker_environments.environment_id")).rows;
	return recordsFromRows(rows);
}
/** Prepared inside the owning transaction; absent rows are explicit deletion facts. */
function readWorkerEnvironmentFacts(db, ids) {
	const environments = ids ? ids.flatMap((id) => {
		const row = findWorkerEnvironment(db, id);
		return row ? [row] : [];
	}) : listRows(db);
	const credentialQuery = queryWorkerEnvironmentStore(db).selectFrom("worker_environment_credentials").selectAll();
	const credentials = ids?.length === 0 ? [] : executeSqliteQuerySync(db, ids ? credentialQuery.where("environment_id", "in", ids) : credentialQuery).rows.map(credentialFromRow);
	const attachments = readWorkerEnvironmentSessionAttachments(db, ids);
	return {
		ids: ids ? [...ids] : environments.map((row) => row.environmentId),
		environments,
		credentials,
		attachments
	};
}
//#endregion
export { listRows as a, pruneObservedTerminalWorkerEnvironments as c, hasWorkerEnvironmentSessionAttachment as d, json as i, WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL as l, findWorkerEnvironment as n, queryWorkerEnvironmentStore as o, getRequiredWorkerEnvironment as r, readWorkerEnvironmentFacts as s, findCredential as t, createWorkerEnvironmentSessionAttachmentStore as u };
