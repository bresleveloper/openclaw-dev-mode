import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as getTelegramRuntime } from "./runtime-Cw8emHLA.mjs";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.mjs";
import { n as resolveTelegramBotUserIdFromToken, t as fingerprintTelegramBotToken } from "./token-fingerprint-B7BuFilz.mjs";
//#region extensions/telegram/src/update-offset-store.ts
const STORE_VERSION = 3;
const TELEGRAM_UPDATE_OFFSET_NAMESPACE = "telegram.update-offsets";
const TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES = 1e3;
function isValidUpdateId(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function openUpdateOffsetStore(env) {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_UPDATE_OFFSET_NAMESPACE,
		maxEntries: TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
		...env ? { env } : {}
	});
}
function extractBotIdFromToken(token) {
	const botUserId = resolveTelegramBotUserIdFromToken(token);
	return botUserId === void 0 ? null : String(botUserId);
}
function fingerprintFromToken(token) {
	const trimmed = token?.trim();
	if (!trimmed) return null;
	return fingerprintTelegramBotToken(trimmed);
}
function safeParseState(state) {
	if (!isRecord(state)) return null;
	if (state.version === 1 || state.version === 2) throw new Error("Telegram update offsets require migration; run openclaw doctor --fix.");
	if (state.version !== STORE_VERSION || state.lastUpdateId !== null && !isValidUpdateId(state.lastUpdateId) || state.botId !== null && typeof state.botId !== "string" || state.tokenFingerprint !== null && typeof state.tokenFingerprint !== "string") return null;
	return {
		version: STORE_VERSION,
		lastUpdateId: state.lastUpdateId,
		botId: state.botId,
		tokenFingerprint: state.tokenFingerprint
	};
}
function rotationForToken(parsed, botToken) {
	const currentBotId = extractBotIdFromToken(botToken);
	if (!currentBotId) return null;
	let reason = null;
	if (parsed.botId === null) reason = "legacy-state";
	else if (parsed.botId !== currentBotId) reason = "bot-id-changed";
	else if (parsed.tokenFingerprint === null) reason = "legacy-state";
	else if (parsed.tokenFingerprint !== fingerprintFromToken(botToken)) reason = "token-rotated";
	return reason ? {
		reason,
		previousBotId: parsed.botId,
		currentBotId,
		staleLastUpdateId: parsed.lastUpdateId
	} : null;
}
async function readTelegramUpdateOffset(params) {
	const key = normalizeTelegramStateAccountId(params.accountId);
	let storedValue;
	try {
		storedValue = await openUpdateOffsetStore(params.env).lookup(key);
	} catch {
		storedValue = void 0;
	}
	const parsed = safeParseState(storedValue);
	if (!parsed) return null;
	const rotation = rotationForToken(parsed, params.botToken);
	if (rotation) {
		if (rotation.staleLastUpdateId !== null) await params.onRotationDetected?.({
			...rotation,
			staleLastUpdateId: rotation.staleLastUpdateId
		});
		return null;
	}
	return parsed.lastUpdateId;
}
async function prepareTelegramAccount(params) {
	const accountId = normalizeTelegramStateAccountId(params.accountId);
	try {
		const store = openUpdateOffsetStore();
		const parsed = safeParseState(await store.lookup(accountId));
		const rotation = parsed ? rotationForToken(parsed, params.botToken) : null;
		if (rotation) {
			params.onRotationDetected(rotation);
			if (rotation.previousBotId !== null && rotation.previousBotId !== rotation.currentBotId) {
				const queue = getTelegramRuntime().state.openChannelIngressQueue({ accountId });
				if (!queue.purge) throw new Error("The host does not support ingress identity resets; update OpenClaw.");
				params.abortSignal?.throwIfAborted();
				await queue.purge({ signal: params.abortSignal });
			}
		}
		params.abortSignal?.throwIfAborted();
		if (!parsed || rotation) await store.register(accountId, {
			version: STORE_VERSION,
			lastUpdateId: null,
			botId: extractBotIdFromToken(params.botToken),
			tokenFingerprint: fingerprintFromToken(params.botToken)
		});
		return rotation ? null : parsed?.lastUpdateId ?? null;
	} catch (err) {
		throw new Error(`telegram: failed to prepare ingress for account "${accountId}"; restart the account to retry: ${formatErrorMessage(err)}`, { cause: err });
	}
}
async function writeTelegramUpdateOffset(params) {
	if (!isValidUpdateId(params.updateId)) throw new Error("Telegram update offset must be a non-negative safe integer.");
	const payload = {
		version: STORE_VERSION,
		lastUpdateId: params.updateId,
		botId: extractBotIdFromToken(params.botToken),
		tokenFingerprint: fingerprintFromToken(params.botToken)
	};
	await openUpdateOffsetStore(params.env).register(normalizeTelegramStateAccountId(params.accountId), payload);
}
async function deleteTelegramUpdateOffset(params) {
	await openUpdateOffsetStore(params.env).delete(normalizeTelegramStateAccountId(params.accountId));
}
//#endregion
export { writeTelegramUpdateOffset as i, prepareTelegramAccount as n, readTelegramUpdateOffset as r, deleteTelegramUpdateOffset as t };
