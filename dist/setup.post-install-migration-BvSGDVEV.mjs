import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { p as readMigrationConfigPatchDetails, y as writeMigrationConfigPath } from "./migration-Cf1WpRKe.mjs";
//#region src/wizard/setup.post-install-migration.ts
async function resolveCandidates(params) {
	const [{ resolveManifestContractRuntimePluginResolution }, { createMigrationLogger }, { resolveStateDir }] = await Promise.all([
		import("./manifest-contract-runtime-CcPXukfa.mjs"),
		import("./context-CA85mQ-Z.mjs"),
		import("./paths-DrzAhjmf.mjs")
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
	return `${candidate.provider.label}${candidate.source ? ` at ${candidate.source}` : ""}`;
}
function logMigrationHint(runtime, candidate) {
	const command = formatCliCommand(`openclaw migrate ${candidate.provider.id} --dry-run`);
	runtime.log(`Detected ${describeCandidate(candidate)}. Preview migration with ${command}.`);
}
function applyMigrationConfigPatches(config, result) {
	let nextConfig = config;
	for (const item of result?.items ?? []) {
		if (item?.kind !== "config" || item.action !== "merge" || item.status !== "migrated") continue;
		const patch = readMigrationConfigPatchDetails(item);
		if (!patch) continue;
		if (nextConfig === config) nextConfig = structuredClone(config);
		writeMigrationConfigPath(nextConfig, patch.path, patch.value);
	}
	return nextConfig;
}
/** Offers migration for newly installed plugins; the migrate command owns import consent. */
async function offerPostInstallMigrations(params) {
	if (params.installedPluginIds.length === 0) return { config: params.config };
	const { withPluginMigrationProviders } = await import("./migration-provider-runtime-CgqmeCrS.mjs");
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
				import("./migrate-DbSkU2no.mjs"),
				import("./context-CA85mQ-Z.mjs"),
				import("./paths-DrzAhjmf.mjs")
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
				const { withMigrationProvider } = await import("./providers-Cd8BjQx_.mjs");
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
