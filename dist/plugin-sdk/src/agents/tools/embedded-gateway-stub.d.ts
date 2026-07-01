import type { CallGatewayOptions } from "../../gateway/call.js";
type EmbeddedCallGateway = <T = Record<string, unknown>>(opts: CallGatewayOptions) => Promise<T>;
/** Creates a local callGateway replacement for supported session methods. */
export declare function createEmbeddedCallGateway(): EmbeddedCallGateway;
export {};
