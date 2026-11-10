import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-BeTuTnO0.mjs";
import { o as readSessionUpdatedAtInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { l as recordInboundSessionMeta } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./sessions-CnzPI1yx.mjs";
import "./logging-DuTp4Ty7.mjs";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-BEzfGrcL.mjs";
import { i as resolveInboundMentionDecision, n as implicitMentionKindWhen } from "./mention-gating-0Hi8lUn4.mjs";
import { i as resolveStableChannelIngressPolicy, r as resolveChannelIngressPolicy, t as createChannelIngressPolicyResolver } from "./runtime-UFRsC_tY.mjs";
import { i as resolveHumanDelayConfig, r as resolveEffectiveMessagesConfig } from "./identity-VQc9B4RO.mjs";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-DvaXhzgP.mjs";
import { i as resolveSessionEntryResetFreshnessAsync, r as resolveSessionEntryResetFreshness } from "./entry-freshness-kcEsDHPL.mjs";
import { t as finalizeInboundContext } from "./inbound-context-DnPzLOsP.mjs";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-BW8Y2zzZ.mjs";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-CBIUperA.mjs";
import { f as saveMediaBuffer } from "./store-BOkrav0N.mjs";
import { t as shouldHandleTextCommands } from "./commands-text-routing-C0zJ6oP2.mjs";
import "./commands-registry-CFDGAPH8.mjs";
import { n as settleReplyDispatcher, r as withReplyDispatcher } from "./dispatch-dispatcher-CvUZsPeG.mjs";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-FwOIMA6L.mjs";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-CBbuDs1h.mjs";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-qrwWkfC7.mjs";
import { a as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-D0j_OxtK.mjs";
import { S as updateLastRouteWithAuthority, g as readSessionUpdatedAt, x as updateLastRoute } from "./session-store-runtime-DVNFhqCK.mjs";
import { t as convertMarkdownTables } from "./tables-d9DwqcM9.mjs";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-CdZ9UA5I.mjs";
import { i as shouldAckReaction, n as removeAckReactionAfterReply, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-DWO_9yJt.mjs";
import { t as buildChannelInboundEventContext } from "./context-D2p4OQjv.mjs";
import { i as setChannelConversationBindingMaxAgeBySessionKeyAsync, n as setChannelConversationBindingIdleTimeoutBySessionKeyAsync, r as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-DreJLABn.mjs";
import { t as loadChannelOutboundAdapter } from "./load-DaP0etgn.mjs";
import { t as recordInboundSession } from "./session-bNhKQNY9.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-6lmw1mh6.mjs";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { t as buildPairingReply } from "./pairing-messages-AQo0LeX0.mjs";
import { t as readChannelAllowFromStore } from "./pairing-store.read-30DeRp-H.mjs";
import { c as upsertChannelPairingRequest, s as removeChannelAllowFromStoreEntry } from "./pairing-store-BIAARSUf.mjs";
import { n as publicChannelTurnParams, t as publicChannelTurn } from "./reply-options-vskFqRCa.mjs";
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
const dispatchLowLevelChannelReplyFromConfig = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./dispatch-from-config-7Fo2eVoy.mjs")), (runtime) => runtime.dispatchLowLevelChannelReplyFromConfig);
const dispatchReplyWithBufferedBlockDispatcherCore = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./provider-dispatcher-CYm2aMap.mjs")), (runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const loadChannelTurnLifecycle = createLazyRuntimeModule(() => import("./lifecycle-D-KdHy1B.mjs"));
const dispatchAssembledChannelTurn = createLazyRuntimeMethod(loadChannelTurnLifecycle, (runtime) => runtime.dispatchAssembledChannelTurn);
const loadPreparedChannelTurn = createLazyRuntimeModule(() => import("./execution-Bv3a1HqK.mjs"));
const runPreparedChannelTurn = async (params) => (await loadPreparedChannelTurn()).runPreparedChannelTurn(params);
const runChannelTurn = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./run-channel-turn-B5BV6GBw.mjs")), (runtime) => runtime.runChannelTurn);
function createRuntimeChannel(options) {
	const runInbound = (params) => {
		return runChannelTurn(publicChannelTurnParams(params));
	};
	const dispatchInbound = async (params) => (await loadChannelTurnLifecycle()).dispatchRoutedChannelTurn({
		...publicChannelTurn(params),
		...options?.dispatchReplyFromConfig ? { dispatchReplyFromConfig: options.dispatchReplyFromConfig } : {}
	});
	const inboundRuntime = {
		ingress: {
			createResolver: createChannelIngressPolicyResolver,
			resolve: resolveChannelIngressPolicy,
			resolveStable: resolveStableChannelIngressPolicy
		},
		buildContext: buildChannelInboundEventContext,
		run: runInbound,
		runPreparedReply: runPreparedChannelTurn,
		dispatch: dispatchInbound,
		dispatchReply: (params) => dispatchAssembledChannelTurn(publicChannelTurn(params))
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
			dispatchReplyWithBufferedBlockDispatcher: (params) => dispatchReplyWithBufferedBlockDispatcherCore(publicChannelTurn(params)),
			createReplyDispatcherWithTyping,
			resolveEffectiveMessagesConfig,
			resolveHumanDelayConfig,
			dispatchReplyFromConfig: (params) => (options?.dispatchReplyFromConfig ?? dispatchLowLevelChannelReplyFromConfig)(publicChannelTurn(params)),
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
		session: {
			resolveStorePath: resolveSessionStorePathCore,
			readSessionUpdatedAt,
			readSessionUpdatedAtAsync: readSessionUpdatedAtInWorker,
			recordSessionMetaFromInbound: recordInboundSessionMeta,
			recordInboundSession,
			updateLastRoute,
			updateLastRouteWithAuthority,
			resolveEntryResetFreshness: resolveSessionEntryResetFreshness,
			resolveEntryResetFreshnessAsync: resolveSessionEntryResetFreshnessAsync
		},
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
