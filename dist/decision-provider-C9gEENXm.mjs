import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region extensions/openai/decision-provider.ts
const loadRuntime = createLazyRuntimeModule(() => import("./extensions/openai/decision-provider.runtime.js"));
function buildOpenAIDecisionProvider(getConfig) {
	return {
		id: "openai",
		contractVersion: 1,
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			const { evaluateOpenAIDecision } = await loadRuntime();
			context.signal.throwIfAborted();
			return evaluateOpenAIDecision(batch, context, getConfig());
		}
	};
}
//#endregion
export { buildOpenAIDecisionProvider as t };
