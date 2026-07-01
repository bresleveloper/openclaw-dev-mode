import { type ConnectPairingRequiredReason } from "../../packages/gateway-protocol/src/connect-error-details.js";
import type { RuntimeEnv } from "../runtime.js";
/** Extracts device-pairing recovery context from structured gateway errors or legacy message text. */
export declare function resolvePairingRecoveryContext(params: {
    error?: string | null;
    closeReason?: string | null;
    details?: unknown;
}): {
    requestId: string | null;
    reason: ConnectPairingRequiredReason | null;
    remediationHint: string | null;
} | null;
/** Runs `openclaw status`, including JSON/all routing and optional deep probes. */
export declare function statusCommand(opts: {
    json?: boolean;
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
    all?: boolean;
}, runtime: RuntimeEnv): Promise<void>;
