import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import { a as selectDeliverableSessionsReply } from "./sessions-send-tokens-Dy3kgMtK.mjs";
import "./backoff-CszdOMiF.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-vWflpIwS.mjs";
import { r as isRetainedUnendedSubagentRun } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { c as hasDescendantRunAwaitingSettle, d as listDescendantRunsForRequester } from "./subagent-registry-read-C2SIiLpb.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-DZ9VbywH.mjs";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DdiIlFMt.mjs";
import { a as waitForAgentRunsToDrain, n as readLatestAssistantReply } from "./run-wait-Yo8XK98v.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BWIIEDjt.mjs";
//#region src/cron/isolated-agent/subagent-followup.ts
/** Reads or waits for descendant subagent summaries after isolated cron orchestration. */
function resolveCronSubagentTimings() {
	const fastTestMode = isFastTestRuntimeEnv();
	return {
		waitMinMs: fastTestMode ? 10 : 3e4,
		finalReplyGraceMs: fastTestMode ? 50 : 5e3,
		gracePollMs: fastTestMode ? 8 : 200
	};
}
/** Reads completed descendant subagent replies when the orchestrator only emitted interim text. */
async function readDescendantSubagentFallbackReply(params) {
	const descendants = listDescendantRunsForRequester(params.sessionKey).filter((entry) => typeof entry.execution.endedAt === "number" && entry.execution.endedAt >= params.runStartedAt && entry.childSessionKey.trim().length > 0);
	if (descendants.length === 0) return;
	const callGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const replies = [];
	const latestRuns = descendants.toSorted((a, b) => (a.execution.endedAt ?? 0) - (b.execution.endedAt ?? 0)).slice(-4);
	for (const entry of latestRuns) {
		const completionReply = resolveSubagentCompletionResultText(entry);
		const reply = entry.completion?.terminalReply === void 0 && entry.execution.transcriptTarget === void 0 ? selectDeliverableSessionsReply(await readLatestAssistantReply({
			sessionKey: entry.childSessionKey,
			callGateway
		}), completionReply) : completionReply;
		if (!reply || reply.toUpperCase() === "NO_REPLY".toUpperCase()) continue;
		replies.push(reply);
	}
	if (replies.length === 0) return;
	if (replies.length === 1) return replies[0];
	return replies.join("\n\n");
}
/**
* Waits for descendant subagents to complete using a push-based approach:
* running descendants use `agent.wait`; registry settlement spans yielded
* tasks, successor admission, and completion delivery between executions.
* Only after settlement does the synthesis grace period begin.
*/
async function waitForDescendantSubagentSummary(params) {
	const timings = resolveCronSubagentTimings();
	const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const initialReply = params.initialReply?.trim();
	const deadline = Date.now() + Math.max(timings.waitMinMs, Math.floor(params.timeoutMs));
	const callGateway = (request) => requestGateway({
		...request,
		signal: params.abortSignal,
		timeoutMs: Math.min(request.timeoutMs ?? Infinity, Math.max(1, deadline - Date.now()))
	});
	const getActiveRuns = () => params.abortSignal?.aborted ? [] : listDescendantRunsForRequester(params.sessionKey).filter((entry) => isRetainedUnendedSubagentRun(entry));
	const initialActiveRuns = getActiveRuns();
	const sawPendingDescendants = params.observedActiveDescendants === true || initialActiveRuns.length > 0 || hasDescendantRunAwaitingSettle(params.sessionKey);
	if (params.abortSignal?.aborted) return;
	if (!sawPendingDescendants) return initialReply;
	try {
		const initialParentReply = (await readLatestAssistantReply({
			sessionKey: params.sessionKey,
			callGateway
		}))?.trim();
		let pendingRunIds = initialActiveRuns.map((entry) => entry.runId);
		while (Date.now() < deadline && !params.abortSignal?.aborted) {
			await waitForAgentRunsToDrain({
				deadlineAtMs: deadline,
				callGateway,
				initialPendingRunIds: pendingRunIds,
				getPendingRunIds: () => getActiveRuns().map((entry) => entry.runId)
			});
			if (!hasDescendantRunAwaitingSettle(params.sessionKey)) break;
			await sleepWithAbort(Math.min(timings.gracePollMs, Math.max(0, deadline - Date.now())), params.abortSignal);
			pendingRunIds = getActiveRuns().map((entry) => entry.runId);
		}
		if (params.abortSignal?.aborted || hasDescendantRunAwaitingSettle(params.sessionKey)) return;
		const gracePeriodDeadline = Math.min(Date.now() + timings.finalReplyGraceMs, deadline);
		const resolveUsableLatestReply = async () => {
			const latest = (await readLatestAssistantReply({
				sessionKey: params.sessionKey,
				callGateway
			}))?.trim();
			if (latest && latest.toUpperCase() !== "NO_REPLY".toUpperCase() && !stripHeartbeatToken(latest, {
				mode: "heartbeat",
				maxAckChars: 0
			}).shouldSkip && !isSilentReplyPayloadText(latest, "HEARTBEAT_OK") && (latest !== initialParentReply || !isLikelyInterimCronMessage(latest))) return latest;
		};
		while (Date.now() < gracePeriodDeadline) {
			const latest = await resolveUsableLatestReply();
			if (latest) return latest;
			await sleepWithAbort(Math.min(timings.gracePollMs, gracePeriodDeadline - Date.now()), params.abortSignal);
		}
		const latest = await resolveUsableLatestReply();
		if (latest) return latest;
		return;
	} catch (error) {
		if (params.abortSignal?.aborted || Date.now() >= deadline) return;
		throw error;
	}
}
//#endregion
export { readDescendantSubagentFallbackReply, waitForDescendantSubagentSummary };
