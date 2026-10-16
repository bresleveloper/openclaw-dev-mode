import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { n as formatConcreteConfigPath, o as toDotPath } from "./dot-path-CVD5Jolm.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as normalizeConfigModelSelectionParent } from "./model-input-normalization-C54uHM0N.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-3oLf9xok.mjs";
import { s as formatStrictJsonParseFailure } from "./error-format-BaRMqGR7.mjs";
import JSON5 from "json5";
//#region src/cli/config-cli-path.ts
function formatConfigSetPath(path, pathTokens, source) {
	return formatConcreteConfigPath(pathTokens ?? path, source);
}
/** Patch prints this path as its `--replace-path` argument, so a literal dot in a key needs brackets to re-parse. */
function refusalPathLabel(command, path) {
	return command === "patch" ? formatConfigSetPath(path) : toDotPath(path);
}
/**
* A copied retry crosses a shell, and once a key holds a quote no single spelling survives both
* the POSIX and the PowerShell convention. The host platform is no proxy for the interactive
* shell - Git Bash on Windows needs the POSIX form - so the advice names both when they differ.
*/
function replacePathArgument(pathLabel) {
	const posix = quoteCliArg(pathLabel);
	const powershell = quotePowerShellArg(pathLabel);
	if (posix === pathLabel || posix === powershell) return `--replace-path ${posix}`;
	return `--replace-path ${posix} in bash and zsh, or --replace-path ${powershell} in PowerShell`;
}
function parseConfigSetValue(raw, strictJson) {
	const trimmed = raw.trim();
	let parsed;
	try {
		parsed = strictJson ? JSON.parse(trimmed) : JSON5.parse(trimmed);
	} catch (err) {
		if (strictJson) throw new Error(formatStrictJsonParseFailure({
			value: raw,
			cause: err
		}), { cause: err });
		return raw;
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function validatePathSegments(path) {
	for (const segment of path) if (isBlockedObjectKey(segment)) throw new Error(`Invalid path segment: ${segment}`);
}
function getAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		if (!current || typeof current !== "object") return { found: false };
		if (Array.isArray(current)) {
			const index = parseConfigPathArrayIndex(segment);
			if (index === void 0 || index >= current.length) return { found: false };
			current = current[index];
			continue;
		}
		const record = current;
		if (!Object.hasOwn(record, segment)) return { found: false };
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
function schemaHasType(schema, type) {
	return schema.type === type || Array.isArray(schema.type) && schema.type.includes(type);
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
		for (const entry of entries) if (isRecord(entry)) alternatives.push(...schemaAlternatives(entry, seen));
	}
	return alternatives;
}
function schemaLooksArray(schema) {
	return schemaHasType(schema, "array") || isRecord(schema.items) || Array.isArray(schema.items);
}
function schemaLooksObject(schema) {
	return schemaHasType(schema, "object") || isRecord(schema.properties) || schema.additionalProperties === true || isRecord(schema.additionalProperties);
}
function propertySchema(schema, segment) {
	const schemas = [];
	for (const alternative of schemaAlternatives(schema)) {
		if (Object.keys(alternative).length === 0) {
			schemas.push(alternative);
			continue;
		}
		if (schemaLooksArray(alternative)) {
			const index = parseConfigPathArrayIndex(segment);
			if (index !== void 0) {
				const indexedItem = Array.isArray(alternative.items) ? alternative.items[index] : alternative.items;
				if (isRecord(indexedItem)) schemas.push(indexedItem);
			}
			continue;
		}
		const explicit = (isRecord(alternative.properties) ? alternative.properties : void 0)?.[segment];
		if (isRecord(explicit)) schemas.push(explicit);
		else if (alternative.additionalProperties === true) schemas.push({});
		else if (isRecord(alternative.additionalProperties)) schemas.push(alternative.additionalProperties);
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
	return hasArray === candidates.some((candidate) => schemaLooksObject(candidate)) ? void 0 : hasArray;
}
function shouldCreateArrayForMissingPathSegment(params) {
	if (!params.next || params.options?.numericObjectKeys || parseConfigPathArrayIndex(params.next) === void 0) return false;
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
			const index = parseConfigPathArrayIndex(segment);
			if (index === void 0) throw new Error(`Expected numeric index for array segment "${segment}"`);
			const existing = current[index];
			if (!existing || typeof existing !== "object") current[index] = nextIsIndex ? [] : {};
			current = current[index];
			continue;
		}
		if (!current || typeof current !== "object") throw new Error(`Cannot traverse into "${segment}" (not an object)`);
		const record = current;
		const existing = Object.hasOwn(record, segment) ? record[segment] : void 0;
		if (!existing || typeof existing !== "object") record[segment] = normalizeConfigModelSelectionParent(existing, path, i) ?? (nextIsIndex ? [] : {});
		current = record[segment];
	}
	if (Array.isArray(current)) {
		const index = parseConfigPathArrayIndex(last);
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
function toMergePath(path) {
	let current;
	for (const segment of path) current = {
		parent: current,
		segment
	};
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
function mergeConfigValue(existing, patch, path, command) {
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
				const childPath = {
					parent: frame.path,
					segment: key
				};
				if (Object.hasOwn(frame.target, key) && isProviderModelListMergePath(childPath) && Array.isArray(current) && Array.isArray(value)) {
					const merged = mergeModelArrays(current, value, mergePathSegments(childPath));
					frame.target[key] = merged.value;
					suppliedPaths.push(...merged.suppliedPaths);
				} else if (Object.hasOwn(frame.target, key) && isRecord(current) && isRecord(value)) {
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
	const label = refusalPathLabel(command, path);
	throw new Error(`Cannot merge ${label}; use ${command === "patch" ? replacePathArgument(label) : "--replace"} to replace intentionally.`);
}
function mergeAtPath(root, path, value, options) {
	const existing = getAtPath(root, path);
	const merged = existing.found ? mergeConfigValue(existing.value, value, path, options?.command ?? "set") : {
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
function formatRemovedEntries(entries) {
	const visible = entries.slice(0, 6);
	const suffix = entries.length > visible.length ? `, ... ${entries.length - visible.length} more` : "";
	return `${visible.join(", ")}${suffix}`;
}
function replacementAdvice(command, pathLabel, mergeSubject) {
	if (command === "patch") return `Use ${replacePathArgument(pathLabel)} to replace intentionally.`;
	return `Use --merge to merge ${mergeSubject} or --replace to replace intentionally.`;
}
function assertNonDestructiveReplacement(params) {
	if (params.allowReplace) return;
	const existing = getAtPath(params.root, params.path);
	if (!existing.found) return;
	const pathLabel = refusalPathLabel(params.command, params.path);
	let removed;
	let mergeHint;
	if (isProtectedMapReplacementPath(params.path) && isRecord(existing.value)) {
		if (!isRecord(params.value)) return;
		const nextKeys = new Set(Object.keys(params.value));
		removed = Object.keys(existing.value).filter((key) => !nextKeys.has(key));
		mergeHint = "object values";
	} else if (isProviderModelListPath(params.path)) {
		const existingIds = modelArrayIds(existing.value);
		const nextIds = modelArrayIds(params.value);
		if (!existingIds || !nextIds) return;
		removed = [...existingIds].filter((id) => !nextIds.has(id));
		mergeHint = "by id";
	} else return;
	if (removed.length > 0) throw new Error(`Refusing to replace ${pathLabel}; it would remove existing entries: ${formatRemovedEntries(removed)}. ${replacementAdvice(params.command, pathLabel, mergeHint)}`);
}
function unsetAtPath(root, path) {
	const last = path.at(-1);
	if (last === void 0) return { removed: false };
	const current = getAtPath(root, path.slice(0, -1)).value;
	if (Array.isArray(current)) {
		const index = parseConfigPathArrayIndex(last);
		if (index === void 0 || index >= current.length) return { removed: false };
		current.splice(index, 1);
		return {
			removed: true,
			leafContainer: "array"
		};
	}
	if (!current || typeof current !== "object") return { removed: false };
	const record = current;
	if (!Object.hasOwn(record, last)) return { removed: false };
	delete record[last];
	return {
		removed: true,
		leafContainer: "object"
	};
}
//#endregion
export { isConfigSchemaPath as a, setAtPath as c, getAtPath as i, unsetAtPath as l, formatConfigSetPath as n, mergeAtPath as o, formatConfigUnsetMissingPathMessage as r, parseConfigSetValue as s, assertNonDestructiveReplacement as t, validatePathSegments as u };
