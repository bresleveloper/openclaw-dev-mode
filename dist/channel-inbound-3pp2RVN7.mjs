import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./group-thread-context-Dq9sbt-L.mjs";
import { n as readChannelIngressStoreAllowFromForDmPolicy } from "./store-allow-from-C_3f-qbK.mjs";
import { l as readSessionUpdatedAtCore, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { t as appendTranscriptEvent } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { a as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CpxKGy_2.mjs";
import { t as expandAllowFromWithAccessGroups } from "./access-groups-D-Ncd63h.mjs";
import { n as resolveDmGroupAccessWithLists, t as DM_GROUP_ACCESS_REASON } from "./dm-policy-shared-W0ZJUdtW.mjs";
import "./location-Dba72-LP.mjs";
import { c as normalizeOutboundReplyPayload } from "./reply-payload-DEDOYf-L.mjs";
import "./sessions-DNhLX2Ep.mjs";
import "./mentions-J8FETFRz.mjs";
import "./dispatch-w1KGACGV.mjs";
import "./live-TWzvpgza.mjs";
import { r as isControlCommandMessage } from "./command-detection-m_VCyqpX.mjs";
import { a as resolveEnvelopeFormatOptions } from "./envelope-BjMhM0rf.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-MIHZfqif.mjs";
import "./media-_mIDNjA9.mjs";
import { i as filterChannelInboundSupplementalContext, n as buildHostChannelInboundEventContext, t as buildChannelInboundEventContext } from "./context-BSebOSwO.mjs";
import { t as runPreparedChannelTurn } from "./execution-BIzcYQQA.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-B4ZsvDU7.mjs";
import { n as dispatchAssembledChannelTurn, r as dispatchRoutedChannelTurn } from "./lifecycle-Df0_vlDo.mjs";
import { n as runChannelTurn } from "./run-channel-turn-BNg5AmNR.mjs";
import { a as resolveInboundRouteEnvelopeBuilderWithRuntime, r as resolveChannelInboundRouteEnvelope, t as createChannelInboundEnvelopeBuilder } from "./envelope-CG-VtxL_.mjs";
import "./channel-access-compat-CcTzmIUt.mjs";
import "./direct-dm-guard-policy-DbOKJ7Oo.mjs";
import "./logging-Bxqdp3TD.mjs";
//#region src/channels/direct-dm-access.ts
function toLegacyDmReasonCode(reasonCode) {
	switch (reasonCode) {
		case DM_GROUP_ACCESS_REASON.DM_POLICY_OPEN:
		case DM_GROUP_ACCESS_REASON.DM_POLICY_DISABLED:
		case DM_GROUP_ACCESS_REASON.DM_POLICY_ALLOWLISTED:
		case DM_GROUP_ACCESS_REASON.DM_POLICY_PAIRING_REQUIRED:
		case DM_GROUP_ACCESS_REASON.DM_POLICY_NOT_ALLOWLISTED: return reasonCode;
		default: return DM_GROUP_ACCESS_REASON.DM_POLICY_NOT_ALLOWLISTED;
	}
}
/**
* Resolves legacy direct-DM access lists, pairing-store entries, and command authorization.
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
async function resolveInboundDirectDmAccessWithRuntime(params) {
	const dmPolicy = params.dmPolicy ?? "pairing";
	const shouldComputeAuth = params.runtime.shouldComputeCommandAuthorized(params.rawBody, params.cfg);
	const storeAllowFrom = dmPolicy === "pairing" ? await readChannelIngressStoreAllowFromForDmPolicy({
		provider: params.channel,
		accountId: params.accountId,
		dmPolicy,
		readStore: params.readStoreAllowFrom
	}) : [];
	const [allowFrom, effectiveStoreAllowFrom] = await Promise.all([params.allowFrom, storeAllowFrom].map((entries) => expandAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom: entries,
		channel: params.channel,
		accountId: params.accountId,
		senderId: params.senderId,
		isSenderAllowed: params.isSenderAllowed,
		resolveMembership: params.resolveAccessGroupMembership
	})));
	const access = resolveDmGroupAccessWithLists({
		isGroup: false,
		dmPolicy,
		allowFrom,
		storeAllowFrom: effectiveStoreAllowFrom,
		groupAllowFromFallbackToAllowFrom: false,
		isSenderAllowed: (allowEntries) => params.isSenderAllowed(params.senderId, allowEntries)
	});
	const reasonCode = toLegacyDmReasonCode(access.reasonCode);
	const senderAllowedForCommands = params.isSenderAllowed(params.senderId, access.effectiveAllowFrom);
	const commandAuthorized = shouldComputeAuth ? params.runtime.resolveCommandAuthorizedFromAuthorizers?.({
		useAccessGroups: true,
		authorizers: [{
			configured: access.effectiveAllowFrom.length > 0,
			allowed: senderAllowedForCommands
		}],
		modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff
	}) ?? senderAllowedForCommands : void 0;
	return {
		access: {
			decision: access.decision,
			reasonCode,
			reason: access.reason,
			effectiveAllowFrom: access.effectiveAllowFrom
		},
		shouldComputeAuth,
		senderAllowedForCommands,
		commandAuthorized
	};
}
/**
* Creates a pre-crypto authorizer that can issue pairing challenges before payload decryption.
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
function createPreCryptoDirectDmAuthorizer(params) {
	return async (input) => {
		const resolved = await params.resolveAccess(input.senderId);
		const access = "access" in resolved ? resolved.access : resolved;
		if (access.decision === "allow") return "allow";
		if (access.decision === "pairing") {
			await params.issuePairingChallenge?.({
				senderId: input.senderId,
				reply: input.reply
			});
			return "pairing";
		}
		params.onBlocked?.({
			senderId: input.senderId,
			reason: access.reason,
			reasonCode: access.reasonCode
		});
		return "block";
	};
}
//#endregion
//#region src/channels/direct-dm.ts
async function buildDirectDmContext(params, route, body) {
	const accountId = route.accountId ?? params.accountId;
	const injectedBuilder = params.channelRuntime?.inbound?.buildContext;
	return (typeof injectedBuilder === "function" ? injectedBuilder : buildChannelInboundEventContext)({
		channel: params.channel,
		accountId,
		provider: params.provider,
		surface: params.surface,
		messageId: params.messageId,
		messageIdFull: params.messageId,
		timestamp: params.timestamp,
		from: params.senderAddress,
		sender: {
			id: params.senderId,
			name: params.conversationLabel
		},
		conversation: {
			kind: "direct",
			id: params.peer.id,
			routePeer: params.peer,
			label: params.conversationLabel
		},
		route: {
			agentId: route.agentId,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey,
			dispatchSessionKey: route.sessionKey
		},
		reply: {
			to: params.recipientAddress,
			originatingTo: params.originatingTo ?? params.senderAddress
		},
		message: {
			body,
			bodyForAgent: params.bodyForAgent ?? params.rawBody,
			rawBody: params.rawBody,
			commandBody: params.commandBody ?? params.rawBody
		},
		access: { commands: { authorized: params.commandAuthorized === true } },
		channelIngress: params.channelIngress,
		extra: {
			NativeDirectUserId: params.peer.id,
			OriginatingChannel: params.originatingChannel ?? params.channel,
			...params.extraContext
		}
	});
}
async function dispatchInboundDirectDm(params) {
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	const channelIngress = params.resolveChannelIngress ? await params.resolveChannelIngress({
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		messageId: params.messageId,
		inboundEventKind: "user_request"
	}) : params.channelIngress;
	const boundParams = channelIngress === params.channelIngress ? params : {
		...params,
		channelIngress
	};
	const ctxPayload = await buildDirectDmContext(boundParams, route, buildEnvelope({
		channel: params.channelLabel,
		from: params.conversationLabel,
		body: params.rawBody,
		timestamp: params.timestamp
	}));
	await dispatchRoutedChannelTurn(buildDirectDmTurnPlan(boundParams, route, ctxPayload));
	return {
		route,
		ctxPayload
	};
}
function buildDirectDmTurnPlan(params, route, ctxPayload) {
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: route.agentId,
		channel: params.channel,
		accountId: route.accountId ?? params.accountId
	});
	return {
		cfg: params.cfg,
		channel: params.channel,
		accountId: route.accountId ?? params.accountId,
		route: {
			agentId: route.agentId,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		record: { onRecordError: params.onRecordError },
		delivery: {
			deliver: async (payload) => await params.deliver(normalizeOutboundReplyPayload(payload)),
			onError: params.onDispatchError
		},
		replyPipeline,
		replyOptions: {
			onModelSelected,
			...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {}
		}
	};
}
async function dispatchInboundDirectDmWithRuntime(params) {
	const { route, buildEnvelope } = resolveInboundRouteEnvelopeBuilderWithRuntime({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		runtime: params.runtime.channel,
		sessionStore: params.cfg.session?.store
	});
	const { storePath, body } = buildEnvelope({
		channel: params.channelLabel,
		from: params.conversationLabel,
		body: params.rawBody,
		timestamp: params.timestamp
	});
	const ctxPayload = params.runtime.channel.reply.finalizeInboundContext({
		Body: body,
		BodyForAgent: params.bodyForAgent ?? params.rawBody,
		RawBody: params.rawBody,
		CommandBody: params.commandBody ?? params.rawBody,
		From: params.senderAddress,
		To: params.recipientAddress,
		SessionKey: route.sessionKey,
		AccountId: route.accountId ?? params.accountId,
		ChatType: "direct",
		ConversationLabel: params.conversationLabel,
		SenderId: params.senderId,
		Provider: params.provider ?? params.channel,
		Surface: params.surface ?? params.channel,
		MessageSid: params.messageId,
		MessageSidFull: params.messageId,
		Timestamp: params.timestamp,
		CommandAuthorized: params.commandAuthorized,
		...params.inboundAccessAuthorized === true ? {
			InboundAccessAuthorized: true,
			ConversationRouteContextObserved: true
		} : {},
		ConversationRoutePeerId: params.peer.id,
		OriginatingChannel: params.originatingChannel ?? params.channel,
		OriginatingTo: params.originatingTo ?? params.senderAddress,
		NativeDirectUserId: params.peer.id,
		...params.extraContext
	});
	const plan = buildDirectDmTurnPlan(params, route, ctxPayload);
	await params.runtime.channel.inbound.run({
		channel: params.channel,
		accountId: route.accountId ?? params.accountId,
		raw: ctxPayload,
		adapter: {
			ingest: () => ({
				id: params.messageId,
				timestamp: params.timestamp,
				rawText: params.rawBody,
				textForAgent: params.bodyForAgent,
				textForCommands: params.commandBody,
				raw: ctxPayload
			}),
			resolveTurn: () => plan
		}
	});
	return {
		route,
		storePath,
		ctxPayload
	};
}
//#endregion
//#region src/channels/inbound-debounce-policy.ts
/** Returns true when an inbound text event is safe to debounce before dispatch. */
function shouldDebounceTextInbound(params) {
	if (params.allowDebounce === false) return false;
	if (params.hasMedia) return false;
	const text = normalizeOptionalString(params.text) ?? "";
	if (!text) return false;
	return !isControlCommandMessage(text, params.cfg, params.commandOptions);
}
/** Snapshot timing by default; resolveDebounceMs opts into per-entry timing. */
function createChannelInboundDebouncer(params) {
	const debounceMs = resolveInboundDebounceMs({
		cfg: params.cfg,
		channel: params.channel,
		overrideMs: params.debounceMsOverride
	});
	const { cfg: _cfg, channel: _channel, debounceMsOverride: _override, ...rest } = params;
	return {
		debounceMs,
		debouncer: createInboundDebouncer({
			debounceMs,
			...rest
		})
	};
}
//#endregion
//#region src/channels/session-envelope.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
function resolveInboundSessionEnvelopeContext(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	return {
		storePath,
		envelopeOptions: resolveEnvelopeFormatOptions(params.cfg),
		previousTimestamp: readSessionUpdatedAtCore({
			storePath,
			sessionKey: params.sessionKey
		})
	};
}
//#endregion
//#region src/channels/inbound-event/classification.ts
function classifyChannelInboundEvent(params) {
	if (params.unmentionedGroupPolicy !== "room_event") return "user_request";
	if (params.conversation.kind !== "group" && params.conversation.kind !== "channel") return "user_request";
	if (params.wasMentioned === true || params.hasControlCommand === true || params.hasAbortRequest === true || params.commandSource === "native") return "user_request";
	return "room_event";
}
function resolveUnmentionedGroupInboundPolicy(params) {
	const agentGroupChat = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.groupChat : void 0;
	if (agentGroupChat && Object.hasOwn(agentGroupChat, "unmentionedInbound")) return agentGroupChat.unmentionedInbound ?? "user_request";
	return params.cfg.messages?.groupChat?.unmentionedInbound ?? "user_request";
}
//#endregion
//#region src/channels/feedback-reflection.ts
const DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS = 3e5;
const MAX_RESPONSE_CHARS = 500;
const MAX_COOLDOWN_ENTRIES = 500;
const lastReflectionBySession = /* @__PURE__ */ new Map();
async function recordChannelFeedbackEvent(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const entry = loadSessionEntryReadOnly({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath
	});
	if (!entry?.sessionId) return false;
	const target = await resolveSessionTranscriptRuntimeTarget({
		agentId: params.agentId,
		sessionId: entry.sessionId,
		sessionKey: params.sessionKey,
		storePath
	});
	await appendTranscriptEvent(target, params.event);
	return true;
}
function buildReflectionPrompt(params) {
	const response = params.thumbedDownResponse;
	const truncated = response && response.length > MAX_RESPONSE_CHARS ? `${truncateUtf16Safe(response, MAX_RESPONSE_CHARS)}...` : response;
	return [
		"A user indicated your previous response wasn't helpful.",
		truncated ? `\nYour response was:\n> ${truncated}` : void 0,
		params.userComment ? `\nUser's comment: "${params.userComment}"` : void 0,
		"\nBriefly reflect: what could you improve? Consider tone, length, accuracy, relevance, and specificity. Reply with one JSON object only: {\"learning\":\"...\",\"followUp\":false,\"userMessage\":\"\"}. Keep learning to 1-2 sentences. Set followUp only when the user needs a direct reply."
	].filter(Boolean).join("\n");
}
function parseReflectionResponse(text) {
	const trimmed = text.trim();
	const candidates = [trimmed, ...trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.slice(1, 2) ?? []];
	for (const candidate of candidates) try {
		const value = JSON.parse(candidate.trim());
		const learning = typeof value.learning === "string" ? value.learning.trim() : "";
		if (!learning) continue;
		return {
			learning,
			followUp: value.followUp === true || typeof value.followUp === "string" && ["true", "yes"].includes(value.followUp.trim().toLowerCase()),
			userMessage: (typeof value.userMessage === "string" ? value.userMessage.trim() : "") || void 0
		};
	} catch {}
	return trimmed ? {
		learning: trimmed,
		followUp: false
	} : null;
}
async function runChannelFeedbackReflection(params) {
	const cooldownMs = params.cooldownMs ?? 3e5;
	if (Date.now() - (lastReflectionBySession.get(params.sessionKey) ?? Number.NEGATIVE_INFINITY) < cooldownMs) return { status: "cooldown" };
	const prompt = buildReflectionPrompt(params);
	const timestamp = Date.now();
	const body = createChannelInboundEnvelopeBuilder({
		cfg: params.cfg,
		route: {
			agentId: params.agentId,
			sessionKey: params.sessionKey
		}
	})({
		channel: params.channelLabel,
		from: "system",
		body: prompt,
		timestamp
	});
	const target = `conversation:${params.conversationId}`;
	const ctxPayload = buildHostChannelInboundEventContext({
		channelIngress: "unsupported",
		channel: params.channel,
		accountId: params.accountId,
		messageId: `feedback-reflection:${timestamp}`,
		timestamp,
		from: `${params.channel}:system:${params.conversationId}`,
		sender: {
			id: "system",
			name: "system"
		},
		conversation: {
			kind: params.conversationKind,
			id: params.conversationId
		},
		route: {
			agentId: params.agentId,
			accountId: params.accountId,
			routeSessionKey: params.sessionKey,
			dispatchSessionKey: params.sessionKey
		},
		reply: {
			to: target,
			originatingTo: target
		},
		message: {
			body,
			bodyForAgent: prompt,
			rawBody: prompt,
			commandBody: prompt
		},
		access: { commands: { authorized: false } },
		extra: { ConversationRouteContextObserved: false }
	});
	const responses = [];
	await dispatchRoutedChannelTurn({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		route: {
			agentId: params.agentId,
			sessionKey: params.sessionKey
		},
		ctxPayload,
		record: { onRecordError: params.onRecordError },
		delivery: {
			deliver: async (payload) => {
				if (payload.text) responses.push(payload.text);
				return { visibleReplySent: false };
			},
			onError: (error) => params.onDispatchError?.(error)
		},
		replyPipeline: {}
	});
	const response = responses.join("\n");
	const parsed = parseReflectionResponse(response);
	if (!parsed) return { status: "empty" };
	lastReflectionBySession.set(params.sessionKey, Date.now());
	if (lastReflectionBySession.size > MAX_COOLDOWN_ENTRIES) {
		for (const [key, time] of lastReflectionBySession) if (Date.now() - time >= cooldownMs) lastReflectionBySession.delete(key);
	}
	return {
		status: "complete",
		learning: parsed.learning,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId }),
		followUp: parsed.followUp,
		userMessage: parsed.userMessage,
		responseLength: response.trim().length
	};
}
//#endregion
//#region src/plugin-sdk/channel-inbound.ts
/**
* Builds inbound-event context for callers still passing `inboundTurnKind`.
*
* @deprecated Use `buildChannelInboundEventContext`.
*/
function buildChannelTurnContext(params) {
	const inboundEventKind = params.message.inboundEventKind ?? params.message.inboundTurnKind;
	const ctx = buildChannelInboundEventContext({
		...params,
		message: {
			...params.message,
			...inboundEventKind ? { inboundEventKind } : {}
		}
	});
	return {
		...ctx,
		InboundTurnKind: ctx.InboundEventKind
	};
}
/**
* Deprecated supplemental-context filter alias retained for channel SDK compatibility.
*
* @deprecated Use `filterChannelInboundSupplementalContext`.
*/
const filterChannelTurnSupplementalContext = filterChannelInboundSupplementalContext;
async function runPreparedInboundReply(params) {
	return await runPreparedChannelTurn(params);
}
async function runChannelInboundEvent(params) {
	return await runChannelTurn(params);
}
async function dispatchChannelInboundReply(params) {
	return await dispatchAssembledChannelTurn(params);
}
async function dispatchChannelInboundTurn(params) {
	return await dispatchRoutedChannelTurn(params);
}
//#endregion
export { createPreCryptoDirectDmAuthorizer as _, runChannelInboundEvent as a, recordChannelFeedbackEvent as c, resolveUnmentionedGroupInboundPolicy as d, resolveInboundSessionEnvelopeContext as f, dispatchInboundDirectDmWithRuntime as g, dispatchInboundDirectDm as h, filterChannelTurnSupplementalContext as i, runChannelFeedbackReflection as l, shouldDebounceTextInbound as m, dispatchChannelInboundReply as n, runPreparedInboundReply as o, createChannelInboundDebouncer as p, dispatchChannelInboundTurn as r, DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS as s, buildChannelTurnContext as t, classifyChannelInboundEvent as u, resolveInboundDirectDmAccessWithRuntime as v };
