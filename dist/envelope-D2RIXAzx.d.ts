import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { n as ResolvedAgentRoute, t as ResolveAgentRouteInput } from "./resolve-route-Dv1zO_Td.js";
import { t as AgentEnvelopeParams } from "./envelope-BoZWwAQ5.js";
//#region src/channels/inbound-event/envelope.d.ts
type ChannelInboundEnvelopeInput = Omit<AgentEnvelopeParams, "previousTimestamp"> & {
  previousTimestamp?: AgentEnvelopeParams["previousTimestamp"] | null;
};
declare function createChannelInboundEnvelopeBuilder(params: {
  cfg: OpenClawConfig;
  route: Pick<ResolvedAgentRoute, "agentId" | "sessionKey">;
}): (input: ChannelInboundEnvelopeInput) => string;
declare function resolveChannelInboundRouteEnvelope(params: ResolveAgentRouteInput): {
  route: ResolvedAgentRoute;
  buildEnvelope: (input: ChannelInboundEnvelopeInput) => string;
};
type RouteLike = Pick<ResolvedAgentRoute, "agentId" | "sessionKey">;
type RoutePeerLike = {
  kind: "direct" | "group" | "channel";
  id: string | number;
};
type InboundEnvelopeFormatParams<TEnvelope> = {
  channel: string;
  from: string;
  timestamp?: number;
  previousTimestamp?: number;
  envelope: TEnvelope;
  body: string;
};
type InboundRouteResolveParams<TConfig, TPeer extends RoutePeerLike> = {
  cfg: TConfig;
  channel: string;
  accountId: string;
  peer: TPeer;
};
type InboundEnvelopeBuilderParams<TConfig, TEnvelope> = {
  cfg: TConfig;
  route: RouteLike;
  sessionStore?: string;
  resolveStorePath: (store: string | undefined, opts: {
    agentId: string;
  }) => string;
  readSessionUpdatedAt: (params: {
    storePath: string;
    sessionKey: string;
  }) => number | undefined;
  resolveEnvelopeFormatOptions: (cfg: TConfig) => TEnvelope;
  formatAgentEnvelope: (params: InboundEnvelopeFormatParams<TEnvelope>) => string;
};
declare function createInboundEnvelopeBuilder<TConfig, TEnvelope>(params: InboundEnvelopeBuilderParams<TConfig, TEnvelope>): (input: {
  channel: string;
  from: string;
  body: string;
  timestamp?: number;
}) => {
  storePath: string;
  body: string;
};
declare function resolveInboundRouteEnvelopeBuilder<TConfig, TEnvelope, TRoute extends RouteLike, TPeer extends RoutePeerLike>(params: Omit<InboundEnvelopeBuilderParams<TConfig, TEnvelope>, "route"> & InboundRouteResolveParams<TConfig, TPeer> & {
  resolveAgentRoute: (params: InboundRouteResolveParams<TConfig, TPeer>) => TRoute;
}): {
  route: TRoute;
  buildEnvelope: ReturnType<typeof createInboundEnvelopeBuilder<TConfig, TEnvelope>>;
};
type InboundRouteEnvelopeRuntime<TConfig, TEnvelope, TRoute extends RouteLike, TPeer extends RoutePeerLike> = {
  routing: {
    resolveAgentRoute: (params: InboundRouteResolveParams<TConfig, TPeer>) => TRoute;
  };
  session: Pick<InboundEnvelopeBuilderParams<TConfig, TEnvelope>, "resolveStorePath" | "readSessionUpdatedAt">;
  reply: Pick<InboundEnvelopeBuilderParams<TConfig, TEnvelope>, "resolveEnvelopeFormatOptions" | "formatAgentEnvelope">;
};
/** Runtime-driven compatibility variant for shipped plugin SDK callers. */
declare function resolveInboundRouteEnvelopeBuilderWithRuntime<TConfig, TEnvelope, TRoute extends RouteLike, TPeer extends RoutePeerLike>(params: InboundRouteResolveParams<TConfig, TPeer> & {
  runtime: InboundRouteEnvelopeRuntime<TConfig, TEnvelope, TRoute, TPeer>;
  sessionStore?: string;
}): {
  route: TRoute;
  buildEnvelope: ReturnType<typeof createInboundEnvelopeBuilder<TConfig, TEnvelope>>;
};
//#endregion
export { resolveInboundRouteEnvelopeBuilder as a, resolveChannelInboundRouteEnvelope as i, createChannelInboundEnvelopeBuilder as n, resolveInboundRouteEnvelopeBuilderWithRuntime as o, createInboundEnvelopeBuilder as r, ChannelInboundEnvelopeInput as t };