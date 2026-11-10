import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import "./with-timeout-DPEAkQt5.mjs";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.mjs";
//#region src/flows/memory-setup.ts
const PROBE_TIMEOUT_MS = 15e4;
const CLOSE_TIMEOUT_MS = 1e3;
async function closeProvider(provider) {
	try {
		await withTimeout(Promise.resolve().then(() => provider.close?.()), CLOSE_TIMEOUT_MS);
	} catch {}
}
async function probeProvider(params) {
	const controller = new AbortController();
	let provider = null;
	const check = async () => {
		const createOptions = {
			config: params.config,
			agentDir: params.agentDir,
			provider: params.providerId,
			model: params.model,
			remote: params.remote,
			inputType: params.search.inputType,
			queryInputType: params.search.queryInputType,
			documentInputType: params.search.documentInputType,
			dimensions: params.search.outputDimensionality
		};
		const result = await params.adapter.create({
			...createOptions,
			model: params.adapter.normalizeModel?.(createOptions) ?? createOptions.model
		});
		if (controller.signal.aborted) {
			if (result.provider) await closeProvider(result.provider);
			return false;
		}
		provider = result.provider;
		if (!provider) return false;
		const vector = await provider.embed("ping", {
			signal: controller.signal,
			inputType: "query"
		});
		return Array.isArray(vector) && vector.length > 0 && vector.every(Number.isFinite);
	};
	try {
		return await withTimeout(check(), PROBE_TIMEOUT_MS, { createError: () => {
			controller.abort();
			return /* @__PURE__ */ new Error("embedding probe timed out");
		} });
	} catch {
		return false;
	} finally {
		if (provider) await closeProvider(provider);
	}
}
/** Optional, non-indexing embedding setup. The caller owns persistence. */
async function runMemorySetupFlow(config, prompter, opts = {}) {
	await prompter.note("Embeddings add semantic memory search. Choose a cloud provider or a running local Ollama/LM Studio server. This check sends only synthetic text, does not index memory or download models, and may load an already-downloaded model. Stored OAuth access depends on the account and model. Skipping keeps your current settings.", "Memory search");
	if (!await prompter.confirm({
		message: "Set up memory embeddings?",
		initialValue: false
	})) return config;
	let providerIds;
	let previousProvider;
	try {
		const [{ loadManifestContractSnapshot, listAvailableManifestContractValues }, { resolveConfiguredGenericEmbeddingProviderId }, { resolveMemorySearchProviderId }] = await Promise.all([
			import("./manifest-contract-eligibility-51y7kpuS.mjs"),
			import("./embedding-provider-config-CfNlzCMC.mjs"),
			import("./memory-search-EtX3skSa.mjs")
		]);
		previousProvider = resolveMemorySearchProviderId(config.memory?.search?.provider);
		const ids = /* @__PURE__ */ new Set(["openai-compatible"]);
		if (config.plugins?.enabled !== false) {
			const snapshot = loadManifestContractSnapshot({ config });
			for (const id of listAvailableManifestContractValues({
				snapshot,
				contract: "embeddingProviders",
				config
			})) ids.add(id);
		}
		ids.delete("local");
		ids.delete("llama-cpp");
		for (const id of Object.keys(config.models?.providers ?? {})) {
			const owner = resolveConfiguredGenericEmbeddingProviderId(id, config);
			if (owner && ids.has(owner)) ids.add(id);
		}
		if (!config.models?.providers?.["openai-compatible"]?.baseUrl && !(config.memory?.search?.provider === "openai-compatible" && config.memory.search.remote?.baseUrl)) ids.delete("openai-compatible");
		providerIds = [...ids].toSorted((a, b) => a.localeCompare(b));
	} catch {
		await prompter.note("Embedding providers could not be listed. Check plugin configuration and try again.", "Memory setup unchanged");
		return config;
	}
	if (providerIds.length === 0) {
		await prompter.note("No HTTP embedding providers are available. Check plugin configuration, or use the manual memory-search setup docs for managed local embeddings.", "Memory setup unchanged");
		return config;
	}
	const previous = config.memory?.search;
	const selected = await prompter.select({
		message: "Embedding provider",
		options: providerIds.map((id) => ({
			value: id,
			label: id
		})),
		initialValue: providerIds.includes(previousProvider) ? previousProvider : providerIds[0]
	});
	let adapter;
	try {
		const { getEmbeddingProvider } = await import("./embedding-provider-runtime-pcBptXO5.mjs");
		adapter = getEmbeddingProvider(selected, config);
	} catch {
		await prompter.note("The selected embedding provider could not be loaded. Check plugin configuration and try again.", "Memory setup unchanged");
		return config;
	}
	if (!adapter || adapter.transport === "local") {
		await prompter.note("This provider is unavailable for this setup flow. Use the manual memory-search setup docs for managed local embeddings.", "Memory setup unchanged");
		return config;
	}
	const { isSameMemorySearchProvider } = await import("./memory-search-EtX3skSa.mjs");
	const sameProvider = isSameMemorySearchProvider(selected, previousProvider);
	const initialModel = (sameProvider ? previous?.model : void 0) || adapter.defaultModel || "";
	const model = (await prompter.text({
		message: "Embedding model ID",
		initialValue: initialModel || void 0,
		placeholder: "Enter the model ID accepted by this provider",
		validate: (value) => value.trim() ? void 0 : "Enter an embedding model ID."
	})).trim();
	if (!model) {
		await prompter.note("An embedding model ID is required.", "Memory setup unchanged");
		return config;
	}
	const remoteBase = sameProvider ? { ...previous?.remote } : previous?.remote?.batch ? { batch: previous.remote.batch } : {};
	const credentialChoice = await prompter.select({
		message: "Embedding credential",
		options: [
			{
				value: "existing",
				label: "Use existing credentials / no key",
				hint: "Saved key, provider auth, environment, or unauthenticated local server"
			},
			...opts.secretInputMode === "ref" ? [] : [{
				value: "key",
				label: "Enter API key",
				hint: "Masked input"
			}],
			{
				value: "ref",
				label: "Use SecretRef",
				hint: "Store a reference, not the key"
			}
		],
		initialValue: opts.secretInputMode === "ref" && !(sameProvider && remoteBase.apiKey) ? "ref" : "existing"
	});
	let savedKey;
	let probeKey;
	if (credentialChoice === "key" && opts.secretInputMode !== "ref") {
		const key = (await prompter.text({
			message: "Embedding API key",
			sensitive: true,
			validate: (value) => value.trim() ? void 0 : "Enter an API key."
		})).trim();
		savedKey = key;
		probeKey = key;
	} else if (credentialChoice === "ref") try {
		const { promptSecretRefForSetup } = await import("./provider-auth-ref-DhrdgGLl.mjs");
		const result = await promptSecretRefForSetup({
			provider: adapter.authProviderId ?? selected,
			config,
			prompter
		});
		savedKey = result.ref;
		probeKey = result.resolvedValue;
	} catch (error) {
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		await prompter.note("The secret reference could not be resolved. Check its source and try again.", "Memory setup unchanged");
		return config;
	}
	const remoteForSave = { ...remoteBase };
	if (credentialChoice !== "existing") delete remoteForSave.apiKey;
	if (savedKey !== void 0) remoteForSave.apiKey = savedKey;
	let remoteForProbe = { ...remoteForSave };
	const candidateSearch = {
		...previous,
		provider: selected,
		model,
		enabled: true,
		remote: remoteForSave
	};
	let candidateConfig = {
		...config,
		memory: {
			...config.memory,
			search: candidateSearch
		}
	};
	try {
		const { resolveMemorySearchConfig } = await import("./memory-search-EtX3skSa.mjs");
		if (!sameProvider && config.agents?.entries) {
			const entries = { ...config.agents.entries };
			for (const [agentId, agent] of Object.entries(entries)) {
				const search = agent.memory?.search;
				const ownsRemote = [
					search?.remote?.baseUrl,
					search?.remote?.apiKey,
					search?.remote?.headers
				].some((value) => value !== void 0);
				const inheritsRemote = search?.provider !== void 0 && [
					previous?.remote?.baseUrl,
					previous?.remote?.apiKey,
					previous?.remote?.headers
				].some((value) => value !== void 0);
				if (!search || !ownsRemote && !inheritsRemote) continue;
				const effective = resolveMemorySearchConfig({
					...config,
					agents: {
						...config.agents,
						entries: {
							...entries,
							[agentId]: {
								...agent,
								memory: {
									...agent.memory,
									search: {
										...search,
										enabled: true
									}
								}
							}
						}
					}
				}, agentId);
				if (!effective) continue;
				const { baseUrl, apiKey, headers } = effective.remote ?? {};
				entries[agentId] = {
					...agent,
					memory: {
						...agent.memory,
						search: {
							...search,
							provider: effective.provider,
							model: effective.model,
							remote: {
								...search.remote,
								baseUrl: baseUrl ?? "",
								apiKey: apiKey ?? "",
								headers: headers ?? {}
							}
						}
					}
				};
			}
			candidateConfig = {
				...candidateConfig,
				agents: {
					...config.agents,
					entries
				}
			};
		}
		resolveMemorySearchConfig({
			...candidateConfig,
			agents: void 0
		}, "main");
		for (const agentId of Object.keys(config.agents?.entries ?? {})) resolveMemorySearchConfig(candidateConfig, agentId);
	} catch {
		await prompter.note("The selected provider, model, or fallback is not compatible with the retained memory settings. Check the memory search configuration and try again.", "Memory setup unchanged");
		return config;
	}
	let probeConfig;
	try {
		const { resolveSetupSecretInputString } = await import("./setup.secret-input-xXzIhdID.mjs");
		if (remoteForProbe.apiKey !== void 0) probeKey = probeKey ?? await resolveSetupSecretInputString({
			config,
			value: remoteForProbe.apiKey,
			path: "memory.search.remote.apiKey"
		});
		remoteForProbe = {
			...remoteForProbe,
			...probeKey ? { apiKey: probeKey } : {}
		};
		probeConfig = {
			...config,
			memory: {
				...config.memory,
				search: {
					...candidateSearch,
					remote: remoteForProbe
				}
			}
		};
		const configuredProviderId = config.models?.providers?.[selected] ? selected : adapter.authProviderId ?? selected;
		const configuredProvider = probeConfig.models?.providers?.[configuredProviderId];
		if (configuredProvider) {
			const [{ resolveCommandConfigWithSecrets }, { getMemoryEmbeddingCommandSecretTargetIds }] = await Promise.all([import("./command-config-resolution-Bz9tQ_x8.mjs"), import("./command-secret-targets-BF6Ekt_4.mjs")]);
			const allowedPaths = /* @__PURE__ */ new Set([formatConcreteConfigPath([
				"models",
				"providers",
				configuredProviderId,
				"apiKey"
			]), ...Object.keys(configuredProvider.headers ?? {}).map((name) => formatConcreteConfigPath([
				"models",
				"providers",
				configuredProviderId,
				"headers",
				name
			]))]);
			probeConfig = (await resolveCommandConfigWithSecrets({
				config: probeConfig,
				commandName: "memory embedding setup probe",
				targetIds: getMemoryEmbeddingCommandSecretTargetIds(),
				allowedPaths,
				autoEnable: false
			})).effectiveConfig;
		}
	} catch (error) {
		if (error instanceof WizardCancelledError || error instanceof WizardNavigationError) throw error;
		await prompter.note("An existing embedding credential could not be resolved. Check its source and try again.", "Memory setup unchanged");
		return config;
	}
	const progress = prompter.progress("Checking embedding readiness (local model loading can take two minutes)…");
	const ready = await probeProvider({
		adapter,
		config: probeConfig,
		agentDir: opts.agentDir,
		providerId: selected,
		model,
		search: candidateSearch,
		remote: remoteForProbe
	});
	progress.stop(ready ? "Embedding check passed" : "Embedding check failed");
	if (!ready) {
		await prompter.note("The selected embedding provider did not complete a small readiness check. Check its model, endpoint, and credentials, then try again.", "Memory setup unchanged");
		return config;
	}
	await prompter.note("Embedding readiness passed in this CLI session. The Gateway daemon must also be able to resolve any environment-based SecretRef. This changes shared memory defaults. On a provider change, agents with remote overrides retain their previous embedding destination and model. If the provider or model changes, rebuild the index explicitly with `openclaw memory index --force` before vector search resumes.", "Ready to save");
	if (!await prompter.confirm({
		message: "Save and enable these shared memory embedding defaults?",
		initialValue: false
	})) return config;
	return candidateConfig;
}
//#endregion
export { runMemorySetupFlow };
