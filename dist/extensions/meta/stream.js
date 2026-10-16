import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
import { filterStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/meta/stream.ts
const META_REASONING_ENCRYPTED_CONTENT_INCLUDE = "reasoning.encrypted_content";
function wrapMetaProviderStream(ctx) {
	if (ctx.provider !== "meta" || (ctx.sourceApi ?? ctx.model?.api) !== "openai-responses") return;
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model, options }) => {
		if (model.provider !== "meta") return;
		if (options?.maxTokens === 0 && payload.max_output_tokens === void 0) payload.max_output_tokens = model.maxTokens;
		if (!model.reasoning) return;
		const include = filterStringEntries(payload.include);
		if (!include.includes(META_REASONING_ENCRYPTED_CONTENT_INCLUDE)) include.push(META_REASONING_ENCRYPTED_CONTENT_INCLUDE);
		payload.include = include;
		payload.store = false;
	});
}
//#endregion
export { wrapMetaProviderStream };
