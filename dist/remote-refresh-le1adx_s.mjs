import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { c as bundledCatalogGeneratedAt, l as parseRemoteModelCatalogBundle, o as isRemoteModelCatalogRefreshEnabled, s as resolveRemoteCatalogUrl, u as validateAndSanitizeRemoteModelCatalogBundle } from "./model-catalog-BFaZ221R.mjs";
import { i as writeRemoteModelCatalog, n as readRemoteModelCatalog, t as markRemoteModelCatalogChecked } from "./remote-store-DaFxwDuJ.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { i as fetchWithSsrFGuard, r as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
//#region src/model-catalog/remote-refresh.ts
const REMOTE_MODEL_CATALOG_TTL_MS = 216e5;
const REMOTE_MODEL_CATALOG_TIMEOUT_MS = 15e3;
const REMOTE_MODEL_CATALOG_MAX_BYTES = 4194304;
function bundleCounts(bundle) {
	const providers = Object.values(bundle.providers);
	return {
		providers: providers.length,
		models: providers.reduce((total, provider) => total + provider.models.length, 0)
	};
}
function storedCounts(bundleJson) {
	const bundle = parseRemoteModelCatalogBundle(JSON.parse(bundleJson));
	return {
		...bundleCounts(bundle),
		generatedAt: bundle.generatedAt
	};
}
function assertCompatibleMinVersion(bundle) {
	if (!bundle.minVersion) return;
	const comparison = compareOpenClawVersions(VERSION, bundle.minVersion);
	if (comparison === null) throw new Error(`invalid remote catalog minVersion: ${bundle.minVersion}`);
	if (comparison < 0) throw new Error(`remote catalog requires OpenClaw ${bundle.minVersion} or newer (current ${VERSION})`);
}
function isExplicitLocalHttpUrl(config, url) {
	if (!config.models?.catalogRefresh?.url) return false;
	const parsed = new URL(url);
	return parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]");
}
async function refreshRemoteModelCatalog(params) {
	if (!isRemoteModelCatalogRefreshEnabled(params.config)) return {
		status: "disabled",
		providers: 0,
		models: 0
	};
	const databaseOptions = params.databaseOptions ?? {};
	const now = (params.now ?? Date.now)();
	try {
		const url = resolveRemoteCatalogUrl(params.config);
		const stored = readRemoteModelCatalog(databaseOptions);
		const activeStored = stored?.source_url === url ? stored : void 0;
		if (!params.force && activeStored && now - activeStored.checked_at < 216e5) return {
			status: "fresh",
			nextCheckInMs: Math.max(0, REMOTE_MODEL_CATALOG_TTL_MS - (now - activeStored.checked_at)),
			...storedCounts(activeStored.bundle_json)
		};
		const headers = new Headers({ Accept: "application/json" });
		if (activeStored?.etag) headers.set("If-None-Match", activeStored.etag);
		if (activeStored?.last_modified) headers.set("If-Modified-Since", activeStored.last_modified);
		const fetchParams = {
			url,
			init: { headers },
			timeoutMs: REMOTE_MODEL_CATALOG_TIMEOUT_MS,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			auditContext: "remote-model-catalog"
		};
		const explicitOverride = Boolean(params.config.models?.catalogRefresh?.url);
		const localHttp = isExplicitLocalHttpUrl(params.config, url);
		let guarded;
		if (explicitOverride) {
			const configuredOrigin = new URL(url).origin;
			guarded = await fetchConfiguredLocalOriginWithSsrFGuard({
				...fetchParams,
				configuredLocalOriginBaseUrl: configuredOrigin,
				policy: { allowedOrigins: [configuredOrigin] },
				requireHttps: !localHttp
			});
		} else guarded = await fetchWithSsrFGuard({
			...fetchParams,
			requireHttps: true
		});
		try {
			if (guarded.response.status === 304) {
				if (!activeStored) throw new Error("remote catalog returned 304 without a stored bundle");
				return {
					status: "unchanged",
					...storedCounts((markRemoteModelCatalogChecked(now, {
						expected: activeStored,
						etag: guarded.response.headers.get("etag") ?? activeStored.etag,
						lastModified: guarded.response.headers.get("last-modified") ?? activeStored.last_modified
					}, databaseOptions) ? activeStored : readRemoteModelCatalog(databaseOptions))?.bundle_json ?? activeStored.bundle_json)
				};
			}
			if (!guarded.response.ok) throw new Error(`remote catalog request failed: HTTP ${guarded.response.status}`);
			const body = await readResponseWithLimit(guarded.response, REMOTE_MODEL_CATALOG_MAX_BYTES, { chunkTimeoutMs: REMOTE_MODEL_CATALOG_TIMEOUT_MS });
			const bundle = validateAndSanitizeRemoteModelCatalogBundle(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)));
			assertCompatibleMinVersion(bundle);
			const bundleJson = JSON.stringify(bundle);
			const unchanged = activeStored?.bundle_json === bundleJson;
			const writeResult = writeRemoteModelCatalog({
				bundle_json: bundleJson,
				generated_at: bundle.generatedAt,
				min_version: bundle.minVersion ?? null,
				source_url: url,
				etag: guarded.response.headers.get("etag"),
				last_modified: guarded.response.headers.get("last-modified"),
				checked_at: now
			}, databaseOptions);
			if (writeResult.status === "retained-newer") return {
				status: "unchanged",
				...storedCounts(writeResult.row.bundle_json)
			};
			const bundledGeneratedAt = (params.bundledGeneratedAt ?? bundledCatalogGeneratedAt)();
			return {
				status: unchanged || bundledGeneratedAt === void 0 || bundle.generatedAt <= bundledGeneratedAt ? "unchanged" : "updated",
				generatedAt: bundle.generatedAt,
				...bundleCounts(bundle)
			};
		} finally {
			await guarded.release();
		}
	} catch (error) {
		return {
			status: "error",
			error: String(error),
			providers: 0,
			models: 0
		};
	}
}
//#endregion
export { refreshRemoteModelCatalog as n, REMOTE_MODEL_CATALOG_TTL_MS as t };
