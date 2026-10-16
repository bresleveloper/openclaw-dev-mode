import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import { n as clawPackageLifecycleLeaseKey, t as CLAW_PACKAGE_LIFECYCLE_LEASE_SCOPE } from "./claw-package-lifecycle-lease-key-DptsqXVg.mjs";
//#region src/state/claw-package-lifecycle-lease.ts
const artifacts = /* @__PURE__ */ new WeakMap();
function assertClawPackageLifecycleWriteArtifact(lease, artifact) {
	const original = artifacts.get(lease);
	if (!original || original.kind !== artifact.kind || original.source !== artifact.source || original.ref !== artifact.ref) throw new Error("Package write requires its original lifecycle owner.");
}
/** Retain shared artifact ownership through asynchronous work and worker settlement. */
function withClawPackageLifecycleLease(artifact, operation, options = {}) {
	const capturedArtifact = { ...artifact };
	return withOpenClawStateLease({
		scope: CLAW_PACKAGE_LIFECYCLE_LEASE_SCOPE,
		key: clawPackageLifecycleLeaseKey(capturedArtifact),
		database: {
			scope: "shared",
			options
		},
		leaseMs: 3e5,
		waitMs: 0,
		signal: options.signal,
		leaseLabel: "Claw package lifecycle",
		operationLabel: "claw.package.lifecycle"
	}, (lease) => {
		artifacts.set(lease, capturedArtifact);
		return operation(lease);
	});
}
//#endregion
export { withClawPackageLifecycleLease as n, assertClawPackageLifecycleWriteArtifact as t };
