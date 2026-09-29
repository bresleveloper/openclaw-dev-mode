import { C as resolveMessagePresentationButtonAction, c as isMessagePresentationInteractiveBlock, d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, l as legacyInteractiveReplyToPresentation, v as renderMessagePresentationFallbackText } from "./payload-COvcWceu.mjs";
import { l as resolveAskUserQuestionOptionIndex } from "./reply-payload-RBmrGrXG.mjs";
import { h as parseExecApprovalCommandText } from "./exec-approval-reply-Cd667sf7.mjs";
import "./approval-reply-runtime-Cnl3SHaq.mjs";
import { c as hasTelegramApprovalCallbackPrefix, d as sanitizeTelegramCallbackData, n as buildTelegramOpaqueCallbackData, o as buildTelegramApprovalCallbackData, s as fitsTelegramCallbackData, t as buildTelegramNativeCommandCallbackData, u as rewriteTelegramApprovalDecisionAlias } from "./native-command-callback-data-C11bj7rj.mjs";
//#region extensions/telegram/src/question-callback-data.ts
const TELEGRAM_QUESTION_CALLBACK_PREFIXES = ["tgq1:", "tgqo1:"];
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function hasTelegramQuestionCallbackPrefix(data) {
	return TELEGRAM_QUESTION_CALLBACK_PREFIXES.some((prefix) => data?.startsWith(prefix) === true);
}
function buildTelegramQuestionCallbackData(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	const data = `tgq1:${callback.questionId}:${callback.optionIndex}`;
	return fitsTelegramCallbackData(data) ? data : void 0;
}
function buildTelegramQuestionCustomInputCallbackData(questionId) {
	if (!QUESTION_RECORD_ID_PATTERN.test(questionId)) return;
	const data = `tgqo1:${questionId}`;
	return fitsTelegramCallbackData(data) ? data : void 0;
}
function parseTelegramQuestionCallbackData(data) {
	if (!hasTelegramQuestionCallbackPrefix(data) || !data || !fitsTelegramCallbackData(data)) return null;
	const selectMatch = /^tgq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(data);
	if (selectMatch?.[1] && selectMatch[2]) return {
		questionId: selectMatch[1],
		intent: "select",
		optionIndex: Number(selectMatch[2])
	};
	const customInputMatch = /^tgqo1:(ask_[a-f0-9]{32})$/u.exec(data);
	return customInputMatch?.[1] ? {
		questionId: customInputMatch[1],
		intent: "custom-input"
	} : null;
}
//#endregion
//#region extensions/telegram/src/button-types.ts
function appendTelegramDroppedControlFallback(text, controls) {
	const fallback = renderMessagePresentationFallbackText({ presentation: { blocks: [{
		type: "buttons",
		buttons: controls.map((control) => ({
			label: control.label,
			value: "unavailable"
		}))
	}] } });
	if (!fallback || text === fallback || text.endsWith(`\n\n${fallback}`)) return text;
	return [text, fallback].filter(Boolean).join("\n\n");
}
const TELEGRAM_INTERACTIVE_ROW_SIZE = 3;
function toTelegramButtonStyle(style) {
	return style === "danger" || style === "success" || style === "primary" ? style : void 0;
}
function recordDroppedControl(button, options, reason, callbackData) {
	const callbackDataBytes = callbackData ? Buffer.byteLength(callbackData, "utf8") : void 0;
	options?.onDroppedControl?.({
		label: button.label,
		reason: callbackDataBytes !== void 0 && callbackDataBytes > 64 ? "callback_data_too_long" : reason,
		...callbackDataBytes !== void 0 ? { callbackDataBytes } : {}
	});
}
function toTelegramInlineButton(button, options) {
	const style = toTelegramButtonStyle(button.style);
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return recordDroppedControl(button, options, "invalid_action");
	if (action.type === "url") return {
		text: button.label,
		url: action.url,
		style
	};
	if (action.type === "web-app") return options?.allowWebAppButtons === true && action.url ? {
		text: button.label,
		web_app: { url: action.url },
		style
	} : recordDroppedControl(button, options, "web_app_unavailable");
	if (action.type === "approval") {
		const callbackData = buildTelegramApprovalCallbackData(action);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : recordDroppedControl(button, options, "invalid_action");
	}
	if (action.type === "question") {
		const hasQuestionContext = options?.questionOptionIndices?.has(action.questionId) === true;
		if ("intent" in action) {
			const callbackData = hasQuestionContext ? buildTelegramQuestionCustomInputCallbackData(action.questionId) : void 0;
			return callbackData ? {
				text: button.label,
				callback_data: callbackData,
				style
			} : recordDroppedControl(button, options, "question_context_unavailable");
		}
		const optionIndex = resolveAskUserQuestionOptionIndex({
			questionOptionIndices: options?.questionOptionIndices,
			questionId: action.questionId,
			optionValue: action.optionValue
		});
		if (optionIndex === void 0) return recordDroppedControl(button, options, "question_context_unavailable");
		const callbackData = buildTelegramQuestionCallbackData({
			questionId: action.questionId,
			optionIndex
		});
		if (!callbackData) return recordDroppedControl(button, options, "invalid_action");
		return {
			text: button.label,
			callback_data: callbackData,
			style
		};
	}
	if (action.type === "command") {
		const command = rewriteTelegramApprovalDecisionAlias(action.command.trim());
		const nativeCandidate = command ? buildTelegramNativeCommandCallbackData(command) : void 0;
		const callbackData = (nativeCandidate ? sanitizeTelegramCallbackData(nativeCandidate) : void 0) ?? (parseExecApprovalCommandText(command) ? sanitizeTelegramCallbackData(command) : void 0);
		return callbackData ? {
			text: button.label,
			callback_data: callbackData,
			style
		} : recordDroppedControl(button, options, "invalid_action", nativeCandidate);
	}
	const normalizedCallbackValue = action.value.trim();
	const callbackDataCandidate = Boolean(button.action) || hasTelegramApprovalCallbackPrefix(normalizedCallbackValue) || hasTelegramQuestionCallbackPrefix(normalizedCallbackValue) ? buildTelegramOpaqueCallbackData(action.value) : action.value;
	const callbackData = sanitizeTelegramCallbackData(callbackDataCandidate);
	return callbackData ? {
		text: button.label,
		callback_data: callbackData,
		style
	} : recordDroppedControl(button, options, "invalid_action", callbackDataCandidate);
}
function chunkInteractiveButtons(buttons, rows, options) {
	let row = [];
	const flush = () => {
		if (row.length > 0) {
			rows.push(row);
			row = [];
		}
	};
	for (const button of buttons) {
		const rendered = toTelegramInlineButton(button, options);
		if (!rendered) continue;
		if (resolveMessagePresentationButtonAction(button)?.type === "question") {
			flush();
			rows.push([rendered]);
			continue;
		}
		row.push(rendered);
		if (row.length === TELEGRAM_INTERACTIVE_ROW_SIZE) flush();
	}
	flush();
}
/** Convert portable presentation controls to Telegram inline keyboard rows. */
function buildTelegramPresentationButtons(presentation, options) {
	const rows = [];
	for (const block of presentation?.blocks ?? []) {
		if (!isMessagePresentationInteractiveBlock(block)) continue;
		if (block.type === "buttons") {
			chunkInteractiveButtons(block.buttons, rows, options);
			continue;
		}
		chunkInteractiveButtons(block.options.map((option) => ({
			label: option.label,
			action: option.action,
			value: option.value
		})), rows, options);
	}
	return rows.length > 0 ? rows : void 0;
}
/** Resolve Telegram inline buttons, preserving explicit and legacy button precedence. */
function resolveTelegramInlineButtons(params, options) {
	if (params.buttons) return params.buttons;
	const interactive = normalizeLegacyInteractiveReply(params.interactive);
	return buildTelegramPresentationButtons(interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0, options) ?? buildTelegramPresentationButtons(normalizeMessagePresentation(params.presentation), options);
}
function resolveTelegramButtonsFromParams(params, presentation = normalizeMessagePresentation(params.presentation), options) {
	return resolveTelegramInlineButtons({
		presentation,
		interactive: params.interactive
	}, options);
}
function buildTelegramControlDegradation(controls, fallbackDelivered) {
	if (controls.length === 0) return;
	const reasons = [...new Set(controls.map((control) => control.reason))];
	const hasOverflow = reasons.includes("callback_data_too_long");
	return {
		warning: fallbackDelivered ? `Telegram delivered ${controls.length} unencodable control${controls.length === 1 ? "" : "s"} as readable text.` : `Telegram could not deliver ${controls.length} control${controls.length === 1 ? "" : "s"}.`,
		degradedDelivery: {
			droppedControls: controls.length,
			fallback: fallbackDelivered ? "text" : "not_delivered",
			reasons,
			...hasOverflow ? { callbackDataLimitBytes: 64 } : {},
			guidance: hasOverflow ? `Shorten callback data to at most 64 UTF-8 bytes and retry if clickable controls are required.` : "Retry with a supported control action if clickable controls are required."
		}
	};
}
//#endregion
export { resolveTelegramInlineButtons as a, resolveTelegramButtonsFromParams as i, buildTelegramControlDegradation as n, hasTelegramQuestionCallbackPrefix as o, buildTelegramPresentationButtons as r, parseTelegramQuestionCallbackData as s, appendTelegramDroppedControlFallback as t };
