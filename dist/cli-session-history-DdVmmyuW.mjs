import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
import { n as getCliSessionBinding, r as normalizeCliSessionReseedReceipt } from "./cli-session-binding-BhV_HbVa.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { c as stripInlineDirectiveTagsForDisplay } from "./directive-tags-D9uZSb5h.mjs";
import { f as stripCliSessionDriftNote } from "./cli-session-Cg8Oaz0V.mjs";
import { r as isOpenClawCliImageCachePath } from "./images.media-refs-B62GCpdx.mjs";
import { n as hashCliImageTurnEntryId, r as readCliImageTurnContext } from "./cli-image-turn-correlation-BVjxe73p.mjs";
import { a as parseClaudeCliHistoryEntry, c as redactClaudeCliHistoryMessage, d as resolveClaudeCliSessionFilePathAsync, i as decodeClaudeCliProjectEntry, n as appendCoalescedClaudeCliToolMessage, r as createClaudeReseedImportState, s as readClaudeCliSessionMessages, t as CLAUDE_CLI_PROVIDER } from "./cli-session-history.claude-D82aq7_9.mjs";
import fs from "node:fs";
import { setImmediate } from "node:timers/promises";
import { Worker } from "node:worker_threads";
import readline from "node:readline";
//#region src/gateway/cli-session-history.claude-snapshot.ts
const YIELD_BYTES = 262144;
const OFFTHREAD_JSONL_LINE_CHARS = 1048576;
const OVERSIZED_HISTORY_PLACEHOLDER = "[Claude CLI history record omitted from context because it exceeded 1 MiB.]";
const OVERSIZED_ENTRY_WORKER_SOURCE = `
  const { parentPort } = require("node:worker_threads");
  const boundedString = (value, max) =>
    typeof value === "string" && value.length <= max ? value : undefined;
  parentPort.on("message", (line) => {
    try {
      const entry = JSON.parse(line);
      const type = entry?.type;
      const message = entry?.message;
      if ((type !== "user" && type !== "assistant") || !message || message.role !== type) {
        parentPort.postMessage(null);
      } else {
        const rawUsage = message.usage;
        const usage = rawUsage && typeof rawUsage === "object"
          ? Object.fromEntries(
              ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"]
                .flatMap((key) => Number.isFinite(rawUsage[key]) ? [[key, rawUsage[key]]] : []),
            )
          : undefined;
        parentPort.postMessage({
          type,
          timestamp: boundedString(entry.timestamp, 128),
          uuid: boundedString(entry.uuid, 1_024),
          isSidechain: entry.isSidechain === true,
          isMeta: entry.isMeta === true,
          isCompactSummary: entry.isCompactSummary === true,
          isVisibleInTranscriptOnly: entry.isVisibleInTranscriptOnly === true,
          message: {
            role: type,
            content: ${JSON.stringify(OVERSIZED_HISTORY_PLACEHOLDER)},
            model: boundedString(message.model, 256),
            stop_reason: boundedString(message.stop_reason, 128),
            usage,
          },
        });
      }
    } catch {
      parentPort.postMessage(null);
    }
  });
`;
let snapshotCache;
function normalizeOversizedEntry(value) {
	if (!isRecord(value) || value.type !== "user" && value.type !== "assistant") return null;
	const message = value.message;
	if (!isRecord(message) || message.role !== value.type) return null;
	const usage = isRecord(message.usage) ? message.usage : void 0;
	return {
		type: value.type,
		...typeof value.timestamp === "string" ? { timestamp: value.timestamp } : {},
		...typeof value.uuid === "string" ? { uuid: value.uuid } : {},
		...value.isSidechain === true ? { isSidechain: true } : {},
		...value.isMeta === true ? { isMeta: true } : {},
		...value.isCompactSummary === true ? { isCompactSummary: true } : {},
		...value.isVisibleInTranscriptOnly === true ? { isVisibleInTranscriptOnly: true } : {},
		message: {
			role: value.type,
			content: OVERSIZED_HISTORY_PLACEHOLDER,
			...typeof message.model === "string" ? { model: message.model } : {},
			...typeof message.stop_reason === "string" ? { stop_reason: message.stop_reason } : {},
			...usage ? { usage: {
				input_tokens: usage.input_tokens,
				output_tokens: usage.output_tokens,
				cache_read_input_tokens: usage.cache_read_input_tokens,
				cache_creation_input_tokens: usage.cache_creation_input_tokens
			} } : {}
		}
	};
}
async function decodeOversizedClaudeEntry(worker, line) {
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			worker.off("message", finish);
			worker.off("error", fail);
			worker.off("exit", fail);
			resolve(normalizeOversizedEntry(value));
		};
		const fail = () => finish(null);
		worker.once("message", finish);
		worker.once("error", fail);
		worker.once("exit", fail);
		try {
			worker.postMessage(line, []);
		} catch {
			fail();
		}
	});
}
function fingerprint(stats) {
	return [
		stats.dev,
		stats.ino,
		stats.size,
		stats.mtimeMs,
		stats.ctimeMs
	].join(":");
}
async function resolveSource(params) {
	const candidate = await resolveClaudeCliSessionFilePathAsync(params);
	if (!candidate) return;
	try {
		const filePath = await fs.promises.realpath(candidate);
		const sourceFingerprint = fingerprint(await fs.promises.stat(filePath));
		return [filePath, JSON.stringify([
			filePath,
			sourceFingerprint,
			params.cliSessionId,
			params.localSessionId?.trim() || null,
			normalizeCliSessionReseedReceipt(params.reseedReceipt)
		])];
	} catch {
		return;
	}
}
async function parseSnapshot(filePath, params) {
	const messages = [];
	const toolNames = /* @__PURE__ */ new Map();
	const lines = readline.createInterface({
		input: fs.createReadStream(filePath, { encoding: "utf8" }),
		crlfDelay: Number.POSITIVE_INFINITY
	});
	const reseedState = createClaudeReseedImportState(params);
	let bytesSinceYield = 0;
	let lineNumber = 0;
	let worker;
	try {
		for await (const line of lines) {
			lineNumber += 1;
			const oversized = line.length > OFFTHREAD_JSONL_LINE_CHARS;
			if (oversized) bytesSinceYield = 0;
			else {
				bytesSinceYield += Buffer.byteLength(line, "utf8") + 1;
				if (bytesSinceYield >= YIELD_BYTES) {
					bytesSinceYield = 0;
					await setImmediate();
				}
				if (!line.trim()) continue;
			}
			try {
				let entry;
				if (oversized) {
					if (!worker || worker.threadId === -1) {
						worker = new Worker(OVERSIZED_ENTRY_WORKER_SOURCE, { eval: true });
						worker.on("error", () => {});
					}
					entry = await decodeOversizedClaudeEntry(worker, line);
				} else entry = decodeClaudeCliProjectEntry(line);
				if (!entry) continue;
				const message = parseClaudeCliHistoryEntry(entry, params.cliSessionId, lineNumber, toolNames, {
					reseedMode: "recover",
					reseedState
				});
				if (message) appendCoalescedClaudeCliToolMessage(messages, message);
			} catch {}
		}
	} finally {
		await worker?.terminate();
	}
	const redacted = [];
	for (const [index, message] of messages.entries()) {
		if (index % 32 === 0) await setImmediate();
		redacted.push(redactClaudeCliHistoryMessage(message));
	}
	return Object.freeze(redacted);
}
async function readClaudeCliSessionMessagesAsync(params) {
	const source = await resolveSource(params);
	if (!source) return [];
	const [filePath, cacheKey] = source;
	if (snapshotCache?.key !== cacheKey) snapshotCache = {
		key: cacheKey,
		pending: parseSnapshot(filePath, params)
	};
	const pending = snapshotCache.pending;
	let snapshot;
	try {
		snapshot = await pending;
	} catch {
		if (snapshotCache?.pending === pending) snapshotCache = void 0;
		return [];
	}
	const messages = [];
	for (const [index, message] of snapshot.entries()) {
		if (index % 32 === 0) await setImmediate();
		messages.push(structuredClone(message));
	}
	return messages;
}
//#endregion
//#region src/gateway/cli-session-history.merge.ts
const DEDUPE_TIMESTAMP_WINDOW_MS = 3e5;
function stripTrailingCliImageMentions(text) {
	const lines = text.split("\n");
	let end = lines.length;
	while (end > 0) {
		const line = lines[end - 1]?.trim() ?? "";
		if (!line.startsWith("@") || !isOpenClawCliImageCachePath(line.slice(1))) break;
		end -= 1;
	}
	return end === lines.length ? {
		text,
		stripped: false
	} : {
		text: lines.slice(0, end).join("\n").trimEnd(),
		stripped: true
	};
}
function isClaudeCliImportedUserMessage(message, role) {
	if (role !== "user") return false;
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return normalizeOptionalString(meta?.importedFrom) === "claude-cli";
}
function extractComparableText(message, role) {
	if (!message || typeof message !== "object") return { hasCliImageMentions: false };
	const record = message;
	const parts = [];
	const text = readStringValue(record.text);
	if (text !== void 0) parts.push(text);
	const rawContent = record.content;
	const content = readStringValue(rawContent);
	if (content !== void 0) parts.push(content);
	else if (Array.isArray(rawContent)) {
		for (const block of rawContent) if (block && typeof block === "object" && "text" in block) {
			const blockText = readStringValue(block.text);
			if (blockText !== void 0) parts.push(blockText);
		}
	}
	if (parts.length === 0) return { hasCliImageMentions: false };
	const rawText = parts.join("\n");
	const joined = rawText.trim();
	if (!joined) return { hasCliImageMentions: false };
	const isClaudeImport = isClaudeCliImportedUserMessage(message, role);
	const stripResult = isClaudeImport ? stripTrailingCliImageMentions(joined) : {
		text: joined,
		stripped: false
	};
	const normalizeText = (value) => {
		return stripInlineDirectiveTagsForDisplay(role === "user" ? stripInboundMetadata(value) : value).text.replace(/\s+/g, " ").trim();
	};
	const normalized = normalizeText(stripResult.text);
	const withoutDriftNote = isClaudeImport ? stripCliSessionDriftNote(rawText) : rawText;
	const driftNoteText = withoutDriftNote !== rawText ? normalizeText(stripTrailingCliImageMentions(withoutDriftNote.trim()).text) : void 0;
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	const storedImageTurnKey = normalizeOptionalString(meta?.cliImageTurnKey);
	return {
		hasCliImageMentions: stripResult.stripped,
		...stripResult.stripped && isClaudeCliImportedUserMessage(message, role) ? { cliImageTurnKey: storedImageTurnKey ?? readCliImageTurnContext(joined) } : {},
		...normalized ? { text: normalized } : {},
		...driftNoteText ? { driftNoteText } : {}
	};
}
function prepareComparableMessage(message, order, externalIdentityKey) {
	if (!message || typeof message !== "object") return {
		message,
		order,
		hasCliImageMentions: false
	};
	const record = message;
	const role = readStringValue(record.role);
	const comparableText = extractComparableText(message, role);
	return {
		message,
		order,
		externalIdentityKey,
		hasCliImageMentions: comparableText.hasCliImageMentions,
		...comparableText.cliImageTurnKey ? { cliImageTurnKey: comparableText.cliImageTurnKey } : {},
		role,
		text: comparableText.text,
		driftNoteText: comparableText.driftNoteText,
		timestamp: asFiniteNumber(record.timestamp)
	};
}
function resolveImportedExternalIdentityKey(message) {
	if (!message || typeof message !== "object") return;
	const rawMeta = message["__openclaw"];
	if (!rawMeta || typeof rawMeta !== "object") return;
	const externalId = normalizeOptionalString(rawMeta.externalId);
	return externalId ? JSON.stringify([
		externalId,
		normalizeOptionalString(rawMeta.importedFrom),
		normalizeOptionalString(rawMeta.cliSessionId)
	]) : void 0;
}
function addTimestampToSummary(summary, entry) {
	if (entry.timestamp === void 0) {
		summary.missingTimestamps.push(entry);
		return;
	}
	summary.timestampedByOrder.push(entry);
	summary.timestampRoot = insertTimestampCandidate(summary.timestampRoot, entry);
}
function compareTimestampCandidates(left, right) {
	return (left.timestamp ?? 0) - (right.timestamp ?? 0) || left.order - right.order;
}
function timestampCandidateHeight(node) {
	return node?.height ?? 0;
}
function updateTimestampCandidate(node) {
	node.height = Math.max(timestampCandidateHeight(node.left), timestampCandidateHeight(node.right)) + 1;
	node.minOrder = Math.min(node.entry.order, node.left?.minOrder ?? Number.POSITIVE_INFINITY, node.right?.minOrder ?? Number.POSITIVE_INFINITY);
	node.maxOrder = Math.max(node.entry.order, node.left?.maxOrder ?? Number.NEGATIVE_INFINITY, node.right?.maxOrder ?? Number.NEGATIVE_INFINITY);
}
function rotateTimestampCandidateLeft(root) {
	const next = root.right;
	if (!next) return root;
	root.right = next.left;
	next.left = root;
	updateTimestampCandidate(root);
	updateTimestampCandidate(next);
	return next;
}
function rotateTimestampCandidateRight(root) {
	const next = root.left;
	if (!next) return root;
	root.left = next.right;
	next.right = root;
	updateTimestampCandidate(root);
	updateTimestampCandidate(next);
	return next;
}
function balanceTimestampCandidate(root) {
	updateTimestampCandidate(root);
	const balance = timestampCandidateHeight(root.left) - timestampCandidateHeight(root.right);
	if (balance > 1) {
		if (root.left && timestampCandidateHeight(root.left.left) < timestampCandidateHeight(root.left.right)) root.left = rotateTimestampCandidateLeft(root.left);
		return rotateTimestampCandidateRight(root);
	}
	if (balance < -1) {
		if (root.right && timestampCandidateHeight(root.right.right) < timestampCandidateHeight(root.right.left)) root.right = rotateTimestampCandidateRight(root.right);
		return rotateTimestampCandidateLeft(root);
	}
	return root;
}
function insertTimestampCandidate(root, entry) {
	if (!root) return {
		entry,
		height: 1,
		minOrder: entry.order,
		maxOrder: entry.order
	};
	if (compareTimestampCandidates(entry, root.entry) < 0) root.left = insertTimestampCandidate(root.left, entry);
	else root.right = insertTimestampCandidate(root.right, entry);
	return balanceTimestampCandidate(root);
}
function removeTimestampCandidate(root, entry) {
	if (!root) return;
	const comparison = compareTimestampCandidates(entry, root.entry);
	if (comparison < 0) root.left = removeTimestampCandidate(root.left, entry);
	else if (comparison > 0) root.right = removeTimestampCandidate(root.right, entry);
	else if (!root.left || !root.right) return root.left ?? root.right;
	else {
		let successor = root.right;
		while (successor.left) successor = successor.left;
		root.entry = successor.entry;
		root.right = removeTimestampCandidate(root.right, successor.entry);
	}
	return balanceTimestampCandidate(root);
}
function findFirstTimestampCandidateInRange(root, minimumTimestamp, maximumTimestamp, minimumOrder, maximumOrder = Number.POSITIVE_INFINITY) {
	if (!root || root.maxOrder < minimumOrder || root.minOrder >= maximumOrder) return;
	const rootTimestamp = root.entry.timestamp ?? 0;
	let best = rootTimestamp >= minimumTimestamp && rootTimestamp <= maximumTimestamp && root.entry.order >= minimumOrder ? root.entry : void 0;
	const left = rootTimestamp >= minimumTimestamp ? root.left : void 0;
	const right = rootTimestamp <= maximumTimestamp ? root.right : void 0;
	const [first, second] = (left?.minOrder ?? Number.POSITIVE_INFINITY) <= (right?.minOrder ?? Number.POSITIVE_INFINITY) ? [left, right] : [right, left];
	for (const child of [first, second]) {
		const candidate = findFirstTimestampCandidateInRange(child, minimumTimestamp, maximumTimestamp, minimumOrder, best?.order ?? maximumOrder);
		if (candidate && (!best || candidate.order < best.order)) best = candidate;
	}
	return best;
}
function findMinimumOrderCursor(entries, startCursor, minimumOrder) {
	let cursor = startCursor;
	let end = entries.length;
	while (cursor < end) {
		const middle = Math.floor((cursor + end) / 2);
		const candidate = entries[middle];
		if (candidate && candidate.order < minimumOrder) cursor = middle + 1;
		else end = middle;
	}
	return cursor;
}
function findTimestampMatch(summary, timestamp, consumed, minimumOrder) {
	if (!summary) return;
	while (summary.missingTimestampCursor < summary.missingTimestamps.length) {
		const candidate = summary.missingTimestamps[summary.missingTimestampCursor];
		if (!candidate || !consumed.has(candidate)) break;
		summary.missingTimestampCursor += 1;
	}
	while (summary.timestampedOrderCursor < summary.timestampedByOrder.length) {
		const candidate = summary.timestampedByOrder[summary.timestampedOrderCursor];
		if (!candidate || !consumed.has(candidate)) break;
		summary.timestampedOrderCursor += 1;
	}
	if (timestamp === void 0) {
		let missingCursor = findMinimumOrderCursor(summary.missingTimestamps, summary.missingTimestampCursor, minimumOrder);
		let timestampedCursor = findMinimumOrderCursor(summary.timestampedByOrder, summary.timestampedOrderCursor, minimumOrder);
		while (missingCursor < summary.missingTimestamps.length) {
			const candidate = summary.missingTimestamps[missingCursor];
			if (candidate && candidate.order >= minimumOrder && !consumed.has(candidate)) break;
			missingCursor += 1;
		}
		while (timestampedCursor < summary.timestampedByOrder.length) {
			const candidate = summary.timestampedByOrder[timestampedCursor];
			if (candidate && candidate.order >= minimumOrder && !consumed.has(candidate)) break;
			timestampedCursor += 1;
		}
		const missing = summary.missingTimestamps[missingCursor];
		const timestamped = summary.timestampedByOrder[timestampedCursor];
		const candidate = missing && (!timestamped || missing.order < timestamped.order) ? missing : timestamped;
		if (!candidate) return;
		summary.missingTimestampCursor = missingCursor + (candidate === missing ? 1 : 0);
		summary.timestampedOrderCursor = timestampedCursor + (candidate === timestamped ? 1 : 0);
		return candidate;
	}
	let timestamped = findFirstTimestampCandidateInRange(summary.timestampRoot, timestamp - DEDUPE_TIMESTAMP_WINDOW_MS, timestamp + DEDUPE_TIMESTAMP_WINDOW_MS, minimumOrder);
	while (timestamped && consumed.has(timestamped)) {
		summary.timestampRoot = removeTimestampCandidate(summary.timestampRoot, timestamped);
		timestamped = findFirstTimestampCandidateInRange(summary.timestampRoot, timestamp - DEDUPE_TIMESTAMP_WINDOW_MS, timestamp + DEDUPE_TIMESTAMP_WINDOW_MS, minimumOrder);
	}
	if (timestamped) {
		while (summary.timestampedOrderCursor < summary.timestampedByOrder.length && (summary.timestampedByOrder[summary.timestampedOrderCursor]?.order ?? Number.POSITIVE_INFINITY) <= timestamped.order) {
			const skipped = summary.timestampedByOrder[summary.timestampedOrderCursor];
			if (skipped) summary.timestampRoot = removeTimestampCandidate(summary.timestampRoot, skipped);
			summary.timestampedOrderCursor += 1;
		}
		return timestamped;
	}
	let missingCursor = findMinimumOrderCursor(summary.missingTimestamps, summary.missingTimestampCursor, minimumOrder);
	while (missingCursor < summary.missingTimestamps.length) {
		const candidate = summary.missingTimestamps[missingCursor];
		if (candidate && candidate.order >= minimumOrder && !consumed.has(candidate)) {
			summary.missingTimestampCursor = missingCursor + 1;
			return candidate;
		}
		missingCursor += 1;
	}
}
function addRoleTextCandidate(index, entry) {
	if (!entry.role || !entry.text) return;
	let byText = index.get(entry.role);
	if (!byText) {
		byText = /* @__PURE__ */ new Map();
		index.set(entry.role, byText);
	}
	let summary = byText.get(entry.text);
	if (!summary) {
		summary = {
			missingTimestamps: [],
			missingTimestampCursor: 0,
			timestampedByOrder: [],
			timestampedOrderCursor: 0
		};
		byText.set(entry.text, summary);
	}
	addTimestampToSummary(summary, entry);
}
function findRoleTextCandidate(index, entry, consumed, minimumOrder) {
	if (!entry.role || !entry.text) return;
	return findTimestampMatch(index.get(entry.role)?.get(entry.text), entry.timestamp, consumed, minimumOrder);
}
function hasLocalImageMediaFacts(entry) {
	if (entry.role !== "user") return false;
	const message = asOptionalRecord(entry.message);
	return message ? (readPersistedMediaFacts(message) ?? []).some(isImageMediaFact) : false;
}
function projectImportedIdentity(localMessage, importedMessage) {
	const local = asOptionalRecord(localMessage);
	const imported = asOptionalRecord(importedMessage);
	const importedMeta = asOptionalRecord(imported?.["__openclaw"]);
	if (!local || !importedMeta) return localMessage;
	const localMeta = asOptionalRecord(local["__openclaw"]);
	const nextMeta = localMeta ? { ...localMeta } : {};
	let changed = false;
	for (const field of [
		"importedFrom",
		"externalId",
		"cliSessionId"
	]) {
		const value = normalizeOptionalString(importedMeta[field]);
		if (value && nextMeta[field] === void 0) {
			nextMeta[field] = value;
			changed = true;
		}
	}
	return changed ? {
		...local,
		__openclaw: nextMeta
	} : localMessage;
}
function compareHistoryMessages(a, b) {
	if (a.timestamp !== void 0 && b.timestamp !== void 0 && a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
	return a.order - b.order;
}
/** Merges imported CLI transcript messages into local history without duplicating overlaps. */
function mergeImportedChatHistoryMessages(params) {
	if (params.importedMessages.length === 0) return params.localMessages;
	const merged = params.localMessages.map((message, order) => prepareComparableMessage(message, order, resolveImportedExternalIdentityKey(message)));
	const exactExternalIdentityIndex = /* @__PURE__ */ new Map();
	const allMessageRoleTextIndex = /* @__PURE__ */ new Map();
	const identitylessRoleTextIndex = /* @__PURE__ */ new Map();
	const roleTextMinimumOrder = /* @__PURE__ */ new Map();
	const localImageMediaCandidates = /* @__PURE__ */ new Map();
	const consumedLocalCandidates = /* @__PURE__ */ new Set();
	const advanceRoleTextMinimumOrder = (entry, matched) => {
		if (!entry.role) return;
		const matchedText = matched.text === entry.text ? entry.text : entry.driftNoteText;
		for (const text of [entry.text, matchedText]) {
			if (!text) continue;
			let byText = roleTextMinimumOrder.get(entry.role);
			if (!byText) {
				byText = /* @__PURE__ */ new Map();
				roleTextMinimumOrder.set(entry.role, byText);
			}
			byText.set(text, Math.max(byText.get(text) ?? 0, matched.order + 1));
		}
	};
	const indexEntry = (entry) => {
		if (entry.externalIdentityKey) exactExternalIdentityIndex.set(entry.externalIdentityKey, entry);
		else addRoleTextCandidate(identitylessRoleTextIndex, entry);
		addRoleTextCandidate(allMessageRoleTextIndex, entry);
	};
	for (const entry of merged) {
		indexEntry(entry);
		if (!hasLocalImageMediaFacts(entry)) continue;
		const localMeta = asOptionalRecord(asOptionalRecord(entry.message)?.["__openclaw"]);
		const localEntryId = normalizeOptionalString(localMeta?.id);
		const turnKey = localEntryId ? hashCliImageTurnEntryId(localEntryId) : entry.cliImageTurnKey;
		if (turnKey) {
			const candidates = localImageMediaCandidates.get(turnKey) ?? {
				entries: [],
				cursor: 0
			};
			candidates.entries.push(entry);
			localImageMediaCandidates.set(turnKey, candidates);
		}
	}
	for (const message of params.importedMessages) {
		const externalIdentityKey = resolveImportedExternalIdentityKey(message);
		const exactIdentityMatch = externalIdentityKey ? exactExternalIdentityIndex.get(externalIdentityKey) : void 0;
		if (exactIdentityMatch) consumedLocalCandidates.add(exactIdentityMatch);
	}
	let changed = false;
	let expanded = false;
	let nextOrder = merged.length;
	for (const message of params.importedMessages) {
		const externalIdentityKey = resolveImportedExternalIdentityKey(message);
		const imported = prepareComparableMessage(message, nextOrder, externalIdentityKey);
		if (externalIdentityKey) {
			const exactIdentityMatch = exactExternalIdentityIndex.get(externalIdentityKey);
			if (exactIdentityMatch) {
				consumedLocalCandidates.add(exactIdentityMatch);
				advanceRoleTextMinimumOrder(imported, exactIdentityMatch);
				continue;
			}
		}
		const turnKey = imported.hasCliImageMentions ? imported.cliImageTurnKey : void 0;
		const imageCandidates = turnKey ? localImageMediaCandidates.get(turnKey) : void 0;
		let imageDuplicate;
		if (imageCandidates) {
			imageDuplicate = imageCandidates.entries[imageCandidates.cursor];
			while (imageDuplicate && consumedLocalCandidates.has(imageDuplicate)) {
				imageCandidates.cursor += 1;
				imageDuplicate = imageCandidates.entries[imageCandidates.cursor];
			}
			if (imageDuplicate) imageCandidates.cursor += 1;
		}
		if (imageDuplicate) {
			const projected = projectImportedIdentity(imageDuplicate.message, imported.message);
			if (projected !== imageDuplicate.message) {
				imageDuplicate.message = projected;
				imageDuplicate.externalIdentityKey = resolveImportedExternalIdentityKey(projected);
				if (imageDuplicate.externalIdentityKey) exactExternalIdentityIndex.set(imageDuplicate.externalIdentityKey, imageDuplicate);
				changed = true;
			}
			consumedLocalCandidates.add(imageDuplicate);
			advanceRoleTextMinimumOrder(imported, imageDuplicate);
			continue;
		}
		let duplicate;
		if (!imported.hasCliImageMentions) {
			const index = imported.externalIdentityKey ? identitylessRoleTextIndex : allMessageRoleTextIndex;
			const byText = imported.role ? roleTextMinimumOrder.get(imported.role) : void 0;
			const importedMinimumOrder = imported.text ? byText?.get(imported.text) ?? 0 : 0;
			for (const text of [imported.text, imported.driftNoteText]) {
				if (!imported.role || !text) continue;
				const minimumOrder = Math.max(importedMinimumOrder, byText?.get(text) ?? 0);
				duplicate = findRoleTextCandidate(index, {
					...imported,
					text
				}, consumedLocalCandidates, minimumOrder);
				if (duplicate) break;
			}
		}
		if (duplicate) {
			const projected = projectImportedIdentity(duplicate.message, imported.message);
			if (projected !== duplicate.message) {
				duplicate.message = projected;
				duplicate.externalIdentityKey = resolveImportedExternalIdentityKey(projected);
				if (duplicate.externalIdentityKey) exactExternalIdentityIndex.set(duplicate.externalIdentityKey, duplicate);
				changed = true;
			}
			consumedLocalCandidates.add(duplicate);
			advanceRoleTextMinimumOrder(imported, duplicate);
			continue;
		}
		merged.push(imported);
		indexEntry(imported);
		consumedLocalCandidates.add(imported);
		nextOrder += 1;
		changed = true;
		expanded = true;
	}
	if (!changed) return params.localMessages;
	if (!expanded) return merged.map((entry) => entry.message);
	merged.sort(compareHistoryMessages);
	return merged.map((entry) => entry.message);
}
//#endregion
//#region src/gateway/cli-session-history.ts
const ANTHROPIC_PROVIDER = "anthropic";
function resolveEligibleCliSessionBinding(params) {
	const binding = getCliSessionBinding(params.entry, CLAUDE_CLI_PROVIDER);
	const provider = normalizeProviderId(params.provider ?? "");
	const eligible = !provider || params.localMessages.length === 0 || provider === "claude-cli" || provider === ANTHROPIC_PROVIDER;
	return binding?.sessionId && eligible ? binding : void 0;
}
/** Resolves chat history plus whether a bound external transcript was actually incorporated. */
function resolveChatHistoryWithCliSessionImports(params) {
	const binding = resolveEligibleCliSessionBinding(params);
	if (!binding) return {
		messages: params.localMessages,
		imported: false,
		expanded: false
	};
	const importedMessages = params.preparedImportedMessages ?? readClaudeCliSessionMessages({
		cliSessionId: binding.sessionId,
		homeDir: params.homeDir,
		localSessionId: params.entry?.sessionId,
		reseedReceipt: binding.reseedReceipt
	});
	if (importedMessages.length === 0) return {
		messages: params.localMessages,
		imported: false,
		expanded: false
	};
	const messages = mergeImportedChatHistoryMessages({
		localMessages: params.localMessages,
		importedMessages
	});
	return messages === params.localMessages ? {
		messages,
		imported: false,
		expanded: false
	} : {
		messages,
		imported: true,
		expanded: messages.length > params.localMessages.length
	};
}
/** Acquires one request-local redacted view of the process-owned external snapshot. */
async function readChatHistoryCliSessionImportSnapshot(params) {
	const binding = resolveEligibleCliSessionBinding(params);
	return binding?.sessionId ? await readClaudeCliSessionMessagesAsync({
		cliSessionId: binding.sessionId,
		homeDir: params.homeDir,
		localSessionId: params.entry?.sessionId,
		reseedReceipt: binding.reseedReceipt
	}) : [];
}
//#endregion
export { resolveChatHistoryWithCliSessionImports as n, readChatHistoryCliSessionImportSnapshot as t };
