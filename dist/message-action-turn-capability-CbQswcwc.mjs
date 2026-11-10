import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as readUserTurnPromptReactionSource, n as getUserTurnTranscriptAdmissionOwner } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { randomBytes } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
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
function sweepExpiredMessageActionTurnCapabilities(nowMs) {
	for (const [token, capability] of capabilitiesByToken) if (nowMs >= capability.expiresAtMs) capabilitiesByToken.delete(token);
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
	const assertActive = () => {
		if (capabilitiesByToken.get(token) !== capability || Date.now() >= capability.expiresAtMs) throw new Error("message action turn capability is no longer active");
	};
	const scheduled = params.scheduled;
	if (scheduled) {
		const assertSourceCurrent = scheduled.assertSourceCurrent;
		capability.scheduled = {
			policy: structuredClone(scheduled.policy),
			...scheduled.channelRequester ? { channelRequester: structuredClone(scheduled.channelRequester) } : {},
			assertCurrent: () => {
				assertActive();
				scheduled.assertCurrent();
			},
			...assertSourceCurrent ? { assertSourceCurrent: () => {
				assertActive();
				assertSourceCurrent();
			} } : {}
		};
	}
	const deliveryAttempt = params.deliveryAttempt;
	if (deliveryAttempt) capability.deliveryAttempt = {
		assertCurrent: () => {
			assertActive();
			deliveryAttempt.assertCurrent();
		},
		beforeAttempt: async () => {
			assertActive();
			deliveryAttempt.assertCurrent();
			await deliveryAttempt.beforeAttempt();
			assertActive();
			deliveryAttempt.assertCurrent();
		}
	};
	const assertDashboardReadCurrent = params.assertDashboardReadCurrent;
	if (assertDashboardReadCurrent) capability.assertDashboardReadCurrent = () => {
		assertActive();
		assertDashboardReadCurrent();
	};
	const promptSource = params.promptReactionSource;
	if (promptSource && promptSource.source.agentId === agentId && promptSource.source.sessionKey === sessionKey && readUserTurnPromptReactionSource(promptSource.recorder) === promptSource.source) {
		capability.promptReactionBinding = {
			...promptSource,
			react: promptSource.source.createReaction(promptSource.recorder)
		};
		capability.currentPromptReaction = (input) => {
			const binding = capability.promptReactionBinding;
			if (!binding) throw new Error("Current prompt has no admitted WebChat reaction source.");
			const assertCurrent = () => {
				assertActive();
				binding.source.assertCurrent();
				input.assertCurrent();
				if (capability.promptReactionBinding !== binding) throw new Error("Current WebChat prompt changed before reaction mutation.");
			};
			assertCurrent();
			return binding.react({
				...input,
				assertCurrent
			});
		};
	}
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
		...selectMessageActionRequesterIdentity(capability),
		toolContext: copyToolContext(capability.toolContext)
	};
}
/** Redeems private authority only in the host that owns the opaque capability. */
function resolveMessageActionTurnAuthorization(params) {
	const capability = resolveStoredMessageActionTurnCapability(params);
	return capability ? {
		...copyMessageActionTurnContext(capability),
		scheduled: capability.scheduled,
		deliveryAttempt: capability.deliveryAttempt,
		assertDashboardReadCurrent: capability.assertDashboardReadCurrent
	} : void 0;
}
/** Publish only after the runtime has committed and consumed this exact user input. */
function advanceMessageActionPrompt(params) {
	if (!params.runId || !params.agentId || !params.sessionKey) return;
	const source = readUserTurnPromptReactionSource(params.recorder);
	const receipt = params.recorder && getUserTurnTranscriptAdmissionOwner(params.recorder)?.receipt();
	for (const [token, capability] of capabilitiesByToken) {
		if (!capability.currentPromptReaction || !resolveStoredMessageActionTurnCapability({
			token,
			agentId: params.agentId,
			runId: params.runId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		})) continue;
		if (capability.promptReactionBinding?.recorder === params.recorder) continue;
		capability.promptReactionBinding = source && params.recorder && receipt && receipt.sessionId === params.sessionId && source.agentId === capability.agentId && source.sessionKey === capability.sessionKey ? {
			source,
			recorder: params.recorder,
			react: source.createReaction(params.recorder)
		} : void 0;
	}
}
/** Current-prompt callbacks never enter channel authorization or serialized runtime context. */
function resolveCurrentPromptReaction(params) {
	return resolveStoredMessageActionTurnCapability(params)?.currentPromptReaction;
}
function revokeMessageActionTurnCapability(token) {
	return token ? capabilitiesByToken.delete(token) : false;
}
//#endregion
export { resolveCurrentPromptReaction as a, resolveMessageActionTurnCapabilityLifetime as c, withMessageActionInvocationConfig as d, readMessageActionInvocationConfig as i, revokeMessageActionTurnCapability as l, isTrustedMessageActionTurnIngress as n, resolveMessageActionTurnAuthorization as o, mintMessageActionTurnCapability as r, resolveMessageActionTurnCapability as s, advanceMessageActionPrompt as t, selectMessageActionRequesterIdentity as u };
