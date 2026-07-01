import { type DeviceAuthEntry, type DeviceAuthStore } from "./device-auth.js";
export type { DeviceAuthEntry, DeviceAuthStore } from "./device-auth.js";
/** Storage seam used by shared device-auth helpers and filesystem-backed infra wrappers. */
export type DeviceAuthStoreAdapter = {
    readStore: () => DeviceAuthStore | null;
    writeStore: (store: DeviceAuthStore) => void;
};
/** Coerces raw persisted device-auth JSON into the current canonical store shape. */
export declare function coerceDeviceAuthStore(value: unknown): DeviceAuthStore | null;
/** Load one normalized role token, ignoring stores bound to a different gateway device id. */
export declare function loadDeviceAuthTokenFromStore(params: {
    adapter: DeviceAuthStoreAdapter;
    deviceId: string;
    role: string;
}): DeviceAuthEntry | null;
/** Store one role token while preserving canonical tokens for the same gateway device id. */
export declare function storeDeviceAuthTokenInStore(params: {
    adapter: DeviceAuthStoreAdapter;
    deviceId: string;
    role: string;
    token: string;
    scopes?: string[];
}): DeviceAuthEntry;
/** Clear one normalized role token without rewriting missing or wrong-device stores. */
export declare function clearDeviceAuthTokenFromStore(params: {
    adapter: DeviceAuthStoreAdapter;
    deviceId: string;
    role: string;
}): void;
