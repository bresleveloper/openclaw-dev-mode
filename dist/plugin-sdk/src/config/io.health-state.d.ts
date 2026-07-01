export type ConfigHealthFingerprint = {
    hash: string;
    bytes: number;
    mtimeMs: number | null;
    ctimeMs: number | null;
    dev: string | null;
    ino: string | null;
    mode: number | null;
    nlink: number | null;
    uid: number | null;
    gid: number | null;
    hasMeta: boolean;
    gatewayMode: string | null;
    observedAt: string;
};
export type ConfigHealthEntry = {
    lastKnownGood?: ConfigHealthFingerprint;
    lastPromotedGood?: ConfigHealthFingerprint;
    lastObservedSuspiciousSignature?: string | null;
};
export type ConfigHealthState = {
    entries?: Record<string, ConfigHealthEntry>;
};
export type ConfigHealthStateDeps = {
    env: NodeJS.ProcessEnv;
    homedir: () => string;
    logger: Pick<typeof console, "warn">;
};
export declare function readConfigHealthStateFromStore(deps: ConfigHealthStateDeps): ConfigHealthState;
export declare function writeConfigHealthStateToStore(deps: ConfigHealthStateDeps, state: ConfigHealthState): void;
