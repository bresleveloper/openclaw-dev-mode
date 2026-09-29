import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER } from "./auth-rate-limit-DuWYneOU.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { i as NODE_WORKSPACE_TRANSFER_PATH } from "./node-workspace-transfer-protocol-CifFHpcH.mjs";
import { n as readWorkspaceTransferBody } from "./node-workspace-transfer-body-CE3uVhq8.mjs";
import { c as sendJson, h as watchClientDisconnect } from "./http-common-Ckbyca3h.mjs";
import { t as resolveHttpContentEncodings } from "./http-content-encoding-BxlZphnc.mjs";
import { n as isNodeWorkspaceTransferLimitError, r as nodeWorkspaceTransferInvalidReason } from "./node-workspace-transfer-service-CGt2rO4w.mjs";
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
	const environmentId = segments[1] ? decodeEnvironmentId(segments[1]) : void 0;
	if (!environmentId) return;
	if (method === "GET" && segments.length === 5 && segments[0] === "environments" && segments[2] === "snapshots" && segments[3] !== void 0 && SHA256_PATTERN.test(segments[3]) && (segments[4] === "manifest" || segments[4] === "pack")) return {
		kind: segments[4],
		direction: "download",
		environmentId,
		manifestRef: `sha256:${segments[3]}`
	};
	if (method === "GET" && segments.length === 4 && segments[0] === "environments" && segments[2] === "blobs" && segments[3] !== void 0 && SHA256_PATTERN.test(segments[3])) return {
		kind: "blob",
		direction: "download",
		environmentId,
		sha256: segments[3]
	};
	if (method === "POST" && segments.length === 4 && segments[0] === "environments" && segments[2] === "reconciliations" && segments[3] !== void 0 && SHA256_PATTERN.test(segments[3])) return {
		kind: "reconcile",
		direction: "upload",
		environmentId,
		baseManifestRef: `sha256:${segments[3]}`
	};
}
function bearerToken(req) {
	const authorization = normalizeOptionalString(req.headers.authorization);
	if (!authorization?.toLowerCase().startsWith("bearer ")) return;
	return normalizeOptionalString(authorization.slice(7));
}
function sendOpaqueNotFound(res) {
	sendJson(res, 404, OPAQUE_NOT_FOUND);
}
function sendTransferRateLimited(res, retryAfterMs) {
	if (retryAfterMs > 0) res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1e3)));
	sendJson(res, 429, { error: "rate_limited" });
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
	const bearer = bearerToken(params.req);
	const admission = await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER,
		run: async () => {
			const rateCheck = params.rateLimiter?.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			if (rateCheck && !rateCheck.allowed) return {
				kind: "rate-limited",
				retryAfterMs: rateCheck.retryAfterMs
			};
			const outcome = bearer && params.callback ? await params.callback({
				req: params.req,
				res: params.res,
				route,
				bearer
			}) : { kind: "unauthorized" };
			if (outcome.kind === "unauthorized") {
				params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
				return outcome;
			}
			params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			return outcome;
		}
	});
	if (admission.kind === "rate-limited") {
		sendTransferRateLimited(params.res, admission.retryAfterMs);
		return true;
	}
	if (admission.kind === "unauthorized") {
		sendOpaqueNotFound(params.res);
		return true;
	}
	await admission.handle();
	return true;
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
						if (!blob || !await service.verifyBlob({
							path: blob.path,
							size: blob.size,
							sha256: blob.sha256
						})) {
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
						const body = Buffer.from(JSON.stringify(result));
						res.writeHead(200, {
							"content-type": "application/json; charset=utf-8",
							"content-length": String(body.byteLength)
						});
						res.end(body);
					} catch (error) {
						if (signal.aborted || res.destroyed) return;
						const limit = isNodeWorkspaceTransferLimitError(error);
						const reason = nodeWorkspaceTransferInvalidReason(error);
						const body = Buffer.from(JSON.stringify({
							error: limit ? "workspace_transfer_limit" : "workspace_transfer_invalid",
							...reason ? { reason } : {}
						}));
						res.writeHead(limit ? 413 : 400, {
							"content-type": "application/json; charset=utf-8",
							"content-length": String(body.byteLength)
						});
						res.end(body);
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
