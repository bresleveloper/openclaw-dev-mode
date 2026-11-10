import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { p as isDiagnosticsEnabled } from "./diagnostic-events-C91J-XX8.mjs";
import { n as createLazyPromise, t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { a as generateSecureUuid } from "./secure-random-DxCgeORs.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { d as toolPolicyRestrictsTools } from "./tool-policy-14GRhbFd.mjs";
import { a as closeAdmittedRunDelegatedAuthority, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { n as classifySessionStateActor } from "./session-state-events-BCzDVKh0.mjs";
import { S as markReplyPayloadAsTtsSupplement, _ as isReplyPayloadStatusNotice, b as isReplyPayloadTtsSupplement, o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { l as trimTextPreservingCode, n as combineNonStreamingReplyParts } from "./text-projection-mdP9TY8k.mjs";
import { r as createVerifiedConversationContextStreamFilter } from "./user-facing-text-BNFEPbYx.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DfuJOyLj.mjs";
import { n as resolveConfiguredTtsMode, s as shouldCleanTtsDirectiveText } from "./tts-config-C3g0K7Hg.mjs";
import { c as readChannelContextAdmissionEvidence } from "./admission-evidence-CcY0jAvs.mjs";
import { l as prepareChannelParticipantObservation } from "./host-context-builder-2jolfam-.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { r as hasInboundMediaForUnderstanding } from "./inbound-media-D9dVgt41.mjs";
import { n as QuestionAnswerUnconfirmedError, t as PreparedQuestionAnswerRefusedError } from "./gateway-question-dispatch-CakNMdfI.mjs";
import { d as markDiagnosticSessionProgress } from "./diagnostic-Dz-YV3uh.mjs";
import { a as toAcpRuntimeError, n as AcpRuntimeError } from "./errors-C8Hasc_X.mjs";
import { t as formatAcpRuntimeErrorText } from "./error-text-DIW9_P7e.mjs";
import { o as isSessionIdentityPending, u as resolveSessionIdentityFromMeta } from "./session-identity-Y754M7yL.mjs";
import { i as resolveAcpThreadSessionDetailLines } from "./session-identifiers-2CkhpQUq.mjs";
import "./errors-BYR7FGxG.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-79LnOCyy.mjs";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "./policy-C2Xkhgxq.mjs";
import { g as shouldRetryReplyDispatch, h as resolveRoutedReplyDeliveryOutcome, o as prepareReplyPayloadForDispatcher, r as captureReplyDispatchDeliveryOutcome, s as waitForReplyDispatcherIdle, t as attachReplyDispatchUndeliveredFallback } from "./reply-dispatcher-BW8Y2zzZ.mjs";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-Bw7WQh_g.mjs";
import { n as resolveRoutedDeliveryThreadId } from "./routed-delivery-thread-NhdxeJIZ.mjs";
import { n as assertPreparedConversationBindingRouteCurrent } from "./session-conversation-binding-De2KQell.mjs";
import { a as isCaptionedFinalTextPayload, i as cleanDeferredFinalText, n as needsTtsFallback, o as mergeDeferredFinalText, r as buildCaptionedFinalTextFallback, s as shouldDeferFinalTtsText } from "./dispatch-from-config.finalize-gF1fLzxP.mjs";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-BTT327MQ.mjs";
import { t as resolveStatusTtsSnapshot } from "./status-config-BQonxGuq.mjs";
import { g as hasBlockReplyDeliveryCustody, m as createBlockReplySource, p as createBlockReplyPipeline, v as setBlockReplyDelivery } from "./dispatch-from-config.payloads-aZIVM3UO.mjs";
import { i as claimPreparedPendingAgentQuestionAnswer } from "./gateway-question-DpNVBEhx.mjs";
import { n as formatToolSummary, o as resolveToolDisplay } from "./tool-display-cHpG_xAK.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { n as prepareTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { a as resolveReplyDeliveryAccountId, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-B8mLB1ov.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-CXErM5gk.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
import { r as bindUserTurnInput } from "./user-turn-transcript-runtime-context-T4-x_GL3.mjs";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-Cq8C8pJJ.mjs";
import { n as resolveEffectiveBlockStreamingConfig } from "./block-streaming-CPkUAJ16.mjs";
import { t as stripExtractedFileImageMetadata } from "./extracted-file-images-CdmNdoIK.mjs";
import { a as appendRecentHistoryImageContext, i as resolveInlineAgentImageAttachments, n as loadAgentTurnMediaRuntime, r as resolveAgentTurnAttachments, t as collectDescribedImageAttachmentIndexes } from "./agent-turn-attachments-CBEflaiq.mjs";
import { t as recordAcceptedSessionParticipantInput } from "./session-participant-input-recording-DuQZzYOq.mjs";
import { t as createLazyAcpElicitationHandler } from "./acp-elicitation-handler-lazy-BLr1ei7U.mjs";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-BfHSDdEj.mjs";
import { n as resolveAcpProjectionSettings, t as isAcpTagVisible } from "./acp-stream-settings-Ca7bZwio.mjs";
import { t as prepareChannelRunAdmission } from "./channel-run-admission-DxkX5ChJ.mjs";
//#region src/auto-reply/reply/acp-projector.ts
const ACP_BLOCK_REPLY_TIMEOUT_MS = 15e3;
const ACP_MAX_OUTPUT_CHARS = 24e3;
const ACP_MAX_SESSION_UPDATE_CHARS = 320;
const ACP_LIVE_IDLE_FLUSH_FLOOR_MS = 750;
const ACP_LIVE_IDLE_MIN_CHARS = 80;
const ACP_LIVE_SOFT_FLUSH_CHARS = 220;
const ACP_LIVE_HARD_FLUSH_CHARS = 480;
const HIDDEN_BOUNDARY_TAGS = /* @__PURE__ */ new Set(["tool_call", "tool_call_update"]);
function shouldInsertSeparator(params) {
	if (!params.previousTail || /^\s/.test(params.nextText)) return false;
	return params.separator === " " ? !/\s$/.test(params.previousTail) : !params.previousTail.endsWith("\n");
}
function shouldFlushLiveBufferOnBoundary(text) {
	return text.length >= ACP_LIVE_HARD_FLUSH_CHARS || text.endsWith("\n\n") || /[.!?][)"'`]*\s$/.test(text) || text.length >= ACP_LIVE_SOFT_FLUSH_CHARS && /\s$/.test(text);
}
function shouldFlushLiveBufferOnIdle(text) {
	return text.length >= ACP_LIVE_IDLE_MIN_CHARS || /[.!?][)"'`]*$/.test(text.trimEnd()) || text.includes("\n");
}
function renderToolSummaryText(event, shouldSendFullToolDetails) {
	const showDetails = shouldSendFullToolDetails || normalizeOptionalLowercaseString(event.kind) !== "execute";
	const title = showDetails ? normalizeOptionalString(event.title) : void 0;
	const status = normalizeOptionalString(event.status);
	const fallback = showDetails ? normalizeOptionalString(event.text) : void 0;
	const display = resolveToolDisplay({
		name: "tool_call",
		meta: [title, status && `status=${status}`].filter(Boolean).join(" · ") || fallback || "tool call"
	});
	return formatToolSummary(display);
}
function createAcpReplyProjector(params) {
	const settings = resolveAcpProjectionSettings(params.cfg);
	const isLive = settings.deliveryMode === "live";
	const hiddenBoundarySeparator = isLive ? " " : "\n\n";
	const streaming = resolveEffectiveBlockStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		maxChunkChars: 1800,
		coalesceIdleMs: 350
	});
	const blockReplyPipeline = createBlockReplyPipeline({
		onBlockReply: async (payload) => {
			await params.deliver("block", copyReplyPayloadMetadata(payload, {
				...payload,
				textMode: "delta"
			}));
		},
		timeoutMs: ACP_BLOCK_REPLY_TIMEOUT_MS,
		coalescing: isLive ? void 0 : streaming.coalescing
	});
	const chunker = new EmbeddedBlockChunker(isLive ? {
		...streaming.chunking,
		minChars: 1
	} : streaming.chunking);
	const filterConversationContext = createVerifiedConversationContextStreamFilter(params.getConversationContext);
	const liveIdleFlushMs = Math.max(streaming.coalescing.idleMs, ACP_LIVE_IDLE_FLUSH_FLOOR_MS);
	let emittedOutputChars = 0;
	let truncationNoticeEmitted = false;
	let lastStatusHash;
	let lastToolHash;
	let lastUsageTuple;
	let lastVisibleOutputTail;
	let pendingHiddenBoundary = false;
	let bufferedText = "";
	let liveIdleTimer;
	const pendingToolDeliveries = [];
	const toolLifecycleById = /* @__PURE__ */ new Map();
	const clearLiveIdleTimer = () => {
		clearTimeout(liveIdleTimer);
		liveIdleTimer = void 0;
	};
	const drainChunker = () => {
		chunker.drain({
			force: true,
			emit: (chunk) => {
				blockReplyPipeline.enqueue({ text: chunk });
			}
		});
	};
	const flushLiveBuffer = (idle = false) => {
		if (!bufferedText) return;
		if (idle && !shouldFlushLiveBufferOnIdle(bufferedText)) return;
		const text = bufferedText;
		bufferedText = "";
		chunker.append(text);
		drainChunker();
	};
	const scheduleLiveIdleFlush = () => {
		if (!bufferedText) return;
		clearLiveIdleTimer();
		liveIdleTimer = setTimeout(() => {
			flushLiveBuffer(true);
			if (bufferedText) scheduleLiveIdleFlush();
		}, liveIdleFlushMs);
	};
	const flush = async () => {
		if (isLive) {
			clearLiveIdleTimer();
			flushLiveBuffer();
			drainChunker();
		} else {
			if (await params.shouldSendToolSummaries()) for (const entry of pendingToolDeliveries.splice(0)) await params.deliver("tool", entry.payload, entry.meta);
			else pendingToolDeliveries.length = 0;
			if (bufferedText.trim().length > 0) {
				const text = bufferedText;
				bufferedText = "";
				await params.deliver("final", { text });
			}
		}
		await blockReplyPipeline.flush({ force: true });
	};
	const deliverTool = async (text, meta) => {
		if (!isLive) pendingToolDeliveries.push({
			payload: { text },
			...meta ? { meta } : {}
		});
		else {
			await flush();
			await params.deliver("tool", { text }, meta);
		}
	};
	const emitSystemStatus = async (text, opts) => {
		if (!await params.shouldSendToolSummaries()) return;
		const bounded = truncateUtf16WithEllipsis(text.trim(), ACP_MAX_SESSION_UPDATE_CHARS);
		if (!bounded) return;
		const formatted = prefixSystemMessage(bounded);
		const hash = formatted.trim();
		if (settings.repeatSuppression && opts?.dedupe !== false && lastStatusHash === hash) return;
		await deliverTool(formatted);
		lastStatusHash = hash;
	};
	const markHiddenToolBoundary = (event) => {
		if (!event.tag || !HIDDEN_BOUNDARY_TAGS.has(event.tag)) return;
		const isTerminal = resolveAcpToolTerminalOutcome(event.status) !== void 0;
		pendingHiddenBoundary = pendingHiddenBoundary || event.tag === "tool_call" || isTerminal;
	};
	const emitToolSummary = async (event) => {
		if (!await params.shouldSendToolSummaries()) {
			markHiddenToolBoundary(event);
			return;
		}
		const renderedToolSummary = renderToolSummaryText(event, await params.shouldSendFullToolDetails());
		const toolSummary = truncateUtf16WithEllipsis(renderedToolSummary, ACP_MAX_SESSION_UPDATE_CHARS);
		const hash = renderedToolSummary.trim();
		const toolCallId = normalizeOptionalString(event.toolCallId);
		const status = normalizeOptionalLowercaseString(event.status);
		const isTerminal = resolveAcpToolTerminalOutcome(status) !== void 0;
		const isStart = status === "in_progress" || event.tag === "tool_call";
		if (settings.repeatSuppression) {
			if (toolCallId) {
				const state = toolLifecycleById.get(toolCallId) ?? {
					started: false,
					terminal: false
				};
				if (isTerminal && state.terminal || isStart && state.started || state.lastRenderedHash === hash) return;
				state.started ||= isStart;
				state.terminal ||= isTerminal;
				state.lastRenderedHash = hash;
				toolLifecycleById.set(toolCallId, state);
			} else if (lastToolHash === hash) return;
		}
		const deliveryMeta = {
			...toolCallId ? { toolCallId } : {},
			allowEdit: Boolean(toolCallId && event.tag === "tool_call_update")
		};
		await deliverTool(toolSummary, deliveryMeta);
		if (!isLive) markHiddenToolBoundary(event);
		lastToolHash = hash;
	};
	const emitTruncationNotice = async () => {
		if (truncationNoticeEmitted) return;
		truncationNoticeEmitted = true;
		await emitSystemStatus("output truncated", { dedupe: false });
	};
	const onEvent = async (event) => {
		params.onProgress?.();
		if (event.type === "text_delta") {
			if (event.stream && event.stream !== "output") return;
			if (!isAcpTagVisible(settings, event.tag)) return;
			let text = event.text;
			if (!text) return;
			if (pendingHiddenBoundary && shouldInsertSeparator({
				separator: hiddenBoundarySeparator,
				previousTail: lastVisibleOutputTail,
				nextText: text
			})) text = `${hiddenBoundarySeparator}${text}`;
			pendingHiddenBoundary = false;
			if (emittedOutputChars >= ACP_MAX_OUTPUT_CHARS) {
				await emitTruncationNotice();
				return;
			}
			const remaining = ACP_MAX_OUTPUT_CHARS - emittedOutputChars;
			const accepted = remaining < text.length ? truncateUtf16Safe(text, remaining) : text;
			if (accepted.length > 0) {
				emittedOutputChars += accepted.length;
				const safeText = filterConversationContext(accepted);
				lastVisibleOutputTail = safeText.slice(-1) || lastVisibleOutputTail;
				bufferedText += safeText;
				if (isLive) {
					if (shouldFlushLiveBufferOnBoundary(bufferedText)) {
						clearLiveIdleTimer();
						flushLiveBuffer();
					} else scheduleLiveIdleFlush();
				}
			}
			if (accepted.length < text.length) {
				emittedOutputChars = ACP_MAX_OUTPUT_CHARS;
				await emitTruncationNotice();
			}
			return;
		}
		if (event.type === "status") {
			if (!isAcpTagVisible(settings, event.tag)) return;
			if (event.tag === "usage_update" && settings.repeatSuppression) {
				const usageTuple = typeof event.used === "number" && typeof event.size === "number" ? `${event.used}/${event.size}` : event.text.trim();
				if (usageTuple === lastUsageTuple) return;
				lastUsageTuple = usageTuple;
			}
			await emitSystemStatus(event.text);
			return;
		}
		if (event.type === "tool_call") {
			if (!isAcpTagVisible(settings, event.tag)) {
				markHiddenToolBoundary(event);
				return;
			}
			await emitToolSummary(event);
		}
	};
	return {
		onEvent,
		flush
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-payload.ts
const dispatchAcpTtsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
function prepareAcpDeliveryPayload(params) {
	if (!params.routed) return prepareReplyPayloadForDispatcher(params.dispatcher, params.kind, params.payload);
	return normalizeReplyPayloadOutcome(params.payload, { transformReplyPayload: createChannelReplyTransform({
		messaging: params.messaging,
		cfg: params.cfg,
		accountId: params.accountId
	}) });
}
async function maybeApplyAcpTts(params) {
	if (params.skipTts || isReplyPayloadStatusNotice(params.payload)) return params.payload;
	const ttsStatus = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		preparedTtsPreferences: params.preparedTtsPreferences,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if (!ttsStatus || ttsStatus.autoMode === "inbound" && !params.inboundAudio) return params.payload;
	if (params.kind !== "final" && resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	}) === "final") return params.payload;
	const { maybeApplyTtsToPayload } = await dispatchAcpTtsRuntimeLoader.load();
	const applied = await maybeApplyTtsToPayload(params);
	return copyReplyPayloadMetadata(params.payload, applied);
}
const channelPluginRuntimeLoader$1 = createLazyImportLoader(() => import("./plugins-01XRuMGQ.mjs"));
async function shouldTreatDeliveredTextAsVisible(params) {
	if (!normalizeOptionalString(params.text)) return false;
	if (params.kind === "final") return true;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return false;
	const { getChannelPlugin } = await channelPluginRuntimeLoader$1.load();
	const outbound = getChannelPlugin(channelId)?.outbound;
	return (outbound?.shouldTreatDeliveredTextAsVisible ?? outbound?.shouldTreatRoutedTextAsVisible)?.({
		kind: params.kind,
		text: params.text
	}) ?? false;
}
function getAcpBlockTranscriptText(blocks, pendingBlockSource, confirmedOnly = false) {
	const deliveredSources = new Set(blocks.filter((block) => block.delivered).map((block) => block.source));
	const recoveredSources = new Set(blocks.filter((block) => block.delivered === "final").map((block) => block.source));
	recoveredSources.delete(pendingBlockSource);
	for (const block of blocks) if (block.payload.text && !block.delivered) recoveredSources.delete(block.source);
	return blocks.flatMap((block) => {
		const sourceConfirmed = block.source ? block.source.complete && deliveredSources.has(block.source) || recoveredSources.has(block.source) : block.delivered;
		const text = !confirmedOnly || sourceConfirmed ? block.transcriptText : block.delivered ? block.payload.text : void 0;
		return text ? [text] : [];
	}).join("\n");
}
function joinAcpBlockText(blocks) {
	let text = "";
	let previousSource;
	for (const block of blocks) if (block.payload.text) {
		if (text && (!block.source || block.source !== previousSource)) text += "\n";
		text += block.payload.text;
		previousSource = block.source;
	}
	return text;
}
async function recoverAcpBlockText(state, params) {
	if (state.deliveredAnswerFinalToUser || !params.shouldRouteToOriginating && state.untrackedVisibleText !== "none" && !params.suppressBlockUserDelivery && state.deliveredVisibleText && !state.failedVisibleTextDelivery) return false;
	const blocks = state.blockTexts.filter((block) => block.needsFinalDelivery && (!params.onlyUndelivered || !block.delivered));
	let queued = false;
	for (const block of blocks) {
		if (params.abortSignal?.aborted) break;
		if (block.source && !params.suppressBlockUserDelivery && await shouldTreatDeliveredTextAsVisible({
			channel: params.channel,
			kind: "block",
			text: block.payload.text
		}) && hasBlockReplyDeliveryCustody(await block.source.settle())) continue;
		if (params.abortSignal?.aborted) break;
		queued = await block.deliver("final", true) || queued;
		if (block.delivered !== "final") break;
	}
	return queued;
}
function buildAcpTextContinuation(payload, text) {
	return copyReplyPayloadMetadata(payload, {
		text,
		replyToId: payload.replyToId,
		replyToTag: payload.replyToTag,
		replyToCurrent: payload.replyToCurrent,
		isCommentary: payload.isCommentary,
		isReasoning: payload.isReasoning
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-delivery.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply-xRjXpVr8.mjs"));
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-01XRuMGQ.mjs"));
const messageActionRuntimeLoader = createLazyImportLoader(() => import("./message-action-runner-BrvKwxcU.mjs"));
function createAcpDispatchDeliveryCoordinator(params) {
	const directChannel = normalizeOptionalLowercaseString(params.ctx.Provider ?? params.ctx.Surface);
	const routedChannel = normalizeOptionalLowercaseString(params.originatingChannel);
	const deliverySessionKey = normalizeOptionalString(params.sessionKey) ?? params.ctx.SessionKey;
	const explicitAccountId = normalizeOptionalString(params.originatingAccountId) ?? normalizeOptionalString(params.ctx.AccountId);
	const resolvedAccountId = resolveReplyDeliveryAccountId(params.cfg, routedChannel ?? directChannel, explicitAccountId);
	const routedReplyDelivery = params.originatingChannel ? createReplyDeliveryContext(resolveReplyToMode(params.cfg, params.originatingChannel, resolvedAccountId, params.originatingChatType ?? params.ctx.ChatType), params.originatingChatType ?? params.ctx.ChatType) : void 0;
	const state = {
		startedReplyLifecycle: false,
		blockTexts: [],
		accumulatedBlockTtsText: "",
		accumulatedFinalText: "",
		accumulatedDeliveredFinalText: "",
		pendingTranscriptOutcomes: [],
		cleanBlockTtsDirectiveText: shouldCleanTtsDirectiveText({
			cfg: params.cfg,
			preparedTtsPreferences: params.preparedTtsPreferences,
			ttsAuto: params.sessionTtsAuto,
			agentId: params.agentId,
			channelId: params.ttsChannel,
			accountId: resolvedAccountId
		}) ? createTtsDirectiveTextStreamCleaner() : void 0,
		deliveredFinalReply: false,
		pendingAnswerDelivery: false,
		pendingFinalTtsMedia: false,
		deliveredAnswerFinalToUser: false,
		deliveredFinalTtsMedia: false,
		deliveredVisibleText: false,
		failedVisibleTextDelivery: false,
		untrackedVisibleText: "none",
		routedCounts: {
			tool: 0,
			block: 0,
			final: 0
		},
		suppressionReason: void 0,
		toolMessageByCallId: /* @__PURE__ */ new Map()
	};
	let hasPendingDirectBlockReplyDelivery = false;
	let pendingBlockSource;
	let drainBlockText;
	const settleDirectVisibleText = async () => {
		await waitForReplyDispatcherIdle({ waitForIdle: async () => {
			await Promise.all(state.pendingTranscriptOutcomes);
		} }, params.abortSignal);
		if (params.abortSignal?.aborted) return;
		hasPendingDirectBlockReplyDelivery = false;
		if (state.untrackedVisibleText !== "pending") return;
		state.untrackedVisibleText = "settled";
		const receipt = await waitForReplyDispatcherIdle(params.dispatcher, params.abortSignal);
		if (!receipt) return;
		const visibleCounts = [receipt.counts.block, receipt.counts.final];
		state.failedVisibleTextDelivery ||= visibleCounts.some((counts) => counts.failedBeforeSend + counts.failedAfterSend > 0);
		state.deliveredVisibleText ||= visibleCounts.some((counts) => counts.delivered + counts.failedAfterSend > 0);
	};
	const startReplyLifecycleOnce = async () => {
		if (state.startedReplyLifecycle) return;
		state.startedReplyLifecycle = true;
		if (params.suppressReplyLifecycle) return;
		Promise.resolve(params.onReplyStart?.()).catch((error) => {
			logVerbose(`dispatch-acp: reply lifecycle start failed: ${formatErrorMessage(error)}`);
		});
	};
	const tryEditToolMessage = async (payload, toolCallId) => {
		const handle = state.toolMessageByCallId.get(toolCallId);
		if (!handle?.messageId) return false;
		const message = normalizeOptionalString(payload.text);
		if (!message) return false;
		try {
			const { runMessageAction } = await messageActionRuntimeLoader.load();
			await runMessageAction({
				cfg: params.cfg,
				action: "edit",
				params: {
					channel: handle.channel,
					to: handle.to,
					threadId: handle.threadId,
					messageId: handle.messageId,
					message
				},
				defaultAccountId: handle.accountId,
				sessionKey: params.ctx.SessionKey,
				requesterAccountId: params.ctx.AccountId
			});
			state.routedCounts.tool += 1;
			return true;
		} catch (error) {
			logVerbose(`dispatch-acp: tool message edit failed for ${toolCallId}: ${formatErrorMessage(error)}`);
			return false;
		}
	};
	const deliver = async (kind, payload, meta) => {
		if (kind === "block") setBlockReplyDelivery(Promise.resolve({ outcome: "cancelled" }));
		const transcriptSource = meta?.transcriptSource;
		const coveredBlocks = kind === "final" ? state.blockTexts.filter((block) => transcriptSource?.kind === "blocks" || block.needsFinalDelivery) : [];
		const coverFinalBlockText = (source, blocks = coveredBlocks) => {
			if (!source.text?.trim() || source.isCommentary || source.isReasoning || isReplyPayloadStatusNotice(source)) return;
			for (const block of blocks) block.needsFinalDelivery = false;
		};
		let visiblePayload = payload;
		if (!params.suppressUserDelivery) {
			const routed = params.shouldRouteToOriginating && routedChannel !== void 0;
			const messaging = routed ? (await channelPluginRuntimeLoader.load()).getChannelPlugin(routedChannel)?.messaging : void 0;
			const prepared = prepareAcpDeliveryPayload({
				cfg: params.cfg,
				dispatcher: params.dispatcher,
				kind,
				payload,
				routed,
				...messaging ? { messaging } : {},
				accountId: resolvedAccountId
			});
			if (prepared.kind === "suppress") {
				if (prepared.reason === "channel_transform") {
					state.suppressionReason = prepared.reason;
					coverFinalBlockText(payload);
					if (kind === "block" && payload.text?.trim()) setBlockReplyDelivery(Promise.resolve({ outcome: "channel-transform" }), payload);
				}
				return false;
			}
			visiblePayload = prepared.payload;
		}
		const isStatusNotice = isReplyPayloadStatusNotice(visiblePayload);
		const rawBlockPayloadText = kind === "block" ? normalizeOptionalString(visiblePayload.text) : void 0;
		const rawBlockText = isStatusNotice ? void 0 : rawBlockPayloadText;
		let blockSource;
		if (rawBlockPayloadText) {
			const joinsBufferedTtsDirective = state.cleanBlockTtsDirectiveText?.hasBufferedDirectiveText() === true;
			if (rawBlockText) {
				if (state.accumulatedBlockTtsText.length > 0 && !joinsBufferedTtsDirective) state.accumulatedBlockTtsText += "\n";
				state.accumulatedBlockTtsText += rawBlockText;
			}
			if (state.cleanBlockTtsDirectiveText && rawBlockText) {
				if (!visiblePayload.isCommentary && !visiblePayload.isReasoning) blockSource = pendingBlockSource ?? createBlockReplySource();
				const text = state.cleanBlockTtsDirectiveText.push(rawBlockPayloadText);
				if (blockSource) {
					const hasPendingText = state.cleanBlockTtsDirectiveText.hasBufferedDirectiveText();
					blockSource.setComplete(!hasPendingText);
					pendingBlockSource = hasPendingText ? blockSource : void 0;
				}
				visiblePayload = copyReplyPayloadMetadata(visiblePayload, {
					...visiblePayload,
					text: text.trim() ? text : void 0
				});
			}
		}
		const rawFinalText = kind === "final" && !isStatusNotice ? normalizeOptionalString(visiblePayload.text) : void 0;
		if (rawFinalText && !transcriptSource) {
			if (state.accumulatedFinalText.length > 0) state.accumulatedFinalText += "\n";
			state.accumulatedFinalText += rawFinalText;
		}
		const transcriptFinalText = !transcriptSource ? rawFinalText : transcriptSource.kind === "final" ? transcriptSource.text : void 0;
		const sendPrepared = async (preparedPayload, deliveredBlock, skipTts = meta?.skipTts, sendKind = kind) => {
			const recoveringBlock = sendKind === "final" && kind === "block";
			const finalBlocks = recoveringBlock && deliveredBlock ? [deliveredBlock] : coveredBlocks;
			let outgoingPayload = recoveringBlock ? deliveredBlock?.delivered || params.suppressBlockUserDelivery ? buildAcpTextContinuation(preparedPayload, preparedPayload.text) : copyReplyPayloadMetadata(preparedPayload, { ...preparedPayload }) : preparedPayload;
			if (!hasOutboundReplyContent(outgoingPayload, { trimText: true })) return false;
			await startReplyLifecycleOnce();
			if (params.suppressUserDelivery) return false;
			if (sendKind === "block" && params.suppressBlockUserDelivery && !isStatusNotice && !outgoingPayload.isReasoning && !outgoingPayload.isCommentary) {
				if (!Boolean(outgoingPayload.mediaUrl || outgoingPayload.mediaUrls?.length || outgoingPayload.presentation || outgoingPayload.interactive || outgoingPayload.channelData)) return false;
				outgoingPayload = copyReplyPayloadMetadata(outgoingPayload, {
					...outgoingPayload,
					text: void 0
				});
			}
			const appliedTtsPayload = await maybeApplyAcpTts({
				preparedTtsPreferences: params.preparedTtsPreferences,
				payload: outgoingPayload,
				cfg: params.cfg,
				agentId: params.agentId,
				channel: params.ttsChannel,
				accountId: resolvedAccountId,
				kind: sendKind,
				inboundAudio: params.inboundAudio,
				ttsAuto: params.sessionTtsAuto,
				skipTts
			});
			const finalVisibleTextSource = sendKind === "final" && params.suppressBlockUserDelivery && state.cleanBlockTtsDirectiveText ? skipTts || outgoingPayload.isError || isReplyPayloadTtsSupplement(outgoingPayload) ? outgoingPayload.text : mergeDeferredFinalText(state.accumulatedBlockTtsText, outgoingPayload.text) : void 0;
			const ttsPayload = finalVisibleTextSource !== void 0 ? copyReplyPayloadMetadata(appliedTtsPayload, {
				...appliedTtsPayload,
				text: cleanDeferredFinalText(finalVisibleTextSource) || void 0
			}) : appliedTtsPayload;
			const hasFinalTtsMedia = sendKind === "final" && isReplyPayloadTtsSupplement(ttsPayload);
			const resolveVisibleText = (channel) => shouldTreatDeliveredTextAsVisible({
				channel,
				kind: sendKind,
				text: ttsPayload.text
			});
			const isAnswerBearingFinal = sendKind === "final" && (isCaptionedFinalTextPayload(outgoingPayload) || hasFinalTtsMedia && Boolean(ttsPayload.text?.trim()));
			const recordVisibleBlock = (tracksVisibleText, confirmed) => {
				state.deliveredVisibleText ||= tracksVisibleText && confirmed;
				if (deliveredBlock && tracksVisibleText) deliveredBlock.needsFinalDelivery = false;
			};
			const recordPendingDelivery = (tracksVisibleText) => {
				recordVisibleBlock(tracksVisibleText, false);
				const pendingAnswer = tracksVisibleText && sendKind !== "tool" && !isStatusNotice && !ttsPayload.isCommentary && !ttsPayload.isReasoning;
				state.pendingAnswerDelivery ||= pendingAnswer;
				coverFinalBlockText(ttsPayload, finalBlocks);
				state.pendingFinalTtsMedia ||= hasFinalTtsMedia;
			};
			const recordFinalReply = () => {
				if (sendKind === "final") {
					state.deliveredFinalReply = true;
					state.deliveredAnswerFinalToUser ||= !recoveringBlock && isAnswerBearingFinal && (!transcriptSource || transcriptSource.kind === "final");
					state.deliveredFinalTtsMedia ||= hasFinalTtsMedia;
					coverFinalBlockText(ttsPayload, finalBlocks);
				}
			};
			const recordDeliveredReply = (tracksVisibleText) => {
				if (deliveredBlock) deliveredBlock.delivered = sendKind === "final" ? "final" : "block";
				if ((rawFinalText || hasFinalTtsMedia) && transcriptSource?.kind === "blocks") for (const block of finalBlocks) block.delivered = "final";
				else if (transcriptFinalText) state.accumulatedDeliveredFinalText = state.accumulatedDeliveredFinalText ? `${state.accumulatedDeliveredFinalText}\n${transcriptFinalText}` : transcriptFinalText;
				recordFinalReply();
				recordVisibleBlock(tracksVisibleText, true);
			};
			if (params.shouldRouteToOriginating && params.originatingChannel && params.originatingTo) {
				const toolCallId = normalizeOptionalString(meta?.toolCallId);
				if (sendKind === "tool" && meta?.allowEdit === true && toolCallId) {
					if (await tryEditToolMessage(ttsPayload, toolCallId)) return true;
				}
				const tracksVisibleText = await resolveVisibleText(routedChannel);
				const { routeReply } = await routeReplyRuntimeLoader.load();
				const threadId = params.originatingThreadId ?? resolveRoutedDeliveryThreadId({
					ctx: params.ctx,
					sessionKey: deliverySessionKey
				});
				const result = await routeReply({
					payload: ttsPayload,
					channel: params.originatingChannel,
					to: params.originatingTo,
					agentId: params.agentId,
					sessionKey: deliverySessionKey,
					...deliverySessionKey !== params.ctx.SessionKey ? { policySessionKey: params.ctx.SessionKey } : {},
					accountId: resolvedAccountId,
					requesterSenderId: params.ctx.SenderId,
					requesterSenderName: params.ctx.SenderName,
					requesterSenderUsername: params.ctx.SenderUsername,
					requesterSenderE164: params.ctx.SenderE164,
					threadId,
					replyDelivery: routedReplyDelivery,
					cfg: params.cfg,
					abortSignal: params.abortSignal,
					mirror: false,
					replyKind: sendKind,
					runId: params.runId
				});
				const outcome = resolveRoutedReplyDeliveryOutcome(result);
				const pending = outcome === "recovery-owned" || outcome === "failed-deliver";
				if (sendKind === "block") setBlockReplyDelivery(Promise.resolve({
					outcome,
					pending
				}), ttsPayload);
				if (deliveredBlock && result.suppressed && (tracksVisibleText || outcome === "channel-transform" && ttsPayload.text?.trim())) deliveredBlock.needsFinalDelivery = false;
				if (pending) {
					recordPendingDelivery(tracksVisibleText);
					return true;
				}
				if (shouldRetryReplyDispatch(outcome) && hasFinalTtsMedia && ttsPayload.text?.trim()) {
					if (!result.suppressed) logVerbose(`dispatch-acp: route-reply (acp/${sendKind}) failed: ${result.error ?? "unknown error"}`);
					return await deliver("final", { text: ttsPayload.text }, {
						skipTts: true,
						transcriptSource: transcriptSource ?? {
							kind: "final",
							text: rawFinalText ?? ""
						}
					});
				}
				if (!result.delivered && !result.suppressed) {
					if (tracksVisibleText) state.failedVisibleTextDelivery = true;
					logVerbose(`dispatch-acp: route-reply (acp/${sendKind}) failed: ${result.error ?? "unknown error"}`);
					return false;
				}
				if (result.suppressed) {
					if (outcome === "channel-transform") coverFinalBlockText(ttsPayload, finalBlocks);
					if (sendKind === "final") state.deliveredFinalReply = true;
					if (tracksVisibleText) state.deliveredVisibleText = true;
					return true;
				}
				if (!result.ok) logVerbose(`dispatch-acp: route-reply (acp/${sendKind}) partially failed after delivery: ${result.error ?? "unknown error"}`);
				if (sendKind === "tool" && meta?.toolCallId && result.messageId) state.toolMessageByCallId.set(meta.toolCallId, {
					channel: params.originatingChannel,
					accountId: resolvedAccountId,
					to: params.originatingTo,
					...threadId != null ? { threadId } : {},
					messageId: result.messageId
				});
				recordDeliveredReply(tracksVisibleText);
				state.routedCounts[sendKind] += 1;
				return true;
			}
			if (sendKind === "tool" && hasPendingDirectBlockReplyDelivery) {
				hasPendingDirectBlockReplyDelivery = false;
				await waitForReplyDispatcherIdle(params.dispatcher, params.abortSignal);
			}
			const tracksVisibleText = await resolveVisibleText(directChannel);
			const transcriptOutcome = sendKind !== "tool" ? captureReplyDispatchDeliveryOutcome(ttsPayload) : void 0;
			if (hasFinalTtsMedia && ttsPayload.text?.trim()) attachReplyDispatchUndeliveredFallback(ttsPayload, buildCaptionedFinalTextFallback(ttsPayload));
			const delivered = sendKind === "tool" ? params.dispatcher.sendToolResult(ttsPayload) : sendKind === "block" ? params.dispatcher.sendBlockReply(ttsPayload) : params.dispatcher.sendFinalReply(ttsPayload);
			if (sendKind === "block") setBlockReplyDelivery(delivered && transcriptOutcome?.isTracked() ? transcriptOutcome.promise.then((outcome) => ({
				outcome,
				pending: transcriptOutcome.hasPendingDelivery()
			})) : Promise.resolve(delivered ? {
				outcome: "failed-deliver",
				pending: true
			} : { outcome: "cancelled" }), ttsPayload);
			if (delivered && transcriptOutcome?.isTracked()) {
				const settlement = transcriptOutcome.promise.then((outcome) => {
					if (transcriptOutcome.hasPendingDelivery()) recordPendingDelivery(tracksVisibleText);
					else if (outcome === "delivered") recordDeliveredReply(tracksVisibleText);
					else {
						if (!shouldRetryReplyDispatch(outcome)) {
							if (deliveredBlock && ttsPayload.text?.trim()) deliveredBlock.needsFinalDelivery = false;
							coverFinalBlockText(ttsPayload, finalBlocks);
						}
						if (tracksVisibleText) {
							state.failedVisibleTextDelivery ||= outcome === "failed-before-deliver" || outcome === "failed-deliver";
							state.deliveredVisibleText ||= outcome === "failed-deliver";
						}
					}
				});
				state.pendingTranscriptOutcomes.push(settlement);
				if (sendKind === "final") await settlement;
			} else if (delivered) {
				recordFinalReply();
				if (tracksVisibleText) state.untrackedVisibleText = "pending";
			} else if (tracksVisibleText) state.failedVisibleTextDelivery = true;
			if (sendKind === "block" && delivered) hasPendingDirectBlockReplyDelivery = true;
			return delivered;
		};
		const recordBlock = (preparedPayload, transcriptText) => {
			const block = {
				payload: preparedPayload,
				transcriptText,
				source: blockSource,
				needsFinalDelivery: Boolean(preparedPayload.text),
				deliver: (sendKind, skipTts) => sendPrepared(block.payload, block, skipTts, sendKind)
			};
			state.blockTexts.push(block);
			return block;
		};
		const blockText = rawBlockPayloadText ? recordBlock(visiblePayload, rawBlockText) : void 0;
		if (state.cleanBlockTtsDirectiveText && rawBlockText) drainBlockText = state.cleanBlockTtsDirectiveText.hasBufferedDirectiveText() ? async (text) => {
			const tailPayload = buildAcpTextContinuation(visiblePayload, text);
			const tailBlock = recordBlock(tailPayload);
			const sendTail = async () => {
				setBlockReplyDelivery(Promise.resolve({ outcome: "cancelled" }), tailPayload);
				return params.abortSignal?.aborted ? false : await tailBlock.deliver("block", true);
			};
			return blockSource ? await blockSource.run(sendTail) ?? false : await sendTail();
		} : void 0;
		const send = () => blockText ? blockText.deliver("block") : sendPrepared(visiblePayload, void 0);
		return blockSource ? await blockSource.run(send) ?? false : await send();
	};
	return {
		startReplyLifecycle: startReplyLifecycleOnce,
		deliver,
		flushBlockText: async () => {
			if (params.abortSignal?.aborted) return;
			const text = state.cleanBlockTtsDirectiveText?.flush();
			const drain = drainBlockText;
			drainBlockText = void 0;
			pendingBlockSource?.setComplete(true);
			pendingBlockSource = void 0;
			if (text?.trim() && drain) await drain(text);
		},
		getAccumulatedVisibleBlockText: () => joinAcpBlockText(state.blockTexts),
		getVisibleBlockDisplayText: () => combineNonStreamingReplyParts(state.blockTexts.map((block) => trimTextPreservingCode(block.payload.text ?? ""))),
		recoverBlockText: async (options) => {
			if (!params.suppressBlockUserDelivery) await settleDirectVisibleText();
			return await recoverAcpBlockText(state, {
				...params,
				channel: routedChannel ?? directChannel,
				onlyUndelivered: options?.onlyUndelivered
			});
		},
		getAccumulatedBlockTtsText: () => state.accumulatedBlockTtsText,
		getAccumulatedTranscriptText: () => state.accumulatedFinalText || getAcpBlockTranscriptText(state.blockTexts, pendingBlockSource),
		resolveAccumulatedDeliveredTranscriptText: async () => {
			await Promise.all(state.pendingTranscriptOutcomes);
			await Promise.all(state.blockTexts.flatMap((block) => block.source ? [block.source.settle()] : []));
			return state.accumulatedDeliveredFinalText || getAcpBlockTranscriptText(state.blockTexts, pendingBlockSource, true);
		},
		settleVisibleText: settleDirectVisibleText,
		hasDeliveredFinalReply: () => state.deliveredFinalReply,
		hasPendingAnswerDelivery: () => state.pendingAnswerDelivery,
		hasPendingFinalTtsMedia: () => state.pendingFinalTtsMedia,
		hasDeliveredAnswerFinalToUser: () => state.deliveredAnswerFinalToUser,
		hasDeliveredFinalTtsMedia: () => state.deliveredFinalTtsMedia,
		hasDeliveredVisibleText: () => state.deliveredVisibleText,
		hasFailedVisibleTextDelivery: () => state.failedVisibleTextDelivery,
		getDeliverySuppressionReason: () => state.suppressionReason,
		applyRoutedCounts: (counts) => {
			counts.tool += state.routedCounts.tool;
			counts.block += state.routedCounts.block;
			counts.final += state.routedCounts.final;
			return counts;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-finalize.ts
const loadDispatchAcpTtsRuntime = createLazyPromise(() => import("./tts.runtime.js"));
const loadDispatchAcpManagerRuntime$1 = createLazyPromise(() => import("./dispatch-acp-manager.runtime.js"));
async function finalizeAcpTurnOutput(params) {
	const ttsMode = resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.ttsChannel,
		accountId: params.ttsAccountId
	});
	const accumulatedBlockTtsText = params.delivery.getAccumulatedBlockTtsText();
	const hasAccumulatedBlockText = accumulatedBlockTtsText.trim().length > 0;
	const ttsStatus = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		preparedTtsPreferences: params.preparedTtsPreferences,
		sessionAuto: params.sessionTtsAuto,
		agentId: params.agentId,
		channelId: params.ttsChannel,
		accountId: params.ttsAccountId
	});
	const canAttemptFinalTts = ttsMode === "final" && hasAccumulatedBlockText && ttsStatus != null && !(ttsStatus.autoMode === "inbound" && !params.inboundAudio);
	const shouldDeferVisibleTextForTts = params.shouldDeferVisibleTextForTts && canAttemptFinalTts;
	const accumulatedVisibleBlockText = shouldDeferVisibleTextForTts ? cleanDeferredFinalText(accumulatedBlockTtsText) : params.delivery.getAccumulatedVisibleBlockText();
	if (!shouldDeferVisibleTextForTts) await params.delivery.settleVisibleText();
	if (params.abortSignal?.aborted) return false;
	let queuedFinal = params.delivery.hasPendingAnswerDelivery() || params.delivery.hasPendingFinalTtsMedia() || params.delivery.hasDeliveredVisibleText() && !params.delivery.hasFailedVisibleTextDelivery();
	if (canAttemptFinalTts && !params.delivery.hasPendingFinalTtsMedia() && !params.delivery.hasDeliveredFinalTtsMedia()) try {
		const { maybeApplyTtsToPayload } = await loadDispatchAcpTtsRuntime();
		if (params.abortSignal?.aborted) return queuedFinal;
		const ttsSyntheticReply = await maybeApplyTtsToPayload({
			preparedTtsPreferences: params.preparedTtsPreferences,
			payload: { text: accumulatedBlockTtsText },
			cfg: params.cfg,
			channel: params.ttsChannel,
			kind: "final",
			inboundAudio: params.inboundAudio,
			ttsAuto: params.sessionTtsAuto,
			agentId: params.agentId,
			accountId: params.ttsAccountId
		});
		if (ttsSyntheticReply.mediaUrl) {
			const finalTtsPayload = markReplyPayloadAsTtsSupplement({
				...ttsSyntheticReply,
				text: shouldDeferVisibleTextForTts ? accumulatedVisibleBlockText || void 0 : void 0,
				trustedLocalMedia: true
			}, accumulatedBlockTtsText, shouldDeferVisibleTextForTts ? void 0 : { visibleTextAlreadyDelivered: true });
			const delivered = await params.delivery.deliver("final", finalTtsPayload, { transcriptSource: { kind: "blocks" } });
			queuedFinal = queuedFinal || delivered;
		} else if (shouldDeferVisibleTextForTts && ttsSyntheticReply.text?.trim() || needsTtsFallback(true, accumulatedVisibleBlockText, ttsSyntheticReply.text)) {
			const delivered = await params.delivery.deliver("final", { text: ttsSyntheticReply.text }, {
				skipTts: true,
				transcriptSource: { kind: "blocks" }
			});
			queuedFinal = queuedFinal || delivered;
		}
	} catch (err) {
		logVerbose(`dispatch-acp: accumulated ACP block TTS failed: ${formatErrorMessage(err)}`);
	}
	queuedFinal = await params.delivery.recoverBlockText({ onlyUndelivered: ttsMode === "all" }) || queuedFinal;
	if (params.shouldEmitResolvedIdentityNotice) {
		const { readAcpSessionEntryAsync } = await loadDispatchAcpManagerRuntime$1();
		const currentSession = await readAcpSessionEntryAsync({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
		if (params.abortSignal?.aborted) return queuedFinal;
		const currentMeta = currentSession?.acp;
		const identityAfterTurn = resolveSessionIdentityFromMeta(currentMeta);
		if (!isSessionIdentityPending(identityAfterTurn)) {
			const resolvedDetails = resolveAcpThreadSessionDetailLines({
				sessionKey: params.sessionKey,
				meta: currentMeta
			});
			if (resolvedDetails.length > 0) {
				const delivered = await params.delivery.deliver("final", {
					text: prefixSystemMessage(["Session ids resolved.", ...resolvedDetails].join("\n")),
					isStatusNotice: true
				});
				queuedFinal = queuedFinal || delivered;
			}
		}
	}
	return queuedFinal;
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-prompt.ts
function resolveAcpTurnText(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only") return params.promptText;
	const guidance = prefixSystemMessage([
		"Source channel delivery is private by default for this turn.",
		"Normal ACP final output will not be automatically posted to the source channel.",
		"To send visible output, use message(action=send). The target defaults to the current source channel."
	].join(" "));
	return params.promptText ? `${guidance}\n\n${params.promptText}` : guidance;
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp.ts
const loadDispatchAcpManagerRuntime = createLazyPromise(() => import("./dispatch-acp-manager.runtime.js"));
const loadDispatchAcpAuditRuntime = createLazyPromise(() => import("./acp-lifecycle-DdJS9wZr.mjs"));
const loadDispatchAcpTranscriptRuntime = createLazyPromise(() => import("./dispatch-acp-transcript.runtime.js"));
function resolveAcpRequestId(ctx) {
	const id = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	return normalizeOptionalString(id) ?? (typeof id === "number" || typeof id === "bigint" ? String(id) : generateSecureUuid());
}
async function tryDispatchAcpReplyCore(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey || params.bypassForCommand) return null;
	prepareChannelParticipantObservation(params.ctx);
	const inputRecorder = params.userTurnTranscriptRecorder;
	const input = bindUserTurnInput(inputRecorder, () => params.abortSignal?.throwIfAborted());
	const { getAcpSessionManager, maybeUnbindStaleBoundConversations, prepareAcpDispatchStart } = await loadDispatchAcpManagerRuntime();
	const acpManager = getAcpSessionManager();
	const acpResolution = await acpManager.resolveSessionAsync({
		cfg: params.cfg,
		sessionKey,
		agentId: resolveSessionAgentId({
			config: params.cfg,
			sessionKey,
			fallbackAgentId: params.ctx.AgentId
		}),
		assertCurrent: input.assertLifetimeCurrent
	});
	await input.withCurrent(() => {});
	if (acpResolution.kind === "none") return null;
	const canonicalSessionKey = acpResolution.sessionKey;
	const transcriptSessionId = acpResolution.kind === "ready" ? acpResolution.entry?.sessionId : void 0;
	const acpAgentId = acpResolution.agentId;
	const participantTarget = {
		agentId: acpAgentId,
		sessionKey: canonicalSessionKey,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: acpAgentId }),
		onError: (error) => logVerbose(`dispatch-acp: participant persistence failed: ${formatErrorMessage(error)}`)
	};
	const progressSessionKeys = isDiagnosticsEnabled(params.cfg) ? normalizeUniqueTrimmedStringList([
		params.ctx.SessionKey,
		sessionKey,
		canonicalSessionKey
	]) : [];
	const markAcpProgress = progressSessionKeys.length > 0 ? () => {
		for (const key of progressSessionKeys) markDiagnosticSessionProgress({ sessionKey: key });
	} : void 0;
	const identityPendingBeforeTurn = isSessionIdentityPending(resolveSessionIdentityFromMeta(acpResolution.kind === "ready" ? acpResolution.meta : void 0));
	const hasBoundConversationForSession = async () => {
		const channel = normalizeOptionalLowercaseString(params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider) ?? "";
		if (!channel) return false;
		const accountId = normalizeOptionalLowercaseString(params.ctx.AccountId) ?? "";
		const configuredDefaultAccountId = params.cfg.channels?.[channel]?.defaultAccount;
		const normalizedAccountId = accountId || normalizeOptionalLowercaseString(configuredDefaultAccountId) || "default";
		const { listSessionBindingsBySessionAsync } = await loadDispatchAcpManagerRuntime();
		return (await listSessionBindingsBySessionAsync(canonicalSessionKey)).some((binding) => normalizeOptionalLowercaseString(binding.conversation.channel) === channel && (normalizeOptionalLowercaseString(binding.conversation.accountId) || "default") === normalizedAccountId && Boolean(normalizeOptionalString(binding.conversation.conversationId)));
	};
	const shouldEmitResolvedIdentityNotice = !params.suppressUserDelivery && identityPendingBeforeTurn && (params.ctx.MessageThreadId != null && String(params.ctx.MessageThreadId).trim() !== "" || await hasBoundConversationForSession());
	const resolvedAcpAgent = acpResolution.kind === "ready" ? normalizeOptionalString(acpResolution.meta.agent) ?? normalizeOptionalString(params.cfg.acp?.defaultAgent) ?? resolveAgentIdFromSessionKey(canonicalSessionKey) : resolveAgentIdFromSessionKey(canonicalSessionKey);
	const normalizedDispatchChannel = normalizeOptionalLowercaseString(params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider);
	const explicitDispatchAccountId = normalizeOptionalString(params.ctx.AccountId);
	const dispatchChannels = params.cfg.channels;
	const defaultDispatchAccount = normalizedDispatchChannel == null ? void 0 : dispatchChannels?.[normalizedDispatchChannel]?.defaultAccount;
	const effectiveDispatchAccountId = explicitDispatchAccountId ?? normalizeOptionalString(defaultDispatchAccount);
	const preparedTtsPreferences = params.preparedTtsPreferences ?? await prepareTtsPreferences();
	await input.withCurrent(() => {});
	const shouldDeferVisibleTextForTts = shouldDeferFinalTtsText({
		preparedTtsPreferences,
		cfg: params.cfg,
		ttsAuto: params.sessionTtsAuto,
		agentId: acpAgentId,
		channelId: params.ttsChannel,
		accountId: effectiveDispatchAccountId,
		inboundAudio: params.inboundAudio
	});
	let queuedFinal = false;
	const delivery = createAcpDispatchDeliveryCoordinator({
		...params,
		preparedTtsPreferences,
		agentId: acpAgentId,
		sessionKey: canonicalSessionKey,
		suppressBlockUserDelivery: shouldDeferVisibleTextForTts
	});
	const pendingAnswerText = params.ctx.agentText.trim();
	const persistInput = inputRecorder ? async () => {
		await input.withCurrent(() => {});
		await inputRecorder.persistApproved();
		await input.withCurrent(() => {});
		if (!inputRecorder.hasPersisted()) throw new Error("ACP input must be durably committed before dispatch.");
	} : void 0;
	try {
		if (pendingAnswerText && !params.images?.length && !params.extractedFileImages?.length && !hasInboundMediaForUnderstanding(params.ctx) && await claimPreparedPendingAgentQuestionAnswer({
			sessionKey: acpResolution.sessionKey,
			text: pendingAnswerText,
			sourceRecorder: inputRecorder,
			authority: {
				kind: "run",
				assertCurrent: input.assertNativeCurrent
			}
		}, () => assertPreparedConversationBindingRouteCurrent(params.ctx))) {
			recordAcceptedSessionParticipantInput(params.ctx, participantTarget);
			const counts = params.dispatcher.getQueuedCounts();
			params.recordProcessed("completed", { reason: "acp_question_answer" });
			params.markIdle("message_completed");
			return {
				queuedFinal: false,
				counts
			};
		}
	} catch (error) {
		if (!(error instanceof QuestionAnswerUnconfirmedError) && !(error instanceof PreparedQuestionAnswerRefusedError)) throw error;
		params.recordProcessed("error", {
			reason: error instanceof QuestionAnswerUnconfirmedError ? "acp_question_answer_unconfirmed" : "acp_question_answer_refused",
			error: error.message
		});
		const queuedNotice = await delivery.deliver("final", {
			text: error.message,
			isError: true
		}).catch((deliveryError) => {
			logVerbose(`dispatch-acp: question notice delivery failed: ${formatErrorMessage(deliveryError)}`);
			return false;
		});
		params.markIdle("message_error");
		return {
			queuedFinal: queuedNotice,
			counts: delivery.applyRoutedCounts(params.dispatcher.getQueuedCounts())
		};
	}
	const deliverDeferredTextFallback = async () => shouldDeferVisibleTextForTts ? await delivery.recoverBlockText() : false;
	const isLive = resolveAcpProjectionSettings(params.cfg).deliveryMode === "live";
	let streamedText = "";
	const projector = createAcpReplyProjector({
		cfg: params.cfg,
		shouldSendToolSummaries: params.shouldSendToolSummaries,
		shouldSendFullToolDetails: params.shouldSendFullToolDetails,
		deliver: async (kind, payload, meta) => {
			const delivered = await delivery.deliver(kind, payload, meta);
			const text = isLive && kind === "block" ? delivery.getVisibleBlockDisplayText() : "";
			const delta = text.startsWith(streamedText) ? text.slice(streamedText.length) : text;
			if (delta && !auditOnly && !params.suppressUserDelivery) {
				auditRuntime.emitAcpAssistantDelta({
					runId: auditRunId,
					text,
					delta
				});
				streamedText = text;
			}
			return delivered;
		},
		getConversationContext: () => params.ctx.agentText,
		onProgress: markAcpProgress,
		provider: params.ctx.Surface ?? params.ctx.Provider,
		accountId: effectiveDispatchAccountId
	});
	const acpDispatchStartedAt = Date.now();
	const finishAttempt = (finalQueued, error) => {
		const counts = delivery.applyRoutedCounts(params.dispatcher.getQueuedCounts());
		const suppressionReason = counts.tool + counts.block + counts.final > 0 || finalQueued ? void 0 : delivery.getDeliverySuppressionReason();
		const acpStats = acpManager.getObservabilitySnapshot();
		logVerbose(`acp-dispatch: session=${sessionKey} outcome=${error ? `error code=${error.code}` : "ok"} latencyMs=${Date.now() - acpDispatchStartedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: error ? `acp_error:${normalizeLowercaseStringOrEmpty(error.code)}` : suppressionReason ?? "acp_dispatch" });
		params.markIdle("message_completed");
		return {
			queuedFinal: finalQueued,
			counts
		};
	};
	const requestId = resolveAcpRequestId(params.ctx);
	const existingRunId = normalizeOptionalString(params.runId);
	const auditOnly = existingRunId === void 0;
	let completionSource;
	const auditRunId = existingRunId ?? generateSecureUuid();
	const auditRuntime = await loadDispatchAcpAuditRuntime();
	const auditToolTracker = auditRuntime.createAcpToolLifecycleTracker();
	const auditContext = {
		runId: auditRunId,
		sessionKey: canonicalSessionKey,
		agentId: acpAgentId,
		auditOnly
	};
	let auditStarted = false;
	let auditFinished = false;
	let auditTerminalOutcome;
	let auditStopReason;
	let auditResultStatus;
	let assistantTranscript;
	let terminalOutcome;
	const notifyDispatchStart = await prepareAcpDispatchStart({
		scope: participantTarget,
		sessionId: transcriptSessionId,
		runId: auditRunId,
		onAgentRunStart: params.onAgentRunStart,
		onPreparedAgentRunStart: params.onPreparedAgentRunStart,
		getResult: () => ({
			assistantTranscript,
			terminalOutcome
		})
	});
	await input.withCurrent(() => {});
	let auditEndFields;
	const resolveAuditEndFields = () => auditEndFields ??= auditRuntime.resolveAcpLifecycleEndFields(params.abortSignal, auditStopReason, auditResultStatus);
	const emitAuditStart = () => {
		if (auditStarted) return;
		auditStarted = true;
		completionSource = notifyDispatchStart();
		auditRuntime.emitAcpLifecycleStart({
			...auditContext,
			startedAt: Date.now(),
			completionSource
		});
	};
	const emitAuditTerminal = (error) => {
		if (auditFinished) return;
		emitAuditStart();
		auditFinished = true;
		const lifecycle = {
			...auditContext,
			toolTracker: auditToolTracker,
			completionSource
		};
		terminalOutcome = error ? auditRuntime.emitAcpLifecycleError({
			...lifecycle,
			...params.abortSignal ? { abortSignal: params.abortSignal } : {},
			...auditTerminalOutcome ? { terminalOutcome: auditTerminalOutcome } : {},
			error
		}) : auditRuntime.emitAcpLifecycleEnd({
			...lifecycle,
			endFields: resolveAuditEndFields()
		});
	};
	let transcriptPromptText = "";
	let turnDispatched = false;
	let transcriptPersistenceAttempted = false;
	const persistTranscript = async (finalText) => {
		if (transcriptPersistenceAttempted) return;
		transcriptPersistenceAttempted = true;
		terminalOutcome ??= buildAgentRunTerminalOutcomeFromLifecycleEvent({
			phase: "end",
			data: resolveAuditEndFields()
		});
		const { persistAcpDispatchTranscript } = await loadDispatchAcpTranscriptRuntime();
		assistantTranscript = await persistAcpDispatchTranscript({
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			expectedSessionId: transcriptSessionId,
			promptText: transcriptPromptText,
			finalText,
			terminalOutcome,
			meta: acpResolution.kind === "ready" ? acpResolution.meta : void 0,
			threadId: params.ctx.MessageThreadId,
			userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
			prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage,
			assistantIdempotencyKey: existingRunId
		});
	};
	let admittedRunContext;
	let nativeActionEvidenceRecorded = false;
	const recordUnsupportedNativeActionEvidence = () => {
		if (nativeActionEvidenceRecorded) return;
		nativeActionEvidenceRecorded = true;
		recordRuntimeActionDecision({
			token: admittedRunContext?.executionIdentityToken,
			family: "native-runtime",
			operation: "action-evidence",
			outcome: "not-applicable",
			coverageState: "unsupported",
			reasonCode: "native_action_callback_unsupported",
			owner: "acp-runtime",
			decisionBoundary: "acp-runtime.prompt-submitted",
			summary: "ACP runtime action evidence is unsupported because the adapter exposes no authoritative native-action callback.",
			missingEvidence: ["native.action_callback"],
			remediation: [{
				code: "instrument_native_action_callback",
				text: "Instrument an authoritative native-action callback in the ACP adapter before claiming action evidence."
			}]
		});
	};
	try {
		const dispatchPolicyError = resolveAcpDispatchPolicyError(params.cfg);
		if (dispatchPolicyError) {
			auditTerminalOutcome = "blocked";
			throw dispatchPolicyError;
		}
		if (params.toolsAllow !== void 0 && !params.toolsAllow.some((entry) => normalizeLowercaseStringOrEmpty(entry) === "*") || toolPolicyRestrictsTools(params.ctx.ConversationToolPolicy)) {
			auditTerminalOutcome = "blocked";
			throw new AcpRuntimeError("ACP_DISPATCH_DISABLED", "This session's bound runtime cannot enforce its permission or tool policy; use an embedded runtime for this restricted conversation.");
		}
		if (acpResolution.kind === "stale") {
			emitAuditTerminal(acpResolution.error);
			await maybeUnbindStaleBoundConversations({
				targetSessionKey: canonicalSessionKey,
				error: acpResolution.error
			});
			return finishAttempt(await delivery.deliver("final", {
				text: formatAcpRuntimeErrorText(acpResolution.error),
				isError: true
			}), acpResolution.error);
		}
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, resolvedAcpAgent);
		if (agentPolicyError) {
			auditTerminalOutcome = "blocked";
			throw agentPolicyError;
		}
		const resolvedTurnAttachments = await resolveAgentTurnAttachments({
			ctx: params.ctx,
			cfg: params.cfg
		});
		let extractedFileImages = params.extractedFileImages ?? [];
		if (hasInboundMediaForUnderstanding(params.ctx) && !params.ctx.MediaUnderstanding?.length) try {
			const { applyMediaUnderstanding } = await loadAgentTurnMediaRuntime();
			const mediaResult = await applyMediaUnderstanding({
				ctx: params.ctx,
				cfg: params.cfg,
				deliveredImageIndexes: new Set(resolvedTurnAttachments.attachmentIndexes ?? []),
				agentId: acpAgentId,
				agentDir: resolveAgentDir(params.cfg, acpAgentId),
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, acpAgentId)
			});
			if (mediaResult.extractedFileImages.length > 0) extractedFileImages = [...extractedFileImages, ...mediaResult.extractedFileImages];
		} catch (err) {
			logVerbose(`dispatch-acp: media understanding failed, proceeding with raw content: ${formatErrorMessage(err)}`);
		}
		const promptText = params.ctx.agentText.trim();
		const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
		const recentHistoryStart = resolvedTurnAttachments.attachments.length - resolvedTurnAttachments.recentHistoryImages.length;
		const mediaAttachmentEntries = resolvedTurnAttachments.attachments.flatMap((attachment, index) => {
			const sourceIndex = resolvedTurnAttachments.attachmentIndexes?.[index];
			return sourceIndex !== void 0 && !describedImageIndexes.has(sourceIndex) && (describedImageIndexes.size === 0 || index < recentHistoryStart) ? [{
				attachment,
				sourceIndex
			}] : [];
		});
		const recentHistoryImages = describedImageIndexes.size === 0 ? resolvedTurnAttachments.recentHistoryImages : [];
		const inlineAttachments = resolveInlineAgentImageAttachments(params.images);
		const extractedAttachments = resolveInlineAgentImageAttachments(extractedFileImages.map(stripExtractedFileImageMetadata));
		const useMediaAttachments = mediaAttachmentEntries.length > 0 && !(mediaAttachmentEntries.length === recentHistoryImages.length && (inlineAttachments.length > 0 || extractedAttachments.length > 0));
		const attachments = [...useMediaAttachments ? mediaAttachmentEntries : inlineAttachments.map((attachment) => ({
			attachment,
			sourceIndex: void 0
		})), ...extractedAttachments.map((attachment, index) => ({
			attachment,
			sourceIndex: extractedFileImages[index]?.attachmentIndex
		}))].map(({ attachment, sourceIndex }, sequence) => ({
			attachment,
			sourceIndex,
			sequence
		})).toSorted((left, right) => {
			if (left.sourceIndex !== void 0 && right.sourceIndex !== void 0) return left.sourceIndex - right.sourceIndex || left.sequence - right.sequence;
			return left.sequence - right.sequence;
		}).map((entry) => entry.attachment);
		const turnPromptText = useMediaAttachments ? appendRecentHistoryImageContext({
			promptText,
			images: recentHistoryImages
		}) : promptText;
		transcriptPromptText = turnPromptText;
		if (!turnPromptText && attachments.length === 0) {
			const counts = delivery.applyRoutedCounts(params.dispatcher.getQueuedCounts());
			params.recordProcessed("completed", { reason: "acp_empty_prompt" });
			params.markIdle("message_completed");
			return {
				queuedFinal: false,
				counts
			};
		}
		admittedRunContext = await prepareChannelRunAdmission({
			cfg: params.cfg,
			runId: requestId,
			agentId: acpAgentId,
			ingressKind: "acp",
			boundary: "auto-reply.acp",
			evidence: readChannelContextAdmissionEvidence(params.ctx),
			gatewayLocalUserIngress: getGatewayLocalUserIngress(params.ctx)
		}).admit("acp");
		recordAcceptedSessionParticipantInput(params.ctx, participantTarget);
		const turnAdmission = admittedRunContext;
		const onElicitation = createLazyAcpElicitationHandler({
			sourceSessionKey: sessionKey,
			targetSessionKey: canonicalSessionKey,
			outerRequestId: requestId,
			agentId: acpAgentId,
			runId: auditRunId,
			delivery,
			isActive: () => params.abortSignal?.aborted !== true && admittedRunContext === turnAdmission && getAdmittedRunDelegatedAuthority(turnAdmission) !== void 0
		});
		await persistInput?.();
		emitAuditStart();
		try {
			await delivery.startReplyLifecycle();
		} catch (error) {
			logVerbose(`dispatch-acp: start reply lifecycle failed: ${formatErrorMessage(error)}`);
		}
		await assertPreparedConversationBindingRouteCurrent(params.ctx);
		const turnInput = {
			admittedRunContext,
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			provenance: classifySessionStateActor({
				inputProvenance: params.ctx.InputProvenance,
				sessionEffects: params.ctx.InboundEventKind === "room_event" ? "internal" : "visible"
			}).actorType,
			text: resolveAcpTurnText({
				promptText: turnPromptText,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
			}),
			attachments: attachments.length > 0 ? attachments : void 0,
			mode: "prompt",
			requestId,
			...params.abortSignal ? { signal: params.abortSignal } : {},
			onBeforePrompt: async () => {
				await input.withCurrent(() => {});
				await params.turnAdoption?.adopt();
				await assertPreparedConversationBindingRouteCurrent(params.ctx);
				await input.withCurrent(() => {
					if (getAdmittedRunDelegatedAuthority(turnAdmission) === void 0) throw new Error("ACP turn admission ended before input dispatch.");
				});
			},
			onElicitation,
			onLifecycle: recordUnsupportedNativeActionEvidence,
			onEvent: async (event) => {
				auditRuntime.emitAcpRuntimeEvent({
					...auditContext,
					toolTracker: auditToolTracker,
					...params.abortSignal ? { abortSignal: params.abortSignal } : {},
					event
				});
				if (event.type === "done") {
					auditStopReason = event.stopReason;
					auditResultStatus = event.status;
				}
				await projector.onEvent(event);
			}
		};
		await input.withCurrent(() => {
			if (getAdmittedRunDelegatedAuthority(turnAdmission) === void 0) throw new Error("ACP turn admission ended before input dispatch.");
			turnDispatched = true;
			return acpManager.runTurn(turnInput);
		});
		await projector.flush();
		await delivery.flushBlockText();
		if (auditResultStatus !== "cancelled" && !params.abortSignal?.aborted) queuedFinal = await finalizeAcpTurnOutput({
			preparedTtsPreferences,
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			delivery,
			inboundAudio: params.inboundAudio,
			sessionTtsAuto: params.sessionTtsAuto,
			ttsChannel: params.ttsChannel,
			ttsAccountId: effectiveDispatchAccountId,
			shouldDeferVisibleTextForTts,
			shouldEmitResolvedIdentityNotice,
			abortSignal: params.abortSignal
		}) || queuedFinal;
		if (auditResultStatus === "cancelled" || params.abortSignal?.aborted) {
			queuedFinal = await deliverDeferredTextFallback() || queuedFinal;
			await persistTranscript(await delivery.resolveAccumulatedDeliveredTranscriptText());
			queuedFinal = delivery.hasPendingAnswerDelivery() || delivery.hasPendingFinalTtsMedia() || delivery.hasDeliveredFinalReply() || queuedFinal;
			const counts = delivery.applyRoutedCounts(params.dispatcher.getQueuedCounts());
			params.recordProcessed("completed", { reason: "acp_aborted" });
			params.markIdle("message_aborted");
			emitAuditTerminal();
			return {
				queuedFinal,
				counts
			};
		}
		await persistTranscript(delivery.getAccumulatedTranscriptText());
		const result = finishAttempt(queuedFinal);
		emitAuditTerminal();
		return result;
	} catch (err) {
		params.turnAdoption?.assertCurrent();
		const acpError = toAcpRuntimeError({
			error: err,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		emitAuditTerminal(acpError);
		await projector.flush();
		await delivery.flushBlockText();
		queuedFinal = await deliverDeferredTextFallback() || queuedFinal;
		await maybeUnbindStaleBoundConversations({
			targetSessionKey: canonicalSessionKey,
			error: acpError
		});
		const errorText = formatAcpRuntimeErrorText(acpError);
		const partialText = delivery.getAccumulatedTranscriptText();
		const delivered = await delivery.deliver("final", {
			text: errorText,
			isError: true
		});
		if (turnDispatched) await persistTranscript(partialText ? `${partialText}\n\n${errorText}` : errorText);
		queuedFinal = queuedFinal || delivered;
		return finishAttempt(queuedFinal, acpError);
	} finally {
		if (admittedRunContext) closeAdmittedRunDelegatedAuthority(admittedRunContext);
	}
}
//#endregion
export { tryDispatchAcpReplyCore };
