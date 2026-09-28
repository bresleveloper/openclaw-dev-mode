import { Jn as string, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as workerProtocolObject } from "./protocol-record-sxcNOJSy.mjs";
import { createHash } from "node:crypto";
//#region src/worker/node-workspace-transfer-protocol.ts
const NODE_WORKSPACE_EMPTY_MANIFEST = JSON.stringify({
	version: 1,
	baseCommit: null,
	entries: []
});
const NODE_WORKSPACE_EMPTY_MANIFEST_REF = `sha256:${createHash("sha256").update(NODE_WORKSPACE_EMPTY_MANIFEST).digest("hex")}`;
const NODE_WORKSPACE_TRANSFER_PATH = "/__openclaw__/worker-transfer/v1";
const NODE_WORKSPACE_TRANSFER_ERROR_CODE = "WORKSPACE_TRANSFER_FAILED";
const NODE_WORKSPACE_TRANSFER_INVALID_REASONS = [
	"content_length",
	"file_digest",
	"file_size",
	"manifest",
	"payload",
	"premature_eof",
	"staging",
	"trailing_bytes"
];
function isNodeWorkspaceTransferInvalidReason(value) {
	return typeof value === "string" && NODE_WORKSPACE_TRANSFER_INVALID_REASONS.some((reason) => reason === value);
}
/** Retains private transfer context until the node boundary serializes a safe diagnostic. */
var NodeWorkerWorkspaceTransferError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = NODE_WORKSPACE_TRANSFER_ERROR_CODE;
		this.name = "NodeWorkerWorkspaceTransferError";
		this.operation = options?.operation;
		this.stage = options?.stage;
	}
};
const ManifestRef = string().regex(/^sha256:[a-f0-9]{64}$/u);
const TransferToken = string().min(1).max(1024).refine((value) => !value.includes("\0"));
const NodeWorkerWorkspaceTransferInputSchema = union([workerProtocolObject({
	direction: literal("download"),
	token: TransferToken,
	manifestRef: ManifestRef,
	/** Reuse this prepared project's immutable Git objects before downloading a pack. */
	seedKey: string().regex(/^[a-f0-9]{64}$/u).optional(),
	/** Install attachment files only; never replace or delete workspace entries. */
	attachments: literal(true).optional(),
	/** Restore only the checkpoint delta onto its independently cloned Git base. */
	checkpointBaseManifestRef: ManifestRef.optional()
}).refine((value) => (value.seedKey === void 0 || value.attachments === void 0) && (value.checkpointBaseManifestRef === void 0 || value.attachments === void 0 && value.seedKey === void 0)), workerProtocolObject({
	direction: literal("upload"),
	token: TransferToken,
	baseManifestRef: ManifestRef,
	/** Last accepted raw manifest; independent of the cumulative repository base. */
	referenceManifestRef: ManifestRef,
	/** Capture normalized publication artifacts under this pinned repository base. */
	publicationBaseCommit: string().regex(/^[a-f0-9]{40}$/u).optional()
})]);
function nodeWorkspaceTransferEnvironmentPath(environmentId) {
	return `${NODE_WORKSPACE_TRANSFER_PATH}/environments/${encodeURIComponent(environmentId)}`;
}
function nodeWorkspaceTransferManifestPath(environmentId, manifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/snapshots/${manifestRef.slice(7)}/manifest`;
}
function nodeWorkspaceTransferPackPath(environmentId, manifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/snapshots/${manifestRef.slice(7)}/pack`;
}
function nodeWorkspaceTransferBlobPath(environmentId, sha256) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/blobs/${sha256}`;
}
function nodeWorkspaceTransferReconcilePath(environmentId, baseManifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/reconciliations/${baseManifestRef.slice(7)}`;
}
//#endregion
export { NodeWorkerWorkspaceTransferError as a, nodeWorkspaceTransferBlobPath as c, nodeWorkspaceTransferReconcilePath as d, NODE_WORKSPACE_TRANSFER_PATH as i, nodeWorkspaceTransferManifestPath as l, NODE_WORKSPACE_EMPTY_MANIFEST_REF as n, NodeWorkerWorkspaceTransferInputSchema as o, NODE_WORKSPACE_TRANSFER_ERROR_CODE as r, isNodeWorkspaceTransferInvalidReason as s, NODE_WORKSPACE_EMPTY_MANIFEST as t, nodeWorkspaceTransferPackPath as u };
