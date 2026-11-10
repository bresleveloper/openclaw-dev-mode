import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/infra/update-failure-report-receipt.ts
function isCanonicalGithubUrl(value, pathname, allowSearch) {
	if (typeof value !== "string") return false;
	try {
		const parsed = new URL(value);
		return parsed.origin === "https://github.com" && !parsed.username && !parsed.password && !parsed.hash && (allowSearch || !parsed.search) && pathname.test(parsed.pathname);
	} catch {
		return false;
	}
}
function isPreviewDigest(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function isValidTerminalReceipt(receipt) {
	if (!isPreviewDigest(receipt.previewDigest) || receipt.preparingSinceMs !== void 0) return false;
	if (receipt.status === "created") return receipt.cleanup === "pending" && receipt.fallbackUrl === void 0 && isCanonicalGithubUrl(receipt.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, false);
	if (receipt.status === "fallback") return receipt.cleanup === void 0 && receipt.url === void 0 && isCanonicalGithubUrl(receipt.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, true);
	return receipt.status === "retryable" && receipt.cleanup === void 0 && receipt.url === void 0 && receipt.fallbackUrl === void 0;
}
function parseUpdateFailureReportReceipt(value) {
	if (!isRecord(value) || value.status !== "preparing" && value.status !== "prepared" && value.status !== "pending" && value.status !== "retryable" && value.status !== "created" && value.status !== "fallback" || typeof value.reservationId !== "string" || (value.status === "preparing" || value.status === "prepared") && (typeof value.preparingSinceMs !== "number" || !Number.isFinite(value.preparingSinceMs)) || value.artifactSweep !== void 0 && value.artifactSweep !== "pending" || value.cleanup !== void 0 && value.cleanup !== "pending" || value.previewDigest !== void 0 && !isPreviewDigest(value.previewDigest) || value.replacementReady !== void 0 && value.replacementReady !== true || value.replacementReady === true && (value.status !== "retryable" || value.cleanup !== void 0 || value.artifactSweep !== "pending") || value.sweepOwnerId === void 0 !== (value.sweepSinceMs === void 0) || value.sweepOwnerId === void 0 !== (value.sweepGeneration === void 0) || value.sweepGeneration !== void 0 && typeof value.sweepGeneration !== "string" || value.sweepOwnerId !== void 0 && typeof value.sweepOwnerId !== "string" || value.sweepSinceMs !== void 0 && (typeof value.sweepSinceMs !== "number" || !Number.isFinite(value.sweepSinceMs)) || value.sweepOwnerId !== void 0 && value.artifactSweep !== "pending" || value.status === "created" && !isCanonicalGithubUrl(value.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, false) || value.status === "fallback" && !isCanonicalGithubUrl(value.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, true) || value.cleanup !== void 0 && value.status !== "created" && value.status !== "retryable" || value.status !== "created" && value.url !== void 0 || value.status !== "fallback" && value.fallbackUrl !== void 0) return null;
	return {
		...value.artifactSweep === "pending" ? { artifactSweep: value.artifactSweep } : {},
		reservationId: value.reservationId,
		status: value.status,
		...value.cleanup === "pending" ? { cleanup: value.cleanup } : {},
		...typeof value.preparingSinceMs === "number" ? { preparingSinceMs: value.preparingSinceMs } : {},
		...typeof value.previewDigest === "string" ? { previewDigest: value.previewDigest } : {},
		...value.replacementReady === true ? { replacementReady: value.replacementReady } : {},
		...typeof value.sweepGeneration === "string" ? { sweepGeneration: value.sweepGeneration } : {},
		...typeof value.sweepOwnerId === "string" ? { sweepOwnerId: value.sweepOwnerId } : {},
		...typeof value.sweepSinceMs === "number" ? { sweepSinceMs: value.sweepSinceMs } : {},
		...typeof value.url === "string" ? { url: value.url } : {},
		...typeof value.fallbackUrl === "string" ? { fallbackUrl: value.fallbackUrl } : {}
	};
}
function decodeUpdateFailureReportReservation(value) {
	if (!isRecord(value) || typeof value.reserved !== "boolean") return;
	const receipt = parseUpdateFailureReportReceipt(value.receipt);
	if (value.receipt !== null && !receipt || value.reserved && receipt?.status !== "preparing") return;
	return {
		receipt,
		reserved: value.reserved
	};
}
function decodeUpdateFailureReportMutation(value) {
	return typeof value === "boolean" ? value : void 0;
}
async function confirmUpdateFailureReportReceipt(readReceipt, expected) {
	try {
		const receipt = await readReceipt();
		return receipt?.reservationId === expected.reservationId && receipt.status === expected.status && receipt.previewDigest === expected.previewDigest && receipt.cleanup === expected.cleanup && receipt.url === expected.url && receipt.fallbackUrl === expected.fallbackUrl;
	} catch {
		return false;
	}
}
//#endregion
export { parseUpdateFailureReportReceipt as a, isValidTerminalReceipt as i, decodeUpdateFailureReportMutation as n, decodeUpdateFailureReportReservation as r, confirmUpdateFailureReportReceipt as t };
