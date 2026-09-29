import { Ed as MAX_MEMORY_MIGRATION_ITEMS } from "./src-BRUl7oDv.mjs";
import { y as summarizeMigrationItems } from "./migration-DepQtnwV.mjs";
import { r as bindMemoryMigrationPlanSources } from "./memory-migration-source-CF-4phHC.mjs";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-D8yOwufs.mjs";
import { t as buildMigrationContext } from "./context-JE3AYESH.mjs";
import { t as runMigrationApply } from "./apply-BXj_pOV3.mjs";
//#region src/commands/migrate/memory-import.ts
/** Canonical memory-only migration planning and apply policy for embedded surfaces. */
const MEMORY_ITEM_KIND = "memory";
const silentRuntime = {
	log() {},
	error() {},
	exit(code) {
		throw new Error(`migration exited with ${code}`);
	}
};
async function withMemoryMigrationProviders(config, run, onCleanupError) {
	return await withPluginMigrationProviders({
		cfg: config,
		onCleanupError
	}, async (providers) => await run(providers.filter((provider) => provider.supportedItemKinds?.includes(MEMORY_ITEM_KIND))));
}
function shapeMemoryOnlyPlan(plan) {
	const items = plan.items.filter((item) => item.kind === MEMORY_ITEM_KIND);
	if (items.length > 2e3) throw new Error(`memory import found ${items.length} items; the maximum is ${MAX_MEMORY_MIGRATION_ITEMS}. Narrow or split the source memory before importing.`);
	const itemIds = /* @__PURE__ */ new Set();
	for (const item of items) {
		if (itemIds.has(item.id)) throw new Error(`duplicate memory migration item id "${item.id}"`);
		itemIds.add(item.id);
	}
	const unsupported = items.find((item) => (item.status === "planned" || item.status === "conflict") && item.action !== "copy");
	if (unsupported) throw new Error(`memory import only supports copy actions; ${unsupported.id} uses ${unsupported.action}`);
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
async function planProviderMemoryImport(params) {
	const ctx = buildMigrationContext({
		runtime: params.runtime ?? silentRuntime,
		configOverride: params.config,
		targetAgentId: params.agentId,
		itemKinds: [MEMORY_ITEM_KIND],
		overwrite: params.overwrite,
		json: true
	});
	const detection = await params.provider.detect?.(ctx);
	if (detection && !detection.found) return {
		detection,
		plan: {
			providerId: params.provider.id,
			source: detection.source ?? "",
			summary: summarizeMigrationItems([]),
			items: []
		}
	};
	return {
		detection,
		plan: await bindMemoryMigrationPlanSources(shapeMemoryOnlyPlan(await params.provider.plan(ctx)), { includeConflicts: params.overwrite === true })
	};
}
async function applyProviderMemoryImport(params) {
	return await runMigrationApply({
		runtime: params.runtime ?? silentRuntime,
		providerId: params.provider.id,
		provider: params.provider,
		onApplyCompleted: params.onApplyCompleted,
		opts: {
			yes: true,
			json: true,
			configOverride: params.config,
			targetAgentId: params.agentId,
			itemKinds: [MEMORY_ITEM_KIND],
			itemIds: params.itemIds,
			overwrite: params.overwrite,
			preflightPlan: params.preflightPlan,
			allowPartialResult: true
		}
	});
}
//#endregion
export { planProviderMemoryImport as n, withMemoryMigrationProviders as r, applyProviderMemoryImport as t };
