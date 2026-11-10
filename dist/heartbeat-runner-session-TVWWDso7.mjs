import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { d as readSessionEntryInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-TMTpLGFx.mjs";
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
	const selectSession = (sessionKey = mainSessionKey, suppressOriginatingContext = false) => ({
		sessionKey,
		storePath,
		suppressOriginatingContext
	});
	if (scope === "global") return selectSession();
	const resolveCandidate = (requestKey) => {
		const candidate = toAgentStoreSessionKey({
			agentId: resolvedAgentId,
			requestKey,
			mainKey: cfg.session?.mainKey
		});
		if (isSubagentSessionKey(candidate)) return;
		const canonical = canonicalizeMainSessionAlias({
			cfg,
			agentId: resolvedAgentId,
			sessionKey: candidate
		});
		return canonical !== "global" && !isSubagentSessionKey(canonical) && resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId) ? canonical : void 0;
	};
	const forced = forcedSessionKey?.trim();
	if (forced && isSubagentSessionKey(forced)) return selectSession(mainSessionKey, true);
	const forcedCanonical = forced ? resolveCandidate(forced) : void 0;
	if (forcedCanonical) return selectSession(resolveMainScopedEventSessionKey({
		cfg,
		sessionKey: forcedCanonical,
		agentId: resolvedAgentId
	}) ?? forcedCanonical);
	const trimmed = heartbeat?.session?.trim() ?? "";
	if (!trimmed || isSubagentSessionKey(trimmed)) return selectSession();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (normalized === "main" || normalized === "global") return selectSession();
	return selectSession(resolveCandidate(trimmed) || mainSessionKey);
}
async function resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
	return {
		...resolved,
		entry: await readSessionEntryInWorker({
			agentId,
			storePath: resolved.storePath,
			sessionKey: resolved.sessionKey,
			env
		})
	};
}
function isHeartbeatSessionOf(sessionKey, baseSessionKey) {
	return sessionKey.startsWith(baseSessionKey) && /^(:heartbeat)+$/.test(sessionKey.slice(baseSessionKey.length));
}
function resolveIsolatedHeartbeatSessionKey(params) {
	const storedBaseSessionKey = params.sessionEntry?.heartbeatIsolatedBaseSessionKey?.trim();
	if (params.configuredSessionKey === "global") {
		const isolatedSessionKey = toAgentStoreSessionKey({
			agentId: params.agentId,
			requestKey: "global:heartbeat"
		});
		if (params.sessionKey === "global" || storedBaseSessionKey === "global" && (params.sessionKey === isolatedSessionKey || isHeartbeatSessionOf(params.sessionKey, isolatedSessionKey))) return {
			isolatedSessionKey,
			isolatedBaseSessionKey: "global"
		};
	}
	let isolatedBaseSessionKey = params.sessionKey;
	if (storedBaseSessionKey && isHeartbeatSessionOf(params.sessionKey, storedBaseSessionKey)) isolatedBaseSessionKey = storedBaseSessionKey;
	else if (isHeartbeatSessionOf(params.sessionKey, params.configuredSessionKey) && !params.configuredSessionKey.endsWith(":heartbeat")) isolatedBaseSessionKey = params.configuredSessionKey;
	return {
		isolatedSessionKey: `${isolatedBaseSessionKey}:heartbeat`,
		isolatedBaseSessionKey
	};
}
/** Selects the execution key and descriptive conversation for an already-resolved event queue. */
async function resolveHeartbeatSessionSelection(cfg, agentId, heartbeat, session, isolated, env = process.env) {
	if (!isolated) return {
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
		conversationEntry: isolatedBaseSessionKey === session.sessionKey ? session.entry : await readSessionEntryInWorker({
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
	return isHeartbeatSessionOf(params.sessionKey, params.isolatedBaseSessionKey) ? params.sessionKey : void 0;
}
async function restoreHeartbeatUpdatedAt(params) {
	const { updatedAt, ...scope } = params;
	if (typeof updatedAt !== "number") return;
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
