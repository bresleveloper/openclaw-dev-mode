import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as compileSafeRegex } from "./safe-regex-CLaK5Jxv.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { r as readQuestionResourcePreview, t as isQuestionThumbnail } from "./question-media-CK6_dzlB.mjs";
//#region src/agents/harness/structured-input-boundary.ts
const MAX_SNAPSHOT_DEPTH = 8;
const MAX_SNAPSHOT_NODES = 256;
const MAX_SNAPSHOT_OBJECT_KEYS = 32;
const MAX_SNAPSHOT_ARRAY_ITEMS = 16;
const STRUCTURED_INPUT_MAX_TEXT_CHARS = 65536;
const MAX_FIELD_NAME$1 = 256;
/** Copies only bounded, enumerable own data properties without invoking accessors. */
function snapshotStructuredInput(value, options) {
	const maximumDepth = options?.richForm ? 16 : MAX_SNAPSHOT_DEPTH;
	const maximumNodes = options?.richForm ? 2048 : MAX_SNAPSHOT_NODES;
	const maximumItems = options?.richForm ? 64 : MAX_SNAPSHOT_ARRAY_ITEMS;
	let nodes = 0;
	let textLength = 0;
	const visit = (current, depth) => {
		nodes += 1;
		if (nodes > maximumNodes || depth > maximumDepth) return;
		if (current === null || typeof current === "boolean") return current;
		if (typeof current === "number") return Number.isFinite(current) ? current : void 0;
		if (typeof current === "string") {
			textLength += current.length;
			return current.length <= 65536 && textLength <= 4194304 ? current : void 0;
		}
		if (typeof current !== "object") return;
		if (Array.isArray(current)) {
			if (Object.getPrototypeOf(current) !== Array.prototype || current.length > maximumItems) return;
			const descriptors = Object.getOwnPropertyDescriptors(current);
			if (Reflect.ownKeys(descriptors).some((key) => typeof key !== "string" || key !== "length" && !/^(?:0|[1-9]\d*)$/u.test(key))) return;
			const result = [];
			for (let index = 0; index < current.length; index += 1) {
				const descriptor = descriptors[String(index)];
				if (!descriptor?.enumerable || !("value" in descriptor)) return;
				const item = visit(descriptor.value, depth + 1);
				if (item === void 0) return;
				result.push(item);
			}
			return result;
		}
		const descriptors = Object.getOwnPropertyDescriptors(current);
		const keys = Reflect.ownKeys(descriptors);
		if (keys.length > MAX_SNAPSHOT_OBJECT_KEYS || keys.some((key) => typeof key !== "string" || key.length > MAX_FIELD_NAME$1)) return;
		const result = Object.create(null);
		for (const key of keys) {
			if (typeof key !== "string") return;
			const descriptor = descriptors[key];
			if (!descriptor?.enumerable || !("value" in descriptor)) return;
			if (descriptor.value === void 0) continue;
			const item = visit(descriptor.value, depth + 1);
			if (item === void 0) return;
			result[key] = item;
		}
		return result;
	};
	return visit(value, 0);
}
function isStructuredInputRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function structuredInputEntries(record, maximum) {
	const entries = Object.entries(record);
	return entries.length <= maximum ? entries : void 0;
}
function structuredInputValue(record, key) {
	return Object.hasOwn(record, key) ? record[key] : void 0;
}
function structuredInputString(record, key) {
	const value = structuredInputValue(record, key);
	return typeof value === "string" ? value : void 0;
}
function structuredInputRecord(record, key) {
	const value = structuredInputValue(record, key);
	return isStructuredInputRecord(value) ? value : void 0;
}
function structuredInputArray(record, key, maximum) {
	const value = structuredInputValue(record, key);
	return Array.isArray(value) && value.length <= maximum ? value : void 0;
}
function structuredInputFiniteNumber(record, key) {
	const value = structuredInputValue(record, key);
	if (value === void 0 || value === null) return value;
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function structuredInputInteger(record, key, minimum) {
	const value = structuredInputFiniteNumber(record, key);
	if (value === void 0 || value === null) return value;
	return Number.isInteger(value) && value >= minimum ? value : null;
}
function readStructuredInputText(value, maximum, multiline = false) {
	if (typeof value !== "string" || value.length > maximum) return;
	return hasUnsafeVisibleCharacters(multiline ? value.replace(/[\t\n\r]/gu, "") : value) ? void 0 : value;
}
function hasUnsafeVisibleCharacters(value) {
	return /[\p{Cc}\u200b-\u200f\u2028-\u202e\u2060\u2066-\u2069\ufeff]/u.test(value);
}
function boundStructuredInputText(value, maximum) {
	return value.length <= maximum ? value : `${truncateUtf16Safe(value, maximum - 1)}…`;
}
function quoteStructuredInputValue(value) {
	return JSON.stringify(value ?? "unknown");
}
const MAX_CHOICE_VALUE = 256;
const MAX_FIELD_TEXT = 512;
const MAX_INPUT_TEXT = 4096;
function compileStringField(context, schema, options) {
	const minLength = structuredInputInteger(schema, "minLength", 0);
	const maxLength = structuredInputInteger(schema, "maxLength", 0);
	if (minLength === null || maxLength === null || minLength !== void 0 && minLength > MAX_INPUT_TEXT || maxLength !== void 0 && maxLength > MAX_INPUT_TEXT || minLength !== void 0 && maxLength !== void 0 && minLength > maxLength) return "has invalid string length constraints.";
	const pattern = structuredInputValue(schema, "pattern");
	const regex = typeof pattern === "string" && pattern.length <= MAX_FIELD_TEXT && options.allowRichForms ? pattern === "" ? /(?:)/u : compileSafeRegex(pattern, "u") : void 0;
	if (pattern !== void 0 && pattern !== null && !regex) return "uses an unsupported or unsafe pattern constraint.";
	const exactRegex = regex && typeof pattern === "string" ? new RegExp(pattern, "u") : void 0;
	const suggestions = readSuggestions(schema, options);
	if (typeof suggestions === "string") return suggestions;
	const format = structuredInputString(schema, "format");
	if (format && ![
		"email",
		"uri",
		"date",
		"date-time"
	].includes(format)) return `uses unsupported string format ${quoteStructuredInputValue(format)}.`;
	const defaultValue = structuredInputValue(schema, "default");
	if (defaultValue !== void 0 && defaultValue !== null && typeof defaultValue !== "string") return "has a non-string default.";
	const defaultText = typeof defaultValue === "string" ? defaultValue : void 0;
	const validate = (value) => {
		if (value.length > MAX_INPUT_TEXT) return `must contain at most ${MAX_INPUT_TEXT} characters.`;
		const length = options.allowRichForms ? Array.from(value).length : value.length;
		if (minLength !== void 0 && length < minLength) return `must contain at least ${minLength} characters.`;
		if (maxLength !== void 0 && length > maxLength) return `must contain at most ${maxLength} characters.`;
		if (exactRegex && !exactRegex.test(value)) return "does not match its required pattern.";
		if (format && !matchesStringFormat(value, format)) return `is not a valid ${format} value.`;
	};
	if (defaultText !== void 0) {
		const error = validate(defaultText);
		if (error) return `has a default that ${error}`;
	}
	if (suggestions?.some((choice) => validate(choice.value))) return "has suggestions outside its string constraints.";
	return buildField(context, schema, {
		constraints: [
			minLength !== void 0 ? `minimum ${minLength} characters` : void 0,
			`maximum ${maxLength ?? MAX_INPUT_TEXT} characters`,
			format ? `format: ${format}` : void 0,
			typeof pattern === "string" ? `pattern: ${pattern}` : void 0
		],
		options: suggestions ?? null,
		isOther: true,
		allowEmpty: options.allowRichForms === true && (minLength ?? 0) === 0,
		defaultValue: defaultText,
		decode: (values) => {
			const raw = values[0] ?? "";
			const value = suggestions ? findChoice(suggestions, raw, context.explicitDefaults)?.value ?? raw : raw;
			const error = validate(value);
			return error ? invalid(context, error) : {
				kind: "present",
				value
			};
		}
	});
}
function readSuggestions(schema, options) {
	const raw = structuredInputValue(schema, "x-openai-suggestions");
	if (raw === void 0) return;
	if (!options.allowRichForms || !Array.isArray(raw)) return "uses unsupported or invalid suggestions.";
	if (raw.length === 0) return [];
	return normalizeChoices(raw.map((entry) => readStructuredInputChoice(entry, options)), 1, 64);
}
function readStructuredInputChoice(entry, options) {
	if (!isStructuredInputRecord(entry)) return {
		value: void 0,
		label: void 0
	};
	return {
		value: structuredInputValue(entry, "const"),
		label: structuredInputValue(entry, "title"),
		description: structuredInputValue(entry, "description"),
		thumbnail: options.allowRichForms ? structuredInputValue(entry, "x-openai-thumbnail") : void 0
	};
}
function buildField(context, schema, params) {
	const title = readStructuredInputText(structuredInputString(schema, "title") ?? context.fieldId, MAX_FIELD_TEXT) ?? "Field";
	const details = [
		readStructuredInputText(structuredInputString(schema, "description") ?? "", MAX_FIELD_TEXT) ?? "",
		context.required ? "Required." : "Optional.",
		params.defaultValue !== void 0 ? `Default: ${displayDefault(params.defaultValue)}.` : "",
		params.constraints.filter(Boolean).join("; ")
	].filter(Boolean);
	return {
		question: {
			id: context.questionId,
			presentation: "form",
			...params.resource ? { resource: params.resource } : {},
			header: boundStructuredInputText(title, 12),
			question: boundStructuredInputText(`${title}\n${details.join(" ")}`, MAX_FIELD_TEXT),
			...!context.required || params.allowEmpty ? { allowEmpty: true } : {},
			...params.multiSelect ? { multiSelect: true } : {},
			...params.answerFormat ? { answerFormat: params.answerFormat } : {},
			...params.defaultValue !== void 0 && !context.secret ? { defaultAnswers: (Array.isArray(params.defaultValue) ? params.defaultValue : [String(params.defaultValue)]).map((value) => context.explicitDefaults ? value : params.options?.find((choice) => choice.value === value)?.label ?? value) } : {},
			isOther: params.isOther,
			isSecret: context.secret,
			options: params.options?.map((choice) => ({
				label: choice.label,
				...context.explicitDefaults ? { value: choice.value } : {},
				...choice.description ? { description: choice.description } : {},
				...choice.thumbnail ? { thumbnail: choice.thumbnail } : {},
				...choice.resourceUri ? { resourceUri: choice.resourceUri } : {},
				...choice.preview ? { preview: choice.preview } : {}
			})) ?? null
		},
		decode: (values) => {
			const decoded = ((params.allowEmpty && context.required || params.resource?.selection === "implicit") && values.length === 0 ? void 0 : decodeMissing(context, values, context.explicitDefaults ? void 0 : params.defaultValue)) ?? params.decode(values);
			if (decoded.kind !== "present") return decoded;
			const selectedDeclaredChoice = params.options?.some((choice) => choice.label.trim().toLowerCase() === values[0]?.trim().toLowerCase());
			return {
				kind: "present",
				entries: [[context.otherFieldId && params.options && values.some((value) => value !== "") && !selectedDeclaredChoice ? context.otherFieldId : context.fieldId, decoded.value]]
			};
		}
	};
}
function normalizeChoices(raw, minimum, maximum = 4, maximumValueLength = MAX_CHOICE_VALUE) {
	if (raw.length < minimum || raw.length > maximum) return `must declare between ${minimum} and ${maximum} choices; choices are never truncated.`;
	const choices = [];
	for (const entry of raw) {
		const description = entry.description === void 0 || entry.description === null ? void 0 : readStructuredInputText(entry.description, MAX_FIELD_TEXT);
		if (typeof entry.value !== "string" || typeof entry.label !== "string" || !entry.value || !entry.label || entry.value.length > maximumValueLength || entry.label.length > 64 || hasUnsafeVisibleCharacters(entry.value) || hasUnsafeVisibleCharacters(entry.label) || entry.description !== void 0 && entry.description !== null && !description) return "contains an invalid or over-limit choice.";
		const thumbnail = isStructuredInputRecord(entry.thumbnail) ? structuredInputValue(entry.thumbnail, "src") : void 0;
		if (entry.thumbnail !== void 0 && !isQuestionThumbnail(thumbnail)) return "contains an invalid or over-limit thumbnail.";
		choices.push({
			value: entry.value,
			label: entry.label,
			...description ? { description } : {},
			...typeof thumbnail === "string" ? { thumbnail } : {}
		});
	}
	return validateChoices(choices) ?? choices;
}
function validateChoices(choices) {
	const values = /* @__PURE__ */ new Set();
	const labels = /* @__PURE__ */ new Set();
	for (const choice of choices) {
		const value = choice.value.toLowerCase();
		const label = choice.label.trim().toLowerCase();
		if (values.has(value) || labels.has(label) || values.has(label) || labels.has(value)) return "contains duplicate choice values or titles.";
		values.add(value);
		labels.add(label);
	}
}
function decodeMissing(context, values, defaultValue) {
	if (values.some((value) => value !== "")) return;
	if (defaultValue !== void 0) return {
		kind: "present",
		value: defaultValue
	};
	return context.required ? invalid(context, "is required.") : { kind: "absent" };
}
function invalid(context, message) {
	return {
		kind: "invalid",
		message: boundStructuredInputText(`Field ${quoteStructuredInputValue(context.fieldId)} ${message}`, 400)
	};
}
function matchesStringFormat(value, format) {
	if (format === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
	if (format === "uri") return URL.canParse(value);
	if (format === "date") {
		if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
		const date = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
		return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
	}
	return /^\d{4}-\d{2}-\d{2}T/u.test(value) && !Number.isNaN(Date.parse(value));
}
function findChoice(choices, raw, canonical = false) {
	if (canonical) return choices.find((choice) => choice.value === raw);
	const value = raw?.trim().toLowerCase();
	return choices.find((choice) => choice.label.trim().toLowerCase() === value || choice.value.toLowerCase() === value);
}
function displayDefault(value) {
	return boundStructuredInputText(Array.isArray(value) ? value.join(", ") : String(value), 80);
}
//#endregion
//#region src/agents/harness/structured-input-rich.ts
function compileStringArrayField(context, schema, items, options) {
	const minItems = structuredInputInteger(schema, "minItems", 0);
	const maximum = structuredInputInteger(schema, "maxItems", 0);
	const maxItems = maximum === void 0 ? 16 : maximum;
	const unique = structuredInputValue(schema, "uniqueItems");
	if (minItems === null || maxItems === null || maxItems > 16 || (minItems ?? 0) > maxItems || unique !== void 0 && typeof unique !== "boolean") return "has invalid array constraints.";
	const item = compileStringField({
		...context,
		required: true
	}, items, options);
	if (typeof item === "string") return item;
	const suggestions = readSuggestions(items, options);
	if (typeof suggestions === "string") return suggestions;
	const decode = (values) => {
		if (values.length < (minItems ?? 0) || values.length > maxItems) return invalid(context, `requires between ${minItems ?? 0} and ${maxItems} entries.`);
		const decoded = [];
		for (const value of values) {
			const result = item.decode([value]);
			if (result.kind === "invalid") return result;
			const answer = result.kind === "present" ? result.entries[0]?.[1] : void 0;
			if (typeof answer !== "string") return invalid(context, "contains an invalid string entry.");
			decoded.push(answer);
		}
		if (unique === true && new Set(decoded).size !== decoded.length) return invalid(context, "requires unique entries.");
		return {
			kind: "present",
			value: decoded
		};
	};
	const rawDefault = structuredInputValue(schema, "default");
	const defaultValue = Array.isArray(rawDefault) && rawDefault.every((value) => typeof value === "string") ? rawDefault : void 0;
	if (rawDefault !== void 0 && (!defaultValue || decode(defaultValue).kind !== "present")) return "has an invalid string array default.";
	return buildField(context, schema, {
		constraints: [
			"Enter each custom value on a separate line.",
			item.question.question,
			`between ${minItems ?? 0} and ${maxItems} entries`
		],
		options: suggestions ?? null,
		isOther: true,
		multiSelect: true,
		answerFormat: "lines",
		allowEmpty: (minItems ?? 0) === 0,
		defaultValue,
		decode
	});
}
function compileResourceField(context, schema, options) {
	const input = structuredInputRecord(schema, "x-openai-input");
	const type = structuredInputString(schema, "type");
	if (!input || !["resource", "file"].includes(structuredInputString(input, "type") ?? "") || type !== "string" && type !== "array") return "uses an unsupported resource input.";
	const selection = structuredInputValue(input, "selection") ?? "explicit";
	if (type === "string" && structuredInputValue(input, "selection") !== void 0 || selection !== "explicit" && selection !== "implicit") return "has an invalid resource selection mode.";
	const source = options.resourceContext;
	const rawUserOptions = structuredInputValue(input, "userOptions");
	const userOptions = rawUserOptions === void 0 && selection === "implicit" ? {} : rawUserOptions;
	let upload;
	if (userOptions !== void 0) {
		if (!isStructuredInputRecord(userOptions)) return "has invalid user resource options.";
		const kind = structuredInputValue(userOptions, "kind") ?? "file";
		const accept = structuredInputValue(userOptions, "accept");
		if (kind !== "file" && kind !== "directory" || accept !== void 0 && (!Array.isArray(accept) || accept.length > 32 || !accept.every((entry) => typeof entry === "string" && entry.length <= 128 && /^(?:\.[a-z0-9.+_-]+|[a-z0-9!#$&^_.+-]+\/(?:[a-z0-9!#$&^_.+-]+|\*))$/iu.test(entry)))) return "has invalid resource upload restrictions.";
		if (!source?.uploads) return "requires resource uploads unavailable on this input surface.";
		upload = {
			kind,
			...Array.isArray(accept) ? { accept: accept.filter((entry) => typeof entry === "string") } : {}
		};
	}
	const resources = structuredInputArray(input, "options", 64);
	const itemSchema = type === "array" ? structuredInputRecord(schema, "items") : schema;
	if (!resources || !itemSchema || structuredInputString(itemSchema, "format") !== "uri" || structuredInputString(itemSchema, "type") !== "string") return "has an invalid resource schema.";
	const { "x-openai-input": _input, default: _default, ...stringSchema } = itemSchema;
	const validator = compileStringField({
		...context,
		required: true
	}, stringSchema, options);
	if (typeof validator === "string") return validator;
	const choices = [];
	for (const resource of resources) {
		if (!isStructuredInputRecord(resource)) return "contains an invalid resource.";
		const uri = structuredInputString(resource, "uri");
		const name = structuredInputString(resource, "name");
		if (!uri || uri.length > 2048 || !name || validator.decode([uri]).kind !== "present") return "contains a resource outside its URI constraints.";
		const meta = structuredInputRecord(resource, "_meta");
		const previewMetadata = meta ? structuredInputValue(meta, "openai/preview") : void 0;
		const preview = isStructuredInputRecord(previewMetadata) ? readQuestionResourcePreview(structuredInputValue(previewMetadata, "target")) : void 0;
		if (previewMetadata !== void 0 && (!preview || !source?.previews)) return "requires a resource preview unavailable on this input surface.";
		const normalized = normalizeChoices([{
			value: uri,
			label: structuredInputString(resource, "title") ?? name,
			description: structuredInputValue(resource, "description"),
			thumbnail: meta ? structuredInputValue(meta, "openai/thumbnail") : void 0
		}], 1, 64, 2048);
		if (typeof normalized === "string") return normalized;
		choices.push({
			...normalized[0],
			resourceUri: uri,
			...preview ? { preview } : {}
		});
	}
	const choiceError = validateChoices(choices);
	if (choiceError) return choiceError;
	const minimum = type === "array" ? structuredInputInteger(schema, "minItems", 0) : void 0;
	const maximum = type === "array" ? structuredInputInteger(schema, "maxItems", 0) : 1;
	if (minimum === null || maximum === null || (minimum ?? 0) > (maximum ?? 64) || (maximum ?? 64) > 64) return "has invalid resource selection limits.";
	if (choices.length === 0 && !upload && context.required && (type === "string" || (minimum ?? 0) > 0)) return "has no selectable or uploadable resources for a required selection.";
	const rawDefault = structuredInputValue(schema, "default");
	if (selection === "implicit" && rawDefault !== void 0) return "declares a default for implicit selection.";
	const defaults = typeof rawDefault === "string" && type === "string" ? [rawDefault] : type === "array" && Array.isArray(rawDefault) && rawDefault.every((value) => typeof value === "string") ? rawDefault : void 0;
	if (rawDefault !== void 0 && (!defaults || defaults.some((value) => !choices.some((choice) => choice.value === value)) || new Set(defaults).size !== defaults.length || defaults.length < (minimum ?? 0) || defaults.length > (maximum ?? 64))) return "has an invalid resource default.";
	const defaultValue = selection === "implicit" ? choices.map((choice) => choice.value) : type === "string" ? defaults?.[0] : defaults;
	return buildField(context, schema, {
		constraints: [selection === "implicit" ? "Remove resources to exclude them; all remaining resources will be submitted." : void 0],
		options: choices,
		isOther: Boolean(upload),
		multiSelect: type === "array",
		allowEmpty: type === "array" && (minimum ?? 0) === 0,
		defaultValue,
		resource: {
			...source ? { viewId: source.viewId } : {},
			selection,
			...upload ? { userOptions: upload } : {}
		},
		decode: (values) => {
			if (values.length < (minimum ?? 0) || values.length > (maximum ?? 64)) return invalid(context, "has an invalid number of resources.");
			for (const value of values) if (!findChoice(choices, value, true) && (!upload || !source?.isUploadedResource(context.questionId, value)) || validator.decode([value]).kind !== "present") return invalid(context, "contains a resource not admitted for this field.");
			if (new Set(values).size !== values.length) return invalid(context, "contains duplicate resources.");
			return {
				kind: "present",
				value: type === "array" ? [...values] : values[0] ?? ""
			};
		}
	});
}
//#endregion
//#region src/agents/harness/structured-input-schema.ts
const MAX_SCHEMA_KEYS$1 = 24;
const MAX_IMAGE_PICKER_ID = 128;
function compileStructuredInputField(fieldContext, schema, options) {
	const context = {
		...fieldContext,
		explicitDefaults: options.allowRichForms === true
	};
	if (!structuredInputEntries(schema, MAX_SCHEMA_KEYS$1)) return "has an over-limit schema.";
	if (options.allowRichForms) {
		const supported = /* @__PURE__ */ new Set([
			"type",
			"title",
			"description",
			"default",
			"minLength",
			"maxLength",
			"pattern",
			"format",
			"minimum",
			"maximum",
			"minItems",
			"maxItems",
			"uniqueItems",
			"items",
			"enum",
			"enumNames",
			"oneOf",
			"isSecret",
			"_meta",
			"x-openai-input",
			"x-openai-suggestions"
		]);
		if (Object.keys(schema).some((key) => !supported.has(key))) return "uses unsupported field constraints.";
		if (structuredInputValue(schema, "x-openai-suggestions") !== void 0 && (structuredInputValue(schema, "enum") !== void 0 || structuredInputValue(schema, "oneOf") !== void 0)) return "combines suggestions with a closed choice list.";
	}
	const type = structuredInputString(schema, "type");
	if (structuredInputValue(schema, "x-openai-input") !== void 0) return options.allowRichForms ? compileResourceField(context, schema, options) : "uses an unsupported semantic input.";
	if (type === "openai/imagePicker") return options.allowImagePicker === true ? compileImagePickerField(context, schema) : `uses unsupported type ${quoteStructuredInputValue(type)}.`;
	if (type === "boolean") return compileBooleanField(context, schema, options);
	if (type === "number" || type === "integer") return compileNumberField(context, schema, type);
	if (type === "array") return compileMultiSelectField(context, schema, options);
	if (type !== "string") return `uses unsupported type ${quoteStructuredInputValue(type)}.`;
	const choices = readChoices(schema, options);
	if (typeof choices === "string") return choices;
	return choices ? compileChoiceField(context, schema, choices) : compileStringField(context, schema, options);
}
function compileNumberField(context, schema, type) {
	const minimum = structuredInputFiniteNumber(schema, "minimum");
	const maximum = structuredInputFiniteNumber(schema, "maximum");
	if (minimum === null || maximum === null || minimum !== void 0 && maximum !== void 0 && minimum > maximum) return "has invalid numeric constraints.";
	const rawDefault = structuredInputValue(schema, "default");
	const defaultValue = typeof rawDefault === "number" ? rawDefault : void 0;
	if (rawDefault !== void 0 && rawDefault !== null && defaultValue === void 0) return "has a non-numeric default.";
	const validate = (value) => {
		if (!Number.isFinite(value)) return "must be a finite number.";
		if (type === "integer" && !Number.isInteger(value)) return "must be an integer.";
		if (minimum !== void 0 && value < minimum) return `must be at least ${minimum}.`;
		if (maximum !== void 0 && value > maximum) return `must be at most ${maximum}.`;
	};
	if (defaultValue !== void 0 && validate(defaultValue)) return "has a default outside its numeric constraints.";
	return buildField(context, schema, {
		constraints: [
			type === "integer" ? "whole number" : "number",
			minimum !== void 0 ? `minimum ${minimum}` : void 0,
			maximum !== void 0 ? `maximum ${maximum}` : void 0
		],
		options: null,
		isOther: true,
		defaultValue,
		decode: (values) => {
			const raw = values[0]?.trim() ?? "";
			if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(raw)) return invalid(context, type === "integer" ? "must be an integer." : "must be a number.");
			const value = Number(raw);
			const error = validate(value);
			return error ? invalid(context, error) : {
				kind: "present",
				value
			};
		}
	});
}
function compileBooleanField(context, schema, options) {
	const rawDefault = structuredInputValue(schema, "default");
	const defaultValue = typeof rawDefault === "boolean" ? rawDefault : void 0;
	if (rawDefault !== void 0 && rawDefault !== null && defaultValue === void 0) return "has a non-boolean default.";
	const [positive, negative] = options.booleanLabels ?? ["Yes", "No"];
	const choices = [{
		label: positive,
		value: "true"
	}, {
		label: negative,
		value: "false"
	}];
	return buildField(context, schema, {
		constraints: [],
		options: choices,
		isOther: false,
		defaultValue,
		decode: (values) => {
			const selected = findChoice(choices, values[0], context.explicitDefaults);
			return selected ? {
				kind: "present",
				value: selected.value === "true"
			} : invalid(context, `must be ${positive} or ${negative}.`);
		}
	});
}
function compileChoiceField(context, schema, choices) {
	const rawDefault = structuredInputValue(schema, "default");
	const defaultValue = typeof rawDefault === "string" ? rawDefault : void 0;
	if (rawDefault !== void 0 && rawDefault !== null && (defaultValue === void 0 || !choices.some((choice) => choice.value === defaultValue))) return "has a default outside its declared choices.";
	return buildField(context, schema, {
		constraints: [],
		options: choices,
		isOther: context.otherFieldId !== void 0,
		defaultValue,
		decode: (values) => {
			const selected = findChoice(choices, values[0], context.explicitDefaults);
			if (selected) return {
				kind: "present",
				value: selected.value
			};
			return context.otherFieldId ? {
				kind: "present",
				value: values[0] ?? ""
			} : invalid(context, "contains an undeclared choice.");
		}
	});
}
function compileMultiSelectField(context, schema, options) {
	const items = structuredInputRecord(schema, "items");
	if (!items) return "has no string choice schema for its array items.";
	if (options.allowRichForms && structuredInputString(items, "type") === "string" && structuredInputValue(items, "enum") === void 0 && structuredInputValue(items, "oneOf") === void 0 && structuredInputValue(items, "anyOf") === void 0) return compileStringArrayField(context, schema, items, options);
	const choices = readArrayChoices(items, options);
	if (typeof choices === "string") return choices;
	const minItems = structuredInputInteger(schema, "minItems", 0);
	const maxItems = structuredInputInteger(schema, "maxItems", 0);
	if (minItems === null || maxItems === null || minItems !== void 0 && maxItems !== void 0 && minItems > maxItems || minItems !== void 0 && minItems > choices.length || !options.allowRichForms && maxItems !== void 0 && maxItems > choices.length) return "has invalid multi-select limits.";
	const rawDefault = structuredInputValue(schema, "default");
	const defaultEntries = rawDefault === null ? void 0 : structuredInputArray(schema, "default", choices.length);
	const defaultValue = defaultEntries?.filter((value) => typeof value === "string");
	if (rawDefault !== void 0 && rawDefault !== null && (!defaultEntries || defaultValue?.length !== defaultEntries.length || defaultValue.some((value) => !choices.some((choice) => choice.value === value)) || new Set(defaultValue).size !== defaultValue.length || minItems !== void 0 && defaultValue.length < minItems || maxItems !== void 0 && defaultValue.length > maxItems)) return "has an invalid multi-select default.";
	return buildField(context, schema, {
		constraints: [minItems !== void 0 ? `choose at least ${minItems}` : void 0, maxItems !== void 0 ? `choose at most ${maxItems}` : void 0],
		options: choices,
		isOther: false,
		multiSelect: true,
		allowEmpty: options.allowRichForms === true && (minItems ?? 0) === 0,
		defaultValue,
		decode: (values) => {
			const decoded = values.flatMap((value) => {
				const choice = findChoice(choices, value, context.explicitDefaults);
				return choice ? [choice.value] : [];
			});
			if (decoded.length !== values.length || new Set(decoded).size !== decoded.length) return invalid(context, "contains an invalid or duplicate choice.");
			if (minItems !== void 0 && decoded.length < minItems) return invalid(context, `requires at least ${minItems} choices.`);
			if (maxItems !== void 0 && decoded.length > maxItems) return invalid(context, `allows at most ${maxItems} choices.`);
			return {
				kind: "present",
				value: decoded
			};
		}
	});
}
function compileImagePickerField(context, schema) {
	const items = structuredInputArray(schema, "items", 4);
	if (!items || items.length === 0) return `must contain 1 to 4 image choices.`;
	const choices = [];
	for (const item of items) {
		if (!isStructuredInputRecord(item)) return "has an invalid image choice.";
		const id = structuredInputString(item, "id");
		const title = structuredInputString(item, "title");
		if (!id || !title || id.length > MAX_IMAGE_PICKER_ID || title.length > 64 || hasUnsafeVisibleCharacters(id) || hasUnsafeVisibleCharacters(title)) return "has an image choice with an invalid or over-limit id/title.";
		choices.push({
			value: id,
			label: title
		});
	}
	return validateChoices(choices) ?? compileChoiceField(context, schema, choices);
}
function readChoices(schema, options) {
	const enumValue = structuredInputValue(schema, "enum");
	const oneOfValue = structuredInputValue(schema, "oneOf");
	if (enumValue !== void 0 && enumValue !== null && oneOfValue !== void 0 && oneOfValue !== null) return "declares both enum and oneOf choices.";
	if (enumValue !== void 0 && enumValue !== null) {
		if (!Array.isArray(enumValue)) return "has an invalid enum.";
		const enumNames = options.allowEnumNames ? structuredInputValue(schema, "enumNames") : void 0;
		if (enumNames !== void 0 && (!Array.isArray(enumNames) || enumNames.length !== enumValue.length)) return "has invalid enumNames.";
		return normalizeChoices(enumValue.map((value, index) => ({
			value,
			label: Array.isArray(enumNames) ? enumNames[index] : value
		})), options.minimumChoiceCount ?? 1, options.allowRichForms ? 64 : 4);
	}
	if (oneOfValue !== void 0 && oneOfValue !== null) {
		if (!Array.isArray(oneOfValue)) return "has an invalid oneOf.";
		return normalizeChoices(oneOfValue.map((entry) => readStructuredInputChoice(entry, options)), options.minimumChoiceCount ?? 1, options.allowRichForms ? 64 : 4);
	}
}
function readArrayChoices(items, options) {
	if (structuredInputString(items, "type") === "string") return readChoices(items, options) ?? "must declare enum or oneOf array choices.";
	const entries = structuredInputValue(items, "anyOf") ?? structuredInputValue(items, "oneOf");
	if (!Array.isArray(entries)) return "must declare string enum, anyOf, or oneOf array choices.";
	return normalizeChoices(entries.map((entry) => readStructuredInputChoice(entry, options)), options.minimumChoiceCount ?? 1, options.allowRichForms ? 64 : 4);
}
//#endregion
//#region src/agents/harness/structured-input.ts
const MAX_FORM_FIELDS = 12;
const MAX_SCHEMA_KEYS = 24;
const MAX_FIELD_NAME = 256;
const MAX_MESSAGE_TEXT = 1024;
const MAX_URL_TEXT = 2048;
const STRUCTURED_INPUT_URL_COMPLETED_LABEL = "I've completed this step";
/** Wraps already bounded protocol questions in the shared execution plan. */
function compileStructuredInputQuestions(params) {
	const fields = params.questions.map((question) => ({
		question,
		decode: (values) => values.length === 0 ? { kind: "absent" } : {
			kind: "present",
			entries: [[question.id, question.multiSelect ? [...values] : values[0] ?? ""]]
		}
	}));
	return {
		kind: "ready",
		plan: {
			kind: "form",
			intro: params.intro,
			fields
		}
	};
}
/** Compiles a bounded object schema into Gateway questions plus answer decoders. */
function compileStructuredInputForm(params) {
	const { options } = params;
	const protocol = options.protocolName;
	const schema = isStructuredInputRecord(params.schema) ? params.schema : void 0;
	const properties = schema ? structuredInputRecord(schema, "properties") : void 0;
	if (!schema || structuredInputString(schema, "type") !== "object" || !properties) return unsupported(`OpenClaw cannot show this ${protocol} form because its schema is not an object with properties.`);
	if (!structuredInputEntries(schema, MAX_SCHEMA_KEYS)) return unsupported(`OpenClaw declined an over-limit ${protocol} form schema.`);
	const propertyEntries = structuredInputEntries(properties, MAX_FORM_FIELDS);
	if (!propertyEntries) return unsupported(`OpenClaw supports at most ${MAX_FORM_FIELDS} fields in one ${protocol} form.`);
	if (propertyEntries.length === 0 && options.allowEmptyForm !== true) return unsupported(`OpenClaw cannot show an empty ${protocol} form.`);
	const required = readRequired(schema, properties, protocol);
	if (typeof required === "string") return unsupported(required);
	const richDisplay = options.allowRichForms === true;
	const intro = readStructuredInputText(params.message ?? params.fallbackMessage, richDisplay ? STRUCTURED_INPUT_MAX_TEXT_CHARS : MAX_MESSAGE_TEXT, richDisplay);
	if (!intro) return unsupported(`OpenClaw declined ${protocol} form display text that is invalid or over-limit.`);
	const metadata = /* @__PURE__ */ new Map();
	const otherFields = /* @__PURE__ */ new Map();
	for (const [fieldId, rawSchema] of propertyEntries) {
		if (!validFieldName(fieldId) || !isStructuredInputRecord(rawSchema)) return unsupported(`${protocol} form field ${quoteStructuredInputValue(fieldId)} has an invalid schema.`);
		const fieldMetadata = readFieldMetadata(rawSchema, options.metadata);
		if (typeof fieldMetadata === "string") return unsupported(`${protocol} form field ${quoteStructuredInputValue(fieldId)} ${fieldMetadata}`);
		metadata.set(fieldId, fieldMetadata);
		if (fieldMetadata.otherAnswer) {
			const target = fieldMetadata.otherQuestionId;
			if (!target || otherFields.has(target)) return unsupported(`OpenClaw declined invalid ${protocol} Other-field metadata.`);
			otherFields.set(target, {
				fieldId,
				secret: fieldMetadata.secret
			});
		}
	}
	for (const target of otherFields.keys()) if (!Object.hasOwn(properties, target)) return unsupported(`OpenClaw declined ${protocol} Other-field metadata without its target.`);
	const usedQuestionIds = /* @__PURE__ */ new Set();
	const fields = [];
	for (const [fieldId, rawSchema] of propertyEntries) {
		const fieldMetadata = metadata.get(fieldId);
		if (fieldMetadata.otherAnswer) continue;
		if (!isStructuredInputRecord(rawSchema)) return unsupported(`${protocol} form field ${quoteStructuredInputValue(fieldId)} has an invalid schema.`);
		const other = otherFields.get(fieldId);
		const field = compileStructuredInputField({
			fieldId,
			questionId: normalizeQuestionId(fieldId, usedQuestionIds),
			required: required.has(fieldId),
			secret: fieldMetadata.secret || other?.secret === true,
			otherFieldId: other?.fieldId
		}, rawSchema, options);
		if (typeof field === "string") return unsupported(`${protocol} form field ${quoteStructuredInputValue(fieldId)} ${field}`);
		fields.push(field);
	}
	if (fields.length === 0 && propertyEntries.length > 0) return unsupported(`OpenClaw cannot show a ${protocol} form containing only synthetic fields.`);
	return {
		kind: "ready",
		plan: {
			kind: "form",
			intro,
			fields
		}
	};
}
/** Keeps browser navigation separate from confirmation that the external step is complete. */
function compileStructuredInputUrl(params) {
	const url = typeof params.url === "string" ? params.url : void 0;
	const elicitationId = readStructuredInputText(params.elicitationId, MAX_FIELD_NAME);
	const message = readStructuredInputText(typeof params.message === "string" ? params.message : params.fallbackMessage, MAX_MESSAGE_TEXT);
	if (!url || !hasHttpUrlPrefix(url) || url.length > MAX_URL_TEXT || url.trim() !== url || hasUnsafeVisibleCharacters(url) || !elicitationId || !message) return unsupported(`OpenClaw declined an invalid or over-limit ${params.protocolName} elicitation URL.`);
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return unsupported(`OpenClaw declined an invalid ${params.protocolName} elicitation URL.`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return unsupported(`OpenClaw only presents http or https ${params.protocolName} elicitation URLs.`);
	if (parsed.username || parsed.password) return unsupported(`OpenClaw does not present ${params.protocolName} elicitation URLs containing credentials.`);
	return {
		kind: "ready",
		plan: {
			kind: "url",
			question: {
				id: "continue",
				header: "Browser step",
				question: `${message}\n\n${url}\n\nOpen the link and complete the step in your browser. Then select "${STRUCTURED_INPUT_URL_COMPLETED_LABEL}".`,
				url,
				isOther: false,
				isSecret: false,
				options: [{ label: STRUCTURED_INPUT_URL_COMPLETED_LABEL }, { label: "Decline" }]
			}
		}
	};
}
function readRequired(schema, properties, protocol) {
	const value = structuredInputValue(schema, "required");
	if (value === void 0 || value === null) return /* @__PURE__ */ new Set();
	if (!Array.isArray(value) || value.length > MAX_FORM_FIELDS) return `OpenClaw declined a ${protocol} form with an invalid required list.`;
	const required = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (typeof entry !== "string" || !Object.hasOwn(properties, entry)) return `OpenClaw declined a ${protocol} form with an invalid required field.`;
		required.add(entry);
	}
	return required;
}
function readFieldMetadata(schema, policy) {
	const secret = readMetadataValue(schema, policy?.secretPath);
	const otherAnswer = readMetadataValue(schema, policy?.otherAnswerPath);
	const otherQuestionId = readMetadataValue(schema, policy?.otherQuestionIdPath);
	if (secret !== void 0 && typeof secret !== "boolean") return "has invalid secret metadata.";
	if (otherAnswer !== void 0 && typeof otherAnswer !== "boolean") return "has invalid Other-field metadata.";
	if (otherQuestionId !== void 0 && (typeof otherQuestionId !== "string" || !validFieldName(otherQuestionId))) return "has an invalid Other-field target.";
	return {
		secret: secret === true,
		otherAnswer: otherAnswer === true,
		...typeof otherQuestionId === "string" ? { otherQuestionId } : {}
	};
}
function readMetadataValue(record, path) {
	if (!path || path.length === 0) return;
	let current = record;
	for (const key of path) {
		if (!isStructuredInputRecord(current)) return;
		const value = structuredInputValue(current, key);
		if (value === void 0) return;
		current = value;
	}
	return current;
}
function normalizeQuestionId(value, used) {
	const normalized = value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/gu, "_").replace(/^_+|_+$/gu, "");
	const stem = boundStructuredInputText(/^[a-z]/u.test(normalized) ? normalized : `field_${normalized}`, 48) || "field";
	let candidate = stem;
	let suffix = 2;
	while (used.has(candidate)) {
		const tail = `_${suffix}`;
		candidate = `${truncateUtf16Safe(stem, 48 - tail.length)}${tail}`;
		suffix += 1;
	}
	used.add(candidate);
	return candidate;
}
function validFieldName(value) {
	return Boolean(value) && value.length <= MAX_FIELD_NAME && !hasUnsafeVisibleCharacters(value);
}
function unsupported(message) {
	return {
		kind: "unsupported",
		message: boundStructuredInputText(message, 400)
	};
}
//#endregion
export { isStructuredInputRecord as a, compileStructuredInputUrl as i, compileStructuredInputForm as n, snapshotStructuredInput as o, compileStructuredInputQuestions as r, STRUCTURED_INPUT_URL_COMPLETED_LABEL as t };
