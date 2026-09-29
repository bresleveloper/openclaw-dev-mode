import "./src-CZ2wJvNB.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { c as getSubagentSessionRuntimeMs, l as getSubagentSessionStartedAt, r as isRetainedUnendedSubagentRun, s as shouldKeepSubagentRunChildLink, u as resolveSubagentDisplayStatus } from "./subagent-run-liveness-9vTRtoqd.mjs";
import "./subagent-registry-read-C2SIiLpb.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-uco3tjYq.mjs";
import { n as observeSubagentExecution } from "./subagent-execution-observation-DY2StZMb.mjs";
import { n as resolveModelDisplayRef, t as resolveModelDisplayName } from "./model-selection-display-Q0UQ9JGt.mjs";
//#region src/shared/subagents-format.ts
/** Formats token counts using compact k/m suffixes for subagent summaries. */
function formatTokenShort(value) {
	if (!value || !Number.isFinite(value) || value <= 0) return;
	const n = Math.floor(value);
	return formatCompactTokenCount(n, {
		thousandsPrecision: n >= 1e4 ? 0 : 1,
		trimTrailingZero: true
	});
}
/** Truncates a single-line display string without preserving trailing whitespace. */
function truncateLine(value, maxLength) {
	const limit = Math.max(0, Math.floor(maxLength));
	const trimmed = value.trimEnd();
	if (trimmed.length <= limit) return trimmed;
	const marker = "...";
	if (limit <= 3) return marker.slice(0, limit);
	return `${truncateUtf16Safe(trimmed, limit - 3).trimEnd()}${marker}`;
}
/** Resolves total token usage, falling back to input+output when no explicit total exists. */
function resolveTotalTokens(entry) {
	if (!entry || typeof entry !== "object") return;
	if (typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens) && entry.totalTokensFresh === true && entry.totalTokensVersion === 1) return entry.totalTokens;
	const total = (typeof entry.inputTokens === "number" ? entry.inputTokens : 0) + (typeof entry.outputTokens === "number" ? entry.outputTokens : 0);
	return total > 0 ? total : void 0;
}
/** Resolves finite input/output token usage and the derived total. */
function resolveIoTokens(entry) {
	if (!entry || typeof entry !== "object") return;
	const input = typeof entry.inputTokens === "number" && Number.isFinite(entry.inputTokens) ? entry.inputTokens : 0;
	const output = typeof entry.outputTokens === "number" && Number.isFinite(entry.outputTokens) ? entry.outputTokens : 0;
	const total = input + output;
	if (total <= 0) return;
	return {
		input,
		output,
		total
	};
}
/** Formats token usage for compact subagent list/detail displays. */
function formatTokenUsageDisplay(entry) {
	const io = resolveIoTokens(entry);
	const promptCache = resolveTotalTokens(entry);
	const parts = [];
	if (io) {
		const input = formatTokenShort(io.input) ?? "0";
		const output = formatTokenShort(io.output) ?? "0";
		parts.push(`tokens ${formatTokenShort(io.total)} (in ${input} / out ${output})`);
	} else if (typeof promptCache === "number" && promptCache > 0) parts.push(`tokens ${formatTokenShort(promptCache)} prompt/cache`);
	if (typeof promptCache === "number" && io && promptCache > io.total) parts.push(`prompt/cache ${formatTokenShort(promptCache)}`);
	return parts.join(", ");
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-view.ts
function sortSubagentRuns(runs) {
	return runs.toSorted((a, b) => {
		const aTime = a.execution.startedAt ?? a.createdAt ?? 0;
		return (b.execution.startedAt ?? b.createdAt ?? 0) - aTime;
	});
}
/** Keep display indices and command targets on the same latest-run/liveness policy. */
function buildSubagentRunView(params) {
	const now = params.now ?? Date.now();
	const recentCutoff = now - params.recentMinutes * 6e4;
	const latest = [];
	const active = [];
	const recent = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of sortSubagentRuns(params.runs)) {
		if (seen.has(entry.childSessionKey)) continue;
		seen.add(entry.childSessionKey);
		latest.push(entry);
		if (isRetainedUnendedSubagentRun(entry, now) || entry.pauseReason === "sessions_yield" && !entry.killReconciliation && !entry.killIntent && entry.endedReason !== "subagent-killed" && entry.suppressAnnounceReason !== "killed" || params.countPendingDescendantRuns(entry.childSessionKey) > 0) active.push(entry);
		else if (entry.execution.endedAt && entry.execution.endedAt >= recentCutoff) recent.push(entry);
	}
	return {
		latest,
		active,
		recent
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-list.ts
/**
* Subagent list builder.
*
* Combines live registry runs and persisted session metadata for sessions_list/subagents views.
*/
/** Capture live classification before the prepared registry view crosses a Promise boundary. */
function captureSubagentListReadContext(runs, readIndex, fullRuns, recentMinutes) {
	const now = Date.now();
	const childSessionsByController = buildChildSessionIndex(readIndex, now);
	const pendingDescendants = new Map(runs.map((entry) => [entry.childSessionKey, readIndex.countPendingDescendantRuns(entry.childSessionKey)]));
	const view = buildSubagentRunView({
		runs,
		recentMinutes,
		countPendingDescendantRuns: (key) => pendingDescendants.get(key) ?? 0,
		now
	});
	const execution = new Map([...view.active, ...view.recent].map((entry) => [entry.runId, observeSubagentExecution(entry, entry.pauseReason === "sessions_yield" ? fullRuns.values() : [])]));
	return {
		now,
		recentMinutes,
		view: structuredClone(view),
		childSessionsByController,
		pendingDescendants,
		execution
	};
}
function readSubagentListSessionEntries(cfg, context) {
	const runs = [...context.view.active, ...context.view.recent];
	const keysByStore = /* @__PURE__ */ new Map();
	for (const run of runs) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: parseAgentSessionKey(run.childSessionKey)?.agentId });
		const keys = keysByStore.get(storePath);
		if (keys) keys.push(run.childSessionKey);
		else keysByStore.set(storePath, [run.childSessionKey]);
	}
	const entries = /* @__PURE__ */ new Map();
	for (const [storePath, sessionKeys] of keysByStore) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		storePath,
		sessionKeys,
		clone: false,
		projection: "list"
	})) entries.set(sessionKey, entry);
	return entries;
}
/** Build child-session indexes from the latest run associated with each child key. */
function buildChildSessionIndex(readIndex, now) {
	const childSessionsByController = /* @__PURE__ */ new Map();
	for (const [childSessionKey, entry] of readIndex.latestRunsByChildSessionKey) {
		const controllerSessionKey = entry.controllerSessionKey?.trim() || entry.requesterSessionKey?.trim();
		if (!controllerSessionKey) continue;
		if (!shouldKeepSubagentRunChildLink(entry, {
			activeDescendants: readIndex.countActiveDescendantRuns(childSessionKey),
			now
		})) continue;
		const existing = childSessionsByController.get(controllerSessionKey);
		if (existing) {
			existing.push(childSessionKey);
			continue;
		}
		childSessionsByController.set(controllerSessionKey, [childSessionKey]);
	}
	for (const [controllerSessionKey, childSessions] of childSessionsByController) childSessionsByController.set(controllerSessionKey, childSessions.toSorted());
	return childSessionsByController;
}
function resolveModelRef(entry, fallbackModel) {
	return resolveModelDisplayRef({
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: entry?.providerOverride,
		overrideModel: entry?.modelOverride,
		fallbackModel
	});
}
function resolveModelDisplay(entry, fallbackModel) {
	return resolveModelDisplayName({
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: entry?.providerOverride,
		overrideModel: entry?.modelOverride,
		fallbackModel
	});
}
function buildListText(params) {
	const lines = [];
	lines.push("active subagents:");
	if (params.active.length === 0) lines.push("(none)");
	else lines.push(...params.active.map((entry) => entry.line));
	lines.push("");
	lines.push(`recent (last ${params.recentMinutes}m):`);
	if (params.recent.length === 0) lines.push("(none)");
	else lines.push(...params.recent.map((entry) => entry.line));
	return lines.join("\n");
}
/** Build structured and text views for active and recent subagent runs. */
function buildSubagentList(params) {
	const { now, view: runView, childSessionsByController } = params.context;
	let index = 1;
	const buildListEntry = (entry, runtimeMs) => {
		const sessionEntry = params.sessionEntries.get(entry.childSessionKey);
		const totalTokens = resolveTotalTokens(sessionEntry);
		const usageText = formatTokenUsageDisplay(sessionEntry);
		const pendingDescendants = params.context.pendingDescendants.get(entry.childSessionKey) ?? 0;
		const execution = params.context.execution.get(entry.runId);
		const status = resolveSubagentDisplayStatus(entry, execution.state === "waiting" ? execution.wait?.pendingCount ?? 0 : pendingDescendants);
		const childSessions = childSessionsByController.get(entry.childSessionKey) ?? [];
		const runtime = formatDurationCompact(runtimeMs) ?? "n/a";
		const label = truncateLine(resolveSubagentLabel(entry), 48);
		const task = truncateLine(entry.task.trim(), params.taskMaxChars ?? 72);
		const taskName = entry.taskName?.trim();
		const taskNamePrefix = taskName ? `${taskName}: ` : "";
		const line = `${index}. ${taskNamePrefix}${label} (${resolveModelDisplay(sessionEntry, entry.model)}, ${runtime}${usageText ? `, ${usageText}` : ""}) ${status}${normalizeLowercaseStringOrEmpty(task) !== normalizeLowercaseStringOrEmpty(label) ? ` - ${task}` : ""}`;
		const view = {
			index,
			line,
			runId: entry.runId,
			sessionKey: entry.childSessionKey,
			...taskName ? { taskName } : {},
			label,
			task,
			status,
			execution,
			...entry.delivery ? { deliveryStatus: entry.delivery.status } : {},
			pendingDescendants,
			runtime,
			runtimeMs,
			...childSessions.length > 0 ? { childSessions } : {},
			model: resolveModelRef(sessionEntry, entry.model),
			totalTokens,
			startedAt: getSubagentSessionStartedAt(entry),
			...entry.execution.endedAt ? { endedAt: entry.execution.endedAt } : {}
		};
		index += 1;
		return view;
	};
	const active = runView.active.map((entry) => buildListEntry(entry, getSubagentSessionRuntimeMs(entry, now) ?? 0));
	const recent = runView.recent.map((entry) => buildListEntry(entry, getSubagentSessionRuntimeMs(entry, entry.execution.endedAt ?? now) ?? 0));
	return {
		total: runView.latest.length,
		active,
		recent,
		text: buildListText({
			active,
			recent,
			recentMinutes: params.context.recentMinutes
		})
	};
}
//#endregion
export { captureSubagentListReadContext as n, readSubagentListSessionEntries as r, buildSubagentList as t };
