import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { r as isAnnounceSkip } from "./sessions-send-tokens-Dy3kgMtK.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { g as shouldIgnorePostCompletionAnnounceForSession, h as resolveRequesterForChildSession, i as countPendingDescendantRuns, o as getLatestSubagentRunByChildSessionKey, p as listSubagentRunsForRequester, u as isSubagentSessionRunActive } from "./subagent-registry-read-C2SIiLpb.mjs";
import { t as INTERNAL_PROVENANCE_SOURCE_CHANNEL } from "./input-provenance-C4tQegGN.mjs";
import { I as waitForEmbeddedAgentRunEnd, d as isEmbeddedAgentRunActive } from "./runs-Cjzxx3Pg.mjs";
import { c as getSubagentDepthFromSessionStore } from "./subagent-capabilities-CXh51XLK.mjs";
import { n as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-kZUX_Us7.mjs";
import { F as buildAnnounceIdempotencyKey, P as buildAnnounceIdFromChildRun } from "./subagent-completion-admission.store-S2mDR3VB.mjs";
import { a as terminateAcceptedCollectorRun, h as deleteSubagentSessionForCleanup } from "./subagent-spawn-cleanup-_oHFrRkj.mjs";
import { a as filterCurrentDirectChildCompletionRows, c as readSubagentOutput, d as waitForSubagentRunOutcome, i as dedupeLatestChildCompletionRows, l as readSubagentRunAnnounceResult, n as buildCompactAnnounceStatsLine, o as readChildCompletionFindings, s as readLatestSubagentOutputWithRetry, t as applySubagentWaitOutcome, u as readSubagentTimeoutProgress } from "./subagent-announce-output-C6EH9yFL.mjs";
import { t as callSubagentLifecycleGateway } from "./subagent-announce.runtime.js";
import { i as formatAgentInternalEventsForPrompt } from "./internal-events-CfvyIQfQ.mjs";
import { o as SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION, s as SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION } from "./subagent-completion-delivery-BBzygnla.mjs";
import { a as loadRequesterSessionEntry, c as runAnnounceDeliveryWithRetry, i as resolveSubagentCompletionOrigin, o as loadSessionEntryByKey, r as resolveAnnounceOrigin, s as resolveSubagentAnnounceTimeoutMs, t as deliverSubagentAnnouncement } from "./subagent-announce-delivery-DmYtEKbx.mjs";
//#region src/agents/subagents/announce/subagent-announce-descendant-wake.ts
const WAKE_RUN_SUFFIX = ":wake";
function stripWakeRunSuffixes(runId) {
	let next = runId.trim();
	while (next.endsWith(WAKE_RUN_SUFFIX)) next = next.slice(0, -5);
	return next || runId.trim();
}
function isWakeContinuation(runId) {
	const trimmed = runId.trim();
	if (!trimmed) return false;
	return stripWakeRunSuffixes(trimmed) !== trimmed;
}
function buildDescendantWakeMessage(params) {
	return [
		"[Subagent Context] Your prior run ended while waiting for descendant subagent completions.",
		"[Subagent Context] All pending descendants for that run have now settled.",
		"[Subagent Context] Continue your workflow using these results. Spawn more subagents if needed, otherwise send your final answer.",
		"",
		`Task: ${params.taskLabel}`,
		"",
		params.findings
	].join("\n");
}
async function runDescendantWake(params) {
	if (params.signal?.aborted || !params.isChildSessionEffectsAllowed() || isWakeContinuation(params.runId)) return false;
	const childEntry = loadSessionEntryByKey(params.childSessionKey);
	if (!params.hasUsableSessionEntry(childEntry)) return false;
	const cfg = params.deps.getRuntimeConfig();
	const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(cfg);
	const wakeLifecycleGeneration = getAgentEventLifecycleGeneration();
	const wakeMessage = buildDescendantWakeMessage({
		findings: params.findings,
		taskLabel: params.taskLabel
	});
	let wakeRunId;
	try {
		const wakeResponse = await runAnnounceDeliveryWithRetry({
			operation: "descendant wake agent call",
			signal: params.signal,
			isAttemptAllowed: params.isChildSessionEffectsAllowed,
			run: async () => {
				return await params.deps.dispatchGatewayMethodInProcess("agent", {
					sessionKey: params.childSessionKey,
					message: wakeMessage,
					deliver: false,
					timeout: params.runTimeoutSeconds ?? 0,
					inputProvenance: {
						kind: "inter_session",
						sourceSessionKey: params.childSessionKey,
						sourceChannel: INTERNAL_PROVENANCE_SOURCE_CHANNEL,
						sourceTool: "subagent_announce"
					},
					idempotencyKey: buildAnnounceIdempotencyKey(`${params.announceId}:wake`)
				}, {
					cancelOnDeadline: true,
					operatorRoleActor: { kind: "system" },
					signal: params.signal,
					timeoutMs: announceTimeoutMs,
					resolveGatewayContext: params.resolveGatewayContext
				});
			}
		});
		wakeRunId = normalizeOptionalString(wakeResponse?.runId) ?? "";
	} catch {
		return false;
	}
	if (!wakeRunId) return false;
	const terminateUnownedWake = async () => {
		await terminateAcceptedCollectorRun({
			childSessionKey: params.childSessionKey,
			gatewayRunId: wakeRunId,
			expectedSessionId: typeof childEntry.sessionId === "string" ? childEntry.sessionId.trim() || void 0 : void 0,
			expectedLifecycleRevision: typeof childEntry.lifecycleRevision === "string" ? childEntry.lifecycleRevision.trim() || void 0 : void 0,
			timeoutMs: announceTimeoutMs,
			callGateway: params.deps.callGateway
		});
	};
	if (!params.isChildSessionEffectsAllowed()) {
		await terminateUnownedWake();
		return false;
	}
	const replaced = params.deps.replaceSubagentRunAfterSteer({
		previousRunId: params.runId,
		nextRunId: wakeRunId,
		lifecycleGeneration: wakeLifecycleGeneration,
		preserveFrozenResultFallback: true,
		task: wakeMessage
	});
	if (!replaced) await terminateUnownedWake();
	return replaced;
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.ts
/**
* Subagent completion announcement coordinator.
*
* Captures child output, applies wait outcomes, routes announcements, and performs cleanup decisions.
*/
const subagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./subagent-registry-runtime-tAEgtphf.mjs"));
function loadSubagentRegistryRuntime() {
	return subagentRegistryRuntimeLoader.load();
}
function buildAnnounceReplyInstruction(params) {
	const modelRouteInstruction = !params.modelRouteChange ? "" : params.preserveModelRouteNotice ? " Preserve any runtime-authored model-route change notice in your update." : " Keep runtime-authored model-route change notices internal on this shared surface.";
	if (params.completionTarget === "parent") return SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION;
	if (params.requesterIsSubagent) return `Convert this completion into a concise internal orchestration update for your parent agent in your own words.${modelRouteInstruction} Keep this internal context private (don't mention system/log/stats/session details or announce type). If this result is duplicate or no update is needed, reply ONLY: ${SILENT_REPLY_TOKEN}.`;
	if (params.expectsCompletionMessage) return `A completed ${params.announceType} is ready for parent review. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION}${modelRouteInstruction} Otherwise send a truthful user-facing update. Keep this internal context private (don't mention system/log/stats/session details or announce type). Reply ONLY: ${SILENT_REPLY_TOKEN} only when this exact result is already visible to the user in this same turn.`;
	return `A completed ${params.announceType} is ready for parent review. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION}${modelRouteInstruction} Otherwise send a truthful user-facing update. Keep this internal context private (don't mention system/log/stats/session details or announce type), and do not copy the internal event text verbatim. Reply ONLY: ${SILENT_REPLY_TOKEN} if this exact result was already delivered to the user in this same turn.`;
}
function buildAnnounceSteerMessage(events) {
	return formatAgentInternalEventsForPrompt(events) || "A background task finished. Process the completion update now.";
}
function hasUsableSessionEntry(entry) {
	if (!isRecord(entry)) return false;
	const sessionId = entry.sessionId;
	return typeof sessionId !== "string" || sessionId.trim() !== "";
}
function stripAndClassifyReply(text) {
	let result = text;
	let didStrip = false;
	const hasLeadingSilentToken = startsWithSilentToken(result, SILENT_REPLY_TOKEN);
	if (hasLeadingSilentToken) {
		result = stripLeadingSilentToken(result, SILENT_REPLY_TOKEN);
		didStrip = true;
	}
	if (hasLeadingSilentToken || result.toLowerCase().includes("NO_REPLY".toLowerCase())) {
		result = stripSilentToken(result, SILENT_REPLY_TOKEN);
		didStrip = true;
	}
	if (didStrip && (!result.trim() || isSilentReplyText(result, "NO_REPLY") || isAnnounceSkip(result))) return null;
	return result;
}
async function runSubagentAnnounceFlow(params) {
	return await (params.resolveGatewayContext ? withPluginRuntimeGatewayContextResolver(params.resolveGatewayContext, () => runSubagentAnnounceFlowBound(params)) : runSubagentAnnounceFlowBound(params));
}
async function runSubagentAnnounceFlowBound(params) {
	let announceOutcome = "retryable";
	const expectsCompletionMessage = params.expectsCompletionMessage === true;
	const announceType = params.announceType ?? "subagent task";
	let shouldDeleteChildSession = params.cleanup === "delete";
	const childSessionEffectsAllowed = () => params.suppressChildSessionEffects !== true && params.isChildSessionEffectsAllowed?.() !== false;
	let isOwnResultCurrent = () => true;
	let isChildResultsCurrent = () => true;
	const completionDeliveryAllowed = () => params.isCompletionDeliveryAllowed?.() !== false && isOwnResultCurrent() && isChildResultsCurrent();
	let childSessionId;
	let childSessionLifecycleRevision;
	try {
		let targetRequesterSessionKey = params.requesterSessionKey;
		let targetRequesterAgentId = params.requesterAgentId;
		let targetRequesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
		const childSessionEntry = !childSessionEffectsAllowed() ? void 0 : loadSessionEntryByKey(params.childSessionKey);
		childSessionId = typeof childSessionEntry?.sessionId === "string" && childSessionEntry.sessionId.trim() ? childSessionEntry.sessionId.trim() : void 0;
		childSessionLifecycleRevision = normalizeOptionalString(childSessionEntry?.lifecycleRevision);
		const settleTimeoutMs = Math.min(Math.max(params.timeoutMs, 1), 12e4);
		let reply = params.terminalReply?.disposition === "visible" ? params.terminalReply.text : params.terminalReply?.disposition === "silent" ? SILENT_REPLY_TOKEN : params.roundOneReply;
		let outcome = params.outcome;
		if (childSessionId && isEmbeddedAgentRunActive(childSessionId)) {
			if (!await waitForEmbeddedAgentRunEnd(childSessionId, settleTimeoutMs) && isEmbeddedAgentRunActive(childSessionId)) {
				shouldDeleteChildSession = false;
				if (outcome?.status !== "timeout" || params.cleanup === "delete") return "retryable";
			}
		}
		if (!reply && params.waitForCompletion !== false) {
			const wait = await waitForSubagentRunOutcome(params.childRunId, settleTimeoutMs);
			const applied = applySubagentWaitOutcome({
				wait,
				outcome,
				startedAt: params.startedAt,
				endedAt: params.endedAt
			});
			outcome = applied.outcome;
			params.startedAt = applied.startedAt;
			params.endedAt = applied.endedAt;
		}
		if (!outcome) outcome = { status: "unknown" };
		const failedTerminalOutcome = outcome.status === "error";
		const allowFailedOutputCapture = !failedTerminalOutcome || !params.roundOneReply && !params.fallbackReply;
		if (failedTerminalOutcome && !params.terminalReply) reply = void 0;
		let requesterDepth = getSubagentDepthFromSessionStore(targetRequesterSessionKey, {
			cfg: getRuntimeConfig(),
			agentId: targetRequesterAgentId
		});
		const requesterIsInternalSession = () => requesterDepth >= 1 || isCronSessionKey(targetRequesterSessionKey);
		let childCompletionFindings;
		let childCompletionRows;
		let subagentRegistryRuntime;
		try {
			subagentRegistryRuntime = await loadSubagentRegistryRuntime();
			if (params.completionTarget !== "parent" && requesterDepth >= 1 && shouldIgnorePostCompletionAnnounceForSession(targetRequesterSessionKey)) return "delivered";
			if ((!childSessionEffectsAllowed() ? 0 : Math.max(0, countPendingDescendantRuns(params.childSessionKey))) > 0 && announceType !== "cron job") {
				shouldDeleteChildSession = false;
				return "retryable";
			}
			if (childSessionEffectsAllowed() && params.wakeOnDescendantSettle === true) {
				const directChildren = listSubagentRunsForRequester(params.childSessionKey, { requesterRunId: params.childRunId });
				if (Array.isArray(directChildren) && directChildren.length > 0) childCompletionRows = dedupeLatestChildCompletionRows(filterCurrentDirectChildCompletionRows(directChildren, {
					requesterSessionKey: params.childSessionKey,
					getLatestSubagentRunByChildSessionKey
				}));
			}
		} catch {}
		if (childCompletionRows) {
			const prepared = await readChildCompletionFindings(childCompletionRows);
			childCompletionFindings = prepared.text;
			isChildResultsCurrent = prepared.isCurrent;
		}
		const announceId = buildAnnounceIdFromChildRun({
			childSessionKey: params.childSessionKey,
			childRunId: params.childRunId
		});
		if (params.wakeOnDescendantSettle === true && childCompletionFindings?.trim() && subagentRegistryRuntime) {
			if (await runDescendantWake({
				runId: params.childRunId,
				childSessionKey: params.childSessionKey,
				runTimeoutSeconds: params.runTimeoutSeconds,
				taskLabel: params.label || params.task || "task",
				findings: childCompletionFindings,
				announceId,
				isChildSessionEffectsAllowed: () => childSessionEffectsAllowed() && completionDeliveryAllowed(),
				hasUsableSessionEntry,
				resolveGatewayContext: params.resolveGatewayContext,
				deps: {
					callGateway: callSubagentLifecycleGateway,
					dispatchGatewayMethodInProcess,
					getRuntimeConfig,
					replaceSubagentRunAfterSteer: subagentRegistryRuntime.replaceSubagentRunAfterSteer
				},
				signal: params.signal
			})) {
				shouldDeleteChildSession = false;
				return "delivered";
			}
		}
		const fallbackReply = failedTerminalOutcome ? void 0 : normalizeOptionalString(params.fallbackReply);
		const hasVisibleFallback = Boolean(fallbackReply) && !(isAnnounceSkip(fallbackReply) || isSilentReplyText(fallbackReply, "NO_REPLY"));
		const cleanedFallbackReply = hasVisibleFallback ? stripAndClassifyReply(fallbackReply ?? "") ?? void 0 : void 0;
		const childRun = getLatestSubagentRunByChildSessionKey(params.childSessionKey);
		if (childSessionEffectsAllowed() && childRun?.runId === params.childRunId) {
			const prepared = await readSubagentRunAnnounceResult(childRun);
			reply = prepared.text;
			isOwnResultCurrent = prepared.isCurrent;
		}
		if (params.terminalReply?.disposition === "silent") {
			if (!hasVisibleFallback && (isAnnounceSkip(fallbackReply) || !expectsCompletionMessage)) return "delivered";
			reply = cleanedFallbackReply;
		}
		if (params.terminalReply?.disposition === "empty" && outcome.status === "timeout") {
			const timeoutProgress = await readSubagentTimeoutProgress(params.childSessionKey, params.timeoutMs, outcome);
			if (timeoutProgress) reply = stripAndClassifyReply(timeoutProgress) ?? void 0;
		}
		if (!params.terminalReply) {
			if (childSessionEffectsAllowed() && !reply && allowFailedOutputCapture) reply = await readSubagentOutput(params.childSessionKey, outcome);
			if (childSessionEffectsAllowed() && !reply?.trim() && allowFailedOutputCapture) reply = await readLatestSubagentOutputWithRetry({
				sessionKey: params.childSessionKey,
				maxWaitMs: params.timeoutMs,
				outcome
			});
			if (!reply?.trim() && hasVisibleFallback) reply = fallbackReply;
			if (outcome?.status === "timeout" && reply?.trim() && params.waitForCompletion !== false) try {
				const rechecked = await waitForSubagentRunOutcome(params.childRunId, 0);
				const applied = applySubagentWaitOutcome({
					wait: rechecked,
					outcome,
					startedAt: params.startedAt,
					endedAt: params.endedAt
				});
				outcome = applied.outcome;
				params.startedAt = applied.startedAt;
				params.endedAt = applied.endedAt;
			} catch {}
			const replyIsAnnounceSkip = isAnnounceSkip(reply);
			if (replyIsAnnounceSkip || isSilentReplyText(reply, "NO_REPLY")) {
				if (hasVisibleFallback && cleanedFallbackReply) reply = cleanedFallbackReply;
				else {
					if (replyIsAnnounceSkip && isCronSessionKey(targetRequesterSessionKey)) logWarn(`cron job completion for session=${targetRequesterSessionKey} run=${params.childRunId} suppressed by ANNOUNCE_SKIP; the agent replied with the skip sentinel instead of delivering a result`);
					if (replyIsAnnounceSkip || isAnnounceSkip(fallbackReply) || !expectsCompletionMessage || hasVisibleFallback) return "delivered";
					reply = void 0;
				}
			} else if (reply) {
				reply = stripAndClassifyReply(reply) ?? cleanedFallbackReply;
				if (!reply) return "delivered";
			}
		}
		if (!outcome) outcome = { status: "unknown" };
		if (!childSessionEffectsAllowed()) {
			reply = params.roundOneReply ?? params.fallbackReply;
			if (expectsCompletionMessage && (params.terminalReply?.disposition === "silent" || isSilentReplyText(reply, "NO_REPLY"))) reply = hasVisibleFallback ? cleanedFallbackReply : void 0;
			outcome = params.outcome ?? { status: "unknown" };
		}
		const statusLabel = outcome.status === "ok" ? "completed; ready for parent review" : outcome.status === "timeout" ? outcome.error ? `timed out: ${outcome.error}` : "timed out" : outcome.status === "error" ? `failed: ${outcome.error || "unknown error"}` : "finished with unknown status";
		const taskLabel = params.label || params.task || "task";
		const announceSessionId = childSessionEffectsAllowed() ? childSessionId || "unknown" : "unknown";
		const childResultText = reply;
		const findings = childResultText || "(no output)";
		let requesterIsSubagent = requesterIsInternalSession();
		if (requesterIsSubagent) {
			if (!isSubagentSessionRunActive(targetRequesterSessionKey)) {
				if (params.completionTarget !== "parent" && shouldIgnorePostCompletionAnnounceForSession(targetRequesterSessionKey)) return "delivered";
				if (!hasUsableSessionEntry(loadSessionEntryByKey(targetRequesterSessionKey))) {
					if (params.completionTarget === "parent") {
						shouldDeleteChildSession = false;
						return "retryable";
					}
					const fallback = resolveRequesterForChildSession(targetRequesterSessionKey);
					if (!fallback?.requesterSessionKey) {
						shouldDeleteChildSession = false;
						return "retryable";
					}
					targetRequesterSessionKey = fallback.requesterSessionKey;
					targetRequesterAgentId = fallback.requesterAgentId;
					targetRequesterOrigin = normalizeDeliveryContext(fallback.requesterOrigin) ?? targetRequesterOrigin;
					requesterDepth = getSubagentDepthFromSessionStore(targetRequesterSessionKey, {
						cfg: getRuntimeConfig(),
						agentId: targetRequesterAgentId
					});
					requesterIsSubagent = requesterIsInternalSession();
				}
			}
		}
		const candidateStatsLine = params.completionTarget === "parent" || !childSessionEffectsAllowed() ? void 0 : await buildCompactAnnounceStatsLine({
			sessionKey: params.childSessionKey,
			startedAt: params.startedAt,
			endedAt: params.endedAt
		});
		const statsLine = childSessionEffectsAllowed() ? candidateStatsLine : void 0;
		let directOrigin = targetRequesterOrigin;
		if (!requesterIsSubagent) {
			const { entry } = loadRequesterSessionEntry(targetRequesterSessionKey, targetRequesterAgentId);
			directOrigin = resolveAnnounceOrigin(entry, targetRequesterOrigin);
		}
		const candidateCompletionDirectOrigin = expectsCompletionMessage && !requesterIsSubagent && params.completionTarget !== "parent" ? !childSessionEffectsAllowed() ? targetRequesterOrigin : await resolveSubagentCompletionOrigin({
			childSessionKey: params.childSessionKey,
			requesterSessionKey: targetRequesterSessionKey,
			requesterOrigin: directOrigin,
			childRunId: params.childRunId,
			spawnMode: params.spawnMode,
			expectsCompletionMessage
		}) : targetRequesterOrigin;
		const completionDirectOrigin = childSessionEffectsAllowed() ? candidateCompletionDirectOrigin : targetRequesterOrigin;
		const completionChannel = normalizeMessageChannel(completionDirectOrigin?.channel);
		const modelRouteChange = params.terminalReply?.disposition === "visible" ? params.terminalReply.modelRouteChange : void 0;
		const replyInstruction = buildAnnounceReplyInstruction({
			requesterIsSubagent,
			announceType,
			expectsCompletionMessage,
			completionTarget: params.completionTarget,
			modelRouteChange,
			preserveModelRouteNotice: requesterIsSubagent || !completionChannel || !isDeliverableMessageChannel(completionChannel)
		});
		const internalEvents = [{
			type: "task_completion",
			source: announceType === "cron job" ? "cron" : "subagent",
			childSessionKey: params.childSessionKey,
			childSessionId: announceSessionId,
			announceType,
			taskLabel,
			status: outcome.status,
			statusLabel,
			result: findings,
			...childResultText ? {} : { noVisibleResult: true },
			modelRouteChange,
			statsLine,
			replyInstruction
		}];
		const triggerMessage = buildAnnounceSteerMessage(internalEvents);
		const directIdempotencyKey = buildAnnounceIdempotencyKey(announceId);
		let deliveryResultReported = false;
		const reportDeliveryResult = (delivery) => {
			if (deliveryResultReported) return;
			deliveryResultReported = true;
			params.onDeliveryResult?.(delivery);
		};
		const delivery = await deliverSubagentAnnouncement({
			requesterSessionKey: targetRequesterSessionKey,
			requesterAgentId: targetRequesterAgentId,
			triggerMessage,
			steerMessage: triggerMessage,
			internalEvents,
			requesterSessionOrigin: targetRequesterOrigin,
			completionDirectOrigin,
			directOrigin,
			sourceSessionKey: params.childSessionKey,
			sourceRunId: params.childRunId,
			sourceTool: "subagent_announce",
			isSourceSessionEffectsAllowed: completionDeliveryAllowed,
			isCompletionOwnedByRequesterYield: params.isCompletionOwnedByRequesterYield,
			targetRequesterSessionKey,
			requesterIsSubagent,
			expectsCompletionMessage,
			completionTarget: params.completionTarget,
			completionRequesterSessionId: params.completionRequesterSessionId,
			bestEffortDeliver: params.bestEffortDeliver,
			directIdempotencyKey,
			onDeliveryResult: reportDeliveryResult,
			signal: params.signal,
			resolveGatewayContext: params.resolveGatewayContext
		});
		reportDeliveryResult(delivery);
		announceOutcome = delivery.reason === "requester_turn_pending" ? "requester_turn_pending" : delivery.disposition ?? (delivery.delivered ? "delivered" : "retryable");
	} catch (err) {
		shouldDeleteChildSession = false;
		defaultRuntime.error?.(`Subagent announce failed: ${String(err)}`);
	} finally {
		if (shouldDeleteChildSession && childSessionEffectsAllowed() && (params.onBeforeDeleteChildSession?.() ?? true)) await deleteSubagentSessionForCleanup({
			callGateway: callSubagentLifecycleGateway,
			isCurrent: childSessionEffectsAllowed,
			childSessionKey: params.childSessionKey,
			spawnMode: params.spawnMode,
			expectedSessionId: childSessionId,
			expectedLifecycleRevision: childSessionLifecycleRevision
		});
	}
	return announceOutcome;
}
//#endregion
export { runSubagentAnnounceFlow as n, hasUsableSessionEntry as t };
