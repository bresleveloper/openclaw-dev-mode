import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { r as validateAgentWaitParams } from "./src-l2dWvEsN.mjs";
import { r as isDirectSessionReadMethod } from "./session-method-policy-B_ndZirn.mjs";
import { a as resolveSessionMutationTargets, i as resolveDirectSessionTargets, o as resolveTalkSessionTargetInput } from "./session-sharing-target-read-D_4wDbBo.mjs";
import { a as waitForAgentJob, n as getAgentJobSession, r as projectAgentJobObservation, t as captureAgentJobSession } from "./agent-job-BgXCyRm3.mjs";
import { c as resolveAgentWaitSource } from "./agent-dedupe-D3IHWmWx.mjs";
//#region src/gateway/agent-turn/agent-wait.ts
function prepareAgentWaitForTurn(context, params) {
	const runId = (params.runId ?? "").trim();
	const timeoutMs = resolveNonNegativeIntegerOption(params.timeoutMs, 3e4);
	const source = resolveAgentWaitSource(context, runId);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const queuedResult = () => {
		const queued = context.chatQueuedTurns.get(runId);
		return queued ? {
			session: captureAgentJobSession({
				...queued,
				lifecycleGeneration
			}),
			result: {
				runId,
				status: "pending",
				timeoutPhase: "queue",
				providerStarted: false
			}
		} : void 0;
	};
	const queuedBeforeWait = queuedResult();
	const runContext = getAgentRunContext(runId);
	const initialSession = queuedBeforeWait?.session ?? getAgentJobSession(runId, source === "chat" ? "chat" : void 0) ?? captureAgentJobSession(runContext);
	const wait = async () => {
		if (queuedBeforeWait) return queuedBeforeWait;
		const snapshot = await waitForAgentJob({
			runId,
			timeoutMs,
			source
		});
		const queuedAfterWait = queuedResult();
		if (queuedAfterWait) return queuedAfterWait;
		if (!snapshot) return {
			result: {
				runId,
				status: "timeout"
			},
			session: captureAgentJobSession(runContext) ?? initialSession
		};
		const { session, ...result } = projectAgentJobObservation(snapshot);
		return {
			session,
			result: {
				runId,
				...result
			}
		};
	};
	return {
		session: initialSession,
		wait
	};
}
//#endregion
//#region src/gateway/session-request-targets.ts
/** Undefined means the request's complete session target set is not known. */
function resolveSessionRequestTargets(params) {
	if (params.method === "agent.wait") {
		if (!validateAgentWaitParams(params.requestParams)) return;
		const session = prepareAgentWaitForTurn(params.context, params.requestParams).session;
		return session ? [{
			sessionKey: session.sessionKey,
			agentId: session.agentId
		}] : void 0;
	}
	const request = asOptionalRecord(params.requestParams);
	if (params.method === "agent" && normalizeOptionalString(request?.sessionId) || params.method === "sessions.fork" || params.method === "sessions.move" || params.method === "sessions.create" && !normalizeOptionalString(request?.key)) return;
	const talk = resolveTalkSessionTargetInput(params.method, params.requestParams, params.connId);
	if (talk?.kind === "relay") return [{
		sessionKey: talk.target.canonicalKey,
		agentId: talk.target.agentId
	}];
	if (isDirectSessionReadMethod(params.method)) {
		const targets = resolveDirectSessionTargets(params.method, params.requestParams);
		return targets.length ? targets : void 0;
	}
	return resolveSessionMutationTargets(params);
}
//#endregion
export { prepareAgentWaitForTurn as n, resolveSessionRequestTargets as t };
