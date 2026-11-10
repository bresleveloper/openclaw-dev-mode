import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { i as prepareSessionHistorySubagentFacts, t as createPreparedSessionHistorySubagentProjection } from "./session-history-delta-visibility-DcmJ_4nD.mjs";
import { t as createSessionActorTranscriptReader } from "./session-transcript-memory-reader-Bxdst6P1.mjs";
import { n as projectChatHistoryWithReplies } from "./chat-history-reply-messages-Cs9kWyEM.mjs";
//#region src/gateway/cli-session-history.process-held.ts
/** Read canonical memory history from its actor while CLI matching stays in a compute worker. */
async function readProcessHeldCliHistory(params, signal, memory) {
	const result = await readProcessHeldCliHistoryQuery({
		kind: "rpc",
		params
	}, signal, memory);
	if (result.kind !== "rpc") throw new Error("Unexpected process-held history page");
	return result.page;
}
async function readProcessHeldCliHistoryMessage(params, memory) {
	const result = await readProcessHeldCliHistoryQuery({
		kind: "rpc-message",
		params
	}, void 0, memory);
	if (result.kind !== "rpc-message") throw new Error("Unexpected process-held history message");
	return result.result;
}
async function readProcessHeldCliHistoryQuery(input, signal, memory) {
	const history = structuredClone(input);
	const params = history.params;
	params.encodeResponse = false;
	if (!memory) throw new Error("Process-held history requires a memory session actor");
	if (params.entry) params.entry.incognito = true;
	const { runProcessHeldHistoryTask } = await import("./session-transcript-worker-runtime-D7sVp2qp.mjs");
	const readers = createSessionActorTranscriptReader(memory);
	const scope = {
		agentId: params.sessionAgentId,
		sessionId: params.sessionId,
		sessionKey: params.canonicalKey,
		storePath: params.storePath,
		sessionEntry: params.entry
	};
	const assertCurrent = () => {
		signal?.throwIfAborted();
		memory.assertCurrent();
	};
	const result = await runProcessHeldHistoryTask(history, async (value, { signal: requestSignal }) => {
		requestSignal.throwIfAborted();
		assertCurrent();
		const request = value;
		const readResult = request.kind === "page" ? await readers.readSessionMessagesPageWithStatsAsync(scope, request.options, requestSignal) : request.kind === "around" ? await readers.readSessionMessagesAroundIdWithStatsAsync(scope, request.options, requestSignal) : await readers.readSessionMessageByIdAsync(scope, request.messageId, request.options, requestSignal);
		requestSignal.throwIfAborted();
		if (readResult === void 0) throw new Error("Unsupported process-held history request");
		assertCurrent();
		const messages = "messages" in readResult ? readResult.messages : readResult.message === void 0 ? [] : [readResult.message];
		return {
			input: {
				result: readResult,
				facts: prepareSessionHistorySubagentFacts(readers.subagentCoordination, (recording) => {
					for (const message of messages) createChatHistoryRecoveryProjection({ subagentCoordination: recording }).append([message]);
				})
			},
			timeoutMs: 6e4
		};
	}, signal);
	assertCurrent();
	if (result.kind === "rpc-message") return result;
	const page = result.page;
	const [{ createCurrentUserProfileMessageProjector }, { resolveCurrentUserProfileDisplay }, { getUserProfileDisplay }] = await Promise.all([
		import("./chat-display-projection.core-S6a9uT7m.mjs"),
		import("./current-user-profile-display-DPTktRyW.mjs"),
		import("./user-profile-list-BX2GGzSY.mjs")
	]);
	const project = createCurrentUserProfileMessageProjector((id) => resolveCurrentUserProfileDisplay(id, getUserProfileDisplay));
	page.messages = await projectChatHistoryWithReplies(page.messages.filter((message) => Boolean(asOptionalRecord(message))), (messages) => messages.map(project));
	assertCurrent();
	return {
		kind: "rpc",
		page
	};
}
async function readProcessHeldCliHistoryInWorker(history, channel) {
	const params = history.params;
	const facts = {
		sessions: [],
		runMessages: []
	};
	let subagents = createPreparedSessionHistorySubagentProjection(facts, () => {});
	const request = async (value) => {
		const response = await channel.request(value);
		try {
			const reply = response.input;
			facts.sessions.push(...reply.facts.sessions);
			facts.runMessages.push(...reply.facts.runMessages);
			subagents = createPreparedSessionHistorySubagentProjection(facts, () => {});
			return reply.result;
		} finally {
			response.consumed();
		}
	};
	const readers = {
		subagentCoordination: {
			isSubagentSession: (key) => subagents.isSubagentSession(key),
			isSubagentRunMessage: (runId, seq) => subagents.isSubagentRunMessage(runId, seq)
		},
		readSessionMessageByIdAsync: (_scope, messageId, options) => request({
			kind: "by-id",
			messageId,
			options
		}),
		readRecentSessionMessagesWithStatsAsync: (_scope, options) => request({
			kind: "page",
			options: {
				...options,
				offset: 0
			}
		}),
		readSessionMessagesPageWithStatsAsync: (_scope, options) => request({
			kind: "page",
			options
		}),
		readSessionMessagesAroundIdWithStatsAsync: (_scope, options) => request({
			kind: "around",
			options
		})
	};
	const [{ prepareCliSessionHistoryReader, readChatHistoryMessageFromReaders }, { readChatHistoryPageKernel }] = await Promise.all([import("./cli-session-history-BFauUEBa.mjs"), import("./chat-history-page-kernel-DajE3kom.mjs")]);
	if (history.kind === "rpc-message") return {
		kind: "rpc-message",
		result: await readChatHistoryMessageFromReaders(history.params, readers)
	};
	const cli = await prepareCliSessionHistoryReader(params, readers);
	try {
		const page = await readChatHistoryPageKernel(params, {
			readers: cli?.readers ?? readers,
			deferProfileDisplay: true,
			readMessageSequence: cli?.sequence
		});
		cli?.applyPagination(page);
		return {
			kind: "rpc",
			page
		};
	} finally {
		cli?.dispose();
	}
}
//#endregion
export { readProcessHeldCliHistory, readProcessHeldCliHistoryInWorker, readProcessHeldCliHistoryMessage };
