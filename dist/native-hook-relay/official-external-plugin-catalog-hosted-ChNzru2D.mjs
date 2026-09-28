import { t as formatErrorMessage } from "./errors-Cy4ii9Fo.mjs";
import { P as isRecord, R as normalizeOptionalString } from "./utils-C25eiuh1.mjs";
import { n as readResponseWithLimit, t as cancelUnreadResponseBody } from "./http-body-CFTfWud1.mjs";
import { c as isOfficialExternalPluginCatalogFeed, d as resolveHostedCatalogFeedSource, g as MANIFEST_KEY, h as shouldRequireManifestInstallSourceRef, i as filterOfficialExternalPluginCatalogEntriesBySourceRefs, l as parseOfficialExternalPluginCatalogEntries, n as HostedCatalogSignedFeedMonotonicityError, r as dedupeOfficialExternalPluginCatalogEntries, u as parseOfficialExternalPluginCatalogTimestamp } from "./official-external-plugin-catalog-source-D_PnrId8.mjs";
import { n as listOfficialExternalPluginCatalogEntries } from "./official-external-plugin-catalog-3L_moyvU.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/official-external-plugin-catalog-hosted.ts
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS = 5e3;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES = 1048576;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS = 5e3;
const DSSE_ENVELOPE_MEDIA_TYPE = "application/vnd.dsse+json";
var HostedCatalogFeedTimestampError = class extends Error {
	constructor(message, sequence) {
		super(message);
		this.sequence = sequence;
	}
};
var HostedCatalogSnapshotWriteError = class extends Error {
	constructor(originalError) {
		super("hosted catalog snapshot write failed");
		this.name = "HostedCatalogSnapshotWriteError";
		this.originalError = originalError;
	}
};
function normalizeHostedCatalogHeader(value) {
	return normalizeOptionalString(value) || void 0;
}
function sha256Hex(value) {
	return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
function parseHostedCatalogContentLength(raw, maxBytes) {
	const normalized = normalizeOptionalString(raw);
	if (!normalized) return;
	if (!/^\d+$/.test(normalized)) throw new Error("hosted catalog feed has invalid content-length");
	const size = Number(normalized);
	if (!Number.isSafeInteger(size) || size > maxBytes) throw new Error(`hosted catalog feed exceeds ${maxBytes} bytes`);
}
async function readHostedCatalogResponseText(params) {
	parseHostedCatalogContentLength(params.response.headers.get("content-length"), params.maxBytes);
	if (!params.response.body || typeof params.response.body.getReader !== "function") throw new Error("hosted catalog feed streaming response body unavailable");
	const buffer = await readResponseWithLimit(params.response, params.maxBytes, {
		chunkTimeoutMs: params.chunkTimeoutMs,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`hosted catalog feed exceeds ${maxBytes} bytes`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`hosted catalog feed read timed out after ${chunkTimeoutMs}ms`)
	});
	return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}
function bundledFallbackResult(error, metadata) {
	return {
		source: "bundled-fallback",
		entries: listOfficialExternalPluginCatalogEntries(),
		error: formatErrorMessage(error),
		...metadata ? { metadata } : {}
	};
}
function emptyBundledFallbackResult(error) {
	return {
		source: "bundled-fallback",
		entries: [],
		error: formatErrorMessage(error)
	};
}
async function parseHostedCatalogFeedBody(params) {
	const raw = JSON.parse(params.body);
	if (params.verification?.mode === "signed") {
		const { verifyOfficialExternalPluginCatalogSignedEnvelope } = await import("./official-external-plugin-catalog-envelope-DdKmxLSB.mjs");
		const threshold = params.verification.threshold ?? 1;
		const verification = verifyOfficialExternalPluginCatalogSignedEnvelope(raw, {
			trustedKeys: params.verification.keys,
			threshold,
			...params.allowLegacyBetaEnvelope ? { allowLegacyBetaEnvelope: true } : {}
		});
		if (!verification.ok) {
			const invalidTimestampSequence = verification.error === "invalid-payload" && "authenticatedPayload" in verification ? readOfficialExternalPluginCatalogInvalidTimestampSequence(verification.authenticatedPayload) : void 0;
			if (invalidTimestampSequence !== void 0) throw new HostedCatalogFeedTimestampError(verification.message, invalidTimestampSequence);
			throw new Error(verification.message);
		}
		if (params.expectedFeedId && verification.feed.id !== params.expectedFeedId) throw new Error(`hosted catalog feed id "${verification.feed.id}" did not match expected "${params.expectedFeedId}"`);
		const generatedAtMs = parseOfficialExternalPluginCatalogTimestamp(verification.feed.generatedAt);
		const expiresAt = normalizeOptionalString(verification.feed.expiresAt);
		if (generatedAtMs === void 0) throw new Error("hosted catalog signed feed requires a valid generatedAt value");
		let expired;
		if (!expiresAt) {
			if (params.allowMissingExpiry !== true) throw new Error("hosted catalog signed feed requires a valid expiresAt value");
			expired = true;
		} else {
			const expiresAtMs = parseOfficialExternalPluginCatalogTimestamp(expiresAt);
			if (expiresAtMs === void 0) throw new Error("hosted catalog signed feed requires a valid expiresAt value");
			if (expiresAtMs <= generatedAtMs) throw new Error("hosted catalog signed feed expiresAt must be later than generatedAt");
			expired = expiresAtMs <= params.now.getTime();
		}
		if (expired && params.allowExpired !== true) throw new Error(expiresAt ? `hosted catalog signed feed expired at ${expiresAt}` : "hosted catalog signed feed has no expiresAt");
		return {
			feed: enforceHostedCatalogFeedInstallAuthority(verification.feed),
			trust: {
				mode: "signed",
				signedBy: verification.signedBy,
				signatureCount: verification.signatureCount ?? 1,
				threshold,
				verifiedAt: params.verifiedAt
			},
			...expired ? { expired: true } : {}
		};
	}
	if (!isOfficialExternalPluginCatalogFeed(raw)) throw new Error("hosted catalog feed did not match a supported schema version");
	if (params.expectedFeedId && raw.id !== params.expectedFeedId) throw new Error(`hosted catalog feed id "${raw.id}" did not match expected "${params.expectedFeedId}"`);
	return { feed: enforceHostedCatalogFeedInstallAuthority(raw) };
}
function enforceHostedCatalogFeedInstallAuthority(feed) {
	if (feed.schemaVersion < 2) return feed;
	return {
		...feed,
		entries: feed.entries.map((entry) => {
			const state = normalizeOptionalString(entry.state);
			const publisherTrust = normalizeOptionalString(entry.publisher?.trust);
			return state === "available" && publisherTrust === "official" ? entry : removeOfficialExternalPluginCatalogInstallAuthority(entry);
		})
	};
}
function readOfficialExternalPluginCatalogInvalidTimestampSequence(raw) {
	if (!isRecord(raw)) return;
	if (typeof raw.generatedAt === "string" && parseOfficialExternalPluginCatalogTimestamp(raw.generatedAt) !== void 0) return;
	const normalized = {
		...raw,
		generatedAt: "1970-01-01T00:00:00.000Z"
	};
	return isOfficialExternalPluginCatalogFeed(normalized) ? normalized.sequence : void 0;
}
async function loadHostedCatalogSnapshotResult(params) {
	assertSnapshotMatchesRequestValidators({
		snapshot: params.snapshot,
		ifNoneMatch: params.ifNoneMatch,
		ifModifiedSince: params.ifModifiedSince
	});
	const checksum = sha256Hex(params.snapshot.body);
	if (checksum !== params.snapshot.metadata.checksum) throw new Error("hosted catalog snapshot checksum mismatch");
	if (params.expectedSha256 && params.expectedSha256 !== checksum) throw new Error("hosted catalog snapshot checksum did not match expected checksum");
	const parsed = await parseHostedCatalogFeedBody({
		body: params.snapshot.body,
		expectedFeedId: params.expectedFeedId,
		verification: params.verification,
		verifiedAt: params.snapshot.trust?.verifiedAt ?? params.snapshot.savedAt,
		allowLegacyBetaEnvelope: true,
		now: params.now,
		allowExpired: true,
		allowMissingExpiry: true
	});
	const entries = dedupeOfficialExternalPluginCatalogEntries(filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(parsed.feed), {
		catalogConfig: params.catalogConfig,
		requireManifestInstallSourceRef: params.requireManifestInstallSourceRef
	}));
	const visibleEntries = parsed.expired ? entries.map((entry) => removeOfficialExternalPluginCatalogInstallAuthority(entry)) : entries;
	return {
		source: "hosted-snapshot",
		entries: visibleEntries,
		feed: parsed.expired ? {
			...parsed.feed,
			entries: visibleEntries
		} : parsed.feed,
		metadata: params.snapshot.metadata,
		snapshot: params.snapshot,
		...parsed.trust ? { trust: parsed.trust } : {},
		error: parsed.expired ? `${formatErrorMessage(params.error)}; ${parsed.feed.expiresAt ? `hosted catalog signed feed expired at ${parsed.feed.expiresAt}` : "hosted catalog signed feed has no expiresAt"}` : formatErrorMessage(params.error)
	};
}
function removeOfficialExternalPluginCatalogInstallAuthority(entry) {
	const { install: _feedInstall, [MANIFEST_KEY]: manifest, ...metadata } = entry;
	if (!manifest) return {
		...metadata,
		state: "unavailable"
	};
	const { install: _manifestInstall, ...manifestMetadata } = manifest;
	return {
		...metadata,
		state: "unavailable",
		[MANIFEST_KEY]: manifestMetadata
	};
}
function isHostedCatalogSignedFeedRollback(params) {
	if (params.candidate.sequence < params.current.sequence) return true;
	if (params.candidate.sequence > params.current.sequence) return false;
	if (params.current.generatedAt === void 0) return false;
	return Date.parse(params.candidate.generatedAt) < Date.parse(params.current.generatedAt);
}
function assertSnapshotMatchesRequestValidators(params) {
	if (params.ifNoneMatch && params.snapshot.metadata.etag !== params.ifNoneMatch) throw new Error("hosted catalog snapshot ETag did not match request validator");
	if (!params.ifNoneMatch && params.ifModifiedSince && params.snapshot.metadata.lastModified !== params.ifModifiedSince) throw new Error("hosted catalog snapshot Last-Modified did not match request validator");
}
async function snapshotOrBundledFallbackResult(params) {
	if (params.snapshotStore) try {
		const snapshot = await params.snapshotStore.read(params.url);
		if (snapshot) return await loadHostedCatalogSnapshotResult({
			snapshot,
			error: params.error,
			expectedSha256: params.expectedSha256,
			ifNoneMatch: params.ifNoneMatch,
			ifModifiedSince: params.ifModifiedSince,
			catalogConfig: params.catalogConfig,
			requireManifestInstallSourceRef: params.requireManifestInstallSourceRef,
			expectedFeedId: params.expectedFeedId,
			verification: params.verification,
			now: params.now
		});
	} catch (snapshotErr) {
		if (params.verification?.mode === "signed") return emptyBundledFallbackResult(`${formatErrorMessage(params.error)}; snapshot fallback failed: ${formatErrorMessage(snapshotErr)}`);
		return bundledFallbackResult(`${formatErrorMessage(params.error)}; snapshot fallback failed: ${formatErrorMessage(snapshotErr)}`, params.metadata);
	}
	if (params.verification?.mode === "signed") return emptyBundledFallbackResult(params.error);
	return bundledFallbackResult(params.error, params.metadata);
}
async function resolveHostedCatalogSnapshotStore(params) {
	if (params.snapshotStore !== void 0) return params.snapshotStore ?? void 0;
	const { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore } = await import("./official-external-plugin-catalog-snapshot-store-B1IjzJpR.mjs");
	return createSqliteHostedOfficialExternalPluginCatalogSnapshotStore({
		...params.env ? { env: params.env } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.stateDatabasePath ? { stateDatabasePath: params.stateDatabasePath } : {}
	});
}
async function loadHostedOfficialExternalPluginCatalogEntries(params) {
	let source;
	try {
		source = resolveHostedCatalogFeedSource({
			feedUrl: params?.feedUrl,
			feedProfile: params?.feedProfile,
			catalogConfig: params?.catalogConfig
		});
	} catch (err) {
		return bundledFallbackResult(err);
	}
	const { url } = source;
	const snapshotStore = await resolveHostedCatalogSnapshotStore({
		snapshotStore: params?.snapshotStore,
		env: params?.env,
		stateDir: params?.stateDir,
		stateDatabasePath: params?.stateDatabasePath
	});
	const expectedSha256 = normalizeOptionalString(params?.expectedSha256);
	const currentTime = () => params?.now?.() ?? /* @__PURE__ */ new Date();
	const requireManifestInstallSourceRef = shouldRequireManifestInstallSourceRef({
		feedUrl: params?.feedUrl,
		feedProfile: params?.feedProfile,
		catalogConfig: params?.catalogConfig
	});
	if (params?.offline === true) return await snapshotOrBundledFallbackResult({
		error: "hosted catalog feed offline mode",
		snapshotStore,
		url: url.href,
		expectedSha256,
		catalogConfig: params?.catalogConfig,
		requireManifestInstallSourceRef,
		expectedFeedId: source.expectedFeedId,
		verification: source.verification,
		now: currentTime()
	});
	const headers = new Headers();
	const ifNoneMatch = normalizeOptionalString(params?.ifNoneMatch);
	const signedOperation = source.verification?.mode === "signed";
	const ifModifiedSince = signedOperation ? void 0 : normalizeOptionalString(params?.ifModifiedSince);
	if (ifNoneMatch) headers.set("if-none-match", ifNoneMatch);
	if (ifModifiedSince) headers.set("if-modified-since", ifModifiedSince);
	if (signedOperation) headers.set("accept", DSSE_ENVELOPE_MEDIA_TYPE);
	const metadataBase = (response) => {
		const etag = normalizeHostedCatalogHeader(response.headers.get("etag"));
		const lastModified = normalizeHostedCatalogHeader(response.headers.get("last-modified"));
		return {
			url: url.href,
			status: response.status,
			...etag ? { etag } : {},
			...lastModified ? { lastModified } : {}
		};
	};
	let response;
	let release;
	try {
		const { fetchWithSsrFGuard } = await import("./fetch-guard-lGO-I9kF.mjs");
		const guarded = await fetchWithSsrFGuard({
			url: url.href,
			fetchImpl: params?.fetchImpl,
			init: {
				method: "GET",
				headers
			},
			requireHttps: true,
			maxRedirects: 2,
			timeoutMs: params?.timeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS,
			policy: { hostnameAllowlist: source.hostnameAllowlist },
			auditContext: "official-external-plugin-catalog-feed"
		});
		response = guarded.response;
		release = guarded.release;
		const base = metadataBase(response);
		if (response.status === 304) return await snapshotOrBundledFallbackResult({
			error: "hosted catalog feed returned HTTP 304",
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		if (!response.ok) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed returned HTTP ${response.status}`,
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		if (signedOperation && response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== DSSE_ENVELOPE_MEDIA_TYPE) return await snapshotOrBundledFallbackResult({
			error: `signed hosted catalog feed must use ${DSSE_ENVELOPE_MEDIA_TYPE}`,
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		const body = await readHostedCatalogResponseText({
			response,
			maxBytes: params?.maxBytes ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES,
			chunkTimeoutMs: params?.chunkTimeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS
		});
		const checksum = sha256Hex(body);
		const metadata = {
			...base,
			checksum
		};
		if (expectedSha256 && expectedSha256 !== checksum) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed checksum mismatch: expected ${expectedSha256}`,
			snapshotStore,
			url: url.href,
			metadata,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
		const now = currentTime();
		const verifiedAt = now.toISOString();
		const parsed = await parseHostedCatalogFeedBody({
			body,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			verifiedAt,
			now
		}).catch(async (err) => {
			return await snapshotOrBundledFallbackResult({
				error: err,
				snapshotStore,
				url: url.href,
				metadata,
				expectedSha256,
				ifNoneMatch,
				ifModifiedSince,
				catalogConfig: params?.catalogConfig,
				requireManifestInstallSourceRef,
				expectedFeedId: source.expectedFeedId,
				verification: source.verification,
				now
			});
		});
		if ("source" in parsed) return parsed;
		if (snapshotStore && parsed.trust?.mode === "signed") {
			const currentSnapshot = await snapshotStore.read(url.href);
			if (currentSnapshot?.trust?.mode === "signed") {
				const current = currentSnapshot.monotonic?.mode === "signed-feed" ? currentSnapshot.monotonic : (await parseHostedCatalogFeedBody({
					body: currentSnapshot.body,
					expectedFeedId: source.expectedFeedId,
					verification: source.verification,
					verifiedAt: currentSnapshot.trust.verifiedAt,
					allowLegacyBetaEnvelope: true,
					now,
					allowExpired: true,
					allowMissingExpiry: true
				}).catch((err) => {
					if (err instanceof HostedCatalogFeedTimestampError) return { feed: { sequence: err.sequence } };
					throw err;
				})).feed;
				if (isHostedCatalogSignedFeedRollback({
					candidate: parsed.feed,
					current
				})) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed sequence is older than current snapshot");
			}
		}
		const entries = filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(parsed.feed), {
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		await snapshotStore?.write({
			body,
			metadata,
			savedAt: verifiedAt,
			...parsed.trust ? { trust: parsed.trust } : {},
			...parsed.trust?.mode === "signed" ? { monotonic: {
				mode: "signed-feed",
				sequence: parsed.feed.sequence,
				generatedAt: parsed.feed.generatedAt
			} } : {}
		}).catch((err) => {
			if (err instanceof HostedCatalogSignedFeedMonotonicityError) throw err;
			if (params?.requireSnapshotWrite) throw new HostedCatalogSnapshotWriteError(err);
		});
		return {
			source: "hosted",
			entries: dedupeOfficialExternalPluginCatalogEntries(entries),
			feed: parsed.feed,
			metadata,
			...parsed.trust ? { trust: parsed.trust } : {}
		};
	} catch (err) {
		if (err instanceof HostedCatalogSnapshotWriteError) throw err.originalError;
		return await snapshotOrBundledFallbackResult({
			error: err,
			snapshotStore,
			url: url.href,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef,
			expectedFeedId: source.expectedFeedId,
			verification: source.verification,
			now: currentTime()
		});
	} finally {
		await cancelUnreadResponseBody(response);
		await release?.().catch(() => void 0);
	}
}
//#endregion
export { loadHostedOfficialExternalPluginCatalogEntries };
