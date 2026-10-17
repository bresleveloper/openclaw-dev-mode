import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent } from "./session-key-C09ow4h0.mjs";
import { i as resolveDefaultSessionStorePath, l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { i as extractFirstTextBlock, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { i as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER, n as OPENCLAW_DELIVERY_MIRROR_MODEL, r as OPENCLAW_TRANSCRIPT_ARTIFACT_API, s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { h as redactTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { r as projectAssistantTranscriptText } from "./session-accessor.sqlite-transcript-metadata-read-xMOj2X_H.mjs";
import { o as loadLatestAssistantText } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { c as readSessionTranscriptMessageEventPage } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { o as persistSessionTranscriptTurn } from "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-Boy0sn8m.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { n as recordAssistantManagedMediaUrls, t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { n as streamSessionTranscriptLinesReverse } from "./transcript-stream-BZxQozgQ.mjs";
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
function extractFileNameFromMediaUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const cleaned = trimmed.split(/[?#]/u, 1)[0] ?? trimmed;
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
	return trimmedText || null;
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
	const meta = asOptionalObjectRecord(message["__openclaw"]);
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
function parseAssistantTranscriptText(line) {
	const { id, message } = JSON.parse(line);
	if (isTranscriptOnlyOpenClawAssistantMessage(message)) return;
	return projectAssistantTranscriptText(message, id);
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
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Dk13RKwH.mjs");
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
function resolveSessionConversationTranscriptScope(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
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
	if (!entry?.sessionId) return;
	return {
		agentId,
		sessionId: entry.sessionId,
		storePath
	};
}
async function readRecentUserAssistantTextForSession(params) {
	const scope = resolveSessionConversationTranscriptScope(params);
	return scope ? await readRecentUserAssistantTextFromSqliteTranscript(scope, params) : [];
}
async function readLatestAssistantTextFromSessionTranscript(target) {
	const sqliteScope = target && typeof target === "object" ? target : parseSqliteSessionFileMarker(target);
	if (sqliteScope) {
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Dk13RKwH.mjs");
		return readRestoredSessionTranscript(sqliteScope, () => loadLatestAssistantText(sqliteScope));
	}
	const sessionFile = typeof target === "string" ? target : void 0;
	if (!sessionFile?.trim()) return;
	for await (const line of streamSessionTranscriptLinesReverse(sessionFile)) try {
		const assistantText = parseAssistantTranscriptText(line);
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
		...params,
		sessionKey,
		expectedWriterRunId: params.expectedWriterRunId || void 0,
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
			usage: makeZeroUsageSnapshot(),
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
	const resolved = resolveSessionEntry({
		...transcriptAgentId ? { agentId: transcriptAgentId } : {},
		sessionKey,
		storePath
	});
	const entry = resolved.existing;
	if (params.expectedSessionId && entry?.sessionId !== params.expectedSessionId || params.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== (params.expectedLifecycleRevision ?? void 0) || params.expectedWriterRunId !== void 0 && entry?.activeWriterRunId !== params.expectedWriterRunId) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (!entry?.sessionId) return {
		ok: false,
		reason: `unknown sessionKey: ${sessionKey}`
	};
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
		sessionId: entry.sessionId,
		sessionKey: resolved.normalizedKey,
		storePath
	};
	if (isRedundantDeliveryMirror(params.message) && !explicitIdempotencyKey) await waitForSessionTranscriptProjection(target);
	let latestEquivalentAssistantId;
	const turn = await persistSessionTranscriptTurn(target, {
		assertCurrent: params.assertCurrent,
		cwd: entry.spawnedCwd,
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
			...explicitIdempotencyKey && params.beforeMessageWrite ? { workerPreparation: { prepareMessageAfterIdempotencyCheck: (candidate) => applyBeforeMessageWriteToAssistant({
				message: candidate,
				beforeMessageWrite: params.beforeMessageWrite,
				explicitIdempotencyKey,
				agentId: transcriptAgentId,
				sessionKey: resolved.normalizedKey
			}) } } : {},
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
			currentEntry: entry,
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
}
async function touchSqliteAssistantAppendSessionEntry(params) {
	const now = Date.now();
	await updateSessionEntry({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (entry) => {
		if (entry.sessionId !== params.currentEntry.sessionId) return null;
		return {
			updatedAt: Math.max(entry.updatedAt ?? 0, now),
			sessionStartedAt: entry.sessionStartedAt ?? params.currentEntry.sessionStartedAt ?? now
		};
	});
}
function isRedundantDeliveryMirror(message) {
	return message.provider === "openclaw" && message.model === "delivery-mirror";
}
async function readLatestVisibleTranscriptMessage(scope) {
	try {
		const event = (await prepareSessionTranscriptHydration(scope).readLatestActiveMessage())?.event;
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
	if (target.storePath && target.sessionId && target.agentId && target.sessionKey) {
		const latest = await readLatestVisibleTranscriptMessage({
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		});
		if ((latest?.message)?.role !== "assistant") return;
		return (latest ? extractAssistantMessageText(redactTranscriptMessage(latest.message, config)) : void 0) === expectedText ? latest?.id : void 0;
	}
}
//#endregion
export { resolveMirroredTranscriptText as a, readRecentUserAssistantTextForSession as i, appendExactAssistantMessageToSessionTranscript as n, readLatestAssistantTextFromSessionTranscript as r, appendAssistantMessageToSessionTranscript as t };
