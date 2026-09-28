import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
//#region src/gateway/message-action-turn-capability.ts
const DEFAULT_TTL_MS = 9e5;
const MAX_TTL_MS = 864e5;
const RUN_LIFETIME_EXPIRES_AT_MS = Number.MAX_SAFE_INTEGER;
const CAPABILITY_COMPLETION_GRACE_MS = 6e4;
function selectMessageActionRequesterIdentity(context) {
	return {
		requesterAccountId: context?.requesterAccountId,
		requesterSenderId: context?.requesterSenderId,
		requesterSenderName: context?.requesterSenderName,
		requesterSenderUsername: context?.requesterSenderUsername,
		requesterSenderE164: context?.requesterSenderE164
	};
}
const capabilitiesByToken = /* @__PURE__ */ new Map();
const invocationConfig = new AsyncLocalStorage();
/** Bound local requests retain one admitted invocation's resolved configuration. */
function withMessageActionInvocationConfig(token, resolve, run) {
	return token && resolve ? invocationConfig.run({
		token,
		resolve
	}, run) : run();
}
function readMessageActionInvocationConfig(token) {
	const invocation = invocationConfig.getStore();
	return token && invocation?.token === token ? invocation.resolve() : void 0;
}
function isTrustedMessageActionTurnIngress(provider) {
	const normalized = normalizeMessageChannel(provider);
	return normalized !== void 0 && isDeliverableMessageChannel(normalized);
}
function resolveTtlMs(value) {
	if (!Number.isFinite(value) || value === void 0 || value <= 0) return DEFAULT_TTL_MS;
	return Math.min(Math.trunc(value), MAX_TTL_MS);
}
/** Mirrors agent timeout semantics while leaving unlimited runs to explicit revocation. */
function resolveMessageActionTurnCapabilityLifetime(timeoutMs) {
	return Number.isFinite(timeoutMs) && timeoutMs > 0 ? { ttlMs: timeoutMs + CAPABILITY_COMPLETION_GRACE_MS } : { expiresWithRun: true };
}
function copyToolContext(context) {
	if (!context) return;
	return {
		currentChannelId: normalizeOptionalString(context.currentChannelId),
		currentChatType: context.currentChatType,
		currentMessagingTarget: normalizeOptionalString(context.currentMessagingTarget),
		currentGraphChannelId: normalizeOptionalString(context.currentGraphChannelId),
		currentChannelProvider: context.currentChannelProvider,
		currentThreadTs: normalizeOptionalString(context.currentThreadTs),
		currentMessageId: context.currentMessageId,
		currentSourceTurnId: normalizeOptionalString(context.currentSourceTurnId),
		replyToMode: context.replyToMode,
		hasRepliedRef: context.hasRepliedRef,
		sameChannelThreadRequired: context.sameChannelThreadRequired,
		skipCrossContextDecoration: context.skipCrossContextDecoration
	};
}
function sweepExpiredMessageActionTurnCapabilities(nowMs = Date.now()) {
	let removed = 0;
	for (const [token, capability] of capabilitiesByToken) if (nowMs >= capability.expiresAtMs) {
		capabilitiesByToken.delete(token);
		removed += 1;
	}
	return removed;
}
/**
* Mint an opaque capability from admitted channel/dashboard input or a live cron occurrence.
* Unattested Gateway agent requests never receive this token.
*/
function mintMessageActionTurnCapability(params) {
	const agentId = normalizeAgentId(params.agentId);
	const runId = params.runId.trim();
	const sessionKey = params.sessionKey.trim();
	if (!agentId || !runId || !sessionKey) throw new Error("message action turn capability requires agent, run, and session identity");
	const nowMs = params.nowMs ?? Date.now();
	sweepExpiredMessageActionTurnCapabilities(nowMs);
	pruneMapToMaxSize(capabilitiesByToken, 4095);
	const token = randomBytes(32).toString("base64url");
	const capability = {
		agentId,
		runId,
		sessionKey,
		expiresAtMs: params.expiresWithRun ? RUN_LIFETIME_EXPIRES_AT_MS : nowMs + resolveTtlMs(params.ttlMs),
		sessionId: normalizeOptionalString(params.sessionId),
		sourceReplySessionKey: normalizeOptionalString(params.sourceReplySessionKey),
		requesterAccountId: normalizeOptionalString(params.requesterAccountId),
		requesterSenderId: normalizeOptionalString(params.requesterSenderId),
		requesterSenderName: normalizeOptionalString(params.requesterSenderName),
		requesterSenderUsername: normalizeOptionalString(params.requesterSenderUsername),
		requesterSenderE164: normalizeOptionalString(params.requesterSenderE164),
		toolContext: copyToolContext(params.toolContext)
	};
	const scheduled = params.scheduled;
	if (scheduled) {
		const assertSourceCurrent = scheduled.assertSourceCurrent;
		capability.scheduled = {
			policy: structuredClone(scheduled.policy),
			...scheduled.channelRequester ? { channelRequester: structuredClone(scheduled.channelRequester) } : {},
			assertCurrent: () => {
				if (capabilitiesByToken.get(token) !== capability || Date.now() >= capability.expiresAtMs) throw new Error("message action turn capability is no longer active");
				scheduled.assertCurrent();
			},
			...assertSourceCurrent ? { assertSourceCurrent: () => {
				if (capabilitiesByToken.get(token) !== capability || Date.now() >= capability.expiresAtMs) throw new Error("message action turn capability is no longer active");
				assertSourceCurrent();
			} } : {}
		};
	}
	const assertDashboardReadCurrent = params.assertDashboardReadCurrent;
	if (assertDashboardReadCurrent) capability.assertDashboardReadCurrent = () => {
		if (capabilitiesByToken.get(token) !== capability || Date.now() >= capability.expiresAtMs) throw new Error("message action turn capability is no longer active");
		assertDashboardReadCurrent();
	};
	capabilitiesByToken.set(token, capability);
	return token;
}
function resolveStoredMessageActionTurnCapability(params) {
	const token = params.token?.trim();
	if (!token) return;
	const capability = capabilitiesByToken.get(token);
	if (!capability) return;
	if ((params.nowMs ?? Date.now()) >= capability.expiresAtMs) {
		capabilitiesByToken.delete(token);
		return;
	}
	if (capability.agentId !== normalizeAgentId(params.agentId) || capability.runId !== params.runId?.trim() || capability.sessionKey !== params.sessionKey.trim() || capability.sessionId && capability.sessionId !== normalizeOptionalString(params.sessionId)) return;
	return capability;
}
/** Serializable context deliberately excludes host-only grants and their closures. */
function resolveMessageActionTurnCapability(params) {
	const capability = resolveStoredMessageActionTurnCapability(params);
	if (!capability) return;
	return copyMessageActionTurnContext(capability);
}
function copyMessageActionTurnContext(capability) {
	return {
		expiresAtMs: capability.expiresAtMs,
		sessionId: capability.sessionId,
		sourceReplySessionKey: capability.sourceReplySessionKey,
		requesterAccountId: capability.requesterAccountId,
		requesterSenderId: capability.requesterSenderId,
		requesterSenderName: capability.requesterSenderName,
		requesterSenderUsername: capability.requesterSenderUsername,
		requesterSenderE164: capability.requesterSenderE164,
		toolContext: copyToolContext(capability.toolContext)
	};
}
/** Redeems private authority only in the host that owns the opaque capability. */
function resolveMessageActionTurnAuthorization(params) {
	const capability = resolveStoredMessageActionTurnCapability(params);
	return capability ? {
		...copyMessageActionTurnContext(capability),
		scheduled: capability.scheduled,
		assertDashboardReadCurrent: capability.assertDashboardReadCurrent
	} : void 0;
}
function revokeMessageActionTurnCapability(token) {
	return token ? capabilitiesByToken.delete(token) : false;
}
//#endregion
export { resolveMessageActionTurnCapability as a, selectMessageActionRequesterIdentity as c, resolveMessageActionTurnAuthorization as i, withMessageActionInvocationConfig as l, mintMessageActionTurnCapability as n, resolveMessageActionTurnCapabilityLifetime as o, readMessageActionInvocationConfig as r, revokeMessageActionTurnCapability as s, isTrustedMessageActionTurnIngress as t };
