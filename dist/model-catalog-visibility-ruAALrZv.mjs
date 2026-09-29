import { n as dedupeByKey } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { o as dedupeModelCatalogEntries } from "./model-selection-shared-0uvJbX1M.mjs";
import { d as resolveModelCatalogIdentityKey, s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { n as compareModelCatalogEntries } from "./model-catalog-order-BsIDMmfd.mjs";
import { t as createModelCatalogView } from "./model-catalog-view-Be2xmOuQ.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-Doz1rFpm.mjs";
//#region src/agents/model-catalog-visibility.ts
/** Maps one shared auth evaluation into logical catalog selection state. */
function resolveLogicalModelCatalogEntryState(params) {
	const routeManaged = params.evaluation.routeResolution !== null;
	const selectedRoute = params.evaluation.selectedRoute;
	const routeProjection = !routeManaged ? { kind: "unmanaged" } : selectedRoute ? {
		kind: "selected",
		route: selectedRoute,
		policy: params.routePolicy
	} : {
		kind: "unresolved",
		policy: params.routePolicy
	};
	return {
		authBacked: params.authBacked ?? params.evaluation.availability === true,
		compatible: params.evaluation.routeResolution?.kind !== "incompatible",
		routeManaged,
		routeProjection,
		...params.evaluation.runtimeAuth ? { nativeRuntime: params.evaluation.runtimeAuth.id } : {}
	};
}
function sortModelCatalogEntries(entries) {
	return entries.toSorted(compareModelCatalogEntries);
}
/** Resolves logical rows while keeping provider-owned physical route precedence. */
async function resolveLogicalVisibleModelCatalog(params) {
	return (await prepareLogicalVisibleModelCatalog({
		...params,
		prepareEntry: async (entry, variants) => {
			const state = await params.evaluateEntry(entry, variants);
			return () => state;
		}
	}))();
}
/** Prepare host facts once; observe revocable state only in the synchronous publication. */
async function prepareLogicalVisibleModelCatalog(params) {
	const policy = params.policy ?? createModelVisibilityPolicy({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		agentId: params.agentId,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	});
	const keyOf = createModelCatalogIdentityKeyResolver();
	const catalogView = createModelCatalogView({
		cfg: params.cfg,
		catalog: params.catalog,
		routeVariants: params.routeVariants?.length ? params.routeVariants : params.catalog,
		routePolicy: params.routePolicy,
		keyOf
	});
	const { configuredKeys, retainedKeys } = policy;
	const retainedKey = params.retainedModel ? keyOf({
		provider: params.retainedModel.provider,
		id: params.retainedModel.model
	}) : void 0;
	const retained = params.catalog.filter((entry) => retainedKeys.has(keyOf(entry)) || keyOf(entry) === retainedKey);
	const wildcard = policy.allowAny || policy.hasProviderWildcards;
	const configuredCatalog = wildcard ? sortModelCatalogEntries([...policy.configuredCatalog]) : [];
	const candidates = params.view === "all" ? params.catalog : [
		...wildcard ? params.catalog : [],
		...configuredCatalog,
		...policy.allowedCatalog,
		...retained
	];
	const readers = /* @__PURE__ */ new Map();
	for (const entry of candidates) {
		const key = resolveModelCatalogIdentityKey(entry);
		if (!readers.has(key)) {
			const variants = catalogView.variantsOf(entry, key) ?? [entry];
			readers.set(key, await params.prepareEntry(variants[0] ?? entry, variants));
		}
	}
	const { buildManifestBuiltInModelSuppressionResolver } = await import("./manifest-model-suppression-zR6udvVk.mjs");
	const suppression = buildManifestBuiltInModelSuppressionResolver({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot
	});
	const catalogKeys = new Set(params.catalog.map(createModelCatalogIdentityKeyResolver()));
	return () => {
		const states = new Map([...readers].map(([key, read]) => [key, read()]));
		const publicationKeyOf = createModelCatalogIdentityKeyResolver();
		const getEntryState = (entry) => {
			const state = states.get(publicationKeyOf(entry));
			if (!state) throw new Error("Model catalog publication omitted prepared entry state");
			return state;
		};
		const projectEntries = (entries) => {
			const projected = entries.flatMap((entry) => {
				const state = getEntryState(entry);
				const row = catalogView.readProjection(entry, state.routeProjection, publicationKeyOf(entry)).entry;
				if (!state.nativeRuntime && suppression({
					provider: row.provider,
					id: row.id,
					api: row.api,
					baseUrl: row.baseUrl
				})?.retirement) return [];
				return [row];
			});
			return sortModelCatalogEntries(dedupeByKey(projected, publicationKeyOf));
		};
		if (params.view === "all") return projectEntries(params.catalog);
		const defaultVisibleCatalog = wildcard ? sortModelCatalogEntries(dedupeModelCatalogEntries([...configuredCatalog, ...params.catalog.filter((entry) => getEntryState(entry).authBacked)])) : [];
		const visible = sortModelCatalogEntries(dedupeModelCatalogEntries(policy.visibleCatalog({
			catalog: params.catalog,
			defaultVisibleCatalog,
			view: params.view
		}))).filter((entry) => catalogKeys.has(publicationKeyOf(entry)) || configuredKeys.has(publicationKeyOf(entry)));
		const preferredKeys = new Set([...visible, ...retained].map(publicationKeyOf));
		const preferred = [];
		const routeBacked = /* @__PURE__ */ new Set();
		for (const entry of params.catalog) {
			const key = publicationKeyOf(entry);
			const preferredKey = preferredKeys.has(key);
			const wildcardRoute = policy.allowAny || policy.hasProviderWildcards && policy.allowsByWildcard({
				provider: entry.provider,
				model: entry.id
			});
			if (!preferredKey && !wildcardRoute) continue;
			const state = getEntryState(entry);
			if (!state.compatible && !configuredKeys.has(key)) continue;
			if (preferredKey && state.routeProjection.kind === "selected" && params.routePolicy.matchesRoute(entry, state.routeProjection.route)) preferred.push(entry);
			if (wildcardRoute && state.routeManaged && state.authBacked) routeBacked.add(entry);
		}
		const kept = visible.filter((entry) => {
			const state = getEntryState(entry);
			const configured = configuredKeys.has(publicationKeyOf(entry));
			return (state.compatible || configured) && (!state.routeManaged || configured || routeBacked.has(entry));
		});
		return projectEntries([
			...preferred,
			...kept,
			...retained,
			...routeBacked
		]).filter((entry) => (params.view === "configured" || policy.allows({
			provider: entry.provider,
			model: entry.id
		})) && (publicationKeyOf(entry) === retainedKey || entry.status !== "deprecated" && entry.status !== "disabled" || configuredKeys.has(publicationKeyOf(entry))));
	};
}
//#endregion
export { resolveLogicalModelCatalogEntryState as n, resolveLogicalVisibleModelCatalog as r, prepareLogicalVisibleModelCatalog as t };
