import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { i as stripAnsi } from "./ansi-BeFJ0Uu7.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BquD107I.mjs";
import { n as isUnavailableClawHubTarget } from "./clawhub-error-codes-DV-j2dZ7.mjs";
import { n as isUnavailableNpmTarget } from "./install-types-auyGAGw8.mjs";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-BSDrXrxO.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-R7__5hE9.mjs";
import { A as resolvePluginInstallSources, C as NpmChannelResolutionError, D as resolveClawHubInstallSpecsForUpdateChannel, E as isUnavailablePluginSource, T as installWithSourceFallback, k as resolveNpmInstallSpecsForUpdateChannel, w as installWithChannelFallback } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { o as clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-DF-H95Vb.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { t as buildNpmResolutionFields } from "./install-source-utils-CQUKARYZ.mjs";
import { c as recordPluginInstall } from "./installed-plugin-index-records-VCj98mZ6.mjs";
import "./with-timeout-BMv4tv7r.mjs";
import { a as installPluginFromNpmPackArchive, r as installPluginFromNpmSpec } from "./install-sQYFwgWM.mjs";
import { a as resolveBundledPluginSources, n as findBundledPluginSourceInMap } from "./bundled-sources-fjtOrSJ6.mjs";
import { r as prepareManagedPluginArtifactConsentHandler, t as capturePluginCapabilityConsentHandlerErrors } from "./capability-consent-Bs3_uw8H.mjs";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.mjs";
import { t as invalidatePluginRuntimeDiscoveryAfterConfigMutation } from "./registry-refresh-jgowtM4M.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-CGgxPHve.mjs";
import { n as resolveBundledInstallPlanForCatalogEntry } from "./install-source-plan-CNvHqDKn.mjs";
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
	if (params.autoConfirmSingleSource && options.length === 1) return options[0].value;
	options.push({
		value: "skip",
		label: t("common.skipForNow")
	});
	const initialValue = [
		params.defaultChoice,
		"clawhub",
		"npm",
		"local",
		"skip"
	].find((choice) => options.some((option) => option.value === choice));
	return await params.prompter.select({
		message: t("wizard.plugins.installPluginPrompt", { plugin: safeLabel }),
		options,
		initialValue
	});
}
function formatPluginInstallTimedOutNote(spec) {
	return [t("wizard.plugins.installTimedOut", {
		spec,
		duration: t("common.minutes", { count: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS / 6e4 })
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
async function finishOnboardingPluginInstall(params) {
	const enableResult = enableExplicitlySelectedPluginInConfig(params.cfg, params.pluginId);
	if (!enableResult.enabled) {
		const safeLabel = sanitizeTerminalText(params.label);
		const reason = enableResult.reason ?? "plugin disabled";
		await params.prompter.note(t("wizard.plugins.enableFailed", {
			plugin: safeLabel,
			reason
		}), t("wizard.plugins.installTitle"));
		params.runtime.error?.(`Plugin install failed: ${sanitizeTerminalText(params.pluginId)} is disabled (${reason}).`);
		return incompletePluginInstall(enableResult.config, params.pluginId, "failed");
	}
	const cfg = params.install ? recordPluginInstall(enableResult.config, params.install) : await params.prepareConfig?.(enableResult.config) ?? enableResult.config;
	clearLoadInstalledPluginIndexInstallRecordsCache();
	clearPluginMetadataLifecycleCaches();
	await invalidatePluginRuntimeDiscoveryAfterConfigMutation({ logger: { warn: (message) => params.runtime.log(message) } });
	return {
		cfg,
		installed: true,
		pluginId: params.pluginId,
		status: "installed"
	};
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
function startPluginInstallProgress(prompter, safeLabel) {
	const progress = prompter.progress(t("wizard.plugins.installingPlugin", { plugin: safeLabel }));
	progress.update(t("wizard.plugins.preparingInstall"));
	return {
		progress,
		updateProgress: (message) => {
			const sanitized = sanitizeTerminalText(message).trim();
			if (sanitized) progress.update(sanitized);
		}
	};
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
	const { progress, updateProgress } = startPluginInstallProgress(params.prompter, safeLabel);
	try {
		const result = await runInstallWatchdog((signal) => params.install({
			info: updateProgress,
			warn: (message) => {
				updateProgress(message);
				logInstallWarningWithSpacing(params.runtime, message);
			}
		}, signal, capabilityConsent.onBeforePluginArtifactCommit));
		progress.stop(t(result.ok ? "wizard.plugins.installedPlugin" : "wizard.plugins.installFailedShort", { plugin: safeLabel }));
		consent.rethrowCallbackError();
		return {
			status: "completed",
			result,
			capabilityConsent
		};
	} catch (error) {
		progress.stop(t(isTimeoutError(error) ? "wizard.plugins.installTimedOutShort" : "wizard.plugins.installFailedShort", { plugin: safeLabel }));
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
async function installPluginFromNpmWithProgress(params) {
	const { source } = params;
	return await runOnboardingPluginInstallWithProgress({
		...params,
		spec: source.kind === "npm" ? source.spec : `npm-pack:${source.archivePath}`,
		install: (logger, signal, onBeforePluginArtifactCommit) => {
			const options = {
				config: params.cfg,
				timeoutMs: ONBOARDING_PLUGIN_INSTALL_TIMEOUT_MS,
				expectedPluginId: params.entry.pluginId,
				expectedIntegrity: params.entry.install.expectedIntegrity,
				extensionsDir: resolveDefaultPluginExtensionsDir(),
				logger,
				signal,
				onBeforePluginArtifactCommit
			};
			return source.kind === "npm-pack" ? installPluginFromNpmPackArchive({
				...options,
				archivePath: source.archivePath
			}) : installPluginFromNpmSpec({
				...options,
				spec: source.spec,
				mode: "update",
				...params.trustedSourceLinkedOfficialInstall ?? params.entry.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {}
			});
		},
		rethrowUnexpectedErrors: source.kind === "npm-pack"
	});
}
async function installPluginFromOverride(params) {
	const { entry, prompter, runtime } = params;
	runtime.log?.(`Using plugin install override for ${sanitizeTerminalText(entry.pluginId)} from ${PLUGIN_INSTALL_OVERRIDES_ENV} (${ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV}=1).`);
	const installOutcome = await installPluginFromNpmWithProgress({
		...params,
		source: params.override,
		trustedSourceLinkedOfficialInstall: false
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
	const install = {
		pluginId: result.pluginId,
		source: "npm",
		spec: params.override.kind === "npm-pack" ? result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId : params.override.spec,
		...params.override.kind === "npm-pack" ? { sourcePath: params.override.archivePath } : {},
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionFields(result.npmResolution),
		...params.override.kind === "npm-pack" ? {
			artifactKind: "npm-pack",
			artifactFormat: "tgz",
			...result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {},
			...result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {},
			...npmTarballName ? { npmTarballName } : {}
		} : {}
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
	const { progress, updateProgress } = startPluginInstallProgress(params.prompter, safeLabel);
	let renderedTrustWarning = false;
	const renderTrustWarning = (message) => {
		logInstallWarningWithLineBreaks(params.runtime, message);
		renderedTrustWarning = true;
	};
	try {
		const { installPluginFromClawHub } = await import("./clawhub-Bz1BLyz6.mjs");
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
		const failureWarning = !result.ok && "warning" in result ? result.warning : void 0;
		if (failureWarning && !renderedTrustWarning) {
			progress.stop("Review ClawHub warning");
			renderTrustWarning(failureWarning);
		}
		progress.stop(t(result.ok ? "wizard.plugins.installedPlugin" : "wizard.plugins.installFailedShort", { plugin: safeLabel }));
		consent.rethrowCallbackError();
		return {
			result,
			capabilityConsent
		};
	} catch (error) {
		progress.stop(t("wizard.plugins.installFailedShort", { plugin: safeLabel }));
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
			...params,
			override: installOverride,
			onCapabilityConsent
		}));
	}
	const allowLocal = hasGitWorkspace(workspaceDir);
	const bundledLocalPath = resolveBundledLocalPath({
		entry,
		workspaceDir
	});
	const localPath = bundledLocalPath ?? resolveLocalPath({
		entry,
		workspaceDir,
		allowLocal
	});
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
		const installLocal = (selectedPath) => installLocalOnboardingPlugin({
			...params,
			localPath: selectedPath,
			bundledLocalPath,
			npmSpec,
			onCapabilityConsent
		});
		if (choice === "local" && localPath) return await installLocal(localPath);
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
							...params,
							entry: attemptEntry,
							clawhubSpec: spec,
							onCapabilityConsent
						})
					} : await installPluginFromNpmWithProgress({
						...params,
						entry: attemptEntry,
						source: {
							kind: "npm",
							spec
						},
						onCapabilityConsent
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
				...buildNpmResolutionFields(result.npmResolution)
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
			})) return await installLocal(localPath);
		}
		runtime.error?.(`Plugin install failed: ${summarizeInstallError(result.error)}`);
		return incompletePluginInstall(next, entry.pluginId, "failed", formatInstallErrorDetail(result.error));
	});
}
//#endregion
export { ensureOnboardingPluginInstalled as t };
