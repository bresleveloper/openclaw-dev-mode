import { c as isMessagePresentationInteractiveBlock, d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, l as legacyInteractiveReplyToPresentation, v as renderMessagePresentationFallbackText, x as resolveLegacyInteractiveTextFallback } from "./payload-COvcWceu.mjs";
import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { u as resolveAskUserQuestionOptionIndices } from "./reply-payload-RBmrGrXG.mjs";
import { n as adaptMessagePresentationForChannel } from "./presentation-delivery-DSo7BPas.mjs";
import { D as buildInlineKeyboard } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { a as resolveTelegramInlineButtons, r as buildTelegramPresentationButtons } from "./button-types-B1wFSdoZ.mjs";
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
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/\s+/g, " ").trim();
}
function renderTelegramTableIsland(block) {
	return `<table>${block.caption.trim() ? `<caption>${escapeTelegramTableCellText(block.caption)}</caption>` : ""}<thead><tr>${block.headers.map((header) => `<th>${escapeTelegramTableCellText(header)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((cell, index) => index === block.rowHeaderColumnIndex ? `<th>${escapeTelegramTableCellText(cell)}</th>` : `<td>${escapeTelegramTableCellText(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
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
function canEncodeTelegramPresentationControl(block, options) {
	return Boolean(buildTelegramPresentationButtons({ blocks: [block] }, options)?.length);
}
function partitionTelegramPresentationBlocks(params) {
	const fallbackBlocks = [];
	const nativeControlBlocks = [];
	for (const block of params.presentation.blocks) {
		if (!isMessagePresentationInteractiveBlock(block)) {
			fallbackBlocks.push(block);
			continue;
		}
		if (!params.presentationControlsSelected) {
			fallbackBlocks.push(block);
			continue;
		}
		if (block.type === "buttons") {
			const nativeButtons = [];
			const fallbackButtons = [];
			for (const button of block.buttons) (canEncodeTelegramPresentationControl({
				type: "buttons",
				buttons: [button]
			}, params.buttonOptions) ? nativeButtons : fallbackButtons).push(button);
			if (nativeButtons.length > 0) nativeControlBlocks.push({
				type: "buttons",
				buttons: nativeButtons
			});
			if (fallbackButtons.length > 0) fallbackBlocks.push({
				type: "buttons",
				buttons: fallbackButtons
			});
			continue;
		}
		const nativeOptions = [];
		const fallbackOptions = [];
		for (const option of block.options) (canEncodeTelegramPresentationControl({
			type: "select",
			options: [option]
		}, params.buttonOptions) ? nativeOptions : fallbackOptions).push(option);
		if (nativeOptions.length > 0) nativeControlBlocks.push({
			...block,
			options: nativeOptions
		});
		if (fallbackOptions.length > 0) fallbackBlocks.push({
			...block,
			options: fallbackOptions
		});
		else if (block.placeholder) fallbackBlocks.push({
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
	const fallbackText = richTables ? renderTelegramRichFallbackText({
		...presentation,
		blocks: fallbackBlocks
	}) : renderMessagePresentationFallbackText({ presentation: {
		...presentation,
		blocks: fallbackBlocks
	} });
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
//#endregion
export { resolveTelegramInteractiveTextFallback as n, resolveTelegramPresentationCapabilities as r, canonicalizeTelegramPresentationPayload as t };
