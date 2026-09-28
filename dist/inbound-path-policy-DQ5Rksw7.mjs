import path from "node:path";
//#region packages/media-core/src/inbound-path-policy.ts
const WILDCARD_SEGMENT = "*";
const WINDOWS_DRIVE_ABS_RE = /^[A-Za-z]:\//;
const WINDOWS_DRIVE_ROOT_RE = /^[A-Za-z]:$/;
function normalizePosixAbsolutePath(value) {
	const trimmed = value.trim();
	if (!trimmed || trimmed.includes("\0")) return;
	const normalized = path.posix.normalize(trimmed.replaceAll("\\", "/"));
	if (!(normalized.startsWith("/") || WINDOWS_DRIVE_ABS_RE.test(normalized)) || normalized === "/") return;
	const withoutTrailingSlash = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
	if (WINDOWS_DRIVE_ROOT_RE.test(withoutTrailingSlash)) return;
	return WINDOWS_DRIVE_ABS_RE.test(withoutTrailingSlash) ? withoutTrailingSlash.toLowerCase() : withoutTrailingSlash;
}
function splitPathSegments(value) {
	return value.split("/").filter(Boolean);
}
function joinAbsolutePathSegments(candidatePath, segments) {
	const joined = segments.join("/");
	if (!WINDOWS_DRIVE_ABS_RE.test(candidatePath)) return `/${joined}`;
	return segments.length === 1 ? `${joined}/` : joined;
}
function resolveRootPatternMatch(params) {
	const candidateSegments = splitPathSegments(params.candidatePath);
	const rootSegments = splitPathSegments(params.rootPattern);
	if (candidateSegments.length < rootSegments.length) return;
	const resolvedSegments = [];
	for (const [idx, expected] of rootSegments.entries()) {
		const actual = candidateSegments[idx];
		if (!actual) return;
		if (expected === WILDCARD_SEGMENT) {
			resolvedSegments.push(actual);
			continue;
		}
		if (expected !== actual) return;
		resolvedSegments.push(expected);
	}
	const firstWildcardIndex = rootSegments.indexOf(WILDCARD_SEGMENT);
	const anchorSegments = firstWildcardIndex === -1 ? resolvedSegments : rootSegments.slice(0, firstWildcardIndex);
	return {
		anchorRoot: joinAbsolutePathSegments(params.candidatePath, anchorSegments),
		matchedRoot: joinAbsolutePathSegments(params.candidatePath, resolvedSegments)
	};
}
/** Validates an absolute inbound root pattern with whole-segment wildcards only. */
function isValidInboundPathRootPattern(value) {
	const normalized = normalizePosixAbsolutePath(value);
	if (!normalized) return false;
	const segments = splitPathSegments(normalized);
	if (segments.length === 0) return false;
	return segments.every((segment) => segment === WILDCARD_SEGMENT || !segment.includes("*"));
}
/** Normalizes configured inbound attachment roots, dropping invalid or duplicate patterns. */
function normalizeInboundPathRoots(roots) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const root of roots ?? []) {
		if (typeof root !== "string") continue;
		if (!isValidInboundPathRootPattern(root)) continue;
		const candidate = normalizePosixAbsolutePath(root);
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		normalized.push(candidate);
	}
	return normalized;
}
/** Merges inbound attachment root lists while preserving first-seen priority. */
function mergeInboundPathRoots(...rootsLists) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const roots of rootsLists) {
		const normalized = normalizeInboundPathRoots(roots);
		for (const root of normalized) {
			if (seen.has(root)) continue;
			seen.add(root);
			merged.push(root);
		}
	}
	return merged;
}
/** Resolves the concrete lexical root matched by an inbound path pattern. */
function resolveInboundPathRoot(params) {
	const candidatePath = normalizePosixAbsolutePath(params.filePath);
	if (!candidatePath) return;
	const roots = normalizeInboundPathRoots(params.roots);
	const effectiveRoots = roots.length > 0 ? roots : normalizeInboundPathRoots(params.fallbackRoots ?? void 0);
	if (effectiveRoots.length === 0) return;
	for (const rootPattern of effectiveRoots) {
		const resolved = resolveRootPatternMatch({
			candidatePath,
			rootPattern
		});
		if (resolved) return resolved;
	}
}
/** Checks whether a candidate inbound media path is covered by configured or fallback roots. */
function isInboundPathAllowed(params) {
	return resolveInboundPathRoot(params) !== void 0;
}
//#endregion
export { resolveInboundPathRoot as a, normalizeInboundPathRoots as i, isValidInboundPathRootPattern as n, mergeInboundPathRoots as r, isInboundPathAllowed as t };
