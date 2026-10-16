import { d as asPositiveSafeInteger, f as asSafeIntegerInRange, x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as normalizeSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { h as readLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { t as readSnakeCaseParamRaw } from "./param-key-BvJDza_v.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
//#region src/agents/tools/common.ts
function createActionGate(actions) {
	return (key, defaultValue = true) => {
		const value = actions?.[key];
		if (value === void 0) return defaultValue;
		return value !== false;
	};
}
function isBlankParamValue(raw) {
	return typeof raw === "string" && raw.trim() === "";
}
function readToolStringParam(params, key, options = {}) {
	const { required = false, trim = true, label = key, allowEmpty = false } = options;
	const raw = readSnakeCaseParamRaw(params, key);
	const value = typeof raw === "string" ? trim ? raw.trim() : raw : void 0;
	if (value === void 0 || !value && !allowEmpty) {
		if (required) throw new ToolInputError(`${label} required`);
		return;
	}
	return value;
}
/** "default" resets a model override to its configured fallback. */
function normalizeToolModelOverride(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed || trimmed.toLowerCase() === "default") return;
	return trimmed;
}
function readStringOrNumberParam(params, key, options = {}) {
	const { required = false, label = key } = options;
	const raw = readSnakeCaseParamRaw(params, key);
	if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
	if (typeof raw === "string") {
		const value = raw.trim();
		if (value) return value;
	}
	if (required) throw new ToolInputError(`${label} required`);
}
function readNumberParam(params, key, options = {}) {
	const { required = false, label = key, integer = false, strict = false, positiveInteger = false, nonNegativeInteger = false } = options;
	const raw = readSnakeCaseParamRaw(params, key);
	let value;
	if (typeof raw === "number" && Number.isFinite(raw)) value = raw;
	else if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (trimmed) {
			const parsed = strict ? parseStrictFiniteNumber(trimmed) : Number.parseFloat(trimmed);
			if (parsed !== void 0 && Number.isFinite(parsed)) value = parsed;
		}
	}
	if (value === void 0) {
		if (required) throw new ToolInputError(`${label} required`);
		return;
	}
	if (positiveInteger) return asPositiveSafeInteger(value);
	if (nonNegativeInteger) return asSafeIntegerInRange(value, { min: 0 });
	return integer ? Math.trunc(value) : value;
}
function readPositiveIntegerParam(params, key, options = {}) {
	const message = options.message ?? `${key} must be a positive integer`;
	const value = readNonNegativeIntegerParam(params, key, {
		...options,
		message
	});
	if (value === 0) throw new ToolInputError(message);
	return value;
}
function readNonNegativeIntegerParam(params, key, options = {}) {
	const value = readNumberParam(params, key, {
		nonNegativeInteger: true,
		strict: true
	});
	if (value === void 0) {
		const raw = readSnakeCaseParamRaw(params, key);
		if (raw != null && !isBlankParamValue(raw)) throw new ToolInputError(options.message ?? `${key} must be a non-negative integer`);
	}
	if (value !== void 0 && options.max !== void 0 && value > options.max) throw new ToolInputError(options.message ?? `${key} must be a non-negative integer`);
	return value;
}
function readFiniteNumberParam(params, key, options = {}) {
	const value = readNumberParam(params, key, { strict: true });
	if (value === void 0) {
		const raw = readSnakeCaseParamRaw(params, key);
		if (raw != null && !isBlankParamValue(raw)) throw new ToolInputError(options.message ?? `${key} must be a finite number`);
		return;
	}
	if (options.min !== void 0 && (options.minExclusive ? value <= options.min : value < options.min) || options.max !== void 0 && (options.maxExclusive ? value >= options.max : value > options.max)) throw new ToolInputError(options.message ?? `${key} must be a finite number`);
	return value;
}
function readStringArrayParam(params, key, options = {}) {
	const { required = false, label = key } = options;
	const values = normalizeSingleOrTrimmedStringList(readSnakeCaseParamRaw(params, key));
	if (values.length > 0) return values;
	if (required) throw new ToolInputError(`${label} required`);
}
function readReactionParams(params, options) {
	const emojiKey = options.emojiKey ?? "emoji";
	const removeKey = options.removeKey ?? "remove";
	const remove = typeof params[removeKey] === "boolean" ? params[removeKey] : false;
	const emoji = readToolStringParam(params, emojiKey, {
		required: true,
		allowEmpty: true
	});
	if (remove && !emoji) throw new ToolInputError(options.removeErrorMessage);
	return {
		emoji,
		remove,
		isEmpty: !emoji
	};
}
function stringifyToolPayload(payload) {
	if (typeof payload === "string") return payload;
	try {
		const encoded = JSON.stringify(payload, null, 2);
		if (typeof encoded === "string") return encoded;
	} catch {}
	return String(payload);
}
function failedTextResult(text, details) {
	return textResult(text, details);
}
function payloadTextResult(payload) {
	return textResult(stringifyToolPayload(payload), payload);
}
function emitToolProgress(onUpdate, progress) {
	const text = progress.text.trim();
	if (!onUpdate || !text) return;
	try {
		onUpdate({
			content: [],
			details: void 0,
			progress: {
				text,
				visibility: "channel",
				privacy: "public",
				...progress.id ? { id: progress.id } : {}
			}
		});
	} catch {}
}
function scheduleToolProgress(onUpdate, progress, delayMs, options = {}) {
	if (!onUpdate || options.signal?.aborted) return () => {};
	let cleared = false;
	const clear = () => {
		if (cleared) return;
		cleared = true;
		clearTimeout(timer);
		options.signal?.removeEventListener("abort", clear);
	};
	const timer = setTimeout(() => {
		clear();
		emitToolProgress(onUpdate, progress);
	}, delayMs);
	options.signal?.addEventListener("abort", clear, { once: true });
	return clear;
}
async function imageResultFromFile(params) {
	const buf = (await readLocalFileSafely({ filePath: params.path })).buffer;
	const mimeType = await detectMime({ buffer: buf.slice(0, 256) }) ?? "image/png";
	const content = [...params.extraText ? [{
		type: "text",
		text: params.extraText
	}] : [], {
		type: "image",
		data: buf.toString("base64"),
		mimeType
	}];
	const detailsMedia = params.details?.media && typeof params.details.media === "object" && !Array.isArray(params.details.media) ? params.details.media : void 0;
	const result = {
		content,
		details: {
			path: params.path,
			...params.details,
			media: {
				...detailsMedia,
				mediaUrl: params.path
			}
		}
	};
	const { sanitizeToolResultImages } = await import("./agents/tool-images.runtime.js");
	return await sanitizeToolResultImages(result, params.label, params.imageSanitization);
}
/**
* Validate and parse an `availableTags` parameter from untrusted input.
* Returns `undefined` when the value is missing or not an array.
* Entries that lack a string `name` are silently dropped.
*/
function parseAvailableTags(raw) {
	if (!Array.isArray(raw)) return;
	const result = raw.filter((t) => typeof t === "object" && t !== null && typeof t.name === "string").map((t) => Object.assign({}, typeof t.id === "string" ? { id: t.id } : {}, { name: t.name }, typeof t.moderated === `boolean` ? { moderated: t.moderated } : {}, t.emoji_id === null || typeof t.emoji_id === `string` ? { emoji_id: t.emoji_id } : {}, t.emoji_name === null || typeof t.emoji_name === `string` ? { emoji_name: t.emoji_name } : {}));
	return result.length ? result : void 0;
}
//#endregion
export { parseAvailableTags as a, readNonNegativeIntegerParam as c, readReactionParams as d, readStringArrayParam as f, scheduleToolProgress as h, normalizeToolModelOverride as i, readNumberParam as l, readToolStringParam as m, failedTextResult as n, payloadTextResult as o, readStringOrNumberParam as p, imageResultFromFile as r, readFiniteNumberParam as s, createActionGate as t, readPositiveIntegerParam as u };
