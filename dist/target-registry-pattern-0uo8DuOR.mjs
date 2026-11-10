import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { n as parseDotPath } from "./shared-BVDjoVcf.mjs";
//#region src/secrets/target-registry-pattern.ts
function countDynamicPatternTokens(tokens) {
	return tokens.filter((token) => token.kind === "wildcard" || token.kind === "array").length;
}
/**
* Parses a dotted target pattern into literal, wildcard, and array traversal tokens.
*/
function parsePathPattern(pathPattern, pathSegments) {
	return (pathSegments ?? parseDotPath(pathPattern)).map((segment) => {
		if (segment === "*") return { kind: "wildcard" };
		if (segment.endsWith("[]")) {
			const field = segment.slice(0, -2).trim();
			if (!field) throw new Error(`Invalid target path pattern: ${pathPattern}`);
			return {
				kind: "array",
				field
			};
		}
		return {
			kind: "literal",
			value: segment
		};
	});
}
/**
* Compiles a registry entry and verifies its value path/ref path wildcard shape matches.
*/
function compileTargetRegistryEntry(entry) {
	const pathTokens = parsePathPattern(entry.pathPattern, entry.pathPatternSegments);
	const pathDynamicTokenCount = countDynamicPatternTokens(pathTokens);
	const refPathTokens = entry.refPathPattern ? parsePathPattern(entry.refPathPattern) : void 0;
	const refPathDynamicTokenCount = refPathTokens ? countDynamicPatternTokens(refPathTokens) : 0;
	if (entry.secretShape === "sibling_ref" && !refPathTokens) throw new Error(`Missing refPathPattern for sibling_ref target: ${entry.id}`);
	if (refPathTokens && refPathDynamicTokenCount !== pathDynamicTokenCount) throw new Error(`Mismatched wildcard shape for target ref path: ${entry.id}`);
	return {
		...entry,
		pathTokens,
		refPathTokens
	};
}
/**
* Matches concrete path segments against compiled pattern tokens and returns dynamic captures.
*/
function matchPathTokens(segments, tokens, options) {
	const captures = [];
	let index = 0;
	for (const token of tokens) {
		if (token.kind === "literal") {
			if (typeof segments[index] !== "string" || segments[index] !== token.value) return null;
			index += 1;
			continue;
		}
		if (token.kind === "wildcard") {
			const value = segments[index];
			if (value === void 0 || value === "") return null;
			captures.push(value);
			index += 1;
			continue;
		}
		if (segments[index] !== token.field) return null;
		const next = segments[index + 1];
		const arrayIndex = typeof next === "number" ? next : options?.allowLegacyArrayString && typeof next === "string" ? parseConfigPathArrayIndex(next) : void 0;
		if (arrayIndex === void 0 || parseConfigPathArrayIndex(String(arrayIndex)) !== arrayIndex) return null;
		captures.push(arrayIndex);
		index += 2;
	}
	return index === segments.length ? { captures } : null;
}
/**
* Rebuilds a concrete path from tokens and captures produced by matchPathTokens/expandPathTokens.
*/
function materializePathTokens(tokens, captures) {
	const out = [];
	let captureIndex = 0;
	for (const token of tokens) {
		if (token.kind === "literal") {
			out.push(token.value);
			continue;
		}
		if (token.kind === "wildcard") {
			const value = captures[captureIndex];
			if (value === void 0 || value === "") return null;
			out.push(value);
			captureIndex += 1;
			continue;
		}
		const arrayIndex = captures[captureIndex];
		if (typeof arrayIndex !== "number" || parseConfigPathArrayIndex(String(arrayIndex)) !== arrayIndex) return null;
		out.push(token.field, arrayIndex);
		captureIndex += 1;
	}
	return captureIndex === captures.length ? out : null;
}
/**
* Expands a pattern across a config object and returns every matching value with captures.
*/
function expandPathTokens(root, tokens, options = {}) {
	const out = [];
	const walk = (node, tokenIndex, segments, captures) => {
		const token = tokens[tokenIndex];
		if (!token) {
			out.push({
				segments,
				captures,
				value: node
			});
			return;
		}
		const isLeaf = tokenIndex === tokens.length - 1;
		if (token.kind === "literal") {
			if (!isRecord(node) || options.requireOwnKeys && !Object.hasOwn(node, token.value)) return;
			if (!isLeaf && !Object.hasOwn(node, token.value)) return;
			walk(node[token.value], tokenIndex + 1, [...segments, token.value], captures);
			return;
		}
		if (token.kind === "wildcard") {
			if (!Array.isArray(node) && !isRecord(node)) return;
			const entries = Array.isArray(node) ? node.entries() : Object.entries(node);
			for (const [key, value] of entries) walk(value, tokenIndex + 1, [...segments, key], [...captures, key]);
			return;
		}
		if (!isRecord(node) || options.requireOwnKeys && !Object.hasOwn(node, token.field)) return;
		const items = node[token.field];
		if (!Array.isArray(items)) return;
		for (let index = 0; index < items.length; index += 1) walk(items[index], tokenIndex + 1, [
			...segments,
			token.field,
			index
		], [...captures, index]);
	};
	walk(root, 0, [], []);
	return out;
}
//#endregion
export { parsePathPattern as a, materializePathTokens as i, expandPathTokens as n, matchPathTokens as r, compileTargetRegistryEntry as t };
