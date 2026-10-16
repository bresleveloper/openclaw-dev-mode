import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as findSessionTranscriptHeader, x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as projectModelContextMessages } from "./model-context-message-CS718pyQ.mjs";
import { n as iterateSessionContextEntries, o as stripCompactionReplayCheckpoint } from "./session-DitLEF2L.mjs";
import { a as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { t as createSessionTranscriptHeader } from "./transcript-header-CyuYZIZn.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BZlUzQZy.mjs";
import { r as derivePromptTokens, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { n as normalizeSessionContextEntryBoundaries } from "./session-entry-navigation-DTnKkJNk.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-parent-fork.ts
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
function planParentForkDecision(parentEntry, transcriptEstimate, options = {}) {
	const maxTokens = normalizePositiveTokenCount(options.maxTokens) ?? DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = options.preferTranscriptEstimate ? transcriptEstimate : normalizePositiveTokenCount(Math.max(resolveFreshSessionTotalTokens(parentEntry) ?? 0, transcriptEstimate ?? 0));
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: `Parent context is too large to fork (${parentTokens}/${maxTokens} tokens); starting with isolated context instead.`
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
function estimateParentForkPromptTokens(source) {
	if (!source) return;
	let byteEstimate = 0;
	let latestUsageEstimate;
	let trailingBytes = 0;
	for (const { event, context } of selectParentForkTokenEstimateEvents(source.branchEntries)) {
		if (context !== "reset-retained" && isRecord(event) && isRecord(event.message) && event.message.excludeFromContext === true) continue;
		let contextEvent = event;
		if (isRecord(event) && isRecord(event.message)) {
			const message = context !== "current" && isIndexedSessionEntry(event) && event.type === "message" && event.message.role === "assistant" ? stripCompactionReplayCheckpoint(event.message) : event.message;
			contextEvent = {
				...event,
				message: projectModelContextMessages([message])[0]
			};
		}
		const serializedBytes = Buffer.byteLength(JSON.stringify(contextEvent)) + 1;
		byteEstimate += serializedBytes;
		if (context !== "current" || !isRecord(event)) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const message = isRecord(event.message) ? event.message : void 0;
		const usageRaw = isRecord(message?.usage) ? message.usage : isRecord(event.usage) ? event.usage : void 0;
		if (!usageRaw) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const contextUsage = readTranscriptContextUsage(usageRaw);
		if (message?.api === "cli" && contextUsage === void 0 || contextUsage?.state === "unavailable") {
			latestUsageEstimate = void 0;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "available") {
			latestUsageEstimate = normalizePositiveTokenCount(contextUsage.totalTokens);
			trailingBytes = 0;
			continue;
		}
		const usage = normalizeUsage(usageRaw);
		const promptTokens = normalizePositiveTokenCount(derivePromptTokens({
			input: usage?.input,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = normalizePositiveTokenCount(usage?.output) ?? 0;
		const totalTokens = promptTokens === void 0 ? void 0 : normalizePositiveTokenCount(promptTokens + outputTokens);
		if (typeof totalTokens === "number") {
			latestUsageEstimate = totalTokens;
			trailingBytes = 0;
		}
	}
	if (latestUsageEstimate !== void 0) return normalizePositiveTokenCount(latestUsageEstimate + Math.ceil(trailingBytes / 4));
	return normalizePositiveTokenCount(Math.ceil(byteEstimate / 4));
}
function* selectParentForkTokenEstimateEvents(branch) {
	if (!branch.some((event) => isRecord(event) && (event.type === "compaction" || event.type === "reset"))) {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const indexedEntries = branch.filter(isIndexedSessionEntry);
	const selected = Array.from(iterateSessionContextEntries(indexedEntries));
	const boundary = selected[0]?.entry;
	if (boundary?.type !== "compaction" && boundary?.type !== "reset") {
		for (const event of branch) yield {
			event,
			context: "current"
		};
		return;
	}
	const contexts = new Map(selected.map(({ entry, context }) => [entry.id, context]));
	const indexedIds = new Set(indexedEntries.map((entry) => entry.id));
	const boundaryIndex = branch.findIndex((entry) => isRecord(entry) && entry.id === boundary.id);
	for (const [index, event] of branch.entries()) {
		const context = isRecord(event) && typeof event.id === "string" ? contexts.get(event.id) : void 0;
		if (context) yield {
			event,
			context
		};
		else if (index > boundaryIndex && (!isRecord(event) || typeof event.id !== "string" || !indexedIds.has(event.id))) yield {
			event,
			context: "opaque"
		};
	}
}
function normalizePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readTranscriptContextUsage(usageRaw) {
	const contextUsage = usageRaw.contextUsage;
	if (!isRecord(contextUsage)) return;
	if (contextUsage.state === "unavailable") return { state: "unavailable" };
	if (contextUsage.state !== "available") return;
	const totalTokens = normalizePositiveTokenCount(contextUsage.totalTokens);
	return totalTokens === void 0 ? void 0 : {
		state: "available",
		totalTokens
	};
}
function resolveParentForkSourceTranscript(fileEntries, forkFrom) {
	if (fileEntries.length === 0) return null;
	const header = findSessionTranscriptHeader(fileEntries);
	const entries = fileEntries.filter((entry) => !(isRecord(entry) && entry.type === "session"));
	const tree = scanSessionTranscriptTree(entries);
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const appendPath = selectSessionTranscriptTreePathNodes(tree, tree.appendParentId);
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath,
		appendPath,
		appendParentId: tree.appendParentId
	});
	const visibleBranchEntries = normalizeSessionContextEntryBoundaries(mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	}), tree.nodes);
	const branchEntries = forkFrom === "last-completed" ? visibleBranchEntries.slice(0, findLastCompletedAssistantIndex(visibleBranchEntries) + 1) : visibleBranchEntries;
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastBranchEntry = branchEntries.at(-1);
	const lastBranchEntryId = isRecord(lastBranchEntry) && typeof lastBranchEntry.id === "string" ? lastBranchEntry.id : null;
	return {
		appendParentId: forkFrom === "last-completed" ? lastBranchEntryId : mergedPath.appendParentId,
		...forkFrom !== "last-completed" && lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		branchEntries,
		cwd: typeof header?.cwd === "string" ? header.cwd : void 0,
		version: header?.version ?? 3,
		labelsToWrite: entries.flatMap((entry) => isRecord(entry) && entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !pathEntryIds.has(entry.id) && pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string" ? [{
			targetId: entry.targetId,
			label: entry.label,
			timestamp: entry.timestamp
		}] : []),
		leafId: forkFrom === "last-completed" ? lastBranchEntryId : tree.leafId,
		preserveLeafControl: forkFrom !== "last-completed" && isSessionTranscriptLeafControl(lastLeafUpdateNode?.entry)
	};
}
function findLastCompletedAssistantIndex(entries) {
	return entries.findLastIndex((entry) => {
		const message = isRecord(entry) && isRecord(entry.message) ? entry.message : void 0;
		return message?.role === "assistant" && message.stopReason !== "toolUse";
	});
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
function buildForkedChildTranscriptEvents(params) {
	const keepHistory = params.source.preserveLeafControl || params.source.branchEntries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
	const header = {
		...createSessionTranscriptHeader({
			cwd: params.source.cwd,
			sessionId: params.targetSessionId,
			version: keepHistory ? params.source.version : void 0
		}),
		parentSession: params.parentSessionFile
	};
	if (!keepHistory) return [header];
	const pathEntryIds = new Set(params.source.branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = params.source.branchEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	let parentId = lastPathEntryId;
	const labelEntries = params.source.labelsToWrite.map(({ targetId, label, timestamp }) => {
		const entry = {
			type: "label",
			id: generateEntryId(pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		parentId = entry.id;
		return entry;
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		header,
		...params.source.branchEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
//#endregion
export { resolveParentForkSourceTranscript as i, estimateParentForkPromptTokens as n, planParentForkDecision as r, buildForkedChildTranscriptEvents as t };
