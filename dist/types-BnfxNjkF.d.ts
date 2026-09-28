import "./types.openclaw-LzSbb55e.js";
import "./zod-schema.implicit-mentions-Du1YLL_X.js";
import "./types.base-CA0_JvyZ.js";
import "./types.secrets-BR-Cncxg.js";
import { z } from "zod";
//#region src/config/zod-schema.sandbox.d.ts
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
//#endregion
//#region src/config/types.sandbox.d.ts
type SandboxDockerSettings = NonNullable<z.output<typeof SandboxDockerSchema>>;
//#endregion
export { SandboxDockerSettings as t };