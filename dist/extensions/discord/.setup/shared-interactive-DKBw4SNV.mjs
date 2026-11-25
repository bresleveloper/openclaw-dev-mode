import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { i as parseCustomId } from "./components.base-C5sAPHe4.mjs";
import { readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveAskUserQuestionOptionIndex } from "openclaw/plugin-sdk/reply-payload";
import { legacyInteractiveReplyToPresentation, resolveMessagePresentationActionValue, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
// extensions/discord/src/custom-id-codec.ts
/**
* URI-component codec for values embedded in `k=v;` custom-id grammars
* (exec approvals, model picker, command args, agent components).
* Decode falls back to the raw value: Discord redelivers old component ids
* indefinitely and historical values may predate strict encoding.
*/
const encodeCustomIdComponent = encodeURIComponent;
function decodeCustomIdComponent(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
/**
* Minimal field escape for the versioned `occomp`/`ocmodal` grammar: only `%`
* and the `;` field separator are escaped to preserve the 100-char custom-id
* budget. The wire format is versioned (`e=1`); do not swap this for the URI
* codec — in-flight component ids must keep decoding byte-exactly.
*/
function escapeCustomIdFieldValue(value) {
	return value.replace(/%/g, "%25").replace(/;/g, "%3B");
}
function needsCustomIdFieldEscaping(value) {
	return /[%;]/.test(value);
}
function unescapeCustomIdFieldValue(value) {
	return value.replace(/%(25|3B)/gi, (match) => match.toLowerCase() === "%25" ? "%" : ";");
}
// extensions/discord/src/component-custom-id.ts
const DISCORD_COMPONENT_CUSTOM_ID_KEY = "occomp";
const DISCORD_MODAL_CUSTOM_ID_KEY = "ocmodal";
const DISCORD_ACTIVITY_CUSTOM_ID_KEY = "ocactivity";
const ENCODED_CUSTOM_ID_VERSION = "1";
const DISCORD_ACTIVITY_CUSTOM_ID_PREFIX = `${DISCORD_ACTIVITY_CUSTOM_ID_KEY}${ENCODED_CUSTOM_ID_VERSION}_`;
function isValidDiscordActivityWidgetId(widgetId) {
	return /^[A-Za-z0-9_-]{22}$/.test(widgetId);
}
function buildDiscordActivityCustomId(widgetId) {
	return `${DISCORD_ACTIVITY_CUSTOM_ID_PREFIX}${widgetId}`;
}
function parseDiscordActivityCustomId(id) {
	if (id.startsWith(DISCORD_ACTIVITY_CUSTOM_ID_PREFIX)) {
		const widgetId = id.slice(DISCORD_ACTIVITY_CUSTOM_ID_PREFIX.length);
		return isValidDiscordActivityWidgetId(widgetId) ? { widgetId } : null;
	}
	const parsed = parseCustomId(id);
	if (parsed.key !== DISCORD_ACTIVITY_CUSTOM_ID_KEY || parsed.data.v !== ENCODED_CUSTOM_ID_VERSION || typeof parsed.data.wid !== "string" || !isValidDiscordActivityWidgetId(parsed.data.wid)) return null;
	return { widgetId: parsed.data.wid };
}
function parseDiscordActivityCustomIdForInteraction(id) {
	const parsed = parseDiscordActivityCustomId(id);
	return parsed ? {
		key: DISCORD_ACTIVITY_CUSTOM_ID_KEY,
		data: { widgetId: parsed.widgetId }
	} : parseCustomId(id);
}
function decodeParsedCustomIdData(data) {
	if (data.e !== ENCODED_CUSTOM_ID_VERSION) return data;
	return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, typeof value === "string" ? unescapeCustomIdFieldValue(value) : value]));
}
function buildDiscordFieldCustomId(key, fields) {
	const encoded = Object.values(fields).some(needsCustomIdFieldEscaping);
	const parts = Object.entries(fields).map(([name, value]) => `${name}=${encoded ? escapeCustomIdFieldValue(value) : value}`);
	return (encoded ? `${key}:e=${ENCODED_CUSTOM_ID_VERSION};` : `${key}:`) + parts.join(";");
}
function buildDiscordComponentCustomId(params) {
	return buildDiscordFieldCustomId(DISCORD_COMPONENT_CUSTOM_ID_KEY, {
		cid: params.componentId,
		...params.modalId ? { mid: params.modalId } : {}
	});
}
function buildDiscordModalCustomId(modalId) {
	return buildDiscordFieldCustomId(DISCORD_MODAL_CUSTOM_ID_KEY, { mid: modalId });
}
function parseDiscordComponentCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "occomp") return null;
	const data = decodeParsedCustomIdData(parsed.data);
	const componentId = readNonBlankString(data.cid);
	if (!componentId) return null;
	return {
		componentId,
		modalId: readNonBlankString(data.mid)
	};
}
function parseDiscordModalCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "ocmodal") return null;
	return readNonBlankString(decodeParsedCustomIdData(parsed.data).mid) ?? null;
}
function parseDiscordCustomIdForInteraction(id, key) {
	if (id === "*" || /^__openclaw_discord_component_[a-z_]+_wildcard__$/.test(id)) return {
		key: "*",
		data: {}
	};
	const parsed = parseCustomId(id);
	if (parsed.key !== key) return parsed;
	return {
		key: "*",
		data: decodeParsedCustomIdData(parsed.data)
	};
}
function parseDiscordComponentCustomIdForInteraction(id) {
	return parseDiscordCustomIdForInteraction(id, DISCORD_COMPONENT_CUSTOM_ID_KEY);
}
function parseDiscordModalCustomIdForInteraction(id) {
	return parseDiscordCustomIdForInteraction(id, DISCORD_MODAL_CUSTOM_ID_KEY);
}
// extensions/discord/src/approval-custom-id.ts
const DISCORD_APPROVAL_DECISIONS = {
	"allow-once": {
		label: "Allowed (once)",
		color: "#57F287"
	},
	"allow-always": {
		label: "Allowed (always)",
		color: "#5865F2"
	},
	deny: {
		label: "Denied",
		color: "#ED4245"
	}
};
const DISCORD_APPROVAL_CUSTOM_ID_MAX_CHARS = 100;
function encodeDiscordApprovalCustomId(action) {
	return `execapproval:kind=${action.approvalKind};id=${encodeURIComponent(action.approvalId)};action=${action.decision}`;
}
function encodeBoundedDiscordApprovalCustomId(action) {
	const exact = encodeDiscordApprovalCustomId(action);
	if (exact.length <= DISCORD_APPROVAL_CUSTOM_ID_MAX_CHARS) return exact;
	return encodeDiscordApprovalCustomId({
		...action,
		approvalId: buildApprovalResolutionRef({
			approvalId: action.approvalId,
			approvalKind: action.approvalKind
		})
	});
}
function buildDiscordApprovalCustomId(action) {
	if (!action.approvalId || action.approvalKind !== "exec" && action.approvalKind !== "plugin" && action.approvalKind !== "system-agent" || action.decision !== "allow-once" && action.decision !== "allow-always" && action.decision !== "deny") return;
	return encodeBoundedDiscordApprovalCustomId(action);
}
function buildExecApprovalCustomId(approvalId, approvalKind, decision) {
	return encodeBoundedDiscordApprovalCustomId({
		type: "approval",
		approvalId,
		approvalKind,
		decision
	});
}
function parseExecApprovalData(data) {
	if (!data || typeof data !== "object") return null;
	const coerce = (value) => typeof value === "string" || typeof value === "number" ? String(value) : "";
	const rawId = coerce(data.id);
	const rawKind = coerce(data.kind);
	const rawAction = coerce(data.action);
	if (!rawId || rawKind !== "exec" && rawKind !== "plugin" && rawKind !== "system-agent") return null;
	if (rawAction !== "allow-once" && rawAction !== "allow-always" && rawAction !== "deny") return null;
	let approvalId;
	try {
		approvalId = decodeURIComponent(rawId);
	} catch {
		return null;
	}
	if (!approvalId) return null;
	return {
		approvalId,
		approvalKind: rawKind,
		action: rawAction
	};
}
// extensions/discord/src/question-custom-id.ts
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function buildDiscordQuestionCustomId(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	return `ocq:id=${callback.questionId};i=${callback.optionIndex}`;
}
function parseDiscordQuestionData(data) {
	const questionId = typeof data.id === "string" ? data.id : "";
	const rawIndex = typeof data.i === "string" ? data.i : typeof data.i === "number" ? String(data.i) : "";
	if (!QUESTION_RECORD_ID_PATTERN.test(questionId) || !/^[0-3]$/u.test(rawIndex)) return null;
	return {
		questionId,
		optionIndex: Number(rawIndex)
	};
}
// extensions/discord/src/shared-interactive.ts
var shared_interactive_exports = /* @__PURE__ */ __exportAll({
	buildDiscordInteractiveComponents: () => buildDiscordInteractiveComponents,
	buildDiscordPresentationComponents: () => buildDiscordPresentationComponents
});
const DISCORD_INTERACTIVE_BUTTON_ROW_SIZE = 5;
function buildDiscordButtonComponent(button, options) {
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return;
	const component = {
		label: button.label,
		style: button.style ?? "secondary",
		...button.disabled === true ? { disabled: true } : {}
	};
	if (action.type === "approval") {
		const internalCustomId = buildDiscordApprovalCustomId(action);
		return internalCustomId ? {
			...component,
			internalCustomId
		} : void 0;
	}
	if (action.type === "question") {
		if ("intent" in action) return;
		const optionIndex = resolveAskUserQuestionOptionIndex({
			questionOptionIndices: options.questionOptionIndices,
			questionId: action.questionId,
			optionValue: action.optionValue
		});
		if (optionIndex === void 0) return;
		const internalCustomId = buildDiscordQuestionCustomId({
			questionId: action.questionId,
			optionIndex
		});
		return internalCustomId ? {
			...component,
			internalCustomId
		} : void 0;
	}
	if (action.type === "web-app" && action.widgetId && isValidDiscordActivityWidgetId(action.widgetId)) component.internalCustomId = buildDiscordActivityCustomId(action.widgetId);
	else if (action.type === "url" || action.type === "web-app") {
		if (action.type === "web-app" && !action.url) return;
		component.style = "link";
		component.url = action.url;
	} else {
		component.callbackData = action.type === "command" ? action.command : action.value;
		if (button.action?.type === "command" || button.action?.type === "callback") component.callbackDataKind = button.action.type;
	}
	if (button.reusable === true) component.reusable = true;
	return component;
}
function appendDiscordSelectBlock(blocks, block) {
	const options = [];
	let callbackDataKind;
	for (const option of block.options) {
		const value = resolveMessagePresentationActionValue(resolveMessagePresentationOptionAction(option));
		if (!value) continue;
		const kind = option.action?.type;
		if (kind !== void 0 && kind !== "command" && kind !== "callback" || options.length > 0 && callbackDataKind !== kind) return;
		callbackDataKind = kind;
		options.push({
			label: option.label,
			value
		});
	}
	if (options.length === 0) return;
	blocks.push({
		type: "actions",
		select: {
			type: "string",
			placeholder: block.placeholder,
			options,
			callbackDataKind
		}
	});
}
/**
* @deprecated Use buildDiscordPresentationComponents with MessagePresentation.
*/
function buildDiscordInteractiveComponents(interactive, options = {}) {
	return buildDiscordPresentationComponents(interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0, options);
}
function buildDiscordPresentationComponents(presentation, options = {}) {
	if (!presentation) return;
	const blocks = [];
	if (presentation.title) blocks.push({
		type: "text",
		text: presentation.title
	});
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			const text = block.text;
			if (text) blocks.push({
				type: "text",
				text: block.type === "context" ? `-# ${text}` : text
			});
			continue;
		}
		if (block.type === "divider") {
			blocks.push({ type: "separator" });
			continue;
		}
		if (block.type === "buttons") {
			const components = block.buttons.flatMap((button) => {
				const component = buildDiscordButtonComponent(button, options);
				return component ? [component] : [];
			});
			for (let index = 0; index < components.length; index += DISCORD_INTERACTIVE_BUTTON_ROW_SIZE) blocks.push({
				type: "actions",
				buttons: components.slice(index, index + DISCORD_INTERACTIVE_BUTTON_ROW_SIZE)
			});
			continue;
		}
		if (block.type === "select") appendDiscordSelectBlock(blocks, block);
	}
	return blocks.length ? { blocks } : void 0;
}
export { parseDiscordModalCustomId as _, DISCORD_APPROVAL_DECISIONS as a, encodeCustomIdComponent as b, DISCORD_COMPONENT_CUSTOM_ID_KEY as c, buildDiscordComponentCustomId as d, buildDiscordModalCustomId as f, parseDiscordComponentCustomIdForInteraction as g, parseDiscordComponentCustomId as h, parseDiscordQuestionData as i, DISCORD_MODAL_CUSTOM_ID_KEY as l, parseDiscordActivityCustomIdForInteraction as m, buildDiscordPresentationComponents as n, buildExecApprovalCustomId as o, parseDiscordActivityCustomId as p, shared_interactive_exports as r, parseExecApprovalData as s, buildDiscordInteractiveComponents as t, buildDiscordActivityCustomId as u, parseDiscordModalCustomIdForInteraction as v, decodeCustomIdComponent as y };
