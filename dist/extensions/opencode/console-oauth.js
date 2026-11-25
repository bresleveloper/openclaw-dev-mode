import { asFiniteNumberInRange } from "openclaw/plugin-sdk/string-coerce-runtime";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { sleep } from "openclaw/plugin-sdk/text-utility-runtime";
import { MAX_TIMER_TIMEOUT_MS, positiveSecondsToSafeMilliseconds, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { createOAuthRefreshError, createOAuthRefreshResponseError, throwIfOAuthLoginAborted } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/opencode/console-oauth.ts
/**
* OpenCode Console browser sign-in (device authorization) for the `opencode` provider.
* OpenClaw signs in as its own Console client, `openclaw`, so it never shares or impersonates
* the OpenCode Console CLI's sign-in. Console refresh tokens are single-use: reusing one revokes
* the whole sign-in, so each credential owns exactly one refresh chain. The `opencode-go` plugin
* signs in separately for that reason, with its own copy of this file.
*/
const CONSOLE_ORIGIN = "https://opencode.ai";
const CONSOLE_URL = `${CONSOLE_ORIGIN}/console`;
const CLIENT_ID = "openclaw";
const REQUEST_TIMEOUT_MS = 3e4;
var OpencodeConsoleOAuthError = class extends Error {
	constructor(code, status) {
		super(`OpenCode Console sign-in request failed (HTTP ${status}). Retry sign-in.`);
		this.code = typeof code === "string" && [
			"authorization_pending",
			"slow_down",
			"access_denied",
			"expired_token"
		].includes(code) ? code : void 0;
	}
};
async function postConsoleJson(endpoint, fields, signal, beforeRequest) {
	const { response, release } = await fetchWithSsrFGuard({
		url: `${CONSOLE_URL}/auth/device/${endpoint}`,
		init: {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				client_id: CLIENT_ID,
				...fields
			})
		},
		signal,
		beforeRequest,
		timeoutMs: REQUEST_TIMEOUT_MS,
		requireHttps: true,
		policy: { hostnameAllowlist: ["opencode.ai"] },
		auditContext: `opencode.console-oauth.${endpoint}`
	});
	try {
		const payload = await readProviderJsonObjectResponse(response, "OpenCode Console sign-in", {
			maxBytes: 65536,
			requestHeaders: {}
		});
		if (!response.ok || payload.error !== void 0) {
			if (fields.grant_type === "refresh_token") throw createOAuthRefreshResponseError("OpenCode Console sign-in refresh", response.status, payload);
			throw new OpencodeConsoleOAuthError(payload.error, response.status);
		}
		return payload;
	} finally {
		await release();
	}
}
/** Console rotates the refresh token on every refresh; the previous one is never reusable. */
function parseToken(payload) {
	const lifetimeMs = positiveSecondsToSafeMilliseconds(payload.expires_in);
	const expires = lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs, { bufferMs: Math.min(3e5, Math.floor(lifetimeMs / 2)) });
	if (typeof payload.access_token !== "string" || !payload.access_token.trim() || typeof payload.refresh_token !== "string" || !payload.refresh_token.trim() || expires === void 0) throw new Error("OpenCode Console returned invalid credentials. Retry sign-in.");
	return {
		access: payload.access_token,
		refresh: payload.refresh_token,
		expires
	};
}
async function loginOpencodeConsole(ctx) {
	const assertCurrent = () => {
		throwIfOAuthLoginAborted(ctx.signal);
		ctx.assertCurrent?.();
	};
	assertCurrent();
	const payload = await postConsoleJson("code", { supports_org_scope: true }, ctx.signal, assertCurrent);
	assertCurrent();
	const lifetimeMs = positiveSecondsToSafeMilliseconds(payload.expires_in);
	const expiresAt = lifetimeMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(lifetimeMs);
	const intervalSeconds = payload.interval === void 0 ? 5 : asFiniteNumberInRange(payload.interval, {
		min: Number.MIN_VALUE,
		max: MAX_TIMER_TIMEOUT_MS / 1e3
	});
	const pollMs = intervalSeconds === void 0 ? void 0 : Math.ceil(intervalSeconds * 1e3);
	const link = typeof payload.verification_uri_complete === "string" ? payload.verification_uri_complete : payload.verification_uri;
	if (typeof payload.device_code !== "string" || !payload.device_code.trim() || typeof payload.user_code !== "string" || !payload.user_code.trim() || typeof link !== "string" || expiresAt === void 0 || pollMs === void 0 || pollMs > MAX_TIMER_TIMEOUT_MS) throw new Error("OpenCode Console returned an invalid device authorization response.");
	const url = URL.parse(link, `${CONSOLE_URL}/`);
	if (!url || url.origin !== CONSOLE_ORIGIN || url.username || url.password) throw new Error("OpenCode Console returned an invalid verification URL.");
	const { device_code: deviceCode, user_code: userCode } = payload;
	if (ctx.prompter.deviceCode) {
		await ctx.openUrl(url.href);
		await ctx.prompter.deviceCode({
			title: "OpenCode Console sign-in",
			code: userCode,
			expiresInMinutes: Math.ceil((expiresAt - Date.now()) / 6e4),
			message: "Confirm this code, then pick the workspace OpenClaw should use."
		});
	} else await ctx.prompter.note(`Open ${url.href}, confirm code ${userCode}, and pick a workspace.`, "OpenCode Console sign-in");
	assertCurrent();
	if (!ctx.isRemote && !ctx.prompter.deviceCode) {
		try {
			await ctx.openUrl(url.href);
		} catch {}
		assertCurrent();
	}
	const progress = ctx.prompter.progress("Waiting for OpenCode Console approval…");
	let completed = false;
	try {
		let intervalMs = pollMs;
		while (Date.now() < expiresAt) {
			await sleep(Math.min(intervalMs, expiresAt - Date.now()), ctx.signal);
			assertCurrent();
			if (Date.now() >= expiresAt) break;
			try {
				const token = await postConsoleJson("token", {
					grant_type: "urn:ietf:params:oauth:grant-type:device_code",
					device_code: deviceCode
				}, ctx.signal, assertCurrent);
				assertCurrent();
				const credentials = parseToken(token);
				completed = true;
				return credentials;
			} catch (error) {
				assertCurrent();
				if (!(error instanceof OpencodeConsoleOAuthError)) throw error;
				switch (error.code) {
					case "authorization_pending": break;
					case "slow_down":
						intervalMs = Math.min(intervalMs + 5e3, MAX_TIMER_TIMEOUT_MS);
						break;
					case "access_denied": throw new Error("OpenCode Console sign-in was denied. Retry sign-in when ready.", { cause: error });
					case "expired_token": throw new Error("OpenCode Console sign-in code expired. Start sign-in again.", { cause: error });
					default: throw error;
				}
			}
		}
		throw new Error("OpenCode Console sign-in code expired. Start sign-in again.");
	} finally {
		progress.stop(completed ? "OpenCode Console sign-in complete" : "OpenCode Console sign-in stopped");
	}
}
async function refreshOpencodeConsoleCredential(credential) {
	if (!credential.refresh.trim()) throw new Error("OpenCode Console refresh token is missing. Sign in again.");
	const payload = await postConsoleJson("token", {
		grant_type: "refresh_token",
		refresh_token: credential.refresh
	});
	try {
		return {
			...credential,
			...parseToken(payload)
		};
	} catch (cause) {
		throw createOAuthRefreshError("OpenCode Console refresh returned invalid credentials. Sign in again.", {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown"
		}, { cause });
	}
}
export { loginOpencodeConsole, refreshOpencodeConsoleCredential };
