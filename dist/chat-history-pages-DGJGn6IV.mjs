import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import { n as readLegacyCompactionMetrics } from "./legacy-compaction-history-DS8GebGO.mjs";
import { _ as captureTranscriptRedactionSnapshot } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { g as session_transcript_readers_exports } from "./session-transcript-readers-CDyCeaj9.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-CsoRu_a-.mjs";
import { l as prepareForwardedMessageCronJobNameResolver, u as projectForwardedMessages } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { r as readChatHistoryPageKernel } from "./chat-history-page-kernel-DvkJyoHR.mjs";
import os from "node:os";
//#region src/gateway/server-methods/chat-history-pages.ts
async function readChatHistoryPage(input, signal) {
	signal?.throwIfAborted();
	const binding = getCliSessionBinding(input.entry, "claude-cli");
	const params = binding?.sessionId ? {
		...input,
		cliHistoryHomeDir: process.env.HOME || os.homedir(),
		cliHistoryRedaction: captureTranscriptRedactionSnapshot()
	} : input;
	if (params.sessionId && params.storePath && (params.entry?.incognito || isIncognitoSessionKey(params.canonicalKey)) && binding?.sessionId && !params.ignoreCliSessionImports) {
		const { readProcessHeldCliHistory } = await import("./cli-session-history.process-held-BVRVcpxt.mjs");
		const page = await readProcessHeldCliHistory(params, signal);
		return {
			...page,
			messages: await refreshForwardedLabels(page.messages)
		};
	}
	if (!params.sessionId || !params.storePath || params.entry?.incognito || isIncognitoSessionKey(params.canonicalKey)) {
		const page = await readChatHistoryPageKernel(params, {
			readers: session_transcript_readers_exports,
			resolveCurrentUserProfileDisplay,
			resolveCronJobName: () => void 0
		});
		return {
			...page,
			messages: await refreshForwardedLabels(page.messages)
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-BP7n5Xql.mjs");
	return readSessionHistoryPageInWorker({
		kind: "rpc",
		params: {
			...params,
			compactionMetrics: readLegacyCompactionMetrics(params.entry),
			sessionId: params.sessionId,
			storePath: params.storePath
		}
	}, signal);
}
async function refreshForwardedLabels(messages) {
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(messages);
	return projectForwardedMessages(messages.filter((message) => asOptionalRecord(message) !== void 0), resolveCronJobName);
}
//#endregion
export { readChatHistoryPage as t };
