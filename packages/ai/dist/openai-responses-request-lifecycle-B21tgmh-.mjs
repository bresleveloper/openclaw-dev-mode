import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { p as RESPONSES_RETAINED_USER, y as responsesPromptObserver } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { c as truncateUtf16Safe } from "./provider-error-B7aKA_dg.mjs";
import "./transport-utils-J6TkTVN5.mjs";
import { t as stableStringify } from "./stable-stringify-CGB-o900.mjs";
import "./src-CNWvILd1.mjs";
import { y as prepareSystemPrompt } from "./simple-options-Bet1Zroc.mjs";
import { C as sha256Hex } from "./tool-schema-json-projection-Do42m3b7.mjs";
import { Xt as buildOpenAIResponsesReasoningReplayMetadata } from "./openai-responses-shared-CZBZVeqY.mjs";
import { l as isOpenAIResponsesCompactionOutput } from "./openai-responses-compaction-window-BwVpFH3V.mjs";
const DEFAULT_BUDGET_OPTIONS = {};
const ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE = /[\p{ASCII}]+|[^\p{ASCII}]/gu;
const WEIGHTED_CJK_RANGES = [
	[
		[183, 183],
		[12288, 12703],
		[19968, 40869],
		[44032, 55215],
		[65281, 65376]
	],
	[
		[4352, 4607],
		[11904, 12287],
		[12704, 19967],
		[40870, 40959],
		[40960, 42239],
		[42752, 42759],
		[43360, 43391],
		[55216, 55295],
		[63744, 64255]
	],
	[
		[711, 711],
		[713, 715],
		[729, 729],
		[746, 747],
		[773, 773],
		[803, 803],
		[65040, 65103],
		[65377, 65500],
		[65504, 65510]
	],
	[[119648, 119665]],
	[
		[94176, 94207],
		[94208, 101647],
		[110576, 110591],
		[110592, 111359],
		[127488, 127743],
		[131072, 195103],
		[196608, 210047]
	]
];
const WEIGHTED_CJK_RE = /* @__PURE__ */ (() => new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u"))();
const CJK_CATEGORY = /* @__PURE__ */ (() => {
	const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
	const categories = new Uint8Array(maxCodePoint + 1);
	for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
	return categories;
})();
function estimateStringChars(text) {
	return estimateStringCharsWithMinimumRawWeight(text);
}
/** Apply a raw-text safety floor without multiplying CJK adjustments twice. */
function estimateStringCharsWithMinimumRawWeight(text, options = DEFAULT_BUDGET_OPTIONS) {
	const minimumRawWeight = Math.max(1, options.minimumRawWeight ?? 1);
	if (minimumRawWeight !== 1 && minimumRawWeight !== 2) {
		let chars = 0;
		for (const match of text.matchAll(ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE)) {
			const segment = match[0];
			const minimumChars = Math.ceil(segment.length * minimumRawWeight);
			chars += segment.charCodeAt(0) <= 127 ? minimumChars : Math.max(estimateStringChars(segment), minimumChars);
		}
		return chars;
	}
	const firstWeighted = text.search(WEIGHTED_CJK_RE);
	if (firstWeighted < 0) return text.length * minimumRawWeight;
	let common = 0;
	let rareBmp = 0;
	let twoToken = 0;
	let threeTokenSupplementary = 0;
	let supplementary = 0;
	for (let index = firstWeighted; index < text.length; index += 1) {
		let codePoint = text.charCodeAt(index);
		if (codePoint < 128) continue;
		if (codePoint >= 55296 && codePoint <= 56319) {
			const low = text.charCodeAt(index + 1);
			if (low >= 56320 && low <= 57343) {
				codePoint = 65536 + (codePoint - 55296) * 1024 + low - 56320;
				index += 1;
			}
		}
		switch (CJK_CATEGORY[codePoint]) {
			case 1:
				common += 1;
				break;
			case 2:
				rareBmp += 1;
				break;
			case 3:
				twoToken += 1;
				break;
			case 4:
				threeTokenSupplementary += 1;
				break;
			case 5: supplementary += 1;
		}
	}
	return text.length * minimumRawWeight + common * (4 - minimumRawWeight) + rareBmp * (12 - minimumRawWeight) + twoToken * (8 - minimumRawWeight) + threeTokenSupplementary * (12 - 2 * minimumRawWeight) + supplementary * (16 - 2 * minimumRawWeight);
}
function estimateTokensFromChars(chars) {
	return Math.ceil(Math.max(0, chars) / 4);
}
// packages/ai/src/transports/openai-responses-compact-request.ts
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
// packages/ai/src/transports/openai-responses-compaction-v2.ts
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
						text: truncateUtf16Safe(part.text, low)
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
// packages/ai/src/transports/openai-responses-prompt-observer-internal.ts
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
function createResponsesPromptEgressObserver(options, context) {
	const observer = options ? responsesPromptObserver.get(options) : void 0;
	if (!observer) return;
	const expectedPrompt = prepareSystemPrompt(context.systemPrompt ?? "", context.preparedSystemPrompt).instructions;
	return (request, metadata) => {
		const [promptSource, observedPrompt] = readFinalResponsesPrompt(request);
		observer({
			...metadata,
			promptSource,
			expectedChars: expectedPrompt.length,
			observedChars: observedPrompt.length,
			matchesAssembledPrompt: promptSource !== "missing" && observedPrompt === expectedPrompt
		});
	};
}
// packages/ai/src/transports/openai-responses-request-lifecycle.ts
const lifecycleKey = Symbol("openclaw.responsesRequestLifecycle");
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
export { claimResponsesCompactRequest as a, estimateStringChars as c, createResponsesV2CompactionCollector as i, withResponsesRequestAcceptance as n, copyResponsesCompactRequest as o, createResponsesPromptEgressObserver as r, requestPreparedOpenAIResponsesCompaction as s, responsesRequestLifecycle as t };
