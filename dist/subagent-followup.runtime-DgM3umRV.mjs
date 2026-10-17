import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import "./backoff-BrzXG7iD.mjs";
import { a as isSilentReplyPayloadText, r as SILENT_REPLY_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-BjLIgeQc.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-5-3wumVL.mjs";
import { r as isRetainedUnendedSubagentRun } from "./subagent-run-liveness-C7bJPLJU.mjs";
import { r as selectDeliverableSessionsReply, t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DSDgX1aR.mjs";
import { a as waitForAgentRunsToDrain, n as readLatestAssistantReply } from "./run-wait-pG6WvChs.mjs";
import { n as listDescendantRunsForRequester, t as hasUnsettledCronDescendants } from "./run-subagent-registry.runtime-DUauyftb.mjs";
import "./delivery-subagent-registry.runtime-BUSGoHAm.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BBePQpRw.mjs";
//#region src/cron/isolated-agent/subagent-followup.ts
async function readDescendantSubagentFallbackReply(params) {
	const descendants = (await listDescendantRunsForRequester(params.sessionKey)).filter((entry) => typeof entry.execution.endedAt === "number" && entry.execution.endedAt >= params.runStartedAt && entry.childSessionKey.trim().length > 0);
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
	return replies.length ? replies.join("\n\n") : void 0;
}
/**
* Settles a spawn-only handoff on its descendants' own results. Nothing resumes a cron
* parent that only handed off (#135318), so there is no parent synthesis to wait for.
* Undefined when descendants did not settle in time; explicit child silence settles as
* SILENT_REPLY_TOKEN.
*/
async function waitForDescendantSubagentResult(params) {
	await waitForDescendantSubagentSummary({
		...params,
		observedActiveDescendants: true,
		awaitParentSynthesis: false
	});
	if (params.abortSignal?.aborted || await hasUnsettledCronDescendants(params.sessionKey)) return;
	const reply = await readDescendantSubagentFallbackReply(params);
	if (reply) return { reply };
	const ended = (await listDescendantRunsForRequester(params.sessionKey)).filter((entry) => typeof entry.execution.endedAt === "number" && entry.execution.endedAt >= params.runStartedAt);
	return { reply: ended.length > 0 && ended.every((entry) => entry.execution.outcome?.status === "ok" && entry.completion?.terminalReply?.disposition === "silent") ? SILENT_REPLY_TOKEN : void 0 };
}
/**
* Waits for descendant subagents to complete using a push-based approach:
* running descendants use `agent.wait`; registry settlement spans yielded
* tasks, successor admission, and completion delivery between executions.
* Only after settlement does the synthesis grace period begin.
*/
async function waitForDescendantSubagentSummary(params) {
	const fastTestMode = isFastTestRuntimeEnv();
	const timings = {
		waitMinMs: fastTestMode ? 10 : 3e4,
		finalReplyGraceMs: fastTestMode ? 50 : 5e3,
		gracePollMs: fastTestMode ? 8 : 200
	};
	const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const initialReply = params.initialReply?.trim();
	const deadline = Date.now() + Math.max(timings.waitMinMs, Math.floor(params.timeoutMs));
	const callGateway = (request) => requestGateway({
		...request,
		signal: params.abortSignal,
		timeoutMs: Math.min(request.timeoutMs ?? Infinity, Math.max(1, deadline - Date.now()))
	});
	const getActiveRuns = async () => {
		if (params.abortSignal?.aborted) return [];
		const runs = await listDescendantRunsForRequester(params.sessionKey);
		return params.abortSignal?.aborted ? [] : runs.filter((entry) => isRetainedUnendedSubagentRun(entry));
	};
	let initialActiveRuns;
	let sawPendingDescendants;
	try {
		initialActiveRuns = await getActiveRuns();
		if (params.abortSignal?.aborted) return;
		sawPendingDescendants = params.observedActiveDescendants === true || initialActiveRuns.length > 0 || await hasUnsettledCronDescendants(params.sessionKey);
	} catch (error) {
		if (params.abortSignal?.aborted) return;
		throw error;
	}
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
				getPendingRunIds: async () => (await getActiveRuns()).map((entry) => entry.runId)
			});
			if (!await hasUnsettledCronDescendants(params.sessionKey)) break;
			await sleepWithAbort(Math.min(timings.gracePollMs, Math.max(0, deadline - Date.now())), params.abortSignal);
			pendingRunIds = (await getActiveRuns()).map((entry) => entry.runId);
		}
		if (params.abortSignal?.aborted || await hasUnsettledCronDescendants(params.sessionKey) || params.awaitParentSynthesis === false) return;
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
		return await resolveUsableLatestReply();
	} catch (error) {
		if (params.abortSignal?.aborted || Date.now() >= deadline) return;
		throw error;
	}
}
//#endregion
export { readDescendantSubagentFallbackReply, waitForDescendantSubagentResult, waitForDescendantSubagentSummary };
