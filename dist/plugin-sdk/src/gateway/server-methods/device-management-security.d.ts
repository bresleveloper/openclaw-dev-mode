import { type DiagnosticSecurityEventInput } from "../../infra/diagnostic-events.js";
import type { DeviceSessionAuthz } from "./device-management-authz.js";
type DeviceSecurityDecision = NonNullable<DiagnosticSecurityEventInput["policy"]>["decision"];
export declare function emitDeviceManagementSecurityEvent(params: {
    action: string;
    outcome: DiagnosticSecurityEventInput["outcome"];
    severity: DiagnosticSecurityEventInput["severity"];
    authz: DeviceSessionAuthz;
    targetDeviceId?: string;
    policyId: string;
    decision: DeviceSecurityDecision;
    controlId: string;
    reason?: string;
    attributes?: Record<string, string | number | boolean>;
}): void;
export {};
