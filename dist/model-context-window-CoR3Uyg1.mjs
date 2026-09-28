//#region src/agents/model-context-window.ts
/**
* Resolves a session's selectable context-window choice against the model's
* catalog-declared options: explicit selection, else the declared default,
* else the model's scalar window.
*/
function resolveModelContextWindowProfile(params) {
	const contextWindows = params.catalogEntry?.contextWindows ?? [];
	const contextWindowDefault = params.catalogEntry?.contextWindowDefault;
	const selected = params.selected ? contextWindows.find((option) => option.id === params.selected) : void 0;
	const fallback = contextWindowDefault ? contextWindows.find((option) => option.id === contextWindowDefault) : void 0;
	const effective = selected ?? fallback;
	return {
		contextWindow: effective?.id,
		contextWindows: contextWindows.length > 0 ? contextWindows : void 0,
		contextWindowDefault,
		contextTokens: effective?.contextWindow ?? params.catalogEntry?.contextWindow
	};
}
//#endregion
export { resolveModelContextWindowProfile as t };
