import { Ut as __exportAll } from "./discord-BXpHW-cu.mjs";
import { y as parseDiscordTarget } from "./retry-BEYkDy0P.mjs";
import "./targets-CvemhN3i.mjs";
import { C as resolveThreadBindingMaxAgeMs$1, D as shouldPersistBindingMutations, S as resolveThreadBindingMaxAgeExpiresAt, b as resolveThreadBindingIdleTimeoutMs$1, f as normalizeThreadId, g as removeBindingRecord, l as getThreadBindingToken, n as MANAGERS_BY_ACCOUNT_ID, p as refreshUnboundThreadWebhookIdentity, t as BINDINGS_BY_THREAD_ID, w as saveBindingsToDisk, x as resolveThreadBindingInactivityExpiresAt } from "./thread-bindings.state-BThFQEga.mjs";
import { n as setThreadBindingMaxAgeBySessionKey, r as resolveBindingIdsForTargetSession, t as setThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings.session-updates-DCQq1WZ5.mjs";
import { a as createNoopThreadBindingManager, c as resolveThreadBindingPersona, d as resolveThreadBindingIntroText, f as resolveThreadBindingThreadName, l as resolveThreadBindingPersonaFromRecord, r as getThreadBindingManager, s as resolveChannelIdForBinding, t as createThreadBindingManager, u as formatThreadBindingDurationLabel } from "./thread-bindings.manager-ve-i6oqt.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalLowercaseString, normalizeOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveThreadBindingIdleTimeoutMs, resolveThreadBindingMaxAgeMs, resolveThreadBindingsEnabled } from "openclaw/plugin-sdk/conversation-runtime";
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
	const manager = getThreadBindingManager(accountId);
	if (!manager) return [];
	return manager.listBindings();
}
function listThreadBindingsBySessionKey(params) {
	return resolveBindingIdsForTargetSession(params).map((bindingKey) => BINDINGS_BY_THREAD_ID.get(bindingKey)).filter((entry) => Boolean(entry));
}
async function autoBindSpawnedDiscordSubagent(params) {
	if (normalizeOptionalLowercaseString(params.channel) !== "discord") return null;
	const manager = getThreadBindingManager(params.accountId);
	if (!manager) return null;
	const managerToken = getThreadBindingToken(manager.accountId);
	const requesterThreadId = normalizeThreadId(params.threadId);
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
function unbindThreadBindingsBySessionKey(params) {
	const ids = resolveBindingIdsForTargetSession(params);
	if (ids.length === 0) return [];
	const removed = [];
	for (const bindingKey of ids) {
		const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!record) continue;
		const manager = MANAGERS_BY_ACCOUNT_ID.get(record.accountId);
		if (manager) {
			const unbound = manager.unbindThread({
				threadId: record.threadId,
				reason: params.reason,
				sendFarewell: params.sendFarewell,
				farewellText: params.farewellText
			});
			if (unbound) removed.push(unbound);
			continue;
		}
		const unbound = removeBindingRecord(bindingKey);
		if (unbound) {
			refreshUnboundThreadWebhookIdentity(unbound);
			removed.push(unbound);
		}
	}
	if (removed.length > 0 && shouldPersistBindingMutations()) saveBindingsToDisk({ force: true });
	return removed;
}
function resolveStoredAcpBindingHealth(params) {
	if (!params.session.acp) return "stale";
	return "healthy";
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
		if (resolveStoredAcpBindingHealth({ session }) === "stale") {
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
		if (manager.unbindThread({
			threadId: binding.threadId,
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
	formatThreadBindingDurationLabel: () => formatThreadBindingDurationLabel,
	getThreadBindingManager: () => getThreadBindingManager,
	listThreadBindingsBySessionKey: () => listThreadBindingsBySessionKey,
	listThreadBindingsForAccount: () => listThreadBindingsForAccount,
	reconcileAcpThreadBindingsOnStartup: () => reconcileAcpThreadBindingsOnStartup,
	resolveDiscordThreadBindingIdleTimeoutMs: () => resolveDiscordThreadBindingIdleTimeoutMs,
	resolveDiscordThreadBindingMaxAgeMs: () => resolveDiscordThreadBindingMaxAgeMs,
	resolveThreadBindingIdleTimeoutMs: () => resolveThreadBindingIdleTimeoutMs$1,
	resolveThreadBindingInactivityExpiresAt: () => resolveThreadBindingInactivityExpiresAt,
	resolveThreadBindingIntroText: () => resolveThreadBindingIntroText,
	resolveThreadBindingMaxAgeExpiresAt: () => resolveThreadBindingMaxAgeExpiresAt,
	resolveThreadBindingMaxAgeMs: () => resolveThreadBindingMaxAgeMs$1,
	resolveThreadBindingPersona: () => resolveThreadBindingPersona,
	resolveThreadBindingPersonaFromRecord: () => resolveThreadBindingPersonaFromRecord,
	resolveThreadBindingThreadName: () => resolveThreadBindingThreadName,
	resolveThreadBindingsEnabled: () => resolveThreadBindingsEnabled,
	setThreadBindingIdleTimeoutBySessionKey: () => setThreadBindingIdleTimeoutBySessionKey,
	setThreadBindingMaxAgeBySessionKey: () => setThreadBindingMaxAgeBySessionKey,
	unbindThreadBindingsBySessionKey: () => unbindThreadBindingsBySessionKey
});
//#endregion
export { reconcileAcpThreadBindingsOnStartup as a, resolveDiscordThreadBindingMaxAgeMs as c, listThreadBindingsForAccount as i, resolveThreadBindingsEnabled as l, autoBindSpawnedDiscordSubagent as n, unbindThreadBindingsBySessionKey as o, listThreadBindingsBySessionKey as r, resolveDiscordThreadBindingIdleTimeoutMs as s, thread_bindings_exports as t };
