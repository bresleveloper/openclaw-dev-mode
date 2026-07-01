import type { ChannelIngressRouteDescriptor, ChannelIngressResolver, CreateChannelIngressResolverParams, ResolveChannelMessageIngressParams, ResolveStableChannelMessageIngressParams, ResolvedChannelMessageIngress } from "./runtime-types.js";
/**
 * Create a reusable ingress resolver for one channel account and identity
 * descriptor.
 */
export declare function createChannelIngressResolver(base: CreateChannelIngressResolverParams): ChannelIngressResolver;
/**
 * Resolve one inbound event using a simple stable subject identity descriptor.
 */
export declare function resolveStableChannelMessageIngress(params: ResolveStableChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
/**
 * Collect optional route descriptors while dropping false, null, and undefined
 * entries.
 */
export declare function channelIngressRoutes(...routes: Array<ChannelIngressRouteDescriptor | false | null | undefined>): ChannelIngressRouteDescriptor[];
/**
 * Resolve sender, route, command, event, and activation gates for one inbound
 * channel event.
 */
export declare function resolveChannelMessageIngress(params: ResolveChannelMessageIngressParams): Promise<ResolvedChannelMessageIngress>;
