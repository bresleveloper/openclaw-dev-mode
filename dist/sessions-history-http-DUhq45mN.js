import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-D5SEXRvS.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-BJ1LyduE.js";
import { n as readRecentSessionMessagesWithStatsAsync, s as readSessionMessagesWithSourceAsync } from "./session-transcript-readers-B1Z-s_uS.js";
import { _ as resolveGatewaySessionStoreTargetWithStore, m as resolveFreshestSessionEntryFromStoreKeys } from "./session-utils-CWlrm3MP.js";
import { a as sendJson, i as sendInvalidRequest, l as setSseHeaders, o as sendMethodNotAllowed } from "./http-common-BrhLjURO.js";
import { f as resolveSharedSecretHttpOperatorScopes, i as checkGatewayHttpRequestAuth, o as getHeader, r as authorizeScopedGatewayHttpRequestOrReply } from "./http-auth-utils-Dtz5EuuO.js";
import "./http-utils-B4rluHM7.js";
import { n as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, t as resolveTranscriptPathForComparison } from "./session-transcript-path-CJD_TxuP.js";
import { n as buildSessionHistorySnapshot, r as resolveSessionHistoryTailReadOptions, t as SessionHistorySseState } from "./session-history-state-CTnQJeqm.js";
//#region src/gateway/sessions-history-http.ts
const log = createSubsystemLogger("gateway/sessions-history-sse");
const MAX_SESSION_HISTORY_LIMIT = 1e3;
function resolveSessionHistoryPath(req) {
	const match = new URL(req.url ?? "/", "http://localhost").pathname.match(/^\/sessions\/([^/]+)\/history$/);
	if (!match) return null;
	try {
		return normalizeOptionalString(decodeURIComponent(match[1] ?? "")) ?? null;
	} catch {
		return "";
	}
}
function shouldStreamSse(req) {
	return normalizeLowercaseStringOrEmpty(getHeader(req, "accept")).includes("text/event-stream");
}
function getRequestUrl(req) {
	return new URL(req.url ?? "/", "http://localhost");
}
function resolveLimit(req) {
	const raw = getRequestUrl(req).searchParams.get("limit");
	if (raw == null || raw.trim() === "") return;
	const trimmed = raw.trim();
	const value = /^\d+$/.test(trimmed) ? Number(trimmed) : NaN;
	if (!Number.isSafeInteger(value) || value < 1) return 1;
	return Math.min(MAX_SESSION_HISTORY_LIMIT, Math.max(1, value));
}
function sseWrite(res, event, payload) {
	res.write(`event: ${event}\n`);
	res.write(`data: ${JSON.stringify(payload)}\n\n`);
}
/** Handle `/sessions/:sessionKey/history` JSON/SSE requests. */
async function handleSessionHistoryHttpRequest(req, res, opts) {
	const sessionKey = resolveSessionHistoryPath(req);
	if (sessionKey === null) return false;
	if (!sessionKey) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		operatorMethod: "chat.history",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg } = authResult;
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: sessionKey
	});
	const entry = resolveFreshestSessionEntryFromStoreKeys(target.store, target.storeKeys);
	if (!entry?.sessionId) {
		sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		return true;
	}
	const limit = resolveLimit(req);
	const cursor = normalizeOptionalString(getRequestUrl(req).searchParams.get("cursor"));
	const effectiveMaxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
	const boundedSnapshot = cursor === void 0 && typeof limit === "number" ? await readRecentSessionMessagesWithStatsAsync({
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	}, {
		...resolveSessionHistoryTailReadOptions(limit),
		allowResetArchiveFallback: true
	}) : void 0;
	const fullSnapshot = boundedSnapshot === void 0 && entry?.sessionId ? await readSessionMessagesWithSourceAsync({
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	}, {
		mode: "full",
		reason: "session history cursor pagination",
		allowResetArchiveFallback: true
	}) : void 0;
	const rawSnapshot = boundedSnapshot?.messages ?? fullSnapshot?.messages ?? [];
	const history = buildSessionHistorySnapshot({
		rawMessages: rawSnapshot,
		maxChars: effectiveMaxChars,
		limit,
		cursor,
		rawTranscriptSeq: boundedSnapshot?.totalMessages,
		totalRawMessages: boundedSnapshot?.totalMessages
	}).history;
	if (!shouldStreamSse(req)) {
		sendJson(res, 200, {
			sessionKey: target.canonicalKey,
			...history
		});
		return true;
	}
	const transcriptCandidates = entry?.sessionId ? new Set(resolveSessionTranscriptCandidates(entry.sessionId, target.storePath, entry.sessionFile, target.agentId).map((candidate) => resolveTranscriptPathForComparison(candidate)).filter((candidate) => typeof candidate === "string")) : /* @__PURE__ */ new Set();
	let sentHistory = history;
	const sseState = SessionHistorySseState.fromRawSnapshot({
		target: {
			agentId: target.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		},
		rawMessages: rawSnapshot,
		rawTranscriptSeq: boundedSnapshot?.totalMessages,
		totalRawMessages: boundedSnapshot?.totalMessages,
		transcriptPath: boundedSnapshot?.transcriptPath ?? fullSnapshot?.transcriptPath,
		maxChars: effectiveMaxChars,
		limit,
		cursor
	});
	sentHistory = sseState.snapshot();
	setSseHeaders(res);
	res.write("retry: 1000\n\n");
	sseWrite(res, "history", {
		sessionKey: target.canonicalKey,
		...sentHistory
	});
	let cleanedUp = false;
	let streamQueue = Promise.resolve();
	const cleanup = () => {
		if (cleanedUp) return;
		cleanedUp = true;
		if (heartbeat) clearInterval(heartbeat);
		if (unsubscribe) unsubscribe();
	};
	const closeStream = () => {
		cleanup();
		if (!res.writableEnded) res.end();
	};
	const queueStreamWork = (work) => {
		streamQueue = streamQueue.then(async () => {
			if (cleanedUp || res.writableEnded) return;
			await work();
		}).catch((error) => {
			log.warn("session history SSE stream work failed; closing stream", { error });
			closeStream();
		});
	};
	const isStreamStillAuthorized = async () => {
		const cfgLocal = getRuntimeConfig();
		const currentRequestAuth = await checkGatewayHttpRequestAuth({
			req,
			auth: opts.getResolvedAuth?.() ?? opts.auth,
			trustedProxies: cfgLocal.gateway?.trustedProxies,
			allowRealIpFallback: cfgLocal.gateway?.allowRealIpFallback,
			rateLimiter: opts.rateLimiter,
			cfg: cfgLocal
		});
		if (!currentRequestAuth.ok) return false;
		return authorizeOperatorScopesForMethod("chat.history", resolveSharedSecretHttpOperatorScopes(req, currentRequestAuth.requestAuth)).allowed;
	};
	const heartbeat = setInterval(() => {
		queueStreamWork(async () => {
			if (!await isStreamStillAuthorized()) {
				closeStream();
				return;
			}
			if (!res.writableEnded) res.write(": keepalive\n\n");
		});
	}, 15e3);
	const unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		if (!entry?.sessionId) return;
		const updateMatchesIdentity = update.target?.sessionId === entry.sessionId && normalizeAgentId(update.target.agentId) === normalizeAgentId(target.agentId);
		const updatePath = resolveTranscriptPathForComparison(update.sessionFile);
		if (!updateMatchesIdentity && (!updatePath || !transcriptCandidates.has(updatePath))) return;
		queueStreamWork(async () => {
			if (res.writableEnded) return;
			if (!await isStreamStillAuthorized()) {
				closeStream();
				return;
			}
			if (update.message !== void 0) {
				if (limit === void 0 && cursor === void 0) {
					if (sseState.shouldRefreshForTranscriptPath(updatePath)) {
						sentHistory = await sseState.refreshAsync();
						sseWrite(res, "history", {
							sessionKey: target.canonicalKey,
							...sentHistory
						});
						return;
					}
					const nextEvent = sseState.appendInlineMessage({
						message: update.message,
						messageId: update.messageId,
						messageSeq: update.messageSeq
					});
					if (!nextEvent) return;
					if (nextEvent.shouldRefresh) {
						sentHistory = await sseState.refreshAsync();
						sseWrite(res, "history", {
							sessionKey: target.canonicalKey,
							...sentHistory
						});
						return;
					}
					if (nextEvent.message === void 0) return;
					sentHistory = sseState.snapshot();
					sseWrite(res, "message", {
						sessionKey: target.canonicalKey,
						message: nextEvent.message,
						...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
						messageSeq: nextEvent.messageSeq
					});
					return;
				}
			}
			sentHistory = await sseState.refreshAsync();
			sseWrite(res, "history", {
				sessionKey: target.canonicalKey,
				...sentHistory
			});
		});
	});
	req.on("close", cleanup);
	res.on("close", cleanup);
	res.on("finish", cleanup);
	return true;
}
//#endregion
export { handleSessionHistoryHttpRequest };
