import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import "./ai-transport-host-DPaGzfm6.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { defaultApiRegistry, defaultLlmRuntime } from "@openclaw/ai/internal/runtime";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/llm/stream.ts
registerBuiltInApiProviders(defaultApiRegistry);
let transportRuntimeHostPromise;
async function ensureTransportRuntimeHost() {
	transportRuntimeHostPromise ??= import("./ai-transport-runtime-host-KMti9bOr.mjs").then(({ configureAiTransportRuntimeHost }) => configureAiTransportRuntimeHost());
	await transportRuntimeHostPromise;
}
function createRuntimeHostErrorMessage(model, error) {
	return {
		role: "assistant",
		content: [],
		api: model.api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		errorCode: classifyGatewayStorageFailure(error),
		timestamp: Date.now()
	};
}
function deferUntilTransportRuntimeHost(model, start) {
	const output = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			await ensureTransportRuntimeHost();
			for await (const event of start()) output.push(event);
		} catch (error) {
			const message = createRuntimeHostErrorMessage(model, error);
			output.push({
				type: "error",
				reason: "error",
				error: message
			});
		} finally {
			output.end();
		}
	})();
	return output;
}
function resolveRuntime(model) {
	return getModelLlmRuntime(model) ?? defaultLlmRuntime;
}
function stream(model, context, options) {
	return deferUntilTransportRuntimeHost(model, () => resolveRuntime(model).stream(model, context, options));
}
async function complete(model, context, options, assertCurrent) {
	await ensureTransportRuntimeHost();
	assertCurrent?.();
	options?.signal?.throwIfAborted();
	return await resolveRuntime(model).complete(model, context, options);
}
function streamSimple(model, context, options) {
	return deferUntilTransportRuntimeHost(model, () => resolveRuntime(model).streamSimple(model, context, options));
}
async function completeSimple(model, context, options, assertCurrent) {
	await ensureTransportRuntimeHost();
	assertCurrent?.();
	options?.signal?.throwIfAborted();
	return await resolveRuntime(model).completeSimple(model, context, options);
}
//#endregion
export { streamSimple as i, completeSimple as n, stream as r, complete as t };
