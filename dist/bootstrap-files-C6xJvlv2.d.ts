import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { t as EmbeddedContextFile } from "./types-CMKgUJ7Q.js";
import { i as WorkspaceBootstrapFile } from "./internal-hook-types-BohNPEA8.js";

//#region src/agents/bootstrap-files.d.ts
type BootstrapContextMode = "full" | "lightweight";
type BootstrapContextRunKind = "default" | "heartbeat" | "cron";
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
declare function resolveBootstrapFilesForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<WorkspaceBootstrapFile[]>;
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
declare function resolveBootstrapContextForRun(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  warn?: (message: string) => void;
  contextMode?: BootstrapContextMode;
  runKind?: BootstrapContextRunKind;
}): Promise<{
  bootstrapFiles: WorkspaceBootstrapFile[];
  contextFiles: EmbeddedContextFile[];
}>;
/** Builds bounded context files from already-resolved bootstrap file metadata. */
declare function buildBootstrapContextForFiles(bootstrapFiles: WorkspaceBootstrapFile[], params: {
  config?: OpenClawConfig;
  agentId?: string | null;
  warn?: (message: string) => void;
}): EmbeddedContextFile[];
//#endregion
export { resolveBootstrapContextForRun as n, resolveBootstrapFilesForRun as r, buildBootstrapContextForFiles as t };