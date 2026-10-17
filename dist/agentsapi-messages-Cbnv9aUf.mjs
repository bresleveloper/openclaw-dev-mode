import { r as calculateCost } from "./llm-BoijNIT8.mjs";
import { u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { i as classifyAgentHarnessTerminalOutcome } from "./agent-harness-runtime-C7pYQoeO.mjs";
import { n as createAgentHarnessAssistantMessage } from "./agent-harness-attempt-runtime-CuLbs8yz.mjs";
import { n as isAgentsApiTerminalTurn } from "./agentsapi-client-BrHNqiHF.mjs";
import { a as readTextParts, i as joinTextParts, n as canRecordAgentsApiTranscriptText, r as iterateAgentsApiTranscriptItems, t as appendAgentsApiTranscriptMessage } from "./agentsapi-transcript-DLQWS8fR.mjs";
import { t as AgentsApiNativeToolProjection } from "./agentsapi-native-tool-projection-HApsASJY.mjs";
import { t as readAgentsApiFinalText } from "./agentsapi-text-6tGD83zZ.mjs";
import { n as makeAgentsApiZeroUsage, t as aggregateAgentsApiUsage } from "./agentsapi-usage-C2BXnbjE.mjs";
//#region extensions/agentsapi/agentsapi-messages.ts
/** Native identities keep saved-state recovery and live events on the same projection. */
var AgentsApiMessageProjection = class {
	constructor(params, remoteSessionId, emitEvent, assertCurrent) {
		this.params = params;
		this.remoteSessionId = remoteSessionId;
		this.emitEvent = emitEvent;
		this.assertCurrent = assertCurrent;
		this.reply = { assistantUsage: makeAgentsApiZeroUsage() };
		this.items = /* @__PURE__ */ new Map();
		this.turnByItem = /* @__PURE__ */ new Map();
		this.eventIds = /* @__PURE__ */ new Set();
		this.unknownTypes = /* @__PURE__ */ new Set();
		this.usageByTurn = /* @__PURE__ */ new Map();
		this.canonicalUsageRecorded = false;
		this.reasoningOpen = false;
		this.lastReasoningText = "";
		this.timestamp = Date.now();
		this.presentationEnabled = true;
		this.transcriptOrderingGapReported = false;
		this.recordedGatewayCallIds = /* @__PURE__ */ new Set();
		this.nativeTools = new AgentsApiNativeToolProjection(params, remoteSessionId, (event) => this.emit(event), assertCurrent, () => this.nextTimestamp(), () => this.presentationEnabled);
	}
	get toolMetas() {
		return this.nativeTools.toolMetas;
	}
	get lastToolError() {
		return this.nativeTools.lastToolError;
	}
	get itemLifecycle() {
		const states = [...this.items.values()];
		const completedCount = states.filter((state) => state.terminal).length;
		const tools = this.nativeTools.itemLifecycle;
		return {
			startedCount: states.length + tools.startedCount,
			completedCount: completedCount + tools.completedCount,
			activeCount: states.length - completedCount + tools.activeCount
		};
	}
	get resultClassification() {
		return this.classification;
	}
	recordUsage(model, turns) {
		const contributions = new Map(this.usageByTurn);
		for (const turn of new Map(turns.map((record) => [record.id, record])).values()) {
			const normalized = normalizeUsage(turn.usage);
			if (normalized) contributions.set(turn.id, normalized);
		}
		this.canonicalUsageRecorded = true;
		const aggregated = aggregateAgentsApiUsage(model, contributions.values());
		this.reply.usage = aggregated.usage;
		this.reply.assistantUsage = aggregated.assistantUsage;
	}
	get tokenUsage() {
		if (this.canonicalUsageRecorded) return this.reply.usage;
		const usage = { contextUsage: { state: "unavailable" } };
		for (const contribution of this.usageByTurn.values()) for (const bucket of [
			"input",
			"output",
			"cacheRead",
			"cacheWrite",
			"reasoningTokens",
			"total"
		]) {
			const value = contribution[bucket];
			if (value !== void 0) usage[bucket] = (usage[bucket] ?? 0) + value;
		}
		return usage;
	}
	async observe(event) {
		this.assertCurrent();
		if (this.finalTurnId || event.event_id && this.eventIds.has(event.event_id)) return;
		if (event.event_id) {
			this.eventIds.add(event.event_id);
			if (this.eventIds.size > 4096) {
				const oldest = this.eventIds.values().next().value;
				if (oldest !== void 0) this.eventIds.delete(oldest);
			}
		}
		if (event.turn?.subagent_id === null && [
			"agent.session.turn.completed",
			"agent.session.turn.failed",
			"agent.session.turn.cancelled"
		].includes(event.type)) this.recordTurnUsage({
			...event.turn,
			usage: event.usage ?? event.turn.usage
		});
		if (event.item) {
			const turnId = event.item.turn_id ?? event.turn_id ?? this.turnByItem.get(event.item.id) ?? this.nativeTools.resolveTurnId(event.item.id);
			if (!turnId) throw new Error("Agents API output item has no turn identity");
			await this.recordItem(turnId, event.item, event.type === "agent.session.turn.item.done");
			return;
		}
		if (event.type === "agent.output.command_execution_output.delta") {
			await this.nativeTools.observeOutput(event);
			return;
		}
		if (event.type === "agent.session.turn.output_text.delta" || event.type === "agent.session.turn.output_text.done" || (event.type === "agent.session.turn.content_part.added" || event.type === "agent.session.turn.content_part.done") && event.part?.type === "output_text") {
			const state = this.eventItem(event);
			if (!state || state.terminal) return;
			if (state.recoveredPartial && !event.type.endsWith(".done")) return;
			const index = event.content_index ?? 0;
			state.texts.set(index, event.type.endsWith(".delta") ? (state.texts.get(index) ?? "") + (event.delta ?? "") : event.text ?? event.part?.text ?? "");
			await this.emitAssistant(state, false, event.delta ?? "");
			return;
		}
		if (event.type.startsWith("agent.session.turn.reasoning_summary_")) {
			const state = this.eventItem(event);
			if (!state || state.terminal) return;
			if (state.recoveredPartial && !event.type.endsWith(".done")) return;
			const index = event.summary_index ?? 0;
			if (event.type.endsWith("text.delta")) state.summaries.set(index, (state.summaries.get(index) ?? "") + (event.delta ?? ""));
			else if (event.type.endsWith("text.done") || event.type.endsWith("part.done")) state.summaries.set(index, event.text ?? event.part?.text ?? "");
			else if (event.part?.text) state.summaries.set(index, event.part.text);
			await this.emitReasoning();
			return;
		}
		if (event.type.startsWith("agent.session.environment.")) {
			await this.emitEnvironment(event);
			return;
		}
		if (!INTERNAL_EVENT_TYPES.has(event.type)) this.recordUnknownType(event.type);
	}
	recordGatewayTranscriptReceipt(turnId, callId) {
		this.assertCurrent();
		this.recordedGatewayCallIds.add(`${turnId}:${callId}`);
	}
	reportTranscriptOrderingGap() {
		this.assertCurrent();
		if (this.transcriptOrderingGapReported) return;
		this.transcriptOrderingGapReported = true;
		log.warn("Agents API canonical transcript prefix is unavailable; host input and tool receipts retain their existing placement");
	}
	async reconcile(turn, items, options = {}) {
		this.assertCurrent();
		if (this.finalTurnId) return true;
		const previousPresentation = this.presentationEnabled;
		this.presentationEnabled = previousPresentation && options.presentation !== false;
		try {
			let transcriptReady = true;
			const terminalTurn = isAgentsApiTerminalTurn(turn.status);
			for (const projected of iterateAgentsApiTranscriptItems(turn.id, items, turn.status, terminalTurn, this.recordedGatewayCallIds, (itemId) => this.items.get(this.identity(turn.id, itemId))?.completionObserved === true)) {
				const { item, terminal } = projected;
				transcriptReady = projected.transcriptReady;
				await this.recordItem(turn.id, item, terminal, turn.status, true, transcriptReady || terminalTurn);
			}
			this.recordTurnUsage(turn);
			if (isAgentsApiTerminalTurn(turn.status)) {
				for (const state of this.items.values()) {
					if (state.turnId !== turn.id || state.terminal) continue;
					state.terminal = true;
				}
				transcriptReady = await this.nativeTools.reconcileRemaining(turn.id, turn.status, new Set(items.map((item) => item.id))) && transcriptReady;
				if (!transcriptReady) this.reportTranscriptOrderingGap();
			}
			return transcriptReady;
		} finally {
			this.presentationEnabled = previousPresentation;
		}
	}
	async commit(turn, items) {
		this.assertCurrent();
		if (this.finalTurnId) {
			if (this.finalTurnId !== turn.id) throw new Error("Agents API reply was already committed for a different terminal turn");
			return;
		}
		if (!await this.reconcile(turn, items)) this.reportTranscriptOrderingGap();
		await this.endReasoning();
		const text = readAgentsApiFinalText(items);
		const assistant = createAgentHarnessAssistantMessage(this.attribution(), text, {
			tokenUsage: this.tokenUsage,
			aborted: turn.status === "cancelled",
			promptError: turn.error?.message,
			timestamp: this.nextTimestamp()
		});
		if (this.canonicalUsageRecorded) assistant.usage = this.reply.assistantUsage;
		else {
			if (this.usageByTurn.size > 0) calculateCost(this.params.model, assistant.usage);
			this.reply.usage = normalizeUsage(assistant.usage);
			this.reply.assistantUsage = assistant.usage;
		}
		this.classification = classifyAgentHarnessTerminalOutcome({
			assistantTexts: [text],
			reasoningText: this.reasoningText(),
			promptError: turn.error,
			turnCompleted: isAgentsApiTerminalTurn(turn.status)
		});
		if (text) {
			this.reply.lastAssistant = await this.append({
				...assistant,
				idempotencyKey: `agentsapi:${this.remoteSessionId}:${turn.id}`
			});
			this.assertCurrent();
			await this.params.onAssistantMessageStart?.();
			this.assertCurrent();
		}
		await this.emitAssistantSnapshot(`agentsapi:${this.remoteSessionId}:${turn.id}:reply`, text);
		if (text) {
			this.assertCurrent();
			await this.params.onPartialReply?.({ text });
			this.assertCurrent();
		}
		this.finalTurnId = turn.id;
	}
	async commitUsage(turn) {
		this.assertCurrent();
		if (this.reply.usage?.total === void 0) return;
		await this.append({
			...createAgentHarnessAssistantMessage(this.attribution(), "", {
				aborted: false,
				content: [],
				timestamp: this.nextTimestamp()
			}),
			usage: this.reply.assistantUsage,
			idempotencyKey: `agentsapi:${this.remoteSessionId}:${turn.id}`
		});
	}
	async recordItem(turnId, item, terminal, enclosingStatus, canonical = false, recordTranscript = true) {
		if (item.type === "function_call" || item.type === "function_call_output" || item.role === "user") return;
		if (await this.nativeTools.recordItem(turnId, item, terminal, enclosingStatus, canonical, recordTranscript)) return;
		if (item.type !== "message" && item.type !== "reasoning") {
			this.recordUnknownType(`item:${item.type}`);
			return;
		}
		const id = this.identity(turnId, item.id);
		let state = this.items.get(id);
		if (state?.terminal && !canonical) return;
		if (!state) {
			state = {
				turnId,
				item,
				terminal: false,
				completionObserved: false,
				texts: /* @__PURE__ */ new Map(),
				summaries: /* @__PURE__ */ new Map(),
				recoveredPartial: false
			};
			this.items.set(id, state);
			this.turnByItem.set(item.id, turnId);
		}
		state.item = item;
		if (!canonical && terminal) state.completionObserved = true;
		if (canonical && !terminal) state.recoveredPartial = true;
		if (item.type === "message" && item.role === "assistant") {
			if (terminal || canonical || state.texts.size === 0) state.texts = readTextParts(item.content, "output_text");
			await this.emitAssistant(state, terminal);
			if (canonical && recordTranscript && canRecordAgentsApiTranscriptText(item, enclosingStatus, state.completionObserved) && item.phase === "commentary" && joinTextParts(state.texts)) await this.append({
				...createAgentHarnessAssistantMessage(this.attribution(), joinTextParts(state.texts), {
					aborted: false,
					timestamp: this.nextTimestamp()
				}),
				openclawStreamFallback: {
					replacementText: joinTextParts(state.texts),
					source: "segment",
					itemId: id
				},
				idempotencyKey: `${id}:commentary`
			});
		} else if (item.type === "reasoning") {
			if (terminal || canonical || state.summaries.size === 0) state.summaries = readTextParts(item.summary, "summary_text");
			await this.emitReasoning();
			if (terminal) {
				const text = joinTextParts(state.summaries);
				if (canonical && recordTranscript && canRecordAgentsApiTranscriptText(item, enclosingStatus, state.completionObserved) && text) await this.append({
					...createAgentHarnessAssistantMessage(this.attribution(), "", {
						aborted: false,
						timestamp: this.nextTimestamp(),
						content: [{
							type: "thinking",
							thinking: text
						}]
					}),
					idempotencyKey: `${id}:reasoning`
				});
				await this.endReasoning();
			}
		}
		state.terminal = terminal;
	}
	async emitAssistant(state, terminal, delta = "") {
		const id = this.identity(state.turnId, state.item.id);
		const text = joinTextParts(state.texts);
		if (state.item.phase === "commentary") {
			const phase = terminal ? "end" : "update";
			if (!text.trim() || state.lastCommentary?.phase === phase && state.lastCommentary.text === text) return;
			state.lastCommentary = {
				phase,
				text
			};
			await this.emit({
				stream: "item",
				data: {
					itemId: id,
					kind: "preamble",
					title: "Preamble",
					phase,
					progressText: text,
					source: "agentsapi"
				}
			});
			return;
		}
		if (!text || state.lastAssistantText === text) return;
		state.lastAssistantText = text;
		await this.emitAssistantSnapshot(id, text, delta);
	}
	async emitAssistantSnapshot(itemId, text, delta = "") {
		const replace = this.visibleAssistantItemId !== itemId;
		this.visibleAssistantItemId = itemId;
		await this.emit({
			stream: "assistant",
			data: {
				itemId,
				text,
				delta: replace ? "" : delta,
				replaceable: true,
				...replace ? { replace: true } : {}
			}
		});
	}
	async emitReasoning() {
		this.assertCurrent();
		if (!this.presentationEnabled) return;
		const text = this.reasoningText();
		if (!text.trim() || text === this.lastReasoningText) return;
		this.lastReasoningText = text;
		this.reasoningOpen = true;
		this.assertCurrent();
		await this.params.onReasoningStream?.({
			text,
			isReasoningSnapshot: true
		});
		this.assertCurrent();
	}
	async endReasoning() {
		if (!this.reasoningOpen) return;
		this.reasoningOpen = false;
		this.assertCurrent();
		if (!this.presentationEnabled) return;
		await this.params.onReasoningEnd?.();
		this.assertCurrent();
	}
	reasoningText() {
		return [...this.items.values()].filter((state) => state.item.type === "reasoning").map((state) => joinTextParts(state.summaries)).filter((text) => text.trim()).join("\n\n");
	}
	recordTurnUsage(turn) {
		this.assertCurrent();
		if (this.canonicalUsageRecorded) return;
		const usage = normalizeUsage(turn.usage) ?? this.usageByTurn.get(turn.id);
		if (!usage) return;
		this.usageByTurn.set(turn.id, {
			...usage,
			contextUsage: { state: "unavailable" }
		});
	}
	async emitEnvironment(event) {
		const status = event.type.slice(26);
		if (!ENVIRONMENT_TITLES.has(status)) {
			this.recordUnknownType(event.type);
			return;
		}
		await this.emit({
			stream: "item",
			data: {
				itemId: `agentsapi:${this.remoteSessionId}:environment`,
				kind: "environment",
				title: ENVIRONMENT_TITLES.get(status),
				phase: status === "pending" ? "start" : "end",
				...status === "disconnected" ? { summary: "Connection unavailable" } : { status: status === "failed" ? "failed" : status === "pending" ? "running" : "completed" },
				source: "agentsapi"
			}
		});
	}
	recordUnknownType(type) {
		const safeType = type.replace(/[^a-zA-Z0-9_.:-]/gu, "?").slice(0, 128);
		if (this.unknownTypes.size >= 20 || this.unknownTypes.has(safeType)) return;
		this.unknownTypes.add(safeType);
		log.debug("Agents API projection omitted an unfamiliar native type", { type: safeType });
	}
	eventItem(event) {
		if (!event.item_id) throw new Error("Agents API output event has no item identity");
		const turnId = event.turn_id ?? this.turnByItem.get(event.item_id);
		return turnId ? this.items.get(this.identity(turnId, event.item_id)) : void 0;
	}
	identity(turnId, itemId) {
		return `agentsapi:${this.remoteSessionId}:${turnId}:${itemId}`;
	}
	attribution() {
		return {
			api: "openai-agents",
			provider: "openai",
			modelId: this.params.model.id
		};
	}
	nextTimestamp() {
		this.timestamp = Math.max(Date.now(), this.timestamp + 1);
		return this.timestamp;
	}
	async emit(event) {
		this.assertCurrent();
		if (!this.presentationEnabled) return;
		await this.emitEvent(event);
		this.assertCurrent();
	}
	append(message) {
		return appendAgentsApiTranscriptMessage(this.params, message, this.assertCurrent);
	}
};
const INTERNAL_EVENT_TYPES = /* @__PURE__ */ new Set([
	"error",
	"agent.session.created",
	"agent.session.idle",
	"agent.session.in_progress",
	"agent.session.requires_action",
	"agent.session.failed",
	"agent.session.error",
	"agent.session.turn.created",
	"agent.session.turn.in_progress",
	"agent.session.turn.completed",
	"agent.session.turn.failed",
	"agent.session.turn.cancelled",
	"agent.session.turn.content_part.added",
	"agent.session.turn.content_part.done",
	"agent.session.subagent.active",
	"agent.session.subagent.closed",
	"agent.session.subagent.created"
]);
const ENVIRONMENT_TITLES = /* @__PURE__ */ new Map([
	["pending", "Agent environment starting"],
	["ready", "Agent environment ready"],
	["connected", "Agent environment connected"],
	["disconnected", "Agent environment disconnected"],
	["failed", "Agent environment failed"]
]);
//#endregion
export { AgentsApiMessageProjection as t };
