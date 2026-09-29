import { r as loadGatewaySessionEntry } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
//#region src/gateway/server-methods/chat-aborted-partial.ts
/** Capture before signaling cancellation, without loading asynchronous transcript writers. */
function captureAbortedPartial(params) {
	const { runId, abortOrigin } = params;
	try {
		const session = params.session ?? {
			ok: true,
			value: loadGatewaySessionEntry(params.sessionKey, params.agentId ? { agentId: params.agentId } : void 0)
		};
		if (!session.ok) throw session.error;
		const { cfg, storePath, entry, canonicalKey, agentId } = session.value;
		if (entry?.sessionId !== params.sessionId) throw new Error("Aborted partial transcript session changed before persistence");
		return {
			runId,
			abortOrigin,
			ok: true,
			value: {
				sessionKey: canonicalKey,
				sessionId: params.sessionId,
				expectedSessionId: params.sessionId,
				expectedLifecycleRevision: entry.lifecycleRevision ?? null,
				agentId,
				storePath,
				cfg,
				message: params.text,
				createIfMissing: true,
				idempotencyKey: `${runId}:assistant`,
				abortMeta: {
					aborted: true,
					origin: abortOrigin,
					runId
				}
			}
		};
	} catch (error) {
		return {
			runId,
			abortOrigin,
			ok: false,
			error
		};
	}
}
//#endregion
export { captureAbortedPartial as t };
