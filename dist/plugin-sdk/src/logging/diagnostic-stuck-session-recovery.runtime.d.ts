import { type StuckSessionRecoveryOutcome, type StuckSessionRecoveryRequest } from "./diagnostic-session-recovery.js";
/** Request parameters accepted by the stuck-session recovery runtime. */
type StuckSessionRecoveryParams = StuckSessionRecoveryRequest;
export declare function recoverStuckDiagnosticSession(params: StuckSessionRecoveryParams): Promise<StuckSessionRecoveryOutcome>;
/** Test hooks for clearing in-flight recovery guards. */
export declare const testing: {
    resetRecoveriesInFlight(): void;
};
export { testing as __testing };
