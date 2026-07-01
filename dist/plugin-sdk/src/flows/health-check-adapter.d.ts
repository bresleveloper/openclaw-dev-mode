import type { HealthCheckInput, RegisteredHealthCheck } from "./health-check-runner-types.js";
import type { HealthCheck } from "./health-checks.js";
/** Wraps a detect/repair health check in the runnable health-check contract. */
export declare function defineSplitHealthCheck(check: HealthCheck): RegisteredHealthCheck;
/** Normalizes any supported health-check shape before lint/fix execution. */
export declare function normalizeHealthCheck(check: HealthCheckInput): RegisteredHealthCheck;
