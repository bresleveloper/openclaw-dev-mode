import { asFiniteNumberInRange } from "openclaw/plugin-sdk/string-coerce-runtime";
import { MAX_TIMER_TIMEOUT_MS, positiveSecondsToSafeMilliseconds, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { throwIfOAuthLoginAborted } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { sleep } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/radius/oauth.ts
const OAUTH_BASE_URL = "https://radius.pi.dev/v1/oauth";
const CLIENT_ID = "pi-gateway";
const REQUEST_TIMEOUT_MS = 3e4;
var RadiusOAuthError = class extends Error {
	constructor(code, status) {
		super(`Radius OAuth request failed (HTTP ${status}). Retry sign-in.`);
		this.code = typeof code === "string" && [
			"authorization_pending",
			"slow_down",
			"access_denied",
			"expired_token"
		].includes(code) ? code : void 0;
	}
};
async function postOAuthForm(endpoint, fields, signal, beforeRequest) {
	const { response, release } = await fetchWithSsrFGuard({
		url: `${OAUTH_BASE_URL}/${endpoint}`,
		init: {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				client_id: CLIENT_ID,
				...fields
			})
		},
		signal,
		beforeRequest,
		timeoutMs: REQUEST_TIMEOUT_MS,
		requireHttps: true,
		policy: { hostnameAllowlist: ["radius.pi.dev"] },
		auditContext: `radius.oauth.${endpoint}`
	});
	try {
		const payload = await readProviderJsonObjectResponse(response, "Radius OAuth", {
			maxBytes: 65536,
			requestHeaders: {}
		});
		if (!response.ok || payload.error !== void 0) throw new RadiusOAuthError(payload.error, response.status);
		return payload;
	} finally {
		await release();
	}
}
function parseToken(payload, previousRefresh) {
	const lifetimeMs = positiveSecondsToSafeMilliseconds(payload.expires_in);
	const expires = lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs, { bufferMs: Math.min(6e4, Math.floor(lifetimeMs / 2)) });
	const refresh = payload.refresh_token ?? previousRefresh;
	if (typeof payload.access_token !== "string" || !payload.access_token.trim() || typeof refresh !== "string" || !refresh.trim() || expires === void 0 || payload.scope !== void 0 && typeof payload.scope !== "string") throw new Error("Radius OAuth returned invalid credentials. Retry sign-in.");
	return {
		access: payload.access_token,
		refresh,
		expires
	};
}
function parseDevice(payload) {
	const lifetimeMs = positiveSecondsToSafeMilliseconds(payload.expires_in);
	const expiresAt = lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs);
	const intervalSeconds = payload.interval === void 0 ? 5 : asFiniteNumberInRange(payload.interval, {
		min: Number.MIN_VALUE,
		max: MAX_TIMER_TIMEOUT_MS / 1e3
	});
	const intervalMs = intervalSeconds === void 0 ? void 0 : Math.ceil(intervalSeconds * 1e3);
	if (typeof payload.device_code !== "string" || !payload.device_code.trim() || typeof payload.user_code !== "string" || !payload.user_code.trim() || typeof payload.verification_uri !== "string" || expiresAt === void 0 || intervalMs === void 0 || intervalMs > MAX_TIMER_TIMEOUT_MS) throw new Error("Radius OAuth returned an invalid device authorization response.");
	let url;
	try {
		url = new URL(payload.verification_uri);
	} catch {
		throw new Error("Radius OAuth returned an invalid verification URL.");
	}
	if (url.origin !== "https://radius.earendil.com" || url.username || url.password) throw new Error("Radius OAuth returned an invalid verification URL.");
	return {
		deviceCode: payload.device_code,
		userCode: payload.user_code,
		verificationUri: url.href,
		expiresAt,
		intervalMs
	};
}
async function loginRadiusOAuth(ctx) {
	const assertCurrent = () => {
		throwIfOAuthLoginAborted(ctx.signal);
		ctx.assertCurrent?.();
	};
	assertCurrent();
	const payload = await postOAuthForm("device", { scope: "gateway offline_access" }, ctx.signal, assertCurrent);
	assertCurrent();
	const device = parseDevice(payload);
	if (ctx.prompter.deviceCode) {
		await ctx.openUrl(device.verificationUri);
		await ctx.prompter.deviceCode({
			title: "Radius sign-in",
			code: device.userCode,
			expiresInMinutes: Math.ceil((device.expiresAt - Date.now()) / 6e4),
			message: "Enter this one-time code to sign in to Radius."
		});
	} else await ctx.prompter.note(`Open ${device.verificationUri} and enter code ${device.userCode} to sign in to Radius.`, "Radius sign-in");
	assertCurrent();
	if (!ctx.isRemote && !ctx.prompter.deviceCode) {
		try {
			await ctx.openUrl(device.verificationUri);
		} catch {}
		assertCurrent();
	}
	const progress = ctx.prompter.progress("Waiting for Radius approval…");
	let completed = false;
	try {
		let intervalMs = device.intervalMs;
		while (Date.now() < device.expiresAt) {
			await sleep(Math.min(intervalMs, device.expiresAt - Date.now()), ctx.signal);
			assertCurrent();
			if (Date.now() >= device.expiresAt) break;
			try {
				const token = await postOAuthForm("token", {
					grant_type: "urn:ietf:params:oauth:grant-type:device_code",
					device_code: device.deviceCode
				}, ctx.signal, assertCurrent);
				assertCurrent();
				const credentials = parseToken(token);
				completed = true;
				return credentials;
			} catch (error) {
				assertCurrent();
				if (!(error instanceof RadiusOAuthError)) throw error;
				switch (error.code) {
					case "authorization_pending": break;
					case "slow_down":
						intervalMs = Math.min(intervalMs + 5e3, MAX_TIMER_TIMEOUT_MS);
						break;
					case "access_denied": throw new Error("Radius sign-in was denied. Retry sign-in when ready.", { cause: error });
					case "expired_token": throw new Error("Radius device code expired. Start sign-in again.", { cause: error });
					default: throw error;
				}
			}
		}
		throw new Error("Radius device code expired. Start sign-in again.");
	} finally {
		progress.stop(completed ? "Radius sign-in complete" : "Radius sign-in stopped");
	}
}
async function refreshRadiusOAuthCredential(credential) {
	if (!credential.refresh.trim()) throw new Error("Radius refresh token is missing. Sign in again.");
	const payload = await postOAuthForm("token", {
		grant_type: "refresh_token",
		refresh_token: credential.refresh
	});
	return {
		...credential,
		...parseToken(payload, credential.refresh)
	};
}
//#endregion
export { loginRadiusOAuth, refreshRadiusOAuthCredential };
