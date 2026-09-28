import { m as clampTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./plugin-runtime-BUxbDDeH.mjs";
import { t as ensureGatewayStartupAuth } from "./startup-auth-Cnh-psTn.mjs";
import "./gateway-runtime-BCC8MoQW.mjs";
import "./config-Cs3fQhZS.mjs";
import { r as persistBrowserControlCredential } from "./config-mutations-D2mQeaT-.mjs";
import crypto from "node:crypto";
//#region extensions/browser/src/sdk-node-runtime.ts
/**
* Browser-local SDK bridge for gateway, plugin runtime, and timeout helpers.
*/
function normalizeTimeoutMs(timeoutMs) {
	return clampTimerTimeoutMs(timeoutMs);
}
function createTimeoutAbortSignal(timeoutMs, label) {
	const controller = new AbortController();
	const error = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => controller.abort(error), timeoutMs);
	timer.unref?.();
	return {
		controller,
		error,
		timer
	};
}
function waitForAbort(signal, fallback) {
	if (signal.aborted) return {
		promise: Promise.reject(toErrorObject(signal.reason ?? fallback, "Non-Error rejection")),
		cleanup: () => void 0
	};
	let listener;
	return {
		cleanup: () => {
			if (listener) signal.removeEventListener("abort", listener);
		},
		promise: new Promise((_, reject) => {
			listener = () => reject(toErrorObject(signal.reason ?? fallback, "Non-Error rejection"));
			signal.addEventListener("abort", listener, { once: true });
		})
	};
}
/** Runs async work with an optional aborting timeout signal. */
async function withTimeout(work, timeoutMs, label) {
	const resolved = normalizeTimeoutMs(timeoutMs);
	if (!resolved) return await work(void 0);
	const timeout = createTimeoutAbortSignal(resolved, label);
	const abort = waitForAbort(timeout.controller.signal, timeout.error);
	try {
		return await Promise.race([work(timeout.controller.signal), abort.promise]);
	} finally {
		clearTimeout(timeout.timer);
		abort.cleanup();
	}
}
//#endregion
//#region extensions/browser/src/browser/control-auth.ts
/**
* Browser control authentication helpers.
*
* Resolves browser-control auth from Gateway auth config and auto-generates a
* token/password for local control when safe to persist one.
*/
/** Resolve browser-control auth material from config and environment. */
function resolveBrowserControlAuth(cfg, env = process.env) {
	const auth = resolveGatewayAuth({
		authConfig: cfg?.gateway?.auth,
		env,
		tailscaleMode: cfg?.gateway?.tailscale?.mode
	});
	const token = normalizeOptionalString(auth.token) ?? "";
	const password = normalizeOptionalString(auth.password) ?? "";
	switch (auth.mode) {
		case "password":
		case "trusted-proxy": return { password: password || void 0 };
		case "token":
		case "none": return { token: token || void 0 };
		default: return {};
	}
}
/** Return true when startup may auto-generate browser-control auth. */
function shouldAutoGenerateBrowserAuth(env) {
	if (normalizeLowercaseStringOrEmpty(env.NODE_ENV) === "test") return false;
	const vitest = normalizeLowercaseStringOrEmpty(env.VITEST);
	if (vitest && vitest !== "0" && vitest !== "false" && vitest !== "off") return false;
	return true;
}
function hasExplicitNonStringGatewayCredentialForMode(params) {
	const { cfg, mode } = params;
	const auth = cfg?.gateway?.auth;
	if (!auth) return false;
	if (mode === "none") return auth.token != null && typeof auth.token !== "string";
	return auth.password != null && typeof auth.password !== "string";
}
async function generateAndPersistBrowserControlCredential(params) {
	const credential = crypto.randomBytes(24).toString("hex");
	await persistBrowserControlCredential({
		kind: params.kind,
		value: credential
	});
	const persistedAuth = resolveBrowserControlAuth(getRuntimeConfig(), params.env);
	if (persistedAuth.token || persistedAuth.password) return {
		auth: persistedAuth,
		generatedToken: persistedAuth[params.kind] === credential ? credential : void 0
	};
	return {
		auth: { [params.kind]: credential },
		generatedToken: credential
	};
}
/** Ensure browser-control auth exists, generating and persisting it when allowed. */
async function ensureBrowserControlAuth(params) {
	const env = params.env ?? process.env;
	const auth = resolveBrowserControlAuth(params.cfg, env);
	if (auth.token || auth.password) return { auth };
	if (!shouldAutoGenerateBrowserAuth(env)) return { auth };
	if (params.cfg.gateway?.auth?.mode === "password") return { auth };
	const latestCfg = getRuntimeConfig();
	const latestAuth = resolveBrowserControlAuth(latestCfg, env);
	if (latestAuth.token || latestAuth.password) return { auth: latestAuth };
	if (latestCfg.gateway?.auth?.mode === "password") return { auth: latestAuth };
	const latestMode = latestCfg.gateway?.auth?.mode;
	if (latestMode === "none" || latestMode === "trusted-proxy") {
		if (hasExplicitNonStringGatewayCredentialForMode({
			cfg: latestCfg,
			mode: latestMode
		})) return { auth: latestAuth };
		return await generateAndPersistBrowserControlCredential({
			kind: latestMode === "trusted-proxy" ? "password" : "token",
			env
		});
	}
	const ensured = await ensureGatewayStartupAuth({
		cfg: latestCfg,
		env,
		persist: true
	});
	return {
		auth: {
			token: ensured.auth.token,
			password: ensured.auth.password
		},
		generatedToken: ensured.generatedToken
	};
}
//#endregion
export { withTimeout as i, resolveBrowserControlAuth as n, shouldAutoGenerateBrowserAuth as r, ensureBrowserControlAuth as t };
