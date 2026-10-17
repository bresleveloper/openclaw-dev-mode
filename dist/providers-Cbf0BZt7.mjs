import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-BhPqKUXF.mjs";
import { t as buildMigrationContext } from "./context-C48TNHo-.mjs";
//#region src/commands/migrate/providers.ts
/** Borrow a selected provider for the complete consuming operation. */
async function withMigrationProvider(providerId, config, run) {
	return await withPluginMigrationProviders({
		cfg: config ?? getRuntimeConfig(),
		providerId
	}, async (providers) => {
		const provider = providers.find((entry) => entry.id === providerId);
		if (!provider) {
			const available = providers.map((entry) => entry.id);
			const suffix = available.length > 0 ? ` Available providers: ${available.join(", ")}.` : " No providers found.";
			throw new Error(`Unknown migration provider "${providerId}".${suffix}`);
		}
		return await run(provider);
	});
}
function buildMigrationProviderOptions(opts, providerId = opts.provider) {
	const options = {};
	if (providerId === "codex" && opts.verifyPluginApps === true) options.verifyPluginApps = true;
	if (providerId === "codex" && opts.configPatchMode) options.configPatchMode = opts.configPatchMode;
	return Object.keys(options).length > 0 ? options : void 0;
}
async function createMigrationPlan(runtime, opts, provider) {
	const ctx = buildMigrationContext({
		...opts,
		providerOptions: buildMigrationProviderOptions(opts),
		runtime
	});
	return await provider.plan(ctx);
}
//#endregion
export { createMigrationPlan as n, withMigrationProvider as r, buildMigrationProviderOptions as t };
