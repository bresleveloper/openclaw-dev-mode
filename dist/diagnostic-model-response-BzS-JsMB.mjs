//#region src/agents/diagnostic-model-response.ts
/**
* Resolves the model's own final message text for diagnostic capture. Only the
* text of the model's last message counts, including sentinels such as
* NO_REPLY: message-tool send text, earlier turn text the runner substituted
* for an empty last message, delivery output, and host or hook text are never
* returned. Blocked and hook-handled turns never ran a model; errored runs may
* retain genuine partial model output and keep it.
*/
function resolveDiagnosticModelResponse(result) {
	if (result.meta.livenessState === "blocked" || result.meta.providerStarted === false) return;
	const rawText = result.meta.finalAssistantMessageRawText ?? result.meta.finalAssistantRawText;
	return typeof rawText === "string" && rawText.trim() ? rawText : void 0;
}
//#endregion
export { resolveDiagnosticModelResponse as t };
