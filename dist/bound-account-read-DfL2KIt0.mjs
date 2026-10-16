import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as routeBindingScopeMatches, i as resolveNormalizedRouteBindingMatch, n as normalizeRouteBindingId, r as normalizeRouteBindingRoles, t as normalizeRouteBindingChannelId } from "./binding-scope-uGqaW78p.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { r as listConfiguredBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { c as peerKindMatches } from "./resolve-route-Bzb6opva.mjs";
//#region src/routing/bound-account-read.ts
function resolveNormalizedBoundAccountMatch(binding) {
	const baseMatch = resolveNormalizedRouteBindingMatch(binding);
	const match = binding.match;
	if (!baseMatch) return null;
	const peerId = match.peer && typeof match.peer.id === "string" ? match.peer.id.trim() : void 0;
	const peerKind = match.peer ? normalizeChatType(match.peer.kind) : void 0;
	return {
		...baseMatch,
		peerId: peerId || void 0,
		peerKind: peerKind ?? void 0,
		guildId: normalizeRouteBindingId(match.guildId) || null,
		teamId: normalizeRouteBindingId(match.teamId) || null,
		roles: normalizeRouteBindingRoles(match.roles)
	};
}
function resolveFirstBoundAccountId(params) {
	const normalizedChannel = normalizeRouteBindingChannelId(params.channelId);
	if (!normalizedChannel) return;
	const normalizedAgentId = normalizeAgentId(params.agentId);
	const exactPeerIds = new Set([params.peerId ?? "", ...params.exactPeerIdAliases ?? []].map((peerId) => peerId.trim()).filter(Boolean));
	const hasPeerContext = exactPeerIds.size > 0;
	const normalizedPeerKind = normalizeChatType(params.peerKind) ?? void 0;
	let memberRoleIds;
	const scope = {
		groupSpace: params.groupSpace,
		get memberRoleIds() {
			return params.memberRoleIds ? memberRoleIds ??= new Set(params.memberRoleIds) : void 0;
		}
	};
	let wildcardPeerMatch;
	let channelOnlyFallback;
	for (const binding of listConfiguredBindings(params.cfg)) {
		if (!isRouteBinding(binding)) continue;
		const resolved = resolveNormalizedBoundAccountMatch(binding);
		if (!resolved || resolved.channelId !== normalizedChannel || resolved.agentId !== normalizedAgentId) continue;
		if (!routeBindingScopeMatches(resolved, scope)) continue;
		if (!hasPeerContext) return resolved.accountId;
		if (resolved.peerId === "*") {
			if (!resolved.peerKind || !normalizedPeerKind || !peerKindMatches(resolved.peerKind, normalizedPeerKind)) continue;
			wildcardPeerMatch ??= resolved.accountId;
		} else if (resolved.peerId) {
			if (resolved.peerKind && normalizedPeerKind && !peerKindMatches(resolved.peerKind, normalizedPeerKind)) continue;
			if (exactPeerIds.has(resolved.peerId)) return resolved.accountId;
		} else channelOnlyFallback ??= resolved.accountId;
	}
	return wildcardPeerMatch ?? channelOnlyFallback;
}
//#endregion
export { resolveFirstBoundAccountId as t };
