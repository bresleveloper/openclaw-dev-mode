import { i as PluginRuntime, n as PluginStateSyncKeyedStore } from "./cli-backend.types-kTOThe9I.js";
import { z } from "zod";
import { DatabaseSync } from "node:sqlite";
import { Selectable } from "kysely";
//#region extensions/reef/protocol/audit.d.ts
interface AuditEvent {
  seq: number;
  ts: number;
  type: string;
  payload: unknown;
}
interface AuditEntry {
  event: AuditEvent;
  prevHash: string;
  entryHash: string;
}
interface AuditStore {
  appendEvent(type: string, payload: unknown, ts?: number): Promise<AuditEntry>;
  entries(): Promise<AuditEntry[]>;
}
//#endregion
//#region extensions/reef/protocol/receipts.d.ts
interface ReceiptBody {
  id: string;
  bodyHash: string;
  auditHead: string;
  status: "accepted" | "rejected";
  category?: string;
}
interface SignedReceipt extends ReceiptBody {
  signature: string;
}
//#endregion
//#region extensions/reef/protocol/envelope.d.ts
type ReplayClaim = "new" | "duplicate" | "mismatch" | "in_flight";
interface CompletedReplay {
  receipt: SignedReceipt;
  body?: MessageBody;
}
interface ReplayStore {
  claim(peer: string, id: string, envelopeHash: string): Promise<ReplayClaim>;
  /** Renews an in-flight claim while slow guard or review work is active. */
  refresh?(peer: string, id: string): Promise<void>;
  complete(peer: string, id: string, receipt: SignedReceipt, body?: MessageBody): Promise<void>;
  consume(peer: string, id: string): Promise<void>;
  release(peer: string, id: string): Promise<void>;
  completed(peer: string, id: string): Promise<CompletedReplay | undefined>;
}
interface MessageBody {
  text: string;
  replyTo?: string;
  thread?: string;
}
interface UnsignedEnvelope {
  v: 1;
  id: string;
  from: string;
  to: string;
  ts: number;
  epk: string;
  n: string;
  ct: string;
}
interface Envelope extends UnsignedEnvelope {
  sig: string;
}
//#endregion
//#region extensions/reef/protocol/guard.d.ts
type GuardDirection = "outbound" | "inbound";
interface GuardRequest {
  direction: GuardDirection;
  source: string;
  destination: string;
  text: string;
  policyVersion: string;
}
interface Verdict {
  decision: "allow" | "deny" | "review";
  category: string;
  reason: string;
  model: string;
  policyVersion: string;
}
interface GuardAdapter {
  readonly providerId: string;
  readonly pinnedModel: string;
  classify(request: GuardRequest): Promise<Verdict>;
}
//#endregion
//#region extensions/reef/protocol/pipeline.d.ts
interface ReviewRequest {
  id: string;
  from: string;
  to: string;
  direction: GuardDirection;
  bodyHash: string;
  approvalDigest: string;
  verdict: Verdict;
}
interface ReviewApproval {
  approved: boolean;
  approvalDigest: string;
}
//#endregion
//#region extensions/reef/src/friend-types.d.ts
declare const ReefAutonomySchema: z.ZodEnum<{
  bounded: "bounded";
  extended: "extended";
  "notify-only": "notify-only";
}>;
declare const ReefPeerTrustSchema: z.ZodObject<{
  autonomy: z.ZodEnum<{
    bounded: "bounded";
    extended: "extended";
    "notify-only": "notify-only";
  }>;
  ed25519PublicKey: z.ZodString;
  x25519PublicKey: z.ZodString;
  keyEpoch: z.ZodNumber;
  safetyNumberChanged: z.ZodBoolean;
  approvedAt: z.ZodNumber;
}, z.core.$strict>;
declare const ReefPeerIdentitySchema: z.ZodObject<{
  ed25519PublicKey: z.ZodString;
  x25519PublicKey: z.ZodString;
  keyEpoch: z.ZodNumber;
}, z.core.$strict>;
type ReefAutonomy = z.infer<typeof ReefAutonomySchema>;
type ReefPeerIdentity = z.infer<typeof ReefPeerIdentitySchema>;
type ReefPeerTrust = z.infer<typeof ReefPeerTrustSchema>;
//#endregion
//#region extensions/reef/src/config-schema.d.ts
declare const ReefChannelConfigSchema: z.ZodObject<{
  enabled: z.ZodDefault<z.ZodBoolean>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  relayUrl: z.ZodDefault<z.ZodString>;
  handle: z.ZodOptional<z.ZodString>;
  email: z.ZodOptional<z.ZodEmail>;
  guard: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
    pinnedModel: z.ZodString;
    policyVersion: z.ZodString;
    timeoutMs: z.ZodNumber;
    rules: z.ZodOptional<z.ZodObject<{
      outbound: z.ZodOptional<z.ZodString>;
      inbound: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    provider: z.ZodLiteral<"openai">;
    authMode: z.ZodLiteral<"oauth">;
    authProfileId: z.ZodString;
  }, z.core.$strict>, z.ZodObject<{
    pinnedModel: z.ZodString;
    policyVersion: z.ZodString;
    timeoutMs: z.ZodNumber;
    rules: z.ZodOptional<z.ZodObject<{
      outbound: z.ZodOptional<z.ZodString>;
      inbound: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    provider: z.ZodEnum<{
      anthropic: "anthropic";
      openai: "openai";
    }>;
    authMode: z.ZodOptional<z.ZodLiteral<"api-key">>;
    apiKeyEnv: z.ZodString;
  }, z.core.$strict>]>>;
  stateDir: z.ZodOptional<z.ZodString>;
  requestPolicy: z.ZodDefault<z.ZodEnum<{
    "code-only": "code-only";
    "friends-of-friends": "friends-of-friends";
    open: "open";
  }>>;
  friends: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strict>;
type ReefChannelConfig = z.infer<typeof ReefChannelConfigSchema>;
//#endregion
//#region extensions/reef/src/types.d.ts
interface ReefKeys {
  signing: {
    publicKey: string;
    secretKey: string;
  };
  encryption: {
    publicKey: string;
    secretKey: string;
  };
  auditKey: string;
  replayKey: string;
  keyEpoch: number;
}
interface ReefAccount {
  accountId: "default";
  enabled: boolean;
  configured: boolean;
  config: ReefChannelConfig;
}
interface RelayFriend {
  peer: string;
  status: "pending" | "active" | "blocked" | "reapprove_required";
  initiated_by: string;
  vouching_mutual: string | null;
  ed25519_pub: string;
  x25519_pub: string;
  key_epoch: number;
}
interface InboxEntry {
  seq: number;
  peer: string;
  id: string;
  kind: "message" | "receipt";
  envelope?: Envelope;
  receipt?: SignedReceipt;
  ts: number;
}
interface ReefDependencies {
  fetch?: typeof fetch;
  guard?: GuardAdapter;
  onIngress?: (message: ReefIngressMessage) => Promise<void>;
  onOwnerNotice?: (text: string) => Promise<void>;
}
interface ReefIngressMessage {
  id: string;
  peer: string;
  text: string;
  thread?: string;
  replyTo?: string;
  provenance: string;
  autonomy: ReefAutonomy;
}
interface ReefDeliveryRejection {
  id: string;
  peer: string;
  /** Recipient identity pinned when the rejected envelope was composed. */
  recipient: ReefPeerIdentity;
  /** Normalized text fingerprint pinned when the rejected envelope was composed. */
  textHash?: string;
  category?: string;
  /** Durable pre-notification reservation recovered after an ambiguous restart. */
  reservedNotice?: ReefRejectionNoticeState;
}
interface ReefRejectionNoticeState {
  lastRejectionAt: number;
  lastResendAt?: number;
}
//#endregion
//#region extensions/reef/src/transport.d.ts
type FetchLike = typeof fetch;
declare class ReefRelayError extends Error {
  readonly status: number;
  readonly code?: string | undefined;
  constructor(status: number, message: string, code?: string | undefined);
}
declare class ReefProtocolCompatibilityError extends ReefRelayError {
  readonly upgradeRequired: "reef-relay" | "openclaw-client";
  constructor(status: 400 | 409, code: "invalid_request" | "client_upgrade_required", upgradeRequired: "reef-relay" | "openclaw-client", message: string);
}
declare class ReefTransportClient {
  readonly relayUrl: string;
  readonly handle: string;
  readonly keys: ReefKeys;
  readonly fetcher: FetchLike;
  readonly clock: () => number;
  readonly requestTimeoutMs: number;
  private lastTs;
  constructor(relayUrl: string, handle: string, keys: ReefKeys, fetcher?: FetchLike, clock?: () => number, requestTimeoutMs?: number);
  authStart(email: string): Promise<{
    status: string;
    magicLink?: string;
  }>;
  authComplete(token: string): Promise<{
    session: string;
    expires: number;
  }>;
  createHandle(session: string, requestPolicy: string): Promise<{
    handle: string;
    key_epoch: number;
  }>;
  listOwnHandles(session: string): Promise<{
    handles: Array<{
      handle: string;
      key_epoch: number;
      request_policy: string;
    }>;
  }>;
  mintFriendCode(signal?: AbortSignal): Promise<{
    code: string;
    expires: number;
  }>;
  requestFriend(to: string, code?: string, signal?: AbortSignal): Promise<{
    status: string;
  }>;
  respondFriend(friend: RelayFriend, accept: boolean, signal?: AbortSignal): Promise<{
    peer: string;
    status: "active" | "blocked";
  }>;
  listFriends(signal?: AbortSignal): Promise<{
    friendships: RelayFriend[];
  }>;
  removeFriend(peer: string, signal?: AbortSignal): Promise<void>;
  sendEnvelope(peer: string, envelope: Envelope, signal?: AbortSignal): Promise<{
    id: string;
    status: string;
  }>;
  acknowledge(peer: string, id: string, receipt: SignedReceipt): Promise<{
    result: string;
  }>;
  pull(after: number, signal?: AbortSignal): Promise<{
    entries: InboxEntry[];
    cursor: number;
  }>;
  websocketUrl(): string;
  signed<T>(method: string, path: string, body?: unknown, signal?: AbortSignal, secrets?: readonly string[]): Promise<T>;
  private auth;
  private unsigned;
  private request;
}
interface WebSocketLike {
  addEventListener(type: "message", listener: (event: {
    data: unknown;
  }) => void): void;
  addEventListener(type: "open", listener: () => void): void;
  addEventListener(type: "close", listener: (event: {
    code?: number;
    reason?: string;
  }) => void): void;
  addEventListener(type: "error", listener: (event: {
    error?: unknown;
    message?: string;
  }) => void): void;
  send(data: string): void;
  close(): void;
}
interface ReefInboxConnectionOptions {
  initialCursor?: number;
  persistCursor?: ((cursor: number) => void) | ((cursor: number) => Promise<void>);
  onState?: (state: "connected" | "disconnected") => void;
  onError?: (error: Error) => void;
}
declare class ReefInboxConnection {
  readonly client: ReefTransportClient;
  readonly onEntries: (entries: InboxEntry[]) => Promise<void>;
  readonly webSocketFactory: (url: string) => WebSocketLike;
  readonly options: ReefInboxConnectionOptions;
  private cursor;
  private processing;
  private stopped;
  private parked;
  private reconciledThrough;
  private readonly processedAboveCursor;
  constructor(client: ReefTransportClient, onEntries: (entries: InboxEntry[]) => Promise<void>, webSocketFactory: (url: string) => WebSocketLike, options?: ReefInboxConnectionOptions);
  start(signal?: AbortSignal): Promise<void>;
  stop(): void;
  drain(signal?: AbortSignal): Promise<void>;
  private processEntries;
  /**
   * Re-attempts parked entries over REST while the live socket stays up. The
   * reconcile loop calls this; after an owner decides a review (or a guard
   * outage ends) the next poll completes the delivery.
   */
  poll(signal?: AbortSignal): Promise<void>;
  private advanceCursor;
  private serialize;
  private live;
}
//#endregion
//#region extensions/reef/src/trust-store.d.ts
declare const ReefOutboundDeliveryBindingSchema: z.ZodObject<{
  bodyHash: z.ZodString;
  textHash: z.ZodOptional<z.ZodString>;
  recipient: z.ZodObject<{
    ed25519PublicKey: z.ZodString;
    x25519PublicKey: z.ZodString;
    keyEpoch: z.ZodNumber;
  }, z.core.$strict>;
}, z.core.$strict>;
declare const ReefOutboundDeliverySchema: z.ZodObject<{
  bodyHash: z.ZodString;
  textHash: z.ZodOptional<z.ZodString>;
  recipient: z.ZodObject<{
    ed25519PublicKey: z.ZodString;
    x25519PublicKey: z.ZodString;
    keyEpoch: z.ZodNumber;
  }, z.core.$strict>;
  resendDisabled: z.ZodOptional<z.ZodLiteral<true>>;
  rejection: z.ZodOptional<z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    notice: z.ZodOptional<z.ZodObject<{
      lastRejectionAt: z.ZodNumber;
      lastResendAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  sentAt: z.ZodOptional<z.ZodNumber>;
  overdueNotifiedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const ReefPeerStateSchema: z.ZodObject<{
  revision: z.ZodNumber;
  trust: z.ZodOptional<z.ZodObject<{
    autonomy: z.ZodEnum<{
      bounded: "bounded";
      extended: "extended";
      "notify-only": "notify-only";
    }>;
    ed25519PublicKey: z.ZodString;
    x25519PublicKey: z.ZodString;
    keyEpoch: z.ZodNumber;
    safetyNumberChanged: z.ZodBoolean;
    approvedAt: z.ZodNumber;
  }, z.core.$strict>>;
  outboundRequests: z.ZodOptional<z.ZodRecord<z.ZodUUID, z.ZodNumber>>;
  rejectionNotice: z.ZodOptional<z.ZodObject<{
    lastRejectionAt: z.ZodNumber;
    lastResendAt: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>;
type ReefPeerStateSnapshot = z.infer<typeof ReefPeerStateSchema>;
type ReefOutboundDeliveryBinding = z.infer<typeof ReefOutboundDeliveryBindingSchema>;
type ReefTrustStores = {
  peers: PluginStateSyncKeyedStore<ReefPeerStateSnapshot>;
  deliveries: PluginStateSyncKeyedStore<z.infer<typeof ReefOutboundDeliverySchema>>;
};
/** Canonical local Reef authorization state for one relay identity. */
declare class ReefTrustStore {
  #private;
  readonly stores: ReefTrustStores;
  constructor(stores: ReefTrustStores, config: ReefChannelConfig);
  snapshot(peer: string): ReefPeerStateSnapshot;
  get(peer: string): ReefPeerTrust | undefined;
  list(): Array<{
    peer: string;
    trust: ReefPeerTrust;
  }>;
  set(peer: string, trust: ReefPeerTrust): void;
  remove(peer: string): boolean;
  setAutonomy(peer: string, autonomy: ReefAutonomy): void;
  markSafetyNumberChanged(peer: string, expectedRevision: number): boolean;
  commitPeerTrust(friend: RelayFriend, options: {
    expectedRevision: number;
    expectedOutboundRequestId?: string;
  }, approvedAt?: number): boolean;
  createPairingApproval(friend: RelayFriend, trustRevision?: number): string;
  parsePairingApproval(raw: string): {
    peer: string;
    keyEpoch: number;
    trustRevision: number;
  } | undefined;
  matchesPairingApproval(raw: string, friend: RelayFriend): boolean;
  recordOutboundRequest(peer: string, requestedAt?: number): string;
  hasOutboundRequest(peer: string): boolean;
  outboundRequestStatus(peer: string, requestId: string): "current" | "superseded" | "revoked";
  removeOutboundRequest(peer: string, requestId?: string): boolean;
  recordOutboundDelivery(peer: string, id: string, binding: ReefOutboundDeliveryBinding, options?: {
    resendDisabled?: true;
  }): void;
  /**
   * Sends that never produced any receipt. Rejections have their own notice
   * path, and each delivery is reported overdue at most once.
   */
  overdueOutboundDeliveries(olderThanMs: number, now?: number): Array<{
    peer: string;
    id: string;
    sentAt: number;
  }>;
  markOutboundDeliveryOverdueNotified(peer: string, id: string): boolean;
  outboundDelivery(peer: string, id: string): z.infer<typeof ReefOutboundDeliverySchema> | undefined;
  consumeOutboundDelivery(peer: string, id: string, binding: ReefOutboundDeliveryBinding): boolean;
  discardOutboundDelivery(peer: string, id: string, binding: ReefOutboundDeliveryBinding): boolean;
  recordOutboundRejection(peer: string, id: string, binding: ReefOutboundDeliveryBinding, category?: string): boolean;
  pendingOutboundRejections(): ReefDeliveryRejection[];
  reserveOutboundRejectionNotice(peer: string, id: string, recipient: ReefPeerIdentity, state: ReefRejectionNoticeState): {
    kind: "reserved";
  } | {
    kind: "existing";
    state: ReefRejectionNoticeState;
  };
  completeOutboundRejection(peer: string, id: string, state: ReefRejectionNoticeState): boolean;
  rejectionNoticeState(peer: string): ReefRejectionNoticeState | undefined;
}
//#endregion
//#region extensions/reef/src/friends.d.ts
type PairingChallenge = (params: {
  peer: string;
  fingerprint: string;
  code: string;
  approvalToken: string;
}) => Promise<void>;
type ReefPairingApprovals = {
  list(): Promise<string[]>;
  remove(peer: string): Promise<boolean>;
};
type ListedReefFriend = RelayFriend & {
  fingerprint: string;
  autonomy?: ReefAutonomy;
};
declare class ReefFriendManager {
  #private;
  readonly transport: ReefTransportClient;
  readonly trust: ReefTrustStore;
  readonly pairing: ReefPairingApprovals;
  private readonly authoritySignal?;
  constructor(transport: ReefTransportClient, trust: ReefTrustStore, pairing: ReefPairingApprovals, authoritySignal?: AbortSignal | undefined);
  mintCode(assertOwnerCurrent?: () => void): Promise<{
    code: string;
    expires: number;
  }>;
  request(peer: string, code?: string, assertOwnerCurrent?: () => void): Promise<{
    status: string;
  }>;
  remove(peer: string, assertOwnerCurrent?: () => void): Promise<void>;
  setAutonomy(peer: string, autonomy: ReefAutonomy, assertOwnerCurrent?: () => void): Promise<void>;
  list(): Promise<ListedReefFriend[]>;
  surfacePairingCandidates(issue: PairingChallenge, lifecycleSignal?: AbortSignal): Promise<void>;
  reconcile(lifecycleSignal?: AbortSignal): Promise<string[]>;
}
//#endregion
//#region extensions/reef/src/state.d.ts
declare class ReviewApprovalStore {
  #private;
  private readonly authoritySignal?;
  constructor(runtime: PluginRuntime, maxEntries?: number, authoritySignal?: AbortSignal | undefined);
  request(review: ReviewRequest): Promise<ReviewApproval | undefined>;
  lookupDecision(approvalDigest: string): Promise<"none" | "pending" | {
    approved: boolean;
  }>;
  decide(digest: string, approved: boolean, assertOwnerCurrent?: () => void): Promise<ReviewRequest | undefined>;
  list(): Promise<ReviewRequest[]>;
}
declare class ReefDeliveredStore {
  #private;
  constructor(runtime: PluginRuntime, maxEntries?: number);
  has(id: string): Promise<boolean>;
  status(id: string): Promise<"delivered" | undefined>;
  confirm(id: string): Promise<void>;
  add(id: string): Promise<void>;
}
//#endregion
//#region extensions/reef/src/flow.d.ts
declare class ReefMessageFlow {
  readonly options: {
    config: ReefChannelConfig;
    trust: ReefTrustStore;
    keys: ReefKeys;
    transport: ReefTransportClient;
    guard: GuardAdapter;
    audit: AuditStore;
    replay: ReplayStore;
    reviews: ReviewApprovalStore;
    delivered: ReefDeliveredStore;
    authoritySignal?: AbortSignal;
    onIngress: (message: ReefIngressMessage) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  };
  private legacyDeliveryIndex?;
  private readonly parkedReadIds;
  constructor(options: {
    config: ReefChannelConfig;
    trust: ReefTrustStore;
    keys: ReefKeys;
    transport: ReefTransportClient;
    guard: GuardAdapter;
    audit: AuditStore;
    replay: ReplayStore;
    reviews: ReviewApprovalStore;
    delivered: ReefDeliveredStore;
    authoritySignal?: AbortSignal;
    onIngress: (message: ReefIngressMessage) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  });
  send(peer: string, text: string, context?: {
    thread?: string;
    replyTo?: string;
    expectedRecipient?: ReefPeerIdentity;
    resendDisabled?: true;
    messageId?: string;
    onPlatformSendDispatch?: () => Promise<void>;
  }): Promise<string>;
  processEntries(entries: InboxEntry[]): Promise<ReefDeliveryRejection[]>;
  private processReceipt;
  private recoverLegacyDelivery;
  private loadLegacyDeliveryIndex;
  private forgetLegacyCandidate;
  private quarantineReceipt;
  private processEnvelope;
  private requireHandle;
  private requireGuardConfig;
  private guardPolicyVersion;
}
//#endregion
export { ReefProtocolCompatibilityError as a, InboxEntry as c, ReefIngressMessage as d, ReefKeys as f, GuardAdapter as h, ReefInboxConnection as i, ReefAccount as l, ReefChannelConfig as m, ReviewApprovalStore as n, ReefTransportClient as o, RelayFriend as p, ReefFriendManager as r, WebSocketLike as s, ReefMessageFlow as t, ReefDependencies as u };