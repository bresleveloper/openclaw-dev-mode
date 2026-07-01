import { type DeviceAuthEntry } from "../shared/device-auth-store.js";
/** Load a cached device-auth token from the configured OpenClaw state directory. */
export declare function loadDeviceAuthToken(params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
}): DeviceAuthEntry | null;
/** Persist or replace one device-auth role token in the private state directory. */
export declare function storeDeviceAuthToken(params: {
    deviceId: string;
    role: string;
    token: string;
    scopes?: string[];
    env?: NodeJS.ProcessEnv;
}): DeviceAuthEntry;
/** Remove one role token for the current gateway device from the private state directory. */
export declare function clearDeviceAuthToken(params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
}): void;
