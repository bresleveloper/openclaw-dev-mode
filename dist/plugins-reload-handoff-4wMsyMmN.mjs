import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { d as withExecRequestOwners, f as withExecRequestTurn, s as execRequestAbortSignal } from "./exec-request-context-CWnK9ayt.mjs";
import { a as isInternalRouteContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { o as prepareSessionEventTargetForHost, r as captureSessionEventTargetForHost } from "./session-event-handoff-BLWR3ywE.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-BofcG96e.mjs";
import { z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { n as getAgentToolExecutionContext } from "./tool-execution-context-BwYF5HLu.mjs";
import { o as captureOperatorToolGatewayRequestContinuationContext } from "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/tools/plugins-reload-handoff.ts
const log = createSubsystemLogger("plugins/reload-handoff");
const pending = /* @__PURE__ */ new WeakSet();
/** The reply owner releases the turn; the ordinary reload owner still drains physical leases. */
async function handoffPluginReload(params) {
	if (getAgentToolExecutionContext()?.hasUnobservedAsyncToolResults) return jsonResult({
		status: "deferred",
		message: "Read earlier async results before handing off the reload."
	});
	const caller = getGatewayToolCallerIdentity();
	const operation = params.sessionId ? resolveReplyRunForCurrentSessionId(params.sessionId) : void 0;
	if (!caller || !params.onYield || !operation?.ownerSettlement) throw new ToolInputError("reloadAndResume requires an active Gateway conversation with turn yielding.");
	if (pending.has(operation)) throw new ToolInputError("This turn already handed off a plugin reload.");
	pending.add(operation);
	let continuation = void 0;
	try {
		continuation = await captureOperatorToolGatewayRequestContinuationContext({
			agentId: caller.agentId,
			sessionKey: caller.sessionKey
		}, {
			method: "plugins.reload",
			params: params.request
		});
		if (!continuation) throw new ToolInputError("reloadAndResume requires its admitted Gateway.");
		const target = await captureSessionEventTargetForHost(caller.agentId, caller.sessionKey);
		if (target.sessionId !== params.sessionId) throw new ToolInputError("The reload requester session changed before handoff.");
		const resumeRoute = isInternalRouteContext({ channel: caller.turnSourceChannel }) && (!caller.turnSourceTo || caller.turnSourceTo === caller.sessionKey) && target.deliveryContext?.channel ? { channel: INTERNAL_MESSAGE_CHANNEL } : void 0;
		continuation.assertCurrent();
		operation.abortSignal.throwIfAborted();
		params.signal?.throwIfAborted();
		await params.onYield("Plugin reload handed off; resume with its result in this same conversation.");
		const retained = continuation;
		runOutsidePreparedModelRuntimePluginGenerationScope(() => runWithGatewayDetachedWorkContinuation(() => withExecRequestTurn({
			identity: {
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: caller.sessionKey,
				agentId: caller.agentId
			},
			owners: params.requestOwners
		}, async () => {
			const signal = execRequestAbortSignal(params.requestOwners, operation.abortSignal) ?? operation.abortSignal;
			try {
				await operation.ownerSettlement;
				if (signal.aborted) return;
				let result;
				try {
					const destination = await prepareSessionEventTargetForHost(target);
					try {
						result = await retained.dispatch({
							assertCurrent: destination.assertCurrent,
							signal: AbortSignal.any([retained.signal, signal])
						});
					} finally {
						destination.release();
					}
				} catch (error) {
					result = {
						ok: false,
						error: formatErrorMessage(error),
						...error instanceof GatewayClientRequestError ? {
							code: error.gatewayCode,
							details: error.details
						} : {}
					};
				}
				if (signal.aborted) return;
				const receipt = await retained.enqueueSessionEvent("Plugin reload result: " + params.formatResult(result) + "\nContinue the original task in this conversation. Do not repeat a completed reload.", withExecRequestOwners({
					agentId: caller.agentId,
					sessionKey: caller.sessionKey,
					source: "plugin",
					contextKey: "plugin-reload:" + randomUUID(),
					expectedTarget: target,
					...resumeRoute ? { deliveryContext: resumeRoute } : {},
					assertCurrent: retained.assertCurrent,
					abortSignal: signal
				}, params.requestOwners));
				const accepted = await receipt.accepted;
				if (!accepted.ok) throw new Error(accepted.error);
				const outcome = await receipt.settled;
				if (outcome.status === "failed") throw new Error(outcome.error ?? "Plugin reload resume failed");
			} finally {
				retained.release();
			}
		}), "plugins:reload-handoff")).catch((error) => log.error("Plugin reload handoff failed: " + formatErrorMessage(error))).finally(() => retained.release());
		return jsonResult({
			status: "started",
			async: true,
			yielded: true,
			message: "Reload will run after turn cleanup; its result will resume this session."
		});
	} catch (error) {
		pending.delete(operation);
		continuation?.release();
		throw error;
	}
}
//#endregion
export { handoffPluginReload };
