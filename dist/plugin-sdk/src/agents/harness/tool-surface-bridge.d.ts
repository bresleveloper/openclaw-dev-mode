import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { HookContext } from "../agent-tools.before-tool-call.js";
import { type ToolSearchCatalogRef, type ToolSearchCatalogToolExecutor } from "../tool-search.js";
import type { AnyAgentTool } from "../tools/common.js";
export type AgentHarnessToolSurfaceRuntime = {
    codeModeControlsEnabled: boolean;
    compactTools: (tools: AnyAgentTool[], options?: {
        hookContext?: HookContext;
    }) => {
        tools: AnyAgentTool[];
    };
    config: OpenClawConfig | undefined;
    includeToolSearchControls: boolean;
    runtimeToolAllowlist: string[] | undefined;
    toolSearchCatalogRef: ToolSearchCatalogRef | undefined;
    toolSearchControlsEnabled: boolean;
    cleanup: () => void;
    toolSearchCatalogExecutor: ToolSearchCatalogToolExecutor | undefined;
};
export declare function createAgentHarnessToolSurfaceRuntime(params: {
    abortSignal?: AbortSignal;
    agentId?: string;
    config?: OpenClawConfig;
    disableTools?: boolean;
    executeTool: ToolSearchCatalogToolExecutor;
    forceMessageTool?: boolean;
    isRawModelRun?: boolean;
    modelToolsEnabled: boolean;
    prompt?: string;
    runId?: string;
    runtimeToolAllowlist?: readonly string[];
    sessionId?: string;
    sessionKey?: string;
    sourceReplyDeliveryMode?: string;
    toolsAllow?: readonly string[];
}): AgentHarnessToolSurfaceRuntime;
