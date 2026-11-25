import { Mt as AccessGroupsSchema, Pt as OpenClawSchemaShape, wn as QueueConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types.base-BJujKINr.js";
import "./types.secrets-D_jefub3.js";
import { z } from "zod";
type AccessGroupsConfig = NonNullable<z.input<typeof AccessGroupsSchema>>;
type AccessGroupConfig = AccessGroupsConfig[string];
type AuthConfig = NonNullable<z.input<typeof OpenClawSchemaShape.auth>>;
declare const CloudWorkersConfigSchema: z.ZodOptional<z.ZodObject<{
  requiredProfile: z.ZodOptional<z.ZodString>;
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
    workspaceDurability: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
      mode: z.ZodLiteral<"mirrored">;
    }, z.core.$strict>, z.ZodObject<{
      mode: z.ZodLiteral<"retained-disk">;
      computeWindowSeconds: z.ZodNumber;
    }, z.core.$strict>], "mode">>;
    suspendAfter: z.ZodOptional<z.ZodString>;
    readyWorkers: z.ZodOptional<z.ZodNumber>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strict>>>;
}, z.core.$strict>>;
declare const { labels: CLOUD_WORKER_FIELD_LABELS, help: CLOUD_WORKER_FIELD_HELP }: {
  labels: Record<string, string>;
  help: Record<string, string>;
};
type CloudWorkersConfig = NonNullable<z.input<typeof CloudWorkersConfigSchema>>;
type CloudWorkerProfileConfig = NonNullable<NonNullable<CloudWorkersConfig["profiles"]>[string]>;
declare const DesktopConfigSchema: z.ZodOptional<z.ZodObject<{
  host: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodBoolean;
    managed: z.ZodOptional<z.ZodBoolean>;
    port: z.ZodOptional<z.ZodNumber>;
    passwordFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const { labels: DESKTOP_FIELD_LABELS, help: DESKTOP_FIELD_HELP }: {
  labels: Record<string, string>;
  help: Record<string, string>;
};
type DesktopConfig = NonNullable<z.input<typeof DesktopConfigSchema>>;
type DesktopHostConfig = NonNullable<DesktopConfig["host"]>;
/** Queue overflow policy for inbound channel messages. */
type QueueDropPolicy = NonNullable<QueueConfig["drop"]>;
declare const SandboxDockerSchema: z.ZodOptional<z.ZodObject<{
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
type SandboxDockerSettings = NonNullable<z.output<typeof SandboxDockerSchema>>;
declare const { labels: TELEMETRY_FIELD_LABELS, help: TELEMETRY_FIELD_HELP }: {
  labels: Record<string, string>;
  help: Record<string, string>;
};
export { AuthConfig as a, CloudWorkerProfileConfig as i, QueueDropPolicy as n, AccessGroupConfig as o, DesktopHostConfig as r, AccessGroupsConfig as s, SandboxDockerSettings as t };