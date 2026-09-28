import { M as resolveNonNegativeIntegerOption, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { _ as normalizeUniqueTrimmedStringList, c as normalizeSingleOrTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as fromMarkdown } from "./lib-WLZTziNZ.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./number-runtime-CGwowceO.mjs";
import { t as walkRootDirectory } from "./root-walk-D9kXBQ1D.mjs";
import "./root-walk-BLmMt2X4.mjs";
import "./concurrency-runtime-BevFACIQ.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as readJsonFileWithFallback } from "./json-store-EnZiK23B.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import YAML from "yaml";
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
//#endregion
//#region extensions/memory-wiki/src/markdown-links.ts
const WIKI_RELATED_START_MARKER = "<!-- openclaw:wiki:related:start -->";
const WIKI_RELATED_END_MARKER = "<!-- openclaw:wiki:related:end -->";
const OBSIDIAN_LINK_PATTERN = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\(([^)]+)\)/g;
const RELATED_BLOCK_PATTERN = new RegExp(`${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}`, "g");
function normalizeMarkdownLinkTarget(sourceRelativePath, target) {
	return path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelativePath), target));
}
function maskMarkdownCode(markdown) {
	const masked = markdown.split("");
	const visit = (node) => {
		if (node.type === "code" || node.type === "inlineCode") {
			const start = node.position?.start?.offset;
			const end = node.position?.end?.offset;
			if (start !== void 0 && end !== void 0) {
				for (let index = start; index < end; index++) if (masked[index] !== "\n" && masked[index] !== "\r") masked[index] = " ";
			}
			return;
		}
		for (const child of node.children ?? []) visit(child);
	};
	visit(fromMarkdown(markdown));
	return masked.join("");
}
function extractWikiLinks(markdown, sourceRelativePath) {
	if (!markdown.includes("[")) return [];
	const searchable = maskMarkdownCode(markdown.replace(RELATED_BLOCK_PATTERN, ""));
	const links = [];
	for (const match of searchable.matchAll(OBSIDIAN_LINK_PATTERN)) {
		const target = match[1]?.trim();
		if (target) links.push(target);
	}
	for (const match of searchable.matchAll(MARKDOWN_LINK_PATTERN)) {
		const rawTarget = match[1]?.trim();
		if (!rawTarget || rawTarget.startsWith("#") || /^[a-z]+:/i.test(rawTarget)) continue;
		const target = rawTarget.split("#")[0]?.split("?")[0]?.replace(/\\/g, "/").trim();
		if (target) links.push(normalizeMarkdownLinkTarget(sourceRelativePath, target));
	}
	return links;
}
//#endregion
//#region extensions/memory-wiki/src/markdown.ts
const WIKI_RAW_SOURCE_MARKER = "<!-- openclaw:wiki:raw-source -->";
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
	if (frontmatter === void 0) return {
		hasFrontmatter: false,
		frontmatter: {},
		body: content
	};
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
function normalizeSourceIds(value) {
	return normalizeSingleOrTrimmedStringList(value);
}
function normalizeWikiClaimEvidence(value) {
	const record = asNullableRecord(value);
	if (!record) return null;
	const kind = normalizeOptionalString(record.kind);
	const sourceId = normalizeOptionalString(record.sourceId);
	const evidencePath = normalizeOptionalString(record.path);
	const lines = normalizeOptionalString(record.lines);
	const note = normalizeOptionalString(record.note);
	const updatedAt = normalizeOptionalString(record.updatedAt);
	const privacyTier = normalizeOptionalString(record.privacyTier);
	const weight = asFiniteNumber(record.weight);
	const confidence = asFiniteNumber(record.confidence);
	if (!kind && !sourceId && !evidencePath && !lines && !note && weight === void 0 && confidence === void 0 && !privacyTier && !updatedAt) return null;
	return {
		...kind ? { kind } : {},
		...sourceId ? { sourceId } : {},
		...evidencePath ? { path: evidencePath } : {},
		...lines ? { lines } : {},
		...weight !== void 0 ? { weight } : {},
		...confidence !== void 0 ? { confidence } : {},
		...privacyTier ? { privacyTier } : {},
		...note ? { note } : {},
		...updatedAt ? { updatedAt } : {}
	};
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
		const status = normalizeOptionalString(record.status);
		const updatedAt = normalizeOptionalString(record.updatedAt);
		return [{
			...normalizeOptionalString(record.id) ? { id: normalizeOptionalString(record.id) } : {},
			text,
			...status ? { status } : {},
			...confidence !== void 0 ? { confidence } : {},
			evidence,
			...updatedAt ? { updatedAt } : {}
		}];
	});
}
function normalizeWikiPersonCard(value) {
	const record = asNullableRecord(value);
	if (!record) return;
	const canonicalId = normalizeOptionalString(record.canonicalId);
	const timezone = normalizeOptionalString(record.timezone);
	const confidence = asFiniteNumber(record.confidence);
	const privacyTier = normalizeOptionalString(record.privacyTier);
	const lastRefreshedAt = normalizeOptionalString(record.lastRefreshedAt);
	const card = {
		...canonicalId ? { canonicalId } : {},
		handles: normalizeSingleOrTrimmedStringList(record.handles),
		socials: normalizeSingleOrTrimmedStringList(record.socials),
		emails: normalizeSingleOrTrimmedStringList(record.emails ?? record.email),
		...timezone ? { timezone } : {},
		...normalizeOptionalString(record.lane) ? { lane: normalizeOptionalString(record.lane) } : {},
		askFor: normalizeSingleOrTrimmedStringList(record.askFor),
		avoidAskingFor: normalizeSingleOrTrimmedStringList(record.avoidAskingFor),
		bestUsedFor: normalizeSingleOrTrimmedStringList(record.bestUsedFor),
		notEnoughFor: normalizeSingleOrTrimmedStringList(record.notEnoughFor),
		...confidence !== void 0 ? { confidence } : {},
		...privacyTier ? { privacyTier } : {},
		...lastRefreshedAt ? { lastRefreshedAt } : {}
	};
	return Boolean(card.canonicalId || card.timezone || card.lane || card.privacyTier || card.lastRefreshedAt) || typeof card.confidence === "number" || card.handles.length > 0 || card.socials.length > 0 || card.emails.length > 0 || card.askFor.length > 0 || card.avoidAskingFor.length > 0 || card.bestUsedFor.length > 0 || card.notEnoughFor.length > 0 ? card : void 0;
}
function normalizeWikiRelationships(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const record = asNullableRecord(entry);
		if (!record) return [];
		const weight = asFiniteNumber(record.weight);
		const confidence = asFiniteNumber(record.confidence);
		const relationship = {
			...normalizeOptionalString(record.targetId) ? { targetId: normalizeOptionalString(record.targetId) } : {},
			...normalizeOptionalString(record.targetPath) ? { targetPath: normalizeOptionalString(record.targetPath) } : {},
			...normalizeOptionalString(record.targetTitle) ? { targetTitle: normalizeOptionalString(record.targetTitle) } : {},
			...normalizeOptionalString(record.kind) ? { kind: normalizeOptionalString(record.kind) } : {},
			...weight !== void 0 ? { weight } : {},
			...confidence !== void 0 ? { confidence } : {},
			...normalizeOptionalString(record.evidenceKind) ? { evidenceKind: normalizeOptionalString(record.evidenceKind) } : {},
			...normalizeOptionalString(record.privacyTier) ? { privacyTier: normalizeOptionalString(record.privacyTier) } : {},
			...normalizeOptionalString(record.note) ? { note: normalizeOptionalString(record.note) } : {},
			...normalizeOptionalString(record.updatedAt) ? { updatedAt: normalizeOptionalString(record.updatedAt) } : {}
		};
		return Object.keys(relationship).length > 0 ? [relationship] : [];
	});
}
function normalizeMarkdownLines(markdown) {
	return markdown.replace(/\r\n?/g, "\n").trimStart().split("\n").map((line) => line.trimEnd());
}
function hasGeneratedWrapperLines(lines, patterns) {
	const firstWrapperLineIndex = lines.findIndex((line) => line.trim().length > 0 && line.trim() !== "<!-- openclaw:wiki:raw-source -->");
	if (firstWrapperLineIndex === -1 || !patterns[0]?.test(lines[firstWrapperLineIndex] ?? "")) return false;
	const remainingLines = lines.slice(firstWrapperLineIndex + 1).filter((line) => line.trim().length > 0 && line.trim() !== "<!-- openclaw:wiki:raw-source -->");
	if (patterns[1] && !patterns[1].test(remainingLines[0] ?? "")) return false;
	let patternIndex = 2;
	for (const line of remainingLines.slice(1)) {
		const pattern = patterns[patternIndex];
		if (!pattern) return true;
		if (pattern.test(line)) patternIndex += 1;
	}
	return patternIndex === patterns.length;
}
function hasHumanNotesBlock(markdown) {
	return markdown.includes(HUMAN_START_MARKER) && markdown.includes(HUMAN_END_MARKER);
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
function findNotesHumanBlock(page) {
	const searchFrom = afterSourceContentFence(page);
	const start = page.indexOf(HUMAN_START_MARKER, searchFrom);
	const endMarker = page.lastIndexOf(HUMAN_END_MARKER);
	if (start === -1 && endMarker < searchFrom) {
		if (!/(?:^|\r?\n)## Notes[\t ]*(?:\r?\n|$)([\s\S]*)/u.exec(page.slice(searchFrom))?.[1]?.trim()) return null;
	}
	if (start === -1 || endMarker < start) throw new Error(`Memory Wiki human Notes are missing ${start === -1 ? HUMAN_START_MARKER : HUMAN_END_MARKER}; restore the missing marker before updating or removing this page`);
	return {
		start,
		end: endMarker + 27
	};
}
function extractHumanNotesBlock(page) {
	const block = findNotesHumanBlock(page);
	if (!block) return null;
	return page.slice(block.start + 29, block.end - 27).trim() ? page.slice(block.start, block.end) : null;
}
function preserveHumanNotesBlock(rendered, existing) {
	const existingBlock = findNotesHumanBlock(existing);
	const renderedBlock = findNotesHumanBlock(rendered);
	if (!existingBlock || !renderedBlock) return rendered;
	return rendered.slice(0, renderedBlock.start) + existing.slice(existingBlock.start, existingBlock.end) + rendered.slice(renderedBlock.end);
}
function detectGeneratedSourceBody(markdown) {
	const lines = normalizeMarkdownLines(markdown);
	const normalized = lines.join("\n");
	if (hasGeneratedWrapperLines(lines, [
		/^# Memory Bridge(?:\s*\(|:)/u,
		/^## Bridge Source\s*$/u,
		/^## Content\s*$/u
	]) && hasHumanNotesBlock(normalized)) return "bridge";
	if (hasGeneratedWrapperLines(lines, [
		/^# Unsafe Local Import:/u,
		/^## Unsafe Local Source\s*$/u,
		/^## Content\s*$/u
	]) && hasHumanNotesBlock(normalized)) return "unsafe-local";
	if (hasGeneratedWrapperLines(lines, [
		/^#\s+\S/u,
		/^## Source\s*$/u,
		/^- Type: `local-file`\s*$/u,
		/^## Content\s*$/u
	]) && hasHumanNotesBlock(normalized)) return "local-file";
	if (hasGeneratedWrapperLines(lines, [
		/^# ChatGPT Export:/u,
		/^## Source\s*$/u,
		/^- Conversation id: `[^`]+`\s*$/u,
		/^## Active Branch Transcript\s*$/u
	]) && hasHumanNotesBlock(normalized)) return "chatgpt-export";
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
	const fenceSize = Math.max(3, ...Array.from(content.matchAll(/`+/g), (match) => match[0].length + 1));
	const fence = "`".repeat(fenceSize);
	return `${fence}${infoString}\n${content}\n${fence}`;
}
function inferWikiPageKind(relativePath) {
	const normalized = relativePath.split(path.sep).join("/");
	if (normalized.startsWith("entities/")) return "entity";
	if (normalized.startsWith("concepts/")) return "concept";
	if (normalized.startsWith("sources/")) return "source";
	if (normalized.startsWith("syntheses/")) return "synthesis";
	if (normalized.startsWith("reports/")) return "report";
	return null;
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
			sourceIds: normalizeSourceIds(parsed.frontmatter.sourceIds),
			linkTargets: extractWikiLinks(params.raw, params.relativePath.split(path.sep).join("/")),
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
//#region extensions/memory-wiki/src/source-sync-state.ts
const MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE = "source-sync";
const MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES = 2e4;
const MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES = 16777216;
const MAX_MEMORY_WIKI_SOURCE_PAGE_HEADER_BYTES = 65536;
const MAX_MEMORY_WIKI_SOURCE_PAGE_SCAN_BYTES = 33554432;
const EMPTY_STATE = {
	version: 1,
	entries: {}
};
let configuredSourceSyncStore;
const memorySourceSyncStateByVault = /* @__PURE__ */ new Map();
const sourceSyncStateChanges = /* @__PURE__ */ new WeakMap();
function resolveMemoryWikiSourceSyncStatePath(vaultRoot) {
	return path.join(vaultRoot, ".openclaw-wiki", "source-sync.json");
}
function cloneSourceSyncState(state) {
	return {
		version: 1,
		entries: Object.fromEntries(Object.entries(state.entries).map(([key, value]) => [key, { ...value }]))
	};
}
function normalizeSourceSyncState(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_STATE;
	const parsed = value;
	if (parsed.version !== 1 || !parsed.entries || typeof parsed.entries !== "object") return EMPTY_STATE;
	const entries = {};
	for (const [syncKey, entry] of Object.entries(parsed.entries)) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry) || entry.group !== "bridge" && entry.group !== "unsafe-local" || typeof entry.pagePath !== "string" || typeof entry.sourcePath !== "string" || typeof entry.sourceUpdatedAtMs !== "number" || typeof entry.sourceSize !== "number" || typeof entry.renderFingerprint !== "string") continue;
		entries[syncKey] = {
			group: entry.group,
			pagePath: entry.pagePath,
			sourcePath: entry.sourcePath,
			sourceUpdatedAtMs: entry.sourceUpdatedAtMs,
			sourceSize: entry.sourceSize,
			renderFingerprint: entry.renderFingerprint
		};
	}
	return {
		version: 1,
		entries
	};
}
function resolveVaultRootKey$1(vaultRoot) {
	return createHash("sha256").update(path.resolve(vaultRoot), "utf8").digest("hex").slice(0, 32);
}
function resolveStateEntryKey$1(vaultRootKey, syncKey) {
	return createHash("sha256").update(`${vaultRootKey}\0${syncKey}`, "utf8").digest("hex");
}
function createMemoryFallbackStateStore() {
	return {
		async read(vaultRoot) {
			const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
			return cloneSourceSyncState(memorySourceSyncStateByVault.get(vaultRootKey) ?? EMPTY_STATE);
		},
		async write(vaultRoot, state) {
			assertSourceSyncStateWithinLimit(state);
			const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
			memorySourceSyncStateByVault.set(vaultRootKey, cloneSourceSyncState(state));
		}
	};
}
function assertSourceSyncStateWithinLimit(state) {
	const count = Object.keys(state.entries).length;
	if (count > 2e4) throw new Error(`Memory Wiki source sync state exceeds SQLite entry limit (${count}/${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES})`);
}
function assertMemoryWikiSourceSyncStateCapacity(params) {
	const projectedCount = Object.values(params.state.entries).filter((entry) => entry.group !== params.group).length + params.incomingCount;
	if (projectedCount > 2e4) throw new Error(`Memory Wiki source sync state exceeds SQLite entry limit (${projectedCount}/${MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES})`);
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
				const entry = normalizeSourceSyncState({
					version: 1,
					entries: { [value.syncKey]: value }
				}).entries[value.syncKey];
				if (entry) entries[value.syncKey] = entry;
			}
			return {
				version: 1,
				entries
			};
		},
		async write(vaultRoot, state, plan) {
			assertSourceSyncStateWithinLimit(state);
			const vaultRootKey = resolveVaultRootKey$1(vaultRoot);
			const store = openStore();
			if (plan) {
				for (const syncKey of plan.deleteKeys) await store.delete(resolveStateEntryKey$1(vaultRootKey, syncKey));
				for (const syncKey of plan.upsertKeys) {
					const entry = state.entries[syncKey];
					if (!entry) throw new Error(`Missing tracked Memory Wiki source sync entry: ${syncKey}`);
					await store.register(resolveStateEntryKey$1(vaultRootKey, syncKey), {
						...entry,
						vaultRootKey,
						syncKey
					});
				}
				return;
			}
			const normalized = normalizeSourceSyncState(state);
			const nextKeys = new Set(Object.keys(normalized.entries).map((syncKey) => resolveStateEntryKey$1(vaultRootKey, syncKey)));
			for (const row of await store.entries()) if (row.value.vaultRootKey === vaultRootKey && !nextKeys.has(row.key)) await store.delete(row.key);
			for (const [syncKey, entry] of Object.entries(normalized.entries)) await store.register(resolveStateEntryKey$1(vaultRootKey, syncKey), {
				...entry,
				vaultRootKey,
				syncKey
			});
		}
	};
}
function configureMemoryWikiSourceSyncStateStore(store) {
	configuredSourceSyncStore = store;
}
function resolveSourceSyncStore(store) {
	return store ?? configuredSourceSyncStore ?? createMemoryFallbackStateStore();
}
async function readMemoryWikiSourceSyncState(vaultRoot, store) {
	const state = await resolveSourceSyncStore(store).read(vaultRoot);
	sourceSyncStateChanges.set(state, {
		upsertKeys: /* @__PURE__ */ new Set(),
		deleteKeys: /* @__PURE__ */ new Set()
	});
	return state;
}
async function readLegacyMemoryWikiSourceSyncState(vaultRoot) {
	const statePath = resolveMemoryWikiSourceSyncStatePath(vaultRoot);
	const { value: parsed } = await readJsonFileWithFallback(statePath, EMPTY_STATE);
	return normalizeSourceSyncState(parsed);
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
async function shouldSkipImportedSourceWrite(params) {
	const entry = params.state.entries[params.syncKey];
	if (!entry) return false;
	if (entry.pagePath !== params.expectedPagePath || entry.sourcePath !== params.expectedSourcePath || entry.sourceUpdatedAtMs !== params.sourceUpdatedAtMs || entry.sourceSize !== params.sourceSize || entry.renderFingerprint !== params.renderFingerprint) return false;
	const pagePath = path.join(params.vaultRoot, params.expectedPagePath);
	return await fs.access(pagePath).then(() => true).catch(() => false);
}
function removeImportedSourceStateEntry(state, syncKey) {
	delete state.entries[syncKey];
	const changes = sourceSyncStateChanges.get(state);
	changes?.upsertKeys.delete(syncKey);
	changes?.deleteKeys.add(syncKey);
}
async function readImportedSourcePageForNotes(vault, pagePath) {
	try {
		return await vault.readText(pagePath, { maxBytes: MAX_MEMORY_WIKI_NOTES_RECOVERY_BYTES });
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "too-large")) throw error;
	}
	const opened = await vault.open(pagePath);
	try {
		const headerBytes = Math.min(MAX_MEMORY_WIKI_SOURCE_PAGE_HEADER_BYTES, opened.stat.size);
		const headerBuffer = Buffer.alloc(headerBytes);
		if (await readFileWindowFully(opened.handle, headerBuffer, 0) !== headerBytes) throw new Error("Memory Wiki source page changed during bounded Notes recovery");
		const header = headerBuffer.toString("utf8");
		const contentFence = /(?:^|\r?\n)## Content\r?\n(`+)[^\r\n]*(?=\r?\n|$)/u.exec(header);
		if (!contentFence) throw new Error("Memory Wiki source content fence is missing from the recovery header");
		const fence = contentFence[1];
		const notesBoundary = new RegExp(`\\r?\\n${fence}\\r?\\n(?:[\\t ]*\\r?\\n)*## Notes\\r?\\n<!-- openclaw:human:start -->(?=\\r?\\n|$)`, "u");
		const decoder = new TextDecoder();
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
const LEGACY_IMPORT_RUN_READ_CONCURRENCY = 16;
const MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE = "import-runs";
const MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES = 2e4;
let configuredImportRunStore;
const memoryImportRunsByVault = /* @__PURE__ */ new Map();
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
function cloneImportRunRecord(record) {
	return {
		...record,
		createdPaths: record.createdPaths.map((entry) => ({
			...entry,
			...entry.recoveryPaths ? { recoveryPaths: [...entry.recoveryPaths] } : {}
		})),
		updatedPaths: record.updatedPaths.map((entry) => ({
			...entry,
			...entry.recoveryPaths ? { recoveryPaths: [...entry.recoveryPaths] } : {}
		}))
	};
}
function normalizeImportRunEntries(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((raw) => {
		if (typeof raw === "string") {
			const entryPath = raw.trim();
			return entryPath ? [{ path: entryPath }] : [];
		}
		const entry = asNullableRecord(raw);
		if (!entry) return [];
		const entryPath = typeof entry.path === "string" ? entry.path.trim() : "";
		if (!entryPath) return [];
		const snapshotPath = normalizeOptionalString(entry.snapshotPath);
		const contentHash = normalizeOptionalString(entry.contentHash);
		const recoveryPaths = normalizeUniqueTrimmedStringList(entry.recoveryPaths);
		return [{
			path: entryPath,
			...snapshotPath ? { snapshotPath } : {},
			...contentHash ? { contentHash } : {},
			...recoveryPaths.length > 0 ? { recoveryPaths } : {}
		}];
	});
}
function normalizeMemoryWikiImportRunRecord(raw) {
	const record = asNullableRecord(raw);
	if (!record) return null;
	const runId = normalizeOptionalString(record.runId) ?? "";
	const exportPath = normalizeOptionalString(record.exportPath) ?? "";
	const sourcePath = normalizeOptionalString(record.sourcePath) ?? "";
	const appliedAt = normalizeOptionalString(record.appliedAt) ?? "";
	if (record.version !== 1 || record.importType !== "chatgpt" || !runId || !exportPath || !sourcePath || !appliedAt) return null;
	const rolledBackAt = normalizeOptionalString(record.rolledBackAt);
	const rollbackStartedAt = normalizeOptionalString(record.rollbackStartedAt);
	const rollbackTargetsFinalizedAt = normalizeOptionalString(record.rollbackTargetsFinalizedAt);
	return {
		version: 1,
		runId,
		importType: "chatgpt",
		exportPath,
		sourcePath,
		appliedAt,
		conversationCount: resolveNonNegativeIntegerOption(record.conversationCount, 0),
		createdCount: resolveNonNegativeIntegerOption(record.createdCount, 0),
		updatedCount: resolveNonNegativeIntegerOption(record.updatedCount, 0),
		skippedCount: resolveNonNegativeIntegerOption(record.skippedCount, 0),
		createdPaths: normalizeImportRunEntries(record.createdPaths),
		updatedPaths: normalizeImportRunEntries(record.updatedPaths),
		...rollbackStartedAt ? { rollbackStartedAt } : {},
		...rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt } : {},
		...rolledBackAt ? { rolledBackAt } : {}
	};
}
function normalizeMetaRecord(raw) {
	const record = asNullableRecord(raw);
	if (!record || record.kind !== "meta") return null;
	const normalized = normalizeMemoryWikiImportRunRecord({
		...record,
		createdPaths: [],
		updatedPaths: []
	});
	const vaultRootKey = typeof record.vaultRootKey === "string" ? record.vaultRootKey : "";
	return normalized && vaultRootKey ? {
		...normalized,
		kind: "meta",
		vaultRootKey
	} : null;
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
	const createdPaths = pathRows.filter((row) => row.kind === "created-path").toSorted((left, right) => left.index - right.index).map(toEntry);
	const updatedPaths = pathRows.filter((row) => row.kind === "updated-path").toSorted((left, right) => left.index - right.index).map(toEntry);
	return {
		version: 1,
		runId: meta.runId,
		importType: "chatgpt",
		exportPath: meta.exportPath,
		sourcePath: meta.sourcePath,
		appliedAt: meta.appliedAt,
		conversationCount: meta.conversationCount,
		createdCount: meta.createdCount,
		updatedCount: meta.updatedCount,
		skippedCount: meta.skippedCount,
		createdPaths,
		updatedPaths,
		...meta.rollbackStartedAt ? { rollbackStartedAt: meta.rollbackStartedAt } : {},
		...meta.rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt: meta.rollbackTargetsFinalizedAt } : {},
		...meta.rolledBackAt ? { rolledBackAt: meta.rolledBackAt } : {}
	};
}
function toMetaRecord(vaultRootKey, record) {
	return {
		version: 1,
		kind: "meta",
		vaultRootKey,
		runId: record.runId,
		importType: "chatgpt",
		exportPath: record.exportPath,
		sourcePath: record.sourcePath,
		appliedAt: record.appliedAt,
		conversationCount: record.conversationCount,
		createdCount: record.createdCount,
		updatedCount: record.updatedCount,
		skippedCount: record.skippedCount,
		...record.rollbackStartedAt ? { rollbackStartedAt: record.rollbackStartedAt } : {},
		...record.rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt: record.rollbackTargetsFinalizedAt } : {},
		...record.rolledBackAt ? { rolledBackAt: record.rolledBackAt } : {}
	};
}
function toPathRecords(vaultRootKey, record) {
	return [...record.createdPaths.map((entry, index) => ({
		kind: "created-path",
		vaultRootKey,
		runId: record.runId,
		index,
		path: entry.path,
		...entry.contentHash ? { contentHash: entry.contentHash } : {},
		...entry.recoveryPaths ? { recoveryPaths: [...entry.recoveryPaths] } : {}
	})), ...record.updatedPaths.map((entry, index) => ({
		kind: "updated-path",
		vaultRootKey,
		runId: record.runId,
		index,
		path: entry.path,
		...entry.snapshotPath ? { snapshotPath: entry.snapshotPath } : {},
		...entry.contentHash ? { contentHash: entry.contentHash } : {},
		...entry.recoveryPaths ? { recoveryPaths: [...entry.recoveryPaths] } : {}
	}))];
}
function createMemoryFallbackImportRunStore() {
	return {
		async read(vaultRoot, runId) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			const record = memoryImportRunsByVault.get(vaultRootKey)?.get(runId);
			return record ? cloneImportRunRecord(record) : null;
		},
		async write(vaultRoot, record) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			const records = memoryImportRunsByVault.get(vaultRootKey) ?? /* @__PURE__ */ new Map();
			records.set(record.runId, cloneImportRunRecord(record));
			memoryImportRunsByVault.set(vaultRootKey, records);
		},
		async list(vaultRoot) {
			const vaultRootKey = resolveVaultRootKey(vaultRoot);
			return [...memoryImportRunsByVault.get(vaultRootKey)?.values() ?? []].map(cloneImportRunRecord);
		},
		async rowCount() {
			let count = 0;
			for (const records of memoryImportRunsByVault.values()) for (const record of records.values()) count += 1 + record.createdPaths.length + record.updatedPaths.length;
			return count;
		}
	};
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
				const key = resolvePathStateEntryKey({
					vaultRootKey,
					runId: record.runId,
					kind: pathRecord.kind,
					index: pathRecord.index,
					path: pathRecord.path
				});
				nextPathKeys.add(key);
				await store.register(key, pathRecord);
			}
			await store.register(resolveStateEntryKey(vaultRootKey, record.runId), toMetaRecord(vaultRootKey, record));
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
function resolveImportRunStore(store) {
	return store ?? configuredImportRunStore ?? createMemoryFallbackImportRunStore();
}
async function readMemoryWikiImportRunRecord(vaultRoot, runId, store) {
	return await resolveImportRunStore(store).read(vaultRoot, runId);
}
async function writeMemoryWikiImportRunRecord(vaultRoot, record, store) {
	await resolveImportRunStore(store).write(vaultRoot, record);
}
async function listMemoryWikiImportRunRecords(vaultRoot, store) {
	return await resolveImportRunStore(store).list(vaultRoot);
}
async function countMemoryWikiImportRunStateRows(store) {
	return await resolveImportRunStore(store).rowCount();
}
async function readLegacyMemoryWikiImportRunRecords(vaultRoot) {
	const importRunsDir = resolveMemoryWikiImportRunsDir(vaultRoot);
	const entries = await walkMemoryWikiDirectory(importRunsDir, "", {
		maxDepth: 1,
		entryFilter: (entry) => entry.kind === "directory" ? "skip-subtree" : entry.kind === "file" && entry.relativePath.endsWith(".json") ? "include" : "skip"
	}).catch((error) => {
		if (asNullableRecord(error)?.code === "ENOENT") return [];
		throw error;
	});
	const { results } = await runTasksWithConcurrency({
		tasks: entries.filter((entry) => entry.kind === "file").map((entry) => async () => {
			const raw = await fs.readFile(path.join(importRunsDir, entry.relativePath), "utf8");
			return normalizeMemoryWikiImportRunRecord(JSON.parse(raw));
		}),
		limit: LEGACY_IMPORT_RUN_READ_CONCURRENCY,
		errorMode: "stop",
		throwOnError: true
	});
	return results.filter((record) => record !== null);
}
//#endregion
export { preserveHumanNotesBlock as A, WIKI_RAW_SOURCE_MARKER as C, normalizeSourceIds as D, isUnmanagedRawSourceSummary as E, slugifyWikiSegment as F, toWikiPageSummary as I, WIKI_RELATED_END_MARKER as L, renderWikiMarkdown as M, scanWikiPageSummary as N, normalizeWikiClaims as O, slugifyWikiPageStem as P, WIKI_RELATED_START_MARKER as R, writeMemoryWikiSourceSyncState as S, formatWikiLink as T, readLegacyMemoryWikiSourceSyncState as _, createMemoryWikiImportRunStateStore as a, setImportedSourceEntry as b, readMemoryWikiImportRunRecord as c, MEMORY_WIKI_SOURCE_SYNC_STATE_MAX_ENTRIES as d, MEMORY_WIKI_SOURCE_SYNC_STATE_NAMESPACE as f, pruneImportedSourceEntries as g, createMemoryWikiSourceSyncStateStore as h, countMemoryWikiImportRunStateRows as i, renderMarkdownFence as j, parseWikiMarkdown as k, resolveMemoryWikiImportRunsDir as l, configureMemoryWikiSourceSyncStateStore as m, MEMORY_WIKI_IMPORT_RUN_STATE_NAMESPACE as n, listMemoryWikiImportRunRecords as o, assertMemoryWikiSourceSyncStateCapacity as p, configureMemoryWikiImportRunStateStore as r, readLegacyMemoryWikiImportRunRecords as s, MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES as t, writeMemoryWikiImportRunRecord as u, readMemoryWikiSourceSyncState as v, createWikiPageFilename as w, shouldSkipImportedSourceWrite as x, resolveMemoryWikiSourceSyncStatePath as y, walkMemoryWikiDirectory as z };
