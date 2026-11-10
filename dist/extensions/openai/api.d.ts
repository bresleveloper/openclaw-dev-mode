import { M as OpenClawConfig } from "../../types-D7I_F5Ux.js";
import { $w as RealtimeVoiceGatewayControl, Ew as RealtimeVoiceProviderPlugin, Km as ProviderPlugin, Qw as RealtimeVoiceBrowserSessionCreateRequest, ST as resolveAgentDir, Tw as RealtimeTranscriptionProviderPlugin, Vh as ProviderAuthContext, Zw as RealtimeVoiceBrowserSession, _T as resolveProviderRequestHeaders, cT as createProviderHttpError, eT as RealtimeVoiceProviderCapabilities, jg as PluginLogger, lT as readProviderJsonResponse, mT as fetchWithSsrFGuard, oT as formatErrorMessage, qw as RealtimeVoiceBridge, rv as OAuthCredentials, uT as readProviderTextResponse, yT as createRealtimeTranscriptionWebSocketSession } from "../../config-contracts-CY87ANNp.js";
import "../../index-8f56f6LD.js";
import "../../security-runtime-Ds6-JRX_.js";
import "../../diagnostic-events-CMrJXSRl.js";
import { m as MediaUnderstandingProvider } from "../../image-runtime-VVBqKX5E.js";
import { r as AuthProfileCredential } from "../../types-CRfF42Lb.js";
import { n as redactSensitiveText } from "../../diagnostic-run-activity-hzzl6lha.js";
import { S as resolveDebugProxySettings, i as captureWsEventAsync, x as createDebugProxyWebSocketAgent } from "../../runtime-C4DfPay6.js";
import "../../proxy-capture-DAdpyqOH.js";
import "../../provider-model-shared-uYxY__EE.js";
import "../../provider-onboard-BNuhTHon.js";
import "../../provider-http-DfcF9DFr.js";
import "../../ssrf-runtime-Rr41XJH2.js";
import "../../agent-runtime-CblzWAC3.js";
import "../../media-understanding-BXTZoPZ0.js";
import { i as RealtimeVoiceAgentConsultTranscriptEntry } from "../../realtime-session-harness-rq08dbmS.js";
import "../../error-runtime-DJUNFGwm.js";
import "../../ws-ErFB-ETM.js";
import WebSocket$1 from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
//#region extensions/openai/default-models.d.ts
export declare const OPENAI_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
export declare const OPENAI_DEFAULT_TTS_MODEL = "gpt-4o-mini-tts";
export declare const OPENAI_DEFAULT_TTS_VOICE = "alloy";
export declare const OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL = "gpt-4o-transcribe";
export declare const OPENAI_DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export declare function applyOpenAIProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenAIConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
//#region extensions/openai/media-understanding-provider.d.ts
export declare const openaiMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
//#region extensions/openai/openai-chatgpt-oauth.runtime.d.ts
export declare function loginOpenAICodexOAuth(params: {
  prompter: ProviderAuthContext["prompter"];
  runtime: ProviderAuthContext["runtime"];
  oauth: ProviderAuthContext["oauth"];
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  signal?: AbortSignal;
  assertCurrent?: () => void;
  onManualCodeInput?: () => Promise<string>;
  localBrowserMessage?: string;
}): Promise<OAuthCredentials | null>;
//#endregion
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.d.ts
declare function refreshOpenAICodexToken$1(refreshToken: string): Promise<OAuthCredentials>;
//#endregion
//#region extensions/openai/openai-chatgpt-provider.runtime.d.ts
export declare function refreshOpenAICodexToken(...args: Parameters<typeof refreshOpenAICodexToken$1>): Promise<Awaited<ReturnType<typeof refreshOpenAICodexToken$1>>>;
//#endregion
//#region extensions/openai/openai-provider.d.ts
export declare function buildOpenAIProvider(): ProviderPlugin;
//#endregion
//#region extensions/openai/realtime-transcription-provider.d.ts
export declare function buildOpenAIRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
//#endregion
//#region extensions/openai/realtime-host.d.ts
declare const openAIRealtimeHost: {
  resolveAgentDir: typeof resolveAgentDir;
  isProviderAuthProfileConfigured: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => boolean;
  isProviderAuthProfileConfiguredAsync: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => Promise<boolean>;
  resolveProviderAuthProfileApiKey: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    capability?: string;
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => Promise<string | undefined>;
  resolveProviderRequestHeaders: typeof resolveProviderRequestHeaders;
  createRealtimeTranscriptionWebSocketSession: typeof createRealtimeTranscriptionWebSocketSession;
  captureWsEventAsync: typeof captureWsEventAsync;
  createDebugProxyWebSocketAgent: typeof createDebugProxyWebSocketAgent;
  resolveDebugProxySettings: typeof resolveDebugProxySettings;
  fetchWithSsrFGuard: typeof fetchWithSsrFGuard;
  createProviderHttpError: typeof createProviderHttpError;
  readProviderJsonResponse: typeof readProviderJsonResponse;
  readProviderTextResponse: typeof readProviderTextResponse;
  formatErrorMessage: typeof formatErrorMessage;
  warn: (value: string) => string;
  redactSensitiveText: typeof redactSensitiveText;
};
type OpenAIRealtimeHost = typeof openAIRealtimeHost;
//#endregion
//#region extensions/openai/realtime-quicksilver-wire.d.ts
type OpenAIQuicksilverAuth = {
  type: "api-key";
  token: string;
} | {
  type: "oauth";
  token: string;
  accountId: string;
};
//#endregion
//#region extensions/openai/realtime-quicksilver-session.d.ts
type OpenAIQuicksilverSessionRequest = {
  initialItems?: RealtimeVoiceAgentConsultTranscriptEntry[];
  ownerConnId?: string;
} & ((RealtimeVoiceBrowserSessionCreateRequest & {
  gaSession?: Record<string, unknown> & {
    model: string;
  };
  gaSideband?: never;
}) | (Omit<RealtimeVoiceBrowserSessionCreateRequest, "clientControl" | "gatewayControl"> & {
  clientControl: {
    owner: "gateway";
  };
  gatewayControl: RealtimeVoiceGatewayControl;
  gaSession: Record<string, unknown> & {
    model: string;
  };
  gaSideband: {
    createBridge: (params: {
      apiKey: string;
      callId: string;
      onTerminal: () => void;
    }) => RealtimeVoiceBridge;
  };
}));
type OpenAIQuicksilverBrowserSessionBroker = {
  capabilities: Partial<RealtimeVoiceProviderCapabilities> & {
    handlesAgentConsult: true;
  };
  createBrowserSession: (request: OpenAIQuicksilverSessionRequest, auth: OpenAIQuicksilverAuth) => Promise<RealtimeVoiceBrowserSession>;
  cancelBrowserSession: (session: RealtimeVoiceBrowserSession) => Promise<void> | void;
};
//#endregion
//#region extensions/openai/realtime-voice-provider-factory.d.ts
declare function buildOpenAIRealtimeVoiceProvider$1(context: OpenAIRealtimeHost, options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
//#endregion
//#region extensions/openai/realtime-voice-provider.d.ts
export declare function buildOpenAIRealtimeVoiceProvider(options?: Parameters<typeof buildOpenAIRealtimeVoiceProvider$1>[1]): RealtimeVoiceProviderPlugin;
//#endregion