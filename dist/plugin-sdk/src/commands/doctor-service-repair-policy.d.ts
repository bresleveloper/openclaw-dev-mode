/** Policy wrapper for doctor repairs to services managed by external supervisors. */
import type { DoctorPrompter } from "./doctor-prompter.js";
type ServiceRepairPolicy = "auto" | "external";
export declare const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";
export declare const EXTERNAL_SERVICE_REPAIR_NOTE = "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";
/** Resolves whether doctor may repair managed services or must defer to an external supervisor. */
export declare function resolveServiceRepairPolicy(env?: NodeJS.ProcessEnv): ServiceRepairPolicy;
/** Returns true when service repairs should only emit external-supervisor guidance. */
export declare function isServiceRepairExternallyManaged(policy?: ServiceRepairPolicy): boolean;
/** Confirms a service repair unless the service repair policy is external. */
export declare function confirmDoctorServiceRepair(prompter: DoctorPrompter, params: Parameters<DoctorPrompter["confirmRuntimeRepair"]>[0], policy?: ServiceRepairPolicy): Promise<boolean>;
export {};
