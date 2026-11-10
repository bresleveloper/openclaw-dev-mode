import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { c as warn } from "./globals-XVSoVbNQ.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import { a as resolveDebugProxySettings, r as createDebugProxyWebSocketAgent } from "./env-ZuG6CRvK.mjs";
import { i as captureWsEventAsync } from "./runtime-BZkWDI2h.mjs";
import { t as createRealtimeTranscriptionWebSocketSession } from "./websocket-session-LsdOmAM1.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./proxy-capture-DSHKg1g9.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import { i as isProviderAuthProfileConfiguredAsync, r as isProviderAuthProfileConfigured, s as resolveProviderAuthProfileApiKey } from "./provider-auth-availability-CfYdMNuk.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import "./provider-http-BuV15s4V.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import "./realtime-transcription-session-C3ZYlVLx.mjs";
//#region extensions/openai/realtime-host.ts
const openAIRealtimeHost = {
	resolveAgentDir,
	isProviderAuthProfileConfigured,
	isProviderAuthProfileConfiguredAsync,
	resolveProviderAuthProfileApiKey,
	resolveProviderRequestHeaders,
	createRealtimeTranscriptionWebSocketSession,
	captureWsEventAsync,
	createDebugProxyWebSocketAgent,
	resolveDebugProxySettings,
	fetchWithSsrFGuard,
	createProviderHttpError,
	readProviderJsonResponse,
	readProviderTextResponse,
	formatErrorMessage,
	warn,
	redactSensitiveText
};
//#endregion
export { openAIRealtimeHost as t };
