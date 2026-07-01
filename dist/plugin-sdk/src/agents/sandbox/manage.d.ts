import { type SandboxBrowserRegistryEntry, type SandboxRegistryEntry } from "./registry.js";
export type SandboxContainerInfo = SandboxRegistryEntry & {
    running: boolean;
    imageMatch: boolean;
};
export type SandboxBrowserInfo = SandboxBrowserRegistryEntry & {
    running: boolean;
    imageMatch: boolean;
};
/** Lists registered sandbox containers with live backend status and config-label match state. */
export declare function listSandboxContainers(): Promise<SandboxContainerInfo[]>;
/** Lists registered browser sandbox containers with live Docker status. */
export declare function listSandboxBrowsers(): Promise<SandboxBrowserInfo[]>;
/** Removes one sandbox container from its backend and registry. */
export declare function removeSandboxContainer(containerName: string): Promise<void>;
/** Removes one browser sandbox container, registry entry, and any in-process bridge server. */
export declare function removeSandboxBrowserContainer(containerName: string): Promise<void>;
