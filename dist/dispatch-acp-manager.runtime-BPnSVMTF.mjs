import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as getAcpSessionManager } from "./manager-C_nqljdC.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as readAcpSessionEntry } from "./session-meta-BxRb6CVY.mjs";
//#region src/auto-reply/reply/dispatch-acp-manager.runtime.ts
/** Runtime ACP manager dependencies and stale-binding cleanup used by reply dispatch. */
const ACP_STALE_BINDING_UNBIND_REASON = "acp-session-init-failed";
function isStaleSessionInitError(params) {
	if (params.code !== "ACP_SESSION_INIT_FAILED") return false;
	return /(ACP (session )?metadata is missing|missing ACP metadata|Session is not ACP-enabled|Resource not found)/i.test(params.message);
}
async function maybeUnbindStaleBoundConversations(params) {
	if (!isStaleSessionInitError(params.error)) return;
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
export { getAcpSessionManager, getSessionBindingService, maybeUnbindStaleBoundConversations, readAcpSessionEntry };
