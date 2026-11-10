import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CSDERtm3.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { c as readSessionTranscriptUpdateVersion, i as onInternalSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import "./io-DIF-KW3P.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import "./version-CwNT1gaY.mjs";
import { t as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { r as readTranscriptMessageIdempotencyKey, t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSessionStoreIdentity, o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { a as hasExplicitAcceptableMediaRange } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { d as sendMethodNotAllowed, g as setSseHeaders, l as sendInvalidRequest, t as SSE_CONTENT_TYPE, u as sendJson } from "./http-common-DyL3AdjD.mjs";
import { c as projectChatDisplayMessagesWithState, n as createCurrentUserProfileMessageProjector, s as projectChatDisplayMessages } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { d as projectForwardedMessages, n as createSubagentCoordinationHistoryProjection, u as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as readSessionHistorySubagentLookup, t as createPreparedSessionHistorySubagentProjection } from "./session-history-delta-visibility-DcmJ_4nD.mjs";
import { o as readChatHistoryMessageSeq, t as buildPaginatedSessionHistory, u as resolveCursorSeq } from "./session-history-tail-C5LEM5f_.mjs";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-tRCRA3R9.mjs";
import { t as createSessionActorTranscriptReader } from "./session-transcript-memory-reader-Bxdst6P1.mjs";
import { _ as session_transcript_readers_exports } from "./session-transcript-readers-ChK_-oGN.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import "./session-utils-CGx9I2of.mjs";
import { o as authorizeScopedGatewayHttpRequestOrReply, s as checkGatewayHttpRequestAuth, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-CjTqkpRo.mjs";
import { t as readSessionHistorySnapshotKernel } from "./session-history-snapshot-D8EZrfUE.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-transcript-path.ts
const transcriptUpdatePaths = /* @__PURE__ */ new WeakMap();
const transcriptUpdateStorePaths = /* @__PURE__ */ new WeakMap();
/** Resolve a transcript file path into a stable comparison key. */
function resolveTranscriptPathForComparison(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return resolveRealpathOrAbsolute(trimmed);
}
/** Share path resolution across a normalized event's synchronous listener fan-out. */
function resolveTranscriptUpdatePathForComparison(update, source = "sessionFile") {
	const paths = source === "storePath" ? transcriptUpdateStorePaths : transcriptUpdatePaths;
	if (paths.has(update)) return paths.get(update);
	const resolved = resolveTranscriptPathForComparison(source === "storePath" ? update.target?.storePath : update.sessionFile);
	paths.set(update, resolved);
	return resolved;
}
//#endregion
//#region src/gateway/session-history-state.ts
async function readSessionHistorySnapshotAsync(params) {
	const memory = captureSessionActorTranscriptRead(params.target);
	if (memory) {
		const snapshot = await readSessionHistorySnapshotKernel(params, {
			readers: createSessionActorTranscriptReader(memory),
			readOnly: true,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName: () => void 0
		});
		const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(snapshot.history.messages);
		const messages = projectForwardedMessages(snapshot.history.messages, resolveCronJobName);
		memory.assertCurrent();
		return {
			...snapshot,
			history: {
				...snapshot.history,
				items: messages,
				messages
			}
		};
	}
	if (!params.target.storePath || params.target.sessionEntry?.incognito || isIncognitoSessionKey(params.target.sessionKey)) {
		const snapshot = await readSessionHistorySnapshotKernel(params, {
			readers: session_transcript_readers_exports,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName: () => void 0
		});
		const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(snapshot.history.messages);
		const messages = projectForwardedMessages(snapshot.history.messages, resolveCronJobName);
		return {
			...snapshot,
			history: {
				...snapshot.history,
				items: messages,
				messages
			}
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	const entry = params.target.sessionEntry;
	const snapshot = await readSessionHistoryPageInWorker({
		kind: "http",
		params: {
			...params,
			target: {
				...params.target,
				sessionEntry: entry ? {
					sessionId: entry.sessionId,
					updatedAt: entry.updatedAt,
					sessionStartedAt: entry.sessionStartedAt
				} : void 0
			}
		}
	});
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(snapshot.history.messages);
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = projectForwardedMessages(snapshot.history.messages, resolveCronJobName).map(project);
	return {
		...snapshot,
		history: {
			...snapshot.history,
			items: messages,
			messages
		}
	};
}
/** Tracks session-history SSE state and decides when inline appends are still valid. */
var SessionHistorySseState = class SessionHistorySseState {
	static fromSnapshot(params) {
		return new SessionHistorySseState(params);
	}
	constructor(params) {
		this.target = params.target;
		this.maxChars = params.maxChars ?? 8e3;
		this.limit = params.limit;
		const snapshot = params.snapshot;
		this.cursor = snapshot.history.windowReset ? void 0 : params.cursor;
		this.sentHistory = snapshot.history;
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = resolveTranscriptPathForComparison(snapshot.transcriptPath);
	}
	snapshot() {
		return this.sentHistory;
	}
	retainRecentMessages(maxMessages) {
		if (this.sentHistory.messages.length <= maxMessages) return this.snapshot();
		const messages = this.sentHistory.messages.slice(-maxMessages);
		const firstSeq = readChatHistoryMessageSeq(messages[0]);
		this.sentHistory = buildPaginatedSessionHistory({
			messages,
			hasMore: true,
			...firstSeq !== void 0 ? { nextCursor: String(firstSeq) } : {}
		});
		return this.snapshot();
	}
	async prepareInlineMessage(update) {
		if (this.limit !== void 0 || this.cursor !== void 0) return () => null;
		const carriedSeq = asPositiveSafeInteger(update.messageSeq);
		if (carriedSeq !== void 0 && carriedSeq <= this.rawTranscriptSeq) return () => ({ shouldRefresh: true });
		const messageSeq = carriedSeq ?? this.rawTranscriptSeq + 1;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(update.message);
		const message = attachOpenClawTranscriptMeta(update.message, {
			...typeof update.messageId === "string" ? { id: update.messageId } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			seq: messageSeq
		});
		const memory = captureSessionActorTranscriptRead(this.target);
		const readers = memory && createSessionActorTranscriptReader(memory);
		let subagentCoordination;
		const lookup = readSessionHistorySubagentLookup(message);
		if (readers && lookup) {
			await readers.prepareVisibility([message]);
			subagentCoordination = readers.subagentCoordination;
		}
		if (lookup && this.target.storePath && !this.target.sessionEntry?.incognito && !isIncognitoSessionKey(this.target.sessionKey)) {
			const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
			const prepared = await readSessionHistoryPageInWorker({
				kind: "inline-visibility",
				params: {
					target: this.target,
					lookup
				}
			});
			subagentCoordination = createPreparedSessionHistorySubagentProjection(prepared.subagentCoordination, prepared.assertCurrent);
		}
		const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver([...this.sentHistory.messages, message]);
		return () => {
			memory?.assertCurrent();
			return this.appendInlineMessage(message, messageSeq, subagentCoordination, resolveCronJobName);
		};
	}
	appendInlineMessage(message, messageSeq, subagentCoordination, resolveCronJobName) {
		subagentCoordination?.assertCurrent?.();
		const hadPendingTurnBoundary = this.turnBoundaryPending;
		const nextMessage = createSubagentCoordinationHistoryProjection(subagentCoordination)([message])[0];
		const nextProjection = projectChatDisplayMessagesWithState([nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			turnBoundaryPending: hadPendingTurnBoundary,
			assistantErrorPending: this.assistantErrorPending,
			resolveCronJobName
		});
		const projectedMessages = projectChatDisplayMessages([...this.sentHistory.messages, nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName
		});
		subagentCoordination?.assertCurrent?.();
		this.rawTranscriptSeq = messageSeq;
		this.turnBoundaryPending = nextProjection.turnBoundaryPending;
		this.assistantErrorPending = nextProjection.assistantErrorPending;
		if (nextProjection.assistantErrorRecoveryObserved) return { shouldRefresh: true };
		const projectedPrefix = projectedMessages.slice(0, this.sentHistory.messages.length);
		if (projectedMessages.length > this.sentHistory.messages.length && isDeepStrictEqual(projectedPrefix, this.sentHistory.messages)) {
			const addedMessages = projectedMessages.slice(this.sentHistory.messages.length);
			if (hadPendingTurnBoundary && !this.turnBoundaryPending) {
				const firstAdded = attachOpenClawTranscriptMeta(addedMessages[0], { turnBoundary: true });
				addedMessages[0] = firstAdded;
				projectedMessages[this.sentHistory.messages.length] = firstAdded;
			}
			if (addedMessages.length === 1) {
				const projectedMessage = expectDefined(addedMessages[0], "projected inline message");
				const emittedMessage = readChatHistoryMessageSeq(projectedMessage) === void 0 ? attachOpenClawTranscriptMeta(projectedMessage, { seq: this.rawTranscriptSeq }) : projectedMessage;
				this.sentHistory = buildPaginatedSessionHistory({
					messages: [...this.sentHistory.messages, emittedMessage],
					hasMore: false
				});
				return {
					message: emittedMessage,
					messageSeq: readChatHistoryMessageSeq(emittedMessage)
				};
			}
		}
		if (nextProjection.messages.length === 0 && isDeepStrictEqual(projectedMessages, this.sentHistory.messages)) return null;
		this.sentHistory = buildPaginatedSessionHistory({
			messages: projectedMessages,
			hasMore: false
		});
		return { shouldRefresh: true };
	}
	shouldRefreshForTranscriptPath(updatePath) {
		const nextPath = resolveTranscriptPathForComparison(updatePath);
		return Boolean(this.transcriptPath && nextPath && this.transcriptPath !== nextPath);
	}
	async refreshAsync() {
		const snapshot = await readSessionHistorySnapshotAsync({
			target: this.target,
			maxChars: this.maxChars,
			limit: this.limit,
			cursor: this.cursor
		});
		if (snapshot.history.windowReset) this.cursor = void 0;
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = resolveTranscriptPathForComparison(snapshot.transcriptPath);
		this.sentHistory = snapshot.history;
		return snapshot.history;
	}
};
//#endregion
//#region src/gateway/sessions-history-http.ts
const log = createSubsystemLogger("gateway/sessions-history-sse");
const MAX_SESSION_HISTORY_LIMIT = 1e3;
function projectHistory(snapshot, presentation) {
	if (!presentation) return snapshot;
	const messages = snapshot.messages.map(presentation.message);
	return {
		...snapshot,
		items: messages,
		messages
	};
}
function resolveSessionHistoryPath(url) {
	const match = url.pathname.match(/^\/sessions\/([^/]+)\/history$/);
	if (!match) return { matched: false };
	try {
		const sessionKey = normalizeOptionalString(decodeURIComponent(match[1] ?? ""));
		return sessionKey ? {
			matched: true,
			sessionKey
		} : {
			error: "invalid-session-key",
			matched: true
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
function resolveLimit(url) {
	const raw = url.searchParams.get("limit");
	if (raw == null) return ok(void 0);
	const trimmed = raw.trim();
	const value = parseStrictPositiveInteger(trimmed);
	if (value !== void 0) return ok(Math.min(MAX_SESSION_HISTORY_LIMIT, value));
	if (/^\d+$/.test(trimmed) && /[1-9]/.test(trimmed)) return ok(MAX_SESSION_HISTORY_LIMIT);
	return err("limit must be a positive integer");
}
function sseWrite(res, event, payload) {
	res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
}
function resolveSessionHistoryHttpClient(requestAuth, scopes) {
	if (!requestAuth.authenticatedUserProfile) return null;
	return {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes
		},
		authenticatedUserProfile: requestAuth.authenticatedUserProfile,
		preparedSessionProfile: requestAuth.preparedSessionProfile,
		internal: { operatorRoleActor: requestAuth.operatorRoleActor }
	};
}
/** Handle `/sessions/:sessionKey/history` JSON/SSE requests. */
async function handleSessionHistoryHttpRequest(req, res, opts) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const sessionKeyResolution = resolveSessionHistoryPath(url);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const canonicalKey = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		operatorMethod: "chat.history"
	});
	if (!authResult) return true;
	const assertResponseCurrent = () => {
		if (res.destroyed || res.writableEnded) throw new Error("Session history response closed");
	};
	const source = captureSessionActorStorageOwner({ sessionKey: canonicalKey }, {
		assertCurrent: assertResponseCurrent,
		authorize: assertResponseCurrent
	});
	const assertSessionCurrent = source?.owner?.captureSessionReadGuard(canonicalKey);
	const assertSourceCurrent = () => {
		source?.authority.assertCurrent();
		assertSessionCurrent?.();
	};
	return serveAuthorizedSessionHistory(req, res, opts, url, source ? canonicalKey : sessionKey, authResult, source, assertSourceCurrent);
}
async function serveAuthorizedSessionHistory(req, res, opts, url, sessionKey, authResult, source, assertSourceCurrent) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { cfg, requestAuth, operatorScopes } = authResult;
		let sharing;
		const sharingLifetime = _usingCtx$1.u({
			transferred: false,
			[Symbol.dispose]() {
				if (!this.transferred) sharing?.release();
			}
		});
		let target;
		let entry;
		try {
			if (source) {
				assertSourceCurrent();
				entry = readCapturedSessionActorEntry(source, sessionKey);
				target = {
					agentId: source.agentId,
					canonicalKey: sessionKey,
					storePath: source.path,
					storeKeys: [sessionKey],
					store: entry ? { [sessionKey]: entry } : {},
					readSource: {
						agentId: source.agentId,
						path: source.path
					}
				};
			} else {
				const { agentId } = resolveSessionStoreIdentity({
					cfg,
					sessionKey
				});
				sharing = await prepareSessionMutationFacts({
					cfg,
					agentId,
					sessionKey,
					allowMissing: true
				});
				const current = sharing.readCurrent(readRuntimeConfig());
				const resolved = current.target;
				entry = resolved?.entry;
				target = {
					...sharing.storageTarget,
					storeKeys: resolved?.storeKeys ?? [sharing.storageTarget.canonicalKey],
					store: entry ? { [resolved.storeKey]: entry } : {},
					readSource: current.sourcePath ? {
						agentId: current.sourceAgentId ?? agentId,
						path: current.sourcePath
					} : void 0
				};
			}
		} catch (error) {
			if (error?.code !== "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") throw error;
			sendJson(res, 409, {
				ok: false,
				error: {
					type: "migration_required",
					message: error instanceof Error ? error.message : String(error)
				}
			});
			return true;
		}
		const sendSessionNotFound = () => sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		const historyClient = resolveSessionHistoryHttpClient(requestAuth, operatorScopes);
		if (!entry?.sessionId || prepareProjectedSessionSharing({
			cfg,
			client: historyClient,
			isMember: () => false
		}).entryFilter?.(target.canonicalKey, entry) === false) {
			sendSessionNotFound();
			return true;
		}
		const limitResult = resolveLimit(url);
		if (!limitResult.ok) {
			sendInvalidRequest(res, limitResult.error);
			return true;
		}
		const limit = limitResult.value;
		const cursor = normalizeOptionalString(url.searchParams.get("cursor"));
		if (cursor !== void 0 && resolveCursorSeq(cursor) === void 0) {
			sendInvalidRequest(res, "cursor must be a positive integer");
			return true;
		}
		const effectiveMaxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
		const historyTarget = {
			agentId: target.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		};
		const streamClosed = createDeferredCore();
		const publishAuthorizedHistory = async (publish) => {
			try {
				const pending = sharing?.prepareRead();
				if (pending) await Promise.race([pending, streamClosed.promise]);
			} catch {
				return false;
			}
			const cfgLocal = readRuntimeConfig();
			const currentRequestAuth = await checkGatewayHttpRequestAuth({
				...opts,
				req,
				auth: opts.getResolvedAuth?.() ?? opts.auth,
				trustedProxies: cfgLocal.gateway?.trustedProxies,
				allowRealIpFallback: cfgLocal.gateway?.allowRealIpFallback,
				cfg: cfgLocal
			});
			if (!currentRequestAuth.ok || !requestAuth.hasCurrentClientAuthority()) return false;
			if (currentRequestAuth.requestAuth.authenticatedUserProfile?.profileId !== requestAuth.authenticatedUserProfile?.profileId) return false;
			const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, currentRequestAuth.requestAuth);
			if (!authorizeOperatorScopesForMethod("chat.history", requestedScopes).allowed) return false;
			const currentClient = resolveSessionHistoryHttpClient(currentRequestAuth.requestAuth, requestedScopes);
			const currentConfig = readRuntimeConfig();
			try {
				assertSourceCurrent();
			} catch {
				return false;
			}
			let currentTarget;
			try {
				if (source) {
					const currentEntry = readCapturedSessionActorEntry(source, sessionKey);
					currentTarget = currentEntry ? {
						agentId: source.agentId,
						canonicalKey: sessionKey,
						storePath: source.path,
						entry: currentEntry
					} : null;
				} else currentTarget = sharing.readCurrent(currentConfig).target;
			} catch {
				return false;
			}
			if (currentTarget === null || currentTarget.agentId !== historyTarget.agentId || currentTarget.canonicalKey !== historyTarget.sessionKey || currentTarget.storePath !== historyTarget.storePath || currentTarget.entry.sessionId !== historyTarget.sessionId || currentTarget.entry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentTarget.entry.sessionStartedAt !== entry.sessionStartedAt || prepareProjectedSessionSharing({
				cfg: currentConfig,
				client: currentClient,
				isMember: () => false
			}).entryFilter?.(currentTarget.canonicalKey, currentTarget.entry) === false) return false;
			publish(prepareOperatorModelPresentation({
				cfg: currentConfig,
				policyConfig: opts.getCommittedRuntimeConfig?.() ?? currentConfig,
				client: currentClient
			}));
			return true;
		};
		const snapshotVersion = readSessionTranscriptUpdateVersion();
		let historySnapshot;
		try {
			historySnapshot = await readSessionHistorySnapshotAsync({
				cursor,
				target: historyTarget,
				limit,
				maxChars: effectiveMaxChars
			});
		} catch (error) {
			const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
			if (unavailableMessage === void 0) throw error;
			res.setHeader("Retry-After", "1");
			sendJson(res, 503, {
				ok: false,
				error: {
					type: "unavailable",
					message: unavailableMessage,
					retryable: true
				}
			});
			return true;
		}
		const stream = hasExplicitAcceptableMediaRange(getHeader(req, "accept"), SSE_CONTENT_TYPE);
		if (!await publishAuthorizedHistory((presentation) => {
			if (!stream) sendJson(res, 200, {
				sessionKey: target.canonicalKey,
				...projectHistory(historySnapshot.history, presentation)
			});
		})) {
			sendSessionNotFound();
			return true;
		}
		if (!stream) return true;
		const historyStorePath = path.resolve(target.storePath);
		const historyLifecycleRevision = normalizeOptionalString(entry.lifecycleRevision);
		const historyDatabasePath = resolveTranscriptPathForComparison(target.readSource?.path);
		const transcriptCandidates = new Set(resolveSessionTranscriptCandidates(historyTarget.sessionId, target.storePath, void 0, target.agentId).map((candidate) => resolveTranscriptPathForComparison(candidate)).filter((candidate) => typeof candidate === "string"));
		const sseState = SessionHistorySseState.fromSnapshot({
			target: historyTarget,
			maxChars: effectiveMaxChars,
			limit,
			cursor,
			snapshot: historySnapshot
		});
		let streamStopped = false;
		let streamQueue = Promise.resolve();
		let pendingRefresh;
		const streamResources = {};
		function writeStreamHistory(snapshot, presentation) {
			sseWrite(res, "history", {
				sessionKey: target.canonicalKey,
				...projectHistory(snapshot, presentation)
			});
			sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
		}
		async function publishStream(publish) {
			if (!await publishAuthorizedHistory((presentation) => {
				if (!isStreamClosed()) publish(presentation);
			})) closeStream();
		}
		function releaseStreamResources() {
			if (streamStopped) return;
			streamStopped = true;
			if (streamResources.heartbeat) clearInterval(streamResources.heartbeat);
			streamResources.unsubscribe?.();
			sharing?.release();
			streamClosed.resolve();
		}
		function closeStream() {
			releaseStreamResources();
			if (!res.writableEnded && !res.destroyed) res.end();
		}
		function handleRequestStreamClose() {
			releaseStreamResources();
			req.off("close", handleRequestStreamClose);
			req.off("error", handleRequestStreamError);
		}
		function handleRequestStreamError(error) {
			log.warn("session history SSE request stream errored; closing stream", { error });
			closeStream();
		}
		function handleResponseStreamFinish() {
			releaseStreamResources();
			res.off("finish", handleResponseStreamFinish);
		}
		function handleResponseStreamClose() {
			releaseStreamResources();
			req.off("close", handleRequestStreamClose);
			req.off("error", handleRequestStreamError);
			res.off("close", handleResponseStreamClose);
			res.off("finish", handleResponseStreamFinish);
			res.off("error", handleResponseStreamError);
		}
		function handleResponseStreamError(error) {
			log.warn("session history SSE response stream errored; cleaning up stream", { error });
			releaseStreamResources();
		}
		const isStreamClosed = () => streamStopped || res.writableEnded || res.destroyed;
		req.on("close", handleRequestStreamClose);
		req.on("error", handleRequestStreamError);
		res.on("close", handleResponseStreamClose);
		res.on("finish", handleResponseStreamFinish);
		res.on("error", handleResponseStreamError);
		if (!await publishAuthorizedHistory(() => {
			setSseHeaders(res);
			res.write("retry: 1000\n\n");
		})) closeStream();
		if (isStreamClosed()) return true;
		const queueStreamWork = (work) => {
			streamQueue = streamQueue.then(() => isStreamClosed() ? void 0 : work()).catch((error) => {
				log.warn("session history SSE stream work failed; closing stream", { error });
				closeStream();
			});
		};
		const queueStreamRefresh = () => {
			if (pendingRefresh) return;
			const refresh = async () => {
				await publishStream(() => {
					if (pendingRefresh === refresh) pendingRefresh = void 0;
				});
				if (!isStreamClosed()) {
					const snapshot = await sseState.refreshAsync();
					await publishStream((presentation) => writeStreamHistory(snapshot, presentation));
				}
			};
			pendingRefresh = refresh;
			queueStreamWork(refresh);
		};
		queueStreamWork(async () => {
			if (snapshotVersion !== readSessionTranscriptUpdateVersion()) await sseState.refreshAsync();
			await publishStream((presentation) => writeStreamHistory(sseState.snapshot(), presentation));
		});
		streamResources.heartbeat = setInterval(() => {
			queueStreamWork(() => publishStream(() => res.write(": keepalive\n\n")));
		}, 15e3);
		streamResources.unsubscribe = onInternalSessionTranscriptUpdate((update) => {
			const updateTarget = update.target;
			const updateMatchesIdentity = updateTarget?.sessionId === historyTarget.sessionId && normalizeAgentId(updateTarget.agentId) === normalizeAgentId(target.agentId) && (updateTarget.sessionKey === historyTarget.sessionKey || resolveSessionStoreKey({
				cfg: readRuntimeConfig(),
				sessionKey: updateTarget.sessionKey,
				storeAgentId: target.agentId
			}) === historyTarget.sessionKey);
			const updateLifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
			if (updateTarget && !updateMatchesIdentity) return;
			const updatePath = resolveTranscriptUpdatePathForComparison(update);
			if (!updateMatchesIdentity && (!updatePath || !transcriptCandidates.has(updatePath))) return;
			if (updateLifecycleRevision !== historyLifecycleRevision || update.message === void 0 || limit !== void 0 || cursor !== void 0) {
				queueStreamRefresh();
				return;
			}
			const updateStorePath = updateTarget?.storePath ? path.resolve(updateTarget.storePath) : void 0;
			const updateMatchesStore = updateStorePath?.endsWith(".sqlite") ? historyDatabasePath !== void 0 && resolveTranscriptUpdatePathForComparison(update, "storePath") === historyDatabasePath : updateStorePath === historyStorePath;
			if (updateTarget?.sessionKey !== historyTarget.sessionKey || !updateMatchesStore) {
				queueStreamRefresh();
				return;
			}
			pendingRefresh = void 0;
			queueStreamWork(async () => {
				let refresh = false;
				const append = sseState.shouldRefreshForTranscriptPath(updatePath) ? void 0 : await sseState.prepareInlineMessage({
					message: update.message,
					messageId: update.messageId,
					messageSeq: update.messageSeq
				});
				await publishStream((presentation) => {
					if (!append) {
						refresh = true;
						return;
					}
					const nextEvent = append();
					refresh = nextEvent?.shouldRefresh === true;
					if (refresh || nextEvent?.message === void 0) return;
					sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
					sseWrite(res, "message", {
						sessionKey: target.canonicalKey,
						message: presentation ? presentation.message(nextEvent.message) : nextEvent.message,
						...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
						messageSeq: nextEvent.messageSeq
					});
				});
				if (refresh && !isStreamClosed()) {
					const snapshot = await sseState.refreshAsync();
					await publishStream((presentation) => writeStreamHistory(snapshot, presentation));
				}
			});
		});
		sharingLifetime.transferred = true;
		if (source) {
			await streamClosed.promise;
			await streamQueue;
		}
		return true;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { handleSessionHistoryHttpRequest };
