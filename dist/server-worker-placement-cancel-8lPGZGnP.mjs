import "./session-lifecycle-admission-Pys9TN37.mjs";
import { h as waitForChatAbortControllerRemoval } from "./chat-abort-D7PkkSq8.mjs";
import { t as createChatAbortOps } from "./chat-abort-ops-lFr576Vk.mjs";
import { t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-Cz3MuHdA.mjs";
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
