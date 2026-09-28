import { v as parseDateFirstTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./concurrency-runtime-BevFACIQ.mjs";
import { t as resolveClaudeCatalogHomeDir } from "./session-catalog-home-DC4c4SgQ.mjs";
import { c as projectsDir, d as readProjectsTreeSnapshot, f as safeSessionFileForScan, l as readClaudeCatalogMetadata, n as CLAUDE_PARTIAL_SCAN_TTL_MS, p as setBoundedCache, r as CLAUDE_SESSION_SCAN_HARD_TTL_MS, u as readJsonFile } from "./session-catalog-scan-CiBc8XV5.mjs";
import { a as readDesktopOverlay, n as desktopPullRequestSummary, r as emptyDesktopOverlay, t as MAX_STRING_LENGTH } from "./session-catalog-desktop-DyuCxlpA.mjs";
import { t as collectTranscriptText } from "./session-catalog-transcript-BzQ7HJEL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-discovery.ts
const MAX_CATALOG_DISCOVERY_FILES = 1e4;
const MAX_CATALOG_DISCOVERY_CACHE_ENTRIES = 2e4;
const MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES = 8;
const MAX_CATALOG_METADATA_SCAN_BYTES = 67108864;
const CLI_ENTRYPOINTS = /* @__PURE__ */ new Set(["cli", "sdk-cli"]);
const catalogDiscoveryCache = /* @__PURE__ */ new Map();
const claudeSessionScanCache = /* @__PURE__ */ new Map();
const mergedScans = /* @__PURE__ */ new WeakMap();
function cacheCatalogDiscovery(filePath, entry) {
	setBoundedCache(catalogDiscoveryCache, filePath, entry, MAX_CATALOG_DISCOVERY_CACHE_ENTRIES);
}
function applyCatalogDiscovery(records, sessionId, discovery) {
	const record = records.get(sessionId) ?? discovery.record;
	if (record) records.set(sessionId, {
		...record,
		...discovery.metadata,
		name: discovery.metadata.name ?? record.name ?? discovery.record?.name ?? null
	});
}
function isCliEntrypoint(value) {
	return typeof value === "string" && CLI_ENTRYPOINTS.has(value);
}
function parseClaudeCatalogTimestampMs(value) {
	return parseDateFirstTimestampMs(value);
}
async function readIndexRecords(context) {
	const records = /* @__PURE__ */ new Map();
	const sidechainIds = /* @__PURE__ */ new Set();
	if (!context.resolvedRoot) return {
		records,
		sidechainIds
	};
	const { results: indexes } = await runTasksWithConcurrency({
		tasks: context.projectDirectories.map(({ directory, childNames, files }) => async () => ({
			directory,
			raw: childNames.includes("sessions-index.json") ? await readJsonFile(path.join(directory, "sessions-index.json"), {
				signature: files.get("sessions-index.json"),
				onIoFailure: () => {
					context.complete = false;
				}
			}) : void 0
		})),
		limit: 32,
		throwOnError: true
	});
	for (const { directory, raw } of indexes) {
		if (!isRecord(raw) || !Array.isArray(raw.entries)) continue;
		for (const candidate of raw.entries) {
			if (!isRecord(candidate)) continue;
			const entry = candidate;
			const sessionId = normalizeBoundedOptionalString(entry.sessionId, 256);
			if (!sessionId) continue;
			if (entry.isSidechain === true) {
				sidechainIds.add(sessionId);
				records.delete(sessionId);
				continue;
			}
			const indexedPath = normalizeBoundedOptionalString(entry.fullPath, MAX_STRING_LENGTH);
			const safeFile = await safeSessionFileForScan(context, indexedPath ?? path.join(directory, `${sessionId}.jsonl`), sessionId);
			if (!safeFile) continue;
			const createdAt = parseClaudeCatalogTimestampMs(entry.created);
			const updatedAt = parseClaudeCatalogTimestampMs(entry.modified) ?? parseClaudeCatalogTimestampMs(entry.fileMtime);
			const summary = normalizeBoundedOptionalString(entry.summary, 500);
			const firstPrompt = normalizeBoundedOptionalString(entry.firstPrompt, 500);
			records.set(sessionId, {
				threadId: sessionId,
				name: summary ?? firstPrompt ?? null,
				cwd: normalizeBoundedOptionalString(entry.projectPath, MAX_STRING_LENGTH),
				status: "stored",
				...createdAt !== void 0 ? { createdAt } : {},
				...updatedAt !== void 0 ? {
					updatedAt,
					recencyAt: updatedAt
				} : {},
				source: "claude-cli",
				modelProvider: "anthropic",
				...normalizeBoundedOptionalString(entry.gitBranch, 500) ? { gitBranch: normalizeBoundedOptionalString(entry.gitBranch, 500) } : {},
				archived: false,
				filePath: safeFile.filePath
			});
		}
	}
	return {
		records,
		sidechainIds
	};
}
async function locateSessionFile(context, sessionId) {
	const fileName = `${sessionId}.jsonl`;
	for (const { directory, childNames } of context.projectDirectories) {
		if (!childNames.includes(fileName)) continue;
		const candidate = path.join(directory, fileName);
		const safeFile = await safeSessionFileForScan(context, candidate, sessionId);
		if (safeFile) return safeFile.filePath;
	}
}
async function discoverCliRecords(context, records, sidechainIds) {
	const { root } = context;
	if (!context.resolvedRoot) {
		for (const [cachedPath, entry] of catalogDiscoveryCache) if (entry.root === root) catalogDiscoveryCache.delete(cachedPath);
		return;
	}
	let discoveredFiles = 0;
	let scannedBytes = 0;
	let truncated = false;
	const seenFilePaths = /* @__PURE__ */ new Set();
	const pendingIndexedFiles = new Set([...records.values()].map((record) => record.filePath));
	const candidates = [];
	collect: for (const { directory, childNames } of context.projectDirectories) for (const name of childNames) {
		if (!name.endsWith(".jsonl")) continue;
		if (discoveredFiles >= MAX_CATALOG_DISCOVERY_FILES) {
			truncated = true;
			break collect;
		}
		discoveredFiles += 1;
		const sessionId = name.slice(0, -6);
		if (sessionId) candidates.push({
			directory,
			name,
			sessionId
		});
	}
	for (const { directory, name, sessionId } of candidates) {
		if (sidechainIds.has(sessionId)) continue;
		const fileStat = await safeSessionFileForScan(context, path.join(directory, name), sessionId);
		if (!fileStat) continue;
		const { filePath } = fileStat;
		if (records.has(sessionId) && !pendingIndexedFiles.delete(filePath)) continue;
		seenFilePaths.add(filePath);
		const cached = catalogDiscoveryCache.get(filePath);
		if (cached && cached.root === root && cached.mtimeMs === fileStat.mtimeMs && cached.size === fileStat.size && cached.ino === fileStat.ino && cached.sessionId === sessionId && scannedBytes + cached.scannedBytes <= MAX_CATALOG_METADATA_SCAN_BYTES) {
			if (cached.sidechain) sidechainIds.add(sessionId);
			applyCatalogDiscovery(records, sessionId, cached);
			scannedBytes += cached.scannedBytes;
			if (scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) {
				truncated = true;
				break;
			}
			continue;
		}
		const handle = await fs.open(filePath, "r").catch(() => {
			context.complete = false;
		});
		if (!handle) continue;
		let cacheable = false;
		let fileScannedBytes = 0;
		let record = null;
		let metadata = {};
		try {
			const stat = await handle.stat();
			let aiTitle;
			let customTitle;
			let color;
			const inspectLine = (line, metadataOnly) => {
				let raw;
				try {
					raw = JSON.parse(line.toString("utf8"));
				} catch {
					return false;
				}
				if (!isRecord(raw) || raw.sessionId !== sessionId) return false;
				if (raw.type === "ai-title") {
					aiTitle = normalizeBoundedOptionalString(raw.aiTitle, 500);
					return false;
				}
				if (raw.type === "custom-title") {
					customTitle = normalizeBoundedOptionalString(raw.customTitle, 500);
					return false;
				}
				if (raw.type === "agent-color") {
					color = normalizeBoundedOptionalString(raw.agentColor, MAX_STRING_LENGTH);
					return false;
				}
				if (metadataOnly) return false;
				if (typeof raw.entrypoint === "string" && !isCliEntrypoint(raw.entrypoint)) return true;
				if (isCliEntrypoint(raw.entrypoint) && raw.isSidechain === true) {
					sidechainIds.add(sessionId);
					return true;
				}
				if (!isCliEntrypoint(raw.entrypoint) || raw.type !== "user" || raw.isMeta === true || !isRecord(raw.message) || raw.message.role !== "user") return false;
				const fragments = [];
				collectTranscriptText(raw.message.content, fragments);
				const firstPrompt = normalizeBoundedOptionalString(fragments[0], 500);
				const createdAt = parseClaudeCatalogTimestampMs(raw.timestamp);
				record = {
					threadId: sessionId,
					name: firstPrompt ?? null,
					cwd: normalizeBoundedOptionalString(raw.cwd, MAX_STRING_LENGTH),
					status: "stored",
					...createdAt !== void 0 ? { createdAt } : {},
					updatedAt: stat.mtimeMs,
					recencyAt: stat.mtimeMs,
					source: "claude-cli",
					modelProvider: "anthropic",
					...normalizeBoundedOptionalString(raw.version, 256) ? { cliVersion: normalizeBoundedOptionalString(raw.version, 256) } : {},
					...normalizeBoundedOptionalString(raw.gitBranch, 500) ? { gitBranch: normalizeBoundedOptionalString(raw.gitBranch, 500) } : {},
					archived: false,
					filePath
				};
				return true;
			};
			const scan = await readClaudeCatalogMetadata(handle, stat.size, MAX_CATALOG_METADATA_SCAN_BYTES - scannedBytes, inspectLine);
			fileScannedBytes = scan.scannedBytes;
			scannedBytes += fileScannedBytes;
			metadata = {
				name: customTitle ?? aiTitle,
				color
			};
			applyCatalogDiscovery(records, sessionId, {
				record,
				metadata
			});
			cacheable = !(scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) && scan.complete;
		} finally {
			await handle.close();
		}
		if (cacheable) cacheCatalogDiscovery(filePath, {
			root,
			mtimeMs: fileStat.mtimeMs,
			size: fileStat.size,
			ino: fileStat.ino,
			sessionId,
			scannedBytes: fileScannedBytes,
			record,
			metadata,
			sidechain: sidechainIds.has(sessionId)
		});
		if (scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) {
			truncated = true;
			break;
		}
	}
	if (!truncated) {
		for (const [cachedPath, entry] of catalogDiscoveryCache) if (entry.root === root && !seenFilePaths.has(cachedPath)) catalogDiscoveryCache.delete(cachedPath);
	}
}
async function scanClaudeSessions(snapshot) {
	const context = {
		...snapshot,
		complete: true,
		safeFiles: /* @__PURE__ */ new Map(),
		directoriesByPath: new Map(snapshot.projectDirectories.map((dir) => [dir.directory, dir]))
	};
	const indexed = await readIndexRecords(context);
	await discoverCliRecords(context, indexed.records, indexed.sidechainIds);
	return {
		...indexed,
		context
	};
}
async function mergeClaudeSessions(cli, desktop) {
	const { context, sidechainIds } = cli;
	const records = new Map(cli.records);
	for (const sessionId of desktop.archived) records.delete(sessionId);
	for (const [sessionId, metadata] of desktop.active) {
		if (sidechainIds.has(sessionId)) continue;
		const existing = records.get(sessionId);
		const filePath = existing?.filePath ?? await locateSessionFile(context, sessionId);
		if (!filePath) continue;
		const createdAt = parseClaudeCatalogTimestampMs(metadata.createdAt) ?? existing?.createdAt;
		const updatedAt = parseClaudeCatalogTimestampMs(metadata.lastActivityAt) ?? existing?.updatedAt;
		const customGroup = normalizeBoundedOptionalString(metadata.customGroup, 500);
		const pullRequest = desktopPullRequestSummary(metadata);
		records.set(sessionId, {
			...existing ?? {
				threadId: sessionId,
				status: "stored",
				modelProvider: "anthropic",
				archived: false
			},
			name: normalizeBoundedOptionalString(metadata.title, 500) ?? existing?.name ?? null,
			cwd: normalizeBoundedOptionalString(metadata.cwd, 4096) ?? normalizeBoundedOptionalString(metadata.originCwd, 4096) ?? existing?.cwd,
			...createdAt !== void 0 ? { createdAt } : {},
			...updatedAt !== void 0 ? {
				updatedAt,
				recencyAt: updatedAt
			} : {},
			...customGroup ? { customGroup } : {},
			...pullRequest ? { pullRequest } : {},
			source: "claude-desktop",
			color: void 0,
			filePath
		});
	}
	return [...records.values()].toSorted((left, right) => {
		return (right.recencyAt ?? right.updatedAt ?? 0) - (left.recencyAt ?? left.updatedAt ?? 0) || left.threadId.localeCompare(right.threadId);
	});
}
async function readCliScan(treeSnapshot, forceRefresh) {
	const cacheKey = `${treeSnapshot.root}\0cli`;
	const now = Date.now();
	const cached = claudeSessionScanCache.get(cacheKey);
	if (!forceRefresh && cached?.treeStamp === treeSnapshot.treeStamp && cached.hardExpiresAt > now) {
		setBoundedCache(claudeSessionScanCache, cacheKey, cached, MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES);
		return cached.records;
	}
	const entry = {
		treeStamp: treeSnapshot.treeStamp,
		hardExpiresAt: now + CLAUDE_SESSION_SCAN_HARD_TTL_MS,
		records: scanClaudeSessions(treeSnapshot)
	};
	setBoundedCache(claudeSessionScanCache, cacheKey, entry, MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES);
	try {
		const result = await entry.records;
		if (!result.context.complete) entry.hardExpiresAt = Date.now() + CLAUDE_PARTIAL_SCAN_TTL_MS;
		return result;
	} catch (error) {
		if (claudeSessionScanCache.get(cacheKey) === entry) claudeSessionScanCache.delete(cacheKey);
		throw error;
	}
}
async function listClaudeSessions(homeDir = resolveClaudeCatalogHomeDir(), options = {}) {
	const [cli, desktop] = await Promise.all([readProjectsTreeSnapshot(projectsDir(homeDir, options.configDir), options).then((snapshot) => readCliScan(snapshot, options.forceRefresh)), options.includeDesktop !== false ? readDesktopOverlay(homeDir, options.forceRefresh) : emptyDesktopOverlay]);
	let overlays = mergedScans.get(cli);
	if (!overlays) {
		overlays = /* @__PURE__ */ new WeakMap();
		mergedScans.set(cli, overlays);
	}
	let merged = overlays.get(desktop);
	if (!merged) {
		merged = mergeClaudeSessions(cli, desktop);
		overlays.set(desktop, merged);
	}
	return merged;
}
//#endregion
export { listClaudeSessions as t };
