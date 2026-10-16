import path from "node:path";
import { validRange } from "semver";
//#region src/infra/install-spec.ts
/** Detect specs that should be interpreted as local file/path installs. */
function looksLikeLocalInstallSpec(spec, knownSuffixes) {
	return spec.startsWith(".") || spec.startsWith("~") || path.isAbsolute(spec) || knownSuffixes.some((suffix) => spec.endsWith(suffix));
}
function isRegistrySourceInstallSpec(spec) {
	const archive = /[.](?:tgz|tar[.]gz|tar)$/iu;
	const packageName = /^(?:@[a-z0-9_][a-z0-9._-]*\/)?[a-z0-9_][a-z0-9._-]*$/iu;
	const value = spec.trim();
	const separator = value.indexOf("@", 1);
	const name = separator > 0 ? value.slice(0, separator) : value;
	const selector = separator > 0 ? value.slice(separator + 1).trim() : "";
	if (value.startsWith("npm:") || selector.startsWith("npm:")) return false;
	if (!packageName.test(name) || !name.startsWith("@") && archive.test(name)) return false;
	return !selector.startsWith(".") && !archive.test(selector) && (validRange(selector, true) !== null || encodeURIComponent(selector) === selector);
}
//#endregion
export { looksLikeLocalInstallSpec as n, isRegistrySourceInstallSpec as t };
