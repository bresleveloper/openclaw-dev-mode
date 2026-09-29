import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { a as resolveAgentDir, d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as normalizePluginTargetConfig } from "./config-state-BEAL5gWH.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-0uvJbX1M.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { p as materializeRuntimeConfig } from "./validation-core-DwJVlxTe.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-35XtW1Wg.mjs";
import { a as readNativeSessionCatalogPreference, n as hasLegacyNativeSessionCatalogDefault, o as shippedNativeSessionCatalogs, t as applyNativeSessionCatalogPreference } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { t as readCodexCliActiveApiKey } from "./cli-credentials-Be2RCYO6.mjs";
import { B as isProviderAuthError } from "./loader-runtime-load-XbrcYJWd.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-Atb7OdLd.mjs";
import "./model-auth-CCIBdEPk.mjs";
import { o as resolveCliRuntimeCanonicalProvider } from "./cli-backends-SxX34tmf.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { i as resolveManifestProviderAuthChoices, o as isProviderAuthChoicePlatformSupported } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { o as stripPendingPluginInstallRecords } from "./install-record-commit-DDMKSyro.mjs";
import { n as resolveConfiguredPrimaryModelForAgent, r as resolveConfiguredSetupModelForAgent } from "./utility-model-DZ4XRwmc.mjs";
import { i as appendSystemAgentAuditEntry } from "./audit-Dw5g9WOB.mjs";
import { a as sameDefaultInferenceRoute, i as resolveSystemAgentConfiguredRouteFromConfig, r as projectInferenceRoute } from "./inference-route-BPA-rq9w.mjs";
import { C as validateSetupModelTarget, S as validateSetupInferenceOwnerEvidence, a as SetupInferenceCancelledError, b as toProviderAutoSetupKind, d as parseSavedAuthSetupProfileId, f as redactSetupInferenceError, g as resolveSetupModel, h as resolveSetupInferenceWorkspace, i as SetupInferenceActivationUnavailableError, l as parseInferenceRef, o as SetupInferenceOwnerDriftError, p as resolveCandidatePresentation, r as SetupInferenceActivationIndeterminateError, s as invalidSetupConfigError, u as parseProviderAutoSetupChoiceId, v as setupInferenceLog, x as toSavedAuthSetupKind, y as throwIfSetupInferenceCancelled } from "./setup-inference-core-CJd1l_r5.mjs";
import { i as setupConfigPatchConflicts, n as commitSetupInferenceActivation, t as captureSetupInferenceFileUndo } from "./setup-inference-transition-bla77ukN.mjs";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
import { t as captureSystemAgentOwnerPluginArtifacts } from "./verified-inference-BKhGtG5v.mjs";
import { a as listSetupInferenceManualProviders, c as supportsSetupTextInference, i as listSetupInferenceInstallOptions, n as listSetupInferenceAuthOptions, o as listSetupInferencePrepareOptions, r as listSetupInferenceEnableOptions, t as choiceMatchesCredential } from "./setup-inference-auth-options-D3RRexV_.mjs";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-CufiiFq0.mjs";
import { a as OPENAI_API_DEFAULT_MODEL_REF, i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF, t as ANTHROPIC_API_DEFAULT_MODEL_REF } from "./onboard-inference-ambient-CfQryMAC.mjs";
import "./onboard-inference-D4_kCX74.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-BNYfhiBg.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-C6KfQziD.mjs";
import { n as createSystemAgentModelSelectionUpdater } from "./setup-model-selection-DGROJp4Z.mjs";
import { a as stageProviderAutoCandidate, i as stageProviderAuthCandidate, n as saveSetupCredential, o as stageSavedAuthCandidate } from "./setup-inference-credentials-D-9K0G-H.mjs";
import { a as revalidateStableSetupInferenceOwner, d as withPreparedSetupCredentialAccess, l as activatePreparedSetupCredential, o as runSetupInferenceTurn, r as loadSetupInferencePluginGeneration } from "./setup-inference-turn-vxZT-cCw.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-native-session-catalogs.ts
function requiresSetupNativeSessionCatalogConsent(params) {
	if (params.catalogs.length === 0) return false;
	return params.catalogs.every(({ pluginId }) => {
		const enabled = readNativeSessionCatalogPreference(params.config, pluginId);
		return enabled === false || enabled === void 0 && (!params.configExists || !hasLegacyNativeSessionCatalogDefault(pluginId));
	});
}
function resolveSetupNativeSessionCatalogPreference(params) {
	return params.consentRequired ? params.requested ?? false : void 0;
}
function listSetupNativeSessionCatalogs(params) {
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	const catalogs = new Map(shippedNativeSessionCatalogs.map((catalog) => [catalog.pluginId, catalog]));
	for (const plugin of snapshot.plugins) if (plugin.setup?.nativeSessionCatalog) catalogs.set(plugin.id, {
		pluginId: plugin.id,
		...plugin.setup.nativeSessionCatalog
	});
	return [...catalogs.values()].map(({ pluginId, label, description }) => {
		const option = {
			pluginId,
			label
		};
		if (description) option.detail = description;
		return option;
	}).toSorted((a, b) => a.label.localeCompare(b.label, "en") || a.pluginId.localeCompare(b.pluginId, "en"));
}
function applySetupNativeSessionCatalogPreference(params) {
	return applyNativeSessionCatalogPreference(params.config, listSetupNativeSessionCatalogs(params).map(({ pluginId }) => pluginId), params.enabled);
}
//#endregion
//#region src/system-agent/setup-inference-detect.ts
async function listSavedSetupInferenceCandidates(params) {
	const { withSetupProviderAuthMethod } = await import("./setup-provider-method-BlPquKJk.mjs");
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	const store = loadAuthProfileStoreWithoutExternalProfiles(agentDir);
	const candidates = [];
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		params.signal.throwIfAborted();
		const saved = credential.setup;
		if (!saved && params.cfg.auth?.profiles?.[profileId]) continue;
		const choice = saved?.authChoice ? params.choices.find((entry) => entry.choiceId === saved.authChoice && entry.pluginId === saved.pluginId) : params.choices.find((entry) => choiceMatchesCredential(entry, credential));
		let modelRef = saved?.modelRef;
		if (!modelRef && choice) {
			const loaded = await withSetupProviderAuthMethod({
				...params,
				choice
			}, ({ method }) => ({ modelRef: method.starterModel }));
			params.signal.throwIfAborted();
			if (!("error" in loaded)) modelRef = loaded.modelRef;
		}
		if (!modelRef) continue;
		candidates.push({
			kind: toSavedAuthSetupKind(profileId),
			...choice?.modelTarget ? { modelTarget: choice.modelTarget } : {},
			modelRef,
			brandId: choice?.providerId ?? credential.provider,
			label: `Saved ${choice?.choiceLabel ?? credential.provider} sign-in`,
			detail: credential.setup?.replacement ? "Saved but inactive. Test this sign-in again, then choose whether to activate it." : "Verify this saved sign-in to use it. No new sign-in is needed.",
			recommended: false,
			credentials: true,
			...choice?.icon ? { icon: choice.icon } : {},
			...choice?.website ? { website: choice.website } : {}
		});
	}
	return candidates;
}
function resolveConfiguredCandidateKind(config, modelRef, agentId) {
	if (!modelRef) return;
	const ref = parseProviderModelRef(modelRef);
	if (!ref) return;
	const runtime = normalizeOptionalAgentRuntimeId(resolveModelRuntimePolicy({
		config,
		provider: ref.provider,
		modelId: ref.model,
		agentId: resolveAmbientOwnerAgentId(config ?? {}, agentId)
	}).policy?.id);
	if (runtime === "codex") return "codex-cli";
	if (runtime === "claude-cli") return "claude-cli";
}
async function prepareSetupInferenceOptions(deps, agentId) {
	const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
	const { snapshot, pluginMetadataSnapshot } = await readConfigFileSnapshotWithPluginMetadata();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const targetAgentId = resolveAmbientOwnerAgentId(cfg, agentId);
	const workspace = resolveSetupInferenceWorkspace(snapshot);
	const allAuthChoices = (deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: cfg,
		workspaceDir: workspace,
		metadataSnapshot: pluginMetadataSnapshot,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false,
		includeUnsupportedPlatforms: true
	});
	const supportedAuthChoices = allAuthChoices.filter((choice) => isProviderAuthChoicePlatformSupported(choice.platforms));
	const detectionRequiredProviders = new Set(allAuthChoices.filter((choice) => choice.assistantVisibility === "detected-only").map((choice) => normalizeProviderId(choice.providerId)));
	for (const choice of supportedAuthChoices) if (choice.assistantVisibility !== "detected-only") detectionRequiredProviders.delete(normalizeProviderId(choice.providerId));
	const authChoices = supportedAuthChoices.filter((choice) => (deps.enablePluginInConfig ?? enablePluginInConfig)(cfg, choice.pluginId).enabled);
	const disabledAuthChoices = supportedAuthChoices.filter((choice) => !authChoices.includes(choice));
	const setupComplete = Boolean(resolveConfiguredPrimaryModelForAgent({
		cfg,
		agentId: targetAgentId
	}));
	const setupSelection = resolveConfiguredSetupModelForAgent({
		cfg,
		agentId: targetAgentId
	});
	const utilitySetting = readUtilityModelSetting(cfg, targetAgentId);
	let utilityModel;
	if (utilitySetting.kind === "explicit") {
		const { resolveSimpleCompletionSelectionForAgent } = await import("./simple-completion-runtime-0hj5YXMA.mjs");
		const selection = resolveSimpleCompletionSelectionForAgent({
			cfg,
			agentId: targetAgentId,
			modelRef: utilitySetting.modelRef,
			manifestPlugins: pluginMetadataSnapshot
		});
		if (selection) utilityModel = `${selection.provider}/${selection.modelId}`;
	}
	const installOptions = listSetupInferenceInstallOptions(resolveProviderInstallCatalogEntries({
		config: cfg,
		workspaceDir: workspace,
		includeUntrustedWorkspacePlugins: false
	}), authChoices);
	const authOptions = [
		...listSetupInferenceAuthOptions(authChoices),
		...listSetupInferenceEnableOptions(disabledAuthChoices),
		...installOptions,
		{
			id: "custom-api-key",
			brandId: "custom",
			label: "Custom OpenAI/Anthropic-compatible endpoint",
			hint: "Connect a compatible endpoint running from this Gateway host.",
			kind: "custom",
			featured: false
		}
	].filter((option, index, options) => options.findIndex((entry) => entry.id === option.id) === index);
	const nativeSessionCatalogs = listSetupNativeSessionCatalogs({
		config: cfg,
		workspaceDir: workspace,
		metadataSnapshot: pluginMetadataSnapshot
	});
	return {
		cfg,
		targetAgentId,
		authChoices,
		detectionRequiredProviders,
		manual: {
			...utilityModel ? { utilityModel } : {},
			...utilityModel && setupSelection?.modelTarget === "utility" ? { setupModel: utilityModel } : {},
			manualProviders: listSetupInferenceManualProviders(authChoices),
			authOptions,
			prepareOptions: listSetupInferencePrepareOptions(authChoices),
			nativeSessionCatalogs,
			nativeSessionCatalogPreferenceRequired: requiresSetupNativeSessionCatalogConsent({
				configExists: snapshot.exists,
				config: snapshot.sourceConfig ?? snapshot.config,
				catalogs: nativeSessionCatalogs
			}),
			workspace,
			setupComplete
		}
	};
}
/** Manual setup options use only config and manifests, never machine or credential probes. */
async function listManualSetupInferenceOptions(deps = {}, agentId) {
	return (await prepareSetupInferenceOptions(deps, agentId)).manual;
}
async function detectSetupInference(deps = {}, agentId) {
	const prepared = await prepareSetupInferenceOptions(deps, agentId);
	let partial = {
		...prepared.manual,
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: listRecommendedToolInstalls()
	};
	const controller = new AbortController();
	const timeoutMs = 3e4;
	return await new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			controller.abort(/* @__PURE__ */ new Error("Setup inference discovery timed out"));
			setupInferenceLog.warn(`Setup inference detection timed out after ${timeoutMs}ms; returning partial detection.`);
			resolve(partial);
		}, timeoutMs);
		discoverSetupInference(prepared, deps, controller.signal, (detection) => {
			partial = detection;
			deps.onPartial?.(detection);
		}).then((detection) => {
			clearTimeout(timer);
			resolve(detection);
		}, (error) => {
			clearTimeout(timer);
			reject(toErrorObject(error, "Setup inference discovery failed"));
		});
	});
}
async function discoverSetupInference({ cfg, targetAgentId, authChoices, detectionRequiredProviders, manual }, deps, signal, onPartial) {
	const { workspace } = manual;
	const requiresDetection = (candidate) => {
		const ref = parseProviderModelRef(candidate.modelRef);
		return ref !== null && detectionRequiredProviders.has(normalizeProviderId(ref.provider));
	};
	const savedCandidates = await listSavedSetupInferenceCandidates({
		cfg,
		agentId: targetAgentId,
		workspace,
		choices: authChoices,
		deps,
		signal
	});
	signal.throwIfAborted();
	const partial = {
		...manual,
		candidates: savedCandidates.filter((candidate) => !requiresDetection(candidate)),
		unavailableCandidates: [],
		recommendedInstalls: listRecommendedToolInstalls()
	};
	onPartial(partial);
	const detected = await (deps.detectInferenceBackends ?? (await import("./onboard-inference-C3obATnE.mjs")).detectInferenceBackends)({
		config: cfg,
		agentId: targetAgentId
	});
	signal.throwIfAborted();
	const configuredModel = detected.find((candidate) => candidate.kind === "existing-model")?.modelRef;
	const configuredCandidateKind = resolveConfiguredCandidateKind(cfg, configuredModel, targetAgentId);
	const candidates = detected.filter((candidate) => candidate.kind !== "gemini-cli" && !(candidate.kind === configuredCandidateKind && configuredModel && areRuntimeModelRefsEquivalent(candidate.modelRef, configuredModel, { config: cfg }))).map((candidate) => Object.assign(candidate, { recommended: false }, resolveCandidatePresentation(candidate, authChoices)));
	candidates.push(...savedCandidates);
	if (!configuredModel && manual.setupModel) candidates.push({
		kind: "existing-model",
		modelTarget: "utility",
		modelRef: manual.setupModel,
		label: "Configured setup utility",
		detail: `${manual.setupModel} — regular agent model still needed`,
		recommended: false,
		credentials: true
	});
	const pendingCandidates = candidates.filter(requiresDetection);
	const offeredCandidates = candidates.filter((candidate) => !requiresDetection(candidate));
	onPartial({
		...partial,
		candidates: [...offeredCandidates],
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	});
	const discoveryChoices = authChoices.filter((choice) => choice.appGuidedDiscovery === true && supportsSetupTextInference(choice.onboardingScopes));
	if (discoveryChoices.length > 0) {
		const { probeSetupProviderChoices } = await import("./provider-setup-availability-CQAtmMyB.mjs");
		const available = (await probeSetupProviderChoices({
			config: cfg,
			workspaceDir: workspace,
			choices: discoveryChoices,
			signal,
			enablePluginInConfig: deps.enablePluginInConfig,
			resolvePluginProviders: deps.resolvePluginProviders
		}, async (choice, provider, context) => {
			const method = provider?.auth.find((candidate) => candidate.id === choice.methodId);
			if (!method?.appGuidedSetup) return null;
			try {
				const candidate = await method.appGuidedSetup.detect({
					...context,
					signal
				});
				signal.throwIfAborted();
				if (!candidate) return null;
				const ref = parseProviderModelRef(candidate.modelRef);
				if (!ref || normalizeProviderId(ref.provider) !== normalizeProviderId(choice.providerId)) {
					setupInferenceLog.warn(`Ignoring invalid app-guided model ${candidate.modelRef} from ${choice.choiceId}.`);
					return null;
				}
				return Object.assign({
					kind: toProviderAutoSetupKind(choice.choiceId),
					brandId: choice.providerId,
					label: choice.choiceLabel,
					detail: candidate.detail?.trim() || "available locally",
					modelRef: candidate.modelRef,
					...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
					recommended: false,
					credentials: true
				}, choice.icon ? { icon: choice.icon } : {}, choice.website ? { website: choice.website } : {});
			} catch (error) {
				setupInferenceLog.debug(`App-guided discovery failed for ${choice.choiceId}: ${formatErrorMessage(error)}`);
				return null;
			}
		})).filter((candidate) => candidate !== null);
		offeredCandidates.push(...pendingCandidates.filter((candidate) => available.some((discoveredCandidate) => areRuntimeModelRefsEquivalent(candidate.modelRef, discoveredCandidate.modelRef, { config: cfg }))));
		offeredCandidates.push(...available);
	}
	return {
		...partial,
		candidates: offeredCandidates,
		...configuredModel ? { configuredModel } : {},
		setupComplete: Boolean(configuredModel)
	};
}
//#endregion
//#region src/system-agent/setup-inference-codex.ts
async function stageCodexCandidate(ctx, modelRef) {
	return await withPluginLifecycleLease({ signal: ctx.params.signal }, async () => {
		const enabled = await enablePluginWithCapabilityConsent(normalizePluginTargetConfig(stripPendingPluginInstallRecords(ctx.cfg), "codex"), "codex", {
			workspaceDir: ctx.workspace,
			beforePersistentEffect: ctx.beforePersistentEffect,
			onCapabilityConsent: ctx.params.prompter ? createPluginCapabilityConsentPrompter(ctx.params.prompter) : void 0
		});
		if (!enabled.enabled) return { error: `Could not enable the Codex runtime plugin: ${enabled.reason}.` };
		const ensured = await (ctx.deps.ensureCodexRuntimePlugin ?? (await import("./codex-runtime-plugin-install-D_PAyRJ3.mjs")).ensureCodexRuntimePluginForModelSelection)({
			cfg: enabled.config,
			model: modelRef,
			agentId: ctx.routeAgentId,
			prompter: ctx.params.prompter ?? createQuickstartNotePrompter(ctx.params.runtime),
			runtime: ctx.params.runtime,
			workspaceDir: ctx.workspace,
			beforePersistentEffect: ctx.beforePersistentEffect
		});
		if (!ensured.ok) return { error: ensured.message };
		const install = ensured.cfg.plugins?.installs?.codex;
		if (install?.source === "npm" && install.installPath) {
			if (!await (ctx.deps.markRetainedManagedNpmInstall ?? (await import("./managed-npm-retention-CMgIQ3NG.mjs")).markRetainedManagedNpmInstall)({
				packageDir: install.installPath,
				pluginId: "codex",
				reason: "openclaw-inference-activation-not-committed"
			})) throw new SetupInferenceActivationIndeterminateError("Could not retain the installed Codex package. Restart the Gateway before retrying setup.");
		}
		const config = normalizePluginTargetConfig(ensured.cfg, "codex");
		const pluginConfig = (config.plugins?.entries?.codex)?.config ?? {};
		const appServer = isRecord(pluginConfig.appServer) ? pluginConfig.appServer : {};
		if (typeof appServer.transport === "string" && appServer.transport !== "stdio") return { error: "Codex setup needs a local stdio app-server. Finish sign-in on the remote app-server host or remove the transport override before retrying." };
		const candidate = {
			modelRef,
			agentRuntimeId: "codex",
			pendingPluginInstalls: config.plugins?.installs,
			config
		};
		if (appServer.homeScope === "user") return candidate;
		const store = loadAuthProfileStoreWithoutExternalProfiles(ctx.agentDir);
		const existingProfileId = resolveAuthProfileOrder({
			cfg: config,
			store,
			provider: "openai",
			forModel: modelRef.slice(7)
		})[0];
		if (existingProfileId) return {
			...candidate,
			authProfileId: existingProfileId
		};
		try {
			const auth = await (ctx.deps.resolveApiKeyForProvider ?? resolveApiKeyForProviderCore)({
				cfg: config,
				store,
				provider: "openai",
				agentDir: ctx.agentDir,
				workspaceDir: ctx.workspace,
				allowAuthProfileFallback: false,
				skipSetupProviderFallback: true,
				secretSentinels: true
			});
			throwIfSetupInferenceCancelled(ctx.params);
			if (auth.apiKey) return {
				...candidate,
				authProfileId: auth.profileId
			};
		} catch (error) {
			if (!isProviderAuthError(error, "missing-provider-auth")) throw error;
		}
		throwIfSetupInferenceCancelled(ctx.params);
		const credential = (ctx.deps.readCodexCliActiveApiKey ?? readCodexCliActiveApiKey)({ allowKeychainPrompt: true });
		if (!credential) {
			const choices = (ctx.deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
				config,
				workspaceDir: ctx.workspace,
				includeUntrustedWorkspacePlugins: false,
				includeWorkspacePlugins: false
			});
			const options = listSetupInferenceAuthOptions(choices).filter((choice) => choice.brandId === "openai" && (choice.kind === "oauth" || choice.kind === "device-code"));
			const choice = options.find((option) => option.id === ctx.params.authChoice) ?? options[0];
			if (!choice) return { error: "OpenAI sign-in is unavailable. Connect OpenAI in Model Setup, then retry Codex setup." };
			const authContext = {
				...ctx,
				cfg: config,
				params: {
					...ctx.params,
					modelRef,
					authChoice: choice.id
				}
			};
			try {
				return await stageProviderAuthCandidate(authContext, true, "codex");
			} finally {
				ctx.credentialsSaved = authContext.credentialsSaved;
			}
		}
		registerSecretValueForRedaction(credential.key);
		const saved = await saveSetupCredential({
			profile: {
				profileId: "openai:codex-cli-api-key",
				credential
			},
			config,
			baseConfig: ctx.cfg,
			modelRef,
			pluginId: "codex",
			agentRuntimeId: "codex",
			agentDir: ctx.agentDir,
			beforePersistentEffect: () => ctx.beforePersistentEffect("credential")
		});
		ctx.credentialsSaved = true;
		return {
			...candidate,
			authProfileId: saved.profile.profileId,
			config: saved.config
		};
	});
}
//#endregion
//#region src/system-agent/setup-inference-activate.ts
function resolveRouteModelRef(ctx, defaultModelRef) {
	return resolveSetupModel({
		label: ctx.params.kind,
		providerId: parseInferenceRef(defaultModelRef).provider,
		defaultModel: defaultModelRef,
		modelRef: ctx.params.modelRef
	});
}
async function stageCandidate(ctx) {
	const { params, cfg } = ctx;
	const roleError = params.kind.startsWith("saved-auth:") || parseProviderAutoSetupChoiceId(params.kind) || params.kind === "existing-model" || params.kind === "provider-auth" || params.kind === "api-key" ? void 0 : validateSetupModelTarget(void 0, params.modelTarget);
	if (roleError) return roleError;
	if (params.kind.startsWith("saved-auth:")) {
		const profileId = parseSavedAuthSetupProfileId(params.kind);
		if (!profileId) return { error: "Invalid saved sign-in choice. Open Model Setup and choose again." };
		return await stageSavedAuthCandidate(ctx, profileId);
	}
	const choiceId = parseProviderAutoSetupChoiceId(params.kind);
	if (choiceId) return await stageProviderAutoCandidate(ctx, choiceId);
	switch (params.kind) {
		case "existing-model": {
			const route = await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.agentId, {
				loadAuthProfileStoreForRuntime: ctx.deps.loadAuthProfileStoreForRuntime,
				...params.modelTarget ? { modelTarget: params.modelTarget } : {}
			}, ctx.snapshot);
			if (!route) return { error: "No configured default-agent inference route is available." };
			const routeRoleError = validateSetupModelTarget(route.modelTarget, params.modelTarget);
			if (routeRoleError) return routeRoleError;
			const requested = params.modelRef?.trim();
			if (requested && normalizeAgentModelRefForConfig(requested) !== route.modelLabel) return { error: `The configured default model changed from ${requested} to ${route.modelLabel}. Try setup again.` };
			return {
				modelRef: route.modelLabel,
				...route.modelTarget ? { modelTarget: route.modelTarget } : {},
				config: cfg,
				...route.authProfileId ? { authProfileId: route.authProfileId } : {}
			};
		}
		case "codex-cli": {
			const modelRef = resolveRouteModelRef(ctx, CODEX_APP_SERVER_DEFAULT_MODEL_REF);
			return typeof modelRef === "string" ? await stageCodexCandidate(ctx, modelRef) : modelRef;
		}
		case "api-key": return await stageProviderAuthCandidate(ctx, false);
		case "provider-auth": return await stageProviderAuthCandidate(ctx, true);
		case "claude-cli": {
			const modelRef = resolveRouteModelRef(ctx, CLAUDE_CLI_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			const ref = parseInferenceRef(modelRef);
			return {
				modelRef: `${resolveCliRuntimeCanonicalProvider({
					runtime: ref.provider,
					config: cfg,
					env: process.env,
					includeSetupRegistry: true
				}) ?? ref.provider}/${ref.model}`,
				agentRuntimeId: "claude-cli",
				config: cfg
			};
		}
		case "gemini-cli":
		case "openai-api-key":
		case "anthropic-api-key": {
			const modelRef = resolveRouteModelRef(ctx, {
				"gemini-cli": GEMINI_CLI_DEFAULT_MODEL_REF,
				"openai-api-key": OPENAI_API_DEFAULT_MODEL_REF,
				"anthropic-api-key": ANTHROPIC_API_DEFAULT_MODEL_REF
			}[params.kind]);
			if (typeof modelRef !== "string") return modelRef;
			return {
				modelRef,
				...params.kind === "gemini-cli" ? {} : { agentRuntimeId: "openclaw" },
				config: cfg
			};
		}
		default: return { error: `Unknown inference choice "${params.kind}".` };
	}
}
async function withSetupInferenceErrorRedaction(operation, apiKey) {
	try {
		return await operation();
	} catch (error) {
		const redacted = await redactSetupInferenceError(error, apiKey);
		if (error instanceof WizardCancelledError) throw new WizardCancelledError(redacted);
		if (error instanceof WizardNavigationError) throw new WizardNavigationError(error.direction);
		if (error instanceof SetupInferenceCancelledError) throw new SetupInferenceCancelledError();
		if (error instanceof SetupInferenceActivationUnavailableError) throw new SetupInferenceActivationUnavailableError(redacted);
		if (error instanceof SetupInferenceOwnerDriftError) throw new SetupInferenceOwnerDriftError(redacted);
		if (error instanceof SetupInferenceActivationIndeterminateError) throw new SetupInferenceActivationIndeterminateError(redacted);
		throw new Error(redacted);
	}
}
/** Save credentials once, confirm the candidate in memory, then commit its config. */
async function activateSetupInference(params) {
	try {
		return await withSetupInferenceErrorRedaction(async () => {
			const onActivationCompletion = params.onActivationCompletion;
			const result = await activateCandidate({
				...params,
				onActivationCompletion: onActivationCompletion ? (complete) => onActivationCompletion(() => withSetupInferenceErrorRedaction(complete, params.apiKey)) : void 0
			});
			return result.ok ? {
				...result,
				lines: await Promise.all(result.lines.map((line) => redactSetupInferenceError(line, params.apiKey)))
			} : {
				...result,
				error: await redactSetupInferenceError(result.error, params.apiKey)
			};
		}, params.apiKey);
	} catch (error) {
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		if (error instanceof SetupInferenceActivationUnavailableError) return {
			ok: false,
			status: "unavailable",
			error: error.message
		};
		if (error instanceof SetupInferenceOwnerDriftError) return {
			ok: false,
			status: "auth",
			error: error.message
		};
		throw error;
	}
}
async function activateCandidate(params) {
	const deps = params.deps ?? {};
	const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const routeAgentId = resolveAmbientOwnerAgentId(cfg, params.agentId);
	const ctx = {
		params,
		deps,
		snapshot,
		cfg,
		routeAgentId,
		agentDir: resolveAgentDir(cfg, routeAgentId),
		workspace: params.workspace?.trim() ? resolveUserPath(params.workspace) : resolveSetupInferenceWorkspace(snapshot),
		credentialsSaved: false,
		beforePersistentEffect: async () => {
			throwIfSetupInferenceCancelled(params);
			await params.beforePersistentEffect?.();
			throwIfSetupInferenceCancelled(params);
		}
	};
	const staged = await stageCandidate(ctx);
	const failure = (result) => ({
		...result,
		...ctx.credentialsSaved ? { error: `Credentials saved; default unchanged. ${result.error} Choose the saved sign-in in Model Setup to retry without signing in again.` } : {},
		disposition: "rejected-before-promotion"
	});
	if ("error" in staged) return failure({
		ok: false,
		status: "unavailable",
		error: staged.error
	});
	const verify = (runtimeCredential) => verifyAndActivateCandidate(ctx, staged, failure, runtimeCredential);
	if (!staged.authProfileId) return await verify();
	return await withPreparedSetupCredentialAccess(ctx, staged, staged.authProfileId, verify, failure);
}
async function verifyAndActivateCandidate(ctx, staged, failure, runtimeCredential) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { params, deps, snapshot, cfg, routeAgentId } = ctx;
		const source = snapshot.sourceConfig;
		const readSnapshot = deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
		const catalogPreference = resolveSetupNativeSessionCatalogPreference({
			consentRequired: requiresSetupNativeSessionCatalogConsent({
				configExists: snapshot.exists,
				config: source,
				catalogs: listSetupNativeSessionCatalogs({
					config: source,
					workspaceDir: ctx.workspace
				})
			}),
			...params.nativeSessionCatalogsEnabled !== void 0 ? { requested: params.nativeSessionCatalogsEnabled } : {}
		});
		const prepared = catalogPreference === void 0 ? staged.config : applySetupNativeSessionCatalogPreference({
			config: staged.config,
			enabled: catalogPreference,
			workspaceDir: ctx.workspace
		});
		const providerPatch = createMergePatch(cfg, stripPendingPluginInstallRecords(prepared));
		const selectModel = params.kind === "existing-model" ? (config) => config : await createSystemAgentModelSelectionUpdater({
			model: staged.modelRef,
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			...params.agentId ? { targetAgentId: routeAgentId } : {},
			...staged.agentRuntimeId ? { agentRuntimeId: staged.agentRuntimeId } : {},
			runtimeInDefaults: !params.agentId && !hasResolvedRosterBeforeMigrations(snapshot),
			...staged.authProfileId ? { authProfileId: staged.authProfileId } : {}
		});
		const buildCandidate = (base) => {
			let patched = base;
			if (!isRecord(providerPatch) || Object.keys(providerPatch).length > 0) patched = applyMergePatch(base, providerPatch);
			const selected = selectModel(patched, base);
			return staged.pendingPluginInstalls ? {
				...selected,
				plugins: {
					...selected.plugins,
					installs: staged.pendingPluginInstalls
				}
			} : selected;
		};
		const candidate = buildCandidate(cfg);
		const sourceCandidate = buildCandidate(source);
		const resolveMetadata = deps.resolvePluginMetadataSnapshot ?? resolvePluginMetadataSnapshot;
		const cache = _usingCtx$1.a(createPluginCache());
		const generation = staged.pendingPluginInstalls && Object.keys(staged.pendingPluginInstalls).length > 0 ? await withPluginLifecycleLease({ signal: params.signal }, async () => loadSetupInferencePluginGeneration({
			cache,
			config: candidate,
			workspaceDir: ctx.workspace,
			selection: {
				provider: parseInferenceRef(staged.modelRef).provider,
				modelId: parseInferenceRef(staged.modelRef).model,
				runtime: staged.agentRuntimeId ?? "openclaw",
				agentId: routeAgentId
			},
			pendingPluginInstalls: staged.pendingPluginInstalls,
			resolvePluginMetadataSnapshot: resolveMetadata
		})) : void 0;
		const metadata = generation?.metadataSnapshot ?? resolveMetadata({
			config: candidate,
			workspaceDir: ctx.workspace,
			env: process.env
		});
		const routeDeps = {
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			pluginMetadataPlugins: metadata.plugins,
			loadAuthProfileStoreForRuntime: deps.loadAuthProfileStoreForRuntime
		};
		const requestedAgentId = params.agentId ? routeAgentId : void 0;
		const project = (config, sourceConfig) => projectInferenceRoute(materializeRuntimeConfig(config, { manifestRegistry: { plugins: [...metadata.plugins] } }), requestedAgentId, routeDeps, sourceConfig);
		const resolveRoute = (config, currentSnapshot = snapshot) => resolveSystemAgentConfiguredRouteFromConfig(config, requestedAgentId, routeDeps, currentSnapshot);
		const route = await resolveRoute(candidate);
		if (!route || route.modelLabel !== staged.modelRef || staged.authProfileId && route.authProfileId !== staged.authProfileId) return failure({
			ok: false,
			status: "unavailable",
			error: "The candidate route does not match the selected provider, model, and credential. Review model runtime policy and retry."
		});
		const baselineRoute = await project(cfg, source);
		const verifiedRoute = await project(candidate, sourceCandidate);
		const withGeneration = (run) => generation ? withPluginRuntimeGenerationScope(generation, run) : run();
		const artifacts = withGeneration(() => (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
			config: route.runConfig,
			executionRoute: route,
			deps
		}));
		params.onPreparationComplete?.();
		throwIfSetupInferenceCancelled(params);
		const progress = params.prompter?.progress("Testing your AI connection…");
		const turn = await withGeneration(() => runSetupInferenceTurn({
			route,
			deps,
			requireExecutionOwner: true,
			signal: params.signal,
			runtime: params.runtime
		})).finally(() => progress?.stop());
		throwIfSetupInferenceCancelled(params);
		if (!turn.ok) return failure(turn);
		const ownerFailure = validateSetupInferenceOwnerEvidence({
			runner: route.runner,
			configuredHarnessId: route.runner === "embedded" ? route.agentHarnessRuntimeOverride : void 0,
			auth: turn.auth
		});
		if (ownerFailure) return failure(ownerFailure);
		const savedCredential = staged.authProfileId ? loadAuthProfileStoreWithoutExternalProfiles(ctx.agentDir).profiles[staged.authProfileId] : void 0;
		if (savedCredential?.setup?.replacement && !params.activationConfirmed) {
			if (!params.prompter || !await params.prompter.confirm({
				message: "Connection verified. Activate this saved sign-in?",
				initialValue: true
			})) return failure({
				ok: false,
				status: "unavailable",
				error: "Activation declined. The saved sign-in is inactive and your current connection is unchanged."
			});
			throwIfSetupInferenceCancelled(params);
		}
		const revalidate = async (currentSnapshot) => {
			const config = currentSnapshot.runtimeConfig ?? currentSnapshot.config;
			const sourceConfig = currentSnapshot.sourceConfig;
			if (!sameDefaultInferenceRoute(await project(config, sourceConfig), baselineRoute) || setupConfigPatchConflicts(source, sourceConfig, createMergePatch(source, sourceCandidate))) throw new SetupInferenceOwnerDriftError("Connection settings changed during verification. Choose the saved sign-in to test the current connection.");
			const next = buildCandidate(config);
			if (!sameDefaultInferenceRoute(await project(next, buildCandidate(sourceConfig)), verifiedRoute)) throw new SetupInferenceOwnerDriftError("The candidate route changed during verification. Retry setup before selecting it as the default.");
			const nextRoute = await resolveRoute(next, currentSnapshot);
			if (!nextRoute) throw new SetupInferenceOwnerDriftError("The selected inference route is no longer available.");
			await withGeneration(() => revalidateStableSetupInferenceOwner({
				route: nextRoute,
				auth: turn.auth,
				stagedOwnerPluginArtifacts: artifacts,
				deps
			}));
		};
		const activateCredential = async (assertCurrent) => {
			if (!staged.authProfileId || !savedCredential?.setup) return;
			const profileId = staged.authProfileId;
			return await activatePreparedSetupCredential(ctx, profileId, savedCredential, runtimeCredential, async () => {
				const latest = await readSnapshot();
				const current = latest.runtimeConfig ?? latest.config;
				if (!sameDefaultInferenceRoute(await project(current, latest.sourceConfig), verifiedRoute)) throw new SetupInferenceOwnerDriftError("The connection changed before credential activation. Test the saved sign-in again.");
				await withGeneration(() => revalidateStableSetupInferenceOwner({
					route,
					auth: turn.auth,
					stagedOwnerPluginArtifacts: artifacts,
					deps
				}));
			}, assertCurrent);
		};
		if (!isDeepStrictEqual(sourceCandidate, source) || savedCredential?.setup) {
			const configTarget = {
				read: async () => ({
					config: (await readSnapshot()).sourceConfig,
					write: configTarget.write
				}),
				write: async (_candidate, { writeOptions, captureUndo }) => {
					return (await (deps.transformConfigWithPendingPluginInstalls ?? (await import("./install-record-commit-Beb9YGNI.mjs")).transformConfigWithPendingPluginInstalls)({
						base: "source",
						writeOptions,
						transform: async (current, context) => {
							await ctx.beforePersistentEffect();
							await revalidate(context.snapshot);
							throwIfSetupInferenceCancelled(params);
							params.onCommitStarted?.(current);
							const nextConfig = buildCandidate(current);
							captureUndo(captureSetupInferenceFileUndo({
								...context.snapshot,
								sourceConfig: stripPendingPluginInstallRecords(context.snapshot.sourceConfig)
							}, stripPendingPluginInstallRecords(nextConfig)));
							return { nextConfig };
						}
					})).nextConfig;
				}
			};
			await commitSetupInferenceActivation({
				preserveWorkingConnection: Boolean(savedCredential?.setup?.replacement || baselineRoute.route || resolveAgentEffectiveModelPrimary(cfg, routeAgentId)),
				assertCurrent: () => throwIfSetupInferenceCancelled(params),
				activate: activateCredential,
				deferCompletion: params.onActivationCompletion,
				configTarget,
				config: sourceCandidate
			});
		} else await revalidate(await readSnapshot());
		const lines = [`${staged.modelTarget === "utility" ? "Utility inference" : "Inference"} verified: ${staged.modelRef}`];
		if (params.surface === "gateway" && params.recordSetupAudit !== false) {
			const after = await readSnapshot().catch(() => null);
			try {
				await appendSystemAgentAuditEntry({
					operation: "openclaw.setup",
					summary: "Verified an AI access candidate through OpenClaw setup",
					configPath: after?.path ?? snapshot.path,
					configHashBefore: hashConfigRaw(snapshot.raw),
					configHashAfter: after ? hashConfigRaw(after.raw) : null,
					details: {
						modelRef: staged.modelRef,
						inferenceKind: params.kind
					}
				});
			} catch (error) {
				const warning = `Inference was verified, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`;
				params.runtime.error?.(warning);
				lines.push(warning);
			}
		}
		return {
			ok: true,
			modelRef: staged.modelRef,
			...staged.modelTarget ? { modelTarget: staged.modelTarget } : {},
			latencyMs: turn.latencyMs,
			lines
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { detectSetupInference as n, listManualSetupInferenceOptions as r, activateSetupInference as t };
