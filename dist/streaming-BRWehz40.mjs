import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-CXyAxVII.mjs";
import { r as readCompletedFileMutationDelta, t as resolveFileMutationToolName } from "./tool-mutation-names-DHZ5dIYE.mjs";
import { a as isShellToolDisplayName, i as isCommandBearingToolCall, o as resolveToolDisplay, t as formatToolDetail } from "./tool-display-DjrvDE8J.mjs";
import { n as formatToolAggregateParts, t as formatToolAggregate } from "./tool-meta-Cg9Nif2y.mjs";
import { t as compactProgressText } from "./text-truncate-DrDnz8rI.mjs";
import { t as getChannelStreamingConfigObject } from "./streaming-config-readers-BJ5HPFJK.mjs";
//#region src/shared/progress-labels.ts
const DEFAULT_PROGRESS_DRAFT_LABELS = ["Working"];
function hashProgressSeed(seed) {
	let hash = 2166136261;
	for (let index = 0; index < seed.length; index += 1) {
		hash ^= seed.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}
function selectProgressLabel(params) {
	const labels = params.labels ?? DEFAULT_PROGRESS_DRAFT_LABELS;
	if (labels.length === 0) return;
	return labels[typeof params.seed === "string" && params.seed.length > 0 ? hashProgressSeed(params.seed) % labels.length : Math.floor(Math.max(0, Math.min(.999999, params.random?.() ?? 0)) * labels.length)] ?? labels[0];
}
//#endregion
//#region src/shared/text/escape-markdown.ts
/** Encodes prepared text as literal CommonMark, including URL and HTML punctuation. */
function escapeMarkdownText(text) {
	return text.replace(/[!-/:-@[-`{-~]/g, "\\$&");
}
//#endregion
//#region src/channels/progress-draft-diffstat.ts
const MAX_TRACKED_MUTATION_FILES = 256;
const MAX_PENDING_MUTATION_DIFFS = 64;
function formatChannelProgressDraftDiffStat(diffStat) {
	if (!diffStat || diffStat.files === 0 && diffStat.added === 0 && diffStat.removed === 0) return;
	return [
		`📝 ${diffStat.files} files`,
		...diffStat.added > 0 ? [`+${diffStat.added}`] : [],
		...diffStat.removed > 0 ? [`−${diffStat.removed}`] : []
	].join(" ");
}
function createProgressDraftDiffStatTracker(params) {
	let hasCommittedDiff = false;
	let mutationFiles = /* @__PURE__ */ new Set();
	let mutationOverflowFiles = 0;
	let mutationAdded = 0;
	let mutationRemoved = 0;
	let pendingMutationDiffs = /* @__PURE__ */ new Map();
	const reset = () => {
		hasCommittedDiff = false;
		mutationFiles = /* @__PURE__ */ new Set();
		mutationOverflowFiles = 0;
		mutationAdded = 0;
		mutationRemoved = 0;
		pendingMutationDiffs = /* @__PURE__ */ new Map();
	};
	const stageToolEvent = (payload) => {
		if (!params.canStage()) return;
		const toolCallId = payload.toolCallId?.trim();
		if (payload.phase !== "start" || !toolCallId || !payload.name || !payload.args) return;
		const kind = resolveFileMutationToolName(payload.name);
		const delta = kind ? readCompletedFileMutationDelta(kind, payload.args) : void 0;
		if (!delta) return;
		if (!pendingMutationDiffs.has(toolCallId) && pendingMutationDiffs.size >= MAX_PENDING_MUTATION_DIFFS) return;
		pendingMutationDiffs.set(toolCallId, delta);
	};
	const commitItemEvent = (payload) => {
		const toolCallId = payload.toolCallId?.trim();
		if (!toolCallId || payload.phase !== "end") return;
		const delta = pendingMutationDiffs.get(toolCallId);
		if (!delta) return;
		pendingMutationDiffs.delete(toolCallId);
		if (payload.status?.trim().toLowerCase() !== "completed") return;
		hasCommittedDiff = true;
		mutationAdded += delta.added;
		mutationRemoved += delta.removed;
		for (const file of delta.files) {
			if (mutationFiles.has(file)) continue;
			if (mutationFiles.size < MAX_TRACKED_MUTATION_FILES) {
				mutationFiles.add(file);
				continue;
			}
			mutationOverflowFiles += 1;
		}
	};
	const resolve = () => hasCommittedDiff ? {
		files: mutationFiles.size + mutationOverflowFiles,
		added: mutationAdded,
		removed: mutationRemoved
	} : void 0;
	return {
		stageToolEvent,
		commitItemEvent,
		resolve,
		reset
	};
}
//#endregion
//#region src/channels/progress-draft-lines.ts
/**
* Removes a keyed structured progress line while preserving plain text draft lines.
* Returns the original array when no line is removed so renderers can use identity as a no-op signal.
*/
function removeChannelProgressDraftLine(lines, id) {
	const lineId = id.trim();
	if (!lineId) return lines;
	const next = lines.filter((line) => typeof line !== "object" || line.id?.trim() !== lineId);
	return next.length === lines.length ? lines : next;
}
/** Approvals and failures that can start a draft when their rows are visible. */
function isChannelProgressAttentionLine(line) {
	if (typeof line === "string") return false;
	const status = line.status?.toLowerCase();
	return line.kind === "approval" || status === "failed" || status === "error" || status === "blocked" || status?.startsWith("exit ") === true && status !== "exit 0";
}
function getProgressDraftLineText(line) {
	if (typeof line === "string") return line;
	const icon = line.icon?.trim();
	const prefix = icon ? `${icon} ` : "";
	const label = line.label.trim();
	const detail = line.detail?.trim();
	const status = line.status?.trim();
	const displayStatus = status === "completed" ? void 0 : status;
	if (detail) {
		const compactCommandLine = isShellToolDisplayName(line.toolName);
		if (displayStatus && detail !== displayStatus && (line.kind === "command-output" || isChannelProgressAttentionLine(line))) {
			const outputDetail = detail.startsWith(`${displayStatus};`) ? detail : `${displayStatus}; ${detail}`;
			if (compactCommandLine) return `${prefix}${outputDetail}`;
			return label ? `${prefix}${label}: ${outputDetail}` : `${prefix}${outputDetail}`;
		}
		if (line.kind !== "patch" && label && !compactCommandLine) return `${prefix}${label}: ${detail}`;
		return `${prefix}${detail}`;
	}
	if (displayStatus) {
		if (label) return `${prefix}${label}: ${displayStatus}`;
		return `${prefix}${displayStatus}`;
	}
	const text = line.text.trim();
	if (!icon && text && text !== label) return text;
	return `${prefix}${label}`.trim();
}
//#endregion
//#region src/channels/streaming.ts
function asInteger(value) {
	return typeof value === "number" && Number.isInteger(value) ? value : void 0;
}
function normalizeStreamingMode(value) {
	if (typeof value !== "string") return null;
	return normalizeOptionalLowercaseString(value) || null;
}
function parsePreviewStreamingMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress") return normalized;
	return null;
}
function asProgressConfig(value) {
	return asNullableRecord(value) ?? void 0;
}
function asCommandTextMode(value) {
	return value === "raw" || value === "status" ? value : void 0;
}
const DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS = 1500;
const DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS = 120;
const PROGRESS_DRAFT_NARRATION_MAX_CHARS = 280;
const NON_WORK_PROGRESS_TOOL_NAMES = /* @__PURE__ */ new Set([
	"message",
	"messages",
	"reply",
	"send",
	"reaction",
	"react",
	"typing",
	"progress_card",
	"update_plan"
]);
function isChannelProgressDraftWorkToolName(name) {
	const normalized = normalizeOptionalLowercaseString(name);
	return Boolean(normalized && !NON_WORK_PROGRESS_TOOL_NAMES.has(normalized));
}
function isAgentPlanStepStatus(value) {
	return value === "pending" || value === "in_progress" || value === "completed";
}
/**
* TODO(remove): normalizes the pre-2026.7.2 string plan-step wire shape to
* pending typed steps. Bundled producers all emit typed steps, and
* @openclaw/codex is force-updated with core, so this only covers a plugin
* pinned against an update. Delete once that cannot happen.
*/
function normalizeAgentPlanSteps(value) {
	if (!Array.isArray(value)) return;
	return value.flatMap((entry) => {
		if (typeof entry === "string") {
			const step = entry.trim();
			return step ? [{
				step,
				status: "pending"
			}] : [];
		}
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
		const rawStep = entry.step;
		const status = entry.status;
		const step = typeof rawStep === "string" ? rawStep.trim() : "";
		return step && isAgentPlanStepStatus(status) ? [{
			step,
			status
		}] : [];
	});
}
const EMOJI_PREFIX_RE = /^\p{Extended_Pictographic}/u;
/** Lines that reserve bounded progress capacity. */
function isChannelProgressPriorityLine(line) {
	if (typeof line === "string") return false;
	const status = line.status?.toLowerCase();
	return line.kind === "approval" || status === "failed" || status === "error" || status === "blocked";
}
const progressDraftLineMetadata = /* @__PURE__ */ new WeakMap();
function compactStrings(values) {
	return values.map((value) => value?.replace(/\s+/g, " ").trim()).filter(Boolean);
}
function inferToolMeta(name, args, detailMode = "explain") {
	if (!name || !args) return;
	return formatToolDetail(resolveToolDisplay({
		name,
		args,
		detailMode
	}));
}
function buildNamedProgressLine(kind, name, metas, options, fields) {
	const normalizedName = name?.trim() || "tool_call";
	const compactMetas = compactStrings(metas ?? []);
	const { text, detail } = formatToolAggregateParts(normalizedName, compactMetas.length ? compactMetas : void 0, { markdown: options?.markdown });
	const display = resolveToolDisplay({ name: normalizedName });
	const line = {
		...fields?.id ? { id: fields.id } : {},
		kind,
		text,
		label: display.label,
		icon: display.emoji,
		...detail ? { detail } : {},
		...fields?.status ? { status: fields.status } : {},
		toolName: display.name
	};
	setProgressDraftLineMetadata(line, fields?.correlationKey, fields?.commandDetailCandidate);
	return line;
}
function setProgressDraftLineMetadata(line, correlationKey, commandDetailCandidate) {
	const normalized = correlationKey?.trim();
	if (normalized || commandDetailCandidate) progressDraftLineMetadata.set(line, {
		correlationKey: normalized,
		commandDetailCandidate
	});
}
function copyProgressDraftLineMetadata(source, target, previous) {
	const metadata = progressDraftLineMetadata.get(source);
	setProgressDraftLineMetadata(target, metadata?.correlationKey ?? (previous && progressDraftLineMetadata.get(previous)?.correlationKey), metadata?.commandDetailCandidate);
}
function itemKindToToolName(kind) {
	switch (normalizeOptionalLowercaseString(kind)) {
		case "command": return "exec";
		case "patch": return "apply_patch";
		case "search": return "web_search";
		case "api": return "api";
		case "tool": return "tool_call";
		default: return;
	}
}
/** Tools whose detail is raw command text; commandText policy applies to these. */
function isCommandToolName(name) {
	return isCommandBearingToolCall(name);
}
function isCommandProgressItem(input) {
	const itemKind = normalizeOptionalLowercaseString(input.itemKind);
	return input.commandBearing === true || itemKind === "command" || isCommandToolName(input.name);
}
function resolveProgressDraftLineId(input, params) {
	const itemId = input.itemId?.trim();
	const toolCallId = input.toolCallId?.trim();
	if (itemId) return itemId;
	return params?.useToolCallIdFallback === true ? toolCallId : void 0;
}
function resolveCommandProgressCorrelationKey(input) {
	const toolCallId = input.toolCallId?.trim();
	return toolCallId ? `command:${toolCallId}` : void 0;
}
function isTerminalProgressStatus(status) {
	const normalized = normalizeOptionalLowercaseString(status);
	return normalized === "completed" || normalized === "failed" || normalized?.startsWith("exit ") === true;
}
function isEmptyReasoningProgressItem(input, meta) {
	return !meta && normalizeOptionalLowercaseString(input.itemKind) === "analysis" && normalizeOptionalLowercaseString(input.title) === "reasoning";
}
function patchMetas(input) {
	const fileMetas = [
		...input.added ?? [],
		...input.modified ?? [],
		...input.deleted ?? []
	];
	return compactStrings([
		input.summary,
		...fileMetas,
		input.title
	]);
}
function buildCommandOutputProgressLine(input, status, options) {
	const name = input.name ?? "exec";
	const correlationKey = resolveCommandProgressCorrelationKey(input);
	const detail = options?.commandText === "raw" ? compactStrings([input.title]) : [];
	const commandMeta = detail[0]?.match(/^command\s+(.+)$/i)?.[1];
	const commandDetailCandidate = commandMeta ? formatToolAggregateParts(name, [commandMeta], { markdown: options?.markdown }).detail : void 0;
	const line = buildNamedProgressLine(input.event, name, detail, options, {
		correlationKey,
		commandDetailCandidate,
		id: resolveProgressDraftLineId(input, { useToolCallIdFallback: true }),
		status
	});
	if (!line || !status) return line;
	if (status === "completed") return line;
	if (!line.detail || line.detail === status) {
		const statusLine = {
			...line,
			detail: status,
			text: formatToolAggregate(name, [status], { markdown: options?.markdown })
		};
		copyProgressDraftLineMetadata(line, statusLine);
		return statusLine;
	}
	const statusLine = {
		...line,
		text: formatToolAggregate(name, [status, line.detail], { markdown: options?.markdown })
	};
	copyProgressDraftLineMetadata(line, statusLine);
	return statusLine;
}
function shouldPrefixProgressLine(line) {
	return !EMOJI_PREFIX_RE.test(line);
}
function formatChannelProgressDraftLine(input, options) {
	return buildChannelProgressDraftLine(input, options)?.text;
}
function resolveChannelProgressDraftLineOptions(entry, options) {
	return {
		...options,
		commandText: options?.commandText ?? resolveChannelStreamingPreviewCommandText(entry)
	};
}
function buildChannelProgressDraftLineForEntry(entry, input, options) {
	return buildChannelProgressDraftLine(input, resolveChannelProgressDraftLineOptions(entry, options));
}
function formatChannelProgressDraftLineForEntry(entry, input, options) {
	const line = buildChannelProgressDraftLineForEntry(entry, input, options);
	return line ? getProgressDraftLineText(line) : void 0;
}
function buildChannelProgressDraftLine(input, options) {
	switch (input.event) {
		case "tool": {
			if (isAgentPlanProgressToolName(input.name)) return;
			const itemId = input.itemId ?? (input.toolCallId ? `tool:${input.toolCallId}` : void 0);
			const commandBearing = isCommandBearingToolCall(input.name, input.args);
			return buildNamedProgressLine(input.event, input.name, [options?.commandText !== "raw" && commandBearing ? void 0 : inferToolMeta(input.name, input.args, options?.detailMode), input.phase && !input.name ? input.phase : void 0], options, {
				correlationKey: commandBearing ? resolveCommandProgressCorrelationKey(input) : void 0,
				id: itemId
			});
		}
		case "item": {
			const name = input.name ?? itemKindToToolName(input.itemKind);
			if (isAgentPlanProgressToolName(name)) {
				const status = normalizeOptionalLowercaseString(input.status);
				return status === "failed" || status === "error" || status === "blocked" ? buildNamedProgressLine(input.event, name, [], options, {
					id: resolveProgressDraftLineId(input),
					status
				}) : void 0;
			}
			const meta = options?.commandText !== "raw" && isCommandProgressItem(input) ? void 0 : input.meta ?? input.summary ?? input.progressText;
			if (isEmptyReasoningProgressItem(input, meta)) return;
			if (name) {
				const line = buildNamedProgressLine(input.event, name, [meta], options, {
					correlationKey: isCommandProgressItem(input) ? resolveCommandProgressCorrelationKey(input) : void 0,
					id: resolveProgressDraftLineId(input),
					status: input.status
				});
				if (line && input.title?.trim() && !isCommandProgressItem(input)) {
					line.label = input.title.trim();
					line.detail = input.progressText ?? input.summary ?? (meta && !line.label.includes(meta) ? meta : void 0);
					line.text = getProgressDraftLineText(line);
				}
				return line;
			}
			const text = compactStrings([meta, input.title]).at(0);
			const id = resolveProgressDraftLineId(input);
			const correlationKey = isCommandProgressItem(input) ? resolveCommandProgressCorrelationKey(input) : void 0;
			if (!text) return;
			const line = {
				...id ? { id } : {},
				kind: input.event,
				text,
				label: input.title?.trim() || input.itemKind?.trim() || "Update",
				...input.status ? { status: input.status } : {}
			};
			setProgressDraftLineMetadata(line, correlationKey);
			return line;
		}
		case "plan":
			if (input.phase !== void 0 && input.phase !== "update") return;
			return buildNamedProgressLine(input.event, "progress_card", [
				input.explanation,
				normalizeAgentPlanSteps(input.steps)?.[0]?.step,
				input.title ?? "planning"
			], options);
		case "approval":
			if (input.phase !== void 0 && input.phase !== "requested") return;
			return buildNamedProgressLine(input.event, "approval", [
				input.command,
				input.message,
				input.reason,
				input.title ?? "approval requested"
			], options, {
				status: "requested",
				id: input.approvalId ? `approval:${input.approvalId}` : void 0
			});
		case "command-output":
			if (input.phase !== void 0 && input.phase !== "end") return;
			return buildCommandOutputProgressLine(input, input.exitCode === 0 ? "completed" : input.exitCode != null ? `exit ${input.exitCode}` : input.status, options);
		case "patch":
			if (input.phase !== void 0 && input.phase !== "end") return;
			return buildNamedProgressLine(input.event, input.name ?? "apply_patch", patchMetas(input), options, { id: input.itemId ?? input.toolCallId });
	}
}
function createChannelProgressDraftGate(params) {
	const initialDelayMs = params.initialDelayMs ?? DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS;
	const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
	const reportStartError = params.onStartError ?? ((error) => {
		console.warn(`[progress-draft] channel progress draft failed to start: ${String(error)}`);
	});
	let started = false;
	let disposed = false;
	let workEvents = 0;
	let timer;
	let startPromise;
	const clearTimer = () => {
		if (timer) {
			clearTimeoutFn(timer);
			timer = void 0;
		}
	};
	const start = () => {
		if (disposed || started) return startPromise ?? Promise.resolve();
		if (startPromise) return startPromise;
		clearTimer();
		started = true;
		const nextStart = Promise.resolve().then(params.onStart).then(() => {
			if (disposed) started = false;
			if (startPromise === nextStart) startPromise = void 0;
		}).catch((error) => {
			if (startPromise === nextStart) startPromise = void 0;
			started = false;
			throw error;
		});
		startPromise = nextStart;
		return startPromise;
	};
	const schedule = () => {
		if (timer || started || disposed || initialDelayMs < 0) return;
		timer = setTimeoutFn(() => {
			timer = void 0;
			start().catch((error) => {
				reportStartError(error);
			});
		}, initialDelayMs);
	};
	return {
		get hasStarted() {
			return started;
		},
		get workEvents() {
			return workEvents;
		},
		async noteWork() {
			if (disposed) return false;
			workEvents += 1;
			if (startPromise) {
				await startPromise;
				return started;
			}
			if (started) return true;
			schedule();
			return false;
		},
		async startNow() {
			await start();
		},
		cancel() {
			disposed = true;
			started = false;
			clearTimer();
		},
		reset() {
			clearTimer();
			started = false;
			disposed = false;
			workEvents = 0;
			startPromise = void 0;
		}
	};
}
function resolveChannelStreamingChunkMode(entry) {
	const mode = getChannelStreamingConfigObject(entry)?.chunkMode;
	return mode === "length" || mode === "newline" ? mode : void 0;
}
function resolveChannelStreamingBlockEnabled(entry, previewPolicy) {
	const explicitBlockStreaming = asBoolean(getChannelStreamingConfigObject(entry)?.block?.enabled);
	if (typeof explicitBlockStreaming === "boolean" || !previewPolicy) return explicitBlockStreaming;
	const explicitPreviewMode = parsePreviewStreamingMode(getChannelStreamingConfigObject(entry)?.mode);
	if (previewPolicy.previewAvailable && explicitPreviewMode !== null && explicitPreviewMode !== "off") return false;
	return previewPolicy.blockStreamingDefault === "on";
}
function resolveChannelStreamingBlockCoalesce(entry) {
	return asNullableRecord(getChannelStreamingConfigObject(entry)?.block?.coalesce) ?? void 0;
}
function resolveChannelStreamingPreviewChunk(entry) {
	return asNullableRecord(getChannelStreamingConfigObject(entry)?.preview?.chunk) ?? void 0;
}
/**
* The shipped SDK default keeps tool rows visible. Bundled callers pass their
* mode-specific default so progress drafts can stay quiet.
*/
function resolveChannelStreamingPreviewToolProgress(entry, defaultValue = true, mode) {
	const config = getChannelStreamingConfigObject(entry);
	if ((mode ?? resolveChannelPreviewStreamMode(entry, "partial")) === "progress") return asBoolean(config?.progress?.toolProgress) ?? asBoolean(config?.preview?.toolProgress) ?? defaultValue;
	return asBoolean(config?.preview?.toolProgress) ?? defaultValue;
}
function resolveChannelStreamingProgressCommentary(entry, defaultValue = false, mode) {
	const config = getChannelStreamingConfigObject(entry);
	if ((mode ?? resolveChannelPreviewStreamMode(entry, "partial")) !== "progress") return false;
	const progress = asNullableRecord(config?.progress);
	return asBoolean(progress?.commentary) ?? defaultValue;
}
function resolveChannelStreamingProgressNarration(entry, defaultValue = true) {
	const progress = asNullableRecord(getChannelStreamingConfigObject(entry)?.progress);
	return asBoolean(progress?.narration) ?? defaultValue;
}
function resolveChannelStreamingPreviewCommandText(entry, defaultValue = "status") {
	const config = getChannelStreamingConfigObject(entry);
	return asCommandTextMode(config?.progress?.commandText) ?? asCommandTextMode(config?.preview?.commandText) ?? defaultValue;
}
function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry, options) {
	if (options?.draftStreamActive === false || options?.previewStreamingEnabled === false) return false;
	const mode = options?.mode ?? resolveChannelPreviewStreamMode(entry, "off");
	if (mode === "off") return false;
	if (mode === "progress") return true;
	if (options?.draftStreamActive === true) return true;
	return options?.previewToolProgressEnabled ?? resolveChannelStreamingPreviewToolProgress(entry);
}
function resolveChannelPreviewStreamMode(entry, defaultMode) {
	return parsePreviewStreamingMode(getChannelStreamingConfigObject(entry)?.mode) ?? defaultMode;
}
function resolveChannelProgressDraftConfig(entry) {
	return asProgressConfig(getChannelStreamingConfigObject(entry)?.progress) ?? {};
}
function resolveChannelProgressDraftLabel(params) {
	const progress = resolveChannelProgressDraftConfig(params.entry);
	if (progress.label === false || params.narration && progress.label === void 0 && progress.labels === void 0) return;
	const normalizedLabel = typeof progress.label === "string" ? normalizeOptionalLowercaseString(progress.label) : null;
	if (typeof progress.label === "string" && progress.label.trim() && normalizedLabel !== "auto") return redactToolPayloadText(progress.label.trim());
	const labels = normalizeTrimmedStringList(progress.labels);
	const label = selectProgressLabel({
		labels: labels.length > 0 ? labels : void 0,
		seed: params.seed,
		random: params.random
	});
	return label ? redactToolPayloadText(label) : label;
}
function resolveChannelProgressDraftMaxLines(entry, defaultValue = 8) {
	const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLines);
	return configured && configured > 0 ? configured : defaultValue;
}
function resolveChannelProgressDraftMaxLineChars(entry, defaultValue = DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS) {
	const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLineChars);
	return configured && configured > 0 ? configured : defaultValue;
}
function compactProgressLineDetail(detail, maxChars) {
	const chars = Array.from(sliceUtf16Safe(detail, 0, (maxChars + 1) * 2));
	if (chars.length <= maxChars) return detail;
	if (maxChars <= 1) return "…";
	const keepStart = Math.max(1, Math.ceil((maxChars - 1) * .45));
	const keepEnd = Math.max(1, maxChars - keepStart - 1);
	const rawStart = chars.slice(0, keepStart).join("").trimEnd();
	return `${rawStart.length > 8 && /\s+\S+$/.test(rawStart) ? rawStart.replace(/\s+\S+$/, "") : rawStart}…${Array.from(sliceUtf16Safe(detail, -keepEnd * 2)).slice(-keepEnd).join("").trimStart()}`;
}
function removeUnbalancedInlineBackticks(value) {
	if ((value.match(/`/g)?.length ?? 0) % 2 === 0) return value;
	return value.trimStart().startsWith("`") ? value.replaceAll("`", "'") : value.replaceAll("`", "");
}
function repairCompactedProgressMarkdown(value) {
	const withoutDanglingBackticks = removeUnbalancedInlineBackticks(value);
	const trimmedStart = withoutDanglingBackticks.trimStart();
	if (!trimmedStart.startsWith("_") || trimmedStart.endsWith("_")) return withoutDanglingBackticks;
	if ((trimmedStart.match(/_/g)?.length ?? 0) % 2 === 0) return withoutDanglingBackticks;
	return `${withoutDanglingBackticks.slice(0, withoutDanglingBackticks.length - trimmedStart.length)}${trimmedStart.slice(1)}`;
}
function compactChannelProgressDraftLine(line, maxChars) {
	const normalized = line.replace(/\s+/g, " ").trim();
	if (!normalized) return "";
	const chars = Array.from(sliceUtf16Safe(normalized, 0, (Math.max(0, maxChars) + 1) * 2));
	if (chars.length <= maxChars) return normalized;
	if (maxChars <= 1) return "…";
	const compactWithPrefix = (prefix, detail) => {
		const detailLimit = maxChars - Array.from(sliceUtf16Safe(prefix, 0, (maxChars + 1) * 2)).length;
		if (detailLimit < 8) return;
		return repairCompactedProgressMarkdown(`${prefix}${compactProgressLineDetail(detail, detailLimit)}`);
	};
	const splitIndex = normalized.indexOf(": ");
	if (splitIndex > 0) {
		const compact = compactWithPrefix(normalized.slice(0, splitIndex + 2), normalized.slice(splitIndex + 2));
		if (compact) return compact;
	}
	const compactCommandPrefixMatch = normalized.match(/^🛠️\s+/u);
	if (compactCommandPrefixMatch) {
		const prefix = compactCommandPrefixMatch[0];
		const compact = compactWithPrefix(prefix, normalized.slice(prefix.length));
		if (compact) return compact;
	}
	return repairCompactedProgressMarkdown(compactProgressText(normalized, maxChars, chars));
}
function selectPlanChecklistSteps(steps, options) {
	const normalizedSteps = steps.map((entry, index) => ({
		...entry,
		step: entry.step.replace(/\s+/g, " ").trim(),
		index
	})).filter((entry) => entry.step);
	if (normalizedSteps.length === 0 || options.maxLines <= 0) return { steps: [] };
	if (normalizedSteps.length <= options.maxLines) return { steps: normalizedSteps };
	const availableSteps = Math.max(0, options.maxLines - 1);
	const pendingSteps = normalizedSteps.filter((entry) => entry.status !== "completed");
	const activeStep = availableSteps > 0 ? pendingSteps.find((entry) => entry.status === "in_progress") : void 0;
	const pendingSlots = Math.max(0, availableSteps - (activeStep ? 1 : 0));
	const pendingTail = pendingSlots === 0 ? [] : pendingSteps.filter((entry) => entry !== activeStep).slice(-pendingSlots);
	const visiblePending = [...activeStep ? [activeStep] : [], ...pendingTail];
	const completedSlots = Math.max(0, availableSteps - visiblePending.length);
	return {
		steps: [...completedSlots > 0 ? normalizedSteps.filter((entry) => entry.status === "completed").slice(-completedSlots) : [], ...visiblePending].toSorted((a, b) => a.index - b.index),
		summary: `${normalizedSteps.length - pendingSteps.length}/${normalizedSteps.length} done`
	};
}
function formatPlanChecklistLines(steps, options) {
	const selected = selectPlanChecklistSteps(steps, options);
	const marker = (status) => options.plain ? status === "completed" ? "Completed:" : status === "in_progress" ? "In progress:" : "Pending:" : status === "completed" ? "✅" : status === "in_progress" ? "▸" : "▢";
	return [...selected.summary ? [`${options.plain ? "" : "✅ "}${selected.summary}`] : [], ...selected.steps.map((entry) => `${marker(entry.status)} ${entry.step}`)].map((line) => compactChannelProgressDraftLine(line, options.maxLineChars));
}
function normalizeChannelProgressDraftLineIdentity(line) {
	return (typeof line === "string" ? line : line ? getProgressDraftLineText(line) : void 0)?.replace(/`([^`]+)`/gu, "$1").replace(/\s+/g, " ").trim() ?? "";
}
function mergeChannelProgressDraftLine(lines, line, params) {
	return mergeProgressDraftLine(lines, line, params.maxLines, isChannelProgressAttentionLine);
}
function mergeChannelProgressDraftLineForStreaming(lines, line, params) {
	return mergeProgressDraftLine(lines, line, params.maxLines, isChannelProgressPriorityLine);
}
function mergeProgressDraftLine(lines, line, limit, isPriorityLine) {
	const normalized = normalizeChannelProgressDraftLineIdentity(line);
	if (!normalized) return lines;
	const maxLines = Math.max(1, limit);
	const lineKeys = resolveProgressDraftLineMergeKeys(line);
	if (lineKeys.length > 0) {
		const existingIndex = lines.findIndex((entry) => resolveProgressDraftLineMergeKeys(entry).some((entryKey) => lineKeys.includes(entryKey)));
		if (existingIndex >= 0) {
			const existing = expectDefined(lines[existingIndex], "lines entry at existing index");
			const replacement = keepProgressDraftLineId(existing, mergeProgressDraftLineUpdate(existing, line));
			if (replacement === existing) return lines;
			const next = [...lines];
			next[existingIndex] = replacement;
			return limitProgressDraftLines(next, maxLines, isPriorityLine);
		}
	} else {
		const previous = lines.at(-1);
		if (previous && normalizeChannelProgressDraftLineIdentity(previous) === normalized) return lines;
	}
	return limitProgressDraftLines([...lines, line], maxLines, isPriorityLine);
}
function limitProgressDraftLines(lines, maxLines, isPriorityLine) {
	let attentionSlots = maxLines;
	let ordinarySlots = Math.max(0, maxLines - lines.filter(isPriorityLine).length);
	return lines.toReversed().filter((line) => isPriorityLine(line) ? attentionSlots-- > 0 : ordinarySlots-- > 0).toReversed();
}
function mergeProgressDraftLineUpdate(previous, line) {
	if (typeof previous !== "object" || typeof line !== "object") return line;
	if (line.kind !== "command-output" || !line.status) return line;
	const previousDetail = previous.detail?.trim();
	const incomingDetail = line.detail?.trim();
	if (!previousDetail || previousDetail === previous.status || incomingDetail === previousDetail || incomingDetail && incomingDetail !== line.status && progressDraftLineMetadata.get(line)?.commandDetailCandidate !== previousDetail) return line;
	if (isTerminalProgressStatus(previous.status) && (!incomingDetail || incomingDetail === line.status)) return line;
	const replacement = {
		...line,
		detail: previousDetail
	};
	replacement.text = getProgressDraftLineText(replacement);
	copyProgressDraftLineMetadata(line, replacement, previous);
	return replacement;
}
/**
* A line keeps the id it was created with. The agent keys one tool call's
* item families separately (`tool:<call>`, `command:<call>`) and correlation
* merges them into one line; a channel that keys native rows on the line id
* (Slack task cards) would otherwise open a new row when a later family
* takes the line over. Later events still match through the correlation key.
*/
function keepProgressDraftLineId(previous, replacement) {
	if (typeof previous !== "object" || typeof replacement !== "object") return replacement;
	const previousId = previous.id?.trim();
	if (!previousId || previousId === replacement.id) return replacement;
	const kept = {
		...replacement,
		id: previousId
	};
	copyProgressDraftLineMetadata(replacement, kept, previous);
	return kept;
}
function resolveProgressDraftLineMergeKeys(line) {
	if (typeof line !== "object") return [];
	const keys = [progressDraftLineMetadata.get(line)?.correlationKey, line.id].map((key) => key?.trim()).filter((key) => Boolean(key));
	return [...new Set(keys)];
}
function formatChannelProgressDraftText(params) {
	return formatProgressDraftText(params, isChannelProgressAttentionLine);
}
function formatChannelProgressDraftTextForStreaming(params) {
	return formatProgressDraftText(params, isChannelProgressPriorityLine);
}
function formatProgressDraftText(params, isPriorityLine) {
	const narration = compactProgressText(params.narration?.replace(/\s+/g, " ").trim() ?? "", PROGRESS_DRAFT_NARRATION_MAX_CHARS);
	const maxLines = resolveChannelProgressDraftMaxLines(params.entry);
	const maxLineChars = resolveChannelProgressDraftMaxLineChars(params.entry);
	const formatLine = params.formatLine ?? ((line) => line);
	const attention = params.lines.filter(isPriorityLine);
	const planLines = formatPlanChecklistLines(params.plan ?? [], {
		maxLines: maxLines - attention.length,
		maxLineChars,
		plain: params.presentation === "summary"
	}).map(formatLine);
	const resolvedLabel = resolveChannelProgressDraftLabel({
		entry: params.entry,
		seed: params.seed,
		random: params.random,
		narration
	});
	const statusHeadline = narration ? params.narrationFormat === "plain" ? (params.formatPlainText ?? escapeMarkdownText)(narration) : formatLine(narration) : "";
	const bullet = params.bullet ?? "•";
	const toolLineBudget = planLines.length > 0 ? Math.max(0, maxLines - planLines.length) : maxLines;
	const renderedToolLines = [...params.lines.filter((line) => !isPriorityLine(line)), ...attention].map((line) => {
		if (params.presentation === "summary") {
			if (typeof line === "string") return;
			const text = line.kind === "approval" ? `Approval required: ${line.detail || line.label}` : isChannelProgressAttentionLine(line) ? [
				line.label,
				line.detail,
				line.status
			].filter(Boolean).join(" — ") : line.id === "reasoning" || line.id?.startsWith("commentary:") ? line.text : void 0;
			return text ? formatLine(compactChannelProgressDraftLine(text, maxLineChars)) : void 0;
		}
		const text = compactChannelProgressDraftLine(typeof line === "string" ? line : getProgressDraftLineText(line), maxLineChars);
		if (!text) return;
		const prefix = typeof line === "object" && line !== null ? line.prefix !== false : true;
		const formatted = formatLine(text);
		return prefix && shouldPrefixProgressLine(text) ? `${bullet} ${formatted}` : formatted;
	}).filter((line) => Boolean(line));
	const rollingLines = toolLineBudget === 0 ? [] : renderedToolLines.slice(-toolLineBudget);
	const diffStat = rollingLines.length + planLines.length < maxLines ? formatChannelProgressDraftDiffStat(params.diffStat) : void 0;
	const labelBlock = resolvedLabel && (planLines.length > 0 || rollingLines.length + (diffStat ? 1 : 0) < maxLines) ? compactChannelProgressDraftLine(resolvedLabel, maxLineChars) : void 0;
	const rollingBlock = [
		...rollingLines,
		...planLines,
		...diffStat ? [formatLine(compactChannelProgressDraftLine(diffStat, maxLineChars))] : []
	].join("\n");
	const blocks = [];
	if (labelBlock) blocks.push({
		text: labelBlock,
		format: "markdown"
	});
	if (statusHeadline) blocks.push({
		text: params.narrationFormat === "plain" ? narration : statusHeadline,
		format: params.narrationFormat === "plain" ? "plain" : "markdown"
	});
	if (rollingBlock) blocks.push({
		text: rollingBlock,
		format: "markdown"
	});
	params.onPreparedBlocks?.(blocks);
	return [
		labelBlock,
		statusHeadline,
		rollingBlock
	].filter(Boolean).join("\n\n");
}
//#endregion
export { resolveChannelStreamingSuppressDefaultToolProgressMessages as A, resolveChannelStreamingBlockEnabled as C, resolveChannelStreamingPreviewToolProgress as D, resolveChannelStreamingPreviewCommandText as E, createProgressDraftDiffStatTracker as F, formatChannelProgressDraftDiffStat as I, getProgressDraftLineText as M, isChannelProgressAttentionLine as N, resolveChannelStreamingProgressCommentary as O, removeChannelProgressDraftLine as P, resolveChannelStreamingBlockCoalesce as S, resolveChannelStreamingPreviewChunk as T, resolveChannelPreviewStreamMode as _, createChannelProgressDraftGate as a, resolveChannelProgressDraftMaxLineChars as b, formatChannelProgressDraftText as c, isChannelProgressDraftWorkToolName as d, isChannelProgressPriorityLine as f, normalizeChannelProgressDraftLineIdentity as g, normalizeAgentPlanSteps as h, copyProgressDraftLineMetadata as i, selectPlanChecklistSteps as j, resolveChannelStreamingProgressNarration as k, formatChannelProgressDraftTextForStreaming as l, mergeChannelProgressDraftLineForStreaming as m, buildChannelProgressDraftLineForEntry as n, formatChannelProgressDraftLine as o, mergeChannelProgressDraftLine as p, compactChannelProgressDraftLine as r, formatChannelProgressDraftLineForEntry as s, buildChannelProgressDraftLine as t, formatPlanChecklistLines as u, resolveChannelProgressDraftConfig as v, resolveChannelStreamingChunkMode as w, resolveChannelProgressDraftMaxLines as x, resolveChannelProgressDraftLabel as y };
