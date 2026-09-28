import { t as getSealedRuntimeJson5 } from "./sealed-runtime-registry-DDnWdfsn.mjs";
import { createRequire } from "node:module";
//#region src/utils/parse-json-compat.ts
/**
* JSON parser compatibility helper for persisted config, manifests, and legacy stores.
* Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
*/
let json5Runtime;
function isJson5Parser(value) {
	return typeof value === "object" && value !== null && "parse" in value && typeof value.parse === "function";
}
function setJson5Runtime(runtime) {
	const parser = isJson5Parser(runtime) ? runtime : typeof runtime === "object" && runtime !== null && "default" in runtime ? runtime.default : void 0;
	if (!isJson5Parser(parser)) throw new Error("json5 parser unavailable");
	json5Runtime = parser;
	return parser;
}
function loadJson5Parser() {
	if (json5Runtime) return json5Runtime;
	const injected = getSealedRuntimeJson5();
	if (injected !== void 0) return setJson5Runtime(injected);
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed JSON5 runtime was not registered before use");
	return setJson5Runtime(createRequire(import.meta.url)("json5"));
}
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5) {
	try {
		return JSON.parse(raw);
	} catch {
		return (json5 ?? loadJson5Parser()).parse(raw);
	}
}
//#endregion
export { parseJsonWithJson5Fallback as t };
