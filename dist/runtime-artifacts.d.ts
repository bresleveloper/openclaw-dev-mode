import { Ht as PluginRegistry, Ln as NodeBootstrapArtifactOptions } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { t as PluginManifestRecord } from "./manifest-registry-CNNq5Vj2.js";
import { n as WorkerAdmissionHandshake } from "./index-DSy-_0fC.js";
import { d as WorkerExecutionMode } from "./environments-DuGZujQU.js";
type TransferArtifact = {
  tarballPath: string;
  tarballSha256: string;
  tarballBytes: number;
};
type NodeBootstrapPluginSelection = {
  registry: {
    plugins: Array<Pick<PluginRegistry["plugins"][number], "id" | "enabled" | "status" | "rootDir" | "packageName" | "packageVersion">>;
    agentHarnesses: Array<{
      pluginId: string;
      harness: Pick<PluginRegistry["agentHarnesses"][number]["harness"], "cloudPlacement">;
    }>;
    nodeHostCommands: Array<{
      pluginId: string;
      command: {
        command: string;
      };
    }>;
  };
  metadata: {
    byPluginId: ReadonlyMap<string, Pick<PluginManifestRecord, "origin" | "trustedOfficialInstall" | "rootDir" | "packageName" | "packageVersion">>;
  };
  executionMode?: WorkerExecutionMode;
};
/** Selects node runtime packages from the Gateway's already validated plugin generation. */
export declare function resolveNodeBootstrapPlugins(params: NodeBootstrapPluginSelection): Array<{
  id: string;
  root: string;
}>;
/** Immutable source archive within the running node's owning package, outside its dist inventory. */
export declare function workerBundleArchiveRelativePath(sha256: string): string;
/** Qualify only this installed bundled generation, without publishing a Gateway registry. */
export declare function qualifyWorkerRuntimePlugins(options: {
  packageRoot: string;
  config: OpenClawConfig;
  signal?: AbortSignal;
}): Promise<NodeBootstrapPluginSelection>;
export type WorkerRuntimeArtifactExportOptions = Omit<NodeBootstrapArtifactOptions, "install"> & {
  outputDirectory: string;
  signal?: AbortSignal;
};
/** Export the canonical node and worker bytes; installation and enrollment remain provider-owned. */
export declare function prepareWorkerRuntimeArtifacts(options: WorkerRuntimeArtifactExportOptions): Promise<Readonly<{
  schema: "openclaw.worker-runtime-artifacts.v1";
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
  nodeBootstrap: Readonly<{
    tarballPath: string;
    tarballSha256: string;
    tarballBytes: number;
    openclawVersion: string;
    buildId: string;
    manifestSha256?: string;
    install?: "bundle" | "npm";
    enabledPluginIds: readonly string[];
    installLock?: TransferArtifact;
  }>;
  workerBundle: Readonly<{
    bundleHash: WorkerAdmissionHandshake["bundleHash"];
    openclawVersion: WorkerAdmissionHandshake["openclawVersion"];
    protocolFeatures: readonly string[];
    install: "bundle";
    tarballBytes: number;
    tarballSha256: string;
    tarballPath: string;
  }>;
}>>;
export type { NodeBootstrapPluginSelection };