import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region extensions/migrate-hermes/provider.ts
const loadApply = createLazyRuntimeModule(() => import("./extensions/migrate-hermes/apply.js"));
const loadMemory = createLazyRuntimeModule(() => import("./extensions/migrate-hermes/memory.js"));
const loadPlan = createLazyRuntimeModule(() => import("./extensions/migrate-hermes/plan.js"));
const loadSource = createLazyRuntimeModule(() => import("./extensions/migrate-hermes/source.js"));
function buildHermesMigrationProvider(params = {}) {
	return {
		id: "hermes",
		label: "Hermes",
		description: "Import Hermes config, memories, skills, and supported credentials.",
		supportedItemKinds: ["memory"],
		async detect(ctx) {
			const { discoverHermesSource, hasHermesSource } = await loadSource();
			const { isMemoryOnlyMigration } = await loadMemory();
			const source = await discoverHermesSource(ctx.source);
			const found = isMemoryOnlyMigration(ctx) ? Boolean(source.memoryPath || source.userPath) : hasHermesSource(source);
			return {
				found,
				source: source.root,
				label: "Hermes",
				confidence: found ? "high" : "low",
				message: found ? "Hermes state found." : "Hermes state not found."
			};
		},
		async plan(ctx) {
			return await (await loadPlan()).buildHermesPlan(ctx);
		},
		async apply(ctx, plan) {
			const { applyHermesPlan } = await loadApply();
			return await applyHermesPlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
//#endregion
export { buildHermesMigrationProvider as t };
