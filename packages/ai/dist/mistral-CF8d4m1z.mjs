import { n as __exportAll } from "./rolldown-runtime-DYf_mQCB.mjs";
import "./src-Ii137Gdc.mjs";
import { t as omitNullRequestHeaders } from "./request-headers-DJ4QrMC_.mjs";
import { r as appendAssistantThinking, t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { L as isImageWithMediaPayload, M as calculateCost, N as clampThinkingLevel, r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-B3kUqQ-q.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-oTx0nIsh.mjs";
import { a as describeToolResultMediaPlaceholder, c as extractToolResultText, l as formatToolResultText, n as buildBaseOptions, r as clampMaxTokensToModel, w as stripSystemPromptCacheBoundary } from "./simple-options-Bet1Zroc.mjs";
import { A as parseStreamingJson, O as createToolArgumentPreviewSchedule, d as finalizeTransportStream, g as notifyProviderHttpResponse, m as mergeTransportHeaders, n as assignTransportErrorDetails, r as awaitProviderLifecycleCallback, u as finalizeTerminalToolCallArguments } from "./transport-stream-shared-DPUASGj0.mjs";
import { t as getPublishedRuntimeToolInputSchema } from "./tool-schema-json-projection-Do42m3b7.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-v1liRqNt.mjs";
import { t as shortHash } from "./hash-Cx359qsb.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-Ca0a3iL1.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { t as mapOpenAIStopReason } from "./openai-stop-reason-cA0GUHlU.mjs";
import { t as boundResponseBody } from "./streaming-byte-guard-gOcUrHJF.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
import { randomUUID } from "node:crypto";
import * as z$1 from "zod/v4";
import { z } from "zod/v4";
import * as z$2 from "zod/v4/core";
import { zodToJsonSchema } from "zod-to-json-schema";
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/observability/provider.js
let registeredTracerProvider;
/**
* Route SDK tracing spans to a specific OpenTelemetry tracer provider.
*/
function registerTracerProvider(tracerProvider) {
	registeredTracerProvider = tracerProvider;
}
/**
* Returns the currently registered tracer provider, if any.
*/
function getRegisteredTracerProvider() {
	return registeredTracerProvider;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/sdkvalidationerror.js
var SDKValidationError = class extends Error {
	/**
	* The raw value that failed validation.
	*/
	rawValue;
	/**
	* The raw message that failed validation.
	*/
	rawMessage;
	static [Symbol.hasInstance](instance) {
		if (!(instance instanceof Error)) return false;
		if (!("rawValue" in instance)) return false;
		if (!("rawMessage" in instance)) return false;
		if (!("pretty" in instance)) return false;
		if (typeof instance.pretty !== "function") return false;
		return true;
	}
	constructor(message, cause, rawValue) {
		super(`${message}: ${cause}`);
		this.name = "SDKValidationError";
		this.cause = cause;
		this.rawValue = rawValue;
		this.rawMessage = message;
	}
	/**
	* Return a pretty-formatted error message if the underlying validation error
	* is a ZodError or some other recognized error type, otherwise return the
	* default error message.
	*/
	pretty() {
		if (this.cause instanceof z$2.$ZodError) return `${this.rawMessage}\n${formatZodError(this.cause)}`;
		else return this.toString();
	}
};
function formatZodError(err) {
	return z$2.prettifyError(err);
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/fp.js
function OK(value) {
	return {
		ok: true,
		value
	};
}
function ERR(error) {
	return {
		ok: false,
		error
	};
}
/**
* unwrapAsync is a convenience function for resolving a value from a Promise
* of a result or rejecting if an error occurred.
*/
async function unwrapAsync(pr) {
	const r = await pr;
	if (!r.ok) throw r.error;
	return r.value;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/schemas.js
/**
* Utility function that executes some code which may result in a ZodError. It
* intercepts this error and converts it to an SDKValidationError so as to not
* leak Zod implementation details to user code.
*/
function safeParse(rawValue, fn, errorMessage) {
	try {
		return OK(fn(rawValue));
	} catch (err) {
		return ERR(new SDKValidationError(errorMessage, err, rawValue));
	}
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/primitives.js
/**
* Converts or omits an object's keys according to a mapping.
*
* @param inp An object whose keys will be remapped
* @param mappings A mapping of original keys to new keys. If a key is not present in the mapping, it will be left as is. If a key is mapped to `null`, it will be removed in the resulting object.
* @returns A new object with keys remapped or omitted according to the mappings
*/
function remap(inp, mappings) {
	let out = {};
	if (!Object.keys(mappings).length) {
		out = inp;
		return out;
	}
	for (const [k, v] of Object.entries(inp)) {
		const j = mappings[k];
		if (j === null) continue;
		out[j ?? k] = v;
	}
	return out;
}
function combineSignals(...signals) {
	const filtered = [];
	for (const signal of signals) if (signal) filtered.push(signal);
	switch (filtered.length) {
		case 0:
		case 1: return filtered[0] || null;
		default:
			if ("any" in AbortSignal && typeof AbortSignal.any === "function") return AbortSignal.any(filtered);
			return abortSignalAny(filtered);
	}
}
function abortSignalAny(signals) {
	const controller = new AbortController();
	const result = controller.signal;
	if (!signals.length) return controller.signal;
	if (signals.length === 1) return signals[0] || controller.signal;
	for (const signal of signals) if (signal.aborted) return signal;
	function abort() {
		controller.abort(this.reason);
		clean();
	}
	const signalRefs = [];
	function clean() {
		for (const signalRef of signalRefs) {
			const signal = signalRef.deref();
			if (signal) signal.removeEventListener("abort", abort);
		}
	}
	for (const signal of signals) {
		signalRefs.push(new WeakRef(signal));
		signal.addEventListener("abort", abort);
	}
	return result;
}
function compactMap(values) {
	const out = {};
	for (const [k, v] of Object.entries(values)) if (typeof v !== "undefined") out[k] = v;
	return out;
}
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	if (Object.prototype.toString.call(value) !== "[object Object]") return false;
	const proto = Object.getPrototypeOf(value);
	if (proto === null || proto === Object.prototype) return true;
	try {
		return Object.getPrototypeOf(proto) === null;
	} catch {
		return false;
	}
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/unrecognized.js
function unrecognized(value) {
	globalCount++;
	return value;
}
let globalCount = 0;
let refCount = 0;
function startCountingUnrecognized() {
	refCount++;
	const start = globalCount;
	return { 
	/**
	* Ends counting and returns the delta.
	* @param delta - If provided, only this amount is added to the parent counter
	*   (used for nested unions where we only want to record the winning option's count).
	*   If not provided, records all counts since start().
	*/
end: (delta) => {
		const count = globalCount - start;
		globalCount = start + (delta ?? count);
		if (--refCount === 0) globalCount = 0;
		return count;
	} };
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/enums.js
function inboundSchema(enumObj) {
	const options = Object.values(enumObj);
	return z$1.union([...options.map((x) => z$1.literal(x)), z$1.string().transform((x) => unrecognized(x))]);
}
function outboundSchema(_) {
	return z$1.string();
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/chatcompletionresponsetokenlogprobs.js
/** @internal */
const ChatCompletionResponseTokenLogprobs$inboundSchema = z$1.object({
	token: z$1.string(),
	logprob: z$1.number(),
	bytes: z$1.array(z$1.int()),
	token_id: z$1.int()
}).transform((v) => {
	return remap(v, { "token_id": "tokenId" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/chatcompletionresponsetokenlogprobstopk.js
/** @internal */
const ChatCompletionResponseTokenLogprobsTopK$inboundSchema = z$1.object({
	token: z$1.string(),
	logprob: z$1.number(),
	bytes: z$1.array(z$1.int()),
	token_id: z$1.int(),
	top_logprobs: z$1.nullable(z$1.array(ChatCompletionResponseTokenLogprobs$inboundSchema)).optional()
}).transform((v) => {
	return remap(v, {
		"token_id": "tokenId",
		"top_logprobs": "topLogprobs"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/chatcompletionresponsechoicelogprobs.js
/** @internal */
const ChatCompletionResponseChoiceLogprobs$inboundSchema = z$1.object({ content: z$1.array(ChatCompletionResponseTokenLogprobsTopK$inboundSchema) });
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/discriminatedUnion.js
const UNKNOWN = Symbol("UNKNOWN");
function isUnknown(value) {
	return typeof value === "object" && value !== null && UNKNOWN in value;
}
/**
* Forward-compatible discriminated union parser.
*
* If the input does not match one of the predefined options, it will be
* captured and available as `{ raw: <original input>, [discriminator]: "UNKNOWN", isUnknown: true }`.
*
* @param inputPropertyName - The discriminator property name in the input payload
* @param options - Map of discriminator values to their corresponding schemas
* @param opts - Optional configuration object
* @param opts.unknownValue - The value to use for the discriminator when the input is unknown (default: "UNKNOWN")
* @param opts.outputPropertyName - Output property name if the sanitized (camelCase) property name differs from inputPropertyName
*/
function discriminatedUnion(inputPropertyName, options, opts = {}) {
	const { unknownValue = "UNKNOWN", outputPropertyName } = opts;
	return z$1.unknown().transform((input) => {
		const fallback = Object.defineProperties({
			raw: input,
			[outputPropertyName ?? inputPropertyName]: unknownValue,
			isUnknown: true
		}, { [UNKNOWN]: {
			value: true,
			enumerable: false,
			configurable: false
		} });
		if (!(typeof input === "object" && input !== null)) return fallback;
		const discriminator = input[inputPropertyName];
		if (typeof discriminator !== "string") return fallback;
		if (!(discriminator in options)) return fallback;
		const schema = options[discriminator];
		if (!schema) return fallback;
		const unrecognizedCtr = startCountingUnrecognized();
		const result = schema.safeParse(input);
		if (!result.success) {
			unrecognizedCtr.end(0);
			return fallback;
		}
		unrecognizedCtr.end();
		if (outputPropertyName) result.data[outputPropertyName] = discriminator;
		return result.data;
	});
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/rfcdate.js
const dateRE = /^\d{4}-\d{2}-\d{2}$/;
var RFCDate = class RFCDate {
	serialized;
	/**
	* Creates a new RFCDate instance using today's date.
	*/
	static today() {
		return new RFCDate(/* @__PURE__ */ new Date());
	}
	/**
	* Creates a new RFCDate instance using the provided input.
	* If a string is used then in must be in the format YYYY-MM-DD.
	*
	* @param date A Date object or a date string in YYYY-MM-DD format
	* @example
	* new RFCDate("2022-01-01")
	* @example
	* new RFCDate(new Date())
	*/
	constructor(date) {
		if (typeof date === "string" && !dateRE.test(date)) throw new RangeError("RFCDate: date strings must be in the format YYYY-MM-DD: " + date);
		const value = new Date(date);
		if (isNaN(+value)) throw new RangeError("RFCDate: invalid date provided: " + date);
		this.serialized = value.toISOString().slice(0, 10);
		if (!dateRE.test(this.serialized)) throw new TypeError(`RFCDate: failed to build valid date with given value: ${date} serialized to ${this.serialized}`);
	}
	toJSON() {
		return this.toString();
	}
	toString() {
		return this.serialized;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/smartUnion.js
/**
* Smart union parser that tries all schemas and returns the best match
* based on the number of populated fields.
*/
function smartUnion(options) {
	return z$1.unknown().transform((input, ctx) => {
		const candidates = [];
		const errors = options.map(() => []);
		const parentUnrecognizedCtr = startCountingUnrecognized();
		for (const [i, option] of options.entries()) {
			const unrecognizedCtr = startCountingUnrecognized();
			const result = option.safeParse(input);
			const inexactCount = unrecognizedCtr.end();
			const zeroDefaultCount = 0;
			if (result.success) {
				candidates.push({
					data: result.data,
					inexactCount,
					zeroDefaultCount,
					fieldCount: -1
				});
				continue;
			}
			errors[i].push(...result.error.issues);
		}
		if (candidates.length === 0) {
			parentUnrecognizedCtr.end(0);
			ctx.addIssue({
				input,
				code: "invalid_union",
				errors
			});
			return z$1.NEVER;
		}
		let best = candidates[0];
		for (const candidate of candidates) {
			if (candidates.length > 1) candidate.fieldCount = countFieldsRecursive(candidate.data);
			best = better(candidate, best);
		}
		parentUnrecognizedCtr.end(best.inexactCount);
		return best.data;
	});
}
function better(a, b) {
	const aIsExact = a.inexactCount === 0;
	if (aIsExact !== (b.inexactCount === 0)) return aIsExact ? a : b;
	const actualFieldCountA = a.fieldCount - a.zeroDefaultCount;
	const actualFieldCountB = b.fieldCount - b.zeroDefaultCount;
	if (actualFieldCountA !== actualFieldCountB) return actualFieldCountA > actualFieldCountB ? a : b;
	return a.inexactCount < b.inexactCount ? a : b;
}
/**
* Counts the number of fields in a parsed value recursively.
* @param `parsed` assumed to *not* contain cycles
* fieldCount: total number of fields found
* inexactCount: number of primitive values that are not unrecognized enum values
*/
function countFieldsRecursive(parsed) {
	let fieldCount = 0;
	const queue = [parsed];
	let index = 0;
	while (index < queue.length) {
		const value = queue[index++];
		if (value === void 0 || isUnknown(value)) continue;
		const type = typeof value;
		if (value === null || type === "number" || type === "string" || type === "boolean" || type === "bigint" || value instanceof Date || value instanceof RFCDate) {
			fieldCount++;
			continue;
		}
		if (Array.isArray(value)) {
			queue.push(...value);
			continue;
		}
		if (type === "object") queue.push(...Object.values(value));
	}
	return fieldCount;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/audiochunk.js
/** @internal */
const AudioChunk$inboundSchema = z$1.object({
	type: z$1.literal("input_audio"),
	input_audio: z$1.string()
}).transform((v) => {
	return remap(v, { "input_audio": "inputAudio" });
});
/** @internal */
const AudioChunk$outboundSchema = z$1.object({
	type: z$1.literal("input_audio"),
	inputAudio: z$1.string()
}).transform((v) => {
	return remap(v, { inputAudio: "input_audio" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/documenturlchunk.js
/** @internal */
const DocumentURLChunk$inboundSchema = z$1.object({
	type: z$1.literal("document_url").default("document_url"),
	document_url: z$1.string(),
	document_name: z$1.nullable(z$1.string()).optional()
}).transform((v) => {
	return remap(v, {
		"document_url": "documentUrl",
		"document_name": "documentName"
	});
});
/** @internal */
const DocumentURLChunk$outboundSchema = z$1.object({
	type: z$1.literal("document_url").default("document_url"),
	documentUrl: z$1.string(),
	documentName: z$1.nullable(z$1.string()).optional()
}).transform((v) => {
	return remap(v, {
		documentUrl: "document_url",
		documentName: "document_name"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/filechunk.js
/** @internal */
const FileChunk$inboundSchema = z$1.object({
	type: z$1.literal("file").default("file"),
	file_id: z$1.string()
}).transform((v) => {
	return remap(v, { "file_id": "fileId" });
});
/** @internal */
const FileChunk$outboundSchema = z$1.object({
	type: z$1.literal("file").default("file"),
	fileId: z$1.string()
}).transform((v) => {
	return remap(v, { fileId: "file_id" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/imagedetail.js
const ImageDetail = {
	Low: "low",
	Auto: "auto",
	High: "high"
};
/** @internal */
const ImageDetail$inboundSchema = inboundSchema(ImageDetail);
/** @internal */
const ImageDetail$outboundSchema = outboundSchema(ImageDetail);
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/imageurl.js
/** @internal */
const ImageURL$inboundSchema = z$1.object({
	url: z$1.string(),
	detail: z$1.nullable(ImageDetail$inboundSchema).optional()
});
/** @internal */
const ImageURL$outboundSchema = z$1.object({
	url: z$1.string(),
	detail: z$1.nullable(ImageDetail$outboundSchema).optional()
});
smartUnion([ImageURL$inboundSchema, z$1.string()]);
smartUnion([ImageURL$outboundSchema, z$1.string()]);
/** @internal */
const ImageURLChunk$inboundSchema = z$1.object({
	type: z$1.literal("image_url").default("image_url"),
	image_url: smartUnion([ImageURL$inboundSchema, z$1.string()])
}).transform((v) => {
	return remap(v, { "image_url": "imageUrl" });
});
/** @internal */
const ImageURLChunk$outboundSchema = z$1.object({
	type: z$1.literal("image_url").default("image_url"),
	imageUrl: smartUnion([ImageURL$outboundSchema, z$1.string()])
}).transform((v) => {
	return remap(v, { imageUrl: "image_url" });
});
smartUnion([z$1.int(), z$1.string()]);
smartUnion([z$1.int(), z$1.string()]);
/** @internal */
const ReferenceChunk$inboundSchema = z$1.object({
	type: z$1.literal("reference").default("reference"),
	reference_ids: z$1.array(smartUnion([z$1.int(), z$1.string()]))
}).transform((v) => {
	return remap(v, { "reference_ids": "referenceIds" });
});
/** @internal */
const ReferenceChunk$outboundSchema = z$1.object({
	type: z$1.literal("reference").default("reference"),
	referenceIds: z$1.array(smartUnion([z$1.int(), z$1.string()]))
}).transform((v) => {
	return remap(v, { referenceIds: "reference_ids" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/textchunk.js
/** @internal */
const TextChunk$inboundSchema = z$1.object({
	type: z$1.literal("text").default("text"),
	text: z$1.string()
});
/** @internal */
const TextChunk$outboundSchema = z$1.object({
	type: z$1.literal("text").default("text"),
	text: z$1.string()
});
discriminatedUnion("type", {
	text: TextChunk$inboundSchema.and(z$1.object({ type: z$1.literal("text") })),
	image_url: ImageURLChunk$inboundSchema.and(z$1.object({ type: z$1.literal("image_url") }))
});
z$1.union([TextChunk$outboundSchema.and(z$1.object({ type: z$1.literal("text") })), ImageURLChunk$outboundSchema.and(z$1.object({ type: z$1.literal("image_url") }))]);
/** @internal */
const ResourceChunk$inboundSchema = z$1.object({
	type: z$1.literal("resource"),
	uri: z$1.string(),
	content: discriminatedUnion("type", {
		text: TextChunk$inboundSchema.and(z$1.object({ type: z$1.literal("text") })),
		image_url: ImageURLChunk$inboundSchema.and(z$1.object({ type: z$1.literal("image_url") }))
	})
});
/** @internal */
const ResourceChunk$outboundSchema = z$1.object({
	type: z$1.literal("resource"),
	uri: z$1.string(),
	content: z$1.union([TextChunk$outboundSchema.and(z$1.object({ type: z$1.literal("text") })), ImageURLChunk$outboundSchema.and(z$1.object({ type: z$1.literal("image_url") }))])
});
smartUnion([
	z$1.string(),
	z$1.int(),
	z$1.number(),
	z$1.boolean()
]);
smartUnion([
	z$1.string(),
	z$1.int(),
	z$1.number(),
	z$1.boolean()
]);
/** @internal */
const ResourceLinkChunk$inboundSchema = z$1.object({
	type: z$1.literal("resource_link"),
	uri: z$1.string(),
	metadata: z$1.nullable(z$1.record(z$1.string(), smartUnion([
		z$1.string(),
		z$1.int(),
		z$1.number(),
		z$1.boolean()
	]))).optional()
});
/** @internal */
const ResourceLinkChunk$outboundSchema = z$1.object({
	type: z$1.literal("resource_link"),
	uri: z$1.string(),
	metadata: z$1.nullable(z$1.record(z$1.string(), smartUnion([
		z$1.string(),
		z$1.int(),
		z$1.number(),
		z$1.boolean()
	]))).optional()
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/builtinconnectors.js
const BuiltInConnectors = {
	WebSearch: "web_search",
	WebSearchPremium: "web_search_premium",
	CodeInterpreter: "code_interpreter",
	ImageGeneration: "image_generation",
	DocumentLibrary: "document_library",
	MistralMcp: "mistral_mcp"
};
/** @internal */
const BuiltInConnectors$inboundSchema = inboundSchema(BuiltInConnectors);
/** @internal */
const BuiltInConnectors$outboundSchema = outboundSchema(BuiltInConnectors);
smartUnion([BuiltInConnectors$inboundSchema, z$1.string()]);
smartUnion([BuiltInConnectors$outboundSchema, z$1.string()]);
/** @internal */
const ToolReferenceChunk$inboundSchema = z$1.object({
	type: z$1.literal("tool_reference").default("tool_reference"),
	tool: smartUnion([BuiltInConnectors$inboundSchema, z$1.string()]),
	title: z$1.string(),
	url: z$1.nullable(z$1.string()).optional(),
	favicon: z$1.nullable(z$1.string()).optional(),
	description: z$1.nullable(z$1.string()).optional()
});
/** @internal */
const ToolReferenceChunk$outboundSchema = z$1.object({
	type: z$1.literal("tool_reference").default("tool_reference"),
	tool: smartUnion([BuiltInConnectors$outboundSchema, z$1.string()]),
	title: z$1.string(),
	url: z$1.nullable(z$1.string()).optional(),
	favicon: z$1.nullable(z$1.string()).optional(),
	description: z$1.nullable(z$1.string()).optional()
});
smartUnion([
	ToolReferenceChunk$inboundSchema,
	TextChunk$inboundSchema,
	ReferenceChunk$inboundSchema
]);
smartUnion([
	ToolReferenceChunk$outboundSchema,
	TextChunk$outboundSchema,
	ReferenceChunk$outboundSchema
]);
/** @internal */
const ThinkChunk$inboundSchema = z$1.object({
	type: z$1.literal("thinking").default("thinking"),
	thinking: z$1.array(smartUnion([
		ToolReferenceChunk$inboundSchema,
		TextChunk$inboundSchema,
		ReferenceChunk$inboundSchema
	])),
	signature: z$1.nullable(z$1.string()).optional(),
	closed: z$1.boolean().optional()
});
/** @internal */
const ThinkChunk$outboundSchema = z$1.object({
	type: z$1.literal("thinking").default("thinking"),
	thinking: z$1.array(smartUnion([
		ToolReferenceChunk$outboundSchema,
		TextChunk$outboundSchema,
		ReferenceChunk$outboundSchema
	])),
	signature: z$1.nullable(z$1.string()).optional(),
	closed: z$1.boolean().optional()
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/contentchunk.js
/** @internal */
const ContentChunk$inboundSchema = discriminatedUnion("type", {
	image_url: ImageURLChunk$inboundSchema.and(z$1.object({ type: z$1.literal("image_url") })),
	document_url: DocumentURLChunk$inboundSchema.and(z$1.object({ type: z$1.literal("document_url") })),
	text: TextChunk$inboundSchema.and(z$1.object({ type: z$1.literal("text") })),
	reference: ReferenceChunk$inboundSchema.and(z$1.object({ type: z$1.literal("reference") })),
	file: FileChunk$inboundSchema.and(z$1.object({ type: z$1.literal("file") })),
	thinking: ThinkChunk$inboundSchema.and(z$1.object({ type: z$1.literal("thinking") })),
	input_audio: AudioChunk$inboundSchema,
	resource: ResourceChunk$inboundSchema,
	resource_link: ResourceLinkChunk$inboundSchema
});
/** @internal */
const ContentChunk$outboundSchema = z$1.union([
	ImageURLChunk$outboundSchema.and(z$1.object({ type: z$1.literal("image_url") })),
	DocumentURLChunk$outboundSchema.and(z$1.object({ type: z$1.literal("document_url") })),
	TextChunk$outboundSchema.and(z$1.object({ type: z$1.literal("text") })),
	ReferenceChunk$outboundSchema.and(z$1.object({ type: z$1.literal("reference") })),
	FileChunk$outboundSchema.and(z$1.object({ type: z$1.literal("file") })),
	ThinkChunk$outboundSchema.and(z$1.object({ type: z$1.literal("thinking") })),
	AudioChunk$outboundSchema,
	ResourceChunk$outboundSchema,
	ResourceLinkChunk$outboundSchema
]);
smartUnion([z$1.record(z$1.string(), z$1.any()), z$1.string()]);
smartUnion([z$1.record(z$1.string(), z$1.any()), z$1.string()]);
/** @internal */
const FunctionCall$inboundSchema = z$1.object({
	name: z$1.string(),
	arguments: smartUnion([z$1.record(z$1.string(), z$1.any()), z$1.string()])
});
/** @internal */
const FunctionCall$outboundSchema = z$1.object({
	name: z$1.string(),
	arguments: smartUnion([z$1.record(z$1.string(), z$1.any()), z$1.string()])
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/toolcall.js
/** @internal */
const ToolCall$inboundSchema = z$1.object({
	id: z$1.string().default("null"),
	type: z$1.string().default("function"),
	function: FunctionCall$inboundSchema,
	index: z$1.int().default(0)
});
/** @internal */
const ToolCall$outboundSchema = z$1.object({
	id: z$1.string().default("null"),
	type: z$1.string().default("function"),
	function: FunctionCall$outboundSchema,
	index: z$1.int().default(0)
});
smartUnion([z$1.string(), z$1.array(ContentChunk$inboundSchema)]);
/** @internal */
const DeltaMessage$inboundSchema = z$1.object({
	role: z$1.nullable(z$1.string()).optional(),
	content: z$1.nullable(smartUnion([z$1.string(), z$1.array(ContentChunk$inboundSchema)])).optional(),
	tool_calls: z$1.nullable(z$1.array(ToolCall$inboundSchema)).optional(),
	tool_call_id: z$1.nullable(z$1.string()).optional(),
	index: z$1.nullable(z$1.int()).optional(),
	metadata: z$1.nullable(z$1.record(z$1.string(), z$1.any())).optional()
}).transform((v) => {
	return remap(v, {
		"tool_calls": "toolCalls",
		"tool_call_id": "toolCallId"
	});
});
/** @internal */
const CompletionResponseStreamChoiceFinishReason$inboundSchema = inboundSchema({
	Stop: "stop",
	Length: "length",
	Error: "error",
	ToolCalls: "tool_calls"
});
/** @internal */
const CompletionResponseStreamChoice$inboundSchema = z$1.object({
	index: z$1.int(),
	delta: DeltaMessage$inboundSchema,
	finish_reason: z$1.nullable(CompletionResponseStreamChoiceFinishReason$inboundSchema),
	logprobs: z$1.nullable(ChatCompletionResponseChoiceLogprobs$inboundSchema).optional(),
	prompt_logprobs: z$1.nullable(ChatCompletionResponseChoiceLogprobs$inboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		"finish_reason": "finishReason",
		"prompt_logprobs": "promptLogprobs"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/usageinfo.js
/** @internal */
const UsageInfo$inboundSchema = z$1.object({
	prompt_tokens: z$1.int().default(0),
	completion_tokens: z$1.int().default(0),
	total_tokens: z$1.int().default(0),
	prompt_audio_seconds: z$1.nullable(z$1.int()).optional(),
	service_tier: z$1.nullable(z$1.string()).optional()
}).catchall(z$1.any()).transform((v) => {
	return remap(v, {
		"prompt_tokens": "promptTokens",
		"completion_tokens": "completionTokens",
		"total_tokens": "totalTokens",
		"prompt_audio_seconds": "promptAudioSeconds",
		"service_tier": "serviceTier"
	});
});
/** @internal */
const UsageInfo$outboundSchema = z$1.object({
	promptTokens: z$1.int().default(0),
	completionTokens: z$1.int().default(0),
	totalTokens: z$1.int().default(0),
	promptAudioSeconds: z$1.nullable(z$1.int()).optional(),
	serviceTier: z$1.nullable(z$1.string()).optional()
}).catchall(z$1.any()).transform((v) => {
	return { ...remap(v, {
		promptTokens: "prompt_tokens",
		completionTokens: "completion_tokens",
		totalTokens: "total_tokens",
		promptAudioSeconds: "prompt_audio_seconds",
		serviceTier: "service_tier"
	}) };
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/completionchunk.js
/** @internal */
const CompletionChunk$inboundSchema = z$1.object({
	id: z$1.string(),
	object: z$1.string().optional(),
	created: z$1.int().optional(),
	model: z$1.string(),
	usage: UsageInfo$inboundSchema.optional(),
	choices: z$1.array(CompletionResponseStreamChoice$inboundSchema)
});
function completionChunkFromJSON(jsonString) {
	return safeParse(jsonString, (x) => CompletionChunk$inboundSchema.parse(JSON.parse(x)), `Failed to parse 'CompletionChunk' from JSON`);
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/http.js
const DEFAULT_FETCHER = (input, init) => {
	if (init == null) return fetch(input);
	else return fetch(input, init);
};
var HTTPClient = class HTTPClient {
	fetcher;
	requestHooks = [];
	requestErrorHooks = [];
	responseHooks = [];
	options;
	constructor(options = {}) {
		this.options = options;
		this.fetcher = options.fetcher || DEFAULT_FETCHER;
	}
	async request(request) {
		let req = request;
		for (const hook of this.requestHooks) {
			const nextRequest = await hook(req);
			if (nextRequest) req = nextRequest;
		}
		try {
			const res = await this.fetcher(req);
			for (const hook of this.responseHooks) await hook(res, req);
			return res;
		} catch (err) {
			for (const hook of this.requestErrorHooks) await hook(err, req);
			throw err;
		}
	}
	addHook(...args) {
		if (args[0] === "beforeRequest") this.requestHooks.push(args[1]);
		else if (args[0] === "requestError") this.requestErrorHooks.push(args[1]);
		else if (args[0] === "response") this.responseHooks.push(args[1]);
		else throw new Error(`Invalid hook type: ${args[0]}`);
		return this;
	}
	removeHook(...args) {
		let target;
		if (args[0] === "beforeRequest") target = this.requestHooks;
		else if (args[0] === "requestError") target = this.requestErrorHooks;
		else if (args[0] === "response") target = this.responseHooks;
		else throw new Error(`Invalid hook type: ${args[0]}`);
		const index = target.findIndex((v) => v === args[1]);
		if (index >= 0) target.splice(index, 1);
		return this;
	}
	clone() {
		const child = new HTTPClient(this.options);
		child.requestHooks = this.requestHooks.slice();
		child.requestErrorHooks = this.requestErrorHooks.slice();
		child.responseHooks = this.responseHooks.slice();
		return child;
	}
};
const mediaParamSeparator = /\s*;\s*/g;
function matchContentType(response, pattern) {
	if (pattern === "*") return true;
	let contentType = response.headers.get("content-type")?.trim() || "application/octet-stream";
	contentType = contentType.toLowerCase();
	const [wantType = "", ...wantParams] = pattern.toLowerCase().trim().split(mediaParamSeparator);
	if (wantType.split("/").length !== 2) return false;
	const [gotType = "", ...gotParams] = contentType.split(mediaParamSeparator);
	const [type = "", subtype = ""] = gotType.split("/");
	if (!type || !subtype) return false;
	if (wantType !== "*/*" && gotType !== wantType && `${type}/*` !== wantType && `*/${subtype}` !== wantType) return false;
	if (gotParams.length < wantParams.length) return false;
	const params = new Set(gotParams);
	for (const wantParam of wantParams) if (!params.has(wantParam)) return false;
	return true;
}
const codeRangeRE$1 = /* @__PURE__ */ new RegExp("^[0-9]xx$", "i");
function matchStatusCode(response, codes) {
	const actual = `${response.status}`;
	const expectedCodes = Array.isArray(codes) ? codes : [codes];
	if (!expectedCodes.length) return false;
	return expectedCodes.some((ec) => {
		const code = `${ec}`;
		if (code === "default") return true;
		if (!codeRangeRE$1.test(`${code}`)) return code === actual;
		const expectFamily = code.charAt(0);
		if (!expectFamily) throw new Error("Invalid status code range");
		const actualFamily = actual.charAt(0);
		if (!actualFamily) throw new Error(`Invalid response status code: ${actual}`);
		return actualFamily === expectFamily;
	});
}
function matchResponse(response, code, contentTypePattern) {
	return matchStatusCode(response, code) && matchContentType(response, contentTypePattern);
}
/**
* Uses various heurisitics to determine if an error is a connection error.
*/
function isConnectionError(err) {
	if (typeof err !== "object" || err == null) return false;
	const isBrowserErr = err instanceof TypeError && err.message.toLowerCase().startsWith("failed to fetch");
	const isNodeErr = err instanceof TypeError && err.message.toLowerCase().startsWith("fetch failed");
	const isBunErr = "name" in err && err.name === "ConnectionError";
	const isGenericErr = "code" in err && typeof err.code === "string" && err.code.toLowerCase() === "econnreset";
	return isBrowserErr || isNodeErr || isGenericErr || isBunErr;
}
/**
* Uses various heurisitics to determine if an error is a timeout error.
*/
function isTimeoutError(err) {
	if (typeof err !== "object" || err == null) return false;
	const isNative = "name" in err && err.name === "TimeoutError";
	const isLegacyNative = "code" in err && err.code === 23;
	const isGenericErr = "code" in err && typeof err.code === "string" && err.code.toLowerCase() === "econnaborted";
	return isNative || isLegacyNative || isGenericErr;
}
/**
* Uses various heurisitics to determine if an error is a abort error.
*/
function isAbortError(err) {
	if (typeof err !== "object" || err == null) return false;
	const isNative = "name" in err && err.name === "AbortError";
	const isLegacyNative = "code" in err && err.code === 20;
	const isGenericErr = "code" in err && typeof err.code === "string" && err.code.toLowerCase() === "econnaborted";
	return isNative || isLegacyNative || isGenericErr;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/reasoningeffort.js
const ReasoningEffort = {
	None: "none",
	Minimal: "minimal",
	Low: "low",
	Medium: "medium",
	High: "high",
	Xhigh: "xhigh",
	Max: "max"
};
/** @internal */
const ReasoningEffort$inboundSchema = inboundSchema(ReasoningEffort);
/** @internal */
const ReasoningEffort$outboundSchema = outboundSchema(ReasoningEffort);
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/base64.js
function bytesToBase64(u8arr) {
	return btoa(String.fromCodePoint(...u8arr));
}
function bytesFromBase64(encoded) {
	return Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
}
function stringToBytes(str) {
	return new TextEncoder().encode(str);
}
function stringToBase64(str) {
	return bytesToBase64(stringToBytes(str));
}
z$1.custom((x) => x instanceof Uint8Array).or(z$1.string().transform(stringToBytes));
z$1.custom((x) => x instanceof Uint8Array).or(z$1.string().transform(bytesFromBase64));
const reservedEscapes = /%(2[346bcf]|3[abdf]|40|5[bd])/gi;
function encodeKeyChars(v, charEncoding) {
	return encodeChars(v, charEncoding === "percentExceptReserved" ? "percent" : charEncoding);
}
function encodeChars(v, charEncoding) {
	switch (charEncoding) {
		case "percent": return encodeURIComponent(v);
		case "percentExceptReserved": return encodeURIComponent(v).replace(reservedEscapes, (m) => decodeURIComponent(m));
		default: return v;
	}
}
function formEncoder(sep) {
	return (key, value, options) => {
		let out = "";
		const pairs = options?.explode ? explode(key, value) : [[key, value]];
		if (pairs.every(([_, v]) => v == null)) return;
		const encodeString = (v) => {
			return encodeChars(v, options?.charEncoding);
		};
		const encodeValue = (v) => encodeString(serializeValue(v));
		const encodedSep = encodeString(sep);
		pairs.forEach(([pk, pv]) => {
			let tmp = "";
			let encValue = null;
			if (pv == null) return;
			else if (Array.isArray(pv)) encValue = mapDefined(pv, (v) => `${encodeValue(v)}`)?.join(encodedSep);
			else if (isPlainObject(pv)) encValue = mapDefinedEntries(Object.entries(pv), ([k, v]) => {
				return `${encodeString(k)}${encodedSep}${encodeValue(v)}`;
			})?.join(encodedSep);
			else encValue = `${encodeValue(pv)}`;
			if (encValue == null) return;
			tmp = `${encodeKeyChars(pk, options?.charEncoding)}=${encValue}`;
			if (!tmp || tmp === "=") return;
			out += `&${tmp}`;
		});
		return out.slice(1);
	};
}
const encodeForm = formEncoder(",");
function encodeJSON(key, value, options) {
	if (typeof value === "undefined") return;
	const encodeString = (v) => {
		return encodeChars(v, options?.charEncoding);
	};
	const encVal = encodeString(JSON.stringify(value, jsonReplacer));
	return options?.explode ? encVal : `${encodeKeyChars(key, options?.charEncoding)}=${encVal}`;
}
function explode(key, value) {
	if (Array.isArray(value)) return value.map((v) => [key, v]);
	else if (isPlainObject(value)) return Object.entries(value ?? {}).map(([k, v]) => [k, v]);
	else return [[key, value]];
}
function serializeValue(value) {
	if (value == null) return "";
	else if (value instanceof Date) return value.toISOString();
	else if (value instanceof Uint8Array) return bytesToBase64(value);
	else if (typeof value === "object") return JSON.stringify(value, jsonReplacer);
	return `${value}`;
}
function jsonReplacer(_, value) {
	if (value instanceof Uint8Array) return bytesToBase64(value);
	else return value;
}
function mapDefined(inp, mapper) {
	const res = inp.reduce((acc, v) => {
		if (v == null) return acc;
		const m = mapper(v);
		if (m == null) return acc;
		acc.push(m);
		return acc;
	}, []);
	return res.length ? res : null;
}
function mapDefinedEntries(inp, mapper) {
	const acc = [];
	for (const [k, v] of inp) {
		if (v == null) continue;
		const m = mapper([k, v]);
		if (m == null) continue;
		acc.push(m);
	}
	return acc.length ? acc : null;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/mistralerror.js
/** The base class for all HTTP error responses */
var MistralError = class extends Error {
	/** HTTP status code */
	statusCode;
	/** HTTP body */
	body;
	/** HTTP headers */
	headers;
	/** HTTP content type */
	contentType;
	/** Raw response */
	rawResponse;
	constructor(message, httpMeta) {
		super(message);
		this.statusCode = httpMeta.response.status;
		this.body = httpMeta.body;
		this.headers = httpMeta.response.headers;
		this.contentType = httpMeta.response.headers.get("content-type") || "";
		this.rawResponse = httpMeta.response;
		this.name = "MistralError";
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/responsevalidationerror.js
var ResponseValidationError = class extends MistralError {
	/**
	* The raw value that failed validation.
	*/
	rawValue;
	/**
	* The raw message that failed validation.
	*/
	rawMessage;
	constructor(message, extra) {
		super(message, extra);
		this.name = "ResponseValidationError";
		this.cause = extra.cause;
		this.rawValue = extra.rawValue;
		this.rawMessage = extra.rawMessage;
	}
	/**
	* Return a pretty-formatted error message if the underlying validation error
	* is a ZodError or some other recognized error type, otherwise return the
	* default error message.
	*/
	pretty() {
		if (this.cause instanceof z$2.$ZodError) return `${this.rawMessage}\n${formatZodError(this.cause)}`;
		else return this.toString();
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/sdkerror.js
/** The fallback error class if no more specific error class is matched */
var SDKError = class extends MistralError {
	constructor(message, httpMeta) {
		if (message) message += `: `;
		message += `Status ${httpMeta.response.status}`;
		const contentType = httpMeta.response.headers.get("content-type") || `""`;
		if (contentType !== "application/json") message += ` Content-Type ${contentType.includes(" ") ? `"${contentType}"` : contentType}`;
		const body = httpMeta.body || `""`;
		message += body.length > 100 ? "\n" : ". ";
		let bodyDisplay = body;
		if (body.length > 1e4) bodyDisplay = `${body.substring(0, 1e4)}...and ${body.length - 1e4} more chars`;
		message += `Body: ${bodyDisplay}`;
		message = message.trim();
		super(message, httpMeta);
		this.name = "SDKError";
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/matchers.js
const DEFAULT_CONTENT_TYPES = {
	jsonl: "application/jsonl",
	json: "application/json",
	text: "text/plain",
	bytes: "application/octet-stream",
	stream: "application/octet-stream",
	sse: "text/event-stream",
	nil: "*",
	fail: "*"
};
function jsonErr(codes, schema, options) {
	return {
		...options,
		err: true,
		enc: "json",
		codes,
		schema
	};
}
function json(codes, schema, options) {
	return {
		...options,
		enc: "json",
		codes,
		schema
	};
}
function sse(codes, schema, options) {
	return {
		...options,
		enc: "sse",
		codes,
		schema
	};
}
function fail(codes) {
	return {
		enc: "fail",
		codes
	};
}
function match(...matchers) {
	return async function matchFunc(response, request, options) {
		let raw;
		let matcher;
		for (const match of matchers) {
			const { codes } = match;
			const ctpattern = "ctype" in match ? match.ctype : DEFAULT_CONTENT_TYPES[match.enc];
			if (ctpattern && matchResponse(response, codes, ctpattern)) {
				matcher = match;
				break;
			} else if (!ctpattern && matchStatusCode(response, codes)) {
				matcher = match;
				break;
			}
		}
		if (!matcher) return [{
			ok: false,
			error: new SDKError("Unexpected Status or Content-Type", {
				response,
				request,
				body: await response.text().catch(() => "")
			})
		}, raw];
		const encoding = matcher.enc;
		let body = "";
		switch (encoding) {
			case "json":
				body = await response.text();
				raw = JSON.parse(body);
				break;
			case "jsonl":
				raw = response.body;
				break;
			case "bytes":
				raw = new Uint8Array(await response.arrayBuffer());
				break;
			case "stream":
				raw = response.body;
				break;
			case "text":
				body = await response.text();
				raw = body;
				break;
			case "sse":
				raw = response.body;
				break;
			case "nil":
				body = await response.text();
				raw = void 0;
				break;
			case "fail":
				body = await response.text();
				raw = body;
				break;
			default: throw new Error(`Unsupported response type: ${encoding}`);
		}
		if (matcher.enc === "fail") return [{
			ok: false,
			error: new SDKError("API error occurred", {
				request,
				response,
				body
			})
		}, raw];
		const resultKey = matcher.key || options?.resultKey;
		let data;
		if ("err" in matcher) data = {
			...options?.extraFields,
			...matcher.hdrs ? { Headers: unpackHeaders(response.headers) } : null,
			...isPlainObject(raw) ? raw : null,
			request$: request,
			response$: response,
			body$: body
		};
		else if (resultKey) data = {
			...options?.extraFields,
			...matcher.hdrs ? { Headers: unpackHeaders(response.headers) } : null,
			[resultKey]: raw
		};
		else if (matcher.hdrs) data = {
			...options?.extraFields,
			...matcher.hdrs ? { Headers: unpackHeaders(response.headers) } : null,
			...isPlainObject(raw) ? raw : null
		};
		else data = raw;
		if ("err" in matcher) {
			const result = safeParseResponse(data, (v) => matcher.schema.parse(v), "Response validation failed", {
				request,
				response,
				body
			});
			return [result.ok ? {
				ok: false,
				error: result.value
			} : result, raw];
		} else return [safeParseResponse(data, (v) => matcher.schema.parse(v), "Response validation failed", {
			request,
			response,
			body
		}), raw];
	};
}
const headerValRE = /, */;
/**
* Iterates over a Headers object and returns an object with all the header
* entries. Values are represented as an array to account for repeated headers.
*/
function unpackHeaders(headers) {
	const out = {};
	for (const [k, v] of headers.entries()) out[k] = v.split(headerValRE);
	return out;
}
function safeParseResponse(rawValue, fn, errorMessage, httpMeta) {
	try {
		return OK(fn(rawValue));
	} catch (err) {
		return ERR(new ResponseValidationError(errorMessage, {
			cause: err,
			rawValue,
			rawMessage: errorMessage,
			...httpMeta
		}));
	}
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/env.js
const envSchema = z$1.object({
	MISTRAL_API_KEY: z$1.string().optional(),
	MISTRAL_DEBUG: z$1.coerce.boolean().optional()
});
/**
* Checks for the existence of the Deno global object to determine the environment.
* @returns {boolean} True if the runtime is Deno, false otherwise.
*/
function isDeno() {
	if ("Deno" in globalThis) return true;
	return false;
}
let envMemo = void 0;
/**
* Reads and validates environment variables.
*/
function env() {
	if (envMemo) return envMemo;
	const globals = globalThis;
	let envObject = {};
	if (isDeno()) envObject = globals.Deno?.env?.toObject?.() ?? {};
	else envObject = globals.process?.env ?? {};
	envMemo = envSchema.parse(envObject);
	return envMemo;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/security.js
const SecurityErrorCode = {
	Incomplete: "incomplete",
	UnrecognisedSecurityType: "unrecognized_security_type"
};
var SecurityError = class SecurityError extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecurityError";
	}
	static incomplete() {
		return new SecurityError(SecurityErrorCode.Incomplete, "Security requirements not met in order to perform the operation");
	}
	static unrecognizedType(type) {
		return new SecurityError(SecurityErrorCode.UnrecognisedSecurityType, `Unrecognised security type: ${type}`);
	}
};
function resolveSecurity(...options) {
	const state = {
		basic: {},
		headers: {},
		queryParams: {},
		cookies: {},
		oauth2: { type: "none" }
	};
	const option = options.find((opts) => {
		return opts.every((o) => {
			if (o.value == null) return false;
			else if (o.type === "http:basic") return o.value.username != null || o.value.password != null;
			else if (o.type === "http:custom") return null;
			else if (o.type === "oauth2:password") return typeof o.value === "string" && !!o.value;
			else if (o.type === "oauth2:client_credentials") {
				if (typeof o.value == "string") return !!o.value;
				return o.value.clientID != null || o.value.clientSecret != null;
			} else if (typeof o.value === "string") return !!o.value;
			else throw new Error(`Unrecognized security type: ${o.type} (value type: ${typeof o.value})`);
		});
	});
	if (option == null) return null;
	option.forEach((spec) => {
		if (spec.value == null) return;
		const { type } = spec;
		switch (type) {
			case "apiKey:header":
				state.headers[spec.fieldName] = spec.value;
				break;
			case "apiKey:query":
				state.queryParams[spec.fieldName] = spec.value;
				break;
			case "apiKey:cookie":
				state.cookies[spec.fieldName] = spec.value;
				break;
			case "http:basic":
				applyBasic(state, spec);
				break;
			case "http:custom": break;
			case "http:bearer":
				applyBearer(state, spec);
				break;
			case "oauth2":
				applyBearer(state, spec);
				break;
			case "oauth2:password":
				applyBearer(state, spec);
				break;
			case "oauth2:client_credentials": break;
			case "openIdConnect":
				applyBearer(state, spec);
				break;
			default: throw SecurityError.unrecognizedType(type);
		}
	});
	return state;
}
function applyBasic(state, spec) {
	if (spec.value == null) return;
	state.basic = spec.value;
}
function applyBearer(state, spec) {
	if (typeof spec.value !== "string" || !spec.value) return;
	let value = spec.value;
	if (value.slice(0, 7).toLowerCase() !== "bearer ") value = `Bearer ${value}`;
	if (spec.fieldName !== void 0) state.headers[spec.fieldName] = value;
}
function resolveGlobalSecurity(security, allowedFields) {
	let inputs = [[{
		fieldName: "Authorization",
		type: "http:bearer",
		value: security?.apiKey ?? env().MISTRAL_API_KEY
	}]];
	if (allowedFields) inputs = allowedFields.map((i) => {
		if (i < 0 || i >= inputs.length) throw new RangeError(`invalid allowedFields index ${i}`);
		return inputs[i];
	});
	return resolveSecurity(...inputs);
}
async function extractSecurity(sec) {
	if (sec == null) return;
	return typeof sec === "function" ? sec() : sec;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/url.js
const hasOwn = Object.prototype.hasOwnProperty;
function pathToFunc(pathPattern, options) {
	const paramRE = /\{([a-zA-Z0-9_][a-zA-Z0-9_-]*?)\}/g;
	return function buildURLPath(params = {}) {
		return pathPattern.replace(paramRE, function(_, placeholder) {
			if (!hasOwn.call(params, placeholder)) throw new Error(`Parameter '${placeholder}' is required`);
			const value = params[placeholder];
			if (typeof value !== "string" && typeof value !== "number") throw new Error(`Parameter '${placeholder}' must be a string or number`);
			return options?.charEncoding === "percent" ? encodeURIComponent(`${value}`) : `${value}`;
		}).replace(/^\/+/, "");
	};
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/toolconfiguration.js
/** @internal */
const ToolConfiguration$inboundSchema = z$1.object({
	exclude: z$1.nullable(z$1.array(z$1.string())).optional(),
	include: z$1.nullable(z$1.array(z$1.string())).optional(),
	requires_confirmation: z$1.nullable(z$1.array(z$1.string())).optional()
}).transform((v) => {
	return remap(v, { "requires_confirmation": "requiresConfirmation" });
});
/** @internal */
const ToolConfiguration$outboundSchema = z$1.object({
	exclude: z$1.nullable(z$1.array(z$1.string())).optional(),
	include: z$1.nullable(z$1.array(z$1.string())).optional(),
	requiresConfirmation: z$1.nullable(z$1.array(z$1.string())).optional()
}).transform((v) => {
	return remap(v, { requiresConfirmation: "requires_confirmation" });
});
z$1.object({
	type: z$1.literal("content").default("content"),
	content: z$1.string().default("")
});
/** @internal */
const Prediction$outboundSchema = z$1.object({
	type: z$1.literal("content").default("content"),
	content: z$1.string().default("")
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/jsonschema.js
/** @internal */
const JsonSchema$inboundSchema = z$1.object({
	name: z$1.string(),
	description: z$1.nullable(z$1.string()).optional(),
	schema: z$1.record(z$1.string(), z$1.any()),
	strict: z$1.boolean().optional()
}).transform((v) => {
	return remap(v, { "schema": "schemaDefinition" });
});
/** @internal */
const JsonSchema$outboundSchema = z$1.object({
	name: z$1.string(),
	description: z$1.nullable(z$1.string()).optional(),
	schemaDefinition: z$1.record(z$1.string(), z$1.any()),
	strict: z$1.boolean().optional()
}).transform((v) => {
	return remap(v, { schemaDefinition: "schema" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/responseformats.js
const ResponseFormats = {
	Text: "text",
	JsonObject: "json_object",
	JsonSchema: "json_schema"
};
/** @internal */
const ResponseFormats$inboundSchema = inboundSchema(ResponseFormats);
/** @internal */
const ResponseFormats$outboundSchema = outboundSchema(ResponseFormats);
z$1.object({
	type: ResponseFormats$inboundSchema.optional(),
	json_schema: z$1.nullable(JsonSchema$inboundSchema).optional()
}).transform((v) => {
	return remap(v, { "json_schema": "jsonSchema" });
});
/** @internal */
const ResponseFormat$outboundSchema = z$1.object({
	type: ResponseFormats$outboundSchema.optional(),
	jsonSchema: z$1.nullable(JsonSchema$outboundSchema).optional()
}).transform((v) => {
	return remap(v, { jsonSchema: "json_schema" });
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/toolchoiceenum.js
const ToolChoiceEnum = {
	Auto: "auto",
	None: "none",
	Any: "any",
	Required: "required"
};
inboundSchema(ToolChoiceEnum);
/** @internal */
const ToolChoiceEnum$outboundSchema = outboundSchema(ToolChoiceEnum);
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/apikeyauth.js
/** @internal */
const APIKeyAuth$inboundSchema = z$1.object({
	type: z$1.literal("api-key"),
	value: z$1.string()
});
/** @internal */
const APIKeyAuth$outboundSchema = z$1.object({
	type: z$1.literal("api-key"),
	value: z$1.string()
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/oauth2tokenauth.js
/** @internal */
const OAuth2TokenAuth$inboundSchema = z$1.object({
	type: z$1.literal("oauth2-token"),
	value: z$1.string()
});
/** @internal */
const OAuth2TokenAuth$outboundSchema = z$1.object({
	type: z$1.literal("oauth2-token"),
	value: z$1.string()
});
discriminatedUnion("type", {
	["api-key"]: APIKeyAuth$inboundSchema,
	["oauth2-token"]: OAuth2TokenAuth$inboundSchema
});
z$1.union([APIKeyAuth$outboundSchema, OAuth2TokenAuth$outboundSchema]);
z$1.object({
	type: z$1.literal("connector"),
	connector_id: z$1.string(),
	authorization: z$1.nullable(discriminatedUnion("type", {
		["api-key"]: APIKeyAuth$inboundSchema,
		["oauth2-token"]: OAuth2TokenAuth$inboundSchema
	})).optional(),
	tool_configuration: z$1.nullable(ToolConfiguration$inboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		"connector_id": "connectorId",
		"tool_configuration": "toolConfiguration"
	});
});
/** @internal */
const CustomConnector$outboundSchema = z$1.object({
	type: z$1.literal("connector"),
	connectorId: z$1.string(),
	authorization: z$1.nullable(z$1.union([APIKeyAuth$outboundSchema, OAuth2TokenAuth$outboundSchema])).optional(),
	toolConfiguration: z$1.nullable(ToolConfiguration$outboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		connectorId: "connector_id",
		toolConfiguration: "tool_configuration"
	});
});
z$1.object({
	tool_configuration: z$1.nullable(ToolConfiguration$inboundSchema).optional(),
	type: z$1.literal("document_library"),
	library_ids: z$1.array(z$1.string())
}).transform((v) => {
	return remap(v, {
		"tool_configuration": "toolConfiguration",
		"library_ids": "libraryIds"
	});
});
/** @internal */
const DocumentLibraryTool$outboundSchema = z$1.object({
	toolConfiguration: z$1.nullable(ToolConfiguration$outboundSchema).optional(),
	type: z$1.literal("document_library"),
	libraryIds: z$1.array(z$1.string())
}).transform((v) => {
	return remap(v, {
		toolConfiguration: "tool_configuration",
		libraryIds: "library_ids"
	});
});
z$1.object({
	name: z$1.string(),
	description: z$1.string().optional(),
	strict: z$1.boolean().optional(),
	parameters: z$1.record(z$1.string(), z$1.any())
});
/** @internal */
const FunctionT$outboundSchema = z$1.object({
	name: z$1.string(),
	description: z$1.string().optional(),
	strict: z$1.boolean().optional(),
	parameters: z$1.record(z$1.string(), z$1.any())
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/moderationllmaction.js
const ModerationLLMAction = {
	None: "none",
	Block: "block"
};
/** @internal */
const ModerationLLMAction$inboundSchema = inboundSchema(ModerationLLMAction);
/** @internal */
const ModerationLLMAction$outboundSchema = outboundSchema(ModerationLLMAction);
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/moderationllmv1categorythresholds.js
/** @internal */
const ModerationLlmv1CategoryThresholds$inboundSchema = z$1.object({
	sexual: z$1.nullable(z$1.number()).optional(),
	hate_and_discrimination: z$1.nullable(z$1.number()).optional(),
	violence_and_threats: z$1.nullable(z$1.number()).optional(),
	dangerous_and_criminal_content: z$1.nullable(z$1.number()).optional(),
	selfharm: z$1.nullable(z$1.number()).optional(),
	health: z$1.nullable(z$1.number()).optional(),
	financial: z$1.nullable(z$1.number()).optional(),
	law: z$1.nullable(z$1.number()).optional(),
	pii: z$1.nullable(z$1.number()).optional()
}).transform((v) => {
	return remap(v, {
		"hate_and_discrimination": "hateAndDiscrimination",
		"violence_and_threats": "violenceAndThreats",
		"dangerous_and_criminal_content": "dangerousAndCriminalContent"
	});
});
/** @internal */
const ModerationLlmv1CategoryThresholds$outboundSchema = z$1.object({
	sexual: z$1.nullable(z$1.number()).optional(),
	hateAndDiscrimination: z$1.nullable(z$1.number()).optional(),
	violenceAndThreats: z$1.nullable(z$1.number()).optional(),
	dangerousAndCriminalContent: z$1.nullable(z$1.number()).optional(),
	selfharm: z$1.nullable(z$1.number()).optional(),
	health: z$1.nullable(z$1.number()).optional(),
	financial: z$1.nullable(z$1.number()).optional(),
	law: z$1.nullable(z$1.number()).optional(),
	pii: z$1.nullable(z$1.number()).optional()
}).transform((v) => {
	return remap(v, {
		hateAndDiscrimination: "hate_and_discrimination",
		violenceAndThreats: "violence_and_threats",
		dangerousAndCriminalContent: "dangerous_and_criminal_content"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/moderationllmv1config.js
/** @internal */
const ModerationLlmv1Config$inboundSchema = z$1.object({
	model_name: z$1.string().default("mistral-moderation-2411"),
	custom_category_thresholds: z$1.nullable(ModerationLlmv1CategoryThresholds$inboundSchema).optional(),
	ignore_other_categories: z$1.boolean().default(false),
	action: ModerationLLMAction$inboundSchema.optional()
}).transform((v) => {
	return remap(v, {
		"model_name": "modelName",
		"custom_category_thresholds": "customCategoryThresholds",
		"ignore_other_categories": "ignoreOtherCategories"
	});
});
/** @internal */
const ModerationLlmv1Config$outboundSchema = z$1.object({
	modelName: z$1.string().default("mistral-moderation-2411"),
	customCategoryThresholds: z$1.nullable(ModerationLlmv1CategoryThresholds$outboundSchema).optional(),
	ignoreOtherCategories: z$1.boolean().default(false),
	action: ModerationLLMAction$outboundSchema.optional()
}).transform((v) => {
	return remap(v, {
		modelName: "model_name",
		customCategoryThresholds: "custom_category_thresholds",
		ignoreOtherCategories: "ignore_other_categories"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/moderationllmv2categorythresholds.js
/** @internal */
const ModerationLlmv2CategoryThresholds$inboundSchema = z$1.object({
	sexual: z$1.nullable(z$1.number()).optional(),
	hate_and_discrimination: z$1.nullable(z$1.number()).optional(),
	violence_and_threats: z$1.nullable(z$1.number()).optional(),
	dangerous: z$1.nullable(z$1.number()).optional(),
	criminal: z$1.nullable(z$1.number()).optional(),
	selfharm: z$1.nullable(z$1.number()).optional(),
	health: z$1.nullable(z$1.number()).optional(),
	financial: z$1.nullable(z$1.number()).optional(),
	law: z$1.nullable(z$1.number()).optional(),
	pii: z$1.nullable(z$1.number()).optional(),
	jailbreaking: z$1.nullable(z$1.number()).optional()
}).transform((v) => {
	return remap(v, {
		"hate_and_discrimination": "hateAndDiscrimination",
		"violence_and_threats": "violenceAndThreats"
	});
});
/** @internal */
const ModerationLlmv2CategoryThresholds$outboundSchema = z$1.object({
	sexual: z$1.nullable(z$1.number()).optional(),
	hateAndDiscrimination: z$1.nullable(z$1.number()).optional(),
	violenceAndThreats: z$1.nullable(z$1.number()).optional(),
	dangerous: z$1.nullable(z$1.number()).optional(),
	criminal: z$1.nullable(z$1.number()).optional(),
	selfharm: z$1.nullable(z$1.number()).optional(),
	health: z$1.nullable(z$1.number()).optional(),
	financial: z$1.nullable(z$1.number()).optional(),
	law: z$1.nullable(z$1.number()).optional(),
	pii: z$1.nullable(z$1.number()).optional(),
	jailbreaking: z$1.nullable(z$1.number()).optional()
}).transform((v) => {
	return remap(v, {
		hateAndDiscrimination: "hate_and_discrimination",
		violenceAndThreats: "violence_and_threats"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/moderationllmv2config.js
/** @internal */
const ModerationLlmv2Config$inboundSchema = z$1.object({
	model_name: z$1.string().default("mistral-moderation-2603"),
	custom_category_thresholds: z$1.nullable(ModerationLlmv2CategoryThresholds$inboundSchema).optional(),
	ignore_other_categories: z$1.boolean().default(false),
	action: ModerationLLMAction$inboundSchema.optional()
}).transform((v) => {
	return remap(v, {
		"model_name": "modelName",
		"custom_category_thresholds": "customCategoryThresholds",
		"ignore_other_categories": "ignoreOtherCategories"
	});
});
/** @internal */
const ModerationLlmv2Config$outboundSchema = z$1.object({
	modelName: z$1.string().default("mistral-moderation-2603"),
	customCategoryThresholds: z$1.nullable(ModerationLlmv2CategoryThresholds$outboundSchema).optional(),
	ignoreOtherCategories: z$1.boolean().default(false),
	action: ModerationLLMAction$outboundSchema.optional()
}).transform((v) => {
	return remap(v, {
		modelName: "model_name",
		customCategoryThresholds: "custom_category_thresholds",
		ignoreOtherCategories: "ignore_other_categories"
	});
});
z$1.object({
	block_on_error: z$1.boolean().default(false),
	moderation_llm_v1: z$1.nullable(ModerationLlmv1Config$inboundSchema).optional(),
	moderation_llm_v2: z$1.nullable(ModerationLlmv2Config$inboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		"block_on_error": "blockOnError",
		"moderation_llm_v1": "moderationLlmV1",
		"moderation_llm_v2": "moderationLlmV2"
	});
});
/** @internal */
const GuardrailConfig$outboundSchema = z$1.object({
	blockOnError: z$1.boolean().default(false),
	moderationLlmV1: z$1.nullable(ModerationLlmv1Config$outboundSchema).optional(),
	moderationLlmV2: z$1.nullable(ModerationLlmv2Config$outboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		blockOnError: "block_on_error",
		moderationLlmV1: "moderation_llm_v1",
		moderationLlmV2: "moderation_llm_v2"
	});
});
z$1.object({
	tool_configuration: z$1.nullable(ToolConfiguration$inboundSchema).optional(),
	type: z$1.literal("image_generation")
}).transform((v) => {
	return remap(v, { "tool_configuration": "toolConfiguration" });
});
/** @internal */
const ImageGenerationTool$outboundSchema = z$1.object({
	toolConfiguration: z$1.nullable(ToolConfiguration$outboundSchema).optional(),
	type: z$1.literal("image_generation")
}).transform((v) => {
	return remap(v, { toolConfiguration: "tool_configuration" });
});
smartUnion([z$1.string(), z$1.array(ContentChunk$inboundSchema)]);
smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)]);
/** @internal */
const AssistantMessage$inboundSchema = z$1.object({
	role: z$1.literal("assistant").default("assistant"),
	content: z$1.nullable(smartUnion([z$1.string(), z$1.array(ContentChunk$inboundSchema)])).optional(),
	tool_calls: z$1.nullable(z$1.array(ToolCall$inboundSchema)).optional(),
	prefix: z$1.boolean().default(false)
}).transform((v) => {
	return remap(v, { "tool_calls": "toolCalls" });
});
/** @internal */
const AssistantMessage$outboundSchema = z$1.object({
	role: z$1.literal("assistant").default("assistant"),
	content: z$1.nullable(smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)])).optional(),
	toolCalls: z$1.nullable(z$1.array(ToolCall$outboundSchema)).optional(),
	prefix: z$1.boolean().default(false)
}).transform((v) => {
	return remap(v, { toolCalls: "tool_calls" });
});
/** @internal */
const MistralPromptMode$outboundSchema = outboundSchema({ Reasoning: "reasoning" });
/** @internal */
const RequestedServiceTier$outboundSchema = z$1.enum({
	Auto: "auto",
	StandardOnly: "standard_only"
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/systemmessagecontentchunks.js
/** @internal */
const SystemMessageContentChunks$outboundSchema = z$1.union([TextChunk$outboundSchema.and(z$1.object({ type: z$1.literal("text") })), ThinkChunk$outboundSchema.and(z$1.object({ type: z$1.literal("thinking") }))]);
smartUnion([z$1.string(), z$1.array(SystemMessageContentChunks$outboundSchema)]);
/** @internal */
const SystemMessage$outboundSchema = z$1.object({
	role: z$1.literal("system"),
	content: smartUnion([z$1.string(), z$1.array(SystemMessageContentChunks$outboundSchema)])
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/tool.js
/** @internal */
const Tool$outboundSchema = z$1.object({
	type: z$1.literal("function"),
	function: FunctionT$outboundSchema
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/functionname.js
/** @internal */
const FunctionName$outboundSchema = z$1.object({ name: z$1.string() });
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/toolchoice.js
/** @internal */
const ToolChoice$outboundSchema = z$1.object({
	type: z$1.string().default("function"),
	function: FunctionName$outboundSchema
});
smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)]);
/** @internal */
const ToolMessage$outboundSchema = z$1.object({
	role: z$1.literal("tool"),
	content: z$1.nullable(smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)])),
	toolCallId: z$1.nullable(z$1.string()).optional(),
	name: z$1.nullable(z$1.string()).optional()
}).transform((v) => {
	return remap(v, { toolCallId: "tool_call_id" });
});
smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)]);
/** @internal */
const UserMessage$outboundSchema = z$1.object({
	role: z$1.literal("user"),
	content: z$1.nullable(smartUnion([z$1.string(), z$1.array(ContentChunk$outboundSchema)]))
});
/** @internal */
const ChatCompletionChoiceFinishReason$inboundSchema = inboundSchema({
	Stop: "stop",
	Length: "length",
	ModelLength: "model_length",
	Error: "error",
	ToolCalls: "tool_calls"
});
/** @internal */
const ChatCompletionChoice$inboundSchema = z$1.object({
	index: z$1.int(),
	message: AssistantMessage$inboundSchema.optional(),
	messages: z$1.array(DeltaMessage$inboundSchema).optional(),
	finish_reason: ChatCompletionChoiceFinishReason$inboundSchema,
	logprobs: z$1.nullable(ChatCompletionResponseChoiceLogprobs$inboundSchema).optional(),
	prompt_logprobs: z$1.nullable(ChatCompletionResponseChoiceLogprobs$inboundSchema).optional()
}).transform((v) => {
	return remap(v, {
		"finish_reason": "finishReason",
		"prompt_logprobs": "promptLogprobs"
	});
});
smartUnion([z$1.string(), z$1.array(z$1.string())]);
z$1.union([
	AssistantMessage$outboundSchema.and(z$1.object({ role: z$1.literal("assistant") })),
	SystemMessage$outboundSchema,
	ToolMessage$outboundSchema,
	UserMessage$outboundSchema
]);
z$1.union([
	Tool$outboundSchema,
	ImageGenerationTool$outboundSchema,
	DocumentLibraryTool$outboundSchema,
	CustomConnector$outboundSchema
]);
smartUnion([ToolChoice$outboundSchema, ToolChoiceEnum$outboundSchema]);
/** @internal */
const ChatCompletionRequest$outboundSchema = z$1.object({
	model: z$1.string(),
	temperature: z$1.nullable(z$1.number()).optional(),
	topP: z$1.nullable(z$1.number()).optional(),
	maxTokens: z$1.nullable(z$1.int()).optional(),
	stream: z$1.boolean().default(false),
	stop: z$1.nullable(smartUnion([z$1.string(), z$1.array(z$1.string())])).optional(),
	randomSeed: z$1.nullable(z$1.int()).optional(),
	metadata: z$1.nullable(z$1.record(z$1.string(), z$1.any())).optional(),
	messages: z$1.array(z$1.union([
		AssistantMessage$outboundSchema.and(z$1.object({ role: z$1.literal("assistant") })),
		SystemMessage$outboundSchema,
		ToolMessage$outboundSchema,
		UserMessage$outboundSchema
	])),
	responseFormat: ResponseFormat$outboundSchema.optional(),
	tools: z$1.nullable(z$1.array(z$1.union([
		Tool$outboundSchema,
		ImageGenerationTool$outboundSchema,
		DocumentLibraryTool$outboundSchema,
		CustomConnector$outboundSchema
	]))).optional(),
	toolChoice: smartUnion([ToolChoice$outboundSchema, ToolChoiceEnum$outboundSchema]).optional(),
	presencePenalty: z$1.nullable(z$1.number()).optional(),
	frequencyPenalty: z$1.nullable(z$1.number()).optional(),
	minTokens: z$1.nullable(z$1.int()).optional(),
	repetitionPenalty: z$1.nullable(z$1.number()).optional(),
	topK: z$1.nullable(z$1.int()).optional(),
	logprobs: z$1.nullable(z$1.boolean()).optional(),
	topLogprobs: z$1.nullable(z$1.int()).optional(),
	promptLogprobs: z$1.nullable(z$1.boolean()).optional(),
	topPromptLogprobs: z$1.nullable(z$1.int()).optional(),
	n: z$1.nullable(z$1.int()).optional(),
	prediction: Prediction$outboundSchema.optional(),
	parallelToolCalls: z$1.boolean().optional(),
	reasoningEffort: z$1.nullable(ReasoningEffort$outboundSchema).optional(),
	promptMode: z$1.nullable(MistralPromptMode$outboundSchema).optional(),
	guardrails: z$1.nullable(z$1.array(GuardrailConfig$outboundSchema)).optional(),
	promptCacheKey: z$1.nullable(z$1.string()).optional(),
	serviceTier: z$1.nullable(RequestedServiceTier$outboundSchema).optional(),
	safePrompt: z$1.boolean().optional()
}).transform((v) => {
	return remap(v, {
		topP: "top_p",
		maxTokens: "max_tokens",
		randomSeed: "random_seed",
		responseFormat: "response_format",
		toolChoice: "tool_choice",
		presencePenalty: "presence_penalty",
		frequencyPenalty: "frequency_penalty",
		minTokens: "min_tokens",
		repetitionPenalty: "repetition_penalty",
		topK: "top_k",
		topLogprobs: "top_logprobs",
		promptLogprobs: "prompt_logprobs",
		topPromptLogprobs: "top_prompt_logprobs",
		parallelToolCalls: "parallel_tool_calls",
		reasoningEffort: "reasoning_effort",
		promptMode: "prompt_mode",
		promptCacheKey: "prompt_cache_key",
		serviceTier: "service_tier",
		safePrompt: "safe_prompt"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/chatcompletionresponse.js
/** @internal */
const ChatCompletionResponse$inboundSchema = z$1.object({
	id: z$1.string(),
	object: z$1.string(),
	model: z$1.string(),
	usage: UsageInfo$inboundSchema,
	created: z$1.int(),
	choices: z$1.array(ChatCompletionChoice$inboundSchema)
});
smartUnion([z$1.string(), z$1.array(z$1.string())]);
z$1.union([
	AssistantMessage$outboundSchema.and(z$1.object({ role: z$1.literal("assistant") })),
	SystemMessage$outboundSchema,
	ToolMessage$outboundSchema,
	UserMessage$outboundSchema
]);
z$1.union([
	Tool$outboundSchema,
	ImageGenerationTool$outboundSchema,
	DocumentLibraryTool$outboundSchema,
	CustomConnector$outboundSchema
]);
smartUnion([ToolChoice$outboundSchema, ToolChoiceEnum$outboundSchema]);
/** @internal */
const ChatCompletionStreamRequest$outboundSchema = z$1.object({
	model: z$1.string(),
	temperature: z$1.nullable(z$1.number()).optional(),
	topP: z$1.nullable(z$1.number()).optional(),
	maxTokens: z$1.nullable(z$1.int()).optional(),
	stream: z$1.boolean().default(true),
	stop: z$1.nullable(smartUnion([z$1.string(), z$1.array(z$1.string())])).optional(),
	randomSeed: z$1.nullable(z$1.int()).optional(),
	metadata: z$1.nullable(z$1.record(z$1.string(), z$1.any())).optional(),
	messages: z$1.array(z$1.union([
		AssistantMessage$outboundSchema.and(z$1.object({ role: z$1.literal("assistant") })),
		SystemMessage$outboundSchema,
		ToolMessage$outboundSchema,
		UserMessage$outboundSchema
	])),
	responseFormat: ResponseFormat$outboundSchema.optional(),
	tools: z$1.nullable(z$1.array(z$1.union([
		Tool$outboundSchema,
		ImageGenerationTool$outboundSchema,
		DocumentLibraryTool$outboundSchema,
		CustomConnector$outboundSchema
	]))).optional(),
	toolChoice: smartUnion([ToolChoice$outboundSchema, ToolChoiceEnum$outboundSchema]).optional(),
	presencePenalty: z$1.nullable(z$1.number()).optional(),
	frequencyPenalty: z$1.nullable(z$1.number()).optional(),
	minTokens: z$1.nullable(z$1.int()).optional(),
	repetitionPenalty: z$1.nullable(z$1.number()).optional(),
	topK: z$1.nullable(z$1.int()).optional(),
	logprobs: z$1.nullable(z$1.boolean()).optional(),
	topLogprobs: z$1.nullable(z$1.int()).optional(),
	promptLogprobs: z$1.nullable(z$1.boolean()).optional(),
	topPromptLogprobs: z$1.nullable(z$1.int()).optional(),
	n: z$1.nullable(z$1.int()).optional(),
	prediction: Prediction$outboundSchema.optional(),
	parallelToolCalls: z$1.boolean().optional(),
	reasoningEffort: z$1.nullable(ReasoningEffort$outboundSchema).optional(),
	promptMode: z$1.nullable(MistralPromptMode$outboundSchema).optional(),
	guardrails: z$1.nullable(z$1.array(GuardrailConfig$outboundSchema)).optional(),
	promptCacheKey: z$1.nullable(z$1.string()).optional(),
	serviceTier: z$1.nullable(RequestedServiceTier$outboundSchema).optional(),
	safePrompt: z$1.boolean().optional()
}).transform((v) => {
	return remap(v, {
		topP: "top_p",
		maxTokens: "max_tokens",
		randomSeed: "random_seed",
		responseFormat: "response_format",
		toolChoice: "tool_choice",
		presencePenalty: "presence_penalty",
		frequencyPenalty: "frequency_penalty",
		minTokens: "min_tokens",
		repetitionPenalty: "repetition_penalty",
		topK: "top_k",
		topLogprobs: "top_logprobs",
		promptLogprobs: "prompt_logprobs",
		topPromptLogprobs: "top_prompt_logprobs",
		parallelToolCalls: "parallel_tool_calls",
		reasoningEffort: "reasoning_effort",
		promptMode: "prompt_mode",
		promptCacheKey: "prompt_cache_key",
		serviceTier: "service_tier",
		safePrompt: "safe_prompt"
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/components/completionevent.js
/** @internal */
const CompletionEvent$inboundSchema = z$1.object({ data: z$1.unknown().transform((v, ctx) => {
	if (typeof v !== "string") return v;
	try {
		return JSON.parse(v);
	} catch (err) {
		ctx.addIssue({
			input: v,
			code: "custom",
			message: `malformed json: ${err}`
		});
		return z$1.NEVER;
	}
}).pipe(CompletionChunk$inboundSchema) });
smartUnion([z$1.string(), z$1.int()]);
/** @internal */
const Context$inboundSchema = z$1.object({});
/** @internal */
const ValidationError$inboundSchema = z$1.object({
	loc: z$1.array(smartUnion([z$1.string(), z$1.int()])),
	msg: z$1.string(),
	type: z$1.string(),
	input: z$1.any().optional(),
	ctx: z$1.lazy(() => Context$inboundSchema).optional()
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/httpclienterrors.js
/**
* Base class for all HTTP errors.
*/
var HTTPClientError = class extends Error {
	/** The underlying cause of the error. */
	cause;
	name = "HTTPClientError";
	constructor(message, opts) {
		let msg = message;
		if (opts?.cause) msg += `: ${opts.cause}`;
		super(msg, opts);
		if (typeof this.cause === "undefined") this.cause = opts?.cause;
	}
};
/**
* An error to capture unrecognised or unexpected errors when making HTTP calls.
*/
var UnexpectedClientError = class extends HTTPClientError {
	name = "UnexpectedClientError";
};
/**
* An error that is raised when any inputs used to create a request are invalid.
*/
var InvalidRequestError = class extends HTTPClientError {
	name = "InvalidRequestError";
};
/**
* An error that is raised when a HTTP request was aborted by the client error.
*/
var RequestAbortedError = class extends HTTPClientError {
	name = "RequestAbortedError";
};
/**
* An error that is raised when a HTTP request timed out due to an AbortSignal
* signal timeout.
*/
var RequestTimeoutError = class extends HTTPClientError {
	name = "RequestTimeoutError";
};
/**
* An error that is raised when a HTTP client is unable to make a request to
* a server.
*/
var ConnectionError = class extends HTTPClientError {
	name = "ConnectionError";
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/models/errors/httpvalidationerror.js
var HTTPValidationError = class extends MistralError {
	detail;
	/** The original data that was passed to this error instance. */
	data$;
	constructor(err, httpMeta) {
		const message = "message" in err && typeof err.message === "string" ? err.message : `API error occurred: ${JSON.stringify(err)}`;
		super(message, httpMeta);
		this.data$ = err;
		if (err.detail != null) this.detail = err.detail;
		this.name = "HTTPValidationError";
	}
};
/** @internal */
const HTTPValidationError$inboundSchema = z$1.object({
	detail: z$1.array(ValidationError$inboundSchema).optional(),
	request$: z$1.custom((x) => x instanceof Request),
	response$: z$1.custom((x) => x instanceof Response),
	body$: z$1.string()
}).transform((v) => {
	return new HTTPValidationError(v, {
		request: v.request$,
		response: v.response$,
		body: v.body$
	});
});
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/types/async.js
var APIPromise = class {
	#promise;
	#unwrapped;
	[Symbol.toStringTag] = "APIPromise";
	constructor(p) {
		this.#promise = p instanceof Promise ? p : Promise.resolve(p);
		this.#unwrapped = p instanceof Promise ? null : Promise.resolve(p[0]);
	}
	#getUnwrapped() {
		return this.#unwrapped ?? (this.#unwrapped = this.#promise.then(([value]) => value));
	}
	then(onfulfilled, onrejected) {
		return this.#promise.then(onfulfilled ? ([value]) => onfulfilled(value) : void 0, onrejected);
	}
	catch(onrejected) {
		return this.#getUnwrapped().catch(onrejected);
	}
	finally(onfinally) {
		return this.#getUnwrapped().finally(onfinally);
	}
	$inspect() {
		return this.#promise;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/funcs/chatComplete.js
/**
* Chat Completion
*/
function chatComplete(client, request, options) {
	return new APIPromise($do$1(client, request, options));
}
async function $do$1(client, request, options) {
	const parsed = safeParse(request, (value) => ChatCompletionRequest$outboundSchema.parse(value), "Input validation failed");
	if (!parsed.ok) return [parsed, { status: "invalid" }];
	const payload = parsed.value;
	const body = encodeJSON("body", payload, { explode: true });
	const path = pathToFunc("/v1/chat/completions")();
	const headers = new Headers(compactMap({
		"Content-Type": "application/json",
		Accept: "application/json"
	}));
	const secConfig = await extractSecurity(client._options.apiKey);
	const requestSecurity = resolveGlobalSecurity(secConfig == null ? {} : { apiKey: secConfig });
	const context = {
		options: client._options,
		baseURL: options?.serverURL ?? client._baseURL ?? "",
		operationID: "chat_completion_v1_chat_completions_post",
		oAuth2Scopes: null,
		resolvedSecurity: requestSecurity,
		securitySource: client._options.apiKey,
		retryConfig: options?.retries || client._options.retryConfig || { strategy: "none" },
		retryCodes: options?.retryCodes || [
			"429",
			"500",
			"502",
			"503",
			"504"
		]
	};
	const requestRes = client._createRequest(context, {
		security: requestSecurity,
		method: "POST",
		baseURL: options?.serverURL,
		path,
		headers,
		body,
		userAgent: client._options.userAgent,
		timeoutMs: options?.timeoutMs || client._options.timeoutMs || 3e5
	}, options);
	if (!requestRes.ok) return [requestRes, { status: "invalid" }];
	const req = requestRes.value;
	const doResult = await client._do(req, {
		context,
		isErrorStatusCode: (statusCode) => matchStatusCode({ status: statusCode }, ["4XX", "5XX"]),
		retryConfig: context.retryConfig,
		retryCodes: context.retryCodes
	});
	if (!doResult.ok) return [doResult, {
		status: "request-error",
		request: req
	}];
	const response = doResult.value;
	const responseFields = { HttpMeta: {
		Response: response,
		Request: req
	} };
	const [result] = await match(json(200, ChatCompletionResponse$inboundSchema), jsonErr(422, HTTPValidationError$inboundSchema), fail("4XX"), fail("5XX"))(response, req, { extraFields: responseFields });
	if (!result.ok) return [result, {
		status: "complete",
		request: req,
		response
	}];
	return [result, {
		status: "complete",
		request: req,
		response
	}];
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/event-streams.js
var EventStream = class extends ReadableStream {
	constructor(responseBody, parse, opts) {
		const upstream = responseBody.getReader();
		let buffer = /* @__PURE__ */ new Uint8Array(4096);
		let bufferLen = 0;
		let searchStart = 0;
		const state = { eventId: void 0 };
		const dataRequired = opts?.dataRequired ?? true;
		super({
			async pull(downstream) {
				try {
					while (true) {
						const match = findBoundary$1(buffer, bufferLen, searchStart);
						if (!match) {
							searchStart = Math.max(0, bufferLen - MAX_BOUNDARY_LEN + 1);
							const chunk = await upstream.read();
							if (chunk.done) return downstream.close();
							if (bufferLen + chunk.value.length > buffer.length) {
								const grown = new Uint8Array(Math.max(buffer.length * 2, bufferLen + chunk.value.length));
								grown.set(buffer.subarray(0, bufferLen));
								buffer = grown;
							}
							buffer.set(chunk.value, bufferLen);
							bufferLen += chunk.value.length;
							continue;
						}
						const message = buffer.slice(0, match.index);
						buffer.copyWithin(0, match.index + match.length, bufferLen);
						bufferLen -= match.index + match.length;
						if (buffer.length > 4096 && bufferLen <= buffer.length >> 2) {
							const shrunk = new Uint8Array(Math.max(4096, bufferLen * 2));
							shrunk.set(buffer.subarray(0, bufferLen));
							buffer = shrunk;
						}
						searchStart = 0;
						const item = parseMessage(message, parse, state, dataRequired);
						if (item && !item.done) return downstream.enqueue(item.value);
						if (item?.done) {
							await upstream.cancel("done");
							return downstream.close();
						}
					}
				} catch (e) {
					downstream.error(e);
					await upstream.cancel(e);
				}
			},
			cancel: (reason) => upstream.cancel(reason)
		});
	}
	[Symbol.asyncIterator]() {
		const fn = ReadableStream.prototype[Symbol.asyncIterator];
		if (typeof fn === "function") return fn.call(this);
		const reader = this.getReader();
		return {
			next: async () => {
				const r = await reader.read();
				if (r.done) {
					reader.releaseLock();
					return {
						done: true,
						value: void 0
					};
				}
				return {
					done: false,
					value: r.value
				};
			},
			throw: async (e) => {
				await reader.cancel(e);
				reader.releaseLock();
				return {
					done: true,
					value: void 0
				};
			},
			return: async () => {
				await reader.cancel("done");
				reader.releaseLock();
				return {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}
};
const CR$1 = 13;
const LF$1 = 10;
const BOUNDARIES$1 = [
	[
		CR$1,
		LF$1,
		CR$1,
		LF$1
	],
	[
		CR$1,
		LF$1,
		CR$1
	],
	[
		CR$1,
		LF$1,
		LF$1
	],
	[
		CR$1,
		CR$1,
		LF$1
	],
	[
		LF$1,
		CR$1,
		LF$1
	],
	[CR$1, CR$1],
	[LF$1, CR$1],
	[LF$1, LF$1]
];
const MAX_BOUNDARY_LEN = BOUNDARIES$1.reduce((m, b) => Math.max(m, b.length), 0);
function findBoundary$1(buf, len, from) {
	for (let i = from; i < len; i++) {
		if (buf[i] !== CR$1 && buf[i] !== LF$1) continue;
		for (const boundary of BOUNDARIES$1) {
			if (i + boundary.length > len) continue;
			let match = true;
			for (let j = 0; j < boundary.length; j++) if (buf[i + j] !== boundary[j]) {
				match = false;
				break;
			}
			if (match) return {
				index: i,
				length: boundary.length
			};
		}
	}
	return null;
}
function parseMessage(chunk, parse, state, dataRequired) {
	const lines = new TextDecoder().decode(chunk).split(/\r\n|\r|\n/);
	const dataLines = [];
	const ret = {};
	let ignore = true;
	for (const line of lines) {
		if (!line || line.startsWith(":")) continue;
		ignore = false;
		const i = line.indexOf(":");
		let field = line;
		let value = "";
		if (i > 0) {
			field = line.slice(0, i);
			value = line[i + 1] === " " ? line.slice(i + 2) : line.slice(i + 1);
		}
		if (field === "data") dataLines.push(value);
		else if (field === "event") ret.event = value;
		else if (field === "id" && !value.includes("\0")) state.eventId = value;
		else if (field === "retry" && /^\d+$/.test(value)) ret.retry = Number(value);
	}
	if (ignore) return;
	ret.id = state.eventId;
	if (dataLines.length) ret.data = dataLines.join("\n");
	else if (dataRequired) return;
	return parse(ret);
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/funcs/chatStream.js
/**
* Stream chat completion
*
* @remarks
* Mistral AI provides the ability to stream responses back to a client in order to allow partial results for certain requests. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
*/
function chatStream(client, request, options) {
	return new APIPromise($do(client, request, options));
}
async function $do(client, request, options) {
	const parsed = safeParse(request, (value) => ChatCompletionStreamRequest$outboundSchema.parse(value), "Input validation failed");
	if (!parsed.ok) return [parsed, { status: "invalid" }];
	const payload = parsed.value;
	const body = encodeJSON("body", payload, { explode: true });
	const path = pathToFunc("/v1/chat/completions#stream")();
	const headers = new Headers(compactMap({
		"Content-Type": "application/json",
		Accept: "text/event-stream"
	}));
	const secConfig = await extractSecurity(client._options.apiKey);
	const requestSecurity = resolveGlobalSecurity(secConfig == null ? {} : { apiKey: secConfig });
	const context = {
		options: client._options,
		baseURL: options?.serverURL ?? client._baseURL ?? "",
		operationID: "stream_chat",
		oAuth2Scopes: null,
		resolvedSecurity: requestSecurity,
		securitySource: client._options.apiKey,
		retryConfig: options?.retries || client._options.retryConfig || { strategy: "none" },
		retryCodes: options?.retryCodes || [
			"429",
			"500",
			"502",
			"503",
			"504"
		]
	};
	const requestRes = client._createRequest(context, {
		security: requestSecurity,
		method: "POST",
		baseURL: options?.serverURL,
		path,
		headers,
		body,
		userAgent: client._options.userAgent,
		timeoutMs: options?.timeoutMs || client._options.timeoutMs || 3e5
	}, options);
	if (!requestRes.ok) return [requestRes, { status: "invalid" }];
	const req = requestRes.value;
	const doResult = await client._do(req, {
		context,
		isErrorStatusCode: (statusCode) => matchStatusCode({ status: statusCode }, ["4XX", "5XX"]),
		retryConfig: context.retryConfig,
		retryCodes: context.retryCodes
	});
	if (!doResult.ok) return [doResult, {
		status: "request-error",
		request: req
	}];
	const response = doResult.value;
	const responseFields = { HttpMeta: {
		Response: response,
		Request: req
	} };
	const [result] = await match(sse(200, z$1.custom((x) => x instanceof ReadableStream).transform((stream) => {
		return new EventStream(stream, (rawEvent) => {
			if (rawEvent.data === "[DONE]") return {
				done: true,
				value: void 0
			};
			return {
				done: false,
				value: CompletionEvent$inboundSchema.parse(rawEvent)
			};
		});
	})), jsonErr(422, HTTPValidationError$inboundSchema), fail("4XX"), fail("5XX"))(response, req, { extraFields: responseFields });
	if (!result.ok) return [result, {
		status: "complete",
		request: req,
		response
	}];
	return [result, {
		status: "complete",
		request: req,
		response
	}];
}
/**
* Contains the list of servers available to the SDK
*/
const ServerList = {
	["global"]: "https://api.mistral.ai",
	["eu"]: "https://api.eu.mistral.ai",
	["us"]: "https://api.us.mistral.ai"
};
function serverURLFromOptions(options) {
	let serverURL = options.serverURL;
	const params = {};
	if (!serverURL) {
		const server = options.server ?? "global";
		serverURL = ServerList[server] || "";
	}
	const u = pathToFunc(serverURL)(params);
	return new URL(u);
}
const SDK_METADATA = {
	language: "typescript",
	openapiDocVersion: "1.0.0",
	sdkVersion: "3.4.0",
	genVersion: "2.935.1",
	userAgent: "speakeasy-sdk/typescript 3.4.0 2.935.1 1.0.0 @mistralai/mistralai"
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/custom_user_agent.js
var CustomUserAgentHook = class {
	beforeRequest(_, request) {
		const ua = `mistral-client-typescript/${SDK_METADATA.sdkVersion}`;
		request.headers.set("user-agent", ua);
		if (!request.headers.get("user-agent")) request.headers.set("x-mistral-user-agent", ua);
		return request;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/deprecation_warning.js
const HEADER_MODEL_DEPRECATION_TIMESTAMP = "x-model-deprecation-timestamp";
var DeprecationWarningHook = class {
	afterSuccess(_, response) {
		if (response.headers.has(HEADER_MODEL_DEPRECATION_TIMESTAMP)) response.clone().json().then((body) => {
			const model = body.model;
			console.warn(`WARNING: The model ${model} is deprecated and will be removed on ${response.headers.get(HEADER_MODEL_DEPRECATION_TIMESTAMP)}. Please refer to https://docs.mistral.ai/getting-started/models/#api-versioning for more information.`);
		}).catch(() => {});
		return response;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/service_account_auth.js
const SA_TOKEN_PATH_ENV = "MISTRAL_SA_TOKEN_PATH";
/** Thrown when the configured service-account token file cannot be read. */
var ServiceAccountTokenError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ServiceAccountTokenError";
	}
};
function serviceAccountTokenPath() {
	return globalThis.process?.env?.[SA_TOKEN_PATH_ENV] || null;
}
/**
* Read the mounted service-account token, or null when no path is configured.
*
* Re-read on every call so kubelet rotation is picked up. `node:fs` is imported lazily so it stays
* out of browser bundles, where there is no `process.env` to configure a path in the first place.
*/
async function readServiceAccountToken() {
	const path = serviceAccountTokenPath();
	if (path === null) return null;
	let contents;
	try {
		const { readFile } = await import("node:fs/promises");
		contents = await readFile(path, "utf8");
	} catch (cause) {
		throw new ServiceAccountTokenError(`Failed to read service-account token from ${path}`, { cause });
	}
	const token = contents.trim();
	if (!token) throw new ServiceAccountTokenError(`Service-account token file is empty: ${path}`);
	return token;
}
function bearerHeader(token) {
	return token.slice(0, 7).toLowerCase() === "bearer " ? token : `Bearer ${token}`;
}
function envAuthorization() {
	const apiKey = env().MISTRAL_API_KEY;
	return apiKey ? bearerHeader(apiKey) : null;
}
/**
* Authenticates requests from a mounted service-account token when no apiKey was passed.
*
* Yields the precedence per-request headers > explicit `apiKey` > `MISTRAL_SA_TOKEN_PATH` >
* `MISTRAL_API_KEY`. The generated client already covers the explicit key and `MISTRAL_API_KEY`.
*/
var ServiceAccountAuthHook = class {
	async beforeRequest(hookCtx, request) {
		if (hookCtx.securitySource != null) return request;
		const existing = request.headers.get("Authorization");
		if (existing !== null && existing !== envAuthorization()) return request;
		const token = await readServiceAccountToken();
		if (token === null) return request;
		request.headers.set("Authorization", bearerHeader(token));
		return request;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/traceparent.js
const EXECUTE_OPERATION_IDS = /* @__PURE__ */ new Set(["execute_workflow_v1_workflows__workflow_identifier__execute_post", "execute_workflow_registration_v1_workflows_registrations__workflow_registration_id__execute_post"]);
const SAMPLED_FLAG = 1;
let otelApi;
async function getOTelApi() {
	if (otelApi !== void 0) return otelApi;
	try {
		otelApi = await import("@opentelemetry/api");
	} catch {
		otelApi = null;
	}
	return otelApi;
}
function isSampled(traceparent) {
	const parts = traceparent.split("-");
	if (parts.length !== 4 || !/^[0-9a-f]+$/i.test(parts[3])) return false;
	return (Number.parseInt(parts[3], 16) & SAMPLED_FLAG) !== 0;
}
function randomHex$1(bytes) {
	return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function sampledTraceparent() {
	const api = await getOTelApi();
	if (api) {
		const carrier = {};
		api.propagation.inject(api.context.active(), carrier);
		const traceparent = carrier["traceparent"] ?? "";
		if (isSampled(traceparent)) return traceparent;
	}
	return `00-${randomHex$1(16)}-${randomHex$1(8)}-01`;
}
async function jsonBody(request) {
	if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return null;
	try {
		const body = await request.clone().json();
		return isPlainObject(body) ? body : null;
	} catch {
		return null;
	}
}
/**
* Sends a sampled traceparent on /execute requests so worker traces are
* always recorded, like the Python client's `TraceparentInjectionHook`.
*
* Sent in both the request body and the header. The body param is
* authoritative; the header is kept for API versions that predate it.
*/
var TraceparentInjectionHook = class {
	#traceparents = /* @__PURE__ */ new WeakMap();
	async beforeRequest(hookCtx, request) {
		if (!EXECUTE_OPERATION_IDS.has(hookCtx.operationID)) return request;
		const body = await jsonBody(request);
		const callerTraceparent = body?.["traceparent"] || request.headers.get("traceparent");
		const traceparent = typeof callerTraceparent === "string" ? callerTraceparent : this.#traceparents.get(hookCtx) ?? await sampledTraceparent();
		this.#traceparents.set(hookCtx, traceparent);
		const headers = new Headers(request.headers);
		headers.set("traceparent", traceparent);
		if (body === null || body["traceparent"]) return new Request(request, { headers });
		body["traceparent"] = traceparent;
		headers.delete("content-length");
		return new Request(request, {
			method: request.method,
			headers,
			body: JSON.stringify(body)
		});
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/tracing.js
let observabilityModule;
let telemetryModule;
async function getObservabilityModule() {
	if (observabilityModule !== void 0) return observabilityModule;
	try {
		observabilityModule = await import("./otel-BD4azLZk.mjs");
	} catch {
		observabilityModule = null;
	}
	return observabilityModule;
}
async function getTelemetryModule() {
	if (telemetryModule !== void 0) return telemetryModule;
	try {
		telemetryModule = await import("./telemetry-bZz-ssYD.mjs");
	} catch {
		telemetryModule = null;
	}
	return telemetryModule;
}
const TRACING_SPAN_KEY = "_tracingSpan";
const TRACING_BODY_KEY = "_tracingBody";
const TRACING_TRACER_KEY = "_tracingTracer";
function clearTracingContext(ctx) {
	delete ctx[TRACING_TRACER_KEY];
	delete ctx[TRACING_SPAN_KEY];
	delete ctx[TRACING_BODY_KEY];
}
var TracingHTTPClient = class TracingHTTPClient extends HTTPClient {
	wrappedClient;
	requestContexts;
	constructor(wrappedClient, requestContexts) {
		super();
		this.wrappedClient = wrappedClient;
		this.requestContexts = requestContexts;
	}
	async request(request) {
		const activeContext = this.requestContexts.get(request);
		if (!activeContext) return this.wrappedClient.request(request);
		let observability = null;
		try {
			observability = await getObservabilityModule();
			if (!observability) return await this.wrappedClient.request(request);
			return await observability.runWithContext(activeContext, () => this.wrappedClient.request(request));
		} catch (error) {
			if (observability) await observability.recordRequestError(activeContext, error);
			throw error;
		} finally {
			this.requestContexts.delete(request);
		}
	}
	clone() {
		return new TracingHTTPClient(this.wrappedClient.clone(), this.requestContexts);
	}
};
var TracingHook = class {
	#requestContexts = /* @__PURE__ */ new WeakMap();
	_mistralTracingHook = true;
	tracerProvider = void 0;
	_autoTelemetryProvider = void 0;
	_telemetryInitialization = void 0;
	_telemetryConfigurationVersion = 0;
	_telemetryAutoDisabled = false;
	_telemetryUseGlobalProvider = false;
	sdkInit(opts) {
		return {
			...opts,
			client: new TracingHTTPClient(opts.client, this.#requestContexts)
		};
	}
	async beforeRequest(hookCtx, request) {
		const ctx = hookCtx;
		const observability = await getObservabilityModule();
		if (!observability) return request;
		const telemetry = await getTelemetryModule();
		if (!((telemetry ? await telemetry.configureTelemetryForHook(this, hookCtx) : false) || this.tracerProvider !== void 0 || this._telemetryUseGlobalProvider || getRegisteredTracerProvider() !== void 0)) {
			clearTracingContext(ctx);
			return request;
		}
		const tracer = observability.getOrCreateOtelTracer(this.tracerProvider, { useRegisteredProvider: !this._telemetryUseGlobalProvider });
		const { request: tracedRequest, span, body } = await observability.getTracedRequestAndSpan(tracer, hookCtx.operationID, request);
		ctx[TRACING_TRACER_KEY] = tracer;
		ctx[TRACING_SPAN_KEY] = span;
		ctx[TRACING_BODY_KEY] = body;
		this.#requestContexts.set(tracedRequest, observability.getSpanContext(span));
		return tracedRequest;
	}
	async afterSuccess(hookCtx, response) {
		const ctx = hookCtx;
		const span = ctx[TRACING_SPAN_KEY];
		const tracer = ctx[TRACING_TRACER_KEY];
		if (!span || !tracer) return response;
		const observability = await getObservabilityModule();
		if (!observability) return response;
		return observability.getTracedResponse(tracer, span, hookCtx.operationID, response);
	}
	async afterError(hookCtx, response, error) {
		const span = hookCtx[TRACING_SPAN_KEY];
		if (!span) return {
			response,
			error
		};
		const observability = await getObservabilityModule();
		if (!observability) return {
			response,
			error
		};
		return observability.getResponseAndError(span, response, error);
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/workflows/encoding/ids.js
const NAMESPACE_DNS = new Uint8Array([
	107,
	167,
	184,
	16,
	157,
	173,
	17,
	209,
	128,
	180,
	0,
	192,
	79,
	212,
	48,
	200
]);
/** Python's `uuid.uuid5(uuid.NAMESPACE_DNS, name).hex`. */
async function uuid5DnsHex(name) {
	const nameBytes = new TextEncoder().encode(name);
	const input = new Uint8Array(NAMESPACE_DNS.length + nameBytes.length);
	input.set(NAMESPACE_DNS, 0);
	input.set(nameBytes, NAMESPACE_DNS.length);
	const bytes = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-1", input)).slice(0, 16);
	bytes[6] = bytes[6] & 15 | 80;
	bytes[8] = bytes[8] & 63 | 128;
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
function randomHex() {
	return globalThis.crypto.randomUUID().replace(/-/g, "");
}
/**
* Generates a unique ID composed of two parts derived from seeds, like the
* Python client's `generate_two_part_id`. Missing seeds are random.
*/
async function generateTwoPartId(primarySeed, secondarySeed) {
	return `${await uuid5DnsHex(primarySeed || randomHex())}${await uuid5DnsHex(secondarySeed || randomHex())}`;
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/workflow_encoding.js
/**
* Port of the Python client's `WorkflowEncodingHook`
* (`mistralai.client._hooks.workflow_encoding_hook`).
*
* Once a client is configured with `configureWorkflowEncoding()`, this hook
* encodes workflow inputs before they are sent (encryption, compression,
* blob storage offloading) and decodes workflow results and event payloads
* (including SSE streams) when they are received.
*/
const EXECUTE_WORKFLOW_OPERATION_ID = "execute_workflow_v1_workflows__workflow_identifier__execute_post";
const EXECUTE_WORKFLOW_REGISTRATION_OPERATION_ID = "execute_workflow_registration_v1_workflows_registrations__workflow_registration_id__execute_post";
const SCHEDULE_WORKFLOW_OPERATION_ID = "schedule_workflow_v1_workflows_schedules_post";
const UPDATE_SCHEDULE_OPERATION_ID = "update_schedule_v1_workflows_schedules__schedule_id__patch";
const EXECUTE_OPERATIONS = /* @__PURE__ */ new Set([EXECUTE_WORKFLOW_OPERATION_ID, EXECUTE_WORKFLOW_REGISTRATION_OPERATION_ID]);
const SCHEDULE_OPERATIONS = /* @__PURE__ */ new Set([SCHEDULE_WORKFLOW_OPERATION_ID, UPDATE_SCHEDULE_OPERATION_ID]);
const OPERATIONS_ENCODE_INPUT = /* @__PURE__ */ new Set([
	EXECUTE_WORKFLOW_OPERATION_ID,
	EXECUTE_WORKFLOW_REGISTRATION_OPERATION_ID,
	"signal_workflow_execution_v1_workflows_executions__execution_id__signals_post",
	"query_workflow_execution_v1_workflows_executions__execution_id__queries_post",
	"update_workflow_execution_v1_workflows_executions__execution_id__updates_post",
	SCHEDULE_WORKFLOW_OPERATION_ID,
	UPDATE_SCHEDULE_OPERATION_ID
]);
const OPERATIONS_DECODE_RESULT = /* @__PURE__ */ new Set([
	EXECUTE_WORKFLOW_OPERATION_ID,
	EXECUTE_WORKFLOW_REGISTRATION_OPERATION_ID,
	"get_workflow_execution_v1_workflows_executions__execution_id__get",
	"query_workflow_execution_v1_workflows_executions__execution_id__queries_post",
	"update_workflow_execution_v1_workflows_executions__execution_id__updates_post"
]);
const OPERATIONS_DECODE_EVENTS = /* @__PURE__ */ new Set(["get_workflow_events_v1_workflows_events_list_get"]);
const OPERATIONS_DECODE_EVENTS_STREAM = /* @__PURE__ */ new Set(["get_stream_events_v1_workflows_events_stream_get", "stream_v1_workflows_executions__execution_id__stream_get"]);
const SCHEDULE_CORRELATION_ID_PLACEHOLDER = "__scheduled_workflow__";
/** Whether a value is a JSONPayload or JSONPatchPayload: `{type, value}`. */
function isPayloadType(value) {
	return isPlainObject(value) && (value["type"] === "json" || value["type"] === "json_patch") && "value" in value;
}
function extractExecutionIdFromUrl(url) {
	return /\/executions\/([^/]+)/.exec(url)?.[1];
}
function extractWorkflowIdentifierFromExecuteUrl(url) {
	return /\/(?:workflows|registrations)\/([^/]+)\/execute/.exec(url)?.[1];
}
async function decryptEventAttributes(attributes, payloadEncoder) {
	for (const [fieldName, fieldValue] of Object.entries(attributes)) {
		if (!isPayloadType(fieldValue)) continue;
		const encodingOptions = fieldValue["encoding_options"];
		if (!Array.isArray(encodingOptions) || encodingOptions.length === 0) continue;
		attributes[fieldName] = await payloadEncoder.decodeEventPayload(fieldValue);
	}
}
async function decryptSseLine(line, payloadEncoder) {
	if (!line.startsWith("data:")) return line;
	const dataPart = line.slice(5).trim();
	if (!dataPart) return line;
	let eventWrapper;
	try {
		eventWrapper = JSON.parse(dataPart);
	} catch {
		return line;
	}
	if (!isPlainObject(eventWrapper)) return line;
	const data = eventWrapper["data"];
	if (!isPlainObject(data) || !isPlainObject(data["attributes"])) return line;
	await decryptEventAttributes(data["attributes"], payloadEncoder);
	return `data: ${JSON.stringify(eventWrapper)}`;
}
/** Headers for a rebuilt body: the SDK reads it already decompressed. */
function rebuiltBodyHeaders(headers) {
	const result = new Headers(headers);
	result.delete("content-encoding");
	result.delete("content-length");
	return result;
}
function jsonResponse(response, body) {
	return new Response(JSON.stringify(body), {
		status: response.status,
		statusText: response.statusText,
		headers: rebuiltBodyHeaders(response.headers)
	});
}
function decryptingSseResponse(response, payloadEncoder) {
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let buffer = "";
	const transform = new TransformStream({
		async transform(chunk, controller) {
			buffer += decoder.decode(chunk, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const decrypted = await decryptSseLine(line, payloadEncoder);
				controller.enqueue(encoder.encode(`${decrypted}\n`));
			}
		},
		async flush(controller) {
			buffer += decoder.decode();
			if (buffer) controller.enqueue(encoder.encode(await decryptSseLine(buffer, payloadEncoder)));
		}
	});
	return new Response(response.body?.pipeThrough(transform) ?? null, {
		status: response.status,
		statusText: response.statusText,
		headers: rebuiltBodyHeaders(response.headers)
	});
}
var WorkflowEncodingHook = class {
	/**
	* Identifies this hook without `instanceof`: bundlers can load the
	* `extra/workflows` entry and the main SDK entry as separate module graphs,
	* each with its own copy of this class.
	*/
	_mistralWorkflowEncodingHook = true;
	#config;
	#executionIds = /* @__PURE__ */ new WeakMap();
	/**
	* Enables payload encoding for the client this hook is registered on.
	*
	* @param namespace - The workflow namespace, under which inputs are
	*   offloaded.
	*/
	configure(payloadEncoder, namespace) {
		this.#config = {
			payloadEncoder,
			namespace
		};
	}
	async beforeRequest(hookCtx, request) {
		const config = this.#config;
		if (!config || !OPERATIONS_ENCODE_INPUT.has(hookCtx.operationID)) return request;
		if (!(request.headers.get("content-type") ?? "").includes("application/json")) return request;
		const body = await request.clone().json();
		if (!isPlainObject(body)) return request;
		const inputHolder = SCHEDULE_OPERATIONS.has(hookCtx.operationID) ? body["schedule"] : body;
		if (!isPlainObject(inputHolder) || inputHolder["input"] == null) return request;
		let executionId = body["execution_id"] || extractExecutionIdFromUrl(request.url);
		if (!executionId && EXECUTE_OPERATIONS.has(hookCtx.operationID)) {
			executionId = this.#executionIds.get(hookCtx) ?? await generateTwoPartId(extractWorkflowIdentifierFromExecuteUrl(request.url));
			this.#executionIds.set(hookCtx, executionId);
			body["execution_id"] = executionId;
		}
		if (!executionId && SCHEDULE_OPERATIONS.has(hookCtx.operationID)) executionId = SCHEDULE_CORRELATION_ID_PLACEHOLDER;
		if (!executionId) throw new Error(`WorkflowEncoding: Could not extract execution_id for ${hookCtx.operationID}`);
		const encodedInput = await config.payloadEncoder.encodeNetworkInput(inputHolder["input"], {
			namespace: config.namespace,
			executionId
		});
		if (EXECUTE_OPERATIONS.has(hookCtx.operationID)) {
			body["encoded_input"] = encodedInput;
			body["input"] = null;
		} else inputHolder["input"] = encodedInput;
		const headers = new Headers(request.headers);
		headers.delete("content-length");
		return new Request(request, {
			method: request.method,
			headers,
			body: JSON.stringify(body)
		});
	}
	async afterSuccess(hookCtx, response) {
		const payloadEncoder = this.#config?.payloadEncoder;
		if (!payloadEncoder) return response;
		const contentType = response.headers.get("content-type") ?? "";
		if (OPERATIONS_DECODE_EVENTS_STREAM.has(hookCtx.operationID)) {
			if (contentType.includes("text/event-stream") && response.body) return decryptingSseResponse(response, payloadEncoder);
			return response;
		}
		if (!contentType.includes("application/json")) return response;
		if (OPERATIONS_DECODE_RESULT.has(hookCtx.operationID)) {
			const body = await response.clone().json();
			if (!isPlainObject(body)) return response;
			const result = body["result"];
			if (result == null || !payloadEncoder.checkIsPayloadEncoded(result)) return response;
			const decoded = await payloadEncoder.decodeNetworkResult(result);
			if (decoded instanceof Uint8Array) throw new Error("WorkflowEncoding: decoded result is not valid JSON");
			body["result"] = decoded;
			return jsonResponse(response, body);
		}
		if (OPERATIONS_DECODE_EVENTS.has(hookCtx.operationID)) {
			const body = await response.clone().json();
			if (!isPlainObject(body) || !Array.isArray(body["events"])) return response;
			for (const event of body["events"]) if (isPlainObject(event) && isPlainObject(event["attributes"])) await decryptEventAttributes(event["attributes"], payloadEncoder);
			return jsonResponse(response, body);
		}
		return response;
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/workflow_stream_error.js
const STREAM_OPERATIONS_WITH_ERROR_EVENT = /* @__PURE__ */ new Set([
	"get_stream_events_v1_workflows_events_stream_get",
	"stream_v1_workflows_executions__execution_id__stream_get",
	"stream_deployment_logs",
	"stream_workflow_execution_logs"
]);
const ERROR_EVENT = "error";
const VALID_REASONS = [
	"read_error",
	"stream_error",
	"internal_error"
];
const DEFAULT_REASON = "stream_error";
var StreamDisconnectedError = class extends Error {
	reason;
	error;
	constructor(options) {
		super("Workflow stream disconnected by server");
		this.name = "StreamDisconnectedError";
		this.reason = options.reason;
		this.error = options.error;
	}
};
const CR = 13;
const LF = 10;
const BOUNDARIES = [
	[
		CR,
		LF,
		CR,
		LF
	],
	[
		CR,
		LF,
		CR
	],
	[
		CR,
		LF,
		LF
	],
	[
		CR,
		CR,
		LF
	],
	[
		LF,
		CR,
		LF
	],
	[CR, CR],
	[LF, CR],
	[LF, LF]
];
function findBoundary(buf) {
	const len = buf.length;
	for (let i = 0; i < len; i++) {
		if (buf[i] !== CR && buf[i] !== LF) continue;
		for (const boundary of BOUNDARIES) {
			if (i + boundary.length > len) continue;
			let match = true;
			for (let j = 0; j < boundary.length; j++) if (buf[i + j] !== boundary[j]) {
				match = false;
				break;
			}
			if (match) return {
				index: i,
				length: boundary.length
			};
		}
	}
	return null;
}
function concatBuffer(a, b) {
	const c = new Uint8Array(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}
function parseErrorPayload(data) {
	const raw = data.trim();
	let payload = {};
	for (const candidate of [raw, raw.replace(/\r?\n/g, "\\n")]) try {
		const parsed = JSON.parse(candidate);
		if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
			payload = parsed;
			break;
		}
	} catch {
		continue;
	}
	const error = "error" in payload ? String(payload["error"]) : raw;
	const reason = payload["reason"];
	return {
		error,
		reason: VALID_REASONS.includes(reason) ? reason : DEFAULT_REASON
	};
}
function errorFromFrame(block) {
	const text = new TextDecoder().decode(block);
	let eventName;
	const dataLines = [];
	for (const line of text.split(/\r\n|\r|\n/)) {
		if (!line || line.startsWith(":")) continue;
		const i = line.indexOf(":");
		let field = line;
		let value = "";
		if (i > 0) {
			field = line.slice(0, i);
			value = line[i + 1] === " " ? line.slice(i + 2) : line.slice(i + 1);
		}
		if (field === "event") eventName = value;
		else if (field === "data") dataLines.push(value);
	}
	if (eventName !== ERROR_EVENT) return null;
	return new StreamDisconnectedError(parseErrorPayload(dataLines.join("\n")));
}
var FrameScanner = class {
	buffer = /* @__PURE__ */ new Uint8Array();
	error = null;
	feed(chunk) {
		if (this.error) return [];
		this.buffer = concatBuffer(this.buffer, chunk);
		const frames = [];
		for (;;) {
			const match = findBoundary(this.buffer);
			if (!match) return frames;
			const block = this.buffer.slice(0, match.index);
			const frame = this.buffer.slice(0, match.index + match.length);
			this.buffer = this.buffer.slice(match.index + match.length);
			this.error = errorFromFrame(block);
			if (this.error) return frames;
			frames.push(frame);
		}
	}
	flush() {
		if (this.error || !this.buffer.length) return [];
		const block = this.buffer;
		this.buffer = /* @__PURE__ */ new Uint8Array();
		this.error = errorFromFrame(block);
		return this.error ? [] : [block];
	}
};
function createErrorDetectingResponse(response) {
	const reader = response.body.getReader();
	const scanner = new FrameScanner();
	const stream = new ReadableStream({
		async pull(controller) {
			const fail = async (err) => {
				controller.error(err);
				try {
					await reader.cancel(err);
				} catch {}
			};
			if (scanner.error) return fail(scanner.error);
			try {
				for (;;) {
					const result = await reader.read();
					const frames = result.done ? scanner.flush() : scanner.feed(result.value);
					for (const frame of frames) controller.enqueue(frame);
					if (frames.length) return;
					if (scanner.error) return fail(scanner.error);
					if (result.done) {
						controller.close();
						return;
					}
				}
			} catch (err) {
				await fail(err);
			}
		},
		async cancel(reason) {
			await reader.cancel(reason);
		}
	}, { highWaterMark: 0 });
	return new Response(stream, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
var WorkflowStreamErrorHook = class {
	afterSuccess(hookCtx, response) {
		if (!STREAM_OPERATIONS_WITH_ERROR_EVENT.has(hookCtx.operationID)) return response;
		if (!(response.headers.get("content-type") ?? "").toLowerCase().includes("text/event-stream")) return response;
		if (!response.body || response.bodyUsed) return response;
		return createErrorDetectingResponse(response);
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/registration.js
function initHooks(hooks) {
	const serviceAccountAuthHook = new ServiceAccountAuthHook();
	hooks.registerBeforeRequestHook(serviceAccountAuthHook);
	const customUserAgentHook = new CustomUserAgentHook();
	hooks.registerBeforeRequestHook(customUserAgentHook);
	const traceparentInjectionHook = new TraceparentInjectionHook();
	hooks.registerBeforeRequestHook(traceparentInjectionHook);
	const deprecationWarningHook = new DeprecationWarningHook();
	hooks.registerAfterSuccessHook(deprecationWarningHook);
	const workflowEncodingHook = new WorkflowEncodingHook();
	hooks.registerBeforeRequestHook(workflowEncodingHook);
	hooks.registerAfterSuccessHook(workflowEncodingHook);
	const workflowStreamErrorHook = new WorkflowStreamErrorHook();
	hooks.registerAfterSuccessHook(workflowStreamErrorHook);
	const tracingHook = new TracingHook();
	hooks.registerBeforeRequestHook(tracingHook);
	hooks.registerAfterSuccessHook(tracingHook);
	hooks.registerAfterErrorHook(tracingHook);
	hooks.registerSDKInitHook(tracingHook);
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/hooks/hooks.js
var SDKHooks = class {
	sdkInitHooks = [];
	beforeCreateRequestHooks = [];
	beforeRequestHooks = [];
	afterSuccessHooks = [];
	afterErrorHooks = [];
	constructor() {
		for (const hook of []) {
			if ("sdkInit" in hook) this.registerSDKInitHook(hook);
			if ("beforeCreateRequest" in hook) this.registerBeforeCreateRequestHook(hook);
			if ("beforeRequest" in hook) this.registerBeforeRequestHook(hook);
			if ("afterSuccess" in hook) this.registerAfterSuccessHook(hook);
			if ("afterError" in hook) this.registerAfterErrorHook(hook);
		}
		initHooks(this);
	}
	registerSDKInitHook(hook) {
		this.sdkInitHooks.push(hook);
	}
	registerBeforeCreateRequestHook(hook) {
		this.beforeCreateRequestHooks.push(hook);
	}
	registerBeforeRequestHook(hook) {
		this.beforeRequestHooks.push(hook);
	}
	registerAfterSuccessHook(hook) {
		this.afterSuccessHooks.push(hook);
	}
	registerAfterErrorHook(hook) {
		this.afterErrorHooks.push(hook);
	}
	sdkInit(opts) {
		return this.sdkInitHooks.reduce((opts, hook) => hook.sdkInit(opts), opts);
	}
	beforeCreateRequest(hookCtx, input) {
		let inp = input;
		for (const hook of this.beforeCreateRequestHooks) inp = hook.beforeCreateRequest(hookCtx, inp);
		return inp;
	}
	async beforeRequest(hookCtx, request) {
		let req = request;
		for (const hook of this.beforeRequestHooks) req = await hook.beforeRequest(hookCtx, req);
		return req;
	}
	async afterSuccess(hookCtx, response) {
		let res = response;
		for (const hook of this.afterSuccessHooks) res = await hook.afterSuccess(hookCtx, res);
		return res;
	}
	async afterError(hookCtx, response, error) {
		let res = response;
		let err = error;
		for (const hook of this.afterErrorHooks) {
			const result = await hook.afterError(hookCtx, res, err);
			res = result.response;
			err = result.error;
		}
		return {
			response: res,
			error: err
		};
	}
};
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/retries.js
const defaultBackoff = {
	initialInterval: 500,
	maxInterval: 6e4,
	exponent: 1.5,
	maxElapsedTime: 36e5
};
/**
* PermanentError is an error that is not recoverable. Throwing this error will
* cause a retry loop to terminate.
*/
var PermanentError = class PermanentError extends Error {
	/** The underlying cause of the error. */
	cause;
	constructor(message, options) {
		let msg = message;
		if (options?.cause) msg += `: ${options.cause}`;
		super(msg, options);
		this.name = "PermanentError";
		if (typeof this.cause === "undefined") this.cause = options?.cause;
		Object.setPrototypeOf(this, PermanentError.prototype);
	}
};
/**
* TemporaryError is an error is used to signal that an HTTP request can be
* retried as part of a retry loop. If retry attempts are exhausted and this
* error is thrown, the response will be returned to the caller.
*/
var TemporaryError = class TemporaryError extends Error {
	response;
	constructor(message, response) {
		super(message);
		this.response = response;
		this.name = "TemporaryError";
		Object.setPrototypeOf(this, TemporaryError.prototype);
	}
};
async function retry(fetchFn, options) {
	switch (options.config.strategy) {
		case "backoff": return retryBackoff(wrapFetcher(fetchFn, {
			statusCodes: options.statusCodes,
			retryConnectionErrors: !!options.config.retryConnectionErrors
		}), options.config.backoff ?? defaultBackoff);
		default: return await fetchFn();
	}
}
function wrapFetcher(fn, options) {
	return async () => {
		try {
			const res = await fn();
			if (isRetryableResponse(res, options.statusCodes)) throw new TemporaryError("Response failed with retryable status code", res);
			return res;
		} catch (err) {
			if (err instanceof TemporaryError) throw err;
			if (options.retryConnectionErrors && (isTimeoutError(err) || isConnectionError(err))) throw err;
			throw new PermanentError("Permanent error", { cause: err });
		}
	};
}
const codeRangeRE = /* @__PURE__ */ new RegExp("^[0-9]xx$", "i");
function isRetryableResponse(res, statusCodes) {
	const actual = `${res.status}`;
	return statusCodes.some((code) => {
		if (!codeRangeRE.test(code)) return code === actual;
		const expectFamily = code.charAt(0);
		if (!expectFamily) throw new Error("Invalid status code range");
		const actualFamily = actual.charAt(0);
		if (!actualFamily) throw new Error(`Invalid response status code: ${actual}`);
		return actualFamily === expectFamily;
	});
}
async function retryBackoff(fn, strategy) {
	const { maxElapsedTime, initialInterval, exponent, maxInterval } = strategy;
	const start = Date.now();
	let x = 0;
	while (true) try {
		return await fn();
	} catch (err) {
		if (err instanceof PermanentError) throw err.cause;
		if (Date.now() - start > maxElapsedTime) {
			if (err instanceof TemporaryError) return err.response;
			throw err;
		}
		let retryInterval = 0;
		if (err instanceof TemporaryError) retryInterval = retryIntervalFromResponse(err.response);
		if (retryInterval <= 0) retryInterval = initialInterval * Math.pow(x, exponent) + Math.random() * 1e3;
		await delay(Math.min(retryInterval, maxInterval));
		x++;
	}
}
function retryIntervalFromResponse(res) {
	const retryAfterMsVal = res.headers.get("retry-after-ms");
	if (retryAfterMsVal) {
		const parsedMs = Number(retryAfterMsVal);
		if (Number.isFinite(parsedMs) && parsedMs >= 0) return parsedMs;
	}
	const retryVal = res.headers.get("retry-after") || "";
	if (!retryVal) return 0;
	const parsedNumber = Number(retryVal);
	if (Number.isInteger(parsedNumber)) return parsedNumber * 1e3;
	const parsedDate = Date.parse(retryVal);
	if (Number.isInteger(parsedDate)) {
		const deltaMS = parsedDate - Date.now();
		return deltaMS > 0 ? Math.ceil(deltaMS) : 0;
	}
	return 0;
}
async function delay(delay) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/lib/sdks.js
const gt = typeof globalThis === "undefined" ? null : globalThis;
const isBrowserLike = typeof gt === "object" && gt != null && "importScripts" in gt && typeof gt["importScripts"] === "function" || typeof navigator !== "undefined" && "serviceWorker" in navigator || typeof window === "object" && typeof window.document !== "undefined";
var ClientSDK = class {
	#httpClient;
	#hooks;
	#logger;
	_baseURL;
	_options;
	constructor(options = {}) {
		const opt = options;
		if (typeof opt === "object" && opt != null && "hooks" in opt && opt.hooks instanceof SDKHooks) this.#hooks = opt.hooks;
		else this.#hooks = new SDKHooks();
		const url = serverURLFromOptions(options);
		if (url) url.pathname = url.pathname.replace(/\/+$/, "") + "/";
		const { baseURL, client } = this.#hooks.sdkInit({
			baseURL: url,
			client: options.httpClient || new HTTPClient()
		});
		this._baseURL = baseURL;
		this.#httpClient = client;
		this._options = {
			...options,
			hooks: this.#hooks
		};
		this.#logger = this._options.debugLogger;
		if (!this.#logger && env().MISTRAL_DEBUG) this.#logger = console;
	}
	_createRequest(context, conf, options) {
		const { method, path, query, headers: opHeaders, security } = conf;
		const base = conf.baseURL ?? this._baseURL;
		if (!base) return ERR(new InvalidRequestError("No base URL provided for operation"));
		const baseURL = new URL(base);
		let reqURL;
		if (path) {
			baseURL.pathname = baseURL.pathname.replace(/\/+$/, "") + "/";
			reqURL = new URL(path, baseURL);
			if (!reqURL.search && baseURL.search) reqURL.search = baseURL.search;
		} else reqURL = baseURL;
		reqURL.hash = "";
		const mergeQuery = (current, additions) => {
			if (!additions) return current;
			const additionKeys = new Set(additions.split("&").filter((pair) => pair !== "").map((pair) => pair.split("=")[0] ?? ""));
			return [...current.split("&").filter((pair) => {
				return pair !== "" && !additionKeys.has(pair.split("=")[0] ?? "");
			}), additions].join("&");
		};
		const encodeQueryRecord = (record) => {
			return Object.entries(record).map(([k, v]) => {
				if (v == null) return;
				const value = v;
				return encodeForm(k, value, {
					explode: Array.isArray(value),
					charEncoding: "percent"
				});
			}).filter((pair) => typeof pair !== "undefined").join("&");
		};
		const finalQuery = [query || "", encodeQueryRecord(security?.queryParams || {})].reduce(mergeQuery, reqURL.search.slice(1));
		if (finalQuery) reqURL.search = `?${finalQuery}`;
		const headers = new Headers(opHeaders);
		const username = security?.basic.username;
		const password = security?.basic.password;
		if (username != null || password != null) {
			const encoded = stringToBase64([username || "", password || ""].join(":"));
			headers.set("Authorization", `Basic ${encoded}`);
		}
		const securityHeaders = new Headers(security?.headers || {});
		for (const [k, v] of securityHeaders) headers.set(k, v);
		let cookie = headers.get("cookie") || "";
		for (const [k, v] of Object.entries(security?.cookies || {})) cookie += `; ${k}=${v}`;
		cookie = cookie.startsWith("; ") ? cookie.slice(2) : cookie;
		headers.set("cookie", cookie);
		const userHeaders = new Headers(options?.headers ?? options?.fetchOptions?.headers);
		for (const [k, v] of userHeaders) headers.set(k, v);
		if (!isBrowserLike) headers.set(conf.uaHeader ?? "user-agent", conf.userAgent ?? SDK_METADATA.userAgent);
		const fetchOptions = {
			...options?.fetchOptions,
			...options
		};
		if (!fetchOptions?.signal && conf.timeoutMs != null && conf.timeoutMs > 0) context.timeoutMs = conf.timeoutMs;
		if (conf.body instanceof ReadableStream) Object.assign(fetchOptions, { duplex: "half" });
		let input;
		try {
			input = this.#hooks.beforeCreateRequest(context, {
				url: reqURL,
				options: {
					...fetchOptions,
					body: conf.body ?? null,
					headers,
					method
				}
			});
		} catch (err) {
			return ERR(new UnexpectedClientError("Create request hook failed to execute", { cause: err }));
		}
		return OK(new Request(input.url, input.options));
	}
	async _do(request, options) {
		const { context, isErrorStatusCode } = options;
		const timeoutMs = context.timeoutMs;
		return retry(async () => {
			const cloned = request.clone();
			let attempt = cloned;
			if (timeoutMs != null && timeoutMs > 0) {
				const timeoutSignal = AbortSignal.timeout(timeoutMs);
				const combined = combineSignals(cloned.signal, timeoutSignal) ?? timeoutSignal;
				attempt = new Request(cloned, { signal: combined });
			}
			const req = await this.#hooks.beforeRequest(context, attempt);
			await logRequest(this.#logger, req).catch((e) => this.#logger?.log("Failed to log request:", e));
			let response = await this.#httpClient.request(req);
			try {
				if (isErrorStatusCode(response.status)) {
					const result = await this.#hooks.afterError(context, response, null);
					if (result.error) throw result.error;
					response = result.response || response;
				} else response = await this.#hooks.afterSuccess(context, response);
			} finally {
				await logResponse(this.#logger, response, req).catch((e) => this.#logger?.log("Failed to log response:", e));
			}
			return response;
		}, {
			config: options.retryConfig,
			statusCodes: options.retryCodes
		}).then((r) => OK(r), (err) => {
			switch (true) {
				case isAbortError(err): return ERR(new RequestAbortedError("Request aborted by client", { cause: err }));
				case isTimeoutError(err): return ERR(new RequestTimeoutError("Request timed out", { cause: err }));
				case isConnectionError(err): return ERR(new ConnectionError("Unable to make request", { cause: err }));
				default: return ERR(new UnexpectedClientError("Unexpected HTTP client error", { cause: err }));
			}
		});
	}
};
const jsonLikeContentTypeRE = /^(application|text)\/([^+]+\+)*json.*/;
const jsonlLikeContentTypeRE = /^(application|text)\/([^+]+\+)*(jsonl|x-ndjson)\b.*/;
async function logRequest(logger, req) {
	if (!logger) return;
	const contentType = req.headers.get("content-type");
	const ct = contentType?.split(";")[0] || "";
	logger.group(`> Request: ${req.method} ${req.url}`);
	logger.group("Headers:");
	for (const [k, v] of req.headers.entries()) logger.log(`${k}: ${v}`);
	logger.groupEnd();
	logger.group("Body:");
	switch (true) {
		case jsonLikeContentTypeRE.test(ct):
			logger.log(await req.clone().json());
			break;
		case ct.startsWith("text/"):
			logger.log(await req.clone().text());
			break;
		case ct === "multipart/form-data": {
			const body = await req.clone().formData();
			for (const [k, v] of body) {
				const vlabel = v instanceof Blob ? "<Blob>" : v;
				logger.log(`${k}: ${vlabel}`);
			}
			break;
		}
		default: logger.log(`<${contentType}>`);
	}
	logger.groupEnd();
	logger.groupEnd();
}
async function logResponse(logger, res, req) {
	if (!logger) return;
	const contentType = res.headers.get("content-type");
	const ct = contentType?.split(";")[0] || "";
	logger.group(`< Response: ${req.method} ${req.url}`);
	logger.log("Status Code:", res.status, res.statusText);
	logger.group("Headers:");
	for (const [k, v] of res.headers.entries()) logger.log(`${k}: ${v}`);
	logger.groupEnd();
	logger.group("Body:");
	switch (true) {
		case matchContentType(res, "application/json") || jsonLikeContentTypeRE.test(ct) && !jsonlLikeContentTypeRE.test(ct):
			logger.log(await res.clone().json());
			break;
		case matchContentType(res, "application/jsonl") || jsonlLikeContentTypeRE.test(ct):
		case matchContentType(res, "text/event-stream"):
			logger.log(`<${contentType}>`);
			break;
		case matchContentType(res, "text/*"):
			logger.log(await res.clone().text());
			break;
		case matchContentType(res, "multipart/form-data"): {
			const body = await res.clone().formData();
			for (const [k, v] of body) {
				const vlabel = v instanceof Blob ? "<Blob>" : v;
				logger.log(`${k}: ${vlabel}`);
			}
			break;
		}
		default: logger.log(`<${contentType}>`);
	}
	logger.groupEnd();
	logger.groupEnd();
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/extra/structChat.js
/**
* Recursively makes a JSON schema strict-mode compatible:
* - Sets additionalProperties: false on all objects
* - Makes optional properties required with nullable type
* Mirrors Python SDK's rec_strict_json_schema + optional handling.
*/
function makeStrictJsonSchema(node) {
	if (typeof node !== "object" || node === null) return node;
	const result = { ...node };
	if (result.type === "object" && result.properties && typeof result.properties === "object") {
		const required = new Set(Array.isArray(result.required) ? result.required : []);
		const props = {};
		for (const [key, value] of Object.entries(result.properties)) {
			const processed = makeStrictJsonSchema(value);
			if (!required.has(key)) {
				required.add(key);
				if (Array.isArray(processed.type)) {
					if (!processed.type.includes("null")) props[key] = {
						...processed,
						type: [...processed.type, "null"]
					};
					else props[key] = processed;
				} else if (Array.isArray(processed.anyOf)) {
					if (!processed.anyOf.some((s) => s.type === "null")) props[key] = {
						...processed,
						anyOf: [...processed.anyOf, { type: "null" }]
					};
					else props[key] = processed;
				} else if (processed.type) props[key] = {
					...processed,
					type: [processed.type, "null"]
				};
				else props[key] = processed;
			} else props[key] = processed;
		}
		result.properties = props;
		result.required = [...required];
		result.additionalProperties = false;
	}
	if (result.items) result.items = makeStrictJsonSchema(result.items);
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf"
	]) if (Array.isArray(result[key])) result[key] = result[key].map(makeStrictJsonSchema);
	for (const key of ["$defs", "definitions"]) if (result[key] && typeof result[key] === "object") {
		const defs = {};
		for (const [k, v] of Object.entries(result[key])) defs[k] = makeStrictJsonSchema(v);
		result[key] = defs;
	}
	return result;
}
function toJsonSchema(schema) {
	let jsonSchema;
	if ("_zod" in schema) jsonSchema = z.toJSONSchema(schema);
	else jsonSchema = zodToJsonSchema(schema, { target: "openAi" });
	delete jsonSchema["$schema"];
	return makeStrictJsonSchema(jsonSchema);
}
function transformToChatCompletionRequest(parsedRequest) {
	const { responseFormat, ...rest } = parsedRequest;
	const transformedResponseFormat = responseFormatFromZodObject(responseFormat);
	return {
		...rest,
		...transformedResponseFormat ? { responseFormat: transformedResponseFormat } : {}
	};
}
function convertToParsedChatCompletionResponse(response, responseFormat) {
	if (response.choices === void 0 || response.choices.length === 0) return {
		...response,
		choices: response.choices === void 0 ? void 0 : []
	};
	const parsedChoices = [];
	for (const _choice of response.choices) if (_choice.message === null || typeof _choice.message === "undefined") parsedChoices.push({
		..._choice,
		message: void 0
	});
	else if (_choice.message.content !== null && typeof _choice.message.content !== "undefined" && !Array.isArray(_choice.message.content)) {
		let parsed;
		try {
			parsed = responseFormat.safeParse(JSON.parse(_choice.message.content)).data;
		} catch {
			parsed = void 0;
		}
		parsedChoices.push({
			..._choice,
			message: {
				..._choice.message,
				parsed
			}
		});
	} else parsedChoices.push({
		..._choice,
		message: {
			..._choice.message,
			parsed: void 0
		}
	});
	return {
		...response,
		choices: parsedChoices
	};
}
function responseFormatFromZodObject(responseFormat) {
	return {
		type: "json_schema",
		jsonSchema: {
			name: "placeholderName",
			schemaDefinition: toJsonSchema(responseFormat),
			strict: true
		}
	};
}
// node_modules/.pnpm/@mistralai+mistralai@3.4.0__16bd8ad5369b63d330551c8b3f594697/node_modules/@mistralai/mistralai/esm/sdk/chat.js
var Chat = class extends ClientSDK {
	/**
	* Chat Completion with the response parsed in the same format as the input requestFormat.
	*
	* @remarks
	* The response will be parsed back to the initial Zod object passed in the requestFormat field.
	*/
	async parse(request, options) {
		const ccr_request = transformToChatCompletionRequest(request);
		return convertToParsedChatCompletionResponse(await unwrapAsync(chatComplete(this, ccr_request, options)), request.responseFormat);
	}
	/**
	* Stream chat completion with a parsed request input.
	*
	* @remarks
	* Unlike the .parse method, this method will return a stream of events containing the JSON response. It will not be parsed back to the initial Zod object.
	* If you need to parse the stream, see the examples/src/async_structured_outputs.ts file.
	*/
	async parseStream(request, options) {
		const ccr_request = transformToChatCompletionRequest(request);
		return unwrapAsync(chatStream(this, ccr_request, options));
	}
	/**
	* Chat Completion
	*/
	async complete(request, options) {
		return unwrapAsync(chatComplete(this, request, options));
	}
	/**
	* Stream chat completion
	*
	* @remarks
	* Mistral AI provides the ability to stream responses back to a client in order to allow partial results for certain requests. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message. Otherwise, the server will hold the request open until the timeout or until completion, with the response containing the full result as JSON.
	*/
	async stream(request, options) {
		return unwrapAsync(chatStream(this, request, options));
	}
};
// packages/ai/src/providers/mistral.ts
var mistral_exports = /* @__PURE__ */ __exportAll({
	createBoundedMistralFetcher: () => createBoundedMistralFetcher,
	streamMistral: () => streamMistral,
	streamSimpleMistral: () => streamSimpleMistral
});
const MISTRAL_TOOL_CALL_ID_LENGTH = 9;
const MISTRAL_STREAM_BODY_MAX_BYTES = 16777216;
/** Cap the SDK's response reader while preserving bodyless error responses. */
function createBoundedMistralFetcher(upstreamFetch) {
	return async (input, init) => {
		const response = init == null ? await upstreamFetch(input) : await upstreamFetch(input, init);
		return boundResponseBody(response, {
			maxBytes: MISTRAL_STREAM_BODY_MAX_BYTES,
			onOverflow: ({ size, maxBytes: cap }) => /* @__PURE__ */ new Error(`mistral: stream body exceeds ${cap} bytes (got ${size})`)
		});
	};
}
const streamMistral = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = createAssistantOutput(model);
		try {
			const apiKey = requireApiKey(model.provider, options?.apiKey);
			const boundedFetcher = createBoundedMistralFetcher(getAiTransportHost().buildModelFetch(model) ?? fetch);
			let mistralResponse;
			let reportedResponse;
			const httpClient = new HTTPClient({ fetcher: boundedFetcher });
			httpClient.addHook("response", async (response) => {
				mistralResponse = response;
				if (!response.ok) {
					await notifyProviderHttpResponse({
						options,
						response,
						model
					});
					reportedResponse = response;
				}
			});
			const chat = new Chat({
				apiKey,
				serverURL: model.baseUrl,
				httpClient,
				retryConfig: { strategy: "none" }
			});
			const normalizeMistralToolCallId = createMistralToolCallIdNormalizer();
			const transformedMessages = transformProviderMessages(context.messages, model, normalizeMistralToolCallId);
			let payload = {
				model: model.id,
				stream: true,
				messages: toChatMessages(transformedMessages, model.input.includes("image"))
			};
			let convertedToolNames;
			if (context.tools?.length) {
				const toolsToConvert = context.tools;
				const mutablePayload = Boolean(options?.onPayload);
				const converted = toolsToConvert.map((tool) => {
					const name = tool.name;
					const description = tool.description;
					const parameters = tool.parameters;
					return {
						name,
						description,
						value: {
							type: "function",
							function: {
								name,
								description,
								parameters: !mutablePayload && getPublishedRuntimeToolInputSchema(parameters) ? parameters : structuredClone(parameters),
								strict: false
							}
						}
					};
				});
				const tools = sortPromptCacheToolsByName(converted).map(({ value }) => value);
				convertedToolNames = new Set(tools.map((tool) => tool.function.name));
				payload.tools = tools;
			}
			if (options?.temperature !== void 0) payload.temperature = options.temperature;
			if (options?.maxTokens !== void 0) payload.maxTokens = options.maxTokens;
			if (options?.stop !== void 0 && options.stop.length > 0) payload.stop = options.stop;
			if (options?.toolChoice) {
				const toolChoice = mapToolChoice(options.toolChoice, convertedToolNames);
				if (toolChoice) payload.toolChoice = toolChoice;
			}
			if (options?.promptMode) payload.promptMode = options.promptMode;
			if (options?.reasoningEffort) payload.reasoningEffort = options.reasoningEffort;
			const promptCacheKey = resolveMistralPromptCacheKey(options);
			if (promptCacheKey) payload.promptCacheKey = promptCacheKey;
			if (context.systemPrompt) payload.messages.unshift({
				role: "system",
				content: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt))
			});
			const nextPayload = await awaitProviderLifecycleCallback(options?.onPayload ? () => options.onPayload?.(payload, model) : void 0, options?.signal);
			if (nextPayload !== void 0) payload = nextPayload;
			const headers = mergeTransportHeaders(model.headers, options?.headers) ?? {};
			if (resolveMistralPromptCacheKey(options) && options?.sessionId) {
				const affinityHeader = Object.keys(headers).find((name) => name.toLowerCase() === "x-affinity");
				if (!affinityHeader || headers[affinityHeader] === "") headers[affinityHeader ?? "x-affinity"] = options.sessionId;
			}
			const mistralStream = await chat.stream(payload, {
				headers: omitNullRequestHeaders(headers),
				signal: options?.signal
			});
			if (mistralResponse && mistralResponse !== reportedResponse) await notifyProviderHttpResponse({
				options,
				response: mistralResponse,
				model,
				cancelStream: (reason) => mistralStream.cancel(reason)
			});
			stream.push({
				type: "start",
				partial: output
			});
			const signal = options?.signal;
			let currentBlock = null;
			let terminalFinishReason;
			const blocks = output.content;
			const blockIndex = () => blocks.length - 1;
			const toolBlocks = [];
			const normalizeMissingToolCallId = createMistralToolCallIdNormalizer();
			const missingToolCallIdScope = randomUUID();
			const createMissingToolCallId = (contentIndex) => normalizeMissingToolCallId(`${missingToolCallIdScope}:toolcall:${contentIndex}`);
			const requireSingleCandidate = (candidates) => {
				if (candidates.length > 1) throw new Error("Mistral streamed tool-call continuation is ambiguous; refusing to merge arguments");
				return candidates[0];
			};
			const resolveToolBlock = (params) => {
				const explicitId = params.explicitId;
				const functionName = params.functionName;
				const toolCallIndex = params.index;
				const available = toolBlocks.filter((identity) => !params.usedContentIndexes.has(identity.contentIndex));
				const idCandidates = explicitId ? available.filter((identity) => identity.explicitIds.has(explicitId)) : [];
				const nameCandidates = functionName ? available.filter((identity) => identity.functionNames.has(functionName)) : [];
				if (idCandidates.length > 0) {
					let candidates = idCandidates;
					if (nameCandidates.length > 0) candidates = candidates.filter((identity) => nameCandidates.includes(identity));
					const candidate = requireSingleCandidate(candidates);
					if (!candidate) throw new Error("Mistral streamed tool-call identities conflict; refusing to merge arguments");
					return candidate;
				}
				if (nameCandidates.length > 0) {
					const idCompatibleCandidates = nameCandidates.filter((identity) => !explicitId || identity.explicitIds.size === 0);
					if (idCompatibleCandidates.length <= 1 && (toolCallIndex === void 0 || toolCallIndex === 0)) return requireSingleCandidate(idCompatibleCandidates);
					const indexCompatibleCandidates = idCompatibleCandidates.filter((identity) => toolCallIndex === void 0 || identity.indexes.size === 0 || identity.indexes.has(toolCallIndex));
					return requireSingleCandidate(indexCompatibleCandidates);
				}
				const indexCandidates = toolCallIndex === void 0 ? [] : available.filter((identity) => identity.indexes.has(toolCallIndex));
				return requireSingleCandidate(indexCandidates.filter((identity) => (!functionName || identity.functionNames.size === 0) && (!explicitId || identity.explicitIds.size === 0)));
			};
			const finishCurrentBlock = () => {
				if (!currentBlock) return;
				stream.push({
					type: currentBlock.type === "text" ? "text_end" : "thinking_end",
					contentIndex: blockIndex(),
					content: currentBlock.type === "text" ? currentBlock.text : currentBlock.thinking,
					partial: output
				});
			};
			const appendContentDelta = (type, text) => {
				const delta = sanitizeSurrogates(text);
				if (type === "thinking" && !delta) return;
				if (!currentBlock || currentBlock.type !== type) {
					finishCurrentBlock();
					currentBlock = type === "text" ? {
						type,
						text: ""
					} : {
						type,
						thinking: ""
					};
					output.content.push(currentBlock);
					stream.push({
						type: `${type}_start`,
						contentIndex: blockIndex(),
						partial: output
					});
				}
				if (currentBlock.type === "text") currentBlock.text += delta;
				else appendAssistantThinking(currentBlock, delta);
				stream.push({
					type: `${type}_delta`,
					contentIndex: blockIndex(),
					delta,
					partial: output
				});
			};
			for await (const event of mistralStream) {
				notifyLlmRequestActivity(signal);
				const chunk = event.data;
				output.responseId ||= chunk.id;
				if (typeof chunk.model === "string" && chunk.model.length > 0 && chunk.model !== model.id) output.responseModel ||= chunk.model;
				if (chunk.usage) {
					const usageOutput = output.usage;
					const usage = chunk.usage;
					const terminal = Boolean(terminalFinishReason || chunk.choices[0]?.finishReason);
					const promptTokens = usage.promptTokens || 0;
					const record = usage;
					const rawCachedTokens = record.promptTokensDetails?.cachedTokens ?? record.prompt_tokens_details?.cached_tokens ?? record.cachedTokens ?? record.cached_tokens;
					const cacheRead = Math.min(promptTokens, Math.max(0, typeof rawCachedTokens === "number" && Number.isFinite(rawCachedTokens) ? rawCachedTokens : 0));
					usageOutput.input = Math.max(0, promptTokens - cacheRead);
					usageOutput.output = usage.completionTokens || 0;
					usageOutput.cacheRead = cacheRead;
					usageOutput.cacheWrite = 0;
					usageOutput.totalTokens = usage.totalTokens || usageOutput.input + usageOutput.output + cacheRead;
					usageOutput.usageReport = { state: terminal ? "available" : "unavailable" };
					calculateCost(model, usageOutput);
				}
				const choice = chunk.choices[0];
				if (!choice) continue;
				if (choice.finishReason) {
					terminalFinishReason = choice.finishReason;
					const { stopReason, errorMessage } = mapOpenAIStopReason(choice.finishReason === "model_length" ? "length" : choice.finishReason);
					output.stopReason = stopReason;
					if (errorMessage) output.errorMessage = errorMessage;
				}
				const delta = choice.delta;
				if (delta.content !== null && delta.content !== void 0) {
					const contentItems = typeof delta.content === "string" ? [delta.content] : delta.content;
					for (const item of contentItems) {
						if (typeof item === "string") {
							appendContentDelta("text", item);
							continue;
						}
						if (item.type === "thinking") appendContentDelta("thinking", item.thinking.map((part) => "text" in part ? part.text : "").join(""));
						else if (item.type === "text") appendContentDelta("text", item.text);
					}
				}
				const toolCalls = delta.toolCalls || [];
				const usedToolBlockIndexes = /* @__PURE__ */ new Set();
				for (const toolCall of toolCalls) {
					if (currentBlock) {
						finishCurrentBlock();
						currentBlock = null;
					}
					const toolCallIndex = typeof toolCall.index === "number" && Number.isInteger(toolCall.index) ? toolCall.index : void 0;
					const providedCallId = toolCall.id && toolCall.id !== "null" ? toolCall.id : void 0;
					const functionName = toolCall.function.name.trim() || void 0;
					let identity = resolveToolBlock({
						explicitId: providedCallId,
						functionName,
						index: toolCallIndex,
						usedContentIndexes: usedToolBlockIndexes
					});
					if (!identity) {
						const contentIndex = output.content.length;
						const block = {
							type: "toolCall",
							id: providedCallId ?? createMissingToolCallId(contentIndex),
							name: functionName ?? "",
							arguments: {},
							partialJson: ""
						};
						output.content.push(block);
						identity = {
							block,
							contentIndex,
							preview: createToolArgumentPreviewSchedule(),
							explicitIds: /* @__PURE__ */ new Set(),
							functionNames: /* @__PURE__ */ new Set(),
							indexes: /* @__PURE__ */ new Set()
						};
						toolBlocks.push(identity);
						stream.push({
							type: "toolcall_start",
							contentIndex,
							partial: output
						});
					}
					const { block, contentIndex } = identity;
					usedToolBlockIndexes.add(contentIndex);
					if (providedCallId) {
						block.id = providedCallId;
						identity.explicitIds.add(providedCallId);
					}
					if (functionName) {
						if (identity.functionNames.size > 0 && !identity.functionNames.has(functionName)) throw new Error("Mistral streamed tool-call continuation changed function name; refusing to merge arguments");
						block.name = functionName;
						identity.functionNames.add(functionName);
					}
					if (toolCallIndex !== void 0) identity.indexes.add(toolCallIndex);
					const argsDelta = typeof toolCall.function.arguments === "string" ? toolCall.function.arguments : JSON.stringify(toolCall.function.arguments || {});
					block.partialJson = (block.partialJson || "") + argsDelta;
					if (identity.preview(block.partialJson.length)) block.arguments = parseStreamingJson(block.partialJson);
					stream.push({
						type: "toolcall_delta",
						contentIndex,
						delta: argsDelta,
						partial: output
					});
				}
			}
			finishCurrentBlock();
			if (!terminalFinishReason || output.stopReason !== "toolUse") {
				blocks.splice(0, blocks.length, ...blocks.filter((block) => block.type !== "toolCall"));
				if (!terminalFinishReason) throw new Error("Mistral stream ended without a terminal finish reason");
			} else {
				finalizeTerminalToolCallArguments(toolBlocks.map(({ block }) => block), (block) => block.partialJson ?? "", "Mistral completed tool call has invalid JSON arguments");
				for (const { block, contentIndex } of toolBlocks) {
					delete block.partialJson;
					stream.push({
						type: "toolcall_end",
						contentIndex,
						toolCall: block,
						partial: output
					});
				}
			}
			finalizeTransportStream({
				stream,
				output,
				signal: options?.signal
			});
		} catch (error) {
			const terminal = assignTransportErrorDetails(output, error, options?.signal);
			output.content = output.content.filter((block) => block.type !== "toolCall");
			stream.push({
				type: "error",
				reason: terminal.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
const streamSimpleMistral = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		maxTokens: clampMaxTokensToModel(model, options?.maxTokens)
	};
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const reasoning = clampedReasoning === "off" ? void 0 : clampedReasoning;
	const shouldUseReasoning = model.reasoning && reasoning !== void 0;
	const supportsReasoningEffort = model.id === "mistral-small-2603" || model.id === "mistral-small-latest" || model.id === "mistral-medium-3-5";
	return streamMistral(model, context, {
		...base,
		promptMode: shouldUseReasoning && !supportsReasoningEffort ? "reasoning" : void 0,
		reasoningEffort: shouldUseReasoning && supportsReasoningEffort ? ReasoningEffort$inboundSchema.parse(model.thinkingLevelMap?.[reasoning] ?? (reasoning === "minimal" ? "none" : "high")) : void 0
	});
};
function createMistralToolCallIdNormalizer() {
	const idMap = /* @__PURE__ */ new Map();
	const reverseMap = /* @__PURE__ */ new Map();
	return (id) => {
		const existing = idMap.get(id);
		if (existing) return existing;
		let attempt = 0;
		while (true) {
			const candidate = deriveMistralToolCallId(id, attempt);
			const owner = reverseMap.get(candidate);
			if (!owner || owner === id) {
				idMap.set(id, candidate);
				reverseMap.set(candidate, id);
				return candidate;
			}
			attempt++;
		}
	};
}
function deriveMistralToolCallId(id, attempt) {
	const normalized = id.replace(/[^a-zA-Z0-9]/g, "");
	if (attempt === 0 && normalized.length === MISTRAL_TOOL_CALL_ID_LENGTH) return normalized;
	const seedBase = normalized || id;
	const seed = attempt === 0 ? seedBase : `${seedBase}:${attempt}`;
	return shortHash(seed).replace(/[^a-zA-Z0-9]/g, "").padEnd(MISTRAL_TOOL_CALL_ID_LENGTH, "0").slice(0, MISTRAL_TOOL_CALL_ID_LENGTH);
}
function resolveMistralPromptCacheKey(options) {
	if (options?.cacheRetention === "none") return;
	return options?.promptCacheKey?.trim() || options?.sessionId?.trim() || void 0;
}
function toChatMessages(messages, supportsImages) {
	const result = [];
	for (const msg of messages) {
		if (msg.role === "user") {
			if (typeof msg.content === "string") {
				result.push({
					role: "user",
					content: sanitizeSurrogates(msg.content)
				});
				continue;
			}
			const hadImages = msg.content.some((item) => item.type === "image");
			const content = msg.content.filter((item) => item.type === "text" || supportsImages).map((item) => {
				if (item.type === "text") return {
					type: "text",
					text: sanitizeSurrogates(item.text)
				};
				return {
					type: "image_url",
					imageUrl: `data:${item.mimeType};base64,${item.data}`
				};
			});
			if (content.length > 0) {
				result.push({
					role: "user",
					content
				});
				continue;
			}
			if (hadImages && !supportsImages) result.push({
				role: "user",
				content: "(image omitted: model does not support images)"
			});
			continue;
		}
		if (msg.role === "assistant") {
			const contentParts = [];
			const toolCalls = [];
			for (const block of msg.content) {
				if (block.type === "text" || block.type === "thinking") {
					const text = block.type === "text" ? block.text : block.thinking;
					if (text.trim().length > 0) {
						const part = {
							type: "text",
							text: sanitizeSurrogates(text)
						};
						contentParts.push(block.type === "text" ? part : {
							type: "thinking",
							thinking: [part]
						});
					}
					continue;
				}
				toolCalls.push({
					id: block.id,
					type: "function",
					function: {
						name: block.name,
						arguments: JSON.stringify(block.arguments || {})
					}
				});
			}
			const assistantMessage = { role: "assistant" };
			if (contentParts.length > 0) assistantMessage.content = contentParts;
			if (toolCalls.length > 0) assistantMessage.toolCalls = toolCalls;
			if (contentParts.length > 0 || toolCalls.length > 0) result.push(assistantMessage);
			continue;
		}
		const toolContent = [];
		const textResult = extractToolResultText(msg.content);
		const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
		const omittedMediaPlaceholder = msg.content.some(isImageWithMediaPayload) && !supportsImages ? textResult.trim() ? "[tool image omitted: model does not support images]" : mediaPlaceholder === "(see attached media)" ? "(media omitted: model does not support images)" : "(image omitted: model does not support images)" : void 0;
		const toolText = formatToolResultText({
			text: textResult,
			mediaPlaceholder,
			omittedMediaPlaceholder,
			isError: msg.isError
		});
		toolContent.push({
			type: "text",
			text: toolText
		});
		for (const part of msg.content) {
			if (!supportsImages) continue;
			if (!isImageWithMediaPayload(part)) continue;
			toolContent.push({
				type: "image_url",
				imageUrl: `data:${part.mimeType};base64,${part.data}`
			});
		}
		result.push({
			role: "tool",
			toolCallId: msg.toolCallId,
			name: msg.toolName,
			content: toolContent
		});
	}
	return result;
}
function mapToolChoice(choice, convertedToolNames) {
	if (!choice) return;
	if (choice === "auto" || choice === "none" || choice === "any" || choice === "required") return choice;
	const toolName = choice.function.name;
	if (convertedToolNames && !convertedToolNames.has(toolName)) throw new Error(`Mistral tool_choice requested unavailable tool "${toolName}" after schema conversion`);
	return {
		type: "function",
		function: { name: toolName }
	};
}
export { registerTracerProvider as a, createBoundedMistralFetcher, getRegisteredTracerProvider as i, completionChunkFromJSON as n, UsageInfo$outboundSchema as r, streamMistral, streamSimpleMistral, mistral_exports as t };
