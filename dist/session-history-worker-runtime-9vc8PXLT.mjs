import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as waitForSessionTranscriptProjection, r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { t as SessionHistoryDeltaPreparationError } from "./session-history-worker-errors-NH8_8u1W.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-rGbdRuJQ.mjs";
import { t as prepareSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BJshrOZB.mjs";
import { n as prepareGatewaySessionStoreReadSourcesAsync } from "./session-utils-store-sources-BQA0mPmY.mjs";
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
	}, key.length * 2 + (input.kind === "history-page" && input.request.kind === "rpc" ? input.request.params.cliHistoryRedaction?.retainedBytes ?? 0 : 0))).then((result) => {
		forget();
		pending.resolve(result);
	}, (error) => {
		forget();
		pending.reject(error);
	});
	return receivePage(queued, signal);
}
function captureHistoryRequest(request) {
	if (request.kind !== "rpc" && request.kind !== "http") {
		const target = request.params.target;
		const capturedTarget = {
			...target,
			sessionEntry: target.sessionEntry ? { sessionId: target.sessionEntry.sessionId } : void 0,
			...target.env ? { env: captureSessionTranscriptStorageEnvironment(target.env) } : {}
		};
		if (request.kind === "summary") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				query: structuredClone(request.params.query)
			}
		};
		if (request.kind === "artifacts") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				query: structuredClone(request.params.query)
			}
		};
		if (request.kind === "inline-visibility") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				lookup: { ...request.params.lookup }
			}
		};
		const captureOptions = (options) => ({
			target: capturedTarget,
			options: structuredClone(options)
		});
		if (request.kind === "active-accounting") return {
			kind: request.kind,
			params: captureOptions(request.params.options)
		};
		if (request.kind === "bounded-tail") return {
			kind: request.kind,
			params: captureOptions(request.params.options)
		};
		if (request.kind === "message-page") return {
			kind: request.kind,
			params: captureOptions(request.params.options)
		};
		if (request.kind === "around-id") return {
			kind: request.kind,
			params: captureOptions(request.params.options)
		};
		if (request.kind === "source-messages") return {
			kind: request.kind,
			params: captureOptions(request.params.options)
		};
		if (request.kind === "recent-page") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				...request.params.exactArchivePath ? { exactArchivePath: path.resolve(request.params.exactArchivePath) } : {},
				options: structuredClone(request.params.options)
			}
		};
		if (request.kind === "conversation-binding") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				conversationRef: request.params.conversationRef
			}
		};
		if (request.kind === "transcript-binding" || request.kind === "message-count" || request.kind === "reactions") return {
			kind: request.kind,
			params: { target: capturedTarget }
		};
		if (request.kind === "message-by-id") return {
			kind: request.kind,
			params: {
				target: capturedTarget,
				messageId: request.params.messageId,
				options: request.params.options ? { ...request.params.options } : void 0
			}
		};
		if (request.kind === "recent") return {
			kind: "recent",
			params: {
				target: capturedTarget,
				maxMessages: request.params.maxMessages,
				maxLines: request.params.maxLines,
				allowResetArchiveFallback: request.params.allowResetArchiveFallback
			}
		};
		return request.kind === "delta" ? {
			kind: "delta",
			params: {
				target: capturedTarget,
				limits: { ...request.params.limits }
			}
		} : {
			kind: "message-lookup",
			params: {
				target: capturedTarget,
				messageId: request.params.messageId
			}
		};
	}
	const entry = request.kind === "rpc" ? request.params.entry : request.params.target.sessionEntry;
	const cliBinding = getCliSessionBinding(entry, "claude-cli");
	const capturedEntry = entry ? {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		sessionStartedAt: entry.sessionStartedAt,
		...cliBinding ? { cliSessionBindings: { "claude-cli": structuredClone(cliBinding) } } : {}
	} : void 0;
	if (request.kind === "rpc") {
		const params = request.params;
		return {
			kind: "rpc",
			params: {
				encodeResponse: params.encodeResponse,
				compactionMetrics: params.compactionMetrics?.map((metric) => ({ ...metric })),
				entry: capturedEntry,
				provider: params.provider,
				sessionId: params.sessionId,
				storePath: params.storePath,
				sessionAgentId: params.sessionAgentId,
				canonicalKey: params.canonicalKey,
				max: params.max,
				maxHistoryBytes: params.maxHistoryBytes,
				effectiveMaxChars: params.effectiveMaxChars,
				offset: params.offset,
				messageId: params.messageId,
				ignoreCliSessionImports: params.ignoreCliSessionImports,
				cliHistoryHomeDir: params.cliHistoryHomeDir,
				...params.cliHistoryRedaction ? { cliHistoryRedaction: structuredClone(params.cliHistoryRedaction) } : {}
			}
		};
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
	const scope = capturedRequest.kind === "rpc" ? {
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
	const cfg = getRuntimeConfig();
	const receipt = resolveSessionTranscriptReadFence({
		agentId: normalizeAgentId(bound.agentId),
		sessionId: scope.sessionId
	});
	const admission = receipt ? { ...receipt } : void 0;
	const redaction = capturedRequest.kind === "rpc" ? capturedRequest.params.cliHistoryRedaction : void 0;
	const keyedRequest = capturedRequest.kind === "rpc" && redaction ? {
		...capturedRequest,
		params: {
			...capturedRequest.params,
			cliHistoryRedaction: { policyToken: redaction.policyToken }
		}
	} : capturedRequest;
	const redactionBytes = redaction?.retainedBytes ?? 0;
	let inputBytes = JSON.stringify(keyedRequest).length * 2 + redactionBytes;
	if (pendingHistoryReaders >= 128 || pendingHistoryBytes + inputBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
	pendingHistoryReaders++;
	pendingHistoryBytes += inputBytes;
	try {
		const resolved = await prepareSqliteTranscriptReadScope(capturedScope, signal);
		signal?.throwIfAborted();
		stateContext.maintenanceScope?.assertAdmission();
		stateContext.admission.assertCurrent();
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
			const sourceReads = capturedRequest.kind === "rpc" || capturedRequest.kind === "http" || capturedRequest.kind === "delta" || capturedRequest.kind === "inline-visibility" ? await prepareGatewaySessionStoreReadSourcesAsync({
				cfg,
				currentSource,
				env,
				registryPath: stateContext.admission.databasePath
			}, signal) : void 0;
			const primaryPath = sourceReads ? void 0 : createOpenClawAgentDatabasePathMatcher();
			primaryPath?.(currentSource.path, currentSource.path);
			const assertStateCurrent = () => {
				signal?.throwIfAborted();
				stateContext.maintenanceScope?.assertAdmission();
				stateContext.admission.assertCurrent();
				sourceReads?.assertSourceCurrent();
				if (primaryPath && !primaryPath.isCurrent()) throw new Error("Session store changed while preparing its metadata. Retry the request.");
			};
			assertStateCurrent();
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
			const key = JSON.stringify({
				...input,
				request: keyedRequest
			});
			const metadataInput = {
				kind: "cold-metadata",
				database: currentSource,
				sessionId: preparedTarget.sessionId,
				env
			};
			const metadataKey = JSON.stringify(metadataInput);
			const additionalBytes = (key.length + metadataKey.length) * 2 + redactionBytes - inputBytes;
			if (pendingHistoryBytes + additionalBytes > 268435456) throw new WorkerTaskError("worker task capacity reached", "overloaded");
			pendingHistoryBytes += additionalBytes;
			inputBytes += additionalBytes;
			const assertCurrent = () => {
				owner.assertCurrent();
				assertStateCurrent();
			};
			let result;
			const exactArchiveRead = capturedRequest.kind === "recent-page" && capturedRequest.params.exactArchivePath !== void 0;
			const readOnly = capturedRequest.kind === "active-accounting" || capturedRequest.kind === "bounded-tail" ? true : capturedRequest.kind === "artifacts" ? capturedRequest.params.query.kind === "image-page" : exactArchiveRead ? true : capturedRequest.kind === "message-page" || capturedRequest.kind === "around-id" || capturedRequest.kind === "source-messages" || capturedRequest.kind === "recent-page" ? capturedRequest.params.options.readOnly : false;
			let retriedProjection = false;
			const readPage = () => readQueuedHistory(input, `${owner.generation}:${key}`, owner, signal);
			try {
				if (exactArchiveRead) {
					const page = await readPage();
					if (page.kind === "cold-metadata") throw new Error("Session history worker returned cold metadata instead of history");
					result = page;
				} else result = await readRestoredSessionTranscript(capturedScope, async () => {
					assertCurrent();
					let page;
					try {
						page = await readPage();
					} catch (error) {
						if ((capturedRequest.kind === "active-accounting" || capturedRequest.kind === "bounded-tail" && !capturedRequest.params.options.readOnly) && isSessionTranscriptProjectionUnavailableError(error)) {
							assertCurrent();
							startSessionTranscriptIndexReconcile({
								...databaseOptions,
								preferredSessionId: preparedTarget.sessionId
							});
						}
						if (readOnly || retriedProjection || !isSessionTranscriptProjectionUnavailableError(error) || error.reason !== "rebuilding") throw error;
						assertCurrent();
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
							assertCurrent();
							if (waitError === error || waitError instanceof Error && waitError.name === "AbortError" && waitError.cause === error) throw error;
							throw waitError;
						} finally {
							clearTimeout(timer);
						}
						assertCurrent();
						page = await readPage();
					}
					if (page.kind === "cold-metadata") throw new Error("Session history worker returned cold metadata instead of history");
					return page;
				}, {
					readOnly,
					assertCurrent,
					signal,
					coldRead: {
						target: preparedTarget,
						readMetadata: async (phase) => {
							assertCurrent();
							const metadata = phase === "initial" ? await readQueuedHistory(metadataInput, `${owner.generation}:${metadataKey}`, owner, signal) : await owner.readColdMetadata({
								sessionId: metadataInput.sessionId,
								env
							}, signal);
							assertCurrent();
							if (metadata.kind !== "cold-metadata") throw new Error("Session history worker returned history instead of cold metadata");
							return metadata.archive;
						}
					}
				});
			} catch (error) {
				if (error instanceof SessionHistoryDeltaPreparationError && capturedRequest.kind === "delta") {
					owner.assertCurrent();
					result = {
						kind: "delta",
						...error.partial
					};
				} else throw error;
			}
			await sourceReads?.revalidate(() => {
				owner.assertCurrent();
				assertStateCurrent();
			});
			return {
				result,
				assertCurrent: () => {
					owner.assertCurrent();
					assertStateCurrent();
					sourceReads?.assertCurrent();
				}
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
