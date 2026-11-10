import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { n as buildSpawnAuthorityReceipt } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as resolveDisplaySessionKey, o as resolveInternalSessionKey, s as resolveMainSessionAlias } from "./sessions-resolution-CQXReb8R.mjs";
import "./sessions-helpers-DCz0gP72.mjs";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-Dj69E8ST.mjs";
//#region src/agents/subagents/spawn/execution-identity-spawn-context.ts
const parentExecutionIdentities = /* @__PURE__ */ new WeakMap();
/** Carry exact parent provenance without adding it to public spawn context types. */
function withParentExecutionIdentity(context, token) {
	if (!token) return context;
	const carried = { ...context };
	parentExecutionIdentities.set(carried, token);
	return carried;
}
function readParentExecutionIdentity(context) {
	return parentExecutionIdentities.get(context);
}
//#endregion
//#region src/agents/spawn-requester-origin.ts
const KIND_PREFIX_TO_CHAT_TYPE = /* @__PURE__ */ new Map([
	["room:", "channel"],
	["channel:", "channel"],
	["conversation:", "channel"],
	["chat:", "channel"],
	["thread:", "channel"],
	["topic:", "channel"],
	["group:", "group"],
	["team:", "group"],
	["user:", "direct"],
	["dm:", "direct"],
	["pm:", "direct"]
]);
const GENERIC_PREFIX_PATTERN = /^[a-z][a-z0-9_-]*:/i;
function inferPeerKindFromBareId(value) {
	if (value.startsWith("@")) return "direct";
	if (value.startsWith("!") || value.startsWith("#")) return "channel";
}
function extractRequesterPeer(channelId, requesterTo) {
	if (!requesterTo) return {};
	const raw = requesterTo.trim();
	if (!raw) return {};
	const normalizedChannel = channelId?.trim().toLowerCase();
	const channelPrefix = normalizedChannel ? `${normalizedChannel}:` : void 0;
	let inferredKind;
	let allowBareIdKindOverride = false;
	let value = raw;
	while (true) {
		const match = GENERIC_PREFIX_PATTERN.exec(value);
		if (!match) break;
		const prefix = match[0].toLowerCase();
		const kindFromPrefix = KIND_PREFIX_TO_CHAT_TYPE.get(prefix);
		if (!kindFromPrefix && prefix !== channelPrefix) break;
		inferredKind ??= kindFromPrefix;
		allowBareIdKindOverride ||= prefix === channelPrefix || prefix === "room:";
		value = value.slice(prefix.length).trim();
	}
	const bareIdKind = value ? inferPeerKindFromBareId(value) : void 0;
	if (bareIdKind && (!inferredKind || allowBareIdKindOverride)) inferredKind = bareIdKind;
	return {
		peerId: value || void 0,
		peerKind: inferredKind
	};
}
function resolveRequesterOriginForChild(params) {
	const { peerId: normalizedPeerId, peerKind: inferredPeerKind } = extractRequesterPeer(params.requesterChannel, params.requesterTo);
	const rawPeerIdAlias = params.requesterTo?.trim();
	const boundAccountId = params.requesterChannel && params.targetAgentId !== params.requesterAgentId ? resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.requesterChannel,
		agentId: params.targetAgentId,
		peerId: normalizedPeerId,
		exactPeerIdAliases: rawPeerIdAlias && rawPeerIdAlias !== normalizedPeerId ? [rawPeerIdAlias] : void 0,
		peerKind: inferredPeerKind,
		groupSpace: params.requesterGroupSpace,
		memberRoleIds: params.requesterMemberRoleIds
	}) : void 0;
	return normalizeDeliveryContext({
		channel: params.requesterChannel,
		accountId: boundAccountId ?? params.requesterAccountId,
		to: params.requesterTo,
		threadId: params.requesterThreadId
	});
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-ownership.ts
function resolveSubagentSpawnOwnership(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const controllerSessionKey = params.agentSessionKey ? resolveInternalSessionKey({
		key: params.agentSessionKey,
		alias
	}) : alias;
	const completionOwnerKey = params.completionOwnerKey?.trim();
	const completionRequesterSessionKey = completionOwnerKey ? resolveInternalSessionKey({
		key: completionOwnerKey,
		alias
	}) : controllerSessionKey;
	return {
		controllerSessionKey,
		completionRequesterSessionKey,
		completionRequesterDisplayKey: resolveDisplaySessionKey({
			key: completionRequesterSessionKey,
			alias,
			mainKey
		})
	};
}
//#endregion
//#region src/agents/subagents/spawn/spawn-parent-lineage.ts
const PARENT_CHANGED_ERROR = "Parent session changed before spawn; retry from the current turn.";
/**
* A reset during child preparation may leave stale lineage. The memory owner
* denies that receipt at access, so spawn need not re-read the parent before commit.
*/
function captureSpawnParentLineage(params) {
	const { parentEntry } = params;
	if (parentEntry && params.expectedParentSessionId !== void 0 && parentEntry.sessionId !== params.expectedParentSessionId) throw new Error(PARENT_CHANGED_ERROR);
	return buildSpawnAuthorityReceipt(parentEntry, params.senderIsOwner);
}
//#endregion
export { withParentExecutionIdentity as a, readParentExecutionIdentity as i, resolveSubagentSpawnOwnership as n, resolveRequesterOriginForChild as r, captureSpawnParentLineage as t };
