import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { h as shouldRunSessionEntryMaintenance, l as pruneStaleEntries, m as shouldRunModelRunPrune, n as capEntryCount, t as archiveStaleDashboardEntries, u as pruneStaleModelRunEntries } from "./store-maintenance-C5xEVYop.mjs";
//#region src/config/sessions/store-maintenance-plan.ts
/** Mutate working images only; callers own warn mode, protected keys, reads, and persistence. */
function planSessionEntryMaintenance(params) {
	const runModelRunPrune = shouldRunModelRunPrune({
		maintenance: params.maintenance,
		entryCount: params.initialUnarchivedCount,
		force: params.forceMaintenance
	});
	const candidateAges = [
		params.maintenance.pruneAfterMs,
		params.maintenance.archiveDashboardAfterMs,
		runModelRunPrune ? params.maintenance.modelRunPruneAfterMs : null
	].filter((age) => age != null && age > 0);
	const store = params.readAgeCandidates(candidateAges.length > 0 ? Math.min(...candidateAges) : null);
	let remainingUnarchivedCount = params.initialUnarchivedCount;
	const counts = {
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const options = {
		log: params.log,
		preserveRecentMs: params.maintenance.preserveRecentMs
	};
	let protectedOptions;
	const readProtectedOptions = () => protectedOptions ??= {
		...options,
		preserveKeys: params.readPreserveKeys()
	};
	const ageOptions = Object.keys(store).length > 0 ? readProtectedOptions() : options;
	const recordRemoval = (candidate, reason) => {
		remainingUnarchivedCount -= 1;
		params.onRemoved?.(candidate, reason);
	};
	const recordArchive = (candidate, phase) => {
		remainingUnarchivedCount -= 1;
		counts.archived += 1;
		if (phase === "cap") counts.capArchived += 1;
		params.onArchived?.(candidate, phase);
	};
	const archiveDashboards = () => archiveStaleDashboardEntries(store, params.maintenance.archiveDashboardAfterMs, {
		...ageOptions,
		onArchived: (candidate) => recordArchive(candidate, "dashboard")
	});
	if (params.profile === "legacy-read") archiveDashboards();
	if (runModelRunPrune) counts.modelRunPruned = pruneStaleModelRunEntries(store, params.maintenance.modelRunPruneAfterMs, {
		...ageOptions,
		onPruned: (candidate) => recordRemoval(candidate, "model-run-pruned")
	});
	if (params.profile === "write") archiveDashboards();
	if (params.profile === "write" || remainingUnarchivedCount > params.maintenance.maxEntries) {
		counts.pruned = pruneStaleEntries(store, params.maintenance.pruneAfterMs, {
			...ageOptions,
			onPruned: (candidate) => recordRemoval(candidate, "pruned"),
			onArchived: (candidate) => recordArchive(candidate, "age")
		});
		if (shouldRunSessionEntryMaintenance({
			entryCount: remainingUnarchivedCount,
			maxEntries: params.maintenance.maxEntries,
			force: params.forceMaintenance
		})) {
			const cap = params.readCapCandidates(remainingUnarchivedCount);
			if (cap && Object.keys(cap.store).length > 0) counts.capped = capEntryCount(cap.store, cap.maxEntries, {
				...readProtectedOptions(),
				onArchived: (candidate) => {
					if (cap.store !== store) store[candidate.key] = candidate.entry;
					recordArchive(candidate, "cap");
				},
				onRemoved: (candidate) => recordRemoval(candidate, "capped")
			});
		}
	}
	return {
		store,
		...counts
	};
}
//#endregion
//#region src/config/sessions/store-maintenance-preserve-snapshot.ts
function collectSessionWorkAdmissionKeysFromSnapshot(store, identities) {
	if (identities.length === 0) return /* @__PURE__ */ new Set();
	const active = new Set(identities);
	const normalized = new Set(identities.map(normalizeStoreSessionKey));
	const keys = /* @__PURE__ */ new Set();
	for (const [key, entry] of Object.entries(store)) {
		const normalizedKey = normalizeStoreSessionKey(key);
		if (normalized.has(normalizedKey) || active.has(entry.sessionId)) {
			keys.add(key);
			keys.add(normalizedKey);
		}
	}
	return keys;
}
/** Resolve parent-owned protection against the worker's current row projection. */
function resolveSessionMaintenancePreserveKeys(params) {
	const keys = new Set(params.snapshot.providerKeys);
	for (const key of params.baseKeys ?? []) {
		const normalized = normalizeStoreSessionKey(key ?? "");
		if (normalized) keys.add(normalized);
	}
	for (const key of collectSessionWorkAdmissionKeysFromSnapshot(params.store, params.snapshot.workIdentities)) keys.add(key);
	if (params.snapshot.lifecycleIdentities.length > 0) {
		const lifecycle = new Set(params.snapshot.lifecycleIdentities);
		for (const [key, entry] of Object.entries(params.store)) {
			const normalizedKey = normalizeStoreSessionKey(key);
			if ([
				key,
				normalizedKey,
				entry.sessionId
			].some((identity) => Boolean(identity?.trim()) && lifecycle.has(identity.trim()))) {
				keys.add(key);
				keys.add(normalizedKey);
			}
		}
	}
	return keys;
}
//#endregion
export { resolveSessionMaintenancePreserveKeys as n, planSessionEntryMaintenance as r, collectSessionWorkAdmissionKeysFromSnapshot as t };
