import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as getUserProfileDisplays } from "./user-profile-list-CtETKur7.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import { l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-CsoRu_a-.mjs";
import { d as readForwardedCronJobIds, u as projectForwardedMessages } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { n as createCurrentUserProfileMessageProjector } from "./chat-display-projection.core-BSNrSH5r.mjs";
import { t as readCronJobNamesInDatabase } from "./job-name.kernel-Cdg79CvF.mjs";
import { r as resolveGatewaySessionStoreReadSources } from "./session-utils-store-sources-BQA0mPmY.mjs";
import { n as createReadonlySessionHistoryReader } from "./session-history-readonly-reader-BdpYrQoe.mjs";
import { toUSVString } from "node:util";
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
	if (request.kind === "active-accounting") return {
		kind: "active-accounting",
		result: options.readers.readTranscriptAccounting(request.params.options)
	};
	if (request.kind === "bounded-tail") return {
		kind: "bounded-tail",
		result: options.readers.readBoundedMessageTail(request.params.options)
	};
	if (request.kind === "summary") return {
		kind: "summary",
		result: await options.readers.readSessionTranscriptSummaryAsync(request.params.target, request.params.query)
	};
	if (request.kind === "artifacts") {
		const { selectSessionArtifacts } = await import("./session-artifact-read-DaAPMdpM.mjs");
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
			const { ArchivedTranscriptReader } = await import("./session-transcript-archive-reader-xOt7YOu5.mjs");
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
		const { prepareSessionHistoryDelta } = await import("./session-history-delta-visibility-mK-F6G3x.mjs");
		return {
			kind: "delta",
			...prepareSessionHistoryDelta(options.readers.readTranscriptDisplayDelta(request.params.limits), options.readers.subagentCoordination)
		};
	}
	if (request.kind === "inline-visibility") {
		const { prepareSessionHistorySubagentFacts } = await import("./session-history-delta-visibility-mK-F6G3x.mjs");
		const { lookup } = request.params;
		return {
			kind: "inline-visibility",
			subagentCoordination: prepareSessionHistorySubagentFacts(options.readers.subagentCoordination, (recording) => lookup.kind === "session" ? recording.isSubagentSession(lookup.sessionKey) : recording.isSubagentRunMessage(lookup.runId, lookup.messageSeq))
		};
	}
	if (request.kind === "rpc") {
		const { readChatHistoryPageKernel } = await import("./chat-history-page-kernel-CSHhmCUJ.mjs");
		const { encodeChatHistoryResponsePage } = await import("./chat-history-response-page-fKVbbSAu.mjs");
		const cli = getCliSessionBinding(request.params.entry, "claude-cli")?.sessionId ? await (await import("./cli-session-history-DQZcnMXy.mjs")).prepareCliSessionHistoryReader(request.params, options.readers) : void 0;
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
			const profileIds = messages.flatMap((message) => {
				const identity = readTranscriptSenderIdentity(asOptionalRecord(message["__openclaw"])?.senderIdentity);
				return message.role === "user" && identity?.type === "profile" ? [identity.id] : [];
			});
			const { path, environment: env } = expectDefined(readTarget.stateDatabase, "RPC history requires its captured shared-state owner");
			const state = {
				path,
				env
			};
			const jobIds = [...new Set(readForwardedCronJobIds(messages).map(toUSVString))];
			const names = jobIds.length ? withExistingOpenClawStateDatabaseReadOnly(({ db }) => readCronJobNamesInDatabase(db, jobIds, resolveCronJobsStorePath(void 0, env)), state) : void 0;
			let profiles;
			const project = createCurrentUserProfileMessageProjector((id) => resolveCurrentUserProfileDisplay(id, (senderId) => (profiles ??= getUserProfileDisplays(profileIds, state)).get(senderId)));
			page.messages = projectForwardedMessages(messages, (jobId) => names?.get(toUSVString(jobId))).map(project);
			return {
				kind: "rpc",
				page: encodeChatHistoryResponsePage(page, request.params)
			};
		} finally {
			cli?.dispose();
		}
	}
	const { readSessionHistorySnapshotKernel } = await import("./session-history-snapshot-CzIvW-DJ.mjs");
	return {
		kind: "http",
		snapshot: await readSessionHistorySnapshotKernel(request.params, options)
	};
}
//#endregion
export { readSessionHistoryRequest };
