type VoiceWakeRouteTarget = {
    mode: "current";
    agentId?: undefined;
    sessionKey?: undefined;
} | {
    agentId: string;
    sessionKey?: undefined;
    mode?: undefined;
} | {
    sessionKey: string;
    agentId?: undefined;
    mode?: undefined;
};
type VoiceWakeRouteRule = {
    trigger: string;
    target: VoiceWakeRouteTarget;
};
export type VoiceWakeRoutingConfig = {
    version: 1;
    defaultTarget: VoiceWakeRouteTarget;
    routes: VoiceWakeRouteRule[];
    updatedAtMs: number;
};
/** Normalize a voice wake trigger phrase for matching and duplicate checks. */
export declare function normalizeVoiceWakeTriggerWord(value: string): string;
/** Validate user-provided voice wake routing config before persistence. */
export declare function validateVoiceWakeRoutingConfigInput(input: unknown): {
    ok: true;
} | {
    ok: false;
    message: string;
};
/** Normalize persisted or user-provided voice wake routing config. */
export declare function normalizeVoiceWakeRoutingConfig(input: unknown): VoiceWakeRoutingConfig;
/** Load persisted voice wake routing config from state. */
export declare function loadVoiceWakeRoutingConfig(baseDir?: string): Promise<VoiceWakeRoutingConfig>;
/** Persist normalized voice wake routing config. */
export declare function setVoiceWakeRoutingConfig(config: unknown, baseDir?: string): Promise<VoiceWakeRoutingConfig>;
type VoiceWakeResolvedRoute = {
    mode: "current";
} | {
    agentId: string;
} | {
    sessionKey: string;
};
/** Resolve the route target for a normalized wake trigger. */
export declare function resolveVoiceWakeRouteByTrigger(params: {
    trigger: string | undefined;
    config: VoiceWakeRoutingConfig;
}): VoiceWakeResolvedRoute;
export {};
