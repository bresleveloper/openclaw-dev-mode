import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as warn } from "./globals-QODkv80i.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { n as captureWsEvent } from "./runtime-Cr-8v8fa.mjs";
import { t as createRealtimeTranscriptionWebSocketSession } from "./websocket-session-DAhMrtO4.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./proxy-capture-Dq2n0qoF.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { i as resolveProviderAuthProfileApiKey, n as isProviderAuthProfileConfigured } from "./provider-auth-availability-DlkWkL2p.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import "./realtime-transcription-session-C0Zt1QIp.mjs";
//#region extensions/openai/realtime-host.ts
const openAIRealtimeHost = {
	resolveAgentDir,
	isProviderAuthProfileConfigured,
	resolveProviderAuthProfileApiKey,
	resolveProviderRequestHeaders,
	createRealtimeTranscriptionWebSocketSession,
	captureWsEvent,
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
