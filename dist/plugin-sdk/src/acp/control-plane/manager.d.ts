/** Public singleton facade for the ACP session manager control plane. */
import { AcpSessionManager } from "./manager.core.js";
export { AcpSessionManager } from "./manager.core.js";
export type { AcpCloseSessionInput, AcpCloseSessionResult, AcpInitializeSessionInput, AcpManagerObservabilitySnapshot, AcpRunTurnInput, AcpSessionResolution, AcpSessionRuntimeOptions, AcpSessionStatus, AcpStartupIdentityReconcileResult, } from "./manager.types.js";
/** Returns the process-wide ACP session manager singleton. */
export declare function getAcpSessionManager(): AcpSessionManager;
export declare const testing: {
    resetAcpSessionManagerForTests(): void;
    setAcpSessionManagerForTests(manager: unknown): void;
};
export { testing as __testing };
