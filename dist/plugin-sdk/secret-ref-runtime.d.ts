import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { d as SecretInput, f as SecretRef, i as SecretProviderConfig, o as coerceSecretRef, t as PluginIntegrationSecretProviderConfig } from "../types.secrets-BR-Cncxg.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CMnhqUB6.js";
import { a as createResolverContext, d as SecretRefResolveCache, r as applyResolvedAssignments } from "../runtime-shared-BhZQISET.js";
//#region src/secrets/plan.d.ts
/** Registry target id accepted by a secrets apply plan. */
type SecretsPlanTargetType = string;
/** One planned SecretRef mutation against config or auth-profile storage. */
type SecretsPlanTarget = {
  type: SecretsPlanTargetType;
  /**
   * Dot path in the target config surface for operator readability.
   * Examples:
   * - "models.providers.openai.apiKey"
   * - "profiles.openai.key"
   */
  path: string;
  /**
   * Canonical path segments used for safe mutation.
   * Examples:
   * - ["models", "providers", "openai", "apiKey"]
   * - ["profiles", "openai", "key"]
   */
  pathSegments?: string[];
  ref: SecretRef;
  /**
   * Required for auth-profiles targets so apply can resolve the correct agent store.
   */
  agentId?: string;
  /**
   * For provider targets, used to scrub auth-profile/static residues.
   */
  providerId?: string;
  /** For account-scoped channel targets. */
  accountId?: string;
  /**
   * Optional auth-profile provider value used when creating new auth profile mappings.
   */
  authProfileProvider?: string;
};
/** Serialized plan produced by `openclaw secrets configure` or supplied manually. */
type SecretsApplyPlan = {
  version: 1;
  protocolVersion: 1;
  generatedAt: string;
  generatedBy: "openclaw secrets configure" | "manual";
  providerUpserts?: Record<string, SecretProviderConfig>;
  providerDeletes?: string[];
  targets: SecretsPlanTarget[];
  options?: {
    scrubEnv?: boolean;
    scrubAuthProfilesForProviderTargets?: boolean;
    scrubLegacyAuthJson?: boolean;
  };
};
//#endregion
//#region src/secrets/plugin-setup-plan.d.ts
type PluginSecretRefProviderMapping = {
  providerId: string;
  secretId: string;
};
type PluginSecretRefConfigTargetMapping = {
  path: string;
  agentId?: string;
  secretId: string;
};
declare function assertValidPluginSecretProviderAlias(value: string): void;
declare function assertValidPluginModelProviderId(label: string, value: string): void;
declare function parsePluginSecretTargetSpecifier(productName: string, value: string): {
  path: string;
  agentId?: string;
};
declare function buildPluginSecretRefSetupPlan(params: {
  productName: string;
  providerAlias: string;
  providerConfig: PluginIntegrationSecretProviderConfig;
  providerSecrets: PluginSecretRefProviderMapping[];
  configTargetSecrets?: PluginSecretRefConfigTargetMapping[];
  generatedAt?: string;
}): SecretsApplyPlan & {
  providerUpserts: Record<string, PluginIntegrationSecretProviderConfig>;
};
//#endregion
//#region src/secrets/trusted-plan-path.d.ts
declare function resolveTrustedExecutablePath(targetPath: string): Promise<string>;
declare function resolveTrustedPlanDirectoryPath(targetPath: string): Promise<string>;
//#endregion
//#region src/secrets/resolve.d.ts
type ResolveSecretRefOptions = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  cache?: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
export declare function resolveSecretRefValues(refs: SecretRef[], options: ResolveSecretRefOptions): Promise<Map<string, unknown>>;
//#endregion
//#region src/plugin-sdk/secret-ref-runtime.d.ts
type SecretRefSetupCommand = {
  command(name: string): SecretRefSetupCommand;
  description(value: string): SecretRefSetupCommand;
  option(flags: string, description: string, defaultValueOrParser?: string | ((value: string, previous?: string[]) => string[]), defaultValue?: string[]): SecretRefSetupCommand;
  action<TOptions>(fn: (options: TOptions) => void | Promise<void>): SecretRefSetupCommand;
};
type SecretRefProviderStatus = {
  configured: boolean;
  source?: string;
  command?: string;
  pluginIntegration?: {
    pluginId: string;
    integrationId: string;
  };
};
type PluginSecretRefSetupCliParams = {
  productName: string;
  secretIdLabel: string;
  secretIdPlaceholder: string;
  defaultProviderAlias: string;
  pluginIntegration: {
    pluginId: string;
    integrationId: string;
  };
  normalizeSecretId: (label: string, value: string) => string;
  defaultPlanPath: () => string;
  beforeApplyCommands?: readonly string[];
};
declare function writeSecretPlanFile(params: {
  planPath: string;
  content: string;
  platform?: NodeJS.Platform;
  createPrivateWindowsFile?: (filePath: string, content: string) => Promise<void>;
}): Promise<void>;
/** Build the canonical setup/status adapter shared by plugin-owned SecretRef CLIs. */
export declare function createPluginSecretRefSetupCli(params: PluginSecretRefSetupCliParams): {
  inspectProvider: (config: OpenClawConfig, requestedAlias?: string) => {
    providerAlias: string;
    provider: SecretRefProviderStatus;
    providerReady: boolean;
  };
  registerSetupCommand: (command: SecretRefSetupCommand) => void;
};
/** Shared validation and apply-plan construction for plugin-owned SecretRef setup CLIs. */
export declare const pluginSecretRefSetup: {
  assertValidModelProviderId: typeof assertValidPluginModelProviderId;
  assertValidProviderAlias: typeof assertValidPluginSecretProviderAlias;
  buildPlan: typeof buildPluginSecretRefSetupPlan;
  parseTargetSpecifier: typeof parsePluginSecretTargetSpecifier;
  resolveTrustedDirectoryPath: typeof resolveTrustedPlanDirectoryPath;
  resolveTrustedExecutablePath: typeof resolveTrustedExecutablePath;
  writePlanFile: typeof writeSecretPlanFile;
};
//#endregion
export { type SecretInput, type SecretRef, applyResolvedAssignments, coerceSecretRef, createResolverContext };