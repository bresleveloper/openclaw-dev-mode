import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { C as retainPluginCache, O as waitForPluginCacheRetirement, p as getPluginMetadataSnapshotCache, u as getPluginCacheRetirementSignal } from "./plugin-cache-BbahpD-b.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as hasRetainedPluginRuntimeCloseError, n as PluginRuntimeCloseRetainedError, r as aggregatePluginRuntimeCloseErrors } from "./runtime-close-error-DOUCCb00.mjs";
import { c as retirePreparedModelRuntimeGeneration, n as capturePreparedModelRuntimeLifetime, s as registerPreparedPluginRetirement } from "./prepared-model-runtime.lifecycle-wUGazXvM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { d as getPluginRegistryGatewayOwner, f as getPluginRegistryLifetime, o as capturePluginRegistryLifecycleEpoch, p as getPluginRegistryResourceOwner, r as bindPluginRegistryLifetime, s as capturePluginRegistryLifecycleSignal, w as markPluginRegistryActive, x as isPluginRegistryRetired } from "./registry-lifecycle-CjTFYNkp.mjs";
import { o as disposePluginRegistryInstances } from "./runtime-DkPagH0y.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-D43Pu6eG.mjs";
import { i as collectRegistryInvocationInstances, n as getPluginRegistryInspectionResources } from "./registry-inspection-resources-COvkPmap.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { f as listProviderEnvAuthLookupKeys } from "./model-auth-markers-Clx9vUna.mjs";
import { D as isAmbientCredentialAllowedByProviderAuthPin } from "./store-BPXZsh12.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync, i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { n as PreparedModelRuntimePluginGenerationRetiredError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { C as resolveProviderSyntheticAuthWithPlugin, g as prepareProviderSyntheticAuthWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { a as releaseRuntimePluginWork, o as retainRuntimePluginWork, t as acquireAgentRuntimePluginRegistry } from "./runtime-plugins-ZiHXv-be.mjs";
//#region src/agents/agent-auth-credentials.ts
/** Converts auth-profile credentials into agent runtime credential maps. */
const AGENT_SECRET_REF_CONFIGURED_MARKER = "openclaw-secret-ref-configured";
/** Records only credential modes whose secret material is usable by a prepared runtime owner. */
function resolveUsableAgentCredentialModes(credentials) {
	const modes = {};
	for (const [rawProvider, credential] of Object.entries(credentials)) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		if (credential.type === "api_key" && credential.key && credential.key !== AGENT_SECRET_REF_CONFIGURED_MARKER) {
			const native = credential.nativeAuth;
			if (!native || normalizeProviderId(native.runtime) === provider) modes[provider] = native ? Object.freeze({
				source: "native",
				mode: native.mode === "api-key" ? "api_key" : native.mode
			}) : "api_key";
		} else if (credential.type === "token" && credential.token && (credential.expires === void 0 || credential.expires > Date.now())) modes[provider] = "token";
		else if (credential.type === "oauth" && !isOAuthRefreshFence(credential) && credential.access && credential.refresh && credential.expires > 0) modes[provider] = "oauth";
	}
	return Object.freeze(modes);
}
function convertAuthProfileCredentialToAgent(cred, options) {
	if (cred.type === "api_key" || cred.type === "token") {
		if (cred.type === "token" && cred.expires !== void 0) {
			const expires = asDateTimestampMs(cred.expires);
			if (expires === void 0 || Date.now() >= expires) return null;
		}
		const key = normalizeOptionalString(cred.type === "api_key" ? cred.key : cred.token);
		if (!key) {
			const ref = cred.type === "api_key" ? cred.keyRef : cred.tokenRef;
			return parseSecretRef(ref) !== null && options?.includeSecretRefPlaceholders === true ? {
				type: "api_key",
				key: AGENT_SECRET_REF_CONFIGURED_MARKER
			} : null;
		}
		return {
			type: "api_key",
			key
		};
	}
	if (cred.type === "oauth") {
		if (isOAuthRefreshFence(cred)) return null;
		const access = normalizeOptionalString(cred.access) ?? "";
		const refresh = normalizeOptionalString(cred.refresh) ?? "";
		const expires = asDateTimestampMs(cred.expires);
		if (!access || !refresh || expires === void 0 || expires <= 0) return null;
		return {
			type: "oauth",
			access,
			refresh,
			expires
		};
	}
	return null;
}
/** Build one canonically selected credential per normalized provider. */
function resolveAgentCredentialMapFromStore(store, options) {
	const credentials = {};
	for (const credential of Object.values(store.profiles)) {
		const provider = normalizeProviderId(credential.provider ?? "");
		if (!provider) continue;
		if (credentials[provider]) continue;
		const profileIds = resolveAuthProfileOrder({
			cfg: options?.config,
			store,
			provider,
			...options?.includeSecretRefPlaceholders === true ? { readinessMode: "read-only" } : {}
		});
		for (const profileId of profileIds) {
			const profile = store.profiles[profileId];
			if (!profile) continue;
			const converted = convertAuthProfileCredentialToAgent(profile, options);
			if (converted) {
				credentials[provider] = converted;
				break;
			}
		}
	}
	return credentials;
}
//#endregion
//#region src/agents/agent-auth-discovery-core.ts
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
function addEnvBackedAgentCredentials(credentials, options = {}) {
	const env = options.env ?? process.env;
	const lookupParams = {
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	};
	const { aliasMap, envCandidateMap: candidateMap, authEvidenceMap } = resolveProviderAuthLookupMaps(lookupParams);
	const next = { ...credentials };
	for (const provider of listProviderEnvAuthLookupKeys({
		envCandidateMap: candidateMap,
		authEvidenceMap
	})) {
		if (next[provider]) continue;
		const resolved = resolveEnvApiKey(provider, env, {
			config: options.config,
			workspaceDir: options.workspaceDir,
			aliasMap,
			candidateMap,
			authEvidenceMap
		});
		if (!resolved?.apiKey) continue;
		next[provider] = {
			type: "api_key",
			key: resolved.apiKey
		};
	}
	return next;
}
//#endregion
//#region src/agents/agent-auth-discovery.ts
function resolveAmbientCredentialInputs(options) {
	const credentials = addEnvBackedAgentCredentials({}, options);
	const syntheticAuthProviderRefs = options.syntheticAuthProviderRefs ?? resolveRuntimeSyntheticAuthProviderRefs();
	const authoritativeSyntheticAuthProviderRefs = new Set([...options.authoritativeSyntheticAuthProviderRefs ?? []].map(normalizeProviderId).filter(Boolean));
	for (const provider of authoritativeSyntheticAuthProviderRefs) delete credentials[provider];
	const providers = [];
	for (const provider of syntheticAuthProviderRefs) {
		const normalizedProvider = normalizeProviderId(provider);
		if (!authoritativeSyntheticAuthProviderRefs.has(normalizedProvider) && credentials[provider]) continue;
		if (!isAmbientCredentialAllowedByProviderAuthPin({
			config: options.config,
			authAliasLookupParams: {
				...options.env ? { env: options.env } : {},
				...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}
			},
			provider,
			type: "api_key"
		})) continue;
		providers.push(provider);
	}
	return {
		credentials,
		providers
	};
}
function syntheticAuthParams(options, provider) {
	return {
		config: options.config,
		workspaceDir: options.workspaceDir,
		env: options.env,
		provider,
		context: {
			config: options.config,
			provider,
			providerConfig: options.config?.models?.providers?.[provider]
		}
	};
}
function addSyntheticCredential(credentials, provider, resolved) {
	const apiKey = resolved?.apiKey?.trim();
	if (apiKey) credentials[normalizeProviderId(provider) || provider] = {
		type: "api_key",
		key: apiKey,
		...resolved?.nativeAuth ? { nativeAuth: resolved.nativeAuth } : {}
	};
}
/** Reads prepared workspace/config/env credentials independently of agent-local profiles. */
function resolveAmbientAgentCredentialsForDiscovery(options = {}) {
	const { credentials, providers } = resolveAmbientCredentialInputs(options);
	for (const provider of providers) addSyntheticCredential(credentials, provider, options.resolveSyntheticAuth ? options.resolveSyntheticAuth(provider) : resolveProviderSyntheticAuthWithPlugin(syntheticAuthParams(options, provider)));
	return credentials;
}
/** Prepares external availability before publishing a generation's synchronous auth facts. */
async function prepareAmbientAgentCredentialsForDiscovery(options = {}) {
	const { credentials, providers } = resolveAmbientCredentialInputs(options);
	for (const provider of providers) {
		options.signal?.throwIfAborted();
		const resolved = options.resolveSyntheticAuth ? await options.resolveSyntheticAuth(provider) : await prepareProviderSyntheticAuthWithPlugin({
			...syntheticAuthParams(options, provider),
			signal: options.signal,
			preparationOwner: options.preparationOwner
		});
		options.signal?.throwIfAborted();
		addSyntheticCredential(credentials, provider, resolved);
	}
	return credentials;
}
async function resolveAgentDiscoveryAuthFacts(agentDir, options) {
	const storeOptions = {
		allowKeychainPrompt: false,
		...options?.config ? { config: options.config } : {},
		...options?.externalCli ? { externalCli: options.externalCli } : {},
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
	};
	const store = options?.preparedStore ? options.preparedStore : options?.skipExternalAuthProfiles === true ? await ensureAuthProfileStoreWithoutExternalProfilesAsync(agentDir, {
		allowKeychainPrompt: false,
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {},
		...options?.readOnly === true ? { readOnly: true } : {}
	}) : await ensureAuthProfileStoreAsync(agentDir, {
		...storeOptions,
		...options?.readOnly === true ? { readOnly: true } : {}
	});
	const credentials = resolveAgentCredentialMapFromStore(store, {
		includeSecretRefPlaceholders: options?.readOnly === true,
		config: options?.config
	});
	const ambientCredentials = options?.ambientCredentials ?? resolveAmbientAgentCredentialsForDiscovery({
		config: options?.config,
		workspaceDir: options?.workspaceDir,
		env: options?.env,
		syntheticAuthProviderRefs: options?.syntheticAuthProviderRefs
	});
	for (const [provider, credential] of Object.entries(ambientCredentials)) {
		if (credentials[provider]) continue;
		credentials[provider] = credential;
	}
	return {
		store,
		credentials
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.resources.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.ephemeralPreparedRegistryResources"), () => ({
	views: /* @__PURE__ */ new Set(),
	registries: /* @__PURE__ */ new WeakMap()
}));
/** The original view stays authoritative until ordinary retirement or explicit process close. */
var PreparedRegistryResources = class {
	constructor(acquired) {
		this.acquired = acquired;
		this.completion = createDeferredCore();
		this.releases = /* @__PURE__ */ new Set();
		this.failures = [];
		this.claims = 0;
		this.closed = false;
		this.finishing = false;
		state.views.add(this);
		state.registries.set(acquired.registry, this);
		this.completion.promise.then(() => state.views.delete(this), () => {});
	}
	get primaryRegistry() {
		return this.acquired.primaryRegistry;
	}
	assertOpen() {
		if (this.closed) throw new Error("Prepared plugin registry resources have been released");
	}
	retain() {
		this.assertOpen();
		const claim = this.acquired.resources.retain();
		this.claims++;
		let release;
		return { release: () => {
			if (!release) {
				const completion = createDeferredCore();
				release = completion.promise;
				const pending = this.trackRelease(claim.release);
				this.claims--;
				(this.claims === 0 ? this.close() : pending).then(completion.resolve, completion.reject);
			}
			return release;
		} };
	}
	close() {
		if (!this.closed) {
			this.closed = true;
			this.trackRelease(this.acquired.releaseRegistry);
		}
		if (this.claims === 0 && !this.finishing) {
			this.finishing = true;
			(async () => {
				while (this.releases.size > 0) await Promise.all(this.releases);
				if (this.failures.length > 0) this.completion.reject(aggregatePluginRuntimeCloseErrors(this.failures, "Prepared plugin resources failed to close"));
				else this.completion.resolve();
			})();
		}
		return this.completion.promise;
	}
	trackRelease(release) {
		const operation = createDeferredCore();
		const pending = operation.promise.catch((error) => {
			this.failures.push(error);
		}).finally(() => this.releases.delete(pending));
		this.releases.add(pending);
		try {
			operation.resolve(release());
		} catch (error) {
			operation.reject(error);
		}
		return pending;
	}
};
/** Batch scopes retain selected sources through later catalog work; idle publication owns custody only. */
var PreparedModelRuntimeBuildResources = class {
	constructor(retainPhysicalRegistry) {
		this.retainPhysicalRegistry = retainPhysicalRegistry;
		this.registries = /* @__PURE__ */ new Set();
		this.releases = new AsyncDisposableStack();
	}
	assertOpen() {
		if (this.releases.disposed) throw new Error("Prepared registry construction resources have been released");
	}
	retainRegistry(registry) {
		this.assertOpen();
		if (this.registries.has(registry)) return;
		const release = this.retainPhysicalRegistry(registry);
		let releaseWork = () => {};
		let completion;
		const releaseClaim = () => completion ??= releaseRuntimePluginWork(release, releaseWork);
		this.releases.defer(releaseClaim);
		try {
			releaseWork = retainRuntimePluginWork([registry]);
		} catch (error) {
			releaseClaim().catch(() => {});
			throw error;
		}
		this.registries.add(registry);
	}
	retainGeneration(generation) {
		for (const registry of [generation?.pluginRegistry, generation?.inboundPluginRegistry]) if (registry) this.retainRegistry(registry);
	}
	async load(params, onPrimaryRegistry) {
		this.assertOpen();
		const assertLifetime = capturePreparedModelRuntimeLifetime();
		const acquired = await acquireAgentRuntimePluginRegistry(params);
		if ("resources" in acquired) {
			const resources = new PreparedRegistryResources(acquired);
			try {
				assertLifetime();
				this.retainRegistry(acquired.registry);
				acquired.releaseWork();
			} catch (error) {
				await releaseRuntimePluginWork(() => resources.close(), acquired.releaseWork);
				throw error;
			}
		} else this.retainRegistry(acquired.registry);
		onPrimaryRegistry(state.registries.get(acquired.registry)?.primaryRegistry ?? acquired.primaryRegistry);
		return acquired.registry;
	}
	[Symbol.asyncDispose]() {
		this.registries.clear();
		return this.releases.disposeAsync();
	}
};
/** Borrow the immutable view's prepared owner, including its adopted donor registrations. */
function retainPreparedModelRuntimeSnapshotResources(snapshot) {
	const resources = snapshot.pluginRegistry && state.registries.get(snapshot.pluginRegistry);
	if (!resources) return;
	return {
		release: resources.retain().release,
		assertOpen: () => resources.assertOpen()
	};
}
/** Fence owned views before joining builds or the callers that still hold physical claims. */
async function closeEphemeralPreparedModelRuntimeResources() {
	const failures = (await Promise.allSettled([...state.views].map(async (view) => {
		try {
			await view.close();
		} catch (error) {
			if (hasRetainedPluginRuntimeCloseError(error) || state.views.delete(view)) throw error;
		}
	}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Prepared plugin resources failed to close");
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-lifetime.ts
const log = createSubsystemLogger("agents/prepared-model-runtime");
const { generations, active, retirements, publications } = resolveGlobalSingleton(Symbol.for("openclaw.preparedPluginLifetimes"), () => ({
	generations: /* @__PURE__ */ new WeakMap(),
	active: /* @__PURE__ */ new Set(),
	retirements: /* @__PURE__ */ new Set(),
	publications: /* @__PURE__ */ new WeakMap()
}));
function createLifetime(dispose, retainWork) {
	const cleanupWork = new AsyncWorkScope();
	const references = /* @__PURE__ */ new Set();
	let closing;
	let disposing = false;
	const lifetime = {
		get referenced() {
			return references.size > 0;
		},
		retain(work = false) {
			if (closing) throw new PreparedModelRuntimePluginGenerationRetiredError("Prepared plugin generation has retired");
			const releaseWork = work ? retainWork?.() : void 0;
			const reference = {};
			references.add(reference);
			let releaseCompletion;
			return () => {
				if (references.delete(reference)) {
					const completion = references.size === 0 ? lifetime.close() : void 0;
					releaseCompletion = releaseWork ? releaseRuntimePluginWork(() => completion, releaseWork) : completion;
				}
				return releaseCompletion;
			};
		},
		close() {
			if (!closing) {
				const completion = closing = createDeferredCore();
				retirements.add(completion.promise);
				completion.promise.then(() => {
					active.delete(lifetime);
					retirements.delete(completion.promise);
				}, (error) => {
					if (!hasRetainedPluginRuntimeCloseError(error)) active.delete(lifetime);
				});
			}
			if (references.size === 0 && !disposing) {
				disposing = true;
				const completion = closing;
				(async () => {
					try {
						await cleanupWork.track(dispose);
					} finally {
						await cleanupWork.run(() => cleanupWork.drain());
					}
				})().then(() => completion.resolve(), completion.reject);
			}
			return closing.promise;
		}
	};
	active.add(lifetime);
	return lifetime;
}
/** Retain physical registry custody for construction or publication, independent of active work. */
function retainPreparedPluginRegistry(registryView) {
	registerPreparedPluginLifetime();
	const prepared = retainPreparedModelRuntimeSnapshotResources({ pluginRegistry: registryView });
	if (prepared) return prepared.release;
	const inspection = getPluginRegistryInspectionResources(registryView);
	if (inspection) return inspection.retain().release;
	const registry = getPluginRegistryResourceOwner(registryView);
	let lifetime = getPluginRegistryLifetime(registry);
	if (!lifetime) {
		if (capturePluginRegistryLifecycleEpoch(registry)) return;
		if (isPluginRegistryRetired(registry)) throw new PreparedModelRuntimePluginGenerationRetiredError("Prepared plugin registry has retired");
		markPluginRegistryActive(registry);
		lifetime = createLifetime(async () => {
			try {
				return await disposePluginRegistryInstances(registry);
			} catch (error) {
				throw new PluginRuntimeCloseRetainedError(error);
			}
		});
		bindPluginRegistryLifetime(registry, lifetime);
	}
	return lifetime.retain();
}
/** Construction registers the same final owner before an awaited inspection can finish. */
function registerPreparedPluginLifetime() {
	registerPreparedPluginRetirement(closePreparedPluginGenerations);
}
function ownPreparedPluginGeneration(generation) {
	const existing = generations.get(generation);
	if (existing) return existing;
	registerPreparedPluginLifetime();
	const releaseMetadata = retainPluginCache(getPluginMetadataSnapshotCache(generation.pluginMetadataSnapshot));
	const releases = [];
	const selectedRegistries = new Set([generation.pluginRegistry, generation.inboundPluginRegistry].filter((registry) => registry !== void 0));
	const acquisitionFailures = [];
	const lifetime = createLifetime(async () => {
		const results = await Promise.allSettled(releases.map(async (release) => await release()));
		releaseMetadata();
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw aggregatePluginRuntimeCloseErrors([...acquisitionFailures, ...failures], "Prepared plugin generation cleanup failed");
	}, () => retainRuntimePluginWork(selectedRegistries));
	try {
		for (const registry of selectedRegistries) {
			const release = retainPreparedPluginRegistry(registry);
			if (release) releases.push(release);
		}
	} catch (error) {
		acquisitionFailures.push(error);
		lifetime.close().catch(() => {});
		throw error;
	}
	generations.set(generation, lifetime);
	return lifetime;
}
function retainPreparedPluginGeneration(generation) {
	const release = ownPreparedPluginGeneration(generation).retain(true);
	return async () => {
		await release();
	};
}
/** Publishing replaces one reference, while admitted leases retain their exact generation. */
function publishPreparedPluginGeneration(owner, generation) {
	const previous = publications.get(owner);
	const instances = new Set([generation.pluginRegistry, generation.inboundPluginRegistry].flatMap((registry) => registry ? Array.from(collectRegistryInvocationInstances(registry)) : []));
	const cacheSignal = getPluginCacheRetirementSignal(getPluginMetadataSnapshotCache(generation.pluginMetadataSnapshot));
	const isCurrent = () => !cacheSignal.aborted && [...instances].every((instance) => instance.acceptingCalls);
	if (!isCurrent()) throw new PreparedModelRuntimePluginGenerationRetiredError("Prepared plugin generation retired before publication");
	const release = ownPreparedPluginGeneration(generation).retain();
	const version = owner.generation;
	const gatewayLenders = /* @__PURE__ */ new Set();
	let signal;
	const unsubscribe = () => signal?.removeEventListener("abort", observe);
	const observe = () => {
		unsubscribe();
		if (!isCurrent()) {
			if (owner.generation === version) {
				owner.generation++;
				retirePreparedModelRuntimeGeneration(owner);
				owner.needsRefresh = true;
				owner.refreshError = new PreparedModelRuntimePluginGenerationRetiredError("Prepared model runtime plugin generation retired");
				owner.pluginGeneration = void 0;
				const retiredGatewayLoan = [...instances].some((instance) => {
					const registry = instance.owner?.registry;
					return !instance.acceptingCalls && registry !== void 0 && gatewayLenders.has(registry);
				});
				log.debug(`Prepared plugin publication retired: metadataCacheRetired=${cacheSignal.aborted}, provenance=${owner.provenance}, pending=${Boolean(owner.pending)}, gatewayLoan=${retiredGatewayLoan}`);
				releasePreparedPluginPublication(owner);
				if (retiredGatewayLoan) owner.onPluginGenerationRetired?.();
				return;
			}
			releasePreparedPluginPublication(owner);
			return;
		}
		gatewayLenders.clear();
		signal = AbortSignal.any([cacheSignal, ...[...instances].flatMap((instance) => {
			const registry = instance.owner?.registry;
			if (registry && getPluginRegistryGatewayOwner(registry)?.current() === registry) gatewayLenders.add(registry);
			const current = registry && capturePluginRegistryLifecycleSignal(registry, capturePluginRegistryLifecycleEpoch(registry), { scopedRuntime: true });
			return current ? [current] : [];
		})]);
		signal.addEventListener("abort", observe, { once: true });
	};
	publications.set(owner, { release: () => {
		unsubscribe();
		return Promise.resolve(release());
	} });
	observe();
	previous?.release()?.catch(() => {});
}
function releasePreparedPluginPublication(owner) {
	const previous = publications.get(owner);
	publications.delete(owner);
	previous?.release()?.catch(() => {});
}
/** Failed unpublished builds release only their own generations, never a sibling's cache. */
async function discardPreparedPluginGeneration(generation) {
	const lifetime = generations.get(generation);
	if (lifetime && !lifetime.referenced) await lifetime.close();
}
/** Process shutdown owns every outstanding generation and any earlier cleanup failure. */
async function closePreparedPluginGenerations() {
	const resourcesClosed = Promise.allSettled([closeEphemeralPreparedModelRuntimeResources()]);
	const pending = new Set([...active].map((lifetime) => lifetime.close()));
	for (const completion of retirements) pending.add(completion);
	for (const completion of pending) retirements.delete(completion);
	const results = await Promise.allSettled(pending);
	results.push(...await resourcesClosed);
	const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	let retained = failures.some(hasRetainedPluginRuntimeCloseError);
	try {
		await waitForPluginCacheRetirement(true);
	} catch (reason) {
		retained = true;
		failures.push(reason);
	}
	if (retained) throw new AggregateError(failures, "Prepared plugin generations failed to close");
	if (failures.length) log.warn(formatErrorMessage(new AggregateError(failures, "Prepared plugin cleanup completed with failures")));
}
//#endregion
export { releasePreparedPluginPublication as a, PreparedModelRuntimeBuildResources as c, prepareAmbientAgentCredentialsForDiscovery as d, resolveAgentDiscoveryAuthFacts as f, resolveUsableAgentCredentialModes as h, registerPreparedPluginLifetime as i, closeEphemeralPreparedModelRuntimeResources as l, resolveAgentCredentialMapFromStore as m, ownPreparedPluginGeneration as n, retainPreparedPluginGeneration as o, resolveAmbientAgentCredentialsForDiscovery as p, publishPreparedPluginGeneration as r, retainPreparedPluginRegistry as s, discardPreparedPluginGeneration as t, retainPreparedModelRuntimeSnapshotResources as u };
