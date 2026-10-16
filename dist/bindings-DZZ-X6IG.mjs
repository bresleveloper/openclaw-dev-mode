import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { S as tryResolveAgentOperationAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as resolveNormalizedRouteBindingMatch, t as normalizeRouteBindingChannelId } from "./binding-scope-uGqaW78p.mjs";
import { i as listRouteBindings, r as listConfiguredBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
//#region src/routing/bindings.ts
function listBoundAccountIds(cfg, channelId) {
	const normalizedChannel = normalizeRouteBindingChannelId(channelId);
	if (!normalizedChannel) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const binding of listRouteBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding, { includeImplicitDefaultAccount: true });
		if (!resolved || resolved.channelId !== normalizedChannel) continue;
		ids.add(resolved.accountId);
	}
	return Array.from(ids).toSorted((a, b) => a.localeCompare(b));
}
function resolveDefaultAgentBoundAccountId(cfg, channelId) {
	const normalizedChannel = normalizeRouteBindingChannelId(channelId);
	if (!normalizedChannel) return null;
	const ownerAgentId = tryResolveAgentOperationAgentId(cfg);
	if (!ownerAgentId) return null;
	const defaultAgentId = normalizeAgentId(ownerAgentId);
	for (const binding of listConfiguredBindings(cfg)) {
		if (!isRouteBinding(binding)) continue;
		const resolved = resolveNormalizedRouteBindingMatch(binding);
		if (!resolved || resolved.channelId !== normalizedChannel || resolved.agentId !== defaultAgentId) continue;
		return resolved.accountId;
	}
	return null;
}
function buildChannelAccountBindings(cfg) {
	const map = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding, { includeImplicitDefaultAccount: true });
		if (!resolved) continue;
		const byAgent = map.get(resolved.channelId) ?? /* @__PURE__ */ new Map();
		const list = byAgent.get(resolved.agentId) ?? [];
		if (!list.includes(resolved.accountId)) list.push(resolved.accountId);
		byAgent.set(resolved.agentId, list);
		map.set(resolved.channelId, byAgent);
	}
	return map;
}
function resolvePreferredAccountId(params) {
	if (params.boundAccounts.length > 0) return expectDefined(params.boundAccounts[0], "bound accounts entry at 0");
	return params.defaultAccountId;
}
//#endregion
export { resolvePreferredAccountId as i, listBoundAccountIds as n, resolveDefaultAgentBoundAccountId as r, buildChannelAccountBindings as t };
