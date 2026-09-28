import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as readRegularFileSync, r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import "./workspace-mlzi3k1x.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/identity-file.ts
/**
* IDENTITY.md parsing and writing support.
* The parser accepts human-authored markdown, while the writer only updates
* stable rich identity fields.
*/
const MAX_IDENTITY_FILE_BYTES = 4194304;
const WRITABLE_IDENTITY_FIELDS = [
	["name", "Name"],
	["theme", "Theme"],
	["emoji", "Emoji"],
	["avatar", "Avatar"]
];
const RICH_IDENTITY_LABELS = /* @__PURE__ */ new Set([
	"name",
	"creature",
	"vibe",
	"theme",
	"emoji",
	"avatar"
]);
const IDENTITY_PLACEHOLDER_VALUES = /* @__PURE__ */ new Set([
	"not set yet",
	"pick something you like",
	"ai? robot? familiar? ghost in the machine? something weirder?",
	"how do you come across? sharp? warm? chaotic? calm?",
	"your signature - pick one that feels right",
	"workspace-relative path, http(s) url, or data uri"
]);
function sanitizeAgentIdentityLine(value) {
	return value.replace(/\s+/g, " ").trim();
}
const IDENTITY_CONFIG_FIELDS = [
	"name",
	"theme",
	"emoji",
	"avatar"
];
function compactIdentityConfig(identity) {
	const resolved = {};
	for (const field of IDENTITY_CONFIG_FIELDS) {
		const value = identity[field]?.trim();
		if (value) resolved[field] = value;
	}
	return Object.keys(resolved).length ? resolved : void 0;
}
function createAgentIdentityConfig(params) {
	return compactIdentityConfig({
		...params.name ? { name: sanitizeAgentIdentityLine(params.name) } : {},
		emoji: sanitizeAgentIdentityLine(normalizeOptionalString(params.emoji) ?? ""),
		avatar: sanitizeAgentIdentityLine(normalizeOptionalString(params.avatar) ?? "")
	});
}
function normalizeIdentityForFile(identity) {
	return identity ? compactIdentityConfig(identity) : void 0;
}
function normalizeIdentityValue(value) {
	let normalized = value.trim();
	normalized = normalized.replace(/^[*_`\s]+|[*_`\s]+$/g, "").trim();
	if (normalized.startsWith("(") && normalized.endsWith(")")) normalized = normalized.slice(1, -1).trim();
	normalized = normalized.replace(/[\u2013\u2014]/g, "-");
	return normalizeLowercaseStringOrEmpty(normalized.replace(/\s+/g, " "));
}
function normalizeIdentityLabel(label) {
	return normalizeLowercaseStringOrEmpty(label.replace(/[*_`]/g, ""));
}
function isIdentityPlaceholder(value) {
	const normalized = normalizeIdentityValue(value);
	return IDENTITY_PLACEHOLDER_VALUES.has(normalized);
}
/** Parse rich identity fields from human-authored markdown content. */
function parseIdentityMarkdown(content) {
	const identity = {};
	const lines = content.split(/\r?\n/);
	for (const line of lines) {
		const cleaned = line.trim().replace(/^\s*-\s*/, "");
		const colonIndex = cleaned.indexOf(":");
		if (colonIndex === -1) continue;
		const label = normalizeIdentityLabel(cleaned.slice(0, colonIndex));
		const value = cleaned.slice(colonIndex + 1).replace(/^[*_`\s]+|[*_`\s]+$/g, "").trim();
		if (!value) continue;
		if (isIdentityPlaceholder(value)) continue;
		if (label === "name") identity.name = value;
		if (label === "emoji") identity.emoji = value;
		if (label === "creature") identity.creature = value;
		if (label === "vibe") identity.vibe = value;
		if (label === "theme") identity.theme = value;
		if (label === "avatar") identity.avatar = value;
	}
	return identity;
}
/** Return true when the parsed identity has any meaningful user-supplied value. */
function identityHasValues(identity) {
	return Boolean(identity.name || identity.emoji || identity.theme || identity.creature || identity.vibe || identity.avatar);
}
function buildIdentityLine(label, value) {
	return `- ${label}: ${value}`;
}
function matchesIdentityLabel(line, label) {
	const trimmed = line.trim();
	if (!trimmed.startsWith("-")) return false;
	const cleaned = trimmed.replace(/^\s*-\s*/, "");
	const colonIndex = cleaned.indexOf(":");
	if (colonIndex === -1) return false;
	return normalizeIdentityLabel(cleaned.slice(0, colonIndex)) === normalizeIdentityLabel(label);
}
function normalizeIdentityContent(content) {
	if (!content) return [];
	return content.replace(/\r\n/g, "\n").split("\n");
}
function resolveIdentityInsertIndex(lines) {
	let lastIdentityIndex = -1;
	for (const [index, line] of lines.entries()) {
		const cleaned = line.trim().replace(/^\s*-\s*/, "");
		const colonIndex = cleaned.indexOf(":");
		if (colonIndex === -1) continue;
		const label = normalizeIdentityLabel(cleaned.slice(0, colonIndex));
		if (RICH_IDENTITY_LABELS.has(label)) lastIdentityIndex = index;
	}
	if (lastIdentityIndex >= 0) return lastIdentityIndex + 1;
	const headingIndex = lines.findIndex((line) => line.trim().startsWith("#"));
	if (headingIndex === -1) return 0;
	let insertIndex = headingIndex + 1;
	while (insertIndex < lines.length && lines[insertIndex]?.trim() === "") insertIndex += 1;
	return insertIndex;
}
/**
* Merge writable identity fields into existing IDENTITY.md content, replacing
* duplicate labels and preserving unrelated markdown.
*/
function mergeIdentityMarkdownContent(content, identity) {
	const lines = normalizeIdentityContent(content);
	const nextLines = lines.length > 0 ? [...lines] : ["# IDENTITY.md - Agent Identity", ""];
	for (const [field, label] of WRITABLE_IDENTITY_FIELDS) {
		const value = identity[field]?.trim();
		if (!value) continue;
		const matchingIndexes = nextLines.reduce((indexes, line, index) => {
			if (matchesIdentityLabel(line, label)) indexes.push(index);
			return indexes;
		}, []);
		if (matchingIndexes.length > 0) {
			const [firstIndex, ...duplicateIndexes] = matchingIndexes;
			if (firstIndex === void 0) continue;
			nextLines[firstIndex] = buildIdentityLine(label, value);
			for (const duplicateIndex of duplicateIndexes.toReversed()) nextLines.splice(duplicateIndex, 1);
			continue;
		}
		const insertIndex = resolveIdentityInsertIndex(nextLines);
		nextLines.splice(insertIndex, 0, buildIdentityLine(label, value));
	}
	return nextLines.join("\n").replace(/\n*$/, "\n");
}
async function buildIdentityMarkdownForWrite(params) {
	const workspaces = params.fallbackWorkspaceDir ? params.preferFallbackWorkspaceContent ? [params.fallbackWorkspaceDir, params.workspaceDir] : [params.workspaceDir, params.fallbackWorkspaceDir] : [params.workspaceDir];
	for (const workspaceDir of workspaces) {
		const content = await params.readWorkspaceFileContent(workspaceDir, DEFAULT_IDENTITY_FILENAME);
		if (content !== void 0) return mergeIdentityMarkdownContent(content, params.identity);
	}
	return mergeIdentityMarkdownContent(void 0, params.identity);
}
function loadIdentityFromFile(identityPath) {
	try {
		const resolvedPath = fs.realpathSync(identityPath);
		const { buffer } = readRegularFileSync({
			filePath: resolvedPath,
			maxBytes: MAX_IDENTITY_FILE_BYTES
		});
		const parsed = parseIdentityMarkdown(buffer.toString("utf-8"));
		if (!identityHasValues(parsed)) return null;
		return parsed;
	} catch {
		return null;
	}
}
/** Load a specific identity file when it exists and contains real values. */
async function loadAgentIdentityFromFile(identityPath) {
	let resolvedPath;
	try {
		resolvedPath = await fs.promises.realpath(identityPath);
		const { buffer } = await readRegularFile({
			filePath: resolvedPath,
			maxBytes: MAX_IDENTITY_FILE_BYTES
		});
		const parsed = parseIdentityMarkdown(buffer.toString("utf-8"));
		if (!identityHasValues(parsed)) return null;
		return parsed;
	} catch (error) {
		if (resolvedPath && error instanceof Error && error.message === `File exceeds ${MAX_IDENTITY_FILE_BYTES} bytes: ${resolvedPath}`) throw new Error(`Identity file ${identityPath} exceeds the maximum size of ${MAX_IDENTITY_FILE_BYTES} bytes`, { cause: error });
		return null;
	}
}
/** Load the workspace identity file when it exists and contains real values. */
function loadAgentIdentityFromWorkspace(workspace) {
	return loadIdentityFromFile(path.join(workspace, DEFAULT_IDENTITY_FILENAME));
}
//#endregion
export { mergeIdentityMarkdownContent as a, loadAgentIdentityFromWorkspace as i, createAgentIdentityConfig as n, normalizeIdentityForFile as o, loadAgentIdentityFromFile as r, sanitizeAgentIdentityLine as s, buildIdentityMarkdownForWrite as t };
