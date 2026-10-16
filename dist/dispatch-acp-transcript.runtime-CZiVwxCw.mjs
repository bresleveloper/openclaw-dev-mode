import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as resolveAcpSessionCwd } from "./session-identifiers-Bm1zQpah.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { t as persistAcpTurnTranscript } from "./transcript-persistence-DPUIrneb.mjs";
//#region src/auto-reply/reply/dispatch-acp-transcript.runtime.ts
async function persistAcpDispatchTranscript(params) {
	const promptText = params.promptText.trim();
	const finalText = params.finalText.trim();
	if (!promptText && !finalText) return;
	const sessionAgentId = params.agentId;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: sessionAgentId });
	const sessionEntry = loadSessionEntryReadOnly({
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		storePath
	});
	const sessionId = sessionEntry?.sessionId;
	if (!sessionId) throw new Error(`unknown ACP session key: ${params.sessionKey}`);
	if (params.expectedSessionId && sessionId !== params.expectedSessionId) throw new Error("ACP transcript session changed before the turn could be persisted.");
	const result = await persistAcpTurnTranscript({
		body: promptText,
		transcriptBody: promptText,
		finalText,
		terminalOutcome: params.terminalOutcome,
		sessionId,
		expectedSessionId: params.expectedSessionId,
		sessionKey: params.sessionKey,
		sessionEntry,
		storePath,
		sessionAgentId,
		threadId: params.threadId,
		sessionCwd: resolveAcpSessionCwd(params.meta) ?? process.cwd(),
		config: params.cfg,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage,
		assistantIdempotencyKey: params.assistantIdempotencyKey
	});
	if (result.kind === "session-rebound") throw new Error("ACP transcript session changed before the turn could be persisted.");
	return result.assistantTranscript && params.assistantIdempotencyKey ? {
		agentId: sessionAgentId,
		sessionId,
		sessionKey: params.sessionKey,
		storePath,
		messageId: result.assistantTranscript.messageId,
		anchor: result.assistantTranscript.anchor,
		idempotencyKey: params.assistantIdempotencyKey
	} : void 0;
}
//#endregion
export { persistAcpDispatchTranscript };
