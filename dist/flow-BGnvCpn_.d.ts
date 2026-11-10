import { Bb as PluginStateKeyedStore, Fb as PluginStateCompareIntent, Gb as PluginStateOperationReceipt, Hb as PluginStateObservation, Ib as PluginStateCompareResult, Lb as PluginStateComparisonCondition, Mg as PluginRuntime, Rb as PluginStateEntry, Ub as PluginStateOperation, Vb as PluginStateMoveEntries, Wb as PluginStateOperationDefinitions, mA as PluginStateStoreError, zb as PluginStateKeyRange } from "./config-contracts-CY87ANNp.js";
import { t as Result } from "./result-VHVNeWs6.js";
import "./plugin-state-runtime-cWC3lBJR.js";
import { z } from "zod";
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
//#region extensions/reef/protocol/identity.d.ts
interface SigningKeyPair {
  publicKey: string;
  secretKey: string;
}
interface EncryptionKeyPair {
  publicKey: string;
  secretKey: string;
}
interface IdentityKeyPair {
  signing: SigningKeyPair;
  encryption: EncryptionKeyPair;
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
interface ReefKeys extends IdentityKeyPair {
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
interface ReefRejectionRecovery {
  assertCurrent(): void;
  loadState(): Promise<ReefRejectionNoticeState | undefined>;
  reserve(state: ReefRejectionNoticeState): Promise<{
    kind: "reserved";
  } | {
    kind: "existing";
    state: ReefRejectionNoticeState;
  }>;
  complete(state: ReefRejectionNoticeState): Promise<boolean>;
}
interface ReefDeliveryRejection {
  /** Runtime-only continuation bound to the source that produced this rejection. */
  recovery: ReefRejectionRecovery;
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
  sendEnvelope(peer: string, envelope: Envelope, signal?: AbortSignal, assertCurrent?: () => void): Promise<{
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
  signed<T>(method: string, path: string, body?: unknown, signal?: AbortSignal, secrets?: readonly string[], assertCurrent?: () => void): Promise<T>;
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
//#region extensions/reef/src/trust-store-format.d.ts
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
type ReefOutboundDelivery = z.infer<typeof ReefOutboundDeliverySchema>;
type ReefDeliverySettlement = {
  readonly delivery: ReefOutboundDelivery;
  readonly recovery: ReefRejectionRecovery;
  currentPeer(): Promise<ReefPeerTrust | undefined>;
  assertCurrent(): void;
  consume(): Promise<"consumed" | "unavailable" | "rejected">;
  discard(): Promise<boolean>;
  reject(category?: string): Promise<ReefOutboundDelivery["rejection"]>;
};
type ReefOutboundRequestStatus = "current" | "superseded" | "revoked";
type ReefRequestSettlement = {
  readonly requestId: string;
  status(): Promise<ReefOutboundRequestStatus>;
  remove(): Promise<void>;
  close(): void;
};
//#endregion
//#region extensions/reef/src/trust-store-authority.d.ts
type ReefTrustOperationState = {
  peers: PluginStateKeyedStore<ReefPeerStateSnapshot, 2>;
  deliveries: PluginStateKeyedStore<ReefOutboundDelivery, 2>;
  identityScope: string;
  assertCurrent(): void;
};
//#endregion
//#region extensions/reef/src/trust-store.d.ts
declare function openStores(openStore: PluginRuntime["state"]["openKeyedStoreV2"]): {
  peers: Required<Omit<{
    createOperation?: <Operations extends PluginStateOperationDefinitions>(stores: readonly Pick<PluginStateKeyedStore<unknown>, "lookup" | "entries">[], handler: {
      moduleName: string;
      exportName: string;
    }, authority?: {
      assertCurrent(): void;
      sourceReceipt?: PluginStateOperationReceipt<unknown>;
    }) => PluginStateOperation<Operations>;
    observe?: ((key: string) => Promise<PluginStateObservation<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>>) | undefined;
    compareAndApply?: ((key: string, comparison: string, intent: PluginStateCompareIntent<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>, options?: {
      conditions: readonly PluginStateComparisonCondition[];
    }) => Promise<PluginStateCompareResult<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>>) | undefined;
    register(key: string, value: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }, opts?: {
      ttlMs?: number;
      assertCurrent?: () => void;
    }): Promise<void>;
    registerIfAbsent(key: string, value: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }, opts?: {
      ttlMs?: number;
    }): Promise<boolean>;
    update?: ((key: string, updateValue: (current: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined) => {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined, opts?: {
      ttlMs?: number;
    }) => Promise<boolean>) | undefined;
    deleteIf?: ((key: string, predicate: (current: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }) => boolean) => Promise<boolean>) | undefined;
    deleteIfEqual?: (key: string, expected: string | number | boolean | null) => Promise<boolean>;
    lookup(key: string): Promise<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined>;
    lookupMany?: ((keys: readonly string[]) => Promise<Result<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined, PluginStateStoreError>[]>) | undefined;
    consume(key: string): Promise<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined>;
    delete(key: string, opts?: {
      assertCurrent?: () => void;
      signal?: AbortSignal;
    }): Promise<boolean>;
    entries(): Promise<PluginStateEntry<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>[]>;
    entriesInKeyRange?: ((range: PluginStateKeyRange) => Promise<PluginStateEntry<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>[]>) | undefined;
    moveEntriesFrom?: (source: PluginStateMoveEntries) => Promise<number>;
    count?: () => Promise<number>;
    clear(): Promise<void>;
  }, "createOperation" | "deleteIf" | "update">> & Pick<{
    createOperation?: <Operations extends PluginStateOperationDefinitions>(stores: readonly Pick<PluginStateKeyedStore<unknown>, "lookup" | "entries">[], handler: {
      moduleName: string;
      exportName: string;
    }, authority?: {
      assertCurrent(): void;
      sourceReceipt?: PluginStateOperationReceipt<unknown>;
    }) => PluginStateOperation<Operations>;
    observe?: ((key: string) => Promise<PluginStateObservation<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>>) | undefined;
    compareAndApply?: ((key: string, comparison: string, intent: PluginStateCompareIntent<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>, options?: {
      conditions: readonly PluginStateComparisonCondition[];
    }) => Promise<PluginStateCompareResult<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>>) | undefined;
    register(key: string, value: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }, opts?: {
      ttlMs?: number;
      assertCurrent?: () => void;
    }): Promise<void>;
    registerIfAbsent(key: string, value: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }, opts?: {
      ttlMs?: number;
    }): Promise<boolean>;
    update?: ((key: string, updateValue: (current: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined) => {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined, opts?: {
      ttlMs?: number;
    }) => Promise<boolean>) | undefined;
    deleteIf?: ((key: string, predicate: (current: {
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }) => boolean) => Promise<boolean>) | undefined;
    deleteIfEqual?: (key: string, expected: string | number | boolean | null) => Promise<boolean>;
    lookup(key: string): Promise<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined>;
    lookupMany?: ((keys: readonly string[]) => Promise<Result<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined, PluginStateStoreError>[]>) | undefined;
    consume(key: string): Promise<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    } | undefined>;
    delete(key: string, opts?: {
      assertCurrent?: () => void;
      signal?: AbortSignal;
    }): Promise<boolean>;
    entries(): Promise<PluginStateEntry<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>[]>;
    entriesInKeyRange?: ((range: PluginStateKeyRange) => Promise<PluginStateEntry<{
      revision: number;
      trust?: {
        autonomy: "bounded" | "extended" | "notify-only";
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
        safetyNumberChanged: boolean;
        approvedAt: number;
      } | undefined;
      outboundRequests?: Record<string, number> | undefined;
      rejectionNotice?: {
        lastRejectionAt: number;
        lastResendAt?: number | undefined;
      } | undefined;
    }>[]>) | undefined;
    moveEntriesFrom?: (source: PluginStateMoveEntries) => Promise<number>;
    count?: () => Promise<number>;
    clear(): Promise<void>;
  }, "createOperation">;
  deliveries: Required<Omit<{
    createOperation?: <Operations extends PluginStateOperationDefinitions>(stores: readonly Pick<PluginStateKeyedStore<unknown>, "lookup" | "entries">[], handler: {
      moduleName: string;
      exportName: string;
    }, authority?: {
      assertCurrent(): void;
      sourceReceipt?: PluginStateOperationReceipt<unknown>;
    }) => PluginStateOperation<Operations>;
    observe?: ((key: string) => Promise<PluginStateObservation<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>>) | undefined;
    compareAndApply?: ((key: string, comparison: string, intent: PluginStateCompareIntent<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>, options?: {
      conditions: readonly PluginStateComparisonCondition[];
    }) => Promise<PluginStateCompareResult<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>>) | undefined;
    register(key: string, value: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }, opts?: {
      ttlMs?: number;
      assertCurrent?: () => void;
    }): Promise<void>;
    registerIfAbsent(key: string, value: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }, opts?: {
      ttlMs?: number;
    }): Promise<boolean>;
    update?: ((key: string, updateValue: (current: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined) => {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined, opts?: {
      ttlMs?: number;
    }) => Promise<boolean>) | undefined;
    deleteIf?: ((key: string, predicate: (current: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }) => boolean) => Promise<boolean>) | undefined;
    deleteIfEqual?: (key: string, expected: string | number | boolean | null) => Promise<boolean>;
    lookup(key: string): Promise<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined>;
    lookupMany?: ((keys: readonly string[]) => Promise<Result<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined, PluginStateStoreError>[]>) | undefined;
    consume(key: string): Promise<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined>;
    delete(key: string, opts?: {
      assertCurrent?: () => void;
      signal?: AbortSignal;
    }): Promise<boolean>;
    entries(): Promise<PluginStateEntry<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>[]>;
    entriesInKeyRange?: ((range: PluginStateKeyRange) => Promise<PluginStateEntry<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>[]>) | undefined;
    moveEntriesFrom?: (source: PluginStateMoveEntries) => Promise<number>;
    count?: () => Promise<number>;
    clear(): Promise<void>;
  }, "createOperation" | "deleteIf" | "update">> & Pick<{
    createOperation?: <Operations extends PluginStateOperationDefinitions>(stores: readonly Pick<PluginStateKeyedStore<unknown>, "lookup" | "entries">[], handler: {
      moduleName: string;
      exportName: string;
    }, authority?: {
      assertCurrent(): void;
      sourceReceipt?: PluginStateOperationReceipt<unknown>;
    }) => PluginStateOperation<Operations>;
    observe?: ((key: string) => Promise<PluginStateObservation<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>>) | undefined;
    compareAndApply?: ((key: string, comparison: string, intent: PluginStateCompareIntent<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>, options?: {
      conditions: readonly PluginStateComparisonCondition[];
    }) => Promise<PluginStateCompareResult<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>>) | undefined;
    register(key: string, value: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }, opts?: {
      ttlMs?: number;
      assertCurrent?: () => void;
    }): Promise<void>;
    registerIfAbsent(key: string, value: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }, opts?: {
      ttlMs?: number;
    }): Promise<boolean>;
    update?: ((key: string, updateValue: (current: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined) => {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined, opts?: {
      ttlMs?: number;
    }) => Promise<boolean>) | undefined;
    deleteIf?: ((key: string, predicate: (current: {
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }) => boolean) => Promise<boolean>) | undefined;
    deleteIfEqual?: (key: string, expected: string | number | boolean | null) => Promise<boolean>;
    lookup(key: string): Promise<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined>;
    lookupMany?: ((keys: readonly string[]) => Promise<Result<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined, PluginStateStoreError>[]>) | undefined;
    consume(key: string): Promise<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    } | undefined>;
    delete(key: string, opts?: {
      assertCurrent?: () => void;
      signal?: AbortSignal;
    }): Promise<boolean>;
    entries(): Promise<PluginStateEntry<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>[]>;
    entriesInKeyRange?: ((range: PluginStateKeyRange) => Promise<PluginStateEntry<{
      bodyHash: string;
      textHash?: string | undefined;
      recipient: {
        ed25519PublicKey: string;
        x25519PublicKey: string;
        keyEpoch: number;
      };
      resendDisabled?: true | undefined;
      rejection?: {
        category?: string | undefined;
        notice?: {
          lastRejectionAt: number;
          lastResendAt?: number | undefined;
        } | undefined;
      } | undefined;
      sentAt?: number | undefined;
      overdueNotifiedAt?: number | undefined;
    }>[]>) | undefined;
    moveEntriesFrom?: (source: PluginStateMoveEntries) => Promise<number>;
    count?: () => Promise<number>;
    clear(): Promise<void>;
  }, "createOperation">;
};
declare class ReefTrustStore {
  #private;
  readonly operationState: ReefTrustOperationState;
  constructor(stores: ReturnType<typeof openStores>, config: ReefChannelConfig, assertActive?: () => void);
  snapshot(peer: string): Promise<ReefPeerStateSnapshot>;
  get(peer: string): Promise<{
    autonomy: "bounded" | "extended" | "notify-only";
    ed25519PublicKey: string;
    x25519PublicKey: string;
    keyEpoch: number;
    safetyNumberChanged: boolean;
    approvedAt: number;
  } | undefined>;
  observePeer(peer: string): Promise<{
    trust: {
      autonomy: "bounded" | "extended" | "notify-only";
      ed25519PublicKey: string;
      x25519PublicKey: string;
      keyEpoch: number;
      safetyNumberChanged: boolean;
      approvedAt: number;
    };
    assertCurrent: () => void;
  } | undefined>;
  list(): Promise<{
    peer: string;
    trust: ReefPeerTrust;
  }[]>;
  set(peer: string, trust: ReefPeerTrust): Promise<void>;
  remove(peer: string, assertOwnerCurrent?: () => void): Promise<boolean>;
  beginRemoval(peer: string, assertOwnerCurrent?: () => void): Promise<() => Promise<void>>;
  setAutonomy(peer: string, autonomy: ReefAutonomy, assertOwnerCurrent?: () => void): Promise<void>;
  markSafetyNumberChanged(peer: string, expectedRevision: number): Promise<boolean>;
  commitPeerTrust(friend: RelayFriend, options: {
    expectedRevision: number;
    expectedOutboundRequestId?: string;
  }, approvedAt?: number): Promise<boolean>;
  createPairingApproval(friend: RelayFriend, trustRevision: number): string;
  parsePairingApproval(raw: string): {
    peer: string;
    keyEpoch: number;
    trustRevision: number;
  } | undefined;
  matchesPairingApproval(raw: string, friend: RelayFriend): Promise<boolean>;
  beginRequest(peer: string, requestedAt?: number, assertOwnerCurrent?: () => void): Promise<ReefRequestSettlement>;
  hasOutboundRequest(peer: string): Promise<boolean>;
  removeOutboundRequest(peer: string, requestId?: string): Promise<boolean>;
  overdueOutboundDeliveries(olderThanMs: number, now?: number): Promise<{
    peer: string;
    id: string;
    sentAt: number;
  }[]>;
  markOutboundDeliveryOverdueNotified(peer: string, id: string): Promise<boolean>;
  readOutboundDelivery(peer: string, id: string): Promise<ReefDeliverySettlement | undefined>;
  pendingOutboundRejections(): Promise<ReefDeliveryRejection[]>;
  rejectionNoticeState(peer: string): Promise<ReefRejectionNoticeState | undefined>;
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
  status(id: string): Promise<"delivered" | undefined>;
  confirm(id: string): Promise<void>;
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
    onIngress: (message: ReefIngressMessage, assertCurrent: () => void) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  };
  private readonly parkedReadIds;
  private readonly pendingOutbound;
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
    onIngress: (message: ReefIngressMessage, assertCurrent: () => void) => Promise<void>;
    onOwnerNotice: (text: string) => Promise<void>;
  });
  send(peerInput: string, text: string, context?: {
    thread?: string;
    replyTo?: string;
    expectedRecipient?: ReefPeerIdentity;
    resendDisabled?: true;
    messageId?: string;
    onPlatformSendDispatch?: () => Promise<void>;
    recovery?: ReefRejectionRecovery;
  }): Promise<string>;
  processEntries(entries: InboxEntry[]): Promise<ReefDeliveryRejection[]>;
  private processReceipt;
  private quarantineReceipt;
  private processEnvelope;
  private requireHandle;
  private guardPolicyVersion;
}
//#endregion
export { ReefTransportClient as a, ReefAccount as c, ReefKeys as d, RelayFriend as f, ReefProtocolCompatibilityError as i, ReefDependencies as l, GuardAdapter as m, ReefFriendManager as n, WebSocketLike as o, ReefChannelConfig as p, ReefInboxConnection as r, InboxEntry as s, ReefMessageFlow as t, ReefIngressMessage as u };