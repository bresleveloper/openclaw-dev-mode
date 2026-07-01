import { callGateway } from "../../gateway/call.js";
type GatewayCaller = typeof callGateway;
type AgentCommandRunner = typeof import("../../commands/agent.js").agentCommandFromIngress;
/** Sends one annotated message to a target session and returns the resulting assistant text. */
export declare function runAgentStep(params: {
    sessionKey: string;
    message: string;
    extraSystemPrompt: string;
    timeoutMs: number;
    channel?: string;
    lane?: string;
    transcriptMessage?: string;
    sourceSessionKey?: string;
    sourceChannel?: string;
    sourceTool?: string;
}): Promise<string | undefined>;
/** Test-only dependency overrides for gateway and in-process command execution. */
export declare const testing: {
    setDepsForTest(overrides?: Partial<{
        agentCommandFromIngress: AgentCommandRunner;
        callGateway: GatewayCaller;
    }>): void;
};
export { testing as __testing };
