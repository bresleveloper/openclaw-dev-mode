import { $n as ChannelsConfig, Dn as HooksConfig, I as PluginsConfig, Jr as CommandsConfig, Kr as BroadcastConfig, L as NodeHostConfig, M as OpenClawConfig, Mr as TtsConfig, N as ProxyConfig, P as SkillsConfig, Qn as TranscriptsConfig, Qr as MessagesConfig, Rn as CronConfig, Tn as McpConfig, U as ModelProviderDeclarationConfig, Vn as AcpConfig, W as ModelsConfig, Wr as ToolsConfig, d as MemoryConfig, jn as GatewayConfig, l as AgentsConfig, s as AgentBinding, z as ModelDefinitionConfig, zn as BrowserConfig } from "../../types-D7I_F5Ux.js";
import { n as AuditConfig } from "../../types.base-6bKsSmWG.js";
import { ik as WizardPrompter } from "../../config-contracts-CY87ANNp.js";
import { n as RuntimeEnv } from "../../runtime-M_jncu14.js";
import "../../runtime-env-4zIJrIPC.js";
import "../../provider-model-shared-uYxY__EE.js";
import "../../provider-onboard-BNuhTHon.js";
import { _ as OLLAMA_DEFAULT_COST, d as resolveOllamaCompatNumCtxEnabled, f as shouldInjectOllamaCompatNumCtx, g as OLLAMA_DEFAULT_CONTEXT_WINDOW, h as OLLAMA_DEFAULT_BASE_URL, l as createConfiguredOllamaCompatStreamWrapper, p as wrapOllamaCompatNumCtx, r as buildOllamaChatRequest, u as isOllamaCompatProvider, v as OLLAMA_DEFAULT_MODEL, y as resolveOllamaSetupDefaultBaseUrl } from "../../stream-api-B8t_Olz6.js";
//#region extensions/ollama/src/provider-models.d.ts
type OllamaTagModel = {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
  remote_host?: string;
  remote_model?: string;
  capabilities?: string[];
  details?: {
    context_length?: number;
    family?: string;
    parameter_size?: string;
    quantization_level?: string;
  };
};
type OllamaTagsResponse = {
  models?: OllamaTagModel[];
};
type OllamaModelWithContext = OllamaTagModel & OllamaModelShowInfo & {
  capabilitiesFromList?: boolean;
};
export declare function resolveOllamaApiBase(configuredBaseUrl?: string): string;
type OllamaModelShowInfo = {
  remote?: boolean;
  contextWindow?: number;
  capabilities?: string[];
  thinkingLevelMap?: ModelDefinitionConfig["thinkingLevelMap"];
  /** Distinguishes a failed request from a successful response that omitted capabilities. */
  showInspectionFailed?: boolean;
};
type OllamaModelRequestOptions = {
  apiKey?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  discoveryMode?: "strict";
};
export declare function queryOllamaModelShowInfo(apiBase: string, modelName: string, opts?: OllamaModelRequestOptions): Promise<OllamaModelShowInfo>;
/** @deprecated Use queryOllamaModelShowInfo instead. */
export declare function queryOllamaContextWindow(apiBase: string, modelName: string): Promise<number | undefined>;
export declare function enrichOllamaModelsWithContext(apiBase: string, models: OllamaTagModel[], opts?: OllamaModelRequestOptions): Promise<OllamaModelWithContext[]>;
export declare function isReasoningModelHeuristic(modelId: string): boolean;
export declare function buildOllamaModelDefinition(modelId: string, contextWindow?: number, capabilities?: string[], opts?: OllamaModelShowInfo): ModelDefinitionConfig;
export declare function fetchOllamaModels(baseUrl: string, opts?: OllamaModelRequestOptions): Promise<{
  reachable: boolean;
  models: OllamaTagModel[];
}>;
export declare function buildOllamaProvider(configuredBaseUrl?: string, opts?: {
  apiKey?: string;
  quiet?: boolean;
  discoveryMode?: "strict";
  onListedModels?: (names: string[]) => void;
}): Promise<ModelProviderDeclarationConfig>;
//#endregion
//#region extensions/ollama/src/setup.d.ts
export declare const promptAndConfigureOllama: (params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  prompter: WizardPrompter;
  signal?: AbortSignal;
}) => Promise<{
  config: OpenClawConfig;
  defaultModel?: string;
}>;
export declare const configureOllamaNonInteractive: (params: {
  nextConfig: OpenClawConfig;
  opts: {
    customBaseUrl?: string;
    customModelId?: string;
  };
  runtime: RuntimeEnv;
  agentDir?: string;
}) => Promise<Omit<{
  $schema?: string | undefined;
  meta?: {
    lastTouchedVersion?: string | undefined;
    migrations?: {
      modelPolicyAllowlist?: true | undefined;
      utilityModelSeparation?: true | undefined;
      webhookListeners?: true | Record<string, string[][]> | undefined;
    } | undefined;
  } | undefined;
  env?: {
    shellEnv?: {
      enabled?: boolean | undefined;
      timeoutMs?: number | undefined;
    } | undefined;
    vars?: Record<string, string> | undefined;
  } | undefined;
  wizard?: {
    accessMode?: "full" | "guarded" | undefined;
    appRecommendations?: boolean | undefined;
    lastRunAt?: string | undefined;
    lastRunVersion?: string | undefined;
    lastRunCommit?: string | undefined;
    lastRunCommand?: string | undefined;
    lastRunMode?: "local" | "remote" | undefined;
    securityAcknowledgedAt?: string | undefined;
  } | undefined;
  diagnostics?: {
    enabled?: boolean | undefined;
    flags?: string[] | undefined;
    otel?: {
      enabled?: boolean | undefined;
      endpoint?: string | undefined;
      tracesEndpoint?: string | undefined;
      metricsEndpoint?: string | undefined;
      logsEndpoint?: string | undefined;
      protocol?: "http/protobuf" | undefined;
      headers?: Record<string, string> | undefined;
      serviceName?: string | undefined;
      metricNamePrefix?: string | undefined;
      traces?: boolean | undefined;
      metrics?: boolean | undefined;
      logs?: boolean | undefined;
      logsExporter?: "both" | "otlp" | "stdout" | undefined;
      sampleRate?: number | undefined;
      flushIntervalMs?: number | undefined;
      captureContent?: boolean | undefined;
    } | undefined;
    cacheTrace?: {
      enabled?: boolean | undefined;
    } | undefined;
  } | undefined;
  logging?: {
    level?: "debug" | "error" | "fatal" | "info" | "silent" | "trace" | "warn" | undefined;
    file?: string | undefined;
    maxFileBytes?: number | undefined;
    consoleLevel?: "debug" | "error" | "fatal" | "info" | "silent" | "trace" | "warn" | undefined;
    consoleStyle?: "json" | "pretty" | undefined;
    redactPatterns?: string[] | undefined;
    audit?: {
      enabled?: boolean | undefined;
      executionIdentity?: boolean | undefined;
      messages?: "all" | "direct" | "off" | undefined;
    } | undefined;
  } | undefined;
  update?: {
    channel?: "beta" | "dev" | "extended-stable" | "stable" | undefined;
    checkOnStart?: boolean | undefined;
    auto?: {
      enabled?: boolean | undefined;
    } | undefined;
  } | undefined;
  telemetry?: {
    enabled?: boolean | undefined;
    consentedAt?: string | undefined;
  } | undefined;
  browser?: {
    enabled?: boolean | undefined;
    allowSystemProfileImport?: boolean | undefined;
    evaluateEnabled?: boolean | undefined;
    cdpUrl?: string | undefined;
    executablePath?: string | undefined;
    headless?: boolean | undefined;
    noSandbox?: boolean | undefined;
    attachOnly?: boolean | undefined;
    defaultProfile?: string | undefined;
    snapshotDefaults?: {
      mode?: "efficient" | undefined;
    } | undefined;
    ssrfPolicy?: {
      dangerouslyAllowPrivateNetwork?: boolean | undefined;
      allowRfc2544BenchmarkRange?: boolean | undefined;
      allowIpv6UniqueLocalRange?: boolean | undefined;
      allowedHostnames?: string[] | undefined;
      blockedHostnames?: string[] | undefined;
    } | undefined;
    profiles?: Record<string, {
      engine?: "chromium" | "lightpanda" | undefined;
      cdpPort?: number | undefined;
      cdpUrl?: string | undefined;
      userDataDir?: string | undefined;
      mcpCommand?: string | undefined;
      mcpArgs?: string[] | undefined;
      driver?: "clawd" | "existing-session" | "extension" | "openclaw" | undefined;
      headless?: boolean | undefined;
      executablePath?: string | undefined;
      attachOnly?: boolean | undefined;
    }> | undefined;
    extraArgs?: string[] | undefined;
    tabCleanup?: {
      enabled?: boolean | undefined;
    } | undefined;
    extensionRelay?: {
      allowLegacyAuth?: boolean | undefined;
    } | undefined;
  } | undefined;
  ui?: {
    seamColor?: string | undefined;
    prefs?: {
      theme?: "absolutely" | "beacon" | "claw" | "crt" | "custom" | "dash" | "knot" | "manuscript" | "miami" | "phosphor" | "rose" | "tide" | undefined;
      themeMode?: "dark" | "light" | "system" | undefined;
      accent?: string | undefined;
      locale?: string | undefined;
      chatShowThinking?: boolean | undefined;
      chatShowToolCalls?: boolean | undefined;
      chatPersistCommentary?: boolean | undefined;
      chatSendShortcut?: "enter" | "modifier-enter" | undefined;
      chatFollowUpMode?: "queue" | "steer" | undefined;
      sidebarEntries?: string[] | undefined;
    } | undefined;
  } | undefined;
  secrets?: {
    egressProxy?: {
      enabled?: boolean | undefined;
      allowedHosts?: string[] | undefined;
      bypassHosts?: string[] | undefined;
    } | undefined;
    providers?: {
      [x: string]: {
        source: "env";
        allowlist?: string[] | undefined;
      } | {
        source: "file";
        path: string;
        mode?: "json" | "singleValue" | undefined;
        timeoutMs?: number | undefined;
        maxBytes?: number | undefined;
      } | {
        source: "exec";
        command: string;
        args?: string[] | undefined;
        timeoutMs?: number | undefined;
        noOutputTimeoutMs?: number | undefined;
        maxOutputBytes?: number | undefined;
        jsonOnly?: boolean | undefined;
        env?: Record<string, string> | undefined;
        passEnv?: string[] | undefined;
        trustedDirs?: string[] | undefined;
      } | {
        source: "exec";
        pluginIntegration: {
          pluginId: string;
          integrationId: string;
        };
      } | {
        source: "store";
      };
    } | undefined;
    defaults?: {
      env?: string | undefined;
      file?: string | undefined;
      exec?: string | undefined;
      store?: string | undefined;
    } | undefined;
  } | undefined;
  auth?: {
    profiles?: Record<string, {
      provider: string;
      mode: "api_key" | "aws-sdk" | "oauth" | "token";
      email?: string | undefined;
      displayName?: string | undefined;
    }> | undefined;
    order?: Record<string, string[]> | undefined;
  } | undefined;
  accessGroups?: Record<string, {
    type: "discord.channelAudience";
    guildId: string;
    channelId: string;
    membership?: "canViewChannel" | undefined;
  } | {
    type: "message.senders";
    members: Record<string, string[]>;
  }> | undefined;
  acp?: {
    enabled?: boolean | undefined;
    dispatch?: {
      enabled?: boolean | undefined;
    } | undefined;
    backend?: string | undefined;
    fallbacks?: string[] | undefined;
    defaultAgent?: string | undefined;
    allowedAgents?: string[] | undefined;
    stream?: {
      repeatSuppression?: boolean | undefined;
      deliveryMode?: "final_only" | "live" | undefined;
      tagVisibility?: Record<string, boolean> | undefined;
    } | undefined;
    runtime?: {
      installCommand?: string | undefined;
    } | undefined;
  } | undefined;
  models?: {
    mode?: "merge" | "replace" | undefined;
    providers?: Record<string, {
      baseUrl?: string | undefined;
      apiKey?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      auth?: "api-key" | "aws-sdk" | "oauth" | "token" | undefined;
      api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "github-copilot" | "google-generative-ai" | "google-interactions" | "google-vertex" | "ollama" | "openai-chatgpt-responses" | "openai-completions" | "openai-responses" | "pi-messages" | undefined;
      maxTokens?: number | undefined;
      timeoutSeconds?: number | undefined;
      region?: string | undefined;
      injectNumCtxForOpenAICompat?: boolean | undefined;
      params?: Record<string, unknown> | undefined;
      agentRuntime?: {
        id?: string | undefined;
      } | undefined;
      localService?: {
        command: string;
        args?: string[] | undefined;
        cwd?: string | undefined;
        env?: Record<string, string> | undefined;
        healthUrl?: string | undefined;
        readyTimeoutMs?: number | undefined;
        idleStopMs?: number | undefined;
      } | undefined;
      headers?: Record<string, string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      }> | undefined;
      authHeader?: boolean | undefined;
      request?: {
        headers?: Record<string, string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        }> | undefined;
        auth?: {
          mode: "provider-default";
        } | {
          mode: "authorization-bearer";
          token: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          };
        } | {
          mode: "header";
          headerName: string;
          value: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          };
          prefix?: string | undefined;
        } | undefined;
        proxy?: {
          mode: "env-proxy";
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | {
          mode: "explicit-proxy";
          url: string;
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | undefined;
        tls?: {
          ca?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          cert?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          key?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          passphrase?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          serverName?: string | undefined;
          insecureSkipVerify?: boolean | undefined;
        } | undefined;
        allowPrivateNetwork?: boolean | undefined;
      } | undefined;
      models?: {
        id: string;
        name: string;
        api?: "anthropic-messages" | "azure-openai-responses" | "bedrock-converse-stream" | "github-copilot" | "google-generative-ai" | "google-interactions" | "google-vertex" | "ollama" | "openai-chatgpt-responses" | "openai-completions" | "openai-responses" | "pi-messages" | undefined;
        baseUrl?: string | undefined;
        reasoning?: boolean | undefined;
        input?: ("audio" | "image" | "text" | "video")[] | undefined;
        cost?: {
          input?: number | undefined;
          output?: number | undefined;
          cacheRead?: number | undefined;
          cacheWrite?: number | undefined;
          tieredPricing?: {
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            range: [number] | [number, number];
          }[] | undefined;
        } | undefined;
        contextWindow?: number | undefined;
        contextTokens?: number | undefined;
        maxTokens?: number | undefined;
        thinkingLevelMap?: {
          off?: string | null | undefined;
          minimal?: string | null | undefined;
          low?: string | null | undefined;
          medium?: string | null | undefined;
          high?: string | null | undefined;
          xhigh?: string | null | undefined;
          max?: string | null | undefined;
        } | undefined;
        params?: Record<string, unknown> | undefined;
        agentRuntime?: {
          id?: string | undefined;
        } | undefined;
        headers?: Record<string, string> | undefined;
        compat?: {
          supportsStore?: boolean | undefined;
          supportsPromptCacheKey?: boolean | undefined;
          supportsResponsesContinuation?: boolean | undefined;
          supportsDeveloperRole?: boolean | undefined;
          supportsReasoningEffort?: boolean | undefined;
          supportsTemperature?: boolean | undefined;
          supportsInstructions?: boolean | undefined;
          supportsUsageInStreaming?: boolean | undefined;
          supportsTools?: boolean | undefined;
          codeMode?: "capable" | "preferred" | undefined;
          supportsStrictMode?: boolean | undefined;
          supportsJsonSchemaResponseFormat?: boolean | undefined;
          requiresStringContent?: boolean | undefined;
          strictMessageKeys?: boolean | undefined;
          visibleReasoningDetailTypes?: string[] | undefined;
          supportedReasoningEfforts?: string[] | undefined;
          reasoningEffortMap?: Record<string, string> | undefined;
          defaultThinkingLevel?: string | undefined;
          maxTokensField?: "max_completion_tokens" | "max_tokens" | undefined;
          thinkingFormat?: "deepseek" | "openai" | "openrouter" | "qwen" | "qwen-chat-template" | "together" | "zai" | undefined;
          requiresToolResultName?: boolean | undefined;
          requiresAssistantAfterToolResult?: boolean | undefined;
          requiresThinkingAsText?: boolean | undefined;
          requiresReasoningContentOnAssistantMessages?: boolean | undefined;
          toolSchemaProfile?: string | undefined;
          unsupportedToolSchemaKeywords?: string[] | undefined;
          toolCallArgumentsEncoding?: string | undefined;
          requiresOpenAiAnthropicToolPayload?: boolean | undefined;
          openRouterRouting?: {
            allow_fallbacks?: boolean | undefined;
            require_parameters?: boolean | undefined;
            data_collection?: "allow" | "deny" | undefined;
            zdr?: boolean | undefined;
            enforce_distillable_text?: boolean | undefined;
            order?: string[] | undefined;
            only?: string[] | undefined;
            ignore?: string[] | undefined;
            quantizations?: string[] | undefined;
            sort?: string | {
              by?: string | undefined;
              partition?: string | null | undefined;
            } | undefined;
            max_price?: {
              prompt?: string | number | undefined;
              completion?: string | number | undefined;
              image?: string | number | undefined;
              audio?: string | number | undefined;
              request?: string | number | undefined;
            } | undefined;
            preferred_min_throughput?: number | {
              p50?: number | undefined;
              p75?: number | undefined;
              p90?: number | undefined;
              p99?: number | undefined;
            } | undefined;
            preferred_max_latency?: number | {
              p50?: number | undefined;
              p75?: number | undefined;
              p90?: number | undefined;
              p99?: number | undefined;
            } | undefined;
          } | undefined;
          vercelGatewayRouting?: {
            only?: string[] | undefined;
            order?: string[] | undefined;
          } | undefined;
          zaiToolStream?: boolean | undefined;
          cacheControlFormat?: "anthropic" | undefined;
          sendSessionAffinityHeaders?: boolean | undefined;
          sendSessionIdHeader?: boolean | undefined;
          supportsEagerToolInputStreaming?: boolean | undefined;
          supportsLongCacheRetention?: boolean | undefined;
        } | undefined;
        mediaInput?: {
          image?: {
            maxBytes?: number | undefined;
            maxPixels?: number | undefined;
            maxSidePx?: number | undefined;
            preferredSidePx?: number | undefined;
            tokenMode?: "detail" | "provider" | "tile" | undefined;
          } | undefined;
        } | undefined;
        responseModelEquivalent?: boolean | undefined;
        metadataSource?: "models-add" | undefined;
      }[] | undefined;
    }> | undefined;
    catalogRefresh?: {
      enabled?: boolean | undefined;
      url?: string | undefined;
    } | undefined;
  } | undefined;
  nodeHost?: {
    autoUpdate?: {
      enabled?: boolean | undefined;
    } | undefined;
    agentRuns?: {
      claude?: {
        enabled?: boolean | undefined;
      } | undefined;
    } | undefined;
    workerRuns?: {
      enabled?: boolean | undefined;
      folders?: string[] | undefined;
      capacity?: number | undefined;
      isolation?: "container" | "none" | undefined;
      containerImage?: string | undefined;
    } | undefined;
    browserProxy?: {
      enabled?: boolean | undefined;
      allowProfiles?: string[] | undefined;
    } | undefined;
    mcp?: {
      servers?: unknown;
    } | undefined;
    skills?: {
      enabled?: boolean | undefined;
    } | undefined;
  } | undefined;
  agents?: {
    ownership?: "explicit" | undefined;
    defaults?: {
      params?: Record<string, unknown> | undefined;
      model?: string | {
        primary?: string | undefined;
        fallbacks?: string[] | undefined;
      } | undefined;
      modelSelectionScope?: "agent" | "global" | "session" | undefined;
      utilityModel?: string | undefined;
      decisionModel?: string | undefined;
      imageModel?: string | {
        primary?: string | undefined;
        fallbacks?: string[] | undefined;
        timeoutMs?: number | undefined;
      } | undefined;
      mediaModels?: {
        image?: string | {
          primary?: string | undefined;
          fallbacks?: string[] | undefined;
          timeoutMs?: number | undefined;
        } | undefined;
        video?: string | {
          primary?: string | undefined;
          fallbacks?: string[] | undefined;
          timeoutMs?: number | undefined;
        } | undefined;
        music?: string | {
          primary?: string | undefined;
          fallbacks?: string[] | undefined;
          timeoutMs?: number | undefined;
        } | undefined;
      } | undefined;
      voiceModel?: string | {
        primary?: string | undefined;
        fallbacks?: string[] | undefined;
        timeoutMs?: number | undefined;
      } | undefined;
      pdfModel?: string | {
        primary?: string | undefined;
        fallbacks?: string[] | undefined;
        timeoutMs?: number | undefined;
      } | undefined;
      pdfMaxMb?: number | undefined;
      pdfMaxPages?: number | undefined;
      models?: Record<string, {
        alias?: string | undefined;
        params?: Record<string, unknown> | undefined;
        agentRuntime?: {
          id?: string | undefined;
        } | undefined;
        pickerRuntimes?: string[] | undefined;
        codeMode?: boolean | undefined;
        streaming?: boolean | undefined;
      }> | undefined;
      modelPolicy?: {
        allow?: string[] | undefined;
      } | undefined;
      workspace?: string | undefined;
      cwd?: string | undefined;
      skills?: string[] | undefined;
      silentReply?: {
        group?: "allow" | "disallow" | undefined;
      } | undefined;
      repoRoot?: string | undefined;
      skipBootstrap?: boolean | undefined;
      skipOptionalBootstrapFiles?: ("HEARTBEAT.md" | "IDENTITY.md" | "SOUL.md" | "USER.md")[] | undefined;
      contextInjection?: "always" | "continuation-skip" | "never" | undefined;
      bootstrapMaxChars?: number | undefined;
      bootstrapTotalMaxChars?: number | undefined;
      experimental?: {
        decisionAssistance?: boolean | undefined;
        localModelLean?: boolean | undefined;
      } | undefined;
      userTimezone?: string | undefined;
      startupContext?: {
        enabled?: boolean | undefined;
        applyOn?: ("new" | "reset")[] | undefined;
        dailyMemoryDays?: number | undefined;
        maxFileBytes?: number | undefined;
        maxFileChars?: number | undefined;
        maxTotalChars?: number | undefined;
      } | undefined;
      contextPruning?: {
        mode?: "cache-ttl" | "off" | undefined;
        ttl?: string | undefined;
        tools?: {
          allow?: string[] | undefined;
          deny?: string[] | undefined;
        } | undefined;
        hardClear?: {
          enabled?: boolean | undefined;
          placeholder?: string | undefined;
        } | undefined;
      } | undefined;
      compaction?: {
        enabled?: boolean | undefined;
        mode?: "default" | "safeguard" | undefined;
        provider?: string | undefined;
        thinkingLevel?: "adaptive" | "high" | "inherit" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh" | undefined;
        keepRecentTokens?: number | undefined;
        identifierPolicy?: "off" | "strict" | undefined;
        recentTurnsPreserve?: number | undefined;
        qualityGuard?: {
          enabled?: boolean | undefined;
          maxRetries?: number | undefined;
        } | undefined;
        midTurnPrecheck?: {
          enabled?: boolean | undefined;
        } | undefined;
        postIndexSync?: "async" | "await" | "off" | undefined;
        postCompactionSections?: string[] | undefined;
        model?: string | undefined;
        timeoutSeconds?: number | undefined;
        memoryFlush?: {
          enabled?: boolean | undefined;
          model?: string | undefined;
          softThresholdTokens?: number | undefined;
          forceFlushTranscriptBytes?: string | number | undefined;
        } | undefined;
        maxActiveTranscriptBytes?: string | number | undefined;
        notifyUser?: boolean | undefined;
      } | undefined;
      embeddedAgent?: {
        projectSettingsPolicy?: "ignore" | "sanitize" | "trusted" | undefined;
        executionContract?: "default" | "strict-agentic" | undefined;
        cyberFailover?: {
          mode?: "auto" | "off" | undefined;
          model?: string | undefined;
          cooloffMs?: number | undefined;
        } | undefined;
      } | undefined;
      thinkingDefault?: "adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh" | undefined;
      fastModeDefault?: "auto" | "ultrafast" | boolean | undefined;
      verboseDefault?: "full" | "off" | "on" | undefined;
      toolProgressDetail?: "explain" | "raw" | undefined;
      reasoningDefault?: "off" | "on" | "stream" | undefined;
      elevatedDefault?: "ask" | "full" | "off" | "on" | undefined;
      blockStreamingDefault?: "off" | "on" | undefined;
      blockStreamingBreak?: "message_end" | "text_end" | undefined;
      timeoutSeconds?: number | undefined;
      mediaMaxMb?: number | undefined;
      imageMaxDimensionPx?: number | undefined;
      imageQuality?: "auto" | "balanced" | "efficient" | "high" | undefined;
      typingIntervalSeconds?: number | undefined;
      systemAgent?: {
        agentId?: string | undefined;
      } | undefined;
      authInheritance?: {
        agentId?: string | undefined;
      } | undefined;
      sessionStore?: {
        agentId?: string | undefined;
      } | undefined;
      maxConcurrent?: number | undefined;
      subagents?: {
        delegationMode?: "prefer" | "suggest" | undefined;
        allowAgents?: string[] | undefined;
        maxConcurrent?: number | undefined;
        maxSpawnDepth?: number | undefined;
        maxChildrenPerAgent?: number | undefined;
        archiveAfterMinutes?: number | undefined;
        model?: string | {
          primary?: string | undefined;
          fallbacks?: string[] | undefined;
        } | undefined;
        thinking?: string | undefined;
        runTimeoutSeconds?: number | undefined;
        announceTimeoutMs?: number | undefined;
        requireAgentId?: boolean | undefined;
      } | undefined;
      contextLimits?: {
        memoryGetMaxChars?: number | undefined;
        postCompactionMaxChars?: number | undefined;
      } | undefined;
      blockStreamingChunk?: {
        minChars?: number | undefined;
        maxChars?: number | undefined;
        breakPreference?: "newline" | "paragraph" | "sentence" | undefined;
      } | undefined;
      blockStreamingCoalesce?: {
        minChars?: number | undefined;
        maxChars?: number | undefined;
        idleMs?: number | undefined;
      } | undefined;
      humanDelay?: {
        mode?: "custom" | "natural" | "off" | undefined;
        minMs?: number | undefined;
        maxMs?: number | undefined;
      } | undefined;
      typingMode?: "instant" | "message" | "never" | "thinking" | undefined;
      heartbeat?: {
        every?: string | undefined;
        activeHours?: {
          start?: string | undefined;
          end?: string | undefined;
          timezone?: string | undefined;
        } | undefined;
        model?: string | undefined;
        session?: string | undefined;
        target?: string | undefined;
        directPolicy?: "allow" | "block" | undefined;
        to?: string | undefined;
        accountId?: string | undefined;
        prompt?: string | undefined;
        timeoutSeconds?: number | undefined;
        lightContext?: boolean | undefined;
        isolatedSession?: boolean | undefined;
        agentId?: string | undefined;
      } | undefined;
      sandbox?: {
        mode?: "all" | "non-main" | "off" | undefined;
        backend?: string | undefined;
        workspaceAccess?: "none" | "ro" | "rw" | undefined;
        sessionToolsVisibility?: "all" | "spawned" | undefined;
        scope?: "agent" | "session" | "shared" | undefined;
        workspaceRoot?: string | undefined;
        docker?: {
          image?: string | undefined;
          containerPrefix?: string | undefined;
          workdir?: string | undefined;
          readOnlyRoot?: boolean | undefined;
          tmpfs?: string[] | undefined;
          network?: string | undefined;
          user?: string | undefined;
          capDrop?: string[] | undefined;
          env?: Record<string, string> | undefined;
          setupCommand?: string | string[] | undefined;
          pidsLimit?: number | undefined;
          memory?: string | number | undefined;
          memorySwap?: string | number | undefined;
          cpus?: number | undefined;
          gpus?: string | undefined;
          ulimits?: Record<string, string | number | {
            soft?: number | undefined;
            hard?: number | undefined;
          }> | undefined;
          seccompProfile?: string | undefined;
          apparmorProfile?: string | undefined;
          dns?: string[] | undefined;
          extraHosts?: string[] | undefined;
          binds?: string[] | undefined;
          dangerouslyAllowReservedContainerTargets?: boolean | undefined;
          dangerouslyAllowExternalBindSources?: boolean | undefined;
          dangerouslyAllowContainerNamespaceJoin?: boolean | undefined;
        } | undefined;
        ssh?: {
          target?: string | undefined;
          command?: string | undefined;
          workspaceRoot?: string | undefined;
          strictHostKeyChecking?: boolean | undefined;
          updateHostKeys?: boolean | undefined;
          identityFile?: string | undefined;
          certificateFile?: string | undefined;
          knownHostsFile?: string | undefined;
          identityData?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          certificateData?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
          knownHostsData?: string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          } | undefined;
        } | undefined;
        browser?: {
          enabled?: boolean | undefined;
          image?: string | undefined;
          containerPrefix?: string | undefined;
          network?: string | undefined;
          cdpPort?: number | undefined;
          cdpSourceRange?: string | undefined;
          vncPort?: number | undefined;
          noVncPort?: number | undefined;
          headless?: boolean | undefined;
          noVncEnabled?: boolean | undefined;
          allowHostControl?: boolean | undefined;
          autoStart?: boolean | undefined;
          autoStartTimeoutMs?: number | undefined;
          binds?: string[] | undefined;
        } | undefined;
        prune?: {
          idleHours?: number | undefined;
          maxAgeDays?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    entries?: Record<string, unknown> | undefined;
  } | undefined;
  worktreeRoot?: string | undefined;
  worktreeAcceleration?: NonNullable<boolean | undefined> | undefined;
  worktreeMaxCount?: number | undefined;
  tools?: {
    allow?: string[] | undefined;
    alsoAllow?: string[] | undefined;
    deny?: string[] | undefined;
    profile?: "coding" | "full" | "messaging" | "minimal" | undefined;
    byProvider?: Record<string, {
      allow?: string[] | undefined;
      alsoAllow?: string[] | undefined;
      deny?: string[] | undefined;
      profile?: "coding" | "full" | "messaging" | "minimal" | undefined;
    }> | undefined;
    toolsBySender?: Partial<Record<string, {
      allow?: string[] | undefined;
      alsoAllow?: string[] | undefined;
      deny?: string[] | undefined;
    } | undefined>> | undefined;
    web?: {
      search?: unknown;
      fetch?: {
        enabled?: boolean | undefined;
        provider?: string | undefined;
        maxChars?: number | undefined;
        maxCharsCap?: number | undefined;
        maxResponseBytes?: number | undefined;
        timeoutSeconds?: number | undefined;
        cacheTtlMinutes?: number | undefined;
        maxRedirects?: number | undefined;
        userAgent?: string | undefined;
        headers?: Record<string, string> | undefined;
        readability?: boolean | undefined;
        useTrustedEnvProxy?: boolean | undefined;
        ssrfPolicy?: {
          dangerouslyAllowPrivateNetwork?: boolean | undefined;
          allowRfc2544BenchmarkRange?: boolean | undefined;
          allowIpv6UniqueLocalRange?: boolean | undefined;
          allowedHostnames?: string[] | undefined;
          blockedHostnames?: string[] | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    github?: {
      profileId: string;
      kind?: "oauth" | undefined;
      gitAuthor?: {
        name?: string | undefined;
        email?: string | undefined;
      } | undefined;
    } | undefined;
    media?: {
      models?: ({
        prompt?: string | undefined;
        timeoutSeconds?: number | undefined;
        language?: string | undefined;
        providerOptions?: Record<string, Record<string, string | number | boolean>> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        request?: {
          headers?: Record<string, string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          }> | undefined;
          auth?: {
            mode: "provider-default";
          } | {
            mode: "authorization-bearer";
            token: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
          } | {
            mode: "header";
            headerName: string;
            value: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
            prefix?: string | undefined;
          } | undefined;
          proxy?: {
            mode: "env-proxy";
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | {
            mode: "explicit-proxy";
            url: string;
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | undefined;
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | undefined;
        provider?: string | undefined;
        model?: string | undefined;
        capabilities?: ("audio" | "image" | "video")[] | undefined;
        type?: "cli" | "provider" | undefined;
        command?: string | undefined;
        args?: string[] | undefined;
        maxChars?: number | undefined;
        maxBytes?: number | undefined;
        profile?: string | undefined;
        preferredProfile?: string | undefined;
      } | undefined)[] | undefined;
      concurrency?: number | undefined;
      image?: {
        prompt?: string | undefined;
        timeoutSeconds?: number | undefined;
        language?: string | undefined;
        providerOptions?: Record<string, Record<string, string | number | boolean>> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        request?: {
          headers?: Record<string, string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          }> | undefined;
          auth?: {
            mode: "provider-default";
          } | {
            mode: "authorization-bearer";
            token: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
          } | {
            mode: "header";
            headerName: string;
            value: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
            prefix?: string | undefined;
          } | undefined;
          proxy?: {
            mode: "env-proxy";
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | {
            mode: "explicit-proxy";
            url: string;
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | undefined;
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | undefined;
        enabled?: boolean | undefined;
        preferredModel?: string | undefined;
        scope?: {
          default?: "allow" | "deny" | undefined;
          rules?: {
            action: "allow" | "deny";
            match?: {
              channel?: string | undefined;
              chatType?: "channel" | "direct" | "group" | undefined;
              keyPrefix?: string | undefined;
              rawKeyPrefix?: string | undefined;
            } | undefined;
          }[] | undefined;
        } | undefined;
        maxBytes?: number | undefined;
        maxChars?: number | undefined;
        attachments?: {
          mode?: "all" | "first" | undefined;
          maxAttachments?: number | undefined;
          prefer?: "first" | "last" | "path" | "url" | undefined;
        } | undefined;
      } | undefined;
      audio?: {
        prompt?: string | undefined;
        timeoutSeconds?: number | undefined;
        language?: string | undefined;
        providerOptions?: Record<string, Record<string, string | number | boolean>> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        request?: {
          headers?: Record<string, string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          }> | undefined;
          auth?: {
            mode: "provider-default";
          } | {
            mode: "authorization-bearer";
            token: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
          } | {
            mode: "header";
            headerName: string;
            value: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
            prefix?: string | undefined;
          } | undefined;
          proxy?: {
            mode: "env-proxy";
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | {
            mode: "explicit-proxy";
            url: string;
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | undefined;
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | undefined;
        enabled?: boolean | undefined;
        preferredModel?: string | undefined;
        scope?: {
          default?: "allow" | "deny" | undefined;
          rules?: {
            action: "allow" | "deny";
            match?: {
              channel?: string | undefined;
              chatType?: "channel" | "direct" | "group" | undefined;
              keyPrefix?: string | undefined;
              rawKeyPrefix?: string | undefined;
            } | undefined;
          }[] | undefined;
        } | undefined;
        maxBytes?: number | undefined;
        maxChars?: number | undefined;
        attachments?: {
          mode?: "all" | "first" | undefined;
          maxAttachments?: number | undefined;
          prefer?: "first" | "last" | "path" | "url" | undefined;
        } | undefined;
        echoTranscript?: boolean | undefined;
        echoFormat?: string | undefined;
      } | undefined;
      video?: {
        prompt?: string | undefined;
        timeoutSeconds?: number | undefined;
        language?: string | undefined;
        providerOptions?: Record<string, Record<string, string | number | boolean>> | undefined;
        baseUrl?: string | undefined;
        headers?: Record<string, string> | undefined;
        request?: {
          headers?: Record<string, string | {
            source: "env";
            provider: string;
            id: string;
          } | {
            source: "exec";
            provider: string;
            id: string;
          } | {
            source: "file";
            provider: string;
            id: string;
          } | {
            source: "store";
            provider: string;
            id: string;
          }> | undefined;
          auth?: {
            mode: "provider-default";
          } | {
            mode: "authorization-bearer";
            token: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
          } | {
            mode: "header";
            headerName: string;
            value: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            };
            prefix?: string | undefined;
          } | undefined;
          proxy?: {
            mode: "env-proxy";
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | {
            mode: "explicit-proxy";
            url: string;
            tls?: {
              ca?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              cert?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              key?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              passphrase?: string | {
                source: "env";
                provider: string;
                id: string;
              } | {
                source: "exec";
                provider: string;
                id: string;
              } | {
                source: "file";
                provider: string;
                id: string;
              } | {
                source: "store";
                provider: string;
                id: string;
              } | undefined;
              serverName?: string | undefined;
              insecureSkipVerify?: boolean | undefined;
            } | undefined;
          } | undefined;
          tls?: {
            ca?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            cert?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            key?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            passphrase?: string | {
              source: "env";
              provider: string;
              id: string;
            } | {
              source: "exec";
              provider: string;
              id: string;
            } | {
              source: "file";
              provider: string;
              id: string;
            } | {
              source: "store";
              provider: string;
              id: string;
            } | undefined;
            serverName?: string | undefined;
            insecureSkipVerify?: boolean | undefined;
          } | undefined;
        } | undefined;
        enabled?: boolean | undefined;
        preferredModel?: string | undefined;
        scope?: {
          default?: "allow" | "deny" | undefined;
          rules?: {
            action: "allow" | "deny";
            match?: {
              channel?: string | undefined;
              chatType?: "channel" | "direct" | "group" | undefined;
              keyPrefix?: string | undefined;
              rawKeyPrefix?: string | undefined;
            } | undefined;
          }[] | undefined;
        } | undefined;
        maxBytes?: number | undefined;
        maxChars?: number | undefined;
        attachments?: {
          mode?: "all" | "first" | undefined;
          maxAttachments?: number | undefined;
          prefer?: "first" | "last" | "path" | "url" | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    links?: {
      enabled?: boolean | undefined;
      scope?: {
        default?: "allow" | "deny" | undefined;
        rules?: {
          action: "allow" | "deny";
          match?: {
            channel?: string | undefined;
            chatType?: "channel" | "direct" | "group" | undefined;
            keyPrefix?: string | undefined;
            rawKeyPrefix?: string | undefined;
          } | undefined;
        }[] | undefined;
      } | undefined;
      maxLinks?: number | undefined;
      timeoutSeconds?: number | undefined;
      models?: {
        type?: "cli" | undefined;
        command: string;
        args?: string[] | undefined;
        timeoutSeconds?: number | undefined;
      }[] | undefined;
    } | undefined;
    sessions?: {
      visibility?: "agent" | "all" | "self" | "tree" | undefined;
      allowThreadTargets?: boolean | undefined;
    } | undefined;
    loopDetection?: {
      enabled?: boolean | undefined;
    } | undefined;
    toolSearch?: boolean | {
      enabled?: boolean | undefined;
      mode?: "directory" | "tools" | undefined;
      searchDefaultLimit?: number | undefined;
      maxSearchLimit?: number | undefined;
    } | undefined;
    codeMode?: "auto" | boolean | {
      enabled?: "auto" | boolean | undefined;
      executor?: "node" | "quickjs" | undefined;
      mode?: "only" | undefined;
      timeoutMs?: number | undefined;
      memoryLimitBytes?: number | undefined;
      maxOutputBytes?: number | undefined;
      maxSnapshotBytes?: number | undefined;
      maxPendingToolCalls?: number | undefined;
      snapshotTtlSeconds?: number | undefined;
      searchDefaultLimit?: number | undefined;
      maxSearchLimit?: number | undefined;
    } | undefined;
    swarm?: boolean | {
      enabled?: boolean | undefined;
      maxConcurrent?: number | undefined;
      maxChildrenPerGroup?: number | undefined;
      maxTotalPerGroup?: number | undefined;
      waitTimeoutSecondsMax?: number | undefined;
      defaultAgentId?: string | undefined;
    } | undefined;
    message?: {
      crossContext?: {
        allowWithinProvider?: boolean | undefined;
        allowAcrossProviders?: boolean | undefined;
        marker?: {
          enabled?: boolean | undefined;
          prefix?: string | undefined;
          suffix?: string | undefined;
        } | undefined;
      } | undefined;
      actions?: {
        allow?: string[] | undefined;
      } | undefined;
      broadcast?: {
        enabled?: boolean | undefined;
      } | undefined;
    } | undefined;
    agentToAgent?: {
      enabled?: boolean | undefined;
      allow?: string[] | undefined;
    } | undefined;
    elevated?: {
      enabled?: boolean | undefined;
      allowFrom?: Record<string, (string | number)[]> | undefined;
    } | undefined;
    exec?: {
      host?: "auto" | "gateway" | "node" | "sandbox" | undefined;
      mode?: "allowlist" | "ask" | "auto" | "deny" | "full" | undefined;
      security?: "allowlist" | "deny" | "full" | undefined;
      ask?: "always" | "off" | "on-miss" | undefined;
      node?: string | undefined;
      pathPrepend?: string[] | undefined;
      safeBins?: string[] | undefined;
      strictInlineEval?: boolean | undefined;
      commandHighlighting?: boolean | undefined;
      grantExpiryDays?: number | undefined;
      safeBinTrustedDirs?: string[] | undefined;
      safeBinProfiles?: Record<string, {
        minPositional?: number | undefined;
        maxPositional?: number | undefined;
        allowedValueFlags?: string[] | undefined;
        deniedFlags?: string[] | undefined;
      }> | undefined;
      reviewer?: {
        model?: string | {
          primary?: string | undefined;
          fallbacks?: string[] | undefined;
        } | undefined;
        thinking?: "high" | "low" | "max" | "medium" | "minimal" | "xhigh" | undefined;
        fastMode?: boolean | undefined;
        timeoutMs?: number | undefined;
      } | undefined;
      backgroundMs?: number | undefined;
      approvalRunningNoticeMs?: number | undefined;
      timeoutSeconds?: number | undefined;
      cleanupMs?: number | undefined;
      notifyOnExit?: boolean | undefined;
      notifyOnExitEmptySuccess?: boolean | undefined;
      applyPatch?: {
        enabled?: boolean | undefined;
        workspaceOnly?: boolean | undefined;
        allowModels?: string[] | undefined;
      } | undefined;
    } | undefined;
    fs?: {
      workspaceOnly?: boolean | undefined;
    } | undefined;
    subagents?: {
      tools?: {
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } | undefined;
    } | undefined;
    sandbox?: {
      tools?: {
        allow?: string[] | undefined;
        alsoAllow?: string[] | undefined;
        deny?: string[] | undefined;
      } | undefined;
    } | undefined;
    sessions_spawn?: {
      attachments?: {
        enabled?: boolean | undefined;
        maxTotalBytes?: number | undefined;
        maxFiles?: number | undefined;
        maxFileBytes?: number | undefined;
        retainOnSessionKeep?: boolean | undefined;
      } | undefined;
    } | undefined;
    updatePlan?: boolean | undefined;
  } | undefined;
  security?: {
    audit?: {
      suppressions?: {
        checkId: string;
        titleIncludes?: string | undefined;
        detailIncludes?: string | undefined;
        reason?: string | undefined;
      }[] | undefined;
    } | undefined;
    installPolicy?: {
      enabled?: boolean | undefined;
      targets?: ("plugin" | "skill")[] | undefined;
      exec?: {
        source: "exec";
        command: string;
        args?: string[] | undefined;
        timeoutMs?: number | undefined;
        noOutputTimeoutMs?: number | undefined;
        maxOutputBytes?: number | undefined;
        env?: Record<string, string> | undefined;
        passEnv?: string[] | undefined;
        trustedDirs?: string[] | undefined;
      } | undefined;
    } | undefined;
  } | undefined;
  bindings?: ({
    type?: "route" | undefined;
    agentId: string;
    comment?: string | undefined;
    match: {
      channel: string;
      accountId?: string | undefined;
      peer?: {
        kind: "channel" | "direct" | "group";
        id: string;
      } | undefined;
      guildId?: string | undefined;
      teamId?: string | undefined;
      roles?: string[] | undefined;
    };
    session?: {
      dmScope?: "main" | "per-account-channel-peer" | "per-channel-peer" | "per-peer" | undefined;
      groupScope?: "main" | "per-group" | undefined;
    } | undefined;
  } | {
    type: "acp";
    agentId: string;
    comment?: string | undefined;
    match: {
      channel: string;
      accountId?: string | undefined;
      peer?: {
        kind: "channel" | "direct" | "group";
        id: string;
      } | undefined;
      guildId?: string | undefined;
      teamId?: string | undefined;
      roles?: string[] | undefined;
    };
    acp?: {
      mode?: "oneshot" | "persistent" | undefined;
      label?: string | undefined;
      cwd?: string | undefined;
      backend?: string | undefined;
    } | undefined;
  })[] | undefined;
  broadcast?: {
    [x: string]: string[] | {
      agents: string[];
      mentionGating?: boolean | undefined;
      maxRounds?: number | undefined;
      maxTurns?: number | undefined;
    };
    strategy?: "parallel" | "sequential" | undefined;
  } | undefined;
  attachments?: {
    ttlHours?: number | undefined;
  } | undefined;
  messages?: {
    visibleReplies?: "automatic" | "message_tool" | boolean | undefined;
    responsePrefix?: string | undefined;
    usageTemplate?: string | Record<string, unknown> | undefined;
    responseUsage?: "full" | "off" | "on" | "tokens" | Record<string, "full" | "off" | "on" | "tokens"> | undefined;
    groupChat?: {
      mentionPatterns?: string[] | undefined;
      historyLimit?: number | undefined;
      unmentionedInbound?: "room_event" | "user_request" | undefined;
      visibleReplies?: "automatic" | "message_tool" | boolean | undefined;
    } | undefined;
    queue?: {
      mode?: "collect" | "followup" | "interrupt" | "steer" | undefined;
      allowCollaborativeSteering?: boolean | undefined;
      collaborativeSteeringFallback?: "queue" | "reject" | undefined;
      byChannel?: Record<string, "collect" | "followup" | "interrupt" | "steer"> | undefined;
      debounceMsByChannel?: Record<string, number> | undefined;
      cap?: number | undefined;
      drop?: "new" | "old" | "summarize" | undefined;
    } | undefined;
    inbound?: {
      debounceMs?: number | undefined;
      byChannel?: Record<string, number> | undefined;
    } | undefined;
    ackReaction?: string | undefined;
    ackReactionScope?: "all" | "direct" | "group-all" | "group-mentions" | "none" | "off" | undefined;
    statusReactions?: {
      enabled?: boolean | undefined;
    } | undefined;
  } | undefined;
  tts?: {
    auto?: "always" | "inbound" | "off" | "tagged" | undefined;
    enabled?: boolean | undefined;
    mode?: "all" | "final" | undefined;
    provider?: string | undefined;
    persona?: string | undefined;
    personas?: Record<string, {
      label?: string | undefined;
      description?: string | undefined;
      provider?: string | undefined;
      fallbackPolicy?: "fail" | "preserve-persona" | "provider-defaults" | undefined;
      providers?: Record<string, {
        [x: string]: string | number | boolean | unknown[] | Record<string, unknown> | null;
        apiKey?: string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        } | undefined;
      }> | undefined;
    }> | undefined;
    summaryModel?: string | undefined;
    modelOverrides?: {
      enabled?: boolean | undefined;
      allowText?: boolean | undefined;
      allowProvider?: boolean | undefined;
      allowVoice?: boolean | undefined;
      allowModelId?: boolean | undefined;
      allowVoiceSettings?: boolean | undefined;
      allowNormalization?: boolean | undefined;
      allowSeed?: boolean | undefined;
    } | undefined;
    providers?: Record<string, {
      [x: string]: string | number | boolean | unknown[] | Record<string, unknown> | null;
      apiKey?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
    }> | undefined;
    maxTextLength?: number | undefined;
    timeoutMs?: number | undefined;
  } | undefined;
  commands?: {
    native?: "auto" | boolean | undefined;
    nativeSkills?: "auto" | boolean | undefined;
    text?: boolean | undefined;
    bash?: boolean | undefined;
    bashForegroundMs?: number | undefined;
    config?: boolean | undefined;
    mcp?: boolean | undefined;
    plugins?: boolean | undefined;
    debug?: boolean | undefined;
    restart?: boolean | undefined;
    ownerAllowFrom?: (string | number)[] | undefined;
    allowFrom?: Record<string, (string | number)[]> | undefined;
  } | undefined;
  approvals?: {
    exec?: {
      enabled?: boolean | undefined;
      mode?: "both" | "session" | "targets" | undefined;
      agentFilter?: string[] | undefined;
      sessionFilter?: string[] | undefined;
      targets?: {
        channel: string;
        to: string;
        accountId?: string | undefined;
        threadId?: string | number | undefined;
      }[] | undefined;
    } | undefined;
    plugin?: {
      enabled?: boolean | undefined;
      mode?: "both" | "session" | "targets" | undefined;
      agentFilter?: string[] | undefined;
      sessionFilter?: string[] | undefined;
      targets?: {
        channel: string;
        to: string;
        accountId?: string | undefined;
        threadId?: string | number | undefined;
      }[] | undefined;
      slack?: {
        approvers?: string[] | undefined;
        plugins?: Record<string, {
          approvers?: string[] | undefined;
          tools?: Record<string, {
            approvers: string[];
          }> | undefined;
        }> | undefined;
      } | undefined;
    } | undefined;
  } | undefined;
  session?: {
    scope?: "global" | "per-sender" | undefined;
    dmScope?: "main" | "per-account-channel-peer" | "per-channel-peer" | "per-peer" | undefined;
    groupScope?: "main" | "per-group" | undefined;
    notifyOnCreate?: boolean | undefined;
    identityLinks?: Record<string, string[]> | undefined;
    resetTriggers?: string[] | undefined;
    reset?: {
      mode?: "daily" | "idle" | "none" | undefined;
      atHour?: number | undefined;
      idleMinutes?: number | undefined;
    } | undefined;
    resetByType?: {
      direct?: {
        mode?: "daily" | "idle" | "none" | undefined;
        atHour?: number | undefined;
        idleMinutes?: number | undefined;
      } | undefined;
      group?: {
        mode?: "daily" | "idle" | "none" | undefined;
        atHour?: number | undefined;
        idleMinutes?: number | undefined;
      } | undefined;
      thread?: {
        mode?: "daily" | "idle" | "none" | undefined;
        atHour?: number | undefined;
        idleMinutes?: number | undefined;
      } | undefined;
    } | undefined;
    resetByChannel?: Record<string, {
      mode?: "daily" | "idle" | "none" | undefined;
      atHour?: number | undefined;
      idleMinutes?: number | undefined;
    }> | undefined;
    store?: string | undefined;
    mainKey?: string | undefined;
    sendPolicy?: {
      default?: "allow" | "deny" | undefined;
      rules?: {
        action: "allow" | "deny";
        match?: {
          channel?: string | undefined;
          chatType?: "channel" | "direct" | "group" | undefined;
          keyPrefix?: string | undefined;
          rawKeyPrefix?: string | undefined;
        } | undefined;
      }[] | undefined;
    } | undefined;
    communication?: {
      send?: "always" | "ask" | "never" | undefined;
      receive?: "always" | "ask" | "never" | undefined;
    } | undefined;
    threadBindings?: {
      enabled?: boolean | undefined;
      idleHours?: number | undefined;
      maxAgeHours?: number | undefined;
      spawnSessions?: boolean | undefined;
      defaultSpawnContext?: "fork" | "isolated" | undefined;
    } | undefined;
    sharing?: {
      readOnly?: boolean | undefined;
      suggest?: boolean | undefined;
      drafts?: boolean | undefined;
    } | undefined;
    maintenance?: {
      mode?: "enforce" | "warn" | undefined;
      coldStorage?: {
        enabled?: boolean | undefined;
        afterDays?: number | undefined;
      } | undefined;
      pruneAfter?: string | number | undefined;
      archiveDashboardAfter?: string | number | false | undefined;
      maxEntries?: number | undefined;
      preserveRecent?: string | number | false | undefined;
      resetArchiveRetention?: string | number | false | undefined;
      maxDiskBytes?: string | number | false | undefined;
      highWaterBytes?: string | number | undefined;
    } | undefined;
  } | undefined;
  cron?: {
    enabled?: boolean | undefined;
    skipMissedJobs?: boolean | undefined;
    triggers?: {
      enabled?: boolean | undefined;
    } | undefined;
    webhookToken?: string | {
      source: "env";
      provider: string;
      id: string;
    } | {
      source: "exec";
      provider: string;
      id: string;
    } | {
      source: "file";
      provider: string;
      id: string;
    } | {
      source: "store";
      provider: string;
      id: string;
    } | undefined;
    webhookSsrfPolicy?: {
      dangerouslyAllowPrivateNetwork?: boolean | undefined;
      allowRfc2544BenchmarkRange?: boolean | undefined;
      allowIpv6UniqueLocalRange?: boolean | undefined;
      allowedHostnames?: string[] | undefined;
      blockedHostnames?: string[] | undefined;
    } | undefined;
    sessionRetention?: string | false | undefined;
    failureAlert?: {
      enabled?: boolean | undefined;
      after?: number | undefined;
      cooldownMs?: number | undefined;
      includeSkipped?: boolean | undefined;
      mode?: "announce" | "webhook" | undefined;
      accountId?: string | undefined;
      channel?: string | undefined;
      to?: string | undefined;
    } | undefined;
  } | undefined;
  transcripts?: {
    enabled?: boolean | undefined;
    autoStart?: {
      providerId: string;
      whenOccupied?: boolean | undefined;
      sessionId?: string | undefined;
      title?: string | undefined;
      accountId?: string | undefined;
      guildId?: string | undefined;
      channelId?: string | undefined;
      meetingUrl?: string | undefined;
    }[] | undefined;
  } | undefined;
  hooks?: {
    enabled?: boolean | undefined;
    path?: string | undefined;
    token?: string | undefined;
    defaultSessionKey?: string | undefined;
    allowRequestSessionKey?: boolean | undefined;
    allowedSessionKeyPrefixes?: string[] | undefined;
    allowedAgentIds?: string[] | undefined;
    presets?: string[] | undefined;
    transformsDir?: string | undefined;
    mappings?: ({
      id?: string | undefined;
      match?: {
        path?: string | undefined;
        source?: string | undefined;
      } | undefined;
      action?: "agent" | "wake" | undefined;
      wakeMode?: "next-heartbeat" | "now" | undefined;
      name?: string | undefined;
      agentId?: string | undefined;
      sessionKey?: string | undefined;
      sessionMode?: "isolated" | "persistent" | undefined;
      messageTemplate?: string | undefined;
      textTemplate?: string | undefined;
      forEach?: string | undefined;
      deliver?: boolean | undefined;
      allowUnsafeExternalContent?: boolean | undefined;
      channel?: string | undefined;
      to?: string | undefined;
      model?: string | undefined;
      thinking?: string | undefined;
      timeoutSeconds?: number | undefined;
      transform?: {
        module: string;
        export?: string | undefined;
      } | undefined;
    } | undefined)[] | undefined;
    gmail?: {
      account?: string | undefined;
      label?: string | undefined;
      topic?: string | undefined;
      subscription?: string | undefined;
      pushToken?: string | undefined;
      hookUrl?: string | undefined;
      includeBody?: boolean | undefined;
      maxBytes?: number | undefined;
      renewEveryMinutes?: number | undefined;
      allowUnsafeExternalContent?: boolean | undefined;
      serve?: {
        bind?: string | undefined;
        port?: number | undefined;
        path?: string | undefined;
      } | undefined;
      tailscale?: {
        mode?: "funnel" | "off" | "serve" | undefined;
        path?: string | undefined;
        target?: string | undefined;
      } | undefined;
      model?: string | undefined;
      thinking?: "high" | "low" | "medium" | "minimal" | "off" | undefined;
    } | undefined;
    internal?: {
      enabled?: boolean | undefined;
      entries?: Record<string, {
        [x: string]: unknown;
        enabled?: boolean | undefined;
        env?: Record<string, string> | undefined;
      }> | undefined;
      load?: {
        extraDirs?: string[] | undefined;
      } | undefined;
    } | undefined;
  } | undefined;
  channels?: {} | undefined;
  discovery?: {
    wideArea?: {
      domain?: string | undefined;
    } | undefined;
    mdns?: {
      mode?: "full" | "minimal" | "off" | undefined;
    } | undefined;
  } | undefined;
  talk?: {
    agentId?: string | undefined;
    provider?: string | undefined;
    providers?: Record<string, {
      [x: string]: unknown;
      apiKey?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
    }> | undefined;
    realtime?: {
      provider?: string | undefined;
      providers?: Record<string, {
        [x: string]: unknown;
        apiKey?: string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        } | undefined;
      }> | undefined;
      model?: string | undefined;
      speakerVoice?: string | undefined;
      speakerVoiceId?: string | undefined;
      instructions?: string | undefined;
      mode?: "realtime" | "stt-tts" | "transcription" | undefined;
      transport?: "gateway-relay" | "managed-room" | "provider-websocket" | "webrtc" | undefined;
      vadThreshold?: number | undefined;
      silenceDurationMs?: number | undefined;
      prefixPaddingMs?: number | undefined;
      reasoningEffort?: string | undefined;
      brain?: "agent-consult" | "direct-tools" | "none" | undefined;
      consultRouting?: "force-agent-consult" | "provider-direct" | undefined;
    } | undefined;
    consultThinkingLevel?: "adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh" | undefined;
    consultFastMode?: boolean | undefined;
    speechLocale?: string | undefined;
    interruptOnSpeech?: boolean | undefined;
    silenceTimeoutMs?: number | undefined;
  } | undefined;
  gateway?: {
    port?: number | undefined;
    mode?: "local" | "remote" | undefined;
    bind?: "auto" | "custom" | "lan" | "loopback" | "tailnet" | undefined;
    customBindHost?: string | undefined;
    publicOrigin?: string | undefined;
    portals?: {
      ingress?: {
        domain: string;
        port: number;
      } | undefined;
    } | undefined;
    github?: {
      host?: string | undefined;
      apiBaseUrl?: string | undefined;
    } | undefined;
    projects?: {
      defaultRepository?: {
        url: string;
        ref?: string | undefined;
      } | undefined;
      nativeGitHubSearch?: boolean | undefined;
    } | undefined;
    controlUi?: {
      dangerouslyDisableDeviceAuth?: boolean | undefined;
      enabled?: boolean | undefined;
      basePath?: string | undefined;
      experimental?: {
        customPlugins?: boolean | undefined;
        chatBubbles?: boolean | undefined;
      } | undefined;
      root?: string | undefined;
      environment?: {
        label: string;
        color: "amber" | "blue" | "coral" | "gray" | "green" | "pink" | "purple" | "red" | "teal";
      } | undefined;
      communityInvite?: boolean | undefined;
      newSessionModelDefaults?: "configured" | "last-used" | undefined;
      github?: {
        host?: string | undefined;
        token?: string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        } | undefined;
      } | undefined;
      sessionObserver?: boolean | undefined;
      embedSandbox?: "scripts" | "strict" | "trusted" | undefined;
      allowExternalEmbedUrls?: boolean | undefined;
      automaticallyFetchFavicons?: boolean | undefined;
      allowedOrigins?: string[] | undefined;
      dangerouslyAllowHostHeaderOriginFallback?: boolean | undefined;
    } | undefined;
    uploads?: {
      enabled?: boolean | undefined;
    } | undefined;
    cliAgents?: {
      enabled?: boolean | undefined;
    } | undefined;
    terminal?: {
      enabled?: boolean | undefined;
      shell?: string | undefined;
      detachedSessionTimeoutSeconds?: number | undefined;
    } | undefined;
    auth?: {
      mode?: "none" | "password" | "token" | "trusted-proxy" | undefined;
      token?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      password?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      allowTailscale?: boolean | undefined;
      identityScopes?: Record<string, ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[]> | undefined;
      rateLimit?: {
        maxAttempts?: number | undefined;
        windowMs?: number | undefined;
        lockoutMs?: number | undefined;
        exemptLoopback?: boolean | undefined;
      } | undefined;
      trustedProxy?: {
        userHeader: string;
        requiredHeaders?: string[] | undefined;
        allowUsers?: string[] | undefined;
        allowLoopback?: boolean | undefined;
        cloudflareAccessOidc?: {
          issuer: string;
          providerId: string;
          githubAccountIdClaim: string;
        } | undefined;
        deviceAutoApprove?: {
          enabled?: boolean | undefined;
          scopes?: string[] | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    roles?: {
      default: string;
      assignments?: {
        byGithubLogin?: Record<string, string> | undefined;
      } | undefined;
      definitions: Record<string, {
        sessions: {
          others: "none" | "suggest" | "view" | "write";
        };
        sandbox?: "inherit" | "required" | undefined;
        agents: "*" | string[];
        modelPolicy?: {
          sourceAgent?: string | undefined;
          allow?: string[] | undefined;
          deny?: string[] | undefined;
        } | undefined;
        scopes: ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[];
        accessPolicyPlugin?: string | undefined;
      }>;
    } | undefined;
    trustedProxies?: string[] | undefined;
    allowRealIpFallback?: boolean | undefined;
    tools?: {
      deny?: string[] | undefined;
      allow?: string[] | undefined;
    } | undefined;
    tailscale?: {
      mode?: "funnel" | "off" | "serve" | undefined;
      preserveFunnel?: boolean | undefined;
    } | undefined;
    remote?: {
      url?: string | undefined;
      transport?: "direct" | "ssh" | undefined;
      remotePort?: number | undefined;
      token?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      password?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      edgeAuth?: Record<string, string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      }> | undefined;
      tlsFingerprint?: string | undefined;
      sshTarget?: string | undefined;
      sshIdentity?: string | undefined;
      sshHostKeyPolicy?: "openssh" | "strict" | undefined;
    } | undefined;
    reload?: {
      mode?: "hybrid" | "off" | undefined;
    } | undefined;
    tls?: {
      enabled?: boolean | undefined;
      autoGenerate?: boolean | undefined;
      certPath?: string | undefined;
      keyPath?: string | undefined;
      caPath?: string | undefined;
    } | undefined;
    http?: {
      endpoints?: {
        chatCompletions?: {
          enabled?: boolean | undefined;
          images?: {
            allowUrl?: boolean | undefined;
            urlAllowlist?: string[] | undefined;
            allowedMimes?: string[] | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            timeoutMs?: number | undefined;
          } | undefined;
        } | undefined;
        responses?: {
          enabled?: boolean | undefined;
          maxUrlParts?: number | undefined;
          files?: {
            allowUrl?: boolean | undefined;
            urlAllowlist?: string[] | undefined;
            allowedMimes?: string[] | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            timeoutMs?: number | undefined;
            maxChars?: number | undefined;
            pdf?: {
              maxPages?: number | undefined;
              maxPixels?: number | undefined;
              minTextChars?: number | undefined;
            } | undefined;
          } | undefined;
          images?: {
            allowUrl?: boolean | undefined;
            urlAllowlist?: string[] | undefined;
            allowedMimes?: string[] | undefined;
            maxBytes?: number | undefined;
            maxRedirects?: number | undefined;
            timeoutMs?: number | undefined;
          } | undefined;
        } | undefined;
      } | undefined;
      securityHeaders?: {
        strictTransportSecurity?: string | false | undefined;
      } | undefined;
    } | undefined;
    push?: {
      apns?: {
        relay?: {
          baseUrl?: string | undefined;
          timeoutMs?: number | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
    nodes?: {
      browser?: {
        mode?: "auto" | "manual" | "off" | undefined;
        node?: string | undefined;
      } | undefined;
      pairing?: {
        autoApproveLocal?: boolean | undefined;
        autoApproveCidrs?: string[] | undefined;
        sshVerify?: boolean | {
          user?: string | undefined;
          identity?: string | undefined;
          timeoutMs?: number | undefined;
          cidrs?: string[] | undefined;
        } | undefined;
      } | undefined;
      pluginTools?: {
        enabled?: boolean | undefined;
      } | undefined;
      allowSkills?: boolean | undefined;
      commands?: {
        allow?: string[] | undefined;
        deny?: string[] | undefined;
      } | undefined;
    } | undefined;
  } | undefined;
  cloudWorkers?: {
    requiredProfile?: string | undefined;
    desktop?: boolean | undefined;
    preparedPool?: {
      maxTotal?: number | undefined;
    } | undefined;
    projectProfiles?: Record<string, string> | undefined;
    profiles?: Record<string, {
      provider: string;
      install?: "bundle" | "npm" | undefined;
      suspendAfter?: string | undefined;
      readyWorkers?: number | undefined;
      settings?: Record<string, unknown> | undefined;
    }> | undefined;
  } | undefined;
  database?: {
    engine?: "postgres" | "sqlite" | undefined;
    postgres?: {
      connection?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      schemaPrefix?: string | undefined;
    } | undefined;
  } | undefined;
  storage?: {
    locations?: Record<string, {
      provider: string;
      settings: Record<string, unknown>;
      encryption: "none" | {
        passphrase: string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        };
      };
    }> | undefined;
  } | undefined;
  desktop?: {
    host?: {
      enabled: boolean;
      managed?: boolean | undefined;
      port?: number | undefined;
      passwordFile?: string | undefined;
    } | undefined;
  } | undefined;
  memory?: {
    citations?: "auto" | "off" | "on" | undefined;
    search?: {
      enabled?: boolean | undefined;
      rememberAcrossConversations?: boolean | undefined;
      sources?: ("memory" | "sessions")[] | undefined;
      extraPaths?: (string | {
        path: string;
        pattern?: string | undefined;
      })[] | undefined;
      multimodal?: {
        enabled?: boolean | undefined;
        modalities?: ("all" | "audio" | "image")[] | undefined;
        maxFileBytes?: number | undefined;
      } | undefined;
      experimental?: {
        sessionMemory?: boolean | undefined;
      } | undefined;
      provider?: string | undefined;
      remote?: {
        baseUrl?: string | undefined;
        apiKey?: string | {
          source: "env";
          provider: string;
          id: string;
        } | {
          source: "exec";
          provider: string;
          id: string;
        } | {
          source: "file";
          provider: string;
          id: string;
        } | {
          source: "store";
          provider: string;
          id: string;
        } | undefined;
        headers?: Record<string, string> | undefined;
        batch?: {
          enabled?: boolean | undefined;
        } | undefined;
      } | undefined;
      fallback?: string | undefined;
      model?: string | undefined;
      inputType?: string | undefined;
      queryInputType?: string | undefined;
      documentInputType?: string | undefined;
      outputDimensionality?: number | undefined;
      local?: {
        modelPath?: string | undefined;
      } | undefined;
      store?: {
        fts?: {
          tokenizer?: "trigram" | "unicode61" | undefined;
        } | undefined;
        vector?: {
          enabled?: boolean | undefined;
          extensionPath?: string | undefined;
        } | undefined;
      } | undefined;
      query?: {
        maxResults?: number | undefined;
        minScore?: number | undefined;
      } | undefined;
      cache?: {
        enabled?: boolean | undefined;
      } | undefined;
    } | undefined;
  } | undefined;
  mcp?: {
    sessionIdleTtlMs?: number | undefined;
    servers?: unknown;
    apps?: {
      enabled?: boolean | undefined;
      sandboxOrigin?: string | undefined;
      sandboxPort?: number | undefined;
    } | undefined;
  } | undefined;
  skills?: {
    allowBundled?: string[] | undefined;
    load?: {
      extraDirs?: string[] | undefined;
      allowSymlinkTargets?: string[] | undefined;
      watch?: boolean | undefined;
    } | undefined;
    install?: {
      preferBrew?: boolean | undefined;
      nodeManager?: "bun" | "npm" | "pnpm" | "yarn" | undefined;
      allowUploadedArchives?: boolean | undefined;
    } | undefined;
    limits?: {
      maxCandidatesPerRoot?: number | undefined;
      maxSkillsLoadedPerSource?: number | undefined;
      maxSkillsInPrompt?: number | undefined;
      maxSkillsPromptChars?: number | undefined;
      maxSkillFileBytes?: number | undefined;
    } | undefined;
    workshop?: {
      autonomous?: {
        mode?: "auto" | "off" | undefined;
        channelNotices?: boolean | undefined;
      } | undefined;
      maxSkillBytes?: number | undefined;
    } | undefined;
    entries?: Record<string, {
      enabled?: boolean | undefined;
      apiKey?: string | {
        source: "env";
        provider: string;
        id: string;
      } | {
        source: "exec";
        provider: string;
        id: string;
      } | {
        source: "file";
        provider: string;
        id: string;
      } | {
        source: "store";
        provider: string;
        id: string;
      } | undefined;
      env?: Record<string, string> | undefined;
      config?: Record<string, unknown> | undefined;
    }> | undefined;
  } | undefined;
  plugins?: {
    enabled?: boolean | undefined;
    allow?: string[] | undefined;
    deny?: string[] | undefined;
    load?: {
      paths?: string[] | undefined;
    } | undefined;
    slots?: {
      memory?: string | undefined;
      contextEngine?: string | undefined;
    } | undefined;
    entries?: Record<string, {
      enabled?: boolean | undefined;
      hooks?: {
        allowPromptInjection?: boolean | undefined;
        allowConversationAccess?: boolean | undefined;
        timeoutMs?: number | undefined;
        timeouts?: Record<string, number> | undefined;
      } | undefined;
      subagent?: {
        allowModelOverride?: boolean | undefined;
        allowedModels?: string[] | undefined;
      } | undefined;
      llm?: {
        allowModelOverride?: boolean | undefined;
        allowedModels?: string[] | undefined;
        allowedCompletionModels?: string[] | undefined;
        allowAuthProfileOverride?: boolean | undefined;
        allowAgentIdOverride?: boolean | undefined;
      } | undefined;
      config?: Record<string, unknown> | undefined;
    }> | undefined;
  } | undefined;
  surfaces?: Record<string, {
    silentReply?: {
      group?: "allow" | "disallow" | undefined;
    } | undefined;
  }> | undefined;
  proxy?: {
    enabled?: boolean | undefined;
    proxyUrl?: string | undefined;
    tls?: {
      caFile?: string | undefined;
    } | undefined;
    loopbackMode?: "block" | "gateway-only" | "proxy" | undefined;
  } | undefined;
}, keyof {
  audit?: AuditConfig;
  acp?: AcpConfig;
  env?: {
    shellEnv?: {
      enabled?: boolean;
      timeoutMs?: number;
    };
    vars?: Record<string, string>;
    [key: string]: string | Record<string, string> | {
      enabled?: boolean;
      timeoutMs?: number;
    } | undefined;
  };
  browser?: BrowserConfig;
  skills?: SkillsConfig;
  plugins?: PluginsConfig;
  models?: ModelsConfig;
  nodeHost?: NodeHostConfig;
  agents?: AgentsConfig;
  tools?: ToolsConfig;
  bindings?: AgentBinding[];
  broadcast?: BroadcastConfig;
  messages?: MessagesConfig;
  tts?: TtsConfig;
  commands?: CommandsConfig;
  channels?: ChannelsConfig;
  cron?: CronConfig;
  transcripts?: TranscriptsConfig;
  hooks?: HooksConfig;
  gateway?: GatewayConfig;
  memory?: MemoryConfig;
  mcp?: McpConfig;
  proxy?: ProxyConfig;
}> & {
  audit?: AuditConfig;
  acp?: AcpConfig;
  env?: {
    shellEnv?: {
      enabled?: boolean;
      timeoutMs?: number;
    };
    vars?: Record<string, string>;
    [key: string]: string | Record<string, string> | {
      enabled?: boolean;
      timeoutMs?: number;
    } | undefined;
  };
  browser?: BrowserConfig;
  skills?: SkillsConfig;
  plugins?: PluginsConfig;
  models?: ModelsConfig;
  nodeHost?: NodeHostConfig;
  agents?: AgentsConfig;
  tools?: ToolsConfig;
  bindings?: AgentBinding[];
  broadcast?: BroadcastConfig;
  messages?: MessagesConfig;
  tts?: TtsConfig;
  commands?: CommandsConfig;
  channels?: ChannelsConfig;
  cron?: CronConfig;
  transcripts?: TranscriptsConfig;
  hooks?: HooksConfig;
  gateway?: GatewayConfig;
  memory?: MemoryConfig;
  mcp?: McpConfig;
  proxy?: ProxyConfig;
}>;
export declare const ensureOllamaModelPulled: (params: {
  config: OpenClawConfig;
  model: string;
  prompter: WizardPrompter;
}) => Promise<void>;
//#endregion
export { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_CONTEXT_WINDOW, OLLAMA_DEFAULT_COST, OLLAMA_DEFAULT_MODEL, type OllamaModelShowInfo, type OllamaModelWithContext, type OllamaTagModel, type OllamaTagsResponse, buildOllamaChatRequest, createConfiguredOllamaCompatStreamWrapper, isOllamaCompatProvider, resolveOllamaCompatNumCtxEnabled, resolveOllamaSetupDefaultBaseUrl, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };