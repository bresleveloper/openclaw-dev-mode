import { AD as RealtimeVoiceProviderCapabilities, Bb as formatErrorMessage, Hb as createProviderHttpError, Jb as fetchWithSsrFGuard, Ki as PluginLogger, OD as RealtimeVoiceBrowserSession, OS as createRealtimeTranscriptionWebSocketSession, QE as RealtimeVoiceProviderPlugin, Rb as redactSensitiveText, SD as RealtimeVoiceBrowserSessionCreateRequest, TD as RealtimeVoiceBridge, Ub as readProviderJsonResponse, Wb as readProviderTextResponse, ZE as RealtimeTranscriptionProviderPlugin, Zb as ProviderPlugin, gE as resolveAgentDir, kD as RealtimeVoiceGatewayControl, lx as OAuthCredentials, nS as ProviderAuthContext, wS as resolveProviderRequestHeaders } from "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../index-DSy-_0fC.js";
import "../../security-runtime-HqxvRL4S.js";
import { u as AuthProfileCredential } from "../../provider-request-config.types-BDimJcpZ.js";
import "../../provider-auth-QzauSf-u.js";
import "../../diagnostic-events-ClGLRZ6Y.js";
import { c as MediaUnderstandingProvider } from "../../image-runtime-CA1hAb1m.js";
import "../../error-runtime-Bn19Doo0.js";
import { b as resolveDebugProxySettings, i as captureWsEventAsync, y as createDebugProxyWebSocketAgent } from "../../runtime-DN-E2F5t.js";
import "../../provider-model-shared-OQQj5XdR.js";
import "../../provider-http-BIH03nQe.js";
import "../../provider-onboard-BitR1dNE.js";
import "../../ssrf-runtime-4o_9rfoz.js";
import "../../media-understanding-Byi-W4JG.js";
import { i as RealtimeVoiceAgentConsultTranscriptEntry } from "../../realtime-session-harness-C4CQCSgC.js";
import "../../proxy-capture-BSPRUd0c.js";
import "../../ws-BmGt_ZbZ.js";
import WebSocket$1 from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
export declare const OPENAI_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
export declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
export declare const OPENAI_DEFAULT_TTS_MODEL = "gpt-4o-mini-tts";
export declare const OPENAI_DEFAULT_TTS_VOICE = "alloy";
export declare const OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL = "gpt-transcribe";
export declare const OPENAI_DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
export declare function applyOpenAIProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyOpenAIConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare const openaiMediaUnderstandingProvider: MediaUnderstandingProvider;
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
declare function refreshOpenAICodexToken$1(refreshToken: string): Promise<OAuthCredentials>;
export declare function refreshOpenAICodexToken(...args: Parameters<typeof refreshOpenAICodexToken$1>): Promise<Awaited<ReturnType<typeof refreshOpenAICodexToken$1>>>;
export declare function buildOpenAIProvider(): ProviderPlugin;
export declare function buildOpenAIRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
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
type OpenAIQuicksilverAuth = {
  type: "api-key";
  token: string;
} | {
  type: "oauth";
  token: string;
  accountId: string;
};
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
declare function buildOpenAIRealtimeVoiceProvider$1(context: OpenAIRealtimeHost, options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
export declare function buildOpenAIRealtimeVoiceProvider(options?: Parameters<typeof buildOpenAIRealtimeVoiceProvider$1>[1]): RealtimeVoiceProviderPlugin;
export {};