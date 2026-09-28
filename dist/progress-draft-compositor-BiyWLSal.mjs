import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { n as projectAgentActivityItem, t as isCompleteAgentPreamble } from "./agent-activity-presentation-DIuWOqb_.mjs";
import { A as resolveChannelStreamingSuppressDefaultToolProgressMessages, D as resolveChannelStreamingPreviewToolProgress, F as createProgressDraftDiffStatTracker, I as formatChannelProgressDraftDiffStat, N as isChannelProgressAttentionLine, O as resolveChannelStreamingProgressCommentary, P as removeChannelProgressDraftLine, a as createChannelProgressDraftGate, b as resolveChannelProgressDraftMaxLineChars, d as isChannelProgressDraftWorkToolName, f as isChannelProgressPriorityLine, g as normalizeChannelProgressDraftLineIdentity, i as copyProgressDraftLineMetadata, l as formatChannelProgressDraftTextForStreaming, m as mergeChannelProgressDraftLineForStreaming, n as buildChannelProgressDraftLineForEntry, v as resolveChannelProgressDraftConfig, x as resolveChannelProgressDraftMaxLines, y as resolveChannelProgressDraftLabel } from "./streaming-BRWehz40.mjs";
import { t as settleProgressVisibilityCallbackResult } from "./progress-visibility-DVUJibF4.mjs";
import { a as sanitizeProgressStatusText, i as resolveCommentaryLineId, n as formatReasoningProgressDisplayLine, r as normalizeCommentaryProgressText, t as createReasoningProgressAccumulator } from "./progress-draft-status-text-BWT52_t_.mjs";
//#region src/channels/progress-draft-events.ts
function createChannelProgressDraftEventHandlers(params) {
	const pushEvent = (input, detailMode) => {
		const options = detailMode ? { detailMode } : void 0;
		const line = params.buildLine ? params.buildLine(input, options) : buildChannelProgressDraftLineForEntry(params.entry, input, options);
		return params.pushLine(line, input.event === "tool" ? { toolName: input.name?.trim() } : {});
	};
	return {
		pushToolEvent: (payload) => {
			params.onTool?.(payload);
			const { detailMode, ...input } = payload;
			const activity = projectAgentActivityItem({
				name: payload.name,
				status: "running"
			}, { args: payload.args });
			return params.preparedItems || activity.hideFromChannelProgress ? Promise.resolve(false) : pushEvent({
				event: "tool",
				...input
			}, detailMode);
		},
		pushItemEvent: (payload) => {
			const { kind: itemKind, ...input } = payload;
			params.onItem?.(payload);
			if (payload.hideFromChannelProgress || payload.suppressChannelProgress) return Promise.resolve(false);
			return pushEvent({
				event: "item",
				...input,
				itemKind
			});
		},
		pushApprovalEvent: (payload) => {
			return payload.phase === "requested" ? pushEvent({
				event: "approval",
				...payload
			}) : Promise.resolve(false);
		},
		pushCommandOutputEvent: (payload) => !params.preparedItems && payload.phase === "end" ? pushEvent({
			event: "command-output",
			...payload
		}) : Promise.resolve(false),
		pushPatchEvent: (payload) => !params.preparedItems && payload.phase === "end" ? pushEvent({
			event: "patch",
			...payload
		}) : Promise.resolve(false)
	};
}
function routePreparedProgressItem(params) {
	const { payload, handlers } = params;
	if (payload.kind !== "preamble") {
		const id = payload.itemId;
		if (payload.hideFromChannelProgress && id) return handlers.pushItemEvent(payload).then(() => params.clearLine(id));
		return handlers.pushItemEvent(payload);
	}
	if (!isCompleteAgentPreamble(payload)) return Promise.resolve(false);
	if (!params.progressMode) return handlers.pushItemEvent(payload);
	return params.commentary ? params.pushCommentary(payload.progressText, {
		itemId: payload.itemId,
		complete: true
	}) : params.pushHeadline(payload.progressText, { itemId: payload.itemId });
}
//#endregion
//#region src/channels/progress-draft-snapshot.ts
/** Own public display data before adapters render it or receipts retain it. */
function redactProgressDraftLine(line) {
	if (typeof line === "string") return redactToolPayloadText(line);
	const redacted = {
		...line,
		text: redactToolPayloadText(line.text),
		label: redactToolPayloadText(line.label),
		...line.detail !== void 0 ? { detail: redactToolPayloadText(line.detail) } : {},
		...line.status !== void 0 ? { status: redactToolPayloadText(line.status) } : {},
		...line.icon !== void 0 ? { icon: redactToolPayloadText(line.icon) } : {},
		...line.toolName !== void 0 ? { toolName: redactToolPayloadText(line.toolName) } : {}
	};
	copyProgressDraftLineMetadata(line, redacted);
	return redacted;
}
function redactProgressPlanSteps(steps) {
	return steps?.map((step) => ({
		...step,
		step: redactToolPayloadText(step.step)
	}));
}
function createProgressDraftSnapshotState(params) {
	const snapshot = params.initialSnapshot;
	return {
		displayEntry: snapshot ? { streaming: { progress: {
			...resolveChannelProgressDraftConfig(params.entry),
			label: snapshot.label === void 0 ? false : redactToolPayloadText(snapshot.label)
		} } } : params.entry,
		transferredStatus: snapshot?.statusHeadline ? {
			text: redactToolPayloadText(snapshot.statusHeadline),
			format: snapshot.statusHeadlineFormat
		} : void 0,
		transferredDiffStat: snapshot?.diffStat ? { ...snapshot.diffStat } : void 0,
		lines: snapshot?.lines.map(redactProgressDraftLine) ?? [],
		planSteps: redactProgressPlanSteps(snapshot?.plan),
		planExplanation: redactToolPayloadText(snapshot?.planExplanation ?? ""),
		planExplanationFormat: snapshot?.planExplanationFormat
	};
}
function snapshotProgressDraftState(params) {
	const statusHeadline = params.status.text;
	const label = resolveChannelProgressDraftLabel({
		entry: params.entry,
		seed: params.seed,
		narration: statusHeadline
	});
	return {
		lines: params.lines.map((line) => typeof line === "string" ? line : { ...line }),
		...label ? { label } : {},
		...statusHeadline ? { statusHeadline } : {},
		...statusHeadline && params.status.format ? { statusHeadlineFormat: params.status.format } : {},
		...params.plan ? { plan: params.plan.map((step) => ({ ...step })) } : {},
		...params.planExplanation ? { planExplanation: params.planExplanation } : {},
		...params.planExplanation && params.planExplanationFormat ? { planExplanationFormat: params.planExplanationFormat } : {},
		...params.diffStat ? { diffStat: params.diffStat } : {}
	};
}
//#endregion
//#region src/channels/progress-work-counter.ts
/**
* Per-turn work counters for live channel progress surfaces. These describe the
* turn while it runs; nothing here survives into the finished transcript.
*/
function createChannelProgressWorkCounter(params) {
	const now = params?.now ?? Date.now;
	let startedAt = now();
	let toolCalls = 0;
	return {
		noteItem(item) {
			if (item.phase === "start" && item.kind !== "preamble" && !item.hideFromChannelProgress && !item.suppressChannelProgress) toolCalls += 1;
		},
		noteToolCall(toolName) {
			if (isChannelProgressDraftWorkToolName(toolName)) toolCalls += 1;
		},
		reset() {
			startedAt = now();
			toolCalls = 0;
		},
		get toolCalls() {
			return toolCalls;
		},
		get elapsedSeconds() {
			return Math.max(1, Math.round((now() - startedAt) / 1e3));
		}
	};
}
//#endregion
//#region src/channels/progress-draft-compositor.ts
const PROGRESS_STATUS_PREAMBLE_FRESH_MS = 2e4;
function createChannelProgressDraftCompositor(params) {
	const now = params.now ?? Date.now;
	const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
	const reasoningLinePrefix = params.reasoningLinePrefix ?? "";
	const commentaryLinePrefix = params.commentaryLinePrefix ?? "";
	const commentaryItalics = params.commentaryItalics ?? true;
	const stripLaneItalics = (text) => text.split("\n").map((line) => line.replace(/^_(.*)_$/su, "$1")).join("\n");
	const previewToolProgressEnabled = params.active && resolveChannelStreamingPreviewToolProgress(params.entry, params.mode !== "progress", params.mode);
	const quietProgress = params.presentation === "summary" || !previewToolProgressEnabled;
	const commentaryProgressEnabled = params.active && resolveChannelStreamingProgressCommentary(params.entry, false, params.mode);
	const thinkingProgressEnabled = params.active && (params.reasoningGate ?? true);
	const suppressDefaultToolProgressMessages = params.active && resolveChannelStreamingSuppressDefaultToolProgressMessages(params.entry, {
		draftStreamActive: true,
		mode: params.mode,
		previewToolProgressEnabled
	});
	let { displayEntry, transferredStatus, transferredDiffStat, lines, planSteps, planExplanation, planExplanationFormat } = createProgressDraftSnapshotState(params);
	let progressSuppressed = false;
	let renderGeneration = 0;
	let lastRenderedText = "";
	let lastRenderedStatusFormat;
	let lastRenderedLines = lines;
	let lastRenderedDiffStatKey = "";
	const reasoningProgress = createReasoningProgressAccumulator();
	let lastReasoningLine;
	let lastIdLessCommentaryId;
	let lastIdLessCommentaryBare = "";
	let preambleText = "";
	let preambleItemId;
	let preambleAt;
	let narrationText = "";
	let finalReplyStarted = false;
	let finalReplyDelivered = false;
	const diffStatTracker = createProgressDraftDiffStatTracker({ canStage: () => params.active && params.mode === "progress" && !transferredDiffStat && !progressSuppressed && !finalReplyStarted && !finalReplyDelivered });
	let preambleExpiryTimer;
	let lastStartRendered = false;
	const clearPreambleExpiryTimer = () => {
		if (preambleExpiryTimer !== void 0) {
			clearTimeoutFn(preambleExpiryTimer);
			preambleExpiryTimer = void 0;
		}
	};
	const resolveStatusText = () => {
		if (transferredStatus) return transferredStatus;
		const preambleIsFresh = preambleAt !== void 0 && now() - preambleAt < 2e4;
		if (preambleText && (preambleIsFresh || !(narrationText || planExplanation))) return { text: preambleText };
		return narrationText ? { text: narrationText } : {
			text: planExplanation,
			format: planExplanationFormat
		};
	};
	const formatDraftText = (draftLines = lines, options) => {
		const status = resolveStatusText();
		const narration = status.text || void 0;
		const linesRenderedByChannel = params.rendersRollingLinesNatively === true && Boolean(narration || planSteps?.length);
		return formatChannelProgressDraftTextForStreaming({
			presentation: params.presentation,
			entry: displayEntry,
			lines: linesRenderedByChannel ? [] : draftLines,
			seed: params.seed,
			formatLine: options?.formatted === false ? void 0 : params.formatLine,
			formatPlainText: options?.formatted === false ? (text) => text : params.formatPlainText,
			onPreparedBlocks: options?.onPreparedBlocks,
			narration,
			narrationFormat: status.format,
			plan: planSteps,
			diffStat: resolveDiffStat()
		});
	};
	const resolveDiffStat = () => transferredDiffStat ? { ...transferredDiffStat } : diffStatTracker.resolve();
	const getSnapshot = () => snapshotProgressDraftState({
		entry: displayEntry,
		seed: params.seed,
		status: resolveStatusText(),
		lines,
		plan: planSteps,
		planExplanation,
		planExplanationFormat,
		diffStat: resolveDiffStat()
	});
	const clearActivityState = (suppressed) => {
		clearPreambleExpiryTimer();
		progressSuppressed = suppressed;
		displayEntry = params.entry;
		transferredStatus = void 0;
		transferredDiffStat = void 0;
		lines = [];
		renderGeneration += 1;
		lastRenderedText = "";
		lastRenderedStatusFormat = void 0;
		lastRenderedLines = lines;
		lastRenderedDiffStatKey = "";
		reasoningProgress.reset();
		lastReasoningLine = void 0;
		lastIdLessCommentaryId = void 0;
		lastIdLessCommentaryBare = "";
		preambleText = "";
		preambleItemId = void 0;
		preambleAt = void 0;
		narrationText = "";
		diffStatTracker.reset();
		lastStartRendered = false;
	};
	const clearProgressState = (suppressed) => {
		clearActivityState(suppressed);
		planSteps = void 0;
		planExplanation = "";
		planExplanationFormat = void 0;
	};
	const publish = async (options) => {
		if (!params.update) return false;
		let blocks = [];
		const text = formatDraftText(lines, { onPreparedBlocks: (prepared) => {
			blocks = prepared;
		} });
		const statusFormat = resolveStatusText().format;
		const diffStatKey = JSON.stringify(resolveDiffStat() ?? null);
		const structuredStateChanged = params.updateOnLineChange === true && (lines !== lastRenderedLines || diffStatKey !== lastRenderedDiffStatKey);
		if (!text || text === lastRenderedText && statusFormat === lastRenderedStatusFormat && !structuredStateChanged) return false;
		const generation = renderGeneration;
		const observed = await settleProgressVisibilityCallbackResult(params.update(text, {
			...options,
			lines: [...lines],
			snapshot: {
				...getSnapshot(),
				...blocks.some((block) => block.format === "plain") ? { preparedBlocks: blocks } : {}
			}
		}));
		if (observed.visible && generation === renderGeneration) {
			lastRenderedText = text;
			lastRenderedStatusFormat = statusFormat;
			lastRenderedLines = lines;
			lastRenderedDiffStatKey = diffStatKey;
		}
		return observed.visible;
	};
	const render = async (options) => {
		if (!params.active || params.mode !== "progress" || finalReplyStarted || finalReplyDelivered) return false;
		return await publish(options);
	};
	const schedulePreambleExpiryRefresh = () => {
		clearPreambleExpiryTimer();
		if (!preambleText || !narrationText || preambleAt === void 0 || !gate?.hasStarted || finalReplyStarted || finalReplyDelivered) return;
		const remaining = PROGRESS_STATUS_PREAMBLE_FRESH_MS - (now() - preambleAt);
		if (remaining <= 0) return;
		preambleExpiryTimer = setTimeoutFn(() => {
			preambleExpiryTimer = void 0;
			render().catch((err) => {
				console.warn(`[progress-draft] channel progress status refresh failed: ${String(err)}`);
			});
		}, remaining);
	};
	const gate = params.update && createChannelProgressDraftGate({
		onStart: async () => {
			lastStartRendered = await render({ flush: true });
			schedulePreambleExpiryRefresh();
		},
		setTimeoutFn,
		clearTimeoutFn
	});
	const startAndRender = async (options) => {
		const alreadyStarted = gate?.hasStarted;
		if (!alreadyStarted) lastStartRendered = false;
		await gate?.startNow();
		if (!gate?.hasStarted) return false;
		return alreadyStarted ? await render(options) : lastStartRendered;
	};
	const renderAfterRetraction = async () => {
		if (!params.active || !params.update || finalReplyStarted || finalReplyDelivered || params.mode === "progress" && !gate?.hasStarted) return false;
		if (lines.length || resolveStatusText().text || planSteps?.length || formatChannelProgressDraftDiffStat(resolveDiffStat())) return await publish();
		if (!params.deleteCurrent) return lastRenderedText ? await publish() : false;
		renderGeneration += 1;
		lastRenderedText = "";
		await params.deleteCurrent();
		return true;
	};
	const clearLine = async (lineId) => {
		const nextLines = removeChannelProgressDraftLine(lines, lineId);
		if (nextLines === lines) return false;
		lines = nextLines;
		return await renderAfterRetraction();
	};
	const noteProgress = async (inputLine, options) => {
		if (!params.active || finalReplyStarted || finalReplyDelivered) return false;
		if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName)) return false;
		const line = inputLine === void 0 ? void 0 : redactProgressDraftLine(inputLine);
		if (params.isEmptyLine?.(line)) return false;
		const normalized = normalizeChannelProgressDraftLineIdentity(line);
		if (!normalized || progressSuppressed) return false;
		if (params.mode !== "progress" && !previewToolProgressEnabled) return false;
		const progressLine = typeof line === "object" && line !== void 0 ? line : normalized;
		const shouldStoreLine = !quietProgress || typeof progressLine === "object" && progressLine.kind === "approval";
		const needsAttention = shouldStoreLine && isChannelProgressPriorityLine(progressLine);
		const shouldStartImmediately = shouldStoreLine && isChannelProgressAttentionLine(progressLine);
		const nextLines = shouldStoreLine ? mergeChannelProgressDraftLineForStreaming(lines, progressLine, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) }) : lines;
		const lineChanged = nextLines !== lines;
		const hasUnconfirmedRender = params.update && formatDraftText(nextLines) !== lastRenderedText;
		const diffStatChanged = params.updateOnLineChange === true && JSON.stringify(resolveDiffStat() ?? null) !== lastRenderedDiffStatKey;
		if (shouldStoreLine && !lineChanged && !hasUnconfirmedRender && !diffStatChanged) return false;
		if (quietProgress || shouldStoreLine && lineChanged) {
			reasoningProgress.reset();
			lastReasoningLine = void 0;
		}
		if (shouldStoreLine && params.update && params.tryNativeUpdate) {
			const text = formatDraftText(nextLines, { formatted: false });
			if (text && await params.tryNativeUpdate(text)) {
				lines = nextLines;
				lastRenderedText = text;
				lastRenderedLines = lines;
				return true;
			}
		}
		lines = nextLines;
		if (params.mode !== "progress") return shouldStoreLine ? await publish() : false;
		if (options?.startImmediately || params.shouldStartNow?.(line) || shouldStartImmediately) {
			const flush = options?.flush === true || needsAttention;
			return await startAndRender(flush ? { flush: true } : void 0);
		}
		const alreadyStarted = gate?.hasStarted;
		const progressActive = await gate?.noteWork();
		if ((alreadyStarted || progressActive) && gate?.hasStarted) return await render();
		return false;
	};
	const progressEventHandlers = createChannelProgressDraftEventHandlers({
		entry: params.entry,
		preparedItems: params.preparedItems,
		pushLine: noteProgress,
		onTool: diffStatTracker.stageToolEvent,
		onItem: diffStatTracker.commitItemEvent,
		...params.buildProgressEventLine ? { buildLine: params.buildProgressEventLine } : {}
	});
	const compositor = {
		get previewToolProgressEnabled() {
			return previewToolProgressEnabled;
		},
		get commentaryProgressEnabled() {
			return commentaryProgressEnabled;
		},
		get suppressDefaultToolProgressMessages() {
			return suppressDefaultToolProgressMessages;
		},
		get hasStarted() {
			return gate?.hasStarted ?? false;
		},
		get isVisible() {
			return Boolean(lastRenderedText) && !finalReplyStarted && !finalReplyDelivered;
		},
		get hasStatusHeadline() {
			return Boolean(resolveStatusText().text);
		},
		get hasPlanProgress() {
			return Boolean(planSteps?.length);
		},
		getSnapshot,
		getText: () => formatDraftText(),
		markFinalReplyStarted() {
			finalReplyStarted = true;
			gate?.cancel();
			clearPreambleExpiryTimer();
		},
		markFinalReplyDelivered() {
			finalReplyDelivered = true;
			clearPreambleExpiryTimer();
		},
		beginNewTurn(options) {
			if (options?.force !== true && !finalReplyStarted && !finalReplyDelivered) return false;
			finalReplyStarted = false;
			finalReplyDelivered = false;
			gate?.reset();
			clearProgressState(false);
			return true;
		},
		reset() {
			clearProgressState(false);
		},
		resetActivity(options) {
			clearActivityState(options?.suppressed === true);
		},
		beginAssistantMessage() {
			if (progressSuppressed) clearActivityState(false);
			reasoningProgress.reset();
		},
		resetReasoningProgress() {
			reasoningProgress.reset();
		},
		mergeReasoningProgress: reasoningProgress.merge,
		suppress() {
			clearProgressState(true);
		},
		cancel() {
			gate?.cancel();
			clearPreambleExpiryTimer();
		},
		async start() {
			await gate?.startNow();
		},
		async noteActivity(options) {
			if (!params.active || params.mode !== "progress" || progressSuppressed || finalReplyStarted || finalReplyDelivered) return false;
			if (options?.startImmediately) return await startAndRender({ flush: true });
			const alreadyStarted = gate?.hasStarted;
			const progressActive = await gate?.noteWork();
			if ((alreadyStarted || progressActive) && gate?.hasStarted) return await render();
			return false;
		},
		pushToolProgress: noteProgress,
		...progressEventHandlers,
		pushItemEvent: (payload) => routePreparedProgressItem({
			payload,
			progressMode: params.mode === "progress",
			commentary: commentaryProgressEnabled,
			handlers: progressEventHandlers,
			clearLine,
			pushCommentary: (text, options) => compositor.pushCommentaryProgress(text, options),
			pushHeadline: (text, options) => compositor.pushPreambleHeadline(text, options)
		}),
		async pushApprovalEvent(payload) {
			if (payload.phase === "resolved" && payload.approvalId) return await clearLine(`approval:${payload.approvalId}`);
			return await progressEventHandlers.pushApprovalEvent(payload);
		},
		async pushPlanProgress(steps, options) {
			if (!params.active || progressSuppressed || finalReplyStarted || finalReplyDelivered) return false;
			if (params.mode !== "progress" && !previewToolProgressEnabled) return false;
			transferredStatus = void 0;
			planSteps = steps && steps.length > 0 ? redactProgressPlanSteps(steps) : void 0;
			planExplanation = redactToolPayloadText(options?.explanation ?? "").replace(/\s+/g, " ").trim();
			planExplanationFormat = options?.explanationFormat;
			if (!planSteps && !planExplanation) return await renderAfterRetraction();
			return params.mode === "progress" ? await startAndRender() : await publish({ flush: true });
		},
		async pushPreambleHeadline(text, options) {
			if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
			if (commentaryProgressEnabled) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const itemId = options?.itemId?.trim() || void 0;
			const normalized = sanitizeProgressStatusText(text ?? "").replace(/\s+/g, " ").trim();
			if (!normalized) {
				if (!itemId || itemId !== preambleItemId) return false;
				preambleText = "";
				preambleItemId = void 0;
				preambleAt = void 0;
				clearPreambleExpiryTimer();
				return await renderAfterRetraction();
			}
			const isNewPreambleItem = Boolean(itemId && itemId !== preambleItemId);
			if (isNewPreambleItem) preambleItemId = itemId;
			else if (!itemId) preambleItemId = void 0;
			if (normalized === preambleText && !isNewPreambleItem) return false;
			transferredStatus = void 0;
			preambleText = normalized;
			preambleAt = now();
			schedulePreambleExpiryRefresh();
			return gate?.hasStarted ? await render() : false;
		},
		async pushNarrationProgress(text) {
			if (!params.active || params.mode !== "progress" || progressSuppressed) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const normalized = redactToolPayloadText(text ?? "").replace(/\s+/g, " ").trim();
			if (normalized === narrationText) return false;
			transferredStatus = void 0;
			if (!normalized) {
				narrationText = "";
				clearPreambleExpiryTimer();
				return await render();
			}
			narrationText = normalized;
			schedulePreambleExpiryRefresh();
			return gate?.hasStarted ? await render() : false;
		},
		async pushReasoningProgress(text, options) {
			if (!params.active || params.mode !== "progress" || !text || progressSuppressed || finalReplyStarted || finalReplyDelivered || !thinkingProgressEnabled) return false;
			const normalized = reasoningProgress.merge(text, options);
			if (!normalized) return false;
			const compactLine = formatReasoningProgressDisplayLine(normalized, resolveChannelProgressDraftMaxLineChars(params.entry));
			if (!compactLine) return false;
			const displayLine = `${reasoningLinePrefix}${compactLine}`;
			const priorIndex = lastReasoningLine === void 0 ? -1 : lines.lastIndexOf(lastReasoningLine);
			if (params.presentation === "summary") lines = mergeChannelProgressDraftLineForStreaming(lines, {
				id: "reasoning",
				kind: "item",
				text: stripLaneItalics(compactLine),
				label: "Reasoning",
				prefix: false
			}, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) });
			else if (priorIndex >= 0) {
				lines = [...lines];
				lines[priorIndex] = displayLine;
			} else lines = mergeChannelProgressDraftLineForStreaming(lines, displayLine, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) });
			lastReasoningLine = displayLine;
			if (await gate?.noteWork() && gate?.hasStarted) return await render();
			return false;
		},
		async pushCommentaryProgress(text, options) {
			if (!params.active || params.mode !== "progress" || !commentaryProgressEnabled) return false;
			if (finalReplyStarted || finalReplyDelivered) return false;
			const itemId = options?.itemId?.trim();
			if (!text && !itemId) return false;
			const normalized = normalizeCommentaryProgressText(text ?? "");
			const bareNormalized = stripLaneItalics(normalized);
			const lineId = resolveCommentaryLineId({
				itemId,
				normalized,
				bareNormalized,
				lastIdLessCommentaryId,
				lastIdLessCommentaryBare
			});
			if (!normalized) {
				if (lineId) await clearLine(lineId);
				return false;
			}
			const line = {
				id: lineId,
				text: `${commentaryLinePrefix}${commentaryItalics ? normalized : bareNormalized}`,
				kind: "item",
				label: "Commentary",
				prefix: false,
				...options?.complete !== void 0 ? { complete: options.complete } : {}
			};
			lines = mergeChannelProgressDraftLineForStreaming(lines, line, { maxLines: resolveChannelProgressDraftMaxLines(params.entry) });
			if (!itemId) {
				lastIdLessCommentaryId = lineId;
				lastIdLessCommentaryBare = bareNormalized;
			}
			return await startAndRender();
		}
	};
	return compositor;
}
//#endregion
export { createChannelProgressDraftCompositor as n, createChannelProgressWorkCounter as r, PROGRESS_STATUS_PREAMBLE_FRESH_MS as t };
