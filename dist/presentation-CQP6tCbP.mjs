import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, r as lowercasePreservingWhitespace } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, R as timestampMsToIsoString, j as resolveIntegerOption, y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as asNullableRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as normalizeSingleOrTrimmedStringList, d as normalizeStringEntries, n as filterStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as pathExists, n as appendRegularFile, t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { g as resolveSessionAgentIdStrict } from "./agent-scope-DXrnO3F4.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { s as readFiniteNumberParam } from "./common-BofcG96e.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { n as runExec } from "./exec-Bf6uhUA7.mjs";
import { a as getMemoryCapabilityRegistration, u as listActiveMemoryPublicArtifacts } from "./memory-state-CrbG6eAa.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { t as retryTransientMemoryRead } from "./openclaw-runtime-io-Vhn7I2o9.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./file-access-runtime-DZTMkCCU.mjs";
import { r as replaceFileAtomic } from "./security-runtime-6domDoE8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./retry-runtime-CUY_Gz8_.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./routing-Dl7FngGa.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
import "./memory-host-core-DPUr2gMF.mjs";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-DwzbxsY_.mjs";
import { a as isActiveMemoryProviderNative, i as getActiveMemorySearchManager, r as getActiveMemoryProvider } from "./memory-host-search-o4F9E8j9.mjs";
import "./param-readers-gVcVc5Er.mjs";
import { t as filterMemorySearchHitsBySessionVisibility } from "./session-search-visibility-Du0ZabkD.mjs";
import "./session-search-visibility-api-BOeH8lfq.mjs";
import { A as slugifyWikiPageStem, C as isUnmanagedRawSourceSummary, D as renderMarkdownFence, E as preserveHumanNotesBlock, M as toWikiPageSummary, N as WIKI_RELATED_END_MARKER, O as renderWikiMarkdown, P as WIKI_RELATED_START_MARKER, S as formatWikiLink, T as parseWikiMarkdown, _ as WIKI_PAGE_GROUPS, b as decodeWikiPageUtf8, d as setImportedSourceEntry, f as writeMemoryWikiSourceSyncState, g as HUMAN_START_MARKER, h as HUMAN_END_MARKER, j as slugifyWikiSegment, k as scanWikiPageSummary, l as pruneImportedSourceEntries, m as walkMemoryWikiDirectory, o as assertMemoryWikiSourceSyncStateCapacity, p as listMemoryWikiPagePaths, u as readMemoryWikiSourceSyncState, v as WIKI_RAW_SOURCE_MARKER, w as normalizeWikiClaims, y as createWikiPageFilename } from "./import-runs-state-SYz8z6TJ.mjs";
import { constants } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { setImmediate } from "node:timers/promises";
import { gunzipSync, gzipSync } from "node:zlib";
import { StringDecoder } from "node:string_decoder";
//#region extensions/memory-wiki/src/compiled-cache.ts
const COMPILED_CACHE_NAMESPACE = "compiled-cache";
const COMPILED_CACHE_MAX_ENTRIES = 256;
const COMPILED_CACHE_MAX_BYTES_PER_ENTRY = 104857600;
const COMPILED_CACHE_MAX_BYTES = 536870912;
const COMPILED_CACHE_VERSION = 3;
const MEMORY_WIKI_DASHBOARD_ITEM_LIMIT = 2500;
const DASHBOARD_UNAVAILABLE_MESSAGES = {
	rebuilding: "Memory Wiki dashboards are rebuilding. Retry shortly.",
	"compile-required": "Memory Wiki dashboards need a compiled snapshot. Run \"openclaw wiki compile\", then reload.",
	failed: "Memory Wiki dashboard rebuild failed. Run \"openclaw wiki compile\", then reload."
};
var MemoryWikiDashboardUnavailableError = class extends Error {
	constructor(state, message) {
		super(message);
		this.state = state;
		this.name = "MemoryWikiDashboardUnavailableError";
	}
};
let configuredStore;
const activeVaults = /* @__PURE__ */ new Map();
const dashboardStates = /* @__PURE__ */ new Map();
function resolveMemoryWikiCompiledCacheOwnerId(config) {
	if (config.vault.scope === "global") return "global";
	const agentId = config.agentId?.trim();
	if (!agentId) throw new Error("Memory Wiki agent-scoped compiled cache requires an agent owner.");
	return `agent:${agentId}`;
}
function ownerKeyPrefix(ownerId) {
	return `owner:${createHash("sha256").update(ownerId).digest("hex")}:publication:`;
}
function publicationKey(ownerId, publicationId) {
	return `${ownerKeyPrefix(ownerId)}${createHash("sha256").update(publicationId).digest("hex")}`;
}
function dashboardStateKey(config) {
	return `${resolveMemoryWikiCompiledCacheOwnerId(config)}\0${path.resolve(config.vault.path)}`;
}
function isMetadata(value) {
	return value?.version === COMPILED_CACHE_VERSION && typeof value.ownerId === "string" && typeof value.vaultPath === "string" && typeof value.vaultGeneration === "string" && typeof value.publicationId === "string" && typeof value.generation === "string" && value.encoding === "gzip-json";
}
function activateMemoryWikiCompiledCacheOwner(config, vaultGeneration, compiledCachePublicationId) {
	const normalizedVaultGeneration = vaultGeneration.trim();
	if (!normalizedVaultGeneration) throw new Error("Memory Wiki vault generation must not be empty.");
	const ownerId = resolveMemoryWikiCompiledCacheOwnerId(config);
	const vaultPath = path.resolve(config.vault.path);
	const publicationId = compiledCachePublicationId?.trim() || void 0;
	const active = activeVaults.get(ownerId);
	if (active?.reconciled && active.path === vaultPath && active.vaultGeneration === normalizedVaultGeneration && active.compiledCachePublicationId === publicationId) return false;
	activeVaults.set(ownerId, {
		path: vaultPath,
		vaultGeneration: normalizedVaultGeneration,
		compiledCachePublicationId: publicationId,
		reconciled: false
	});
	return true;
}
function deactivateMemoryWikiCompiledCacheOwnersExcept(ownerIds) {
	for (const ownerId of activeVaults.keys()) if (!ownerIds.has(ownerId)) activeVaults.delete(ownerId);
	for (const [key, entry] of dashboardStates) if (!ownerIds.has(entry.ownerId)) dashboardStates.delete(key);
}
function setMemoryWikiDashboardState(config, state) {
	dashboardStates.set(dashboardStateKey(config), {
		ownerId: resolveMemoryWikiCompiledCacheOwnerId(config),
		state
	});
}
function resolveActiveVault(config) {
	const active = activeVaults.get(resolveMemoryWikiCompiledCacheOwnerId(config));
	if (!active || active.path !== path.resolve(config.vault.path)) return null;
	return active;
}
function isMemoryWikiCompiledCacheOwnerActive(config, vaultGeneration) {
	const active = resolveActiveVault(config);
	return active?.reconciled === true && active.vaultGeneration === vaultGeneration;
}
function parseSnapshot(bytes, generation) {
	try {
		const serialized = gunzipSync(bytes).toString("utf8");
		if (createHash("sha256").update(serialized).digest("hex") !== generation) return null;
		const parsed = JSON.parse(serialized);
		if (!parsed || typeof parsed !== "object" || !parsed.digest || typeof parsed.digest !== "object" || !Array.isArray(parsed.digest.pages) || !Array.isArray(parsed.claims) || !parsed.dashboards || typeof parsed.dashboards !== "object" || !parsed.dashboards.importInsights || typeof parsed.dashboards.importInsights !== "object" || typeof parsed.dashboards.importInsights.truncated !== "boolean" || !Array.isArray(parsed.dashboards.importInsights.clusters) || !parsed.dashboards.overview || typeof parsed.dashboards.overview !== "object" || typeof parsed.dashboards.overview.truncated !== "boolean" || !Array.isArray(parsed.dashboards.overview.clusters)) return null;
		return parsed;
	} catch {
		return null;
	}
}
function resolveMemoryWikiCompiledCacheGeneration(snapshot) {
	return createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
}
function createMemoryWikiCompiledCacheStore(openBlobStore, options = {}) {
	const store = openBlobStore({
		namespace: COMPILED_CACHE_NAMESPACE,
		maxEntries: COMPILED_CACHE_MAX_ENTRIES,
		maxBytesPerEntry: COMPILED_CACHE_MAX_BYTES_PER_ENTRY,
		maxBytesPerNamespace: COMPILED_CACHE_MAX_BYTES,
		overflowPolicy: "evict-oldest"
	});
	return {
		async read(config) {
			const ownerId = resolveMemoryWikiCompiledCacheOwnerId(config);
			const activeVault = resolveActiveVault(config);
			if (!activeVault?.reconciled || !activeVault.compiledCachePublicationId) return null;
			if (activeVault.snapshot) return activeVault.snapshot;
			const key = publicationKey(ownerId, activeVault.compiledCachePublicationId);
			const entry = await store.lookup(key).catch((error) => {
				options.onReadError?.(error);
				throw error;
			});
			if (!entry) return null;
			const metadata = entry.metadata;
			const vaultPath = path.resolve(config.vault.path);
			if (!isMetadata(metadata) || metadata.ownerId !== ownerId) return null;
			if (metadata.vaultPath !== vaultPath || metadata.vaultGeneration !== activeVault.vaultGeneration) return null;
			if (metadata.publicationId !== activeVault.compiledCachePublicationId) return null;
			const snapshot = parseSnapshot(entry.bytes, metadata.generation);
			if (!snapshot) return null;
			if (resolveActiveVault(config) !== activeVault) return null;
			activeVault.snapshot = snapshot;
			return snapshot;
		},
		async write(config, snapshot, generation, publicationId) {
			const ownerId = resolveMemoryWikiCompiledCacheOwnerId(config);
			const vaultPath = path.resolve(config.vault.path);
			const activeVault = resolveActiveVault(config);
			if (!activeVault) throw new Error(`Memory Wiki vault is not active: ${vaultPath}`);
			const serialized = JSON.stringify(snapshot);
			if (createHash("sha256").update(serialized).digest("hex") !== generation) throw new Error("Memory Wiki compiled cache generation does not match its snapshot.");
			const metadata = {
				version: COMPILED_CACHE_VERSION,
				ownerId,
				vaultPath,
				vaultGeneration: activeVault.vaultGeneration,
				publicationId,
				generation,
				encoding: "gzip-json"
			};
			await store.register(publicationKey(ownerId, publicationId), gzipSync(serialized), metadata);
			return {
				activeVault,
				serializedSnapshot: serialized
			};
		},
		async reconcile(config, loadDurableIdentity) {
			const ownerId = resolveMemoryWikiCompiledCacheOwnerId(config);
			const activeVault = resolveActiveVault(config);
			if (!activeVault) return;
			const durableIdentity = await loadDurableIdentity();
			if (durableIdentity.compiledCachePublicationId) try {
				await store.lookup(publicationKey(ownerId, durableIdentity.compiledCachePublicationId));
			} catch (error) {
				options.onReadError?.(error);
				throw error;
			}
			const confirmedIdentity = await loadDurableIdentity();
			if (resolveActiveVault(config) !== activeVault) return;
			if (!confirmedIdentity.vaultGeneration || confirmedIdentity.vaultGeneration !== durableIdentity.vaultGeneration || confirmedIdentity.compiledCachePublicationId !== durableIdentity.compiledCachePublicationId) {
				activeVaults.delete(ownerId);
				return;
			}
			activeVaults.set(ownerId, {
				path: activeVault.path,
				vaultGeneration: confirmedIdentity.vaultGeneration,
				compiledCachePublicationId: confirmedIdentity.compiledCachePublicationId ?? void 0,
				reconciled: true
			});
		},
		async delete(config) {
			const ownerId = resolveMemoryWikiCompiledCacheOwnerId(config);
			for (const entry of await store.entries()) if (isMetadata(entry.metadata) && entry.metadata.ownerId === ownerId) await store.delete(entry.key);
		},
		async deletePublication(config, publicationId) {
			await store.delete(publicationKey(resolveMemoryWikiCompiledCacheOwnerId(config), publicationId));
		},
		async deleteOwnersExcept(ownerIds) {
			let deleted = 0;
			for (const entry of await store.entries()) {
				const metadata = entry.metadata;
				if (isMetadata(metadata) && ownerIds.has(metadata.ownerId)) continue;
				await store.delete(entry.key);
				deleted += 1;
			}
			return deleted;
		}
	};
}
function configureMemoryWikiCompiledCacheStore(store) {
	configuredStore = store;
	if (!store) {
		activeVaults.clear();
		dashboardStates.clear();
	}
}
function requireConfiguredStore() {
	if (!configuredStore) throw new Error("Memory Wiki compiled cache store is not configured.");
	return configuredStore;
}
async function loadMemoryWikiCompiledCache(config) {
	return await requireConfiguredStore().read(config);
}
async function readMemoryWikiDashboardState(config) {
	const pending = dashboardStates.get(dashboardStateKey(config));
	if (pending) return pending.state;
	try {
		const snapshot = await loadMemoryWikiCompiledCache(config);
		if (snapshot) return {
			state: "ready",
			dashboards: snapshot.dashboards
		};
	} catch {
		return { state: "failed" };
	}
	return config.ingest.autoCompile ? { state: "rebuilding" } : { state: "compile-required" };
}
async function loadMemoryWikiCompiledDashboards(config) {
	const status = await readMemoryWikiDashboardState(config);
	if (status.state === "ready") return status.dashboards;
	throw new MemoryWikiDashboardUnavailableError(status.state, DASHBOARD_UNAVAILABLE_MESSAGES[status.state]);
}
async function invalidateMemoryWikiCompiledCache(config) {
	await requireConfiguredStore().delete(config);
	activeVaults.delete(resolveMemoryWikiCompiledCacheOwnerId(config));
	dashboardStates.delete(dashboardStateKey(config));
}
async function reconcileMemoryWikiCompiledCacheOwner(config, loadDurableIdentity) {
	await requireConfiguredStore().reconcile(config, loadDurableIdentity);
}
async function writeMemoryWikiCompiledCache(config, snapshot, generation, publicationId, parentPublicationId, validatePublication, commitPublication, loadDurableIdentity) {
	const store = requireConfiguredStore();
	const { activeVault, serializedSnapshot } = await store.write(config, snapshot, generation, publicationId);
	try {
		await validatePublication();
	} catch (error) {
		await store.deletePublication(config, publicationId);
		throw error;
	}
	if (resolveActiveVault(config) !== activeVault) {
		await store.deletePublication(config, publicationId);
		throw new Error("Memory Wiki cache owner retired before publication.");
	}
	try {
		await commitPublication();
	} catch (error) {
		if ((await loadDurableIdentity().catch(() => void 0))?.compiledCachePublicationId !== publicationId) await store.deletePublication(config, publicationId);
		throw error;
	}
	const durableIdentity = await loadDurableIdentity();
	if (durableIdentity.vaultGeneration !== activeVault.vaultGeneration || durableIdentity.compiledCachePublicationId !== publicationId) {
		await store.deletePublication(config, publicationId);
		if (resolveActiveVault(config) === activeVault) activeVaults.delete(resolveMemoryWikiCompiledCacheOwnerId(config));
		throw new Error("Memory Wiki vault changed while its compiled cache was being published.");
	}
	if (resolveActiveVault(config) !== activeVault) {
		await store.deletePublication(config, publicationId);
		throw new Error("Memory Wiki cache owner retired during publication.");
	}
	if (parentPublicationId) await store.deletePublication(config, parentPublicationId);
	if (resolveActiveVault(config) !== activeVault) {
		await store.deletePublication(config, publicationId);
		throw new Error("Memory Wiki cache owner retired while replacing its predecessor.");
	}
	activeVaults.set(resolveMemoryWikiCompiledCacheOwnerId(config), {
		...activeVault,
		compiledCachePublicationId: publicationId,
		reconciled: true,
		snapshot: JSON.parse(serializedSnapshot)
	});
	dashboardStates.delete(dashboardStateKey(config));
}
//#endregion
//#region extensions/memory-wiki/src/claim-health.ts
const DAY_MS = 864e5;
const WIKI_STALE_DAYS = 90;
const CONTESTED_CLAIM_STATUSES = /* @__PURE__ */ new Set([
	"contested",
	"contradicted",
	"refuted",
	"superseded"
]);
function normalizeClaimTextKey(text) {
	return normalizeLowercaseStringOrEmpty(text.replace(/\s+/g, " "));
}
function normalizeTextKey(text) {
	return normalizeLowercaseStringOrEmpty(text).replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").replace(/\s+/g, " ");
}
function buildFreshnessFromTimestamp(params) {
	const now = params.now ?? /* @__PURE__ */ new Date();
	const timestampMs = parseDateStringTimestampMs(params.timestamp);
	if (timestampMs === void 0 || !params.timestamp) return {
		level: "unknown",
		reason: "missing updatedAt"
	};
	const daysSinceTouch = Math.max(0, Math.floor((now.getTime() - timestampMs) / DAY_MS));
	return {
		level: daysSinceTouch >= WIKI_STALE_DAYS ? "stale" : daysSinceTouch >= 30 ? "aging" : "fresh",
		reason: `last touched ${params.timestamp}`,
		daysSinceTouch,
		lastTouchedAt: params.timestamp
	};
}
function resolveLatestTimestamp(candidates) {
	let bestValue;
	let bestMs = -1;
	for (const candidate of candidates) {
		const parsed = parseDateStringTimestampMs(candidate);
		if (parsed === void 0 || !candidate || parsed <= bestMs) continue;
		bestMs = parsed;
		bestValue = candidate;
	}
	return bestValue;
}
function normalizeClaimStatus(status) {
	return normalizeLowercaseStringOrEmpty(status) || "supported";
}
function isClaimContestedStatus(status) {
	return CONTESTED_CLAIM_STATUSES.has(normalizeClaimStatus(status));
}
function assessPageFreshness(page, now) {
	return buildFreshnessFromTimestamp({
		timestamp: page.updatedAt,
		now
	});
}
function assessClaimFreshness(params) {
	const candidates = [params.claim.updatedAt, ...params.claim.evidence.map((entry) => entry.updatedAt)];
	const hasClaimTimestamp = candidates.some((value) => typeof value === "string" && value.trim().length > 0);
	return buildFreshnessFromTimestamp({
		timestamp: resolveLatestTimestamp(candidates) ?? (hasClaimTimestamp ? void 0 : params.page.updatedAt),
		now: params.now
	});
}
function buildWikiClaimHealth(params) {
	const claimId = params.claim.id?.trim();
	return {
		key: `${params.page.relativePath}#${claimId ?? `claim-${params.index + 1}`}`,
		pagePath: params.page.relativePath,
		pageTitle: params.page.title,
		...params.page.id ? { pageId: params.page.id } : {},
		...claimId ? { claimId } : {},
		text: params.claim.text,
		status: normalizeClaimStatus(params.claim.status),
		...typeof params.claim.confidence === "number" ? { confidence: params.claim.confidence } : {},
		evidenceCount: params.claim.evidence.length,
		missingEvidence: params.claim.evidence.length === 0,
		freshness: assessClaimFreshness({
			page: params.page,
			claim: params.claim,
			now: params.now
		})
	};
}
function collectWikiClaimHealth(pages, now) {
	return pages.flatMap((page) => page.claims.map((claim, index) => buildWikiClaimHealth({
		page,
		claim,
		index,
		now
	})));
}
function buildClaimContradictionClusters(params) {
	const claimHealth = collectWikiClaimHealth(params.pages, params.now);
	const byId = /* @__PURE__ */ new Map();
	for (const claim of claimHealth) {
		if (!claim.claimId) continue;
		const current = byId.get(claim.claimId) ?? [];
		current.push(claim);
		byId.set(claim.claimId, current);
	}
	return [...byId.entries()].flatMap(([claimId, entries]) => {
		if (entries.length < 2) return [];
		const distinctTexts = new Set(entries.map((entry) => normalizeClaimTextKey(entry.text)));
		const distinctStatuses = new Set(entries.map((entry) => entry.status));
		if (distinctTexts.size < 2 && distinctStatuses.size < 2) return [];
		return [{
			key: claimId,
			label: claimId,
			entries: entries.toSorted((left, right) => left.pagePath.localeCompare(right.pagePath))
		}];
	}).toSorted((left, right) => left.label.localeCompare(right.label));
}
function buildPageContradictionClusters(pages) {
	const byNote = /* @__PURE__ */ new Map();
	for (const page of pages) for (const note of page.contradictions) {
		const key = normalizeTextKey(note);
		if (!key) continue;
		const current = byNote.get(key) ?? [];
		current.push({
			pagePath: page.relativePath,
			pageTitle: page.title,
			...page.id ? { pageId: page.id } : {},
			note
		});
		byNote.set(key, current);
	}
	return [...byNote.entries()].map(([key, entries]) => ({
		key,
		label: entries[0]?.note ?? key,
		entries: entries.toSorted((left, right) => left.pagePath.localeCompare(right.pagePath))
	})).toSorted((left, right) => left.label.localeCompare(right.label));
}
//#endregion
//#region extensions/memory-wiki/src/person-page.ts
function isPersonLikePage(page) {
	const entityType = normalizeLowercaseStringOrEmpty(page.entityType);
	const pageType = normalizeLowercaseStringOrEmpty(page.pageType);
	return Boolean(page.personCard) || entityType === "person" || entityType === "maintainer" || pageType === "person" || pageType === "maintainer";
}
//#endregion
//#region extensions/memory-wiki/src/query-memory-provider.ts
function resolveActiveMemoryAgentId(params) {
	if (!params.appConfig) return null;
	if (params.agentId?.trim()) return params.agentId.trim();
	if (params.agentSessionKey?.trim()) return resolveSessionAgentIdStrict({
		sessionKey: params.agentSessionKey,
		config: params.appConfig
	});
	return resolveDefaultAgentId(params.appConfig);
}
/** Reports whether the slot owner serves this query natively; legacy owners keep their manager path. */
async function usesNativeMemoryProvider(params) {
	const agentId = resolveActiveMemoryAgentId(params);
	if (!params.appConfig || !agentId) return false;
	try {
		return await isActiveMemoryProviderNative({
			cfg: params.appConfig,
			agentId
		});
	} catch {
		return false;
	}
}
/** Opens one query-bound memory provider and closes it before returning. */
async function withActiveMemoryProvider(params, action) {
	const agentId = resolveActiveMemoryAgentId(params);
	let active = true;
	const caller = params.memoryContext;
	const context = {
		authority: caller?.authority ?? {
			kind: "host",
			operation: "memory-wiki.query"
		},
		signal: caller?.signal,
		assertCurrent() {
			if (!active) throw new Error("Memory Wiki query has completed.");
			caller?.assertCurrent();
			caller?.signal?.throwIfAborted();
		}
	};
	let result = { provider: null };
	let value;
	try {
		context.assertCurrent();
		if (params.appConfig && agentId) try {
			result = await getActiveMemoryProvider({
				cfg: params.appConfig,
				agentId,
				context
			});
		} catch {
			context.assertCurrent();
		}
		value = await action(result);
		context.assertCurrent();
	} finally {
		active = false;
		await result.provider?.close();
	}
	caller?.assertCurrent();
	caller?.signal?.throwIfAborted();
	return value;
}
const MEMORY_REFERENCE_PREFIX = "memory-ref:";
function memoryReferenceLookup(reference) {
	return `${MEMORY_REFERENCE_PREFIX}${encodeURIComponent(JSON.stringify(reference))}`;
}
function isMemoryReferenceLookup(lookup) {
	return lookup.startsWith(MEMORY_REFERENCE_PREFIX);
}
function parseMemoryReferenceLookup(lookup) {
	if (!lookup.startsWith(MEMORY_REFERENCE_PREFIX)) return null;
	const record = asNullableRecord(JSON.parse(decodeURIComponent(lookup.slice(11))));
	if (!record || typeof record.providerId !== "string" || !record.providerId || typeof record.id !== "string" || !record.id || record.revision !== void 0 && typeof record.revision !== "string" || record.fragment !== void 0 && typeof record.fragment !== "string") throw new Error("Invalid memory reference.");
	return {
		providerId: record.providerId,
		id: record.id,
		...record.revision !== void 0 ? { revision: record.revision } : {},
		...record.fragment !== void 0 ? { fragment: record.fragment } : {}
	};
}
//#endregion
//#region extensions/memory-wiki/src/query-shared-memory.ts
function normalizeLookupKey(value) {
	const normalized = value.trim().replace(/\\/g, "/");
	return normalized.endsWith(".md") ? normalized : normalized.replace(/\/+$/, "");
}
function shouldEnforceSessionVisibility(params) {
	return params.sandboxed === true || Boolean(params.agentSessionKey?.trim()) || Boolean(params.agentId?.trim());
}
async function resolveActiveMemoryManager(params) {
	const agentId = resolveActiveMemoryAgentId(params);
	if (!params.appConfig || !agentId) return null;
	try {
		const { manager } = await getActiveMemorySearchManager({
			cfg: params.appConfig,
			agentId
		});
		return manager;
	} catch {
		return null;
	}
}
function buildMemoryManagerContractError(method) {
	return /* @__PURE__ */ new Error(`The active memory plugin's search manager does not implement ${method}() from the MemorySearchManager contract. Set search.backend to "local" for wiki-only access, or use a memory plugin that implements the contract.`);
}
function buildMemorySearchTitle(resultPath) {
	const basename = path.basename(resultPath, path.extname(resultPath));
	return basename.length > 0 ? basename : resultPath;
}
async function searchSharedMemory(params, options) {
	if (await usesNativeMemoryProvider(params)) return await withActiveMemoryProvider(params, async ({ provider }) => {
		if (!provider) return [];
		return (await provider.search({
			query: params.query,
			maxResults: options.maxResults,
			...options.protectedSessionRecall ? { sources: ["sessions"] } : {}
		})).hits.map((result) => {
			const citation = result.citations?.[0];
			const hit = {
				corpus: "memory",
				reference: result.reference,
				lookup: memoryReferenceLookup(result.reference),
				title: citation?.label ?? result.reference.id,
				kind: "memory",
				score: result.score ?? 0,
				snippet: result.excerpt,
				startLine: citation?.startLine,
				endLine: citation?.endLine,
				memorySource: result.source,
				searchMode: options.mode
			};
			if (citation) hit.citation = citation.label;
			if (result.citations) hit.citations = result.citations;
			return hit;
		});
	});
	const sharedMemoryManager = await resolveActiveMemoryManager(params);
	if (sharedMemoryManager && typeof sharedMemoryManager.search !== "function") throw buildMemoryManagerContractError("search");
	let rawMemoryResults = sharedMemoryManager ? await sharedMemoryManager.search(params.query, {
		maxResults: options.maxResults,
		...params.signal ? { signal: params.signal } : {},
		...options.protectedSessionRecall ? {
			sources: ["sessions"],
			sessionKey: params.agentSessionKey
		} : {}
	}) : [];
	if (params.appConfig && shouldEnforceSessionVisibility(params) && (params.conversationRecall || rawMemoryResults.some((hit) => hit.source === "sessions"))) rawMemoryResults = await filterMemorySearchHitsBySessionVisibility({
		cfg: params.appConfig,
		agentId: params.agentId,
		requesterSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true,
		hits: rawMemoryResults,
		conversationRecall: params.conversationRecall,
		trustedAgentScope: !params.agentSessionKey && Boolean(params.agentId?.trim())
	});
	return rawMemoryResults.map((result) => {
		const hit = {
			corpus: "memory",
			path: result.path,
			title: buildMemorySearchTitle(result.path),
			kind: "memory",
			score: result.score,
			snippet: result.snippet,
			startLine: result.startLine,
			endLine: result.endLine,
			memorySource: result.source,
			searchMode: options.mode
		};
		if (result.citation) hit.citation = result.citation;
		return hit;
	});
}
/**
* Reads one memory page for a Wiki lookup: a native provider resolves only the reference
* it issued, and a legacy runtime resolves the lookup as a Markdown path.
*/
async function readSharedMemoryPage(params, reference) {
	if (reference) return await withActiveMemoryProvider(params, async ({ provider }) => {
		if (!provider) return null;
		const result = await provider.get({
			reference,
			from: params.fromLine,
			lines: params.lineCount
		});
		if (result.status === "not_found") return null;
		return {
			corpus: "memory",
			reference: result.reference,
			lookup: memoryReferenceLookup(result.reference),
			citations: result.citations,
			title: result.citations?.[0]?.label ?? result.reference.id,
			kind: "memory",
			content: result.text,
			fromLine: result.from ?? params.fromLine,
			lineCount: result.lines ?? params.lineCount,
			truncated: result.truncated
		};
	});
	if (await usesNativeMemoryProvider(params)) return null;
	const { fromLine, lineCount } = params;
	const manager = await resolveActiveMemoryManager(params);
	if (!manager) return null;
	if (typeof manager.readFile !== "function") throw buildMemoryManagerContractError("readFile");
	const normalized = normalizeLookupKey(params.lookup);
	const relPath = normalized.endsWith(".md") ? normalized : `${normalized}.md`;
	if (params.appConfig && shouldEnforceSessionVisibility(params) && relPath.startsWith("sessions/")) {
		if ((await filterMemorySearchHitsBySessionVisibility({
			cfg: params.appConfig,
			agentId: params.agentId,
			requesterSessionKey: params.agentSessionKey,
			sandboxed: params.sandboxed === true,
			conversationRecall: params.conversationRecall,
			trustedAgentScope: !params.agentSessionKey && Boolean(params.agentId?.trim()),
			hits: [{
				path: relPath,
				startLine: 1,
				endLine: 1,
				score: 0,
				snippet: "",
				source: "sessions"
			}]
		})).length === 0) return null;
	}
	const result = await manager.readFile({
		relPath,
		from: fromLine,
		lines: lineCount
	});
	return result.status === "not_found" ? null : {
		corpus: "memory",
		path: result.path,
		title: buildMemorySearchTitle(result.path),
		kind: "memory",
		content: result.text,
		fromLine,
		lineCount
	};
}
//#endregion
//#region extensions/memory-wiki/src/query-page-lookup.ts
function createPathLookupMatchers(key) {
	const withExtension = key.endsWith(".md") ? key : `${key}.md`;
	return [
		(file) => file === key,
		(file) => file === withExtension,
		(file) => file.replace(/\.md$/i, "") === key,
		(file) => path.basename(file, ".md") === key
	];
}
/** Resolves a wiki_get lookup over pages already read: four path tiers, then the page ID. */
function resolveQueryableWikiPageByLookup(pages, lookup) {
	const key = normalizeLookupKey(lookup);
	for (const matches of createPathLookupMatchers(key)) {
		const page = pages.find((candidate) => matches(candidate.relativePath));
		if (page) return page;
	}
	return pages.find((page) => page.id === key) ?? null;
}
/**
* Resolves only the path-shaped tiers of resolveQueryableWikiPageByLookup from the file
* listing, reading candidates one at a time in tier then path order until one is valid and
* visible. A hit is exactly the page the full-vault read would return because both walk the
* same sorted listing and the full read keeps listing order. Pages matched only by ID, and
* every miss, return null so the caller keeps the full read; the compiled digest cannot
* prove which pages carry an ID since the last compile.
*/
async function findQueryableWikiPageByPathLookup(params) {
	const tiers = createPathLookupMatchers(normalizeLookupKey(params.lookup));
	const candidatePaths = new Set(tiers.flatMap((matches) => params.files.filter(matches)));
	for (const candidatePath of candidatePaths) {
		const page = await params.readPage(candidatePath);
		if (page && params.canReadPage(page)) return page;
	}
	return null;
}
/**
* Resolves a wiki_get lookup to the page a read of the whole vault would pick, reading as
* few pages as possible: the exact path, then the path tiers from the listing, then every
* page. One listing serves both the path tiers and the full read.
*/
async function resolveQueryableWikiPageForLookup(params) {
	const exactPage = await params.readExactPage();
	if (exactPage && params.canReadPage(exactPage)) return resolveQueryableWikiPageByLookup([exactPage], params.lookup);
	const files = await params.listFiles();
	return await findQueryableWikiPageByPathLookup({
		files,
		lookup: params.lookup,
		readPage: async (relativePath) => (await params.readPages([relativePath]))[0] ?? null,
		canReadPage: params.canReadPage
	}) ?? resolveQueryableWikiPageByLookup((await params.readPages(files)).filter(params.canReadPage), params.lookup);
}
async function listWikiMarkdownFiles(rootDir) {
	return (await Promise.all(WIKI_PAGE_GROUPS.map(({ dir }) => listMemoryWikiPagePaths(rootDir, dir)))).flat().toSorted((left, right) => left.localeCompare(right));
}
async function readQueryableWikiPages(rootDir, signal) {
	signal?.throwIfAborted();
	return readQueryableWikiPagesByPaths(rootDir, await listWikiMarkdownFiles(rootDir), signal);
}
async function readQueryableWikiPagesByPaths(rootDir, files, signal) {
	signal?.throwIfAborted();
	if (files.length === 0) return [];
	const vault = await root(rootDir, {
		hardlinks: "allow",
		maxBytes: Infinity
	});
	const { results } = await runTasksWithConcurrency({
		tasks: files.map((relativePath) => async () => {
			signal?.throwIfAborted();
			const absolutePath = path.join(rootDir, relativePath);
			try {
				const raw = await vault.readText(relativePath);
				signal?.throwIfAborted();
				const scan = scanWikiPageSummary({
					absolutePath,
					relativePath,
					raw,
					includeLinks: false
				});
				return scan.status === "valid" ? {
					...scan.page,
					raw,
					parsed: scan.parsed
				} : null;
			} catch (error) {
				if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "not-file")) return null;
				throw error;
			}
		}),
		limit: 16,
		errorMode: "stop",
		throwOnError: true
	});
	return results.filter((page) => page !== null);
}
//#endregion
//#region extensions/memory-wiki/src/log.ts
const COMPILED_SOURCE_DIRECTORIES = [
	"sources",
	"entities",
	"concepts",
	"syntheses",
	"reports"
];
async function appendMemoryWikiLog(vaultRoot, entry) {
	const logPath = path.join(vaultRoot, ".openclaw-wiki", "log.jsonl");
	await fs$1.mkdir(path.dirname(logPath), { recursive: true });
	await appendRegularFile({
		filePath: logPath,
		content: `${JSON.stringify(entry)}\n`,
		rejectSymlinkParents: true
	});
}
async function loadMemoryWikiVaultIdentity(vaultRoot) {
	const emptyIdentity = {
		vaultGeneration: null,
		compiledCacheReservationId: null,
		compiledCachePublicationId: null,
		compiledCacheSourceGeneration: null
	};
	const identity = { ...emptyIdentity };
	const consumeLine = (line) => {
		try {
			const { details } = JSON.parse(line);
			identity.vaultGeneration ??= normalizeOptionalString(details?.vaultGeneration) ?? null;
			const normalizedReservationId = normalizeOptionalString(details?.compiledCacheReservationId);
			const candidateCompiledCachePublicationId = normalizeOptionalString(details?.compiledCachePublicationId);
			if (candidateCompiledCachePublicationId) {
				const candidateParent = details?.compiledCacheParentPublicationId;
				const normalizedParent = candidateParent === null ? null : normalizeOptionalString(candidateParent);
				const normalizedSourceGeneration = normalizeOptionalString(details?.compiledCacheSourceGeneration);
				if (normalizedParent === identity.compiledCachePublicationId && normalizedReservationId === identity.compiledCacheReservationId && normalizedSourceGeneration) {
					identity.compiledCachePublicationId = candidateCompiledCachePublicationId;
					identity.compiledCacheSourceGeneration = normalizedSourceGeneration;
				}
			} else if (normalizedReservationId) identity.compiledCacheReservationId = normalizedReservationId;
		} catch {}
	};
	try {
		const handle = await fs$1.open(path.join(vaultRoot, ".openclaw-wiki", "log.jsonl"), "r");
		try {
			const stat = await handle.stat();
			let remaining = stat.isFile() && stat.size > 0 ? stat.size : Infinity;
			const buffer = Buffer.allocUnsafe(65536);
			const decoder = new StringDecoder("utf8");
			let fragments = [];
			const consume = (text) => {
				let start = 0;
				for (let end = text.indexOf("\n"); end !== -1; end = text.indexOf("\n", start)) {
					const part = text.slice(start, end);
					if (fragments.length > 0) {
						fragments.push(part);
						consumeLine(fragments.join(""));
						fragments = [];
					} else consumeLine(part);
					start = end + 1;
				}
				if (start < text.length) fragments.push(text.slice(start));
			};
			while (remaining > 0) {
				const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.length, remaining), null);
				if (bytesRead === 0) break;
				remaining -= bytesRead;
				consume(decoder.write(buffer.subarray(0, bytesRead)));
			}
			consume(decoder.end());
			if (fragments.length > 0) consumeLine(fragments.join(""));
		} catch (error) {
			try {
				await handle.close();
			} catch (closeError) {
				throw new AggregateError([error, closeError], "Memory Wiki journal read and close failed.", { cause: closeError });
			}
			throw error;
		}
		await handle.close();
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") return emptyIdentity;
		throw error;
	}
	return identity;
}
async function resolveMemoryWikiVaultSourceGeneration(vaultRoot) {
	const files = (await Promise.all(COMPILED_SOURCE_DIRECTORIES.map((relativeDir) => listMemoryWikiPagePaths(vaultRoot, relativeDir)))).flat().toSorted((left, right) => left.localeCompare(right));
	const hash = createHash("sha256");
	for (const file of files) {
		const relativePath = Buffer.from(file);
		const pathLength = Buffer.allocUnsafe(4);
		pathLength.writeUInt32BE(relativePath.byteLength);
		const contentDigest = createHash("sha256").update(await fs$1.readFile(path.join(vaultRoot, file))).digest();
		hash.update(pathLength).update(relativePath).update(contentDigest);
	}
	return hash.digest("hex");
}
async function loadMemoryWikiValidatedVaultIdentity(vaultRoot) {
	const identity = await loadMemoryWikiVaultIdentity(vaultRoot);
	if (!identity.compiledCachePublicationId || !identity.compiledCacheSourceGeneration) return identity;
	if (await resolveMemoryWikiVaultSourceGeneration(vaultRoot) === identity.compiledCacheSourceGeneration) return identity;
	return {
		...identity,
		compiledCachePublicationId: null,
		compiledCacheSourceGeneration: null
	};
}
async function ensureMemoryWikiVaultGeneration(vaultRoot) {
	const { vaultGeneration: existing } = await loadMemoryWikiVaultIdentity(vaultRoot);
	if (existing) return existing;
	const candidate = randomUUID();
	await appendMemoryWikiLog(vaultRoot, {
		type: "vault-generation",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: { vaultGeneration: candidate }
	});
	return (await loadMemoryWikiVaultIdentity(vaultRoot)).vaultGeneration ?? candidate;
}
//#endregion
//#region extensions/memory-wiki/src/time.ts
function resolveMemoryWikiTimestamp(nowMs) {
	return new Date(nowMs ?? Date.now()).toJSON() ?? new Date(Date.now()).toJSON() ?? (/* @__PURE__ */ new Date()).toISOString();
}
//#endregion
//#region extensions/memory-wiki/src/vault.ts
const WIKI_VAULT_DIRECTORIES = [
	"entities",
	"concepts",
	"syntheses",
	"sources",
	"reports",
	"_attachments",
	"_views",
	".openclaw-wiki"
];
const WIKI_VAULT_SCAFFOLD = [
	"AGENTS.md",
	"WIKI.md",
	"index.md",
	".openclaw-wiki/log.jsonl"
];
function buildIndexMarkdown() {
	return withTrailingNewline(replaceManagedMarkdownBlock({
		original: "# Wiki Index\n",
		heading: "## Generated",
		startMarker: "<!-- openclaw:wiki:index:start -->",
		endMarker: "<!-- openclaw:wiki:index:end -->",
		body: "- No compiled pages yet."
	}));
}
function buildAgentsMarkdown() {
	return withTrailingNewline(`\
# Memory Wiki Agent Guide

- Treat generated blocks as plugin-owned.
- Preserve human notes outside managed markers.
- Prefer source-backed claims over wiki-to-wiki citation loops.
- Prefer structured \`claims\` with evidence over burying key beliefs only in prose.
- Use the wiki tools for machine reads; Markdown pages are the human view.
`);
}
function buildWikiOverviewMarkdown(config) {
	return withTrailingNewline(`\
# Memory Wiki

This vault is maintained by the OpenClaw memory-wiki plugin.

- Vault mode: \`${config.vaultMode}\`
- Render mode: \`${config.vault.renderMode}\`
- Search corpus default: \`${config.search.corpus}\`

## Architecture
- Raw sources remain the evidence layer.
- To keep unmanaged raw Markdown in \`sources/\`, add \`${WIKI_RAW_SOURCE_MARKER}\` near the top of the page.
- Wiki pages are the human-readable synthesis layer.
- Compiled query and prompt snapshots live in OpenClaw plugin state, not vault files.

## Notes
<!-- openclaw:human:start -->
<!-- openclaw:human:end -->
`);
}
async function writeFileIfMissing(rootDir, relativePath, content, createdFiles) {
	const root$6 = await root(rootDir);
	try {
		await root$6.create(relativePath, content);
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "already-exists") return;
		throw err;
	}
	createdFiles.push(path.join(rootDir, relativePath));
}
async function initializeMemoryWikiVault(config, options) {
	options?.signal?.throwIfAborted();
	const rootDir = config.vault.path;
	const createdDirectories = [];
	const createdFiles = [];
	if (!await pathExists(rootDir)) createdDirectories.push(rootDir);
	await fs$1.mkdir(rootDir, { recursive: true });
	if (!(await Promise.all(WIKI_VAULT_SCAFFOLD.map((relativePath) => pathExists(path.join(rootDir, relativePath))))).every(Boolean)) await invalidateMemoryWikiCompiledCache(config);
	for (const relativeDir of WIKI_VAULT_DIRECTORIES) {
		const fullPath = path.join(rootDir, relativeDir);
		if (!await pathExists(fullPath)) createdDirectories.push(fullPath);
		await fs$1.mkdir(fullPath, { recursive: true });
	}
	await writeFileIfMissing(rootDir, "AGENTS.md", buildAgentsMarkdown(), createdFiles);
	await writeFileIfMissing(rootDir, "WIKI.md", buildWikiOverviewMarkdown(config), createdFiles);
	await writeFileIfMissing(rootDir, "index.md", buildIndexMarkdown(), createdFiles);
	await writeFileIfMissing(rootDir, "inbox.md", withTrailingNewline("# Inbox\n\nDrop raw ideas, questions, and source links here.\n"), createdFiles);
	await writeFileIfMissing(rootDir, ".openclaw-wiki/log.jsonl", "", createdFiles);
	if (createdDirectories.length > 0 || createdFiles.length > 0) await appendMemoryWikiLog(rootDir, {
		type: "init",
		timestamp: resolveMemoryWikiTimestamp(options?.nowMs),
		details: {
			createdDirectories: createdDirectories.map((dir) => path.relative(rootDir, dir) || "."),
			createdFiles: createdFiles.map((file) => path.relative(rootDir, file))
		}
	});
	const vaultGeneration = await ensureMemoryWikiVaultGeneration(rootDir);
	options?.signal?.throwIfAborted();
	if (!isMemoryWikiCompiledCacheOwnerActive(config, vaultGeneration)) await activateExistingMemoryWikiVault(config, options?.signal);
	return {
		rootDir,
		created: createdDirectories.length > 0 || createdFiles.length > 0,
		createdDirectories,
		createdFiles
	};
}
async function activateExistingMemoryWikiVault(config, signal) {
	signal?.throwIfAborted();
	const rootDir = config.vault.path;
	const identity = await loadMemoryWikiValidatedVaultIdentity(rootDir);
	if (!identity.vaultGeneration) throw new Error(`Memory Wiki vault generation is missing: ${rootDir}`);
	signal?.throwIfAborted();
	if (activateMemoryWikiCompiledCacheOwner(config, identity.vaultGeneration, identity.compiledCachePublicationId)) await reconcileMemoryWikiCompiledCacheOwner(config, () => loadMemoryWikiValidatedVaultIdentity(rootDir));
	signal?.throwIfAborted();
}
//#endregion
//#region extensions/memory-wiki/src/query.ts
const WIKI_SNIPPET_MAX_CHARS = 700;
const RELATED_BLOCK_PATTERN = /<!-- openclaw:wiki:related:start -->[\s\S]*?<!-- openclaw:wiki:related:end -->/g;
const MARKDOWN_FRONTMATTER_PATTERN = /^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const STRUCTURAL_MARKER_LINE_PATTERN = /^\s*<!--\s*openclaw:(?:wiki|human):[^>]*-->\s*$/;
const ROUTE_QUESTION_STOP_WORDS = /* @__PURE__ */ new Set([
	"a",
	"about",
	"am",
	"an",
	"are",
	"ask",
	"asking",
	"be",
	"been",
	"being",
	"can",
	"could",
	"did",
	"do",
	"does",
	"for",
	"help",
	"how",
	"i",
	"in",
	"is",
	"know",
	"knows",
	"me",
	"my",
	"need",
	"needs",
	"of",
	"on",
	"or",
	"our",
	"question",
	"questions",
	"should",
	"the",
	"to",
	"us",
	"we",
	"what",
	"when",
	"where",
	"who",
	"whom",
	"whose",
	"why",
	"with",
	"would"
]);
const WIKI_SEARCH_MODES = [
	"auto",
	"find-person",
	"route-question",
	"source-evidence",
	"raw-claim"
];
function sortWikiSearchResults(results) {
	return results.toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.title.localeCompare(right.title);
	});
}
function mergeWikiSearchCorpusResults(params) {
	const wikiResults = sortWikiSearchResults(params.wikiResults);
	const memoryResults = sortWikiSearchResults(params.memoryResults);
	if (!params.balanceCorpora || wikiResults.length === 0 || memoryResults.length === 0) return sortWikiSearchResults([...wikiResults, ...memoryResults]).slice(0, params.maxResults);
	const perCorpusCap = Math.ceil(params.maxResults / 2);
	const selectedWiki = wikiResults.slice(0, perCorpusCap);
	const selectedMemory = memoryResults.slice(0, perCorpusCap);
	const selected = [...selectedWiki, ...selectedMemory];
	if (selected.length < params.maxResults) selected.push(...sortWikiSearchResults([...wikiResults.slice(selectedWiki.length), ...memoryResults.slice(selectedMemory.length)]).slice(0, params.maxResults - selected.length));
	return sortWikiSearchResults(selected).slice(0, params.maxResults);
}
function normalizeWikiSearchText(value) {
	return normalizeLowercaseStringOrEmpty(value).normalize("NFC");
}
function buildSnippet(raw, query) {
	const queryLower = normalizeWikiSearchText(query);
	const queryTokens = buildQueryTokens(queryLower);
	const lines = buildSearchableBody(raw).split(/\r?\n/).filter((line) => line.trim().length > 0);
	let matchingLine = lines.find((line) => lineMatchesQuery(normalizeWikiSearchText(line), queryLower, queryTokens));
	if (matchingLine === void 0 && queryTokens.length > 0) {
		let bestHits = 0;
		for (const line of lines) {
			const lineLower = normalizeWikiSearchText(line);
			const hits = queryTokens.filter((token) => lineLower.includes(token)).length;
			if (hits > bestHits) {
				bestHits = hits;
				matchingLine = line;
			}
		}
	}
	return matchingLine?.trim() || lines.find((line) => line.trim() !== "---")?.trim() || "";
}
function buildPageSearchFields(page, relationships) {
	return [
		page.pageType ?? "",
		page.entityType ?? "",
		page.canonicalId ?? "",
		page.aliases?.join(" ") ?? "",
		page.sourceIds.join(" "),
		page.questions.join(" "),
		page.contradictions.join(" "),
		page.privacyTier ?? "",
		page.bestUsedFor?.join(" ") ?? "",
		page.notEnoughFor?.join(" ") ?? "",
		page.personCard?.canonicalId ?? "",
		page.personCard?.handles.join(" ") ?? "",
		page.personCard?.socials.join(" ") ?? "",
		page.personCard?.emails.join(" ") ?? "",
		page.personCard?.timezone ?? "",
		page.personCard?.lane ?? "",
		page.personCard?.askFor.join(" ") ?? "",
		page.personCard?.avoidAskingFor.join(" ") ?? "",
		page.personCard?.bestUsedFor.join(" ") ?? "",
		page.personCard?.notEnoughFor.join(" ") ?? "",
		relationships?.flatMap((relationship) => [
			relationship.targetId ?? "",
			relationship.targetPath ?? "",
			relationship.targetTitle ?? "",
			relationship.kind ?? "",
			relationship.evidenceKind ?? "",
			relationship.note ?? ""
		]).join(" ") ?? ""
	];
}
function buildPageSearchText(page) {
	return [
		page.title,
		page.relativePath,
		page.id ?? "",
		JSON.stringify(page.parsed.frontmatter),
		...buildPageSearchFields(page, page.relationships),
		page.claims.map((claim) => claim.text).join(" "),
		page.claims.map((claim) => claim.id ?? "").join(" "),
		page.claims.flatMap((claim) => claim.evidence.flatMap((evidence) => [
			evidence.kind ?? "",
			evidence.sourceId ?? "",
			evidence.path ?? "",
			evidence.lines ?? "",
			evidence.note ?? "",
			evidence.privacyTier ?? ""
		])).join(" ")
	].filter(Boolean).join("\n");
}
function buildSearchableBody(raw) {
	return raw.replace(RELATED_BLOCK_PATTERN, "").replace(MARKDOWN_FRONTMATTER_PATTERN, "").split(/\r?\n/).filter((line) => !STRUCTURAL_MARKER_LINE_PATTERN.test(line)).join("\n");
}
function buildQueryTokens(queryLower) {
	return [...new Set(queryLower.split(/[^\p{L}\p{N}\p{M}@._-]+/u).map((token) => token.trim()).filter((token) => token.length >= 2))];
}
function buildRouteQuestionTokens(queryLower) {
	const tokens = buildQueryTokens(queryLower);
	const routedTokens = tokens.filter((token) => !ROUTE_QUESTION_STOP_WORDS.has(token));
	return routedTokens.length > 0 ? routedTokens : tokens;
}
function lineMatchesQuery(lineLower, queryLower, queryTokens) {
	if (queryLower.length > 0 && lineLower.includes(queryLower)) return true;
	return queryTokens.length > 0 && queryTokens.every((token) => lineLower.includes(token));
}
function buildDigestPageSearchText(page, claims) {
	return [
		page.title,
		page.path,
		page.id ?? "",
		...buildPageSearchFields(page, page.topRelationships),
		claims.map((claim) => claim.text).join(" "),
		claims.map((claim) => claim.id ?? "").join(" "),
		claims.map((claim) => claim.evidenceKinds?.join(" ") ?? "").join(" "),
		claims.map((claim) => claim.privacyTiers?.join(" ") ?? "").join(" ")
	].filter(Boolean).join("\n");
}
function isClaimTextOrIdMatch(claim, queryLower, queryTokens = buildQueryTokens(queryLower)) {
	if (lineMatchesQuery(normalizeWikiSearchText(claim.text), queryLower, queryTokens)) return true;
	return lineMatchesQuery(normalizeWikiSearchText(claim.id), queryLower, queryTokens);
}
function scoreClaimMatch(params) {
	let score = 0;
	if (normalizeWikiSearchText(params.text).includes(params.queryLower)) score += 25;
	else if (params.queryTokens?.length && params.queryTokens.every((token) => normalizeWikiSearchText(params.text).includes(token))) score += 18;
	if (normalizeWikiSearchText(params.id).includes(params.queryLower)) score += 10;
	if (typeof params.confidence === "number") score += Math.round(params.confidence * 10);
	switch (params.freshnessLevel) {
		case "fresh":
			score += 8;
			break;
		case "aging":
			score += 4;
			break;
		case "stale":
			score -= 2;
			break;
		case "unknown":
			score -= 4;
			break;
		case void 0:
	}
	score += isClaimContestedStatus(params.status) ? -6 : 4;
	return score;
}
function hasAnyQueryMatch(values, queryLower, queryTokens) {
	return values.some((value) => lineMatchesQuery(normalizeWikiSearchText(value), queryLower, queryTokens));
}
function buildRouteQuestionFields(page) {
	const relationships = "relationships" in page ? page.relationships : page.topRelationships;
	return [
		page.personCard?.lane,
		...page.personCard?.askFor ?? [],
		...page.personCard?.avoidAskingFor ?? [],
		...page.bestUsedFor ?? [],
		...page.notEnoughFor ?? [],
		...page.personCard?.bestUsedFor ?? [],
		...page.personCard?.notEnoughFor ?? [],
		...relationships?.flatMap((relationship) => [
			relationship.kind,
			relationship.targetTitle,
			relationship.note
		]) ?? []
	].filter((value) => Boolean(value));
}
function hasRouteQuestionMatch(values, queryLower) {
	return hasAnyQueryMatch(values, queryLower, buildRouteQuestionTokens(queryLower));
}
function scoreWikiSearchModeBoost(params) {
	const { page, queryLower, queryTokens } = params;
	switch (params.mode) {
		case "auto": return 0;
		case "find-person": {
			let score = isPersonLikePage(page) ? 24 : -4;
			if (hasAnyQueryMatch([
				page.canonicalId,
				...page.aliases ?? [],
				page.personCard?.canonicalId,
				...page.personCard?.handles ?? [],
				...page.personCard?.emails ?? [],
				...page.personCard?.socials ?? []
			], queryLower, queryTokens)) score += 24;
			return score;
		}
		case "route-question": {
			let score = isPersonLikePage(page) ? 14 : 0;
			if (hasRouteQuestionMatch(buildRouteQuestionFields(page), queryLower)) score += 32;
			const relationshipCount = "relationships" in page ? page.relationships.length : page.relationshipCount ?? 0;
			return score + Math.min(8, relationshipCount * 2);
		}
		case "source-evidence": {
			let score = page.kind === "source" ? 22 : 0;
			const evidenceFields = params.claims.flatMap((claim) => "evidence" in claim ? claim.evidence.flatMap((evidence) => [
				evidence.kind,
				evidence.sourceId,
				evidence.path,
				evidence.lines,
				evidence.note
			]) : [
				...claim.sourceIds ?? [],
				...claim.evidenceKinds ?? [],
				...claim.privacyTiers ?? []
			]);
			if (hasAnyQueryMatch([
				"sourcePath" in page ? page.sourcePath : void 0,
				...page.sourceIds,
				...evidenceFields
			], queryLower, queryTokens)) score += 30;
			return score;
		}
		case "raw-claim": return params.matchingClaimCount > 0 ? 42 : 0;
	}
	return 0;
}
function buildDigestCandidatePaths(params) {
	const queryLower = normalizeWikiSearchText(params.query);
	const queryTokens = buildQueryTokens(queryLower);
	const claimsByPage = /* @__PURE__ */ new Map();
	for (const claim of params.snapshot.claims) {
		const current = claimsByPage.get(claim.pagePath) ?? [];
		current.push(claim);
		claimsByPage.set(claim.pagePath, current);
	}
	return params.snapshot.digest.pages.map((page) => {
		const claims = claimsByPage.get(page.path) ?? [];
		if (!lineMatchesQuery(normalizeWikiSearchText(buildDigestPageSearchText(page, claims)), queryLower, queryTokens) && !(params.mode === "route-question" && hasRouteQuestionMatch(buildRouteQuestionFields(page), queryLower))) return {
			path: page.path,
			score: 0
		};
		const score = scorePage({
			page,
			claims,
			matchingClaims: getMatchingClaims(claims, queryLower, queryTokens, (claim) => scoreClaimMatch({
				...claim,
				queryLower,
				queryTokens
			})),
			queryLower,
			queryTokens,
			mode: params.mode
		});
		return {
			path: page.path,
			score
		};
	}).filter((candidate) => candidate.score > 0).toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.path.localeCompare(right.path);
	}).slice(0, Math.max(params.maxResults * 4, 20)).map((candidate) => candidate.path);
}
function getMatchingClaims(claims, queryLower, queryTokens, score) {
	return claims.filter((claim) => isClaimTextOrIdMatch(claim, queryLower, queryTokens)).map((claim) => ({
		claim,
		score: score(claim)
	})).toSorted((left, right) => right.score - left.score);
}
function scorePage(params) {
	const { page, claims, matchingClaims, queryLower, queryTokens, mode } = params;
	const titleLower = normalizeWikiSearchText(page.title);
	const pathLower = normalizeWikiSearchText("relativePath" in page ? page.relativePath : page.path);
	const idLower = normalizeWikiSearchText(page.id);
	let score = 1;
	if (titleLower === queryLower) score += 50;
	else if (titleLower.includes(queryLower)) score += 20;
	if (pathLower.includes(queryLower)) score += 10;
	if (idLower.includes(queryLower)) score += 20;
	if (page.sourceIds.some((id) => normalizeWikiSearchText(id).includes(queryLower))) score += 12;
	const [bestMatchingClaim] = matchingClaims;
	if (bestMatchingClaim) {
		score += bestMatchingClaim.score;
		score += Math.min(10, (matchingClaims.length - 1) * 2);
	}
	score += scoreWikiSearchModeBoost({
		page,
		claims,
		matchingClaimCount: matchingClaims.length,
		queryLower,
		queryTokens,
		mode
	});
	if (!("raw" in page)) return score;
	const metadataLower = normalizeWikiSearchText(buildPageSearchText(page));
	const rawLower = normalizeWikiSearchText(buildSearchableBody(page.raw));
	const fields = [
		titleLower,
		pathLower,
		idLower,
		metadataLower,
		rawLower
	];
	const combinedLower = fields.join("\n");
	if (!fields.some((field) => field.includes(queryLower)) && !(queryTokens.length > 0 && queryTokens.every((token) => combinedLower.includes(token))) && !(mode === "route-question" && hasRouteQuestionMatch(buildRouteQuestionFields(page), queryLower))) return 0;
	score += Math.min(10, rawLower.split(queryLower).length - 1);
	for (const token of queryTokens) {
		if (titleLower.includes(token)) score += 8;
		if (pathLower.includes(token) || idLower.includes(token)) score += 6;
		if (metadataLower.includes(token)) score += 4;
		if (rawLower.includes(token)) score += 1;
	}
	return score;
}
function resolveExactWikiPagePath(lookup) {
	const normalized = normalizeLookupKey(lookup);
	const [directory, ...pageSegments] = normalized.split("/");
	if (!WIKI_PAGE_GROUPS.some(({ dir }) => dir === directory) || pageSegments.length === 0 || pageSegments.some((segment) => !segment || segment === "." || segment === "..") || !normalized.endsWith(".md") || path.posix.basename(normalized) === "index.md") return null;
	return normalized;
}
function isBridgeCompiledPage(page) {
	return page.sourceType === "memory-bridge" || page.sourceType === "memory-bridge-events" || page.bridgeAgentIds.length > 0;
}
function createWikiPageVisibilityFilter(params) {
	if (params.sandboxed !== true) return () => true;
	const sessionKey = params.agentSessionKey?.trim();
	const scopedAgentId = normalizeLowercaseStringOrEmpty(params.agentId?.trim() || (params.appConfig && sessionKey ? resolveSessionAgentIdStrict({
		sessionKey,
		config: params.appConfig
	}) : void 0));
	return (page) => !isBridgeCompiledPage(page) || scopedAgentId.length > 0 && page.bridgeAgentIds.some((agentId) => normalizeLowercaseStringOrEmpty(agentId) === scopedAgentId);
}
function shouldUseSharedMemory(config) {
	return config.search.backend === "shared" && (config.search.corpus === "memory" || config.search.corpus === "all");
}
function assertSessionVisibilityAppConfig(params) {
	if (shouldUseSharedMemory(params.config) && shouldEnforceSessionVisibility(params) && !params.appConfig) throw new Error(`${params.operation} requires appConfig to enforce session visibility for session-bound shared memory calls.`);
}
function shouldSearchWiki(config) {
	return config.search.corpus === "wiki" || config.search.corpus === "all";
}
function shouldSearchSharedMemory(config, appConfig) {
	return shouldUseSharedMemory(config) && appConfig !== void 0;
}
function applySearchOverrides(config, overrides) {
	if (!overrides?.searchBackend && !overrides?.searchCorpus) return config;
	return {
		...config,
		search: {
			backend: overrides.searchBackend ?? config.search.backend,
			corpus: overrides.searchCorpus ?? config.search.corpus
		}
	};
}
function buildWikiProvenanceLabel(page) {
	if (page.sourceType === "memory-bridge-events") return `bridge events: ${page.bridgeRelativePath ?? page.relativePath}`;
	if (page.sourceType === "memory-bridge") return `bridge: ${page.bridgeRelativePath ?? page.relativePath}`;
	if (page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") return `unsafe-local: ${page.unsafeLocalRelativePath ?? page.relativePath}`;
}
function buildWikiResultMetadata(page) {
	const provenanceLabel = buildWikiProvenanceLabel(page);
	return {
		...page.id ? { id: page.id } : {},
		...page.sourceType ? { sourceType: page.sourceType } : {},
		...page.provenanceMode ? { provenanceMode: page.provenanceMode } : {},
		...page.sourcePath ? { sourcePath: page.sourcePath } : {},
		...provenanceLabel ? { provenanceLabel } : {},
		...page.updatedAt ? { updatedAt: page.updatedAt } : {},
		...page.entityType ? { entityType: page.entityType } : {},
		...page.canonicalId ? { canonicalId: page.canonicalId } : {},
		...page.aliases.length > 0 ? { aliases: [...page.aliases] } : {},
		...page.privacyTier ? { privacyTier: page.privacyTier } : {}
	};
}
function toWikiSearchResult(page, query, mode) {
	const queryLower = normalizeWikiSearchText(query);
	const queryTokens = buildQueryTokens(queryLower);
	const matchingClaims = getMatchingClaims(page.claims, queryLower, queryTokens, (claim) => scoreClaimMatch({
		...claim,
		freshnessLevel: assessClaimFreshness({
			page,
			claim
		}).level,
		queryLower,
		queryTokens
	}));
	const matchingClaim = matchingClaims[0]?.claim;
	return {
		corpus: "wiki",
		path: page.relativePath,
		title: page.title,
		kind: page.kind,
		score: scorePage({
			page,
			claims: page.claims,
			matchingClaims,
			queryLower,
			queryTokens,
			mode
		}),
		snippet: truncateUtf16Safe(matchingClaim?.text ?? buildSnippet(page.raw, query), WIKI_SNIPPET_MAX_CHARS),
		searchMode: mode,
		...buildWikiResultMetadata(page),
		...matchingClaim ? {
			...matchingClaim.id ? { matchedClaimId: matchingClaim.id } : {},
			...matchingClaim.status ? { matchedClaimStatus: matchingClaim.status } : {},
			...typeof matchingClaim.confidence === "number" ? { matchedClaimConfidence: matchingClaim.confidence } : {},
			evidenceKinds: uniqueStrings(matchingClaim.evidence.flatMap((evidence) => evidence.kind ?? [])),
			evidenceSourceIds: uniqueStrings(matchingClaim.evidence.flatMap((evidence) => evidence.sourceId ?? []))
		} : {}
	};
}
async function searchWikiCorpus(params) {
	params.signal?.throwIfAborted();
	const snapshot = await loadMemoryWikiCompiledCache(params.config);
	const rootDir = params.config.vault.path;
	const candidatePaths = snapshot ? buildDigestCandidatePaths({
		snapshot,
		query: params.query,
		maxResults: params.maxResults,
		mode: params.mode
	}) : [];
	const candidatePages = candidatePaths.length > 0 ? await readQueryableWikiPagesByPaths(rootDir, candidatePaths, params.signal) : await readQueryableWikiPages(rootDir, params.signal);
	const results = [];
	const scorePages = async (pages) => {
		let index = 0;
		for (const page of pages) {
			if (params.signal && index++ % 16 === 0) await setImmediate();
			params.signal?.throwIfAborted();
			if (params.canReadPage(page)) {
				const result = toWikiSearchResult(page, params.query, params.mode);
				if (result.score > 0) results.push(result);
			}
		}
	};
	await scorePages(candidatePages);
	if (candidatePaths.length === 0 || results.length >= params.maxResults) return results;
	const seenPaths = new Set(candidatePages.map((page) => page.relativePath));
	await scorePages(await readQueryableWikiPagesByPaths(rootDir, (await listWikiMarkdownFiles(rootDir)).filter((relativePath) => !seenPaths.has(relativePath)), params.signal));
	return results;
}
async function readExactWikiPage(rootDir, lookup) {
	const relativePath = resolveExactWikiPagePath(lookup);
	if (!relativePath) return null;
	return (await readQueryableWikiPagesByPaths(rootDir, [relativePath]))[0] ?? null;
}
async function searchMemoryWiki(input) {
	input.signal?.throwIfAborted();
	const agentId = resolveActiveMemoryAgentId(input);
	const params = agentId ? {
		...input,
		agentId
	} : input;
	const protectedSessionRecall = params.conversationRecall?.corpus === "sessions";
	const effectiveConfig = applySearchOverrides(params.config, protectedSessionRecall ? {
		searchBackend: params.config.search.backend,
		searchCorpus: "memory"
	} : params);
	assertSessionVisibilityAppConfig({
		...params,
		config: effectiveConfig,
		operation: "wiki_search"
	});
	await initializeMemoryWikiVault(effectiveConfig, params.signal ? { signal: params.signal } : void 0);
	const maxResults = resolveIntegerOption(params.maxResults, 10, { min: 1 });
	const mode = params.mode ?? "auto";
	const wikiResults = shouldSearchWiki(effectiveConfig) ? await searchWikiCorpus({
		config: effectiveConfig,
		query: params.query,
		maxResults,
		mode,
		canReadPage: createWikiPageVisibilityFilter(params),
		signal: params.signal
	}) : [];
	params.signal?.throwIfAborted();
	return mergeWikiSearchCorpusResults({
		wikiResults,
		memoryResults: shouldSearchSharedMemory(effectiveConfig, params.appConfig) ? await searchSharedMemory(params, {
			maxResults,
			mode,
			protectedSessionRecall
		}) : [],
		maxResults,
		balanceCorpora: effectiveConfig.search.corpus === "all"
	});
}
async function getMemoryWikiPage(input) {
	const agentId = resolveActiveMemoryAgentId(input);
	const params = agentId ? {
		...input,
		agentId
	} : input;
	const effectiveConfig = applySearchOverrides(params.config, params);
	assertSessionVisibilityAppConfig({
		...params,
		config: effectiveConfig,
		operation: "wiki_get"
	});
	await initializeMemoryWikiVault(effectiveConfig);
	const fromLine = resolveIntegerOption(params.fromLine, 1, { min: 1 });
	const lineCount = resolveIntegerOption(params.lineCount, 200, { min: 1 });
	const sharedMemory = shouldSearchSharedMemory(effectiveConfig, params.appConfig);
	const reference = sharedMemory && isMemoryReferenceLookup(params.lookup) && await usesNativeMemoryProvider(params) ? parseMemoryReferenceLookup(params.lookup) : null;
	if (!reference && shouldSearchWiki(effectiveConfig)) {
		const canReadPage = createWikiPageVisibilityFilter(params);
		const digest = await loadMemoryWikiCompiledCache(effectiveConfig);
		const claimId = params.lookup.trim().replace(/^claim:/i, "");
		const digestClaimPagePath = digest?.claims.find((claim) => claim.id === claimId)?.pagePath;
		const page = (digestClaimPagePath ? (await readQueryableWikiPagesByPaths(effectiveConfig.vault.path, [digestClaimPagePath])).find(canReadPage) ?? null : null) ?? await resolveQueryableWikiPageForLookup({
			lookup: params.lookup,
			readExactPage: () => readExactWikiPage(effectiveConfig.vault.path, params.lookup),
			listFiles: () => listWikiMarkdownFiles(effectiveConfig.vault.path),
			readPages: (relativePaths) => readQueryableWikiPagesByPaths(effectiveConfig.vault.path, relativePaths),
			canReadPage
		});
		if (page) {
			const lines = page.parsed.body.split(/\r?\n/);
			const totalLines = lines.length;
			const slice = lines.slice(fromLine - 1, fromLine - 1 + lineCount).join("\n");
			const truncated = fromLine - 1 + lineCount < totalLines;
			return {
				corpus: "wiki",
				path: page.relativePath,
				title: page.title,
				kind: page.kind,
				content: slice,
				fromLine,
				lineCount,
				totalLines,
				truncated,
				...buildWikiResultMetadata(page)
			};
		}
	}
	if (!sharedMemory) return null;
	return await readSharedMemoryPage({
		...params,
		fromLine,
		lineCount
	}, reference);
}
//#endregion
//#region extensions/memory-wiki/src/compile-dashboards.ts
function renderCountedList(label, lines, emptyText, separator = "\n\n") {
	return lines.length === 0 ? `- ${emptyText}` : [`- ${label}: ${lines.length}`, lines.join("\n")].join(separator);
}
function renderReportSection(heading, lines) {
	return lines.length > 0 ? [
		"",
		`### ${heading}`,
		...lines
	] : [];
}
function renderCountedSections(emptyText, sections) {
	return sections.every((section) => section[2].length === 0) ? `- ${emptyText}` : [...sections.map(([label, , lines]) => `- ${label}: ${lines.length}`), ...sections.flatMap(([, heading, lines]) => renderReportSection(heading, lines))].join("\n");
}
const DASHBOARD_PAGES = {
	"open-questions": {
		title: "Open Questions",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			return renderCountedList("Pages with open questions", pages.filter((page) => page.questions.length > 0).map((page) => `- ${formatPageLink(config, page, sourceRelativeTo)}: ${page.questions.join(" | ")}`), "No open questions right now.");
		}
	},
	contradictions: {
		title: "Contradictions",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			return renderCountedSections("No contradictions flagged right now.", [[
				"Contradiction note clusters",
				"Page Notes",
				buildPageContradictionClusters(pages).map((cluster) => formatPageContradictionClusterLine(config, cluster, sourceRelativeTo))
			], [
				"Competing claim clusters",
				"Claim Clusters",
				buildClaimContradictionClusters({
					pages,
					now
				}).map((cluster) => formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo))
			]]);
		}
	},
	"low-confidence": {
		title: "Low Confidence",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const pageMatches = pages.filter((page) => typeof page.confidence === "number" && page.confidence < .5).toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
			const claimMatches = collectWikiClaimHealth(pages, now).filter((claim) => typeof claim.confidence === "number" && claim.confidence < .5).toSorted((left, right) => (left.confidence ?? 1) - (right.confidence ?? 1));
			return renderCountedSections("No low-confidence pages or claims right now.", [[
				"Low-confidence pages",
				"Pages",
				pageMatches.map((page) => `- ${formatPageLink(config, page, sourceRelativeTo)}: confidence ${(page.confidence ?? 0).toFixed(2)}`)
			], [
				"Low-confidence claims",
				"Claims",
				claimMatches.map((claim) => `- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`)
			]]);
		}
	},
	"claim-health": {
		title: "Claim Health",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			const claimHealth = collectWikiClaimHealth(pages, now);
			const missingEvidence = claimHealth.filter((claim) => claim.missingEvidence);
			const contestedClaims = claimHealth.filter((claim) => isClaimContestedStatus(claim.status));
			const staleClaims = claimHealth.filter((claim) => claim.freshness.level === "stale" || claim.freshness.level === "unknown");
			const claimLines = (claims) => claims.map((claim) => `- ${formatClaimHealthLine(config, claim, sourceRelativeTo)}`);
			return renderCountedSections("No claim health issues right now.", [
				[
					"Claims missing evidence",
					"Missing Evidence",
					claimLines(missingEvidence)
				],
				[
					"Contested claims",
					"Contested Claims",
					claimLines(contestedClaims)
				],
				[
					"Stale or unknown claims",
					"Stale Claims",
					claimLines(staleClaims)
				]
			]);
		}
	},
	"stale-pages": {
		title: "Stale Pages",
		buildBody: ({ config, managedImportedSourcePagePaths, pages, now, sourceRelativeTo }) => {
			return renderCountedList("Stale pages", pages.filter((page) => page.kind !== "report" && page.kind !== "concept" && page.kind !== "synthesis" && !(isUnmanagedRawSourceSummary(page) && !managedImportedSourcePagePaths.has(page.relativePath))).flatMap((page) => {
				const freshness = assessPageFreshness(page, now);
				if (freshness.level === "fresh") return [];
				return [{
					page,
					freshness
				}];
			}).toSorted((left, right) => left.page.title.localeCompare(right.page.title)).map(({ page, freshness }) => `- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatFreshnessLabel(freshness)}`), `No aging or stale pages older than 30 days.`);
		}
	},
	"person-agent-directory": {
		title: "Person Agent Directory",
		buildBody: ({ config, pages, now, sourceRelativeTo }) => {
			return renderCountedList("People with routing metadata", pages.filter((page) => page.kind !== "report" && isPersonLikePage(page)).toSorted((left, right) => left.title.localeCompare(right.title)).map((page) => `- ${formatPersonDirectoryLine(config, page, assessPageFreshness(page, now), sourceRelativeTo)}`), "No person-like entity pages with agent cards yet.", "\n");
		}
	},
	"relationship-graph": {
		title: "Relationship Graph",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			return renderCountedList("Structured relationships", pages.flatMap((page) => page.relationships.map((relationship) => ({
				page,
				relationship
			}))).toSorted((left, right) => {
				const leftTitle = left.relationship.targetTitle ?? left.relationship.targetId ?? "";
				const rightTitle = right.relationship.targetTitle ?? right.relationship.targetId ?? "";
				return `${left.page.title} ${leftTitle}`.localeCompare(`${right.page.title} ${rightTitle}`);
			}).map(({ page, relationship }) => `- ${formatRelationshipLine(config, page, relationship, sourceRelativeTo)}`), "No structured relationships yet.");
		}
	},
	"provenance-coverage": {
		title: "Provenance Coverage",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			const evidenceEntries = pages.flatMap((page) => page.claims.flatMap((claim) => claim.evidence.map((evidence) => ({
				page,
				claim,
				evidence
			}))));
			const missingEvidence = pages.flatMap((page) => page.claims.filter((claim) => claim.evidence.length === 0).map((claim) => ({
				page,
				claim
			})));
			if (evidenceEntries.length === 0 && missingEvidence.length === 0) return "- No structured claims with provenance coverage yet.";
			const kindCounts = countBy(evidenceEntries.map(({ evidence }) => evidence.kind ?? "unspecified"));
			const sourceCounts = countBy(evidenceEntries.map(({ evidence }) => evidence.sourceId ?? evidence.path ?? "inline"));
			return [
				`- Evidence entries: ${evidenceEntries.length}`,
				`- Claims missing evidence: ${missingEvidence.length}`,
				...renderReportSection("Evidence Classes", formatCountLines(kindCounts)),
				...renderReportSection("Top Evidence Sources", formatCountLines(sourceCounts).slice(0, 20)),
				...renderReportSection("Missing Evidence", missingEvidence.map(({ page, claim }) => `- ${formatPageLink(config, page, sourceRelativeTo)}: ${formatClaimIdentityForPage(claim)}`))
			].join("\n");
		}
	},
	"privacy-review": {
		title: "Privacy Review",
		buildBody: ({ config, pages, sourceRelativeTo }) => {
			return renderCountedList("Privacy review entries", collectPrivacyReviewEntries(config, pages, sourceRelativeTo), "No non-public privacy tiers flagged right now.");
		}
	}
};
function formatPageLink(config, page, sourceRelativeTo) {
	return formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: page.relativePath,
		sourceRelativeTo,
		title: page.title
	});
}
function formatFreshnessLabel(freshness) {
	return freshness.level === "unknown" ? freshness.reason : `${freshness.level} (${freshness.lastTouchedAt ?? (freshness.level === "fresh" ? "recent" : "unknown")})`;
}
function formatListPreview(values, maxItems = 3) {
	if (values.length === 0) return null;
	const shown = values.slice(0, maxItems).join(", ");
	return values.length > maxItems ? `${shown}, +${values.length - maxItems}` : shown;
}
function formatMaybeDetail(label, value) {
	return value ? `${label} ${value}` : null;
}
function formatPersonDirectoryLine(config, page, freshness, sourceRelativeTo) {
	const card = page.personCard;
	const details = [
		formatMaybeDetail("id", page.canonicalId ?? card?.canonicalId ?? page.id),
		formatMaybeDetail("aliases", formatListPreview(page.aliases)),
		formatMaybeDetail("handles", formatListPreview(card?.handles ?? [])),
		formatMaybeDetail("lane", card?.lane),
		formatMaybeDetail("ask", formatListPreview(card?.askFor ?? [])),
		formatMaybeDetail("best", formatListPreview([...page.bestUsedFor, ...card?.bestUsedFor ?? []])),
		formatMaybeDetail("privacy", page.privacyTier ?? card?.privacyTier),
		formatMaybeDetail("refreshed", page.lastRefreshedAt ?? card?.lastRefreshedAt),
		formatMaybeDetail("freshness", formatFreshnessLabel(freshness))
	].filter(Boolean);
	return `${formatPageLink(config, page, sourceRelativeTo)}${details.length > 0 ? `: ${details.join("; ")}` : ""}`;
}
function formatRelationshipTarget(config, relationship, sourceRelativeTo) {
	if (relationship.targetPath && relationship.targetTitle) return formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: relationship.targetPath,
		sourceRelativeTo,
		title: relationship.targetTitle
	});
	return relationship.targetTitle ?? relationship.targetId ?? relationship.targetPath ?? "unknown";
}
function formatRelationshipLine(config, page, relationship, sourceRelativeTo) {
	const details = [
		relationship.kind ?? "related",
		typeof relationship.weight === "number" ? `weight ${relationship.weight.toFixed(2)}` : null,
		typeof relationship.confidence === "number" ? `confidence ${relationship.confidence.toFixed(2)}` : null,
		relationship.evidenceKind ? `evidence ${relationship.evidenceKind}` : null,
		relationship.privacyTier ? `privacy ${relationship.privacyTier}` : null,
		relationship.note
	].filter(Boolean);
	return `${formatPageLink(config, page, sourceRelativeTo)} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}${details.length > 0 ? ` (${details.join(", ")})` : ""}`;
}
function countBy(values) {
	const counts = /* @__PURE__ */ new Map();
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	return counts;
}
function formatCountLines(counts) {
	const lines = [...counts].toSorted((left, right) => {
		return right[1] - left[1] || left[0].localeCompare(right[0]);
	}).map(([label, count]) => `- ${label}: ${count}`);
	return lines.length > 0 ? lines : ["- None"];
}
function formatClaimIdentityForPage(claim) {
	return claim.id ? `\`${claim.id}\`: ${claim.text}` : claim.text;
}
function isReviewablePrivacyTier(value) {
	const tier = normalizeLowercaseStringOrEmpty(value);
	return tier !== "" && tier !== "public";
}
function formatEvidencePrivacyDetails(evidence) {
	return [
		evidence.kind ? `kind ${evidence.kind}` : null,
		evidence.sourceId ? `source ${evidence.sourceId}` : null,
		evidence.path ? `path ${evidence.path}` : null,
		evidence.lines ? `lines ${evidence.lines}` : null
	].filter(Boolean).join(", ");
}
function collectPrivacyReviewEntries(config, pages, sourceRelativeTo) {
	const entries = [];
	for (const page of pages) {
		if (isReviewablePrivacyTier(page.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: page privacy ${page.privacyTier}`);
		if (isReviewablePrivacyTier(page.personCard?.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: person card privacy ${page.personCard?.privacyTier}`);
		for (const relationship of page.relationships) if (isReviewablePrivacyTier(relationship.privacyTier)) entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: relationship privacy ${relationship.privacyTier} -> ${formatRelationshipTarget(config, relationship, sourceRelativeTo)}`);
		for (const claim of page.claims) for (const evidence of claim.evidence) {
			if (!isReviewablePrivacyTier(evidence.privacyTier)) continue;
			const detail = formatEvidencePrivacyDetails(evidence);
			entries.push(`- ${formatPageLink(config, page, sourceRelativeTo)}: evidence privacy ${evidence.privacyTier} on ${formatClaimIdentityForPage(claim)}${detail ? ` (${detail})` : ""}`);
		}
	}
	return entries;
}
function formatClaimIdentity(claim) {
	return claim.claimId ? `\`${claim.claimId}\`: ${claim.text}` : claim.text;
}
function formatClaimHealthLine(config, claim, sourceRelativeTo) {
	const details = [
		`status ${claim.status}`,
		typeof claim.confidence === "number" ? `confidence ${claim.confidence.toFixed(2)}` : null,
		claim.missingEvidence ? "missing evidence" : `${claim.evidenceCount} evidence`,
		formatFreshnessLabel(claim.freshness)
	].filter(Boolean);
	return `${formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: claim.pagePath,
		sourceRelativeTo,
		title: claim.pageTitle
	})}: ${formatClaimIdentity(claim)} (${details.join(", ")})`;
}
function formatPageContradictionClusterLine(config, cluster, sourceRelativeTo) {
	const pageRefs = cluster.entries.map((entry) => formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: entry.pagePath,
		sourceRelativeTo,
		title: entry.pageTitle
	}));
	return `- ${cluster.label}: ${pageRefs.join(" | ")}`;
}
function formatClaimContradictionClusterLine(config, cluster, sourceRelativeTo) {
	const entries = cluster.entries.map((entry) => `${formatWikiLink({
		renderMode: config.vault.renderMode,
		relativePath: entry.pagePath,
		sourceRelativeTo,
		title: entry.pageTitle
	})} -> ${formatClaimIdentity(entry)} (${entry.status}, ${formatFreshnessLabel(entry.freshness)})`);
	return `- \`${cluster.label}\`: ${entries.join(" | ")}`;
}
//#endregion
//#region extensions/memory-wiki/src/import-insights.ts
function normalizeStringArray(value) {
	return filterStringEntries(value).filter((entry) => entry.trim().length > 0);
}
function humanizeLabelSuffix(label) {
	return (label.includes("/") ? label.split("/").slice(1).join("/") : label).split(/[/-]/g).filter((part) => part.length > 0).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function resolveTopic(labels) {
	const preferred = labels.find((label) => label.startsWith("topic/")) ?? labels.find((label) => label.startsWith("area/")) ?? labels.find((label) => label.startsWith("domain/")) ?? "topic/other";
	return {
		key: preferred,
		label: humanizeLabelSuffix(preferred)
	};
}
function extractHeadingSection(body, heading) {
	const lines = body.split(/\r?\n/);
	const headingLine = `## ${heading}`;
	const startIndex = lines.findIndex((line) => line.trim() === headingLine);
	if (startIndex < 0) return [];
	const section = [];
	for (const line of lines.slice(startIndex + 1)) {
		if (line.startsWith("## ")) break;
		if (line.trim().length > 0) section.push(line.trimEnd());
	}
	return section;
}
function extractDigestField(lines, prefix) {
	const needle = `- ${prefix}:`;
	const line = lines.find((entry) => entry.startsWith(needle));
	if (!line) return;
	const value = line.slice(needle.length).trim();
	return value.length > 0 ? value : void 0;
}
function extractIntegerField(lines, prefix) {
	const match = extractDigestField(lines, prefix)?.match(/\d+/);
	return match ? resolveNonNegativeIntegerOption(Number(match[0]), 0) : 0;
}
function extractPreferenceSignals(lines) {
	const startIndex = lines.findIndex((line) => line.startsWith("- Preference signals:"));
	if (startIndex < 0) return [];
	if (lines[startIndex]?.includes("none detected")) return [];
	const signals = [];
	for (const line of lines.slice(startIndex + 1)) {
		const trimmed = line.trim();
		if (!trimmed.startsWith("- ")) break;
		const signal = trimmed.slice(2).trim();
		if (signal.length > 0) signals.push(signal);
	}
	return signals;
}
function parseTranscriptTurns(body) {
	const blocks = [];
	for (const line of extractHeadingSection(body, "Active Branch Transcript")) {
		const heading = line.trim();
		if (heading === "### User" || heading === "### Assistant") blocks.push({
			role: heading === "### User" ? "user" : "assistant",
			lines: []
		});
		else blocks.at(-1)?.lines.push(line);
	}
	return blocks.map(({ role, lines }) => ({
		role,
		text: lines.join("\n").trim()
	})).filter((turn) => turn.text.length > 0);
}
function firstParagraph(text) {
	return text.split(/\n\s*\n/).map((entry) => entry.trim()).find((entry) => entry.length > 0);
}
function shortenSentence(value, maxLength = 180) {
	const compact = value.replace(/\s+/g, " ").trim();
	if (compact.length <= maxLength) return compact;
	return `${truncateUtf16Safe(compact, maxLength - 1).trimEnd()}…`;
}
function extractCorrectionSignals(turns) {
	const correctionPatterns = [
		"you're right",
		"you’re right",
		"bad assumption",
		"let's reset",
		"let’s reset",
		"does not exist anymore",
		"that was a bad assumption",
		"what actually works today"
	];
	return turns.filter((turn) => turn.role === "assistant").flatMap((turn) => {
		const first = firstParagraph(turn.text);
		if (!first) return [];
		const normalized = first.toLowerCase();
		return correctionPatterns.some((pattern) => normalized.includes(pattern)) ? [shortenSentence(first, 160)] : [];
	}).slice(0, 2);
}
function deriveSummary(params) {
	if (params.digestStatus === "withheld") {
		if (params.riskReasons.length > 0) return `Sensitive ${params.topicLabel.toLowerCase()} chat withheld from durable-memory extraction because it touches ${params.riskReasons.join(", ")}.`;
		return `Sensitive ${params.topicLabel.toLowerCase()} chat withheld from durable-memory extraction pending review.`;
	}
	const content = params.assistantOpener || params.firstUserLine;
	return content ? shortenSentence(content) : params.title;
}
function normalizeRiskLevel(value) {
	if (value === "low" || value === "medium" || value === "high") return value;
	return "unknown";
}
function compareItemsByUpdated(left, right) {
	const leftKey = left.updatedAt ?? left.createdAt ?? "";
	const rightKey = right.updatedAt ?? right.createdAt ?? "";
	if (rightKey !== leftKey) return rightKey.localeCompare(leftKey);
	return left.title.localeCompare(right.title);
}
function capStrings(values, maxItems, maxChars) {
	return values.slice(0, maxItems).map((value) => shortenSentence(value, maxChars));
}
function capImportInsightItem(item) {
	return {
		...item,
		title: shortenSentence(item.title, 240),
		riskReasons: capStrings(item.riskReasons, 8, 120),
		labels: capStrings(item.labels, 8, 120),
		topicKey: shortenSentence(item.topicKey, 120),
		topicLabel: shortenSentence(item.topicLabel, 120),
		...item.firstUserLine ? { firstUserLine: shortenSentence(item.firstUserLine, 240) } : {},
		...item.lastUserLine ? { lastUserLine: shortenSentence(item.lastUserLine, 240) } : {},
		...item.assistantOpener ? { assistantOpener: shortenSentence(item.assistantOpener, 240) } : {},
		summary: shortenSentence(item.summary, 180),
		candidateSignals: capStrings(item.candidateSignals, 4, 240),
		correctionSignals: capStrings(item.correctionSignals, 2, 160),
		preferenceSignals: capStrings(item.preferenceSignals, 8, 240),
		...item.createdAt ? { createdAt: shortenSentence(item.createdAt, 64) } : {},
		...item.updatedAt ? { updatedAt: shortenSentence(item.updatedAt, 64) } : {}
	};
}
function projectMemoryWikiImportInsight(page, parsed) {
	if (page.pageType !== "source" || parsed.frontmatter.sourceType !== "chatgpt-export") return null;
	const labels = normalizeStringArray(parsed.frontmatter.labels);
	const topic = resolveTopic(labels);
	const triageLines = extractHeadingSection(parsed.body, "Auto Triage");
	const digestLines = extractHeadingSection(parsed.body, "Auto Digest");
	const transcriptTurns = parseTranscriptTurns(parsed.body);
	const digestStatus = digestLines.some((line) => line.toLowerCase().includes("withheld from durable-candidate generation")) ? "withheld" : "available";
	const exposeImportContent = digestStatus === "available";
	const userTurns = transcriptTurns.filter((turn) => turn.role === "user");
	const assistantTurns = transcriptTurns.filter((turn) => turn.role === "assistant");
	const assistantOpener = exposeImportContent ? firstParagraph(assistantTurns[0]?.text ?? "") : void 0;
	const correctionSignals = exposeImportContent ? extractCorrectionSignals(transcriptTurns) : [];
	const preferenceSignals = exposeImportContent ? extractPreferenceSignals(digestLines) : [];
	const candidateSignals = exposeImportContent ? [.../* @__PURE__ */ new Set([...preferenceSignals, ...correctionSignals.map((correction) => `Correction detected: ${correction}`)])].slice(0, 4) : [];
	const firstUserLine = exposeImportContent ? extractDigestField(digestLines, "First user line") : void 0;
	const lastUserLine = exposeImportContent ? extractDigestField(digestLines, "Last user line") : void 0;
	const createdAt = normalizeOptionalString(parsed.frontmatter.createdAt);
	const updatedAt = normalizeOptionalString(parsed.frontmatter.updatedAt);
	const title = page.title.replace(/^ChatGPT Export:\s*/i, "");
	const riskReasons = normalizeStringArray(parsed.frontmatter.riskReasons);
	return {
		pagePath: page.relativePath,
		title,
		riskLevel: normalizeRiskLevel(parsed.frontmatter.riskLevel),
		riskReasons,
		labels,
		topicKey: topic.key,
		topicLabel: topic.label,
		digestStatus,
		activeBranchMessages: extractIntegerField(triageLines, "Active-branch messages"),
		userMessageCount: Math.max(extractIntegerField(digestLines, "User messages"), userTurns.length),
		assistantMessageCount: Math.max(extractIntegerField(digestLines, "Assistant messages"), assistantTurns.length),
		...firstUserLine ? { firstUserLine } : {},
		...lastUserLine ? { lastUserLine } : {},
		...assistantOpener ? { assistantOpener } : {},
		summary: deriveSummary({
			title,
			digestStatus,
			assistantOpener,
			firstUserLine,
			riskReasons,
			topicLabel: topic.label
		}),
		candidateSignals,
		correctionSignals,
		preferenceSignals,
		...createdAt ? { createdAt } : {},
		...updatedAt ? { updatedAt } : {}
	};
}
function buildMemoryWikiImportInsights(input) {
	const allItems = input.map(capImportInsightItem).toSorted(compareItemsByUpdated);
	const items = allItems.slice(0, MEMORY_WIKI_DASHBOARD_ITEM_LIMIT);
	const clustersByKey = /* @__PURE__ */ new Map();
	for (const item of items) {
		const list = clustersByKey.get(item.topicKey) ?? [];
		list.push(item);
		clustersByKey.set(item.topicKey, list);
	}
	const clusters = [...clustersByKey.entries()].map(([key, clusterItems]) => {
		const updatedAt = clusterItems.map((item) => item.updatedAt ?? item.createdAt).find((value) => typeof value === "string" && value.length > 0);
		return Object.assign({
			key,
			label: clusterItems[0]?.topicLabel ?? humanizeLabelSuffix(key),
			itemCount: clusterItems.length,
			highRiskCount: clusterItems.filter((item) => item.riskLevel === `high`).length,
			withheldCount: clusterItems.filter((item) => item.digestStatus === `withheld`).length,
			preferenceSignalCount: clusterItems.reduce((sum, item) => sum + item.preferenceSignals.length, 0)
		}, updatedAt ? { updatedAt } : {}, { items: clusterItems });
	}).toSorted((left, right) => {
		const leftKey = left.updatedAt ?? "";
		const rightKey = right.updatedAt ?? "";
		if (rightKey !== leftKey) return rightKey.localeCompare(leftKey);
		if (right.itemCount !== left.itemCount) return right.itemCount - left.itemCount;
		return left.label.localeCompare(right.label);
	});
	return {
		sourceType: "chatgpt",
		totalItems: allItems.length,
		totalClusters: new Set(allItems.map((item) => item.topicKey)).size,
		clusters,
		truncated: items.length < allItems.length
	};
}
//#endregion
//#region extensions/memory-wiki/src/mutation-coordinator.ts
const activeVaultMutations = new AsyncLocalStorage();
const vaultMutationQueue = new KeyedAsyncQueue();
const MAX_CACHED_VAULT_KEYS = 256;
const canonicalVaultKeys = /* @__PURE__ */ new Map();
function normalizeCanonicalVaultKey(vaultPath) {
	return process.platform === "win32" ? vaultPath.toLowerCase() : vaultPath;
}
async function resolveCanonicalVaultKey(resolvedPath) {
	const suffix = [];
	let candidate = resolvedPath;
	while (true) try {
		const existingPath = await fs$1.realpath(candidate);
		return normalizeCanonicalVaultKey(path.join(existingPath, ...suffix));
	} catch (error) {
		const code = error.code;
		const parent = path.dirname(candidate);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parent === candidate) return normalizeCanonicalVaultKey(resolvedPath);
		suffix.unshift(path.basename(candidate));
		candidate = parent;
	}
}
async function resolveMemoryWikiVaultMutationKey(vaultPath) {
	const resolvedPath = path.resolve(vaultPath);
	const cached = canonicalVaultKeys.get(resolvedPath);
	if (cached) return await cached;
	const canonical = resolveCanonicalVaultKey(resolvedPath);
	if (canonicalVaultKeys.size >= MAX_CACHED_VAULT_KEYS) {
		const oldest = canonicalVaultKeys.keys().next().value;
		if (oldest) canonicalVaultKeys.delete(oldest);
	}
	canonicalVaultKeys.set(resolvedPath, canonical);
	return await canonical;
}
/**
* Keep coordinated vault read-modify-write transactions isolated from concurrent work in this process.
* Nested compile calls re-enter; different agent vaults remain parallel.
*/
async function withMemoryWikiVaultMutation(vaultPath, mutation) {
	const key = await resolveMemoryWikiVaultMutationKey(vaultPath);
	const active = activeVaultMutations.getStore();
	if (active?.get(key)?.active) return await mutation();
	const lease = { active: true };
	const nextActive = new Map(active ?? []);
	nextActive.set(key, lease);
	return await vaultMutationQueue.enqueue(key, async () => {
		try {
			return await activeVaultMutations.run(nextActive, mutation);
		} finally {
			lease.active = false;
		}
	});
}
//#endregion
//#region extensions/memory-wiki/src/vault-page-write.ts
const isConcurrentRewriteRace = (error) => error instanceof FsSafeError && error.code === "path-mismatch";
async function readWikiPageStat(vault, pagePath) {
	return vault.stat(pagePath).catch((error) => {
		if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias")) return null;
		throw error;
	});
}
async function readExistingWikiPage(read, emptyOn, fallback = () => "") {
	try {
		return await read();
	} catch {
		try {
			return await read();
		} catch (error) {
			if (emptyOn(error)) return fallback();
			throw error;
		}
	}
}
function readExistingWikiPageUtf8(vault, relativePath, fallback) {
	return readExistingWikiPage(async () => decodeWikiPageUtf8(await vault.readBytes(relativePath), relativePath), (error) => error instanceof FsSafeError && error.code === "not-found", fallback);
}
async function writeGuardedVaultPage(params) {
	try {
		await retryAsync(async () => {
			if (params.pageStat?.isFile && params.pageStat.nlink > 1) await params.vault.remove(params.pagePath);
			await params.vault.write(params.pagePath, params.content);
		}, {
			attempts: 3,
			minDelayMs: 25,
			maxDelayMs: 50,
			label: `memory-wiki write ${params.pageLabel} ${params.pagePath}`,
			shouldRetry: isConcurrentRewriteRace
		});
	} catch (error) {
		if (error instanceof FsSafeError) {
			if (error.code !== "symlink" && error.code !== "path-alias") throw new Error(`Refusing to write ${params.pageLabel} (${error.code}): ${params.pagePath}: ${error.message}`, { cause: error });
			throw new Error(`Refusing to write ${params.pageLabel} through symlink: ${params.pagePath}`, { cause: error });
		}
		throw error;
	}
}
//#endregion
//#region extensions/memory-wiki/src/wiki-overview.ts
const OVERVIEW_KIND_ORDER = [
	"synthesis",
	"entity",
	"concept",
	"source",
	"report"
];
const PRIMARY_OVERVIEW_KINDS = /* @__PURE__ */ new Set([
	"synthesis",
	"entity",
	"concept"
]);
const OVERVIEW_KIND_LABELS = {
	synthesis: "Syntheses",
	entity: "Entities",
	concept: "Concepts",
	source: "Sources",
	report: "Reports"
};
const EMPTY_OVERVIEW_PAGE_COUNTS = {
	synthesis: 0,
	entity: 0,
	concept: 0,
	source: 0,
	report: 0
};
function capOverviewText(value, maxChars = 240) {
	return truncateUtf16Safe(value.replace(/\s+/g, " ").trim(), maxChars);
}
function capOverviewItem(item) {
	return {
		...item,
		title: capOverviewText(item.title, 240),
		...item.id ? { id: capOverviewText(item.id, 240) } : {},
		...item.updatedAt ? { updatedAt: capOverviewText(item.updatedAt, 64) } : {},
		...item.sourceType ? { sourceType: capOverviewText(item.sourceType, 120) } : {},
		claims: item.claims.slice(0, 3).map((value) => capOverviewText(value)),
		questions: item.questions.slice(0, 3).map((value) => capOverviewText(value)),
		contradictions: item.contradictions.slice(0, 3).map((value) => capOverviewText(value)),
		...item.snippet ? { snippet: capOverviewText(item.snippet, 700) } : {}
	};
}
function extractSnippet(body) {
	const prefixes = [
		"#",
		"```",
		"<!--",
		"- ",
		"* "
	];
	for (const rawLine of body.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (line && !prefixes.some((prefix) => line.startsWith(prefix))) return line;
	}
}
function compareOverviewItems(left, right) {
	const leftKey = left.updatedAt ?? "";
	const rightKey = right.updatedAt ?? "";
	if (rightKey !== leftKey) return rightKey.localeCompare(leftKey);
	if (right.claimCount !== left.claimCount) return right.claimCount - left.claimCount;
	return left.title.localeCompare(right.title);
}
function projectMemoryWikiOverviewItem(page, body) {
	const updatedAt = normalizeOptionalString(page.updatedAt);
	const sourceType = normalizeOptionalString(page.sourceType);
	const snippet = extractSnippet(body);
	return {
		pagePath: page.relativePath,
		title: page.title,
		kind: page.kind,
		...page.id ? { id: page.id } : {},
		...updatedAt ? { updatedAt } : {},
		...sourceType ? { sourceType } : {},
		claimCount: page.claims.length,
		questionCount: page.questions.length,
		contradictionCount: page.contradictions.length,
		claims: page.claims.map((claim) => claim.text).slice(0, 3),
		questions: page.questions.slice(0, 3),
		contradictions: page.contradictions.slice(0, 3),
		...snippet ? { snippet } : {}
	};
}
function buildMemoryWikiOverview(pages, projectedItems) {
	const pageCounts = pages.reduce((counts, page) => {
		counts[page.kind] += 1;
		return counts;
	}, { ...EMPTY_OVERVIEW_PAGE_COUNTS });
	const totalClaims = pages.reduce((sum, page) => sum + page.claims.length, 0);
	const totalQuestions = pages.reduce((sum, page) => sum + page.questions.length, 0);
	const totalContradictions = pages.reduce((sum, page) => sum + page.contradictions.length, 0);
	const allItems = projectedItems.map(capOverviewItem).filter((item) => PRIMARY_OVERVIEW_KINDS.has(item.kind) || item.claimCount > 0 || item.questionCount > 0 || item.contradictionCount > 0).toSorted(compareOverviewItems);
	const items = allItems.slice(0, MEMORY_WIKI_DASHBOARD_ITEM_LIMIT);
	const clusters = OVERVIEW_KIND_ORDER.map((kind) => {
		const clusterItems = items.filter((item) => item.kind === kind);
		if (clusterItems.length === 0) return null;
		return Object.assign({
			key: kind,
			label: OVERVIEW_KIND_LABELS[kind],
			itemCount: clusterItems.length,
			claimCount: clusterItems.reduce((sum, item) => sum + item.claimCount, 0),
			questionCount: clusterItems.reduce((sum, item) => sum + item.questionCount, 0),
			contradictionCount: clusterItems.reduce((sum, item) => sum + item.contradictionCount, 0)
		}, clusterItems[0]?.updatedAt ? { updatedAt: clusterItems[0].updatedAt } : {}, { items: clusterItems });
	}).filter((entry) => entry !== null);
	return {
		totalItems: allItems.length,
		totalPages: pages.length,
		pageCounts,
		totalClaims,
		totalQuestions,
		totalContradictions,
		clusters,
		truncated: items.length < allItems.length
	};
}
//#endregion
//#region extensions/memory-wiki/src/compile.ts
const READ_PAGE_SUMMARIES_CONCURRENCY = 16;
const MAX_RELATED_PAGES_PER_SECTION = 12;
const MAX_SHARED_SOURCE_FANOUT = 24;
async function readPageSummaries(rootDir, signal) {
	const filePaths = (await Promise.all(WIKI_PAGE_GROUPS.map(async (group) => (await listMemoryWikiPagePaths(rootDir, group.dir)).toSorted((left, right) => left.localeCompare(right))))).flat();
	signal?.throwIfAborted();
	const readResult = await runTasksWithConcurrency({
		tasks: filePaths.map((relativePath) => async () => {
			signal?.throwIfAborted();
			const absolutePath = path.join(rootDir, relativePath);
			const raw = await retryTransientMemoryRead(() => fs$1.readFile(absolutePath, "utf8"), `read wiki page ${absolutePath}`);
			signal?.throwIfAborted();
			await setImmediate();
			signal?.throwIfAborted();
			const scan = scanWikiPageSummary({
				absolutePath,
				relativePath,
				raw
			});
			if (scan.status !== "valid") return {
				scan,
				importInsight: null,
				overviewItem: null
			};
			const { parsed, ...summaryScan } = scan;
			return {
				scan: summaryScan,
				importInsight: projectMemoryWikiImportInsight(scan.page, parsed),
				overviewItem: projectMemoryWikiOverviewItem(scan.page, parsed.body)
			};
		}),
		limit: READ_PAGE_SUMMARIES_CONCURRENCY,
		errorMode: "stop"
	});
	if (readResult.hasError) throw readResult.firstError;
	signal?.throwIfAborted();
	return {
		pages: readResult.results.flatMap(({ scan }) => scan.status === "valid" ? [scan.page] : []).toSorted((left, right) => left.title.localeCompare(right.title)),
		frontmatterErrors: readResult.results.flatMap(({ scan }) => scan.status === "invalid-frontmatter" ? [scan.error] : []),
		importInsights: readResult.results.flatMap(({ importInsight }) => importInsight ? [importInsight] : []),
		overviewItems: readResult.results.flatMap(({ overviewItem }) => overviewItem ? [overviewItem] : [])
	};
}
function normalizeComparableTarget(value) {
	return normalizeLowercaseStringOrEmpty(value.trim().replace(/\\/g, "/").replace(/\.md$/i, "").replace(/^\.\/+/, "").replace(/\/+$/, ""));
}
function uniquePages(pages) {
	const seen = /* @__PURE__ */ new Set();
	return pages.filter((page) => {
		const key = page.id ?? page.relativePath;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function renderWikiPageLinks(params) {
	if (params.pages.length === 0 && params.emptyText) return `- ${params.emptyText}`;
	return params.pages.map((page) => `- ${formatPageLink(params.config, page, params.sourceRelativeTo)}`).join("\n");
}
function buildRelatedBlockBody(config, page, candidates, pagesById) {
	const otherPages = candidates.filter((candidate) => candidate.relativePath !== page.relativePath);
	const sourceIds = new Set(page.sourceIds);
	const sourceFanout = countBy(otherPages.flatMap((candidate) => candidate.sourceIds.filter((id) => sourceIds.has(id))));
	const sourcePages = uniquePages(page.sourceIds.flatMap((id) => pagesById.get(id) ?? []));
	const backlinkKeys = new Set([
		page.relativePath,
		page.title,
		...page.id ? [page.id] : []
	].map(normalizeComparableTarget));
	const backlinks = uniquePages(otherPages.filter((candidate) => candidate.sourceIds.includes(page.id ?? "") || candidate.linkTargets.some((target) => backlinkKeys.has(normalizeComparableTarget(target)))));
	const backlinkPages = backlinks.length <= MAX_SHARED_SOURCE_FANOUT ? backlinks.slice(0, MAX_RELATED_PAGES_PER_SECTION) : [];
	const excluded = new Set([...sourcePages, ...backlinkPages].map((entry) => entry.relativePath));
	const relatedPages = uniquePages(otherPages.filter((candidate) => !excluded.has(candidate.relativePath) && page.sourceIds.some((id) => candidate.sourceIds.includes(id) && (sourceFanout.get(id) ?? 0) <= MAX_SHARED_SOURCE_FANOUT))).slice(0, MAX_RELATED_PAGES_PER_SECTION);
	return [
		["Sources", sourcePages],
		["Referenced By", backlinkPages],
		["Related Pages", relatedPages]
	].filter(([, pages]) => pages.length > 0).map(([heading, pages]) => `### ${heading}\n\n${renderWikiPageLinks({
		config,
		pages,
		sourceRelativeTo: page.relativePath
	})}`).join("\n\n") || "- No related pages yet.";
}
async function refreshPageRelatedBlocks(params) {
	if (!params.config.render.createBacklinks) return [];
	const root$3 = await root(params.config.vault.path);
	const updatedFiles = [];
	const candidates = params.pages.filter((page) => page.kind !== "report");
	const pagesById = new Map(candidates.flatMap((page) => page.id ? [[page.id, page]] : []));
	for (const page of params.pages) {
		params.signal?.throwIfAborted();
		if (page.kind === "report") continue;
		const original = decodeWikiPageUtf8(await root$3.readBytes(page.relativePath), page.relativePath);
		params.signal?.throwIfAborted();
		if (original.trim().length === 0) continue;
		const updated = withTrailingNewline(replaceManagedMarkdownBlock({
			original,
			heading: "## Related",
			startMarker: WIKI_RELATED_START_MARKER,
			endMarker: WIKI_RELATED_END_MARKER,
			body: buildRelatedBlockBody(params.config, page, candidates, pagesById)
		}));
		if (updated === original) continue;
		await root$3.write(page.relativePath, updated);
		params.signal?.throwIfAborted();
		updatedFiles.push(page.absolutePath);
	}
	return updatedFiles;
}
async function writeManagedMarkdownFile(params) {
	params.signal?.throwIfAborted();
	const root$4 = await root(params.rootDir);
	const original = await readExistingWikiPageUtf8(root$4, params.relativePath, () => `# ${params.title}\n`);
	params.signal?.throwIfAborted();
	parseWikiMarkdown(original);
	const updated = replaceManagedMarkdownBlock({
		original,
		heading: "## Generated",
		startMarker: params.startMarker,
		endMarker: params.endMarker,
		body: params.body
	});
	const rendered = withTrailingNewline(updated);
	if (rendered === original) return false;
	await root$4.write(params.relativePath, rendered);
	params.signal?.throwIfAborted();
	return true;
}
async function refreshDashboardPages(params) {
	if (!params.config.render.createDashboards) return [];
	const now = /* @__PURE__ */ new Date();
	const updatedFiles = [];
	for (const [name, definition] of Object.entries(DASHBOARD_PAGES)) {
		params.signal?.throwIfAborted();
		const relativePath = `reports/${name}.md`;
		const root$5 = await root(params.config.vault.path);
		const original = await readExistingWikiPageUtf8(root$5, relativePath, () => renderWikiMarkdown({
			frontmatter: {
				pageType: "report",
				id: `report.${name}`,
				title: definition.title,
				status: "active"
			},
			body: `# ${definition.title}\n`
		}));
		const parsed = parseWikiMarkdown(original);
		const originalBody = parsed.body.trim().length > 0 ? parsed.body : `# ${definition.title}\n`;
		const updatedBody = replaceManagedMarkdownBlock({
			original: originalBody,
			heading: "## Generated",
			startMarker: `<!-- openclaw:wiki:${name}:start -->`,
			endMarker: `<!-- openclaw:wiki:${name}:end -->`,
			body: definition.buildBody({
				config: params.config,
				managedImportedSourcePagePaths: params.managedImportedSourcePagePaths,
				pages: params.pages,
				now,
				sourceRelativeTo: relativePath
			})
		});
		const preservedUpdatedAt = typeof parsed.frontmatter.updatedAt === "string" && parsed.frontmatter.updatedAt.trim() ? parsed.frontmatter.updatedAt : now.toISOString();
		const renderWithUpdatedAt = (updatedAt) => withTrailingNewline(renderWikiMarkdown({
			frontmatter: {
				...parsed.frontmatter,
				pageType: "report",
				id: `report.${name}`,
				title: definition.title,
				status: typeof parsed.frontmatter.status === "string" && parsed.frontmatter.status.trim() ? parsed.frontmatter.status : "active",
				updatedAt
			},
			body: updatedBody
		}));
		if (renderWithUpdatedAt(preservedUpdatedAt) !== original) {
			await root$5.write(relativePath, renderWithUpdatedAt(now.toISOString()));
			updatedFiles.push(path.join(params.config.vault.path, relativePath));
		}
		params.signal?.throwIfAborted();
	}
	return updatedFiles;
}
function buildRootIndexBody(params) {
	const claimCount = params.pages.reduce((total, page) => total + page.claims.length, 0);
	const lines = [
		`- Render mode: \`${params.config.vault.renderMode}\``,
		`- Total pages: ${params.pages.length}`,
		`- Claims: ${claimCount}`,
		`- Sources: ${params.counts.source}`,
		`- Entities: ${params.counts.entity}`,
		`- Concepts: ${params.counts.concept}`,
		`- Syntheses: ${params.counts.synthesis}`,
		`- Reports: ${params.counts.report}`
	];
	for (const group of WIKI_PAGE_GROUPS) {
		lines.push("", `### ${group.heading}`);
		lines.push(renderWikiPageLinks({
			config: params.config,
			pages: params.pages.filter((page) => page.kind === group.kind),
			emptyText: `No ${normalizeLowercaseStringOrEmpty(group.heading)} yet.`
		}));
	}
	return lines.join("\n");
}
const FRESHNESS_RANK = {
	fresh: 3,
	aging: 2,
	stale: 1,
	unknown: 0
};
function sortClaims(page) {
	return page.claims.toSorted((left, right) => {
		const leftConfidence = left.confidence ?? -1;
		const rightConfidence = right.confidence ?? -1;
		if (leftConfidence !== rightConfidence) return rightConfidence - leftConfidence;
		const leftFreshness = FRESHNESS_RANK[assessClaimFreshness({
			page,
			claim: left
		}).level];
		const rightFreshness = FRESHNESS_RANK[assessClaimFreshness({
			page,
			claim: right
		}).level];
		if (leftFreshness !== rightFreshness) return rightFreshness - leftFreshness;
		return left.text.localeCompare(right.text);
	});
}
function buildCompiledCacheSnapshot(scan) {
	const pagesInput = scan.pages;
	const pages = pagesInput.toSorted((left, right) => left.relativePath.localeCompare(right.relativePath)).map((page) => {
		const digestPage = Object.assign(page.id ? { id: page.id } : {}, {
			title: page.title,
			kind: page.kind,
			path: page.relativePath,
			aliases: [...page.aliases],
			sourceIds: [...page.sourceIds],
			questions: [...page.questions],
			contradictions: [...page.contradictions],
			bestUsedFor: [...page.bestUsedFor],
			notEnoughFor: [...page.notEnoughFor],
			relationshipCount: page.relationships.length,
			topRelationships: page.relationships.slice(0, 5)
		});
		if (page.pageType) digestPage.pageType = page.pageType;
		if (page.entityType) digestPage.entityType = page.entityType;
		if (page.canonicalId) digestPage.canonicalId = page.canonicalId;
		if (page.privacyTier) digestPage.privacyTier = page.privacyTier;
		if (page.personCard) digestPage.personCard = page.personCard;
		return Object.assign(digestPage, {
			claimCount: page.claims.length,
			topClaims: sortClaims(page).slice(0, 5).map((claim) => Object.assign(claim.id ? { id: claim.id } : {}, {
				text: claim.text,
				status: normalizeClaimStatus(claim.status)
			}, typeof claim.confidence === "number" ? { confidence: claim.confidence } : {}, { freshnessLevel: assessClaimFreshness({
				page,
				claim
			}).level }))
		});
	});
	const claims = pagesInput.flatMap((page) => sortClaims(page).map((claim) => {
		const freshness = assessClaimFreshness({
			page,
			claim
		});
		return Object.assign(claim.id ? { id: claim.id } : {}, {
			pageId: page.id,
			pageTitle: page.title,
			pageKind: page.kind,
			pagePath: page.relativePath,
			pageType: page.pageType,
			entityType: page.entityType,
			canonicalId: page.canonicalId,
			aliases: page.aliases,
			text: claim.text,
			status: normalizeClaimStatus(claim.status),
			confidence: claim.confidence,
			sourceIds: page.sourceIds,
			evidenceKinds: uniqueStrings(claim.evidence.flatMap((entry) => entry.kind ?? [])),
			privacyTiers: [...new Set([
				page.privacyTier,
				page.personCard?.privacyTier,
				...claim.evidence.map((entry) => entry.privacyTier)
			].flatMap((entry) => entry ?? []))],
			freshnessLevel: freshness.level,
			lastTouchedAt: freshness.lastTouchedAt
		});
	})).toSorted((left, right) => left.pagePath.localeCompare(right.pagePath) || left.text.localeCompare(right.text));
	return {
		digest: {
			claimCount: claims.length,
			contradictionCount: buildPageContradictionClusters(pagesInput).length + buildClaimContradictionClusters({ pages: pagesInput }).length,
			pages
		},
		claims,
		dashboards: {
			importInsights: buildMemoryWikiImportInsights(scan.importInsights),
			overview: buildMemoryWikiOverview(scan.pages, scan.overviewItems)
		}
	};
}
async function compileMemoryWikiVaultUnlocked(config, options) {
	if (options?.sourcePageWrites === "preserve") await activateExistingMemoryWikiVault(config, options.signal);
	else await initializeMemoryWikiVault(config, options?.signal ? { signal: options.signal } : void 0);
	options?.signal?.throwIfAborted();
	const rootDir = config.vault.path;
	const compiledInputIdentity = await loadMemoryWikiVaultIdentity(rootDir);
	if (!compiledInputIdentity.vaultGeneration) throw new Error(`Memory Wiki vault generation is missing: ${rootDir}`);
	const compiledCacheReservationId = randomUUID();
	await appendMemoryWikiLog(rootDir, {
		type: "compile",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			compiledCacheReservationId,
			compiledCacheParentPublicationId: compiledInputIdentity.compiledCachePublicationId
		}
	});
	const assertCompilationCurrent = (identity, message) => {
		if (identity.vaultGeneration !== compiledInputIdentity.vaultGeneration || identity.compiledCacheReservationId !== compiledCacheReservationId || identity.compiledCachePublicationId !== compiledInputIdentity.compiledCachePublicationId) throw new Error(message);
	};
	assertCompilationCurrent(await loadMemoryWikiVaultIdentity(rootDir), "Memory Wiki vault changed before its compiled cache scan began.");
	const sourceSyncState = await readMemoryWikiSourceSyncState(rootDir);
	const managedImportedSourcePagePaths = new Set(Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")));
	let scan = await readPageSummaries(rootDir, options?.signal);
	let pages = scan.pages;
	const updatedFiles = options?.sourcePageWrites === "preserve" ? [] : await refreshPageRelatedBlocks({
		config,
		pages,
		...options?.signal ? { signal: options.signal } : {}
	});
	if (updatedFiles.length > 0) {
		scan = await readPageSummaries(rootDir, options?.signal);
		pages = scan.pages;
	}
	const dashboardUpdatedFiles = await refreshDashboardPages({
		config,
		managedImportedSourcePagePaths,
		pages,
		...options?.signal ? { signal: options.signal } : {}
	});
	updatedFiles.push(...dashboardUpdatedFiles);
	if (dashboardUpdatedFiles.length > 0) {
		scan = await readPageSummaries(rootDir, options?.signal);
		pages = scan.pages;
	}
	const compiledSnapshot = buildCompiledCacheSnapshot(scan);
	const counts = compiledSnapshot.dashboards.overview.pageCounts;
	const compiledCacheGeneration = resolveMemoryWikiCompiledCacheGeneration(compiledSnapshot);
	const compiledCachePublicationId = randomUUID();
	let compiledCacheSourceGeneration;
	for (const group of [void 0, ...WIKI_PAGE_GROUPS]) {
		const relativePath = group ? path.join(group.dir, "index.md").replace(/\\/g, "/") : "index.md";
		const marker = group ? `${group.dir}:index` : "index";
		const body = group ? renderWikiPageLinks({
			config,
			pages: pages.filter((page) => page.kind === group.kind),
			emptyText: `No ${normalizeLowercaseStringOrEmpty(group.heading)} yet.`,
			sourceRelativeTo: `${group.dir}/index.md`
		}) : buildRootIndexBody({
			config,
			pages,
			counts
		});
		if (await writeManagedMarkdownFile({
			rootDir,
			relativePath,
			title: group?.heading ?? "Wiki Index",
			startMarker: `<!-- openclaw:wiki:${marker}:start -->`,
			endMarker: `<!-- openclaw:wiki:${marker}:end -->`,
			body,
			...options?.signal ? { signal: options.signal } : {}
		})) updatedFiles.push(path.join(rootDir, relativePath));
	}
	options?.signal?.throwIfAborted();
	await writeMemoryWikiCompiledCache(config, compiledSnapshot, compiledCacheGeneration, compiledCachePublicationId, compiledInputIdentity.compiledCachePublicationId, async () => {
		options?.signal?.throwIfAborted();
		assertCompilationCurrent(await loadMemoryWikiVaultIdentity(rootDir), "Memory Wiki vault changed while its compiled cache was being built.");
		const sourceGenerationBeforeScan = await resolveMemoryWikiVaultSourceGeneration(rootDir);
		const verifiedGeneration = resolveMemoryWikiCompiledCacheGeneration(buildCompiledCacheSnapshot(await readPageSummaries(rootDir, options?.signal)));
		const sourceGenerationAfterScan = await resolveMemoryWikiVaultSourceGeneration(rootDir);
		if (verifiedGeneration !== compiledCacheGeneration || sourceGenerationAfterScan !== sourceGenerationBeforeScan) throw new Error("Memory Wiki vault changed while its compiled cache was being published.");
		compiledCacheSourceGeneration = sourceGenerationAfterScan;
		assertCompilationCurrent(await loadMemoryWikiVaultIdentity(rootDir), "Memory Wiki vault changed while its compiled cache was being verified.");
		options?.signal?.throwIfAborted();
	}, async () => {
		options?.signal?.throwIfAborted();
		if (!compiledCacheSourceGeneration) throw new Error("Memory Wiki compiled cache source generation is missing.");
		await appendMemoryWikiLog(rootDir, {
			type: "compile",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			details: {
				compiledCachePublicationId,
				compiledCacheParentPublicationId: compiledInputIdentity.compiledCachePublicationId,
				compiledCacheReservationId,
				compiledCacheSourceGeneration
			}
		});
		options?.signal?.throwIfAborted();
	}, () => loadMemoryWikiValidatedVaultIdentity(rootDir));
	await appendMemoryWikiLog(rootDir, {
		type: "compile",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			pageCounts: counts,
			updatedFiles: updatedFiles.map((filePath) => path.relative(rootDir, filePath))
		}
	});
	return {
		vaultRoot: rootDir,
		pageCounts: counts,
		pages,
		frontmatterErrors: scan.frontmatterErrors,
		claimCount: pages.reduce((total, page) => total + page.claims.length, 0),
		updatedFiles
	};
}
async function compileMemoryWikiVault(config, options) {
	try {
		options?.signal?.throwIfAborted();
		return await withMemoryWikiVaultMutation(config.vault.path, () => {
			options?.signal?.throwIfAborted();
			setMemoryWikiDashboardState(config, { state: "rebuilding" });
			return compileMemoryWikiVaultUnlocked(config, options);
		});
	} catch (error) {
		if (!options?.signal?.aborted) setMemoryWikiDashboardState(config, { state: "failed" });
		throw error;
	}
}
async function hasMissingWikiIndexes(rootDir) {
	const required = [path.join(rootDir, "index.md"), ...WIKI_PAGE_GROUPS.map((group) => path.join(rootDir, group.dir, "index.md"))];
	for (const filePath of required) if (!await fs$1.access(filePath).then(() => true).catch(() => false)) return true;
	return false;
}
async function refreshMemoryWikiIndexesAfterImport(params) {
	params.signal?.throwIfAborted();
	const importChanged = params.syncResult.importedCount > 0 || params.syncResult.updatedCount > 0 || params.syncResult.removedCount > 0;
	const dashboardState = await readMemoryWikiDashboardState(params.config);
	params.signal?.throwIfAborted();
	let dashboardNeedsCompile = dashboardState.state !== "ready";
	if (!params.config.ingest.autoCompile) {
		if (importChanged || dashboardNeedsCompile) setMemoryWikiDashboardState(params.config, { state: "compile-required" });
		return {
			refreshed: false,
			reason: "auto-compile-disabled"
		};
	}
	const missingIndexes = await hasMissingWikiIndexes(params.config.vault.path);
	if (!importChanged && !missingIndexes && dashboardNeedsCompile) {
		await initializeMemoryWikiVault(params.config, { signal: params.signal });
		await activateExistingMemoryWikiVault(params.config, params.signal);
		dashboardNeedsCompile = (await readMemoryWikiDashboardState(params.config)).state !== "ready";
	}
	params.signal?.throwIfAborted();
	if (!importChanged && !missingIndexes && !dashboardNeedsCompile) return {
		refreshed: false,
		reason: "no-import-changes"
	};
	const compile = await compileMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0);
	return {
		refreshed: true,
		reason: importChanged ? "import-changed" : missingIndexes ? "missing-indexes" : "missing-compiled-cache",
		compile
	};
}
//#endregion
//#region extensions/memory-wiki/src/apply.ts
const GENERATED_START = "<!-- openclaw:wiki:generated:start -->";
const GENERATED_END = "<!-- openclaw:wiki:generated:end -->";
function normalizeMutationClaims(claims) {
	const normalizedClaims = normalizeWikiClaims(claims);
	for (const [index, claim] of normalizedClaims.entries()) {
		const confidence = claim.confidence;
		if (confidence !== void 0 && (confidence < 0 || confidence > 1)) throw new Error(`claims[${index}].confidence must be a number between 0 and 1; received ${confidence}.`);
	}
	return normalizedClaims;
}
function normalizeMemoryWikiMutationOp(op) {
	if (op === "synthesis" || op === "create_synthesis") return "create_synthesis";
	if (op === "metadata" || op === "update_metadata") return "update_metadata";
	throw new Error("wiki mutation op must be one of \"create_synthesis\", \"update_metadata\" (aliases: \"synthesis\", \"metadata\").");
}
function normalizeMemoryWikiMutationInput(rawParams) {
	const params = asNonArrayRecord(rawParams);
	if (normalizeMemoryWikiMutationOp(params.op) === "create_synthesis") {
		if (!params.title?.trim()) throw new Error("wiki mutation requires title for create_synthesis.");
		if (!params.body?.trim()) throw new Error("wiki mutation requires body for create_synthesis.");
		if (!params.sourceIds || params.sourceIds.length === 0) throw new Error("wiki mutation requires at least one sourceId for create_synthesis.");
		const confidence = readFiniteNumberParam(params, "confidence", {
			min: 0,
			max: 1
		});
		return {
			op: "create_synthesis",
			title: params.title,
			body: params.body,
			sourceIds: params.sourceIds,
			...Array.isArray(params.claims) ? { claims: normalizeMutationClaims(params.claims) } : {},
			...params.contradictions ? { contradictions: params.contradictions } : {},
			...params.questions ? { questions: params.questions } : {},
			...typeof confidence === "number" ? { confidence } : {},
			...params.status ? { status: params.status } : {}
		};
	}
	if (!params.lookup?.trim()) throw new Error("wiki mutation requires lookup for update_metadata.");
	const confidence = params.confidence === null ? null : readFiniteNumberParam(params, "confidence", {
		min: 0,
		max: 1
	});
	return {
		op: "update_metadata",
		lookup: params.lookup,
		...params.sourceIds ? { sourceIds: params.sourceIds } : {},
		...Array.isArray(params.claims) ? { claims: normalizeMutationClaims(params.claims) } : {},
		...params.contradictions ? { contradictions: params.contradictions } : {},
		...params.questions ? { questions: params.questions } : {},
		...confidence !== void 0 ? { confidence } : {},
		...params.status ? { status: params.status } : {}
	};
}
function normalizeUniqueStrings(values) {
	if (!values) return;
	return uniqueStrings(normalizeStringEntries(values));
}
function ensureHumanNotesBlock(body) {
	if (body.includes("<!-- openclaw:human:start -->") && body.includes("<!-- openclaw:human:end -->")) return body;
	const trimmed = body.trimEnd();
	return `${trimmed.length > 0 ? `${trimmed}\n\n` : ""}## Notes\n${HUMAN_START_MARKER}\n${HUMAN_END_MARKER}\n`;
}
function buildSynthesisBody(params) {
	const base = params.originalBody?.trim().length ? params.originalBody : `# ${params.title}\n\n## Notes\n${HUMAN_START_MARKER}\n${HUMAN_END_MARKER}\n`;
	return ensureHumanNotesBlock(replaceManagedMarkdownBlock({
		original: base,
		heading: "## Summary",
		startMarker: GENERATED_START,
		endMarker: GENERATED_END,
		body: params.generatedBody
	}));
}
function isMissingWikiPageError(error) {
	return error instanceof FsSafeError && error.code === "not-found";
}
async function writeWikiPage(params) {
	const root$1 = await root(params.rootDir);
	const rendered = withTrailingNewline(renderWikiMarkdown({
		frontmatter: params.frontmatter,
		body: params.body
	}));
	if (await readExistingWikiPage(() => root$1.readText(params.relativePath), isMissingWikiPageError) === rendered) return false;
	await root$1.write(params.relativePath, rendered);
	return true;
}
async function applyCreateSynthesisMutation(params) {
	const slug = slugifyWikiSegment(params.mutation.title);
	const pageStem = slugifyWikiPageStem(params.mutation.title);
	const pagePath = path.join("syntheses", `${pageStem}.md`).replace(/\\/g, "/");
	const root$2 = await root(params.config.vault.path);
	const existing = await readExistingWikiPage(() => root$2.readText(pagePath), isMissingWikiPageError);
	const parsed = parseWikiMarkdown(existing);
	const pageId = typeof parsed.frontmatter.id === "string" && parsed.frontmatter.id.trim() || `synthesis.${slug}`;
	const contradictions = normalizeUniqueStrings(params.mutation.contradictions);
	const questions = normalizeUniqueStrings(params.mutation.questions);
	return {
		changed: await writeWikiPage({
			rootDir: params.config.vault.path,
			relativePath: pagePath,
			frontmatter: {
				...parsed.frontmatter,
				pageType: "synthesis",
				id: pageId,
				title: params.mutation.title,
				sourceIds: normalizeSingleOrTrimmedStringList(params.mutation.sourceIds),
				...params.mutation.claims ? { claims: normalizeWikiClaims(params.mutation.claims) } : {},
				...contradictions ? { contradictions } : {},
				...questions ? { questions } : {},
				...typeof params.mutation.confidence === "number" ? { confidence: params.mutation.confidence } : {},
				status: params.mutation.status?.trim() || "active",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			},
			body: buildSynthesisBody({
				title: params.mutation.title,
				originalBody: parsed.body,
				generatedBody: params.mutation.body.trim()
			})
		}),
		pagePath,
		pageId
	};
}
function buildUpdatedFrontmatter(params) {
	const frontmatter = {
		...params.original,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (params.mutation.sourceIds) frontmatter.sourceIds = normalizeSingleOrTrimmedStringList(params.mutation.sourceIds);
	for (const key of [
		"claims",
		"contradictions",
		"questions"
	]) if (params.mutation[key]) {
		const values = key === "claims" ? normalizeWikiClaims(params.mutation.claims) : normalizeUniqueStrings(params.mutation[key]) ?? [];
		if (values.length > 0) frontmatter[key] = values;
		else delete frontmatter[key];
	}
	if (params.mutation.confidence === null) delete frontmatter.confidence;
	else if (typeof params.mutation.confidence === "number") frontmatter.confidence = params.mutation.confidence;
	if (params.mutation.status?.trim()) frontmatter.status = params.mutation.status.trim();
	return frontmatter;
}
async function applyUpdateMetadataMutation(params) {
	const page = resolveQueryableWikiPageByLookup(await readQueryableWikiPages(params.config.vault.path), params.mutation.lookup);
	if (!page) throw new Error(`Wiki page not found: ${params.mutation.lookup}`);
	const parsed = page.parsed;
	return {
		changed: await writeWikiPage({
			rootDir: params.config.vault.path,
			relativePath: page.relativePath,
			frontmatter: buildUpdatedFrontmatter({
				original: parsed.frontmatter,
				mutation: params.mutation
			}),
			body: parsed.body
		}),
		pagePath: page.relativePath,
		...page.id ? { pageId: page.id } : {}
	};
}
async function applyMemoryWikiMutation(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, async () => {
		await initializeMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0);
		params.signal?.throwIfAborted();
		const result = params.mutation.op === "create_synthesis" ? await applyCreateSynthesisMutation({
			config: params.config,
			mutation: params.mutation
		}) : await applyUpdateMetadataMutation({
			config: params.config,
			mutation: params.mutation
		});
		params.signal?.throwIfAborted();
		const compile = await compileMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0);
		return {
			changed: result.changed,
			operation: params.mutation.op,
			pagePath: result.pagePath,
			...result.pageId ? { pageId: result.pageId } : {},
			compile
		};
	});
}
//#endregion
//#region extensions/memory-wiki/src/source-page-shared.ts
function renderImportedSourcePage(params) {
	return renderWikiMarkdown({
		frontmatter: params.frontmatter,
		body: [
			`# ${params.frontmatter.title}`,
			"",
			`## ${params.sourceHeading}`,
			...params.sourceDetails,
			"",
			"## Content",
			renderMarkdownFence(params.content, params.language),
			"",
			"## Notes",
			"<!-- openclaw:human:start -->",
			"<!-- openclaw:human:end -->",
			""
		].join("\n")
	});
}
async function writeImportedSourcePage(params) {
	const previous = params.state.entries[params.syncKey];
	if (previous?.pagePath === params.pagePath && previous.sourcePath === params.sourcePath && previous.sourceUpdatedAtMs === params.sourceUpdatedAtMs && previous.sourceSize === params.sourceSize && previous.renderFingerprint === params.renderFingerprint && await fs$1.access(path.join(params.vaultRoot, params.pagePath)).then(() => true, () => false)) return {
		pagePath: params.pagePath,
		changed: false,
		created: false
	};
	await params.prepareWrite?.();
	const vault = await root(params.vaultRoot);
	const pageStat = await readWikiPageStat(vault, params.pagePath);
	const created = !pageStat;
	const updatedAt = timestampMsToIsoString(params.sourceUpdatedAtMs) ?? (/* @__PURE__ */ new Date()).toISOString();
	const raw = await fs$1.readFile(params.sourcePath, "utf8");
	const rendered = params.buildRendered(raw, updatedAt);
	const existing = pageStat ? await readExistingWikiPage(() => vault.readText(params.pagePath), (error) => error instanceof FsSafeError && (error.code === "not-file" || error.code === "hardlink")) : "";
	const nextRendered = existing ? preserveHumanNotesBlock(rendered, existing) : rendered;
	if (existing !== nextRendered) await writeGuardedVaultPage({
		vault,
		pagePath: params.pagePath,
		content: nextRendered,
		pageStat,
		pageLabel: "imported source page"
	});
	setImportedSourceEntry({
		syncKey: params.syncKey,
		state: params.state,
		entry: {
			group: params.group,
			pagePath: params.pagePath,
			sourcePath: params.sourcePath,
			sourceUpdatedAtMs: params.sourceUpdatedAtMs,
			sourceSize: params.sourceSize,
			renderFingerprint: params.renderFingerprint
		}
	});
	return {
		pagePath: params.pagePath,
		changed: existing !== nextRendered,
		created
	};
}
//#endregion
//#region extensions/memory-wiki/src/ingest.ts
async function ingestMemoryWikiSource(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, async () => {
		await initializeMemoryWikiVault(params.config, {
			...params.nowMs !== void 0 ? { nowMs: params.nowMs } : {},
			...params.signal ? { signal: params.signal } : {}
		});
		params.signal?.throwIfAborted();
		const sourcePath = path.resolve(params.inputPath);
		const buffer = await fs$1.readFile(sourcePath);
		params.signal?.throwIfAborted();
		if (buffer.subarray(0, 4096).includes(0)) throw new Error(`Cannot ingest binary file as markdown source: ${sourcePath}`);
		const title = params.title?.trim() || path.basename(sourcePath, path.extname(sourcePath)).replace(/[-_]+/g, " ").trim();
		const slug = slugifyWikiSegment(title);
		const pageStem = slugifyWikiPageStem(title);
		const pageId = `source.${slug}`;
		const pageRelativePath = path.join("sources", `${pageStem}.md`);
		const pagePath = path.join(params.config.vault.path, pageRelativePath);
		const created = !await pathExists(pagePath);
		const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
		const markdown = renderImportedSourcePage({
			frontmatter: {
				pageType: "source",
				id: pageId,
				title,
				sourceType: "local-file",
				sourcePath,
				ingestedAt: timestamp,
				updatedAt: timestamp,
				status: "active"
			},
			sourceHeading: "Source",
			sourceDetails: [
				`- Type: \`local-file\``,
				`- Path: \`${sourcePath}\``,
				`- Bytes: ${buffer.byteLength}`,
				`- Updated: ${timestamp}`
			],
			content: buffer.toString("utf8"),
			language: "text"
		});
		const existing = created ? "" : await readExistingWikiPage(() => fs$1.readFile(pagePath, "utf8"), (error) => {
			const code = asNullableRecord(error)?.code;
			return code === "ENOENT" || code === "EISDIR";
		});
		params.signal?.throwIfAborted();
		await fs$1.writeFile(pagePath, existing ? preserveHumanNotesBlock(markdown, existing) : markdown, "utf8");
		params.signal?.throwIfAborted();
		await appendMemoryWikiLog(params.config.vault.path, {
			type: "ingest",
			timestamp,
			details: {
				inputPath: sourcePath,
				pageId,
				pagePath: pageRelativePath.split(path.sep).join("/"),
				bytes: buffer.byteLength,
				created
			}
		});
		params.signal?.throwIfAborted();
		const compile = await compileMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0);
		return {
			sourcePath,
			pageId,
			pagePath: pageRelativePath.split(path.sep).join("/"),
			title,
			bytes: buffer.byteLength,
			created,
			indexUpdatedFiles: compile.updatedFiles
		};
	});
}
//#endregion
//#region extensions/memory-wiki/src/lint.ts
const LINT_ISSUE_KINDS = {
	"invalid-frontmatter": ["error", "structure"],
	"missing-id": ["error", "structure"],
	"duplicate-id": ["error", "structure"],
	"missing-page-type": ["error", "structure"],
	"page-type-mismatch": ["error", "structure"],
	"missing-title": ["error", "structure"],
	"missing-source-ids": ["warning", "provenance"],
	"missing-import-provenance": ["warning", "provenance"],
	"broken-wikilink": ["warning", "links"],
	"contradiction-present": ["warning", "contradictions"],
	"claim-conflict": ["warning", "contradictions"],
	"open-question": ["warning", "open-questions"],
	"low-confidence": ["warning", "quality"],
	"claim-low-confidence": ["warning", "quality"],
	"claim-missing-evidence": ["warning", "provenance"],
	"stale-page": ["warning", "quality"],
	"stale-claim": ["warning", "quality"]
};
function createLintIssue(code, pagePath, message) {
	const [severity, category] = LINT_ISSUE_KINDS[code];
	return {
		severity,
		category,
		code,
		path: pagePath,
		message
	};
}
function normalizeLintTarget(value, stripQuery = true) {
	const withoutFragment = value.trim().replace(/\\/g, "/").split("#")[0] ?? "";
	return (stripQuery ? withoutFragment.split("?")[0] ?? "" : withoutFragment).replace(/\.md$/i, "").replace(/^\.\/+/, "").replace(/^\/+/, "").replace(/\/+$/, "").trim();
}
function addPathTarget(index, raw) {
	const normalized = raw ? normalizeLintTarget(raw) : "";
	if (!normalized) return;
	index.pathTargets.add(normalized);
	index.pathTargets.add(path.posix.basename(normalized));
}
function addSlugAliasTarget(index, raw) {
	const normalized = raw ? normalizeLintTarget(raw, false) : "";
	if (normalized) index.aliasTargets.add(slugifyWikiSegment(normalized));
}
function addPathSuffixTargets(index, raw) {
	const normalized = raw ? normalizeLintTarget(raw) : "";
	if (!normalized) return;
	const parts = normalized.split("/").filter(Boolean);
	for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
		const suffix = parts.slice(partIndex).join("/");
		addPathTarget(index, suffix);
		addSlugAliasTarget(index, suffix);
	}
}
function buildWikiLinkTargetIndex(pages) {
	const index = {
		pathTargets: /* @__PURE__ */ new Set(),
		aliasTargets: /* @__PURE__ */ new Set()
	};
	for (const page of pages) {
		addPathTarget(index, page.relativePath);
		const title = normalizeLowercaseStringOrEmpty(normalizeLintTarget(page.title, false));
		if (title) index.aliasTargets.add(title);
		addSlugAliasTarget(index, page.title);
		addPathSuffixTargets(index, page.sourcePath);
		addPathSuffixTargets(index, page.bridgeRelativePath);
		addPathSuffixTargets(index, page.unsafeLocalRelativePath);
	}
	return index;
}
function hasValidWikiLinkTarget(index, rawTarget) {
	const pathTarget = normalizeLintTarget(rawTarget);
	if (!pathTarget) return true;
	const withoutFragment = rawTarget.trim().replace(/\\/g, "/").split("#")[0] ?? "";
	const withoutQuery = withoutFragment.split("?")[0] ?? "";
	const pathStyle = withoutQuery.includes("/") || /\.md$/i.test(withoutQuery);
	if (index.pathTargets.has(pathTarget) && (!withoutFragment.includes("?") || pathStyle)) return true;
	if (pathTarget.includes("/")) return false;
	const alias = normalizeLintTarget(rawTarget, false);
	return index.aliasTargets.has(normalizeLowercaseStringOrEmpty(alias)) || index.aliasTargets.has(slugifyWikiSegment(alias));
}
function collectPageIssues(pages, managedImportedSourcePagePaths) {
	const issues = [];
	const addIssue = (...args) => {
		issues.push(createLintIssue(...args));
	};
	const pagesById = /* @__PURE__ */ new Map();
	const claimHealth = collectWikiClaimHealth(pages);
	for (const page of pages) {
		const requiresStructuredPageMetadata = !isUnmanagedRawSourceSummary(page) || managedImportedSourcePagePaths.has(page.relativePath);
		if (!page.id) {
			if (requiresStructuredPageMetadata) addIssue("missing-id", page.relativePath, "Missing `id` frontmatter.");
		} else {
			const current = pagesById.get(page.id) ?? [];
			current.push(page);
			pagesById.set(page.id, current);
		}
		if (!page.pageType) {
			if (requiresStructuredPageMetadata) addIssue("missing-page-type", page.relativePath, "Missing `pageType` frontmatter.");
		} else if (page.pageType !== page.kind) addIssue("page-type-mismatch", page.relativePath, `Expected pageType \`${page.kind}\`, found \`${page.pageType}\`.`);
		if (!page.title.trim()) addIssue("missing-title", page.relativePath, "Missing page title.");
		if (page.kind !== "source" && page.kind !== "report" && page.sourceIds.length === 0) addIssue("missing-source-ids", page.relativePath, "Non-source page is missing `sourceIds` provenance.");
		if ((page.sourceType === "memory-bridge" || page.sourceType === "memory-bridge-events") && (!page.sourcePath || !page.bridgeRelativePath || !page.bridgeWorkspaceDir)) addIssue("missing-import-provenance", page.relativePath, "Bridge-imported source page is missing `sourcePath`, `bridgeRelativePath`, or `bridgeWorkspaceDir` provenance.");
		if ((page.provenanceMode === "unsafe-local" || page.sourceType === "memory-unsafe-local") && (!page.sourcePath || !page.unsafeLocalConfiguredPath || !page.unsafeLocalRelativePath)) addIssue("missing-import-provenance", page.relativePath, "Unsafe-local source page is missing `sourcePath`, `unsafeLocalConfiguredPath`, or `unsafeLocalRelativePath` provenance.");
		if (page.contradictions.length > 0) addIssue("contradiction-present", page.relativePath, `Page lists ${page.contradictions.length} contradiction${page.contradictions.length === 1 ? "" : "s"} to resolve.`);
		if (page.questions.length > 0) addIssue("open-question", page.relativePath, `Page lists ${page.questions.length} open question${page.questions.length === 1 ? "" : "s"}.`);
		if (typeof page.confidence === "number" && page.confidence < .5) addIssue("low-confidence", page.relativePath, `Page confidence is low (${page.confidence.toFixed(2)}).`);
		const freshness = assessPageFreshness(page);
		if (requiresStructuredPageMetadata && page.kind !== "report" && (freshness.level === "stale" || freshness.level === "unknown")) addIssue("stale-page", page.relativePath, `Page freshness needs review (${freshness.reason}).`);
	}
	for (const claim of claimHealth) {
		const label = `Claim \`${claim.claimId || claim.text}\``;
		if (claim.missingEvidence) addIssue("claim-missing-evidence", claim.pagePath, `${label} is missing structured evidence.`);
		if (typeof claim.confidence === "number" && claim.confidence < .5) addIssue("claim-low-confidence", claim.pagePath, `${label} has low confidence (${claim.confidence.toFixed(2)}).`);
		if (claim.freshness.level === "stale" || claim.freshness.level === "unknown") addIssue("stale-claim", claim.pagePath, `${label} freshness needs review (${claim.freshness.reason}).`);
	}
	for (const cluster of buildClaimContradictionClusters({ pages })) for (const entry of cluster.entries) addIssue("claim-conflict", entry.pagePath, `Claim cluster \`${cluster.label}\` has competing variants across ${cluster.entries.length} pages.`);
	for (const [id, matches] of pagesById.entries()) if (matches.length > 1) for (const match of matches) addIssue("duplicate-id", match.relativePath, `Duplicate page id \`${id}\`.`);
	const validTargets = buildWikiLinkTargetIndex(pages);
	for (const page of pages) for (const linkTarget of page.linkTargets) if (!hasValidWikiLinkTarget(validTargets, linkTarget)) addIssue("broken-wikilink", page.relativePath, `Broken wikilink target \`${linkTarget}\`.`);
	return issues.toSorted((left, right) => left.path.localeCompare(right.path));
}
function buildIssuesByCategory(issues) {
	return {
		structure: issues.filter((issue) => issue.category === "structure"),
		provenance: issues.filter((issue) => issue.category === "provenance"),
		links: issues.filter((issue) => issue.category === "links"),
		contradictions: issues.filter((issue) => issue.category === "contradictions"),
		"open-questions": issues.filter((issue) => issue.category === "open-questions"),
		quality: issues.filter((issue) => issue.category === "quality")
	};
}
function buildLintReportBody(issues) {
	if (issues.length === 0) return "No issues found.";
	const errors = issues.filter((issue) => issue.severity === "error");
	const warnings = issues.filter((issue) => issue.severity === "warning");
	const byCategory = buildIssuesByCategory(issues);
	const lines = [`- Errors: ${errors.length}`, `- Warnings: ${warnings.length}`];
	const sections = [
		["Errors", errors],
		["Warnings", warnings],
		["Contradictions", byCategory.contradictions],
		["Open Questions", byCategory["open-questions"]],
		["Quality Follow-Up", [...byCategory.provenance, ...byCategory.quality]]
	];
	for (const [heading, sectionIssues] of sections) if (sectionIssues.length > 0) {
		lines.push("", `### ${heading}`);
		for (const issue of sectionIssues) lines.push(`- \`${issue.path}\`: ${issue.message}`);
	}
	return lines.join("\n");
}
async function writeLintReport(rootDir, issues) {
	const reportPath = path.join(rootDir, "reports", "lint.md");
	const directoryPath = path.dirname(reportPath);
	await fs$1.mkdir(directoryPath, { recursive: true });
	const dirMode = (await fs$1.stat(directoryPath)).mode & 4095;
	const originalBytes = await fs$1.readFile(reportPath).catch(() => null);
	const original = originalBytes === null ? renderWikiMarkdown({
		frontmatter: {
			pageType: "report",
			id: "report.lint",
			title: "Lint Report",
			status: "active"
		},
		body: "# Lint Report\n"
	}) : decodeWikiPageUtf8(originalBytes, reportPath);
	parseWikiMarkdown(original);
	const updated = replaceManagedMarkdownBlock({
		original,
		heading: "## Generated",
		startMarker: "<!-- openclaw:wiki:lint:start -->",
		endMarker: "<!-- openclaw:wiki:lint:end -->",
		body: buildLintReportBody(issues)
	});
	await replaceFileAtomic({
		filePath: reportPath,
		content: withTrailingNewline(updated),
		dirMode,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(reportPath)}.lint-report`,
		syncTempFile: true,
		syncParentDir: true,
		throwOnCleanupError: true
	});
	return reportPath;
}
async function lintMemoryWikiVault(config, options = {}) {
	const compileResult = await compileMemoryWikiVault(config, options.signal ? { signal: options.signal } : void 0);
	options.signal?.throwIfAborted();
	const sourceSyncState = await readMemoryWikiSourceSyncState(config.vault.path);
	const managedImportedSourcePagePaths = new Set(Object.values(sourceSyncState.entries).map((entry) => entry.pagePath.split(path.sep).join("/")));
	const issues = [...compileResult.frontmatterErrors.map((error) => createLintIssue("invalid-frontmatter", error.relativePath, `Frontmatter failed to parse: ${error.message}`)), ...collectPageIssues(compileResult.pages, managedImportedSourcePagePaths)].toSorted((left, right) => left.path.localeCompare(right.path));
	const issuesByCategory = buildIssuesByCategory(issues);
	const reportPath = await writeLintReport(config.vault.path, issues);
	options.signal?.throwIfAborted();
	await appendMemoryWikiLog(config.vault.path, {
		type: "lint",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			issueCount: issues.length,
			reportPath: path.relative(config.vault.path, reportPath)
		}
	});
	return {
		vaultRoot: config.vault.path,
		issueCount: issues.length,
		issues,
		issuesByCategory,
		reportPath
	};
}
//#endregion
//#region extensions/memory-wiki/src/obsidian.ts
const OBSIDIAN_CLI_TIMEOUT_MS = 1e4;
async function isExecutableFile(inputPath) {
	try {
		await fs$1.access(inputPath, process.platform === "win32" ? constants.F_OK : constants.X_OK);
		return (await fs$1.stat(inputPath)).isFile();
	} catch {
		return false;
	}
}
async function resolveCommandOnPath(command) {
	const pathEntries = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
	const windowsExts = process.platform === "win32" ? process.env.PATHEXT?.split(";").filter(Boolean) ?? [
		".EXE",
		".CMD",
		".BAT"
	] : [""];
	for (const dir of pathEntries) for (const extension of windowsExts) {
		const candidate = path.join(dir, extension ? `${command}${extension}` : command);
		if (await isExecutableFile(candidate)) return candidate;
	}
	return null;
}
async function probeObsidianCli(deps) {
	const command = await (deps?.resolveCommand ?? resolveCommandOnPath)("obsidian");
	return {
		available: command !== null,
		command
	};
}
const OBSIDIAN_ACTIONS = [
	{
		command: "search",
		description: "Search the current Obsidian vault",
		argument: {
			name: "query",
			description: "Search query"
		},
		success: ""
	},
	{
		command: "open",
		description: "Open a file in Obsidian by vault-relative path",
		argument: {
			name: "path",
			description: "Vault-relative path"
		},
		success: "Opened in Obsidian."
	},
	{
		command: "command",
		description: "Execute an Obsidian command palette command by id",
		argument: {
			name: "id",
			description: "Obsidian command id"
		},
		success: "Command sent to Obsidian."
	},
	{
		command: "daily",
		description: "Open today's daily note in Obsidian",
		argument: void 0,
		success: "Opened today's daily note."
	}
];
function assertOfficialObsidianCliSupported(config) {
	if (config.vault.scope === "agent") throw new Error("Official Obsidian CLI actions do not support memory-wiki vault.scope=agent.");
}
async function runObsidianAction(params) {
	const probe = await probeObsidianCli(params.deps);
	if (!probe.command) throw new Error("Obsidian CLI is not available on PATH.");
	const { vaultName } = params.config.obsidian;
	const argv = [
		...vaultName ? [`vault=${vaultName}`] : [],
		params.action.command,
		...params.action.argument ? [`${params.action.argument.name}=${params.value}`] : []
	];
	const { stdout, stderr } = await (params.deps?.exec ?? runExec)(probe.command, argv, {
		logOutput: false,
		timeoutMs: OBSIDIAN_CLI_TIMEOUT_MS
	});
	return {
		command: probe.command,
		argv,
		stdout,
		stderr
	};
}
//#endregion
//#region extensions/memory-wiki/src/source-import.ts
function emptySourceImportResult() {
	return {
		importedCount: 0,
		updatedCount: 0,
		skippedCount: 0,
		removedCount: 0,
		artifactCount: 0,
		workspaces: 0,
		pagePaths: []
	};
}
async function syncImportedSourcePages(params) {
	const state = await readMemoryWikiSourceSyncState(params.config.vault.path);
	let initializePromise;
	const prepareWrite = async () => {
		params.signal?.throwIfAborted();
		const result = await (initializePromise ??= initializeMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0));
		params.signal?.throwIfAborted();
		return result;
	};
	const batch = await params.writeSources({
		state,
		prepareWrite
	});
	const removedCount = !params.canPrune || params.canPrune() ? await pruneImportedSourceEntries({
		vaultRoot: params.config.vault.path,
		group: params.group,
		activeKeys: batch.activeKeys,
		state,
		prepareWrite
	}) : 0;
	await writeMemoryWikiSourceSyncState(params.config.vault.path, state);
	const importedCount = batch.results.filter((result) => result.changed && result.created).length;
	const updatedCount = batch.results.filter((result) => result.changed && !result.created).length;
	const skippedCount = batch.results.filter((result) => !result.changed).length;
	const pagePaths = batch.results.map((result) => result.pagePath).toSorted((left, right) => left.localeCompare(right));
	if (importedCount > 0 || updatedCount > 0 || removedCount > 0) await appendMemoryWikiLog(params.config.vault.path, {
		type: "ingest",
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		details: {
			sourceType: `memory-${params.group}`,
			...params.logDetails,
			artifactCount: batch.artifactCount,
			importedCount,
			updatedCount,
			skippedCount,
			removedCount
		}
	});
	return {
		importedCount,
		updatedCount,
		skippedCount,
		removedCount,
		artifactCount: batch.artifactCount,
		workspaces: batch.workspaces,
		pagePaths
	};
}
//#endregion
//#region extensions/memory-wiki/src/source-path-shared.ts
async function resolveArtifactKey(absolutePath) {
	const canonicalPath = await fs$1.realpath(absolutePath).catch(() => path.resolve(absolutePath));
	return process.platform === "win32" ? lowercasePreservingWhitespace(canonicalPath) : canonicalPath;
}
//#endregion
//#region extensions/memory-wiki/src/bridge.ts
function resolveMemoryWikiVaultAgentId(config) {
	if (config.vault.scope === "global") return null;
	const agentId = config.agentId?.trim();
	if (!agentId) throw new Error("Memory Wiki agent-scoped vault requires a resolved agent id");
	return normalizeAgentId(agentId);
}
function filterMemoryWikiBridgeArtifacts(params) {
	const vaultAgentId = resolveMemoryWikiVaultAgentId(params.config);
	const callerAgentId = params.callerAgentId?.trim();
	const agentId = vaultAgentId ?? (callerAgentId ? normalizeAgentId(callerAgentId) : null);
	if (!agentId) return params.artifacts;
	return params.artifacts.filter((artifact) => {
		return (Array.isArray(artifact.agentIds) ? artifact.agentIds : []).some((artifactAgentId) => typeof artifactAgentId === "string" && artifactAgentId.trim().length > 0 && normalizeAgentId(artifactAgentId) === agentId);
	});
}
function shouldImportArtifact(artifact, bridgeConfig) {
	switch (artifact.kind) {
		case "memory-root": return bridgeConfig.indexMemoryRoot;
		case "daily-note": return bridgeConfig.indexDailyNotes;
		case "dream-report": return bridgeConfig.indexDreamReports;
		case "event-log": return bridgeConfig.followMemoryEvents;
		default: return false;
	}
}
async function collectBridgeArtifacts(bridgeConfig, vaultRoot, artifacts) {
	const collected = /* @__PURE__ */ new Map();
	const vaultRootKey = await resolveArtifactKey(vaultRoot);
	for (const artifact of artifacts) {
		if (!shouldImportArtifact(artifact, bridgeConfig)) continue;
		const syncKey = await resolveArtifactKey(artifact.absolutePath);
		if (isPathInside(vaultRootKey, syncKey)) continue;
		collected.set(syncKey, {
			syncKey,
			artifactType: artifact.kind === "event-log" ? "memory-events" : "markdown",
			workspaceDir: artifact.workspaceDir,
			relativePath: artifact.relativePath,
			absolutePath: artifact.absolutePath
		});
	}
	return [...collected.values()];
}
function resolveBridgeTitle(artifact, agentIds) {
	const base = artifact.artifactType === "memory-events" ? "event journal" : artifact.relativePath.replace(/\.md$/i, "").replace(/^memory\//, "").replace(/\//g, " / ");
	return `Memory Bridge${agentIds.length > 0 ? ` (${agentIds.join(", ")})` : ""}: ${base}`;
}
function resolveBridgePagePath(params) {
	const workspaceBaseSlug = slugifyWikiSegment(path.basename(params.workspaceDir));
	const workspaceHash = createHash("sha1").update(path.resolve(params.workspaceDir)).digest("hex");
	const artifactBaseSlug = slugifyWikiSegment(params.relativePath.replace(/\.md$/i, "").replace(/\//g, "-"));
	const artifactHash = createHash("sha1").update(params.relativePath).digest("hex");
	const workspaceSlug = `${workspaceBaseSlug}-${workspaceHash.slice(0, 8)}`;
	const artifactSlug = `${artifactBaseSlug}-${artifactHash.slice(0, 8)}`;
	const fileName = createWikiPageFilename(`bridge-${workspaceSlug}-${artifactSlug}`);
	return {
		pageId: `source.bridge.${workspaceSlug}.${artifactSlug}`,
		pagePath: path.join("sources", fileName).replace(/\\/g, "/")
	};
}
async function syncMemoryWikiBridgeSources(params) {
	resolveMemoryWikiVaultAgentId(params.config);
	if (params.config.vaultMode !== "bridge" || !params.config.bridge.enabled || !params.config.bridge.readMemoryArtifacts || !params.appConfig) return emptySourceImportResult();
	const publicArtifacts = filterMemoryWikiBridgeArtifacts({
		config: params.config,
		artifacts: await listActiveMemoryPublicArtifacts({ cfg: params.appConfig })
	});
	const artifacts = await collectBridgeArtifacts(params.config.bridge, params.config.vault.path, publicArtifacts);
	const workspaces = new Set(publicArtifacts.map((artifact) => artifact.workspaceDir)).size;
	return await syncImportedSourcePages({
		config: params.config,
		group: "bridge",
		signal: params.signal,
		writeSources: async ({ state, prepareWrite }) => {
			assertMemoryWikiSourceSyncStateCapacity({
				state,
				group: "bridge",
				incomingCount: artifacts.length
			});
			const agentIdsByWorkspace = /* @__PURE__ */ new Map();
			for (const artifact of publicArtifacts) agentIdsByWorkspace.set(artifact.workspaceDir, artifact.agentIds);
			const results = [];
			const activeKeys = /* @__PURE__ */ new Set();
			for (const artifact of artifacts) {
				const stats = await fs$1.stat(artifact.absolutePath);
				activeKeys.add(artifact.syncKey);
				const agentIds = agentIdsByWorkspace.get(artifact.workspaceDir) ?? [];
				const { pageId, pagePath } = resolveBridgePagePath({
					workspaceDir: artifact.workspaceDir,
					relativePath: artifact.relativePath
				});
				const title = resolveBridgeTitle(artifact, agentIds);
				const renderFingerprint = createHash("sha1").update(JSON.stringify({
					artifactType: artifact.artifactType,
					workspaceDir: artifact.workspaceDir,
					relativePath: artifact.relativePath,
					agentIds
				})).digest("hex");
				results.push(await writeImportedSourcePage({
					vaultRoot: params.config.vault.path,
					syncKey: artifact.syncKey,
					sourcePath: artifact.absolutePath,
					sourceUpdatedAtMs: stats.mtimeMs,
					sourceSize: stats.size,
					renderFingerprint,
					pagePath,
					group: "bridge",
					state,
					prepareWrite,
					buildRendered: (raw, updatedAt) => {
						const contentLanguage = artifact.artifactType === "memory-events" ? "json" : "markdown";
						return renderImportedSourcePage({
							frontmatter: {
								pageType: "source",
								id: pageId,
								title,
								sourceType: artifact.artifactType === "memory-events" ? "memory-bridge-events" : "memory-bridge",
								sourcePath: artifact.absolutePath,
								bridgeRelativePath: artifact.relativePath,
								bridgeWorkspaceDir: artifact.workspaceDir,
								bridgeAgentIds: agentIds,
								status: "active",
								updatedAt
							},
							sourceHeading: "Bridge Source",
							sourceDetails: [
								`- Workspace: \`${artifact.workspaceDir}\``,
								`- Relative path: \`${artifact.relativePath}\``,
								`- Kind: \`${artifact.artifactType}\``,
								`- Agents: ${agentIds.length > 0 ? agentIds.join(", ") : "unknown"}`,
								`- Updated: ${updatedAt}`
							],
							content: raw,
							language: contentLanguage
						});
					}
				}));
			}
			return {
				results,
				activeKeys,
				artifactCount: artifacts.length,
				workspaces
			};
		},
		canPrune: () => Boolean(getMemoryCapabilityRegistration()),
		logDetails: { workspaces }
	});
}
//#endregion
//#region extensions/memory-wiki/src/unsafe-local.ts
const DIRECTORY_TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
	".json",
	".jsonl",
	".md",
	".txt",
	".yaml",
	".yml"
]);
const GENERATED_IMPORTED_SOURCE_PREFIXES = ["bridge-", "unsafe-local-"];
const UNSAFE_LOCAL_SYNC_CONCURRENCY = 16;
function detectFenceLanguage(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	if (ext === ".json" || ext === ".jsonl") return "json";
	if (ext === ".yaml" || ext === ".yml") return "yaml";
	if (ext === ".txt") return "text";
	return "markdown";
}
async function listAllowedFilesRecursive(rootDir) {
	return (await walkMemoryWikiDirectory(rootDir, "", { entryFilter: (entry) => entry.kind === "directory" || entry.kind === "file" && DIRECTORY_TEXT_EXTENSIONS.has(normalizeLowercaseStringOrEmpty(path.extname(entry.relativePath))) ? "include" : "skip" })).filter((entry) => entry.kind === "file").map((entry) => path.join(rootDir, entry.relativePath)).toSorted((left, right) => left.localeCompare(right));
}
async function collectUnsafeLocalArtifacts(configuredPaths, vaultRootKey) {
	const artifacts = [];
	const unavailableConfiguredPaths = [];
	for (const configuredPath of configuredPaths) {
		const absoluteConfiguredPath = path.resolve(configuredPath);
		const scopedArtifacts = [];
		try {
			const stat = await fs$1.stat(absoluteConfiguredPath);
			const files = stat.isDirectory() ? await listAllowedFilesRecursive(absoluteConfiguredPath) : stat.isFile() ? [absoluteConfiguredPath] : [];
			for (const absolutePath of files) scopedArtifacts.push({
				syncKey: await resolveArtifactKey(absolutePath),
				configuredPath: absoluteConfiguredPath,
				absolutePath,
				relativePath: stat.isDirectory() ? path.relative(absoluteConfiguredPath, absolutePath).replace(/\\/g, "/") : path.basename(absolutePath)
			});
		} catch {
			unavailableConfiguredPaths.push(absoluteConfiguredPath);
			continue;
		}
		artifacts.push(...scopedArtifacts);
	}
	const deduped = /* @__PURE__ */ new Map();
	for (const artifact of artifacts) {
		if (isPathInside(vaultRootKey, artifact.syncKey)) continue;
		const sourceName = normalizeLowercaseStringOrEmpty(path.basename(artifact.absolutePath));
		if (GENERATED_IMPORTED_SOURCE_PREFIXES.some((prefix) => sourceName.startsWith(prefix))) {
			if (toWikiPageSummary({
				absolutePath: artifact.absolutePath,
				relativePath: `sources/${sourceName}`,
				raw: await fs$1.readFile(artifact.absolutePath, "utf8")
			})?.importedSourceBody) continue;
		}
		deduped.set(artifact.syncKey, artifact);
	}
	return {
		artifacts: [...deduped.values()],
		unavailableConfiguredPaths
	};
}
function resolveUnsafeLocalPagePath(params) {
	const pageSlug = [params.configuredPath, params.absolutePath].map((sourcePath) => {
		return `${slugifyWikiSegment(path.basename(sourcePath))}-${createHash("sha1").update(path.resolve(sourcePath)).digest("hex").slice(0, 8)}`;
	}).join("-");
	return {
		pageId: `source.unsafe-local.${pageSlug}`,
		pagePath: path.join("sources", createWikiPageFilename(`unsafe-local-${pageSlug}`)).replace(/\\/g, "/")
	};
}
async function syncMemoryWikiUnsafeLocalSources(config, options = {}) {
	if (config.vaultMode !== "unsafe-local" || !config.unsafeLocal.allowPrivateMemoryCoreAccess || config.unsafeLocal.paths.length === 0) return emptySourceImportResult();
	const vaultRootKey = await resolveArtifactKey(config.vault.path);
	const { artifacts, unavailableConfiguredPaths } = await collectUnsafeLocalArtifacts(config.unsafeLocal.paths, vaultRootKey);
	return await syncImportedSourcePages({
		config,
		group: "unsafe-local",
		signal: options.signal,
		writeSources: async ({ state, prepareWrite }) => {
			const activeKeys = /* @__PURE__ */ new Set();
			for (const [syncKey, entry] of Object.entries(state.entries)) if (entry.group === "unsafe-local" && unavailableConfiguredPaths.some((configuredPath) => isPathInside(configuredPath, entry.sourcePath))) activeKeys.add(syncKey);
			assertMemoryWikiSourceSyncStateCapacity({
				state,
				group: "unsafe-local",
				incomingCount: (/* @__PURE__ */ new Set([...artifacts.map((artifact) => artifact.syncKey), ...activeKeys])).size
			});
			const { results } = await runTasksWithConcurrency({
				tasks: artifacts.map((artifact) => async () => {
					const stats = await fs$1.stat(artifact.absolutePath);
					activeKeys.add(artifact.syncKey);
					const { pageId, pagePath } = resolveUnsafeLocalPagePath({
						configuredPath: artifact.configuredPath,
						absolutePath: artifact.absolutePath
					});
					const title = `Unsafe Local Import: ${artifact.relativePath}`;
					const renderFingerprint = createHash("sha1").update(JSON.stringify({
						configuredPath: artifact.configuredPath,
						relativePath: artifact.relativePath
					})).digest("hex");
					return writeImportedSourcePage({
						vaultRoot: config.vault.path,
						syncKey: artifact.syncKey,
						sourcePath: artifact.absolutePath,
						sourceUpdatedAtMs: stats.mtimeMs,
						sourceSize: stats.size,
						renderFingerprint,
						pagePath,
						group: "unsafe-local",
						state,
						prepareWrite,
						buildRendered: (raw, updatedAt) => renderImportedSourcePage({
							frontmatter: {
								pageType: "source",
								id: pageId,
								title,
								sourceType: "memory-unsafe-local",
								provenanceMode: "unsafe-local",
								sourcePath: artifact.absolutePath,
								unsafeLocalConfiguredPath: artifact.configuredPath,
								unsafeLocalRelativePath: artifact.relativePath,
								status: "active",
								updatedAt
							},
							sourceHeading: "Unsafe Local Source",
							sourceDetails: [
								`- Configured path: \`${artifact.configuredPath}\``,
								`- Relative path: \`${artifact.relativePath}\``,
								`- Updated: ${updatedAt}`
							],
							content: raw,
							language: detectFenceLanguage(artifact.absolutePath)
						})
					});
				}),
				limit: UNSAFE_LOCAL_SYNC_CONCURRENCY,
				errorMode: "stop",
				throwOnError: true
			});
			return {
				results,
				activeKeys,
				artifactCount: artifacts.length,
				workspaces: 0
			};
		},
		logDetails: { configuredPathCount: config.unsafeLocal.paths.length }
	});
}
//#endregion
//#region extensions/memory-wiki/src/source-sync.ts
const activeImportedSourceSyncs = /* @__PURE__ */ new Map();
async function syncMemoryWikiImportedSourcesOnce(params) {
	params.signal?.throwIfAborted();
	let syncResult;
	if (params.config.vaultMode === "bridge") syncResult = await syncMemoryWikiBridgeSources(params);
	else if (params.config.vaultMode === "unsafe-local") syncResult = params.signal ? await syncMemoryWikiUnsafeLocalSources(params.config, { signal: params.signal }) : await syncMemoryWikiUnsafeLocalSources(params.config);
	else {
		await initializeMemoryWikiVault(params.config, params.signal ? { signal: params.signal } : void 0);
		syncResult = emptySourceImportResult();
	}
	params.signal?.throwIfAborted();
	if (params.deferIndexRefresh) return {
		...syncResult,
		indexesRefreshed: false,
		indexUpdatedFiles: [],
		indexRefreshReason: "deferred"
	};
	const refreshResult = await refreshMemoryWikiIndexesAfterImport({
		config: params.config,
		syncResult,
		...params.signal ? { signal: params.signal } : {}
	});
	return {
		...syncResult,
		indexesRefreshed: refreshResult.refreshed,
		indexUpdatedFiles: refreshResult.compile?.updatedFiles ?? [],
		indexRefreshReason: refreshResult.reason
	};
}
async function syncMemoryWikiImportedSources(params) {
	const vaultKey = await resolveMemoryWikiVaultMutationKey(params.config.vault.path);
	const requestKey = JSON.stringify({
		...params.config,
		vault: {
			...params.config.vault,
			path: vaultKey
		},
		deferIndexRefresh: params.deferIndexRefresh === true
	});
	const active = activeImportedSourceSyncs.get(vaultKey) ?? /* @__PURE__ */ new Set();
	const matching = [...active].find((entry) => entry.requestKey === requestKey && entry.appConfig === params.appConfig && entry.signal === params.signal);
	if (matching) return await matching.promise;
	const promise = withMemoryWikiVaultMutation(params.config.vault.path, () => syncMemoryWikiImportedSourcesOnce(params));
	const entry = {
		requestKey,
		appConfig: params.appConfig,
		signal: params.signal,
		promise
	};
	active.add(entry);
	activeImportedSourceSyncs.set(vaultKey, active);
	try {
		return await promise;
	} finally {
		active.delete(entry);
		if (active.size === 0) activeImportedSourceSyncs.delete(vaultKey);
	}
}
async function waitForMemoryWikiImportedSourceSyncs() {
	await Promise.allSettled([...activeImportedSourceSyncs.values()].flatMap((entries) => [...entries].map((entry) => entry.promise)));
}
//#endregion
//#region extensions/memory-wiki/src/status.ts
const STATUS_WARNING_FIXES = {
	"vault-missing": "Run `openclaw wiki init` to create the vault layout.",
	"obsidian-cli-missing": "Install the official Obsidian CLI or disable `obsidian.useOfficialCli`.",
	"bridge-disabled": "Enable `plugins.entries.memory-wiki.config.bridge.enabled` or switch vaultMode away from `bridge`.",
	"bridge-artifacts-missing": "Use a memory plugin that exports public artifacts, create/import memory artifacts first, or switch the wiki back to isolated mode.",
	"unsafe-local-disabled": "Enable `unsafeLocal.allowPrivateMemoryCoreAccess` or switch vaultMode away from `unsafe-local`.",
	"unsafe-local-paths-missing": "Add explicit `unsafeLocal.paths` entries before running unsafe-local imports.",
	"unsafe-local-without-mode": "Disable private memory-core access unless you explicitly want unsafe-local mode."
};
function createEmptyVaultCounts() {
	return {
		pageCounts: {
			entity: 0,
			concept: 0,
			source: 0,
			synthesis: 0,
			report: 0
		},
		sourceCounts: {
			native: 0,
			bridge: 0,
			bridgeEvents: 0,
			unsafeLocal: 0,
			other: 0
		}
	};
}
async function collectVaultCounts(vaultPath) {
	const { pageCounts, sourceCounts } = createEmptyVaultCounts();
	for (const { dir, kind } of WIKI_PAGE_GROUPS) await runTasksWithConcurrency({
		tasks: (await listMemoryWikiPagePaths(vaultPath, dir)).map((relativePath) => async () => {
			const raw = await fs$1.readFile(path.join(vaultPath, relativePath), "utf8").catch(() => null);
			if (raw === null) return;
			let frontmatter;
			try {
				frontmatter = parseWikiMarkdown(raw).frontmatter;
			} catch {
				return;
			}
			pageCounts[kind] += 1;
			if (kind !== "source") return;
			const sourceType = normalizeOptionalString(frontmatter.sourceType);
			if (sourceType === "memory-bridge-events") sourceCounts.bridgeEvents += 1;
			else if (sourceType === "memory-bridge") sourceCounts.bridge += 1;
			else if (normalizeOptionalString(frontmatter.provenanceMode) === "unsafe-local" || sourceType === "memory-unsafe-local") sourceCounts.unsafeLocal += 1;
			else if (!sourceType) sourceCounts.native += 1;
			else sourceCounts.other += 1;
		}),
		limit: 16,
		errorMode: "stop",
		throwOnError: true
	});
	return {
		pageCounts,
		sourceCounts
	};
}
function buildWarnings(params) {
	const { config, bridgePublicArtifactCount, vaultExists, obsidianCommand } = params;
	return [
		[
			!vaultExists,
			"vault-missing",
			"Wiki vault has not been initialized yet."
		],
		[
			config.obsidian.enabled && config.obsidian.useOfficialCli && !obsidianCommand,
			"obsidian-cli-missing",
			"Obsidian CLI is enabled in config but `obsidian` is not available on PATH."
		],
		[
			config.vaultMode === "bridge" && !config.bridge.enabled,
			"bridge-disabled",
			"vaultMode is `bridge` but bridge.enabled is false."
		],
		[
			config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts && bridgePublicArtifactCount === 0,
			"bridge-artifacts-missing",
			"Bridge mode is enabled but the active memory plugin is not exporting any public memory artifacts yet."
		],
		[
			config.vaultMode === "unsafe-local" && !config.unsafeLocal.allowPrivateMemoryCoreAccess,
			"unsafe-local-disabled",
			"vaultMode is `unsafe-local` but private memory-core access is disabled."
		],
		[
			config.vaultMode === "unsafe-local" && config.unsafeLocal.allowPrivateMemoryCoreAccess && config.unsafeLocal.paths.length === 0,
			"unsafe-local-paths-missing",
			"unsafe-local access is enabled but no private paths are configured."
		],
		[
			config.vaultMode !== "unsafe-local" && config.unsafeLocal.allowPrivateMemoryCoreAccess,
			"unsafe-local-without-mode",
			"Private memory-core access is enabled outside unsafe-local mode."
		]
	].flatMap(([matches, code, message]) => matches ? [{
		code,
		message
	}] : []);
}
async function resolveMemoryWikiStatus(config, deps) {
	const agentId = resolveMemoryWikiVaultAgentId(config);
	const vaultExists = await (deps?.pathExists ?? pathExists)(config.vault.path);
	const bridgePublicArtifactCount = deps?.appConfig && config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts ? filterMemoryWikiBridgeArtifacts({
		config,
		callerAgentId: deps.callerAgentId,
		artifacts: await (deps.listPublicArtifacts ?? listActiveMemoryPublicArtifacts)({ cfg: deps.appConfig })
	}).length : null;
	const obsidianProbe = await probeObsidianCli({ resolveCommand: deps?.resolveCommand });
	const counts = vaultExists ? await collectVaultCounts(config.vault.path) : createEmptyVaultCounts();
	return {
		vaultScope: config.vault.scope,
		agentId,
		vaultMode: config.vaultMode,
		renderMode: config.vault.renderMode,
		vaultPath: config.vault.path,
		vaultExists,
		bridge: config.bridge,
		bridgePublicArtifactCount,
		obsidianCli: {
			enabled: config.obsidian.enabled,
			requested: config.obsidian.enabled && config.obsidian.useOfficialCli,
			available: obsidianProbe.available,
			command: obsidianProbe.command
		},
		unsafeLocal: {
			allowPrivateMemoryCoreAccess: config.unsafeLocal.allowPrivateMemoryCoreAccess,
			pathCount: config.unsafeLocal.paths.length
		},
		pageCounts: counts.pageCounts,
		sourceCounts: counts.sourceCounts,
		warnings: buildWarnings({
			config,
			bridgePublicArtifactCount,
			vaultExists,
			obsidianCommand: obsidianProbe.command
		})
	};
}
function buildMemoryWikiDoctorReport(status) {
	const fixes = status.warnings.map((warning) => ({
		code: warning.code,
		message: Object.hasOwn(STATUS_WARNING_FIXES, warning.code) ? STATUS_WARNING_FIXES[warning.code] : STATUS_WARNING_FIXES["unsafe-local-without-mode"]
	}));
	return {
		healthy: status.warnings.length === 0,
		warningCount: status.warnings.length,
		status,
		fixes
	};
}
function renderMemoryWikiStatus(status) {
	const lines = [
		`Wiki vault mode: ${status.vaultMode}`,
		`Vault scope: ${status.vaultScope}${status.agentId ? ` (${status.agentId})` : ""}`,
		`Vault: ${status.vaultExists ? "ready" : "missing"} (${status.vaultPath})`,
		`Render mode: ${status.renderMode}`,
		`Obsidian CLI: ${status.obsidianCli.available ? "available" : "missing"}${status.obsidianCli.requested ? " (requested)" : ""}`,
		`Bridge: ${status.bridge.enabled ? "enabled" : "disabled"}${typeof status.bridgePublicArtifactCount === "number" ? ` (${status.bridgePublicArtifactCount} exported artifact${status.bridgePublicArtifactCount === 1 ? "" : "s"})` : ""}`,
		`Unsafe local: ${status.unsafeLocal.allowPrivateMemoryCoreAccess ? `enabled (${status.unsafeLocal.pathCount} paths)` : "disabled"}`,
		`Pages: ${status.pageCounts.source} sources, ${status.pageCounts.entity} entities, ${status.pageCounts.concept} concepts, ${status.pageCounts.synthesis} syntheses, ${status.pageCounts.report} reports`,
		`Source provenance: ${status.sourceCounts.native} native, ${status.sourceCounts.bridge} bridge, ${status.sourceCounts.bridgeEvents} bridge-events, ${status.sourceCounts.unsafeLocal} unsafe-local, ${status.sourceCounts.other} other`
	];
	if (status.warnings.length > 0) {
		lines.push("", "Warnings:");
		for (const warning of status.warnings) lines.push(`- ${warning.message}`);
	}
	return lines.join("\n");
}
function renderMemoryWikiDoctor(report) {
	const lines = [
		report.healthy ? "Wiki doctor: healthy" : `Wiki doctor: ${report.warningCount} issue(s) found`,
		"",
		renderMemoryWikiStatus(report.status)
	];
	if (report.fixes.length > 0) {
		lines.push("", "Suggested fixes:");
		for (const fix of report.fixes) lines.push(`- ${fix.message}`);
	}
	return lines.join("\n");
}
//#endregion
//#region extensions/memory-wiki/src/presentation.ts
function renderWikiSearchResults(results) {
	return results.length === 0 ? "No wiki or memory results." : results.map((result, index) => `${index + 1}. ${result.title} (${result.corpus}/${result.kind})\n${result.path ? `Path: ${result.path}` : `Lookup: ${result.lookup}`}${typeof result.startLine === "number" && typeof result.endLine === "number" ? `\nLines: ${result.startLine}-${result.endLine}` : ""}${result.provenanceLabel ? `\nProvenance: ${result.provenanceLabel}` : ""}${result.matchedClaimId ? `\nClaim: ${result.matchedClaimId}` : ""}${result.evidenceKinds && result.evidenceKinds.length > 0 ? `\nEvidence: ${result.evidenceKinds.join(", ")}` : ""}\nSnippet: ${result.snippet}`).join("\n\n");
}
function renderWikiMutationSummary(result) {
	return `${result.changed ? "Updated" : "No changes for"} ${result.pagePath} via ${result.operation}. ${result.compile.updatedFiles.length > 0 ? `Refreshed ${result.compile.updatedFiles.length} index file${result.compile.updatedFiles.length === 1 ? "" : "s"}.` : "Indexes unchanged."}`;
}
//#endregion
export { loadMemoryWikiValidatedVaultIdentity as A, setMemoryWikiDashboardState as B, WIKI_SEARCH_MODES as C, resolveMemoryWikiTimestamp as D, initializeMemoryWikiVault as E, deactivateMemoryWikiCompiledCacheOwnersExcept as F, loadMemoryWikiCompiledCache as I, loadMemoryWikiCompiledDashboards as L, activateMemoryWikiCompiledCacheOwner as M, configureMemoryWikiCompiledCacheStore as N, appendMemoryWikiLog as O, createMemoryWikiCompiledCacheStore as P, reconcileMemoryWikiCompiledCacheOwner as R, withMemoryWikiVaultMutation as S, searchMemoryWiki as T, compileMemoryWikiVault as _, renderMemoryWikiStatus as a, readWikiPageStat as b, waitForMemoryWikiImportedSourceSyncs as c, probeObsidianCli as d, runObsidianAction as f, normalizeMemoryWikiMutationInput as g, applyMemoryWikiMutation as h, renderMemoryWikiDoctor as i, MemoryWikiDashboardUnavailableError as j, ensureMemoryWikiVaultGeneration as k, OBSIDIAN_ACTIONS as l, ingestMemoryWikiSource as m, renderWikiSearchResults as n, resolveMemoryWikiStatus as o, lintMemoryWikiVault as p, buildMemoryWikiDoctorReport as r, syncMemoryWikiImportedSources as s, renderWikiMutationSummary as t, assertOfficialObsidianCliSupported as u, readExistingWikiPage as v, getMemoryWikiPage as w, writeGuardedVaultPage as x, readExistingWikiPageUtf8 as y, resolveMemoryWikiCompiledCacheOwnerId as z };
