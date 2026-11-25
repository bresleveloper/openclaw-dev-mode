// extensions/codex/src/migration/scope.ts
function isOnlyMigrationKind({ itemKinds }, kind) {
	return Boolean(itemKinds?.length && itemKinds.every((itemKind) => itemKind === kind));
}
// extensions/codex/src/migration/provider.ts
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
			const { discoverCodexSource, hasCodexSource } = await import("./source-BwjwlbNp.mjs").then((n) => n.a);
			const memoryOnly = isOnlyMigrationKind(ctx, "memory");
			const authOnly = isOnlyMigrationKind(ctx, "auth");
			const source = await discoverCodexSource({
				input: ctx.source,
				memoryOnly,
				authOnly
			});
			const found = memoryOnly ? source.memoryFiles.length > 0 : authOnly ? Boolean(source.authPath) : hasCodexSource(source);
			return {
				found,
				source: source.root,
				label: "Codex",
				confidence: found ? source.confidence : "low",
				message: found ? "Codex state found." : "Codex state not found."
			};
		},
		async plan(ctx) {
			const { buildCodexMigrationPlan } = await import("./plan-B2QoCQa-.mjs");
			return buildCodexMigrationPlan(ctx);
		},
		deferredApply: { retrySafe: true },
		prepareApply(ctx) {
			if (isOnlyMigrationKind(ctx, "memory") || isOnlyMigrationKind(ctx, "auth")) return;
			return import("./apply-BDfseit6.mjs").then(({ prepareTargetCodexAppServer }) => prepareTargetCodexAppServer(ctx));
		},
		async apply(ctx, plan) {
			const { applyCodexMigrationPlan } = await import("./apply-BDfseit6.mjs");
			return await applyCodexMigrationPlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
export { isOnlyMigrationKind as n, buildCodexMigrationProvider as t };
