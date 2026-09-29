import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { l as deliverAgentHarnessUserInputPrompt, o as runAgentHarnessGatewayQuestion } from "./gateway-question-D_lf0vLm.mjs";
//#region src/agents/harness/structured-input-boundary.ts
const MAX_SNAPSHOT_DEPTH = 8;
const MAX_SNAPSHOT_NODES = 256;
const MAX_SNAPSHOT_OBJECT_KEYS = 32;
const MAX_SNAPSHOT_ARRAY_ITEMS = 16;
const MAX_SNAPSHOT_TEXT = 65536;
const MAX_FIELD_NAME$1 = 256;
/** Copies only bounded, enumerable own data properties without invoking accessors. */
function snapshotStructuredInput(value) {
	let nodes = 0;
	const visit = (current, depth) => {
		nodes += 1;
		if (nodes > MAX_SNAPSHOT_NODES || depth > MAX_SNAPSHOT_DEPTH) return;
		if (current === null || typeof current === "boolean") return current;
		if (typeof current === "number") return Number.isFinite(current) ? current : void 0;
		if (typeof current === "string") return current.length <= MAX_SNAPSHOT_TEXT ? current : void 0;
		if (typeof current !== "object") return;
		if (Array.isArray(current)) {
			if (Object.getPrototypeOf(current) !== Array.prototype || current.length > MAX_SNAPSHOT_ARRAY_ITEMS) return;
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
			Object.defineProperty(result, key, {
				configurable: true,
				enumerable: true,
				value: item,
				writable: true
			});
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
function readStructuredInputText(value, maximum) {
	return typeof value === "string" && value.length <= maximum && !hasUnsafeVisibleCharacters(value) ? value : void 0;
}
function hasUnsafeVisibleCharacters(value) {
	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? 0;
		if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159 || codePoint >= 8203 && codePoint <= 8207 || codePoint >= 8232 && codePoint <= 8238 || codePoint === 8288 || codePoint >= 8294 && codePoint <= 8297 || codePoint === 65279) return true;
	}
	return false;
}
function boundStructuredInputText(value, maximum) {
	return value.length <= maximum ? value : `${truncateUtf16Safe(value, maximum - 1)}…`;
}
function quoteStructuredInputValue(value) {
	return JSON.stringify(value ?? "unknown");
}
//#endregion
//#region src/agents/harness/structured-input-schema.ts
const MAX_SCHEMA_KEYS$1 = 24;
const MAX_FIELD_TEXT = 512;
const MAX_CHOICE_COUNT = 4;
const MAX_CHOICE_LABEL = 64;
const MAX_CHOICE_VALUE = 256;
const MAX_IMAGE_PICKER_ID = 128;
const MAX_INPUT_TEXT = 4096;
function compileStructuredInputField(context, schema, options) {
	if (!structuredInputEntries(schema, MAX_SCHEMA_KEYS$1)) return "has an over-limit schema.";
	const type = structuredInputString(schema, "type");
	if (type === "openai/imagePicker") return options.allowImagePicker === true ? compileImagePickerField(context, schema) : `uses unsupported type ${quoteStructuredInputValue(type)}.`;
	if (type === "boolean") return compileBooleanField(context, schema, options);
	if (type === "number" || type === "integer") return compileNumberField(context, schema, type);
	if (type === "array") return compileMultiSelectField(context, schema, options);
	if (type !== "string") return `uses unsupported type ${quoteStructuredInputValue(type)}.`;
	const choices = readChoices(schema, options);
	if (typeof choices === "string") return choices;
	return choices ? compileChoiceField(context, schema, choices) : compileStringField(context, schema);
}
function compileStringField(context, schema) {
	const minLength = structuredInputInteger(schema, "minLength", 0);
	const maxLength = structuredInputInteger(schema, "maxLength", 0);
	if (minLength === null || maxLength === null || minLength !== void 0 && minLength > MAX_INPUT_TEXT || maxLength !== void 0 && maxLength > MAX_INPUT_TEXT || minLength !== void 0 && maxLength !== void 0 && minLength > maxLength) return "has invalid string length constraints.";
	const pattern = structuredInputValue(schema, "pattern");
	if (pattern !== void 0 && pattern !== null) return "uses an unsupported pattern constraint.";
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
		if (minLength !== void 0 && value.length < minLength) return `must contain at least ${minLength} characters.`;
		if (maxLength !== void 0 && value.length > maxLength) return `must contain at most ${maxLength} characters.`;
		if (format && !matchesStringFormat(value, format)) return `is not a valid ${format} value.`;
	};
	if (defaultText !== void 0) {
		const error = validate(defaultText);
		if (error) return `has a default that ${error}`;
	}
	return buildField(context, schema, {
		constraints: [
			minLength !== void 0 ? `minimum ${minLength} characters` : void 0,
			`maximum ${maxLength ?? MAX_INPUT_TEXT} characters`,
			format ? `format: ${format}` : void 0
		],
		options: null,
		isOther: true,
		defaultValue: defaultText,
		decode: (values) => {
			const missing = decodeMissing(context, values, defaultText);
			if (missing) return missing;
			const value = values[0] ?? "";
			const error = validate(value);
			return error ? invalid(context, error) : {
				kind: "present",
				value
			};
		}
	});
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
			const missing = decodeMissing(context, values, defaultValue);
			if (missing) return missing;
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
			const missing = decodeMissing(context, values, defaultValue);
			if (missing) return missing;
			const selected = findChoice(choices, values[0]);
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
			const missing = decodeMissing(context, values, defaultValue);
			if (missing) return missing;
			const selected = findChoice(choices, values[0]);
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
	const choices = readArrayChoices(items, options);
	if (typeof choices === "string") return choices;
	const minItems = structuredInputInteger(schema, "minItems", 0);
	const maxItems = structuredInputInteger(schema, "maxItems", 0);
	if (minItems === null || maxItems === null || minItems !== void 0 && maxItems !== void 0 && minItems > maxItems || maxItems !== void 0 && maxItems > choices.length) return "has invalid multi-select limits.";
	const rawDefault = structuredInputValue(schema, "default");
	const defaultEntries = rawDefault === null ? void 0 : structuredInputArray(schema, "default", choices.length);
	const defaultValue = defaultEntries?.filter((value) => typeof value === "string");
	if (rawDefault !== void 0 && rawDefault !== null && (!defaultEntries || defaultValue?.length !== defaultEntries.length || defaultValue.some((value) => !choices.some((choice) => choice.value === value)) || minItems !== void 0 && defaultValue.length < minItems || maxItems !== void 0 && defaultValue.length > maxItems)) return "has an invalid multi-select default.";
	return buildField(context, schema, {
		constraints: [minItems !== void 0 ? `choose at least ${minItems}` : void 0, maxItems !== void 0 ? `choose at most ${maxItems}` : void 0],
		options: choices,
		isOther: false,
		multiSelect: true,
		defaultValue,
		decode: (values) => {
			const missing = decodeMissing(context, values, defaultValue);
			if (missing) return missing;
			const decoded = values.flatMap((value) => {
				const choice = findChoice(choices, value);
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
	const items = structuredInputArray(schema, "items", MAX_CHOICE_COUNT);
	if (!items || items.length === 0) return `must contain 1 to ${MAX_CHOICE_COUNT} image choices.`;
	const choices = [];
	for (const item of items) {
		if (!isStructuredInputRecord(item)) return "has an invalid image choice.";
		const id = structuredInputString(item, "id");
		const title = structuredInputString(item, "title");
		if (!id || !title || id.length > MAX_IMAGE_PICKER_ID || title.length > MAX_CHOICE_LABEL || hasUnsafeVisibleCharacters(id) || hasUnsafeVisibleCharacters(title)) return "has an image choice with an invalid or over-limit id/title.";
		choices.push({
			value: id,
			label: title
		});
	}
	return validateChoices(choices) ?? compileChoiceField(context, schema, choices);
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
			header: boundStructuredInputText(title, 12),
			question: boundStructuredInputText(details.length > 0 ? `${title}\n${details.join(" ")}` : title, MAX_FIELD_TEXT),
			...params.multiSelect ? { multiSelect: true } : {},
			isOther: params.isOther,
			isSecret: context.secret,
			options: params.options?.map((choice) => ({
				label: choice.label,
				...choice.description ? { description: choice.description } : {}
			})) ?? null
		},
		decode: (values) => {
			const decoded = params.decode(values);
			if (decoded.kind !== "present") return decoded;
			const selectedDeclaredChoice = params.options?.some((choice) => choice.label.toLowerCase() === values[0]?.trim().toLowerCase());
			return {
				kind: "present",
				entries: [[context.otherFieldId && params.options && values.some((value) => value !== "") && !selectedDeclaredChoice ? context.otherFieldId : context.fieldId, decoded.value]]
			};
		}
	};
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
		})), options.minimumChoiceCount ?? 1);
	}
	if (oneOfValue !== void 0 && oneOfValue !== null) {
		if (!Array.isArray(oneOfValue)) return "has an invalid oneOf.";
		return normalizeChoices(oneOfValue.map((entry) => ({
			value: isStructuredInputRecord(entry) ? structuredInputValue(entry, "const") : void 0,
			label: isStructuredInputRecord(entry) ? structuredInputValue(entry, "title") : void 0,
			description: isStructuredInputRecord(entry) ? structuredInputValue(entry, "description") : void 0
		})), options.minimumChoiceCount ?? 1);
	}
}
function readArrayChoices(items, options) {
	if (structuredInputString(items, "type") === "string") return readChoices(items, options) ?? "must declare enum or oneOf array choices.";
	const entries = structuredInputValue(items, "anyOf") ?? structuredInputValue(items, "oneOf");
	if (!Array.isArray(entries)) return "must declare string enum, anyOf, or oneOf array choices.";
	return normalizeChoices(entries.map((entry) => ({
		value: isStructuredInputRecord(entry) ? structuredInputValue(entry, "const") : void 0,
		label: isStructuredInputRecord(entry) ? structuredInputValue(entry, "title") : void 0,
		description: isStructuredInputRecord(entry) ? structuredInputValue(entry, "description") : void 0
	})), options.minimumChoiceCount ?? 1);
}
function normalizeChoices(raw, minimum) {
	if (raw.length < minimum || raw.length > MAX_CHOICE_COUNT) return `must declare between ${minimum} and ${MAX_CHOICE_COUNT} choices; choices are never truncated.`;
	const choices = [];
	for (const entry of raw) {
		const description = entry.description === void 0 || entry.description === null ? void 0 : readStructuredInputText(entry.description, MAX_FIELD_TEXT);
		if (typeof entry.value !== "string" || typeof entry.label !== "string" || !entry.value || !entry.label || entry.value.length > MAX_CHOICE_VALUE || entry.label.length > MAX_CHOICE_LABEL || hasUnsafeVisibleCharacters(entry.value) || hasUnsafeVisibleCharacters(entry.label) || entry.description !== void 0 && entry.description !== null && !description) return "contains an invalid or over-limit choice.";
		choices.push({
			value: entry.value,
			label: entry.label,
			...description ? { description } : {}
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
	if (format === "uri") try {
		return Boolean(new URL(value).protocol);
	} catch {
		return false;
	}
	if (format === "date") {
		if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
		const date = /* @__PURE__ */ new Date(`${value}T00:00:00.000Z`);
		return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
	}
	return /^\d{4}-\d{2}-\d{2}T/u.test(value) && !Number.isNaN(Date.parse(value));
}
function findChoice(choices, raw) {
	const value = raw?.trim().toLowerCase();
	return choices.find((choice) => choice.label.toLowerCase() === value || choice.value.toLowerCase() === value);
}
function displayDefault(value) {
	return boundStructuredInputText(Array.isArray(value) ? value.join(", ") : String(value), 80);
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
	const intro = readStructuredInputText(params.message ?? params.fallbackMessage, MAX_MESSAGE_TEXT);
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
//#region src/agents/harness/structured-input-execution.ts
const QUESTION_BATCH_SIZE = 3;
const STATUS_TEXT_LIMIT = 1024;
const EMPTY_FORM_ALLOW_LABEL = "Allow";
/** Executes one compiled form or URL with shared batching, secret, and fencing semantics. */
async function runStructuredInput(params) {
	if (params.input.kind === "unsupported") {
		await showStatus(params, params.input.message);
		return {
			status: "unsupported",
			message: params.input.message
		};
	}
	if (!isActive(params)) return {
		status: "cancelled",
		message: "Input request is no longer active."
	};
	const { plan } = params.input;
	if (plan.kind === "url") return runConfirmation(params, plan.question, {
		acceptLabel: STRUCTURED_INPUT_URL_COMPLETED_LABEL,
		subject: "URL confirmation",
		intro: params.promptOptions?.urlIntro
	});
	if (plan.fields.length === 0) return runConfirmation(params, {
		id: "confirm",
		header: "Confirm",
		question: plan.intro || "Allow this request?",
		isOther: false,
		isSecret: false,
		options: [{ label: EMPTY_FORM_ALLOW_LABEL }, { label: "Decline" }]
	}, {
		acceptLabel: EMPTY_FORM_ALLOW_LABEL,
		subject: "Form confirmation"
	});
	return runForm(params, plan.intro, plan.fields);
}
async function runConfirmation(params, question, confirmation) {
	const result = await ask(params, [question], 0, confirmation.intro);
	if (!isActive(params)) return {
		status: "cancelled",
		message: `${confirmation.subject} was cancelled before commit.`
	};
	if (result.status !== "answered") {
		const cancellation = cancellationFor(result, confirmation.subject);
		if (cancellation.message) await showStatus(params, cancellation.message);
		return cancellation;
	}
	return (result.answers.answers[question.id]?.[0])?.toLowerCase() === confirmation.acceptLabel.toLowerCase() ? {
		status: "answered",
		answers: result.answers.answers,
		content: {}
	} : { status: "declined" };
}
async function runForm(params, intro, fields) {
	const answers = {};
	let index = 0;
	let batch = 0;
	while (index < fields.length) {
		if (!isActive(params)) return {
			status: "cancelled",
			message: "Form input was cancelled before completion."
		};
		const field = fields[index];
		if (field.question.isSecret) {
			index += 1;
			const result = await ask(params, [field.question], batch, intro);
			batch += 1;
			if (!isActive(params)) return {
				status: "cancelled",
				message: "Secret input was cancelled before commit."
			};
			if (result.status !== "answered") {
				const cancellation = cancellationFor(result, "Secret input");
				if (cancellation.message) await showStatus(params, cancellation.message);
				return cancellation;
			}
			answers[field.question.id] = result.answers.answers[field.question.id] ?? [];
			continue;
		}
		const ordinary = [];
		while (index < fields.length && ordinary.length < QUESTION_BATCH_SIZE && !fields[index]?.question.isSecret) ordinary.push(fields[index++]);
		const result = await ask(params, ordinary.map((entry) => entry.question), batch, intro);
		batch += 1;
		if (!isActive(params)) return {
			status: "cancelled",
			message: "Form input was cancelled before commit."
		};
		if (result.status !== "answered") {
			const cancellation = cancellationFor(result, "Form input");
			if (cancellation.message) await showStatus(params, cancellation.message);
			return cancellation;
		}
		for (const entry of ordinary) answers[entry.question.id] = result.answers.answers[entry.question.id] ?? [];
	}
	const content = [];
	for (const field of fields) {
		const decoded = field.decode(answers[field.question.id] ?? []);
		if (decoded.kind === "invalid") {
			await showStatus(params, decoded.message);
			return {
				status: "declined",
				message: decoded.message
			};
		}
		if (decoded.kind === "present") content.push(...decoded.entries);
	}
	if (!isActive(params)) return {
		status: "cancelled",
		message: "Form input was cancelled before commit."
	};
	return {
		status: "answered",
		answers,
		content: Object.fromEntries(content)
	};
}
function ask(params, questions, batch, intro) {
	return runAgentHarnessGatewayQuestion({
		questions,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		runId: params.runId,
		timeoutMs: params.timeoutMs,
		gatewayCall: params.gatewayCall,
		delivery: params.delivery,
		promptOptions: {
			...params.promptOptions,
			...intro ? { intro } : {}
		},
		signal: params.signal,
		questionId: params.questionId?.(batch)
	});
}
function isActive(params) {
	return params.signal?.aborted !== true && (params.isActive?.() ?? true);
}
function cancellationFor(result, subject) {
	return {
		status: "cancelled",
		message: result.status === "expired" ? `${subject} expired.` : `${subject} was cancelled.`
	};
}
async function showStatus(params, message) {
	const question = {
		id: "unsupported",
		header: "Unsupported",
		question: message.slice(0, STATUS_TEXT_LIMIT),
		isOther: false,
		isSecret: false,
		options: null
	};
	try {
		await deliverAgentHarnessUserInputPrompt(params.delivery, [question], {
			...params.promptOptions,
			intro: params.promptOptions?.unsupportedIntro ?? "Input request could not be shown:"
		});
	} catch {}
}
//#endregion
export { isStructuredInputRecord as a, compileStructuredInputUrl as i, compileStructuredInputForm as n, snapshotStructuredInput as o, compileStructuredInputQuestions as r, runStructuredInput as t };
