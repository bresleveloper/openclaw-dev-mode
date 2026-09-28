import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const MAX_SECRET_VALUES = 512;
const state = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistry"), () => ({
	registeredValues: /* @__PURE__ */ new Map(),
	registryRevision: 0,
	registeredValueRedactor: void 0
}));
function invalidateMatcher() {
	state.registryRevision += 1;
	state.registeredValueRedactor = void 0;
}
function registerOneSecretValue(value) {
	if (state.registeredValues.delete(value)) {
		state.registeredValues.set(value, true);
		return;
	}
	state.registeredValues.set(value, true);
	pruneMapToMaxSize(state.registeredValues, MAX_SECRET_VALUES);
	invalidateMatcher();
}
/** Registers one resolved secret for exact-value log redaction. */
function registerSecretValueForRedaction(value) {
	if (value.length < MIN_SECRET_VALUE_LENGTH) return;
	const encoded = encodeURIComponent(value);
	if (encoded !== value) registerOneSecretValue(encoded);
	const jsonEscaped = JSON.stringify(value).slice(1, -1);
	if (jsonEscaped !== value) registerOneSecretValue(jsonEscaped);
	registerOneSecretValue(value);
}
/** Returns whether a value has SecretRef provenance in the process registry. */
function isSecretValueRegisteredForRedaction(value) {
	return state.registeredValues.has(value);
}
function hasRegisteredSecretValuesForRedaction() {
	return state.registeredValues.size > 0;
}
/** Changes with registry membership, including bounded eviction and test resets. */
function getSecretRedactionRegistryRevision() {
	return state.registryRevision;
}
/** Exact surface forms are already expanded; snapshots must not register them again. */
function captureSecretRedactionRegistrySnapshot() {
	return {
		revision: state.registryRevision,
		values: [...state.registeredValues.keys()]
	};
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	if (!text || state.registeredValues.size === 0) return text;
	state.registeredValueRedactor ??= createSecretValueRedactor([...state.registeredValues.keys()]);
	return state.registeredValueRedactor(text, mask);
}
function createSecretValueRedactor(values) {
	let compiledMatcher;
	let firstChars;
	return (text, mask) => {
		if (!text || values.length === 0) return text;
		let couldMatch = false;
		firstChars ??= new Set(values.map((value) => value.charAt(0)));
		for (const firstChar of firstChars) if (text.includes(firstChar)) {
			couldMatch = true;
			break;
		}
		if (!couldMatch) return text;
		if (!compiledMatcher) {
			const buckets = /* @__PURE__ */ new Map();
			for (const value of values.toSorted((left, right) => right.length - left.length)) {
				const prefix = value.slice(0, MIN_SECRET_VALUE_LENGTH);
				const bucket = buckets.get(prefix);
				if (bucket) bucket.push(value);
				else buckets.set(prefix, [value]);
			}
			compiledMatcher = {
				prefixes: new RegExp([...buckets.keys()].map(escapeRegExp).join("|"), "g"),
				buckets
			};
		}
		const { prefixes, buckets } = compiledMatcher;
		const matches = [];
		prefixes.lastIndex = 0;
		for (let match = prefixes.exec(text); match; match = prefixes.exec(text)) {
			const index = match.index;
			const value = buckets.get(match[0])?.find((candidate) => text.startsWith(candidate, index));
			if (value !== void 0) matches.push({
				index,
				value
			});
			prefixes.lastIndex = index + (value?.length ?? 1);
		}
		let result = "";
		let cursor = 0;
		for (const match of matches) {
			result += `${text.slice(cursor, match.index)}${mask(match.value, match.index)}`;
			cursor = match.index + match.value.length;
		}
		return result + text.slice(cursor);
	};
}
function resetSecretRedactionRegistryForTest() {
	state.registeredValues.clear();
	invalidateMatcher();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
//#endregion
export { isSecretValueRegisteredForRedaction as a, hasRegisteredSecretValuesForRedaction as i, createSecretValueRedactor as n, redactRegisteredSecretValues as o, getSecretRedactionRegistryRevision as r, registerSecretValueForRedaction as s, captureSecretRedactionRegistrySnapshot as t };
