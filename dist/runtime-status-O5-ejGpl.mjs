import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/infra/runtime-status.ts
function formatRuntimeStatusWithDetails({ status, pid, state, details = [] }) {
	const runtimeStatus = status?.trim() || "unknown";
	const fullDetails = [];
	if (pid) fullDetails.push(`pid ${pid}`);
	const normalizedState = state?.trim();
	if (normalizedState && normalizeLowercaseStringOrEmpty(normalizedState) !== normalizeLowercaseStringOrEmpty(runtimeStatus)) fullDetails.push(`state ${normalizedState}`);
	for (const detail of details) {
		const normalizedDetail = detail.replace(/\s+/g, " ").trim();
		if (normalizedDetail) fullDetails.push(normalizedDetail);
	}
	return fullDetails.length > 0 ? `${runtimeStatus} (${fullDetails.join(", ")})` : runtimeStatus;
}
//#endregion
export { formatRuntimeStatusWithDetails as t };
