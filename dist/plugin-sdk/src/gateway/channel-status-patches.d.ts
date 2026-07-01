/** Patch emitted when a channel connection is established. */
export type ConnectedChannelStatusPatch = {
    connected: true;
    lastConnectedAt: number;
    lastEventAt: number;
};
/** Patch emitted when a channel transport reports activity without reconnecting. */
export type TransportActivityChannelStatusPatch = {
    lastTransportActivityAt: number;
};
/** Creates a connected-channel status patch with matching connection/event timestamps. */
export declare function createConnectedChannelStatusPatch(at?: number): ConnectedChannelStatusPatch;
/** Creates a transport-activity patch for health/activity monitors. */
export declare function createTransportActivityStatusPatch(at?: number): TransportActivityChannelStatusPatch;
