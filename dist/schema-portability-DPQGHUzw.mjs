import { i as sha256StableValue, n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as AVATAR_MAX_DATA_URL_CHARS, o as isRenderableAvatarImageDataUrl } from "./avatar-limits-2506OuP3.mjs";
import { a as isSupportedLocalAvatarExtension } from "./avatar-policy-DiIdI6oM.mjs";
//#region src/claws/digest.ts
function digestClawValue(value) {
	return `sha256:${sha256StableValue(value).digest}`;
}
function digestClawBytes(value) {
	return `sha256:${sha256Hex(value)}`;
}
//#endregion
//#region src/claws/schema-portability.ts
const EXACT_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const PACKAGE_NAME_PATTERN = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const WINDOWS_INVALID_PATH_CHARS = /[<>:"|?*]/;
const WINDOWS_RESERVED_PATH_SEGMENT = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const BASE64_PAYLOAD_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
function isExactSemVer(value) {
	return EXACT_VERSION_PATTERN.test(value);
}
function isCanonicalClawHubPackageName(value) {
	return PACKAGE_NAME_PATTERN.test(value);
}
function isSafeClawRelativePath(value) {
	const normalized = value.replaceAll("\\", "/");
	if (normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized)) return false;
	return normalized.split("/").every((segment) => segment !== "" && segment !== "." && segment !== ".." && !WINDOWS_INVALID_PATH_CHARS.test(segment) && !Array.from(segment).some((character) => character.charCodeAt(0) <= 31) && !segment.endsWith(".") && !segment.endsWith(" ") && !WINDOWS_RESERVED_PATH_SEGMENT.test(segment));
}
function portableClawPathKey(value) {
	return value.replaceAll("\\", "/").normalize("NFC").toLowerCase();
}
function conflictsWithClawPath(targets, candidate) {
	for (const target of targets) if (target === candidate || target.startsWith(`${candidate}/`) || candidate.startsWith(`${target}/`)) return true;
	return false;
}
function isPortableClawAvatar(value) {
	if (isRenderableAvatarImageDataUrl(value)) {
		if (value.length > AVATAR_MAX_DATA_URL_CHARS) return false;
		const comma = value.indexOf(",");
		if (comma < 0) return false;
		const metadata = value.slice(0, comma);
		const payload = value.slice(comma + 1);
		try {
			const base64 = /;base64(?:;|$)/i.test(metadata);
			if (payload.length === 0 || base64 && !BASE64_PAYLOAD_PATTERN.test(payload)) return false;
			const bytes = base64 ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload), "utf8");
			return bytes.byteLength > 0 && bytes.byteLength <= 2097152;
		} catch {
			return false;
		}
	}
	return isSafeClawRelativePath(value) && isSupportedLocalAvatarExtension(value);
}
function isValidClawTimezone(value) {
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
		return true;
	} catch {
		return false;
	}
}
function packageManagerArtifacts(command, args) {
	const executable = command.split(/[\\/]/).at(-1)?.replace(/\.(?:cmd|exe)$/i, "").toLowerCase();
	let start = 0;
	if (executable === "pnpm" || executable === "yarn") {
		if (args[0] !== "dlx") return;
		start = 1;
	} else if (executable !== "npx" && executable !== "pnpx" && executable !== "bunx") return;
	const selected = [];
	let positional;
	for (let index = start; index < args.length; index += 1) {
		const value = args[index];
		if (!value) continue;
		if (value === "--") {
			positional = args[index + 1] ?? "";
			break;
		}
		if (value === "-p" || value === "--package") {
			selected.push(args[index + 1] ?? "");
			index += 1;
			continue;
		}
		if (value.startsWith("--package=")) {
			selected.push(value.slice(10));
			continue;
		}
		if (positional === void 0 && !value.startsWith("-")) {
			positional = value;
			break;
		}
	}
	return selected.length > 0 ? selected : [positional ?? ""];
}
function isClawPackageManagerArtifactPinned(command, args) {
	const artifacts = packageManagerArtifacts(command, args);
	if (artifacts === void 0) return;
	return artifacts.every((artifact) => {
		const separator = artifact.lastIndexOf("@");
		const scopedSlash = artifact.startsWith("@") ? artifact.indexOf("/") : -1;
		return separator > 0 && separator > scopedSlash && isExactSemVer(artifact.slice(separator + 1));
	});
}
//#endregion
export { isPortableClawAvatar as a, portableClawPathKey as c, isExactSemVer as i, digestClawBytes as l, isCanonicalClawHubPackageName as n, isSafeClawRelativePath as o, isClawPackageManagerArtifactPinned as r, isValidClawTimezone as s, conflictsWithClawPath as t, digestClawValue as u };
