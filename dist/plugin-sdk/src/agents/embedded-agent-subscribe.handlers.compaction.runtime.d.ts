/** Persist the highest observed compaction count after a successful subscribed run. */
export default function reconcileSessionStoreCompactionCountAfterSuccess(params: {
    sessionKey?: string;
    agentId?: string;
    configStore?: string;
    observedCompactionCount: number;
    now?: number;
}): Promise<number | undefined>;
