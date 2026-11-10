import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as capturePluginStateErrorCause, n as createPluginStateError, r as parseStoredJson, t as PluginStateStoreError } from "./plugin-state-error-Wxkh7e3f.mjs";
import "./plugin-state-store.types-CLUTlkgE.mjs";
import { createHash } from "node:crypto";
//#region src/plugin-state/plugin-state-observation.ts
const COMPARISON_PATTERN = /^1:([a-f0-9]{64}):([a-f0-9]{64}|-)$/u;
function validatePluginStateComparison(value, operation) {
	const scope = (typeof value === "string" ? COMPARISON_PATTERN.exec(value) : null)?.[1];
	if (!scope) throw createPluginStateError({
		code: "PLUGIN_STATE_INVALID_INPUT",
		operation,
		message: "Plugin state comparison must be an observation returned by this store."
	});
	return scope;
}
function digest(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function pluginStateComparisonScope(storeIdentity, key) {
	return digest([
		storeIdentity,
		key.pluginId,
		key.namespace,
		key.key
	]);
}
function createPluginStateObservation(databasePath, scope, row, operation) {
	const image = row ? digest([
		row.value_json,
		row.created_at,
		row.expires_at
	]) : "-";
	return {
		value: row ? parseStoredJson(row.value_json, operation, databasePath) : void 0,
		comparison: `1:${scope}:${image}`
	};
}
//#endregion
//#region src/plugin-state/plugin-state-worker-errors.ts
const errorConstructors = /* @__PURE__ */ new Map([
	["Error", Error],
	["TypeError", TypeError],
	["SyntaxError", SyntaxError],
	["RangeError", RangeError],
	["ReferenceError", ReferenceError],
	["URIError", URIError],
	["EvalError", EvalError]
]);
function restoreCause(value) {
	if (value && "canonical" in value) {
		const retained = /* @__PURE__ */ new Error("SQLite worker error cause");
		retainOpenClawStateWorkerErrorPayload(retained, value.canonical);
		return hydrateOpenClawStateWorkerError(retained, { includeOrdinary: true });
	}
	const Constructor = value ? errorConstructors.get(value.name) ?? Error : Error;
	return value ? Object.assign(new Constructor(value.message, { cause: restoreCause(value.cause) }), {
		name: value.name,
		...value.errorCode === void 0 ? {} : { code: value.errorCode },
		...value.errcode === void 0 ? {} : { errcode: value.errcode },
		...value.errno === void 0 ? {} : { errno: value.errno }
	}) : void 0;
}
function capturePluginStateWorkerFailure(error) {
	const cause = capturePluginStateErrorCause(error.cause, (value) => encodeOpenClawStateWorkerError(value, { includeOrdinary: value instanceof AggregateError }));
	return {
		message: error.message,
		code: error.code,
		operation: error.operation,
		owner: error.owner,
		...error.path === void 0 ? {} : { path: error.path },
		...cause ? { cause } : {}
	};
}
function restorePluginStateWorkerFailure(error) {
	return new PluginStateStoreError(error.message, {
		code: error.code,
		operation: error.operation,
		owner: error.owner,
		...error.path === void 0 ? {} : { path: error.path },
		cause: restoreCause(error.cause)
	});
}
//#endregion
export { validatePluginStateComparison as a, pluginStateComparisonScope as i, restorePluginStateWorkerFailure as n, createPluginStateObservation as r, capturePluginStateWorkerFailure as t };
