import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { n as formatConcreteConfigPath, o as toDotPath } from "./dot-path-BSC76DAI.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-D8NwsREA.mjs";
import { s as formatStrictJsonParseFailure } from "./error-format-B21fL1a_.mjs";
import JSON5 from "json5";
//#region src/cli/config-cli-path.ts
function formatConfigSetPath(path, pathTokens, source) {
	return formatConcreteConfigPath(pathTokens ?? path, source);
}
function parseIndexSegment(raw) {
	return parseConfigPathArrayIndex(raw);
}
function isIndexSegment(raw) {
	return parseIndexSegment(raw) !== void 0;
}
function parseConfigSetValue(raw, strictJson) {
	const trimmed = raw.trim();
	if (strictJson) {
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch (err) {
			throw new Error(formatStrictJsonParseFailure({
				value: raw,
				cause: err
			}), { cause: err });
		}
		rejectConfigNonFiniteNumbers(parsed);
		return parsed;
	}
	let parsed;
	try {
		parsed = JSON5.parse(trimmed);
	} catch {
		return raw;
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function validatePathSegments(path) {
	for (const segment of path) if (!isIndexSegment(segment) && isBlockedObjectKey(segment)) throw new Error(`Invalid path segment: ${segment}`);
}
function hasOwnPathKey(value, key) {
	return Object.hasOwn(value, key);
}
function getAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		if (!current || typeof current !== "object") return { found: false };
		if (Array.isArray(current)) {
			const index = parseIndexSegment(segment);
			if (index === void 0 || index >= current.length) return { found: false };
			current = current[index];
			continue;
		}
		const record = current;
		if (!hasOwnPathKey(record, segment)) return { found: false };
		current = record[segment];
	}
	return {
		found: true,
		value: current
	};
}
function formatConfigUnsetMissingPathMessage(params) {
	if (params.runtimeOnly) return `Config path not found in authored config: ${params.path}. It only exists after runtime defaults are applied, so there is nothing for config unset to remove. Use ${formatCliCommand("openclaw config set <path> <value>")} to override the inherited value.`;
	return `Config path not found: ${params.path}. Nothing was changed. Run ${formatCliCommand("openclaw config get <path>")} first if you are unsure of the path.`;
}
function isSchemaRecord(value) {
	return isRecord(value);
}
function schemaTypes(schema) {
	if (typeof schema.type === "string") return /* @__PURE__ */ new Set([schema.type]);
	if (Array.isArray(schema.type)) return new Set(schema.type.filter((entry) => typeof entry === "string"));
	return /* @__PURE__ */ new Set();
}
function schemaAlternatives(schema, seen = /* @__PURE__ */ new Set()) {
	if (seen.has(schema)) return [];
	seen.add(schema);
	const alternatives = [schema];
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf"
	]) {
		const entries = schema[key];
		if (!Array.isArray(entries)) continue;
		for (const entry of entries) if (isSchemaRecord(entry)) alternatives.push(...schemaAlternatives(entry, seen));
	}
	return alternatives;
}
function schemaLooksArray(schema) {
	return schemaTypes(schema).has("array") || isSchemaRecord(schema.items) || Array.isArray(schema.items);
}
function schemaLooksObject(schema) {
	return schemaTypes(schema).has("object") || isSchemaRecord(schema.properties) || schema.additionalProperties === true || isSchemaRecord(schema.additionalProperties);
}
function propertySchema(schema, segment) {
	const schemas = [];
	for (const alternative of schemaAlternatives(schema)) {
		if (schemaLooksArray(alternative)) {
			const index = parseIndexSegment(segment);
			if (index !== void 0) {
				const indexedItem = Array.isArray(alternative.items) ? alternative.items[index] : alternative.items;
				if (isSchemaRecord(indexedItem)) schemas.push(indexedItem);
			}
			continue;
		}
		const explicit = (isSchemaRecord(alternative.properties) ? alternative.properties : void 0)?.[segment];
		if (isSchemaRecord(explicit)) schemas.push(explicit);
		else if (isSchemaRecord(alternative.additionalProperties)) schemas.push(alternative.additionalProperties);
	}
	return schemas;
}
function schemasAtPath(schema, path) {
	if (!schema) return [];
	let schemas = [schema];
	for (const segment of path) {
		schemas = schemas.flatMap((candidate) => propertySchema(candidate, segment));
		if (schemas.length === 0) return [];
	}
	return schemas;
}
function isConfigSchemaPath(schema, path) {
	return schemasAtPath(schema, path).length > 0;
}
function schemaPrefersArrayAtPath(schema, path) {
	const candidates = schemasAtPath(schema, path).flatMap((candidate) => schemaAlternatives(candidate));
	if (candidates.length === 0) return;
	const hasArray = candidates.some((candidate) => schemaLooksArray(candidate));
	const hasObject = candidates.some((candidate) => schemaLooksObject(candidate));
	if (hasArray && !hasObject) return true;
	if (hasObject && !hasArray) return false;
}
function shouldCreateArrayForMissingPathSegment(params) {
	if (!params.next || params.options?.numericObjectKeys || !isIndexSegment(params.next)) return false;
	if (typeof params.options?.pathTokens?.[params.segmentIndex + 1] === "number") return true;
	if (params.options?.quotedNumericSegments?.has(params.segmentIndex + 1)) return false;
	const parentPath = params.path.slice(0, params.segmentIndex + 1);
	return schemaPrefersArrayAtPath(params.options?.schema, parentPath) ?? true;
}
function setAtPath(root, path, value, options) {
	const last = path.at(-1);
	if (last === void 0) throw new Error("Config path must contain at least one segment");
	let current = root;
	for (const [i, segment] of path.slice(0, -1).entries()) {
		const nextIsIndex = shouldCreateArrayForMissingPathSegment({
			path,
			segmentIndex: i,
			next: path[i + 1],
			options
		});
		if (Array.isArray(current)) {
			const index = parseIndexSegment(segment);
			if (index === void 0) throw new Error(`Expected numeric index for array segment "${segment}"`);
			const existing = current[index];
			if (!existing || typeof existing !== "object") current[index] = nextIsIndex ? [] : {};
			current = current[index];
			continue;
		}
		if (!current || typeof current !== "object") throw new Error(`Cannot traverse into "${segment}" (not an object)`);
		const record = current;
		const existing = hasOwnPathKey(record, segment) ? record[segment] : void 0;
		if (!existing || typeof existing !== "object") record[segment] = nextIsIndex ? [] : {};
		current = record[segment];
	}
	if (Array.isArray(current)) {
		const index = parseIndexSegment(last);
		if (index === void 0) throw new Error(`Expected numeric index for array segment "${last}"`);
		current[index] = value;
		return;
	}
	if (!current || typeof current !== "object") throw new Error(`Cannot set "${last}" (parent is not an object)`);
	current[last] = value;
}
function modelArrayIds(value) {
	if (!Array.isArray(value)) return null;
	const ids = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id.trim()) return null;
		ids.add(entry.id.trim());
	}
	return ids;
}
function mergeModelArrays(existing, patch, path) {
	const merged = [...existing];
	const suppliedPaths = [];
	const indexById = /* @__PURE__ */ new Map();
	for (const [index, entry] of merged.entries()) if (isRecord(entry) && typeof entry.id === "string" && entry.id.trim()) indexById.set(entry.id.trim(), index);
	for (const entry of patch) {
		if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id.trim()) {
			suppliedPaths.push([...path, String(merged.length)]);
			merged.push(entry);
			continue;
		}
		const id = entry.id.trim();
		const existingIndex = indexById.get(id);
		if (existingIndex === void 0) {
			indexById.set(id, merged.length);
			suppliedPaths.push([...path, String(merged.length)]);
			merged.push(entry);
			continue;
		}
		const existingEntry = merged[existingIndex];
		merged[existingIndex] = isRecord(existingEntry) ? {
			...existingEntry,
			...entry
		} : entry;
		for (const key of Object.keys(entry)) suppliedPaths.push([
			...path,
			String(existingIndex),
			key
		]);
	}
	return {
		value: merged,
		suppliedPaths
	};
}
function isProviderModelListPath(path) {
	return path.length === 4 && path[0] === "models" && path[1] === "providers" && path[3] === "models";
}
function appendMergePath(parent, segment) {
	return {
		parent,
		segment
	};
}
function toMergePath(path) {
	let current;
	for (const segment of path) current = appendMergePath(current, segment);
	return current;
}
function mergePathSegments(path) {
	const segments = [];
	for (let current = path; current; current = current.parent) segments.push(current.segment);
	return segments.toReversed();
}
function isProviderModelListMergePath(path) {
	const providers = path.parent?.parent;
	const models = providers?.parent;
	return path.segment === "models" && providers?.segment === "providers" && models?.segment === "models" && models.parent === void 0;
}
function mergeConfigValue(existing, patch, path) {
	if (isProviderModelListPath(path) && Array.isArray(existing) && Array.isArray(patch)) return mergeModelArrays(existing, patch, path);
	if (isRecord(existing) && isRecord(patch)) {
		const next = { ...existing };
		const suppliedPaths = [];
		const pending = [{
			target: next,
			patch,
			path: toMergePath(path)
		}];
		while (pending.length > 0) {
			const frame = pending.pop();
			for (const [key, value] of Object.entries(frame.patch)) {
				const current = frame.target[key];
				const childPath = appendMergePath(frame.path, key);
				if (hasOwnPathKey(frame.target, key) && isProviderModelListMergePath(childPath) && Array.isArray(current) && Array.isArray(value)) {
					const merged = mergeModelArrays(current, value, mergePathSegments(childPath));
					frame.target[key] = merged.value;
					suppliedPaths.push(...merged.suppliedPaths);
				} else if (hasOwnPathKey(frame.target, key) && isRecord(current) && isRecord(value)) {
					const child = { ...current };
					frame.target[key] = child;
					pending.push({
						target: child,
						patch: value,
						path: childPath
					});
				} else {
					frame.target[key] = value;
					suppliedPaths.push(mergePathSegments(childPath));
				}
			}
		}
		return {
			value: next,
			suppliedPaths
		};
	}
	throw new Error(`Cannot merge ${toDotPath(path)}; use --replace to replace intentionally.`);
}
function mergeAtPath(root, path, value, options) {
	const existing = getAtPath(root, path);
	const merged = existing.found ? mergeConfigValue(existing.value, value, path) : {
		value,
		suppliedPaths: [path]
	};
	setAtPath(root, path, merged.value, options);
	return merged.suppliedPaths;
}
function isProtectedMapReplacementPath(path) {
	const joined = path.join(".");
	return joined === "agents.defaults.models" || joined === "models.providers" || path.length === 3 && path[0] === "models" && path[1] === "providers" || joined === "agents.entries" || joined === "plugins.entries" || joined === "auth.profiles";
}
function isProtectedArrayReplacementPath(path) {
	return isProviderModelListPath(path);
}
function formatRemovedEntries(entries) {
	const visible = entries.slice(0, 6);
	const suffix = entries.length > visible.length ? `, ... ${entries.length - visible.length} more` : "";
	return `${visible.join(", ")}${suffix}`;
}
function assertNonDestructiveReplacement(params) {
	if (params.allowReplace) return;
	const existing = getAtPath(params.root, params.path);
	if (!existing.found) return;
	const pathLabel = toDotPath(params.path);
	if (isProtectedMapReplacementPath(params.path) && isRecord(existing.value)) {
		if (!isRecord(params.value)) return;
		const nextKeys = new Set(Object.keys(params.value));
		const removed = Object.keys(existing.value).filter((key) => !nextKeys.has(key));
		if (removed.length > 0) throw new Error(`Refusing to replace ${pathLabel}; it would remove existing entries: ${formatRemovedEntries(removed)}. Use --merge to merge object values or --replace to replace intentionally.`);
	}
	if (isProtectedArrayReplacementPath(params.path)) {
		const existingIds = modelArrayIds(existing.value);
		const nextIds = modelArrayIds(params.value);
		if (!existingIds || !nextIds) return;
		const removed = [...existingIds].filter((id) => !nextIds.has(id));
		if (removed.length > 0) throw new Error(`Refusing to replace ${pathLabel}; it would remove existing entries: ${formatRemovedEntries(removed)}. Use --merge to merge by id or --replace to replace intentionally.`);
	}
}
function unsetAtPath(root, path) {
	const last = path.at(-1);
	if (last === void 0) return { removed: false };
	const current = getAtPath(root, path.slice(0, -1)).value;
	if (Array.isArray(current)) {
		const index = parseIndexSegment(last);
		if (index === void 0 || index >= current.length) return { removed: false };
		current.splice(index, 1);
		return {
			removed: true,
			leafContainer: "array"
		};
	}
	if (!current || typeof current !== "object") return { removed: false };
	const record = current;
	if (!hasOwnPathKey(record, last)) return { removed: false };
	delete record[last];
	return {
		removed: true,
		leafContainer: "object"
	};
}
//#endregion
export { isConfigSchemaPath as a, setAtPath as c, getAtPath as i, unsetAtPath as l, formatConfigSetPath as n, mergeAtPath as o, formatConfigUnsetMissingPathMessage as r, parseConfigSetValue as s, assertNonDestructiveReplacement as t, validatePathSegments as u };
