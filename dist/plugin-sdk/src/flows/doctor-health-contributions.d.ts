import type { probeGatewayMemoryStatus } from "../commands/doctor-gateway-health.js";
import type { DoctorOptions, DoctorPrompter } from "../commands/doctor-prompter.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { buildGatewayConnectionDetails } from "../gateway/call.js";
import type { UpdatePostInstallDoctorResult } from "../infra/update-doctor-result.js";
import type { RuntimeEnv } from "../runtime.js";
import type { HealthCheckInput, RunnableHealthCheck } from "./health-check-runner-types.js";
import type { HealthCheck } from "./health-checks.js";
import type { FlowContribution } from "./types.js";
type DoctorConfigResult = {
    cfg: OpenClawConfig;
    path?: string;
    shouldWriteConfig?: boolean;
    sourceConfigValid?: boolean;
    sourceLastTouchedVersion?: string;
    skipPluginValidationOnWrite?: boolean;
    preservedLegacyRootKeys?: readonly string[];
};
export type DoctorHealthFlowContext = {
    runtime: RuntimeEnv;
    options: DoctorOptions;
    prompter: DoctorPrompter;
    configResult: DoctorConfigResult;
    cfg: OpenClawConfig;
    cfgForPersistence: OpenClawConfig;
    sourceConfigValid: boolean;
    configPath: string;
    env?: NodeJS.ProcessEnv;
    gatewayDetails?: ReturnType<typeof buildGatewayConnectionDetails>;
    healthOk?: boolean;
    gatewayHealthAuthenticated?: boolean;
    gatewayHealthSkipped?: boolean;
    gatewayStatus?: import("../commands/status.types.js").StatusSummary;
    gatewayMemoryProbe?: Awaited<ReturnType<typeof probeGatewayMemoryStatus>>;
    postInstallDoctorResult?: UpdatePostInstallDoctorResult;
};
type DoctorHealthContribution = FlowContribution & {
    kind: "core";
    surface: "health";
    healthChecks: readonly HealthCheckInput[];
    healthCheckIds: readonly string[];
    run: (ctx: DoctorHealthFlowContext) => Promise<void>;
};
type DoctorContributionHealthCheck = (Omit<HealthCheck, "id" | "kind" | "source"> & {
    readonly id?: string;
    readonly kind?: "core";
    readonly source?: string;
}) | (Omit<RunnableHealthCheck, "id" | "kind" | "source"> & {
    readonly id?: string;
    readonly kind?: "core";
    readonly source?: string;
});
export declare function shouldSkipLegacyUpdateDoctorConfigWrite(params: {
    env: NodeJS.ProcessEnv;
}): boolean;
export declare function createDoctorHealthContribution(params: {
    id: string;
    label: string;
    healthCheckIds?: readonly string[];
    healthChecks?: DoctorContributionHealthCheck | readonly DoctorContributionHealthCheck[];
    hint?: string;
    run?: (ctx: DoctorHealthFlowContext) => Promise<void>;
}): DoctorHealthContribution;
export declare function resolveDoctorHealthContributions(): DoctorHealthContribution[];
export declare function resolveDoctorContributionHealthChecks(): Promise<readonly HealthCheck[]>;
export declare function runDoctorHealthContributions(ctx: DoctorHealthFlowContext): Promise<void>;
export {};
