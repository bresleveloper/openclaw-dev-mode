import "./defaults-DX4XN2j1.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { setQwenChatTemplateThinking } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/llama-cpp/src/external-server/stream.ts
/** Maps shared structured-output requests to the shape accepted by older llama-server builds. */
function normalizeLlamaServerResponseFormat(payload, requestedResponseFormat) {
	const responseFormat = isRecord(payload.response_format) ? payload.response_format : requestedResponseFormat;
	if (!responseFormat || responseFormat.type === "text") return;
	const schema = responseFormat.type === "json_schema" ? isRecord(responseFormat.json_schema) ? responseFormat.json_schema.schema : responseFormat.schema : responseFormat.type === "json_object" ? responseFormat.schema : responseFormat;
	if (isRecord(schema)) payload.response_format = {
		type: "json_object",
		schema
	};
}
/** Keeps the shared OpenAI transport and adjusts llama-server request compatibility. */
function wrapLlamaServerStream(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "llama-cpp") return underlying(model, context, options);
		const onPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: async (payload, requestModel) => {
				const customized = await onPayload?.(payload, requestModel) ?? payload;
				if (isRecord(customized)) {
					if ((options?.reasoning ?? ctx.thinkingLevel) === "off") setQwenChatTemplateThinking(customized, false);
					normalizeLlamaServerResponseFormat(customized, options?.responseFormat);
				}
				return customized;
			}
		});
	};
}
//#endregion
export { wrapLlamaServerStream };
