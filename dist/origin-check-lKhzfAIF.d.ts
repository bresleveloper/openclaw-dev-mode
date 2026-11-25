import { D as GatewayOperatorRoleDefinition, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { n as UserProfile$1 } from "./users-DBq9PMgD.js";
import "./openclaw-state-db.generated-B0kBijiJ.js";
import { z } from "zod";
import { SqlBool } from "kysely";
import { IncomingMessage } from "node:http";
declare const accessCauses: {
  readonly "access-record-inactive": false;
  readonly "profile-invalidated": false;
  readonly "plugin-lifetime-retired": true;
  readonly "policy-unavailable": true;
  readonly "policy-set-changed": true;
  readonly "policy-check-failed": false;
  readonly "grant-revoked": false;
};
type GatewayOperatorAccessCause = keyof typeof accessCauses;
type GatewayAccessGrantRef = Readonly<{
  pluginId: string;
  grantId: string;
}>;
/** Additional access held by an authenticated person, independent of a transport. */
type PluginGatewayAccessAuthority = Readonly<{
  /** Stable UUID for one uninterrupted grant, if the policy supports durable requests. */
  grantId?: string;
  assertCurrent: () => void;
  signal: AbortSignal;
  /** Owner-recorded diagnostic only; never substitutes for the signal or live assertion. */
  readonly failureCause?: GatewayOperatorAccessCause;
}>;
type GatewayAccessPolicyContext = {
  config: OpenClawConfig;
  /** The person's effective operator role explicitly names this policy's plugin. */
  requiredByRole: boolean;
  profile: {
    profileId: string;
    emails: readonly string[];
    githubAccountIds?: readonly number[];
    assignedRole: string | null;
  };
};
type PluginGatewayAccessPolicy = {
  /** Return no authority when inapplicable; an explicit role binding still requires authority. */
  authorize: (context: GatewayAccessPolicyContext) => PluginGatewayAccessAuthority | undefined;
  /**
   * Check the original grant even if the current role is exempt. Return undefined
   * only for a definitively ended grant; throw while its state is unavailable.
   */
  resume?: (context: GatewayAccessPolicyContext & {
    grantId: string;
  }) => PluginGatewayAccessAuthority | undefined;
};
type UserProfile = Omit<UserProfile$1, "emails" | "githubIdentity" | "gitCoauthorAvailable" | "gitCoauthorIdentity" | "hasAvatar" | "effectiveRole" | "roleSource">;
type UserProfileOwnerErrorCode = "merge" | "role" | "repair-required";
type UserProfileDisplay = Pick<UserProfile$1, "id" | "displayName" | "hasAvatar"> & {
  avatarRevision: string;
};
type UserProfileAuthority = {
  profileId: string;
  role: string | null;
  githubLogin?: string | null;
  aliases: string[];
  display: UserProfileDisplay;
};
type CachedGitHubIdentity = {
  profileId: string;
  updatedAt: number;
};
type UserChannelAuthorizationReference = Readonly<{
  version: 1;
  id: string;
}>;
type UserProfileIdentity = Omit<UserProfileAuthority, "aliases" | "display"> & {
  aliases: ReadonlySet<string>;
};
/** Ed25519 signing key (owner root R, owner device D, Gateway key K_gw): `ed25519:<64 hex>`. */
type Ed25519PublicKey = `ed25519:${string}`;
/** iroh endpoint id (device peer key W, claw server key K_srv): `iroh:<64 hex>`. */
type IrohEndpointKey = `iroh:${string}`;
/** SHA-256 over the raw 32 public-key bytes: `fp:<64 hex>`. */
type KeyFingerprint = `fp:${string}`;
/**
 * Signed-statement envelope versions this package validates and verifies. Each listed version
 * has its own schema and signing domain; a version that is not listed is refused as
 * `unsupported_version`, never parsed with another version's rules.
 */
declare const SUPPORTED_STATEMENT_VERSIONS: readonly [1];
/** A statement envelope version this package implements. */
type StatementVersion = (typeof SUPPORTED_STATEMENT_VERSIONS)[number];
/** Statement types. The type string is part of the signed domain-separation prefix. */
declare const STATEMENT_TYPES: readonly ["OwnerDeviceCert", "ServerBinding", "InviteCap", "MembershipChange", "Revocation", "MembershipSnapshot", "InviteRedemption", "RootReset", "NodeInviteCap", "NodeRedemption"];
/** One of {@link STATEMENT_TYPES}. */
type StatementType = (typeof STATEMENT_TYPES)[number];
/** Unix time in whole seconds. */
type UnixSeconds = number;
/**
 * The only root epoch in v1-draft. There are no root epochs: an owner reset replaces the root
 * without one (RootReset), so `root_epoch` is a constant: statements carry it, and anything
 * else is malformed.
 */
declare const ROOT_EPOCH = 1;
/** Capabilities an owner device certificate grants. A certificate never grants more than its approver holds. */
declare const OWNER_CAPABILITIES: readonly ["approve_device", "bind", "invite", "manage_members"];
/** One of {@link OWNER_CAPABILITIES}. */
type OwnerCapability = (typeof OWNER_CAPABILITIES)[number];
/** Opaque role name: 1–64 lowercase ASCII letters, digits, hyphens or underscores; starts with a letter. */
type MemberRole = string;
/**
 * Certifies an owner device key D (and optionally its iroh peer keys W). It is signed by R or by
 * an owner device the claw currently lists, and admits D only at a claw that adds it.
 */
type OwnerDeviceCertBody = {
  device_pub: Ed25519PublicKey;
  peer_keys: IrohEndpointKey[];
  label: string;
  scope: "owner";
  caps: OwnerCapability[];
  issued_at: UnixSeconds;
  /** null = valid until removed. */
  expires_at: UnixSeconds | null;
  /** Always {@link ROOT_EPOCH}; anything else is malformed. */
  root_epoch: number;
};
/** Binds a claw's hostname to its tunnel server key K_srv and Gateway signing key K_gw. */
type ServerBindingBody = {
  claw_id: string;
  hostname: string;
  k_srv: IrohEndpointKey;
  k_gw: Ed25519PublicKey;
  /** Monotonic per claw; clients refuse a lower value than they have seen. */
  binding_seq: number;
  /** Always {@link ROOT_EPOCH}; anything else is malformed. */
  root_epoch: number;
  issued_at: UnixSeconds;
};
/** Who an invite is for, as asserted by OpenClaw ID (not a security boundary on its own). */
type InviteAudience = {
  kind: "account_id";
  value: string;
} | {
  kind: "email";
  value: string;
};
/** An invitation capability, registered directly at the Gateway. */
type InviteCapBody = {
  claw_id: string;
  invite_id: string;
  role: MemberRole;
  audience: InviteAudience;
  label: string;
  created_at: UnixSeconds;
  expires_at: UnixSeconds;
  single_use: boolean;
  /** SHA-256 hex of the invite proof key (see invites.ts), never the link secret itself. */
  secret_hash: string;
};
/** Target of a membership change; which fields are required depends on `op`. */
type MembershipTarget = {
  op: "add";
  account_id: string;
  role: MemberRole;
  peer_keys: IrohEndpointKey[];
  invite_id: string | null;
} | {
  op: "add_member_device";
  account_id: string;
  peer_key: IrohEndpointKey;
  device_pub: Ed25519PublicKey;
  label: string;
} | {
  op: "add_node";
  peer_key: IrohEndpointKey;
  label: string;
  invite_id: string;
} | {
  op: "remove_node";
  peer_key: IrohEndpointKey;
} | {
  op: "remove";
  account_id: string;
} | {
  op: "set_role";
  account_id: string;
  role: MemberRole;
} | {
  op: "revoke_device";
  peer_key: IrohEndpointKey;
} | {
  op: "add_owner_device";
  cert: SignedStatement<"OwnerDeviceCert">;
  /**
   * The same device's node, approved in this decision and bound to the device: it is listed in
   * `node_peer_keys`, and removing the device removes it. Absent leaves a listed device's
   * existing node unchanged.
   */
  node?: OwnerDeviceNode;
} |
/** Owner declines a pending redemption; the invite is consumed and nothing is admitted. */
{
  op: "deny_invite";
  invite_id: string;
};
/** A change to a claw's membership, written by an owner device (or R) directly at the Gateway. */
type MembershipChangeBody = {
  claw_id: string;
  /** Must be the Gateway's current membership seq + 1 (compare-and-set; stops replays). */
  seq: number;
  target: MembershipTarget;
  issued_at: UnixSeconds;
};
/** What a revocation removes: an owner device (with every device it approved) or a peer key. */
declare const REVOCATION_KINDS: readonly ["owner_device", "peer_key"];
/** One of {@link REVOCATION_KINDS}. */
type RevocationKind = (typeof REVOCATION_KINDS)[number];
/**
 * Removes a key by fingerprint from one claw. It covers only what its signer saw: a key listed
 * at or before `seq`. A key listed again after that seq is a new approval it does not cover, so
 * the same bytes submitted later change nothing. Nothing remembers the revocation afterwards.
 */
type RevocationBody = {
  claw_id: string;
  /** The claw's membership seq the signer last saw (the snapshot's seq). */
  seq: number;
  target_fp: KeyFingerprint;
  target_kind: RevocationKind;
  reason: string;
  /** Always {@link ROOT_EPOCH}; anything else is malformed. */
  root_epoch: number;
  issued_at: UnixSeconds;
};
/** One owner device in a snapshot: its key D and the capabilities the Gateway granted it. */
type SnapshotOwnerDevice = {
  device_pub: Ed25519PublicKey;
  caps: OwnerCapability[];
};
/** One member entry in a snapshot. */
type SnapshotMember = {
  account_id: string;
  role: MemberRole;
  peer_keys: IrohEndpointKey[];
};
/**
 * Protocol versions a Gateway accepts for new input, per versioned surface, ascending. Clients
 * pick the highest version they share with it (`selectVersion`). The tunnel is not listed: its
 * version is negotiated by QUIC ALPN inside the handshake K_srv authenticates.
 */
type ProtocolVersions = {
  /** Signed statement envelope versions. */
  statement: number[];
  /** ClawDescriptor versions. */
  descriptor: number[];
};
/**
 * Gateway-signed (K_gw) mirror of the claw's current allowlist for Discovery listing and relay
 * admission. Not an authority, and it carries no history: a removed key is simply absent.
 */
type MembershipSnapshotBody = {
  claw_id: string;
  seq: number;
  binding_seq: number;
  /**
   * The current owner devices with their granted capabilities. Readers outside the claw take
   * an owner device's capabilities from here, never from a certificate a browser presents.
   */
  owner_devices: SnapshotOwnerDevice[];
  /** Owner device peer keys the relay should admit. */
  owner_peer_keys: IrohEndpointKey[];
  members: SnapshotMember[];
  /**
   * The versions this Gateway accepts. Signed by K_gw and only used from a snapshot that passed
   * `assessFreshness`, so Discovery cannot edit it. It can still replay an older list a client
   * has not seen; the Gateway refusing unlisted versions is what keeps that harmless.
   */
  protocols: ProtocolVersions;
  /** Node-only keys: never owner or member authority. */
  node_peer_keys: IrohEndpointKey[];
  issued_at: UnixSeconds;
};
/** An invitee's request to redeem an invite; signed by the invitee's new device key D_I. */
type InviteRedemptionBody = {
  label: string;
  claw_id: string;
  invite_id: string;
  account_id: string;
  device_pub: Ed25519PublicKey;
  peer_key: IrohEndpointKey;
  /** HMAC-SHA-256 hex under the invite proof key over the redemption proof input (invites.ts). */
  proof: string;
  requested_at: UnixSeconds;
};
/**
 * Owner reset (OCF-319): the Gateway, with the K_gw of the claw's current binding, vouches that
 * the claw's root is now `new_root_pub` from `binding_seq` on. Reset only happens on the claw's
 * machine. It keeps K_srv and K_gw, so the new binding (signed by the new root at this
 * binding_seq) names the same keys as the binding it replaces.
 */
type RootResetBody = {
  claw_id: string;
  new_root_pub: Ed25519PublicKey;
  /** The new binding's binding_seq: higher than the binding the reset replaces. */
  binding_seq: number;
  issued_at: UnixSeconds;
};
/** A single-use node invitation, registered directly with its proof key. */
type NodeInviteCapBody = Pick<InviteCapBody, "claw_id" | "invite_id" | "label" | "created_at" | "expires_at" | "secret_hash">;
type NodeDescription = {
  display_name: string;
  platform: string;
  commands: string[];
  caps: string[];
};
/** A node approved together with an owner device (sign-in-first apps); never human authority. */
type OwnerDeviceNode = {
  peer_key: IrohEndpointKey;
  label: string;
  /** The surface the approver reviewed; the node may use no command or cap outside it. */
  description: NodeDescription;
};
/** Self-signed by W (the same raw key encoded as ed25519: in the envelope). */
type NodeRedemptionBody = {
  description: NodeDescription;
  claw_id: string;
  invite_id: string;
  peer_key: IrohEndpointKey;
  proof: string;
  requested_at: UnixSeconds;
};
/** Maps each statement type to its body. */
type StatementBodies = {
  OwnerDeviceCert: OwnerDeviceCertBody;
  ServerBinding: ServerBindingBody;
  InviteCap: InviteCapBody;
  MembershipChange: MembershipChangeBody;
  Revocation: RevocationBody;
  MembershipSnapshot: MembershipSnapshotBody;
  InviteRedemption: InviteRedemptionBody;
  RootReset: RootResetBody;
  NodeInviteCap: NodeInviteCapBody;
  NodeRedemption: NodeRedemptionBody;
};
/**
 * The signed envelope: `{ v, type, body, signer, alg, sig }`.
 *
 * `signer` carries the full public key (not only its fingerprint) so a verifier that
 * pinned only fp(R) can check R's signatures. A statement signed by an owner device is
 * checked against the claw's current owner devices, which only the Gateway knows.
 */
type SignedStatement<T extends StatementType = StatementType> = {
  /** Envelope version; selects the schema and the signing domain. */
  v: StatementVersion;
  type: T;
  body: StatementBodies[T];
  signer: Ed25519PublicKey;
  alg: "ed25519";
  /** Unpadded base64url Ed25519 signature over the signing input. */
  sig: string;
};
/** Who an admitted tunnel device is, decided by the Gateway's membership authority. */
type OpenClawIdTunnelPrincipal = ({
  kind: "owner";
  peerKey: string;
} | {
  kind: "node";
  peerKey: string;
} | {
  kind: "member";
  peerKey: string;
  accountId: string;
  role: MemberRole;
}) & {
  /** The resident membership owner supplies the original listing, not transport callers. */
  authority?: {
    clawId: string;
    rootPub: string;
    listedSeq: number;
    ownerDevice?: string;
  };
};
/** A failure to admit remote Control UI transport through the host. */
type GatewayControlUiIngressErrorCode = "unsupported-auth" | "invalid-options" | "unavailable" | "closed" | "limit-exceeded" | "forbidden";
declare class GatewayControlUiIngressError extends Error {
  readonly code: GatewayControlUiIngressErrorCode;
  constructor(code: GatewayControlUiIngressErrorCode, message: string);
}
type GatewayIngressPrincipal = {
  kind: "owner";
} | {
  kind: "person";
  profileId: string;
} |
/** Host-captured admission, retained verbatim by the consent owner. */
{
  kind: "delegated-person";
  profileId: string;
  admission: string;
};
/** The plugin owns consent, expiry, persistence, and revocation of this exact grant. */
type GatewayIngressPrincipalOptionsV1 = {
  audienceId: string;
  principal: GatewayIngressPrincipal;
  operatorScopeCeiling: readonly string[];
  signal: AbortSignal;
  assertCurrent: () => void;
};
type GatewayControlUiIngressPresentationOptionsV1 = {
  publicOrigin: string;
  sandboxOrigin: string;
  frameAncestors: readonly string[];
};
type GatewayControlUiIngressOpenOptionsV2 = GatewayIngressPrincipalOptionsV1 & GatewayControlUiIngressPresentationOptionsV1;
type GatewayIngressRequestOptionsV1 = {
  signal?: AbortSignal;
};
/** One live principal resolution shared by RPC and any Control UI transport it opens. */
interface GatewayIngressPrincipalBindingV1 {
  request<T = unknown>(method: string, params: Record<string, unknown>, options?: GatewayIngressRequestOptionsV1): Promise<T>;
  openControlUi(options: GatewayControlUiIngressPresentationOptionsV1): Promise<GatewayControlUiIngressV2>;
  close(): Promise<void>;
}
/** Versioned principal-bound ingress supplied by an admitted plugin service. */
/** Reconstruct the exact owner-issued grant; undefined means definitively revoked. */
type GatewayIngressPrincipalRecovery = (audienceId: string) => Promise<(GatewayIngressPrincipalOptionsV1 & {
  recoveryId: string;
}) | undefined>;
interface GatewayControlUiIngressFactoryV2 {
  readonly capabilityVersion: 2;
  /** Service-owned recovery; throw while the canonical grant store is unavailable. */
  registerPrincipalRecovery?(resume: GatewayIngressPrincipalRecovery): Promise<void>;
  open(options: GatewayControlUiIngressOpenOptionsV2): Promise<GatewayControlUiIngressV2>;
  bindPrincipal(options: GatewayIngressPrincipalOptionsV1): Promise<GatewayIngressPrincipalBindingV1>;
}
type GatewayIngressMessage = {
  kind: "text";
  text: string;
} | {
  kind: "binary";
  bytes: Uint8Array;
};
interface GatewayIngressSocketV1 {
  send(message: GatewayIngressMessage): Promise<void>;
  readonly messages: AsyncIterable<GatewayIngressMessage>;
  readonly closed: Promise<{
    code: number;
    reason: string;
  }>;
  close(code?: number, reason?: string): void;
}
type GatewayControlUiIngressRequestV1 = {
  surface: "control-ui" | "sandbox";
  method: string;
  pathAndQuery: string;
  headers: readonly (readonly [string, string])[];
  body?: ReadableStream<Uint8Array>;
  signal: AbortSignal;
};
type GatewayControlUiIngressWebSocketRequestV1 = {
  pathAndQuery: string;
  /** Actual browser Origin, matched exactly against this handle's public origin. */
  origin: string;
  protocols: readonly string[];
  signal: AbortSignal;
};
/** Only core-issued signed read grants may be published as plugin cookies. */
interface GatewayPluginReadCookieV1 {
  name: string;
  value: string;
  path: string;
  maxAgeSeconds: number;
  kind: "native-assets" | "iframe-read";
}
interface GatewayControlUiIngressV2 {
  readonly presentation: {
    readonly basePath: string;
    readonly publicOrigin: string;
    readonly sandboxOrigin: string;
    readonly operatorScopeCeiling: readonly string[];
  };
  request(input: GatewayControlUiIngressRequestV1): Promise<{
    response: Response;
    pluginReadCookies: readonly GatewayPluginReadCookieV1[];
  }>;
  openWebSocket(input: GatewayControlUiIngressWebSocketRequestV1): Promise<{
    protocol?: string;
    socket: GatewayIngressSocketV1;
  }>;
  requestGateway: GatewayIngressPrincipalBindingV1["request"];
  /** Fence admission and abort transport; effect and publication guards reject stale work. */
  close(): Promise<void>;
}
type GatewayOperatorAccessAuthority = PluginGatewayAccessAuthority & {
  /** Role requirement enforced when this authority was admitted. */
  readonly requiredPolicyPlugin?: string;
  readonly gatewayAccessGrant?: GatewayAccessGrantRef | null;
};
/** Host-minted role authority; never accepted from Gateway wire params.
    Leaf contract: both ws-types and server-methods/shared-types embed it in
    client `internal` state, so it must not import either hub. */
type GatewayOperatorRoleActor = {
  kind: "system";
} | {
  kind: "operator";
  profileId: string;
};
/** Server-attested identity facts shared by RPC and transport client records. */
type GatewayAuthenticatedUserProfile = {
  profileId: string;
  displayName: string | null;
  avatarRevision: string;
  hasAvatar: boolean;
  updatedAt: number;
};
type RemoteIngressPrincipalSnapshot = Readonly<{
  bindingId: string;
  /** Host-captured original admission, carried across further app approvals. */
  admission?: string;
  openclawIdPrincipal?: OpenClawIdTunnelPrincipal;
  recoverySource?: Readonly<{
    pluginId: string;
    audienceId: string;
    recoveryId: string;
  }>;
  authenticatedUserProfile: GatewayAuthenticatedUserProfile;
  preparedSessionProfile: UserProfileIdentity;
  operatorRoleActor: GatewayOperatorRoleActor;
  operatorRolePolicy?: GatewayOperatorRoleDefinition;
  operatorAccessAuthority?: GatewayOperatorAccessAuthority | null;
  scopes: string[];
  signal: AbortSignal;
  assertCurrent(): void;
}>;
/** Core-retained grant authority; browser headers cannot create this context. */
type RemoteControlUiIngressContext = Readonly<{
  pluginId: string;
  audienceId: string;
  publicOrigin: string;
  sandboxOrigin: string;
  principal: GatewayIngressPrincipal;
  operatorScopeCeiling: readonly string[];
  resolvePrincipal(): RemoteIngressPrincipalSnapshot;
  frameAncestors: readonly string[];
  signal: AbortSignal;
  assertCurrent(): void;
}>;
type GatewayWsBrowserOrigin = {
  requestHost?: string;
  origin?: string;
  isLocalClient?: boolean;
  remoteControlUiIngress?: RemoteControlUiIngressContext;
  /** The connection was relayed by the OpenClaw ID tunnel (attested by the private ingress listener). */
  openclawIdTunnel?: boolean;
};
/** Return the request Origin only when the Gateway's canonical browser policy accepts it. */
declare function resolveAcceptedBrowserOrigin(params: {
  req: IncomingMessage;
  cfg?: OpenClawConfig;
}): string | undefined;
export { NodeRedemptionBody as A, UserProfile as B, GatewayPluginReadCookieV1 as C, MemberRole as D, InviteCapBody as E, Ed25519PublicKey as F, PluginGatewayAccessPolicy as G, UserProfileIdentity as H, IrohEndpointKey as I, KeyFingerprint as L, ROOT_EPOCH as M, SignedStatement as N, NodeDescription as O, UnixSeconds as P, CachedGitHubIdentity as R, GatewayIngressSocketV1 as S, InviteAudience as T, UserProfileOwnerErrorCode as U, UserProfileDisplay as V, GatewayAccessGrantRef as W, GatewayIngressPrincipal as _, RemoteIngressPrincipalSnapshot as a, GatewayIngressPrincipalRecovery as b, GatewayControlUiIngressError as c, GatewayControlUiIngressOpenOptionsV2 as d, GatewayControlUiIngressPresentationOptionsV1 as f, GatewayIngressMessage as g, GatewayControlUiIngressWebSocketRequestV1 as h, RemoteControlUiIngressContext as i, OwnerCapability as j, NodeInviteCapBody as k, GatewayControlUiIngressErrorCode as l, GatewayControlUiIngressV2 as m, GatewayAuthenticatedUserProfile as n, GatewayOperatorRoleActor as o, GatewayControlUiIngressRequestV1 as p, GatewayWsBrowserOrigin as r, GatewayOperatorAccessAuthority as s, resolveAcceptedBrowserOrigin as t, GatewayControlUiIngressFactoryV2 as u, GatewayIngressPrincipalBindingV1 as v, OpenClawIdTunnelPrincipal as w, GatewayIngressRequestOptionsV1 as x, GatewayIngressPrincipalOptionsV1 as y, UserChannelAuthorizationReference as z };