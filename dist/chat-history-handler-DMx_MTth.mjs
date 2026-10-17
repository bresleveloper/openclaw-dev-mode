import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { m as scopeLegacySessionKeyToAgent } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as jsonUtf8BytesOrInfinity } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { W as validateChatHistoryParams, Y as validateChatStartupParams } from "./src-l2dWvEsN.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { c as readResidentUserProfileId } from "./user-profile-list-CtETKur7.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as CHAT_PENDING_INPUT_MESSAGE_PREFIX } from "./chat-history-constants-C-H8nkgi.mjs";
import { n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import "./model-catalog-CwZMTjpw.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { i as prepareSqliteScope, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { a as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D8MomqVO.mjs";
import { P as listSessionPendingInputs } from "./session-accessor-CQ-g9yb2.mjs";
import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-BH_EolwD.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { C as resolveActiveEmbeddedRunHandleSessionId, T as resolveActiveEmbeddedRunOwner } from "./runs-CzCPh-gu.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { m as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection.helpers-pbUdgTgb.mjs";
import { c as resolveInFlightRunSnapshot, i as projectInFlightRunSnapshot } from "./chat-abort-DsJ_Zmkt.mjs";
import { i as isQueuedChatTurnForSession } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { c as getSubagentSessionListReadSnapshotIdentity, f as prepareOptionalSubagentSessionListReadCache } from "./subagent-registry-state-CVSclnHX.mjs";
import { P as buildGatewaySessionRow, i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { i as resolveGatewayModelThinkingProfile, t as getSessionDefaults } from "./session-utils-model-JtZ-2MzK.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-CsoRu_a-.mjs";
import { d as hiddenSessionNotFound, f as isGatewayAdmin, v as resolveSessionVisibility } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-D34IlGk3.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-BYWh0eAO.mjs";
import { t as SerializedJsonArray } from "./serialized-json-B87207AB.mjs";
import { i as prepareSessionFastModePresentation, r as projectOperatorModelRead } from "./operator-model-presentation-CO5pZsTT.mjs";
import { r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-BwpUabTn.mjs";
import { n as projectAgentHistoryActivity } from "./agent-activity-events-CYq4KNEY.mjs";
import { s as resolveGatewayModelSelectionPolicy } from "./session-utils-list-DnMUHvjc.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as readTranscriptDisplayDelta } from "./session-accessor.sqlite-history-events-C-R0iBgU.mjs";
import { a as isAssistantTtsSupplementMessage, l as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { a as projectChatDisplayMessage, n as createCurrentUserProfileMessageProjector } from "./chat-display-projection.core-BSNrSH5r.mjs";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import "./chat-display-projection-ZUh2mrnJ.mjs";
import { c as resolveClaudeCliBindingSessionId } from "./cli-session-history.claude-C6Q_lxlR.mjs";
import { c as reportOmittedChatHistory, i as createChatHistoryActivityProjection, n as boundInFlightRunSnapshotForChatHistory, o as createChatHistoryDeltaByteCounter, r as chatHistoryActivityBytes, s as replaceOversizedChatHistoryMessages } from "./chat-history-budget-Ci-uxG6q.mjs";
import { t as readChatHistoryPage } from "./chat-history-pages-CaQGA2lO.mjs";
import { t as withPreparedSessionResolve } from "./sessions-resolve-DFVf7PH2.mjs";
import { t as prepareGatewaySessionStoreReadSources } from "./session-utils-store-sources-BQA0mPmY.mjs";
import { t as readSessionHistoryPageInWorker } from "./session-history-worker-runtime-C6BcrSvb.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-COH4h1JU.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as resolveSessionHistoryUnavailableMessage } from "./session-history-error-D24vQyH_.mjs";
import { n as isAppendOnlySessionHistoryDelta, t as createPreparedSessionHistorySubagentProjection } from "./session-history-delta-visibility-D6LsiQ4n.mjs";
import { t as createBoundSessionHistorySubagentProjection } from "./session-history-readonly-reader-BdpYrQoe.mjs";
import { t as projectSessionMessagePayload } from "./session-transcript-message-DmVdjUi1.mjs";
import { n as prepareChatHistoryResponsePage } from "./chat-history-response-page-SonwIq86.mjs";
import { t as handleChatMetadataRequest } from "./chat-metadata-handler-BtwMm02P.mjs";
import path from "node:path";
//#region src/config/sessions/session-pending-input-receipts.ts
/** Reconcile exact run receipts without reading pending input payloads on the Gateway. */
async function readSessionPendingInputReceiptsInWorker(scope, options) {
	if (options.runIds.length === 0) return [];
	const captured = {
		...scope,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const runIds = [...options.runIds];
	if (isIncognitoSessionKey(captured.sessionKey)) {
		const { listSessionPendingInputReceipts } = await import("./session-accessor.sqlite-pending-input-receipts-ByGTLgFb.mjs");
		return listSessionPendingInputReceipts(captured, { runIds });
	}
	const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const resolved = await prepareSqliteScope(captured);
	assertStateCurrent();
	const databaseOptions = toDatabaseOptions(resolved);
	return await withSessionHistoryWorkerDatabase({
		...databaseOptions,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	}, async (owner) => {
		const receipts = await owner.readPendingInputReceipts({
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey,
			sessionId: captured.sessionId,
			runIds,
			env: captured.env
		});
		assertStateCurrent();
		return receipts;
	});
}
//#endregion
//#region src/gateway/session-history-subagent-projection.ts
/** Bind host-owned stores and retain their admission for one display operation. */
function createSessionHistorySubagentProjection(scope) {
	const databaseOptions = toDatabaseOptions(resolveSqliteTranscriptReadScope(scope));
	const currentSource = {
		agentId: databaseOptions.agentId,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	};
	const env = process.env;
	const context = captureOpenClawStateWorkerContext({ env });
	const sourceReads = prepareGatewaySessionStoreReadSources({
		cfg: getRuntimeConfig(),
		currentSource,
		env,
		registryPath: context.admission.databasePath
	});
	const bound = createBoundSessionHistorySubagentProjection((read) => withCurrentProjectionSnapshot(scope, read, { readOnly: true }), {
		path: context.admission.databasePath,
		environment: context.environment
	}, () => sourceReads.sources);
	const assertCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		sourceReads.assertCurrent();
	};
	const readCurrent = (read) => {
		assertCurrent();
		const result = read();
		assertCurrent();
		return result;
	};
	return {
		assertCurrent,
		isSubagentSession: (sessionKey) => readCurrent(() => bound.isSubagentSession(sessionKey)),
		isSubagentRunMessage: (runId, messageSeq) => readCurrent(() => bound.isSubagentRunMessage(runId, messageSeq))
	};
}
//#endregion
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
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-C_HMG5HH.mjs");
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
async function readLocalChatHistoryDelta(params) {
	const maxBytes = Math.min(params.maxBytes ?? Infinity, CHAT_HISTORY_DELTA_MAX_BYTES);
	const result = readTranscriptDisplayDelta(params.scope, {
		cursor: params.cursor,
		maxBytes,
		maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
	});
	if (!isAppendOnlySessionHistoryDelta(result)) return { kind: "reset" };
	return projectChatHistoryDelta(params, result, createSessionHistorySubagentProjection(params.scope));
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
//#region src/gateway/server-methods/chat-history-session-read.ts
/** Select and revalidate history metadata through its prepared row and sharing owners. */
async function prepareChatHistorySessionRead({ context, client, respond, signal, sessionMutationAuthorization, method, sessionKey, agentIdOverride, requestedSessionId, retainedSessionId }) {
	const rowProjection = getSessionRowProjection(context);
	if (!rowProjection) {
		respondChatHistoryUnavailable(method, respond, "session rows are initializing; reload the conversation");
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
		return {
			cfg,
			...identity,
			record,
			entry: record?.storedEntry ?? record?.entry,
			storePath: record?.storeTarget.storePath ?? resolveSessionStorePathCore(cfg.session?.store, { agentId: identity.agentId }),
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
		const { agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
		const entry = selectedSession.entry ? structuredClone(selectedSession.entry) : void 0;
		const readCurrentSharing = (read) => {
			const current = selectSession(read);
			if (!current) return;
			if (excluded) {
				let excludedEntry;
				try {
					excludedEntry = excluded.readCurrent(read.state.cfg).target?.entry;
				} catch (error) {
					if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
					respondChatHistoryUnavailable(method, respond, error.message);
					return;
				}
				if (excludedEntry) {
					if (authorizeSharing({
						...current,
						entry: excludedEntry
					}, read)) respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
					return;
				}
			}
			const currentEntry = current.entry;
			if (entry && (!currentEntry || current.agentId !== sessionAgentId || current.canonicalKey !== canonicalKey || current.storePath !== storePath || !retainedSessionId && (!read.describe({
				key: canonicalKey,
				agentId: sessionAgentId,
				storePath
			}, selectedSession.record) || currentEntry.sessionId !== entry.sessionId || currentEntry.lifecycleRevision !== entry.lifecycleRevision || entry.sessionStartedAt !== void 0 && currentEntry.sessionStartedAt !== entry.sessionStartedAt))) {
				respondChatHistoryUnavailable(method, respond, "session changed while reading history; reload the conversation");
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
						respondChatHistoryUnavailable(method, respond, "retained transcript changed while reading history");
						return;
					}
					signal?.throwIfAborted();
					const currentConfig = context.getRuntimeConfig();
					const current = facts.readCurrent(currentConfig);
					const target = current.target;
					if (entry && !target || target && (target.agentId !== sessionAgentId || target.canonicalKey !== canonicalKey || current.sourcePath !== storePath) || publication.requireCurrentSession && target?.entry.sessionId !== retainedSessionId) {
						respondChatHistoryUnavailable(method, respond, "retained session changed while reading history");
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
						respondChatHistoryUnavailable(method, respond, "session access changed while reading history");
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
			respondChatHistoryUnavailable(method, respond, error.message);
			return;
		}
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/chat-pending-inputs.ts
const PENDING_INPUT_DISPLAY_MAX_BYTES = 131072;
const PENDING_INPUT_CORRELATION_MAX_CHARS = 256;
function projectPendingInputMessage(input, maxChars, projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay), resolveCronJobName) {
	if (input.state === "cancelled" && input.message.display === false) return {
		role: "user",
		content: [],
		display: false,
		timestamp: input.acceptedAt,
		__openclaw: { id: `${CHAT_PENDING_INPUT_MESSAGE_PREFIX}${input.id}` }
	};
	const projected = projectChatDisplayMessage(input.message, {
		maxChars,
		resolveCronJobName
	});
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
async function readChatPendingInputs(scope, options) {
	const page = await listSessionPendingInputs(scope, {
		before: options.before,
		limit: Math.min(options.limit, 20)
	});
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(page.items.map((input) => input.message), options.cronStorePath);
	let queuedCount = 0;
	for (const runId of options.queuedTurns?.keys() ?? []) if (runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS && isQueuedChatTurnForSession(options.queuedTurns, runId, scope)) queuedCount += 1;
	const projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const visible = page.items.flatMap((input) => {
		const message = projectPendingInputMessage(input, options.maxChars, projectProfile, resolveCronJobName);
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
		...options.queuedTurns ? { queuedCount } : {},
		items: visible.map(({ input: item }, index) => {
			const display = {
				id: item.id,
				acceptedAt: item.acceptedAt,
				state: item.state,
				message: messages[index]
			};
			if (item.runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS) {
				display.runId = item.runId;
				if (item.state === "queued" && isQueuedChatTurnForSession(options.queuedTurns, item.runId, scope)) display.queued = true;
			}
			return display;
		})
	};
}
//#endregion
//#region src/gateway/server-methods/chat-startup-handler.ts
async function handleChatStartupRequest(opts, handleHistory) {
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
		const { ensureProfileIdForEmail } = await import("./user-profile-email-t3q3QwRv.mjs");
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
	const { sessionKey, limit, offset, cursor, messageId, sessionId: wireSessionId, maxChars, maxBytes, pendingBefore, inputRunIds } = params;
	const retainedSessionId = retainedTranscript?.sessionId;
	const requestedSessionId = retainedSessionId ?? wireSessionId;
	let selectorError;
	if (offset !== void 0 && messageId !== void 0) selectorError = "offset and messageId cannot be used together";
	else if (cursor !== void 0 && (offset !== void 0 || messageId !== void 0)) selectorError = "cursor cannot be used with offset or messageId";
	else if (wireSessionId !== void 0 && messageId === void 0) selectorError = "sessionId requires messageId";
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
	try {
		const { selectedSession, entry, queries, readCurrentSharing, rowProjection } = selection;
		const { cfg, agentId: sessionAgentId, storePath, canonicalKey } = selectedSession;
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
			return Boolean(transcript && scopeLegacySessionKeyToAgent({
				sessionKey: transcript.sessionKey,
				agentId: sessionAgentId
			}) === scopeLegacySessionKeyToAgent({
				sessionKey: canonicalKey,
				agentId: sessionAgentId
			}));
		};
		if (!await readTranscriptOwner()) {
			if (retainedTranscript) respondChatHistoryUnavailable(method, respond, "retained transcript is no longer available");
			else respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId does not belong to sessionKey"));
			return;
		}
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
			historyPage = cursor ? { messages: [] } : await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
				encodeResponse: acceptsSerializedJson && method === req.method,
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
		const { messages, messagesBytes, responseHistoryBytes, omission, ...responseFields } = historyPage.encodedResponse ? {
			...historyPage.encodedResponse,
			messages: new SerializedJsonArray(historyPage.encodedResponse.messages)
		} : prepareChatHistoryResponsePage(historyPage, {
			entry: historyEntry,
			maxHistoryBytes,
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
		await (await withReadySessionRows(rowProjection, queries, (read) => {
			const currentSharing = readCurrentSharing(read);
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
						maxBytes: maxHistoryBytes - delta.activityBytes
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
	"chat.startup": (opts) => handleChatStartupRequest(opts, handleChatHistoryRequest),
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
export { handleChatHistoryRequest as n, projectPendingInputMessage as r, chatHistoryHandlers as t };
