import type { EmbeddedRunAttemptParams } from "../embedded-agent-runner/run/types.js";
export type AgentHarnessUserInputOption = {
    label: string;
    description?: string;
};
export type AgentHarnessUserInputQuestion = {
    id: string;
    header: string;
    question: string;
    isOther?: boolean;
    isSecret?: boolean;
    options?: readonly AgentHarnessUserInputOption[] | null;
};
export type AgentHarnessUserInputAnswers = {
    answers: Record<string, {
        answers: string[];
    }>;
};
export type AgentHarnessUserInputPromptOptions = {
    intro?: string;
    formatText?: (text: string) => string;
    secretWarning?: string;
    otherLabel?: string;
};
type PromptDeliveryParams = Pick<EmbeddedRunAttemptParams, "onBlockReply" | "onPartialReply">;
export declare function emptyAgentHarnessUserInputAnswers(): AgentHarnessUserInputAnswers;
export declare function formatAgentHarnessUserInputPrompt(questions: readonly AgentHarnessUserInputQuestion[], options?: AgentHarnessUserInputPromptOptions): string;
export declare function deliverAgentHarnessUserInputPrompt(params: PromptDeliveryParams, questions: readonly AgentHarnessUserInputQuestion[], options?: AgentHarnessUserInputPromptOptions): Promise<void>;
export declare function buildAgentHarnessUserInputAnswers(questions: readonly AgentHarnessUserInputQuestion[], inputText: string): AgentHarnessUserInputAnswers;
export declare function normalizeAgentHarnessUserInputAnswer(answer: string, question: AgentHarnessUserInputQuestion): string | undefined;
export {};
