import { i as OpenClawConfig } from "../../types.openclaw-B5gtuEn_.js";
import { $ as ZodPipe, B as ZodLiteral, C as ZodEnum, Mi as output, Q as ZodOptional, Z as ZodObject, bt as ZodUnion, c as ZodBoolean, ft as ZodTransform, h as ZodCustom, it as ZodRecord, na as $strict, p as ZodCatch, r as ZodArray, ra as $strip, st as ZodString, tt as ZodPreprocess, v as ZodDefault } from "../../schemas-CkRCGSfd.js";
import { yo as AgentHarness } from "../../types-BpDhk2ev.js";
import { n as CodexAppServerModel, r as CodexAppServerModelListResult, t as CodexAppServerListModelsOptions } from "../../models-qZ2ygxM4.js";

//#region extensions/codex/src/app-server/session-binding.d.ts
/** Stable owner of one Codex thread binding. */
type CodexAppServerBindingIdentity = {
  kind: "session";
  agentId: string;
  sessionId: string;
  sessionKey?: string;
} | {
  kind: "conversation";
  bindingId: string;
};
declare const threadBindingSchema: ZodObject<{
  threadId: ZodString;
  cwd: ZodString;
  authProfileId: ZodCatch<ZodOptional<ZodString>>;
  model: ZodCatch<ZodOptional<ZodString>>;
  modelProvider: ZodCatch<ZodOptional<ZodPipe<ZodPipe<ZodString, ZodTransform<string, string>>, ZodString>>>;
  approvalPolicy: ZodCatch<ZodPreprocess<ZodOptional<ZodEnum<{
    never: "never";
    "on-request": "on-request";
    untrusted: "untrusted";
  }>>>>;
  sandbox: ZodCatch<ZodOptional<ZodEnum<{
    "read-only": "read-only";
    "workspace-write": "workspace-write";
    "danger-full-access": "danger-full-access";
  }>>>;
  serviceTier: ZodCatch<ZodOptional<ZodPreprocess<ZodOptional<ZodCustom<string, string>>>>>;
  networkProxyProfileName: ZodCatch<ZodOptional<ZodString>>;
  networkProxyConfigFingerprint: ZodCatch<ZodOptional<ZodString>>;
  dynamicToolsFingerprint: ZodCatch<ZodOptional<ZodString>>;
  dynamicToolsContainDeferred: ZodCatch<ZodOptional<ZodBoolean>>;
  webSearchThreadConfigFingerprint: ZodCatch<ZodOptional<ZodString>>;
  userMcpServersFingerprint: ZodCatch<ZodOptional<ZodString>>;
  mcpServersFingerprint: ZodCatch<ZodOptional<ZodString>>;
  nativeHookRelayGeneration: ZodCatch<ZodOptional<ZodString>>;
  appServerRuntimeFingerprint: ZodCatch<ZodOptional<ZodString>>;
  pluginAppsFingerprint: ZodCatch<ZodOptional<ZodString>>;
  pluginAppsInputFingerprint: ZodCatch<ZodOptional<ZodString>>;
  pluginAppPolicyContext: ZodCatch<ZodOptional<ZodObject<{
    fingerprint: ZodString;
    apps: ZodRecord<ZodString, ZodUnion<readonly [ZodObject<{
      source: ZodLiteral<"account">;
      appName: ZodString;
      allowDestructiveActions: ZodBoolean;
      destructiveApprovalMode: ZodCatch<ZodOptional<ZodEnum<{
        auto: "auto";
        allow: "allow";
        deny: "deny";
        ask: "ask";
      }>>>;
      mcpServerNames: ZodArray<ZodString>;
    }, $strict>, ZodObject<{
      source: ZodOptional<ZodLiteral<"plugin">>;
      configKey: ZodString;
      marketplaceName: ZodLiteral<"openai-curated">;
      pluginName: ZodString;
      allowDestructiveActions: ZodBoolean;
      destructiveApprovalMode: ZodCatch<ZodOptional<ZodEnum<{
        auto: "auto";
        allow: "allow";
        deny: "deny";
        ask: "ask";
      }>>>;
      mcpServerNames: ZodArray<ZodString>;
    }, $strict>]>>;
    pluginAppIds: ZodDefault<ZodRecord<ZodString, ZodArray<ZodString>>>;
  }, $strict>>>;
  contextEngine: ZodCatch<ZodOptional<ZodObject<{
    schemaVersion: ZodLiteral<1>;
    engineId: ZodString;
    policyFingerprint: ZodString;
    projection: ZodCatch<ZodOptional<ZodObject<{
      schemaVersion: ZodLiteral<1>;
      mode: ZodLiteral<"thread_bootstrap">;
      epoch: ZodString;
      fingerprint: ZodCatch<ZodOptional<ZodString>>;
    }, $strict>>>;
  }, $strict>>>;
  environmentSelectionFingerprint: ZodCatch<ZodOptional<ZodString>>;
  conversationStartId: ZodCatch<ZodOptional<ZodString>>;
  conversationSourceTransferComplete: ZodCatch<ZodOptional<ZodLiteral<true>>>;
  historyCoveredThrough: ZodCatch<ZodOptional<ZodString>>;
}, $strip>;
/** Durable Codex thread facts. Storage identity and schema stay outside this domain value. */
type CodexAppServerThreadBinding = output<typeof threadBindingSchema>;
type CodexAppServerBindingMutation = {
  kind: "set";
  binding: CodexAppServerThreadBinding;
  if?: {
    kind: "absent";
  };
} | {
  kind: "patch";
  threadId: string;
  patch: Partial<Omit<CodexAppServerThreadBinding, "threadId">>;
} | {
  kind: "reclaim-generation";
  expectedPreviousSessionId: string;
} | {
  kind: "clear";
  threadId?: string;
};
type CodexSessionGenerationAdoptionResult = "adopted" | "current" | "absent" | "conflict";
type CodexSessionGenerationRetirementResult = "applied" | "absent" | "conflict";
type CodexSessionGenerationReclaimPlan = {
  kind: "resolved";
  result: boolean;
} | {
  kind: "verify";
  expectedPreviousSessionId: string;
};
type CodexAppServerBindingStore = {
  read(identity: CodexAppServerBindingIdentity): Promise<CodexAppServerThreadBinding | undefined>;
  mutate(identity: CodexAppServerBindingIdentity, mutation: CodexAppServerBindingMutation): Promise<boolean>;
  prepareSessionGenerationReclaim(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>): Promise<CodexSessionGenerationReclaimPlan>;
  adoptSessionGeneration(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>, expectedPreviousSessionId: string): Promise<CodexSessionGenerationAdoptionResult>;
  retireSessionGeneration(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>): Promise<CodexSessionGenerationRetirementResult>;
  withLease<T>(identity: CodexAppServerBindingIdentity, run: () => Promise<T>): Promise<T>;
};
//#endregion
//#region extensions/codex/harness.d.ts
/**
 * Creates the Codex app-server harness used for attempts, side questions,
 * compaction, reset, and disposal.
 */
declare function createCodexAppServerAgentHarness(options: {
  id?: string;
  label?: string;
  providerIds?: Iterable<string>;
  pluginConfig?: unknown;
  resolvePluginConfig?: () => unknown;
  resolveConfig?: () => OpenClawConfig | undefined;
  bindingStore: CodexAppServerBindingStore;
}): AgentHarness;
//#endregion
export { type CodexAppServerListModelsOptions, type CodexAppServerModel, type CodexAppServerModelListResult, createCodexAppServerAgentHarness };