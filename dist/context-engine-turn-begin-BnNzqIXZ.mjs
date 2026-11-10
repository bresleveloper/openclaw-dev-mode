import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as resolveOpenClawAgentSqlitePath, o as resolveExplicitIncognitoAgentSqliteTarget } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { i as rethrowIncognitoSessionError, n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { i as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { t as drainContextEngineTurnOutbox } from "./context-engine-turn-outbox-HB4IWCvc.mjs";
import { o as supportsContextEngineDurableTurnAdvancement } from "./host-compat-DWLjZN89.mjs";
import { t as runContextEngineMaintenance } from "./context-engine-maintenance-DybI5s-J.mjs";
//#region src/agents/harness/context-engine-turn-outbox-memory.ts
/** Plugin callbacks run outside the FIFO; only their intent acknowledgments reenter it. */
function openMemoryContextEngineTurnOutboxStore(scope, source) {
	const { authority } = source;
	const sessionKey = scope.sessionKey ?? (scope.sessionId ? source.owner?.readSessionById(scope.sessionId, authority)?.sessionKey : void 0);
	const selected = () => {
		const binding = getSessionActorStorageBinding({}) ?? source.binding;
		return binding?.agentId === source.agentId && binding.path === source.path && binding.actor.target.sessionKey === sessionKey ? binding : void 0;
	};
	const run = async (operation) => {
		const binding = selected();
		if (binding) return operation(binding);
		const actor = sessionKey ? await source.owner?.acquireExisting(sessionKey, {
			assertCurrent: () => authority.assertCurrent(),
			assertReadable: () => authority.assertCurrent()
		}) : void 0;
		if (!actor) throw new IncognitoSessionMissingError();
		try {
			return await operation({
				actor,
				authority,
				agentId: source.agentId,
				path: source.path
			});
		} finally {
			await actor.release();
		}
	};
	return {
		retain: (operation) => run(({ actor }) => actor.withPhase("context-engine-outbox", authority, ({ actor: held }) => runWithSessionActorStorage({
			actor: held,
			authority,
			agentId: source.agentId,
			path: source.path
		}, operation))),
		assertReadable() {
			const binding = selected();
			if (binding) {
				binding.actor.snapshot(authority);
				return;
			}
			if (!sessionKey || !source.owner?.readSession(sessionKey, authority)) throw new IncognitoSessionMissingError();
		},
		prepareRun: async (input) => run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
			type: "session.outbox.prepareRun",
			input
		}, authority))),
		enqueueIntent: async (input) => run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
			type: "session.outbox.enqueueIntent",
			input
		}, authority))),
		acceptIntent: async (input) => run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
			type: "session.outbox.acceptIntent",
			input
		}, authority))),
		publishClosedTurn: async (input) => run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
			type: "session.outbox.publishClosedTurn",
			input
		}, authority))),
		discardIntent: async (input) => run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
			type: "session.outbox.discardIntent",
			input
		}, authority))),
		listPendingSessions: (input) => run(({ actor }) => actor.storage.read({
			type: "session.outbox.listPendingSessions",
			input
		}, authority)),
		readNextPending: (input) => run(({ actor }) => actor.storage.read({
			type: "session.outbox.readNextPending",
			input
		}, authority)),
		hasPending: (input) => run(({ actor }) => actor.storage.read({
			type: "session.outbox.hasPending",
			input
		}, authority)),
		complete: async (advancementKey) => {
			await run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
				type: "session.outbox.complete",
				input: { advancementKey }
			}, authority)));
		},
		recordFailure: async (advancementKey, message, attemptedAt) => {
			await run(async ({ actor }) => readSessionActorStorageResult(await actor.storage.mutate({
				type: "session.outbox.recordFailure",
				input: {
					advancementKey,
					message,
					attemptedAt
				}
			}, authority)));
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
	if (resolveExplicitIncognitoAgentSqliteTarget(target.path, { agentId: target.agentId })) throw new IncognitoSessionMissingError();
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
	const execution = captureOpenClawAgentDatabaseExecution(options);
	try {
		const worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
			moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.contextEngineTurnOutbox),
			input: void 0
		});
		try {
			return await worker.execute(command, () => execution.assertCurrent());
		} finally {
			await worker.close();
		}
	} finally {
		await execution.release();
	}
}
function openContextEngineTurnOutboxWorkerStore(target) {
	const scope = {
		...target,
		storePath: target.path
	};
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return openMemoryContextEngineTurnOutboxStore(scope, memory);
	const captured = { ...target };
	const run = (command) => {
		return runContextEngineTurnOutboxCommand(captured, command);
	};
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
			path: databasePath,
			sessionKey: target.sessionKey,
			sessionId: target.sessionId
		});
		const owner = {
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId
		};
		const retainAdmission = (admission, write) => {
			const pending = new Promise((resolve) => {
				params.lease.onDispose(JSON.stringify([databasePath, admission.logicalTurnId]), async () => {
					await pending.catch(() => {});
					if (await store.discardIntent({
						...owner,
						admission
					})) warn(`[context-engine] discarded unaccepted turn advancement: ${admission.logicalTurnId}: run ended without host acceptance`);
				});
				resolve(write());
			});
			return pending;
		};
		const sessionId = target.sessionId;
		const prepare = () => store.prepareRun({
			...owner,
			admission: params.admission,
			isHeartbeat: params.isHeartbeat === true,
			sessionId
		});
		const prepared = await (params.admission ? retainAdmission(params.admission, prepare) : prepare());
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
		const enqueueAdmission = async (admission) => {
			if (params.lease.disposed) return;
			if (admission.agentId !== target.agentId || admission.sessionId !== target.sessionId || admission.sessionKey !== target.sessionKey || admission.storePath !== databasePath) throw new Error("context-engine transcript target changed before provider dispatch");
			await retainAdmission(admission, () => store.enqueueIntent({
				...owner,
				admission,
				isHeartbeat: params.isHeartbeat === true
			}));
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
		rethrowIncognitoSessionError(error);
		warn(`[context-engine] failed to retry pending turn advancement: ${error instanceof Error ? error.message : String(error)}`);
		params.lease.degradeBeforeStart("pending durable turn advancement could not be checked before the next turn");
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
	if (params.facts.promptError || params.facts.aborted || params.facts.yieldAborted) return;
	try {
		assertAcceptedTranscriptTarget(params.facts);
		if (params.lease.degraded || !declaresDurableAdvancement || !implementsDurableAdvancement) throw new Error("accepted context engine does not support durable turn advancement");
		const admission = params.facts.boundary.admission;
		const store = openContextEngineTurnOutboxWorkerStore({
			agentId: admission.agentId,
			path: admission.storePath,
			sessionKey: admission.sessionKey,
			sessionId: admission.sessionId
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
		const drainSession = (sessionId, limit) => drainContextEngineTurnOutbox({
			store,
			engine: params.lease.engine,
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			sessionId,
			...limit === void 0 ? {} : { limit },
			onCommitted,
			warn
		});
		await drainSession(admission.sessionId);
		const retrySessionIds = await store.listPendingSessions({
			engineId: params.lease.effectiveEngineId,
			ownerPluginId: params.lease.effectiveEnginePluginId,
			limit: 16
		});
		for (const sessionId of retrySessionIds) {
			if (sessionId === admission.sessionId) continue;
			await drainSession(sessionId, 1);
		}
		for (const maintenance of maintenanceBySession.values()) await runContextEngineMaintenance(maintenance);
	} catch (error) {
		rethrowIncognitoSessionError(error);
		warn(`[context-engine] skipped accepted turn advancement: ${error instanceof Error ? error.message : String(error)}`);
	}
}
//#endregion
//#region src/agents/harness/context-engine-turn-begin.ts
async function beginContextEngineLogicalTurn(params) {
	const { host, ...turn } = params;
	const admission = turn.recorder?.getAdmissionReceipt();
	if (turn.recorder && !admission && turn.recorder.hasPersisted()) turn.lease.degradeBeforeStart("current-turn transcript admission receipt is unavailable");
	else turn.lease.selectForHost({
		host,
		operation: "agent-run",
		requiresDurableCommit: turn.recorder !== void 0
	});
	await drainPendingContextEngineTurnsBeforeRun({
		...turn,
		admission: turn.recorder?.getAdmissionReceipt()
	});
	return turn.lease.begin();
}
//#endregion
export { finalizeAcceptedContextEngineTurn as n, beginContextEngineLogicalTurn as t };
