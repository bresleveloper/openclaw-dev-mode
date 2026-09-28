import { t as resolveSecretRefString } from "../../resolve-C3ItmvEK.mjs";
import { i as resolveWorkerNpmInstallationArtifact, r as createWorkerBundleProducer, t as bootstrapWorker } from "../../bootstrap-DH_A9h5r.mjs";
//#region src/gateway/worker-environments/identity.ts
function requireIdentity(value) {
	if (typeof value === "object" && value !== null && "kind" in value && value.kind === "path" && "path" in value && typeof value.path === "string" && value.path.trim()) return {
		kind: "path",
		path: value.path
	};
	if (typeof value === "object" && value !== null && "kind" in value && value.kind === "material" && "contents" in value && typeof value.contents === "string" && value.contents.trim()) return {
		kind: "material",
		contents: value.contents
	};
	throw new Error("Worker SSH identity resolver returned an invalid identity");
}
/** Routes dynamic identities to their provider owner and configured refs to the generic resolver. */
async function resolveWorkerSshIdentity(params) {
	return requireIdentity(params.provider.resolveSshIdentity ? await params.provider.resolveSshIdentity({
		leaseId: params.leaseId,
		profile: params.profile,
		keyRef: params.keyRef
	}) : await params.resolveGeneric(params.keyRef));
}
//#endregion
export { bootstrapWorker, createWorkerBundleProducer, resolveSecretRefString, resolveWorkerNpmInstallationArtifact, resolveWorkerSshIdentity };
