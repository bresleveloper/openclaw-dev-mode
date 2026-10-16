import { a as PluginStateStoreError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { p as isRetainedPluginStateNamespace, r as RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX, t as MAX_PLUGIN_STATE_VALUE_BYTES } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
//#region src/plugin-state/plugin-store-validation.ts
const MAX_PLUGIN_STORE_NAMESPACE_BYTES = 128;
const MAX_PLUGIN_STORE_KEY_BYTES = 512;
const MAX_PLUGIN_STORE_JSON_BYTES = 65536;
const MAX_PLUGIN_STORE_JSON_DEPTH = 64;
const NAMESPACE_PATTERN = /^[a-z0-9][a-z0-9._-]*$/iu;
const textEncoder = new TextEncoder();
function createPluginStoreOptionPolicy(params) {
	const signatures = /* @__PURE__ */ new Map();
	return {
		resolveOverflowPolicy(value) {
			if (value === void 0 || value === "evict-oldest") return "evict-oldest";
			if (value === "reject-new") return value;
			throw params.invalid(`${params.label} overflowPolicy must be evict-oldest or reject-new`);
		},
		assertConsistent(pluginId, namespace, signature) {
			const key = `${pluginId}\0${namespace}`;
			const existing = signatures.get(key);
			if (!existing) {
				signatures.set(key, signature);
				return;
			}
			if (!(Object.entries(existing).every(([name, value]) => signature[name] === value) && Object.entries(signature).every(([name, value]) => existing[name] === value))) throw params.invalid(`${params.label} namespace ${namespace} for ${pluginId} was reopened with incompatible options`);
		},
		clear() {
			signatures.clear();
		}
	};
}
function assertMaxUtf8Bytes(params) {
	if (textEncoder.encode(params.value).byteLength > params.maxBytes) throw params.invalid(`${params.label} must be <= ${params.maxBytes} bytes`);
}
function validatePluginStoreNamespace(params) {
	const trimmed = params.value.trim();
	if (!NAMESPACE_PATTERN.test(trimmed)) throw params.invalid(`${params.label} namespace must be a safe path segment: ${params.value}`);
	assertMaxUtf8Bytes({
		label: `${params.label} namespace`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_NAMESPACE_BYTES,
		invalid: params.invalid
	});
	return trimmed;
}
function validatePluginStoreKey(params) {
	const trimmed = params.value.trim();
	if (!trimmed) throw params.invalid(`${params.label} entry key must not be empty`);
	assertMaxUtf8Bytes({
		label: `${params.label} entry key`,
		value: trimmed,
		maxBytes: MAX_PLUGIN_STORE_KEY_BYTES,
		invalid: params.invalid
	});
	return trimmed;
}
function validatePluginStorePositiveInteger(params) {
	if (!Number.isSafeInteger(params.value) || params.value < 1) throw params.invalid(`${params.label} must be a positive safe integer`);
	return params.value;
}
function validateOptionalPluginStoreTtlMs(params) {
	const value = params.value;
	if (value == null) return;
	return validatePluginStorePositiveInteger({
		...params,
		value
	});
}
function serializePluginStoreJson(params) {
	const seen = /* @__PURE__ */ new WeakSet();
	function assertValue(value, pathname, depth) {
		if (depth > MAX_PLUGIN_STORE_JSON_DEPTH) throw params.errors.limit(`${params.label} nesting exceeds maximum depth of ${MAX_PLUGIN_STORE_JSON_DEPTH}`);
		if (value === null) return;
		const valueType = typeof value;
		if (valueType === "string" || valueType === "boolean") return;
		if (valueType === "number") {
			if (!Number.isFinite(value)) throw params.errors.invalid(`${params.label} at ${pathname} must be a finite number`);
			return;
		}
		if (valueType !== "object") throw params.errors.invalid(`${params.label} at ${pathname} must be JSON-serializable`);
		const objectValue = value;
		if (seen.has(objectValue)) throw params.errors.invalid(`${params.label} at ${pathname} must not contain circular references`);
		seen.add(objectValue);
		try {
			if (Array.isArray(value)) {
				for (let index = 0; index < value.length; index += 1) {
					if (!(index in value)) throw params.errors.invalid(`${params.label} array at ${pathname} must not be sparse`);
					assertValue(value[index], `${pathname}[${index}]`, depth + 1);
				}
				return;
			}
			const prototype = Object.getPrototypeOf(objectValue);
			const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
			if (!prototype || Object.getPrototypeOf(prototype) !== null || typeof constructor !== "function" || Object.getOwnPropertyDescriptor(constructor, "prototype")?.value !== prototype || Function.prototype.toString.call(constructor) !== Function.prototype.toString.call(Object)) throw params.errors.invalid(`${params.label} object at ${pathname} must be a plain object`);
			const descriptorEntries = Object.entries(Object.getOwnPropertyDescriptors(objectValue));
			if (Object.getOwnPropertySymbols(objectValue).length > 0) throw params.errors.invalid(`${params.label} object at ${pathname} must not use symbol keys`);
			if (descriptorEntries.length !== Object.keys(objectValue).length) throw params.errors.invalid(`${params.label} object at ${pathname} must not use non-enumerable properties`);
			for (const [key, descriptor] of descriptorEntries) {
				if (descriptor.get || descriptor.set || !("value" in descriptor)) throw params.errors.invalid(`${params.label} object at ${pathname}.${key} must use data properties`);
				assertValue(descriptor.value, `${pathname}.${key}`, depth + 1);
			}
		} finally {
			seen.delete(objectValue);
		}
	}
	assertValue(params.value, "value", 0);
	const json = JSON.stringify(params.value);
	if (json === void 0) throw params.errors.invalid(`${params.label} must be JSON-serializable`);
	const maxBytes = params.maxBytes ?? MAX_PLUGIN_STORE_JSON_BYTES;
	if (textEncoder.encode(json).byteLength > maxBytes) throw params.errors.limit(`${params.label} exceeds ${maxBytes} byte limit`);
	return json;
}
//#endregion
//#region src/plugin-state/plugin-state-store.validation.ts
function invalidInput(message, operation = "register") {
	return new PluginStateStoreError(message, {
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation
	});
}
function validateNamespace(value, operation = "open") {
	return validatePluginStoreNamespace({
		value,
		label: "plugin state",
		invalid: (message) => invalidInput(message, operation)
	});
}
function requireBoundedOptions(options) {
	if (options.retention !== void 0 && options.retention !== "bounded") throw invalidInput("This plugin state operation requires a bounded store.", "open");
}
function validateKey(value, operation = "register") {
	return validatePluginStoreKey({
		value,
		label: "plugin state",
		invalid: (message) => invalidInput(message, operation)
	});
}
function validateMaxEntries(value) {
	if (!Number.isInteger(value) || value < 1) throw invalidInput("plugin state maxEntries must be an integer >= 1", "open");
	return value;
}
const optionPolicy = createPluginStoreOptionPolicy({
	label: "plugin state",
	invalid: (message) => invalidInput(message, "open")
});
function validateOptionalTtlMs(value, operation = "register") {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin state ttlMs",
		invalid: (message) => invalidInput(message, operation)
	});
}
function prepareRegisterParams(key, value, defaultTtlMs, opts, namespace) {
	const normalizedKey = validateKey(key, "register");
	const json = serializePluginStoreJson({
		value,
		label: "plugin state value",
		maxBytes: MAX_PLUGIN_STATE_VALUE_BYTES,
		errors: {
			invalid: (message) => invalidInput(message, "register"),
			limit: (message) => new PluginStateStoreError(message, {
				code: "PLUGIN_STATE_LIMIT_EXCEEDED",
				operation: "register"
			})
		}
	});
	const ttlMs = validateOptionalTtlMs(opts?.ttlMs, "register") ?? defaultTtlMs;
	if (namespace && isRetainedPluginStateNamespace(namespace) && ttlMs !== void 0) throw invalidInput("Retained plugin state does not accept a TTL.");
	return {
		key: normalizedKey,
		valueJson: json,
		...ttlMs != null ? { ttlMs } : {}
	};
}
function prepareLookupKeys(keys) {
	if (keys.length > 1e4) throw invalidInput("plugin state lookupMany accepts at most 10000 keys", "lookup");
	return Array.from(keys, (key) => validateKey(key, "lookup"));
}
function prepareKeyedStoreOptions(pluginId, options) {
	const logicalNamespace = validateNamespace(options.namespace);
	if (options.retention === "retained") {
		if (options.maxEntries !== void 0 || options.overflowPolicy !== void 0 || options.defaultTtlMs !== void 0) throw invalidInput("Retained plugin state does not accept count, overflow or TTL options.", "open");
		return {
			pluginId,
			namespace: `${RETAINED_PLUGIN_STATE_NAMESPACE_PREFIX}${logicalNamespace}`,
			maxEntries: void 0,
			overflowPolicy: "evict-oldest",
			env: options.env
		};
	}
	requireBoundedOptions(options);
	const namespace = logicalNamespace;
	const maxEntries = validateMaxEntries(options.maxEntries);
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
	const env = options.env;
	optionPolicy.assertConsistent(pluginId, namespace, {
		maxEntries,
		overflowPolicy,
		defaultTtlMs
	});
	return {
		pluginId,
		namespace,
		maxEntries,
		overflowPolicy,
		defaultTtlMs,
		env
	};
}
//#endregion
export { prepareRegisterParams as a, validateMaxEntries as c, createPluginStoreOptionPolicy as d, serializePluginStoreJson as f, validatePluginStorePositiveInteger as g, validatePluginStoreNamespace as h, prepareLookupKeys as i, validateNamespace as l, validatePluginStoreKey as m, optionPolicy as n, requireBoundedOptions as o, validateOptionalPluginStoreTtlMs as p, prepareKeyedStoreOptions as r, validateKey as s, invalidInput as t, validateOptionalTtlMs as u };
