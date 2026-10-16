import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/worker/node-workspace-retain-protocol.ts
const NODE_WORKER_RETAIN_REQUEST_MAX_BYTES = 1048576;
const RETAIN_MAX_ENTRIES = 4096;
const MANIFEST_REFS_MAX_ENTRIES = 32;
const NODE_WORKER_BUNDLE_RETAIN_MAX_HASHES = 4096;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const BoundedIdentifierSchema = string().min(1).max(256).refine((value) => value.trim() === value && !value.includes("\0"));
const ManifestRefsSchema = array(string().regex(MANIFEST_REF_PATTERN)).max(MANIFEST_REFS_MAX_ENTRIES).superRefine((refs, context) => {
	if (new Set(refs).size !== refs.length) context.addIssue({
		code: "custom",
		message: "manifestRefs must not contain duplicates"
	});
}).transform((refs) => refs.toSorted()).nullable();
const RetainEntrySchema = object({
	environmentId: BoundedIdentifierSchema,
	sessionId: BoundedIdentifierSchema,
	generation: number().int().min(1).max(Number.MAX_SAFE_INTEGER),
	manifestRefs: ManifestRefsSchema
}).strict();
const BundleHashesSchema = array(string().regex(BUNDLE_HASH_PATTERN)).max(NODE_WORKER_BUNDLE_RETAIN_MAX_HASHES).superRefine((hashes, context) => {
	if (new Set(hashes).size !== hashes.length) context.addIssue({
		code: "custom",
		message: "bundleHashes must not contain duplicates"
	});
}).transform((hashes) => hashes.toSorted());
const RetainInputSchema = object({
	version: literal(1),
	gatewayNamespace: BoundedIdentifierSchema.regex(GATEWAY_NAMESPACE_PATTERN),
	controllerId: BoundedIdentifierSchema.max(128),
	sequence: number().int().min(1).max(Number.MAX_SAFE_INTEGER),
	retain: array(RetainEntrySchema).max(RETAIN_MAX_ENTRIES),
	bundleHashes: BundleHashesSchema.optional(),
	acknowledgedBundleGeneration: number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
	bundleStatusHash: string().regex(BUNDLE_HASH_PATTERN).optional()
}).strict().superRefine((input, context) => {
	if (input.acknowledgedBundleGeneration !== void 0 && input.bundleHashes === void 0) context.addIssue({
		code: "custom",
		message: "acknowledgedBundleGeneration requires bundleHashes"
	});
	if (input.bundleStatusHash !== void 0 && !input.bundleHashes?.includes(input.bundleStatusHash)) context.addIssue({
		code: "custom",
		message: "bundleStatusHash must be retained by bundleHashes"
	});
});
const BundleStatusSchema = object({
	bundleHash: string().regex(BUNDLE_HASH_PATTERN),
	status: _enum(["installed", "missing"])
}).strict();
const RetainResultSchema = object({
	applied: boolean(),
	deleted: number().int().min(0).max(Number.MAX_SAFE_INTEGER),
	hasMore: boolean(),
	bundleDeleted: number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
	bundleGeneration: number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
	bundleStatus: BundleStatusSchema.optional()
}).strict();
function parseNodeWorkerWorkspaceRetainInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > 1048576) throw new Error("INVALID_REQUEST: invalid node worker workspace retain request");
	try {
		const parsed = RetainInputSchema.parse(JSON.parse(raw));
		const keys = /* @__PURE__ */ new Set();
		for (const entry of parsed.retain) {
			const key = `${entry.environmentId}\0${entry.sessionId}\0${entry.generation}`;
			if (keys.has(key)) throw new Error("workspace retain entries must be unique");
			keys.add(key);
		}
		parsed.retain.sort((left, right) => left.environmentId.localeCompare(right.environmentId) || left.sessionId.localeCompare(right.sessionId) || left.generation - right.generation);
		return parsed;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`INVALID_REQUEST: invalid node worker workspace retain request: ${detail}`, { cause: error });
	}
}
function parseNodeWorkerWorkspaceRetainResult(value) {
	return RetainResultSchema.safeParse(value).data ?? null;
}
//#endregion
export { parseNodeWorkerWorkspaceRetainResult as i, NODE_WORKER_RETAIN_REQUEST_MAX_BYTES as n, parseNodeWorkerWorkspaceRetainInput as r, NODE_WORKER_BUNDLE_RETAIN_MAX_HASHES as t };
