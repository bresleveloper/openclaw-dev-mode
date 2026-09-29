import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { r as setBridgeAuthForPort, t as deleteBridgeAuthForPort } from "./bridge-auth-registry-CS3DjOzO.mjs";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware, t as hasVerifiedBrowserAuth } from "./server-middleware-BdaDaWET.mjs";
import { n as stopBrowserBridgeRuntime } from "./runtime-lifecycle-BMGB4Y9k.mjs";
import { isIPv6 } from "node:net";
import express from "express";
//#region extensions/browser/src/browser/bridge-server.ts
const bridgeStates = /* @__PURE__ */ new WeakMap();
const bridgeStopPromises = /* @__PURE__ */ new WeakMap();
async function closeBridgeHttpServer(server) {
	if (!server.listening) return;
	await new Promise((resolve, reject) => {
		server.close((error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
function buildNoVncBootstrapHtml(params) {
	const hash = new URLSearchParams({
		autoconnect: "1",
		resize: "remote"
	});
	const password = normalizeOptionalString(params.password);
	if (password) hash.set("password", password);
	const targetUrl = `http://127.0.0.1:${params.noVncPort}/vnc.html#${hash.toString()}`;
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="referrer" content="no-referrer" />
  <title>OpenClaw noVNC Observer</title>
</head>
<body>
  <p>Opening sandbox observer...</p>
  <script>
    const target = ${JSON.stringify(targetUrl)};
    window.location.replace(target);
  <\/script>
</body>
</html>`;
}
/** Start an authenticated loopback browser bridge and register browser routes. */
async function startBrowserBridgeServer(params) {
	const host = params.host ?? "127.0.0.1";
	if (!isLoopbackHost(host)) throw new Error(`bridge server must bind to loopback host (got ${host})`);
	const port = params.port ?? 0;
	const app = express();
	installBrowserCommonMiddleware(app);
	const authToken = normalizeOptionalString(params.authToken);
	const authPassword = normalizeOptionalString(params.authPassword);
	if (!authToken && !authPassword) throw new Error("bridge server requires auth (authToken/authPassword missing)");
	installBrowserAuthMiddleware(app, {
		token: authToken,
		password: authPassword
	});
	if (params.resolveSandboxNoVncToken) app.get("/sandbox/novnc", (req, res) => {
		if (!hasVerifiedBrowserAuth(req)) {
			res.status(401).send("Unauthorized");
			return;
		}
		res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");
		res.setHeader("Referrer-Policy", "no-referrer");
		const rawToken = normalizeOptionalString(req.query?.token);
		if (!rawToken) {
			res.status(400).send("Missing token");
			return;
		}
		const resolved = params.resolveSandboxNoVncToken?.(rawToken);
		if (!resolved) {
			res.status(404).send("Invalid or expired token");
			return;
		}
		res.type("html").status(200).send(buildNoVncBootstrapHtml(resolved));
	});
	const state = {
		server: null,
		port,
		resolved: params.resolved,
		profiles: /* @__PURE__ */ new Map()
	};
	const [{ createBrowserRouteContext }, { registerBrowserRoutes }] = await Promise.all([import("./server-context-WOJ2liGW.mjs"), import("./routes-C_1Z7PBF.mjs")]);
	registerBrowserRoutes(app, createBrowserRouteContext({
		getState: () => state,
		onEnsureAttachTarget: params.onEnsureAttachTarget
	}));
	const server = await listenBrowserHttpServer(app, port, host);
	const resolvedPort = server.address()?.port ?? port;
	state.server = server;
	state.port = resolvedPort;
	state.resolved.controlPort = resolvedPort;
	bridgeStates.set(server, state);
	setBridgeAuthForPort(resolvedPort, {
		token: authToken,
		password: authPassword
	});
	return {
		server,
		port: resolvedPort,
		baseUrl: `http://${isIPv6(host) ? `[${host}]` : host}:${resolvedPort}`,
		state
	};
}
async function stopBrowserBridgeServerOnce(server) {
	let port;
	try {
		const address = server.address();
		if (address?.port) port = address.port;
	} catch {}
	const state = bridgeStates.get(server);
	const httpClose = closeBridgeHttpServer(server);
	if (state) deleteBridgeAuthForPort(state.port);
	else if (port) deleteBridgeAuthForPort(port);
	if (!state) {
		await httpClose;
		return;
	}
	const runtimeClose = stopBrowserBridgeRuntime({
		current: state,
		getState: () => bridgeStates.get(server) ?? null,
		clearState: () => {},
		onWarn: () => {}
	});
	const failed = (await Promise.allSettled([httpClose, runtimeClose])).find((result) => result.status === "rejected");
	if (failed) throw failed.reason;
	bridgeStates.delete(server);
}
/** Stop a browser bridge server and clear its ephemeral port auth. */
function stopBrowserBridgeServer(server) {
	const current = bridgeStopPromises.get(server);
	if (current) return current;
	let resolveStop;
	let rejectStop;
	const stopping = new Promise((resolve, reject) => {
		resolveStop = resolve;
		rejectStop = reject;
	});
	bridgeStopPromises.set(server, stopping);
	stopBrowserBridgeServerOnce(server).then(resolveStop, rejectStop);
	stopping.finally(() => {
		if (bridgeStopPromises.get(server) === stopping) bridgeStopPromises.delete(server);
	}).catch(() => {});
	return stopping;
}
//#endregion
export { stopBrowserBridgeServer as n, startBrowserBridgeServer as t };
