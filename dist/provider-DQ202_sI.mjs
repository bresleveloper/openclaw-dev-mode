import { i as hasClaudeSource, r as discoverClaudeSource } from "./source-RI5Nk4Ux.mjs";
import { t as buildClaudePlan } from "./plan-DaPMeQLs.mjs";
import { t as applyClaudePlan } from "./apply-C0tiHxS5.mjs";
//#region extensions/migrate-claude/provider.ts
function buildClaudeMigrationProvider(params = {}) {
	return {
		id: "claude",
		label: "Claude",
		description: "Import Claude Code auto-memory, instructions, MCP servers, and skills.",
		supportedItemKinds: ["memory"],
		async detect(ctx) {
			const source = await discoverClaudeSource(ctx.source);
			const found = ctx.itemKinds?.length === 1 && ctx.itemKinds[0] === "memory" ? source.autoMemorySources.length > 0 : hasClaudeSource(source);
			return {
				found,
				source: source.root,
				label: "Claude",
				confidence: found ? source.confidence : "low",
				message: found ? "Claude state found." : "Claude state not found."
			};
		},
		plan: buildClaudePlan,
		async apply(ctx, plan) {
			return await applyClaudePlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
//#endregion
export { buildClaudeMigrationProvider as t };
