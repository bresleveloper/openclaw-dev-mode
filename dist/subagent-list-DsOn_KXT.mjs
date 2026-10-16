import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { D as matchesSubagentChildSessionOwner, T as recordLatestSubagentRun, x as isSameSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { a as isSubagentRunLive, n as hasSubagentRunEnded, o as isSubagentRunQueued, r as isRetainedUnendedSubagentRun, s as shouldKeepSubagentRunChildLink } from "./subagent-run-liveness-C7bJPLJU.mjs";
import { n as getSubagentSessionStartedAt, r as resolveSubagentDisplayStatus, t as getSubagentSessionRuntimeMs } from "./subagent-session-metrics-BCHEYB6I.mjs";
import { t as isAgentRunWaitingForCapacity } from "./agent-run-capacity-wait-DqF7E2c_.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-DtuM-aOJ.mjs";
import { n as resolveModelDisplayRef, t as resolveModelDisplayName } from "./model-selection-display-h6TjJnId.mjs";
//#region src/agents/subagents/registry/subagent-execution-observation.ts
function isYieldedSubagentRun(entry) {
	return entry.pauseReason === "sessions_yield" && !entry.killIntent && !entry.killReconciliation && entry.suppressAnnounceReason !== "killed" && entry.endedReason !== "subagent-killed";
}
/** Project recorded execution separately from completion and requester delivery. */
function observeSubagentExecution(entry, children) {
	if (isYieldedSubagentRun(entry)) {
		const latestChildren = /* @__PURE__ */ new Map();
		for (const child of children) if (child.requesterSessionKey === entry.childSessionKey) recordLatestSubagentRun(latestChildren, child.childSessionKey, child);
		const pending = [...latestChildren.values()].filter((child) => child.collect !== true && child.expectsCompletionMessage === true && child.suppressAnnounceReason !== "steer-restart" && (isYieldedSubagentRun(child) || !hasSubagentRunEnded(child) || child.requesterSettleWake !== void 0 || typeof child.cleanupCompletedAt !== "number")).toSorted((left, right) => left.runId.localeCompare(right.runId));
		return {
			state: "waiting",
			wait: pending.length > 0 ? {
				kind: "children",
				pendingCount: pending.length,
				dependencies: pending.slice(0, 32).map((child) => Object.assign({
					runId: child.runId,
					sessionKey: child.childSessionKey
				}, child.label ? { label: child.label } : {}))
			} : { kind: "external" }
		};
	}
	if (hasSubagentRunEnded(entry)) return { state: "finished" };
	if (entry.execution.status === "interrupted") return { state: "unknown" };
	const current = subagentRuns.get(entry.runId);
	if (!current || !isSameSubagentRun(current, entry)) return { state: "unknown" };
	if (isSubagentRunLive(current)) {
		if (current.execution.status === "queued" || isAgentRunWaitingForCapacity(current.runId)) return { state: "queued" };
		const context = getAgentRunContext(current.runId);
		const activity = context?.sessionKey === current.childSessionKey ? context.executionActivity : void 0;
		if (activity?.approvalOverflow) return { state: "unknown" };
		if (activity?.pendingApprovalIds.length) return {
			state: "waiting",
			wait: { kind: "approval" }
		};
		if (activity?.execution?.state === "unknown") return { state: "unknown" };
		if (activity?.execution?.state === "waiting") return {
			state: "waiting",
			wait: { kind: activity.execution.wait ?? "external" }
		};
		const tool = activity?.tools.at(-1);
		return {
			state: "running",
			...tool ? { currentTool: { name: tool.name } } : {}
		};
	}
	if (isSubagentRunQueued(current)) return { state: "queued" };
	return { state: "unknown" };
}
//#endregion
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
/** Canonical ordering and visibility for numbered subagent lists and targets. */
/** Keep display indices and command targets on the same latest-run/liveness policy. */
function buildSubagentRunView(params) {
	const now = params.now ?? Date.now();
	const recentCutoff = now - params.recentMinutes * 6e4;
	const latest = [];
	const active = [];
	const recent = [];
	const seen = /* @__PURE__ */ new Map();
	for (const entry of params.runs.toSorted((a, b) => {
		const aTime = a.execution.startedAt ?? a.createdAt;
		return (b.execution.startedAt ?? b.createdAt) - aTime;
	})) {
		const childRuns = seen.get(entry.childSessionKey) ?? [];
		const superseded = childRuns.some((candidate) => matchesSubagentChildSessionOwner(candidate, entry.childSessionKey, entry.childAgentId));
		childRuns.push(entry);
		seen.set(entry.childSessionKey, childRuns);
		if (superseded) continue;
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
/** Capture live classification before the prepared registry view crosses a Promise boundary. */
function captureSubagentListReadContext(runs, readIndex, fullRuns, recentMinutes) {
	const now = Date.now();
	const childSessionsByController = buildChildSessionIndex(readIndex, now);
	const pendingDescendants = new Map(runs.map((entry) => [entry.childSessionKey, readIndex.countPendingDescendantRuns(entry.childSessionKey, { excludeSuspendedDelivery: true })]));
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
async function readSubagentListSessionEntries(cfg, context) {
	const runs = [...context.view.active, ...context.view.recent];
	const keysByStore = /* @__PURE__ */ new Map();
	for (const run of runs) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: parseAgentSessionKey(run.childSessionKey)?.agentId });
		const keys = keysByStore.get(storePath);
		if (keys) keys.push(run.childSessionKey);
		else keysByStore.set(storePath, [run.childSessionKey]);
	}
	const entries = /* @__PURE__ */ new Map();
	for (const [storePath, sessionKeys] of keysByStore) {
		const agentId = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath).agentId ?? parseAgentSessionKey(sessionKeys[0])?.agentId;
		if (!agentId) throw new Error("Cannot resolve subagent session metadata without an agent id");
		const selected = await readSessionEntriesFromStoreInWorker({
			agentId,
			storePath,
			sessionKeys,
			projection: "list"
		});
		for (const { sessionKey, entry } of selected.entries) entries.set(sessionKey, entry);
	}
	return entries;
}
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
function buildSubagentList(params) {
	const { now, view: runView, childSessionsByController } = params.context;
	let index = 1;
	const buildListEntry = (entry, runtimeMs) => {
		const sessionEntry = params.sessionEntries.get(entry.childSessionKey);
		const modelSelection = {
			runtimeProvider: sessionEntry?.modelProvider,
			runtimeModel: sessionEntry?.model,
			overrideProvider: sessionEntry?.providerOverride,
			overrideModel: sessionEntry?.modelOverride,
			fallbackModel: entry.model
		};
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
		const line = `${index}. ${taskNamePrefix}${label} (${resolveModelDisplayName(modelSelection)}, ${runtime}${usageText ? `, ${usageText}` : ""}) ${status}${normalizeLowercaseStringOrEmpty(task) !== normalizeLowercaseStringOrEmpty(label) ? ` - ${task}` : ""}`;
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
			model: resolveModelDisplayRef(modelSelection),
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
		text: [
			"active subagents:",
			...active.length ? active.map((entry) => entry.line) : ["(none)"],
			"",
			`recent (last ${params.context.recentMinutes}m):`,
			...recent.length ? recent.map((entry) => entry.line) : ["(none)"]
		].join("\n")
	};
}
//#endregion
export { observeSubagentExecution as i, captureSubagentListReadContext as n, readSubagentListSessionEntries as r, buildSubagentList as t };
