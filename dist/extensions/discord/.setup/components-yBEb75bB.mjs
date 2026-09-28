import { $ as parseCustomId, B as File, F as RadioGroup, G as Row, H as MediaGallery, I as TextInput, J as StringSelectMenu, K as Section, L as Button, M as CheckboxGroup, N as Label, P as Modal, R as ChannelSelectMenu, U as MentionableSelectMenu, Ut as __exportAll, V as LinkButton, W as RoleSelectMenu, X as Thumbnail, Y as TextDisplay, Z as UserSelectMenu, q as Separator, z as Container } from "./discord-BXpHW-cu.mjs";
import { ButtonStyle, MessageFlags, TextInputStyle } from "discord-api-types/v10";
import crypto from "node:crypto";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { legacyInteractiveReplyToPresentation, resolveMessagePresentationActionValue, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveAskUserQuestionOptionIndex } from "openclaw/plugin-sdk/reply-payload";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
//#region extensions/discord/src/custom-id-codec.ts
/**
* URI-component codec for values embedded in `k=v;` custom-id grammars
* (exec approvals, model picker, command args, agent components).
* Decode falls back to the raw value: Discord redelivers old component ids
* indefinitely and historical values may predate strict encoding.
*/
function encodeCustomIdComponent(value) {
	return encodeURIComponent(value);
}
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
//#endregion
//#region extensions/discord/src/component-custom-id.ts
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
function buildDiscordComponentCustomId(params) {
	const encoded = needsCustomIdFieldEscaping(params.componentId) || needsCustomIdFieldEscaping(params.modalId ?? "");
	const componentId = encoded ? escapeCustomIdFieldValue(params.componentId) : params.componentId;
	const base = encoded ? `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};cid=${componentId}` : `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:cid=${componentId}`;
	const modalId = params.modalId;
	if (!modalId) return base;
	return `${base};mid=${encoded ? escapeCustomIdFieldValue(modalId) : modalId}`;
}
function buildDiscordModalCustomId(modalId) {
	return needsCustomIdFieldEscaping(modalId) ? `${DISCORD_MODAL_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};mid=${escapeCustomIdFieldValue(modalId)}` : `${DISCORD_MODAL_CUSTOM_ID_KEY}:mid=${modalId}`;
}
function parseDiscordComponentCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "occomp") return null;
	const data = decodeParsedCustomIdData(parsed.data);
	const componentId = data.cid;
	if (typeof componentId !== "string" || !componentId.trim()) return null;
	const modalId = data.mid;
	return {
		componentId,
		modalId: typeof modalId === "string" && modalId.trim() ? modalId : void 0
	};
}
function parseDiscordModalCustomId(id) {
	const parsed = parseCustomId(id);
	if (parsed.key !== "ocmodal") return null;
	const modalId = decodeParsedCustomIdData(parsed.data).mid;
	if (typeof modalId !== "string" || !modalId.trim()) return null;
	return modalId;
}
function isDiscordComponentWildcardRegistrationId(id) {
	return /^__openclaw_discord_component_[a-z_]+_wildcard__$/.test(id);
}
function parseDiscordComponentCustomIdForInteraction(id) {
	if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) return {
		key: "*",
		data: {}
	};
	const parsed = parseCustomId(id);
	if (parsed.key !== "occomp") return parsed;
	return {
		key: "*",
		data: decodeParsedCustomIdData(parsed.data)
	};
}
function parseDiscordModalCustomIdForInteraction(id) {
	if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) return {
		key: "*",
		data: {}
	};
	const parsed = parseCustomId(id);
	if (parsed.key !== "ocmodal") return parsed;
	return {
		key: "*",
		data: decodeParsedCustomIdData(parsed.data)
	};
}
//#endregion
//#region extensions/discord/src/components.parse.ts
const DISCORD_COMPONENT_ATTACHMENT_PREFIX = "attachment://";
const BLOCK_ALIASES = /* @__PURE__ */ new Map([["row", "actions"], ["action-row", "actions"]]);
function requireObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
	return value;
}
function readRequiredString(value, label, trim = true) {
	if (typeof value !== "string") throw new Error(`${label} must be a string`);
	const trimmed = value.trim();
	if (!trimmed) throw new Error(`${label} cannot be empty`);
	return trim ? trimmed : value;
}
function readOptionalCallbackDataKind(value, label) {
	const kind = normalizeOptionalString(value);
	if (kind === void 0) return;
	if (kind === "command" || kind === "callback") return kind;
	throw new Error(`${label} must be one of command, callback`);
}
function readOptionalStringArray(value, label) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
	if (value.length === 0) return;
	return value.map((entry, index) => readRequiredString(entry, `${label}[${index}]`));
}
function readOptionalInteger(value, label, bounds) {
	if (value == null) return;
	if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) throw new Error(`${label} must be an integer`);
	if (bounds?.min !== void 0 && value < bounds.min) throw new Error(`${label} must be at least ${bounds.min}`);
	if (bounds?.max !== void 0 && value > bounds.max) throw new Error(`${label} must be at most ${bounds.max}`);
	return value;
}
function readOptionalEmoji(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const obj = value;
	return {
		name: readRequiredString(obj.name, `${label}.name`),
		id: normalizeOptionalString(obj.id),
		animated: typeof obj.animated === "boolean" ? obj.animated : void 0
	};
}
function normalizeModalFieldName(value, index) {
	const trimmed = value?.trim();
	if (trimmed) return trimmed;
	return `field_${index + 1}`;
}
function normalizeAttachmentRef(value, label) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("attachment://")) throw new Error(`${label} must start with "${DISCORD_COMPONENT_ATTACHMENT_PREFIX}"`);
	const attachmentName = trimmed.slice(13).trim();
	if (!attachmentName) throw new Error(`${label} must include an attachment filename`);
	return `${DISCORD_COMPONENT_ATTACHMENT_PREFIX}${attachmentName}`;
}
function resolveDiscordComponentAttachmentName(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("attachment://")) throw new Error(`Attachment reference must start with "${DISCORD_COMPONENT_ATTACHMENT_PREFIX}"`);
	const attachmentName = trimmed.slice(13).trim();
	if (!attachmentName) throw new Error("Attachment reference must include a filename");
	return attachmentName;
}
function mapButtonStyle(style) {
	switch (normalizeLowercaseStringOrEmpty(style ?? "primary")) {
		case "secondary": return ButtonStyle.Secondary;
		case "success": return ButtonStyle.Success;
		case "danger": return ButtonStyle.Danger;
		case "link": return ButtonStyle.Link;
		default: return ButtonStyle.Primary;
	}
}
function mapTextInputStyle(style) {
	return style === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short;
}
function normalizeBlockType(raw) {
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	return BLOCK_ALIASES.get(lowered) ?? lowered;
}
function parseSelectOptions(raw, label) {
	if (raw === void 0) return;
	if (!Array.isArray(raw)) throw new Error(`${label} must be an array`);
	return raw.map((entry, index) => {
		const obj = requireObject(entry, `${label}[${index}]`);
		return {
			label: readRequiredString(obj.label, `${label}[${index}].label`),
			value: readRequiredString(obj.value, `${label}[${index}].value`),
			description: normalizeOptionalString(obj.description),
			emoji: readOptionalEmoji(obj.emoji, `${label}[${index}].emoji`),
			default: typeof obj.default === "boolean" ? obj.default : void 0
		};
	});
}
function parseButtonSpec(raw, label) {
	const obj = requireObject(raw, label);
	const style = normalizeOptionalString(obj.style);
	const url = normalizeOptionalString(obj.url);
	if ((style === "link" || url) && !url) throw new Error(`${label}.url is required for link buttons`);
	return {
		label: readRequiredString(obj.label, `${label}.label`),
		style,
		url,
		callbackData: normalizeOptionalString(obj.callbackData),
		callbackDataKind: readOptionalCallbackDataKind(obj.callbackDataKind, `${label}.callbackDataKind`),
		emoji: readOptionalEmoji(obj.emoji, `${label}.emoji`),
		disabled: typeof obj.disabled === "boolean" ? obj.disabled : void 0,
		reusable: typeof obj.reusable === "boolean" ? obj.reusable : void 0,
		allowedUsers: readOptionalStringArray(obj.allowedUsers, `${label}.allowedUsers`)
	};
}
function parseSelectSpec(raw, label) {
	const obj = requireObject(raw, label);
	const type = normalizeOptionalString(obj.type);
	const allowedTypes = [
		"string",
		"user",
		"role",
		"mentionable",
		"channel"
	];
	if (type && !allowedTypes.includes(type)) throw new Error(`${label}.type must be one of ${allowedTypes.join(", ")}`);
	return {
		type,
		callbackData: normalizeOptionalString(obj.callbackData),
		callbackDataKind: readOptionalCallbackDataKind(obj.callbackDataKind, `${label}.callbackDataKind`),
		placeholder: normalizeOptionalString(obj.placeholder),
		minValues: readOptionalInteger(obj.minValues, `${label}.minValues`, {
			min: 0,
			max: 25
		}),
		maxValues: readOptionalInteger(obj.maxValues, `${label}.maxValues`, {
			min: 1,
			max: 25
		}),
		options: parseSelectOptions(obj.options, `${label}.options`),
		allowedUsers: readOptionalStringArray(obj.allowedUsers, `${label}.allowedUsers`)
	};
}
function parseModalField(raw, label, index) {
	const obj = requireObject(raw, label);
	const type = normalizeLowercaseStringOrEmpty(readRequiredString(obj.type, `${label}.type`));
	const supported = [
		"text",
		"checkbox",
		"radio",
		"select",
		"role-select",
		"user-select"
	];
	if (!supported.includes(type)) throw new Error(`${label}.type must be one of ${supported.join(", ")}`);
	const options = parseSelectOptions(obj.options, `${label}.options`);
	if ([
		"checkbox",
		"radio",
		"select"
	].includes(type) && (!options || options.length === 0)) throw new Error(`${label}.options is required for ${type} fields`);
	if (type === "radio" && (obj.minValues != null || obj.maxValues != null)) throw new Error(`${label}.minValues/maxValues are not supported for radio fields`);
	const required = typeof obj.required === "boolean" ? obj.required : void 0;
	const maxValues = type === "checkbox" ? 10 : 25;
	return {
		type,
		name: normalizeModalFieldName(normalizeOptionalString(obj.name), index),
		label: readRequiredString(obj.label, `${label}.label`),
		description: normalizeOptionalString(obj.description),
		placeholder: normalizeOptionalString(obj.placeholder),
		required,
		options,
		minValues: readOptionalInteger(obj.minValues, `${label}.minValues`, {
			min: required === false ? 0 : 1,
			max: maxValues
		}),
		maxValues: readOptionalInteger(obj.maxValues, `${label}.maxValues`, {
			min: 1,
			max: maxValues
		}),
		minLength: readOptionalInteger(obj.minLength, `${label}.minLength`, {
			min: 0,
			max: 4e3
		}),
		maxLength: readOptionalInteger(obj.maxLength, `${label}.maxLength`, {
			min: 1,
			max: 4e3
		}),
		style: normalizeOptionalString(obj.style)
	};
}
function parseComponentBlock(raw, label) {
	const obj = requireObject(raw, label);
	switch (normalizeBlockType(normalizeLowercaseStringOrEmpty(readRequiredString(obj.type, `${label}.type`)))) {
		case "text": return {
			type: "text",
			text: readRequiredString(obj.text, `${label}.text`, false)
		};
		case "section": {
			const text = readNonBlankString(obj.text);
			const textsRaw = obj.texts;
			const texts = Array.isArray(textsRaw) ? textsRaw.map((entry, idx) => readRequiredString(entry, `${label}.texts[${idx}]`, false)) : void 0;
			if (!text && (!texts || texts.length === 0)) throw new Error(`${label}.text or ${label}.texts is required for section blocks`);
			let accessory;
			if (obj.accessory !== void 0) {
				const accessoryObj = requireObject(obj.accessory, `${label}.accessory`);
				const accessoryType = normalizeLowercaseStringOrEmpty(readRequiredString(accessoryObj.type, `${label}.accessory.type`));
				if (accessoryType === "thumbnail") accessory = {
					type: "thumbnail",
					url: readRequiredString(accessoryObj.url, `${label}.accessory.url`)
				};
				else if (accessoryType === "button") accessory = {
					type: "button",
					button: parseButtonSpec(accessoryObj.button, `${label}.accessory.button`)
				};
				else throw new Error(`${label}.accessory.type must be "thumbnail" or "button"`);
			}
			return {
				type: "section",
				text,
				texts,
				accessory
			};
		}
		case "separator": {
			const spacingRaw = obj.spacing;
			let spacing;
			if (spacingRaw === "small" || spacingRaw === "large") spacing = spacingRaw;
			else if (spacingRaw === 1 || spacingRaw === 2) spacing = spacingRaw;
			else if (spacingRaw !== void 0) throw new Error(`${label}.spacing must be "small", "large", 1, or 2`);
			const divider = typeof obj.divider === "boolean" ? obj.divider : void 0;
			return {
				type: "separator",
				spacing,
				divider
			};
		}
		case "actions": {
			const buttonsRaw = obj.buttons;
			const buttons = Array.isArray(buttonsRaw) ? buttonsRaw.map((entry, idx) => parseButtonSpec(entry, `${label}.buttons[${idx}]`)) : void 0;
			const select = obj.select ? parseSelectSpec(obj.select, `${label}.select`) : void 0;
			if ((!buttons || buttons.length === 0) && !select) throw new Error(`${label} requires buttons or select`);
			if (buttons && select) throw new Error(`${label} cannot include both buttons and select`);
			return {
				type: "actions",
				buttons,
				select
			};
		}
		case "media-gallery": {
			const itemsRaw = obj.items;
			if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) throw new Error(`${label}.items must be a non-empty array`);
			return {
				type: "media-gallery",
				items: itemsRaw.map((entry, idx) => {
					const itemObj = requireObject(entry, `${label}.items[${idx}]`);
					return {
						url: readRequiredString(itemObj.url, `${label}.items[${idx}].url`),
						description: normalizeOptionalString(itemObj.description),
						spoiler: typeof itemObj.spoiler === "boolean" ? itemObj.spoiler : void 0
					};
				})
			};
		}
		case "file": return {
			type: "file",
			file: normalizeAttachmentRef(readRequiredString(obj.file, `${label}.file`), `${label}.file`),
			spoiler: typeof obj.spoiler === "boolean" ? obj.spoiler : void 0
		};
		default: throw new Error(`${label}.type must be a supported component block`);
	}
}
function coerceDiscordComponentParam(raw) {
	if (typeof raw !== "string") return raw;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}
function readDiscordComponentSpec(raw) {
	if (raw === void 0 || raw === null) return null;
	const obj = requireObject(raw, "components");
	const blocksRaw = obj.blocks;
	const blocks = Array.isArray(blocksRaw) ? blocksRaw.map((entry, idx) => parseComponentBlock(entry, `components.blocks[${idx}]`)) : void 0;
	const modalRaw = obj.modal;
	let modal;
	if (modalRaw !== void 0) {
		const modalObj = requireObject(modalRaw, "components.modal");
		const fieldsRaw = modalObj.fields;
		if (!Array.isArray(fieldsRaw) || fieldsRaw.length === 0) throw new Error("components.modal.fields must be a non-empty array");
		if (fieldsRaw.length > 5) throw new Error("components.modal.fields supports up to 5 inputs");
		const fields = fieldsRaw.map((entry, idx) => parseModalField(entry, `components.modal.fields[${idx}]`, idx));
		modal = {
			title: readRequiredString(modalObj.title, "components.modal.title"),
			callbackData: normalizeOptionalString(modalObj.callbackData),
			triggerLabel: normalizeOptionalString(modalObj.triggerLabel),
			triggerStyle: normalizeOptionalString(modalObj.triggerStyle),
			allowedUsers: readOptionalStringArray(modalObj.allowedUsers, "components.modal.allowedUsers"),
			fields
		};
	}
	return {
		text: readNonBlankString(obj.text),
		reusable: typeof obj.reusable === "boolean" ? obj.reusable : void 0,
		container: typeof obj.container === "object" && obj.container && !Array.isArray(obj.container) ? {
			accentColor: obj.container.accentColor,
			spoiler: typeof obj.container.spoiler === "boolean" ? obj.container.spoiler : void 0
		} : void 0,
		blocks,
		modal
	};
}
//#endregion
//#region extensions/discord/src/components.builders.ts
function createShortId(prefix) {
	return `${prefix}${crypto.randomBytes(6).toString("base64url")}`;
}
const selectMenuConstructors = {
	string: class extends StringSelectMenu {
		constructor(..._args) {
			super(..._args);
			this.customId = "";
			this.options = [];
		}
	},
	user: class extends UserSelectMenu {
		constructor(..._args2) {
			super(..._args2);
			this.customId = "";
		}
	},
	role: class extends RoleSelectMenu {
		constructor(..._args3) {
			super(..._args3);
			this.customId = "";
		}
	},
	mentionable: class extends MentionableSelectMenu {
		constructor(..._args4) {
			super(..._args4);
			this.customId = "";
		}
	},
	channel: class extends ChannelSelectMenu {
		constructor(..._args5) {
			super(..._args5);
			this.customId = "";
		}
	}
};
function createDiscordSelectMenu(type, customId, options) {
	const SelectMenu = selectMenuConstructors[type];
	const select = new SelectMenu();
	select.customId = customId;
	if (select instanceof StringSelectMenu) select.options = options ?? [];
	return select;
}
function buildTextDisplays(text, texts) {
	if (texts && texts.length > 0) return texts.map((entry) => new TextDisplay(entry));
	if (text) return [new TextDisplay(text)];
	return [];
}
function createButtonComponent(params) {
	const style = mapButtonStyle(params.spec.style);
	if (style === ButtonStyle.Link || Boolean(params.spec.url)) {
		if (!params.spec.url) throw new Error("Link buttons require a url");
		const linkUrl = params.spec.url;
		class DynamicLinkButton extends LinkButton {
			constructor(..._args6) {
				super(..._args6);
				this.label = params.spec.label;
				this.url = linkUrl;
				this.emoji = params.spec.emoji;
				this.disabled = params.spec.disabled ?? false;
			}
		}
		return { component: new DynamicLinkButton() };
	}
	const componentId = params.componentId ?? createShortId("btn_");
	const internalCustomId = typeof params.spec.internalCustomId === "string" && params.spec.internalCustomId.trim() ? params.spec.internalCustomId.trim() : void 0;
	const customId = internalCustomId ?? buildDiscordComponentCustomId({
		componentId,
		modalId: params.modalId
	});
	class DynamicButton extends Button {
		constructor(..._args7) {
			super(..._args7);
			this.label = params.spec.label;
			this.customId = customId;
			this.style = style;
			this.emoji = params.spec.emoji;
			this.disabled = params.spec.disabled ?? false;
		}
	}
	if (internalCustomId) return { component: new DynamicButton() };
	return {
		component: new DynamicButton(),
		entry: {
			id: componentId,
			kind: params.modalId ? "modal-trigger" : "button",
			label: params.spec.label,
			...params.spec.callbackData !== void 0 ? { callbackData: params.spec.callbackData } : {},
			...params.spec.callbackDataKind !== void 0 ? { callbackDataKind: params.spec.callbackDataKind } : {},
			...params.modalId !== void 0 ? { modalId: params.modalId } : {},
			...params.spec.reusable !== void 0 ? { reusable: params.spec.reusable } : {},
			...params.spec.allowedUsers !== void 0 ? { allowedUsers: params.spec.allowedUsers } : {}
		}
	};
}
function createSelectComponent(params) {
	const type = normalizeLowercaseStringOrEmpty(params.spec.type ?? "string");
	const componentId = params.componentId ?? createShortId("sel_");
	const customId = buildDiscordComponentCustomId({ componentId });
	const options = params.spec.options ?? [];
	if (type === "string" && options.length === 0) throw new Error("String select menus require options");
	const select = createDiscordSelectMenu(type, customId, options);
	select.minValues = params.spec.minValues;
	select.maxValues = params.spec.maxValues;
	select.placeholder = params.spec.placeholder;
	select.disabled = false;
	return {
		component: select,
		entry: {
			id: componentId,
			kind: "select",
			label: params.spec.placeholder ?? {
				string: "select",
				user: "user select",
				role: "role select",
				mentionable: "mentionable select",
				channel: "channel select"
			}[type],
			...params.spec.callbackData !== void 0 ? { callbackData: params.spec.callbackData } : {},
			...params.spec.callbackDataKind !== void 0 ? { callbackDataKind: params.spec.callbackDataKind } : {},
			selectType: type,
			...type === "string" ? { options: options.map((option) => ({
				value: option.value,
				label: option.label
			})) } : {},
			...params.spec.allowedUsers !== void 0 ? { allowedUsers: params.spec.allowedUsers } : {}
		}
	};
}
function isSelectComponent(component) {
	return component instanceof StringSelectMenu || component instanceof UserSelectMenu || component instanceof RoleSelectMenu || component instanceof MentionableSelectMenu || component instanceof ChannelSelectMenu;
}
function buildDiscordComponentMessage(params) {
	const entries = [];
	const consumptionGroupId = createShortId("grp_");
	const modals = [];
	const components = [];
	const containerChildren = [];
	const addEntry = (entry) => {
		const reusable = entry.reusable ?? params.spec.reusable;
		entries.push({
			...entry,
			...params.sessionKey !== void 0 ? { sessionKey: params.sessionKey } : {},
			...params.agentId !== void 0 ? { agentId: params.agentId } : {},
			...params.accountId !== void 0 ? { accountId: params.accountId } : {},
			...reusable !== void 0 ? { reusable } : {},
			consumptionGroupId
		});
	};
	const text = params.spec.text ?? params.fallbackText;
	if (text) containerChildren.push(new TextDisplay(text));
	for (const block of params.spec.blocks ?? []) {
		if (block.type === "text") {
			containerChildren.push(new TextDisplay(block.text));
			continue;
		}
		if (block.type === "section") {
			const displays = buildTextDisplays(block.text, block.texts);
			if (displays.length > 3) throw new Error("Section blocks support up to 3 text displays");
			let accessory;
			if (block.accessory?.type === "thumbnail") accessory = new Thumbnail(block.accessory.url);
			else if (block.accessory?.type === "button") {
				const { component, entry } = createButtonComponent({ spec: block.accessory.button });
				accessory = component;
				if (entry) addEntry(entry);
			}
			containerChildren.push(new Section(displays, accessory));
			continue;
		}
		if (block.type === "separator") {
			containerChildren.push(new Separator({
				spacing: block.spacing,
				divider: block.divider
			}));
			continue;
		}
		if (block.type === "media-gallery") {
			containerChildren.push(new MediaGallery(block.items));
			continue;
		}
		if (block.type === "file") {
			containerChildren.push(new File(block.file, block.spoiler));
			continue;
		}
		if (block.type === "actions") {
			const rowComponents = [];
			if (block.buttons) {
				if (block.buttons.length > 5) throw new Error("Action rows support up to 5 buttons");
				for (const button of block.buttons) {
					const { component, entry } = createButtonComponent({ spec: button });
					rowComponents.push(component);
					if (entry) addEntry(entry);
				}
			} else if (block.select) {
				const { component, entry } = createSelectComponent({ spec: block.select });
				rowComponents.push(component);
				addEntry(entry);
			}
			containerChildren.push(new Row(rowComponents));
		}
	}
	if (params.spec.modal) {
		const modalId = createShortId("mdl_");
		const fields = params.spec.modal.fields.map((field, index) => ({
			id: createShortId("fld_"),
			name: normalizeModalFieldName(field.name, index),
			label: field.label,
			type: field.type,
			...field.description !== void 0 ? { description: field.description } : {},
			...field.placeholder !== void 0 ? { placeholder: field.placeholder } : {},
			...field.required !== void 0 ? { required: field.required } : {},
			...field.options !== void 0 ? { options: field.options } : {},
			...field.minValues !== void 0 ? { minValues: field.minValues } : {},
			...field.maxValues !== void 0 ? { maxValues: field.maxValues } : {},
			...field.minLength !== void 0 ? { minLength: field.minLength } : {},
			...field.maxLength !== void 0 ? { maxLength: field.maxLength } : {},
			...field.style !== void 0 ? { style: field.style } : {}
		}));
		modals.push({
			id: modalId,
			title: params.spec.modal.title,
			fields,
			...params.spec.modal.callbackData !== void 0 ? { callbackData: params.spec.modal.callbackData } : {},
			...params.sessionKey !== void 0 ? { sessionKey: params.sessionKey } : {},
			...params.agentId !== void 0 ? { agentId: params.agentId } : {},
			...params.accountId !== void 0 ? { accountId: params.accountId } : {},
			...params.spec.reusable !== void 0 ? { reusable: params.spec.reusable } : {},
			...params.spec.modal.allowedUsers !== void 0 ? { allowedUsers: params.spec.modal.allowedUsers } : {}
		});
		const { component, entry } = createButtonComponent({
			spec: {
				label: params.spec.modal.triggerLabel ?? "Open form",
				style: params.spec.modal.triggerStyle ?? "primary",
				allowedUsers: params.spec.modal.allowedUsers
			},
			modalId
		});
		if (entry) addEntry(entry);
		const lastChild = containerChildren.at(-1);
		if (lastChild instanceof Row) {
			const row = lastChild;
			const hasSelect = row.components.some((entryLocal) => isSelectComponent(entryLocal));
			if (row.components.length < 5 && !hasSelect) row.addComponent(component);
			else containerChildren.push(new Row([component]));
		} else containerChildren.push(new Row([component]));
	}
	if (containerChildren.length === 0) throw new Error("components must include at least one block, text, or modal trigger");
	const container = new Container(containerChildren, params.spec.container);
	components.push(container);
	const consumptionGroupEntryIds = entries.map((entry) => entry.id);
	for (const entry of entries) entry.consumptionGroupEntryIds = consumptionGroupEntryIds;
	return {
		components,
		entries,
		modals
	};
}
function buildDiscordComponentMessageFlags(components) {
	return components.some((component) => component.isV2) ? MessageFlags.IsComponentsV2 : void 0;
}
//#endregion
//#region extensions/discord/src/components.modal.ts
function createModalFieldComponent(field) {
	if (field.type === "text") {
		class DynamicTextInput extends TextInput {
			constructor(..._args) {
				super(..._args);
				this.customId = field.id;
				this.style = mapTextInputStyle(field.style);
				this.placeholder = field.placeholder;
				this.required = field.required;
				this.minLength = field.minLength;
				this.maxLength = field.maxLength;
			}
		}
		return new DynamicTextInput();
	}
	if (field.type === "select" || field.type === "role-select" || field.type === "user-select") {
		const select = createDiscordSelectMenu(field.type === "select" ? "string" : field.type === "role-select" ? "role" : "user", field.id, field.options);
		select.required = field.required;
		select.minValues = field.minValues;
		select.maxValues = field.maxValues;
		select.placeholder = field.placeholder;
		return select;
	}
	if (field.type === "checkbox") {
		const options = field.options ?? [];
		class DynamicCheckboxGroup extends CheckboxGroup {
			constructor(..._args2) {
				super(..._args2);
				this.customId = field.id;
				this.options = options;
				this.required = field.required;
				this.minValues = field.minValues;
				this.maxValues = field.maxValues;
			}
		}
		return new DynamicCheckboxGroup();
	}
	const options = field.options ?? [];
	class DynamicRadioGroup extends RadioGroup {
		constructor(..._args3) {
			super(..._args3);
			this.customId = field.id;
			this.options = options;
			this.required = field.required;
		}
	}
	return new DynamicRadioGroup();
}
var DiscordFormModal = class extends Modal {
	constructor(params) {
		super();
		this.customIdParser = parseDiscordModalCustomIdForInteraction;
		this.title = params.title;
		this.customId = buildDiscordModalCustomId(params.modalId);
		this.components = params.fields.map((field) => {
			const component = createModalFieldComponent(field);
			class DynamicLabel extends Label {
				constructor(..._args4) {
					super(..._args4);
					this.label = field.label;
					this.description = field.description;
					this.component = component;
					this.customId = field.id;
				}
			}
			return new DynamicLabel(component);
		});
	}
	async run() {
		throw new Error("Modal handler is not registered for dynamic forms");
	}
};
function createDiscordFormModal(entry) {
	return new DiscordFormModal({
		modalId: entry.id,
		title: entry.title,
		fields: entry.fields
	});
}
//#endregion
//#region extensions/discord/src/approval-custom-id.ts
const DISCORD_APPROVAL_CUSTOM_ID_MAX_CHARS = 100;
function encodeDiscordApprovalCustomId(action) {
	return [
		`execapproval:kind=${action.approvalKind}`,
		`id=${encodeURIComponent(action.approvalId)}`,
		`action=${action.decision}`
	].join(";");
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
function decodeCustomIdValue(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return null;
	}
}
function parseExecApprovalData(data) {
	if (!data || typeof data !== "object") return null;
	const coerce = (value) => typeof value === "string" || typeof value === "number" ? String(value) : "";
	const rawId = coerce(data.id);
	const rawKind = coerce(data.kind);
	const rawAction = coerce(data.action);
	if (!rawId || rawKind !== "exec" && rawKind !== "plugin" && rawKind !== "system-agent" || !rawAction) return null;
	if (rawAction !== "allow-once" && rawAction !== "allow-always" && rawAction !== "deny") return null;
	const approvalId = decodeCustomIdValue(rawId);
	if (!approvalId) return null;
	return {
		approvalId,
		approvalKind: rawKind,
		action: rawAction
	};
}
//#endregion
//#region extensions/discord/src/question-custom-id.ts
const DISCORD_QUESTION_CUSTOM_ID_MAX_CHARS = 100;
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function buildDiscordQuestionCustomId(callback) {
	if (!QUESTION_RECORD_ID_PATTERN.test(callback.questionId) || !Number.isInteger(callback.optionIndex) || callback.optionIndex < 0 || callback.optionIndex > 3) return;
	const customId = `ocq:id=${callback.questionId};i=${callback.optionIndex}`;
	return customId.length <= DISCORD_QUESTION_CUSTOM_ID_MAX_CHARS ? customId : void 0;
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
//#endregion
//#region extensions/discord/src/shared-interactive.ts
var shared_interactive_exports = /* @__PURE__ */ __exportAll({
	buildDiscordInteractiveComponents: () => buildDiscordInteractiveComponents,
	buildDiscordPresentationComponents: () => buildDiscordPresentationComponents
});
function resolveDiscordInteractiveButtonStyle(style) {
	return style ?? "secondary";
}
function resolveDiscordSelectOptionValue(option) {
	return resolveMessagePresentationActionValue(resolveMessagePresentationOptionAction(option));
}
function resolveDiscordSelectCallbackDataKind(options) {
	const renderableOptions = options.filter((option) => resolveDiscordSelectOptionValue(option));
	if (renderableOptions.length === 0) return;
	if (renderableOptions.every((option) => option.action?.type === "command")) return "command";
	if (renderableOptions.every((option) => option.action?.type === "callback")) return "callback";
	if (renderableOptions.some((option) => option.action)) return "mixed";
}
const DISCORD_INTERACTIVE_BUTTON_ROW_SIZE = 5;
function buildDiscordButtonComponent(button, options) {
	const action = resolveMessagePresentationButtonAction(button);
	if (!action) return;
	if (action.type === "approval") {
		const internalCustomId = buildDiscordApprovalCustomId(action);
		if (!internalCustomId) return;
		return {
			label: button.label,
			style: resolveDiscordInteractiveButtonStyle(button.style),
			internalCustomId,
			...button.disabled === true ? { disabled: true } : {}
		};
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
			label: button.label,
			style: resolveDiscordInteractiveButtonStyle(button.style),
			internalCustomId,
			...button.disabled === true ? { disabled: true } : {}
		} : void 0;
	}
	if (action.type === "web-app" && action.widgetId && isValidDiscordActivityWidgetId(action.widgetId)) return {
		label: button.label,
		style: resolveDiscordInteractiveButtonStyle(button.style),
		internalCustomId: buildDiscordActivityCustomId(action.widgetId),
		...button.disabled === true ? { disabled: true } : {},
		...button.reusable === true ? { reusable: true } : {}
	};
	if (action.type === "web-app" && !action.url) return;
	const component = {
		label: button.label,
		style: action.type === "url" || action.type === "web-app" ? "link" : resolveDiscordInteractiveButtonStyle(button.style)
	};
	if (action.type === "url" || action.type === "web-app") component.url = action.url;
	else {
		component.callbackData = action.type === "command" ? action.command : action.value;
		if (button.action?.type === "command" || button.action?.type === "callback") component.callbackDataKind = button.action.type;
	}
	if (button.disabled === true) component.disabled = true;
	if (button.reusable === true) component.reusable = true;
	return component;
}
function appendDiscordButtonBlocks(blocks, buttons, options) {
	const components = buttons.flatMap((button) => {
		const component = buildDiscordButtonComponent(button, options);
		return component ? [component] : [];
	});
	for (let index = 0; index < components.length; index += DISCORD_INTERACTIVE_BUTTON_ROW_SIZE) blocks.push({
		type: "actions",
		buttons: components.slice(index, index + DISCORD_INTERACTIVE_BUTTON_ROW_SIZE)
	});
}
function appendDiscordSelectBlock(blocks, block) {
	const options = block.options.map((option) => ({
		label: option.label,
		value: resolveDiscordSelectOptionValue(option)
	})).filter((option) => Boolean(option.value));
	if (options.length === 0) return;
	const callbackDataKind = resolveDiscordSelectCallbackDataKind(block.options);
	if (callbackDataKind === "mixed") return;
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
			appendDiscordButtonBlocks(blocks, block.buttons, options);
			continue;
		}
		if (block.type === "select") appendDiscordSelectBlock(blocks, block);
	}
	return blocks.length ? { blocks } : void 0;
}
//#endregion
//#region extensions/discord/src/components.ts
var components_exports = /* @__PURE__ */ __exportAll({
	DISCORD_COMPONENT_ATTACHMENT_PREFIX: () => DISCORD_COMPONENT_ATTACHMENT_PREFIX,
	DISCORD_COMPONENT_CUSTOM_ID_KEY: () => DISCORD_COMPONENT_CUSTOM_ID_KEY,
	DISCORD_MODAL_CUSTOM_ID_KEY: () => DISCORD_MODAL_CUSTOM_ID_KEY,
	DiscordFormModal: () => DiscordFormModal,
	Modal: () => Modal,
	buildDiscordComponentCustomId: () => buildDiscordComponentCustomId,
	buildDiscordComponentMessage: () => buildDiscordComponentMessage,
	buildDiscordComponentMessageFlags: () => buildDiscordComponentMessageFlags,
	buildDiscordInteractiveComponents: () => buildDiscordInteractiveComponents,
	buildDiscordModalCustomId: () => buildDiscordModalCustomId,
	coerceDiscordComponentParam: () => coerceDiscordComponentParam,
	createDiscordFormModal: () => createDiscordFormModal,
	formatDiscordComponentEventText: () => formatDiscordComponentEventText,
	parseDiscordComponentCustomId: () => parseDiscordComponentCustomId,
	parseDiscordComponentCustomIdForInteraction: () => parseDiscordComponentCustomIdForInteraction,
	parseDiscordModalCustomId: () => parseDiscordModalCustomId,
	parseDiscordModalCustomIdForInteraction: () => parseDiscordModalCustomIdForInteraction,
	readDiscordComponentSpec: () => readDiscordComponentSpec,
	resolveDiscordComponentAttachmentName: () => resolveDiscordComponentAttachmentName
});
function formatDiscordComponentEventText(params) {
	if (params.kind === "button") return `Clicked "${params.label}".`;
	const values = params.values ?? [];
	if (values.length === 0) return `Updated "${params.label}".`;
	return `Selected ${values.join(", ")} from "${params.label}".`;
}
//#endregion
export { parseDiscordActivityCustomIdForInteraction as C, parseDiscordModalCustomIdForInteraction as D, parseDiscordModalCustomId as E, decodeCustomIdComponent as O, parseDiscordActivityCustomId as S, parseDiscordComponentCustomIdForInteraction as T, DISCORD_COMPONENT_CUSTOM_ID_KEY as _, shared_interactive_exports as a, buildDiscordComponentCustomId as b, parseExecApprovalData as c, buildDiscordComponentMessage as d, buildDiscordComponentMessageFlags as f, resolveDiscordComponentAttachmentName as g, readDiscordComponentSpec as h, buildDiscordPresentationComponents as i, encodeCustomIdComponent as k, DiscordFormModal as l, coerceDiscordComponentParam as m, formatDiscordComponentEventText as n, parseDiscordQuestionData as o, DISCORD_COMPONENT_ATTACHMENT_PREFIX as p, buildDiscordInteractiveComponents as r, buildExecApprovalCustomId as s, components_exports as t, createDiscordFormModal as u, DISCORD_MODAL_CUSTOM_ID_KEY as v, parseDiscordComponentCustomId as w, buildDiscordModalCustomId as x, buildDiscordActivityCustomId as y };
