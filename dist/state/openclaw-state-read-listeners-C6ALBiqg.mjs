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
const PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND = Symbol.for("openclaw.provider-auth-persistence-error");
function isProviderAuthPersistenceError(value) {
	try {
		return PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND in value && value[PROVIDER_AUTH_PERSISTENCE_ERROR_BRAND] === true;
	} catch {
		return false;
	}
}
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
	if (value === null || typeof value !== "object" && typeof value !== "function") return String(value);
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
	const persistenceFailures = isProviderAuthPersistenceError(current) ? [readProperty(current, "persistenceError"), readProperty(current, "cleanupError")] : [];
	const suppressed = readErrorText(current, "name") === "SuppressedError" ? [readProperty(current, "error"), readProperty(current, "suppressed")].map((failure) => failure == null ? String(failure) : failure) : [];
	return [
		...persistenceFailures,
		cause || void 0,
		...Array.isArray(errors) ? errors : [],
		...suppressed
	];
}
/** Formats unknown errors with cause/aggregate details and optional diagnostic redaction. */
function formatErrorMessage(value, options = {}) {
	let formatted;
	if (isErrorObject(value)) {
		formatted = readErrorText(value, "message") || readErrorText(value, "name") || "Error";
		const seenMessages = /* @__PURE__ */ new Set([formatted]);
		const appendCauseMessage = (message) => {
			if (!message || seenMessages.has(message)) return;
			formatted += ` | ${message}`;
			seenMessages.add(message);
		};
		if (options.includeCode) {
			const code = readProperty(value, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		}
		const causes = collectErrorGraphCandidates(value, readErrorCauses);
		for (const cause of causes.slice(1)) if (isErrorObject(cause)) {
			const message = readErrorText(cause, "message");
			if (message && formatted.includes(message)) seenMessages.add(message);
			else appendCauseMessage(message);
			const code = readProperty(cause, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		} else if (typeof cause === "string") appendCauseMessage(cause);
		else appendCauseMessage(formatStatusAndCode(cause) ?? stringifyUnknown(cause));
	} else formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
	return options.redact ? options.redact(formatted) : formatted;
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
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
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
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Observe an existing owner's state without initializing it or registering cleanup. */
function readGlobalSingleton(key) {
	const globalStore = globalThis;
	return Object.hasOwn(globalStore, key) ? globalStore[key] : void 0;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a process-local Map singleton for keyed caches backed by globalThis. */
function resolveGlobalMap(key, reset, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Map(), typeof reset === "string" ? (value) => value.clear() : reset, typeof reset === "string" ? reset : lifecycle);
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
//#endregion
//#region src/infra/map-size.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
function pruneMapToMaxSize(map, maxSize) {
	if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) return;
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	for (const key of map.keys()) {
		if (map.size <= limit) break;
		map.delete(key);
	}
}
//#endregion
//#region src/shared/listeners.ts
/** Notifies every registered listener while isolating individual listener failures. */
function notifyListeners(listeners, event, onError) {
	for (const listener of listeners) try {
		listener(event);
	} catch (error) {
		onError?.(error);
	}
}
/** Registers a listener in a Set and returns an idempotent unsubscribe handle. */
function registerListener(listeners, listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
//#endregion
export { resolveGlobalMap as a, coerceErrorMessage as c, extractErrorCode as d, formatErrorMessage as f, toStructuredErrorObject as h, readGlobalSingleton as i, collectErrorGraphCandidates as l, toStringifiedError as m, registerListener as n, resolveGlobalSet as o, toErrorObject as p, pruneMapToMaxSize as r, resolveGlobalSingleton as s, notifyListeners as t, collectNestedErrorCandidates as u };
