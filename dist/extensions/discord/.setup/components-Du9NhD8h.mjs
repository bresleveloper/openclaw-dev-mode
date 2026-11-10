import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { A as StringSelectMenu, C as LinkButton, D as Row, E as RoleSelectMenu, M as Thumbnail, N as UserSelectMenu, O as Section, S as File, T as MentionableSelectMenu, _ as TextInput, b as ChannelSelectMenu, g as RadioGroup, h as Modal, j as TextDisplay, k as Separator, m as Label, p as CheckboxGroup, tt as parseCustomId, v as AnySelectMenu, w as MediaGallery, x as Container, xt as stripUndefinedFields, y as Button } from "./discord-BMD-JiVS.mjs";
import { asBoolean, asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ButtonStyle, MessageFlags, TextInputStyle } from "discord-api-types/v10";
import { resolveAskUserQuestionOptionIndex } from "openclaw/plugin-sdk/reply-payload";
import crypto from "node:crypto";
import { legacyInteractiveReplyToPresentation, resolveMessagePresentationActionValue, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
//#region extensions/discord/src/custom-id-codec.ts
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
//#endregion
//#region extensions/discord/src/components.parse.ts
const DISCORD_COMPONENT_ATTACHMENT_PREFIX = "attachment://";
const BLOCK_ALIASES = /* @__PURE__ */ new Map([["row", "actions"], ["action-row", "actions"]]);
function requireObject(value, label) {
	const record = asOptionalRecord(value);
	if (!record) throw new Error(`${label} must be an object`);
	return record;
}
function readRequiredString(value, label, trim = true) {
	if (typeof value !== "string") throw new Error(`${label} must be a string`);
	const trimmed = value.trim();
	if (!trimmed) throw new Error(`${label} cannot be empty`);
	return trim ? trimmed : value;
}
function readEnum(value, label, values) {
	const match = values.find((candidate) => candidate === value);
	if (match !== void 0) return match;
	throw new Error(`${label} must be one of ${values.join(", ")}`);
}
function readOptionalEnum(value, label, values) {
	const normalized = normalizeOptionalString(value);
	return normalized === void 0 ? void 0 : readEnum(normalized, label, values);
}
function readCallbackDataKind(value, label) {
	return readOptionalEnum(value, label, ["command", "callback"]);
}
function readOptionalArray(value, label, readEntry, nonArray = "reject") {
	if (value === void 0) return;
	if (!Array.isArray(value)) {
		if (nonArray === "ignore") return;
		throw new Error(`${label} must be an array`);
	}
	return value.map((entry, index) => readEntry(entry, `${label}[${index}]`));
}
function readOptionalStringArray(value, label) {
	const entries = readOptionalArray(value, label, readRequiredString);
	return entries?.length ? entries : void 0;
}
function readOptionalInteger(value, label, bounds) {
	if (value == null) return;
	if (typeof value !== "number" || !Number.isInteger(value)) throw new Error(`${label} must be an integer`);
	if (bounds?.min !== void 0 && value < bounds.min) throw new Error(`${label} must be at least ${bounds.min}`);
	if (bounds?.max !== void 0 && value > bounds.max) throw new Error(`${label} must be at most ${bounds.max}`);
	return value;
}
function readOptionalEmoji(value, label) {
	const obj = asOptionalRecord(value);
	if (!obj) return;
	return {
		name: readRequiredString(obj.name, `${label}.name`),
		id: normalizeOptionalString(obj.id),
		animated: asBoolean(obj.animated)
	};
}
function normalizeModalFieldName(value, index) {
	return value?.trim() || `field_${index + 1}`;
}
function readAttachmentName(value, label, filenameLabel = "a filename") {
	const trimmed = value.trim();
	if (!trimmed.startsWith("attachment://")) throw new Error(`${label} must start with "${DISCORD_COMPONENT_ATTACHMENT_PREFIX}"`);
	const attachmentName = trimmed.slice(13).trim();
	if (!attachmentName) throw new Error(`${label} must include ${filenameLabel}`);
	return attachmentName;
}
function resolveDiscordComponentAttachmentName(value) {
	return readAttachmentName(value, "Attachment reference");
}
const buttonStyles = /* @__PURE__ */ new Map([
	["secondary", ButtonStyle.Secondary],
	["success", ButtonStyle.Success],
	["danger", ButtonStyle.Danger],
	["link", ButtonStyle.Link]
]);
function mapButtonStyle(style) {
	return buttonStyles.get(normalizeLowercaseStringOrEmpty(style ?? "primary")) ?? ButtonStyle.Primary;
}
function mapTextInputStyle(style) {
	return style === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short;
}
function parseSelectOptions(raw, label) {
	return readOptionalArray(raw, label, (entry, entryLabel) => {
		const obj = requireObject(entry, entryLabel);
		return {
			label: readRequiredString(obj.label, `${entryLabel}.label`),
			value: readRequiredString(obj.value, `${entryLabel}.value`),
			description: normalizeOptionalString(obj.description),
			emoji: readOptionalEmoji(obj.emoji, `${entryLabel}.emoji`),
			default: asBoolean(obj.default)
		};
	});
}
function parseButtonSpec(raw, label) {
	const obj = requireObject(raw, label);
	const style = normalizeOptionalString(obj.style);
	const url = normalizeOptionalString(obj.url);
	if (style === "link" && !url) throw new Error(`${label}.url is required for link buttons`);
	return {
		label: readRequiredString(obj.label, `${label}.label`),
		style,
		url,
		callbackData: normalizeOptionalString(obj.callbackData),
		callbackDataKind: readCallbackDataKind(obj.callbackDataKind, `${label}.callbackDataKind`),
		emoji: readOptionalEmoji(obj.emoji, `${label}.emoji`),
		disabled: asBoolean(obj.disabled),
		reusable: asBoolean(obj.reusable),
		allowedUsers: readOptionalStringArray(obj.allowedUsers, `${label}.allowedUsers`)
	};
}
function parseSelectSpec(raw, label) {
	const obj = requireObject(raw, label);
	return {
		type: readOptionalEnum(obj.type, `${label}.type`, [
			"string",
			"user",
			"role",
			"mentionable",
			"channel"
		]),
		callbackData: normalizeOptionalString(obj.callbackData),
		callbackDataKind: readCallbackDataKind(obj.callbackDataKind, `${label}.callbackDataKind`),
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
	const type = readEnum(normalizeLowercaseStringOrEmpty(readRequiredString(obj.type, `${label}.type`)), `${label}.type`, [
		"text",
		"checkbox",
		"radio",
		"select",
		"role-select",
		"user-select"
	]);
	const options = parseSelectOptions(obj.options, `${label}.options`);
	if ([
		"checkbox",
		"radio",
		"select"
	].includes(type) && (!options || options.length === 0)) throw new Error(`${label}.options is required for ${type} fields`);
	if (type === "radio" && (obj.minValues != null || obj.maxValues != null)) throw new Error(`${label}.minValues/maxValues are not supported for radio fields`);
	const required = asBoolean(obj.required);
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
	const typeRaw = normalizeLowercaseStringOrEmpty(readRequiredString(obj.type, `${label}.type`));
	switch (BLOCK_ALIASES.get(typeRaw) ?? typeRaw) {
		case "text": return {
			type: "text",
			text: readRequiredString(obj.text, `${label}.text`, false)
		};
		case "section": {
			const text = readNonBlankString(obj.text);
			const texts = readOptionalArray(obj.texts, `${label}.texts`, (entry, entryLabel) => readRequiredString(entry, entryLabel, false), "ignore");
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
			if (spacingRaw !== void 0 && spacingRaw !== "small" && spacingRaw !== "large" && spacingRaw !== 1 && spacingRaw !== 2) throw new Error(`${label}.spacing must be "small", "large", 1, or 2`);
			return {
				type: "separator",
				spacing: spacingRaw,
				divider: asBoolean(obj.divider)
			};
		}
		case "actions": {
			const buttons = readOptionalArray(obj.buttons, `${label}.buttons`, parseButtonSpec, "ignore");
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
						spoiler: asBoolean(itemObj.spoiler)
					};
				})
			};
		}
		case "file": {
			const file = readRequiredString(obj.file, `${label}.file`);
			return {
				type: "file",
				file: `${DISCORD_COMPONENT_ATTACHMENT_PREFIX}${readAttachmentName(file, `${label}.file`, "an attachment filename")}`,
				spoiler: asBoolean(obj.spoiler)
			};
		}
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
	const blocks = readOptionalArray(obj.blocks, "components.blocks", parseComponentBlock, "ignore");
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
	const container = asOptionalRecord(obj.container);
	return {
		text: readNonBlankString(obj.text),
		reusable: asBoolean(obj.reusable),
		container: container ? {
			accentColor: container.accentColor,
			spoiler: asBoolean(container.spoiler)
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
	const componentId = createShortId("btn_");
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
		entry: stripUndefinedFields({
			id: componentId,
			kind: params.modalId ? "modal-trigger" : "button",
			label: params.spec.label,
			callbackData: params.spec.callbackData,
			callbackDataKind: params.spec.callbackDataKind,
			modalId: params.modalId,
			reusable: params.spec.reusable,
			allowedUsers: params.spec.allowedUsers
		})
	};
}
function createSelectComponent(params) {
	const type = normalizeLowercaseStringOrEmpty(params.spec.type ?? "string");
	const componentId = createShortId("sel_");
	const customId = buildDiscordComponentCustomId({ componentId });
	const options = params.spec.options ?? [];
	if (type === "string" && options.length === 0) throw new Error("String select menus require options");
	const select = createDiscordSelectMenu(type, customId, options);
	select.minValues = params.spec.minValues;
	select.maxValues = params.spec.maxValues;
	select.placeholder = params.spec.placeholder;
	return {
		component: select,
		entry: stripUndefinedFields({
			id: componentId,
			kind: "select",
			label: params.spec.placeholder ?? {
				string: "select",
				user: "user select",
				role: "role select",
				mentionable: "mentionable select",
				channel: "channel select"
			}[type],
			callbackData: params.spec.callbackData,
			callbackDataKind: params.spec.callbackDataKind,
			selectType: type,
			options: type === "string" ? options.map((option) => ({
				value: option.value,
				label: option.label
			})) : void 0,
			allowedUsers: params.spec.allowedUsers
		})
	};
}
function buildDiscordComponentMessage(params) {
	const entries = [];
	const consumptionGroupId = createShortId("grp_");
	const modals = [];
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
	const buildButton = (options, row) => {
		const { component, entry } = createButtonComponent(options);
		row?.push(component);
		if (entry) addEntry(entry);
		return component;
	};
	const text = params.spec.text ?? params.fallbackText;
	if (text) containerChildren.push(new TextDisplay(text));
	for (const block of params.spec.blocks ?? []) {
		if (block.type === "text") {
			containerChildren.push(new TextDisplay(block.text));
			continue;
		}
		if (block.type === "section") {
			const displays = (block.texts?.length ? block.texts : block.text ? [block.text] : []).map((entry) => new TextDisplay(entry));
			if (displays.length > 3) throw new Error("Section blocks support up to 3 text displays");
			let accessory;
			if (block.accessory?.type === "thumbnail") accessory = new Thumbnail(block.accessory.url);
			else if (block.accessory?.type === "button") accessory = buildButton({ spec: block.accessory.button });
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
				for (const button of block.buttons) buildButton({ spec: button }, rowComponents);
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
		const fields = params.spec.modal.fields.map((field, index) => stripUndefinedFields({
			id: createShortId("fld_"),
			name: normalizeModalFieldName(field.name, index),
			label: field.label,
			type: field.type,
			description: field.description,
			placeholder: field.placeholder,
			required: field.required,
			options: field.options,
			minValues: field.minValues,
			maxValues: field.maxValues,
			minLength: field.minLength,
			maxLength: field.maxLength,
			style: field.style
		}));
		modals.push(stripUndefinedFields({
			id: modalId,
			title: params.spec.modal.title,
			fields,
			callbackData: params.spec.modal.callbackData,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			accountId: params.accountId,
			reusable: params.spec.reusable,
			allowedUsers: params.spec.modal.allowedUsers
		}));
		const component = buildButton({
			spec: {
				label: params.spec.modal.triggerLabel ?? "Open form",
				style: params.spec.modal.triggerStyle ?? "primary",
				allowedUsers: params.spec.modal.allowedUsers
			},
			modalId
		});
		const lastChild = containerChildren.at(-1);
		if (lastChild instanceof Row && lastChild.components.length < 5 && !lastChild.components.some((child) => child instanceof AnySelectMenu)) lastChild.addComponent(component);
		else containerChildren.push(new Row([component]));
	}
	if (containerChildren.length === 0) throw new Error("components must include at least one block, text, or modal trigger");
	const container = new Container(containerChildren, params.spec.container);
	const consumptionGroupEntryIds = entries.map((entry) => entry.id);
	for (const entry of entries) entry.consumptionGroupEntryIds = consumptionGroupEntryIds;
	return {
		components: [container],
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
	const group = field.type === "checkbox" ? new class extends CheckboxGroup {
		constructor(..._args2) {
			super(..._args2);
			this.customId = field.id;
		}
	}() : new class extends RadioGroup {
		constructor(..._args3) {
			super(..._args3);
			this.customId = field.id;
		}
	}();
	group.options = field.options ?? [];
	group.required = field.required;
	if (field.type === "checkbox") {
		group.minValues = field.minValues;
		group.maxValues = field.maxValues;
	}
	return group;
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
//#endregion
//#region extensions/discord/src/question-custom-id.ts
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
//#endregion
//#region extensions/discord/src/shared-interactive.ts
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
