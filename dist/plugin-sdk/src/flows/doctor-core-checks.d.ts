import type { ConfigValidationIssue, OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretRef } from "../config/types.secrets.js";
import type { SkillStatusEntry } from "../skills/discovery/status.js";
import type { HealthCheck, HealthCheckContext, HealthFinding } from "./health-checks.js";
export type CoreHealthCheckDeps = {
    readonly detectUnavailableSkills: (cfg: OpenClawConfig) => Promise<readonly SkillStatusEntry[]>;
    readonly collectSecurityWarnings: (cfg: OpenClawConfig) => Promise<readonly string[]>;
    readonly collectWorkspaceSuggestionNotes: (workspaceDir: string) => Promise<readonly string[]>;
    readonly collectRuntimeToolSchemaFindings: (ctx: HealthCheckContext) => Promise<readonly HealthFinding[]>;
    readonly collectProviderCatalogProjectionFindings: (ctx: HealthCheckContext) => Promise<readonly HealthFinding[]>;
};
export declare function configValidationIssuesToHealthFindings(issues: readonly ConfigValidationIssue[]): readonly HealthFinding[];
export declare function buildGatewayTokenSecretRefUnavailableMessage(params: {
    cfg: OpenClawConfig;
    ref: SecretRef;
    unresolvedRefReason?: string;
}): string;
export declare function buildGatewayTokenSecretRefFixHint(ref: SecretRef): string;
/** @deprecated Core doctor flows use ordered doctor contributions; keep this only for SDK compatibility. */
export declare function registerCoreHealthChecks(): void;
export declare function resetCoreHealthChecksForTest(): void;
export declare function createCoreHealthChecks(deps?: CoreHealthCheckDeps): readonly HealthCheck[];
export declare const CORE_HEALTH_CHECKS: readonly HealthCheck[];
