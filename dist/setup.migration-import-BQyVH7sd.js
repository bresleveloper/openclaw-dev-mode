import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { b as resolveOfficialExternalPluginLabel, c as getOfficialExternalPluginCatalogManifest, f as listOfficialExternalPluginCatalogEntries, v as resolveOfficialExternalPluginId, y as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-Dxs5EUfF.js";
import { a as loadManifestContractSnapshot, r as listAvailableManifestContractPlugins } from "./manifest-contract-eligibility-C77NT24K.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { n as t } from "./i18n-CSQb1QYq.js";
import { t as ensureOnboardingPluginInstalled } from "./onboarding-plugin-install-igtZ5Vnq.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/wizard/setup.migration-import.ts
const MEANINGFUL_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["$schema", "meta"]);
const MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["securityAcknowledgedAt"]);
const MEANINGFUL_WORKSPACE_ENTRIES = [
	"AGENTS.md",
	"SOUL.md",
	"USER.md",
	"IDENTITY.md",
	"MEMORY.md",
	"skills"
];
const MEANINGFUL_STATE_ENTRIES = [
	"credentials",
	"sessions",
	"agents"
];
const loadMigrationProviderRuntimeModule = createLazyRuntimeModule(() => import("./migration-provider-runtime-Do5K8GAS.js"));
const loadMigrationContextModule = createLazyRuntimeModule(() => import("./context-ZHNIcmOt.js"));
const loadConfigPathsModule = createLazyRuntimeModule(() => import("./paths-C6ahtu79.js"));
async function exists(candidate) {
	try {
		await fs.access(candidate);
		return true;
	} catch {
		return false;
	}
}
async function hasDirectoryEntries(candidate) {
	try {
		return (await fs.readdir(candidate)).length > 0;
	} catch {
		return false;
	}
}
function hasMeaningfulConfig(config) {
	return Object.entries(config).some(([key, value]) => {
		if (MEANINGFUL_CONFIG_IGNORED_KEYS.has(key)) return false;
		if (key === "wizard") return hasMeaningfulWizardConfig(value);
		return true;
	});
}
function hasMeaningfulWizardConfig(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return true;
	return Object.keys(value).some((key) => !MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS.has(key));
}
async function inspectSetupMigrationFreshness(params) {
	const reasons = [];
	if (hasMeaningfulConfig(params.baseConfig)) reasons.push("existing config values are loaded");
	for (const entry of MEANINGFUL_WORKSPACE_ENTRIES) if (await exists(path.join(params.workspaceDir, entry))) reasons.push(`workspace ${entry} exists`);
	for (const entry of MEANINGFUL_STATE_ENTRIES) if (await hasDirectoryEntries(path.join(params.stateDir, entry))) reasons.push(`state ${entry}/ exists`);
	return {
		fresh: reasons.length === 0,
		reasons
	};
}
function assertFreshSetupMigrationTarget(freshness) {
	if (freshness.fresh || process.env.OPENCLAW_MIGRATION_EXISTING_IMPORT === "1") return;
	throw new Error([
		"Migration import during onboarding requires a fresh OpenClaw setup.",
		"Create a fresh setup or reset config, credentials, sessions, and workspace before importing.",
		"Backup plus overwrite/merge imports are feature-gated for now.",
		"Existing setup:",
		...freshness.reasons.map((reason) => `- ${reason}`)
	].join("\n"));
}
async function detectSetupMigrationSources(params) {
	const [{ ensureStandaloneMigrationProviderRegistryLoaded, resolvePluginMigrationProviders }, { createMigrationLogger }, { resolveStateDir }] = await Promise.all([
		loadMigrationProviderRuntimeModule(),
		loadMigrationContextModule(),
		loadConfigPathsModule()
	]);
	ensureStandaloneMigrationProviderRegistryLoaded({ cfg: params.config });
	const stateDir = resolveStateDir();
	const logger = createMigrationLogger(params.runtime);
	const detections = [];
	for (const provider of resolvePluginMigrationProviders({ cfg: params.config })) {
		if (!provider.detect) continue;
		try {
			const detection = await provider.detect({
				config: params.config,
				stateDir,
				logger
			});
			if (detection.found) detections.push({
				providerId: provider.id,
				label: detection.label ?? provider.label,
				...detection.source ? { source: detection.source } : {},
				...detection.message ? { message: detection.message } : {}
			});
		} catch (error) {
			logger.debug?.(`Migration provider ${provider.id} detection failed: ${formatErrorMessage(error)}`);
		}
	}
	return detections;
}
function resolveImportSourceDefault(params) {
	const detected = params.detections.find((detection) => detection.providerId === params.providerId);
	if (detected?.source) return detected.source;
	return params.providerId === "hermes" ? "~/.hermes" : "";
}
function resolveInstallableSetupMigrationProviders() {
	const providers = [];
	for (const catalogEntry of listOfficialExternalPluginCatalogEntries()) {
		const manifest = getOfficialExternalPluginCatalogManifest(catalogEntry);
		const pluginId = resolveOfficialExternalPluginId(catalogEntry);
		const install = resolveOfficialExternalPluginInstall(catalogEntry);
		if (!pluginId || !install) continue;
		for (const providerId of manifest?.contracts?.migrationProviders ?? []) providers.push({
			providerId,
			entry: {
				pluginId,
				label: resolveOfficialExternalPluginLabel(catalogEntry),
				install,
				trustedSourceLinkedOfficialInstall: true
			},
			...catalogEntry.description ? { description: catalogEntry.description } : {}
		});
	}
	return providers;
}
function formatMigrationProviderId(providerId) {
	return providerId.split(/[-_]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function resolveManifestMigrationProviderLabel(params) {
	return params.pluginName?.trim().replace(/\s+Migration$/i, "") || formatMigrationProviderId(params.providerId) || params.providerId;
}
function resolveManifestSetupMigrationProviders(baseConfig) {
	return listAvailableManifestContractPlugins({
		snapshot: loadManifestContractSnapshot({ config: baseConfig }),
		contract: "migrationProviders",
		config: baseConfig
	}).flatMap((plugin) => (plugin.contracts?.migrationProviders ?? []).map((providerId) => {
		const provider = {
			providerId,
			label: resolveManifestMigrationProviderLabel({
				providerId,
				pluginName: plugin.name
			})
		};
		if (plugin.description) provider.description = plugin.description;
		return provider;
	}));
}
async function listSetupMigrationOptions(params) {
	const { resolvePluginMigrationProviders } = await loadMigrationProviderRuntimeModule();
	const providers = resolvePluginMigrationProviders({ cfg: params.baseConfig });
	const options = [];
	const providerIds = /* @__PURE__ */ new Set();
	const addOption = (option) => {
		if (providerIds.has(option.providerId)) return;
		providerIds.add(option.providerId);
		options.push(option);
	};
	for (const detection of params.detections) addOption({
		providerId: detection.providerId,
		label: detection.label,
		...detection.source || detection.message ? { hint: detection.source ?? detection.message } : {}
	});
	for (const provider of providers) addOption({
		providerId: provider.id,
		label: provider.label,
		hint: provider.description ?? t("wizard.migration.sourcePathHint")
	});
	for (const provider of resolveManifestSetupMigrationProviders(params.baseConfig)) addOption({
		providerId: provider.providerId,
		label: provider.label,
		hint: provider.description ?? t("wizard.migration.sourcePathHint")
	});
	for (const provider of resolveInstallableSetupMigrationProviders()) addOption({
		providerId: provider.providerId,
		label: provider.entry.label,
		hint: provider.description ?? t("wizard.migration.sourcePathHint")
	});
	return options;
}
async function selectSetupMigrationProvider(params) {
	const options = await listSetupMigrationOptions({
		baseConfig: params.baseConfig,
		detections: params.detections
	});
	if (options.length === 0) throw new Error("No migration providers found.");
	const providerId = params.opts.importFrom?.trim() || await params.prompter.select({
		message: t("wizard.migration.source"),
		options: options.map((option) => ({
			value: option.providerId,
			label: option.label,
			...option.hint ? { hint: option.hint } : {}
		})),
		initialValue: params.detections[0]?.providerId ?? options[0]?.providerId
	});
	if (!options.some((option) => option.providerId === providerId)) throw new Error(`Unknown migration provider "${providerId}".`);
	return providerId;
}
async function resolveSetupMigrationProvider(params) {
	const { ensureStandaloneMigrationProviderRegistryLoaded, resolvePluginMigrationProvider } = await loadMigrationProviderRuntimeModule();
	ensureStandaloneMigrationProviderRegistryLoaded({
		cfg: params.baseConfig,
		providerId: params.providerId
	});
	const existing = resolvePluginMigrationProvider({
		providerId: params.providerId,
		cfg: params.baseConfig
	});
	if (existing) return {
		provider: existing,
		baseConfig: params.baseConfig
	};
	const installable = resolveInstallableSetupMigrationProviders().find((provider) => provider.providerId === params.providerId);
	if (!installable) throw new Error(`Unknown migration provider "${params.providerId}".`);
	const result = await ensureOnboardingPluginInstalled({
		cfg: params.baseConfig,
		entry: installable.entry,
		prompter: params.prompter,
		runtime: params.runtime,
		workspaceDir: params.workspaceDir,
		promptInstall: false
	});
	if (!result.installed) throw new Error(`Could not install migration provider "${params.providerId}".`);
	ensureStandaloneMigrationProviderRegistryLoaded({
		cfg: result.cfg,
		providerId: params.providerId
	});
	const provider = resolvePluginMigrationProvider({
		providerId: params.providerId,
		cfg: result.cfg
	});
	if (!provider) throw new Error(`Installed plugin did not register migration provider "${params.providerId}".`);
	return {
		provider,
		baseConfig: result.cfg
	};
}
function hasCredentialCandidate(plan) {
	return plan.items.some((item) => item.kind === "auth" || item.kind === "secret" || item.sensitive === true);
}
async function createSetupMigrationPlan(params) {
	let ctx = {
		...params.ctx,
		includeSecrets: params.importSecrets
	};
	let plan = await params.provider.plan(ctx);
	if (params.nonInteractive || params.importSecrets || !hasCredentialCandidate(plan)) return {
		ctx,
		plan
	};
	if (!await params.prompter.confirm({
		message: t("wizard.migration.includeCredentials"),
		initialValue: true
	})) return {
		ctx,
		plan
	};
	ctx = {
		...ctx,
		includeSecrets: true
	};
	plan = await params.provider.plan(ctx);
	return {
		ctx,
		plan
	};
}
async function runSetupMigrationImport(params) {
	const [{ applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig }, { createMigrationLogger, buildMigrationReportDir }, { createPreMigrationBackup }, { assertApplySucceeded, assertConflictFreePlan, formatMigrationPreview, formatMigrationResult }, { resolveStateDir }, onboardHelpers] = await Promise.all([
		import("./onboard-config-CtFjmjLn.js"),
		loadMigrationContextModule(),
		import("./apply-CkcPpX9r.js"),
		import("./output-zglRq8zH.js"),
		loadConfigPathsModule(),
		import("./onboard-helpers-C3VZoo6M.js")
	]);
	const providerId = await selectSetupMigrationProvider({
		opts: params.opts,
		baseConfig: params.baseConfig,
		detections: params.detections,
		prompter: params.prompter
	});
	const workspaceDir = resolveUserPath((params.opts.workspace ?? (params.opts.nonInteractive ? params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE : await params.prompter.text({
		message: t("wizard.migration.targetWorkspace"),
		initialValue: params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE
	}))).trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const stateDir = resolveStateDir();
	assertFreshSetupMigrationTarget(await inspectSetupMigrationFreshness({
		baseConfig: params.baseConfig,
		stateDir,
		workspaceDir
	}));
	const resolvedProvider = await resolveSetupMigrationProvider({
		providerId,
		baseConfig: params.baseConfig,
		prompter: params.prompter,
		runtime: params.runtime,
		workspaceDir
	});
	const migrationLogger = createMigrationLogger(params.runtime);
	const selectedDetections = [...params.detections];
	if (resolvedProvider.provider.detect && !selectedDetections.some((detection) => detection.providerId === providerId)) try {
		const detection = await resolvedProvider.provider.detect({
			config: resolvedProvider.baseConfig,
			stateDir,
			logger: migrationLogger
		});
		if (detection.found) selectedDetections.push({
			providerId,
			label: detection.label ?? resolvedProvider.provider.label,
			...detection.source ? { source: detection.source } : {},
			...detection.message ? { message: detection.message } : {}
		});
	} catch (error) {
		migrationLogger.debug?.(`Migration provider ${providerId} detection failed: ${formatErrorMessage(error)}`);
	}
	const sourceDefault = resolveImportSourceDefault({
		providerId,
		detections: selectedDetections
	});
	const sourceDir = params.opts.importSource?.trim() || sourceDefault || (params.opts.nonInteractive ? (() => {
		throw new Error("--import-source is required for non-interactive migration import.");
	})() : await params.prompter.text({
		message: t("wizard.migration.sourceAgentHome"),
		initialValue: providerId === "hermes" ? "~/.hermes" : void 0
	}));
	let targetConfig = applyLocalSetupWorkspaceConfig(resolvedProvider.baseConfig, workspaceDir);
	if (params.opts.skipBootstrap) targetConfig = applySkipBootstrapConfig(targetConfig);
	const initialCtx = {
		config: targetConfig,
		stateDir,
		source: sourceDir,
		overwrite: false,
		logger: migrationLogger
	};
	const { ctx, plan } = await createSetupMigrationPlan({
		provider: resolvedProvider.provider,
		ctx: initialCtx,
		importSecrets: Boolean(params.opts.importSecrets),
		nonInteractive: Boolean(params.opts.nonInteractive),
		prompter: params.prompter
	});
	await params.prompter.note(formatMigrationPreview(plan).join("\n"), t("wizard.migration.previewTitle"));
	assertConflictFreePlan(plan, providerId);
	if (!(params.opts.nonInteractive === true ? true : await params.prompter.confirm({
		message: t("wizard.migration.apply"),
		initialValue: true
	}))) throw new WizardCancelledError(t("wizard.migration.cancelled"));
	const reportDir = buildMigrationReportDir(providerId, stateDir);
	const backupPath = await createPreMigrationBackup({});
	targetConfig = onboardHelpers.applyWizardMetadata(targetConfig, {
		command: "onboard",
		mode: "local"
	});
	targetConfig = await params.commitConfigFile(targetConfig);
	const applyCtx = {
		...ctx,
		config: targetConfig,
		...backupPath ? { backupPath } : {},
		reportDir
	};
	const result = await resolvedProvider.provider.apply(applyCtx, plan);
	const withReport = {
		...result,
		...result.backupPath ?? backupPath ? { backupPath: result.backupPath ?? backupPath } : {},
		reportDir: result.reportDir ?? reportDir
	};
	assertApplySucceeded(withReport);
	await params.prompter.note(formatMigrationResult(withReport).join("\n"), t("wizard.migration.appliedTitle"));
	if (params.continueOnboarding) await params.prompter.note(t("wizard.migration.continuing"), t("wizard.migration.appliedTitle"));
	else await params.prompter.outro(t("wizard.migration.complete"));
}
//#endregion
export { runSetupMigrationImport as i, inspectSetupMigrationFreshness as n, listSetupMigrationOptions as r, detectSetupMigrationSources as t };
