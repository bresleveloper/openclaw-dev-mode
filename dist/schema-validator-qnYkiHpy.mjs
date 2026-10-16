import { m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { a as normalizeJsonSchemaForTypeBox, o as normalizeTypeBoxValidationErrors } from "./json-schema-BLReYZIW.mjs";
import { n as findJsonSchemaShapeError, t as applyJsonSchemaDefaults } from "./json-schema-defaults-YR_-N2-u.mjs";
import { Check, Compile, Pointer } from "typebox/schema";
import { Format } from "typebox/format";
//#region src/config/allowed-values.ts
const MAX_ALLOWED_VALUES_HINT = 12;
const MAX_ALLOWED_VALUE_CHARS = 160;
function truncateHintText(text, limit) {
	if (text.length <= limit) return text;
	const truncated = truncateUtf16Safe(text, limit);
	return `${truncated}... (+${text.length - truncated.length} chars)`;
}
function safeStringify(value) {
	if (value === void 0) return "";
	try {
		const serialized = JSON.stringify(value);
		if (serialized !== void 0) return serialized;
	} catch {}
	return String(value);
}
function toAllowedValueLabel(value) {
	if (typeof value === "string") return JSON.stringify(truncateHintText(value, MAX_ALLOWED_VALUE_CHARS));
	return truncateHintText(safeStringify(value), MAX_ALLOWED_VALUE_CHARS);
}
function toAllowedValueValue(value) {
	return typeof value === "string" ? value : safeStringify(value);
}
function toAllowedValueDedupKey(value) {
	return `${value === null ? "null" : typeof value}:${toAllowedValueValue(value)}`;
}
/** Summarizes enum/allowed-value candidates for compact validation error hints. */
function summarizeAllowedValues(values) {
	if (values.length === 0) return null;
	const deduped = [];
	const seenValues = /* @__PURE__ */ new Set();
	for (const item of values) {
		const dedupeKey = toAllowedValueDedupKey(item);
		if (seenValues.has(dedupeKey)) continue;
		seenValues.add(dedupeKey);
		deduped.push({
			value: toAllowedValueValue(item),
			label: toAllowedValueLabel(item)
		});
	}
	const shown = deduped.slice(0, MAX_ALLOWED_VALUES_HINT);
	const hiddenCount = deduped.length - shown.length;
	const formattedCore = shown.map((entry) => entry.label).join(", ");
	const formatted = hiddenCount > 0 ? `${formattedCore}, ... (+${hiddenCount} more)` : formattedCore;
	return {
		values: shown.map((entry) => entry.value),
		hiddenCount,
		formatted
	};
}
/** Appends an allowed-values hint unless the validation message already includes one. */
function appendAllowedValuesHint(message, summary) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	if (lower.includes("(allowed:") || lower.includes("expected one of")) return message;
	return `${message} (allowed: ${summary.formatted})`;
}
//#endregion
//#region src/plugins/schema-validator.ts
const schemaCache = new LruCache(512);
const annotationOnlyFormats = [
	"date-time",
	"date",
	"duration",
	"email",
	"hostname",
	"idn-email",
	"idn-hostname",
	"ipv4",
	"ipv6",
	"iri-reference",
	"iri",
	"json-pointer-uri-fragment",
	"json-pointer",
	"regex",
	"relative-json-pointer",
	"time",
	"uri-reference",
	"uri-template",
	"url",
	"uuid"
];
function schemaHasDefaults(schema) {
	if (!schema || typeof schema !== "object") return false;
	if (Array.isArray(schema)) return schema.some(schemaHasDefaults);
	return Object.hasOwn(schema, "default") || Object.values(schema).some(schemaHasDefaults);
}
function applyValidatedSourceDefaults(value, source, defaulted) {
	if (source === void 0) return value === void 0 ? defaulted : value;
	const target = asOptionalObjectRecord(value);
	const original = asOptionalObjectRecord(source);
	const hydrated = asOptionalObjectRecord(defaulted);
	if (target && original && hydrated) {
		for (const [key, entry] of Object.entries(hydrated)) if (!isBlockedObjectKey(key) && (Object.hasOwn(target, key) || !Object.hasOwn(original, key))) target[key] = applyValidatedSourceDefaults(target[key], original[key], entry);
	}
	return value;
}
function compileSchema(schema) {
	return withPluginFormatSemantics(() => Compile(normalizeJsonSchemaForTypeBox(schema)));
}
function relaxConditionalRequiredKeywords(schema, insideConditionalBranch = false) {
	if (Array.isArray(schema)) return schema.map((entry) => relaxConditionalRequiredKeywords(entry, insideConditionalBranch));
	if (!schema || typeof schema !== "object") return schema;
	return Object.fromEntries(Object.entries(schema).filter(([key]) => !(insideConditionalBranch && key === "required")).map(([key, value]) => [key, typeof value === "boolean" || value && typeof value === "object" ? relaxConditionalRequiredKeywords(value, insideConditionalBranch || key === "then" || key === "else") : value]));
}
function withPluginFormatSemantics(callback) {
	const previousFormats = Format.Entries();
	Format.Set("uri", (value) => URL.canParse(value));
	for (const format of annotationOnlyFormats) Format.Set(format, () => true);
	try {
		return callback();
	} finally {
		Format.Clear();
		for (const [format, check] of previousFormats) Format.Set(format, check);
	}
}
function checkSchemaWithCurrentFormats(validate, value) {
	if (validate.Check(value)) return null;
	return normalizeTypeBoxValidationErrors(validate.Errors(value)[1]);
}
function parseJsonSchemaIssuePath(path) {
	if (!path || path === "<root>") return [];
	return path.split(".").map((segment) => parseConfigPathArrayIndex(segment) ?? segment);
}
function normalizeErrorPath(instancePath) {
	return Pointer.Indices(instancePath ?? "").join(".").replace(/\//g, ".") || "<root>";
}
function appendPathSegment(path, segment) {
	const trimmed = segment.trim();
	if (!trimmed) return path;
	if (path === "<root>") return trimmed;
	return `${path}.${trimmed}`;
}
function resolveMissingProperties(error) {
	const properties = error.keyword === "required" ? error.params?.requiredProperties : error.keyword === "dependentRequired" || error.keyword === "dependencies" ? error.params?.dependencies : void 0;
	if (!Array.isArray(properties) || error.keyword !== "required" && properties.length !== 1) return [];
	return properties.filter((property) => typeof property === "string");
}
function getAllowedValuesSummary(error) {
	if (error.keyword === "enum") {
		const allowedValues = error.params?.allowedValues;
		return Array.isArray(allowedValues) ? summarizeAllowedValues(allowedValues) : null;
	}
	if (error.keyword === "const") {
		const params = error.params;
		if (!params || !Object.hasOwn(params, "allowedValue")) return null;
		return summarizeAllowedValues([params.allowedValue]);
	}
	return null;
}
function resolveAdditionalProperty(error) {
	if (error.keyword !== "additionalProperties") return;
	const value = error.params?.additionalProperty;
	return Array.isArray(value) ? value.find((entry) => readNonBlankString(entry) !== void 0) : readNonBlankString(value);
}
function resolveAdditionalProperties(error) {
	if (error.keyword !== "additionalProperties") return [];
	const additionalProperties = error.params?.additionalProperties;
	if (Array.isArray(additionalProperties)) return additionalProperties.filter((entry) => typeof entry === "string");
	const additionalProperty = error.params?.additionalProperty;
	return typeof additionalProperty === "string" ? [additionalProperty] : [];
}
function formatAdditionalPropertiesMessage(error) {
	const additionalProperties = resolveAdditionalProperties(error);
	if (additionalProperties.length === 0) return null;
	return `must not have additional properties: ${additionalProperties.map((entry) => `"${entry}"`).join(", ")}`;
}
function formatValidationErrors(errors) {
	if (!errors || errors.length === 0) return [{
		path: "<root>",
		message: "invalid config",
		text: "<root>: invalid config"
	}];
	const seenDependencyConditions = /* @__PURE__ */ new Set();
	return errors.flatMap((error) => {
		if (error.keyword === "dependentRequired" || error.keyword === "dependencies") {
			const condition = JSON.stringify([
				error.keyword,
				error.schemaPath,
				error.instancePath,
				error.params?.property,
				error.params?.dependencies
			]);
			if (seenDependencyConditions.has(condition)) return [];
			seenDependencyConditions.add(condition);
		}
		const missingProperties = resolveMissingProperties(error);
		const allowedValuesSummary = getAllowedValuesSummary(error);
		const additionalProperty = resolveAdditionalProperty(error);
		return (missingProperties.length ? missingProperties : [void 0]).map((missingProperty) => {
			const basePath = normalizeErrorPath(error.instancePath);
			const path = missingProperty === void 0 ? basePath : appendPathSegment(basePath, missingProperty);
			const baseMessage = missingProperty === void 0 ? formatAdditionalPropertiesMessage(error) ?? error.message ?? "invalid" : `must have required property '${missingProperty}'`;
			const message = allowedValuesSummary ? appendAllowedValuesHint(baseMessage, allowedValuesSummary) : baseMessage;
			const formattedError = {
				path,
				message,
				text: `${sanitizeTerminalText(path)}: ${sanitizeTerminalText(message)}`
			};
			if (additionalProperty) formattedError.additionalProperty = additionalProperty;
			if (allowedValuesSummary) {
				formattedError.allowedValues = allowedValuesSummary.values;
				formattedError.allowedValuesHiddenCount = allowedValuesSummary.hiddenCount;
			}
			return formattedError;
		});
	});
}
/**
* Validate a value against a schema supplied by a plugin manifest.
* External manifest schemas are third-party input, so every failure mode becomes
* a validation result. Bundled schemas stay on the throwing path because a malformed
* repository-owned schema is a programming error and must stay loud.
*/
function validatePluginSchemaValue(params) {
	const { origin, ...validationParams } = params;
	if (origin === "bundled") {
		const result = validateJsonSchemaValue(validationParams);
		return result.ok ? result : {
			...result,
			schemaError: false
		};
	}
	try {
		const result = validateJsonSchemaValue(validationParams);
		return result.ok ? result : {
			...result,
			schemaError: false
		};
	} catch (error) {
		const text = sanitizeTerminalText(error instanceof Error ? error.message : String(error));
		return {
			ok: false,
			errors: [{
				path: "<root>",
				message: text,
				text
			}],
			schemaError: true
		};
	}
}
/**
* Validate a plugin-owned value against a JSON Schema, optionally hydrating schema defaults.
* Schema contents own compiled-validator identity, independently of callers and default application.
*/
function validateJsonSchemaValue(params) {
	let cacheKey;
	try {
		cacheKey = JSON.stringify(params.schema);
	} catch (error) {
		const schemaError = findJsonSchemaShapeError(params.schema);
		throw schemaError ? new Error(sanitizeTerminalText(`invalid schema: ${schemaError}`)) : error;
	}
	let cached = params.cache === false ? void 0 : schemaCache.get(cacheKey);
	if (!cached || cached.schema !== params.schema) {
		const schemaError = findJsonSchemaShapeError(params.schema);
		if (schemaError) throw new Error(sanitizeTerminalText(`invalid schema: ${schemaError}`));
	}
	if (!cached) {
		cached = {
			hasDefaults: schemaHasDefaults(params.schema),
			validate: compileSchema(params.schema),
			schema: params.schema
		};
		if (params.cache !== false) schemaCache.set(cacheKey, cached);
	} else if (cached.schema !== params.schema) cached.schema = params.schema;
	return withPluginFormatSemantics(() => {
		const originalValue = params.sourceValue === void 0 ? params.value : params.sourceValue;
		const value = params.applyDefaults && cached.hasDefaults ? applyJsonSchemaDefaults(params.schema, structuredClone(originalValue)) : originalValue;
		const errors = checkSchemaWithCurrentFormats(cached.validate, value);
		if (errors && !(params.applyDefaults && value !== originalValue && Check(normalizeJsonSchemaForTypeBox(relaxConditionalRequiredKeywords(params.schema)), value) && cached.validate.Check(originalValue))) return {
			ok: false,
			errors: formatValidationErrors(errors)
		};
		if (originalValue === params.value) return {
			ok: true,
			value
		};
		return {
			ok: true,
			value: value === originalValue ? params.value : applyValidatedSourceDefaults(structuredClone(params.value), originalValue, value)
		};
	});
}
//#endregion
export { summarizeAllowedValues as a, appendAllowedValuesHint as i, validateJsonSchemaValue as n, validatePluginSchemaValue as r, parseJsonSchemaIssuePath as t };
