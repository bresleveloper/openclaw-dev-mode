import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as compareOpenClawVersions } from "./version-ByD9iTct.mjs";
import { valid } from "semver";
//#region src/plugins/min-host-version.ts
/** Validation message for plugin minHostVersion manifest fields. */
const MIN_HOST_VERSION_FORMAT = "openclaw.install.minHostVersion must use a semver floor in the form \">=x.y.z[-prerelease][+build]\"";
const SEMVER_LABEL_RE = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?`;
const MIN_HOST_VERSION_RE = new RegExp(`^>=(${SEMVER_LABEL_RE})$`);
const LEGACY_MIN_HOST_VERSION_RE = new RegExp(`^(${SEMVER_LABEL_RE})$`);
/** Parses a plugin minHostVersion manifest field. */
function parseMinHostVersionRequirement(raw, options = {}) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const match = trimmed.match(MIN_HOST_VERSION_RE) ?? (options.allowLegacyBareSemver ? trimmed.match(LEGACY_MIN_HOST_VERSION_RE) : null);
	if (!match) return null;
	const minimumLabel = match[1] ?? "";
	if (!valid(minimumLabel)) return null;
	return {
		raw: trimmed,
		minimumLabel
	};
}
/** Checks whether the current host satisfies a plugin minHostVersion requirement. */
function checkMinHostVersion(params) {
	if (params.minHostVersion === void 0) return {
		ok: true,
		requirement: null
	};
	const requirement = parseMinHostVersionRequirement(params.minHostVersion, { allowLegacyBareSemver: params.allowLegacyBareSemver });
	if (!requirement) return {
		ok: false,
		kind: "invalid",
		error: MIN_HOST_VERSION_FORMAT
	};
	const currentVersion = normalizeOptionalString(params.currentVersion) || "unknown";
	const comparison = compareOpenClawVersions(currentVersion, requirement.minimumLabel);
	if (comparison === null) return {
		ok: false,
		kind: "unknown_host_version",
		requirement
	};
	if (comparison < 0) return {
		ok: false,
		kind: "incompatible",
		requirement,
		currentVersion
	};
	return {
		ok: true,
		requirement
	};
}
//#endregion
export { checkMinHostVersion as t };
