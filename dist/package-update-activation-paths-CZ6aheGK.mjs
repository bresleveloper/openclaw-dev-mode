import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { n as packageUpdateRefusal } from "./package-update-refusal-DuTdNl6m.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
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
	const expectedUid = process.getuid?.();
	const validType = directory === "launcher" ? stat.isSymbolicLink() || stat.isFile() : directory === "symlink" ? stat.isSymbolicLink() : directory ? stat.isDirectory() && !stat.isSymbolicLink() : stat.isFile();
	const foreignOwner = directory !== "parent" && expectedUid !== void 0 && stat.uid !== BigInt(expectedUid);
	const reason = stat.ino === 0n ? "missing inode" : !validType ? "unexpected type" : foreignOwner ? "owner mismatch" : null;
	if (reason) throw new Error(`Package publication object ${JSON.stringify(file)} has an unsafe identity (${reason}; owner UID ${stat.uid}, expected UID ${expectedUid ?? "unavailable"}). Verify this object's ownership and type before retrying openclaw update.`);
	return `${stat.dev}:${stat.ino}`;
}
function privatePackageActivationIdentity(file, role) {
	const directory = role === "anchor" || role === "control";
	const value = packageActivationIdentity(file, directory);
	const stat = fs.lstatSync(file);
	if ((stat.mode & 63) !== 0 || !directory && stat.nlink !== 1) {
		const basename = path.basename(file).replace(/[^A-Za-z0-9_.-]/gu, "_").slice(0, 64);
		const mode = (stat.mode & 4095).toString(8).padStart(4, "0");
		throw packageUpdateRefusal("package-recovery-permissions-unsafe", `Package recovery ${role} ${JSON.stringify(basename)} unsafe: mode=${mode} nlink=${stat.nlink} uid=${stat.uid}; expected owner-only mode${directory ? "" : " nlink=1"}.${!directory && stat.nlink !== 1 ? " Run openclaw doctor --fix." : ""}`);
	}
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
		if (!record.intent || !("settled" in record.intent)) throw new Error("Package supersession fact is missing.");
		return record.intent.settled;
	}
	if (record.phase !== "anchor-retired" || record.intent?.kind !== "unlink-helper") return false;
	if (record.intent.identity !== record.descriptor.helperIdentity) throw new Error("Final helper unlink identity is invalid.");
	return true;
}
function resolveImmutableRecoveryCommand(reference, descriptor) {
	return `${quoteCliArg(descriptor.runtime.path)} ${quoteCliArg(reference.helperPath)}`;
}
//#endregion
export { packageActivationIdentity as a, resolveImmutableRecoveryCommand as c, resolvePackageActivationHelper as d, resolvePackageActivationJournalPath as f, isPackageActivationComplete as i, resolvePackageActivationAnchor as l, assertPackageActivationLayout as n, packageActivationRuntimeIdentity as o, capturePackageActivationRuntime as r, privatePackageActivationIdentity as s, LEGACY_PACKAGE_RECOVERY_HELPER as t, resolvePackageActivationControl as u };
