import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-BYgsD07g.mjs";
//#region src/infra/approval-types.ts
/** Resolve approval ownership from the typed request payload, never from id spelling. */
function resolveApprovalRequestKind(request) {
	if ("proposalHash" in request.request && "sessionId" in request.request) return "system-agent";
	const isExec = "command" in request.request;
	if (isExec === ("title" in request.request && "description" in request.request)) throw new Error("approval request payload does not identify exactly one owner");
	return isExec ? "exec" : "plugin";
}
function isExecApprovalRequest(request) {
	return resolveApprovalRequestKind(request) === "exec";
}
function isPluginApprovalRequest(request) {
	return resolveApprovalRequestKind(request) === "plugin";
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
	return {
		...request,
		approvalKind: "system-agent"
	};
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
async function classifyApprovalRequestChannelRouteAsync(params) {
	if (!normalizeMessageChannel(params.channel)) return "unbound";
	if (await resolveApprovalRequestChannelAccountIdAsync(params)) return "bound-or-explicit";
	if (resolveApprovalForwardTargets(params).length > 0) return "bound-or-explicit";
	return "unbound";
}
/** Compatibility reader retained only by the deprecated synchronous Plugin SDK. */
function resolveLegacyApprovalRequestSessionDelivery(params) {
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? params.request.request.agentId ?? "main";
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	const memory = captureSessionActorStorageOwner({
		sessionKey,
		agentId,
		storePath
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const entry = memory.binding?.actor.target.sessionKey === sessionKey ? memory.binding.actor.snapshot(memory.authority)?.entry : memory.owner?.readSession(sessionKey, memory.authority)?.entry;
		return entry ? {
			sessionId: entry.sessionId,
			updatedAt: entry.updatedAt,
			delivery: entry.delivery
		} : null;
	}
	const entry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		clone: false
	});
	if (!entry) return null;
	return {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		delivery: entry.delivery
	};
}
function resolvePersistedApprovalRequestSessionBinding(entry) {
	if (!entry) return null;
	const origin = sessionDeliveryOrigin(entry);
	const context = deliveryContextFromSession(entry);
	const channel = normalizeMessageChannel(context?.channel ?? origin?.provider);
	const accountId = normalizeOptionalAccountId(context?.accountId ?? origin?.accountId);
	return channel || accountId ? {
		channel,
		accountId
	} : null;
}
function resolveApprovalRequestAccountBinding(params, sessionDelivery) {
	const expectedChannel = normalizeMessageChannel(params.channel);
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (expectedChannel && turnSourceChannel && turnSourceChannel !== expectedChannel) return null;
	const turnSourceAccountId = normalizeOptionalAccountId(params.request.request.turnSourceAccountId);
	if (turnSourceAccountId) return { accountId: turnSourceAccountId };
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(sessionDelivery);
	const sessionChannel = sessionBinding?.channel;
	if (expectedChannel && sessionChannel && sessionChannel !== expectedChannel) return null;
	return { accountId: sessionBinding?.accountId ?? null };
}
/** Resolves the account id an approval request belongs to for an optional channel filter. */
function resolveApprovalRequestAccountIdFromDelivery(params, sessionDelivery) {
	return resolveApprovalRequestAccountBinding(params, sessionDelivery)?.accountId ?? null;
}
/** Resolves an approval request account only when the request can be routed to a channel. */
function resolveApprovalRequestChannelAccountIdFromDelivery(params, sessionDelivery) {
	const expectedChannel = normalizeMessageChannel(params.channel);
	if (!expectedChannel) return null;
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (!turnSourceChannel || turnSourceChannel === expectedChannel) return resolveApprovalRequestAccountIdFromDelivery(params, sessionDelivery);
	const sessionBinding = resolvePersistedApprovalRequestSessionBinding(sessionDelivery);
	return sessionBinding?.channel === expectedChannel ? sessionBinding.accountId ?? null : null;
}
/** Checks whether a channel/account pair is eligible to handle an approval request. */
function doesApprovalRequestMatchChannelAccountFromDelivery(params, sessionDelivery) {
	if (!normalizeMessageChannel(params.channel)) return false;
	const binding = resolveApprovalRequestAccountBinding(params, sessionDelivery);
	if (!binding) return false;
	const expectedAccountId = normalizeOptionalAccountId(params.accountId);
	return !expectedAccountId || !binding.accountId || expectedAccountId === binding.accountId;
}
/** Selects the one channel account that owns a native approval request. */
function doesApprovalRequestSelectChannelAccountFromDelivery(params, sessionDelivery) {
	const accountId = normalizeOptionalAccountId(params.accountId) ?? normalizeOptionalAccountId(params.defaultAccountId);
	if (!accountId) return false;
	const boundAccountId = resolveApprovalRequestChannelAccountIdFromDelivery(params, sessionDelivery);
	if (accountId === normalizeOptionalAccountId(boundAccountId)) return true;
	const forwardAccountIds = resolveApprovalForwardAccountIds(params);
	if (forwardAccountIds.includes(accountId)) return true;
	if (boundAccountId || forwardAccountIds.length > 0) return false;
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== normalizeMessageChannel(params.channel)) return false;
	const eligibleAccountIds = params.eligibleAccountIds.map(normalizeOptionalAccountId).filter((candidate) => Boolean(candidate));
	return eligibleAccountIds.length === 1 && eligibleAccountIds[0] === accountId;
}
/** Reads one current routing snapshot through the session owner; supplied facts are reused. */
async function resolveApprovalRequestSessionDeliveryAsync(params) {
	if (params.sessionDelivery !== void 0) return params.sessionDelivery;
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? params.request.request.agentId ?? "main";
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	const memory = captureSessionActorStorageOwner({
		sessionKey,
		agentId,
		storePath
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const entry = memory.binding?.actor.target.sessionKey === sessionKey ? memory.binding.actor.snapshot(memory.authority)?.entry : memory.owner?.readSession(sessionKey, memory.authority)?.entry;
		return entry ? {
			sessionId: entry.sessionId,
			updatedAt: entry.updatedAt,
			delivery: entry.delivery
		} : null;
	}
	const entry = await readSessionEntryReadOnlyInWorker({
		agentId,
		storePath,
		sessionKey,
		projection: "list",
		hydrateSkillPromptRefs: false
	});
	return entry ? {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		delivery: entry.delivery
	} : null;
}
function warnLegacyApprovalRouting(name) {
	warnPluginSdkDeprecation({
		family: "approval-session-routing",
		method: name,
		replacement: `${name}Async`
	});
}
/** @deprecated Use resolveApprovalRequestAccountIdAsync; final compatibility day: 2026-12-31. */
function resolveApprovalRequestAccountId(params) {
	warnLegacyApprovalRouting("resolveApprovalRequestAccountId");
	return resolveApprovalRequestAccountIdFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function resolveApprovalRequestAccountIdAsync(params) {
	return resolveApprovalRequestAccountIdFromDelivery(params, normalizeOptionalAccountId(params.request.request.turnSourceAccountId) ? null : await resolveApprovalRequestSessionDeliveryAsync(params));
}
/** @deprecated Use resolveApprovalRequestChannelAccountIdAsync; final compatibility day: 2026-12-31. */
function resolveApprovalRequestChannelAccountId(params) {
	warnLegacyApprovalRouting("resolveApprovalRequestChannelAccountId");
	return resolveApprovalRequestChannelAccountIdFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function resolveApprovalRequestChannelAccountIdAsync(params) {
	const channel = normalizeMessageChannel(params.channel);
	const sourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	const useSourceAccount = normalizeOptionalAccountId(params.request.request.turnSourceAccountId) && (!sourceChannel || sourceChannel === channel);
	return resolveApprovalRequestChannelAccountIdFromDelivery(params, !channel || useSourceAccount ? null : await resolveApprovalRequestSessionDeliveryAsync(params));
}
/** @deprecated Use doesApprovalRequestMatchChannelAccountAsync; final compatibility day: 2026-12-31. */
function doesApprovalRequestMatchChannelAccount(params) {
	warnLegacyApprovalRouting("doesApprovalRequestMatchChannelAccount");
	return doesApprovalRequestMatchChannelAccountFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function doesApprovalRequestMatchChannelAccountAsync(params) {
	return doesApprovalRequestMatchChannelAccountFromDelivery(params, normalizeOptionalAccountId(params.request.request.turnSourceAccountId) ? null : await resolveApprovalRequestSessionDeliveryAsync(params));
}
/** @deprecated Use doesApprovalRequestSelectChannelAccountAsync; final compatibility day: 2026-12-31. */
function doesApprovalRequestSelectChannelAccount(params) {
	warnLegacyApprovalRouting("doesApprovalRequestSelectChannelAccount");
	return doesApprovalRequestSelectChannelAccountFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function doesApprovalRequestSelectChannelAccountAsync(params) {
	const channel = normalizeMessageChannel(params.channel);
	const sourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	const useSourceAccount = normalizeOptionalAccountId(params.request.request.turnSourceAccountId) && (!sourceChannel || sourceChannel === channel);
	return doesApprovalRequestSelectChannelAccountFromDelivery(params, !channel || useSourceAccount ? null : await resolveApprovalRequestSessionDeliveryAsync(params));
}
//#endregion
export { doesApprovalRequestSelectChannelAccount as a, resolveApprovalRequestAccountId as c, resolveApprovalRequestChannelAccountIdAsync as d, resolveApprovalRequestSessionDeliveryAsync as f, resolveApprovalRequestKind as g, normalizeApprovalRequest as h, doesApprovalRequestMatchChannelAccountFromDelivery as i, resolveApprovalRequestAccountIdAsync as l, isPluginApprovalRequest as m, doesApprovalRequestMatchChannelAccount as n, doesApprovalRequestSelectChannelAccountAsync as o, resolveLegacyApprovalRequestSessionDelivery as p, doesApprovalRequestMatchChannelAccountAsync as r, doesApprovalRequestSelectChannelAccountFromDelivery as s, classifyApprovalRequestChannelRouteAsync as t, resolveApprovalRequestChannelAccountId as u };
