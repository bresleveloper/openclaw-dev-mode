import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
//#region src/llm/providers/stream-wrappers/stream-payload-utils.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
function streamWithPayloadPatch(underlying, model, context, options, patchPayload) {
	const originalOnPayload = options?.onPayload;
	return underlying(model, context, {
		...options,
		onPayload: (payload) => {
			if (payload && typeof payload === "object") patchPayload(payload);
			const result = originalOnPayload?.(payload, model);
			if (isPromiseLike(result)) return Promise.resolve(result).then((resolved) => {
				if (resolved && typeof resolved === "object" && resolved !== payload) patchPayload(resolved);
				return resolved;
			});
			if (result && typeof result === "object" && result !== payload) patchPayload(result);
			return result;
		}
	});
}
//#endregion
export { streamWithPayloadPatch as t };
