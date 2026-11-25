import { y as resolveMacOSDesktopCodexAppPathCandidates } from "./managed-binary-ARII6CR1.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { S as getSharedCodexAppServerClientState } from "./auth-cache-key-DS0mnvrR.mjs";
import { a as shouldRefreshCodexRateLimitsForUsageLimitMessage, i as resolveCodexUsageLimitResetAtMs, n as formatCodexUsageLimitErrorMessage } from "./rate-limits-DMubSy5d.mjs";
import { d as CodexAppServerRpcError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-C1G_nNP7.mjs";
import { it as rememberCodexRateLimitsRead, nt as readCodexRateLimitsRevision, rt as readRecentCodexRateLimits } from "./shared-client-DhJ31S_8.mjs";
import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { AgentHarnessModelRequestPolicyError, embeddedAgentLog, formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
import { markAuthProfileBlockedUntil } from "openclaw/plugin-sdk/agent-runtime";
import { AgentHarnessRuntimeUpdateRequiredError } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
// extensions/codex/src/app-server/usage-limit-error.ts
function readCodexRuntimeUpdateFacts(client) {
	const start = getSharedCodexAppServerClientState().startMetadata.get(client)?.startOptions;
	const serverVersion = client.getServerVersion();
	if (start && start.transport !== "stdio") return {
		serverVersion,
		source: "remote"
	};
	if (start?.commandSource === "config" || start?.commandSource === "env") return {
		serverVersion,
		source: start.commandSource,
		command: start.command
	};
	const desktopApp = start?.commandSource === "resolved-managed" ? resolveMacOSDesktopCodexAppPathCandidates().find((candidate) => candidate.appServerCommandPath === start.command) : void 0;
	if (desktopApp) return {
		serverVersion,
		source: "desktop",
		command: desktopApp.appName.replace(/\.app$/, "")
	};
	return {
		serverVersion,
		source: "global"
	};
}
function formatCodexUpdateInstruction(facts) {
	switch (facts.source) {
		case "remote": return "Update the Codex app-server this Gateway connects to, then restart it.";
		case "desktop": return `Update the ${facts.command} desktop app, which provides this Codex, then restart the Gateway.`;
		case "config": return `Update the Codex at ${facts.command} (set by plugins.entries.codex.config.appServer.command), then restart the Gateway.`;
		case "env": return `Update the Codex at ${facts.command} (set by OPENCLAW_CODEX_APP_SERVER_BIN), then restart the Gateway.`;
		default: return "Update your global Codex with \"npm i -g @openai/codex\", then restart the Gateway.";
	}
}
const CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS = 5e3;
var CodexUsageLimitPromptError = class extends Error {
	constructor(message, nativeMessage) {
		super(message);
		this.nativeMessage = nativeMessage;
		this.status = 429;
	}
};
function resolveCodexPromptError(source, runtime) {
	const usageLimitMessage = formatCodexUsageLimitErrorMessage(source);
	if (usageLimitMessage) return new CodexUsageLimitPromptError(usageLimitMessage, source.message);
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
	if (isJsonObject(info) && Object.keys(info).length === 1 && isJsonObject(info.httpConnectionFailed) && info.httpConnectionFailed.httpStatusCode === 403 && isRequestPolicyDenial(source.message)) return new AgentHarnessModelRequestPolicyError();
	if (isChatGptModelVersionError(source.message, info)) {
		const version = runtime.serverVersion ? ` than ${runtime.serverVersion}` : "";
		embeddedAgentLog.warn("codex app-server model requires a newer Codex", {
			...runtime,
			nativeMessage: source.message
		});
		return Object.assign(new AgentHarnessRuntimeUpdateRequiredError(`${runtime.model} needs a newer Codex${version}. ${formatCodexUpdateInstruction(runtime)} Or choose another model.`), {
			nativeMessage: source.message,
			...status === void 0 ? {} : { status }
		});
	}
	return status === void 0 ? source.message ?? void 0 : Object.assign(new Error(source.message ?? "codex app-server error"), {
		status,
		...info === "serverOverloaded" ? { code: "OVERLOADED" } : {}
	});
}
function isChatGptModelVersionError(message, codexErrorInfo) {
	const phrase = "not supported when using Codex with a ChatGPT account";
	if (!message?.includes(phrase)) return false;
	if (codexErrorInfo === "modelNotFound") return true;
	const start = message.indexOf("{");
	const end = message.lastIndexOf("}");
	if (start === -1 || end < start) return false;
	try {
		const body = JSON.parse(message.slice(start, end + 1));
		return isJsonObject(body) && isJsonObject(body.error) && body.error.code === "model_not_found" && typeof body.error.message === "string" && body.error.message.includes(phrase);
	} catch {
		return false;
	}
}
function isRequestPolicyDenial(message) {
	if (!message || message.length > 8192 || !message.startsWith("unexpected status 403 Forbidden: ")) return false;
	const body = message.slice(33);
	for (let end = body.indexOf("}"); end !== -1; end = body.indexOf("}", end + 1)) {
		const suffix = body.slice(end + 1);
		if (suffix && !/^, (?:url|cf-ray|request id|auth error|auth error code): [^\r\n]*$/.test(suffix)) continue;
		try {
			const error = JSON.parse(body.slice(0, end + 1));
			return isJsonObject(error) && error.error === "middleware_denied" && error.reason_code === "request_credential_denied" && error.layer === "l7";
		} catch {}
	}
	return false;
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
async function resolveCodexTurnStartError(params) {
	const source = readCodexTurnStartUsageLimitErrorSource(params.client, params.error, params.errorNotification, params.rateLimitsRevisionBeforeTurnStart);
	const usageLimit = await refreshCodexUsageLimitError({
		...params,
		source
	});
	if (usageLimit) return usageLimit;
	const promptError = resolveCodexPromptError(source, {
		model: params.model,
		...readCodexRuntimeUpdateFacts(params.client)
	});
	return promptError instanceof Error ? {
		message: promptError.message,
		promptError
	} : void 0;
}
async function refreshCodexUsageLimitPromptError(params) {
	if (!(params.promptError instanceof CodexUsageLimitPromptError) || !shouldRefreshCodexRateLimitsForUsageLimitMessage(params.promptError.message)) return;
	return refreshCodexUsageLimitError({
		...params,
		source: {
			message: params.promptError.nativeMessage,
			codexErrorInfo: "usageLimitExceeded",
			rateLimits: readRecentCodexRateLimits(params.client)
		}
	});
}
async function refreshCodexUsageLimitError(params) {
	const initialMessage = formatCodexUsageLimitErrorMessage(params.source);
	const rateLimits = shouldRefreshCodexRateLimitsForUsageLimitMessage(initialMessage) ? await readCodexRateLimitsFromAppServerForUsageLimitError(params) : void 0;
	const message = rateLimits ? formatCodexUsageLimitErrorMessage({
		...params.source,
		rateLimits,
		rateLimitsAuthoritative: true
	}) ?? initialMessage : initialMessage;
	return message ? {
		message,
		promptError: new CodexUsageLimitPromptError(message, params.source.message),
		...rateLimits || params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: rateLimits || params.source.rateLimits } : {}
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
	const source = !(error instanceof CodexAppServerRpcError) && notificationError?.codexErrorInfo != null && errorPayload.codexErrorInfo == null && notificationError.message === errorPayload.message ? notificationError : errorPayload;
	const cacheUpdatedDuringTurnStart = rateLimitsRevisionBeforeTurnStart !== void 0 && readCodexRateLimitsRevision(client) > rateLimitsRevisionBeforeTurnStart;
	return {
		message: source.message,
		codexErrorInfo: source.codexErrorInfo,
		rateLimits,
		rateLimitsTrustedForProfile: errorPayload.rateLimits !== void 0 || cacheUpdatedDuringTurnStart
	};
}
function readCodexErrorNotification(notification) {
	if (notification?.method !== "error" || !isJsonObject(notification.params) || notification.params.willRetry === true) return;
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
export { resolveCodexPromptError as a, refreshCodexUsageLimitPromptError as i, markCodexAuthProfileBlockedFromRateLimits as n, resolveCodexTurnStartError as o, readCodexRuntimeUpdateFacts as r, CodexUsageLimitPromptError as t };
