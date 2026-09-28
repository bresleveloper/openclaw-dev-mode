import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { i as estimateTokensFromChars, n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { i as deriveSessionTotalTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { t as streamSessionTranscriptLines } from "./transcript-stream-BZUMfFhx.mjs";
import "./session-transcript-files.fs-_FnqN2Le.mjs";
import { n as findExistingTranscriptPath, r as isOversizedTranscriptLine } from "./session-transcript-archive-reader-DWPfUfwT.mjs";
import fs from "node:fs";
//#region src/gateway/session-transcript-derived-readers.ts
function extractTranscriptUsageSnapshot(message, source) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	if (source === "artifact" && typeof record.role === "string" && record.role !== "assistant") return null;
	const usageRaw = record.usage && typeof record.usage === "object" && !Array.isArray(record.usage) ? record.usage : void 0;
	const usage = normalizeUsage(usageRaw);
	const normalizedUsage = usage ?? {};
	const legacyCliUsage = (source === "artifact" && typeof record.api === "string" ? record.api.trim() : record.api) === "cli" && usageRaw && usageRaw.contextUsage === void 0;
	const derivedTotalTokens = legacyCliUsage ? void 0 : deriveSessionTotalTokens({ usage });
	const totalTokens = source === "artifact" ? asPositiveFiniteNumber(derivedTotalTokens) : derivedTotalTokens;
	const modelProvider = typeof record.provider === "string" ? record.provider.trim() : void 0;
	const model = typeof record.model === "string" ? record.model.trim() : void 0;
	const costUsd = source === "artifact" ? asNonNegativeFiniteNumber(usageRaw?.cost?.total) : typeof usageRaw?.cost?.total === "number" && Number.isFinite(usageRaw.cost.total) ? usageRaw.cost.total : usageRaw?.costUsd;
	const hasMeaningfulUsage = hasNonzeroUsage(usage) || typeof totalTokens === "number" || typeof costUsd === "number" && Number.isFinite(costUsd) && (source === "artifact" || costUsd > 0);
	const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
	if (!hasMeaningfulUsage && !modelProvider && !model) return null;
	if (isDeliveryMirror && !hasMeaningfulUsage) return null;
	return {
		...!isDeliveryMirror && modelProvider ? { modelProvider } : {},
		...!isDeliveryMirror && model ? { model } : {},
		...typeof normalizedUsage.input === "number" ? { inputTokens: normalizedUsage.input } : {},
		...typeof normalizedUsage.output === "number" ? { outputTokens: normalizedUsage.output } : {},
		...typeof normalizedUsage.cacheRead === "number" ? { cacheRead: normalizedUsage.cacheRead } : {},
		...typeof normalizedUsage.cacheWrite === "number" ? { cacheWrite: normalizedUsage.cacheWrite } : {},
		...legacyCliUsage ? { contextUsage: { state: "unavailable" } } : normalizedUsage.contextUsage ? { contextUsage: normalizedUsage.contextUsage } : {},
		...typeof totalTokens === "number" ? {
			totalTokens,
			totalTokensFresh: true
		} : {},
		...typeof costUsd === "number" && Number.isFinite(costUsd) ? { costUsd } : {}
	};
}
function estimateTranscriptMessageChars(message) {
	if (!isRecord(message)) return 0;
	const content = message.content;
	if (typeof content === "string") return content.trim() ? estimateStringChars(content.trim()) : 0;
	if (!Array.isArray(content)) return 0;
	return content.reduce((total, part) => {
		if (!isRecord(part)) return total;
		const { text, type } = part;
		if (typeof text !== "string" || typeof type === "string" && type !== "text" && type !== "output_text" && type !== "input_text") return total;
		const normalized = text.trim();
		return normalized ? total + estimateStringChars(normalized) : total;
	}, 0);
}
function createSessionTranscriptUsageAccumulator(source = "sqlite") {
	const aggregate = {};
	let sawUsage = false;
	let inputTokens = 0;
	let outputTokens = 0;
	let cacheRead = 0;
	let cacheWrite = 0;
	let costUsd = 0;
	let sawInput = false;
	let sawOutput = false;
	let sawCacheRead = false;
	let sawCacheWrite = false;
	let sawCost = false;
	let estimatedTranscriptChars = 0;
	let sawEstimateModelIdentity = false;
	const add = (message) => {
		if (source === "artifact" && isRecord(message)) {
			const provider = typeof message.provider === "string" ? message.provider.trim() : void 0;
			const model = typeof message.model === "string" ? message.model.trim() : void 0;
			if ((message.role === "user" || message.role === "assistant") && !(message.role === "assistant" && provider === "openclaw" && model === "delivery-mirror")) {
				const estimatedChars = estimateTranscriptMessageChars(message);
				estimatedTranscriptChars += estimatedChars;
				sawEstimateModelIdentity ||= message.role === "assistant" && estimatedChars > 0 && Boolean(provider || model);
			}
		}
		const snapshot = extractTranscriptUsageSnapshot(message, source);
		if (!snapshot) return;
		sawUsage = true;
		if (snapshot.modelProvider) aggregate.modelProvider = snapshot.modelProvider;
		if (snapshot.model) aggregate.model = snapshot.model;
		if (typeof snapshot.inputTokens === "number") {
			inputTokens += snapshot.inputTokens;
			sawInput = true;
		}
		if (typeof snapshot.outputTokens === "number") {
			outputTokens += snapshot.outputTokens;
			sawOutput = true;
		}
		if (typeof snapshot.cacheRead === "number") {
			cacheRead += snapshot.cacheRead;
			sawCacheRead = true;
		}
		if (typeof snapshot.cacheWrite === "number") {
			cacheWrite += snapshot.cacheWrite;
			sawCacheWrite = true;
		}
		if (snapshot.contextUsage) aggregate.contextUsage = snapshot.contextUsage;
		else if (typeof snapshot.totalTokens === "number") delete aggregate.contextUsage;
		if (snapshot.contextUsage?.state === "unavailable") {
			delete aggregate.totalTokens;
			delete aggregate.totalTokensFresh;
		} else if (typeof snapshot.totalTokens === "number") {
			aggregate.totalTokens = snapshot.totalTokens;
			aggregate.totalTokensFresh = true;
		}
		if (typeof snapshot.costUsd === "number") {
			costUsd += snapshot.costUsd;
			sawCost = true;
		}
	};
	const finish = () => {
		if (!sawUsage) return null;
		if (sawInput) aggregate.inputTokens = inputTokens;
		if (sawOutput) aggregate.outputTokens = outputTokens;
		if (sawCacheRead) aggregate.cacheRead = cacheRead;
		if (sawCacheWrite) aggregate.cacheWrite = cacheWrite;
		if (sawCost) aggregate.costUsd = costUsd;
		if (source === "artifact" && typeof aggregate.totalTokens !== "number" && aggregate.contextUsage?.state !== "unavailable" && estimatedTranscriptChars > 0 && sawEstimateModelIdentity) {
			const estimatedTotalTokens = estimateTokensFromChars(estimatedTranscriptChars);
			if (estimatedTotalTokens > 0) {
				aggregate.totalTokens = estimatedTotalTokens;
				aggregate.totalTokensFresh = true;
			}
		}
		return aggregate;
	};
	return {
		add,
		finish
	};
}
function aggregateSessionTranscriptUsage(messages, source = "sqlite") {
	const usage = createSessionTranscriptUsageAccumulator(source);
	for (const message of messages) usage.add(message);
	return usage.finish();
}
//#endregion
//#region src/gateway/session-utils.fs.ts
function capArrayByJsonBytes(items, maxBytes, byteLength = jsonUtf8Bytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map(byteLength);
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= expectDefined(parts[start], "parts entry at start") + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
async function readLatestSessionUsageFromTranscriptFileAsync(sessionId, storePath, sessionFile, agentId) {
	const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
	if (!filePath) return null;
	try {
		if ((await fs.promises.stat(filePath)).size === 0) return null;
		const usageAccumulator = createSessionTranscriptUsageAccumulator("artifact");
		for await (const line of streamSessionTranscriptLines(filePath)) {
			if (isOversizedTranscriptLine(line)) continue;
			let normalizedMessage;
			try {
				const record = JSON.parse(line);
				if (!record.message || typeof record.message !== "object" || Array.isArray(record.message)) continue;
				const message = record.message;
				const usage = message.usage && typeof message.usage === "object" && !Array.isArray(message.usage) ? message.usage : record.usage;
				normalizedMessage = {
					...message,
					...typeof message.provider !== "string" && typeof record.provider === "string" ? { provider: record.provider } : {},
					...typeof message.model !== "string" && typeof record.model === "string" ? { model: record.model } : {},
					...usage && typeof usage === "object" && !Array.isArray(usage) ? { usage } : {}
				};
			} catch {
				continue;
			}
			usageAccumulator.add(normalizedMessage);
		}
		return usageAccumulator.finish();
	} catch {
		return null;
	}
}
//#endregion
export { createSessionTranscriptUsageAccumulator as i, readLatestSessionUsageFromTranscriptFileAsync as n, aggregateSessionTranscriptUsage as r, capArrayByJsonBytes as t };
