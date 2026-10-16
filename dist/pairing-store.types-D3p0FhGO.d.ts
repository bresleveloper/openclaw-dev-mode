import { $ as AccessGroupConfig, r as OpenClawConfig, yt as ChannelImplicitMentionsConfig } from "./types.openclaw-DWWUw8hA.js";
import { f as DmPolicy, m as GroupPolicy } from "./types.base-D8MIFbSh.js";
import { an as InboundEventKind } from "./reply-payload-DazZPys5.js";
import "./config-Dpca5-xX.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { L as IdentifierAuthentication } from "./types.core-Bra2QBA5.js";
import { n as ChatChannelId, t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import { M as ChannelPairingAdapter } from "./types.adapters-Bo2TMZGx.js";
//#region src/config/implicit-mentions.d.ts
type ResolvedChannelImplicitMentions = Required<ChannelImplicitMentionsConfig>;
/** Resolves each implicit-mention kind using account, channel, defaults, then shipped behavior. */
declare function resolveChannelImplicitMentions(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string | null;
}): ResolvedChannelImplicitMentions;
//#endregion
//#region src/channels/mention-gating.d.ts
type InboundImplicitMentionKind = "reply_to_bot" | "quoted_bot" | "bot_thread_participant" | "native";
type InboundMentionFacts = {
  canDetectMention: boolean;
  wasMentioned: boolean;
  hasAnyMention?: boolean;
  implicitMentionKinds?: readonly InboundImplicitMentionKind[];
};
type InboundMentionPolicy = {
  isGroup: boolean;
  requireMention: boolean;
  implicitMentions?: ChannelImplicitMentionsConfig;
  allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
  allowTextCommands: boolean;
  hasControlCommand: boolean;
  commandAuthorized: boolean;
};
/** @deprecated Prefer the nested `{ facts, policy }` call shape for new code. */
type ResolveInboundMentionDecisionFlatParams = InboundMentionFacts & InboundMentionPolicy;
type ResolveInboundMentionDecisionNestedParams = {
  facts: InboundMentionFacts;
  policy: InboundMentionPolicy;
};
type ResolveInboundMentionDecisionParams = ResolveInboundMentionDecisionFlatParams | ResolveInboundMentionDecisionNestedParams;
type InboundMentionDecision = {
  effectiveWasMentioned: boolean;
  shouldSkip: boolean;
  implicitMention: boolean;
  matchedImplicitMentionKinds: InboundImplicitMentionKind[];
  shouldBypassMention: boolean;
};
declare function implicitMentionKindWhen(kind: InboundImplicitMentionKind, enabled: boolean): InboundImplicitMentionKind[];
declare function resolveInboundMentionDecision(params: ResolveInboundMentionDecisionParams): InboundMentionDecision;
//#endregion
//#region src/channels/message-access/types.d.ts
type ChannelIngressChannelId = ChatChannelId;
type ChannelIngressIdentifierKind = "stable-id" | "username" | "email" | "phone" | "role" | `plugin:${string}`;
/** Public, redacted identifier material that can participate in allowlist matching. */
type MatchableIdentifier = {
  opaqueId: string;
  kind: ChannelIngressIdentifierKind;
  authentication?: IdentifierAuthentication;
  /** @deprecated Use `authentication: "mutable"`. Remove in the next Plugin SDK major. */
  dangerous?: boolean;
  sensitivity?: "normal" | "pii";
};
/** Internal identifier material with the raw comparable value retained. */
type InternalMatchMaterial = MatchableIdentifier & {
  value: string;
};
type InternalChannelIngressSubject = {
  identifiers: InternalMatchMaterial[];
};
/** SDK inputs remain optional; kernel consumers receive resolved authentication. */
type NormalizedIngressSubject = {
  identifiers: Array<InternalMatchMaterial & {
    authentication: IdentifierAuthentication;
  }>;
};
/** Public, redacted form of a normalized allowlist entry. */
type ChannelIngressNormalizedEntry = Omit<MatchableIdentifier, "opaqueId"> & {
  opaqueEntryId: string;
  wildcard?: boolean;
};
/** Internal normalized allowlist entry with its raw comparable value retained. */
type InternalNormalizedEntry = ChannelIngressNormalizedEntry & {
  value: string;
  identityFieldKey?: string;
};
type NormalizedIngressEntry = InternalNormalizedEntry & {
  authentication: IdentifierAuthentication;
};
type RedactedIngressEntryDiagnostic = {
  opaqueEntryId?: string;
  reasonCode: IngressReasonCode;
};
type RedactedIngressMatch = {
  matched: boolean;
  matchedEntryIds: string[];
  /** Exact redacted entry-to-subject edges retained for authentication policy. */
  matchedPairs?: RedactedIngressMatchedPair[];
};
type RedactedIngressMatchedPair = {
  opaqueEntryId: string;
  opaqueSubjectId: string;
  subjectAuthentication: IdentifierAuthentication;
};
type InternalChannelIngressNormalizeResult = {
  matchable: InternalNormalizedEntry[];
  invalid: RedactedIngressEntryDiagnostic[];
  disabled: RedactedIngressEntryDiagnostic[];
};
/** Adapter that gives the shared ingress kernel channel-specific identity matching. */
type InternalChannelIngressAdapter = {
  normalizeEntries(params: {
    entries: readonly string[];
    context: "dm" | "group" | "route" | "command";
    accountId: string;
  }): InternalChannelIngressNormalizeResult | Promise<InternalChannelIngressNormalizeResult>;
  matchSubject(params: {
    subject: NormalizedIngressSubject;
    entries: readonly NormalizedIngressEntry[];
    context: "dm" | "group" | "route" | "command";
  }): RedactedIngressMatch | Promise<RedactedIngressMatch>;
};
type AccessGroupMembershipFact = {
  kind: "matched";
  groupName: string;
  source: "static" | "dynamic";
  matchedEntryIds: string[];
} | {
  kind: "not-matched";
  groupName: string;
  source: "static" | "dynamic";
} | {
  kind: "missing" | "unsupported" | "failed";
  groupName: string;
  source: "static" | "dynamic";
  reasonCode: IngressReasonCode;
  diagnosticId?: string;
};
type ResolvedIngressAllowlist = {
  rawEntryCount: number;
  normalizedEntries: ChannelIngressNormalizedEntry[];
  invalidEntries: RedactedIngressEntryDiagnostic[];
  disabledEntries: RedactedIngressEntryDiagnostic[];
  matchedEntryIds: string[];
  hasConfiguredEntries: boolean;
  hasMatchableEntries: boolean;
  hasWildcard: boolean;
  accessGroups: {
    referenced: string[];
    matched: string[];
    missing: string[];
    unsupported: string[];
    failed: string[];
  };
  match: RedactedIngressMatch;
  authentication?: RedactedIdentifierAuthenticationResult;
};
type RedactedIdentifierAuthenticationResult = {
  evaluated: boolean;
  threshold: IdentifierAuthentication;
  affectedMatch: boolean;
  rejectedEntryIds: string[];
};
type RedactedIdentifierAuthenticationDecision = {
  evaluated: boolean;
  affectedMatch: boolean;
};
type RedactedIngressAllowlistFacts = {
  configured: boolean;
  matched: boolean;
  reasonCode: IngressReasonCode;
  matchedEntryIds: string[];
  invalidEntryCount: number;
  disabledEntryCount: number;
  accessGroups: ResolvedIngressAllowlist["accessGroups"];
};
type RouteGateState = "not-configured" | "matched" | "not-matched" | "disabled" | "lookup-failed";
/** How a matched route affects sender allowlist evaluation. */
type RouteSenderPolicy = "inherit" | "replace" | "deny-when-empty";
/** Source list used when a route sender policy contributes sender entries. */
type RouteSenderAllowlistSource = "effective-dm" | "effective-group";
type RouteGateFacts = {
  id: string;
  kind: "route" | "routeSender" | "membership" | "ownerAllowlist" | "nestedAllowlist";
  gate: RouteGateState;
  effect: "allow" | "block-dispatch" | "ignore";
  precedence: number;
  senderPolicy: RouteSenderPolicy;
  senderAllowFrom?: Array<string | number>;
  senderAllowFromSource?: RouteSenderAllowlistSource;
  match?: RedactedIngressMatch;
};
type ResolvedRouteGateFacts = Omit<RouteGateFacts, "senderAllowFrom" | "senderAllowFromSource"> & {
  senderAllowlist?: ResolvedIngressAllowlist;
};
/** Inbound event facts used to choose command, pairing, and origin-subject rules. */
type ChannelIngressEventInput = {
  kind: "message" | "reaction" | "button" | "postback" | "native-command" | "slash-command" | "system";
  authMode: "inbound" | "command" | "origin-subject" | "route-only" | "none";
  mayPair: boolean;
  originSubject?: InternalChannelIngressSubject;
};
type RedactedChannelIngressEvent = Omit<ChannelIngressEventInput, "originSubject"> & {
  hasOriginSubject: boolean;
  originSubjectMatched: boolean;
  originSubjectAuthentication?: IdentifierAuthentication;
};
type ChannelIngressStateInput = {
  channelId: ChannelIngressChannelId;
  accountId: string;
  subject: InternalChannelIngressSubject;
  conversation: {
    kind: ChatType;
    id: string;
    parentId?: string;
    threadId?: string;
    title?: string;
  };
  adapter: InternalChannelIngressAdapter;
  accessGroups?: Record<string, AccessGroupConfig>;
  accessGroupMembership?: readonly AccessGroupMembershipFact[];
  routeFacts?: RouteGateFacts[];
  mentionFacts?: InboundMentionFacts;
  event: ChannelIngressEventInput;
  allowlists: {
    dm?: Array<string | number>;
    group?: Array<string | number>;
    commandOwner?: Array<string | number>;
    commandGroup?: Array<string | number>;
    pairingStore?: Array<string | number>;
  };
};
type ChannelIngressPolicyInput = {
  dmPolicy: DmPolicy;
  groupPolicy: GroupPolicy;
  groupAllowFromFallbackToAllowFrom?: boolean;
  minIdentifierAuthentication?: IdentifierAuthentication;
  /** @deprecated `enabled` maps to minimum `mutable`; otherwise minimum `asserted`. Remove in the next Plugin SDK major. */
  mutableIdentifierMatching?: "disabled" | "enabled";
  activation?: {
    requireMention: boolean;
    allowTextCommands: boolean;
    implicitMentions?: ResolvedChannelImplicitMentions;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
  };
  command?: {
    useAccessGroups?: boolean;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
  };
};
type IngressGatePhase = "route" | "sender" | "command" | "event" | "activation";
type IngressGateKind = "route" | "routeSender" | "dmSender" | "groupSender" | "membership" | "ownerAllowlist" | "nestedAllowlist" | "command" | "event" | "mention";
type IngressGateEffect = "allow" | "block-dispatch" | "block-command" | "skip" | "observe" | "ignore";
type IngressReasonCode = "allowed" | "route_blocked" | "route_sender_empty" | "dm_policy_disabled" | "dm_policy_open" | "dm_policy_allowlisted" | "dm_policy_pairing_required" | "dm_policy_not_allowlisted" | "group_policy_disabled" | "group_policy_open" | "group_policy_allowed" | "group_policy_empty_allowlist" | "group_policy_not_allowlisted" | "command_authorized" | "control_command_unauthorized" | "event_authorized" | "event_unauthorized" | "event_pairing_not_allowed" | "sender_not_required" | "origin_subject_missing" | "origin_subject_not_matched" | "activation_allowed" | "activation_skipped" | "access_group_missing" | "access_group_unsupported" | "access_group_failed" | "mutable_identifier_disabled" | "identifier_authentication_too_weak" | "no_policy_match";
type AccessGraphGate = {
  id: string;
  phase: IngressGatePhase;
  kind: IngressGateKind;
  effect: IngressGateEffect;
  allowed: boolean;
  reasonCode: IngressReasonCode;
  match?: RedactedIngressMatch;
  allowlist?: RedactedIngressAllowlistFacts;
  identifierAuthentication?: RedactedIdentifierAuthenticationDecision;
  sender?: {
    policy: ChannelIngressPolicyInput["dmPolicy"] | ChannelIngressPolicyInput["groupPolicy"];
  };
  command?: {
    useAccessGroups: boolean;
    allowTextCommands: boolean;
    modeWhenAccessGroupsOff?: "allow" | "deny" | "configured";
    shouldBlockControlCommand: boolean;
  };
  event?: RedactedChannelIngressEvent;
  activation?: {
    hasMentionFacts: boolean;
    requireMention: boolean;
    allowTextCommands: boolean;
    allowedImplicitMentionKinds?: readonly InboundImplicitMentionKind[];
    order?: "before-sender" | "after-command";
    shouldSkip: boolean;
    canDetectMention?: boolean;
    wasMentioned?: boolean;
    hasAnyMention?: boolean;
    implicitMentionKinds?: readonly InboundImplicitMentionKind[];
    effectiveWasMentioned?: boolean;
    shouldBypassMention?: boolean;
  };
};
/** Normalized ingress state before policy gates are reduced into a decision. */
type ChannelIngressState = {
  channelId: ChannelIngressChannelId;
  accountId: string;
  conversationKind: ChatType;
  event: RedactedChannelIngressEvent;
  mentionFacts?: InboundMentionFacts;
  routeFacts: ResolvedRouteGateFacts[];
  allowlists: {
    dm: ResolvedIngressAllowlist;
    pairingStore: ResolvedIngressAllowlist;
    group: ResolvedIngressAllowlist;
    commandOwner: ResolvedIngressAllowlist;
    commandGroup: ResolvedIngressAllowlist;
  };
};
type ChannelIngressDecision = {
  admission: "dispatch" | "observe" | "skip" | "drop" | "pairing-required";
  decision: "allow" | "block" | "pairing";
  decisiveGateId: string;
  reasonCode: IngressReasonCode;
  graph: {
    gates: AccessGraphGate[];
  };
};
//#endregion
//#region src/channels/message-access/runtime-types.d.ts
/** Describes one identity field used for stable ids or platform-specific aliases. */
type ChannelIngressIdentityField = {
  /** Unique field key used in subject alias maps and diagnostics. */
  key?: string;
  /** Redacted identifier kind written into the access graph. */
  kind?: ChannelIngressIdentifierKind;
  /** Shared normalizer used for both entries and subjects when no side-specific normalizer exists. */
  normalize?: (value: string) => string | null | undefined;
  /** Normalizes configured allowlist entries for this identity field. */
  normalizeEntry?: (value: string) => string | null | undefined;
  /** Normalizes inbound subject values for this identity field. */
  normalizeSubject?: (value: string) => string | null | undefined;
  /** Static strength of this identity field. `verified` requires owning-boundary metadata. */
  authentication?: IdentifierAuthentication | ((value: string) => IdentifierAuthentication | undefined);
  /** @deprecated Use `authentication: "mutable"`. Remove in the next Plugin SDK major. */
  dangerous?: boolean | ((value: string) => boolean | undefined);
  /** Redaction hint for diagnostics and access graph consumers. */
  sensitivity?: "normal" | "pii";
};
/** Named alias field such as email, phone, UUID, room id, or platform user id. */
type ChannelIngressIdentityAlias = ChannelIngressIdentityField & {
  key: string;
};
/** Identity contract for a channel resolver. Plugins provide platform normalization here. */
type ChannelIngressIdentityDescriptor = {
  /** Product identity: only when the plugin can prove the remote issuer and identifier kind. */
  resolveParticipant?: (subject: ChannelIngressIdentitySubjectInput) => {
    domain: string;
    idKind: string;
    id: string;
  } | undefined;
  /** Primary stable identity field. Prefer immutable sender ids when the platform has one. */
  primary: ChannelIngressIdentityField;
  /** Additional identifiers that can match legacy or platform-specific allowlist entries. */
  aliases?: readonly ChannelIngressIdentityAlias[];
  /** Returns true when a raw allowlist entry should authorize every sender. */
  isWildcardEntry?: (value: string) => boolean;
  /** Optional custom match hook for platform-specific identity equivalence. */
  matchEntry?: (params: {
    subject: InternalChannelIngressSubject;
    entry: InternalNormalizedEntry;
    context: "dm" | "group" | "route" | "command";
  }) => boolean | undefined;
  /** Generates stable redacted entry ids for diagnostics. */
  resolveEntryId?: (params: {
    entry: string;
    entryIndex: number;
    fieldKey: string;
    fieldIndex: number;
  }) => string;
};
/** Convenience input for defining a stable identity descriptor with optional aliases. */
type StableChannelIngressIdentityParams = ChannelIngressIdentityField & Pick<ChannelIngressIdentityDescriptor, "aliases" | "isWildcardEntry" | "matchEntry" | "resolveParticipant"> & {
  /** Prefix used for generated entry ids when `resolveEntryId` is omitted. */
  entryIdPrefix?: string;
  /** Custom entry-id generator used in redacted diagnostics. */
  resolveEntryId?: ChannelIngressIdentityDescriptor["resolveEntryId"];
};
/** Raw sender identity passed by a plugin for one inbound event. */
type ChannelIngressIdentitySubjectInput = {
  /** Stable sender id appended to effective allowlists when access groups matched. */
  stableId?: string | number | null;
  /** Optional identity aliases keyed by `ChannelIngressIdentityAlias.key`. */
  aliases?: Record<string, string | number | null | undefined>;
  /** Per-message claims keyed by the exact identity field key. */
  authentication?: Record<string, IdentifierAuthentication | undefined>;
};
/** Minimal config subset consumed by the ingress resolver. */
type ChannelIngressConfigInput = {
  /** Static or dynamic access group definitions referenced by allowlist entries. */
  accessGroups?: ChannelIngressStateInput["accessGroups"];
} | null;
/** Command gate input for control-command authorization. */
type ChannelMessageIngressCommandInput = NonNullable<ChannelIngressPolicyInput["command"]> & {
  /** Explicit command-owner allowlist; defaults to effective DM allowlist. */
  commandOwnerAllowFrom?: Array<string | number> | null;
  /** Controls whether group command owners inherit configured DM owners. */
  groupOwnerAllowFrom?: "configured" | "none";
  /** Allows direct-message command checks to reuse effective group allowlists. */
  directGroupAllowFrom?: "effective" | "none";
  /** Group command allowFrom fallback, separate from normal group sender policy. */
  commandGroupAllowFromFallbackToAllowFrom?: boolean;
};
/** Preset form for command gates accepted by `createChannelIngressResolver`. */
type ChannelIngressCommandPresetInput = Omit<Partial<ChannelMessageIngressCommandInput>, "useAccessGroups"> & {
  /** Set false to omit the command gate entirely. */
  requested?: boolean;
  /** Internal override for this command decision. */
  useAccessGroups?: boolean | null;
  /** Config subset used to derive command access-group behavior. */
  cfg?: ChannelIngressConfigInput;
};
/** Preset form for event gates accepted by `createChannelIngressResolver`. */
type ChannelIngressEventPresetInput = Partial<ChannelIngressEventInput> & {
  /** Convenience flag used to derive pairing defaults for group events. */
  isGroup?: boolean;
};
/** Final host-context identity that an ingress result is eligible to enter once. */
type ChannelIngressContextBinding = {
  /** Final routed agent selected by the channel producer. */
  agentId: string;
  /** Final dispatch or route session selected by the channel producer. */
  sessionKey: string;
  /** Final message id used by the host context, after any transport ID mapping. */
  messageId?: string;
  /** Match the host context's reply or conversation nativeChannelId, including when it equals id. */
  nativeChannelId?: string;
  /** Final inbound event classification used by the host context. */
  inboundEventKind: InboundEventKind;
};
/** Optional route gate, such as a room, thread, topic, guild, or group route. */
type ChannelIngressRouteDescriptor = {
  /** Stable route id used in diagnostics. */
  id: string;
  /** Route kind for diagnostics and graph consumers. */
  kind?: RouteGateFacts["kind"];
  /** Whether this route policy is configured. */
  configured?: boolean;
  /** Whether the inbound event matched this route. */
  matched?: boolean;
  /** Whether this route admits the inbound event. */
  allowed?: boolean;
  /** Whether to include this route descriptor in the graph. */
  enabled?: boolean;
  /** Ordering hint when multiple route descriptors are supplied. */
  precedence?: number;
  /** How route sender allowlists combine with effective channel allowlists. */
  senderPolicy?: RouteGateFacts["senderPolicy"];
  /** Route-specific sender allowlist entries. */
  senderAllowFrom?: Array<string | number> | null;
  /** Indicates whether route sender entries came from effective DM or group policy. */
  senderAllowFromSource?: RouteGateFacts["senderAllowFromSource"];
  /** Optional redacted match id for the route. */
  matchId?: string;
  /** Reason used when this route blocks the event. */
  blockReason?: string;
};
/** Dynamic access-group resolver invoked for groups that need platform lookups. */
type ChannelIngressAccessGroupMembershipResolver = (params: {
  name: string;
  group: AccessGroupConfig;
  channelId: ChannelIngressChannelId;
  accountId: string;
  subject: ChannelIngressIdentitySubjectInput;
}) => boolean | Promise<boolean>;
/** Complete input for resolving one inbound channel message or event. */
type ResolveChannelMessageIngressParams = {
  /** Channel id used for config, diagnostics, access groups, and pairing-store reads. */
  channelId: ChannelIngressChannelId;
  /** Account id scoped to this channel instance. */
  accountId: string;
  /** Identity descriptor that normalizes sender and allowlist material. */
  identity: ChannelIngressIdentityDescriptor;
  /** Inbound sender identity for this event. */
  subject: ChannelIngressIdentitySubjectInput;
  /** Conversation classification and id. */
  conversation: ChannelIngressStateInput["conversation"];
  /** Event auth mode and pairing/origin-subject facts. */
  event: ChannelIngressEventInput;
  /** Exact finalized host context this result may enter; omit for decision-only checks. */
  contextBinding?: ChannelIngressContextBinding;
  /** Sender, command, event, route, and activation policy. */
  policy: ChannelIngressPolicyInput;
  /** Raw direct-message allowlist entries. */
  allowFrom?: Array<string | number> | null;
  /** Raw group sender allowlist entries. */
  groupAllowFrom?: Array<string | number> | null;
  /** Route descriptors used to build route gates. */
  route?: ChannelIngressRouteDescriptor | readonly ChannelIngressRouteDescriptor[];
  /** Prebuilt route facts for lower-level callers. */
  routeFacts?: RouteGateFacts[];
  /** Access group config referenced by allowlist entries. */
  accessGroups?: ChannelIngressStateInput["accessGroups"];
  /** Precomputed access-group memberships for this subject. */
  accessGroupMembership?: readonly AccessGroupMembershipFact[];
  /** Resolver for dynamic access groups. */
  resolveAccessGroupMembership?: ChannelIngressAccessGroupMembershipResolver;
  /** Concrete sender entry appended to effective allowlists when an access group matched. */
  accessGroupMatchedAllowFromEntry?: string | number | null;
  /** Records whether a provider-specific missing-config fallback was applied. */
  providerMissingFallbackApplied?: boolean;
  /** Mention or activation facts for activation gates. */
  mentionFacts?: ChannelIngressStateInput["mentionFacts"];
  /** Optional pairing-store reader for direct-message allowlist material. */
  readStoreAllowFrom?: (params: {
    channelId: ChannelIngressChannelId;
    accountId: string;
    dmPolicy: ChannelIngressPolicyInput["dmPolicy"];
  }) => Promise<readonly (string | number)[] | null | undefined>;
  /** Reads the default pairing store when no explicit reader is supplied. */
  useDefaultPairingStore?: boolean;
  /** Command gate input; omit when no command policy is requested. */
  command?: ChannelMessageIngressCommandInput;
};
/** Shared resolver defaults for repeated events from the same channel account. */
type CreateChannelIngressResolverParams = Pick<ResolveChannelMessageIngressParams, "channelId" | "accountId" | "identity" | "accessGroups" | "accessGroupMembership" | "resolveAccessGroupMembership" | "accessGroupMatchedAllowFromEntry" | "readStoreAllowFrom" | "useDefaultPairingStore"> & {
  /** Config subset used for access groups and command behavior. */
  cfg?: ChannelIngressConfigInput;
  /** Global override for access-group expansion in this resolver. */
  useAccessGroups?: boolean | null;
  /** Default DM policy for message calls that omit it. */
  defaultDmPolicy?: ChannelIngressPolicyInput["dmPolicy"];
  /** Default group policy for message calls that omit it. */
  defaultGroupPolicy?: ChannelIngressPolicyInput["groupPolicy"];
  /** Default group allowlist fallback behavior. */
  groupAllowFromFallbackToAllowFrom?: boolean;
  /** Weakest exact-pair identifier claim allowed to authorize. */
  minIdentifierAuthentication?: ChannelIngressPolicyInput["minIdentifierAuthentication"];
  /** @deprecated Maps to `minIdentifierAuthentication`; remove in the next Plugin SDK major. */
  mutableIdentifierMatching?: ChannelIngressPolicyInput["mutableIdentifierMatching"];
};
/** Per-message input for a resolver created by `createChannelIngressResolver`. */
type ChannelIngressResolverMessageParams = Omit<ResolveChannelMessageIngressParams, "channelId" | "accountId" | "identity" | "accessGroups" | "resolveAccessGroupMembership" | "accessGroupMatchedAllowFromEntry" | "readStoreAllowFrom" | "useDefaultPairingStore" | "event" | "policy" | "command"> & {
  /** Event facts or presets; defaults to a normal inbound message event. */
  event?: ChannelIngressEventPresetInput;
  /** DM policy override for this event. */
  dmPolicy?: ChannelIngressPolicyInput["dmPolicy"];
  /** Group policy override for this event. */
  groupPolicy?: ChannelIngressPolicyInput["groupPolicy"];
  /** Additional policy fields merged with resolver defaults. */
  policy?: Partial<Omit<ChannelIngressPolicyInput, "dmPolicy" | "groupPolicy">>;
  /** Command gate input, preset, or false to suppress command checks. */
  command?: ChannelIngressCommandPresetInput | false;
};
/** Reusable high-level ingress resolver for message, command, and event surfaces. */
type ChannelIngressResolver = {
  /** Resolve a normal inbound message with sender, route, command, event, and activation gates. */
  message(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>;
  /** Resolve a command-oriented event with command auth defaults enabled. */
  command(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>;
  /** Resolve a non-message event with event-gate defaults enabled. */
  event(params: ChannelIngressResolverMessageParams): Promise<ResolvedChannelMessageIngress>;
};
/** One-shot helper input using a simple stable identity descriptor. */
type ResolveStableChannelMessageIngressParams = Omit<CreateChannelIngressResolverParams, "identity"> & ChannelIngressResolverMessageParams & {
  identity?: StableChannelIngressIdentityParams;
};
/** Sender/conversation projection consumed by channel handlers. */
type ChannelIngressSenderAccess = {
  /** True when the sender gate admits the event. */
  allowed: boolean;
  /** Final ingress decision after all gates, not just the sender gate. */
  decision: ChannelIngressDecision["decision"];
  /** Sender gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Sender gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
  /** Effective DM allowlist entries after store and access-group processing. */
  effectiveAllowFrom: string[];
  /** Effective group allowlist entries after fallback and access-group processing. */
  effectiveGroupAllowFrom: string[];
  /** Whether provider-specific fallback behavior was applied. */
  providerMissingFallbackApplied: boolean;
};
/** Command projection consumed by channel command/control handlers. */
type ChannelIngressCommandAccess = {
  /** True when a command gate was requested for this event. */
  requested: boolean;
  /** True when the command gate authorizes this sender. */
  authorized: boolean;
  /** True when an unauthorized control command should be blocked. */
  shouldBlockControlCommand: boolean;
  /** Command gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Command gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Route projection consumed by room/thread/topic handlers. */
type ChannelIngressRouteAccess = {
  /** True when all configured route gates admit the event. */
  allowed: boolean;
  /** Route gate reason when a route gate decided. */
  reasonCode?: IngressReasonCode;
  /** Optional route-specific reason text. */
  reason?: string;
  /** Route gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Activation/mention projection consumed by group handlers. */
type ChannelIngressActivationAccess = {
  /** True when an activation gate ran. */
  ran: boolean;
  /** True when activation admits the event. */
  allowed: boolean;
  /** True when the event should be skipped instead of dispatched. */
  shouldSkip: boolean;
  /** Activation gate reason when present, otherwise decisive ingress reason. */
  reasonCode: IngressReasonCode;
  /** Effective mention match after command bypass and activation policy. */
  effectiveWasMentioned?: boolean;
  /** True when mention gating was bypassed by policy or command facts. */
  shouldBypassMention?: boolean;
  /** Activation gate from the access graph, when one ran. */
  gate?: AccessGraphGate;
};
/** Full ingress result returned by runtime resolvers. */
type ResolvedChannelMessageIngress = {
  /** Redacted normalized state used as input to the decision engine. */
  state: ChannelIngressState;
  /** Ordered access graph plus final admission decision. */
  ingress: ChannelIngressDecision;
  /** Sender/conversation projection. */
  senderAccess: ChannelIngressSenderAccess;
  /** Route projection. */
  routeAccess: ChannelIngressRouteAccess;
  /** Command projection. */
  commandAccess: ChannelIngressCommandAccess;
  /** Activation/mention projection. */
  activationAccess: ChannelIngressActivationAccess;
};
//#endregion
//#region src/pairing/pairing-store.types.d.ts
type PairingChannel = ChannelId;
/** Reads approved ids from a channel/account allowFrom store. */
type ReadChannelAllowFromStoreForAccount = (params: {
  channel: PairingChannel;
  accountId: string;
  env?: NodeJS.ProcessEnv;
}) => Promise<string[]>;
/** Deletes one approved id from a channel/account allowFrom store. */
type RemoveChannelAllowFromStoreEntryForAccount = (params: {
  channel: PairingChannel;
  entry: string | number;
  accountId: string;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{
  changed: boolean;
  allowFrom: string[];
}>;
/** Creates or reuses a pending pairing request for one channel account. */
type UpsertChannelPairingRequestForAccount = (params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  pairingAdapter?: ChannelPairingAdapter;
}) => Promise<{
  code: string;
  created: boolean;
}>;
//#endregion
export { ChannelIngressState as A, implicitMentionKindWhen as B, ResolvedChannelMessageIngress as C, ChannelIngressEventInput as D, ChannelIngressDecision as E, InboundMentionFacts as F, ResolvedChannelImplicitMentions as H, InboundMentionPolicy as I, ResolveInboundMentionDecisionFlatParams as L, IngressReasonCode as M, InboundImplicitMentionKind as N, ChannelIngressIdentifierKind as O, InboundMentionDecision as P, ResolveInboundMentionDecisionNestedParams as R, ResolveStableChannelMessageIngressParams as S, AccessGroupMembershipFact as T, resolveChannelImplicitMentions as U, resolveInboundMentionDecision as V, ChannelIngressRouteAccess as _, ChannelIngressAccessGroupMembershipResolver as a, CreateChannelIngressResolverParams as b, ChannelIngressConfigInput as c, ChannelIngressIdentityAlias as d, ChannelIngressIdentityDescriptor as f, ChannelIngressResolverMessageParams as g, ChannelIngressResolver as h, UpsertChannelPairingRequestForAccount as i, ChannelIngressStateInput as j, ChannelIngressPolicyInput as k, ChannelIngressContextBinding as l, ChannelIngressIdentitySubjectInput as m, ReadChannelAllowFromStoreForAccount as n, ChannelIngressCommandAccess as o, ChannelIngressIdentityField as p, RemoveChannelAllowFromStoreEntryForAccount as r, ChannelIngressCommandPresetInput as s, PairingChannel as t, ChannelIngressEventPresetInput as u, ChannelIngressRouteDescriptor as v, StableChannelIngressIdentityParams as w, ResolveChannelMessageIngressParams as x, ChannelMessageIngressCommandInput as y, ResolveInboundMentionDecisionParams as z };