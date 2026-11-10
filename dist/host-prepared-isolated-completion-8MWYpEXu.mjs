import { t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-execution-6SeWwCe4.mjs";
//#region src/agents/host-prepared-isolated-completion.ts
/** Executes one zero-tool completion using the exact host-prepared model and credential. */
async function runHostPreparedIsolatedCompletion(params) {
	if (params.authorization.owner !== "host") throw new Error("Isolated completion requires host-prepared authorization.");
	params.assertCurrent?.();
	const timeoutSignal = AbortSignal.timeout(params.timeoutMs);
	const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, timeoutSignal]) : timeoutSignal;
	const requestStartedAt = params.onRequestComplete ? performance.now() : void 0;
	try {
		const assistant = await completeWithPreparedSimpleCompletionModel({
			assertCurrent: params.assertCurrent,
			model: params.authorization.model,
			auth: params.authorization.auth,
			cfg: params.config,
			context: {
				systemPrompt: params.systemPrompt,
				messages: [{
					role: "user",
					content: params.prompt,
					timestamp: Date.now()
				}],
				tools: []
			},
			options: {
				maxTokens: params.streamParams?.maxTokens,
				temperature: params.streamParams?.temperature,
				reasoning: params.thinkLevel,
				strictReasoningTags: params.outputTextPolicy === "strict-visible",
				signal
			}
		});
		signal.throwIfAborted();
		params.assertCurrent?.();
		return { assistant };
	} finally {
		if (requestStartedAt !== void 0) params.onRequestComplete?.(performance.now() - requestStartedAt);
	}
}
//#endregion
export { runHostPreparedIsolatedCompletion as t };
