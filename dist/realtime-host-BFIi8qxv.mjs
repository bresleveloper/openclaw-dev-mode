import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-By9R9pyt.mjs";
import { c as warn } from "./globals-BXbZ1A_g.mjs";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BULAE3Xo.mjs";
import { t as createRealtimeTranscriptionWebSocketSession } from "./websocket-session-BG_eV0-T.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { t as proxy_capture_exports } from "./proxy-capture-DLagrh6e.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import { i as resolveProviderAuthProfileApiKey, n as isProviderAuthProfileConfigured } from "./provider-auth-availability-BmVs5Dky.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import "./realtime-transcription-session-B5nZlbjV.mjs";
const openAIRealtimeHost = {
	resolveAgentDir,
	isProviderAuthProfileConfigured,
	resolveProviderAuthProfileApiKey,
	resolveProviderRequestHeaders,
	createRealtimeTranscriptionWebSocketSession,
	captureWsEventAsync: proxy_capture_exports.captureWsEventAsync,
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
