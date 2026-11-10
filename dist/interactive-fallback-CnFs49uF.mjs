import { c as isMessagePresentationInteractiveBlock, d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, l as legacyInteractiveReplyToPresentation, v as renderMessagePresentationFallbackText, x as resolveLegacyInteractiveTextFallback } from "./payload-qyD1vby_.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { d as resolveAskUserQuestionOptionIndices } from "./reply-payload-79LnOCyy.mjs";
import { n as adaptMessagePresentationForChannel } from "./presentation-delivery-CnVvsxGL.mjs";
import { F as escapeTelegramHtml, w as buildInlineKeyboard } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { o as resolveTelegramInlineButtons, r as buildTelegramPresentationButtons, t as appendTelegramDroppedControlFallback } from "./button-types-DtegLouf.mjs";
//#region extensions/telegram/src/interactive-fallback.ts
const TELEGRAM_CONTROL_ONLY_FALLBACK = "Choose an option.";
const TELEGRAM_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: false,
	tables: false,
	limits: {
		actions: {
			maxActions: 100,
			maxActionsPerRow: 3,
			supportsStyles: false,
			supportsDisabled: false
		},
		selects: { maxOptions: 100 },
		text: { markdownDialect: "markdown" }
	}
};
function resolveTelegramPresentationCapabilities(params) {
	return params.richMessages ? {
		...TELEGRAM_PRESENTATION_CAPABILITIES,
		tables: true
	} : TELEGRAM_PRESENTATION_CAPABILITIES;
}
function escapeTelegramTableCellText(value) {
	return escapeTelegramHtml(String(value)).replace(/\s+/g, " ").trim();
}
function renderTelegramTableIsland(block) {
	const caption = block.caption.trim() ? `<caption>${escapeTelegramTableCellText(block.caption)}</caption>` : "";
	const renderRow = (cells, header) => `<tr>${cells.map((cell, index) => {
		const tag = header === "all" || index === header ? "th" : "td";
		return `<${tag}>${escapeTelegramTableCellText(cell)}</${tag}>`;
	}).join("")}</tr>`;
	return `<table>${caption}<thead>${renderRow(block.headers, "all")}</thead><tbody>${block.rows.map((row) => renderRow(row, block.rowHeaderColumnIndex)).join("")}</tbody></table>`;
}
function renderTelegramContextText(text) {
	return text.split("\n").map((line) => {
		const trimmed = line.trim();
		return trimmed && !/[_*]/.test(trimmed) ? `_${trimmed}_` : line;
	}).join("\n");
}
function renderTelegramRichFallbackText(presentation) {
	const parts = [];
	if (presentation.title?.trim()) parts.push(`**${presentation.title.trim()}**`);
	for (const block of presentation.blocks) {
		const text = block.type === "table" ? renderTelegramTableIsland(block) : block.type === "context" ? renderTelegramContextText(block.text) : renderMessagePresentationFallbackText({ presentation: { blocks: [block] } });
		if (text.trim()) parts.push(text);
	}
	return parts.join("\n\n");
}
const telegramDroppedControlFallbacks = /* @__PURE__ */ new WeakMap();
function markTelegramDroppedControlFallback(payload, textBefore, textAfter) {
	if (textBefore !== textAfter) telegramDroppedControlFallbacks.set(payload, textAfter.slice(textBefore.length));
	return payload;
}
function copyTelegramDroppedControlFallback(source, payload) {
	const fallback = telegramDroppedControlFallbacks.get(source);
	if (payload && fallback) telegramDroppedControlFallbacks.set(payload, fallback);
	return payload;
}
const applyTextToPayload = (payload, text) => payload.text === text ? payload : copyTelegramDroppedControlFallback(payload, copyReplyPayloadMetadata(payload, {
	...payload,
	text
}));
function partitionTelegramPresentationBlocks(params) {
	const fallbackBlocks = [];
	const nativeControlBlocks = [];
	const partitionControls = (controls, blockFor) => {
		const native = [];
		const fallback = [];
		for (const control of controls) (buildTelegramPresentationButtons({ blocks: [blockFor([control])] }, params.buttonOptions)?.length ? native : fallback).push(control);
		if (native.length > 0) nativeControlBlocks.push(blockFor(native));
		if (fallback.length > 0) fallbackBlocks.push(blockFor(fallback));
		return fallback.length > 0;
	};
	for (const block of params.presentation.blocks) {
		if (!params.presentationControlsSelected || !isMessagePresentationInteractiveBlock(block)) {
			fallbackBlocks.push(block);
			continue;
		}
		if (block.type === "buttons") partitionControls(block.buttons, (buttons) => ({
			type: "buttons",
			buttons
		}));
		else if (!partitionControls(block.options, (options) => ({
			...block,
			options
		})) && block.placeholder) fallbackBlocks.push({
			type: "text",
			text: block.placeholder
		});
	}
	return {
		fallbackBlocks,
		nativeControlBlocks
	};
}
/** Convert portable presentation into the one Telegram payload shape used by every send funnel. */
function canonicalizeTelegramPresentationPayload(payload, options) {
	const normalizedPresentation = normalizeMessagePresentation(payload.presentation);
	const telegramData = payload.channelData?.telegram;
	if (!normalizedPresentation) {
		const nativeButtons = resolveTelegramInlineButtons({ buttons: telegramData?.buttons });
		if (!buildInlineKeyboard(nativeButtons) || payload.text?.trim()) return payload;
		return copyReplyPayloadMetadata(payload, {
			...payload,
			text: TELEGRAM_CONTROL_ONLY_FALLBACK
		});
	}
	const richTables = options?.richTables === true;
	const presentation = adaptMessagePresentationForChannel({
		presentation: normalizedPresentation,
		capabilities: resolveTelegramPresentationCapabilities({ richMessages: richTables })
	});
	const interactive = normalizeLegacyInteractiveReply(payload.interactive);
	const buttonOptions = {
		allowWebAppButtons: options?.allowWebAppButtons === true,
		questionOptionIndices: resolveAskUserQuestionOptionIndices(payload)
	};
	const existingButtons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		interactive
	}, buttonOptions);
	const { fallbackBlocks, nativeControlBlocks } = partitionTelegramPresentationBlocks({
		presentation,
		presentationControlsSelected: existingButtons === void 0,
		buttonOptions
	});
	const presentationButtons = buildTelegramPresentationButtons(adaptMessagePresentationForChannel({
		presentation: { blocks: nativeControlBlocks },
		capabilities: { limits: {
			actions: { maxLabelLength: 64 },
			selects: { maxLabelLength: 64 }
		} }
	}), buttonOptions);
	const buttons = existingButtons ?? presentationButtons;
	const fallbackPresentation = {
		...presentation,
		blocks: fallbackBlocks
	};
	const fallbackText = richTables ? renderTelegramRichFallbackText(fallbackPresentation) : renderMessagePresentationFallbackText({ presentation: fallbackPresentation });
	const currentText = resolveLegacyInteractiveTextFallback({
		text: payload.text,
		interactive
	})?.trim() ?? "";
	const textIsFallback = payload.presentationTextMode === "fallback";
	const hasFallback = fallbackText.length > 0 && (currentText === fallbackText || currentText.endsWith(`\n\n${fallbackText}`));
	const text = textIsFallback ? nativeControlBlocks.length > 0 ? fallbackText : richTables ? fallbackText || currentText : currentText || fallbackText : hasFallback ? currentText : [currentText, fallbackText].filter(Boolean).join("\n\n");
	const { presentation: _presentation, presentationTextMode: _presentationTextMode, ...withoutPresentation } = payload;
	const canonical = {
		...withoutPresentation,
		text: text || (buttons ? TELEGRAM_CONTROL_ONLY_FALLBACK : "")
	};
	if (buttons) canonical.channelData = {
		...payload.channelData,
		telegram: {
			...telegramData,
			buttons
		}
	};
	return copyReplyPayloadMetadata(payload, canonical);
}
function resolveTelegramInteractiveTextFallback(params) {
	const interactive = normalizeLegacyInteractiveReply(params.interactive);
	const text = resolveLegacyInteractiveTextFallback({
		text: params.text ?? void 0,
		interactive
	});
	if (text?.trim()) return text;
	const presentation = normalizeMessagePresentation(params.presentation);
	if (presentation) {
		const fallback = renderMessagePresentationFallbackText({
			text: params.text ?? void 0,
			presentation
		});
		if (fallback.trim()) return fallback;
	}
	if (!interactive) return text;
	const interactivePresentation = legacyInteractiveReplyToPresentation(interactive);
	if (!interactivePresentation) return text;
	const fallback = renderMessagePresentationFallbackText({ presentation: interactivePresentation });
	return fallback.trim() ? fallback : text;
}
function resolveFinalTelegramPresentationText(params) {
	if (!params.richMessages) return;
	if (!normalizeMessagePresentation(params.payload.presentation)) return;
	const droppedControls = [];
	const buttonOptions = {
		allowWebAppButtons: params.allowWebAppButtons === true,
		questionOptionIndices: resolveAskUserQuestionOptionIndices(params.payload)
	};
	const telegramData = params.payload.channelData?.telegram;
	resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		interactive: normalizeLegacyInteractiveReply(params.payload.interactive)
	}, {
		...buttonOptions,
		onDroppedControl: (control) => droppedControls.push(control)
	});
	const suffix = telegramDroppedControlFallbacks.get(params.payload);
	const canonicalText = suffix && params.text.endsWith(suffix) ? params.text.slice(0, -suffix.length) : params.text;
	const canonicalInputText = suffix && params.payload.presentationTextMode !== "fallback" ? appendTelegramDroppedControlFallback(canonicalText, droppedControls) : canonicalText;
	const rendered = canonicalizeTelegramPresentationPayload({
		...params.payload,
		text: canonicalInputText
	}, {
		richTables: true,
		allowWebAppButtons: params.allowWebAppButtons
	}).text?.trimEnd();
	if (!rendered) return;
	const finalText = params.payload.presentationTextMode === "fallback" ? appendTelegramDroppedControlFallback(rendered, droppedControls) : rendered;
	return finalText !== params.text.trimEnd() ? finalText : void 0;
}
//#endregion
export { resolveFinalTelegramPresentationText as a, markTelegramDroppedControlFallback as i, canonicalizeTelegramPresentationPayload as n, resolveTelegramInteractiveTextFallback as o, copyTelegramDroppedControlFallback as r, resolveTelegramPresentationCapabilities as s, applyTextToPayload as t };
