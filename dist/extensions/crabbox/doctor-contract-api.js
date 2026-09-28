import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { r as projectCrabboxLegacyWarmLeases, t as crabboxLegacyWarmImageCaptureSelector } from "../../crabbox-worker-warm-image-records-CKlhPK62.mjs";
//#region extensions/crabbox/doctor-contract-api.ts
const imageFields = /* @__PURE__ */ new Set([
	"checkpointId",
	"kind",
	"state",
	"createdAtMs",
	"lastUsedAtMs",
	"baseCommit",
	"operation",
	"runtimeIdentity"
]);
const captureFields = /* @__PURE__ */ new Set([
	"type",
	"id",
	"startedAtMs",
	"leaseId",
	"provider",
	"phase"
]);
const retirementFields = /* @__PURE__ */ new Set(["type", "checkpointId"]);
const profileFields = /* @__PURE__ */ new Set([
	"version",
	"projectKey",
	"image",
	"allocations",
	"operation"
]);
const allocationFields = /* @__PURE__ */ new Set([
	"choice",
	"machineClass",
	"os",
	"phase",
	"baseCommit",
	"runtimeIdentity"
]);
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
const timestamp = (value) => typeof value === "number" && Number.isFinite(value);
function isLegacyOperation(value) {
	if (value === void 0) return true;
	const operation = asOptionalRecord(value);
	if (!operation) return false;
	if (operation.type === "retire") return Object.keys(operation).every((key) => retirementFields.has(key)) && nonempty(operation.checkpointId);
	return operation.type === "capture" && Object.keys(operation).every((key) => captureFields.has(key)) && nonempty(operation.id) && timestamp(operation.startedAtMs) && (operation.leaseId === void 0 || nonempty(operation.leaseId)) && (operation.provider === void 0 || nonempty(operation.provider)) && (operation.phase === "scrubbing" || operation.phase === "creating" || operation.phase === "uncertain");
}
function isLegacyImage(value) {
	const image = asOptionalRecord(value);
	return Boolean(image && Object.keys(image).every((key) => imageFields.has(key)) && typeof image.checkpointId === "string" && typeof image.kind === "string" && (image.state === "pending" || image.state === "available") && timestamp(image.createdAtMs) && timestamp(image.lastUsedAtMs) && (image.baseCommit === void 0 || nonempty(image.baseCommit)) && (image.checkpointId ? nonempty(image.checkpointId) && nonempty(image.kind) : image.kind === "" && image.state === "pending") && isLegacyOperation(image.operation));
}
function isLegacyAllocation(value) {
	const allocation = asOptionalRecord(value);
	const choice = asOptionalRecord(allocation?.choice);
	return Boolean(allocation && choice && Object.keys(allocation).every((key) => allocationFields.has(key)) && nonempty(allocation.machineClass) && (allocation.os === void 0 || allocation.os === "linux" || allocation.os === "windows/wsl2") && (allocation.phase === "pending" || allocation.phase === "prepared" || allocation.phase === "enrolled") && (allocation.baseCommit === void 0 || nonempty(allocation.baseCommit)) && (choice.kind === "cold" ? Object.keys(choice).every((key) => key === "kind") : choice.kind === "checkpoint" && Object.keys(choice).every((key) => key === "kind" || key === "checkpointId") && nonempty(choice.checkpointId)));
}
function isLegacyProfile(value) {
	const profile = asOptionalRecord(value);
	const allocations = asOptionalRecord(profile?.allocations);
	return Boolean(profile?.version === 2 && Object.keys(profile).every((key) => profileFields.has(key)) && (profile.projectKey === void 0 || nonempty(profile.projectKey)) && (profile.image === void 0 || isLegacyImage(profile.image) && profile.image.operation === void 0) && allocations && Object.values(allocations).every(isLegacyAllocation) && isLegacyOperation(profile.operation));
}
function migrateImage({ lastUsedAtMs: _lastUsedAtMs, operation: _operation, ...image }) {
	return {
		...image,
		lastDemandAtMs: null,
		preparationKey: null,
		cacheKey: null,
		purpose: null
	};
}
async function listLegacyWarmLeases(context) {
	return projectCrabboxLegacyWarmLeases(await context.openPluginStateKeyedStore({
		namespace: "warm-leases",
		maxEntries: 256,
		overflowPolicy: "evict-oldest"
	}).entries());
}
const stateMigrations = [{
	id: "crabbox-warm-profile-v3",
	label: "Crabbox warm profiles",
	doctorOnly: true,
	async detectLegacyState({ context }) {
		const pending = (await context.openPluginStateKeyedStore({
			namespace: "warm-images",
			maxEntries: 128,
			overflowPolicy: "reject-new"
		}).entries()).filter(({ value }) => asOptionalRecord(value)?.version !== 3).length;
		const leases = await listLegacyWarmLeases(context);
		return pending || leases.length ? { preview: [...pending ? [`- ${pending} Crabbox warm-image row(s) require preparation/cache-record migration or manual repair.`] : [], ...leases.map((lease) => `- Legacy Crabbox lease ${lease.leaseId} requires provider cleanup acknowledgement: openclaw crabbox warm-images --recover ${lease.selector} --acknowledge-provider-cleanup`)] } : null;
	},
	async migrateLegacyState({ context }) {
		const changes = [];
		const warnings = [];
		const store = context.openPluginStateKeyedStore({
			namespace: "warm-images",
			maxEntries: 128,
			overflowPolicy: "reject-new"
		});
		for (const { key, value } of await store.entries()) {
			if (asOptionalRecord(value)?.version === 3) continue;
			let migrated;
			if (isLegacyProfile(value)) {
				const { image, allocations, ...profile } = value;
				migrated = {
					...profile,
					version: 3,
					...image ? { image: migrateImage(image) } : {},
					allocations: Object.fromEntries(Object.entries(allocations).map(([id, allocation]) => [id, {
						...allocation,
						preparationKey: null,
						cacheKey: null,
						purpose: null,
						demandAtMs: null,
						imageGeneration: null
					}]))
				};
			} else if (isLegacyImage(value)) {
				const { operation } = value;
				migrated = {
					version: 3,
					...value.checkpointId ? { image: migrateImage(value) } : {},
					allocations: {},
					...operation ? { operation } : !value.checkpointId ? { operation: {
						type: "capture",
						id: crabboxLegacyWarmImageCaptureSelector(key, value),
						startedAtMs: value.createdAtMs,
						phase: "uncertain"
					} } : {}
				};
			} else {
				warnings.push(`Crabbox warm profile ${key} has an unsupported record; left it unchanged for manual repair.`);
				continue;
			}
			try {
				if (await store.update?.(key, (current) => JSON.stringify(current) === JSON.stringify(value) ? migrated : void 0)) changes.push(`Migrated Crabbox warm profile ${key}, preserving resource obligations without inventing preparation, cache identity, purpose or demand.`);
				else warnings.push(`Crabbox warm profile ${key} changed or atomic update is unavailable; left it unchanged.`);
			} catch (error) {
				warnings.push(`Failed migrating Crabbox warm profile ${key}; left it unchanged: ${String(error)}`);
			}
		}
		const leases = await listLegacyWarmLeases(context);
		if (leases.length) {
			warnings.push(`${leases.length} legacy Crabbox lease row(s) still block warm-profile admission; their original cold/checkpoint choices are unknown.`);
			for (const lease of leases) warnings.push(`Resolve lease ${lease.leaseId} through its original Gateway or provider, stop the original Gateway/capture processes, and confirm provider cleanup before running: openclaw crabbox warm-images --recover ${lease.selector} --acknowledge-provider-cleanup. Then rerun openclaw doctor --fix. The row was not changed.`);
		}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
