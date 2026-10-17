import "./session-lifecycle-admission-GoxISURZ.mjs";
import { c as waitForChatAbortControllerRemoval } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-BfEknC6Y.mjs";
import { t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BC_FxZrY.mjs";
//#region src/gateway/server-worker-placement-cancel.ts
async function cancelGatewayWorkerSessionWork(context, request) {
	request.assertCurrent();
	let controllerDrain = Promise.resolve(true);
	if ((await abortChatRunsForSessionKeyWithPartials({
		context,
		ops: createChatAbortOps(context),
		sessionId: request.sessionId,
		sessionKey: request.sessionKeys[0],
		sessionKeyAliases: request.sessionKeys.slice(1),
		agentId: request.agentId,
		requester: { isAdmin: true },
		includeProtectedRuns: true,
		abortOrigin: "rpc",
		stopReason: "rpc",
		onCancellationStarted: request.onCancellationStarted,
		onControllerTargets: (targets) => {
			controllerDrain = waitForChatAbortControllerRemoval({
				entries: context.chatAbortControllers,
				targets,
				timeoutMs: 15e3
			});
		}
	})).unauthorized || !await controllerDrain) throw new Error("Session cancellation did not persist before cloud worker stop");
}
//#endregion
export { cancelGatewayWorkerSessionWork };
