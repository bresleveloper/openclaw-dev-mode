import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/gateway-protocol/src/worker-capacity.ts
const NODE_WORKER_CAPACITY_MAX = 1024;
function availableWorkerSlots(capacity) {
	return capacity.available + (capacity.reclaimableIdle ?? 0);
}
function parseWorkerCapacity(value) {
	if (!isRecord(value)) return null;
	const keys = Object.keys(value);
	const { total, available, reclaimableIdle } = value;
	return keys.every((key) => key === "total" || key === "available" || key === "reclaimableIdle") && keys.includes("total") && keys.includes("available") && typeof total === "number" && typeof available === "number" && Number.isSafeInteger(total) && Number.isSafeInteger(available) && total >= 1 && total <= 1024 && available >= 0 && available <= total && (reclaimableIdle === void 0 || typeof reclaimableIdle === "number" && Number.isSafeInteger(reclaimableIdle) && reclaimableIdle >= 0 && reclaimableIdle <= Math.min(2, total - available)) ? {
		total,
		available,
		...reclaimableIdle === void 0 ? {} : { reclaimableIdle }
	} : null;
}
//#endregion
export { availableWorkerSlots as n, parseWorkerCapacity as r, NODE_WORKER_CAPACITY_MAX as t };
