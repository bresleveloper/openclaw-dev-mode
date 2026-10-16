import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { p as parseDiscordTarget } from "./send.receipt-DVOg2Oaw.mjs";
import "./targets-bqXQENmX.mjs";
import { C as getThreadBindingToken, E as refreshUnboundThreadWebhookIdentity, F as resolveThreadBindingMaxAgeMs$1, M as resolveThreadBindingIdleTimeoutMs$1, N as resolveThreadBindingInactivityExpiresAt, P as resolveThreadBindingMaxAgeExpiresAt, _ as MANAGERS_BY_ACCOUNT_ID, a as mutateBindingsForTargetSession, g as BINDINGS_BY_THREAD_ID, i as setThreadBindingMaxAgeBySessionKeyAsync, n as setThreadBindingIdleTimeoutBySessionKeyAsync, o as resolveBindingIdsForTargetSession, r as setThreadBindingMaxAgeBySessionKey, t as setThreadBindingIdleTimeoutBySessionKey, u as removeBindingRecordSync } from "./thread-bindings.session-updates-Bu_CGr_O.mjs";
import { c as resolveThreadBindingPersonaFromRecord, i as createNoopThreadBindingManager, n as getThreadBindingManager, o as resolveChannelIdForBinding, s as resolveThreadBindingPersona, t as createThreadBindingManager } from "./thread-bindings.manager-D2-GYZ5s.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalStringifiedId, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { formatThreadBindingDurationLabel as formatThreadBindingDurationLabel$1, resolveThreadBindingIdleTimeoutMs, resolveThreadBindingIntroText, resolveThreadBindingIntroText as resolveThreadBindingIntroText$1, resolveThreadBindingMaxAgeMs, resolveThreadBindingThreadName, resolveThreadBindingThreadName as resolveThreadBindingThreadName$1, resolveThreadBindingsEnabled } from "openclaw/plugin-sdk/conversation-runtime";
import { readAcpSessionEntry } from "openclaw/plugin-sdk/acp-runtime";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
//#region extensions/discord/src/monitor/thread-bindings.config.ts
function resolveDiscordThreadBindingIdleTimeoutMs(params) {
	const accountId = normalizeAccountId(params.accountId);
	const root = params.cfg.channels?.discord?.threadBindings;
	const account = params.cfg.channels?.discord?.accounts?.[accountId]?.threadBindings;
	return resolveThreadBindingIdleTimeoutMs({
		channelIdleHoursRaw: account?.idleHours ?? root?.idleHours,
		sessionIdleHoursRaw: params.cfg.session?.threadBindings?.idleHours
	});
}
function resolveDiscordThreadBindingMaxAgeMs(params) {
	const accountId = normalizeAccountId(params.accountId);
	const root = params.cfg.channels?.discord?.threadBindings;
	const account = params.cfg.channels?.discord?.accounts?.[accountId]?.threadBindings;
	return resolveThreadBindingMaxAgeMs({
		channelMaxAgeHoursRaw: account?.maxAgeHours ?? root?.maxAgeHours,
		sessionMaxAgeHoursRaw: params.cfg.session?.threadBindings?.maxAgeHours
	});
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.lifecycle.ts
const ACP_STARTUP_HEALTH_PROBE_CONCURRENCY_LIMIT = 8;
function listThreadBindingsForAccount(accountId) {
	return getThreadBindingManager(accountId)?.listBindings() ?? [];
}
function listThreadBindingsBySessionKey(params) {
	return resolveBindingIdsForTargetSession(params).map((bindingKey) => BINDINGS_BY_THREAD_ID.get(bindingKey)).filter((entry) => Boolean(entry));
}
async function autoBindSpawnedDiscordSubagent(params) {
	if (normalizeOptionalLowercaseString(params.channel) !== "discord") return null;
	const manager = getThreadBindingManager(params.accountId);
	if (!manager) return null;
	const managerToken = getThreadBindingToken(manager.accountId);
	const requesterThreadId = normalizeOptionalStringifiedId(params.threadId);
	let channelId = "";
	if (requesterThreadId) {
		const existing = manager.getByThreadId(requesterThreadId);
		if (existing?.channelId?.trim()) channelId = existing.channelId.trim();
		else channelId = await resolveChannelIdForBinding({
			cfg: params.cfg,
			accountId: manager.accountId,
			token: managerToken,
			threadId: requesterThreadId
		}) ?? "";
	}
	if (!channelId) {
		const to = normalizeOptionalString(params.to) ?? "";
		if (!to) return null;
		try {
			const target = parseDiscordTarget(to, { defaultKind: "channel" });
			if (!target || target.kind !== "channel") return null;
			channelId = await resolveChannelIdForBinding({
				cfg: params.cfg,
				accountId: manager.accountId,
				token: managerToken,
				threadId: target.id
			}) ?? "";
		} catch {
			return null;
		}
	}
	return await manager.bindTarget({
		threadId: void 0,
		channelId,
		createThread: true,
		threadName: resolveThreadBindingThreadName({
			agentId: params.agentId,
			label: params.label
		}),
		targetKind: "subagent",
		targetSessionKey: params.childSessionKey,
		agentId: params.agentId,
		label: params.label,
		boundBy: params.boundBy ?? "system",
		introText: resolveThreadBindingIntroText({
			agentId: params.agentId,
			label: params.label,
			idleTimeoutMs: manager.getIdleTimeoutMs(),
			maxAgeMs: manager.getMaxAgeMs()
		})
	});
}
/** @deprecated Public SDK compatibility; bundled callers use the awaited variant. */
function unbindThreadBindingsBySessionKey(params) {
	const ids = resolveBindingIdsForTargetSession(params);
	if (ids.length === 0) return [];
	const removed = [];
	for (const bindingKey of ids) {
		const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!record) continue;
		const manager = MANAGERS_BY_ACCOUNT_ID.get(record.accountId);
		if (manager?.isStopping()) throw new Error("Discord thread binding manager is stopping");
		const unbound = removeBindingRecordSync(bindingKey);
		if (unbound) {
			if (manager) manager.notifyUnbound(unbound, params);
			else refreshUnboundThreadWebhookIdentity(unbound);
			removed.push(unbound);
		}
	}
	return removed;
}
async function unbindThreadBindingsBySessionKeyAsync(input) {
	const params = { ...input };
	return mutateBindingsForTargetSession(params, () => null, (record, manager) => {
		if (manager) manager.notifyUnbound(record, params);
		else refreshUnboundThreadWebhookIdentity(record);
	});
}
async function reconcileAcpThreadBindingsOnStartup(params) {
	const manager = getThreadBindingManager(params.accountId);
	if (!manager) return {
		checked: 0,
		removed: 0,
		staleSessionKeys: []
	};
	const acpBindings = manager.listBindings().filter((binding) => binding.targetKind === "acp" && binding.metadata?.pluginBindingOwner !== "plugin");
	const staleBindings = [];
	const probeTargets = [];
	for (const binding of acpBindings) {
		const sessionKey = binding.targetSessionKey.trim();
		if (!sessionKey) {
			staleBindings.push(binding);
			continue;
		}
		const session = readAcpSessionEntry({
			cfg: params.cfg,
			sessionKey,
			agentId: binding.agentId
		});
		if (!session) {
			staleBindings.push(binding);
			continue;
		}
		if (session.storeReadFailed) continue;
		if (!session.acp) {
			staleBindings.push(binding);
			continue;
		}
		if (!params.healthProbe) continue;
		probeTargets.push({
			binding,
			sessionKey,
			session
		});
	}
	if (params.healthProbe && probeTargets.length > 0) {
		const { results: probeResults } = await runTasksWithConcurrency({
			tasks: probeTargets.map(({ binding, sessionKey, session }) => async () => {
				try {
					return {
						binding,
						status: (await params.healthProbe?.({
							cfg: params.cfg,
							accountId: manager.accountId,
							sessionKey,
							binding,
							session
						}))?.status ?? "uncertain"
					};
				} catch {
					return {
						binding,
						status: "uncertain"
					};
				}
			}),
			limit: ACP_STARTUP_HEALTH_PROBE_CONCURRENCY_LIMIT,
			errorMode: "stop",
			throwOnError: true
		});
		for (const probeResult of probeResults) if (probeResult.status === "stale") staleBindings.push(probeResult.binding);
	}
	if (staleBindings.length === 0) return {
		checked: acpBindings.length,
		removed: 0,
		staleSessionKeys: []
	};
	const staleSessionKeys = [];
	let removed = 0;
	for (const binding of staleBindings) {
		staleSessionKeys.push(binding.targetSessionKey);
		if (getThreadBindingManager(manager.accountId) !== manager || manager.getByThreadId(binding.threadId) !== binding) continue;
		if (await manager.unbindThread({
			threadId: binding.threadId,
			expected: binding,
			reason: "stale-session",
			sendFarewell: params.sendFarewell ?? false
		})) removed += 1;
	}
	return {
		checked: acpBindings.length,
		removed,
		staleSessionKeys: uniqueStrings(staleSessionKeys)
	};
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.ts
var thread_bindings_exports = /* @__PURE__ */ __exportAll({
	autoBindSpawnedDiscordSubagent: () => autoBindSpawnedDiscordSubagent,
	createNoopThreadBindingManager: () => createNoopThreadBindingManager,
	createThreadBindingManager: () => createThreadBindingManager,
	formatThreadBindingDurationLabel: () => formatThreadBindingDurationLabel$1,
	getThreadBindingManager: () => getThreadBindingManager,
	listThreadBindingsBySessionKey: () => listThreadBindingsBySessionKey,
	listThreadBindingsForAccount: () => listThreadBindingsForAccount,
	reconcileAcpThreadBindingsOnStartup: () => reconcileAcpThreadBindingsOnStartup,
	resolveDiscordThreadBindingIdleTimeoutMs: () => resolveDiscordThreadBindingIdleTimeoutMs,
	resolveDiscordThreadBindingMaxAgeMs: () => resolveDiscordThreadBindingMaxAgeMs,
	resolveThreadBindingIdleTimeoutMs: () => resolveThreadBindingIdleTimeoutMs$1,
	resolveThreadBindingInactivityExpiresAt: () => resolveThreadBindingInactivityExpiresAt,
	resolveThreadBindingIntroText: () => resolveThreadBindingIntroText$1,
	resolveThreadBindingMaxAgeExpiresAt: () => resolveThreadBindingMaxAgeExpiresAt,
	resolveThreadBindingMaxAgeMs: () => resolveThreadBindingMaxAgeMs$1,
	resolveThreadBindingPersona: () => resolveThreadBindingPersona,
	resolveThreadBindingPersonaFromRecord: () => resolveThreadBindingPersonaFromRecord,
	resolveThreadBindingThreadName: () => resolveThreadBindingThreadName$1,
	resolveThreadBindingsEnabled: () => resolveThreadBindingsEnabled,
	setThreadBindingIdleTimeoutBySessionKey: () => setThreadBindingIdleTimeoutBySessionKey,
	setThreadBindingIdleTimeoutBySessionKeyAsync: () => setThreadBindingIdleTimeoutBySessionKeyAsync,
	setThreadBindingMaxAgeBySessionKey: () => setThreadBindingMaxAgeBySessionKey,
	setThreadBindingMaxAgeBySessionKeyAsync: () => setThreadBindingMaxAgeBySessionKeyAsync,
	unbindThreadBindingsBySessionKey: () => unbindThreadBindingsBySessionKey,
	unbindThreadBindingsBySessionKeyAsync: () => unbindThreadBindingsBySessionKeyAsync
});
//#endregion
export { autoBindSpawnedDiscordSubagent as a, reconcileAcpThreadBindingsOnStartup as c, resolveDiscordThreadBindingIdleTimeoutMs as d, resolveDiscordThreadBindingMaxAgeMs as f, thread_bindings_exports as i, unbindThreadBindingsBySessionKey as l, resolveThreadBindingIntroText$1 as n, listThreadBindingsBySessionKey as o, resolveThreadBindingsEnabled as p, resolveThreadBindingThreadName$1 as r, listThreadBindingsForAccount as s, formatThreadBindingDurationLabel$1 as t, unbindThreadBindingsBySessionKeyAsync as u };
