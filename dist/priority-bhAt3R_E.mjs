import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
//#region extensions/vllm/priority.ts
function wrapVllmPriorityStream(ctx) {
	const underlying = ctx.streamFn;
	if (!underlying || normalizeProviderId(ctx.provider) !== "vllm" || ctx.modelParams?.priorityScheduling !== true) return underlying;
	const priority = ctx.modelCallUrgency === "foreground" ? -100 : ctx.modelCallUrgency === "background" ? 100 : 0;
	const wrapped = (model, context, options) => {
		if (normalizeProviderId(model.provider) !== "vllm" || model.id !== ctx.modelId || (ctx.sourceApi ?? model.api) !== "openai-completions") return underlying(model, context, options);
		return underlying(model, context, {
			...options,
			onPayload: async (payload, requestModel) => {
				const result = await options?.onPayload?.(payload, requestModel) ?? payload;
				const body = asOptionalObjectRecord(result);
				if (body) body.priority = priority;
				return result;
			}
		});
	};
	return Object.assign(wrapped, { preservesGenericCompatibility: true });
}
//#endregion
export { wrapVllmPriorityStream as t };
