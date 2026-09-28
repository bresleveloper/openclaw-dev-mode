import { B as SLACK_REPLY_LINK_ACTION_ID, C as buildSlackBlocksFallbackText, F as SLACK_CALLBACK_BUTTON_ACTION_ID, I as SLACK_CALLBACK_SELECT_ACTION_ID, J as markdownToSlackMrkdwnChunks, L as SLACK_QUESTION_BUTTON_ACTION_ID, N as SLACK_APPROVAL_BUTTON_ACTION_ID, P as SLACK_APPROVAL_SELECT_ACTION_ID, Q as hasSlackDataVisualizationBlock, T as renderSlackBlockFallbackText, V as SLACK_REPLY_SELECT_ACTION_ID, X as buildSlackDataVisualizationBlock, Z as canRenderSlackDataVisualization, ct as parseSlackBlocksInput, et as buildSlackDataTableBlock, g as buildSlackNativeDataAccessibilityText, it as renderSlackMessagePresentationChartFallbackText, j as truncateSlackText, m as appendSlackNativeDataFallbackText, nt as countSlackDataTableCellCharacters, q as chunkSlackMrkdwnText, rt as resolveSlackDataTableCellCharacterCount, tt as countSlackDataTableBlocksCellCharacters, v as hasSlackNativeDataBlock, w as buildSlackCompleteBlocksFallbackText, z as SLACK_REPLY_BUTTON_ACTION_ID } from "./session-status-Cf7AvWOt.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { legacyInteractiveReplyToPresentation, normalizeMessagePresentation, renderMessagePresentationFallbackText, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { parseExecApprovalCommandText } from "openclaw/plugin-sdk/approval-reply-runtime";
import { resolveAskUserQuestionOptionIndex, resolveAskUserQuestionOptionIndices, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
const SLACK_BUTTON_VALUE_MAX = 2e3;
const SLACK_SECTION_TEXT_MAX = 3e3;
const SLACK_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	charts: true,
	tables: true,
	limits: {
		actions: {
			maxActionsPerRow: 25,
			maxValueBytes: SLACK_BUTTON_VALUE_MAX,
			supportsStyles: true
		},
		selects: {
			maxOptions: 100,
			maxValueBytes: 150
		},
		text: {
			encoding: "characters",
			markdownDialect: "slack-mrkdwn",
			supportsEdit: true
		}
	}
};
//#endregion
//#region extensions/slack/src/approval-actions.ts
const SLACK_APPROVAL_VALUE_PREFIX = "openclaw:approval:v1:";
const SLACK_APPROVAL_HEADER_BLOCK_ID = "openclaw_approval_header";
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
/** Encode portable approval facts without exposing a slash command to Slack callbacks. */
function encodeSlackApprovalAction(action) {
	const encode = (approvalId) => `${SLACK_APPROVAL_VALUE_PREFIX}${JSON.stringify({
		approvalId,
		approvalKind: action.approvalKind,
		decision: action.decision
	})}`;
	const exact = encode(action.approvalId);
	return exact.length <= 2e3 ? exact : encode(buildApprovalResolutionRef({
		approvalId: action.approvalId,
		approvalKind: action.approvalKind
	}));
}
/** Decode only the exact Slack-owned approval envelope. Malformed callbacks fail closed. */
function decodeSlackApprovalAction(value) {
	if (typeof value !== "string" || !value.startsWith(SLACK_APPROVAL_VALUE_PREFIX)) return null;
	try {
		const decoded = JSON.parse(value.slice(21));
		if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;
		const record = decoded;
		if (Object.keys(record).length !== 3 || typeof record.approvalId !== "string" || record.approvalId.length === 0 || record.approvalKind !== "exec" && record.approvalKind !== "plugin" && record.approvalKind !== "system-agent" || !isApprovalDecision(record.decision)) return null;
		return {
			type: "approval",
			approvalId: record.approvalId,
			approvalKind: record.approvalKind,
			decision: record.decision
		};
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/slack/src/question-actions.ts
const SLACK_QUESTION_VALUE_PREFIX = "slq1:";
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function encodeSlackQuestionAction(action) {
	if (!QUESTION_RECORD_ID_PATTERN.test(action.questionId) || !Number.isInteger(action.optionIndex) || action.optionIndex < 0 || action.optionIndex > 3) return;
	const value = `${SLACK_QUESTION_VALUE_PREFIX}${action.questionId}:${action.optionIndex}`;
	return value.length <= 2e3 ? value : void 0;
}
function decodeSlackQuestionAction(value) {
	if (typeof value !== "string" || value.length > 2e3) return null;
	const match = /^slq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(value);
	return match?.[1] && match[2] ? {
		questionId: match[1],
		optionIndex: Number(match[2])
	} : null;
}
async function resolveSlackQuestionAction(params) {
	let result;
	try {
		result = await (params.resolveQuestion ?? questionGatewayRuntime.resolveOption)({
			cfg: params.cfg,
			questionId: params.action.questionId,
			optionIndex: params.action.optionIndex,
			senderId: params.userId,
			clientDisplayName: `Slack question (${params.accountId})`
		});
	} catch {
		await params.respond("Could not submit this answer.").catch(() => {});
		return;
	}
	await params.respond(result.status === "answered" ? "Answer submitted." : "This question was already answered.").catch(() => {});
}
//#endregion
//#region extensions/slack/src/blocks-render.ts
const SLACK_BUTTON_URL_MAX = 3e3;
function buildSlackReplyButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_REPLY_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackReplyLinkActionId(buttonIndex, choiceIndex) {
	return `${SLACK_REPLY_LINK_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackReplySelectActionId(selectIndex) {
	return `${SLACK_REPLY_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackApprovalButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_APPROVAL_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackApprovalSelectActionId(selectIndex) {
	return `${SLACK_APPROVAL_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackCallbackButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_CALLBACK_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackCallbackSelectActionId(selectIndex) {
	return `${SLACK_CALLBACK_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackQuestionButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_QUESTION_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function resolveSlackButtonStyle(style) {
	if (style === "primary" || style === "danger") return style;
	if (style === "success") return "primary";
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
function resolveSlackButtonTarget(button, questionOptionIndices) {
	if (button.action !== void 0) {
		const action = resolveMessagePresentationButtonAction(button);
		return action ? resolveSlackActionTarget(action, questionOptionIndices) : void 0;
	}
	const legacyUrl = normalizeOptionalString(button.url ?? button.webApp?.url ?? button.web_app?.url);
	if (legacyUrl && isWithinSlackLimit(legacyUrl, SLACK_BUTTON_URL_MAX)) return {
		kind: "link",
		url: legacyUrl
	};
	const legacyValue = normalizeOptionalString(button.value);
	if (legacyValue) return {
		kind: "reply",
		value: legacyValue
	};
	return legacyUrl ? {
		kind: "link",
		url: legacyUrl
	} : void 0;
}
function isSlackTextFallbackButton(button) {
	const action = resolveMessagePresentationButtonAction(button);
	return action?.type === "question" && "intent" in action && action.intent === "custom-input";
}
function resolveSlackOptionTarget(option) {
	if (option.action !== void 0) {
		const action = resolveMessagePresentationOptionAction(option);
		const target = action ? resolveSlackActionTarget(action) : void 0;
		return target?.kind === "link" || target?.kind === "question" ? void 0 : target;
	}
	const value = normalizeOptionalString(option.value);
	return value ? {
		kind: "reply",
		value
	} : void 0;
}
function isWithinSlackLimit(value, maxLength) {
	return value.length <= maxLength;
}
function isRenderableSlackOption(option) {
	return isWithinSlackLimit(option.value, 150);
}
function readSlackBlockId(block) {
	const value = block.block_id;
	return typeof value === "string" ? value : void 0;
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
		const blockId = readSlackBlockId(block);
		if (!blockId) continue;
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
/** Render portable presentation blocks as Slack Block Kit blocks. */
function buildSlackPresentationBlocks(presentation, options = {}) {
	if (!presentation) return [];
	const renderTablesNatively = canRenderSlackPresentationTables(presentation, options);
	const blocks = [];
	if (presentation.title) blocks.push({
		type: "header",
		text: {
			type: "plain_text",
			text: truncateSlackText(presentation.title, 150),
			emoji: true
		}
	});
	let buttonIndex = options.buttonIndexOffset ?? 0;
	let dataTableCellCharacterCount = options.dataTableCellCharacterCountOffset ?? 0;
	let dataVisualizationCount = options.dataVisualizationCountOffset ?? 0;
	let selectIndex = options.selectIndexOffset ?? 0;
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
		if (block.type === "buttons") {
			const rendered = buildSlackPresentationButtonBlock(block, buttonIndex + 1, options.questionOptionIndices);
			if (rendered) {
				buttonIndex += 1;
				blocks.push(rendered);
			}
			continue;
		}
		if (block.type === "chart") {
			const rendered = dataVisualizationCount < 2 ? buildSlackPresentationChartBlock(block) : void 0;
			if (rendered) {
				dataVisualizationCount += 1;
				blocks.push(rendered);
			} else {
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
			if (!renderTablesNatively) continue;
			const rendered = buildSlackDataTableBlock(block, { cellCharacterCountOffset: dataTableCellCharacterCount });
			if (rendered) {
				dataTableCellCharacterCount += countSlackDataTableCellCharacters(rendered);
				blocks.push(rendered);
			}
			continue;
		}
		if (block.type === "select") {
			const rendered = buildSlackPresentationSelectBlock(block, selectIndex + 1);
			if (rendered) {
				selectIndex += 1;
				blocks.push(rendered);
			}
		}
	}
	return blocks;
}
function buildSlackPresentationChartBlock(block) {
	return buildSlackDataVisualizationBlock(block);
}
function buildSlackPresentationButtonBlock(block, buttonIndex, questionOptionIndices) {
	const elements = block.buttons.flatMap((button, choiceIndex) => {
		const target = resolveSlackButtonTarget(button, questionOptionIndices);
		if (!target || (target.kind === "link" ? !isWithinSlackLimit(target.url, SLACK_BUTTON_URL_MAX) : !isWithinSlackLimit(target.value, 2e3))) return [];
		const style = resolveSlackButtonStyle(button.style);
		return [{
			type: "button",
			action_id: target.kind === "link" ? buildSlackReplyLinkActionId(buttonIndex, choiceIndex) : target.kind === "approval" ? buildSlackApprovalButtonActionId(buttonIndex, choiceIndex) : target.kind === "callback" ? buildSlackCallbackButtonActionId(buttonIndex, choiceIndex) : target.kind === "question" ? buildSlackQuestionButtonActionId(buttonIndex, choiceIndex) : buildSlackReplyButtonActionId(buttonIndex, choiceIndex),
			text: {
				type: "plain_text",
				text: truncateSlackText(button.label, 75),
				emoji: true
			},
			...target.kind === "link" ? { url: target.url } : { value: target.value },
			...style ? { style } : {}
		}];
	}).slice(0, 25);
	return elements.length > 0 ? {
		type: "actions",
		block_id: `openclaw_reply_buttons_${buttonIndex}`,
		elements
	} : void 0;
}
/** True when every portable table fits Slack's native per-message table budget. */
function canRenderSlackPresentationTables(presentation, options = {}) {
	let cellCharacterCount = options.dataTableCellCharacterCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type !== "table") continue;
		const tableCellCharacterCount = resolveSlackDataTableCellCharacterCount(block, { cellCharacterCountOffset: cellCharacterCount });
		if (tableCellCharacterCount === void 0) return false;
		cellCharacterCount += tableCellCharacterCount;
	}
	return true;
}
/** True when native Slack rendering preserves every portable control. */
function canRenderSlackPresentation(presentation, options = {}) {
	if (presentation.title && !isWithinSlackLimit(presentation.title.trim(), 150)) return false;
	if (!canRenderSlackPresentationTables(presentation, options)) return false;
	let dataVisualizationCount = options.dataVisualizationCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") continue;
		if (block.type === "buttons") {
			let nativeButtonCount = 0;
			if (!(block.buttons.every((button) => {
				if (isSlackTextFallbackButton(button)) return true;
				nativeButtonCount += 1;
				if (!isWithinSlackLimit(button.label, 75)) return false;
				const target = resolveSlackButtonTarget(button, options.questionOptionIndices);
				return target ? target.kind === "link" ? isWithinSlackLimit(target.url, SLACK_BUTTON_URL_MAX) : isWithinSlackLimit(target.value, 2e3) : false;
			}) && nativeButtonCount <= 25)) return false;
			continue;
		}
		if (block.type === "select") {
			if (!(isWithinSlackLimit(normalizeOptionalString(block.placeholder) ?? "Choose an option", 75) && block.options.length <= 100 && (!block.placeholder || isWithinSlackLimit(block.placeholder, 75)) && block.options.every((option) => {
				if (!isWithinSlackLimit(option.label, 75)) return false;
				const target = resolveSlackOptionTarget(option);
				return target ? isRenderableSlackOption({
					label: option.label,
					...target
				}) : false;
			}) && new Set(block.options.map((option) => resolveSlackOptionTarget(option)?.kind)).size === 1)) return false;
			continue;
		}
		if (block.type === "chart") {
			if (dataVisualizationCount >= 2 || !canRenderSlackDataVisualization(block)) return false;
			dataVisualizationCount += 1;
			continue;
		}
		if (block.type === "table") continue;
	}
	return true;
}
function buildSlackPresentationSelectBlock(block, selectIndex) {
	const options = block.options.flatMap((option) => {
		const target = resolveSlackOptionTarget(option);
		return target ? [{
			label: option.label,
			...target
		}] : [];
	}).filter(isRenderableSlackOption).slice(0, 100);
	const optionKinds = new Set(options.map((option) => option.kind));
	return options.length > 0 && optionKinds.size === 1 ? {
		type: "actions",
		block_id: `openclaw_reply_select_${selectIndex}`,
		elements: [{
			type: "static_select",
			action_id: options[0]?.kind === "approval" ? buildSlackApprovalSelectActionId(selectIndex) : options[0]?.kind === "callback" ? buildSlackCallbackSelectActionId(selectIndex) : buildSlackReplySelectActionId(selectIndex),
			placeholder: {
				type: "plain_text",
				text: truncateSlackText(normalizeOptionalString(block.placeholder) ?? "Choose an option", 75),
				emoji: true
			},
			options: options.map((option) => ({
				text: {
					type: "plain_text",
					text: truncateSlackText(option.label, 75),
					emoji: true
				},
				value: option.value
			}))
		}]
	} : void 0;
}
//#endregion
//#region extensions/slack/src/authored-text.ts
function normalizeComparableSlackText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isSlackAuthoredTextRepresentedInInteractive(text, interactive) {
	return isSlackAuthoredTextRepresentedInFragments(text, interactive?.blocks.flatMap((block) => block.type === "text" ? [block.text] : []) ?? []);
}
function isSlackAuthoredTextRepresentedInFragments(text, rawFragments) {
	const target = normalizeComparableSlackText(text);
	const fragments = rawFragments.map(normalizeComparableSlackText).filter(Boolean);
	let remainingLength = fragments.reduce((length, fragment) => length + fragment.length + 1, -1);
	for (const [start, firstFragment] of fragments.entries()) {
		if (remainingLength < target.length) break;
		remainingLength -= firstFragment.length + 1;
		let offset = 0;
		for (let end = start;; end += 1) {
			const fragment = fragments[end];
			if (fragment === void 0 || !target.startsWith(fragment, offset)) break;
			offset += fragment.length;
			if (offset === target.length) return true;
			if (target[offset] !== " ") break;
			offset += 1;
		}
	}
	return false;
}
/** Resolve placement from producer facts, before accessibility text changes the payload text. */
function resolveSlackAuthoredTextPlacement(params) {
	const text = normalizeOptionalString(params.text);
	if (!text) return "none";
	return params.renderedInBlocks || isSlackAuthoredTextRepresentedInFragments(text, params.renderedTextFragments ?? []) || isSlackAuthoredTextRepresentedInInteractive(text, params.interactive) ? "blocks" : "outside-blocks";
}
//#endregion
//#region extensions/slack/src/reply-blocks.ts
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
function parseSlackReplyBlockSegments(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Slack rendered presentation segments must be an array");
	return value.map((raw) => {
		if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Slack rendered presentation segment must be an object");
		const segment = raw;
		if (segment.kind === "text" && typeof segment.text === "string" && segment.mrkdwn === false) return {
			kind: "text",
			text: segment.text,
			mrkdwn: false
		};
		if (segment.kind === "blocks") {
			const blocks = parseSlackBlocksInput(segment.blocks);
			if (blocks?.length) return {
				kind: "blocks",
				blocks
			};
		}
		throw new Error("Slack rendered presentation segment is invalid");
	});
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
function resolveSlackReplyRenderPlan(payload, text = payload.text) {
	return prepareSlackReply(payload).resolvePreview(text);
}
/** One attempt owns its authored compilation; media captions retain a separate delivery policy. */
function prepareSlackReply(payload) {
	const text = payload.text;
	const source = {
		...payload,
		text
	};
	let authoredChunks;
	let structuredContent;
	let materialized;
	let unmaterialized;
	let preview;
	const resolveAuthoredTextChunks = () => authoredChunks ??= markdownToSlackMrkdwnChunks(text?.trim() ?? "", SLACK_SECTION_TEXT_MAX);
	const hasStructuredContent = () => structuredContent ??= hasSlackReplyStructuredContent(source);
	const resolve = (materializeAuthoredText) => materializeAuthoredText ? materialized ??= resolveSlackReplyBlockResolution(source, {
		materializeAuthoredText: true,
		resolveAuthoredTextChunks
	}) : unmaterialized ??= resolveSlackReplyBlockResolution(source);
	return {
		payload,
		resolveDelivery: () => resolve(!resolveSendableOutboundReplyParts(source).hasMedia && hasStructuredContent()),
		resolvePreview: (override = text) => {
			if (override !== text) return prepareSlackReply({
				...source,
				text: override
			}).resolvePreview();
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
	const slackData = payload.channelData?.slack;
	if (!slackData || typeof slackData !== "object" || Array.isArray(slackData)) return [];
	return parseSlackBlocksInput(slackData.blocks) ?? [];
}
function hasSlackReplyStructuredContent(payload) {
	return Boolean(readSlackChannelBlocks(payload).length || normalizeMessagePresentation(payload.presentation) || payload.interactive?.blocks.length);
}
function renderSlackAuthoredTextFragments(blocks) {
	return blocks.flatMap((block) => {
		if (block.type === "actions") return [];
		const text = renderSlackBlockFallbackText(block, { nativeDataFormat: "plain" });
		return text ? [text] : [];
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
		text: trimmed,
		mrkdwn: false
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
function renderNativePresentation(presentation, options) {
	if (!canRenderSlackPresentation(presentation, options)) return;
	const blocks = buildSlackPresentationBlocks(presentation, options);
	return blocks.length > 0 ? blocks : void 0;
}
function appendPresentationPart(segments, presentation, questionOptionIndices) {
	const currentBlocks = readLastBlockSegment(segments);
	const currentRendered = renderNativePresentation(presentation, {
		...resolvePresentationRenderOptions(segments, "current"),
		questionOptionIndices
	});
	if (currentRendered && currentBlocks.length + currentRendered.length <= 50) {
		appendBlockSegment(segments, currentRendered);
		return;
	}
	const freshRendered = renderNativePresentation(presentation, {
		...resolvePresentationRenderOptions(segments, "new-message"),
		questionOptionIndices
	});
	if (freshRendered) {
		appendBlockSegment(segments, freshRendered, true);
		return;
	}
	appendTextSegment(segments, renderMessagePresentationFallbackText({ presentation }));
}
const SLACK_BUTTON_CONTROL_ACTION_IDS = [
	SLACK_APPROVAL_BUTTON_ACTION_ID,
	SLACK_CALLBACK_BUTTON_ACTION_ID,
	SLACK_QUESTION_BUTTON_ACTION_ID,
	SLACK_REPLY_BUTTON_ACTION_ID,
	SLACK_REPLY_LINK_ACTION_ID
];
const SLACK_SELECT_CONTROL_ACTION_IDS = [
	SLACK_APPROVAL_SELECT_ACTION_ID,
	SLACK_CALLBACK_SELECT_ACTION_ID,
	SLACK_REPLY_SELECT_ACTION_ID
];
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
/**
* Resolve reply content into transport-order segments. Each blocks segment is
* one Slack message; text segments carry complete fallback content between it.
*/
function resolveSlackReplyBlockResolution(payload, options = {}) {
	const segments = [];
	const presentation = normalizeMessagePresentation(payload.presentation);
	const textIsFallback = presentation && payload.presentationTextMode === "fallback";
	const authoredText = textIsFallback ? void 0 : payload.text;
	const channelBlocks = readSlackChannelBlocks(payload);
	let compiledChannelBlocks = channelBlocks;
	let authoredTextKnownInBlocks = false;
	if (options.materializeAuthoredText) {
		const rawTextFragments = renderSlackAuthoredTextFragments(channelBlocks);
		const initialPlacement = resolveSlackAuthoredTextPlacement({
			text: authoredText,
			interactive: payload.interactive,
			renderedTextFragments: rawTextFragments
		});
		authoredTextKnownInBlocks = initialPlacement === "blocks";
		const text = normalizeOptionalString(authoredText);
		if (text && initialPlacement === "outside-blocks") {
			const textBlocks = buildSlackAuthoredTextBlocks(options.resolveAuthoredTextChunks?.() ?? markdownToSlackMrkdwnChunks(text, 3e3));
			if (resolveSlackAuthoredTextPlacement({
				text: renderSlackAuthoredTextFragments(textBlocks).join(" "),
				renderedTextFragments: rawTextFragments
			}) !== "blocks") compiledChannelBlocks = [...channelBlocks, ...textBlocks];
			authoredTextKnownInBlocks = true;
		}
	}
	if (compiledChannelBlocks.length > 0) appendBlockSegment(segments, compiledChannelBlocks);
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
		appendBlockSegment(segments, compiledChannelBlocks);
		appendTextSegment(segments, payload.text);
	}
	appendBlockSegment(segments, subtractMirroredSlackControlRows({
		interactiveBlocks,
		presentationBlocks: renderedPresentationBlocks
	}));
	const renderedTextFragments = segments.flatMap((segment) => {
		if (segment.kind === "text") return [segment.text];
		return renderSlackAuthoredTextFragments(segment.blocks);
	});
	const authoredTextPlacement = resolveSlackAuthoredTextPlacement({
		text: authoredText,
		interactive: payload.interactive,
		renderedTextFragments
	});
	return {
		authoredTextPlacement: authoredTextKnownInBlocks ? "blocks" : authoredTextPlacement,
		segments
	};
}
/** Return the single-message native shape when no ordered text fallback is required. */
function resolveSlackReplyBlocks(payload) {
	const { segments } = resolveSlackReplyBlockResolution(payload);
	return segments.length === 1 && segments[0]?.kind === "blocks" ? segments[0].blocks : void 0;
}
//#endregion
export { decodeSlackApprovalAction as _, prepareSlackReply as a, resolveSlackReplyDeliveryMessages as c, buildSlackInteractiveBlocks as d, buildSlackPresentationBlocks as f, SLACK_APPROVAL_HEADER_BLOCK_ID as g, resolveSlackQuestionAction as h, parseSlackReplyBlockSegments as i, resolveSlackReplyRenderPlan as l, decodeSlackQuestionAction as m, iterateSlackReplyDeliveryMessages as n, resolveSlackReplyBlockResolution as o, canRenderSlackPresentation as p, normalizeSlackReplyPayload as r, resolveSlackReplyBlocks as s, hasSlackReplyStructuredContent as t, resolveSlackAuthoredTextPlacement as u, SLACK_PRESENTATION_CAPABILITIES as v, SLACK_SECTION_TEXT_MAX as y };
