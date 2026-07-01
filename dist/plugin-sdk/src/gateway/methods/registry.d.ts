import type { PluginRegistry } from "../../plugins/registry-types.js";
import { type OperatorScope } from "../operator-scopes.js";
import { createCoreGatewayMethodDescriptors, isCoreGatewayMethodClassified } from "./core-descriptors.js";
import { type GatewayMethodHandler, type GatewayMethodDescriptorInput, type GatewayMethodOwner, type GatewayMethodRegistryView } from "./descriptor.js";
export type GatewayMethodRegistry = GatewayMethodRegistryView;
export { createCoreGatewayMethodDescriptors, isCoreGatewayMethodClassified };
/** Creates a read-only registry for gateway method lookup, listing, and policy metadata. */
export declare function createGatewayMethodRegistry(inputs: readonly GatewayMethodDescriptorInput[]): GatewayMethodRegistry;
/** Converts a plain handler map into scoped descriptors owned by one gateway surface. */
export declare function createGatewayMethodDescriptorsFromHandlers(params: {
    handlers: Record<string, GatewayMethodHandler>;
    owner: GatewayMethodOwner;
    defaultScope?: OperatorScope;
    scopes?: Partial<Record<string, OperatorScope>>;
}): GatewayMethodDescriptorInput[];
/** Creates a plugin-owned method descriptor with plugin namespace scope normalization. */
export declare function createPluginGatewayMethodDescriptor(params: {
    pluginId: string;
    name: string;
    handler: GatewayMethodHandler;
    scope?: OperatorScope;
}): GatewayMethodDescriptorInput;
/** Resolves plugin method descriptors, including the legacy handler-only registry shape. */
export declare function createPluginGatewayMethodDescriptors(registry: Pick<PluginRegistry, "gatewayHandlers"> & Partial<Pick<PluginRegistry, "gatewayMethodDescriptors">>): GatewayMethodDescriptorInput[];
