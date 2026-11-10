import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as sha256StableValue, n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { createHash } from "node:crypto";
import { serializeModelRequestBody } from "@openclaw/ai/internal/shared";
//#region src/agents/embedded-agent-runner/provider-prompt-serialization.ts
const MAX_MESSAGE_FINGERPRINTS = 512;
const MAX_MESSAGE_FIELD_FINGERPRINTS = 32;
const WIRE_PREFIX_BYTES = 4096;
const MESSAGE_FIELDS = /* @__PURE__ */ new Set([
	"role",
	"content",
	"type",
	"id",
	"reasoning",
	"encrypted_content",
	"summary",
	"status",
	"call_id",
	"tool_call_id",
	"tool_calls",
	"name",
	"arguments",
	"output",
	"refusal"
]);
const PARAMETER_FIELDS = /* @__PURE__ */ new Set([
	"model",
	"input",
	"messages",
	"prompt_cache_key",
	"prompt_cache_retention",
	"prompt_cache_options",
	"store",
	"include",
	"previous_response_id",
	"truncation",
	"service_tier",
	"reasoning",
	"reasoning_effort",
	"metadata",
	"text",
	"response_format",
	"tool_choice",
	"parallel_tool_calls",
	"stream",
	"stream_options",
	"temperature",
	"top_p",
	"max_tokens",
	"max_completion_tokens",
	"max_output_tokens",
	"user"
]);
function fingerprintItem(value, allowedFields) {
	if (!allowedFields || !isRecord(value)) return {
		digest: sha256Hex(JSON.stringify(value)),
		...allowedFields ? { fields: {} } : {}
	};
	const digest = createHash("sha256").update("{");
	let other;
	const fields = {};
	let separator = "";
	for (const [key, field] of Object.entries(value)) {
		const name = `${JSON.stringify(key)}:`;
		const encoded = JSON.stringify(field);
		digest.update(separator).update(name).update(encoded);
		separator = ",";
		if (allowedFields.has(key)) fields[key] = sha256Hex(encoded);
		else (other ??= createHash("sha256")).update(name).update(encoded).update(",");
	}
	if (other) fields.other = other.digest("hex");
	return {
		digest: digest.update("}").digest("hex"),
		fields
	};
}
function fingerprintSerializedPrompt(payload) {
	if (!isRecord(payload)) return;
	const { instructions, system, tools, ...parameters } = payload;
	let messageField;
	let messages = [];
	if (Array.isArray(parameters.input)) {
		messageField = "input";
		messages = parameters.input;
		delete parameters.input;
	} else if (Array.isArray(parameters.messages)) {
		messageField = "messages";
		messages = parameters.messages;
		delete parameters.messages;
	}
	return {
		system: sha256Hex(JSON.stringify({
			instructions,
			system
		})),
		tools: sha256Hex(JSON.stringify({ tools })),
		messages: messages.slice(0, MAX_MESSAGE_FINGERPRINTS).map((message, index) => fingerprintItem(message, index < MAX_MESSAGE_FIELD_FINGERPRINTS ? MESSAGE_FIELDS : void 0)),
		messageField,
		messageCount: messages.length,
		...messages.length > MAX_MESSAGE_FINGERPRINTS ? { tail: sha256Hex(JSON.stringify(messages.slice(MAX_MESSAGE_FINGERPRINTS))) } : {},
		parameters: fingerprintItem(parameters, PARAMETER_FIELDS),
		continuation: typeof parameters.previous_response_id === "string" && parameters.previous_response_id.length > 0
	};
}
function prepareProviderPrompt({ payload, encode }) {
	if (!encode) return {
		...sha256StableValue(payload),
		encoded: void 0
	};
	let cachePrefix;
	const encoded = serializeModelRequestBody(payload, (serialized) => {
		cachePrefix = fingerprintSerializedPrompt(serialized);
	});
	return {
		digest: sha256Hex(encoded.body),
		byteWeight: encoded.body.byteLength,
		encoded,
		cachePrefix,
		wire: {
			requestBytes: encoded.body.byteLength,
			prefixBytes: Math.min(encoded.body.byteLength, WIRE_PREFIX_BYTES),
			prefixHash: createHash("sha256").update(encoded.body.subarray(0, WIRE_PREFIX_BYTES)).digest("hex"),
			cacheKeyPresent: cachePrefix?.parameters.fields?.prompt_cache_key !== void 0,
			cacheKeyHash: cachePrefix?.parameters.fields?.prompt_cache_key?.slice(0, 16),
			previousResponseIdPresent: cachePrefix?.continuation ?? false,
			modelHash: cachePrefix?.parameters.fields?.model?.slice(0, 16),
			serviceTier: isRecord(payload) && typeof payload.service_tier === "string" ? payload.service_tier : void 0
		}
	};
}
//#endregion
export { prepareProviderPrompt as t };
