import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/baseten/decision-provider.ts
const loadRuntime = createLazyRuntimeModule(() => import("./decision-provider.runtime.js"));
function buildBasetenDecisionProvider() {
	return {
		id: "baseten",
		contractVersion: 2,
		async evaluate(batch, context) {
			context.signal.throwIfAborted();
			const { evaluateBasetenDecision } = await loadRuntime();
			context.signal.throwIfAborted();
			return evaluateBasetenDecision(batch, context);
		}
	};
}
export { buildBasetenDecisionProvider };
