import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as visitConfigValueTree } from "./value-tree-3oLf9xok.mjs";
import path from "node:path";
//#region src/gateway/server-retained-plugin-cleanup.ts
async function cleanupGatewayRetiredPluginArtifacts(params) {
	const assertCurrent = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
	};
	assertCurrent();
	try {
		const [retention, captures, { hasPluginNativeCaptureCleanupCandidates }, paths] = await Promise.all([
			import("./managed-npm-retention-PVMXGVPh.mjs"),
			import("./plugin-source-capture-report-5WYuNoav.mjs"),
			import("./plugin-source-capture-directory-BOpx1cPQ.mjs"),
			import("./paths-DrzAhjmf.mjs")
		]);
		assertCurrent();
		const stateDir = paths.resolveStateDir();
		const candidates = await Promise.all([retention.hasRetainedManagedNpmInstallCandidates(), hasPluginNativeCaptureCleanupCandidates(stateDir)]);
		assertCurrent();
		if (!candidates.some(Boolean)) return;
		const [{ withPluginArtifactCleanupLease }, { createPluginCache, withPluginCache }, { preparePersistedInstalledPluginIndexCacheEntry }, recordsModule] = await Promise.all([
			import("./plugin-lifecycle-lease-C4DiOvV_.mjs"),
			import("./plugin-cache-B1jqWOmJ.mjs"),
			import("./installed-plugin-index-record-state-HsUpg9Pk.mjs"),
			import("./installed-plugin-index-records-BFu2LAqb.mjs")
		]);
		assertCurrent();
		await withPluginArtifactCleanupLease({
			signal: params.signal,
			assertCurrent
		}, async (assertOwned) => {
			try {
				var _usingCtx$1 = _usingCtx();
				const cache = _usingCtx$1.a(createPluginCache());
				await withPluginCache(cache, async () => {
					const installedIndex = await preparePersistedInstalledPluginIndexCacheEntry({ stateDir });
					const assertInventoryCurrent = async () => {
						await assertOwned();
						installedIndex.assertCurrent();
					};
					await assertInventoryCurrent();
					const records = await recordsModule.loadInstalledPluginIndexInstallRecords({ stateDir });
					const reclaimed = await captures.pruneUnreferencedPluginNativeCaptures(stateDir, assertInventoryCurrent, process.env, {
						startup: true,
						installedIndex
					});
					for (const warning of reclaimed.warnings) params.log.warn(warning);
					await assertInventoryCurrent();
					const configuredPaths = [];
					visitConfigValueTree([params.startupConfig, getRuntimeConfigSnapshot()], (value) => {
						if (typeof value === "string") {
							const trimmed = value.trim();
							if (path.isAbsolute(trimmed) || trimmed.startsWith("~/") || trimmed.startsWith("~\\")) configuredPaths.push(resolveUserPath(trimmed));
						}
						return true;
					});
					const removedGenerations = await retention.cleanupRetainedManagedNpmInstallGenerations({
						assertCurrent: assertInventoryCurrent,
						activeInstallPaths: [
							...params.startupInstallPaths,
							...configuredPaths,
							...Object.values(records).flatMap((record) => record.installPath ? [record.installPath] : [])
						],
						onError: (error, projectRoot) => params.log.warn(`failed to clean retained npm generation ${projectRoot}: ${String(error)}`)
					});
					if (removedGenerations > 0) params.log.info(`cleaned ${removedGenerations} retained npm plugin generation(s)`);
					if (reclaimed.removed.length > 0) params.log.info(`cleaned ${reclaimed.removed.length} retired native plugin capture(s)`);
				});
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				await _usingCtx$1.d();
			}
		});
	} catch (error) {
		assertCurrent();
		params.log.warn(`retired plugin cleanup unavailable: ${String(error)}`);
	}
}
//#endregion
export { cleanupGatewayRetiredPluginArtifacts };
