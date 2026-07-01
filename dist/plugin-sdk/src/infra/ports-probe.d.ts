import type { PortUsageStatus } from "./ports-types.js";
/** Opens and closes a temporary listener to verify that a port can be bound. */
export declare function tryListenOnPort(params: {
    /** TCP port to probe; `0` lets the OS allocate an available ephemeral port. */
    port: number;
    /** Optional host/interface to bind during the probe. */
    host?: string;
    /** Whether the probe should request an exclusive server handle from Node. */
    exclusive?: boolean;
}): Promise<void>;
/** Checks all supported local address families without resolving listener diagnostics. */
export declare function probePortUsage(port: number): Promise<PortUsageStatus>;
