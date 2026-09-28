import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as legacyLeaseSelector, r as projectCrabboxLegacyWarmLeases } from "./crabbox-worker-warm-image-records-CKlhPK62.mjs";
//#region extensions/crabbox/src/crabbox-worker-warm-image-store.ts
var CrabboxWarmImageRequestError = class extends Error {};
const WARM_IMAGE_MAX_ALLOCATIONS = 256;
const CAPTURE_WARNING_AGE_MS = 12e5;
const openLegacyLeases = (state, env) => state.openKeyedStore({
	namespace: "warm-leases",
	maxEntries: 256,
	overflowPolicy: "evict-oldest",
	...env ? { env } : {}
});
async function listCrabboxLegacyWarmLeases(state, env) {
	return projectCrabboxLegacyWarmLeases(await openLegacyLeases(state, env).entries());
}
async function assertCrabboxWarmImageMigrationReady(state) {
	const leases = openLegacyLeases(state);
	if ((leases.count ? await leases.count() : (await leases.entries()).length) > 0) throw new Error("Crabbox has legacy worker allocations whose original image choices are unknown; run openclaw doctor --fix and follow its provider-cleanup recovery instructions before provisioning workers.");
}
function requireCanonicalProfile(record) {
	if (record && record.version !== 3) throw new Error("Crabbox warm-image state requires migration; run openclaw doctor --fix before provisioning workers.");
	const preparationKey = (value) => value === null || typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
	const demandAtMs = (value) => value === null || typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
	const cacheIdentity = (value) => preparationKey(value.cacheKey) && (value.cacheKey === null ? value.purpose === null : value.preparationKey !== null && (value.purpose === "session" || value.purpose === "reserve"));
	const validImage = (image) => isRecord(image) && preparationKey(image.preparationKey) && cacheIdentity(image) && demandAtMs(image.lastDemandAtMs) && (image.pinned === void 0 || isRecord(image.pinned) && Number.isSafeInteger(image.pinned.atMs) && image.pinned.atMs >= 0);
	const validGeneration = (value) => isRecord(value) && Object.keys(value).length === 2 && typeof value.checkpointId === "string" && Boolean(value.checkpointId.trim()) && typeof value.createdAtMs === "number" && Number.isSafeInteger(value.createdAtMs) && value.createdAtMs >= 0;
	if (record && (!isRecord(record.allocations) || record.image && !validImage(record.image) || record.previous && !validImage(record.previous) || Object.values(record.allocations).some((allocation) => !isRecord(allocation) || !preparationKey(allocation.preparationKey) || !cacheIdentity(allocation) || !demandAtMs(allocation.demandAtMs) || allocation.preparationKey !== null && allocation.demandAtMs === null || allocation.imageGeneration !== null && !validGeneration(allocation.imageGeneration) || allocation.publicationBase !== void 0 && !validGeneration(allocation.publicationBase)))) throw new Error("Crabbox warm-image preparation state is invalid; run openclaw doctor --fix.");
	return record;
}
const sameCrabboxWarmImageGeneration = (left, right) => left?.checkpointId === right?.checkpointId && left?.createdAtMs === right?.createdAtMs;
function withCrabboxWarmImageGeneration(record, generation, update) {
	if (!record || !generation) return;
	const field = sameCrabboxWarmImageGeneration(record.image, generation) ? "image" : "previous";
	const image = record[field];
	if (!image || !sameCrabboxWarmImageGeneration(image, generation)) return;
	const next = update(image);
	return next ? {
		...record,
		[field]: next
	} : void 0;
}
const isCrabboxWarmImageHeld = (record, checkpointId) => Object.values(record.allocations).some(({ choice, imageGeneration }) => choice.kind === "checkpoint" && choice.checkpointId === checkpointId || imageGeneration?.checkpointId === checkpointId);
function withCrabboxWarmImageDisplayFacts(record, facts = {}) {
	const next = {
		...record,
		...facts
	};
	for (const field of [
		"profileId",
		"backend",
		"machineClass",
		"os",
		"projectLabel",
		"projectRoot"
	]) if (next[field] === void 0) delete next[field];
	return next;
}
async function compareProfile(store, key, prepare) {
	if (!store.observe || !store.compareAndApply) throw new Error("Crabbox warm images require atomic asynchronous plugin state support.");
	let observation = await store.observe(key);
	for (;;) {
		const result = await store.compareAndApply(key, observation.comparison, prepare(observation.value));
		if (result.status !== "conflict") return result.status === "applied";
		observation = result.current;
	}
}
function openCrabboxWarmImageStore(state, env) {
	const store = state.openKeyedStore({
		namespace: "warm-images",
		maxEntries: 128,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
	const canonical = {
		count: () => store.count ? store.count() : store.entries().then((entries) => entries.length),
		deleteIf(key, predicate) {
			return compareProfile(store, key, (current) => ({
				operation: "delete",
				action: current && predicate(requireCanonicalProfile(current)) ? "delete" : "keep"
			}));
		},
		async lookup(key) {
			return requireCanonicalProfile(await store.lookup(key));
		},
		async entries() {
			const entries = await store.entries();
			for (const entry of entries) requireCanonicalProfile(entry.value);
			return entries;
		},
		update(key, update) {
			return compareProfile(store, key, (current) => {
				const value = update(requireCanonicalProfile(current));
				return value === void 0 ? {
					operation: "update",
					action: "keep"
				} : {
					operation: "update",
					action: "set",
					value
				};
			});
		}
	};
	const lookupLease = async (id) => {
		const entries = (await canonical.entries()).filter(({ value }) => Object.hasOwn(value.allocations, id));
		if (entries.length > 1) throw new Error(`Crabbox lease ${id} has conflicting warm-image owners; run openclaw doctor --fix.`);
		const entry = entries[0];
		return entry ? {
			key: entry.key,
			projectKey: entry.value.projectKey,
			...entry.value.allocations[id]
		} : void 0;
	};
	const markPhase = async (id, phase, baseCommit, assertCurrent) => {
		const owner = await lookupLease(id);
		if (!owner) return;
		if (phase === "prepared" && (!baseCommit || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(baseCommit))) throw new Error("Crabbox project preparation requires a verified Git commit.");
		let rejection;
		await canonical.update(owner.key, (record) => {
			assertCurrent?.();
			rejection = void 0;
			const allocation = record?.allocations[id];
			if (!record || !allocation) {
				rejection = "Crabbox allocation closed before preparation completed.";
				return;
			}
			if (record.operation?.type === "capture" && record.operation.leaseId === id) {
				rejection = "Crabbox allocation cannot enroll while its image capture is unresolved.";
				return;
			}
			if (baseCommit && allocation.baseCommit && baseCommit !== allocation.baseCommit) {
				rejection = "Crabbox provision retry changed its prepared Git commit.";
				return;
			}
			if (phase === "enrolled" && record.projectKey && allocation.phase === "pending") {
				rejection = "Crabbox project allocation must be prepared before enrollment.";
				return;
			}
			return {
				...record,
				allocations: {
					...record.allocations,
					[id]: {
						...allocation,
						phase: allocation.phase === "enrolled" ? "enrolled" : phase,
						...baseCommit ? { baseCommit } : {}
					}
				}
			};
		});
		if (rejection) throw new Error(rejection);
	};
	return {
		...canonical,
		lookupLease,
		async recordAllocation(params) {
			let rejection;
			let acceptedOwnerJson;
			await canonical.update(params.key, (current) => {
				params.assertCurrent();
				rejection = void 0;
				acceptedOwnerJson = void 0;
				const record = withCrabboxWarmImageDisplayFacts(current ?? {
					version: 3,
					allocations: {},
					...params.projectKey ? { projectKey: params.projectKey } : {}
				}, params.displayFacts);
				if (Object.hasOwn(record.allocations, params.id)) {
					acceptedOwnerJson = JSON.stringify({
						key: params.key,
						projectKey: record.projectKey,
						...record.allocations[params.id]
					});
					return params.displayFacts ? record : void 0;
				}
				if (Object.keys(record.allocations).length >= WARM_IMAGE_MAX_ALLOCATIONS) {
					rejection = "Crabbox warm-image allocation capacity is full; stop outstanding workers before retrying.";
					return;
				}
				const choice = params.availableImage && record.image && sameCrabboxWarmImageGeneration(record.image, params.availableImage) && !(record.operation?.type === "retire" && record.operation.checkpointId === record.image.checkpointId) ? {
					kind: "checkpoint",
					checkpointId: record.image.checkpointId
				} : { kind: "cold" };
				const next = {
					...record,
					allocations: {
						...record.allocations,
						[params.id]: {
							choice,
							...params.allocation,
							imageGeneration: choice.kind === "checkpoint" ? {
								checkpointId: choice.checkpointId,
								createdAtMs: record.image.createdAtMs
							} : null,
							...choice.kind === "cold" && record.image?.pinned ? { publicationBase: {
								checkpointId: record.image.checkpointId,
								createdAtMs: record.image.createdAtMs
							} } : {}
						}
					}
				};
				acceptedOwnerJson = JSON.stringify({
					key: params.key,
					projectKey: next.projectKey,
					...next.allocations[params.id]
				});
				return next;
			});
			if (rejection) throw new Error(rejection);
			const owner = await lookupLease(params.id);
			if (!owner || JSON.stringify(owner) !== acceptedOwnerJson) throw new Error("Crabbox allocation changed before provisioning completed; retry the worker operation.");
			return owner;
		},
		markPrepared: (id, baseCommit, assertCurrent) => markPhase(id, "prepared", baseCommit, assertCurrent),
		markEnrolled: (id, assertCurrent) => markPhase(id, "enrolled", void 0, assertCurrent),
		async notePreparedDemand(id, preparation) {
			const owner = await lookupLease(id);
			const generation = owner?.imageGeneration;
			if (!owner || owner.phase !== "enrolled" || owner.preparationKey !== preparation.preparationKey || owner.cacheKey === null || !generation || !Number.isSafeInteger(preparation.demandAtMs) || preparation.demandAtMs < 0) return;
			await canonical.update(owner.key, (record) => record && record.allocations[id]?.preparationKey === owner.preparationKey && record.allocations[id]?.cacheKey === owner.cacheKey && record.allocations[id]?.purpose === owner.purpose && record.allocations[id]?.phase === "enrolled" && sameCrabboxWarmImageGeneration(record.allocations[id]?.imageGeneration, generation) ? withCrabboxWarmImageGeneration(record, generation, (image) => image.cacheKey === owner.cacheKey ? {
				...image,
				lastDemandAtMs: Math.max(image.lastDemandAtMs ?? 0, preparation.demandAtMs)
			} : void 0) : void 0);
		}
	};
}
function withoutCrabboxWarmImageOperation(record) {
	const profile = { ...record };
	delete profile.operation;
	return profile;
}
function crabboxWarmImageCaptureStatus(_key, record) {
	const capture = record.operation?.type === "capture" ? record.operation : void 0;
	if (!capture) return;
	return {
		selector: capture.id,
		startedAtMs: capture.startedAtMs,
		...capture.leaseId ? { leaseId: capture.leaseId } : {},
		...capture.provider ? { provider: capture.provider } : {},
		phase: capture.phase,
		stale: Date.now() - capture.startedAtMs >= CAPTURE_WARNING_AGE_MS
	};
}
function isCrabboxWarmImageCaptureUncertain(capture) {
	return capture.phase === "uncertain";
}
const CRABBOX_WARM_IMAGE_WAIT_HINT = "The capture may still be preparing its source or waiting for provider readiness. Inspect openclaw crabbox warm-images --json and allow the owning capture to settle.";
function crabboxWarmImageRecoveryHint(selector) {
	return `Stop the owning Gateway and capture processes, confirm any worker being recovered is stopped, and resolve any untracked checkpoint in the Crabbox catalog before running: openclaw crabbox warm-images --recover ${selector} --acknowledge-provider-cleanup. Then restart the Gateway; the next eligible worker can capture again.`;
}
async function listCrabboxWarmImages(state, env) {
	return (await openCrabboxWarmImageStore(state, env).entries()).map(({ key, value }) => projectCrabboxWarmImage(key, value));
}
function projectCrabboxWarmImage(key, value) {
	requireCanonicalProfile(value);
	return {
		profileKey: key,
		profileId: value.profileId,
		backend: value.backend,
		machineClass: value.machineClass,
		os: value.os,
		projectLabel: value.projectLabel,
		projectRoot: value.projectRoot,
		projectKey: value.projectKey,
		checkpointId: value.image?.checkpointId,
		state: value.image?.state ?? "no-image",
		createdAtMs: value.image?.createdAtMs,
		preparationKey: value.image?.preparationKey,
		cacheKey: value.image?.cacheKey,
		purpose: value.image?.purpose,
		lastDemandAtMs: value.image?.lastDemandAtMs,
		baseCommit: value.image?.baseCommit,
		runtimeIdentity: value.image?.runtimeIdentity,
		pinned: value.image?.pinned,
		previous: value.previous ? {
			checkpointId: value.previous.checkpointId,
			createdAtMs: value.previous.createdAtMs,
			baseCommit: value.previous.baseCommit,
			runtimeIdentity: value.previous.runtimeIdentity,
			pinned: value.previous.pinned,
			held: isCrabboxWarmImageHeld(value, value.previous.checkpointId)
		} : void 0,
		allocations: value.allocations,
		capture: crabboxWarmImageCaptureStatus(key, value),
		retirement: value.operation?.type === "retire" ? { checkpointId: value.operation.checkpointId } : void 0
	};
}
/** Recovery closes only the capture generation; allocation decisions remain authoritative. */
async function clearCrabboxWarmImageCapture(store, key, selector) {
	const matches = (current) => current.operation?.type === "capture" && current.operation.id === selector;
	if (await store.deleteIf(key, (current) => !current.image && !current.previous && Object.keys(current.allocations).length === 0 && matches(current))) return true;
	return store.update(key, (current) => current && matches(current) ? withoutCrabboxWarmImageOperation(current) : void 0);
}
async function recoverCrabboxWarmImageCapture(state, selector, acknowledgeProviderCleanup) {
	if (!acknowledgeProviderCleanup) throw new Error("Recovery requires --acknowledge-provider-cleanup: confirm the original Gateway/capture processes and any worker being recovered are stopped, and any untracked provider artifact has been resolved. No state was changed.");
	if (selector.startsWith("legacy-lease-")) {
		const store = openLegacyLeases(state);
		const entry = (await store.entries()).find(({ key, value }) => legacyLeaseSelector(key, value) === selector);
		if (!entry || !await compareProfile(store, entry.key, (value) => ({
			operation: "delete",
			action: value !== void 0 && legacyLeaseSelector(entry.key, value) === selector ? "delete" : "keep"
		}))) throw new Error("Legacy allocation selector is absent or changed; rerun openclaw crabbox warm-images --json. No state was changed.");
		return;
	}
	const store = openCrabboxWarmImageStore(state);
	const entry = (await store.entries()).find(({ key, value }) => crabboxWarmImageCaptureStatus(key, value)?.selector === selector);
	if (!entry || !await clearCrabboxWarmImageCapture(store, entry.key, selector)) throw new Error("Capture selector is absent or changed; rerun openclaw crabbox warm-images --json. No state was changed.");
}
//#endregion
export { withoutCrabboxWarmImageOperation as _, crabboxWarmImageCaptureStatus as a, isCrabboxWarmImageHeld as c, openCrabboxWarmImageStore as d, projectCrabboxWarmImage as f, withCrabboxWarmImageGeneration as g, withCrabboxWarmImageDisplayFacts as h, clearCrabboxWarmImageCapture as i, listCrabboxLegacyWarmLeases as l, sameCrabboxWarmImageGeneration as m, CrabboxWarmImageRequestError as n, crabboxWarmImageRecoveryHint as o, recoverCrabboxWarmImageCapture as p, assertCrabboxWarmImageMigrationReady as r, isCrabboxWarmImageCaptureUncertain as s, CRABBOX_WARM_IMAGE_WAIT_HINT as t, listCrabboxWarmImages as u };
