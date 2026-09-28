import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { a as removeProviderAuthProfilesWithLock, r as promoteAuthProfileInOrder, u as upsertAuthProfileWithLockOrThrow } from "./profiles-B-MkhBI8.mjs";
import { i as resolvePluginSetupRegistry, r as resolvePluginSetupProviderCore } from "./setup-registry-D5VN3YGP.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-C-FMduqb.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import { s as isCliProvider } from "./model-selection-CFnUi6iD.mjs";
import "./workspace-mlzi3k1x.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { n as ProviderCredentialsSavedError, t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { a as restorePriorAgentsDefaultsModelUnlessOptIn, i as resolveProviderMatch, n as applyProviderAuthConfigPatch, r as pickAuthMethod, t as applyDefaultModel } from "./provider-auth-choice-helpers-BggS0fwD.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CqP4hf2X.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-JPDhFb.mjs";
import { n as persistProviderAuthProfilesAfterLogin } from "./provider-auth-persistence-BCap0NT4.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-Di2tA0mA.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { i as loadValidConfigSnapshotOrThrow, l as resolveModelsTargetAgent, u as updateConfig } from "./shared-yzzedLUF.mjs";
import { n as validateAnthropicSetupToken } from "./provider-auth-token-FoqRrJeD.mjs";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-BjUJJpKH.mjs";
import { t as buildMigrationContext } from "./context-Dp3Hhq9_.mjs";
import { t as applyMigrationItemSelection } from "./item-selection-DwfRs0sn.mjs";
import { a as repairCopilotRuntimePluginInstallForModelSelection, i as repairCodexRuntimePluginInstallForModelSelection } from "./runtime-plugin-install-B0E7RQ_S.mjs";
import "./codex-runtime-plugin-install-DJjDc5z0.mjs";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-BO5R6QVA.mjs";
import { a as validateOpenAICodexApiKeyInput, i as resolveDefaultTokenProfileId, n as looksLikeOpenAIApiKey, r as normalizeManualAuthProvider, t as saveModelProviderApiKey } from "./auth-api-key-DwRUc4KW.mjs";
import { a as withoutProviderModelPolicy, i as prepareProviderModelAccess, n as applyProviderLoginDefaultModel, r as completeProviderModelAccess } from "./auth-model-policy-CisYb0MB.mjs";
import { n as writeProviderAuthConfig, t as createProviderAuthConfigPatch } from "./provider-auth-config-DHVR-C-n.mjs";
import "./copilot-runtime-plugin-install-DJjDc5z0.mjs";
import { cancel, confirm, isCancel, password, select, text } from "@clack/prompts";
//#region src/commands/models/auth-credential-import.ts
/** Imports only the credential item declared by the selected login method. */
async function tryImportProviderCredential(params) {
	const spec = params.method.credentialImport;
	if (!spec) return;
	const provider = normalizeProviderId(params.providerId);
	params.signal?.throwIfAborted();
	return await withPluginMigrationProviders({
		providerId: spec.migrationProviderId,
		cfg: params.config
	}, async (providers) => {
		const owner = providers.find((candidate) => candidate.id === spec.migrationProviderId);
		if (!owner) return;
		const context = buildMigrationContext({
			targetAgentId: params.agentId,
			itemKinds: ["auth"],
			includeSecrets: true,
			configOverride: params.config,
			providerOptions: {
				allowKeychainPrompt: true,
				credentialKind: spec.credentialKind,
				configPatchMode: "none"
			},
			runtime: params.runtime
		});
		if (params.signal) context.signal = params.signal;
		const plan = await owner.plan(context);
		const candidates = plan.items.filter((item) => item.id === spec.itemId);
		if (candidates.length > 1) throw new Error("The credential import has an ambiguous item identity.");
		const candidate = candidates[0];
		if (candidate?.status === "skipped" && candidate.details?.credentialImportUnavailable === true) return candidate.message ? { unavailableReason: candidate.message } : void 0;
		if (candidate?.kind !== "auth" || candidate.status !== "planned" || candidate.details?.credentialKind !== spec.credentialKind) return;
		if (typeof candidate.details.provider !== "string" || normalizeProviderId(candidate.details.provider) !== provider) throw new Error("The credential import belongs to another provider.");
		params.signal?.throwIfAborted();
		await params.beforePersistentEffect?.();
		params.signal?.throwIfAborted();
		const imported = (await owner.apply(context, applyMigrationItemSelection(plan, [spec.itemId]))).items.find((item) => item.id === spec.itemId && item.kind === "auth" && item.status === "migrated");
		const profileId = imported?.details?.profileId;
		if (typeof profileId !== "string" || !profileId.trim() || typeof imported?.details?.provider !== "string" || normalizeProviderId(imported.details.provider) !== provider || imported.details.credentialKind !== spec.credentialKind) throw new Error("The existing provider credential changed during import. Start the sign-in again.");
		return {
			profileId: profileId.trim(),
			provider,
			mode: spec.credentialKind,
			configUpdated: imported.details.configUpdated === true
		};
	});
}
//#endregion
//#region src/commands/models/auth.ts
/** Commands for adding, pasting, and logging into provider model auth profiles. */
function resolveManualTokenExpiryMs(expiresIn) {
	const normalizedExpiresIn = normalizeStringifiedOptionalString(expiresIn);
	if (!normalizedExpiresIn) return;
	const durationMs = parseDurationMs(normalizedExpiresIn, { defaultUnit: "d" });
	const expires = resolveExpiresAtMsFromDurationMs(durationMs);
	if (expires === void 0) throw new Error("Invalid expiry duration: resulting token expiry is outside Date range.");
	return expires;
}
function guardCancel(value) {
	if (typeof value === "symbol" || isCancel(value)) {
		cancel("Cancelled.");
		process.exit(0);
	}
	return value;
}
const confirm$1 = async (params) => guardCancel(await confirm({
	...params,
	message: stylePromptMessage(params.message)
}));
const text$1 = async (params) => guardCancel(await text({
	...params,
	message: stylePromptMessage(params.message)
}));
const password$1 = async (params) => guardCancel(await password({
	...params,
	message: stylePromptMessage(params.message)
}));
const select$1 = async (params) => guardCancel(await select(styleSelectParams(params)));
const MODELS_AUTH_STDIN_MAX_BYTES = 1048576;
async function readPipedStdin() {
	return (await readByteStreamWithLimit(process.stdin, {
		maxBytes: MODELS_AUTH_STDIN_MAX_BYTES,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Piped auth input exceeds ${maxBytes} bytes.`)
	})).toString("utf8");
}
async function readPastedSecret(params) {
	const promptParams = {
		message: params.message,
		validate: params.validate
	};
	const input = process.stdin.isTTY ? await (params.masked ? password$1(promptParams) : text$1(promptParams)) : await readPipedStdin();
	const normalized = normalizeSecretInput(input);
	const validationMessage = params.validate?.(normalized);
	if (validationMessage) throw new Error(validationMessage);
	return normalized;
}
function isOpenAIProvider(provider) {
	return normalizeManualAuthProvider(provider) === "openai";
}
function listProvidersWithAuthMethods(providers) {
	return providers.filter((provider) => provider.auth.length > 0);
}
function listTokenAuthMethods(provider) {
	return provider.auth.filter((method) => method.kind === "token");
}
function listProvidersWithTokenMethods(providers) {
	return providers.filter((provider) => listTokenAuthMethods(provider).length > 0);
}
function mergeSetupProviders(providers, setupProviders) {
	if (setupProviders.length === 0) return [...providers];
	const setupById = new Map(setupProviders.map((provider) => [normalizeProviderId(provider.id), provider]));
	const merged = providers.map((provider) => setupById.get(normalizeProviderId(provider.id)) ?? provider);
	const existing = new Set(merged.map((provider) => normalizeProviderId(provider.id)));
	for (const provider of setupProviders) if (!existing.has(normalizeProviderId(provider.id))) merged.push(provider);
	return merged;
}
function preferSetupAuthProviders(params) {
	if (params.ownerPluginId) return mergeSetupProviders(params.providers, resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		pluginIds: [params.ownerPluginId]
	}).providers.map((entry) => entry.provider));
	const requestedProvider = params.requestedProvider ? normalizeManualAuthProvider(params.requestedProvider) : void 0;
	if (requestedProvider) {
		const setupProvider = resolvePluginSetupProviderCore({
			provider: requestedProvider,
			config: params.config,
			workspaceDir: params.workspaceDir
		});
		return setupProvider ? [setupProvider] : [...params.providers];
	}
	const setupProviders = resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir
	}).providers.map((entry) => entry.provider);
	return mergeSetupProviders(params.providers, setupProviders);
}
async function resolveModelsAuthContext(params) {
	const configSnapshot = await loadValidConfigSnapshotOrThrow();
	const config = params?.config ?? configSnapshot.runtimeConfig;
	const { agentId, agentDir } = await resolveModelsAuthAgent(params?.rawAgentId, config);
	const workspaceDir = resolveAgentWorkspaceDir(config, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const requestedProvider = params?.requestedProvider?.trim();
	const providerRef = requestedProvider ? normalizeManualAuthProvider(requestedProvider) : void 0;
	return {
		config,
		configSnapshot,
		agentId,
		agentDir,
		workspaceDir,
		providers: preferSetupAuthProviders({
			providers: resolvePluginProvidersCore({
				config,
				workspaceDir,
				mode: "setup",
				includeUntrustedWorkspacePlugins: false,
				...params?.ownerPluginId ? { onlyPluginIds: [params.ownerPluginId] } : {},
				...providerRef ? { providerRefs: [providerRef] } : {}
			}),
			config,
			workspaceDir,
			requestedProvider: providerRef,
			ownerPluginId: params?.ownerPluginId
		})
	};
}
async function resolveModelsAuthAgent(rawAgentId, config) {
	const cfg = config ?? (await loadValidConfigSnapshotOrThrow()).runtimeConfig;
	return resolveModelsTargetAgent(cfg, rawAgentId ?? void 0, { kind: "mutation" });
}
function resolveRequestedProviderOrThrow(providers, rawProvider) {
	const requested = rawProvider?.trim();
	if (!requested) return null;
	const matched = resolveProviderMatch(providers, requested);
	if (matched) return matched;
	const available = providers.map((provider) => provider.id).filter(Boolean).toSorted((a, b) => a.localeCompare(b));
	const availableText = available.length > 0 ? available.join(", ") : "(none)";
	throw new Error(`Unknown provider "${requested}". Loaded providers: ${availableText}. Verify plugins via \`${formatCliCommand("openclaw plugins list --json")}\`.`);
}
function resolveTokenMethodOrThrow(provider, rawMethod) {
	const tokenMethods = listTokenAuthMethods(provider);
	if (rawMethod?.trim()) {
		const matched = pickAuthMethod(provider, rawMethod);
		if (matched && matched.kind === "token") return matched;
		const available = tokenMethods.map((method) => method.id).join(", ") || "(none)";
		throw new Error(`Unknown token auth method "${rawMethod}" for provider "${provider.id}". Available token methods: ${available}.`);
	}
	return null;
}
async function pickProviderAuthMethod(params) {
	const rawRequestedMethod = params.requestedMethod?.trim();
	if (rawRequestedMethod) return pickAuthMethod(params.provider, rawRequestedMethod);
	const oauthMethod = params.provider.auth.find((method) => method.kind === "oauth");
	if (oauthMethod) return oauthMethod;
	if (params.provider.auth.length === 1) return params.provider.auth[0] ?? null;
	return await params.prompter.select({
		message: `Auth method for ${params.provider.label}`,
		options: params.provider.auth.map((method) => ({
			value: method.id,
			label: method.label,
			hint: method.hint
		}))
	}).then((id) => params.provider.auth.find((method) => method.id === id) ?? null);
}
async function pickProviderTokenMethod(params) {
	const explicitTokenMethod = resolveTokenMethodOrThrow(params.provider, params.requestedMethod);
	if (explicitTokenMethod) return explicitTokenMethod;
	const tokenMethods = listTokenAuthMethods(params.provider);
	if (tokenMethods.length === 0) return null;
	const setupTokenMethod = tokenMethods.find((method) => method.id === "setup-token");
	if (setupTokenMethod) return setupTokenMethod;
	if (tokenMethods.length === 1) return tokenMethods[0] ?? null;
	return await params.prompter.select({
		message: `Token method for ${params.provider.label}`,
		options: tokenMethods.map((method) => ({
			value: method.id,
			label: method.label,
			hint: method.hint
		}))
	}).then((id) => tokenMethods.find((method) => method.id === id) ?? null);
}
async function refreshProviderAuthAfterLogin(params) {
	if (!params.refreshAfterLogin) return refreshRunningGatewayAuthState(params.agentId, "login", params.runtime);
	try {
		await params.refreshAfterLogin(params.agentId);
		return "refreshed";
	} catch {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		return "gateway-rejected";
	}
}
async function persistProviderAuthResult(params) {
	const defaultModel = params.result.defaultModel ? normalizeAgentModelRefForConfig(params.result.defaultModel) : void 0;
	const profiles = params.profiles ?? params.result.profiles;
	const persistedProfiles = [];
	const loginConfig = applyProviderAuthConfigPatch(params.config, {});
	const configPatch = params.result.configPatch ? createProviderAuthConfigPatch(loginConfig, restorePriorAgentsDefaultsModelUnlessOptIn({
		cfg: applyProviderAuthConfigPatch(loginConfig, profiles.length > 0 ? withoutProviderModelPolicy(params.result.configPatch, loginConfig) : params.result.configPatch, { replaceDefaultModels: params.result.replaceDefaultModels }),
		priorAgentsDefaultsModel: loginConfig.agents?.defaults?.model,
		setDefault: params.setDefault
	})) : void 0;
	const shouldUpdateConfig = isRecord(configPatch) && Object.keys(configPatch).length > 0 || Boolean(params.setDefault && defaultModel);
	if (profiles.length > 0 || shouldUpdateConfig) await params.beforePersistentEffect?.();
	try {
		for (const candidate of profiles) {
			const persisted = await persistProviderAuthProfilesAfterLogin({
				profiles: [candidate],
				beforeWrite: params.assertCurrent,
				config: params.config,
				env: params.env,
				agentDir: params.agentDir,
				...params.env?.OPENCLAW_STATE_DIR ? { stateDir: params.env.OPENCLAW_STATE_DIR } : {}
			});
			const profile = expectDefined(persisted[0], "persisted auth profile");
			persistedProfiles.push(profile);
			params.assertCurrent?.();
			await promotePersistedAuthProfile({
				config: params.config,
				agentDir: params.agentDir,
				provider: profile.credential.provider,
				profileId: profile.profileId
			});
		}
		if (shouldUpdateConfig) {
			const updated = await writeProviderAuthConfig({
				config: params.config,
				configSnapshot: params.configSnapshot,
				configPatch,
				credentialsSaved: persistedProfiles.length > 0,
				writeOptions: { assertCurrent: params.assertCurrent },
				finalizeConfig: (replayed, cfg) => {
					const priorAgentsDefaultsModel = cfg.agents?.defaults?.model;
					const next = restorePriorAgentsDefaultsModelUnlessOptIn({
						cfg: replayed,
						priorAgentsDefaultsModel,
						setDefault: params.setDefault
					});
					if (params.setDefault && defaultModel) return profiles.length > 0 ? applyProviderLoginDefaultModel(next, defaultModel) : applyDefaultModel(next, defaultModel);
					return next;
				}
			});
			if (defaultModel) {
				const repaired = await repairCodexRuntimePluginInstallForModelSelection({
					cfg: updated,
					model: defaultModel
				});
				const copilotRepaired = await repairCopilotRuntimePluginInstallForModelSelection({
					cfg: updated,
					model: defaultModel
				});
				for (const warning of [...repaired.warnings, ...copilotRepaired.warnings]) params.runtime.error?.(warning);
			}
			logConfigUpdated(params.runtime);
		}
		const authRefresh = await refreshProviderAuthAfterLogin(params);
		for (const profile of persistedProfiles) params.runtime.log(`Auth profile: ${profile.profileId} (${profile.credential.provider}/${credentialMode(profile.credential)})`);
		if (defaultModel) params.runtime.log(params.setDefault ? `Default model set to ${defaultModel}` : `Default model available: ${defaultModel} (current default unchanged; run ${formatCliCommand(`openclaw models set ${defaultModel}`)} to apply)`);
		if (params.result.notes && params.result.notes.length > 0) await params.prompter.note(params.result.notes.join("\n"), "Provider notes");
		return {
			profiles: persistedProfiles,
			authRefresh
		};
	} catch (error) {
		if (persistedProfiles.length > 0 && !(error instanceof ProviderCredentialsSavedError)) throw new ProviderCredentialsSavedError(error instanceof Error ? `Provider credentials were saved, but sign-in did not finish: ${error.message}` : "Provider credentials were saved, but sign-in did not finish.", { cause: error });
		throw error;
	}
}
function resolveConfiguredAuthSelectionForProvider(cfg, provider) {
	const providerAuthKey = resolveProviderIdForAuth(provider, { config: cfg });
	for (const [orderProvider, profileIds] of Object.entries(cfg.auth?.order ?? {})) if (profileIds.length > 0 && resolveProviderIdForAuth(orderProvider, { config: cfg }) === providerAuthKey) return {
		createIfMissing: true,
		order: profileIds
	};
	const profileIds = Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => resolveProviderIdForAuth(profile.provider, {
		config: cfg,
		storedCredential: true
	}) === providerAuthKey).map(([profileId]) => profileId);
	return profileIds.length > 0 ? {
		createIfMissing: true,
		order: profileIds
	} : { createIfMissing: false };
}
async function promotePersistedAuthProfile(params) {
	const selection = resolveConfiguredAuthSelectionForProvider(params.config, params.provider);
	if (!(await promoteAuthProfileInOrder({
		agentDir: params.agentDir,
		provider: params.provider,
		profileId: params.profileId,
		createIfMissing: selection.createIfMissing,
		...selection.order ? { createFromOrder: selection.order } : {}
	})).ok) throw new ProviderCredentialsSavedError("The auth profile was saved, but its order could not be updated because the auth store is busy. Wait a moment, then retry the login.");
}
async function runProviderAuthMethod(params) {
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	const modelAccess = prepareProviderModelAccess({
		config: params.config,
		agentId: params.agentId,
		provider: params.provider.id,
		providerLabel: params.provider.label
	});
	const result = await runProviderPluginAuthMethodUnpersisted({
		method: params.method,
		config: params.config,
		credentialOnly: params.credentialOnly,
		assertCurrent: params.assertCurrent,
		env: params.env ?? process.env,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		prompter: params.prompter,
		runtime: params.runtime,
		allowSecretRefPrompt: false,
		isRemote: params.isRemote,
		signal: params.signal,
		openUrl: params.openUrl,
		browserAuthorization: params.browserAuthorization
	});
	params.signal?.throwIfAborted();
	const connectionResult = params.credentialOnly ? {
		profiles: result.profiles,
		notes: result.notes,
		...result.configPatch ? { configPatch: {
			...result.configPatch.models?.providers ? { models: { providers: result.configPatch.models.providers } } : {},
			...result.configPatch.plugins ? { plugins: result.configPatch.plugins } : {}
		} } : {}
	} : result;
	const { profiles: persistedProfiles, authRefresh } = await persistProviderAuthResult({
		result: connectionResult,
		profiles: resolveLoginProfiles({
			result: connectionResult,
			requestedProfileId: params.profileId
		}),
		assertCurrent: params.assertCurrent,
		signal: params.signal,
		config: params.config,
		configSnapshot: params.configSnapshot,
		agentId: params.agentId,
		agentDir: params.agentDir,
		runtime: params.runtime,
		prompter: params.prompter,
		setDefault: params.setDefault,
		env: params.env ?? process.env,
		beforePersistentEffect: params.beforePersistentEffect,
		refreshAfterLogin: params.refreshAfterLogin
	});
	if (persistedProfiles.length > 0) await completeProviderModelAccess({
		prepared: modelAccess,
		prompter: params.prompter,
		onRequested: params.onModelAccessRequested,
		runtime: params.runtime,
		assertCurrent: () => {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
		}
	}).catch((error) => {
		throw new ProviderAuthConfigApplyError(error);
	});
	return {
		result: connectionResult,
		profiles: persistedProfiles,
		authRefresh
	};
}
/** Runs an interactive provider setup-token auth flow. */
async function modelsAuthSetupTokenCommand(opts, runtime) {
	if (!process.stdin.isTTY) throw new Error(`setup-token requires an interactive TTY. In automation, use ${formatCliCommand("openclaw models auth paste-token --provider <provider>")} instead.`);
	const { config, configSnapshot, agentId, agentDir, workspaceDir, providers } = await resolveModelsAuthContext({
		requestedProvider: opts.provider,
		rawAgentId: opts.agent
	});
	const tokenProviders = listProvidersWithTokenMethods(providers);
	if (tokenProviders.length === 0) throw new Error(`No provider token-auth plugins found. Install one via \`${formatCliCommand("openclaw plugins install")}\`.`);
	const provider = resolveRequestedProviderOrThrow(tokenProviders, opts.provider) ?? tokenProviders[0] ?? null;
	if (!provider) throw new Error(`No token-capable provider is available. Run ${formatCliCommand("openclaw plugins list")} to verify provider plugins are installed.`);
	if (!opts.yes) {
		if (!await confirm$1({
			message: `Continue with ${provider.label} token auth?`,
			initialValue: true
		})) return;
	}
	const prompter = createClackPrompter();
	const method = await pickProviderTokenMethod({
		provider,
		prompter
	});
	if (!method) throw new Error(`Provider "${provider.id}" does not expose a token auth method.`);
	await runProviderAuthMethod({
		config,
		configSnapshot,
		agentId,
		agentDir,
		workspaceDir,
		provider,
		method,
		runtime,
		prompter
	});
}
/** Reads a pasted bearer/setup token and stores it as an auth profile. */
async function modelsAuthPasteTokenCommand(opts, runtime) {
	const { agentId, agentDir } = await resolveModelsAuthAgent(opts.agent);
	const rawProvider = normalizeOptionalString(opts.provider);
	if (!rawProvider) throw new Error(`Missing --provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to choose a provider.`);
	const provider = normalizeManualAuthProvider(rawProvider);
	const profileId = normalizeOptionalString(opts.profileId) || resolveDefaultTokenProfileId(provider);
	const validateTokenInput = (value) => {
		const trimmed = value?.trim();
		if (!trimmed) return "Required";
		if (provider === "anthropic") return validateAnthropicSetupToken(trimmed.replaceAll(/\s+/g, ""));
		if (isOpenAIProvider(provider) && looksLikeOpenAIApiKey(trimmed)) return `That looks like an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-api-key --provider openai")} for API-key auth.`;
	};
	const tokenInput = await readPastedSecret({
		message: `Paste token for ${provider}`,
		masked: true,
		validate: validateTokenInput
	});
	const token = provider === "anthropic" ? tokenInput.replaceAll(/\s+/g, "").trim() : normalizeOptionalString(tokenInput) ?? "";
	const expires = resolveManualTokenExpiryMs(opts.expiresIn);
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential: {
			type: "token",
			provider,
			token,
			...expires ? { expires } : {}
		},
		agentDir
	});
	await updateConfig((cfg) => applyAuthProfileConfig(cfg, {
		profileId,
		provider,
		mode: "token"
	}));
	await refreshRunningGatewayAuthState(agentId, "login", runtime);
	logConfigUpdated(runtime);
	runtime.log(`Auth profile: ${profileId} (${provider}/token)`);
	if (provider === "anthropic") {
		runtime.log("Anthropic setup-token auth is supported in OpenClaw.");
		runtime.log("OpenClaw prefers Claude CLI reuse when it is available on the host.");
		runtime.log("Anthropic staff told us this OpenClaw path is allowed again.");
	}
}
/** Reads a pasted API key and stores it as an auth profile. */
async function modelsAuthPasteApiKeyCommand(opts, runtime) {
	const config = (await loadValidConfigSnapshotOrThrow()).runtimeConfig;
	const { agentId, agentDir } = await resolveModelsAuthAgent(opts.agent, config);
	const rawProvider = normalizeOptionalString(opts.provider);
	if (!rawProvider) throw new Error(`Missing --provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to choose a provider.`);
	const provider = normalizeManualAuthProvider(rawProvider);
	const key = await readPastedSecret({
		message: `Paste API key for ${provider}`,
		masked: true,
		validate: (value) => {
			const trimmed = value?.trim();
			if (!trimmed) return "Required";
			if (isOpenAIProvider(provider)) return validateOpenAICodexApiKeyInput(trimmed);
		}
	});
	const { profileId, warning } = await saveModelProviderApiKey({
		config,
		provider,
		apiKey: key,
		agentDir,
		profileId: normalizeOptionalString(opts.profileId)
	});
	await refreshRunningGatewayAuthState(agentId, "login", runtime);
	if (warning) runtime.error(warning);
	logConfigUpdated(runtime);
	runtime.log(`Auth profile: ${profileId} (${provider}/api_key)`);
}
/** Interactive helper for adding token auth profiles, with provider/method prompts. */
async function modelsAuthAddCommand(opts, runtime) {
	const { config, configSnapshot, agentId, agentDir, workspaceDir, providers } = await resolveModelsAuthContext({ rawAgentId: opts.agent });
	const tokenProviders = listProvidersWithTokenMethods(providers);
	const provider = await select$1({
		message: "Token provider",
		options: [...tokenProviders.map((providerPlugin) => ({
			value: providerPlugin.id,
			label: providerPlugin.id,
			hint: providerPlugin.docsPath ? `Docs: ${providerPlugin.docsPath}` : void 0
		})), {
			value: "custom",
			label: "custom (type provider id)"
		}]
	});
	const providerId = provider === "custom" ? normalizeProviderId(await text$1({
		message: "Provider id",
		validate: (value) => value?.trim() ? void 0 : "Required"
	})) : provider;
	const providerPlugin = provider === "custom" ? null : resolveRequestedProviderOrThrow(tokenProviders, providerId);
	if (providerPlugin) {
		const tokenMethods = listTokenAuthMethods(providerPlugin);
		const methodId = tokenMethods.length > 0 ? await select$1({
			message: "Token method",
			options: [...tokenMethods.map((method) => ({
				value: method.id,
				label: method.label,
				hint: method.hint
			})), {
				value: "paste",
				label: "paste token"
			}]
		}) : "paste";
		if (methodId !== "paste") {
			const prompter = createClackPrompter();
			const method = tokenMethods.find((candidate) => candidate.id === methodId);
			if (!method) throw new Error(`Unknown token auth method "${methodId}". Run ${formatCliCommand("openclaw models auth login --provider " + providerPlugin.id)} to choose interactively.`);
			await runProviderAuthMethod({
				config,
				configSnapshot,
				agentId,
				agentDir,
				workspaceDir,
				provider: providerPlugin,
				method,
				runtime,
				prompter
			});
			return;
		}
	}
	const profileIdDefault = resolveDefaultTokenProfileId(providerId);
	await modelsAuthPasteTokenCommand({
		provider: providerId,
		profileId: (await text$1({
			message: "Profile id",
			initialValue: profileIdDefault,
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim(),
		expiresIn: await confirm$1({
			message: "Does this token expire?",
			initialValue: false
		}) ? (await text$1({
			message: "Expires in (duration)",
			initialValue: "365d",
			validate: (value) => {
				try {
					parseDurationMs(value ?? "", { defaultUnit: "d" });
					return;
				} catch {
					return "Invalid duration (e.g. 365d, 12h, 30m)";
				}
			}
		})).trim() : void 0,
		agent: opts.agent
	}, runtime);
}
/** Resolves a requested login provider or throws with available provider details. */
function resolveRequestedLoginProviderOrThrow(providers, rawProvider) {
	return resolveRequestedProviderOrThrow(providers, rawProvider);
}
function credentialMode(credential) {
	if (credential.type === "api_key") return "api_key";
	if (credential.type === "token") return "token";
	return "oauth";
}
/** Applies an optional profile-id override to a single returned login profile. */
function resolveLoginProfiles(params) {
	const requestedProfileId = params.requestedProfileId?.trim();
	if (!requestedProfileId) return params.result.profiles;
	if (params.result.profiles.length !== 1) throw new Error("--profile-id requires exactly one returned auth profile from the selected auth method.");
	const [profile] = params.result.profiles;
	return [{
		...expectDefined(profile, "auth profile"),
		profileId: requestedProfileId
	}];
}
function maybeLogOpenAICodexNativeSearchTip(runtime, providerId) {
	if (providerId !== "openai") return;
	runtime.log(`Tip: Codex-capable models can use native Codex web search. Configure the \`web_search\` tool with \`${formatCliCommand("openclaw configure --section web")}\`. Docs: https://docs.openclaw.ai/tools/web`);
}
async function runModelsAuthLoginFlowCore(opts) {
	return runModelsAuthLoginFlow(opts, true);
}
async function runModelsAuthLoginFlowForGateway(opts) {
	return runModelsAuthLoginFlow(opts, false);
}
async function runModelsAuthLoginFlow(opts, showScopeNote) {
	const requestedProviderId = opts.provider ? normalizeManualAuthProvider(opts.provider) : void 0;
	let context = await resolveModelsAuthContext({
		requestedProvider: requestedProviderId,
		rawAgentId: opts.agent,
		config: opts.config,
		ownerPluginId: opts.ownerPluginId
	});
	const prompter = opts.prompter;
	let authProviders = listProvidersWithAuthMethods(context.providers);
	let requestedProvider = requestedProviderId ? resolveProviderMatch(authProviders, requestedProviderId) : null;
	const useProviderPicker = !opts.ownerPluginId && requestedProviderId !== void 0 && requestedProvider === null && isCliProvider(requestedProviderId, context.config);
	if (useProviderPicker) {
		context = await resolveModelsAuthContext({
			rawAgentId: opts.agent,
			config: context.config
		});
		authProviders = listProvidersWithAuthMethods(context.providers);
	}
	if (authProviders.length === 0) throw new Error(`No provider plugins found. Install one via \`${formatCliCommand("openclaw plugins install")}\`.`);
	if (useProviderPicker) await prompter.note(`Provider "${requestedProviderId}" uses its own CLI login. Select a provider with an OpenClaw auth flow.`, "Provider auth");
	else if (requestedProviderId && !requestedProvider) requestedProvider = resolveRequestedLoginProviderOrThrow(authProviders, requestedProviderId);
	if (showScopeNote) await prompter.note([
		"Scope: System / agent",
		`Agent: ${context.agentId}`,
		"Location: the machine running OpenClaw",
		`For personal model accounts on a Gateway, run ${formatCliCommand("openclaw models accounts login --help")}.`
	].join("\n"), "Provider sign-in");
	const selectedProvider = requestedProvider ?? await prompter.select({
		message: "Select a provider",
		options: authProviders.map((provider) => ({
			value: provider.id,
			label: provider.label,
			hint: provider.docsPath ? `Docs: ${provider.docsPath}` : void 0
		}))
	}).then((id) => resolveProviderMatch(authProviders, id));
	if (!selectedProvider) throw new Error(`Unknown provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to see available provider plugins.`);
	if (opts.ownerPluginId && selectedProvider.id !== opts.provider) throw new Error("The selected provider login is no longer available.");
	const chosenMethod = opts.ownerPluginId ? selectedProvider.auth.find((method) => method.id === opts.method) : await pickProviderAuthMethod({
		provider: selectedProvider,
		requestedMethod: opts.method,
		prompter
	});
	if (!chosenMethod) throw new Error(`Unknown auth method. Run ${formatCliCommand("openclaw models auth login --provider " + selectedProvider.id)} without --method to choose interactively.`);
	const modelAccess = prepareProviderModelAccess({
		config: context.config,
		agentId: context.agentId,
		provider: selectedProvider.id,
		providerLabel: selectedProvider.label
	});
	const imported = !opts.credentialOnly && !opts.force && !opts.profileId && !opts.setDefault ? await tryImportProviderCredential({
		method: chosenMethod,
		providerId: selectedProvider.id,
		config: context.config,
		agentId: context.agentId,
		runtime: opts.runtime,
		signal: opts.signal,
		beforePersistentEffect: opts.beforePersistentEffect
	}) : void 0;
	if (imported && "unavailableReason" in imported) await prompter.note(imported.unavailableReason, "Existing CLI sign-in");
	else if (imported) {
		await promotePersistedAuthProfile({
			config: context.config,
			agentDir: context.agentDir,
			provider: imported.provider,
			profileId: imported.profileId
		});
		const authRefresh = await refreshProviderAuthAfterLogin({
			...opts,
			agentId: context.agentId
		});
		if (imported.configUpdated) logConfigUpdated(opts.runtime);
		opts.runtime.log(`Auth profile: ${imported.profileId} (${imported.provider}/${imported.mode}, imported)`);
		await completeProviderModelAccess({
			prepared: modelAccess,
			prompter,
			onRequested: opts.onModelAccessRequested,
			runtime: opts.runtime,
			assertCurrent: () => {
				opts.signal?.throwIfAborted();
				opts.assertCurrent?.();
			}
		}).catch((error) => {
			throw new ProviderAuthConfigApplyError(error);
		});
		return {
			providerId: selectedProvider.id,
			methodId: chosenMethod.id,
			authRefresh,
			imported: true,
			profiles: [{
				profileId: imported.profileId,
				provider: imported.provider,
				mode: imported.mode
			}]
		};
	}
	if (opts.force) {
		await opts.beforePersistentEffect?.();
		try {
			if (!await removeProviderAuthProfilesWithLock({
				cfg: context.config,
				provider: selectedProvider.id,
				agentDir: context.agentDir
			})) throw new Error("auth store is busy; close other OpenClaw commands using this state directory and retry");
			opts.runtime.log(`Removed cached auth profiles for provider "${selectedProvider.id}" (--force). Running fresh auth flow.`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			throw new Error(`Could not clear cached profiles for "${selectedProvider.id}" before re-login: ${message}. Re-login was not started because --force must remove cached profiles first.`, { cause: err });
		}
		await refreshRunningGatewayAuthState(context.agentId, "logout", opts.runtime);
	}
	const { result, profiles, authRefresh } = await runProviderAuthMethod({
		config: context.config,
		configSnapshot: context.configSnapshot,
		agentId: context.agentId,
		agentDir: context.agentDir,
		workspaceDir: context.workspaceDir,
		provider: selectedProvider,
		method: chosenMethod,
		runtime: opts.runtime,
		prompter,
		profileId: opts.profileId,
		setDefault: opts.setDefault,
		credentialOnly: opts.credentialOnly,
		assertCurrent: opts.assertCurrent,
		env: opts.env,
		isRemote: opts.isRemote,
		signal: opts.signal,
		openUrl: opts.openUrl,
		browserAuthorization: opts.browserAuthorization,
		beforePersistentEffect: opts.beforePersistentEffect,
		refreshAfterLogin: opts.refreshAfterLogin,
		onModelAccessRequested: opts.onModelAccessRequested
	});
	maybeLogOpenAICodexNativeSearchTip(opts.runtime, selectedProvider.id);
	return {
		providerId: selectedProvider.id,
		methodId: chosenMethod.id,
		authRefresh,
		...result.defaultModel ? { defaultModel: result.defaultModel } : {},
		profiles: profiles.map((profile) => ({
			profileId: profile.profileId,
			provider: profile.credential.provider,
			mode: credentialMode(profile.credential)
		}))
	};
}
async function modelsAuthLoginCommand(opts, runtime) {
	if (!process.stdin.isTTY) throw new Error(`models auth login requires an interactive TTY. In automation, use ${formatCliCommand("openclaw models auth paste-token --provider <provider>")} when token auth is available.`);
	await runModelsAuthLoginFlowCore({
		...opts,
		runtime,
		prompter: createClackPrompter()
	});
}
//#endregion
export { modelsAuthSetupTokenCommand as a, runModelsAuthLoginFlowForGateway as c, modelsAuthPasteTokenCommand as i, modelsAuthLoginCommand as n, resolveRequestedLoginProviderOrThrow as o, modelsAuthPasteApiKeyCommand as r, runModelsAuthLoginFlowCore as s, modelsAuthAddCommand as t };
