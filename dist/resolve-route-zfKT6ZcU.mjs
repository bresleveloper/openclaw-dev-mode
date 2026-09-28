import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { i as buildAgentPeerSessionKey, p as sanitizeAgentId, t as DEFAULT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { a as routeBindingScopeMatches, n as normalizeRouteBindingId, r as normalizeRouteBindingRoles } from "./binding-scope-DY44yLIJ.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { t as logDebug } from "./logger-BHMMVs5C.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as listBindings } from "./bindings-CUbRLEEv.mjs";
//#region src/routing/peer-kind-match.ts
function peerKindMatches(bindingKind, scopeKind) {
	if (bindingKind === scopeKind) return true;
	return bindingKind === "group" && scopeKind === "channel" || bindingKind === "channel" && scopeKind === "group";
}
//#endregion
//#region src/routing/resolve-route.ts
function deriveLastRoutePolicy(params) {
	return params.sessionKey === params.mainSessionKey ? "main" : "session";
}
function resolveInboundLastRouteSessionKey(params) {
	return params.route.lastRoutePolicy === "main" ? params.route.mainSessionKey : params.sessionKey;
}
function buildAgentSessionKey(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
	const peer = params.peer;
	return buildAgentPeerSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey ?? "main",
		channel,
		accountId: params.accountId,
		peerKind: peer?.kind ?? "direct",
		peerId: peer ? normalizeRouteBindingId(peer.id) || "unknown" : null,
		dmScope: params.dmScope,
		groupScope: params.groupScope,
		identityLinks: params.identityLinks
	});
}
const agentLookupCacheByCfg = /* @__PURE__ */ new WeakMap();
function resolveAgentLookupCache(cfg) {
	const agentsRef = cfg.agents;
	const existing = agentLookupCacheByCfg.get(cfg);
	if (existing && existing.agentsRef === agentsRef) return existing;
	const byNormalizedId = /* @__PURE__ */ new Map();
	for (const agent of listAgentEntries(cfg)) {
		const rawId = agent.id?.trim();
		if (!rawId) continue;
		byNormalizedId.set(normalizeAgentId(rawId), sanitizeAgentId(rawId));
	}
	const next = {
		agentsRef,
		byNormalizedId,
		fallbackSoleAgentId: tryResolveLegacyCompatibilityAgentId(cfg)
	};
	agentLookupCacheByCfg.set(cfg, next);
	return next;
}
function pickFirstExistingAgentId(cfg, agentId) {
	const lookup = resolveAgentLookupCache(cfg);
	const trimmed = (agentId ?? "").trim();
	if (!trimmed) return sanitizeAgentId(lookup.fallbackSoleAgentId ?? resolveDefaultAgentId(cfg, {
		surface: "agent lookup",
		hint: "Pass an explicit agent id instead of relying on an implicit route."
	}));
	const normalized = normalizeAgentId(trimmed);
	const resolved = lookup.byNormalizedId.get(normalized);
	if (resolved) return resolved;
	if (normalized === "main") return DEFAULT_AGENT_ID;
	if (lookup.byNormalizedId.size === 0) return sanitizeAgentId(trimmed);
	throw new AgentSelectionRequiredError([...lookup.byNormalizedId.values()], {
		surface: "route binding",
		hint: `Update the binding agentId "${trimmed}" to a configured agent.`
	});
}
const evaluatedBindingsCacheByCfg = /* @__PURE__ */ new WeakMap();
const MAX_EVALUATED_BINDINGS_CACHE_KEYS = 2e3;
const resolvedRouteCacheByCfg = /* @__PURE__ */ new WeakMap();
const MAX_RESOLVED_ROUTE_CACHE_KEYS = 4e3;
function buildEvaluatedBindingsByChannel(cfg) {
	const byChannel = /* @__PURE__ */ new Map();
	let order = 0;
	for (const binding of listBindings(cfg)) {
		if (!binding || typeof binding !== "object") continue;
		const channel = normalizeLowercaseStringOrEmpty(binding.match?.channel);
		if (!channel) continue;
		const match = normalizeBindingMatch(binding.match);
		if (match.peer.state === "invalid") continue;
		const evaluated = {
			binding,
			match,
			order
		};
		order += 1;
		let bucket = byChannel.get(channel);
		if (!bucket) {
			bucket = {
				byAccount: /* @__PURE__ */ new Map(),
				byAnyAccount: []
			};
			byChannel.set(channel, bucket);
		}
		if (match.accountPattern === "*") {
			bucket.byAnyAccount.push(evaluated);
			continue;
		}
		const accountKey = normalizeAccountId(match.accountPattern);
		const existing = bucket.byAccount.get(accountKey);
		if (existing) {
			existing.push(evaluated);
			continue;
		}
		bucket.byAccount.set(accountKey, [evaluated]);
	}
	return byChannel;
}
function mergeEvaluatedBindingsInSourceOrder(accountScoped, anyAccount) {
	if (accountScoped.length === 0) return anyAccount;
	if (anyAccount.length === 0) return accountScoped;
	const merged = [];
	let accountIdx = 0;
	let anyIdx = 0;
	while (accountIdx < accountScoped.length && anyIdx < anyAccount.length) {
		const accountBinding = accountScoped[accountIdx];
		const anyBinding = anyAccount[anyIdx];
		if ((accountBinding?.order ?? Number.MAX_SAFE_INTEGER) <= (anyBinding?.order ?? Number.MAX_SAFE_INTEGER)) {
			if (accountBinding) merged.push(accountBinding);
			accountIdx += 1;
			continue;
		}
		if (anyBinding) merged.push(anyBinding);
		anyIdx += 1;
	}
	if (accountIdx < accountScoped.length) merged.push(...accountScoped.slice(accountIdx));
	if (anyIdx < anyAccount.length) merged.push(...anyAccount.slice(anyIdx));
	return merged;
}
function pushToIndexMap(map, key, binding) {
	if (!key) return;
	const existing = map.get(key);
	if (existing) {
		existing.push(binding);
		return;
	}
	map.set(key, [binding]);
}
function peerLookupKey(kind, id) {
	return `${kind === "channel" ? "group" : kind}:${id}`;
}
function buildEvaluatedBindingsIndex(bindings) {
	const byPeer = /* @__PURE__ */ new Map();
	const byPeerWildcard = [];
	const byGuildWithRoles = /* @__PURE__ */ new Map();
	const byGuild = /* @__PURE__ */ new Map();
	const byTeam = /* @__PURE__ */ new Map();
	const byAccount = [];
	const byChannel = [];
	for (const binding of bindings) {
		if (binding.match.peer.state === "valid") {
			pushToIndexMap(byPeer, peerLookupKey(binding.match.peer.kind, binding.match.peer.id), binding);
			continue;
		}
		if (binding.match.peer.state === "wildcard-kind") {
			byPeerWildcard.push(binding);
			continue;
		}
		if (binding.match.guildId && binding.match.roles) {
			pushToIndexMap(byGuildWithRoles, binding.match.guildId, binding);
			continue;
		}
		if (binding.match.guildId && !binding.match.roles) {
			pushToIndexMap(byGuild, binding.match.guildId, binding);
			continue;
		}
		if (binding.match.teamId) {
			pushToIndexMap(byTeam, binding.match.teamId, binding);
			continue;
		}
		if (binding.match.accountPattern !== "*") {
			byAccount.push(binding);
			continue;
		}
		byChannel.push(binding);
	}
	return {
		byPeer,
		byPeerWildcard,
		byGuildWithRoles,
		byGuild,
		byTeam,
		byAccount,
		byChannel
	};
}
function getEvaluatedBindingsForChannelAccount(cfg, channel, accountId) {
	const bindingsRef = cfg.bindings;
	const existing = evaluatedBindingsCacheByCfg.get(cfg);
	const cache = existing && existing.bindingsRef === bindingsRef ? existing : {
		bindingsRef,
		byChannel: buildEvaluatedBindingsByChannel(cfg),
		byChannelAccount: /* @__PURE__ */ new Map()
	};
	if (cache !== existing) evaluatedBindingsCacheByCfg.set(cfg, cache);
	const cacheKey = `${channel}\t${accountId}`;
	const hit = cache.byChannelAccount.get(cacheKey);
	if (hit) return hit;
	const channelBindings = cache.byChannel.get(channel);
	const bindings = mergeEvaluatedBindingsInSourceOrder(channelBindings?.byAccount.get(accountId) ?? [], channelBindings?.byAnyAccount ?? []);
	const evaluated = {
		bindings,
		index: buildEvaluatedBindingsIndex(bindings)
	};
	cache.byChannelAccount.set(cacheKey, evaluated);
	if (cache.byChannelAccount.size > MAX_EVALUATED_BINDINGS_CACHE_KEYS) {
		cache.byChannelAccount.clear();
		cache.byChannelAccount.set(cacheKey, evaluated);
	}
	return evaluated;
}
/** @internal Lists exact DM peers from the canonical channel/account binding index. */
function listExactDirectMessageBindingPeerIds(input) {
	const prefix = "direct:";
	return [...getEvaluatedBindingsForChannelAccount(input.cfg, normalizeLowercaseStringOrEmpty(input.channel), normalizeAccountId(input.accountId)).index.byPeer.keys()].flatMap((key) => key.startsWith(prefix) ? [key.slice(7)] : []);
}
function normalizePeerConstraint(peer) {
	if (!peer) return { state: "none" };
	const kind = normalizeChatType(peer.kind);
	const id = normalizeRouteBindingId(peer.id);
	if (!kind || !id) return { state: "invalid" };
	if (id === "*") return {
		state: "wildcard-kind",
		kind
	};
	return {
		state: "valid",
		kind,
		id
	};
}
function normalizeBindingMatch(match) {
	const rawRoles = match?.roles;
	return {
		accountPattern: (match?.accountId ?? "").trim(),
		peer: normalizePeerConstraint(match?.peer),
		guildId: normalizeRouteBindingId(match?.guildId) || null,
		teamId: normalizeRouteBindingId(match?.teamId) || null,
		roles: normalizeRouteBindingRoles(rawRoles)
	};
}
function resolveRouteCacheForConfig(cfg) {
	const existing = resolvedRouteCacheByCfg.get(cfg);
	if (existing && existing.bindingsRef === cfg.bindings && existing.agentsRef === cfg.agents && existing.sessionRef === cfg.session) return existing.byKey;
	const byKey = /* @__PURE__ */ new Map();
	resolvedRouteCacheByCfg.set(cfg, {
		bindingsRef: cfg.bindings,
		agentsRef: cfg.agents,
		sessionRef: cfg.session,
		byKey
	});
	return byKey;
}
function formatRouteCachePeer(peer) {
	if (!peer) return "-";
	return `${peer.kind}:${peer.id}`;
}
function buildResolvedRouteCacheKey(params) {
	return JSON.stringify([
		params.channel,
		params.defaultAgentId,
		params.accountId,
		formatRouteCachePeer(params.peer),
		formatRouteCachePeer(params.parentPeer),
		params.guildId ?? null,
		params.teamId ?? null,
		params.memberRoleIds.toSorted(),
		params.dmScope,
		params.groupScope
	]);
}
function matchesBindingScope(match, scope) {
	if (match.peer.state === "valid") {
		if (!scope.peer || !peerKindMatches(match.peer.kind, scope.peer.kind) || scope.peer.id !== match.peer.id) return false;
	}
	if (match.peer.state === "wildcard-kind") {
		if (!scope.peer || !peerKindMatches(match.peer.kind, scope.peer.kind)) return false;
	}
	return routeBindingScopeMatches(match, scope);
}
function resolveAgentRoute(input) {
	const channel = normalizeLowercaseStringOrEmpty(input.channel);
	const defaultAgentId = normalizeLowercaseStringOrEmpty(input.defaultAgentId);
	const accountId = normalizeAccountId(input.accountId);
	const peer = input.peer ? {
		kind: normalizeChatType(input.peer.kind) ?? input.peer.kind,
		id: normalizeRouteBindingId(input.peer.id)
	} : null;
	const guildId = normalizeRouteBindingId(input.guildId);
	const teamId = normalizeRouteBindingId(input.teamId);
	const memberRoleIds = input.memberRoleIds ?? [];
	const dmScope = input.dmScope ?? input.cfg.session?.dmScope ?? "main";
	const groupScope = input.groupScope ?? input.cfg.session?.groupScope ?? "per-group";
	const identityLinks = input.cfg.session?.identityLinks;
	const shouldLogDebug = shouldLogVerbose();
	const parentPeer = input.parentPeer ? {
		kind: normalizeChatType(input.parentPeer.kind) ?? input.parentPeer.kind,
		id: normalizeRouteBindingId(input.parentPeer.id)
	} : null;
	const routeCache = !shouldLogDebug && !identityLinks ? resolveRouteCacheForConfig(input.cfg) : null;
	const routeCacheKey = routeCache ? buildResolvedRouteCacheKey({
		channel,
		defaultAgentId,
		accountId,
		peer,
		parentPeer,
		guildId,
		teamId,
		memberRoleIds,
		dmScope,
		groupScope
	}) : "";
	if (routeCache && routeCacheKey) {
		const cachedRoute = routeCache.get(routeCacheKey);
		if (cachedRoute) return { ...cachedRoute };
	}
	const memberRoleIdSet = new Set(memberRoleIds);
	const { bindings, index: bindingsIndex } = getEvaluatedBindingsForChannelAccount(input.cfg, channel, accountId);
	const choose = (agentId, matchedBy, sessionOverride) => {
		const resolvedAgentId = pickFirstExistingAgentId(input.cfg, agentId);
		const effectiveDmScope = sessionOverride?.dmScope ?? dmScope;
		const effectiveGroupScope = sessionOverride?.groupScope ?? groupScope;
		const sessionKey = buildAgentSessionKey({
			agentId: resolvedAgentId,
			mainKey: input.cfg.session?.mainKey,
			channel,
			accountId,
			peer,
			dmScope: effectiveDmScope,
			groupScope: effectiveGroupScope,
			identityLinks
		});
		const mainSessionKey = normalizeLowercaseStringOrEmpty(buildAgentMainSessionKey({
			agentId: resolvedAgentId,
			mainKey: input.cfg.session?.mainKey
		}));
		const route = {
			agentId: resolvedAgentId,
			channel,
			accountId,
			dmScope: effectiveDmScope,
			groupScope: effectiveGroupScope,
			sessionKey,
			mainSessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey,
				mainSessionKey
			}),
			matchedBy
		};
		if (routeCache && routeCacheKey) {
			routeCache.set(routeCacheKey, route);
			if (routeCache.size > MAX_RESOLVED_ROUTE_CACHE_KEYS) {
				routeCache.clear();
				routeCache.set(routeCacheKey, route);
			}
			return { ...route };
		}
		return route;
	};
	const formatPeer = (value) => value?.kind && value?.id ? `${value.kind}:${value.id}` : "none";
	const formatNormalizedPeer = (value) => {
		if (value.state === "none") return "none";
		if (value.state === "invalid") return "invalid";
		if (value.state === "wildcard-kind") return `${value.kind}:*`;
		return `${value.kind}:${value.id}`;
	};
	if (shouldLogDebug) {
		logDebug(`[routing] resolveAgentRoute: channel=${channel} accountId=${accountId} peer=${formatPeer(peer)} guildId=${guildId || "none"} teamId=${teamId || "none"} bindings=${bindings.length}`);
		for (const entry of bindings) logDebug(`[routing] binding: agentId=${entry.binding.agentId} accountPattern=${entry.match.accountPattern || "default"} peer=${formatNormalizedPeer(entry.match.peer)} guildId=${entry.match.guildId ?? "none"} teamId=${entry.match.teamId ?? "none"} roles=${entry.match.roles?.length ?? 0}`);
	}
	const scope = {
		peer,
		guildId,
		teamId,
		memberRoleIds: memberRoleIdSet
	};
	const chooseFrom = (candidates, matchedBy, bindingScope = scope) => {
		const matched = candidates?.find((candidate) => matchesBindingScope(candidate.match, bindingScope));
		if (!matched) return;
		if (shouldLogDebug) logDebug(`[routing] match: matchedBy=${matchedBy} agentId=${matched.binding.agentId}`);
		return choose(matched.binding.agentId, matchedBy, matched.binding.session);
	};
	const route = peer && chooseFrom(bindingsIndex.byPeer.get(peerLookupKey(peer.kind, peer.id)), "binding.peer") || parentPeer?.id && chooseFrom(bindingsIndex.byPeer.get(peerLookupKey(parentPeer.kind, parentPeer.id)), "binding.peer.parent", {
		...scope,
		peer: parentPeer
	}) || peer && chooseFrom(bindingsIndex.byPeerWildcard, "binding.peer.wildcard") || guildId && memberRoleIds.length > 0 && chooseFrom(bindingsIndex.byGuildWithRoles.get(guildId), "binding.guild+roles") || guildId && chooseFrom(bindingsIndex.byGuild.get(guildId), "binding.guild") || teamId && chooseFrom(bindingsIndex.byTeam.get(teamId), "binding.team") || chooseFrom(bindingsIndex.byAccount, "binding.account") || chooseFrom(bindingsIndex.byChannel, "binding.channel");
	if (route) return route;
	return choose((defaultAgentId || tryResolveLegacyCompatibilityAgentId(input.cfg)) ?? resolveDefaultAgentId(input.cfg, {
		surface: `${channel} account ${accountId} routing`,
		hint: `Add a channel-wide binding for ${channel}:${accountId}: ${JSON.stringify({
			agentId: "<agentId>",
			match: {
				channel,
				accountId
			}
		})}. Replace <agentId> with a configured agent, then restart the Gateway.`
	}), "default");
}
/** @internal Lists bindings selectable by at least one group/channel route under runtime precedence. */
function listEffectiveGroupRouteBindings(cfg) {
	const bindings = listBindings(cfg);
	const usedIds = /* @__PURE__ */ new Set();
	for (const binding of bindings) {
		usedIds.add(normalizeAccountId(binding.match.accountId));
		for (const value of [
			binding.match.peer?.id,
			binding.match.guildId,
			binding.match.teamId
		]) {
			const normalized = normalizeRouteBindingId(value);
			if (normalized) usedIds.add(normalized);
		}
	}
	let sentinel = "openclaw-audit-route";
	while (usedIds.has(sentinel)) sentinel += "-next";
	const markerForIndex = (index) => `audit-binding-${index}`;
	const probeCfg = {
		...cfg,
		agents: { entries: {} },
		bindings: bindings.map((binding, index) => ({
			...binding,
			agentId: markerForIndex(index)
		}))
	};
	return bindings.filter((binding, index) => {
		const match = normalizeBindingMatch(binding.match);
		if (match.peer.state === "invalid" || (match.peer.state === "valid" || match.peer.state === "wildcard-kind") && match.peer.kind === "direct") return false;
		const peer = match.peer.state === "valid" ? {
			kind: match.peer.kind,
			id: match.peer.id
		} : match.peer.state === "wildcard-kind" ? {
			kind: match.peer.kind,
			id: sentinel
		} : {
			kind: "group",
			id: sentinel
		};
		const accountId = match.accountPattern === "*" ? sentinel : match.accountPattern;
		return (match.roles?.map((role) => [role]) ?? [[]]).some((memberRoleIds) => resolveAgentRoute({
			cfg: probeCfg,
			channel: binding.match.channel,
			defaultAgentId: DEFAULT_AGENT_ID,
			accountId,
			peer,
			guildId: match.guildId,
			teamId: match.teamId,
			memberRoleIds
		}).agentId === markerForIndex(index));
	});
}
//#endregion
export { pickFirstExistingAgentId as a, peerKindMatches as c, listExactDirectMessageBindingPeerIds as i, deriveLastRoutePolicy as n, resolveAgentRoute as o, listEffectiveGroupRouteBindings as r, resolveInboundLastRouteSessionKey as s, buildAgentSessionKey as t };
