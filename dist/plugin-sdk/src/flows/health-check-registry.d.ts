import type { HealthCheck } from "./health-checks.js";
/** Raised when two checks claim the same stable health-check id. */
export declare class HealthCheckRegistrationError extends Error {
    readonly checkId: string;
    readonly code = "OC_DOCTOR_DUPLICATE_CHECK";
    constructor(checkId: string);
}
/** Registers one health check for doctor lint/fix execution. */
export declare function registerHealthCheck(check: HealthCheck): void;
/** Returns registered checks in insertion order for deterministic doctor output. */
export declare function listHealthChecks(): readonly HealthCheck[];
/** Returns registered extension checks after rejecting any reserved core doctor id claims. */
export declare function listExtensionHealthChecksForDoctor(coreChecks: readonly HealthCheck[]): readonly HealthCheck[];
/** Looks up a registered health check by its stable id. */
export declare function getHealthCheck(id: string): HealthCheck | undefined;
/** Clears the process-local registry for isolated tests. */
export declare function clearHealthChecksForTest(): void;
