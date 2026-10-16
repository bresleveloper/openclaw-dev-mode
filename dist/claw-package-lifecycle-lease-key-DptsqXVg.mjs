import { resolve } from "node:path";
//#region src/state/claw-package-lifecycle-lease-key.ts
const CLAW_PACKAGE_LIFECYCLE_LEASE_SCOPE = "claw-package-lifecycle";
function clawPackageLifecycleLeaseKey(artifact) {
	return artifact.kind === "skill" ? `skill:${artifact.source}:workspace:${resolve(artifact.workspace)}` : `${artifact.kind}:${artifact.source}:${artifact.ref}`;
}
//#endregion
export { clawPackageLifecycleLeaseKey as n, CLAW_PACKAGE_LIFECYCLE_LEASE_SCOPE as t };
