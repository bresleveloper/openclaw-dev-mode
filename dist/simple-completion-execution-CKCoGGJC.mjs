import { s as resolveProviderThinkingLevel } from "./thinking-DK1cFezU.mjs";
import { a as getModelCompletionTransport, i as getModelCompletionOwner, n as bindModelLlmRuntime, o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { n as completeSimple } from "./stream-4ZQq1Iyd.mjs";
import { prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion } from "@openclaw/ai/transports";
import { reasoningTagTextPolicy } from "@openclaw/ai/internal/openai";
import { defaultApiRegistry } from "@openclaw/ai/internal/runtime";
//#region src/agents/simple-completion-execution.ts
/** Executes an already-prepared model without importing model/auth preparation. */
async function completeWithPreparedSimpleCompletionModel(params) {
	const owner = getModelCompletionOwner(params.model);
	if (!owner) return await completePreparedModel(params);
	return await owner.run(() => completePreparedModel({
		...params,
		assertCurrent: () => {
			owner.assertCurrent();
			params.assertCurrent?.();
		}
	}));
}
async function completePreparedModel(params) {
	await import("./ai-transport-runtime-host-BrmfYJMo.mjs");
	params.assertCurrent?.();
	params.options?.signal?.throwIfAborted();
	const runtime = getModelLlmRuntime(params.model);
	let completionModel = getModelCompletionTransport(params.model) ?? prepareModelForSimpleCompletion({
		apiRegistry: runtime?.registry ?? defaultApiRegistry,
		model: params.model,
		cfg: params.cfg,
		auth: {
			mode: params.auth.mode,
			authFlow: params.auth.authFlow
		}
	});
	if (runtime) completionModel = bindModelLlmRuntime(completionModel, runtime);
	const { reasoning: rawReasoning, strictReasoningTags, ...options } = params.options ?? {};
	const providerReasoning = resolveProviderThinkingLevel({
		provider: params.model.provider,
		model: params.model.id,
		catalog: [params.model],
		agentRuntime: "openclaw",
		level: rawReasoning
	});
	const reasoning = providerReasoning === "adaptive" ? "medium" : providerReasoning;
	const headers = prepareHeadersForSimpleCompletion(params.model, options);
	const completionOptions = {
		...options,
		...reasoning ? { reasoning } : {},
		apiKey: params.auth.apiKey,
		...headers ? { headers } : {}
	};
	if (strictReasoningTags) reasoningTagTextPolicy.markStrict(completionOptions);
	return await completeSimple(completionModel, params.context, completionOptions, params.assertCurrent);
}
//#endregion
export { completeWithPreparedSimpleCompletionModel as t };
