import fs from "node:fs";
import path from "node:path";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = /* @__PURE__ */ new Set([
	"helper-failed",
	"helper-unavailable",
	"not-empty",
	"not-found",
	"not-removable",
	"permission-unverified",
	"read-failed",
	"timeout",
	"unsupported-platform"
]);
function categorizeFsSafeError(code) {
	return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
	code;
	category;
	details;
	constructor(code, message, options = {}) {
		super(message, options);
		this.name = "FsSafeError";
		this.code = code;
		this.category = categorizeFsSafeError(code);
		this.details = options.details;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-path-syntax.js
function isWindowsSeparator(value, offset) {
	const code = value.charCodeAt(offset);
	return code === 47 || code === 92;
}
function hasWindowsDrivePrefix(value, offset = 0) {
	const letter = value.charCodeAt(offset) | 32;
	return letter >= 97 && letter <= 122 && value.charCodeAt(offset + 1) === 58;
}
/** Classify a raw prefix without normalizing any path components. */
function windowsNamespaceMarker(value) {
	const marker = value[2];
	return (marker === "." || marker === "?") && isWindowsSeparator(value, 0) && isWindowsSeparator(value, 1) && isWindowsSeparator(value, 3) ? marker : void 0;
}
function rootedWindowsDriveColonIndex(value) {
	const colon = hasWindowsDrivePrefix(value) ? 1 : windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4) ? 5 : -1;
	return colon >= 0 && isWindowsSeparator(value, colon + 1) ? colon : -1;
}
function asciiLowercase(value) {
	return value.replace(/[A-Z]/g, (letter) => String.fromCharCode(letter.charCodeAt(0) + 32));
}
/**
* True when dot-like components climb above the start of `segments`. Win32
* trims trailing dots and spaces, so any all-dot or all-space component other
* than `.` is counted as a parent step.
*/
function windowsSegmentsClimbAbove(segments) {
	let depth = 0;
	for (const segment of segments) {
		if (segment === "" || segment === ".") continue;
		depth += /^[. ]+$/.test(segment) ? -1 : 1;
		if (depth < 0) return true;
	}
	return false;
}
/**
* Comparable share or device root of a path spelled with two leading
* separators, excluding namespaced drive roots such as `\\?\C:\`.
* Returns undefined for drive, rooted, and relative spellings, and null when
* the spelling alone cannot establish which share or device it reaches.
*/
function windowsShareOrDeviceRoot(value) {
	if (!isWindowsSeparator(value, 0) || !isWindowsSeparator(value, 1)) return void 0;
	const spelled = value.replaceAll("/", "\\");
	if (windowsNamespaceMarker(spelled) === void 0) return asciiLowercase(path.win32.parse(spelled).root.replace(/\\+$/, ""));
	const segments = spelled.slice(4).split("\\");
	const head = asciiLowercase(segments[0] ?? "");
	const authority = head === "unc" ? segments.slice(0, 3) : segments.slice(0, 1);
	if (head === "globalroot" || head === "global" || authority.length < (head === "unc" ? 3 : 1) || authority.some((segment) => segment === "" || /[. ]$/.test(segment)) || windowsSegmentsClimbAbove(segments.slice(authority.length))) return null;
	if (rootedWindowsDriveColonIndex(value) === 5) return void 0;
	return asciiLowercase(head === "unc" ? `\\\\${authority[1]}\\${authority[2]}` : `${spelled.slice(0, 4)}${authority[0]}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/windows-path-alias.js
function isExactlyUnderWindowsPath(trusted, value) {
	const root = trusted.replaceAll("/", "\\").replace(/(?<=.)\\+$/, "");
	const candidate = value.replaceAll("/", "\\");
	if (candidate !== root && !candidate.startsWith(root.endsWith("\\") ? root : `${root}\\`)) return false;
	return !windowsSegmentsClimbAbove(candidate.slice(root.length).split("\\"));
}
/**
* True when a Windows path could reach a UNC share or device namespace that
* none of the trusted boundary paths live on: its share or device differs from
* theirs or cannot be identified from its spelling, and it is not spelled
* exactly under one of them. Reject such input before any filesystem call:
* even lstat on `\\host\share\x` makes Windows contact host.
*/
function isForeignWindowsShareOrDevicePath(value, trustedPaths, platform = process.platform) {
	if (platform !== "win32") return false;
	const key = windowsShareOrDeviceRoot(value);
	if (key === void 0) return false;
	return !trustedPaths.some((trusted) => trusted !== void 0 && (key !== null && windowsShareOrDeviceRoot(trusted) === key || isExactlyUnderWindowsPath(trusted, value)));
}
function isBareWindowsNamespaceDrive(value) {
	return value.length === 6 && windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4);
}
/**
* Capture an ordinary Windows drive-relative path without normalizing its raw
* suffix. This is only for public APIs whose existing contract accepts such
* paths; callers must still run namespace-alias admission on the result.
*/
function anchorWindowsDriveRelativePath(value) {
	if (process.platform !== "win32" || path.isAbsolute(value)) return value;
	if (!hasWindowsDrivePrefix(value)) return value;
	const drive = value.slice(0, 2);
	return `${path.resolve(drive)}${path.sep}${value.slice(2)}`;
}
/**
* Resolve a path without letting Node erase the separator from an exact
* extended-length drive root such as `\\?\C:\`. Bare `\\?\C:` input remains
* unchanged so the surrounding alias admission rejects it.
*/
function resolvePathPreservingWindowsRoot(value) {
	if (value.length === 7 && process.platform === "win32" && rootedWindowsDriveColonIndex(value) === 5) return value.includes("/") ? value.replaceAll("/", "\\") : value;
	return repairResolvedWindowsRoot(value, path.resolve(value));
}
/**
* Preserve a namespaced drive root after a caller has already resolved the
* input. This lets admission fast paths keep exactly one live path.resolve
* call while retaining the same root-repair behavior as the general helper.
*/
function repairResolvedWindowsRoot(value, resolved) {
	if (resolved.length === 6 && process.platform === "win32" && isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved}\\`;
	return resolved;
}
/**
* Resolve path segments against a base while preserving a namespaced drive
* root when Node normalizes a legitimate rooted input back to that root.
* Raw bare namespace drives stay bare so admission checks still reject them.
*/
function resolvePathFromBasePreservingWindowsRoot(base, ...segments) {
	const resolved = path.resolve(base, ...segments);
	if (resolved.length !== 6 || process.platform !== "win32" || !isBareWindowsNamespaceDrive(resolved)) return resolved;
	if (hasWindowsPathAlias(base, "filesystem") || segments.some((segment) => hasWindowsPathAlias(segment, "filesystem"))) return resolved;
	return `${resolved}\\`;
}
/**
* Adapt an admitted namespaced drive root for Node's Windows filesystem layer.
* Node removes the root separator from these paths during filesystem dispatch,
* so use the equivalent ordinary drive root for the operation. This is not an
* admission check: callers must validate attacker-controlled input first.
*/
function pathForWindowsFilesystem(value) {
	if (process.platform !== "win32" || rootedWindowsDriveColonIndex(value) !== 5) return value;
	if (value.length === 7) return `${value[4]}:\\`;
	const resolved = path.resolve(value);
	if (isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved[4]}:\\`;
	return value;
}
/** Returns true when a Windows pathname can address an alternate filesystem namespace. */
function hasWindowsPathAlias(value, kind, platform = process.platform) {
	if (platform !== "win32") return false;
	const firstColon = value.indexOf(":");
	if (firstColon === -1) return false;
	if (kind === "relative") return true;
	return firstColon !== rootedWindowsDriveColonIndex(value) || value.indexOf(":", firstColon + 1) !== -1;
}
function assertNoWindowsPathAliasForPlatform(value, kind, message, platform) {
	if (hasWindowsPathAlias(value, kind, platform)) throw new FsSafeError("invalid-path", message, { details: { reason: "windows-path-alias" } });
}
function assertNoWindowsPathAlias(value, kind = "filesystem", message = "path uses a Windows filesystem namespace alias", platform = process.platform) {
	assertNoWindowsPathAliasForPlatform(value, kind, message, platform);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path.js
const NOT_FOUND_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
const SYMLINK_OPEN_CODES = /* @__PURE__ */ new Set([
	"ELOOP",
	"EINVAL",
	"ENOTSUP"
]);
const POSIX_SEPARATOR_CHAR_CODE = 47;
function normalizeWindowsPathForComparison(input) {
	let normalized = path.win32.normalize(input);
	if (normalized.startsWith("\\\\?\\")) {
		normalized = normalized.slice(4);
		if (normalized.toUpperCase().startsWith("UNC\\")) normalized = `\\\\${normalized.slice(4)}`;
	}
	return normalized.replaceAll("/", "\\").toLowerCase();
}
function resolveWindowsPathForComparison(input) {
	const resolved = path.win32.resolve(input);
	return resolved[1] === ":" && path.win32.isAbsolute(resolved) ? resolved.toLowerCase() : normalizeWindowsPathForComparison(resolved.length === 6 ? resolvePathPreservingWindowsRoot(input) : resolved);
}
function isNodeError(value) {
	return Boolean(value && typeof value === "object" && "code" in value);
}
function hasNodeErrorCode(value, code) {
	return isNodeError(value) && value.code === code;
}
function assertNoNulPathInput(filePath, message = "path contains a NUL byte") {
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", message);
}
function isNotFoundPathError(value) {
	return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}
function isSymlinkOpenError(value) {
	return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}
function isPathInside(root, target) {
	if (process.platform === "win32") {
		if (isForeignWindowsShareOrDevicePath(target, [root])) return false;
		const rootForCompare = resolveWindowsPathForComparison(root);
		const targetForCompare = resolveWindowsPathForComparison(target);
		if (rootForCompare[1] === ":" && path.win32.isAbsolute(rootForCompare) && !targetForCompare.includes(":", 2) && (targetForCompare === rootForCompare || targetForCompare.startsWith(rootForCompare) && (rootForCompare.endsWith("\\") || targetForCompare[rootForCompare.length] === "\\"))) return true;
		const relative = path.win32.relative(rootForCompare, targetForCompare);
		const firstSegment = relative.split(path.win32.sep)[0];
		return relative === "" || firstSegment !== ".." && !path.win32.isAbsolute(relative);
	}
	if (root.length > 0 && root.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && target.length >= root.length && target.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && !target.includes("/..") && (target === root || target.startsWith(root) && (root.charCodeAt(root.length - 1) === POSIX_SEPARATOR_CHAR_CODE || target.charCodeAt(root.length) === POSIX_SEPARATOR_CHAR_CODE))) return true;
	const resolvedRoot = path.resolve(root);
	const resolvedTarget = path.resolve(target);
	const relative = path.relative(resolvedRoot, resolvedTarget);
	const firstSegment = relative.split(path.posix.sep)[0];
	return relative === "" || firstSegment !== ".." && !path.isAbsolute(relative);
}
function isPathRelativeEscape(relativePath) {
	if (path.isAbsolute(relativePath)) return true;
	let depth = 0;
	const segments = relativePath.split(process.platform === "win32" ? /[/\\]/ : /\//);
	for (const segment of segments) if (segment === "..") {
		if (depth === 0) return true;
		depth -= 1;
	} else if (segment !== "" && segment !== ".") depth += 1;
	return false;
}
function safeStatSync(targetPath) {
	try {
		return fs.statSync(pathForWindowsFilesystem(targetPath));
	} catch {
		return null;
	}
}
//#endregion
export { isWindowsSeparator as _, isPathInside as a, FsSafeError as b, normalizeWindowsPathForComparison as c, assertNoWindowsPathAlias as d, hasWindowsPathAlias as f, resolvePathPreservingWindowsRoot as g, resolvePathFromBasePreservingWindowsRoot as h, isNotFoundPathError as i, safeStatSync as l, pathForWindowsFilesystem as m, hasNodeErrorCode as n, isPathRelativeEscape as o, isForeignWindowsShareOrDevicePath as p, isNodeError as r, isSymlinkOpenError as s, assertNoNulPathInput as t, anchorWindowsDriveRelativePath as u, rootedWindowsDriveColonIndex as v, windowsNamespaceMarker as y };
