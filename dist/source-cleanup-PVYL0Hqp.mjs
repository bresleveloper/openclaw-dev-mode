import { r as formatConfigIssueSummary } from "./issue-format-L1jxHK43.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { l as readDeferredPluginMigrationsAsync } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import { y as withConfigSourceLocks } from "./io.warnings-Dz_nq5SM.mjs";
import { r as isPluginSourcePathInUse } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { m as readCurrentConfigForPolicyCheckWithMigrations } from "./io.runtime-CPntde4x.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import path from "node:path";
//#region src/plugins/source-cleanup.ts
async function withPluginSourceCleanup(sourcePath, options, run) {
	const env = options.env ?? process.env;
	const configPath = path.resolve(options.configPath);
	return await withPluginLifecycleLease(options, async (lease) => {
		const assertOwned = () => lease.assertOwned();
		assertOwned();
		const deferredPluginMigrations = await readDeferredPluginMigrationsAsync({
			env,
			path: lease.databasePath
		});
		assertOwned();
		const readSources = async () => {
			assertOwned();
			const { snapshot, writeOptions } = await createConfigIO({
				configPath,
				env: cloneEnvWithPlatformSemantics(env),
				observe: false,
				pluginValidation: "core-only",
				deferredPluginMigrations,
				shellEnvFallback: "defer",
				suppressFutureVersionWarning: true,
				logger: {
					warn: () => {},
					error: () => {}
				}
			}).readConfigFileSnapshotForWrite();
			assertOwned();
			if (!snapshot.valid) throw new Error(`Cannot remove plugin source with invalid config at ${configPath}: ${formatConfigIssueSummary(snapshot.issues)}`);
			const targets = Object.entries(writeOptions.includeFileTargetsForWrite ?? {}).flat();
			const sources = new Set([
				configPath,
				resolvePathViaExistingAncestorSync(configPath),
				...targets
			].map((source) => path.resolve(source)));
			if (snapshot.includedPaths?.some((source) => !sources.has(path.resolve(source)))) throw new Error(`Cannot lock every config source for plugin cleanup at ${configPath}`);
			return [...sources].toSorted();
		};
		let sources = await readSources();
		for (;;) {
			const attempt = await withConfigSourceLocks(sources, async (assertCurrent) => {
				const currentSources = await readSources();
				assertCurrent();
				if (sources.length !== currentSources.length || sources.some((source, index) => source !== currentSources[index])) return {
					kind: "retry",
					sources: currentSources
				};
				const assertCleanup = () => {
					assertCurrent();
					const config = readCurrentConfigForPolicyCheckWithMigrations({
						configPath,
						env,
						deferredPluginMigrations
					});
					if (options.isReferenced ? options.isReferenced(config) : isPluginSourcePathInUse(sourcePath, config.plugins?.load?.paths ?? [], env)) throw new Error(`Plugin source is still referenced by config: ${sourcePath}. Remove the load-path reference and retry.`);
					assertCurrent();
				};
				assertCleanup();
				const result = await run(assertCleanup);
				assertCurrent();
				return {
					kind: "complete",
					result
				};
			}, env, assertOwned);
			if (attempt.kind === "complete") return attempt.result;
			sources = attempt.sources;
		}
	});
}
//#endregion
export { withPluginSourceCleanup as t };
