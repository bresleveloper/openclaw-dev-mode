import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { D as resolveSessionAbortTarget, h as markSessionAbortTarget, m as loadSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { t as getAcpSessionManager } from "./manager-CnlRhuXY.js";
import { i as setAbortMemory, n as isAbortRequestText } from "./abort-primitives-DWqW0PjJ.js";
import { h as replyRunRegistry } from "./reply-run-registry-BkKh9g6X.js";
import { f as resolveActiveEmbeddedRunSessionId } from "./run-state-rO_N-hh3.js";
import { n as abortEmbeddedAgentRun } from "./runs-DXoQzrw0.js";
import "./sessions-gBZPP61K.js";
import { c as resolveMainSessionAlias, s as resolveInternalSessionKey } from "./sessions-helpers-C4SbQrlb.js";
import { a as clearSessionQueues } from "./queue-DlJx-5Kf.js";
import { f as listSubagentRunsForController, m as markSubagentRunTerminated, s as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-CY2D47cH.js";
import { i as resolveConversationBindingContextFromMessage } from "./conversation-binding-input-Cfp_egAp.js";
import { o as stripMentions, s as stripStructuralPrefixes } from "./mentions-B1EJNjZS.js";
import { t as resolveCommandAuthorization } from "./command-auth-BBZwnH2N.js";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-DfANjv5i.js";
import { t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-BDJAF1Xj.js";
const abortDeps = {
	getAcpSessionManager,
	abortEmbeddedAgentRun,
	resolveActiveEmbeddedRunSessionId,
	markSessionAbortTarget,
	resolveSessionAbortTarget,
	getLatestSubagentRunByChildSessionKey,
	listSubagentRunsForController,
	markSubagentRunTerminated
};
function abortSessionRunTarget(params) {
	const sessionIds = /* @__PURE__ */ new Set();
	const key = normalizeOptionalString(params.key);
	if (key) {
		const activeSessionId = abortDeps.resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId) sessionIds.add(activeSessionId);
	}
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	let aborted = key ? replyRunRegistry.abort(key) : false;
	for (const sessionId of sessionIds) aborted = abortDeps.abortEmbeddedAgentRun(sessionId) || aborted;
	return aborted;
}
function formatAbortReplyText(stoppedSubagents) {
	if (typeof stoppedSubagents !== "number" || stoppedSubagents <= 0) return "⚙️ Agent was aborted.";
	return `⚙️ Agent was aborted. Stopped ${stoppedSubagents} ${stoppedSubagents === 1 ? "sub-agent" : "sub-agents"}.`;
}
function resolveStoredSessionId(params) {
	const agentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
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
function resolveBoundAcpAbortTargetSessionKey(params) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	return resolveEffectiveResetTargetSessionKey({
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
function stopSubagentsForRequester(params) {
	const requesterKey = normalizeRequesterSessionKey(params.cfg, params.requesterSessionKey);
	if (!requesterKey) return { stopped: 0 };
	const dedupedRunsByChildKey = /* @__PURE__ */ new Map();
	for (const run of abortDeps.listSubagentRunsForController(requesterKey)) {
		const childKey = normalizeOptionalString(run.childSessionKey);
		if (!childKey) continue;
		const latest = abortDeps.getLatestSubagentRunByChildSessionKey(childKey);
		if (!latest) {
			const existing = dedupedRunsByChildKey.get(childKey);
			if (!existing || run.createdAt >= existing.createdAt) dedupedRunsByChildKey.set(childKey, run);
			continue;
		}
		const latestControllerSessionKey = normalizeOptionalString(latest?.controllerSessionKey) ?? normalizeOptionalString(latest?.requesterSessionKey);
		if (latest.runId !== run.runId || latestControllerSessionKey !== requesterKey) continue;
		const existing = dedupedRunsByChildKey.get(childKey);
		if (!existing || run.createdAt >= existing.createdAt) dedupedRunsByChildKey.set(childKey, run);
	}
	const runs = Array.from(dedupedRunsByChildKey.values());
	if (runs.length === 0) return { stopped: 0 };
	const seenChildKeys = /* @__PURE__ */ new Set();
	let stopped = 0;
	for (const run of runs) {
		const childKey = normalizeOptionalString(run.childSessionKey);
		if (!childKey || seenChildKeys.has(childKey)) continue;
		seenChildKeys.add(childKey);
		if (!run.endedAt) {
			const cleared = clearSessionQueues([childKey]);
			const parsed = parseAgentSessionKey(childKey);
			const storePath = resolveStorePath(params.cfg.session?.store, { agentId: parsed?.agentId });
			const aborted = abortSessionRunTarget({
				key: childKey,
				sessionId: replyRunRegistry.resolveSessionId(childKey) ?? loadSessionEntry({
					agentId: parsed?.agentId,
					clone: false,
					sessionKey: childKey,
					storePath
				})?.sessionId
			});
			if (abortDeps.markSubagentRunTerminated({
				runId: run.runId,
				childSessionKey: childKey,
				reason: "killed"
			}) > 0 || aborted || cleared.followupCleared > 0 || cleared.laneCleared > 0) stopped += 1;
		}
		const cascadeResult = stopSubagentsForRequester({
			cfg: params.cfg,
			requesterSessionKey: childKey
		});
		stopped += cascadeResult.stopped;
	}
	if (stopped > 0) logVerbose(`abort: stopped ${stopped} subagent run(s) for ${requesterKey}`);
	return { stopped };
}
async function tryFastAbortFromMessage(params) {
	const { ctx, cfg } = params;
	const commandSessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.ParentSessionKey);
	const targetKey = normalizeOptionalString(ctx.CommandTargetSessionKey) ?? commandSessionKey;
	const raw = stripStructuralPrefixes(ctx.CommandBody ?? ctx.RawBody ?? ctx.Body ?? "");
	if (!isAbortRequestText(normalizeOptionalLowercaseString(ctx.ChatType) === "group" ? stripMentions(raw, ctx, cfg, resolveSessionAgentId({
		sessionKey: targetKey ?? ctx.SessionKey ?? "",
		config: cfg
	})) : raw)) return {
		handled: false,
		aborted: false
	};
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
	const agentId = resolveSessionAgentId({
		sessionKey: targetKey ?? ctx.SessionKey ?? "",
		config: cfg
	});
	const abortKey = targetKey ?? auth.from ?? auth.to;
	const requesterSessionKey = targetKey ?? ctx.SessionKey ?? abortKey;
	if (targetKey) {
		const storePath = resolveStorePath(cfg.session?.store, { agentId });
		const abortCutoffForTarget = (target) => shouldPersistAbortCutoff({
			commandSessionKey,
			targetSessionKey: target.sessionKey
		}) ? resolveAbortCutoffFromContext(ctx) : void 0;
		let resolvedAbortTarget = null;
		try {
			resolvedAbortTarget = abortDeps.resolveSessionAbortTarget({
				agentId,
				sessionKey: targetKey,
				storePath
			});
		} catch (error) {
			logVerbose(`abort: failed to resolve abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
		}
		const resolvedTargetKey = resolvedAbortTarget?.sessionKey ?? targetKey;
		const conversationBoundAcpTargetKey = commandSessionKey ? resolveBoundAcpAbortTargetSessionKey({
			ctx,
			cfg,
			activeSessionKey: commandSessionKey
		}) : void 0;
		const boundAcpTargetKey = !isAcpSessionKey(resolvedTargetKey) ? conversationBoundAcpTargetKey : void 0;
		const abortTargetKeys = [resolvedTargetKey];
		if (boundAcpTargetKey && boundAcpTargetKey !== resolvedTargetKey) abortTargetKeys.push(boundAcpTargetKey);
		const acpManager = abortDeps.getAcpSessionManager();
		for (const acpTargetKey of abortTargetKeys.filter(isAcpSessionKey)) {
			if (acpManager.resolveSession({
				cfg,
				sessionKey: acpTargetKey
			}).kind === "none") continue;
			try {
				await acpManager.cancelSession({
					cfg,
					sessionKey: acpTargetKey,
					reason: "fast-abort"
				});
			} catch (error) {
				logVerbose(`abort: ACP cancel failed for ${acpTargetKey}: ${formatErrorMessage(error)}`);
			}
		}
		const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
		const sessionIdsByKey = new Map(abortTargetKeys.map((abortTargetKey) => [abortTargetKey, replyRunRegistry.resolveSessionId(abortTargetKey) ?? (abortTargetKey === resolvedTargetKey ? resolvedAbortTarget?.sessionId : resolveStoredSessionId({
			cfg,
			sessionKey: abortTargetKey
		}))]));
		let aborted = false;
		for (const abortTargetKey of abortTargetKeys) aborted = abortSessionRunTarget({
			key: abortTargetKey,
			sessionId: sessionIdsByKey.get(abortTargetKey)
		}) || aborted;
		const sourceSessionId = sourceAbortKey ? replyRunRegistry.resolveSessionId(sourceAbortKey) ?? resolveStoredSessionId({
			cfg,
			sessionKey: sourceAbortKey
		}) : void 0;
		if (sourceAbortKey) aborted = abortSessionRunTarget({
			key: sourceAbortKey,
			sessionId: sourceSessionId
		}) || aborted;
		const cleared = clearSessionQueues(abortTargetKeys.flatMap((abortTargetKey) => [abortTargetKey, sessionIdsByKey.get(abortTargetKey)]).concat(sourceAbortKey, sourceSessionId));
		if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
		const { stopped } = stopSubagentsForRequester({
			cfg,
			requesterSessionKey
		});
		let persistedAbortTarget = null;
		try {
			persistedAbortTarget = await abortDeps.markSessionAbortTarget({
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
		if (persistedAbortTarget?.persisted !== true && abortMemoryKey && !hasAbortTargetEntry) setAbortMemory(abortMemoryKey, true);
		return {
			handled: true,
			aborted,
			stoppedSubagents: stopped
		};
	}
	if (abortKey) setAbortMemory(abortKey, true);
	const { stopped } = stopSubagentsForRequester({
		cfg,
		requesterSessionKey
	});
	return {
		handled: true,
		aborted: false,
		stoppedSubagents: stopped
	};
}
//#endregion
export { tryFastAbortFromMessage as i, formatAbortReplyText as n, stopSubagentsForRequester as r, abortSessionRunTarget as t };
