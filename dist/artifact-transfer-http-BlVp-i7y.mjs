import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER } from "./auth-rate-limit-DuWYneOU.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { c as sendJson, h as watchClientDisconnect } from "./http-common-Ckbyca3h.mjs";
import { Transform } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/gateway/worker-environments/artifact-transfer-http.ts
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
function sendOpaqueNotFound(res) {
	sendJson(res, 404, { error: "not_found" });
}
async function handleArtifactTransferHttpRequest(params) {
	const parsed = URL.parse(params.req.url ?? "/", "http://localhost");
	if (!parsed || params.classifyPath(parsed.pathname) === "outside") return false;
	params.res.setHeader("Cache-Control", "no-store");
	const prefix = params.routePrefix;
	const artifactKey = parsed.pathname.startsWith(prefix) ? parsed.pathname.slice(prefix.length) : "";
	if (params.req.method !== "GET" || !SHA256_PATTERN.test(artifactKey) || parsed.search || parsed.hash) {
		sendOpaqueNotFound(params.res);
		return true;
	}
	const authorization = normalizeOptionalString(params.req.headers.authorization);
	const bearer = authorization?.toLowerCase().startsWith("bearer ") ? normalizeOptionalString(authorization.slice(7)) : void 0;
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
				artifactKey,
				bearer
			}) : { kind: "unauthorized" };
			if (outcome.kind === "unauthorized") params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			else params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			return outcome;
		}
	});
	if (admission.kind === "rate-limited") {
		if (admission.retryAfterMs > 0) params.res.setHeader("Retry-After", String(Math.ceil(admission.retryAfterMs / 1e3)));
		sendJson(params.res, 429, { error: "rate_limited" });
		return true;
	}
	if (admission.kind === "unauthorized") {
		sendOpaqueNotFound(params.res);
		return true;
	}
	await admission.handle();
	return true;
}
function createArtifactTransferHttpCallback(service) {
	return async ({ req, res, artifactKey, bearer }) => {
		const authorization = service.authorize({
			token: bearer,
			artifactKey
		});
		if (!authorization) return { kind: "unauthorized" };
		return {
			kind: "authorized",
			handle: async () => {
				const clientAbort = new AbortController();
				const stopWatchingDisconnect = watchClientDisconnect(req, res, clientAbort);
				const signal = AbortSignal.any([service.authorizationSignal(authorization), clientAbort.signal]);
				let fileHandle;
				try {
					const file = await service.openFile(authorization);
					fileHandle = file?.handle;
					if (!file || signal.aborted || !service.isAuthorizationCurrent(authorization)) {
						sendOpaqueNotFound(res);
						return;
					}
					const checkAuthority = new Transform({ transform(chunk, _encoding, next) {
						next(service.isAuthorizationCurrent(authorization) ? null : /* @__PURE__ */ new Error("Worker artifact transfer authority closed"), chunk);
					} });
					res.writeHead(200, {
						"content-type": "application/octet-stream",
						"content-length": String(file.bytes),
						"x-openclaw-content-sha256": file.sha256
					});
					const stream = file.handle.createReadStream({
						start: 0,
						end: file.bytes - 1,
						autoClose: false
					});
					await pipeline$1(stream, checkAuthority, res, { signal });
				} catch {
					if (!res.headersSent && !res.destroyed) sendOpaqueNotFound(res);
					else if (!res.destroyed) res.destroy();
				} finally {
					stopWatchingDisconnect();
					service.revoke(authorization);
					await fileHandle?.close();
				}
			}
		};
	};
}
//#endregion
export { handleArtifactTransferHttpRequest as n, createArtifactTransferHttpCallback as t };
