import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as hasSensitiveUrlHintTag, o as redactSensitiveUrlLikeString, r as isSensitiveUrlConfigPath } from "./redact-sensitive-url-DspuXlEe.mjs";
import { Y as containsEnvVarReference } from "./redact-B5EGyLvV.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CR94ndkx.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { isDeepStrictEqual } from "node:util";
import JSON5 from "json5";
//#region src/config/redact-snapshot.raw.ts
/** Replaces known sensitive values in raw config text while preserving parseable structure. */
function replaceSensitiveValuesInRaw(params) {
	const values = uniqueStrings(params.sensitiveValues).filter((value) => value !== "").toSorted((a, b) => b.length - a.length);
	let result = params.raw;
	for (const value of values) result = result.replaceAll(value, params.redactedSentinel);
	return result;
}
/** Returns whether raw string redaction changed semantics and structured redaction is needed. */
function shouldFallbackToStructuredRawRedaction(params) {
	if (isDevMode()) return false;
	try {
		const parsed = JSON5.parse(params.redactedRaw);
		const restored = params.restoreParsed(parsed);
		if (!restored.ok) return true;
		return !isDeepStrictEqual(restored.result, params.originalConfig);
	} catch {
		return true;
	}
}
//#endregion
//#region src/config/redact-snapshot.secret-ref.ts
/** Narrows plain objects that carry the minimum SecretRef fields used by redaction. */
function isSecretRefShape(value) {
	return typeof value.source === "string" && typeof value.id === "string";
}
/** Redacts a SecretRef id while preserving non-secret structural fields for restore matching. */
function redactSecretRefId(params) {
	const { value, values, redactedSentinel, isConcreteSensitiveString } = params;
	const redacted = { ...value };
	if (isConcreteSensitiveString(value.id)) {
		values.push(value.id);
		redacted.id = redactedSentinel;
	}
	return redacted;
}
//#endregion
//#region src/config/redact-snapshot.ts
const log = createSubsystemLogger("config/redaction");
const ENV_VAR_PLACEHOLDER_PATTERN = /^\$\{[^}]*\}$/;
function isSensitivePath(path) {
	if (path.endsWith("[]")) return isSensitiveConfigPath(path.slice(0, -2));
	return isSensitiveConfigPath(path);
}
function isConcreteSensitiveString(value) {
	const trimmed = value.trim();
	return trimmed !== "" && !ENV_VAR_PLACEHOLDER_PATTERN.test(trimmed);
}
function isWholeObjectSensitivePath(path) {
	const lowered = normalizeLowercaseStringOrEmpty(path);
	return lowered.endsWith("serviceaccount") || lowered.endsWith("serviceaccountref");
}
function hasSensitiveUrlHintPath(hints, paths) {
	return paths.some((path) => hasSensitiveUrlHintTag(hints?.[path]));
}
function collectSensitiveStrings(value, values) {
	if (typeof value === "string") {
		if (isConcreteSensitiveString(value)) values.push(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectSensitiveStrings(item, values);
		return;
	}
	if (isRecord(value)) {
		const obj = value;
		if (isSecretRefShape(obj)) {
			collectSensitiveStrings(obj.id, values);
			return;
		}
		for (const item of Object.values(obj)) collectSensitiveStrings(item, values);
	}
}
function isExplicitlyNonSensitivePath(hints, paths) {
	return paths.some((path) => hints?.[path]?.sensitive === false);
}
function isSecretRefWithProvider(value) {
	return isSecretRefShape(value) && typeof value.provider === "string";
}
function buildRedactionLookup(hints) {
	const result = /* @__PURE__ */ new Set();
	for (const [path, hint] of Object.entries(hints)) {
		if (!hint.sensitive) continue;
		const parts = path.split(".");
		let joinedPath = parts.shift() ?? "";
		result.add(joinedPath);
		if (joinedPath.endsWith("[]")) result.add(joinedPath.slice(0, -2));
		for (const part of parts) {
			if (part.endsWith("[]")) result.add(`${joinedPath}.${part.slice(0, -2)}`);
			joinedPath = `${joinedPath}.${part}`;
			result.add(joinedPath);
		}
	}
	if (result.size !== 0) result.add("");
	return result;
}
function createRedactionContext(hints) {
	const lookup = hints ? buildRedactionLookup(hints) : void 0;
	return {
		hints,
		lookup: lookup?.has("") ? lookup : void 0,
		warnOnMissingOriginal: true
	};
}
function withoutRedactionLookup(context) {
	return context.lookup ? {
		...context,
		lookup: void 0
	} : context;
}
/** Deep-walk an object and replace values at sensitive paths with the redaction sentinel. */
function redactObject(obj, context, values = []) {
	return redactValue(obj, "", values, context);
}
function redactValue(obj, prefix, values, context) {
	if (obj === null || obj === void 0) return obj;
	if (Array.isArray(obj)) {
		const path = `${prefix}[]`;
		const schemaMatched = context.lookup?.has(path) === true;
		const fallbackContext = schemaMatched ? context : withoutRedactionLookup(context);
		const heuristicSensitive = !isExplicitlyNonSensitivePath(context.hints, [path]) && isSensitivePath(path);
		return obj.map((item) => {
			if (typeof item === "string" && isConcreteSensitiveString(item) && (schemaMatched || heuristicSensitive)) {
				values.push(item);
				return REDACTED_SENTINEL;
			}
			return redactValue(item, path, values, fallbackContext);
		});
	}
	if (!isRecord(obj)) return obj;
	const result = {};
	const fallbackContext = withoutRedactionLookup(context);
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		const wildcardPath = prefix ? `${prefix}.*` : "*";
		const candidate = context.lookup ? [path, wildcardPath].find((entry) => context.lookup?.has(entry)) : void 0;
		if (candidate) {
			result[key] = value;
			if (typeof value === "string") {
				if (!isConcreteSensitiveString(value)) continue;
				result[key] = REDACTED_SENTINEL;
				values.push(value);
			} else if (typeof value === "object" && value !== null) {
				if (context.hints?.[candidate]?.sensitive === true && !Array.isArray(value)) {
					const objectValue = asNonArrayRecord(value);
					if (isSecretRefShape(objectValue)) result[key] = redactSecretRefId({
						value: objectValue,
						values,
						redactedSentinel: REDACTED_SENTINEL,
						isConcreteSensitiveString
					});
					else {
						collectSensitiveStrings(objectValue, values);
						result[key] = REDACTED_SENTINEL;
					}
				} else result[key] = redactValue(value, candidate, values, context);
			} else if (context.hints?.[candidate]?.sensitive === true && value !== void 0 && value !== null) result[key] = REDACTED_SENTINEL;
			continue;
		}
		const hintPaths = [path, wildcardPath];
		const markedNonSensitive = isExplicitlyNonSensitivePath(context.hints, hintPaths);
		if (typeof value === "string" && !markedNonSensitive && isSensitivePath(path) && isConcreteSensitiveString(value)) {
			result[key] = REDACTED_SENTINEL;
			values.push(value);
		} else if (!context.lookup && !markedNonSensitive && isSensitivePath(path) && isWholeObjectSensitivePath(path) && value !== null && typeof value === "object" && !Array.isArray(value)) {
			collectSensitiveStrings(value, values);
			result[key] = REDACTED_SENTINEL;
		} else if (typeof value === "string" && (hasSensitiveUrlHintPath(context.hints, hintPaths) || isSensitiveUrlConfigPath(path))) {
			if (redactSensitiveUrlLikeString(value) !== value) {
				values.push(value);
				result[key] = REDACTED_SENTINEL;
			} else result[key] = value;
		} else if (typeof value === "object" && value !== null) result[key] = redactValue(value, path, values, fallbackContext);
		else result[key] = value;
	}
	return result;
}
/**
* Redact sensitive fields from a plain config object (not a full snapshot).
* Used by write endpoints (config.set, config.patch, config.apply) to avoid
* leaking credentials in their responses.
*/
function redactConfigObject(value, uiHints) {
	return redactObject(value, createRedactionContext(uiHints));
}
/**
* Returns a copy of the config snapshot with all sensitive fields replaced by
* {@link REDACTED_SENTINEL}. The `hash` is preserved because it tracks config identity.
*
* Both `config` (the parsed object) and `raw` (the JSON5 source) are scrubbed so no credential can
* leak through either path. Schema hints determine sensitivity when supplied; otherwise path-based
* detection applies.
*/
function redactConfigSnapshot(snapshot, uiHints) {
	const { authoredConfig: _authoredConfig, sourceConfigBeforeMigrations: _sourceConfigBeforeMigrations, pluginMetadataSnapshot: _pluginMetadataSnapshot, ...publicSnapshot } = snapshot;
	if (!snapshot.valid) {
		const redactedConfig = {};
		const redactedResolved = {};
		return {
			...publicSnapshot,
			sourceConfig: redactedResolved,
			runtimeConfig: redactedConfig,
			config: redactedConfig,
			raw: null,
			parsed: null,
			resolved: redactedResolved,
			devMode: isDevMode()
		};
	}
	const context = createRedactionContext(uiHints);
	const sensitiveValues = [];
	const redactedConfig = redactObject(snapshot.config, context, sensitiveValues);
	const redactedParsed = snapshot.parsed ? redactObject(snapshot.parsed, context) : snapshot.parsed;
	let redactedRaw = snapshot.raw ? replaceSensitiveValuesInRaw({
		raw: snapshot.raw,
		sensitiveValues,
		redactedSentinel: REDACTED_SENTINEL
	}) : null;
	if (redactedRaw && shouldFallbackToStructuredRawRedaction({
		redactedRaw,
		originalConfig: snapshot.parsed ?? snapshot.config,
		restoreParsed: (parsed) => restoreRedactedValuesWithContext(parsed, snapshot.config, {
			...context,
			warnOnMissingOriginal: false
		})
	})) redactedRaw = null;
	const redactedResolved = redactObject(snapshot.resolved, context);
	return {
		...publicSnapshot,
		sourceConfig: redactedResolved,
		runtimeConfig: redactedConfig,
		config: redactedConfig,
		raw: redactedRaw,
		parsed: redactedParsed,
		resolved: redactedResolved,
		devMode: isDevMode()
	};
}
/**
* Deep-walk `incoming` and replace any {@link REDACTED_SENTINEL} values
* (on sensitive paths) with the corresponding value from `original`.
*
* This is called by config.set / config.apply / config.patch before writing,
* so that credentials survive a Web UI round-trip unmodified.
*/
function restoreRedactedValues(incoming, original, hints) {
	return restoreRedactedValuesWithContext(incoming, original, createRedactionContext(hints));
}
function restoreRedactedValuesWithContext(incoming, original, context) {
	if (incoming === null || incoming === void 0) return {
		ok: false,
		error: "no input"
	};
	if (typeof incoming !== "object") return {
		ok: false,
		error: "input not an object"
	};
	try {
		const restored = restoreRedactedValue(incoming, original, "", context);
		assertNoRedactedSentinel(restored, "");
		return {
			ok: true,
			result: restored
		};
	} catch (err) {
		if (err instanceof RedactionError) return {
			ok: false,
			humanReadableMessage: err.humanReadableMessage
		};
		throw err;
	}
}
var RedactionError = class extends Error {
	constructor(key, humanReadableMessage) {
		super("internal error class---should never escape");
		this.key = key;
		this.humanReadableMessage = humanReadableMessage ?? `Sentinel value "__OPENCLAW_REDACTED__" in key ${key} is not valid as real data`;
		this.name = "RedactionError";
	}
};
function restoreOriginalValueOrThrow(original, key, path, context) {
	if (Object.hasOwn(original, key)) return original[key];
	if (context.warnOnMissingOriginal) log.warn(`Cannot un-redact config key ${path} as it doesn't have any value`);
	throw new RedactionError(path);
}
function assertNoRedactedSentinel(value, path) {
	if (typeof value === "string" && value === "__OPENCLAW_REDACTED__") {
		const pathLabel = path || "<root>";
		throw new RedactionError(pathLabel, `Reserved redaction sentinel "${REDACTED_SENTINEL}" is not valid config data (${pathLabel}).`);
	}
	if (Array.isArray(value)) {
		for (let index = 0; index < value.length; index += 1) {
			const nextPath = path ? `${path}[${index}]` : `[${index}]`;
			assertNoRedactedSentinel(value[index], nextPath);
		}
		return;
	}
	if (isRecord(value)) for (const [key, item] of Object.entries(value)) assertNoRedactedSentinel(item, path ? `${path}.${key}` : key);
}
function maybeRestoreSecretRefId(params) {
	const incomingObj = asNonArrayRecord(params.incoming);
	if (!isSecretRefShape(incomingObj) || incomingObj.id !== "__OPENCLAW_REDACTED__") return { handled: false };
	const originalObj = asNonArrayRecord(params.original);
	if (!isSecretRefWithProvider(originalObj)) {
		if (isSecretRefShape(originalObj)) throw new RedactionError(params.path, `SecretRef at ${params.path} requires a provider field to restore the redacted id automatically (original ref lacks provider).`);
		throw new RedactionError(params.path, `SecretRef at ${params.path} contains a redacted id placeholder with no matching original value.`);
	}
	if (!isSecretRefWithProvider(incomingObj)) throw new RedactionError(params.path, `SecretRef at ${params.path} must include source, provider, and id when redacted placeholders are present.`);
	if (incomingObj.source !== originalObj.source || incomingObj.provider !== originalObj.provider) throw new RedactionError(params.path, `SecretRef at ${params.path} changed source/provider while id is redacted. Provide an explicit id when changing source/provider.`);
	return {
		handled: true,
		value: {
			...incomingObj,
			id: originalObj.id
		}
	};
}
function readRedactedArrayItemId(item) {
	if (!isRecord(item) || !Object.hasOwn(item, "id")) return;
	const id = item.id;
	if (typeof id !== "string" || id.length === 0 || id === "__OPENCLAW_REDACTED__" || containsEnvVarReference(id) || id.includes("$${")) return;
	return id;
}
function indexRedactedArrayItemsById(items) {
	const itemsById = /* @__PURE__ */ new Map();
	for (const [index, item] of items.entries()) {
		const id = readRedactedArrayItemId(item);
		if (id === void 0) continue;
		const previous = itemsById.get(id);
		if (previous) previous.count += 1;
		else itemsById.set(id, {
			item,
			index,
			count: 1
		});
	}
	return itemsById;
}
function mapRedactedArray(params) {
	const originalArray = Array.isArray(params.original) ? params.original : [];
	if (params.incoming.length < originalArray.length) log.warn(`Redacted config array key ${params.path} has been truncated`);
	const originalById = indexRedactedArrayItemsById(originalArray);
	const incomingById = indexRedactedArrayItemsById(params.incoming);
	const reservedOriginalIndexes = /* @__PURE__ */ new Set();
	for (const [id, incomingIdentity] of incomingById) {
		const originalIdentity = originalById.get(id);
		if (incomingIdentity.count === 1 && originalIdentity?.count === 1) reservedOriginalIndexes.add(originalIdentity.index);
	}
	const hasUniqueOriginalIdentity = Array.from(originalById.values()).some((identity) => identity.count === 1);
	return params.incoming.map((item, index) => {
		const id = readRedactedArrayItemId(item);
		const originalIdentity = id === void 0 ? void 0 : originalById.get(id);
		const incomingIdentity = id === void 0 ? void 0 : incomingById.get(id);
		if (incomingIdentity?.count === 1 && originalIdentity?.count === 1) return params.mapItem(item, originalIdentity.item);
		if (incomingIdentity?.count === 1 && !originalIdentity && hasUniqueOriginalIdentity) return params.mapItem(item, void 0);
		const originalItem = reservedOriginalIndexes.has(index) ? void 0 : originalArray[index];
		return params.mapItem(item, originalItem);
	});
}
function restoreRedactedValue(incoming, original, prefix, context) {
	if (incoming === null || incoming === void 0 || typeof incoming !== "object") return incoming;
	if (Array.isArray(incoming)) {
		const path = `${prefix}[]`;
		const schemaMatched = context.lookup?.has(path) === true;
		const fallbackContext = schemaMatched ? context : withoutRedactionLookup(context);
		const heuristicSensitive = !isExplicitlyNonSensitivePath(context.hints, [path]) && isSensitivePath(path);
		return mapRedactedArray({
			incoming,
			original,
			path,
			mapItem: (item, originalItem) => item === "__OPENCLAW_REDACTED__" && (schemaMatched || heuristicSensitive) ? originalItem : restoreRedactedValue(item, originalItem, path, fallbackContext)
		});
	}
	const orig = asNonArrayRecord(original);
	const result = {};
	const fallbackContext = withoutRedactionLookup(context);
	for (const [key, value] of Object.entries(asNonArrayRecord(incoming))) {
		const path = prefix ? `${prefix}.${key}` : key;
		const wildcardPath = prefix ? `${prefix}.*` : "*";
		const candidate = context.lookup ? [path, wildcardPath].find((entry) => context.lookup?.has(entry)) : void 0;
		const hintPaths = [path, wildcardPath];
		const canRestore = (candidate ? context.hints?.[candidate]?.sensitive === true : !isExplicitlyNonSensitivePath(context.hints, hintPaths) && isSensitivePath(path)) || hasSensitiveUrlHintPath(context.hints, hintPaths) || isSensitiveUrlConfigPath(path);
		if (value === "__OPENCLAW_REDACTED__" && canRestore) result[key] = restoreOriginalValueOrThrow(orig, key, candidate ?? path, context);
		else if (typeof value === "object" && value !== null) {
			const restoredSecretRef = candidate || canRestore ? maybeRestoreSecretRefId({
				incoming: value,
				original: orig[key],
				path
			}) : { handled: false };
			result[key] = restoredSecretRef.handled ? restoredSecretRef.value : restoreRedactedValue(value, orig[key], candidate ?? path, candidate ? context : fallbackContext);
		} else result[key] = value;
	}
	return result;
}
//#endregion
export { isSecretRefShape as i, redactConfigSnapshot as n, restoreRedactedValues as r, redactConfigObject as t };
