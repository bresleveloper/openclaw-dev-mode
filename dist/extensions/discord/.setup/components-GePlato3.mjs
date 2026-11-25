import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { J as stripUndefinedFields, a as Label, c as TextInput, i as CheckboxGroup, o as Modal, s as RadioGroup, u as asSerializableComponent } from "./discord-cXPUdHQi.mjs";
import { i as parseCustomId, r as colorToNumber, t as BaseMessageInteractiveComponent } from "./components.base-C5sAPHe4.mjs";
import { _ as parseDiscordModalCustomId, c as DISCORD_COMPONENT_CUSTOM_ID_KEY, d as buildDiscordComponentCustomId, f as buildDiscordModalCustomId, g as parseDiscordComponentCustomIdForInteraction, h as parseDiscordComponentCustomId, l as DISCORD_MODAL_CUSTOM_ID_KEY, t as buildDiscordInteractiveComponents, v as parseDiscordModalCustomIdForInteraction } from "./shared-interactive-DKBw4SNV.mjs";
import { asBoolean, asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ButtonStyle, ComponentType, MessageFlags, TextInputStyle } from "discord-api-types/v10";
import crypto from "node:crypto";
// extensions/discord/src/components.types.ts
const DISCORD_COMPONENT_SELECT_TYPES = [
	"string",
	"user",
	"role",
	"mentionable",
	"channel"
];
// extensions/discord/src/components.parse.ts
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
		type: readOptionalEnum(obj.type, `${label}.type`, DISCORD_COMPONENT_SELECT_TYPES),
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
// extensions/discord/src/components.builders.ts
function createShortId(prefix) {
	return `${prefix}${crypto.randomBytes(6).toString("base64url")}`;
}
function createButtonComponent(params) {
	const style = mapButtonStyle(params.spec.style);
	if (style === ButtonStyle.Link || params.spec.url) {
		if (!params.spec.url) throw new Error("Link buttons require a url");
		return { component: stripUndefinedFields({
			type: ComponentType.Button,
			style: ButtonStyle.Link,
			label: params.spec.label,
			url: params.spec.url,
			emoji: params.spec.emoji,
			disabled: params.spec.disabled || void 0
		}) };
	}
	const componentId = createShortId("btn_");
	const internalCustomId = params.spec.internalCustomId?.trim() || void 0;
	const customId = internalCustomId ?? buildDiscordComponentCustomId({
		componentId,
		modalId: params.modalId
	});
	return {
		component: stripUndefinedFields({
			type: ComponentType.Button,
			style,
			label: params.spec.label,
			custom_id: customId,
			emoji: params.spec.emoji,
			disabled: params.spec.disabled || void 0
		}),
		entry: internalCustomId ? void 0 : stripUndefinedFields({
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
	if (text) containerChildren.push({
		type: ComponentType.TextDisplay,
		content: text
	});
	for (const block of params.spec.blocks ?? []) {
		if (block.type === "text") {
			containerChildren.push({
				type: ComponentType.TextDisplay,
				content: block.text
			});
			continue;
		}
		if (block.type === "section") {
			const displays = (block.texts?.length ? block.texts : block.text ? [block.text] : []).map((content) => ({
				type: ComponentType.TextDisplay,
				content
			}));
			if (displays.length > 3) throw new Error("Section blocks support up to 3 text displays");
			let accessory;
			if (block.accessory?.type === "thumbnail") accessory = {
				type: ComponentType.Thumbnail,
				media: { url: block.accessory.url }
			};
			else if (block.accessory?.type === "button") accessory = buildButton({ spec: block.accessory.button });
			containerChildren.push(stripUndefinedFields({
				type: ComponentType.Section,
				components: displays,
				accessory
			}));
			continue;
		}
		if (block.type === "separator") {
			containerChildren.push({
				type: ComponentType.Separator,
				spacing: block.spacing === "large" || block.spacing === 2 ? 2 : 1,
				divider: block.divider ?? true
			});
			continue;
		}
		if (block.type === "media-gallery") {
			containerChildren.push({
				type: ComponentType.MediaGallery,
				items: block.items.map(({ url, description, spoiler }) => ({
					media: { url },
					description,
					spoiler
				}))
			});
			continue;
		}
		if (block.type === "file") {
			containerChildren.push(stripUndefinedFields({
				type: ComponentType.File,
				file: { url: block.file },
				spoiler: block.spoiler || void 0
			}));
			continue;
		}
		if (block.type === "actions") {
			const rowComponents = [];
			if (block.buttons) {
				if (block.buttons.length > 5) throw new Error("Action rows support up to 5 buttons");
				for (const button of block.buttons) buildButton({ spec: button }, rowComponents);
			} else if (block.select) {
				const selectSpec = block.select;
				const type = selectSpec.type ?? "string";
				const componentId = createShortId("sel_");
				const customId = buildDiscordComponentCustomId({ componentId });
				const options = selectSpec.options ?? [];
				if (type === "string" && options.length === 0) throw new Error("String select menus require options");
				const fields = stripUndefinedFields({
					custom_id: customId,
					min_values: selectSpec.minValues,
					max_values: selectSpec.maxValues,
					placeholder: selectSpec.placeholder
				});
				const select = type === "string" ? {
					...fields,
					type: ComponentType.StringSelect,
					options
				} : {
					...fields,
					type: {
						user: ComponentType.UserSelect,
						role: ComponentType.RoleSelect,
						mentionable: ComponentType.MentionableSelect,
						channel: ComponentType.ChannelSelect
					}[type]
				};
				const entry = stripUndefinedFields({
					id: componentId,
					kind: "select",
					label: selectSpec.placeholder ?? {
						string: "select",
						user: "user select",
						role: "role select",
						mentionable: "mentionable select",
						channel: "channel select"
					}[type],
					callbackData: selectSpec.callbackData,
					callbackDataKind: selectSpec.callbackDataKind,
					selectType: type,
					options: type === "string" ? options.map((option) => ({
						value: option.value,
						label: option.label
					})) : void 0,
					allowedUsers: selectSpec.allowedUsers
				});
				rowComponents.push(select);
				addEntry(entry);
			}
			containerChildren.push({
				type: ComponentType.ActionRow,
				components: rowComponents
			});
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
		if (lastChild?.type === ComponentType.ActionRow && lastChild.components.length < 5 && lastChild.components.every((child) => child.type === ComponentType.Button)) lastChild.components.push(component);
		else containerChildren.push({
			type: ComponentType.ActionRow,
			components: [component]
		});
	}
	if (containerChildren.length === 0) throw new Error("components must include at least one block, text, or modal trigger");
	const container = asSerializableComponent(stripUndefinedFields({
		type: ComponentType.Container,
		components: containerChildren,
		accent_color: colorToNumber(params.spec.container?.accentColor),
		spoiler: params.spec.container?.spoiler || void 0
	}));
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
// extensions/discord/src/internal/components.message.ts
var AnySelectMenu = class extends BaseMessageInteractiveComponent {
	constructor(..._args) {
		super(..._args);
		this.isV2 = false;
		this.defer = false;
		this.ephemeral = false;
		this.customIdParser = parseCustomId;
		this.disabled = false;
	}
	run(_interaction, _data) {}
	serializeOptions() {
		return {
			type: this.type,
			default_values: this.defaultValues
		};
	}
	serialize() {
		return stripUndefinedFields({
			...this.serializeOptions(),
			custom_id: this.customId,
			placeholder: this.placeholder,
			min_values: this.minValues,
			max_values: this.maxValues,
			disabled: this.disabled || void 0,
			required: this.required
		});
	}
};
var StringSelectMenu = class extends AnySelectMenu {
	constructor(..._args2) {
		super(..._args2);
		this.type = ComponentType.StringSelect;
	}
	serializeOptions() {
		return {
			type: this.type,
			options: this.options
		};
	}
};
var UserSelectMenu = class extends AnySelectMenu {
	constructor(..._args3) {
		super(..._args3);
		this.type = ComponentType.UserSelect;
	}
};
var RoleSelectMenu = class extends AnySelectMenu {
	constructor(..._args4) {
		super(..._args4);
		this.type = ComponentType.RoleSelect;
	}
};
// extensions/discord/src/components.modal.ts
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
		const select = field.type === "select" ? new class extends StringSelectMenu {
			constructor(..._args2) {
				super(..._args2);
				this.customId = field.id;
				this.options = field.options ?? [];
			}
		}() : field.type === "role-select" ? new class extends RoleSelectMenu {
			constructor(..._args3) {
				super(..._args3);
				this.customId = field.id;
			}
		}() : new class extends UserSelectMenu {
			constructor(..._args4) {
				super(..._args4);
				this.customId = field.id;
			}
		}();
		select.required = field.required;
		select.minValues = field.minValues;
		select.maxValues = field.maxValues;
		select.placeholder = field.placeholder;
		return select;
	}
	const group = field.type === "checkbox" ? new class extends CheckboxGroup {
		constructor(..._args5) {
			super(..._args5);
			this.customId = field.id;
		}
	}() : new class extends RadioGroup {
		constructor(..._args6) {
			super(..._args6);
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
				constructor(..._args7) {
					super(..._args7);
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
// extensions/discord/src/components.ts
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
export { buildDiscordComponentMessage as a, coerceDiscordComponentParam as c, createDiscordFormModal as i, readDiscordComponentSpec as l, formatDiscordComponentEventText as n, buildDiscordComponentMessageFlags as o, DiscordFormModal as r, DISCORD_COMPONENT_ATTACHMENT_PREFIX as s, components_exports as t, resolveDiscordComponentAttachmentName as u };
