import { z } from "zod";
//#region src/config/zod-schema.messages.d.ts
declare const MentionPatternsPolicySchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
  allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
declare const GroupChatSchema: z.ZodOptional<z.ZodObject<{
  mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  unmentionedInbound: z.ZodOptional<z.ZodEnum<{
    room_event: "room_event";
    user_request: "user_request";
  }>>;
  visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    automatic: "automatic";
    message_tool: "message_tool";
  }>, z.ZodBoolean]>>;
}, z.core.$strict>>;
declare const DmConfigSchema: z.ZodObject<{
  historyLimit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const ProviderCommandsSchema: z.ZodOptional<z.ZodObject<{
  native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
}, z.core.$strict>>;
declare const MessagesSchema: z.ZodOptional<z.ZodObject<{
  visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    automatic: "automatic";
    message_tool: "message_tool";
  }>, z.ZodBoolean]>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  usageTemplate: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
  responseUsage: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
    tokens: "tokens";
  }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
    tokens: "tokens";
  }>>]>>;
  groupChat: z.ZodOptional<z.ZodObject<{
    mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    unmentionedInbound: z.ZodOptional<z.ZodEnum<{
      room_event: "room_event";
      user_request: "user_request";
    }>>;
    visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      automatic: "automatic";
      message_tool: "message_tool";
    }>, z.ZodBoolean]>>;
  }, z.core.$strict>>;
  queue: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
    byChannel: z.ZodOptional<z.ZodObject<{
      whatsapp: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      telegram: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      discord: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      irc: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      googlechat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      slack: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      mattermost: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      signal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      imessage: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      msteams: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      webchat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      matrix: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
    }, z.core.$strict>>;
    debounceMsByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    cap: z.ZodOptional<z.ZodNumber>;
    drop: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"old">, z.ZodLiteral<"new">, z.ZodLiteral<"summarize">]>>;
  }, z.core.$strict>>;
  inbound: z.ZodOptional<z.ZodObject<{
    debounceMs: z.ZodOptional<z.ZodNumber>;
    byChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
  }, z.core.$strict>>;
  ackReaction: z.ZodOptional<z.ZodString>;
  ackReactionScope: z.ZodOptional<z.ZodEnum<{
    all: "all";
    direct: "direct";
    "group-all": "group-all";
    "group-mentions": "group-mentions";
    none: "none";
    off: "off";
  }>>;
  statusReactions: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const BroadcastSchema: z.ZodOptional<z.ZodObject<{
  strategy: z.ZodOptional<z.ZodEnum<{
    parallel: "parallel";
    sequential: "sequential";
  }>>;
}, z.core.$catchall<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
  agents: z.ZodArray<z.ZodString>;
  mentionGating: z.ZodOptional<z.ZodBoolean>;
  maxRounds: z.ZodOptional<z.ZodNumber>;
  maxTurns: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>]>>>>;
//#endregion
//#region src/config/zod-schema.core.d.ts
/** Canonical operator-configurable SSRF policy shared by network-capable surfaces. */
declare const SsrFPolicyConfigSchema: z.ZodObject<{
  dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
  allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
  allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
  allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
/** Schema for one configured env/file/exec/store secret provider entry. */
declare const SecretProviderSchema: z.ZodUnion<readonly [z.ZodObject<{
  source: z.ZodLiteral<"env">;
  allowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"file">;
  path: z.ZodString;
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"singleValue">, z.ZodLiteral<"json">]>>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
  maxBytes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodUnion<readonly [z.ZodObject<{
  source: z.ZodLiteral<"exec">;
  command: z.ZodString;
  args: z.ZodOptional<z.ZodArray<z.ZodString>>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
  noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
  maxOutputBytes: z.ZodOptional<z.ZodNumber>;
  jsonOnly: z.ZodOptional<z.ZodBoolean>;
  env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
  trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"exec">;
  pluginIntegration: z.ZodObject<{
    pluginId: z.ZodString;
    integrationId: z.ZodString;
  }, z.core.$strict>;
}, z.core.$strict>]>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
}, z.core.$strict>]>;
/** Schema for the top-level `secrets` config block. */
declare const SecretsConfigSchema: z.ZodOptional<z.ZodObject<{
  egressProxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowedHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bypassHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  providers: z.ZodOptional<z.ZodObject<{}, z.core.$catchall<z.ZodUnion<readonly [z.ZodObject<{
    source: z.ZodLiteral<"env">;
    allowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"file">;
    path: z.ZodString;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"singleValue">, z.ZodLiteral<"json">]>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    maxBytes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>, z.ZodUnion<readonly [z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
    maxOutputBytes: z.ZodOptional<z.ZodNumber>;
    jsonOnly: z.ZodOptional<z.ZodBoolean>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    pluginIntegration: z.ZodObject<{
      pluginId: z.ZodString;
      integrationId: z.ZodString;
    }, z.core.$strict>;
  }, z.core.$strict>]>, z.ZodObject<{
    source: z.ZodLiteral<"store">;
  }, z.core.$strict>]>>>>;
  defaults: z.ZodOptional<z.ZodObject<{
    env: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodString>;
    exec: z.ZodOptional<z.ZodString>;
    store: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const ModelsConfigSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"merge">, z.ZodLiteral<"replace">]>>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    baseUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"api-key">, z.ZodLiteral<"aws-sdk">, z.ZodLiteral<"oauth">, z.ZodLiteral<"token">]>>;
    api: z.ZodOptional<z.ZodEnum<{
      "anthropic-messages": "anthropic-messages";
      "azure-openai-responses": "azure-openai-responses";
      "bedrock-converse-stream": "bedrock-converse-stream";
      "github-copilot": "github-copilot";
      "google-generative-ai": "google-generative-ai";
      "google-vertex": "google-vertex";
      ollama: "ollama";
      "openai-chatgpt-responses": "openai-chatgpt-responses";
      "openai-completions": "openai-completions";
      "openai-responses": "openai-responses";
      "pi-messages": "pi-messages";
    }>>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    region: z.ZodOptional<z.ZodString>;
    injectNumCtxForOpenAICompat: z.ZodOptional<z.ZodBoolean>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    localService: z.ZodOptional<z.ZodObject<{
      command: z.ZodString;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      cwd: z.ZodOptional<z.ZodString>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      healthUrl: z.ZodOptional<z.ZodString>;
      readyTimeoutMs: z.ZodOptional<z.ZodNumber>;
      idleStopMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>>;
    authHeader: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>>;
      auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        mode: z.ZodLiteral<"provider-default">;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"authorization-bearer">;
        token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"header">;
        headerName: z.ZodString;
        value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>;
        prefix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>;
      proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        mode: z.ZodLiteral<"env-proxy">;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"explicit-proxy">;
        url: z.ZodString;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>]>>;
      tls: z.ZodOptional<z.ZodObject<{
        ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        serverName: z.ZodOptional<z.ZodString>;
        insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      allowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    models: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      name: z.ZodString;
      api: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "azure-openai-responses": "azure-openai-responses";
        "bedrock-converse-stream": "bedrock-converse-stream";
        "github-copilot": "github-copilot";
        "google-generative-ai": "google-generative-ai";
        "google-vertex": "google-vertex";
        ollama: "ollama";
        "openai-chatgpt-responses": "openai-chatgpt-responses";
        "openai-completions": "openai-completions";
        "openai-responses": "openai-responses";
        "pi-messages": "pi-messages";
      }>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      reasoning: z.ZodOptional<z.ZodBoolean>;
      input: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"text">, z.ZodLiteral<"image">, z.ZodLiteral<"video">, z.ZodLiteral<"audio">]>>>;
      cost: z.ZodOptional<z.ZodObject<{
        input: z.ZodOptional<z.ZodNumber>;
        output: z.ZodOptional<z.ZodNumber>;
        cacheRead: z.ZodOptional<z.ZodNumber>;
        cacheWrite: z.ZodOptional<z.ZodNumber>;
        tieredPricing: z.ZodOptional<z.ZodArray<z.ZodObject<{
          input: z.ZodNumber;
          output: z.ZodNumber;
          cacheRead: z.ZodNumber;
          cacheWrite: z.ZodNumber;
          range: z.ZodUnion<readonly [z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber], null>]>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      contextWindow: z.ZodOptional<z.ZodNumber>;
      contextTokens: z.ZodOptional<z.ZodNumber>;
      maxTokens: z.ZodOptional<z.ZodNumber>;
      thinkingLevelMap: z.ZodOptional<z.ZodObject<{
        off: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        minimal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        low: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        high: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        xhigh: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        max: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      }, z.core.$strict>>;
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      agentRuntime: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      compat: z.ZodOptional<z.ZodObject<{
        supportsStore: z.ZodOptional<z.ZodBoolean>;
        supportsPromptCacheKey: z.ZodOptional<z.ZodBoolean>;
        supportsResponsesContinuation: z.ZodOptional<z.ZodBoolean>;
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoningEffort: z.ZodOptional<z.ZodBoolean>;
        supportsTemperature: z.ZodOptional<z.ZodBoolean>;
        supportsInstructions: z.ZodOptional<z.ZodBoolean>;
        supportsUsageInStreaming: z.ZodOptional<z.ZodBoolean>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        codeMode: z.ZodOptional<z.ZodEnum<{
          capable: "capable";
          preferred: "preferred";
        }>>;
        supportsStrictMode: z.ZodOptional<z.ZodBoolean>;
        supportsJsonSchemaResponseFormat: z.ZodOptional<z.ZodBoolean>;
        requiresStringContent: z.ZodOptional<z.ZodBoolean>;
        strictMessageKeys: z.ZodOptional<z.ZodBoolean>;
        visibleReasoningDetailTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        supportedReasoningEfforts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reasoningEffortMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        maxTokensField: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"max_completion_tokens">, z.ZodLiteral<"max_tokens">]>>;
        thinkingFormat: z.ZodOptional<z.ZodEnum<{
          deepseek: "deepseek";
          openai: "openai";
          openrouter: "openrouter";
          qwen: "qwen";
          "qwen-chat-template": "qwen-chat-template";
          together: "together";
          zai: "zai";
        }>>;
        requiresToolResultName: z.ZodOptional<z.ZodBoolean>;
        requiresAssistantAfterToolResult: z.ZodOptional<z.ZodBoolean>;
        requiresThinkingAsText: z.ZodOptional<z.ZodBoolean>;
        requiresReasoningContentOnAssistantMessages: z.ZodOptional<z.ZodBoolean>;
        toolSchemaProfile: z.ZodOptional<z.ZodString>;
        unsupportedToolSchemaKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
        toolCallArgumentsEncoding: z.ZodOptional<z.ZodString>;
        requiresOpenAiAnthropicToolPayload: z.ZodOptional<z.ZodBoolean>;
        openRouterRouting: z.ZodOptional<z.ZodObject<{
          allow_fallbacks: z.ZodOptional<z.ZodBoolean>;
          require_parameters: z.ZodOptional<z.ZodBoolean>;
          data_collection: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
          }>>;
          zdr: z.ZodOptional<z.ZodBoolean>;
          enforce_distillable_text: z.ZodOptional<z.ZodBoolean>;
          order: z.ZodOptional<z.ZodArray<z.ZodString>>;
          only: z.ZodOptional<z.ZodArray<z.ZodString>>;
          ignore: z.ZodOptional<z.ZodArray<z.ZodString>>;
          quantizations: z.ZodOptional<z.ZodArray<z.ZodString>>;
          sort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            by: z.ZodOptional<z.ZodString>;
            partition: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          }, z.core.$strict>]>>;
          max_price: z.ZodOptional<z.ZodObject<{
            prompt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            completion: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            image: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            audio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            request: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
          }, z.core.$strict>>;
          preferred_min_throughput: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
            p50: z.ZodOptional<z.ZodNumber>;
            p75: z.ZodOptional<z.ZodNumber>;
            p90: z.ZodOptional<z.ZodNumber>;
            p99: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>;
          preferred_max_latency: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
            p50: z.ZodOptional<z.ZodNumber>;
            p75: z.ZodOptional<z.ZodNumber>;
            p90: z.ZodOptional<z.ZodNumber>;
            p99: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>;
        }, z.core.$strict>>;
        vercelGatewayRouting: z.ZodOptional<z.ZodObject<{
          only: z.ZodOptional<z.ZodArray<z.ZodString>>;
          order: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        zaiToolStream: z.ZodOptional<z.ZodBoolean>;
        cacheControlFormat: z.ZodOptional<z.ZodLiteral<"anthropic">>;
        sendSessionAffinityHeaders: z.ZodOptional<z.ZodBoolean>;
        sendSessionIdHeader: z.ZodOptional<z.ZodBoolean>;
        supportsEagerToolInputStreaming: z.ZodOptional<z.ZodBoolean>;
        supportsLongCacheRetention: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      mediaInput: z.ZodOptional<z.ZodObject<{
        image: z.ZodOptional<z.ZodObject<{
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxPixels: z.ZodOptional<z.ZodNumber>;
          maxSidePx: z.ZodOptional<z.ZodNumber>;
          preferredSidePx: z.ZodOptional<z.ZodNumber>;
          tokenMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"tile">, z.ZodLiteral<"detail">, z.ZodLiteral<"provider">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      metadataSource: z.ZodOptional<z.ZodLiteral<"models-add">>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>>;
  catalogRefresh: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const ReplyToModeSchema: z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>;
declare const TypingModeSchema: z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>;
declare const GroupPolicySchema: z.ZodEnum<{
  allowlist: "allowlist";
  disabled: "disabled";
  open: "open";
}>;
declare const DmPolicySchema: z.ZodEnum<{
  allowlist: "allowlist";
  disabled: "disabled";
  open: "open";
  pairing: "pairing";
}>;
declare const ContextVisibilityModeSchema: z.ZodEnum<{
  all: "all";
  allowlist: "allowlist";
  allowlist_quote: "allowlist_quote";
}>;
declare const BlockStreamingCoalesceSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  idleMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const TextChunkModeSchema: z.ZodEnum<{
  length: "length";
  newline: "newline";
}>;
declare const ChannelStreamingBlockSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  coalesce: z.ZodOptional<z.ZodObject<{
    minChars: z.ZodOptional<z.ZodNumber>;
    maxChars: z.ZodOptional<z.ZodNumber>;
    idleMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>;
/** Delivery-only nested streaming config for channels without preview modes. */
declare const ChannelDeliveryStreamingConfigSchema: z.ZodObject<{
  chunkMode: z.ZodOptional<z.ZodEnum<{
    length: "length";
    newline: "newline";
  }>>;
  block: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    coalesce: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      idleMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
declare const ReplyRuntimeConfigSchemaShape: {
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
};
declare const BlockStreamingChunkSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
}, z.core.$strict>;
declare const MarkdownConfigSchema: z.ZodOptional<z.ZodObject<{
  tables: z.ZodOptional<z.ZodEnum<{
    block: "block";
    bullets: "bullets";
    code: "code";
    off: "off";
  }>>;
}, z.core.$strict>>;
declare const TtsConfigSchema: z.ZodOptional<z.ZodObject<{
  auto: z.ZodOptional<z.ZodEnum<{
    always: "always";
    inbound: "inbound";
    off: "off";
    tagged: "tagged";
  }>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  mode: z.ZodOptional<z.ZodEnum<{
    all: "all";
    final: "final";
  }>>;
  provider: z.ZodOptional<z.ZodString>;
  persona: z.ZodOptional<z.ZodString>;
  personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  }, z.core.$strict>>>;
  summaryModel: z.ZodOptional<z.ZodString>;
  modelOverrides: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowText: z.ZodOptional<z.ZodBoolean>;
    allowProvider: z.ZodOptional<z.ZodBoolean>;
    allowVoice: z.ZodOptional<z.ZodBoolean>;
    allowModelId: z.ZodOptional<z.ZodBoolean>;
    allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
    allowNormalization: z.ZodOptional<z.ZodBoolean>;
    allowSeed: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
  }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  maxTextLength: z.ZodOptional<z.ZodNumber>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
declare const HumanDelaySchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
  minMs: z.ZodOptional<z.ZodNumber>;
  maxMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const requireOpenAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
/**
 * Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
 * Without this, all DMs are silently dropped because the allowlist is empty
 * and no senders can match.
 */
declare const requireAllowlistAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: z.RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
declare const MSTeamsReplyStyleSchema: z.ZodEnum<{
  thread: "thread";
  "top-level": "top-level";
}>;
declare const ExecutableTokenSchema: z.ZodString;
//#endregion
export { BroadcastSchema as C, MessagesSchema as D, MentionPatternsPolicySchema as E, ProviderCommandsSchema as O, requireOpenAllowFrom as S, GroupChatSchema as T, SsrFPolicyConfigSchema as _, ContextVisibilityModeSchema as a, TypingModeSchema as b, GroupPolicySchema as c, MarkdownConfigSchema as d, ModelsConfigSchema as f, SecretsConfigSchema as g, SecretProviderSchema as h, ChannelStreamingBlockSchema as i, HumanDelaySchema as l, ReplyToModeSchema as m, BlockStreamingCoalesceSchema as n, DmPolicySchema as o, ReplyRuntimeConfigSchemaShape as p, ChannelDeliveryStreamingConfigSchema as r, ExecutableTokenSchema as s, BlockStreamingChunkSchema as t, MSTeamsReplyStyleSchema as u, TextChunkModeSchema as v, DmConfigSchema as w, requireAllowlistAllowFrom as x, TtsConfigSchema as y };