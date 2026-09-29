import { v as parseDateFirstTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as resolveChannelConfigRecord } from "./channel-configured-shared-Cojxg7l6.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-CVHGcV8B.mjs";
import { i as getTaskPreparedActivity } from "./task-registry-activity-qvAA4Okp.mjs";
import { a as formatTaskStatusTitleText } from "./task-status-D1-umRs5.mjs";
import { t as mergeAccountConfig } from "./channel-account-config-DBuJQlcg.mjs";
import { D as resolveChannelStreamingPreviewToolProgress, E as resolveChannelStreamingPreviewCommandText, M as getProgressDraftLineText, O as resolveChannelStreamingProgressCommentary, i as copyProgressDraftLineMetadata, n as buildChannelProgressDraftLineForEntry, x as resolveChannelProgressDraftMaxLines } from "./streaming-BRWehz40.mjs";
import { t as getTaskExecutionObservation } from "./task-execution-observation-Dq08a4Iy.mjs";
import { n as createChannelProgressDraftCompositor } from "./progress-draft-compositor-BiyWLSal.mjs";
//#region src/tasks/task-progress-presentation.ts
async function prepareProgressContent(key, origin, rows, initialSnapshot, updates) {
	if (!origin?.channel) return;
	const channel = resolveChannelConfigRecord(getRuntimeConfig(), origin.channel) ?? void 0;
	const accounts = asOptionalRecord(channel?.accounts);
	const accountKey = resolveChannelAccountKey(accounts, origin.accountId ?? "default", origin.channel);
	const account = asOptionalRecord(accountKey ? accounts?.[accountKey] : void 0);
	const config = mergeAccountConfig({
		channelConfig: channel,
		accountConfig: account
	});
	const streaming = asOptionalRecord(config.streaming);
	const entry = { streaming: {
		...streaming,
		progress: {
			...asOptionalRecord(streaming?.progress),
			toolProgress: resolveChannelStreamingPreviewToolProgress({ streaming }, true, "progress"),
			commentary: resolveChannelStreamingProgressCommentary({ streaming }, true, "progress"),
			commandText: resolveChannelStreamingPreviewCommandText({ streaming }, "raw")
		}
	} };
	const budget = resolveChannelProgressDraftMaxLines(entry);
	const childLabels = /* @__PURE__ */ new Map();
	const observations = new Map(rows.map(({ task }) => [task.taskId, getTaskExecutionObservation(task)]));
	const prepareItem = (update) => {
		const { item, source } = update;
		if (!source) return item;
		const namespace = `${source.runId}:${source.generation}`;
		const itemId = `${namespace}:${item.itemId}`;
		const observation = observations.get(source.taskId);
		childLabels.set(itemId, source.label);
		return {
			...item,
			itemId,
			...item.toolCallId ? { toolCallId: `${namespace}:${item.toolCallId}` } : {},
			...item.kind === "preamble" && item.progressText ? { progressText: `${source.label}: ${item.progressText}` } : {},
			...item.status === "running" && observation?.state !== "running" ? {
				status: void 0,
				phase: "end",
				summary: "Current activity unavailable"
			} : {}
		};
	};
	const compositor = createChannelProgressDraftCompositor({
		entry,
		mode: "progress",
		active: true,
		preparedItems: true,
		reasoningGate: false,
		commentaryItalics: false,
		seed: key,
		initialSnapshot: initialSnapshot ? {
			...initialSnapshot,
			lines: initialSnapshot.lines.map((line) => {
				if (typeof line === "string" || line.status !== "running") return line;
				const historical = {
					...line,
					status: "last observed"
				};
				return {
					...historical,
					text: getProgressDraftLineText(historical)
				};
			})
		} : void 0,
		buildProgressEventLine: (input, options) => {
			const line = buildChannelProgressDraftLineForEntry(entry, input, options);
			const label = input.event === "item" && input.itemId ? childLabels.get(input.itemId) : void 0;
			if (!line || !label) return line;
			const labeled = {
				...line,
				label: `${label}: ${line.label}`,
				text: `${label}: ${line.text}`
			};
			copyProgressDraftLineMetadata(line, labeled);
			return labeled;
		}
	});
	let retained = 0;
	const streams = rows.map(({ task, entry: run }) => {
		const label = formatTaskStatusTitleText(task.label, "Subagent");
		const observation = observations.get(task.taskId);
		const taskItem = {
			itemId: `${`${run.runId}:${run.generation}`}:task`,
			kind: "subagent",
			phase: "update",
			title: observation.state === "finished" ? `${label} (${task.status})` : label,
			...observation.state === "running" ? { status: "running" } : observation.state === "finished" ? {
				phase: "end",
				status: task.status === "cancelled" ? void 0 : task.status === "succeeded" ? "completed" : "failed"
			} : {},
			...!initialSnapshot && observation.state === "running" && observation.currentTool ? { summary: observation.currentTool.name } : {},
			...observation.state === "unknown" ? { summary: "Current activity unavailable" } : {},
			...observation.state === "waiting" || observation.state === "queued" ? { summary: observation.state } : {}
		};
		const terminalItem = observation.state === "finished" ? taskItem : void 0;
		const items = terminalItem ? [] : [taskItem];
		const prepared = initialSnapshot ? getTaskPreparedActivity(task.taskId) : void 0;
		for (const item of prepared?.values() ?? []) items.push(prepareItem({
			item,
			source: {
				taskId: task.taskId,
				runId: run.runId,
				generation: run.generation ?? 0,
				label
			}
		}));
		const selected = items.slice(-budget);
		retained = Math.max(retained, selected.length);
		return {
			items: selected,
			terminalItem,
			at: parseDateFirstTimestampMs(observation.lastActivityAt) ?? task.createdAt
		};
	});
	streams.sort((left, right) => left.at - right.at);
	for (let offset = retained - 1; offset >= 0; offset -= 1) for (const { items } of streams) {
		const item = items[items.length - 1 - offset];
		if (item) await compositor.pushItemEvent(item);
	}
	for (const update of updates?.items ?? []) await compositor.pushItemEvent(prepareItem(update));
	for (const { terminalItem } of streams) if (terminalItem) await compositor.pushItemEvent(terminalItem);
	if (updates?.plan) await compositor.pushPlanProgress(updates.plan.steps, {
		explanation: updates.plan.explanation,
		explanationFormat: updates.plan.explanationFormat
	});
	return {
		content: compositor.getText(),
		snapshot: compositor.getSnapshot()
	};
}
//#endregion
export { prepareProgressContent };
