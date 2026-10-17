import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { z as recordContextEngineTurnOutboxSchemaCommitted } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { f as withOpenClawAgentDatabaseAsync, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { c as resolveLogicalTurnContextEngines, l as disposeContextEngineSources, r as hasSameContextEngineInstance } from "./registry-BIuAP_WM.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as executeContextEngineTurnOutboxCommand, t as drainContextEngineTurnOutbox } from "./context-engine-turn-outbox-CI4iO3YG.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { a as evaluateContextEngineHostSupport, o as supportsContextEngineDurableTurnAdvancement } from "./host-compat-xESS3bi6.mjs";
import { t as ensureContextEnginesInitialized } from "./init-CLvlMRF6.mjs";
import { t as runContextEngineMaintenance } from "./context-engine-maintenance-DDo1CHf0.mjs";
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
	const resolution = await resolveLogicalTurnContextEngines(params.config, {
		initialize: ensureContextEnginesInitialized,
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
//#region src/agents/harness/context-engine-turn-outbox-store.ts
/**
* Runs one outbox command in the agent database worker. The host thread only
* awaits it, so a worker transaction waiting on this thread for its commit
* grant is never blocked by synchronous SQLite here.
*/
async function runContextEngineTurnOutboxCommand(target, command) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		agentId: target.agentId,
		env,
		path: resolveOpenClawAgentSqlitePath({
			agentId: target.agentId,
			env,
			path: target.path
		})
	};
	if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) {
		let committedDb;
		const result = await runOpenClawAgentWriteAdmission(options, () => runOpenClawAgentWriteTransaction(({ db }) => {
			committedDb = db;
			return executeContextEngineTurnOutboxCommand(db, command);
		}, options, { operationLabel: `context-engine.turn-outbox.${command.type}` }), true);
		if (committedDb) recordContextEngineTurnOutboxSchemaCommitted(committedDb);
		return result;
	}
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const assertCurrent = () => execution.assertCurrent();
	try {
		return await runOpenClawAgentWriteAdmission(options, () => withOpenClawAgentDatabaseAsync(options, async ({ db }) => {
			assertCurrent();
			const worker = await openOpenClawAgentSqliteWorkerStore(options, db, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.contextEngineTurnOutbox),
				input: void 0
			});
			try {
				return await worker.execute(command, assertCurrent);
			} finally {
				await worker.close();
			}
		}, assertCurrent), true);
	} finally {
		await execution.release();
	}
}
function openContextEngineTurnOutboxWorkerStore(target) {
	const run = (command) => runContextEngineTurnOutboxCommand(target, command);
	return {
		prepareRun: (input) => run({
			type: "prepareRun",
			input
		}),
		listPendingSessions: (input) => run({
			type: "listPendingSessions",
			input
		}),
		readNextPending: (input) => run({
			type: "readNextPending",
			input
		}),
		complete: async (advancementKey) => {
			await run({
				type: "complete",
				input: { advancementKey }
			});
		},
		recordFailure: async (advancementKey, message, attemptedAt) => {
			await run({
				type: "recordFailure",
				input: {
					advancementKey,
					message,
					attemptedAt
				}
			});
		},
		hasPending: (input) => run({
			type: "hasPending",
			input
		}),
		enqueueIntent: (input) => run({
			type: "enqueueIntent",
			input
		}),
		acceptIntent: (input) => run({
			type: "acceptIntent",
			input
		}),
		publishClosedTurn: (input) => run({
			type: "publishClosedTurn",
			input
		}),
		discardIntent: (input) => run({
			type: "discardIntent",
			input
		})
	};
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
		const store = openContextEngineTurnOutboxWorkerStore({
			agentId: target.agentId,
			path: databasePath
		});
		const owner = {
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId
		};
		const prepared = await store.prepareRun({
			...owner,
			admission: params.admission,
			isHeartbeat: params.isHeartbeat === true,
			sessionId: target.sessionId
		});
		for (const message of prepared.warnings) warn(message);
		if (prepared.pending) {
			if ((await drainContextEngineTurnOutbox({
				store,
				engine: params.lease.engine,
				...owner,
				sessionId: target.sessionId,
				warn
			})).pending) {
				params.lease.degradeBeforeStart("pending durable turn advancement could not be completed before the next turn");
				return;
			}
		}
		const enqueueAdmission = (admission) => {
			if (admission.agentId !== target.agentId || admission.sessionId !== target.sessionId || admission.sessionKey !== target.sessionKey || admission.storePath !== databasePath) throw new Error("context-engine transcript target changed before provider dispatch");
			return store.enqueueIntent({
				...owner,
				admission,
				isHeartbeat: params.isHeartbeat === true
			});
		};
		if (params.admission) {
			if (!prepared.admitted) await enqueueAdmission(params.admission);
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
async function discardContextEngineTurnAttemptIntent(params) {
	const warn = params.warn ?? console.warn;
	try {
		const admission = params.facts.boundary.admission;
		await openContextEngineTurnOutboxWorkerStore({
			agentId: admission.agentId,
			path: admission.storePath
		}).discardIntent({
			admission,
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
		await discardContextEngineTurnAttemptIntent({
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
		const store = openContextEngineTurnOutboxWorkerStore({
			agentId: admission.agentId,
			path: admission.storePath
		});
		const accepted = {
			boundary: params.facts.boundary,
			engineId: params.lease.effectiveEngineId,
			isHeartbeat: params.facts.isHeartbeat === true,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			runtimeContext: params.facts.runtimeContext
		};
		await store.acceptIntent(accepted);
		const closedTurnKind = await store.publishClosedTurn({
			...accepted,
			maxBytes: ACCEPTED_TURN_MAX_BYTES,
			maxEvents: ACCEPTED_TURN_MAX_EVENTS
		});
		if (closedTurnKind !== "ok") throw new Error(`accepted context-engine transcript range is ${closedTurnKind}`);
		const maintenanceBySession = /* @__PURE__ */ new Map();
		const onCommitted = (turn) => {
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
		};
		await drainContextEngineTurnOutbox({
			store,
			engine: params.lease.engine,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			sessionId: admission.sessionId,
			onCommitted,
			warn
		});
		const retrySessionIds = await store.listPendingSessions({
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			limit: 16
		});
		for (const sessionId of retrySessionIds) {
			if (sessionId === admission.sessionId) continue;
			await drainContextEngineTurnOutbox({
				store,
				engine: params.lease.engine,
				engineId: params.lease.effectiveEngineId,
				ownerPluginId: params.lease.effectiveEnginePluginId,
				sessionId,
				limit: 1,
				onCommitted,
				warn
			});
		}
		for (const maintenance of maintenanceBySession.values()) await runContextEngineMaintenance(maintenance);
	} catch (error) {
		warn(`[context-engine] skipped accepted turn advancement: ${error instanceof Error ? error.message : String(error)}`);
	}
}
//#endregion
export { selectContextEngineForTranscriptHost as a, createContextEngineLogicalTurnLease as i, drainPendingContextEngineTurnsBeforeRun as n, finalizeAcceptedContextEngineTurn as r, discardContextEngineTurnAttemptIntent as t };
