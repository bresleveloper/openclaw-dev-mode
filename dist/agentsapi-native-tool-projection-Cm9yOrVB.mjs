import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { r as projectAgentToolActivity } from "./agent-activity-events-CYq4KNEY.mjs";
import { d as sanitizeToolResult } from "./embedded-agent-tool-results-C0yTOgai.mjs";
import { a as formatNativeToolOutput, c as truncateNativeToolTranscriptText, i as TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS, n as NativeToolOutputAccumulator, o as formatNativeToolSummary, r as TOOL_PROGRESS_OUTPUT_MAX_CHARS, s as formatToolProgressOutput } from "./projection-tool-output-CKQ4iWL2.mjs";
import "./agent-harness-runtime-BxShxpgh.mjs";
import "./agent-harness-attempt-runtime-Dv3UHbll.mjs";
import { i as agentsApiNativeToolOutput, n as agentsApiNativeToolDetails, r as agentsApiNativeToolOutcome, t as agentsApiNativeTool } from "./agentsapi-native-items-MUuq5dsy.mjs";
import { o as recordAgentsApiNativeToolInvocation, s as recordAgentsApiNativeToolTranscript } from "./agentsapi-transcript-FYofGdvV.mjs";
import { createHash } from "node:crypto";
//#region extensions/agentsapi/agentsapi-native-tool-projection.ts
/** Native tools own lifecycle, bounded output, and canonical transcript facts. */
var AgentsApiNativeToolProjection = class {
	constructor(params, remoteSessionId, emit, assertCurrent, nextTimestamp, isPresentationEnabled) {
		this.params = params;
		this.remoteSessionId = remoteSessionId;
		this.emit = emit;
		this.assertCurrent = assertCurrent;
		this.nextTimestamp = nextTimestamp;
		this.isPresentationEnabled = isPresentationEnabled;
		this.items = /* @__PURE__ */ new Map();
		this.turnByItem = /* @__PURE__ */ new Map();
		this.output = new NativeToolOutputAccumulator("Agents API");
		this.metas = /* @__PURE__ */ new Map();
	}
	get toolMetas() {
		return [...this.metas.values()];
	}
	get lastToolError() {
		return this.nativeToolError;
	}
	get itemLifecycle() {
		const states = [...this.items.values()];
		const completedCount = states.filter((state) => state.terminal).length;
		return {
			startedCount: states.length,
			completedCount,
			activeCount: states.length - completedCount
		};
	}
	resolveTurnId(itemId) {
		return this.turnByItem.get(itemId);
	}
	async recordItem(turnId, item, terminal, enclosingStatus, canonical = false, recordTranscript = true) {
		this.assertCurrent();
		const tool = agentsApiNativeTool(item, this.params);
		if (!tool) return false;
		const id = this.identity(turnId, item.id);
		let state = this.items.get(id);
		if (state?.terminal && !canonical) return true;
		if (!state) {
			state = {
				turnId,
				item,
				tool,
				terminal: false,
				startProjected: false,
				callRecorded: false,
				resultRecorded: false,
				provisionalTerminalObserved: false,
				canonicalTerminalObserved: false,
				recoveredPartial: false,
				outputProgressChars: 0,
				outputProgressMessages: 0,
				commandOutputChars: 0,
				commandOutputMessages: 0
			};
			this.items.set(id, state);
			this.turnByItem.set(item.id, turnId);
		}
		state.item = item;
		state.tool = tool;
		if (canonical) state.canonicalItem = item;
		if (canonical && !terminal) {
			state.recoveredPartial = true;
			if (item.type === "command_execution" && typeof item.output === "string") {
				state.recoveredOutput = agentsApiNativeToolOutput(item);
				state.recoveredOutputTruncated = item.output.length > TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS;
			}
		}
		await this.startTool(state);
		if (canonical && recordTranscript && !state.callRecorded) state.callRecorded = await recordAgentsApiNativeToolInvocation(this.params, this.remoteSessionId, turnId, item, this.assertCurrent, this.nextTimestamp);
		if (terminal) await this.finishTool(state, enclosingStatus, canonical, recordTranscript);
		state.terminal = terminal;
		return true;
	}
	async reconcileRemaining(turnId, status, currentItemIds) {
		this.assertCurrent();
		let transcriptReady = true;
		for (const state of this.items.values()) {
			if (state.turnId !== turnId || state.resultRecorded && state.canonicalTerminalObserved) continue;
			if (!state.resultRecorded && !currentItemIds.has(state.item.id)) transcriptReady = false;
			await this.finishTool(state, status, true);
			state.terminal = true;
		}
		return transcriptReady;
	}
	async observeOutput(event) {
		this.assertCurrent();
		const state = this.eventItem(event);
		if (!state || state.terminal || state.recoveredPartial || state.item.type !== "command_execution" || !event.delta) return;
		const id = this.identity(state.turnId, state.item.id);
		const delta = sanitizeToolResult(event.delta);
		this.output.append(id, delta);
		if (state.commandOutputChars < 8e3 && state.commandOutputMessages < 20) {
			const remaining = TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.commandOutputChars;
			const text = truncateUtf16Safe(delta, remaining);
			state.commandOutputChars += text.length;
			state.commandOutputMessages += 1;
			await this.emit({
				stream: "command_output",
				data: {
					itemId: id,
					toolCallId: id,
					phase: "delta",
					name: state.tool.name,
					title: typeof state.tool.args.command === "string" ? state.tool.args.command : "Command output",
					output: delta.length > remaining ? `${text}\n...(truncated)...` : text,
					status: "running",
					...typeof state.tool.args.cwd === "string" ? { cwd: state.tool.args.cwd } : {}
				}
			});
		}
		await this.emitToolOutput(state, event.delta, false);
	}
	async startTool(state) {
		if (state.startProjected) return;
		const id = this.identity(state.turnId, state.item.id);
		const { name, args, meta, commandBearing } = state.tool;
		state.startProjected = true;
		this.metas.set(id, {
			toolCallId: id,
			toolName: name,
			...meta ? { meta } : {}
		});
		await this.emit({
			stream: "item",
			data: projectAgentToolActivity({
				toolCallId: id,
				name,
				phase: "start",
				args,
				meta
			})
		});
		await this.emit({
			stream: "tool",
			data: {
				phase: "start",
				itemId: id,
				toolCallId: id,
				name,
				args,
				...meta ? { meta } : {},
				...commandBearing ? { commandBearing: true } : {}
			}
		});
		if (this.shouldEmitToolResult()) await this.emitToolProgress(id, formatNativeToolSummary(name, this.formattedMeta(state.tool)));
	}
	async finishTool(state, enclosingStatus, canonical = false, recordTranscript = true) {
		const id = this.identity(state.turnId, state.item.id);
		const item = canonical ? state.canonicalItem ?? state.item : state.item;
		const tool = canonical && state.canonicalItem ? agentsApiNativeTool(state.canonicalItem, this.params) : state.tool;
		if (!tool) return;
		const { name, args, meta, commandBearing } = tool;
		const savedItemUnavailable = canonical && !state.canonicalItem;
		const outcome = savedItemUnavailable ? {
			status: enclosingStatus === "cancelled" ? "cancelled" : "unknown",
			isError: true,
			outcomeUnknown: enclosingStatus !== "cancelled",
			error: enclosingStatus === "cancelled" ? "Agents API native tool was cancelled" : "Agents API native tool item is unavailable in saved state"
		} : agentsApiNativeToolOutcome(item, enclosingStatus);
		const capturedOutput = state.recoveredOutput ?? this.output.textByItem.get(id);
		const output = agentsApiNativeToolOutput(item, capturedOutput);
		const details = {
			...agentsApiNativeToolDetails(this.remoteSessionId, state.turnId, item, outcome, capturedOutput),
			...savedItemUnavailable ? {
				savedItemAvailability: "unavailable",
				...item.type !== "web_search_call" ? { outputAvailability: output === void 0 ? "unavailable" : "partial" } : {}
			} : {}
		};
		const captureTruncated = item.output == null && (state.recoveredOutputTruncated || this.output.isTruncated(id));
		this.metas.set(id, {
			toolCallId: id,
			toolName: name,
			...meta ? { meta } : {},
			isError: outcome.isError
		});
		if (canonical && recordTranscript && state.canonicalItem && !state.resultRecorded) state.resultRecorded = await recordAgentsApiNativeToolTranscript(this.params, this.remoteSessionId, state.turnId, state.canonicalItem, this.assertCurrent, this.nextTimestamp, {
			enclosingStatus,
			capturedOutput,
			captureTruncated
		});
		if (canonical && (state.canonicalItem ? !state.canonicalTerminalObserved : !state.provisionalTerminalObserved)) {
			this.assertCurrent();
			const resolution = this.params.observeToolTerminal?.({
				toolCallId: id,
				toolName: name,
				arguments: args,
				...meta ? { meta } : {},
				executionStarted: true,
				outcome: outcome.isError ? "failure" : "success",
				...outcome.isError ? { failure: {
					...outcome.error ? { error: outcome.error } : {},
					...outcome.errorCode ? { errorCode: outcome.errorCode } : {}
				} } : {},
				nativeMutation: {
					mutatingAction: item.type !== "web_search_call",
					replaySafe: item.type === "web_search_call"
				}
			});
			this.assertCurrent();
			if (state.canonicalItem) state.canonicalTerminalObserved = true;
			else state.provisionalTerminalObserved = true;
			if (resolution) this.nativeToolError = resolution.lastToolError;
			else if (outcome.isError) this.nativeToolError = {
				toolName: name,
				...meta ? { meta } : {},
				...outcome.error ? { error: outcome.error } : {},
				...outcome.errorCode ? { errorCode: outcome.errorCode } : {},
				...item.type !== "web_search_call" ? { mutatingAction: true } : {}
			};
			else if (this.nativeToolError?.mutatingAction !== true) this.nativeToolError = void 0;
		}
		this.assertCurrent();
		if (!this.isPresentationEnabled()) return;
		const commandFacts = commandBearing ? {
			title: typeof args.command === "string" ? args.command : "Command output",
			...!savedItemUnavailable && typeof item.exit_code === "number" ? { exitCode: item.exit_code } : {},
			...!savedItemUnavailable && typeof item.duration_ms === "number" ? { durationMs: item.duration_ms } : {},
			...typeof args.cwd === "string" ? { cwd: args.cwd } : {}
		} : void 0;
		const presentationOutput = output !== void 0 && commandBearing ? formatToolProgressOutput(output) ?? "" : output;
		const toolSnapshot = {
			phase: "result",
			itemId: id,
			toolCallId: id,
			name,
			args,
			status: outcome.status,
			isError: outcome.isError,
			result: details,
			...presentationOutput !== void 0 ? { output: presentationOutput } : {},
			...meta ? { meta } : {},
			...commandBearing ? {
				commandBearing: true,
				...commandFacts
			} : {}
		};
		const itemSnapshot = projectAgentToolActivity({
			toolCallId: id,
			name,
			phase: "result",
			args,
			meta,
			status: outcome.status === "cancelled" ? "unknown" : outcome.status,
			result: { details },
			isError: outcome.isError
		});
		const commandSnapshot = commandFacts ? {
			itemId: id,
			toolCallId: id,
			phase: "end",
			name,
			...commandFacts,
			...presentationOutput !== void 0 ? { output: presentationOutput } : {},
			status: outcome.status
		} : void 0;
		const projectionHash = nativeTerminalProjectionHash({
			tool: toolSnapshot,
			item: itemSnapshot,
			command: commandSnapshot
		});
		if (state.terminalProjectionHash === projectionHash) return;
		const replacement = {
			replaceable: true,
			...state.terminalProjectionHash ? { replace: true } : {}
		};
		await this.emit({
			stream: "tool",
			data: {
				...toolSnapshot,
				...replacement
			}
		});
		await this.emit({
			stream: "item",
			data: {
				...itemSnapshot,
				...replacement
			}
		});
		if (commandSnapshot) await this.emit({
			stream: "command_output",
			data: {
				...commandSnapshot,
				...replacement
			}
		});
		state.terminalProjectionHash = projectionHash;
		if (output !== void 0 && state.outputProgressMessages === 0) await this.emitToolOutput(state, output, true, outcome.isError);
	}
	async emitToolOutput(state, output, terminal, isError = false) {
		if (!this.shouldEmitToolOutput() || state.outputProgressChars >= 8e3 || state.outputProgressMessages >= 20) return;
		const remaining = TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.outputProgressChars;
		const sanitized = sanitizeToolResult(output);
		const truncated = sanitized.length > remaining;
		const text = truncateUtf16Safe(sanitized, remaining);
		state.outputProgressChars += text.length;
		state.outputProgressMessages += 1;
		await this.emitToolProgress(this.identity(state.turnId, state.item.id), formatNativeToolOutput(state.tool.name, this.formattedMeta(state.tool), truncated ? `${text}\n...(truncated)...` : text), terminal && isError);
	}
	async emitToolProgress(itemId, text, isError = false) {
		this.assertCurrent();
		if (!this.isPresentationEnabled()) return;
		await this.params.onToolResult?.({
			text: truncateNativeToolTranscriptText(text, "Agents API"),
			...this.params.messageChannel || this.params.messageProvider ? { channelData: { openclawToolProgressId: `tool:${itemId}` } } : {},
			...isError ? { isError: true } : {}
		});
		this.assertCurrent();
	}
	formattedMeta(tool) {
		return !tool.commandBearing || !(this.params.messageChannel ?? this.params.messageProvider) && this.shouldEmitToolOutput() ? tool.meta : void 0;
	}
	shouldEmitToolResult() {
		this.assertCurrent();
		if (!this.isPresentationEnabled()) return false;
		return this.params.shouldEmitToolResult?.() ?? (this.params.verboseLevel === "on" || this.params.verboseLevel === "full");
	}
	shouldEmitToolOutput() {
		this.assertCurrent();
		if (!this.isPresentationEnabled()) return false;
		return this.params.shouldEmitToolOutput?.() ?? this.params.verboseLevel === "full";
	}
	eventItem(event) {
		if (!event.item_id) throw new Error("Agents API output event has no item identity");
		const turnId = event.turn_id ?? this.turnByItem.get(event.item_id);
		return turnId ? this.items.get(this.identity(turnId, event.item_id)) : void 0;
	}
	identity(turnId, itemId) {
		return `agentsapi:${this.remoteSessionId}:${turnId}:${itemId}`;
	}
};
function nativeTerminalProjectionHash(snapshot) {
	return createHash("sha256").update(JSON.stringify(snapshot, (_key, value) => {
		if (value === null || typeof value !== "object" || Array.isArray(value)) return value;
		return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0));
	})).digest("hex");
}
//#endregion
export { AgentsApiNativeToolProjection as t };
