import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList, c as normalizeSingleOrTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as walkRootDirectory } from "./root-walk-CePL-4Ds.mjs";
import { t as fromMarkdown } from "./lib-BdF0Xu6y.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { s as readFileWindowFully } from "./file-access-runtime-DZTMkCCU.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./root-walk-DjwL4cv4.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
import { isUtf8 } from "node:buffer";
import YAML from "yaml";
//#region extensions/memory-wiki/src/markdown-links.ts
const WIKI_RELATED_START_MARKER = "<!-- openclaw:wiki:related:start -->";
const WIKI_RELATED_END_MARKER = "<!-- openclaw:wiki:related:end -->";
const OBSIDIAN_LINK_PATTERN = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const RELATED_BLOCK_PATTERN = new RegExp(`${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}`, "g");
function normalizeMarkdownLinkTarget(sourceRelativePath, target) {
	return path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelativePath), target));
}
function decodeMarkdownLinkPath(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
function forEachCodeRange(tree, visitRange) {
	const visit = (node) => {
		if (node.type === "code" || node.type === "inlineCode") {
			const start = node.position?.start?.offset;
			const end = node.position?.end?.offset;
			if (start !== void 0 && end !== void 0) visitRange(start, end);
			return;
		}
		for (const child of node.children ?? []) visit(child);
	};
	visit(tree);
}
function forEachMarkdownCodeRange(markdown, visitRange) {
	forEachCodeRange(fromMarkdown(markdown), visitRange);
}
function maskMarkdownCode(markdown, keepUnclosedFences = false) {
	const source = keepUnclosedFences ? `${markdown}\n\n#` : markdown;
	return maskMarkdownCodeFromTree(markdown, fromMarkdown(source));
}
function maskMarkdownCodeFromTree(markdown, tree) {
	const masked = markdown.split("");
	forEachCodeRange(tree, (start, end) => {
		if (end > markdown.length) return;
		for (let index = start; index < end; index++) if (masked[index] !== "\n" && masked[index] !== "\r") masked[index] = " ";
	});
	return masked.join("");
}
function extractWikiLinks(markdown, sourceRelativePath) {
	if (!markdown.includes("[")) return [];
	const withoutRelatedBlock = markdown.replace(RELATED_BLOCK_PATTERN, "");
	const tree = fromMarkdown(withoutRelatedBlock);
	const searchable = maskMarkdownCodeFromTree(withoutRelatedBlock, tree);
	const links = [];
	for (const match of searchable.matchAll(OBSIDIAN_LINK_PATTERN)) {
		const target = match[1]?.trim();
		if (target) links.push(target);
	}
	const visit = (node) => {
		if (node.type === "link" || node.type === "image") {
			const rawTarget = node.url?.trim();
			if (rawTarget && !rawTarget.startsWith("#") && !/^[a-z]+:/i.test(rawTarget)) {
				const target = decodeMarkdownLinkPath(rawTarget.split("#")[0]?.split("?")[0] ?? "").replace(/\\/g, "/").trim();
				if (target) links.push(normalizeMarkdownLinkTarget(sourceRelativePath, target));
			}
		}
		for (const child of node.children ?? []) visit(child);
	};
	visit(tree);
	return links;
}
//#endregion
//#region extensions/memory-wiki/src/markdown.ts
const WIKI_PAGE_GROUPS = [
	{
		kind: "source",
		dir: "sources",
		heading: "Sources"
	},
	{
		kind: "entity",
		dir: "entities",
		heading: "Entities"
	},
	{
		kind: "concept",
		dir: "concepts",
		heading: "Concepts"
	},
	{
		kind: "synthesis",
		dir: "syntheses",
		heading: "Syntheses"
	},
	{
		kind: "report",
		dir: "reports",
		heading: "Reports"
	}
];
const WIKI_RAW_SOURCE_MARKER = "<!-- openclaw:wiki:raw-source -->";
var WikiPageNotUtf8Error = class extends Error {
	constructor(displayPath) {
		super(`Wiki page is not valid UTF-8 and cannot be rewritten safely: ${displayPath}. The file was left unchanged. Keep a byte-for-byte backup, convert a copy to UTF-8 with its original encoding, then retry.`);
		this.name = "WikiPageNotUtf8Error";
	}
};
function decodeWikiPageUtf8(bytes, displayPath) {
	if (!isUtf8(bytes)) throw new WikiPageNotUtf8Error(displayPath);
	return bytes.toString("utf8");
}
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const MAX_WIKI_SEGMENT_BYTES = 240;
const MAX_WIKI_SAFE_WRITE_FILENAME_COMPONENT_BYTES = 255 - Buffer.byteLength(".00000000-0000-4000-8000-000000000000.fallback.tmp") - Buffer.byteLength(".");
const WIKI_SEGMENT_HASH_BYTES = 12;
const WIKI_RESERVED_PAGE_STEMS = /* @__PURE__ */ new Set(["index"]);
const HUMAN_START_MARKER = "<!-- openclaw:human:start -->";
const HUMAN_END_MARKER = "<!-- openclaw:human:end -->";
function capWikiValueWithHash(raw, maxBytes, fallback) {
	if (Buffer.byteLength(raw) <= maxBytes) return raw;
	const suffix = createHash("sha1").update(raw).digest("hex").slice(0, WIKI_SEGMENT_HASH_BYTES);
	return `${truncateUtf8Prefix(raw, maxBytes - Buffer.byteLength(`-${suffix}`)).replace(/-+$/g, "") || fallback}-${suffix}`;
}
function slugifyWikiSegment(raw) {
	const slug = normalizeLowercaseStringOrEmpty(raw).replace(/[^\p{L}\p{N}\p{M}]+/gu, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
	if (!slug) return "page";
	return capWikiValueWithHash(slug, MAX_WIKI_SEGMENT_BYTES, "page");
}
function slugifyWikiPageStem(raw) {
	const slug = slugifyWikiSegment(raw);
	if (!WIKI_RESERVED_PAGE_STEMS.has(slug)) return slug;
	return `${slug}-${createHash("sha1").update(slug).digest("hex").slice(0, WIKI_SEGMENT_HASH_BYTES)}`;
}
function createWikiPageFilename(stem, extension = ".md") {
	const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;
	return `${capWikiValueWithHash(stem, Math.max(1, MAX_WIKI_SAFE_WRITE_FILENAME_COMPONENT_BYTES - Buffer.byteLength(normalizedExtension)), "page")}${normalizedExtension}`;
}
function parseWikiMarkdown(content) {
	const match = content.match(FRONTMATTER_PATTERN);
	if (!match) return {
		hasFrontmatter: false,
		frontmatter: {},
		body: content
	};
	const frontmatter = match[1];
	const parsed = asNullableRecord(YAML.parse(frontmatter));
	if (!parsed) throw new TypeError("Wiki frontmatter must be a YAML mapping");
	return {
		hasFrontmatter: true,
		frontmatter: parsed,
		body: content.slice(match[0].length)
	};
}
function renderWikiMarkdown(params) {
	return `---\n${YAML.stringify(params.frontmatter).trimEnd()}\n---\n\n${params.body.trimStart()}`;
}
function extractTitleFromMarkdown(body) {
	const match = body.match(/^#\s+(.+?)\s*$/m);
	return normalizeOptionalString(match?.[1]);
}
function normalizeOptionalStringFields(record, keys) {
	const fields = {};
	for (const key of keys) {
		const value = normalizeOptionalString(record[key]);
		if (value) fields[key] = value;
	}
	return fields;
}
function normalizeWikiClaimEvidence(value) {
	const record = asNullableRecord(value);
	if (!record) return null;
	const weight = asFiniteNumber(record.weight);
	const confidence = asFiniteNumber(record.confidence);
	const evidence = {
		...normalizeOptionalStringFields(record, [
			"kind",
			"sourceId",
			"path",
			"lines"
		]),
		...weight !== void 0 ? { weight } : {},
		...confidence !== void 0 ? { confidence } : {},
		...normalizeOptionalStringFields(record, [
			"privacyTier",
			"note",
			"updatedAt"
		])
	};
	return Object.keys(evidence).length > 0 ? evidence : null;
}
function normalizeWikiClaims(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const record = asNullableRecord(entry);
		if (!record) return [];
		const text = normalizeOptionalString(record.text);
		if (!text) return [];
		const evidence = Array.isArray(record.evidence) ? record.evidence.flatMap((candidate) => {
			const normalized = normalizeWikiClaimEvidence(candidate);
			return normalized ? [normalized] : [];
		}) : [];
		const confidence = asFiniteNumber(record.confidence);
		return [{
			...normalizeOptionalStringFields(record, ["id"]),
			text,
			...normalizeOptionalStringFields(record, ["status"]),
			...confidence !== void 0 ? { confidence } : {},
			evidence,
			...normalizeOptionalStringFields(record, ["updatedAt"])
		}];
	});
}
function normalizeWikiPersonCard(value) {
	const record = asNullableRecord(value);
	if (!record) return;
	const confidence = asFiniteNumber(record.confidence);
	const card = {
		...normalizeOptionalStringFields(record, ["canonicalId"]),
		handles: normalizeSingleOrTrimmedStringList(record.handles),
		socials: normalizeSingleOrTrimmedStringList(record.socials),
		emails: normalizeSingleOrTrimmedStringList(record.emails ?? record.email),
		...normalizeOptionalStringFields(record, ["timezone", "lane"]),
		askFor: normalizeSingleOrTrimmedStringList(record.askFor),
		avoidAskingFor: normalizeSingleOrTrimmedStringList(record.avoidAskingFor),
		bestUsedFor: normalizeSingleOrTrimmedStringList(record.bestUsedFor),
		notEnoughFor: normalizeSingleOrTrimmedStringList(record.notEnoughFor),
		...confidence !== void 0 ? { confidence } : {},
		...normalizeOptionalStringFields(record, ["privacyTier", "lastRefreshedAt"])
	};
	return Object.values(card).some((field) => Array.isArray(field) ? field.length > 0 : field !== void 0) ? card : void 0;
}
function normalizeWikiRelationships(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const record = asNullableRecord(entry);
		if (!record) return [];
		const weight = asFiniteNumber(record.weight);
		const confidence = asFiniteNumber(record.confidence);
		const relationship = {
			...normalizeOptionalStringFields(record, [
				"targetId",
				"targetPath",
				"targetTitle",
				"kind"
			]),
			...weight !== void 0 ? { weight } : {},
			...confidence !== void 0 ? { confidence } : {},
			...normalizeOptionalStringFields(record, [
				"evidenceKind",
				"privacyTier",
				"note",
				"updatedAt"
			])
		};
		return Object.keys(relationship).length > 0 ? [relationship] : [];
	});
}
function hasGeneratedWrapperLines(lines, patterns) {
	if (!patterns[0]?.test(lines[0] ?? "") || patterns[1] && !patterns[1].test(lines[1] ?? "")) return false;
	let patternIndex = 2;
	for (const line of lines.slice(2)) {
		const pattern = patterns[patternIndex];
		if (!pattern) return true;
		if (pattern.test(line)) patternIndex += 1;
	}
	return patternIndex === patterns.length;
}
const SOURCE_CONTENT_HEADING = /(?:^|\r?\n)## Content\r?\n/u;
function afterSourceContentFence(page) {
	const heading = SOURCE_CONTENT_HEADING.exec(page);
	if (!heading) return 0;
	const fenceLineStart = heading.index + heading[0].length;
	const fence = /^`+/.exec(page.slice(fenceLineStart))?.[0];
	if (!fence) return fenceLineStart;
	const close = new RegExp(`\\r?\\n${fence}(?=\\r?\\n|$)`, "u").exec(page.slice(fenceLineStart + fence.length));
	if (!close) return fenceLineStart;
	return fenceLineStart + fence.length + close.index + close[0].length;
}
function findNotesHumanBlock(page, producerMarkdown = false) {
	const bodyOffset = producerMarkdown ? page.match(FRONTMATTER_PATTERN)?.[0].length ?? 0 : 0;
	const searchable = producerMarkdown ? maskMarkdownCode(page.slice(bodyOffset), true) : page;
	const searchFrom = producerMarkdown ? 0 : afterSourceContentFence(page);
	const start = searchable.indexOf(HUMAN_START_MARKER, searchFrom);
	const endMarker = searchable.lastIndexOf(HUMAN_END_MARKER);
	if (start === -1 && endMarker < searchFrom) {
		if (producerMarkdown) return null;
		if (!/(?:^|\r?\n)## Notes[\t ]*(?:\r?\n|$)([\s\S]*)/u.exec(page.slice(searchFrom))?.[1]?.trim()) return null;
	}
	if (start === -1 || endMarker < start) throw new Error(`Memory Wiki human Notes are missing ${start === -1 ? HUMAN_START_MARKER : HUMAN_END_MARKER}; restore the missing marker before updating or removing this page`);
	return {
		start: bodyOffset + start,
		end: bodyOffset + endMarker + 27
	};
}
function extractHumanNotesBlock(page, options) {
	const block = findNotesHumanBlock(page, options?.producerMarkdown);
	if (!block) return null;
	return page.slice(block.start + 29, block.end - 27).trim() ? page.slice(block.start, block.end) : null;
}
function preserveHumanNotesBlock(rendered, existing, options) {
	const existingBlock = findNotesHumanBlock(existing, options?.producerMarkdown);
	const renderedBlock = findNotesHumanBlock(rendered, options?.producerMarkdown);
	if (!existingBlock || !renderedBlock) return rendered;
	return rendered.slice(0, renderedBlock.start) + existing.slice(existingBlock.start, existingBlock.end) + rendered.slice(renderedBlock.end);
}
const GENERATED_SOURCE_WRAPPERS = [
	{
		kind: "bridge",
		patterns: [
			/^# Memory Bridge(?:\s*\(|:)/u,
			/^## Bridge Source\s*$/u,
			/^## Content\s*$/u
		]
	},
	{
		kind: "unsafe-local",
		patterns: [
			/^# Unsafe Local Import:/u,
			/^## Unsafe Local Source\s*$/u,
			/^## Content\s*$/u
		]
	},
	{
		kind: "local-file",
		patterns: [
			/^#\s+\S/u,
			/^## Source\s*$/u,
			/^- Type: `local-file`\s*$/u,
			/^## Content\s*$/u
		]
	},
	{
		kind: "chatgpt-export",
		patterns: [
			/^# ChatGPT Export:/u,
			/^## Source\s*$/u,
			/^- Conversation id: `[^`]+`\s*$/u,
			/^## Active Branch Transcript\s*$/u
		]
	}
];
function detectGeneratedSourceBody(markdown) {
	if (!markdown.includes("<!-- openclaw:human:start -->") || !markdown.includes("<!-- openclaw:human:end -->")) return;
	const lines = markdown.replace(/\r\n?/g, "\n").trimStart().split("\n").map((line) => line.trimEnd()).filter((line) => line.trim().length > 0 && line.trim() !== "<!-- openclaw:wiki:raw-source -->");
	return GENERATED_SOURCE_WRAPPERS.find(({ patterns }) => hasGeneratedWrapperLines(lines, patterns))?.kind;
}
function detectUnmanagedRawSourceBody(markdown) {
	const trimBlankLines = (value) => value.replace(/^(?:[ \t]*\n)+/u, "");
	const normalized = trimBlankLines(markdown.replace(/\r\n?/g, "\n"));
	const withoutTitle = trimBlankLines(normalized.replace(/^#\s+.+?\s*\n/u, ""));
	return normalized.startsWith("<!-- openclaw:wiki:raw-source -->") || withoutTitle.startsWith("<!-- openclaw:wiki:raw-source -->");
}
function hasWikiSourceFrontmatter(frontmatter) {
	return normalizeOptionalString(frontmatter.pageType) !== void 0 || normalizeOptionalString(frontmatter.sourceType) !== void 0 || normalizeOptionalString(frontmatter.provenanceMode) !== void 0;
}
function isUnmanagedRawSourceSummary(page) {
	return page.kind === "source" && page.unmanagedRawSourceBody === true && !page.generatedSourceBody;
}
function formatWikiLink(params) {
	const withoutExtension = params.relativePath.replace(/\.md$/i, "");
	if (params.renderMode === "obsidian") return `[[${withoutExtension}|${params.title}]]`;
	const linkTarget = params.sourceRelativeTo ? path.posix.relative(path.posix.dirname(params.sourceRelativeTo), params.relativePath) : params.relativePath;
	return `[${params.title}](${linkTarget})`;
}
function renderMarkdownFence(content, infoString = "text") {
	let fenceSize = 3;
	for (const match of content.matchAll(/`+/g)) fenceSize = Math.max(fenceSize, match[0].length + 1);
	const fence = "`".repeat(fenceSize);
	return `${fence}${infoString}\n${content}\n${fence}`;
}
function inferWikiPageKind(relativePath) {
	const normalized = relativePath.split(path.sep).join("/");
	return WIKI_PAGE_GROUPS.find((group) => normalized.startsWith(`${group.dir}/`))?.kind ?? null;
}
function scanWikiPageSummary(params) {
	const kind = inferWikiPageKind(params.relativePath);
	if (!kind) return { status: "ignored" };
	let parsed;
	try {
		parsed = parseWikiMarkdown(params.raw);
	} catch (error) {
		return {
			status: "invalid-frontmatter",
			error: {
				relativePath: params.relativePath.split(path.sep).join("/"),
				message: error instanceof Error ? error.message : String(error)
			}
		};
	}
	const title = typeof parsed.frontmatter.title === "string" && parsed.frontmatter.title.trim() || extractTitleFromMarkdown(parsed.body) || path.basename(params.relativePath, ".md");
	const generatedSourceBody = detectGeneratedSourceBody(parsed.body);
	const importedSourceBody = generatedSourceBody === "bridge" || generatedSourceBody === "unsafe-local" ? generatedSourceBody : void 0;
	const unmanagedRawSourceBody = !generatedSourceBody && !hasWikiSourceFrontmatter(parsed.frontmatter) && detectUnmanagedRawSourceBody(parsed.body);
	return {
		status: "valid",
		parsed,
		page: {
			absolutePath: params.absolutePath,
			relativePath: params.relativePath.split(path.sep).join("/"),
			kind,
			title,
			hasFrontmatter: parsed.hasFrontmatter,
			id: normalizeOptionalString(parsed.frontmatter.id),
			pageType: normalizeOptionalString(parsed.frontmatter.pageType),
			entityType: normalizeOptionalString(parsed.frontmatter.entityType),
			canonicalId: normalizeOptionalString(parsed.frontmatter.canonicalId),
			aliases: normalizeSingleOrTrimmedStringList(parsed.frontmatter.aliases),
			sourceIds: normalizeSingleOrTrimmedStringList(parsed.frontmatter.sourceIds),
			linkTargets: params.includeLinks === false ? [] : extractWikiLinks(params.raw, params.relativePath.split(path.sep).join("/")),
			claims: normalizeWikiClaims(parsed.frontmatter.claims),
			contradictions: normalizeSingleOrTrimmedStringList(parsed.frontmatter.contradictions),
			questions: normalizeSingleOrTrimmedStringList(parsed.frontmatter.questions),
			confidence: asFiniteNumber(parsed.frontmatter.confidence),
			privacyTier: normalizeOptionalString(parsed.frontmatter.privacyTier),
			personCard: normalizeWikiPersonCard(parsed.frontmatter.personCard),
			relationships: normalizeWikiRelationships(parsed.frontmatter.relationships),
			bestUsedFor: normalizeSingleOrTrimmedStringList(parsed.frontmatter.bestUsedFor),
			notEnoughFor: normalizeSingleOrTrimmedStringList(parsed.frontmatter.notEnoughFor),
			sourceType: normalizeOptionalString(parsed.frontmatter.sourceType),
			provenanceMode: normalizeOptionalString(parsed.frontmatter.provenanceMode),
			...importedSourceBody ? { importedSourceBody } : {},
			...generatedSourceBody ? { generatedSourceBody } : {},
			...unmanagedRawSourceBody ? { unmanagedRawSourceBody } : {},
			sourcePath: normalizeOptionalString(parsed.frontmatter.sourcePath),
			bridgeRelativePath: normalizeOptionalString(parsed.frontmatter.bridgeRelativePath),
			bridgeWorkspaceDir: normalizeOptionalString(parsed.frontmatter.bridgeWorkspaceDir),
			bridgeAgentIds: normalizeSingleOrTrimmedStringList(parsed.frontmatter.bridgeAgentIds),
			unsafeLocalConfiguredPath: normalizeOptionalString(parsed.frontmatter.unsafeLocalConfiguredPath),
			unsafeLocalRelativePath: normalizeOptionalString(parsed.frontmatter.unsafeLocalRelativePath),
			lastRefreshedAt: normalizeOptionalString(parsed.frontmatter.lastRefreshedAt),
			updatedAt: normalizeOptionalString(parsed.frontmatter.updatedAt)
		}
	};
}
function toWikiPageSummary(params) {
	const result = scanWikiPageSummary(params);
	return result.status === "valid" ? result.page : null;
}
//#endregion
//#region extensions/memory-wiki/src/bounded-walk.ts
const MEMORY_WIKI_WALK_MAX_DEPTH = 128;
const MEMORY_WIKI_WALK_MAX_ENTRIES = 2e4;
async function walkMemoryWikiDirectory(rootDir, relativePath, limits = {}) {
	const entries = [];
	try {
		for await (const entry of walkRootDirectory(rootDir, relativePath, {
			maxDepth: limits.maxDepth ?? MEMORY_WIKI_WALK_MAX_DEPTH,
			maxEntries: limits.maxEntries ?? MEMORY_WIKI_WALK_MAX_ENTRIES,
			symlinkPolicy: "skip",
			limitBehavior: "throw",
			...limits.entryFilter ? { entryFilter: limits.entryFilter } : {},
			...limits.onDirectoryError ? { onDirectoryError: limits.onDirectoryError } : {}
		})) entries.push(entry);
	} catch (error) {
		const code = error.code;
		if (code === "not-file" || code === "not-found") return [];
		throw error;
	}
	return entries;
}
async function listMemoryWikiPagePaths(rootDir, relativeDir) {
	return (await walkMemoryWikiDirectory(rootDir, relativeDir)).filter((entry) => entry.kind === "file" && entry.relativePath.endsWith(".md") && path.basename(entry.relativePath) !== "index.md").map((entry) => entry.relativePath.split(path.sep).join("/"));
}
//#endregion
//#region extensions/memory-wiki/src/source-sync-state.ts
const MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE = "source-sync";
const MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES = 2e4;
const MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES = 16777216;
const MAX_MEMORY_WIKI_SOURCE_PAGE_HEADER_BYTES = 65536;
const MAX_MEMORY_WIKI_SOURCE_PAGE_SCAN_BYTES = 33554432;
let configuredSourceSyncStore;
const sourceSyncStateChanges = /* @__PURE__ */ new WeakMap();
function normalizeSourceSyncEntry(value) {
	const entry = asNullableRecord(value);
	if (!entry || entry.group !== "bridge" && entry.group !== "unsafe-local" || typeof entry.pagePath !== "string" || typeof entry.sourcePath !== "string" || typeof entry.sourceUpdatedAtMs !== "number" || typeof entry.sourceSize !== "number" || typeof entry.renderFingerprint !== "string") return null;
	return {
		group: entry.group,
		pagePath: entry.pagePath,
		sourcePath: entry.sourcePath,
		sourceUpdatedAtMs: entry.sourceUpdatedAtMs,
		sourceSize: entry.sourceSize,
		renderFingerprint: entry.renderFingerprint
	};
}
function resolveVaultRootKey$1(vaultRoot) {
	return createHash("sha256").update(path.resolve(vaultRoot), "utf8").digest("hex").slice(0, 32);
}
function resolveStateEntryKey$1(vaultRootKey, syncKey) {
	return createHash("sha256").update(`${vaultRootKey}\0${syncKey}`, "utf8").digest("hex");
}
function assertSourceSyncStateWithinLimit(count) {
	if (count > MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES) throw new Error(`Memory Wiki source sync state exceeds SQLite entry limit (${count}/${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES})`);
}
function assertMemoryWikiSourceSyncStateCapacity(params) {
	const retainedOtherGroupCount = Object.values(params.state.entries).filter((entry) => entry.group !== params.group).length;
	assertSourceSyncStateWithinLimit(retainedOtherGroupCount + params.incomingCount);
}
function createMemoryWikiSourceSyncStateStore(openKeyedStore) {
	const openStore = () => openKeyedStore({
		namespace: MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE,
		maxEntries: MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	});
	return {
		async read(vaultRoot) {
			const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
			const entries = {};
			for (const row of await openStore().entries()) {
				const value = row.value;
				if (value.vaultRootKey !== vaultRootKey || typeof value.syncKey !== "string") continue;
				const entry = normalizeSourceSyncEntry(value);
				if (entry) entries[value.syncKey] = entry;
			}
			return {
				version: 1,
				entries
			};
		},
		async write(vaultRoot, state, plan) {
			assertSourceSyncStateWithinLimit(Object.keys(state.entries).length);
			const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
			const store = openStore();
			if (plan) for (const syncKey of plan.deleteKeys) await store.delete(resolveStateEntryKey$1(vaultRootKey, syncKey));
			else {
				const nextKeys = new Set(Object.keys(state.entries).map((syncKey) => resolveStateEntryKey$1(vaultRootKey, syncKey)));
				for (const row of await store.entries()) if (row.value.vaultRootKey === vaultRootKey && !nextKeys.has(row.key)) await store.delete(row.key);
			}
			for (const syncKey of plan?.upsertKeys ?? Object.keys(state.entries)) {
				const entry = state.entries[syncKey];
				if (!entry) throw new Error(`Missing tracked Memory Wiki source sync entry: ${syncKey}`);
				await store.register(resolveStateEntryKey$1(vaultRootKey, syncKey), {
					...entry,
					vaultRootKey,
					syncKey
				});
			}
		}
	};
}
function configureMemoryWikiSourceSyncStateStore(store) {
	configuredSourceSyncStore = store;
}
function resolveSourceSyncStore(store = configuredSourceSyncStore) {
	if (!store) throw new Error("Memory Wiki source sync state store is not configured.");
	return store;
}
async function readMemoryWikiSourceSyncState(vaultRoot, store) {
	const state = await resolveSourceSyncStore(store).read(vaultRoot);
	sourceSyncStateChanges.set(state, {
		upsertKeys: /* @__PURE__ */ new Set(),
		deleteKeys: /* @__PURE__ */ new Set()
	});
	return state;
}
async function writeMemoryWikiSourceSyncState(vaultRoot, state, store) {
	const changes = sourceSyncStateChanges.get(state);
	if (changes && changes.upsertKeys.size === 0 && changes.deleteKeys.size === 0) return;
	const plan = changes ? {
		upsertKeys: [...changes.upsertKeys],
		deleteKeys: [...changes.deleteKeys]
	} : void 0;
	await resolveSourceSyncStore(store).write(vaultRoot, state, plan);
	changes?.upsertKeys.clear();
	changes?.deleteKeys.clear();
}
function removeImportedSourceStateEntry(state, syncKey) {
	delete state.entries[syncKey];
	const changes = sourceSyncStateChanges.get(state);
	changes?.upsertKeys.delete(syncKey);
	changes?.deleteKeys.add(syncKey);
}
async function readImportedSourcePageForNotes(vault, pagePath) {
	try {
		return decodeWikiPageUtf8(await vault.readBytes(pagePath, { maxBytes: MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES }), pagePath);
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "too-large")) throw error;
	}
	const opened = await vault.open(pagePath);
	try {
		const headerBytes = Math.min(MAX_MEMORY_WIKI_SOURCE_PAGE_HEADER_BYTES, opened.stat.size);
		const headerBuffer = Buffer.alloc(headerBytes);
		if (await readFileWindowFully(opened.handle, headerBuffer, 0) !== headerBytes) throw new Error("Memory Wiki source page changed during bounded Notes recovery");
		const decoder = new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		});
		const header = decoder.decode(headerBuffer, { stream: true });
		const contentFence = /(?:^|\r?\n)## Content\r?\n(`+)[^\r\n]*(?=\r?\n|$)/u.exec(header);
		if (!contentFence) throw new Error("Memory Wiki source content fence is missing from the recovery header");
		const fence = contentFence[1];
		const notesBoundary = new RegExp(`\\r?\\n${fence}\\r?\\n(?:[\\t ]*\\r?\\n)*## Notes\\r?\\n<!-- openclaw:human:start -->(?=\\r?\\n|$)`, "u");
		let pending = "";
		let notes = "";
		let notesBytes = 0;
		let scannedBytes = headerBytes;
		let foundNotesBoundary = false;
		const consume = (text) => {
			if (!text) return;
			let notesText = text;
			if (!foundNotesBoundary) {
				pending += text;
				const boundary = notesBoundary.exec(pending);
				if (!boundary) {
					pending = pending.slice(-65536);
					return;
				}
				foundNotesBoundary = true;
				notesText = pending.slice(boundary.index);
				pending = "";
			}
			notesBytes += Buffer.byteLength(notesText, "utf8");
			if (headerBytes + notesBytes > MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES) throw new Error("Memory Wiki human Notes exceed the bounded recovery limit");
			notes += notesText;
		};
		consume(header);
		const stream = opened.handle.createReadStream({
			autoClose: false,
			highWaterMark: MAX_MEMORY_WIKI_SOURCE_PAGE_HEADER_BYTES,
			start: headerBytes
		});
		for await (const chunk of stream) {
			scannedBytes += chunk.byteLength;
			if (scannedBytes > MAX_MEMORY_WIKI_SOURCE_PAGE_SCAN_BYTES) throw new Error("Memory Wiki source page exceeds the bounded recovery scan limit");
			consume(decoder.decode(chunk, { stream: true }));
		}
		consume(decoder.decode());
		if (!foundNotesBoundary) throw new Error("Memory Wiki source Notes boundary exceeds the bounded recovery limit");
		return `${header}\n${notes}`;
	} finally {
		await opened.handle.close();
	}
}
async function pruneImportedSourceEntries(params) {
	let removedCount = 0;
	let vault;
	for (const [syncKey, entry] of Object.entries(params.state.entries)) {
		if (entry.group !== params.group || params.activeKeys.has(syncKey)) continue;
		await params.prepareWrite?.();
		try {
			vault ??= await root(params.vaultRoot);
		} catch (error) {
			if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
			removeImportedSourceStateEntry(params.state, syncKey);
			removedCount += 1;
			continue;
		}
		let pageContent;
		try {
			pageContent = await readImportedSourcePageForNotes(vault, entry.pagePath);
		} catch (error) {
			if (!(error instanceof FsSafeError && error.code === "not-found")) continue;
		}
		const notesBlock = pageContent === void 0 ? null : extractHumanNotesBlock(pageContent);
		if (notesBlock) {
			const salvageStem = entry.pagePath.replace(/\//g, "_");
			const contentHash = createHash("sha256").update(notesBlock).digest("hex").slice(0, 16);
			const salvagePaths = [path.join(".salvage", createWikiPageFilename(salvageStem, ".notes.md")), path.join(".salvage", createWikiPageFilename(`${salvageStem}.${contentHash}`, ".notes.md"))];
			let notesSalvaged = false;
			for (const salvagePath of salvagePaths) try {
				await vault.create(salvagePath, notesBlock, { mkdir: true });
				notesSalvaged = true;
				break;
			} catch (error) {
				if (!(error instanceof FsSafeError && error.code === "already-exists")) break;
				try {
					if (await vault.readText(salvagePath, { maxBytes: MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES }) === notesBlock) {
						notesSalvaged = true;
						break;
					}
				} catch {
					break;
				}
			}
			if (!notesSalvaged) continue;
		}
		if (pageContent !== void 0) try {
			await vault.remove(entry.pagePath);
		} catch (error) {
			if (!(error instanceof FsSafeError && error.code === "not-found")) continue;
		}
		removeImportedSourceStateEntry(params.state, syncKey);
		removedCount += 1;
	}
	return removedCount;
}
function setImportedSourceEntry(params) {
	const current = params.state.entries[params.syncKey];
	if (current?.group === params.entry.group && current.pagePath === params.entry.pagePath && current.sourcePath === params.entry.sourcePath && current.sourceUpdatedAtMs === params.entry.sourceUpdatedAtMs && current.sourceSize === params.entry.sourceSize && current.renderFingerprint === params.entry.renderFingerprint) return;
	params.state.entries[params.syncKey] = params.entry;
	const changes = sourceSyncStateChanges.get(params.state);
	changes?.deleteKeys.delete(params.syncKey);
	changes?.upsertKeys.add(params.syncKey);
}
//#endregion
//#region extensions/memory-wiki/src/import-runs-state.ts
const MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE = "import-runs";
const MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES = 2e4;
let configuredImportRunStore;
function resolveMemoryWikiImportRunsDir(vaultRoot) {
	return path.join(vaultRoot, ".openclaw-wiki", "import-runs");
}
function resolveVaultRootKey(vaultRoot) {
	return createHash("sha256").update(path.resolve(vaultRoot), "utf8").digest("hex").slice(0, 32);
}
function resolveStateEntryKey(vaultRootKey, runId) {
	return createHash("sha256").update(`${vaultRootKey}\0meta\0${runId}`, "utf8").digest("hex");
}
function resolvePathStateEntryKey(params) {
	return createHash("sha256").update(`${params.vaultRootKey}\0${params.runId}\0${params.kind}\0${params.index}\0${params.path}`, "utf8").digest("hex");
}
function normalizeMetaRecord(raw) {
	const record = asNullableRecord(raw);
	if (!record || record.kind !== "meta") return null;
	const vaultRootKey = typeof record.vaultRootKey === "string" ? record.vaultRootKey : "";
	const runId = normalizeOptionalString(record.runId) ?? "";
	const exportPath = normalizeOptionalString(record.exportPath) ?? "";
	const sourcePath = normalizeOptionalString(record.sourcePath) ?? "";
	const appliedAt = normalizeOptionalString(record.appliedAt) ?? "";
	if (record.version !== 1 || record.importType !== "chatgpt" || !vaultRootKey || !runId || !exportPath || !sourcePath || !appliedAt) return null;
	const rolledBackAt = normalizeOptionalString(record.rolledBackAt);
	const rollbackStartedAt = normalizeOptionalString(record.rollbackStartedAt);
	const rollbackTargetsFinalizedAt = normalizeOptionalString(record.rollbackTargetsFinalizedAt);
	return {
		version: 1,
		kind: "meta",
		vaultRootKey,
		runId,
		importType: "chatgpt",
		exportPath,
		sourcePath,
		appliedAt,
		conversationCount: resolveNonNegativeIntegerOption(record.conversationCount, 0),
		createdCount: resolveNonNegativeIntegerOption(record.createdCount, 0),
		updatedCount: resolveNonNegativeIntegerOption(record.updatedCount, 0),
		skippedCount: resolveNonNegativeIntegerOption(record.skippedCount, 0),
		...rollbackStartedAt ? { rollbackStartedAt } : {},
		...rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt } : {},
		...rolledBackAt ? { rolledBackAt } : {}
	};
}
function normalizePathRecord(raw) {
	const record = asNullableRecord(raw);
	if (!record || record.kind !== "created-path" && record.kind !== "updated-path" || typeof record.vaultRootKey !== "string" || typeof record.runId !== "string" || typeof record.path !== "string" || typeof record.index !== "number" || !Number.isFinite(record.index)) return null;
	const snapshotPath = normalizeOptionalString(record.snapshotPath);
	const contentHash = normalizeOptionalString(record.contentHash);
	const recoveryPaths = normalizeUniqueTrimmedStringList(record.recoveryPaths);
	return {
		kind: record.kind,
		vaultRootKey: record.vaultRootKey,
		runId: record.runId,
		index: Math.max(0, Math.floor(record.index)),
		path: record.path,
		...snapshotPath ? { snapshotPath } : {},
		...contentHash ? { contentHash } : {},
		...recoveryPaths.length > 0 ? { recoveryPaths } : {}
	};
}
function composeImportRunRecord(meta, pathRows) {
	const toEntry = (row) => ({
		path: row.path,
		...row.snapshotPath ? { snapshotPath: row.snapshotPath } : {},
		...row.contentHash ? { contentHash: row.contentHash } : {},
		...row.recoveryPaths ? { recoveryPaths: [...row.recoveryPaths] } : {}
	});
	const { kind: _kind, vaultRootKey: _vaultRootKey, ...metadata } = meta;
	const entries = (kind) => pathRows.filter((row) => row.kind === kind).toSorted((left, right) => left.index - right.index).map(toEntry);
	return {
		...metadata,
		createdPaths: entries("created-path"),
		updatedPaths: entries("updated-path")
	};
}
function toPathRecords(vaultRootKey, record) {
	const toPathRecord = (entry, index, kind) => ({
		kind,
		vaultRootKey,
		runId: record.runId,
		index,
		path: entry.path,
		...kind === "updated-path" && entry.snapshotPath ? { snapshotPath: entry.snapshotPath } : {},
		...entry.contentHash ? { contentHash: entry.contentHash } : {},
		...entry.recoveryPaths ? { recoveryPaths: [...entry.recoveryPaths] } : {}
	});
	return [...record.createdPaths.map((entry, index) => toPathRecord(entry, index, "created-path")), ...record.updatedPaths.map((entry, index) => toPathRecord(entry, index, "updated-path"))];
}
function createMemoryWikiImportRunStateStore(openKeyedStore) {
	const openStore = () => openKeyedStore({
		namespace: MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE,
		maxEntries: MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES
	});
	return {
		async read(vaultRoot, runId) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			const meta = normalizeMetaRecord(await openStore().lookup(resolveStateEntryKey(vaultRootKey, runId)));
			if (!meta || meta.vaultRootKey !== vaultRootKey) return null;
			return composeImportRunRecord(meta, (await openStore().entries()).map((entry) => normalizePathRecord(entry.value)).filter((entry) => entry !== null && entry.vaultRootKey === vaultRootKey && entry.runId === runId));
		},
		async write(vaultRoot, record) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			const store = openStore();
			const nextPathKeys = /* @__PURE__ */ new Set();
			for (const pathRecord of toPathRecords(vaultRootKey, record)) {
				const key = resolvePathStateEntryKey(pathRecord);
				nextPathKeys.add(key);
				await store.register(key, pathRecord);
			}
			const { createdPaths: _createdPaths, updatedPaths: _updatedPaths, rollbackStartedAt, rollbackTargetsFinalizedAt, rolledBackAt, ...metadata } = record;
			await store.register(resolveStateEntryKey(vaultRootKey, record.runId), {
				...metadata,
				kind: "meta",
				vaultRootKey,
				...rollbackStartedAt ? { rollbackStartedAt } : {},
				...rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt } : {},
				...rolledBackAt ? { rolledBackAt } : {}
			});
			for (const row of await store.entries()) {
				const pathRecord = normalizePathRecord(row.value);
				if (pathRecord?.vaultRootKey === vaultRootKey && pathRecord.runId === record.runId && !nextPathKeys.has(row.key)) await store.delete(row.key);
			}
		},
		async list(vaultRoot) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			const metaRows = /* @__PURE__ */ new Map();
			const pathRows = [];
			for (const row of await openStore().entries()) {
				const meta = normalizeMetaRecord(row.value);
				if (meta?.vaultRootKey === vaultRootKey) {
					metaRows.set(meta.runId, meta);
					continue;
				}
				const pathRecord = normalizePathRecord(row.value);
				if (pathRecord?.vaultRootKey === vaultRootKey) pathRows.push(pathRecord);
			}
			return [...metaRows.values()].map((meta) => composeImportRunRecord(meta, pathRows.filter((row) => row.runId === meta.runId)));
		},
		async rowCount() {
			const store = openStore();
			return await store.count?.() ?? (await store.entries()).length;
		}
	};
}
function configureMemoryWikiImportRunStateStore(store) {
	configuredImportRunStore = store;
}
function getMemoryWikiImportRunStateStore() {
	if (!configuredImportRunStore) throw new Error("Memory Wiki import run state store is not configured.");
	return configuredImportRunStore;
}
//#endregion
export { slugifyWikiPageStem as A, isUnmanagedRawSourceSummary as C, renderMarkdownFence as D, preserveHumanNotesBlock as E, forEachMarkdownCodeRange as F, toWikiPageSummary as M, WIKI_RELATED_END_MARKER as N, renderWikiMarkdown as O, WIKI_RELATED_START_MARKER as P, formatWikiLink as S, parseWikiMarkdown as T, WIKI_PAGE_GROUPS as _, resolveMemoryWikiImportRunsDir as a, decodeWikiPageUtf8 as b, createMemoryWikiSourceSyncStateStore as c, setImportedSourceEntry as d, writeMemoryWikiSourceSyncState as f, HUMAN_START_MARKER as g, HUMAN_END_MARKER as h, getMemoryWikiImportRunStateStore as i, slugifyWikiSegment as j, scanWikiPageSummary as k, pruneImportedSourceEntries as l, walkMemoryWikiDirectory as m, configureMemoryWikiImportRunStateStore as n, assertMemoryWikiSourceSyncStateCapacity as o, listMemoryWikiPagePaths as p, createMemoryWikiImportRunStateStore as r, configureMemoryWikiSourceSyncStateStore as s, MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES as t, readMemoryWikiSourceSyncState as u, WIKI_RAW_SOURCE_MARKER as v, normalizeWikiClaims as w, extractHumanNotesBlock as x, createWikiPageFilename as y };
