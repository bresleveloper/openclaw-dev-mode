import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { prerelease, satisfies } from "semver";
//#region src/plugins/package-compat.ts
function normalizePartialComparableVersion(version) {
	const trimmed = version.trim();
	return /^[vV]?[0-9]+\.[0-9]+$/.test(trimmed) ? {
		version: `${trimmed}.0`,
		isPartial: true
	} : {
		version: trimmed,
		isPartial: false
	};
}
function normalizePluginApiVersionForComparator(version, target) {
	const normalizedCorrection = OPENCLAW_NUMERIC_CORRECTION_PATTERN.exec(version.trim())?.[1];
	if (normalizedCorrection) return normalizedCorrection;
	return prerelease(normalizePartialComparableVersion(target).version) ? version : OPENCLAW_RELEASE_SUFFIX_PATTERN.exec(version.trim())?.[1] ?? version;
}
function satisfiesComparator(version, token) {
	const trimmed = token.trim();
	if (!trimmed) return true;
	const match = /^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(trimmed);
	if (!match) return false;
	const operator = match[1] ?? "";
	const target = match[2]?.trim();
	if (!target || /^[<>=^~]/.test(target)) return false;
	const comparableVersion = normalizePluginApiVersionForComparator(version, target);
	const normalizedTarget = normalizePartialComparableVersion(target);
	const comparator = normalizedTarget.isPartial && !operator ? `>=${normalizedTarget.version}` : `${operator}${normalizedTarget.version}`;
	return satisfies(comparableVersion, comparator, { includePrerelease: true });
}
function satisfiesSemverRange(version, range) {
	if (range.includes("||")) return false;
	const tokens = normalizeStringEntries(range.trim().split(/\s+/));
	if (tokens.length === 0) return false;
	return tokens.every((token) => satisfiesComparator(version, token));
}
const OPENCLAW_RELEASE_SUFFIX_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)(?:-\d+|-(?:alpha|beta|rc)\.\d+)$/i;
const OPENCLAW_NUMERIC_CORRECTION_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)-\d+$/;
/** Resolves the plugin API compatibility range declared by package metadata. */
function resolvePackagePluginApiRange(packageMetadata) {
	if (!isRecord(packageMetadata) || !("compat" in packageMetadata)) return { ok: true };
	const compat = packageMetadata.compat;
	if (compat === void 0 || compat === null) return { ok: true };
	if (!isRecord(compat)) return {
		ok: false,
		error: "package.json openclaw.compat must be an object"
	};
	if (!("pluginApi" in compat)) return { ok: true };
	const pluginApi = compat.pluginApi;
	if (typeof pluginApi !== "string") return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must be a string"
	};
	const range = pluginApi.trim();
	if (!range) return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must not be empty"
	};
	return {
		ok: true,
		range
	};
}
/** Checks whether a host plugin API version satisfies a package plugin API range. */
function satisfiesPluginApiRange(pluginApiVersion, pluginApiRange) {
	if (!pluginApiRange) return true;
	return satisfiesSemverRange(pluginApiVersion, pluginApiRange);
}
//#endregion
export { satisfiesPluginApiRange as n, resolvePackagePluginApiRange as t };
