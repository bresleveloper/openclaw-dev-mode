import type { SessionSystemPromptReport } from "../config/sessions/types.js";
import type { EmbeddedContextFile } from "./embedded-agent-helpers.js";
import type { AgentTool } from "./runtime/index.js";
import type { WorkspaceBootstrapFile } from "./workspace.js";
/** Builds the stored report for a rendered system prompt and its inputs. */
export declare function buildSystemPromptReport(params: {
    source: SessionSystemPromptReport["source"];
    generatedAt: number;
    sessionId?: string;
    sessionKey?: string;
    provider?: string;
    model?: string;
    workspaceDir?: string;
    bootstrapMaxChars: number;
    bootstrapTotalMaxChars?: number;
    bootstrapTruncation?: SessionSystemPromptReport["bootstrapTruncation"];
    sandbox?: SessionSystemPromptReport["sandbox"];
    systemPrompt: string;
    bootstrapFiles: WorkspaceBootstrapFile[];
    injectedFiles: EmbeddedContextFile[];
    skillsPrompt: string;
    tools: AgentTool[];
    currentTurn?: SessionSystemPromptReport["currentTurn"];
}): SessionSystemPromptReport;
