import { C as resolveExpiresAtMsFromDurationMs, h as nonNegativeSecondsToSafeMilliseconds, j as resolveTimerTimeoutMs, x as positiveSecondsToSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { s as upsertAuthProfileWithLock } from "./profiles-DswMRdru.js";
import "./number-runtime-DBLVDypr.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-sTwxNMVI.js";
import "./provider-auth-DKbeFxjY.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { r as logConfigUpdated } from "./logging-CFK-HBYM.js";
import { d as updateConfig } from "./shared-ClkVsQjc.js";
import "./config-mutation-6lHNauPf.js";
import "./ssrf-runtime-CZi-6iMr.js";
import "./cli-runtime-Comrp7kq.js";
import { intro, note, outro, spinner } from "@clack/prompts";
//#region extensions/github-copilot/login.ts
const CLIENT_ID = "Iv1.b507a08c87ecfe98";
const DEVICE_CODE_URL = "https://github.com/login/device/code";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_DEVICE_VERIFICATION_URL = "https://github.com/login/device";
const GITHUB_AUTH_SSRF_POLICY = { hostnameAllowlist: ["github.com"] };
const GITHUB_DEVICE_ACCESS_DENIED = Symbol("github-device-access-denied");
const GITHUB_DEVICE_EXPIRED = Symbol("github-device-expired");
var GitHubDeviceFlowError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "GitHubDeviceFlowError";
	}
};
let githubDeviceFlowFetchGuard = fetchWithSsrFGuard;
function setGitHubCopilotDeviceFlowFetchGuardForTesting(impl) {
	githubDeviceFlowFetchGuard = impl ?? fetchWithSsrFGuard;
}
async function upsertAuthProfileWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLock(params)) throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
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
	const intervalMs = nonNegativeSecondsToSafeMilliseconds(value.interval);
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
	const { response, release } = await githubDeviceFlowFetchGuard({
		url: params.url,
		init: {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: params.body
		},
		requireHttps: true,
		policy: GITHUB_AUTH_SSRF_POLICY,
		auditContext: "github-copilot-device-flow"
	});
	try {
		if (!response.ok) throw new Error(`${params.failureLabel}: HTTP ${response.status}`);
		return parseJsonResponse(await response.json());
	} finally {
		await release();
	}
}
async function requestDeviceCode(params) {
	return parseDeviceCodeResponse(await postGitHubDeviceFlowForm({
		url: DEVICE_CODE_URL,
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			scope: params.scope
		}),
		failureLabel: "GitHub device code failed"
	}), Date.now());
}
async function pollForAccessToken(params) {
	const bodyBase = new URLSearchParams({
		client_id: CLIENT_ID,
		device_code: params.deviceCode,
		grant_type: "urn:ietf:params:oauth:grant-type:device_code"
	});
	while (Date.now() < params.expiresAt) {
		const json = await postGitHubDeviceFlowForm({
			url: ACCESS_TOKEN_URL,
			body: bodyBase,
			failureLabel: "GitHub device token failed"
		});
		if ("access_token" in json && typeof json.access_token === "string") return json.access_token;
		const err = "error" in json ? json.error : "unknown";
		if (err === "authorization_pending") {
			await sleepGitHubDevicePollDelay(params.intervalMs, params.expiresAt);
			continue;
		}
		if (err === "slow_down") {
			await sleepGitHubDevicePollDelay(params.intervalMs + 2e3, params.expiresAt);
			continue;
		}
		if (err === "expired_token") throw new GitHubDeviceFlowError(GITHUB_DEVICE_EXPIRED, "GitHub device code expired; run login again");
		if (err === "access_denied") throw new GitHubDeviceFlowError(GITHUB_DEVICE_ACCESS_DENIED, "GitHub login cancelled");
		throw new Error(`GitHub device flow error: ${err}`);
	}
	throw new GitHubDeviceFlowError(GITHUB_DEVICE_EXPIRED, "GitHub device code expired; run login again");
}
async function sleepGitHubDevicePollDelay(delayMs, expiresAt) {
	const requestedDelayMs = Math.max(1, Math.floor(delayMs));
	const targetAt = Math.min(Date.now() + requestedDelayMs, expiresAt);
	while (Date.now() < targetAt) {
		const remainingMs = Math.max(1, targetAt - Date.now());
		const safeDelayMs = resolveTimerTimeoutMs(remainingMs, 1);
		await new Promise((resolve) => {
			setTimeout(resolve, Math.min(safeDelayMs, remainingMs));
		});
	}
}
function normalizeGitHubDeviceVerificationUrl(raw) {
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error("GitHub device flow returned an invalid verification URL");
	}
	if (parsed.protocol !== "https:" || parsed.hostname !== "github.com" || parsed.pathname !== "/login/device" || parsed.username || parsed.password) throw new Error("GitHub device flow returned an unexpected verification URL");
	return GITHUB_DEVICE_VERIFICATION_URL;
}
function normalizeGitHubDeviceUserCode(raw) {
	const userCode = raw.trim();
	if (!userCode || userCode.length > 64) throw new Error("GitHub device flow returned an invalid user code");
	return userCode;
}
async function runGitHubCopilotDeviceFlow(io) {
	const device = await requestDeviceCode({ scope: "read:user" });
	const verificationUrl = normalizeGitHubDeviceVerificationUrl(device.verificationUri);
	const userCode = normalizeGitHubDeviceUserCode(device.userCode);
	await io.showCode({
		verificationUrl,
		userCode,
		expiresInMs: device.expiresInMs
	});
	try {
		await io.openUrl?.(verificationUrl);
	} catch {}
	try {
		return {
			status: "authorized",
			accessToken: await pollForAccessToken({
				deviceCode: device.deviceCode,
				intervalMs: Math.max(1e3, device.intervalMs),
				expiresAt: device.expiresAt
			})
		};
	} catch (err) {
		if (isGitHubDeviceAccessDeniedError(err)) return { status: "access_denied" };
		if (isGitHubDeviceExpiredError(err)) return { status: "expired" };
		throw err;
	}
}
async function githubCopilotLoginCommand(opts, runtime) {
	if (!process.stdin.isTTY) throw new Error("github-copilot login requires an interactive TTY.");
	intro(stylePromptTitle("GitHub Copilot login"));
	const profileId = opts.profileId?.trim() || "github-copilot:github";
	if (ensureAuthProfileStore(opts.agentDir, { allowKeychainPrompt: false }).profiles[profileId] && !opts.yes) note(`Auth profile already exists: ${profileId}\nRe-running will overwrite it.`, stylePromptTitle("Existing credentials"));
	const spin = spinner();
	spin.start("Requesting device code from GitHub...");
	const device = await requestDeviceCode({ scope: "read:user" });
	spin.stop("Device code ready");
	note([`Visit: ${device.verificationUri}`, `Code: ${device.userCode}`].join("\n"), stylePromptTitle("Authorize"));
	const intervalMs = Math.max(1e3, device.intervalMs);
	const polling = spinner();
	polling.start("Waiting for GitHub authorization...");
	const accessToken = await pollForAccessToken({
		deviceCode: device.deviceCode,
		intervalMs,
		expiresAt: device.expiresAt
	});
	polling.stop("GitHub access token acquired");
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential: {
			type: "token",
			provider: "github-copilot",
			token: accessToken
		},
		agentDir: opts.agentDir
	});
	await updateConfig((cfg) => applyAuthProfileConfig(cfg, {
		provider: "github-copilot",
		profileId,
		mode: "token"
	}));
	logConfigUpdated(runtime);
	runtime.log(`Auth profile: ${profileId} (github-copilot/token)`);
	outro("Done");
}
//#endregion
export { runGitHubCopilotDeviceFlow as n, setGitHubCopilotDeviceFlowFetchGuardForTesting as r, githubCopilotLoginCommand as t };
