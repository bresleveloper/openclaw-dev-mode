//#region src/auto-reply/reply/source-reply-delivery-runtime.ts
const sourceReplyDeliveryRuntimeKey = "__openclawSourceReplyDeliveryRuntime";
function bindSourceReplyDeliveryRuntime(owner, runtime) {
	owner[sourceReplyDeliveryRuntimeKey] = runtime;
}
function readSourceReplyDeliveryRuntime(owner) {
	return owner[sourceReplyDeliveryRuntimeKey];
}
function createSourceReplyDeliveryRuntime(params) {
	const projections = new Set(params.projections);
	let currentMode = params.initialMode;
	const applyMode = (owner, mode, updatePrompt) => {
		currentMode = mode;
		for (const projection of /* @__PURE__ */ new Set([...projections, owner])) {
			projection.sourceReplyDeliveryMode = mode;
			if (!updatePrompt) continue;
			const nextComponent = params.promptComponentByMode[mode];
			const prompt = projection.extraSystemPrompt;
			if (!nextComponent || !prompt) continue;
			const offset = params.promptComponentOffset ?? -1;
			const currentComponent = [...new Set(Object.values(params.promptComponentByMode))].find((component) => component && prompt.slice(offset, offset + component.length) === component);
			if (currentComponent && currentComponent !== nextComponent && offset >= 0) projection.extraSystemPrompt = prompt.slice(0, offset) + nextComponent + prompt.slice(offset + currentComponent.length);
		}
		params.onModeResolved?.(mode);
	};
	return {
		origin: params.origin,
		get currentMode() {
			return currentMode;
		},
		track: (owner) => projections.add(owner),
		applyMode: (owner, mode) => applyMode(owner, mode, false),
		applyPreparedMode: (owner, mode) => applyMode(owner, mode, true)
	};
}
//#endregion
export { createSourceReplyDeliveryRuntime as n, readSourceReplyDeliveryRuntime as r, bindSourceReplyDeliveryRuntime as t };
