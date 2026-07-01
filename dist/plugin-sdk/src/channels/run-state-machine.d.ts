type RunStateStatusPatch = {
    busy?: boolean;
    activeRuns?: number;
    lastRunActivityAt?: number | null;
};
/** Status sink used by channel run-state updates. */
export type RunStateStatusSink = (patch: RunStateStatusPatch) => void;
type RunStateMachineParams = {
    setStatus?: RunStateStatusSink;
    abortSignal?: AbortSignal;
    heartbeatMs?: number;
    now?: () => number;
};
/** Creates a channel run-state tracker with heartbeat updates while runs are active. */
export declare function createRunStateMachine(params: RunStateMachineParams): {
    isActive(): boolean;
    onRunStart(): void;
    onRunEnd(): void;
    deactivate: () => void;
};
export {};
