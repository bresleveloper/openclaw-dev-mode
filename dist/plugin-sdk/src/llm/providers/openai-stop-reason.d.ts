import type { StopReason } from "../types.js";
export type OpenAIStopReasonResult = {
    stopReason: StopReason;
    errorMessage?: string;
};
export declare function mapOpenAIStopReason(reason: string | null, options?: {
    allowSingularToolCall?: boolean;
}): OpenAIStopReasonResult;
