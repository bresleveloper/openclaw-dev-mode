import type { DeviceAuthToken } from "../../infra/device-pairing.js";
import type { GatewayClient } from "./types.js";
export type DeviceSessionAuthz = {
    callerDeviceId: string | null;
    callerScopes: string[];
    isAdminCaller: boolean;
};
export type DeviceManagementAuthz = DeviceSessionAuthz & {
    normalizedTargetDeviceId: string;
};
export declare function resolveDeviceSessionAuthz(client: GatewayClient | null): DeviceSessionAuthz;
export declare function resolveDeviceManagementAuthz(client: GatewayClient | null, targetDeviceId: string): DeviceManagementAuthz;
export declare function deniesCrossDeviceManagement(authz: DeviceManagementAuthz): boolean;
export declare function deniesDeviceTokenRoleManagement(authz: DeviceManagementAuthz, targetRole: string): boolean;
export declare function requestsNonOperatorDeviceRole(pending: {
    role?: string;
    roles?: string[];
}): boolean;
export declare function pairedDeviceHasNonOperatorRole(device: {
    role?: string;
    roles?: string[];
    tokens?: Record<string, DeviceAuthToken>;
}): boolean;
