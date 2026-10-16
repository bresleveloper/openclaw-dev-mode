import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { l as isSyntheticMissingToolResult } from "./tool-result-pairing-DxxMHOQj.mjs";
import { o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { a as readNestedToolActivity, r as nestedToolActivityContent } from "./nested-tool-activity-CFIuxE4G.mjs";
import { n as isToolResultError } from "./tool-result-error-DGhCl3TG.mjs";
import { c as unwrapToolCallForDisplay, i as isCommandBearingToolCall, o as resolveToolDisplay, r as inferToolMetaFromArgsCore } from "./tool-display-B85JC1BH.mjs";
import { a as readToolErrorFlag, i as isToolResultContentType, n as isToolCallContentType, o as resolveToolUseId } from "./tool-content-SH_V-fgH.mjs";
import { n as projectAgentActivityItem, r as resolveCompletedActivityWrappers } from "./agent-activity-presentation-BdV3Df9D.mjs";
import { n as isProcessPollResultDetails } from "./bash-tools.process-schema-Bj9Dor0l.mjs";
//#region src/infra/agent-activity-events.ts
function projectAgentToolActivity(tool) {
	const input = {
		name: tool.name,
		args: tool.args
	};
	const unwrapped = unwrapToolCallForDisplay(input);
	const call = unwrapped === input && tool.presentationName ? {
		name: tool.presentationName,
		args: tool.args
	} : unwrapped;
	const meta = tool.meta ?? inferToolMetaFromArgsCore(call.name, call.args);
	const label = resolveToolDisplay(call).label;
	const details = asOptionalRecord(asOptionalRecord(tool.result)?.details);
	const approval = tool.phase === "result" && (details?.status === "approval-pending" || details?.status === "approval-unavailable");
	const skipped = tool.phase === "result" && details?.status === "skipped";
	const status = tool.phase !== "result" ? "running" : skipped && details.deniedReason === "steering" ? "skipped" : approval || skipped ? "blocked" : tool.status === "unknown" ? void 0 : tool.status ?? (tool.isError === true ? "failed" : tool.isError === false ? "completed" : void 0);
	return {
		...projectAgentActivityItem({
			itemId: `tool:${tool.toolCallId}`,
			toolCallId: tool.toolCallId,
			name: tool.name,
			kind: "tool",
			phase: tool.phase === "result" ? "end" : tool.phase,
			title: meta ? `${label} ${meta}` : label,
			...status ? { status } : {
				summary: "Outcome unknown",
				title: `${label} — outcome unknown`
			},
			...approval ? {
				approvalId: normalizeOptionalString(details?.approvalId),
				approvalSlug: normalizeOptionalString(details?.approvalSlug),
				summary: details?.status === "approval-pending" ? "Awaiting approval before command can run." : "Command is blocked because no interactive approval route is available."
			} : {},
			...skipped ? { summary: "Skipped" } : {},
			...meta ? { meta } : {},
			commandBearing: isCommandBearingToolCall(call.name, call.args),
			...tool.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		}, {
			args: tool.args,
			result: tool.result,
			nativeOperation: tool.nativeOperation
		}),
		name: call.name
	};
}
function projectAgentHistoryActivity(messages) {
	const facts = /* @__PURE__ */ new Map();
	let turn = 0;
	const entries = messages.map(({ messageId, message }) => {
		const record = asOptionalRecord(message);
		const metadata = asOptionalRecord(record?.["__openclaw"]);
		if (record?.role === "user" && !metadata?.steerTargetRunId && !(record.excludeFromContext === true && metadata?.contextFreeCommand === true)) turn += 1;
		const nestedActivity = readNestedToolActivity(message);
		const nested = nestedActivity?.details;
		const blocks = (nestedActivity ? nestedToolActivityContent(nestedActivity) : Array.isArray(record?.content) ? record.content : []).flatMap((block) => {
			const value = asOptionalRecord(block);
			return value && (isToolCallContentType(value.type) || isToolResultContentType(value.type)) ? [value] : [];
		});
		if (record && (isToolResultContentType(record.role) || record.role === "tool" || record.role === "function")) blocks.splice(0, blocks.length, record);
		return {
			messageId,
			hasTools: blocks.length > 0,
			blocks: blocks.map((block, index) => {
				const toolCallId = normalizeOptionalString(block.toolCallId) ?? normalizeOptionalString(block.tool_call_id) ?? normalizeOptionalString(block.toolUseId) ?? normalizeOptionalString(block.tool_use_id) ?? (block === record ? void 0 : resolveToolUseId(block));
				const recordedRunId = normalizeOptionalString(block.runId) ?? nested?.runId ?? readSessionTranscriptRunId(message) ?? normalizeOptionalString(record?.runId);
				return {
					block,
					runId: recordedRunId ? JSON.stringify([turn, recordedRunId]) : void 0,
					parentToolCallId: nested && nested.toolCallId === toolCallId ? nested.parentToolCallId : normalizeOptionalString(block.parentToolCallId),
					key: toolCallId ? JSON.stringify([
						turn,
						nested?.runId ?? readSessionTranscriptRunId(message),
						nested?.scopeId,
						toolCallId
					]) : "history:" + messageId + ":" + index,
					toolCallId: toolCallId ?? "history:" + messageId + ":" + index,
					callId: toolCallId,
					executedArgs: nested && nested.toolCallId === toolCallId ? nested.input : void 0,
					isError: readToolErrorFlag(block) ?? (record ? readToolErrorFlag(record) : void 0) ?? (typeof nested?.isError === "boolean" ? nested.isError : void 0)
				};
			})
		};
	});
	const groups = /* @__PURE__ */ new Map();
	for (const { blocks } of entries) for (const { block, key } of blocks) {
		const group = groups.get(key) ?? {
			calls: 0,
			results: 0,
			synthetic: 0
		};
		group[isToolCallContentType(block.type) ? "calls" : isSyntheticMissingToolResult(block) ? "synthetic" : "results"] += 1;
		groups.set(key, group);
	}
	for (const entry of entries) {
		entry.blocks = entry.blocks.filter(({ block, key }) => {
			const group = groups.get(key);
			return !(group.calls <= 1 && group.results === 1 && isSyntheticMissingToolResult(block));
		});
		for (const [index, block] of entry.blocks.entries()) {
			const group = groups.get(block.key);
			if (group.calls > 1 || group.results + (group.results === 1 ? 0 : group.synthetic) > 1) block.key = "history:" + entry.messageId + ":" + index;
		}
	}
	for (const { blocks } of entries) for (const { block, key, toolCallId, callId, executedArgs, runId, parentToolCallId } of blocks) if (isToolCallContentType(block.type)) {
		const name = normalizeOptionalString(block.name) ?? normalizeOptionalString(block.toolName) ?? "Tool";
		facts.set(key, {
			toolCallId,
			callId,
			runId,
			parentToolCallId,
			name,
			presentationName: unwrapToolCallForDisplay({
				name,
				args: executedArgs ?? block.arguments ?? block.args ?? block.input
			}).name,
			phase: "result",
			args: executedArgs
		});
	}
	for (const { blocks } of entries) for (const { block, key, toolCallId, callId, executedArgs, isError, runId, parentToolCallId } of blocks) {
		if (isToolCallContentType(block.type)) continue;
		const call = facts.get(key);
		const name = call?.name ?? normalizeOptionalString(block.toolName) ?? normalizeOptionalString(block.name) ?? "Tool";
		const failed = isError === true || isToolResultError(block);
		const details = asOptionalRecord(block.details);
		const exitReasonLost = (name === "exec" || name === "bash" || name === "process") && details?.status === "completed" && typeof details.exitCode === "number" && Number.isFinite(details.exitCode) && details.exitCode !== 0 && details.persistedDetailsTruncated === true && details.exitReason === void 0 && Array.isArray(details.originalDetailKeys) && details.originalDetailKeys.includes("exitReason");
		const poll = name === "process" && isProcessPollResultDetails(details);
		facts.set(key, {
			...call,
			toolCallId,
			callId,
			runId: call?.runId ?? runId,
			parentToolCallId: call?.parentToolCallId ?? parentToolCallId,
			name,
			phase: "result",
			args: executedArgs ?? call?.args,
			result: block,
			isError: failed ? true : poll ? false : isError,
			...!failed && exitReasonLost ? { status: "unknown" } : {},
			...poll ? { nativeOperation: "process.poll" } : {}
		});
	}
	const prepared = [...facts].map(([key, fact]) => ({
		key,
		callId: fact.callId,
		runId: fact.runId,
		parentToolCallId: fact.parentToolCallId,
		activity: projectAgentToolActivity({
			...fact,
			...fact.name === "collab.wait" ? { nativeOperation: "wait" } : {}
		})
	}));
	const wrappers = resolveCompletedActivityWrappers(prepared);
	const preparedByKey = new Map(prepared.map((call) => [call.key, call]));
	return entries.flatMap(({ messageId, blocks, hasTools }) => {
		if (!hasTools) return [];
		const items = /* @__PURE__ */ new Map();
		for (const { key } of blocks) {
			const call = preparedByKey.get(key);
			if (!call || wrappers.has(call)) continue;
			const item = call.activity;
			if (!item.hideFromChannelProgress && !item.suppressChannelProgress) items.set(item.itemId, item);
		}
		return [{
			messageId,
			items: [...items.values()]
		}];
	});
}
/** Emits a typed activity event on the shared agent event bus. */
function emitAgentActivityEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: params.stream,
		data: params.data,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
}
//#endregion
export { projectAgentHistoryActivity as n, projectAgentToolActivity as r, emitAgentActivityEvent as t };
