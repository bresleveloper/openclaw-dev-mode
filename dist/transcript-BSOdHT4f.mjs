import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent } from "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore, r as resolveDefaultSessionStorePath } from "./paths-YgcBNLgG.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage, i as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER, n as OPENCLAW_DELIVERY_MIRROR_MODEL, r as OPENCLAW_TRANSCRIPT_ARTIFACT_API } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as projectAssistantTranscriptText, t as projectAssistantTranscriptMirrorIdentity } from "./transcript-assistant-delivery-read-Bhw3HBCv.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { a as persistSessionTranscriptTurn } from "./session-accessor-Czw4l8kI.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { f as sanitizeTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { n as readRestoredSessionTranscriptInWorker } from "./session-cold-storage-read-DxurMT4l.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { l as updateSessionEntry, r as createSessionEntryWithTranscript } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-OIv_abWd.mjs";
import { t as readActiveTranscriptEntryAnchorAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { n as recordAssistantManagedMediaUrls, t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { n as streamSessionTranscriptLinesReverse } from "./transcript-stream--bqxYj-r.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-transcript-assistant-read.ts
/** Latest assistant is a raw-history query, independent of the active tail's role. */
async function readLatestTranscriptAssistantTextAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) {
			memory.assertCurrent();
			return;
		}
		return memory.read("session.history.latest-assistant", {});
	}
	const receipt = resolveSessionTranscriptReadFence({
		agentId: normalizeAgentId(scope.agentId ?? parseAgentSessionKey(scope.sessionKey)?.agentId ?? scope.defaultAgentId),
		sessionId: scope.sessionId
	});
	const admission = receipt && structuredClone(receipt);
	return withSessionTranscriptReadSource(scope, async (captured) => {
		const { owner, expectedIdentity, assertCurrent } = captured;
		if (!expectedIdentity) return;
		const result = await readRestoredSessionTranscriptInWorker(captured, () => owner.readLatestAssistant({
			scope: captured.scope,
			resolved: captured.resolved,
			expectedIdentity,
			admission
		}));
		assertCurrent();
		return result;
	});
}
//#endregion
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
	const parsed = URL.parse(cleaned);
	if (!parsed) {
		const base = path.basename(cleaned);
		return base && base !== "/" && base !== "." ? base : null;
	}
	const base = parsed.protocol === "data:" ? "" : path.basename(parsed.pathname);
	if (!base) return null;
	try {
		return decodeURIComponent(base);
	} catch {
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
async function readRecentUserAssistantTextFromSqliteTranscript(scope, assertCurrent, options = {}) {
	try {
		const { readRecentSessionConversationTextAsync } = await import("./session-transcript-readers-Cee7Y9gw.mjs");
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-DyO6lnEj.mjs");
		return await readRestoredSessionTranscript(scope, () => readRecentSessionConversationTextAsync(scope, options), { assertCurrent });
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) return [];
		throw error;
	}
}
async function readRecentUserAssistantTextForSession(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return [];
	const explicitAgentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (explicitAgentId && sessionKeyAgentId && explicitAgentId !== normalizeAgentId(sessionKeyAgentId)) throw new SessionTranscriptAgentScopeMismatchError(explicitAgentId, sessionKeyAgentId);
	const agentId = explicitAgentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const scopedSessionKey = scopeLegacySessionKeyToAgent({
		agentId,
		sessionKey
	}) ?? sessionKey;
	const storePath = params.storePath ?? resolveDefaultSessionStorePath(agentId);
	return withSessionEntryReadOnlyInWorker({
		agentId,
		sessionKey: scopedSessionKey,
		storePath
	}, () => {}, async (read, owner) => {
		if (!read.ok) throw read.error;
		if (!read.value?.sessionId) return [];
		const result = await readRecentUserAssistantTextFromSqliteTranscript({
			agentId,
			sessionKey: scopedSessionKey,
			sessionId: read.value.sessionId,
			storePath: owner.source?.path ?? owner.scope?.storePath ?? storePath,
			env: owner.scope?.env
		}, owner.assertCurrent, params);
		owner.assertCurrent();
		return result;
	});
}
async function readLatestAssistantTextFromSessionTranscript(target) {
	const sqliteScope = target && typeof target === "object" ? target : parseSqliteSessionFileMarker(target);
	if (sqliteScope) return readLatestTranscriptAssistantTextAsync(sqliteScope);
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
			model: params.command ? "command" : OPENCLAW_DELIVERY_MIRROR_MODEL,
			usage: makeZeroUsageSnapshot(),
			stopReason: "stop",
			timestamp: Date.now(),
			...!params.command && params.deliveryMirror ? { openclawDeliveryMirror: params.deliveryMirror } : {}
		}
	});
}
async function appendExactAssistantMessageToSessionTranscript(params) {
	const assertCurrent = () => params.assertCurrent?.();
	const authority = {
		assertCurrent,
		authorize: assertCurrent
	};
	if (captureSessionActorStorageOwner(params, authority)) return await withSessionActorStorage(params, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		create: Boolean(params.command)
	}, () => appendExactAssistantMessageWithSource(params)) ?? {
		ok: false,
		...params.expectedSessionId ? { code: "session-rebound" } : {},
		reason: `unknown sessionKey: ${params.sessionKey}`
	};
	return appendExactAssistantMessageWithSource(params);
}
async function appendExactAssistantMessageWithSource(params) {
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
	const memory = getSessionActorStorageBinding(params);
	const storePath = memory?.path ?? params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: storeAgentId });
	const resolved = memory ? {
		existing: memory.actor.storage.readCurrent({
			type: "session.entry.read",
			input: { sessionKey: resolveSqliteSessionKey(sessionKey, memory.agentId) }
		}, memory.authority),
		normalizedKey: resolveSqliteSessionKey(sessionKey, memory.agentId)
	} : await withSessionEntryReadOnlyInWorker({
		...transcriptAgentId ? { agentId: transcriptAgentId } : {},
		sessionKey,
		storePath
	}, () => params.assertCurrent?.(), async (read, owner) => {
		if (!read.ok) throw read.error;
		return {
			existing: read.value,
			normalizedKey: resolveSqliteSessionKey(sessionKey, owner.scope?.agentId ?? storeAgentId)
		};
	});
	const { normalizedKey } = resolved;
	let entry = resolved.existing;
	if (params.expectedSessionId && entry?.sessionId !== params.expectedSessionId || params.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== (params.expectedLifecycleRevision ?? void 0) || params.expectedWriterRunId !== void 0 && entry?.activeWriterRunId !== params.expectedWriterRunId) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (!entry && params.command) {
		const created = await createSessionEntryWithTranscript({
			agentId: storeAgentId,
			sessionKey: resolved.normalizedKey,
			storePath
		}, ({ existingEntry }) => ({
			ok: true,
			entry: existingEntry ?? {
				sessionId: randomUUID(),
				updatedAt: Date.now()
			}
		}), { commitGuard: params.assertCurrent });
		if (!created.ok) return {
			ok: false,
			reason: created.error
		};
		entry = created.entry;
	}
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
		sessionKey: normalizedKey
	}) : message;
	if (!preparedUnkeyedMessage) return {
		ok: false,
		code: "blocked",
		reason: "blocked by before_message_write"
	};
	const target = {
		...transcriptAgentId ? { agentId: transcriptAgentId } : {},
		sessionId: entry.sessionId,
		sessionKey: normalizedKey,
		storePath
	};
	if (isRedundantDeliveryMirror(params.message) && !explicitIdempotencyKey) await waitForSessionTranscriptProjection(target);
	let equivalentAssistant;
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
		messages: [...params.command ? [{
			message: {
				role: "user",
				content: [{
					type: "text",
					text: params.command.text
				}],
				timestamp: Date.now(),
				idempotencyKey: params.command.idempotencyKey
			},
			idempotencyLookup: "scan"
		}] : [], {
			message: preparedUnkeyedMessage,
			...params.eventId ? { eventId: params.eventId } : {},
			...explicitIdempotencyKey ? { idempotencyLookup: "scan" } : {},
			...explicitIdempotencyKey && params.beforeMessageWrite ? { workerPreparation: { prepareMessageAfterIdempotencyCheck: (candidate) => applyBeforeMessageWriteToAssistant({
				message: candidate,
				beforeMessageWrite: params.beforeMessageWrite,
				explicitIdempotencyKey,
				agentId: transcriptAgentId,
				sessionKey: normalizedKey
			}) } } : {},
			shouldAppend: async (appendTarget) => {
				const messageId = isRedundantDeliveryMirror(params.message) && !explicitIdempotencyKey ? await findLatestEquivalentAssistantMessageId(appendTarget, preparedUnkeyedMessage) : void 0;
				equivalentAssistant = messageId ? {
					messageId,
					assertCurrent: captureOwnedTranscriptWriteAssertion(appendTarget)
				} : void 0;
				return !equivalentAssistant;
			}
		}]
	});
	if (turn.rejectedReason === "session-rebound") return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (equivalentAssistant) {
		const anchor = await readActiveTranscriptEntryAnchorAsync({
			...target,
			entryId: equivalentAssistant.messageId
		});
		equivalentAssistant.assertCurrent();
		params.assertCurrent?.();
		return {
			ok: true,
			target,
			messageId: equivalentAssistant.messageId,
			...anchor ? { anchor } : {}
		};
	}
	const appendedResult = turn.messages.find(({ message: persistedMessage }) => typeof persistedMessage === "object" && persistedMessage !== null && "role" in persistedMessage && persistedMessage.role === "assistant");
	if (!appendedResult) return {
		ok: false,
		code: "blocked",
		reason: "blocked by before_message_write"
	};
	const { anchor, messageId } = appendedResult;
	if (!params.expectedSessionId) try {
		const now = Date.now();
		await updateSessionEntry({
			agentId: transcriptAgentId,
			sessionKey: normalizedKey,
			storePath
		}, (current) => current.sessionId !== entry.sessionId ? null : {
			updatedAt: Math.max(current.updatedAt ?? 0, now),
			sessionStartedAt: current.sessionStartedAt ?? entry.sessionStartedAt ?? now
		});
	} catch (err) {
		rethrowIncognitoSessionError(err);
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
	} catch (error) {
		rethrowIncognitoSessionError(error);
		return;
	}
}
async function findLatestEquivalentAssistantMessageId(target, message) {
	const expected = projectAssistantTranscriptMirrorIdentity(sanitizeTranscriptMessage(message));
	if (!expected) return;
	if (target.storePath && target.sessionId && target.agentId && target.sessionKey) {
		const latest = await readLatestVisibleTranscriptMessage({
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		});
		const candidate = latest ? projectAssistantTranscriptMirrorIdentity(sanitizeTranscriptMessage(latest.message)) : void 0;
		return isDeepStrictEqual(candidate, expected) ? latest?.id : void 0;
	}
}
//#endregion
export { resolveMirroredTranscriptText as a, readRecentUserAssistantTextForSession as i, appendExactAssistantMessageToSessionTranscript as n, readLatestTranscriptAssistantTextAsync as o, readLatestAssistantTextFromSessionTranscript as r, appendAssistantMessageToSessionTranscript as t };
