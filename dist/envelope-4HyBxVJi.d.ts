import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { n as ResolvedAgentRoute, t as ResolveAgentRouteInput } from "./resolve-route-C19qE71T.js";
//#region src/channels/sender-label.d.ts
type SenderLabelParams = {
  name?: string;
  username?: string;
  tag?: string;
  e164?: string;
  id?: string;
};
//#endregion
//#region src/auto-reply/envelope.d.ts
type AgentEnvelopeParams = {
  channel: string;
  from?: string;
  timestamp?: number | Date;
  host?: string;
  ip?: string;
  body: string;
  previousTimestamp?: number | Date;
  envelope?: EnvelopeFormatOptions;
};
/** User/config-facing controls for timestamp rendering in prompt envelopes. */
type EnvelopeFormatOptions = {
  /**
   * "local" (default), "utc", "user", or an explicit IANA timezone string.
   */
  timezone?: string;
  /**
   * Include absolute timestamps in the envelope (default: true).
   */
  includeTimestamp?: boolean;
  /**
   * Include elapsed time suffix when previousTimestamp is provided (default: true).
   */
  includeElapsed?: boolean;
  /**
   * Optional user timezone used when timezone="user".
   */
  userTimezone?: string;
};
/** Resolves envelope formatting defaults from agent config. */
declare function resolveEnvelopeFormatOptions(cfg?: OpenClawConfig): EnvelopeFormatOptions;
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
declare function formatAgentEnvelope(params: AgentEnvelopeParams): string;
/** Formats an inbound message body with sender attribution appropriate for direct/group chats. */
declare function formatInboundEnvelope(params: {
  channel: string;
  from: string;
  body: string;
  timestamp?: number | Date;
  chatType?: string;
  senderLabel?: string;
  sender?: SenderLabelParams;
  previousTimestamp?: number | Date;
  envelope?: EnvelopeFormatOptions;
  fromMe?: boolean;
}): string;
/** Builds the compact `from` label used in inbound envelope headers. */
declare function formatInboundFromLabel(params: {
  isGroup: boolean;
  groupLabel?: string;
  groupId?: string;
  directLabel: string;
  directId?: string;
  groupFallback?: string;
}): string;
//#endregion
//#region src/channels/inbound-event/envelope.d.ts
type ChannelInboundEnvelopeInput = Omit<AgentEnvelopeParams, "previousTimestamp"> & {
  previousTimestamp?: AgentEnvelopeParams["previousTimestamp"] | null;
};
type ChannelInboundEnvelopeBuilderParams = {
  cfg: OpenClawConfig;
  route: Pick<ResolvedAgentRoute, "agentId" | "sessionKey">;
};
/** @deprecated Await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
declare function createChannelInboundEnvelopeBuilder(params: ChannelInboundEnvelopeBuilderParams): (input: ChannelInboundEnvelopeInput) => string;
/** Prepare once per inbound message; history formatting remains synchronous and SQL-free. */
declare function createChannelInboundEnvelopeBuilderAsync(params: ChannelInboundEnvelopeBuilderParams): Promise<(input: ChannelInboundEnvelopeInput) => string>;
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
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
/** @deprecated Await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
declare function createInboundEnvelopeBuilder<TConfig, TEnvelope>(params: InboundEnvelopeBuilderParams<TConfig, TEnvelope>): (input: {
  channel: string;
  from: string;
  body: string;
  timestamp?: number;
}) => {
  storePath: string;
  body: string;
};
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
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
/** @deprecated Use resolveAgentRoute and await createChannelInboundEnvelopeBuilderAsync. Final compatibility day: 2026-12-31. */
declare function resolveInboundRouteEnvelopeBuilderWithRuntime<TConfig, TEnvelope, TRoute extends RouteLike, TPeer extends RoutePeerLike>(params: InboundRouteResolveParams<TConfig, TPeer> & {
  runtime: InboundRouteEnvelopeRuntime<TConfig, TEnvelope, TRoute, TPeer>;
  sessionStore?: string;
}): {
  route: TRoute;
  buildEnvelope: ReturnType<typeof createInboundEnvelopeBuilder<TConfig, TEnvelope>>;
};
//#endregion
export { resolveChannelInboundRouteEnvelope as a, EnvelopeFormatOptions as c, formatInboundFromLabel as d, resolveEnvelopeFormatOptions as f, createInboundEnvelopeBuilder as i, formatAgentEnvelope as l, createChannelInboundEnvelopeBuilder as n, resolveInboundRouteEnvelopeBuilder as o, createChannelInboundEnvelopeBuilderAsync as r, resolveInboundRouteEnvelopeBuilderWithRuntime as s, ChannelInboundEnvelopeInput as t, formatInboundEnvelope as u };