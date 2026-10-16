import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-RxKxwld1.mjs";
//#region src/infra/approval-types.ts
function deriveApprovalRequestKind(request) {
	if ("proposalHash" in request.request && "sessionId" in request.request) return "system-agent";
	const isExec = "command" in request.request;
	if (isExec === ("title" in request.request && "description" in request.request)) throw new Error("approval request payload does not identify exactly one owner");
	return isExec ? "exec" : "plugin";
}
function isExecApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "exec";
}
function isPluginApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "plugin";
}
function isSystemAgentApprovalRequest(request) {
	return deriveApprovalRequestKind(request) === "system-agent";
}
function hasExecApprovalKind(request) {
	return request.approvalKind === "exec";
}
function hasPluginApprovalKind(request) {
	return request.approvalKind === "plugin";
}
function normalizeApprovalRequest(request) {
	if (isExecApprovalRequest(request)) {
		if (hasExecApprovalKind(request)) return request;
		return {
			...request,
			approvalKind: "exec"
		};
	}
	if (isPluginApprovalRequest(request)) return hasPluginApprovalKind(request) ? request : {
		...request,
		approvalKind: "plugin"
	};
	if (isSystemAgentApprovalRequest(request)) return {
		...request,
		approvalKind: "system-agent"
	};
	throw new Error("approval request payload does not identify exactly one owner");
}
/** Resolve approval ownership from the typed request payload, never from id spelling. */
function resolveApprovalRequestKind(request) {
	return deriveApprovalRequestKind(request);
}
//#endregion
//#region src/infra/approval-request-account-binding.ts
function resolveApprovalForwardTargets(params) {
	const forwarding = resolveApprovalRequestKind(params.request) === "exec" ? params.cfg.approvals?.exec : params.cfg.approvals?.plugin;
	const channel = normalizeMessageChannel(params.channel);
	if (!forwarding?.enabled || forwarding.mode !== "targets" && forwarding.mode !== "both") return [];
	if (!matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: forwarding.agentFilter,
		sessionFilter: forwarding.sessionFilter
	})) return [];
	return (forwarding.targets ?? []).filter((target) => normalizeMessageChannel(target.channel) === channel);
}
function resolveApprovalForwardAccountIds(params) {
	return resolveApprovalForwardTargets(params).flatMap((target) => {
		const accountId = normalizeOptionalAccountId(target.accountId ?? params.defaultAccountId);
		return accountId ? [accountId] : [];
	});
}
/** Classifies whether native delivery has named channel-account owners. */
function classifyApprovalRequestChannelRoute(params) {
	if (!normalizeMessageChannel(params.channel)) return "unbound";
	if (resolveApprovalRequestChannelAccountId(params)) return "bound-or-explicit";
	if (resolveApprovalForwardTargets(params).length > 0) return "bound-or-explicit";
	return "unbound";
}
/** Loads the persisted session entry referenced by an approval request, if still present. */
function resolvePersistedApprovalRequestSessionEntry(params) {
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? params.request.request.agentId ?? "main";
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	const entry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		clone: false
	});
	if (!entry) return null;
	return {
		sessionKey,
		entry
	};
}
function resolvePersistedApprovalRequestSessionBinding(params) {
	const persisted = resolvePersistedApprovalRequestSessionEntry(params);
	if (!persisted) return null;
	const { entry } = persisted;
	const origin = sessionDeliveryOrigin(entry);
	const context = deliveryContextFromSession(entry);
	const channel = normalizeMessageChannel(context?.channel ?? origin?.provider);
	const accountId = normalizeOptionalAccountId(context?.accountId ?? origin?.accountId);
	return channel || accountId ? {
		channel,
		accountId
	} : null;
}
/** Resolves the account id an approval request belongs to for an optional channel filter. */
function resolveApprovalRequestAccountId(params) {
	const expectedChannel = normalizeMessageChannel(params.channel);
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (expectedChannel && turnSourceChannel && turnSourceChannel !== expectedChannel) return null;
	const turnSourceAccountId = normalizeOptionalAccountId(params.request.request.turnSourceAccountId);
	if (turnSourceAccountId) return turnSourceAccountId;
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
	const sessionChannel = sessionBinding?.channel;
	if (expectedChannel && sessionChannel && sessionChannel !== expectedChannel) return null;
	return sessionBinding?.accountId ?? null;
}
/** Resolves an approval request account only when the request can be routed to a channel. */
function resolveApprovalRequestChannelAccountId(params) {
	const expectedChannel = normalizeMessageChannel(params.channel);
	if (!expectedChannel) return null;
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (!turnSourceChannel || turnSourceChannel === expectedChannel) return resolveApprovalRequestAccountId(params);
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
	return sessionBinding?.channel === expectedChannel ? sessionBinding.accountId ?? null : null;
}
/** Checks whether a channel/account pair is eligible to handle an approval request. */
function doesApprovalRequestMatchChannelAccount(params) {
	const expectedChannel = normalizeMessageChannel(params.channel);
	if (!expectedChannel) return false;
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== expectedChannel) return false;
	const turnSourceAccountId = normalizeOptionalAccountId(params.request.request.turnSourceAccountId);
	const expectedAccountId = normalizeOptionalAccountId(params.accountId);
	if (turnSourceAccountId) return !expectedAccountId || expectedAccountId === turnSourceAccountId;
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(params);
	const sessionChannel = sessionBinding?.channel;
	if (sessionChannel && sessionChannel !== expectedChannel) return false;
	const boundAccountId = sessionBinding?.accountId;
	return !expectedAccountId || !boundAccountId || expectedAccountId === boundAccountId;
}
/** Selects the one channel account that owns a native approval request. */
function doesApprovalRequestSelectChannelAccount(params) {
	const accountId = normalizeOptionalAccountId(params.accountId) ?? normalizeOptionalAccountId(params.defaultAccountId);
	if (!accountId) return false;
	const boundAccountId = resolveApprovalRequestChannelAccountId(params);
	if (accountId === normalizeOptionalAccountId(boundAccountId)) return true;
	const forwardAccountIds = resolveApprovalForwardAccountIds(params);
	if (forwardAccountIds.includes(accountId)) return true;
	if (boundAccountId || forwardAccountIds.length > 0) return false;
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== normalizeMessageChannel(params.channel)) return false;
	const eligibleAccountIds = params.eligibleAccountIds.map(normalizeOptionalAccountId).filter((candidate) => Boolean(candidate));
	return eligibleAccountIds.length === 1 && eligibleAccountIds[0] === accountId;
}
//#endregion
export { resolveApprovalRequestChannelAccountId as a, normalizeApprovalRequest as c, resolveApprovalRequestAccountId as i, resolveApprovalRequestKind as l, doesApprovalRequestMatchChannelAccount as n, resolvePersistedApprovalRequestSessionEntry as o, doesApprovalRequestSelectChannelAccount as r, isPluginApprovalRequest as s, classifyApprovalRequestChannelRoute as t };
