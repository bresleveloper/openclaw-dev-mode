import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { T as readCodexTurnCompletedNotification } from "./client-Cs08OXVQ.mjs";
import { h as getCodexAppServerTurnRouter } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { c as readCodexNotificationItem, s as isTerminalTurnStatus, t as CodexUsageProjection } from "./event-projector-usage-CnBS8Wa3.mjs";
import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/codex/src/app-server/ephemeral-turn.ts
/** One ephemeral turn; the client router owns correlation, buffering and request lifetime. */
var CodexEphemeralTurn = class {
	constructor(client, threadId, options) {
		this.options = options;
		this.completion = createDeferred();
		this.usage = new CodexUsageProjection();
		this.items = /* @__PURE__ */ new Map();
		this.assistantItems = /* @__PURE__ */ new Map();
		this.assistantText = "";
		this.route = getCodexAppServerTurnRouter(client).reserveThread({
			threadId,
			...options,
			onNotification: async (notification, scope) => {
				const params = isJsonObject(notification.params) ? notification.params : void 0;
				if (params && scope.turnId) {
					if (notification.method === "item/completed" && options.textMode === "all") {
						const item = readCodexNotificationItem(params);
						if (item) {
							this.items.set(item.id, item);
							if (item.type === "agentMessage" && item.text) this.assistantItems.set(item.id, item.text);
						}
					} else if (notification.method === "item/agentMessage/delta") {
						const delta = readStringField(params, "delta") ?? "";
						const itemId = readStringField(params, "itemId") ?? readStringField(params, "id") ?? "assistant";
						const firstDelta = !this.assistantText && Boolean(delta);
						this.assistantText += delta;
						if (delta && options.textMode === "all") this.assistantItems.set(itemId, `${this.assistantItems.get(itemId) ?? ""}${delta}`);
						if (firstDelta) await options.onAssistantMessageStart?.();
					} else if (notification.method === "rawResponse/completed") this.usage.record(params);
					else if (notification.method === "turn/completed") {
						const completed = readCodexTurnCompletedNotification(params);
						if (completed) {
							this.turn = completed.turn;
							this.completion.resolve();
						}
					} else if (notification.method === "error") {
						this.usage.invalidateContext();
						if (params.willRetry !== true) {
							this.error = params;
							this.completion.resolve();
						}
					}
				}
				await options.onNotification?.(notification, scope);
			}
		});
		this.route.armTurn();
	}
	get completed() {
		return this.turn !== void 0;
	}
	async wait(turn, options) {
		if (isTerminalTurnStatus(turn.status)) {
			this.turn = turn;
			this.completion.resolve();
		}
		const completion = this.route.bindTurn(turn.id, { completed: isTerminalTurnStatus(turn.status) }).then(() => this.completion.promise);
		const signals = [this.route.signal, options.signal];
		const abortError = () => options.signal.aborted ? options.abortError() : toStringifiedError(this.route.signal.reason);
		let timer;
		let abort = () => {};
		try {
			await Promise.race([completion, new Promise((_resolve, reject) => {
				abort = () => {
					if (options.signal.aborted || !this.route.completed) reject(abortError());
				};
				for (const signal of signals) {
					signal.addEventListener("abort", abort, { once: true });
					if (signal.aborted) abort();
				}
				const timeout = options.timeout;
				if (timeout) {
					timer = setTimeout(() => reject(timeout.error), timeout.ms);
					timer.unref?.();
				}
			})]);
		} finally {
			clearTimeout(timer);
			for (const signal of signals) signal.removeEventListener("abort", abort);
		}
		const items = new Map(this.items);
		for (const item of this.turn?.items ?? []) items.set(item.id, item);
		const messages = (this.options.textMode === "last" ? this.turn?.items ?? [] : [...items.values()]).filter((item) => item.type === "agentMessage").map((item) => item.text.trim()).filter(Boolean);
		const text = this.options.textMode === "last" ? messages.at(-1) || this.assistantText : messages.join("\n\n") || [...this.assistantItems.values()].map((message) => message.trim()).filter(Boolean).join("\n\n");
		return {
			turn: this.turn,
			error: this.error,
			items: [...items.values()],
			text: text.trim(),
			usage: this.usage.usage
		};
	}
};
//#endregion
export { CodexEphemeralTurn as t };
