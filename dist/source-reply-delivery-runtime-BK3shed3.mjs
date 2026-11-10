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
			const currentComponent = Object.values(params.promptComponentByMode).find((component) => component && prompt.slice(offset, offset + component.length) === component);
			if (currentComponent && currentComponent !== nextComponent && offset >= 0) {
				const context = projection.extraSystemPromptTurnContext;
				const end = context ? context.start + context.text.length : -1;
				const valid = context && context.text && Number.isInteger(context.start) && context.start >= 0 && prompt.slice(context.start, end) === context.text && (context.start === 0 || prompt.slice(context.start - 2, context.start) === "\n\n") && (end === prompt.length || prompt.slice(end, end + 2) === "\n\n");
				if (valid && context.start <= offset && end >= offset + currentComponent.length) {
					const relative = offset - context.start;
					projection.extraSystemPromptTurnContext = {
						start: context.start,
						text: context.text.slice(0, relative) + nextComponent + context.text.slice(relative + currentComponent.length)
					};
				} else if (valid && context.start >= offset + currentComponent.length) projection.extraSystemPromptTurnContext = {
					...context,
					start: context.start + nextComponent.length - currentComponent.length
				};
				else if (!valid || end > offset) projection.extraSystemPromptTurnContext = void 0;
				projection.extraSystemPrompt = prompt.slice(0, offset) + nextComponent + prompt.slice(offset + currentComponent.length);
			}
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
