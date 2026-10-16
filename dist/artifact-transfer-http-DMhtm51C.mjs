import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { d as AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER } from "./auth-rate-limit-CnTz49S4.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-C-bwOG0P.mjs";
import { _ as watchClientDisconnect, u as sendJson } from "./http-common-DJ7rKVvj.mjs";
import { t as ArtifactTransferBusyError } from "./artifact-transfer-service-BjhnzCAB.mjs";
import { Transform } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/gateway/worker-environments/artifact-transfer-http.ts
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
function sendOpaqueNotFound(res) {
	sendJson(res, 404, { error: "not_found" });
}
function streamInterruptionReason(error, token, tarballPath) {
	const message = (error instanceof Error ? error.message : String(error)).replaceAll(token, "[redacted]").replaceAll(tarballPath, "[artifact]").replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s"'<>]+/giu, "[url]").replace(/(["'])[^"'<>]*[\\/][^"'<>]*\1/gu, "[path]").replace(/[^\s"'<>(),;=]*[\\/][^\s"'<>(),;]*/gu, "[path]");
	const redacted = redactSensitiveText(message, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return `stream error (${truncateUtf16Safe(redacted || "unknown error", 240)})`;
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
	return handleWorkerTransferHttpRequest(params, (bearer) => params.callback?.({
		req: params.req,
		res: params.res,
		artifactKey,
		bearer
	}));
}
async function handleWorkerTransferHttpRequest(params, authorize) {
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
			const pendingAuthorization = bearer ? authorize(bearer) : void 0;
			const outcome = pendingAuthorization ? await pendingAuthorization : { kind: "unauthorized" };
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
		let authorization;
		try {
			authorization = service.authorize({
				token: bearer,
				artifactKey
			});
		} catch (error) {
			if (!(error instanceof ArtifactTransferBusyError)) throw error;
			return {
				kind: "authorized",
				handle: () => sendJson(res, 503, { error: "transfer_in_progress" })
			};
		}
		if (!authorization) return { kind: "unauthorized" };
		const { capability } = authorization;
		return {
			kind: "authorized",
			handle: async () => {
				let servedBytes = 0;
				let interruptionReason;
				const authoritySignal = service.authorizationSignal(authorization);
				const recordAuthorityClosure = () => {
					interruptionReason ??= `authority closed (${capability.revocationReason ?? "authorization lost"})`;
				};
				authoritySignal.addEventListener("abort", recordAuthorityClosure, { once: true });
				if (authoritySignal.aborted) recordAuthorityClosure();
				const clientAbort = new AbortController();
				const stopWatchingDisconnect = watchClientDisconnect(req, res, clientAbort, () => {
					interruptionReason ??= "client disconnected";
				});
				const signal = AbortSignal.any([authoritySignal, clientAbort.signal]);
				let fileHandle;
				try {
					const file = await service.openFile(authorization);
					fileHandle = file?.handle;
					if (!file || signal.aborted || !service.isAuthorizationCurrent(authorization)) {
						sendOpaqueNotFound(res);
						return;
					}
					const range = req.headers.range;
					const start = range === void 0 ? 0 : Number(/^bytes=(\d+)-$/u.exec(range)?.[1]);
					if (range !== void 0 && (!Number.isSafeInteger(start) || start >= file.bytes)) {
						res.setHeader("Content-Range", `bytes */${file.bytes}`);
						sendJson(res, 416, { error: "range_not_satisfiable" });
						return;
					}
					servedBytes = start;
					const checkAuthority = new Transform({ transform(chunk, _encoding, next) {
						if (!service.isAuthorizationCurrent(authorization)) {
							next(/* @__PURE__ */ new Error("Worker artifact transfer authority closed"));
							return;
						}
						servedBytes += chunk.length;
						try {
							capability.onProgress?.(servedBytes);
						} catch {}
						next(null, chunk);
					} });
					res.writeHead(range === void 0 ? 200 : 206, {
						"content-type": "application/octet-stream",
						"content-length": String(file.bytes - start),
						"accept-ranges": "bytes",
						...range === void 0 ? {} : { "content-range": `bytes ${start}-${file.bytes - 1}/${file.bytes}` },
						"x-openclaw-content-sha256": file.sha256
					});
					const stream = file.handle.createReadStream({
						start,
						end: file.bytes - 1,
						autoClose: false
					});
					stream.once("error", (error) => {
						interruptionReason ??= streamInterruptionReason(error, capability.token, capability.artifact.tarballPath);
					});
					await pipeline$1(stream, checkAuthority, res, { signal });
				} catch (error) {
					interruptionReason ??= streamInterruptionReason(error, capability.token, capability.artifact.tarballPath);
					if (!res.headersSent && !res.destroyed) sendOpaqueNotFound(res);
					else if (!res.destroyed) res.destroy();
				} finally {
					stopWatchingDisconnect();
					authoritySignal.removeEventListener("abort", recordAuthorityClosure);
					if (servedBytes !== capability.artifact.tarballBytes || !res.writableFinished) try {
						capability.onInterrupted?.(servedBytes, interruptionReason ?? "stream error");
					} catch {}
					try {
						await fileHandle?.close();
					} finally {
						service.finish(authorization);
					}
				}
			}
		};
	};
}
//#endregion
export { handleArtifactTransferHttpRequest as n, handleWorkerTransferHttpRequest as r, createArtifactTransferHttpCallback as t };
