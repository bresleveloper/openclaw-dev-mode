import type { SessionAttentionClassification } from "./diagnostic-session-attention.js";
import { type StuckSessionRecoveryOutcome, type StuckSessionRecoveryRequest } from "./diagnostic-session-recovery.js";
export type RecoverStuckSession = (params: StuckSessionRecoveryRequest) => void | StuckSessionRecoveryOutcome | Promise<void | StuckSessionRecoveryOutcome>;
type RequestStuckSessionRecoveryParams = {
    recover: RecoverStuckSession;
    request: StuckSessionRecoveryRequest;
    classification: SessionAttentionClassification;
};
export declare function requestStuckSessionRecoveryOutcome(params: RequestStuckSessionRecoveryParams): Promise<StuckSessionRecoveryOutcome | undefined>;
export declare function requestStuckSessionRecovery(params: RequestStuckSessionRecoveryParams): void;
export declare function resetDiagnosticSessionRecoveryCoordinatorForTest(): void;
export {};
