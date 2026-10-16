import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { t as normalizeSupportDiagnosticErrorCode } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { validRange } from "semver";
//#region src/infra/npm-error.ts
/** Shared npm error classification for install, metadata, and permission failures. */
function parseNpmErrorCode(text) {
	const explicit = /\bnpm (?:ERR!|error) code ([A-Z][A-Z0-9_]+)/u.exec(text)?.[1];
	if (explicit) return explicit;
	if (/No version matching "[^"\n]+" found for specifier "[^"\n]+" \(but package exists\)/u.test(text)) return "ETARGET";
	if (/Integrity check failed for tarball:/u.test(text)) return "EINTEGRITY";
	if (/404 - GET |GET \S+ - 404\b/u.test(text)) return "E404";
	return text.match(/\b[A-Z][A-Z0-9_]+\b/gu)?.map(normalizeSupportDiagnosticErrorCode).find(Boolean) ?? (/is not in this registry/iu.test(text) ? "E404" : void 0);
}
/** Admit registry specs only; diagnostic URLs, local paths, and shell text stay private. */
function npmFailurePackageSpec(text) {
	const bunTarget = /No version matching "([^"\n]+)" found for specifier "([^"\n]+)" \(but package exists\)/u.exec(text);
	const spec = (bunTarget ? `${bunTarget[2]}@${bunTarget[1]}` : void 0) ?? /No matching version found for (.+)\.(?:\r?$)/mu.exec(text)?.[1] ?? /(?:404\s+|The requested resource )['"]([^'"]+)['"]/u.exec(text)?.[1] ?? /(?:tarball|cached) data for (\S+) \(/u.exec(text)?.[1] ?? /Integrity check failed for tarball: (\S+)/u.exec(text)?.[1] ?? /^(?:error: )?(\S+@\S+) failed to resolve$/mu.exec(text)?.[1];
	return spec && npmFailurePackageName(spec) ? spec : void 0;
}
function npmFailurePackageName(spec) {
	if (spec.length > 200 || containsAsciiControlCharacter(spec) || /[\u2028\u2029]/u.test(spec) || redactSensitiveText(spec, { mode: "tools" }) !== spec) return;
	const parsed = parseRegistryNpmSpec(spec);
	if (parsed) return parsed.name;
	const separator = spec.indexOf("@", 1);
	return separator > 0 && validRange(spec.slice(separator + 1)) ? parseRegistryNpmSpec(spec.slice(0, separator))?.name : void 0;
}
//#endregion
export { npmFailurePackageSpec as n, parseNpmErrorCode as r, npmFailurePackageName as t };
