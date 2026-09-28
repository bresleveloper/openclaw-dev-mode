import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as resolveDefaultSessionStorePath, l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { A as projectAssistantTranscriptText, j as recordAssistantManagedMediaUrls, k as applyAssistantDeliveryDirectives, o as loadLatestAssistantText } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { i as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER, n as OPENCLAW_DELIVERY_MIRROR_MODEL, r as OPENCLAW_TRANSCRIPT_ARTIFACT_API, s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CVgy4bjA.mjs";
import { i as extractFirstTextBlock, t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { p as persistSessionTranscriptTurn } from "./session-accessor-C05KQ5A3.mjs";
import { s as resolveSessionEntrySelection } from "./session-accessor.entry-BFzDgQIL.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { c as readSessionTranscriptMessageEventPage, n as readLatestSessionTranscriptMessageEvent } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-DotKkoz0.mjs";
import { n as streamSessionTranscriptLinesReverse } from "./transcript-stream-BZUMfFhx.mjs";
import path from "node:path";
//#region src/config/sessions/transcript-assistant-message.ts
function applyBeforeMessageWriteToAssistant(params) {
	const nextMessage = params.beforeMessageWrite ? params.beforeMessageWrite({
		message: params.message,
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey
	}) : params.message;
	if (nextMessage?.role !== "assistant") return;
	return Object.assign(applyAssistantDeliveryDirectives(nextMessage), params.explicitIdempotencyKey ? { idempotencyKey: params.explicitIdempotencyKey } : {});
}
//#endregion
//#region src/config/sessions/transcript-mirror.ts
function stripQuery(value) {
	const noHash = value.split("#")[0] ?? value;
	return noHash.split("?")[0] ?? noHash;
}
function extractFileNameFromMediaUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const cleaned = stripQuery(trimmed);
	try {
		const parsed = new URL(cleaned);
		const base = parsed.protocol === "data:" ? "" : path.basename(parsed.pathname);
		if (!base) return null;
		try {
			return decodeURIComponent(base);
		} catch {
			return base;
		}
	} catch {
		const base = path.basename(cleaned);
		if (!base || base === "/" || base === ".") return null;
		return base;
	}
}
/** Resolves compact text to mirror into session transcripts for text or media messages. */
function resolveMirroredTranscriptText(params) {
	const mediaUrls = params.mediaUrls?.filter((url) => url && url.trim()) ?? [];
	const trimmedText = params.text?.trim() ?? "";
	if (mediaUrls.length > 0) {
		const names = mediaUrls.map((url) => extractFileNameFromMediaUrl(url)).filter((name) => Boolean(name && name.trim()));
		const mediaText = names.length > 0 ? names.join(", ") : "media";
		return trimmedText ? `${trimmedText}\n${mediaText}` : mediaText;
	}
	return trimmedText ? trimmedText : null;
}
//#endregion
//#region src/config/sessions/transcript-recent-window.ts
const normalizeTranscriptTimestamp = asFiniteNumber;
function isWithinTranscriptWindow(timestamp, options) {
	return (options.beforeTimestampMs === void 0 || timestamp === void 0 || timestamp < options.beforeTimestampMs) && (options.minTimestampMs === void 0 || timestamp === void 0 || timestamp >= options.minTimestampMs);
}
function normalizeRecentTranscriptLimit(limit) {
	return Math.max(1, Math.floor(limit ?? 10));
}
function readPreferredUpstreamUserText(message) {
	const meta = message["__openclaw"] && typeof message["__openclaw"] === "object" ? message["__openclaw"] : void 0;
	if (typeof meta?.upstreamUserText === "string") return meta.upstreamUserText.trim();
	return meta?.mirrorOrigin ? null : void 0;
}
//#endregion
//#region src/config/sessions/transcript.ts
var SessionTranscriptAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session transcript agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_TRANSCRIPT_AGENT_SCOPE_MISMATCH";
		this.name = "SessionTranscriptAgentScopeMismatchError";
	}
};
function parseAssistantTranscriptText(line, options) {
	const parsed = JSON.parse(line);
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (options?.excludeTranscriptOnlyOpenClawAssistant && isTranscriptOnlyOpenClawAssistantMessage(message)) return;
	return projectAssistantTranscriptText(message, parsed.id);
}
function extractRecentConversationText(event, options = {}) {
	const parsed = event;
	const message = parsed.message;
	if (!message || message.role !== "user" && message.role !== "assistant" || options.role && message.role !== options.role) return;
	const deliveryMirror = message.openclawDeliveryMirror;
	const includeCronDirectDeliveryContext = options.includeCronDirectDeliveryContext === true && deliveryMirror !== null && typeof deliveryMirror === "object" && !Array.isArray(deliveryMirror) && "kind" in deliveryMirror && deliveryMirror.kind === "cron-direct-delivery-context";
	if (message.role === "assistant" && isTranscriptOnlyOpenClawAssistantMessage(message) && !includeCronDirectDeliveryContext) return;
	const upstreamUserText = options.preferUpstreamUserText && message.role === "user" ? readPreferredUpstreamUserText(message) : void 0;
	if (upstreamUserText === null) return;
	const text = message.role === "assistant" ? extractAssistantPhaseText(message) : upstreamUserText ?? extractFirstTextBlock(message)?.trim();
	if (!text) return;
	const provenance = message.provenance && typeof message.provenance === "object" ? message.provenance : void 0;
	return {
		...typeof parsed.id === "string" && parsed.id ? { id: parsed.id } : {},
		role: message.role,
		text,
		...normalizeTranscriptTimestamp(message.timestamp) !== void 0 ? { timestamp: normalizeTranscriptTimestamp(message.timestamp) } : {},
		...typeof provenance?.sourceChannel === "string" && provenance.sourceChannel.trim() ? { sourceChannel: provenance.sourceChannel.trim() } : {}
	};
}
async function readRecentUserAssistantTextFromSqliteTranscript(scope, options = {}) {
	const limit = normalizeRecentTranscriptLimit(options.limit);
	const pageSize = 250;
	try {
		const readScope = {
			agentId: scope.agentId,
			sessionId: scope.sessionId,
			storePath: scope.storePath
		};
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Ct1oIQGi.mjs");
		return await readRestoredSessionTranscript(readScope, () => {
			const recent = [];
			for (let offset = 0; recent.length < limit; offset += pageSize) {
				const page = readSessionTranscriptMessageEventPage(readScope, {
					maxMessages: pageSize,
					offset
				});
				if (page.events.length === 0) break;
				for (const event of page.events.toReversed()) {
					const entry = extractRecentConversationText(event.event, options);
					if (entry && isWithinTranscriptWindow(entry.timestamp, options)) {
						recent.push(entry);
						if (recent.length >= limit) break;
					}
				}
			}
			return recent.toReversed();
		});
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) return [];
		throw error;
	}
}
function resolveSessionConversationTranscriptTarget(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {};
	const explicitAgentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (explicitAgentId && sessionKeyAgentId && explicitAgentId !== normalizeAgentId(sessionKeyAgentId)) throw new SessionTranscriptAgentScopeMismatchError(explicitAgentId, sessionKeyAgentId);
	const agentId = explicitAgentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const scopedSessionKey = scopeLegacySessionKeyToAgent({
		agentId,
		sessionKey
	}) ?? sessionKey;
	const storePath = params.storePath ?? resolveDefaultSessionStorePath(agentId);
	const entry = loadSessionEntryReadOnly({
		agentId,
		sessionKey: scopedSessionKey,
		storePath
	});
	if (!entry?.sessionId) return {};
	return { sqliteScope: {
		agentId,
		sessionId: entry.sessionId,
		storePath
	} };
}
async function readRecentUserAssistantTextForSession(params) {
	const target = resolveSessionConversationTranscriptTarget(params);
	if (target.sqliteScope) return await readRecentUserAssistantTextFromSqliteTranscript(target.sqliteScope, params);
	return [];
}
async function readLatestAssistantTextFromSessionTranscript(target) {
	const sqliteScope = target && typeof target === "object" ? target : parseSqliteSessionFileMarker(target);
	if (sqliteScope) {
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Ct1oIQGi.mjs");
		return readRestoredSessionTranscript(sqliteScope, () => loadLatestAssistantText(sqliteScope));
	}
	const sessionFile = typeof target === "string" ? target : void 0;
	if (!sessionFile?.trim()) return;
	for await (const line of streamSessionTranscriptLinesReverse(sessionFile)) try {
		const assistantText = parseAssistantTranscriptText(line, { excludeTranscriptOnlyOpenClawAssistant: true });
		if (assistantText) return assistantText;
	} catch {
		continue;
	}
}
async function appendAssistantMessageToSessionTranscript(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {
		ok: false,
		reason: "missing sessionKey"
	};
	const mirrorText = params.content ? null : resolveMirroredTranscriptText({
		text: params.text,
		mediaUrls: params.mediaUrls
	});
	const content = params.content ?? (mirrorText ? [{
		type: "text",
		text: mirrorText
	}] : []);
	const displayContent = params.displayContent?.map((block) => Object.assign({}, block));
	if (content.length === 0 && !displayContent?.length) return {
		ok: false,
		reason: "empty text"
	};
	return appendExactAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey,
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		...params.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: params.expectedLifecycleRevision } : {},
		...params.expectedWriterRunId ? { expectedWriterRunId: params.expectedWriterRunId } : {},
		...params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {},
		...params.sessionLifecyclePatch ? { sessionLifecyclePatch: params.sessionLifecyclePatch } : {},
		storePath: params.storePath,
		...params.eventId ? { eventId: params.eventId } : {},
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.runId ? { runId: params.runId } : {},
		updateMode: params.updateMode,
		onMessageCommitted: params.onMessageCommitted,
		config: params.config,
		...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {},
		message: {
			...recordAssistantManagedMediaUrls({
				role: "assistant",
				openclawDelivery: { mediaUrls: [] }
			}, params.mediaUrls),
			content,
			...displayContent ? { [ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent } : {},
			api: OPENCLAW_TRANSCRIPT_ARTIFACT_API,
			provider: OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER,
			model: OPENCLAW_DELIVERY_MIRROR_MODEL,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now(),
			...params.deliveryMirror ? { openclawDeliveryMirror: params.deliveryMirror } : {}
		}
	});
}
async function appendExactAssistantMessageToSessionTranscript(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {
		ok: false,
		reason: "missing sessionKey"
	};
	if (params.message.role !== "assistant") return {
		ok: false,
		reason: "message role must be assistant"
	};
	const explicitAgentId = params.agentId?.trim() || void 0;
	const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	const transcriptAgentId = explicitAgentId ?? sessionAgentId;
	const configuredDefaultAgentId = !transcriptAgentId && params.config ? resolveDefaultAgentId(params.config) : void 0;
	const storeAgentId = transcriptAgentId ?? resolveAgentIdFromSessionKey(sessionKey, configuredDefaultAgentId);
	const storePath = params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: storeAgentId });
	const resolved = resolveSessionEntrySelection({
		...transcriptAgentId ? { agentId: transcriptAgentId } : {},
		sessionKey,
		storePath
	});
	const entry = resolved.existing;
	if (params.expectedSessionId && entry?.sessionId !== params.expectedSessionId) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (params.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== (params.expectedLifecycleRevision ?? void 0)) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (params.expectedWriterRunId !== void 0 && entry?.activeWriterRunId !== params.expectedWriterRunId) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (!entry?.sessionId) return {
		ok: false,
		reason: `unknown sessionKey: ${sessionKey}`
	};
	const appendToSession = async (currentEntry) => {
		const explicitIdempotencyKey = params.idempotencyKey ?? params.message.idempotencyKey;
		const message = {
			...params.message,
			...explicitIdempotencyKey ? { idempotencyKey: explicitIdempotencyKey } : {}
		};
		const preparedUnkeyedMessage = !explicitIdempotencyKey && params.beforeMessageWrite ? applyBeforeMessageWriteToAssistant({
			message,
			beforeMessageWrite: params.beforeMessageWrite,
			agentId: transcriptAgentId,
			sessionKey: resolved.normalizedKey
		}) : message;
		if (!preparedUnkeyedMessage) return {
			ok: false,
			code: "blocked",
			reason: "blocked by before_message_write"
		};
		const target = {
			...transcriptAgentId ? { agentId: transcriptAgentId } : {},
			sessionId: currentEntry.sessionId,
			sessionKey: resolved.normalizedKey,
			storePath
		};
		if (isRedundantDeliveryMirror(params.message) && !explicitIdempotencyKey) await waitForSessionTranscriptProjection(target);
		let latestEquivalentAssistantId;
		const turn = await persistSessionTranscriptTurn({
			sessionId: currentEntry.sessionId,
			sessionKey: resolved.normalizedKey,
			storePath,
			...transcriptAgentId ? { agentId: transcriptAgentId } : {}
		}, {
			cwd: currentEntry.spawnedCwd,
			...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
			...params.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: params.expectedLifecycleRevision } : {},
			...params.expectedWriterRunId !== void 0 ? { expectedWriterRunId: params.expectedWriterRunId } : {},
			...params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {},
			...params.sessionLifecyclePatch ? { sessionLifecyclePatch: params.sessionLifecyclePatch } : {},
			...params.config ? { config: params.config } : {},
			...params.runId ? { runId: params.runId } : {},
			updateMode: params.updateMode ?? "inline",
			onMessageCommitted: params.onMessageCommitted,
			touchSessionEntry: true,
			messages: [{
				message: preparedUnkeyedMessage,
				...params.eventId ? { eventId: params.eventId } : {},
				...explicitIdempotencyKey ? { idempotencyLookup: "scan" } : {},
				...explicitIdempotencyKey && params.beforeMessageWrite ? { prepareMessageAfterIdempotencyCheck: (candidate) => applyBeforeMessageWriteToAssistant({
					message: candidate,
					beforeMessageWrite: params.beforeMessageWrite,
					explicitIdempotencyKey,
					agentId: transcriptAgentId,
					sessionKey: resolved.normalizedKey
				}) } : {},
				shouldAppend: async (appendTarget) => {
					latestEquivalentAssistantId = isRedundantDeliveryMirror(params.message) && !explicitIdempotencyKey ? await findLatestEquivalentAssistantMessageId(appendTarget, preparedUnkeyedMessage, params.config) : void 0;
					return !latestEquivalentAssistantId;
				}
			}]
		});
		if (turn.rejectedReason === "session-rebound") return {
			ok: false,
			code: "session-rebound",
			reason: `session rebound for sessionKey: ${sessionKey}`
		};
		if (latestEquivalentAssistantId) {
			const anchor = readActiveTranscriptEntryAnchor({
				...target,
				entryId: latestEquivalentAssistantId
			});
			return {
				ok: true,
				target,
				messageId: latestEquivalentAssistantId,
				...anchor ? { anchor } : {}
			};
		}
		const appendedResult = turn.messages[0];
		if (!appendedResult) return {
			ok: false,
			code: "blocked",
			reason: "blocked by before_message_write"
		};
		const { anchor, messageId } = appendedResult;
		if (!params.expectedSessionId) try {
			await touchSqliteAssistantAppendSessionEntry({
				agentId: transcriptAgentId,
				currentEntry,
				sessionKey: resolved.normalizedKey,
				storePath
			});
		} catch (err) {
			return {
				ok: false,
				reason: formatErrorMessage(err)
			};
		}
		return {
			ok: true,
			target,
			messageId,
			...anchor ? { anchor } : {}
		};
	};
	return await appendToSession(entry);
}
async function touchSqliteAssistantAppendSessionEntry(params) {
	const now = Date.now();
	const buildPatch = (entry) => ({
		updatedAt: Math.max(entry?.updatedAt ?? 0, now),
		sessionStartedAt: entry?.sessionStartedAt ?? params.currentEntry.sessionStartedAt ?? now
	});
	await updateSessionEntry({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (entry) => {
		if (entry.sessionId !== params.currentEntry.sessionId) return null;
		return buildPatch(entry);
	});
}
function isRedundantDeliveryMirror(message) {
	return message.provider === "openclaw" && message.model === "delivery-mirror";
}
async function readLatestVisibleTranscriptMessage(scope) {
	try {
		const event = readLatestSessionTranscriptMessageEvent(scope)?.event;
		if (!event || typeof event !== "object" || Array.isArray(event)) return;
		const record = event;
		if (record.message === void 0) return;
		return {
			...typeof record.id === "string" ? { id: record.id } : {},
			message: record.message
		};
	} catch {
		return;
	}
}
function extractAssistantMessageText(message) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return null;
	const parts = message.content.filter((part) => part.type === "text" && typeof part.text === "string" && part.text.trim().length > 0).map((part) => part.text.trim());
	return parts.length > 0 ? parts.join("\n").trim() : null;
}
async function findLatestEquivalentAssistantMessageId(target, message, config) {
	const expectedText = extractAssistantMessageText(redactTranscriptMessage(message, config));
	if (!expectedText) return;
	if (target.storePath && target.sessionId) {
		const latest = await readLatestVisibleTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			sessionId: target.sessionId,
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			storePath: target.storePath
		});
		if ((latest?.message)?.role !== "assistant") return;
		return (latest ? extractAssistantMessageText(redactTranscriptMessage(latest.message, config)) : void 0) === expectedText ? latest?.id : void 0;
	}
}
//#endregion
export { resolveMirroredTranscriptText as a, readRecentUserAssistantTextForSession as i, appendExactAssistantMessageToSessionTranscript as n, readLatestAssistantTextFromSessionTranscript as r, appendAssistantMessageToSessionTranscript as t };
