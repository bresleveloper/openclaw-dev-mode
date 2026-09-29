import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { S as isSubagentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-Dc7D6ZvV.mjs";
//#region src/infra/heartbeat-runner-session.ts
function resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const sessionCfg = cfg.session;
	const scope = sessionCfg?.scope ?? "per-sender";
	const resolvedAgentId = normalizeAgentId(agentId);
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: resolvedAgentId
	});
	const storePath = resolveSessionStorePathCore(sessionCfg?.store, {
		agentId: resolvedAgentId,
		env
	});
	const mainSession = (suppressOriginatingContext = false) => ({
		sessionKey: mainSessionKey,
		storePath,
		suppressOriginatingContext
	});
	if (scope === "global") return mainSession();
	const forced = forcedSessionKey?.trim();
	if (forced && isSubagentSessionKey(forced)) return mainSession(true);
	if (forced && !isSubagentSessionKey(forced)) {
		const forcedCandidate = toAgentStoreSessionKey({
			agentId: resolvedAgentId,
			requestKey: forced,
			mainKey: cfg.session?.mainKey
		});
		if (!isSubagentSessionKey(forcedCandidate)) {
			const forcedCanonical = canonicalizeMainSessionAlias({
				cfg,
				agentId: resolvedAgentId,
				sessionKey: forcedCandidate
			});
			if (forcedCanonical !== "global" && !isSubagentSessionKey(forcedCanonical)) {
				if (resolveAgentIdFromSessionKey(forcedCanonical) === normalizeAgentId(resolvedAgentId)) return {
					sessionKey: resolveMainScopedEventSessionKey({
						cfg,
						sessionKey: forcedCanonical,
						agentId: resolvedAgentId
					}) ?? forcedCanonical,
					storePath,
					suppressOriginatingContext: false
				};
			}
		}
	}
	const trimmed = heartbeat?.session?.trim() ?? "";
	if (!trimmed || isSubagentSessionKey(trimmed)) return mainSession();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (normalized === "main" || normalized === "global") return mainSession();
	const candidate = toAgentStoreSessionKey({
		agentId: resolvedAgentId,
		requestKey: trimmed,
		mainKey: cfg.session?.mainKey
	});
	if (isSubagentSessionKey(candidate)) return mainSession();
	const canonical = canonicalizeMainSessionAlias({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: candidate
	});
	if (canonical !== "global" && !isSubagentSessionKey(canonical)) {
		if (resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId)) return {
			sessionKey: canonical,
			storePath,
			suppressOriginatingContext: false
		};
	}
	return mainSession();
}
function resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
	return {
		...resolved,
		entry: loadSessionEntry({
			agentId,
			storePath: resolved.storePath,
			sessionKey: resolved.sessionKey,
			env
		})
	};
}
function resolveIsolatedHeartbeatSessionKey(params) {
	const storedBaseSessionKey = params.sessionEntry?.heartbeatIsolatedBaseSessionKey?.trim();
	if (params.configuredSessionKey === "global") {
		const isolatedSessionKey = toAgentStoreSessionKey({
			agentId: params.agentId,
			requestKey: "global:heartbeat"
		});
		const suffix = params.sessionKey.slice(isolatedSessionKey.length);
		if (params.sessionKey === "global" || storedBaseSessionKey === "global" && (params.sessionKey === isolatedSessionKey || params.sessionKey.startsWith(isolatedSessionKey) && /^(:heartbeat)+$/.test(suffix))) return {
			isolatedSessionKey,
			isolatedBaseSessionKey: "global"
		};
	}
	if (storedBaseSessionKey) {
		const suffix = params.sessionKey.slice(storedBaseSessionKey.length);
		if (params.sessionKey.startsWith(storedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return {
			isolatedSessionKey: `${storedBaseSessionKey}:heartbeat`,
			isolatedBaseSessionKey: storedBaseSessionKey
		};
	}
	const configuredSuffix = params.sessionKey.slice(params.configuredSessionKey.length);
	if (params.sessionKey.startsWith(params.configuredSessionKey) && /^(:heartbeat)+$/.test(configuredSuffix) && !params.configuredSessionKey.endsWith(":heartbeat")) return {
		isolatedSessionKey: `${params.configuredSessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.configuredSessionKey
	};
	return {
		isolatedSessionKey: `${params.sessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.sessionKey
	};
}
/** Selects the event queue, execution key and descriptive conversation before delivery. */
function resolveHeartbeatSessionSelection(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const session = resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env);
	if (heartbeat?.isolatedSession !== true) return {
		...session,
		run: {
			kind: "shared",
			sessionKey: session.sessionKey
		},
		conversationEntry: session.entry,
		inspectsRunQueue: true
	};
	const configured = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, void 0, env);
	const { isolatedSessionKey, isolatedBaseSessionKey } = resolveIsolatedHeartbeatSessionKey({
		agentId,
		sessionKey: session.sessionKey,
		configuredSessionKey: configured.sessionKey,
		sessionEntry: session.entry
	});
	return {
		...session,
		run: {
			kind: "isolated",
			sessionKey: isolatedSessionKey,
			baseSessionKey: isolatedBaseSessionKey
		},
		conversationEntry: isolatedBaseSessionKey === session.sessionKey ? session.entry : loadSessionEntry({
			agentId,
			storePath: session.storePath,
			sessionKey: isolatedBaseSessionKey,
			env
		}),
		inspectsRunQueue: session.sessionKey !== isolatedBaseSessionKey
	};
}
function resolveStaleHeartbeatIsolatedSessionKey(params) {
	if (params.sessionKey === params.isolatedSessionKey) return;
	const suffix = params.sessionKey.slice(params.isolatedBaseSessionKey.length);
	if (params.sessionKey.startsWith(params.isolatedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return params.sessionKey;
}
async function restoreHeartbeatUpdatedAt(params) {
	const { updatedAt, ...scope } = params;
	if (typeof updatedAt !== "number") return;
	const entry = loadSessionEntry(scope);
	if (!entry || entry.updatedAt === Math.max(entry.updatedAt ?? 0, updatedAt)) return;
	await patchSessionEntryCore(scope, (nextEntry, context) => {
		const resolvedUpdatedAt = Math.max(nextEntry.updatedAt ?? 0, updatedAt);
		return context.existingEntry && nextEntry.updatedAt !== resolvedUpdatedAt ? {
			...nextEntry,
			updatedAt: resolvedUpdatedAt
		} : null;
	}, { replaceEntry: true });
}
//#endregion
export { restoreHeartbeatUpdatedAt as a, resolveStaleHeartbeatIsolatedSessionKey as i, resolveHeartbeatSessionKey as n, resolveHeartbeatSessionSelection as r, resolveHeartbeatSession as t };
