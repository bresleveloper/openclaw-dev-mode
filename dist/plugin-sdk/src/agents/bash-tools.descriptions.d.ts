/** Builds the model-facing exec tool description for the current platform/config. */
export declare function describeExecTool(params?: {
    agentId?: string;
    hasCronTool?: boolean;
}): string;
/** Builds the model-facing process-control tool description. */
export declare function describeProcessTool(params?: {
    hasCronTool?: boolean;
}): string;
