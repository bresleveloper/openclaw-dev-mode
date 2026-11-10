import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-D75quOgT.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { c as waitForSessionTranscriptProjection, i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { t as readRestoredSessionTranscript } from "./session-cold-storage-read-DxurMT4l.mjs";
import "./config-B3oiWDlr.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BT22ajgI.mjs";
import { t as prepareGatewaySessionStoreReadSourcesAsync } from "./session-utils-store-sources-Ovvkh3uG.mjs";
import path from "node:path";
//#region src/config/sessions/session-history-worker-runtime.ts
const queuedHistoryReads = /* @__PURE__ */ new Map();
let pendingHistoryReaders = 0;
let pendingHistoryBytes = 0;
function receivePage(queued, signal) {
	queued.remainingReaders++;
	return queued.promise.then((page) => {
		queued.remainingReaders--;
		signal?.throwIfAborted();
		if (queued.remainingReaders === 0) return page;
		if (page.kind === "rpc" && page.page.encodedResponse) {
			const { messages, ...response } = page.page.encodedResponse;
			const copy = structuredClone({
				...page,
				page: {
					...page.page,
					encodedResponse: response
				}
			});
			return {
				...copy,
				page: {
					...copy.page,
					encodedResponse: {
						...copy.page.encodedResponse,
						messages
					}
				}
			};
		}
		return structuredClone(page);
	}, (error) => {
		queued.remainingReaders--;
		if (error instanceof SessionHistoryDeltaPreparationError) {
			signal?.throwIfAborted();
			if (queued.remainingReaders > 0) throw new SessionHistoryDeltaPreparationError(structuredClone(error.partial));
		}
		throw error;
	});
}
function readQueuedHistory(input, key, owner, signal) {
	signal?.throwIfAborted();
	const existing = queuedHistoryReads.get(key);
	if (existing) return receivePage(existing, signal);
	const pending = createDeferredCore();
	const queued = {
		promise: pending.promise,
		remainingReaders: 0
	};
	queuedHistoryReads.set(key, queued);
	const forget = () => {
		if (queuedHistoryReads.get(key) === queued) queuedHistoryReads.delete(key);
	};
	(input.kind === "cold-metadata" ? owner.readColdMetadata({
		sessionId: input.sessionId,
		env: input.env
	}) : owner.run(() => {
		forget();
		return input;
	}, key.length * 2)).then((result) => {
		forget();
		pending.resolve(result);
	}, (error) => {
		forget();
		pending.reject(error);
	});
	return receivePage(queued, signal);
}
function captureHistoryRequest(request) {
	if (request.kind !== "rpc" && request.kind !== "rpc-message" && request.kind !== "http") {
		const target = request.params.target;
		const capturedTarget = {
			...target,
			sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0,
			...target.env ? { env: captureSessionTranscriptStorageEnvironment(target.env) } : {}
		};
		const captured = { ...request };
		captured.params = {
			...structuredClone({
				...request.params,
				target: void 0
			}),
			target: capturedTarget
		};
		if (captured.kind === "recent-page") {
			if (captured.params.exactArchivePath) captured.params.exactArchivePath = path.resolve(captured.params.exactArchivePath);
			else delete captured.params.exactArchivePath;
		}
		return captured;
	}
	const entry = request.kind === "http" ? request.params.target.sessionEntry : request.params.entry;
	const cliBinding = getCliSessionBinding(entry, "claude-cli");
	const capturedEntry = entry ? {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		sessionStartedAt: entry.sessionStartedAt,
		...cliBinding ? { cliSessionBindings: { "claude-cli": structuredClone(cliBinding) } } : {}
	} : void 0;
	if (request.kind === "rpc" || request.kind === "rpc-message") {
		const captured = { ...request };
		captured.params = {
			...structuredClone({
				...request.params,
				entry: void 0
			}),
			entry: capturedEntry
		};
		return captured;
	}
	const params = request.params;
	return {
		kind: "http",
		params: {
			target: {
				agentId: params.target.agentId,
				sessionEntry: capturedEntry,
				sessionId: params.target.sessionId,
				sessionKey: params.target.sessionKey,
				storePath: params.target.storePath,
				...params.target.env ? { env: captureSessionTranscriptStorageEnvironment(params.target.env) } : {}
			},
			maxChars: params.maxChars,
			limit: params.limit,
			cursor: params.cursor
		}
	};
}
async function readSessionHistoryPageInWorker(request, signal) {
	signal?.throwIfAborted();
	const capturedRequest = captureHistoryRequest(request);
	const scope = capturedRequest.kind === "rpc" || capturedRequest.kind === "rpc-message" ? {
		agentId: capturedRequest.params.sessionAgentId,
		sessionId: capturedRequest.params.sessionId,
		sessionEntry: capturedRequest.params.entry,
		sessionKey: capturedRequest.params.canonicalKey,
		storePath: capturedRequest.params.storePath
	} : capturedRequest.params.target;
	const env = captureSessionTranscriptStorageEnvironment(scope.env ?? process.env);
	const bound = prepareSessionTranscriptReadTargetCore(scope);
	const capturedScope = {
		...scope,
		agentId: bound.agentId,
		storePath: path.resolve(bound.storePath),
		env
	};
	const stateContext = captureOpenClawStateWorkerContext({ env });
	const cfg = readRuntimeConfig();
	const receipt = resolveSessionTranscriptReadFence({
		agentId: normalizeAgentId(bound.agentId),
		sessionId: scope.sessionId
	});
	const admission = receipt ? { ...receipt } : void 0;
	let inputBytes = JSON.stringify(capturedRequest).length * 2;
	if (pendingHistoryReaders >= 128 || pendingHistoryBytes + inputBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
	pendingHistoryReaders++;
	pendingHistoryBytes += inputBytes;
	try {
		const resolved = await prepareSqliteTranscriptReadScope(capturedScope, signal);
		signal?.throwIfAborted();
		const entryValidationKey = bound.entryValidationScope ? resolveSqliteScope({
			agentId: resolved.agentId,
			sessionKey: bound.entryValidationScope.sessionKey
		}).sessionKey : void 0;
		const sessionKey = entryValidationKey ?? bound.sessionKey;
		const normalizedSessionKey = entryValidationKey ?? resolved.sessionKey;
		const databaseOptions = toDatabaseOptions(resolved);
		const currentSource = {
			agentId: databaseOptions.agentId,
			path: resolveOpenClawAgentSqlitePath(databaseOptions)
		};
		const preparedTarget = resolved;
		const { assertCurrent, result } = await withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
			const sourceReads = capturedRequest.kind === "rpc" || capturedRequest.kind === "rpc-message" || capturedRequest.kind === "http" || capturedRequest.kind === "delta" || capturedRequest.kind === "inline-visibility" ? await prepareGatewaySessionStoreReadSourcesAsync({
				cfg,
				currentSource,
				env,
				registryPath: stateContext.admission.databasePath
			}) : void 0;
			const target = {
				transcript: {
					agentId: preparedTarget.agentId,
					sessionId: preparedTarget.sessionId,
					...normalizedSessionKey ? { sessionKey: normalizedSessionKey } : {},
					storePath: capturedScope.storePath,
					sessionFile: sessionKey ?? preparedTarget.sessionId
				},
				stateDatabase: {
					path: stateContext.admission.databasePath,
					environment: stateContext.environment
				},
				...sourceReads?.request ? { sourceDiscovery: sourceReads.request } : { sourceDatabases: {} },
				...entryValidationKey ? { entryValidationKey } : {}
			};
			const input = {
				kind: "history-page",
				database: currentSource,
				request: capturedRequest,
				target,
				...admission ? { admission } : {}
			};
			const key = JSON.stringify(input);
			const metadataInput = {
				kind: "cold-metadata",
				database: currentSource,
				sessionId: preparedTarget.sessionId,
				env
			};
			const metadataKey = JSON.stringify(metadataInput);
			const additionalBytes = (key.length + metadataKey.length) * 2 - inputBytes;
			if (pendingHistoryBytes + additionalBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
			pendingHistoryBytes += additionalBytes;
			inputBytes += additionalBytes;
			const assertCurrent = () => {
				signal?.throwIfAborted();
				stateContext.maintenanceScope?.assertAdmission();
				stateContext.admission.assertCurrent();
				owner.assertCurrent();
			};
			let result;
			const exactArchiveRead = capturedRequest.kind === "recent-page" && capturedRequest.params.exactArchivePath !== void 0;
			const readOnly = capturedRequest.kind === "recent-usage" || capturedRequest.kind === "history-event-page" || capturedRequest.kind === "active-accounting" || capturedRequest.kind === "bounded-tail" || capturedRequest.kind === "recent-text" ? true : capturedRequest.kind === "artifacts" ? capturedRequest.params.query.kind === "image-page" : exactArchiveRead ? true : capturedRequest.kind === "message-page" || capturedRequest.kind === "around-id" || capturedRequest.kind === "source-messages" || capturedRequest.kind === "recent-page" ? capturedRequest.params.options.readOnly : false;
			let retriedProjection = false;
			const readPage = () => readQueuedHistory(input, key, owner, signal);
			try {
				if (exactArchiveRead) {
					const page = await readPage();
					if (page.kind === "cold-metadata") throw new Error("Session history worker returned cold metadata instead of history");
					result = page;
				} else result = await readRestoredSessionTranscript(capturedScope, async () => {
					let page;
					try {
						page = await readPage();
					} catch (error) {
						if ((capturedRequest.kind === "active-accounting" || capturedRequest.kind === "recent-text" || capturedRequest.kind === "bounded-tail" && !capturedRequest.params.options.readOnly) && isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
							...databaseOptions,
							preferredSessionId: preparedTarget.sessionId
						});
						if (readOnly || retriedProjection || !isSessionTranscriptProjectionUnavailableError(error) || error.reason !== "rebuilding") throw error;
						retriedProjection = true;
						startSessionTranscriptIndexReconcile({
							...databaseOptions,
							preferredSessionId: preparedTarget.sessionId
						});
						const deadline = new AbortController();
						const timer = setTimeout(() => deadline.abort(error), 3e3);
						timer.unref();
						try {
							await waitForSessionTranscriptProjection(capturedScope, signal ? AbortSignal.any([signal, deadline.signal]) : deadline.signal);
						} catch (waitError) {
							if (waitError === error || waitError instanceof Error && waitError.name === "AbortError" && waitError.cause === error) throw error;
							throw waitError;
						} finally {
							clearTimeout(timer);
						}
						page = await readPage();
					}
					if (page.kind === "cold-metadata") throw new Error("Session history worker returned cold metadata instead of history");
					return page;
				}, {
					readOnly,
					assertCurrent,
					coldRead: {
						target: preparedTarget,
						readMetadata: async (phase) => {
							const metadata = phase === "initial" ? await readQueuedHistory(metadataInput, metadataKey, owner, signal) : await owner.readColdMetadata({
								sessionId: metadataInput.sessionId,
								env
							});
							if (metadata.kind !== "cold-metadata") throw new Error("Session history worker returned history instead of cold metadata");
							return metadata.archive;
						}
					}
				});
			} catch (error) {
				if (error instanceof SessionHistoryDeltaPreparationError && capturedRequest.kind === "delta") result = {
					kind: "delta",
					...error.partial
				};
				else throw error;
			}
			return {
				result,
				assertCurrent
			};
		});
		assertCurrent();
		if (result.kind !== capturedRequest.kind) throw new Error("Session history worker returned the wrong page type");
		if (result.kind === "transcript-binding") return result.binding;
		if ("result" in result) return result.result;
		if (result.kind === "delta") return {
			...result,
			assertCurrent
		};
		if (result.kind === "inline-visibility") return {
			subagentCoordination: result.subagentCoordination,
			assertCurrent
		};
		return result.kind === "rpc" ? result.page : result.kind === "http" ? result.snapshot : result.kind === "message-count" ? result.count : result.messages;
	} finally {
		pendingHistoryReaders--;
		pendingHistoryBytes -= inputBytes;
	}
}
//#endregion
export { readSessionHistoryPageInWorker as t };
