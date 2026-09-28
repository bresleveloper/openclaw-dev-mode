import { r as redactSensitiveText } from "./redact-V5IywZh1.js";
//#region packages/normalization-core/src/error-coercion.ts
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
function formatErrorMessage$1(value, options) {
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
/** Reads Error messages unchanged and stringifies every other value. */
function coerceErrorMessage(value) {
	return value instanceof Error ? value.message : String(value);
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
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
//#endregion
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
export { toErrorObject as i, coerceErrorMessage as n, extractErrorCode as r, formatErrorMessage as t };
