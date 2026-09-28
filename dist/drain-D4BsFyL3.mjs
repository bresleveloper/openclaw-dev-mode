import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as channelRouteDedupeKey, t as channelRouteCompactKey } from "./channel-route-Czo5mOSj.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation, j as waitForGatewayRestartFenceSettlement, l as isGatewayRestartDrainError, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as combineChannelAdmissionEvidence, r as compareChannelAdmissionParticipants } from "./admission-evidence-aqOMZf0e.mjs";
import { r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-BA7V9xf7.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import "./sessions-Cesa3L0p.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-Ce7FXvzS.mjs";
import { r as buildPersistedUserTurnMediaInputsFromFields } from "./user-turn-transcript.message-DpTCMkgY.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-D66nAouM.mjs";
import { S as removeQueuedItemsByRef, b as hasCrossChannelItems, c as trimSummaryElisionsToCap, f as retireFollowupRunCancellation, g as buildCollectPrompt, h as beginQueueDrain, l as admitFollowupRunLifecycle, n as FOLLOWUP_QUEUES, r as clearFollowupQueue, u as completeFollowupRunLifecycle, v as drainCollectQueueStep, w as waitForQueueDebounce, x as previewQueueSummaryPrompt, y as drainNextQueueItem } from "./state-B1aZH2hx.mjs";
import { t as isRoutableChannel } from "./route-reply-DGGXEu2K.mjs";
import { a as resolveReplyScreenToolTarget, i as resolveReplyOperatorAuthorityKey, o as resolveReplyThemeProfileId } from "./reply-tool-authority-_0-jZU7C.mjs";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/queue/collected-run.ts
function hasVerifiedAdmissionParticipant(run) {
	return compareChannelAdmissionParticipants([run.channelAdmissionEvidence]) === "same";
}
function resolveCollectedRun(items, source) {
	if (compareChannelAdmissionParticipants(items.map((item) => item.channelAdmissionEvidence)) === "same" || !items.every((item) => hasVerifiedAdmissionParticipant(item))) return source;
	return {
		...source,
		senderId: void 0,
		senderName: void 0,
		senderUsername: void 0,
		senderE164: void 0,
		senderIsOwner: false,
		traceAuthorized: false,
		ownerNumbers: []
	};
}
//#endregion
//#region src/auto-reply/reply/queue/delivery-context.ts
function hasPreparedCurrentTurnImages(run) {
	return run.currentTurnImagesPrepared === true;
}
const queuedAdmissionOwnerState = resolveGlobalSingleton(Symbol.for("openclaw.queuedAdmissionOwnerState"), () => ({
	keys: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
function hasExclusiveTurnAdmission(lifecycle) {
	return lifecycle?.admission === "exclusive";
}
function resolveTurnAdoptionLifecycleDeliveryKey(lifecycle) {
	if (!lifecycle) return "";
	const explicitOwnerKey = lifecycle.ownerKey ?? "";
	if (!hasExclusiveTurnAdmission(lifecycle)) return explicitOwnerKey;
	let admissionOwnerKey = queuedAdmissionOwnerState.keys.get(lifecycle);
	if (!admissionOwnerKey) {
		admissionOwnerKey = `admission:${queuedAdmissionOwnerState.nextId++}`;
		queuedAdmissionOwnerState.keys.set(lifecycle, admissionOwnerKey);
	}
	return JSON.stringify([explicitOwnerKey, admissionOwnerKey]);
}
function resolveFollowupAuthorizationKey(run) {
	const execution = run.run;
	return JSON.stringify([
		resolveReplyOperatorAuthorityKey(run.operatorAuthority),
		execution.senderId ?? "",
		JSON.stringify(execution.channelContext ?? null),
		stableStringify(execution.conversationToolPolicy ?? null),
		execution.senderE164 ?? "",
		execution.senderIsOwner === true,
		execution.execOverrides?.host ?? "",
		execution.execOverrides?.security ?? "",
		execution.execOverrides?.ask ?? "",
		execution.execOverrides?.node ?? "",
		execution.execOverrides?.nodeCwd ?? "",
		execution.bashElevated?.enabled === true,
		execution.bashElevated?.allowed === true,
		execution.bashElevated?.defaultLevel ?? "",
		execution.approvalReviewerDeviceId ?? ""
	]);
}
function resolveFollowupDeliveryContextKey(run) {
	const execution = run.run;
	const provenance = execution.inputProvenance;
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		hasPreparedCurrentTurnImages(run),
		Boolean(run.userTurnTranscriptRecorder?.getPendingInputMessage?.()),
		run.originatingChatId ?? "",
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? "",
		resolveFollowupAuthorizationKey(run),
		run.turnAdoptionLifecycle?.ownerKey ?? "",
		normalizeOptionalString(execution.runtimePolicySessionKey ?? execution.sessionKey) ?? "",
		execution.provider,
		execution.model,
		execution.messageProvider ?? "",
		JSON.stringify([...new Set(execution.clientCaps ?? [])].toSorted()),
		stableStringify(resolveReplyScreenToolTarget(run) ?? null),
		resolveReplyThemeProfileId(run) ?? "",
		stableStringify(execution.toolBindings ?? null),
		execution.chatType ?? "",
		execution.agentAccountId ?? "",
		execution.conversationRoutePeerId ?? "",
		execution.groupId ?? "",
		execution.groupChannel ?? "",
		execution.groupSpace ?? "",
		JSON.stringify([...new Set(execution.memberRoleIds ?? [])].toSorted()),
		execution.spawnedBy ?? "",
		execution.traceAuthorized === true,
		execution.traceLevelOverride ?? "",
		execution.thinkLevel ?? "",
		execution.thinkLevelOverride ?? "",
		execution.fastMode ?? "",
		execution.fastModeOverride === true,
		execution.fastModeAutoOnSecondsOverride === true,
		execution.fastModeAutoOnSeconds ?? "",
		execution.verboseLevel ?? "",
		execution.verboseLevelOverride ?? "",
		execution.reasoningLevel ?? "",
		execution.elevatedLevel ?? "",
		provenance?.kind ?? "",
		provenance?.originSessionId ?? "",
		provenance?.sourceSessionKey ?? "",
		provenance?.sourceChannel ?? "",
		provenance?.sourceTool ?? "",
		stableStringify(execution.trustedInternalHandoff ?? null),
		stableStringify(execution.scheduledToolPolicy ?? null),
		stableStringify(execution.runtimePluginToolGrant ?? null),
		stableStringify(run.toolsAllow ?? null),
		stableStringify(run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow) ?? null : null),
		run.disableTools === true,
		execution.extraSystemPrompt ?? "",
		execution.extraSystemPromptStatic ?? "",
		execution.sourceReplyDeliveryMode ?? "",
		execution.taskSuggestionDeliveryMode ?? "",
		execution.silentReplyPromptMode ?? "",
		execution.enforceFinalTag === true,
		execution.skipProviderRuntimeHints === true,
		execution.silentExpected === true,
		run.currentInboundEventKind ?? "",
		execution.terminalReplyExpectation ?? "",
		execution.suppressNextUserMessagePersistence === true,
		execution.suppressTranscriptOnlyAssistantPersistence === true,
		execution.blockReplyBreak,
		resolveTurnAdoptionLifecycleDeliveryKey(run.turnAdoptionLifecycle)
	]);
}
function resolveFollowupReplyAnchor(run) {
	if (run.originatingReplyToMode === "off") return;
	const replyToId = normalizeOptionalString(run.originatingReplyToId);
	if (replyToId || normalizeMessageChannel(run.originatingChannel) !== "slack") return replyToId;
	const threadId = run.originatingThreadId;
	return (typeof threadId === "number" ? Number.isFinite(threadId) : normalizeOptionalString(threadId) !== void 0) ? void 0 : normalizeOptionalString(run.messageId);
}
function hasCurrentTurnRuntimeMetadata(item) {
	return item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true || Boolean(item.currentInboundContext);
}
function collectCurrentInboundContext(items) {
	const contexts = items.flatMap((item, index) => item.currentInboundContext ? [{
		context: item.currentInboundContext,
		index
	}] : []);
	if (contexts.length === 0) return;
	if (contexts.length === 1) return contexts[0]?.context;
	const renderField = (field) => {
		const blocks = contexts.flatMap(({ context, index }) => {
			const value = context[field];
			return value ? [`Queued #${index + 1} context:\n${value}`] : [];
		});
		return blocks.length > 0 ? blocks.join("\n\n") : void 0;
	};
	const text = renderField("text");
	if (!text) return;
	const resumableText = renderField("resumableText");
	const injectedGoalContexts = [...new Set(contexts.flatMap(({ context }) => context.injectedGoalContexts ?? []))];
	return {
		text,
		...resumableText ? { resumableText } : {},
		fragments: contexts.flatMap(({ context }) => context.fragments ?? [{
			kind: "conversation-data",
			text: context.text
		}]),
		promptJoiner: "\n\n",
		...injectedGoalContexts.length > 0 ? { injectedGoalContexts } : {}
	};
}
function collectRuntimeMetadata(items, abortSignal) {
	const currentTurnSource = items.find(hasCurrentTurnRuntimeMetadata);
	const authoritySource = items.at(-1);
	const deliveryCorrelations = items.flatMap((item) => item.deliveryCorrelations ?? []);
	const explicitSkillSelections = [...new Map(items.flatMap((item) => item.explicitSkillSelections ?? []).map((selection) => [selection.path, selection])).values()];
	return {
		operatorAuthority: authoritySource?.operatorAuthority,
		...items.length > 0 && items.every((item) => item.personalBootstrapEligible === true) ? { personalBootstrapEligible: true } : {},
		currentInboundEventKind: currentTurnSource?.currentInboundEventKind,
		currentInboundAudio: currentTurnSource?.currentInboundAudio,
		currentInboundContext: collectCurrentInboundContext(items),
		explicitSkillSelections: explicitSkillSelections.length > 0 ? explicitSkillSelections : void 0,
		channelAdmissionEvidence: combineChannelAdmissionEvidence(items.map((item) => item.channelAdmissionEvidence)),
		toolsAllow: authoritySource?.toolsAllow,
		disableTools: authoritySource?.disableTools,
		abortSignal,
		queueAbortSignal: items.find((item) => item.queueAbortSignal)?.queueAbortSignal,
		deliveryCorrelations: deliveryCorrelations.length > 0 ? deliveryCorrelations : void 0,
		turnAdoptionLifecycle: items.length === 1 ? items[0]?.turnAdoptionLifecycle : void 0,
		replyOperationRunStates: items.flatMap((item) => item.replyOperationRunStates ?? []),
		queuedFollowupReplyDisposition: items.at(-1)?.queuedFollowupReplyDisposition
	};
}
function createOverflowSummaryRetrySource(source) {
	return {
		prompt: source.prompt,
		admissionSessionId: source.admissionSessionId,
		operatorAuthority: source.operatorAuthority,
		personalBootstrapEligible: source.personalBootstrapEligible,
		queueAbortSignal: source.queueAbortSignal,
		transcriptPrompt: source.transcriptPrompt,
		userTurnTranscriptRecorder: source.userTurnTranscriptRecorder,
		explicitSkillSelections: source.explicitSkillSelections,
		toolsAllow: source.toolsAllow,
		disableTools: source.disableTools,
		images: source.images,
		imageOrder: source.imageOrder,
		media: source.media,
		channelAdmissionEvidence: source.channelAdmissionEvidence,
		messageId: source.messageId,
		summaryLine: source.summaryLine,
		enqueuedAt: source.enqueuedAt,
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType,
		abortSignal: source.abortSignal,
		turnAdoptionLifecycle: source.turnAdoptionLifecycle,
		replyOperationRunStates: source.replyOperationRunStates,
		queuedFollowupReplyDisposition: source.queuedFollowupReplyDisposition,
		...source.currentInboundEventKind === "room_event" ? { currentInboundEventKind: "room_event" } : {},
		run: source.run
	};
}
//#endregion
//#region src/auto-reply/reply/queue/summary-consumption.ts
function consumeQueueSummaryDelivery(queue, delivery, completeLifecycles = true) {
	let consumedCount = delivery.sources.length === 0 ? delivery.droppedCount : 0;
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) {
			queue.summarySources.splice(sourceIndex, 1);
			queue.summaryLines.splice(sourceIndex, 1);
			consumedCount += 1;
		} else {
			const elisionIndex = queue.summaryElisions.findIndex((entry) => entry.sources.includes(source) || entry.sourceRefs.has(source));
			if (elisionIndex >= 0) {
				const entry = expectDefined(queue.summaryElisions[elisionIndex], "summary elisions entry at elision index");
				const elidedSourceIndex = entry.sources.indexOf(entry.sourceRefs.get(source) ?? source);
				if (elidedSourceIndex >= 0) {
					entry.sources.splice(elidedSourceIndex, 1);
					entry.summaryLines.splice(elidedSourceIndex, 1);
				}
				entry.count = entry.sources.length;
				consumedCount += 1;
				if (entry.sources.length === 0) queue.summaryElisions.splice(elisionIndex, 1);
			}
		}
		if (completeLifecycles) completeFollowupRunLifecycle(source);
	}
	queue.droppedCount = Math.max(0, queue.droppedCount - consumedCount);
}
//#endregion
//#region src/auto-reply/reply/queue/types.ts
var FollowupRunDeferredError = class extends Error {
	constructor(message = "Follow-up run deferred") {
		super(message);
		this.name = "FollowupRunDeferredError";
	}
};
function isFollowupRunDeferredError(error) {
	return error instanceof FollowupRunDeferredError;
}
function isFollowupRunAborted(run) {
	return run.abortSignal?.aborted === true || run.queueAbortSignal?.aborted === true || run.operatorAuthority?.signal?.aborted === true;
}
function resolveFollowupAbortSignal(run) {
	const signals = [
		run.abortSignal,
		run.queueAbortSignal,
		run.operatorAuthority?.signal
	].filter((signal) => signal !== void 0);
	return signals.length > 1 ? AbortSignal.any(signals) : signals[0];
}
//#endregion
//#region src/auto-reply/reply/queue/drain.ts
const FOLLOWUP_RUN_CALLBACKS = resolveGlobalMap(Symbol.for("openclaw.followupDrainCallbacks"));
let followedRestartDrainSignal;
function bindFollowupRestartDrainSignal() {
	const signal = getGatewayRestartDrainSignal();
	if (signal === followedRestartDrainSignal) return;
	followedRestartDrainSignal = signal;
	signal.addEventListener("abort", () => {
		for (const key of FOLLOWUP_RUN_CALLBACKS.keys()) clearFollowupQueue(key);
		FOLLOWUP_RUN_CALLBACKS.clear();
	}, { once: true });
}
function assertSingleAdmissionOwner(items) {
	if (new Set(items.flatMap((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle) ? [item.turnAdoptionLifecycle] : [])).size > 1) throw new Error("followup queue cannot aggregate distinct admission lifecycles");
}
function rememberFollowupDrainCallback(key, runFollowup) {
	bindFollowupRestartDrainSignal();
	FOLLOWUP_RUN_CALLBACKS.set(key, runFollowup);
}
function clearFollowupDrainCallback(key) {
	FOLLOWUP_RUN_CALLBACKS.delete(key);
}
/** Restart the drain for `key` if it is currently idle, using the stored callback. */
function kickFollowupDrainIfIdle(key) {
	const cb = FOLLOWUP_RUN_CALLBACKS.get(key);
	if (!cb) return;
	scheduleFollowupDrain(key, cb);
}
/** Capture one exact active drain generation for post-recovery retirement. */
function prepareStaleFollowupDrainRetirement(key) {
	const queue = FOLLOWUP_QUEUES.get(key);
	if (!queue?.draining) return;
	const drainOwner = queue.drainOwner;
	if (!drainOwner) return;
	const activeSources = new Set(queue.inFlight);
	if (activeSources.size === 0) return;
	return () => {
		if (FOLLOWUP_QUEUES.get(key) !== queue || !queue.draining || queue.drainOwner !== drainOwner || activeSources.size !== queue.inFlight.size || ![...activeSources].every((source) => queue.inFlight.has(source))) return;
		removeQueuedItemsByRef(queue.items, [...activeSources]);
		const activeSummarySources = [...activeSources].filter((source) => queue.activeSummarySources.has(source));
		consumeQueueSummaryDelivery(queue, {
			droppedCount: activeSummarySources.length,
			sources: activeSummarySources
		}, false);
		const replacement = {
			...queue,
			abortController: new AbortController(),
			items: [...queue.items],
			draining: false,
			drainOwner: void 0,
			inFlight: /* @__PURE__ */ new Set(),
			summaryLines: [...queue.summaryLines],
			summarySources: [...queue.summarySources],
			activeSummarySources: /* @__PURE__ */ new WeakSet(),
			summaryElisions: queue.summaryElisions.map((entry) => ({
				...entry,
				sources: [...entry.sources],
				summaryLines: [...entry.summaryLines],
				sourceRefs: /* @__PURE__ */ new WeakMap()
			}))
		};
		for (const source of [
			...replacement.items,
			...replacement.summarySources,
			...replacement.summaryElisions.flatMap((entry) => entry.sources)
		]) source.queueAbortSignal = replacement.abortController.signal;
		const hasPendingWork = replacement.items.length > 0 || replacement.droppedCount > 0;
		if (hasPendingWork) FOLLOWUP_QUEUES.set(key, replacement);
		else {
			FOLLOWUP_QUEUES.delete(key);
			clearFollowupDrainCallback(key);
		}
		queue.items.length = 0;
		queue.droppedCount = 0;
		queue.summaryLines = [];
		queue.summarySources = [];
		queue.summaryElisions = [];
		queue.evictedSummaryCount = 0;
		queue.abortController.abort();
		for (const source of activeSources) completeFollowupRunLifecycle(source);
		if (hasPendingWork) kickFollowupDrainIfIdle(key);
	};
}
function resolveOriginRoutingMetadata(items) {
	const source = items.find((item) => item.originatingChannel && item.originatingTo) ?? items.find((item) => item.originatingChannel || item.originatingTo || item.originatingAccountId || item.originatingThreadId != null || item.originatingChatId || item.originatingReplyToId || item.originatingReplyToMode || item.originatingChatType);
	if (!source) return {};
	return {
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType
	};
}
function splitCollectItemsByDeliveryContext(items) {
	if (items.length <= 1) return items.length === 0 ? [] : [items];
	const groups = [];
	let currentGroup = [];
	let currentKey;
	for (const item of items) {
		const itemKey = resolveFollowupDeliveryContextKey(item);
		if (currentGroup.length === 0 || itemKey === currentKey) {
			currentGroup.push(item);
			currentKey = itemKey;
			continue;
		}
		groups.push(currentGroup);
		currentGroup = [item];
		currentKey = itemKey;
	}
	if (currentGroup.length > 0) groups.push(currentGroup);
	return groups;
}
function renderCollectItem(item, idx) {
	return renderCollectItemPrompt(item, idx, resolveCollectedSourceText(item.userTurnTranscriptRecorder?.getPendingInputMessage?.(), item.prompt));
}
function resolveCollectedSourceText(message, fallback) {
	return message ? extractTextFromChatContent(message.content, {
		normalizeText: (text) => text,
		joinWith: "\n"
	}) ?? "" : fallback;
}
function buildCollectItemPrefix(item, idx) {
	const senderLabel = item.run.senderName ?? item.run.senderUsername ?? item.run.senderId ?? item.run.senderE164;
	const senderSuffix = senderLabel ? ` (from ${senderLabel})` : "";
	return `---\nQueued #${idx + 1}${senderSuffix}\n`;
}
function renderCollectItemPrompt(item, idx, prompt) {
	return `${buildCollectItemPrefix(item, idx)}${prompt}`.trim();
}
function collectQueuedPromptMedia(items) {
	const images = [];
	const imageOrder = [];
	const media = [];
	const mediaImageSlots = [];
	const suppressedFactIndexes = [];
	const currentTurnImagesPrepared = items.every(hasPreparedCurrentTurnImages);
	for (const item of items) {
		const mediaOffset = media.length;
		const internalItem = item;
		if (item.images) images.push(...item.images);
		if (item.imageOrder) imageOrder.push(...item.imageOrder);
		if (currentTurnImagesPrepared) {
			const itemSlots = internalItem.mediaImageLayout?.slots ?? item.imageOrder?.map((kind) => ({ kind })) ?? [];
			mediaImageSlots.push(...itemSlots.map((slot) => slot.factIndex === void 0 ? { kind: slot.kind } : {
				kind: slot.kind,
				factIndex: slot.factIndex + mediaOffset
			}));
			suppressedFactIndexes.push(...(internalItem.mediaImageLayout?.suppressedFactIndexes ?? []).map((factIndex) => factIndex + mediaOffset));
		}
		if (item.media) media.push(...item.media);
	}
	const mediaImageLayout = mediaImageSlots.length > 0 || suppressedFactIndexes.length > 0 ? {
		slots: mediaImageSlots,
		suppressedFactIndexes
	} : void 0;
	return {
		...currentTurnImagesPrepared ? { currentTurnImagesPrepared: true } : {},
		...currentTurnImagesPrepared || images.length > 0 ? { images } : {},
		...currentTurnImagesPrepared || imageOrder.length > 0 ? { imageOrder } : {},
		...mediaImageLayout ? { mediaImageLayout } : {},
		...media.length > 0 ? { media } : {}
	};
}
function hasRuntimeOnlyFollowupMetadata(item) {
	return item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true;
}
function buildCollectTranscriptInput(items, messages) {
	const title = "[Queued messages while agent was busy]";
	const mentions = [];
	let offset = 38;
	return {
		text: buildCollectPrompt({
			title,
			items,
			renderItem: (item, index) => {
				const message = messages?.[index] ?? item.userTurnTranscriptRecorder?.message;
				const sourceText = resolveCollectedSourceText(message, item.transcriptPrompt ?? item.prompt);
				const block = renderCollectItemPrompt(item, index, sourceText);
				const sourceOffset = offset + 2 + buildCollectItemPrefix(item, index).length;
				const sourceEnd = sourceText.trimEnd().length;
				for (const mention of message?.["__openclaw"]?.humanMentions ?? []) if (mention.end <= sourceEnd) mentions.push({
					...mention,
					start: sourceOffset + mention.start,
					end: sourceOffset + mention.end
				});
				offset += 2 + block.length;
				return block;
			}
		}),
		mentions
	};
}
function resolveFollowupTranscriptTarget(source) {
	const sessionKey = normalizeOptionalString(source.run.sessionKey) ?? source.run.sessionId;
	const storePath = resolveSessionStorePathCore(source.run.config.session?.store, { agentId: source.run.agentId });
	const sessionEntry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		clone: false
	});
	return {
		sessionId: sessionEntry?.sessionId ?? source.run.sessionId,
		sessionKey,
		sessionEntry,
		storePath,
		agentId: source.run.agentId,
		cwd: source.run.cwd ?? source.run.workspaceDir,
		config: source.run.config
	};
}
function createCollectUserTurnTranscriptRecorder(items) {
	const transcriptSources = items.filter((item) => item.userTurnTranscriptRecorder);
	const source = transcriptSources.at(-1);
	if (!source) return;
	const buildInput = async () => {
		const messages = await Promise.all(transcriptSources.map(async (item) => await item.userTurnTranscriptRecorder?.resolveMessage()));
		const media = messages.flatMap((message) => buildPersistedUserTurnMediaInputsFromFields(message));
		const timestamp = messages.reduce((latest, message) => {
			const candidate = message?.timestamp;
			return typeof candidate === "number" && (latest === void 0 || candidate > latest) ? candidate : latest;
		}, void 0);
		const transcriptInput = buildCollectTranscriptInput(transcriptSources, messages);
		const identityHash = createHash("sha256").update(JSON.stringify(transcriptSources.map((item) => [
			item.messageId ?? "",
			item.enqueuedAt,
			item.transcriptPrompt
		]))).digest("hex");
		return {
			...transcriptInput,
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance,
			idempotencyKey: `followup-collect:${source.run.sessionId}:${identityHash}`,
			...timestamp === void 0 ? {} : { timestamp },
			...media.length === 0 ? {} : { media }
		};
	};
	const initialTranscriptInput = buildCollectTranscriptInput(transcriptSources);
	return createUserTurnTranscriptRecorder({
		input: {
			...initialTranscriptInput,
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance
		},
		resolveInput: buildInput,
		pendingInputSources: transcriptSources.flatMap((item) => item.userTurnTranscriptRecorder ?? []),
		target: () => resolveFollowupTranscriptTarget(source),
		errorContext: "collected followup user turn transcript",
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
	});
}
function resolveAggregateOwner(items) {
	return items.findLast((item) => item.abortSignal) ?? items.findLast((item) => item.turnAdoptionLifecycle) ?? items.at(-1);
}
function requiresIndividualCollectDrain(item) {
	return item.userTurnTranscriptRecorder?.hasPersisted() === true || item.disableCollectBatching === true || item.run.skillWorkshopProposalRevision !== void 0 || item.run.skillLibraryAuthoring !== void 0 || hasRuntimeOnlyFollowupMetadata(item);
}
function createAggregateCancellation(items) {
	const owner = resolveAggregateOwner(items);
	const sourceSignals = /* @__PURE__ */ new Map();
	for (const item of items) {
		if (!item.abortSignal) continue;
		const owners = sourceSignals.get(item.abortSignal) ?? /* @__PURE__ */ new Set();
		owners.add(item);
		sourceSignals.set(item.abortSignal, owners);
	}
	const signals = new Set(sourceSignals.keys());
	if (signals.size === 0) return {
		signal: void 0,
		admit: () => void 0,
		dispose: () => void 0
	};
	const onlySignal = signals.size === 1 ? signals.values().next().value : void 0;
	const onlySignalOwned = onlySignal && owner ? sourceSignals.get(onlySignal)?.has(owner) === true : false;
	if (onlySignal && onlySignalOwned) return {
		signal: onlySignal,
		admit: () => void 0,
		dispose: () => void 0
	};
	const controller = new AbortController();
	const listeners = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const abort = () => controller.abort();
		listeners.set(signal, abort);
		if (signal.aborted) abort();
		else signal.addEventListener("abort", abort, { once: true });
	}
	const disposeSignal = (signal) => {
		const listener = listeners.get(signal);
		if (!listener) return;
		signal.removeEventListener("abort", listener);
		listeners.delete(signal);
	};
	return {
		signal: controller.signal,
		admit: () => {
			for (const [signal, sourceOwners] of sourceSignals) if (!owner || !sourceOwners.has(owner)) disposeSignal(signal);
		},
		dispose: () => {
			for (const signal of listeners.keys()) disposeSignal(signal);
		}
	};
}
function resolveQueuedCronCreatorAuthorityUnavailable(items) {
	return items.some((item) => item.turnAdoptionLifecycle?.cronCreatorAuthorityUnavailable === "queued-local-operator") ? "queued-local-operator" : void 0;
}
function resolveQueueSummaryLines(queue, sources) {
	return sources.map((source) => {
		const sourceIndex = queue.summarySources.indexOf(source);
		return expectDefined(queue.summaryLines[sourceIndex], "summary line for retained source");
	});
}
function createQueueSummaryDelivery(params) {
	const sources = params.sources ? [...params.sources] : [...params.queue.summarySources];
	if (params.sources && !sources.every((source, index) => params.queue.summarySources[index] === source)) return;
	const droppedCount = params.sources ? sources.length : params.queue.droppedCount;
	const summaryLines = params.sources ? resolveQueueSummaryLines(params.queue, sources) : [...params.queue.summaryLines];
	const prompt = previewQueueSummaryPrompt({
		state: {
			droppedCount,
			summaryLines
		},
		noun: "message"
	});
	if (!prompt) return;
	return {
		prompt,
		droppedCount,
		sources
	};
}
function releaseQueueSummaryDeliveryForRetry(queue, delivery) {
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) queue.summarySources[sourceIndex] = createOverflowSummaryRetrySource(source);
		if (!source.turnAdoptionLifecycle) completeFollowupRunLifecycle(source);
	}
}
async function runQueueSummaryDelivery(queue, delivery, run, protectedSources = delivery.sources) {
	assertSingleAdmissionOwner(protectedSources);
	const inheritedActiveSources = new Set(protectedSources.filter((source) => queue.activeSummarySources.has(source)));
	for (const source of protectedSources) {
		queue.activeSummarySources.add(source);
		queue.inFlight.add(source);
	}
	let admitted = false;
	let deferredBeforeAdmission = false;
	const cancellation = createAggregateCancellation(protectedSources);
	const onAdmitted = protectedSources.length > 1 || protectedSources.some((source) => hasExclusiveTurnAdmission(source.turnAdoptionLifecycle)) ? async () => {
		if (admitted) return;
		await Promise.all(protectedSources.map((source) => admitFollowupRunLifecycle(source)));
		cancellation.admit();
		admitted = true;
		consumeQueueSummaryDelivery(queue, {
			...delivery,
			sources: protectedSources
		}, false);
		const aggregateOwner = resolveAggregateOwner(protectedSources);
		for (const source of protectedSources) if (source !== aggregateOwner) retireFollowupRunCancellation(source);
	} : void 0;
	try {
		try {
			await run({
				abortSignal: cancellation.signal,
				onAdmitted
			});
		} catch (err) {
			if (!admitted) {
				deferredBeforeAdmission = isFollowupRunDeferredError(err);
				if (!deferredBeforeAdmission) releaseQueueSummaryDeliveryForRetry(queue, delivery);
			} else for (const source of protectedSources) completeFollowupRunLifecycle(source);
			throw err;
		}
		if (!admitted) {
			const canceledSources = protectedSources.filter(isFollowupRunAborted);
			if (canceledSources.length > 0) {
				consumeQueueSummaryDelivery(queue, {
					...delivery,
					sources: canceledSources
				});
				return false;
			}
		}
		if (!admitted) consumeQueueSummaryDelivery(queue, delivery);
		return true;
	} finally {
		cancellation.dispose();
		const deferredCarryover = deferredBeforeAdmission && inheritedActiveSources.size === 0 ? new Set(protectedSources) : inheritedActiveSources;
		for (const source of protectedSources) {
			queue.inFlight.delete(source);
			if (deferredBeforeAdmission && deferredCarryover.has(source)) continue;
			queue.activeSummarySources.delete(source);
			for (const entry of queue.summaryElisions) {
				const compactSource = entry.sourceRefs.get(source);
				if (compactSource) queue.activeSummarySources.delete(compactSource);
			}
		}
		trimSummaryElisionsToCap(queue);
	}
}
async function dropAbortedFollowups(queue, runFollowup) {
	const canDrop = (run) => run.steerPending?.phase !== "injecting" && isFollowupRunAborted(run) && !queue.inFlight.has(run) && !queue.activeSummarySources.has(run);
	const pending = queue.items.filter(canDrop);
	const summaries = [...queue.summarySources, ...queue.summaryElisions.flatMap((entry) => entry.sources)].filter(canDrop);
	removeQueuedItemsByRef(queue.items, pending);
	consumeQueueSummaryDelivery(queue, {
		sources: summaries,
		droppedCount: summaries.length
	}, false);
	for (const item of [...pending, ...summaries]) try {
		completeFollowupRunLifecycle(item);
	} catch (error) {
		defaultRuntime.error?.(`followup queue cancellation settlement failed: ${String(error)}`);
	}
	await Promise.all(pending.map(async (item) => {
		try {
			await runFollowup(item);
		} catch (error) {
			defaultRuntime.error?.(`followup queue cancellation cleanup failed: ${String(error)}`);
		}
	}));
	return pending.length + summaries.length;
}
function resolveCrossChannelKey(item) {
	const { originatingChannel: channel, originatingTo: to, originatingAccountId: accountId } = item;
	const threadId = item.originatingThreadId;
	const replyToId = resolveFollowupReplyAnchor(item);
	const chatType = normalizeChatType(item.originatingChatType);
	if (!channel && !to && !accountId && (threadId == null || threadId === "") && !item.originatingChatId && !replyToId) return chatType ? { key: JSON.stringify(["unresolved", chatType]) } : {};
	if (!isRoutableChannel(channel) || !to) return { key: JSON.stringify([
		"local",
		channel ?? "",
		to ?? "",
		accountId ?? "",
		threadId ?? "",
		item.originatingChatId ?? "",
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) };
	const key = channelRouteCompactKey({
		channel,
		to,
		accountId,
		threadId
	});
	return key ? { key: JSON.stringify([
		key,
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) } : { cross: true };
}
function resolveOverflowSummarySourceGroup(queue) {
	const source = queue.summarySources[0];
	if (!source) return [];
	const contextKey = resolveFollowupDeliveryContextKey(source);
	const sources = [];
	for (const candidate of queue.summarySources) {
		if (resolveFollowupDeliveryContextKey(candidate) !== contextKey) break;
		sources.push(candidate);
	}
	return sources;
}
async function drainProtectedPriorityFollowup(queue, runFollowup) {
	const priority = queue.items.find((item) => item.protectFromQueueOverflow === true);
	if (!priority) return false;
	queue.inFlight.add(priority);
	try {
		await runFollowup(priority);
		removeQueuedItemsByRef(queue.items, [priority]);
	} finally {
		queue.inFlight.delete(priority);
	}
	return true;
}
function resolveOverflowSummaryInboundEventKind(sources) {
	return sources.length > 0 && sources.every((source) => source.currentInboundEventKind === "room_event") ? "room_event" : void 0;
}
async function runSyntheticOverflowSummary(params) {
	const promptHash = createHash("sha256").update(params.prompt).digest("hex");
	const routeHash = createHash("sha256").update(JSON.stringify([
		channelRouteDedupeKey({
			channel: params.source.originatingChannel,
			to: params.source.originatingTo,
			accountId: params.source.originatingAccountId,
			threadId: params.source.originatingThreadId
		}),
		resolveFollowupReplyAnchor(params.source) ?? "",
		params.source.originatingReplyToMode ?? "",
		normalizeChatType(params.source.originatingChatType) ?? ""
	])).digest("hex");
	const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
		input: {
			text: params.prompt,
			idempotencyKey: `followup-overflow:${params.source.run.sessionId}:${routeHash}:${params.source.messageId ?? params.source.enqueuedAt}:${promptHash}`,
			senderIsOwner: params.source.run.senderIsOwner,
			provenance: params.source.run.inputProvenance
		},
		target: () => resolveFollowupTranscriptTarget(params.source),
		pendingInputSources: params.sources.flatMap((source) => source.userTurnTranscriptRecorder ?? []),
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "followup overflow summary transcript"
	});
	const currentInboundEventKind = resolveOverflowSummaryInboundEventKind(params.sources);
	const runtimeMetadata = collectRuntimeMetadata(params.sources);
	let admitted = false;
	await params.runFollowup({
		prompt: params.prompt,
		queueAbortSignal: params.source.queueAbortSignal,
		transcriptPrompt: params.prompt,
		messageId: params.source.messageId,
		userTurnTranscriptRecorder,
		run: resolveCollectedRun(params.sources, params.source.run),
		enqueuedAt: Date.now(),
		abortSignal: params.abortSignal,
		explicitSkillSelections: runtimeMetadata.explicitSkillSelections,
		channelAdmissionEvidence: runtimeMetadata.channelAdmissionEvidence,
		operatorAuthority: runtimeMetadata.operatorAuthority,
		personalBootstrapEligible: runtimeMetadata.personalBootstrapEligible,
		toolsAllow: runtimeMetadata.toolsAllow,
		disableTools: runtimeMetadata.disableTools,
		queuedFollowupReplyDisposition: runtimeMetadata.queuedFollowupReplyDisposition,
		replyOperationRunStates: runtimeMetadata.replyOperationRunStates,
		...params.onAdmitted ? { turnAdoptionLifecycle: {
			admission: "cancel-only",
			...resolveQueuedCronCreatorAuthorityUnavailable(params.sources) ? { cronCreatorAuthorityUnavailable: "queued-local-operator" } : {},
			onAdopted: async () => {
				await params.onAdmitted?.();
				admitted = true;
			},
			onSettled: () => {
				if (admitted) for (const source of params.sources) completeFollowupRunLifecycle(source);
			}
		} } : {},
		...resolveOriginRoutingMetadata([params.source]),
		...currentInboundEventKind ? { currentInboundEventKind } : {}
	});
}
async function drainElidedOverflowSummary(params) {
	const entry = params.queue.summaryElisions[0];
	if (!entry) return false;
	const retainedSources = params.queue.summaryElisions.length === 1 ? resolveOverflowSummarySourceGroup(params.queue).filter((source) => resolveFollowupDeliveryContextKey(source) === entry.contextKey) : [];
	const source = retainedSources.at(-1) ?? entry.sources.at(-1);
	if (!source) return false;
	const elidedCount = entry.sources.length;
	const elidedSources = [...entry.sources];
	const droppedCount = elidedCount + retainedSources.length;
	const retainedSummaryLines = resolveQueueSummaryLines(params.queue, retainedSources);
	const summaryLines = [...entry.summaryLines, ...retainedSummaryLines].slice(-params.queue.cap);
	const prompt = previewQueueSummaryPrompt({
		state: {
			droppedCount,
			summaryLines
		},
		noun: "message"
	});
	if (!prompt) return false;
	if (!await runQueueSummaryDelivery(params.queue, {
		prompt,
		droppedCount: retainedSources.length,
		sources: retainedSources
	}, async ({ abortSignal, onAdmitted }) => {
		await runSyntheticOverflowSummary({
			source,
			sources: [...elidedSources, ...retainedSources],
			prompt,
			abortSignal,
			onAdmitted,
			runFollowup: params.runFollowup
		});
	}, [...elidedSources, ...retainedSources])) return true;
	const entryIndex = params.queue.summaryElisions.indexOf(entry);
	if (entryIndex < 0) return true;
	const consumedCount = Math.min(elidedCount, entry.sources.length);
	const consumedSources = entry.sources.splice(0, consumedCount);
	entry.summaryLines.splice(0, consumedCount);
	entry.count = entry.sources.length;
	for (const consumedSource of consumedSources) completeFollowupRunLifecycle(consumedSource);
	params.queue.droppedCount = Math.max(0, params.queue.droppedCount - consumedCount);
	if (entry.sources.length === 0) params.queue.summaryElisions.splice(entryIndex, 1);
	return true;
}
async function drainOverflowSummaryGroup(params) {
	if (await dropAbortedFollowups(params.queue, params.runFollowup) > 0 && params.queue.droppedCount === 0) return true;
	if (params.queue.evictedSummaryCount > 0) {
		const evictedCount = params.queue.evictedSummaryCount;
		params.queue.evictedSummaryCount = 0;
		params.queue.droppedCount = Math.max(0, params.queue.droppedCount - evictedCount);
		defaultRuntime.error?.(`followup queue omitted ${evictedCount} route-isolated overflow summar${evictedCount === 1 ? "y" : "ies"} after reaching the summary context cap`);
		return true;
	}
	if (await drainElidedOverflowSummary(params)) return true;
	const sources = resolveOverflowSummarySourceGroup(params.queue);
	const source = sources.at(-1);
	if (!source) return false;
	const delivery = createQueueSummaryDelivery({
		queue: params.queue,
		sources
	});
	if (!delivery) return false;
	await runQueueSummaryDelivery(params.queue, delivery, async ({ abortSignal, onAdmitted }) => {
		await runSyntheticOverflowSummary({
			source,
			sources: delivery.sources,
			prompt: delivery.prompt,
			abortSignal,
			onAdmitted,
			runFollowup: params.runFollowup
		});
	});
	return true;
}
function scheduleFollowupDrain(key, runFollowup) {
	if (FOLLOWUP_QUEUES.get(key)?.draining) {
		rememberFollowupDrainCallback(key, runFollowup);
		return;
	}
	const queue = beginQueueDrain(FOLLOWUP_QUEUES, key);
	if (!queue) return;
	const drainOwner = {};
	queue.drainOwner = drainOwner;
	const effectiveRunFollowup = FOLLOWUP_RUN_CALLBACKS.get(key) ?? runFollowup;
	const reserveOptions = {
		inFlight: queue.inFlight,
		shouldRestoreOnError: () => FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted,
		onDiscard: (item) => completeFollowupRunLifecycle(item)
	};
	rememberFollowupDrainCallback(key, effectiveRunFollowup);
	const drainQueuedFollowups = async () => {
		let retryDeferred = false;
		let waitingForSteer = false;
		try {
			const collectState = { forceIndividualCollect: false };
			while (queue.items.length > 0 || queue.droppedCount > 0) {
				await dropAbortedFollowups(queue, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				await waitForQueueDebounce(queue, queue.abortController.signal);
				await dropAbortedFollowups(queue, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				if (await drainProtectedPriorityFollowup(queue, effectiveRunFollowup)) continue;
				if (queue.droppedCount > 0 && queue.items.some((item) => item.steerAnchor)) {
					if (!await drainNextQueueItem(queue.items, effectiveRunFollowup, reserveOptions)) break;
					continue;
				}
				if (queue.droppedCount > 0 && await drainOverflowSummaryGroup({
					queue,
					runFollowup: effectiveRunFollowup
				})) continue;
				if (queue.mode === "collect") {
					const isCrossChannel = hasCrossChannelItems(queue.items, resolveCrossChannelKey) || queue.items.some(requiresIndividualCollectDrain);
					if (collectState.forceIndividualCollect && !isCrossChannel && queue.items.length > 1) collectState.forceIndividualCollect = false;
					const collectDrainResult = await drainCollectQueueStep({
						collectState,
						isCrossChannel,
						items: queue.items,
						run: effectiveRunFollowup,
						reserveOptions
					});
					if (collectDrainResult === "empty") break;
					if (collectDrainResult === "drained") continue;
					const contextGroups = splitCollectItemsByDeliveryContext(queue.items.slice());
					if (contextGroups.length === 0) break;
					for (const groupItems of contextGroups) {
						const currentGroupItems = groupItems.filter((item) => queue.items.includes(item));
						const abortedGroupItems = currentGroupItems.filter(isFollowupRunAborted);
						if (abortedGroupItems.length > 0) {
							removeQueuedItemsByRef(queue.items, abortedGroupItems);
							for (const item of abortedGroupItems) completeFollowupRunLifecycle(item);
						}
						const activeGroupItems = currentGroupItems.filter((item) => !isFollowupRunAborted(item));
						if (activeGroupItems.length === 0) continue;
						assertSingleAdmissionOwner(activeGroupItems);
						const groupSource = activeGroupItems.at(-1);
						const run = groupSource ? resolveCollectedRun(activeGroupItems, groupSource.run) : queue.lastRun;
						if (!run) break;
						const routing = resolveOriginRoutingMetadata(activeGroupItems);
						const prompt = buildCollectPrompt({
							title: "[Queued messages while agent was busy]",
							items: activeGroupItems,
							renderItem: renderCollectItem
						});
						const transcriptPrompt = buildCollectTranscriptInput(activeGroupItems).text;
						const userTurnTranscriptRecorder = createCollectUserTurnTranscriptRecorder(activeGroupItems);
						const aggregateOwner = resolveAggregateOwner(activeGroupItems);
						const cancellation = createAggregateCancellation(activeGroupItems);
						let admitted = false;
						const restoreGroupItems = (groupItemsToRestore) => {
							const missingItems = groupItemsToRestore.filter((item) => !queue.items.includes(item));
							queue.items.unshift(...missingItems);
						};
						const needsGroupAdmission = activeGroupItems.length > 1 || activeGroupItems.some((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle));
						const consumeAdmittedGroup = () => {
							cancellation.admit();
							admitted = true;
							removeQueuedItemsByRef(queue.items, activeGroupItems);
							for (const item of activeGroupItems) if (item !== aggregateOwner) retireFollowupRunCancellation(item);
						};
						const admitGroupSources = async () => {
							await Promise.all(activeGroupItems.map((item) => admitFollowupRunLifecycle(item)));
							consumeAdmittedGroup();
						};
						const completeGroup = () => {
							removeQueuedItemsByRef(queue.items, activeGroupItems);
							for (const item of activeGroupItems) completeFollowupRunLifecycle(item);
						};
						const drainGroup = async () => {
							await effectiveRunFollowup({
								prompt,
								transcriptPrompt,
								...userTurnTranscriptRecorder ? { userTurnTranscriptRecorder } : {},
								run,
								messageId: groupSource?.messageId ?? (groupSource ? resolveFollowupReplyAnchor(groupSource) : void 0),
								enqueuedAt: Date.now(),
								...routing,
								...collectRuntimeMetadata(activeGroupItems, cancellation.signal),
								...needsGroupAdmission ? { turnAdoptionLifecycle: {
									admission: "cancel-only",
									...resolveQueuedCronCreatorAuthorityUnavailable(activeGroupItems) ? { cronCreatorAuthorityUnavailable: "queued-local-operator" } : {},
									onAdopted: admitGroupSources,
									onSettled: () => {
										if (admitted) completeGroup();
									}
								} } : {},
								...collectQueuedPromptMedia(activeGroupItems)
							});
						};
						try {
							for (const item of activeGroupItems) queue.inFlight.add(item);
							await drainGroup();
						} catch (err) {
							if (admitted) completeGroup();
							else if (FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted) restoreGroupItems(activeGroupItems);
							else for (const item of activeGroupItems) completeFollowupRunLifecycle(item);
							throw err;
						} finally {
							for (const item of activeGroupItems) queue.inFlight.delete(item);
							cancellation.dispose();
						}
						if (!admitted) {
							const canceledSources = activeGroupItems.filter(isFollowupRunAborted);
							if (canceledSources.length > 0) {
								removeQueuedItemsByRef(queue.items, canceledSources);
								for (const item of canceledSources) completeFollowupRunLifecycle(item);
								const survivors = activeGroupItems.filter((item) => !canceledSources.includes(item));
								if (FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted) {
									restoreGroupItems(survivors);
									if (survivors.length > 0) break;
								} else for (const item of survivors) completeFollowupRunLifecycle(item);
								continue;
							}
						}
						completeGroup();
					}
					continue;
				}
				if (!await drainNextQueueItem(queue.items, effectiveRunFollowup, reserveOptions)) break;
			}
		} catch (err) {
			queue.lastEnqueuedAt = Date.now();
			if (isFollowupRunDeferredError(err)) retryDeferred = true;
			else if (isGatewayRestartDrainError(err)) await waitForGatewayRestartFenceSettlement();
			else defaultRuntime.error?.(`followup queue drain failed for ${key}: ${String(err)}`);
		} finally {
			if (FOLLOWUP_QUEUES.get(key) === queue) {
				queue.draining = false;
				delete queue.drainOwner;
				const hasPendingQueueWork = queue.items.length > 0 || queue.droppedCount > 0;
				if (waitingForSteer && hasPendingQueueWork) {
					if (!queue.items.some((item) => item.steerPending)) scheduleFollowupDrain(key, effectiveRunFollowup);
				} else if (retryDeferred && hasPendingQueueWork) scheduleFollowupDrain(key, effectiveRunFollowup);
				else if (!hasPendingQueueWork) {
					FOLLOWUP_QUEUES.delete(key);
					clearFollowupDrainCallback(key);
				} else scheduleFollowupDrain(key, effectiveRunFollowup);
			}
		}
	};
	runWithGatewayIndependentRootWorkContinuation(() => runOutsidePreparedModelRuntimePluginGenerationScope(drainQueuedFollowups), "session:followup-drain").catch((err) => {
		if (FOLLOWUP_QUEUES.get(key) === queue && queue.drainOwner === drainOwner) {
			queue.draining = false;
			delete queue.drainOwner;
		}
		defaultRuntime.error?.(`followup queue drain admission failed for ${key}: ${String(err)}`);
	});
}
//#endregion
export { rememberFollowupDrainCallback as a, isFollowupRunAborted as c, createOverflowSummaryRetrySource as d, resolveFollowupDeliveryContextKey as f, prepareStaleFollowupDrainRetirement as i, resolveFollowupAbortSignal as l, dropAbortedFollowups as n, scheduleFollowupDrain as o, kickFollowupDrainIfIdle as r, FollowupRunDeferredError as s, clearFollowupDrainCallback as t, consumeQueueSummaryDelivery as u };
