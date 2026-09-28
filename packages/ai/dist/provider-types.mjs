//#region packages/ai/src/provider-types.ts
const PROVIDER_CONTEXT_HANDOFF = Symbol("providerContextHandoff");
/** Resolves provider-only context without widening the canonical call contract. */
async function resolveProviderContext(context, options) {
	return options?.[PROVIDER_CONTEXT_HANDOFF]?.() ?? context;
}
//#endregion
export { PROVIDER_CONTEXT_HANDOFF, resolveProviderContext };
