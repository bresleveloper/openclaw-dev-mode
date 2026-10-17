import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./logging-CIwBT2dJ.mjs";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-BEzfGrcL.mjs";
import { i as resolveInboundMentionDecision, n as implicitMentionKindWhen } from "./mention-gating-0Hi8lUn4.mjs";
import { i as resolveStableChannelIngressPolicy, r as resolveChannelIngressPolicy, t as createChannelIngressPolicyResolver } from "./runtime-DxH1m116.mjs";
import { l as readSessionUpdatedAtCore, m as updateSessionLastRoute, u as recordInboundSessionMeta } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as finalizeInboundContext } from "./inbound-context-jAt0CAb-.mjs";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-C-YJuY-k.mjs";
import { i as resolveHumanDelayConfig, r as resolveEffectiveMessagesConfig } from "./identity-uzCeiPuC.mjs";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-BJ7vM7Bm.mjs";
import "./sessions-D_sxp1B4.mjs";
import { f as saveMediaBuffer } from "./store-A0dMc8iV.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-BF0-50wB.mjs";
import "./commands-registry-DVONES7g.mjs";
import { n as settleReplyDispatcher, r as withReplyDispatcher } from "./dispatch-dispatcher-BKxE1A-W.mjs";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-Bzb6opva.mjs";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-J8FETFRz.mjs";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-CO_PCbH3.mjs";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-DbODRO30.mjs";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-BenoswI3.mjs";
import { a as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-M8GOVwRi.mjs";
import { t as convertMarkdownTables } from "./tables-CNAqodZU.mjs";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-BjMhM0rf.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-MIHZfqif.mjs";
import { i as shouldAckReaction, n as removeAckReactionAfterReply, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-DCxRU_9b.mjs";
import { t as buildChannelInboundEventContext } from "./context-C8X-VsUO.mjs";
import { i as setChannelConversationBindingMaxAgeBySessionKeyAsync, n as setChannelConversationBindingIdleTimeoutBySessionKeyAsync, r as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-CmFKH__Y.mjs";
import { t as loadChannelOutboundAdapter } from "./load-CxJyF9Ot.mjs";
import { t as recordInboundSession } from "./session-rcXfkt9U.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-CjaTcdM3.mjs";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { t as buildPairingReply } from "./pairing-messages-DAQcoeDL.mjs";
import { d as upsertChannelPairingRequest, l as removeChannelAllowFromStoreEntry, s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
//#region src/plugins/runtime/channel-runtime-contexts.ts
const log = createSubsystemLogger("plugins/runtime-channel");
function normalizeRuntimeContextKey(params) {
	const channelId = normalizeOptionalString(params.channelId);
	const capability = normalizeOptionalString(params.capability);
	const accountId = normalizeOptionalString(params.accountId) ?? "";
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
function createChannelRuntimeContextRegistry() {
	const runtimeContexts = /* @__PURE__ */ new Map();
	const runtimeContextWatchers = /* @__PURE__ */ new Set();
	const emitRuntimeContextEvent = (event) => {
		for (const watcher of runtimeContextWatchers) {
			const { channelId, accountId, capability } = watcher.filter;
			if (channelId && channelId !== event.key.channelId || accountId !== void 0 && accountId !== (event.key.accountId ?? "") || capability && capability !== event.key.capability) continue;
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
			if (!normalized || params.abortSignal?.aborted) return { dispose: () => {} };
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
				context: params.context
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
const dispatchLowLevelChannelReplyFromConfig = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./dispatch-from-config-COuPV_rD.mjs")), (runtime) => runtime.dispatchLowLevelChannelReplyFromConfig);
const dispatchReplyWithBufferedBlockDispatcherCore = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./provider-dispatcher-Cy6xGxmt.mjs")), (runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const loadChannelTurnLifecycle = createLazyRuntimeModule(() => import("./lifecycle-4rirh79I.mjs"));
const dispatchAssembledChannelTurn = createLazyRuntimeMethod(loadChannelTurnLifecycle, (runtime) => runtime.dispatchAssembledChannelTurn);
const loadPreparedChannelTurn = createLazyRuntimeModule(() => import("./execution-DRPgyCmK.mjs"));
const runPreparedChannelTurn = async (params) => (await loadPreparedChannelTurn()).runPreparedChannelTurn(params);
const runChannelTurn = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./run-channel-turn-mRriCUZ1.mjs")), (runtime) => runtime.runChannelTurn);
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
			upsertPairingRequest: upsertChannelPairingRequest
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
			setIdleTimeoutBySessionKey: setChannelConversationBindingIdleTimeoutBySessionKey,
			setMaxAgeBySessionKey: setChannelConversationBindingMaxAgeBySessionKey
		},
		runtimeContexts: createChannelRuntimeContextRegistry()
	};
}
//#endregion
export { createRuntimeChannel as t };
