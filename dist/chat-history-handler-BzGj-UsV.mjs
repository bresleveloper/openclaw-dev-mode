import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { m as scopeLegacySessionKeyToAgent } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-uuHa_36_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { J as validateChatStartupParams, U as validateChatHistoryParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as CHAT_PENDING_INPUT_MESSAGE_PREFIX, t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C-H8nkgi.mjs";
import { i as jsonUtf8BytesOrInfinity } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { a as readResidentUserProfileId } from "./user-profile-list-B5pNqyXa.mjs";
import "./model-catalog-Dt2JkTIv.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { a as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-CVgy4bjA.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-DL7Zd4dS.mjs";
import { _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { Q as listSessionPendingInputs, Z as listSessionPendingInputReceipts } from "./session-accessor-C05KQ5A3.mjs";
import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-Dx_kHnY5.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { E as getSubagentSessionListReadSnapshotIdentity, M as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-read-C2SIiLpb.mjs";
import { S as resolveActiveEmbeddedRunHandleSessionId, w as resolveActiveEmbeddedRunOwner } from "./runs-ciDkXIOQ.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import { d as resolveInFlightRunSnapshot, o as projectInFlightRunSnapshot, r as boundInFlightRunSnapshotForChatHistory } from "./chat-abort-D7PkkSq8.mjs";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { t as capArrayByJsonBytes } from "./session-utils.fs-B4keyzHX.mjs";
import { i as resolveGatewayModelThinkingProfile, t as getSessionDefaults } from "./session-utils-model-CUQjuht1.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import { L as buildGatewaySessionRow, n as withReadySessionRows } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { p as resolveCurrentUserProfileDisplay } from "./session-identity-projection-C0mYume0.mjs";
import { B as hiddenSessionNotFound, J as resolveSessionVisibility, O as prepareSessionSharing, V as isGatewayAdmin } from "./session-sharing-C_5FkkwM.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-COSfbADi.mjs";
import { o as resolveGatewayModelSelectionPolicy } from "./session-utils-list-B6sjm2Lm.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { i as prepareProjectedSessionPresentation } from "./session-list-read-result-BWd6LrJ1.mjs";
import "./session-utils-AxixtEyo.mjs";
import { i as readTranscriptDisplayDelta } from "./session-accessor.sqlite-history-events-CxKlqhz3.mjs";
import "./session-transcript-readers-nuptsJ6Q.mjs";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-DJmgjmUx.mjs";
import { a as isAssistantTtsSupplementMessage } from "./chat-display-projection.history-C3UZzKPr.mjs";
import { i as projectChatDisplayMessage, n as createCurrentUserProfileMessageProjector } from "./chat-display-projection.core-DpiCCyQ3.mjs";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-BJipDW7F.mjs";
import "./chat-display-projection-ON0OJ8aM.mjs";
import { l as resolveClaudeCliBindingSessionId } from "./cli-session-history.claude-C9GYS4Xs.mjs";
import "./cli-session-history-Cq_N2mFT.mjs";
import { a as createChatHistoryByteCounter, c as trimChatHistoryActivity, i as createChatHistoryActivityProjection, n as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, o as replaceOversizedChatHistoryMessages, r as chatHistoryActivityBytes, s as reportOmittedChatHistory, t as readChatHistoryPage } from "./chat-history-pages-DoKZ7dH4.mjs";
import { i as resolveChatHistoryNextOffset, n as enrichChatHistoryCompactionMarkers, t as capChatHistoryAroundMessage } from "./chat-history-page-kernel-Bbl6Za4F.mjs";
import { t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-CPYJxN1U.mjs";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-DJ3ic_1f.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-BTtvEIz2.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.mjs";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-ZXvBXZjb.mjs";
import { a as prepareSessionWorkspaceIcon } from "./workspace-icon-http-CNY18jfC.mjs";
import { n as isAppendOnlySessionHistoryDelta, t as createPreparedSessionHistorySubagentProjection } from "./session-history-delta-visibility-BV55xCVU.mjs";
import { t as projectSessionMessagePayload } from "./session-transcript-message-C5G8VRkZ.mjs";
import { t as handleChatMetadataRequest } from "./chat-metadata-handler-BfjnmwqY.mjs";
//#region src/gateway/server-methods/chat-history-delta.ts
const CHAT_HISTORY_DELTA_MAX_EVENTS = 200;
const CHAT_HISTORY_DELTA_MAX_BYTES = 1e6;
async function readChatHistoryDelta(params, signal) {
	signal?.throwIfAborted();
	if (params.incognito || isIncognitoSessionKey(params.sessionKey)) return readRestoredSessionTranscript(params.scope, () => readLocalChatHistoryDelta(params));
	const target = {
		...params.scope,
		sessionEntry: params.scope.sessionEntry ? { sessionId: params.scope.sessionEntry.sessionId } : void 0
	};
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-CJUmmPMK.mjs");
	const result = await readSessionHistoryPageInWorker({
		kind: "delta",
		params: {
			target,
			limits: {
				cursor: params.cursor,
				maxBytes: Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES),
				maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
			}
		}
	}, signal);
	return projectChatHistoryDelta(params, result.delta, createPreparedSessionHistorySubagentProjection(result.subagentCoordination, result.assertCurrent));
}
function readLocalChatHistoryDelta(params) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	const result = readTranscriptDisplayDelta(params.scope, {
		cursor: params.cursor,
		maxBytes,
		maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
	});
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	return projectChatHistoryDelta(params, result, createSessionHistorySubagentProjection(params.scope));
}
function projectChatHistoryDelta(params, result, subagentCoordination) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	subagentCoordination.assertCurrent?.();
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	let projectionState = {
		assistantErrorPending: false,
		turnBoundaryPending: false
	};
	const projectCurrentUserProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = [];
	const activityMessages = [];
	let messagesBytes = 2;
	for (const row of result.events) {
		if (row.messageSeq === void 0) continue;
		const entryMessage = projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition);
		if (!entryMessage) continue;
		if (isOpenClawDeliveryMirrorAssistantMessage(entryMessage) && asOptionalRecord(asOptionalRecord(entryMessage)?.openclawDeliveryMirror)?.kind === "channel-final") return { kind: "reset" };
		if (isAssistantTtsSupplementMessage(entryMessage)) return { kind: "reset" };
		const messageId = asOptionalRecord(row.event)?.id;
		const projected = projectSessionMessagePayload({
			agentId: params.agentId,
			historyDelta: true,
			message: entryMessage,
			...typeof messageId === "string" && messageId ? { messageId } : {},
			messageSeq: row.messageSeq,
			transcriptPosition: row.displayPosition,
			projectionState,
			projectCurrentUserProfile,
			subagentCoordination,
			sessionKey: params.sessionKey,
			sessionSnapshot: params.sessionSnapshot
		});
		if (projected.requiresHistoryReset) return { kind: "reset" };
		projectionState = projected.projectionState;
		if (projectionState.assistantErrorPending) return { kind: "reset" };
		if (projected.payload) {
			messagesBytes += jsonUtf8BytesOrInfinity(projected.payload) + (messages.length > 0 ? 1 : 0);
			if (messagesBytes > maxBytes) return { kind: "reset" };
			messages.push(projected.payload);
			if (typeof messageId === "string") activityMessages.push({
				messageId,
				message: entryMessage
			});
		}
	}
	subagentCoordination.assertCurrent?.();
	const activity = [...createChatHistoryActivityProjection(messages.map((envelope) => envelope.message), projectAgentHistoryActivity(activityMessages)).values()];
	const activityBytes = chatHistoryActivityBytes(activity);
	if (messagesBytes + activityBytes > maxBytes) return { kind: "reset" };
	return {
		activeLeafEntryId: result.activeLeafEntryId,
		deltaCursor: result.cursor,
		kind: "delta",
		activity,
		messages: composeTranscriptDisplay(messages, (envelope) => envelope.message),
		messagesBytes,
		activityBytes
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-recovery.ts
function resolveEmbeddedAgentRunRecoverySnapshot(params) {
	const sessionId = params.sessionId ?? resolveActiveEmbeddedRunHandleSessionId(params.canonicalSessionKey) ?? resolveActiveEmbeddedRunHandleSessionId(params.requestedSessionKey);
	if (!sessionId) return;
	const owner = resolveActiveEmbeddedRunOwner(sessionId);
	if (!owner) return;
	return projectInFlightRunSnapshot({
		chatRunState: params.chatRunState,
		runId: owner.runId,
		startedAtMs: owner.startedAtMs,
		sessionAbortable: true
	});
}
function respondChatHistoryUnavailable(method, respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, {
		details: { method },
		retryable: true,
		retryAfterMs: 250
	}));
}
//#endregion
//#region src/gateway/server-methods/chat-pending-inputs.ts
const PENDING_INPUT_DISPLAY_MAX_BYTES = 131072;
const PENDING_INPUT_CORRELATION_MAX_CHARS = 256;
function projectPendingInputMessage(input, maxChars, projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay)) {
	const projected = projectChatDisplayMessage(input.message, { maxChars });
	const message = projected ? projectProfile(projected) : void 0;
	if (!message) return;
	const metadata = { ...asOptionalRecord(message["__openclaw"]) };
	delete metadata.idempotencyKey;
	delete metadata.runId;
	return {
		...message,
		timestamp: input.acceptedAt,
		idempotencyKey: void 0,
		__openclaw: {
			...metadata,
			id: `${CHAT_PENDING_INPUT_MESSAGE_PREFIX}${input.id}`
		}
	};
}
function readChatPendingInputs(scope, options) {
	const page = listSessionPendingInputs(scope, {
		before: options.before,
		limit: Math.min(options.limit, 20)
	});
	const projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const visible = page.items.flatMap((input) => {
		const message = projectPendingInputMessage(input, options.maxChars, projectProfile);
		return message ? [{
			input,
			message
		}] : [];
	});
	const messages = replaceOversizedChatHistoryMessages({
		messages: visible.map(({ message }) => message),
		maxSingleMessageBytes: Math.floor(PENDING_INPUT_DISPLAY_MAX_BYTES / Math.max(page.items.length, 1))
	}).messages;
	return {
		...page,
		items: visible.map(({ input: item }, index) => {
			const display = {
				id: item.id,
				acceptedAt: item.acceptedAt,
				state: item.state,
				message: messages[index]
			};
			if (item.runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS) display.runId = item.runId;
			return display;
		})
	};
}
//#endregion
//#region src/gateway/server-methods/chat-startup-handler.ts
async function handleChatStartupRequest(opts, handleHistory, respondUnavailable) {
	if (!assertValidParams(opts.params, validateChatStartupParams, "chat.startup", opts.respond)) return;
	if ("sessionKey" in opts.params) {
		await handleHistory({
			...opts,
			method: "chat.startup"
		});
		return;
	}
	const connId = opts.client?.connId?.trim();
	if (connId) {
		opts.context.subscribeSessionEvents(connId);
		if (!opts.context.getSessionEventSubscriberConnIds().has(connId)) {
			opts.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "connection closed before chat startup"));
			return;
		}
	}
	const { shortId, slugHint, agentId, limit, maxBytes } = opts.params;
	const projection = getSessionRowProjection(opts.context);
	if (!projection) {
		respondUnavailable("chat.startup", opts.respond, "session rows are initializing; reload the conversation");
		return;
	}
	const resolution = resolveSessionKeyFromResolveParams({
		projection,
		client: opts.client,
		p: {
			shortId,
			slugHint,
			agentId,
			allowMissing: true
		}
	});
	if (!resolution.ok) {
		opts.respond(false, void 0, resolution.error);
		return;
	}
	if ("missing" in resolution || "ambiguous" in resolution) {
		opts.respond(true, { resolution: {
			ok: false,
			..."ambiguous" in resolution ? { candidates: resolution.candidates } : {}
		} });
		return;
	}
	await handleHistory({
		...opts,
		params: {
			sessionKey: resolution.key,
			agentId: resolution.agentId,
			limit,
			maxBytes
		},
		method: "chat.startup",
		respond: (ok, payload, error, meta) => opts.respond(ok, ok ? {
			...asOptionalRecord(payload),
			resolution
		} : payload, error, meta)
	});
}
//#endregion
//#region src/gateway/server-methods/chat-startup-requester.ts
/** Bind the requester to its source, then resolve merges when metadata is assembled. */
async function prepareChatStartupRequester(client) {
	let profileId = client?.authenticatedUserProfile?.profileId;
	const attachedProfileId = profileId;
	if (!profileId && (!client?.authenticatedUserId || client.authenticatedGitHubIdentitySync || client.authenticatedUserIsTailscaleProvider)) return () => void 0;
	const context = captureOpenClawStateWorkerContext();
	const options = { path: context.admission.databasePath };
	const email = client?.authenticatedUserId;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (attachedProfileId ? client?.authenticatedUserProfile?.profileId !== attachedProfileId : client?.authenticatedUserProfile?.profileId || client?.authenticatedUserId !== email || client?.authenticatedGitHubIdentitySync || client?.authenticatedUserIsTailscaleProvider) throw new Error("Startup requester changed during metadata preparation");
	};
	if (!profileId && email) {
		const { ensureProfileIdForEmail } = await import("./user-profile-email-CrrZSUBG.mjs");
		profileId = await ensureProfileIdForEmail(email, options, assertCurrent);
	}
	return () => {
		assertCurrent();
		return profileId ? readResidentUserProfileId(profileId, options) : void 0;
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-handler.ts
async function handleChatHistoryRequest({ params, respond, client, context, method, signal, retainedSessionId }) {
	if (!assertValidParams(params, validateChatHistoryParams, method, respond)) return;
	const { sessionKey, limit, offset, cursor, messageId, sessionId: wireSessionId, maxChars, maxBytes, pendingBefore, inputRunIds } = params;
	const requestedSessionId = retainedSessionId ?? wireSessionId;
	if (offset !== void 0 && messageId !== void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "offset and messageId cannot be used together"));
		return;
	}
	if (cursor !== void 0 && (offset !== void 0 || messageId !== void 0)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cursor cannot be used with offset or messageId"));
		return;
	}
	if (wireSessionId !== void 0 && messageId === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId requires messageId"));
		return;
	}
	if (!getSubagentSessionListReadSnapshotIdentity()) await prepareOptionalSubagentSessionListReadCache();
	signal?.throwIfAborted();
	const requestConfig = context.getRuntimeConfig();
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
	const requestedAgent = resolveRequestedSessionAgentId(requestConfig, sessionKey, agentIdOverride);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const selectedSession = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_entry`, () => loadGatewaySessionEntryReadOnly(sessionKey, {
		agentId: requestedAgent.agentId,
		clone: false,
		includeStoreChildEntries: true,
		projection: "list"
	}, requestConfig), {
		config: requestConfig,
		phase: method
	});
	const { cfg, agentId: sessionAgentId, storePath, entry, canonicalKey, legacyKey } = selectedSession;
	const authorizeSharing = (current) => {
		const sharing = prepareSessionSharing({
			client,
			cfg: current.cfg
		});
		if (current.entry ? sharing.entryFilter?.(current.legacyKey ?? current.canonicalKey, current.entry) === false : requestedSessionId && !retainedSessionId && !isGatewayAdmin(client)) {
			respond(false, void 0, hiddenSessionNotFound(canonicalKey));
			return;
		}
		return sharing;
	};
	if (!authorizeSharing(selectedSession)) return;
	const readCurrentSharing = () => {
		const current = entry ? loadGatewaySessionEntryReadOnly(sessionKey, {
			agentId: sessionAgentId,
			clone: false,
			projection: "list"
		}) : selectedSession;
		const currentEntry = current.entry;
		if (entry && (!currentEntry || current.agentId !== sessionAgentId || current.canonicalKey !== canonicalKey || current.legacyKey !== legacyKey || current.storePath !== storePath || !retainedSessionId && (currentEntry.sessionId !== entry.sessionId || currentEntry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentEntry.sessionStartedAt !== entry.sessionStartedAt))) {
			respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
			return;
		}
		const sharing = authorizeSharing(current);
		if (!sharing) return;
		return currentEntry ? {
			visibility: resolveSessionVisibility(currentEntry),
			sharingRole: sharing.roleForTarget({
				...current,
				entry: currentEntry,
				storeKey: current.legacyKey ?? current.canonicalKey
			})
		} : {};
	};
	if (requestedSessionId) {
		const transcriptSessionKey = resolveSessionKeyBySessionId({
			agentId: sessionAgentId,
			sessionId: requestedSessionId,
			storePath
		});
		if (!transcriptSessionKey || scopeLegacySessionKeyToAgent({
			sessionKey: transcriptSessionKey,
			agentId: sessionAgentId
		}) !== scopeLegacySessionKeyToAgent({
			sessionKey: canonicalKey,
			agentId: sessionAgentId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId does not belong to sessionKey"));
			return;
		}
	}
	if (method === "chat.startup") prepareSessionWorkspaceIcon({
		sessionKey,
		agentId: sessionAgentId
	}).catch((error) => {
		context.logGateway.debug(`chat.startup continuing without a workspace icon: ${formatErrorMessage(error)}`);
	});
	const readStartupProjection = () => measureDiagnosticsTimelineSpan(`gateway.${method}.startup_projection`, async () => {
		try {
			return await context.readChatStartupProjection?.({
				agentId: sessionAgentId,
				sessionKey: canonicalKey,
				sessionEntry: entry,
				...method === "chat.startup" ? { readRequesterProfileId: await prepareChatStartupRequester(client) } : {},
				readPolicy: method === "chat.history" ? "ready" : "current"
			});
		} catch (error) {
			context.logGateway.debug(`${method} continuing without prepared startup projection: ${formatErrorMessage(error)}`);
			return;
		}
	}, {
		config: cfg,
		phase: method,
		attributes: { agentId: sessionAgentId }
	});
	const startupProjectionPromise = entry?.authProfileOverride?.trim() ? readStartupProjection() : void 0;
	const sessionId = requestedSessionId ?? entry?.sessionId;
	const historyEntry = requestedSessionId && requestedSessionId !== entry?.sessionId ? void 0 : entry;
	const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId, { allowPluginNormalization: false });
	const max = Math.min(CHAT_HISTORY_MAX_ENTRIES, typeof limit === "number" ? limit : 200);
	const maxHistoryBytes = Math.min(maxBytes ?? Infinity, getMaxChatHistoryMessagesBytes());
	const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(maxChars);
	const pendingInputs = sessionId && sessionId === entry?.sessionId ? readChatPendingInputs({
		agentId: sessionAgentId,
		sessionKey: canonicalKey,
		sessionId,
		storePath
	}, {
		before: pendingBefore,
		limit: max,
		maxChars: effectiveMaxChars
	}) : {
		items: [],
		total: 0
	};
	const inputReceipts = inputRunIds ? !messageId && sessionId && sessionId === entry?.sessionId ? listSessionPendingInputReceipts({
		agentId: sessionAgentId,
		sessionKey: canonicalKey,
		sessionId,
		storePath
	}, { runIds: inputRunIds }) : [] : void 0;
	const inputConsumptions = inputReceipts?.flatMap((receipt) => receipt.state === "consumed" ? [{
		runId: receipt.runId,
		consumedByEventId: receipt.consumedByEventId
	}] : []);
	let historyPage;
	try {
		historyPage = cursor ? { messages: [] } : await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
			entry: historyEntry,
			provider: resolvedSessionModel.provider,
			sessionId,
			storePath,
			sessionAgentId,
			canonicalKey,
			max,
			maxHistoryBytes,
			effectiveMaxChars,
			offset,
			messageId
		}, signal), {
			config: cfg,
			phase: method,
			attributes: {
				limit: max,
				hasMessageId: Boolean(messageId),
				hasOffset: offset !== void 0
			}
		});
	} catch (error) {
		const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
		if (unavailableMessage === void 0) throw error;
		respondChatHistoryUnavailable(method, respond, unavailableMessage);
		return;
	}
	const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry);
	const responseHistoryBytes = historyPage.completeCliImport ? getMaxChatHistoryMessagesBytes() : maxHistoryBytes;
	const activity = createChatHistoryActivityProjection(normalized, historyPage.activity);
	const byteCounter = createChatHistoryByteCounter(activity);
	const replaced = replaceOversizedChatHistoryMessages({
		byteCounter,
		messages: normalized,
		maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, getMaxChatHistoryMessagesBytes())
	});
	const prioritized = historyPage.completeCliImport && !messageId ? trimChatHistoryActivity({
		messages: replaced.messages,
		maxBytes: responseHistoryBytes,
		byteCounter
	}) : replaced.messages;
	const capped = messageId ? capChatHistoryAroundMessage({
		messages: prioritized,
		messageId,
		maxCost: responseHistoryBytes - 1 - byteCounter.framingBytes(prioritized),
		messageCost: (message) => byteCounter.messageBytes(message) + 1
	}) : capArrayByJsonBytes(prioritized, responseHistoryBytes - byteCounter.framingBytes(prioritized), byteCounter.messageBytes).items;
	const historyBudgetPreserved = replaced.replacedCount === 0 && capped.length === normalized.length && capped.every((message, index) => message === normalized[index]);
	const pagination = historyPage.pagination;
	const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
		messages: capped,
		totalMessages: pagination.totalMessages,
		offset: pagination.offset,
		rawPageMessages: pagination.rawPageMessages,
		projected: normalized
	});
	const hasMore = pagination !== void 0 && candidateNextOffset !== void 0 ? pagination.exhausted !== true && candidateNextOffset < pagination.totalMessages : void 0;
	reportOmittedChatHistory({
		originalMessages: normalized,
		finalMessages: capped,
		getNormalizedBytes: () => byteCounter.messagesBytes(normalized),
		maxHistoryBytes: responseHistoryBytes,
		logDebug: (message) => context.logGateway.debug(message)
	});
	const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	const startupProjection = await (startupProjectionPromise ?? readStartupProjection());
	const startupMetadata = method === "chat.startup" ? startupProjection?.metadata : void 0;
	const { sessionModelCatalog, defaultModelCatalog } = startupProjection ?? {};
	const rowProjection = getSessionRowProjection(context);
	if (!rowProjection) {
		respondChatHistoryUnavailable(method, respond, "session rows are initializing; reload the conversation");
		return;
	}
	const query = {
		key: canonicalKey,
		agentId: sessionAgentId,
		storePath: selectedSession.readSource?.path ?? storePath
	};
	await (await withReadySessionRows(rowProjection, () => [query], (read) => {
		const currentSharing = readCurrentSharing();
		if (!currentSharing) return;
		const sessionInfo = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_info`, () => prepareProjectedSessionPresentation(read, client).snapshot(query).row ?? (entry ? void 0 : buildGatewaySessionRow({
			...selectedSession,
			key: canonicalKey,
			modelCatalog: sessionModelCatalog,
			rowContext: rowProjection.state.rowContext
		})), {
			config: cfg,
			phase: method
		});
		if (entry && !sessionInfo) {
			respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
			return;
		}
		if (sessionInfo) Object.assign(sessionInfo, currentSharing);
		const activeRunState = resolveVisibleActiveSessionRunState({
			context,
			requestedKey: sessionKey,
			canonicalKey,
			sessionId,
			...sessionAgentId ? { agentId: sessionAgentId } : {},
			defaultAgentId: compatibilityOwnerAgentId,
			includeTerminalPersistence: true
		});
		if (sessionInfo) sessionInfo.hasActiveRun = activeRunState.active;
		if (sessionInfo && activeRunState.runIds !== void 0) sessionInfo.activeRunIds = activeRunState.runIds;
		if (sessionInfo && activeRunState.active) sessionInfo.status = activeRunState.status ?? "running";
		const embeddedRecovery = resolveEmbeddedAgentRunRecoverySnapshot({
			chatRunState: context.chatRunState,
			requestedSessionKey: sessionKey,
			canonicalSessionKey: canonicalKey,
			sessionId
		});
		if (sessionInfo && Object.hasOwn(historyPage, "activeLeafEntryId")) sessionInfo.activeLeafEntryId = historyPage.activeLeafEntryId ?? null;
		const defaults = cursor === void 0 ? {
			...getSessionDefaults(cfg, defaultModelCatalog, {
				agentId: sessionAgentId,
				allowPluginNormalization: false,
				providerPolicySource: "active"
			}),
			modelSelectionTarget: resolveGatewayModelSelectionPolicy({
				callerScopes: client?.connect?.scopes ?? [],
				cfg
			}).target
		} : void 0;
		for (const [projection, catalog] of [[sessionInfo, sessionModelCatalog], [defaults, defaultModelCatalog]]) {
			if (!projection) continue;
			const provider = projection.modelProvider;
			const model = projection.model;
			if (typeof (catalog && provider && model ? findModelCatalogEntry(catalog, {
				provider,
				modelId: model
			}) : void 0)?.reasoning === "boolean" && provider && model) {
				Object.assign(projection, resolveGatewayModelThinkingProfile({
					cfg,
					agentId: sessionAgentId,
					provider,
					model,
					modelCatalog: catalog,
					agentRuntime: projection.agentRuntime?.id,
					sessionKey: projection === sessionInfo ? canonicalKey : void 0,
					providerPolicySource: "active"
				}));
				projection.thinkingOptions = projection.thinkingLevels?.map(({ label }) => label);
				continue;
			}
			delete projection.thinkingLevels;
			delete projection.thinkingOptions;
			projection.thinkingDefault = resolveAgentConfig(cfg, sessionAgentId)?.thinkingDefault ?? (provider && model ? resolveConfiguredThinkingDefaultCore({
				cfg,
				provider,
				model
			}) : cfg.agents?.defaults?.thinkingDefault);
		}
		const thinkingLevel = sessionInfo?.thinkingLevel ?? sessionInfo?.thinkingDefault ?? defaults?.thinkingDefault;
		const verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
		if (sessionInfo) sessionInfo.verboseLevel = verboseLevel;
		const inFlightRun = resolveInFlightRunSnapshot({
			chatAbortControllers: context.chatAbortControllers,
			chatRunState: context.chatRunState,
			requestedSessionKey: sessionKey,
			canonicalSessionKey: canonicalKey,
			agentId: sessionAgentId,
			defaultAgentId: compatibilityOwnerAgentId
		}) ?? embeddedRecovery;
		if (cursor !== void 0) return async () => {
			if (!sessionInfo || !sessionId || !storePath || resolveClaudeCliBindingSessionId(entry)) {
				respond(true, { kind: "reset" });
				return;
			}
			const sessionSnapshot = buildGatewaySessionSnapshot({
				sessionRow: sessionInfo,
				agentId: sessionAgentId,
				includeSession: true,
				activeRunState
			});
			let delta;
			try {
				delta = await readChatHistoryDelta({
					agentId: sessionAgentId,
					cursor,
					maxBytes: maxHistoryBytes,
					scope: {
						agentId: sessionAgentId,
						sessionEntry: entry,
						sessionId,
						sessionKey: canonicalKey,
						storePath
					},
					sessionKey: canonicalKey,
					sessionSnapshot,
					incognito: entry?.incognito
				}, signal);
			} catch (error) {
				const unavailableMessage = resolveSessionHistoryUnavailableMessage(error);
				if (unavailableMessage === void 0) throw error;
				respondChatHistoryUnavailable(method, respond, unavailableMessage);
				return;
			}
			const publicationSharing = readCurrentSharing();
			if (!publicationSharing) return;
			if (publicationSharing.visibility !== currentSharing.visibility || publicationSharing.sharingRole !== currentSharing.sharingRole) {
				respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
				return;
			}
			if (delta.kind === "reset") {
				respond(true, delta);
				return;
			}
			sessionInfo.activeLeafEntryId = delta.activeLeafEntryId;
			const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
				snapshot: inFlightRun,
				messages: delta.messages,
				getMessagesBytes: () => delta.messagesBytes,
				maxBytes: maxHistoryBytes - delta.activityBytes
			});
			respond(true, {
				kind: "delta",
				messages: delta.messages,
				...delta.activity.length > 0 ? { activity: delta.activity } : {},
				deltaCursor: delta.deltaCursor,
				pendingInputs,
				...inputReceipts ? {
					inputReceipts,
					inputConsumptions
				} : {},
				sessionInfo,
				...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
				...startupMetadata ? { metadata: startupMetadata } : {}
			});
		};
		const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
			snapshot: inFlightRun,
			messages: capped,
			getMessagesBytes: () => byteCounter.messagesBytes(capped),
			maxBytes: responseHistoryBytes
		});
		respond(true, {
			sessionKey,
			sessionId,
			messages: composeTranscriptDisplay(capped),
			...capped.some((message) => activity.has(message)) ? { activity: capped.flatMap((message) => activity.get(message) ?? []) } : {},
			pendingInputs,
			...inputReceipts ? {
				inputReceipts,
				inputConsumptions
			} : {},
			...historyPage.deltaCursor ? { deltaCursor: historyPage.deltaCursor } : {},
			...historyPage.responseOffset !== void 0 ? { offset: historyPage.responseOffset } : {},
			...hasMore ? { nextOffset: candidateNextOffset } : {},
			...hasMore !== void 0 ? { hasMore } : {},
			...pagination !== void 0 ? { totalMessages: pagination.totalMessages } : {},
			...historyPage.completeCliImport && !hasMore && historyBudgetPreserved ? { completeSnapshot: true } : {},
			defaults,
			sessionInfo,
			thinkingLevel,
			fastMode: entry?.fastMode,
			toolOverrides: entry?.toolOverrides,
			verboseLevel,
			...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
			...startupMetadata ? { metadata: startupMetadata } : {}
		});
	}))?.();
}
const chatHistoryHandlers = {
	"chat.history": (opts) => handleChatHistoryRequest({
		...opts,
		method: "chat.history"
	}),
	"chat.startup": (opts) => handleChatStartupRequest(opts, handleChatHistoryRequest, respondChatHistoryUnavailable),
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
export { handleChatHistoryRequest as n, projectPendingInputMessage as r, chatHistoryHandlers as t };
