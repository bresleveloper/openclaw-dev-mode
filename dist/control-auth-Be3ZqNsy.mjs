import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import { r as resolveGatewayAuth } from "./auth-resolve-BmUDP1m_.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-config-snapshot-DgZgcXUX.mjs";
import { t as ensureGatewayStartupAuth } from "./startup-auth-DUayyGtj.mjs";
import "./gateway-runtime-DMDKFL1_.mjs";
import { r as persistBrowserControlCredential } from "./config-mutations-Cjl8U6KP.mjs";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/control-auth.ts
function resolveBrowserControlAuth(cfg, env = process.env) {
	const auth = resolveGatewayAuth({
		authConfig: cfg?.gateway?.auth,
		env,
		tailscaleMode: cfg?.gateway?.tailscale?.mode
	});
	const token = normalizeOptionalString(auth.token);
	const password = normalizeOptionalString(auth.password);
	switch (auth.mode) {
		case "password":
		case "trusted-proxy": return { password };
		case "token":
		case "none": return { token };
		default: return {};
	}
}
function shouldAutoGenerateBrowserAuth(env) {
	if (normalizeLowercaseStringOrEmpty(env.NODE_ENV) === "test") return false;
	const vitest = normalizeLowercaseStringOrEmpty(env.VITEST);
	return !vitest || [
		"0",
		"false",
		"off"
	].includes(vitest);
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
		const kind = latestMode === "trusted-proxy" ? "password" : "token";
		const credential = latestCfg.gateway?.auth?.[kind];
		if (credential != null && typeof credential !== "string") return { auth: latestAuth };
		return await generateAndPersistBrowserControlCredential({
			kind,
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
export { resolveBrowserControlAuth as n, shouldAutoGenerateBrowserAuth as r, ensureBrowserControlAuth as t };
