import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./io-DIF-KW3P.mjs";
import { l as loadPreparedModelRuntimeAuth, o as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { r as resolvePublishedModelCatalogOwner } from "./prepared-model-catalog-owner-CyNDDKq6.mjs";
import { t as createPreparedGatewayModelCatalog } from "./server-model-catalog-view-DGYC_Ub2.mjs";
import { n as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-CcPwbyRw.mjs";
//#region src/gateway/server-model-catalog.ts
async function loadGatewayModelCatalogOwnerSnapshot(params) {
	const candidate = await (await (params?.loadPublishedPreparedModelCatalogOwnerSnapshot ?? import("./prepared-model-catalog-CCWmZ0HZ.mjs").then((module) => module.loadPublishedPreparedModelCatalogOwnerSnapshot)))({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config: (params?.getConfig ?? readRuntimeConfig)(),
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
function projectPreparedGatewayModelCatalogSnapshot(owner, authMaterializations, refreshedAuth) {
	return {
		...owner.modelCatalog,
		agentId: owner.agentId,
		agentDir: owner.agentDir,
		catalogComplete: isPreparedModelCatalogFull(owner.modelCatalog),
		workspaceDir: owner.workspaceDir,
		config: owner.config,
		authModes: refreshedAuth?.authModes ?? owner.authModes,
		authStore: refreshedAuth?.authStore ?? owner.authStore,
		metadataSnapshot: owner.metadataSnapshot,
		authMaterializations,
		pluginRegistry: owner.pluginRegistry,
		isCurrent: owner.isCurrent,
		observationConfig: owner.observationConfig,
		accountCatalog: owner.accountCatalog
	};
}
async function loadPreparedGatewayModelCatalogSnapshot(params) {
	const { candidate, owner } = await loadGatewayModelCatalogOwnerSnapshot(params);
	const refreshedAuth = params?.refreshAuth ? await loadPreparedModelRuntimeAuth(candidate, params.authScope ?? { providerIds: owner.modelCatalog.entries.map((entry) => entry.provider) }) : void 0;
	return projectPreparedGatewayModelCatalogSnapshot(owner, owner.authMaterializations, refreshedAuth);
}
async function loadGatewayModelCatalogSnapshot(params) {
	const { authModes: _authModes, authStore: _authStore, metadataSnapshot: _metadataSnapshot, authMaterializations: _authMaterializations, pluginRegistry: _pluginRegistry, isCurrent: _isCurrent, observationConfig: _observationConfig, accountCatalog: _accountCatalog, ...snapshot } = await loadPreparedGatewayModelCatalogSnapshot(params);
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
		config,
		entries: catalog.entries,
		routeVariants: catalog.routeVariants,
		pluginRegistry: owner.pluginRegistry,
		metadataSnapshot: owner.metadataSnapshot
	});
}
/** Reads the newest completed published catalog without starting provider discovery. */
async function readPreparedGatewayModelCatalog(params) {
	const { getPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	return readPreparedGatewayModelCatalogSync(getPreparedModelCatalogOwnerSnapshot, (params?.getConfig ?? readRuntimeConfig)(), params);
}
async function readPreparedGatewayModelCatalogBatch(agentIds, params) {
	if (agentIds.length === 0) return [];
	const { getPreparedModelCatalogOwnerSnapshot, withPreparedModelRuntimeReadBatch } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	const config = (params?.getConfig ?? readRuntimeConfig)();
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
	const { getPublishedPreparedModelCatalogOwnerSnapshot, getPendingPreparedModelRuntimeReplacement, materializePreparedModelCatalogOwner } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	const replacement = getPendingPreparedModelRuntimeReplacement();
	if (replacement) await replacement;
	const config = (params?.getConfig ?? readRuntimeConfig)();
	const candidate = getPublishedPreparedModelCatalogOwnerSnapshot({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (!candidate) return;
	const published = materializePreparedModelCatalogOwner(candidate);
	return projectPreparedGatewayModelCatalogSnapshot(resolvePublishedModelCatalogOwner(published), getPreparedModelRuntimeAuthMaterializations(published));
}
//#endregion
export { readPreparedGatewayModelCatalogBatch as a, readPreparedGatewayModelCatalog as i, loadGatewayModelCatalogSnapshot as n, readPreparedGatewayModelCatalogOwnerSnapshot as o, loadPreparedGatewayModelCatalogSnapshot as r, loadGatewayModelCatalog as t };
