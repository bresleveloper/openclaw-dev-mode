import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as isPluginSourcePathInUse } from "./installed-plugin-package-ownership-R9aCxQcY.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-Cu1pIc3h.mjs";
import { r as withConfigSourceLocks } from "./write-lock-BlX1pI0w.mjs";
import { d as readCurrentConfigForPolicyCheck } from "./io.runtime-Ds5uC0Bf.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import path from "node:path";
//#region src/plugins/source-cleanup.ts
async function withPluginSourceCleanup(sourcePath, options, run) {
	const env = options.env ?? process.env;
	const configPath = path.resolve(options.configPath);
	return await withPluginLifecycleLease(options, async (lease) => {
		const assertOwned = () => lease.assertOwned();
		assertOwned();
		const readSources = async () => {
			assertOwned();
			const { snapshot, writeOptions } = await createConfigIO({
				configPath,
				env: cloneEnvWithPlatformSemantics(env),
				observe: false,
				pluginValidation: "core-only",
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
					const config = readCurrentConfigForPolicyCheck({
						configPath,
						env
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
