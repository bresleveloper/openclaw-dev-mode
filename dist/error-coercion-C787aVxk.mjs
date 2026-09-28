//#region packages/normalization-core/src/error-coercion.ts
const STRUCTURED_ERROR_OWNED_FIELDS = /* @__PURE__ */ new Set([
	"cause",
	"message",
	"name",
	"stack"
]);
const STRUCTURED_ERROR_PROTOTYPE_FIELDS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isErrorObject(value) {
	try {
		if (value instanceof Error) return true;
		return Object.prototype.toString.call(value) === "[object Error]";
	} catch {
		return false;
	}
}
function isAggregateErrorObject(error) {
	try {
		if (error instanceof AggregateError) return true;
		for (let proto = Object.getPrototypeOf(error); proto; proto = Object.getPrototypeOf(proto)) {
			const constructor = Object.getOwnPropertyDescriptor(proto, "constructor")?.value;
			if (typeof constructor === "function" && constructor.name === "AggregateError") return true;
		}
	} catch {}
	return false;
}
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function readErrorText(value, key) {
	const field = readProperty(value, key);
	return typeof field === "string" ? field : void 0;
}
function formatStatusAndCode(value) {
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return;
	try {
		if (Object.keys(value).some((key) => key !== "status" && key !== "code")) return;
	} catch {}
	const statusValue = readProperty(value, "status");
	const codeValue = readProperty(value, "code");
	if (statusValue === void 0 && codeValue === void 0) return;
	return `status=${typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown"} code=${typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown"}`;
}
function stringifyUnknown(value) {
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	try {
		const json = JSON.stringify(value);
		if (json !== void 0) return json;
	} catch {}
	try {
		return Object.prototype.toString.call(value);
	} catch {
		return "Unknown error";
	}
}
function readErrorCauses(current) {
	if (!isErrorObject(current)) return [];
	const cause = readProperty(current, "cause");
	const errors = isAggregateErrorObject(current) ? readProperty(current, "errors") : void 0;
	const suppressed = readErrorText(current, "name") === "SuppressedError" ? [readProperty(current, "error"), readProperty(current, "suppressed")].map((failure) => failure == null ? String(failure) : failure) : [];
	return [
		cause || void 0,
		...Array.isArray(errors) ? errors : [],
		...suppressed
	];
}
/** Formats unknown errors with cause/aggregate details, structured codes, and secret redaction. */
function formatErrorMessage(value, options) {
	let formatted;
	if (isErrorObject(value)) {
		formatted = readErrorText(value, "message") || readErrorText(value, "name") || "Error";
		const seenMessages = /* @__PURE__ */ new Set([formatted]);
		const appendCauseMessage = (message) => {
			if (!message || seenMessages.has(message)) return;
			formatted += ` | ${message}`;
			seenMessages.add(message);
		};
		const appendCauseErrorMessage = (message) => {
			if (message && formatted.includes(message)) {
				seenMessages.add(message);
				return;
			}
			appendCauseMessage(message);
		};
		if (options.includeCode) {
			const code = readProperty(value, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		}
		const causes = collectErrorGraphCandidates(value, readErrorCauses);
		for (const cause of causes.slice(1)) if (isErrorObject(cause)) {
			appendCauseErrorMessage(readErrorText(cause, "message"));
			const code = readProperty(cause, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		} else if (typeof cause === "string") appendCauseMessage(cause);
		else appendCauseMessage(formatStatusAndCode(cause) ?? stringifyUnknown(cause));
	} else formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
	return options.redact(formatted);
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
/** Preserves structured details while isolating hostile object field access. */
function toStructuredErrorObject(value) {
	if (value instanceof Error) return value;
	const message = String(value);
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return toErrorObject(value, message);
	const error = new Error(message, { cause: value });
	try {
		const detailKeys = Reflect.ownKeys(value).filter((key) => (typeof key !== "string" || !STRUCTURED_ERROR_OWNED_FIELDS.has(key) && !STRUCTURED_ERROR_PROTOTYPE_FIELDS.has(key)) && Reflect.getOwnPropertyDescriptor(value, key)?.enumerable);
		for (const key of detailKeys) try {
			Object.defineProperty(error, key, {
				value: Reflect.get(value, key),
				writable: true,
				enumerable: true,
				configurable: true
			});
		} catch {}
	} catch {}
	return error;
}
/** Preserves Error values and stringifies every other value into a new Error. */
function toStringifiedError(value) {
	return value instanceof Error ? value : new Error(String(value));
}
/** Reads Error messages unchanged and stringifies every other value. */
function coerceErrorMessage(value) {
	return value instanceof Error ? value.message : String(value);
}
/** Renders a non-Error cause as useful text without throwing. */
function stringifyNonErrorCause(value) {
	if (value === null) return "null";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	try {
		return JSON.stringify(value) ?? Object.prototype.toString.call(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
}
function readErrorName(err) {
	if (!err || typeof err !== "object") return "";
	const name = err.name;
	return typeof name === "string" ? name : "";
}
function collectErrorGraphCandidates(err, resolveNested) {
	if (err == null) return [];
	const candidates = [err];
	const seen = (/* @__PURE__ */ new Set()).add(err);
	for (const current of candidates) {
		if (!current || typeof current !== "object" || !resolveNested) continue;
		for (const nested of resolveNested(current)) if (nested != null && !seen.has(nested)) {
			seen.add(nested);
			candidates.push(nested);
		}
	}
	return candidates;
}
function extractErrorCodeOrErrno(err) {
	const code = extractErrorCode(err);
	if (code) return code.trim().toUpperCase();
	if (!err || typeof err !== "object") return;
	const errno = err.errno;
	if (typeof errno === "string" && errno.trim()) return errno.trim().toUpperCase();
	if (typeof errno === "number" && Number.isFinite(errno)) return String(errno);
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			readProperty(current, "cause"),
			readProperty(current, "reason"),
			readProperty(current, "original"),
			readProperty(current, "error"),
			readProperty(current, "suppressed"),
			readProperty(current, "data")
		];
		const errors = readProperty(current, "errors");
		if (Array.isArray(errors)) nested.push(...errors);
		return nested;
	});
}
//#endregion
export { extractErrorCodeOrErrno as a, readErrorName as c, toStringifiedError as d, toStructuredErrorObject as f, extractErrorCode as i, stringifyNonErrorCause as l, collectErrorGraphCandidates as n, formatErrorMessage as o, collectNestedErrorCandidates as r, readErrorCauses as s, coerceErrorMessage as t, toErrorObject as u };
