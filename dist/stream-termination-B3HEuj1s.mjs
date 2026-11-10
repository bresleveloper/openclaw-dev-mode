import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { S as createAssistantMessageEventStream } from "./llm-YCnSGJtn.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { s as createEmptyTransportUsage } from "./provider-transport-runtime-DyX8vIBV.mjs";
//#region extensions/opencode-go/stream-termination.ts
/**
* Default idle window used in production. Matches the runtime's shared
* `DEFAULT_LLM_IDLE_TIMEOUT_MS` (120s) so non-cron interactive runs see
* no behavior change versus the existing watchdog, while cron runs — for
* which the runtime disables its idle watchdog entirely
* (`resolveLlmIdleTimeoutMs` returns 0 when `trigger === "cron"` and no
* explicit timeout is set) — finally get a provider-owned termination
* well before the ~622s stuck-session recovery kicks in.
*/
const OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS = 12e4;
const OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS = 3e5;
function resolveTimeoutMs(model, fallbackMs) {
	return asPositiveFiniteNumber(model?.requestTimeoutMs) ?? fallbackMs;
}
function isProviderProgressEvent(event) {
	return event.type === "text_delta" || event.type === "thinking_delta" || event.type === "toolcall_delta" || event.type === "text_end" || event.type === "thinking_end" || event.type === "toolcall_start" || event.type === "toolcall_end";
}
const STALLED_STREAM_ERROR_MESSAGE = "opencode-go stream timed out after provider-owned SSE boundary stalled";
function buildStreamErrorEvent(partial, model, errorMessage) {
	return {
		type: "error",
		reason: "error",
		error: {
			...partial ?? {
				role: "assistant",
				content: [],
				api: model.api,
				provider: model.provider,
				model: model.id,
				usage: createEmptyTransportUsage(),
				timestamp: Date.now()
			},
			stopReason: "error",
			errorMessage
		}
	};
}
function createOpencodeGoStalledStreamWrapper(underlying) {
	return (model, context, callOptions) => {
		if (model.provider !== "opencode-go") return underlying(model, context, callOptions);
		const output = createAssistantMessageEventStream();
		const idleTimeoutMs = resolveTimeoutMs(model, OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS);
		const firstEventTimeoutMs = resolveTimeoutMs(model, OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS);
		const controller = new AbortController();
		const callerSignal = callOptions?.signal;
		const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
		const wrappedOptions = {
			...callOptions,
			firstEventTimeoutMs,
			signal
		};
		let idleTimer;
		let lastSeenPartial;
		let settled = false;
		let baseIterator;
		const clearIdleTimer = () => {
			if (idleTimer !== void 0) {
				clearTimeout(idleTimer);
				idleTimer = void 0;
			}
		};
		const releaseBaseStream = () => {
			if (baseIterator?.return) Promise.resolve(baseIterator.return()).catch(() => void 0);
		};
		const finishWith = (event) => {
			if (settled) return;
			settled = true;
			clearIdleTimer();
			output.push(event);
			output.end(event.type === "done" ? event.message : void 0);
		};
		const abortStalledStream = () => {
			if (settled) return;
			settled = true;
			clearIdleTimer();
			controller.abort(/* @__PURE__ */ new Error("opencode-go stream stalled"));
			releaseBaseStream();
			output.push(buildStreamErrorEvent(lastSeenPartial, model, STALLED_STREAM_ERROR_MESSAGE));
			output.end();
		};
		const armTimer = (timeoutMs) => {
			clearIdleTimer();
			idleTimer = setTimeout(abortStalledStream, timeoutMs);
			idleTimer.unref?.();
		};
		const trackPartial = (event) => {
			const partial = event.partial ?? event.message;
			if (partial) lastSeenPartial = partial;
		};
		armTimer(firstEventTimeoutMs);
		let baseStreamResult;
		try {
			baseStreamResult = underlying(model, context, wrappedOptions);
		} catch (error) {
			clearIdleTimer();
			throw error;
		}
		(async () => {
			try {
				baseIterator = (await baseStreamResult)[Symbol.asyncIterator]();
				if (settled) {
					releaseBaseStream();
					return;
				}
				for (;;) {
					const result = await baseIterator.next();
					if (settled) return;
					if (result.done) {
						finishWith(buildStreamErrorEvent(lastSeenPartial, model, "opencode-go stream ended without a terminal event"));
						return;
					}
					const event = result.value;
					if (event.type === "done" || event.type === "error") {
						trackPartial(event);
						finishWith(event);
						return;
					}
					trackPartial(event);
					output.push(event);
					if (isProviderProgressEvent(event)) armTimer(idleTimeoutMs);
				}
			} catch (error) {
				if (!settled) finishWith(buildStreamErrorEvent(lastSeenPartial, model, error instanceof Error ? error.message : String(error)));
			} finally {
				clearIdleTimer();
			}
		})();
		return output;
	};
}
//#endregion
export { createOpencodeGoStalledStreamWrapper as t };
