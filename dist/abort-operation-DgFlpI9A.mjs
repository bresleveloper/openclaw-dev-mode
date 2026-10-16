import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-DyjyIT4u.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { a as markSessionAbortTarget, s as resolveSessionAbortTarget } from "./session-accessor.reset-DWr6djSD.mjs";
import { n as getAcpSessionManager } from "./manager-Cmu0euXz.mjs";
import { y as resolveReplyOperationsForSession } from "./reply-run-registry.registry-CVpYrkbm.mjs";
import "./reply-run-registry-CHTPEb3-.mjs";
import { n as abortEmbeddedAgentRun } from "./runs-BErx7xDZ.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B86tDIo_.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { a as resolveConversationBindingContextFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-BoR9NsWR.mjs";
import { c as listSubagentRunsForController } from "./subagent-registry-read-BE_xWkJl.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-ZZ7dnwCs.mjs";
import "./sessions-helpers-BhYHEF2P.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-BrSuoAYi.mjs";
import { t as killAllControlledSubagentRuns } from "./subagent-control-kill-DcgU-e2d.mjs";
import "./subagent-control-C5RcHFuj.mjs";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-DNSrZhGE.mjs";
import { r as setAbortMemory } from "./abort-primitives-BPtyD5jf.mjs";
//#region src/auto-reply/reply/abort-operation.ts
function abortSessionRunTargetWithOutcome(params) {
	const key = normalizeOptionalString(params.key);
	const operations = resolveReplyOperationsForSession({
		...params,
		sessionKeys: key ? [key] : []
	});
	const sessionIds = new Set(operations.map((operation) => operation.sessionId));
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	let active = operations.length > 0;
	if (key) {
		const activeSessionId = resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId && (sessionIds.has(activeSessionId) || parseAgentSessionKey(key)?.agentId === normalizeAgentId(params.agentId))) {
			active = true;
			sessionIds.add(activeSessionId);
		}
	}
	let aborted = false;
	for (const operation of operations) aborted = operation.abortByUser() || aborted;
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
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	try {
		return loadSessionEntry({
			agentId: params.agentId,
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
async function stopSubagentsForRequester(params) {
	const cleaned = normalizeOptionalString(params.requesterSessionKey);
	if (!cleaned) {
		await params.beforeKill?.();
		return {
			stopped: 0,
			failed: 0
		};
	}
	const { alias } = resolveMainSessionAlias(params.cfg);
	const requesterKey = resolveInternalSessionKey({
		key: cleaned,
		alias
	});
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
					const assertCurrent = () => {
						if (params.isCommandTargetCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
					};
					assertCurrent();
					try {
						const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
						const targets = [...abortTargetKeys, ...sourceAbortKey ? [sourceAbortKey] : []].map((key) => {
							const targetAgentId = key === resolvedTargetKey ? agentId : resolveSessionAgentId({
								config: cfg,
								sessionKey: key,
								fallbackAgentId: ctx.AgentId ?? agentId
							});
							return {
								key,
								agentId: targetAgentId,
								sessionId: resolveReplyOperationsForSession({
									sessionKeys: [key],
									agentId: targetAgentId
								})[0]?.sessionId ?? (key === resolvedTargetKey ? resolvedAbortTarget?.sessionId : resolveStoredSessionId({
									cfg,
									sessionKey: key,
									agentId: targetAgentId
								}))
							};
						});
						for (const target of targets) {
							const cleared = clearSessionLifecycleQueues({
								...target,
								keys: [target.key, target.sessionId],
								sessionKey: target.key,
								assertCurrent
							});
							if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
						}
						for (const target of targets) {
							const outcome = abortSessionRunTargetWithOutcome(target);
							if (outcome.retirement) acpCancellations.push(outcome.retirement);
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
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
