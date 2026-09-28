import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { S as isSubagentSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-rFSl4uOZ.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { c as resolveSessionAbortTarget, s as markSessionAbortTarget } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { t as getAcpSessionManager } from "./manager-BSwH2tZB.mjs";
import { f as listSubagentRunsForController } from "./subagent-registry-read-C2SIiLpb.mjs";
import { h as replyRunRegistry } from "./reply-run-registry.registry-DycIsDrE.mjs";
import "./reply-run-registry-Cpef_Ljt.mjs";
import { n as abortEmbeddedAgentRun } from "./runs-ciDkXIOQ.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-ChS97Oy4.mjs";
import "./sessions-Cesa3L0p.mjs";
import { a as resolveConversationBindingContextFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-rsWh_4b4.mjs";
import { r as setAbortMemory } from "./abort-primitives-BbtQkqTs.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { t as killAllControlledSubagentRuns } from "./subagent-control-kill-7Q0Dg9eB.mjs";
import "./subagent-control-CVIvce7A.mjs";
import { t as clearSessionQueues } from "./cleanup-Oz9EeewQ.mjs";
import "./queue-CJnUSYp0.mjs";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-D4dHXewY.mjs";
//#region src/auto-reply/reply/abort-operation.ts
function abortSessionRunTargetWithOutcome(params) {
	const sessionIds = /* @__PURE__ */ new Set();
	const key = normalizeOptionalString(params.key);
	let active = key ? replyRunRegistry.isActive(key) : false;
	if (key) {
		const activeSessionId = resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId) {
			active = true;
			sessionIds.add(activeSessionId);
		}
	}
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	let aborted = key ? replyRunRegistry.abort(key) : false;
	for (const sessionId of sessionIds) aborted = abortEmbeddedAgentRun(sessionId) || aborted;
	const retirement = !active || aborted ? Promise.all([...sessionIds].map((sessionId) => retireSessionMcpRuntime({
		sessionId,
		reason: "session-stop"
	}))).then(() => void 0) : void 0;
	return {
		active,
		aborted,
		retirement
	};
}
function resolveStoredSessionId(params) {
	const agentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	try {
		return loadSessionEntry({
			agentId,
			clone: false,
			sessionKey: params.sessionKey,
			storePath
		})?.sessionId;
	} catch {
		return;
	}
}
async function resolveBoundAcpAbortTargetSessionKey(params) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	return await resolveEffectiveResetTargetSessionKey({
		cfg: params.cfg,
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId,
		activeSessionKey: params.activeSessionKey,
		skipConfiguredFallbackWhenActiveSessionNonAcp: false,
		fallbackToActiveAcpWhenUnbound: false
	});
}
function normalizeRequesterSessionKey(cfg, key) {
	const cleaned = normalizeOptionalString(key);
	if (!cleaned) return;
	const { mainKey, alias } = resolveMainSessionAlias(cfg);
	return resolveInternalSessionKey({
		key: cleaned,
		alias,
		mainKey
	});
}
async function stopSubagentsForRequester(params) {
	const requesterKey = normalizeRequesterSessionKey(params.cfg, params.requesterSessionKey);
	if (!requesterKey) {
		await params.beforeKill?.();
		return {
			stopped: 0,
			failed: 0
		};
	}
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: requesterKey,
		fallbackAgentId: params.requesterAgentId
	});
	const result = await killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller: {
			controllerSessionKey: requesterKey,
			controllerAgentId,
			callerSessionKey: requesterKey,
			callerIsSubagent: isSubagentSessionKey(requesterKey),
			controlScope: "children"
		},
		runs: listSubagentRunsForController(requesterKey),
		suppressTaskDelivery: true,
		beforeKill: params.beforeKill
	});
	if (result.status === "error") logVerbose(`abort: failed to stop subagents for ${requesterKey}: ${result.error}`);
	if (result.killed > 0) logVerbose(`abort: stopped ${result.killed} subagent run(s) for ${requesterKey}`);
	return {
		stopped: result.killed,
		failed: result.status === "error" ? result.failed : 0
	};
}
async function executeFastAbortRequest(params, request) {
	const { ctx, cfg } = params;
	const { commandSessionKey, targetKey, resolveTargetAgentId } = request;
	const commandAuthorized = ctx.CommandAuthorized;
	const auth = resolveCommandAuthorization({
		ctx,
		cfg,
		commandAuthorized
	});
	if (!auth.isAuthorizedSender) return {
		handled: false,
		aborted: false
	};
	const agentId = resolveTargetAgentId();
	const abortKey = targetKey ?? auth.from ?? auth.to;
	const requesterSessionKey = targetKey ?? ctx.SessionKey ?? abortKey;
	if (targetKey) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const abortCutoffForTarget = (target) => shouldPersistAbortCutoff({
			commandSessionKey,
			targetSessionKey: target.sessionKey
		}) ? resolveAbortCutoffFromContext(ctx) : void 0;
		let resolvedAbortTarget = null;
		try {
			resolvedAbortTarget = resolveSessionAbortTarget({
				agentId,
				sessionKey: targetKey,
				storePath
			});
		} catch (error) {
			logVerbose(`abort: failed to resolve abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
		}
		const resolvedTargetKey = resolvedAbortTarget?.sessionKey ?? targetKey;
		const conversationBoundAcpTargetKey = commandSessionKey ? await resolveBoundAcpAbortTargetSessionKey({
			ctx,
			cfg,
			activeSessionKey: commandSessionKey
		}) : void 0;
		const boundAcpTargetKey = !isAcpSessionKey(resolvedTargetKey) ? conversationBoundAcpTargetKey : void 0;
		const abortTargetKeys = [resolvedTargetKey];
		if (boundAcpTargetKey && boundAcpTargetKey !== resolvedTargetKey) abortTargetKeys.push(boundAcpTargetKey);
		let aborted = false;
		let activeAbortRejected = false;
		const acpCancellations = [];
		try {
			const { stopped, failed } = await stopSubagentsForRequester({
				cfg,
				requesterSessionKey,
				requesterAgentId: agentId,
				beforeKill: () => {
					if (params.isCommandTargetCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
					try {
						const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
						const sessionIdsByKey = new Map(abortTargetKeys.map((abortTargetKey) => [abortTargetKey, replyRunRegistry.resolveSessionId(abortTargetKey) ?? (abortTargetKey === resolvedTargetKey ? resolvedAbortTarget?.sessionId : resolveStoredSessionId({
							cfg,
							sessionKey: abortTargetKey
						}))]));
						for (const abortTargetKey of abortTargetKeys) {
							const outcome = abortSessionRunTargetWithOutcome({
								key: abortTargetKey,
								sessionId: sessionIdsByKey.get(abortTargetKey)
							});
							if (outcome.retirement) acpCancellations.push(outcome.retirement);
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
						const sourceSessionId = sourceAbortKey ? replyRunRegistry.resolveSessionId(sourceAbortKey) ?? resolveStoredSessionId({
							cfg,
							sessionKey: sourceAbortKey
						}) : void 0;
						if (sourceAbortKey) {
							const outcome = abortSessionRunTargetWithOutcome({
								key: sourceAbortKey,
								sessionId: sourceSessionId
							});
							if (outcome.retirement) acpCancellations.push(outcome.retirement);
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
						const cleared = clearSessionQueues(abortTargetKeys.flatMap((abortTargetKey) => [abortTargetKey, sessionIdsByKey.get(abortTargetKey)]).concat(sourceAbortKey, sourceSessionId));
						if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
					} finally {
						const acpManager = getAcpSessionManager();
						for (const acpTargetKey of abortTargetKeys) {
							const resolution = acpManager.resolveSession({
								cfg,
								sessionKey: acpTargetKey,
								agentId: acpTargetKey === resolvedTargetKey ? agentId : void 0
							});
							if (resolution.kind === "none") continue;
							acpCancellations.push(acpManager.cancelSession({
								cfg,
								sessionKey: resolution.sessionKey,
								agentId: resolution.agentId,
								reason: "fast-abort"
							}).catch((error) => {
								logVerbose(`abort: ACP cancel failed for ${acpTargetKey}: ${formatErrorMessage(error)}`);
							}));
						}
					}
					return true;
				}
			});
			const rejectionReason = activeAbortRejected && !aborted ? "finalizing" : void 0;
			if (!rejectionReason) {
				let persistedAbortTarget = null;
				try {
					persistedAbortTarget = await markSessionAbortTarget({
						isCurrent: params.isCommandTargetCurrent,
						scope: {
							agentId,
							sessionKey: targetKey,
							storePath
						},
						resolveAbortCutoff: abortCutoffForTarget
					});
				} catch (error) {
					logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
				}
				if (persistedAbortTarget?.persisted === false) logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${persistedAbortTarget.persistenceError ?? "unknown error"}`);
				const abortMemoryKey = persistedAbortTarget?.sessionKey ?? resolvedAbortTarget?.sessionKey ?? abortKey;
				const hasAbortTargetEntry = Boolean(persistedAbortTarget?.entry ?? resolvedAbortTarget?.entry);
				if (persistedAbortTarget?.persisted !== true && abortMemoryKey && !hasAbortTargetEntry && params.isCommandTargetCurrent?.() !== false) setAbortMemory(abortMemoryKey, true);
			}
			return {
				handled: true,
				aborted,
				...rejectionReason ? { rejectionReason } : {},
				stoppedSubagents: stopped,
				failedSubagents: failed
			};
		} finally {
			await Promise.all(acpCancellations);
		}
	}
	if (abortKey) setAbortMemory(abortKey, true);
	const { stopped, failed } = await stopSubagentsForRequester({
		cfg,
		requesterSessionKey
	});
	return {
		handled: true,
		aborted: false,
		stoppedSubagents: stopped,
		failedSubagents: failed
	};
}
//#endregion
export { executeFastAbortRequest as n, stopSubagentsForRequester as r, abortSessionRunTargetWithOutcome as t };
