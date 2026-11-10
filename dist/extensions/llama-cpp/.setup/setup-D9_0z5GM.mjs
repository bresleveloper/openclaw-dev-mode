import { _ as LLAMA_CPP_PROVIDER_ID, v as LLAMA_CPP_PROVIDER_LABEL } from "./defaults-DX4XN2j1.mjs";
import { a as LLAMA_SERVER_DEFAULT_ORIGIN, i as LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR, r as resolveLlamaServerEndpoint, s as hasLlamaServerAuthorizationHeader } from "./provider-discovery-SxEYhgMV.mjs";
import { i as resolveLlamaServerRuntimeApiKey, n as buildLlamaServerProviderConfig, r as resolveLlamaServerProviderHeaders, t as discoverLlamaServer } from "./discovery-osk0TXQN.mjs";
import { n as buildLlamaCppAuthProfileRemovalPatch, t as LLAMA_CPP_DEFAULT_PROFILE_ID } from "./auth-config-Dx2WDi-G.mjs";
import { applyAuthProfileConfig, buildApiKeyCredential, ensureApiKeyFromEnvOrPrompt, normalizeOptionalSecretInput } from "openclaw/plugin-sdk/provider-auth";
import { removeAuthProfileConfig, removeProviderAuthProfilesWithLock } from "openclaw/plugin-sdk/provider-auth-runtime";
import { applyProviderDefaultModel } from "openclaw/plugin-sdk/provider-setup";
import { selectPreferredLocalModelId } from "openclaw/plugin-sdk/provider-model-shared";
import { upsertAuthProfileWithLockOrThrow } from "openclaw/plugin-sdk/provider-auth-api-key";
//#region extensions/llama-cpp/src/external-server/setup.ts
function selectSetupModelId(discovery) {
	const candidates = discovery.models.filter((model) => !model.failed);
	const ready = candidates.filter((model) => model.status === "loaded" || model.status === "sleeping");
	const ids = (ready.length > 0 ? ready : candidates).map((model) => model.config.id);
	return selectPreferredLocalModelId(ids) ?? ids[0];
}
function describeDiscoveryFailure(result) {
	switch (result.kind) {
		case "unreachable": return `llama-server could not be reached at ${result.endpoint.origin}.`;
		case "http-error": return `llama-server returned HTTP ${result.status} for ${result.path} at ${result.endpoint.origin}.`;
		case "invalid-response": return `llama-server returned an invalid response from ${result.path} at ${result.endpoint.origin}.`;
		default: throw new Error("Unexpected llama-server discovery result");
	}
}
function stripAuthOverrides(provider, removeAuthorization) {
	if (!provider) return provider;
	const headers = removeAuthorization ? stripAuthorizationHeader(provider.headers) : provider.headers;
	return {
		...provider,
		auth: void 0,
		apiKey: void 0,
		...removeAuthorization ? { headers } : {}
	};
}
function stripEndpointCredentials(provider) {
	if (!provider) return;
	const { localService: _localService, ...external } = provider;
	if (!provider.localService) return {
		...external,
		auth: void 0,
		apiKey: void 0,
		headers: void 0
	};
	const { auth: _auth, apiKey: _apiKey, headers: _headers, localService: _managedService, models: _managedModels, params: managedParams, timeoutSeconds: _managedTimeout, ...externalProvider } = provider;
	const { modelCacheDir: _modelCacheDir, ...params } = managedParams ?? {};
	return {
		...externalProvider,
		models: [],
		params: Object.keys(params).length > 0 ? params : void 0
	};
}
function hasEndpointChanged(provider, baseUrl) {
	if (!provider) return false;
	const configuredBaseUrl = provider.baseUrl ?? "http://127.0.0.1:8080";
	return resolveLlamaServerEndpoint(configuredBaseUrl).inferenceBaseUrl !== resolveLlamaServerEndpoint(baseUrl).inferenceBaseUrl;
}
function stripLlamaServerEndpointAuth(config) {
	const withoutProfile = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	const provider = withoutProfile.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafeProvider = stripEndpointCredentials(provider);
	if (!endpointSafeProvider) return withoutProfile;
	return {
		...withoutProfile,
		models: {
			...withoutProfile.models,
			providers: {
				...withoutProfile.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: endpointSafeProvider
			}
		}
	};
}
function stripAuthorizationHeader(headers) {
	const filtered = Object.fromEntries(Object.entries(headers ?? {}).filter(([name]) => name.toLowerCase() !== "authorization"));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function buildExistingProviderConfig(params) {
	const configured = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafe = params.resetEndpoint ? stripEndpointCredentials(configured) : configured;
	const existing = params.persistence.kind === "preserve" ? endpointSafe : stripAuthOverrides(endpointSafe, params.persistence.kind === "upsert");
	return buildLlamaServerProviderConfig({
		configured: {
			...existing,
			baseUrl: params.discovery.endpoint.inferenceBaseUrl,
			models: existing?.models ?? []
		},
		discoveredModels: params.discovery.models
	});
}
function buildSetupResult(params) {
	return {
		profiles: params.persistence.kind === "upsert" ? [{
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential: buildApiKeyCredential(LLAMA_CPP_PROVIDER_ID, params.persistence.credential, void 0, { config: params.config })
		}] : [],
		defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${params.modelId}`,
		configPatch: {
			...params.persistence.kind === "remove" ? buildLlamaCppAuthProfileRemovalPatch(params.config) : {},
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildExistingProviderConfig(params) }
			}
		}
	};
}
async function removeDefaultAuthProfile(config, agentDir) {
	if (!await removeProviderAuthProfilesWithLock({
		cfg: config,
		agentDir,
		provider: "llama-cpp",
		profileIds: [LLAMA_CPP_DEFAULT_PROFILE_ID]
	})) throw new Error("Failed to remove the previous llama-server auth profile; wait a moment and retry.");
}
async function discoverForSetup(ctx) {
	const provider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (provider?.localService) return null;
	try {
		const headers = await resolveLlamaServerProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: provider?.headers
		});
		const apiKey = !hasLlamaServerAuthorizationHeader(headers) ? await resolveLlamaServerRuntimeApiKey({ config: ctx.config }) : void 0;
		const discovery = await discoverLlamaServer({
			baseUrl: provider?.baseUrl ?? "http://127.0.0.1:8080",
			apiKey,
			headers,
			allowPrivateNetwork: provider?.request?.allowPrivateNetwork,
			signal: ctx.signal,
			useRuntimeDefaults: false
		});
		return discovery.kind === "success" ? discovery : null;
	} catch {
		return null;
	}
}
/** Read-only discovery for the guided local-provider setup ladder. */
async function detectLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const modelId = selectSetupModelId(discovery);
	if (!modelId) return null;
	return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${modelId}`,
		detail: `${modelId} at ${discovery.endpoint.origin}`
	};
}
/** Rechecks one guided candidate and returns the config needed for a live probe. */
async function prepareLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const prefix = `${LLAMA_CPP_PROVIDER_ID}/`;
	const modelId = ctx.modelRef.startsWith(prefix) ? ctx.modelRef.slice(prefix.length) : "";
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) return null;
	return buildSetupResult({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: false,
		persistence: { kind: "preserve" }
	});
}
/** Interactive setup for an existing llama-server endpoint. */
async function runLlamaServerSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const defaultOrigin = resolveLlamaServerEndpoint(existing?.baseUrl).origin;
	const baseUrl = await ctx.prompter.text({
		message: `${LLAMA_CPP_PROVIDER_LABEL} URL`,
		initialValue: defaultOrigin,
		placeholder: LLAMA_SERVER_DEFAULT_ORIGIN,
		validate: (value) => {
			if (!value?.trim()) return "Required";
			try {
				resolveLlamaServerEndpoint(value);
				return;
			} catch {
				return "Enter a valid HTTP or HTTPS URL without embedded credentials (e.g. http://localhost:8080).";
			}
		}
	});
	const endpoint = resolveLlamaServerEndpoint(baseUrl);
	const endpointChanged = Boolean(existing?.localService) || hasEndpointChanged(existing, endpoint.inferenceBaseUrl);
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: existing?.headers
	});
	const usesApiKey = await ctx.prompter.confirm({
		message: "Does this llama-server require an API key?",
		initialValue: false
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (!usesApiKey) persistence = { kind: "remove" };
	else {
		const hasConfiguredProfile = Boolean(ctx.config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
		const profileApiKey = !endpointChanged && !hasLlamaServerAuthorizationHeader(resolvedHeaders) && hasConfiguredProfile ? await resolveLlamaServerRuntimeApiKey({
			config: ctx.config,
			agentDir: ctx.agentDir,
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID
		}) : void 0;
		if (profileApiKey) {
			apiKey = profileApiKey;
			persistence = { kind: "preserve" };
		} else {
			let credentialInput;
			apiKey = await ensureApiKeyFromEnvOrPrompt({
				config: endpointChanged ? stripLlamaServerEndpointAuth(ctx.config) : ctx.config,
				env: endpointChanged ? {} : ctx.env,
				provider: LLAMA_CPP_PROVIDER_ID,
				envLabel: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
				promptMessage: "Enter the llama-server API key",
				normalize: (value) => value.trim(),
				validate: (value) => value.trim() ? void 0 : "Required",
				prompter: ctx.prompter,
				secretInputMode: ctx.secretInputMode,
				setCredential: async (input) => {
					credentialInput = input;
				}
			});
			if (credentialInput === void 0) throw new Error("llama-server API-key setup did not produce a credential");
			headers = stripAuthorizationHeader(resolvedHeaders);
			persistence = {
				kind: "upsert",
				credential: credentialInput
			};
		}
	}
	const discovery = await discoverLlamaServer({
		baseUrl: endpoint.inferenceBaseUrl,
		apiKey,
		headers,
		allowPrivateNetwork: existing?.request?.allowPrivateNetwork,
		signal: ctx.signal,
		useRuntimeDefaults: false
	});
	if (discovery.kind !== "success") throw new Error(describeDiscoveryFailure(discovery));
	const modelId = selectSetupModelId(discovery);
	if (!modelId) throw new Error(`No llama-server text models were found at ${discovery.endpoint.origin}.`);
	if (persistence.kind === "remove") await removeDefaultAuthProfile(ctx.config, ctx.agentDir);
	return buildSetupResult({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	});
}
async function validateNonInteractiveDiscovery(ctx) {
	const configuredProvider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const baseUrl = normalizeOptionalSecretInput(ctx.opts.customBaseUrl) ?? configuredProvider?.baseUrl ?? "http://127.0.0.1:8080";
	const endpointChanged = Boolean(configuredProvider?.localService) || hasEndpointChanged(configuredProvider, baseUrl);
	const providerApiKey = normalizeOptionalSecretInput(ctx.opts.llamaServerApiKey);
	const customApiKey = normalizeOptionalSecretInput(ctx.opts.customApiKey);
	const authoredApiKey = providerApiKey ?? customApiKey;
	const hasAuthoredApiKey = authoredApiKey !== void 0;
	const resolvedApiKey = await ctx.resolveApiKey({
		provider: LLAMA_CPP_PROVIDER_ID,
		flagValue: authoredApiKey,
		flagName: providerApiKey === void 0 ? "--custom-api-key" : "--llama-server-api-key",
		envVar: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		envVarName: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		required: false
	});
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: configuredProvider?.headers
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (hasAuthoredApiKey && resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		headers = stripAuthorizationHeader(resolvedHeaders);
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else if (endpointChanged || hasLlamaServerAuthorizationHeader(resolvedHeaders)) persistence = { kind: "remove" };
	else if (resolvedApiKey?.source === "profile") {
		apiKey = resolvedApiKey.key;
		persistence = { kind: "preserve" };
	} else if (resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else persistence = { kind: "remove" };
	const discovery = await discoverLlamaServer({
		baseUrl,
		apiKey,
		headers,
		allowPrivateNetwork: configuredProvider?.request?.allowPrivateNetwork,
		useRuntimeDefaults: false
	});
	if (discovery.kind !== "success") throw new Error(describeDiscoveryFailure(discovery));
	const requestedModelId = normalizeOptionalSecretInput(ctx.opts.customModelId);
	const modelId = requestedModelId ?? selectSetupModelId(discovery);
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) {
		const available = discovery.models.map((model) => model.config.id).join(", ");
		throw new Error(requestedModelId ? `llama-server model ${requestedModelId} was not found. Available models: ${available}` : `No llama-server text models were found at ${discovery.endpoint.origin}.`);
	}
	return {
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	};
}
async function validateLlamaServerNonInteractive(ctx) {
	await validateNonInteractiveDiscovery(ctx);
	return true;
}
/** Non-interactive setup with optional API-key persistence. */
async function configureLlamaServerNonInteractive(ctx) {
	const validated = await validateNonInteractiveDiscovery(ctx);
	const providerConfig = buildExistingProviderConfig({
		config: ctx.config,
		...validated
	});
	let config = {
		...ctx.config,
		models: {
			...ctx.config.models,
			mode: ctx.config.models?.mode ?? "merge",
			providers: {
				...ctx.config.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: providerConfig
			}
		}
	};
	if (validated.persistence.kind === "upsert") {
		const credential = ctx.toApiKeyCredential({
			provider: LLAMA_CPP_PROVIDER_ID,
			resolved: validated.persistence.credential
		});
		if (!credential) return null;
		await upsertAuthProfileWithLockOrThrow({
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential,
			agentDir: ctx.agentDir
		});
		config = applyAuthProfileConfig(config, {
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			provider: LLAMA_CPP_PROVIDER_ID,
			mode: "api_key"
		});
	} else if (validated.persistence.kind === "remove") {
		await removeDefaultAuthProfile(ctx.config, ctx.agentDir);
		config = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	}
	ctx.runtime.log(`Default ${LLAMA_CPP_PROVIDER_LABEL} model: ${validated.modelId}`);
	return applyProviderDefaultModel(config, `${LLAMA_CPP_PROVIDER_ID}/${validated.modelId}`);
}
//#endregion
export { configureLlamaServerNonInteractive, detectLlamaServerSetup, prepareLlamaServerSetup, runLlamaServerSetup, validateLlamaServerNonInteractive };
