import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.mjs";
import { n as implicitMentionKindWhen, r as resolveInboundMentionDecision } from "./mention-gating-Cqy7URJJ.mjs";
import { i as resolveStableChannelIngressPolicy, r as resolveChannelIngressPolicy, t as createChannelIngressPolicyResolver } from "./runtime-DZlxepxc.mjs";
import "./logging-CrcvifP_.mjs";
import { m as recordInboundSessionMeta, p as readSessionUpdatedAtCore, v as updateSessionLastRoute } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { a as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-CBYe7EC-.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-CLU3uA4U.mjs";
import { i as resolveHumanDelayConfig, r as resolveEffectiveMessagesConfig } from "./identity-DdUdpaIE.mjs";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-CsBeuTe8.mjs";
import { f as saveMediaBuffer } from "./store-CqRcb7T5.mjs";
import { n as shouldHandleTextCommands } from "./commands-text-routing-BAYDrHHM.mjs";
import "./commands-registry-Dw3-bHwm.mjs";
import { n as settleReplyDispatcher, r as withReplyDispatcher } from "./dispatch-dispatcher-C6kknpZM.mjs";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-BKW6zinj.mjs";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-Dc7kHh6j.mjs";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-BtTl3cm9.mjs";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-D0NagiTt.mjs";
import { t as convertMarkdownTables } from "./tables-COj_oUWP.mjs";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-Bh9h9lS4.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-jCgm-Hak.mjs";
import { i as shouldAckReaction, n as removeAckReactionAfterReply, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-BCgn-tQT.mjs";
import { t as buildChannelInboundEventContext } from "./context-F8osvPeB.mjs";
import { i as setChannelConversationBindingMaxAgeBySessionKeyAsync, n as setChannelConversationBindingIdleTimeoutBySessionKeyAsync, r as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-D-2aXfuO.mjs";
import { t as loadChannelOutboundAdapter } from "./load-B9M3eoYt.mjs";
import { t as recordInboundSession } from "./session-2tgOCGL5.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-DCbmBy_n.mjs";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { t as buildPairingReply } from "./pairing-messages-CO6Q9dkJ.mjs";
import { d as upsertChannelPairingRequest, l as removeChannelAllowFromStoreEntry, s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
//#region src/plugins/runtime/channel-runtime-contexts.ts
const log = createSubsystemLogger("plugins/runtime-channel");
function normalizeRuntimeContextString(value) {
	return normalizeOptionalString(value) ?? "";
}
function normalizeRuntimeContextKey(params) {
	const channelId = normalizeRuntimeContextString(params.channelId);
	const capability = normalizeRuntimeContextString(params.capability);
	const accountId = normalizeRuntimeContextString(params.accountId);
	if (!channelId || !capability) return null;
	return {
		mapKey: `${channelId}\u0000${accountId}\u0000${capability}`,
		normalizedKey: {
			channelId,
			capability,
			...accountId ? { accountId } : {}
		}
	};
}
function doesRuntimeContextWatcherMatch(params) {
	if (params.watcher.channelId && params.watcher.channelId !== params.event.key.channelId) return false;
	if (params.watcher.accountId !== void 0 && params.watcher.accountId !== (params.event.key.accountId ?? "")) return false;
	if (params.watcher.capability && params.watcher.capability !== params.event.key.capability) return false;
	return true;
}
/** Creates the in-memory channel runtime context registry used by plugin runtime surfaces. */
function createChannelRuntimeContextRegistry() {
	const runtimeContexts = /* @__PURE__ */ new Map();
	const runtimeContextWatchers = /* @__PURE__ */ new Set();
	const emitRuntimeContextEvent = (event) => {
		for (const watcher of runtimeContextWatchers) {
			if (!doesRuntimeContextWatcherMatch({
				watcher: watcher.filter,
				event
			})) continue;
			try {
				watcher.onEvent(event);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				log.error(`runtime context watcher failed during ${event.type} channel=${event.key.channelId} capability=${event.key.capability}` + (event.key.accountId ? ` account=${event.key.accountId}` : "") + `: ${message}`);
			}
		}
	};
	return {
		register: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return { dispose: () => {} };
			if (params.abortSignal?.aborted) return { dispose: () => {} };
			const token = Symbol(normalized.mapKey);
			let disposed = false;
			const dispose = () => {
				if (disposed) return;
				disposed = true;
				params.abortSignal?.removeEventListener("abort", dispose);
				const current = runtimeContexts.get(normalized.mapKey);
				if (!current || current.token !== token) return;
				runtimeContexts.delete(normalized.mapKey);
				emitRuntimeContextEvent({
					type: "unregistered",
					key: normalized.normalizedKey
				});
			};
			params.abortSignal?.addEventListener("abort", dispose, { once: true });
			if (params.abortSignal?.aborted) {
				dispose();
				return { dispose };
			}
			runtimeContexts.set(normalized.mapKey, {
				token,
				context: params.context,
				normalizedKey: normalized.normalizedKey
			});
			if (disposed) return { dispose };
			emitRuntimeContextEvent({
				type: "registered",
				key: normalized.normalizedKey,
				context: params.context
			});
			return { dispose };
		},
		get: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return;
			return runtimeContexts.get(normalized.mapKey)?.context;
		},
		watch: (params) => {
			const watcher = {
				filter: {
					...params.channelId?.trim() ? { channelId: params.channelId.trim() } : {},
					...params.accountId != null ? { accountId: params.accountId.trim() } : {},
					...params.capability?.trim() ? { capability: params.capability.trim() } : {}
				},
				onEvent: params.onEvent
			};
			runtimeContextWatchers.add(watcher);
			return () => {
				runtimeContextWatchers.delete(watcher);
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-channel.ts
const dispatchLowLevelChannelReplyFromConfig = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./dispatch-from-config-B7Q7CVke.mjs")), (runtime) => runtime.dispatchLowLevelChannelReplyFromConfig);
const dispatchReplyWithBufferedBlockDispatcherCore = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./provider-dispatcher-BVPB1DwR.mjs")), (runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const loadChannelTurnLifecycle = createLazyRuntimeModule(() => import("./lifecycle-Dn3M2nhh.mjs"));
const dispatchAssembledChannelTurn = createLazyRuntimeMethod(loadChannelTurnLifecycle, (runtime) => runtime.dispatchAssembledChannelTurn);
const loadPreparedChannelTurn = createLazyRuntimeModule(() => import("./execution-DAM3W-Fe.mjs"));
const runPreparedChannelTurn = async (params) => (await loadPreparedChannelTurn()).runPreparedChannelTurn(params);
const runChannelTurn = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./run-channel-turn-DOZW13gJ.mjs")), (runtime) => runtime.runChannelTurn);
function createRuntimeChannel(options) {
	const dispatchInbound = async (params) => (await loadChannelTurnLifecycle()).dispatchRoutedChannelTurn({
		...params,
		...options?.dispatchReplyFromConfig ? { dispatchReplyFromConfig: options.dispatchReplyFromConfig } : {}
	});
	const inboundRuntime = {
		ingress: {
			createResolver: createChannelIngressPolicyResolver,
			resolve: resolveChannelIngressPolicy,
			resolveStable: resolveStableChannelIngressPolicy
		},
		buildContext: buildChannelInboundEventContext,
		run: runChannelTurn,
		runPreparedReply: runPreparedChannelTurn,
		dispatch: dispatchInbound,
		dispatchReply: dispatchAssembledChannelTurn
	};
	const sessionRuntime = {
		resolveStorePath: resolveSessionStorePathCore,
		readSessionUpdatedAt: readSessionUpdatedAtCore,
		recordSessionMetaFromInbound: recordInboundSessionMeta,
		recordInboundSession,
		updateLastRoute: updateSessionLastRoute,
		resolveEntryResetFreshness: resolveSessionEntryResetFreshness
	};
	return {
		text: {
			chunkByNewline,
			chunkMarkdownText,
			chunkMarkdownTextWithMode,
			chunkText,
			chunkTextWithMode,
			resolveChunkMode,
			resolveTextChunkLimit,
			hasControlCommand,
			resolveMarkdownTableMode,
			convertMarkdownTables
		},
		reply: {
			dispatchReplyWithBufferedBlockDispatcher: dispatchReplyWithBufferedBlockDispatcherCore,
			createReplyDispatcherWithTyping,
			resolveEffectiveMessagesConfig,
			resolveHumanDelayConfig,
			dispatchReplyFromConfig: options?.dispatchReplyFromConfig ?? dispatchLowLevelChannelReplyFromConfig,
			withReplyDispatcher,
			settleReplyDispatcher,
			finalizeInboundContext,
			formatAgentEnvelope,
			resolveEnvelopeFormatOptions
		},
		routing: {
			buildAgentSessionKey,
			resolveAgentRoute
		},
		pairing: {
			buildPairingReply,
			readAllowFromStore: ({ channel, accountId, env }) => readChannelAllowFromStore(channel, env, accountId),
			removeAllowFromStoreEntry: ({ channel, entry, accountId, env, pairingAdapter }) => removeChannelAllowFromStoreEntry({
				channel,
				entry,
				accountId,
				env,
				pairingAdapter
			}),
			upsertPairingRequest: ({ channel, id, accountId, meta, env, pairingAdapter }) => upsertChannelPairingRequest({
				channel,
				id,
				accountId,
				meta,
				env,
				pairingAdapter
			})
		},
		media: {
			readRemoteMediaBuffer,
			fetchRemoteMedia: readRemoteMediaBuffer,
			saveRemoteMedia,
			saveResponseMedia,
			saveMediaBuffer
		},
		activity: {
			record: recordChannelActivity,
			get: getChannelActivity
		},
		session: sessionRuntime,
		mentions: {
			buildMentionRegexes,
			matchesMentionPatterns,
			matchesMentionWithExplicit,
			implicitMentionKindWhen,
			resolveInboundMentionDecision
		},
		reactions: {
			createAckReactionHandle,
			shouldAckReaction,
			removeAckReactionAfterReply,
			removeAckReactionHandleAfterReply
		},
		groups: {
			resolveGroupPolicy: resolveChannelGroupPolicy,
			resolveRequireMention: resolveChannelGroupRequireMention
		},
		debounce: {
			createInboundDebouncer,
			resolveInboundDebounceMs
		},
		commands: {
			resolveCommandAuthorizedFromAuthorizers,
			isControlCommandMessage,
			shouldComputeCommandAuthorized,
			shouldHandleTextCommands
		},
		outbound: { loadAdapter: loadChannelOutboundAdapter },
		inbound: inboundRuntime,
		turn: inboundRuntime,
		threadBindings: {
			setIdleTimeoutBySessionKeyAsync: setChannelConversationBindingIdleTimeoutBySessionKeyAsync,
			setMaxAgeBySessionKeyAsync: setChannelConversationBindingMaxAgeBySessionKeyAsync,
			setIdleTimeoutBySessionKey: ({ channelId, targetSessionKey, accountId, idleTimeoutMs }) => setChannelConversationBindingIdleTimeoutBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				idleTimeoutMs
			}),
			setMaxAgeBySessionKey: ({ channelId, targetSessionKey, accountId, maxAgeMs }) => setChannelConversationBindingMaxAgeBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				maxAgeMs
			})
		},
		runtimeContexts: createChannelRuntimeContextRegistry()
	};
}
//#endregion
export { createRuntimeChannel as t };
