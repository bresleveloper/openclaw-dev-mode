import "./fs-safe-aqmM_n6V.js";
import { r as readRegularFile } from "./regular-file-BD2zl6_l.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-CHZBIGhF.js";
import { s as resolveFreshSessionTotalTokens } from "./types-CoDcFuoc.js";
import "./version-Bsehiavt.js";
import { a as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, l as selectSessionTranscriptTreePathNodes, n as isSessionTranscriptLeafControl, s as scanSessionTranscriptTree } from "./transcript-tree-3cM1TqAJ.js";
import { c as parseSessionEntries, s as migrateSessionEntries } from "./session-manager-D5YeJxMM.js";
import { r as readLatestRecentSessionUsageFromTranscriptAsync } from "./session-utils.fs-CuEupzWa.js";
import { n as derivePromptTokens } from "./usage-C67Kbb7n.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-fork.runtime.ts
/** Runtime implementation for forking sessions from parent transcripts. */
const FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN = 4;
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function maxPositiveTokenCount(...values) {
	let max;
	for (const value of values) {
		const normalized = resolvePositiveTokenCount(value);
		if (typeof normalized === "number" && (max === void 0 || normalized > max)) max = normalized;
	}
	return max;
}
async function estimateParentTranscriptTokensFromBytes(params) {
	try {
		const filePath = resolveSessionFilePath(params.parentEntry.sessionId, params.parentEntry, resolveSessionFilePathOptions({ storePath: params.storePath }));
		const stat = await fs.stat(filePath);
		return resolvePositiveTokenCount(Math.ceil(stat.size / FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN));
	} catch {
		return;
	}
}
/** Resolves the best available token count for a parent session before forking. */
async function resolveParentForkTokenCountRuntime(params) {
	const freshPersistedTokens = resolveFreshSessionTotalTokens(params.parentEntry);
	if (typeof freshPersistedTokens === "number") return freshPersistedTokens;
	const cachedTokens = resolvePositiveTokenCount(params.parentEntry.totalTokens);
	const byteEstimateTokens = await estimateParentTranscriptTokensFromBytes(params);
	try {
		const usage = await readLatestRecentSessionUsageFromTranscriptAsync(params.parentEntry.sessionId, params.storePath, params.parentEntry.sessionFile, void 0, 1024 * 1024);
		const promptTokens = resolvePositiveTokenCount(derivePromptTokens({
			input: usage?.inputTokens,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = resolvePositiveTokenCount(usage?.outputTokens);
		if (typeof promptTokens === "number") return maxPositiveTokenCount(promptTokens + (outputTokens ?? 0), cachedTokens, byteEstimateTokens);
	} catch {}
	return maxPositiveTokenCount(cachedTokens, byteEstimateTokens);
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = crypto.randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = crypto.randomUUID();
	existingIds.add(id);
	return id;
}
function hasAssistantEntry(entries) {
	return entries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
}
function collectBranchLabels(params) {
	const labelsToWrite = [];
	for (const entry of params.allEntries) {
		if (!isRecord(entry)) continue;
		if (entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !params.pathEntryIds.has(entry.id) && params.pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string") labelsToWrite.push({
			targetId: entry.targetId,
			label: entry.label,
			timestamp: entry.timestamp
		});
	}
	return labelsToWrite;
}
async function readForkSourceTranscript(parentSessionFile) {
	const fileEntries = parseSessionEntries((await readRegularFile({ filePath: parentSessionFile })).buffer.toString("utf-8"));
	migrateSessionEntries(fileEntries);
	const header = fileEntries.find((entry) => entry.type === "session") ?? null;
	const entries = fileEntries.filter((entry) => entry.type !== "session");
	const tree = scanSessionTranscriptTree(entries);
	const leafId = tree.leafId;
	const appendParentId = tree.appendParentId;
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath: selectSessionTranscriptTreePathNodes(tree, leafId),
		appendPath: selectSessionTranscriptTreePathNodes(tree, appendParentId),
		appendParentId
	});
	const branchEntries = mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	});
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastLeafUpdateEntry = lastLeafUpdateNode?.entry;
	return {
		cwd: header?.cwd ?? process.cwd(),
		sessionDir: path.dirname(parentSessionFile),
		leafId,
		appendParentId: mergedPath.appendParentId,
		...lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		preserveLeafControl: isSessionTranscriptLeafControl(lastLeafUpdateEntry),
		branchEntries,
		labelsToWrite: collectBranchLabels({
			allEntries: entries,
			pathEntryIds
		})
	};
}
function buildBranchLabelEntries(params) {
	let parentId = params.lastEntryId;
	const labelEntries = [];
	for (const { targetId, label, timestamp } of params.labelsToWrite) {
		const labelEntry = {
			type: "label",
			id: generateEntryId(params.pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		params.pathEntryIds.add(labelEntry.id);
		labelEntries.push(labelEntry);
		parentId = labelEntry.id;
	}
	return labelEntries;
}
async function writeForkHeaderOnly(params) {
	const sessionId = crypto.randomUUID();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const fileTimestamp = timestamp.replace(/[:.]/g, "-");
	const sessionFile = path.join(params.sessionDir, `${fileTimestamp}_${sessionId}.jsonl`);
	const header = {
		type: "session",
		version: 3,
		id: sessionId,
		timestamp,
		cwd: params.cwd,
		parentSession: params.parentSessionFile
	};
	await fs.mkdir(path.dirname(sessionFile), { recursive: true });
	await fs.writeFile(sessionFile, `${JSON.stringify(header)}\n`, {
		encoding: "utf-8",
		mode: 384,
		flag: "wx"
	});
	return {
		sessionId,
		sessionFile
	};
}
async function writeBranchedSession(params) {
	const sessionId = crypto.randomUUID();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const fileTimestamp = timestamp.replace(/[:.]/g, "-");
	const sessionFile = path.join(params.source.sessionDir, `${fileTimestamp}_${sessionId}.jsonl`);
	const pathEntries = params.source.branchEntries;
	const pathEntryIds = new Set(pathEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = pathEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = buildBranchLabelEntries({
		labelsToWrite: params.source.labelsToWrite,
		pathEntryIds,
		lastEntryId: lastPathEntryId
	});
	const header = {
		type: "session",
		version: 3,
		id: sessionId,
		timestamp,
		cwd: params.source.cwd,
		parentSession: params.parentSessionFile
	};
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp,
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	const entries = [
		header,
		...pathEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
	await fs.mkdir(path.dirname(sessionFile), { recursive: true });
	await fs.writeFile(sessionFile, `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`, {
		encoding: "utf-8",
		mode: 384,
		flag: "wx"
	});
	return {
		sessionId,
		sessionFile
	};
}
/** Creates a child session transcript from a parent session branch. */
async function forkSessionFromParentRuntime(params) {
	const parentSessionFile = resolveSessionFilePath(params.parentEntry.sessionId, params.parentEntry, {
		agentId: params.agentId,
		sessionsDir: params.sessionsDir
	});
	if (!parentSessionFile) return null;
	try {
		const source = await readForkSourceTranscript(parentSessionFile);
		if (!source) return null;
		return source.preserveLeafControl || hasAssistantEntry(source.branchEntries) ? await writeBranchedSession({
			parentSessionFile,
			source
		}) : await writeForkHeaderOnly({
			parentSessionFile,
			sessionDir: source.sessionDir,
			cwd: source.cwd
		});
	} catch {
		return null;
	}
}
//#endregion
export { forkSessionFromParentRuntime, resolveParentForkTokenCountRuntime };
