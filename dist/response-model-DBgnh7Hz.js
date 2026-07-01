//#region extensions/voice-call/src/response-model.ts
/** Resolve provider/model fields from explicit voice config or agent defaults. */
function resolveVoiceResponseModel(params) {
	const modelRef = params.voiceConfig.responseModel ?? `${params.agentRuntime.defaults.provider}/${params.agentRuntime.defaults.model}`;
	const slashIndex = modelRef.indexOf("/");
	return {
		modelRef,
		provider: slashIndex === -1 ? params.agentRuntime.defaults.provider : modelRef.slice(0, slashIndex),
		model: slashIndex === -1 ? modelRef : modelRef.slice(slashIndex + 1)
	};
}
//#endregion
export { resolveVoiceResponseModel as t };
