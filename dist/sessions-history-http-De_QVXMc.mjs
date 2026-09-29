import { d as asPositiveSafeInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import "./version-CwNT1gaY.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { o as readSessionTranscriptUpdateVersion, r as onInternalSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { t as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { a as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-_FnqN2Le.mjs";
import { r as readTranscriptMessageIdempotencyKey, t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DDuAGjCc.mjs";
import { p as resolveCurrentUserProfileDisplay } from "./session-identity-projection-Bz5hvxHJ.mjs";
import { E as createSessionListEntryFilter, K as resolveSessionSharingTarget } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { l as session_transcript_readers_exports } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { l as projectForwardedMessages, n as createSubagentCoordinationHistoryProjection } from "./chat-display-projection.history-C3UZzKPr.mjs";
import { a as projectChatDisplayMessages, n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-x-JzVWZh.mjs";
import "./chat-display-projection-BuAz8rxu.mjs";
import { o as authorizeScopedGatewayHttpRequestOrReply, s as checkGatewayHttpRequestAuth, u as resolveSharedSecretHttpOperatorScopes } from "./http-auth-utils-BJQtuB_7.mjs";
import { n as getHeader } from "./http-header-value-Be14tJQx.mjs";
import { c as sendJson, l as sendMethodNotAllowed, m as setSseHeaders, s as sendInvalidRequest, t as SSE_CONTENT_TYPE, x as hasExplicitAcceptableMediaRange } from "./http-common-Ckbyca3h.mjs";
import "./http-utils-BihU3mvk.mjs";
import { i as readChatHistoryMessageSeq } from "./session-history-tail-Ve6Mx3al.mjs";
import { t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-42iWbeS1.mjs";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-ZXvBXZjb.mjs";
import { n as readSessionHistorySnapshotKernel, r as resolveCursorSeq, t as buildPaginatedSessionHistory } from "./session-history-snapshot-CH_na7KX.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
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
	if (!params.target.storePath || params.target.sessionEntry?.incognito || isIncognitoSessionKey(params.target.sessionKey)) {
		const snapshot = await readSessionHistorySnapshotKernel(params, {
			readers: session_transcript_readers_exports,
			resolveCurrentUserProfileDisplay
		});
		const messages = projectForwardedMessages(snapshot.history.messages);
		return {
			...snapshot,
			history: {
				...snapshot.history,
				items: messages,
				messages
			}
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-6ciIMQCz.mjs");
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
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = projectForwardedMessages(snapshot.history.messages).map(project);
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
		this.cursor = params.cursor;
		const snapshot = params.snapshot;
		this.sentHistory = snapshot.history;
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(snapshot.transcriptPath);
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
	appendInlineMessage(update) {
		if (this.limit !== void 0 || this.cursor !== void 0) return null;
		const carriedSeq = asPositiveSafeInteger(update.messageSeq);
		if (carriedSeq !== void 0) {
			if (carriedSeq <= this.rawTranscriptSeq) return { shouldRefresh: true };
			this.rawTranscriptSeq = carriedSeq;
		} else this.rawTranscriptSeq += 1;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(update.message);
		let nextMessage = attachOpenClawTranscriptMeta(update.message, {
			...typeof update.messageId === "string" ? { id: update.messageId } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			seq: this.rawTranscriptSeq
		});
		const hadPendingTurnBoundary = this.turnBoundaryPending;
		const subagentCoordination = this.target.storePath && !this.target.sessionEntry?.incognito && !isIncognitoSessionKey(this.target.sessionKey) ? createSessionHistorySubagentProjection(this.target, { deferSources: true }) : void 0;
		nextMessage = createSubagentCoordinationHistoryProjection(subagentCoordination)([nextMessage])[0];
		const nextProjection = projectChatDisplayMessagesWithState([nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			turnBoundaryPending: hadPendingTurnBoundary,
			assistantErrorPending: this.assistantErrorPending
		});
		this.turnBoundaryPending = nextProjection.turnBoundaryPending;
		this.assistantErrorPending = nextProjection.assistantErrorPending;
		if (nextProjection.assistantErrorRecoveryObserved) return { shouldRefresh: true };
		const projectedMessages = projectChatDisplayMessages([...this.sentHistory.messages, nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			resolveCurrentUserProfileDisplay
		});
		subagentCoordination?.assertCurrent?.();
		const projectedPrefix = projectedMessages.slice(0, this.sentHistory.messages.length);
		if (projectedMessages.length > this.sentHistory.messages.length && !isDeepStrictEqual(projectedPrefix, this.sentHistory.messages)) {
			this.sentHistory = buildPaginatedSessionHistory({
				messages: projectedMessages,
				hasMore: false
			});
			return { shouldRefresh: true };
		}
		if (projectedMessages.length > this.sentHistory.messages.length) {
			const addedMessages = projectedMessages.slice(this.sentHistory.messages.length);
			if (hadPendingTurnBoundary && !this.turnBoundaryPending) {
				const firstAdded = attachOpenClawTranscriptMeta(addedMessages[0], { turnBoundary: true });
				addedMessages[0] = firstAdded;
				projectedMessages[this.sentHistory.messages.length] = firstAdded;
			}
			if (addedMessages.length > 1) {
				this.sentHistory = buildPaginatedSessionHistory({
					messages: projectedMessages,
					hasMore: false
				});
				return { shouldRefresh: true };
			}
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
		if (nextProjection.messages.length === 0 && projectedMessages.length === this.sentHistory.messages.length) return null;
		this.sentHistory = buildPaginatedSessionHistory({
			messages: projectedMessages,
			hasMore: false
		});
		return { shouldRefresh: true };
	}
	shouldRefreshForTranscriptPath(updatePath) {
		const nextPath = normalizeTranscriptPathForComparison(updatePath);
		return Boolean(this.transcriptPath && nextPath && this.transcriptPath !== nextPath);
	}
	async refreshAsync() {
		const snapshot = await readSessionHistorySnapshotAsync({
			target: this.target,
			maxChars: this.maxChars,
			limit: this.limit,
			cursor: this.cursor
		});
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.assistantErrorPending = snapshot.assistantErrorPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(snapshot.transcriptPath);
		this.sentHistory = snapshot.history;
		return snapshot.history;
	}
};
function normalizeTranscriptPathForComparison(filePath) {
	return typeof filePath === "string" ? resolveTranscriptPathForComparison(filePath) : void 0;
}
//#endregion
//#region src/gateway/sessions-history-http.ts
const log = createSubsystemLogger("gateway/sessions-history-sse");
const MAX_SESSION_HISTORY_LIMIT = 1e3;
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
function shouldStreamSse(req) {
	return hasExplicitAcceptableMediaRange(getHeader(req, "accept"), SSE_CONTENT_TYPE);
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
		authenticatedUserProfile: requestAuth.authenticatedUserProfile
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
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		...opts,
		req,
		res,
		operatorMethod: "chat.history",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg, requestAuth, operatorScopes } = authResult;
	let target;
	let entry;
	try {
		target = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: sessionKey,
			exactRead: true,
			readOnly: false
		});
		entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
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
	if (!entry?.sessionId || createSessionListEntryFilter({
		cfg,
		client: historyClient
	})?.(target.canonicalKey, entry) === false) {
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
	const publishAuthorizedHistory = async (publish) => {
		const cfgLocal = getRuntimeConfig();
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
		const currentConfig = getRuntimeConfig();
		const currentTarget = resolveSessionSharingTarget({
			cfg: currentConfig,
			sessionKey: target.canonicalKey,
			agentId: target.agentId
		});
		if (currentTarget === null || currentTarget.agentId !== historyTarget.agentId || currentTarget.canonicalKey !== historyTarget.sessionKey || currentTarget.storePath !== historyTarget.storePath || currentTarget.entry.sessionId !== historyTarget.sessionId || currentTarget.entry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentTarget.entry.sessionStartedAt !== entry.sessionStartedAt || createSessionListEntryFilter({
			cfg: currentConfig,
			client: currentClient
		})?.(currentTarget.canonicalKey, currentTarget.entry) === false) return false;
		publish();
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
	const stream = shouldStreamSse(req);
	if (!await publishAuthorizedHistory(() => {
		if (!stream) sendJson(res, 200, {
			sessionKey: target.canonicalKey,
			...historySnapshot.history
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
	function writeStreamHistory(snapshot) {
		sseWrite(res, "history", {
			sessionKey: target.canonicalKey,
			...snapshot
		});
		sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
	}
	async function publishStream(publish) {
		if (!await publishAuthorizedHistory(() => {
			if (!isStreamClosed()) publish();
		})) closeStream();
	}
	function releaseStreamResources() {
		if (streamStopped) return;
		streamStopped = true;
		if (streamResources.heartbeat) clearInterval(streamResources.heartbeat);
		if (streamResources.unsubscribe) streamResources.unsubscribe();
	}
	function detachStreamListeners() {
		req.off("close", handleRequestStreamClose);
		req.off("error", handleRequestStreamError);
		res.off("close", handleResponseStreamClose);
		res.off("finish", handleResponseStreamFinish);
		res.off("error", handleResponseStreamError);
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
		detachStreamListeners();
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
	setSseHeaders(res);
	res.write("retry: 1000\n\n");
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
				await publishStream(() => writeStreamHistory(snapshot));
			}
		};
		pendingRefresh = refresh;
		queueStreamWork(refresh);
	};
	queueStreamWork(async () => {
		if (snapshotVersion !== readSessionTranscriptUpdateVersion()) await sseState.refreshAsync();
		await publishStream(() => writeStreamHistory(sseState.snapshot()));
	});
	streamResources.heartbeat = setInterval(() => {
		queueStreamWork(() => publishStream(() => res.write(": keepalive\n\n")));
	}, 15e3);
	streamResources.unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const updateTarget = update.target;
		const updateMatchesIdentity = updateTarget?.sessionId === historyTarget.sessionId && normalizeAgentId(updateTarget.agentId) === normalizeAgentId(target.agentId) && (updateTarget.sessionKey === historyTarget.sessionKey || resolveSessionStoreKey({
			cfg: getRuntimeConfig(),
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
			await publishStream(() => {
				refresh = sseState.shouldRefreshForTranscriptPath(updatePath);
				if (refresh) return;
				const nextEvent = sseState.appendInlineMessage({
					message: update.message,
					messageId: update.messageId,
					messageSeq: update.messageSeq
				});
				refresh = nextEvent?.shouldRefresh === true;
				if (refresh || nextEvent?.message === void 0) return;
				sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
				sseWrite(res, "message", {
					sessionKey: target.canonicalKey,
					message: nextEvent.message,
					...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
					messageSeq: nextEvent.messageSeq
				});
			});
			if (refresh && !isStreamClosed()) {
				const snapshot = await sseState.refreshAsync();
				await publishStream(() => writeStreamHistory(snapshot));
			}
		});
	});
	return true;
}
//#endregion
export { handleSessionHistoryHttpRequest };
