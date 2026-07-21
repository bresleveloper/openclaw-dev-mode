import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./fs-safe-RNq3oO57.js";
import { r as readRegularFile } from "./regular-file-CuvhUtZS.js";
import { a as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, l as selectSessionTranscriptTreePathNodes, n as isSessionTranscriptLeafControl, s as scanSessionTranscriptTree } from "./transcript-tree-3cM1TqAJ.js";
import { c as parseSessionEntries, s as migrateSessionEntries } from "./session-manager-BKz2VYho.js";
import path from "node:path";
import crypto from "node:crypto";
//#region src/config/sessions/session-fork-transcript.runtime.ts
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
/** True when the selected branch carries at least one assistant message. */
function forkSourceHasAssistantEntry(entries) {
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
/** Reads the parent transcript and selects the active branch to copy. */
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
/** Builds the copied branch, re-targeted labels, and optional leaf control for a fork. */
function buildForkedBranchEntries(params) {
	const pathEntries = params.source.branchEntries;
	const pathEntryIds = new Set(pathEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = pathEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = buildBranchLabelEntries({
		labelsToWrite: params.source.labelsToWrite,
		pathEntryIds,
		lastEntryId: lastPathEntryId
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp: params.timestamp,
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		...pathEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
//#endregion
export { buildForkedBranchEntries, forkSourceHasAssistantEntry, readForkSourceTranscript };
