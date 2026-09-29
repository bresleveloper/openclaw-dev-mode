import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-CVabF32H.mjs";
import { d as toolPolicyRestrictsTools } from "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DdRNB2jf.mjs";
import { a as copyReplyPayloadMetadata, b as markReplyPayloadAsTtsSupplement, h as isReplyPayloadStatusNotice, v as isReplyPayloadTtsSupplement } from "./reply-payload-B2ZQhznY.mjs";
import { i as shouldCleanTtsDirectiveText, t as resolveConfiguredTtsMode } from "./tts-config-DK27R_zM.mjs";
import { c as readChannelContextAdmissionEvidence } from "./admission-evidence-aqOMZf0e.mjs";
import { r as prepareChannelParticipantObservation } from "./host-context-builder-DDDipgdC.mjs";
import { a as toAcpRuntimeError, n as AcpRuntimeError } from "./errors-Ks5ZnY05.mjs";
import { t as formatAcpRuntimeErrorText } from "./error-text-iBehXV1V.mjs";
import { o as isSessionIdentityPending, u as resolveSessionIdentityFromMeta } from "./session-identity-BX68pph-.mjs";
import { i as resolveAcpThreadSessionDetailLines } from "./session-identifiers-dXNk5MtW.mjs";
import "./errors-BeQQKpA8.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission, n as closeAdmittedRunDelegatedAuthority, o as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { n as classifySessionStateActor } from "./session-state-events-CMg59EpB.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { r as createVerifiedConversationContextStreamFilter } from "./user-facing-text-D8c_iKUB.mjs";
import { n as QuestionAnswerUnconfirmedError, t as PreparedQuestionAnswerRefusedError } from "./gateway-question-dispatch-Bc0iAUTx.mjs";
import { f as markDiagnosticSessionProgress } from "./diagnostic-CT1lx7JC.mjs";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-gZujyBo1.mjs";
import { g as shouldRetryReplyDispatch, h as resolveRoutedReplyDeliveryOutcome, o as prepareReplyPayloadForDispatcher, r as captureReplyDispatchDeliveryOutcome, s as waitForReplyDispatcherIdle, t as attachReplyDispatchUndeliveredFallback } from "./reply-dispatcher-CLU3uA4U.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { n as resolveRoutedDeliveryThreadId } from "./routed-delivery-thread-BgOncaiJ.mjs";
import { n as assertPreparedConversationBindingRouteCurrent } from "./session-conversation-binding-Bk7oYC8c.mjs";
import { a as isCaptionedFinalTextPayload, i as cleanDeferredFinalText, n as needsTtsFallback, o as mergeDeferredFinalText, r as buildCaptionedFinalTextFallback, s as shouldDeferFinalTtsText } from "./dispatch-from-config.finalize-D8z2sl2c.mjs";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-B0TC0IWT.mjs";
import { t as resolveStatusTtsSnapshot } from "./status-config-BMD-8eHc.mjs";
import { _ as hasBlockReplyDeliveryCustody, h as createBlockReplySource, m as createBlockReplyPipeline, y as setBlockReplyDelivery } from "./dispatch-from-config.payloads-66_-9iD5.mjs";
import { i as claimPreparedPendingAgentQuestionAnswer } from "./gateway-question-D_lf0vLm.mjs";
import { n as formatToolSummary, o as resolveToolDisplay } from "./tool-display-DjrvDE8J.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { r as hasInboundMediaForUnderstanding } from "./inbound-media-CetKPfK2.mjs";
import { a as resolveReplyDeliveryAccountId, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-lgVuxEkY.mjs";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "./policy-DEGknwt4.mjs";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-G-Ecjp62.mjs";
import { r as createChannelReplyTransform } from "./reply-transform-C-o_JYnv.mjs";
import { r as prefixSystemMessage } from "./system-message-C34aMvlW.mjs";
import { t as stripExtractedFileImageMetadata } from "./extracted-file-images-CdmNdoIK.mjs";
import { a as appendRecentHistoryImageContext, i as resolveInlineAgentImageAttachments, n as loadAgentTurnMediaRuntime, r as resolveAgentTurnAttachments, t as collectDescribedImageAttachmentIndexes } from "./agent-turn-attachments-ImBe_X3T.mjs";
import { t as recordAcceptedSessionParticipantInput } from "./session-participant-input-recording-D-925dJj.mjs";
import { t as createLazyAcpElicitationHandler } from "./acp-elicitation-handler-lazy-D6oxflNe.mjs";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-B16MNIm3.mjs";
import { n as resolveAcpProjectionSettings, r as resolveAcpStreamingConfig, t as isAcpTagVisible } from "./acp-stream-settings-CCpaXah7.mjs";
import { t as consumeChannelRunAdmission } from "./channel-run-admission-DTp_ie4W.mjs";
//#region src/auto-reply/reply/acp-projector.ts
const ACP_BLOCK_REPLY_TIMEOUT_MS = 15e3;
const ACP_LIVE_IDLE_FLUSH_FLOOR_MS = 750;
const ACP_LIVE_IDLE_MIN_CHARS = 80;
const ACP_LIVE_SOFT_FLUSH_CHARS = 220;
const ACP_LIVE_HARD_FLUSH_CHARS = 480;
const HIDDEN_BOUNDARY_TAGS = /* @__PURE__ */ new Set(["tool_call", "tool_call_update"]);
function hashText(text) {
	return text.trim();
}
function normalizeToolStatus(status) {
	return normalizeOptionalLowercaseString(status) || void 0;
}
function resolveHiddenBoundarySeparatorText(mode) {
	if (mode === "space") return " ";
	if (mode === "newline") return "\n";
	if (mode === "paragraph") return "\n\n";
	return "";
}
function shouldInsertSeparator(params) {
	if (!params.separator) return false;
	if (!params.nextText) return false;
	const firstChar = params.nextText[0];
	if (typeof firstChar === "string" && /\s/.test(firstChar)) return false;
	const tail = params.previousTail ?? "";
	if (!tail) return false;
	if (params.separator === " " && /\s$/.test(tail)) return false;
	if ((params.separator === "\n" || params.separator === "\n\n") && tail.endsWith("\n")) return false;
	return true;
}
function shouldFlushLiveBufferOnBoundary(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_HARD_FLUSH_CHARS) return true;
	if (text.endsWith("\n\n")) return true;
	if (/[.!?][)"'`]*\s$/.test(text)) return true;
	if (text.length >= ACP_LIVE_SOFT_FLUSH_CHARS && /\s$/.test(text)) return true;
	return false;
}
function shouldFlushLiveBufferOnIdle(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_IDLE_MIN_CHARS) return true;
	if (/[.!?][)"'`]*$/.test(text.trimEnd())) return true;
	if (text.includes("\n")) return true;
	return false;
}
function renderToolSummaryText(event, shouldSendFullToolDetails) {
	const detailParts = [];
	const commandBearing = normalizeOptionalLowercaseString(event.kind) === "execute";
	const title = shouldSendFullToolDetails || !commandBearing ? normalizeOptionalString(event.title) : void 0;
	if (title) detailParts.push(title);
	const status = normalizeOptionalString(event.status);
	if (status) detailParts.push(`status=${status}`);
	const fallback = shouldSendFullToolDetails || !commandBearing ? normalizeOptionalString(event.text) : void 0;
	if (detailParts.length === 0 && fallback) detailParts.push(fallback);
	const display = resolveToolDisplay({
		name: "tool_call",
		meta: detailParts.join(" · ") || "tool call"
	});
	return formatToolSummary(display);
}
function createAcpReplyProjector(params) {
	const settings = resolveAcpProjectionSettings(params.cfg);
	const streaming = resolveAcpStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		deliveryMode: settings.deliveryMode
	});
	const blockReplyPipeline = createBlockReplyPipeline({
		onBlockReply: async (payload) => {
			await params.deliver("block", payload);
		},
		timeoutMs: ACP_BLOCK_REPLY_TIMEOUT_MS,
		coalescing: settings.deliveryMode === "live" ? void 0 : streaming.coalescing
	});
	const chunker = new EmbeddedBlockChunker(streaming.chunking);
	const filterConversationContext = createVerifiedConversationContextStreamFilter(params.getConversationContext);
	const liveIdleFlushMs = Math.max(streaming.coalescing.idleMs, ACP_LIVE_IDLE_FLUSH_FLOOR_MS);
	let emittedOutputChars = 0;
	let truncationNoticeEmitted = false;
	let lastStatusHash;
	let lastToolHash;
	let lastUsageTuple;
	let lastVisibleOutputTail;
	let pendingHiddenBoundary = false;
	let liveBufferText = "";
	let finalOnlyOutputText = "";
	let liveIdleTimer;
	const pendingToolDeliveries = [];
	const toolLifecycleById = /* @__PURE__ */ new Map();
	const shouldSendToolSummaries = () => params.shouldSendToolSummariesNow?.() ?? params.shouldSendToolSummaries;
	const clearLiveIdleTimer = () => {
		if (!liveIdleTimer) return;
		clearTimeout(liveIdleTimer);
		liveIdleTimer = void 0;
	};
	const drainChunker = (force) => {
		if (settings.deliveryMode === "final_only" && !force) return;
		chunker.drain({
			force,
			emit: (chunk) => {
				blockReplyPipeline.enqueue({ text: chunk });
			}
		});
	};
	const flushLiveBuffer = (opts) => {
		if (settings.deliveryMode !== "live") return;
		if (!liveBufferText) return;
		if (opts?.idle && !shouldFlushLiveBufferOnIdle(liveBufferText)) return;
		const text = liveBufferText;
		liveBufferText = "";
		chunker.append(text);
		drainChunker(opts?.force === true);
	};
	const scheduleLiveIdleFlush = () => {
		if (settings.deliveryMode !== "live") return;
		if (liveIdleFlushMs <= 0 || !liveBufferText) return;
		clearLiveIdleTimer();
		liveIdleTimer = setTimeout(() => {
			flushLiveBuffer({
				force: true,
				idle: true
			});
			if (liveBufferText) scheduleLiveIdleFlush();
		}, liveIdleFlushMs);
	};
	const flushBufferedToolDeliveries = async (force) => {
		if (!(settings.deliveryMode === "final_only" && force)) return;
		if (!shouldSendToolSummaries()) {
			pendingToolDeliveries.length = 0;
			return;
		}
		for (const entry of pendingToolDeliveries.splice(0)) await params.deliver("tool", entry.payload, entry.meta);
	};
	const flush = async (force = false) => {
		if (settings.deliveryMode === "live") {
			clearLiveIdleTimer();
			flushLiveBuffer({ force: true });
		}
		await flushBufferedToolDeliveries(force);
		if (settings.deliveryMode === "final_only") {
			if (force && finalOnlyOutputText.trim().length > 0) {
				const text = finalOnlyOutputText;
				finalOnlyOutputText = "";
				await params.deliver("final", { text });
			}
		} else drainChunker(force);
		await blockReplyPipeline.flush({ force });
	};
	const emitSystemStatus = async (text, meta, opts) => {
		if (!shouldSendToolSummaries()) return;
		const bounded = truncateUtf16WithEllipsis(text.trim(), settings.maxSessionUpdateChars);
		if (!bounded) return;
		const formatted = prefixSystemMessage(bounded);
		const hash = hashText(formatted);
		if (settings.repeatSuppression && opts?.dedupe !== false && lastStatusHash === hash) return;
		if (settings.deliveryMode === "final_only") pendingToolDeliveries.push({
			payload: { text: formatted },
			meta
		});
		else {
			await flush(true);
			await params.deliver("tool", { text: formatted }, meta);
		}
		lastStatusHash = hash;
	};
	const markHiddenToolBoundary = (event) => {
		if (!event.tag || !HIDDEN_BOUNDARY_TAGS.has(event.tag)) return;
		const status = normalizeToolStatus(event.status);
		const isTerminal = resolveAcpToolTerminalOutcome(status) !== void 0;
		pendingHiddenBoundary = pendingHiddenBoundary || event.tag === "tool_call" || isTerminal;
	};
	const emitToolSummary = async (event) => {
		if (!shouldSendToolSummaries()) {
			markHiddenToolBoundary(event);
			return;
		}
		if (!isAcpTagVisible(settings, event.tag)) return;
		const renderedToolSummary = renderToolSummaryText(event, params.shouldSendFullToolDetails);
		const toolSummary = truncateUtf16WithEllipsis(renderedToolSummary, settings.maxSessionUpdateChars);
		const hash = hashText(renderedToolSummary);
		const toolCallId = normalizeOptionalString(event.toolCallId);
		const status = normalizeToolStatus(event.status);
		const isTerminal = resolveAcpToolTerminalOutcome(status) !== void 0;
		const isStart = status === "in_progress" || event.tag === "tool_call";
		if (settings.repeatSuppression) {
			if (toolCallId) {
				const state = toolLifecycleById.get(toolCallId) ?? {
					started: false,
					terminal: false
				};
				if (isTerminal && state.terminal) return;
				if (isStart && state.started) return;
				if (state.lastRenderedHash === hash) return;
				if (isStart) state.started = true;
				if (isTerminal) state.terminal = true;
				state.lastRenderedHash = hash;
				toolLifecycleById.set(toolCallId, state);
			} else if (lastToolHash === hash) return;
		}
		const deliveryMeta = {
			...event.tag ? { tag: event.tag } : {},
			...toolCallId ? { toolCallId } : {},
			...status ? { toolStatus: status } : {},
			allowEdit: Boolean(toolCallId && event.tag === "tool_call_update")
		};
		if (settings.deliveryMode === "final_only") {
			pendingToolDeliveries.push({
				payload: { text: toolSummary },
				meta: deliveryMeta
			});
			markHiddenToolBoundary(event);
		} else {
			await flush(true);
			await params.deliver("tool", { text: toolSummary }, deliveryMeta);
		}
		lastToolHash = hash;
	};
	const emitTruncationNotice = async () => {
		if (truncationNoticeEmitted) return;
		truncationNoticeEmitted = true;
		await emitSystemStatus("output truncated", { tag: "session_info_update" }, { dedupe: false });
	};
	const onEvent = async (event) => {
		params.onProgress?.();
		if (event.type === "text_delta") {
			if (event.stream && event.stream !== "output") return;
			if (!isAcpTagVisible(settings, event.tag)) return;
			let text = event.text;
			if (!text) return;
			if (pendingHiddenBoundary && shouldInsertSeparator({
				separator: resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator),
				previousTail: lastVisibleOutputTail,
				nextText: text
			})) text = `${resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator)}${text}`;
			pendingHiddenBoundary = false;
			if (emittedOutputChars >= settings.maxOutputChars) {
				await emitTruncationNotice();
				return;
			}
			const remaining = settings.maxOutputChars - emittedOutputChars;
			const accepted = remaining < text.length ? truncateUtf16Safe(text, remaining) : text;
			if (accepted.length > 0) {
				emittedOutputChars += accepted.length;
				const safeText = filterConversationContext(accepted);
				lastVisibleOutputTail = safeText.slice(-1) || lastVisibleOutputTail;
				if (settings.deliveryMode === "live") {
					liveBufferText += safeText;
					if (shouldFlushLiveBufferOnBoundary(liveBufferText)) {
						clearLiveIdleTimer();
						flushLiveBuffer({ force: true });
					} else scheduleLiveIdleFlush();
				} else finalOnlyOutputText += safeText;
			}
			if (accepted.length < text.length) {
				emittedOutputChars = settings.maxOutputChars;
				await emitTruncationNotice();
			}
			return;
		}
		if (event.type === "status") {
			if (!isAcpTagVisible(settings, event.tag)) return;
			if (event.tag === "usage_update" && settings.repeatSuppression) {
				const usageTuple = typeof event.used === "number" && typeof event.size === "number" ? `${event.used}/${event.size}` : hashText(event.text);
				if (usageTuple === lastUsageTuple) return;
				lastUsageTuple = usageTuple;
			}
			await emitSystemStatus(event.text, event.tag ? { tag: event.tag } : void 0, { dedupe: true });
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
const dispatchAcpTtsRuntimeLoader$1 = createLazyImportLoader(() => import("./tts.runtime.js"));
function prepareAcpDeliveryPayload(params) {
	if (!params.routed) return prepareReplyPayloadForDispatcher(params.dispatcher, params.kind, params.payload);
	return normalizeReplyPayloadOutcome(params.payload, { transformReplyPayload: createChannelReplyTransform({
		messaging: params.messaging,
		cfg: params.cfg,
		accountId: params.accountId
	}) });
}
async function maybeApplyAcpTts(params) {
	if (params.skipTts) return params.payload;
	if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
	const ttsStatus = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if (!ttsStatus) return params.payload;
	if (ttsStatus.autoMode === "inbound" && !params.inboundAudio) return params.payload;
	if (params.kind !== "final" && resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	}) === "final") return params.payload;
	const { maybeApplyTtsToPayload } = await dispatchAcpTtsRuntimeLoader$1.load();
	const applied = await maybeApplyTtsToPayload({
		payload: params.payload,
		cfg: params.cfg,
		channel: params.channel,
		kind: params.kind,
		inboundAudio: params.inboundAudio,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		accountId: params.accountId
	});
	return copyReplyPayloadMetadata(params.payload, applied);
}
const channelPluginRuntimeLoader$1 = createLazyImportLoader(() => import("./plugins-aqMUFJ4z.mjs"));
async function shouldTreatDeliveredTextAsVisible(params) {
	if (!normalizeOptionalString(params.text)) return false;
	if (params.kind === "final") return true;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return false;
	const { getChannelPlugin } = await channelPluginRuntimeLoader$1.load();
	const outbound = getChannelPlugin(channelId)?.outbound;
	const visibilityOverride = outbound?.shouldTreatDeliveredTextAsVisible ?? outbound?.shouldTreatRoutedTextAsVisible;
	if (visibilityOverride) return visibilityOverride({
		kind: params.kind,
		text: params.text
	});
	return false;
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
	if (state.deliveredAnswerFinalToUser || !params.shouldRouteToOriginating && state.queuedUntrackedVisibleTextDeliveries > 0 && !params.suppressBlockUserDelivery && state.deliveredVisibleText && !state.failedVisibleTextDelivery) return false;
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
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-aqMUFJ4z.mjs"));
const messageActionRuntimeLoader = createLazyImportLoader(() => import("./message-action-runner-BH1vHiX3.mjs"));
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
		queuedUntrackedVisibleTextDeliveries: 0,
		settledUntrackedVisibleText: false,
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
		if (state.settledUntrackedVisibleText || state.queuedUntrackedVisibleTextDeliveries === 0) return;
		state.settledUntrackedVisibleText = true;
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
			const isAnswerBearingFinal = sendKind === "final" && (isCaptionedFinalTextPayload(outgoingPayload) || hasFinalTtsMedia && Boolean(ttsPayload.text?.trim()));
			const recordPendingDelivery = (tracksVisibleText) => {
				if (deliveredBlock && tracksVisibleText) deliveredBlock.needsFinalDelivery = false;
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
				if ((rawFinalText || hasFinalTtsMedia) && transcriptSource && transcriptSource.kind !== "final") for (const block of finalBlocks) block.delivered = "final";
				else if (transcriptFinalText) state.accumulatedDeliveredFinalText = state.accumulatedDeliveredFinalText ? `${state.accumulatedDeliveredFinalText}\n${transcriptFinalText}` : transcriptFinalText;
				recordFinalReply();
				if (tracksVisibleText) {
					state.deliveredVisibleText = true;
					if (deliveredBlock) deliveredBlock.needsFinalDelivery = false;
				}
			};
			if (params.shouldRouteToOriginating && params.originatingChannel && params.originatingTo) {
				const toolCallId = normalizeOptionalString(meta?.toolCallId);
				if (sendKind === "tool" && meta?.allowEdit === true && toolCallId) {
					if (await tryEditToolMessage(ttsPayload, toolCallId)) return true;
				}
				const tracksVisibleText = await shouldTreatDeliveredTextAsVisible({
					channel: routedChannel,
					kind: sendKind,
					text: ttsPayload.text
				});
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
			const tracksVisibleText = await shouldTreatDeliveredTextAsVisible({
				channel: directChannel,
				kind: sendKind,
				text: ttsPayload.text
			});
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
				if (tracksVisibleText) {
					state.queuedUntrackedVisibleTextDeliveries += 1;
					state.settledUntrackedVisibleText = false;
				}
			} else if (!delivered && tracksVisibleText) state.failedVisibleTextDelivery = true;
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
		getRoutedCounts: () => ({ ...state.routedCounts }),
		applyRoutedCounts: (counts) => {
			counts.tool += state.routedCounts.tool;
			counts.block += state.routedCounts.block;
			counts.final += state.routedCounts.final;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp.ts
const dispatchAcpManagerRuntimeLoader = createLazyImportLoader(() => import("./dispatch-acp-manager.runtime.js"));
const dispatchAcpAuditRuntimeLoader = createLazyImportLoader(() => import("./attempt-execution.runtime.js"));
function appendOrderedAcpAttachments(params) {
	for (const [index, attachment] of params.attachments.entries()) params.entries.push({
		attachment,
		sourceIndex: params.sourceIndexes?.[index],
		sequence: params.entries.length
	});
}
function resolveMergedAcpAttachments(entries) {
	return entries.toSorted((left, right) => {
		if (left.sourceIndex !== void 0 && right.sourceIndex !== void 0) return left.sourceIndex - right.sourceIndex || left.sequence - right.sequence;
		return left.sequence - right.sequence;
	}).map((entry) => entry.attachment);
}
const dispatchAcpTtsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const dispatchAcpTranscriptRuntimeLoader = createLazyImportLoader(() => import("./dispatch-acp-transcript.runtime.js"));
function loadDispatchAcpManagerRuntime() {
	return dispatchAcpManagerRuntimeLoader.load();
}
function loadDispatchAcpAuditRuntime() {
	return dispatchAcpAuditRuntimeLoader.load();
}
function loadDispatchAcpTtsRuntime() {
	return dispatchAcpTtsRuntimeLoader.load();
}
function loadDispatchAcpTranscriptRuntime() {
	return dispatchAcpTranscriptRuntimeLoader.load();
}
function resolveAcpPromptText(ctx) {
	return ctx.agentText.trim();
}
function resolveAcpRequestId(ctx) {
	const id = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	if (typeof id === "string") {
		const normalizedId = normalizeOptionalString(id);
		if (normalizedId) return normalizedId;
	}
	if (typeof id === "number" || typeof id === "bigint") return String(id);
	return generateSecureUuid();
}
function resolveAcpTurnText(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only") return params.promptText;
	const guidance = prefixSystemMessage([
		"Source channel delivery is private by default for this turn.",
		"Normal ACP final output will not be automatically posted to the source channel.",
		"To send visible output, use message(action=send). The target defaults to the current source channel."
	].join(" "));
	return params.promptText ? `${guidance}\n\n${params.promptText}` : guidance;
}
function isRestrictiveRuntimeToolsAllow(toolsAllow) {
	if (toolsAllow === void 0) return false;
	return !toolsAllow.some((entry) => normalizeLowercaseStringOrEmpty(entry) === "*");
}
async function hasBoundConversationForSession(params) {
	const channel = normalizeOptionalLowercaseString(params.channelRaw) ?? "";
	if (!channel) return false;
	const accountId = normalizeOptionalLowercaseString(params.accountIdRaw) ?? "";
	const configuredDefaultAccountId = params.cfg.channels?.[channel]?.defaultAccount;
	const normalizedAccountId = accountId || normalizeOptionalLowercaseString(configuredDefaultAccountId) || "default";
	const { getSessionBindingService } = await loadDispatchAcpManagerRuntime();
	return getSessionBindingService().listBySession(params.sessionKey).some((binding) => {
		const bindingChannel = normalizeOptionalLowercaseString(binding.conversation.channel) ?? "";
		const bindingAccountId = normalizeOptionalLowercaseString(binding.conversation.accountId) ?? "";
		const conversationId = normalizeOptionalString(binding.conversation.conversationId) ?? "";
		return bindingChannel === channel && (bindingAccountId || "default") === normalizedAccountId && conversationId.length > 0;
	});
}
function finishAcpDispatchAttempt(params) {
	const counts = params.dispatcher.getQueuedCounts();
	params.delivery.applyRoutedCounts(counts);
	const suppressionReason = counts.tool + counts.block + counts.final > 0 || params.queuedFinal ? void 0 : params.delivery.getDeliverySuppressionReason();
	const acpStats = params.getStats();
	if (params.outcome.kind === "ok") {
		logVerbose(`acp-dispatch: session=${params.sessionKey} outcome=ok latencyMs=${Date.now() - params.startedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: suppressionReason ?? "acp_dispatch" });
	} else {
		logVerbose(`acp-dispatch: session=${params.sessionKey} outcome=error code=${params.outcome.error.code} latencyMs=${Date.now() - params.startedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: `acp_error:${normalizeLowercaseStringOrEmpty(params.outcome.error.code)}` });
	}
	params.markIdle("message_completed");
	return {
		queuedFinal: params.queuedFinal,
		counts
	};
}
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
		sessionAuto: params.sessionTtsAuto,
		agentId: params.agentId,
		channelId: params.ttsChannel,
		accountId: params.ttsAccountId
	});
	const canAttemptFinalTts = ttsStatus != null && !(ttsStatus.autoMode === "inbound" && !params.inboundAudio);
	const shouldDeferVisibleTextForTts = params.shouldDeferVisibleTextForTts && ttsMode === "final" && hasAccumulatedBlockText && canAttemptFinalTts;
	const accumulatedVisibleBlockText = shouldDeferVisibleTextForTts ? cleanDeferredFinalText(accumulatedBlockTtsText) : params.delivery.getAccumulatedVisibleBlockText();
	if (!shouldDeferVisibleTextForTts) await params.delivery.settleVisibleText();
	if (params.abortSignal?.aborted) return false;
	let queuedFinal = params.delivery.hasPendingAnswerDelivery() || params.delivery.hasPendingFinalTtsMedia() || params.delivery.hasDeliveredVisibleText() && !params.delivery.hasFailedVisibleTextDelivery();
	if (ttsMode === "final" && hasAccumulatedBlockText && canAttemptFinalTts && !params.delivery.hasPendingFinalTtsMedia() && !params.delivery.hasDeliveredFinalTtsMedia()) try {
		const { maybeApplyTtsToPayload } = await loadDispatchAcpTtsRuntime();
		if (params.abortSignal?.aborted) return queuedFinal;
		const ttsSyntheticReply = await maybeApplyTtsToPayload({
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
			const finalTtsPayload = markReplyPayloadAsTtsSupplement(shouldDeferVisibleTextForTts ? {
				...ttsSyntheticReply,
				text: accumulatedVisibleBlockText || void 0,
				trustedLocalMedia: true
			} : {
				...ttsSyntheticReply,
				text: void 0,
				trustedLocalMedia: true
			}, accumulatedBlockTtsText, shouldDeferVisibleTextForTts ? void 0 : { visibleTextAlreadyDelivered: true });
			const delivered = await params.delivery.deliver("final", finalTtsPayload, { transcriptSource: { kind: "blocks" } });
			queuedFinal = queuedFinal || delivered;
		} else if (shouldDeferVisibleTextForTts && ttsSyntheticReply.text?.trim()) {
			const delivered = await params.delivery.deliver("final", { text: ttsSyntheticReply.text }, {
				skipTts: true,
				transcriptSource: { kind: "blocks" }
			});
			queuedFinal = queuedFinal || delivered;
		} else if (needsTtsFallback(true, accumulatedVisibleBlockText, ttsSyntheticReply.text)) {
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
		const { readAcpSessionEntry } = await loadDispatchAcpManagerRuntime();
		const currentMeta = readAcpSessionEntry({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		})?.acp;
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
async function tryDispatchAcpReplyCore(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey || params.bypassForCommand) return null;
	prepareChannelParticipantObservation(params.ctx);
	const { getAcpSessionManager, maybeUnbindStaleBoundConversations } = await loadDispatchAcpManagerRuntime();
	const acpManager = getAcpSessionManager();
	const acpResolution = acpManager.resolveSession({
		cfg: params.cfg,
		sessionKey,
		agentId: resolveSessionAgentId({
			config: params.cfg,
			sessionKey,
			fallbackAgentId: params.ctx.AgentId
		})
	});
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
	const progressSessionKeys = isDiagnosticsEnabled(params.cfg) ? Array.from(new Set([
		params.ctx.SessionKey,
		sessionKey,
		canonicalSessionKey
	].map((key) => normalizeOptionalString(key)).filter((key) => Boolean(key)))) : [];
	const markAcpProgress = progressSessionKeys.length > 0 ? () => {
		for (const key of progressSessionKeys) markDiagnosticSessionProgress({ sessionKey: key });
	} : void 0;
	const identityPendingBeforeTurn = isSessionIdentityPending(resolveSessionIdentityFromMeta(acpResolution.kind === "ready" ? acpResolution.meta : void 0));
	const shouldEmitResolvedIdentityNotice = !params.suppressUserDelivery && identityPendingBeforeTurn && (Boolean(params.ctx.MessageThreadId != null && (normalizeOptionalString(String(params.ctx.MessageThreadId)) ?? "")) || await hasBoundConversationForSession({
		cfg: params.cfg,
		sessionKey: canonicalSessionKey,
		channelRaw: params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider,
		accountIdRaw: params.ctx.AccountId
	}));
	const resolvedAcpAgent = acpResolution.kind === "ready" ? normalizeOptionalString(acpResolution.meta.agent) ?? normalizeOptionalString(params.cfg.acp?.defaultAgent) ?? resolveAgentIdFromSessionKey(canonicalSessionKey) : resolveAgentIdFromSessionKey(canonicalSessionKey);
	const normalizedDispatchChannel = normalizeOptionalLowercaseString(params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider);
	const explicitDispatchAccountId = normalizeOptionalString(params.ctx.AccountId);
	const dispatchChannels = params.cfg.channels;
	const defaultDispatchAccount = normalizedDispatchChannel == null ? void 0 : dispatchChannels?.[normalizedDispatchChannel]?.defaultAccount;
	const effectiveDispatchAccountId = explicitDispatchAccountId ?? normalizeOptionalString(defaultDispatchAccount);
	const shouldDeferVisibleTextForTts = shouldDeferFinalTtsText({
		cfg: params.cfg,
		ttsAuto: params.sessionTtsAuto,
		agentId: acpAgentId,
		channelId: params.ttsChannel,
		accountId: effectiveDispatchAccountId,
		inboundAudio: params.inboundAudio
	});
	let queuedFinal = false;
	const delivery = createAcpDispatchDeliveryCoordinator({
		cfg: params.cfg,
		agentId: acpAgentId,
		ctx: params.ctx,
		dispatcher: params.dispatcher,
		inboundAudio: params.inboundAudio,
		sessionKey: canonicalSessionKey,
		sessionTtsAuto: params.sessionTtsAuto,
		ttsChannel: params.ttsChannel,
		suppressUserDelivery: params.suppressUserDelivery,
		suppressBlockUserDelivery: shouldDeferVisibleTextForTts,
		suppressReplyLifecycle: params.suppressReplyLifecycle,
		shouldRouteToOriginating: params.shouldRouteToOriginating,
		originatingChannel: params.originatingChannel,
		originatingTo: params.originatingTo,
		originatingAccountId: params.originatingAccountId,
		originatingThreadId: params.originatingThreadId,
		originatingChatType: params.originatingChatType,
		onReplyStart: params.onReplyStart,
		abortSignal: params.abortSignal,
		runId: params.runId
	});
	const pendingAnswerText = resolveAcpPromptText(params.ctx);
	const inputRecorder = params.userTurnTranscriptRecorder;
	const assertInputCurrent = () => {
		params.abortSignal?.throwIfAborted();
		inputRecorder?.withPendingInput?.(() => {});
	};
	const persistInput = inputRecorder ? async () => {
		assertInputCurrent();
		await inputRecorder.persistApproved();
		assertInputCurrent();
		if (!inputRecorder.hasPersisted()) throw new Error("ACP input must be durably committed before dispatch.");
	} : void 0;
	try {
		if (pendingAnswerText && !params.images?.length && !params.extractedFileImages?.length && !hasInboundMediaForUnderstanding(params.ctx) && await claimPreparedPendingAgentQuestionAnswer({
			sessionKey: acpResolution.sessionKey,
			text: pendingAnswerText,
			sourceRecorder: inputRecorder,
			authority: {
				kind: "run",
				assertCurrent: assertInputCurrent
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
		const counts = params.dispatcher.getQueuedCounts();
		delivery.applyRoutedCounts(counts);
		return {
			queuedFinal: queuedNotice,
			counts
		};
	}
	const deliverDeferredTextFallback = async () => shouldDeferVisibleTextForTts ? await delivery.recoverBlockText() : false;
	const projector = createAcpReplyProjector({
		cfg: params.cfg,
		shouldSendToolSummaries: params.shouldSendToolSummaries,
		shouldSendToolSummariesNow: params.shouldSendToolSummariesNow,
		shouldSendFullToolDetails: params.shouldSendFullToolDetails,
		deliver: delivery.deliver,
		getConversationContext: () => params.ctx.agentText,
		onProgress: markAcpProgress,
		provider: params.ctx.Surface ?? params.ctx.Provider,
		accountId: effectiveDispatchAccountId
	});
	const acpDispatchStartedAt = Date.now();
	const finishAttempt = (options) => finishAcpDispatchAttempt({
		...options,
		dispatcher: params.dispatcher,
		delivery,
		getStats: () => acpManager.getObservabilitySnapshot(),
		sessionKey,
		startedAt: acpDispatchStartedAt,
		recordProcessed: params.recordProcessed,
		markIdle: params.markIdle
	});
	const requestId = resolveAcpRequestId(params.ctx);
	const existingRunId = normalizeOptionalString(params.runId);
	const auditOnly = existingRunId === void 0;
	let completionSource;
	const auditRunId = existingRunId ?? generateSecureUuid();
	const auditRuntime = await loadDispatchAcpAuditRuntime();
	const auditToolTracker = auditRuntime.createAcpToolLifecycleTracker();
	let auditStarted = false;
	let auditFinished = false;
	let auditTerminalOutcome;
	let auditStopReason;
	let auditResultStatus;
	let runtimeTurnWasCancelled = false;
	let assistantTranscript;
	let terminalOutcome;
	let auditEndFields;
	const resolveAuditEndFields = () => auditEndFields ??= auditRuntime.resolveAcpLifecycleEndFields(params.abortSignal, auditStopReason, auditResultStatus);
	const emitAuditStart = () => {
		if (auditStarted) return;
		auditStarted = true;
		const completionOwner = params.onAgentRunStart?.(auditRunId, void 0, {
			completionSource: "reply-dispatch",
			getResult: () => ({
				assistantTranscript,
				terminalOutcome
			})
		});
		completionSource = completionOwner === "reply-dispatch" ? completionOwner : void 0;
		auditRuntime.emitAcpLifecycleStart({
			runId: auditRunId,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			startedAt: Date.now(),
			auditOnly,
			completionSource
		});
	};
	const emitAuditEnd = () => {
		if (auditFinished) return;
		emitAuditStart();
		auditFinished = true;
		terminalOutcome = auditRuntime.emitAcpLifecycleEnd({
			runId: auditRunId,
			toolTracker: auditToolTracker,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			endFields: resolveAuditEndFields(),
			auditOnly,
			completionSource
		});
	};
	const emitAuditError = (error) => {
		if (auditFinished) return;
		emitAuditStart();
		auditFinished = true;
		terminalOutcome = auditRuntime.emitAcpLifecycleError({
			runId: auditRunId,
			toolTracker: auditToolTracker,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			...params.abortSignal ? { abortSignal: params.abortSignal } : {},
			...auditTerminalOutcome ? { terminalOutcome: auditTerminalOutcome } : {},
			auditOnly,
			completionSource,
			error
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
		if (isRestrictiveRuntimeToolsAllow(params.toolsAllow) || toolPolicyRestrictsTools(params.ctx.ConversationToolPolicy)) {
			auditTerminalOutcome = "blocked";
			throw new AcpRuntimeError("ACP_DISPATCH_DISABLED", "This session's bound runtime cannot enforce its permission or tool policy; use an embedded runtime for this restricted conversation.");
		}
		if (acpResolution.kind === "stale") {
			emitAuditError(acpResolution.error);
			await maybeUnbindStaleBoundConversations({
				targetSessionKey: canonicalSessionKey,
				error: acpResolution.error
			});
			return finishAttempt({
				queuedFinal: await delivery.deliver("final", {
					text: formatAcpRuntimeErrorText(acpResolution.error),
					isError: true
				}),
				outcome: {
					kind: "error",
					error: acpResolution.error
				}
			});
		}
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, resolvedAcpAgent);
		if (agentPolicyError) {
			auditTerminalOutcome = "blocked";
			throw agentPolicyError;
		}
		const resolvedTurnAttachments = await resolveAgentTurnAttachments({
			ctx: params.ctx,
			cfg: params.cfg,
			includeAttachmentIndexes: true
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
		const promptText = resolveAcpPromptText(params.ctx);
		const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
		const recentHistoryStart = resolvedTurnAttachments.attachments.length - resolvedTurnAttachments.recentHistoryImages.length;
		const mediaAttachmentEntries = resolvedTurnAttachments.attachments.flatMap((attachment, index) => {
			const sourceIndex = resolvedTurnAttachments.attachmentIndexes?.[index];
			return sourceIndex !== void 0 && !describedImageIndexes.has(sourceIndex) && (describedImageIndexes.size === 0 || index < recentHistoryStart) ? [{
				attachment,
				sourceIndex
			}] : [];
		});
		const mediaAttachments = mediaAttachmentEntries.map((entry) => entry.attachment);
		const recentHistoryImages = describedImageIndexes.size === 0 ? resolvedTurnAttachments.recentHistoryImages : [];
		const inlineAttachments = resolveInlineAgentImageAttachments(params.images);
		const extractedAttachments = resolveInlineAgentImageAttachments(extractedFileImages.map(stripExtractedFileImageMetadata));
		const useMediaAttachments = mediaAttachments.length > 0 && !(mediaAttachments.length === recentHistoryImages.length && (inlineAttachments.length > 0 || extractedAttachments.length > 0));
		const attachmentEntries = [];
		if (useMediaAttachments) appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: mediaAttachments,
			sourceIndexes: mediaAttachmentEntries.map((entry) => entry.sourceIndex)
		});
		else appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: inlineAttachments
		});
		appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: extractedAttachments,
			sourceIndexes: extractedFileImages.map((image) => image.attachmentIndex)
		});
		const attachments = resolveMergedAcpAttachments(attachmentEntries);
		const turnPromptText = useMediaAttachments ? appendRecentHistoryImageContext({
			promptText,
			images: recentHistoryImages
		}) : promptText;
		transcriptPromptText = turnPromptText;
		if (!turnPromptText && attachments.length === 0) {
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			params.recordProcessed("completed", { reason: "acp_empty_prompt" });
			params.markIdle("message_completed");
			return {
				queuedFinal: false,
				counts
			};
		}
		emitAuditStart();
		try {
			await delivery.startReplyLifecycle();
		} catch (error) {
			logVerbose(`dispatch-acp: start reply lifecycle failed: ${formatErrorMessage(error)}`);
		}
		const channelAdmission = consumeChannelRunAdmission(readChannelContextAdmissionEvidence(params.ctx));
		admittedRunContext = await prepareAgentRunAdmission({
			cfg: params.cfg,
			operationalRunInstance: createOperationalRunInstanceRef(requestId),
			facts: {
				runId: requestId,
				agentId: acpAgentId,
				ingress: {
					kind: "acp",
					boundary: "auto-reply.acp",
					state: channelAdmission.ingressState
				},
				...channelAdmission.facts
			},
			onAdmitted: channelAdmission.onAdmitted
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
		await assertPreparedConversationBindingRouteCurrent(params.ctx);
		assertInputCurrent();
		if (getAdmittedRunDelegatedAuthority(turnAdmission) === void 0) throw new Error("ACP turn admission ended before input dispatch.");
		turnDispatched = true;
		await acpManager.runTurn({
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
			onElicitation,
			onLifecycle: recordUnsupportedNativeActionEvidence,
			onEvent: async (event) => {
				auditRuntime.emitAcpRuntimeEvent({
					runId: auditRunId,
					toolTracker: auditToolTracker,
					sessionKey: canonicalSessionKey,
					agentId: acpAgentId,
					...params.abortSignal ? { abortSignal: params.abortSignal } : {},
					auditOnly,
					event
				});
				if (event.type === "done") {
					auditStopReason = event.stopReason;
					auditResultStatus = event.status;
					runtimeTurnWasCancelled = event.status === "cancelled";
				}
				await projector.onEvent(event);
			}
		});
		await projector.flush(true);
		await delivery.flushBlockText();
		if (!runtimeTurnWasCancelled && !params.abortSignal?.aborted) queuedFinal = await finalizeAcpTurnOutput({
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
		if (runtimeTurnWasCancelled || params.abortSignal?.aborted) {
			queuedFinal = await deliverDeferredTextFallback() || queuedFinal;
			await persistTranscript(await delivery.resolveAccumulatedDeliveredTranscriptText());
			queuedFinal = delivery.hasPendingAnswerDelivery() || delivery.hasPendingFinalTtsMedia() || delivery.hasDeliveredFinalReply() || queuedFinal;
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			params.recordProcessed("completed", { reason: "acp_aborted" });
			params.markIdle("message_aborted");
			emitAuditEnd();
			return {
				queuedFinal,
				counts
			};
		}
		await persistTranscript(delivery.getAccumulatedTranscriptText());
		const result = finishAttempt({
			queuedFinal,
			outcome: { kind: "ok" }
		});
		emitAuditEnd();
		return result;
	} catch (err) {
		const acpError = toAcpRuntimeError({
			error: err,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		emitAuditError(acpError);
		await projector.flush(true);
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
		return finishAttempt({
			queuedFinal,
			outcome: {
				kind: "error",
				error: acpError
			}
		});
	} finally {
		if (admittedRunContext) closeAdmittedRunDelegatedAuthority(admittedRunContext);
	}
}
//#endregion
export { tryDispatchAcpReplyCore };
