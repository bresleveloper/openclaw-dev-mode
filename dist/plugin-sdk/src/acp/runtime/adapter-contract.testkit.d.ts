import type { AcpRuntime, AcpRuntimeEvent } from "@openclaw/acp-core/runtime/types";
/** Inputs and optional assertions for the shared ACP runtime adapter contract. */
export type AcpRuntimeAdapterContractParams = {
    createRuntime: () => Promise<AcpRuntime> | AcpRuntime;
    agentId?: string;
    successPrompt?: string;
    errorPrompt?: string;
    includeControlChecks?: boolean;
    assertSuccessEvents?: (events: AcpRuntimeEvent[]) => void | Promise<void>;
    assertErrorOutcome?: (params: {
        events: AcpRuntimeEvent[];
        thrown: unknown;
    }) => void | Promise<void>;
};
/** Runs the shared behavioral contract for ACP runtime adapters. */
export declare function runAcpRuntimeAdapterContract(params: AcpRuntimeAdapterContractParams): Promise<void>;
