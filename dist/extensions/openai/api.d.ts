import { A as RealtimeVoiceGatewayControl, C as PluginLogger, D as RealtimeVoiceBridge, E as RealtimeVoiceProviderPlugin, L as MediaUnderstandingProvider, O as RealtimeVoiceBrowserSession, R as AuthProfileCredential, T as RealtimeTranscriptionProviderPlugin, _ as createDebugProxyWebSocketAgent, a as ProviderPlugin, b as createRealtimeTranscriptionWebSocketSession, c as OAuthCredentials, d as formatErrorMessage, f as createProviderHttpError, g as captureWsEvent, h as fetchWithSsrFGuard, j as RealtimeVoiceProviderCapabilities, k as RealtimeVoiceBrowserSessionCreateRequest, m as readProviderTextResponse, p as readProviderJsonResponse, s as ProviderAuthContext, u as redactSensitiveText, v as resolveDebugProxySettings, x as resolveAgentDir, y as resolveProviderRequestHeaders$1, z as OpenClawConfig } from "../../cli-backend.types-kTOThe9I.js";
import "../../provider-model-shared-CP6E2ez3.js";
import "../../provider-onboard-B6IQ5BVZ.js";
import "../../context-visibility-B6IQ5BVZ.js";
import "kysely";
import "@openclaw/fs-safe/advanced";
import { ClientOptions, RawData } from "ws";
import "@openclaw/fs-safe/path";
import { IncomingMessage, ServerResponse } from "node:http";
import "@openclaw/ai/internal/shared";
import "@openclaw/fs-safe/permissions";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/store";
import "@openclaw/fs-safe/atomic";
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
/**
 * Refresh OpenAI Codex OAuth token
 */
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
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => boolean;
  resolveProviderAuthProfileApiKey: (params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentDir?: string;
    profileTypes?: readonly AuthProfileCredential["type"][];
    allowKeychainPrompt?: boolean;
    includeExternalCliAuth?: boolean;
  }) => Promise<string | undefined>;
  resolveProviderRequestHeaders: typeof resolveProviderRequestHeaders$1;
  createRealtimeTranscriptionWebSocketSession: typeof createRealtimeTranscriptionWebSocketSession;
  captureWsEvent: typeof captureWsEvent;
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
//#region extensions/openai/realtime-quicksilver-socket.shared.d.ts
type OpenAIQuicksilverSocket = {
  readonly readyState: number;
  send(payload: string): void;
  close(code?: number, reason?: string): void;
  on(event: "message", listener: (data: RawData, isBinary: boolean) => void): OpenAIQuicksilverSocket;
  on(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  on(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
  once(event: "open", listener: () => void): OpenAIQuicksilverSocket;
  once(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  once(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
  off(event: "open", listener: () => void): OpenAIQuicksilverSocket;
  off(event: "message", listener: (data: RawData, isBinary: boolean) => void): OpenAIQuicksilverSocket;
  off(event: "error", listener: (error: Error) => void): OpenAIQuicksilverSocket;
  off(event: "close", listener: (code: number, reason: Buffer) => void): OpenAIQuicksilverSocket;
};
type OpenAIQuicksilverSocketFactory = (url: string, options: Pick<ClientOptions, "headers" | "maxPayload">) => OpenAIQuicksilverSocket;
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
type OpenAIQuicksilverInitialItem = {
  role: "user" | "assistant";
  text: string;
};
//#endregion
//#region extensions/openai/realtime-quicksilver-session.d.ts
type OpenAIQuicksilverSessionRequest = {
  initialItems?: OpenAIQuicksilverInitialItem[];
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
declare function createOpenAIQuicksilverBrowserSessionBroker(params: {
  getConfig: () => OpenClawConfig | undefined;
  logger: Pick<PluginLogger, "debug" | "warn">;
  fetchImpl?: typeof fetch;
  webSocketFactory?: OpenAIQuicksilverSocketFactory;
  onCleanupComplete?: () => void;
}, context: OpenAIRealtimeHost): {
  broker: {
    capabilities: Partial<RealtimeVoiceProviderCapabilities> & {
      handlesAgentConsult: true;
    };
    createBrowserSession: (request: OpenAIQuicksilverSessionRequest, auth: OpenAIQuicksilverAuth) => Promise<RealtimeVoiceBrowserSession>;
    cancelBrowserSession: (session: RealtimeVoiceBrowserSession) => Promise<void> | void;
  };
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
  cleanup: () => Promise<void>;
  getSessionCounts: () => {
    pending: number;
    inFlight: number;
    active: number;
    reservations: number;
  };
};
//#endregion
//#region extensions/openai/realtime-voice-provider-factory.d.ts
type OpenAIQuicksilverBrowserSessionBroker = ReturnType<typeof createOpenAIQuicksilverBrowserSessionBroker>["broker"];
declare function buildOpenAIRealtimeVoiceProvider$1(context: OpenAIRealtimeHost, options?: {
  quicksilverBrowserSessionBroker?: OpenAIQuicksilverBrowserSessionBroker;
  logger?: Pick<PluginLogger, "debug" | "warn">;
}): RealtimeVoiceProviderPlugin;
//#endregion
//#region extensions/openai/realtime-voice-provider.d.ts
export declare function buildOpenAIRealtimeVoiceProvider(options?: Parameters<typeof buildOpenAIRealtimeVoiceProvider$1>[1]): RealtimeVoiceProviderPlugin;
//#endregion