import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as getAcpSessionManager } from "./manager-Cge77N9B.mjs";
import { n as readAcpSessionEntryAsync } from "./session-meta-read-C9RqVGp2.mjs";
import "./session-meta-DC-FqIqd.mjs";
import { t as notifyPreparedAgentRunStart } from "./agent-run-start-T-2AGtR3.mjs";
import { a as listSessionBindingsBySessionAsync, t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
//#region src/auto-reply/reply/dispatch-acp-manager.runtime.ts
/** Runtime ACP manager dependencies and stale-binding cleanup used by reply dispatch. */
const ACP_STALE_BINDING_UNBIND_REASON = "acp-session-init-failed";
/** Prepare transcript evidence before offering synchronous reply completion ownership. */
async function prepareAcpDispatchStart(params) {
	const { agentId, sessionKey, storePath } = params.scope;
	const transcriptStart = (params.onPreparedAgentRunStart || params.onAgentRunStart) && params.sessionId ? await (await import("./session-transcript-watermark-ozUZ3MiQ.mjs")).readSessionTranscriptStartAsync({
		agentId,
		sessionKey,
		storePath,
		sessionId: params.sessionId
	}) : null;
	return () => {
		const owner = notifyPreparedAgentRunStart(params, {
			runId: params.runId,
			options: {
				completionSource: "reply-dispatch",
				getResult: params.getResult
			},
			transcriptStart
		});
		return owner === "reply-dispatch" ? owner : void 0;
	};
}
async function maybeUnbindStaleBoundConversations(params) {
	if (params.error.code !== "ACP_SESSION_INIT_FAILED" || !/(ACP (session )?metadata is missing|missing ACP metadata|Session is not ACP-enabled|Resource not found)/i.test(params.error.message)) return;
	try {
		const removed = await getSessionBindingService().unbind({
			targetSessionKey: params.targetSessionKey,
			reason: ACP_STALE_BINDING_UNBIND_REASON
		});
		if (removed.length > 0) logVerbose(`dispatch-acp: removed ${removed.length} stale bound conversation(s) for ${params.targetSessionKey} after ${params.error.code}: ${params.error.message}`);
	} catch (error) {
		logVerbose(`dispatch-acp: failed to unbind stale bound conversations for ${params.targetSessionKey}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { getAcpSessionManager, listSessionBindingsBySessionAsync, maybeUnbindStaleBoundConversations, prepareAcpDispatchStart, readAcpSessionEntryAsync };
