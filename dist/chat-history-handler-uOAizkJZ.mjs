import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { m as scopeLegacySessionKeyToAgent } from "./session-key-CSDERtm3.mjs";
import { d as resolveAgentVerboseDefault, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-BgymzmGj.mjs";
import { Ng as errorShape, Q as validateChatStartupParams, q as validateChatHistoryParams } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { p as readResidentUserProfileId } from "./user-profile-list-BdNJnrJe.mjs";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { i as jsonUtf8BytesOrInfinity } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { o as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { P as readSessionPendingInputReceiptsInWorker } from "./session-accessor-Czw4l8kI.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { _ as resolveSessionVisibility, d as isGatewayAdmin, u as hiddenSessionNotFound } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { c as getSubagentSessionListReadSnapshotIdentity, f as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-state-DBdy-FdI.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as SerializedJsonArray } from "./serialized-json-IhaVUH2u.mjs";
import { i as prepareSessionFastModePresentation, r as projectOperatorModelRead } from "./operator-model-presentation-C1cUPSmr.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import "./model-catalog-vYmFg90_.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { i as resolveGatewayModelThinkingProfile, t as getSessionDefaults } from "./session-utils-model-Bx2gzKtO.mjs";
import { P as buildGatewaySessionRow, i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-jfNs8sPy.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { r as readPreparedGatewayModelMetadata } from "./server-model-catalog-view-DGYC_Ub2.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-L_akTnVb.mjs";
import { n as chatRunBelongsToSelectedAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import { S as resolveActiveEmbeddedRunHandleSessionId, w as resolveActiveEmbeddedRunOwner } from "./runs-Czr-I6_B.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CAoWtmWT.mjs";
import { c as getMaxChatHistoryMessagesBytes } from "./server-constants-B-cmoH_0.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as resolveInFlightRunSnapshot, l as projectInFlightRunSnapshot } from "./chat-abort-CKC_-urc.mjs";
import { i as isQueuedChatTurnForSession } from "./chat-queued-turns-CBHBVpa_.mjs";
import { n as createCurrentUserProfileMessageProjector } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-D7azORwm.mjs";
import { a as isAssistantTtsSupplementMessage, u as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-BNfLH5hX.mjs";
import { n as isAppendOnlySessionHistoryDelta, t as createPreparedSessionHistorySubagentProjection } from "./session-history-delta-visibility-DcmJ_4nD.mjs";
import { t as createSessionActorTranscriptReader } from "./session-transcript-memory-reader-Bxdst6P1.mjs";
import { t as resolveGatewayModelSelectionPolicy } from "./session-model-selection-policy-Ch870Lfm.mjs";
import { t as readSessionHistoryPageInWorker } from "./session-history-worker-runtime-UlzjKIVK.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import { c as resolveClaudeCliBindingSessionId } from "./cli-session-history.claude-YLsvkl4E.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as decodeChatHistoryPageCursor, r as prepareChatHistoryResponsePage } from "./chat-history-response-page-dk61A4nE.mjs";
import { a as createChatHistoryActivityProjection, i as chatHistoryActivityBytes, l as reportOmittedChatHistory, n as boundInFlightRunSnapshotForChatHistory, s as createChatHistoryDeltaByteCounter } from "./chat-history-budget-Dk8b7BOY.mjs";
import { n as readChatHistoryPage } from "./chat-history-pages-jllvxj-7.mjs";
import { n as withPreparedSessionResolve } from "./sessions-resolve-T8v8cHAf.mjs";
import { n as readChatPendingInputs } from "./chat-pending-inputs-B_VF-iWj.mjs";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-CjTqkpRo.mjs";
import { t as projectSessionMessagePayload } from "./session-transcript-message-LY6B8Kfz.mjs";
import { t as handleChatMetadataRequest } from "./chat-metadata-handler-D7b65rB5.mjs";
//#region src/gateway/server-methods/chat-history-delta.ts
const CHAT_HISTORY_DELTA_MAX_EVENTS = 200;
const CHAT_HISTORY_DELTA_MAX_BYTES = 1e6;
function chatHistoryDeltaLimits(params) {
	return {
		cursor: params.cursor,
		maxBytes: Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES),
		maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
	};
}
async function readChatHistoryDelta(params, signal) {
	signal?.throwIfAborted();
	const memory = captureSessionActorTranscriptRead(params.scope, signal);
	if (memory) {
		if (memory.missing) return { kind: "reset" };
		const delta = await memory.read("session.history.delta", { options: chatHistoryDeltaLimits(params) });
		const readers = createSessionActorTranscriptReader(memory);
		if (delta.kind === "page") await readers.prepareVisibility(delta.events.flatMap((row) => row.messageSeq === void 0 ? [] : [projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition)]));
		const result = await projectChatHistoryDelta(params, delta, readers.subagentCoordination);
		signal?.throwIfAborted();
		memory.assertCurrent();
		return result;
	}
	if (params.incognito || isIncognitoSessionKey(params.sessionKey)) return { kind: "reset" };
	const target = {
		...params.scope,
		sessionEntry: params.scope.sessionEntry ? { sessionId: params.scope.sessionEntry.sessionId } : void 0
	};
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
	const result = await readSessionHistoryPageInWorker({
		kind: "delta",
		params: {
			target,
			limits: chatHistoryDeltaLimits(params)
		}
	}, signal);
	return projectChatHistoryDelta(params, result.delta, createPreparedSessionHistorySubagentProjection(result.subagentCoordination, result.assertCurrent));
}
async function projectChatHistoryDelta(params, result, subagentCoordination) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	subagentCoordination.assertCurrent?.();
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(result.events.flatMap((row) => row.messageSeq === void 0 ? [] : [projectTranscriptEntryMessage(row.event, row.messageSeq, row.displayPosition)]));
	subagentCoordination.assertCurrent?.();
	let projectionState = {
		assistantErrorPending: false,
		turnBoundaryPending: false
	};
	const projectCurrentUserProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const messages = [];
	const activityMessages = [];
	let messagesBytes = 2;
	const envelopeBytes = result.events.length > 1 ? createChatHistoryDeltaByteCounter(params.sessionSnapshot) : void 0;
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
			toolResultMaxChars: params.toolResultMaxChars,
			message: entryMessage,
			...typeof messageId === "string" && messageId ? { messageId } : {},
			messageSeq: row.messageSeq,
			transcriptPosition: row.displayPosition,
			projectionState,
			projectCurrentUserProfile,
			subagentCoordination,
			resolveCronJobName,
			sessionKey: params.sessionKey,
			sessionSnapshot: params.sessionSnapshot
		});
		if (projected.requiresHistoryReset) return { kind: "reset" };
		projectionState = projected.projectionState;
		if (projectionState.assistantErrorPending) return { kind: "reset" };
		if (projected.payload) {
			messagesBytes += (envelopeBytes ? envelopeBytes(projected.payload) : jsonUtf8BytesOrInfinity(projected.payload)) + (messages.length > 0 ? 1 : 0);
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
	const registration = params.chatRunState.registry.peek(owner.runId);
	const runId = registration && (registration.sessionKey === params.requestedSessionKey || registration.sessionKey === params.canonicalSessionKey) && chatRunBelongsToSelectedAgent({
		agentId: registration.agentId,
		sessionKey: registration.sessionKey,
		selectedAgentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}) ? registration.clientRunId : owner.runId;
	return projectInFlightRunSnapshot({
		chatRunState: params.chatRunState,
		runId,
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
//#region src/gateway/server-methods/chat-history-session-read.ts
/** Select and revalidate history metadata through its prepared row and sharing owners. */
async function prepareChatHistorySessionRead({ context, client, respond, signal, sessionMutationAuthorization, method, sessionKey, agentIdOverride, requestedSessionId, retainedSessionId }) {
	const unavailable = (message) => respondChatHistoryUnavailable(method, respond, message);
	const rowProjection = getSessionRowProjection(context);
	if (!rowProjection) {
		unavailable("session rows are initializing; reload the conversation");
		return;
	}
	const queries = (cfg) => {
		const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentIdOverride);
		if (!requested.ok) return [];
		const { canonicalKey, agentId } = resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId: requested.agentId
		});
		return [{
			key: canonicalKey,
			agentId
		}];
	};
	const selectSession = (read) => {
		const cfg = read.state.cfg;
		const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentIdOverride);
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const requestedIdentity = resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId: requested.agentId
		});
		const record = read.describe({
			key: requestedIdentity.canonicalKey,
			agentId: requestedIdentity.agentId
		});
		const identity = record ? {
			agentId: record.agentId,
			canonicalKey: record.key
		} : requestedIdentity;
		const storePath = record?.storeTarget.storePath ?? resolveSessionStorePathCore(cfg.session?.store, { agentId: identity.agentId });
		return {
			cfg,
			...identity,
			record,
			entry: record?.storedEntry ?? record?.entry,
			storePath,
			sourcePath: retainedSessionId && record && !isIncognitoSessionKey(record.key) ? read.readSource(record)?.path : storePath,
			storeKeys: [identity.canonicalKey],
			store: {}
		};
	};
	const authorizeSharingFacts = (current, sharing) => {
		sessionMutationAuthorization?.assertCurrent();
		if (current.entry ? sharing.entryFilter?.(current.canonicalKey, current.entry) === false : requestedSessionId && !retainedSessionId && !isGatewayAdmin(client)) {
			respond(false, void 0, hiddenSessionNotFound(current.canonicalKey));
			return;
		}
		return sharing;
	};
	const authorizeSharing = (current, read) => authorizeSharingFacts(current, prepareProjectedSessionPresentation(read, client).sharing);
	const selectedSession = await measureDiagnosticsTimelineSpan(`gateway.${method}.session_entry`, () => withReadySessionRows(rowProjection, queries, (read) => {
		const selected = selectSession(read);
		return selected && authorizeSharing(selected, read) ? selected : void 0;
	}), {
		config: context.getRuntimeConfig(),
		phase: method
	});
	signal?.throwIfAborted();
	if (!selectedSession) return;
	const { agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
	const entry = selectedSession.entry ? structuredClone(selectedSession.entry) : void 0;
	const readTranscriptOwner = async () => {
		if (!requestedSessionId) return true;
		const transcript = await readSessionHistoryPageInWorker({
			kind: "transcript-binding",
			params: { target: {
				agentId: sessionAgentId,
				sessionId: requestedSessionId,
				storePath
			} }
		}, signal);
		if (!transcript) return false;
		const storedKey = transcript.sessionKey;
		return (storedKey === "global" || storedKey === "unknown" ? storedKey : scopeLegacySessionKeyToAgent({
			sessionKey: storedKey,
			agentId: sessionAgentId
		})) === canonicalKey;
	};
	if (requestedSessionId && !await readTranscriptOwner()) {
		if (retainedSessionId) unavailable("retained transcript is no longer available");
		else respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId does not belong to sessionKey"));
		return;
	}
	let excluded;
	try {
		if (!selectedSession.entry && !isIncognitoSessionKey(sessionKey)) {
			excluded = await prepareSessionMutationFacts({
				cfg: selectedSession.cfg,
				sessionKey,
				agentId: selectedSession.agentId,
				allowMissing: true
			});
			signal?.throwIfAborted();
		}
		const readCurrentSharing = (read) => {
			const current = selectSession(read);
			if (!current) return;
			if (excluded) {
				let excludedEntry;
				try {
					excludedEntry = excluded.readCurrent(read.state.cfg).target?.entry;
				} catch (error) {
					if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
					unavailable(error.message);
					return;
				}
				if (excludedEntry) {
					if (authorizeSharing({
						...current,
						entry: excludedEntry
					}, read)) {
						if (current.entry) unavailable("session changed while reading history; reload the conversation");
						else respond(false, void 0, hiddenSessionNotFound(current.canonicalKey));
					}
					return;
				}
			}
			const currentEntry = current.entry;
			if (entry && (!currentEntry || current.agentId !== sessionAgentId || current.canonicalKey !== canonicalKey || current.storePath !== storePath || !retainedSessionId && (!read.describe({
				key: canonicalKey,
				agentId: sessionAgentId,
				storePath
			}, selectedSession.record) || currentEntry.sessionId !== entry.sessionId || currentEntry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentEntry.sessionStartedAt !== entry.sessionStartedAt))) {
				unavailable("session changed while reading history; reload the conversation");
				return;
			}
			const sharing = authorizeSharing(current, read);
			if (!sharing) return;
			return currentEntry ? {
				visibility: resolveSessionVisibility(currentEntry),
				sharingRole: sharing.roleForTarget({
					...current,
					entry: currentEntry,
					storeKey: current.canonicalKey
				})
			} : {};
		};
		if (excluded && !await withReadySessionRows(rowProjection, queries, readCurrentSharing)) {
			excluded.release();
			return;
		}
		signal?.throwIfAborted();
		return {
			selectedSession,
			entry,
			queries,
			readCurrentSharing,
			readTranscriptOwner,
			rowProjection,
			async publishRetainedTranscript(publication) {
				const facts = await prepareSessionMutationFacts({
					cfg: context.getRuntimeConfig(),
					sessionKey: canonicalKey,
					agentId: sessionAgentId,
					allowMissing: true
				});
				try {
					if (!await publication.verify()) {
						unavailable("retained transcript changed while reading history");
						return;
					}
					signal?.throwIfAborted();
					const currentConfig = context.getRuntimeConfig();
					const current = facts.readCurrent(currentConfig);
					const target = current.target;
					if (entry && !target || target && (target.agentId !== sessionAgentId || target.canonicalKey !== canonicalKey || current.sourcePath !== selectedSession.sourcePath) || publication.requireCurrentSession && target?.entry.sessionId !== retainedSessionId) {
						unavailable("retained session changed while reading history");
						return;
					}
					const sharing = authorizeSharingFacts({
						entry: target?.entry,
						canonicalKey
					}, prepareProjectedSessionSharing({
						cfg: rowProjection.getPolicyConfig(),
						client: client ?? null,
						isMember: (candidate, identityId) => Boolean(target && candidate.agentId === target.agentId && candidate.canonicalKey === target.canonicalKey && candidate.storePath === target.storePath && current.membership.has(identityId))
					}));
					if (!sharing) return;
					const visibility = target ? resolveSessionVisibility(target.entry) : void 0;
					const sharingRole = target ? sharing.roleForTarget(target) : void 0;
					if (visibility !== publication.sharing.visibility || sharingRole !== publication.sharing.sharingRole) {
						unavailable("session access changed while reading history");
						return;
					}
					const result = publication.publish();
					if (isPromiseLike(result)) {
						Promise.resolve(result).catch(() => {});
						throw new Error("Retained history publication must remain synchronous");
					}
				} finally {
					facts.release();
				}
			},
			release: () => excluded?.release()
		};
	} catch (error) {
		excluded?.release();
		if (error instanceof SessionMutationFactsUnavailableError) {
			unavailable(error.message);
			return;
		}
		throw error;
	}
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
		const { ensureProfileIdForEmail } = await import("./user-profile-email-BkkHBMdR.mjs");
		profileId = await ensureProfileIdForEmail(email, options, assertCurrent);
	}
	return () => {
		assertCurrent();
		return profileId ? readResidentUserProfileId(profileId, options) : void 0;
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-handler.ts
async function handleChatHistoryRequest({ params, respond, client, context, method, signal, sessionMutationAuthorization, retainedTranscript, acceptsSerializedJson, req }) {
	if (!assertValidParams(params, validateChatHistoryParams, method, respond)) return;
	const { sessionKey, limit, offset, cursor, messageId: wireMessageId, sessionId: wireSessionId, maxChars, toolResultMaxChars, maxBytes, pendingBefore, inputRunIds } = params;
	const pageCursor = decodeChatHistoryPageCursor(cursor);
	const messageId = pageCursor?.messageId ?? wireMessageId;
	const deltaCursor = pageCursor ? void 0 : cursor;
	const retainedSessionId = retainedTranscript?.sessionId;
	const requestedSessionId = retainedSessionId ?? pageCursor?.sessionId ?? wireSessionId;
	let selectorError;
	if (pageCursor === null) selectorError = "invalid history page cursor";
	else if (offset !== void 0 && wireMessageId !== void 0) selectorError = "offset and messageId cannot be used together";
	else if (cursor !== void 0 && (offset !== void 0 || wireMessageId !== void 0)) selectorError = "cursor cannot be used with offset or messageId";
	else if (wireSessionId !== void 0 && wireMessageId === void 0) selectorError = "sessionId requires messageId";
	else if (pageCursor && retainedSessionId && pageCursor.sessionId !== retainedSessionId) selectorError = "history page cursor does not belong to retained transcript";
	if (selectorError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectorError));
		return;
	}
	if (!getSubagentSessionListReadSnapshotIdentity()) await prepareOptionalSubagentSessionListReadCache();
	signal?.throwIfAborted();
	const selection = await prepareChatHistorySessionRead({
		context,
		sessionMutationAuthorization,
		client,
		respond,
		signal,
		method,
		sessionKey,
		agentIdOverride: normalizeOptionalString(params.agentId),
		requestedSessionId,
		retainedSessionId
	});
	if (!selection) return;
	const respondReadError = (error) => {
		const message = resolveSessionHistoryUnavailableMessage(error);
		if (message === void 0) throw error;
		respondChatHistoryUnavailable(method, respond, message);
	};
	try {
		const { selectedSession, entry, queries, readCurrentSharing, readTranscriptOwner, rowProjection } = selection;
		const { cfg, agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
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
		const max = limit ?? 200;
		const maxHistoryBytes = Math.min(maxBytes ?? Infinity, getMaxChatHistoryMessagesBytes());
		const maxResponseBytes = Math.min(maxBytes ?? 524288, maxHistoryBytes);
		const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(maxChars);
		const pendingInputs = sessionId && sessionId === entry?.sessionId ? await readChatPendingInputs({
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId,
			storePath
		}, {
			before: pendingBefore,
			limit: max,
			maxChars: effectiveMaxChars,
			queuedTurns: context.chatQueuedTurns,
			cronStorePath: context.cronStorePath
		}) : {
			items: [],
			total: 0
		};
		const inputReceipts = inputRunIds ? !messageId && sessionId && sessionId === entry?.sessionId ? (await readSessionPendingInputReceiptsInWorker({
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId,
			storePath
		}, { runIds: inputRunIds })).map((receipt) => receipt.state === "pending" && !receipt.cancelled && isQueuedChatTurnForSession(context.chatQueuedTurns, receipt.runId, {
			agentId: sessionAgentId,
			sessionKey: canonicalKey,
			sessionId
		}) ? {
			runId: receipt.runId,
			state: receipt.state,
			queued: true
		} : receipt) : [] : void 0;
		const inputConsumptions = inputReceipts?.flatMap((receipt) => receipt.state === "consumed" ? [{
			runId: receipt.runId,
			consumedByEventId: receipt.consumedByEventId
		}] : []);
		let historyPage;
		try {
			historyPage = deltaCursor !== void 0 ? { messages: [] } : await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
				encodeResponse: acceptsSerializedJson && method === req.method,
				entry: historyEntry,
				provider: resolvedSessionModel.provider,
				sessionId,
				storePath,
				sessionAgentId,
				canonicalKey,
				max,
				maxHistoryBytes,
				responseHistoryBytes: maxResponseBytes,
				effectiveMaxChars,
				toolResultMaxChars,
				offset,
				messageId,
				...pageCursor ? { pageCursor } : {}
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
			respondReadError(error);
			return;
		}
		const { messages, messagesBytes, responseHistoryBytes, omission, ...responseFields } = historyPage.encodedResponse ? {
			...historyPage.encodedResponse,
			messages: new SerializedJsonArray(historyPage.encodedResponse.messages)
		} : prepareChatHistoryResponsePage(historyPage, {
			entry: historyEntry,
			maxHistoryBytes,
			responseHistoryBytes: maxResponseBytes,
			messageId
		});
		if (omission) reportOmittedChatHistory({
			...omission,
			maxHistoryBytes: responseHistoryBytes,
			logDebug: (message) => context.logGateway.debug(message)
		});
		const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
		const startupProjection = await (startupProjectionPromise ?? readStartupProjection());
		const startupMetadata = method === "chat.startup" ? startupProjection?.metadata : void 0;
		const { sessionModelCatalog, defaultModelCatalog } = startupProjection ?? {};
		const modelReadScope = {
			context,
			client,
			agentId: sessionAgentId,
			catalog: defaultModelCatalog
		};
		const query = {
			key: canonicalKey,
			agentId: sessionAgentId,
			storePath
		};
		const [unsavedAcpMeta] = entry ? [] : await readAcpSessionMetaForEntries({
			cfg,
			entries: [{
				agentId: sessionAgentId,
				sessionKey: canonicalKey,
				entry: void 0
			}]
		});
		await (await withReadySessionRows(rowProjection, queries, (read) => {
			const currentSharing = readCurrentSharing(read);
			if (!currentSharing) return;
			const sessionInfo = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_info`, () => prepareProjectedSessionPresentation(read, client).snapshot(query).row ?? (entry ? void 0 : buildGatewaySessionRow({
				...selectedSession,
				key: canonicalKey,
				preparedAcpMeta: unsavedAcpMeta ?? null,
				preparedRuntimeOwnership: null,
				modelCatalog: sessionModelCatalog,
				rowContext: rowProjection.state.rowContext
			})), {
				config: cfg,
				phase: method
			});
			if (!entry && sessionInfo) {
				const presentFastMode = prepareSessionFastModePresentation(client);
				sessionInfo.fastMode = presentFastMode(sessionInfo.fastMode);
				sessionInfo.effectiveFastMode = presentFastMode(sessionInfo.effectiveFastMode);
			}
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
			if (sessionInfo) {
				sessionInfo.hasActiveRun = activeRunState.active;
				if (activeRunState.runIds !== void 0) sessionInfo.activeRunIds = activeRunState.runIds;
				if (activeRunState.active) sessionInfo.status = activeRunState.status ?? "running";
			}
			const embeddedRecovery = resolveEmbeddedAgentRunRecoverySnapshot({
				chatRunState: context.chatRunState,
				requestedSessionKey: sessionKey,
				canonicalSessionKey: canonicalKey,
				sessionId,
				agentId: sessionAgentId,
				defaultAgentId: compatibilityOwnerAgentId
			});
			if (sessionInfo && Object.hasOwn(historyPage, "activeLeafEntryId")) sessionInfo.activeLeafEntryId = historyPage.activeLeafEntryId ?? null;
			const defaults = deltaCursor === void 0 ? {
				...getSessionDefaults(cfg, defaultModelCatalog, {
					agentId: sessionAgentId,
					allowPluginNormalization: false,
					metadataSnapshot: readPreparedGatewayModelMetadata(cfg),
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
			const verboseLevel = entry?.verboseLevel ?? resolveAgentVerboseDefault(cfg, sessionAgentId);
			if (sessionInfo) sessionInfo.verboseLevel = verboseLevel;
			const inFlightRun = resolveInFlightRunSnapshot({
				chatAbortControllers: context.chatAbortControllers,
				chatRunState: context.chatRunState,
				requestedSessionKey: sessionKey,
				canonicalSessionKey: canonicalKey,
				agentId: sessionAgentId,
				defaultAgentId: compatibilityOwnerAgentId
			}) ?? embeddedRecovery;
			if (deltaCursor !== void 0) return async () => {
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
						toolResultMaxChars,
						agentId: sessionAgentId,
						cursor: deltaCursor,
						maxBytes: maxResponseBytes,
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
					respondReadError(error);
					return;
				}
				return withReadySessionRows(rowProjection, queries, (publicationRead) => {
					const publicationSharing = readCurrentSharing(publicationRead);
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
						maxBytes: maxResponseBytes - delta.activityBytes
					});
					const payload = {
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
					};
					respond(true, projectOperatorModelRead(modelReadScope, payload));
				});
			};
			const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
				snapshot: inFlightRun,
				messages: [],
				getMessagesBytes: () => messagesBytes,
				maxBytes: responseHistoryBytes
			});
			const payload = {
				sessionKey,
				sessionId,
				messages,
				...responseFields,
				pendingInputs,
				...inputReceipts ? {
					inputReceipts,
					inputConsumptions
				} : {},
				...historyPage.deltaCursor ? { deltaCursor: historyPage.deltaCursor } : {},
				...historyPage.windowReset ? { windowReset: true } : {},
				...historyPage.responseOffset !== void 0 ? { offset: historyPage.responseOffset } : {},
				defaults,
				sessionInfo,
				thinkingLevel,
				fastMode: prepareSessionFastModePresentation(client)(entry?.fastMode),
				toolOverrides: entry?.toolOverrides,
				verboseLevel,
				...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
				...startupMetadata ? { metadata: startupMetadata } : {}
			};
			if (retainedTranscript) return () => selection.publishRetainedTranscript({
				verify: async () => await readTranscriptOwner() && (await retainedTranscript.verifyRetainedState?.() ?? true),
				requireCurrentSession: retainedTranscript.requireCurrentSession === true,
				sharing: currentSharing,
				publish: () => respond(true, projectOperatorModelRead(modelReadScope, payload))
			});
			respond(true, projectOperatorModelRead(modelReadScope, payload));
		}))?.();
	} finally {
		selection.release();
	}
}
const chatHistoryHandlers = {
	"chat.history": (opts) => handleChatHistoryRequest({
		...opts,
		method: "chat.history"
	}),
	"chat.startup": async (opts) => {
		if (!assertValidParams(opts.params, validateChatStartupParams, "chat.startup", opts.respond)) return;
		if ("sessionKey" in opts.params) {
			await handleChatHistoryRequest({
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
		const { shortId, slugHint, agentId, limit, maxBytes, toolResultMaxChars } = opts.params;
		const projection = getSessionRowProjection(opts.context);
		if (!projection) {
			respondChatHistoryUnavailable("chat.startup", opts.respond, "session rows are initializing; reload the conversation");
			return;
		}
		const resolution = await withPreparedSessionResolve({
			projection,
			client: opts.client,
			p: {
				shortId,
				slugHint,
				agentId,
				allowMissing: true
			},
			isCurrent: () => getSessionRowProjection(opts.context) === projection
		}, (resolved) => {
			opts.sessionMutationAuthorization?.assertCurrent();
			if (!resolved.ok) {
				opts.respond(false, void 0, resolved.error);
				return;
			}
			if ("missing" in resolved || "ambiguous" in resolved) {
				opts.respond(true, { resolution: {
					ok: false,
					..."ambiguous" in resolved ? { candidates: resolved.candidates } : {}
				} });
				return;
			}
			return resolved;
		});
		if (!resolution) return;
		await handleChatHistoryRequest({
			...opts,
			params: {
				sessionKey: resolution.key,
				agentId: resolution.agentId,
				limit,
				maxBytes,
				toolResultMaxChars
			},
			method: "chat.startup",
			respond: (ok, payload, error, meta) => opts.respond(ok, ok ? {
				...asOptionalRecord(payload),
				resolution
			} : payload, error, meta)
		});
	},
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
export { handleChatHistoryRequest as n, prepareChatHistorySessionRead as r, chatHistoryHandlers as t };
