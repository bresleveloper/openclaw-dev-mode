import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { O as NODE_WORKER_WORKSPACE_PREPARE_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/preparation-identity.ts
const Digest = string().regex(/^[a-f0-9]{64}$/u);
const Artifacts = object({
	nodeBootstrapSha256: Digest,
	enabledPluginIds: array(string().min(1).max(256)).max(256),
	workerBundleHash: Digest,
	workerArchiveSha256: Digest,
	openclawVersion: string().min(1).max(128),
	protocolFeatures: array(string().min(1).max(128)).max(64)
}).strict();
const Target = object({
	machineClass: string().min(1).max(256),
	platform: string().min(1).max(64),
	arch: string().min(1).max(64).optional()
}).strict();
const Preparation = object({
	key: Digest,
	cacheKey: Digest,
	contractVersion: literal(1),
	setupRecipe: string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u).optional(),
	runSetupScript: boolean().optional(),
	target: Target,
	artifacts: Artifacts
}).strict();
/** Immutable artifact facts are separate from the reserve's demand/expiry/consumption tuple. */
function readWorkerProjectPreparation(project) {
	if (!isRecord(project) || project.preparation === void 0) return;
	const parsed = Preparation.safeParse(project.preparation);
	if (!parsed.success) throw new Error("Worker project preparation identity is invalid");
	return parsed.data;
}
function createWorkerProjectPreparationIdentity(params) {
	const artifacts = Artifacts.parse(params.artifacts);
	artifacts.enabledPluginIds = [...new Set(artifacts.enabledPluginIds)].toSorted();
	artifacts.protocolFeatures = [...new Set(artifacts.protocolFeatures)].toSorted();
	const facts = {
		contractVersion: 1,
		...params.setupRecipe ? { setupRecipe: params.setupRecipe } : {},
		...params.runSetupScript === false ? { runSetupScript: false } : {},
		target: Target.parse(params.target),
		artifacts
	};
	const compatibility = {
		...facts,
		namespace: params.namespace,
		providerId: params.providerId,
		profileId: params.profileId,
		profile: {
			...params.profileSnapshot,
			machineClass: facts.target.machineClass,
			executionMode: params.profileSnapshot.executionMode ?? "worker-turn"
		},
		project: { key: params.project.key },
		workspaceProtocol: NODE_WORKER_WORKSPACE_PREPARE_COMMAND
	};
	const digest = (value) => createHash("sha256").update(stableStringify(value)).digest("hex");
	return {
		key: digest({
			...compatibility,
			project: {
				...compatibility.project,
				baseCommit: params.project.baseCommit
			}
		}),
		cacheKey: digest(compatibility),
		...facts
	};
}
//#endregion
export { readWorkerProjectPreparation as n, createWorkerProjectPreparationIdentity as t };
