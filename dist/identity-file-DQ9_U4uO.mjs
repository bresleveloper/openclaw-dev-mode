import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import fs from "node:fs";
import path from "node:path";
import { openRootFileSync, readFileDescriptorBoundedSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/agents/identity-file.ts
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
function normalizeIdentityForFile(identity) {
	const resolved = {};
	for (const [field] of WRITABLE_IDENTITY_FIELDS) {
		const value = identity?.[field]?.trim();
		if (value) resolved[field] = value;
	}
	return Object.keys(resolved).length ? resolved : void 0;
}
function createAgentIdentityConfig(params) {
	return normalizeIdentityForFile({
		...params.name ? { name: sanitizeAgentIdentityLine(params.name) } : {},
		emoji: sanitizeAgentIdentityLine(normalizeOptionalString(params.emoji) ?? ""),
		avatar: sanitizeAgentIdentityLine(normalizeOptionalString(params.avatar) ?? "")
	});
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
function parseIdentityLine(line) {
	const cleaned = line.trim().replace(/^\s*-\s*/, "");
	const colonIndex = cleaned.indexOf(":");
	return colonIndex === -1 ? void 0 : {
		label: normalizeIdentityLabel(cleaned.slice(0, colonIndex)),
		value: cleaned.slice(colonIndex + 1)
	};
}
function parseIdentityMarkdown(content) {
	const identity = {};
	for (const line of content.split(/\r?\n/)) {
		const parsed = parseIdentityLine(line);
		if (!parsed) continue;
		const value = parsed.value.replace(/^[*_`\s]+|[*_`\s]+$/g, "").trim();
		if (!value || IDENTITY_PLACEHOLDER_VALUES.has(normalizeIdentityValue(value))) continue;
		switch (parsed.label) {
			case "name":
			case "emoji":
			case "creature":
			case "vibe":
			case "theme":
			case "avatar": identity[parsed.label] = value;
		}
	}
	return Object.keys(identity).length > 0 ? identity : null;
}
function resolveIdentityInsertIndex(lines) {
	const lastIdentityIndex = lines.findLastIndex((line) => RICH_IDENTITY_LABELS.has(parseIdentityLine(line)?.label ?? ""));
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
	const nextLines = content ? content.replace(/\r\n/g, "\n").split("\n") : ["# IDENTITY.md - Agent Identity", ""];
	for (const [field, label] of WRITABLE_IDENTITY_FIELDS) {
		const value = identity[field]?.trim();
		if (!value) continue;
		const identityLine = `- ${label}: ${value}`;
		const [firstIndex, ...duplicateIndexes] = nextLines.reduce((indexes, line, index) => {
			if (line.trim().startsWith("-") && parseIdentityLine(line)?.label === field) indexes.push(index);
			return indexes;
		}, []);
		if (firstIndex !== void 0) {
			nextLines[firstIndex] = identityLine;
			for (const duplicateIndex of duplicateIndexes.toReversed()) nextLines.splice(duplicateIndex, 1);
			continue;
		}
		const insertIndex = resolveIdentityInsertIndex(nextLines);
		nextLines.splice(insertIndex, 0, identityLine);
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
/** Shared admission kernel for the worker and the shipped synchronous SDK reader. */
function readIdentityFileSnapshot(input) {
	try {
		const resolvedPath = fs.realpathSync(input.identityPath);
		const opened = openRootFileSync({
			absolutePath: resolvedPath,
			rootPath: path.dirname(resolvedPath),
			rootRealPath: path.dirname(resolvedPath),
			boundaryLabel: "identity file directory",
			rejectHardlinks: false
		});
		if (!opened.ok) return { kind: "missing" };
		try {
			const { dev, ino, size, mtimeMs, ctimeMs } = opened.stat;
			if (size > MAX_IDENTITY_FILE_BYTES) return { kind: "too-large" };
			const revision = JSON.stringify([
				opened.path,
				dev,
				ino,
				size,
				mtimeMs,
				ctimeMs
			]);
			if (revision === input.knownRevision) return { kind: "unchanged" };
			const buffer = readFileDescriptorBoundedSync(opened.fd, MAX_IDENTITY_FILE_BYTES);
			const identity = parseIdentityMarkdown(buffer.toString("utf-8"));
			return {
				kind: "loaded",
				revision,
				size: buffer.byteLength,
				identity
			};
		} finally {
			fs.closeSync(opened.fd);
		}
	} catch (error) {
		return { kind: error instanceof FsSafeError && error.code === "too-large" ? "too-large" : "missing" };
	}
}
/** Load a specific identity file when it exists and contains real values. */
async function loadAgentIdentityFromFile(identityPath) {
	const { prepareIdentityFile } = await import("./identity-file-runtime-Dero-L_n.mjs");
	const result = await prepareIdentityFile(identityPath);
	if (result.kind === "too-large") throw new Error(`Identity file ${identityPath} exceeds the maximum size of ${MAX_IDENTITY_FILE_BYTES} bytes`, { cause: new FsSafeError("too-large", `File exceeds ${MAX_IDENTITY_FILE_BYTES} bytes: ${identityPath}`) });
	return result.kind === "loaded" ? result.identity : null;
}
/** Retained synchronous contract for the shipped agent-avatar Plugin SDK facade. */
function loadAgentIdentityFromWorkspace(workspace) {
	const result = readIdentityFileSnapshot({ identityPath: path.join(workspace, DEFAULT_IDENTITY_FILENAME) });
	return result.kind === "loaded" ? result.identity : null;
}
/** Workspace presentation treats unavailable or unreadable identity files as absent. */
async function loadAgentIdentityFromWorkspaceAsync(workspace) {
	try {
		const { prepareIdentityFile } = await import("./identity-file-runtime-Dero-L_n.mjs");
		const result = await prepareIdentityFile(path.join(workspace, DEFAULT_IDENTITY_FILENAME));
		return result.kind === "loaded" ? result.identity : null;
	} catch {
		return null;
	}
}
//#endregion
export { loadAgentIdentityFromWorkspaceAsync as a, readIdentityFileSnapshot as c, loadAgentIdentityFromWorkspace as i, sanitizeAgentIdentityLine as l, createAgentIdentityConfig as n, mergeIdentityMarkdownContent as o, loadAgentIdentityFromFile as r, normalizeIdentityForFile as s, buildIdentityMarkdownForWrite as t };
