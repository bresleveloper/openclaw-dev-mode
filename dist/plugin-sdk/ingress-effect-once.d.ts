//#region src/plugin-sdk/ingress-effect-once.d.ts
/**
 * Create a durable per-event side-effect guard for channel ingress drains.
 *
 * Create one factory per ingress queue/account scope and give that scope a stable, unique
 * `namespacePrefix`; `eventId` only needs to be unique within that queue. Storage failures
 * reject instead of falling back to process memory.
 *
 * `ttlMs` must cover the maximum effect-commit-to-tombstone delay plus the channel's
 * ingress tombstone retention. Older records are dead weight once the tombstone prevents
 * replay. A process death after `run()` succeeds but before the claim commits can still
 * execute the effect again on recovery, as can a storage failure during that commit.
 */
export declare function createIngressEffectOnce(params: {
  pluginId: string;
  namespacePrefix: string;
  ttlMs: number;
  stateMaxEntries: number;
  memoryMaxSize?: number;
  onDiskError?: (error: unknown) => void;
}): {
  runOnce: <T>(params: {
    eventId: string;
    effect: string;
    run: () => Promise<T>;
  }) => Promise<{
    kind: "executed";
    value: T;
  } | {
    kind: "replayed";
  }>;
};
//#endregion