type DurableInstruction = {
    skillName: string;
    description: string;
    content: string;
    goal: string;
    evidence: string;
};
/** Extracts a candidate durable instruction from transcript text. */
export declare function extractDurableInstructionProposal(params: {
    messages: unknown[];
}): DurableInstruction | undefined;
export {};
