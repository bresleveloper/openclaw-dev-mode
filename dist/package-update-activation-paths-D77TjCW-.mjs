import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/package-update-activation-paths.ts
const PACKAGE_ACTIVATION_PREFIX = ".openclaw.package-activation-";
const LEGACY_PACKAGE_RECOVERY_HELPER = "e08dfc1fb3ba7962f9e01d7a6770117c6cd77406b3fa4f7ba94788a670030ba0";
function packageActivationRuntimeIdentity(file) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (!stat.isFile() || stat.ino === 0n) throw new Error("Package recovery requires a regular external runtime executable.");
	return [
		stat.dev,
		stat.ino,
		stat.size,
		stat.mtimeNs,
		stat.ctimeNs
	].join(":");
}
function capturePackageActivationRuntime(kind, executable) {
	const resolved = resolveExecutablePath(executable, { useCache: false });
	if (!resolved) throw new Error("The selected package recovery executable could not be resolved.");
	const runtimePath = fs.realpathSync(resolved);
	return {
		kind,
		path: runtimePath,
		identity: packageActivationRuntimeIdentity(runtimePath)
	};
}
function resolvePackageActivationAnchor(installKey) {
	const key = createHash("sha256").update(installKey).digest("hex").slice(0, 24);
	return path.join(path.dirname(installKey), `${PACKAGE_ACTIVATION_PREFIX}${key}`);
}
function resolvePackageActivationControl(anchor) {
	return `${anchor}.control`;
}
function resolvePackageActivationJournalPath(anchor) {
	return path.join(resolvePackageActivationControl(anchor), "operation.sqlite");
}
function resolvePackageActivationHelper(anchor) {
	return path.join(resolvePackageActivationControl(anchor), "recovery.mjs");
}
function packageActivationIdentity(file, directory) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (stat.ino === 0n || !(directory === "launcher" ? stat.isSymbolicLink() || stat.isFile() : directory ? stat.isDirectory() && !stat.isSymbolicLink() : stat.isFile()) || process.getuid && stat.uid !== BigInt(process.getuid())) throw new Error("Package publication object has an unsafe identity");
	return `${stat.dev}:${stat.ino}`;
}
function privatePackageActivationIdentity(file, directory) {
	const value = packageActivationIdentity(file, directory);
	const stat = fs.lstatSync(file);
	if ((stat.mode & 63) !== 0 || !directory && stat.nlink !== 1) throw new Error(`Package publication recovery permissions are unsafe${!directory && stat.nlink !== 1 ? ` (nlink=${stat.nlink}). Run openclaw doctor --fix.` : ""}`);
	return value;
}
function assertPackageActivationLayout(anchor) {
	if ([
		path.join(anchor, "operation.sqlite"),
		`${anchor}.sqlite`,
		`${anchor}.recovery.mjs`
	].some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) throw new Error("Legacy package activation artifacts require their original recovery owner; no migration is performed.");
}
/** A receipt is a read-only completion fact, never a grant for another effect. */
function isPackageActivationComplete(_anchor, record) {
	if (record.phase === "superseded") {
		if (record.intent?.kind !== "superseded-by-manual-install" && record.intent?.kind !== "recovery-lease-identity-changed" && record.intent?.kind !== "publication-settled-external-change" && record.intent?.kind !== "recovery-lease-missing") throw new Error("Package supersession fact is missing.");
		return record.intent.settled;
	}
	if (record.phase !== "anchor-retired" || record.intent?.kind !== "unlink-helper") return false;
	if (record.intent.identity !== record.descriptor.helperIdentity) throw new Error("Final helper unlink identity is invalid.");
	return true;
}
//#endregion
export { packageActivationIdentity as a, resolvePackageActivationAnchor as c, resolvePackageActivationJournalPath as d, isPackageActivationComplete as i, resolvePackageActivationControl as l, assertPackageActivationLayout as n, packageActivationRuntimeIdentity as o, capturePackageActivationRuntime as r, privatePackageActivationIdentity as s, LEGACY_PACKAGE_RECOVERY_HELPER as t, resolvePackageActivationHelper as u };
