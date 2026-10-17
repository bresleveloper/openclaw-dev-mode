import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { s as createMigrationManualItem } from "./migration-BeM6IrM8.mjs";
import { c as sanitizeName } from "./helpers-B2SzrrLy.mjs";
import { n as normalizeHermesCustomProviderId, o as resolveHermesConfiguredProviderId } from "./model-DW3elluA.mjs";
import { a as readProviderApiKeyEnv, c as readProviderTransport, d as resolveHermesProviderApiKeyEnv, f as resolveHermesProviderBaseUrlEnv, i as readEnvReference, l as resolveHermesEndpointApiKeyEnv, n as collectProviderModels, o as readProviderBaseUrl, p as resolveProviderApi, s as readProviderHeaders, t as HERMES_TRANSPORTS, u as resolveHermesImplicitBaseUrl } from "./config-provider-contract-Dg2mtXgG.mjs";
//#region extensions/migrate-hermes/config-providers.ts
function* providerSources(config) {
	for (const [id, raw] of Object.entries(asNonArrayRecord(config.providers))) if (isRecord(raw)) yield {
		id,
		raw,
		source: `config.yaml:providers.${id}`,
		custom: false
	};
	if (Array.isArray(config.custom_providers)) for (const raw of config.custom_providers) {
		if (!isRecord(raw)) continue;
		const id = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
		if (id) yield {
			id,
			raw,
			source: `config.yaml:custom_providers.${id}`,
			custom: true
		};
	}
}
function collectHermesProviders(config, env = {}, includeSecrets = false) {
	const collected = [];
	const upsert = (entry, options) => {
		const index = collected.findIndex((candidate) => candidate.id === entry.id);
		if (index < 0) {
			collected.push(entry);
			return;
		}
		const previous = collected[index];
		collected[index] = {
			...options?.fallbackOnly ? entry : previous,
			...options?.fallbackOnly ? previous : entry,
			models: [...previous.models, ...entry.models.filter((model) => !previous.models.some((previousModel) => previousModel.id === model.id))]
		};
	};
	for (const { id, raw, custom } of providerSources(config)) {
		const resolvedBaseUrl = readProviderBaseUrl(raw, env);
		const baseUrl = resolvedBaseUrl.baseUrl ?? (custom ? void 0 : resolveHermesImplicitBaseUrl(id));
		const api = resolveProviderApi(baseUrl ? {
			...raw,
			base_url: baseUrl
		} : raw, id);
		if (!baseUrl || !api) continue;
		const headerConfig = readProviderHeaders(raw, env, includeSecrets);
		upsert({
			id: resolveHermesConfiguredProviderId(config, id, env),
			baseUrl,
			api,
			apiKeyEnv: readProviderApiKeyEnv(raw) ?? resolveHermesEndpointApiKeyEnv(baseUrl),
			headers: headerConfig.headers,
			models: collectProviderModels(raw),
			sensitive: resolvedBaseUrl.sensitive || headerConfig.sensitive
		}, { fallbackOnly: custom });
	}
	const model = config.model;
	if (isRecord(model)) {
		const rawProvider = normalizeOptionalString(model.provider);
		const resolvedBaseUrl = readProviderBaseUrl(model, env);
		const envBaseUrl = resolveHermesProviderBaseUrlEnv(rawProvider, env);
		const baseUrl = resolvedBaseUrl.baseUrl ?? envBaseUrl ?? resolveHermesImplicitBaseUrl(rawProvider);
		const api = resolveProviderApi(baseUrl ? {
			...model,
			base_url: baseUrl
		} : model, rawProvider);
		if (baseUrl && api) {
			const headerConfig = readProviderHeaders(model, env, includeSecrets);
			upsert({
				id: rawProvider ? resolveHermesConfiguredProviderId(config, rawProvider, env) : "custom",
				baseUrl,
				api,
				apiKeyEnv: readProviderApiKeyEnv(model) ?? resolveHermesProviderApiKeyEnv(rawProvider) ?? resolveHermesEndpointApiKeyEnv(baseUrl),
				headers: headerConfig.headers,
				models: collectProviderModels(model),
				sensitive: resolvedBaseUrl.sensitive || Boolean(envBaseUrl) || headerConfig.sensitive
			});
		}
	} else {
		const rawProvider = normalizeOptionalString(config.provider);
		const baseUrl = resolveHermesProviderBaseUrlEnv(rawProvider, env) ?? resolveHermesImplicitBaseUrl(rawProvider);
		const api = resolveProviderApi(baseUrl ? { base_url: baseUrl } : {}, rawProvider);
		if (rawProvider && baseUrl && api) upsert({
			id: resolveHermesConfiguredProviderId(config, rawProvider, env),
			baseUrl,
			api,
			apiKeyEnv: resolveHermesProviderApiKeyEnv(rawProvider) ?? resolveHermesEndpointApiKeyEnv(baseUrl),
			models: [],
			sensitive: true
		});
	}
	return collected;
}
function collectHermesProviderSecretBindings(config, env = {}) {
	const bindings = collectHermesProviders(config, env).flatMap((entry) => entry.apiKeyEnv ? [{
		envVar: entry.apiKeyEnv,
		provider: entry.id
	}] : []);
	for (const { id, raw, custom } of providerSources(config)) {
		const envVar = readProviderApiKeyEnv(raw) ?? (custom ? void 0 : resolveHermesProviderApiKeyEnv(id));
		if (envVar) bindings.push({
			envVar,
			provider: resolveHermesConfiguredProviderId(config, id, env)
		});
	}
	const model = isRecord(config.model) ? config.model : void 0;
	const selectedProvider = normalizeOptionalString(model?.provider) ?? normalizeOptionalString(config.provider);
	const selectedEnv = (model ? readProviderApiKeyEnv(model) : void 0) ?? resolveHermesProviderApiKeyEnv(selectedProvider);
	if (selectedProvider && selectedEnv) bindings.push({
		envVar: selectedEnv,
		provider: resolveHermesConfiguredProviderId(config, selectedProvider, env)
	});
	return [...new Map(bindings.map((binding) => [`${binding.provider}\0${binding.envVar}`, binding])).values()];
}
function addSelectedModelToProvider(providers, modelRef) {
	if (!modelRef) return;
	const slash = modelRef.indexOf("/");
	if (slash <= 0 || slash === modelRef.length - 1) return;
	const provider = providers.find((entry) => entry.id === modelRef.slice(0, slash));
	const modelId = modelRef.slice(slash + 1);
	if (provider && !provider.models.some((model) => model.id === modelId)) provider.models.push({ id: modelId });
}
function providerManualItems(config, env, includeSecrets) {
	const currentProviderIds = new Set(Object.keys(asNonArrayRecord(config.providers)).map(normalizeHermesCustomProviderId));
	const entries = [...providerSources(config)].filter(({ id, custom }) => !custom || !currentProviderIds.has(normalizeHermesCustomProviderId(id)));
	if (isRecord(config.model)) {
		const provider = normalizeOptionalString(config.model.provider);
		if (normalizeOptionalString(config.model.base_url) ?? normalizeOptionalString(config.model.baseUrl)) entries.push({
			id: provider ? resolveHermesConfiguredProviderId(config, provider, env) || "custom" : "custom",
			raw: config.model,
			source: "config.yaml:model",
			custom: false
		});
	}
	const items = [];
	for (const { id, raw, source } of entries) {
		const transport = readProviderTransport(raw);
		const baseUrlConfig = readProviderBaseUrl(raw, env);
		const baseUrl = baseUrlConfig.baseUrl ?? resolveHermesImplicitBaseUrl(id);
		const headerConfig = readProviderHeaders(raw, env, includeSecrets);
		const add = (suffix, itemSource, message, recommendation) => {
			items.push(createMigrationManualItem({
				id: `manual:model-provider-${suffix}:${sanitizeName(id)}`,
				source: itemSource,
				message,
				recommendation
			}));
		};
		if (transport && !HERMES_TRANSPORTS[transport]) add("transport", `${source}.transport`, `Hermes provider "${id}" uses unsupported transport "${transport}".`, "Configure an equivalent OpenClaw provider plugin or API adapter manually.");
		else if (baseUrlConfig.unresolved) add("endpoint-env", source, `Hermes provider "${id}" references an endpoint environment variable that was not present in the Hermes .env file.`, "Configure the provider endpoint manually after migration.");
		else if (!baseUrl) add("endpoint", source, `Hermes provider "${id}" has no explicit endpoint to import safely.`, "Configure the provider endpoint manually after migration.");
		const inlineKey = raw.api_key ?? raw.apiKey;
		if (normalizeOptionalString(inlineKey) && !readEnvReference(inlineKey)) add("inline-key", `${source}.api_key`, `Hermes provider "${id}" contains an inline API key that was not copied into OpenClaw config.`, "Move the key to an environment variable or OpenClaw secret provider.");
		if (headerConfig.blocked) add("headers", `${source}.extra_headers`, `Hermes provider "${id}" has literal request headers that require secret migration consent.`, "Rerun with --include-secrets or configure the headers manually.");
		else if (headerConfig.unresolved) add("headers-env", `${source}.extra_headers`, `Hermes provider "${id}" has request header environment references that could not be resolved.`, "Configure the provider headers manually after migration.");
		if (headerConfig.invalid) add("headers-invalid", `${source}.extra_headers`, `Hermes provider "${id}" has non-scalar request header values that were not imported.`, "Configure valid string header values manually after migration.");
		if (isRecord(raw.extra_body) && Object.keys(raw.extra_body).length > 0) add("extra-body", `${source}.extra_body`, `Hermes provider "${id}" adds request body fields that OpenClaw cannot import generically.`, "Configure an equivalent provider plugin or supported request option manually.");
		const apiKeyEnv = readProviderApiKeyEnv(raw);
		if (apiKeyEnv && !env[apiKeyEnv]?.trim()) add("key-env", `${source}.key_env`, `Hermes provider "${id}" references ${apiKeyEnv}, but that value was not present in the Hermes .env file.`, "Configure an OpenClaw auth profile for this provider or expose the variable to the OpenClaw runtime.");
	}
	return [...new Map(items.map((item) => [item.id, item])).values()];
}
//#endregion
export { providerManualItems as i, collectHermesProviderSecretBindings as n, collectHermesProviders as r, addSelectedModelToProvider as t };
