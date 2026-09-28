import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/gateway/operator-approval-reviewer-binding.ts
function normalizeIdentity(value) {
	return normalizeOptionalString(value) ?? null;
}
function normalizeIdentities(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const identity = normalizeIdentity(value);
		if (identity) normalized.add(identity);
	}
	return [...normalized];
}
/** Match a durable binding after the caller's broad authority has been established. */
function matchesOperatorApprovalReviewerBinding(binding, deviceId) {
	const clientDeviceId = normalizeIdentity(deviceId);
	const reviewerDeviceIds = normalizeIdentities(binding.reviewerDeviceIds);
	if (reviewerDeviceIds.length > 0) return Boolean(clientDeviceId && reviewerDeviceIds.includes(clientDeviceId));
	return true;
}
//#endregion
export { matchesOperatorApprovalReviewerBinding as t };
