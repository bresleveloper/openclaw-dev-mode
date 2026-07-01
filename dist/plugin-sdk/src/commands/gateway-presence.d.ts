type GatewaySelfPresence = {
    host?: string;
    ip?: string;
    version?: string;
    platform?: string;
    deviceId?: string;
    instanceId?: string;
};
/** Picks host, ip, version, and platform from the gateway self presence record. */
export declare function pickGatewaySelfPresence(presence: unknown): GatewaySelfPresence | null;
export {};
