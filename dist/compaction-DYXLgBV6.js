import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { t as toErrorObject } from "./error-coercion-DgxlWC0n.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { n as isAbortError } from "./abort-signal-BWW6Tk6w.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import "./defaults-mDjiWzE5.js";
import { gt as generateSummary$1 } from "./sessions-CZQw0uF9.js";
import { a as buildStageSplitPlan, i as buildOversizedFallbackPlan, l as sanitizeCompactionMessages, o as buildSummaryChunks, r as buildHistoryPrunePlan, s as computeAdaptiveChunkRatio } from "./compaction-planning-BpV11_gP.js";
import { n as retryAsync } from "./retry-Cyk4Y2-A.js";
import { l as isTimeoutError } from "./failover-error-B2zFYEnG.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/agents/compaction-planning-worker.ts
/**
* Runs CPU-heavy compaction planning in a worker thread when histories are
* large enough to risk starving the main event loop.
*/
const COMPACTION_PLANNING_WORKER_TIMEOUT_MS = 6e4;
const COMPACTION_PLANNING_WORKER_MIN_MESSAGES = 64;
var CompactionPlanningWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "CompactionPlanningWorkerError";
	}
};
function resolveCompactionPlanningWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "agents", "compaction-planning.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./compaction-planning.worker${extension}`, currentModuleUrl);
}
function runCompactionPlanningWorker(params) {
	if (params.signal?.aborted) return Promise.reject(toErrorObject(params.signal.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"), "Non-Error rejection"));
	const workerUrl = params.workerUrl ?? resolveCompactionPlanningWorkerUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: params.input,
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return Promise.reject(new CompactionPlanningWorkerError(error instanceof Error ? error.message : String(error), "unavailable"));
	}
	worker.unref?.();
	return new Promise((resolve, reject) => {
		let settled = false;
		const timeout = setTimeout(() => {
			settle(() => reject(new CompactionPlanningWorkerError("compaction planning worker timed out", "timeout")), true);
		}, resolveTimerTimeoutMs(params.timeoutMs, COMPACTION_PLANNING_WORKER_TIMEOUT_MS));
		const abort = () => {
			settle(() => reject(toErrorObject(params.signal?.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"), "Non-Error rejection")), true);
		};
		const settle = (finish, terminate) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", abort);
			worker.removeAllListeners();
			if (terminate) worker.terminate();
			finish();
		};
		params.signal?.addEventListener("abort", abort, { once: true });
		worker.once("message", (message) => {
			settle(() => {
				if (message.status === "ok") {
					resolve(message.value);
					return;
				}
				reject(new CompactionPlanningWorkerError(message.error, "failed"));
			}, false);
		});
		worker.once("error", (error) => {
			const message = error instanceof Error ? error.message : String(error);
			settle(() => reject(new CompactionPlanningWorkerError(message, "unavailable")), true);
		});
		worker.once("exit", (code) => {
			if (code === 0) return;
			settle(() => reject(new CompactionPlanningWorkerError(`compaction planning worker exited with code ${code}`, "unavailable")), false);
		});
	});
}
function shouldFallbackToMainThread(error) {
	return error instanceof CompactionPlanningWorkerError && error.code === "unavailable";
}
function shouldUsePlanningWorker(messageCount) {
	return messageCount >= COMPACTION_PLANNING_WORKER_MIN_MESSAGES;
}
async function runWithUnavailableFallback(params) {
	try {
		const value = await runCompactionPlanningWorker({
			input: params.input,
			signal: params.signal
		});
		if (params.isExpected(value)) return value;
		throw new CompactionPlanningWorkerError("unexpected compaction planning worker result", "failed");
	} catch (error) {
		if (shouldFallbackToMainThread(error)) return params.fallback();
		throw error;
	}
}
/** Builds summary chunks, offloading large histories to the planning worker. */
async function buildSummaryChunksWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildSummaryChunks(params);
	return (await runWithUnavailableFallback({
		input: {
			kind: "summaryChunks",
			messages,
			maxChunkTokens: params.maxChunkTokens
		},
		signal: params.signal,
		fallback: () => ({
			kind: "summaryChunks",
			chunks: buildSummaryChunks(params)
		}),
		isExpected: (valueCandidate) => valueCandidate.kind === "summaryChunks"
	})).chunks;
}
/** Builds an oversized-message fallback plan, using the worker when worthwhile. */
async function buildOversizedFallbackPlanWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildOversizedFallbackPlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "oversizedFallback",
			messages,
			contextWindow: params.contextWindow
		},
		signal: params.signal,
		fallback: () => ({
			kind: "oversizedFallback",
			...buildOversizedFallbackPlan(params)
		}),
		isExpected: (valueEntry) => valueEntry.kind === "oversizedFallback"
	});
	return {
		smallMessages: value.smallMessages,
		oversizedNotes: value.oversizedNotes
	};
}
/** Builds a staged summarization split plan with worker fallback. */
async function buildStageSplitPlanWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildStageSplitPlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "stageSplit",
			messages,
			maxChunkTokens: params.maxChunkTokens,
			parts: params.parts,
			minMessagesForSplit: params.minMessagesForSplit
		},
		signal: params.signal,
		fallback: () => ({
			kind: "stageSplit",
			...buildStageSplitPlan(params)
		}),
		isExpected: (valueResult) => valueResult.kind === "stageSplit"
	});
	return value.mode === "split" ? {
		mode: "split",
		chunks: value.chunks
	} : { mode: "single" };
}
/** Builds a history-pruning plan with worker fallback for large transcripts. */
async function buildHistoryPrunePlanWithWorker(params) {
	const messagesToSummarize = sanitizeCompactionMessages(params.messagesToSummarize);
	const turnPrefixMessages = sanitizeCompactionMessages(params.turnPrefixMessages);
	if (!shouldUsePlanningWorker(messagesToSummarize.length + turnPrefixMessages.length)) return buildHistoryPrunePlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "historyPrune",
			messagesToSummarize,
			turnPrefixMessages,
			tokensBefore: params.tokensBefore,
			contextWindowTokens: params.contextWindowTokens,
			maxHistoryShare: params.maxHistoryShare,
			parts: params.parts
		},
		signal: params.signal,
		fallback: () => ({
			kind: "historyPrune",
			...buildHistoryPrunePlan(params)
		}),
		isExpected: (valueValue) => valueValue.kind === "historyPrune"
	});
	return {
		summarizableTokens: value.summarizableTokens,
		newContentTokens: value.newContentTokens,
		maxHistoryTokens: value.maxHistoryTokens,
		pruned: value.pruned
	};
}
/** Computes the adaptive compaction chunk ratio with worker fallback. */
async function computeAdaptiveChunkRatioWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return computeAdaptiveChunkRatio(params.messages, params.contextWindow);
	return (await runWithUnavailableFallback({
		input: {
			kind: "adaptiveChunkRatio",
			messages,
			contextWindow: params.contextWindow
		},
		signal: params.signal,
		fallback: () => ({
			kind: "adaptiveChunkRatio",
			ratio: computeAdaptiveChunkRatio(params.messages, params.contextWindow)
		}),
		isExpected: (valueLocal) => valueLocal.kind === "adaptiveChunkRatio"
	})).ratio;
}
//#endregion
//#region src/agents/compaction.ts
const log = createSubsystemLogger("compaction");
const DEFAULT_SUMMARY_FALLBACK = "No prior history.";
const MERGE_SUMMARIES_INSTRUCTIONS = [
	"Merge these partial summaries into a single cohesive summary.",
	"",
	"MUST PRESERVE:",
	"- Active tasks and their current status (in-progress, blocked, pending)",
	"- Batch operation progress (e.g., '5/17 items completed')",
	"- The last thing the user requested and what was being done about it",
	"- Decisions made and their rationale",
	"- TODOs, open questions, and constraints",
	"- Any commitments or follow-ups promised",
	"",
	"PRIORITIZE recent context over older history. The agent needs to know",
	"what it was doing, not just what was discussed."
].join("\n");
const IDENTIFIER_PRESERVATION_INSTRUCTIONS = "Preserve all opaque identifiers exactly as written (no shortening or reconstruction), including UUIDs, hashes, IDs, hostnames, IPs, ports, URLs, and file names.";
const generateSummaryCompat = generateSummary$1;
function resolveIdentifierPreservationInstructions(instructions) {
	const policy = instructions?.identifierPolicy ?? "strict";
	if (policy === "off") return;
	if (policy === "custom") {
		const custom = instructions?.identifierInstructions?.trim();
		return custom && custom.length > 0 ? custom : IDENTIFIER_PRESERVATION_INSTRUCTIONS;
	}
	return IDENTIFIER_PRESERVATION_INSTRUCTIONS;
}
/** Combines identifier-preservation and caller-provided compaction instructions. */
function buildCompactionSummarizationInstructions(customInstructions, instructions) {
	const custom = customInstructions?.trim();
	const identifierPreservation = resolveIdentifierPreservationInstructions(instructions);
	if (!identifierPreservation && !custom) return;
	if (!custom) return identifierPreservation;
	if (!identifierPreservation) return `Additional focus:\n${custom}`;
	return `${identifierPreservation}\n\nAdditional focus:\n${custom}`;
}
async function summarizeChunks(params) {
	if (params.messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const chunks = await buildSummaryChunksWithWorker({
		messages: params.messages,
		maxChunkTokens: params.maxChunkTokens,
		signal: params.signal
	});
	let summary = params.previousSummary;
	const effectiveInstructions = buildCompactionSummarizationInstructions(params.customInstructions, params.summarizationInstructions);
	let hasGeneratedChunk = false;
	for (const chunk of chunks) try {
		summary = await retryAsync(() => generateSummary(chunk, params.model, params.reserveTokens, params.apiKey, params.headers, params.signal, effectiveInstructions, summary), {
			attempts: 3,
			minDelayMs: 500,
			maxDelayMs: 5e3,
			jitter: .2,
			label: "compaction/generateSummary",
			shouldRetry: (err) => {
				if (params.signal.aborted) return false;
				if (!isAbortError(err) && isTimeoutError(err)) return false;
				return true;
			}
		});
		hasGeneratedChunk = true;
	} catch (err) {
		if (params.signal.aborted) throw err;
		if (!isAbortError(err) && isTimeoutError(err)) throw err;
		if (!hasGeneratedChunk) throw err;
		const completedChunks = chunks.indexOf(chunk);
		log.warn("chunk summarization failed after retries; partial summary available", {
			err,
			completedChunks,
			totalChunks: chunks.length
		});
		const partial = /* @__PURE__ */ new Error("partial summarization failure");
		partial.partialSummary = `${summary}\n\n[Partial summary: chunks 1-${completedChunks} of ${chunks.length} were summarized. Chunks ${completedChunks + 1}-${chunks.length} could not be processed.]`;
		throw partial;
	}
	return summary ?? DEFAULT_SUMMARY_FALLBACK;
}
function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary) {
	if (generateSummary$1.length >= 8) return generateSummaryCompat(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary);
	return generateSummaryCompat(currentMessages, model, reserveTokens, apiKey, signal, customInstructions, previousSummary);
}
/**
* Summarize with progressive fallback for handling oversized messages.
* If full summarization fails, tries partial summarization excluding oversized messages.
*/
async function summarizeWithFallback(params) {
	const { messages, contextWindow } = params;
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	let partialSummaryFallback;
	try {
		return await summarizeChunks(params);
	} catch (fullError) {
		if (params.signal.aborted) throw fullError;
		log.warn(`Full summarization failed: ${formatErrorMessage(fullError)}`);
		partialSummaryFallback = fullError.partialSummary;
	}
	const { smallMessages, oversizedNotes } = await buildOversizedFallbackPlanWithWorker({
		messages,
		contextWindow,
		signal: params.signal
	});
	if (smallMessages.length > 0 && smallMessages.length !== messages.length) try {
		return await summarizeChunks({
			...params,
			messages: smallMessages
		}) + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "");
	} catch (partialError) {
		if (params.signal.aborted) throw partialError;
		log.warn(`Partial summarization also failed: ${formatErrorMessage(partialError)}`);
		const retryPartial = partialError.partialSummary;
		if (retryPartial) partialSummaryFallback = retryPartial + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "");
	}
	if (partialSummaryFallback) return partialSummaryFallback;
	return `Context contained ${messages.length} messages (${oversizedNotes.length} oversized). Summary unavailable due to size limits.`;
}
/** Extracts a compact timestamp range from a chunk of messages for merge metadata. */
function extractChunkTimeRange(chunk) {
	let earliest;
	let latest;
	for (const message of chunk) {
		const timestamp = message.timestamp;
		if (typeof timestamp !== "number" || timestamp <= 0 || !Number.isFinite(new Date(timestamp).getTime())) continue;
		earliest = earliest === void 0 ? timestamp : Math.min(earliest, timestamp);
		latest = latest === void 0 ? timestamp : Math.max(latest, timestamp);
	}
	if (earliest === void 0 || latest === void 0) return "";
	const format = (timestamp) => new Date(timestamp).toISOString().replace("T", " ").slice(0, 16);
	return ` [${earliest === latest ? format(earliest) : `${format(earliest)} — ${format(latest)}`} UTC]`;
}
/** Summarizes history in multiple stages when a single pass would be too large. */
async function summarizeInStages(params) {
	const { messages } = params;
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const plan = await buildStageSplitPlanWithWorker({
		messages,
		maxChunkTokens: params.maxChunkTokens,
		parts: params.parts,
		minMessagesForSplit: params.minMessagesForSplit,
		signal: params.signal
	});
	if (plan.mode === "single") return summarizeWithFallback(params);
	const partialSummaries = [];
	for (const chunk of plan.chunks) partialSummaries.push(await summarizeWithFallback({
		...params,
		messages: chunk,
		previousSummary: void 0
	}));
	if (partialSummaries.length === 1) return partialSummaries[0];
	const now = Date.now();
	const summaryMessages = partialSummaries.map((summary, index) => {
		const chunk = plan.chunks[index];
		const timeRange = extractChunkTimeRange(chunk);
		return {
			role: "user",
			content: `${index === 0 ? `[Chunk 1 — oldest messages${timeRange}]` : index === partialSummaries.length - 1 ? `[Chunk ${partialSummaries.length} — most recent messages${timeRange}]` : `[Chunk ${index + 1}/${partialSummaries.length}${timeRange}]`}\n${summary}`,
			timestamp: now - (partialSummaries.length - 1 - index)
		};
	});
	const custom = params.customInstructions?.trim();
	const mergeInstructions = custom ? `${MERGE_SUMMARIES_INSTRUCTIONS}\n\n${custom}` : MERGE_SUMMARIES_INSTRUCTIONS;
	return summarizeWithFallback({
		...params,
		messages: summaryMessages,
		customInstructions: mergeInstructions
	});
}
/** Resolves a positive context-window token count from model metadata. */
function resolveContextWindowTokens(model) {
	const effective = model?.contextTokens ?? model?.contextWindow;
	return Math.max(1, Math.floor(effective ?? 2e5));
}
//#endregion
export { computeAdaptiveChunkRatioWithWorker as i, summarizeInStages as n, buildHistoryPrunePlanWithWorker as r, resolveContextWindowTokens as t };
