import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { g as required, i as isCurrentPlacementTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { a as query, i as getRequired, n as find } from "./placement-row-codec-qMLLgrft.mjs";
const workerSessionToolOperationWaiters = resolveGlobalMap(Symbol.for("openclaw.workerSessionToolOperationWaiters"), (waitersByPath) => {
	const error = /* @__PURE__ */ new Error("Gateway lifecycle ended while waiting for worker session operations");
	for (const byClaim of waitersByPath.values()) for (const waiters of byClaim.values()) for (const reject of waiters) reject(error);
	waitersByPath.clear();
});
function workerSessionToolOperationWaiterKey(identity) {
	return `${identity.sessionId}\0${identity.claimId}`;
}
function workerSessionToolOperationWaitersFor(path, identity) {
	let byClaim = workerSessionToolOperationWaiters.get(path);
	if (!byClaim) {
		byClaim = /* @__PURE__ */ new Map();
		workerSessionToolOperationWaiters.set(path, byClaim);
	}
	const key = workerSessionToolOperationWaiterKey(identity);
	let waiters = byClaim.get(key);
	if (!waiters) {
		waiters = /* @__PURE__ */ new Set();
		byClaim.set(key, waiters);
	}
	return waiters;
}
function signalWorkerSessionToolOperationChange(path, identity) {
	const byClaim = workerSessionToolOperationWaiters.get(path);
	const key = workerSessionToolOperationWaiterKey(identity);
	const waiters = byClaim?.get(key);
	if (!waiters) return;
	byClaim?.delete(key);
	if (byClaim?.size === 0) workerSessionToolOperationWaiters.delete(path);
	for (const resolve of waiters) resolve();
}
function hasRunningWorkerSessionToolOperations(db, identity) {
	return Boolean(executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").select("tool_call_id").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId).where("status", "=", "running").limit(1)).rows[0]);
}
function assertNoRunningWorkerSessionToolOperations(db, identity) {
	if (hasRunningWorkerSessionToolOperations(db, identity)) throw new Error(`Session ${identity.sessionId} has a running worker session operation`);
}
function closeWorkerTurnToolAdmission(db, identity) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_turn_tool_authorities").where("session_id", "=", identity.sessionId).where("claim_id", "=", identity.claimId));
}
/** Removes authority and replay data in the same transaction that revokes the turn claim. */
function clearWorkerTurnToolState(db, identity) {
	closeWorkerTurnToolAdmission(db, identity);
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_tool_operations").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId));
}
async function waitForWorkerSessionToolOperations(params) {
	while (hasRunningWorkerSessionToolOperations(params.read(), params.identity)) await new Promise((resolve, reject) => {
		const waiters = workerSessionToolOperationWaitersFor(params.path, params.identity);
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			waiters.delete(finish);
			if (waiters.size === 0) {
				const byClaim = workerSessionToolOperationWaiters.get(params.path);
				byClaim?.delete(workerSessionToolOperationWaiterKey(params.identity));
				if (byClaim?.size === 0) workerSessionToolOperationWaiters.delete(params.path);
			}
			if (error) reject(error);
			else resolve();
		};
		waiters.add(finish);
		if (!hasRunningWorkerSessionToolOperations(params.read(), params.identity)) finish();
	});
}
function createPlacementSessionToolOperationOps(runtime) {
	const { instanceId, path, now, read, write } = runtime;
	const currentWorkerClaim = (db, claim) => {
		const current = find(db, required(claim.sessionId, "session id"));
		return claim.owner.kind === "worker" && current && isCurrentPlacementTurnClaim(current, claim) ? current : void 0;
	};
	const exactWorkerClaim = (db, claim) => {
		if (!currentWorkerClaim(db, claim)) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	};
	const hasToolAuthority = (db, claim, toolName) => {
		if (!currentWorkerClaim(db, claim) || claim.owner.kind !== "worker") return false;
		const authority = executeSqliteQuerySync(db, query(db).selectFrom("worker_turn_tool_authorities").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
		if (!authority || authority.environment_id !== claim.owner.environmentId || authority.owner_epoch !== claim.owner.ownerEpoch || authority.placement_generation !== claim.placementGeneration || authority.claim_id !== claim.claimId || authority.run_id !== claim.runId) return false;
		try {
			const names = JSON.parse(authority.tool_names_json);
			return Array.isArray(names) && names.every((name) => typeof name === "string") && names.includes(toolName);
		} catch {
			return false;
		}
	};
	return {
		authorizeWorkerTurnTools(claim, toolNames) {
			const normalized = [...new Set(toolNames.map((name) => required(name, "worker tool name")))].toSorted();
			if (claim.owner.kind !== "worker") throw new Error(`Session ${claim.sessionId} turn is not worker-owned`);
			const owner = claim.owner;
			write((db) => {
				exactWorkerClaim(db, claim);
				executeSqliteQuerySync(db, query(db).insertInto("worker_turn_tool_authorities").values({
					session_id: claim.sessionId,
					environment_id: owner.environmentId,
					owner_epoch: owner.ownerEpoch,
					placement_generation: claim.placementGeneration,
					claim_id: claim.claimId,
					run_id: claim.runId,
					tool_names_json: JSON.stringify(normalized),
					updated_at_ms: now()
				}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
					environment_id: owner.environmentId,
					owner_epoch: owner.ownerEpoch,
					placement_generation: claim.placementGeneration,
					claim_id: claim.claimId,
					run_id: claim.runId,
					tool_names_json: JSON.stringify(normalized),
					updated_at_ms: now()
				})));
			});
		},
		isWorkerTurnToolAuthorized(claim, toolName) {
			return hasToolAuthority(read(), claim, toolName);
		},
		closeWorkerTurnToolAdmission(claim) {
			if (claim.owner.kind !== "worker") return;
			write((db) => {
				exactWorkerClaim(db, claim);
				closeWorkerTurnToolAdmission(db, {
					sessionId: claim.sessionId,
					claimId: claim.claimId
				});
			});
		},
		async closeWorkerTurnToolState(claim) {
			if (claim.owner.kind !== "worker") {
				write((db) => {
					const current = getRequired(db, required(claim.sessionId, "session id"));
					if (!isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${claim.sessionId} local turn authority changed`);
					const identity = {
						sessionId: claim.sessionId,
						claimId: claim.claimId
					};
					assertNoRunningWorkerSessionToolOperations(db, identity);
					clearWorkerTurnToolState(db, identity);
				});
				return;
			}
			const identity = {
				sessionId: claim.sessionId,
				claimId: claim.claimId
			};
			write((db) => {
				exactWorkerClaim(db, claim);
				closeWorkerTurnToolAdmission(db, identity);
			});
			await waitForWorkerSessionToolOperations({
				path,
				read,
				identity
			});
			write((db) => {
				exactWorkerClaim(db, claim);
				assertNoRunningWorkerSessionToolOperations(db, identity);
				clearWorkerTurnToolState(db, identity);
			});
		},
		beginWorkerSessionToolOperation(params) {
			return write((db) => {
				if (!hasToolAuthority(db, params.claim, params.toolName)) return { kind: "unauthorized" };
				const claimId = params.claim.claimId;
				const existing = executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").selectAll().where("source_session_id", "=", params.claim.sessionId).where("source_claim_id", "=", claimId).where("tool_call_id", "=", params.toolCallId)).rows[0];
				if (existing) {
					if (existing.tool_name !== params.toolName || existing.request_digest !== params.requestDigest || params.childSessionKey !== void 0 && existing.child_session_key !== params.childSessionKey) return { kind: "conflict" };
					if ((existing.status === "succeeded" || existing.status === "failed") && existing.result_json) return {
						kind: "completed",
						resultJson: existing.result_json
					};
					if (existing.status === "unknown") return { kind: "unknown" };
					if (existing.gateway_instance_id === instanceId) return { kind: "in-progress" };
					return { kind: "unknown" };
				}
				if (executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").select("tool_call_id").where("source_session_id", "=", params.claim.sessionId).where("source_claim_id", "=", claimId).where("status", "=", "running")).rows.length >= 4) return { kind: "capacity" };
				const timestamp = now();
				const operationSeed = generateSecureToken(32);
				executeSqliteQuerySync(db, query(db).insertInto("worker_session_tool_operations").values({
					source_session_id: params.claim.sessionId,
					source_claim_id: claimId,
					tool_call_id: params.toolCallId,
					tool_name: params.toolName,
					request_digest: params.requestDigest,
					operation_seed: operationSeed,
					status: "running",
					child_session_key: params.childSessionKey ?? null,
					result_json: null,
					gateway_instance_id: instanceId,
					created_at_ms: timestamp,
					updated_at_ms: timestamp
				}));
				return {
					kind: "execute",
					operationSeed,
					...params.childSessionKey ? { childSessionKey: params.childSessionKey } : {}
				};
			});
		},
		bindWorkerSessionToolOperationChild(params) {
			return write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					child_session_key: params.childSessionKey,
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running").where((expression) => expression.or([expression("child_session_key", "is", null), expression("child_session_key", "=", params.childSessionKey)]))).numAffectedRows === 1n;
			});
		},
		completeWorkerSessionToolOperation(params) {
			const completed = write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: params.failed ? "failed" : "succeeded",
					result_json: params.resultJson,
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running")).numAffectedRows === 1n;
			});
			if (completed) signalWorkerSessionToolOperationChange(path, {
				sessionId: params.sourceSessionId,
				claimId: params.sourceClaimId
			});
			return completed;
		},
		abandonWorkerSessionToolOperation(params) {
			const abandoned = write((db) => {
				return executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: "unknown",
					updated_at_ms: now()
				}).where("source_session_id", "=", params.sourceSessionId).where("source_claim_id", "=", params.sourceClaimId).where("tool_call_id", "=", params.toolCallId).where("request_digest", "=", params.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running")).numAffectedRows === 1n;
			});
			if (abandoned) signalWorkerSessionToolOperationChange(path, {
				sessionId: params.sourceSessionId,
				claimId: params.sourceClaimId
			});
			return abandoned;
		},
		recoverWorkerSessionToolOperationsAfterRestart() {
			return write((db) => {
				const result = executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
					status: "unknown",
					updated_at_ms: now()
				}).where("status", "=", "running"));
				return Number(result.numAffectedRows);
			});
		}
	};
}
//#endregion
export { clearWorkerTurnToolState as n, createPlacementSessionToolOperationOps as r, assertNoRunningWorkerSessionToolOperations as t };
