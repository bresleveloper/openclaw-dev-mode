import { z } from "zod";
import { TSchema } from "typebox";
//#region src/config/zod-schema.agent-entry-base.d.ts
declare const AgentRuntimePolicySchema: z.ZodOptional<z.ZodObject<{
  id: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
declare const AgentEntryBaseSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  agentDir: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  verboseDefault: z.ZodOptional<z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
  }>>;
  toolProgressDetail: z.ZodOptional<z.ZodEnum<{
    explain: "explain";
    raw: "raw";
  }>>;
  reasoningDefault: z.ZodOptional<z.ZodEnum<{
    off: "off";
    on: "on";
    stream: "stream";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
  }, z.core.$strict>>;
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"embedded">;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    acp: z.ZodOptional<z.ZodObject<{
      agent: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      cwd: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.agent-model.d.ts
declare const AgentToolModelSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
  primary: z.ZodOptional<z.ZodString>;
  fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>]>;
//#endregion
//#region src/config/zod-schema.agent-runtime.d.ts
declare const HeartbeatSchema: z.ZodOptional<z.ZodObject<{
  every: z.ZodOptional<z.ZodString>;
  activeHours: z.ZodOptional<z.ZodObject<{
    start: z.ZodOptional<z.ZodString>;
    end: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  model: z.ZodOptional<z.ZodString>;
  session: z.ZodOptional<z.ZodString>;
  target: z.ZodOptional<z.ZodString>;
  directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
  to: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  prompt: z.ZodOptional<z.ZodString>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  lightContext: z.ZodOptional<z.ZodBoolean>;
  isolatedSession: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
declare const AgentContextLimitsSchema: z.ZodOptional<z.ZodObject<{
  memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
  postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
declare const ToolPolicySchema: z.ZodOptional<z.ZodObject<{
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
declare const AgentSandboxSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
  backend: z.ZodOptional<z.ZodString>;
  workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
  sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
  scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
  workspaceRoot: z.ZodOptional<z.ZodString>;
  docker: z.ZodOptional<z.ZodObject<{
    image: z.ZodOptional<z.ZodString>;
    containerPrefix: z.ZodOptional<z.ZodString>;
    workdir: z.ZodOptional<z.ZodString>;
    readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
    tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    network: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
    capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
    pidsLimit: z.ZodOptional<z.ZodNumber>;
    memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    cpus: z.ZodOptional<z.ZodNumber>;
    gpus: z.ZodOptional<z.ZodString>;
    ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
      soft: z.ZodOptional<z.ZodNumber>;
      hard: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>>;
    seccompProfile: z.ZodOptional<z.ZodString>;
    apparmorProfile: z.ZodOptional<z.ZodString>;
    dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
    dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
    dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  ssh: z.ZodOptional<z.ZodObject<{
    target: z.ZodOptional<z.ZodString>;
    command: z.ZodOptional<z.ZodString>;
    workspaceRoot: z.ZodOptional<z.ZodString>;
    strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
    updateHostKeys: z.ZodOptional<z.ZodBoolean>;
    identityFile: z.ZodOptional<z.ZodString>;
    certificateFile: z.ZodOptional<z.ZodString>;
    knownHostsFile: z.ZodOptional<z.ZodString>;
    identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  }, z.core.$strict>>;
  browser: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    image: z.ZodOptional<z.ZodString>;
    containerPrefix: z.ZodOptional<z.ZodString>;
    network: z.ZodOptional<z.ZodString>;
    cdpPort: z.ZodOptional<z.ZodNumber>;
    cdpSourceRange: z.ZodOptional<z.ZodString>;
    vncPort: z.ZodOptional<z.ZodNumber>;
    noVncPort: z.ZodOptional<z.ZodNumber>;
    headless: z.ZodOptional<z.ZodBoolean>;
    noVncEnabled: z.ZodOptional<z.ZodBoolean>;
    allowHostControl: z.ZodOptional<z.ZodBoolean>;
    autoStart: z.ZodOptional<z.ZodBoolean>;
    autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
    binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  prune: z.ZodOptional<z.ZodObject<{
    idleHours: z.ZodOptional<z.ZodNumber>;
    maxAgeDays: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const AgentEntrySchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  agentDir: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  verboseDefault: z.ZodOptional<z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
  }>>;
  toolProgressDetail: z.ZodOptional<z.ZodEnum<{
    explain: "explain";
    raw: "raw";
  }>>;
  reasoningDefault: z.ZodOptional<z.ZodEnum<{
    off: "off";
    on: "on";
    stream: "stream";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
  }, z.core.$strict>>;
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"embedded">;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    acp: z.ZodOptional<z.ZodObject<{
      agent: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      cwd: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>;
  memory: z.ZodOptional<z.ZodObject<{
    search: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
      sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
      extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        path: z.ZodString;
        pattern: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>>;
      multimodal: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      experimental: z.ZodOptional<z.ZodObject<{
        sessionMemory: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      remote: z.ZodOptional<z.ZodObject<{
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
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        batch: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      fallback: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      inputType: z.ZodOptional<z.ZodString>;
      queryInputType: z.ZodOptional<z.ZodString>;
      documentInputType: z.ZodOptional<z.ZodString>;
      outputDimensionality: z.ZodOptional<z.ZodNumber>;
      local: z.ZodOptional<z.ZodObject<{
        modelPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      store: z.ZodOptional<z.ZodObject<{
        fts: z.ZodOptional<z.ZodObject<{
          tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
        }, z.core.$strict>>;
        vector: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          extensionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      query: z.ZodOptional<z.ZodObject<{
        maxResults: z.ZodOptional<z.ZodNumber>;
        minScore: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      cache: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  humanDelay: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
    minMs: z.ZodOptional<z.ZodNumber>;
    maxMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
  tts: z.ZodOptional<z.ZodObject<{
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
    prefsPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  skillsLimits: z.ZodOptional<z.ZodObject<{
    maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  contextLimits: z.ZodOptional<z.ZodObject<{
    memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
    postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  heartbeat: z.ZodOptional<z.ZodObject<{
    every: z.ZodOptional<z.ZodString>;
    activeHours: z.ZodOptional<z.ZodObject<{
      start: z.ZodOptional<z.ZodString>;
      end: z.ZodOptional<z.ZodString>;
      timezone: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    model: z.ZodOptional<z.ZodString>;
    session: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodString>;
    directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
    to: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    lightContext: z.ZodOptional<z.ZodBoolean>;
    isolatedSession: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  identity: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  groupChat: z.ZodOptional<z.ZodObject<{
    mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    unmentionedInbound: z.ZodOptional<z.ZodEnum<{
      room_event: "room_event";
      user_request: "user_request";
    }>>;
  }, z.core.$strict>>;
  sandbox: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
    backend: z.ZodOptional<z.ZodString>;
    workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
    sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
    scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
    workspaceRoot: z.ZodOptional<z.ZodString>;
    docker: z.ZodOptional<z.ZodObject<{
      image: z.ZodOptional<z.ZodString>;
      containerPrefix: z.ZodOptional<z.ZodString>;
      workdir: z.ZodOptional<z.ZodString>;
      readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
      tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      network: z.ZodOptional<z.ZodString>;
      user: z.ZodOptional<z.ZodString>;
      capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
      pidsLimit: z.ZodOptional<z.ZodNumber>;
      memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      cpus: z.ZodOptional<z.ZodNumber>;
      gpus: z.ZodOptional<z.ZodString>;
      ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
        soft: z.ZodOptional<z.ZodNumber>;
        hard: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>>;
      seccompProfile: z.ZodOptional<z.ZodString>;
      apparmorProfile: z.ZodOptional<z.ZodString>;
      dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
      extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
      binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
      dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
      dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
      dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    ssh: z.ZodOptional<z.ZodObject<{
      target: z.ZodOptional<z.ZodString>;
      command: z.ZodOptional<z.ZodString>;
      workspaceRoot: z.ZodOptional<z.ZodString>;
      strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
      updateHostKeys: z.ZodOptional<z.ZodBoolean>;
      identityFile: z.ZodOptional<z.ZodString>;
      certificateFile: z.ZodOptional<z.ZodString>;
      knownHostsFile: z.ZodOptional<z.ZodString>;
      identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strict>>;
    browser: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      image: z.ZodOptional<z.ZodString>;
      containerPrefix: z.ZodOptional<z.ZodString>;
      network: z.ZodOptional<z.ZodString>;
      cdpPort: z.ZodOptional<z.ZodNumber>;
      cdpSourceRange: z.ZodOptional<z.ZodString>;
      vncPort: z.ZodOptional<z.ZodNumber>;
      noVncPort: z.ZodOptional<z.ZodNumber>;
      headless: z.ZodOptional<z.ZodBoolean>;
      noVncEnabled: z.ZodOptional<z.ZodBoolean>;
      allowHostControl: z.ZodOptional<z.ZodBoolean>;
      autoStart: z.ZodOptional<z.ZodBoolean>;
      autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
      binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    prune: z.ZodOptional<z.ZodObject<{
      idleHours: z.ZodOptional<z.ZodNumber>;
      maxAgeDays: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  tools: z.ZodOptional<z.ZodObject<{
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    }, z.core.$strict>>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      executor: z.ZodOptional<z.ZodEnum<{
        node: "node";
        quickjs: "quickjs";
      }>>;
      mode: z.ZodOptional<z.ZodLiteral<"only">>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
      maxOutputBytes: z.ZodOptional<z.ZodNumber>;
      maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
      maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
      snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
      maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
      waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
      defaultAgentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    elevated: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
    }, z.core.$strict>>;
    exec: z.ZodOptional<z.ZodObject<{
      host: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        gateway: "gateway";
        node: "node";
        sandbox: "sandbox";
      }>>;
      mode: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        ask: "ask";
        auto: "auto";
        deny: "deny";
        full: "full";
      }>>;
      security: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        deny: "deny";
        full: "full";
      }>>;
      ask: z.ZodOptional<z.ZodEnum<{
        always: "always";
        off: "off";
        "on-miss": "on-miss";
      }>>;
      node: z.ZodOptional<z.ZodString>;
      pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      strictInlineEval: z.ZodOptional<z.ZodBoolean>;
      commandHighlighting: z.ZodOptional<z.ZodBoolean>;
      grantExpiryDays: z.ZodOptional<z.ZodNumber>;
      safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        minPositional: z.ZodOptional<z.ZodNumber>;
        maxPositional: z.ZodOptional<z.ZodNumber>;
        allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>;
      reviewer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodEnum<{
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          xhigh: "xhigh";
        }>>;
        fastMode: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      backgroundMs: z.ZodOptional<z.ZodNumber>;
      approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cleanupMs: z.ZodOptional<z.ZodNumber>;
      notifyOnExit: z.ZodOptional<z.ZodBoolean>;
      notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
      applyPatch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    github: z.ZodOptional<z.ZodObject<{
      profileId: z.ZodString;
      kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
      gitAuthor: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    fs: z.ZodOptional<z.ZodObject<{
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    loopDetection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    message: z.ZodOptional<z.ZodObject<{
      crossContext: z.ZodOptional<z.ZodObject<{
        allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
        allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
        marker: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          prefix: z.ZodOptional<z.ZodString>;
          suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      actions: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      broadcast: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
declare const ToolsSchema: z.ZodOptional<z.ZodObject<{
  profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
  }, z.core.$strict>>>;
  toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>>>;
  web: z.ZodOptional<z.ZodObject<{
    search: z.ZodOptional<z.ZodPreprocess<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      provider: z.ZodOptional<z.ZodString>;
      maxResults: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
      openaiCodex: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"cached">, z.ZodLiteral<"live">]>>;
        allowedDomains: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[] | undefined, string[]>>>;
        contextSize: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
        userLocation: z.ZodOptional<z.ZodPipe<z.ZodObject<{
          country: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          region: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          timezone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
        }, z.core.$strict>, z.ZodTransform<{
          country?: string | undefined;
          region?: string | undefined;
          city?: string | undefined;
          timezone?: string | undefined;
        } | undefined, {
          country?: string | undefined;
          region?: string | undefined;
          city?: string | undefined;
          timezone?: string | undefined;
        }>>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>, unknown>>;
    fetch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      provider: z.ZodOptional<z.ZodString>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      maxCharsCap: z.ZodOptional<z.ZodNumber>;
      maxResponseBytes: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
      maxRedirects: z.ZodOptional<z.ZodNumber>;
      userAgent: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      readability: z.ZodOptional<z.ZodBoolean>;
      useTrustedEnvProxy: z.ZodOptional<z.ZodBoolean>;
      ssrfPolicy: z.ZodOptional<z.ZodObject<{
        dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
        allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
        allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
        allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  github: z.ZodOptional<z.ZodObject<{
    profileId: z.ZodString;
    kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
    gitAuthor: z.ZodOptional<z.ZodObject<{
      name: z.ZodOptional<z.ZodString>;
      email: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  media: z.ZodOptional<z.ZodObject<{
    models: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      capabilities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"video">]>>>;
      type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"provider">, z.ZodLiteral<"cli">]>>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      profile: z.ZodOptional<z.ZodString>;
      preferredProfile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    concurrency: z.ZodOptional<z.ZodNumber>;
    image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
    audio: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
      echoTranscript: z.ZodOptional<z.ZodBoolean>;
      echoFormat: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    video: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  links: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    scope: z.ZodOptional<z.ZodObject<{
      default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
        match: z.ZodOptional<z.ZodObject<{
          channel: z.ZodOptional<z.ZodString>;
          chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
          keyPrefix: z.ZodOptional<z.ZodString>;
          rawKeyPrefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    maxLinks: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    models: z.ZodOptional<z.ZodArray<z.ZodObject<{
      type: z.ZodOptional<z.ZodLiteral<"cli">>;
      command: z.ZodString;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  sessions: z.ZodOptional<z.ZodObject<{
    visibility: z.ZodOptional<z.ZodEnum<{
      agent: "agent";
      all: "all";
      self: "self";
      tree: "tree";
    }>>;
  }, z.core.$strict>>;
  loopDetection: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  toolSearch: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodEnum<{
      code: "code";
      directory: "directory";
      tools: "tools";
    }>>;
    codeTimeoutMs: z.ZodOptional<z.ZodNumber>;
    searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
    maxSearchLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
    executor: z.ZodOptional<z.ZodEnum<{
      node: "node";
      quickjs: "quickjs";
    }>>;
    mode: z.ZodOptional<z.ZodLiteral<"only">>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
    maxOutputBytes: z.ZodOptional<z.ZodNumber>;
    maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
    maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
    snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
    searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
    maxSearchLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    maxConcurrent: z.ZodOptional<z.ZodNumber>;
    maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
    maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
    waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
    defaultAgentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>]>>;
  message: z.ZodOptional<z.ZodObject<{
    crossContext: z.ZodOptional<z.ZodObject<{
      allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
      allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
      marker: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        prefix: z.ZodOptional<z.ZodString>;
        suffix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    actions: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    broadcast: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  agentToAgent: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  elevated: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
  }, z.core.$strict>>;
  exec: z.ZodOptional<z.ZodObject<{
    host: z.ZodOptional<z.ZodEnum<{
      auto: "auto";
      gateway: "gateway";
      node: "node";
      sandbox: "sandbox";
    }>>;
    mode: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      ask: "ask";
      auto: "auto";
      deny: "deny";
      full: "full";
    }>>;
    security: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      deny: "deny";
      full: "full";
    }>>;
    ask: z.ZodOptional<z.ZodEnum<{
      always: "always";
      off: "off";
      "on-miss": "on-miss";
    }>>;
    node: z.ZodOptional<z.ZodString>;
    pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
    safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    strictInlineEval: z.ZodOptional<z.ZodBoolean>;
    commandHighlighting: z.ZodOptional<z.ZodBoolean>;
    grantExpiryDays: z.ZodOptional<z.ZodNumber>;
    safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      minPositional: z.ZodOptional<z.ZodNumber>;
      maxPositional: z.ZodOptional<z.ZodNumber>;
      allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    reviewer: z.ZodOptional<z.ZodObject<{
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      thinking: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        xhigh: "xhigh";
      }>>;
      fastMode: z.ZodOptional<z.ZodBoolean>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    backgroundMs: z.ZodOptional<z.ZodNumber>;
    approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    cleanupMs: z.ZodOptional<z.ZodNumber>;
    notifyOnExit: z.ZodOptional<z.ZodBoolean>;
    notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
    applyPatch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
      allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  fs: z.ZodOptional<z.ZodObject<{
    workspaceOnly: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  subagents: z.ZodOptional<z.ZodObject<{
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  sandbox: z.ZodOptional<z.ZodObject<{
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  sessions_spawn: z.ZodOptional<z.ZodObject<{
    attachments: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxTotalBytes: z.ZodOptional<z.ZodNumber>;
      maxFiles: z.ZodOptional<z.ZodNumber>;
      maxFileBytes: z.ZodOptional<z.ZodNumber>;
      retainOnSessionKeep: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  updatePlan: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.agents-shared.d.ts
/** Tool-specific model selector with an optional capability timeout override. */
type AgentToolModelConfig = z.input<typeof AgentToolModelSchema>;
/** Runtime selection policy attached to providers, models, and agent defaults. */
type AgentRuntimePolicyConfig = NonNullable<z.input<typeof AgentRuntimePolicySchema>>;
/** Per-agent sandbox policy shared by embedded agents and sandbox backends. */
type AgentSandboxConfig = NonNullable<z.output<typeof AgentSandboxSchema>>;
//#endregion
//#region src/config/zod-schema.channel-bot-loop.d.ts
declare const ChannelBotLoopProtectionSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
  windowSeconds: z.ZodOptional<z.ZodNumber>;
  cooldownSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.channel-messaging-common.d.ts
declare const ChannelStreamingPreviewSchema: z.ZodObject<{
  chunk: z.ZodOptional<z.ZodObject<{
    minChars: z.ZodOptional<z.ZodNumber>;
    maxChars: z.ZodOptional<z.ZodNumber>;
    breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
  }, z.core.$strict>>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    raw: "raw";
    status: "status";
  }>>;
}, z.core.$strict>;
declare const ChannelStreamingProgressSchema: z.ZodObject<{
  label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
  labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
  maxLines: z.ZodOptional<z.ZodNumber>;
  maxLineChars: z.ZodOptional<z.ZodNumber>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    raw: "raw";
    status: "status";
  }>>;
  commentary: z.ZodOptional<z.ZodBoolean>;
  narration: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
declare const ChannelPreviewStreamingConfigSchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodEnum<{
    block: "block";
    off: "off";
    partial: "partial";
    progress: "progress";
  }>>;
  chunkMode: z.ZodOptional<z.ZodEnum<{
    length: "length";
    newline: "newline";
  }>>;
  preview: z.ZodOptional<z.ZodObject<{
    chunk: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
    }, z.core.$strict>>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      raw: "raw";
      status: "status";
    }>>;
  }, z.core.$strict>>;
  progress: z.ZodOptional<z.ZodObject<{
    label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxLines: z.ZodOptional<z.ZodNumber>;
    maxLineChars: z.ZodOptional<z.ZodNumber>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      raw: "raw";
      status: "status";
    }>>;
    commentary: z.ZodOptional<z.ZodBoolean>;
    narration: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  block: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    coalesce: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      idleMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
/** Canonical optional account contract shared by bundled messaging channels. */
declare const CommonChannelAccountSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
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
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
}, z.core.$strict>;
//#endregion
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
//#endregion
//#region src/config/zod-schema.logging.d.ts
declare const DiagnosticsConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  flags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  otel: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    endpoint: z.ZodOptional<z.ZodString>;
    tracesEndpoint: z.ZodOptional<z.ZodString>;
    metricsEndpoint: z.ZodOptional<z.ZodString>;
    logsEndpoint: z.ZodOptional<z.ZodString>;
    protocol: z.ZodOptional<z.ZodLiteral<"http/protobuf">>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    serviceName: z.ZodOptional<z.ZodString>;
    metricNamePrefix: z.ZodOptional<z.ZodString>;
    traces: z.ZodOptional<z.ZodBoolean>;
    metrics: z.ZodOptional<z.ZodBoolean>;
    logs: z.ZodOptional<z.ZodBoolean>;
    logsExporter: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"otlp">, z.ZodLiteral<"stdout">, z.ZodLiteral<"both">]>>;
    sampleRate: z.ZodOptional<z.ZodNumber>;
    flushIntervalMs: z.ZodOptional<z.ZodNumber>;
    captureContent: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  cacheTrace: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const LoggingConfigSchema: z.ZodOptional<z.ZodObject<{
  level: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
  file: z.ZodOptional<z.ZodString>;
  maxFileBytes: z.ZodOptional<z.ZodNumber>;
  consoleLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
  consoleStyle: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pretty">, z.ZodLiteral<"json">]>>;
  redactPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
  audit: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    executionIdentity: z.ZodOptional<z.ZodBoolean>;
    messages: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"direct">, z.ZodLiteral<"all">]>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/zod-schema.session-config.d.ts
declare const SessionSchema: z.ZodOptional<z.ZodObject<{
  scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"per-sender">, z.ZodLiteral<"global">]>>;
  dmScope: z.ZodOptional<z.ZodEnum<{
    main: "main";
    "per-account-channel-peer": "per-account-channel-peer";
    "per-channel-peer": "per-channel-peer";
    "per-peer": "per-peer";
  }>>;
  groupScope: z.ZodOptional<z.ZodEnum<{
    main: "main";
    "per-group": "per-group";
  }>>;
  notifyOnCreate: z.ZodOptional<z.ZodBoolean>;
  identityLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
  resetTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
  reset: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
    atHour: z.ZodOptional<z.ZodNumber>;
    idleMinutes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  resetByType: z.ZodOptional<z.ZodObject<{
    direct: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    group: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    thread: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  resetByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
    atHour: z.ZodOptional<z.ZodNumber>;
    idleMinutes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>;
  store: z.ZodOptional<z.ZodString>;
  mainKey: z.ZodOptional<z.ZodString>;
  sendPolicy: z.ZodOptional<z.ZodOptional<z.ZodObject<{
    default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
      action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
      match: z.ZodOptional<z.ZodObject<{
        channel: z.ZodOptional<z.ZodString>;
        chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
        keyPrefix: z.ZodOptional<z.ZodString>;
        rawKeyPrefix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>>;
  threadBindings: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    idleHours: z.ZodOptional<z.ZodNumber>;
    maxAgeHours: z.ZodOptional<z.ZodNumber>;
    spawnSessions: z.ZodOptional<z.ZodBoolean>;
    defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
      fork: "fork";
      isolated: "isolated";
    }>>;
  }, z.core.$strict>>;
  sharing: z.ZodOptional<z.ZodObject<{
    readOnly: z.ZodOptional<z.ZodBoolean>;
    suggest: z.ZodOptional<z.ZodBoolean>;
    drafts: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  maintenance: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      enforce: "enforce";
      warn: "warn";
    }>>;
    coldStorage: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      afterDays: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    pruneAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    archiveDashboardAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>, z.ZodLiteral<0>]>>;
    maxEntries: z.ZodOptional<z.ZodNumber>;
    preserveRecent: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
    resetArchiveRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
    maxDiskBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodLiteral<false>]>>;
    highWaterBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.base.d.ts
/** Typing indicator timing policy shared by channel configs. */
type TypingMode = z.input<typeof TypingModeSchema>;
/** Session-key ownership model for inbound messages. */
type SessionScope = "per-sender" | "global";
/** DM session-key granularity across peers, channels, and accounts. */
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
type GroupScope = "main" | "per-group";
/** Which source messages outbound replies should thread or quote against. */
type ReplyToMode = z.input<typeof ReplyToModeSchema>;
/** Group-chat admission policy for channels with allowlists. */
type GroupPolicy = z.input<typeof GroupPolicySchema>;
/** Direct-message admission policy for channels with pairing/allowlists. */
type DmPolicy = z.input<typeof DmPolicySchema>;
/** How much non-allowlisted context is visible to an agent. */
type ContextVisibilityMode = z.input<typeof ContextVisibilityModeSchema>;
type BlockStreamingCoalesceConfig = z.input<typeof BlockStreamingCoalesceSchema>;
type BlockStreamingChunkConfig = z.input<typeof BlockStreamingChunkSchema>;
type ChannelStreamingProgressConfig = z.input<typeof ChannelStreamingProgressSchema>;
type ChannelStreamingPreviewConfig = z.input<typeof ChannelStreamingPreviewSchema>;
type SchemaChannelStreamingConfig = z.input<typeof ChannelPreviewStreamingConfigSchema>;
type ChannelStreamingConfig<TProgress extends ChannelStreamingProgressConfig = ChannelStreamingProgressConfig> = Omit<SchemaChannelStreamingConfig, "progress"> & {
  /** Prefer a channel's native streaming transport over its portable draft path. */
  nativeTransport?: boolean;
  progress?: TProgress;
};
type ChannelDeliveryStreamingConfig = z.input<typeof ChannelDeliveryStreamingConfigSchema>;
/** Streaming subset used by channels that render visible preview/progress replies. */
type ChannelPreviewStreamingConfig = Pick<ChannelStreamingConfig, "mode" | "chunkMode" | "preview" | "progress" | "block">;
type MarkdownConfig = NonNullable<z.input<typeof MarkdownConfigSchema>>;
type MarkdownTableMode = NonNullable<MarkdownConfig["tables"]>;
type HumanDelayConfig = z.input<typeof HumanDelaySchema>;
type SessionSchemaInput = NonNullable<z.input<typeof SessionSchema>>;
type SessionThreadBindingsConfig = NonNullable<SessionSchemaInput["threadBindings"]>;
type SessionConfig = SessionSchemaInput;
type SessionMaintenanceConfig = NonNullable<SessionSchemaInput["maintenance"]>;
type SessionMaintenanceMode = NonNullable<SessionMaintenanceConfig["mode"]>;
type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;
type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string;
  /** Avatar image: workspace-relative path, http(s) URL, or data URI. */
  avatar?: string;
};
type LoggingConfig = NonNullable<z.input<typeof LoggingConfigSchema>>;
type DiagnosticsConfig = NonNullable<z.input<typeof DiagnosticsConfigSchema>>;
type AuditConfig = NonNullable<LoggingConfig["audit"]>;
//#endregion
//#region src/config/zod-schema.agent-defaults-base.d.ts
declare const AgentDefaultsBaseSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  modelSelectionScope: z.ZodOptional<z.ZodEnum<{
    agent: "agent";
    global: "global";
    session: "session";
  }>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  imageModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  mediaModels: z.ZodOptional<z.ZodObject<{
    image: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    video: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    music: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
  }, z.core.$strict>>;
  voiceModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  pdfModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  pdfMaxMb: z.ZodOptional<z.ZodNumber>;
  pdfMaxPages: z.ZodOptional<z.ZodNumber>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  silentReply: z.ZodOptional<z.ZodObject<{
    group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
    internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
  }, z.core.$strict>>;
  repoRoot: z.ZodOptional<z.ZodString>;
  skipBootstrap: z.ZodOptional<z.ZodBoolean>;
  skipOptionalBootstrapFiles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
    "HEARTBEAT.md": "HEARTBEAT.md";
    "IDENTITY.md": "IDENTITY.md";
    "SOUL.md": "SOUL.md";
    "USER.md": "USER.md";
  }>>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  userTimezone: z.ZodOptional<z.ZodString>;
  startupContext: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    applyOn: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"new">, z.ZodLiteral<"reset">]>>>;
    dailyMemoryDays: z.ZodOptional<z.ZodNumber>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
    maxFileChars: z.ZodOptional<z.ZodNumber>;
    maxTotalChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  contextPruning: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"cache-ttl">]>>;
    ttl: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    hardClear: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      placeholder: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  compaction: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"safeguard">]>>;
    provider: z.ZodOptional<z.ZodString>;
    thinkingLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      adaptive: "adaptive";
      high: "high";
      low: "low";
      max: "max";
      medium: "medium";
      minimal: "minimal";
      off: "off";
      ultra: "ultra";
      xhigh: "xhigh";
    }>, z.ZodLiteral<"inherit">]>>;
    keepRecentTokens: z.ZodOptional<z.ZodNumber>;
    identifierPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"off">]>>;
    recentTurnsPreserve: z.ZodOptional<z.ZodNumber>;
    qualityGuard: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxRetries: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    midTurnPrecheck: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    postIndexSync: z.ZodOptional<z.ZodEnum<{
      async: "async";
      await: "await";
      off: "off";
    }>>;
    postCompactionSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodString>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    memoryFlush: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      model: z.ZodOptional<z.ZodString>;
      softThresholdTokens: z.ZodOptional<z.ZodNumber>;
      forceFlushTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    }, z.core.$strict>>;
    maxActiveTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    notifyUser: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    projectSettingsPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"trusted">, z.ZodLiteral<"sanitize">, z.ZodLiteral<"ignore">]>>;
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
    cyberFailover: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"off">]>>;
      model: z.ZodOptional<z.ZodString>;
      cooloffMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  verboseDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"full">]>>;
  toolProgressDetail: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"explain">, z.ZodLiteral<"raw">]>>;
  reasoningDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"stream">]>>;
  elevatedDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"ask">, z.ZodLiteral<"full">]>>;
  blockStreamingDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
  blockStreamingBreak: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"text_end">, z.ZodLiteral<"message_end">]>>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  imageMaxDimensionPx: z.ZodOptional<z.ZodNumber>;
  imageQuality: z.ZodOptional<z.ZodEnum<{
    auto: "auto";
    balanced: "balanced";
    efficient: "efficient";
    high: "high";
  }>>;
  typingIntervalSeconds: z.ZodOptional<z.ZodNumber>;
  systemAgent: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  authInheritance: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  sessionStore: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  maxConcurrent: z.ZodOptional<z.ZodNumber>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxConcurrent: z.ZodOptional<z.ZodNumber>;
    maxSpawnDepth: z.ZodOptional<z.ZodNumber>;
    maxChildrenPerAgent: z.ZodOptional<z.ZodNumber>;
    archiveAfterMinutes: z.ZodOptional<z.ZodNumber>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    runTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
    announceTimeoutMs: z.ZodOptional<z.ZodNumber>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.agent-defaults.d.ts
type SchemaAgentDefaultsConfig = z.input<typeof AgentDefaultsBaseSchema>;
type AgentModelEntryConfig = NonNullable<SchemaAgentDefaultsConfig["models"]>[string];
type AgentContextLimitsConfig = NonNullable<z.input<typeof AgentContextLimitsSchema>>;
type AgentDefaultsConfig = SchemaAgentDefaultsConfig & {
  /** @deprecated Doctor-only legacy input. */
  imageGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  videoGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  musicGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimezone?: string;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimestamp?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  envelopeElapsed?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  timeFormat?: "auto" | "12" | "24";
  /** @deprecated Doctor-only legacy input. */
  promptOverlays?: {
    gpt5?: {
      personality?: "friendly" | "on" | "off";
    };
  };
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentRuntimePolicyConfig;
  contextLimits?: AgentContextLimitsConfig;
  blockStreamingChunk?: BlockStreamingChunkConfig;
  blockStreamingCoalesce?: BlockStreamingCoalesceConfig;
  humanDelay?: HumanDelayConfig;
  typingMode?: TypingMode;
  heartbeat?: NonNullable<z.input<typeof HeartbeatSchema>> & {
    agentId?: string;
  };
  sandbox?: AgentSandboxConfig;
};
//#endregion
//#region src/config/zod-schema.memory-search.d.ts
declare const MemorySearchSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
  sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
  extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    path: z.ZodString;
    pattern: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>]>>>;
  multimodal: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  experimental: z.ZodOptional<z.ZodObject<{
    sessionMemory: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  provider: z.ZodOptional<z.ZodString>;
  remote: z.ZodOptional<z.ZodObject<{
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
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    batch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  fallback: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodString>;
  inputType: z.ZodOptional<z.ZodString>;
  queryInputType: z.ZodOptional<z.ZodString>;
  documentInputType: z.ZodOptional<z.ZodString>;
  outputDimensionality: z.ZodOptional<z.ZodNumber>;
  local: z.ZodOptional<z.ZodObject<{
    modelPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  store: z.ZodOptional<z.ZodObject<{
    fts: z.ZodOptional<z.ZodObject<{
      tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
    }, z.core.$strict>>;
    vector: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      extensionPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  query: z.ZodOptional<z.ZodObject<{
    maxResults: z.ZodOptional<z.ZodNumber>;
    minScore: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  cache: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
type MemorySearchConfigInput = NonNullable<z.input<typeof MemorySearchSchema>>;
//#endregion
//#region src/config/types.memory.d.ts
/** Citation rendering mode for memory-injected context. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** Top-level memory config block. */
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  /** Shared embedding/search defaults. Per-agent overrides live under agents.entries.*.memory.search. */
  search?: MemorySearchConfig;
};
type MemorySearchConfig = Omit<MemorySearchConfigInput, "store"> & {
  /** Preserve legacy embedding-cache authoring accepted by Doctor migrations. */
  store?: NonNullable<MemorySearchConfigInput["store"]> & {
    cache?: {
      enabled?: boolean;
      maxEntries?: number;
    };
  };
};
//#endregion
//#region src/config/types.messages.d.ts
type DefinedSchemaInput<T extends z.ZodType> = NonNullable<z.input<T>>;
type MentionPatternsPolicyConfig = DefinedSchemaInput<typeof MentionPatternsPolicySchema>;
type GroupChatSchemaInput = DefinedSchemaInput<typeof GroupChatSchema>;
type GroupChatConfig = Omit<GroupChatSchemaInput, "visibleReplies"> & {
  visibleReplies?: "automatic" | "message_tool";
};
type DmConfig = DefinedSchemaInput<typeof DmConfigSchema>;
type BroadcastGroupConfig = Exclude<DefinedSchemaInput<typeof BroadcastSchema>[string], string[]>;
type BroadcastEntry = string[] | BroadcastGroupConfig;
type BroadcastStrategy = NonNullable<DefinedSchemaInput<typeof BroadcastSchema>["strategy"]>;
type BroadcastConfig = {
  strategy?: BroadcastStrategy;
  /**
   * Map channel-qualified peer IDs to participant arrays or bounded group options.
   * Unqualified WhatsApp peer arrays retain single-pass behavior.
   *
   * Note: the index signature includes `undefined` so `strategy?: ...` remains type-safe.
   */
  [peerId: string]: BroadcastEntry | BroadcastStrategy | undefined;
};
type MessagesSchemaInput = DefinedSchemaInput<typeof MessagesSchema>;
type MessagesConfig = Omit<MessagesSchemaInput, "groupChat" | "visibleReplies"> & {
  /** @deprecated Doctor-only legacy input. */
  removeAckAfterReply?: boolean;
  visibleReplies?: "automatic" | "message_tool";
  groupChat?: GroupChatConfig;
};
type NativeCommandsSetting = boolean | "auto";
type CommandAllowFrom = Record<string, Array<string | number>>;
type CommandsConfig = {
  /** @deprecated Doctor-only legacy input. */
  ownerDisplay?: "raw" | "hash";
  /** @deprecated Doctor-only legacy input. */
  ownerDisplaySecret?: string;
  native?: NativeCommandsSetting;
  nativeSkills?: NativeCommandsSetting;
  text?: boolean;
  bash?: boolean;
  bashForegroundMs?: number;
  config?: boolean;
  mcp?: boolean;
  plugins?: boolean;
  debug?: boolean;
  restart?: boolean;
  ownerAllowFrom?: Array<string | number>;
  allowFrom?: CommandAllowFrom;
};
type ProviderCommandsConfig = DefinedSchemaInput<typeof ProviderCommandsSchema>;
//#endregion
//#region src/secrets/ref-contract.d.ts
/** Supported secret reference backends in config. */
type SecretRefSource = "env" | "file" | "exec" | "store";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 * - store source: provider "default", id "OPENAI_API_KEY"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
//#endregion
//#region src/config/types.secrets.d.ts
type SecretsConfig = NonNullable<z.input<typeof SecretsConfigSchema>>;
//#endregion
//#region src/config/types.bot-loop-protection.d.ts
type ChannelBotLoopProtectionConfig = z.input<typeof ChannelBotLoopProtectionSchema>;
//#endregion
//#region src/config/zod-schema.channels.d.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
declare const ChannelHeartbeatVisibilitySchema: z.ZodOptional<z.ZodObject<{
  showOk: z.ZodOptional<z.ZodBoolean>;
  showAlerts: z.ZodOptional<z.ZodBoolean>;
  useIndicator: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.channel-health.d.ts
type ChannelHeartbeatVisibilityConfig = NonNullable<z.input<typeof ChannelHeartbeatVisibilitySchema>>;
//#endregion
//#region src/config/zod-schema.approvals.d.ts
/** Native exec approval mode accepted by config. */
declare const NativeExecApprovalEnableModeSchema: z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>;
declare const ApprovalsSchema: z.ZodOptional<z.ZodObject<{
  exec: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
    agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
      channel: z.ZodString;
      to: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  plugin: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
    agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
      channel: z.ZodString;
      to: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.approvals.d.ts
type NativeExecApprovalEnableMode = z.input<typeof NativeExecApprovalEnableModeSchema>;
type ApprovalsConfig = NonNullable<z.input<typeof ApprovalsSchema>>;
//#endregion
//#region src/config/types.channel-messaging-common.d.ts
type SchemaCommonChannelMessagingConfig = z.input<typeof CommonChannelAccountSchema>;
type CommonChannelMessagingConfig<TCapabilities = string[], TAllowFromEntry = string | number, TDefaultTo = string, TStreaming = ChannelDeliveryStreamingConfig> = Omit<SchemaCommonChannelMessagingConfig, "capabilities" | "allowFrom" | "defaultTo" | "groupAllowFrom" | "dms" | "streaming"> & {
  capabilities?: TCapabilities;
  allowFrom?: TAllowFromEntry[];
  defaultTo?: TDefaultTo;
  groupAllowFrom?: TAllowFromEntry[];
  dms?: Record<string, DmConfig>;
  streaming?: TStreaming;
  /** @deprecated Doctor-only legacy input. */
  heartbeat?: ChannelHeartbeatVisibilityConfig;
};
type ChannelExecApprovalTarget = "dm" | "channel" | "both";
type ChannelExecApprovalConfig<TApprover = string | number> = {
  enabled?: NativeExecApprovalEnableMode;
  approvers?: TApprover[];
  agentFilter?: string[];
  sessionFilter?: string[];
  target?: ChannelExecApprovalTarget;
};
type ChannelBotInteractionConfig<TAllowBots = boolean | "mentions"> = {
  allowBots?: TAllowBots;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  dangerouslyAllowNameMatching?: boolean;
};
type ChannelReadReceiptConfig = {
  sendReadReceipts?: boolean;
};
type ChannelReactionConfig<TNotification = never, TLevel = never, TAckReaction = never, TAllowlist extends boolean = false> = {
  reactionNotifications?: TNotification;
  reactionLevel?: TLevel;
  ackReaction?: TAckReaction;
} & (TAllowlist extends true ? {
  reactionAllowlist?: Array<string | number>;
} : Record<never, never>);
//#endregion
//#region src/config/types.discord-presence.d.ts
type DiscordPresenceEventsConfig = {
  /** Enable online-presence system events for this guild. Default: true when configured. */
  enabled?: boolean;
  /** Discord channel ID that receives the routed agent wake. */
  channelId: string;
  /** Optional immutable Discord user ID allowlist. Omit to include all human members. */
  users?: string[];
  /**
   * Suppress presence-derived online events for this many seconds after a new Gateway
   * session while guild presence state is rebuilt. 0 disables. Default: 300.
   */
  reconnectSuppressSeconds?: number;
  /** Maximum queued online events for this guild per burst window. Default: 8. */
  burstLimit?: number;
  /** Sliding burst-detection window in seconds. Default: 60. */
  burstWindowSeconds?: number;
};
//#endregion
//#region src/infra/exec-safe-bin-policy-profiles.d.ts
type SafeBinProfileFixture = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: readonly string[];
  deniedFlags?: readonly string[];
};
//#endregion
//#region src/config/types.provider-request.d.ts
/** Authentication override applied to provider requests after model/provider defaults resolve. */
type ConfiguredProviderRequestAuth = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: SecretInput;
} | {
  mode: "header";
  headerName: string;
  value: SecretInput;
  prefix?: string;
};
/** TLS material and verification knobs for provider or proxy connections. */
type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy selection for provider requests, including optional TLS settings for proxy transport. */
type ConfiguredProviderRequestProxy = {
  mode: "env-proxy";
  tls?: ConfiguredProviderRequestTls;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ConfiguredProviderRequestTls;
};
/** Shared provider request overrides used by model providers and media/tool providers. */
type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};
/** Model-provider request overrides plus the private-network opt-in used by model transports. */
type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/config/types.tools.d.ts
type SchemaToolsConfig = NonNullable<z.input<typeof ToolsSchema>>;
type ParsedToolsConfig = NonNullable<z.output<typeof ToolsSchema>>;
type SchemaMediaConfig = NonNullable<SchemaToolsConfig["media"]>;
type SchemaAudioConfig = NonNullable<SchemaMediaConfig["audio"]>;
type MediaUnderstandingScopeConfig = NonNullable<SchemaAudioConfig["scope"]>;
type MediaUnderstandingModelConfig = Omit<NonNullable<NonNullable<SchemaMediaConfig["models"]>[number]>, "request"> & {
  request?: ConfiguredProviderRequest;
};
type MediaUnderstandingConfig = Omit<SchemaAudioConfig, "scope" | "request"> & {
  scope?: MediaUnderstandingScopeConfig;
  request?: ConfiguredProviderRequest;
  /** Ordered model list (fallbacks in order). */
  models?: MediaUnderstandingModelConfig[];
};
/** Per-capability defaults and policy. Models live only in tools.media.models. */
type MediaUnderstandingCapabilityConfig = Omit<MediaUnderstandingConfig, "models">;
type LinkToolsConfig = Omit<NonNullable<SchemaToolsConfig["links"]>, "scope"> & {
  scope?: MediaUnderstandingScopeConfig;
};
type MediaToolsConfig = {
  /** Canonical model list for image/audio/video, selected by capability tags. */
  models?: MediaUnderstandingModelConfig[];
  /** Max concurrent media understanding runs. */
  concurrency?: number;
  image?: MediaUnderstandingCapabilityConfig;
  audio?: MediaUnderstandingCapabilityConfig;
  video?: MediaUnderstandingCapabilityConfig;
};
type ToolProfileId = NonNullable<SchemaToolsConfig["profile"]>;
type ToolLoopDetectionConfig = NonNullable<SchemaToolsConfig["loopDetection"]>;
type ToolAllowDenyPolicyConfig = NonNullable<z.input<typeof ToolPolicySchema>>;
type GroupToolPolicyConfig = ToolAllowDenyPolicyConfig;
/**
 * Per-sender overrides.
 *
 * Prefer explicit key prefixes:
 * - channel:<channelId>:<senderId>
 * - id:<senderId>
 * - e164:<phone>
 * - username:<handle>
 * - name:<display-name>
 * - * (wildcard)
 *
 * Legacy unprefixed keys are supported for backward compatibility and are matched as senderId only.
 */
type GroupToolPolicyBySenderConfig = Record<string, GroupToolPolicyConfig>;
type ExecToolConfig = Omit<NonNullable<SchemaToolsConfig["exec"]>, "safeBinProfiles"> & {
  /** Preserve readonly authoring fixtures accepted by the safe-bin policy owner. */
  safeBinProfiles?: Record<string, SafeBinProfileFixture>;
};
type AgentToolsConfig = Omit<NonNullable<z.input<typeof AgentEntrySchema>["tools"]>, "toolsBySender" | "exec" | "elevated"> & {
  toolsBySender?: GroupToolPolicyBySenderConfig;
  exec?: ExecToolConfig;
  elevated?: {
    enabled?: boolean;
    allowFrom?: AgentElevatedAllowFromConfig;
  };
};
type ToolsConfig = Omit<SchemaToolsConfig, "toolsBySender" | "media" | "web" | "exec" | "elevated" | "links"> & {
  toolsBySender?: GroupToolPolicyBySenderConfig;
  media?: MediaToolsConfig;
  exec?: ExecToolConfig;
  elevated?: AgentToolsConfig["elevated"];
  links?: LinkToolsConfig;
  web?: NonNullable<ParsedToolsConfig["web"]>;
};
//#endregion
//#region src/config/types.tts.d.ts
type TtsConfigInput = NonNullable<z.input<typeof TtsConfigSchema>>;
type TtsProviderConfigInput = NonNullable<TtsConfigInput["providers"]>[string];
type TtsProvider = NonNullable<TtsConfigInput["provider"]>;
type TtsMode = NonNullable<TtsConfigInput["mode"]>;
type TtsAutoMode = NonNullable<TtsConfigInput["auto"]>;
type TtsModelOverrideConfig = NonNullable<TtsConfigInput["modelOverrides"]>;
type TtsProviderConfig = Record<string, unknown> & Pick<TtsProviderConfigInput, "apiKey">;
type TtsProviderConfigMap = Record<string, TtsProviderConfig>;
type TtsPersonaConfigInput = NonNullable<TtsConfigInput["personas"]>[string];
type TtsPersonaConfig = Omit<TtsPersonaConfigInput, "providers"> & {
  providers?: TtsProviderConfigMap;
};
type ResolvedTtsPersona = TtsPersonaConfig & {
  id: string;
};
type TtsConfig = Omit<TtsConfigInput, "personas" | "providers"> & {
  personas?: Record<string, TtsPersonaConfig>;
  providers?: TtsProviderConfigMap;
};
//#endregion
//#region src/config/types.discord.d.ts
type DiscordChannelStreamingConfig = Omit<ChannelPreviewStreamingConfig, "progress"> & {
  progress?: ChannelStreamingProgressConfig;
};
type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};
type DiscordMentionAliasesConfig = Record<string, string>;
type DiscordDmConfig = {
  /** If false, ignore all incoming Discord DMs. Default: true. */
  enabled?: boolean;
  /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean;
  /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: string[];
};
type DiscordGuildChannelConfig = {
  requireMention?: boolean;
  /**
   * If true, drop messages addressed to another identity by mention or bot reply, but not this
   * bot (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this channel. Omit = all skills; empty = no skills. */
  skills?: string[];
  /** If false, disable the bot for this channel. */
  enabled?: boolean;
  /** Optional allowlist for channel senders (ids or names). */
  users?: string[];
  /** Optional allowlist for channel senders by role ID. */
  roles?: string[];
  /** Optional system prompt snippet for this channel. */
  systemPrompt?: string;
  /** If false, omit thread starter context for this channel (default: true). */
  includeThreadStarter?: boolean;
  /** If true, automatically create a thread for each new message in this channel. */
  autoThread?: boolean;
  /** Archive duration (minutes) for auto-created threads. Valid values: 60, 1440, 4320, 10080. */
  autoArchiveDuration?: "60" | "1440" | "4320" | "10080" | 60 | 1440 | 4320 | 10080;
  /** Naming strategy for auto-created threads. "message" uses message text; "generated" renames with an LLM title. */
  autoThreadName?: "message" | "generated";
};
type DiscordReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type DiscordGuildEntry = {
  slug?: string;
  requireMention?: boolean;
  /**
   * If true, drop messages addressed to another identity by mention or bot reply, but not this
   * bot (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Optional tool policy overrides for this guild (used when channel override is missing). */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Reaction notification mode (off|own|all|allowlist). Default: own. */
  reactionNotifications?: DiscordReactionNotificationMode;
  /** Optional allowlist for guild senders (ids or names). */
  users?: string[];
  /** Optional allowlist for guild senders by role ID. */
  roles?: string[];
  presenceEvents?: DiscordPresenceEventsConfig;
  channels?: Record<string, DiscordGuildChannelConfig>;
};
type DiscordActionConfig = {
  reactions?: boolean;
  stickers?: boolean;
  polls?: boolean;
  permissions?: boolean;
  messages?: boolean;
  threads?: boolean;
  pins?: boolean;
  search?: boolean;
  memberInfo?: boolean;
  roleInfo?: boolean;
  roles?: boolean;
  channelInfo?: boolean;
  voiceStatus?: boolean;
  events?: boolean;
  moderation?: boolean;
  emojiUploads?: boolean;
  stickerUploads?: boolean;
  channels?: boolean;
  /** Enable bot presence/activity changes (default: false). */
  presence?: boolean;
};
type DiscordIntentsConfig = {
  /**
   * Request the privileged Message Content intent. Disable only for mention-only guild operation;
   * Discord still includes content in DMs and messages that explicitly mention the bot. Default: true.
   */
  messageContent?: boolean;
  /** Enable Guild Presences privileged intent (requires Portal opt-in). Default: false. */
  presence?: boolean;
  /** Enable Guild Members privileged intent (requires Portal opt-in). Default: false. */
  guildMembers?: boolean;
  /** Enable Guild Voice States intent. Defaults to voice.enabled, unless explicitly set. */
  voiceStates?: boolean;
};
type DiscordVoiceAutoJoinConfig = {
  /** Guild ID that owns the voice channel. */
  guildId: string;
  /** Voice channel ID to join. */
  channelId: string;
  /** Join and remain connected only while at least one human is in the channel. Default: false. */
  whenOccupied?: boolean;
};
type DiscordVoiceAllowedChannelConfig = {
  /** Guild ID that owns the voice channel. */
  guildId: string;
  /** Voice channel ID allowed for realtime voice sessions. */
  channelId: string;
};
type DiscordVoiceMode = "stt-tts" | "agent-proxy" | "bidi";
type DiscordVoiceRealtimeConsultPolicy = "auto" | "always";
type DiscordVoiceRealtimeToolPolicy = "safe-read-only" | "owner" | "none";
type DiscordVoiceRealtimeBootstrapContextFile = "IDENTITY.md" | "USER.md" | "SOUL.md";
type DiscordVoiceRealtimeConfig = {
  /** Realtime voice provider id, for example "openai". */
  provider?: string;
  /** Provider realtime session model, for example "gpt-realtime-2.1". */
  model?: string;
  /** Provider realtime output voice name, for example "cedar". */
  speakerVoice?: string;
  /** Provider realtime output voice id. */
  speakerVoiceId?: string;
  /** System instructions passed to the realtime provider. */
  instructions?: string;
  /** Tool policy for bidi realtime consult calls. */
  toolPolicy?: DiscordVoiceRealtimeToolPolicy;
  /** Whether bidi should force the OpenClaw agent brain for every substantive turn. */
  consultPolicy?: DiscordVoiceRealtimeConsultPolicy;
  /** OpenAI agent-proxy wake-name policy. Unset adapts to the room: off for one human, on for two or more. True always requires; false never requires. */
  requireWakeName?: boolean;
  /** Wake names that allow OpenAI agent-proxy realtime Discord voice to respond when the gate is active. Defaults to the routed agent name plus OpenClaw, or the agent id plus OpenClaw. */
  wakeNames?: string[];
  /** Agent profile bootstrap files to include in realtime provider instructions. Defaults to IDENTITY.md, USER.md, and SOUL.md; set [] to disable. */
  bootstrapContextFiles?: DiscordVoiceRealtimeBootstrapContextFile[];
  /** Allow Discord speaker-start events to interrupt active realtime playback. */
  bargeIn?: boolean;
  /** Minimum assistant playback duration before a barge-in truncates audio. Default: 250ms; set 0 for immediate interruption. */
  minBargeInAudioEndMs?: number;
  /** Debounce window before buffered transcripts are sent to the OpenClaw agent. */
  debounceMs?: number;
  /** Provider-specific realtime voice config keyed by provider id. */
  providers?: Record<string, Record<string, unknown> | undefined>;
};
type DiscordVoiceAgentSessionConfig = {
  /** Which OpenClaw conversation should receive voice turns. Default: "voice". */
  mode?: "voice" | "target";
  /** Discord target used when mode is "target", for example "channel:123". */
  target?: string;
};
type DiscordVoiceConfig = {
  /** Enable Discord voice channel conversations (default: true). */
  enabled?: boolean;
  /** Voice conversation mode. Default: agent-proxy. */
  mode?: DiscordVoiceMode;
  /** Route voice turns through an existing OpenClaw Discord conversation. */
  agentSession?: DiscordVoiceAgentSessionConfig;
  /** Optional LLM model override for Discord voice channel responses. */
  model?: string;
  /** Realtime provider settings for agent-proxy or bidi modes. */
  realtime?: DiscordVoiceRealtimeConfig;
  /** Voice channels to join automatically, optionally only while occupied. */
  autoJoin?: DiscordVoiceAutoJoinConfig[];
  /** If false, configured followUsers are ignored without removing the saved user list. */
  followUsersEnabled?: boolean;
  /** Discord user IDs whose current voice channel the bot should follow. */
  followUsers?: string[];
  /** Voice channels the bot is allowed to join or remain in. Unset means any voice channel is allowed. */
  allowedChannels?: DiscordVoiceAllowedChannelConfig[];
  /** Enable/disable DAVE end-to-end encryption (default: true; Discord may require this). */
  daveEncryption?: boolean;
  /** Consecutive decrypt failures before DAVE session reinitialization (default: 24). */
  decryptionFailureTolerance?: number;
  /** Initial @discordjs/voice Ready wait in milliseconds (default: 30000). */
  connectTimeoutMs?: number;
  /** Grace period for Discord voice reconnect signalling after a disconnect (default: 15000). */
  reconnectGraceMs?: number;
  /** Silence grace after Discord reports a speaker ended before finalizing STT capture (default: 2000). */
  captureSilenceGraceMs?: number;
  /** Optional TTS overrides for Discord voice output. */
  tts?: TtsConfig;
};
type DiscordExecApprovalConfig = ChannelExecApprovalConfig<string> & {
  /** Delete approval DMs after approval, denial, or timeout. Default: false. */
  cleanupAfterResolve?: boolean;
};
type DiscordAgentComponentsConfig = {
  /** Enable agent-controlled interactive components (buttons, select menus). Default: true. */
  enabled?: boolean;
  /** Time in milliseconds before sent Discord component callbacks expire. Default: 1800000. */
  ttlMs?: number;
};
type DiscordThreadBindingsConfig = {
  /** Enable Discord thread binding features. Overrides session.threadBindings.enabled. */
  enabled?: boolean;
  /** Inactivity window in hours. Set 0 to disable. Default: 24. */
  idleHours?: number;
  /** Hard max age in hours. Set 0 to disable. Default: 0. */
  maxAgeHours?: number;
  /** Allow session spawns to create and bind Discord threads. Default: true. */
  spawnSessions?: boolean;
  /** Default context mode for native subagents. Default: fork. */
  defaultSpawnContext?: "isolated" | "fork";
};
type DiscordSlashCommandConfig = {
  /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type DiscordThreadConfig = {
  /** If true, Discord thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean;
};
type DiscordAutoPresenceConfig = {
  /** Enable automatic runtime/quota-based Discord presence updates. Default: false. */
  enabled?: boolean;
  /** Poll interval for evaluating runtime availability state (ms). Default: 30000. */
  intervalMs?: number;
  /** Minimum spacing between actual gateway presence updates (ms). Default: 15000. */
  minUpdateIntervalMs?: number;
  /** Optional custom status text while runtime is healthy; supports plain text. */
  /** Optional custom status text while runtime/quota state is degraded or unknown. */
  /** Optional custom status text while runtime detects quota/token exhaustion. */
  /** @deprecated Doctor-only legacy input. */
  exhaustedText?: string;
};
type DiscordAccountConfig = Omit<CommonChannelMessagingConfig<string[], string, string, DiscordChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<never, never, string> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** Override native command registration for Discord (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  token?: SecretInput;
  /** Optional Discord application/client ID. Set this when REST application lookup is blocked. */
  applicationId?: string;
  activities?: {
    clientSecret?: string;
    applicationId?: string;
  };
  /** HTTP(S) proxy URL for Discord gateway WebSocket connections. */
  proxy?: string;
  /**
   * Deterministic outbound @handle rewrites for known Discord users.
   * Keys are handles without the leading @; values are Discord user IDs.
   */
  mentionAliases?: DiscordMentionAliasesConfig;
  /**
   * Suppress Discord-generated link embeds for outbound messages. Default: true.
   * Explicit `embeds` payloads are still sent normally.
   */
  suppressEmbeds?: boolean;
  /**
   * Soft max line count per Discord message.
   * Discord clients can clip/collapse very tall messages; splitting by lines
   * keeps replies readable in-channel. Default: 17.
   */
  maxLinesPerMessage?: number;
  /** Per-action tool gating (default: true for all). */
  actions?: DiscordActionConfig;
  /** Thread session behavior. */
  thread?: DiscordThreadConfig;
  dm?: DiscordDmConfig;
  /** New per-guild config keyed by guild id or slug. */
  guilds?: Record<string, DiscordGuildEntry>;
  /** Exec approval forwarding configuration. */
  execApprovals?: DiscordExecApprovalConfig;
  /** Agent-controlled interactive components (buttons, select menus). */
  agentComponents?: DiscordAgentComponentsConfig;
  /** Discord UI customization (components, modals, etc.). */
  /** Slash command configuration. */
  slashCommand?: DiscordSlashCommandConfig;
  /** Thread binding lifecycle settings. */
  threadBindings?: DiscordThreadBindingsConfig;
  /** Privileged Gateway Intents (must also be enabled in Discord Developer Portal). */
  intents?: DiscordIntentsConfig;
  /** Voice channel conversation settings. */
  voice?: DiscordVoiceConfig;
  /** PluralKit identity resolution for proxied messages. */
  pluralkit?: DiscordPluralKitConfig;
  /** When to send ack reactions for this Discord account. Overrides messages.ackReactionScope. */
  ackReactionScope?: "group-mentions" | "group-all" | "direct" | "all" | "off" | "none";
  /** Bot activity status text (e.g. "Watching X"). */
  activity?: string;
  /** Bot status (online|dnd|idle|invisible). Defaults to online when presence is configured. */
  status?: "online" | "dnd" | "idle" | "invisible";
  /** Automatic runtime/quota presence signaling (status text + status mapping). */
  autoPresence?: DiscordAutoPresenceConfig;
  /** Activity type (0=Game, 1=Streaming, 2=Listening, 3=Watching, 4=Custom, 5=Competing). Defaults to 4 (Custom) when activity is set. */
  activityType?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Streaming URL (Twitch/YouTube). Required when activityType=1. */
  activityUrl?: string;
  /**
   * Legacy compatibility block. Discord no longer enforces channel-owned
   * timeouts for queued inbound agent runs.
   */
  inboundWorker?: {
    /**
     * Ignored. Queued Discord agent runs are governed by the session/tool/runtime
     * lifecycle, not by Discord channel config.
     */
    runTimeoutMs?: number;
  };
};
type DiscordConfig = {
  /** Optional per-account Discord configuration (multi-account). */
  accounts?: Record<string, DiscordAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & DiscordAccountConfig;
//#endregion
//#region src/config/zod-schema.providers-googlechat.d.ts
declare const GoogleChatConfigSchema: z.ZodObject<{
  dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>>;
  groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>>;
  name: z.ZodOptional<z.ZodString>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
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
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  allowBots: z.ZodOptional<z.ZodBoolean>;
  botLoopProtection: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
    windowSeconds: z.ZodOptional<z.ZodNumber>;
    cooldownSeconds: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
  requireMention: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
  serviceAccountFile: z.ZodOptional<z.ZodString>;
  audienceType: z.ZodOptional<z.ZodEnum<{
    "app-url": "app-url";
    "project-number": "project-number";
  }>>;
  audience: z.ZodOptional<z.ZodString>;
  appPrincipal: z.ZodOptional<z.ZodString>;
  webhookPath: z.ZodOptional<z.ZodString>;
  webhookUrl: z.ZodOptional<z.ZodString>;
  botUser: z.ZodOptional<z.ZodString>;
  dm: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  typingIndicator: z.ZodOptional<z.ZodEnum<{
    message: "message";
    none: "none";
    reaction: "reaction";
  }>>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        bullets: "bullets";
        code: "code";
        off: "off";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
      pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
    }>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
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
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    allowBots: z.ZodOptional<z.ZodBoolean>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      botLoopProtection: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        cooldownSeconds: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    serviceAccountFile: z.ZodOptional<z.ZodString>;
    audienceType: z.ZodOptional<z.ZodEnum<{
      "app-url": "app-url";
      "project-number": "project-number";
    }>>;
    audience: z.ZodOptional<z.ZodString>;
    appPrincipal: z.ZodOptional<z.ZodString>;
    webhookPath: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    botUser: z.ZodOptional<z.ZodString>;
    dm: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    typingIndicator: z.ZodOptional<z.ZodEnum<{
      message: "message";
      none: "none";
      reaction: "reaction";
    }>>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.googlechat.d.ts
type GoogleChatSchemaInput = z.input<typeof GoogleChatConfigSchema>;
type GoogleChatAccountSchemaInput = Omit<GoogleChatSchemaInput, "accounts" | "defaultAccount">;
type GoogleChatGroupConfig = NonNullable<NonNullable<GoogleChatAccountSchemaInput["groups"]>[string]>;
type GoogleChatCompatibilityConfig = Pick<CommonChannelMessagingConfig, "dms" | "heartbeat">;
type GoogleChatAccountConfig = Omit<GoogleChatAccountSchemaInput, "groups" | "dms"> & GoogleChatCompatibilityConfig & {
  groups?: Record<string, GoogleChatGroupConfig>;
};
type GoogleChatConfig = Omit<GoogleChatSchemaInput, "accounts" | "groups" | "dms"> & GoogleChatAccountConfig & {
  accounts?: Record<string, GoogleChatAccountConfig>;
};
//#endregion
//#region src/config/types.imessage.d.ts
/** Private-API and helper actions the iMessage runtime may expose to agents. */
type IMessageActionConfig = {
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  sendWithEffect?: boolean;
  renameGroup?: boolean;
  setGroupIcon?: boolean;
  addParticipant?: boolean;
  removeParticipant?: boolean;
  leaveGroup?: boolean;
  sendAttachment?: boolean;
  polls?: boolean;
};
/** Inbound tapback notification policy. */
type IMessageReactionNotificationMode = "off" | "own" | "all";
type IMessageSendTransport = "auto" | "bridge" | "applescript";
/** Per-account iMessage runtime/config shape. */
type IMessageAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns" | "replyToMode"> & ChannelReadReceiptConfig & ChannelReactionConfig<IMessageReactionNotificationMode> & {
  /** imsg CLI binary path (default: imsg). */
  cliPath?: string;
  /** Optional Messages db path override. */
  dbPath?: string;
  /** Remote SSH host token for SCP attachment fetches (`host` or `user@host`). */
  remoteHost?: string;
  /** Enable or disable private API message actions. */
  actions?: IMessageActionConfig;
  /** Optional default send service (imessage|sms|auto). */
  service?: "imessage" | "sms" | "auto";
  /** Preferred imsg RPC send transport. Default: auto. */
  sendTransport?: IMessageSendTransport;
  /** Optional default region (used when sending SMS). */
  region?: string;
  /** Include attachments + reactions in watch payloads. */
  includeAttachments?: boolean;
  /** Allowed local iMessage attachment roots (supports single-segment `*` wildcards). */
  attachmentRoots?: string[];
  /** Allowed remote iMessage attachment roots for SCP fetches (supports `*`). */
  remoteAttachmentRoots?: string[];
  /** Timeout for probe/RPC operations in milliseconds (default: 10000). */
  probeTimeoutMs?: number;
  /**
   * Merge consecutive same-sender DM rows from `chat.db` into a single agent
   * turn, so Apple's split-send (`<command> <URL>` arriving as two separate
   * rows several seconds apart) lands as one merged message. DM-only — group chats
   * keep instant per-message dispatch. Widens the default inbound debounce
   * window to 7000 ms when enabled without an explicit
   * `messages.inbound.byChannel.imessage` or global
   * `messages.inbound.debounceMs`. Default: `false`.
   */
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    /**
     * Per-group system prompt. Injected into the agent's system prompt on
     * every turn that handles a message in that group. Matches the shape
     * already supported by Discord, Telegram, IRC, Slack, GoogleChat, and
     * other group-capable channels. The wildcard `groups["*"]` entry is
     * also honored.
     */
    systemPrompt?: string;
  }>;
  /**
   * Catchup: replay inbound messages that arrived in `chat.db` while the
   * gateway was offline (crash, restart, mac sleep). Disabled by default.
   * See https://github.com/openclaw/openclaw/issues/78649.
   */
  catchup?: {
    /** Master switch. Default `false`. */
    enabled?: boolean;
    /**
     * Maximum age of replayable messages in minutes. Messages older than
     * `now - maxAgeMinutes` are skipped even when the cursor is older.
     * Defense against runaway replay (the inverse of #62761). Default
     * `120` (2 h). Clamp `[1, 720]`.
     */
    maxAgeMinutes?: number;
    /**
     * Maximum messages to replay per catchup pass. Default `50`. Clamp
     * `[1, 500]`.
     */
    perRunLimit?: number;
    /**
     * On first run when no cursor exists, look back this many minutes.
     * Default `30`.
     */
    firstRunLookbackMinutes?: number;
    /**
     * Per-message retry ceiling. After this many consecutive failed
     * dispatch attempts against the same message guid, catchup logs a
     * `warn` and force-advances the cursor past the wedged message.
     * Default `10`. Clamp `[1, 1000]`.
     */
    maxFailureRetries?: number;
  };
};
/** Top-level iMessage config, with optional account map layered over default account fields. */
type IMessageConfig = {
  /** Optional per-account iMessage configuration (multi-account). */
  accounts?: Record<string, IMessageAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IMessageAccountConfig;
//#endregion
//#region src/config/zod-schema.implicit-mentions.d.ts
declare const ChannelImplicitMentionsSchema: z.ZodObject<{
  replyToBot: z.ZodOptional<z.ZodBoolean>;
  quotedBot: z.ZodOptional<z.ZodBoolean>;
  threadParticipation: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.implicit-mentions.d.ts
type ChannelImplicitMentionsConfig = z.input<typeof ChannelImplicitMentionsSchema>;
//#endregion
//#region src/config/types.irc.d.ts
type IrcAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & {
  /** IRC server hostname (example: irc.example.com). */
  host?: string;
  /** IRC server port (default: 6697 with TLS, otherwise 6667). */
  port?: number;
  /** Use TLS for IRC connection (default: true). */
  tls?: boolean;
  /** IRC nickname to identify this bot. */
  nick?: string;
  /** IRC USER field username (defaults to nick). */
  username?: string;
  /** IRC USER field realname (default: OpenClaw). */
  realname?: string;
  /** Optional IRC server password (sensitive). */
  password?: string;
  /** Optional file path containing IRC server password. */
  passwordFile?: string;
  /** Optional NickServ identify/register settings. */
  nickserv?: {
    /** Enable NickServ identify/register after connect (default: enabled when password is set). */
    enabled?: boolean;
    /** NickServ service nick (default: NickServ). */
    service?: string;
    /** NickServ password (sensitive). */
    password?: string;
    /** Optional file path containing NickServ password. */
    passwordFile?: string;
    /** If true, send NickServ REGISTER on connect. */
    register?: boolean;
    /** Email used with NickServ REGISTER. */
    registerEmail?: string;
  };
  /** Auto-join channel list at connect (example: ["#openclaw"]). */
  channels?: string[];
  /** Outbound text chunk size (chars). Default: 350. */
  textChunkLimit?: number;
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    allowFrom?: Array<string | number>;
    skills?: string[];
    enabled?: boolean;
    systemPrompt?: string;
  }>;
};
type IrcConfig = {
  /** Optional per-account IRC configuration (multi-account). */
  accounts?: Record<string, IrcAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IrcAccountConfig;
//#endregion
//#region src/config/types.msteams.d.ts
type MSTeamsWebhookConfig = {
  /** Port for the webhook server. Default: 3978. */
  port?: number;
  /** Path for the messages endpoint. Default: /api/messages. */
  path?: string;
};
/** Teams SDK cloud environment. Public cloud is the default. */
type MSTeamsCloudName = "Public" | "USGov" | "USGovDoD" | "China";
/**
 * Bot Framework OAuth SSO configuration for Microsoft Teams.
 *
 * When enabled, the plugin handles the `signin/tokenExchange` and
 * `signin/verifyState` invoke activities that Teams sends after an
 * `oauthCard` is presented to the user. The exchanged user token is
 * persisted via the Bot Framework User Token service so downstream
 * tools can call Microsoft Graph with delegated permissions.
 *
 * Prerequisites (Azure portal):
 * - The bot's Azure AD (Entra) app is configured with an exposed API
 *   scope (for example `access_as_user`) and lists the Teams client
 *   IDs in `knownClientApplications`.
 * - The Bot Framework channel registration has an OAuth Connection
 *   Setting whose name matches `connectionName` below, pointing at
 *   the same Azure AD app.
 */
type MSTeamsSsoConfig = {
  /** If true, handle signin/tokenExchange + signin/verifyState invokes. Default: false. */
  enabled?: boolean;
  /**
   * Name of the OAuth connection configured on the Bot Framework channel
   * registration (Azure Bot resource). Required when `enabled` is true.
   */
  connectionName?: string;
};
/** Reply style for MS Teams messages. */
type MSTeamsReplyStyle = "thread" | "top-level";
/** Channel-level config for MS Teams. */
type MSTeamsChannelConfig = {
  /** Require @mention to respond. Default: true. */
  requireMention?: boolean;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle;
};
/** Team-level config for MS Teams. */
type MSTeamsTeamConfig = {
  /** Default requireMention for channels in this team. */
  requireMention?: boolean;
  /** Default tool policy for channels in this team. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Default reply style for channels in this team. */
  replyStyle?: MSTeamsReplyStyle;
  /** Per-channel overrides. Key is conversation ID (e.g., "19:...@thread.tacv2"). */
  channels?: Record<string, MSTeamsChannelConfig>;
};
type MSTeamsConfig = Omit<CommonChannelMessagingConfig<string[], string, string, ChannelPreviewStreamingConfig>, "mentionPatterns" | "name" | "replyToMode"> & Pick<ChannelBotInteractionConfig<boolean>, "dangerouslyAllowNameMatching"> & {
  /** Azure Bot App ID (from Azure Bot registration). */
  appId?: string;
  /** Azure Bot App Password / Client Secret. */
  appPassword?: SecretInput;
  /** Azure AD Tenant ID (for single-tenant bots). */
  tenantId?: string;
  /** Teams SDK cloud environment. Default: Public. */
  cloud?: MSTeamsCloudName;
  /**
   * Bot Connector service URL used by SDK proactive sends/edits/deletes.
   * Set with `cloud` for USGov/DoD SDK clouds; set alone for GCC.
   */
  serviceUrl?: string;
  /**
   * Authentication type.
   * - `"secret"` (default): uses `appPassword` (client secret).
   * - `"federated"`: uses workload identity / managed identity / certificate.
   */
  authType?: "secret" | "federated";
  /** Path to a PEM certificate file for certificate-based auth. Used when `authType` is `"federated"`. */
  certificatePath?: string;
  /** Certificate thumbprint (hex SHA-1) for certificate-based auth. */
  certificateThumbprint?: string;
  /** If `true`, use Azure Managed Identity (system- or user-assigned) instead of a certificate. */
  useManagedIdentity?: boolean;
  /** User-assigned managed-identity client ID. When omitted with `useManagedIdentity: true`, system-assigned identity is used. */
  managedIdentityClientId?: string;
  /** Webhook server configuration. */
  webhook?: MSTeamsWebhookConfig;
  /** Send native Teams typing indicator before replies. Default: true for groups/channels; DMs use informative stream status. */
  typingIndicator?: boolean;
  /**
   * Allowed host suffixes for inbound attachment downloads.
   * Use ["*"] to allow any host (not recommended).
   */
  mediaAllowHosts?: Array<string>;
  /**
   * Allowed host suffixes for attaching Authorization headers to inbound media retries.
   * Use specific hosts only; avoid multi-tenant suffixes.
   */
  mediaAuthAllowHosts?: Array<string>;
  /**
   * Query Graph for channel/group media when Bot Framework HTML omits file markers.
   * Requires the documented Graph permissions and adds one message lookup per
   * otherwise unresolved HTML activity. Default: false.
   */
  graphMediaFallback?: boolean;
  /** Default: require @mention to respond in channels/groups. */
  requireMention?: boolean;
  /** Default reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle;
  /** Per-team config. Key is team ID (from the /team/ URL path segment). */
  teams?: Record<string, MSTeamsTeamConfig>;
  /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2"). */
  sharePointSiteId?: string;
  /** Show a welcome Adaptive Card when the bot is added to a 1:1 chat. Default: true. */
  welcomeCard?: boolean;
  /** Custom prompt starter labels shown on the welcome card. */
  promptStarters?: string[];
  /** Show a welcome message when the bot is added to a group chat. Default: false. */
  groupWelcomeCard?: boolean;
  /** Enable the Teams feedback loop (thumbs up/down) on AI-generated messages. Default: true. */
  feedbackEnabled?: boolean;
  /** Enable background reflection when a user gives negative feedback. Default: true. */
  feedbackReflection?: boolean;
  /** Minimum interval (ms) between reflections per session. Default: 300000 (5 min). */
  feedbackReflectionCooldownMs?: number;
  /** Delegated auth settings for user-scoped Graph API actions (e.g., reactions). */
  delegatedAuth?: {
    /** Enable delegated auth (user sign-in for Graph actions that need user scope). */
    enabled?: boolean;
    /** Additional scopes to request during OAuth consent. */
    scopes?: string[];
  };
  /** Bot Framework OAuth SSO (signin/tokenExchange + signin/verifyState) settings. */
  sso?: MSTeamsSsoConfig;
};
//#endregion
//#region src/config/types.signal.d.ts
type SignalReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SignalReactionLevel = "off" | "ack" | "minimal" | "extensive";
type SignalTransportConfig = {
  kind: "managed-native";
  /** Optional signal-cli config directory path (passed as --config). */
  configPath?: string;
  /** Opt-in absolute POSIX UNIX socket path; excludes HTTP options. */
  socketPath?: string;
  /** Native daemon connection URL when it differs from the managed bind endpoint. */
  url?: string;
  /** HTTP host for the managed signal-cli daemon (default 127.0.0.1). */
  httpHost?: string;
  /** HTTP port for the managed signal-cli daemon (default 8080). */
  httpPort?: number;
  /** signal-cli binary path (default: signal-cli). */
  cliPath?: string;
  /** Max time to wait for signal-cli daemon startup (ms, cap 120000). */
  startupTimeoutMs?: number;
  receiveMode?: "on-start" | "manual";
  ignoreStories?: boolean;
} | {
  kind: "external-native";
  /** Base URL for an externally managed native signal-cli HTTP daemon. */
  url: string;
} | {
  kind: "container";
  /** Base URL for bbernhard/signal-cli-rest-api. */
  url: string;
};
type SignalGroupConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type SignalAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & ChannelReadReceiptConfig & ChannelReactionConfig<SignalReactionNotificationMode, SignalReactionLevel, never, true> & {
  /** Optional explicit E.164 account for signal-cli. */
  account?: string;
  /** Optional account UUID for signal-cli (used for loop protection). */
  accountUuid?: string;
  /** Concrete transport owned by this account. Defaults to managed native signal-cli. */
  transport?: SignalTransportConfig;
  /** Skip downloading inbound Signal attachments. */
  ignoreAttachments?: boolean;
  /** OpenClaw-side target aliases keyed by friendly name. */
  aliases?: Record<string, string>;
  /** Per-group overrides keyed by Signal group id (or "*"). */
  groups?: Record<string, SignalGroupConfig>;
  /** Optional per-chat-type native reply quoting overrides. */
  replyToModeByChatType?: Partial<Record<"direct" | "group", ReplyToMode>>;
  /** Action toggles for message tool capabilities. */
  actions?: {
    /** Enable/disable sending reactions via message tool (default: true). */
    reactions?: boolean;
  };
};
type SignalConfig = {
  /** Optional per-account Signal configuration (multi-account). */
  accounts?: Record<string, SignalAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SignalAccountConfig;
//#endregion
//#region src/config/types.slack.d.ts
type SlackDmConfig = {
  /** If false, ignore all incoming Slack DMs. Default: true. */
  enabled?: boolean;
  /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean;
  /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: Array<string | number>;
};
type SlackChannelConfig = {
  /** If false, disable the bot in this channel. */
  enabled?: boolean;
  /** Require mentioning the bot to trigger replies. */
  requireMention?: boolean;
  /**
   * Ignore room messages that mention another user or user group but not this bot.
   * Requires a resolved bot user ID. Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Override Slack reply/thread behavior for this channel. */
  replyToMode?: ReplyToMode;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */
  allowBots?: boolean | "mentions";
  /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /** Allowlist of users that can invoke the bot in this channel. */
  users?: Array<string | number>;
  /** Optional skill filter for this channel. */
  skills?: string[];
  /** Optional system prompt for this channel. */
  systemPrompt?: string;
  /** Slack presence polling and agent wake mode for this channel. */
  presenceEvents?: SlackPresenceEventsConfig;
};
type SlackPresenceEventsMode = "off" | "auto" | "on";
type SlackPresenceEventsConfig = {
  /** Presence wake mode. Default: off. */
  mode?: SlackPresenceEventsMode;
  /** Override the default presence-event guidance. Empty omits guidance. Maximum: 20,000 characters. */
  prompt?: string;
};
type SlackReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SlackStreamingProgressConfig = ChannelStreamingProgressConfig & {
  /** Slack progress presentation. "compact" keeps one editable text draft. Default: "card". */
  style?: "card" | "compact";
  /** Use Slack-native task cards for card-style progress. Default: true. */
  nativeTaskCards?: boolean;
};
type SlackChannelStreamingConfig = ChannelStreamingConfig<SlackStreamingProgressConfig>;
type SlackExecApprovalConfig = ChannelExecApprovalConfig;
type SlackCapabilitiesConfig = string[];
type SlackActionConfig = {
  reactions?: boolean;
  messages?: boolean;
  pins?: boolean;
  search?: boolean;
  permissions?: boolean;
  memberInfo?: boolean;
  channelInfo?: boolean;
  emojiList?: boolean;
};
type SlackSlashCommandConfig = {
  /** Enable handling for the configured slash command (default: false). */
  enabled?: boolean;
  /** Slash command name (default: "openclaw"). */
  name?: string;
  /** Session key prefix for slash commands (default: "slack:slash"). */
  sessionPrefix?: string;
  /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type SlackThreadConfig = {
  /** Scope for thread history context (thread|channel). Default: thread. */
  historyScope?: "thread" | "channel";
  /** If true, thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean;
  /** Maximum number of thread messages to fetch as context when starting a new thread session (default: 20). Set to 0 to disable thread history fetching. */
  initialHistoryLimit?: number;
};
type SlackRelayConfig = {
  /** Full relay websocket URL, including the route path. */
  url?: string;
  /** Bearer token used to authenticate the gateway websocket to the Slack relay. */
  authToken?: SecretInput;
  /** Gateway destination id registered with openclaw-slack-router. */
  gatewayId?: string;
};
type SlackAccountConfig = Omit<CommonChannelMessagingConfig<SlackCapabilitiesConfig, string | number, string, SlackChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<SlackReactionNotificationMode, never, string, true> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** @deprecated Doctor-only legacy input. */
  identity?: "bot" | "user";
  /** @deprecated Doctor-only legacy input. */
  socketMode?: {
    clientPingTimeout?: number;
    serverPingTimeout?: number;
    pingPongLoggingEnabled?: boolean;
  };
  /** Slack author identity. Default: bot. */
  postAs?: "bot" | "user";
  /** Slack connection mode (socket|http|relay). Default: socket. */
  mode?: "socket" | "http" | "relay";
  /** Slack SDK Socket Mode transport options. Ignored in HTTP mode. */
  /** Relay-delivered Slack event source. Used when mode is "relay". */
  relay?: SlackRelayConfig;
  /** Slack signing secret (required for HTTP mode). */
  signingSecret?: SecretInput;
  /** Slack Events API webhook path (default: /slack/events). */
  webhookPath?: string;
  /** Slack-native exec approval delivery + approver authorization. */
  execApprovals?: SlackExecApprovalConfig;
  /** Override native command registration for Slack (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  botToken?: SecretInput;
  appToken?: SecretInput;
  userToken?: SecretInput;
  /** If true, restrict user token to read operations only. Default: true. */
  userTokenReadOnly?: boolean;
  /** Default mention requirement for channel messages (default: true). */
  requireMention?: boolean;
  /** Implicit mention policy for replies, quotes, and participated threads. */
  implicitMentions?: ChannelImplicitMentionsConfig;
  /** Pass through Slack chat.postMessage link unfurl control. Default: false. */
  unfurlLinks?: boolean;
  /** Pass through Slack chat.postMessage media unfurl control. Omitted by default. */
  unfurlMedia?: boolean;
  /**
   * Optional per-chat-type reply threading overrides.
   * Example: { direct: "all", group: "first", channel: "off" }.
   */
  replyToModeByChatType?: Partial<Record<"direct" | "group" | "channel", ReplyToMode>>;
  /** Thread session behavior. */
  thread?: SlackThreadConfig;
  /** Poll Slack presence and wake the routed agent on away-to-active transitions. Default: off. */
  presenceEvents?: SlackPresenceEventsConfig;
  actions?: SlackActionConfig;
  slashCommand?: SlackSlashCommandConfig;
  dm?: SlackDmConfig;
  channels?: Record<string, SlackChannelConfig>;
  /** Reaction emoji added while processing a reply (e.g. "hourglass_flowing_sand"). Removed when done. Useful as a typing indicator fallback when assistant mode is not enabled. */
  typingReaction?: string;
};
type SlackConfig = {
  /** Optional per-account Slack configuration (multi-account). */
  accounts?: Record<string, SlackAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SlackAccountConfig;
//#endregion
//#region src/config/types.telegram.d.ts
type TelegramActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean;
  /** Enable poll creation. Requires sendMessage to also be enabled. */
  poll?: boolean;
  deleteMessage?: boolean;
  editMessage?: boolean;
  /** Enable sticker actions (send and search). */
  sticker?: boolean;
  /** Enable forum topic creation. */
  createForumTopic?: boolean;
  /** Enable forum topic editing (rename / change icon). */
  editForumTopic?: boolean;
};
type TelegramThreadBindingsConfig = SessionThreadBindingsConfig;
type TelegramNetworkConfig = {
  /** Override Node's autoSelectFamily behavior (true = enable, false = disable). */
  autoSelectFamily?: boolean;
  /**
   * DNS result order for network requests ("ipv4first" | "verbatim").
   * Set to "ipv4first" to prioritize IPv4 addresses and work around IPv6 issues.
   * Default: "ipv4first" on Node 22+ to avoid common fetch failures.
   */
  dnsResultOrder?: "ipv4first" | "verbatim";
  /**
   * Dangerous opt-in for Telegram media downloads in trusted fake-IP or
   * transparent-proxy environments that resolve api.telegram.org to
   * private/internal/special-use addresses.
   */
  dangerouslyAllowPrivateNetwork?: boolean;
};
type TelegramInlineButtonsScope = "off" | "dm" | "group" | "all" | "allowlist";
type TelegramPreviewStreamingConfig = Omit<ChannelPreviewStreamingConfig, "preview"> & {
  preview?: ChannelStreamingPreviewConfig;
};
type TelegramExecApprovalConfig = ChannelExecApprovalConfig;
type TelegramCapabilitiesConfig = string[] | {
  inlineButtons?: TelegramInlineButtonsScope;
};
/** Custom command definition for Telegram bot menu. */
type TelegramCustomCommand = {
  /** Command name (without leading /). */
  command: string;
  /** Description shown in Telegram command menu. */
  description: string;
};
type TelegramAccountConfig = CommonChannelMessagingConfig<TelegramCapabilitiesConfig, string | number, string | number, TelegramPreviewStreamingConfig> & ChannelReactionConfig<"off" | "own" | "all", "off" | "ack" | "minimal" | "extensive", string> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** Telegram-native exec approval delivery + approver authorization. */
  execApprovals?: TelegramExecApprovalConfig;
  /** Override native command registration for Telegram (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  /** Custom commands to register in Telegram's command menu (merged with native). */
  customCommands?: TelegramCustomCommand[];
  botToken?: SecretInput;
  /** Path to a regular file containing the bot token; symlinks are rejected. */
  tokenFile?: string;
  groups?: Record<string, TelegramGroupConfig>;
  /** Per-DM configuration for Telegram DM topics (key is chat ID). */
  direct?: Record<string, TelegramDirectConfig>;
  /**
   * Use Telegram Bot API 10.3 rich messages for text sends and edits.
   * When false (default), falls back to HTML/plain text formatting via sendMessage.
   * Set to true to enable native tables, details, and rich media via sendRichMessage.
   * Note: Some Telegram clients (Web, Desktop, older mobile) do NOT support
   * sendRichMessage and will show "This message is not supported" errors.
   * Default: false.
   */
  richMessages?: boolean;
  /** Network transport overrides for Telegram. */
  network?: TelegramNetworkConfig;
  proxy?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookPath?: string;
  /** Local webhook listener bind host (default: 127.0.0.1). */
  webhookHost?: string;
  /** Local webhook listener bind port (default: 8787). */
  webhookPort?: number;
  /** Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. */
  webhookCertPath?: string;
  /** Per-action tool gating (default: true for all). */
  actions?: TelegramActionConfig;
  /** Telegram thread/conversation binding overrides. */
  threadBindings?: TelegramThreadBindingsConfig;
  /**
   * Controls which user reactions trigger notifications:
   * - "off" (default): ignore all reactions
   * - "own": notify when users react to bot messages
   * - "all": notify agent of all reactions
   */
  /**
   * Controls agent's reaction capability:
   * - "off": agent cannot react
   * - "ack" (default): bot sends acknowledgment reactions (👀 while processing)
   * - "minimal": agent can react sparingly (guideline: 1 per 5-10 exchanges)
   * - "extensive": agent can react liberally when appropriate
   */
  /** Controls whether link previews are shown in outbound messages. Default: true. */
  linkPreview?: boolean;
  /** Send Telegram bot error replies silently (no notification sound). Default: false. */
  silentErrorReplies?: boolean;
  /** Controls outbound error reporting: always, once per cooldown window, or silent. */
  errorPolicy?: "always" | "once" | "silent";
  /**
   * Per-channel outbound response prefix override.
   *
   * Account values take precedence over the channel-level value.
   * Use `""` to explicitly disable a global prefix for this channel.
   * Use `"auto"` to derive `[{identity.name}]` from the routed agent.
   */
  /**
   * Per-channel ack reaction override.
   * Telegram expects unicode emoji (e.g., "👀") rather than shortcodes.
   */
  /** Custom Telegram Bot API root URL (e.g. "https://my-proxy.example.com" or a local Bot API server), not a /bot<TOKEN> endpoint. */
  apiRoot?: string;
  /** Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. */
  trustedLocalFileRoots?: string[];
  /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramTopicConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped topic messages. */
  ingest?: boolean;
  /** Per-topic override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy;
  /** If specified, only load these skills for this topic. Omit = all skills; empty = no skills. */
  skills?: string[];
  /** If false, disable the bot for this topic. */
  enabled?: boolean;
  /** Optional allowlist for topic senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this topic. */
  systemPrompt?: string;
  /** If true, skip automatic voice-note transcription for mention detection in this topic. */
  disableAudioPreflight?: boolean;
  /** Route this topic to a specific agent (overrides group-level and binding routing). */
  agentId?: string;
  /** Controls outbound error reporting for this topic. */
  errorPolicy?: "always" | "once" | "silent";
};
type TelegramGroupConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean;
  /** Per-group override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy;
  /** Optional tool policy overrides for this group. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this group (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[];
  /** Per-topic configuration (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>;
  /** If false, disable the bot for this group (and its topics). */
  enabled?: boolean;
  /** Optional allowlist for group senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this group. */
  systemPrompt?: string;
  /** If true, skip automatic voice-note transcription for mention detection in this group. */
  disableAudioPreflight?: boolean;
  /** Controls outbound error reporting for this group. */
  errorPolicy?: "always" | "once" | "silent";
};
/** Config for LLM-based auto-topic labeling. */
type AutoTopicLabelConfig = boolean | {
  enabled?: boolean;
  /** Custom prompt for LLM-based topic naming. */
  prompt?: string;
};
type TelegramDirectConfig = {
  /** Per-DM override for DM message policy (open|disabled|allowlist). */
  dmPolicy?: DmPolicy;
  /** Optional tool policy overrides for this DM. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this DM (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[];
  /** Per-topic configuration for DM topics (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>;
  /** If false, disable the bot for this DM (and its topics). */
  enabled?: boolean;
  /** If true, require messages to be from a topic when topics are enabled. */
  requireTopic?: boolean;
  /** Optional allowlist for DM senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this DM. */
  systemPrompt?: string;
  /** Controls outbound error reporting for this DM. */
  errorPolicy?: "always" | "once" | "silent";
  /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramConfig = {
  /** Optional per-account Telegram configuration (multi-account). */
  accounts?: Record<string, TelegramAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & TelegramAccountConfig;
//#endregion
//#region src/config/zod-schema.providers-whatsapp.d.ts
declare const WhatsAppConfigSchema: z.ZodObject<{
  dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>>;
  groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
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
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
  selfChatMode: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  pluginHooks: z.ZodOptional<z.ZodObject<{
    messageReceived: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        bullets: "bullets";
        code: "code";
        off: "off";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
      pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
    }>>;
    mentionPatterns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
      denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
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
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
    selfChatMode: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    pluginHooks: z.ZodOptional<z.ZodObject<{
      messageReceived: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    name: z.ZodOptional<z.ZodString>;
    authDir: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    reactionLevel: z.ZodOptional<z.ZodEnum<{
      ack: "ack";
      extensive: "extensive";
      minimal: "minimal";
      off: "off";
    }>>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  actions: z.ZodOptional<z.ZodObject<{
    reactions: z.ZodOptional<z.ZodBoolean>;
    sendMessage: z.ZodOptional<z.ZodBoolean>;
    polls: z.ZodOptional<z.ZodBoolean>;
    calls: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  reactionLevel: z.ZodOptional<z.ZodEnum<{
    ack: "ack";
    extensive: "extensive";
    minimal: "minimal";
    off: "off";
  }>>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.whatsapp.d.ts
type WhatsAppSchemaInput = z.input<typeof WhatsAppConfigSchema>;
type WhatsAppSchemaAccountConfig = NonNullable<NonNullable<WhatsAppSchemaInput["accounts"]>[string]>;
type LegacyWhatsAppConfig = Pick<CommonChannelMessagingConfig, "dms" | "heartbeat"> & {
  /** @deprecated Doctor-only legacy input. */
  messagePrefix?: string;
};
type WhatsAppGroupSchemaInput = NonNullable<NonNullable<WhatsAppSchemaInput["groups"]>[string]>;
type WhatsAppGroupConfig = Omit<WhatsAppGroupSchemaInput, "toolsBySender"> & {
  systemPrompt?: string;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type WhatsAppDirectConfig = NonNullable<NonNullable<WhatsAppSchemaInput["direct"]>[string]>;
type WhatsAppAckReactionConfig = {
  emoji?: string;
  direct?: boolean;
  group?: "always" | "mentions" | "never";
};
type WhatsAppNarrowedConfig = {
  groups?: Record<string, WhatsAppGroupConfig>;
  direct?: Record<string, WhatsAppDirectConfig>;
  ackReaction?: WhatsAppAckReactionConfig;
};
type WhatsAppAccountConfig = Omit<WhatsAppSchemaAccountConfig, keyof WhatsAppNarrowedConfig | keyof LegacyWhatsAppConfig> & WhatsAppNarrowedConfig & LegacyWhatsAppConfig;
type WhatsAppConfig = Omit<WhatsAppSchemaInput, "accounts" | keyof WhatsAppNarrowedConfig | keyof LegacyWhatsAppConfig> & WhatsAppNarrowedConfig & LegacyWhatsAppConfig & {
  accounts?: Record<string, WhatsAppAccountConfig>;
};
//#endregion
//#region src/config/types.channels.d.ts
type ChannelDefaultsConfig = {
  /** @deprecated Doctor-only legacy input. */
  heartbeat?: ChannelHeartbeatVisibilityConfig;
  /** Default group-chat admission policy inherited by channels that support groups. */
  groupPolicy?: GroupPolicy;
  /** Default history/context visibility inherited by channel configs. */
  contextVisibility?: ContextVisibilityMode;
  /** Default heartbeat visibility for all channels. */
  heartbeatVisibility?: ChannelHeartbeatVisibilityConfig;
  /** Default pair loop guard settings for channels that support bot loop protection. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /** Default implicit-mention policy inherited by supporting channels. */
  implicitMentions?: ChannelImplicitMentionsConfig;
};
/** Provider/channel/target model override map used by channel dispatch. Keys are channel-specific group IDs, thread IDs, channel names, or DM peer identifiers (see docs/gateway/config-channels.md). */
type ChannelModelByChannelConfig = Record<string, Record<string, string>>;
/** JSON-compatible open-world channel section for plugin ids unknown to core. */
type OpenWorldChannelConfig = ReturnType<typeof JSON.parse>;
interface ChannelsConfig {
  /** Shared defaults inherited by channel sections unless they override them. */
  defaults?: ChannelDefaultsConfig;
  /** Map provider -> channel id / DM peer id -> model override. See docs/gateway/config-channels.md for supported key forms. */
  modelByChannel?: ChannelModelByChannelConfig;
  discord?: DiscordConfig;
  googlechat?: GoogleChatConfig;
  imessage?: IMessageConfig;
  irc?: IrcConfig;
  msteams?: MSTeamsConfig;
  signal?: SignalConfig;
  slack?: SlackConfig;
  telegram?: TelegramConfig;
  whatsapp?: WhatsAppConfig;
  /**
   * Channel sections are plugin-owned and keyed by arbitrary channel ids.
   * Open-world config keeps SDK/plugin-owned sections ergonomic for dynamic ids.
   */
  [key: string]: OpenWorldChannelConfig;
}
//#endregion
//#region src/config/zod-schema.root-shape.d.ts
declare const OpenClawSchemaShape: {
  $schema: z.ZodOptional<z.ZodString>;
  meta: z.ZodOptional<z.ZodObject<{
    lastTouchedVersion: z.ZodOptional<z.ZodString>;
    migrations: z.ZodOptional<z.ZodObject<{
      modelPolicyAllowlist: z.ZodOptional<z.ZodLiteral<true>>;
      utilityModelSeparation: z.ZodOptional<z.ZodLiteral<true>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  env: z.ZodOptional<z.ZodObject<{
    shellEnv: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    vars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  }, z.core.$strict>>;
  wizard: z.ZodOptional<z.ZodObject<{
    accessMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"guarded">]>>;
    appRecommendations: z.ZodOptional<z.ZodBoolean>;
    lastRunAt: z.ZodOptional<z.ZodString>;
    lastRunVersion: z.ZodOptional<z.ZodString>;
    lastRunCommit: z.ZodOptional<z.ZodString>;
    lastRunCommand: z.ZodOptional<z.ZodString>;
    lastRunMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
    securityAcknowledgedAt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  diagnostics: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    flags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    otel: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      endpoint: z.ZodOptional<z.ZodString>;
      tracesEndpoint: z.ZodOptional<z.ZodString>;
      metricsEndpoint: z.ZodOptional<z.ZodString>;
      logsEndpoint: z.ZodOptional<z.ZodString>;
      protocol: z.ZodOptional<z.ZodLiteral<"http/protobuf">>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      serviceName: z.ZodOptional<z.ZodString>;
      metricNamePrefix: z.ZodOptional<z.ZodString>;
      traces: z.ZodOptional<z.ZodBoolean>;
      metrics: z.ZodOptional<z.ZodBoolean>;
      logs: z.ZodOptional<z.ZodBoolean>;
      logsExporter: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"otlp">, z.ZodLiteral<"stdout">, z.ZodLiteral<"both">]>>;
      sampleRate: z.ZodOptional<z.ZodNumber>;
      flushIntervalMs: z.ZodOptional<z.ZodNumber>;
      captureContent: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    cacheTrace: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  logging: z.ZodOptional<z.ZodObject<{
    level: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
    file: z.ZodOptional<z.ZodString>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
    consoleLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
    consoleStyle: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pretty">, z.ZodLiteral<"json">]>>;
    redactPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    audit: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      executionIdentity: z.ZodOptional<z.ZodBoolean>;
      messages: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"direct">, z.ZodLiteral<"all">]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  update: z.ZodOptional<z.ZodObject<{
    channel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stable">, z.ZodLiteral<"extended-stable">, z.ZodLiteral<"beta">, z.ZodLiteral<"dev">]>>;
    checkOnStart: z.ZodOptional<z.ZodBoolean>;
    auto: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  telemetry: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    consentedAt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  browser: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowSystemProfileImport: z.ZodOptional<z.ZodBoolean>;
    evaluateEnabled: z.ZodOptional<z.ZodBoolean>;
    cdpUrl: z.ZodOptional<z.ZodString>;
    executablePath: z.ZodOptional<z.ZodString>;
    headless: z.ZodOptional<z.ZodBoolean>;
    noSandbox: z.ZodOptional<z.ZodBoolean>;
    attachOnly: z.ZodOptional<z.ZodBoolean>;
    defaultProfile: z.ZodOptional<z.ZodString>;
    snapshotDefaults: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodLiteral<"efficient">>;
    }, z.core.$strict>>;
    ssrfPolicy: z.ZodOptional<z.ZodObject<{
      dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
      allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
      allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
      allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      cdpPort: z.ZodOptional<z.ZodNumber>;
      cdpUrl: z.ZodOptional<z.ZodString>;
      userDataDir: z.ZodOptional<z.ZodString>;
      mcpCommand: z.ZodOptional<z.ZodString>;
      mcpArgs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      driver: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"openclaw">, z.ZodLiteral<"clawd">, z.ZodLiteral<"existing-session">, z.ZodLiteral<"extension">]>>;
      headless: z.ZodOptional<z.ZodBoolean>;
      executablePath: z.ZodOptional<z.ZodString>;
      attachOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>>;
    extraArgs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tabCleanup: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    extensionRelay: z.ZodOptional<z.ZodObject<{
      allowLegacyAuth: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  ui: z.ZodOptional<z.ZodObject<{
    seamColor: z.ZodOptional<z.ZodString>;
    prefs: z.ZodOptional<z.ZodObject<{
      theme: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"claw">, z.ZodLiteral<"knot">, z.ZodLiteral<"dash">, z.ZodLiteral<"absolutely">, z.ZodLiteral<"tide">, z.ZodLiteral<"beacon">, z.ZodLiteral<"phosphor">, z.ZodLiteral<"crt">, z.ZodLiteral<"manuscript">, z.ZodLiteral<"rose">, z.ZodLiteral<"miami">, z.ZodLiteral<"custom">]>>;
      themeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"light">, z.ZodLiteral<"dark">, z.ZodLiteral<"system">]>>;
      accent: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"theme">, z.ZodString]>>;
      locale: z.ZodOptional<z.ZodString>;
      chatShowThinking: z.ZodOptional<z.ZodBoolean>;
      chatShowToolCalls: z.ZodOptional<z.ZodBoolean>;
      chatPersistCommentary: z.ZodOptional<z.ZodBoolean>;
      chatSendShortcut: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"enter">, z.ZodLiteral<"modifier-enter">]>>;
      chatFollowUpMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"queue">]>>;
      sidebarEntries: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  secrets: z.ZodOptional<z.ZodObject<{
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
  auth: z.ZodOptional<z.ZodObject<{
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      provider: z.ZodString;
      mode: z.ZodUnion<readonly [z.ZodLiteral<"api_key">, z.ZodLiteral<"aws-sdk">, z.ZodLiteral<"oauth">, z.ZodLiteral<"token">]>;
      email: z.ZodOptional<z.ZodString>;
      displayName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    order: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
  }, z.core.$strict>>;
  accessGroups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"discord.channelAudience">;
    guildId: z.ZodString;
    channelId: z.ZodString;
    membership: z.ZodOptional<z.ZodLiteral<"canViewChannel">>;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"message.senders">;
    members: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
  }, z.core.$strict>], "type">>>;
  acp: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    dispatch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    backend: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultAgent: z.ZodOptional<z.ZodString>;
    allowedAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    stream: z.ZodOptional<z.ZodObject<{
      repeatSuppression: z.ZodOptional<z.ZodBoolean>;
      deliveryMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"live">, z.ZodLiteral<"final_only">]>>;
      tagVisibility: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    }, z.core.$strict>>;
    runtime: z.ZodOptional<z.ZodObject<{
      installCommand: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  models: z.ZodOptional<z.ZodObject<{
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
  nodeHost: z.ZodOptional<z.ZodObject<{
    autoUpdate: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    agentRuns: z.ZodOptional<z.ZodObject<{
      claude: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    workerRuns: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      capacity: z.ZodOptional<z.ZodNumber>;
      isolation: z.ZodOptional<z.ZodEnum<{
        container: "container";
        none: "none";
      }>>;
      containerImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    browserProxy: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowProfiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    mcp: z.ZodOptional<z.ZodObject<{
      servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        cwd: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
        requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
        supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
        auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
        oauth: z.ZodOptional<z.ZodObject<{
          identity: z.ZodOptional<z.ZodEnum<{
            "per-requester": "per-requester";
            shared: "shared";
          }>>;
          authProfileId: z.ZodOptional<z.ZodString>;
          scope: z.ZodOptional<z.ZodString>;
          redirectUrl: z.ZodOptional<z.ZodString>;
          clientMetadataUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        sslVerify: z.ZodOptional<z.ZodBoolean>;
        clientCert: z.ZodOptional<z.ZodString>;
        clientKey: z.ZodOptional<z.ZodString>;
        toolFilter: z.ZodOptional<z.ZodObject<{
          include: z.ZodOptional<z.ZodArray<z.ZodString>>;
          exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        codex: z.ZodOptional<z.ZodObject<{
          agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
          defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
            approve: "approve";
            auto: "auto";
            prompt: "prompt";
          }>>;
        }, z.core.$strict>>;
      }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
    }, z.core.$strict>>;
    skills: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  agents: z.ZodOptional<z.ZodObject<{
    ownership: z.ZodOptional<z.ZodLiteral<"explicit">>;
    defaults: z.ZodOptional<z.ZodLazy<z.ZodOptional<z.ZodObject<{
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      modelSelectionScope: z.ZodOptional<z.ZodEnum<{
        agent: "agent";
        global: "global";
        session: "session";
      }>>;
      utilityModel: z.ZodOptional<z.ZodString>;
      decisionModel: z.ZodOptional<z.ZodString>;
      imageModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      mediaModels: z.ZodOptional<z.ZodObject<{
        image: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        video: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        music: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
      }, z.core.$strict>>;
      voiceModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      pdfModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      pdfMaxMb: z.ZodOptional<z.ZodNumber>;
      pdfMaxPages: z.ZodOptional<z.ZodNumber>;
      models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        agentRuntime: z.ZodOptional<z.ZodObject<{
          id: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        codeMode: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>>;
      modelPolicy: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      workspace: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      silentReply: z.ZodOptional<z.ZodObject<{
        group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
        internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
      }, z.core.$strict>>;
      repoRoot: z.ZodOptional<z.ZodString>;
      skipBootstrap: z.ZodOptional<z.ZodBoolean>;
      skipOptionalBootstrapFiles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        "HEARTBEAT.md": "HEARTBEAT.md";
        "IDENTITY.md": "IDENTITY.md";
        "SOUL.md": "SOUL.md";
        "USER.md": "USER.md";
      }>>>;
      contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
      bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
      bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
      experimental: z.ZodOptional<z.ZodObject<{
        localModelLean: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      userTimezone: z.ZodOptional<z.ZodString>;
      startupContext: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        applyOn: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"new">, z.ZodLiteral<"reset">]>>>;
        dailyMemoryDays: z.ZodOptional<z.ZodNumber>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
        maxFileChars: z.ZodOptional<z.ZodNumber>;
        maxTotalChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      contextPruning: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"cache-ttl">]>>;
        ttl: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        hardClear: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          placeholder: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      compaction: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"safeguard">]>>;
        provider: z.ZodOptional<z.ZodString>;
        thinkingLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
          adaptive: "adaptive";
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          off: "off";
          ultra: "ultra";
          xhigh: "xhigh";
        }>, z.ZodLiteral<"inherit">]>>;
        keepRecentTokens: z.ZodOptional<z.ZodNumber>;
        identifierPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"off">]>>;
        recentTurnsPreserve: z.ZodOptional<z.ZodNumber>;
        qualityGuard: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxRetries: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        midTurnPrecheck: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        postIndexSync: z.ZodOptional<z.ZodEnum<{
          async: "async";
          await: "await";
          off: "off";
        }>>;
        postCompactionSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
        model: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        memoryFlush: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          model: z.ZodOptional<z.ZodString>;
          softThresholdTokens: z.ZodOptional<z.ZodNumber>;
          forceFlushTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        }, z.core.$strict>>;
        maxActiveTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        notifyUser: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      embeddedAgent: z.ZodOptional<z.ZodObject<{
        projectSettingsPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"trusted">, z.ZodLiteral<"sanitize">, z.ZodLiteral<"ignore">]>>;
        executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
        cyberFailover: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"off">]>>;
          model: z.ZodOptional<z.ZodString>;
          cooloffMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      thinkingDefault: z.ZodOptional<z.ZodEnum<{
        adaptive: "adaptive";
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        off: "off";
        ultra: "ultra";
        xhigh: "xhigh";
      }>>;
      fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      verboseDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"full">]>>;
      toolProgressDetail: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"explain">, z.ZodLiteral<"raw">]>>;
      reasoningDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"stream">]>>;
      elevatedDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"ask">, z.ZodLiteral<"full">]>>;
      blockStreamingDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
      blockStreamingBreak: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"text_end">, z.ZodLiteral<"message_end">]>>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      mediaMaxMb: z.ZodOptional<z.ZodNumber>;
      imageMaxDimensionPx: z.ZodOptional<z.ZodNumber>;
      imageQuality: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        balanced: "balanced";
        efficient: "efficient";
        high: "high";
      }>>;
      typingIntervalSeconds: z.ZodOptional<z.ZodNumber>;
      systemAgent: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      authInheritance: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sessionStore: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      subagents: z.ZodOptional<z.ZodObject<{
        delegationMode: z.ZodOptional<z.ZodEnum<{
          prefer: "prefer";
          suggest: "suggest";
        }>>;
        allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        maxConcurrent: z.ZodOptional<z.ZodNumber>;
        maxSpawnDepth: z.ZodOptional<z.ZodNumber>;
        maxChildrenPerAgent: z.ZodOptional<z.ZodNumber>;
        archiveAfterMinutes: z.ZodOptional<z.ZodNumber>;
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodString>;
        runTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
        announceTimeoutMs: z.ZodOptional<z.ZodNumber>;
        requireAgentId: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      contextLimits: z.ZodOptional<z.ZodObject<{
        memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
        postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      blockStreamingChunk: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
      }, z.core.$strict>>;
      blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      humanDelay: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
        minMs: z.ZodOptional<z.ZodNumber>;
        maxMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
      heartbeat: z.ZodOptional<z.ZodObject<{
        every: z.ZodOptional<z.ZodString>;
        activeHours: z.ZodOptional<z.ZodObject<{
          start: z.ZodOptional<z.ZodString>;
          end: z.ZodOptional<z.ZodString>;
          timezone: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        model: z.ZodOptional<z.ZodString>;
        session: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
        to: z.ZodOptional<z.ZodString>;
        accountId: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        lightContext: z.ZodOptional<z.ZodBoolean>;
        isolatedSession: z.ZodOptional<z.ZodBoolean>;
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
        backend: z.ZodOptional<z.ZodString>;
        workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
        sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
        scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
        workspaceRoot: z.ZodOptional<z.ZodString>;
        docker: z.ZodOptional<z.ZodObject<{
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          workdir: z.ZodOptional<z.ZodString>;
          readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
          tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          network: z.ZodOptional<z.ZodString>;
          user: z.ZodOptional<z.ZodString>;
          capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
          env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
          pidsLimit: z.ZodOptional<z.ZodNumber>;
          memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          cpus: z.ZodOptional<z.ZodNumber>;
          gpus: z.ZodOptional<z.ZodString>;
          ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
            soft: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>>;
          seccompProfile: z.ZodOptional<z.ZodString>;
          apparmorProfile: z.ZodOptional<z.ZodString>;
          dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
          extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
          dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        ssh: z.ZodOptional<z.ZodObject<{
          target: z.ZodOptional<z.ZodString>;
          command: z.ZodOptional<z.ZodString>;
          workspaceRoot: z.ZodOptional<z.ZodString>;
          strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
          updateHostKeys: z.ZodOptional<z.ZodBoolean>;
          identityFile: z.ZodOptional<z.ZodString>;
          certificateFile: z.ZodOptional<z.ZodString>;
          knownHostsFile: z.ZodOptional<z.ZodString>;
          identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
          certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
          knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strict>>;
        browser: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          network: z.ZodOptional<z.ZodString>;
          cdpPort: z.ZodOptional<z.ZodNumber>;
          cdpSourceRange: z.ZodOptional<z.ZodString>;
          vncPort: z.ZodOptional<z.ZodNumber>;
          noVncPort: z.ZodOptional<z.ZodNumber>;
          headless: z.ZodOptional<z.ZodBoolean>;
          noVncEnabled: z.ZodOptional<z.ZodBoolean>;
          allowHostControl: z.ZodOptional<z.ZodBoolean>;
          autoStart: z.ZodOptional<z.ZodBoolean>;
          autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        prune: z.ZodOptional<z.ZodObject<{
          idleHours: z.ZodOptional<z.ZodNumber>;
          maxAgeDays: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodPreprocess<z.ZodObject<{
      name: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      workspace: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      agentDir: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      utilityModel: z.ZodOptional<z.ZodString>;
      decisionModel: z.ZodOptional<z.ZodString>;
      models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        agentRuntime: z.ZodOptional<z.ZodObject<{
          id: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        codeMode: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>>;
      modelPolicy: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      thinkingDefault: z.ZodOptional<z.ZodEnum<{
        adaptive: "adaptive";
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        off: "off";
        ultra: "ultra";
        xhigh: "xhigh";
      }>>;
      verboseDefault: z.ZodOptional<z.ZodEnum<{
        full: "full";
        off: "off";
        on: "on";
      }>>;
      toolProgressDetail: z.ZodOptional<z.ZodEnum<{
        explain: "explain";
        raw: "raw";
      }>>;
      reasoningDefault: z.ZodOptional<z.ZodEnum<{
        off: "off";
        on: "on";
        stream: "stream";
      }>>;
      fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
      bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
      bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
      experimental: z.ZodOptional<z.ZodObject<{
        localModelLean: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      subagents: z.ZodOptional<z.ZodObject<{
        delegationMode: z.ZodOptional<z.ZodEnum<{
          prefer: "prefer";
          suggest: "suggest";
        }>>;
        allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodString>;
        requireAgentId: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      embeddedAgent: z.ZodOptional<z.ZodObject<{
        executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
      }, z.core.$strict>>;
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"embedded">;
      }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
        acp: z.ZodOptional<z.ZodObject<{
          agent: z.ZodOptional<z.ZodString>;
          backend: z.ZodOptional<z.ZodString>;
          mode: z.ZodOptional<z.ZodEnum<{
            oneshot: "oneshot";
            persistent: "persistent";
          }>>;
          cwd: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>]>>;
      memory: z.ZodOptional<z.ZodObject<{
        search: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
          sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
          extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            path: z.ZodString;
            pattern: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>>;
          multimodal: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
            maxFileBytes: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          experimental: z.ZodOptional<z.ZodObject<{
            sessionMemory: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
          provider: z.ZodOptional<z.ZodString>;
          remote: z.ZodOptional<z.ZodObject<{
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
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            batch: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          fallback: z.ZodOptional<z.ZodString>;
          model: z.ZodOptional<z.ZodString>;
          inputType: z.ZodOptional<z.ZodString>;
          queryInputType: z.ZodOptional<z.ZodString>;
          documentInputType: z.ZodOptional<z.ZodString>;
          outputDimensionality: z.ZodOptional<z.ZodNumber>;
          local: z.ZodOptional<z.ZodObject<{
            modelPath: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
          store: z.ZodOptional<z.ZodObject<{
            fts: z.ZodOptional<z.ZodObject<{
              tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
            }, z.core.$strict>>;
            vector: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
              extensionPath: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          query: z.ZodOptional<z.ZodObject<{
            maxResults: z.ZodOptional<z.ZodNumber>;
            minScore: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          cache: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      humanDelay: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
        minMs: z.ZodOptional<z.ZodNumber>;
        maxMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
      tts: z.ZodOptional<z.ZodObject<{
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
        prefsPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      skillsLimits: z.ZodOptional<z.ZodObject<{
        maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      contextLimits: z.ZodOptional<z.ZodObject<{
        memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
        postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      heartbeat: z.ZodOptional<z.ZodObject<{
        every: z.ZodOptional<z.ZodString>;
        activeHours: z.ZodOptional<z.ZodObject<{
          start: z.ZodOptional<z.ZodString>;
          end: z.ZodOptional<z.ZodString>;
          timezone: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        model: z.ZodOptional<z.ZodString>;
        session: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
        to: z.ZodOptional<z.ZodString>;
        accountId: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        lightContext: z.ZodOptional<z.ZodBoolean>;
        isolatedSession: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      identity: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        theme: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      groupChat: z.ZodOptional<z.ZodObject<{
        mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
        historyLimit: z.ZodOptional<z.ZodNumber>;
        unmentionedInbound: z.ZodOptional<z.ZodEnum<{
          room_event: "room_event";
          user_request: "user_request";
        }>>;
      }, z.core.$strict>>;
      sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
        backend: z.ZodOptional<z.ZodString>;
        workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
        sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
        scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
        workspaceRoot: z.ZodOptional<z.ZodString>;
        docker: z.ZodOptional<z.ZodObject<{
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          workdir: z.ZodOptional<z.ZodString>;
          readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
          tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          network: z.ZodOptional<z.ZodString>;
          user: z.ZodOptional<z.ZodString>;
          capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
          env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
          pidsLimit: z.ZodOptional<z.ZodNumber>;
          memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          cpus: z.ZodOptional<z.ZodNumber>;
          gpus: z.ZodOptional<z.ZodString>;
          ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
            soft: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>>;
          seccompProfile: z.ZodOptional<z.ZodString>;
          apparmorProfile: z.ZodOptional<z.ZodString>;
          dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
          extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
          dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        ssh: z.ZodOptional<z.ZodObject<{
          target: z.ZodOptional<z.ZodString>;
          command: z.ZodOptional<z.ZodString>;
          workspaceRoot: z.ZodOptional<z.ZodString>;
          strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
          updateHostKeys: z.ZodOptional<z.ZodBoolean>;
          identityFile: z.ZodOptional<z.ZodString>;
          certificateFile: z.ZodOptional<z.ZodString>;
          knownHostsFile: z.ZodOptional<z.ZodString>;
          identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
          certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
          knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strict>>;
        browser: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          network: z.ZodOptional<z.ZodString>;
          cdpPort: z.ZodOptional<z.ZodNumber>;
          cdpSourceRange: z.ZodOptional<z.ZodString>;
          vncPort: z.ZodOptional<z.ZodNumber>;
          noVncPort: z.ZodOptional<z.ZodNumber>;
          headless: z.ZodOptional<z.ZodBoolean>;
          noVncEnabled: z.ZodOptional<z.ZodBoolean>;
          allowHostControl: z.ZodOptional<z.ZodBoolean>;
          autoStart: z.ZodOptional<z.ZodBoolean>;
          autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        prune: z.ZodOptional<z.ZodObject<{
          idleHours: z.ZodOptional<z.ZodNumber>;
          maxAgeDays: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      tools: z.ZodOptional<z.ZodObject<{
        profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
          profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
        }, z.core.$strict>>>;
        toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>>>;
        codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
          enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
          executor: z.ZodOptional<z.ZodEnum<{
            node: "node";
            quickjs: "quickjs";
          }>>;
          mode: z.ZodOptional<z.ZodLiteral<"only">>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
          maxOutputBytes: z.ZodOptional<z.ZodNumber>;
          maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
          maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
          snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
          searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
          maxSearchLimit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxConcurrent: z.ZodOptional<z.ZodNumber>;
          maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
          maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
          waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
          defaultAgentId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        elevated: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
        }, z.core.$strict>>;
        exec: z.ZodOptional<z.ZodObject<{
          host: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            gateway: "gateway";
            node: "node";
            sandbox: "sandbox";
          }>>;
          mode: z.ZodOptional<z.ZodEnum<{
            allowlist: "allowlist";
            ask: "ask";
            auto: "auto";
            deny: "deny";
            full: "full";
          }>>;
          security: z.ZodOptional<z.ZodEnum<{
            allowlist: "allowlist";
            deny: "deny";
            full: "full";
          }>>;
          ask: z.ZodOptional<z.ZodEnum<{
            always: "always";
            off: "off";
            "on-miss": "on-miss";
          }>>;
          node: z.ZodOptional<z.ZodString>;
          pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
          safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
          strictInlineEval: z.ZodOptional<z.ZodBoolean>;
          commandHighlighting: z.ZodOptional<z.ZodBoolean>;
          grantExpiryDays: z.ZodOptional<z.ZodNumber>;
          safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            minPositional: z.ZodOptional<z.ZodNumber>;
            maxPositional: z.ZodOptional<z.ZodNumber>;
            allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>>;
          reviewer: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
              primary: z.ZodOptional<z.ZodString>;
              fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>]>>;
            thinking: z.ZodOptional<z.ZodEnum<{
              high: "high";
              low: "low";
              max: "max";
              medium: "medium";
              minimal: "minimal";
              xhigh: "xhigh";
            }>>;
            fastMode: z.ZodOptional<z.ZodBoolean>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          backgroundMs: z.ZodOptional<z.ZodNumber>;
          approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
          timeoutSeconds: z.ZodOptional<z.ZodNumber>;
          cleanupMs: z.ZodOptional<z.ZodNumber>;
          notifyOnExit: z.ZodOptional<z.ZodBoolean>;
          notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
          applyPatch: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            workspaceOnly: z.ZodOptional<z.ZodBoolean>;
            allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        github: z.ZodOptional<z.ZodObject<{
          profileId: z.ZodString;
          kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
          gitAuthor: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        fs: z.ZodOptional<z.ZodObject<{
          workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        loopDetection: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        message: z.ZodOptional<z.ZodObject<{
          crossContext: z.ZodOptional<z.ZodObject<{
            allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
            allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
            marker: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
              prefix: z.ZodOptional<z.ZodString>;
              suffix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          actions: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
          broadcast: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        sandbox: z.ZodOptional<z.ZodObject<{
          tools: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, unknown>>>;
  }, z.core.$strict>>;
  worktreeRoot: z.ZodOptional<z.ZodString>;
  worktreeAcceleration: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    }, z.core.$strict>>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    web: z.ZodOptional<z.ZodObject<{
      search: z.ZodOptional<z.ZodPreprocess<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        maxResults: z.ZodOptional<z.ZodNumber>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
        openaiCodex: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"cached">, z.ZodLiteral<"live">]>>;
          allowedDomains: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[] | undefined, string[]>>>;
          contextSize: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
          userLocation: z.ZodOptional<z.ZodPipe<z.ZodObject<{
            country: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            region: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            timezone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          }, z.core.$strict>, z.ZodTransform<{
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            timezone?: string | undefined;
          } | undefined, {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            timezone?: string | undefined;
          }>>>;
        }, z.core.$strict>>;
      }, z.core.$catchall<z.ZodUnknown>>, unknown>>;
      fetch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        maxCharsCap: z.ZodOptional<z.ZodNumber>;
        maxResponseBytes: z.ZodOptional<z.ZodNumber>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
        maxRedirects: z.ZodOptional<z.ZodNumber>;
        userAgent: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        readability: z.ZodOptional<z.ZodBoolean>;
        useTrustedEnvProxy: z.ZodOptional<z.ZodBoolean>;
        ssrfPolicy: z.ZodOptional<z.ZodObject<{
          dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
          allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
          allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
          allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
          blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    github: z.ZodOptional<z.ZodObject<{
      profileId: z.ZodString;
      kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
      gitAuthor: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    media: z.ZodOptional<z.ZodObject<{
      models: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
        }, z.core.$strict>>;
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"video">]>>>;
        type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"provider">, z.ZodLiteral<"cli">]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        profile: z.ZodOptional<z.ZodString>;
        preferredProfile: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>>;
      concurrency: z.ZodOptional<z.ZodNumber>;
      image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
      audio: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
        echoTranscript: z.ZodOptional<z.ZodBoolean>;
        echoFormat: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>;
      video: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
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
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    links: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxLinks: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      models: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodOptional<z.ZodLiteral<"cli">>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    sessions: z.ZodOptional<z.ZodObject<{
      visibility: z.ZodOptional<z.ZodEnum<{
        agent: "agent";
        all: "all";
        self: "self";
        tree: "tree";
      }>>;
    }, z.core.$strict>>;
    loopDetection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    toolSearch: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodEnum<{
        code: "code";
        directory: "directory";
        tools: "tools";
      }>>;
      codeTimeoutMs: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      executor: z.ZodOptional<z.ZodEnum<{
        node: "node";
        quickjs: "quickjs";
      }>>;
      mode: z.ZodOptional<z.ZodLiteral<"only">>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
      maxOutputBytes: z.ZodOptional<z.ZodNumber>;
      maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
      maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
      snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
      maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
      waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
      defaultAgentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    message: z.ZodOptional<z.ZodObject<{
      crossContext: z.ZodOptional<z.ZodObject<{
        allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
        allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
        marker: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          prefix: z.ZodOptional<z.ZodString>;
          suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      actions: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      broadcast: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    agentToAgent: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    elevated: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
    }, z.core.$strict>>;
    exec: z.ZodOptional<z.ZodObject<{
      host: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        gateway: "gateway";
        node: "node";
        sandbox: "sandbox";
      }>>;
      mode: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        ask: "ask";
        auto: "auto";
        deny: "deny";
        full: "full";
      }>>;
      security: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        deny: "deny";
        full: "full";
      }>>;
      ask: z.ZodOptional<z.ZodEnum<{
        always: "always";
        off: "off";
        "on-miss": "on-miss";
      }>>;
      node: z.ZodOptional<z.ZodString>;
      pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      strictInlineEval: z.ZodOptional<z.ZodBoolean>;
      commandHighlighting: z.ZodOptional<z.ZodBoolean>;
      grantExpiryDays: z.ZodOptional<z.ZodNumber>;
      safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        minPositional: z.ZodOptional<z.ZodNumber>;
        maxPositional: z.ZodOptional<z.ZodNumber>;
        allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>;
      reviewer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodEnum<{
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          xhigh: "xhigh";
        }>>;
        fastMode: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      backgroundMs: z.ZodOptional<z.ZodNumber>;
      approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cleanupMs: z.ZodOptional<z.ZodNumber>;
      notifyOnExit: z.ZodOptional<z.ZodBoolean>;
      notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
      applyPatch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    fs: z.ZodOptional<z.ZodObject<{
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    subagents: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sessions_spawn: z.ZodOptional<z.ZodObject<{
      attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxTotalBytes: z.ZodOptional<z.ZodNumber>;
        maxFiles: z.ZodOptional<z.ZodNumber>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
        retainOnSessionKeep: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    updatePlan: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  security: z.ZodOptional<z.ZodObject<{
    audit: z.ZodOptional<z.ZodObject<{
      suppressions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        checkId: z.ZodString;
        titleIncludes: z.ZodOptional<z.ZodString>;
        detailIncludes: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    installPolicy: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      targets: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"skill">, z.ZodLiteral<"plugin">]>>>;
      exec: z.ZodOptional<z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
        trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  bindings: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodOptional<z.ZodLiteral<"route">>;
    agentId: z.ZodString;
    comment: z.ZodOptional<z.ZodString>;
    match: z.ZodObject<{
      channel: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      peer: z.ZodOptional<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
        id: z.ZodString;
      }, z.core.$strict>>;
      guildId: z.ZodOptional<z.ZodString>;
      teamId: z.ZodOptional<z.ZodString>;
      roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    session: z.ZodOptional<z.ZodObject<{
      dmScope: z.ZodOptional<z.ZodEnum<{
        main: "main";
        "per-account-channel-peer": "per-account-channel-peer";
        "per-channel-peer": "per-channel-peer";
        "per-peer": "per-peer";
      }>>;
      groupScope: z.ZodOptional<z.ZodEnum<{
        main: "main";
        "per-group": "per-group";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    agentId: z.ZodString;
    comment: z.ZodOptional<z.ZodString>;
    match: z.ZodObject<{
      channel: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      peer: z.ZodOptional<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
        id: z.ZodString;
      }, z.core.$strict>>;
      guildId: z.ZodOptional<z.ZodString>;
      teamId: z.ZodOptional<z.ZodString>;
      roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    acp: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      label: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>>;
  broadcast: z.ZodOptional<z.ZodObject<{
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
  attachments: z.ZodOptional<z.ZodObject<{
    ttlHours: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  messages: z.ZodOptional<z.ZodObject<{
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
  tts: z.ZodOptional<z.ZodObject<{
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
  commands: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    native: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>>;
    nativeSkills: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>>;
    text: z.ZodOptional<z.ZodBoolean>;
    bash: z.ZodOptional<z.ZodBoolean>;
    bashForegroundMs: z.ZodOptional<z.ZodNumber>;
    config: z.ZodOptional<z.ZodBoolean>;
    mcp: z.ZodOptional<z.ZodBoolean>;
    plugins: z.ZodOptional<z.ZodBoolean>;
    debug: z.ZodOptional<z.ZodBoolean>;
    restart: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    ownerAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    allowFrom: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>>;
  }, z.core.$strict>>>;
  approvals: z.ZodOptional<z.ZodObject<{
    exec: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
      agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        channel: z.ZodString;
        to: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    plugin: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
      agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        channel: z.ZodString;
        to: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  session: z.ZodOptional<z.ZodObject<{
    scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"per-sender">, z.ZodLiteral<"global">]>>;
    dmScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-account-channel-peer": "per-account-channel-peer";
      "per-channel-peer": "per-channel-peer";
      "per-peer": "per-peer";
    }>>;
    groupScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-group": "per-group";
    }>>;
    notifyOnCreate: z.ZodOptional<z.ZodBoolean>;
    identityLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    resetTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reset: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    resetByType: z.ZodOptional<z.ZodObject<{
      direct: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      group: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      thread: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    resetByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    store: z.ZodOptional<z.ZodString>;
    mainKey: z.ZodOptional<z.ZodString>;
    sendPolicy: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
        match: z.ZodOptional<z.ZodObject<{
          channel: z.ZodOptional<z.ZodString>;
          chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
          keyPrefix: z.ZodOptional<z.ZodString>;
          rawKeyPrefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>>;
    threadBindings: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      idleHours: z.ZodOptional<z.ZodNumber>;
      maxAgeHours: z.ZodOptional<z.ZodNumber>;
      spawnSessions: z.ZodOptional<z.ZodBoolean>;
      defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
        fork: "fork";
        isolated: "isolated";
      }>>;
    }, z.core.$strict>>;
    sharing: z.ZodOptional<z.ZodObject<{
      readOnly: z.ZodOptional<z.ZodBoolean>;
      suggest: z.ZodOptional<z.ZodBoolean>;
      drafts: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    maintenance: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        enforce: "enforce";
        warn: "warn";
      }>>;
      coldStorage: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        afterDays: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      pruneAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      archiveDashboardAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>, z.ZodLiteral<0>]>>;
      maxEntries: z.ZodOptional<z.ZodNumber>;
      preserveRecent: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
      resetArchiveRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
      maxDiskBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodLiteral<false>]>>;
      highWaterBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  cron: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    skipMissedJobs: z.ZodOptional<z.ZodBoolean>;
    triggers: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    webhookToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    webhookSsrfPolicy: z.ZodOptional<z.ZodObject<{
      dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
      allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
      allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
      allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    sessionRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    failureAlert: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      after: z.ZodOptional<z.ZodNumber>;
      cooldownMs: z.ZodOptional<z.ZodNumber>;
      includeSkipped: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodEnum<{
        announce: "announce";
        webhook: "webhook";
      }>>;
      accountId: z.ZodOptional<z.ZodString>;
      channel: z.ZodOptional<z.ZodString>;
      to: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  transcripts: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    autoStart: z.ZodOptional<z.ZodArray<z.ZodObject<{
      providerId: z.ZodString;
      whenOccupied: z.ZodOptional<z.ZodBoolean>;
      sessionId: z.ZodOptional<z.ZodString>;
      title: z.ZodOptional<z.ZodString>;
      accountId: z.ZodOptional<z.ZodString>;
      guildId: z.ZodOptional<z.ZodString>;
      channelId: z.ZodOptional<z.ZodString>;
      meetingUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  hooks: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    path: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    defaultSessionKey: z.ZodOptional<z.ZodString>;
    allowRequestSessionKey: z.ZodOptional<z.ZodBoolean>;
    allowedSessionKeyPrefixes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowedAgentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    presets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    transformsDir: z.ZodOptional<z.ZodString>;
    mappings: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
      match: z.ZodOptional<z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>>;
      action: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"wake">, z.ZodLiteral<"agent">]>>;
      wakeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"now">, z.ZodLiteral<"next-heartbeat">]>>;
      name: z.ZodOptional<z.ZodString>;
      agentId: z.ZodOptional<z.ZodString>;
      sessionKey: z.ZodOptional<z.ZodString>;
      sessionMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"isolated">, z.ZodLiteral<"persistent">]>>;
      messageTemplate: z.ZodOptional<z.ZodString>;
      textTemplate: z.ZodOptional<z.ZodString>;
      forEach: z.ZodOptional<z.ZodString>;
      deliver: z.ZodOptional<z.ZodBoolean>;
      allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
      channel: z.ZodOptional<z.ZodString>;
      to: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      thinking: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      transform: z.ZodOptional<z.ZodObject<{
        module: z.ZodString;
        export: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>>;
    gmail: z.ZodOptional<z.ZodObject<{
      account: z.ZodOptional<z.ZodString>;
      label: z.ZodOptional<z.ZodString>;
      topic: z.ZodOptional<z.ZodString>;
      subscription: z.ZodOptional<z.ZodString>;
      pushToken: z.ZodOptional<z.ZodString>;
      hookUrl: z.ZodOptional<z.ZodString>;
      includeBody: z.ZodOptional<z.ZodBoolean>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      renewEveryMinutes: z.ZodOptional<z.ZodNumber>;
      allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
      serve: z.ZodOptional<z.ZodObject<{
        bind: z.ZodOptional<z.ZodString>;
        port: z.ZodOptional<z.ZodNumber>;
        path: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      tailscale: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
        path: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      model: z.ZodOptional<z.ZodString>;
      thinking: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"minimal">, z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
    }, z.core.$strict>>;
    internal: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      }, z.core.$loose>>>;
      load: z.ZodOptional<z.ZodObject<{
        extraDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  channels: z.ZodType<ChannelsConfig | undefined, unknown, z.core.$ZodTypeInternals<ChannelsConfig | undefined, unknown>>;
  discovery: z.ZodOptional<z.ZodObject<{
    wideArea: z.ZodOptional<z.ZodObject<{
      domain: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    mdns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        full: "full";
        minimal: "minimal";
        off: "off";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  talk: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
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
    }, z.core.$catchall<z.ZodUnknown>>>>;
    realtime: z.ZodOptional<z.ZodObject<{
      provider: z.ZodOptional<z.ZodString>;
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
      }, z.core.$catchall<z.ZodUnknown>>>>;
      model: z.ZodOptional<z.ZodString>;
      speakerVoice: z.ZodOptional<z.ZodString>;
      speakerVoiceId: z.ZodOptional<z.ZodString>;
      instructions: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        realtime: "realtime";
        "stt-tts": "stt-tts";
        transcription: "transcription";
      }>>;
      transport: z.ZodOptional<z.ZodEnum<{
        "gateway-relay": "gateway-relay";
        "managed-room": "managed-room";
        "provider-websocket": "provider-websocket";
        webrtc: "webrtc";
      }>>;
      vadThreshold: z.ZodOptional<z.ZodNumber>;
      silenceDurationMs: z.ZodOptional<z.ZodNumber>;
      prefixPaddingMs: z.ZodOptional<z.ZodNumber>;
      reasoningEffort: z.ZodOptional<z.ZodString>;
      brain: z.ZodOptional<z.ZodEnum<{
        "agent-consult": "agent-consult";
        "direct-tools": "direct-tools";
        none: "none";
      }>>;
      consultRouting: z.ZodOptional<z.ZodEnum<{
        "force-agent-consult": "force-agent-consult";
        "provider-direct": "provider-direct";
      }>>;
    }, z.core.$strict>>;
    consultThinkingLevel: z.ZodOptional<z.ZodEnum<{
      adaptive: "adaptive";
      high: "high";
      low: "low";
      max: "max";
      medium: "medium";
      minimal: "minimal";
      off: "off";
      ultra: "ultra";
      xhigh: "xhigh";
    }>>;
    consultFastMode: z.ZodOptional<z.ZodBoolean>;
    speechLocale: z.ZodOptional<z.ZodString>;
    interruptOnSpeech: z.ZodOptional<z.ZodBoolean>;
    silenceTimeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  gateway: z.ZodOptional<z.ZodObject<{
    port: z.ZodOptional<z.ZodNumber>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
    bind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"lan">, z.ZodLiteral<"loopback">, z.ZodLiteral<"custom">, z.ZodLiteral<"tailnet">]>>;
    customBindHost: z.ZodOptional<z.ZodString>;
    publicOrigin: z.ZodOptional<z.ZodString>;
    portals: z.ZodOptional<z.ZodObject<{
      ingress: z.ZodOptional<z.ZodObject<{
        domain: z.ZodString;
        port: z.ZodNumber;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    controlUi: z.ZodOptional<z.ZodObject<{
      dangerouslyDisableDeviceAuth: z.ZodOptional<z.ZodBoolean>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      basePath: z.ZodOptional<z.ZodString>;
      experimental: z.ZodOptional<z.ZodObject<{
        customPlugins: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      root: z.ZodOptional<z.ZodString>;
      environment: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        color: z.ZodEnum<{
          amber: "amber";
          blue: "blue";
          coral: "coral";
          gray: "gray";
          green: "green";
          pink: "pink";
          purple: "purple";
          red: "red";
          teal: "teal";
        }>;
      }, z.core.$strict>>;
      communityInvite: z.ZodOptional<z.ZodBoolean>;
      github: z.ZodOptional<z.ZodObject<{
        token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      }, z.core.$strict>>;
      sessionObserver: z.ZodOptional<z.ZodBoolean>;
      embedSandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"scripts">, z.ZodLiteral<"trusted">]>>;
      allowExternalEmbedUrls: z.ZodOptional<z.ZodBoolean>;
      automaticallyFetchFavicons: z.ZodOptional<z.ZodBoolean>;
      allowedOrigins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      dangerouslyAllowHostHeaderOriginFallback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    cliAgents: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    terminal: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      shell: z.ZodOptional<z.ZodString>;
      detachedSessionTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    auth: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"token">, z.ZodLiteral<"password">, z.ZodLiteral<"trusted-proxy">]>>;
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      allowTailscale: z.ZodOptional<z.ZodBoolean>;
      identityScopes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        "operator.admin": "operator.admin";
        "operator.approvals": "operator.approvals";
        "operator.pairing": "operator.pairing";
        "operator.questions": "operator.questions";
        "operator.read": "operator.read";
        "operator.sessions.read": "operator.sessions.read";
        "operator.sessions.write": "operator.sessions.write";
        "operator.talk": "operator.talk";
        "operator.talk.secrets": "operator.talk.secrets";
        "operator.write": "operator.write";
      }>>>>;
      rateLimit: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodOptional<z.ZodNumber>;
        windowMs: z.ZodOptional<z.ZodNumber>;
        lockoutMs: z.ZodOptional<z.ZodNumber>;
        exemptLoopback: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      trustedProxy: z.ZodOptional<z.ZodObject<{
        userHeader: z.ZodString;
        requiredHeaders: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowUsers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowLoopback: z.ZodOptional<z.ZodBoolean>;
        cloudflareAccessOidc: z.ZodOptional<z.ZodObject<{
          issuer: z.ZodString;
          providerId: z.ZodString;
          githubAccountIdClaim: z.ZodString;
        }, z.core.$strict>>;
        deviceAutoApprove: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    roles: z.ZodOptional<z.ZodObject<{
      default: z.ZodString;
      definitions: z.ZodRecord<z.ZodString, z.ZodObject<{
        sessions: z.ZodObject<{
          others: z.ZodEnum<{
            none: "none";
            suggest: "suggest";
            view: "view";
            write: "write";
          }>;
        }, z.core.$strict>;
        sandbox: z.ZodOptional<z.ZodEnum<{
          inherit: "inherit";
          required: "required";
        }>>;
        agents: z.ZodUnion<readonly [z.ZodLiteral<"*">, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>]>;
        scopes: z.ZodPipe<z.ZodArray<z.ZodEnum<{
          "operator.admin": "operator.admin";
          "operator.approvals": "operator.approvals";
          "operator.pairing": "operator.pairing";
          "operator.questions": "operator.questions";
          "operator.read": "operator.read";
          "operator.sessions.read": "operator.sessions.read";
          "operator.sessions.write": "operator.sessions.write";
          "operator.talk": "operator.talk";
          "operator.talk.secrets": "operator.talk.secrets";
          "operator.write": "operator.write";
        }>>, z.ZodTransform<("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[], ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[]>>;
        accessPolicyPlugin: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    trustedProxies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowRealIpFallback: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    tailscale: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
      preserveFunnel: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    remote: z.ZodOptional<z.ZodObject<{
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"ssh">, z.ZodLiteral<"direct">]>>;
      remotePort: z.ZodOptional<z.ZodNumber>;
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      edgeAuth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
      tlsFingerprint: z.ZodOptional<z.ZodString>;
      sshTarget: z.ZodOptional<z.ZodString>;
      sshIdentity: z.ZodOptional<z.ZodString>;
      sshHostKeyPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"openssh">]>>;
    }, z.core.$strict>>;
    reload: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"hybrid">]>>;
    }, z.core.$strict>>;
    tls: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      autoGenerate: z.ZodOptional<z.ZodBoolean>;
      certPath: z.ZodOptional<z.ZodString>;
      keyPath: z.ZodOptional<z.ZodString>;
      caPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    http: z.ZodOptional<z.ZodObject<{
      endpoints: z.ZodOptional<z.ZodObject<{
        chatCompletions: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          images: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        responses: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxUrlParts: z.ZodOptional<z.ZodNumber>;
          files: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            maxChars: z.ZodOptional<z.ZodNumber>;
            pdf: z.ZodOptional<z.ZodObject<{
              maxPages: z.ZodOptional<z.ZodNumber>;
              maxPixels: z.ZodOptional<z.ZodNumber>;
              minTextChars: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          images: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      securityHeaders: z.ZodOptional<z.ZodObject<{
        strictTransportSecurity: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    push: z.ZodOptional<z.ZodObject<{
      apns: z.ZodOptional<z.ZodObject<{
        relay: z.ZodOptional<z.ZodObject<{
          baseUrl: z.ZodOptional<z.ZodString>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    nodes: z.ZodOptional<z.ZodObject<{
      browser: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"manual">, z.ZodLiteral<"off">]>>;
        node: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      pairing: z.ZodOptional<z.ZodObject<{
        autoApproveLocal: z.ZodOptional<z.ZodBoolean>;
        autoApproveCidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sshVerify: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
          user: z.ZodOptional<z.ZodString>;
          identity: z.ZodOptional<z.ZodString>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          cidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
      }, z.core.$strict>>;
      pluginTools: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      allowSkills: z.ZodOptional<z.ZodBoolean>;
      commands: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  cloudWorkers: z.ZodOptional<z.ZodObject<{
    desktop: z.ZodOptional<z.ZodBoolean>;
    preparedPool: z.ZodOptional<z.ZodObject<{
      maxTotal: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    projectProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      provider: z.ZodString;
      install: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        bundle: "bundle";
        npm: "npm";
      }>>>;
      suspendAfter: z.ZodOptional<z.ZodString>;
      readyWorkers: z.ZodOptional<z.ZodNumber>;
      settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  desktop: z.ZodOptional<z.ZodObject<{
    host: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodBoolean;
      managed: z.ZodOptional<z.ZodBoolean>;
      port: z.ZodOptional<z.ZodNumber>;
      passwordFile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  memory: z.ZodOptional<z.ZodObject<{
    citations: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"on">, z.ZodLiteral<"off">]>>;
    search: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
      sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
      extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        path: z.ZodString;
        pattern: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>>;
      multimodal: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      experimental: z.ZodOptional<z.ZodObject<{
        sessionMemory: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      remote: z.ZodOptional<z.ZodObject<{
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
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        batch: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      fallback: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      inputType: z.ZodOptional<z.ZodString>;
      queryInputType: z.ZodOptional<z.ZodString>;
      documentInputType: z.ZodOptional<z.ZodString>;
      outputDimensionality: z.ZodOptional<z.ZodNumber>;
      local: z.ZodOptional<z.ZodObject<{
        modelPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      store: z.ZodOptional<z.ZodObject<{
        fts: z.ZodOptional<z.ZodObject<{
          tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
        }, z.core.$strict>>;
        vector: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          extensionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      query: z.ZodOptional<z.ZodObject<{
        maxResults: z.ZodOptional<z.ZodNumber>;
        minScore: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      cache: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  mcp: z.ZodOptional<z.ZodObject<{
    sessionIdleTtlMs: z.ZodOptional<z.ZodNumber>;
    servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      cwd: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
      requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
      supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
      auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
      oauth: z.ZodOptional<z.ZodObject<{
        identity: z.ZodOptional<z.ZodEnum<{
          "per-requester": "per-requester";
          shared: "shared";
        }>>;
        authProfileId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        redirectUrl: z.ZodOptional<z.ZodString>;
        clientMetadataUrl: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sslVerify: z.ZodOptional<z.ZodBoolean>;
      clientCert: z.ZodOptional<z.ZodString>;
      clientKey: z.ZodOptional<z.ZodString>;
      toolFilter: z.ZodOptional<z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodString>>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      codex: z.ZodOptional<z.ZodObject<{
        agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
          approve: "approve";
          auto: "auto";
          prompt: "prompt";
        }>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
    apps: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      sandboxOrigin: z.ZodOptional<z.ZodString>;
      sandboxPort: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodObject<{
    allowBundled: z.ZodOptional<z.ZodArray<z.ZodString>>;
    load: z.ZodOptional<z.ZodObject<{
      extraDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowSymlinkTargets: z.ZodOptional<z.ZodArray<z.ZodString>>;
      watch: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    install: z.ZodOptional<z.ZodObject<{
      preferBrew: z.ZodOptional<z.ZodBoolean>;
      nodeManager: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"npm">, z.ZodLiteral<"pnpm">, z.ZodLiteral<"yarn">, z.ZodLiteral<"bun">]>>;
      allowUploadedArchives: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    limits: z.ZodOptional<z.ZodObject<{
      maxCandidatesPerRoot: z.ZodOptional<z.ZodNumber>;
      maxSkillsLoadedPerSource: z.ZodOptional<z.ZodNumber>;
      maxSkillsInPrompt: z.ZodOptional<z.ZodNumber>;
      maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
      maxSkillFileBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    workshop: z.ZodOptional<z.ZodObject<{
      autonomous: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"propose">, z.ZodLiteral<"auto">]>>;
      }, z.core.$strict>>;
      approvalPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"auto">]>>;
      maxPending: z.ZodOptional<z.ZodNumber>;
      maxSkillBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
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
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  plugins: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    load: z.ZodOptional<z.ZodObject<{
      paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    slots: z.ZodOptional<z.ZodObject<{
      memory: z.ZodOptional<z.ZodString>;
      contextEngine: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      hooks: z.ZodOptional<z.ZodObject<{
        allowPromptInjection: z.ZodOptional<z.ZodBoolean>;
        allowConversationAccess: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        timeouts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
      }, z.core.$strict>>;
      subagent: z.ZodOptional<z.ZodObject<{
        allowModelOverride: z.ZodOptional<z.ZodBoolean>;
        allowedModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      llm: z.ZodOptional<z.ZodObject<{
        allowModelOverride: z.ZodOptional<z.ZodBoolean>;
        allowedModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowedCompletionModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowAuthProfileOverride: z.ZodOptional<z.ZodBoolean>;
        allowAgentIdOverride: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  surfaces: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    silentReply: z.ZodOptional<z.ZodObject<{
      group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
      internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>>;
  proxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    proxyUrl: z.ZodOptional<z.ZodURL>;
    tls: z.ZodOptional<z.ZodObject<{
      caFile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    loopbackMode: z.ZodOptional<z.ZodEnum<{
      block: "block";
      "gateway-only": "gateway-only";
      proxy: "proxy";
    }>>;
  }, z.core.$strict>>;
};
//#endregion
//#region src/config/types.skills.d.ts
type SkillsSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.skills>>;
/** Per-skill runtime override keyed by skill name or source-specific skill key. */
type SkillConfig = Omit<NonNullable<SkillsSchemaInput["entries"]>[string], "apiKey"> & {
  /** Optional secret made available to the skill runtime through skill env handling. */
  apiKey?: SecretInput;
};
/** Limits that bound skill discovery and model-facing prompt expansion. */
type SkillsLimitsConfig = NonNullable<SkillsSchemaInput["limits"]>;
/** Top-level skills config block in openclaw config. */
type SkillsConfig = Omit<SkillsSchemaInput, "entries"> & {
  entries?: Record<string, SkillConfig>;
};
//#endregion
//#region src/config/zod-schema.agents.d.ts
declare const BindingsSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodOptional<z.ZodLiteral<"route">>;
  agentId: z.ZodString;
  comment: z.ZodOptional<z.ZodString>;
  match: z.ZodObject<{
    channel: z.ZodString;
    accountId: z.ZodOptional<z.ZodString>;
    peer: z.ZodOptional<z.ZodObject<{
      kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
      id: z.ZodString;
    }, z.core.$strict>>;
    guildId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>;
  session: z.ZodOptional<z.ZodObject<{
    dmScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-account-channel-peer": "per-account-channel-peer";
      "per-channel-peer": "per-channel-peer";
      "per-peer": "per-peer";
    }>>;
    groupScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-group": "per-group";
    }>>;
  }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"acp">;
  agentId: z.ZodString;
  comment: z.ZodOptional<z.ZodString>;
  match: z.ZodObject<{
    channel: z.ZodString;
    accountId: z.ZodOptional<z.ZodString>;
    peer: z.ZodOptional<z.ZodObject<{
      kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
      id: z.ZodString;
    }, z.core.$strict>>;
    guildId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>;
  acp: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      oneshot: "oneshot";
      persistent: "persistent";
    }>>;
    label: z.ZodOptional<z.ZodString>;
    cwd: z.ZodOptional<z.ZodString>;
    backend: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>]>>>;
//#endregion
//#region src/config/types.agents.d.ts
type SchemaAgentBinding = NonNullable<z.input<typeof BindingsSchema>>[number];
type AgentRouteBinding = Extract<SchemaAgentBinding, {
  type?: "route";
}>;
type AgentAcpBinding = Extract<SchemaAgentBinding, {
  type: "acp";
}>;
type AgentBinding = AgentRouteBinding | AgentAcpBinding;
type AgentConfig = z.input<typeof AgentEntryBaseSchema> & {
  /** @deprecated Raw legacy list compatibility only; canonical agents.entries rejects this key. */
  default?: boolean;
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentModelEntryConfig["agentRuntime"];
  /** @deprecated Legacy per-agent compaction config is kept for raw doctor migration/repair. */
  compaction?: AgentDefaultsConfig["compaction"];
  memory?: {
    search?: MemorySearchConfig;
  };
  humanDelay?: HumanDelayConfig;
  typingMode?: AgentDefaultsConfig["typingMode"];
  tts?: TtsConfig & {
    prefsPath?: string;
  };
  skillsLimits?: Pick<SkillsLimitsConfig, "maxSkillsPromptChars">;
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: Omit<NonNullable<AgentDefaultsConfig["heartbeat"]>, "agentId">;
  identity?: IdentityConfig;
  groupChat?: Omit<GroupChatConfig, "visibleReplies">;
  /** Optional per-agent sandbox overrides. */
  sandbox?: AgentSandboxConfig;
  tools?: AgentToolsConfig;
};
type AgentEntryConfig = Omit<AgentConfig, "id">;
type AgentsConfig = {
  ownership?: "explicit";
  defaults?: AgentDefaultsConfig;
  entries?: Record<string, AgentEntryConfig>;
  /** Internal non-serialized projection materialized by validation for ID-based runtime code. */
  list?: AgentConfig[];
};
//#endregion
//#region packages/acp-core/src/runtime/types.d.ts
/** Runtime update tags emitted by ACP adapters; unknown backend tags are passed through. */
type AcpSessionUpdateTag = "agent_message_chunk" | "agent_thought_chunk" | "tool_call" | "tool_call_update" | "usage_update" | "available_commands_update" | "current_mode_update" | "config_option_update" | "session_info_update" | "plan" | (string & {});
//#endregion
//#region src/config/types.acp.d.ts
type SchemaAcpConfig = NonNullable<z.input<typeof OpenClawSchemaShape.acp>>;
type AcpStreamConfig = Omit<NonNullable<SchemaAcpConfig["stream"]>, "tagVisibility"> & {
  tagVisibility?: Partial<Record<AcpSessionUpdateTag, boolean>>;
};
type AcpConfig = Omit<SchemaAcpConfig, "stream"> & {
  stream?: AcpStreamConfig;
};
//#endregion
//#region src/config/zod-schema.root-support.d.ts
declare const AccessGroupsSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"discord.channelAudience">;
  guildId: z.ZodString;
  channelId: z.ZodString;
  membership: z.ZodOptional<z.ZodLiteral<"canViewChannel">>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"message.senders">;
  members: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strict>], "type">>>;
declare const TalkSchema: z.ZodObject<{
  agentId: z.ZodOptional<z.ZodString>;
  provider: z.ZodOptional<z.ZodString>;
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
  }, z.core.$catchall<z.ZodUnknown>>>>;
  realtime: z.ZodOptional<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
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
    }, z.core.$catchall<z.ZodUnknown>>>>;
    model: z.ZodOptional<z.ZodString>;
    speakerVoice: z.ZodOptional<z.ZodString>;
    speakerVoiceId: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
      realtime: "realtime";
      "stt-tts": "stt-tts";
      transcription: "transcription";
    }>>;
    transport: z.ZodOptional<z.ZodEnum<{
      "gateway-relay": "gateway-relay";
      "managed-room": "managed-room";
      "provider-websocket": "provider-websocket";
      webrtc: "webrtc";
    }>>;
    vadThreshold: z.ZodOptional<z.ZodNumber>;
    silenceDurationMs: z.ZodOptional<z.ZodNumber>;
    prefixPaddingMs: z.ZodOptional<z.ZodNumber>;
    reasoningEffort: z.ZodOptional<z.ZodString>;
    brain: z.ZodOptional<z.ZodEnum<{
      "agent-consult": "agent-consult";
      "direct-tools": "direct-tools";
      none: "none";
    }>>;
    consultRouting: z.ZodOptional<z.ZodEnum<{
      "force-agent-consult": "force-agent-consult";
      "provider-direct": "provider-direct";
    }>>;
  }, z.core.$strict>>;
  consultThinkingLevel: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  consultFastMode: z.ZodOptional<z.ZodBoolean>;
  speechLocale: z.ZodOptional<z.ZodString>;
  interruptOnSpeech: z.ZodOptional<z.ZodBoolean>;
  silenceTimeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const McpConfigSchema: z.ZodOptional<z.ZodObject<{
  sessionIdleTtlMs: z.ZodOptional<z.ZodNumber>;
  servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    cwd: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
    requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
    supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
    auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
    oauth: z.ZodOptional<z.ZodObject<{
      identity: z.ZodOptional<z.ZodEnum<{
        "per-requester": "per-requester";
        shared: "shared";
      }>>;
      authProfileId: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodString>;
      redirectUrl: z.ZodOptional<z.ZodString>;
      clientMetadataUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    sslVerify: z.ZodOptional<z.ZodBoolean>;
    clientCert: z.ZodOptional<z.ZodString>;
    clientKey: z.ZodOptional<z.ZodString>;
    toolFilter: z.ZodOptional<z.ZodObject<{
      include: z.ZodOptional<z.ZodArray<z.ZodString>>;
      exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    codex: z.ZodOptional<z.ZodObject<{
      agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
      defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
        approve: "approve";
        auto: "auto";
        prompt: "prompt";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
  apps: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    sandboxOrigin: z.ZodOptional<z.ZodString>;
    sandboxPort: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const NodeHostSchema: z.ZodOptional<z.ZodObject<{
  autoUpdate: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  agentRuns: z.ZodOptional<z.ZodObject<{
    claude: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  workerRuns: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    capacity: z.ZodOptional<z.ZodNumber>;
    isolation: z.ZodOptional<z.ZodEnum<{
      container: "container";
      none: "none";
    }>>;
    containerImage: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  browserProxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowProfiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  mcp: z.ZodOptional<z.ZodObject<{
    servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      cwd: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
      requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
      supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
      auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
      oauth: z.ZodOptional<z.ZodObject<{
        identity: z.ZodOptional<z.ZodEnum<{
          "per-requester": "per-requester";
          shared: "shared";
        }>>;
        authProfileId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        redirectUrl: z.ZodOptional<z.ZodString>;
        clientMetadataUrl: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sslVerify: z.ZodOptional<z.ZodBoolean>;
      clientCert: z.ZodOptional<z.ZodString>;
      clientKey: z.ZodOptional<z.ZodString>;
      toolFilter: z.ZodOptional<z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodString>>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      codex: z.ZodOptional<z.ZodObject<{
        agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
          approve: "approve";
          auto: "auto";
          prompt: "prompt";
        }>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.access-groups.d.ts
type AccessGroupsConfig = NonNullable<z.input<typeof AccessGroupsSchema>>;
type AccessGroupConfig = AccessGroupsConfig[string];
//#endregion
//#region src/config/types.auth.d.ts
type AuthProfileConfig = {
  /** Provider id this auth profile can satisfy. */
  provider: string;
  /**
   * Auth route selected by this profile id.
   * - api_key: static provider API key
   * - oauth: refreshable OAuth credentials (access+refresh+expires)
   * - token: static bearer-style token (optionally expiring; no refresh)
   * - aws-sdk: AWS SDK default credential chain (no secret in auth-profiles.json)
   */
  mode: "api_key" | "aws-sdk" | "oauth" | "token";
  /** Optional account email shown in profile selection/status surfaces. */
  email?: string;
  /** Optional human-readable label shown in profile selection/status surfaces. */
  displayName?: string;
};
type AuthConfig = {
  /** Named auth profiles keyed by profile id. */
  profiles?: Record<string, AuthProfileConfig>;
  /** Preferred profile order per provider id. */
  order?: Record<string, string[]>;
};
//#endregion
//#region src/config/types.ssrf.d.ts
type SsrFPolicyConfig = z.input<typeof SsrFPolicyConfigSchema>;
//#endregion
//#region src/config/types.browser.d.ts
type BrowserSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.browser>>;
type BrowserProfileConfig = NonNullable<BrowserSchemaInput["profiles"]>[string] & {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */
  color?: string;
};
type BrowserSsrFPolicyConfig = SsrFPolicyConfig;
type BrowserConfig = Omit<BrowserSchemaInput, "profiles" | "ssrfPolicy"> & {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */
  color?: string;
  /** Named browser profiles with explicit CDP ports or URLs. */
  profiles?: Record<string, BrowserProfileConfig>;
  /** SSRF policy for browser navigation/open-tab operations. */
  ssrfPolicy?: BrowserSsrFPolicyConfig;
};
//#endregion
//#region src/config/zod-schema.cloud-workers.d.ts
declare const CloudWorkersConfigSchema: z.ZodOptional<z.ZodObject<{
  desktop: z.ZodOptional<z.ZodBoolean>;
  preparedPool: z.ZodOptional<z.ZodObject<{
    maxTotal: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  projectProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    provider: z.ZodString;
    install: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      bundle: "bundle";
      npm: "npm";
    }>>>;
    suspendAfter: z.ZodOptional<z.ZodString>;
    readyWorkers: z.ZodOptional<z.ZodNumber>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strict>>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.cloud-workers.d.ts
type CloudWorkersConfig = NonNullable<z.input<typeof CloudWorkersConfigSchema>>;
//#endregion
//#region src/config/zod-schema.desktop.d.ts
declare const DesktopConfigSchema: z.ZodOptional<z.ZodObject<{
  host: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodBoolean;
    managed: z.ZodOptional<z.ZodBoolean>;
    port: z.ZodOptional<z.ZodNumber>;
    passwordFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.desktop.d.ts
type DesktopConfig = NonNullable<z.input<typeof DesktopConfigSchema>>;
//#endregion
//#region packages/llm-core/src/model-data.d.ts
declare const MODEL_DATA_THINKING_FORMATS: readonly ["openai", "openrouter", "deepseek", "together", "qwen", "qwen-chat-template", "zai"];
type ModelDataThinkingFormat = (typeof MODEL_DATA_THINKING_FORMATS)[number];
declare const MODEL_DATA_THINKING_LEVELS: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "max"];
type ModelDataThinkingLevel = (typeof MODEL_DATA_THINKING_LEVELS)[number];
type ModelDataThinkingLevelMap = Partial<Record<ModelDataThinkingLevel, string | null>>;
type ModelDataImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */
  maxBytes?: number;
  /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number;
  /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number;
  /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number;
  /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};
type ModelDataMediaInputConfig = {
  /** Image input limits and accounting hints for this model. */
  image?: ModelDataImageInputConfig;
};
/** Per-million-token rates for separately billed token buckets. */
type ModelDataCostRates = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type ModelDataRawPricingTier = ModelDataCostRates & {
  /** Half-open prompt-token interval; `[start]` is an open-ended upper tier. */
  range: [number, number] | [number];
};
type ModelRoutingSortConfig = {
  /** The sorting metric: "price", "throughput", "latency". */
  by?: string;
  /** Partitioning strategy: "model" (default) or "none". */
  partition?: string | null;
};
type ModelRoutingMaxPrice = {
  /** Price per million prompt tokens. */
  prompt?: number | string;
  /** Price per million completion tokens. */
  completion?: number | string;
  /** Price per image. */
  image?: number | string;
  /** Price per audio unit. */
  audio?: number | string;
  /** Price per request. */
  request?: number | string;
};
/** Percentile targets in the owning field's throughput or latency units. */
type ModelRoutingPercentiles = {
  p50?: number;
  p75?: number;
  p90?: number;
  p99?: number;
};
//#endregion
//#region packages/model-catalog-core/src/model-catalog-types.d.ts
/** Supported API protocols for model catalog entries. */
declare const MODEL_CATALOG_APIS: readonly ["openai-completions", "openai-responses", "openai-chatgpt-responses", "anthropic-messages", "google-generative-ai", "google-vertex", "github-copilot", "bedrock-converse-stream", "ollama", "pi-messages", "azure-openai-responses"];
/** API protocol for a model catalog entry. */
type ModelCatalogApi = (typeof MODEL_CATALOG_APIS)[number];
/** Supported model thinking/reasoning wire formats. */
declare const MODEL_CATALOG_THINKING_FORMATS: readonly ["openai", "openrouter", "deepseek", "together", "qwen", "qwen-chat-template", "zai"];
/** Thinking/reasoning wire format for model compatibility. */
type ModelCatalogThinkingFormat = (typeof MODEL_CATALOG_THINKING_FORMATS)[number];
/** Compatibility flags and provider-specific routing metadata for one model. */
type ModelCatalogCompatConfig = {
  supportsStore?: boolean;
  supportsDeveloperRole?: boolean;
  supportsReasoningEffort?: boolean;
  /** Whether the model accepts the temperature parameter (GPT-5.6 family rejects it). */
  supportsTemperature?: boolean;
  /** Whether the provider honors top-level `instructions` on Responses requests. */
  supportsInstructions?: boolean;
  supportsUsageInStreaming?: boolean;
  supportsStrictMode?: boolean;
  supportsJsonSchemaResponseFormat?: boolean;
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  requiresToolResultName?: boolean;
  requiresAssistantAfterToolResult?: boolean;
  requiresThinkingAsText?: boolean;
  requiresReasoningContentOnAssistantMessages?: boolean;
  openRouterRouting?: ModelCatalogOpenRouterRouting;
  vercelGatewayRouting?: ModelCatalogVercelGatewayRouting;
  zaiToolStream?: boolean;
  cacheControlFormat?: "anthropic";
  sendSessionAffinityHeaders?: boolean;
  sendSessionIdHeader?: boolean;
  supportsEagerToolInputStreaming?: boolean;
  supportsLongCacheRetention?: boolean;
  supportsPromptCacheKey?: boolean;
  /** Explicit per-model opt-in for HTTP continuation on a custom/proxy OpenAI-Responses-compatible endpoint. */
  supportsResponsesContinuation?: boolean;
  supportsTools?: boolean;
  /** Code-mode tier consumed by `tools.codeMode.enabled: "auto"`; absent means "capable". */
  codeMode?: "preferred" | "capable";
  requiresStringContent?: boolean;
  strictMessageKeys?: boolean;
  toolSchemaProfile?: string;
  unsupportedToolSchemaKeywords?: string[];
  toolCallArgumentsEncoding?: string;
  requiresOpenAiAnthropicToolPayload?: boolean;
  thinkingFormat?: ModelCatalogThinkingFormat;
  supportedReasoningEfforts?: string[];
  reasoningEffortMap?: Record<string, string>;
  visibleReasoningDetailTypes?: string[];
};
/** OpenRouter routing preferences copied into request metadata. */
type ModelCatalogOpenRouterRouting = {
  allow_fallbacks?: boolean;
  require_parameters?: boolean;
  data_collection?: "deny" | "allow";
  zdr?: boolean;
  enforce_distillable_text?: boolean;
  order?: string[];
  only?: string[];
  ignore?: string[];
  quantizations?: string[];
  sort?: string | ModelRoutingSortConfig;
  max_price?: ModelRoutingMaxPrice;
  preferred_min_throughput?: number | ModelRoutingPercentiles;
  preferred_max_latency?: number | ModelRoutingPercentiles;
};
/** Vercel AI Gateway routing preferences. */
type ModelCatalogVercelGatewayRouting = {
  only?: string[];
  order?: string[];
};
/** Media input limits for a model. */
type ModelCatalogMediaInputConfig = ModelDataMediaInputConfig;
/** Supported input modality for a model. */
type ModelCatalogInput = "text" | "image" | "document";
type ModelCatalogThinkingLevelMap = ModelDataThinkingLevelMap;
/** Discovery lifecycle for a provider catalog. */
type ModelCatalogDiscovery = "static" | "refreshable" | "runtime";
/** Availability state for a model. */
type ModelCatalogStatus = "available" | "preview" | "deprecated" | "disabled";
/** Unified catalog kind across text and generated media models. */
type UnifiedModelCatalogKind = "text" | "voice" | "image_generation" | "video_generation" | "music_generation";
/** Source for unified model catalog entries. */
type UnifiedModelCatalogSource = "manifest" | "provider-index" | "static" | "live" | "cache" | "configured" | "runtime-refresh";
/** Unified model catalog entry for provider/model pickers. */
type UnifiedModelCatalogEntry<TCapabilities = unknown> = {
  kind: UnifiedModelCatalogKind;
  provider: string;
  model: string;
  label?: string;
  source: UnifiedModelCatalogSource;
  default?: boolean;
  configured?: boolean;
  capabilities?: TCapabilities;
  modes?: readonly string[];
  authEnvVars?: readonly string[];
  docsPath?: string;
  fetchedAt?: number;
  expiresAt?: number;
  warnings?: readonly string[];
};
/** Tiered token cost row. */
type ModelCatalogTieredCost = ModelDataRawPricingTier;
/** Token cost metadata for one model. */
type ModelCatalogCost = Partial<ModelDataCostRates> & {
  tieredPricing?: ModelCatalogTieredCost[];
};
/** Bounded provider-declared context-window choice for one model. */
type ModelCatalogContextWindowOption = {
  id: string;
  label: string;
  contextWindow: number;
};
/** Provider manifest model entry. */
type ModelCatalogModel = {
  id: string;
  name?: string;
  api?: ModelCatalogApi;
  baseUrl?: string;
  headers?: Record<string, string>;
  input?: ModelCatalogInput[];
  reasoning?: boolean;
  contextWindow?: number;
  contextWindows?: ModelCatalogContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  maxTokens?: number;
  thinkingLevelMap?: ModelCatalogThinkingLevelMap;
  cost?: ModelCatalogCost;
  compat?: ModelCatalogCompatConfig;
  /**
   * Provider/model ref of the same upstream model in another bundled catalog,
   * for vendors reachable through several provider ids under different model
   * ids. Authoring metadata only: normalization drops it, and the shared-model
   * contract test uses it to keep `compat` capability tiers from drifting apart.
   */
  upstreamModel?: string;
  mediaInput?: ModelCatalogMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
  tags?: string[];
};
/** Provider manifest catalog entry. */
type ModelCatalogProvider = {
  baseUrl?: string;
  api?: ModelCatalogApi;
  headers?: Record<string, string>;
  /** Provider-recommended primary model id. */
  defaultModel?: string;
  /** Provider-recommended small model id for short internal utility tasks. */
  defaultUtilityModel?: string;
  models: ModelCatalogModel[];
};
/** Provider alias entry. */
type ModelCatalogAlias = {
  provider: string;
  api?: ModelCatalogApi;
  baseUrl?: string;
};
/** Suppression rule for hiding a provider/model under matching config. */
type ModelCatalogSuppression = {
  provider: string;
  model: string;
  reason?: string;
  /** Explicit retirement and optional provider-local successor; otherwise doctor clears overrides. */
  retirement?: {
    replacedBy?: string;
  };
  when?: {
    baseUrlHosts?: string[];
    providerConfigApiIn?: string[];
  };
};
/** Raw model catalog manifest shape. */
type ModelCatalog = {
  /** Publication-time opt-in: owned OpenClaw provider id -> models.dev provider id. */
  modelsDev?: Record<string, string>;
  providers?: Record<string, ModelCatalogProvider>;
  aliases?: Record<string, ModelCatalogAlias>;
  suppressions?: ModelCatalogSuppression[];
  discovery?: Record<string, ModelCatalogDiscovery>;
  runtimeAugment?: boolean;
};
//#endregion
//#region packages/model-catalog-core/src/model-catalog-pricing.d.ts
declare const MODEL_PRICING_SOURCES: readonly [{
  readonly id: "openCode";
  readonly label: "OpenCode";
  readonly url: "https://models.opencode.ai/api.json";
  readonly authoritative: true;
}, {
  readonly id: "venice";
  readonly label: "Venice";
  readonly url: "https://api.venice.ai/api/v1/models";
  readonly authoritative: true;
}, {
  readonly id: "chutes";
  readonly label: "Chutes";
  readonly url: "https://llm.chutes.ai/v1/models";
  readonly authoritative: true;
}, {
  readonly id: "cerebras";
  readonly label: "Cerebras";
  readonly url: "https://api.cerebras.ai/public/v1/models";
  readonly authoritative: true;
}, {
  readonly id: "deepinfra";
  readonly label: "DeepInfra";
  readonly url: "https://api.deepinfra.com/models/list";
  readonly authoritative: true;
}, {
  readonly id: "openRouter";
  readonly label: "OpenRouter";
  readonly url: "https://openrouter.ai/api/v1/models";
  readonly authoritative: false;
}, {
  readonly id: "liteLLM";
  readonly label: "LiteLLM";
  readonly url: "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json";
  readonly authoritative: false;
}];
type ModelPricingSourceId = (typeof MODEL_PRICING_SOURCES)[number]["id"];
type ModelPricingSource = {
  provider?: string;
  passthroughProviderModel?: boolean;
  modelIdTransforms?: "version-dots"[];
};
type ModelPricingProvider = {
  external?: boolean;
} & Partial<Record<ModelPricingSourceId, ModelPricingSource | false>>;
//#endregion
//#region packages/plugin-package-contract/src/categories.d.ts
declare const ACCEPTED_PLUGIN_CATEGORY_SLUGS: readonly ["channels", "models", "agent-runtimes", "memory", "context", "voice", "web", "media", "security", "integrations", "developer-tools", "infrastructure", "documents-files", "inbox-collaboration", "productivity", "scheduling", "finance-payments", "sales-marketing", "data-analytics", "agent-orchestration", "research", "other", "tools", "runtime", "gateway"];
type PluginCategorySlug = (typeof ACCEPTED_PLUGIN_CATEGORY_SLUGS)[number];
//#endregion
//#region src/shared/config-ui-hints-types.d.ts
type ConfigUiPresentation = "phone-number";
/** Authored groups of immediate object properties; descendants stay with their parent. */
type ConfigUiGroup = {
  id: string;
  title: string;
  order?: number;
  properties: string[];
};
//#endregion
//#region src/shared/json-schema.types.d.ts
/** TypeBox schema value widened for generic JSON-schema object transforms. */
type JsonSchemaObject = TSchema & Record<string, unknown>;
//#endregion
//#region src/channels/plugins/types.config.d.ts
/** Optional UI metadata for a JSON Schema property. */
type ChannelConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  presentation?: ConfigUiPresentation;
  itemTemplate?: unknown;
};
/** Normalized validation issue emitted by a channel runtime parser. */
type ChannelConfigRuntimeIssue = {
  path?: Array<string | number>;
  message?: string;
  code?: string;
} & Record<string, unknown>;
/** Minimal safeParse result shape accepted from channel-owned validators. */
type ChannelConfigRuntimeParseResult = {
  success: true;
  data: unknown;
} | {
  success: false;
  issues: ChannelConfigRuntimeIssue[];
};
/** Runtime validator contract paired with the JSON Schema config surface. */
type ChannelConfigRuntimeSchema = {
  safeParse: (value: unknown) => ChannelConfigRuntimeParseResult;
};
/** Complete channel config schema description exposed to host tooling. */
type ChannelConfigSchema = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
};
//#endregion
//#region src/routing/account-lookup.d.ts
type ChannelAccountKeyPolicy = {
  canonicalAliasesRequireOwnField: string;
};
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.d.ts
type DoctorSessionRouteStateOwner = {
  id: string;
  label: string;
  providerIds?: readonly string[];
  runtimeIds?: readonly string[];
  cliSessionKeys?: readonly string[];
  authProfilePrefixes?: readonly string[];
};
//#endregion
//#region src/plugins/manifest-command-aliases.d.ts
type PluginManifestCommandAliasKind = "runtime-slash";
/** One command alias declared by a plugin manifest. */
type PluginManifestCommandAlias = {
  /** Command-like name users may put in plugin config by mistake. */
  name: string;
  /** Command family, used for targeted diagnostics. */
  kind?: PluginManifestCommandAliasKind;
  /** Optional root CLI command that handles related CLI operations. */
  cliCommand?: string;
};
//#endregion
//#region src/plugins/plugin-kind.types.d.ts
/** Plugin kind labels for non-provider plugin capability groups. */
type PluginKind = "memory" | "context-engine";
//#endregion
//#region src/plugins/manifest-types.d.ts
/** UI hint metadata for plugin config schema fields. */
type PluginConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  presentation?: ConfigUiPresentation;
};
/** Static, portable palettes; no plugin JavaScript or native UI activation is required. */
type PluginManifestTheme = {
  id: string;
  name: string;
  description: string;
  source: string;
  hats?: Record<string, string>;
  critters?: Record<string, {
    source: string;
    title?: string;
    crossMs?: number;
  }>;
};
/** Top-level plugin manifest format. */
type PluginFormat = "openclaw" | "bundle";
/** Supported external bundle manifest formats. */
type PluginBundleFormat = "agent" | "codex" | "claude" | "cursor";
/**
 * Closed classification codes for plugin diagnostics. Health surfaces branch
 * on these instead of matching freeform diagnostic message text.
 */
type PluginDiagnosticCode = "backup-resource-declaration-invalid" | "channel-setup-failure" | "configured-plugin-path-inspection-failed" | "configured-plugin-path-unavailable" | "dashboard-declaration-invalid" | "plugin-verification" | "sdk-incompatible" | "workspace-scope-omitted";
/** Diagnostic emitted while discovering or validating plugins. */
type PluginDiagnostic = {
  level: "warn" | "error";
  message: string;
  pluginId?: string;
  source?: string;
  code?: PluginDiagnosticCode;
  configDisposition?: "preserve";
  errorCode?: string;
  fixHint?: string;
  sdkCompatibility?: {
    seam: string;
    coreVersion: string;
    builtWithOpenClawVersion?: string;
    nestedSdk: boolean;
  };
};
type PluginManifestChannelConfig = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, PluginConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
  label?: string;
  description?: string;
  preferOver?: string[];
  commands?: PluginManifestChannelCommandDefaults;
};
type PluginManifestChannelCommandDefaults = {
  nativeCommandsAutoEnabled?: boolean;
  nativeSkillsAutoEnabled?: boolean;
};
type PluginManifestModelSupport = {
  /**
   * Cheap manifest-owned model-id prefixes for transparent provider activation
   * from shorthand model refs such as `gpt-5.4` or `claude-sonnet-4.6`.
   */
  modelPrefixes?: string[];
  /**
   * Regex sources matched against the raw model id after profile suffixes are
   * stripped. Use this when simple prefixes are not expressive enough.
   */
  modelPatterns?: string[];
};
type PluginManifestModelCatalog = ModelCatalog;
type PluginManifestModelPricing = {
  providers?: Record<string, ModelPricingProvider>;
};
type PluginManifestModelIdPrefixRule = {
  modelPrefix: string;
  prefix: string;
};
type PluginManifestModelIdNormalizationProvider = {
  aliases?: Record<string, string>;
  stripPrefixes?: string[];
  prefixWhenBare?: string;
  prefixWhenBareAfterAliasStartsWith?: PluginManifestModelIdPrefixRule[];
};
type PluginManifestModelIdNormalization = {
  providers?: Record<string, PluginManifestModelIdNormalizationProvider>;
};
type PluginManifestProviderEndpoint = {
  /**
   * Core endpoint class this plugin-owned endpoint should map to. Core must
   * already know the class; manifests own host/baseUrl matching metadata.
   */
  endpointClass: string;
  /** Hostnames that should resolve to this endpoint class. */
  hosts?: string[];
  /** Host suffixes that should resolve to this endpoint class. */
  hostSuffixes?: string[];
  /** Exact normalized base URLs that should resolve to this endpoint class. */
  baseUrls?: string[];
  /** Static Google Vertex region metadata for exact global hosts. */
  googleVertexRegion?: string;
  /** Host suffix whose prefix should be exposed as the Google Vertex region. */
  googleVertexRegionHostSuffix?: string;
};
type PluginManifestProviderRequestProvider = {
  family?: string;
  compatibilityFamily?: "moonshot";
  openAICompletions?: {
    supportsStreamingUsage?: boolean;
  };
};
type PluginManifestProviderRequest = {
  providers?: Record<string, PluginManifestProviderRequestProvider>;
};
type PluginManifestSecretProviderIntegration = {
  providerAlias?: string;
  displayName?: string;
  description?: string;
  source: "exec";
  command: "${node}";
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
};
type PluginManifestActivationCapability = "provider" | "channel" | "tool" | "hook";
type PluginManifestActivation = {
  /**
   * Explicit Gateway startup activation. Set true when the plugin must be
   * imported during Gateway startup; set false when narrower activation
   * triggers should load it on demand.
   */
  onStartup?: boolean;
  /**
   * Provider ids that should include this plugin in activation/load plans.
   * This is planner metadata only; runtime behavior still comes from register().
   */
  onProviders?: string[];
  /** Agent harness runtime ids that should include this plugin in activation/load plans. */
  onAgentHarnesses?: string[];
  /** Command ids that should include this plugin in activation/load plans. */
  onCommands?: string[];
  /** Channel ids that should include this plugin in activation/load plans. */
  onChannels?: string[];
  /** Route kinds that should include this plugin in activation/load plans. */
  onRoutes?: string[];
  /** Root-relative config paths that should include this plugin in startup/load plans. */
  onConfigPaths?: string[];
  /** Broad capability hints for activation/load plans. Prefer narrower ownership metadata. */
  onCapabilities?: PluginManifestActivationCapability[];
};
/** Root CLI command metadata available before plugin code is imported. */
type PluginManifestCliCommand = {
  name: string;
  description: string;
  hasSubcommands: boolean;
};
type PluginManifestDefaultPlatform = NodeJS.Platform;
type PluginManifestSetupProvider = {
  /** Provider id surfaced during setup/onboarding. */
  id: string;
  /** Setup/auth methods that this provider supports. */
  authMethods?: string[];
  /** Environment variables that can satisfy setup without runtime loading. */
  envVars?: string[];
  /**
   * Cheap local evidence that a provider can authenticate without loading
   * runtime code. Evidence checks must not read secrets, shell out, or call
   * provider APIs.
   */
  authEvidence?: PluginManifestSetupProviderAuthEvidence[];
};
type PluginManifestSetupProviderAuthEvidence = {
  /** Generic local file evidence gated by required environment metadata. */
  type: "local-file-with-env";
  /** Optional env var containing an explicit credential file path. */
  fileEnvVar?: string;
  /** Optional fallback credential file paths. Supports `${HOME}` and `${APPDATA}`. */
  fallbackPaths?: string[];
  /** At least one of these env vars must be non-empty when provided. */
  requiresAnyEnv?: string[];
  /** Every env var listed here must be non-empty when provided. */
  requiresAllEnv?: string[];
  /** Non-secret marker returned when this evidence is present. */
  credentialMarker: string;
  /** Human-readable auth source label. */
  source?: string;
};
type PluginManifestNativeSessionCatalogSetup = {
  /** Provider/product name shown in fresh-install consent. */
  label: string;
  /** Optional explanation of the native catalog source. */
  description?: string;
  /** Node commands that read or resume this native catalog. */
  nodeCommands?: string[];
  /** Host-generated upgrade exception for a previously shipped implicit-on catalog. */
  legacyDefaultEnabled?: boolean;
};
type PluginManifestSetup = {
  /** Cheap provider setup metadata exposed before runtime loads. */
  providers?: PluginManifestSetupProvider[];
  /** Setup-time backend ids available without full runtime activation. */
  cliBackends?: string[];
  /** Config migration ids owned by this plugin's setup surface. */
  configMigrations?: string[];
  /** Native conversation catalog controlled by config.sessionCatalog.enabled. */
  nativeSessionCatalog?: PluginManifestNativeSessionCatalogSetup;
  /**
   * Whether setup still needs plugin runtime execution after descriptor lookup.
   * Explicit false disables setup runtime; omission preserves the legacy fallback.
   */
  requiresRuntime?: boolean;
};
type PluginManifestDoctorContract = {
  configRepair?: boolean;
  resolveSessionStoreAgentIds?: boolean;
  /**
   * @deprecated Declare static ownership in top-level sessionRouteStateOwners instead.
   * Removal plan: remove the module fallback in OpenClaw 2027.1 after external plugins migrate.
   */
  sessionRouteStateOwners?: boolean;
  /**
   * Ordered migration identities that a candidate-bundled manifest exposes to read-only
   * planning without importing the Doctor contract. External installed artifacts remain
   * deferred until candidate staging binds their content identity.
   */
  stateMigrations?: boolean | Array<{
    id: string;
    doctorOnly?: true;
    phase?: "after-session-repair";
  }>;
};
type PluginManifestQaRunner = {
  /** Subcommand mounted beneath `openclaw qa`, for example `matrix`. */
  commandName: string;
  /** Optional user-facing help text for fallback host stubs. */
  description?: string;
};
type PluginManifestDashboardDataBinding = {
  /** Plugin-local id. Widget grants receive the plugin-id prefix. */
  id: string;
  /** Read-scoped Gateway method registered by this plugin. */
  method: string;
  description: string;
};
type PluginManifestDashboardActionVerb = {
  /** Plugin-local id. Widget grants receive the plugin-id prefix. */
  id: string;
  /** Write-scoped Gateway method registered by this plugin. */
  method: string;
  description: string;
  /** Optional JSON Schema for the action params object. */
  paramShape?: JsonSchemaObject;
};
type PluginManifestDashboard = {
  dataBindings?: PluginManifestDashboardDataBinding[];
  actionVerbs?: PluginManifestDashboardActionVerb[];
};
/** Built browser assets activated by the trusted native Control UI host. */
type PluginManifestControlUi = {
  /** JavaScript entry in a dedicated dist subdirectory, relative to the plugin root. */
  entry: string;
  /** Stylesheets in the same asset directory, loaded before activation. */
  styles?: string[];
};
type PluginManifestMcpServer = Record<string, unknown>;
type PluginManifestConfigLiteral = string | number | boolean | null;
type PluginManifestDangerousConfigFlag = {
  /**
   * Dot-separated config path relative to `plugins.entries.<id>.config`.
   * Supports `*` wildcards for map/array segments.
   */
  path: string;
  /** Exact literal that marks this config value as dangerous. */
  equals: PluginManifestConfigLiteral;
};
type PluginManifestSecretInputPath = {
  /**
   * Dot-separated config path relative to `plugins.entries.<id>.config`.
   * Supports `*` wildcards for map/array segments.
   */
  path: string;
  /** Expected resolved type for SecretRef materialization. */
  expected?: "string";
  /** Runtime owner kind used to isolate this surface when resolution fails. */
  ownerKind?: "capability" | "route";
};
type PluginManifestSecretInputContracts = {
  /**
   * Override bundled-plugin default enablement when deciding whether this
   * SecretRef surface is active. Use this when the plugin is bundled but the
   * surface should stay inactive until explicitly enabled in config.
   */
  bundledDefaultEnabled?: boolean;
  paths: PluginManifestSecretInputPath[];
};
type PluginManifestConfigContracts = {
  /**
   * Root-relative config paths that indicate this plugin's setup-time
   * compatibility migrations might apply. Use this to keep generic runtime
   * config reads from loading every plugin setup surface when the config does
   * not reference the plugin at all.
   */
  compatibilityMigrationPaths?: string[];
  /**
   * Root-relative compatibility paths that this plugin can service during
   * runtime before plugin code fully activates. Use this for legacy surfaces
   * that should cheaply narrow bundled candidate sets without importing every
   * compatible plugin runtime.
   */
  compatibilityRuntimePaths?: string[];
  dangerousFlags?: PluginManifestDangerousConfigFlag[];
  secretInputs?: PluginManifestSecretInputContracts;
};
type PluginManifestCatalog = {
  featured?: boolean;
  order?: number;
};
/** Static transcript setup metadata; runtime registration does not gate configuration. */
type PluginManifestTranscriptSource = {
  name?: string;
  autoStart?: Partial<Record<"accountId" | "guildId" | "channelId" | "meetingUrl", "optional" | "required">>;
};
/** Declarative backup ownership rooted at host-managed state or each configured agent. */
type PluginManifestBackupResource = {
  disposition: "include" | "regenerable";
  scope: "state" | "agent";
  relativePath: string;
};
type PluginManifestDecisionModel = {
  provider: string;
  id: string;
  name: string;
};
type PluginManifest = {
  id: string;
  configSchema: JsonSchemaObject;
  /** Ordered browse categories; the first category is the plugin's primary category. */
  categories?: PluginCategorySlug[];
  /** Static backup inclusion/exclusion declarations; resolved without loading plugin runtime. */
  backupResources?: PluginManifestBackupResource[];
  /** Plugin ids that must also be installed for this plugin to have effect. */
  requiresPlugins?: string[];
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: PluginManifestDefaultPlatform[];
  /** Legacy plugin ids that should normalize to this plugin id. */
  legacyPluginIds?: string[];
  /** Provider ids that should auto-enable this plugin when referenced in auth/config/models. */
  autoEnableWhenConfiguredProviders?: string[];
  kind?: PluginKind | PluginKind[];
  channels?: string[];
  /** Account-key selection rules available before channel runtime loads. */
  channelAccountKeyPolicies?: Record<string, ChannelAccountKeyPolicy>;
  providers?: string[];
  /**
   * Optional lightweight module that exports provider plugin metadata for
   * auth/catalog discovery. It should not import the full plugin runtime.
   */
  providerCatalogEntry?: string;
  /** Lightweight capability descriptor collections; omitted families retain register() discovery. */
  capabilityCatalogEntry?: string;
  /**
   * Cheap model-family ownership metadata used before plugin runtime loads.
   * Use this for shorthand model refs that omit an explicit provider prefix.
   */
  modelSupport?: PluginManifestModelSupport;
  /**
   * Declarative model catalog metadata used by future read-only listing,
   * onboarding, and model picker surfaces before provider runtime loads.
   */
  modelCatalog?: PluginManifestModelCatalog;
  /** Manifest-owned external pricing lookup policy for provider refs. */
  modelPricing?: PluginManifestModelPricing;
  /** Manifest-owned model-id normalization used before provider runtime loads. */
  modelIdNormalization?: PluginManifestModelIdNormalization;
  /** Cheap provider endpoint metadata used before provider runtime loads. */
  providerEndpoints?: PluginManifestProviderEndpoint[];
  /** Cheap provider request metadata used before provider runtime loads. */
  providerRequest?: PluginManifestProviderRequest;
  /** Declarative SecretRef provider presets owned by this plugin. */
  secretProviderIntegrations?: Record<string, PluginManifestSecretProviderIntegration>;
  /** Cheap startup activation lookup for plugin-owned CLI inference backends. */
  cliBackends?: string[];
  /**
   * Provider or CLI backend refs whose plugin-owned synthetic auth hook should
   * be probed during cold model discovery before the runtime registry exists.
   */
  syntheticAuthRefs?: string[];
  /**
   * Bundled-plugin-owned placeholder API key values that represent non-secret
   * local, OAuth, or ambient credential state.
   */
  nonSecretAuthMarkers?: string[];
  /**
   * Plugin-owned command aliases that should resolve to this plugin during
   * config diagnostics before runtime loads.
   */
  commandAliases?: PluginManifestCommandAlias[];
  /** Root commands advertised by help and activation planning before runtime loads. */
  cliCommands?: PluginManifestCliCommand[];
  /** Usage/billing credentials excluded from inference auth but included in secret scrubbing. */
  providerUsageAuthEnvVars?: Record<string, string[]>;
  /** Provider ids that should reuse another provider id for auth lookup. */
  providerAuthAliases?: Record<string, string | {
    provider: string;
    baseUrls: string[];
  }>;
  /**
   * Cheap onboarding/auth-choice metadata used by config validation, CLI help,
   * and non-runtime auth-choice routing before provider runtime loads.
   */
  providerAuthChoices?: PluginManifestProviderAuthChoice[];
  /** Cheap activation planner metadata exposed before plugin runtime loads. */
  activation?: PluginManifestActivation;
  /** Cheap setup/onboarding metadata exposed before plugin runtime loads. */
  setup?: PluginManifestSetup;
  /** Doctor contract surfaces available without loading the plugin artifact. */
  doctorContract?: PluginManifestDoctorContract;
  /** Whether the plugin public API registers structured health checks. */
  doctorHealthChecks?: boolean;
  /** Static ownership metadata for doctor session-route state repairs. */
  sessionRouteStateOwners?: DoctorSessionRouteStateOwner[];
  /** Cheap QA runner metadata exposed before plugin runtime loads. */
  qaRunners?: PluginManifestQaRunner[];
  /** Widget data and action capabilities validated against runtime registrations. */
  dashboard?: PluginManifestDashboard;
  controlUi?: PluginManifestControlUi;
  themes?: PluginManifestTheme[];
  /** Static MCP servers contributed while this plugin is enabled. */
  mcpServers?: Record<string, PluginManifestMcpServer>;
  skills?: string[];
  name?: string;
  description?: string;
  /** Optional presentation hints for plugin catalog surfaces. */
  catalog?: PluginManifestCatalog;
  version?: string;
  uiHints?: Record<string, PluginConfigUiHint>;
  configGroups?: ConfigUiGroup[];
  /**
   * Static capability ownership snapshot used for manifest-driven discovery,
   * compat wiring, and contract coverage without importing plugin runtime.
   */
  contracts?: PluginManifestContracts;
  /** Static model choices owned by contracts.decisionProviders; never conversational models. */
  decisionModels?: PluginManifestDecisionModel[];
  /** Setup descriptors keyed by ids owned in contracts.transcriptSourceProviders. */
  transcriptSources?: Record<string, PluginManifestTranscriptSource>;
  /** Cheap media-understanding provider defaults without importing plugin runtime. */
  mediaUnderstandingProviderMetadata?: Record<string, PluginManifestMediaUnderstandingProviderMetadata>;
  /** Cheap image-generation provider auth metadata without importing plugin runtime. */
  imageGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  /** Cheap video-generation provider auth metadata without importing plugin runtime. */
  videoGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  /** Cheap music-generation provider auth metadata without importing plugin runtime. */
  musicGenerationProviderMetadata?: Record<string, PluginManifestCapabilityProviderMetadata>;
  /** Cheap plugin-tool availability metadata without importing plugin runtime. */
  toolMetadata?: Record<string, PluginManifestToolMetadata>;
  /** Manifest-owned config behavior consumed by generic core helpers. */
  configContracts?: PluginManifestConfigContracts;
  channelConfigs?: Record<string, PluginManifestChannelConfig>;
};
type PluginManifestContracts = {
  /** Executor ids implemented by the plugin's code-mode-executor-api artifact. */
  codeModeExecutors?: string[];
  embeddedExtensionFactories?: string[];
  agentToolResultMiddleware?: string[];
  trustedToolPolicies?: string[];
  /**
   * Provider ids whose external auth profile hook can contribute runtime-only
   * credentials. Declaring this lets auth-store overlays load only the owning
   * plugin instead of every provider plugin.
   */
  externalAuthProviders?: string[];
  decisionProviders?: string[];
  embeddingProviders?: string[];
  speechProviders?: string[];
  realtimeTranscriptionProviders?: string[];
  realtimeVoiceProviders?: string[];
  mediaUnderstandingProviders?: string[];
  transcriptSourceProviders?: string[];
  documentExtractors?: string[];
  imageGenerationProviders?: string[];
  videoGenerationProviders?: string[];
  musicGenerationProviders?: string[];
  webContentExtractors?: string[];
  webFetchProviders?: string[];
  webSearchProviders?: string[];
  workerProviders?: string[];
  /** Provider ids whose plugin owns usage auth and snapshot hooks. */
  usageProviders?: string[];
  migrationProviders?: string[];
  gatewayMethodDispatch?: string[];
  tools?: string[];
};
type PluginManifestMediaUnderstandingCapability = "image" | "audio" | "video";
type PluginManifestMediaUnderstandingProviderMetadata = {
  capabilities?: PluginManifestMediaUnderstandingCapability[];
  defaultModels?: Partial<Record<PluginManifestMediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<PluginManifestMediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", {
    textExtraction?: string;
    image?: string | false;
  }>>;
};
type PluginManifestProviderBaseUrlGuard = {
  provider: string;
  defaultBaseUrl?: string;
  allowedBaseUrls: string[];
};
type PluginManifestCapabilityProviderAuthSignal = {
  provider: string;
  providerBaseUrl?: PluginManifestProviderBaseUrlGuard;
};
type PluginManifestCapabilityProviderModeConfigSignal = {
  path?: string;
  default?: string;
  allowed?: string[];
  disallowed?: string[];
};
type PluginManifestCapabilityProviderConfigSignal = {
  rootPath: string;
  overlayPath?: string;
  overlayMapPath?: string;
  required?: string[];
  requiredAny?: string[];
  mode?: PluginManifestCapabilityProviderModeConfigSignal;
};
type PluginManifestCapabilityProviderMetadata = {
  aliases?: string[];
  authProviders?: string[];
  authSignals?: PluginManifestCapabilityProviderAuthSignal[];
  configSignals?: PluginManifestCapabilityProviderConfigSignal[];
  referenceAudioInputs?: boolean;
};
type PluginManifestToolMetadata = PluginManifestCapabilityProviderMetadata & {
  optional?: boolean;
  /** Built-in tool profiles that expose this plugin tool by default. */
  profiles?: PluginManifestToolProfile[];
  /** Tool execution is safe to repeat after an incomplete model turn. */
  replaySafe?: boolean;
  /** Tool execution can change durable state and failed attempts must remain visible. */
  sideEffecting?: boolean;
};
type PluginManifestToolProfile = "minimal" | "coding" | "messaging" | "full";
type PluginManifestProviderAuthChoice = {
  /** Provider id owned by this manifest entry. */
  provider: string;
  /** Provider auth method id that this choice should dispatch to. */
  method: string;
  /** Stable auth-choice id used by onboarding and other CLI auth flows. */
  choiceId: string;
  /** Configure a utility model without replacing the regular agent primary. */
  modelTarget?: "utility";
  /** Supported Gateway host platforms; omission allows all, an empty list allows none. */
  platforms?: NodeJS.Platform[];
  /** Optional user-facing choice label/hint for grouped onboarding UI. */
  choiceLabel?: string;
  choiceHint?: string;
  /** Optional HTTPS artwork URL for native and web onboarding surfaces. */
  icon?: string;
  /** Optional HTTPS product or installation URL for onboarding surfaces. */
  website?: string;
  /** Lower values sort earlier in interactive assistant pickers. */
  assistantPriority?: number;
  /** Keep the choice out of interactive assistant pickers while preserving manual CLI support. */
  assistantVisibility?: "visible" | "manual-only" | "detected-only";
  /** Legacy choice ids that should point users at this replacement choice. */
  deprecatedChoiceIds?: string[];
  /** Optional grouping metadata for auth-choice pickers. */
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  /**
   * Surface this group in the featured tier of the interactive onboarding
   * picker. Featured groups appear before the "More…" entry.
   */
  onboardingFeatured?: boolean;
  /** Optional CLI flag metadata for one-flag auth flows such as API keys. */
  optionKey?: string;
  cliFlag?: string;
  cliOption?: string;
  cliDescription?: string;
  /** One pasted secret plus provider defaults is sufficient for app-guided setup. */
  appGuidedSecret?: boolean;
  /** Interactive method stages one inline credential without host login imports or persistence. */
  personalAccount?: boolean;
  /** Short provider-owned command label for starting app-guided setup. */
  appGuidedActionLabel?: string;
  /** Provider-owned interactive login that native setup clients can render generically. */
  appGuidedAuth?: "oauth" | "device-code";
  /** Auth can return credentials without discovering or selecting a starter model. */
  credentialOnly?: boolean;
  /** Fixed-input sign-in offered in private owner-only chat. */
  channelLogin?: {
    aliases?: string[];
  };
  /**
   * Interactive onboarding surfaces where this auth choice should appear.
   * Defaults to `["text-inference"]` when omitted.
   */
  onboardingScopes?: PluginManifestOnboardingScope[];
  /** Provider runtime can discover and prepare an already-installed local model. */
  appGuidedDiscovery?: boolean;
};
type PluginManifestOnboardingScope = "text-inference" | "image-generation" | "music-generation";
//#endregion
//#region src/shared/silent-reply-policy.d.ts
type SilentReplyPolicy = "allow" | "disallow";
type SilentReplyConversationType = "direct" | "group" | "internal";
type SilentReplyPolicyShape = Partial<Record<Exclude<SilentReplyConversationType, "direct">, SilentReplyPolicy>>;
//#endregion
//#region src/transcripts/config.d.ts
/**
 * Configuration normalization for transcript capture/import.
 *
 * Raw config can contain optional auto-start provider locators; resolution
 * returns bounded defaults and drops malformed entries before runtime startup.
 */
/** Raw auto-start transcript source entry from config. */
type TranscriptsAutoStartConfig = {
  providerId: string;
  whenOccupied?: boolean;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};
/** Raw transcripts config block. */
type TranscriptsConfig = {
  enabled?: boolean;
  autoStart?: TranscriptsAutoStartConfig[];
};
//#endregion
//#region src/config/includes.d.ts
type ConfigIncludeOwnership = {
  path: readonly string[];
  kind: "single" | "multiple";
  hasSiblingOverrides: boolean;
  /** Whether the authored include sits at or below an actual array entry; absent means false. */
  hasArrayAncestor?: boolean;
  targetPath?: string;
  targetPaths?: readonly string[];
};
//#endregion
//#region src/config/types.cron.d.ts
type CronSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.cron>>;
type CronConfig = Omit<CronSchemaInput, "webhookToken" | "webhookSsrfPolicy"> & {
  /** Bearer token for cron webhook POST delivery. */
  webhookToken?: SecretInput;
  /** SSRF policy for all outbound cron webhook deliveries. */
  webhookSsrfPolicy?: SsrFPolicyConfig;
};
//#endregion
//#region src/config/zod-schema.gateway.d.ts
declare const GatewayConfigSchema: z.ZodOptional<z.ZodObject<{
  port: z.ZodOptional<z.ZodNumber>;
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
  bind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"lan">, z.ZodLiteral<"loopback">, z.ZodLiteral<"custom">, z.ZodLiteral<"tailnet">]>>;
  customBindHost: z.ZodOptional<z.ZodString>;
  publicOrigin: z.ZodOptional<z.ZodString>;
  portals: z.ZodOptional<z.ZodObject<{
    ingress: z.ZodOptional<z.ZodObject<{
      domain: z.ZodString;
      port: z.ZodNumber;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  controlUi: z.ZodOptional<z.ZodObject<{
    dangerouslyDisableDeviceAuth: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    basePath: z.ZodOptional<z.ZodString>;
    experimental: z.ZodOptional<z.ZodObject<{
      customPlugins: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    root: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodObject<{
      label: z.ZodString;
      color: z.ZodEnum<{
        amber: "amber";
        blue: "blue";
        coral: "coral";
        gray: "gray";
        green: "green";
        pink: "pink";
        purple: "purple";
        red: "red";
        teal: "teal";
      }>;
    }, z.core.$strict>>;
    communityInvite: z.ZodOptional<z.ZodBoolean>;
    github: z.ZodOptional<z.ZodObject<{
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strict>>;
    sessionObserver: z.ZodOptional<z.ZodBoolean>;
    embedSandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"scripts">, z.ZodLiteral<"trusted">]>>;
    allowExternalEmbedUrls: z.ZodOptional<z.ZodBoolean>;
    automaticallyFetchFavicons: z.ZodOptional<z.ZodBoolean>;
    allowedOrigins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dangerouslyAllowHostHeaderOriginFallback: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  cliAgents: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  terminal: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    shell: z.ZodOptional<z.ZodString>;
    detachedSessionTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  auth: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"token">, z.ZodLiteral<"password">, z.ZodLiteral<"trusted-proxy">]>>;
    token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    allowTailscale: z.ZodOptional<z.ZodBoolean>;
    identityScopes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
      "operator.admin": "operator.admin";
      "operator.approvals": "operator.approvals";
      "operator.pairing": "operator.pairing";
      "operator.questions": "operator.questions";
      "operator.read": "operator.read";
      "operator.sessions.read": "operator.sessions.read";
      "operator.sessions.write": "operator.sessions.write";
      "operator.talk": "operator.talk";
      "operator.talk.secrets": "operator.talk.secrets";
      "operator.write": "operator.write";
    }>>>>;
    rateLimit: z.ZodOptional<z.ZodObject<{
      maxAttempts: z.ZodOptional<z.ZodNumber>;
      windowMs: z.ZodOptional<z.ZodNumber>;
      lockoutMs: z.ZodOptional<z.ZodNumber>;
      exemptLoopback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    trustedProxy: z.ZodOptional<z.ZodObject<{
      userHeader: z.ZodString;
      requiredHeaders: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowUsers: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowLoopback: z.ZodOptional<z.ZodBoolean>;
      cloudflareAccessOidc: z.ZodOptional<z.ZodObject<{
        issuer: z.ZodString;
        providerId: z.ZodString;
        githubAccountIdClaim: z.ZodString;
      }, z.core.$strict>>;
      deviceAutoApprove: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  roles: z.ZodOptional<z.ZodObject<{
    default: z.ZodString;
    definitions: z.ZodRecord<z.ZodString, z.ZodObject<{
      sessions: z.ZodObject<{
        others: z.ZodEnum<{
          none: "none";
          suggest: "suggest";
          view: "view";
          write: "write";
        }>;
      }, z.core.$strict>;
      sandbox: z.ZodOptional<z.ZodEnum<{
        inherit: "inherit";
        required: "required";
      }>>;
      agents: z.ZodUnion<readonly [z.ZodLiteral<"*">, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>]>;
      scopes: z.ZodPipe<z.ZodArray<z.ZodEnum<{
        "operator.admin": "operator.admin";
        "operator.approvals": "operator.approvals";
        "operator.pairing": "operator.pairing";
        "operator.questions": "operator.questions";
        "operator.read": "operator.read";
        "operator.sessions.read": "operator.sessions.read";
        "operator.sessions.write": "operator.sessions.write";
        "operator.talk": "operator.talk";
        "operator.talk.secrets": "operator.talk.secrets";
        "operator.write": "operator.write";
      }>>, z.ZodTransform<("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[], ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[]>>;
      accessPolicyPlugin: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  trustedProxies: z.ZodOptional<z.ZodArray<z.ZodString>>;
  allowRealIpFallback: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  tailscale: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
    preserveFunnel: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  remote: z.ZodOptional<z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"ssh">, z.ZodLiteral<"direct">]>>;
    remotePort: z.ZodOptional<z.ZodNumber>;
    token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    edgeAuth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    tlsFingerprint: z.ZodOptional<z.ZodString>;
    sshTarget: z.ZodOptional<z.ZodString>;
    sshIdentity: z.ZodOptional<z.ZodString>;
    sshHostKeyPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"openssh">]>>;
  }, z.core.$strict>>;
  reload: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"hybrid">]>>;
  }, z.core.$strict>>;
  tls: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    autoGenerate: z.ZodOptional<z.ZodBoolean>;
    certPath: z.ZodOptional<z.ZodString>;
    keyPath: z.ZodOptional<z.ZodString>;
    caPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  http: z.ZodOptional<z.ZodObject<{
    endpoints: z.ZodOptional<z.ZodObject<{
      chatCompletions: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        images: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      responses: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxUrlParts: z.ZodOptional<z.ZodNumber>;
        files: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          pdf: z.ZodOptional<z.ZodObject<{
            maxPages: z.ZodOptional<z.ZodNumber>;
            maxPixels: z.ZodOptional<z.ZodNumber>;
            minTextChars: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        images: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    securityHeaders: z.ZodOptional<z.ZodObject<{
      strictTransportSecurity: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  push: z.ZodOptional<z.ZodObject<{
    apns: z.ZodOptional<z.ZodObject<{
      relay: z.ZodOptional<z.ZodObject<{
        baseUrl: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  nodes: z.ZodOptional<z.ZodObject<{
    browser: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"manual">, z.ZodLiteral<"off">]>>;
      node: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pairing: z.ZodOptional<z.ZodObject<{
      autoApproveLocal: z.ZodOptional<z.ZodBoolean>;
      autoApproveCidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sshVerify: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        user: z.ZodOptional<z.ZodString>;
        identity: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        cidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
    }, z.core.$strict>>;
    pluginTools: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    allowSkills: z.ZodOptional<z.ZodBoolean>;
    commands: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.gateway.d.ts
type GatewayConfigInput = NonNullable<z.input<typeof GatewayConfigSchema>>;
type TalkConfigInput = z.input<typeof TalkSchema>;
type WideAreaDiscoveryConfig = {
  /** Optional unicast DNS-SD domain (e.g. "openclaw.internal"). */
  domain?: string;
};
/** mDNS/Bonjour metadata exposure level for local gateway discovery. */
type MdnsDiscoveryMode = "off" | "minimal" | "full";
type MdnsDiscoveryConfig = {
  /**
   * mDNS/Bonjour discovery broadcast mode (default: minimal).
   * - off: disable mDNS entirely
   * - minimal: omit cliPath/sshPort from TXT records
   * - full: include cliPath/sshPort in TXT records
   */
  mode?: MdnsDiscoveryMode;
};
type DiscoveryConfig = {
  /** Wide-area DNS-SD discovery settings. */
  wideArea?: WideAreaDiscoveryConfig;
  /** Local mDNS/Bonjour discovery settings. */
  mdns?: MdnsDiscoveryConfig;
};
type TalkProviderConfig = NonNullable<TalkConfigInput["providers"]>[string];
type TalkConfig = TalkConfigInput;
type GatewayControlUiConfig = Omit<NonNullable<GatewayConfigInput["controlUi"]>, "github" | "dangerouslyDisableDeviceAuth"> & {
  /** @deprecated Doctor-only legacy input. */
  chatMessageMaxWidth?: string;
  /**
   * @deprecated Upgrade-only transport input. Retained so releases that shipped
   * this break-glass flag can migrate an unpaired browser safely.
   */
  dangerouslyDisableDeviceAuth?: boolean;
  github?: {
    token?: SecretInput;
  };
};
type GatewayAuthConfig = Omit<NonNullable<GatewayConfigInput["auth"]>, "token" | "password"> & {
  token?: SecretInput;
  password?: SecretInput;
};
type GatewayTailscaleConfig = Omit<NonNullable<GatewayConfigInput["tailscale"]>, "preserveFunnel"> & {
  /** @deprecated Migrate to `mode="funnel"`, which uses managed ingress. */
  preserveFunnel?: boolean;
};
/** Gateway config reload strategy for managed installs. */
type GatewayReloadMode = "off" | "restart" | "hot" | "hybrid";
type GatewayReloadConfig = {
  /** Reload strategy for config changes (default: hybrid). */
  mode?: GatewayReloadMode;
};
type GatewayNodesConfig = NonNullable<GatewayConfigInput["nodes"]> & {
  /** @deprecated Doctor-only legacy input. */
  skills?: {
    enabled?: boolean;
  };
  /** @deprecated Doctor-only legacy input. */
  allowCommands?: string[];
  /** @deprecated Doctor-only legacy input. */
  denyCommands?: string[];
};
/** Optional named operator-role policies for Gateway deployments shared by a team. */
type GatewayOperatorRolesConfig = Omit<NonNullable<GatewayConfigInput["roles"]>, "default"> & {
  /** Required validated default for profiles without a valid assigned role. */
  default?: string;
};
type GatewayConfig = Omit<GatewayConfigInput, "controlUi" | "nodes" | "roles" | "reload" | "auth" | "tailscale"> & {
  auth?: GatewayAuthConfig;
  controlUi?: GatewayControlUiConfig;
  nodes?: GatewayNodesConfig;
  roles?: GatewayOperatorRolesConfig;
  reload?: GatewayReloadConfig;
  tailscale?: GatewayTailscaleConfig;
};
//#endregion
//#region src/config/zod-schema.installs.d.ts
declare const StrictPluginInstallRecordSchema: z.ZodObject<{
  spec: z.ZodOptional<z.ZodString>;
  sourcePath: z.ZodOptional<z.ZodString>;
  installPath: z.ZodOptional<z.ZodString>;
  version: z.ZodOptional<z.ZodString>;
  resolvedName: z.ZodOptional<z.ZodString>;
  resolvedVersion: z.ZodOptional<z.ZodString>;
  resolvedSpec: z.ZodOptional<z.ZodString>;
  integrity: z.ZodOptional<z.ZodString>;
  shasum: z.ZodOptional<z.ZodString>;
  resolvedAt: z.ZodOptional<z.ZodString>;
  installedAt: z.ZodOptional<z.ZodString>;
  clawhubUrl: z.ZodOptional<z.ZodString>;
  clawhubPackage: z.ZodOptional<z.ZodString>;
  clawhubFamily: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"code-plugin">, z.ZodLiteral<"bundle-plugin">]>>;
  clawhubChannel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"official">, z.ZodLiteral<"community">, z.ZodLiteral<"private">]>>;
  clawhubTrustDisposition: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"clean">, z.ZodLiteral<"review-recommended">, z.ZodLiteral<"review-required">, z.ZodLiteral<"blocked">]>>;
  clawhubTrustScanStatus: z.ZodOptional<z.ZodString>;
  clawhubTrustModerationState: z.ZodOptional<z.ZodString>;
  clawhubTrustReasons: z.ZodOptional<z.ZodArray<z.ZodString>>;
  clawhubTrustPending: z.ZodOptional<z.ZodBoolean>;
  clawhubTrustStale: z.ZodOptional<z.ZodBoolean>;
  clawhubTrustCheckedAt: z.ZodOptional<z.ZodString>;
  clawhubTrustAcknowledgedAt: z.ZodOptional<z.ZodString>;
  artifactKind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"legacy-zip">, z.ZodLiteral<"npm-pack">]>>;
  artifactFormat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"zip">, z.ZodLiteral<"tgz">]>>;
  npmIntegrity: z.ZodOptional<z.ZodString>;
  npmShasum: z.ZodOptional<z.ZodString>;
  npmTarballName: z.ZodOptional<z.ZodString>;
  clawpackSha256: z.ZodOptional<z.ZodString>;
  clawpackSpecVersion: z.ZodOptional<z.ZodNumber>;
  clawpackManifestSha256: z.ZodOptional<z.ZodString>;
  clawpackSize: z.ZodOptional<z.ZodNumber>;
  gitUrl: z.ZodOptional<z.ZodString>;
  gitRef: z.ZodOptional<z.ZodString>;
  gitCommit: z.ZodOptional<z.ZodString>;
  source: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"npm">, z.ZodLiteral<"archive">, z.ZodLiteral<"path">, z.ZodLiteral<"clawhub">, z.ZodLiteral<"git">]>, z.ZodLiteral<"marketplace">]>;
  marketplaceName: z.ZodOptional<z.ZodString>;
  marketplaceSource: z.ZodOptional<z.ZodString>;
  marketplacePlugin: z.ZodOptional<z.ZodString>;
  acceptedSurface: z.ZodOptional<z.ZodObject<{
    channels: z.ZodArray<z.ZodString>;
    providers: z.ZodArray<z.ZodString>;
    tools: z.ZodArray<z.ZodString>;
    contracts: z.ZodArray<z.ZodString>;
    hooks: z.ZodArray<z.ZodString>;
    mcpServers: z.ZodArray<z.ZodString>;
    cliCommands: z.ZodArray<z.ZodString>;
    cliBackends: z.ZodArray<z.ZodString>;
    skills: z.ZodArray<z.ZodString>;
    dangerousConfigFlags: z.ZodArray<z.ZodString>;
  }, z.core.$strict>>;
  acceptedSurfaceHash: z.ZodOptional<z.ZodString>;
  acceptedSurfaceAt: z.ZodOptional<z.ZodString>;
  acceptedSurfaceIntegrity: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type PluginInstallRecord = z.infer<typeof StrictPluginInstallRecordSchema>;
//#endregion
//#region src/config/zod-schema.hooks.d.ts
declare const HookMappingSchema: z.ZodOptional<z.ZodObject<{
  id: z.ZodOptional<z.ZodString>;
  match: z.ZodOptional<z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  action: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"wake">, z.ZodLiteral<"agent">]>>;
  wakeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"now">, z.ZodLiteral<"next-heartbeat">]>>;
  name: z.ZodOptional<z.ZodString>;
  agentId: z.ZodOptional<z.ZodString>;
  sessionKey: z.ZodOptional<z.ZodString>;
  sessionMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"isolated">, z.ZodLiteral<"persistent">]>>;
  messageTemplate: z.ZodOptional<z.ZodString>;
  textTemplate: z.ZodOptional<z.ZodString>;
  forEach: z.ZodOptional<z.ZodString>;
  deliver: z.ZodOptional<z.ZodBoolean>;
  allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
  channel: z.ZodOptional<z.ZodString>;
  to: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodString>;
  thinking: z.ZodOptional<z.ZodString>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  transform: z.ZodOptional<z.ZodObject<{
    module: z.ZodString;
    export: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
type HookMappingConfigInput = NonNullable<z.input<typeof HookMappingSchema>>;
//#endregion
//#region src/config/types.hooks.d.ts
type HookMappingConfig = Omit<HookMappingConfigInput, "channel"> & {
  /** Preserve channel-id autocomplete while allowing runtime plugin channels. */
  channel?: "last" | (string & {});
};
type HooksSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.hooks>>;
type HooksConfig = Omit<HooksSchemaInput, "mappings"> & {
  mappings?: HookMappingConfig[];
};
//#endregion
//#region src/config/zod-schema.mcp-server.d.ts
declare const McpServerSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  command: z.ZodOptional<z.ZodString>;
  args: z.ZodOptional<z.ZodArray<z.ZodString>>;
  env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
  cwd: z.ZodOptional<z.ZodString>;
  url: z.ZodOptional<z.ZodString>;
  transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
  headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
  connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
  requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
  supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
  auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
  oauth: z.ZodOptional<z.ZodObject<{
    identity: z.ZodOptional<z.ZodEnum<{
      "per-requester": "per-requester";
      shared: "shared";
    }>>;
    authProfileId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodString>;
    redirectUrl: z.ZodOptional<z.ZodString>;
    clientMetadataUrl: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  sslVerify: z.ZodOptional<z.ZodBoolean>;
  clientCert: z.ZodOptional<z.ZodString>;
  clientKey: z.ZodOptional<z.ZodString>;
  toolFilter: z.ZodOptional<z.ZodObject<{
    include: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  codex: z.ZodOptional<z.ZodObject<{
    agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
      approve: "approve";
      auto: "auto";
      prompt: "prompt";
    }>>;
  }, z.core.$strict>>;
}, z.core.$catchall<z.ZodUnknown>>;
type McpServerConfigInput = z.input<typeof McpServerSchema>;
//#endregion
//#region src/config/types.mcp.d.ts
type McpServerConfig = McpServerConfigInput;
type McpServerCodexConfig = NonNullable<McpServerConfigInput["codex"]>;
type McpCodexToolApprovalMode = NonNullable<McpServerCodexConfig["defaultToolsApprovalMode"]>;
type McpServerToolFilterConfig = NonNullable<McpServerConfigInput["toolFilter"]>;
type McpConfigSchemaInput = NonNullable<z.input<typeof McpConfigSchema>>;
type McpConfig = Omit<McpConfigSchemaInput, "servers"> & {
  servers?: Record<string, McpServerConfig>;
};
//#endregion
//#region packages/llm-core/src/utils/diagnostics.d.ts
interface DiagnosticErrorInfo {
  name?: string;
  message: string;
  stack?: string;
  code?: string | number;
}
interface AssistantMessageDiagnostic {
  type: string;
  timestamp: number;
  error?: DiagnosticErrorInfo;
  details?: Record<string, unknown>;
}
//#endregion
//#region packages/llm-core/src/types.d.ts
/** Provider API families with first-class request/stream adapters in OpenClaw. */
type KnownApi = "openai-completions" | "mistral-conversations" | "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "anthropic-messages" | "bedrock-converse-stream" | "google-generative-ai" | "google-vertex";
/** Provider API id; custom providers can use ids outside the built-in set. */
type Api = KnownApi | (string & {});
/** Provider id used for routing, diagnostics, and config lookups. */
type Provider = string;
/** Model thinking setting including explicit disabled state. */
type ModelThinkingLevel = ModelDataThinkingLevel;
/** Provider-specific values for normalized thinking levels. */
type ThinkingLevelMap = ModelDataThinkingLevelMap;
/** Token budgets for each thinking level (token-based providers only) */
interface ThinkingBudgets {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
  max?: number;
}
/** Prompt-cache retention preference shared by providers that expose cache controls. */
type CacheRetention = "none" | "short" | "long";
/** Streaming transport preference for providers that support multiple transports. */
type Transport = "sse" | "websocket" | "websocket-cached" | "auto";
/** Helper for hooks that may be synchronous or asynchronous. */
type MaybePromise<T> = T | Promise<T>;
/** Minimal HTTP response metadata surfaced through provider hooks. */
interface ProviderResponse {
  status: number;
  headers: Record<string, string>;
}
/** Request options shared by text streaming providers. */
interface StreamOptions {
  temperature?: number;
  maxTokens?: number;
  /**
   * Optional JSON Schema for the generated response. Providers that support
   * constrained decoding map it to their native request shape; others ignore it.
   */
  responseFormat?: Record<string, unknown>;
  /**
   * Stop sequences forwarded to providers that support them. Providers map this
   * to their native request field, such as OpenAI `stop` or Anthropic
   * `stop_sequences`.
   */
  stop?: string[];
  signal?: AbortSignal;
  apiKey?: string;
  /**
   * Preferred transport for providers that support multiple transports.
   * Providers that do not support this option ignore it.
   */
  transport?: Transport;
  /**
   * Prompt cache retention preference. Providers map this to their supported values.
   * Default: "short".
   */
  cacheRetention?: CacheRetention;
  /**
   * Optional session identifier for providers that support session-based caching.
   * Providers can use this to enable prompt caching, request routing, or other
   * session-aware features. Ignored by providers that don't support it.
   */
  sessionId?: string;
  /**
   * Opaque per-model-call identifier for provider transport correlation.
   * Providers that do not expose request correlation ignore it.
   */
  requestId?: string;
  /**
   * Optional provider prompt-cache affinity key, distinct from transcript/session identity.
   * Providers that do not support separate cache affinity ignore it.
   */
  promptCacheKey?: string;
  /**
   * Optional callback for inspecting or replacing provider payloads before sending.
   * Return undefined to keep the payload unchanged.
   */
  onPayload?: (payload: unknown, model: Model) => MaybePromise<unknown>;
  /**
   * Optional callback invoked after an HTTP response is received and before
   * its body stream is consumed.
   */
  onResponse?: (response: ProviderResponse, model: Model) => void | Promise<void>;
  /**
   * Observe a live response that accepts user input before generation finishes.
   * `steer` resolves false only when the input was definitely not admitted;
   * admitted input cannot be withdrawn. Providers settle pending submissions
   * before closing the response and call the returned cleanup on closure.
   */
  onActiveResponse?: (control: {
    steer(messages: readonly UserMessage[]): Promise<boolean>;
    /** Read-only after closure: deferred input still needs an explicit continuation request. */
    needsContinuation?: () => boolean;
  }) => (() => void) | void;
  /**
   * The caller can execute completed async calls before generation finishes.
   * Providers advertise async tools only with this host capability; this is
   * independent of parallel execution of an ordinary completed tool batch.
   */
  asyncToolExecution?: boolean;
  /**
   * Optional custom HTTP headers to include in API requests.
   * Merged with provider defaults; can override default headers.
   * Not supported by all providers (e.g., AWS Bedrock uses SDK auth).
   */
  headers?: Record<string, string>;
  /**
   * HTTP request timeout in milliseconds for providers/SDKs that support it.
   * For example, OpenAI and Anthropic SDK clients default to 10 minutes.
   */
  timeoutMs?: number;
  /** @deprecated Ignored by built-in text transports; retries are owned by the host runner. */
  maxRetries?: number;
  /**
   * Maximum delay in milliseconds to wait for a retry when the server requests a long wait.
   * If the server's requested delay exceeds this value, the request fails immediately
   * with an error containing the requested delay, allowing higher-level retry logic
   * to handle it with user visibility.
   * Default: 60000 (60 seconds). Set to 0 to disable the cap.
   */
  maxRetryDelayMs?: number;
  /**
   * Optional metadata to include in API requests.
   * Providers extract the fields they understand and ignore the rest.
   * For example, Anthropic uses `user_id` for abuse tracking and rate limiting.
   */
  metadata?: Record<string, unknown>;
}
/** Unified text options used by simple completion helpers. */
interface SimpleStreamOptions extends StreamOptions {
  /** Optional processing tier; only providers supporting these tiers apply it. */
  serviceTier?: "default" | "priority";
  reasoning?: ModelThinkingLevel;
  /** Custom token budgets for thinking levels (token-based providers only) */
  thinkingBudgets?: ThinkingBudgets;
}
/** Plain assistant/user text content block. */
interface TextContent {
  type: "text";
  text: string;
  textSignature?: string;
}
/** Provider reasoning/thinking content block, including opaque replay signatures. */
interface ThinkingContent {
  type: "thinking";
  thinking: string;
  thinkingSignature?: string;
  /** When true, the thinking content was redacted by safety filters. The opaque
   *  encrypted payload is stored in `thinkingSignature` so it can be passed back
   *  to the API for multi-turn continuity. */
  redacted?: boolean;
}
/** Opaque provider-owned state that must survive transcript replay without being rendered. */
interface ProviderReplayState {
  v: 1;
  type: string;
  id?: string;
  data: string;
  replayIndex?: number;
  provider: Provider;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
}
/** Base64 image content block with MIME type metadata. */
interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}
/** Normalized assistant tool call emitted by providers or repaired from text. */
interface ToolCall {
  /** The provider completed this call and permits generation to continue without its result. */
  async?: true;
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  thoughtSignature?: string;
  executionMode?: "sequential" | "parallel";
}
/** Normalized token and cost accounting for a provider response. */
interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** Whether the provider reported a cache-read/write token split. */
  cacheTelemetry?: {
    state: "available" | "unavailable";
  };
  /** Subset of `cacheWrite` written with 1-hour retention when reported. */
  cacheWrite1h?: number;
  /** Exact context snapshot for the final provider iteration. */
  contextUsage?: {
    state: "available";
    promptTokens: number;
    totalTokens: number;
  } | {
    state: "unavailable";
  };
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
    /** Provenance for the recorded total cost; provider-billed totals are authoritative. */
    totalOrigin?: "provider-billed";
  };
}
/** Per-million-token rates for separately billed token buckets. */
type ModelCostRates = ModelDataCostRates;
type RawPricingTier = ModelDataRawPricingTier;
type RawModelCostConfig = ModelCostRates & {
  tieredPricing?: RawPricingTier[];
};
/** Normalized assistant stop reasons across text providers. */
type StopReason = "stop" | "length" | "toolUse" | "error" | "aborted";
/** User turn in a text-model conversation. */
interface UserMessage {
  role: "user";
  content: string | (TextContent | ImageContent)[];
  timestamp: number;
  /**
   * Marks a user message carrying runtime context. Provider replay policy decides
   * whether the carrier is transient or retained append-only; only retained
   * carriers are stable prompt-cache anchors.
   */
  runtimeContextCarrier?: boolean;
}
/** Assistant turn, including provider identity and final stop state. */
type AssistantDeliveryTtsFacts = {
  tagged: true;
  text?: string;
  directives?: Array<{
    provider?: string;
    values: Record<string, string>;
  }>;
};
interface AssistantMessage {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCall)[];
  openclawDelivery?: {
    audioAsVoice?: true;
    /** Exact media directives consumed by the managed-media transcript rewrite owner. */
    mediaUrls?: string[];
    replyToCurrent?: true;
    replyToId?: string;
    /** Provider text phase is unresolved until the assistant turn reaches terminal state. */
    textPhaseRequiresTerminal?: true;
    /** Parsed once at the assistant write boundary; delivery resolves policy from these facts. */
    tts?: AssistantDeliveryTtsFacts;
  };
  api: Api;
  provider: Provider;
  model: string;
  responseModel?: string;
  responseId?: string;
  providerReplay?: ProviderReplayState;
  turnId?: string;
  diagnostics?: AssistantMessageDiagnostic[];
  usage: Usage;
  stopReason: StopReason;
  /** A completed provider response can explicitly request another inference with false. */
  endTurn?: boolean;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
  timestamp: number;
}
/** Tool result turn that answers a prior assistant tool call. */
interface ToolResultMessage<TDetails = unknown> {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: (TextContent | ImageContent)[];
  details?: TDetails;
  isError: boolean;
  timestamp: number;
}
/** Any text-model conversation message supported by LLM core. */
type Message = UserMessage | AssistantMessage | ToolResultMessage;
/** Provider tool declaration with a TypeBox/JSON-schema parameter object. */
interface Tool<TParameters extends TSchema = TSchema> {
  name: string;
  description: string;
  parameters: TParameters;
}
/** Text-model request context shared by provider adapters. */
interface Context {
  systemPrompt?: string;
  messages: Message[];
  tools?: Tool[];
}
/**
 * Event protocol for AssistantMessageEventStream.
 *
 * Streams should emit `start` before partial updates, then terminate with either:
 * - `done` carrying the final successful AssistantMessage, or
 * - `error` carrying the final AssistantMessage with stopReason "error" or "aborted"
 *   and errorMessage.
 */
type AssistantMessageEvent = {
  type: "start";
  partial: AssistantMessage;
} | {
  type: "text_start";
  contentIndex: number;
  partial: AssistantMessage;
} |
/**
 * Plain text deltas may omit `partial` to avoid retaining one full assistant
 * snapshot per token. Consumers that need current text should replay `delta`
 * from the latest start/end partial checkpoint.
 */
{
  type: "text_delta";
  contentIndex: number;
  delta: string;
  partial?: AssistantMessage;
} | {
  type: "text_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "thinking_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "thinking_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "thinking_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "toolcall_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_end";
  contentIndex: number;
  toolCall: ToolCall;
  partial: AssistantMessage;
} | {
  type: "done";
  reason: Extract<StopReason, "stop" | "length" | "toolUse">;
  message: AssistantMessage;
} | {
  type: "error";
  reason: Extract<StopReason, "aborted" | "error">;
  error: AssistantMessage;
};
interface AssistantMessageEventStreamContract extends AsyncIterable<AssistantMessageEvent> {
  /** Queue one stream event for consumers. */
  push(event: AssistantMessageEvent): void;
  /** Complete the stream and optionally resolve the final message. */
  end(result?: AssistantMessage): void;
  /** Final assistant message produced by the stream. */
  result(): Promise<AssistantMessage>;
}
/** Read-only stream contract accepted by consumers that do not need to push events. */
interface AssistantMessageEventStreamLike extends AsyncIterable<AssistantMessageEvent> {
  result(): Promise<AssistantMessage>;
}
/**
 * Compatibility settings for OpenAI-compatible completions APIs.
 * Use this to override URL-based auto-detection for custom providers.
 */
interface OpenAICompletionsCompat {
  /** Whether the provider supports the `store` field. Default: auto-detected from URL. */
  supportsStore?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: auto-detected from URL. */
  supportsDeveloperRole?: boolean;
  /** Whether the provider supports `reasoning_effort`. Default: auto-detected from URL. */
  supportsReasoningEffort?: boolean;
  /** Provider-native reasoning efforts accepted by the model. Overrides known model defaults. */
  supportedReasoningEfforts?: string[];
  /** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
  reasoningEffortMap?: Record<string, string>;
  /** Whether the provider supports `stream_options: { include_usage: true }` for token usage in streaming responses. Default: true. */
  supportsUsageInStreaming?: boolean;
  /** Which field to use for max tokens. Default: auto-detected from URL. */
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  /** Whether tool results require the `name` field. Default: auto-detected from URL. */
  requiresToolResultName?: boolean;
  /** Whether a user message after tool results requires an assistant message in between. Default: auto-detected from URL. */
  requiresAssistantAfterToolResult?: boolean;
  /** Whether thinking blocks must be converted to text blocks with <thinking> delimiters. Default: auto-detected from URL. */
  requiresThinkingAsText?: boolean;
  /** Whether all replayed assistant messages must include an empty reasoning_content field when reasoning is enabled. Default: auto-detected from URL. */
  requiresReasoningContentOnAssistantMessages?: boolean;
  /** Format for reasoning/thinking parameter. "openai" uses reasoning_effort, "openrouter" uses reasoning: { effort }, "deepseek" uses thinking: { type } plus reasoning_effort, "together" uses reasoning: { enabled } plus reasoning_effort when supported, "zai" uses top-level enable_thinking: boolean, "qwen" uses top-level enable_thinking: boolean, and "qwen-chat-template" uses chat_template_kwargs.enable_thinking. Default: "openai". */
  thinkingFormat?: ModelDataThinkingFormat;
  /** OpenRouter-specific routing preferences. Only used when baseUrl points to OpenRouter. */
  openRouterRouting?: OpenRouterRouting;
  /** Vercel AI Gateway routing preferences. Only used when baseUrl points to Vercel AI Gateway. */
  vercelGatewayRouting?: VercelGatewayRouting;
  /** Whether z.ai supports top-level `tool_stream: true` for streaming tool call deltas. Default: false. */
  zaiToolStream?: boolean;
  /** Whether the provider supports the `strict` field in tool definitions. Default: true. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports JSON Schema through `response_format`. Default: false for unknown compatible endpoints. */
  supportsJsonSchemaResponseFormat?: boolean;
  /** Cache control convention for prompt caching. "anthropic" applies Anthropic-style `cache_control` markers to the system prompt, last tool definition, and last user/assistant text content. */
  cacheControlFormat?: "anthropic";
  /** Whether to send known session-affinity headers (`session_id`, `x-client-request-id`, `x-session-affinity`) from `options.sessionId` when caching is enabled. Default: false. */
  sendSessionAffinityHeaders?: boolean;
  /** Whether the provider supports OpenAI-style `prompt_cache_key`. Default: false for third-party completions providers. */
  supportsPromptCacheKey?: boolean;
  /** Whether the provider supports long prompt cache retention (`prompt_cache_retention: "24h"` or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true. */
  supportsLongCacheRetention?: boolean;
}
/** Compatibility settings for OpenAI Responses APIs. */
interface OpenAIResponsesCompat {
  /** Whether a compatible provider accepts the `strict` tool field. Default: auto-detected from the endpoint. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: true. */
  supportsDeveloperRole?: boolean;
  /** Whether to send reasoning effort settings. Defaults to the model's known capabilities. */
  supportsReasoningEffort?: boolean;
  /** Provider-native reasoning efforts accepted by the model. Overrides known model defaults. */
  supportedReasoningEfforts?: string[];
  /** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
  reasoningEffortMap?: Record<string, string>;
  /** Whether the model accepts the `temperature` parameter. Default: true. */
  supportsTemperature?: boolean;
  /** Whether to send the OpenAI `session_id` cache-affinity header from `options.sessionId` when caching is enabled. Default: true. */
  sendSessionIdHeader?: boolean;
  /** Whether the provider supports `prompt_cache_retention: "24h"`. Default: true. */
  supportsLongCacheRetention?: boolean;
  /** Whether the provider honors top-level `instructions`. Defaults to true only for verified native routes (OpenAI, xAI); every other route defaults to false and embeds the system prompt in `input` unless set true here after verifying against that endpoint. */
  supportsInstructions?: boolean;
  /**
   * Explicit opt-in for HTTP continuation (client-side delta + `previous_response_id`)
   * on a custom/proxy OpenAI-Responses-compatible endpoint. A native `api.openai.com`
   * connection is eligible by default; a custom endpoint carries no trust signal of
   * its own, so this is the only path to eligibility there — set it once you've
   * verified the backend correctly resolves `previous_response_id` and persists
   * `store: true` turns. Default: false.
   */
  supportsResponsesContinuation?: boolean;
}
/** Compatibility settings for Anthropic Messages-compatible APIs. */
interface AnthropicMessagesCompat {
  /**
   * Whether the provider accepts per-tool `eager_input_streaming`.
   * When false, the Anthropic provider omits `tools[].eager_input_streaming`
   * and sends the legacy `fine-grained-tool-streaming-2025-05-14` beta header
   * for tool-enabled requests.
   * Default: true.
   */
  supportsEagerToolInputStreaming?: boolean;
  /** Whether the provider supports Anthropic long cache retention (`cache_control.ttl: "1h"`). Default: true. */
  supportsLongCacheRetention?: boolean;
  /**
   * Whether to send the `x-session-affinity` header from `options.sessionId`
   * when caching is enabled. Required for providers like Fireworks that use
   * session affinity for prompt cache routing (requests to the same replica
   * maximize cache hits).
   * Default: false.
   */
  sendSessionAffinityHeaders?: boolean;
  /**
   * Whether the provider supports Anthropic-style `cache_control` markers on
   * tool definitions. When false, `cache_control` is omitted from tool params.
   * Some Anthropic-compatible providers (e.g., Fireworks) do not support this
   * field on tools and may reject or ignore it.
   * Default: true.
   */
  supportsCacheControlOnTools?: boolean;
  /** Whether empty thinking signatures can be replayed as native thinking blocks. Default: false. */
  allowEmptySignature?: boolean;
}
/**
 * OpenRouter provider routing preferences.
 * Controls which upstream providers OpenRouter routes requests to.
 * Sent as the `provider` field in the OpenRouter API request body.
 * Own member declarations preserve existing module-augmentation semantics.
 * @see https://openrouter.ai/docs/guides/routing/provider-selection
 */
interface OpenRouterRouting {
  /** Whether to allow backup providers to serve requests. Default: true. */
  allow_fallbacks?: boolean;
  /** Whether to filter providers to only those that support all parameters in the request. Default: false. */
  require_parameters?: boolean;
  /** Data collection setting. "allow" (default): allow providers that may store/train on data. "deny": only use providers that don't collect user data. */
  data_collection?: "deny" | "allow";
  /** Whether to restrict routing to only ZDR (Zero Data Retention) endpoints. */
  zdr?: boolean;
  /** Whether to restrict routing to only models that allow text distillation. */
  enforce_distillable_text?: boolean;
  /** An ordered list of provider names/slugs to try in sequence, falling back to the next if unavailable. */
  order?: string[];
  /** List of provider names/slugs to exclusively allow for this request. */
  only?: string[];
  /** List of provider names/slugs to skip for this request. */
  ignore?: string[];
  /** A list of quantization levels to filter providers by (e.g., ["fp16", "bf16", "fp8", "fp6", "int8", "int4", "fp4", "fp32"]). */
  quantizations?: string[];
  /** Sorting strategy. Can be a string (e.g., "price", "throughput", "latency") or an object with `by` and `partition`. */
  sort?: string | ModelRoutingSortConfig;
  /** Maximum price per million tokens (USD). */
  max_price?: ModelRoutingMaxPrice;
  /** Preferred minimum throughput (tokens/second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_min_throughput?: number | ModelRoutingPercentiles;
  /** Preferred maximum latency (seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_max_latency?: number | ModelRoutingPercentiles;
}
/**
 * Vercel AI Gateway routing preferences.
 * Controls which upstream providers the gateway routes requests to.
 * @see https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
 */
interface VercelGatewayRouting {
  /** List of provider slugs to exclusively use for this request (e.g., ["bedrock", "anthropic"]). */
  only?: string[];
  /** List of provider slugs to try in order (e.g., ["anthropic", "openai"]). */
  order?: string[];
}
interface Model<TApi extends Api = Api> {
  id: string;
  name: string;
  api: TApi;
  provider: Provider;
  baseUrl: string;
  reasoning: boolean;
  /**
   * Maps OpenClaw thinking levels to provider/model-specific values.
   * Missing keys use provider defaults. null marks a level as unsupported.
   */
  thinkingLevelMap?: ThinkingLevelMap;
  input: ("text" | "image")[];
  cost: RawModelCostConfig;
  contextWindow?: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while allowing a
   * smaller practical window.
   */
  contextTokens?: number;
  maxTokens: number;
  /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Sends runtime credentials as Authorization: Bearer instead of provider-specific key headers. */
  authHeader?: boolean;
  /** Compatibility overrides for OpenAI-compatible APIs. If not set, auto-detected from baseUrl. */
  compat?: TApi extends "openai-completions" ? OpenAICompletionsCompat : TApi extends "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "openai-codex-responses" ? OpenAIResponsesCompat : TApi extends "anthropic-messages" ? AnthropicMessagesCompat : never;
  /** Provider-documented media input limits used by attachment preprocessing. */
  mediaInput?: ModelDataMediaInputConfig;
}
type StreamFn = (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamLike | Promise<AssistantMessageEventStreamLike>;
type CompleteSimpleFn = (model: Model, context: Pick<Context, "systemPrompt" | "messages">, options?: SimpleStreamOptions) => Promise<AssistantMessage>;
//#endregion
//#region src/config/model-config-vocabulary.d.ts
/** Provider API adapter ids accepted by model/provider config and schema generation. */
declare const MODEL_APIS: readonly ["openai-completions", "openai-responses", "openai-chatgpt-responses", "anthropic-messages", "google-generative-ai", "google-vertex", "github-copilot", "bedrock-converse-stream", "ollama", "pi-messages", "azure-openai-responses"];
type ModelApi = (typeof MODEL_APIS)[number];
//#endregion
//#region src/config/types.models.d.ts
type ModelsSchemaInput = NonNullable<z.input<typeof ModelsConfigSchema>>;
type ModelProviderSchemaInput = NonNullable<ModelsSchemaInput["providers"]>[string];
type ModelDefinitionSchemaInput = NonNullable<ModelProviderSchemaInput["models"]>[number];
/** Provider/model compatibility switches consumed by request builders and tool schema adapters. */
type ModelCompatConfig = Omit<NonNullable<ModelDefinitionSchemaInput["compat"]>, "openRouterRouting" | "vercelGatewayRouting"> & Pick<OpenAICompletionsCompat, "openRouterRouting" | "vercelGatewayRouting">;
type ModelMediaInputConfig = ModelDataMediaInputConfig;
/** Authentication mode expected by a configured model provider. */
type ModelProviderAuthMode = NonNullable<ModelProviderSchemaInput["auth"]>;
type ModelDefinitionConfig = Omit<ModelDefinitionSchemaInput, "reasoning" | "input" | "cost" | "maxTokens" | "agentRuntime" | "mediaInput" | "compat"> & {
  /** Whether the model supports reasoning/thinking controls. */
  reasoning: boolean;
  /** Supported input modalities for routing and media-tool selection. */
  input: NonNullable<ModelDefinitionSchemaInput["input"]>;
  /** Token pricing in USD per million tokens. */
  cost: RawModelCostConfig;
  /** Maximum completion/output token budget. */
  maxTokens: number;
  /** Optional agent execution runtime override for this provider/model pair. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Provider compatibility flags for payload shaping and feature gating. */
  compat?: ModelCompatConfig;
  /** Media input limits used by routing and preflight compression. */
  mediaInput?: ModelMediaInputConfig;
};
type ModelProviderConfig = Omit<ModelProviderSchemaInput, "baseUrl" | "models" | "apiKey" | "headers" | "request" | "agentRuntime"> & {
  /** Provider API base URL. */
  baseUrl: string;
  /** API key or secret reference for this provider. */
  apiKey?: SecretInput;
  /** Secret-bearing headers merged into provider requests. */
  headers?: Record<string, SecretInput>;
  /** Provider request transport/retry overrides. */
  request?: ConfiguredModelProviderRequest;
  /** Optional default agent execution runtime for models under this provider. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Model catalog entries exposed by this provider. */
  models: ModelDefinitionConfig[];
};
/** Fully materialized provider declaration emitted by provider catalog plugins. */
type ModelProviderDeclarationConfig = ModelProviderConfig;
type ModelsConfig = Omit<ModelsSchemaInput, "providers"> & {
  /** Configured provider catalog keyed by provider id. */
  providers?: Record<string, ModelProviderConfig>;
};
//#endregion
//#region src/config/types.node-host.d.ts
type NodeHostSchemaInput = NonNullable<z.input<typeof NodeHostSchema>>;
type NodeHostConfig = Omit<NodeHostSchemaInput, "mcp"> & {
  mcp?: {
    servers?: Record<string, McpServerConfig>;
  };
};
//#endregion
//#region src/config/types.plugins.d.ts
type PluginsSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.plugins>>;
type PluginsConfig = PluginsSchemaInput & {
  /**
   * Internal transient carrier for plugin install records during command flows.
   * This is intentionally omitted from the config schema and must not be
   * persisted to openclaw.json.
   */
  installs?: Record<string, PluginInstallRecord>;
};
//#endregion
//#region src/config/zod-schema.telemetry.d.ts
declare const TelemetryConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  consentedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.telemetry.d.ts
type TelemetryConfig = NonNullable<z.input<typeof TelemetryConfigSchema>>;
//#endregion
//#region src/config/zod-schema.proxy.d.ts
declare const ProxyConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  proxyUrl: z.ZodOptional<z.ZodURL>;
  tls: z.ZodOptional<z.ZodObject<{
    caFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  loopbackMode: z.ZodOptional<z.ZodEnum<{
    block: "block";
    "gateway-only": "gateway-only";
    proxy: "proxy";
  }>>;
}, z.core.$strict>>;
type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
//#endregion
//#region src/config/types.openclaw.d.ts
/** One persisted suppression for a known security audit finding. */
type SecurityAuditSuppression = {
  /** Exact security audit check id to suppress. */
  checkId: string;
  /** Optional case-insensitive substring required in the finding title. */
  titleIncludes?: string;
  /** Optional case-insensitive substring required in the finding detail. */
  detailIncludes?: string;
  /** Operator rationale for accepting this standing finding. */
  reason?: string;
};
type SecurityConfig = {
  /** Security audit policy and accepted standing findings. */
  audit?: {
    /** Accepted security audit findings to omit from active summary/findings. */
    suppressions?: SecurityAuditSuppression[];
  };
  installPolicy?: {
    /**
     * Enable operator-owned install policy. When true without an exec command,
     * install/update attempts fail closed for supported targets.
     */
    enabled?: boolean;
    /** Supported install targets. Omit to cover every supported target. */
    targets?: Array<"skill" | "plugin">;
    /**
     * Trusted local policy command. Transport intentionally mirrors exec
     * SecretRef provider fields: absolute command, no shell, bounded output,
     * explicit env allowlist, and secure path checks.
     */
    exec?: {
      source: "exec";
      command: string;
      args?: string[];
      timeoutMs?: number;
      noOutputTimeoutMs?: number;
      maxOutputBytes?: number;
      env?: Record<string, string>;
      passEnv?: string[];
      trustedDirs?: string[];
    };
  };
};
type SurfaceConfigEntry = {
  /** Surface-specific silent reply policy for channels or UI integrations. */
  silentReply?: SilentReplyPolicyShape;
};
/** Top-level OpenClaw config as read from user/project config files. */
type OpenClawConfig = {
  /** @deprecated Doctor-only legacy input. */
  audit?: AuditConfig;
  /** JSON schema URL used by editors and generated config files. */
  $schema?: string;
  meta?: {
    /** Last OpenClaw version that wrote this config. */
    lastTouchedVersion?: string;
    /** One-time doctor migrations already applied to this config. */
    migrations?: {
      modelPolicyAllowlist?: true;
      utilityModelSeparation?: true;
    };
  };
  /** Authentication provider/profile configuration. */
  auth?: AuthConfig;
  /** Named access groups used by channel/provider policy allowlists. */
  accessGroups?: AccessGroupsConfig;
  /** ACP integration settings. */
  acp?: AcpConfig;
  env?: {
    /** Opt-in: import missing secrets from a login shell environment (interactive for Bash). */
    shellEnv?: {
      enabled?: boolean;
      /** Timeout for the login shell exec (ms). Default: 15000. */
      timeoutMs?: number;
    };
    /** Inline env vars to apply when not already present in the process env. */
    vars?: Record<string, string>;
    /** Sugar: allow env vars directly under env (string values only). */
    [key: string]: string | Record<string, string> | {
      enabled?: boolean;
      timeoutMs?: number;
    } | undefined;
  };
  wizard?: {
    /** Guided-onboarding discovery consent: "full" scans silently, "guarded" asks first. */
    accessMode?: "full" | "guarded";
    /** Offer installed-application plugin and skill recommendations during onboarding. */
    appRecommendations?: boolean;
    lastRunAt?: string;
    lastRunVersion?: string;
    lastRunCommit?: string;
    lastRunCommand?: string;
    lastRunMode?: "local" | "remote";
    securityAcknowledgedAt?: string;
  };
  /** Diagnostics, tracing, and stability debugging settings. */
  diagnostics?: DiagnosticsConfig;
  /** Log sink, level, rotation, and redaction settings. */
  logging?: LoggingConfig;
  /** Security audit suppressions and security policy settings. */
  security?: SecurityConfig;
  update?: {
    /** Update channel for git + npm installs ("stable", "extended-stable", "beta", or "dev"). */
    channel?: "stable" | "extended-stable" | "beta" | "dev";
    /** Check for updates on gateway start; disabling also prevents anonymous update pings. */
    checkOnStart?: boolean;
    /** Core auto-update policy for package installs. */
    auto?: {
      /** Enable background auto-update checks and apply logic. Default: false. */
      enabled?: boolean;
    };
  };
  /** Explicit operator consent for anonymous feature statistics in the daily update check. */
  telemetry?: TelemetryConfig;
  /** Browser automation and browser plugin integration settings. */
  browser?: BrowserConfig;
  ui?: {
    /** Accent color for OpenClaw UI chrome (hex). */
    seamColor?: string;
    /**
     * Operator display preferences. Canonical config home so agents can
     * change them through the approval gate and clients stay in sync; the
     * Control UI mirrors them into browser storage for instant boot.
     */
    prefs?: {
      /** Control UI theme. */
      theme?: "claw" | "knot" | "dash" | "absolutely" | "tide" | "beacon" | "phosphor" | "crt" | "manuscript" | "rose" | "miami" | "custom";
      /** Light/dark preference. */
      themeMode?: "light" | "dark" | "system";
      /** Control UI accent: #RRGGBB, or "theme" to bypass inherited accent colors. */
      accent?: string;
      /** BCP 47 UI locale, e.g. "en" or "pt-BR". */
      locale?: string;
      /** Show model thinking output in chat. */
      chatShowThinking?: boolean;
      /** Show tool call cards in chat. */
      chatShowToolCalls?: boolean;
      /** Keep model commentary in Control UI transcripts after a run. */
      chatPersistCommentary?: boolean;
      /** Chat send shortcut: Enter sends, or modifier+Enter sends. */
      chatSendShortcut?: "enter" | "modifier-enter";
      /** Follow-up handling while a run is active; unset uses the server queue mode. */
      chatFollowUpMode?: "steer" | "queue";
      /** Ordered page and pinned-session entries shown in the Control UI sidebar. */
      sidebarEntries?: string[];
    };
  };
  /** Secret providers, defaults, and ref-resolution settings. */
  secrets?: SecretsConfig;
  /** Skill loading and bundled skill configuration. */
  skills?: SkillsConfig;
  /** Plugin registry/install/runtime configuration. */
  plugins?: PluginsConfig;
  /** Per-surface policy keyed by channel/UI/runtime surface id. */
  surfaces?: Record<string, SurfaceConfigEntry>;
  /** Model providers, model catalog, pricing, and catalog merge policy. */
  models?: ModelsConfig;
  /** Node-host pairing and remote command node settings. */
  nodeHost?: NodeHostConfig;
  /** Agent definitions, defaults, bindings, and runtime policy. */
  agents?: AgentsConfig;
  /** Global root for new managed worktrees. Defaults to <state-dir>/worktrees; accepts ~. */
  worktreeRoot?: string;
  /** Use filesystem acceleration for new worktrees when supported (default: true). */
  worktreeAcceleration?: boolean;
  /** Tool exposure, policy, web/media tools, exec, and code-mode settings. */
  tools?: ToolsConfig;
  /** Legacy/direct agent bindings used by runtime resolution. */
  bindings?: AgentBinding[];
  /** Broadcast command and delivery settings. */
  broadcast?: BroadcastConfig;
  attachments?: {
    /** Optional retention window for persisted inbound media cleanup. */
    ttlHours?: number;
  };
  /** Message formatting, delivery, and action settings. */
  messages?: MessagesConfig;
  /** Shared text-to-speech defaults. Agent and channel overrides layer over this config. */
  tts?: TtsConfig;
  /** Chat command settings. */
  commands?: CommandsConfig;
  /** Human approval workflow settings. */
  approvals?: ApprovalsConfig;
  /** Session keying, reset, maintenance, send-policy, and thread-binding settings. */
  session?: SessionConfig;
  /** Channel defaults, built-in channel sections, and plugin-owned channel config. */
  channels?: ChannelsConfig;
  /** Cron schedule and retention settings. */
  cron?: CronConfig;
  /** Transcript persistence and export settings. */
  transcripts?: TranscriptsConfig;
  /** Runtime hook registration and queue behavior. */
  hooks?: HooksConfig;
  /** Network discovery and service advertisement settings. */
  discovery?: DiscoveryConfig;
  /** Voice/talk mode configuration. */
  talk?: TalkConfig;
  /** Gateway server, auth, UI, node-pairing, and dispatch settings. */
  gateway?: GatewayConfig;
  /** Opt-in cloud-worker provider profiles. */
  cloudWorkers?: CloudWorkersConfig;
  /** Experimental desktop sources owned by the gateway host. */
  desktop?: DesktopConfig;
  /** Memory indexing/search configuration. */
  memory?: MemoryConfig;
  /** MCP client/server and Codex MCP approval configuration. */
  mcp?: McpConfig;
  /** Network-level SSRF protection via an operator-managed forward proxy. */
  proxy?: ProxyConfig;
};
declare const openClawConfigStateBrand: unique symbol;
type BrandedConfigState<TState extends string> = OpenClawConfig & {
  readonly [openClawConfigStateBrand]?: TState;
};
/** Source config after includes/env substitution, before runtime defaults. */
type ResolvedSourceConfig = BrandedConfigState<"resolved-source">;
/** Runtime-materialized config with defaults/normalization applied. */
type RuntimeConfig = BrandedConfigState<"runtime">;
type ConfigValidationIssue = {
  errorCode?: string;
  fixHint?: string;
  code?: PluginDiagnosticCode;
  source?: string;
  /** Dot-path to the invalid or legacy config value. */
  path: string;
  /** Structured validator path used internally for lossless source diagnostics. */
  pathSegments?: Array<string | number>;
  /** Human-readable validation message. */
  message: string;
  /** Optional allowed values shown to the operator. */
  allowedValues?: string[];
  /** Number of allowed values omitted from the display list. */
  allowedValuesHiddenCount?: number;
};
type LegacyConfigIssue = {
  /** Dot-path to the legacy config value. */
  path: string;
  /** Human-readable migration or rejection message. */
  message: string;
};
type ConfigFileSnapshot = {
  /** Config file path that was read. */
  path: string;
  /** Lexical and canonical file paths reached while resolving $include directives. */
  includedPaths?: string[];
  /** Exact authored ownership for every successfully resolved $include directive. */
  includeProvenance?: readonly ConfigIncludeOwnership[];
  /** Temporary roster-only projection retained until write preparation uses generic ownership. */
  agentRosterIncludeOwned?: boolean;
  bindingsIncludeOwned?: boolean;
  /** Whether the config file exists on disk. */
  exists: boolean;
  /** Raw file contents before parsing; null when missing. */
  raw: string | null;
  /** Parsed JSON/JSONC/YAML value before schema normalization. */
  parsed: unknown;
  /** Internal include-expanded authored values paired with sourceConfigBeforeMigrations. */
  authoredConfig?: OpenClawConfig;
  /** Include/env-resolved source before raw compatibility migrations. */
  sourceConfigBeforeMigrations?: ResolvedSourceConfig;
  /**
   * Config authored on disk after $include resolution and ${ENV} substitution,
   * but BEFORE runtime defaults are applied.
   */
  sourceConfig: ResolvedSourceConfig;
  /**
   * Config after $include resolution and ${ENV} substitution, but BEFORE runtime
   * defaults are applied. Use this for config set/unset operations to avoid
   * leaking runtime defaults into the written config file.
   */
  resolved: ResolvedSourceConfig;
  valid: boolean;
  /** Runtime-shaped config used by in-process readers. */
  runtimeConfig: RuntimeConfig;
  /** @deprecated Prefer runtimeConfig. */
  config: RuntimeConfig;
  hash?: string;
  readError?: {
    code: string | null;
  };
  issues: ConfigValidationIssue[];
  warnings: ConfigValidationIssue[];
  legacyIssues: LegacyConfigIssue[];
  devMode?: boolean;
};
//#endregion
export { JsonSchemaObject as $, PluginInstallRecord as A, MarkdownTableMode as At, PluginManifestControlUi as B, ThinkingLevelMap as C, MemoryCitationsMode as Ct, Usage as D, GroupScope as Dt, Transport as E, DmScope as Et, PluginDiagnostic as F, PluginManifestModelIdNormalizationProvider as G, PluginManifestDashboardActionVerb as H, PluginFormat as I, PluginManifestProviderRequestProvider as J, PluginManifestNativeSessionCatalogSetup as K, PluginManifest as L, SilentReplyConversationType as M, SessionMaintenanceMode as Mt, PluginBundleFormat as N, SessionScope as Nt, McpCodexToolApprovalMode as O, HumanDelayConfig as Ot, PluginConfigUiHint as P, AgentRuntimePolicyConfig as Pt, ChannelConfigSchema as Q, PluginManifestChannelCommandDefaults as R, ThinkingBudgets as S, MentionPatternsPolicyConfig as St, ToolResultMessage as T, DmPolicy as Tt, PluginManifestDashboardDataBinding as U, PluginManifestDashboard as V, PluginManifestMcpServer as W, PluginKind as X, PluginManifestSetupProvider as Y, ChannelAccountKeyPolicy as Z, Message as _, ToolsConfig as _t, ModelMediaInputConfig as a, AgentBinding as at, StreamFn as b, SecretRef as bt, ModelProviderDeclarationConfig as c, TtsAutoMode as ct, AssistantMessage as d, TtsModelOverrideConfig as dt, ModelCatalogContextWindowOption as et, AssistantMessageEvent as f, TtsProvider as ft, ImageContent as g, ToolProfileId as gt, Context as h, ToolLoopDetectionConfig as ht, ModelDefinitionConfig as i, AccessGroupConfig as it, TalkProviderConfig as j, ReplyToMode as jt, McpServerToolFilterConfig as k, IdentityConfig as kt, ModelApi as l, TtsConfig as lt, CompleteSimpleFn as m, GroupToolPolicyConfig as mt, OpenClawConfig as n, UnifiedModelCatalogEntry as nt, ModelProviderAuthMode as o, ChannelImplicitMentionsConfig as ot, AssistantMessageEventStreamContract as p, GroupToolPolicyBySenderConfig as pt, PluginManifestProviderEndpoint as q, ModelCompatConfig as r, UnifiedModelCatalogKind as rt, ModelProviderConfig as s, ResolvedTtsPersona as st, ConfigFileSnapshot as t, ModelCatalogStatus as tt, Api as u, TtsMode as ut, Model as v, SafeBinProfileFixture as vt, Tool as w, ContextVisibilityMode as wt, TextContent as x, BroadcastStrategy as xt, SimpleStreamOptions as y, SecretInput as yt, PluginManifestContracts as z };