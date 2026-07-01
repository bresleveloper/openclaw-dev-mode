import type { SandboxBackendCommandParams, SandboxBackendCommandResult, SandboxFsBridgeContext } from "./backend-handle.types.js";
import type { SandboxFsBridge } from "./fs-bridge.types.js";
/** Minimal remote shell contract used by the SSH filesystem bridge. */
export type RemoteShellSandboxHandle = {
    remoteWorkspaceDir: string;
    remoteAgentWorkspaceDir: string;
    runRemoteShellScript(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
};
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
export declare function createRemoteShellSandboxFsBridge(params: {
    sandbox: SandboxFsBridgeContext;
    runtime: RemoteShellSandboxHandle;
}): SandboxFsBridge;
