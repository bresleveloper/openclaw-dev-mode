import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
//#region src/routing/binding-scope.ts
function normalizeRouteBindingId(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "bigint") return String(value).trim();
	return "";
}
function normalizeRouteBindingRoles(value) {
	return Array.isArray(value) && value.length > 0 ? value : null;
}
function normalizeRouteBindingChannelId(raw) {
	return normalizeChatChannelId(raw) || normalizeLowercaseStringOrEmpty(raw) || null;
}
function resolveNormalizedRouteBindingMatch(binding, options) {
	if (!binding || typeof binding !== "object") return null;
	const match = binding.match;
	if (!match || typeof match !== "object") return null;
	const channelId = normalizeRouteBindingChannelId(match.channel);
	if (!channelId) return null;
	if (match.accountId !== void 0 && typeof match.accountId !== "string") return null;
	const accountId = match.accountId?.trim();
	if (accountId === "*" || !accountId && !options?.includeImplicitDefaultAccount) return null;
	return {
		agentId: normalizeAgentId(binding.agentId),
		accountId: normalizeAccountId(accountId),
		channelId
	};
}
function hasRoleLookup(memberRoleIds) {
	return typeof memberRoleIds.has === "function";
}
function hasAnyRouteBindingRole(roles, memberRoleIds) {
	if (!memberRoleIds) return false;
	if (hasRoleLookup(memberRoleIds)) return roles.some((role) => memberRoleIds.has(role));
	const memberRoleIdSet = new Set(memberRoleIds);
	return roles.some((role) => memberRoleIdSet.has(role));
}
function routeBindingScopeMatches(constraint, scope) {
	const guildId = normalizeRouteBindingId(scope.guildId);
	const teamId = normalizeRouteBindingId(scope.teamId);
	const groupSpace = normalizeRouteBindingId(scope.groupSpace);
	if (constraint.guildId && constraint.guildId !== guildId && constraint.guildId !== groupSpace) return false;
	if (constraint.teamId && constraint.teamId !== teamId && constraint.teamId !== groupSpace) return false;
	const roles = normalizeRouteBindingRoles(constraint.roles);
	if (!roles) return true;
	return hasAnyRouteBindingRole(roles, scope.memberRoleIds);
}
//#endregion
export { routeBindingScopeMatches as a, resolveNormalizedRouteBindingMatch as i, normalizeRouteBindingId as n, normalizeRouteBindingRoles as r, normalizeRouteBindingChannelId as t };
