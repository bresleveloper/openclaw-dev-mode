import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { f as RESPONSES_RETAINED_USER, g as responsesPromptObserver } from "./openai-responses-contracts-B5mGAbR6.mjs";
import { c as stableStringify, d as estimateTokensFromChars, u as estimateStringChars } from "./provider-error-qtZD2inE.mjs";
import "./transport-utils-DwOpuTjL.mjs";
import { w as stripSystemPromptCacheBoundary } from "./simple-options-xJkqrG_E.mjs";
import { v as sanitizeTransportPayloadText } from "./transport-stream-shared-lhgkTOz3.mjs";
import { w as sha256Hex } from "./tool-schema-json-projection-B1sTYwfH.mjs";
import { rt as buildOpenAIResponsesReasoningReplayMetadata } from "./openai-responses-shared-XoSAyCHj.mjs";
import { a as isOpenAIResponsesCompactionOutput, s as sanitizeResponsesImagePayload } from "./openai-responses-endpoint-CfKR6N5f.mjs";
//#region packages/ai/src/transports/openai-responses-compact-request.ts
const COMPACT_REQUEST = Symbol("openaiResponsesCompactRequest");
function claimResponsesCompactRequest(options) {
	const controller = options ? Reflect.get(options, COMPACT_REQUEST) : void 0;
	if (controller?.claimed === false) {
		controller.claimed = true;
		controller.onClaimed();
		return controller;
	}
}
/** Preserve the operation when a provider translates simple stream options. */
function copyResponsesCompactRequest(source, target) {
	const request = source ? Reflect.get(source, COMPACT_REQUEST) : void 0;
	if (request) Reflect.set(target, COMPACT_REQUEST, request);
}
/** Run provider compaction through the session's prepared stream stack. */
async function requestPreparedOpenAIResponsesCompaction(streamFn, model, context, options, mode = "endpoint", replayBudget) {
	const preparedOptions = { ...options };
	let resolveResult;
	let rejectResult;
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve;
		rejectResult = reject;
	});
	let markClaimed;
	const claimed = new Promise((resolve) => {
		markClaimed = resolve;
	});
	Reflect.set(preparedOptions, COMPACT_REQUEST, {
		claimed: false,
		mode,
		replayBudget,
		onClaimed: markClaimed,
		resolve: resolveResult,
		reject: rejectResult
	});
	const stream = await Promise.resolve(streamFn(model, context, preparedOptions));
	try {
		const settled = stream.result().then(() => "settled", () => "settled");
		if (await Promise.race([claimed.then(() => "claimed"), settled]) !== "claimed") throw new Error("Prepared stream did not reach an OpenAI Responses transport");
		return await result;
	} finally {
		await stream.result().catch(() => void 0);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-v2.ts
/** Request-local collection; no partial checkpoint may survive a provider retry. */
function createResponsesV2CompactionCollector(replayBudget) {
	let count = 0;
	let item;
	return {
		assertReplayFits(input, model) {
			if (!replayBudget) return;
			const minimumCheckpoint = {
				type: "compaction",
				encrypted_content: "opaque"
			};
			const output = [...retainV2Users(input), minimumCheckpoint];
			if (!isOpenAIResponsesCompactionOutput(output, model)) throw new Error("Responses V2 compaction produced an incompatible replay window");
			if (replayBudget.estimateTokens(output, 1) > replayBudget.maxTokens) throw new Error("ChatGPT V2 retained window exceeds the next request budget");
		},
		sanitizeImages(request) {
			const sanitized = sanitizeResponsesImagePayload(request);
			sanitized.input?.forEach((inputItem, index) => {
				const source = request.input?.[index];
				if (source && Reflect.get(source, RESPONSES_RETAINED_USER)) Object.assign(inputItem, { [RESPONSES_RETAINED_USER]: true });
			});
			return sanitized;
		},
		preserveUsers(input) {
			const users = /* @__PURE__ */ new Map();
			for (const message of input) if (Reflect.get(message, RESPONSES_RETAINED_USER)) {
				const key = sha256Hex(stableStringify(message));
				users.set(key, (users.get(key) ?? 0) + 1);
			}
			return (nextInput) => nextInput.map((message) => {
				if (message.type !== "message" || message.role !== "user") return message;
				const key = sha256Hex(stableStringify(message));
				const remaining = users.get(key) ?? 0;
				if (remaining > 0) {
					users.set(key, remaining - 1);
					return Object.assign({}, message, { [RESPONSES_RETAINED_USER]: true });
				}
				return message;
			});
		},
		async *observe(events) {
			count = 0;
			item = void 0;
			for await (const event of events) {
				if (isRecord(event) && event.type === "response.output_item.done" && isRecord(event.item) && event.item.type === "compaction") {
					count += 1;
					if (typeof event.item.encrypted_content === "string" && event.item.encrypted_content.length > 0) item = {
						type: "compaction",
						encrypted_content: event.item.encrypted_content
					};
				}
				yield event;
			}
		},
		finish(params) {
			params.options?.signal?.throwIfAborted();
			if (!params.terminal || params.terminal.status !== "completed" || count !== 1 || !item) throw new Error("Responses V2 compaction requires successful completion and exactly one nonempty compaction item");
			const usage = params.terminal.usage;
			if (!usage) throw new Error("Responses V2 compaction completed without usage");
			const output = [...retainV2Users(params.input), item];
			if (!isOpenAIResponsesCompactionOutput(output, params.model)) throw new Error("Responses V2 compaction produced an incompatible replay window");
			return {
				output,
				item,
				historyMode: "retained-users",
				usage: { ...usage },
				model: params.model,
				replayMetadata: buildOpenAIResponsesReasoningReplayMetadata(params.model, params.options)
			};
		}
	};
}
function retainV2Users(input) {
	let remaining = 64e3;
	const retained = [];
	for (let index = input.length - 1; index >= 0 && remaining > 0; index -= 1) {
		const message = input[index];
		if (!message || message.type !== "message" || message.role !== "user" || !Reflect.get(message, RESPONSES_RETAINED_USER) || !Array.isArray(message.content)) continue;
		const content = [];
		for (const part of message.content) {
			const tokens = part.type === "input_text" ? Math.max(1, estimateTokensFromChars(estimateStringChars(part.text))) : part.type === "input_image" ? 2e3 : remaining + 1;
			if (tokens <= remaining) {
				content.push(part);
				remaining -= tokens;
			} else {
				if (part.type === "input_text") {
					let low = 0;
					let high = Math.min(part.text.length, remaining * 4);
					while (low < high) {
						const end = Math.ceil((low + high) / 2);
						if (estimateTokensFromChars(estimateStringChars(part.text.slice(0, end))) <= remaining) low = end;
						else high = end - 1;
					}
					if (low > 0) content.push({
						...part,
						text: part.text.slice(0, low)
					});
				}
				remaining = 0;
				break;
			}
		}
		if (content.length) {
			const retainedMessage = {
				...message,
				content
			};
			Reflect.deleteProperty(retainedMessage, RESPONSES_RETAINED_USER);
			retained.push(retainedMessage);
		}
	}
	return retained.toReversed();
}
//#endregion
//#region packages/ai/src/transports/openai-responses-prompt-observer-internal.ts
function readSessionsSpawnSchema(tools) {
	if (!Array.isArray(tools)) return;
	const tool = tools.find((candidate) => isRecord(candidate) && candidate.name === "sessions_spawn");
	if (!isRecord(tool)) return;
	const parameters = isRecord(tool.parameters) ? tool.parameters : void 0;
	return {
		...typeof tool.strict === "boolean" ? { strict: tool.strict } : {},
		categoryRequired: Array.isArray(parameters?.required) && parameters.required.includes("category")
	};
}
function readFinalResponsesPrompt(request) {
	if (typeof request.instructions === "string") return ["instructions", request.instructions];
	const message = (Array.isArray(request.input) ? request.input : []).find((item) => {
		const role = item.role;
		return role === "developer" || role === "system";
	});
	if (!message) return ["missing", ""];
	const content = message.content;
	const observedPrompt = typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((part) => part.type === "input_text" ? [part.text] : []).join("") : "";
	return [message.role === "developer" ? "input.developer" : "input.system", observedPrompt];
}
function createResponsesPromptEgressObserver(options, assembledPrompt) {
	const observer = options ? responsesPromptObserver.get(options) : void 0;
	if (!observer) return;
	const expectedPrompt = sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(assembledPrompt ?? ""));
	return (request, metadata) => {
		const [promptSource, observedPrompt] = readFinalResponsesPrompt(request);
		const sessionsSpawn = readSessionsSpawnSchema(request.tools);
		observer({
			...metadata,
			promptSource,
			expectedChars: expectedPrompt.length,
			observedChars: observedPrompt.length,
			matchesAssembledPrompt: promptSource !== "missing" && observedPrompt === expectedPrompt,
			...typeof request.model === "string" ? { model: request.model } : {},
			...typeof request.reasoning?.effort === "string" ? { reasoningEffort: request.reasoning.effort } : {},
			...sessionsSpawn ? { sessionsSpawn } : {}
		});
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-request-lifecycle.ts
const lifecycleKey = Symbol("openclaw.responsesRequestLifecycle");
const independentRequestKey = Symbol("openclaw.independentResponsesRequest");
/** A full-input side request must neither consume nor replace a session's continuation. */
const independentResponsesRequest = {
	set(options) {
		Object.defineProperty(options, independentRequestKey, {
			value: true,
			enumerable: true
		});
	},
	has(options) {
		return options !== void 0 && Reflect.get(options, independentRequestKey) === true;
	}
};
/** Private transport carrier: serialized options cannot mint host authority. */
const responsesRequestLifecycle = {
	set(options, lifecycle) {
		Object.defineProperty(options, lifecycleKey, {
			value: lifecycle,
			enumerable: true
		});
	},
	get(options) {
		if (!options) return;
		return Reflect.get(options, lifecycleKey);
	}
};
/** A transport receipt must settle before model output can authorize later work. */
function withResponsesRequestAcceptance(events, lifecycle, signal) {
	if (!lifecycle) return events;
	return { async *[Symbol.asyncIterator]() {
		for await (const event of events) {
			if (isRecord(event) && event.type === "response.created") {
				const response = isRecord(event.response) ? event.response : void 0;
				if (typeof response?.id !== "string" || !response.id.trim()) throw new Error("Provider continuation response has no identity");
				signal?.throwIfAborted();
				lifecycle.assertCurrent();
				await lifecycle.accepted(response.id, signal);
				signal?.throwIfAborted();
				lifecycle.assertCurrent();
			}
			yield event;
		}
	} };
}
//#endregion
export { createResponsesV2CompactionCollector as a, requestPreparedOpenAIResponsesCompaction as c, createResponsesPromptEgressObserver as i, responsesRequestLifecycle as n, claimResponsesCompactRequest as o, withResponsesRequestAcceptance as r, copyResponsesCompactRequest as s, independentResponsesRequest as t };
