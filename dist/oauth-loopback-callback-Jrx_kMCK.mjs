import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as renderOAuthPage, n as oauthErrorHtml } from "./oauth-page-CdAMKCs_.mjs";
import { t as OAUTH_PAGE_CSP } from "./oauth-page-csp-MU9ZpjXc.mjs";
//#region src/infra/oauth-loopback-callback.ts
function unbracket(hostname) {
	return hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
}
function isLoopbackAddress(address) {
	if (address === "::1") return true;
	const octets = address.split(".").map(Number);
	return octets.length === 4 && octets[0] === 127 && octets.every((octet) => octet >= 0 && octet <= 255);
}
function resolveLoopbackHostname(hostname, lookupOverride) {
	if (hostname === "127.0.0.1" || hostname === "::1") return [hostname];
	if (hostname !== "localhost") throw new Error("OAuth callback redirect must use localhost, 127.0.0.1, or ::1");
	return (lookupOverride ? Promise.resolve(lookupOverride) : import("node:dns/promises").then(({ lookup }) => lookup)).then(async (lookup) => {
		const addresses = [...new Set((await lookup("localhost", {
			all: true,
			verbatim: true
		})).map(({ address }) => address))];
		if (addresses.length === 0 || addresses.some((address) => !isLoopbackAddress(address))) throw new Error("localhost did not resolve exclusively to loopback addresses");
		return addresses;
	});
}
function resolveBindAddresses(redirectUrl, bindHostname, lookup, bindOnlyHostname) {
	if (bindOnlyHostname !== void 0) {
		const hostname = unbracket(bindOnlyHostname);
		if (![
			"localhost",
			"127.0.0.1",
			"::1"
		].includes(hostname)) throw new Error("OAuth callback bind must use localhost, 127.0.0.1, or ::1");
		return [hostname];
	}
	const redirectHostname = unbracket(redirectUrl.hostname);
	const redirectAddresses = resolveLoopbackHostname(redirectHostname, lookup);
	const requestedHostname = bindHostname ? unbracket(bindHostname) : redirectHostname;
	if (requestedHostname === redirectHostname) return redirectAddresses;
	const requestedAddresses = resolveLoopbackHostname(requestedHostname, lookup);
	return Promise.all([redirectAddresses, requestedAddresses]).then(([redirect, requested]) => [.../* @__PURE__ */ new Set([...requested, ...redirect])]);
}
async function waitForAbortable(promise, signal) {
	if (!signal) return await promise;
	return await new Promise((resolve, reject) => {
		const abort = () => reject(/* @__PURE__ */ new Error("OAuth callback cancelled"));
		signal.addEventListener("abort", abort, { once: true });
		promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
		if (signal.aborted) abort();
	});
}
function resolveOAuthLoopbackPort(redirectUrl) {
	const port = redirectUrl.port ? Number(redirectUrl.port) : 80;
	if (!Number.isInteger(port) || port <= 0 || port > 65535) throw new Error("OAuth callback redirect must use a valid TCP port");
	return port;
}
function prepareResponse(request, response, resolveCorsOrigin) {
	response.setHeader("Connection", "close");
	response.setHeader("Cache-Control", "no-store");
	response.setHeader("Content-Security-Policy", OAUTH_PAGE_CSP);
	response.setHeader("Referrer-Policy", "no-referrer");
	response.setHeader("X-Content-Type-Options", "nosniff");
	const origin = resolveCorsOrigin?.(request.headers.origin);
	if (!origin) return;
	response.setHeader("Access-Control-Allow-Origin", origin);
	response.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
	response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", typeof request.headers["access-control-request-headers"] === "string" ? request.headers["access-control-request-headers"] : "content-type");
	response.setHeader("Access-Control-Allow-Private-Network", "true");
	response.setHeader("Access-Control-Max-Age", "600");
}
async function closeServers(servers) {
	await Promise.all(servers.map((server) => new Promise((resolve) => {
		if (!server.listening) {
			resolve();
			return;
		}
		server.close(() => resolve());
		server.closeAllConnections?.();
	})));
}
/** Binds the authoritative loopback redirect before returning, then waits separately. */
async function startOAuthLoopbackCallbackServer(params) {
	const redirectUrl = new URL(params.redirectUrl);
	const redirectHostname = unbracket(redirectUrl.hostname);
	if (redirectUrl.protocol !== "http:" || ![
		"localhost",
		"127.0.0.1",
		"::1"
	].includes(redirectHostname)) throw new Error("OAuth callback redirect must use HTTP on a loopback address");
	if (!params.expectedState || params.timeoutMs !== void 0 && (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0)) throw new Error("OAuth callback requires state and a positive timeout");
	if (params.signal?.aborted) throw new Error("OAuth callback cancelled");
	if (params.bindHostname !== void 0 && params.bindOnlyHostname !== void 0) throw new Error("Choose either an additional or an exact OAuth callback bind host");
	const resolvedAddresses = resolveBindAddresses(redirectUrl, params.bindHostname, params.lookup, params.bindOnlyHostname);
	const addresses = Array.isArray(resolvedAddresses) ? resolvedAddresses : await waitForAbortable(resolvedAddresses, params.signal);
	const port = resolveOAuthLoopbackPort(redirectUrl);
	const callbackPath = redirectUrl.pathname || "/";
	const createServer = params.createServer ?? (await import("node:http")).createServer;
	const servers = [];
	let received = false;
	let settled = false;
	let pendingResponse;
	let binding = true;
	let timeout;
	let closePromise;
	const callback = createDeferredCore();
	callback.promise.catch(() => void 0);
	const close = () => binding ? Promise.resolve() : closePromise ??= closeServers(servers);
	const cleanup = () => {
		if (timeout) clearTimeout(timeout);
		params.signal?.removeEventListener("abort", onAbort);
	};
	const settleError = (error) => {
		if (settled) return;
		settled = true;
		pendingResponse = void 0;
		cleanup();
		callback.reject(error instanceof Error ? error : /* @__PURE__ */ new Error("OAuth callback failed"));
		close();
	};
	const onAbort = () => settleError(/* @__PURE__ */ new Error("OAuth callback cancelled"));
	const settleResult = (result, response) => {
		received = true;
		if (params.deferResponse) {
			pendingResponse = response;
			response.once("close", () => {
				if (!response.writableFinished) settleError(/* @__PURE__ */ new Error("OAuth callback disconnected"));
			});
			callback.resolve(result);
			return;
		}
		settled = true;
		cleanup();
		let finished = false;
		const finish = () => {
			if (finished) return;
			finished = true;
			callback.resolve(result);
			close();
		};
		response.once("finish", finish);
		response.once("close", finish);
	};
	const renderSuccess = params.renderSuccess ?? (() => ({
		body: renderOAuthPage({
			title: "Authorization received",
			heading: "Authorization received",
			message: "Return to the terminal while OpenClaw finishes."
		}),
		contentType: "text/html; charset=utf-8"
	}));
	const renderError = params.renderError ?? ((message) => ({
		body: oauthErrorHtml(message),
		contentType: "text/html; charset=utf-8"
	}));
	const respond = (response, status, rendered) => {
		response.writeHead(status, { "Content-Type": rendered.contentType });
		response.end(rendered.body);
	};
	const complete = async (rendered) => {
		if (settled || !pendingResponse) return;
		const response = pendingResponse;
		if (response.destroyed || response.writableFinished) {
			settleError(/* @__PURE__ */ new Error("OAuth callback disconnected"));
			await close();
			return;
		}
		pendingResponse = void 0;
		const finished = new Promise((resolve) => {
			response.once("finish", resolve);
			response.once("close", resolve);
		});
		respond(response, rendered.status, rendered);
		await finished;
		settled = true;
		cleanup();
		await close();
	};
	const handleRequest = (request, response) => {
		try {
			prepareResponse(request, response, params.resolveCorsOrigin);
			if (received || settled) respond(response, 409, renderError("OAuth callback was already received."));
			else if (request.method === "OPTIONS") response.writeHead(204).end();
			else {
				let url;
				try {
					url = new URL(request.url ?? "/", redirectUrl.origin);
				} catch {
					respond(response, 400, renderError("Invalid OAuth callback."));
					return;
				}
				if (url.pathname !== callbackPath) respond(response, 404, renderError("Callback route not found."));
				else if (request.method !== "GET") {
					response.setHeader("Allow", "GET, OPTIONS");
					respond(response, 405, renderError("Method not allowed."));
				} else if (url.searchParams.getAll("state").length !== 1 || url.searchParams.get("state") !== params.expectedState) respond(response, 400, renderError("Invalid OAuth state."));
				else if (url.searchParams.has("error")) {
					const error = url.searchParams.get("error");
					const errorDescription = url.searchParams.get("error_description") ?? void 0;
					settleResult({
						type: "oauth_error",
						error,
						...errorDescription ? { errorDescription } : {}
					}, response);
					if (!params.deferResponse) respond(response, 400, renderError("Authorization was not completed."));
				} else {
					const code = url.searchParams.get("code")?.trim();
					if (!code || url.searchParams.getAll("code").length !== 1) respond(response, 400, renderError("Missing OAuth authorization code."));
					else {
						settleResult({
							type: "authorization_code",
							code,
							state: params.expectedState,
							parameters: url.searchParams
						}, response);
						if (!params.deferResponse) respond(response, 200, renderSuccess());
					}
				}
			}
		} catch (error) {
			if (!response.headersSent) respond(response, 500, renderError("OAuth callback failed."));
			settleError(error);
		}
	};
	params.signal?.addEventListener("abort", onAbort, { once: true });
	if (params.signal?.aborted) {
		onAbort();
		throw new Error("OAuth callback cancelled");
	}
	try {
		for (const address of addresses) {
			const server = createServer(handleRequest);
			servers.push(server);
			await new Promise((resolve, reject) => {
				server.once("error", reject);
				server.listen(port, address, resolve);
			});
			server.removeAllListeners("error");
			server.on("error", settleError);
			if (settled) throw new Error("OAuth callback cancelled");
		}
	} catch (error) {
		binding = false;
		cleanup();
		await closeServers(servers);
		throw error;
	}
	binding = false;
	if (params.timeoutMs !== void 0) timeout = setTimeout(() => settleError(/* @__PURE__ */ new Error("OAuth callback timeout")), params.timeoutMs);
	return {
		waitForCallback: () => callback.promise,
		complete,
		close: async () => {
			if (!settled) settleError(/* @__PURE__ */ new Error("OAuth callback cancelled"));
			await close();
		}
	};
}
//#endregion
export { startOAuthLoopbackCallbackServer as t };
