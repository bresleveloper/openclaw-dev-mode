// packages/ai/src/provider-types.ts
const PROVIDER_CONTEXT_HANDOFF = Symbol("providerContextHandoff");
const PROVIDER_MODEL_INPUT = Symbol("providerModelInput");
/** Callable tools deliberately left out of the request's tool list (Tool Search directory). */
const PROVIDER_DEFERRED_TOOL_NAMES = Symbol("providerDeferredToolNames");
/** Resolves provider-only context without widening the canonical call contract. */
async function resolveProviderContext(context, options) {
	return options?.[PROVIDER_CONTEXT_HANDOFF]?.() ?? context;
}
export { PROVIDER_CONTEXT_HANDOFF, PROVIDER_DEFERRED_TOOL_NAMES, PROVIDER_MODEL_INPUT, resolveProviderContext };
