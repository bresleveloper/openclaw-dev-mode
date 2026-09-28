import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
//#region src/infra/package-update-utils.ts
/** Compare two package versions, preferring OpenClaw release ordering over plain semver. */
function comparePackageUpdateVersions(left, right) {
	const releaseCmp = compareOpenClawReleaseVersions(left, right);
	if (releaseCmp !== null) return releaseCmp;
	return compareValidSemver(left, right) ?? 0;
}
/** Return whether an update replaced the installed version with an older one. */
function isPackageVersionDowngrade(currentVersion, nextVersion) {
	if (!currentVersion || !nextVersion) return false;
	return comparePackageUpdateVersions(nextVersion, currentVersion) < 0;
}
/** Return expected integrity only for concrete semver package specs. */
function expectedIntegrityForUpdate(spec, integrity) {
	if (!integrity || !spec) return;
	const value = spec.trim();
	if (!value) return;
	const at = value.lastIndexOf("@");
	if (at <= 0 || at >= value.length - 1) return;
	const version = value.slice(at + 1).trim();
	if (!/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) return;
	return integrity;
}
function readInstalledPackageManifest(dir) {
	const result = readRootJsonObjectSync({
		rootDir: dir,
		relativePath: "package.json",
		boundaryLabel: "installed package directory"
	});
	return result.ok ? result.value : void 0;
}
/** Read the installed package version from a package root. */
async function readInstalledPackageVersion(dir) {
	const manifest = readInstalledPackageManifest(dir);
	return typeof manifest?.version === "string" ? manifest.version : void 0;
}
//#endregion
export { readInstalledPackageVersion as a, readInstalledPackageManifest as i, expectedIntegrityForUpdate as n, isPackageVersionDowngrade as r, comparePackageUpdateVersions as t };
