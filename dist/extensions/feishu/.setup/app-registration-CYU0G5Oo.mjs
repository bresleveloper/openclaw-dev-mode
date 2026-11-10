import { t as readFeishuJsonResponse } from "./json-response-DXajw_FU.mjs";
import { finiteSecondsToTimerSafeMilliseconds } from "openclaw/plugin-sdk/number-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { renderQrTerminal } from "openclaw/plugin-sdk/media-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/feishu/src/app-registration.ts
const FEISHU_ACCOUNTS_URL = "https://accounts.feishu.cn";
const LARK_ACCOUNTS_URL = "https://accounts.larksuite.com";
const REGISTRATION_PATH = "/oauth/v1/app/registration";
const APP_REGISTRATION_REQUEST_TIMEOUT_MS = 1e4;
const DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS = 5;
const DEFAULT_REGISTRATION_EXPIRE_SECONDS = 600;
function accountsBaseUrl(domain) {
	return domain === "lark" ? LARK_ACCOUNTS_URL : FEISHU_ACCOUNTS_URL;
}
async function postRegistration(baseUrl, body) {
	return fetchFeishuJson({
		url: `${baseUrl}${REGISTRATION_PATH}`,
		init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(body).toString()
		},
		auditContext: "feishu.app-registration.post"
	});
}
async function fetchFeishuJson(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		init: params.init,
		timeoutMs: APP_REGISTRATION_REQUEST_TIMEOUT_MS,
		policy: { allowedHostnames: [new URL(params.url).hostname] },
		auditContext: params.auditContext
	});
	try {
		return await readFeishuJsonResponse(response);
	} finally {
		await release();
	}
}
async function initAppRegistration(domain = "feishu") {
	if (!(await postRegistration(accountsBaseUrl(domain), { action: "init" })).supported_auth_methods?.includes("client_secret")) throw new Error("Current environment does not support client_secret auth method");
}
/**
* Step 2: Begin the device-code flow. Returns a device code and a QR URL
* that the user should scan with Feishu/Lark mobile app.
*/
async function beginAppRegistration(domain = "feishu") {
	const res = await postRegistration(accountsBaseUrl(domain), {
		action: "begin",
		archetype: "PersonalAgent",
		auth_method: "client_secret",
		request_user_info: "open_id"
	});
	const qrUrl = new URL(res.verification_uri_complete);
	qrUrl.searchParams.set("from", "oc_onboard");
	qrUrl.searchParams.set("tp", "ob_cli_app");
	return {
		deviceCode: res.device_code,
		qrUrl: qrUrl.toString(),
		userCode: res.user_code,
		interval: finiteSecondsToTimerSafeMilliseconds(res.interval) === void 0 ? DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS : res.interval,
		expireIn: finiteSecondsToTimerSafeMilliseconds(res.expire_in) === void 0 ? DEFAULT_REGISTRATION_EXPIRE_SECONDS : res.expire_in
	};
}
/**
* Step 3: Poll for authorization result until success, denial, expiry, or
* timeout. Automatically handles domain switching when `tenant_brand` is
* detected as "lark".
*/
async function pollAppRegistration(params) {
	const { deviceCode, expireIn, initialDomain = "feishu", abortSignal, tp } = params;
	let currentInterval = params.interval;
	let domain = initialDomain;
	let domainSwitched = false;
	const expireInMs = finiteSecondsToTimerSafeMilliseconds(expireIn) ?? DEFAULT_REGISTRATION_EXPIRE_SECONDS * 1e3;
	const deadline = performance.now() + expireInMs;
	while (performance.now() < deadline) {
		if (abortSignal?.aborted) return { status: "timeout" };
		const baseUrl = accountsBaseUrl(domain);
		let pollRes;
		try {
			pollRes = await postRegistration(baseUrl, {
				action: "poll",
				device_code: deviceCode,
				...tp ? { tp } : {}
			});
		} catch {
			await sleepRegistrationPollInterval(currentInterval, abortSignal);
			continue;
		}
		if (!domainSwitched && pollRes.user_info?.tenant_brand === "lark") {
			domain = "lark";
			domainSwitched = true;
			continue;
		}
		if (pollRes.client_id && pollRes.client_secret) return {
			status: "success",
			result: {
				appId: pollRes.client_id,
				appSecret: pollRes.client_secret,
				domain,
				openId: pollRes.user_info?.open_id
			}
		};
		if (pollRes.error && pollRes.error !== "authorization_pending") {
			if (pollRes.error === "slow_down") currentInterval += 5;
			else if (pollRes.error === "access_denied") return { status: "access_denied" };
			else if (pollRes.error === "expired_token") return { status: "expired" };
			else return {
				status: "error",
				message: `${pollRes.error}: ${pollRes.error_description ?? "unknown"}`
			};
		}
		await sleepRegistrationPollInterval(currentInterval, abortSignal);
	}
	return { status: "timeout" };
}
/**
* Print QR code directly to stdout.
*
* QR codes must be printed without any surrounding box/border decoration,
* otherwise the pattern is corrupted and cannot be scanned.
*/
async function printQrCode(url) {
	const output = await renderQrTerminal(url, { small: true });
	process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}
/**
* Fetch the app owner's open_id using the application.v6.application.get API.
*
* Used during setup to auto-populate security policy allowlists.
* Returns undefined on any failure (fail-open).
*/
async function getAppOwnerOpenId(params) {
	const baseUrl = params.domain === "lark" ? "https://open.larksuite.com" : "https://open.feishu.cn";
	try {
		const tokenData = await fetchFeishuJson({
			url: `${baseUrl}/open-apis/auth/v3/tenant_access_token/internal`,
			init: {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					app_id: params.appId,
					app_secret: params.appSecret
				})
			},
			auditContext: "feishu.app-registration.owner-token"
		});
		if (!tokenData.tenant_access_token) return;
		const appData = await fetchFeishuJson({
			url: `${baseUrl}/open-apis/application/v6/applications/${params.appId}?user_id_type=open_id`,
			init: {
				method: "GET",
				headers: {
					Authorization: `Bearer ${tokenData.tenant_access_token}`,
					"Content-Type": "application/json"
				}
			},
			auditContext: "feishu.app-registration.owner-app"
		});
		if (appData.code !== 0) return;
		const app = appData.data?.app;
		const owner = app?.owner;
		return (owner?.owner_type ?? owner?.type) === 2 && owner?.owner_id ? owner.owner_id : app?.creator_id ?? owner?.owner_id;
	} catch {
		return;
	}
}
async function sleepRegistrationPollInterval(intervalSeconds, abortSignal) {
	const intervalMs = finiteSecondsToTimerSafeMilliseconds(intervalSeconds) ?? DEFAULT_REGISTRATION_POLL_INTERVAL_SECONDS * 1e3;
	await sleepWithAbort(intervalMs, abortSignal).catch(() => {});
}
//#endregion
export { beginAppRegistration, getAppOwnerOpenId, initAppRegistration, pollAppRegistration, printQrCode };
