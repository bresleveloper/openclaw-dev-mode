import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as parseBooleanValue } from "./boolean-C30ltbL7.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as MANIFEST_KEY, t as LEGACY_MANIFEST_KEYS } from "./legacy-names-NIXaj2oi.mjs";
import JSON5 from "json5";
import { isAlias, isMap, isNode, isScalar, parseDocument } from "yaml";
//#region packages/markdown-core/src/frontmatter.ts
function stripQuotes(value) {
	const quote = value.at(0);
	return (quote === "\"" || quote === "'") && value.at(-1) === quote ? value.slice(1, -1) : value;
}
function coerceYamlFrontmatterValue(value) {
	if (value === null || value === void 0) return;
	if (typeof value === "string") return {
		value: value.trim(),
		kind: "scalar"
	};
	if (typeof value === "number" || typeof value === "boolean") return {
		value: String(value),
		kind: "scalar"
	};
	if (typeof value === "object") try {
		return {
			value: JSON.stringify(value),
			kind: "structured"
		};
	} catch {
		return;
	}
}
function parseLineFrontmatter(block) {
	const result = {};
	const lines = block.split("\n");
	for (let i = 0; i < lines.length; i += 1) {
		const match = lines.at(i)?.match(/^([\w-]+):\s*(.*)$/);
		const key = match?.[1];
		const rawValue = match?.[2];
		if (!key || rawValue === void 0) continue;
		let value = rawValue.trim();
		if (!value && /^[ \t]/.test(lines.at(i + 1) ?? "")) {
			const valueLines = [];
			while (i + 1 < lines.length) {
				const line = lines.at(i + 1);
				if (line === void 0 || line && !/^[ \t]/.test(line)) break;
				valueLines.push(line);
				i += 1;
			}
			value = valueLines.join("\n").trim();
		} else value = stripQuotes(value);
		if (value) result[key] = value;
	}
	return result;
}
const FREEFORM_TEXT_FIELDS = /* @__PURE__ */ new Set([
	"description",
	"read_when",
	"summary"
]);
function normalizeFreeformFieldAtError(block) {
	const doc = parseDocument(block, {
		schema: "core",
		prettyErrors: false
	});
	if (!isMap(doc.contents)) return block;
	const error = doc.errors.find((candidate) => candidate.pos?.[0] !== void 0);
	const descriptionAlias = doc.contents.items.find((candidate) => isScalar(candidate.key) && candidate.key.value === "description" && isAlias(candidate.value));
	const pos = error?.pos?.[0] ?? (isNode(descriptionAlias?.key) ? descriptionAlias.key.range?.[0] : void 0);
	if (pos === void 0) return block;
	const lineStart = block.lastIndexOf("\n", pos) + 1;
	const lineEnd = block.indexOf("\n", pos);
	const end = lineEnd === -1 ? block.length : lineEnd;
	const match = block.slice(lineStart, end).match(/^(?:([\w-]+)|"([\w-]+)"|'([\w-]+)'):\s*(.*)$/);
	const keyName = match?.[1] ?? match?.[2] ?? match?.[3];
	const rawValue = match?.[4]?.trim();
	const isTopLevelField = doc.contents.items.some((pair) => isScalar(pair.key) && pair.key.value === keyName && pair.key.range?.[0] === lineStart);
	const recoverColonRichText = error?.code === "BLOCK_AS_IMPLICIT_KEY" && rawValue?.includes(": ");
	if (!keyName || !rawValue || !FREEFORM_TEXT_FIELDS.has(keyName) || !isTopLevelField || keyName !== "description" && !recoverColonRichText || /^[|>](?:[1-9][+-]?|[+-][1-9]?)?$/.test(rawValue)) return block;
	const replacement = `${keyName}: ${JSON.stringify(stripQuotes(rawValue))}`;
	return `${block.slice(0, lineStart)}${replacement}${block.slice(end)}`;
}
function parseYamlFrontmatterOnce(block, fallback) {
	try {
		const doc = parseDocument(block, {
			schema: "core",
			prettyErrors: false
		});
		if (doc.errors.length > 0 || !isMap(doc.contents)) return {
			frontmatter: fallback,
			issues: doc.errors.length > 0 ? doc.errors.map((error) => ({
				code: error.code ?? error.name,
				message: error.message
			})) : [{
				code: "INVALID_ROOT",
				message: "frontmatter must be a YAML mapping"
			}]
		};
		const parsed = doc.toJS();
		if (!isRecord(parsed)) return {
			frontmatter: fallback,
			issues: [{
				code: "INVALID_ROOT",
				message: "frontmatter must be a YAML mapping"
			}]
		};
		const inlineColonKeys = /* @__PURE__ */ new Set();
		for (const pair of doc.contents.items) {
			if (!isNode(pair.key)) continue;
			const start = pair.key.range?.[0];
			if (start === void 0) continue;
			const lineEnd = block.indexOf("\n", start);
			const match = block.slice(start, lineEnd === -1 ? block.length : lineEnd).match(/^([\w-]+):\s*(.*)$/);
			if (match?.[1] && match[2]?.includes(":")) inlineColonKeys.add(match[1]);
		}
		const result = {};
		for (const [rawKey, value] of Object.entries(parsed)) {
			const key = rawKey.trim();
			const coerced = key ? coerceYamlFrontmatterValue(value) : void 0;
			if (!coerced) continue;
			const fallbackValue = Object.hasOwn(fallback, key) ? fallback[key] : void 0;
			result[key] = coerced.kind === "structured" && inlineColonKeys.has(key) && fallbackValue !== void 0 ? fallbackValue : coerced.value;
		}
		for (const [key, value] of Object.entries(fallback)) if (!Object.hasOwn(result, key)) result[key] = value;
		return {
			frontmatter: result,
			issues: []
		};
	} catch (error) {
		return {
			frontmatter: fallback,
			issues: [{
				code: "YAML_EXCEPTION",
				message: error instanceof Error ? error.message : String(error)
			}]
		};
	}
}
function parseYamlFrontmatter(block) {
	const fallback = parseLineFrontmatter(block);
	let parsed = parseYamlFrontmatterOnce(block, fallback);
	let recoveredBlock = block;
	for (let i = 0; i < FREEFORM_TEXT_FIELDS.size && parsed.issues.length > 0; i += 1) {
		const next = normalizeFreeformFieldAtError(recoveredBlock);
		if (next === recoveredBlock) break;
		recoveredBlock = next;
		parsed = parseYamlFrontmatterOnce(recoveredBlock, fallback);
	}
	return parsed;
}
function normalizeFrontmatterContent(content) {
	return content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
const FRONTMATTER_CLOSING_DELIMITER = /(?:^|\n)---[^\S\n]*(?:\n|(?![\s\S]))/;
const FRONTMATTER_OPENING_DELIMITER = /^---[^\S\n]*\n/;
function extractFrontmatterBlockFromNormalized(normalized) {
	const opening = FRONTMATTER_OPENING_DELIMITER.exec(normalized);
	if (!opening) return;
	const blockStart = opening[0].length;
	const tail = normalized.slice(blockStart);
	const closing = FRONTMATTER_CLOSING_DELIMITER.exec(tail);
	if (!closing) return;
	return {
		block: tail.slice(0, closing.index),
		body: tail.slice(closing.index + closing[0].length)
	};
}
/** Splits a complete leading YAML frontmatter block from its Markdown body. */
function extractFrontmatterBlock(content) {
	return extractFrontmatterBlockFromNormalized(normalizeFrontmatterContent(content));
}
/** Removes a leading YAML frontmatter block and returns the remaining Markdown body. */
function stripFrontmatterBlock(content) {
	const normalized = normalizeFrontmatterContent(content);
	return (extractFrontmatterBlockFromNormalized(normalized)?.body ?? normalized).trim();
}
/** Parses leading YAML frontmatter into string values used by skill and metadata loaders. */
function parseFrontmatterBlock(content) {
	return parseFrontmatterBlockResult(content).frontmatter;
}
/** Parses frontmatter once while retaining recoverable YAML parser issues for owning loaders. */
function parseFrontmatterBlockResult(content) {
	const normalized = normalizeFrontmatterContent(content);
	const block = extractFrontmatterBlockFromNormalized(normalized)?.block;
	if (block !== void 0) return block ? parseYamlFrontmatter(block) : {
		frontmatter: {},
		issues: []
	};
	return FRONTMATTER_OPENING_DELIMITER.test(normalized) ? {
		frontmatter: {},
		issues: [{
			code: "UNTERMINATED_FRONTMATTER",
			message: "missing closing --- delimiter"
		}]
	} : {
		frontmatter: {},
		issues: []
	};
}
//#endregion
//#region src/shared/frontmatter.ts
/** Normalizes comma-delimited or loose array metadata fields into string lists. */
function normalizeStringList(input) {
	return normalizeCsvOrLooseStringList(input);
}
/** Reads a frontmatter field only when it is represented as a string value. */
function getFrontmatterString(frontmatter, key) {
	return readStringValue(frontmatter[key]);
}
/** Parses boolean frontmatter strings while preserving the caller's default for missing values. */
function parseFrontmatterBool(value, fallback) {
	const parsed = parseBooleanValue(value);
	return parsed === void 0 ? fallback : parsed;
}
/** Parses the JSON5 OpenClaw manifest block embedded inside a string frontmatter field. */
function resolveOpenClawManifestBlock(params) {
	const raw = getFrontmatterString(params.frontmatter, params.key ?? "metadata");
	if (!raw) return;
	try {
		const parsed = parseJsonWithJson5Fallback(raw, JSON5);
		if (!parsed || typeof parsed !== "object") return;
		const manifestKeys = [MANIFEST_KEY, ...LEGACY_MANIFEST_KEYS];
		for (const key of manifestKeys) {
			const candidate = parsed[key];
			if (candidate && typeof candidate === "object") return candidate;
		}
		return;
	} catch {
		return;
	}
}
/** Extracts normalized runtime requirement lists from an OpenClaw manifest block. */
function resolveOpenClawManifestRequires(metadataObj) {
	const requiresRaw = typeof metadataObj.requires === "object" && metadataObj.requires !== null ? metadataObj.requires : void 0;
	if (!requiresRaw) return;
	return {
		bins: normalizeStringList(requiresRaw.bins),
		anyBins: normalizeStringList(requiresRaw.anyBins),
		env: normalizeStringList(requiresRaw.env),
		config: normalizeStringList(requiresRaw.config)
	};
}
/** Parses manifest install entries with a caller-owned parser and drops unsupported specs. */
function resolveOpenClawManifestInstall(metadataObj, parseInstallSpec) {
	return (Array.isArray(metadataObj.install) ? metadataObj.install : []).map((entry) => parseInstallSpec(entry)).filter((entry) => Boolean(entry));
}
/** Extracts normalized OS allowlist entries from an OpenClaw manifest block. */
function resolveOpenClawManifestOs(metadataObj) {
	return normalizeStringList(metadataObj.os);
}
/** Parses kind/type plus common install fields shared by package-manager install specs. */
function parseOpenClawManifestInstallBase(input, allowedKinds) {
	if (!input || typeof input !== "object") return;
	const raw = input;
	const kindRaw = typeof raw.kind === "string" ? raw.kind : typeof raw.type === "string" ? raw.type : "";
	const kind = normalizeOptionalLowercaseString(kindRaw) ?? "";
	if (!allowedKinds.includes(kind)) return;
	const spec = {
		raw,
		kind
	};
	if (typeof raw.id === "string") spec.id = raw.id;
	if (typeof raw.label === "string") spec.label = raw.label;
	const bins = normalizeStringList(raw.bins);
	if (bins.length > 0) spec.bins = bins;
	return spec;
}
/** Copies optional common install fields onto a caller-specific install spec object. */
function applyOpenClawManifestInstallCommonFields(spec, parsed) {
	if (parsed.id) spec.id = parsed.id;
	if (parsed.label) spec.label = parsed.label;
	if (parsed.bins) spec.bins = parsed.bins;
	return spec;
}
//#endregion
export { parseOpenClawManifestInstallBase as a, resolveOpenClawManifestOs as c, parseFrontmatterBlock as d, parseFrontmatterBlockResult as f, parseFrontmatterBool as i, resolveOpenClawManifestRequires as l, getFrontmatterString as n, resolveOpenClawManifestBlock as o, stripFrontmatterBlock as p, normalizeStringList as r, resolveOpenClawManifestInstall as s, applyOpenClawManifestInstallCommonFields as t, extractFrontmatterBlock as u };
