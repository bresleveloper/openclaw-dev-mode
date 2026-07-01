import { ensureMcpLoopbackServer } from "../../gateway/mcp-http.js";
import { createMcpLoopbackServerConfig, getActiveMcpLoopbackRuntime, resolveMcpLoopbackBearerToken } from "../../gateway/mcp-http.loopback-runtime.js";
import { resolveMcpLoopbackScopedTools } from "../../gateway/mcp-http.runtime.js";
import type { CliBackendAuthEpochMode, CliBackendPreparedExecution } from "../../plugins/cli-backend.types.js";
import { resolveApiKeyForProfile } from "../auth-profiles/oauth.js";
import type { AuthProfileCredential } from "../auth-profiles/types.js";
import { makeBootstrapWarn as makeBootstrapWarnImpl, resolveBootstrapContextForRun as resolveBootstrapContextForRunImpl } from "../bootstrap-files.js";
import { claudeCliSessionTranscriptHasContent, claudeCliSessionTranscriptHasOrphanedToolUse } from "../command/attempt-execution.helpers.js";
import { prepareClaudeCliSkillsPlugin } from "./claude-skills-plugin.js";
import type { PreparedCliRunContext, RunCliAgentParams } from "./types.js";
declare const prepareDeps: {
    makeBootstrapWarn: typeof makeBootstrapWarnImpl;
    resolveBootstrapContextForRun: typeof resolveBootstrapContextForRunImpl;
    getActiveMcpLoopbackRuntime: typeof getActiveMcpLoopbackRuntime;
    ensureMcpLoopbackServer: typeof ensureMcpLoopbackServer;
    createMcpLoopbackServerConfig: typeof createMcpLoopbackServerConfig;
    resolveMcpLoopbackBearerToken: typeof resolveMcpLoopbackBearerToken;
    resolveMcpLoopbackScopedTools: typeof resolveMcpLoopbackScopedTools;
    resolveOpenClawReferencePaths: (params: Parameters<typeof import("../docs-path.js").resolveOpenClawReferencePaths>[0]) => Promise<{
        docsPath: string | null;
        sourcePath: string | null;
    }>;
    prepareClaudeCliSkillsPlugin: typeof prepareClaudeCliSkillsPlugin;
    claudeCliSessionTranscriptHasContent: typeof claudeCliSessionTranscriptHasContent;
    claudeCliSessionTranscriptHasOrphanedToolUse: typeof claudeCliSessionTranscriptHasOrphanedToolUse;
    resolveApiKeyForProfile: typeof resolveApiKeyForProfile;
};
/** Overrides preparation dependencies for CLI runner tests. */
export declare function setCliRunnerPrepareTestDeps(overrides: Partial<typeof prepareDeps>): void;
/** Returns whether profile-owned prepared execution should skip local CLI epoch hashing. */
export declare function shouldSkipLocalCliCredentialEpoch(params: {
    authEpochMode?: CliBackendAuthEpochMode;
    authProfileId?: string;
    authCredential?: AuthProfileCredential;
    preparedExecution?: CliBackendPreparedExecution | null;
}): boolean;
/** Builds the complete context required to execute a CLI-backed agent run. */
export declare function prepareCliRunContext(params: RunCliAgentParams): Promise<PreparedCliRunContext>;
export {};
