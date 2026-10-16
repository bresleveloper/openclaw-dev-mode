import { Type } from "typebox";
//#region extensions/typesafe/src/config.ts
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
//#endregion
//#region extensions/typesafe/src/errors.ts
var EvaluationError = class extends Error {
	constructor(message, reason, retryAfterMs) {
		super(message);
		this.reason = reason;
		this.retryAfterMs = retryAfterMs;
		this.name = "EvaluationError";
	}
};
/** Only fixed plugin diagnostics cross the provider boundary; raw causes stay discarded. */
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
//#endregion
export { localBaseUrl as a, ConfigSchema as i, decisionFailure as n, runtimeConfig as o, evaluationError as r, EvaluationError as t };
