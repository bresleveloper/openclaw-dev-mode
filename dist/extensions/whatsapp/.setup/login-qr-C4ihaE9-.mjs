import { a as resolveWhatsAppAccount } from "./accounts-F0vHuze2.mjs";
import { c as logoutWeb, d as readWebAuthExistsForDecision, h as readWebSelfId, n as WHATSAPP_AUTH_UNSTABLE_CODE } from "./auth-store-D2rN-hP5.mjs";
import { t as getActiveWebListener } from "./active-listener-CDjoX9QR.mjs";
import { h as resolveWhatsAppSocketTiming, r as createWaSocket } from "./socket-close-ecLUztyz.mjs";
import { t as formatError } from "./session-errors-B8UcAnZN.mjs";
import { i as closeWaSocket, o as waitForWhatsAppLoginResult, t as WHATSAPP_LOGGED_OUT_QR_MESSAGE } from "./connection-controller-CoQ6I_sh.mjs";
import { logInfo } from "openclaw/plugin-sdk/logging-core";
import { danger, defaultRuntime, info, success } from "openclaw/plugin-sdk/runtime-env";
import { renderQrPngDataUrl } from "openclaw/plugin-sdk/media-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { randomUUID } from "node:crypto";
import { getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { setImmediate } from "node:timers/promises";
//#region extensions/whatsapp/src/login-qr.ts
const ACTIVE_LOGIN_TTL_MS = 18e4;
const MAX_QR_RENDER_CHASES = 10;
const activeLogins = /* @__PURE__ */ new Map();
async function resetActiveLogin(accountId, reason) {
	const login = activeLogins.get(accountId);
	if (login) {
		activeLogins.delete(accountId);
		closeWaSocket(login.sock);
	}
	if (reason) logInfo(reason);
}
function isLoginFresh(login) {
	return Date.now() - login.startedAt < ACTIVE_LOGIN_TTL_MS;
}
function notifyQrUpdate(login) {
	const previous = login.qrUpdate;
	login.qrUpdate = createDeferred();
	previous.resolve();
}
function updateLoginQrState(login, qr) {
	login.qr = qr;
	login.qrVersion += 1;
	return login.qrVersion;
}
async function ensureQrDataUrl(params) {
	const current = activeLogins.get(params.accountId);
	if (current?.id !== params.loginId || current.qrVersion !== params.qrVersion || current.qr !== params.qr) return await renderQrPngDataUrl(params.qr);
	if (current.qrDataUrl && current.qrDataUrlVersion === params.qrVersion) return current.qrDataUrl;
	if (current.qrRenderPromise) return await current.qrRenderPromise;
	const renderPromise = (async () => {
		for (let attempt = 0; attempt < MAX_QR_RENDER_CHASES; attempt += 1) {
			const latest = activeLogins.get(params.accountId);
			if (!latest || latest.id !== params.loginId || !latest.qr) throw new Error("WhatsApp QR is no longer active.");
			if (latest.qrDataUrl && latest.qrDataUrlVersion === latest.qrVersion) return latest.qrDataUrl;
			const qr = latest.qr;
			const qrVersion = latest.qrVersion;
			const dataUrl = await renderQrPngDataUrl(qr);
			const refreshed = activeLogins.get(params.accountId);
			if (!refreshed || refreshed.id !== params.loginId) return dataUrl;
			if (refreshed.qrVersion === qrVersion && refreshed.qr === qr) {
				refreshed.qrDataUrl = dataUrl;
				refreshed.qrDataUrlVersion = qrVersion;
				notifyQrUpdate(refreshed);
				return dataUrl;
			}
		}
		throw new Error("WhatsApp QR kept refreshing before the latest image could render.");
	})();
	current.qrRenderPromise = renderPromise;
	try {
		return await renderPromise;
	} finally {
		const latest = activeLogins.get(params.accountId);
		if (latest?.id === params.loginId && latest.qrRenderPromise === renderPromise) latest.qrRenderPromise = null;
	}
}
function renderLatestQrDataUrlInBackground(params) {
	ensureQrDataUrl(params).catch(() => {});
}
function attachLoginWaiter(accountId, login) {
	login.waitPromise = waitForWhatsAppLoginResult({
		sock: login.sock,
		authDir: login.authDir,
		isLegacyAuthDir: login.isLegacyAuthDir,
		verbose: login.verbose,
		runtime: login.runtime,
		socketTiming: login.socketTiming,
		beforeCredentialPersistence: login.beforeCredentialPersistence,
		onQr: (qr) => {
			const current = activeLogins.get(accountId);
			if (!current || current.id !== login.id) return;
			const qrVersion = updateLoginQrState(current, qr);
			notifyQrUpdate(current);
			renderLatestQrDataUrlInBackground({
				accountId,
				loginId: login.id,
				qr,
				qrVersion
			});
		},
		onSocketReplaced: (sock) => {
			const current = activeLogins.get(accountId);
			if (current?.id === login.id) {
				current.sock = sock;
				current.connected = false;
				current.error = void 0;
				current.errorStatus = void 0;
			}
		}
	}).then((result) => {
		const current = activeLogins.get(accountId);
		if (current?.id !== login.id) return;
		if (result.outcome === "connected") {
			current.sock = result.sock;
			current.connected = true;
			return;
		}
		current.error = result.message;
		current.errorStatus = result.statusCode;
	}).catch((err) => {
		const current = activeLogins.get(accountId);
		if (current?.id !== login.id) return;
		current.error = err instanceof Error ? err.message : String(err);
		current.errorStatus = void 0;
	});
}
async function waitForQrOrRecoveredLogin(params) {
	const qrResult = params.qrPromise.then((qr) => ({
		outcome: "qr",
		qr
	}), (err) => ({
		outcome: "failed",
		message: `Failed to get QR: ${String(err)}`
	}));
	const readLoginResult = (fallbackMessage) => {
		const current = activeLogins.get(params.accountId);
		if (current?.id !== params.login.id) return {
			outcome: "failed",
			message: "WhatsApp login was replaced by a newer request."
		};
		if (current.qr) return {
			outcome: "qr",
			qr: current.qr
		};
		if (current.connected) return { outcome: "connected" };
		return {
			outcome: "failed",
			message: current.error ? `WhatsApp login failed: ${current.error}` : fallbackMessage
		};
	};
	const loginResult = params.login.waitPromise.then(async () => {
		if (activeLogins.get(params.accountId)?.id === params.login.id) await setImmediate();
		return readLoginResult("WhatsApp login failed.");
	});
	const qrUpdateResult = params.login.qrUpdate.promise.then(() => readLoginResult("WhatsApp QR update ended without an active QR."));
	return await Promise.race([
		qrResult,
		loginResult,
		qrUpdateResult
	]);
}
async function startWebLoginWithQr(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	const cfg = getRuntimeConfig();
	const account = resolveWhatsAppAccount({
		cfg,
		accountId: opts.accountId
	});
	const socketTiming = resolveWhatsAppSocketTiming();
	const authState = await readWebAuthExistsForDecision(account.authDir);
	if (authState.outcome === "unstable") return {
		code: WHATSAPP_AUTH_UNSTABLE_CODE,
		message: "WhatsApp auth state is still stabilizing. Retry login in a moment."
	};
	if (authState.exists && !opts.force && getActiveWebListener(account.accountId)) {
		const selfId = readWebSelfId(account.authDir);
		return { message: `WhatsApp is already linked (${selfId.e164 ?? selfId.jid ?? "unknown"}). Say “relink” if you want a fresh QR.` };
	}
	if (authState.exists && opts.force) try {
		if (!await logoutWeb({
			authDir: account.authDir,
			isLegacyAuthDir: account.isLegacyAuthDir,
			runtime,
			beforeCredentialPersistence: opts.beforeCredentialPersistence
		})) return { message: "WhatsApp login failed: existing auth could not be cleared. Remove or fix the configured WhatsApp auth directory, then retry login." };
	} catch (err) {
		return { message: `WhatsApp login failed: ${formatError(err)}` };
	}
	const existing = activeLogins.get(account.accountId);
	if (!opts.force && existing && isLoginFresh(existing) && !existing.connected && existing.error === void 0 && existing.qrDataUrl) return {
		qrDataUrl: existing.qrDataUrl,
		message: "QR already active. Scan it in WhatsApp → Linked Devices."
	};
	await resetActiveLogin(account.accountId);
	const qrReady = createDeferred();
	const qrTimer = setTimeout(() => {
		qrReady.reject(/* @__PURE__ */ new Error("Timed out waiting for WhatsApp QR"));
	}, resolveTimerTimeoutMs(opts.timeoutMs, 3e4, 5e3));
	let sock;
	let pendingQr = null;
	const loginId = randomUUID();
	const operationOwner = {};
	const beforeCredentialPersistence = async () => {
		const login = operationOwner.current;
		if (!login) {
			await opts.beforeCredentialPersistence?.();
			return;
		}
		if (activeLogins.get(account.accountId) !== login || !isLoginFresh(login)) throw new Error("WhatsApp login is no longer active.");
	};
	try {
		sock = await createWaSocket(false, Boolean(opts.verbose), {
			authDir: account.authDir,
			...socketTiming,
			beforeCredentialPersistence,
			onQr: (qr) => {
				pendingQr = qr;
				const current = activeLogins.get(account.accountId);
				if (current && current.id === loginId) {
					const qrVersion = updateLoginQrState(current, qr);
					renderLatestQrDataUrlInBackground({
						accountId: account.accountId,
						loginId,
						qr,
						qrVersion
					});
				}
				clearTimeout(qrTimer);
				qrReady.resolve(qr);
				runtime.log(info("WhatsApp QR received."));
			}
		});
	} catch (err) {
		clearTimeout(qrTimer);
		await resetActiveLogin(account.accountId);
		return { message: `Failed to start WhatsApp login: ${String(err)}` };
	}
	const nextLogin = {
		authDir: account.authDir,
		isLegacyAuthDir: account.isLegacyAuthDir,
		id: loginId,
		sock,
		startedAt: Date.now(),
		connected: false,
		waitPromise: Promise.resolve(),
		qrVersion: 0,
		qrUpdate: createDeferred(),
		qrRenderPromise: null,
		verbose: Boolean(opts.verbose),
		runtime,
		socketTiming,
		beforeCredentialPersistence
	};
	try {
		await opts.beforeCredentialPersistence?.();
	} catch (err) {
		clearTimeout(qrTimer);
		closeWaSocket(sock);
		return { message: `Failed to start WhatsApp login: ${String(err)}` };
	}
	operationOwner.current = nextLogin;
	activeLogins.set(account.accountId, nextLogin);
	if (pendingQr) {
		const qrVersion = updateLoginQrState(nextLogin, pendingQr);
		renderLatestQrDataUrlInBackground({
			accountId: account.accountId,
			loginId: nextLogin.id,
			qr: pendingQr,
			qrVersion
		});
	}
	attachLoginWaiter(account.accountId, nextLogin);
	const loginStartResult = await waitForQrOrRecoveredLogin({
		accountId: account.accountId,
		login: nextLogin,
		qrPromise: qrReady.promise
	});
	clearTimeout(qrTimer);
	if (loginStartResult.outcome === "connected") {
		const selfId = readWebSelfId(account.authDir);
		const who = selfId.e164 ?? selfId.jid ?? "unknown";
		await resetActiveLogin(account.accountId);
		return {
			message: `WhatsApp recovered the existing linked session (${who}).`,
			connected: true
		};
	}
	if (loginStartResult.outcome === "failed") {
		await resetActiveLogin(account.accountId);
		return { message: loginStartResult.message };
	}
	const qr = nextLogin.qr ?? loginStartResult.qr;
	const qrVersion = nextLogin.qrVersion;
	if (qrVersion === 0) {
		await resetActiveLogin(account.accountId);
		return { message: "Failed to capture the active WhatsApp QR. Ask me to generate a new one." };
	}
	let qrDataUrl;
	try {
		qrDataUrl = await ensureQrDataUrl({
			accountId: account.accountId,
			loginId: nextLogin.id,
			qr,
			qrVersion
		});
	} catch (err) {
		const message = err instanceof Error ? `Failed to render the WhatsApp QR: ${err.message}` : String(err);
		await resetActiveLogin(account.accountId, message);
		return { message };
	}
	return {
		qrDataUrl,
		message: "Scan this QR in WhatsApp → Linked Devices."
	};
}
async function waitForWebLogin(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	const cfg = getRuntimeConfig();
	const account = resolveWhatsAppAccount({
		cfg,
		accountId: opts.accountId
	});
	const activeLogin = activeLogins.get(account.accountId);
	if (!activeLogin) return {
		connected: false,
		message: "No active WhatsApp login in progress."
	};
	const login = activeLogin;
	if (!isLoginFresh(login)) {
		await resetActiveLogin(account.accountId);
		return {
			connected: false,
			message: "The login QR expired. Ask me to generate a new one."
		};
	}
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 12e4, 1e3);
	const deadline = Date.now() + timeoutMs;
	const currentQrDataUrl = opts.currentQrDataUrl;
	while (true) {
		if (login.error) {
			const message = login.errorStatus === 401 ? WHATSAPP_LOGGED_OUT_QR_MESSAGE : `WhatsApp login failed: ${login.error}`;
			await resetActiveLogin(account.accountId, message);
			runtime.log(danger(message));
			return {
				connected: false,
				message
			};
		}
		if (login.connected) {
			const message = "✅ Linked! WhatsApp is ready.";
			runtime.log(success(message));
			await resetActiveLogin(account.accountId);
			return {
				connected: true,
				message
			};
		}
		if (login.qrDataUrl && currentQrDataUrl && login.qrDataUrl !== currentQrDataUrl) return {
			connected: false,
			message: "QR refreshed. Scan the latest code in WhatsApp → Linked Devices.",
			qrDataUrl: login.qrDataUrl
		};
		const remaining = deadline - Date.now();
		if (remaining <= 0) return {
			connected: false,
			message: "Still waiting for the QR scan. Let me know when you’ve scanned it."
		};
		const result = await raceWithTimeout(Promise.race([login.waitPromise.then(() => "done"), login.qrUpdate.promise.then(() => "qr-update")]), remaining, () => "timeout");
		if (result === "timeout") return {
			connected: false,
			message: "Still waiting for the QR scan. Let me know when you’ve scanned it."
		};
		if (result === "qr-update" || login.connected || login.error) continue;
		return {
			connected: false,
			message: "Login ended without a connection."
		};
	}
}
//#endregion
export { startWebLoginWithQr, waitForWebLogin };
