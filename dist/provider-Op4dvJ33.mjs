//#region extensions/migrate-hermes/provider.ts
function buildHermesMigrationProvider(params = {}) {
	return {
		id: "hermes",
		label: "Hermes",
		description: "Import Hermes config, memories, skills, and supported credentials.",
		supportedItemKinds: ["memory"],
		async detect(ctx) {
			const { discoverHermesSource, hasHermesSource } = await import("./extensions/migrate-hermes/source.js");
			const { isMemoryOnlyMigration } = await import("./extensions/migrate-hermes/memory.js");
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
			return await (await import("./extensions/migrate-hermes/plan.js")).buildHermesPlan(ctx);
		},
		async apply(ctx, plan) {
			const { applyHermesPlan } = await import("./extensions/migrate-hermes/apply.js");
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
