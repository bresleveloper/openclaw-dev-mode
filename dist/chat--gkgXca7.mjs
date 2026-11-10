import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { $ as validateChatToolTitlesParams, J as validateChatInjectParams, Ng as errorShape, Y as validateChatMessageGetParams } from "./src-pLJQA6J5.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as CHAT_PENDING_INPUT_MESSAGE_PREFIX } from "./chat-history-constants-BGgHv5E_.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as readSessionPendingInput } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { r as projectOperatorModelRead } from "./operator-model-presentation-C1cUPSmr.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { i as loadIncognitoGatewaySessionEntryReadOnly } from "./session-utils-store-lW7Wu3P0.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { o as projectChatDisplayMessage } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { u as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-DKYX-kD-.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import "./session-utils-CGx9I2of.mjs";
import { t as readChatHistoryMessageById } from "./chat-history-pages-jllvxj-7.mjs";
import { c as resolveGlobalAwareNodeChatDeliveryKeys, l as sendGlobalAwareNodeChatPayload } from "./chat-broadcast-CUWw-44C.mjs";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-BjZUebz7.mjs";
import { t as projectPendingInputMessage } from "./chat-pending-inputs-B_VF-iWj.mjs";
import { r as prepareChatHistorySessionRead, t as chatHistoryHandlers } from "./chat-history-handler-uOAizkJZ.mjs";
//#region src/gateway/server-methods/chat-message-get-handler.ts
const chatMessageGetHandlers = { "chat.message.get": async ({ params, respond, context, client, sessionMutationAuthorization, signal }) => {
	if (!assertValidParams(params, validateChatMessageGetParams, "chat.message.get", respond)) return;
	const { sessionKey, messageId, maxChars, sessionId: requestedSessionId } = params;
	const agentIdOverride = normalizeOptionalString(params.agentId);
	const selection = await prepareChatHistorySessionRead({
		context,
		client,
		respond,
		sessionMutationAuthorization,
		signal,
		method: "chat.message.get",
		sessionKey,
		agentIdOverride,
		requestedSessionId
	});
	if (!selection) return;
	try {
		const { selectedSession, entry, queries, readCurrentSharing, rowProjection } = selection;
		const { cfg, agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
		const sessionId = requestedSessionId ?? entry?.sessionId;
		const historyEntry = requestedSessionId && requestedSessionId !== entry?.sessionId ? void 0 : entry;
		const withCurrentSession = (consume) => withReadySessionRows(rowProjection, queries, (read) => {
			signal?.throwIfAborted();
			return readCurrentSharing(read) ? consume() : void 0;
		});
		const respondNotFound = () => respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		const respondMessage = (message, applyModelPolicy = false) => {
			if (!message) {
				respond(true, {
					ok: false,
					unavailableReason: "not_visible"
				});
				return;
			}
			respond(true, jsonUtf8Bytes(message) > 26213376 ? {
				ok: false,
				unavailableReason: "oversized"
			} : applyModelPolicy ? projectOperatorModelRead({
				context,
				client,
				agentId: sessionAgentId
			}, {
				ok: true,
				message
			}) : {
				ok: true,
				message
			});
		};
		if (!sessionId) {
			await withCurrentSession(respondNotFound);
			return;
		}
		const effectiveMaxChars = maxChars ?? Math.min(26214400, 1e6);
		if (messageId.startsWith("pending:")) {
			if (sessionId !== entry?.sessionId) {
				await withCurrentSession(respondNotFound);
				return;
			}
			const pending = await readSessionPendingInput({
				agentId: sessionAgentId,
				sessionKey: canonicalKey,
				sessionId,
				storePath
			}, messageId.slice(CHAT_PENDING_INPUT_MESSAGE_PREFIX.length));
			if (!await withCurrentSession(() => true)) return;
			if (!pending) {
				await withCurrentSession(respondNotFound);
				return;
			}
			const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver([pending.message], context.cronStorePath);
			await withCurrentSession(() => {
				const message = projectPendingInputMessage(pending, effectiveMaxChars, void 0, resolveCronJobName);
				respondMessage(message);
			});
			return;
		}
		const resolved = await readChatHistoryMessageById({
			entry: historyEntry,
			provider: getCliSessionBinding(historyEntry, "claude-cli")?.sessionId ? resolveSessionModelRef(cfg, historyEntry, sessionAgentId, { allowPluginNormalization: false }).provider : void 0,
			sessionAgentId,
			sessionId,
			canonicalKey,
			storePath,
			messageId,
			max: 1,
			maxHistoryBytes: MAX_PAYLOAD_BYTES,
			effectiveMaxChars,
			offset: void 0
		});
		if (!await withCurrentSession(() => true)) return;
		if (!resolved.found) {
			await withCurrentSession(respondNotFound);
			return;
		}
		if (resolved.oversized) {
			await withCurrentSession(() => respond(true, {
				ok: false,
				unavailableReason: "oversized"
			}));
			return;
		}
		const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver([resolved.message], context.cronStorePath);
		await withCurrentSession(() => {
			const projectedMessage = resolved.message ? projectChatDisplayMessage(resolved.message, {
				includeCommentaryFallbacks: true,
				maxChars: effectiveMaxChars,
				resolveCurrentUserProfileDisplay,
				resolveCronJobName
			}) : void 0;
			const projected = projectedMessage ? augmentChatHistoryWithCanvasBlocks([projectedMessage])[0] : void 0;
			respondMessage(projected, true);
		});
	} finally {
		selection.release();
	}
} };
//#endregion
//#region src/gateway/server-methods/chat.ts
const chatHandlers = {
	...chatHistoryHandlers,
	...chatMessageGetHandlers,
	"chat.toolTitles": async ({ params, respond }) => {
		if (!assertValidParams(params, validateChatToolTitlesParams, "chat.toolTitles", respond)) return;
		respond(true, {
			titles: {},
			disabled: true
		});
	},
	"chat.inject": async (options) => {
		const { params, respond, sessionMutationCommitGuard } = options;
		if (!assertValidParams(params, validateChatInjectParams, "chat.inject", respond)) return;
		if (!isIncognitoSessionKey(params.sessionKey)) return injectChat(options, params);
		const assertCurrent = () => sessionMutationCommitGuard?.();
		const binding = await acquireSessionActorStorage({
			sessionKey: params.sessionKey,
			agentId: normalizeOptionalString(params.agentId)
		}, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: {
				assertCurrent,
				authorize: assertCurrent
			}
		});
		if (!binding) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session not found"));
			return;
		}
		try {
			await runWithSessionActorStorage(binding, () => injectChat(options, params));
		} finally {
			await binding.actor.release();
		}
	}
};
async function injectChat({ respond, context, sessionMutationCommitGuard }, params) {
	const rawSessionKey = params.sessionKey;
	const agentIdOverride = normalizeOptionalString(params.agentId);
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, rawSessionKey, agentIdOverride);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const sessionLoadOptions = { agentId: requestedAgent.agentId };
	let retained;
	const { agentId, storePath, entry, canonicalKey: sessionKey } = isIncognitoSessionKey(rawSessionKey) ? loadIncognitoGatewaySessionEntryReadOnly(rawSessionKey, sessionLoadOptions, cfg) : await loadGatewaySessionEntryReadOnlyInWorker({
		excludeInternalEffects: true,
		cfg,
		key: rawSessionKey,
		...sessionLoadOptions,
		onSelected: (target) => {
			retained?.release();
			const selected = findCanonicalStoreMatch(target.store, target.storeKeys)?.entry;
			if (typeof target.capturedReadSource?.databaseIdentity === "string") retained = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${target.capturedReadSource.databaseIdentity}`,
				sessionKey: target.canonicalKey,
				entry: selected,
				matches: (_before, after) => after?.sessionId === selected?.sessionId
			});
		}
	}).catch((error) => {
		retained?.release();
		throw error;
	});
	const sessionId = entry?.sessionId;
	if (!sessionId || !storePath) {
		retained?.release();
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session not found"));
		return;
	}
	let appended;
	try {
		const admission = await beginSessionWorkAdmission({
			agentId,
			scope: storePath,
			identities: [sessionKey, sessionId],
			assertAllowed: () => {
				const current = retained?.readCurrent();
				if (retained && !current) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
				const latestEntry = isIncognitoSessionKey(sessionKey) ? loadIncognitoGatewaySessionEntryReadOnly(rawSessionKey, sessionLoadOptions).entry : current?.entry ?? entry;
				if (latestEntry?.sessionId !== sessionId) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
				const archivedError = resolveSessionWorkStartError(sessionKey, latestEntry);
				if (archivedError) throw new Error(archivedError);
			}
		});
		try {
			appended = await admission.run(async () => {
				sessionMutationCommitGuard?.();
				return await appendInjectedAssistantMessageToTranscript({
					sessionKey,
					message: params.message,
					label: params.label,
					sessionId,
					storePath,
					agentId,
					config: cfg
				});
			});
		} finally {
			admission.release();
		}
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
		return;
	} finally {
		retained?.release();
	}
	if (!appended.ok || !appended.messageId || !appended.message) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to write transcript: ${appended.error ?? "unknown error"}`));
		return;
	}
	const message = projectChatDisplayMessage(appended.message, { maxChars: resolveEffectiveChatHistoryMaxChars() });
	const chatPayload = {
		runId: `inject-${appended.messageId}`,
		sessionKey,
		...agentId ? { agentId } : {},
		seq: 0,
		state: "final",
		message
	};
	context.broadcast("chat", chatPayload, { sessionKeys: resolveGlobalAwareNodeChatDeliveryKeys({
		cfg,
		sessionKey,
		agentId
	}) });
	sendGlobalAwareNodeChatPayload({
		context,
		sessionKey,
		agentId,
		event: "chat",
		payload: chatPayload
	});
	respond(true, {
		ok: true,
		messageId: appended.messageId
	});
}
//#endregion
export { chatHandlers };
