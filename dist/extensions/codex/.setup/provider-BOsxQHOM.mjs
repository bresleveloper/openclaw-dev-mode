//#region extensions/codex/src/migration/provider.ts
function isMemoryOnlyMigration(ctx) {
	return Boolean(ctx.itemKinds && ctx.itemKinds.length > 0 && ctx.itemKinds.every((kind) => kind === "memory"));
}
function isAuthOnlyMigration(ctx) {
	return Boolean(ctx.itemKinds && ctx.itemKinds.length > 0 && ctx.itemKinds.every((kind) => kind === "auth"));
}
function buildCodexMigrationProvider(params = {}) {
	return {
		id: "codex",
		label: "Codex",
		description: [
			"Import consolidated memories, selected Codex and personal AgentSkills, and selected eligible openai-curated plugins.",
			"Auth credentials require separate consent. Sessions and chat history are not imported.",
			"Codex config and hooks are saved for manual review, not activated. Source files are not moved or deleted."
		].join(" "),
		supportedItemKinds: ["memory", "auth"],
		async detect(ctx) {
			const { discoverCodexSource, hasCodexSource } = await import("./source-CUzJq5WN.mjs").then((n) => n.a);
			const source = await discoverCodexSource({
				input: ctx.source,
				memoryOnly: isMemoryOnlyMigration(ctx),
				authOnly: isAuthOnlyMigration(ctx)
			});
			const found = isMemoryOnlyMigration(ctx) ? source.memoryFiles.length > 0 : isAuthOnlyMigration(ctx) ? Boolean(source.authPath) : hasCodexSource(source);
			return {
				found,
				source: source.root,
				label: "Codex",
				confidence: found ? source.confidence : "low",
				message: found ? "Codex state found." : "Codex state not found."
			};
		},
		async plan(ctx) {
			const { buildCodexMigrationPlan } = await import("./plan-CN3VwfNU.mjs");
			return buildCodexMigrationPlan(ctx);
		},
		deferredApply: { retrySafe: true },
		prepareApply(ctx) {
			if (isMemoryOnlyMigration(ctx) || isAuthOnlyMigration(ctx)) return;
			return import("./apply-DDOi8uNx.mjs").then(({ prepareTargetCodexAppServer }) => prepareTargetCodexAppServer(ctx));
		},
		async apply(ctx, plan) {
			const { applyCodexMigrationPlan } = await import("./apply-DDOi8uNx.mjs");
			return await applyCodexMigrationPlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
//#endregion
export { buildCodexMigrationProvider as t };
