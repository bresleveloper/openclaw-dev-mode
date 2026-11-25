import { $ as encodeSlackQuestionAction, B as SLACK_BUTTON_ACTION_IDS, D as appendSlackNativeDataFallbackText, Et as markdownToSlackMrkdwnChunks, G as SLACK_SELECT_ACTION_IDS, Ot as escapeSlackMrkdwn, R as truncateSlackText, Tt as chunkSlackMrkdwnText, at as parseSlackBlocksInput, ct as buildSlackCompleteBlocksFallbackText, dt as hasSlackDataVisualizationBlock, ht as countSlackDataTableCellCharacters, j as hasSlackNativeDataBlock, k as buildSlackNativeDataAccessibilityText, lt as renderSlackBlockFallbackText, mt as countSlackDataTableBlocksCellCharacters, pt as buildSlackDataTableBlock, rt as encodeSlackApprovalAction, st as buildSlackBlocksFallbackText, ut as buildSlackDataVisualizationBlock, vt as SLACK_SECTION_TEXT_MAX, yt as renderSlackMessagePresentationChartFallbackText } from "./probe-BHqvMbno.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { legacyInteractiveReplyToPresentation, normalizeMessagePresentation, renderMessagePresentationFallbackText, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveAskUserQuestionOptionIndex, resolveAskUserQuestionOptionIndices, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { parseExecApprovalCommandText } from "openclaw/plugin-sdk/approval-reply-runtime";
// extensions/slack/src/authored-text.ts
function isSlackAuthoredTextRepresentedInFragments(plan, fragments) {
	if (plan.length === 0) return false;
	if (fragments.some((_, start) => plan.every((text, index) => text === fragments[start + index]))) return true;
	const [text] = plan;
	if (plan.length !== 1 || !text || /[*_~`<]/u.test(text)) return false;
	for (let start = 0; start < fragments.length; start += 1) {
		let offset = 0;
		for (let end = start; end < fragments.length; end += 1) {
			const fragment = fragments[end];
			if (typeof fragment !== "string" || !text.startsWith(fragment, offset)) break;
			offset += fragment.length;
			if (offset === text.length) return true;
			if (!/\s/u.test(text[offset] ?? "")) break;
			while (/\s/u.test(text[offset] ?? "")) offset += 1;
		}
	}
	return false;
}
/** Resolve placement from producer facts, before accessibility text changes the payload text. */
function resolveSlackAuthoredTextPlacement(params) {
	const text = normalizeOptionalString(params.text);
	if (!text) return "none";
	const fragments = (params.renderedTextFragments ?? params.interactive?.blocks.flatMap((block) => block.type === "text" ? [block.text] : []) ?? []).map((fragment) => fragment?.trim() ?? null).filter((fragment) => fragment !== "");
	return isSlackAuthoredTextRepresentedInFragments((params.authoredChunks ?? [text]).map((fragment) => fragment.trim()).filter(Boolean), fragments) ? "blocks" : "outside-blocks";
}
// extensions/slack/src/blocks-render.ts
const SLACK_BUTTON_URL_MAX = 3e3;
function buildSlackPlainText(text, maxLength) {
	return {
		type: "plain_text",
		text: truncateSlackText(text, maxLength),
		emoji: true
	};
}
function resolveSlackActionTarget(action, questionOptionIndices) {
	if (!action) return;
	if (action.type === "approval") return {
		kind: "approval",
		value: encodeSlackApprovalAction(action)
	};
	if (action.type === "question") {
		if ("intent" in action) return;
		const optionIndex = resolveAskUserQuestionOptionIndex({
			questionOptionIndices,
			questionId: action.questionId,
			optionValue: action.optionValue
		});
		const value = optionIndex === void 0 ? void 0 : encodeSlackQuestionAction({
			questionId: action.questionId,
			optionIndex
		});
		return value ? {
			kind: "question",
			value
		} : void 0;
	}
	if (action.type === "url" || action.type === "web-app") {
		const url = normalizeOptionalString(action.url);
		return url ? {
			kind: "link",
			url
		} : void 0;
	}
	if (action.type === "callback") {
		const value = normalizeOptionalString(action.value);
		return value ? {
			kind: "callback",
			value
		} : void 0;
	}
	const command = normalizeOptionalString(action.command);
	return command && parseExecApprovalCommandText(command) ? {
		kind: "reply",
		value: command
	} : void 0;
}
function isSlackTextFallbackButton(button) {
	const action = resolveMessagePresentationButtonAction(button);
	return action?.type === "question" && "intent" in action && action.intent === "custom-input";
}
function readSlackOpenClawBlockIndex(blockId, prefix) {
	if (!blockId.startsWith(prefix)) return;
	const value = Number.parseInt(blockId.slice(prefix.length), 10);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Resolve existing Block Kit indexes and native-data budgets before appending portable blocks. */
function resolveSlackBlockOffsets(blocks, mode = "all") {
	let buttonIndexOffset = 0;
	const dataTableCellCharacterCountOffset = mode === "all" ? countSlackDataTableBlocksCellCharacters(blocks) ?? 10001 : 0;
	let dataVisualizationCountOffset = 0;
	let selectIndexOffset = 0;
	for (const block of blocks ?? []) {
		if (mode === "all" && hasSlackDataVisualizationBlock([block])) dataVisualizationCountOffset += 1;
		const blockId = block.block_id;
		if (typeof blockId !== "string" || !blockId) continue;
		buttonIndexOffset = Math.max(buttonIndexOffset, readSlackOpenClawBlockIndex(blockId, "openclaw_reply_buttons_") ?? 0);
		selectIndexOffset = Math.max(selectIndexOffset, readSlackOpenClawBlockIndex(blockId, "openclaw_reply_select_") ?? 0);
	}
	return {
		buttonIndexOffset,
		dataTableCellCharacterCountOffset,
		dataVisualizationCountOffset,
		selectIndexOffset
	};
}
/**
* @deprecated Use buildSlackPresentationBlocks with MessagePresentation.
*/
function buildSlackInteractiveBlocks(interactive, options = {}) {
	return buildSlackPresentationBlocks(interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0, options);
}
function buildSlackPresentationBlocks(presentation, options = {}) {
	return compileSlackPresentationBlocks(presentation, options, false) ?? [];
}
/** Return native blocks only when every portable control and data block fits. */
function buildSlackPresentationBlocksIfComplete(presentation, options = {}) {
	return compileSlackPresentationBlocks(presentation, options, true);
}
function compileSlackPresentationBlocks(presentation, options, requireComplete) {
	if (!presentation) return [];
	if (requireComplete && presentation.title && presentation.title.trim().length > 150) return;
	let tables = [];
	let cellCharacterCount = options.dataTableCellCharacterCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type !== "table") continue;
		const table = buildSlackDataTableBlock(block, { cellCharacterCountOffset: cellCharacterCount });
		if (!table) {
			tables = void 0;
			break;
		}
		cellCharacterCount += countSlackDataTableCellCharacters(table);
		tables.push(table);
	}
	if (requireComplete && !tables) return;
	const blocks = [];
	if (presentation.title) blocks.push({
		type: "header",
		text: buildSlackPlainText(presentation.title, 150)
	});
	const controlIndices = {
		buttons: options.buttonIndexOffset ?? 0,
		select: options.selectIndexOffset ?? 0
	};
	let tableIndex = 0;
	let dataVisualizationCount = options.dataVisualizationCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			const text = block.text.trim();
			if (!text) continue;
			for (const chunk of chunkSlackMrkdwnText(text, SLACK_SECTION_TEXT_MAX)) blocks.push(block.type === "context" ? {
				type: "context",
				elements: [{
					type: "mrkdwn",
					text: chunk,
					verbatim: true
				}]
			} : {
				type: "section",
				text: {
					type: "mrkdwn",
					text: chunk
				}
			});
			continue;
		}
		if (block.type === "divider") {
			blocks.push({ type: "divider" });
			continue;
		}
		if (block.type === "buttons" || block.type === "select") {
			const index = controlIndices[block.type] + 1;
			let elements;
			if (block.type === "buttons") {
				let complete = true;
				const buttons = block.buttons.flatMap((button, choiceIndex) => {
					const questionOptionIndices = options.questionOptionIndices;
					let target;
					if (button.action !== void 0) {
						const action = resolveMessagePresentationButtonAction(button);
						target = action ? resolveSlackActionTarget(action, questionOptionIndices) : void 0;
					} else {
						const legacyUrl = normalizeOptionalString(button.url ?? button.webApp?.url ?? button.web_app?.url);
						if (legacyUrl && legacyUrl.length <= SLACK_BUTTON_URL_MAX) target = {
							kind: "link",
							url: legacyUrl
						};
						else {
							const legacyValue = normalizeOptionalString(button.value);
							target = legacyValue ? {
								kind: "reply",
								value: legacyValue
							} : legacyUrl ? {
								kind: "link",
								url: legacyUrl
							} : void 0;
						}
					}
					if (!target || (target.kind === "link" ? target.url.length > SLACK_BUTTON_URL_MAX : target.value.length > 2e3)) {
						if (requireComplete && !isSlackTextFallbackButton(button)) complete = false;
						return [];
					}
					if (button.label.length > 75) complete = false;
					const style = button.style === "success" ? "primary" : button.style === "primary" || button.style === "danger" ? button.style : void 0;
					return [{
						type: "button",
						action_id: `${SLACK_BUTTON_ACTION_IDS[target.kind]}:${index}:${choiceIndex + 1}`,
						text: buildSlackPlainText(button.label, 75),
						...target.kind === "link" ? { url: target.url } : { value: target.value },
						...style ? { style } : {}
					}];
				});
				if (requireComplete && (!complete || buttons.length > 25)) return;
				elements = buttons.slice(0, 25);
			} else {
				const placeholder = normalizeOptionalString(block.placeholder) ?? "Choose an option";
				const candidates = block.options.map((option) => {
					if (option.action !== void 0) {
						const action = resolveMessagePresentationOptionAction(option);
						const target = action ? resolveSlackActionTarget(action) : void 0;
						return target && target.kind !== "link" && target.kind !== "question" ? {
							label: option.label,
							...target
						} : void 0;
					}
					const value = normalizeOptionalString(option.value);
					return value ? {
						label: option.label,
						kind: "reply",
						value
					} : void 0;
				});
				if (requireComplete && (placeholder.length > 75 || block.options.length > 100 || block.placeholder && block.placeholder.length > 75 || !candidates.every((option) => option && option.label.length <= 75 && option.value.length <= 150) || new Set(candidates.map((option) => option?.kind)).size !== 1)) return;
				const selectOptions = candidates.flatMap((option) => option && option.value.length <= 150 ? [option] : []).slice(0, 100);
				const optionKinds = new Set(selectOptions.map((option) => option.kind));
				elements = selectOptions.length > 0 && optionKinds.size === 1 ? [{
					type: "static_select",
					action_id: `${SLACK_SELECT_ACTION_IDS[selectOptions[0].kind]}:${index}`,
					placeholder: buildSlackPlainText(placeholder, 75),
					options: selectOptions.map((option) => ({
						text: buildSlackPlainText(option.label, 75),
						value: option.value
					}))
				}] : [];
			}
			if (elements.length > 0) {
				controlIndices[block.type] = index;
				blocks.push({
					type: "actions",
					block_id: `openclaw_reply_${block.type}_${index}`,
					elements
				});
			}
			continue;
		}
		if (block.type === "chart") {
			const rendered = dataVisualizationCount < 2 ? buildSlackDataVisualizationBlock(block) : void 0;
			if (rendered) {
				dataVisualizationCount += 1;
				blocks.push(rendered);
			} else if (requireComplete) return;
			else {
				const fallback = renderSlackMessagePresentationChartFallbackText(block);
				blocks.push(...chunkTextForOutbound(fallback, SLACK_SECTION_TEXT_MAX).map((text) => ({
					type: "context",
					elements: [{
						type: "mrkdwn",
						text,
						verbatim: true
					}]
				})));
			}
			continue;
		}
		if (block.type === "table") {
			if (tables) blocks.push(tables[tableIndex++]);
		}
	}
	return blocks;
}
// extensions/slack/src/reply-blocks.ts
function normalizeSlackReplyPayload(payload) {
	const previousSlackData = asOptionalRecord(payload.channelData?.slack) ?? {};
	const { authoredPresentationText: _authoredPresentationText, ...slackData } = previousSlackData;
	if (payload.presentationTextMode !== "fallback" || !normalizeMessagePresentation(payload.presentation)) return Object.hasOwn(previousSlackData, "authoredPresentationText") ? {
		...payload,
		channelData: {
			...payload.channelData,
			slack: slackData
		}
	} : payload;
	return {
		...payload,
		channelData: {
			...payload.channelData,
			slack: {
				...slackData,
				authoredPresentationText: payload.text
			}
		}
	};
}
/** Project each segment only when the caller is ready to deliver it. */
function* iterateSlackReplyDeliveryMessages(params) {
	let outsideText = params.authoredTextPlacement === "outside-blocks" ? params.text?.trim() ?? "" : "";
	for (const segment of params.segments) {
		if (segment.kind === "text") {
			const text = [outsideText, segment.text].filter(Boolean).join("\n\n");
			outsideText = "";
			if (text) yield {
				text,
				textIsSlackPlainText: true
			};
			continue;
		}
		const baseText = outsideText;
		outsideText = "";
		const text = buildSlackNativeDataAccessibilityText(baseText, segment.blocks) || buildSlackBlocksFallbackText(segment.blocks);
		const authoredTextPlacement = baseText ? "outside-blocks" : params.authoredTextPlacement === "blocks" ? "blocks" : "none";
		yield {
			text,
			blocks: segment.blocks,
			authoredTextPlacement,
			...baseText ? { nativeDataFallbackBaseText: baseText } : {}
		};
	}
	if (outsideText) yield {
		text: outsideText,
		authoredTextPlacement: "outside-blocks"
	};
}
function resolveSlackReplyDeliveryMessages(params) {
	return Array.from(iterateSlackReplyDeliveryMessages(params));
}
function resolveSlackReplyRenderPlan(payload, text = payload.text, options = {}) {
	return prepareSlackReply(payload, options).resolvePreview(text);
}
/** One attempt owns its authored compilation; media captions retain a separate delivery policy. */
function prepareSlackReply(payload, options = {}) {
	const text = payload.text;
	let authoredChunks;
	let structuredContent;
	let materialized;
	let unmaterialized;
	let preview;
	const resolveAuthoredTextChunks = () => authoredChunks ??= markdownToSlackMrkdwnChunks(text?.trim() ?? "", SLACK_SECTION_TEXT_MAX, options);
	const hasStructuredContent = () => structuredContent ??= hasSlackReplyStructuredContent(payload);
	const resolve = (materializeAuthoredText) => materializeAuthoredText ? materialized ??= resolveSlackReplyBlockResolution(payload, {
		...options,
		materializeAuthoredText: true,
		resolveAuthoredTextChunks
	}) : unmaterialized ??= resolveSlackReplyBlockResolution(payload, {
		...options,
		resolveAuthoredTextChunks
	});
	return {
		payload,
		resolveDelivery: () => resolve(!resolveSendableOutboundReplyParts(payload).hasMedia && hasStructuredContent()),
		resolvePreview: (override = text) => {
			if (override !== text) return prepareSlackReply({
				...payload,
				text: override
			}, options).resolvePreview();
			return preview ??= projectSlackReplyRenderPlan(text, resolve(hasStructuredContent()), resolveAuthoredTextChunks);
		}
	};
}
function projectSlackReplyRenderPlan(text, resolution, resolveAuthoredTextChunks) {
	const messages = resolveSlackReplyDeliveryMessages({
		authoredTextPlacement: resolution.authoredTextPlacement,
		segments: resolution.segments,
		text
	});
	if (messages.length <= 1) {
		const [message] = messages;
		const sourceText = resolution.authoredTextPlacement === "none" ? "" : text?.trim() ?? "";
		const blocks = message?.authoredTextPlacement === "blocks" ? addPreviewVerbatimToAuthoredTextBlocks(message.blocks, sourceText ? resolveAuthoredTextChunks() : []) : message?.blocks;
		let renderedText = message?.blocks ? buildSlackCompleteBlocksFallbackText(message.blocks, { includeSelectOptions: true }) : message?.text ?? text ?? "";
		let textIsSlackMrkdwn = Boolean(message && !message.textIsSlackPlainText && (message.authoredTextPlacement !== "outside-blocks" || message.nativeDataFallbackBaseText));
		if (blocks?.length && sourceText) {
			if (hasSlackNativeDataBlock(blocks)) {
				renderedText = appendSlackNativeDataFallbackText(sourceText, blocks) || renderedText;
				textIsSlackMrkdwn = true;
			} else if (message?.authoredTextPlacement === "blocks") {
				renderedText = sourceText;
				textIsSlackMrkdwn = false;
			}
		}
		return {
			mode: "single",
			text: renderedText,
			...blocks ? { blocks } : {},
			...textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {},
			...message?.textIsSlackPlainText ? { textIsSlackPlainText: true } : {}
		};
	}
	const blockPart = messages.find((message) => message.blocks?.length);
	return {
		mode: "split",
		fallbackText: messages.map((message) => message.text).filter(Boolean).join("\n\n"),
		...blockPart ? { blockPart: {
			text: blockPart.text,
			blocks: blockPart.blocks
		} } : {}
	};
}
function readSlackChannelBlocks(payload) {
	return parseSlackBlocksInput(asOptionalRecord(payload.channelData?.slack)?.blocks) ?? [];
}
function hasSlackReplyStructuredContent(payload) {
	return Boolean(readSlackChannelBlocks(payload).length || normalizeMessagePresentation(payload.presentation) || payload.interactive?.blocks.length);
}
function literalSlackComparisonText(text) {
	return /[*_~`]/u.test(text) ? null : escapeSlackMrkdwn(text);
}
function renderSlackRichTextComparisonFragments(value) {
	if (!Array.isArray(value)) return [null];
	return value.map((raw) => {
		const section = asOptionalRecord(raw);
		if (section?.type !== "rich_text_section" && section?.type !== "rich_text_preformatted" || !Array.isArray(section.elements)) return null;
		let text = "";
		let style;
		for (const rawElement of section.elements) {
			const element = asOptionalRecord(rawElement);
			if (element?.type !== "text" || typeof element.text !== "string") return null;
			const styles = Object.entries(asOptionalRecord(element.style) ?? {}).filter(([, enabled]) => enabled !== false);
			const nextStyle = styles[0]?.[0] ?? "";
			if (styles.length > 1 || styles.some(([key, enabled]) => enabled !== true || ![
				"bold",
				"italic",
				"strike",
				"code"
			].includes(key)) || style !== void 0 && nextStyle !== style) return null;
			style = nextStyle;
			text += element.text;
		}
		if (section.type === "rich_text_preformatted") return style || text.includes("```") ? null : "```\n" + escapeSlackMrkdwn(text) + (text.endsWith("\n") ? "" : "\n") + "```";
		if (style === "code") return /[`\r\n]/u.test(text) ? null : "`" + escapeSlackMrkdwn(text) + "`";
		const literal = literalSlackComparisonText(text);
		if (!style || literal === null) return literal;
		if (text.trim() !== text) return null;
		const marker = style === "bold" ? "*" : style === "italic" ? "_" : "~";
		return marker + literal + marker;
	});
}
function renderSlackAuthoredTextFragments(blocks) {
	const readTextObject = (value) => {
		const record = asOptionalRecord(value);
		const text = normalizeOptionalString(record?.text);
		return text === void 0 ? void 0 : record?.type === "mrkdwn" ? text : literalSlackComparisonText(text);
	};
	return blocks.flatMap((block) => {
		const record = asOptionalRecord(block);
		if (block.type === "actions" || block.type === "divider") return [];
		if (block.type === "section" || block.type === "context" || block.type === "header") return (block.type === "context" ? Array.isArray(record?.elements) ? record.elements : [] : [record?.text, ...Array.isArray(record?.fields) ? record.fields : []]).map(readTextObject).filter((text) => text !== void 0);
		if (block.type === "rich_text") return renderSlackRichTextComparisonFragments(record?.elements);
		const text = renderSlackBlockFallbackText(block);
		return text ? [/[*_~`]/u.test(text) ? null : text] : [];
	});
}
function buildSlackAuthoredTextBlocks(chunks) {
	return chunks.map((chunk) => ({
		type: "section",
		text: {
			type: "mrkdwn",
			text: chunk,
			verbatim: true
		}
	}));
}
function addPreviewVerbatimToAuthoredTextBlocks(blocks, authoredTextChunks) {
	if (!blocks?.length || authoredTextChunks.length === 0) return blocks;
	const authoredChunks = new Set(authoredTextChunks);
	return blocks.map((block) => {
		const text = block.text;
		if (block.type !== "section" || text?.type !== "mrkdwn" || typeof text.text !== "string" || !authoredChunks.has(text.text)) return block;
		return {
			...block,
			text: {
				...text,
				verbatim: true
			}
		};
	});
}
function readLastBlockSegment(segments) {
	const last = segments.at(-1);
	return last?.kind === "blocks" ? last.blocks : [];
}
function readAllNativeBlocks(segments) {
	return segments.flatMap((segment) => segment.kind === "blocks" ? segment.blocks : []);
}
function appendTextSegment(segments, text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const last = segments.at(-1);
	if (last?.kind === "text") {
		last.text = `${last.text}\n\n${trimmed}`;
		return;
	}
	segments.push({
		kind: "text",
		text: trimmed
	});
}
function appendBlockSegment(segments, blocks, startNew = false) {
	let shouldStartNew = startNew;
	for (const block of blocks) {
		const last = segments.at(-1);
		if (!shouldStartNew && last?.kind === "blocks" && last.blocks.length < 50) last.blocks.push(block);
		else segments.push({
			kind: "blocks",
			blocks: [block]
		});
		shouldStartNew = false;
	}
}
function resolvePresentationRenderOptions(segments, mode) {
	const allOffsets = resolveSlackBlockOffsets(readAllNativeBlocks(segments), "controls");
	return {
		...mode === "current" ? resolveSlackBlockOffsets(readLastBlockSegment(segments)) : {},
		buttonIndexOffset: allOffsets.buttonIndexOffset,
		selectIndexOffset: allOffsets.selectIndexOffset
	};
}
function appendPresentationPart(segments, presentation, questionOptionIndices) {
	const currentBlocks = readLastBlockSegment(segments);
	for (const mode of ["current", "new-message"]) {
		const rendered = buildSlackPresentationBlocksIfComplete(presentation, {
			...resolvePresentationRenderOptions(segments, mode),
			questionOptionIndices
		});
		const startNew = mode === "new-message";
		if (rendered?.length && (startNew || currentBlocks.length + rendered.length <= 50)) {
			appendBlockSegment(segments, rendered, startNew);
			return;
		}
	}
	appendTextSegment(segments, renderMessagePresentationFallbackText({ presentation }));
}
const SLACK_BUTTON_CONTROL_ACTION_IDS = Object.values(SLACK_BUTTON_ACTION_IDS);
const SLACK_SELECT_CONTROL_ACTION_IDS = Object.values(SLACK_SELECT_ACTION_IDS);
function readGeneratedSlackControlRowKey(block) {
	const record = block;
	if (record.type !== "actions" || typeof record.block_id !== "string") return;
	const expectedElementType = /^openclaw_reply_buttons_[1-9]\d*$/.test(record.block_id) ? "button" : /^openclaw_reply_select_[1-9]\d*$/.test(record.block_id) ? "static_select" : void 0;
	if (!expectedElementType || !Array.isArray(record.elements) || record.elements.length === 0) return;
	const actionIds = expectedElementType === "button" ? SLACK_BUTTON_CONTROL_ACTION_IDS : SLACK_SELECT_CONTROL_ACTION_IDS;
	const elements = record.elements.map((element) => {
		if (!element || typeof element !== "object" || Array.isArray(element)) return;
		const { action_id: actionId, ...content } = element;
		const actionFamily = typeof actionId === "string" ? actionIds.find((candidate) => actionId.startsWith(`${candidate}:`)) : void 0;
		return actionFamily && content.type === expectedElementType ? [actionFamily, content] : void 0;
	});
	return elements.some((element) => element === void 0) ? void 0 : JSON.stringify(elements);
}
function subtractMirroredSlackControlRows(params) {
	const remainingMirrors = /* @__PURE__ */ new Map();
	for (const block of params.presentationBlocks) {
		const key = readGeneratedSlackControlRowKey(block);
		if (key) remainingMirrors.set(key, (remainingMirrors.get(key) ?? 0) + 1);
	}
	return params.interactiveBlocks.filter((block) => {
		const key = readGeneratedSlackControlRowKey(block);
		const remaining = key ? remainingMirrors.get(key) ?? 0 : 0;
		if (!key || remaining === 0) return true;
		remainingMirrors.set(key, remaining - 1);
		return false;
	});
}
function compileSlackReplyBlockSegments(payload, channelBlocks, presentation) {
	const segments = [];
	const textIsFallback = presentation && payload.presentationTextMode === "fallback";
	if (channelBlocks.length > 0) appendBlockSegment(segments, channelBlocks);
	const questionOptionIndices = resolveAskUserQuestionOptionIndices(payload);
	const presentationBlockOffset = readAllNativeBlocks(segments).length;
	if (presentation?.title) appendPresentationPart(segments, {
		title: presentation.title,
		blocks: []
	}, questionOptionIndices);
	for (const block of presentation?.blocks ?? []) appendPresentationPart(segments, { blocks: [block] }, questionOptionIndices);
	const renderedPresentationBlocks = readAllNativeBlocks(segments).slice(presentationBlockOffset);
	const interactiveBlocks = payload.interactive ? buildSlackInteractiveBlocks(payload.interactive, {
		...resolveSlackBlockOffsets(readAllNativeBlocks(segments)),
		questionOptionIndices
	}) : [];
	if (textIsFallback && payload.text?.trim() && renderedPresentationBlocks.every((block) => [
		"header",
		"section",
		"context",
		"divider",
		"rich_text"
	].includes(block.type) && !("accessory" in block && block.accessory))) {
		segments.length = 0;
		appendBlockSegment(segments, channelBlocks);
		appendTextSegment(segments, payload.text);
	}
	appendBlockSegment(segments, subtractMirroredSlackControlRows({
		interactiveBlocks,
		presentationBlocks: renderedPresentationBlocks
	}));
	return segments;
}
/**
* Resolve reply content into transport-order segments. Each blocks segment is
* one Slack message; text segments carry complete fallback content between it.
*/
function resolveSlackReplyBlockResolution(payload, options = {}) {
	const presentation = normalizeMessagePresentation(payload.presentation);
	const authoredText = presentation && payload.presentationTextMode === "fallback" ? void 0 : normalizeOptionalString(payload.text);
	const channelBlocks = readSlackChannelBlocks(payload);
	let segments = compileSlackReplyBlockSegments(payload, channelBlocks, presentation);
	const chunks = authoredText && (segments.length > 0 || options.materializeAuthoredText) ? options.resolveAuthoredTextChunks?.() ?? markdownToSlackMrkdwnChunks(authoredText, 3e3, options) : [];
	let authoredTextPlacement = resolveSlackAuthoredTextPlacement({
		text: authoredText,
		authoredChunks: chunks,
		renderedTextFragments: segments.flatMap((segment) => segment.kind === "text" ? [literalSlackComparisonText(segment.text)] : renderSlackAuthoredTextFragments(segment.blocks))
	});
	if (authoredTextPlacement === "outside-blocks" && !/[*_~`<[\]\\#>|]/u.test(authoredText ?? "")) authoredTextPlacement = resolveSlackAuthoredTextPlacement({
		text: authoredText,
		renderedTextFragments: segments.flatMap((segment) => segment.kind === "text" ? [segment.text] : segment.blocks.map((block) => hasSlackNativeDataBlock([block]) ? renderSlackBlockFallbackText(block, { nativeDataFormat: "plain" }) ?? null : null))
	});
	if (options.materializeAuthoredText && authoredTextPlacement === "outside-blocks") {
		segments = compileSlackReplyBlockSegments(payload, [...channelBlocks, ...buildSlackAuthoredTextBlocks(chunks)], presentation);
		authoredTextPlacement = "blocks";
	}
	return {
		authoredTextPlacement,
		segments
	};
}
/** Return the single-message native shape when no ordered text fallback is required. */
function resolveSlackReplyBlocks(payload) {
	const segments = compileSlackReplyBlockSegments(payload, readSlackChannelBlocks(payload), normalizeMessagePresentation(payload.presentation));
	return segments.length === 1 && segments[0]?.kind === "blocks" ? segments[0].blocks : void 0;
}
export { resolveSlackReplyBlockResolution as a, resolveSlackReplyRenderPlan as c, resolveSlackAuthoredTextPlacement as d, prepareSlackReply as i, buildSlackInteractiveBlocks as l, iterateSlackReplyDeliveryMessages as n, resolveSlackReplyBlocks as o, normalizeSlackReplyPayload as r, resolveSlackReplyDeliveryMessages as s, hasSlackReplyStructuredContent as t, buildSlackPresentationBlocks as u };
