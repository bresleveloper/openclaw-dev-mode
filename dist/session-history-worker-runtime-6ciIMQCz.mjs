import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-cppt7dT0.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-DS6WgDIN.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-Cotag45I.mjs";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-CEhwSBBh.mjs";
//#region src/config/sessions/session-history-worker-runtime.ts
const queuedHistoryReads = /* @__PURE__ */ new Map();
let pendingHistoryReaders = 0;
let pendingHistoryBytes = 0;
function receivePage(queued, signal) {
	queued.remainingReaders++;
	return queued.promise.then((page) => {
		queued.remainingReaders--;
		signal?.throwIfAborted();
		return queued.remainingReaders === 0 ? page : structuredClone(page);
	}, (error) => {
		queued.remainingReaders--;
		if (error instanceof SessionHistoryDeltaPreparationError) {
			signal?.throwIfAborted();
			if (queued.remainingReaders > 0) throw new SessionHistoryDeltaPreparationError(structuredClone(error.partial));
		}
		throw error;
	});
}
function readQueuedPage(input, key, owner, signal) {
	signal?.throwIfAborted();
	const existing = queuedHistoryReads.get(key);
	if (existing) return receivePage(existing, signal);
	const pending = createDeferredCore();
	const queued = {
		promise: pending.promise,
		remainingReaders: 0
	};
	queuedHistoryReads.set(key, queued);
	owner.run(() => {
		queuedHistoryReads.delete(key);
		return input;
	}, key.length * 2).then(pending.resolve, pending.reject).finally(() => {
		if (queuedHistoryReads.get(key) === queued) queuedHistoryReads.delete(key);
	});
	return receivePage(queued, signal);
}
async function readSessionHistoryPageInWorker(request, signal) {
	signal?.throwIfAborted();
	const scope = request.kind === "rpc" ? {
		agentId: request.params.sessionAgentId,
		sessionId: request.params.sessionId,
		sessionEntry: request.params.entry,
		sessionKey: request.params.canonicalKey,
		storePath: request.params.storePath
	} : request.params.target;
	const targetCache = /* @__PURE__ */ new Map();
	const resolved = resolveSqliteTranscriptReadScope(scope, targetCache);
	const admission = resolveSessionTranscriptReadFence(resolved);
	const bound = prepareSessionTranscriptReadTargetCore(scope);
	const entryValidationKey = bound.entryValidationScope ? resolveSqliteScope(bound.entryValidationScope, targetCache).sessionKey : void 0;
	const sessionKey = entryValidationKey ?? bound.sessionKey;
	const transcript = {
		agentId: bound.agentId,
		sessionId: scope.sessionId,
		...sessionKey ? { sessionKey } : {},
		storePath: bound.storePath
	};
	const readScope = resolveSqliteTranscriptReadScope(transcript, targetCache);
	const databaseOptions = toDatabaseOptions(resolved);
	const currentSource = {
		agentId: databaseOptions.agentId,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	};
	const stateContext = captureOpenClawStateWorkerContext();
	const sourceReads = prepareGatewaySessionStoreReadSources({
		cfg: getRuntimeConfig(),
		currentSource,
		env: process.env,
		registryPath: stateContext.admission.databasePath
	});
	const assertStateCurrent = () => {
		stateContext.maintenanceScope?.assertAdmission();
		stateContext.admission.assertCurrent();
		sourceReads.assertCurrent();
	};
	assertStateCurrent();
	const input = {
		kind: "history-page",
		database: currentSource,
		request,
		target: {
			transcript: {
				agentId: readScope.agentId,
				sessionId: scope.sessionId,
				...readScope.sessionKey ? { sessionKey: readScope.sessionKey } : {},
				storePath: bound.storePath,
				sessionFile: sessionKey ?? scope.sessionId
			},
			stateDatabase: {
				path: stateContext.admission.databasePath,
				environment: stateContext.environment,
				coordinatorRuntime: stateContext.coordinatorRuntime
			},
			sourceDatabases: sourceReads.sources,
			...entryValidationKey ? { entryValidationKey } : {}
		},
		...admission ? { admission: { ...admission } } : {}
	};
	const key = JSON.stringify(input);
	const inputBytes = key.length * 2;
	if (pendingHistoryReaders >= 128 || pendingHistoryBytes + inputBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
	pendingHistoryReaders++;
	pendingHistoryBytes += inputBytes;
	try {
		const acquired = await withSessionHistoryWorkerDatabase(input.database, async (owner) => {
			let result;
			try {
				result = await readRestoredSessionTranscript(scope, () => {
					assertStateCurrent();
					return readQueuedPage(input, `${owner.generation}:${key}`, owner, signal);
				}, { assertCurrent: owner.assertCurrent });
			} catch (error) {
				if (error instanceof SessionHistoryDeltaPreparationError && request.kind === "delta") {
					owner.assertCurrent();
					result = {
						kind: "delta",
						...error.partial
					};
				} else throw error;
			}
			return {
				result,
				assertCurrent: owner.assertCurrent
			};
		});
		const assertCurrent = () => {
			acquired.assertCurrent();
			assertStateCurrent();
		};
		assertCurrent();
		const result = acquired.result;
		if (result.kind !== request.kind) throw new Error("Session history worker returned the wrong page type");
		return result.kind === "rpc" ? result.page : result.kind === "http" ? result.snapshot : result.kind === "delta" ? {
			...result,
			assertCurrent
		} : result.messages;
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
			...databaseOptions,
			preferredSessionId: resolved.sessionId
		});
		throw error;
	} finally {
		pendingHistoryReaders--;
		pendingHistoryBytes -= inputBytes;
	}
}
//#endregion
export { readSessionHistoryPageInWorker };
