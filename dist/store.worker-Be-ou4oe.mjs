import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { d as WorkerSessionAlreadyAttachedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { y as ensureWorkerEnvironmentNodeEnrollmentSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as isTerminalWorkerEnvironmentState, t as canTransitionWorkerEnvironment } from "./state-DfozG-Xp.mjs";
import { i as createWorkerEnvironmentCommitAdmission } from "./store-native-publication-BmUHu_Dk.mjs";
import { L as isCurrentWorkerWorkspacePendingResultOwner, s as readWorkerPlacementsInDatabase } from "./placement-row-codec-DhdW6tSs.mjs";
import { u as readWorkerWorkspaceReconciliationFacts } from "./placement-workspace-result--lykq2r1.mjs";
import { t as normalizeWorkerDesktopEndpoint } from "./desktop-endpoint-CuWWzjte.mjs";
import { c as workerEnvironmentPreparationColumns, l as captureWorkerEnvironmentChanges, r as createPreparedEnvironmentStoreOps, t as assertPreparedEnvironmentAttachment, u as executeWorkerEnvironmentWrite } from "./prepared-environment-store-BAIUv_7G.mjs";
import { a as json, c as readWorkerEnvironmentFacts, d as createWorkerEnvironmentSessionAttachmentStore, f as hasWorkerEnvironmentSessionAttachment, i as getRequiredWorkerEnvironment, l as pruneObservedTerminalWorkerEnvironments, n as findCredential, o as listRows, r as findWorkerEnvironment, s as queryWorkerEnvironmentStore, u as WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL } from "./store-row-codec-B2xBAqsK.mjs";
import { a as normalizeCredentialHash, c as normalizeSessionId, i as normalizeBootstrapReceipt, l as normalizeWorkerSshEndpoint, n as assertShape, o as normalizeExpiry, r as normalizeAttachedSessionIds, s as normalizeRpcSetVersion, t as assertCredentialSessionBinding, u as requireWorkerEnvironmentString } from "./store-validation-BTwB_X05.mjs";
import { t as createWorkerEnvironmentReceipt } from "./store-receipt-DJp31XV1.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/store-mutations.ts
function nextGlobalOwnerEpoch(db) {
	const latestEnvironment = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_environments").select(({ fn }) => fn.max("owner_epoch").as("owner_epoch")));
	const latestTranscriptCommit = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_transcript_commit_heads").select(({ fn }) => fn.max("run_epoch").as("run_epoch")));
	const next = Math.max(latestEnvironment?.owner_epoch ?? 0, latestTranscriptCommit?.run_epoch ?? 0) + 1;
	if (!Number.isSafeInteger(next)) throw new Error("Worker environment owner epoch is exhausted");
	return next;
}
function updateRow(db, id, state, values) {
	if (executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).updateTable("worker_environments").set(values).where("environment_id", "=", id).where("state", "=", state)).numAffectedRows !== 1n) throw new Error(`Worker environment ${id} changed during update`);
}
function updateWorkerEnvironmentRecord(db, id, state, values) {
	updateRow(db, id, state, values);
	return getRequiredWorkerEnvironment(db, id);
}
function replaceSshFallbackPorts(db, environmentId, ports) {
	executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).deleteFrom("worker_environment_ssh_fallback_ports").where("environment_id", "=", environmentId));
	if (ports.length === 0) return;
	const rows = ports.map((port, position) => ({
		environment_id: environmentId,
		position,
		port
	}));
	executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).insertInto("worker_environment_ssh_fallback_ports").values(rows));
}
function revokeCredential(db, environmentId) {
	executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).deleteFrom("worker_environment_credentials").where("environment_id", "=", environmentId));
}
function upsertCredential(db, credential) {
	const { environment_id: environmentId, ...values } = credential;
	executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).insertInto("worker_environment_credentials").values({
		environment_id: environmentId,
		...values
	}).onConflict((conflict) => conflict.column("environment_id").doUpdateSet(values)));
}
function credentialInsert(params) {
	const sessionId = normalizeSessionId(params.input.sessionId);
	assertCredentialSessionBinding(params.attachedSessionIds, sessionId);
	const expiresAtMs = normalizeExpiry(params.input.expiresAtMs);
	if (expiresAtMs <= params.nowMs) throw new Error("Worker credential expiry must be in the future");
	return {
		environment_id: params.environmentId,
		credential_hash: normalizeCredentialHash(params.input.credentialHash),
		bundle_hash: params.bundleHash,
		session_id: sessionId,
		rpc_set_version: normalizeRpcSetVersion(params.input.rpcSetVersion),
		owner_epoch: params.ownerEpoch,
		expires_at_ms: expiresAtMs,
		delivered_at_ms: null
	};
}
function compareAttachmentAuthority(left, right) {
	if (left.ownerEpoch !== right.ownerEpoch) return left.ownerEpoch > right.ownerEpoch ? -1 : 1;
	if (left.stateChangedAtMs !== right.stateChangedAtMs) return left.stateChangedAtMs > right.stateChangedAtMs ? -1 : 1;
	if (left.environmentId === right.environmentId) return 0;
	return left.environmentId < right.environmentId ? -1 : 1;
}
function reconcileAttachedSessionOwners(db, nowMs) {
	const ownersBySession = /* @__PURE__ */ new Map();
	const changed = [];
	for (const record of listRows(db)) {
		if (record.state !== "attached" || record.destroyRequestedAtMs !== null) continue;
		const sessionId = record.attachedSessionIds[0];
		if (!sessionId) continue;
		const owners = ownersBySession.get(sessionId) ?? [];
		owners.push(record);
		ownersBySession.set(sessionId, owners);
	}
	for (const owners of ownersBySession.values()) {
		if (owners.length < 2) continue;
		const [, ...duplicates] = owners.toSorted(compareAttachmentAuthority);
		for (const duplicate of duplicates) {
			updateRow(db, duplicate.environmentId, "attached", {
				owner_epoch: nextGlobalOwnerEpoch(db),
				state: "idle",
				attached_session_ids_json: json([]),
				updated_at_ms: nowMs,
				state_changed_at_ms: nowMs,
				idle_since_at_ms: nowMs
			});
			revokeCredential(db, duplicate.environmentId);
			changed.push(duplicate.environmentId);
		}
	}
	return changed;
}
//#endregion
//#region src/gateway/worker-environments/store-schema.ts
const ensuredDatabases = /* @__PURE__ */ new WeakMap();
const WORKER_ENVIRONMENT_SSH_FALLBACK_PORTS_SCHEMA_SQL = getOpenClawStateFeatureSchemaSql("worker_environment_ssh_fallback_ports");
const ensureStoreSchema = createSqliteSchemaEnsurer(() => `${WORKER_ENVIRONMENT_SSH_FALLBACK_PORTS_SCHEMA_SQL}\n${WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL}`, {
	tables: ["worker_environment_ssh_fallback_ports", "worker_environment_session_attachments"],
	indexes: ["worker_environment_session_attachments_session_key"]
});
/** The worker store prepares its additive companion tables together on first use. */
function ensureWorkerEnvironmentStoreSchema(database) {
	const facts = getAdmittedSqliteSchemaFacts(database.db);
	if (facts && ensuredDatabases.get(database.db) === facts) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		ensureStoreSchema(db);
	}, { database }, { operationLabel: "worker-environments.companion.schema.ensure" });
	const remember = () => {
		const initialized = getAdmittedSqliteSchemaFacts(database.db);
		if (initialized) ensuredDatabases.set(database.db, initialized);
	};
	if (!deferSqlitePostCommitPublication(database.db, remember)) remember();
}
//#endregion
//#region src/gateway/worker-environments/store-transitions.ts
function resolveNullablePatch(patch, current, normalize) {
	return patch === void 0 ? current : patch === null ? null : normalize(patch);
}
function createWorkerEnvironmentTransitionOps(db, now) {
	return {
		refreshBootstrapReceipt(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const expectedReceipt = normalizeBootstrapReceipt(input.expectedBootstrapReceipt);
			const receipt = normalizeBootstrapReceipt(input.bootstrapReceipt);
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.state !== input.expectedState || current.ownerEpoch !== input.expectedOwnerEpoch || current.nodeDeviceId !== input.expectedNodeDeviceId || current.destroyRequestedAtMs !== null || !current.leaseId || !current.nodeDeviceId && !current.sshEndpoint || !isDeepStrictEqual(current.bootstrapReceipt, expectedReceipt)) throw new Error("Worker environment changed during runtime refresh");
			if (findCredential(db, environmentId)) throw new Error("Worker runtime refresh requires its previous credential to be revoked");
			const updatedAtMs = now();
			if (input.expectedState === "attached") {
				const attachedSessionId = current.attachedSessionIds[0];
				const placements = executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_session_placements").selectAll().where("environment_id", "=", environmentId).where("state", "=", input.expectedReclaimResult ? "draining" : "active")).rows;
				const placement = placements.length === 1 ? placements[0] : void 0;
				if (current.attachedSessionIds.length !== 1 || !placement || placement.session_id !== attachedSessionId || placement.active_owner_epoch !== current.ownerEpoch || placement.transition_generation !== input.expectedPlacementGeneration || placement.worker_bundle_hash !== expectedReceipt.bundleHash) throw new Error("Worker placement changed during runtime refresh");
				if (input.expectedReclaimResult) {
					const retained = readWorkerWorkspaceReconciliationFacts(db, [placement.session_id]);
					const pending = retained.pendingResults.get(placement.session_id);
					if (!pending || pending.claimId !== pending.runId || !pending.claimId.startsWith("reclaim-") || !isDeepStrictEqual(pending, input.expectedReclaimResult) || !isCurrentWorkerWorkspacePendingResultOwner(retained.placements.get(placement.session_id), pending)) throw new Error("Worker runtime refresh lost its retained Stop result");
				}
				if (executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_session_placement_moves").select("session_id").where("session_id", "=", placement.session_id))) throw new Error("Cannot refresh a worker runtime while its session is moving");
				executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).updateTable("worker_session_placements").set({
					worker_bundle_hash: receipt.bundleHash,
					updated_at_ms: updatedAtMs
				}).where("session_id", "=", placement.session_id));
			}
			updateRow(db, environmentId, current.state, {
				bootstrap_bundle_hash: receipt.bundleHash,
				bootstrap_openclaw_version: receipt.openclawVersion,
				bootstrap_protocol_features_json: json(receipt.protocolFeatures),
				bootstrap_install_kind: receipt.installKind ?? null,
				updated_at_ms: updatedAtMs,
				last_error: null
			});
			return getRequiredWorkerEnvironment(db, environmentId);
		},
		transition(input) {
			const { from, to, patch = {} } = input;
			if (!canTransitionWorkerEnvironment(from, to)) throw new Error(`Illegal worker environment transition: ${from} -> ${to}`);
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const updatedAtMs = now();
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.state !== from) throw new Error(`Worker environment ${environmentId} state conflict: expected ${from}, found ${current.state}`);
			if (input.expectedOwnerEpoch !== void 0 && current.ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
			if (to === "attached") {
				if (current.destroyRequestedAtMs !== null) throw new Error("Cannot attach worker after destroy is requested");
				if (hasWorkerEnvironmentSessionAttachment(db, environmentId)) throw new Error("Conversation-attached environments cannot be adopted for session placement");
				const sessionId = patch.attachedSessionIds?.[0];
				if (current.preparation && !sessionId) throw new Error("Prepared worker attachment requires its exact session");
				if (sessionId) assertPreparedEnvironmentAttachment(db, current, sessionId, input.placementBinding);
			}
			const clearsLeaseAfterTeardownFailure = to === "failed" && from === "destroying";
			if (clearsLeaseAfterTeardownFailure && (current.destroyRequestedAtMs === null || current.teardownTerminalState !== "failed")) throw new Error("Failed bootstrap transition requires durable provider teardown intent");
			if (clearsLeaseAfterTeardownFailure && (patch.leaseId !== null || patch.sshEndpoint !== null)) throw new Error("Failed bootstrap transition requires explicit lease clearing after provider teardown");
			const leaseId = resolveNullablePatch(patch.leaseId, current.leaseId, (value) => requireWorkerEnvironmentString(value, "lease id"));
			if (current.leaseId && leaseId !== current.leaseId && !clearsLeaseAfterTeardownFailure) throw new Error("Worker environment provider lease id is immutable once persisted");
			const nodeDeviceId = resolveNullablePatch(patch.nodeDeviceId, current.nodeDeviceId ?? null, (value) => requireWorkerEnvironmentString(value, "node device id"));
			if (current.nodeDeviceId && nodeDeviceId !== current.nodeDeviceId && !clearsLeaseAfterTeardownFailure) throw new Error("Worker environment node device id is immutable once persisted");
			const sshEndpoint = resolveNullablePatch(patch.sshEndpoint, current.sshEndpoint, normalizeWorkerSshEndpoint);
			const sharedHost = leaseId === null ? null : patch.sharedHost ?? current.sharedHost;
			const desktop = leaseId === null ? null : resolveNullablePatch(patch.desktop, current.desktop, normalizeWorkerDesktopEndpoint);
			const acceptsBootstrapReceipt = to === "ready" && (from === "bootstrapping" || from === "provisioning" && sshEndpoint === null);
			if (to === "ready" && !acceptsBootstrapReceipt) throw new Error("Ready worker transition requires bootstrap proof or a node lease");
			if (patch.bootstrapReceipt !== void 0 && !acceptsBootstrapReceipt) throw new Error("Bootstrap receipt can only be recorded when a worker becomes ready");
			if (acceptsBootstrapReceipt && patch.bootstrapReceipt === void 0) throw new Error("Ready worker transition requires a bootstrap receipt");
			const acceptsAttachedCredential = to === "attached";
			const acceptsCredential = acceptsBootstrapReceipt || acceptsAttachedCredential;
			if (patch.credential !== void 0 && !acceptsCredential) throw new Error("Worker credential cannot be minted during this transition");
			if (acceptsCredential && patch.credential === void 0) throw new Error(`${to === "ready" ? "Ready" : "Attached"} worker transition requires a worker credential`);
			const clearsBootstrapReceipt = to === "bootstrapping" && (from === "ready" || from === "idle");
			const bootstrapReceipt = clearsBootstrapReceipt ? null : patch.bootstrapReceipt === void 0 ? current.bootstrapReceipt : normalizeBootstrapReceipt(patch.bootstrapReceipt);
			if (acceptsCredential && !bootstrapReceipt) throw new Error(`${to === "ready" ? "Ready" : "Attached"} worker requires bootstrap proof`);
			const attachedSessionIds = to !== "attached" ? [] : patch.attachedSessionIds === void 0 ? current.attachedSessionIds : normalizeAttachedSessionIds(patch.attachedSessionIds);
			assertShape({
				state: to,
				leaseId,
				nodeDeviceId,
				sshEndpoint,
				desktop,
				bootstrapReceipt,
				attachedSessionIds
			});
			const [attachedSessionId] = attachedSessionIds;
			if (to === "attached" && attachedSessionId) {
				const existingOwner = listRows(db).find((record) => record.environmentId !== environmentId && record.state === "attached" && record.destroyRequestedAtMs === null && record.attachedSessionIds[0] === attachedSessionId);
				if (existingOwner) throw new WorkerSessionAlreadyAttachedError(attachedSessionId, existingOwner.environmentId);
			}
			const revokesCredential = clearsBootstrapReceipt || to === "attached" || from === "attached" && to === "idle" || to === "draining" || to === "destroyed" || to === "failed" || to === "orphaned";
			const ownerEpoch = acceptsBootstrapReceipt ? Math.max(1, current.ownerEpoch) : acceptsAttachedCredential || revokesCredential && !acceptsAttachedCredential && (from === "ready" || from === "idle" || from === "attached") ? nextGlobalOwnerEpoch(db) : current.ownerEpoch;
			updateRow(db, environmentId, from, {
				lease_id: leaseId,
				node_device_id: nodeDeviceId,
				shared_host: sharedHost === null ? null : sharedHost ? 1 : 0,
				ssh_host: sshEndpoint?.host ?? null,
				ssh_port: sshEndpoint?.port ?? null,
				ssh_user: sshEndpoint?.user ?? null,
				ssh_host_key: sshEndpoint?.hostKey ?? null,
				ssh_key_ref_json: sshEndpoint ? json(sshEndpoint.keyRef) : null,
				desktop_json: desktop ? json(desktop) : null,
				bootstrap_bundle_hash: bootstrapReceipt?.bundleHash ?? null,
				bootstrap_openclaw_version: bootstrapReceipt?.openclawVersion ?? null,
				bootstrap_protocol_features_json: bootstrapReceipt ? json(bootstrapReceipt.protocolFeatures) : null,
				bootstrap_install_kind: bootstrapReceipt?.installKind ?? null,
				owner_epoch: ownerEpoch,
				state: to,
				attached_session_ids_json: json(attachedSessionIds),
				updated_at_ms: updatedAtMs,
				state_changed_at_ms: updatedAtMs,
				idle_since_at_ms: to === "idle" ? updatedAtMs : null,
				last_error: patch.lastError?.trim() || null
			});
			if (patch.sshEndpoint !== void 0) replaceSshFallbackPorts(db, environmentId, sshEndpoint?.fallbackPorts ?? []);
			if (revokesCredential) revokeCredential(db, environmentId);
			if (patch.credential && bootstrapReceipt) upsertCredential(db, credentialInsert({
				input: patch.credential,
				environmentId,
				bundleHash: bootstrapReceipt.bundleHash,
				attachedSessionIds,
				ownerEpoch,
				nowMs: updatedAtMs
			}));
			return getRequiredWorkerEnvironment(db, environmentId);
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/store.kernel.ts
function createWorkerEnvironmentStoreKernel(database, now) {
	ensureWorkerEnvironmentStoreSchema(database);
	const db = database.db;
	const createIntent = (input) => {
		const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
		const createdAtMs = now();
		executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).insertInto("worker_environments").values({
			environment_id: environmentId,
			provider_id: requireWorkerEnvironmentString(input.providerId, "provider id"),
			profile_id: requireWorkerEnvironmentString(input.profileId, "profile id"),
			profile_snapshot_json: json(input.profileSnapshot),
			...workerEnvironmentPreparationColumns(input.preparation),
			last_activated_at_ms: null,
			provision_operation_id: requireWorkerEnvironmentString(input.provisionOperationId, "provision operation id"),
			lease_id: null,
			node_setup_id: null,
			node_device_id: null,
			shared_host: null,
			ssh_host: null,
			ssh_port: null,
			ssh_user: null,
			ssh_host_key: null,
			ssh_key_ref_json: null,
			desktop_json: null,
			bootstrap_bundle_hash: null,
			bootstrap_openclaw_version: null,
			bootstrap_protocol_features_json: null,
			bootstrap_install_kind: null,
			owner_epoch: 0,
			teardown_terminal_state: null,
			state: "requested",
			created_at_ms: createdAtMs,
			updated_at_ms: createdAtMs,
			state_changed_at_ms: createdAtMs,
			idle_since_at_ms: null,
			destroy_requested_at_ms: null,
			last_error: null
		}));
		return getRequiredWorkerEnvironment(db, environmentId);
	};
	return {
		...createPreparedEnvironmentStoreOps({
			db,
			now,
			createIntent,
			get: findWorkerEnvironment
		}),
		...createWorkerEnvironmentSessionAttachmentStore({
			db,
			now,
			createIntent,
			getEnvironment: findWorkerEnvironment
		}),
		...createWorkerEnvironmentTransitionOps(db, now),
		createIntent,
		ensureNodeEnrollment(environmentIdInput) {
			const environmentId = requireWorkerEnvironmentString(environmentIdInput, "id");
			ensureWorkerEnvironmentNodeEnrollmentSchema(db);
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (isTerminalWorkerEnvironmentState(current.state) || current.destroyRequestedAtMs !== null) throw new Error(`Worker environment ${environmentId} cannot begin node enrollment`);
			const setupId = current.nodeSetupId ?? randomUUID();
			const completedDeviceId = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("device_pair_setup_completions").select("device_id").where("setup_id", "=", setupId))?.device_id ?? null;
			if (current.nodeDeviceId !== null && completedDeviceId !== null && current.nodeDeviceId !== completedDeviceId) throw new Error(`Worker environment ${environmentId} node enrollment identity changed`);
			const nodeDeviceId = current.nodeDeviceId ?? completedDeviceId;
			if (current.nodeSetupId === setupId && current.nodeDeviceId === nodeDeviceId) return current;
			return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
				node_setup_id: setupId,
				node_device_id: nodeDeviceId,
				updated_at_ms: now()
			});
		},
		revokeEnvironmentCredential(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			if (input.expectedOwnerEpoch !== void 0 && getRequiredWorkerEnvironment(db, environmentId).ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
			revokeCredential(db, environmentId);
		},
		reconcileSharedHost(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const leaseId = requireWorkerEnvironmentString(input.leaseId, "lease id");
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.state !== input.state || current.leaseId !== leaseId) throw new Error(`Worker environment ${environmentId} lease changed during inspection`);
			if (current.sharedHost === input.sharedHost) return current;
			return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
				shared_host: input.sharedHost ? 1 : 0,
				updated_at_ms: now()
			});
		},
		adoptProvisionCleanupFailure(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const leaseId = requireWorkerEnvironmentString(input.leaseId, "lease id");
			const lastError = requireWorkerEnvironmentString(input.lastError, "last error");
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.state !== "provisioning" || current.leaseId !== null) throw new Error(`Worker environment ${environmentId} cannot adopt provision cleanup`);
			const updatedAtMs = now();
			return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
				lease_id: leaseId,
				state: "destroying",
				updated_at_ms: updatedAtMs,
				state_changed_at_ms: updatedAtMs,
				destroy_requested_at_ms: current.destroyRequestedAtMs ?? updatedAtMs,
				teardown_terminal_state: current.teardownTerminalState ?? "failed",
				last_error: lastError
			});
		},
		requestDestroy(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.state !== input.state) throw new Error(`Worker environment ${environmentId} changed before destroy request`);
			if (current.destroyRequestedAtMs !== null) return current;
			const requestedAtMs = now();
			const terminalState = input.terminalState ?? "destroyed";
			return updateWorkerEnvironmentRecord(db, environmentId, input.state, {
				updated_at_ms: requestedAtMs,
				destroy_requested_at_ms: requestedAtMs,
				teardown_terminal_state: terminalState,
				...input.lastError === void 0 ? {} : { last_error: requireWorkerEnvironmentString(input.lastError, "last error") }
			});
		},
		renewCredential(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
			if (current.state !== "ready" && current.state !== "idle" && current.state !== "attached") throw new Error(`Cannot mint worker credential in state ${current.state}`);
			if (current.destroyRequestedAtMs !== null) throw new Error("Cannot mint worker credential after destroy is requested");
			if (!current.bootstrapReceipt) throw new Error("Worker environment has no admitted bootstrap identity");
			const updatedAtMs = now();
			const ownerEpoch = Math.max(1, current.ownerEpoch);
			if (ownerEpoch !== current.ownerEpoch) updateRow(db, environmentId, current.state, {
				owner_epoch: ownerEpoch,
				updated_at_ms: updatedAtMs
			});
			upsertCredential(db, credentialInsert({
				input,
				environmentId,
				bundleHash: current.bootstrapReceipt.bundleHash,
				attachedSessionIds: current.attachedSessionIds,
				ownerEpoch,
				nowMs: updatedAtMs
			}));
			const credential = findCredential(db, environmentId);
			if (!credential) throw new Error("Worker credential persistence failed");
			return credential;
		},
		markCredentialDelivered(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const environment = getRequiredWorkerEnvironment(db, environmentId);
			const credential = findCredential(db, environmentId);
			if (!credential || environment.state !== "ready" && environment.state !== "idle" && environment.state !== "attached" || environment.destroyRequestedAtMs !== null || credential.credentialHash !== normalizeCredentialHash(input.credentialHash) || credential.ownerEpoch !== input.ownerEpoch || environment.ownerEpoch !== input.ownerEpoch || credential.sessionId !== normalizeSessionId(input.sessionId)) throw new Error(`Worker environment ${environmentId} credential changed`);
			const deliveredAtMs = normalizeExpiry(input.deliveredAtMs);
			if (deliveredAtMs >= credential.expiresAtMs) throw new Error("Expired worker credential cannot be marked delivered");
			if (executeWorkerEnvironmentWrite(db, queryWorkerEnvironmentStore(db).updateTable("worker_environment_credentials").set({ delivered_at_ms: deliveredAtMs }).where("environment_id", "=", environmentId).where("credential_hash", "=", credential.credentialHash).where("owner_epoch", "=", credential.ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker environment ${environmentId} credential changed`);
		},
		recordError(input) {
			return updateWorkerEnvironmentRecord(db, requireWorkerEnvironmentString(input.environmentId, "id"), input.state, {
				updated_at_ms: now(),
				last_error: requireWorkerEnvironmentString(input.error, "last error")
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/store.worker.ts
function mutation(name, execute) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction((transactionDatabase) => {
			const { db } = transactionDatabase;
			const now = () => input.nowMs ?? Date.now();
			const store = createWorkerEnvironmentStoreKernel(transactionDatabase, now);
			const touched = /* @__PURE__ */ new Set();
			const { result, changed } = captureWorkerEnvironmentChanges(db, () => execute(input, {
				db,
				store,
				now,
				touch: (id) => touched.add(id.trim())
			}));
			const facts = readWorkerEnvironmentFacts(db, [...touched]);
			if (name === "refreshBootstrapReceipt") {
				const sessionIds = facts.environments.flatMap((environment) => environment.state === "attached" ? environment.attachedSessionIds : []);
				if (sessionIds.length > 0) facts.placements = readWorkerPlacementsInDatabase(db, sessionIds);
			}
			const receipt = {
				result,
				changed,
				publication: createWorkerEnvironmentReceipt({
					identity: requireOpenClawStateDatabaseIdentity({ db }).key,
					incarnation: input.publicationIncarnation
				}, facts)
			};
			deferSqliteWorkerCommitReceipt(db, receipt);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: createWorkerEnvironmentCommitAdmission(facts)
			});
			return receipt;
		}, { database }, { operationLabel: `workerEnvironments.${name}` });
	};
}
function environmentMutation(name, execute) {
	return mutation(name, ({ input }, { store, touch }) => {
		touch(input.environmentId);
		return execute(input, store);
	});
}
const workerEnvironmentOperations = {
	"workerEnvironments.initialize": mutation("initialize", (_input, { db, now, touch }) => {
		for (const id of reconcileAttachedSessionOwners(db, now())) touch(id);
	}),
	"workerEnvironments.createIntent": environmentMutation("createIntent", (input, store) => store.createIntent(input)),
	"workerEnvironments.ensureNodeEnrollment": mutation("ensureNodeEnrollment", ({ input }, { store, touch }) => {
		touch(input);
		return store.ensureNodeEnrollment(input);
	}),
	"workerEnvironments.revokeEnvironmentCredential": environmentMutation("revokeEnvironmentCredential", (input, store) => store.revokeEnvironmentCredential(input)),
	"workerEnvironments.reconcileSharedHost": environmentMutation("reconcileSharedHost", (input, store) => store.reconcileSharedHost(input)),
	"workerEnvironments.adoptProvisionCleanupFailure": environmentMutation("adoptProvisionCleanupFailure", (input, store) => store.adoptProvisionCleanupFailure(input)),
	"workerEnvironments.requestDestroy": environmentMutation("requestDestroy", (input, store) => store.requestDestroy(input)),
	"workerEnvironments.refreshBootstrapReceipt": environmentMutation("refreshBootstrapReceipt", (input, store) => store.refreshBootstrapReceipt(input)),
	"workerEnvironments.transition": environmentMutation("transition", (input, store) => store.transition(input)),
	"workerEnvironments.renewCredential": environmentMutation("renewCredential", (input, store) => store.renewCredential(input)),
	"workerEnvironments.markCredentialDelivered": environmentMutation("markCredentialDelivered", (input, store) => store.markCredentialDelivered(input)),
	"workerEnvironments.recordError": environmentMutation("recordError", (input, store) => store.recordError(input)),
	"workerEnvironments.ensurePreparedIntent": mutation("ensurePreparedIntent", ({ input }, { store, touch }) => {
		const value = store.ensurePreparedIntent(input);
		touch(input.intent.environmentId);
		if (value) touch(value.environmentId);
		return value;
	}),
	"workerEnvironments.requestPreparedDestroy": environmentMutation("requestPreparedDestroy", (input, store) => store.requestPreparedDestroy(input)),
	"workerEnvironments.createSessionAttachmentIntent": mutation("createSessionAttachmentIntent", ({ input }, { store, touch }) => {
		const previous = store.getSessionAttachmentRecord(input.sessionId);
		if (previous) touch(previous.environmentId);
		touch(input.environmentId);
		return store.createSessionAttachmentIntent(input);
	}),
	"workerEnvironments.closeSessionAttachment": mutation("closeSessionAttachment", ({ input }, { store, touch }) => {
		const value = store.closeSessionAttachment(input);
		if (value) touch(value.environmentId);
		return value;
	}),
	"workerEnvironments.cancelSessionAttachmentReservation": environmentMutation("cancelSessionAttachmentReservation", (input, store) => store.cancelSessionAttachmentReservation(input)),
	"workerEnvironments.touchSessionAttachment": environmentMutation("touchSessionAttachment", (input, store) => store.touchSessionAttachment(input)),
	"workerEnvironments.pruneTerminalEnvironments": mutation("pruneTerminalEnvironments", ({ input: { approved } }, { db, touch }) => {
		for (const row of approved) touch(row.environment_id);
		return pruneObservedTerminalWorkerEnvironments(db, approved);
	})
};
//#endregion
export { workerEnvironmentOperations };
