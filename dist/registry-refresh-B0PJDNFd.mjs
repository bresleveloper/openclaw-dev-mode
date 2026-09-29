import { D as withPluginCache, a as createPluginCache, p as getScopedPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as isGatewayPluginMetadataSnapshotActive } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { s as tracePluginLifecyclePhaseAsync } from "./discovery-D_5mAUI7.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { r as createManagedRuntimeEnvBase } from "./io.read-helpers-N26RjV2V.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-BQNShMey.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-BAVv9lNe.mjs";
//#region src/plugins/registry-refresh.ts
/** Refresh inventory from the committed file, including deferred runtime changes. */
async function refreshPluginRegistryAfterConfigMutation(params) {
	const owner = params.lease;
	let authorityRefusal;
	const assertAuthority = (assert) => {
		if (authorityRefusal) throw authorityRefusal.error;
		try {
			assert();
		} catch (error) {
			authorityRefusal = { error };
			throw error;
		}
	};
	const lease = owner ? {
		...owner,
		assertOwned: () => assertAuthority(() => owner.assertOwned()),
		assertOwnedInTransaction: (database) => assertAuthority(() => owner.assertOwnedInTransaction(database))
	} : void 0;
	lease?.assertOwned();
	try {
		const scoped = getScopedPluginCache();
		const cache = params.reason === "policy-changed" && hasPluginLifecycleLease() && !isGatewayPluginMetadataSnapshotActive() && scoped?.kind === "operation" ? scoped : createPluginCache();
		await withPluginCache(cache, async () => {
			const installRecords = params.installRecords ?? await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords({
				...params.env ? { env: params.env } : {},
				...lease ? { filePath: lease.databasePath } : {}
			}), { command: params.traceCommand ?? "registry-refresh" });
			lease?.assertOwned();
			await tracePluginLifecyclePhaseAsync("registry refresh", async () => {
				const snapshot = await createConfigIO({
					configPath: params.configPath,
					env: createManagedRuntimeEnvBase(params.env),
					observe: false,
					pluginValidation: "core-only"
				}).readConfigFileSnapshot();
				lease?.assertOwned();
				if (!snapshot.valid) throw new Error(`Config invalid: ${formatConfigIssueSummary(snapshot.issues)}`);
				return refreshPluginRegistry({
					config: snapshot.runtimeConfig,
					reason: params.reason,
					installRecords,
					...params.policyPluginIds ? { policyPluginIds: params.policyPluginIds } : {},
					...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
					...params.env ? { env: params.env } : {},
					...lease ? {
						filePath: lease.databasePath,
						lease
					} : {}
				});
			}, {
				command: params.traceCommand ?? "registry-refresh",
				reason: params.reason
			});
		});
	} catch (error) {
		lease?.assertOwned();
		params.logger?.warn?.(`Plugin registry refresh failed: ${formatErrorMessage(error)}`);
	}
	lease?.assertOwned();
	if (params.invalidateRuntimeCache !== false) await invalidatePluginRuntimeDiscoveryAfterConfigMutation({
		...params,
		assertCurrent: lease ? () => lease.assertOwned() : void 0
	});
}
async function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params) {
	let clearPluginRegistryLoadCache;
	try {
		({clearPluginRegistryLoadCache} = await import("./plugins/loader.js"));
	} catch (error) {
		params.assertCurrent?.();
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
		return;
	}
	params.assertCurrent?.();
	try {
		clearPluginRegistryLoadCache();
	} catch (error) {
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { refreshPluginRegistryAfterConfigMutation as n, invalidatePluginRuntimeDiscoveryAfterConfigMutation as t };
