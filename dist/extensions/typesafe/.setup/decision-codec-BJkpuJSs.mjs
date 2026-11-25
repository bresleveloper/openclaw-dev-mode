import { Type } from "typebox";
import { randomUUID } from "node:crypto";
import { decodeSystemOneResponse, isDecisionBatchV1Representable, validateDecisionBatchV2, validateDecisionResultV2 } from "openclaw/plugin-sdk/decisions";
// extensions/typesafe/src/config.ts
const LOCAL_BASE_URL_PATTERN = "^https?://(?:localhost|127\\.0\\.0\\.1|\\[::1\\])(?::[0-9]{1,5})?/?$";
const localBaseUrlPattern = new RegExp(LOCAL_BASE_URL_PATTERN);
const ConfigSchema = Type.Object({
	baseUrl: Type.Optional(Type.String({
		maxLength: 128,
		pattern: LOCAL_BASE_URL_PATTERN
	})),
	apiKey: Type.Optional(Type.Object({
		source: Type.Union([
			Type.Literal("env"),
			Type.Literal("store"),
			Type.Literal("file"),
			Type.Literal("exec")
		]),
		provider: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		id: Type.String({
			minLength: 1,
			maxLength: 1024
		})
	}, { additionalProperties: false })),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 6e4,
		default: 3e4
	}))
}, { additionalProperties: false });
const HOSTED_ORIGIN = "https://api.typesafe.ai";
/** Model providers configure the API root; origin-only System One URLs imply /v1. */
function providerBaseUrl(value) {
	const parsed = value ? URL.parse(value) : null;
	if (!parsed || !["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error("Invalid models.providers.typesafe.baseUrl; use an HTTP(S) API base URL without credentials, query, or fragment.");
	parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/v1";
	return parsed.toString().replace(/\/+$/, "");
}
function usesHostedEndpoint(config) {
	return !config.baseUrl || new URL(config.baseUrl).origin === "https://api.typesafe.ai";
}
function hasCredentials(config) {
	return !config.credentialsUnavailable && Boolean(config.baseUrl || config.apiKey);
}
/** A configured endpoint grants access to one loopback origin, never arbitrary private hosts. */
function localBaseUrl(value) {
	if (value === void 0) return;
	const parsed = typeof value === "string" && value === value.trim() && localBaseUrlPattern.test(value) ? URL.parse(value) : null;
	if (!parsed) throw new Error("Invalid TypeSafe baseUrl; use an http(s) loopback origin without a path, credentials, query, or fragment.");
	return parsed.origin;
}
/** Validate runtime settings and recognize materialized credentials without resolving inputs. */
function runtimeConfig(config) {
	const baseUrl = localBaseUrl(config?.baseUrl);
	const timeoutMs = config?.timeoutMs ?? 3e4;
	if (typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs < 1e3 || timeoutMs > 6e4) throw new Error("Invalid TypeSafe configuration; check plugin Settings.");
	if (baseUrl) return {
		baseUrl,
		timeoutMs
	};
	const key = config?.apiKey;
	return {
		apiKey: typeof key === "string" && key.trim() ? key : void 0,
		timeoutMs
	};
}
// extensions/typesafe/src/decision-codec.ts
function decodeTypeSafeDecisionResult(batch, evaluation) {
	const result = decodeSystemOneResponse(batch, {
		model: evaluation.model,
		answers: evaluation.answers,
		usage: {
			input_tokens: evaluation.usage.input_tokens,
			output_tokens: evaluation.usage.output_tokens
		}
	});
	return validateDecisionResultV2(batch, result) ? result : void 0;
}
/** Preserve the admitted native subset; tagged image state adds referenced assets. */
function translateTypeSafeDecisionBatch(batch) {
	if (!validateDecisionBatchV2(batch)) return;
	if (batch.state.type !== "image") return isDecisionBatchV1Representable(batch) ? { batch } : void 0;
	const match = /^data:image\/(png|jpeg);base64,/.exec(batch.state.dataUri);
	if (!match || Object.values(batch.questions).some((question) => question.type !== "boolean" && question.type !== "choice" && question.type !== "score")) return;
	const callerText = JSON.stringify([batch.state.text, batch.questions]);
	let ref = randomUUID();
	while (callerText.includes(ref)) ref = randomUUID();
	const translated = {
		state: batch.state.text === void 0 ? {
			type: "text",
			text: ref
		} : {
			type: "json",
			value: [batch.state.text, ref]
		},
		questions: batch.questions
	};
	if (!isDecisionBatchV1Representable(translated)) return;
	return {
		batch: translated,
		assets: { [ref]: {
			type: "image",
			format: match[1] === "png" ? "png" : "jpg",
			data_base64: batch.state.dataUri.slice(match[0].length)
		} }
	};
}
function encodeTypeSafeLocalInput(parsed) {
	const questions = {};
	for (const [id, question] of Object.entries(parsed.questions)) {
		const instructions = question.instructions ?? null;
		if (question.type === "score") questions[id] = {
			...question,
			instructions,
			criteria: question.criteria.map((level) => typeof level === "string" ? level : level === null ? "" : JSON.stringify(level))
		};
		else questions[id] = {
			...question,
			instructions
		};
	}
	return {
		...parsed,
		questions
	};
}
function restoreTypeSafeLocalLegends(evaluation, parsed) {
	for (const [id, question] of Object.entries(parsed.questions)) {
		const answer = evaluation.answers[id];
		if (question.type === "score" && answer?.type === "score") answer.legend = Object.fromEntries(question.criteria.map((level, index) => [String(index), level]));
	}
}
export { ConfigSchema as a, providerBaseUrl as c, translateTypeSafeDecisionBatch as i, runtimeConfig as l, encodeTypeSafeLocalInput as n, HOSTED_ORIGIN as o, restoreTypeSafeLocalLegends as r, hasCredentials as s, decodeTypeSafeDecisionResult as t, usesHostedEndpoint as u };
