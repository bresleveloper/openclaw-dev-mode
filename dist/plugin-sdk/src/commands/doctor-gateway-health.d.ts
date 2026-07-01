import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { StatusSummary } from "./status.types.js";
type GatewayMemoryProbe = {
    checked: boolean;
    ready: boolean;
    error?: string;
    /**
     * True when the probe was intentionally skipped by the gateway (probe: false
     * path). Distinct from checked: false caused by a network timeout or
     * unavailable gateway. Renderers should suppress warnings only for skipped
     * probes, not for transport failures.
     */
    skipped: boolean;
};
/**
 * Probes gateway status and reports user-facing connection/auth/channel warnings.
 *
 * A credentials-required gateway still counts as healthy but unauthenticated when the preauth
 * probe confirms the server is reachable.
 */
export declare function checkGatewayHealth(params: {
    runtime: RuntimeEnv;
    cfg: OpenClawConfig;
    timeoutMs?: number;
}): Promise<{
    healthOk: boolean;
    authenticated: boolean;
    status?: StatusSummary;
}>;
/** Probes gateway memory readiness without forcing deep embedding checks. */
export declare function probeGatewayMemoryStatus(params: {
    cfg: OpenClawConfig;
    timeoutMs?: number;
}): Promise<GatewayMemoryProbe>;
export {};
