import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { r as formatCompactTokenCount } from "./format-C1IjPxxo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { r as resolveSubagentChildAgentId, t as matchesSubagentChildSessionOwner } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { N as recordLatestSubagentRun, O as isSameSubagentRun } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { a as isSubagentRunLive, c as shouldKeepSubagentRunChildLink, d as resolveSubagentDisplayStatus, l as getSubagentSessionRuntimeMs, n as hasSubagentRunEnded, o as isSubagentRunQueued, r as isRetainedUnendedSubagentRun, s as isYieldedSubagentRun, u as getSubagentSessionStartedAt } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { t as isAgentRunWaitingForCapacity } from "./agent-run-capacity-wait-DbnNjNgr.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { s as resolveSubagentChildSessionOwner, t as loadSubagentSessionEntry } from "./subagent-session-reconciliation-DBq1r5kk.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-DV33DlwQ.mjs";
import { n as resolveModelDisplayRef, t as resolveModelDisplayName } from "./model-selection-display-B1GYGsQu.mjs";
//#region src/agents/subagents/registry/subagent-execution-observation.ts
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
	return { state: isSubagentRunQueued(current) ? "queued" : "unknown" };
}
//#endregion
//#region src/shared/subagents-format.ts
function formatTokenShort(value) {
	if (!value || !Number.isFinite(value) || value <= 0) return;
	const n = Math.floor(value);
	return formatCompactTokenCount(n, {
		thousandsPrecision: n >= 1e4 ? 0 : 1,
		trimTrailingZero: true
	});
}
function truncateLine(value, maxLength) {
	const limit = Math.max(0, Math.floor(maxLength));
	const trimmed = value.trimEnd();
	if (trimmed.length <= limit) return trimmed;
	const marker = "...";
	if (limit <= 3) return marker.slice(0, limit);
	return `${truncateUtf16Safe(trimmed, limit - 3).trimEnd()}${marker}`;
}
function resolveTotalTokens(entry) {
	if (!entry || typeof entry !== "object") return;
	if (typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens) && entry.totalTokensFresh === true && entry.totalTokensVersion === 1) return entry.totalTokens;
	const total = (typeof entry.inputTokens === "number" ? entry.inputTokens : 0) + (typeof entry.outputTokens === "number" ? entry.outputTokens : 0);
	return total > 0 ? total : void 0;
}
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
		if (isRetainedUnendedSubagentRun(entry, now) || isYieldedSubagentRun(entry) || params.countPendingDescendantRuns(entry.childSessionKey) > 0) active.push(entry);
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
	const privateReads = [];
	const entries = /* @__PURE__ */ new Map();
	const batches = /* @__PURE__ */ new Map();
	for (const run of runs) {
		if (!resolveSubagentChildAgentId(run)) continue;
		if (isIncognitoSessionKey(run.childSessionKey)) {
			privateReads.push(loadSubagentSessionEntry({
				...run,
				cfg
			}).then((entry) => {
				if (entry) entries.set(run.runId, entry);
			}));
			continue;
		}
		const owner = resolveSubagentChildSessionOwner(run, cfg);
		const batch = batches.get(owner.agentId);
		if (batch) batch.runs.push(run);
		else batches.set(owner.agentId, {
			...owner,
			runs: [run]
		});
	}
	const failure = (await Promise.allSettled(privateReads)).find((result) => result.status === "rejected");
	if (failure?.status === "rejected") throw failure.reason;
	for (const { agentId, storePath, runs: batchRuns } of batches.values()) {
		const selected = await readSessionEntriesFromStoreInWorker({
			agentId,
			storePath,
			sessionKeys: batchRuns.map((run) => run.childSessionKey),
			projection: "list"
		});
		const bySessionKey = new Map(selected.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
		for (const run of batchRuns) {
			const entry = bySessionKey.get(run.childSessionKey);
			if (entry) entries.set(run.runId, entry);
		}
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
		const children = childSessionsByController.get(controllerSessionKey) ?? [];
		children.push(childSessionKey);
		childSessionsByController.set(controllerSessionKey, children);
	}
	for (const [controllerSessionKey, childSessions] of childSessionsByController) childSessionsByController.set(controllerSessionKey, childSessions.toSorted());
	return childSessionsByController;
}
function buildSubagentList(params) {
	const { now, view: runView, childSessionsByController } = params.context;
	let index = 1;
	const buildListEntry = (entry, runtimeMs) => {
		const sessionEntry = params.sessionEntries.get(entry.runId);
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
