import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./hooks-DuXrq03h.mjs";
import { t as appendTranscriptEvent } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { l as loadSessionEntryReadOnly, p as readSessionUpdatedAtCore } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CV-eEST-.mjs";
import { r as isControlCommandMessage } from "./command-detection-CzqdezWl.mjs";
import "./sessions-Cesa3L0p.mjs";
import "./location-Ce8_SVWn.mjs";
import { c as normalizeOutboundReplyPayload } from "./reply-payload-RBmrGrXG.mjs";
import "./mentions-BKW6zinj.mjs";
import "./dispatch-UrRhZie5.mjs";
import "./live-CJusMVR5.mjs";
import { a as resolveEnvelopeFormatOptions } from "./envelope-Bh9h9lS4.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-jCgm-Hak.mjs";
import "./media-EVtUZUR6.mjs";
import { i as filterChannelInboundSupplementalContext, n as buildHostChannelInboundEventContext, t as buildChannelInboundEventContext } from "./context-CEXDqQYw.mjs";
import { t as runPreparedChannelTurn } from "./execution-CljeOpMw.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-Ch5hnWyF.mjs";
import { n as dispatchAssembledChannelTurn, r as dispatchRoutedChannelTurn } from "./lifecycle-D3df2FJy.mjs";
import { n as runChannelTurn } from "./run-channel-turn-D71-pSK7.mjs";
import { a as resolveInboundRouteEnvelopeBuilderWithRuntime, r as resolveChannelInboundRouteEnvelope, t as createChannelInboundEnvelopeBuilder } from "./envelope-B4Lp6ibb.mjs";
import "./direct-dm-access-SRroUKK-.mjs";
import "./direct-dm-guard-policy-DdD1sj1w.mjs";
import "./logging-skHYNt5A.mjs";
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
		...params.inboundAccessAuthorized === true ? { InboundAccessAuthorized: true } : {},
		...params.inboundAccessAuthorized === true ? { ConversationRouteContextObserved: true } : {},
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
/**
* Channel inbound event classifier.
*
* Decides whether group/channel activity should wake the agent or remain a passive room event.
*/
/**
* Classifies an inbound channel event as an actionable request or passive room event.
*/
function classifyChannelInboundEvent(params) {
	if (params.unmentionedGroupPolicy !== "room_event") return "user_request";
	if (params.conversation.kind !== "group" && params.conversation.kind !== "channel") return "user_request";
	if (params.wasMentioned === true || params.hasControlCommand === true || params.hasAbortRequest === true || params.commandSource === "native") return "user_request";
	return "room_event";
}
/**
* Resolves the configured policy for unmentioned group/channel inbound events.
*/
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
export { runChannelInboundEvent as a, recordChannelFeedbackEvent as c, resolveUnmentionedGroupInboundPolicy as d, resolveInboundSessionEnvelopeContext as f, dispatchInboundDirectDmWithRuntime as g, dispatchInboundDirectDm as h, filterChannelTurnSupplementalContext as i, runChannelFeedbackReflection as l, shouldDebounceTextInbound as m, dispatchChannelInboundReply as n, runPreparedInboundReply as o, createChannelInboundDebouncer as p, dispatchChannelInboundTurn as r, DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS as s, buildChannelTurnContext as t, classifyChannelInboundEvent as u };
