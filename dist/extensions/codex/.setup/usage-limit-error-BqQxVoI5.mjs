import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { a as shouldRefreshCodexRateLimitsForUsageLimitMessage, i as resolveCodexUsageLimitResetAtMs, n as formatCodexUsageLimitErrorMessage } from "./rate-limits-CMPy24F5.mjs";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-kQntafj_.mjs";
import { Q as rememberCodexRateLimitsRead, X as readCodexRateLimitsRevision, Z as readRecentCodexRateLimits } from "./shared-client-r9NcV_GJ.mjs";
import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { embeddedAgentLog, formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
import { markAuthProfileBlockedUntil } from "openclaw/plugin-sdk/agent-runtime";
//#region extensions/codex/src/app-server/usage-limit-error.ts
const CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS = 5e3;
var CodexUsageLimitPromptError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.status = 429;
	}
};
function resolveCodexPromptError(source) {
	const usageLimitMessage = formatCodexUsageLimitErrorMessage(source);
	if (usageLimitMessage) return new CodexUsageLimitPromptError(usageLimitMessage);
	const info = source.codexErrorInfo;
	let status = info === "rateLimitExceeded" ? 429 : info === "serverOverloaded" ? 503 : info === "internalServerError" ? 500 : void 0;
	if (isJsonObject(info)) for (const variant of [
		"httpConnectionFailed",
		"responseStreamConnectionFailed",
		"responseStreamDisconnected",
		"responseTooManyFailedAttempts"
	]) {
		const detail = info[variant];
		if (isJsonObject(detail) && typeof detail.httpStatusCode === "number") {
			status = detail.httpStatusCode;
			break;
		}
	}
	return status === void 0 ? source.message ?? void 0 : Object.assign(new Error(source.message ?? "codex app-server error"), {
		status,
		...info === "serverOverloaded" ? { code: "OVERLOADED" } : {}
	});
}
async function markCodexAuthProfileBlockedFromRateLimits(params) {
	const authProfileId = params.authProfileId?.trim();
	if (!authProfileId || !params.params.authProfileStore) return;
	const blockedUntil = resolveCodexUsageLimitResetAtMs(params.rateLimits);
	if (!blockedUntil) return;
	try {
		await markAuthProfileBlockedUntil({
			store: params.params.authProfileStore,
			profileId: authProfileId,
			blockedUntil,
			source: "codex_rate_limits",
			agentDir: params.params.agentDir,
			runId: params.params.runId,
			modelId: params.params.modelId
		});
	} catch (error) {
		embeddedAgentLog.debug("failed to mark Codex auth profile blocked from app-server limits", {
			authProfileId,
			error: formatErrorMessage(error)
		});
	}
}
async function formatCodexTurnStartUsageLimitError(params) {
	return refreshCodexUsageLimitError({
		client: params.client,
		source: readCodexTurnStartUsageLimitErrorSource(params.client, params.error, params.errorNotification, params.rateLimitsRevisionBeforeTurnStart),
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
async function refreshCodexUsageLimitPromptError(params) {
	if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(params.message)) return;
	return refreshCodexUsageLimitError({
		client: params.client,
		source: {
			message: params.message,
			codexErrorInfo: "usageLimitExceeded",
			rateLimits: readRecentCodexRateLimits(params.client)
		},
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
async function refreshCodexUsageLimitError(params) {
	const initialMessage = formatCodexUsageLimitErrorMessage(params.source);
	const rateLimits = shouldRefreshCodexRateLimitsForUsageLimitMessage(initialMessage) ? await readCodexRateLimitsFromAppServerForUsageLimitError(params) : void 0;
	if (!rateLimits) return initialMessage ? {
		message: initialMessage,
		...params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: params.source.rateLimits } : {}
	} : void 0;
	const message = formatCodexUsageLimitErrorMessage({
		message: params.source.message,
		codexErrorInfo: params.source.codexErrorInfo,
		rateLimits,
		rateLimitsAuthoritative: true
	}) ?? initialMessage;
	return message ? {
		message,
		rateLimitsForProfile: rateLimits
	} : void 0;
}
async function readCodexRateLimitsFromAppServerForUsageLimitError(params) {
	if (params.signal?.aborted) return;
	try {
		const rateLimits = await params.client.request(CODEX_CONTROL_METHODS.rateLimits, void 0, {
			timeoutMs: resolveCodexUsageLimitRateLimitRefreshTimeoutMs(params.timeoutMs),
			signal: params.signal
		});
		rememberCodexRateLimitsRead(params.client, rateLimits);
		return rateLimits;
	} catch (error) {
		embeddedAgentLog.debug("codex app-server rate-limit refresh failed after usage-limit error", { error: formatErrorMessage(error) });
		return;
	}
}
function resolveCodexUsageLimitRateLimitRefreshTimeoutMs(timeoutMs) {
	if (timeoutMs === void 0 || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS;
	return Math.max(100, Math.min(timeoutMs, CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS));
}
function readCodexTurnStartUsageLimitErrorSource(client, error, errorNotification, rateLimitsRevisionBeforeTurnStart) {
	const notificationError = readCodexErrorNotification(errorNotification);
	const errorPayload = readCodexErrorPayload(error);
	const rateLimits = errorPayload.rateLimits ?? readRecentCodexRateLimits(client);
	const cacheUpdatedDuringTurnStart = rateLimitsRevisionBeforeTurnStart !== void 0 && readCodexRateLimitsRevision(client) > rateLimitsRevisionBeforeTurnStart;
	return {
		message: notificationError?.message ?? errorPayload.message ?? formatErrorMessage(error),
		codexErrorInfo: notificationError?.codexErrorInfo ?? errorPayload.codexErrorInfo,
		rateLimits,
		rateLimitsTrustedForProfile: errorPayload.rateLimits !== void 0 || cacheUpdatedDuringTurnStart
	};
}
function readCodexErrorNotification(notification) {
	if (notification?.method !== "error" || !isJsonObject(notification.params)) return;
	const error = notification.params.error;
	return isJsonObject(error) ? {
		message: readStringField(error, "message"),
		codexErrorInfo: error.codexErrorInfo
	} : void 0;
}
function readCodexErrorPayload(error) {
	const message = error instanceof Error ? error.message : void 0;
	if (!error || typeof error !== "object" || !("data" in error)) return { message };
	const data = error.data;
	if (!isJsonObject(data)) return { message };
	const nestedError = isJsonObject(data.error) ? data.error : data;
	const rateLimits = nestedError.rateLimits ?? data.rateLimits;
	return {
		message: readStringField(nestedError, "message") ?? message,
		codexErrorInfo: nestedError.codexErrorInfo,
		rateLimits
	};
}
//#endregion
export { resolveCodexPromptError as a, refreshCodexUsageLimitPromptError as i, formatCodexTurnStartUsageLimitError as n, markCodexAuthProfileBlockedFromRateLimits as r, CodexUsageLimitPromptError as t };
