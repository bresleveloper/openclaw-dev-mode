import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { posix } from "node:path";
//#region src/agents/sandbox/bind-spec.ts
/** Splits a bind spec while preserving Windows drive-letter prefixes in host paths. */
function splitSandboxBindSpec(spec, options) {
	const separator = getBindSeparatorIndex(spec);
	if (separator === -1) return null;
	const host = spec.slice(0, separator);
	const rest = spec.slice(separator + 1);
	const optionsStart = options?.allowWindowsContainerPath === true ? getBindSeparatorIndex(rest) : rest.indexOf(":");
	if (optionsStart === -1) return {
		host,
		container: rest,
		options: ""
	};
	return {
		host,
		container: rest.slice(0, optionsStart),
		options: rest.slice(optionsStart + 1)
	};
}
function getBindSeparatorIndex(spec) {
	const hasDriveLetterPrefix = /^[A-Za-z]:[\\/]/.test(spec);
	return spec.indexOf(":", hasDriveLetterPrefix ? 2 : 0);
}
//#endregion
//#region src/agents/sandbox/host-paths.ts
/**
* Host path normalization for sandbox mount policy.
*
* Handles POSIX, Windows drive, and namespace-prefixed paths before policy-key comparison.
*/
function stripWindowsNamespacePrefix(input) {
	if (input.startsWith("\\\\?\\")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC\\")) return `\\\\${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	if (input.startsWith("//?/")) {
		const withoutPrefix = input.slice(4);
		if (withoutPrefix.toUpperCase().startsWith("UNC/")) return `//${withoutPrefix.slice(4)}`;
		return withoutPrefix;
	}
	return input;
}
function isWindowsDriveAbsolutePath(raw) {
	return /^[A-Za-z]:[\\/]/.test(stripWindowsNamespacePrefix(raw));
}
function isSandboxHostPathAbsolute(raw) {
	const input = stripWindowsNamespacePrefix(raw);
	return input.startsWith("/") || isWindowsDriveAbsolutePath(input);
}
/**
* Normalize a host path: resolve `.`, `..`, collapse `//`, strip trailing `/`.
* Windows drive-letter paths preserve the drive root and uppercase the drive letter.
*/
function normalizeSandboxHostPath(raw) {
	const input = stripWindowsNamespacePrefix(raw);
	if (!input) return "/";
	let normalizedInput = process.platform === "win32" || isWindowsDriveAbsolutePath(input) || raw.startsWith("\\\\") || raw.startsWith("//?/") ? input.replaceAll("\\", "/") : input;
	if (isWindowsDriveAbsolutePath(normalizedInput)) normalizedInput = normalizedInput.charAt(0).toUpperCase() + normalizedInput.slice(1);
	const withoutTrailingSlash = posix.normalize(normalizedInput).replace(/\/+$/, "") || "/";
	if (/^[A-Z]:$/.test(withoutTrailingSlash)) return `${withoutTrailingSlash}/`;
	return withoutTrailingSlash;
}
function getSandboxHostPathPolicyKey(raw) {
	const normalized = normalizeSandboxHostPath(raw);
	if (isWindowsDriveAbsolutePath(normalized)) return normalized.toLowerCase();
	return normalized;
}
/**
* Resolve a path through the deepest existing ancestor so parent symlinks are honored
* even when the final source leaf does not exist yet.
*/
function resolveSandboxHostPathViaExistingAncestor(sourcePath) {
	if (!isSandboxHostPathAbsolute(sourcePath)) return sourcePath;
	if (isWindowsDriveAbsolutePath(sourcePath) && process.platform !== "win32") return normalizeSandboxHostPath(sourcePath);
	return normalizeSandboxHostPath(resolvePathViaExistingAncestorSync(sourcePath));
}
//#endregion
export { splitSandboxBindSpec as a, resolveSandboxHostPathViaExistingAncestor as i, isSandboxHostPathAbsolute as n, normalizeSandboxHostPath as r, getSandboxHostPathPolicyKey as t };
