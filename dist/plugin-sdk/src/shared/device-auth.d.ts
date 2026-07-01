/** Stored bearer token metadata for one authorized device role. */
export type DeviceAuthEntry = {
    token: string;
    role: string;
    scopes: string[];
    updatedAtMs: number;
};
/** Versioned on-disk device-auth cache for a gateway device identity. */
export type DeviceAuthStore = {
    version: 1;
    deviceId: string;
    tokens: Record<string, DeviceAuthEntry>;
};
/** Normalize a device-auth role id without changing its case or namespace. */
export declare function normalizeDeviceAuthRole(role: string): string;
/** Normalize device-auth scopes, dedupe/sort them, and include implied operator scopes. */
export declare function normalizeDeviceAuthScopes(scopes: readonly unknown[] | undefined): string[];
