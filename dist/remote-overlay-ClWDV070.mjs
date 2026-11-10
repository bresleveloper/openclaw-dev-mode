import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as projectRemoteModelCatalog, i as parseRemoteModelCatalogWireBundle, n as isRemoteModelCatalogRefreshEnabled, o as bundledCatalogGeneratedAt, t as isRemoteCatalogSourceActive } from "./remote-config-BB5GMHUd.mjs";
import { a as readRemoteModelCatalogAsync } from "./remote-store-OXFSlW2v.mjs";
import { createHash } from "node:crypto";
import { getEnvironmentData, setEnvironmentData } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/model-catalog/remote-overlay.ts
const STARTUP_SNAPSHOT_KEY = "openclaw.remoteModelCatalogStartupSnapshot";
const remoteCatalogScope = resolveGlobalSingleton(Symbol.for("openclaw.remoteModelCatalogScope"), () => new AsyncLocalStorage());
function isCompatible(bundle) {
	if (!bundle.minVersion) return true;
	const comparison = compareOpenClawVersions(VERSION, bundle.minVersion);
	return comparison !== null && comparison >= 0;
}
function selectCompatibleRemoteModelCatalog(stored, bundledGeneratedAt) {
	if (!stored) return null;
	const bundle = parseRemoteModelCatalogWireBundle(JSON.parse(stored.bundle_json));
	if (!isCompatible(bundle)) return null;
	const recommendations = Object.fromEntries(Object.entries(bundle.providers).map(([provider, catalog]) => [provider, catalog.recommendedModels ?? []]));
	const overlay = bundle.generatedAt > bundledGeneratedAt ? projectRemoteModelCatalog(bundle) : {
		providers: {},
		pricing: {},
		upstreamPricing: {}
	};
	return freezeJsonSnapshot({
		sourceUrl: stored.source_url,
		generatedAt: bundle.generatedAt,
		revision: createHash("sha256").update(stored.bundle_json).digest("hex"),
		recommendations,
		...overlay
	});
}
function inheritedRemoteModelCatalogStartupSnapshot() {
	return getEnvironmentData(STARTUP_SNAPSHOT_KEY);
}
function publishRemoteModelCatalogStartupSnapshot(snapshot) {
	const inherited = inheritedRemoteModelCatalogStartupSnapshot();
	if (inherited !== void 0) return inherited.catalog;
	setEnvironmentData(STARTUP_SNAPSHOT_KEY, { catalog: snapshot });
	return snapshot;
}
/** Read the already-published startup pair without loading persistent state. */
function captureRemoteModelCatalogStartupSnapshot() {
	return inheritedRemoteModelCatalogStartupSnapshot()?.catalog ?? null;
}
/** Prepare the same first-winner startup pair without host-thread SQLite reads. */
async function prepareRemoteModelCatalogStartupSnapshot(options = {}) {
	const inherited = inheritedRemoteModelCatalogStartupSnapshot();
	if (inherited !== void 0) return inherited.catalog;
	let bundledGeneratedAt;
	try {
		bundledGeneratedAt = bundledCatalogGeneratedAt();
	} catch {
		return publishRemoteModelCatalogStartupSnapshot(null);
	}
	if (bundledGeneratedAt === void 0) return publishRemoteModelCatalogStartupSnapshot(null);
	const context = captureOpenClawStateWorkerContext(options);
	let snapshot;
	try {
		snapshot = selectCompatibleRemoteModelCatalog(await readRemoteModelCatalogAsync(context), bundledGeneratedAt);
	} catch {
		snapshot = null;
	}
	context.admission.assertCurrent();
	return publishRemoteModelCatalogStartupSnapshot(snapshot);
}
/** Capture the accepted pair, including absence, for a build, worker task, or run. */
function captureRemoteModelCatalogSnapshot() {
	const scoped = remoteCatalogScope.getStore();
	return scoped === void 0 ? captureRemoteModelCatalogStartupSnapshot() : scoped.catalog;
}
function withRemoteModelCatalogSnapshot(catalog, run) {
	return remoteCatalogScope.run({ catalog }, run);
}
/** Detached admissions select the current pair, not their caller's retained pair. */
function runOutsideRemoteModelCatalogSnapshot(run) {
	return remoteCatalogScope.exit(run);
}
/** Preparation does not change the pair visible to current readers. */
async function readRemoteModelCatalogUpdate(config) {
	if (!isRemoteModelCatalogRefreshEnabled(config)) return;
	const bundledGeneratedAt = bundledCatalogGeneratedAt();
	if (bundledGeneratedAt === void 0) return;
	const context = captureOpenClawStateWorkerContext();
	const snapshot = selectCompatibleRemoteModelCatalog(await readRemoteModelCatalogAsync(context), bundledGeneratedAt);
	context.admission.assertCurrent();
	return snapshot && snapshot.generatedAt > bundledGeneratedAt && isRemoteCatalogSourceActive(config, snapshot.sourceUrl) ? snapshot : void 0;
}
/** The prepared catalog owner commits this pair in the same turn as its rows. */
function publishRemoteModelCatalogSnapshot(catalog, previous) {
	if (captureRemoteModelCatalogStartupSnapshot() !== previous) return false;
	setEnvironmentData(STARTUP_SNAPSHOT_KEY, { catalog });
	return true;
}
function getActiveRemoteModelCatalog(config) {
	if (!isRemoteModelCatalogRefreshEnabled(config)) return;
	const scoped = remoteCatalogScope.getStore();
	const snapshot = scoped !== void 0 ? scoped.catalog : captureRemoteModelCatalogStartupSnapshot();
	return snapshot && isRemoteCatalogSourceActive(config, snapshot.sourceUrl) ? snapshot : void 0;
}
function getRemoteModelCatalogProviderOverlay(config, provider) {
	const providerId = normalizeProviderId(provider);
	return providerId ? getActiveRemoteModelCatalog(config)?.providers[providerId] : void 0;
}
function getRemoteModelCatalogProviderRecommendations(config, provider) {
	const providerId = normalizeProviderId(provider);
	return providerId ? getActiveRemoteModelCatalog(config)?.recommendations[providerId] : void 0;
}
//#endregion
export { getRemoteModelCatalogProviderRecommendations as a, readRemoteModelCatalogUpdate as c, getRemoteModelCatalogProviderOverlay as i, runOutsideRemoteModelCatalogSnapshot as l, captureRemoteModelCatalogStartupSnapshot as n, prepareRemoteModelCatalogStartupSnapshot as o, getActiveRemoteModelCatalog as r, publishRemoteModelCatalogSnapshot as s, captureRemoteModelCatalogSnapshot as t, withRemoteModelCatalogSnapshot as u };
