//#region src/infra/approval-display-paths.ts
/** Formats user-home paths compactly for approval prompts without normalizing unsafe paths. */
function formatApprovalDisplayPath(value) {
	const normalized = value.trim();
	if (!normalized || hasRelativePathSegment(normalized)) return normalized;
	const homeMatch = normalized.match(/^\/(?:home|Users)\/([^/]+)(.*)$/) ?? normalized.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);
	return homeMatch && isSafeHomeSegment(homeMatch[1]) ? `~${(homeMatch[2] ?? "").replaceAll("\\", "/")}` : normalized;
}
function isSafeHomeSegment(segment) {
	return segment !== void 0 && segment !== "." && segment !== "..";
}
function hasRelativePathSegment(value) {
	return /(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(value);
}
//#endregion
export { formatApprovalDisplayPath as t };
