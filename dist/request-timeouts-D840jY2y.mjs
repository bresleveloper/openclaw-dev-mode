import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
//#region extensions/telegram/src/request-timeouts.ts
const TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS = 45e3;
const TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS = 6e4;
const TELEGRAM_DEFAULT_LONG_POLL_TIMEOUT_SECONDS = 30;
const TELEGRAM_LONG_POLL_ABORT_MARGIN_SECONDS = 5;
const TELEGRAM_REQUEST_TIMEOUTS_MS = {
	deletemycommands: 15e3,
	deletewebhook: 15e3,
	deletemessage: 15e3,
	editforumtopic: 15e3,
	editmessagetext: 15e3,
	getchat: 15e3,
	getfile: 3e4,
	getme: 15e3,
	getupdates: TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS,
	pinchatmessage: 15e3,
	sendanimation: 3e4,
	sendaudio: 3e4,
	sendchataction: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
	senddocument: 3e4,
	sendmessage: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
	sendmessagedraft: TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS,
	sendphoto: 3e4,
	sendvideo: 3e4,
	sendvoice: 3e4,
	setmessagereaction: 1e4,
	setmycommands: 15e3,
	setwebhook: 15e3
};
function resolveConfiguredTimeoutMs(timeoutSeconds, minimumMs) {
	if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds)) return Math.max(minimumMs, 0);
	return Math.max(minimumMs, finiteSecondsToTimerSafeMilliseconds(Math.max(1, timeoutSeconds), { floorSeconds: true }) ?? 2147e6);
}
function resolveTelegramRequestTimeoutMs(method, timeoutSeconds) {
	if (!method) return;
	if (method === "getupdates") return TELEGRAM_REQUEST_TIMEOUTS_MS.getupdates;
	return resolveConfiguredTimeoutMs(timeoutSeconds, TELEGRAM_REQUEST_TIMEOUTS_MS[method] ?? TELEGRAM_DEFAULT_REQUEST_TIMEOUT_MS);
}
function resolveTelegramLongPollTimeoutSeconds(timeoutSeconds) {
	const maxLongPollTimeoutSeconds = Math.max(1, Math.floor(TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS / 1e3) - TELEGRAM_LONG_POLL_ABORT_MARGIN_SECONDS);
	return Math.min(typeof timeoutSeconds === "number" && Number.isFinite(timeoutSeconds) ? Math.max(1, Math.floor(timeoutSeconds)) : TELEGRAM_DEFAULT_LONG_POLL_TIMEOUT_SECONDS, maxLongPollTimeoutSeconds);
}
function resolveTelegramStartupProbeTimeoutMs(timeoutSeconds) {
	return resolveConfiguredTimeoutMs(timeoutSeconds, TELEGRAM_REQUEST_TIMEOUTS_MS.getme);
}
//#endregion
export { resolveTelegramStartupProbeTimeoutMs as i, resolveTelegramLongPollTimeoutSeconds as n, resolveTelegramRequestTimeoutMs as r, TELEGRAM_GET_UPDATES_REQUEST_TIMEOUT_MS as t };
