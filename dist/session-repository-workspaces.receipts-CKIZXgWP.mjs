import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
//#region src/state/session-repository-workspaces.receipts.ts
function isRepositoryWorkspace(value) {
	return isRecord(value) && [
		"workspaceId",
		"agentId",
		"sessionKey",
		"url",
		"branch"
	].every((key) => typeof value[key] === "string") && [
		"requestedRef",
		"baseCommit",
		"baseManifestHash",
		"checkpointRef",
		"manifestHash"
	].every((key) => value[key] === null || typeof value[key] === "string") && typeof value.runSetupScript === "boolean" && [
		"revision",
		"createdAtMs",
		"updatedAtMs"
	].every((key) => typeof value[key] === "number");
}
const repositoryWorkspacePublication = createStateDomainPublication({
	domain: "repository-workspace",
	keyOf: (row) => row.workspaceId,
	isValue: isRepositoryWorkspace
});
//#endregion
export { repositoryWorkspacePublication as n, isRepositoryWorkspace as t };
