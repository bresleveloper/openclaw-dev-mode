import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as withScopedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { _ as assertTranscriptNavigationValid, d as transcriptEventNavigationSql, p as transcriptEventRunIdSql } from "./transcript-payload-Cu49oQKq.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { i as buildRunUserTurnIdempotencyKey, l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { t as readSessionTranscriptAccountingTail } from "./session-transcript-accounting-policy-C3d--qbA.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { t as readRecentTranscriptConversationText } from "./transcript-recent-text-g7xyo8QS.mjs";
import { d as readWithCanonicalSessionAdmission } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { t as resolveConversationInDatabase } from "./session-accessor.sqlite-conversation-read-C_ZuagCK.mjs";
import { t as hasSessionTranscriptEntryReceipt } from "./session-transcript-projection-facts-scope-Cx0-0Ubn.mjs";
import { i as readCurrentProjectionSnapshot, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { s as readVisibleTranscriptStats, u as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection, r as withRecentSessionTranscriptActiveEventsInSnapshot, t as readRecentSessionTranscriptMessageEventsFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7jZRDkL.mjs";
import { t as getUserProfileDisplaysNative } from "./user-profile-list.native-CFnyItI2.mjs";
import { t as aggregateSessionTranscriptUsage } from "./session-transcript-derived-readers-BsCqBl32.mjs";
import { n as createCurrentUserProfileMessageProjector } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { c as isSubagentCoordinationHistoryInput, d as projectForwardedMessages, f as readForwardedCronJobIds } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as readSessionTranscriptHistoryEventPageFromProjection, c as resolveHistoryMessageSequence, d as resolveVisibleHistoryRange, o as readTranscriptDisplayDeltaFromProjection, u as resolveVisibleHistoryProjection } from "./session-accessor.sqlite-history-query-CeElVTvK.mjs";
import { t as createSessionTranscriptReader } from "./session-transcript-read-kernel-BP5-uRDU.mjs";
import { n as resolveGatewaySessionStoreReadSources } from "./session-utils-store-sources-Ovvkh3uG.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-A6aOQAeD.mjs";
import { n as projectChatHistoryWithReplies } from "./chat-history-reply-messages-Cs9kWyEM.mjs";
import { t as listSessionReactionsInDatabase } from "./session-reaction-store.read-Bic2z8IQ.mjs";
import { t as createBoundSessionHistorySubagentSource } from "./session-history-subagent-sources-BDfI9gSX.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-history-input-visibility.ts
const inputMessageJson = (database) => sql`json_object('role', json_extract(${transcriptEventNavigationSql(database, "event")}, '$.message.role'),
    'idempotencyKey', json_extract(${transcriptEventNavigationSql(database, "event")}, '$.message.idempotencyKey'),
    'provenance', json_extract(${transcriptEventNavigationSql(database, "event")}, '$.message.provenance'),
    '__openclaw', json_object(
      'runId', ${transcriptEventRunIdSql(database, "event")},
      'steerTargetRunId', json_extract(${transcriptEventNavigationSql(database, "event")}, '$.message.__openclaw.steerTargetRunId')))`;
/** Resolve a run's hidden input and the first visible steer on its active transcript branch. */
function readSessionTranscriptRunInputVisibilityFromProjection(projection, params) {
	const db = getActiveTranscriptKysely(projection.database);
	resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	});
	const visible = resolveVisibleMessagePositions(projection);
	const keptPositions = sql`(SELECT value FROM json_each(${JSON.stringify(visible.kept)}))`;
	const userInputs = db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
		"active.message_position",
		"event.navigation_valid",
		inputMessageJson(projection.database.db).as("message_json")
	]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "<", projection.state.activeMessageCount).where((eb) => visible.kept.length > 0 ? eb.or([eb("active.message_position", ">=", visible.postStart), eb("active.message_position", "in", keptPositions)]) : eb("active.message_position", ">=", visible.postStart)).where((eb) => eb.or([eb("event.message_role", "=", "user"), eb("event.navigation_valid", "=", 0)])).$narrowType();
	let readAfter = params.previous?.scannedThroughMessagePosition;
	if (readAfter === void 0) {
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, userInputs.innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).where("identity.message_idempotency_key", "=", params.idempotencyKey).where(sql`json_extract(${transcriptEventNavigationSql(projection.database.db, "event")}, '$.message.__openclaw.steerTargetRunId')`, "is", null).limit(1));
		assertTranscriptNavigationValid(anchor?.navigation_valid);
		if (!anchor || !params.isHiddenInput(JSON.parse(anchor.message_json))) return { hidden: false };
		readAfter = anchor.message_position;
	}
	const history = resolveVisibleHistoryProjection(projection);
	const { messageEnd } = resolveVisibleHistoryRange(history, params.messageSeq - 1, params.messageSeq);
	const scannedThroughMessagePosition = messageEnd <= visible.kept.length ? visible.kept[messageEnd - 1] ?? -1 : visible.postStart + messageEnd - visible.kept.length - 1;
	const hidden = {
		hidden: true,
		scannedThroughMessageSeq: params.messageSeq,
		scannedThroughMessagePosition
	};
	const laterInputs = userInputs.where("active.message_position", ">", readAfter).where("active.message_position", "<=", scannedThroughMessagePosition).where((eb) => eb.or([eb(sql`json_extract(${transcriptEventNavigationSql(projection.database.db, "event")}, '$.message.__openclaw.steerTargetRunId')`, "=", params.runId), eb(transcriptEventRunIdSql(projection.database.db, "event"), "=", params.runId)])).orderBy("active.message_position", "asc");
	for (const row of iterateSqliteQuerySync(projection.database.db, laterInputs)) {
		assertTranscriptNavigationValid(row.navigation_valid);
		if (!params.isHiddenInput(JSON.parse(row.message_json))) {
			const firstVisibleMessageSeq = resolveHistoryMessageSequence(visible, history, row.message_position);
			return firstVisibleMessageSeq === void 0 ? { hidden: false } : {
				...hidden,
				firstVisibleMessageSeq
			};
		}
	}
	return hidden;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-binding.ts
function readSessionTranscriptBindingFromProjection(projection) {
	resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	});
	const { sessionId } = projection.resolved;
	const owner = executeSqliteQueryTakeFirstSync(projection.database.db, getNodeSqliteKysely(projection.database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", sessionId));
	if (!owner) return;
	return {
		sessionId,
		sessionKey: owner.session_key
	};
}
//#endregion
//#region src/config/sessions/session-transcript-accounting.ts
function readSessionTranscriptAccountingFromProjection(projection, params) {
	const snapshot = {};
	try {
		if (params.includeByteSize) {
			const stats = readVisibleTranscriptStats(projection);
			snapshot.byteSize = stats.sizeBytes;
			snapshot.eventCount = stats.eventCount;
		}
		if (params.includeUsage || params.includeTurnTaint) Object.assign(snapshot, withRecentSessionTranscriptActiveEventsInSnapshot(projection, 512, (visit) => readSessionTranscriptAccountingTail(visit, params)));
	} catch {
		if (params.includeTurnTaint) snapshot.turnTainted = true;
	}
	return snapshot;
}
//#endregion
//#region src/gateway/session-history-readonly-reader.ts
/** Source and run facts live only for one history operation, on its admitted database. */
function createBoundSessionHistorySubagentProjection(readSnapshot, stateDatabase, readSourceDatabases) {
	const runs = /* @__PURE__ */ new Map();
	const readSource = createBoundSessionHistorySubagentSource(readSnapshot, stateDatabase, readSourceDatabases);
	return {
		isSubagentSession: readSource,
		isSubagentRunMessage(runId, messageSeq) {
			if (messageSeq === void 0) return false;
			let visibility = runs.get(runId);
			if (!visibility || visibility.hidden && visibility.firstVisibleMessageSeq === void 0 && visibility.scannedThroughMessageSeq < messageSeq) {
				visibility = readSnapshot((projection) => readSessionTranscriptRunInputVisibilityFromProjection(projection, {
					idempotencyKey: buildRunUserTurnIdempotencyKey(runId),
					runId,
					messageSeq,
					previous: visibility?.hidden ? visibility : void 0,
					isHiddenInput: (message) => {
						const record = asOptionalRecord(message);
						return Boolean(record && isSubagentCoordinationHistoryInput(record, readSource));
					}
				}));
				runs.set(runId, visibility);
			}
			return visibility.hidden && (visibility.firstVisibleMessageSeq === void 0 || messageSeq < visibility.firstVisibleMessageSeq);
		}
	};
}
function createReadonlySessionHistoryReader(target, resolveSourceDatabases) {
	let sourceDatabases = target.sourceDatabases;
	const readDatabase = (read) => {
		const result = withScopedOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
			const entryValidationKey = target.entryValidationKey;
			if (entryValidationKey !== void 0 && !hasSessionTranscriptEntryReceipt(database, target.transcript.sessionId, entryValidationKey)) readSessionEntryRow(database, entryValidationKey);
			return read(database);
		}), target.database);
		if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
		return result.value;
	};
	const readSnapshot = (read) => {
		const result = readDatabase((database) => readCurrentProjectionSnapshot(database, {
			agentId: target.transcript.agentId,
			sessionId: target.transcript.sessionId,
			sessionKey: target.transcript.sessionKey,
			databaseAgentId: target.database.agentId,
			path: target.database.path
		}, read));
		if (result.kind === "unavailable") throw new SessionTranscriptProjectionUnavailableError(target.transcript.sessionId);
		return result.value;
	};
	const subagentCoordination = createBoundSessionHistorySubagentProjection(readSnapshot, target.stateDatabase, () => sourceDatabases ??= resolveSourceDatabases?.());
	return {
		readRecentUsage: (maxBytes) => readSnapshot((projection) => aggregateSessionTranscriptUsage(readRecentSessionTranscriptMessageEventsFromProjection(projection, {
			maxBytes,
			maxLines: 1e3,
			maxMessages: 1e3
		}).events.map(({ event }) => asOptionalRecord(event)?.message))),
		readHistoryEventPage: (options) => readSnapshot((projection) => readSessionTranscriptHistoryEventPageFromProjection(projection, options)),
		readHistoryRevision: () => readSnapshot((projection) => ({
			database: projection.database.db,
			generation: projection.generation,
			indexedSeq: projection.state.indexedSeq,
			leafEventId: projection.state.leafEventId
		})),
		readTranscriptAccounting: (options) => readSnapshot((projection) => readSessionTranscriptAccountingFromProjection(projection, options)),
		readBoundedMessageTail: (options) => readSnapshot((projection) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, options)),
		readRecentConversationText: (options) => readSnapshot((projection) => readRecentTranscriptConversationText((page) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, page), options)),
		readArtifactSummaries: async (query) => {
			const { readArtifactSummariesFromProjection } = await import("./session-artifact-read-be5ys4WR.mjs");
			return readSnapshot((projection) => readArtifactSummariesFromProjection(projection, query));
		},
		readReactions: () => readDatabase((database) => {
			if (!target.transcript.sessionKey) throw new Error("Reaction reads require a session key");
			return listSessionReactionsInDatabase(database, target.transcript.sessionKey, { sessionId: target.transcript.sessionId });
		}),
		readConversationBinding: (conversationRef) => readDatabase((database) => {
			const conversation = resolveConversationInDatabase(database, conversationRef);
			if (!conversation) return null;
			const { channel, accountId, target: address, threadId, nativeChannelId } = conversation;
			return {
				channel,
				accountId,
				target: address,
				threadId,
				nativeChannelId
			};
		}),
		readTranscriptBinding: () => readSnapshot((projection) => readSessionTranscriptBindingFromProjection(projection)),
		readTranscriptDisplayDelta: (limits) => readSnapshot((projection) => readTranscriptDisplayDeltaFromProjection(projection, limits)),
		...createSessionTranscriptReader({
			subagentCoordination,
			resolveTarget: async () => target.transcript,
			readSnapshot: async (_transcript, read) => readSnapshot(read)
		}),
		subagentCoordination
	};
}
//#endregion
//#region src/gateway/session-history-worker-reader.ts
/** Dispatch only inside the history worker's admitted database lifetime. */
async function readSessionHistoryRequest(request, readTarget) {
	const { sourceDiscovery, ...readerTarget } = readTarget;
	const options = {
		readers: createReadonlySessionHistoryReader(readerTarget, sourceDiscovery ? () => resolveGatewaySessionStoreReadSources(sourceDiscovery).sources : void 0),
		readOnly: true,
		deferProfileDisplay: true,
		resolveCronJobName: () => void 0
	};
	if (request.kind === "recent-usage") return {
		kind: "recent-usage",
		result: options.readers.readRecentUsage(request.params.maxBytes)
	};
	if (request.kind === "history-event-page") return {
		kind: "history-event-page",
		result: options.readers.readHistoryEventPage(request.params.options)
	};
	if (request.kind === "active-accounting") return {
		kind: "active-accounting",
		result: options.readers.readTranscriptAccounting(request.params.options)
	};
	if (request.kind === "bounded-tail") return {
		kind: "bounded-tail",
		result: options.readers.readBoundedMessageTail(request.params.options)
	};
	if (request.kind === "recent-text") return {
		kind: "recent-text",
		result: options.readers.readRecentConversationText(request.params.options)
	};
	if (request.kind === "summary") return {
		kind: "summary",
		result: await options.readers.readSessionTranscriptSummaryAsync(request.params.target, request.params.query)
	};
	if (request.kind === "artifacts") {
		const { selectSessionArtifacts } = await import("./session-artifact-read-be5ys4WR.mjs");
		const query = request.params.query;
		return {
			kind: "artifacts",
			result: query.kind === "list" && query.includeDownloadData === false && !query.downloadArtifactIds ? {
				kind: "list",
				artifacts: await options.readers.readArtifactSummaries(query)
			} : await selectSessionArtifacts(request.params.target, query, options.readers)
		};
	}
	if (request.kind === "message-page") return {
		kind: "message-page",
		result: await options.readers.readSessionMessagesPageWithStatsAsync(request.params.target, request.params.options)
	};
	if (request.kind === "around-id") return {
		kind: "around-id",
		result: await options.readers.readSessionMessagesAroundIdWithStatsAsync(request.params.target, request.params.options)
	};
	if (request.kind === "source-messages") return {
		kind: "source-messages",
		result: await options.readers.readSessionMessagesWithSourceAsync(request.params.target, request.params.options)
	};
	if (request.kind === "recent-page") {
		if (request.params.exactArchivePath) {
			const { ArchivedTranscriptReader } = await import("./session-transcript-archive-reader-DrA_jfON.mjs");
			return {
				kind: "recent-page",
				result: await new ArchivedTranscriptReader({
					exactArchivePath: request.params.exactArchivePath,
					sessionId: request.params.target.sessionId
				}).readRecentWithStats(request.params.options)
			};
		}
		return {
			kind: "recent-page",
			result: await options.readers.readRecentSessionMessagesWithStatsAsync(request.params.target, request.params.options)
		};
	}
	if (request.kind === "reactions") return {
		kind: "reactions",
		result: options.readers.readReactions()
	};
	if (request.kind === "conversation-binding") return {
		kind: "conversation-binding",
		result: options.readers.readConversationBinding(request.params.conversationRef)
	};
	if (request.kind === "transcript-binding") return {
		kind: "transcript-binding",
		binding: options.readers.readTranscriptBinding()
	};
	if (request.kind === "message-by-id") {
		const { target, messageId, options: lookupOptions } = request.params;
		return {
			kind: "message-by-id",
			result: await options.readers.readSessionMessageByIdAsync(target, messageId, lookupOptions)
		};
	}
	if (request.kind === "message-count") return {
		kind: "message-count",
		count: await options.readers.readSessionMessageCountAsync(request.params.target)
	};
	if (request.kind === "message-lookup") return {
		kind: "message-lookup",
		messages: await options.readers.readSessionMessagesMatchingIdAsync(request.params.target, request.params.messageId)
	};
	if (request.kind === "recent") {
		const { target, ...limits } = request.params;
		const { messages } = await options.readers.readRecentSessionMessagesWithStatsAsync(target, limits);
		return {
			kind: "recent",
			messages
		};
	}
	if (request.kind === "delta") {
		const { prepareSessionHistoryDelta } = await import("./session-history-delta-visibility-Bb72YBlf.mjs");
		return {
			kind: "delta",
			...prepareSessionHistoryDelta(options.readers.readTranscriptDisplayDelta(request.params.limits), options.readers.subagentCoordination)
		};
	}
	if (request.kind === "inline-visibility") {
		const { prepareSessionHistorySubagentFacts } = await import("./session-history-delta-visibility-Bb72YBlf.mjs");
		const { lookup } = request.params;
		return {
			kind: "inline-visibility",
			subagentCoordination: prepareSessionHistorySubagentFacts(options.readers.subagentCoordination, (recording) => lookup.kind === "session" ? recording.isSubagentSession(lookup.sessionKey) : recording.isSubagentRunMessage(lookup.runId, lookup.messageSeq))
		};
	}
	if (request.kind === "rpc-message") {
		const { readChatHistoryMessageFromReaders } = await import("./cli-session-history-BFauUEBa.mjs");
		return {
			kind: "rpc-message",
			result: await readChatHistoryMessageFromReaders(request.params, options.readers)
		};
	}
	if (request.kind === "rpc") {
		const { readChatHistoryPageKernel } = await import("./chat-history-page-kernel-DajE3kom.mjs");
		const { encodeChatHistoryResponsePage } = await import("./chat-history-response-page-TPj-5Xyi.mjs");
		const cli = getCliSessionBinding(request.params.entry, "claude-cli")?.sessionId ? await (await import("./cli-session-history-BFauUEBa.mjs")).prepareCliSessionHistoryReader(request.params, options.readers) : void 0;
		try {
			const page = await readChatHistoryPageKernel(request.params, {
				...options,
				...cli ? {
					readers: cli.readers,
					readMessageSequence: cli.sequence
				} : {}
			});
			cli?.applyPagination(page);
			const messages = page.messages.filter((message) => asOptionalRecord(message) !== void 0);
			page.messages = await projectChatHistoryWithReplies(messages, (displayMessages) => {
				const profileIds = displayMessages.flatMap((message) => {
					const identity = readTranscriptSenderIdentity(asOptionalRecord(message["__openclaw"])?.senderIdentity);
					return message.role === "user" && identity?.type === "profile" ? [identity.id] : [];
				});
				const { path, environment: env } = expectDefined(readTarget.stateDatabase, "RPC history requires its captured shared-state owner");
				const state = {
					path,
					env
				};
				const jobIds = [...new Set(readForwardedCronJobIds(displayMessages).map(toUSVString))];
				const names = jobIds.length ? withExistingOpenClawStateDatabaseReadOnly(({ db }) => readCronJobNamesInDatabase(db, jobIds, resolveCronJobsStorePath(void 0, env)), state) : void 0;
				let profiles;
				const project = createCurrentUserProfileMessageProjector((id) => resolveCurrentUserProfileDisplay(id, (senderId) => (profiles ??= getUserProfileDisplaysNative(profileIds, state)).get(senderId)));
				return projectForwardedMessages(displayMessages, (jobId) => names?.get(toUSVString(jobId))).map(project);
			});
			return {
				kind: "rpc",
				page: encodeChatHistoryResponsePage(page, request.params)
			};
		} finally {
			cli?.dispose();
		}
	}
	const { readSessionHistorySnapshotKernel } = await import("./session-history-snapshot-lB-qzyYG.mjs");
	return {
		kind: "http",
		snapshot: await readSessionHistorySnapshotKernel(request.params, options)
	};
}
//#endregion
export { readSessionHistoryRequest };
