import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { b as writeMigrationConfigPath, p as readMigrationConfigPatchDetails } from "./migration-DepQtnwV.mjs";
//#region src/wizard/setup.post-install-migration.ts
const loadMigrationContextModule = createLazyRuntimeModule(() => import("./context-JPxPrJJO.mjs"));
const loadConfigPathsModule = createLazyRuntimeModule(() => import("./paths-bFNjVB0r.mjs"));
async function resolveCandidates(params) {
	if (params.installedPluginIds.length === 0) return [];
	const [{ resolveManifestContractRuntimePluginResolution }, { createMigrationLogger }, { resolveStateDir }] = await Promise.all([
		import("./manifest-contract-runtime-Dc324hCS.mjs"),
		loadMigrationContextModule(),
		loadConfigPathsModule()
	]);
	const installedIds = new Set(params.installedPluginIds);
	const stateDir = resolveStateDir();
	const logger = createMigrationLogger(params.runtime);
	const candidates = [];
	for (const provider of params.providers) {
		if (!provider.detect) continue;
		if (!resolveManifestContractRuntimePluginResolution({
			cfg: params.config,
			contract: "migrationProviders",
			value: provider.id
		}).pluginIds.some((pluginId) => installedIds.has(pluginId))) continue;
		try {
			const detection = await provider.detect({
				config: params.config,
				stateDir,
				logger
			});
			if (!detection.found || detection.confidence === "low") continue;
			candidates.push({
				provider,
				...detection.source ? { source: detection.source } : {}
			});
		} catch (error) {
			logger.debug?.(`Post-install migration detect for ${provider.id} failed: ${formatErrorMessage(error)}`);
		}
	}
	return candidates;
}
function describeCandidate(candidate) {
	const parts = [candidate.provider.label];
	if (candidate.source) parts.push(`at ${candidate.source}`);
	return parts.join(" ");
}
function logMigrationHint(runtime, candidate) {
	const command = formatCliCommand(`openclaw migrate ${candidate.provider.id} --dry-run`);
	runtime.log(`Detected ${describeCandidate(candidate)}. Preview migration with ${command}.`);
}
function applyMigrationConfigPatches(config, result) {
	const patches = (result?.items ?? []).filter((item) => Boolean(item && typeof item === "object" && "kind" in item && item.kind === "config" && "action" in item && item.action === "merge" && "status" in item && item.status === "migrated")).map(readMigrationConfigPatchDetails).filter((patch) => patch !== void 0);
	if (patches.length === 0) return config;
	const nextConfig = structuredClone(config);
	for (const patch of patches) writeMigrationConfigPath(nextConfig, patch.path, patch.value);
	return nextConfig;
}
/**
* Offer interactive migration for any migration provider owned by a plugin
* that was just installed during onboarding. In non-interactive mode this is
* a no-op apart from a hint line so scripted setups never mutate state
* unexpectedly. The actual migration UI (skill/plugin checkboxes, confirm
* prompt) is owned by `openclaw migrate <provider>`; this helper only owns
* the gate prompt.
*/
async function offerPostInstallMigrations(params) {
	if (params.installedPluginIds.length === 0) return { config: params.config };
	const { withPluginMigrationProviders } = await import("./migration-provider-runtime-BcoF_ay9.mjs");
	return await withPluginMigrationProviders({
		cfg: params.config,
		onCleanupError: (error) => {
			params.runtime.log(`Post-install migration result retained, but plugin cleanup failed: ${formatErrorMessage(error)}`);
		}
	}, async (providers) => await runPostInstallMigrationOffers(params, providers));
}
async function runPostInstallMigrationOffers(params, providers) {
	const candidates = await resolveCandidates({
		providers,
		config: params.config,
		runtime: params.runtime,
		installedPluginIds: params.installedPluginIds
	});
	if (candidates.length === 0) return { config: params.config };
	let nextConfig = params.config;
	const prompter = params.prompter;
	const interactive = params.nonInteractive !== true && process.stdin.isTTY && prompter !== void 0;
	for (const candidate of candidates) {
		if (!interactive || !prompter) {
			logMigrationHint(params.runtime, candidate);
			continue;
		}
		const description = describeCandidate(candidate);
		let accepted;
		try {
			await prompter.note([candidate.provider.description, "You will review import options and confirm before applying."].filter(Boolean).join("\n\n"), `${candidate.provider.label} migration`);
			accepted = await prompter.confirm({
				message: `Review migration from ${description}?`,
				initialValue: false
			});
		} catch (error) {
			params.runtime.log(`Skipping ${candidate.provider.label} migration prompt: ${formatErrorMessage(error)}`);
			logMigrationHint(params.runtime, candidate);
			continue;
		}
		if (!accepted) {
			logMigrationHint(params.runtime, candidate);
			continue;
		}
		const logFailure = (error) => {
			params.runtime.log(`${candidate.provider.label} migration failed: ${formatErrorMessage(error)}. Re-run with ${formatCliCommand(`openclaw migrate ${candidate.provider.id} --dry-run`)} to inspect.`);
		};
		let disposingPreparation = false;
		let resultRetained = false;
		try {
			const [{ migrateDefaultCommand }, { createMigrationLogger }, { resolveStateDir }] = await Promise.all([
				import("./migrate-P0e5ztmY.mjs"),
				loadMigrationContextModule(),
				loadConfigPathsModule()
			]);
			const runCommand = async (provider) => {
				let preparation;
				try {
					preparation = await provider.prepareApply?.({
						config: nextConfig,
						stateDir: resolveStateDir(),
						logger: createMigrationLogger(params.runtime),
						...candidate.source ? { source: candidate.source } : {},
						providerOptions: { configPatchMode: "return" }
					});
					const result = await migrateDefaultCommand(params.runtime, {
						provider: provider.id,
						configOverride: nextConfig,
						configPatchMode: "return",
						suppressPlanLog: true
					}, provider);
					nextConfig = applyMigrationConfigPatches(nextConfig, result);
					resultRetained = true;
				} catch (error) {
					logFailure(error);
				} finally {
					disposingPreparation = true;
					await preparation?.dispose?.();
					disposingPreparation = false;
				}
			};
			if (nextConfig === params.config) await runCommand(candidate.provider);
			else {
				const { withMigrationProvider } = await import("./providers-BCEcKv4L.mjs");
				await withMigrationProvider(candidate.provider.id, nextConfig, runCommand);
			}
		} catch (error) {
			if (disposingPreparation) throw error;
			if (resultRetained) params.runtime.log(`${candidate.provider.label} migration result retained, but plugin cleanup failed: ${formatErrorMessage(error)}`);
			else logFailure(error);
		}
	}
	return { config: nextConfig };
}
//#endregion
export { offerPostInstallMigrations };
