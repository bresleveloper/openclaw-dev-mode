import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { c as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey, S as isCronSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as INTERNAL_PROVENANCE_SOURCE_CHANNEL } from "./input-provenance-D1LHo5Qj.mjs";
import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-DHFPcfdZ.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { d as resolveRequesterForChildSession, f as shouldIgnorePostCompletionAnnounceForSession, l as listSubagentRunsForRequester, r as countPendingDescendantRuns, s as isSubagentSessionRunActive, t as buildLatestSubagentSessionListReadIndex } from "./subagent-registry-read-DY0g8fGW.mjs";
import { c as waitForEmbeddedAgentRunEnd, n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { l as getSubagentDepthFromSessionStoreInWorker } from "./subagent-capabilities-l3WVTf-e.mjs";
import { t as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { m as buildAnnounceIdempotencyKey, p as buildAnnounceIdFromChildRun } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { t as deleteSubagentSessionForCleanup } from "./subagent-session-cleanup-DiUGhTWn.mjs";
import { i as terminateAcceptedCollectorRun } from "./subagent-spawn-cleanup-Csz52Q2U.mjs";
import { a as readChildCompletionFindings, c as readSubagentRunAnnounceResult, i as filterCurrentDirectChildCompletionRows, l as readSubagentTimeoutProgress, n as captureSubagentCompletionReply, o as readLatestSubagentOutputWithRetry, r as dedupeLatestChildCompletionRows, s as readSubagentOutput, t as buildCompactAnnounceStatsLine } from "./subagent-announce-output-K_UNDyxP.mjs";
import { a as loadSessionEntryByKey, c as withSubagentRequesterSource, i as loadRequesterSessionEntry, r as hasUsableSessionEntry } from "./subagent-announce-delivery.runtime.js";
import { t as callSubagentLifecycleGateway } from "./subagent-announce.runtime.js";
import { d as resolveAnnounceOrigin, m as resolveSubagentCompletionOrigin, u as sourceOwnerChangedResult } from "./subagent-announce-completion-delivery-Bs9Ljx2e.mjs";
import { i as formatAgentInternalEventsForPrompt } from "./internal-events-Crl175ti.mjs";
import { n as SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION, t as SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION } from "./subagent-completion-instructions-B70YK2BV.mjs";
import { a as resolveSubagentAnnounceTimeoutMs, i as isPermanentAnnounceDeliveryError, n as hasAnnounceSendEvidence, o as runAnnounceDeliveryWithRetry, s as summarizeDeliveryError, t as SourceOwnerChangedError } from "./subagent-announce-delivery-retry-Gxy4Sy-v.mjs";
import { t as deliverSubagentAnnouncement } from "./subagent-announce-delivery-C3AShlfK.mjs";
//#region src/agents/subagents/announce/subagent-announce-descendant-wake.ts
function isWakeContinuation(runId) {
	const trimmed = runId.trim();
	const rootRunId = trimmed.replace(/(?::wake)+$/u, "");
	return rootRunId.length > 0 && rootRunId !== trimmed;
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
	if (!await params.prepareCurrent()) return false;
	if (params.signal?.aborted || !params.isChildSessionEffectsAllowed()) return false;
	const childEntry = await loadSessionEntryByKey(params.childSessionKey);
	if (!hasUsableSessionEntry(childEntry)) return false;
	const cfg = params.deps.getRuntimeConfig();
	const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(cfg);
	const wakeLifecycleGeneration = getAgentEventLifecycleGeneration();
	const wakeMessage = buildDescendantWakeMessage(params);
	let wakeRunId;
	try {
		const wakeResponse = await runAnnounceDeliveryWithRetry({
			operation: "descendant wake agent call",
			signal: params.signal,
			prepareAttempt: params.prepareCurrent,
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
					resolveGatewayContext: params.resolveGatewayContext,
					prepareDispatchCurrent: async () => {
						if (!await params.prepareCurrent() || !params.isChildSessionEffectsAllowed()) throw new SourceOwnerChangedError();
					}
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
			expectedSessionId: normalizeOptionalString(childEntry.sessionId),
			expectedLifecycleRevision: normalizeOptionalString(childEntry.lifecycleRevision),
			timeoutMs: announceTimeoutMs,
			callGateway: params.deps.callGateway
		});
	};
	let prepared;
	try {
		prepared = await params.prepareCurrent();
	} catch {
		prepared = false;
	}
	if (!prepared || params.signal?.aborted || !params.isChildSessionEffectsAllowed()) {
		await terminateUnownedWake();
		return false;
	}
	const replaced = await params.deps.replaceSubagentRunAfterSteer({
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
const loadSubagentRegistryRuntime = createLazyPromise(() => import("./subagent-registry-BSZR34Tv.mjs"));
function buildAnnounceReplyInstruction(params) {
	const modelRouteInstruction = !params.modelRouteChange ? "" : params.preserveModelRouteNotice ? " Preserve any runtime-authored model-route change notice in your update." : " Keep runtime-authored model-route change notices internal on this shared surface.";
	if (params.completionTarget === "parent") return SUBAGENT_PRIVATE_COMPLETION_INSTRUCTION;
	if (params.requesterIsSubagent) return `${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION} Convert the reviewed outcome into a concise internal orchestration update for your parent agent in your own words.${modelRouteInstruction} Keep this internal context private (don't mention system/log/stats/session details or announce type).`;
	return `A completed subagent task is ready for parent review. ${SUBAGENT_COMPLETION_OUTCOME_INSTRUCTION}${modelRouteInstruction} Otherwise send a truthful user-facing update unless this exact result is already visible to the user in this same turn. Keep this internal context private (don't mention system/log/stats/session details or announce type), and do not copy the internal event text verbatim.`;
}
function stripAndClassifyReply(text) {
	const hasLeadingSilentToken = startsWithSilentToken(text, SILENT_REPLY_TOKEN);
	if (!hasLeadingSilentToken && !text.toLowerCase().includes("NO_REPLY".toLowerCase())) return text;
	const result = stripSilentToken(hasLeadingSilentToken ? stripLeadingSilentToken(text, SILENT_REPLY_TOKEN) : text, SILENT_REPLY_TOKEN);
	return !result || isSilentReplyText(result, "NO_REPLY") ? null : result;
}
async function runSubagentAnnounceFlow(params) {
	return await (params.resolveGatewayContext ? withPluginRuntimeGatewayContextResolver(params.resolveGatewayContext, () => runSubagentAnnounceFlowBound(params)) : runSubagentAnnounceFlowBound(params));
}
async function runSubagentAnnounceFlowBound(params) {
	let announceOutcome = "retryable";
	let deliveryResultReported = false;
	const reportDeliveryResult = async (delivery) => {
		if (deliveryResultReported) return;
		deliveryResultReported = true;
		announceOutcome = delivery.reason === "requester_turn_pending" ? "requester_turn_pending" : delivery.disposition ?? (delivery.delivered ? "delivered" : "retryable");
		await params.onDeliveryResult?.(delivery);
	};
	const expectsCompletionMessage = params.expectsCompletionMessage === true;
	let shouldDeleteChildSession = params.cleanup === "delete";
	const childSessionEffectsAllowed = () => params.suppressChildSessionEffects !== true && params.isChildSessionEffectsAllowed?.() !== false;
	const prepareChildSessionEffects = async () => childSessionEffectsAllowed() && await params.prepareChildSessionEffects?.() !== false && childSessionEffectsAllowed();
	let ownResult;
	let isChildResultsCurrent = () => true;
	const completionDeliveryAllowed = () => params.isCompletionDeliveryAllowed?.() !== false && (ownResult?.isCurrent() ?? true) && isChildResultsCurrent();
	let childSessionId;
	try {
		let targetRequesterSessionKey = params.requesterSessionKey;
		let targetRequesterAgentId = params.requesterAgentId;
		let targetRequesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
		const childSessionEntry = !await prepareChildSessionEffects() || !childSessionEffectsAllowed() ? void 0 : await loadSessionEntryByKey(params.childSessionKey, parseAgentSessionKey(params.childSessionKey) ? void 0 : params.childAgentId);
		childSessionId = typeof childSessionEntry?.sessionId === "string" && childSessionEntry.sessionId.trim() ? childSessionEntry.sessionId.trim() : void 0;
		const settleTimeoutMs = Math.min(Math.max(params.timeoutMs, 1), 12e4);
		let reply = params.terminalReply?.disposition === "visible" ? params.terminalReply.text : params.terminalReply?.disposition === "silent" ? SILENT_REPLY_TOKEN : params.roundOneReply;
		const outcome = params.outcome ?? { status: "unknown" };
		if (childSessionId && await prepareChildSessionEffects() && childSessionEffectsAllowed() && isEmbeddedAgentRunActive(childSessionId)) {
			if (!await waitForEmbeddedAgentRunEnd(childSessionId, settleTimeoutMs) && isEmbeddedAgentRunActive(childSessionId)) {
				shouldDeleteChildSession = false;
				if (outcome?.status !== "timeout" || params.cleanup === "delete") return "retryable";
			}
		}
		const failedTerminalOutcome = outcome.status === "error";
		const allowFailedOutputCapture = !failedTerminalOutcome || !params.roundOneReply && !params.fallbackReply;
		if (failedTerminalOutcome && !params.terminalReply) reply = void 0;
		let requesterDepth = await getSubagentDepthFromSessionStoreInWorker(targetRequesterSessionKey, {
			cfg: readRuntimeConfig(),
			agentId: targetRequesterAgentId
		});
		const requesterIsInternalSession = () => requesterDepth >= 1 || isCronSessionKey(targetRequesterSessionKey);
		let childCompletionFindings;
		let childCompletionRows;
		let subagentRegistryRuntime;
		try {
			subagentRegistryRuntime = await loadSubagentRegistryRuntime();
			if (params.completionTarget !== "parent" && requesterDepth >= 1 && await shouldIgnorePostCompletionAnnounceForSession(targetRequesterSessionKey, targetRequesterAgentId)) return "delivered";
			const childSessionCurrent = await prepareChildSessionEffects();
			if ((!childSessionCurrent || !childSessionEffectsAllowed() ? 0 : Math.max(0, await countPendingDescendantRuns(params.childSessionKey, () => {
				if (!childSessionEffectsAllowed()) throw new Error("Subagent child-session effects are no longer current.");
			}))) > 0) {
				shouldDeleteChildSession = false;
				return "retryable";
			}
			if (childSessionCurrent && childSessionEffectsAllowed() && params.wakeOnDescendantSettle === true) {
				const directChildren = listSubagentRunsForRequester(params.childSessionKey, { requesterRunId: params.childRunId });
				if (directChildren.length > 0) childCompletionRows = dedupeLatestChildCompletionRows(filterCurrentDirectChildCompletionRows(directChildren, {
					requesterSessionKey: params.childSessionKey,
					getLatestSubagentRunByChildSessionKey: buildLatestSubagentSessionListReadIndex(directChildren.map((entry) => entry.childSessionKey)).getLatestSubagentRun
				}));
			}
		} catch {}
		if (childCompletionRows && await prepareChildSessionEffects() && childSessionEffectsAllowed()) {
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
				prepareCurrent: prepareChildSessionEffects,
				isChildSessionEffectsAllowed: () => childSessionEffectsAllowed() && completionDeliveryAllowed(),
				resolveGatewayContext: params.resolveGatewayContext,
				deps: {
					callGateway: callSubagentLifecycleGateway,
					dispatchGatewayMethodInProcess,
					getRuntimeConfig: readRuntimeConfig,
					replaceSubagentRunAfterSteer: subagentRegistryRuntime.replaceSubagentRunAfterSteerCore
				},
				signal: params.signal
			})) {
				shouldDeleteChildSession = false;
				return "delivered";
			}
		}
		const fallbackReply = failedTerminalOutcome ? void 0 : normalizeOptionalString(params.fallbackReply);
		const hasVisibleFallback = Boolean(fallbackReply) && !isSilentReplyText(fallbackReply, "NO_REPLY");
		const cleanedFallbackReply = hasVisibleFallback ? stripAndClassifyReply(fallbackReply ?? "") ?? void 0 : void 0;
		const childRun = subagentRuns.get(params.childRunId);
		if (childRun?.childSessionKey === params.childSessionKey && completionDeliveryAllowed()) {
			ownResult = await readSubagentRunAnnounceResult(childRun);
			reply = ownResult.text;
		}
		if (params.terminalReply?.disposition === "silent") {
			if (!hasVisibleFallback && !expectsCompletionMessage) return "delivered";
			reply = cleanedFallbackReply;
		}
		if (params.terminalReply?.disposition === "empty" && outcome.status === "timeout" && await prepareChildSessionEffects() && childSessionEffectsAllowed()) {
			const timeoutProgress = await readSubagentTimeoutProgress(params.childSessionKey, params.timeoutMs, outcome, params.childAgentId);
			if (timeoutProgress) reply = stripAndClassifyReply(timeoutProgress) ?? void 0;
		}
		if (!params.terminalReply) {
			if (!reply && allowFailedOutputCapture && await prepareChildSessionEffects() && childSessionEffectsAllowed()) reply = await readSubagentOutput(params.childSessionKey, outcome, { childAgentId: params.childAgentId });
			if (!reply?.trim() && allowFailedOutputCapture && await prepareChildSessionEffects() && childSessionEffectsAllowed()) reply = await readLatestSubagentOutputWithRetry({
				sessionKey: params.childSessionKey,
				childAgentId: params.childAgentId,
				maxWaitMs: params.timeoutMs,
				outcome
			});
			if (!reply?.trim() && hasVisibleFallback) reply = fallbackReply;
			if (isSilentReplyText(reply, "NO_REPLY")) {
				if (hasVisibleFallback && cleanedFallbackReply) reply = cleanedFallbackReply;
				else {
					if (!expectsCompletionMessage || hasVisibleFallback) return "delivered";
					reply = void 0;
				}
			} else if (reply) {
				reply = stripAndClassifyReply(reply) ?? cleanedFallbackReply;
				if (!reply) return "delivered";
			}
		}
		const childSessionCurrent = await prepareChildSessionEffects();
		if (!ownResult && (!childSessionCurrent || !childSessionEffectsAllowed())) {
			reply = params.roundOneReply ?? params.fallbackReply;
			if (expectsCompletionMessage && (params.terminalReply?.disposition === "silent" || isSilentReplyText(reply, "NO_REPLY"))) reply = hasVisibleFallback ? cleanedFallbackReply : void 0;
		}
		const statusLabel = outcome.status === "ok" ? "completed; ready for parent review" : outcome.status === "timeout" ? outcome.error ? `timed out: ${outcome.error}` : "timed out" : outcome.status === "error" ? `failed: ${outcome.error || "unknown error"}` : "finished with unknown status";
		const taskLabel = params.label || params.task || "task";
		const announceSessionId = childSessionCurrent && childSessionEffectsAllowed() ? childSessionId || "unknown" : "unknown";
		const childResultText = reply;
		const findings = childResultText || "(no output)";
		let requesterIsSubagent = requesterIsInternalSession();
		if (requesterIsSubagent) {
			if (!isSubagentSessionRunActive(targetRequesterSessionKey, targetRequesterAgentId)) {
				if (params.completionTarget !== "parent" && await shouldIgnorePostCompletionAnnounceForSession(targetRequesterSessionKey, targetRequesterAgentId)) return "delivered";
				const parentSessionEntry = await loadSessionEntryByKey(targetRequesterSessionKey);
				if (!hasUsableSessionEntry(parentSessionEntry)) {
					if (params.completionTarget === "parent") {
						shouldDeleteChildSession = false;
						return "retryable";
					}
					const fallback = await resolveRequesterForChildSession(targetRequesterSessionKey, targetRequesterAgentId);
					if (!fallback?.requesterSessionKey) {
						shouldDeleteChildSession = false;
						return "retryable";
					}
					targetRequesterSessionKey = fallback.requesterSessionKey;
					targetRequesterAgentId = fallback.requesterAgentId;
					targetRequesterOrigin = normalizeDeliveryContext(fallback.requesterOrigin) ?? targetRequesterOrigin;
					requesterDepth = await getSubagentDepthFromSessionStoreInWorker(targetRequesterSessionKey, {
						cfg: readRuntimeConfig(),
						agentId: targetRequesterAgentId
					});
					requesterIsSubagent = requesterIsInternalSession();
				}
			}
		}
		const candidateStatsLine = params.completionTarget === "parent" || !await prepareChildSessionEffects() || !childSessionEffectsAllowed() ? void 0 : await buildCompactAnnounceStatsLine({
			sessionKey: params.childSessionKey,
			childAgentId: params.childAgentId,
			startedAt: params.startedAt,
			endedAt: params.endedAt
		});
		const statsLine = await prepareChildSessionEffects() && childSessionEffectsAllowed() ? candidateStatsLine : void 0;
		await withSubagentRequesterSource(targetRequesterSessionKey, targetRequesterAgentId, async (isRequesterCurrent) => {
			let directOrigin = targetRequesterOrigin;
			if (!requesterIsSubagent) {
				const { entry } = await loadRequesterSessionEntry(targetRequesterSessionKey, targetRequesterAgentId);
				directOrigin = resolveAnnounceOrigin(entry, targetRequesterOrigin);
			}
			const candidateCompletionDirectOrigin = expectsCompletionMessage && !requesterIsSubagent && params.completionTarget !== "parent" ? !await prepareChildSessionEffects() || !childSessionEffectsAllowed() ? targetRequesterOrigin : await resolveSubagentCompletionOrigin({
				childSessionKey: params.childSessionKey,
				requesterSessionKey: targetRequesterSessionKey,
				requesterOrigin: directOrigin,
				childRunId: params.childRunId,
				spawnMode: params.spawnMode,
				expectsCompletionMessage
			}) : targetRequesterOrigin;
			const completionDirectOrigin = await prepareChildSessionEffects() && childSessionEffectsAllowed() ? candidateCompletionDirectOrigin : targetRequesterOrigin;
			const completionChannel = normalizeMessageChannel(completionDirectOrigin?.channel);
			const modelRouteChange = params.terminalReply?.disposition === "visible" ? params.terminalReply.modelRouteChange : void 0;
			const replyInstruction = buildAnnounceReplyInstruction({
				requesterIsSubagent,
				completionTarget: params.completionTarget,
				modelRouteChange,
				preserveModelRouteNotice: requesterIsSubagent || !completionChannel || !isDeliverableMessageChannel(completionChannel)
			});
			const internalEvents = [{
				type: "task_completion",
				source: "subagent",
				announceType: "subagent task",
				childSessionKey: params.childSessionKey,
				childSessionId: announceSessionId,
				taskLabel,
				status: outcome.status,
				statusLabel,
				result: findings,
				...childResultText ? {} : { noVisibleResult: true },
				modelRouteChange,
				statsLine,
				replyInstruction
			}];
			const triggerMessage = formatAgentInternalEventsForPrompt(internalEvents) || "A background task finished. Process the completion update now.";
			const directIdempotencyKey = buildAnnounceIdempotencyKey(announceId);
			const delivery = await deliverSubagentAnnouncement({
				requesterSessionKey: targetRequesterSessionKey,
				requesterAgentId: targetRequesterAgentId,
				triggerMessage,
				internalEvents,
				requesterSessionOrigin: targetRequesterOrigin,
				completionDirectOrigin,
				directOrigin,
				sourceSessionKey: params.childSessionKey,
				sourceRunId: params.childRunId,
				sourceTool: "subagent_announce",
				isSourceSessionEffectsAllowed: () => isRequesterCurrent?.() !== false && completionDeliveryAllowed(),
				isCompletionOwnedByRequesterYield: params.isCompletionOwnedByRequesterYield,
				targetRequesterSessionKey,
				requesterIsSubagent,
				expectsCompletionMessage,
				completionTarget: params.completionTarget,
				completionRequesterSessionId: params.completionRequesterSessionId,
				completionRequesterLifecycleRevision: params.completionRequesterLifecycleRevision,
				directIdempotencyKey,
				onDeliveryResult: reportDeliveryResult,
				signal: params.signal,
				onExecutionStarted: params.onExecutionStarted,
				resolveGatewayContext: params.resolveGatewayContext
			});
			await reportDeliveryResult(delivery);
		});
	} catch (err) {
		shouldDeleteChildSession = false;
		if (hasSqliteWorkerOutcomeUnknown(err)) throw err;
		defaultRuntime.error?.(`Subagent announce failed: ${String(err)}`);
		if (!deliveryResultReported) await reportDeliveryResult(err instanceof SourceOwnerChangedError ? sourceOwnerChangedResult() : {
			delivered: false,
			path: "none",
			error: summarizeDeliveryError(err),
			disposition: hasAnnounceSendEvidence(err) || isPermanentAnnounceDeliveryError(err) ? "permanent_failure" : "retryable"
		});
	} finally {
		if (shouldDeleteChildSession && await prepareChildSessionEffects() && childSessionEffectsAllowed() && (await params.onBeforeDeleteChildSession?.() ?? true) && childSessionEffectsAllowed()) await deleteSubagentSessionForCleanup({
			callGateway: callSubagentLifecycleGateway,
			gatewayBinding: { resolveGatewayContext: params.resolveGatewayContext },
			prepareCurrent: prepareChildSessionEffects,
			isCurrent: childSessionEffectsAllowed,
			childSessionKey: params.childSessionKey,
			childAgentId: params.childAgentId,
			spawnMode: params.spawnMode,
			expectedSessionId: params.childSessionIdentity?.sessionId,
			expectedLifecycleRevision: params.childSessionIdentity?.lifecycleRevision
		});
	}
	return announceOutcome;
}
//#endregion
export { captureSubagentCompletionReply, runSubagentAnnounceFlow };
