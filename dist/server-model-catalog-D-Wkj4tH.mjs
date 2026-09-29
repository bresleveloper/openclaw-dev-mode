import { w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { a as getPreparedModelRuntimeAuthMaterializations, c as loadPreparedModelRuntimeAuth } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import { r as resolvePublishedModelCatalogOwner } from "./prepared-model-catalog-owner-BIljybvR.mjs";
import { i as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-4oGnFFN5.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { t as createPreparedGatewayModelCatalog } from "./server-model-catalog-view-muuNaRwE.mjs";
//#region src/gateway/server-model-catalog.ts
async function resolveLoader(params) {
	if (params?.loadPublishedPreparedModelCatalogOwnerSnapshot) return params.loadPublishedPreparedModelCatalogOwnerSnapshot;
	const { loadPublishedPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-CFgw7dXn.mjs");
	return loadPublishedPreparedModelCatalogOwnerSnapshot;
}
async function loadGatewayModelCatalogOwnerSnapshot(params) {
	const candidate = await (await resolveLoader(params))({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config: (params?.getConfig ?? getRuntimeConfig)(),
		readOnly: params?.readOnly !== false,
		...params?.refreshFullCatalog !== void 0 ? { refreshFullCatalog: params.refreshFullCatalog } : {},
		...params?.providerDiscoveryProviderIds ? { providerDiscoveryProviderIds: params.providerDiscoveryProviderIds } : {},
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return {
		candidate,
		owner: {
			...resolvePublishedModelCatalogOwner(candidate),
			authMaterializations: getPreparedModelRuntimeAuthMaterializations(candidate)
		}
	};
}
function projectGatewayModelCatalogSnapshot(owner) {
	return {
		...owner.modelCatalog,
		agentId: owner.agentId,
		agentDir: owner.agentDir,
		catalogComplete: isPreparedModelCatalogFull(owner.modelCatalog),
		workspaceDir: owner.workspaceDir,
		config: owner.config
	};
}
async function loadPreparedGatewayModelCatalogSnapshot(params) {
	for (;;) {
		let loaded;
		try {
			loaded = await loadGatewayModelCatalogOwnerSnapshot(params);
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			throw error;
		}
		const { candidate, owner } = loaded;
		let refreshedAuth;
		try {
			refreshedAuth = params?.refreshAuth ? await loadPreparedModelRuntimeAuth(candidate, params.authScope ?? { providerIds: owner.modelCatalog.entries.map((entry) => entry.provider) }) : void 0;
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			throw error;
		}
		return {
			...projectGatewayModelCatalogSnapshot(owner),
			authModes: refreshedAuth?.authModes ?? owner.authModes,
			authStore: refreshedAuth?.authStore ?? owner.authStore,
			metadataSnapshot: owner.metadataSnapshot,
			authMaterializations: owner.authMaterializations,
			pluginRegistry: owner.pluginRegistry,
			isCurrent: owner.isCurrent,
			observationConfig: owner.observationConfig
		};
	}
}
async function loadGatewayModelCatalogSnapshot(params) {
	const { authModes: _authModes, authStore: _authStore, metadataSnapshot: _metadataSnapshot, authMaterializations: _authMaterializations, pluginRegistry: _pluginRegistry, isCurrent: _isCurrent, observationConfig: _observationConfig, ...snapshot } = await loadPreparedGatewayModelCatalogSnapshot(params);
	return snapshot;
}
async function loadGatewayModelCatalog(params) {
	return (await loadGatewayModelCatalogSnapshot(params)).entries;
}
function readPreparedGatewayModelCatalogSync(getPreparedModelCatalogOwnerSnapshot, config, params) {
	const owner = getPreparedModelCatalogOwnerSnapshot({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		readOnly: true,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (!owner) return;
	const catalog = owner.readFullModelCatalog?.() ?? owner.modelCatalog;
	return createPreparedGatewayModelCatalog({
		entries: catalog.entries,
		routeVariants: catalog.routeVariants,
		pluginRegistry: owner.pluginRegistry,
		metadataSnapshot: owner.metadataSnapshot
	});
}
/** Reads the newest completed published catalog without starting provider discovery. */
async function readPreparedGatewayModelCatalog(params) {
	const { getPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-CFgw7dXn.mjs");
	return readPreparedGatewayModelCatalogSync(getPreparedModelCatalogOwnerSnapshot, (params?.getConfig ?? getRuntimeConfig)(), params);
}
async function readPreparedGatewayModelCatalogBatch(agentIds, params) {
	if (agentIds.length === 0) return [];
	const { getPreparedModelCatalogOwnerSnapshot, withPreparedModelRuntimeReadBatch } = await import("./prepared-model-catalog-CFgw7dXn.mjs");
	const config = (params?.getConfig ?? getRuntimeConfig)();
	return withPreparedModelRuntimeReadBatch(() => withAgentRosterFactsBatch(config, () => agentIds.map((agentId) => {
		try {
			return {
				status: "fulfilled",
				value: readPreparedGatewayModelCatalogSync(getPreparedModelCatalogOwnerSnapshot, config, { agentId })
			};
		} catch (reason) {
			return {
				status: "rejected",
				reason
			};
		}
	})));
}
/** Reads the published owner generation without activating full catalog discovery. */
async function readPreparedGatewayModelCatalogOwnerSnapshot(params) {
	const { getPublishedPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CFgw7dXn.mjs");
	const config = (params?.getConfig ?? getRuntimeConfig)();
	const candidate = getPublishedPreparedModelCatalogOwnerSnapshot({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (!candidate) return;
	const published = materializePreparedModelCatalogOwner(candidate);
	const owner = resolvePublishedModelCatalogOwner(published);
	return {
		...projectGatewayModelCatalogSnapshot(owner),
		authModes: owner.authModes,
		authStore: owner.authStore,
		metadataSnapshot: owner.metadataSnapshot,
		authMaterializations: getPreparedModelRuntimeAuthMaterializations(published),
		pluginRegistry: owner.pluginRegistry,
		isCurrent: owner.isCurrent,
		observationConfig: owner.observationConfig
	};
}
//#endregion
export { readPreparedGatewayModelCatalogBatch as a, readPreparedGatewayModelCatalog as i, loadGatewayModelCatalogSnapshot as n, readPreparedGatewayModelCatalogOwnerSnapshot as o, loadPreparedGatewayModelCatalogSnapshot as r, loadGatewayModelCatalog as t };
