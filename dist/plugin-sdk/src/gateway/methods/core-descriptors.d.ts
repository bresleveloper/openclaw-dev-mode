import type { OperatorScope } from "../operator-scopes.js";
import { type GatewayMethodDescriptorInput, type GatewayMethodHandler, type GatewayMethodScope } from "./descriptor.js";
type CoreGatewayMethodSpec = {
    name: string;
    scope: GatewayMethodScope;
    advertise?: false;
    startup?: true;
    controlPlaneWrite?: true;
};
export declare const CORE_GATEWAY_METHOD_SPECS: readonly CoreGatewayMethodSpec[];
/** Core methods that are listed early but return retryable unavailable until sidecars are ready. */
export declare const STARTUP_UNAVAILABLE_GATEWAY_METHODS: string[];
/** Returns the core methods that should be advertised to external gateway clients. */
export declare function listCoreAdvertisedGatewayMethodNames(): string[];
/** Returns all registered core method names, including hidden/internal compatibility methods. */
export declare function listCoreGatewayMethodNames(): string[];
/** Looks up the raw core method scope, including node and dynamic sentinel scopes. */
export declare function resolveCoreGatewayMethodScope(method: string): GatewayMethodScope | undefined;
/** Looks up an operator-only core method scope, excluding node and dynamic methods. */
export declare function resolveCoreOperatorGatewayMethodScope(method: string): OperatorScope | undefined;
/** Returns true for core methods reserved for authenticated node clients. */
export declare function isCoreNodeGatewayMethod(method: string): boolean;
/** Returns true for core methods whose required operator scope is resolved by the handler. */
export declare function isDynamicOperatorGatewayMethod(method: string): boolean;
/** Returns true when a method name has an explicit core policy entry. */
export declare function isCoreGatewayMethodClassified(method: string): boolean;
/** Creates dispatch descriptors for core handlers and fails if any handler lacks policy. */
export declare function createCoreGatewayMethodDescriptors(handlers: Record<string, GatewayMethodHandler>): GatewayMethodDescriptorInput[];
export {};
