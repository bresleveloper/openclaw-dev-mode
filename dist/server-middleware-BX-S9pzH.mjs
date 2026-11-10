import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import { n as isAuthorizedBrowserRequest, t as firstHeader } from "./http-auth-XU2N7GNv.mjs";
import { createServer } from "node:http";
import express from "express";
//#region extensions/browser/src/browser/http-listen.ts
function listenBrowserHttpServer(app, port, host) {
	return new Promise((resolve, reject) => {
		const server = createServer(app);
		const onError = (error) => {
			server.off("listening", onListening);
			reject(error);
		};
		const onListening = () => {
			server.off("error", onError);
			resolve(server);
		};
		server.once("error", onError);
		server.once("listening", onListening);
		server.listen(port, host);
	});
}
//#endregion
//#region extensions/browser/src/browser/csrf.ts
function isMutatingMethod(method) {
	const m = (method || "").trim().toUpperCase();
	return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}
function isLoopbackUrl(value) {
	return isLoopbackHost(URL.parse(value.trim())?.hostname ?? "");
}
/** Return true when a request should be rejected as browser-originated CSRF. */
function shouldRejectBrowserMutation(params) {
	if (!isMutatingMethod(params.method)) return false;
	if (normalizeLowercaseStringOrEmpty(params.secFetchSite) === "cross-site") return true;
	const source = (params.origin ?? "").trim() || (params.referer ?? "").trim();
	return source ? !isLoopbackUrl(source) : false;
}
/** Create middleware that rejects unsafe browser-control mutations. */
function browserMutationGuardMiddleware() {
	return (req, res, next) => {
		if (shouldRejectBrowserMutation({
			method: req.method,
			origin: firstHeader(req.headers.origin),
			referer: firstHeader(req.headers.referer),
			secFetchSite: firstHeader(req.headers["sec-fetch-site"])
		})) {
			res.status(403).send("Forbidden");
			return;
		}
		next();
	};
}
//#endregion
//#region extensions/browser/src/browser/server-middleware.ts
const authenticatedRequests = /* @__PURE__ */ new WeakSet();
function hasVerifiedBrowserAuth(req) {
	return authenticatedRequests.has(req);
}
function installBrowserCommonMiddleware(app) {
	app.use((req, res, next) => {
		const ctrl = new AbortController();
		const abort = () => ctrl.abort(/* @__PURE__ */ new Error("request aborted"));
		req.once("aborted", abort);
		res.once("close", () => {
			if (!res.writableEnded) abort();
		});
		Object.defineProperty(req, "signal", {
			value: ctrl.signal,
			configurable: true
		});
		next();
	});
	app.use(browserMutationGuardMiddleware());
	app.use(express.json({ limit: "1mb" }));
}
function installBrowserAuthMiddleware(app, auth) {
	if (!auth.token && !auth.password) return;
	app.use((req, res, next) => {
		if (isAuthorizedBrowserRequest(req, auth)) {
			authenticatedRequests.add(req);
			return next();
		}
		res.status(401).send("Unauthorized");
	});
}
//#endregion
export { listenBrowserHttpServer as i, installBrowserAuthMiddleware as n, installBrowserCommonMiddleware as r, hasVerifiedBrowserAuth as t };
