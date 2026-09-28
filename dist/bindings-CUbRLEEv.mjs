import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { y as tryResolveAgentOperationAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as resolveNormalizedRouteBindingMatch, t as normalizeRouteBindingChannelId } from "./binding-scope-DY44yLIJ.mjs";
import { i as listRouteBindings, r as listConfiguredBindings, t as isRouteBinding } from "./bindings-CI-O7TMQ.mjs";
//#region src/routing/bindings.ts
function listBindings(cfg) {
	return listRouteBindings(cfg);
}
function listBoundAccountIds(cfg, channelId) {
	const normalizedChannel = normalizeRouteBindingChannelId(channelId);
	if (!normalizedChannel) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const binding of listBindings(cfg)) {
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
	for (const binding of listBindings(cfg)) {
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
export { resolvePreferredAccountId as a, resolveDefaultAgentBoundAccountId as i, listBindings as n, listBoundAccountIds as r, buildChannelAccountBindings as t };
