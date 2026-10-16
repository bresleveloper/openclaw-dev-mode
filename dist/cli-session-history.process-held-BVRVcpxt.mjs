import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as captureNativeSessionEntryCurrentRead } from "./session-entry-current-runtime-DVR59qVq.mjs";
//#region src/gateway/cli-session-history.process-held.ts
/** Keep process-held SQLite custody on its existing owner; move matching and projection off-loop. */
async function readProcessHeldCliHistory(inputParams, signal) {
	const params = structuredClone(inputParams);
	const [{ runProcessHeldHistoryTask }, readers] = await Promise.all([import("./session-transcript-worker-runtime-CDROZSI7.mjs"), import("./session-transcript-readers-DWY9oSx4.mjs")]);
	const scope = {
		agentId: params.sessionAgentId,
		sessionId: params.sessionId,
		sessionKey: params.canonicalKey,
		storePath: params.storePath,
		sessionEntry: params.entry
	};
	const current = captureNativeSessionEntryCurrentRead(scope);
	const initial = current.readCurrent();
	if (!initial || initial.sessionId !== scope.sessionId || initial.lifecycleRevision !== params.entry?.lifecycleRevision) throw new Error("Incognito history session is no longer current");
	const assertCurrent = () => {
		signal?.throwIfAborted();
		const entry = current.readCurrent();
		if (entry?.sessionId !== initial.sessionId || entry?.lifecycleRevision !== initial.lifecycleRevision) throw new Error("Incognito history session generation is no longer current");
	};
	assertCurrent();
	const page = await runProcessHeldHistoryTask({
		...params,
		encodeResponse: false
	}, async (value) => {
		signal?.throwIfAborted();
		assertCurrent();
		const request = value;
		const input = request.kind === "page" ? await readers.readSessionMessagesPageWithStatsAsync(scope, request.options) : request.kind === "around" ? await readers.readSessionMessagesAroundIdWithStatsAsync(scope, request.options) : void 0;
		if (input === void 0) throw new Error("Unsupported process-held history request");
		assertCurrent();
		return {
			input,
			timeoutMs: 6e4
		};
	}, signal);
	assertCurrent();
	const [{ createCurrentUserProfileMessageProjector }, { resolveCurrentUserProfileDisplay }] = await Promise.all([import("./chat-display-projection.core-BermlSUA.mjs"), import("./current-user-profile-display-UVfIeOT_.mjs")]);
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	page.messages = page.messages.map((message) => {
		const record = asOptionalRecord(message);
		return record ? project(record) : message;
	});
	assertCurrent();
	return page;
}
async function readProcessHeldCliHistoryInWorker(params, channel) {
	const request = async (value) => {
		const response = await channel.request(value);
		try {
			return response.input;
		} finally {
			response.consumed();
		}
	};
	const readers = {
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
	const [{ prepareCliSessionHistoryReader }, { readChatHistoryPageKernel }] = await Promise.all([import("./cli-session-history-D2G7P_je.mjs"), import("./chat-history-page-kernel-CSHhmCUJ.mjs")]);
	const cli = await prepareCliSessionHistoryReader(params, readers);
	try {
		const page = await readChatHistoryPageKernel(params, {
			readers: cli?.readers ?? readers,
			deferProfileDisplay: true,
			readMessageSequence: cli?.sequence
		});
		cli?.applyPagination(page);
		return page;
	} finally {
		cli?.dispose();
	}
}
//#endregion
export { readProcessHeldCliHistory, readProcessHeldCliHistoryInWorker };
