import { s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { i as NODE_WORKSPACE_TRANSFER_PATH } from "./node-workspace-transfer-protocol-Ct5Tr1Uo.mjs";
import { n as readWorkspaceTransferBody } from "./node-workspace-transfer-body-CE3uVhq8.mjs";
import { _ as watchClientDisconnect, u as sendJson } from "./http-common-DJ7rKVvj.mjs";
import { t as resolveHttpContentEncodings } from "./http-content-encoding-DVf1MER7.mjs";
import { r as handleWorkerTransferHttpRequest } from "./artifact-transfer-http-DMhtm51C.mjs";
import { n as nodeWorkspaceTransferInvalidReason, t as NodeWorkspaceTransferLimitError } from "./node-workspace-upload-reader-AYpk0XZE.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { constants as constants$1, createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
//#region src/gateway/worker-environments/node-workspace-transfer-http.ts
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const MANIFEST_ENCODINGS = /* @__PURE__ */ new Set(["gzip"]);
const TRANSFER_TIMEOUT_MS = 6e5;
const MAX_ENVIRONMENT_ID_LENGTH = 256;
const OPAQUE_NOT_FOUND = { error: "not_found" };
function decodeEnvironmentId(segment) {
	let value;
	try {
		value = decodeURIComponent(segment);
	} catch {
		return;
	}
	if (!value || value.length > MAX_ENVIRONMENT_ID_LENGTH || value.includes("/") || value.includes("\\") || value.includes("\0")) return;
	return value;
}
function parseNodeWorkspaceTransferHttpRoute(pathname, method) {
	if (!pathname.startsWith(`/__openclaw__/worker-transfer/v1/`)) return;
	const segments = pathname.slice(NODE_WORKSPACE_TRANSFER_PATH.length + 1).split("/");
	const [resource, rawEnvironmentId, collection, digest, part] = segments;
	const environmentId = rawEnvironmentId ? decodeEnvironmentId(rawEnvironmentId) : void 0;
	if (!environmentId || resource !== "environments" || !digest || !SHA256_PATTERN.test(digest)) return;
	if (method === "GET" && segments.length === 5 && collection === "snapshots" && (part === "manifest" || part === "pack")) return {
		kind: part,
		direction: "download",
		environmentId,
		manifestRef: `sha256:${digest}`
	};
	if (method === "GET" && segments.length === 4 && collection === "blobs") return {
		kind: "blob",
		direction: "download",
		environmentId,
		sha256: digest
	};
	if (method === "POST" && segments.length === 4 && collection === "reconciliations") return {
		kind: "reconcile",
		direction: "upload",
		environmentId,
		baseManifestRef: `sha256:${digest}`
	};
}
function sendOpaqueNotFound(res) {
	sendJson(res, 404, OPAQUE_NOT_FOUND);
}
/** Reserve and authenticate the node workspace transfer namespace before normal HTTP routing. */
async function handleNodeWorkspaceTransferHttpRequest(params) {
	const parsed = URL.parse(params.req.url ?? "/", "http://localhost");
	if (!parsed?.pathname || classifyNodeWorkspaceTransferPath(parsed.pathname) === "outside") return false;
	params.res.setHeader("Cache-Control", "no-store");
	const route = parseNodeWorkspaceTransferHttpRoute(parsed.pathname, params.req.method);
	if (!route || parsed.search) {
		sendOpaqueNotFound(params.res);
		return true;
	}
	return handleWorkerTransferHttpRequest(params, (bearer) => params.callback?.({
		req: params.req,
		res: params.res,
		route,
		bearer
	}));
}
function createNodeWorkspaceTransferHttpCallback(service) {
	return async ({ req, res, route, bearer }) => {
		const authorization = service.authorize({
			route,
			token: bearer
		});
		if (!authorization) return { kind: "unauthorized" };
		return {
			kind: "authorized",
			handle: async () => {
				const clientAbort = new AbortController();
				const stopWatchingDisconnect = watchClientDisconnect(req, res, clientAbort);
				const signal = AbortSignal.any([
					service.authorizationSignal(authorization),
					clientAbort.signal,
					AbortSignal.timeout(TRANSFER_TIMEOUT_MS)
				]);
				const abortTransfer = () => {
					if (!res.destroyed) res.destroy(signal.reason instanceof Error ? signal.reason : void 0);
					if (!req.destroyed) req.destroy(signal.reason instanceof Error ? signal.reason : void 0);
				};
				signal.addEventListener("abort", abortTransfer, { once: true });
				if (signal.aborted) abortTransfer();
				const stillCurrent = () => !signal.aborted && service.isAuthorizationCurrent(authorization);
				try {
					if (route.kind === "manifest" || route.kind === "pack") {
						const snapshot = service.snapshot(authorization);
						if (!snapshot) {
							sendOpaqueNotFound(res);
							return;
						}
						if (route.kind === "manifest") {
							let body = Buffer.from(snapshot.rawManifest);
							const [encoding] = resolveHttpContentEncodings(req.headers["accept-encoding"], MANIFEST_ENCODINGS);
							if (encoding === "gzip") body = await pipeline([body], createGzip({ level: constants$1.Z_BEST_SPEED }), async (source) => await readWorkspaceTransferBody(source, MAX_WORKSPACE_MANIFEST_BYTES), { signal });
							if (!stillCurrent()) {
								if (!signal.aborted) sendOpaqueNotFound(res);
								return;
							}
							res.setHeader("Vary", "Accept-Encoding");
							if (encoding === void 0) {
								res.writeHead(406).end();
								return;
							}
							res.writeHead(200, {
								"content-type": "application/json; charset=utf-8",
								"content-length": String(body.byteLength),
								...encoding === "gzip" ? { "content-encoding": "gzip" } : {}
							});
							res.end(body);
							return;
						}
						const packPath = await service.pack(authorization);
						if (!packPath) {
							sendOpaqueNotFound(res);
							return;
						}
						const stats = await fs$1.stat(packPath);
						if (!stillCurrent()) return;
						res.writeHead(200, {
							"content-type": "application/octet-stream",
							"content-length": String(stats.size)
						});
						await pipeline(fs.createReadStream(packPath), res, { signal });
						return;
					}
					if (route.kind === "blob") {
						const blob = service.blob(authorization);
						if (!blob || !await service.verifyBlob(blob)) {
							sendOpaqueNotFound(res);
							return;
						}
						if (!stillCurrent()) return;
						res.writeHead(200, {
							"content-type": "application/octet-stream",
							"content-length": String(blob.size)
						});
						await pipeline(fs.createReadStream(blob.path), res, { signal });
						return;
					}
					try {
						const result = await service.receiveUpload({
							authorization,
							request: req,
							signal
						});
						if (!stillCurrent()) return;
						sendJson(res, 200, result);
					} catch (error) {
						if (signal.aborted || res.destroyed) return;
						const limit = error instanceof NodeWorkspaceTransferLimitError;
						const reason = nodeWorkspaceTransferInvalidReason(error);
						sendJson(res, limit ? 413 : 400, {
							error: limit ? "workspace_transfer_limit" : "workspace_transfer_invalid",
							...reason ? { reason } : {}
						});
					}
				} catch (error) {
					if (!signal.aborted && !res.destroyed) throw error;
				} finally {
					signal.removeEventListener("abort", abortTransfer);
					stopWatchingDisconnect();
				}
			}
		};
	};
}
//#endregion
export { handleNodeWorkspaceTransferHttpRequest as n, createNodeWorkspaceTransferHttpCallback as t };
