import { Eo as ChannelIngressDispatchLifecycle, No as ChannelIngressQueueRecord, Oo as ChannelIngressQueue, ko as ChannelIngressQueueClaim, xo as CreateChannelIngressDrainOptions } from "./agent-harness-runtime-CWL0fcg5.js";
//#region src/channels/message/ingress-monitor-types.d.ts
/** Stable identity and serialization lane extracted before durable admission. */
type ChannelIngressMonitorFacts = {
  eventId: string;
  laneKey: string;
};
/** Versioned body presented to a channel's persisted-payload encoder. */
type ChannelIngressPayloadEnvelope<TBody> = {
  version: number;
  body: TBody;
};
/** Claim ownership lifecycle handed to one channel delivery. */
type ChannelIngressMonitorLifecycle = ChannelIngressDispatchLifecycle & {
  admission: "exclusive";
};
/** Optional explicit outcome from a channel delivery. */
type ChannelIngressMonitorDeliveryResult = {
  kind: "completed";
} | {
  kind: "deferred";
} | {
  kind: "failed-retryable";
  error: unknown;
};
type ChannelIngressMonitorInspectionContext = {
  phase: "admission";
} | {
  phase: "claim";
  claimedId: string;
  claimedLaneKey: string | undefined;
};
type ChannelIngressMonitorRetention = {
  pruneIntervalMs: number;
  pendingTtlMs?: number;
  pendingMaxEntries?: number;
  completedTtlMs?: number;
  completedMaxEntries?: number;
  failedTtlMs?: number;
  failedMaxEntries?: number;
};
type ChannelIngressMonitorClaimErrorKind = "invalid-version" | "identity-mismatch";
type ChannelIngressMonitorPayloadCodec<TRaw, TBody, TStoredPayload, TMetadata> = {
  version: number;
  serialize: (raw: TRaw, context: {
    facts: ChannelIngressMonitorFacts;
    receivedAt: number;
  }) => TBody;
  deserialize: (body: TBody, context: {
    claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
  }) => TRaw;
  createClaimError: (kind: ChannelIngressMonitorClaimErrorKind, claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>) => Error;
} & ((TBody extends string ? {
  storage: "raw-event";
} : never) | {
  storage?: "custom";
  encode: (envelope: ChannelIngressPayloadEnvelope<TBody>) => TStoredPayload;
  decode: (payload: TStoredPayload, context: {
    claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
  }) => {
    version: unknown;
    body: TBody;
  };
});
type ChannelIngressMonitorDrainOptions<TStoredPayload, TMetadata> = Omit<CreateChannelIngressDrainOptions<TStoredPayload, TMetadata>, "queue" | "dispatchClaimedEvent" | "abortSignal" | "now" | "ownerId" | "claimLeaseMs">;
type CreateChannelIngressMonitorOptions<TRaw, TBody, TStoredPayload, TMetadata> = {
  queue: ChannelIngressQueue<TStoredPayload, TMetadata> | (() => ChannelIngressQueue<TStoredPayload, TMetadata>);
  inspect: (raw: TRaw, context: ChannelIngressMonitorInspectionContext) => ChannelIngressMonitorFacts | null;
  /** Preferred over inspect when the host supports asynchronous inspection. */
  inspectAsync?: (raw: TRaw, context: ChannelIngressMonitorInspectionContext) => Promise<ChannelIngressMonitorFacts | null>;
  payload: ChannelIngressMonitorPayloadCodec<TRaw, TBody, TStoredPayload, TMetadata>;
  deliver: (raw: TRaw, lifecycle: ChannelIngressMonitorLifecycle, claim: ChannelIngressQueueClaim<TStoredPayload, TMetadata>) => Promise<ChannelIngressMonitorDeliveryResult | void> | ChannelIngressMonitorDeliveryResult | void;
  pollIntervalMs: number;
  retention: "standard" | Partial<ChannelIngressMonitorRetention>;
  appendRetryDelaysMs?: readonly number[];
  /**
   * Runs after every durable enqueue. `isNew` means this admission inserted the queue
   * row; a pruned event can become new again. It does not imply claim or delivery.
   */
  onDurableAdmission?: (raw: TRaw, context: {
    facts: ChannelIngressMonitorFacts;
    receivedAt: number;
    isNew: boolean;
  }) => void | Promise<void>;
  onAdmissionFailure?: (raw: TRaw, error: unknown) => void | Promise<void>;
  /** False lets repeated requests fill drain capacity while earlier claims remain active. */
  waitForDeliveryIdleBeforeRepump?: boolean;
  /** Runs each pump under a channel-owned async context such as a detached request root. */
  runPumpTask?: (work: () => Promise<void>) => Promise<void>;
  /** False lets a channel apply its own bounded delivery grace before final disposal. */
  waitForDeliveryIdleOnStop?: boolean;
  /** Tracks deferred reply ownership through stop, abort, or an explicit channel-owned wait. */
  deferredClaims?: "wait-on-stop" | "settle-on-abort" | "manual";
  drain?: ChannelIngressMonitorDrainOptions<TStoredPayload, TMetadata>;
  abortSignal?: AbortSignal;
  now?: () => number;
  onError?: (error: unknown) => void;
  onActivityChange?: (active: boolean) => void;
  createStoppedError?: () => Error;
  /** Durable-after-stop preserves append-only admission for handlers selected before unregister. */
  admissionMode?: "until-stopped" | "while-running" | "durable-after-stop";
};
//#endregion
//#region src/channels/message/ingress-monitor.d.ts
/** Replay-guard retention defaults; changing a value requires a per-channel keyspace audit. */
declare const CHANNEL_INGRESS_RETENTION_DEFAULTS: Readonly<{
  pruneIntervalMs: number;
  completedTtlMs: number;
  completedMaxEntries: number;
  failedTtlMs: number;
  failedMaxEntries: number;
}>;
/**
 * Creates the shared monitor around a durable queue and ingress drain.
 * Channel code keeps transport inspection, payload shape, and delivery policy.
 */
declare function createChannelIngressMonitor<TRaw, TBody, TStoredPayload, TMetadata = unknown>(options: CreateChannelIngressMonitorOptions<TRaw, TBody, TStoredPayload, TMetadata>): {
  admit: (raw: TRaw, admitOptions?: {
    receivedAt?: number;
    facts?: ChannelIngressMonitorFacts;
  }) => Promise<{
    readonly kind: "ignored";
    readonly queueResult?: undefined;
  } | {
    readonly kind: "durable";
    readonly queueResult: {
      kind: "accepted";
      duplicate: false;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "pending";
      duplicate: true;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "claimed";
      duplicate: true;
      record: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
    } | {
      kind: "completed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        completedAt: number;
        metadata?: unknown;
      };
    } | {
      kind: "failed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        failedAt: number;
        reason: string;
        message?: string;
      };
    };
  }>;
  admitBatch: (rawEvents: readonly TRaw[], admitOptions?: {
    receivedAt?: number;
  }) => Promise<({
    readonly kind: "ignored";
    readonly queueResult?: undefined;
  } | {
    readonly kind: "durable";
    readonly queueResult: {
      kind: "accepted";
      duplicate: false;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "pending";
      duplicate: true;
      record: ChannelIngressQueueRecord<TStoredPayload, TMetadata>;
    } | {
      kind: "claimed";
      duplicate: true;
      record: ChannelIngressQueueClaim<TStoredPayload, TMetadata>;
    } | {
      kind: "completed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        completedAt: number;
        metadata?: unknown;
      };
    } | {
      kind: "failed";
      duplicate: true;
      record: {
        id: string;
        channelId: string;
        accountId: string;
        queueName: string;
        failedAt: number;
        reason: string;
        message?: string;
      };
    };
  })[]>;
  start: () => void;
  ensureQueueAvailable: () => void;
  requestDrain: () => void;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  waitForIdle: () => Promise<void>;
  waitForDeferredClaims: () => Promise<void>;
  waitForPumpIdle: () => Promise<void>;
  isRunning: () => boolean;
  isStopped: () => boolean;
};
//#endregion
export { ChannelIngressMonitorFacts as a, CreateChannelIngressMonitorOptions as c, ChannelIngressMonitorDrainOptions as i, createChannelIngressMonitor as n, ChannelIngressMonitorLifecycle as o, ChannelIngressMonitorDeliveryResult as r, ChannelIngressMonitorPayloadCodec as s, CHANNEL_INGRESS_RETENTION_DEFAULTS as t };