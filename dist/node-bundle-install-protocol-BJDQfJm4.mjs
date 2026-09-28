import { Fn as object, Jn as string, Kt as custom, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import { ec as validateWorkerAdmissionHandshake } from "./src-BRUl7oDv.mjs";
import { n as MAX_WORKER_BUNDLE_ARCHIVE_BYTES } from "./worker-bundle-limits-CF239rpc.mjs";
//#region src/worker/node-bundle-install-protocol.ts
const NODE_WORKER_BUNDLE_TRANSFER_PATH = "/__openclaw__/worker-bundle/v1";
const NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE = "WORKER_BUNDLE_INSTALL_FAILED";
const REQUEST_MAX_BYTES = 16384;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const WorkerBuildSchema = custom((value) => validateWorkerAdmissionHandshake(value), "invalid worker build identity");
const BundleInstallInputSchema = object({
	gatewayNamespace: string().regex(GATEWAY_NAMESPACE_PATTERN),
	bundlePrewarm: literal(1).optional(),
	build: WorkerBuildSchema,
	archive: object({
		token: string().regex(TOKEN_PATTERN),
		sha256: string().regex(SHA256_PATTERN),
		bytes: number().int().min(1).max(MAX_WORKER_BUNDLE_ARCHIVE_BYTES)
	}).strict()
}).strict();
var NodeWorkerBundleInstallError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE;
		this.name = "NodeWorkerBundleInstallError";
	}
};
function parseNodeWorkerBundleInstallInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker bundle install request");
	try {
		return BundleInstallInputSchema.parse(JSON.parse(raw));
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`INVALID_REQUEST: invalid node worker bundle install request: ${detail}`, { cause: error });
	}
}
function parseNodeWorkerBundleInstallResult(value) {
	return validateWorkerAdmissionHandshake(value) ? structuredClone(value) : null;
}
function nodeWorkerBundleTransferPath(bundleHash) {
	return `${NODE_WORKER_BUNDLE_TRANSFER_PATH}/bundles/${bundleHash}`;
}
//#endregion
export { parseNodeWorkerBundleInstallInput as a, nodeWorkerBundleTransferPath as i, NODE_WORKER_BUNDLE_TRANSFER_PATH as n, parseNodeWorkerBundleInstallResult as o, NodeWorkerBundleInstallError as r, NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE as t };
