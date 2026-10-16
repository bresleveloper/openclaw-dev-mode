import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import { h as required, i as isCurrentPlacementTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { a as query, h as publishPlacementTurnToolState, i as getRequired, n as find } from "./placement-row-codec-DzKFQEtn.mjs";
//#region src/gateway/worker-environments/placement-session-tool-operations.kernel.ts
function runningOperations(db, identity) {
	return query(db).selectFrom("worker_session_tool_operations").select("tool_call_id").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId).where("status", "=", "running");
}
function assertNoRunningWorkerSessionToolOperations(db, identity) {
	if (executeSqliteQuerySync(db, runningOperations(db, identity).limit(1)).rows.length) throw new Error(`Session ${identity.sessionId} has a running worker session operation`);
}
function closeWorkerTurnToolAdmission(db, identity) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_turn_tool_authorities").where("session_id", "=", identity.sessionId).where("claim_id", "=", identity.claimId));
}
/** Removes authority and replay data in the same transaction that revokes the turn claim. */
function clearWorkerTurnToolState(db, identity) {
	closeWorkerTurnToolAdmission(db, identity);
	publishPlacementTurnToolState(db, identity);
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_tool_operations").where("source_session_id", "=", identity.sessionId).where("source_claim_id", "=", identity.claimId));
}
function createPlacementSessionToolOperationKernel(runtime) {
	const { db, instanceId, now } = runtime;
	const currentWorkerClaim = (claim) => {
		const current = find(db, required(claim.sessionId, "session id"));
		return claim.owner.kind === "worker" && current && isCurrentPlacementTurnClaim(current, claim) ? current : void 0;
	};
	const exactWorkerClaim = (claim) => {
		if (!currentWorkerClaim(claim)) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	};
	const hasToolAuthority = (claim, toolName) => {
		if (!currentWorkerClaim(claim) || claim.owner.kind !== "worker") return false;
		const authority = executeSqliteQuerySync(db, query(db).selectFrom("worker_turn_tool_authorities").select("tool_names_json").where("session_id", "=", claim.sessionId).where("environment_id", "=", claim.owner.environmentId).where("owner_epoch", "=", claim.owner.ownerEpoch).where("placement_generation", "=", claim.placementGeneration).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId)).rows[0];
		if (!authority) return false;
		try {
			const names = JSON.parse(authority.tool_names_json);
			return Array.isArray(names) && names.every((name) => typeof name === "string") && names.includes(toolName);
		} catch {
			return false;
		}
	};
	const runningOperation = (identity) => query(db).updateTable("worker_session_tool_operations").where("source_session_id", "=", identity.sourceSessionId).where("source_claim_id", "=", identity.sourceClaimId).where("tool_call_id", "=", identity.toolCallId).where("request_digest", "=", identity.requestDigest).where("gateway_instance_id", "=", instanceId).where("status", "=", "running");
	const settleWorkerSessionToolOperation = (identity, outcome) => {
		return executeSqliteQuerySync(db, runningOperation(identity).set({
			...outcome,
			updated_at_ms: now()
		})).numAffectedRows === 1n;
	};
	return {
		authorize(claim, toolNames) {
			const normalized = [...new Set(toolNames.map((name) => required(name, "worker tool name")))].toSorted();
			if (claim.owner.kind !== "worker") throw new Error(`Session ${claim.sessionId} turn is not worker-owned`);
			exactWorkerClaim(claim);
			const values = {
				environment_id: claim.owner.environmentId,
				owner_epoch: claim.owner.ownerEpoch,
				placement_generation: claim.placementGeneration,
				claim_id: claim.claimId,
				run_id: claim.runId,
				tool_names_json: JSON.stringify(normalized),
				updated_at_ms: now()
			};
			executeSqliteQuerySync(db, query(db).insertInto("worker_turn_tool_authorities").values({
				session_id: claim.sessionId,
				...values
			}).onConflict((conflict) => conflict.column("session_id").doUpdateSet(values)));
			return normalized;
		},
		seal(claim) {
			if (claim.owner.kind !== "worker") return;
			exactWorkerClaim(claim);
			closeWorkerTurnToolAdmission(db, claim);
		},
		clear(claim) {
			const current = getRequired(db, required(claim.sessionId, "session id"));
			if (!isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${claim.sessionId} turn authority changed`);
			if (executeSqliteQuerySync(db, runningOperations(db, claim).limit(1)).rows.length) return false;
			clearWorkerTurnToolState(db, claim);
			return true;
		},
		begin(params) {
			if (!hasToolAuthority(params.claim, params.toolName)) return { kind: "unauthorized" };
			const claimId = params.claim.claimId;
			const existing = executeSqliteQuerySync(db, query(db).selectFrom("worker_session_tool_operations").selectAll().where("source_session_id", "=", params.claim.sessionId).where("source_claim_id", "=", claimId).where("tool_call_id", "=", params.toolCallId)).rows[0];
			if (existing) {
				if (existing.tool_name !== params.toolName || existing.request_digest !== params.requestDigest) return { kind: "conflict" };
				if ((existing.status === "succeeded" || existing.status === "failed") && existing.result_json) return {
					kind: "completed",
					resultJson: existing.result_json
				};
				return { kind: existing.status !== "unknown" && existing.gateway_instance_id === instanceId ? "in-progress" : "unknown" };
			}
			if (executeSqliteQuerySync(db, runningOperations(db, params.claim)).rows.length >= 4) return { kind: "capacity" };
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
				child_session_key: null,
				result_json: null,
				gateway_instance_id: instanceId,
				created_at_ms: timestamp,
				updated_at_ms: timestamp
			}));
			return {
				kind: "execute",
				operationSeed
			};
		},
		bindChild(params) {
			return executeSqliteQuerySync(db, runningOperation(params).set({
				child_session_key: params.childSessionKey,
				updated_at_ms: now()
			}).where((expression) => expression.or([expression("child_session_key", "is", null), expression("child_session_key", "=", params.childSessionKey)]))).numAffectedRows === 1n;
		},
		complete(params) {
			return settleWorkerSessionToolOperation(params, {
				status: params.failed ? "failed" : "succeeded",
				result_json: params.resultJson
			});
		},
		abandon(params) {
			return settleWorkerSessionToolOperation(params, { status: "unknown" });
		},
		recover() {
			const result = executeSqliteQuerySync(db, query(db).updateTable("worker_session_tool_operations").set({
				status: "unknown",
				updated_at_ms: now()
			}).where("status", "=", "running"));
			return Number(result.numAffectedRows);
		}
	};
}
//#endregion
export { clearWorkerTurnToolState as n, createPlacementSessionToolOperationKernel as r, assertNoRunningWorkerSessionToolOperations as t };
