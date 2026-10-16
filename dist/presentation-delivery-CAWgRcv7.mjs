import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { C as resolveMessagePresentationButtonAction, S as resolveMessagePresentationActionValue, T as resolveMessagePresentationOptionAction, _ as renderMessagePresentationControlFallbackLabel, f as normalizeMessagePresentation, g as renderMessagePresentationChartFallbackText, v as renderMessagePresentationFallbackText, y as renderMessagePresentationTableFallbackText } from "./payload-DfZ7JVGs.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/channels/plugins/outbound/presentation-limits.ts
const PRESENTATION_FALLBACK_CONTINUATION = Symbol.for("openclaw.presentation.fallback-continuation");
function positiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function truncateText(value, maxLength) {
	const limit = positiveInteger(maxLength);
	return limit ? truncateCodePoints(value, limit) : value;
}
function truncateUtf8Bytes(value, limit) {
	let bytes = 0;
	let result = "";
	for (const char of value) {
		const nextBytes = Buffer.byteLength(char, "utf8");
		if (bytes + nextBytes > limit) break;
		bytes += nextBytes;
		result += char;
	}
	return result;
}
function truncatePresentationText(value, limits) {
	const limit = positiveInteger(limits?.maxLength);
	if (!limit) return value;
	if (limits?.encoding === "utf8-bytes") return truncateUtf8Bytes(value, limit);
	if (limits?.encoding === "utf16-units") return truncateUtf16Safe(value, limit);
	return truncateText(value, limit);
}
function splitPresentationText(value, limits) {
	if (!positiveInteger(limits?.maxLength) || truncatePresentationText(value, limits) === value) return [value];
	const chunks = [];
	let remaining = value;
	while (remaining) {
		const prefix = truncatePresentationText(remaining, limits);
		if (!prefix || prefix === remaining) {
			chunks.push(remaining);
			break;
		}
		const newlineIndex = prefix.lastIndexOf("\n");
		const splitIndex = newlineIndex > 0 ? newlineIndex + 1 : prefix.length;
		chunks.push(remaining.slice(0, splitIndex));
		remaining = remaining.slice(splitIndex);
	}
	return chunks;
}
function presentationTextBlocks(params) {
	return splitPresentationText(params.text, params.limits).map((text, index) => {
		const block = {
			type: params.blockType,
			text
		};
		if (index > 0 || params.continuation) Object.defineProperty(block, PRESENTATION_FALLBACK_CONTINUATION, { value: true });
		return block;
	});
}
function fitsByteLimit(value, maxBytes) {
	const limit = positiveInteger(maxBytes);
	return !value || !limit || Buffer.byteLength(value, "utf8") <= limit;
}
function fallbackListBlocks(params) {
	const labels = normalizeStringEntries(params.labels);
	if (labels.length === 0) return [];
	return presentationTextBlocks({
		blockType: params.blockType,
		text: `${params.heading}:\n${labels.map((label) => `- ${label}`).join("\n")}`,
		limits: params.limits
	});
}
function createActionBudget(limits) {
	return {
		remainingActions: positiveInteger(limits?.maxActions),
		remainingRows: positiveInteger(limits?.maxRows),
		maxActionsPerRow: positiveInteger(limits?.maxActionsPerRow)
	};
}
function buttonCapacity(budget) {
	if (budget.remainingActions === 0 || budget.remainingRows === 0) return 0;
	const rowCapacity = budget.remainingRows && budget.maxActionsPerRow ? budget.remainingRows * budget.maxActionsPerRow : void 0;
	if (budget.remainingActions !== void 0 && rowCapacity !== void 0) return Math.min(budget.remainingActions, rowCapacity);
	return budget.remainingActions ?? rowCapacity;
}
function consumeButtonBudget(budget, count) {
	if (count <= 0) return;
	if (budget.remainingActions !== void 0) budget.remainingActions = Math.max(0, budget.remainingActions - count);
	if (budget.remainingRows !== void 0) {
		const perRow = budget.maxActionsPerRow ?? count;
		budget.remainingRows = Math.max(0, budget.remainingRows - Math.ceil(count / perRow));
	}
}
function hasActionSlotBudget(budget) {
	return budget.remainingActions !== 0 && budget.remainingRows !== 0;
}
function consumeSelectBudget(budget, count = 1) {
	if (budget.remainingActions !== void 0) budget.remainingActions = Math.max(0, budget.remainingActions - count);
	if (budget.remainingRows !== void 0) budget.remainingRows = Math.max(0, budget.remainingRows - count);
}
function adaptControl(control, action, limits) {
	if (!action) return;
	const legacyValueFits = fitsByteLimit(control.value, limits?.maxValueBytes);
	if (control.action !== void 0 ? !fitsByteLimit(resolveMessagePresentationActionValue(action), limits?.maxValueBytes) : action.type === "callback" && !legacyValueFits) return;
	const adapted = {
		...control,
		label: truncateText(control.label, limits?.maxLabelLength)
	};
	if (!legacyValueFits) delete adapted.value;
	return adapted;
}
function adaptButton(button, limits) {
	const adapted = adaptControl(button, resolveMessagePresentationButtonAction(button), limits);
	if (!adapted || button.disabled === true && limits?.supportsDisabled !== true) return;
	if (limits?.supportsStyles === false) delete adapted.style;
	return adapted;
}
function adaptButtonsBlock(block, limits, budget, fallbackBlockType, buttonSelection, textLimits) {
	const capacity = buttonCapacity(budget);
	const candidates = block.buttons.map((button) => ({
		original: button,
		adapted: adaptButton(button, limits)
	}));
	const renderableCandidates = candidates.filter((candidate) => Boolean(candidate.adapted));
	const eligibleCandidates = buttonSelection ? renderableCandidates.filter((candidate) => buttonSelection.has(candidate.original)) : renderableCandidates;
	const selectedCandidates = capacity !== void 0 && eligibleCandidates.length > capacity ? selectButtonsByPriority(eligibleCandidates, capacity) : eligibleCandidates;
	const selected = new Set(selectedCandidates);
	const buttons = selectedCandidates.map((candidate) => candidate.adapted);
	const droppedLabels = candidates.filter((candidate) => !candidate.adapted || !selected.has(candidate)).map((candidate) => renderMessagePresentationControlFallbackLabel(candidate.original));
	consumeButtonBudget(budget, buttons.length);
	const fallback = fallbackListBlocks({
		blockType: fallbackBlockType,
		heading: "Actions",
		labels: droppedLabels,
		limits: textLimits
	});
	if (buttons.length === 0) return fallback;
	return [...chunkItems(buttons, positiveInteger(limits?.maxActionsPerRow) ?? buttons.length).map((row) => ({
		type: "buttons",
		buttons: row
	})), ...fallback];
}
function adaptOption(option, limits) {
	return adaptControl(option, resolveMessagePresentationOptionAction(option), limits);
}
function adaptSelectBlock(block, limits, budget, fallbackBlockType, textLimits) {
	const candidates = block.options.map((option) => ({
		original: option,
		adapted: adaptOption(option, limits)
	}));
	const renderableCandidates = candidates.filter((candidate) => Boolean(candidate.adapted));
	const maxOptions = positiveInteger(limits?.maxOptions);
	const selectedCandidates = maxOptions ? renderableCandidates.slice(0, maxOptions) : renderableCandidates;
	const selected = new Set(selectedCandidates);
	const options = selectedCandidates.map((candidate) => candidate.adapted);
	const canRenderSelect = options.length > 0 && hasActionSlotBudget(budget);
	const fallback = fallbackListBlocks({
		blockType: fallbackBlockType,
		heading: block.placeholder ?? "Options",
		labels: (canRenderSelect ? candidates.filter((candidate) => !candidate.adapted || !selected.has(candidate)) : candidates).map((candidate) => renderMessagePresentationControlFallbackLabel(candidate.original)),
		limits: textLimits
	});
	if (!canRenderSelect) return fallback;
	consumeSelectBudget(budget);
	return [{
		type: "select",
		...block.placeholder ? { placeholder: truncateText(block.placeholder, limits?.maxLabelLength) } : {},
		options
	}, ...fallback];
}
function countRenderableSelectBlocks(blocks, capabilities, limits) {
	if (capabilities?.selects === false) return 0;
	let count = 0;
	for (const block of blocks) if (block.type === "select" && block.options.some((option) => adaptOption(option, limits))) count += 1;
	return count;
}
function createGlobalButtonSelection(params) {
	if (params.capabilities?.buttons === false) return;
	const reservationBudget = createActionBudget(params.limits);
	consumeSelectBudget(reservationBudget, countRenderableSelectBlocks(params.presentation.blocks, params.capabilities, params.selectLimits));
	const capacity = reservationBudget.remainingRows === 0 && reservationBudget.maxActionsPerRow === void 0 ? reservationBudget.remainingActions : buttonCapacity(reservationBudget);
	if (capacity === void 0) return;
	let rawButtonCount = 0;
	for (const block of params.presentation.blocks) if (block.type === "buttons") {
		rawButtonCount += block.buttons.length;
		if (rawButtonCount > capacity) break;
	}
	if (rawButtonCount <= capacity) return;
	const candidates = params.presentation.blocks.flatMap((block) => {
		if (block.type !== "buttons") return [];
		return block.buttons.map((button) => ({
			original: button,
			adapted: adaptButton(button, params.limits)
		})).filter((candidate) => Boolean(candidate.adapted));
	});
	if (candidates.length <= capacity) return;
	return new Set(selectButtonsByPriority(candidates, capacity).map((candidate) => candidate.original));
}
function selectButtonsByPriority(candidates, capacity) {
	return candidates.toSorted((left, right) => (right.adapted.priority ?? 0) - (left.adapted.priority ?? 0)).slice(0, capacity);
}
/** Limit native controls while preserving authored and fallback text in full. */
function adaptMessagePresentationForChannel(params) {
	const capabilities = params.capabilities;
	const limits = params.capabilities?.limits;
	const actionBudget = createActionBudget(limits?.actions);
	const fallbackBlockType = capabilities?.context === false ? "text" : "context";
	const buttonSelection = createGlobalButtonSelection({
		presentation: params.presentation,
		capabilities,
		limits: limits?.actions,
		selectLimits: limits?.selects
	});
	const titleBlocks = params.presentation.title ? presentationTextBlocks({
		blockType: "text",
		text: params.presentation.title,
		limits: limits?.text
	}) : [];
	const blocks = params.presentation.blocks.flatMap((block) => {
		if (block.type === "text" || block.type === "context") return presentationTextBlocks({
			blockType: block.type === "context" ? fallbackBlockType : "text",
			text: block.text,
			limits: limits?.text,
			continuation: Object.getOwnPropertyDescriptor(block, PRESENTATION_FALLBACK_CONTINUATION)?.value === true
		});
		if (block.type === "chart" && capabilities?.charts !== true || block.type === "table" && capabilities?.tables !== true) return presentationTextBlocks({
			blockType: fallbackBlockType,
			text: block.type === "chart" ? renderMessagePresentationChartFallbackText(block) : renderMessagePresentationTableFallbackText(block),
			limits: limits?.text
		});
		if (block.type === "buttons" && capabilities?.buttons === false || block.type === "select" && capabilities?.selects === false) return fallbackListBlocks({
			blockType: fallbackBlockType,
			heading: block.type === "buttons" ? "Actions" : block.placeholder ?? "Options",
			labels: (block.type === "buttons" ? block.buttons : block.options).map(renderMessagePresentationControlFallbackLabel),
			limits: limits?.text
		});
		if (block.type === "buttons") return adaptButtonsBlock(block, limits?.actions, actionBudget, fallbackBlockType, buttonSelection, limits?.text);
		if (block.type === "select") return adaptSelectBlock(block, limits?.selects, actionBudget, fallbackBlockType, limits?.text);
		return block.type === "divider" && capabilities?.divider === false ? [] : [block];
	});
	return {
		...params.presentation,
		...params.presentation.title ? { title: titleBlocks[0]?.text } : {},
		blocks: [...titleBlocks.slice(1), ...blocks]
	};
}
/** Return the subset of buttons that can still be rendered under action limits. */
function applyPresentationActionLimits(buttons, capabilities) {
	return adaptButtonsBlock({
		type: "buttons",
		buttons: [...buttons]
	}, capabilities?.limits?.actions, createActionBudget(capabilities?.limits?.actions), capabilities?.context === false ? "text" : "context", void 0, capabilities?.limits?.text).flatMap((entry) => entry.type === "buttons" ? entry.buttons : []);
}
/** Resolve an action page size that leaves room for reserved actions on the target channel. */
function presentationPageSize(capabilities, reservedActions = 0, maxPageSize = Number.POSITIVE_INFINITY) {
	const capacity = buttonCapacity(createActionBudget(capabilities?.limits?.actions));
	const remaining = Math.max(0, (capacity ?? maxPageSize) - Math.max(0, reservedActions));
	return Math.max(1, Math.min(remaining || 1, maxPageSize));
}
//#endregion
//#region src/channels/plugins/outbound/presentation-delivery.ts
/** Apply the same native rendering and fallback policy to every channel delivery path. */
async function renderPresentationForDelivery(handler, payload) {
	const presentation = normalizeMessagePresentation(payload.presentation);
	if (!presentation) return payload;
	const adaptedPresentation = adaptMessagePresentationForChannel({
		presentation,
		capabilities: handler.presentationCapabilities
	});
	const textIsFallback = payload.presentationTextMode === "fallback";
	const countDataBlocks = (blocks) => blocks.filter((block) => block.type === "table" || block.type === "chart").length;
	const hasInteractiveBlocks = presentation.blocks.some((block) => block.type === "buttons" || block.type === "select");
	if (textIsFallback && payload.text?.trim() && !hasInteractiveBlocks && countDataBlocks(presentation.blocks) > 0 && countDataBlocks(adaptedPresentation.blocks) === 0) {
		const { presentation: _degradedPresentation, presentationTextMode: _degradedPresentationTextMode, ...authoredFallback } = payload;
		return authoredFallback;
	}
	const adaptedPayload = {
		...payload,
		...textIsFallback ? { text: void 0 } : {},
		presentation: adaptedPresentation
	};
	const rendered = handler.renderPresentation ? await handler.renderPresentation(adaptedPayload, presentation) : null;
	if (rendered) {
		const { presentation: _presentation, presentationTextMode: _presentationTextMode, ...withoutPresentation } = rendered;
		return withoutPresentation;
	}
	const { presentation: _presentation, presentationTextMode: _presentationTextMode, ...withoutPresentation } = payload;
	return {
		...withoutPresentation,
		text: textIsFallback ? payload.text ?? renderMessagePresentationFallbackText({ presentation }) : renderMessagePresentationFallbackText({
			text: payload.text,
			presentation
		})
	};
}
//#endregion
export { presentationPageSize as i, adaptMessagePresentationForChannel as n, applyPresentationActionLimits as r, renderPresentationForDelivery as t };
