import { type OpenClawConfig } from "../config/config.js";
import { type ExtraGatewayService } from "../daemon/inspect.js";
import type { HealthFinding, HealthRepairEffect } from "../flows/health-checks.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions, DoctorPrompter } from "./doctor-prompter.js";
export declare function detectExtraGatewayServiceIssues(options?: Pick<DoctorOptions, "deep">): Promise<readonly ExtraGatewayService[]>;
export declare function extraGatewayServiceToHealthFinding(service: ExtraGatewayService): HealthFinding;
export declare function extraGatewayServiceToRepairEffects(service: ExtraGatewayService): readonly HealthRepairEffect[];
/**
 * Audits and optionally rewrites the installed local gateway service configuration.
 *
 * The repair preserves managed env sources, avoids Nix/remote installs, and can stage service
 * updates during updater repair mode instead of immediately installing them.
 */
export declare function maybeRepairGatewayServiceConfig(cfg: OpenClawConfig, mode: "local" | "remote", runtime: RuntimeEnv, prompter: DoctorPrompter, options?: {
    allowExecSecretRefs?: boolean;
}): Promise<void>;
/**
 * Reports duplicate gateway-like services and removes legacy user services after confirmation.
 */
export declare function maybeScanExtraGatewayServices(options: DoctorOptions, runtime: RuntimeEnv, prompter: DoctorPrompter): Promise<void>;
