import { O as listAgentIds, a as resolveAgentDir, d as resolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-DU9GPmr_.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { a as getPreparedModelRuntimeAuthMaterializations, c as loadPreparedModelRuntimeAuth, d as setPreparedModelRuntimeAuthLoader, f as setPreparedModelRuntimeAuthMaterializations, p as setPreparedModelRuntimeAuthStore, r as getPreparedModelFullCatalogAuth, u as setPreparedModelRuntimeAuthLabels } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import { r as resolvePublishedModelCatalogOwner } from "./prepared-model-catalog-owner-BIljybvR.mjs";
import { t as PreparedModelCatalogConfigReplacedError } from "./prepared-model-catalog.errors-DftAtHN9.mjs";
import { i as normalizeThinkingCatalogProviders } from "./thinking-runtime-Dvszh-e-.mjs";
import "./workspace-mlzi3k1x.mjs";
import { i as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-4oGnFFN5.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { a as acquireReadOnlyPreparedModelRuntime, c as getPreparedModelRuntimeSnapshot, f as prepareModelRuntimeSnapshot, h as refreshPreparedModelRuntimeCatalog, o as activateStandalonePreparedModelRuntime, r as acquirePreparedModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime, v as preparedModelRuntimeConfigsMatch } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { n as prepareScopedReadOnlyLiveModelCatalog, r as prepareScopedReadOnlyModelCatalog } from "./prepared-model-runtime.scoped-catalog-B_0BxfwL.mjs";
//#region src/agents/prepared-model-catalog.ts
/** Lifecycle-owned model catalog access. */
async function preparePublishedCatalogOwner(input) {
	return { snapshot: await prepareModelRuntimeSnapshot(input) };
}
async function materializeRequestedModelCatalog(snapshot, readOnly, refreshFullCatalog, providerIds) {
	if (!snapshot.loadFullModelCatalog) return snapshot;
	const modelCatalog = (refreshFullCatalog === true ? await refreshPreparedModelRuntimeCatalog(snapshot, {
		refresh: readOnly !== true,
		...providerIds ? { providerIds } : {}
	}) : void 0) ?? (readOnly === true ? snapshot.readFullModelCatalog?.() : await snapshot.loadFullModelCatalog({
		refresh: refreshFullCatalog === true,
		...providerIds ? { providerIds } : {}
	}));
	if (!modelCatalog) return snapshot;
	return materializePreparedModelCatalogOwner(snapshot, modelCatalog);
}
/** Carries the published catalog and paired auth while expired inventory renews separately. */
function materializePreparedModelCatalogOwner(snapshot, modelCatalog = snapshot.readFullModelCatalog?.()) {
	if (!modelCatalog) return snapshot;
	const fullAuth = getPreparedModelFullCatalogAuth(modelCatalog);
	if (!fullAuth) throw new Error("prepared full model catalog omitted its auth generation");
	const materialized = Object.freeze({
		...snapshot,
		authModes: fullAuth.authModes,
		modelCatalog
	});
	setPreparedModelRuntimeAuthStore(materialized, fullAuth.authStore);
	setPreparedModelRuntimeAuthLabels(materialized, fullAuth.providerAuthLabels);
	setPreparedModelRuntimeAuthLoader(materialized, async (scope) => await loadPreparedModelRuntimeAuth(snapshot, scope) ?? fullAuth);
	setPreparedModelRuntimeAuthMaterializations(materialized, getPreparedModelRuntimeAuthMaterializations(snapshot));
	return materialized;
}
function acceptsPreparedSnapshotConfig(snapshot, input, policy) {
	return policy === "published" || preparedModelRuntimeConfigsMatch(snapshot.config, input.config);
}
function resolveInputs(params = {}) {
	const config = params.config ?? getRuntimeConfig();
	const explicitOrDefaultAgentId = params.agentId ?? (params.agentDir === void 0 ? resolveAmbientOwnerAgentId(config) : void 0);
	const agentDir = params.agentDir ?? resolveAgentDir(config, explicitOrDefaultAgentId, params.env);
	const matchingAgentIds = explicitOrDefaultAgentId !== void 0 ? [] : listAgentIds(config).filter((candidateAgentId) => resolveAgentDir(config, candidateAgentId, params.env) === agentDir);
	const agentId = explicitOrDefaultAgentId ?? (matchingAgentIds.length === 1 ? matchingAgentIds[0] : void 0);
	const explicitWorkspaceDir = params.workspaceDir === void 0 ? void 0 : params.workspaceDir;
	const activationWorkspaceDir = explicitWorkspaceDir ?? (agentId ? resolveAgentWorkspaceDir(config, agentId, params.env) : void 0);
	const full = {
		...agentId ? { agentId } : {},
		agentDir,
		config,
		...params.env ? { env: params.env } : {},
		inheritedAuthDir: resolveLegacyInheritedAuthDir(config, params.env),
		...explicitWorkspaceDir ? { workspaceDir: explicitWorkspaceDir } : {},
		...params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
	};
	const exact = params.readOnly ? {
		...full,
		readOnly: true
	} : full;
	const activationFull = activationWorkspaceDir ? {
		...full,
		workspaceDir: activationWorkspaceDir
	} : full;
	return {
		exact,
		full,
		activationFull,
		activationExact: params.readOnly ? {
			...activationFull,
			readOnly: true
		} : activationFull
	};
}
/** Returns the configured lifecycle owner for the current generation without starting discovery. */
function getPreparedModelCatalogOwnerSnapshot(params = {}) {
	const { activationExact, activationFull, exact, full } = resolveInputs(params);
	const publishedFull = getPreparedModelRuntimeSnapshot(full);
	if (publishedFull && preparedModelRuntimeConfigsMatch(publishedFull.config, full.config)) return publishedFull;
	if (activationFull.workspaceDir !== full.workspaceDir) {
		const activatedFull = getPreparedModelRuntimeSnapshot(activationFull);
		if (activatedFull && preparedModelRuntimeConfigsMatch(activatedFull.config, full.config)) return activatedFull;
	}
	if (exact === full) return;
	const publishedExact = getPreparedModelRuntimeSnapshot(exact);
	if (publishedExact && preparedModelRuntimeConfigsMatch(publishedExact.config, exact.config)) return publishedExact;
	if (activationExact.workspaceDir === exact.workspaceDir) return;
	const activatedExact = getPreparedModelRuntimeSnapshot(activationExact);
	return activatedExact && preparedModelRuntimeConfigsMatch(activatedExact.config, exact.config) ? activatedExact : void 0;
}
/**
* Returns the currently published lifecycle owner and its configured/static turn facts without
* config hashing, fallback construction, or full control-plane catalog materialization.
*/
function getPublishedPreparedModelCatalogOwnerSnapshot(params = {}) {
	const { activationFull, full } = resolveInputs(params);
	const published = getPreparedModelRuntimeSnapshot(full);
	if (published) return published;
	if (activationFull.workspaceDir === full.workspaceDir) return;
	return getPreparedModelRuntimeSnapshot(activationFull);
}
/** Returns the newest published catalog while expired inventory renews in the background. */
function getPreparedModelCatalogSnapshot(params = {}) {
	const owner = getPreparedModelCatalogOwnerSnapshot(params);
	return owner?.readFullModelCatalog?.() ?? owner?.modelCatalog;
}
async function resolveReadOnlyPublishedModelCatalogOwner(params, configPolicy, preparePublishedOwner = preparePublishedCatalogOwner) {
	const { activationFull, full } = resolveInputs(params);
	const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
	for (const candidate of fullCandidates) try {
		const prepared = await preparePublishedOwner(candidate);
		if (!acceptsPreparedSnapshotConfig(prepared.snapshot, candidate, configPolicy)) {
			await prepared.release?.();
			throw new PreparedModelCatalogConfigReplacedError(candidate.agentDir);
		}
		return prepared;
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
}
async function resolvePreparedModelCatalogOwnerSnapshotWithPolicy(params, configPolicy, preparePublishedOwner = preparePublishedCatalogOwner) {
	const { activationExact, activationFull, exact } = resolveInputs(params);
	if (params.readOnly) {
		const prepared = await resolveReadOnlyPublishedModelCatalogOwner(params, configPolicy, preparePublishedOwner);
		if (prepared) return prepared;
		const lease = await acquireReadOnlyPreparedModelRuntime(activationExact);
		if (!acceptsPreparedSnapshotConfig(lease.snapshot, activationExact, configPolicy)) try {
			var _usingCtx$1 = _usingCtx();
			_usingCtx$1.a(lease);
			throw new PreparedModelCatalogConfigReplacedError(activationExact.agentDir);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
		return {
			snapshot: lease.snapshot,
			release: () => lease[Symbol.asyncDispose]()
		};
	}
	try {
		const preparedExact = await preparePublishedOwner(exact);
		if (acceptsPreparedSnapshotConfig(preparedExact.snapshot, exact, configPolicy)) return preparedExact;
		await preparedExact.release?.();
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	const activated = await activateStandalonePreparedModelRuntime(activationExact, { catalogMode: "static" });
	if (activated && acceptsPreparedSnapshotConfig(activated, activationExact, configPolicy)) return { snapshot: activated };
	if (activated) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationExact.agentDir})`);
	const lease = await acquireAgentRunPreparedModelRuntime(activationFull);
	if (!acceptsPreparedSnapshotConfig(lease.snapshot, activationFull, configPolicy)) try {
		var _usingCtx3 = _usingCtx();
		_usingCtx3.a(lease);
		throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationFull.agentDir})`);
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
	return {
		snapshot: lease.snapshot,
		release: () => lease[Symbol.asyncDispose]()
	};
}
async function withPreparedModelCatalogOwnerPolicy(params, configPolicy, read, preparePublishedOwner = preparePublishedCatalogOwner) {
	const request = {
		...params,
		readOnly: params.readOnly ?? params.refreshFullCatalog !== true
	};
	const publishedReadOnlyOwner = request.readOnly ? getPreparedModelCatalogOwnerSnapshot(request) : void 0;
	const { snapshot, release } = await resolvePreparedModelCatalogOwnerSnapshotWithPolicy(request, configPolicy, preparePublishedOwner);
	try {
		return await read(request.readOnly && !publishedReadOnlyOwner ? snapshot : await materializeRequestedModelCatalog(snapshot, request.readOnly, request.refreshFullCatalog, request.providerDiscoveryProviderIds));
	} finally {
		await release?.();
	}
}
async function loadScopedReadOnlyModelCatalog(params) {
	const { activationExact, activationFull, full } = resolveInputs(params);
	const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
	for (const candidate of fullCandidates) try {
		const prepared = await prepareModelRuntimeSnapshot(candidate);
		if (!preparedModelRuntimeConfigsMatch(prepared.config, candidate.config)) continue;
		if (isPreparedModelCatalogFull(prepared.modelCatalog)) return prepared.modelCatalog;
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	return (params.scopedLiveProviderDiscovery === true ? prepareScopedReadOnlyLiveModelCatalog : prepareScopedReadOnlyModelCatalog)(activationExact, params.providerDiscoveryProviderIds ?? []);
}
/**
* Missing turn-path capabilities do not authorize another inventory, even without a published
* owner. Native harness observations keep their existing owner.
*/
async function loadProviderScopedThinkingCatalog(params) {
	const request = {
		...params,
		readOnly: true
	};
	const publishedOwner = getPreparedModelCatalogOwnerSnapshot(request);
	const owner = (await resolveReadOnlyPublishedModelCatalogOwner(request, "exact"))?.snapshot;
	let snapshot;
	if (owner?.loadNativeModelCatalog && params.agentRuntime && params.agentRuntime !== "openclaw") snapshot = await owner.loadNativeModelCatalog({
		provider: params.provider,
		modelId: params.model,
		runtime: params.agentRuntime
	});
	else {
		const catalog = owner ? (publishedOwner ? await materializeRequestedModelCatalog(owner, true, void 0) : owner).modelCatalog : {
			entries: [],
			routeVariants: []
		};
		const agentId = params.agentId ?? resolveAmbientOwnerAgentId(params.config);
		const { augmentModelCatalogWithAgentHarness } = await import("./model-catalog--K4QCD1z.mjs");
		snapshot = await augmentModelCatalogWithAgentHarness({
			cfg: params.config,
			agentId,
			agentDir: params.agentDir ?? resolveAgentDir(params.config, agentId),
			workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir(),
			defaultProvider: params.provider,
			defaultModel: `${params.provider}/${params.model}`,
			agentRuntime: params.agentRuntime,
			snapshot: catalog
		});
	}
	let entries = snapshot.entries;
	if (params.agentRuntime) {
		const entry = findModelInCatalog(entries, params.provider, params.model);
		if (entry) {
			const { selectModelCatalogRuntimeEntry } = await import("./model-catalog-view-DNjVyii7.mjs");
			const selected = selectModelCatalogRuntimeEntry({
				entry,
				routeVariants: snapshot.routeVariants,
				runtimeId: params.agentRuntime
			}).entry;
			entries = entries.map((candidate) => candidate === entry ? selected : candidate);
		}
	}
	entries = normalizeThinkingCatalogProviders(entries);
	if (params.requiredInputRoute !== void 0) {
		const entry = findModelInCatalog(entries, params.provider, params.model);
		if (entry?.input === void 0 || !modelTransportRoutesMatch(entry, params.requiredInputRoute)) return [];
	}
	return entries;
}
/** Retains published or temporary catalog resources through an asynchronous read. */
async function withPreparedModelCatalogOwner(params, read) {
	return await withPreparedModelCatalogOwnerPolicy(params, "exact", read, async (input) => {
		const lease = await acquirePreparedModelRuntimeSnapshot(input);
		return {
			snapshot: lease.snapshot,
			release: () => lease[Symbol.asyncDispose]()
		};
	});
}
/** Resolves the lifecycle owner for an exact caller-supplied config. */
async function loadPreparedModelCatalogOwnerSnapshot(params = {}) {
	return await withPreparedModelCatalogOwnerPolicy(params, "exact", (snapshot) => snapshot);
}
/** Resolves the currently published owner when Gateway config changes during the read. */
async function loadPublishedPreparedModelCatalogOwnerSnapshot(params = {}) {
	return await withPreparedModelCatalogOwnerPolicy(params, "published", (snapshot) => snapshot);
}
/** Resolves a complete published owner for long-lived runtime consumers. */
async function loadResolvedPublishedModelCatalogOwner(params = {}) {
	return resolvePublishedModelCatalogOwner(await loadPublishedPreparedModelCatalogOwnerSnapshot(params));
}
/** Reads one atomic catalog generation, activating a lifecycle owner when needed. */
async function loadPreparedModelCatalogSnapshot(params = {}) {
	const readOnly = params.readOnly ?? params.refreshFullCatalog !== true;
	if (readOnly && params.providerDiscoveryProviderIds) return loadScopedReadOnlyModelCatalog({
		...params,
		readOnly
	});
	return (await loadPreparedModelCatalogOwnerSnapshot(params)).modelCatalog;
}
async function readPreparedModelCatalog(params = {}) {
	return (await loadPreparedModelCatalogSnapshot(params)).entries;
}
/** Reads the committed owner generation for long-lived runtime work. */
async function loadPublishedPreparedModelCatalog(params = {}) {
	return (await loadPublishedPreparedModelCatalogOwnerSnapshot(params)).modelCatalog.entries;
}
//#endregion
export { loadPreparedModelCatalogSnapshot as a, loadPublishedPreparedModelCatalogOwnerSnapshot as c, readPreparedModelCatalog as d, withPreparedModelCatalogOwner as f, loadPreparedModelCatalogOwnerSnapshot as i, loadResolvedPublishedModelCatalogOwner as l, getPreparedModelCatalogSnapshot as n, loadProviderScopedThinkingCatalog as o, getPublishedPreparedModelCatalogOwnerSnapshot as r, loadPublishedPreparedModelCatalog as s, getPreparedModelCatalogOwnerSnapshot as t, materializePreparedModelCatalogOwner as u };
