import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { c as tracePluginLifecyclePhaseAsync } from "./discovery-B5pUUvVG.mjs";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-0K_3TO5Q.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import { n as readInstallPolicyWarningErrorDetails } from "./install-policy-warning-error-details-D7CwLpKg.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { a as withPluginLifecycleLease, t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { d as resolveArchiveKind } from "./archive-R2ClviiB.mjs";
import { t as buildNpmResolutionFields } from "./install-source-utils-DCME3COX.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { a as resolvePackageDirInstallTransaction, i as requestDeferredPackageDirInstall } from "./install-package-dir-CWKW8ewy.mjs";
import "./install-yOBcrQp1.mjs";
import { t as findBundledPluginSource } from "./bundled-sources-CSOJ6Jwe.mjs";
import "./clawhub-cX8No04d.mjs";
import { r as resolveMarketplaceInstallShortcut } from "./marketplace-Cf6Opb2D.mjs";
import { r as promptYesNo } from "./prompt-nkSTad_s.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-DGJnxeTz.mjs";
import { n as formatNonClawHubInstallWarning, t as NON_CLAWHUB_INSTALL_FORCE_FLAG } from "./install-provenance-ClgRj4XB.mjs";
import { a as installHooksFromPath, i as installHooksFromNpmSpec, n as formatPluginInstallWithHookFallbackError, r as HOOK_INSTALL_ERROR_CODE, t as createPluginInstallLogger } from "./plugins-command-helpers-kbV3WqCK.mjs";
import { a as resolvePluginInstallSourcePlan, r as resolveBundledInstallPlanForNpmFailure } from "./install-source-plan-QA0iavYO.mjs";
import { a as resolvePluginInstallRequestContext, n as loadConfigForInstall, r as resolveFullyBlockedConfigMutationReason, t as PluginInstallConfigError } from "./install-config-DlvfxA1w.mjs";
import { t as PluginInstallPersistedError } from "./lifecycle-CvcKJfYf.mjs";
import { t as installManagedPlugin } from "./management-mutations-Dy37x8Dx.mjs";
import { t as resolveClawHubInstallConfirmation } from "./clawhub-install-confirmation-DtwZ_7ZV.mjs";
import { n as resolvePluginLifecycleGateway } from "./plugins-lifecycle-client-CV2oB0RL.mjs";
import { t as runWithLocalPluginState } from "./plugins-local-state-BVVRWaE0.mjs";
import { t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-Dx2zPtGO.mjs";
import { t as stageHookInstall } from "./install-record-transaction-BXidYQoc.mjs";
import fs from "node:fs";
//#region src/cli/non-clawhub-install-acknowledgement.ts
async function confirmNonClawHubInstall(params) {
	const warning = formatNonClawHubInstallWarning({
		sourceClass: params.sourceClass,
		spec: params.spec
	});
	if (params.acknowledged || process.stdin.isTTY && process.stdout.isTTY) {
		params.runtime.log(theme.warn(warning));
		return params.acknowledged || await promptYesNo("Install this non-ClawHub plugin source?");
	}
	params.runtime.error(`${warning}\nInstall cancelled; rerun with ${NON_CLAWHUB_INSTALL_FORCE_FLAG} after reviewing the source.`);
	return false;
}
//#endregion
//#region src/cli/plugins-install-gateway.ts
/** Keep CLI prompts local; both transports use the same public install request. */
function createGatewayPluginInstaller(gateway) {
	return async (params) => {
		if (params.request.source === "clawhub" && params.request.mode !== "update" && params.confirmInstall && !await params.confirmInstall()) throw new ManagedPluginLifecycleError("Install cancelled.", { installRejected: true });
		params.signal?.throwIfAborted();
		params.beforePersistentApply?.();
		let result;
		try {
			try {
				result = await gateway("plugins.install", params.request, params.onCapabilityConsent);
			} catch (error) {
				const details = readInstallPolicyWarningErrorDetails(error instanceof Error && "details" in error ? error.details : void 0);
				if (!details || !params.safetyOverrides?.onInstallPolicyWarning || (await params.safetyOverrides.onInstallPolicyWarning(details)).status !== "approved") throw error;
				result = await gateway("plugins.install", {
					...params.request,
					acknowledgeInstallPolicyWarning: true
				}, params.onCapabilityConsent);
			}
		} catch (error) {
			const details = error instanceof Error && "details" in error ? error.details : void 0;
			const saved = isRecord(details) ? details.persistence : void 0;
			if (isRecord(saved) && saved.operation === "install" && typeof saved.pluginId === "string") throw new PluginInstallPersistedError(saved.pluginId, error);
			if (isRecord(details) && details.pluginInstallRejected === true) {
				const source = details.pluginInstallSource;
				const installSource = isRecord(source) && (source.source === "npm" || source.source === "clawhub") && typeof source.spec === "string" ? {
					source: source.source,
					spec: source.spec,
					...typeof source.expectedIntegrity === "string" ? { expectedIntegrity: source.expectedIntegrity } : {}
				} : void 0;
				throw new ManagedPluginLifecycleError(error instanceof Error ? error.message : String(error), {
					installRejected: true,
					installSource,
					...typeof details.pluginInstallCode === "string" ? { code: details.pluginInstallCode } : {},
					cause: error
				});
			}
			throw error;
		}
		return {
			plugin: result.plugin,
			warnings: result.warnings,
			application: result.runtime
		};
	};
}
//#endregion
//#region src/cli/hook-install-persistence.ts
async function persistHookPackInstall(params) {
	const runtime = params.runtime ?? defaultRuntime;
	return await withPluginLifecycleLease({}, async (lease) => {
		const assertPersistentApply = () => {
			lease.assertOwned();
			params.snapshot.writeOptions.assertConfigPathForWrite?.();
			params.beforePersistentApply?.();
		};
		const config = params.snapshot.config;
		const entries = { ...config.hooks?.internal?.entries };
		for (const hookName of params.hooks) entries[hookName] = {
			...entries[hookName],
			enabled: true
		};
		const next = {
			...config,
			hooks: {
				...config.hooks,
				internal: {
					...config.hooks?.internal,
					enabled: true,
					entries
				}
			}
		};
		const transaction = await stageHookInstall({
			update: {
				hookId: params.hookPackId,
				hooks: params.hooks,
				...params.install
			},
			payloadTransaction: params.payloadTransaction,
			lease,
			beforePersistentApply: assertPersistentApply
		});
		try {
			await replaceConfigFile({
				nextConfig: next,
				baseHash: params.snapshot.baseHash,
				writeOptions: {
					...params.snapshot.writeOptions,
					assertConfigPathForWrite: assertPersistentApply
				}
			});
		} catch (error) {
			try {
				await transaction.rollback();
			} catch (rollbackError) {
				throw new AggregateError([error, rollbackError], "Hook install config rollback failed", { cause: rollbackError });
			}
			throw error;
		}
		await transaction.commit();
		runtime.log(params.successMessage ?? `Installed hook pack: ${params.hookPackId}`);
		runtime.log("Hook install/link config can activate immediately in hybrid mode; code-only updates and reload mode off need a Gateway restart.");
		return next;
	});
}
//#endregion
//#region src/cli/npm-resolution.ts
function resolvePinnedNpmInstallRecordForCli(rawSpec, pin, installPath, version, resolution, log, warnFormat) {
	const resolvedSpec = resolution?.resolvedSpec;
	const recordSpec = pin && resolvedSpec ? resolvedSpec : rawSpec;
	if (pin) {
		if (resolvedSpec) log(`Pinned npm install record to ${resolvedSpec}.`);
		else log(warnFormat("Could not resolve exact npm version for --pin; storing original npm spec."));
	}
	return {
		source: "npm",
		spec: recordSpec,
		installPath,
		version,
		...buildNpmResolutionFields(resolution)
	};
}
//#endregion
//#region src/cli/plugins-install-hook-fallback.ts
async function attemptHookInstall(source, params, options, assertOwned) {
	const runtime = params.runtime ?? defaultRuntime;
	const common = requestDeferredPackageDirInstall({
		...params.safetyOverrides,
		config: params.snapshot.config,
		mode: source.mode,
		logger: {
			info: (message) => runtime.log(message),
			warn: (message) => runtime.log(theme.warn(message))
		},
		...options
	}, assertOwned);
	try {
		return source.source === "local" ? await installHooksFromPath({
			...common,
			path: source.path,
			...source.link ? { dryRun: true } : {}
		}) : await installHooksFromNpmSpec({
			...common,
			spec: source.spec,
			...source.expectedIntegrity ? { expectedIntegrity: source.expectedIntegrity } : {}
		});
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
async function installHookPack(source, params, expectedPackageKind) {
	if (params.request.enable === false) return {
		ok: false,
		error: "--no-enable is only supported for plugins. Install hook packs separately with openclaw hooks install."
	};
	return await runWithLocalPluginState("install (hook fallback)", (assertCurrent) => installHookPackLocal(source, params, expectedPackageKind, assertCurrent));
}
async function installHookPackLocal(source, params, expectedPackageKind, assertCurrent) {
	return await withPluginLifecycleLease({ signal: params.signal }, async (lease) => {
		const request = resolvePluginInstallRequestContext({ rawSpec: source.source === "local" ? source.path : source.spec });
		if (!request.ok) return request;
		const snapshot = await loadConfigForInstall(request.request).catch((error) => {
			if (expectedPackageKind === "hook-only" && error instanceof PluginInstallConfigError && error.blockedSnapshot) return error.blockedSnapshot;
			throw error;
		});
		if (snapshot.hookMutation.mode === "blocked") return {
			ok: false,
			error: snapshot.hookMutation.reason
		};
		const linked = source.source === "local" && source.link;
		if (linked && !fs.statSync(source.path).isDirectory()) return {
			ok: false,
			error: "Linked hook pack paths must be directories."
		};
		const beforePersistentApply = () => {
			assertCurrent();
			params.signal?.throwIfAborted();
			lease.assertOwned();
			snapshot.writeOptions.assertConfigPathForWrite?.();
			params.beforePersistentApply?.();
		};
		const result = await attemptHookInstall(source, {
			...params,
			snapshot
		}, {
			expectedPackageKind,
			beforePersistentApply
		}, lease.assertOwned.bind(lease));
		if (!result.ok) return result;
		const runtime = params.runtime ?? defaultRuntime;
		const config = snapshot.config;
		const pinMessages = [];
		await persistHookPackInstall({
			snapshot: linked ? {
				...snapshot,
				config: {
					...config,
					hooks: {
						...config.hooks,
						internal: {
							...config.hooks?.internal,
							load: {
								...config.hooks?.internal?.load,
								extraDirs: uniqueStrings([...config.hooks?.internal?.load?.extraDirs ?? [], source.path])
							}
						}
					}
				}
			} : snapshot,
			hookPackId: result.hookPackId,
			hooks: result.hooks,
			install: source.source === "local" ? {
				source: resolveArchiveKind(source.path) ? "archive" : "path",
				sourcePath: source.path,
				installPath: linked ? source.path : result.targetDir,
				version: result.version
			} : resolvePinnedNpmInstallRecordForCli(source.spec, Boolean(source.pin), result.targetDir, result.version, result.npmResolution, (message) => pinMessages.push(message), theme.warn),
			...linked ? { successMessage: `Linked hook pack path: ${shortenHomePath(source.path)}` } : {},
			runtime,
			beforePersistentApply,
			payloadTransaction: resolvePackageDirInstallTransaction(result)
		});
		for (const message of pinMessages) runtime.log(message);
		return { ok: true };
	});
}
async function installInspectedHookPack(source, params) {
	const probe = await attemptHookInstall(source, params, { inspection: "package-kind" });
	if (!probe.ok) {
		if (probe.code !== HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS && probe.code !== HOOK_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_HOOKS) (params.runtime ?? defaultRuntime).log(theme.warn(`Hook-pack fallback skipped: package inspection failed: ${probe.error}`));
		return;
	}
	if (probe.packageKind !== "hook-only") return;
	return await installHookPack(source.source !== "local" && probe.npmResolution?.integrity ? {
		...source,
		expectedIntegrity: probe.npmResolution.integrity
	} : source, params, "hook-only");
}
/** Every source uses the same plugin executor; hook fallback needs an eligible artifact. */
async function installPluginWithHookFallback(params) {
	const { request, snapshot, install: execute = installManagedPlugin, ...options } = params;
	const compatible = request.source === "local" || request.source === "npm" ? request : void 0;
	const blocked = resolveFullyBlockedConfigMutationReason(snapshot);
	if (blocked) return {
		ok: false,
		error: blocked
	};
	if (compatible) {
		if (snapshot.pluginMutation.mode === "blocked" || snapshot.hookMutation.mode === "blocked") {
			const hook = await installInspectedHookPack(compatible, params);
			if (hook) return hook;
			if (snapshot.pluginMutation.mode === "blocked") return {
				ok: false,
				error: snapshot.pluginMutation.reason
			};
		}
	}
	const install = async (installRequest) => {
		const runtime = params.runtime ?? defaultRuntime;
		const logWarning = options.logger?.warn ?? createPluginInstallLogger(runtime).warn;
		const warnings = /* @__PURE__ */ new Set();
		const warn = (message) => {
			if (!warnings.has(message)) {
				warnings.add(message);
				logWarning(message);
			}
		};
		try {
			const result = await execute({
				...options,
				logger: {
					...options.logger,
					warn
				},
				request: installRequest
			});
			for (const warning of result.warnings ?? []) warn(warning);
			runtime.log(installRequest.source === "local" && installRequest.link ? `Linked plugin path: ${shortenHomePath(installRequest.path)}` : `Installed plugin: ${result.plugin.id}`);
			runtime.log(result.application ? `Applied in Gateway generation ${result.application.generation}.` : "Saved for the next Gateway start.");
			return { ok: true };
		} catch (error) {
			if (!(error instanceof ManagedPluginLifecycleError) || !error.installRejected) throw error;
			return {
				ok: false,
				error: error.message,
				code: error.code,
				warning: error.warning,
				installSource: error.installSource
			};
		}
	};
	const result = await install(request);
	if (result.ok) return result;
	const selectedSource = result.installSource;
	const hookSource = request.source === "official" && (result.code === PLUGIN_INSTALL_ERROR_CODE.MISSING_OPENCLAW_EXTENSIONS || result.code === PLUGIN_INSTALL_ERROR_CODE.CONFIG_MUTATION_BLOCKED) && selectedSource?.source === "npm" ? {
		source: "npm",
		spec: selectedSource.spec,
		expectedIntegrity: selectedSource.expectedIntegrity,
		mode: request.mode,
		pin: request.pin
	} : compatible;
	if (result.code === PLUGIN_INSTALL_ERROR_CODE.CONFIG_MUTATION_BLOCKED) return (hookSource && await installInspectedHookPack(hookSource, params)) ?? result;
	if (!hookSource || [
		PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED,
		PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED,
		PLUGIN_INSTALL_ERROR_CODE.RELEASE_COHORT_UNAVAILABLE,
		PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN
	].some((code) => code === result.code)) return result;
	if (request.source === "npm" && params.allowBundledFallback) {
		const fallback = resolveBundledInstallPlanForNpmFailure({
			rawSpec: request.spec,
			code: result.code,
			findBundledSource: (lookup) => findBundledPluginSource({ lookup })
		});
		if (fallback) {
			(params.runtime ?? defaultRuntime).log(theme.warn(fallback.warning));
			return await install({
				source: "bundled",
				pluginId: fallback.bundledSource.pluginId,
				...request.enable === false ? { enable: false } : {}
			});
		}
	}
	const hook = await installHookPack(hookSource, params);
	return hook.ok ? hook : {
		...result,
		error: formatPluginInstallWithHookFallbackError(result.error, hook)
	};
}
//#endregion
//#region src/cli/plugins-install-preflight.ts
function resolveMarketplaceOptionError(opts) {
	if (opts.link) return `--link is not supported with --marketplace. Remove --link, or install a local path with ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	if (opts.pin) return `--pin is not supported with --marketplace. Use ${formatCliCommand(`openclaw plugins install <plugin> --marketplace <name> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} without --pin.`;
	return null;
}
function resolveSourceOptionError(opts, sourcePlan) {
	if (sourcePlan.request.source === "git" && opts.link) return `--link is not supported with git: installs. Use ${formatCliCommand(`openclaw plugins install git:<repo>@<ref> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} for Git installs or ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} for local paths.`;
	if (sourcePlan.request.source === "git" && opts.pin) return `--pin is not supported with git: installs. Pin the ref in the spec instead, for example ${formatCliCommand(`openclaw plugins install git:<repo>@<ref> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	if (opts.pin && sourcePlan.request.source !== "npm" && sourcePlan.request.source !== "official" && sourcePlan.request.source !== "bundled") return "--pin is only supported with npm registry installs.";
	if (opts.link && sourcePlan.request.source !== "local") return `--link requires a local path. Run ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	return null;
}
/** Complete source and option validation before acquiring the persistent lifecycle lease. */
async function resolvePluginInstallPreflight(params) {
	if (!params.raw.trim()) return {
		ok: false,
		error: "Plugin install source must not be empty."
	};
	if (params.opts.marketplace !== void 0 && !params.opts.marketplace.trim()) return {
		ok: false,
		error: "--marketplace requires a non-empty source."
	};
	const installMode = params.opts.force && !params.opts.link ? "update" : "install";
	let raw = params.raw;
	let marketplace = params.opts.marketplace;
	let sourcePlan = null;
	if (marketplace === void 0) {
		const shorthand = await tracePluginLifecyclePhaseAsync("marketplace shortcut resolution", () => resolveMarketplaceInstallShortcut(raw), { command: "install" });
		if (shorthand?.ok === false) return {
			ok: false,
			error: shorthand.error
		};
		if (shorthand?.ok) {
			raw = shorthand.plugin;
			marketplace = shorthand.marketplaceSource;
		} else {
			const planned = resolvePluginInstallSourcePlan({
				raw,
				mode: installMode,
				link: params.opts.link,
				pin: params.opts.pin
			});
			if (!planned.ok) return planned;
			sourcePlan = planned;
		}
	}
	if (marketplace && fs.existsSync(resolveUserPath(marketplace))) marketplace = resolveUserPath(marketplace);
	const opts = {
		...params.opts,
		marketplace
	};
	const optionError = marketplace ? resolveMarketplaceOptionError(opts) : sourcePlan ? resolveSourceOptionError(opts, sourcePlan) : "Plugin install source could not be resolved.";
	if (optionError) return {
		ok: false,
		error: optionError
	};
	const requestResolution = resolvePluginInstallRequestContext({
		rawSpec: raw,
		marketplace,
		source: sourcePlan?.request.source,
		localPath: sourcePlan?.localPath
	});
	if (!requestResolution.ok) return requestResolution;
	const source = sourcePlan?.request.source;
	const request = source && [
		"npm-pack",
		"git",
		"clawhub",
		"bundled",
		"official"
	].includes(source) ? {
		...requestResolution.request,
		installKind: "plugin"
	} : requestResolution.request;
	if (marketplace) return {
		ok: true,
		raw,
		opts,
		installMode,
		request,
		marketplace,
		sourcePlan: null
	};
	if (!sourcePlan) return {
		ok: false,
		error: "Plugin install source could not be resolved."
	};
	return {
		ok: true,
		raw,
		opts,
		installMode,
		request,
		sourcePlan
	};
}
//#endregion
//#region src/cli/plugins-install-command.ts
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING = "--dangerously-force-unsafe-install is deprecated and no longer affects plugin installs because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
/** Validate intent and select the runtime owner before either process acquires its lease. */
async function runPluginInstallCommand(params) {
	assertConfigWriteAllowedInCurrentMode();
	const runtime = params.runtime ?? defaultRuntime;
	const preflight = await resolvePluginInstallPreflight(params);
	if (!preflight.ok) {
		runtime.error(preflight.error);
		return runtime.exit(1);
	}
	const { raw, opts, sourcePlan } = preflight;
	if (opts.dangerouslyForceUnsafeInstall) runtime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING));
	const acknowledgment = sourcePlan?.acknowledgement ?? (preflight.marketplace ? {
		sourceClass: "marketplace",
		spec: `${raw} from ${preflight.marketplace}`
	} : void 0);
	if (acknowledgment && !await confirmNonClawHubInstall({
		acknowledged: opts.force,
		runtime,
		...acknowledgment
	})) return runtime.exit(1);
	let result;
	try {
		const snapshot = await loadConfigForInstall(preflight.request).catch((error) => {
			if (error instanceof PluginInstallConfigError && error.blockedSnapshot) return error.blockedSnapshot;
			throw error;
		});
		const gateway = params.applyRuntime || params.beforePersistentApply || hasPluginLifecycleLease() ? null : await resolvePluginLifecycleGateway();
		const request = sourcePlan?.request ?? {
			source: "marketplace",
			marketplace: preflight.marketplace,
			plugin: raw,
			mode: preflight.installMode
		};
		if (sourcePlan?.warning) runtime.log(theme.warn(sourcePlan.warning));
		result = await installPluginWithHookFallback({
			request: {
				...request,
				...opts.enable === false ? { enable: false } : {}
			},
			snapshot,
			runtime,
			applyRuntime: params.applyRuntime,
			beforePersistentApply: params.beforePersistentApply,
			invalidateRuntimeCache: params.invalidateRuntimeCache ?? true,
			install: gateway ? createGatewayPluginInstaller(gateway) : (installParams) => runWithLocalPluginState("install", (assertCurrent) => installManagedPlugin({
				...installParams,
				beforePersistentApply: () => {
					assertCurrent();
					installParams.beforePersistentApply?.();
				}
			})),
			allowBundledFallback: sourcePlan?.allowBundledFallback,
			logger: createPluginInstallLogger(runtime),
			confirmInstall: resolveClawHubInstallConfirmation(),
			...resolvePluginCapabilityConsentCliOptions({
				acceptCapabilities: opts.acceptCapabilities,
				action: "install",
				runtime
			}),
			safetyOverrides: {
				config: snapshot.config,
				onInstallPolicyWarning: opts.onInstallPolicyWarning,
				trustedSourceLinkedOfficialInstall: opts.trustedSourceLinkedOfficialInstall,
				...resolveInstallPolicyWarningAcknowledgementCliOptions({
					acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning,
					allowPrompt: params.allowInstallPolicyWarningPrompt
				})
			}
		});
	} catch (error) {
		runtime.error(formatErrorMessage(error));
		return runtime.exit(1);
	}
	if (!result.ok) {
		if (result.code !== CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED || !result.warning?.trim()) runtime.error(result.error);
		return runtime.exit(1);
	}
}
//#endregion
export { runPluginInstallCommand };
