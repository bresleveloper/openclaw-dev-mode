import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { T as ensureContextEngineTurnOutboxSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { l as resolveLogicalTurnContextEngines, r as hasSameContextEngineInstance, u as disposeContextEngineSources } from "./registry-Bqh30cGD.mjs";
import { d as readClosedTranscriptTurn } from "./session-accessor-l-4ZHvKn.mjs";
import { n as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { a as evaluateContextEngineHostSupport, o as supportsContextEngineDurableTurnAdvancement } from "./host-compat-xESS3bi6.mjs";
import { t as ensureContextEnginesInitialized } from "./init-Bfw0dc04.mjs";
import { t as runContextEngineMaintenance } from "./context-engine-maintenance-5FlnjD_8.mjs";
//#region src/agents/harness/context-engine-logical-turn.ts
function selectContextEngineForTranscriptHost(params) {
	const admission = params.recorder?.getAdmissionReceipt();
	if (params.recorder && !admission && params.recorder.hasPersisted()) return params.lease.degradeBeforeStart("current-turn transcript admission receipt is unavailable");
	return params.lease.selectForHost({
		host: params.host,
		operation: params.operation,
		requiresDurableCommit: params.recorder !== void 0
	});
}
async function createContextEngineLogicalTurnLease(params) {
	const { runId, sessionId } = params.identity;
	ensureContextEnginesInitialized();
	const resolution = await resolveLogicalTurnContextEngines(params.config, {
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		onCleanupFailure: recordAgentCleanupFailure
	});
	let state = "unselected";
	let effective = resolution.configured;
	let degradedReason = resolution.configuredFailure;
	let warned = false;
	const disposalHolds = /* @__PURE__ */ new Set();
	const isBaselineEngineSelection = resolution.configuredFailure === void 0 && resolution.configured.registeredId === resolution.fallback.registeredId;
	const asEffective = () => Object.freeze({
		...effective,
		mode: degradedReason ? "legacy-degraded" : "configured",
		...degradedReason ? { reason: degradedReason } : {}
	});
	const warnOnce = (reason) => {
		if (warned) return;
		warned = true;
		(params.warn ?? console.warn)(`[context-engine] Context engine "${sanitizeForLog(resolution.configuredId)}" degraded to "${sanitizeForLog(resolution.fallback.registeredId)}" for this logical turn: ${sanitizeForLog(reason)}. The "${sanitizeForLog(resolution.fallback.registeredId)}" engine will handle only this turn; configuration is unchanged, and "${sanitizeForLog(resolution.configuredId)}" will be retried next turn.`);
	};
	const degradeBeforeStart = (reason) => {
		if (state === "disposed") throw new Error("context-engine logical turn selection is already pinned");
		if (isBaselineEngineSelection) {
			if (state === "unselected") state = "selected";
			return asEffective();
		}
		if (state === "started") throw new Error("context-engine logical turn selection is already pinned");
		degradedReason ??= reason;
		effective = resolution.fallback;
		state = "selected";
		warnOnce(degradedReason);
		return asEffective();
	};
	const resolveSelectionIssue = (selection) => {
		const support = evaluateContextEngineHostSupport({
			contextEngineInfo: effective.engine.info,
			operation: selection.operation,
			host: selection.host
		});
		if (!support.ok) return `host "${selection.host.id}" is missing ${support.missingCapabilities.join(", ")}`;
		if (isBaselineEngineSelection) return;
		if (selection.requiresDurableCommit && effective.engine.info.transcriptSemantics?.currentTurnFence !== "before-current-turn-entry-v1") return "current-turn transcript fencing is not declared";
		if (selection.requiresDurableCommit && !supportsContextEngineDurableTurnAdvancement(effective.engine)) return "atomic idempotent turn advancement is not declared";
	};
	if (resolution.configuredFailure) degradeBeforeStart(resolution.configuredFailure);
	return {
		get engine() {
			return effective.engine;
		},
		get effectiveEngine() {
			return effective.engine;
		},
		get effectiveEngineId() {
			return effective.registeredId;
		},
		get effectiveEnginePluginId() {
			return effective.ownerPluginId;
		},
		get degraded() {
			return degradedReason !== void 0;
		},
		get degradedReason() {
			return degradedReason;
		},
		selectForHost(selection) {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			if (degradedReason) return asEffective();
			const issue = resolveSelectionIssue(selection);
			if (issue) {
				if (state === "started") throw new Error(`context-engine logical turn cannot change to incompatible ${selection.host.label}: ${issue}`);
				return degradeBeforeStart(issue);
			}
			if (state === "unselected") state = "selected";
			return asEffective();
		},
		degradeBeforeStart,
		begin() {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			state = "started";
			return asEffective();
		},
		deferDisposalUntil(promise) {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			disposalHolds.add(promise);
			promise.finally(() => disposalHolds.delete(promise)).catch(() => {});
		},
		async dispose() {
			if (state === "disposed") return;
			state = "disposed";
			const engines = [resolution.configured.engine, resolution.fallback.engine];
			const distinctEngines = engines.filter((engine, index) => engines.slice(0, index).every((other) => !hasSameContextEngineInstance(engine, other)));
			const disposeEngines = async () => {
				await Promise.allSettled(distinctEngines.map((engine) => runAgentCleanupStep({
					runId,
					sessionId,
					step: "context-engine-dispose",
					log: { warn: params.warn ?? console.warn },
					cleanup: async () => {
						const sources = new Set(engines.filter((other) => hasSameContextEngineInstance(engine, other)).flatMap((other) => resolution.sourceResources?.get(other) ?? []));
						await disposeContextEngineSources(engine, [...sources]);
					}
				})));
			};
			if (disposalHolds.size > 0) {
				Promise.allSettled(disposalHolds).then(disposeEngines);
				return;
			}
			await disposeEngines();
		}
	};
}
//#endregion
//#region src/agents/harness/context-engine-turn-outbox.ts
const RECOVERED_TURN_MAX_EVENTS = 2e4;
const RECOVERED_TURN_MAX_BYTES = 8388608;
function outboxEnqueueSequence() {
	return sql`context_engine_turn_outbox.rowid`;
}
function oldestOutboxEnqueueSequence() {
	return sql`MIN(context_engine_turn_outbox.rowid)`;
}
function outboxPayloadRequiresAdvancement() {
	return sql`json_extract(context_engine_turn_outbox.payload_json, '$.state') IS NOT 'blocked'`;
}
function isRetryableContextEngineTurnReadFailure(kind) {
	return kind === "projection-unavailable";
}
function outboxDb(database) {
	ensureContextEngineTurnOutboxSchema(database.db);
	return getNodeSqliteKysely(database.db);
}
function assertMatchingOutboxOwner(existing, params, advancementKey) {
	if (existing.engine_id !== params.engineId || existing.owner_plugin_id !== (params.ownerPluginId ?? null)) throw new Error(`context-engine advancement key collision: ${advancementKey}`);
}
function writeContextEngineTurnOutboxPayload(params) {
	const db = outboxDb(params.database);
	const admission = params.payload.state === "admitted" ? params.payload.admission : params.payload.boundary.admission;
	const advancementKey = admission.logicalTurnId;
	const payloadJson = JSON.stringify(params.payload);
	const existing = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("context_engine_turn_outbox").select([
		"engine_id",
		"owner_plugin_id",
		"payload_json"
	]).where("advancement_key", "=", advancementKey));
	if (existing) {
		assertMatchingOutboxOwner(existing, params, advancementKey);
		const existingPayload = JSON.parse(existing.payload_json);
		if (params.payload.state === "accepted" && existingPayload.state === "admitted" && existingPayload.admission.entryId === admission.entryId || params.payload.state === "blocked" && existingPayload.state === "accepted" && existingPayload.boundary.admission.entryId === admission.entryId && existingPayload.boundary.terminal.entryId === params.payload.boundary.terminal.entryId || params.payload.state === "ready" && existingPayload.state === "accepted" && existingPayload.boundary.admission.entryId === admission.entryId && existingPayload.boundary.terminal.entryId === params.payload.boundary.terminal.entryId) {
			executeSqliteQuerySync(params.database.db, db.updateTable("context_engine_turn_outbox").set({
				attempt_count: 0,
				last_attempt_at: null,
				last_error: null,
				payload_json: payloadJson
			}).where("advancement_key", "=", advancementKey));
			return;
		}
		if (existing.payload_json !== payloadJson) throw new Error(`context-engine advancement key collision: ${advancementKey}`);
		return;
	}
	executeSqliteQuerySync(params.database.db, db.insertInto("context_engine_turn_outbox").values({
		advancement_key: advancementKey,
		engine_id: params.engineId,
		owner_plugin_id: params.ownerPluginId ?? null,
		session_id: admission.sessionId,
		payload_json: payloadJson,
		created_at: Date.now(),
		last_attempt_at: null,
		last_error: null
	}).onConflict((conflict) => conflict.column("advancement_key").doNothing()));
}
function enqueueContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			admission: params.admission,
			isHeartbeat: params.isHeartbeat,
			state: "admitted"
		}
	});
}
function acceptContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			boundary: params.boundary,
			isHeartbeat: params.isHeartbeat,
			state: "accepted",
			runtimeContext: params.runtimeContext
		}
	});
}
function enqueueContextEngineTurnCommit(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			...params.payload,
			state: "ready"
		}
	});
}
function blockContextEngineTurnIntent(params) {
	writeContextEngineTurnOutboxPayload({
		...params,
		payload: {
			boundary: params.boundary,
			failure: params.failure,
			isHeartbeat: params.isHeartbeat,
			state: "blocked"
		}
	});
}
function discardContextEngineTurnIntent(params) {
	const db = outboxDb(params.database);
	executeSqliteQuerySync(params.database.db, db.deleteFrom("context_engine_turn_outbox").where("advancement_key", "=", params.admission.logicalTurnId).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null));
}
function recoverContextEngineTurnOutbox(params) {
	const db = outboxDb(params.database);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("context_engine_turn_outbox").select(["advancement_key", "payload_json"]).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where("session_id", "=", params.sessionId).orderBy(outboxEnqueueSequence(), "asc")).rows;
	for (const row of rows) {
		const payload = JSON.parse(row.payload_json);
		if (payload.state === "ready") continue;
		if (payload.state === "blocked") {
			params.warn(`[context-engine] durable turn advancement is blocked: ${row.advancement_key}: transcript range is ${payload.failure}`);
			continue;
		}
		if (payload.state === "admitted") {
			discardContextEngineTurnIntent({
				admission: payload.admission,
				database: params.database,
				engineId: params.engineId,
				ownerPluginId: params.ownerPluginId
			});
			continue;
		}
		const closedTurn = readClosedTranscriptTurn({
			boundary: payload.boundary,
			maxEvents: RECOVERED_TURN_MAX_EVENTS,
			maxBytes: RECOVERED_TURN_MAX_BYTES
		});
		if (closedTurn.kind !== "ok") {
			if (isRetryableContextEngineTurnReadFailure(closedTurn.kind)) {
				params.warn(`[context-engine] durable turn recovery remains queued: ${row.advancement_key}: transcript range is ${closedTurn.kind}`);
				continue;
			}
			params.warn(`[context-engine] blocked unrecoverable turn advancement: ${row.advancement_key}: transcript range is ${closedTurn.kind}`);
			blockContextEngineTurnIntent({
				boundary: payload.boundary,
				database: params.database,
				engineId: params.engineId,
				failure: closedTurn.kind,
				isHeartbeat: payload.isHeartbeat,
				ownerPluginId: params.ownerPluginId
			});
			continue;
		}
		enqueueContextEngineTurnCommit({
			database: params.database,
			engineId: params.engineId,
			ownerPluginId: params.ownerPluginId,
			payload: {
				boundary: payload.boundary,
				isHeartbeat: payload.isHeartbeat,
				messages: closedTurn.messages,
				runtimeContext: payload.runtimeContext
			}
		});
	}
}
async function drainContextEngineTurnOutbox(params) {
	if (typeof params.engine.commitTurn !== "function") return { pending: false };
	let remaining = Math.max(0, params.limit ?? 16);
	if (remaining === 0) return { pending: hasPendingContextEngineTurn(params) };
	const db = outboxDb(params.database);
	let pendingSessionsQuery = db.selectFrom("context_engine_turn_outbox").select("session_id").select(oldestOutboxEnqueueSequence().as("oldest_enqueue_sequence")).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where(outboxPayloadRequiresAdvancement());
	if (params.sessionId) pendingSessionsQuery = pendingSessionsQuery.where("session_id", "=", params.sessionId);
	let activeSessionIds = executeSqliteQuerySync(params.database.db, pendingSessionsQuery.groupBy("session_id").orderBy("oldest_enqueue_sequence", "asc").limit(remaining)).rows.map(({ session_id }) => session_id);
	while (remaining > 0 && activeSessionIds.length > 0) {
		const continuingSessionIds = [];
		for (const sessionId of activeSessionIds) {
			if (remaining === 0) break;
			const row = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("context_engine_turn_outbox").select([
				"advancement_key",
				"payload_json",
				"session_id"
			]).where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where("session_id", "=", sessionId).where(outboxPayloadRequiresAdvancement()).orderBy(outboxEnqueueSequence(), "asc").limit(1));
			if (!row) continue;
			remaining -= 1;
			if (await commitPendingContextEngineTurn({
				...params,
				db,
				row
			})) continuingSessionIds.push(sessionId);
		}
		activeSessionIds = continuingSessionIds;
	}
	return { pending: hasPendingContextEngineTurn(params) };
}
function hasPendingContextEngineTurn(params) {
	let query = outboxDb(params.database).selectFrom("context_engine_turn_outbox").select("advancement_key").where("engine_id", "=", params.engineId).where("owner_plugin_id", params.ownerPluginId ? "=" : "is", params.ownerPluginId ?? null).where(outboxPayloadRequiresAdvancement());
	if (params.sessionId) query = query.where("session_id", "=", params.sessionId);
	return executeSqliteQueryTakeFirstSync(params.database.db, query.limit(1)) !== void 0;
}
async function commitPendingContextEngineTurn(params) {
	const { row } = params;
	try {
		const payload = JSON.parse(row.payload_json);
		if (payload.state !== "ready") return false;
		const commonParams = {
			advancementKey: row.advancement_key,
			admission: payload.boundary.admission,
			terminal: payload.boundary.terminal,
			messages: payload.messages,
			sessionId: payload.boundary.admission.sessionId,
			sessionKey: payload.boundary.admission.sessionKey,
			sessionTarget: {
				agentId: payload.boundary.admission.agentId,
				sessionId: payload.boundary.admission.sessionId,
				sessionKey: payload.boundary.admission.sessionKey,
				storePath: payload.boundary.admission.storePath
			},
			isHeartbeat: payload.isHeartbeat,
			...payload.runtimeContext ? { runtimeContext: payload.runtimeContext } : {}
		};
		const result = await params.engine.commitTurn?.(commonParams);
		if (!result) throw new Error("context engine does not implement commitTurn");
		if (result.status !== "committed" && result.status !== "duplicate") throw new Error(`invalid commitTurn result status: ${String(result.status)}`);
		executeSqliteQuerySync(params.database.db, params.db.deleteFrom("context_engine_turn_outbox").where("advancement_key", "=", row.advancement_key));
		try {
			params.onCommitted?.(commonParams);
		} catch (error) {
			params.warn(`[context-engine] committed turn notification failed: ${error instanceof Error ? error.message : String(error)}`);
		}
		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		executeSqliteQuerySync(params.database.db, params.db.updateTable("context_engine_turn_outbox").set((eb) => ({
			attempt_count: eb("attempt_count", "+", 1),
			last_attempt_at: Date.now(),
			last_error: message
		})).where("advancement_key", "=", row.advancement_key));
		params.warn(`[context-engine] durable turn advancement remains queued: ${row.advancement_key}: ${message}`);
		return false;
	}
}
//#endregion
//#region src/agents/harness/context-engine-turn-attempt.ts
const ACCEPTED_TURN_MAX_EVENTS = 2e4;
const ACCEPTED_TURN_MAX_BYTES = 8388608;
async function drainPendingContextEngineTurnsBeforeRun(params) {
	if (!params.admission && !params.recorder || params.lease.degraded || !supportsContextEngineDurableTurnAdvancement(params.lease.engine)) return;
	const warn = params.warn ?? console.warn;
	try {
		const target = params.admission ?? params.sessionTarget;
		if (!target?.agentId || !target.sessionId || !target.sessionKey || !target.storePath) {
			params.lease.degradeBeforeStart("durable transcript target is unavailable before context assembly");
			return;
		}
		const databasePath = params.admission ? params.admission.storePath : resolveSessionTranscriptDatabasePath({
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		});
		const database = openOpenClawAgentDatabase({
			agentId: target.agentId,
			path: databasePath
		});
		recoverContextEngineTurnOutbox({
			database,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			sessionId: target.sessionId,
			warn
		});
		if ((await drainContextEngineTurnOutbox({
			database,
			engine: params.lease.engine,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			sessionId: target.sessionId,
			warn
		})).pending) {
			params.lease.degradeBeforeStart("pending durable turn advancement could not be completed before the next turn");
			return;
		}
		const enqueueAdmission = (admission) => {
			if (admission.agentId !== target.agentId || admission.sessionId !== target.sessionId || admission.sessionKey !== target.sessionKey || admission.storePath !== databasePath) throw new Error("context-engine transcript target changed before provider dispatch");
			enqueueContextEngineTurnIntent({
				admission,
				database,
				engineId: params.lease.effectiveEngineId,
				isHeartbeat: params.isHeartbeat === true,
				ownerPluginId: params.lease.effectiveEnginePluginId
			});
		};
		if (params.admission) {
			enqueueAdmission(params.admission);
			return;
		}
		if (!params.recorder?.setAdmissionHandler) {
			params.lease.degradeBeforeStart("current-turn transcript admission cannot be recorded for durable advancement");
			return;
		}
		params.recorder.setAdmissionHandler(enqueueAdmission);
	} catch (error) {
		warn(`[context-engine] failed to retry pending turn advancement: ${error instanceof Error ? error.message : String(error)}`);
		params.lease.degradeBeforeStart("pending durable turn advancement could not be checked before the next turn");
	}
}
function discardContextEngineTurnAttemptIntent(params) {
	const warn = params.warn ?? console.warn;
	try {
		const admission = params.facts.boundary.admission;
		discardContextEngineTurnIntent({
			admission,
			database: openOpenClawAgentDatabase({
				agentId: admission.agentId,
				path: admission.storePath
			}),
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId
		});
	} catch (error) {
		warn(`[context-engine] failed to discard unaccepted turn intent: ${error instanceof Error ? error.message : String(error)}`);
	}
}
function assertAcceptedTranscriptTarget(facts) {
	const { admission, terminal } = facts.boundary;
	if (facts.sessionIdUsed !== admission.sessionId || terminal.agentId !== admission.agentId || terminal.sessionId !== admission.sessionId || terminal.sessionKey !== admission.sessionKey || terminal.storePath !== admission.storePath || facts.sessionKey !== void 0 && facts.sessionKey !== admission.sessionKey || facts.sessionTarget?.agentId !== void 0 && facts.sessionTarget.agentId !== admission.agentId || facts.sessionTarget?.sessionId !== void 0 && facts.sessionTarget.sessionId !== admission.sessionId || facts.sessionTarget?.sessionKey !== void 0 && facts.sessionTarget.sessionKey !== admission.sessionKey) throw new Error("accepted context-engine transcript target changed after admission");
}
/** Commit the accepted transcript range and offer acknowledged turns to host-owned maintenance. */
async function finalizeAcceptedContextEngineTurn(params) {
	const declaresDurableAdvancement = params.lease.engine.info.transcriptSemantics?.turnAdvancementIdempotency !== void 0;
	const implementsDurableAdvancement = supportsContextEngineDurableTurnAdvancement(params.lease.engine);
	if (!declaresDurableAdvancement && !implementsDurableAdvancement) return;
	const warn = params.warn ?? console.warn;
	if (params.facts.promptError || params.facts.aborted || params.facts.yieldAborted) {
		discardContextEngineTurnAttemptIntent({
			facts: params.facts,
			lease: params.lease,
			warn
		});
		return;
	}
	try {
		assertAcceptedTranscriptTarget(params.facts);
		if (params.lease.degraded || !declaresDurableAdvancement || !implementsDurableAdvancement) throw new Error("accepted context engine does not support durable turn advancement");
		const admission = params.facts.boundary.admission;
		const database = openOpenClawAgentDatabase({
			agentId: admission.agentId,
			path: admission.storePath
		});
		acceptContextEngineTurnIntent({
			boundary: params.facts.boundary,
			database,
			engineId: params.lease.effectiveEngineId,
			isHeartbeat: params.facts.isHeartbeat === true,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			runtimeContext: params.facts.runtimeContext
		});
		const closedTurn = readClosedTranscriptTurn({
			boundary: params.facts.boundary,
			maxEvents: ACCEPTED_TURN_MAX_EVENTS,
			maxBytes: ACCEPTED_TURN_MAX_BYTES
		});
		if (closedTurn.kind !== "ok") {
			if (!isRetryableContextEngineTurnReadFailure(closedTurn.kind)) blockContextEngineTurnIntent({
				boundary: params.facts.boundary,
				database,
				engineId: params.lease.effectiveEngineId,
				failure: closedTurn.kind,
				isHeartbeat: params.facts.isHeartbeat === true,
				ownerPluginId: params.lease.effectiveEnginePluginId
			});
			throw new Error(`accepted context-engine transcript range is ${closedTurn.kind}`);
		}
		enqueueContextEngineTurnCommit({
			database,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			payload: {
				boundary: params.facts.boundary,
				isHeartbeat: params.facts.isHeartbeat === true,
				messages: closedTurn.messages,
				runtimeContext: params.facts.runtimeContext
			}
		});
		const maintenanceBySession = /* @__PURE__ */ new Map();
		await drainContextEngineTurnOutbox({
			database,
			engine: params.lease.engine,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			onCommitted: (turn) => {
				maintenanceBySession.set(turn.sessionId, {
					contextEngine: params.lease.engine,
					sessionId: turn.sessionId,
					sessionKey: turn.sessionKey,
					sessionTarget: turn.sessionTarget,
					sessionFile: turn.admission.sessionKey,
					reason: "turn",
					runtimeContext: turn.runtimeContext,
					config: params.config,
					onDeferredMaintenance: (promise) => params.lease.deferDisposalUntil(promise)
				});
			},
			warn
		});
		for (const maintenance of maintenanceBySession.values()) await runContextEngineMaintenance(maintenance);
	} catch (error) {
		warn(`[context-engine] skipped accepted turn advancement: ${error instanceof Error ? error.message : String(error)}`);
	}
}
//#endregion
export { selectContextEngineForTranscriptHost as a, createContextEngineLogicalTurnLease as i, drainPendingContextEngineTurnsBeforeRun as n, finalizeAcceptedContextEngineTurn as r, discardContextEngineTurnAttemptIntent as t };
