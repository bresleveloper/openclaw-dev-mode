import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
//#region src/gateway/operator-approval-reviewer-binding.ts
/** Match a durable binding after the caller's broad authority has been established. */
function matchesOperatorApprovalReviewerBinding(binding, deviceId) {
	const clientDeviceId = normalizeOptionalString(deviceId);
	const reviewerDeviceIds = normalizeUniqueTrimmedStringList([...binding.reviewerDeviceIds ?? []]);
	if (reviewerDeviceIds.length > 0) return Boolean(clientDeviceId && reviewerDeviceIds.includes(clientDeviceId));
	return true;
}
//#endregion
export { matchesOperatorApprovalReviewerBinding as t };
