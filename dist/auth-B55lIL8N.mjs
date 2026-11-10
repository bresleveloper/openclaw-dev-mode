import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import "./utils-gjJ-tD2q.mjs";
import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { f as resolveSharedMainAuthAgentDir } from "./path-resolve-21Orzn6B.mjs";
import { z as listRuntimeLocalProfileIds } from "./runtime-snapshots-HRosak4u.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as parseDurationMs } from "./parse-duration-B7MSnEK8.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { i as resolvePluginSetupRegistry, r as resolvePluginSetupProviderCore } from "./setup-registry-CGxNMBUk.mjs";
import { h as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CwqGD12G.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-a08sP-.mjs";
import { a as removeProviderAuthProfilesWithLock, d as upsertAuthProfileWithLockOrThrow, r as promoteAuthProfileInOrder } from "./profiles-Df1OQ7iN.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-CGIaZ9Jy.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { n as ProviderCredentialsSavedError, t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-4ptnbByb.mjs";
import { a as repairModelSelectionRuntimePlugins } from "./runtime-plugin-install-Ri1rsDAR.mjs";
import { a as restorePriorAgentsDefaultsModelUnlessOptIn, n as pickAuthMethod, r as resolveProviderMatch, t as applyProviderAuthConfigPatch } from "./provider-auth-choice-helpers-HmDkCc1z.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-olPFvVdo.mjs";
import { n as persistProviderAuthProfilesAfterLogin } from "./provider-auth-persistence-3GlMaVWE.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { i as loadValidConfigSnapshotOrThrow, l as resolveModelsTargetAgent, u as updateConfig } from "./shared-Ck_WZImY.mjs";
import { n as validateAnthropicSetupToken } from "./provider-auth-token-Bw-5VAtG.mjs";
import { c as select$2, l as text$2, r as confirm$2, s as password$2 } from "./configure.shared-zeOIE-aJ.mjs";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-Dh7Q8jDp.mjs";
import { t as buildMigrationContext } from "./context-DiwhcEH1.mjs";
import { t as applyMigrationItemSelection } from "./item-selection-CPtdOlQi.mjs";
import { n as refreshRunningGatewayAuthState, t as refreshProviderAuthAfterLogin } from "./auth-refresh-vo4_5i4e.mjs";
import { i as validateOpenAICodexApiKeyInput, n as normalizeManualAuthProvider, r as resolveDefaultTokenProfileId, t as looksLikeOpenAIApiKey } from "./auth-manual-input-D5E4UzkF.mjs";
import { t as saveModelProviderApiKey } from "./auth-api-key-DvRzMJ5e.mjs";
import { a as withoutProviderModelPolicy, i as prepareProviderModelAccess, n as applyProviderLoginDefaultModel, r as completeProviderModelAccess } from "./auth-model-policy-B9KdPrcB.mjs";
import { n as writeProviderAuthConfig, t as createProviderAuthConfigPatch } from "./provider-auth-config-BGj2S1UU.mjs";
import path from "node:path";
import { cancel } from "@clack/prompts";
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
//#region src/commands/models/auth-profile-promotion.ts
async function promotePersistedAuthProfile(params) {
	const cfg = params.config;
	const providerAuthKey = resolveProviderIdForAuth(params.provider, { config: cfg });
	const order = Object.entries(cfg.auth?.order ?? {}).find(([orderProvider, profileIds]) => profileIds.length > 0 && resolveProviderIdForAuth(orderProvider, { config: cfg }) === providerAuthKey)?.[1] ?? Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => resolveProviderIdForAuth(profile.provider, {
		config: cfg,
		storedCredential: true
	}) === providerAuthKey).map(([profileId]) => profileId);
	if (!(await promoteAuthProfileInOrder({
		agentDir: params.agentDir,
		provider: params.provider,
		profileId: params.profileId,
		assertCurrent: params.assertCurrent,
		createIfMissing: order.length > 0,
		...order.length > 0 ? { createFromOrder: order } : {}
	})).ok) throw new ProviderCredentialsSavedError("The auth profile was saved, but its order could not be updated because the auth store is busy. Wait a moment, then retry the login.");
}
//#endregion
//#region src/commands/models/auth-relogin-identity.ts
function snapshotReloginAuthProfiles(params) {
	if (!params.matchesPersonalAccount) return;
	const storeAgentDir = path.resolve(params.agentDir) === path.resolve(resolveSharedMainAuthAgentDir()) ? void 0 : params.agentDir;
	const store = loadAuthProfileStoreWithoutExternalProfiles(storeAgentDir);
	return Object.fromEntries(listRuntimeLocalProfileIds(store).flatMap((profileId) => {
		const credential = store.profiles[profileId];
		return credential ? [[profileId, credential]] : [];
	}));
}
function resolveReloginProfileIdentity(params) {
	const requestedProfileId = params.requestedProfileId?.trim();
	if (requestedProfileId) {
		if (params.profiles.length !== 1) throw new Error("--profile-id requires exactly one returned auth profile from the selected auth method.");
		return { profiles: [{
			...expectDefined(params.profiles[0], "auth profile"),
			profileId: requestedProfileId
		}] };
	}
	const matcher = params.matchesPersonalAccount;
	if (!matcher || !params.existingProfiles || params.profiles.length !== 1) return { profiles: params.profiles };
	const returnedProfile = expectDefined(params.profiles[0], "auth profile");
	const matchingProfileIds = [];
	for (const [profileId, credential] of Object.entries(params.existingProfiles)) try {
		if (matcher(returnedProfile.credential, credential)) matchingProfileIds.push(profileId);
	} catch {
		return { profiles: params.profiles };
	}
	if (matchingProfileIds.length !== 1) return { profiles: params.profiles };
	const reusedProfileId = expectDefined(matchingProfileIds[0], "matched auth profile id");
	return {
		profiles: [{
			...returnedProfile,
			profileId: reusedProfileId
		}],
		validateCurrentCredential: (profileId, current) => {
			let currentMatches = false;
			if (current) try {
				currentMatches = matcher(returnedProfile.credential, current);
			} catch {
				currentMatches = false;
			}
			if (profileId !== reusedProfileId || (current ? !currentMatches : !params.allowMissingReusedProfile)) throw new Error("The existing auth profile identity changed during sign-in. Start the sign-in again.");
		}
	};
}
//#endregion
//#region src/commands/models/auth.ts
function resolveManualTokenExpiryMs(expiresIn) {
	const normalizedExpiresIn = normalizeStringifiedOptionalString(expiresIn);
	if (!normalizedExpiresIn) return;
	const durationMs = parseDurationMs(normalizedExpiresIn, { defaultUnit: "d" });
	const expires = resolveExpiresAtMsFromDurationMs(durationMs);
	if (expires === void 0) throw new Error("Invalid expiry duration: resulting token expiry is outside Date range.");
	return expires;
}
function requireManualAuthProvider(raw) {
	const provider = normalizeOptionalString(raw);
	if (!provider) throw new Error(`Missing --provider. Run ${formatCliCommand("openclaw models status")} or ${formatCliCommand("openclaw plugins list")} to choose a provider.`);
	return normalizeManualAuthProvider(provider);
}
function guardCancel(value) {
	if (typeof value === "symbol") {
		cancel("Cancelled.");
		throw new ExitError(0);
	}
	return value;
}
const confirm$1 = async (params) => guardCancel(await confirm$2(params));
const text$1 = async (params) => guardCancel(await text$2(params));
const password$1 = async (params) => guardCancel(await password$2(params));
const select$1 = async (params) => guardCancel(await select$2(params));
const MODELS_AUTH_STDIN_MAX_BYTES = 1048576;
async function readPipedStdin() {
	return (await readByteStreamWithLimit(process.stdin, {
		maxBytes: MODELS_AUTH_STDIN_MAX_BYTES,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Piped auth input exceeds ${maxBytes} bytes.`)
	})).toString("utf8");
}
async function readPastedSecret(params) {
	const input = process.stdin.isTTY ? await password$1(params) : await readPipedStdin();
	const normalized = normalizeSecretInput(input);
	const validationMessage = params.validate(normalized);
	if (validationMessage) throw new Error(validationMessage);
	return normalized;
}
function listProvidersWithTokenMethods(providers) {
	return providers.filter((provider) => provider.auth.some((method) => method.kind === "token"));
}
function preferSetupAuthProviders(params) {
	const requestedProvider = params.requestedProvider;
	if (!params.ownerPluginId && requestedProvider) {
		const setupProvider = resolvePluginSetupProviderCore({
			provider: requestedProvider,
			config: params.config,
			workspaceDir: params.workspaceDir
		});
		return setupProvider ? [setupProvider] : [...params.providers];
	}
	const setupProviders = resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.ownerPluginId ? { pluginIds: [params.ownerPluginId] } : {}
	}).providers.map((entry) => entry.provider);
	const setupById = new Map(setupProviders.map((provider) => [normalizeProviderId(provider.id), provider]));
	const existing = new Set(params.providers.map((provider) => normalizeProviderId(provider.id)));
	return [...params.providers.map((provider) => setupById.get(normalizeProviderId(provider.id)) ?? provider), ...setupProviders.filter((provider) => !existing.has(normalizeProviderId(provider.id)))];
}
async function resolveModelsAuthContext(params) {
	const configSnapshot = await loadValidConfigSnapshotOrThrow();
	const config = params?.config ?? configSnapshot.runtimeConfig;
	const { agentId, agentDir } = resolveModelsTargetAgent(config, params?.rawAgentId ?? void 0, { kind: "mutation" });
	const workspaceDir = resolveAgentWorkspaceDir(config, agentId);
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
function resolveRequestedLoginProviderOrThrow(providers, rawProvider) {
	const requested = rawProvider?.trim();
	if (!requested) return null;
	const matched = resolveProviderMatch(providers, requested);
	if (matched) return matched;
	const available = providers.map((provider) => provider.id).filter(Boolean).toSorted((a, b) => a.localeCompare(b));
	const availableText = available.length > 0 ? available.join(", ") : "(none)";
	throw new Error(`Unknown provider "${requested}". Loaded providers: ${availableText}. Verify plugins via \`${formatCliCommand("openclaw plugins list --json")}\`.`);
}
async function pickProviderAuthMethod(params) {
	const rawRequestedMethod = params.requestedMethod?.trim();
	if (rawRequestedMethod) return pickAuthMethod(params.provider, rawRequestedMethod);
	const methods = params.tokenOnly ? params.provider.auth.filter((method) => method.kind === "token") : params.provider.auth;
	if (params.tokenOnly && methods.length === 0) return null;
	const preferred = methods.find((method) => params.tokenOnly ? method.id === "setup-token" : method.kind === "oauth");
	if (preferred) return preferred;
	if (methods.length === 1) return methods[0] ?? null;
	return params.prompter.select({
		message: `${params.tokenOnly ? "Token" : "Auth"} method for ${params.provider.label}`,
		options: methods.map((method) => ({
			value: method.id,
			label: method.label,
			hint: method.hint
		}))
	}).then((id) => methods.find((method) => method.id === id) ?? null);
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
				validateCurrentCredential: params.validateCurrentCredential,
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
				profileId: profile.profileId,
				assertCurrent: params.assertCurrent
			});
		}
		if (shouldUpdateConfig) {
			const updated = await writeProviderAuthConfig({
				config: params.config,
				configSnapshot: params.configSnapshot,
				configPatch,
				credentialsSaved: persistedProfiles.length > 0,
				beforeCommit: params.assertCurrent,
				writeOptions: { assertCurrent: params.assertCurrent },
				finalizeConfig: (replayed, cfg) => {
					const priorAgentsDefaultsModel = cfg.agents?.defaults?.model;
					const next = restorePriorAgentsDefaultsModelUnlessOptIn({
						cfg: replayed,
						priorAgentsDefaultsModel,
						setDefault: params.setDefault
					});
					if (params.setDefault && defaultModel) return profiles.length > 0 ? applyProviderLoginDefaultModel(next, defaultModel) : applyPrimaryModel(next, defaultModel);
					return next;
				}
			});
			if (defaultModel) {
				const warnings = await repairModelSelectionRuntimePlugins({
					cfg: updated,
					model: defaultModel
				});
				for (const warning of warnings) params.runtime.error?.(warning);
			}
			logConfigUpdated(params.runtime);
		}
		const authRefresh = await refreshProviderAuthAfterLogin(params);
		for (const profile of persistedProfiles) params.runtime.log(`Auth profile: ${profile.profileId} (${profile.credential.provider}/${profile.credential.type})`);
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
async function runProviderAuthMethod(params) {
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	const modelAccess = prepareProviderModelAccess({
		config: params.config,
		agentId: params.agentId,
		provider: params.provider.id,
		providerLabel: params.provider.label
	});
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir);
	const existingProfiles = Object.entries(store.profiles).filter(([profileId, credential]) => credential.provider === params.provider.id && (!params.profileId || profileId === params.profileId)).map(([profileId, credential]) => ({
		profileId,
		credential
	}));
	const result = await runProviderPluginAuthMethodUnpersisted({
		method: params.method,
		config: params.config,
		existingProfiles,
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
	const resolvedIdentity = resolveReloginProfileIdentity({
		profiles: connectionResult.profiles,
		requestedProfileId: params.profileId,
		existingProfiles: params.existingProfiles,
		matchesPersonalAccount: params.method.matchesPersonalAccount,
		allowMissingReusedProfile: params.allowMissingReusedProfile
	});
	const profiles = resolvedIdentity.profiles;
	const { profiles: persistedProfiles, authRefresh } = await persistProviderAuthResult({
		...params,
		result: connectionResult,
		profiles,
		env: params.env ?? process.env,
		validateCurrentCredential: resolvedIdentity.validateCurrentCredential
	});
	if (persistedProfiles.length > 0) await completeLoginModelAccess(params, modelAccess);
	return {
		result: connectionResult,
		profiles: persistedProfiles,
		authRefresh
	};
}
function completeLoginModelAccess(params, prepared) {
	return completeProviderModelAccess({
		prepared,
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
}
async function modelsAuthSetupTokenCommand(opts, runtime) {
	if (!process.stdin.isTTY) throw new Error(`setup-token requires an interactive TTY. In automation, use ${formatCliCommand("openclaw models auth paste-token --provider <provider>")} instead.`);
	const context = await resolveModelsAuthContext({
		requestedProvider: opts.provider,
		rawAgentId: opts.agent
	});
	const tokenProviders = listProvidersWithTokenMethods(context.providers);
	if (tokenProviders.length === 0) throw new Error(`No provider token-auth plugins found. Install one via \`${formatCliCommand("openclaw plugins install")}\`.`);
	const provider = resolveRequestedLoginProviderOrThrow(tokenProviders, opts.provider) ?? tokenProviders[0];
	if (!opts.yes) {
		if (!await confirm$1({
			message: `Continue with ${provider.label} token auth?`,
			initialValue: true
		})) return;
	}
	const prompter = createClackPrompter();
	const method = await pickProviderAuthMethod({
		provider,
		prompter,
		tokenOnly: true
	});
	if (!method) throw new Error(`Provider "${provider.id}" does not expose a token auth method.`);
	await runProviderAuthMethod({
		...context,
		provider,
		method,
		runtime,
		prompter
	});
}
async function modelsAuthPasteTokenCommand(opts, runtime) {
	await pasteManualAuthCredential(opts, runtime, "token");
}
async function modelsAuthPasteApiKeyCommand(opts, runtime) {
	await pasteManualAuthCredential(opts, runtime, "api_key");
}
async function pasteManualAuthCredential(opts, runtime, mode) {
	const config = (await loadValidConfigSnapshotOrThrow()).runtimeConfig;
	const { agentId, agentDir } = resolveModelsTargetAgent(config, opts.agent ?? void 0, { kind: "mutation" });
	const provider = requireManualAuthProvider(opts.provider);
	const tokenProfileId = mode === "token" ? normalizeOptionalString(opts.profileId) || resolveDefaultTokenProfileId(provider) : void 0;
	const input = await readPastedSecret({
		message: `Paste ${mode === "token" ? "token" : "API key"} for ${provider}`,
		validate: (value) => {
			const trimmed = value?.trim();
			if (!trimmed) return "Required";
			if (mode === "api_key") return provider === "openai" ? validateOpenAICodexApiKeyInput(trimmed) : void 0;
			if (provider === "anthropic") return validateAnthropicSetupToken(trimmed.replaceAll(/\s+/g, ""));
			if (provider === "openai" && looksLikeOpenAIApiKey(trimmed)) return `That looks like an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-api-key --provider openai")} for API-key auth.`;
		}
	});
	let profileId = tokenProfileId;
	let warning;
	if (tokenProfileId !== void 0) {
		const token = provider === "anthropic" ? input.replaceAll(/\s+/g, "").trim() : normalizeOptionalString(input) ?? "";
		const expires = resolveManualTokenExpiryMs(opts.expiresIn);
		await upsertAuthProfileWithLockOrThrow({
			profileId: tokenProfileId,
			credential: {
				type: "token",
				provider,
				token,
				...expires ? { expires } : {}
			},
			agentDir
		});
		await updateConfig((cfg) => applyAuthProfileConfig(cfg, {
			profileId: tokenProfileId,
			provider,
			mode: "token"
		}));
	} else ({profileId, warning} = await saveModelProviderApiKey({
		config,
		provider,
		apiKey: input,
		agentDir,
		profileId: normalizeOptionalString(opts.profileId)
	}));
	await refreshRunningGatewayAuthState(agentId, "login", runtime);
	if (warning) runtime.error(warning);
	logConfigUpdated(runtime);
	runtime.log(`Auth profile: ${profileId} (${provider}/${mode})`);
	if (mode === "token" && provider === "anthropic") {
		runtime.log("Anthropic setup-token auth is supported in OpenClaw.");
		runtime.log("OpenClaw prefers Claude CLI reuse when it is available on the host.");
		runtime.log("Anthropic staff told us this OpenClaw path is allowed again.");
	}
}
async function modelsAuthAddCommand(opts, runtime) {
	const context = await resolveModelsAuthContext({ rawAgentId: opts.agent });
	const tokenProviders = listProvidersWithTokenMethods(context.providers);
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
	const providerPlugin = provider === "custom" ? null : resolveRequestedLoginProviderOrThrow(tokenProviders, providerId);
	if (providerPlugin) {
		const tokenMethods = providerPlugin.auth.filter((method) => method.kind === "token");
		const methodId = await select$1({
			message: "Token method",
			options: [...tokenMethods.map((method) => ({
				value: method.id,
				label: method.label,
				hint: method.hint
			})), {
				value: "paste",
				label: "paste token"
			}]
		});
		if (methodId !== "paste") {
			const prompter = createClackPrompter();
			const method = tokenMethods.find((candidate) => candidate.id === methodId);
			if (!method) throw new Error(`Unknown token auth method "${methodId}". Run ${formatCliCommand("openclaw models auth login --provider " + providerPlugin.id)} to choose interactively.`);
			await runProviderAuthMethod({
				...context,
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
async function runModelsAuthLoginFlowCore(opts) {
	return runModelsAuthLoginFlow(opts, true);
}
async function runModelsAuthLoginFlowForGateway(opts) {
	return runModelsAuthLoginFlow(opts, opts.isRemote === false);
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
	let authProviders = context.providers.filter((provider) => provider.auth.length > 0);
	let requestedProvider = requestedProviderId ? resolveProviderMatch(authProviders, requestedProviderId) : null;
	const useProviderPicker = !opts.ownerPluginId && requestedProviderId !== void 0 && requestedProvider === null && isCliProvider(requestedProviderId, context.config);
	if (useProviderPicker) {
		context = await resolveModelsAuthContext({
			rawAgentId: opts.agent,
			config: context.config
		});
		authProviders = context.providers.filter((provider) => provider.auth.length > 0);
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
	const existingProfiles = snapshotReloginAuthProfiles({
		agentDir: context.agentDir,
		matchesPersonalAccount: chosenMethod.matchesPersonalAccount
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
			profileId: imported.profileId,
			assertCurrent: opts.assertCurrent
		});
		const authRefresh = await refreshProviderAuthAfterLogin({
			...opts,
			agentId: context.agentId
		});
		if (imported.configUpdated) logConfigUpdated(opts.runtime);
		opts.runtime.log(`Auth profile: ${imported.profileId} (${imported.provider}/${imported.mode}, imported)`);
		await completeLoginModelAccess(opts, modelAccess);
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
	const forceLogin = Boolean(opts.force);
	if (forceLogin) {
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
		...opts,
		...context,
		provider: selectedProvider,
		method: chosenMethod,
		prompter,
		existingProfiles,
		allowMissingReusedProfile: forceLogin
	});
	if (selectedProvider.id === "openai") opts.runtime.log(`Tip: Codex-capable models can use native Codex web search. Configure the \`web_search\` tool with \`${formatCliCommand("openclaw configure --section web")}\`. Docs: https://docs.openclaw.ai/tools/web`);
	return {
		providerId: selectedProvider.id,
		methodId: chosenMethod.id,
		authRefresh,
		...result.defaultModel ? { defaultModel: result.defaultModel } : {},
		profiles: profiles.map((profile) => ({
			profileId: profile.profileId,
			provider: profile.credential.provider,
			mode: profile.credential.type
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
