import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs, T as positiveSecondsToSafeMilliseconds, _ as nonNegativeSecondsToSafeMilliseconds } from "./number-coercion-CLj0HTDM.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { c as normalizeGithubCopilotDomain } from "./provider-auth-eHeoP8se.mjs";
import { t as PUBLIC_GITHUB_COPILOT_DOMAIN } from "./domain-Bbe8oFEv.mjs";
//#region extensions/github-copilot/login.ts
const CLIENT_ID = "Iv1.b507a08c87ecfe98";
const GITHUB_DEVICE_FLOW_REQUEST_TIMEOUT_MS = 3e4;
const GITHUB_DEVICE_FLOW_DEFAULT_INTERVAL_MS = 5e3;
const GITHUB_DEVICE_FLOW_SLOW_DOWN_INCREMENT_MS = 5e3;
const deviceCodeUrl = (domain) => `https://${domain}/login/device/code`;
const accessTokenUrl = (domain) => `https://${domain}/login/oauth/access_token`;
const deviceVerificationUrl = (domain) => `https://${domain}/login/device`;
const githubAuthSsrfPolicy = (domain) => ({ hostnameAllowlist: [domain] });
const GITHUB_DEVICE_ACCESS_DENIED = Symbol("github-device-access-denied");
const GITHUB_DEVICE_EXPIRED = Symbol("github-device-expired");
var GitHubDeviceFlowError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "GitHubDeviceFlowError";
	}
};
function isGitHubDeviceAccessDeniedError(err) {
	return err instanceof GitHubDeviceFlowError && err.kind === GITHUB_DEVICE_ACCESS_DENIED;
}
function isGitHubDeviceExpiredError(err) {
	return err instanceof GitHubDeviceFlowError && err.kind === GITHUB_DEVICE_EXPIRED;
}
function parseJsonResponse(value) {
	if (!value || typeof value !== "object") throw new Error("Unexpected response from GitHub");
	return value;
}
function parseDeviceCodeResponse(value, issuedAt) {
	const expiresInMs = positiveSecondsToSafeMilliseconds(value.expires_in);
	const intervalMs = value.interval === void 0 ? GITHUB_DEVICE_FLOW_DEFAULT_INTERVAL_MS : nonNegativeSecondsToSafeMilliseconds(value.interval);
	const expiresAt = expiresInMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(expiresInMs, { nowMs: issuedAt });
	if (typeof value.device_code !== "string" || !value.device_code || typeof value.user_code !== "string" || !value.user_code || typeof value.verification_uri !== "string" || !value.verification_uri || expiresInMs === void 0 || expiresAt === void 0 || intervalMs === void 0) throw new Error("GitHub device code response missing fields");
	return {
		deviceCode: value.device_code,
		userCode: value.user_code,
		verificationUri: value.verification_uri,
		expiresInMs,
		expiresAt,
		intervalMs
	};
}
async function postGitHubDeviceFlowForm(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		init: {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: params.body
		},
		...params.signal ? { signal: params.signal } : {},
		...params.assertCurrent ? { beforeRequest: params.assertCurrent } : {},
		requireHttps: true,
		policy: githubAuthSsrfPolicy(params.domain),
		auditContext: "github-copilot-device-flow",
		timeoutMs: GITHUB_DEVICE_FLOW_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			throw new Error(`${params.failureLabel}: HTTP ${response.status}`);
		}
		return parseJsonResponse(await readProviderJsonResponse(response, "github-copilot.device-flow"));
	} finally {
		await release();
	}
}
async function requestDeviceCode(params) {
	const body = new URLSearchParams({
		client_id: CLIENT_ID,
		scope: params.scope
	});
	const json = await postGitHubDeviceFlowForm({
		url: deviceCodeUrl(params.domain),
		body,
		failureLabel: "GitHub device code failed",
		domain: params.domain,
		...params.signal ? { signal: params.signal } : {},
		...params.assertCurrent ? { assertCurrent: params.assertCurrent } : {}
	});
	params.assertCurrent?.();
	return parseDeviceCodeResponse(json, Date.now());
}
async function pollForAccessToken(params) {
	const bodyBase = new URLSearchParams({
		client_id: CLIENT_ID,
		device_code: params.deviceCode,
		grant_type: "urn:ietf:params:oauth:grant-type:device_code"
	});
	let intervalMs = params.intervalMs;
	while (Date.now() < params.expiresAt) {
		await sleepGitHubDevicePollDelay(intervalMs, params.expiresAt, params.signal);
		params.assertCurrent?.();
		if (Date.now() >= params.expiresAt) break;
		const json = await postGitHubDeviceFlowForm({
			url: accessTokenUrl(params.domain),
			body: bodyBase,
			failureLabel: "GitHub device token failed",
			domain: params.domain,
			...params.signal ? { signal: params.signal } : {},
			...params.assertCurrent ? { assertCurrent: params.assertCurrent } : {}
		});
		params.assertCurrent?.();
		if ("access_token" in json) {
			if (typeof json.access_token === "string") return json.access_token;
			throw new Error("GitHub device flow returned an invalid access token");
		}
		const err = json.error;
		if (err === "authorization_pending") continue;
		if (err === "slow_down") {
			intervalMs = Math.max(Math.min(Number.MAX_SAFE_INTEGER, intervalMs + GITHUB_DEVICE_FLOW_SLOW_DOWN_INCREMENT_MS), positiveSecondsToSafeMilliseconds(json.interval) ?? 0);
			continue;
		}
		if (err === "expired_token") throw new GitHubDeviceFlowError(GITHUB_DEVICE_EXPIRED, "GitHub device code expired; run login again");
		if (err === "access_denied") throw new GitHubDeviceFlowError(GITHUB_DEVICE_ACCESS_DENIED, "GitHub login cancelled");
		throw new Error(`GitHub device flow error: ${err}`);
	}
	throw new GitHubDeviceFlowError(GITHUB_DEVICE_EXPIRED, "GitHub device code expired; run login again");
}
async function sleepGitHubDevicePollDelay(delayMs, expiresAt, signal) {
	const requestedDelayMs = Math.max(1, Math.floor(delayMs));
	const targetAt = Math.min(Date.now() + requestedDelayMs, expiresAt);
	while (Date.now() < targetAt) {
		const remainingMs = Math.max(1, targetAt - Date.now());
		const safeDelayMs = resolveTimerTimeoutMs(remainingMs, 1);
		const waitMs = Math.min(safeDelayMs, remainingMs);
		await new Promise((resolve, reject) => {
			const onAbort = () => {
				clearTimeout(timeout);
				reject(signal?.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("GitHub login cancelled"));
			};
			const timeout = setTimeout(() => {
				signal?.removeEventListener("abort", onAbort);
				resolve();
			}, waitMs);
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted) onAbort();
		});
	}
}
function normalizeGitHubDeviceVerificationUrl(raw, domain) {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error("GitHub device flow returned an invalid verification URL");
	}
	if (parsed.protocol !== "https:" || parsed.hostname !== domain || parsed.pathname !== "/login/device" || parsed.username || parsed.password) throw new Error("GitHub device flow returned an unexpected verification URL");
	return deviceVerificationUrl(domain);
}
function normalizeGitHubDeviceUserCode(raw) {
	const userCode = raw.trim();
	if (!userCode || userCode.length > 64) throw new Error("GitHub device flow returned an invalid user code");
	return userCode;
}
async function runGitHubCopilotDeviceFlow(io, domain = PUBLIC_GITHUB_COPILOT_DOMAIN) {
	const host = normalizeGithubCopilotDomain(domain);
	const assertCurrent = () => {
		io.signal?.throwIfAborted();
		io.assertCurrent?.();
	};
	assertCurrent();
	const device = await requestDeviceCode({
		scope: "read:user",
		domain: host,
		...io.signal ? { signal: io.signal } : {},
		assertCurrent
	});
	const verificationUrl = normalizeGitHubDeviceVerificationUrl(device.verificationUri, host);
	const userCode = normalizeGitHubDeviceUserCode(device.userCode);
	assertCurrent();
	await io.showCode({
		verificationUrl,
		userCode,
		expiresInMs: device.expiresInMs
	});
	assertCurrent();
	try {
		await io.openUrl?.(verificationUrl);
	} catch {}
	assertCurrent();
	try {
		return {
			status: "authorized",
			accessToken: await pollForAccessToken({
				deviceCode: device.deviceCode,
				intervalMs: Math.max(1e3, device.intervalMs),
				expiresAt: device.expiresAt,
				domain: host,
				...io.signal ? { signal: io.signal } : {},
				assertCurrent
			})
		};
	} catch (err) {
		if (isGitHubDeviceAccessDeniedError(err)) return { status: "access_denied" };
		if (isGitHubDeviceExpiredError(err)) return { status: "expired" };
		throw err;
	}
}
//#endregion
export { runGitHubCopilotDeviceFlow as t };
