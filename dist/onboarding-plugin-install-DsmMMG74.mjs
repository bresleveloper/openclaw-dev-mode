import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DnOgVB7K.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { A as resolvePluginInstallSources, C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, E as isUnavailablePluginSource, T as installWithSourceFallback, k as resolveNpmInstallSpecsForUpdateChannel, w as installWithChannelFallback } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { n as isUnavailableClawHubTarget } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget } from "./install-types-auyGAGw8.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-35XtW1Wg.mjs";
import { s as buildNpmResolutionInstallFields, u as recordPluginInstall } from "./installed-plugin-index-records-Clh203og.mjs";
import "./with-timeout-DI2A0gT4.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { i as installPluginFromNpmPackArchive, r as installPluginFromNpmSpec } from "./install-Bt8Oq4jr.mjs";
import { a as resolveBundledPluginSources, n as findBundledPluginSourceInMap } from "./bundled-sources-Bi9l5Ik4.mjs";
import { r as prepareManagedPluginArtifactConsentHandler, t as capturePluginCapabilityConsentHandlerErrors } from "./capability-consent-Fw4XtIv4.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as invalidatePluginRuntimeDiscoveryAfterConfigMutation } from "./registry-refresh-B0PJDNFd.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-BNYfhiBg.mjs";
import { n as resolveBundledInstallPlanForCatalogEntry } from "./install-source-plan-BTzTQSz5.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/install-overrides.ts
/** Env var containing JSON plugin install override specs. */
const PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_PLUGIN_INSTALL_OVERRIDES";
/** Env var gate that must be enabled before install overrides are honored. */
const ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_ALLOW_PLUGIN_INSTALL_OVERRIDES";
function overrideAllowed(env) {
	return env[ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV]?.trim() === "1";
}
function parseOverrideSpec(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (trimmed.startsWith("npm:")) {
		const spec = trimmed.slice(4).trim();
		return spec && parseRegistryNpmSpec(spec) ? {
			kind: "npm",
			spec
		} : null;
	}
	if (trimmed.startsWith("npm-pack:")) {
		const rawPath = trimmed.slice(9).trim();
		if (!rawPath) return null;
		return {
			kind: "npm-pack",
			archivePath: path.resolve(resolveUserPath(rawPath))
		};
	}
	return null;
}
/** Resolves a gated plugin install override from environment configuration. */
function resolvePluginInstallOverride(params) {
	const env = params.env ?? process.env;
	if (!overrideAllowed(env)) return null;
	const raw = env[PLUGIN_INSTALL_OVERRIDES_ENV]?.trim();
	if (!raw) return null;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!isRecord(parsed)) return null;
	const value = parsed[params.pluginId];
	return typeof value === "string" ? parseOverrideSpec(value) : null;
}
//#endregion
//#region src/commands/onboarding-plugin-install.ts
/**
* Onboarding plugin installation flow.
*
* It selects local, ClawHub, npm, or override install sources; records durable
* install metadata; and enables plugins requested by setup workflows.
*/
const ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS = 3e5;
const ONBOARDING_PLUGIN_INSTALL_WATCHDOG_TIMEOUT_MS = 305e3;
function incompletePluginInstall(cfg, pluginId, status, error) {
	return {
		cfg,
		installed: false,
		pluginId,
		status,
		...error === void 0 ? {} : { error }
	};
}
async function markOnboardingPluginInstalled(params) {
	clearLoadInstalledPluginIndexInstallRecordsCache();
	clearPluginMetadataLifecycleCaches();
	await invalidatePluginRuntimeDiscoveryAfterConfigMutation({ logger: { warn: (message) => params.runtime.log(message) } });
	return {
		cfg: params.cfg,
		installed: true,
		pluginId: params.pluginId,
		status: "installed"
	};
}
function readInstallFailureWarning(result) {
	if (result.ok || !("warning" in result) || typeof result.warning !== "string") return;
	return result.warning;
}
function resolveRealDirectory(dir) {
	try {
		const resolved = fs.realpathSync(dir);
		return fs.statSync(resolved).isDirectory() ? resolved : null;
	} catch {
		return null;
	}
}
function resolveGitDirectoryMarker(dir) {
	const marker = path.join(dir, ".git");
	try {
		const stat = fs.statSync(marker);
		if (stat.isDirectory()) return resolveRealDirectory(marker);
		if (!stat.isFile()) return null;
		const content = fs.readFileSync(marker, "utf8").trim();
		const match = /^gitdir:\s*(.+)$/i.exec(content);
		if (!match) return null;
		const gitDir = match[1]?.trim();
		if (!gitDir) return null;
		return resolveRealDirectory(path.isAbsolute(gitDir) ? gitDir : path.resolve(dir, gitDir));
	} catch {
		return null;
	}
}
function hasTrustedGitWorkspace(root) {
	const realRoot = resolveRealDirectory(root);
	if (!realRoot) return false;
	for (let dir = realRoot;; dir = path.dirname(dir)) {
		if (resolveGitDirectoryMarker(dir)) return true;
		if (path.dirname(dir) === dir) return false;
	}
}
function hasGitWorkspace(workspaceDir) {
	const roots = [process.cwd()];
	if (workspaceDir && workspaceDir !== process.cwd()) roots.push(workspaceDir);
	return roots.some((root) => hasTrustedGitWorkspace(root));
}
function addPluginLoadPath(cfg, pluginPath) {
	const existing = cfg.plugins?.load?.paths ?? [];
	const merged = uniqueStrings([...existing, pluginPath]);
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			load: {
				...cfg.plugins?.load,
				paths: merged
			}
		}
	};
}
function pathsReferToSameDirectory(left, right) {
	if (!left || !right) return false;
	const realLeft = resolveRealDirectory(left);
	const realRight = resolveRealDirectory(right);
	return Boolean(realLeft && realRight && realLeft === realRight);
}
function formatPortableLocalPath(localPath, workspaceDir) {
	const bases = [workspaceDir, process.cwd()].filter((entry) => Boolean(entry));
	for (const base of bases) {
		const realBase = resolveRealDirectory(base);
		if (!realBase) continue;
		if (isPathInside(realBase, localPath)) {
			const portable = path.relative(realBase, localPath).split(path.sep).join("/");
			return portable ? `./${portable}` : ".";
		}
	}
}
function resolveLocalPath(params) {
	if (!params.allowLocal) return null;
	const raw = params.entry.install.localPath?.trim();
	if (!raw) return null;
	const candidates = /* @__PURE__ */ new Set();
	const bases = [process.cwd()];
	if (params.workspaceDir && params.workspaceDir !== process.cwd()) bases.push(params.workspaceDir);
	for (const base of bases) {
		const realBase = resolveRealDirectory(base);
		if (!realBase) continue;
		candidates.add(path.resolve(realBase, raw));
	}
	for (const candidate of candidates) try {
		const resolved = fs.realpathSync(candidate);
		if (!bases.some((base) => {
			const realBase = resolveRealDirectory(base);
			return realBase ? isPathInside(realBase, resolved) : false;
		})) continue;
		if (fs.statSync(resolved).isDirectory()) return resolved;
	} catch {
		continue;
	}
	return null;
}
function resolveBundledLocalPath(params) {
	const bundledSources = resolveBundledPluginSources({ workspaceDir: params.workspaceDir });
	const npmSpec = params.entry.install.npmSpec?.trim();
	if (npmSpec) return resolveBundledInstallPlanForCatalogEntry({
		pluginId: params.entry.pluginId,
		npmSpec,
		findBundledSource: (lookup) => findBundledPluginSourceInMap({
			bundled: bundledSources,
			lookup
		})
	})?.bundledSource.localPath ?? null;
	return findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "pluginId",
			value: params.entry.pluginId
		}
	})?.localPath ?? null;
}
function resolveNpmSpecForOnboarding(install) {
	const npmSpec = install.npmSpec?.trim();
	if (!npmSpec) return null;
	return parseRegistryNpmSpec(npmSpec) ? npmSpec : null;
}
function resolveClawHubSpecForOnboarding(install) {
	const clawhubSpec = install.clawhubSpec?.trim();
	if (!clawhubSpec) return null;
	return parseClawHubPluginSpec(clawhubSpec) ? clawhubSpec : null;
}
function resolveInstallDefaultChoice(params) {
	const { cfg, entry, localPath, bundledLocalPath, hasClawHubSpec, hasNpmSpec } = params;
	const hasRemoteSpec = hasClawHubSpec || hasNpmSpec;
	const entryDefault = entry.install.defaultChoice;
	const remoteDefault = () => resolvePluginInstallSources(entry.install)[0]?.source ?? "skip";
	if (!hasRemoteSpec) return localPath ? "local" : "skip";
	if (!localPath) return remoteDefault();
	if (bundledLocalPath) return "local";
	const updateChannel = cfg.update?.channel;
	if (updateChannel === "dev") return "local";
	if (updateChannel === "stable" || updateChannel === "extended-stable" || updateChannel === "beta") return remoteDefault();
	if (entryDefault === "local") return "local";
	return remoteDefault();
}
async function promptInstallChoice(params) {
	const rawClawHubSpec = resolveClawHubSpecForOnboarding(params.entry.install);
	const rawNpmSpec = resolveNpmSpecForOnboarding(params.entry.install);
	const clawhubSpec = params.bundledLocalPath ? null : params.effectiveClawHubSpec ?? rawClawHubSpec;
	const npmSpec = params.bundledLocalPath ? null : params.effectiveNpmSpec ?? rawNpmSpec;
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const safeClawHubSpec = clawhubSpec ? sanitizeTerminalText(clawhubSpec) : null;
	const safeNpmSpec = npmSpec ? sanitizeTerminalText(npmSpec) : null;
	const safeLocalPath = params.localPath ? sanitizeTerminalText(params.localPath) : null;
	const options = [];
	if (safeNpmSpec) options.push({
		value: "npm",
		label: t("wizard.plugins.downloadFromNpm", { spec: safeNpmSpec })
	});
	if (safeClawHubSpec) options.push({
		value: "clawhub",
		label: t("wizard.plugins.downloadFromClawHub", { spec: safeClawHubSpec })
	});
	if (params.localPath) options.push({
		value: "local",
		label: t("wizard.plugins.useLocalPluginPath"),
		...safeLocalPath ? { hint: safeLocalPath } : {}
	});
	if (params.autoConfirmSingleSource) {
		const realSources = [];
		if (safeClawHubSpec) realSources.push("clawhub");
		if (safeNpmSpec) realSources.push("npm");
		if (params.localPath) realSources.push("local");
		if (realSources.length === 1) return expectDefined(realSources[0], "real sources entry at 0");
	}
	options.push({
		value: "skip",
		label: t("common.skipForNow")
	});
	const initialValue = params.defaultChoice === "local" && !params.localPath ? clawhubSpec ? "clawhub" : npmSpec ? "npm" : "skip" : params.defaultChoice === "clawhub" && !clawhubSpec ? npmSpec ? "npm" : params.localPath ? "local" : "skip" : params.defaultChoice === "npm" && !npmSpec ? clawhubSpec ? "clawhub" : params.localPath ? "local" : "skip" : params.defaultChoice;
	return await params.prompter.select({
		message: t("wizard.plugins.installPluginPrompt", { plugin: safeLabel }),
		options,
		initialValue
	});
}
function formatDurationLabel(timeoutMs) {
	if (timeoutMs % 6e4 === 0) {
		const minutes = timeoutMs / 6e4;
		return t(minutes === 1 ? "common.minute" : "common.minutes", { count: minutes });
	}
	const seconds = Math.round(timeoutMs / 1e3);
	return t(seconds === 1 ? "common.second" : "common.seconds", { count: seconds });
}
function formatPluginInstallProgress(label) {
	return t("wizard.plugins.installingPlugin", { plugin: label });
}
function formatPluginInstalled(label) {
	return t("wizard.plugins.installedPlugin", { plugin: label });
}
function formatPluginInstallFailed(label) {
	return t("wizard.plugins.installFailedShort", { plugin: label });
}
function formatPluginInstallTimedOut(label) {
	return t("wizard.plugins.installTimedOutShort", { plugin: label });
}
function formatPluginInstallTimedOutNote(spec) {
	return [t("wizard.plugins.installTimedOut", {
		spec,
		duration: formatDurationLabel(ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS)
	}), t("wizard.plugins.returningToSelection")].join("\n");
}
function summarizeInstallError(message) {
	const cleaned = sanitizeTerminalText(message).replace(/^Install failed(?:\s*\([^)]*\))?\s*:?\s*/i, "").trim();
	if (!cleaned) return "Unknown install failure";
	return cleaned.length > 180 ? `${truncateUtf16Safe(cleaned, 179)}…` : cleaned;
}
const ONBOARDING_PLUGIN_INSTALL_ERROR_MAX_CHARS = 12e3;
function formatInstallErrorDetail(message) {
	const cleaned = message.replace(/\r\n?/g, "\n").split("\n").map((line) => sanitizeTerminalText(line)).join("\n").trim();
	if (cleaned.length <= ONBOARDING_PLUGIN_INSTALL_ERROR_MAX_CHARS) return cleaned;
	return `${truncateUtf16Safe(cleaned, 11969).trimEnd()}
… (installer output truncated)`;
}
async function notePluginInstallFailure(prompter, spec, error) {
	await prompter.note([t("wizard.plugins.installFailed", {
		spec: sanitizeTerminalText(spec),
		error: summarizeInstallError(error)
	}), t("wizard.plugins.returningToSelection")].join("\n"), t("wizard.plugins.installTitle"));
}
function isTimeoutError(error) {
	return error instanceof Error && error.message === "timeout";
}
async function applyPluginEnablement(params) {
	const enableResult = enableExplicitlySelectedPluginInConfig(params.cfg, params.pluginId);
	if (enableResult.enabled) return enableResult;
	const safeLabel = sanitizeTerminalText(params.label);
	const reason = enableResult.reason ?? "plugin disabled";
	await params.prompter.note(t("wizard.plugins.enableFailed", {
		plugin: safeLabel,
		reason
	}), t("wizard.plugins.installTitle"));
	params.runtime.error?.(`Plugin install failed: ${sanitizeTerminalText(params.pluginId)} is disabled (${reason}).`);
	return enableResult;
}
async function finishOnboardingPluginInstall(params) {
	const enableResult = await applyPluginEnablement(params);
	if (!enableResult.enabled) return incompletePluginInstall(enableResult.config, params.pluginId, "failed");
	return await markOnboardingPluginInstalled({
		cfg: params.install ? recordPluginInstall(enableResult.config, params.install) : await params.prepareConfig?.(enableResult.config) ?? enableResult.config,
		pluginId: params.pluginId,
		runtime: params.runtime
	});
}
async function installLocalOnboardingPlugin(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	try {
		return await finishOnboardingPluginInstall({
			cfg: params.cfg,
			pluginId: params.entry.pluginId,
			label: params.entry.label,
			prompter: params.prompter,
			runtime: params.runtime,
			prepareConfig: async (cfg) => {
				if (pathsReferToSameDirectory(params.localPath, params.bundledLocalPath)) return cfg;
				const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
					config: params.cfg,
					source: "path",
					spec: params.npmSpec ?? params.localPath,
					onCapabilityConsent: consent.onCapabilityConsent,
					beforePersistentEffect: params.beforePersistentEffect
				});
				await capabilityConsent.onBeforePluginArtifactCommit({
					pluginId: params.entry.pluginId,
					stagedArtifactDir: params.localPath,
					mode: "install"
				});
				const sourcePath = formatPortableLocalPath(params.localPath, params.workspaceDir);
				return recordPluginInstall(addPluginLoadPath(cfg, params.localPath), capabilityConsent.applyAcceptedSurface(params.entry.pluginId, {
					pluginId: params.entry.pluginId,
					source: "path",
					installPath: params.localPath,
					...sourcePath ? { sourcePath } : {},
					...params.npmSpec ? { spec: params.npmSpec } : {}
				}));
			}
		});
	} catch (error) {
		consent.rethrowCallbackError();
		const detail = error instanceof Error ? error.message : String(error);
		await notePluginInstallFailure(params.prompter, params.localPath, detail);
		return incompletePluginInstall(params.cfg, params.entry.pluginId, "failed", formatInstallErrorDetail(detail));
	}
}
function logInstallWarningWithSpacing(runtime, message) {
	const sanitized = sanitizeTerminalText(message).trim();
	if (!sanitized) return;
	runtime.log?.(`${sanitized}\n`);
}
function logInstallWarningWithLineBreaks(runtime, message) {
	const sanitized = message.split("\n").map((line) => sanitizeTerminalText(line)).join("\n").trim();
	if (!sanitized) return;
	runtime.log?.(`${sanitized}\n`);
}
function isReviewRequiredClawHubTrustWarning(message) {
	return stripAnsi(message).startsWith("Warning\n");
}
function isClawHubTrustWarning(message) {
	const plain = stripAnsi(message);
	return isReviewRequiredClawHubTrustWarning(message) || plain.startsWith("Blocked\n") || plain.startsWith("Review\n");
}
async function runInstallWatchdog(install) {
	const controller = new AbortController();
	const ownedInstallPromise = install(controller.signal);
	try {
		return await withTimeout(ownedInstallPromise, ONBOARDING_PLUGIN_INSTALL_WATCHDOG_TIMEOUT_MS);
	} catch (error) {
		if (isTimeoutError(error)) {
			controller.abort();
			await ownedInstallPromise.catch(() => void 0);
		}
		throw error;
	}
}
async function runOnboardingPluginInstallWithProgress(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
		config: params.cfg,
		source: "npm",
		spec: params.spec,
		expectedIntegrity: params.entry.install.expectedIntegrity,
		onCapabilityConsent: consent.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const progress = params.prompter.progress(formatPluginInstallProgress(safeLabel));
	progress.update(t("wizard.plugins.preparingInstall"));
	const updateProgress = (message) => {
		const sanitized = sanitizeTerminalText(message).trim();
		if (!sanitized) return;
		progress.update(sanitized);
	};
	try {
		const result = await runInstallWatchdog((signal) => params.install({
			info: updateProgress,
			warn: (message) => {
				updateProgress(message);
				logInstallWarningWithSpacing(params.runtime, message);
			}
		}, signal, capabilityConsent.onBeforePluginArtifactCommit));
		progress.stop(result.ok ? formatPluginInstalled(safeLabel) : formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		return {
			status: "completed",
			result,
			capabilityConsent
		};
	} catch (error) {
		progress.stop(isTimeoutError(error) ? formatPluginInstallTimedOut(safeLabel) : formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		if (isTimeoutError(error)) return { status: "timed_out" };
		if (params.rethrowUnexpectedErrors && !(error instanceof ManagedPluginLifecycleError)) throw error;
		return {
			status: "completed",
			capabilityConsent,
			result: {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			}
		};
	}
}
async function installPluginFromNpmSpecWithProgress(params) {
	return await runOnboardingPluginInstallWithProgress({
		...params,
		spec: params.npmSpec,
		install: (logger, signal, onBeforePluginArtifactCommit) => installPluginFromNpmSpec({
			spec: params.npmSpec,
			mode: "update",
			config: params.cfg,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			expectedPluginId: params.entry.pluginId,
			expectedIntegrity: params.entry.install.expectedIntegrity,
			...params.trustedSourceLinkedOfficialInstall ?? params.entry.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			logger,
			signal,
			onBeforePluginArtifactCommit
		})
	});
}
async function installPluginFromNpmPackArchiveWithProgress(params) {
	return await runOnboardingPluginInstallWithProgress({
		...params,
		spec: `npm-pack:${params.archivePath}`,
		install: (logger, signal, onBeforePluginArtifactCommit) => installPluginFromNpmPackArchive({
			archivePath: params.archivePath,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			config: params.cfg,
			expectedPluginId: params.entry.pluginId,
			expectedIntegrity: params.entry.install.expectedIntegrity,
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			logger,
			signal,
			onBeforePluginArtifactCommit
		}),
		rethrowUnexpectedErrors: true
	});
}
async function installPluginFromOverride(params) {
	const { entry, prompter, runtime } = params;
	runtime.log?.(`Using plugin install override for ${sanitizeTerminalText(entry.pluginId)} from ${PLUGIN_INSTALL_OVERRIDES_ENV} (${ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV}=1).`);
	const installOutcome = params.override.kind === "npm" ? await installPluginFromNpmSpecWithProgress({
		cfg: params.cfg,
		entry,
		npmSpec: params.override.spec,
		prompter,
		runtime,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect,
		trustedSourceLinkedOfficialInstall: false
	}) : await installPluginFromNpmPackArchiveWithProgress({
		cfg: params.cfg,
		entry,
		archivePath: params.override.archivePath,
		prompter,
		runtime,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	const displaySpec = params.override.kind === "npm" ? params.override.spec : `npm-pack:${params.override.archivePath}`;
	if (installOutcome.status === "timed_out") {
		await prompter.note(formatPluginInstallTimedOutNote(sanitizeTerminalText(displaySpec)), t("wizard.plugins.installTitle"));
		runtime.error?.(`Plugin install timed out after ${ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS}ms: ${sanitizeTerminalText(displaySpec)}`);
		return incompletePluginInstall(params.cfg, entry.pluginId, "timed_out");
	}
	const { result } = installOutcome;
	if (!result.ok) {
		const errorDetail = formatInstallErrorDetail(result.error);
		await notePluginInstallFailure(prompter, displaySpec, result.error);
		runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
		return incompletePluginInstall(params.cfg, entry.pluginId, "failed", errorDetail);
	}
	const npmTarballName = params.override.kind === "npm-pack" ? result.npmTarballName : void 0;
	const install = params.override.kind === "npm-pack" ? {
		pluginId: result.pluginId,
		source: "npm",
		spec: result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId,
		sourcePath: params.override.archivePath,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionInstallFields(result.npmResolution),
		artifactKind: "npm-pack",
		artifactFormat: "tgz",
		...result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {},
		...result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {},
		...npmTarballName ? { npmTarballName } : {}
	} : {
		pluginId: result.pluginId,
		source: "npm",
		spec: params.override.spec,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionInstallFields(result.npmResolution)
	};
	return await finishOnboardingPluginInstall({
		cfg: params.cfg,
		pluginId: result.pluginId,
		label: entry.label,
		prompter,
		runtime,
		install: installOutcome.capabilityConsent.applyAcceptedSurface(result.pluginId, install)
	});
}
async function installPluginFromClawHubSpecWithProgress(params) {
	const consent = capturePluginCapabilityConsentHandlerErrors(params.onCapabilityConsent);
	const capabilityConsent = await prepareManagedPluginArtifactConsentHandler({
		config: params.cfg,
		source: "clawhub",
		spec: params.clawhubSpec,
		expectedIntegrity: params.entry.install.expectedIntegrity,
		onCapabilityConsent: consent.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	const safeLabel = sanitizeTerminalText(params.entry.label);
	const progress = params.prompter.progress(formatPluginInstallProgress(safeLabel));
	progress.update(t("wizard.plugins.preparingInstall"));
	const updateProgress = (message) => {
		const sanitized = sanitizeTerminalText(message).trim();
		if (!sanitized) return;
		progress.update(sanitized);
	};
	let renderedTrustWarning = false;
	const renderTrustWarning = (message) => {
		logInstallWarningWithLineBreaks(params.runtime, message);
		renderedTrustWarning = true;
	};
	try {
		const { installPluginFromClawHub } = await import("./clawhub-GyRmPKpR.mjs");
		const result = await installPluginFromClawHub({
			spec: params.clawhubSpec,
			expectedIntegrity: params.entry.install.expectedIntegrity,
			timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
			config: params.cfg,
			extensionsDir: resolveDefaultPluginExtensionsDir(),
			expectedPluginId: params.entry.pluginId,
			mode: "install",
			onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit,
			logger: {
				info: updateProgress,
				warn: (message) => {
					updateProgress(message);
					if (isReviewRequiredClawHubTrustWarning(message)) return;
					if (isClawHubTrustWarning(message)) {
						renderTrustWarning(message);
						return;
					}
					logInstallWarningWithSpacing(params.runtime, message);
				}
			}
		});
		const failureWarning = readInstallFailureWarning(result);
		if (failureWarning && !renderedTrustWarning) {
			progress.stop("Review ClawHub warning");
			renderTrustWarning(failureWarning);
		}
		if (result.ok) progress.stop(formatPluginInstalled(safeLabel));
		else progress.stop(formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		return {
			result,
			capabilityConsent
		};
	} catch (error) {
		progress.stop(formatPluginInstallFailed(safeLabel));
		consent.rethrowCallbackError();
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		return {
			result: {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			},
			capabilityConsent
		};
	}
}
/** Ensures an onboarding plugin is installed, enabled, and recorded in config. */
async function ensureOnboardingPluginInstalled(params) {
	const { entry, prompter, runtime, workspaceDir } = params;
	const next = params.cfg;
	const onCapabilityConsent = params.onCapabilityConsent ?? createPluginCapabilityConsentPrompter(prompter);
	const installOverride = resolvePluginInstallOverride({ pluginId: entry.pluginId });
	if (installOverride) {
		assertConfigWriteAllowedInCurrentMode();
		return await withPluginLifecycleLease({}, async () => installPluginFromOverride({
			cfg: next,
			entry,
			override: installOverride,
			prompter,
			runtime,
			onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		}));
	}
	const allowLocal = hasGitWorkspace(workspaceDir);
	const bundledLocalPath = entry.preferRemoteInstall ? null : resolveBundledLocalPath({
		entry,
		workspaceDir
	});
	const localPath = bundledLocalPath ?? (entry.preferRemoteInstall ? null : resolveLocalPath({
		entry,
		workspaceDir,
		allowLocal
	}));
	const clawhubSpec = resolveClawHubSpecForOnboarding(entry.install);
	const npmSpec = resolveNpmSpecForOnboarding(entry.install);
	const updateChannel = resolveRegistryUpdateChannel({
		configChannel: normalizeUpdateChannel(next.update?.channel),
		currentVersion: VERSION
	});
	const clawhubSpecs = clawhubSpec ? resolveClawHubInstallSpecsForUpdateChannel({
		spec: clawhubSpec,
		updateChannel,
		officialPackageName: entry.trustedSourceLinkedOfficialInstall ? parseClawHubPluginSpec(clawhubSpec)?.name : void 0,
		coreVersion: VERSION,
		versionBoundToCore: entry.versionBoundToOpenClaw
	}) : null;
	let npmSpecs;
	const clawhubInstallSpec = clawhubSpecs?.installSpec ?? clawhubSpec;
	const defaultChoice = resolveInstallDefaultChoice({
		cfg: next,
		entry,
		localPath,
		bundledLocalPath,
		hasClawHubSpec: Boolean(clawhubSpec),
		hasNpmSpec: Boolean(npmSpec)
	});
	const choice = params.promptInstall === false ? defaultChoice : await promptInstallChoice({
		entry,
		localPath,
		bundledLocalPath,
		defaultChoice,
		prompter,
		autoConfirmSingleSource: params.autoConfirmSingleSource,
		effectiveClawHubSpec: clawhubInstallSpec,
		effectiveNpmSpec: npmSpec
	});
	if (choice === "skip") return incompletePluginInstall(next, entry.pluginId, "skipped");
	assertConfigWriteAllowedInCurrentMode();
	return await withPluginLifecycleLease({}, async () => {
		if (choice === "local" && localPath) return await installLocalOnboardingPlugin({
			cfg: next,
			entry,
			localPath,
			bundledLocalPath,
			npmSpec,
			workspaceDir,
			prompter,
			runtime,
			onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		const sources = resolvePluginInstallSources(entry.install, params.promptInstall === false ? void 0 : choice === "npm" || choice === "clawhub" ? choice : void 0);
		if (sources.length === 0) return incompletePluginInstall(next, entry.pluginId, "failed", "No declared remote install source.");
		if (npmSpec && sources.some((source) => source.source === "npm")) try {
			npmSpecs = await resolveNpmInstallSpecsForUpdateChannel({
				spec: npmSpec,
				updateChannel,
				officialPackageName: entry.trustedSourceLinkedOfficialInstall ? parseRegistryNpmSpec(npmSpec)?.name : void 0,
				coreVersion: VERSION,
				versionBoundToCore: entry.versionBoundToOpenClaw
			});
		} catch (error) {
			if (!(error instanceof NpmChannelResolutionError)) throw error;
			await notePluginInstallFailure(prompter, npmSpec, error.message);
			return incompletePluginInstall(next, entry.pluginId, "failed", formatInstallErrorDetail(error.message));
		}
		const { attempt: installOutcome, source: installedSource } = await installWithSourceFallback({
			sources,
			install: async (source) => {
				const specs = source.source === "npm" ? npmSpecs : clawhubSpecs;
				const attemptEntry = {
					...entry,
					install: {
						...entry.install,
						expectedIntegrity: source.expectedIntegrity
					}
				};
				return await installWithChannelFallback({
					installSpec: specs?.installSpec ?? source.spec,
					...source.expectedIntegrity ? {} : { fallbackSpec: specs?.fallbackSpec },
					install: async (spec) => source.source === "clawhub" ? {
						status: "completed",
						...await installPluginFromClawHubSpecWithProgress({
							cfg: next,
							entry: attemptEntry,
							clawhubSpec: spec,
							prompter,
							runtime,
							onCapabilityConsent,
							beforePersistentEffect: params.beforePersistentEffect
						})
					} : await installPluginFromNpmSpecWithProgress({
						cfg: next,
						entry: attemptEntry,
						npmSpec: spec,
						prompter,
						runtime,
						onCapabilityConsent,
						beforePersistentEffect: params.beforePersistentEffect
					}),
					isRetryable: (attempt) => attempt.status === "completed" && !attempt.result.ok && (source.source === "npm" ? isUnavailableNpmTarget(attempt.result) : isUnavailableClawHubTarget(attempt.result)),
					onFallback: async (message) => {
						await prompter.note(message, t("wizard.plugins.installTitle"));
					}
				});
			},
			result: (attempt) => attempt.status === "completed" ? attempt.result : { ok: false },
			onFallback: async (message) => {
				await prompter.note(message, t("wizard.plugins.installTitle"));
			}
		});
		if (installOutcome.status === "timed_out") {
			await prompter.note(formatPluginInstallTimedOutNote(sanitizeTerminalText(installedSource.spec)), t("wizard.plugins.installTitle"));
			runtime.error?.(`Plugin install timed out after ${ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS}ms: ${sanitizeTerminalText(installedSource.spec)}`);
			return incompletePluginInstall(next, entry.pluginId, "timed_out");
		}
		const { result, capabilityConsent } = installOutcome;
		if (result.ok) {
			const spec = (installedSource.source === "npm" ? npmSpecs : clawhubSpecs)?.recordSpec ?? installedSource.spec;
			const install = "clawhub" in result ? {
				...buildClawHubPluginInstallRecordFields(result.clawhub),
				spec,
				installPath: result.targetDir
			} : {
				source: "npm",
				spec,
				installPath: result.targetDir,
				version: result.version,
				...buildNpmResolutionInstallFields(result.npmResolution)
			};
			return await finishOnboardingPluginInstall({
				cfg: next,
				pluginId: result.pluginId,
				label: entry.label,
				prompter,
				runtime,
				install: capabilityConsent.applyAcceptedSurface(result.pluginId, {
					pluginId: result.pluginId,
					...install
				})
			});
		}
		await notePluginInstallFailure(prompter, installedSource.spec, result.error);
		if (localPath && isUnavailablePluginSource(installedSource.source, result)) {
			if (await prompter.confirm({
				message: t("wizard.plugins.useLocalPluginPathInstead", { path: sanitizeTerminalText(localPath) }),
				initialValue: true
			})) return await installLocalOnboardingPlugin({
				cfg: next,
				entry,
				localPath,
				bundledLocalPath,
				npmSpec,
				workspaceDir,
				prompter,
				runtime,
				onCapabilityConsent,
				beforePersistentEffect: params.beforePersistentEffect
			});
		}
		runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
		return incompletePluginInstall(next, entry.pluginId, "failed", formatInstallErrorDetail(result.error));
	});
}
//#endregion
export { ensureOnboardingPluginInstalled as t };
