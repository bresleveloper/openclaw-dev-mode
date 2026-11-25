import { n as RuntimeEnv } from "./runtime-C7vMCRi6.js";
declare class PortInUseError extends Error {
  port: number;
  details?: string;
  constructor(port: number, details?: string);
}
declare function describePortOwner(port: number): Promise<string | undefined>;
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
declare function ensurePortAvailable(port: number, host?: string, signal?: AbortSignal): Promise<void>;
declare function handlePortError(err: unknown, port: number, context: string, runtime?: RuntimeEnv): Promise<never>;
export { handlePortError as i, describePortOwner as n, ensurePortAvailable as r, PortInUseError as t };