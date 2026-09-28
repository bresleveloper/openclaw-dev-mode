import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { isDeepStrictEqual } from "node:util";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
import { Check } from "typebox/value";
import { buildTimeoutAbortSignal } from "openclaw/plugin-sdk/extension-shared";
import { responseWithRelease, shouldUseEnvHttpProxyForUrl, withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { parseRetryAfterHeaderSeconds } from "openclaw/plugin-sdk/retry-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { getPreparedPluginSecretInput } from "openclaw/plugin-sdk/secret-input-runtime";
//#region extensions/typesafe/src/errors.ts
var EvaluationError = class extends Error {
	constructor(message, reason, retryAfterMs) {
		super(message);
		this.reason = reason;
		this.retryAfterMs = retryAfterMs;
		this.name = "EvaluationError";
	}
};
/** Only fixed plugin diagnostics cross the tool/provider boundary; raw causes stay discarded. */
function evaluationError(error, aborted) {
	if (aborted) return new EvaluationError("TypeSafe evaluation cancelled.", "transport");
	if (error instanceof EvaluationError) return error;
	return new EvaluationError("TypeSafe evaluation failed or returned an invalid response.", "invalid-response");
}
/** Unexpected failures reject without retaining raw credentials or submitted state. */
function decisionFailure(error) {
	if (error instanceof EvaluationError) return {
		status: "unavailable",
		reason: error.reason,
		...error.retryAfterMs !== void 0 ? { retryAfterMs: error.retryAfterMs } : {}
	};
	throw new Error("TypeSafe decision adapter contract failure.");
}
const MAX_JSON_NODES = 262144;
const MAX_JSON_DEPTH = 64;
const MAX_CHOICE_OPTIONS = 255;
const MAX_SCORE_LEVELS = 10;
function map(value, options = {}) {
	return Type.Unsafe({
		type: "object",
		properties: {},
		additionalProperties: value,
		...options
	});
}
const entry = Type.Union([
	Type.String(),
	map(Type.Unknown()),
	Type.Array(Type.Unknown()),
	Type.Null()
], { description: "Text, a JSON object or array, or null. Nested values must be finite JSON. Use structure for rules, examples, and exclusions." });
const instructions = Type.Optional(Type.Union(entry.anyOf, { description: "The complete judgment to make; question IDs are not read by the model. Text, structured object/array, or null. May be omitted when criteria express the judgment." }));
const model = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "^[a-zA-Z0-9._/-]+$"
});
const probability = Type.Number({
	minimum: 0,
	maximum: 1
});
const objectOptions = { additionalProperties: false };
const noulQuestion = Type.Object({
	type: Type.Literal("noul"),
	instructions,
	criteria: Type.Optional(Type.Union([Type.Object({
		true: Type.Optional(entry),
		false: Type.Optional(entry)
	}, objectOptions), Type.Null()], { description: "Optional true (yes) and false (no) outcome definitions; each accepts text, object, array, or null." }))
}, {
	...objectOptions,
	description: "Probability of yes (0–1), not intensity; no separate confidence. Use separate Nouls for independent labels."
});
const choiceQuestion = Type.Object({
	type: Type.Literal("choice"),
	instructions,
	criteria: map(entry, {
		minProperties: 2,
		maxProperties: MAX_CHOICE_OPTIONS,
		description: "2–255 competing labels mapped to descriptions. Labels may include spaces, punctuation, or Unicode. Null leaves a label undescribed. Include a no-match option when needed."
	})
}, {
	...objectOptions,
	description: "Choose one alternative; returns its label, full probability distribution, and confidence."
});
const scoreQuestion = Type.Object({
	type: Type.Literal("score"),
	instructions,
	criteria: Type.Array(entry, {
		minItems: 2,
		maxItems: MAX_SCORE_LEVELS,
		description: "2–10 ordered rubric levels, indexed from zero. Returns a fractional probability-weighted position, not an integer category or a normalized 0–1 score."
	})
}, objectOptions);
const question = Type.Union([
	noulQuestion,
	choiceQuestion,
	scoreQuestion
]);
/** Explicit shared state; independently evaluated questions never see other answers. */
const EvaluateInput = Type.Object({
	state: Type.Union(entry.anyOf, { description: "Shared evidence/context for every question. Only supplied state is sent; no ambient conversation is collected." }),
	questions: map(question, {
		minProperties: 1,
		description: "Nonempty map of question IDs to Choice, Score, or Noul questions. Mix types in one call. IDs only match answers; put all meaning in instructions/criteria. Questions are independent. The server enforces token limits; plugin JSON guard is 4 MiB."
	}),
	model: Type.Optional(Type.String({
		...model,
		description: "Optional System One model ID or alias for this explicit tool call; defaults to the plugin’s evaluation-tool model. Native decisions use the host-selected model. A local Kev server uses its loaded checkpoint regardless of this label."
	}))
}, objectOptions);
const inputValidator = Compile(EvaluateInput);
const distribution = map(probability, {
	minProperties: 2,
	maxProperties: MAX_CHOICE_OPTIONS
});
const Answer = Type.Union([
	Type.Object({
		type: Type.Literal("noul"),
		noul: probability
	}, objectOptions),
	Type.Object({
		type: Type.Literal("choice"),
		choice: Type.String(),
		confidence: probability,
		probabilities: distribution
	}, objectOptions),
	Type.Object({
		type: Type.Literal("score"),
		score: Type.Number({
			minimum: 0,
			maximum: 9
		}),
		confidence: probability,
		probabilities: distribution,
		legend: map(entry, {
			minProperties: 2,
			maxProperties: MAX_SCORE_LEVELS
		})
	}, objectOptions)
]);
const VendorResult = Type.Object({
	model,
	answers: map(Answer, { minProperties: 1 }),
	usage: Type.Object({
		input_tokens: Type.Integer({
			minimum: 0,
			maximum: Number.MAX_SAFE_INTEGER
		}),
		output_tokens: Type.Integer({
			minimum: 0,
			maximum: Number.MAX_SAFE_INTEGER
		})
	}, objectOptions)
}, objectOptions);
const EvaluateOutput = Type.Object({ evaluation: VendorResult }, objectOptions);
const resultValidator = Compile(VendorResult);
/** Reject non-JSON values and excessive structure before schema walking or serialization. */
function assertBoundedJson(value) {
	let nodes = 0;
	const visit = (node, depth) => {
		if (++nodes > MAX_JSON_NODES || depth > MAX_JSON_DEPTH) throw new EvaluationError("TypeSafe JSON exceeds resource limits (262144 nodes or depth 64).", "unsupported-input");
		if (node === null || typeof node === "string" || typeof node === "boolean") return;
		if (typeof node === "number" && Number.isFinite(node)) return;
		if (typeof node !== "object" || !node) throw new EvaluationError("TypeSafe input must be JSON.", "unsupported-input");
		const array = Array.isArray(node);
		const prototype = Object.getPrototypeOf(node);
		if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) throw new EvaluationError("TypeSafe input must be plain JSON.", "unsupported-input");
		if (array) {
			if (node.length > MAX_JSON_NODES || Object.keys(node).length !== node.length || Object.hasOwn(node, "toJSON")) throw new EvaluationError("TypeSafe input must be a bounded JSON array.", "unsupported-input");
			for (let index = 0; index < node.length; index++) {
				const descriptor = Object.getOwnPropertyDescriptor(node, index);
				if (!descriptor?.enumerable || !("value" in descriptor)) throw new EvaluationError("TypeSafe input must be plain JSON.", "unsupported-input");
				visit(descriptor.value, depth + 1);
			}
			return;
		}
		for (const key of Object.getOwnPropertyNames(node)) {
			if ([
				"__proto__",
				"constructor",
				"prototype"
			].includes(key)) throw new EvaluationError("TypeSafe input contains a reserved key.", "unsupported-input");
			const descriptor = Object.getOwnPropertyDescriptor(node, key);
			if (!descriptor?.enumerable || !("value" in descriptor)) throw new EvaluationError("TypeSafe input must be plain JSON.", "unsupported-input");
			visit(descriptor.value, depth + 1);
		}
	};
	visit(value, 0);
	if (Buffer.byteLength(JSON.stringify(value), "utf8") > 4194304) throw new EvaluationError("TypeSafe JSON exceeds the plugin resource limit of 4 MiB.", "unsupported-input");
}
/** Validate without including supplied state in diagnostics. */
function parseInput(value) {
	assertBoundedJson(value);
	if (!inputValidator.Check(value)) {
		if (value && typeof value === "object" && "questions" in value && value.questions && typeof value.questions === "object" && !Array.isArray(value.questions)) {
			for (const [index, q] of Object.values(value.questions).entries()) if (!Check(question, q)) {
				const kind = q && typeof q === "object" && "type" in q ? q.type : void 0;
				const hint = kind === "choice" ? "Choice requires 2–255 criteria descriptions." : kind === "score" ? "Score requires 2–10 ordered criteria descriptions." : kind === "noul" ? "Noul criteria may contain only true/false descriptions, or null." : "type must be choice, score, or noul.";
				throw new EvaluationError(`Invalid TypeSafe questions entry #${index + 1}: ${hint} Instructions/descriptions accept text, object, array, or null; no extra question fields.`, "unsupported-input");
			}
		}
		throw new EvaluationError("Invalid TypeSafe evaluation input: supply state (text/object/array/null), a nonempty questions map, and optionally a valid model ID; no extra fields.", "unsupported-input");
	}
	return value;
}
/** Check the response schema and correspondence to this exact question batch. */
function parseResult(value, input) {
	try {
		assertBoundedJson(value);
		if (!resultValidator.Check(value)) throw new Error();
		const questions = Object.entries(input.questions);
		if (Object.keys(value.answers).length !== questions.length) throw new Error();
		for (const [id, expected] of questions) {
			const answer = value.answers[id];
			if (!answer || answer.type !== expected.type) throw new Error();
			if (answer.type === "noul") continue;
			const labels = expected.type === "score" ? expected.criteria.map((_, index) => String(index)) : expected.type === "choice" ? Object.keys(expected.criteria) : [];
			if (Object.keys(answer.probabilities).length !== labels.length || labels.some((label) => !Object.hasOwn(answer.probabilities, label))) throw new Error();
			if (!(Object.values(answer.probabilities).reduce((sum, item) => sum + item, 0) > 0)) throw new Error();
			if (answer.type === "choice" && !labels.includes(answer.choice)) throw new Error();
			if (answer.type === "score" && expected.type === "score") {
				if (answer.score > labels.length - 1 || Object.keys(answer.legend).length !== labels.length || labels.some((label, index) => !isDeepStrictEqual(answer.legend[label], expected.criteria[index]))) throw new Error();
			}
		}
		return value;
	} catch {
		throw new Error("TypeSafe returned an invalid evaluation response.");
	}
}
//#endregion
//#region extensions/typesafe/src/local.ts
function localInput(input) {
	const questions = {};
	for (const [id, question] of Object.entries(input.questions)) {
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
		...input,
		questions
	};
}
function parseLocalResult(value, wireInput, originalInput) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid local System One response.");
	let result = value;
	if ("latency_ms" in value) {
		const { latency_ms, ...payload } = value;
		if (typeof latency_ms !== "number" || !Number.isFinite(latency_ms) || latency_ms < 0) throw new Error("Invalid local System One latency metadata.");
		result = payload;
	}
	const evaluation = parseResult(result, wireInput);
	for (const [id, question] of Object.entries(originalInput.questions)) {
		const answer = evaluation.answers[id];
		if (question.type === "score" && answer?.type === "score") answer.legend = Object.fromEntries(question.criteria.map((level, index) => [String(index), level]));
	}
	return evaluation;
}
//#endregion
//#region extensions/typesafe/src/config.ts
const DEFAULT_MODEL = "jev-latest";
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
	model: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[a-zA-Z0-9._/-]+$",
		description: "Tool default: jev-latest for hosted Jev, kev-latest for a local endpoint."
	})),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 6e4,
		default: 3e4
	}))
}, { additionalProperties: false });
/** A configured endpoint grants access to one loopback origin, never arbitrary private hosts. */
function localBaseUrl(value) {
	if (value === void 0) return;
	try {
		if (typeof value !== "string" || value !== value.trim() || !localBaseUrlPattern.test(value)) throw new Error();
		return new URL(value).origin;
	} catch {
		throw new Error("Invalid TypeSafe baseUrl; use an http(s) loopback origin without a path, credentials, query, or fragment.");
	}
}
/** Validate runtime settings and recognize materialized credentials without resolving inputs. */
function runtimeConfig(config) {
	const baseUrl = localBaseUrl(config?.baseUrl);
	const model = config?.model ?? (baseUrl ? "kev-latest" : DEFAULT_MODEL);
	const timeoutMs = config?.timeoutMs ?? 3e4;
	if (typeof model !== "string" || !/^[a-zA-Z0-9._/-]{1,128}$/.test(model) || typeof timeoutMs !== "number" || !Number.isInteger(timeoutMs) || timeoutMs < 1e3 || timeoutMs > 6e4) throw new Error("Invalid TypeSafe configuration; check plugin Settings.");
	if (baseUrl) return {
		baseUrl,
		model,
		timeoutMs
	};
	const key = config?.apiKey;
	return {
		apiKey: typeof key === "string" && key.trim() ? key : void 0,
		model,
		timeoutMs
	};
}
//#endregion
//#region extensions/typesafe/src/transport.ts
const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
function httpError(response) {
	if (response.status === 401 || response.status === 403) return new EvaluationError("TypeSafe authentication failed; check the configured credential and account access.", "authentication");
	if (response.status === 429) {
		const milliseconds = response.headers.get("retry-after-ms");
		const parsedMilliseconds = milliseconds?.trim() ? Number(milliseconds) : NaN;
		const seconds = parseRetryAfterHeaderSeconds(response.headers.get("retry-after"));
		return new EvaluationError("TypeSafe rate limit reached; retry later.", "rate-limited", Number.isFinite(parsedMilliseconds) && parsedMilliseconds >= 0 ? parsedMilliseconds : seconds === void 0 ? void 0 : seconds * 1e3);
	}
	return new EvaluationError("TypeSafe service rejected the evaluation request.", "transport");
}
async function readBody(response, signal) {
	const reader = response.body?.getReader();
	if (!reader) {
		signal?.throwIfAborted();
		return Buffer.alloc(0);
	}
	let cancellation;
	const cancel = () => {
		cancellation ??= reader.cancel().catch(() => {});
	};
	signal?.addEventListener("abort", cancel, { once: true });
	const chunks = [];
	let length = 0;
	try {
		while (true) {
			signal?.throwIfAborted();
			const chunk = await reader.read();
			signal?.throwIfAborted();
			if (chunk.done) break;
			length += chunk.value.byteLength;
			if (length > 4194304) throw new EvaluationError("TypeSafe response exceeds its limit.", "invalid-response");
			chunks.push(chunk.value);
		}
		return Buffer.concat(chunks, length);
	} catch (error) {
		cancel();
		throw error;
	} finally {
		signal?.removeEventListener("abort", cancel);
		await cancellation;
		reader.releaseLock();
	}
}
async function requestEvaluation(params) {
	const baseUrl = localBaseUrl(params.baseUrl);
	const endpoint = baseUrl ? `${baseUrl}/v1/systemone` : ENDPOINT;
	const body = JSON.stringify(params.body);
	if (Buffer.byteLength(body) > 4194304) throw new EvaluationError("TypeSafe request exceeds its limit.", "unsupported-input");
	const timeoutMs = params.deadlineMonotonicMs === void 0 ? params.timeoutMs : Math.min(params.timeoutMs, params.deadlineMonotonicMs - performance.now());
	if (timeoutMs <= 0) throw new EvaluationError("TypeSafe evaluation timed out.", "transport");
	const { signal, cleanup } = buildTimeoutAbortSignal({
		signal: params.signal,
		timeoutMs,
		operation: "TypeSafe evaluation"
	});
	const assertActive = () => {
		signal?.throwIfAborted();
		if (params.deadlineMonotonicMs !== void 0 && performance.now() >= params.deadlineMonotonicMs) throw new EvaluationError("TypeSafe evaluation timed out.", "transport");
	};
	try {
		assertActive();
		const request = {
			url: endpoint,
			fetchImpl: globalThis.fetch,
			requireHttps: !baseUrl,
			...baseUrl ? { policy: { allowedOrigins: [baseUrl] } } : {},
			...baseUrl && new URL(baseUrl).hostname === "localhost" ? { lookupFn: async () => [{
				address: "127.0.0.1",
				family: 4
			}, {
				address: "::1",
				family: 6
			}] } : {},
			maxRedirects: 0,
			signal,
			beforeRequest: assertActive,
			init: {
				method: "POST",
				headers: {
					...!baseUrl ? { Authorization: `Bearer ${params.apiKey}` } : {},
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body
			}
		};
		const guarded = await fetchWithSsrFGuard(!baseUrl && shouldUseEnvHttpProxyForUrl(endpoint) ? withTrustedEnvProxyGuardedFetchMode(request) : request);
		let releasePromise;
		const release = () => releasePromise ??= Promise.resolve().then(() => guarded.release());
		let payload;
		try {
			const response = responseWithRelease(guarded.response, release);
			if (!response.ok) {
				await response.body?.cancel();
				throw httpError(response);
			}
			const bytes = await readBody(response, signal);
			try {
				payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
			} catch {
				throw new EvaluationError("TypeSafe returned invalid JSON.", "invalid-response");
			}
		} finally {
			await release();
		}
		signal?.throwIfAborted();
		return payload;
	} catch (error) {
		if (params.signal?.aborted) throw new EvaluationError("TypeSafe evaluation cancelled.", "transport");
		if (signal?.aborted) throw new EvaluationError("TypeSafe evaluation timed out.", "transport");
		if (error instanceof EvaluationError) throw error;
		throw new EvaluationError("TypeSafe transport unavailable.", "transport");
	} finally {
		cleanup();
	}
}
//#endregion
//#region extensions/typesafe/src/client.ts
/** Evaluate explicit state without ambient credentials, retries, or vendor diagnostics. */
async function evaluate(input, config, signal, deadlineMonotonicMs) {
	if (signal?.aborted) throw evaluationError(void 0, true);
	const parsed = parseInput(input);
	const model = parsed.model ?? config.model;
	if (model === "kev-latest" && !config.baseUrl) throw new EvaluationError("Kev requires a local System One server. Configure baseUrl in TypeSafe plugin Settings.", "unsupported-input");
	if (!config.baseUrl && !config.apiKey) throw new Error("TypeSafe API key is missing. Configure a SecretRef in plugin Settings.");
	try {
		const wireInput = config.baseUrl ? localInput(parsed) : parsed;
		const response = await requestEvaluation({
			body: {
				...wireInput,
				model
			},
			apiKey: config.baseUrl ? void 0 : config.apiKey,
			baseUrl: config.baseUrl,
			timeoutMs: config.timeoutMs,
			signal,
			deadlineMonotonicMs
		});
		signal?.throwIfAborted();
		const evaluation = config.baseUrl ? parseLocalResult(response, wireInput, parsed) : parseResult(response, parsed);
		if (!config.baseUrl && config.apiKey && JSON.stringify(evaluation).includes(config.apiKey)) throw new Error("Invalid TypeSafe response.");
		return { evaluation };
	} catch (error) {
		throw evaluationError(error, signal?.aborted ?? false);
	}
}
//#endregion
//#region extensions/typesafe/src/credentials.ts
/** Only host-prepared capability snapshots may supply a credential. Never resolve or cache refs. */
function resolveRuntimeConfig(snapshot) {
	const configured = snapshot.plugins?.entries?.typesafe?.config;
	const validated = runtimeConfig(configured);
	if (validated.baseUrl) return validated;
	const prepared = getPreparedPluginSecretInput("typesafe", "apiKey");
	return {
		...validated,
		apiKey: prepared.value
	};
}
//#endregion
//#region extensions/typesafe/src/decisions.ts
/** Transport and result validation are shared with the independently usable agent tool. */
function createDecisionProvider(getConfig) {
	return {
		id: "typesafe",
		contractVersion: 1,
		isReady: () => {
			const config = getConfig();
			return Boolean(config.baseUrl || config.apiKey);
		},
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			const config = getConfig();
			if (!config.baseUrl && !config.apiKey) return {
				status: "unavailable",
				reason: "credentials-unavailable"
			};
			const remaining = context.deadlineMonotonicMs - performance.now();
			if (remaining <= 0) return {
				status: "unavailable",
				reason: "transport"
			};
			const questions = Object.fromEntries(Object.entries(batch.questions).map(([id, q]) => [id, q.type === "boolean" ? {
				...q,
				type: "noul"
			} : q]));
			try {
				const { evaluation } = await evaluate({
					state: batch.state,
					questions,
					model: context.model
				}, {
					...config,
					timeoutMs: Math.min(config.timeoutMs, remaining)
				}, context.signal, context.deadlineMonotonicMs);
				context.signal.throwIfAborted();
				const answers = {};
				for (const [id, answer] of Object.entries(evaluation.answers)) if (answer.type === "noul") answers[id] = {
					type: "boolean",
					probabilityTrue: answer.noul
				};
				else if (answer.type === "choice") answers[id] = answer;
				else {
					const question = batch.questions[id];
					if (!question || question.type !== "score") return {
						status: "unavailable",
						reason: "invalid-response"
					};
					answers[id] = {
						type: "score",
						score: answer.score,
						confidence: answer.confidence,
						probabilities: question.criteria.map((_level, i) => answer.probabilities[String(i)])
					};
				}
				return {
					status: "ok",
					result: {
						model: evaluation.model,
						answers,
						usage: {
							inputTokens: evaluation.usage.input_tokens,
							outputTokens: evaluation.usage.output_tokens
						}
					}
				};
			} catch (error) {
				context.signal.throwIfAborted();
				return decisionFailure(error);
			}
		}
	};
}
//#endregion
//#region extensions/typesafe/index.ts
var typesafe_default = definePluginEntry({
	id: "typesafe",
	name: "TypeSafe AI",
	description: "Explicit typed evaluations, not a conversational model provider.",
	configSchema: { jsonSchema: { ...ConfigSchema } },
	register(api) {
		api.registerDecisionProvider(createDecisionProvider(() => resolveRuntimeConfig(api.runtime.config.current())));
		api.registerTool({
			name: "typesafe_evaluate",
			label: "TypeSafe typed decisions",
			description: "Ask the configured System One model for typed decisions over explicit shared state: classify/select with Choice (2–255 options), rate with Score (2–10 ordered levels; fractional zero-based result), or estimate probability of yes with Noul (optional true/false criteria). Batch independent questions; they cannot see each other’s answers. Instructions and descriptions accept text, JSON objects/arrays, or null. Returns distributions, confidence for Choice/Score, model, and usage—not generated explanations or authorization. Hosted Jev requires credentials and may incur API charges; a configured local Kev endpoint receives supplied data without hosted credentials.",
			parameters: EvaluateInput,
			outputSchema: EvaluateOutput,
			resultContentSource: "network",
			async execute(_id, params, signal) {
				signal?.throwIfAborted();
				const config = resolveRuntimeConfig(api.runtime.config.current());
				if (!config.baseUrl && !config.apiKey) throw new Error("TypeSafe API key is missing. Configure a SecretRef in plugin Settings.");
				const details = await evaluate(params, config, signal);
				signal?.throwIfAborted();
				return {
					content: [{
						type: "text",
						text: JSON.stringify(details)
					}],
					details
				};
			}
		}, { optional: true });
	}
});
//#endregion
export { typesafe_default as default };
